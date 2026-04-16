import React, { useState, useEffect, useCallback } from 'react';
import { getMyInvoices, getMyPaymentHistory, createPaymobOrder } from '../services/payment';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString('en-EG');

const statusStyles = {
  pending: { pill: 'bg-amber-50 text-amber-600 border border-amber-200', dot: 'bg-amber-400' },
  paid:    { pill: 'bg-emerald-50 text-emerald-600 border border-emerald-200', dot: 'bg-emerald-400' },
  overdue: { pill: 'bg-red-50 text-red-600 border border-red-200', dot: 'bg-red-400' },
  failed:  { pill: 'bg-red-50 text-red-600 border border-red-200', dot: 'bg-red-400' },
};

const StatusPill = ({ status }) => {
  const s = statusStyles[status] || { pill: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Sk = ({ h = 'h-12', w = 'w-full', r = 'rounded-xl' }) => (
  <div className={`animate-pulse bg-gray-200/70 ${h} ${w} ${r}`} />
);

// ─── Paymob iFrame Modal ──────────────────────────────────────────────────────
const PaymobModal = ({ iframeUrl, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4" onClick={onClose}>
    <div
      className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
      style={{ height: '88vh' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Secure Checkout</p>
            <p className="text-xs text-gray-400">256-bit SSL · Powered by Paymob</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors text-sm"
        >
          ✕
        </button>
      </div>
      <iframe src={iframeUrl} title="Paymob Payment" className="flex-1 w-full border-0" allow="payment" />
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const Empty = ({ icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mb-4 shadow-inner">{icon}</div>
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">{sub}</p>
  </div>
);

// ─── Invoice Course Row ───────────────────────────────────────────────────────
const CourseRow = ({ inv }) => (
  <div className="group flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-indigo-50/60 transition-all duration-150 border border-transparent hover:border-indigo-100">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800 tracking-tight">{inv.course_code}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{inv.credit_hours} cr hrs × EGP {fmt(inv.credit_price)} / hr</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <p className="text-sm font-extrabold text-gray-900">EGP {fmt(inv.total_amount)}</p>
      <StatusPill status={inv.status} />
    </div>
  </div>
);

// ─── Semester Card ────────────────────────────────────────────────────────────
const SemesterCard = ({ group }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-gray-900">{group.semester} {group.year}</h4>
          <p className="text-[11px] text-gray-400">{group.summary.totalInvoices} course{group.summary.totalInvoices !== 1 ? 's' : ''} enrolled</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
          EGP {fmt(group.summary.totalDue)} due
        </span>
        {group.summary.pendingInvoices > 0 && <StatusPill status="pending" />}
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mx-5" />

    {/* Rows */}
    <div className="px-2 py-3 space-y-1">
      {group.invoices.map(inv => <CourseRow key={inv.id} inv={inv} />)}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentsPaymentPage() {
  const [invoiceData, setInvoiceData]   = useState(null);
  const [historyData, setHistoryData]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [histLoading, setHistLoading]   = useState(true);
  const [error, setError]               = useState(null);
  const [paying, setPaying]             = useState(false);
  const [payError, setPayError]         = useState(null);
  const [iframeUrl, setIframeUrl]       = useState(null);
  const [tab, setTab]                   = useState('invoices');

  const fetchInvoices = useCallback(async () => {
    try { setLoading(true); setError(null); setInvoiceData(await getMyInvoices()); }
    catch (e) { setError(e?.response?.data?.message || 'Failed to load invoices.'); }
    finally { setLoading(false); }
  }, []);

  const fetchHistory = useCallback(async () => {
    try { setHistLoading(true); setHistoryData(await getMyPaymentHistory()); }
    catch { /* silent */ }
    finally { setHistLoading(false); }
  }, []);

  useEffect(() => { fetchInvoices(); fetchHistory(); }, [fetchInvoices, fetchHistory]);

  const handlePay = async () => {
    try {
      setPaying(true); setPayError(null);
      const r = await createPaymobOrder(true);
      r.iframeUrl ? setIframeUrl(r.iframeUrl) : setPayError('No payment URL returned.');
    } catch (e) {
      setPayError(e?.response?.data?.message || 'Payment failed to initialise.');
    } finally { setPaying(false); }
  };

  const summary    = invoiceData?.summary;
  const regPeriod  = invoiceData?.registrationPeriod;
  const payPeriod  = invoiceData?.paymentPeriod;
  const grouped    = invoiceData?.groupedInvoices || [];
  const payOpen    = payPeriod?.isOpen;
  const hasPending = summary?.pendingInvoices > 0;
  const totalPaid  = historyData?.summary?.totalAmountPaid ?? 0;
  const totalPmts  = historyData?.summary?.totalPayments ?? 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ══ HERO CARD ══════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 shadow-2xl shadow-indigo-200">
          {/* decorative circles */}
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-32 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            {/* Left — heading + stats */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h1 className="text-white font-bold text-lg tracking-tight">My Payments</h1>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <Sk h="h-10" w="w-48" r="rounded-xl" />
                  <Sk h="h-4" w="w-32" r="rounded-lg" />
                </div>
              ) : (
                <>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Total Outstanding</p>
                  <p className="text-5xl font-black text-white tracking-tight leading-none">
                    {error ? '—' : `EGP ${fmt(summary?.totalDue ?? 0)}`}
                  </p>
                  {!error && summary && (
                    <p className="text-white/60 text-sm mt-2">
                      {summary.pendingInvoices} pending invoice{summary.pendingInvoices !== 1 ? 's' : ''}
                      {summary.totalInvoices > summary.pendingInvoices ? ` · ${summary.totalInvoices - summary.pendingInvoices} paid` : ''}
                    </p>
                  )}
                </>
              )}

              {/* Period pills */}
              {!loading && (regPeriod || payPeriod) && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {regPeriod && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur border ${regPeriod.isOpen ? 'bg-white/15 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/50'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${regPeriod.isOpen ? 'bg-emerald-300' : 'bg-white/30'}`} />
                      Registration {regPeriod.isOpen ? 'Open' : 'Closed'}
                    </span>
                  )}
                  {payPeriod && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur border ${payPeriod.isOpen ? 'bg-white/15 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/50'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${payPeriod.isOpen ? 'bg-emerald-300 animate-pulse' : 'bg-white/30'}`} />
                      Payment {payPeriod.isOpen ? 'Open' : 'Closed'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right — stat tiles */}
            <div className="flex gap-3 sm:flex-col sm:gap-3 flex-wrap">
              <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-5 py-4 min-w-[130px]">
                <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Total Paid</p>
                <p className="text-white text-xl font-black mt-1">
                  {histLoading ? '…' : `EGP ${fmt(totalPaid)}`}
                </p>
                <p className="text-white/40 text-[11px] mt-0.5">{histLoading ? '' : `${totalPmts} payments`}</p>
              </div>

              <div className={`flex-1 sm:flex-none backdrop-blur border rounded-2xl px-5 py-4 min-w-[130px] ${payOpen ? 'bg-emerald-400/20 border-emerald-300/30' : 'bg-white/5 border-white/10'}`}>
                <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Pay Window</p>
                <p className={`text-xl font-black mt-1 ${payOpen ? 'text-emerald-200' : 'text-white/50'}`}>
                  {loading ? '…' : payOpen ? 'Open' : 'Closed'}
                </p>
                {!loading && payPeriod?.endDate && payOpen && (
                  <p className="text-emerald-200/60 text-[11px] mt-0.5">
                    Until {new Date(payPeriod.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
                {!loading && !payOpen && payPeriod?.nextOpenDate && (
                  <p className="text-white/30 text-[11px] mt-0.5">
                    Opens {new Date(payPeriod.nextOpenDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ ERROR ══════════════════════════════════════════════════════════ */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 text-red-500">⚠</div>
            <div>
              <p className="text-sm font-bold text-red-700">Failed to load payment data</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
              <button onClick={fetchInvoices} className="mt-1.5 text-xs text-red-600 underline">Try again</button>
            </div>
          </div>
        )}

        {/* ══ PAY NOW STRIP ═══════════════════════════════════════════════ */}
        {!loading && !error && hasPending && (
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-5 border ${payOpen ? 'bg-white border-indigo-100 shadow-sm' : 'bg-white border-gray-100'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${payOpen ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200' : 'bg-gray-100'}`}>
                <svg className={`w-5 h-5 ${payOpen ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{payOpen ? 'Complete Your Payment' : 'Payment Window is Closed'}</p>
                <p className="text-xs text-gray-500 mt-0.5 max-w-sm leading-relaxed">
                  {payOpen
                    ? `${summary.pendingInvoices} pending invoice${summary.pendingInvoices !== 1 ? 's' : ''} · EGP ${fmt(summary.totalDue)} will be charged in a single transaction via Paymob.`
                    : 'Your balance is locked until the payment window opens. Check back soon.'}
                </p>
                {payError && <p className="text-xs text-red-500 mt-1.5 font-medium">⚠ {payError}</p>}
              </div>
            </div>

            {payOpen && (
              <button
                onClick={handlePay}
                disabled={paying}
                className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {paying ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay EGP {fmt(summary.totalDue)}
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* ══ TABS ════════════════════════════════════════════════════════ */}
        <div className="flex gap-1 bg-white border border-gray-100 p-1.5 rounded-2xl w-fit shadow-sm">
          {[
            { id: 'invoices', icon: (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>), label: 'Invoices' },
            { id: 'history', icon: (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>), label: 'Payment History' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ INVOICES TAB ═══════════════════════════════════════════════ */}
        {tab === 'invoices' && (
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-sm">
                  <Sk h="h-6" w="w-40" />
                  <Sk h="h-12" />
                  <Sk h="h-12" />
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-sm">
                  <Sk h="h-6" w="w-40" />
                  <Sk h="h-12" />
                </div>
              </div>
            ) : error ? null : grouped.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Empty icon="📄" title="No invoices yet" sub="Enrol in courses to generate tuition invoices for the semester." />
              </div>
            ) : (
              grouped.map((g, i) => <SemesterCard key={i} group={g} />)
            )}
          </div>
        )}

        {/* ══ HISTORY TAB ════════════════════════════════════════════════ */}
        {tab === 'history' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {histLoading ? (
              <div className="p-6 space-y-3">
                <Sk h="h-5" w="w-48" />
                <Sk h="h-12" />
                <Sk h="h-12" />
                <Sk h="h-12" />
              </div>
            ) : !historyData?.payments?.length ? (
              <Empty icon="🕘" title="No payment history" sub="Your completed payment records will appear here." />
            ) : (
              <>
                {/* Summary strip */}
                <div className="flex flex-wrap items-center gap-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50/50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">
                      <span className="font-bold text-gray-900">{totalPmts}</span> total payments
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">
                      <span className="font-bold text-indigo-700">EGP {fmt(totalPaid)}</span> total paid
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Semester', 'Invoices', 'Amount', 'Gateway', 'Transaction ID', 'Paid At'].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {historyData.payments.map((p) => (
                        <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors duration-100">
                          <td className="px-5 py-4 text-sm font-bold text-gray-800">{p.semester} {p.year}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-700">{p.invoice_count}</span>
                          </td>
                          <td className="px-5 py-4 text-sm font-extrabold text-indigo-700">EGP {fmt(p.total_amount)}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                              {p.gateway}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-gray-400 max-w-[160px] truncate" title={p.transaction_id}>
                            {p.transaction_id || '—'}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {p.paid_at
                              ? new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ PAYMOB MODAL ════════════════════════════════════════════════ */}
        {iframeUrl && (
          <PaymobModal
            iframeUrl={iframeUrl}
            onClose={() => { setIframeUrl(null); fetchInvoices(); fetchHistory(); }}
          />
        )}
      </div>
    </div>
  );
}
