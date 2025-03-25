export const parserBoolean = (value: string): boolean => {

    if (typeof value === 'boolean') {

        return value

    }

    if (typeof value === 'string') {

        const lowerValue = value.trim().toLowerCase()

        if (lowerValue === 'true') {

            return true

        }

        if (lowerValue === 'false') {

            return false

        }

    }

    throw new Error(`Không thể chuyển đổi giá trị ${value} thành giá trị boolean!`)

}