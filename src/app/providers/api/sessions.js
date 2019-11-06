class SessionsResource extends RESTFullResource {
    static endpoint() {
        return 'sessions';
    }
    static store(data) {
        return this.request('POST', '/', data);
    }
}