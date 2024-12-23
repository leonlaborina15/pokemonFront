import "./App.css"
import { useState, useEffect } from "react"
import { SearchForm } from "./components/shared/search-form"
import CardTable, { Card } from "./components/shared/card-table"

function App() {
	// State variables for form inputs and card data
	const [cardName, setCardName] = useState<string>("")
	const [cardNumber, setCardNumber] = useState<string>("")
	const [set, setSet] = useState<string>("")
	const [language, setLanguage] = useState<string>("English")
	const [cards, setCards] = useState<Card[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [filterDelta, setFilterDelta] = useState<string>("")

	// Log cards data whenever it updates
	useEffect(() => {
		console.log("Cards updated:", cards)
	}, [cards])

	// Function to handle search and fetch card data from API
	const handleSearch = async () => {
		if (!cardName && !cardNumber) return
		setLoading(true)

        try {
            const params = new URLSearchParams()

			// Append search parameters based on user input
			if (cardName) params.append("searchQuery", cardName.trim())
			if (cardNumber) params.append("searchQuery", cardNumber.trim())
			params.append("language", language)

			// Fetch data from API
			const response = await fetch(
				`http://127.0.0.1:8000/api/cards/scrape_and_save/?${params.toString()}`
			)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

			// Filter data to include only cards from a specific set
			const filteredData: Card[] = data.filter(
				(card: Card) => card.set_name === "SV08: Surging Sparks"
			)
			setCards(filteredData)
		} catch (error) {
			console.error("Error fetching cards:", error)
			setCards([])
		} finally {
			setLoading(false)
		}
	}

	// Filter cards based on price delta if filter is applied
	const filteredCards = cards.filter((card) => {
		if (filterDelta) {
			const deltaValue = parseFloat(card.price_delta.toString() || "0")
			if (filterDelta.startsWith(">")) {
				return deltaValue > parseFloat(filterDelta.slice(1))
			} else if (filterDelta.startsWith("<")) {
				return deltaValue < parseFloat(filterDelta.slice(1))
			}
		}
		return true
	})

    return (
        <>
            <div className="max-w-5xl mx-auto py-5">
                <h1 className="text-5xl font-bold text-center my-12">Pokemon Grading Tool</h1>
                <SearchForm
                    cardName={cardName}
                    setCardName={setCardName}
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    set={set}
                    setSet={setSet}
                    language={language}
                    setLanguage={setLanguage}
                    handleSearch={handleSearch}
                    loading={loading}
                    filterDelta={filterDelta}
                    setFilterDelta={setFilterDelta}
                />
                <CardTable
                    loading={loading}
                    sortedCards={filteredCards}
                />
            </div>
        </>
    )
}

export default App