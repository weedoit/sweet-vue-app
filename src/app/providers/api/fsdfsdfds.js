class FsdfsdfdsResource extends RESTFullResource {
    static endpoint() {
        return 'fdsfsfdsf';
    }
    static index(page = 1, q) {
        const params = {
            page,
            q
        };
        return this.request('GET', '/', params);
    }
    static show(id) {
        return this.request('GET', id);
    }
    static store(data) {
        return this.request('POST', '/', data);
    }
    static update(id, data) {
        return this.request('PUT', id, data);
    }
    static destroy(id) {
        return this.request('DELETE', id);
    }
}