import { createModel, query } from "./model";

export class BaseComponent extends HTMLElement {
    static bindings: Record<string, string> = {};
    static template = "";
    static model = createModel({});
    private _unObservers: Set<() => void> = new Set();

    connectedCallback() { 
        Object.keys(this.constructor.bindings).forEach(key => {
            const propertyName = this.constructor.bindings[key];

            const unObserver = this.constructor.model.$on(key, (value) => {
                this[propertyName] = value;
                this.render();
            });

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
        // this.innerHTML = this.constructor.template;
        let html = this.constructor.template;
        const bindings = this.constructor.bindings;
        Object.keys(bindings).forEach(key => {
            const propertyName = bindings[key];
            html = html.replace(`{{${propertyName}}}`, this[propertyName]);
        });

        this.innerHTML = html;
        console.log({bindings});
    }
  }
  
  
  
  