import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { PrintFormSchema } from '@/data/schema'

interface CustomSelect {
    control: Control<z.infer<typeof PrintFormSchema>>,
    label: string,
    name: FieldPath<z.infer<typeof PrintFormSchema>>,
    selectInputs: Array<{ value: string, label: string }>,
    placeholder: string,
    className?: string
}


function CustomSelect({ control, label, name, placeholder, className = "", selectInputs }: CustomSelect) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className='form-item'>
                    <FormLabel className='form-label'>
                        {label}
                    </FormLabel>
                    <div className='flex flex-col w-full'>
                        <FormControl>
                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className={cn(className)}>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectInputs?.map(({ value, label }, idx) => (
                                        <SelectItem key={idx} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage className='form-message mt-2' />
                    </div>
                </div>
            )}
        />
    )
}

export default CustomSelect