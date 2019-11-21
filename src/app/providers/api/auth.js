class AuthResource extends RESTFullResource {
    static endpoint () {
        return '';
    }

    static store (data) {
        return this.request('POST', Env.get('AUTH_ENDPOINT'), data);
    }

    static destroy () {
        return this.request(Env.get('LOGOUT_ENDPOINT_METHOD'), Env.get('LOGOUT_ENDPOINT'));
    }
}