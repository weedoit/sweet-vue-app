class Auth {
    static USER_DATA_KEY = 'sweet.vue.auth.userdata';
    static MODE_JWT = 'jwt';
    static MODE_SESSION = 'session';

    static isLoggedIn () {
        return this.getUserData() !== null;
    }

    static async authenticate (credentials) {
        throw new Error('Auth@authenticate method not implemented.');
    }

    static getUserData () {
        try {
            const data = localStorage.getItem(this.USER_DATA_KEY); 
            const user = new LoggedUser(JSON.parse(data));
            return user;
        } catch (error) {
            return null;
        }
    }

    static setUserData (userdata) {
        if (!(userdata instanceof LoggedUser)) {
            throw new Error('userdata must be a instance of LoggedUser class.');
        }

        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userdata)); 
    }

    static logout () {
        localStorage.removeItem(this.USER_DATA_KEY);
    }
}

Vue.prototype.$user = function () {
    return Auth.getUserData();
};