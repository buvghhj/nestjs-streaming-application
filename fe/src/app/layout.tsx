import "@/styles/globals.css";
import "@/styles/themes.css";
import { ApolloClientProvider } from "@/providers/ApolloClientProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from 'next-intl/server'
import { Libre_Franklin } from "next/font/google"
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ColorSwitch } from "@/components/ui/elements/ColorSwitch";
import { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "@/libs/constants/seo.contant";
import { APP_URL } from "@/libs/constants/url.constant";

const libreFranklin = Libre_Franklin({
  subsets: ["latin", "vietnamese"],
  variable: "--font-libre-franklin",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {

  title: {

    absolute: SITE_NAME,

    template: `%s - ${SITE_NAME}`

  },

  description: SITE_DESCRIPTION,

  metadataBase: new URL(APP_URL),

  applicationName: SITE_NAME,

  authors: [

    {
      name: 'nguyennhattan',
      url: new URL('https://github.com/buvghhj')
    }

  ],

  keywords: SITE_KEYWORDS,

  generator: 'Next.js',

  creator: 'tan',

  publisher: 'nguyennhattan',

  icons: {

    icon: '/favicon.ico',

    shortcut: '/favicon.ico',

    apple: '/touch-icons/256x256.png',

    other: {
      rel: 'touch-icons',
      url: '/touch-icons/256x256.png',
      sizes: '256x256',
      type: 'image/png'
    }

  },

  openGraph: {

    title: SITE_NAME,

    description: SITE_DESCRIPTION,

    type: 'website',

    emails: ['buvghhj123@gmail.com'],

    locale: 'vi_VN',

    images: [
      {
        url: '/touch-icons/512x512.png',
        width: 512,
        height: 512,
        alt: SITE_NAME
      }
    ],

    url: new URL(APP_URL)

  },

  twitter: {

    title: SITE_NAME,

    description: SITE_DESCRIPTION,

    images: [
      {
        url: '/touch-icons/512x512.png',
        width: 512,
        height: 512,
        alt: SITE_NAME
      }
    ]

  }

}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const locale = await getLocale()

  const messages = await getMessages()

  return (

    <html lang={locale} suppressHydrationWarning>

      <head>
        <link rel="icon" href="/touch-icons/favicon.ico" />
      </head>

      <body suppressHydrationWarning className={libreFranklin.variable}>

        <ColorSwitch />

        <ApolloClientProvider>

          <NextIntlClientProvider messages={messages}>

            <ThemeProvider
              attribute='class'
              defaultTheme="dark"
              disableTransitionOnChange
            >

              <ToastProvider />

              {children}

            </ThemeProvider>

          </NextIntlClientProvider>

        </ApolloClientProvider>

      </body>

    </html>

  )

}
