export type Transformer = (v: any) => any

export type ValueType = {
    test: (v: any) => boolean
    parse: (v: any) => any
    transform?: Transformer
    createTransformer?: (template: string) => Transformer
    default?: any
    getAnimatableNone?: (v: any) => any
}

export type NumberMap = {
    [key: string]: number
}

export type RGBA = {
    red: number
    green: number
    blue: number
    alpha: number
}

export type HSLA = {
    hue: number
    saturation: number
    lightness: number
    alpha: number
}

// Display P3 color space
export type P3 = {
    p3_r: number
    p3_g: number
    p3_b: number
    alpha: number
}

export type Color = HSLA | RGBA | P3
