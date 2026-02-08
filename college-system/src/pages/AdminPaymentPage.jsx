import React, { useState } from "react";
import PaymentStatsCard from "../components/admin/Payment/PaymentStatsCard";
import PaymentFilters from "../components/admin/Payment/PaymentFilters";
import TransactionsTable from "../components/admin/Payment/TransactionsTable";

const AdminPaymentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with actual data from your backend
  const stats = {
    outstandingBalance: 125400.5,
    collectedThisSemester: 750200,
    overduePayments: 12,
  };

  const transactions = [
    {
      studentName: "Sarah Johnson",
      studentId: "JC-321657",
      date: "2025-10-15",
      amount: 2500.0,
      status: "Completed",
    },
    {
      studentName: "David Chen",
      studentId: "JC-310245",
      date: "2025-10-14",
      amount: 50.0,
      status: "Completed",
    },
    {
      studentName: "Emily White",
      studentId: "JC-321456",
      date: "2025-10-12",
      amount: 1500.0,
      status: "Processing",
    },
    {
      studentName: "Michael Brown",
      studentId: "JC-321568",
      date: "2025-10-10",
      amount: 2500.0,
      status: "Failed",
    },
  ];

  // Filter transactions based on search and status
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      transaction.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Student Name", "Student ID", "Date", "Amount", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [t.studentName, t.studentId, t.date, t.amount, t.status].join(","),
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
     <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      <div>
         <h1 className="text-3xl font-bold text-slate-900 mb-6">Payment Management</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <PaymentStatsCard
          icon={<span>$</span>}
          label="Outstanding Balance"
          value={`$${stats.outstandingBalance.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`}
          type="outstanding"
        />
        <PaymentStatsCard
          icon={<span>✓</span>}
          label="Collected This Semester"
          value={`$${stats.collectedThisSemester.toLocaleString("en-US")}`}
          type="collected"
        />
        <PaymentStatsCard
          icon={<span>%</span>}
          label="Overdue Payments"
          value={`${stats.overduePayments}%`}
          type="overdue"
        />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
        <PaymentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onExport={handleExportCSV}
        />
      </div>

      <div className="rounded-lg shadow-sm">
        <TransactionsTable transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default AdminPaymentPage;
