import { createModel } from "./model";

describe('model', () => {
    it('should create a schema', () => {
        const model = createModel({
            name: 'string',
            age: 'number'
        });

        expect(model.name).toEqual('string');
        expect(model.age).toEqual('number');

    });

    it('should create a a model and notify changes', (done) => {
        const model = createModel({
            name: 'string',
            age: 2
        });

        model.$on('age', (age) => {
            expect(age).toEqual(30);
            expect(model.age).toEqual(30);
            done();
        });

        model.name = 'John';
        model.age = 30;

    
    
    });
    
    it('should remove listener', () => {
        const model = createModel({ name: 'string' });
        const callback = jest.fn();
        model.$on('name', callback);
        model.name = 'John';
        expect(callback).toHaveBeenCalledTimes(1);
        model.$off('name', callback);
        model.name = 'John';
        expect(callback).toHaveBeenCalledTimes(1);
    });
    
    it('should notify on any change', () => { 
        const model = createModel({ name: 'string' });
        const callback = jest.fn();
        model.$on('*', callback);
        model.name = 'John';
        expect(callback).toHaveBeenCalledTimes(1);
    })

    it('should notify on nested changes', () => {
        const model = createModel({
            name: 'string',
            address: {
                street: 'string',
                city: 'string'
            }
        });
        const callback = jest.fn();
        model.$on('*', callback);
        const addressCityChanged = jest.fn();
        model.address.$on('address.city', addressCityChanged);
        model.address.city = 'London';
        expect(addressCityChanged).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
    })

    it('should issue an error in case of listener changes the value it listens to', () => { 
        const model = createModel({ name: 'string' });
        const callback = jest.fn();
        model.$on('name', () => {
            model.name = 'John'
            callback();
        });

        expect(() => model.name = 'John').toThrow();
    })


})