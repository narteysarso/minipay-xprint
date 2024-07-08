'use client'

import { Print } from '@/data/schema';
import { createContext, ReactElement, useContext, useState } from 'react'

const PrintContext = createContext({});


export function usePrint() {

    const { formStep,
        formNextStep,
        formPrevStep,printFormData,
        printData,
        setPrintFormData,
        fetchPrintData,
        setSelectedPrinter,
        calculatePrintCost,
        handlePrintJobSubmit } = useContext(PrintContext);


    return ({
        formStep,
        formNextStep,
        formPrevStep,
        printFormData,
        printData,
        setPrintFormData,
        fetchPrintData,
        setSelectedPrinter,
        calculatePrintCost,
        handlePrintJobSubmit
    })

}

export function PrintProvider({ children }: { children: ReactElement }) {
    const FORM_STEPS_MAX = 2;
    const [printFormData, _setPrintFormData] = useState<Print>({
        name: "",
        printType: "monochrome",
        bindType: "staple",
        file: "",
        cost: '0.00',
        pageCount: 0,
    });

    const [selectedPrinter, _setSelectedPrinter] = useState({});
    const [printData, _setPrintData] = useState([]);
    const [formStep, setFormStep] = useState(1);

    const setPrintFormData = (data: Print) => {
        //TODO: validate data;
        console.log('new print data', data)
        _setPrintFormData(prev => data)
    }

    const setSelectedPrinter = (data: Print) => {
        //TODO: validate data;
        _setSelectedPrinter(data)
    }

    const fetchPrintData = (address: `0x${string}`) => {

        //TODO: fetch print data of an address from DB
        _setPrintData([]);
    }

    const calculatePrintCost = ({ pageCount, stapleType, printType }) => {
        //TODO: 
        // 1. fetch printType cost
        // 2. fetch stapleType cost

        //TODO: return pageCount * printType cost + stableType cost
    }

    const handlePrintJobSubmit = () => {
        // TODO: 
        // 1. send print data to ipfs and return hash
        // 2. approve payment for printing cost
        // 3. send hash to smart contract and txn hash
        // 
    }

    const formNextStep = () => {
        setFormStep(prev => prev == FORM_STEPS_MAX ? FORM_STEPS_MAX : ++prev)
    }

    const formPrevStep = () => {
        setFormStep(prev => prev == 1 ? prev : --prev)
    }

    return (
        <PrintContext.Provider value={{
            printFormData,
            printData,
            formStep,
            formNextStep,
            formPrevStep,
            setPrintFormData,
            fetchPrintData,
            setSelectedPrinter,
            calculatePrintCost,
            handlePrintJobSubmit
        }}>
            {children}
        </PrintContext.Provider>
    )
}

