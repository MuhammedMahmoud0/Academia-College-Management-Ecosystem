import React, { useState } from 'react';
import BalanceCard from '../components/student/payment/BalanceCard';
import DueDateCard from '../components/student/payment/DueDateCard';
import AccountStatusCard from '../components/student/payment/AccountStatusCard';
import FeeBreakdownCard from '../components/student/payment/FeeBreakdownCard';
import MakePaymentCard from '../components/student/payment/MakePaymentCard';
import PaymentHistoryTable from '../components/student/payment/PaymentHistoryTable';

const StudentsPaymentPage = () => {
  const [balance] = useState(2550.00);
  const [dueDate] = useState('2025-11-01');
  const [accountStatus] = useState('Payment Due');

  const fees = [
    { name: 'Tuition Fees', amount: '$2000.00' },
    { name: 'Lab Fees (CS462, CS421)', amount: '$150.00' },
    { name: 'Library Fees', amount: '$50.00' },
    { name: 'Student Activity Fees', amount: '$100.00' },
    { name: 'Merit Scholarship', amount: '-$250.00' }
  ];

  const totalDue = 2650.00;

  const transactions = [
    {
      id: 'TXN78213',
      date: '2025-08-15',
      description: 'Fall 2025 - Deposit',
      amount: '$500.00',
      status: 'Completed'
    },
    {
      id: 'TXN45789',
      date: '2025-04-10',
      description: 'Spring 2025 Tuition',
      amount: '$2500.00',
      status: 'Completed'
    }
  ];

  const handlePayment = (paymentData) => {
    console.log('Processing payment:', paymentData);
    // Add payment processing logic here
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <BalanceCard balance={balance} />
          <DueDateCard dueDate={dueDate} />
          <AccountStatusCard status={accountStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 lg:gap-6">
          <FeeBreakdownCard 
            semester="Fall 2025" 
            fees={fees} 
            totalDue={totalDue} 
          />
          <PaymentHistoryTable transactions={transactions} />
        </div>

        <div className="lg:col-span-1">
          <MakePaymentCard 
            defaultAmount="2550.00" 
            onPayment={handlePayment} 
          />
        </div>
      </div>
    </div>
  );
};

export default StudentsPaymentPage;
