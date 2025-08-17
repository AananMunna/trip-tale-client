import React, { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import components
import SearchAndSortBar from "../components/SearchAndSortBar";
import MobileFiltersSheet from "../components/MobileFiltersSheet";
import ActiveFilters from "../components/ActiveFilters";
import FiltersSidebar from "../components/FiltersSidebar";
import PackageResults from "../components/PackageResults";

const TripPage = () => {
  const axiosSecure = useAxiosSecure();
  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    duration: "",
    tourType: [],
    sortBy: "",
    page: 1,
    limit: 12,
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Extract unique tour types for filter options
  const tourTypes = [
    "Nature",
    "Adventure",
    "Cultural",
    "Beach",
    "Historical",
    "Wildlife",
    "Hiking",
    "Religious",
  ];

  const durations = [
    "1 Day",
    "2 Days",
    "3 Days",
    "4 Days",
    "5 Days",
    "1 Week",
    "2 Weeks",
    "3 Weeks+",
  ];

  const fetchPackages = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.append(key, value);
      }
    });

    const { data } = await axiosSecure.get(
      `/packages/filter?${params.toString()}`
    );
    return data;
  };

  const {
    data: packagesData = { packages: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["packages", filters],
    queryFn: fetchPackages,
  });

  useEffect(() => {
    // Update active filters whenever filters change
    const newActiveFilters = [];
    if (filters.search) newActiveFilters.push(`Search: ${filters.search}`);
    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      newActiveFilters.push(`Price: ৳${filters.minPrice}-৳${filters.maxPrice}`);
    }
    if (filters.duration)
      newActiveFilters.push(`Duration: ${filters.duration}`);
    if (filters.tourType.length > 0) {
      newActiveFilters.push(`Types: ${filters.tourType.join(", ")}`);
    }
    if (filters.sortBy) {
      const sortLabels = {
        "price-low": "Price: Low to High",
        "price-high": "Price: High to Low",
        duration: "Duration",
        popular: "Popular",
      };
      newActiveFilters.push(`Sort: ${sortLabels[filters.sortBy]}`);
    }
    setActiveFilters(newActiveFilters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleTourTypeChange = (type) => {
    setFilters((prev) => {
      const newTypes = prev.tourType.includes(type)
        ? prev.tourType.filter((t) => t !== type)
        : [...prev.tourType, type];
      return { ...prev, tourType: newTypes, page: 1 };
    });
  };

  const handlePriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
      page: 1,
    }));
  };

  const removeFilter = (filterIndex) => {
    const filterText = activeFilters[filterIndex];

    if (filterText.startsWith("Search:")) {
      handleFilterChange("search", "");
    } else if (filterText.startsWith("Price:")) {
      handleFilterChange("minPrice", 0);
      handleFilterChange("maxPrice", 10000);
    } else if (filterText.startsWith("Duration:")) {
      handleFilterChange("duration", "");
    } else if (filterText.startsWith("Types:")) {
      handleFilterChange("tourType", []);
    } else if (filterText.startsWith("Sort:")) {
      handleFilterChange("sortBy", "");
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      duration: "",
      tourType: [],
      sortBy: "",
      page: 1,
      limit: 12,
    });
  };

  const activeFiltersCount = [
    filters.search ? 1 : 0,
    filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0,
    filters.duration ? 1 : 0,
    filters.tourType.length,
    filters.sortBy ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        Error loading trips: {error.message}
      </p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-22 sm:py-22">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-8 tracking-tight">
        Explore Our Trips
      </h1>

      <SearchAndSortBar
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      <MobileFiltersSheet
        isMobileFiltersOpen={isMobileFiltersOpen}
        setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        filters={filters}
        tourTypes={tourTypes}
        durations={durations}
        handlePriceChange={handlePriceChange}
        handleTourTypeChange={handleTourTypeChange}
        handleFilterChange={handleFilterChange}
        clearAllFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        packagesData={packagesData}
      />

      <ActiveFilters
        activeFilters={activeFilters}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Hidden on mobile, visible on lg screens and up */}
        <div className="hidden lg:block">
          <FiltersSidebar
            filters={filters}
            tourTypes={tourTypes}
            durations={durations}
            handlePriceChange={handlePriceChange}
            handleTourTypeChange={handleTourTypeChange}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />
        </div>

        <PackageResults
          packagesData={packagesData}
          filters={filters}
          handlePageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default TripPage;