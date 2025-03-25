'use client'

import { EmptyState } from "@/components/ui/elements/EmptyState"
import { Heading } from "@/components/ui/elements/Heading"
import { FindCategoryBySlugQuery } from "@/graphql/gennerated/output"
import { useTranslations } from "next-intl"
import Head from "next/head"
import Image from "next/image"
import StreamList from "../../stream/list/StreamList"

interface CategoryOverview {
    category: FindCategoryBySlugQuery['findCategoryBySlug']
}

const CategoryOverview = ({ category }: CategoryOverview) => {

    const t = useTranslations('categories.overview')

    return (

        <>

            {category.streams.length ?
                (
                    <>


                        <div className="space-y-8">

                            <div className="lg:flex lg:items-center lg:gap-x-6">

                                <div className="relative w-[192px] h-[256px] flex-shrink-0">

                                    <Image
                                        src={category.thumbnailUrl}
                                        alt={category.title}
                                        fill
                                        className="rounded-xl object-cover"
                                    />

                                </div>

                                <div className="flex-1 ">

                                    <Heading
                                        title={category.title}
                                        description={category.description ?? ''}
                                        size="xl"
                                    />

                                </div>

                            </div>

                            <StreamList heading={t('heading')} streams={category.streams} />

                        </div>

                    </>
                )
                :
                (
                    <>

                        <EmptyState />

                    </>
                )}

        </>
    )

}

export default CategoryOverview