import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    base: './', // Add this line
    build: {     // Add these build settings
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true
    }
})