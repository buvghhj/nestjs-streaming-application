import { useTranslations } from 'next-intl'

export function formatDate(
    dateString: string | Date,
    includeTime: boolean = false
) {
    const t = useTranslations('utils.formatDate')

    // Chuyển đổi ngày sang múi giờ Hà Nội (GMT+7)
    const date = new Date(dateString).toLocaleString('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
    })

    const localDate = new Date(date)

    const day = localDate.getDate()
    const monthIndex = localDate.getMonth()
    const year = localDate.getFullYear()

    const hours = localDate.getHours().toString().padStart(2, '0')
    const minutes = localDate.getMinutes().toString().padStart(2, '0')

    const months = [
        t('months.january'),
        t('months.february'),
        t('months.march'),
        t('months.april'),
        t('months.may'),
        t('months.june'),
        t('months.july'),
        t('months.august'),
        t('months.september'),
        t('months.october'),
        t('months.november'),
        t('months.december')
    ]

    let formattedDate = `${hours}:${minutes}`

    if (includeTime) {
        formattedDate += `, ${day} ${months[monthIndex]} ${year}`
    }

    return formattedDate
}
