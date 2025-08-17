import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ActiveFilters = ({ activeFilters, removeFilter, clearAllFilters }) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {activeFilters.map((filter, index) => (
        <Badge
          key={index}
          variant="outline"
          className="flex items-center gap-1 py-1 px-3 cursor-pointer hover:bg-gray-100"
          onClick={() => removeFilter(index)}
        >
          {filter}
          <X className="w-3 h-3" />
        </Badge>
      ))}
      <Button
        variant="ghost"
        className="text-sm text-emerald-600 h-auto p-0 px-1"
        onClick={clearAllFilters}
      >
        Clear all
      </Button>
    </div>
  );
};

export default ActiveFilters;