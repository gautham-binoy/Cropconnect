// language.js

document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('language-switcher');

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        applyTranslations(lang);
    };

    const applyTranslations = (lang) => {
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        // Also update placeholder text
        const searchInput = document.getElementById('commoditySearch');
        if (searchInput && translations[lang] && translations[lang]['search_placeholder']) {
            searchInput.placeholder = translations[lang]['search_placeholder'];
        }
    };

    languageSwitcher.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });

    // On page load, apply the saved language or default to English
    const savedLang = localStorage.getItem('language') || 'en';
    languageSwitcher.value = savedLang;
    applyTranslations(savedLang);
});