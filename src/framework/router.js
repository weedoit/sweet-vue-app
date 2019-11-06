class Router {
    static all() {
        return this._routes || [];
    }

    static set(path, component, { middleware, name } = {}) {
        if (!this._routes) {
            this._routes = [];
        }

        this._routes.push({
            name: this.getOrCreateName(name),
            component: ComponentRegister.get('page', component),
            middleware,
            path,
        });
    }

    static group ({ prefix, middleware }, def) {
        const gmiddleware = middleware;

        def({ 
            set(path, component, { middleware, name } = {}) {
                const groupPath = prefix ? `${prefix}/${path}` : path;

                Router.set(groupPath, component, {
                    middleware: Router.mergeMiddlewareRules(gmiddleware, middleware),
                    name
                })
            }
        });
    }

    static mergeMiddlewareRules (group, route) {
        const gmiddleware = group
            ? (Array.isArray(group) ? group : [group])
            : [];

        const rmiddleware = route
            ? (Array.isArray(route) ? route : [route])
            : [];
       
        return []
            .concat(gmiddleware, rmiddleware)
            .filter((c, i, arr) => arr.indexOf(c) === i);
    }

    static get (name) {
        const routes = this.all();
        const len = routes.length;

        for (let x = 0; x < len; x += 1) {
            const route = routes[x];

            if (route.name === name) {
                return route;
            }
        }
    }

    static createVueRouter () {
        const router = new VueRouter({ mode: 'history', routes: this.all() });
        Middleware.bindRouter(router);
        return router;
    }

    static getOrCreateName (name) {
        if (!name) {
            this._it_ = this._it_ || 1;
            this._it_ += 1;

            return `route_${this._it_}`;
        } else {
            return name;
        }
    }
}