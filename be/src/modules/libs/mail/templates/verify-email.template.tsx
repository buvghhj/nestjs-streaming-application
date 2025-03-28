import * as  React from 'react'
import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

interface VerifyEmailTemplateProps {
    domain: string
    token: string
}

const VerifyEmailTemplate = ({ domain, token }: VerifyEmailTemplateProps) => {

    const verifyEmailLink = `${domain}/account/verify?token=${token}`

    return (

        <Html>

            <Head />

            <Preview>Verify Account</Preview>

            <Tailwind>

                <Body className='max-w-2xl mx-auto p-6  bg-slate-50'>

                    <Section className='text-center mb-8'>

                        <Heading className='text-3-xl text-black form-bold'>
                            Xác nhận email của bạn
                        </Heading>

                        <Text className='text-base text-black'>
                            Cảm ơn bạn đã tạo tài khoản với TanStream, để xác nhận email của bạn, click vào đây :
                        </Text>

                        <Link href={verifyEmailLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
                            Xác nhận email
                        </Link>

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

export default VerifyEmailTemplate