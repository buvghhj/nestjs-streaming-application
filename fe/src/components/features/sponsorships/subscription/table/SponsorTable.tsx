'use client'

import { Button } from "@/components/ui/common/Button"
import { Card } from "@/components/ui/common/Card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/common/DropdownMenu"
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar"
import { ChannelVerified } from "@/components/ui/elements/ChannelVerified"
import { DataTable } from "@/components/ui/elements/DataTable"
import { Heading } from "@/components/ui/elements/Heading"
import { FindMySponsorsQuery, useFindMySponsorsQuery } from "@/graphql/gennerated/output"
import { formatDate } from "@/utils/format-date"
import { ColumnDef } from "@tanstack/react-table"
import { Loader, MoreHorizontal, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const SponsorTable = () => {

    const t = useTranslations('dashboard.sponsors')

    const { data, loading: isLoadingSponsor } = useFindMySponsorsQuery()

    const sponsors = data?.findMySponsors ?? []

    const sponsorsColumns: ColumnDef<FindMySponsorsQuery['findMySponsors'][0]>[] = [

        {
            accessorKey: 'expiresAt',
            header: t('columns.date'),
            cell: ({ row }) => formatDate(row.original.expiresAt, true)
        },
        {
            accessorKey: 'sponsor',
            header: t('columns.user'),
            cell: ({ row }) => (

                <div className="flex items-center gap-x-2">

                    <ChannelAvatar channel={row.original.user} size='sm' />

                    <h2 className="">{row.original.user.username}</h2>

                    {row.original.user.isVerified && <ChannelVerified size='sm' />}

                </div>

            )
        },

        {
            accessorKey: 'plan',
            header: t('columns.plan'),
            cell: ({ row }) => (

                <div className="flex items-center gap-x-2">

                    <h2 className="">{row.original.plan.title}</h2>

                </div>

            )
        },
        {
            accessorKey: 'actions',
            header: t('columns.actions'),
            cell: ({ row }) => (

                <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                        <Button variant='ghost' className="size-8 p-0">

                            <MoreHorizontal className="size-4" />

                        </Button>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent>

                        <Link href={`/${row.original.user.username}`} target="_blank">

                            <DropdownMenuItem>

                                <User className="mr-2 size-4" />

                                {t('columns.viewChannel')}

                            </DropdownMenuItem>

                        </Link>

                    </DropdownMenuContent>

                </DropdownMenu>

            )
        }
    ]

    return (

        <div className="lg:px-10">

            <Heading title={t('header.heading')} description={t('header.description')} size='lg' />

            <div className="mt-5">

                {isLoadingSponsor ?
                    (
                        <>
                            <SponsorTableSkeleton />

                        </>
                    )
                    :
                    (
                        <>

                            <DataTable columns={sponsorsColumns} data={sponsors} />

                        </>
                    )}

            </div>

        </div>

    )

}

export default SponsorTable

export const SponsorTableSkeleton = () => {

    return <div className="max-w-screen-2xl mx-auto w-full mb-10" >

        <Card className="mt-6 flex h-[500px] w-full items-center justify-center">

            <Loader className="animate-spin size-8 text-muted-foreground" />

        </Card>

    </div>

}