'use server'

import { cookies } from "next/headers"
import { COOKIE_NAME, defaultLanguage, Language } from "./config"

export const getCurrentLanguage = async () => {

    const cookieStore = await cookies()

    const language = cookieStore.get(COOKIE_NAME)?.value ?? defaultLanguage

    return language

}

export const setLanguage = async (language: Language) => {

    const cookieStore = await cookies()

    return cookieStore.set(COOKIE_NAME, language)


}