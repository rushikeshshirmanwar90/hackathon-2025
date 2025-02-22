interface FieldOption {
    label: string
    value: string
}

export interface Field {
    key: string
    label: string
    value: string | number | undefined
    type: 'text' | 'textarea' | 'number' | 'select'
    options?: FieldOption[]
}