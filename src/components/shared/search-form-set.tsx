import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Info, LoaderIcon, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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
  const handleSliderChange = (value: number[]) => {
    const sliderValue = value[0];
    if (sliderValue === 0) {
      setFilterDelta("");
    } else if (sliderValue < 0) {
      setFilterDelta(`<${Math.abs(sliderValue)}`);
    } else {
      setFilterDelta(`>${sliderValue}`);
    }
  };

  const getInitialSliderValue = () => {
    if (!filterDelta) return [0];
    const match = filterDelta.match(/([<>])(\d+)/);
    if (!match) return [0];

    const [, operator, value] = match;
    return [operator === '<' ? -Number(value) : Number(value)];
  };

  return (
    <>
      <div className="mt-4 flex flex-col gap-2 mx-auto w-fit p-4 pb-2">
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="text"
              value={cardName}
              id="card-name"
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter card name"
              className="pr-8"
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
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-1/2">
            <div className="flex flex-col">
              <Slider
                defaultValue={getInitialSliderValue()}
                min={-1000}
                max={1000}
                step={1}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Filter By Price Delta: {filterDelta || '0'}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex">
                      <Info size={16} strokeWidth={2} aria-hidden="true" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Slide left for less than, right for greater than</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="w-1/2 h-10 hidden sm:inline-flex"
            disabled={loading}
          >
            {loading ? <LoaderIcon className="animate-spin" /> : "Search"}
          </Button>
        </div>
      </div>

      <div className="px-4 mb-4 sm:hidden">
        <Button
          onClick={handleSearch}
          className="w-full inline-flex"
          disabled={loading}
        >
          {loading ? <LoaderIcon className="animate-spin" /> : "Search"}
        </Button>
      </div>
    </>
  );
};