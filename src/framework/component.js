class ComponentRegister {
    static getRealName (type, name) {
        return (type !== 'pages')
            ? `ui-${name}`
            : name;
    }

    static get (type, name) {
        try {
            const item = this._storage_[type][name];

            if (item ) {
                return item;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error(`Component ${type}.${name} not registered.`);
        }
    }

    static set (type, name, def) {
        if (!this._storage_) {
            this._storage_ = {
                pages: {},
                components: {}
            }
        }

        this._storage_[type][name] = Vue.component(
            this.getRealName(type, name),
            def
        );
    }
}

const Page = (name, def) => {
    ComponentRegister.set('pages', name, def);
}

const Component = (name, def) => {
    ComponentRegister.set('components', name, def);
}