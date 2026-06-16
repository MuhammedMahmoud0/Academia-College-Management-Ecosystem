import React, { useState, useEffect } from "react";
import PaymentStatsCard from "../components/admin/Payment/PaymentStatsCard";
import PaymentFilters from "../components/admin/Payment/PaymentFilters";
import TransactionsTable from "../components/admin/Payment/TransactionsTable";
import { getPaymentCards, getStudentPayments } from "../services/paymentReport";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const AdminPaymentPage = () => {
  const [filters, setFilters] = useState({
    date: "",
    payMethod: "all",
    status: "all",
  });
  
  const [searchTerm, setSearchTerm] = useState("");

  const [stats, setStats] = useState({
    outstandingBalance: 0,
    collectedThisSemester: 0,
    overduePaymentsPercentage: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const data = await getPaymentCards();
      if (data && data.cards) {
        setStats({
          outstandingBalance: data.cards.outstandingBalance || 0,
          collectedThisSemester: data.cards.collectedThisSemester || 0,
          overduePaymentsPercentage: data.cards.overduePaymentsPercentage || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch payment cards:", error);
      toast.error("Failed to load payment statistics");
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await getStudentPayments(filters);
      if (data && data.payments) {
        // Map backend fields to frontend table format
        const mappedTransactions = data.payments.map((p) => ({
          studentName: p.student_name,
          studentId: p.student_user_id.split('-')[0].toUpperCase(), // Shorten UUID for display
          semester: p.semester,
          year: p.year,
          gateway: p.gateway,
          transactionId: p.transaction_id,
          invoiceCount: p.invoice_count,
          date: new Date(p.paid_at || p.created_at).toISOString().split("T")[0],
          amount: p.total_amount,
          status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
        }));
        setTransactions(mappedTransactions);
      }
    } catch (error) {
      console.error("Failed to fetch student payments:", error);
      toast.error("Failed to load payment transactions");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCards(), fetchPayments()]);
      setLoading(false);
    };
    
    loadData();
  }, [filters]);

  // Client-side filtering by student name or id
  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.studentName.toLowerCase().includes(searchLower) ||
      transaction.studentId.toLowerCase().includes(searchLower)
    );
  });

  const handleExportExcel = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Prepare data for Excel
    const excelData = filteredTransactions.map((t) => ({
      "Student Name": t.studentName,
      "Student ID": t.studentId,
      "Term": `${t.semester} ${t.year}`,
      "Date": t.date,
      "Gateway": t.gateway || 'N/A',
      "Transaction ID": t.transactionId || 'N/A',
      "Invoices": t.invoiceCount,
      "Amount": t.amount,
      "Status": t.status,
    }));

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `Payment_Transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Excel file exported successfully");
  };

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      <div>
         <h1 className="text-3xl font-bold text-slate-900 mb-6">Payment Reports</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <PaymentStatsCard
          icon={<span>$</span>}
          label="Outstanding Balance"
          value={loading ? "..." : `$${stats.outstandingBalance.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`}
          type="outstanding"
        />
        <PaymentStatsCard
          icon={<span>✓</span>}
          label="Collected This Semester"
          value={loading ? "..." : `$${stats.collectedThisSemester.toLocaleString("en-US")}`}
          type="collected"
        />
        <PaymentStatsCard
          icon={<span>%</span>}
          label="Overdue Payments"
          value={loading ? "..." : `${stats.overduePaymentsPercentage}%`}
          type="overdue"
        />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
        <PaymentFilters
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onExport={handleExportExcel}
        />
      </div>

      <div className="rounded-lg shadow-sm">
        {loading ? (
           <div className="p-8 text-center text-gray-500">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
           <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">No transactions found matching the filters.</div>
        ) : (
           <TransactionsTable transactions={filteredTransactions} />
        )}
      </div>
    </div>
  );
};

export default AdminPaymentPage;
