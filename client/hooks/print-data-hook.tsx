'use client'

import { Print, Printer, printSchema } from '@/data/schema';
import { createContext, ReactElement, useContext, useEffect, useState } from 'react'
import { useStorageUpload } from "@thirdweb-dev/react";
import { approvecUSD, getHash, getPDFPageCount, getPrinterLogs, getPrintLogs, getPrintStatus, issuePrintMinipay } from '@/lib/utils';
import { bindTypes, jobStatuses, printTypes, statuses } from '@/data/data';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { abi as xprintAbi, address as xprintAddress } from "../data/xprint-abi";
import { abi as tokenAbi, address as tokenAddress } from "../data/token-abi";
import { useStorage } from "@thirdweb-dev/react";
import { access } from 'fs';
import { useMiniPay } from './minipay-provider';

const PrintContext = createContext({});

export function usePrint() {
    const [printFormLoading, setPrintFormLoading] = useState(false)
    const printContext = useContext(PrintContext);
    const { mutateAsync: upload } = useStorageUpload();
    const { writeContractAsync, context } = useWriteContract();
    const { address } = useAccount();
    const { address: miniPayAddress } = useMiniPay();

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


            const fileUri = (await uploadFileToIpfs(alldata.file))[0];

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

            const ipfsURI = metaDataUri[0].split('ipfs/')[1];
            const ipfsCID = ipfsURI.substring(0, ipfsURI.length - 1);
            // const hash = getHash(ipfsCID);

            const amount = parseUnits(alldata?.cost as string, process.env.NEXT_PUBLIC_TOKEN_DECIMALS).toString();

            // console.log('metadata', {
            //     ipfsCID,
            //     // hash,
            //     printerHash: alldata.printer.hash,  //getHash("bafybeievnpzdcvmw63bg6hlfzknxuufiasbbgye3s7sjyudmjtzrrr3xci"),
            //     amount,
            // });

            if (window && window.ethereum) {
                // User has a injected wallet

                if (window.ethereum.isMiniPay) {
                    const txn = await approvecUSD({
                        senderAddress: miniPayAddress,
                        tokenAddress: tokenAddress,
                        receiverAddress: xprintAddress,
                        transferValue: amount,
                        tokenDecimals: process.env.NEXT_PUBLIC_TOKEN_DECIMALS
                    });
                    alert(txn);
                    const printTxn = await issuePrintMinipay({
                        owner: miniPayAddress,
                        printerHash: alldata?.printer?.hash,
                        amount,
                        cid:ipfsCID 
                    })
                    alert(printTxn)
                }

            } else {

                const txn = await writeContractAsync({
                    abi: tokenAbi,
                    address: tokenAddress,
                    functionName: 'approve',
                    args: [
                        xprintAddress,
                        amount
                    ],

                }, {
                    onSuccess(data, variables, context) {
                        writeContractAsync({
                            abi: xprintAbi,
                            address: xprintAddress,
                            functionName: 'issuePrint',
                            args: [
                                alldata.printer.hash,
                                address,
                                amount,
                                ipfsCID,
                            ],
                        }, {
                            onSuccess(data, variables, context) {
                                console.log(data);
                            },
                        })


                    },
                });
            }
        } catch (error) {
            console.log(error);
            alert(error.message)
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
    const [printers, setPrinters] = useState([]);
    const [prints, setPrints] = useState([]);
    const [printData, _setPrintData] = useState([]);
    const [formStep, setFormStep] = useState(1);
    const [form, setForm] = useState(null);
    const storage = useStorage();
    const { address } = useAccount();
    const { address: miniPayAddress } = useMiniPay();


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

    useEffect(() => {
        (async () => {
            // alert(miniPayAddress, address);
            if (!miniPayAddress && !address) return;
            try {
                const [printerlogs, printLogs] = await Promise.all([getPrinterLogs(), getPrintLogs(miniPayAddress || address)])

                const [printers, prints] = await Promise.all(
                    [
                        Promise.all(printerlogs.map(async (printer) => {
                            if (!printer?.cid) return null;
                            const dt = await storage?.downloadJSON(`ipfs://${printer?.cid}`)
                            if (dt.error) return null;
                            const { company: name, location } = dt.attributes?.reduce((acc, cur, next) => ({ ...acc, [cur.trait]: cur.value }), {})

                            return { name, longitude: parseFloat(location?.longitude), latitude: parseFloat(location?.latitude), hash: printer?.printerHash };
                        })),

                        Promise.all(printLogs.map(async (print) => {
                            if (!print?.docHash || !print?.printHash) return null;
                            const [dt, statusIdx] = await Promise.all([storage?.downloadJSON(`ipfs://${print?.docHash}`), getPrintStatus(print?.printHash)]);
                            const { cost, token } = dt.attributes?.reduce((acc, cur, arr) => ({ ...acc, [cur.name]: cur.value }), {});
                            return { id: print.printHash, title: dt.name, cost, token, label: 'document', status: jobStatuses[statusIdx] }
                        }))

                    ]

                )

                setPrinters(printers.filter((printer) => printer));
                setPrints(prints.filter((print) => print));
            } catch (error) {
                console.log(error)
            } finally {

            }

        })()
    }, [miniPayAddress, address])

    return (
        <PrintContext.Provider value={{
            printFormData,
            printData,
            formStep,
            form,
            selectedPrinter,
            printers,
            prints,
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

