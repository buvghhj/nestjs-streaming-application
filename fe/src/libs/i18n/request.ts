import { getCurrentLanguage } from "./language"

const getRequestConfig = async () => {

    const language = await getCurrentLanguage()

    return {

        locale: language,

        messages: (await import(`../../../public/languages/${language}.json`)).default

    }

}

export default getRequestConfig