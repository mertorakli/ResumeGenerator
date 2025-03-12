import React, { forwardRef, useState, useEffect } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enUS, tr } from 'date-fns/locale';
import { DateTime } from 'luxon';

// Register all locales you plan to support
registerLocale('en-US', enUS);
registerLocale('tr', tr);

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  showMonthYearPicker?: boolean;
  dateFormat?: string;
  isClearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: string; // Add locale as a configurable prop
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder = 'Select date',
  className = '',
  showMonthYearPicker = false,
  dateFormat = 'dd/MM/yyyy',
  isClearable = false,
  minDate,
  maxDate,
  locale: userLocale, // Allow user to pass locale explicitly
}) => {
  const [isYearView, setIsYearView] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>(userLocale || 'en-US');
  
  // Get system locale on component mount
  useEffect(() => {
    if (!userLocale) {
      try {
        // Get browser language, if not explicitly provided
        const browserLang = navigator.language || navigator.languages[0] || 'en-US';
        
        // Map browser language to supported locales
        // This is a simple mapping - you may need to expand this for more languages
        const localeMap: Record<string, string> = {
          'tr': 'tr',
          'tr-TR': 'tr',
          'en': 'en-US',
          'en-US': 'en-US',
          'en-GB': 'en-US',
        };
        
        // Find the closest match or default to en-US
        const detectedLocale = Object.keys(localeMap).find(key => 
          browserLang.startsWith(key)
        );
        
        setCurrentLocale(detectedLocale ? localeMap[detectedLocale] : 'en-US');
      } catch (error) {
        console.error('Error detecting locale:', error);
        setCurrentLocale('en-US'); // Fallback to en-US
      }
    }
  }, [userLocale]);

  // Get month names based on locale
  const getLocalizedMonths = () => {
    try {
      const months = [];
      const localeObj = currentLocale === 'tr' ? tr : enUS;
      
      // Get localized month names
      for (let i = 0; i < 12; i++) {
        const date = new Date(2000, i, 1);
        const month = date.toLocaleString(currentLocale.replace('_', '-'), { month: 'long' });
        months.push(month);
      }
      
      return months;
    } catch (error) {
      console.error('Error getting localized months:', error);
      // Fallback to English month names
      return [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    }
  };

  // Custom header component for the calendar
  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
    const years = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - 6 + i);
    const months = getLocalizedMonths();

    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center p-2">
          <button
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon />
          </button>
          <div className="flex gap-2">
            <select
              value={date.getMonth()}
              onChange={({ target: { value } }) => changeMonth(Number(value))}
              className="text-sm font-medium bg-transparent hover:bg-gray-100 rounded px-2 py-1 cursor-pointer"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={date.getFullYear()}
              onChange={({ target: { value } }) => changeYear(Number(value))}
              className="text-sm font-medium bg-transparent hover:bg-gray-100 rounded px-2 py-1 cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    );
  };

  // Custom input component
  const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onClick, onChange, placeholder }, ref) => (
      <div className="relative">
        <input
          ref={ref}
          onClick={onClick}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          readOnly
          className={`block w-full rounded-md bg-white border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 p-2.5 pr-10 ${className}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <CalendarIcon />
        </div>
      </div>
    )
  );

  // Get appropriate date format based on locale
  const getLocalizedDateFormat = () => {
    if (dateFormat) return dateFormat;
    
    // Default formats by locale if not specified
    switch (currentLocale) {
      case 'tr':
        return 'dd.MM.yyyy';
      case 'en-US':
        return 'MM/dd/yyyy';
      default:
        return 'dd/MM/yyyy';
    }
  };

  const handleChange = (date: Date | null) => {
    try {
      if (!date) {
        onChange(null);
        return;
      }
      
      // Important: Create a clean date object to prevent locale-specific issues
      // This ensures the date is properly interpreted regardless of the browser's locale
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      
      // Create a clean date object using UTC
      const cleanDate = new Date(Date.UTC(year, month, day));
      
      // Validate against min/max dates if provided
      if (minDate) {
        const minDateTime = DateTime.fromJSDate(minDate).startOf('day');
        const selectedDateTime = DateTime.fromJSDate(cleanDate).startOf('day');
        
        if (selectedDateTime < minDateTime) {
          throw new Error('Selected date is before the minimum allowed date.');
        }
      }
      
      if (maxDate) {
        const maxDateTime = DateTime.fromJSDate(maxDate).endOf('day');
        const selectedDateTime = DateTime.fromJSDate(cleanDate).startOf('day');
        
        if (selectedDateTime > maxDateTime) {
          throw new Error('Selected date is after the maximum allowed date.');
        }
      }
      
      // Pass the clean date to the onChange handler
      onChange(cleanDate);
      
    } catch (error) {
      console.error('Error in handleChange:', error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <ReactDatePicker
      selected={selected}
      onChange={handleChange}
      customInput={<CustomInput placeholder={placeholder} />}
      renderCustomHeader={CustomHeader}
      showMonthYearPicker={showMonthYearPicker}
      showPopperArrow={false}
      dateFormat={getLocalizedDateFormat()}
      isClearable={isClearable}
      minDate={minDate}
      maxDate={maxDate}
      calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
      wrapperClassName="w-full"
      popperClassName="z-[9999]"
      popperPlacement="bottom-start"
      locale={currentLocale}
      dayClassName={(date) =>
        selected && date.getDate() === selected.getDate() && date.getMonth() === selected.getMonth()
          ? 'bg-indigo-500 text-white rounded-full hover:bg-indigo-600'
          : 'hover:bg-gray-100 rounded-full'
      }
    />
  );
};

// Icons
const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    />
  </svg>
);

export default DatePicker;