import type { FactoryProvider, ModuleMetadata } from "@nestjs/common"

export const LiveKitOptionsSymbol = Symbol('LiveKitOptionsSymbol')

export type TypeLiveKitOption = {

    apiUrl: string

    apiKey: string

    apiSecret: string

}

export type TypeLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<TypeLiveKitOption>, 'useFactory' | 'inject'>