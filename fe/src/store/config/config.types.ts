import { TypeBaseColor } from "@/libs/constants/color.contant"

export interface ConfigStore {

    theme: TypeBaseColor

    setTheme: (theme: TypeBaseColor) => void

}
