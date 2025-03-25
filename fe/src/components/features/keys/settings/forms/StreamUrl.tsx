import { Input } from "@/components/ui/common/Input"
import CardConatainer from "@/components/ui/elements/CardConatainer"
import CopyButton from "@/components/ui/elements/CopyButton"
import { useTranslations } from "next-intl"

interface StreamUrlProps {
    value: string | null
}

const StreamUrl = ({ value }: StreamUrlProps) => {

    const t = useTranslations('dashboard.keys.url')


    return (

        <CardConatainer
            heading={t('heading')}
            isRightContentFull
            rightContent={

                <div className="flex w-full items-center gap-x-4">

                    <Input value={value ?? ''} disabled placeholder={t('heading')} />

                    <CopyButton value={value} />

                </div>

            }
        />

    )

}

export default StreamUrl