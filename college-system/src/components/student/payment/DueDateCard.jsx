import React from 'react';

const DueDateCard = ({ dueDate }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <p className="text-sm text-gray-600 mb-2">Next Due Date</p>
      <h2 className="text-3xl font-bold text-gray-900 my-2">{dueDate}</h2>
    </div>
  );
};

export default DueDateCard;
