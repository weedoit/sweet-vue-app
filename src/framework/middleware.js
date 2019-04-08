class Middleware {
    static bindRouter(router) {
        router.beforeEach((to, from, next) => {
            this.processChain(to, from, next);
        });
    }

    static register(name, def) {
        if (!this.chain) {
            this.chain = [];
        }

        this.chain[name] = def;
    }

    static getRouteMiddlewareChain (name) {
        const route = Router.get(name);

        if (route && route.middleware) {
            const list = Array.isArray(route.middleware) 
                ? route.middleware
                : [route.middleware];

            return list.map((middleware) => {
                if (this.chain && this.chain[middleware]) {
                    return this.chain[middleware];
                } else {
                    throw new Error(`Middleware "${middleware}" is invalid.`);
                }
            });
        }

        return [];
    }

    static processChain(to, from, nextRoute) {
        const chain = this.getRouteMiddlewareChain(to.name);

        if (chain.length === 0) {
            return nextRoute();
        }

        const iterator = this.makeIterator(chain);

        const processNext = () => {
            const item = iterator.next();

            if (item.done) {
                return nextRoute();
            }

            const rule = item.value;

            rule(to, from, (result) => {
                if (typeof result === 'undefined') {
                    processNext();
                } else {
                    nextRoute(result);
                }
            });
        }

        processNext();
    }

    static makeIterator(arr) {
        let index = 0;

        return {
            next() {
                const out = (index < arr.length)
                    ? { value: arr[index], done: false }
                    : { done: true };

                index += 1;

                return out;
            }
        }
    }
}