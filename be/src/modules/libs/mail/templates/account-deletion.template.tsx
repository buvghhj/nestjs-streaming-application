import { Html } from "@react-email/html";
import * as React from 'react'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

interface AccountDeletionTemplateProps {
    domain: string
}

const AccountDeletionTemplate = ({ domain }: AccountDeletionTemplateProps) => {

    const registerLink = `${domain}/account/create`

    return (

        <Html>

            <Head />

            <Preview>Deleted Account</Preview>

            <Tailwind>

                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>

                    <Section className='text-center'>

                        <Heading className='text-3xl text-black form-bold'>
                            Tài khoản của bạn đã bị xóa hoàn toàn
                        </Heading>

                        <Text className='text-base text-black mt-2'>
                            Tài khoản của banj đã bị xóa hoàn toàn khỏi cơ sở dữ liệu của TanStream. Mọi dữ liệu và thông tin của bạn đã bị xóa vĩnh viễn
                        </Text>

                    </Section>

                    <Section className='bg-white  text-black text-center rounded-lg shadow-md p-6 mb-4'>

                        <Text >
                            🔒Bạn sẽ không còn nhận được thông báo trên Telegram và qua Email
                        </Text>

                        <Text>
                            Nếu bạn muốn quay lại nền tảng, bạn có thể đăng ký bằng liên kết sau:
                        </Text>

                        <Link className="inline-flex justify-center items-center rounded-md mt-2 text-sm font-semibold text-white bg-[#18B9AE] px-5 py-2 rounded-full" href={registerLink}>
                            Đăng ký trên TanStream
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

export default AccountDeletionTemplate