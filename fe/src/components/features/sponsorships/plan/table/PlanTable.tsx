'use client'

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useTranslations } from "next-intl"
import VerifyChannelAlert from "./VerifyChannelAlert"
import { Heading } from "@/components/ui/elements/Heading"
import CreatePlanForm from "../form/CreatePlanForm"
import { FindMySponsorshipPlansQuery, useFindMySponsorshipPlansQuery, useRemoveSponsorshipPlanMutation } from "@/graphql/gennerated/output"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/utils/format-date"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/common/DropdownMenu"
import { Button } from "@/components/ui/common/Button"
import { Loader, MoreHorizontal, Trash2Icon } from "lucide-react"
import { Card } from "@/components/ui/common/Card"
import { DataTable } from "@/components/ui/elements/DataTable"
import { toast } from "sonner"

const PlanTable = () => {

    const t = useTranslations('dashboard.plans')

    const { user } = useCurrentUser()

    const { data, loading: isLoadingSponsor, refetch: refetchPlan } = useFindMySponsorshipPlansQuery()

    const plans = data?.findMySponsorshipPlans ?? []

    const plansColumns: ColumnDef<FindMySponsorshipPlansQuery['findMySponsorshipPlans'][0]>[] = [

        {
            accessorKey: 'createdAt',
            header: t('columns.date'),
            cell: ({ row }) => formatDate(row.original.createdAt, true)
        },
        {
            accessorKey: 'title',
            header: t('columns.title'),
            cell: ({ row }) => (

                <div className="flex items-center gap-x-2">

                    <h2 className="">{row.original.title}</h2>

                </div>

            )
        },
        {
            accessorKey: 'price',
            header: t('columns.price'),
            cell: ({ row }) => (

                <div className="flex items-center gap-x-2">

                    <h2 className="">{row.original.price}.00 $</h2>

                </div>

            )
        },
        {
            accessorKey: 'actions',
            header: t('columns.actions'),
            cell: ({ row }) => {


                const [remove, { loading: isLoadingRemove }] = useRemoveSponsorshipPlanMutation({

                    onCompleted() {

                        refetchPlan()
                        toast.success(t('columns.successMessage'))

                    },

                    onError() {

                        toast.error(t('columns.errorMessage'))

                    }

                })

                return (

                    <DropdownMenu>

                        <DropdownMenuTrigger asChild>

                            <Button variant='ghost' className="size-8 p-0">

                                <MoreHorizontal className="size-4" />

                            </Button>

                        </DropdownMenuTrigger>

                        <DropdownMenuContent>

                            <DropdownMenuItem
                                onClick={() => remove({ variables: { planId: row.original.id } })}
                                className="text-red-500 focus:text-red-500"
                                disabled={isLoadingRemove}
                            >

                                {t('columns.remove')}

                            </DropdownMenuItem>

                        </DropdownMenuContent>

                    </DropdownMenu>

                )
            }
        }
    ]

    return (

        <>

            {user?.isVerified ?
                (
                    <>

                        <div className="lg:px-10">

                            <div className="block items-center justify-between space-y-3 lg:flex lg:space-y-0">

                                <Heading
                                    title={t('header.heading')}
                                    description={t('header.description')}
                                    size='lg'
                                />

                                <CreatePlanForm refetchPlan={refetchPlan} />

                            </div>

                            <div className="mt-5">

                                {isLoadingSponsor ?
                                    (
                                        <>
                                            <PlanTableSkeleton />

                                        </>
                                    )
                                    :
                                    (
                                        <>

                                            <DataTable columns={plansColumns} data={plans} />

                                        </>
                                    )}
                            </div>

                        </div>

                    </>
                )
                :
                (
                    <>

                        <VerifyChannelAlert />

                    </>
                )
            }

        </>

    )

}

export default PlanTable

export const PlanTableSkeleton = () => {

    return <div className="max-w-screen-2xl mx-auto w-full mb-10" >

        <Card className="mt-6 flex h-[500px] w-full items-center justify-center">

            <Loader className="animate-spin size-8 text-muted-foreground" />

        </Card>

    </div>

}