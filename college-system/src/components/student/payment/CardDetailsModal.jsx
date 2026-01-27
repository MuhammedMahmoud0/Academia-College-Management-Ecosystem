import React, { useState } from 'react';

const CardDetailsModal = ({ amount, onClose, onConfirm }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
  };

  const handleSubmit = () => {
    onConfirm({
      cardNumber,
      expiryDate,
      cvc,
      cardholderName,
      amount
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 m-0">Enter Card Details</h3>
          <button 
            className="bg-transparent border-none text-2xl sm:text-3xl text-gray-400 hover:text-gray-600 cursor-pointer p-0 w-8 h-8 flex items-center justify-center leading-none" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="px-4 sm:px-6 pb-6 flex flex-col gap-5 sm:gap-6">
          {/* Card Number */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm text-gray-700 font-medium">Card Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg sm:text-xl">💳</span>
              <input
                type="text"
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 bg-gray-50 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-gray-500"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
            </div>
          </div>

          {/* Expiry Date and CVC */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-2 sm:gap-3">
              <label className="text-xs sm:text-sm text-gray-700 font-medium">Expiry Date</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 bg-gray-50 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-gray-500"
                placeholder="MM / YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                maxLength={7}
              />
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <label className="text-xs sm:text-sm text-gray-700 font-medium">CVC</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg sm:text-xl">🔒</span>
                <input
                  type="text"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 bg-gray-50 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-gray-500"
                  placeholder="123"
                  value={cvc}
                  onChange={handleCvcChange}
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm text-gray-700 font-medium">Cardholder Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 bg-gray-50 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-gray-500"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors active:scale-95"
            onClick={handleSubmit}
          >
            Proceed to Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;
