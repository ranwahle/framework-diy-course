import { createModel } from "../core/model";

export const store = createModel({
    user: {
        'name': 'Random User',
        'age': 30,
        'address': {
            street: 'Random Street',
            city: 'Random City'
        }
    }

});

store.$on('*', (value) => {
    console.log('Store changed', value);
});