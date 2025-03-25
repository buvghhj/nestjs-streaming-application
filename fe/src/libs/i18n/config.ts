export type Language = (typeof languages)[number]

export const COOKIE_NAME = 'language'

export const languages = ['vi', 'en', 'ru'] as const

export const defaultLanguage: Language = 'vi'
