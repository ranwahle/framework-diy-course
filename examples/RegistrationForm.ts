import { BaseComponent } from "../core/BaseComponent";
import { Pubsub } from "../core/Pubsub";
import { Router } from "../core/router/router";

export class RegistrationForm extends BaseComponent {
    static template = /*html*/ `
    <style>
        a:target {
            display: none;
        }
    </style>
    <div>
      <h1>Registration Form</h1>
        <label>
        Username: <input type="text" name="username">
        </label>
        <label>
        Password: <input type="password" name="password">
        </label>
        <router-outlet path="/register/new">
            <template>
        <label>

        Confirm Password: <input type="password" name="confirm-password">
        </label>
        <a href="#/register">Existing User?</a>
        </template>
        </router-outlet>
        <a id="/register/new" href="#/register/new">Register</a>
        </div>`;
    static dependencies = ['minimum_age', 'registration-event-bus'];

    static bindings = {

    }

    constructor() { 
        super();
        this.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const pubsub =this.dependency['registration-event-bus'];
            pubsub.publish('username', target.value);
            
        });
    }

    connectedCallback(): void {
        super.connectedCallback();

    }
}

customElements.define("registration-form", RegistrationForm);