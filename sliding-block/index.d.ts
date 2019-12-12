interface paramObjects {
    domId: string,
    isWelt?: boolean,
    domWidth?: number,
    domHeight?: number
}

declare var drag: (paramObjects: paramObjects) => void;