import { createContext, useEffect, useState } from "react";

export const PrinterSettingContext = createContext({
    printer: "",
    colorSchemes: [],
    sheetSizes: [],
});


export default function PrinterSettingsProvider({ children }) {

    const [printer, setPrinter] = useState();
    const [colorSchemes, setColorSchemes] = useState([]);
    const [sheetSizes, setSheetSizes] = useState([]);

    const savePrinter = (printer = "") => {
        setPrinter(prev => printer, localStorage.setItem("printer", printer));
    }

    const saveColorSchemes = (schemes = []) => {
        setColorSchemes(prev => schemes, localStorage.setItem("colorSchemes", JSON.stringify(schemes)));
    }

    const saveSheetSizes = (sizes = []) => {
        setSheetSizes(prev => sizes, localStorage.setItem("sheetSizes", JSON.stringify(sizes)))
    }

    useEffect(()=>{
        setPrinter(prev => localStorage.getItem("printer"));
        setColorSchemes(prev => JSON.parse(localStorage.getItem("colorSchemes") || "[]") );
        setSheetSizes(prev => JSON.parse(localStorage.getItem("sheetSizes") || "[]") );
    },[]);

    return (
        <PrinterSettingContext.Provider value={{
            printer,
            sheetSizes,
            colorSchemes,
            savePrinter,
            saveSheetSizes,
            saveColorSchemes
        }}
        >
            {children}
        </PrinterSettingContext.Provider>
    )
}


