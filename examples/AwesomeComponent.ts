import { BaseComponent } from "../core/BaseComponent";
import { Router } from "../core/router/router";
import { store } from "./store";

export class AwesomeComponent extends BaseComponent {
    static template = /*html*/ `
    <div>
      <h1>Hello {{userName}}</h1>
        <h2>Age: {{userAge}}</h2>
        <h2>City: {{userCity}}</h2>
    </div>
    <button id="changeName" onclick="this.dispatchEvent(new Event('kuku', {bubbles: true}))">Change Name</button>
    <button id="changeAge" onclick="this.dispatchEvent(new Event('changeAge', {bubbles: true}))">Change Age</button>
    `;
  
    private _userName = "";

    get userName() { return this._userName.split('').join('$'); }

    set userName(value: string) { this._userName = value;}

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('kuku', () => {
            store.user.name = 'Kuku';
        });
        this.addEventListener('changeAge', () => {
            console.log('changeAge');
            store.user.age = Math.floor(Math.random() * 100);
        
        });
    
    }
  }

AwesomeComponent.bindings = {
    "user.name": "userName",
    "user.age": "userAge",
    'user.address.city': 'userCity'
};
AwesomeComponent.model = store;
  
customElements.define("awesome-component", AwesomeComponent);