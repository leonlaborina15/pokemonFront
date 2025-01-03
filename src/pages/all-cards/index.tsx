import { useState, useEffect } from "react";
import React from "react";
import { CardTable, SearchForm } from "@/components/shared";
import { motion } from "motion/react";

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

const AllCards: React.FC = () => {
  const [cardName, setCardName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [set, setSet] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterDelta, setFilterDelta] = useState<string>("");
  const [rarity, setRarity] = useState<string>("");

  useEffect(() => {
    console.log("Cards updated:", cards);
  }, [cards]);

  const handleSearch = async () => {
    if (!cardName && !cardNumber) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (cardName) params.append("searchQuery", cardName.trim());
      if (cardNumber) params.append("searchQuery", cardNumber.trim());
      params.append("language", language);

      const response = await fetch(
        `https://pokemongradingtool-production.up.railway.app/api/cards/scrape_and_save/?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const filteredData: Card[] = set
        ? data.filter((card: Card) => card.set_name === set)
        : data;

      setCards(filteredData);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

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
      aria-label="AllCards Section"
      className="min-h-[calc(100vh-64px)]"
    >
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
        rarity={rarity}
        setRarity={setRarity}
        rarityOptions={
          language === "English" ? rarityOptionsEnglish : rarityOptionsJapanese
        }
      />
      <CardTable loading={loading} sortedCards={filteredCards} />
    </motion.section>
  );
};

export default AllCards;
