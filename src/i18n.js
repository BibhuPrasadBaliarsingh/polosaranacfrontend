import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      polosaraNAC: "POLOSARA N.A.C",
      solidWaste: "Solid Waste Management",
      smartCity: "Smart City Waste Platform",
      platformDescription:
        "Monitor garbage collection, manage complaints, and ensure cleanliness across all wards digitally.",
      liveTracking: "🚛 Live Vehicle Tracking",
      doorCollection: "🗑️ Door-to-Door Collection",
      photoComplaints: "📸 Photo Complaints",
      wardReports: "📊 Ward Reports",
      governmentAuthorized:
        "Government Authorized • Secure • Real-time Monitoring",
      officialPortal: "Official Government Portal",
      officialWarning:
        "This is an official Solid Waste Management System of Polosara N.A.C. Unauthorized use may lead to action.",
      iUnderstand: "I Understand",
      loginAs: "Login as",
      welcome: "Enter your credentials to continue",
      roles: {
        citizen: "Citizen",
        supervisor: "Supervisor",
        admin: "Admin"
      },
      loginTitle: "{{role}} Login",
      welcomeMessage: "Welcome to the Solid Waste Management System",
      municipalServices: "Municipal Services",
      joinMission: "Join our mission for a cleaner and greener Polosara",
      buildingFuture: "Building a sustainable future through responsible waste management.",
      recyclable: "Recyclable",
      phone: "Phone Number (10 digits)",
      getOtp: "Get OTP",
      enterOtp: "Enter OTP",
      verifyOtp: "Verify OTP",
      changePhone: "Change Phone Number",
      username: "Username",
      password: "Password",
      login: "Login",
      secureSystem: "Secure • Government Authorized System"
    }
  },

  hi: {
    translation: {
      polosaraNAC: "पोलसरा N.A.C",
      solidWaste: "ठोस अपशिष्ट प्रबंधन",
      smartCity: "स्मार्ट सिटी कचरा मंच",
      platformDescription:
        "कचरा संग्रह की निगरानी करें, शिकायतों का प्रबंधन करें और स्वच्छता सुनिश्चित करें।",
      liveTracking: "🚛 लाइव वाहन ट्रैकिंग",
      doorCollection: "🗑️ घर-घर संग्रह",
      photoComplaints: "📸 फोटो शिकायतें",
      wardReports: "📊 वार्ड रिपोर्ट",
      governmentAuthorized:
        "सरकारी अधिकृत • सुरक्षित • रीयल-टाइम निगरानी",
      officialPortal: "आधिकारिक सरकारी पोर्टल",
      officialWarning:
        "यह पोलसरा N.A.C का आधिकारिक सिस्टम है।",
      iUnderstand: "समझ गया",
      loginAs: "लॉगिन करें",
      welcome: "जारी रखने के लिए जानकारी दर्ज करें",
      roles: {
        citizen: "नागरिक",
        supervisor: "निरीक्षक",
        admin: "प्रशासक"
      },
      loginTitle: "{{role}} लॉगिन",
      welcomeMessage: "ठोस अपशिष्ट प्रबंधन प्रणाली में आपका स्वागत है",
      municipalServices: "नगरपालिका सेवाएं",
      joinMission: "पोलसरा को साफ और हरा-भरा बनाने के हमारे मिशन में शामिल हों",
      buildingFuture: "जिम्मेदार अपशिष्ट प्रबंधन के माध्यम से एक टिकाऊ भविष्य का निर्माण।",
      recyclable: "पुनर्चक्रण योग्य",
      phone: "फ़ोन नंबर (10 अंक)",
      getOtp: "OTP प्राप्त करें",
      enterOtp: "OTP दर्ज करें",
      verifyOtp: "OTP सत्यापित करें",
      changePhone: "फोन नंबर बदलें",
      username: "उपयोगकर्ता नाम",
      password: "पासवर्ड",
      login: "लॉगिन",
      secureSystem: "सुरक्षित सरकारी प्रणाली"
    }
  },

  od: {
    translation: {
      polosaraNAC: "ପୋଲସରା N.A.C",
      solidWaste: "ଘନ କୁଆଡ଼଼ା ପରିଚାଳନା",
      smartCity: "ସ୍ମାର୍ଟ୍ ସିଟି କୁଆଡ଼଼ା ମଞ୍ଚ",
      platformDescription:
        "କୁଆଡ଼଼ା ସଂଗ୍ରହ ଓ ଦରକାର ପରିଚାଳନା।",
      liveTracking: "🚛 ଗାଡ଼ି ଟ୍ରାକିଂ",
      doorCollection: "🗑️ ଦରଜା ସଂଗ୍ରହ",
      photoComplaints: "📸 ଫଟୋ ଦରକାର",
      wardReports: "📊 ଓ୍ବାର୍ଡ ରିପୋର୍ଟ",
      governmentAuthorized:
        "ସରକାରୀ ଅନୁମୋଦିତ • ନିରାପଦ",
      officialPortal: "ଆଧିକାରିକ ପୋର୍ଟାଲ୍",
      officialWarning:
        "ଏହା ଆଧିକାରିକ ସିଷ୍ଟମ୍।",
      iUnderstand: "ମୁଁ ବୁଝିଛି",
      loginAs: "ଲଗିନ୍",
      welcome: "ସୂଚନା ପ୍ରବେଶ କରନ୍ତୁ",
      roles: {
        citizen: "ନାଗରିକ",
        supervisor: "ପର୍ଯ୍ୟବେକ୍ଷକ",
        admin: "ପ୍ରଶାସକ"
      },
      loginTitle: "{{role}} ଲଗିନ୍",
      welcomeMessage: "ଘନ କୁଆଡ଼଼ା ପରିଚାଳନା ସିଷ୍ଟମ୍ରେ ଆପଣଙ୍କର ସ୍ଵାଗତ",
      municipalServices: "ନଗର ସେବା",
      joinMission: "ପୋଲସରାକୁ ସଫା ଏବଂ ସବୁଜ କରିବା ପାଇଁ ଆମର ମିଶନରେ ଯୋଗ ଦିଅନ୍ତୁ",
      buildingFuture: "ଜିମ୍ମେଦାରୀପୂର୍ଣ୍ଣ କୁଆଡ଼଼ା ପରିଚାଳନା ମାଧ୍ୟମରେ ଏକ ଟିକେଇ ଭବିଷ୍ୟତ ନିର୍ମାଣ।",
      recyclable: "ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ",
      phone: "ଫୋନ୍ ନମ୍ବର",
      getOtp: "OTP ପାଆନ୍ତୁ",
      enterOtp: "OTP ପ୍ରବେଶ କରନ୍ତୁ",
      verifyOtp: "OTP ଯାଞ୍ଚ କରନ୍ତୁ",
      changePhone: "ଫୋନ୍ ନମ୍ବର ବଦଳାନ୍ତୁ",
      username: "ଉପଭୋକ୍ତା",
      password: "ପାସୱାର୍ଡ",
      login: "ଲଗିନ୍",
      secureSystem: "ସରକାରୀ ସୁରକ୍ଷିତ ସିଷ୍ଟମ୍"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
