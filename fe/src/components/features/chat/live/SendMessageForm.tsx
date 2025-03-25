'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/common/Form"
import { Textarea } from "@/components/ui/common/Textarea"
import EmojiPicker from "@/components/ui/elements/EmojiPicker"
import { FindChannelByUsernameQuery, useSendChatMessageMutation } from "@/graphql/gennerated/output"
import { sendChatMessageSchema, TypeSendChatMessageSchema } from "@/schemas/chat/send-chat-message.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizonal } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SendMessageFormProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
    isDisabled: boolean
}

const SendMessageForm = ({ channel, isDisabled }: SendMessageFormProps) => {

    const t = useTranslations('stream.chat.sendMessage')

    const form = useForm<TypeSendChatMessageSchema>({

        resolver: zodResolver(sendChatMessageSchema),

        defaultValues: {

            text: ''

        }

    })

    const [sendMessage, { loading: isLoadingSendMessage }] = useSendChatMessageMutation({

        onCompleted() {

            form.reset()

        },

        onError() {

            toast.error(t('sendMessage.errorMessage'))

        }

    })

    const { isValid } = form.formState

    const onSendMessage = (data: TypeSendChatMessageSchema) => {

        sendMessage({

            variables: {

                data: {

                    streamId: channel.stream.id!,
                    text: data.text

                }

            }

        })

    }

    return (

        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSendMessage)} className="mt-3 flex items-center gap-x-4">

                <FormField
                    control={form.control}
                    name='text'
                    render={({ field }) => (

                        <FormItem className="w-full">

                            <FormControl>

                                <div className="relative">

                                    <Textarea
                                        placeholder={t('placeholder')}
                                        {...field}
                                        rows={1}
                                        onInput={e => {

                                            e.currentTarget.style.height = 'auto'
                                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`

                                        }}
                                        onKeyDown={e => {

                                            if (e.key === 'Enter' && !e.shiftKey) {

                                                e.preventDefault()

                                                form.handleSubmit(onSendMessage)()

                                            }

                                        }}
                                        disabled={isDisabled || isLoadingSendMessage}
                                        className="min-h-[40px] resize-none pr-8"
                                    />

                                    <div className="absolute right-2 top-2 cursor-pointer">

                                        <EmojiPicker
                                            onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                            isDisabled={isDisabled || isLoadingSendMessage}
                                        />

                                    </div>

                                </div>

                            </FormControl>

                        </FormItem>

                    )}
                />

                <Button className="size-10 rounded-full" type="submit" disabled={isDisabled || !isValid || isLoadingSendMessage} >

                    <SendHorizonal className="size-3" />

                </Button>

            </form>

        </Form>

    )

}

export default SendMessageForm