import * as React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from "@react-email/html";


interface EnableTwoFactorTemplateProps {
    domain: string

}

export function EnableTwoFactorTemplate({ domain }: EnableTwoFactorTemplateProps) {

    const settingLink = `${domain}/dashboard/settings`

    return (

        <Html>

            <Head />

            <Preview>Enable Two Factor</Preview>

            <Tailwind>

                <Body className='max-w-2xl mx-auto p-6  bg-slate-50'>

                    <Section className='text-center mb-8'>

                        <Heading className='text-3xl text-black form-bold'>

                            Bảo vệ tài khoản của bạn bằng xác thực 2 yếu tố.

                        </Heading>

                        <Text className='text-base text-black mt-2'>
                            Bật xác thực 2 yếu tố để tăng cường bảo mật cho tài khoản của bạn.
                        </Text>

                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 text-center shadow-md mb-6'>

                        <Heading className='text-xl font-semibold text-[#18B9AE]'>

                            Tại sao điều này lại quan trọng?

                        </Heading>

                        <Text className='text-base text-black mt-2'>

                            Xác thực hai yếu tố bổ sung thêm một lớp bảo mật bằng cách yêu cầu mã mà chỉ bạn biết.

                        </Text>


                        <Link href={settingLink} className='inline-flex  justify-center items-center rounded-md text-sm font-medium text-white bg-[#18b9AE] px-5 py-2 rounded-full'>
                            Đi đến cài đặt
                        </Link>

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