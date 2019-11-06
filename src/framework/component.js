class ComponentRegister {
    static getRealName (type, name) {
        switch (type) {
            case 'page':
                return name;
            case 'layout':
                return `layout-${name}`;
            default:
                return  `ui-${name}`;
        }
    }

    static get (type, name) {
        try {
            const item = this._storage_[`${type}s`][name];

            if (item ) {
                return item;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error(`Component ${type}s.${name} not registered.`);
        }
    }

    static set (type, name, def) {
        if (!this._storage_) {
            this._storage_ = {
                pages: {},
                components: {},
                layouts: {}
            }
        }

        const realname = this.getRealName(type, name);

        this._storage_[`${type}s`][name] = Vue.component(realname, def);
    }
}

const Layout = (name, def) => {
    ComponentRegister.set('layout', name, def);
}

const Page = (name, def) => {
    ComponentRegister.set('page', name, def);
}

const Component = (name, def) => {
    ComponentRegister.set('component', name, def);
}