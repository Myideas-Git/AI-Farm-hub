/**
 * AI Farm Hub — Multilingual Localization System
 * Languages supported: Telugu (తెలుగు), English, Hindi (हिन्दी)
 * Note: If a specific agricultural term is untranslated, it falls back cleanly with transparent notation.
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
    voiceInput: string;
    cameraInput: string;
    quickAction: string;
    detailedForm: string;
    viewTimeline: string;
    resetDemo: string;
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
    unknown: string;
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
      voiceInput: 'వాయిస్ ద్వారా',
      cameraInput: 'కెమెరా ద్వారా',
      quickAction: 'త్వరిత నమోదు',
      detailedForm: 'వివరమైన ఫారం',
      viewTimeline: 'టైమ్‌లైన్ చూడండి',
      resetDemo: 'డెమో డేటాను రీసెట్ చేయండి',
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
    },
    myFarm: {
      title: 'నా పొలం వివరాలు',
      subtitle: 'రవి కుమార్ ఫార్మ్ · 5 ఎకరాలు (రసపూడిపాలెం, అనకాపల్లి)',
      plotsListTitle: 'పొలం ప్లాట్లు (5 ఎకరాలు)',
      soilType: 'మట్టి రకం',
      waterSource: 'నీటి వనరు',
      area: 'విస్తీర్ణం',
      cropStage: 'పంట దశ',
      recordOnPlot: 'ఈ ప్లాట్‌లో పనిని నమోదు చేయండి',
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
      reviewExtractedDesc: 'AI సేకరించిన వివరాలు. దయచేసి పరిశీలించి నిర్ధారించండి.',
      unconfirmedNotice: 'గమనిక: ఈ వివరాలు ఇంకా రైతు నిర్ధారించలేదు. సరిచూసి భద్రపరచండి.',
    },
    sources: {
      farmer_reported: 'రైతు తెలిపిన వివరాలు (Farmer reported)',
      ai_extracted: 'AI సేకరించిన వివరాలు (AI extracted)',
      farmer_confirmed: 'రైతు నిర్ధారించిన వివరాలు (Farmer confirmed)',
      verified_document: 'రసీదు ధృవీకరించబడింది (Verified document)',
      demo_data: 'డెమో డేటా (Demo data)',
      unknown: 'తెలియదు (Unknown)',
    },
    statuses: {
      draft: 'చిత్తుప్రతి (Draft)',
      pending_confirmation: 'రైతు నిర్ధారణ కోసం పెండింగ్‌లో ఉంది',
      farmer_confirmed: 'రైతు ధృవీకరించారు (Farmer confirmed)',
      conflicting: 'పరస్పర విరుద్ధమైన సమాచారం (Conflicting)',
      demo: 'డెమో రికార్డు (Demo)',
      demo_incomplete: 'డెమో — అసంపూర్ణ వివరాలు',
      unknown: 'తెలియదు (Unknown)',
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
      voiceInput: 'Voice',
      cameraInput: 'Camera',
      quickAction: 'Quick Action',
      detailedForm: 'Detailed Form',
      viewTimeline: 'View Timeline',
      resetDemo: 'Reset Demo Data',
    },
    home: {
      greeting: 'Namaste, Ravi garu',
      subGreeting: 'What you should know for your farm today (Anakapalli district).',
      weatherCardTitle: 'Weather Condition',
      weatherMockLabel: 'MOCK — NOT LIVE',
      weatherCondition: 'Sunny · Clear Sky',
      fieldStatusTitle: 'Current Field Status',
      pendingTasksTitle: 'Pending Field Tasks',
      pendingTasksCount: '1 Attention Item',
      financialSnapshotTitle: 'Season Financial Snapshot',
      financialSnapshotSubtitle: 'Deterministic calculations from farmer activity records.',
      recentTimelineTitle: 'Recent Farm Timeline',
      recentTimelineSubtitle: 'Chronological log of activities, inputs, and observations.',
      viewAllRecords: 'View all records',
      primaryFieldTitle: 'Farm Plots Overview',
    },
    myFarm: {
      title: 'My Farm Specifications',
      subtitle: 'Ravi Kumar Farm · 5 Acres (Rasapūdipalem, Anakapalli)',
      plotsListTitle: 'Farm Plots (5 Acres Total)',
      soilType: 'Soil Type',
      waterSource: 'Water Source',
      area: 'Area',
      cropStage: 'Crop Stage',
      recordOnPlot: 'Record on this Plot',
    },
    record: {
      title: 'What happened on your farm?',
      subtitle: 'Zero unnecessary friction — voice when busy, forms when precision matters.',
      voiceTabTitle: 'Voice',
      voiceTabDesc: 'When busy in the field',
      cameraTabTitle: 'Camera',
      cameraTabDesc: 'When seeing is easier',
      quickTabTitle: 'Quick Actions',
      quickTabDesc: '1-tap for frequent tasks',
      formTabTitle: 'Detailed Form',
      formTabDesc: 'When precision matters',
      reviewExtractedTitle: 'Review Extracted Activity',
      reviewExtractedDesc: 'AI extracted fields. Please verify and confirm before saving.',
      unconfirmedNotice: 'Note: This record is pending farmer confirmation. Please review and confirm.',
    },
    sources: {
      farmer_reported: 'Farmer reported',
      ai_extracted: 'AI extracted',
      farmer_confirmed: 'Farmer confirmed',
      verified_document: 'Verified document',
      demo_data: 'Demo data',
      unknown: 'Unknown',
    },
    statuses: {
      draft: 'Draft',
      pending_confirmation: 'Pending farmer confirmation',
      farmer_confirmed: 'Farmer confirmed',
      conflicting: 'Conflicting information',
      demo: 'Demo',
      demo_incomplete: 'Demo — incomplete information',
      unknown: 'Unknown',
    },
    preferencesModal: {
      title: 'Farmer Profile & Personalization',
      profileTab: 'Farmer Profile ("Who am I?")',
      preferencesTab: 'App Behavior ("How it behaves")',
      saveAndApply: 'Save & Apply Personalization',
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
      translationNote: 'UI localization is active. All field settings are customizable.',
    },
  },

  Hindi: {
    appName: 'किसान हब (AI Farm Hub)',
    phaseBadge: 'चरण 0.5',
    nav: {
      home: 'होम',
      myFarm: 'मेरा खेत',
      record: 'दर्ज करें',
      insights: 'सूझ-बूझ',
      market: 'बाजार',
    },
    actions: {
      recordActivity: 'कार्य दर्ज करें',
      record: 'दर्ज करें',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      confirm: 'पुष्टि करें',
      confirmFarmer: 'किसान पुष्टि करें और सहेजें',
      close: 'बंद करें',
      retry: 'पुनः प्रयास करें',
      voiceInput: 'आवाज द्वारा',
      cameraInput: 'कैमरा द्वारा',
      quickAction: 'त्वरित दर्ज',
      detailedForm: 'विस्तृत फॉर्म',
      viewTimeline: 'टाइमलाइन देखें',
      resetDemo: 'डेमो डेटा रीसेट करें',
    },
    home: {
      greeting: 'नमस्ते, रवि गारू',
      subGreeting: 'आज आपके खेत के बारे में मुख्य बातें (अनकापल्ली जिला)।',
      weatherCardTitle: 'मौसम की स्थिति',
      weatherMockLabel: 'डेमो — लाइव नहीं',
      weatherCondition: 'धूप · साफ आसमान',
      fieldStatusTitle: 'खेत की वर्तमान स्थिति',
      pendingTasksTitle: 'लंबित कार्य / ध्यान दें',
      pendingTasksCount: '1 महत्वपूर्ण कार्य',
      financialSnapshotTitle: 'सत्र वित्तीय विवरण',
      financialSnapshotSubtitle: 'किसान द्वारा दर्ज प्रविष्टियों पर आधारित गणना।',
      recentTimelineTitle: 'हाल की गतिविधियां',
      recentTimelineSubtitle: 'खेत में किए गए कार्यों की समयरेखा।',
      viewAllRecords: 'सभी रिकॉर्ड देखें',
      primaryFieldTitle: 'खेत के प्लॉट विवरण',
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
    },
    record: {
      title: 'आपके खेत में क्या हुआ?',
      subtitle: 'सहज प्रविष्टि — व्यस्त होने पर आवाज, सटीकता के लिए फॉर्म।',
      voiceTabTitle: 'आवाज (Voice)',
      voiceTabDesc: 'खेत में काम करते समय बोलकर दर्ज करें',
      cameraTabTitle: 'कैमरा (Camera)',
      cameraTabDesc: 'रसीद या फोटो देखकर',
      quickTabTitle: 'त्वरित कार्य (Quick)',
      quickTabDesc: 'एक टैप में सामान्य कार्य',
      formTabTitle: 'विस्तृत फॉर्म (Form)',
      formTabDesc: 'सटीक जानकारी दर्ज करने के लिए',
      reviewExtractedTitle: 'निकाली गई जानकारी की समीक्षा',
      reviewExtractedDesc: 'AI द्वारा पहचानी गई जानकारी। कृपया जांचें और पुष्टि करें।',
      unconfirmedNotice: 'नोट: इस रिकॉर्ड की किसान द्वारा पुष्टि अभी बाकी है।',
    },
    sources: {
      farmer_reported: 'किसान द्वारा दर्ज (Farmer reported)',
      ai_extracted: 'AI द्वारा पहचाना गया (AI extracted)',
      farmer_confirmed: 'किसान द्वारा पुष्ट (Farmer confirmed)',
      verified_document: 'दस्तावेज सत्यापित (Verified document)',
      demo_data: 'डेमो डेटा (Demo data)',
      unknown: 'अज्ञात (Unknown)',
    },
    statuses: {
      draft: 'ड्राफ्ट (Draft)',
      pending_confirmation: 'किसान पुष्टि की प्रतीक्षा',
      farmer_confirmed: 'किसान द्वारा पुष्ट (Farmer confirmed)',
      conflicting: 'विरोधाभासी जानकारी (Conflicting)',
      demo: 'डेमो रिकॉर्ड (Demo)',
      demo_incomplete: 'डेमो — अधूरी जानकारी',
      unknown: 'अज्ञात (Unknown)',
    },
    preferencesModal: {
      title: 'किसान प्रोफाइल एवं प्राथमिकताएं',
      profileTab: 'किसान प्रोफाइल ("मैं कौन हूँ?")',
      preferencesTab: 'ऐप का व्यवहार ("ऐप कैसे काम करे?")',
      saveAndApply: 'सहेजें और लागू करें',
      appLanguageLabel: 'ऐप की भाषा (App Language)',
      voiceLanguageLabel: 'आवाज इनपुट भाषा (Voice Language)',
      interactionModeLabel: 'बातचीत का तरीका (Interaction Mode)',
      aiResponseStyleLabel: 'AI उत्तर शैली (Response Style)',
      recommendationModeLabel: 'सलाह सूचनाएं',
      themeLabel: 'थीम (Theme)',
      textSizeLabel: 'अक्षरों का आकार (Text Size)',
      contrastLabel: 'कंट्रास्ट (Contrast)',
      readAloudLabel: 'उत्तर बोलकर सुनाएं (Read Aloud)',
      reduceMotionLabel: 'एनीमेशन कम करें (Reduce Motion)',
      interactionPrefLabel: 'पसंदीदा इनपुट माध्यम',
      quietHoursLabel: 'शांत समय (Quiet Hours: 21:00 - 06:00)',
      translationNote: 'नोट: हिंदी इंटरफेस सक्रिय है; कुछ विशिष्ट कृषि शब्द मानक रूप में प्रदर्शित हो सकते हैं।',
    },
  },
};
