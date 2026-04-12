export default function InfoCard({ title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm h-full relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
      <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-3">{title}</h3>
      <p className="text-4xl sm:text-5xl font-bold text-indigo-600 leading-none">{value}</p>
    </div>
  );
}