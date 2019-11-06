class AuthResource extends RESTFullResource {
    static endpoint() {
        return Env.get('AUTH_ENDPOINT');
    }
    static store(data) {
        return this.request('POST', '/', data);
    }
}