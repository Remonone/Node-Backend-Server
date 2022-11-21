// Code source: https://stackoverflow.com/questions/58861115/what-is-the-best-way-to-automatically-validate-requests-using-typescript
export const validateParams: (targetObject: any, validatorObject: any) => boolean = (targetObject, validatorObject) => {
    if (typeof targetObject !== typeof validatorObject) return false
    if (typeof targetObject === 'object') {
        let validObject = true
        if (Array.isArray(targetObject)) {
            for (let subObject of targetObject) {
                validObject = validObject && validateParams(subObject, validatorObject[0])
            }
        } else {
            for (let key of Object.keys(validatorObject)) {
                if (typeof targetObject[key] === 'object') validObject = validObject && validateParams(targetObject[key], validatorObject[key])
                if (typeof targetObject[key] !== typeof validatorObject[key]) validObject = false
            }
        }
        return validObject
    }
    return true
}