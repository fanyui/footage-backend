const removeObjKeys = <T = Record<string, any>, R = T>(obj: T, arr_keys: (keyof T)[]) => {
    // to remove certain keys from objects
    const update = {}

    for (const key in obj) {
        if (arr_keys.includes(key)) continue
        update[key as string] = obj[key]
    }

    return update as R
}

export { removeObjKeys }