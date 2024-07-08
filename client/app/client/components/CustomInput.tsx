import React, { useRef } from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import {FormSchema} from "./print-form";
import { cn } from '@/lib/utils'

interface CustomInput { 
    control: Control<z.infer<typeof FormSchema>>, 
    label: string, 
    name: FieldPath<z.infer<typeof FormSchema>>, 
    placeholder: string, 
    inputType?: string,
    className?: string
}


function CustomInput({ control, label, name, placeholder, className = "", inputType = "text", ...rest }: CustomInput) {

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className='form-item grow'>
                    <FormLabel className='form-label'>
                        {label}
                    </FormLabel>
                    <div className='flex flex-col w-full'>
                        <FormControl>
                            <Input
                                placeholder={placeholder}
                                className={cn(className, 'input-class')}
                                {...field}
                                {...rest}
                                type={inputType}
                            />
                        </FormControl>
                        <FormMessage className='form-message mt-2' />
                    </div>
                </div>
            )}
        />
    )
}

export default CustomInput