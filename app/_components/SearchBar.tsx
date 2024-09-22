import { Input } from "@/components/ui/input";
import FilterButton from "./FilterButton";

export default function SearchBar() {
  return (
    <div className="bg-white shadow-md p-4 flex items-center space-x-2">
      <Input placeholder="Search..." className="flex-grow" />
      <FilterButton />
    </div>
  );
}
