import React from 'react';

const TransactionsTable = ({ transactions }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'processing':
        return 'bg-yellow-100 text-yellow-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Transactions</h3>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5">
                  <div>
                    <div className="font-medium text-gray-900">{transaction.studentName}</div>
                    <div className="text-sm text-gray-500">{transaction.studentId}</div>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-700">{transaction.date}</td>
                <td className="px-6 py-5 font-semibold text-gray-900">${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-5">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {transactions.map((transaction, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">{transaction.studentName}</div>
                <div className="text-sm text-gray-500">{transaction.studentId}</div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(transaction.status)} ml-2`}>
                {transaction.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{transaction.date}</span>
              <span className="font-semibold text-gray-900 text-base">
                ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsTable;
