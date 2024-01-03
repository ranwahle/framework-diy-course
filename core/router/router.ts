
export const Router = {
   
    outlets: new Set<RouterOutlet>(),

    navigate(path: string) {
       window.location.hash = path;
    },
    registerOutlet(outlet: RouterOutlet) { 
        this.outlets.add(outlet);
        if (this.checkOutlet(outlet)) {
            outlet.activate();
        }
    },

    unregisterOutlet(outlet: RouterOutlet) { 
        outlet.deactivate();
        this.outlets.delete(outlet);
    },
    currentRoute: '',

    checkOutlet(outlet: RouterOutlet) { 
        const routerFullPath = outlet.getAttribute('path') || '';
        const routerParts = routerFullPath.split('/').slice(1);
        const currentParts = this.currentRoute.split('/').slice(1);
        
        let isActive = !!routerFullPath.length;
        for (let i = 0; i < routerParts.length; i++) {
            if (routerParts[i] !== currentParts[i]) {
                isActive = false;
                break;
            }
        }
        return isActive;
    },

    handler() {
       
        const shouldActivate: RouterOutlet[] =[];
        const shouldDeactivate: RouterOutlet[] = [];

        this.currentRoute = window.location.hash.slice(1);
        
        for (const outlet of this.outlets) { 
            const isActive = this.checkOutlet(outlet);
            if (isActive) {
                shouldActivate.push(outlet);
            } else { 
                shouldDeactivate.push(outlet);
            }
        }
        shouldDeactivate.forEach(outlet => outlet.deactivate());
        shouldActivate.forEach(outlet => outlet.activate());

        const hasActivated = shouldActivate.length > 0;

        if (!hasActivated) {
            [...this.outlets].filter(outlet => outlet.hasAttribute('default')).
                forEach(outlet => outlet.activate());
        }

        
    },

    init() {
        window.addEventListener('hashchange', () => this.handler());
        this.handler();

    }
}





export class RouterOutlet extends HTMLElement {
    template: HTMLTemplateElement | null = null; 
    isActivated = false;
    connectedCallback() {
        this.template = this.querySelector('template')
        this.template?.remove();
        Router.registerOutlet(this);
    }

    disconnectedCallback() {
        Router.unregisterOutlet(this);
    }

    activate() {
        if (!this.template || this.isActivated) return;
        const element = this.template.content.cloneNode(true);
        this.appendChild(element);
        this.isActivated = true;
    }

    deactivate() {
        this.innerHTML = '';
        this.isActivated = false;
    }

}

customElements.define('router-outlet', RouterOutlet);