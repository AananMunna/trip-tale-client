import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";

const MobileFiltersSheet = ({
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  filters,
  tourTypes,
  durations,
  handlePriceChange,
  handleTourTypeChange,
  handleFilterChange,
  clearAllFilters,
  activeFiltersCount,
  packagesData
}) => {
  return (
    <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
      <SheetTrigger asChild>
        <div className="sm:hidden relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-10 h-10 p-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
          {activeFiltersCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="flex justify-between items-center">
            <span>Filters</span>
            <Button 
              variant="ghost" 
              className="text-emerald-600 hover:text-emerald-700"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-8">
          {/* Price Range Filter */}
          <div>
            <h3 className="font-medium mb-4 text-gray-700">Price Range</h3>
            <Slider
              min={0}
              max={10000}
              step={100}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={handlePriceChange}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>৳{filters.minPrice}</span>
              <span>৳{filters.maxPrice}</span>
            </div>
          </div>

          {/* Duration Filter */}
          <Accordion type="single" collapsible defaultValue="duration">
            <AccordionItem value="duration">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">Duration</span>
                  {filters.duration && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.duration}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {durations.map((dur) => (
                    <div key={dur} className="flex items-center space-x-3">
                      <Checkbox
                        id={`dur-${dur}`}
                        checked={filters.duration === dur}
                        onCheckedChange={() =>
                          handleFilterChange(
                            "duration",
                            filters.duration === dur ? "" : dur
                          )
                        }
                      />
                      <label 
                        htmlFor={`dur-${dur}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dur}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Tour Type Filter */}
            <AccordionItem value="tourType">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">Tour Type</span>
                  {filters.tourType.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.tourType.length} selected
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {tourTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.tourType.includes(type)}
                        onCheckedChange={() => handleTourTypeChange(type)}
                      />
                      <label 
                        htmlFor={`type-${type}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4">
            <Button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full"
              size="lg"
            >
              Show {packagesData?.total || 0} results
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFiltersSheet;