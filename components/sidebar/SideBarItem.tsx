import Link from 'next/link'
import React from 'react'

interface SideBarItemsProps {
    icon: any,
    text: string,
    active: boolean,
    alert: boolean,
    link: string
}

const SideBarItems: React.FC<SideBarItemsProps> = ({
    active,
    alert,
    icon,
    text,
    link
}) => {
    return (
        <Link href={link} >
            <li
                className={`w-full relative flex items-center py-2 px-3 my-1.5 font-medium rounded-md cursor-pointer gap-3 ${active ? "border-t-2 border-b-2 border-r-4 border-r-[#073B3A] border-t-[#073B3A] border-b-[#3a4d4c] border-l-2 border-l-[#073B3A] bg-[#073b3a67] " : ""
                    }
                hover:bg-[#073b3a46]
                `
                }
            >
                {icon}
                <span className='text-lg  font-medium' >{text}</span>
            </li>
        </Link>
    )
}

export default SideBarItems
