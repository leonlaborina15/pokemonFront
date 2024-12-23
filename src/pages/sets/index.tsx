import { useParams, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { SearchForm } from "@/components/shared/search-form-set"
import CardTable from "@/components/shared/card-table"
import { cardData } from "../home/card-data"

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

const Sets: React.FC = () => {
	const { set, language } = useParams<{ set: string; language: string | undefined }>()
	const location = useLocation()
	const [cardName, setCardName] = useState<string>("")
	const [cardNumber, setCardNumber] = useState<string>("")
	const [cards, setCards] = useState<Card[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [filterDelta, setFilterDelta] = useState<string>("")
	const [currentSet, setCurrentSet] = useState<string>(set || "")
	const [currentLanguage, setCurrentLanguage] = useState<string>(language || "")

	const getSetName = (set: string, language: string) => {
		const card = cardData.find((card) => card.title === language)
		return card?.sets.find((s) => s.replace(/[^a-zA-Z0-9]/g, "_") === set) || set
	}

	useEffect(() => {
		console.log("Cards updated:", cards)
	}, [cards])

	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const set = params.get("set")
		const language = params.get("language")
		if (set) setCurrentSet(set)
		if (language) setCurrentLanguage(language)
	}, [location.search])

	const handleSearch = async () => {
		if (!cardName && !cardNumber) return
		setLoading(true)

		try {
			const params = new URLSearchParams()

			if (cardName) params.append("searchQuery", cardName.trim())
			if (cardNumber) params.append("searchQuery", cardNumber.trim())
			params.append("language", currentLanguage)

				const response = await fetch(
				`https://pokemongradingtool-production.up.railway.app/api/cards/scrape_and_save/?${params.toString()}`
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
			aria-label="Sets Section"
			className="min-h-[calc(100vh-64px)]"
		>
			<h1 className="text-center">Pokemon Grading Tool</h1>
			<h4 className="scroll-m-20 text-xl text-center font-semibold tracking-tight">
				{currentLanguage} | {getSetName(currentSet, currentLanguage)}
			</h4>
			<SearchForm
				cardName={cardName}
				setCardName={setCardName}
				cardNumber={cardNumber}
				setCardNumber={setCardNumber}
				set={currentSet}
				setSet={setCurrentSet}
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

export default Sets
