import { registerLocale } from 'date-fns';
import tr from 'date-fns/locale/tr';

// Register Turkish locale
registerLocale('tr', tr);

export function getLocale(locale: string) {
    return locale === 'tr' ? tr : undefined;
} 