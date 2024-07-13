'use client'

import { Print, Printer, printSchema } from '@/data/schema';
import { createContext, ReactElement, useContext, useState } from 'react'
import { useStorageUpload } from "@thirdweb-dev/react";
import { getPDFPageCount } from '@/lib/utils';
import { bindTypes, printTypes } from '@/data/data';
import { formatUnits, parseUnits } from 'viem';

const PrintContext = createContext({});

export function usePrint() {
    const [printFormLoading, setPrintFormLoading] = useState(false)
    const printContext = useContext(PrintContext);
    const { mutateAsync: upload } = useStorageUpload();

    const uploadFileToIpfs = async (file: File) => {
        const uploadUrl = await upload({
            data: [file],
            options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
        });
        return uploadUrl;
    };

    const uploadPrintMetaData = async (metaData: string, filename: string) => {
        const uploadUrl = await upload({
            data: [new File([metaData], filename)],
            options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
        });
        return uploadUrl;
    }


    const handlePrintSubmit = async () => {
        
        try {
            setPrintFormLoading(true);
            const alldata: Print = { ...printContext.printFormData, printer: printContext.selectedPrinter };
            console.log('all data', alldata);

            const fileUri = (await uploadFileToIpfs(alldata.file))[0];
            console.log('fileuri', fileUri)
            const metadata = {
                name: alldata?.name,
                description: 'An Xprint service job',
                attributes: [
                    {
                        name: 'print-type',
                        value: alldata?.printType
                    },
                    {
                        name: 'bind-type',
                        value: alldata?.bindType
                    },
                    {
                        name: 'file-uri',
                        value: fileUri
                    },
                    {
                        name: 'cost',
                        value: alldata?.cost
                    },
                    {
                        name: 'token',
                        value: process.env.NEXT_PUBLIC_CUSD_STABLE_TOKEN_ADDRESS
                    },

                    {
                        name: 'print-service',
                        value: alldata.printer.hash
                    }


                ]
            }
            const metaDataUri = await uploadPrintMetaData(JSON.stringify(metadata), `${Date.now()}_${name}`);

            console.log('metadata', metaDataUri);

            //TODO: send payment to smart contract wallet

            return {

            }
        } catch (error) {

        } finally {
            setPrintFormLoading(false);
        }

    }

    return ({
        handlePrintSubmit,
        printFormLoading,
        ...printContext
    });

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

    const [selectedPrinter, _setSelectedPrinter] = useState(null);
    const [printData, _setPrintData] = useState([]);
    const [formStep, setFormStep] = useState(1);
    const [form, setForm] = useState(null);

    const setPrintFormData = (newFieldData: {}) => {
        //TODO: validate data;
        // console.log('new print data',newFieldData);

        _setPrintFormData(prev => {
            const newData = { ...prev, ...newFieldData }
            const cost = calculatePrintCost({ pageCount: BigInt(newData.pageCount || 0), printType: newData.printType, bindType: newData.bindType }).toString();
            return { ...newData, cost };
        });
    }

    const setSelectedPrinter = (data: Printer) => {
        _setSelectedPrinter(data)
    }

    const fetchPrintData = (address: `0x${string}`) => {

        //TODO: fetch print data of an address from DB
        _setPrintData([]);
    }

    const calculatePrintCost = ({ pageCount, bindType, printType }: { pageCount: bigint, bindType: string, printType: string }) => {
        const stapleCost = parseUnits(Object.values(bindTypes).find((t) => t.value == bindType)?.price || '0', 6);
        const printCost = parseUnits(Object.values(printTypes).find((t) => t.value == printType)?.price || '0', 6);
        console.log({ pageCount, stapleCost, printCost, printType })

        return formatUnits((pageCount * printCost) + stapleCost, 6);
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
            form,
            selectedPrinter,
            setForm,
            formNextStep,
            formPrevStep,
            setPrintFormData,
            fetchPrintData,
            setSelectedPrinter,
            calculatePrintCost
        }}>
            {children}
        </PrintContext.Provider>
    )
}

