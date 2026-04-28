import React from 'react';

const TransactionsTable = ({ transactions }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
      case 'processing':
        return 'bg-amber-100 text-amber-700';
      case 'failed':
        return 'bg-rose-100 text-rose-700';
      case 'refunded':
        return 'bg-slate-100 text-slate-700';
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Term</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
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
                <td className="px-6 py-5">
                  <div className="text-gray-900">{transaction.semester}</div>
                  <div className="text-sm text-gray-500">{transaction.year}</div>
                </td>
                <td className="px-6 py-5 text-gray-700">{transaction.date}</td>
                <td className="px-6 py-5">
                  <div className="text-sm text-gray-900 capitalize">{transaction.gateway || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{transaction.invoiceCount} invoices</div>
                </td>
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
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Term: </span>
                <span className="text-gray-900">{transaction.semester} {transaction.year}</span>
              </div>
              <div>
                <span className="text-gray-500">Date: </span>
                <span className="text-gray-900">{transaction.date}</span>
              </div>
              <div>
                <span className="text-gray-500">Gateway: </span>
                <span className="text-gray-900 capitalize">{transaction.gateway || 'N/A'}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
              <span className="text-gray-500">{transaction.invoiceCount} invoices</span>
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
