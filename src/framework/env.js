class Env {
    static get (key, fallback = null) {
        const env = this.getCurrentEnv();

        try {
            if (typeof this.storage[env][key] !== 'undefined') {
                return this.storage[env][key];
            }
        } catch(e) {}

        try {
            if (typeof this.storage.GLOBAL[key] !== 'undefined') {
                return this.storage.GLOBAL[key];
            }
        } catch(e) {}
        
        return fallback;
    }

    static set (key, value, env = 'GLOBAL') {
        this.storage = this.storage || {};
        this.storage[env] = this.storage[env] || {};

        if (typeof value !== 'undefined') {
            this.storage[env][key] = value;
        } else {
            const obj = key;
            
            for (let k in obj) {
                if (obj.hasOwnProperty(k)) {
                    this.storage[env][k] = obj[k];
                }
            }
        }
    }

    static getCurrentEnv () {
        this.storage = this.storage || {};
        this.storage.GLOBAL = this.storage.GLOBAL || {};

        return (this.storage.GLOBAL.CURRENT_ENV)
            ? this.storage.GLOBAL.CURRENT_ENV
            : 'LOCAL';
    }
}