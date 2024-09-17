import React, { useState } from "react";

interface FilterBoxProps {
  onFilterChange: (filters: any) => void; // Define a proper type for filters
}

function FilterBox({ onFilterChange }: FilterBoxProps) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({ category: categoryFilter, verifiedOnly });
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Categories</option>
          {/* Add more category options here */}
        </select>
      </div>
      <div className="flex items-center">
        <input
          id="verified"
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
          Verified spots only
        </label>
      </div>
      <button
        onClick={handleFilterChange}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}

export default FilterBox;
