class Auth {
    static ACCESS_TOKEN_KEY = 'sweet.vue.auth.access_token';
    static USER_DATA_KEY = 'sweet.vue.auth.user_data';

    static isLoggedIn () {
        return true;
    }

    static login (token, userdata = {}) {
        Cookies.set(this.ACCESS_TOKEN_KEY, token);
        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userdata));
    }

    static getAccessToken () {
        return Cookies.get(this.ACCESS_TOKEN_KEY) || null;
    }

    static getUser () {
        try {
            const data = localStorage.getItem(this.USER_DATA_KEY); 
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    static logout () {
        Cookies.remove(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.USER_DATA_KEY, JSON.stringify(userdata));
    }
}