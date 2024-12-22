import { Input } from "../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button"

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
	sortCriteria: string
	setSortCriteria: (value: string) => void
	sortOrder: string
	setSortOrder: (value: string) => void
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
	// sortCriteria,
	// setSortCriteria,
	// sortOrder,
	// setSortOrder,
}: SearchFormProps) => {
	return (
		<>
			<div className="my-4 flex gap-2 justify-between w-full">
				<Input
					type="text"
					value={cardName}
					id="card-name"
					onChange={(e) => setCardName(e.target.value)}
					placeholder="Enter card name"
				/>
				<Input
					type="text"
					value={cardNumber}
					id="card-number"
					onChange={(e) => setCardNumber(e.target.value)}
					placeholder="Enter card number"
				/>
				<Input
					type="text"
					value={set}
					id="card-set"
					onChange={(e) => setSet(e.target.value)}
					placeholder="Enter card set"
				/>
				<Select>
					<SelectTrigger
						className="w-[180px]"
						value={language}
						onChange={(e) => setLanguage((e.target as HTMLSelectElement).value)}
					>
						<SelectValue placeholder="Language" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="English">English</SelectItem>
						<SelectItem value="Japanese">Japanese</SelectItem>
					</SelectContent>
				</Select>
				<Button
					onClick={handleSearch}
					className=""
				>
					{loading ? "Searching..." : "Search"}
				</Button>
			</div>
			<div className="my-4 flex gap-2 justify-between w-full">
				<Input
					type="text"
					value={filterDelta}
					onChange={(e) => setFilterDelta(e.target.value)}
					placeholder="Filter by Price Delta (e.g., >500 or <200)"
					className="form-control me-2"
					style={{ maxWidth: "300px" }}
				/>
				{/* <Select>
					<SelectTrigger
						value={sortCriteria}
						onChange={(e) => setSortCriteria((e.target as HTMLSelectElement).value)}
					>
						<SelectValue placeholder="Sort By" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="price_delta">Price Delta</SelectItem>
						<SelectItem value="profit_potential">Profit Potential</SelectItem>
						<SelectItem value="rarity">Rarity</SelectItem>
					</SelectContent>
				</Select> */}
				{/* <Select>
					<SelectTrigger
						value={sortOrder}
						onChange={(e) => setSortOrder((e.target as HTMLSelectElement).value)}
					>
						<SelectValue placeholder="Order" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="asc">Ascending</SelectItem>
						<SelectItem value="desc">Descending</SelectItem>
					</SelectContent>
				</Select> */}
			</div>
		</>
	)
}
