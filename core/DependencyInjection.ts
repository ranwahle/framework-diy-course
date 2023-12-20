import { Injector } from "./Injector";

export function DependencyInjection<T>(base: any) {
    if (typeof base === 'function' && base.constructor === Function) {
        const result = class extends base {
            static dependencies: string[] = [];
            constructor(...args: any[]) {

                super(...args);
                this.dependency = this.dependency || {};
                this.constructor.dependencies.forEach(key => {
                    this.dependency[key] = Injector(key)(this);
                });
            }
            protected dependency: Record<string, any>;
        }
        return result;
    }
    if (typeof base === 'object' && base) {

        base.dependency = base.dependency || {};
        base.dependencies?.forEach(key => {
            base.dependency[key] = Injector(key)(base);
        });
        return base as typeof base & { dependency: T };
    }
    throw new Error('Invalid dependency injection');
}