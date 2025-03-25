import { Markup } from "telegraf";

export const BUTTONS = {

    authSuccess: Markup.inlineKeyboard([

        [
            Markup.button.callback('📜 Followings', 'followings'),
            Markup.button.callback('👤 Profile', 'me'),
        ],
        [
            Markup.button.url('🌏 Website', 'https://tanstream.vn')
        ]

    ]),

    profile: Markup.inlineKeyboard([
        Markup.button.url('⚙️ Setting Account', 'https://tanstream.vn/dashboard/settings')
    ])

}