import { parseISO, format } from 'date-fns';

function DatePicker({ value, onChange }) {
    // Parse incoming value as ISO string
    const dateValue = typeof value === 'string' ? parseISO(value) : value;
    
    const handleChange = (newDate: Date) => {
        // Always emit ISO string
        onChange(newDate.toISOString());
    };
    
    return (
        <Calendar
            value={dateValue}
            onChange={handleChange}
        />
    );
}

export default DatePicker; 