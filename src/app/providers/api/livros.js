class LivrosResource extends RESTFullResource {
    static endpoint() {
        return '/books';
    }
    static index(page = 1, q) {
        const params = {
            page,
            q
        };
        return this.request('GET', '/', params);
    }
}