import { BaseComponent, Dependencies, Tag, Template, createModel } from "../core";
import { store } from "./services/EmployeesDataService";

@Tag('employees-table')
    @Dependencies('employees-data-service')
@Template(/*html*/`
    <h1>Employees</h1>
    loaded: {{isLoaded}}
    <table></table>
    `)
    
export class EmployeeTable extends BaseComponent {
    static bindings = {
        employees: 'employees',
        isLoaded: 'isLoaded',
    }

    static model = createModel(store);

    private _employees: any[] = [];
    get employees() {
        return this._employees;
    }
    set employees(employees: any[]) {
        this._employees = employees;
        if (!this._employees?.length) { 
            return;
        }

        requestAnimationFrame(() =>  this.querySelector('table').innerHTML = `<tbody>
        ${employees.map(employee => `<tr><td>${employee.name.first}</td></tr>`).join('')}
        </tbody>`);
    }

    
    connectedCallback() {
        super.connectedCallback();
        const service = this.dependency['employees-data-service'];
        service.getEmployees();
    }
}