"use client"

import { useState, useMemo } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

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

type SortColumn = keyof Card

export default function CardTable({
	sortedCards,
	loading,
}: {
	sortedCards?: Card[]
	loading: boolean
}) {
	const [sortColumn, setSortColumn] = useState<SortColumn>("card_name")
	const [sortDirection, setSortDirection] = useState("asc")

	const sortedCardsMemo = useMemo(() => {
		return [...(sortedCards || [])].sort((a, b) => {
			if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
			if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
			return 0
		})
	}, [sortedCards, sortColumn, sortDirection])

	const handleSort = (column: SortColumn) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc")
		} else {
			setSortColumn(column)
			setSortDirection("asc")
		}
	}

	return (
		<>
			{loading ? (
				<Table className="table">
					<TableBody>
						{[1, 2, 3].map((_, index) => (
							<TableRow key={index}>
								{Array.from({ length: 8 }).map((_, cellIndex) => (
									<TableCell key={cellIndex}>
										<Skeleton className="h-5 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="max-w-5xl mx-auto">
					{sortedCardsMemo.length > 0 ? (
						<Table className="table">
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
										Card Number{" "}
										{sortColumn === "card_number" && (sortDirection === "asc" ? "↑" : "↓")}
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
										PSA 10 Price{" "}
										{sortColumn === "psa_10_price" && (sortDirection === "asc" ? "↑" : "↓")}
									</TableHead>
									<TableHead
										className="cursor-pointer select-none"
										onClick={() => handleSort("price_delta")}
									>
										Price Delta{" "}
										{sortColumn === "price_delta" && (sortDirection === "asc" ? "↑" : "↓")}
									</TableHead>
									<TableHead
										className="cursor-pointer select-none"
										onClick={() => handleSort("profit_potential")}
									>
										Profit Potential{" "}
										{sortColumn === "profit_potential" && (sortDirection === "asc" ? "↑" : "↓")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedCardsMemo.map((card, index) => {
									const [name, number] = (card.card_name || "").split(" - ")
									return (
										<TableRow key={index}>
											<TableCell>{name || "Unknown Card"}</TableCell>
											<TableCell>{number || card.card_number || "N/A"}</TableCell>
											<TableCell>{card.set_name || "N/A"}</TableCell>
											<TableCell>{card.rarity || "N/A"}</TableCell>
											<TableCell>${card.tcgplayer_price || "N/A"}</TableCell>
											<TableCell>${card.psa_10_price || "N/A"}</TableCell>
											<TableCell>${card.price_delta || "N/A"}</TableCell>
											<TableCell>{card.profit_potential || "N/A"}%</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					) : (
						<p className="text-center">No cards found</p>
					)}
				</div>
			)}
		</>
	)
}
