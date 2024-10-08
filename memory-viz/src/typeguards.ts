// TODO: if there are packages that can already do this
export function isArrayOfType<T>(value: any, type: string): value is T[] {
    return (
        Array.isArray(value) &&
        value.every((element) => typeof element === type)
    );
}
