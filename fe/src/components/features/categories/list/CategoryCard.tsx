'use client'

import { FindRandomCategoriesQuery } from "@/graphql/gennerated/output"
import { useSidebar } from "@/hooks/useSidebar"
import { getRandomColor } from "@/utils/color"
import { cn } from "@/utils/tw-merge"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

interface CategoriesCardProps {
    category: FindRandomCategoriesQuery['findRandomCategories'][0]
}

const CategoryCard = ({ category }: CategoriesCardProps) => {

    const [randomColor, setRandomColor] = useState('')

    const { isCollapsed } = useSidebar()

    useEffect(() => {

        setRandomColor(getRandomColor())

    }, [])

    return (

        <Link href={`/categories/${category.slug}`} className="h-full w-full space-y-3">

            <div className={cn('group  relative cursor-pointer rounded-xl', isCollapsed ? 'h-60' : 'h-72')}>

                <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 transition-opacity group-hover:opacity-100" style={{
                    backgroundColor: randomColor
                }} />

                <Image src={category.thumbnailUrl} alt={category.title} fill className="rounded-lg object-cover transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2" />

            </div>

            <div>

                <h2 className="truncate text-base font-semibold text-foreground hover:text-primary">

                    {category.title}

                </h2>

            </div>

        </Link>

    )

}

export default CategoryCard