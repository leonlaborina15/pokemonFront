import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchForm } from "@/components/shared/search-form-set";
import CardTable from "@/components/shared/card-table";
import { cardData } from "../home/card-data";
import { motion } from "framer-motion";

type Card = {
  card_name: string;
  card_number: string;
  set_name: string;
  rarity: string;
  tcgplayer_price: string;
  psa_10_price: string;
  price_delta: string;
  profit_potential: string;
  last_updated: string; // Ensure last_updated is included
  language: string; // Ensure language is included
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
  const location = useLocation();
  const [cardName, setCardName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterDelta, setFilterDelta] = useState<string>("");
  const [rarity, setRarity] = useState<string>("All");

  const [currentSet, setCurrentSet] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("English");
  const [error, setError] = useState<string>("");

  const getSetName = (set: string, language: string) => {
    const card = cardData.find((card) => card.title === language);
    return card?.sets.find((s) => s.replace(/[^a-zA-Z0-9]/g, "_") === set) || set;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const setParam = params.get("set");
    const languageParam = params.get("language");

    if (setParam) {
      setCurrentSet(setParam);
    }
    if (languageParam) {
      setCurrentLanguage(languageParam);
    }
  }, [location.search]);

  const handleSearch = async () => {
    setError("");
    setLoading(true);
    setCards([]);

    try {
      const params = new URLSearchParams();
      const actualSetName = getSetName(currentSet, currentLanguage);

      if (cardName.trim()) {
        params.append("card_name", cardName.trim());
      }
      if (cardNumber.trim()) {
        params.append("card_number", cardNumber.trim());
      }
      params.append("set_name", actualSetName);
      params.append("language", currentLanguage);

      if (rarity && rarity !== "All") {
        params.append("rarity", rarity);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/cards/fetch_set/?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.error) {
        setError(data.error);
        setCards([]);
        return;
      }

      if (data.cards) {
        setCards(data.cards.map((card) => {
          const [name, number] = card.card_name.split(" - ");
          return { ...card, card_name: name, card_number: number };
        }));
      } else if (Array.isArray(data)) {
        setCards(data.map((card) => {
          const [name, number] = card.card_name.split(" - ");
          return { ...card, card_name: name, card_number: number };
        }));
      } else {
        setError("Invalid response format from server");
        setCards([]);
      }

    } catch (error) {
      console.error("Error fetching cards:", error);
      setError(error instanceof Error ? error.message : "An error occurred while fetching cards");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter((card) => {
    const matchesRarity = rarity === "All" || card.rarity === rarity;
    const matchesDelta =
      !filterDelta ||
      (filterDelta.startsWith(">") && parseFloat(card.price_delta || "0") > parseFloat(filterDelta.slice(1))) ||
      (filterDelta.startsWith("<") && parseFloat(card.price_delta || "0") < parseFloat(filterDelta.slice(1)));
    const matchesCardName = card.card_name?.toLowerCase().includes(cardName.toLowerCase());
    const matchesCardNumber = card.card_number?.includes(cardNumber);
    return matchesRarity && matchesDelta && matchesCardName && matchesCardNumber;
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
        handleSearch={handleSearch}
        loading={loading}
        filterDelta={filterDelta}
        setFilterDelta={setFilterDelta}
        rarity={rarity}
        setRarity={setRarity}
        rarityOptions={currentLanguage === "English" ? rarityOptionsEnglish : rarityOptionsJapanese}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <CardTable loading={loading} sortedCards={filteredCards} />
      </motion.div>
    </motion.section>
  );
};

export default Sets;