import { BaseComponent, Dependencies, Tag, Template, Event } from "../core/BaseComponent";
import template from './RegistrationForm.template';
@Dependencies('minimum_age', 'registration-event-bus')
    @Tag('registration-form')
@Template(template)
export class RegistrationForm extends BaseComponent {

    static bindings = {

    }

    constructor() { 
        super();
        debugger;
    }

    @Event('input')
    handleInput(e: Event) { 
        const target = e.target as HTMLInputElement;
        const pubsub =this.dependency['registration-event-bus'];
        pubsub.publish('username', target.value);
    }

    connectedCallback(): void {
        super.connectedCallback();

    }
}

