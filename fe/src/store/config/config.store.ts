"use client"

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ConfigStore } from './config.types'
import { TypeBaseColor } from '@/libs/constants/color.contant'

export const configStore = create(

    persist<ConfigStore>(

        set => ({

            theme: 'turquoise',

            setTheme: (theme: TypeBaseColor) => set({ theme })

        }),

        {

            name: 'config',

            storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined

        }

    )

)
