import React, { useState } from 'react';

const Calendar = () => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const formatMonthYear = (date) => date.toLocaleString('default', { month: 'long', year: 'numeric' });

  const changeWeek = (direction) => {
    const newDate = new Date(selectedDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7)));
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
    
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span className="bg-blue-500 text-white rounded-full p-2">📅</span>
          Calendar
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedDate(currentDate)} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">
            Today
          </button>
          <button onClick={() => changeWeek('prev')} className="text-xl px-2 hover:bg-gray-700 rounded">
            ◀
          </button>
          <span className="font-bold">{formatMonthYear(selectedDate)}</span>
          <button onClick={() => changeWeek('next')} className="text-xl px-2 hover:bg-gray-700 rounded">
            ▶
          </button>
        </div>
        <button className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
          + New Meeting
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        <div className="grid grid-cols-6 gap-px bg-gray-800">
          <div className="bg-gray-800 text-gray-300 px-4 py-2">Time</div>
          {daysInWeek.map((day, index) => (
            <div key={index} className={`bg-gray-800 px-4 py-2 text-center ${day === selectedDate.toLocaleString('default', { weekday: 'long' }) ? 'text-blue-400' : 'text-gray-300'}`}>
              <div>{day}</div>
              <div className="font-bold">
                {selectedDate.getDate() + index - 1}
              </div>
            </div>
          ))}

          {hours.map((hour, index) => (
            <React.Fragment key={index}>
              <div className="bg-gray-900 text-gray-400 text-sm px-4 py-1">
                {hour}
              </div>
              {daysInWeek.map((_, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 h-12 hover:bg-gray-700 cursor-pointer"></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
