import { createModel, register } from "../../core";

export const store = createModel({employees: [], isLoaded: false});

export class Employees {
    private constructor() {

    }
    private static  _instance: Employees = new Employees();
    static getInstance() {
        return Employees._instance;
    }

    getEmployees() {
        const response = fetch('https://randomuser.me/api/?seed=foobar&results=50');
        return response.then(response => response.json())
            .then(data => data.results).then(data => {
                store.employees = data;
                store.isLoaded = true;
            });
    }
}

register('employees-data-service', Employees.getInstance);
