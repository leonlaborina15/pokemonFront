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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type Card = {
  card_name: string;
  card_number: string;
  set_name: string;
  rarity: string;
  tcgplayer_price: string;
  psa_10_price: string;
  price_delta: string;
  profit_potential: string;
  last_updated: string;
  product_id: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const parseValue = (value: string, column: SortColumn) => {
    if (
      column === "tcgplayer_price" ||
      column === "psa_10_price" ||
      column === "price_delta" ||
      column === "profit_potential"
    ) {
      return parseFloat(value.replace(/[^0-9.-]+/g, ""));
    }
    return value;
  };

  const sortedCardsMemo = useMemo(() => {
    return [...(sortedCards || [])].sort((a, b) => {
      const aValue = parseValue(a[sortColumn], sortColumn);
      const bValue = parseValue(b[sortColumn], sortColumn);

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortedCards, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

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

  const handleRowClick = (product_id: string) => {
    const url = `https://www.tcgplayer.com/product/${product_id}/pokemon-sv08-surging-sparks-night-stretcher-251-191?page=1&Language=all`;
    window.open(url, "_blank");
  };

  const paginatedCards = sortedCardsMemo.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil((sortedCards || []).length / itemsPerPage);

  return (
    <div className="mx-auto w-[calc(100dvw-1rem)] md:w-full overflow-x-auto px-4 pb-20">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
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
              onClick={() => handleSort("last_updated")}
            >
              Last Pull {sortColumn === "last_updated" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 9 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton
                      className="h-5 w-full"
                      style={{ animationDelay: `${(index + cellIndex) * 0.1}s` }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedCards.length > 0 ? (
            paginatedCards.map((card, index) => {
              const [name, number] = (card.card_name || "").split(" - ");
              return (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(card.product_id)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell>{name || "Unknown Card"}</TableCell>
                  <TableCell>{number || card.card_number || "N/A"}</TableCell>
                  <TableCell>{card.set_name || "N/A"}</TableCell>
                  <TableCell>{card.rarity || "N/A"}</TableCell>
                  <TableCell>${card.tcgplayer_price || "N/A"}</TableCell>
                  <TableCell>${card.psa_10_price || "N/A"}</TableCell>
                  <TableCell>${card.price_delta || "N/A"}</TableCell>
                  <TableCell>{card.profit_potential || "N/A"}%</TableCell>
                  <TableCell>{formatDate(card.last_updated)}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-destructive p-4">
                No Cards Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              className={currentPage === 1 ? "disabled" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
              className={currentPage === totalPages ? "disabled" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}