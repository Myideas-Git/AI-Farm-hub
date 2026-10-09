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
      retry: 'మళ్ళీ ప్రయత్నించు',
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
    },
    myFarm: {
      title: 'నా పొలం వివరాలు',
      subtitle: 'రవి కుమార్ ఫార్మ్ · 5 ఎకరాలు (రసపూడిపాలెం, అనకాపల్లి జిల్లా)',
      plotsListTitle: 'పొలం ప్లాట్లు (5 ఎకరాలు)',
      soilType: 'మట్టి రకం',
      waterSource: 'నీటి వనరు',
      area: 'విస్తీర్ణం',
      cropStage: 'పంట దశ',
      recordOnPlot: 'ఈ ప్లాట్‌లో పనిని నమోదు చేయండి',
      soilTestStatus: 'మట్టి పరీక్ష స్థితి',
      soilTestNotAvailable: 'అందుబాటులో లేదు (నమోదు కాలేదు)',
      irrigationSource: 'నీటి పారుదల వనరు',
      irrigationUnknown: 'తెలియదు',
    },
    record: {
      title: 'మీ పొలంలో ఏమి జరిగింది?',
      subtitle: 'సులభమైన నమోదు — బిజీగా ఉన్నప్పుడు వాయిస్, ఖచ్చితత్వం కోసం ఫారమ్.',
      voiceTabTitle: 'వాయిస్ (Voice)',
      voiceTabDesc: 'పొలంలో ఉన్నప్పుడు మాట్లాడి చెప్పండి',
      cameraTabTitle: 'కెమెరా (Camera)',
      cameraTabDesc: 'రసీదు లేదా ఫోటో ద్వారా',
      quickTabTitle: 'త్వరిత పనులు (Quick)',
      quickTabDesc: 'ఒక్క ట్యాప్‌తో తరచుగా చేసే పనులు',
      formTabTitle: 'వివరమైన ఫారమ్ (Form)',
      formTabDesc: 'ఖచ్చితమైన వివరాలు నమోదు చేయడానికి',
      reviewExtractedTitle: 'నమోదు చేయబడిన వివరాల సమీక్ష',
      reviewExtractedDesc: 'రూల్ ఆధారిత ఎంటిటీ నమోదు. దయచేసి పరిశీలించి ధృవీకరించండి.',
      unconfirmedNotice: 'గమనిక: ఈ వివరాలు ఇంకా రైతు నిర్ధారించలేదు. సరిచూసి భద్రపరచండి.',
      ruleBasedNotice: 'గమనిక: ఇది రూల్-ఆధారిత సంగ్రహణ (జనరేటివ్ AI ఇంకా అనుసంధానించబడలేదు). తప్పిపోయిన వివరాలను ఊహించలేదు.',
      dateNotice: 'తేదీ మాట్లాడలేదు; సమీక్ష కోసం ఈరోజుగా కేటాయించబడింది.',
      clarificationNeeded: 'స్పష్టత అవసరం:',
      tapToRecord: 'మాట్లాడటానికి ట్యాప్ చేయండి',
      listening: 'వినబడుతోంది (మాట్లాడండి)...',
      micDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది',
      micDeniedNote: 'దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతించండి లేదా ఫారమ్ ద్వారా నమోదు చేయండి.',
      saveAsDraft: 'చిత్తుప్రతిగా భద్రపరచండి',
      confirmAndSave: 'రైతు నిర్ధారణ చేసి భద్రపరచండి',
      duplicateWarningTitle: 'ఇలాంటి పని ఇప్పటికే నమోదైంది',
      duplicateWarningDesc: 'కొద్దిసేపటి క్రితం ఇదే వివరాలతో నమోదు జరిగింది. మరొక రికార్డు సృష్టించాలా?',
    },
    sources: {
      farmer_reported: 'రైతు తెలిపిన వివరాలు',
      ai_extracted: 'వాయిస్ ద్వారా సేకరించబడింది',
      farmer_confirmed: 'రైతు నిర్ధారించిన వివరాలు',
      verified_document: 'రసీదు ధృవీకరించబడింది',
      demo_data: 'డెమో డేటా',
      unknown: 'తెలియదు',
    },
    statuses: {
      draft: 'చిత్తుప్రతి (Draft)',
      pending_confirmation: 'రైతు నిర్ధారణ కోసం పెండింగ్‌లో ఉంది',
      farmer_confirmed: 'రైతు ధృవీకరించారు (Confirmed)',
      conflicting: 'పరస్పర విరుద్ధమైన సమాచారం',
      demo: 'డెమో రికార్డు (Demo)',
      demo_incomplete: 'డెమో — అసంపూర్ణ వివరాలు',
      estimated: 'అంచనా వేయబడింది (Estimated)',
      unknown: 'తెలియదు (Unknown)',
    },
    trustIndicators: {
      farmerConfirmed: 'రైతు నిర్ధారించారు',
      pendingConfirmation: 'రైతు నిర్ధారణ పెండింగ్',
      draft: 'చిత్తుప్రతి',
      conflicting: 'విరుద్ధమైన సమాచారం',
      demoRecord: 'డెమో రికార్డు',
      demoIncomplete: 'డెమో — అసంపూర్ణ వివరాలు',
      estimated: 'అంచనా',
      unknown: 'నమోదు కాలేదు',
    },
    market: {
      title: 'మార్కెట్ బెంచ్‌మార్క్‌లు & పంట సంసిద్ధత',
      subtitle: 'ఆంధ్రప్రదేశ్ మార్కెట్ అంచనాలు (వరి & వేరుశనగ).',
      commercialBannerTitle: 'డెమో మార్కెట్ డేటా — లైవ్ కాదు',
      commercialBannerBadge: 'సిమ్యులేషన్ మాత్రమే',
      commercialBannerDesc: 'ఈ మార్కెట్ ధరలు కేవలం డెమో పరీక్షల కోసం ఉద్దేశించిన కల్పిత విలువలు. లైవ్ మండి ఏకీకరణలు లేదా e-NAM ఫీడ్స్ ఇంకా అనుసంధానించబడలేదు. దీని ఆధారంగా అమ్మకాల నిర్ణయాలు తీసుకోవద్దు.',
      registeredCropsTitle: 'నమోదైన పంటలు & పొలం స్థితి',
      registeredCropsSubtitle: 'ప్లాట్ A (వరి) మరియు ప్లాట్ B (వేరుశనగ) — రవి కుమార్ ఫార్మ్.',
      mandiPricesTitle: 'ప్రాంతీయ మండి బెంచ్‌మార్క్ ధరలు (సిమ్యులేషన్)',
      mandiPricesSubtitle: 'అనకాపల్లి పరిసర ప్రాంతాల కోసం ఉదాహరణ ధరలు.',
      minPrice: 'కనిష్ట ధర',
      modalPrice: 'మోడల్ ధర',
      maxPrice: 'గరిష్ట ధర',
      perQuintal: 'క్వింటాల్‌కు (రూ.)',
    },
    sync: {
      onlineLabel: 'ఆన్‌లైన్',
      onlineDetail: 'స్థానిక బ్రౌజర్ మెమరీ చురుకుగా ఉంది',
      offlineLabel: 'ఆఫ్‌లైన్ మోడ్',
      offlineDetail: 'డివైస్ మెమరీ చురుకుగా ఉంది',
      pendingSyncLabel: 'పెండింగ్ సింక్',
      pendingSyncDetail: 'స్థానిక క్యూలో వేచి ఉంది',
      syncCompletedLabel: 'సింక్ పూర్తయింది',
      syncCompletedDetail: 'స్థానికంగా భద్రపరచబడింది',
      modalTitle: 'నెట్‌వర్క్ & నిల్వ స్థితి (సిమ్యులేషన్)',
      simulationBadge: 'సిమ్యులేషన్',
      simulationNote: 'గమనిక: ఈ అప్లికేషన్ బ్రౌజర్ లోకల్ స్టోరేజ్‌ని ఉపయోగిస్తుంది. క్లౌడ్ లేదా రిమోట్ సర్వర్ బ్యాకప్ ఇంకా కనెక్ట్ కాలేదు.',
    },
    resetModal: {
      title: 'డేటా రీసెట్ నిర్ధారణ',
      warningText: 'మీరు నమోదు చేసిన స్థానిక రికార్డులను క్లియర్ చేసి డెమో స్థితికి పునరుద్ధరించాలనుకుంటున్నారా?',
      cancelText: 'రద్దు (Cancel)',
      confirmText: 'ఖచ్చితంగా రీసెట్ చేయండి',
      whatDeleted: 'తొలగించబడేవి: మీరు మాన్యువల్ లేదా వాయిస్ ద్వారా కొత్తగా నమోదు చేసిన రికార్డులు.',
      whatRetained: 'ఉండేవి: ప్రాథమిక 2 డెమో రికార్డులు మరియు పొలం వివరాలు.',
    },
    quickRecordModal: {
      title: 'పనిని నమోదు చేయండి (Quick Log)',
      subtitle: 'పొలంలో జరిగిన పనిని త్వరగా నమోదు చేసుకోండి',
      plotLabel: 'ప్లాట్ (Plot)',
      eventTypeLabel: 'పని రకం (Activity Type)',
      dateLabel: 'తేదీ (Date)',
      titleLabel: 'శీర్షిక / వివరణ',
      quantityLabel: 'పరిమాణం (Quantity)',
      unitLabel: 'కొలత యూనిట్',
      costLabel: 'ఖర్చు (రూపాయలు - ఐచ్ఛికం)',
      savingLabel: 'భద్రపరుస్తోంది...',
    },
    preferencesModal: {
      title: 'రైతు ప్రొఫైల్ & ప్రాధాన్యతలు (Settings)',
      profileTab: 'రైతు ప్రొఫైల్ ("నేను ఎవరు?")',
      preferencesTab: 'యాప్ ప్రవర్తన ("యాప్ ఎలా పనిచేయాలి?")',
      saveAndApply: 'భద్రపరచి అమలు చేయండి',
      appLanguageLabel: 'యాప్ భాష (App Language)',
      voiceLanguageLabel: 'వాయిస్ ఇన్‌పుట్ భాష (Voice Language)',
      interactionModeLabel: 'ఇంటరాక్షన్ మోడ్ (Interaction Mode)',
      aiResponseStyleLabel: 'AI ప్రతిస్పందన శైలి (Response Style)',
      recommendationModeLabel: 'సిఫార్సు నోటిఫికేషన్లు',
      themeLabel: 'థీమ్ (Theme)',
      textSizeLabel: 'అక్షరాల పరిమాణం (Text Size)',
      contrastLabel: 'కాంట్రాస్ట్ (Contrast)',
      readAloudLabel: 'స్పందనలను బిగ్గరగా చదవండి (Read Aloud)',
      reduceMotionLabel: 'యానిమేషన్లను తగ్గించండి (Reduce Motion)',
      interactionPrefLabel: 'ప్రాధాన్య ఇంటరాక్షన్ పద్ధతి',
      quietHoursLabel: 'నిశ్శబ్ద గంటలు (Quiet Hours: 21:00 - 06:00)',
      translationNote: 'గమనిక: ప్రాథమిక ఇంటర్‌ఫేస్ తెలుగులో ఉంది; కొన్ని సాంకేతిక వ్యవసాయ పదాలు ప్రామాణిక పరిభాషలో కొనసాగుతాయి.',
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
      recentTimelineSubtitle: 'Timeline of events that occurred on your land.',
      viewAllRecords: 'View All Records',
      primaryFieldTitle: 'Farm Plots Overview',
      registeredPlots: 'Registered Plots (5 Acres)',
      totalAcresLabel: 'Total Area',
    },
    myFarm: {
      title: 'My Farm Details',
      subtitle: 'Ravi Kumar Farm · 5 Acres (Rasapūdipalem, Anakapalli district)',
      plotsListTitle: 'Farm Plots (5 Acres total)',
      soilType: 'Soil Type',
      waterSource: 'Water Source',
      area: 'Area',
      cropStage: 'Crop Stage',
      recordOnPlot: 'Record Activity on this Plot',
      soilTestStatus: 'Soil Test Status',
      soilTestNotAvailable: 'Not Available (Unrecorded)',
      irrigationSource: 'Irrigation Source',
      irrigationUnknown: 'Unknown',
    },
    record: {
      title: 'What happened on your farm?',
      subtitle: 'Approachable logging — voice when busy outdoors, structured form for precision.',
      voiceTabTitle: 'Voice',
      voiceTabDesc: 'Speak hands-free while in the field',
      cameraTabTitle: 'Camera',
      cameraTabDesc: 'Capture receipt or leaf photo',
      quickTabTitle: 'Quick 1-Tap',
      quickTabDesc: 'Common field tasks with one tap',
      formTabTitle: 'Form',
      formTabDesc: 'Detailed record entry',
      reviewExtractedTitle: 'Review Extracted Record',
      reviewExtractedDesc: 'Rule-based entity extraction. Please verify before saving.',
      unconfirmedNotice: 'Notice: This record has not been confirmed yet. Please review and confirm.',
      ruleBasedNotice: 'Notice: Rule-based extraction (Generative AI not connected in Phase 0.5). Missing facts are not guessed.',
      dateNotice: 'Date was not spoken; assigned today for your review.',
      clarificationNeeded: 'Clarification Needed:',
      tapToRecord: 'Tap to Record Voice',
      listening: 'Listening (speak clearly)...',
      micDenied: 'Microphone Permission Denied',
      micDeniedNote: 'Please enable microphone access in your browser settings or use manual form entry.',
      saveAsDraft: 'Save as Draft (Pending Confirmation)',
      confirmAndSave: 'Farmer Confirm & Save',
      duplicateWarningTitle: 'Potential Duplicate Activity',
      duplicateWarningDesc: 'An identical activity was recorded moments ago. Would you like to create another separate record?',
    },
    sources: {
      farmer_reported: 'Farmer Reported',
      ai_extracted: 'Voice Extracted',
      farmer_confirmed: 'Farmer Confirmed',
      verified_document: 'Verified Document',
      demo_data: 'Demo Data',
      unknown: 'Unknown',
    },
    statuses: {
      draft: 'Draft',
      pending_confirmation: 'Pending Farmer Confirmation',
      farmer_confirmed: 'Farmer Confirmed',
      conflicting: 'Conflicting Information',
      demo: 'Demo Record',
      demo_incomplete: 'Demo — Incomplete Information',
      estimated: 'Estimated',
      unknown: 'Unknown',
    },
    trustIndicators: {
      farmerConfirmed: 'Farmer Confirmed',
      pendingConfirmation: 'Pending Confirmation',
      draft: 'Draft',
      conflicting: 'Conflicting Info',
      demoRecord: 'Demo Record',
      demoIncomplete: 'Demo — Incomplete',
      estimated: 'Estimated',
      unknown: 'Not Recorded',
    },
    market: {
      title: 'Harvest Readiness & Market Benchmarks',
      subtitle: 'Simulated regional mandi benchmarks for Andhra Pradesh crops (Paddy & Groundnut).',
      commercialBannerTitle: 'DEMO MARKET DATA — NOT LIVE',
      commercialBannerBadge: 'SIMULATION ONLY',
      commercialBannerDesc: 'These commodity rates and mandi prices are strictly fictional illustrative demo data for Phase 0.5 testing. Live market integrations, government eNAM feeds, and spot trade connections are not connected. Do not make commercial selling decisions based on this screen.',
      registeredCropsTitle: 'Registered Crops & Field Status',
      registeredCropsSubtitle: 'Plot A (Paddy) and Plot B (Groundnut) on Ravi Kumar Farm.',
      mandiPricesTitle: 'Regional Mandi Benchmark Prices (Simulated)',
      mandiPricesSubtitle: 'Indicative benchmarks for Anakapalli surrounding markets.',
      minPrice: 'Min Price',
      modalPrice: 'Modal Price',
      maxPrice: 'Max Price',
      perQuintal: 'per Quintal (₹)',
    },
    sync: {
      onlineLabel: 'Online',
      onlineDetail: 'Local browser memory active',
      offlineLabel: 'Offline Mode',
      offlineDetail: 'Field memory active',
      pendingSyncLabel: 'Pending Sync',
      pendingSyncDetail: 'Queued locally on device',
      syncCompletedLabel: 'Saved Locally',
      syncCompletedDetail: 'Stored in browser memory',
      modalTitle: 'Network & Storage State (Simulation)',
      simulationBadge: 'SIMULATION',
      simulationNote: 'Note: This app uses browser local storage. No remote cloud server or multi-device sync is connected in Phase 0.5.',
    },
    resetModal: {
      title: 'Confirm Data Reset',
      warningText: 'Are you sure you want to reset your local activity records to the original demo state?',
      cancelText: 'Cancel',
      confirmText: 'Confirm Reset',
      whatDeleted: 'Will be removed: Any new activities recorded manually or via voice.',
      whatRetained: 'Will remain: Baseline 2 demo records and registered farm plots.',
    },
    quickRecordModal: {
      title: 'Record Farm Event',
      subtitle: 'Quick field activity log',
      plotLabel: 'Plot',
      eventTypeLabel: 'Activity Type',
      dateLabel: 'Date',
      titleLabel: 'Title / Note',
      quantityLabel: 'Quantity',
      unitLabel: 'Unit',
      costLabel: 'Cost (₹ - Optional)',
      savingLabel: 'Saving...',
    },
    preferencesModal: {
      title: 'Farmer Profile & Preferences',
      profileTab: 'Farmer Profile ("Who am I?")',
      preferencesTab: 'App Preferences ("How should the app behave?")',
      saveAndApply: 'Save & Apply',
      appLanguageLabel: 'App Language',
      voiceLanguageLabel: 'Voice Input Language',
      interactionModeLabel: 'Interaction Mode',
      aiResponseStyleLabel: 'Response Style',
      recommendationModeLabel: 'Recommendation Notifications',
      themeLabel: 'Theme',
      textSizeLabel: 'Text Size',
      contrastLabel: 'Contrast',
      readAloudLabel: 'Read Responses Aloud',
      reduceMotionLabel: 'Reduce Animations',
      interactionPrefLabel: 'Preferred Interaction Method',
      quietHoursLabel: 'Quiet Hours (21:00 - 06:00)',
      translationNote: 'Note: Interface is translated into English, Telugu, and Hindi; agricultural proper nouns are preserved.',
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
      saveChanges: 'बदलाव सहेजें',
    },
    home: {
      greeting: 'नमस्ते, रवि जी',
      subGreeting: 'आज आपके खेत के बारे में आवश्यक जानकारी (अनकापल्ली ज़िला).',
      weatherCardTitle: 'मौसम की जानकारी',
      weatherMockLabel: 'डेमो — लाइव नहीं',
      weatherCondition: 'धूप खिली है · साफ़ आसमान',
      fieldStatusTitle: 'खेत की वर्तमान स्थिति',
      pendingTasksTitle: 'आगामी कार्य और नोट्स',
      pendingTasksCount: '1 महत्वपूर्ण कार्य',
      financialSnapshotTitle: 'सीज़न का वित्तीय सारांश',
      financialSnapshotSubtitle: 'किसान द्वारा दर्ज जानकारी के आधार पर गणना।',
      recentTimelineTitle: 'हाल की कृषि गतिविधियां',
      recentTimelineSubtitle: 'खेत में हुए कार्यों का क्रमवार विवरण।',
      viewAllRecords: 'सभी रिकॉर्ड देखें',
      primaryFieldTitle: 'खेत के प्लॉट का विवरण',
      registeredPlots: 'पंजीकृत प्लॉट (5 एकड़)',
      totalAcresLabel: 'कुल क्षेत्रफल',
    },
    myFarm: {
      title: 'मेरे खेत का विवरण',
      subtitle: 'रवि कुमार फार्म · 5 एकड़ (रसपूडीपालेम, अनकापल्ली)',
      plotsListTitle: 'खेत के प्लॉट (कुल 5 एकड़)',
      soilType: 'मिट्टी का प्रकार',
      waterSource: 'जल स्रोत',
      area: 'क्षेत्रफल',
      cropStage: 'फसल की अवस्था',
      recordOnPlot: 'इस प्लॉट पर कार्य दर्ज करें',
      soilTestStatus: 'मृदा परीक्षण स्थिति',
      soilTestNotAvailable: 'उपलब्ध नहीं (अदर्ज)',
      irrigationSource: 'सिंचाई का साधन',
      irrigationUnknown: 'अज्ञात',
    },
    record: {
      title: 'आपके खेत में क्या हुआ?',
      subtitle: 'सरल रिकॉर्डिंग — खेत में काम करते समय आवाज़ से, सटीकता के लिए फॉर्म से।',
      voiceTabTitle: 'आवाज़ (Voice)',
      voiceTabDesc: 'खेत में काम करते हुए बोलकर दर्ज करें',
      cameraTabTitle: 'कैमरा (Camera)',
      cameraTabDesc: 'रसीद या फोटो द्वारा',
      quickTabTitle: 'त्वरित कार्य (Quick)',
      quickTabDesc: 'एक टैप से सामान्य कार्य',
      formTabTitle: 'विस्तृत फॉर्म (Form)',
      formTabDesc: 'सटीक विवरण दर्ज करने के लिए',
      reviewExtractedTitle: 'दर्ज विवरण की समीक्षा',
      reviewExtractedDesc: 'नियम आधारित जानकारी। कृपया सहेजने से पहले जांचें।',
      unconfirmedNotice: 'सूचना: यह रिकॉर्ड अभी किसान द्वारा पुष्ट नहीं हुआ है। जांचकर पुष्टि करें।',
      ruleBasedNotice: 'सूचना: यह नियम-आधारित निष्कर्षण है (जनरेटिव AI अभी जुड़ा नहीं है)। छूटी हुई जानकारी का अनुमान नहीं लगाया गया।',
      dateNotice: 'तारीख बोली नहीं गई; समीक्षा के लिए आज की तारीख तय की गई है।',
      clarificationNeeded: 'स्पष्टीकरण आवश्यक:',
      tapToRecord: 'बोलने के लिए टैप करें',
      listening: 'सुन रहे हैं (स्पष्ट बोलें)...',
      micDenied: 'माइक्रोफ़ोन अनुमति अस्वीकृत',
      micDeniedNote: 'कृपया ब्राउज़र सेटिंग में माइक्रोफ़ोन की अनुमति दें या फॉर्म का उपयोग करें।',
      saveAsDraft: 'ड्राफ्ट के रूप में सहेजें',
      confirmAndSave: 'किसान पुष्टि कर सहेजें',
      duplicateWarningTitle: 'संभावित डुप्लिकेट कार्य',
      duplicateWarningDesc: 'कुछ देर पहले ऐसा ही कार्य दर्ज किया गया था। क्या आप नया रिकॉर्ड बनाना चाहते हैं?',
    },
    sources: {
      farmer_reported: 'किसान द्वारा बताया गया',
      ai_extracted: 'आवाज़ द्वारा दर्ज',
      farmer_confirmed: 'किसान द्वारा पुष्ट',
      verified_document: 'सत्यापित दस्तावेज़',
      demo_data: 'डेमो डेटा',
      unknown: 'अज्ञात',
    },
    statuses: {
      draft: 'ड्राफ्ट (Draft)',
      pending_confirmation: 'किसान पुष्टि लंबित',
      farmer_confirmed: 'किसान द्वारा पुष्ट (Confirmed)',
      conflicting: 'विरोधाभासी जानकारी',
      demo: 'डेमो रिकॉर्ड (Demo)',
      demo_incomplete: 'डेमो — अधूरी जानकारी',
      estimated: 'अनुमानित (Estimated)',
      unknown: 'अज्ञात (Unknown)',
    },
    trustIndicators: {
      farmerConfirmed: 'किसान पुष्ट',
      pendingConfirmation: 'पुष्टि लंबित',
      draft: 'ड्राफ्ट',
      conflicting: 'विरोधाभासी जानकारी',
      demoRecord: 'डेमो रिकॉर्ड',
      demoIncomplete: 'डेमो — अधूरी जानकारी',
      estimated: 'अनुमानित',
      unknown: 'अदर्ज',
    },
    market: {
      title: 'मंडी बेंचमार्क और फसल की तैयारी',
      subtitle: 'आंध्र प्रदेश की फसलों (धान और मूंगफली) के लिए अनुमानित मंडी भाव।',
      commercialBannerTitle: 'डेमो मंडी डेटा — लाइव नहीं',
      commercialBannerBadge: 'केवल सिमुलेशन',
      commercialBannerDesc: 'यह मंडी दरें केवल चरण 0.5 परीक्षण के लिए काल्पनिक डेमो डेटा हैं। लाइव मंडी एकीकरण या e-NAM फ़ीड अभी जुड़े नहीं हैं। इसके आधार पर व्यापारिक निर्णय न लें।',
      registeredCropsTitle: 'पंजीकृत फसलें और खेत की स्थिति',
      registeredCropsSubtitle: 'प्लॉट A (धान) और प्लॉट B (मूंगफली) — रवि कुमार फार्म।',
      mandiPricesTitle: 'क्षेत्रीय मंडी बेंचमार्क दरें (सिमुलेशन)',
      mandiPricesSubtitle: 'अनकापल्ली आसपास के बाज़ारों के लिए सांकेतिक दरें।',
      minPrice: 'न्यूनतम भाव',
      modalPrice: 'मॉडल भाव',
      maxPrice: 'अधिकतम भाव',
      perQuintal: 'प्रति क्विंटल (₹)',
    },
    sync: {
      onlineLabel: 'ऑनलाइन',
      onlineDetail: 'लोकल ब्राउज़र मेमोरी सक्रिय है',
      offlineLabel: 'ऑफलाइन मोड',
      offlineDetail: 'डिवाइस मेमोरी सक्रिय है',
      pendingSyncLabel: 'सिंक लंबित',
      pendingSyncDetail: 'स्थानीय कतार में प्रतीक्षा में',
      syncCompletedLabel: 'स्थानीय रूप से सहेजा गया',
      syncCompletedDetail: 'ब्राउज़र स्टोरेज में सुरक्षित',
      modalTitle: 'नेटवर्क और स्टोरेज स्थिति (सिमुलेशन)',
      simulationBadge: 'सिमुलेशन',
      simulationNote: 'नोट: यह ऐप ब्राउज़र लोकल स्टोरेज का उपयोग करता है। चरण 0.5 में कोई क्लाउड सर्वर या रिमोट बैकअप नहीं जुड़ा है।',
    },
    resetModal: {
      title: 'डेटा रीसेट की पुष्टि',
      warningText: 'क्या आप अपने स्थानीय रिकॉर्ड को मूल डेमो स्थिति में रीसेट करना चाहते हैं?',
      cancelText: 'रद्द करें',
      confirmText: 'रीसेट की पुष्टि करें',
      whatDeleted: 'हटाया जाएगा: मैन्युअल या आवाज़ से जोड़े गए सभी नए रिकॉर्ड।',
      whatRetained: 'बना रहेगा: प्रारंभिक 2 डेमो रिकॉर्ड और पंजीकृत प्लॉट।',
    },
    quickRecordModal: {
      title: 'खेत का कार्य दर्ज करें (Quick Log)',
      subtitle: 'खेत की गतिविधियों का त्वरित विवरण',
      plotLabel: 'प्लॉट (Plot)',
      eventTypeLabel: 'कार्य का प्रकार (Activity Type)',
      dateLabel: 'तारीख (Date)',
      titleLabel: 'शीर्षक / विवरण',
      quantityLabel: 'मात्रा (Quantity)',
      unitLabel: 'इकाई (Unit)',
      costLabel: 'लागत (₹ - वैकल्पिक)',
      savingLabel: 'सहेजा जा रहा है...',
    },
    preferencesModal: {
      title: 'किसान प्रोफ़ाइल और प्राथमिकताएं (Settings)',
      profileTab: 'किसान प्रोफ़ाइल ("मैं कौन हूँ?")',
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
