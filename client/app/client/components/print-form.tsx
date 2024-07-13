"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodString } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { toast } from "@/components/ui/use-toast"
import CustomInput from "./CustomInput"
import CustomSelect from "./CustomSelect"
import { bindTypes, DummyPrinters, printTypes } from "../../../data/data"
import { usePrint } from "@/hooks/print-data-hook"
import { PrintersMap } from "./printers-map"
import { getPDFPageCount } from "@/lib/utils"
import { PrintFormSchema } from "@/data/schema"


export function PrintForm() {
    const { printFormData, setPrintFormData, formStep, setForm, setSelectedPrinter } = usePrint();
    const { file, ...printInfo } = printFormData;

    const form = useForm<z.infer<typeof PrintFormSchema>>({
        resolver: zodResolver(PrintFormSchema),
        defaultValues: {
            ...printInfo,
        },
        values: {
            ...printInfo
        }
    })

    setForm(form);

    // function onSubmit(data: z.infer<typeof FormSchema>) {
    //     alert('saving...');
    //     // setPrintFormData(data);
    //     toast({
    //         title: "You submitted the following values:",
    //         description: (
    //             <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //                 <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //             </pre>
    //         ),
    //     })
    // }

    const handleOnChange = (event) => {
        console.log('trigger')
        if (event.target.name === "file") {
            const file = event.target.files[0];
            

            if (!file) {
                setPrintFormData({ [event.target.name]: file, pageCount: 0 });
                form.resetField(file, {

                });
                return;
            }

            getPDFPageCount(file).then(pageCount => {
                setPrintFormData({ [event.target.name]: file, pageCount });
            });

            return;
        }


        setPrintFormData({ [event.target.name]: event.target.value });
    }
    return (
        <div className="w-full">
            <Form {...form} >
                <form onChange={handleOnChange} className="w-full space-y-6">
                    {
                        formStep == 1 && (
                            <>
                                <CustomInput label="Name" name="name" placeholder="File name" control={form.control} inputType="text" />
                                {/* <CustomInput label="Document" name="file" placeholder="Select document" control={form.control} inputType="file" accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation" /> */}
                                <CustomInput label="Document" name="file" placeholder="Select document" control={form.control} inputType="file" accept="application/pdf" />
                                {/* <CustomInput name="name" placeholder="File name" control={form.control} inputType="text" /> */}
                                <CustomSelect label="Print Type" name="printType" placeholder="Select print type" control={form.control} selectInputs={printTypes} />
                                <CustomSelect label="Binding Type" name="bindType" placeholder="Select print type" control={form.control} selectInputs={bindTypes} />
                                <div className="flex gap-3 items-center w-full">
                                    <CustomInput label="Cost" name="cost" placeholder="Print cost" step={0.001} control={form.control} inputType="number" disabled />
                                    <Avatar className="">
                                        <AvatarImage src="https://s2.coinmarketcap.com/static/img/coins/64x64/7236.png" alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </div>
                            </>
                        )
                    }

                    {
                        formStep == 2 && (
                            <PrintersMap coordinates={DummyPrinters} onSelect={(v) => { setSelectedPrinter(v) }} />
                        )
                    }

                </form>
            </Form>
        </div>
    )
}
