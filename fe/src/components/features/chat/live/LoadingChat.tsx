import { Card } from "@/components/ui/common/Card"
import { Loader } from "lucide-react"
import { useTranslations } from "next-intl"

const LoadingChat = () => {

    const t = useTranslations('stream.chat')

    return (

        <Card className="justify-center items-center lg:fixed w-full overflow-y-auto flex h-[82%] lg:w-[21.5%] flex-col xl:mt-0">

            <Loader className="size-10 animate-spin text-muted-foreground" />

            <p>{t('loading')}</p>

        </Card>

    )

}

export default LoadingChat