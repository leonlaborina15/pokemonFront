import { useState, useEffect } from "react"
import "./App.css"
import { SearchForm } from "./components/shared/search-form"
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
	const [set, setSet] = useState<string>("")
	const [language, setLanguage] = useState<string>("English")
	const [cards, setCards] = useState<Card[]>([
		// sample card data
		// {
		// 	card_name: "Pikachu ex",
		// 	card_number: "238/191",
		// 	set_name: "SV08: Surging Sparks",
		// 	rarity: "Special Illustration Rare",
		// 	tcgplayer_price: "461.04",
		// 	psa_10_price: "1350.6",
		// 	price_delta: "889.56",
		// 	profit_potential: "192.95",
		// },
		// {
		// 	card_name: "Pikachu",
		// 	card_number: "173/165",
		// 	set_name: "SV: Scarlet & Violet 151",
		// 	rarity: "Illustration Rare",
		// 	tcgplayer_price: "29.54",
		// 	psa_10_price: "103.49",
		// 	price_delta: "73.95",
		// 	profit_potential: "250.35",
		// },
		// {
		// 	card_name: "Pikachu ex",
		// 	card_number: "247/191",
		// 	set_name: "SV08: Surging Sparks",
		// 	rarity: "Hyper Rare",
		// 	tcgplayer_price: "148.04",
		// 	psa_10_price: "488.5",
		// 	price_delta: "340.46",
		// 	profit_potential: "229.98",
		// },
	])
	const [loading, setLoading] = useState<boolean>(false)
	const [filterDelta, setFilterDelta] = useState<string>("")
	// const [sortCriteria, setSortCriteria] = useState<string>("")
	// const [sortOrder, setSortOrder] = useState<string>("asc")

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
