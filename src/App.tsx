import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import AllCards from "./pages/all-cards"
import Sets from "./pages/sets"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/shared/sidebar/app-sidebar"
import { ThemeProvider } from "./components/shared/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
  return (
    <>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="vite-ui-theme"
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
            </header>
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
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
      <Toaster />
      <SpeedInsights /> {/* Add this line */}
    </>
  )
}

export default App