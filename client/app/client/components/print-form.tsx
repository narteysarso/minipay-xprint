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
import { bindTypes, printTypes } from "../../../data/data"
import { usePrint } from "@/hooks/print-data-hook"
import { PrintersMap } from "./printers-map"

export const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).optional(),
    printType: z.string(),
    bindType: z.string(),
    file: z.string(),
    deliveryType: z.string().optional(),
    pickup: z.array().optional(),
    deliveryFee: z.number().optional()
})

export function PrintForm() {
    const { printFormData, setPrintFormData, formStep } = usePrint();
    const { file, ...printInfo } = printFormData;
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ...printInfo,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        alert('saving...');
        setPrintFormData(data);
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <div className="w-full">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} onChange={(event) => console.log(event.target.name)} className="w-full space-y-6">
                    {
                        formStep == 1 && (
                            <>
                                <CustomInput label="Name" name="name" placeholder="File name" control={form.control} inputType="text" />
                                <CustomInput label="Document" name="file" placeholder="Select document" control={form.control} file={file} inputType="file" accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation" />
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

                                {/* <Button type="submit">Next</Button> */}
                            </>
                        )
                    }

                    {
                        formStep == 2 && (
                            <PrintersMap />
                        )
                    }

                </form>
            </Form>
        </div>
    )
}
