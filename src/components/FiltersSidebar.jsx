import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const FiltersSidebar = ({
  filters,
  tourTypes,
  durations,
  handlePriceChange,
  handleTourTypeChange,
  handleFilterChange,
  clearAllFilters,
}) => {
  return (
    <div className="w-64 space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <Slider
          min={0}
          max={10000}
          step={100}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={handlePriceChange}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>৳{filters.minPrice}</span>
          <span>৳{filters.maxPrice}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Duration</h3>
        <div className="space-y-2">
          {durations.map((dur) => (
            <div key={dur} className="flex items-center space-x-2">
              <Checkbox
                id={`desktop-dur-${dur}`}
                checked={filters.duration === dur}
                onCheckedChange={() =>
                  handleFilterChange("duration", filters.duration === dur ? "" : dur)
                }
              />
              <label
                htmlFor={`desktop-dur-${dur}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {dur}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Tour Type</h3>
        <div className="space-y-2">
          {tourTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`desktop-type-${type}`}
                checked={filters.tourType.includes(type)}
                onCheckedChange={() => handleTourTypeChange(type)}
              />
              <label
                htmlFor={`desktop-type-${type}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={clearAllFilters}
        variant="outline"
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default FiltersSidebar;