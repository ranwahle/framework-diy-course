import { BaseComponent } from "../BaseComponent";

export interface Route {
    path: string;
    component: BaseComponent;
    children?: Route[];
}

