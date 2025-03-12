import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';

function handleDateSelect(selectedDate: Date) {
    // Convert to ISO string for consistent storage
    const isoDate = selectedDate.toISOString();
    
    // When retrieving, parse using ISO format
    const parsedDate = parseISO(isoDate);
    
    // Use this parsed date for all operations
    // ... existing date handling logic ...
}

function formatDateForDisplay(date: Date, locale: string) {
    // Use locale-aware formatting for display only
    return format(date, 'PP', { locale: require(`date-fns/locale/${locale}`) });
} 