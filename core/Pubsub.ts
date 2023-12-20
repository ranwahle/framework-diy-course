

export class Pubsub {
    subscribers: Record<string, Set<Function>>;
    private constructor() {
        this.subscribers = {};
    }

    private static cached: Record<string, Pubsub> = {};
    static get(name: string = 'default') { 
        if (!this.cached[name]) {
            this.cached[name] = new Pubsub();
        }
        return this.cached[name];
    }
    on(event: string, callback: Function) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = new Set();
        }
        this.subscribers[event].add(callback);
        return () => this.off(event, callback);
    }

    off(event: string, callback: Function) {
        if (!this.subscribers[event]) {
            return;
        }
        this.subscribers[event].delete(callback);
    }

    publish(event: string, data: any) {
        if (!this.subscribers[event]) {
            return;
        }
        this.subscribers[event]?.forEach(callback => {
            callback(data);
        });
    }
}

// export class Pubsub {
//     impl: HTMLElement;
//     constructor() {
//         this.impl = document.createElement('div');
//     }

//     on(event: string, callback: Function) {
//         this.impl.addEventListener(event, callback as EventListener);
//         return () => this.off(event, callback);
//     }
    
//     off(event: string, callback: Function) {
//         this.impl.removeEventListener(event, callback as EventListener);
//     }
// }