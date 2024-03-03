import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import { addDays } from "date-fns";

const Calendar = ({ onSelectDate, selectedDate }) => {
  const today = new Date();
  const nextWeek = addDays(today, 6);

  return (
    <div className="calendar">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => onSelectDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
        minDate={today}
        maxDate={nextWeek}
      />
    </div>
  );
};

export default Calendar;
