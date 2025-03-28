import { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import * as  React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'

interface DeactivateTemplateProps {
    token: string
    metadata: SessionMetadata
}

const DeactivateTemplate = ({ token, metadata }: DeactivateTemplateProps) => {

    return (

        <Html>

            <Head />

            <Preview>Disable account</Preview>

            <Tailwind>

                <Body className='max-w-2xl mx-auto p-6  bg-slate-50'>

                    <Section className='text-center mb-8'>

                        <Heading className='text-3xl text-black form-bold'>
                            Yêu cầu kích hoạt vô hiệu hóa tài khoản
                        </Heading>

                        <Text className='text-base text-black mt-2'>
                            Bạn đã bắt đầu quá trình vô hiệu hóa tài khoản của mình trên nền tảng <b>TanStream</b>
                        </Text>

                    </Section>

                    <Section className='bg-gray-100  rounded-lg shadow-md p-6 text-center mb-6'>

                        <Heading className='text-2xl  text-black font-semibold'>
                            Mã xác nhận:
                        </Heading>

                        <Heading className='text-3xl text-black font-semibold'>
                            {token}
                        </Heading>

                        <Text className='text-black'>
                            Mã này có hiệu lực trong 5 phút
                        </Text>

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
                            Nếu bạn đổi ý, chỉ cần bỏ qua tin nhắn này, tài khoản của bạn vẫn sẽ hoạt động bình thường!
                        </Text>

                    </Section>

                    <Section className='text-center mt-8'>

                        <Text className='text-gray-600'>

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

export default DeactivateTemplate