const cache: Record<string, Function> = {};

export function register(key: string, factory: Function) {
    cache[key] = factory;
}
export function Injector(key: string): Function {
    if (!cache[key]) {
        throw new Error(`No such dependency: ${key}`);
    }
    return cache[key];
}