export default function getNestedProperty(obj: any, path: string) {
    const paths = path.split('.')
    for (const key of paths) {
        if (obj === undefined || obj === null) {
            obj = undefined
            break
        }
        obj = obj[key]
        continue
    }
    return obj
}
