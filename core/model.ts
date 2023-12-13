const tagged = new WeakSet<any>();

type PrimitiveType = string | number | boolean | null | undefined;



/**
 * This function should return a model with notification for every change
 * @param schema 
 */
type Observable<T> = T extends PrimitiveType ? T:
    { [K in keyof T]: Observable<T[K]> } & {
    $on: (key: string, callback: (value: any) => void) => void,
    $off: (key: string, callback: (value: any) => void) => void
    };

export function query(model: any, path: string): any {
    try {
        const parts = path.split('.');
        let result = model;
        for (const part of parts) {
            result = result[part];
        }
        return result;
    } catch (e) {
        return {};
    }
}

export function createModel<T extends Record<string, any>>(schema: T, parent: string = '', callbacks: Record<string, Set<Function>> = {}): Observable<T> {
    if (tagged.has(schema)) return schema as unknown as Observable<T>;
    const result: any = {};
    const keys = Object.keys(schema);
    if (!callbacks['*']) {
        callbacks['*'] = new Set();
    }
    result.$on = (key: string, callback: (value: any) => void) => {
        if (!callbacks[key]) {
            callbacks[key] = new Set();
        }
        callbacks[key].add(callback);
        return () => callbacks[key].delete(callback);
    }
    result.$off = (key: string, callback: (value: any) => void) => {
        callbacks[key].delete(callback);
    };
    
    keys.forEach(key => {
        let value = schema[key];
        const path = parent ? `${parent}.${key}` : key;
        if (parent) {
            // @ts-ignore
            callbacks[path] = callbacks[path] || new Set();
        }
        if (typeof value === 'object' && !!value) {
            value = createModel(value, path, callbacks);
            // value.$on('*', (value: any) => callbacks['*'].forEach(callback => callback(value)));
        }
        Object.defineProperty(result, key, {
            get() {
                return value;
            },
            set(newValue) {
                value = newValue;
                // callbacks[key].forEach(callback => callback(value));
                callbacks[path]?.forEach(callback => callback(value));
                console.log(`set ${key}, ${path}; = ${value}`);
                callbacks['*'].forEach(callback => callback(value));
            },
            enumerable: true,
        });
        result[key] = value;
     });

    tagged.add(result);
    return result as Observable<T>;

}