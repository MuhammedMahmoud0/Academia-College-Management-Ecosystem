export default function InfoCard({ label, value, className = "" }) {
    return (
        <div className={`${className}`}>
            <label className="text-sm text-gray-500 mb-1 block">{label}</label>
            <p className="text-base font-semibold text-slate-900">{value}</p>
        </div>
    );
}
