import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cardData } from "./card-data"
import { ChevronRight } from "lucide-react"

const Home: React.FC = () => {
	return (
		<section
			aria-label="Home Section"
			className="min-h-[calc(100vh-64px)]"
		>
			<div>
				<h1 className="text-center">Pokemon Card Sets</h1>
				<div className="flex flex-col lg:flex-row gap-6 justify-between items-center lg:items-start max-w-3xl mx-auto p-6">
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
												className="group inline-flex items-center gap-1 transition-colors"
											>
												{set}
												<ChevronRight className="h-4 w-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
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
