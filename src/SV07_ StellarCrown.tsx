import { useState, useEffect } from "react"
import "./App.css"
import { SearchForm } from "./components/shared/search-form-set"
import CardTable from "./components/shared/card-table"

type Card = {
	card_name: string
	card_number: string
	set_name: string
	rarity: string
	tcgplayer_price: string
	psa_10_price: string
	price_delta: string
	profit_potential: string
}

function App() {
	const [cardName, setCardName] = useState<string>("")
	const [cardNumber, setCardNumber] = useState<string>("")
	const [language, setLanguage] = useState<string>("English")
	const [cards, setCards] = useState<Card[]>([

	])
	const [loading, setLoading] = useState<boolean>(false)
	const [filterDelta, setFilterDelta] = useState<string>("")

	useEffect(() => {
		console.log("Cards updated:", cards)
	}, [cards])

	const handleSearch = async () => {
		if (!cardName && !cardNumber) return
		setLoading(true)

		try {
			const params = new URLSearchParams()

			if (cardName) params.append("searchQuery", cardName.trim())
			if (cardNumber) params.append("searchQuery", cardNumber.trim())
			params.append("language", language)

			const response = await fetch(
				`http://127.0.0.1:8000/api/cards/scrape_and_save/?${params.toString()}`
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()

			const filteredData: Card[] = data.filter(
				(card: Card) => card.set_name === "SV07: Stellar Crown"
			)
			setCards(filteredData)
		} catch (error) {
			console.error("Error fetching cards:", error)
			setCards([])
		} finally {
			setLoading(false)
		}
	}

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
