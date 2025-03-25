import { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import * as  React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'


interface ResetPasswordTemplateProps {
    domain: string
    token: string
    metadata: SessionMetadata
}

export function ResetPasswordTemplate({ domain, token, metadata }: ResetPasswordTemplateProps) {

    const resetLink = `${domain}/account/recovery/${token}`

    return (

        <Html>

            <Head />

            <Preview>Đặt lại mật khẩu</Preview>

            <Tailwind>

                <Body className='max-w-2xl mx-auto p-6  bg-slate-50'>

                    <Section className='text-center mb-8'>

                        <Heading className='text-3xl text-black form-bold'>

                            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình trên <b>TanStream</b>

                        </Heading>

                        <Text className='text-base text-black mt-2'>
                            Để tạo mật khẩu mới vui lòng nhấp theo liên kết này:
                        </Text>

                        <Link href={resetLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>

                            Đặt lại mật khẩu

                        </Link>

                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6  mb-6'>

                        <Heading className='text-xl font-semibold text-[#18B9AE]'>

                            Thông tin khác:

                        </Heading>

                        <ul className='list-disc list-inside mt-2'>

                            <li>🌍 Địa chỉ: {metadata.location.country}, {metadata.location.city}</li>
                            <li>📱 Hệ điều hành: {metadata.device.os}</li>
                            <li>🔍 Trình duyệt: {metadata.device.browser}</li>
                            <li>🖥️ IP: {metadata.ip}</li>

                        </ul>

                        <Text className='text-gray-600 mt-2'>
                            Nếu bạn đổi ý, chỉ cần bỏ qua tin nhắn này!
                        </Text>

                    </Section>

                    <Section className='text-center mt-8'>

                        <Text className='text-gray-600'
                        >

                            Nếu bạn có bất kỳ câu hỏi hoặc khó khăn nào, vui lòng liên hệ với nhóm hỗ trợ của chúng tôi! <br />

                            <Link href='mailto:nguyennhattan12092002@gmail.com' className='text-[#18b9ae] underline'>
                                nguyennhattan12092002@gmail.com
                            </Link>

                        </Text>

                    </Section>

                </Body>

            </Tailwind>

        </Html>

    )

}