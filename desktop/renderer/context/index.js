import BusinessSettingsProvider from "./BusinessSettings";
import JobsProvider from "./Jobs";
import PrinterSettingsProvider from "./PrinterSettings";
import ServicesSettingsProvider from "./ServicesSettings";

export default function AllContexts({ children }) {
    return (
        <BusinessSettingsProvider>
            <PrinterSettingsProvider>
                <ServicesSettingsProvider>
                    <JobsProvider>
                    {children}
                    </JobsProvider>
                </ServicesSettingsProvider>
            </PrinterSettingsProvider>
        </BusinessSettingsProvider>
    )
}