import { DependencyInjection } from "../core/DependencyInjection";
import { Pubsub } from "../core/Pubsub";

const pubsub = Pubsub.get('registration-form');
pubsub.on('username', (username: string) => {
    console.log('username', username);
    const error = usernameService.validate(username);
    if (error) {
        console.log('error', error);
        pubsub.publish('username-error', error);
        return;
    }
    const available = usernameService.checkAvailability(username);
    pubsub.publish('username-available', available);
}
);


export const usernameService = {
    validate(username: string) {
        if (username.length < 3) {
            return 'Too short';
        }
    },
    checkAvailability(username: string) {
        return username !== 'Avichay';
    }
}

type OwnDeps = {
    'registration-event-bus': Pubsub,

}

const controller = DependencyInjection<OwnDeps>({
    dependencies: ['registration-event-bus'],
    init() {
        const pubsub = this.dependency['registration-event-bus'];
        pubsub.on('username', (username: string) => {
            console.log('username', username);
            const error = usernameService.validate(username);
            if (error) {
                console.log('error', error);
                pubsub.publish('username-error', error);
                return;
            }
            const available = usernameService.checkAvailability(username);
            pubsub.publish('username-available', available);
        }
        );
    }
})

controller.init();