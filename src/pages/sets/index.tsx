import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { SearchForm } from "@/components/shared/search-form-set"
import CardTable from "@/components/shared/card-table"
import { cardData } from "../home/card-data"
import { motion } from "framer-motion"

type Card = {
  card_name: string;
  card_number: string;
  set_name: string;
  rarity: string;
  tcgplayer_price: string;
  psa_10_price: string;
  price_delta: string;
  profit_potential: string;
};

type ApiResponse = {
  message?: string;
  cards?: Card[];
  error?: string;
};

const rarityOptionsEnglish = [
  { value: "All", label: "All Rarity" },
  { value: "Illustration Rare", label: "Illustration Rare" },
  { value: "Special Illustration Rare", label: "Special Illustration Rare" },
  { value: "Hyper Rare", label: "Hyper Rare" },
  { value: "Ultra Rare", label: "Ultra Rare" },
];

const rarityOptionsJapanese = [
  { value: "All", label: "All Rarity" },
  { value: "Special Art Rare", label: "Special Art Rare" },
  { value: "Super Rare", label: "Super Rare" },
  { value: "Ultra Rare", label: "Ultra Rare" },
  { value: "Art Rare", label: "Art Rare" },
];


const Sets: React.FC = () => {
  const location = useLocation()
  const [cardName, setCardName] = useState<string>("")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [filterDelta, setFilterDelta] = useState<string>("")
	const [rarity, setRarity] = useState<string>("");

  const [currentSet, setCurrentSet] = useState<string>("")
  const [currentLanguage, setCurrentLanguage] = useState<string>("English")
  const [error, setError] = useState<string>("")

  const getSetName = (set: string, language: string) => {
    const card = cardData.find((card) => card.title === language)
    return card?.sets.find((s) => s.replace(/[^a-zA-Z0-9]/g, "_") === set) || set
  }

  // Clear cards when inputs change
  useEffect(() => {
    setCards([]);
  }, [cardName, cardNumber]);

  // Handle URL parameters and initial fetch
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const setParam = params.get("set")
    const languageParam = params.get("language")

    if (setParam) {
      setCurrentSet(setParam)
    }
    if (languageParam) {
      setCurrentLanguage(languageParam)
    }

    // Auto-fetch cards when coming from home page
    if (setParam && languageParam) {
      const actualSetName = getSetName(setParam, languageParam)
      fetchCards(actualSetName, languageParam)
    }
  }, [location.search])

  const fetchCards = async (setName: string, language: string) => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.append("searchQuery", setName.trim())
      params.append("language", language)

      const response = await fetch(
        `http://127.0.0.1:8000/api/cards/scrape_and_save/?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.error) {
        setError(data.error)
        setCards([])
        return
      }

      if (data.cards) {
        setCards(data.cards)
      } else if (Array.isArray(data)) {
        setCards(data)
      } else {
        setError("Invalid response format from server")
        setCards([])
      }
    } catch (error) {
      console.error("Error fetching cards:", error)
      setError(error instanceof Error ? error.message : "An error occurred while fetching cards")
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!cardName && !cardNumber) {
      setError("Please enter either a card name or number")
      return
    }
    setError("")
    setLoading(true)
    setCards([])

    try {
      const params = new URLSearchParams()
      const actualSetName = getSetName(currentSet, currentLanguage)

      if (cardName) {
        params.append("searchQuery", cardName.trim())
      } else if (cardNumber) {
        params.append("searchQuery", cardNumber.trim())
      }

      params.append("language", currentLanguage)
      params.append("set_name", actualSetName)

      const response = await fetch(
        `https://pokemongradingtool-production.up.railway.app/api/cards/scrape_and_save/?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.error) {
        setError(data.error)
        setCards([])
        return
      }

      if (data.cards) {
        setCards(data.cards)
      } else if (Array.isArray(data)) {
        setCards(data)
      } else {
        setError("Invalid response format from server")
        setCards([])
      }
    } catch (error) {
      console.error("Error fetching cards:", error)
      setError(error instanceof Error ? error.message : "An error occurred while fetching cards")
      setCards([])
    } finally {
      setLoading(false)
    }
  }

   const filteredCards = cards.filter((card) => {
    if (filterDelta) {
      const deltaValue = parseFloat(card.price_delta || "0");
      if (filterDelta.startsWith(">")) {
        return deltaValue > parseFloat(filterDelta.slice(1));
      } else if (filterDelta.startsWith("<")) {
        return deltaValue < parseFloat(filterDelta.slice(1));
      }
    }
    if (rarity && rarity !== "All") {
      return card.rarity === rarity;
    }
    return true;
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      aria-label="Sets Section"
      className="min-h-[calc(100vh-64px)]"
    >
      <h1 className="text-center">Pokemon Grading Tool</h1>
      <h4 className="scroll-m-20 text-xl text-center font-semibold tracking-tight mb-6">
        {currentLanguage} | {getSetName(currentSet, currentLanguage)}
      </h4>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-center mb-4 p-2 bg-red-100 rounded"
        >
          {error}
        </motion.div>
      )}

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
    rarity={rarity}
    setRarity={setRarity}
    rarityOptions={currentLanguage === "English" ? rarityOptionsEnglish : rarityOptionsJapanese} // Add this line
/>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <CardTable loading={loading} sortedCards={filteredCards} />
      </motion.div>
    </motion.section>
  )
}

export default Sets
