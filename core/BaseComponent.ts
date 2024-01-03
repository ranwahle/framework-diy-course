import { DependencyInjection } from "./DependencyInjection";
import { createModel, query } from "./model";

/**
 * 
 * @param args 
 * @returns 
 * @example
 * @Template(`<h1>Hello {{username}}</h1>`)
 * @description
 * This decorator is used to define the template of the component
 * In the example the handlebars syntax is used to bind the username property to the instance of the component
 */
export function Template(...args: any[]) {
    console.log({arguments});
    return function(target: any) {
        target.template = args[0];
    }
}
export function Event(eventName: string) { 
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const result = originalMethod.apply(this, args);
           
            return result;
        }
        const originalConnectedCallback = target.connectedCallback || (() => { });
        target.connectedCallback = function(...args: any[]) {
            originalConnectedCallback.apply(this,...args);
            this.addEventListener(eventName, (evt: Event) => descriptor.value.call(this, evt));
            return this;
        }

    }
}
export function Tag(tag: `${string}-${string}`) {
    return function(target: any) {
        customElements.define(tag, target);
    }
}

export function Dependencies(...args: string[]) {
    return function(target: any) {
        target.dependencies = args;
    }
}

/**
 * @interface {HTMLElement}
 */
export class BaseComponent extends DependencyInjection(HTMLElement) {
    static bindings: Record<string, string> = {};
    static dependencies: string[] = [];
    static template = "";
    static model = createModel({});
    private _unObservers: Set<() => void> = new Set();


    // protected dependency: Record<string, any> = {};

    connectedCallback() { 
                //@ts-ignore
        Object.keys(this.constructor.bindings).forEach(key => {
                    //@ts-ignore
            const propertyName = this.constructor.bindings[key];

                    //@ts-ignore
            const unObserver = this.constructor.model.$on(key, (value) => {
                this[propertyName] = value;
                this.render();
            });
                    //@ts-ignore
            this[propertyName] = query(this.constructor.model, key);
            this._unObservers.add(unObserver);
        });


        this.render();
    }

   

    disconnectedCallback() {
        this._unObservers.forEach(unObserver => unObserver());
        this._unObservers.clear();
    }

    render() {

        //@ts-ignore
        let html = this.constructor.template;
        //@ts-ignore
        const bindings = this.constructor.bindings;
        Object.keys(bindings).forEach(key => {
            const propertyName = bindings[key];
            html = html.replace(`{{${propertyName}}}`, this[propertyName]);
        });

        this.innerHTML = html;
        console.log({bindings});
    }
  }
  
  
  
  