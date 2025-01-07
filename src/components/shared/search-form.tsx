import React from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  setOptions: string[];
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
  setOptions,
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
                onClick={() => setCardName("")} // Clear only cardName
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
                onClick={() => setCardNumber("")} // Clear only cardNumber
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Select for card set */}
          <Select value={set} onValueChange={setSet}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Sets">All Sets</SelectItem>
              {setOptions.map((setOption) => (
                <SelectItem key={setOption} value={setOption}>
                  {setOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Input for filtering by price delta */}
          <div className="relative">
            <Input
              id="filter-delta"
              type="text"
              value={filterDelta}
              onChange={(e) => setFilterDelta(e.target.value)}
              placeholder="Filter by Price Delta"
              className="pr-8"
            />
            {filterDelta && (
              <button
                onClick={() => setFilterDelta("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <X size={16} />
              </button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="absolute right-8 top-1/2 -translate-y-1/2">
                  <Info size={16} strokeWidth={2} aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>(e.g., &lt;500 or &gt;200)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex gap-2 items-center mt-2">
          {/* Select for language */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>

          {/* Select for rarity */}
          <Select value={rarity} onValueChange={setRarity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Rarity">All Rarity</SelectItem>
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