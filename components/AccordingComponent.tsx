import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const AccordingComponent: React.FC<{ children: any, title: string }> = ({ children, title }) => {
    return (
        <div>
            <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger
                        className={`
                            w-full relative flex items-center py-2 px-3 my-0 
                            font-medium rounded-t-md cursor-pointer gap-3
                            hover:bg-[#073b3a46]
                            data-[state=open]:border-t-2 
                            data-[state=open]:border-b-0 
                            data-[state=open]:border-r-4 
                            data-[state=open]:border-l-2
                            data-[state=open]:border-[#073B3A]
                            data-[state=open]:bg-[#073b3a67]
                        `}
                    >
                        <span className='text-lg font-medium'>{title}</span>
                    </AccordionTrigger>
                    <AccordionContent
                        className="
                            px-3 py-2 text-base 
                            border-r-4 border-l-2 border-b-2 border-[#073B3A]
                            bg-[#073b3a67] 
                            rounded-b-md 
                            mt-[-2px]
                        "
                    >
                        {children}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default AccordingComponent
