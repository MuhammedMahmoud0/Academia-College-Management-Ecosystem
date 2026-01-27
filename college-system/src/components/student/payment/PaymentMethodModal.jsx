import React from 'react';

const PaymentMethodModal = ({ currentMethod, onSelect, onClose }) => {
  const paymentMethods = [
    { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
    { id: 'fawry', name: 'Fawry', icon: '🏪' },
    { id: 'vodafone', name: 'Vodafone Cash', icon: '📱' }
  ];

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 sm:p-6">
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 m-0">Select Payment Method</h3>
          <button className="bg-transparent border-none text-2xl sm:text-3xl text-gray-400 hover:text-gray-600 cursor-pointer p-0 w-8 h-8 flex items-center justify-center leading-none" onClick={onClose}>×</button>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col gap-2 sm:gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all active:scale-95 ${
                currentMethod === method.name 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-600 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(method.name)}
            >
              <span className="text-xl sm:text-2xl">{method.icon}</span>
              <span className="text-sm sm:text-base text-gray-900 font-medium">{method.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
