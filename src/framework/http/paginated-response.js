class PaginatedResponse extends Array {
    constructor (response) {
        super();

        this.total = response.total;
        this.page = response.page;
        this.perPage = response.perPage;
        this.lastPage = response.lastPage;

        for (let x = 0, len = response.data.length; x < len; x += 1) {
            this.push(response.data[x]);
        }
    }
}
