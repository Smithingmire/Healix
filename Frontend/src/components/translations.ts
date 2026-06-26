export interface SchemeDetails {
  title: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  steps: string[];
  url?: string;
}

export interface TranslationSet {
  appTitle: string;
  aiAssistant: string;
  features: string;
  reportSaver: string;
  governmentSchemes: string;
  recentHistory: string;
  newChat: string;
  noConversations: string;
  shareFeedback: string;
  tellThoughts: string;
  send: string;
  feedbackSaved: string;
  logout: string;
  chatTabTitle: string;
  reportsTabTitle: string;
  schemesTabTitle: string;
  welcomeName: string;
  welcomeSubtitle: string;
  askAssistant: string;
  disclaimerText: string;
  reportSaverSubtitle: string;
  uploadDocument: string;
  docTitle: string;
  selectDocFile: string;
  clickToSelect: string;
  fileConstraints: string;
  cancel: string;
  saveReport: string;
  savedLedger: string;
  noDocsSaved: string;
  clickPlusToStore: string;
  govtSchemeGuide: string;
  govtSchemeSubtitle: string;
  selectedPlanProfile: string;
  corePolicyBenefits: string;
  whoIsEligible: string;
  requiredDocs: string;
  applicationWorkflow: string;
  processingClinicalFacts: string;
  pmjayTitle: string;
  abhaTitle: string;
  statePlansTitle: string;
  sugMalaria: string;
  sugAyushman: string;
  sugFever: string;
  pmjay: SchemeDetails;
  abha: SchemeDetails;
  stateSchemes: SchemeDetails;

  // New keys for new dashboard modules
  resourcesTabTitle: string;
  misinfoTabTitle: string;
  profileTabTitle: string;
  nearbyResources: string;
  misinfoDetector: string;
  profileSettings: string;
  selectLanguage: string;
  voiceControl: string;
  play: string;
  pause: string;
  stop: string;
  emergencyMode: string;
  detectedEmergency: string;
  detectorTitle: string;
  detectorSubtitle: string;
  enterClaim: string;
  analyzeBtn: string;
  claimAnalysis: string;
  credibilityStatus: string;
  evidenceExplanation: string;
  correctInfo: string;
  recommendation: string;
  dangerWarning: string;
  eligibilityTitle: string;
  eligibilitySubtitle: string;
  checkEligibilityBtn: string;
  ageLabel: string;
  incomeLabel: string;
  areaLabel: string;
  familySizeLabel: string;
  resultEligible: string;
  resultNotEligible: string;
  viewDetails: string;

}

export const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" }
];

