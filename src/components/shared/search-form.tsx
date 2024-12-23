import { Input } from "../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button"
import { Info, LoaderIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type SearchFormProps = {
	cardName: string
	setCardName: (value: string) => void
	cardNumber: string
	setCardNumber: (value: string) => void
	set: string
	setSet: (value: string) => void
	language: string
	setLanguage: (value: string) => void
	handleSearch: () => void
	loading: boolean
	filterDelta: string
	setFilterDelta: (value: string) => void
}

const SearchForm = ({
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
}: SearchFormProps) => {
	return (
		<div className="p-4">
			<div className="max-w-xl mx-auto w-full">
				<div className="mt-6 grid grid-cols-2 gap-2 w-full">
					{/* Input for card name */}
					<Input
						type="text"
						value={cardName}
						id="card-name"
						onChange={(e) => setCardName(e.target.value)}
						placeholder="Enter card name"
					/>
					{/* Input for card number */}
					<Input
						type="text"
						value={cardNumber}
						id="card-number"
						onChange={(e) => setCardNumber(e.target.value)}
						placeholder="Enter card number"
					/>
					{/* Input for card set */}
					<Input
						type="text"
						value={set}
						id="card-set"
						onChange={(e) => setSet(e.target.value)}
						placeholder="Enter card set"
					/>
					{/* Input for filtering by price delta */}
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
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className="absolute inset-y-0 end-0 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
										<Info
											size={16}
											strokeWidth={2}
											aria-hidden="true"
										/>
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
					<Select
						value={language}
						onValueChange={(value) => setLanguage(value)}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Language" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="English">English</SelectItem>
							<SelectItem value="Japanese">Japanese</SelectItem>
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
	)
}

export default SearchForm
