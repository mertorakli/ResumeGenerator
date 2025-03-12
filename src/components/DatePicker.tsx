import React, { forwardRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder = 'Select date',
  className = '',
  showMonthYearPicker = false,
  dateFormat = 'MM/dd/yyyy',
  isClearable = false,
  minDate,
  maxDate,
}) => {
  const [isYearView, setIsYearView] = useState(false);

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
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

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

  const handleChange = (date: Date | null) => {
    try {
      if (date && minDate && date < minDate) {
        throw new Error('Selected date is before the minimum allowed date.');
      }
      if (date && maxDate && date > maxDate) {
        throw new Error('Selected date is after the maximum allowed date.');
      }
      onChange(date);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
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
      dateFormat={dateFormat}
      isClearable={isClearable}
      minDate={minDate}
      maxDate={maxDate}
      calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
      wrapperClassName="w-full"
      popperClassName="z-[9999]"
      popperPlacement="bottom-start"
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