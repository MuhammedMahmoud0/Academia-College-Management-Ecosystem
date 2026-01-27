import React from 'react';

const PaymentHistoryTable = ({ transactions }) => {
  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Payment History</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-max sm:min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 border-b-2 border-gray-200">Transaction ID</th>
              <th className="text-left px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 border-b-2 border-gray-200">Date</th>
              <th className="text-left px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 border-b-2 border-gray-200">Description</th>
              <th className="text-left px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 border-b-2 border-gray-200">Amount</th>
              <th className="text-left px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 border-b-2 border-gray-200">Status</th>
              <th className="text-left px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600 border-b-2 border-gray-200">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200 text-xs sm:text-[15px] text-indigo-600 font-medium">{transaction.id}</td>
                <td className="px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200 text-xs sm:text-[15px] text-gray-900">{transaction.date}</td>
                <td className="px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200 text-xs sm:text-[15px] text-gray-900">{transaction.description}</td>
                <td className="px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200 text-xs sm:text-[15px] text-gray-900 font-semibold">{transaction.amount}</td>
                <td className="px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
                  <span className="inline-block px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
                  <button className="bg-transparent border-none text-lg sm:text-xl cursor-pointer p-1 hover:scale-110 transition-transform" onClick={() => console.log('Download receipt', transaction.id)}>
                    ⬇️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
