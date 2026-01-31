export default function OfficeHoursCard() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h2>
            <div className="mb-4">
                <p className="text-sm text-gray-700">Tue. 14:00 - 16:00</p>
            </div>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Update Hours
            </button>
        </div>
    );
}
