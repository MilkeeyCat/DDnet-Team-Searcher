export type BindsT = {
    [key: string]: {
        cb: (id: number, {field, value}: {field: string, value: string | null | number}) => void
    }
}

export type ActionT = {
    name: string,
    cb: (data: any) => void
}