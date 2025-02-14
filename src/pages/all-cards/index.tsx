import { useState, useEffect } from "react";
import React from "react";
import { CardTable, SearchForm } from "@/components/shared";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Card = {
  card_name: string;
  card_number: string;
  set_name: string;
  rarity: string;
  tcgplayer_price: string;
  psa_10_price: string;
  price_delta: string;
  profit_potential: string;
  last_updated: string;
  language: string;
  product_id: string;
};

type ApiResponse = {
  message?: string;
  cards?: Card[];
  error?: string;
};

const rarityOptionsEnglish = [
  { value: "Illustration Rare", label: "Illustration Rare" },
  { value: "Special Illustration Rare", label: "Special Illustration Rare" },
  { value: "Hyper Rare", label: "Hyper Rare" },
];

const rarityOptionsJapanese = [
  { value: "Special Art Rare", label: "Special Art Rare" },
  { value: "Super Rare", label: "Super Rare" },
  { value: "Ultra Rare", label: "Ultra Rare" },
  { value: "Art Rare", label: "Art Rare" },
];

const englishSets = [
  "SV08: Surging Sparks",
  "SV07: Stellar Crown",
  "SV06: Twilight Masquerade",
  "SV05: Temporal Forces",
  "SV04: Paradox Rift",
  "SV03: Obsidian Flames",
  "SV: Shrouded Fable",
  "SV: Scarlet & Violet 151",
  "SV: Paldean Fates"
];

const japaneseSets = [
  "SV7A: Paradise Dragona",
  "SV7: Stellar Miracle",
  "SV6A: Night Wanderer",
  "SV6: Transformation Mask",
  "SV5M: Cyber Judge",
  "SV5K: Wild Force",
  "SV5A: Crimson Haze",
  "SV-P Promotional Cards",
  "SV: Ancient Koraidon ex Starter Deck & Build Set",
  "SV8a: Terastal Fest ex",
  "SV8: Super Electric Breaker"
];

const AllCards: React.FC = () => {
  const [cardName, setCardName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [set, setSet] = useState<string>("All Sets");
  const [language, setLanguage] = useState<string>("English");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterDelta, setFilterDelta] = useState<string>("");
  const [rarity, setRarity] = useState<string>("All Rarity");

  useEffect(() => {
    setCards([]);
  }, [cardName, set, language]);

  useEffect(() => {
    console.log("Cards updated:", cards);
  }, [cards]);

  const handleSearch = async () => {
    if (!cardName && set === "All Sets") {
      toast.error("Please enter either a card name or select a set.");
      return;
    }
    setLoading(true);
    setCards([]);

    try {
      const params = new URLSearchParams();
      params.append("language", language);

      let response: Response | undefined;

      if (set !== "All Sets" && !cardName) {
        params.append("set_name", set.trim());
        response = await fetch(`https://pokemongradingtool-production.up.railway.app/api/cards/fetch_set/?${params.toString()}`);
      } else if (cardName && set === "All Sets") {
        params.append("card_name", cardName.trim());
        response = await fetch(`https://pokemongradingtool-production.up.railway.app/api/cards/fetch_card/?${params.toString()}`);
      } else if (cardName && set !== "All Sets") {
        params.append("card_name", cardName.trim());
        params.append("set_name", set.trim());
        response = await fetch(`https://pokemongradingtool-production.up.railway.app/api/cards/fetch_card_set/?${params.toString()}`);
      } else if (cardName && cardNumber) {
        params.append("card_name", cardName.trim());
        params.append("card_number", cardNumber.trim());
        response = await fetch(`https://pokemongradingtool-production.up.railway.app/api/cards/fetch_card_number/?${params.toString()}`);
      }

      if (!response) {
        throw new Error("No valid search criteria provided");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.error) {
        toast.error(data.error);
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
        toast.error("Invalid response format from server");
        setCards([]);
      }

    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred while fetching cards");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter((card) => {
    const matchesLanguage = card.language === language;
    const matchesRarity = rarity === "All Rarity" || card.rarity === rarity;
    const matchesDelta =
      !filterDelta ||
      (filterDelta.startsWith(">") && parseFloat(card.price_delta || "0") > parseFloat(filterDelta.slice(1))) ||
      (filterDelta.startsWith("<") && parseFloat(card.price_delta || "0") < parseFloat(filterDelta.slice(1)));
    const matchesCardName = card.card_name?.toLowerCase().includes(cardName.toLowerCase());
    const matchesCardNumber = card.card_number?.includes(cardNumber);
    return matchesLanguage && matchesRarity && matchesDelta && matchesCardName && matchesCardNumber;
  });

  const setOptions = language === "English" ? englishSets : japaneseSets;

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
        rarityOptions={language === "English" ? rarityOptionsEnglish : rarityOptionsJapanese}
        setOptions={setOptions}
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

export default AllCards;