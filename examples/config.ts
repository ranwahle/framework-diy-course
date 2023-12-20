import { register } from "../core/Injector";
import { Pubsub } from "../core/Pubsub";

register('minimum_age', (target: any) => {
    if (target && target.hasAttribute?.('kuku')) { 
        return 16;
    }

    return 18;
});

register('registration-event-bus', (target: any) => { 
    return Pubsub.get('registration-form');
});