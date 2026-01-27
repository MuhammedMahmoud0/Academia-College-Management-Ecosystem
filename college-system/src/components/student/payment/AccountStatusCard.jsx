import React from 'react';

const AccountStatusCard = ({ status }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <p className="text-sm text-gray-600 mb-2">Account Status</p>
      <span className="inline-block px-4 py-2 rounded-md text-sm font-semibold bg-indigo-600 text-white">
        {status}
      </span>
    </div>
  );
};

export default AccountStatusCard;
