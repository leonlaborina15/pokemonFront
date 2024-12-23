import { useState, useEffect } from "react"
import React from "react"
import { CardTable, SearchForm } from "@/components/shared"

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

const AllCards: React.FC = () => {
	const [cardName, setCardName] = useState<string>("")
	const [cardNumber, setCardNumber] = useState<string>("")
	const [set, setSet] = useState<string>("")
	const [language, setLanguage] = useState<string>("English")
	const [cards, setCards] = useState<Card[]>([])
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

			const filteredData: Card[] = set ? data.filter((card: Card) => card.set_name === set) : data
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
		<section
			aria-label="AllCards Section"
			className="min-h-[calc(100vh-64px)]"
		>
			{" "}
			<h1 className="text-center">Pokemon Grading Tool</h1>
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
		</section>
	)
}

export default AllCards
