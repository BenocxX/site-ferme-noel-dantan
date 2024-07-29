import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to persist the language in localStorage
 */
export function useI18nPersistence() {
  const key = 'i18nextLng';

  const { i18n } = useTranslation();

  /**
   * Effect to run on mount to set the language to the one stored in localStorage or default language
   */
  function useLanguageEffect() {
    useEffect(() => {
      changeLanguage(localStorage.getItem(key) ?? i18n.language);
    }, []);
  }

  /**
   * Change the language and store it in localStorage
   * @param value - The language to change to
   */
  function changeLanguage(value: string) {
    i18n.changeLanguage(value);
    localStorage.setItem(key, value);
  }

  return {
    useLanguageEffect,
    changeLanguage,
    currentLanguage: i18n.language,
  };
}
