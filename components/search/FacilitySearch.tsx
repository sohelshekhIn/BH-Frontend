"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Facility } from "@/types/facility";
import apiClient from "@/lib/api";
import { getEmissionColor } from "@/lib/mapbox-config";
import { useDebounce } from "@/hooks/use-debounce";

interface FacilitySearchProps {
  onFacilitySelect?: (facility: Facility) => void;
  className?: string;
}

export function FacilitySearch({ onFacilitySelect, className }: FacilitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const searchFacilities = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const facilities = await apiClient.searchFacilities(searchQuery);
      setResults(facilities);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchFacilities(debouncedQuery);
  }, [debouncedQuery, searchFacilities]);

  const formatEmissions = (co2e: number): string => {
    if (co2e >= 1000000) {
      return `${(co2e / 1000000).toFixed(1)}M`;
    }
    return `${(co2e / 1000).toFixed(0)}k`;
  };

  const handleSelect = (facility: Facility) => {
    setQuery(facility.name);
    setIsOpen(false);
    onFacilitySelect?.(facility);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search facilities by name or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="pl-10 bg-background/95 backdrop-blur"
        />
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full max-w-md z-50 shadow-lg max-h-[400px] overflow-y-auto">
          <div className="p-2">
            {results.map((facility) => (
              <button
                key={facility.id}
                onClick={() => handleSelect(facility)}
                className="w-full text-left p-3 hover:bg-accent rounded-md transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Building2
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    style={{ color: getEmissionColor(facility.co2e_2023) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1 truncate">{facility.name}</div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {facility.id}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {facility.province}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          backgroundColor: getEmissionColor(facility.co2e_2023) + "20",
                        }}
                      >
                        {formatEmissions(facility.co2e_2023)} tCO₂e
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {facility.naics_description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {isLoading && (
        <div className="absolute top-full mt-2 w-full">
          <Card className="p-4 text-center text-sm text-muted-foreground">Searching...</Card>
        </div>
      )}

      {query.length >= 2 && !isLoading && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full">
          <Card className="p-4 text-center text-sm text-muted-foreground">
            No facilities found
          </Card>
        </div>
      )}
    </div>
  );
}

