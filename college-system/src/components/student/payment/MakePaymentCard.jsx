import React, { useState } from 'react';
import PaymentMethodModal from './PaymentMethodModal';
import CardDetailsModal from './CardDetailsModal';

const MakePaymentCard = ({ defaultAmount, onPayment }) => {
  const [amount, setAmount] = useState(defaultAmount);
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [showModal, setShowModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowModal(false);
  };

  const handlePayment = () => {
    if (paymentMethod === 'Credit / Debit Card') {
      setShowCardModal(true);
    } else {
      onPayment({ amount, paymentMethod });
    }
  };

  const handleCardConfirm = (cardDetails) => {
    console.log('Card details submitted:', cardDetails);
    setShowCardModal(false);
    onPayment({ amount, paymentMethod, cardDetails });
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md h-fit lg:sticky lg:top-8">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Make a Payment</h3>
      
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          <label className="text-xs sm:text-sm text-gray-600 font-medium">Amount to Pay</label>
          <input
            type="text"
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-50 focus:outline-none focus:border-indigo-600 focus:bg-white text-gray-900"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <label className="text-xs sm:text-sm text-gray-600 font-medium">Payment Method</label>
          <div className="flex justify-between items-center px-3 sm:px-4 py-2.5 sm:py-4 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-white hover:border-indigo-600 transition-all" onClick={() => setShowModal(true)}>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl">💳</span>
              <span className="text-xs sm:text-[15px] text-gray-900">{paymentMethod}</span>
            </div>
            <button className="text-indigo-600 text-xs font-semibold px-2 py-1 hover:underline">CHANGE</button>
          </div>
        </div>

        <button className="bg-indigo-600 text-white px-4 py-2.5 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors active:scale-95 min-h-[44px] sm:min-h-auto" onClick={handlePayment}>
          Pay ${amount} Now
        </button>
      </div>

      {showModal && (
        <PaymentMethodModal
          currentMethod={paymentMethod}
          onSelect={handlePaymentMethodChange}
          onClose={() => setShowModal(false)}
        />
      )}

      {showCardModal && (
        <CardDetailsModal
          amount={amount}
          onConfirm={handleCardConfirm}
          onClose={() => setShowCardModal(false)}
        />
      )}
    </div>
  );
};

export default MakePaymentCard;
