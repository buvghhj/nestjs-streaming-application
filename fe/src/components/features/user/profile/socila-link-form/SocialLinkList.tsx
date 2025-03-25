'use client'

import { useFindSocialLinkQuery, useReorderSocialLinkMutation } from "@/graphql/gennerated/output"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { Separator } from "@/components/ui/common/Separator"
import SocialLinkItem from "./SocialLinkItem"
import { toast } from "sonner"

const SocialLinkList = () => {

    const t = useTranslations('dashboard.settings.profile.socialLinks')

    const { data, refetch } = useFindSocialLinkQuery()

    const items = data?.findSocialLink ?? []

    const [socialLinks, setSocialLinks] = useState(items)

    useEffect(() => {

        setSocialLinks(items)

    }, [items])

    const [reorder, { loading: isLoadingReorder }] = useReorderSocialLinkMutation({

        onCompleted() {

            refetch()

            window.location.reload()

            toast.success(t('successReorderMessage'))

        },

        onError() {

            toast.error(t('errorReorderMessage'))


        }

    })

    const onDragEnd = (result: DropResult) => {

        if (!result.destination) {

            return

        }

        const items = Array.from(socialLinks)

        const [reorderItem] = items.splice(result.source.index, 1)

        items.splice(result.destination.index, 0, reorderItem)

        const bulkUpdateData = items.map((socialLink, i) => ({

            id: socialLink.id,
            position: i

        }))

        setSocialLinks(items)

        reorder({

            variables: {

                list: bulkUpdateData

            }

        })

    }

    return (

        <>

            {socialLinks.length ?

                (
                    <>

                        <Separator />

                        <div className="px-5 mt-5">

                            <DragDropContext onDragEnd={onDragEnd}>

                                <Droppable droppableId="socialLinks">

                                    {provided => (

                                        <div {...provided.droppableProps} ref={provided.innerRef}>

                                            {socialLinks.map((socialLink, index) => (

                                                <Draggable key={index} draggableId={socialLink.id} index={index} isDragDisabled={isLoadingReorder}>

                                                    {provided => (

                                                        <SocialLinkItem socialLink={socialLink} key={index} provided={provided} />

                                                    )}

                                                </Draggable>

                                            ))}

                                            {provided.placeholder}

                                        </div>

                                    )}

                                </Droppable>

                            </DragDropContext>

                        </div>

                    </>
                )
                :
                null
            }

        </>

    )

}

export default SocialLinkList