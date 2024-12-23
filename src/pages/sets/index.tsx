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
    const [currentLanguage, setCurrentLanguage] = useState<string>(language || "English")

    const getSetName = (set: string, language: string) => {
        const card = cardData.find((card) => card.title === language)
        return card?.sets.find((s) => s.replace(/[^a-zA-Z0-9]/g, "_") === set) || set
    }

    useEffect(() => {
        console.log("Cards updated:", cards)
    }, [cards])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const setParam = params.get("set")
        const languageParam = params.get("language")
        if (setParam) setCurrentSet(setParam)
        if (languageParam) setCurrentLanguage(languageParam)
    }, [location.search])

    const handleSearch = async () => {
        if (!cardName && !cardNumber) return
        setLoading(true)

        try {
            const params = new URLSearchParams()

            if (cardName) params.append("searchQuery", cardName.trim())
            if (cardNumber) params.append("searchQuery", cardNumber.trim())
            params.append("language", currentLanguage)

            // Debug logs
            console.log("Current Set:", currentSet)
            console.log("Current Language:", currentLanguage)

            const response = await fetch(
                `https://pokemongradingtool-production.up.railway.app/api/cards/scrape_and_save/?${params.toString()}`
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            // Get the actual set name for filtering
            const actualSetName = getSetName(currentSet, currentLanguage)
            console.log("Actual Set Name:", actualSetName)
            console.log("Available Cards:", data.map(card => card.set_name))

            // Filter the data using the actual set name
            const filteredData: Card[] = currentSet
                ? data.filter((card: Card) => {
                    const normalizedCardSet = card.set_name.trim()
                    const normalizedActualSet = actualSetName.trim()
                    return normalizedCardSet === normalizedActualSet
                })
                : data

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
            <h1 className="text-center text-4xl font-bold my-8">Pokemon Grading Tool</h1>
            <h4 className="scroll-m-20 text-xl text-center font-semibold tracking-tight mb-6">
                {currentLanguage} | {getSetName(currentSet, currentLanguage)}
            </h4>
            <div className="max-w-5xl mx-auto px-4">
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
            </div>
        </section>
    )
}

export default Sets