import { Button } from "@/components/ui/common/Button"
import { Input } from "@/components/ui/common/Input"
import CardConatainer from "@/components/ui/elements/CardConatainer"
import CopyButton from "@/components/ui/elements/CopyButton"
import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface StreamKeyProps {
    value: string | null
}

const StreamKey = ({ value }: StreamKeyProps) => {

    const t = useTranslations('dashboard.keys.key')

    const [isShow, setIsShow] = useState(false)

    const Icon = isShow ? Eye : EyeOff

    return (

        <CardConatainer
            heading={t('heading')}
            isRightContentFull
            rightContent={

                <div className="flex w-full items-center gap-x-4">

                    <Input value={value ?? ''} type={isShow ? 'text' : 'password'} disabled placeholder={t('heading')} />

                    <CopyButton value={value} />

                    <Button variant='ghost' size='lgIcon' onClick={() => setIsShow(!isShow)}>

                        <Icon className="size-5" />

                    </Button>

                </div>

            }
        />


    )

}

export default StreamKey