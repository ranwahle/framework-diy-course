import { BaseComponent } from "../core/BaseComponent";
import { Pubsub } from "../core/Pubsub";

export class RegistrationForm extends BaseComponent {
    static template = /*html*/ `
    <div>
      <h1>Registration Form</h1>
        <label>
        Username: <input type="text" name="username">
        </label>
        Minimum age: <span id="min_age"></span>
        </div>`;
    static dependencies = ['minimum_age', 'registration-event-bus'];

    static bindings = {

    }

    constructor() { 
        super();
        this.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const pubsub =this.dependency['registration-event-bus'];
            pubsub.publish('username',target.value);
        });
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.querySelector('#min_age')!.textContent = this.dependency.minimum_age;
    }
}

customElements.define("registration-form", RegistrationForm);