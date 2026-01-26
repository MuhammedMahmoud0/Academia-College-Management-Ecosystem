export default function ProfileCard() {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm flex flex-col items-center gap-3">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-400 flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold">
        JD
      </div>
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          John Doe
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Computer Science
        </p>
      </div>
    </div>
  );
}