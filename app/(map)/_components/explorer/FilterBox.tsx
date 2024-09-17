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

  return <div className="mt-4 space-y-4"></div>;
}

export default FilterBox;
