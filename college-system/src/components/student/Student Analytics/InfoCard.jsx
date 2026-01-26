export default function InfoCard({ title, value}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-5xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}