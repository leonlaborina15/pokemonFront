import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Info, LoaderIcon, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SearchFormProps = {
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  set: string;
  setSet: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  handleSearch: () => void;
  loading: boolean;
  filterDelta: string;
  setFilterDelta: (value: string) => void;
  rarity: string;
  setRarity: (value: string) => void;
  rarityOptions: { value: string; label: string }[];
};

const SearchForm: React.FC<SearchFormProps> = ({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  set,
  setSet,
  language,
  setLanguage,
  handleSearch,
  loading,
  filterDelta,
  setFilterDelta,
  rarity,
  setRarity,
  rarityOptions,
}) => {
  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto w-full">
        <div className="mt-6 grid grid-cols-2 gap-2 w-full">
          {/* Input for card name */}
          <div className="relative">
            <Input
              type="text"
              value={cardName}
              id="card-name"
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter card name"
              className="pr-8" // Add padding for the X button
            />
            {cardName && (
              <button
                onClick={() => setCardName("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Input for card number */}
          <div className="relative">
            <Input
              type="text"
              value={cardNumber}
              id="card-number"
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Enter card number"
              className="pr-8"
            />
            {cardNumber && (
              <button
                onClick={() => setCardNumber("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Input for card set */}
          <div className="relative">
            <Input
              type="text"
              value={set}
              id="card-set"
              onChange={(e) => setSet(e.target.value)}
              placeholder="Enter card set"
              className="pr-8"
            />
            {set && (
              <button
                onClick={() => setSet("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Input for filtering by price delta */}
          <div className="space-y-2">
            <div className="relative h-9">
              <Input
                id="filter-delta"
                type="text"
                value={filterDelta}
                onChange={(e) => setFilterDelta(e.target.value)}
                placeholder="Filter by Price Delta"
                className="pr-16 max-w-80" // Increased padding for both X and Info icons
              />
              {filterDelta && (
                <button
                  onClick={() => setFilterDelta("")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="absolute inset-y-0 end-0 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
                    <Info size={16} strokeWidth={2} aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>(e.g., &lt;500 or &gt;200)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center mt-2">
          {/* Select for language */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>

          {/* Select for rarity */}
          <Select value={rarity} onValueChange={setRarity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Rarity" />
            </SelectTrigger>
            <SelectContent>
              {rarityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search button */}
          <Button
            onClick={handleSearch}
            className="min-w-[4.375rem] w-full"
            disabled={loading}
          >
            {loading ? <LoaderIcon className="animate-spin" /> : "Search"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;