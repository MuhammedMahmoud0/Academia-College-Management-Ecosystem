import React from 'react';

const BalanceCard = ({ balance }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <p className="text-xs sm:text-sm text-gray-600 mb-2">Current Balance</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 my-2">${balance.toFixed(2)}</h2>
      <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:underline">Need a payment plan? Learn more</a>
    </div>
  );
};

export default BalanceCard;
