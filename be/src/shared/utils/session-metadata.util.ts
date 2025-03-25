import { Request } from "express";
import { SessionMetadata } from "../types/session-metadata.types";
import { IS_DEV_ENV } from "./is-dev.util";
import DeviceDetector = require('device-detector-js');
import { lookup } from 'geoip-lite'
import { DeviceDetectorResult } from "device-detector-js";
import * as countries from 'i18n-iso-countries'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

export const getSessionMetadata = (req: Request, userAgent: string): SessionMetadata => {

    const ip = IS_DEV_ENV
        ?
        '42.116.147.167'
        :
        Array.isArray(req.headers['cf-connecting-ip'])

            ?
            req.headers['cf-connecting-ip'][0]
            :
            req.headers['cf-connecting-ip'] || (typeof req.headers['x-forwarded-for'] === 'string'
                ? req.headers['x-forwarded-for'].split(',')[0]
                :
                req.ip)

    const location = lookup(ip)

    const device: DeviceDetectorResult = userAgent ? new DeviceDetector().parse(userAgent) : {} as DeviceDetectorResult

    return {

        location: {

            country: countries.getName(location.country, 'en') || 'Vietnam',

            city: location.city || 'Hanoi',

            latidute: location.ll[0] || 0,

            longtitude: location.ll[1] || 0

        },

        device: {

            browser: device?.client?.name || 'Unknown Browser',

            os: device?.os?.name || 'Unknown OS',

            type: device?.device?.type || 'Unknown Device'

        },

        ip

    }

}