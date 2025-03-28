import * as React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from "@react-email/html";

const VerifyChannelTemplate = () => {

    return (

        <Html>

            <Head />

            <Preview>Your channel has been verified</Preview>

            <Tailwind>

                <Body className='max-w-2xl mx-auto p-6  bg-slate-50'>

                    <Section className='text-center mb-8'>

                        <Heading className='text-3xl text-black form-bold'>
                            Xin chúc mừng! Kênh của bạn đã được huy hiệu tích xanh!
                        </Heading>

                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 text-center shadow-md mb-6'>

                        <Heading className='text-xl font-semibold text-[#18B9AE]'>
                            Điều này có nghĩa là gì?
                        </Heading>

                        <Text className='text-base text-black mt-2'>
                            Chúng tôi xin thông báo rằng kênh của bạn đã được huy hiệu tích xanh và bạn đã có thể tạo gói hội viên riêng cho kênh của bạn.
                        </Text>

                        <Text className='text-base text-black mt-2'>
                            Huy hiệu này còn xác nhận tính xác thực của kênh của bạn và cải thiện độ tin cậy của người xem.
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

export default VerifyChannelTemplate