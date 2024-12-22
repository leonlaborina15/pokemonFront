import { Input } from "../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button"
import { LoaderIcon } from "lucide-react"

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

export const SearchForm = ({
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
		<>
			<div className="my-4 flex gap-2 justify-between w-full">
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
					className="min-w-[4.375rem]"
					disabled={loading}
				>
					{loading ? <LoaderIcon className="animate-spin" /> : "Search"}
				</Button>
			</div>
			<div className="my-4 flex gap-2 justify-between w-full">
				{/* Input for filtering by price delta */}
				<Input
					type="text"
					value={filterDelta}
					onChange={(e) => setFilterDelta(e.target.value)}
					placeholder="Filter by Price Delta (e.g., >500 or <200)"
					className="max-w-80"
				/>
			</div>
		</>
	)
}
