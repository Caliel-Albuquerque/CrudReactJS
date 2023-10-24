import React from 'react'
import { format } from 'date-fns';
import { FaCalendar } from 'react-icons/fa'

function DateTimeTable({ date }) {
  const formattedDate = format(new Date(date), 'dd/MM/yyyy, HH:mm');

  return (
    <>
      <FaCalendar /> {formattedDate}
    </>
  );

}

export default DateTimeTable