const tagged = new WeakSet<any>();

type PrimitiveType = string | number | boolean | null | undefined;



/**
 * This function should return a model with notification for every change
 * @param schema 
 */
type Observable<T> = T extends PrimitiveType ? T:
    { [K in keyof T]: Observable<T[K]> } & {
    $on: (key: keyof T | '*', callback: (value: any) => void) => void,
    $off: (key: keyof T | '*', callback: (value: any) => void) => void
    };

export function createModel<T extends Record<string, any>>(schema: T): Observable<T> {
    if (tagged.has(schema)) return schema as unknown as Observable<T>;
    const result: any = {};
    const keys = Object.keys(schema);
    const callbacks: Record<keyof T, Set<Function>> = [...keys, '*'].reduce((acc, key) => {
        acc[key as keyof T] = new Set();

        return acc;
    }, {} as Record<keyof T, Set<Function>>);
    
    result.$on = (key: keyof T | '*', callback: (value: any) => void) => {
        callbacks[key].add(callback);
        return () => callbacks[key].delete(callback);
    }
    result.$off = (key: keyof T, callback: (value: any) => void) => {
        callbacks[key].delete(callback);
     };

    keys.forEach(key => {
        let value = schema[key];
        if (typeof value === 'object' && !!value) {
            value = createModel(value);
            value.$on('*', (value: any) => callbacks['*'].forEach(callback => callback(value)));
        }
        Object.defineProperty(result, key, {
            get() {
                console.log(`get ${key} = ${value}`);
                return value;
            },
            set(newValue) {
                value = newValue;
                callbacks[key].forEach(callback => callback(value));
                callbacks['*'].forEach(callback => callback(value));
            },
            enumerable: true,
        });
        result[key] = value;
     });

    tagged.add(result);
    return result as Observable<T>;

}