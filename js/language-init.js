(() => {
  const saved = localStorage.getItem("hawaLanguage");
  const language = saved === "en" ? "en" : "ar";
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
})();
