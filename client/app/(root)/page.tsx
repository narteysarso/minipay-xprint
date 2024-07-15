import { PrintProvider } from "@/hooks/print-data-hook"
import Dashboard from "./dashboard"

export default function Page() {
  return (
    <PrintProvider>
      <Dashboard />
    </PrintProvider>
  )
}