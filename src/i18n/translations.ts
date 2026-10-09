/**
 * AI Farm Hub — Multilingual Localization System
 * Complete, farmer-friendly translations for Telugu (తెలుగు), English, and Hindi (हिन्दी).
 * Provides safe fallback to English for any missing keys to prevent UI breakages.
 */

import { AppLanguage } from '../types/profile';

export interface TranslationDictionary {
  appName: string;
  phaseBadge: string;
  nav: {
    home: string;
    myFarm: string;
    record: string;
    insights: string;
    market: string;
  };
  actions: {
    recordActivity: string;
    record: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    confirmFarmer: string;
    close: string;
    retry: string;
    tryAgain: string;
    voiceInput: string;
    cameraInput: string;
    quickAction: string;
    detailedForm: string;
    viewTimeline: string;
    resetDemo: string;
    saveAndApply: string;
    saveChanges: string;
  };
  home: {
    greeting: string;
    subGreeting: string;
    weatherCardTitle: string;
    weatherMockLabel: string;
    weatherCondition: string;
    fieldStatusTitle: string;
    pendingTasksTitle: string;
    pendingTasksCount: string;
    financialSnapshotTitle: string;
    financialSnapshotSubtitle: string;
    recentTimelineTitle: string;
    recentTimelineSubtitle: string;
    viewAllRecords: string;
    primaryFieldTitle: string;
    registeredPlots: string;
    totalAcresLabel: string;
    humidity: string;
    wind: string;
    weatherStation: string;
    cropPaddyLandPrep: string;
    cropGroundnutLandPrep: string;
    viewPlotDetails: string;
    landPrepPending: string;
    landPrepPendingDesc: string;
    logLandPrepAction: string;
    fieldIntelligenceObs: string;
    exploreInsights: string;
    unknownDate: string;
    objectivesLabel: string;
  };
  myFarm: {
    title: string;
    subtitle: string;
    plotsListTitle: string;
    soilType: string;
    waterSource: string;
    area: string;
    cropStage: string;
    recordOnPlot: string;
    soilTestStatus: string;
    soilTestNotAvailable: string;
    irrigationSource: string;
    irrigationUnknown: string;
    totalAcresFormat: string;
    managedByFormat: string;
    fieldSpecsTitle: string;
    farmPlotLabel: string;
    soilTypeUnknown: string;
    zeroAssumption: string;
    sowingVariety: string;
    varietyUnknown: string;
    sowingDateUnrecorded: string;
    yieldTargetActual: string;
    neverConvertedToZero: string;
    recordedEventsFor: string;
    showingFieldLog: string;
    stageLandPrep: string;
    plotAcresTotal: string;
    cropLabel: string;
  };
  record: {
    title: string;
    subtitle: string;
    voiceTabTitle: string;
    voiceTabDesc: string;
    cameraTabTitle: string;
    cameraTabDesc: string;
    quickTabTitle: string;
    quickTabDesc: string;
    formTabTitle: string;
    formTabDesc: string;
    reviewExtractedTitle: string;
    reviewExtractedDesc: string;
    unconfirmedNotice: string;
    ruleBasedNotice: string;
    dateNotice: string;
    clarificationNeeded: string;
    tapToRecord: string;
    listening: string;
    micDenied: string;
    micDeniedNote: string;
    saveAsDraft: string;
    confirmAndSave: string;
    duplicateWarningTitle: string;
    duplicateWarningDesc: string;
    appAssignedDateNotice: string;
    testPhrasesTitle: string;
    testPhrasesSubtitle: string;
    quick1TapTitle: string;
    quick1TapSubtitle: string;
    zeroFriction: string;
    headlineLabel: string;
    activityDateLabel: string;
    associatedPlotLabel: string;
    unspecifiedPlot: string;
    quantityRecorded: string;
    discardDraft: string;
    savePending: string;
    farmerConfirmSave: string;
    completeRecordsTitle: string;
    completeRecordsDesc: string;
    recordNewActivity: string;
    voiceRecordingTitle: string;
    voiceRecordingSubtitle: string;
    voiceNotice: string;
    transcribedSpeech: string;
    structuredFormTitle: string;
    structuredFormSubtitle: string;
    targetPlotLabel: string;
    activityTypeLabel: string;
    areaCoveredLabel: string;
    titleDescLabel: string;
    titleDescPlaceholder: string;
    quantityOptionalLabel: string;
    measurementUnitLabel: string;
    formSourceFooter: string;
    saveToRecords: string;
    duplicateModalTitle: string;
    duplicateModalDesc: string;
    duplicateModalQuestion: string;
    keepExistingOnly: string;
    createAnotherRecord: string;
    quickLog: string;
    quickLandPrepPaddy: string;
    quickLandPrepGroundnut: string;
    quickIrrigationPaddy: string;
    quickFieldInspection: string;
    quickFieldInspectionDesc: string;
    closeModality: string;
    photoReceiptNotice: string;
    cameraNotAvailable: string;
    listeningStatus: string;
    tapToRecordPrompt: string;
    voiceProtectedNotice: string;
  };
  insights: {
    title: string;
    subtitle: string;
    tagline: string;
    demoBadge: string;
    groundedNotice: string;
    policyLabel: string;
    styleLabel: string;
    observationLabel: string;
    farmTitle: string;
    contextTitle: string;
    objectivesLabel: string;
    decisionTitle: string;
    acknowledgeButton: string;
    recordFirstButton: string;
    savedDecisionNote: string;
    sampleInsightTitle: string;
    sampleInsightDetail: string;
    sampleInsightRecommendation: string;
  };
  timeline: {
    quantity: string;
    areaCovered: string;
    dataSource: string;
    confirmationStatus: string;
    verificationStatus: string;
    independentlyVerified: string;
    unverified: string;
    correctionHistory: string;
    editsCount: string;
    unknownNotRecorded: string;
    acresUnit: string;
    filterAll: string;
    filterFarmer: string;
    filterDemo: string;
    allPlots: string;
    unassignedPlot: string;
    allTypes: string;
    deleteConfirmTitle: string;
    deleteConfirmText: string;
    deleteLocalNotice: string;
    demoRecordTitle: string;
    farmerRecordTitle: string;
    cancel: string;
    confirmDelete: string;
    close: string;
    farmerConfirmSave: string;
    saveChangesHistory: string;
    demoBadge: string;
    farmerCreatedRecord: string;
    viewDetails: string;
    edit: string;
    delete: string;
    editModalTitle: string;
    editModalSubtitle: string;
    demoRecordBadge: string;
    farmerCreatedBadge: string;
    confirmedByLabel: string;
    activityTitleLabel: string;
    recordedQuantityLabel: string;
    notesLabel: string;
    plotLabel: string;
    dateLabel: string;
    unitLabel: string;
  };
  sources: {
    farmer_reported: string;
    ai_extracted: string;
    farmer_confirmed: string;
    verified_document: string;
    demo_data: string;
    unknown: string;
  };
  statuses: {
    draft: string;
    pending_confirmation: string;
    farmer_confirmed: string;
    conflicting: string;
    demo: string;
    demo_incomplete: string;
    estimated: string;
    unknown: string;
  };
  trustIndicators: {
    farmerConfirmed: string;
    pendingConfirmation: string;
    draft: string;
    conflicting: string;
    demoRecord: string;
    demoIncomplete: string;
    estimated: string;
    unknown: string;
  };
  market: {
    title: string;
    subtitle: string;
    commercialBannerTitle: string;
    commercialBannerBadge: string;
    commercialBannerDesc: string;
    registeredCropsTitle: string;
    registeredCropsSubtitle: string;
    mandiPricesTitle: string;
    mandiPricesSubtitle: string;
    minPrice: string;
    modalPrice: string;
    maxPrice: string;
    perQuintal: string;
    readinessLabel: string;
    cropStageVegetativeSimulated: string;
    estimatedHarvestUnrecorded: string;
    simulationBadge: string;
    simulatedBenchmark: string;
    trendUp: string;
    trendDown: string;
    trendStable: string;
  };
  sync: {
    onlineLabel: string;
    onlineDetail: string;
    offlineLabel: string;
    offlineDetail: string;
    pendingSyncLabel: string;
    pendingSyncDetail: string;
    syncCompletedLabel: string;
    syncCompletedDetail: string;
    modalTitle: string;
    simulationBadge: string;
    simulationNote: string;
  };
  resetModal: {
    title: string;
    warningText: string;
    cancelText: string;
    confirmText: string;
    whatDeleted: string;
    whatRetained: string;
    recordsResetSuccess: string;
    allResetSuccess: string;
    resetError: string;
    partialResetError: string;
  };
  quickRecordModal: {
    title: string;
    subtitle: string;
    plotLabel: string;
    eventTypeLabel: string;
    dateLabel: string;
    titleLabel: string;
    quantityLabel: string;
    unitLabel: string;
    costLabel: string;
    savingLabel: string;
    dataPreservedNotice: string;
  };
  preferencesModal: {
    title: string;
    profileTab: string;
    preferencesTab: string;
    saveAndApply: string;
    appLanguageLabel: string;
    voiceLanguageLabel: string;
    interactionModeLabel: string;
    aiResponseStyleLabel: string;
    recommendationModeLabel: string;
    themeLabel: string;
    textSizeLabel: string;
    contrastLabel: string;
    readAloudLabel: string;
    reduceMotionLabel: string;
    interactionPrefLabel: string;
    quietHoursLabel: string;
    translationNote: string;
    demoNotice: string;
    fullNameLabel: string;
    preferredNameLabel: string;
    roleLabel: string;
    experienceYearsLabel: string;
    digitalComfortLabel: string;
    villageLabel: string;
    districtLabel: string;
    stateLabel: string;
    countryLabel: string;
    primaryObjectivesLabel: string;
    subscriptionsTitle: string;
    importantAlertsLabel: string;
    activityRemindersLabel: string;
    quietHoursNotice: string;
    timeTo: string;
    recImportant: string;
    recAll: string;
    recRequested: string;
    interactionBalanced: string;
    interactionTouch: string;
    interactionVoice: string;
    digitalBasic: string;
    digitalIntermediate: string;
    digitalAdvanced: string;
    objProfitability: string;
    objReduceCosts: string;
    objImproveYield: string;
    objSaveWater: string;
    objAccurateRecords: string;
    alertPestOutbreak: string;
    alertExtremeWeather: string;
    alertMarketSpike: string;
    alertGovtScheme: string;
    remIrrigation: string;
    remFertilizer: string;
    remPestScouting: string;
    remHarvestWindow: string;
    contrastStandard: string;
    contrastHigh: string;
    languageIndependent: string;
    teluguDefault: string;
    modeQuick: string;
    modeAssisted: string;
    modeDetailed: string;
    styleSimple: string;
    styleBalanced: string;
    styleDetailed: string;
    themeSystem: string;
    themeLight: string;
    themeDark: string;
    textSizeStandard: string;
    textSizeLarge: string;
    textSizeExtraLarge: string;
    displaySectionTitle: string;
    dismiss: string;
  };
  eventTypes: {
    land_prep: string;
    sowing: string;
    irrigation: string;
    fertilizer: string;
    spray: string;
    weeding: string;
    pest_scouting: string;
    observation: string;
    harvest: string;
    sale: string;
    other: string;
  };
  units: {
    hours: string;
    kg: string;
    bags: string;
    liters: string;
    quintals: string;
    acres: string;
  };
  common: {
    emptyTitle: string;
    emptyDesc: string;
    emptyAction: string;
    errorTitle: string;
    errorDesc: string;
    localCacheNote: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  Telugu: {
    appName: 'రైతు హబ్ (AI Farm Hub)',
    phaseBadge: 'దశ 0.5',
    nav: {
      home: 'హోమ్',
      myFarm: 'నా పొలం',
      record: 'నమోదు',
      insights: 'అంతర్దృష్టులు',
      market: 'మార్కెట్',
    },
    actions: {
      recordActivity: 'పని నమోదు చేయండి',
      record: 'నమోదు',
      save: 'భద్రపరచు (Save)',
      cancel: 'రద్దు (Cancel)',
      edit: 'సవరించు (Edit)',
      delete: 'తొలగించు (Delete)',
      confirm: 'నిర్ధారించు (Confirm)',
      confirmFarmer: 'రైతు నిర్ధారణ చేసి భద్రపరచు',
      close: 'మూసివేయి',
      retry: 'మళ్ళీ ప్రయత్నించండి',
      tryAgain: 'మళ్ళీ ప్రయత్నించండి',
      voiceInput: 'వాయిస్ ద్వారా',
      cameraInput: 'కెమెరా ద్వారా',
      quickAction: 'త్వరిత నమోదు',
      detailedForm: 'వివరమైన ఫారమ్',
      viewTimeline: 'టైమ్‌లైన్ చూడండి',
      resetDemo: 'డేటాను రీసెట్ చేయండి',
      saveAndApply: 'భద్రపరచి అమలు చేయండి',
      saveChanges: 'మార్పులను భద్రపరచండి',
    },
    home: {
      greeting: 'నమస్కారం, రవి గారు',
      subGreeting: 'ఈరోజు మీ పొలం గురించి తెలుసుకోవలసిన వివరాలు (అనకాపల్లి జిల్లా).',
      weatherCardTitle: 'వాతావరణ వివరాలు',
      weatherMockLabel: 'డెమో — లైవ్ కాదు',
      weatherCondition: 'ఎండగా ఉంది · స్పష్టమైన ఆకాశం',
      fieldStatusTitle: 'పొలం ప్రస్తుత స్థితి',
      pendingTasksTitle: 'రాబోయే పనులు / గమనికలు',
      pendingTasksCount: '1 ముఖ్యమైన అంశం',
      financialSnapshotTitle: 'సీజన్ ఆర్థిక సంగ్రహం',
      financialSnapshotSubtitle: 'రైతు నమోదు చేసిన వివరాల ఆధారంగా గణన.',
      recentTimelineTitle: 'ఇటీవలి వ్యవసాయ కార్యకలాపాలు',
      recentTimelineSubtitle: 'పొలంలో జరిగిన పనుల వరుస క్రమం.',
      viewAllRecords: 'అన్ని రికార్డులను చూడండి',
      primaryFieldTitle: 'పొలం ప్లాట్ల వివరాలు',
      registeredPlots: 'నమోదైన ప్లాట్లు (5 ఎకరాలు)',
      totalAcresLabel: 'మొత్తం విస్తీర్ణం',
      humidity: 'తేమ: 62%',
      wind: 'గాలి: 14 km/h',
      weatherStation: 'అనకాపల్లి వాతావరణ కేంద్రం · సిమ్యులేటెడ్ డెమో డేటా',
      cropPaddyLandPrep: 'పంట: వరి (భూమి తయారీ దశ)',
      cropGroundnutLandPrep: 'పంట: వేరుశనగ (భూమి తయారీ దశ)',
      viewPlotDetails: 'ప్లాట్ A & ప్లాట్ B వివరాలు చూడండి',
      landPrepPending: 'భూమి తయారీ పెండింగ్‌లో ఉంది',
      landPrepPendingDesc: 'ప్లాట్ A (వరి) మరియు ప్లాట్ B (వేరుశనగ) కొరకు పొలం పనులు సిద్ధంగా ఉన్నాయి. పూర్తయ్యాక నమోదు చేయండి.',
      logLandPrepAction: 'పని ముగిశాక ఇక్కడ నమోదు చేయండి',
      fieldIntelligenceObs: 'ఫీల్డ్ ఇంటెలిజెన్స్ పరిశీలన',
      exploreInsights: 'అంతర్దృష్టులను అన్వేషించండి',
      unknownDate: 'తేదీ: తెలియదు',
      objectivesLabel: 'రైతు ప్రాథమిక లక్ష్యాలు:',
    },
    myFarm: {
      title: 'నా పొలం వివరాలు',
      subtitle: 'రవి కుమార్ ఫార్మ్ · 5 ఎకరాలు (రసపూడిపాలెం, అనకాపల్లి జిల్లా)',
      plotsListTitle: 'పొలం ప్లాట్లు (5 ఎకరాలు)',
      soilType: 'మట్టి రకం',
      waterSource: 'నీటి వనరు',
      area: 'విస్తీర్ణం',
      cropStage: 'పంట దశ',
      recordOnPlot: 'ఈ ప్లాట్‌లో పని నమోదు చేయండి',
      soilTestStatus: 'నేల పరీక్ష స్థితి',
      soilTestNotAvailable: 'అందుబాటులో లేదు (నమోదు కాలేదు)',
      irrigationSource: 'నీటిపారుదల వనరు',
      irrigationUnknown: 'తెలియదు',
      totalAcresFormat: 'మొత్తం 5 ఎకరాలు',
      managedByFormat: 'రవి కుమార్ (రవి గారు) పర్యవేక్షణలో · 2 నమోదిత ప్లాట్లు (మొత్తం 5 ఎకరాలు).',
      fieldSpecsTitle: 'ఫీల్డ్ స్పెసిఫికేషన్‌లు',
      farmPlotLabel: 'వ్యవసాయ ప్లాట్',
      soilTypeUnknown: 'తెలియదు / నమోదు కాలేదు',
      zeroAssumption: 'ముందస్తు ఊహలు లేని నియమం',
      sowingVariety: 'విత్తనాలు & రకం',
      varietyUnknown: 'రకం: తెలియదు',
      sowingDateUnrecorded: 'విత్తిన తేదీ: ఇంకా నమోదు కాలేదు',
      yieldTargetActual: 'దిగుబడి లక్ష్యం / వాస్తవం',
      neverConvertedToZero: 'ఎప్పుడూ 0 గా మార్చబడదు',
      recordedEventsFor: 'నమోదైన కార్యకలాపాలు',
      showingFieldLog: 'పొలం రికార్డు లాగ్',
      stageLandPrep: 'దశ: భూమి తయారీ',
      plotAcresTotal: 'మొత్తం 5.0 ఎకరాలు (ప్లాట్ A: 2.0 ఎకరం + ప్లాట్ B: 3.0 ఎకరాలు)',
      cropLabel: 'పంట',
    },
    record: {
      title: 'పని నమోదు (Record Activity)',
      subtitle: 'వాయిస్ ద్వారా మాట్లాడండి లేదా సులభమైన ఫారమ్ ద్వారా నమోదు చేయండి.',
      voiceTabTitle: 'వాయిస్ ద్వారా నమోదు',
      voiceTabDesc: 'తెలుగులో మాట్లాడి పని నమోదు చేయండి',
      cameraTabTitle: 'రసీదు / కెమెరా',
      cameraTabDesc: 'రసీదు లేదా ఫోటోను జతచేయండి',
      quickTabTitle: '1-ట్యాప్ నమోదు',
      quickTabDesc: 'సాధారణ పనులను ఒకే ట్యాప్‌లో నమోదు చేయండి',
      formTabTitle: 'వివరమైన ఫారమ్',
      formTabDesc: 'పూర్తి వివరాలతో స్వయంగా నమోదు చేయండి',
      reviewExtractedTitle: 'నమోదు చేయబడిన వివరాల సమీక్ష',
      reviewExtractedDesc: 'కంప్యూటర్ సేకరించిన వివరాలను సరిచూసి భద్రపరచండి. రైతు ధృవీకరణ తప్పనిసరి.',
      unconfirmedNotice: 'గమనిక: ఈ వివరాలు ఇంకా ధృవీకరించబడలేదు.',
      ruleBasedNotice: 'ఇది నియమ-ఆధారిత వాయిస్ గుర్తింపు ద్వారా గ్రహించబడింది.',
      dateNotice: 'తేదీ పేర్కొనబడలేదు; ఈరోజు తేదీ సమీక్ష కొరకు ఇవ్వబడింది.',
      clarificationNeeded: 'స్పష్టత అవసరం:',
      tapToRecord: 'మాట్లాడటానికి ఇక్కడ నొక్కండి',
      listening: 'వినబడుతోంది... స్పష్టంగా మాట్లాడండి',
      micDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది.',
      micDeniedNote: 'దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతించండి లేదా ఫారమ్ ఉపయోగించండి.',
      saveAsDraft: 'పెండింగ్‌గా భద్రపరచు',
      confirmAndSave: 'రైతు నిర్ధారణ చేసి భద్రపరచు',
      duplicateWarningTitle: 'ఇదే పని గతంలో నమోదు చేయబడిందా?',
      duplicateWarningDesc: 'గత కొద్ది క్షణాల్లో ఇటువంటి రికార్డు నమోదైంది. మళ్లీ నమోదు చేయాలా?',
      appAssignedDateNotice: '(ఈరోజు తేదీ సమీక్ష కొరకు ఇవ్వబడింది: సరిచూసుకోండి)',
      testPhrasesTitle: 'పరీక్షా వాక్యాలు (ఆటోమేటెడ్ టెస్ట్ ఫ్రేసెస్)',
      testPhrasesSubtitle: 'తెలుగు శబ్ద సంగ్రహణ పరీక్ష కోసం నొక్కండి:',
      quick1TapTitle: '1-ట్యాప్ త్వరిత లాగర్లు',
      quick1TapSubtitle: 'ప్లాట్ A లేదా ప్లాట్ B లో రోజువారీ పనులను ఒకే ట్యాప్‌తో నమోదు చేయండి.',
      zeroFriction: 'ఫారమ్ లేని త్వరిత నమోదు',
      headlineLabel: 'పని ముఖ్యాంశం',
      activityDateLabel: 'పని జరిగిన తేదీ',
      associatedPlotLabel: 'సంబంధిత ప్లాట్ *',
      unspecifiedPlot: 'తెలియదు / ఇంకా స్పష్టం కాలేదు',
      quantityRecorded: 'నమోదైన పరిమాణం',
      discardDraft: 'డ్రాఫ్ట్ తీసివేయి',
      savePending: 'పెండింగ్‌గా సేవ్ చేయి',
      farmerConfirmSave: 'రైతు నిర్ధారించి భద్రపరచు',
      completeRecordsTitle: 'పూర్తి వ్యవసాయ కార్యకలాపాల రికార్డులు',
      completeRecordsDesc: 'రైతు నమోదు చేసినవి, AI ద్వారా సంగ్రహించినవి మరియు డెమో రికార్డులు.',
      recordNewActivity: 'కొత్త పనిని నమోదు చేయండి',
      voiceRecordingTitle: 'వాయిస్ పని నమోదు & AI సంగ్రహణ',
      voiceRecordingSubtitle: 'మైక్రోఫోన్ నొక్కినప్పుడు మాత్రమే అడగబడుతుంది.',
      voiceNotice: 'వాయిస్ గమనిక:',
      transcribedSpeech: 'గ్రహించిన మాటలు:',
      structuredFormTitle: 'నిర్మాణాత్మక ఫీల్డ్ నమోదు ఫారమ్',
      structuredFormSubtitle: 'ఖచ్చితమైన వివరాల నమోదు: మీ డివైస్‌లో స్థానికంగా భద్రపరచబడుతుంది.',
      targetPlotLabel: 'లక్ష్యిత ప్లాట్ *',
      activityTypeLabel: 'పని రకం *',
      areaCoveredLabel: 'కవర్ చేసిన విస్తీర్ణం (ఎకరాలు)',
      titleDescLabel: 'పని ముఖ్యాంశం / వివరణ *',
      titleDescPlaceholder: 'ఉదాహరణ: లోతైన వేసవి దుక్కి లేదా ట్రైకోడెర్మా మందు చిలకరింపు',
      quantityOptionalLabel: 'పరిమాణం (ఐచ్ఛికం)',
      measurementUnitLabel: 'కొలత యూనిట్',
      formSourceFooter: 'మూలం: రైతు నమోదు చేసినది · స్థానిక నిల్వలో భద్రపరచబడింది.',
      saveToRecords: 'కార్యకలాపాల రికార్డులలో భద్రపరచు',
      duplicateModalTitle: 'ఇదే పని గతంలో నమోదు చేయబడిందా?',
      duplicateModalDesc: 'సరిపోలే పని కొద్ది క్షణాల క్రితం నమోదైంది.',
      duplicateModalQuestion: 'మీరు మరొక ప్రత్యేక రికార్డును సృష్టించాలనుకుంటున్నారా, లేదా ఉన్న రికార్డును అలాగే ఉంచాలా?',
      keepExistingOnly: 'ఉన్న రికార్డును మాత్రమే ఉంచు',
      createAnotherRecord: 'మరొక రికార్డును సృష్టించు',
      quickLog: '+ నమోదు',
      quickLandPrepPaddy: 'భూమి తయారీ (వరి)',
      quickLandPrepGroundnut: 'భూమి తయారీ (వేరుశనగ)',
      quickIrrigationPaddy: 'నీటిపారుదల (వరి)',
      quickFieldInspection: 'పొలం పరిశీలన',
      quickFieldInspectionDesc: 'తెగుళ్లు/పురుగులు ఏవీ కనిపించలేదు',
      closeModality: 'మూసివేయి',
      photoReceiptNotice: 'రసీదు / కెమెరా జోడింపు',
      cameraNotAvailable: 'ఫేజ్ 0.5 లో కెమెరా ఫీచర్ సిమ్యులేట్ చేయబడింది. రసీదు సమాచారాన్ని ఫారమ్ ద్వారా నమోదు చేయవచ్చు.',
      listeningStatus: 'తెలుగులో వినబడుతోంది...',
      tapToRecordPrompt: 'వాయిస్ రికార్డ్ చేయడానికి నొక్కండి (తెలుగు)',
      voiceProtectedNotice: 'మీ వ్యవసాయ పనిని సహజంగా మాట్లాడండి. మైక్రోఫోన్ అనుమతులు సురక్షితంగా కోరబడతాయి.',
    },
    insights: {
      title: 'పొలం అంతర్దృష్టులు & విశ్లేషణ',
      subtitle: 'ఫీల్డ్ ఇంటెలిజెన్స్ · "ఏం జరుగుతోంది మరియు ఎందుకు?"',
      tagline: 'మేము గుర్తుంచుకుంటాము. అర్థం చేసుకుంటాము. ఆలోచించడానికి సహాయపడతాము. మీరు నిర్ణయిస్తారు.',
      demoBadge: 'డెమో అంతర్దృష్టి · దశ 0.5',
      groundedNotice: 'అన్ని విశ్లేషణాత్మక పరిశీలనలు ధృవీకరించబడిన రైతు రికార్డుల ఆధారంగా మాత్రమే ఉంటాయి.',
      policyLabel: 'సిఫార్సు విధానం:',
      styleLabel: 'శైలి',
      observationLabel: 'పరిశీలన #',
      farmTitle: 'రవి కుమార్ ఫార్మ్ (5 ఎకరాలు)',
      contextTitle: 'సందర్భం & పరిశీలన:',
      objectivesLabel: 'రైతు లక్ష్యాల అమరిక:',
      decisionTitle: 'రైతు నిర్ణయాధికార పరిధి (మీరే నిర్ణయిస్తారు)',
      acknowledgeButton: '✓ అంగీకరించబడింది: ప్రాథమిక పొలం తయారీ స్థాయి',
      recordFirstButton: 'మొదటి పనిని నమోదు చేయండి',
      savedDecisionNote: 'రైతు ఎంపిక భద్రపరచబడింది: బేస్‌లైన్ ఆమోదించబడింది. సిస్టమ్ మెమరీ అప్‌డేట్ అయింది.',
      sampleInsightTitle: 'ప్రాథమిక పొలం బేస్‌లైన్ పరిశీలన',
      sampleInsightDetail: 'రసపూడిపాలెంలోని రవి కుమార్ గారి పొలం (5.0 ఎకరాలు) ప్లాట్ A (2 ఎకరాల వరి) మరియు ప్లాట్ B (3 ఎకరాల వేరుశనగ) ప్రారంభ దశలో నమోదయ్యాయి. ఇంకా ఎలాంటి ఎరువులు లేదా కోత రసీదులు ధృవీకరించబడలేదు. మీరు పనులను నమోదు చేసేకొద్దీ క్షేత్ర స్థాయి పోలికలు సక్రియం అవుతాయి.',
      sampleInsightRecommendation: 'భూమి తయారీ పూర్తయిన తర్వాత ప్లాట్ సరిహద్దులను సరిచూసి, విత్తనాలు నాటిన సమయాన్ని నమోదు చేయండి.',
    },
    timeline: {
      quantity: 'పరిమాణం',
      areaCovered: 'విస్తీర్ణం',
      dataSource: 'సమాచార మూలం',
      confirmationStatus: 'రైతు నిర్ధారణ స్థితి',
      verificationStatus: 'స్వతంత్ర ధృవీకరణ స్థితి',
      independentlyVerified: 'స్వతంత్రంగా ధృవీకరించబడింది (డాక్యుమెంట్ / థర్డ్-పార్టీ)',
      unverified: 'థర్డ్-పార్టీ ధృవీకరణ పెండింగ్‌లో ఉంది (రైతు ప్రకటన)',
      correctionHistory: 'సవరణల చరిత్ర',
      editsCount: 'సవరణలు',
      unknownNotRecorded: 'తెలియదు / నమోదు కాలేదు',
      acresUnit: 'ఎకరాలు',
      filterAll: 'అన్ని రికార్డులు',
      filterFarmer: 'రైతు నమోదు చేసినవి',
      filterDemo: 'డెమో రికార్డులు',
      allPlots: 'అన్ని ప్లాట్లు',
      unassignedPlot: 'ప్లాట్ పేర్కొనబడలేదు',
      allTypes: 'అన్ని రకాల పనులు',
      deleteConfirmTitle: 'కార్యకలాప రికార్డును తొలగించాలా?',
      deleteConfirmText: 'మీరు ఈ రికార్డును మీ డివైస్ నుండి తొలగించాలనుకుంటున్నారా?',
      deleteLocalNotice: 'ఈ చర్య మీ స్థానిక పరికర మెమరీపై మాత్రమే ప్రభావం చూపుతుంది.',
      demoRecordTitle: 'డెమో కార్యకలాప రికార్డు',
      farmerRecordTitle: 'రైతు కార్యకలాప రికార్డు',
      cancel: 'రద్దు చేయి',
      confirmDelete: 'ఖచ్చితంగా తొలగించు',
      close: 'మూసివేయి',
      farmerConfirmSave: 'రైతు నిర్ధారించి భద్రపరచు',
      saveChangesHistory: 'మార్పులను భద్రపరచి చరిత్రను నమోదు చేయి',
      demoBadge: 'డెమో రికార్డు',
      farmerCreatedRecord: 'రైతు రికార్డు',
      viewDetails: 'వివరాలు చూడండి',
      edit: 'సవరించు',
      delete: 'తొలగించు',
      editModalTitle: 'కార్యకలాప రికార్డును సవరించండి',
      editModalSubtitle: 'మార్పులు ఆడిట్ హిస్టరీలో నమోదు చేయబడతాయి.',
      demoRecordBadge: 'డెమో రికార్డు',
      farmerCreatedBadge: 'రైతు రికార్డు',
      confirmedByLabel: 'ధృవీకరించిన వారు',
      activityTitleLabel: 'పని ముఖ్యాంశం *',
      recordedQuantityLabel: 'నమోదైన పరిమాణం',
      notesLabel: 'వివరాలు / గమనికలు',
      plotLabel: 'పొలం ప్లాట్',
      dateLabel: 'పని జరిగిన తేదీ',
      unitLabel: 'కొలత యూనిట్',
    },
    sources: {
      farmer_reported: 'రైతు నమోదు చేసినది',
      ai_extracted: 'AI ద్వారా స్వీకరించబడింది',
      farmer_confirmed: 'రైతు నిర్ధారించారు',
      verified_document: 'ధృవీకృత పత్రం',
      demo_data: 'డెమో సమాచారం',
      unknown: 'తెలియని మూలం',
    },
    statuses: {
      draft: 'డ్రాఫ్ట్ (ముసాయిదా)',
      pending_confirmation: 'నిర్ధారణ పెండింగ్‌లో ఉంది',
      farmer_confirmed: 'రైతు ధృవీకరించారు',
      conflicting: 'విరుద్ధమైన సమాచారం',
      demo: 'డెమో సమాచారం',
      demo_incomplete: 'డెమో (అసంపూర్ణం)',
      estimated: 'అంచనా వేయబడింది',
      unknown: 'తెలియదు',
    },
    trustIndicators: {
      farmerConfirmed: 'రైతు ధృవీకరించారు',
      pendingConfirmation: 'రైతు నిర్ధారణ పెండింగ్‌లో ఉంది',
      draft: 'డ్రాఫ్ట్',
      conflicting: 'సరిపోలని వివరాలు',
      demoRecord: 'డెమో రికార్డు',
      demoIncomplete: 'డెమో (అసంపూర్ణం)',
      estimated: 'అంచనా',
      unknown: 'తెలియదు',
    },
    market: {
      title: 'మార్కెట్ & వాణిజ్య సన్నద్ధత',
      subtitle: 'స్థానిక మార్కెట్ వివరాలు మరియు సిమ్యులేటెడ్ ధరలు (అనకాపల్లి రీజియన్).',
      commercialBannerTitle: 'వాణిజ్య సలహా నిరాకరణ — ఫేజ్ 0.5 అనుకరణ',
      commercialBannerBadge: 'లైవ్ మార్కెట్ కాదు',
      commercialBannerDesc:
        'ఈ స్క్రీన్‌లో ప్రదర్శించబడిన మార్కెట్ ధరలు నమూనా అధ్యయనం కోసం రూపొందించిన అనుకరణలు (Simulated). ఇవి వాస్తవ వ్యాపార అమ్మకాలకు సూచనలు కావు.',
      registeredCropsTitle: 'నమోదైన పంటలు & ప్రస్తుత స్థితి',
      registeredCropsSubtitle: 'మీ ప్లాట్ A (వరి) మరియు ప్లాట్ B (వేరుశనగ) ప్రస్తుత ఫీల్డ్ స్థితి.',
      mandiPricesTitle: 'ప్రాంతీయ మార్కెట్ ధరల సూచిక (Mandi Benchmarks)',
      mandiPricesSubtitle: 'అనకాపల్లి మరియు చుట్టుపక్కల మార్కెట్ల అధ్యయన ధరలు.',
      minPrice: 'కనిష్ట ధర',
      modalPrice: 'సగటు ధర (Modal)',
      maxPrice: 'గరిష్ట ధర',
      perQuintal: 'క్వింటాల్‌కు',
      readinessLabel: 'వాణిజ్య సన్నద్ధత',
      cropStageVegetativeSimulated: 'శాఖీయ దశ (అనుకరణ)',
      estimatedHarvestUnrecorded: 'ఖరారు కాలేదు (నమోదు కాలేదు)',
      simulationBadge: 'దశ 0.5 అనుకరణ',
      simulatedBenchmark: 'అనుకరణ బెంచ్‌మార్క్',
      trendUp: 'పెరుగుదల',
      trendDown: 'తగ్గుదల',
      trendStable: 'స్థిరంగా',
    },
    sync: {
      onlineLabel: 'ఆన్‌లైన్ సిద్ధంగా ఉంది',
      onlineDetail: 'డివైస్ మెమరీ సిద్ధంగా ఉంది',
      offlineLabel: 'ఆఫ్‌లైన్ మోడ్',
      offlineDetail: 'స్థానిక నిల్వలో భద్రంగా ఉంది',
      pendingSyncLabel: 'పెండింగ్ సింక్',
      pendingSyncDetail: 'రికార్డులు నిల్వ చేయబడ్డాయి',
      syncCompletedLabel: 'సింక్ పూర్తయింది',
      syncCompletedDetail: 'అన్ని మార్పులు భద్రంగా ఉన్నాయి',
      modalTitle: 'సింక్ స్థితి మరియు నిల్వ వివరణ',
      simulationBadge: 'సిమ్యులేషన్ మాత్రమే',
      simulationNote:
        'గమనిక: ఈ యాప్ బ్రౌజర్ లోకల్ స్టోరేజ్‌ని ఉపయోగిస్తుంది. ఫేజ్ 0.5లో రిమోట్ క్లౌడ్ సర్వర్ లేదా మల్టీ-డివైస్ సింక్ అనుసంధానించబడలేదు.',
    },
    resetModal: {
      title: 'డేటాను రీసెట్ చేయాలా?',
      warningText: 'ఈ చర్య మీ డివైస్‌లో భద్రపరిచిన సమాచారాన్ని తొలగించి ప్రారంభ స్థితికి తెస్తుంది.',
      cancelText: 'రద్దు చేయి',
      confirmText: 'ఖచ్చితంగా రీసెట్ చేయి',
      whatDeleted: 'రైతు సృష్టించిన కొత్త రికార్డులు మరియు తాత్కాలిక మార్పులు తొలగించబడతాయి.',
      whatRetained: 'రవి గారి ప్రామాణిక 5 ఎకరాల బేస్‌లైన్ డెమో రికార్డులు అలాగే ఉంటాయి.',
      recordsResetSuccess: 'రైతు కార్యకలాపాల రికార్డులు విజయవంతంగా రీసెట్ చేయబడ్డాయి.',
      allResetSuccess: 'అన్ని డిఫాల్ట్ సెట్టింగ్‌లు మరియు డేటా విజయవంతంగా పునరుద్ధరించబడ్డాయి.',
      resetError: 'స్టోరేజ్ డేటా రీసెట్ చేయడం విఫలమైంది.',
      partialResetError: 'పాక్షిక రీసెట్ లోపం: కొన్ని స్టోరేజ్ ఎంట్రీలు తొలగించబడలేదు.',
    },
    quickRecordModal: {
      title: 'త్వరిత పని నమోదు (Quick Record)',
      subtitle: 'పొలంలో జరిగిన పనిని సులభంగా ఇక్కడ నమోదు చేయండి.',
      plotLabel: 'పొలం ప్లాట్',
      eventTypeLabel: 'పని రకం',
      dateLabel: 'తేదీ',
      titleLabel: 'పని ముఖ్యాంశం',
      quantityLabel: 'పరిమాణం (వర్తిస్తే)',
      unitLabel: 'కొలత యూనిట్',
      costLabel: 'ఖర్చు (రూపాయలలో, వర్తిస్తే)',
      savingLabel: 'భద్రపరుస్తోంది...',
      dataPreservedNotice: 'మీరు నమోదు చేసిన వివరాలు సురక్షితంగా ఉన్నాయి. మళ్ళీ ప్రయత్నించవచ్చు.',
    },
    preferencesModal: {
      title: 'రైతు ప్రొఫైల్ & ప్రాధాన్యతలు',
      profileTab: 'రైతు ప్రొఫైల్',
      preferencesTab: 'వ్యక్తిగతీకరణ ప్రాధాన్యతలు',
      saveAndApply: 'భద్రపరచి అమలు చేయండి',
      appLanguageLabel: 'యాప్ భాష (App Language)',
      voiceLanguageLabel: 'వాయిస్ ఇన్పుట్ భాష (Voice Language)',
      interactionModeLabel: 'ఇంటరాక్షన్ మోడ్ (Interaction Mode)',
      aiResponseStyleLabel: 'AI స్పందన శైలి (Response Style)',
      recommendationModeLabel: 'సిఫార్సు నోటిఫికేషన్లు',
      themeLabel: 'థీమ్ (Theme)',
      textSizeLabel: 'అక్షరాల పరిమాణం (Text Size)',
      contrastLabel: 'కాంట్రాస్ట్ (Contrast)',
      readAloudLabel: 'స్పందనలను బిగ్గరగా చదవండి (Read Aloud)',
      reduceMotionLabel: 'యానిమేషన్లను తగ్గించండి (Reduce Motion)',
      interactionPrefLabel: 'ప్రాధాన్య ఇంటరాక్షన్ పద్ధతి',
      quietHoursLabel: 'నిశ్శబ్ద గంటలు (Quiet Hours: 21:00 - 06:00)',
      translationNote: 'గమనిక: ప్రాథమిక ఇంటర్‌ఫేస్ తెలుగులో ఉంది; కొన్ని సాంకేతిక వ్యవసాయ పదాలు ప్రామాణిక పరిభాషలో కొనసాగుతాయి.',
      demoNotice: 'డెమో రైతు గమనిక: ఇవి రవి కుమార్ (రవి గారు, రసపూడిపాలెం) డెమో వివరాలు. ఫోన్ నంబర్, GPS మరియు నేల పరీక్షలు ఇంకా నమోదు కాలేదు. మేము డేటాను కల్పించము.',
      fullNameLabel: 'పూర్తి పేరు *',
      preferredNameLabel: 'పిలిచే పేరు / సంబోధన *',
      roleLabel: 'హోదా / పాత్ర',
      experienceYearsLabel: 'వ్యవసాయ అనుభవం (సంవత్సరాలు)',
      digitalComfortLabel: 'డిజిటల్ పరిజ్ఞానం',
      villageLabel: 'గ్రామం',
      districtLabel: 'జిల్లా',
      stateLabel: 'రాష్ట్రం',
      countryLabel: 'దేశం',
      primaryObjectivesLabel: 'రైతు ప్రాథమిక లక్ష్యాలు',
      subscriptionsTitle: 'హెచ్చరికలు & రిమైండర్ల సభ్యత్వాలు',
      importantAlertsLabel: 'ముఖ్యమైన హెచ్చరికలు:',
      activityRemindersLabel: 'పనుల రిమైండర్లు:',
      quietHoursNotice: 'ఈ సమయంలో ఎలాంటి శబ్ద నోటిఫికేషన్లు రావు.',
      timeTo: 'నుండి',
      recImportant: 'ముఖ్యమైన సందర్భాలలో మాత్రమే (డిఫాల్ట్)',
      recAll: 'అన్ని సిఫార్సులు',
      recRequested: 'కోరినప్పుడు మాత్రమే',
      interactionBalanced: 'సమతుల్య పద్ధతి (డిఫాల్ట్)',
      interactionTouch: 'టచ్ ప్రాధాన్యత',
      interactionVoice: 'వాయిస్ ప్రాధాన్యత',
      digitalBasic: 'ప్రాథమిక స్థాయి',
      digitalIntermediate: 'మధ్యస్థ స్థాయి (డిఫాల్ట్)',
      digitalAdvanced: 'అధునాతన స్థాయి',
      objProfitability: 'వ్యవసాయ లాభదాయకతను పెంచడం',
      objReduceCosts: 'పెట్టుబడి ఖర్చులను తగ్గించడం',
      objImproveYield: 'పంట దిగుబడిని పెంచడం',
      objSaveWater: 'నీటిని ఆదా చేయడం',
      objAccurateRecords: 'ఖచ్చితమైన పొలం రికార్డులను నిర్వహించడం',
      alertPestOutbreak: 'పురుగులు & తెగుళ్ల వ్యాప్తి హెచ్చరికలు',
      alertExtremeWeather: 'తీవ్ర వాతావరణ హెచ్చరికలు',
      alertMarketSpike: 'మార్కెట్ ధరల హెచ్చుతగ్గులు',
      alertGovtScheme: 'ప్రభుత్వ పథకాల సమాచారం',
      remIrrigation: 'నీటిపారుదల షెడ్యూల్',
      remFertilizer: 'ఎరువుల వేసే సమయం',
      remPestScouting: 'పొలం పరిశీలన రోజులు',
      remHarvestWindow: 'పంట కోత సమయం',
      contrastStandard: 'సాధారణం',
      contrastHigh: 'ఎక్కువ కాంట్రాస్ట్ (ఎండ వెలుగులో)',
      languageIndependent: 'భాష ఎంపికలు (స్వతంత్రం)',
      teluguDefault: 'తెలుగు ప్రాథమికం',
      modeQuick: 'త్వరిత పద్ధతి (డిఫాల్ట్ — 1-ట్యాప్ వేగవంతమైన నమోదు)',
      modeAssisted: 'సహాయక పద్ధతి (దశల వారీ మార్గదర్శకత్వం)',
      modeDetailed: 'వివరణాత్మక పద్ధతి (పూర్తి ఫారమ్‌లు మరియు మెటాడేటా)',
      styleSimple: 'సులభమైన శైలి (స్పష్టమైన ముఖ్యాంశాలు)',
      styleBalanced: 'సమతుల్య శైలి (ప్రామాణిక నేపథ్యం)',
      styleDetailed: 'వివరణాత్మక శైలి (పూర్తి వ్యవసాయ వివరాలు)',
      themeSystem: 'సిస్టమ్ (ఆటో)',
      themeLight: 'లైట్ థీమ్',
      themeDark: 'డార్క్ థీమ్',
      textSizeStandard: 'సాధారణం',
      textSizeLarge: 'పెద్దది (బయట పొలంలో పనికి అనుకూలం)',
      textSizeExtraLarge: 'మరింత పెద్దది',
      displaySectionTitle: 'డిస్‌ప్లే, అక్షరాల పరిమాణం & కాంట్రాస్ట్',
      dismiss: 'తీసివేయి',
    },
    eventTypes: {
      land_prep: 'భూమి తయారీ',
      sowing: 'విత్తనాలు విత్తడం',
      irrigation: 'నీటిపారుదల',
      fertilizer: 'ఎరువులు వేయడం',
      spray: 'మందు పిచికారీ / చికిత్స',
      weeding: 'కలుపు తీత',
      pest_scouting: 'పురుగులు / తెగుళ్ల పరిశీలన',
      observation: 'సాధారణ పరిశీలన',
      harvest: 'పంట కోత',
      sale: 'అమ్మకం',
      other: 'ఇతర పని',
    },
    units: {
      hours: 'గంటలు',
      kg: 'కిలోగ్రాములు (కేజీ)',
      bags: 'బస్తాలు / సంచులు',
      liters: 'లీటర్లు',
      quintals: 'క్వింటాళ్లు',
      acres: 'ఎకరాలు',
    },
    common: {
      emptyTitle: 'మీ వ్యవసాయ చరిత్ర ఇక్కడ ప్రారంభమవుతుంది',
      emptyDesc: 'ఇప్పటివరకు పంట పనులు ఏవీ నమోదు కాలేదు. మీ మొదటి పనిని నమోదు చేసి పొలం చరిత్రను భద్రపరచండి.',
      emptyAction: 'మొదటి పనిని నమోదు చేయండి',
      errorTitle: 'నిల్వ లేదా లోడింగ్ సమస్య ఎదురైంది',
      errorDesc: 'మీ భద్రపరచబడిన వివరాలు సురక్షితంగా ఉన్నాయి. డివైస్ మెమరీలో డేటా భద్రంగా ఉంది.',
      localCacheNote: 'స్థానిక పరికర నిల్వ భద్రంగా ఉంచబడింది.',
    },
  },

  English: {
    appName: 'AI Farm Hub',
    phaseBadge: 'Phase 0.5',
    nav: {
      home: 'Home',
      myFarm: 'My Farm',
      record: 'Record',
      insights: 'Insights',
      market: 'Market',
    },
    actions: {
      recordActivity: 'Record Activity',
      record: 'Record',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      confirmFarmer: 'Farmer Confirm & Save',
      close: 'Close',
      retry: 'Retry',
      tryAgain: 'Try Again',
      voiceInput: 'Voice Input',
      cameraInput: 'Camera Input',
      quickAction: 'Quick Action',
      detailedForm: 'Detailed Form',
      viewTimeline: 'View Timeline',
      resetDemo: 'Reset Data',
      saveAndApply: 'Save & Apply',
      saveChanges: 'Save Changes',
    },
    home: {
      greeting: 'Welcome back, Ravi garu',
      subGreeting: 'Here is what you need to know about your farm today (Anakapalli district).',
      weatherCardTitle: 'Weather Conditions',
      weatherMockLabel: 'Demo — Not Live',
      weatherCondition: 'Sunny · Clear Skies',
      fieldStatusTitle: 'Field Status Overview',
      pendingTasksTitle: 'Upcoming Tasks & Field Notes',
      pendingTasksCount: '1 Important Item',
      financialSnapshotTitle: 'Season Financial Snapshot',
      financialSnapshotSubtitle: 'Calculated purely from farmer recorded entries.',
      recentTimelineTitle: 'Recent Field Activities',
      recentTimelineSubtitle: 'Chronological timeline of operations.',
      viewAllRecords: 'View All Records',
      primaryFieldTitle: 'Farm Plots Overview',
      registeredPlots: 'Registered Plots (5 Acres)',
      totalAcresLabel: 'Total Area',
      humidity: 'Humidity: 62%',
      wind: 'Wind: 14 km/h',
      weatherStation: 'Anakapalli Station · Simulated Demo Data',
      cropPaddyLandPrep: 'Crop: Paddy / Rice (Land preparation)',
      cropGroundnutLandPrep: 'Crop: Groundnut (Land preparation)',
      viewPlotDetails: 'View Plot A & Plot B details',
      landPrepPending: 'Land Preparation Pending',
      landPrepPendingDesc: 'Field preparation scheduled for Plot A (Paddy) and Plot B (Groundnut). Tap Record Activity when finished.',
      logLandPrepAction: 'Log land prep when completed',
      fieldIntelligenceObs: 'Field Intelligence Observation',
      exploreInsights: 'Explore insights',
      unknownDate: 'Date: Unknown',
      objectivesLabel: 'Farmer Objectives Calibration:',
    },
    myFarm: {
      title: 'My Farm Specifications',
      subtitle: 'Ravi Kumar Farm · 5 Acres (Rasapūdipalem, Anakapalli District)',
      plotsListTitle: 'Farm Plots (5 Acres)',
      soilType: 'Soil Type',
      waterSource: 'Water Source',
      area: 'Area',
      cropStage: 'Crop Stage',
      recordOnPlot: 'Record on this Plot',
      soilTestStatus: 'Soil Test Status',
      soilTestNotAvailable: 'Not Available (Unrecorded)',
      irrigationSource: 'Irrigation Source',
      irrigationUnknown: 'Unknown',
      totalAcresFormat: '5 Total Acres',
      managedByFormat: 'Managed by Ravi Kumar (Ravi garu) · 2 registered plots (5 Acres total).',
      fieldSpecsTitle: 'Field Specifications',
      farmPlotLabel: 'Farm Plot',
      soilTypeUnknown: 'Unknown / Unrecorded',
      zeroAssumption: 'Zero assumption rule',
      sowingVariety: 'Sowing & Variety',
      varietyUnknown: 'Variety: Unknown',
      sowingDateUnrecorded: 'Sowing date: Not yet recorded',
      yieldTargetActual: 'Yield Target / Actual',
      neverConvertedToZero: 'Never converted to 0',
      recordedEventsFor: 'Recorded Events for',
      showingFieldLog: 'Showing field log',
      stageLandPrep: 'Stage: Land preparation',
      plotAcresTotal: 'Total 5.0 Acres (Plot A: 2.0 Ac + Plot B: 3.0 Ac)',
      cropLabel: 'Crop',
    },
    record: {
      title: 'Record Farm Activity',
      subtitle: 'Log field routines via voice dictation, camera receipts, or manual input.',
      voiceTabTitle: 'Voice Recording',
      voiceTabDesc: 'Dictate in Telugu, English, or Hindi',
      cameraTabTitle: 'Camera & Receipt',
      cameraTabDesc: 'Attach bill, voucher, or photo evidence',
      quickTabTitle: '1-Tap Loggers',
      quickTabDesc: 'Routine tasks with zero form friction',
      formTabTitle: 'Manual Entry Form',
      formTabDesc: 'Structured entry with custom values',
      reviewExtractedTitle: 'Review Extracted Field Routine',
      reviewExtractedDesc: 'Verify extracted parameters before saving. Farmer confirmation is required.',
      unconfirmedNotice: 'Notice: This drafted entry requires explicit confirmation.',
      ruleBasedNotice: 'Extracted with deterministic rule-based natural language parsing.',
      dateNotice: 'Date was not spoken; assigned local today for review.',
      clarificationNeeded: 'Clarification Needed:',
      tapToRecord: 'Tap to start speaking',
      listening: 'Listening... Speak clearly now',
      micDenied: 'Microphone access was denied.',
      micDeniedNote: 'Enable microphone permission in browser settings, or use manual entry.',
      saveAsDraft: 'Save as Pending',
      confirmAndSave: 'Farmer Confirm & Save',
      duplicateWarningTitle: 'Potential duplicate activity?',
      duplicateWarningDesc: 'A similar activity was recorded moments ago. Would you like to proceed?',
      appAssignedDateNotice: '(App-assigned today: please review)',
      testPhrasesTitle: 'Quick Voice Verification Tests',
      testPhrasesSubtitle: 'Tap below to test deterministic parsing:',
      quick1TapTitle: 'Quick 1-Tap Loggers',
      quick1TapSubtitle: 'Log common field routines directly on Plot A or Plot B in 1 tap.',
      zeroFriction: 'Zero Form Friction',
      headlineLabel: 'Activity Headline',
      activityDateLabel: 'Activity Date',
      associatedPlotLabel: 'Associated Plot *',
      unspecifiedPlot: 'Unknown / Not Clarified',
      quantityRecorded: 'Recorded Quantity',
      discardDraft: 'Discard Draft',
      savePending: 'Save as Pending',
      farmerConfirmSave: 'Farmer Confirm & Save',
      completeRecordsTitle: 'Complete Farm Activity Records',
      completeRecordsDesc: 'Farmer reported, AI extracted, and Demo records with full provenance tracking.',
      recordNewActivity: 'Record New Activity',
      voiceRecordingTitle: 'Voice Activity Recording & AI Extraction',
      voiceRecordingSubtitle: 'Microphone is requested only on tap.',
      voiceNotice: 'Voice Notice:',
      transcribedSpeech: 'Transcribed Speech:',
      structuredFormTitle: 'Structured Field Entry Form',
      structuredFormSubtitle: 'When precision matters: recorded into persistent local farm memory.',
      targetPlotLabel: 'Target Plot *',
      activityTypeLabel: 'Activity Type *',
      areaCoveredLabel: 'Area Covered (Acres)',
      titleDescLabel: 'Activity Title / Description *',
      titleDescPlaceholder: 'e.g. Deep summer ploughing or Trichoderma treatment',
      quantityOptionalLabel: 'Quantity (Optional)',
      measurementUnitLabel: 'Measurement Unit',
      formSourceFooter: 'Source: Farmer reported · Saved durably to local storage.',
      saveToRecords: 'Save to Activity Records',
      duplicateModalTitle: 'Potential Duplicate Detected',
      duplicateModalDesc: 'A matching activity was already saved recently.',
      duplicateModalQuestion: 'Would you like to create another separate record, or keep the existing record as is?',
      keepExistingOnly: 'Keep Existing Only',
      createAnotherRecord: 'Create Another Record',
      quickLog: '+ Log',
      quickLandPrepPaddy: 'Land Prep (Paddy)',
      quickLandPrepGroundnut: 'Land Prep (Groundnut)',
      quickIrrigationPaddy: 'Irrigation (Paddy)',
      quickFieldInspection: 'Field Inspection',
      quickFieldInspectionDesc: 'No pest/disease found',
      closeModality: 'Close',
      photoReceiptNotice: 'Receipt / Photo Evidence',
      cameraNotAvailable: 'Camera evidence is simulated in Phase 0.5. You can record receipt details in the form.',
      listeningStatus: 'Listening in English...',
      tapToRecordPrompt: 'Tap to Record Voice (English)',
      voiceProtectedNotice: 'Speak your farm activity naturally. Microphones are protected and explicitly requested.',
    },
    insights: {
      title: 'Farm Insights & Analysis',
      subtitle: 'Field Intelligence · "What is happening and why?"',
      tagline: 'We remember. We understand. We help you think. You decide.',
      demoBadge: 'DEMO INSIGHT · PHASE 0.5',
      groundedNotice: 'All analytical observations are grounded purely in confirmed farmer activity records.',
      policyLabel: 'Recommendation Policy:',
      styleLabel: 'style',
      observationLabel: 'Observation #',
      farmTitle: 'Ravi Kumar Farm (5 Acres)',
      contextTitle: 'Context & Observation:',
      objectivesLabel: 'Farmer Objectives Calibration:',
      decisionTitle: 'Farmer Decision Space (You Decide)',
      acknowledgeButton: '✓ Acknowledged: Initial field preparation baseline',
      recordFirstButton: 'Record First Farm Activity',
      savedDecisionNote: 'Saved farmer choice: Baseline acknowledged. Application memory updated.',
      sampleInsightTitle: 'Input recording initial baseline',
      sampleInsightDetail: 'Ravi Kumar Farm (5.0 acres) in Rasapūdipalem has registered Plot A (2 acres Paddy) and Plot B (3 acres Groundnut). No completed input or harvest vouchers are confirmed yet. Historical comparisons will activate as real activities are recorded.',
      sampleInsightRecommendation: 'Confirm plot boundaries and record sowing when field preparation finishes.',
    },
    timeline: {
      quantity: 'Quantity',
      areaCovered: 'Area Covered',
      dataSource: 'Data Source',
      confirmationStatus: 'Confirmation Status',
      verificationStatus: 'Independent Verification',
      independentlyVerified: 'Independently Verified (Third-Party / Document)',
      unverified: 'Unverified by Third-Party (Farmer Declaration)',
      correctionHistory: 'Correction History',
      editsCount: 'edits',
      unknownNotRecorded: 'Unknown / Not recorded',
      acresUnit: 'Acres',
      filterAll: 'All Records',
      filterFarmer: 'Farmer Created',
      filterDemo: 'Demo Records',
      allPlots: 'All Plots',
      unassignedPlot: 'Plot Not Specified',
      allTypes: 'All Operations',
      deleteConfirmTitle: 'Delete Activity Record?',
      deleteConfirmText: 'Are you sure you want to remove this record from your farm records?',
      deleteLocalNotice: 'This action only affects your local device memory and can be reset anytime using Demo Reset.',
      demoRecordTitle: 'DEMO ACTIVITY RECORD',
      farmerRecordTitle: 'FARM ACTIVITY RECORD',
      cancel: 'Cancel',
      confirmDelete: 'Confirm Delete',
      close: 'Close',
      farmerConfirmSave: 'Farmer Confirm & Save',
      saveChangesHistory: 'Save Changes & Record History',
      demoBadge: 'DEMO RECORD',
      farmerCreatedRecord: 'FARMER RECORD',
      viewDetails: 'View Details',
      edit: 'Edit',
      delete: 'Delete',
      editModalTitle: 'Edit Activity Record',
      editModalSubtitle: 'Changes are tracked in correction audit history.',
      demoRecordBadge: 'DEMO RECORD',
      farmerCreatedBadge: 'FARMER RECORD',
      confirmedByLabel: 'Confirmed by',
      activityTitleLabel: 'Activity Title *',
      recordedQuantityLabel: 'Recorded Quantity',
      notesLabel: 'Description / Notes',
      plotLabel: 'Plot',
      dateLabel: 'Activity Date',
      unitLabel: 'Unit',
    },
    sources: {
      farmer_reported: 'Farmer Reported',
      ai_extracted: 'AI Extracted',
      farmer_confirmed: 'Farmer Confirmed',
      verified_document: 'Verified Document',
      demo_data: 'Demo Data',
      unknown: 'Unknown Source',
    },
    statuses: {
      draft: 'Draft',
      pending_confirmation: 'Pending Confirmation',
      farmer_confirmed: 'Farmer Confirmed',
      conflicting: 'Conflicting Records',
      demo: 'Demo Record',
      demo_incomplete: 'Demo (Incomplete)',
      estimated: 'Estimated',
      unknown: 'Unknown Status',
    },
    trustIndicators: {
      farmerConfirmed: 'Farmer Confirmed',
      pendingConfirmation: 'Pending Confirmation',
      draft: 'Draft',
      conflicting: 'Conflicting Data',
      demoRecord: 'Demo Record',
      demoIncomplete: 'Demo (Incomplete)',
      estimated: 'Estimated',
      unknown: 'Unknown',
    },
    market: {
      title: 'Market & Mandi Intelligence',
      subtitle: 'Regional mandi price benchmarks and commercial readiness.',
      commercialBannerTitle: 'Commercial Advisory Disclaimer — Phase 0.5 Simulation',
      commercialBannerBadge: 'Not Live Market',
      commercialBannerDesc:
        'All prices shown on this screen are simulated benchmarks for planning purposes only. They are not real-time APMC trade quotes and do not constitute commercial advice.',
      registeredCropsTitle: 'Registered Crops & Field Status',
      registeredCropsSubtitle: 'Status overview for Plot A (Paddy) and Plot B (Groundnut).',
      mandiPricesTitle: 'Regional Mandi Benchmark Prices',
      mandiPricesSubtitle: 'Benchmark prices representative of Anakapalli and neighboring mandis.',
      minPrice: 'Min Price',
      modalPrice: 'Modal Price',
      maxPrice: 'Max Price',
      perQuintal: 'per quintal',
      readinessLabel: 'Commercial Readiness',
      cropStageVegetativeSimulated: 'Vegetative (Simulated)',
      estimatedHarvestUnrecorded: 'Not fixed (Unrecorded)',
      simulationBadge: 'Phase 0.5 Simulation',
      simulatedBenchmark: 'Simulated benchmark',
      trendUp: 'Rising',
      trendDown: 'Falling',
      trendStable: 'Stable',
    },
    sync: {
      onlineLabel: 'Online Ready',
      onlineDetail: 'Device storage ready',
      offlineLabel: 'Offline Mode',
      offlineDetail: 'Saved to local device',
      pendingSyncLabel: 'Pending Sync',
      pendingSyncDetail: 'records saved locally',
      syncCompletedLabel: 'Synced',
      syncCompletedDetail: 'All changes saved locally',
      modalTitle: 'Sync & Storage Disclosure',
      simulationBadge: 'Simulation Only',
      simulationNote:
        'Note: This app uses browser local storage. No remote cloud server or multi-device sync is connected in Phase 0.5.',
    },
    resetModal: {
      title: 'Reset Application Data?',
      warningText: 'This will reset application state stored in your device browser.',
      cancelText: 'Cancel',
      confirmText: 'Confirm Reset',
      whatDeleted: 'Any farmer-created activity records and changes will be permanently cleared from this device.',
      whatRetained: 'Ravi Kumar standard 5-acre baseline demo farm records will be preserved.',
      recordsResetSuccess: 'Farmer activity records reset successfully.',
      allResetSuccess: 'All application defaults and baseline records successfully restored.',
      resetError: 'Failed to reset storage data.',
      partialResetError: 'Partial reset error: Could not clear all stored settings.',
    },
    quickRecordModal: {
      title: 'Quick Activity Record',
      subtitle: 'Log field operations directly into your farm history.',
      plotLabel: 'Farm Plot',
      eventTypeLabel: 'Operation Type',
      dateLabel: 'Activity Date',
      titleLabel: 'Activity Title',
      quantityLabel: 'Quantity (if applicable)',
      unitLabel: 'Measurement Unit',
      costLabel: 'Cost in Rupees (if applicable)',
      savingLabel: 'Saving record...',
      dataPreservedNotice: 'Your entered details are preserved below. You can try saving again.',
    },
    preferencesModal: {
      title: 'Farmer Profile & Preferences',
      profileTab: 'Farmer Profile',
      preferencesTab: 'Personalization ("How the app works")',
      saveAndApply: 'Save & Apply',
      appLanguageLabel: 'App Language',
      voiceLanguageLabel: 'Voice Input Language',
      interactionModeLabel: 'Interaction Mode',
      aiResponseStyleLabel: 'AI Response Style',
      recommendationModeLabel: 'Recommendation Notifications',
      themeLabel: 'Theme',
      textSizeLabel: 'Text Size',
      contrastLabel: 'Contrast',
      readAloudLabel: 'Read Responses Aloud',
      reduceMotionLabel: 'Reduce Animations',
      interactionPrefLabel: 'Preferred Interaction Method',
      quietHoursLabel: 'Quiet Hours (21:00 - 06:00)',
      translationNote: 'Note: Interface is translated into English, Telugu, and Hindi; agricultural proper nouns are preserved.',
      demoNotice: 'Demo Farmer Notice: These are demo values (Ravi Kumar / Ravi garu, Rasapūdipalem). Phone number, GPS coordinates, and soil tests remain unrecorded. We never invent missing data.',
      fullNameLabel: 'Full Name *',
      preferredNameLabel: 'Preferred Name / Address Greeting *',
      roleLabel: 'Role',
      experienceYearsLabel: 'Experience (Years)',
      digitalComfortLabel: 'Digital Comfort',
      villageLabel: 'Village',
      districtLabel: 'District',
      stateLabel: 'State',
      countryLabel: 'Country',
      primaryObjectivesLabel: 'Primary Objectives',
      subscriptionsTitle: 'Alert & Reminder Subscriptions',
      importantAlertsLabel: 'Important Alerts:',
      activityRemindersLabel: 'Activity Reminders:',
      quietHoursNotice: 'No audible notifications will sound during this time.',
      timeTo: 'to',
      recImportant: 'Important situations only (Default)',
      recAll: 'All recommendations',
      recRequested: 'Only when requested',
      interactionBalanced: 'Balanced (Default)',
      interactionTouch: 'Touch first',
      interactionVoice: 'Voice first',
      digitalBasic: 'Basic',
      digitalIntermediate: 'Intermediate (Default)',
      digitalAdvanced: 'Advanced',
      objProfitability: 'Improve farming profitability',
      objReduceCosts: 'Reduce input costs',
      objImproveYield: 'Improve crop yield',
      objSaveWater: 'Save water',
      objAccurateRecords: 'Maintain accurate farm records',
      alertPestOutbreak: 'Pest & Disease Outbreaks',
      alertExtremeWeather: 'Severe Weather Warnings',
      alertMarketSpike: 'Market Price Spikes',
      alertGovtScheme: 'Government Scheme Notifications',
      remIrrigation: 'Irrigation Schedule',
      remFertilizer: 'Fertilizer Application',
      remPestScouting: 'Field Scouting Days',
      remHarvestWindow: 'Harvest Window Advisory',
      contrastStandard: 'Standard',
      contrastHigh: 'High contrast (Sunlight)',
      languageIndependent: 'Language Settings (Independent)',
      teluguDefault: 'Telugu Default',
      modeQuick: 'Quick (Default — 1-tap rapid actions)',
      modeAssisted: 'Assisted (Step-by-step guidance)',
      modeDetailed: 'Detailed (Full forms and metadata)',
      styleSimple: 'Simple (Clear, direct summaries)',
      styleBalanced: 'Balanced (Standard context)',
      styleDetailed: 'Detailed (Comprehensive agronomic rationale)',
      themeSystem: 'System (Auto)',
      themeLight: 'Light',
      themeDark: 'Dark',
      textSizeStandard: 'Standard',
      textSizeLarge: 'Large (Default for outdoor)',
      textSizeExtraLarge: 'Extra large',
      displaySectionTitle: 'Display, Text Size & Contrast',
      dismiss: 'Dismiss',
    },
    eventTypes: {
      land_prep: 'Land Preparation',
      sowing: 'Seed Sowing',
      irrigation: 'Irrigation',
      fertilizer: 'Fertilizer Application',
      spray: 'Crop Spray / Treatment',
      weeding: 'Weeding',
      pest_scouting: 'Pest Scouting',
      observation: 'General Observation',
      harvest: 'Crop Harvest',
      sale: 'Produce Sale',
      other: 'Other Field Operation',
    },
    units: {
      hours: 'Hours',
      kg: 'Kilograms (kg)',
      bags: 'Bags',
      liters: 'Liters',
      quintals: 'Quintals',
      acres: 'Acres',
    },
    common: {
      emptyTitle: 'Your farm memory starts here',
      emptyDesc: 'No field activities recorded yet. Log your first event to build your farm record history.',
      emptyAction: 'Record First Activity',
      errorTitle: 'Storage or Loading Issue',
      errorDesc: 'Your saved information is safe. Local device memory preserved offline data.',
      localCacheNote: 'Local device storage preserved offline cache securely.',
    },
  },

  Hindi: {
    appName: 'किसान हब (AI Farm Hub)',
    phaseBadge: 'चरण 0.5',
    nav: {
      home: 'होम',
      myFarm: 'मेरा खेत',
      record: 'दर्ज करें',
      insights: 'सुझाव',
      market: 'मंडी भाव',
    },
    actions: {
      recordActivity: 'कार्य दर्ज करें',
      record: 'दर्ज करें',
      save: 'सहेजें (Save)',
      cancel: 'रद्द करें (Cancel)',
      edit: 'संपादित करें (Edit)',
      delete: 'हटाएं (Delete)',
      confirm: 'पुष्टि करें (Confirm)',
      confirmFarmer: 'किसान पुष्टि कर सहेजें',
      close: 'बंद करें',
      retry: 'पुनः प्रयास करें',
      tryAgain: 'पुनः प्रयास करें',
      voiceInput: 'आवाज़ द्वारा',
      cameraInput: 'कैमरा द्वारा',
      quickAction: 'त्वरित कार्य',
      detailedForm: 'विस्तृत फॉर्म',
      viewTimeline: 'टाइमलाइन देखें',
      resetDemo: 'डेटा रीसेट करें',
      saveAndApply: 'सहेजें और लागू करें',
      saveChanges: 'परिवर्तन सहेजें',
    },
    home: {
      greeting: 'नमस्ते, रवि जी',
      subGreeting: 'आज आपके खेत के बारे में मुख्य जानकारी (अनकापल्ली जिला)।',
      weatherCardTitle: 'मौसम की स्थिति',
      weatherMockLabel: 'डेमो — लाइव नहीं',
      weatherCondition: 'धूप खिली है · साफ़ आसमान',
      fieldStatusTitle: 'खेत की वर्तमान स्थिति',
      pendingTasksTitle: 'आगामी कार्य और नोट्स',
      pendingTasksCount: '1 महत्वपूर्ण कार्य',
      financialSnapshotTitle: 'मौसम का वित्तीय सारांश',
      financialSnapshotSubtitle: 'किसान द्वारा दर्ज प्रविष्टियों पर आधारित गणना।',
      recentTimelineTitle: 'हाल की कृषि गतिविधियां',
      recentTimelineSubtitle: 'खेत में किए गए कार्यों का कालक्रम।',
      viewAllRecords: 'सभी रिकॉर्ड देखें',
      primaryFieldTitle: 'खेत प्लॉट विवरण',
      registeredPlots: 'पंजीकृत प्लॉट (5 एकड़)',
      totalAcresLabel: 'कुल क्षेत्रफल',
      humidity: 'नमी: 62%',
      wind: 'हवा: 14 किमी/घंटा',
      weatherStation: 'अनकापल्ली मौसम केंद्र · सिम्युलेटेड डेमो डेटा',
      cropPaddyLandPrep: 'फसल: धान (खेत तैयारी चरण)',
      cropGroundnutLandPrep: 'फसल: मूंगफली (खेत तैयारी चरण)',
      viewPlotDetails: 'प्लॉट A और प्लॉट B विवरण देखें',
      landPrepPending: 'खेत तैयारी लंबित',
      landPrepPendingDesc: 'प्लॉट A (धान) और प्लॉट B (मूंगफली) के लिए खेत तैयारी निर्धारित है। पूरा होने पर कार्य दर्ज करें।',
      logLandPrepAction: 'काम पूरा होने पर यहां दर्ज करें',
      fieldIntelligenceObs: 'फील्ड इंटेलिजेंस अवलोकन',
      exploreInsights: 'सुझाव देखें',
      unknownDate: 'तारीख: अज्ञात',
      objectivesLabel: 'किसान के प्राथमिक उद्देश्य:',
    },
    myFarm: {
      title: 'मेरे खेत का विवरण',
      subtitle: 'रवि कुमार फार्म · 5 एकड़ (रसपूडीपालेम, अनकापल्ली जिला)',
      plotsListTitle: 'खेत के प्लॉट (5 एकड़)',
      soilType: 'मिट्टी का प्रकार',
      waterSource: 'पानी का स्रोत',
      area: 'क्षेत्रफल',
      cropStage: 'फसल चरण',
      recordOnPlot: 'इस प्लॉट पर कार्य दर्ज करें',
      soilTestStatus: 'मृदा परीक्षण स्थिति',
      soilTestNotAvailable: 'उपलब्ध नहीं (अदर्ज)',
      irrigationSource: 'सिंचाई स्रोत',
      irrigationUnknown: 'अज्ञात',
      totalAcresFormat: 'कुल 5 एकड़',
      managedByFormat: 'रवि कुमार (रवि जी) द्वारा प्रबंधित · 2 पंजीकृत प्लॉट (कुल 5 एकड़)।',
      fieldSpecsTitle: 'खेत विनिर्देश',
      farmPlotLabel: 'खेत प्लॉट',
      soilTypeUnknown: 'अज्ञात / अदर्ज',
      zeroAssumption: 'शून्य पूर्वधारणा नियम',
      sowingVariety: 'बुवाई एवं किस्म',
      varietyUnknown: 'किस्म: अज्ञात',
      sowingDateUnrecorded: 'बुवाई की तारीख: अभी दर्ज नहीं',
      yieldTargetActual: 'उपज लक्ष्य / वास्तविक',
      neverConvertedToZero: 'कभी 0 में परिवर्तित नहीं किया जाता',
      recordedEventsFor: 'दर्ज की गई गतिविधियां',
      showingFieldLog: 'खेत गतिविधि लॉग',
      stageLandPrep: 'चरण: खेत तैयारी',
      plotAcresTotal: 'कुल 5.0 एकड़ (प्लॉट A: 2.0 एकड़ + प्लॉट B: 3.0 एकड़)',
      cropLabel: 'फसल',
    },
    record: {
      title: 'कार्य दर्ज करें (Record Activity)',
      subtitle: 'आवाज़ द्वारा बोलें, रसीद फोटो जोड़ें, या फॉर्म भरें।',
      voiceTabTitle: 'आवाज़ द्वारा दर्ज करें',
      voiceTabDesc: 'तेलुगु, अंग्रेज़ी या हिंदी में बोलकर दर्ज करें',
      cameraTabTitle: 'कैमरा व रसीद',
      cameraTabDesc: 'बिल, वाउचर या फोटो साक्ष्य जोड़ें',
      quickTabTitle: '1-टैप लॉगर',
      quickTabDesc: 'नियमित काम एक क्लिक में दर्ज करें',
      formTabTitle: 'विस्तृत फॉर्म',
      formTabDesc: 'सभी विवरण मैन्युअल रूप से दर्ज करें',
      reviewExtractedTitle: 'दर्ज विवरण की समीक्षा',
      reviewExtractedDesc: 'सहेजने से पहले विवरण की पुष्टि करें। किसान पुष्टि अनिवार्य है।',
      unconfirmedNotice: 'नोट: इस प्रविष्टि की अभी पुष्टि नहीं हुई है।',
      ruleBasedNotice: 'यह नियम-आधारित भाषा विश्लेषण द्वारा निकाला गया है।',
      dateNotice: 'तारीख बोली नहीं गई थी; समीक्षा के लिए आज की तारीख दी गई है।',
      clarificationNeeded: 'स्पष्टीकरण आवश्यक:',
      tapToRecord: 'बोलने के लिए यहां टैप करें',
      listening: 'सुन रहे हैं... स्पष्ट बोलें',
      micDenied: 'माइक्रोफ़ोन अनुमति अस्वीकृत।',
      micDeniedNote: 'ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें या फॉर्म का उपयोग करें।',
      saveAsDraft: 'लंबित के रूप में सहेजें',
      confirmAndSave: 'किसान पुष्टि कर सहेजें',
      duplicateWarningTitle: 'क्या यह कार्य पहले दर्ज हुआ है?',
      duplicateWarningDesc: 'कुछ समय पहले ऐसा ही रिकॉर्ड दर्ज हुआ था। क्या आप दोबारा दर्ज करना चाहते हैं?',
      appAssignedDateNotice: '(आज की तारीख समीक्षा के लिए दी गई है: कृपया जांचें)',
      testPhrasesTitle: 'त्वरित आवाज़ परीक्षण (Voice Tests)',
      testPhrasesSubtitle: 'नियम-आधारित पहचान का परीक्षण करने के लिए टैप करें:',
      quick1TapTitle: '1-टैप त्वरित लॉगर',
      quick1TapSubtitle: 'प्लॉट A या प्लॉट B पर नियमित काम 1 टैप में दर्ज करें।',
      zeroFriction: 'बिना फॉर्म के तुरंत दर्ज करें',
      headlineLabel: 'कार्य शीर्षक',
      activityDateLabel: 'कार्य की तारीख',
      associatedPlotLabel: 'संबंधित प्लॉट *',
      unspecifiedPlot: 'अज्ञात / अनिर्दिष्ट',
      quantityRecorded: 'दर्ज मात्रा',
      discardDraft: 'ड्राफ्ट हटाएं',
      savePending: 'लंबित के रूप में सहेजें',
      farmerConfirmSave: 'किसान पुष्टि कर सहेजें',
      completeRecordsTitle: 'संपूर्ण कृषि गतिविधि रिकॉर्ड',
      completeRecordsDesc: 'किसान द्वारा दर्ज, AI द्वारा निकाले गए और डेमो रिकॉर्ड।',
      recordNewActivity: 'नया कार्य दर्ज करें',
      voiceRecordingTitle: 'आवाज़ द्वारा कार्य रिकॉर्डिंग और AI विश्लेषण',
      voiceRecordingSubtitle: 'माइक्रोफ़ोन केवल टैप करने पर मांगा जाता है।',
      voiceNotice: 'आवाज़ सूचना:',
      transcribedSpeech: 'पहचाने गए शब्द:',
      structuredFormTitle: 'संरचित फ़ील्ड प्रविष्टि फॉर्म',
      structuredFormSubtitle: 'सटीक विवरण: सीधे आपके स्थानीय डिवाइस स्टोरेज में सुरक्षित।',
      targetPlotLabel: 'लक्ष्य प्लॉट *',
      activityTypeLabel: 'कार्य का प्रकार *',
      areaCoveredLabel: 'कवर किया गया क्षेत्रफल (एकड़)',
      titleDescLabel: 'कार्य शीर्षक / विवरण *',
      titleDescPlaceholder: 'उदा. गहरी गर्मी की जुताई या ट्राइकोडर्मा उपचार',
      quantityOptionalLabel: 'मात्रा (वैकल्पिक)',
      measurementUnitLabel: 'माप की इकाई',
      formSourceFooter: 'स्रोत: किसान द्वारा दर्ज · स्थानीय स्टोरेज में सुरक्षित।',
      saveToRecords: 'गतिविधि रिकॉर्ड में सहेजें',
      duplicateModalTitle: 'क्या यह कार्य पहले दर्ज हुआ है?',
      duplicateModalDesc: 'कुछ समय पहले ऐसा ही रिकॉर्ड दर्ज हुआ था।',
      duplicateModalQuestion: 'क्या आप एक और अलग रिकॉर्ड बनाना चाहते हैं, या मौजूदा रिकॉर्ड को ऐसे ही रखना चाहते हैं?',
      keepExistingOnly: 'केवल मौजूदा रिकॉर्ड रखें',
      createAnotherRecord: 'एक और रिकॉर्ड बनाएं',
      quickLog: '+ दर्ज करें',
      quickLandPrepPaddy: 'खेत तैयारी (धान)',
      quickLandPrepGroundnut: 'खेत तैयारी (मूंगफली)',
      quickIrrigationPaddy: 'सिंचाई (धान)',
      quickFieldInspection: 'खेत निरीक्षण',
      quickFieldInspectionDesc: 'कोई कीट/रोग नहीं पाया गया',
      closeModality: 'बंद करें',
      photoReceiptNotice: 'रसीद / फोटो साक्ष्य',
      cameraNotAvailable: 'चरण 0.5 में कैमरा सुविधा सिम्युलेटेड है। आप रसीद का विवरण फॉर्म में दर्ज कर सकते हैं।',
      listeningStatus: 'हिंदी में सुन रहे हैं...',
      tapToRecordPrompt: 'आवाज़ रिकॉर्ड करने के लिए टैप करें (हिंदी)',
      voiceProtectedNotice: 'अपनी कृषि गतिविधि सामान्य रूप से बोलें। माइक्रोफ़ोन अनुमति सुरक्षित रूप से मांगी जाती है।',
    },
    insights: {
      title: 'खेत अंतर्दृष्टि एवं विश्लेषण',
      subtitle: 'फील्ड इंटेलिजेंस · "क्या हो रहा है और क्यों?"',
      tagline: 'हम याद रखते हैं। समझते हैं। सोचने में मदद करते हैं। निर्णय आप लेते हैं।',
      demoBadge: 'डेमो अंतर्दृष्टि · चरण 0.5',
      groundedNotice: 'सभी विश्लेषणात्मक अवलोकन पूरी तरह से किसान द्वारा दर्ज पुष्ट रिकॉर्ड पर आधारित हैं।',
      policyLabel: 'सिफारिश नीति:',
      styleLabel: 'शैली',
      observationLabel: 'अवलोकन #',
      farmTitle: 'रवि कुमार फार्म (5 एकड़)',
      contextTitle: 'संदर्भ एवं अवलोकन:',
      objectivesLabel: 'किसान उद्देश्य संरेखण:',
      decisionTitle: 'किसान निर्णय क्षेत्र (आप तय करें)',
      acknowledgeButton: '✓ स्वीकार किया: प्रारंभिक खेत तैयारी आधार',
      recordFirstButton: 'पहला कार्य दर्ज करें',
      savedDecisionNote: 'किसान का विकल्प सहेजा गया: आधार स्वीकार किया गया। सिस्टम मेमोरी अपडेट हुई।',
      sampleInsightTitle: 'खेत की प्रारंभिक आधार रेखा का अवलोकन',
      sampleInsightDetail: 'रसपूडीपालेम में रवि कुमार जी के खेत (5.0 एकड़) में प्लॉट A (2 एकड़ धान) और प्लॉट B (3 एकड़ मूंगफली) शुरुआती जुताई अवस्था में पंजीकृत हैं। अभी कोई वाउचर या रसीद सत्यापित नहीं है। जैसे-जैसे आप काम दर्ज करेंगे, विश्लेषण सक्रिय होगा।',
      sampleInsightRecommendation: 'खेत की तैयारी पूरी होने के बाद प्लॉट सीमाओं की पुष्टि करें और बुवाई का काम दर्ज करें।',
    },
    timeline: {
      quantity: 'मात्रा',
      areaCovered: 'कवर किया गया क्षेत्र',
      dataSource: 'डेटा स्रोत',
      confirmationStatus: 'पुष्टि स्थिति',
      verificationStatus: 'स्वतंत्र सत्यापन स्थिति',
      independentlyVerified: 'स्वतंत्र रूप से सत्यापित (दस्तावेज़ / तृतीय-पक्ष)',
      unverified: 'तृतीय-पक्ष सत्यापन लंबित (किसान स्व-घोषणा)',
      correctionHistory: 'सुधार इतिहास',
      editsCount: 'संशोधन',
      unknownNotRecorded: 'अज्ञात / दर्ज नहीं',
      acresUnit: 'एकड़',
      filterAll: 'सभी रिकॉर्ड',
      filterFarmer: 'किसान द्वारा दर्ज',
      filterDemo: 'डेमो रिकॉर्ड',
      allPlots: 'सभी प्लॉट',
      unassignedPlot: 'प्लॉट निर्दिष्ट नहीं',
      allTypes: 'सभी प्रकार',
      deleteConfirmTitle: 'गतिविधि रिकॉर्ड हटाएं?',
      deleteConfirmText: 'क्या आप इस रिकॉर्ड को अपने खेत के रिकॉर्ड से हटाना चाहते हैं?',
      deleteLocalNotice: 'यह क्रिया केवल आपके स्थानीय डिवाइस स्टोरेज को प्रभावित करती है।',
      demoRecordTitle: 'डेमो गतिविधि रिकॉर्ड',
      farmerRecordTitle: 'किसान गतिविधि रिकॉर्ड',
      cancel: 'रद्द करें',
      confirmDelete: 'हटाने की पुष्टि करें',
      close: 'बंद करें',
      farmerConfirmSave: 'किसान पुष्टि कर सहेजें',
      saveChangesHistory: 'परिवर्तन सहेजें और इतिहास दर्ज करें',
      demoBadge: 'डेमो रिकॉर्ड',
      farmerCreatedRecord: 'किसान रिकॉर्ड',
      viewDetails: 'विवरण देखें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      editModalTitle: 'गतिविधि रिकॉर्ड संपादित करें',
      editModalSubtitle: 'परिवर्तन ऑडिट इतिहास में दर्ज किए जाते हैं।',
      demoRecordBadge: 'डेमो रिकॉर्ड',
      farmerCreatedBadge: 'किसान रिकॉर्ड',
      confirmedByLabel: 'पुष्टि कर्ता',
      activityTitleLabel: 'कार्य शीर्षक *',
      recordedQuantityLabel: 'दर्ज मात्रा',
      notesLabel: 'विवरण / नोट्स',
      plotLabel: 'प्लॉट',
      dateLabel: 'कार्य की तारीख',
      unitLabel: 'इकाई',
    },
    sources: {
      farmer_reported: 'किसान द्वारा दर्ज',
      ai_extracted: 'AI द्वारा निकाला गया',
      farmer_confirmed: 'किसान द्वारा पुष्ट',
      verified_document: 'सत्यापित दस्तावेज़',
      demo_data: 'डेमो डेटा',
      unknown: 'अज्ञात स्रोत',
    },
    statuses: {
      draft: 'ड्राफ्ट',
      pending_confirmation: 'पुष्टि लंबित',
      farmer_confirmed: 'किसान द्वारा पुष्ट',
      conflicting: 'विरोधाभासी रिकॉर्ड',
      demo: 'डेमो रिकॉर्ड',
      demo_incomplete: 'डेमो (अधूरा)',
      estimated: 'अनुमानित',
      unknown: 'अज्ञात स्थिति',
    },
    trustIndicators: {
      farmerConfirmed: 'किसान द्वारा पुष्ट',
      pendingConfirmation: 'पुष्टि लंबित',
      draft: 'ड्राफ्ट',
      conflicting: 'विरोधाभासी डेटा',
      demoRecord: 'डेमो रिकॉर्ड',
      demoIncomplete: 'डेमो (अधूरा)',
      estimated: 'अनुमानित',
      unknown: 'अज्ञात',
    },
    market: {
      title: 'मंडी भाव एवं व्यापारिक तैयारी',
      subtitle: 'क्षेत्रीय मंडी बेंचमार्क और व्यापारिक तैयारी।',
      commercialBannerTitle: 'व्यावसायिक अस्वीकरण — चरण 0.5 सिमुलेशन',
      commercialBannerBadge: 'लाइव मंडी नहीं',
      commercialBannerDesc:
        'इस स्क्रीन पर दिखाए गए सभी भाव केवल योजना और अध्ययन के लिए सिम्युलेटेड बेंचमार्क हैं। ये वास्तविक व्यापारिक बिक्री के सुझाव नहीं हैं।',
      registeredCropsTitle: 'पंजीकृत फसलें एवं खेत की स्थिति',
      registeredCropsSubtitle: 'प्लॉट A (धान) और प्लॉट B (मूंगफली) की वर्तमान स्थिति।',
      mandiPricesTitle: 'क्षेत्रीय मंडी बेंचमार्क भाव',
      mandiPricesSubtitle: 'अनकापल्ली और आसपास की मंडियों के अध्ययन भाव।',
      minPrice: 'न्यूनतम भाव',
      modalPrice: 'औसत भाव (Modal)',
      maxPrice: 'अधिकतम भाव',
      perQuintal: 'प्रति क्विंटल',
      readinessLabel: 'व्यापारिक तैयारी',
      cropStageVegetativeSimulated: 'वानस्पतिक चरण (सिम्युलेटेड)',
      estimatedHarvestUnrecorded: 'निर्धारित नहीं (अदर्ज)',
      simulationBadge: 'चरण 0.5 सिमुलेशन',
      simulatedBenchmark: 'सिम्युलेटेड बेंचमार्क',
      trendUp: 'बढ़त',
      trendDown: 'गिरावट',
      trendStable: 'स्थिर',
    },
    sync: {
      onlineLabel: 'ऑनलाइन तैयार',
      onlineDetail: 'डिवाइस स्टोरेज तैयार है',
      offlineLabel: 'ऑफ़लाइन मोड',
      offlineDetail: 'स्थानीय डिवाइस पर सुरक्षित',
      pendingSyncLabel: 'लंबित सिंक',
      pendingSyncDetail: 'रिकॉर्ड स्थानीय रूप से सहेजे गए',
      syncCompletedLabel: 'सिंक पूर्ण',
      syncCompletedDetail: 'सभी परिवर्तन सहेजे गए',
      modalTitle: 'सिंक स्थिति एवं स्टोरेज प्रकटीकरण',
      simulationBadge: 'केवल सिमुलेशन',
      simulationNote:
        'नोट: यह ऐप ब्राउज़र लोकल स्टोरेज का उपयोग करता है। फेज़ 0.5 में कोई रिमोट क्लाउड सर्वर या मल्टी-डिवाइस सिंक कनेक्ट नहीं है।',
    },
    resetModal: {
      title: 'ऐप डेटा रीसेट करें?',
      warningText: 'यह आपके डिवाइस में सहेजे गए डेटा को साफ़ कर प्रारंभिक स्थिति में लाएगा।',
      cancelText: 'रद्द करें',
      confirmText: 'रीसेट की पुष्टि करें',
      whatDeleted: 'किसान द्वारा दर्ज सभी नए कार्य और परिवर्तन हमेशा के लिए हटा दिए जाएंगे।',
      whatRetained: 'रवि कुमार जी का मानक 5-एकड़ बेसलाइन डेमो रिकॉर्ड सुरक्षित रहेगा।',
      recordsResetSuccess: 'किसान गतिविधि रिकॉर्ड सफलतापूर्वक रीसेट हो गए।',
      allResetSuccess: 'सभी डिफ़ॉल्ट सेटिंग्स और डेटा सफलतापूर्वक पुनर्स्थापित हो गए।',
      resetError: 'स्टोरेज डेटा रीसेट करना विफल रहा।',
      partialResetError: 'आंशिक रीसेट त्रुटि: कुछ स्टोरेज प्रविष्टियां साफ़ नहीं हो सकीं।',
    },
    quickRecordModal: {
      title: 'त्वरित कार्य दर्ज करें (Quick Record)',
      subtitle: 'खेत के काम आसानी से सीधे अपने रिकॉर्ड में जोड़ें।',
      plotLabel: 'खेत प्लॉट',
      eventTypeLabel: 'कार्य का प्रकार',
      dateLabel: 'तारीख',
      titleLabel: 'कार्य शीर्षक',
      quantityLabel: 'मात्रा (यदि लागू हो)',
      unitLabel: 'इकाई',
      costLabel: 'लागत (रुपये में, यदि लागू हो)',
      savingLabel: 'सहेजा जा रहा है...',
      dataPreservedNotice: 'आपके द्वारा दर्ज विवरण नीचे सुरक्षित हैं। आप दोबारा सहेजने का प्रयास कर सकते हैं।',
    },
    preferencesModal: {
      title: 'किसान प्रोफ़ाइल एवं प्राथमिकताएं',
      profileTab: 'किसान प्रोफ़ाइल',
      preferencesTab: 'ऐप प्राथमिकताएं ("ऐप कैसे काम करे?")',
      saveAndApply: 'सहेजें और लागू करें',
      appLanguageLabel: 'ऐप की भाषा (App Language)',
      voiceLanguageLabel: 'आवाज़ इनपुट की भाषा (Voice Language)',
      interactionModeLabel: 'इंटरैक्शन मोड (Interaction Mode)',
      aiResponseStyleLabel: 'प्रतिक्रिया शैली (Response Style)',
      recommendationModeLabel: 'सुझाव सूचनाएं',
      themeLabel: 'थीम (Theme)',
      textSizeLabel: 'फ़ॉन्ट आकार (Text Size)',
      contrastLabel: 'कंट्रास्ट (Contrast)',
      readAloudLabel: 'आवाज़ में पढ़कर सुनाएं (Read Aloud)',
      reduceMotionLabel: 'एनिमेशन कम करें (Reduce Motion)',
      interactionPrefLabel: 'प्राथमिक इंटरैक्शन तरीका',
      quietHoursLabel: 'शांत समय (Quiet Hours: 21:00 - 06:00)',
      translationNote: 'नोट: मुख्य इंटरफ़ेस हिंदी में है; कृषि के विशिष्ट तकनीकी शब्द मानक रूप में रखे गए हैं।',
      demoNotice: 'डेमो किसान सूचना: ये रवि कुमार (रवि जी, रसपूडीपालेम) के डेमो मान हैं। फ़ोन नंबर, GPS और मृदा परीक्षण अभी दर्ज नहीं हैं। हम अधूरा डेटा कभी नहीं बनाते।',
      fullNameLabel: 'पूरा नाम *',
      preferredNameLabel: 'संबोधन / पसंदीदा नाम *',
      roleLabel: 'भूमिका',
      experienceYearsLabel: 'अनुभव (वर्ष)',
      digitalComfortLabel: 'डिजिटल समझ',
      villageLabel: 'गाँव',
      districtLabel: 'ज़िला',
      stateLabel: 'राज्य',
      countryLabel: 'देश',
      primaryObjectivesLabel: 'प्राथमिक उद्देश्य',
      subscriptionsTitle: 'अलर्ट एवं रिमाइंडर सदस्यताएं',
      importantAlertsLabel: 'महत्वपूर्ण अलर्ट:',
      activityRemindersLabel: 'कार्य रिमाइंडर:',
      quietHoursNotice: 'इस समय के दौरान कोई भी आवाज़ सूचना नहीं बजेगी।',
      timeTo: 'से',
      recImportant: 'केवल महत्वपूर्ण स्थितियों में (डिफ़ॉल्ट)',
      recAll: 'सभी सुझाव',
      recRequested: 'केवल अनुरोध करने पर',
      interactionBalanced: 'संतुलित (डिफ़ॉल्ट)',
      interactionTouch: 'टच प्राथमिकता',
      interactionVoice: 'आवाज़ प्राथमिकता',
      digitalBasic: 'शुरुआती',
      digitalIntermediate: 'मध्यम (डिफ़ॉल्ट)',
      digitalAdvanced: 'उन्नत',
      objProfitability: 'खेती की लाभप्रदता में सुधार',
      objReduceCosts: 'लागत खर्च कम करना',
      objImproveYield: 'फसल की उपज बढ़ाना',
      objSaveWater: 'पानी बचाना',
      objAccurateRecords: 'खेत के सटीक रिकॉर्ड बनाए रखना',
      alertPestOutbreak: 'कीट और रोग प्रकोप अलर्ट',
      alertExtremeWeather: 'गंभीर मौसम की चेतावनी',
      alertMarketSpike: 'मंडी भाव में उतार-चढ़ाव',
      alertGovtScheme: 'सरकारी योजना की जानकारी',
      remIrrigation: 'सिंचाई कार्यक्रम',
      remFertilizer: 'उर्वरक प्रयोग का समय',
      remPestScouting: 'खेत निरीक्षण के दिन',
      remHarvestWindow: 'फसल कटाई समय सलाह',
      contrastStandard: 'मानक',
      contrastHigh: 'उच्च कंट्रास्ट (धूप के लिए)',
      languageIndependent: 'भाषा सेटिंग्स (स्वतंत्र)',
      teluguDefault: 'तेलुगु डिफ़ॉल्ट',
      modeQuick: 'त्वरित (डिफ़ॉल्ट — 1-टैप त्वरित क्रियाएं)',
      modeAssisted: 'सहायता प्राप्त (चरण-दर-चरण मार्गदर्शन)',
      modeDetailed: 'विस्तृत (पूर्ण फॉर्म और मेटाडेटा)',
      styleSimple: 'सरल (स्पष्ट, सीधे सारांश)',
      styleBalanced: 'संतुलित (मानक संदर्भ)',
      styleDetailed: 'विस्तृत (व्यापक कृषि विवरण)',
      themeSystem: 'सिस्टम (स्वतः)',
      themeLight: 'लाइट थीम',
      themeDark: 'डार्क थीम',
      textSizeStandard: 'मानक',
      textSizeLarge: 'बड़ा (बाहरी कार्य के लिए उपयुक्त)',
      textSizeExtraLarge: 'अतिरिक्त बड़ा',
      displaySectionTitle: 'डिस्प्ले, टेक्स्ट आकार एवं कंट्रास्ट',
      dismiss: 'खारिज करें',
    },
    eventTypes: {
      land_prep: 'खेत तैयारी',
      sowing: 'बीज बुवाई',
      irrigation: 'सिंचाई',
      fertilizer: 'खाद / उर्वरक',
      spray: 'दवा छिड़काव / उपचार',
      weeding: 'निराई-गुड़ाई',
      pest_scouting: 'कीट निरीक्षण',
      observation: 'सामान्य अवलोकन',
      harvest: 'फसल कटाई',
      sale: 'उपज बिक्री',
      other: 'अन्य कार्य',
    },
    units: {
      hours: 'घंटे',
      kg: 'किलोग्राम (किग्रा)',
      bags: 'बोरी / बैग',
      liters: 'लीटर',
      quintals: 'क्विंटल',
      acres: 'एकड़',
    },
    common: {
      emptyTitle: 'आपके खेत का रिकॉर्ड यहां शुरू होता है',
      emptyDesc: 'अभी तक कोई कार्य दर्ज नहीं हुआ है। अपने खेत का इतिहास बनाने के लिए पहला कार्य दर्ज करें।',
      emptyAction: 'पहला कार्य दर्ज करें',
      errorTitle: 'स्टोरेज या लोडिंग समस्या',
      errorDesc: 'आपकी सहेजी गई जानकारी सुरक्षित है। डिवाइस मेमोरी में डेटा बरकरार है।',
      localCacheNote: 'लोकल डिवाइस स्टोरेज में डेटा सुरक्षित रखा गया है।',
    },
  },
};

/**
 * Safely retrieves translation dictionary with fallback to English for any missing keys
 */
export function getTranslations(lang?: AppLanguage): TranslationDictionary {
  if (lang && TRANSLATIONS[lang]) {
    return TRANSLATIONS[lang];
  }
  return TRANSLATIONS.English;
}
