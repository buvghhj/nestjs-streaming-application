import { PropsWithChildren } from "react"
import CardConatainer from "./CardConatainer"
import { Switch } from "../common/Switch"
import { Skeleton } from "../common/Skeleton"

interface ToggleCardProps {

    heading: string
    description: string
    isDisabled?: boolean
    value: boolean
    onChange: (value: boolean) => void

}

const ToggleCard = ({ children, heading, description, isDisabled, value, onChange }: PropsWithChildren<ToggleCardProps>) => {

    return (

        <CardConatainer
            heading={heading}
            description={description}
            rightContent={<Switch checked={value} onCheckedChange={onChange} disabled={isDisabled} />}
        />

    )

}

export default ToggleCard

export const ToggleCardSkeleton = () => {

    return <Skeleton className="h-20 mt-6 w-full" />

}