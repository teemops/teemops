import { Analytics } from '@customerio/cdp-analytics-node'

export interface Person {
    name: string;
    email: string;
    plan: string;
    friends: number;
}

// instantiation
const analytics = new Analytics({
    writeKey: 'd6d9449647e1cb873e27',
    host: 'https://cdp.customer.io',
})

// sample identify call usage:
// analytics.identify({
//     userId: '019mr8mf4r',
//     traits: {
//         name: 'Cool Person',
//         email: 'cool.person@example.com',
//         plan: 'Enterprise',
//         friends: 42,
//     }
// });

module.exports.add = function add(person: Person) {
    analytics.identify({
        userId: person.email,
        traits: {
            name: person.name,
            email: person.email,
            plan: person.plan,
            friends: person.friends,
        }
    });
}