import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Define the Card type with relevant properties
export type Card = {
  card_name: string;
  card_number: string;
  set_name: string;
  rarity: string;
  tcgplayer_price: string;
  psa_10_price: string;
  price_delta: string;
  profit_potential: string;
  last_updated: string; // Add this line
  product_id: string; // Add this line
};

type SortColumn = keyof Card;

export default function CardTable({
  sortedCards,
  loading,
}: {
  sortedCards?: Card[];
  loading: boolean;
}) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("card_name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Memoize sorted cards to optimize performance
  const sortedCardsMemo = useMemo(() => {
    return [...(sortedCards || [])].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortedCards, sortColumn, sortDirection]);

  // Handle sorting logic when a column header is clicked
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Format the date for better readability
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle row click to open the product link
  const handleRowClick = (product_id: string) => {
    const url = `https://www.tcgplayer.com/product/${product_id}/pokemon-sv08-surging-sparks-night-stretcher-251-191?page=1&Language=all`;
    window.open(url, "_blank");
  };

  return (
    <div className="mx-auto w-[calc(100dvw-1rem)] md:w-full overflow-x-auto px-4 pb-20">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {/* Render table headers with sorting functionality */}
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("card_name")}
            >
              Card Name {sortColumn === "card_name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("card_number")}
            >
              Card Number {sortColumn === "card_number" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("set_name")}
            >
              Set {sortColumn === "set_name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("rarity")}
            >
              Rarity {sortColumn === "rarity" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("tcgplayer_price")}
            >
              TCGPlayer Price{" "}
              {sortColumn === "tcgplayer_price" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("psa_10_price")}
            >
              PSA 10 Price {sortColumn === "psa_10_price" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("price_delta")}
            >
              Price Delta {sortColumn === "price_delta" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("profit_potential")}
            >
              Profit Potential{" "}
              {sortColumn === "profit_potential" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("last_updated")} // Add sorting for Last Pull
            >
              Last Pull {sortColumn === "last_updated" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => {
              return (
                <TableRow key={index}>
                  {Array.from({ length: 9 }).map((_, index) => ( // Update length to 9
                    <TableCell key={index}>
                      <Skeleton
                        className="h-5 w-full"
                        style={{ animationDelay: `${(index + index) * 0.1}s` }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : sortedCardsMemo.length > 0 ? (
            sortedCardsMemo.map((card, index) => {
              const [name, number] = (card.card_name || "").split(" - ");
              return (
                <TableRow key={index} onClick={() => handleRowClick(card.product_id)} className="cursor-pointer">
                  <TableCell>{name || "Unknown Card"}</TableCell>
                  <TableCell>{number || card.card_number || "N/A"}</TableCell>
                  <TableCell>{card.set_name || "N/A"}</TableCell>
                  <TableCell>{card.rarity || "N/A"}</TableCell>
                  <TableCell>${card.tcgplayer_price || "N/A"}</TableCell>
                  <TableCell>${card.psa_10_price || "N/A"}</TableCell>
                  <TableCell>${card.price_delta || "N/A"}</TableCell>
                  <TableCell>{card.profit_potential || "N/A"}%</TableCell>
                  <TableCell>{formatDate(card.last_updated)}</TableCell> {/* Add this line */}
                </TableRow>
              );
            })
          ) : (
            // Render message when no cards are found
            <TableRow>
              <TableCell colSpan={9} className="text-center text-destructive p-4"> {/* Update colspan to 9 */}
                No Cards Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}