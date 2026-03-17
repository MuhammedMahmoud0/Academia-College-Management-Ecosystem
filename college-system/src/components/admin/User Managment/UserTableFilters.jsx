export default function UserTableFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={filter.value}
          onChange={(event) => onFilterChange(filter.key, event.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
      >
        Reset
      </button>
    </div>
  );
}
