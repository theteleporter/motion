export type ValueHandler<Input, Parsed, Transformed> = {
    test: (v: Input) => boolean
    parse: (v: Input) => Parsed
    transform: (v: Parsed) => Transformed
    // createTransformer?: (template: string) => Transformer
    // default?: any
    // getAnimatableNone?: (v: any) => any
}

export interface ValueHandlerMap {
    [key: string]: ValueHandler<any, any, any>
}
