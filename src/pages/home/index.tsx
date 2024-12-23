import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const cardData = [
	{
		title: "English",
		sets: [
			"SV08: Surging Sparks",
			"SV07: Stellar Crown",
			"SV06: Twilight Masquerade",
			"SV05: Temporal Forces",
			"SV04: Paradox Rift",
			"SV03: Obsidian Flames",
			"SV: Shrouded Fable",
			"SV: Scarlet & Violet 151",
			"SV: Paldean Fates",
		],
	},
	{
		title: "Japanese",
		sets: [
			"SV7A: Paradise Dragona",
			"SV7: Stellar Miracle",
			"SV6A: Night Wanderer",
			"SV6: Transformation Mask",
			"SV5M: Cyber Judge",
			"SV5K: Wild Force",
			"SV5A: Crimson Haze",
			"SV-P Promotional Cards",
			"SV: Ancient Koraidon ex Starter Deck & Build Set",
		],
	},
]

const Home: React.FC = () => {
	return (
		<section
			aria-label="Home Section"
			className="min-h-screen"
		>
			<div className="max-w-2xl mx-auto py-5">
				<h1 className="text-5xl font-bold text-center my-12">Pokemon Card Sets</h1>
				<div className="flex justify-between">
					{cardData.map((card, index) => (
						<React.Fragment key={index}>
							<Card className="max-w-80 w-full">
								<CardHeader className="border-b">
									<CardTitle>{card.title}</CardTitle>
								</CardHeader>
								<CardContent className="pt-4">
									{card.sets.map((set) => (
										<p key={set}>
											<Link
												to={`/sets/?set=${set.replace(/[^a-zA-Z0-9]/g, "_")}&language=${
													card.title
												}`}
											>
												{set}
											</Link>
										</p>
									))}
								</CardContent>
							</Card>
						</React.Fragment>
					))}
				</div>
			</div>
		</section>
	)
}

export default Home