export const translations: Record<string, TranslationSet> = {
  en: {
    appTitle: "Healix",
    aiAssistant: "AI Health Assistant",
    features: "Features",
    reportSaver: "Report Saver",
    governmentSchemes: "Government Schemes",
    recentHistory: "Recent History",
    newChat: "New",
    noConversations: "No previous conversations.",
    shareFeedback: "Share Feedback",
    tellThoughts: "Tell us your thoughts...",
    send: "Send",
    feedbackSaved: "Feedback Saved",
    logout: "Logout",
    chatTabTitle: "Conversational Assistant",
    reportsTabTitle: "Report Saver Ledger",
    schemesTabTitle: "Government Schemes Finder",
    welcomeName: "Welcome to Healix",
    welcomeSubtitle: "AI Healthcare Assistant for Every Citizen",
    askAssistant: "Ask your Healix assistant anything...",
    disclaimerText: "Multilingual translation & symptom awareness active. Always consult standard clinical providers for diagnoses.",
    reportSaverSubtitle: "Upload and manage your medical bills, lab results, and health documents locally.",
    uploadDocument: "Upload Medical Document",
    docTitle: "Document Title / Name",
    selectDocFile: "Select Document File",
    clickToSelect: "Click to select or drop your file here",
    fileConstraints: "Supports images, PDFs, or standard text documents",
    cancel: "Cancel",
    saveReport: "Save Report",
    savedLedger: "Saved Documents Ledger",
    noDocsSaved: "No documents saved yet",
    clickPlusToStore: "Click the plus (+) button above to safely store your first medical report.",
    govtSchemeGuide: "Government Health Scheme Guide",
    govtSchemeSubtitle: "Identify central and state health policies, cash-free covers, and step-by-step application documentation guides.",
    selectedPlanProfile: "Selected Plan Profile",
    corePolicyBenefits: "Core Policy Benefits",
    whoIsEligible: "Who is eligible?",
    requiredDocs: "Required Documents",
    applicationWorkflow: "Application workflow steps",
    processingClinicalFacts: "Healix is processing clinical facts...",
    pmjayTitle: "PM-JAY (Ayushman Bharat)",
    abhaTitle: "ABHA Digital Health Card",
    statePlansTitle: "State Government Welfare Plans",
    sugMalaria: "What are symptoms of malaria?",
    sugAyushman: "How do I apply for Ayushman Bharat?",
    sugFever: "What should I do for a mild fever?",
    pmjay: {
      title: "Ayushman Bharat - PM-JAY",
      description: "Pradhan Mantri Jan Arogya Yojana is the largest health assurance scheme in the world which aims to provide a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.",
      benefits: [
        "Provides Rs. 5,00,000 cash-free cover per family per year",
        "Covers pre-existing conditions from Day 1",
        "Includes up to 3 days of pre-hospitalization and 15 days of post-hospitalization costs",
        "All food, medicines, and diagnostics during the hospital stay are covered"
      ],
      eligibility: [
        "Households living in kutcha rooms or with no adult male member aged 16-59",
        "Scheduled Caste/Scheduled Tribe households",
        "Landless households deriving major income from manual casual labor",
        "Families listed in the Socio-Economic Caste Census (SECC 2011)"
      ],
      documents: [
        "Aadhaar Card or PAN Card",
        "Ration Card or Family Certificate",
        "Active Mobile Number",
        "SECC letter or PM-JAY identification number"
      ],
      steps: [
        "Visit the nearest Pradhan Mantri Ayushman Mitra at any empanelled hospital",
        "Verify your eligibility using your Aadhaar or Ration Card",
        "Receive your personal Ayushman Golden Card for paperless/cashless admissions"
      ],
      url: "https://pmjay.gov.in"
    },
    abha: {
      title: "Ayushman Bharat Health Account (ABHA)",
      description: "ABHA is a central digital health ID card that consolidates your lifetime health records, clinical prescriptions, laboratory test summaries, and diagnostics securely in one place, allowing seamless sharing with registered doctors across India.",
      benefits: [
        "14-digit unique health account number recognized nationwide",
        "Store and access medical records digitally without carrying physical files",
        "Direct consent-based health record sharing with certified healthcare providers",
        "Access to digital consultation and unified national telemedicine services"
      ],
      eligibility: [
        "Open to all Indian Citizens of any age group, income block, or location."
      ],
      documents: [
        "Aadhaar Card",
        "Mobile number linked with Aadhaar",
        "Active communication address details"
      ],
      steps: [
        "Create ABHA instantly using Aadhaar or Driving License",
        "Complete OTP verification sent to registered mobile number",
        "Generate and download your unique ABHA address ID card immediately"
      ],
      url: "https://abha.abdm.gov.in"
    },
    stateSchemes: {
      title: "State Government Welfare Plans",
      description: "Most states offer exclusive health assurance policies (e.g. Mahatma Jyotirao Phule Jan Arogya in Maharashtra, Chief Minister Comprehensive in Tamil Nadu, Aarogyasri in Andhra/Telangana) designed to expand cashless medical covers for marginalized families.",
      benefits: [
        "Cashless surgery and therapy protocols inside state network clinics",
        "Coverage for complex renal, cardiac, oncology, and neurosurgery fields",
        "Free diagnostics and prescription distribution post-treatment"
      ],
      eligibility: [
        "Families belonging to yellow/orange ration card brackets",
        "State domicile status verified with residential certificates",
        "Families not registered in any major central health schemes"
      ],
      documents: [
        "State Income Certificate",
        "Domicile Certificate / Address proof",
        "Ration Card",
        "Aadhaar Card"
      ],
      steps: [
        "Enquire at local district hospitals or state citizen portal networks",
        "Submit physical forms along with your regional ration cards",
        "Receive state health cards for family-wide medical discount access"
      ],
      url: "https://www.nhp.gov.in/state-health-schemes_pg"
    },
    // New tab definitions
    resourcesTabTitle: "Nearby Healthcare Finder",
    misinfoTabTitle: "Misinformation Detector",
    profileTabTitle: "Profile Settings",
    nearbyResources: "Nearby Resources",
    misinfoDetector: "Claim Detector",
    profileSettings: "Profile & Language",
    selectLanguage: "Preferred Language",
    voiceControl: "Voice Assistant",
    play: "Play Voice",
    pause: "Pause",
    stop: "Stop",
    emergencyMode: "EMERGENCY DETECTED",
    detectedEmergency: "Our chatbot detected critical symptoms. Please review emergency centers immediately.",
    detectorTitle: "Health Misinformation & Claim Detector",
    detectorSubtitle: "Submit questionable health claims, forwards, or tips to evaluate scientific credibility.",
    enterClaim: "Paste WhatsApp forward or health claim here...",
    analyzeBtn: "Scan Credibility",
    claimAnalysis: "Claim Analysis",
    credibilityStatus: "Credibility Status",
    evidenceExplanation: "Evidence-Based Explanation",
    correctInfo: "Verified Correct Information",
    recommendation: "Actionable Recommendation",
    dangerWarning: "⚠ This claim may cause health risks if followed.",
    eligibilityTitle: "Smart Scheme Eligibility Checker",
    eligibilitySubtitle: "Answer a few demographic details to instantly match eligible central and state schemes.",
    checkEligibilityBtn: "Analyze Eligibility",
    ageLabel: "Your Age",
    incomeLabel: "Annual Family Income (INR)",
    areaLabel: "Residential Zone",
    familySizeLabel: "Family Size",
    resultEligible: "Recommended Eligible Schemes",
    resultNotEligible: "No special matching schemes found for this income bracket. PM-JAY and ABHA are still applicable.",
    viewDetails: "View Details",

  },
  hi: {
    appTitle: "हीलिक्स (Healix)",
    aiAssistant: "एआई स्वास्थ्य सहायक",
    features: "सुविधाएं",
    reportSaver: "रिपोर्ट सेवर",
    governmentSchemes: "सरकारी योजनाएं",
    recentHistory: "हाल का इतिहास",
    newChat: "नया",
    noConversations: "कोई पिछला संवाद नहीं है।",
    shareFeedback: "प्रतिक्रिया साझा करें",
    tellThoughts: "अपने विचार हमें बताएं...",
    send: "भेजें",
    feedbackSaved: "प्रतिक्रिया सहेजी गई",
    logout: "लॉगआउट",
    chatTabTitle: "संवादात्मक सहायक",
    reportsTabTitle: "रिपोर्ट सेवर बहीखाता",
    schemesTabTitle: "सरकारी योजना खोजक",
    welcomeName: "हीलिक्स में आपका स्वागत है",
    welcomeSubtitle: "हर नागरिक के लिए एआई स्वास्थ्य देखभाल सहायक",
    askAssistant: "अपने हीलिक्स सहायक से कुछ भी पूछें...",
    disclaimerText: "बहुभाषी अनुवाद और लक्षण जागरूकता सक्रिय है। निदान के लिए हमेशा योग्य डॉक्टर से परामर्श लें।",
    reportSaverSubtitle: "अपने मेडिकल बिल, लैब परिणाम और स्वास्थ्य दस्तावेजों को स्थानीय रूप से प्रबंधित करें।",
    uploadDocument: "मेडिकल दस्तावेज़ अपलोड करें",
    docTitle: "दस्तावेज़ का शीर्षक / नाम",
    selectDocFile: "दस्तावेज़ फ़ाइल चुनें",
    clickToSelect: "फ़ाइल चुनने के लिए क्लिक करें या यहाँ खींचें",
    fileConstraints: "छवियों, पीडीएफ, या सामान्य पाठ दस्तावेजों का समर्थन करता है",
    cancel: "रद्द करें",
    saveReport: "रिपोर्ट सहेजें",
    savedLedger: "सहेजे गए दस्तावेज़",
    noDocsSaved: "अभी तक कोई दस्तावेज़ सहेजा नहीं गया है",
    clickPlusToStore: "अपनी पहली मेडिकल रिपोर्ट को सुरक्षित रूप से संग्रहीत करने के लिए ऊपर प्लस (+) बटन पर क्लिक करें।",
    govtSchemeGuide: "सरकारी स्वास्थ्य योजना गाइड",
    govtSchemeSubtitle: "केंद्रीय और राज्य स्वास्थ्य नीतियों, कैश-फ्री कवर और आवेदन प्रक्रिया की पहचान करें।",
    selectedPlanProfile: "चयनित योजना प्रोफ़ाइल",
    corePolicyBenefits: "मूल नीति लाभ",
    whoIsEligible: "कौन पात्र है?",
    requiredDocs: "आवश्यक दस्तावेज़",
    applicationWorkflow: "आवेदन कार्यप्रवाह चरण",
    processingClinicalFacts: "हीलिक्स क्लिनिकल तथ्यों को संसाधित कर रहा है...",
    pmjayTitle: "पीएम-जय (आयुष्मान भारत)",
    abhaTitle: "आभा डिजिटल हेल्थ कार्ड",
    statePlansTitle: "राज्य सरकार कल्याण योजनाएं",
    sugMalaria: "मलेरिया के लक्षण क्या हैं?",
    sugAyushman: "मैं आयुष्मान भारत के लिए कैसे आवेदन करूं?",
    sugFever: "हल्के बुखार के लिए मुझे क्या करना चाहिए?",
    pmjay: {
      title: "आयुष्मान भारत - पीएम-जय",
      description: "प्रधान मंत्री जन आरोग्य योजना दुनिया की सबसे बड़ी स्वास्थ्य आश्वासन योजना है जिसका उद्देश्य 12 करोड़ से अधिक गरीब और कमजोर परिवारों को माध्यमिक और तृतीयक देखभाल अस्पताल में भर्ती के लिए प्रति वर्ष प्रति परिवार 5 लाख रुपये का स्वास्थ्य कवर प्रदान करना है।",
      benefits: [
        "प्रति वर्ष प्रति परिवार 5,00,000 रुपये का मुफ्त स्वास्थ्य कवर प्रदान करता है",
        "पहले दिन से ही पहले से मौजूद बीमारियों को कवर करता है",
        "अस्पताल में भर्ती होने से 3 दिन पहले और भर्ती होने के 15 दिनों बाद तक का खर्च शामिल है",
        "अस्पताल में रहने के दौरान भोजन, दवाएं और जांच पूरी तरह से मुफ्त हैं"
      ],
      eligibility: [
        "कच्चे कमरों में रहने वाले या 16-59 वर्ष की आयु के बीच कोई वयस्क पुरुष सदस्य न होने वाले परिवार",
        "अनुसूचित जाति/अनुसूचित जनजाति के परिवार",
        "भूमिहीन परिवार जिनकी आय का मुख्य स्रोत शारीरिक श्रम है",
        "सामाजिक-आर्थिक जाति जनगणना (SECC 2011) में सूचीबद्ध परिवार"
      ],
      documents: [
        "आधार कार्ड या पैन कार्ड",
        "राशन कार्ड या परिवार प्रमाण पत्र",
        "सक्रिय मोबाइल नंबर",
        "SECC पत्र या पीएम-जय पहचान संख्या"
      ],
      steps: [
        "किसी भी सूचीबद्ध अस्पताल में निकटतम प्रधान मंत्री आयुष्मान मित्र से संपर्क करें",
        "अपने आधार या राशन कार्ड का उपयोग करके अपनी पात्रता की जांच करें",
        "कागज रहित/कैशलेस प्रवेश के लिए अपना व्यक्तिगत आयुष्मान गोल्डन कार्ड प्राप्त करें"
      ],
      url: "https://pmjay.gov.in"
    },
    abha: {
      title: "आयुष्मान भारत स्वास्थ्य खाता (ABHA)",
      description: "आभा (ABHA) एक केंद्रीय डिजिटल स्वास्थ्य आईडी कार्ड है जो आपके जीवन भर के स्वास्थ्य रिकॉर्ड, क्लिनिकल नुस्खे, प्रयोगशाला परीक्षण सारांश और निदान को सुरक्षित रूप से एक स्थान पर समेकित करता है।",
      benefits: [
        "देश भर में मान्यता प्राप्त 14-अंकीय विशिष्ट स्वास्थ्य खाता संख्या",
        "भौतिक फाइलों के बिना स्वास्थ्य रिकॉर्ड डिजिटल रूप से संग्रहीत और एक्सेस करें",
        "प्रमाणित स्वास्थ्य सेवा प्रदाताओं के साथ सीधे सहमति-आधारित स्वास्थ्य रिकॉर्ड साझा करना",
        "डिजिटल परामर्श और एकीकृत राष्ट्रीय टेलीमेडिसिन सेवाओं तक पहुंच"
      ],
      eligibility: [
        "किसी भी आयु वर्ग, आय वर्ग या स्थान के सभी भारतीय नागरिकों के लिए खुला है।"
      ],
      documents: [
        "आधार कार्ड",
        "आधार से जुड़ा मोबाइल नंबर",
        "सक्रिय संचार पता विवरण"
      ],
      steps: [
        "आधार या ड्राइविंग लाइसेंस का उपयोग करके तुरंत आभा आईडी बनाएं",
        "पंजीकृत मोबाइल नंबर पर भेजे गए ओटीपी सत्यापन को पूरा करें",
        "अपना विशिष्ट आभा पता आईडी कार्ड तुरंत डाउनलोड करें"
      ],
      url: "https://abha.abdm.gov.in"
    },
    stateSchemes: {
      title: "राज्य सरकार कल्याण योजनाएं",
      description: "अधिकांश राज्य विशेष स्वास्थ्य आश्वासन नीतियां प्रदान करते हैं (जैसे महाराष्ट्र में महात्मा ज्योतिराव फुले जन आरोग्य, तमिलनाडु में मुख्यमंत्री व्यापक स्वास्थ्य योजना) जो गरीब परिवारों के लिए कैशलेस चिकित्सा कवर का विस्तार करती हैं।",
      benefits: [
        "राज्य नेटवर्क क्लीनिकों के भीतर कैशलेस सर्जरी और थेरेपी सुविधाएं",
        "जटिल गुर्दे, हृदय, ऑन्कोलॉजी और न्यूरोसर्जरी क्षेत्रों के लिए कवर",
        "उपचार के बाद मुफ्त निदान और दवा वितरण"
      ],
      eligibility: [
        "पीले/नारंगी राशन कार्ड श्रेणी से संबंधित परिवार",
        "आवासीय प्रमाणपत्रों से सत्यापित राज्य अधिवास स्थिति",
        "वे परिवार जो किसी प्रमुख केंद्रीय स्वास्थ्य योजना में पंजीकृत नहीं हैं"
      ],
      documents: [
        "राज्य आय प्रमाण पत्र",
        "अधिवास प्रमाण पत्र / पते का प्रमाण",
        "राशन कार्ड",
        "आधार कार्ड"
      ],
      steps: [
        "निकटतम सरकारी अस्पताल या राज्य नागरिक सेवा केंद्र पर पूछताछ करें",
        "अपने क्षेत्रीय राशन कार्ड के साथ भौतिक या ऑनलाइन फॉर्म जमा करें",
        "परिवार के चिकित्सा छूट लाभों के लिए राज्य स्वास्थ्य कार्ड प्राप्त करें"
      ],
      url: "https://www.nhp.gov.in/state-health-schemes_pg"
    },
    resourcesTabTitle: "निकटतम स्वास्थ्य केंद्र",
    misinfoTabTitle: "भ्रामक जानकारी जांच",
    profileTabTitle: "प्रोफ़ाइल सेटिंग्स",
    nearbyResources: "निकटतम संसाधन",
    misinfoDetector: "दावा संसूचक",
    profileSettings: "प्रोफ़ाइल और भाषा",
    selectLanguage: "पसंदीदा भाषा",
    voiceControl: "आवाज सहायक",
    play: "आवाज चलाएं",
    pause: "रोकें",
    stop: "बंद करें",
    emergencyMode: "आपातकालीन स्थिति खोजी गई",
    detectedEmergency: "हमारे चैटबॉट ने गंभीर लक्षणों का पता लगाया है। कृपया तुरंत आपातकालीन केंद्रों की समीक्षा करें।",
    detectorTitle: "स्वास्थ्य भ्रामक जानकारी और दावा डिटेक्टर",
    detectorSubtitle: "वैज्ञानिक विश्वसनीयता का मूल्यांकन करने के लिए स्वास्थ्य संबंधी दावे या व्हाट्सएप संदेश सबमिट करें।",
    enterClaim: "व्हाट्सएप संदेश या स्वास्थ्य दावा यहाँ पेस्ट करें...",
    analyzeBtn: "विश्वसनीयता जांचें",
    claimAnalysis: "दावे का विश्लेषण",
    credibilityStatus: "विश्वसनीयता की स्थिति",
    evidenceExplanation: "साक्ष्य-आधारित स्पष्टीकरण",
    correctInfo: "सत्यापित सही जानकारी",
    recommendation: "कार्रवाई योग्य सिफारिश",
    dangerWarning: "⚠ इस दावे को मानने से स्वास्थ्य जोखिम हो सकते हैं।",
    eligibilityTitle: "स्मार्ट योजना पात्रता परीक्षक",
    eligibilitySubtitle: "योग्य केंद्रीय और राज्य कल्याण योजनाओं को तुरंत खोजने के लिए अपनी जनसांख्यिकीय जानकारी दर्ज करें।",
    checkEligibilityBtn: "पात्रता का विश्लेषण करें",
    ageLabel: "आपकी आयु",
    incomeLabel: "वार्षिक पारिवारिक आय (INR)",
    areaLabel: "आवासीय क्षेत्र",
    familySizeLabel: "परिवार का आकार",
    resultEligible: "अनुशंसित पात्र योजनाएं",
    resultNotEligible: "इस आय वर्ग के लिए कोई विशेष योजना नहीं मिली। पीएम-जय और आभा अभी भी लागू हैं।",
    viewDetails: "विवरण देखें",

  }
};
