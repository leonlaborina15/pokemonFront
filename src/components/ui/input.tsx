import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, value, onChange, ...props }, ref) => {
		const [inputValue, setInputValue] = React.useState(value || "")
		const inputRef = React.useRef<HTMLInputElement>(null)

		const handleClearInput = () => {
			setInputValue("")
			if (inputRef.current) {
				inputRef.current.focus()
			}
			if (onChange) {
				const event = new Event("input", { bubbles: true })
				Object.defineProperty(event, "target", { writable: false, value: inputRef.current })
				onChange(event as unknown as React.ChangeEvent<HTMLInputElement>)
			}
		}

		React.useEffect(() => {
			setInputValue(value || "")
		}, [value])

		return (
			<div className="relative">
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						className,
						"pe-9"
					)}
					ref={(node) => {
						;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
						if (typeof ref === "function") ref(node)
						else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
					}}
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value)
						if (onChange) onChange(e)
					}}
					{...props}
				/>
				{inputValue && (
					<button
						className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Clear input"
						onClick={handleClearInput}
					>

					</button>
				)}
			</div>
		)
	}
)
Input.displayName = "Input"

export { Input }
