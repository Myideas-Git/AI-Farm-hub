/**
 * AI Farm Hub — Durable Activity Storage Service
 * Manages persistent storage of farmer-created activity records separately from Demo records.
 * Provides safe storage error handling, corrupted-record recovery, quota detection,
 * and duplicate-submission prevention without leaking sensitive farmer data.
 */

import { FarmEvent, CorrectionHistoryItem } from '../types/farm';
import { INITIAL_DEMO_EVENTS } from '../data/mockFarmData';

const STORAGE_KEY_FARMER_RECORDS = 'farm_intel_farmer_records_v1';
const STORAGE_KEY_CORRUPT_BACKUP_PREFIX = 'farm_intel_corrupt_backup_';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  isDuplicate?: boolean;
  code?: 'QUOTA_EXCEEDED' | 'STORAGE_UNAVAILABLE' | 'NOT_FOUND' | 'CORRUPT_DATA' | 'DUPLICATE' | 'UNKNOWN';
}

export interface LoadResult<T> {
  success: boolean;
  data: T;
  isCorrupt?: boolean;
  error?: string;
}

export class ActivityStorageService {
  /**
   * Helper to verify if browser local storage is accessible and functional
   */
  public static isStorageAvailable(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Loads all active records: combination of immutable Demo records + persistent farmer records
   * If storage reading fails, reports error without silently masking it as an empty farm history.
   */
  public static loadAllRecords(): LoadResult<FarmEvent[]> {
    const farmerResult = this.loadFarmerRecords();
    if (!farmerResult.success) {
      // Return demo events but clearly indicate the read error so caller can alert the farmer
      return {
        success: false,
        data: INITIAL_DEMO_EVENTS,
        isCorrupt: farmerResult.isCorrupt,
        error: farmerResult.error,
      };
    }
    return {
      success: true,
      data: [...farmerResult.data, ...INITIAL_DEMO_EVENTS],
    };
  }

  /**
   * Loads only farmer-created records from localStorage.
   * Distinguishes a genuinely empty record list from a parse or storage failure.
   */
  public static loadFarmerRecords(): LoadResult<FarmEvent[]> {
    if (!this.isStorageAvailable()) {
      return {
        success: false,
        data: [],
        error: 'Browser local storage is disabled or unavailable.',
      };
    }

    try {
      const serialized = localStorage.getItem(STORAGE_KEY_FARMER_RECORDS);
      if (serialized === null) {
        // Genuine empty state: user has not recorded activities yet
        return {
          success: true,
          data: [],
        };
      }

      const parsed = JSON.parse(serialized);
      if (!Array.isArray(parsed)) {
        // Unexpected shape — backup raw string before falling back
        this.backupCorruptedData(serialized);
        return {
          success: false,
          data: [],
          isCorrupt: true,
          error: 'Stored activity records had an unexpected format. Preserved backup safely.',
        };
      }

      return {
        success: true,
        data: parsed,
      };
    } catch (err: any) {
      // JSON syntax error or storage read exception — do not silently overwrite
      const raw = localStorage.getItem(STORAGE_KEY_FARMER_RECORDS);
      if (raw) {
        this.backupCorruptedData(raw);
      }
      return {
        success: false,
        data: [],
        isCorrupt: true,
        error: 'Unable to parse stored activity history. Preserved existing data for recovery.',
      };
    }
  }

  /**
   * Preserves corrupted data to a quarantine key instead of discarding it
   */
  private static backupCorruptedData(raw: string): void {
    try {
      const backupKey = `${STORAGE_KEY_CORRUPT_BACKUP_PREFIX}${Date.now()}`;
      localStorage.setItem(backupKey, raw);
    } catch {
      // Storage might be completely full
    }
  }

  /**
   * Saves a new farmer-created record.
   * Validates input, prevents duplicate double-clicks, and handles quota failures.
   */
  public static saveRecord(
    record: FarmEvent,
    allowDuplicate: boolean = false
  ): StorageResult<FarmEvent> {
    if (!this.isStorageAvailable()) {
      return {
        success: false,
        code: 'STORAGE_UNAVAILABLE',
        error: 'Local storage is unavailable. Cannot save farm activity.',
      };
    }

    try {
      if (record.isDemo) {
        return {
          success: false,
          error: 'Demo records cannot be saved as new user entries.',
        };
      }

      const loadResult = this.loadFarmerRecords();
      // If reading existing records failed due to corruption, do NOT silently overwrite!
      if (!loadResult.success && loadResult.isCorrupt) {
        return {
          success: false,
          code: 'CORRUPT_DATA',
          error: 'Existing storage data is being recovered. Cannot overwrite unverified records.',
        };
      }

      const existingRecords = loadResult.data;

      // Duplicate detection: identical title, date, plot, and quantity recorded within 30 seconds
      const recordTime = new Date(record.createdAt || Date.now()).getTime();
      const isDuplicate = existingRecords.some((r) => {
        const existingTime = new Date(r.createdAt || 0).getTime();
        const timeDiff = Math.abs(recordTime - existingTime);
        return (
          r.title.trim().toLowerCase() === record.title.trim().toLowerCase() &&
          r.activityDate === record.activityDate &&
          r.plotId === record.plotId &&
          r.quantity === record.quantity &&
          timeDiff < 30000
        );
      });

      if (isDuplicate && !allowDuplicate) {
        return {
          success: false,
          isDuplicate: true,
          code: 'DUPLICATE',
          error: 'Potential duplicate record detected: an identical activity was recorded moments ago.',
        };
      }

      const updated = [record, ...existingRecords];
      localStorage.setItem(STORAGE_KEY_FARMER_RECORDS, JSON.stringify(updated));

      return {
        success: true,
        data: record,
      };
    } catch (err: any) {
      let code: StorageResult<FarmEvent>['code'] = 'UNKNOWN';
      let errorMsg = 'Failed to save record to browser storage.';

      if (err?.name === 'QuotaExceededError' || err?.code === 22 || err?.code === 1014) {
        code = 'QUOTA_EXCEEDED';
        errorMsg = 'Browser storage quota is full. Please free storage space on your device.';
      }

      return {
        success: false,
        code,
        error: errorMsg,
      };
    }
  }

  /**
   * Updates an existing farmer-created record, tracking changes in correction history.
   */
  public static updateRecord(
    eventId: string,
    updates: Partial<FarmEvent>,
    reason?: string
  ): StorageResult<FarmEvent> {
    if (!this.isStorageAvailable()) {
      return {
        success: false,
        code: 'STORAGE_UNAVAILABLE',
        error: 'Local storage is unavailable.',
      };
    }

    try {
      const loadResult = this.loadFarmerRecords();
      if (!loadResult.success) {
        return {
          success: false,
          error: loadResult.error || 'Failed to read records from storage.',
        };
      }

      const existingRecords = loadResult.data;
      const index = existingRecords.findIndex((r) => r.eventId === eventId);

      if (index === -1) {
        return {
          success: false,
          code: 'NOT_FOUND',
          error: 'Record not found in user storage. Demo records cannot be modified.',
        };
      }

      const target = existingRecords[index];
      const historyItems: CorrectionHistoryItem[] = [...(target.correctionHistory || [])];

      const now = new Date().toISOString();
      const trackedFields: (keyof FarmEvent)[] = [
        'title',
        'quantity',
        'unit',
        'areaCoveredAcres',
        'activityDate',
        'plotId',
        'plotName',
        'status',
        'fertilizerName',
        'description',
      ];

      trackedFields.forEach((field) => {
        if (updates[field] !== undefined && updates[field] !== target[field]) {
          historyItems.push({
            id: `corr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: now,
            field,
            oldValue: (target as any)[field],
            newValue: (updates as any)[field],
            reason: reason || 'Farmer edit',
          });
        }
      });

      const updatedRecord: FarmEvent = {
        ...target,
        ...updates,
        correctionHistory: historyItems,
        updatedAt: now,
      };

      existingRecords[index] = updatedRecord;
      localStorage.setItem(STORAGE_KEY_FARMER_RECORDS, JSON.stringify(existingRecords));

      return {
        success: true,
        data: updatedRecord,
      };
    } catch (err: any) {
      let code: StorageResult<FarmEvent>['code'] = 'UNKNOWN';
      if (err?.name === 'QuotaExceededError') {
        code = 'QUOTA_EXCEEDED';
      }
      return {
        success: false,
        code,
        error: 'Storage failure: Could not update the record.',
      };
    }
  }

  /**
   * Deletes a farmer-created record. Demo records cannot be deleted.
   */
  public static deleteRecord(eventId: string): StorageResult<boolean> {
    if (!this.isStorageAvailable()) {
      return {
        success: false,
        code: 'STORAGE_UNAVAILABLE',
        error: 'Local storage is unavailable.',
      };
    }

    try {
      const loadResult = this.loadFarmerRecords();
      if (!loadResult.success) {
        return {
          success: false,
          error: loadResult.error || 'Failed to read records.',
        };
      }

      const existingRecords = loadResult.data;
      const isTargetPresent = existingRecords.some((r) => r.eventId === eventId);

      if (!isTargetPresent) {
        return {
          success: false,
          code: 'NOT_FOUND',
          error: 'Record not found in user storage (Demo records cannot be deleted).',
        };
      }

      const filtered = existingRecords.filter((r) => r.eventId !== eventId);
      localStorage.setItem(STORAGE_KEY_FARMER_RECORDS, JSON.stringify(filtered));

      return {
        success: true,
        data: true,
      };
    } catch {
      return {
        success: false,
        error: 'Failed to delete record from storage.',
      };
    }
  }

  /**
   * Confirms a record explicitly by the farmer.
   * Strictly preserves the record's original capture source (e.g. ai_extracted, farmer_reported)
   * and does NOT artificially elevate verificationStatus (independent verification).
   */
  public static confirmRecord(eventId: string, confirmedBy: string): StorageResult<FarmEvent> {
    return this.updateRecord(
      eventId,
      {
        status: 'farmer_confirmed',
        confirmedBy,
        confirmedAt: new Date().toISOString(),
      },
      'Farmer explicit confirmation'
    );
  }

  /**
   * Clears farmer-created records after explicit user confirmation.
   * Returns a StorageResult distinguishing success and failure.
   */
  public static resetAllFarmerRecords(): StorageResult<boolean> {
    if (!this.isStorageAvailable()) {
      return {
        success: false,
        code: 'STORAGE_UNAVAILABLE',
        error: 'Storage unavailable; cannot reset records.',
      };
    }

    try {
      localStorage.removeItem(STORAGE_KEY_FARMER_RECORDS);
      return {
        success: true,
        data: true,
      };
    } catch {
      return {
        success: false,
        error: 'Failed to clear records from storage.',
      };
    }
  }
}
