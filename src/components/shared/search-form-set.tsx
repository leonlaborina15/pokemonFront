import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Info, LoaderIcon, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SearchFormProps = {
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  handleSearch: () => void;
  loading: boolean;
  filterDelta: string;
  setFilterDelta: (value: string) => void;
  rarity: string;
  setRarity: (value: string) => void;
  rarityOptions: { value: string; label: string }[];
};

export const SearchForm = ({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  handleSearch,
  loading,
  filterDelta,
  setFilterDelta,
  rarity,
  setRarity,
  rarityOptions,
}: SearchFormProps) => {
  return (
    <>
      <div className="mt-4 flex gap-2 mx-auto w-fit p-4 pb-2">
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

        <div className="space-y-2">
          <div className="relative h-9">
            <Input
              id="filter-delta"
              type="text"
              value={filterDelta}
              onChange={(e) => setFilterDelta(e.target.value)}
              placeholder="Filter by Price Delta"
              className="max-w-80"
            />
            {filterDelta && (
              <button
                onClick={() => setFilterDelta("")} // Clear only filterDelta
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

        <Button
          onClick={handleSearch}
          className="min-w-[4.375rem] hidden sm:inline-flex"
          disabled={loading}
        >
          {loading ? <LoaderIcon className="animate-spin" /> : "Search"}
        </Button>
      </div>
      <div className="px-4 mb-4">
        <Button
          onClick={handleSearch}
          className="w-full sm:hidden inline-flex"
          disabled={loading}
        >
          {loading ? <LoaderIcon className="animate-spin" /> : "Search"}
        </Button>
      </div>
    </>
  );
};