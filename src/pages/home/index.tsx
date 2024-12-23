import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cardData } from "./card-data"

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
