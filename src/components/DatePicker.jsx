import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function DatePicker({ onClose, onSelect, selectedDate: initialSelectedDate }) {
  const { t } = useTranslation();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(initialSelectedDate || today);
  const [selectedDay, setSelectedDay] = useState(
    initialSelectedDate ? initialSelectedDate.getDate() : today.getDate()
  );

  // Eğer bugünün ayı ve yılı seçili ise, bugünün gününü seç
  useState(() => {
    if (!initialSelectedDate && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear()) {
      setSelectedDay(today.getDate());
    }
  }, []);

  const monthNames = [
    t('common.datePicker.months.january'),
    t('common.datePicker.months.february'),
    t('common.datePicker.months.march'),
    t('common.datePicker.months.april'),
    t('common.datePicker.months.may'),
    t('common.datePicker.months.june'),
    t('common.datePicker.months.july'),
    t('common.datePicker.months.august'),
    t('common.datePicker.months.september'),
    t('common.datePicker.months.october'),
    t('common.datePicker.months.november'),
    t('common.datePicker.months.december')
  ];

  const weekDays = [
    t('common.datePicker.weekDays.sun'),
    t('common.datePicker.weekDays.mon'),
    t('common.datePicker.weekDays.tue'),
    t('common.datePicker.weekDays.wed'),
    t('common.datePicker.weekDays.thu'),
    t('common.datePicker.weekDays.fri'),
    t('common.datePicker.weekDays.sat')
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDay(null);
  };

  const handleDateSelect = (day) => {
    if (!day) return;
    setSelectedDay(day);
  };

  const handleSetDate = () => {
    if (!selectedDay) return;
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    onSelect(selectedDate);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Modal Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black pointer-events-none"
      />
      
      {/* Date Picker */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 inset-x-0 bg-[#1e2b4a] rounded-t-3xl"
      >
        <div className="p-6">
          {/* Header with month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={handlePrevMonth} className="p-2">
              <ChevronLeftIcon className="w-6 h-6 text-white/60" />
            </button>
            <h2 className="text-xl font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="p-2">
              <ChevronRightIcon className="w-6 h-6 text-white/60" />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-4 mb-6">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm text-white/40 font-medium">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day)}
                disabled={!day}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors
                  ${!day ? 'invisible' : ''}
                  ${day === selectedDay 
                    ? 'bg-primary text-white' 
                    : 'text-white/80 hover:bg-[#2d3c5d]'}`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Set Date button */}
          <button
            onClick={handleSetDate}
            disabled={!selectedDay}
            className={`w-full py-4 text-white text-lg font-semibold rounded-2xl transition-colors
              ${selectedDay 
                ? 'bg-primary hover:bg-primary-600' 
                : 'bg-primary/50 cursor-not-allowed'}`}
          >
            {t('common.datePicker.setDate')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DatePicker; 