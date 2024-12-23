import "./App.css"
import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/home"
import AllCards from "./pages/all-cards"
import Sets from "./pages/sets"

function App() {
	return (
		<>
			<nav className="flex justify-center space-x-4">
				<Link
					to="/"
					className="text-blue-500 underline"
				>
					Home
				</Link>
				<Link
					to="/all-cards"
					className="text-blue-500 underline"
				>
					All Cards
				</Link>
			</nav>
			<Routes>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/all-cards"
					element={<AllCards />}
				/>
				<Route
					path="/sets"
					element={<Sets />}
				/>
			</Routes>
		</>
	)
}

export default App
