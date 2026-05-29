
const STORAGE_KEY = "nfg-amatic-language";
const FALLBACK_LANG = "en";
function getInitialLanguage(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved && window.NFG_TRANSLATIONS && window.NFG_TRANSLATIONS[saved]) return saved;
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || FALLBACK_LANG];
  return langs.some(l => String(l).toLowerCase().startsWith("ru")) ? "ru" : FALLBACK_LANG;
}
function applyLanguage(language){
  const all = window.NFG_TRANSLATIONS || {};
  const selected = all[language] ? language : FALLBACK_LANG;
  const d = all[selected] || {};
  document.documentElement.lang = selected;
  if(d["meta.title"]) document.title = d["meta.title"];
  const metaDescription = document.querySelector('meta[name="description"]');
  if(metaDescription && d["meta.description"]) metaDescription.setAttribute("content", d["meta.description"]);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if(d[key] !== undefined) el.textContent = d[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    if(d[key] !== undefined) el.innerHTML = d[key];
  });
  document.querySelectorAll(".lang-button").forEach(button => {
    const active = button.getAttribute("data-lang") === selected;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
function setLanguage(language){
  localStorage.setItem(STORAGE_KEY, language);
  applyLanguage(language);
}
document.querySelectorAll(".lang-button").forEach(button => button.addEventListener("click", () => setLanguage(button.getAttribute("data-lang"))));
applyLanguage(getInitialLanguage());

const lightbox = document.getElementById("image-lightbox");
if(lightbox){
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  function openLightbox(image){
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || "";
    lightboxCaption.textContent = image.alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }
  document.querySelectorAll("img.zoomable").forEach(image => image.addEventListener("click", () => openLightbox(image)));
  lightbox.addEventListener("click", event => { if(event.target === lightbox) closeLightbox(); });
  if(lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", event => { if(event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox(); });
}
