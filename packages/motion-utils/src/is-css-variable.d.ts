export type CSSVariableName = `--${string}`;
export type CSSVariableToken = `var(${CSSVariableName})`;
export declare const isCSSVariableName: (key?: string | number | null) => key is `--${string}`;
export declare const isCSSVariableToken: (value?: string) => value is `var(--${string})`;
