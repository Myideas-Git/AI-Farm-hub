/**
 * AI Farm Hub — Durable Activity Storage Service
 * Manages persistent storage of farmer-created activity records separately from Demo records.
 */

import { FarmEvent, RecordStatus, EventSource, CorrectionHistoryItem } from '../types/farm';
import { INITIAL_DEMO_EVENTS } from '../data/mockFarmData';

const STORAGE_KEY_FARMER_RECORDS = 'farm_intel_farmer_records_v1';
const STORAGE_KEY_MIGRATION_FLAG = 'farm_intel_migrated_v05';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  isDuplicate?: boolean;
}

export class ActivityStorageService {
  /**
   * Loads all active records: combination of immutable Demo records + persistent farmer records
   */
  public static loadAllRecords(): FarmEvent[] {
    const farmerRecords = this.loadFarmerRecords();
    // Return farmer records first, followed by DEMO records
    return [...farmerRecords, ...INITIAL_DEMO_EVENTS];
  }

  /**
   * Loads only farmer-created records from localStorage
   */
  public static loadFarmerRecords(): FarmEvent[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY_FARMER_RECORDS);
      if (!serialized) {
        return [];
      }
      const parsed = JSON.parse(serialized);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (err) {
      console.error('Failed to load farmer records from localStorage:', err);
      return [];
    }
  }

  /**
   * Saves a new farmer-created record
   */
  public static saveRecord(record: FarmEvent, allowDuplicate: boolean = true): StorageResult<FarmEvent> {
    try {
      // Validation: DEMO records cannot be overwritten as new farmer entries
      if (record.isDemo) {
        return {
          success: false,
          error: 'Demo records cannot be modified as new farmer records.',
        };
      }

      const existingRecords = this.loadFarmerRecords();

      // Accidental duplicate detection (identical title, date, plot, quantity within 15 seconds)
      const isDuplicate = existingRecords.some(
        (r) =>
          r.title.trim().toLowerCase() === record.title.trim().toLowerCase() &&
          r.activityDate === record.activityDate &&
          r.plotId === record.plotId &&
          r.quantity === record.quantity &&
          Math.abs(new Date(r.createdAt).getTime() - new Date(record.createdAt).getTime()) < 15000
      );

      if (isDuplicate && !allowDuplicate) {
        return {
          success: false,
          isDuplicate: true,
          error: 'Potential duplicate record detected: an identical activity was recorded recently.',
        };
      }

      const updated = [record, ...existingRecords];
      localStorage.setItem(STORAGE_KEY_FARMER_RECORDS, JSON.stringify(updated));

      return {
        success: true,
        data: record,
      };
    } catch (err: any) {
      console.error('Storage error while saving record:', err);
      let errorMsg = 'Failed to save record to browser storage.';
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        errorMsg = 'Browser storage quota exceeded. Please free storage space.';
      }
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  /**
   * Updates an existing farmer-created record, preserving correction history
   */
  public static updateRecord(
    eventId: string,
    updates: Partial<FarmEvent>,
    reason?: string
  ): StorageResult<FarmEvent> {
    try {
      const existingRecords = this.loadFarmerRecords();
      const index = existingRecords.findIndex((r) => r.eventId === eventId);

      if (index === -1) {
        return {
          success: false,
          error: 'Record not found or is a protected demo record that cannot be directly edited.',
        };
      }

      const target = existingRecords[index];
      const historyItems: CorrectionHistoryItem[] = [...(target.correctionHistory || [])];

      // Check fields being changed to record in correction history
      const now = new Date().toISOString();
      const trackedFields: (keyof FarmEvent)[] = [
        'title',
        'quantity',
        'unit',
        'areaCoveredAcres',
        'activityDate',
        'plotId',
        'status',
        'fertilizerName',
      ];

      trackedFields.forEach((field) => {
        if (updates[field] !== undefined && updates[field] !== target[field]) {
          historyItems.push({
            id: `corr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            timestamp: now,
            field,
            oldValue: (target as any)[field],
            newValue: (updates as any)[field],
            reason: reason || 'Farmer manual edit',
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
      console.error('Storage error during record update:', err);
      return {
        success: false,
        error: 'Storage failure: Could not update the record.',
      };
    }
  }

  /**
   * Deletes a farmer-created record
   */
  public static deleteRecord(eventId: string): StorageResult<boolean> {
    try {
      const existingRecords = this.loadFarmerRecords();
      const isTargetPresent = existingRecords.some((r) => r.eventId === eventId);

      if (!isTargetPresent) {
        return {
          success: false,
          error: 'Record not found in user storage (Demo records cannot be deleted).',
        };
      }

      const filtered = existingRecords.filter((r) => r.eventId !== eventId);
      localStorage.setItem(STORAGE_KEY_FARMER_RECORDS, JSON.stringify(filtered));

      return {
        success: true,
        data: true,
      };
    } catch (err: any) {
      console.error('Storage error during delete:', err);
      return {
        success: false,
        error: 'Failed to delete record from storage.',
      };
    }
  }

  /**
   * Confirms a record explicitly by the farmer
   */
  public static confirmRecord(eventId: string, confirmedBy: string): StorageResult<FarmEvent> {
    return this.updateRecord(
      eventId,
      {
        status: 'farmer_confirmed',
        source: 'farmer_confirmed',
        verificationStatus: 'confirmed',
        confirmedBy,
        confirmedAt: new Date().toISOString(),
      },
      'Farmer explicit confirmation'
    );
  }

  /**
   * Clears farmer-created records after explicit user confirmation
   */
  public static resetAllFarmerRecords(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY_FARMER_RECORDS);
      return true;
    } catch (err) {
      console.error('Failed to clear farmer records:', err);
      return false;
    }
  }
}
