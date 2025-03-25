'use client'

import { Card } from '@/components/ui/common/Card'
import { DataTable } from '@/components/ui/elements/DataTable'
import { Heading } from '@/components/ui/elements/Heading'
import { FindMyTransactionsQuery, TransactionStatus, useFindMyTransactionsQuery } from '@/graphql/gennerated/output'
import { formatDate } from '@/utils/format-date'
import { ColumnDef } from '@tanstack/react-table'
import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

const TransactionsTable = () => {

    const t = useTranslations('dashboard.transactions')

    const { data, loading: isLoadingTransactions } = useFindMyTransactionsQuery()

    const transactions = data?.findMyTransactions ?? []

    const transactionsColumns: ColumnDef<FindMyTransactionsQuery['findMyTransactions'][0]>[] = [

        {
            accessorKey: 'createdAt',
            header: t('columns.date'),
            cell: ({ row }) => formatDate(row.original.createdAt, true)
        },
        {
            accessorKey: 'status',
            header: t('columns.status'),
            cell: ({ row }) => {

                const status = row.original.status

                let statusColor = ''

                switch (status) {

                    case TransactionStatus.Success:
                        statusColor = 'text-green-500'
                        return (

                            <div className={`py-1.5 ${statusColor}`}>{t('columns.success')}</div>
                        )
                    case TransactionStatus.Pending:
                        statusColor = 'text-yellow-500'
                        return (

                            <div className={`py-1.5 ${statusColor}`}>{t('columns.pending')}</div>
                        )
                    case TransactionStatus.Failed:
                        statusColor = 'text-red-600'
                        return (

                            <div className={`py-1.5 ${statusColor}`}>{t('columns.failed')}</div>
                        )
                    case TransactionStatus.Expried:
                        statusColor = 'text-purple-500'
                        return (

                            <div className={`py-1.5 ${statusColor}`}>{t('columns.expried')}</div>
                        )
                    default:
                        statusColor = 'text-foreground'
                        return (
                            <div className={`py-1.5 ${statusColor}`}>{status}</div>
                        )
                }

            }
        },
        {
            accessorKey: 'amount',
            header: t('columns.amount'),
            cell: ({ row }) => (

                <div className="flex items-center gap-x-2">

                    <h2 className="">{row.original.amount}.00 $</h2>

                </div>

            )
        },

    ]

    return (

        <div className="lg:px-10">

            <Heading title={t('header.heading')} description={t('header.description')} size='lg' />

            <div className="mt-5">

                {isLoadingTransactions ?
                    (
                        <>
                            <SponsorTableSkeleton />

                        </>
                    )
                    :
                    (
                        <>

                            <DataTable columns={transactionsColumns} data={transactions} />

                        </>
                    )}

            </div>

        </div>


    )

}

export default TransactionsTable

export const SponsorTableSkeleton = () => {

    return <div className="max-w-screen-2xl mx-auto w-full mb-10" >

        <Card className="mt-6 flex h-[500px] w-full items-center justify-center">

            <Loader className="animate-spin size-8 text-muted-foreground" />

        </Card>

    </div>

}