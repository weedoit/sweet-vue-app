RESTFullResource.intercept('response', (res) => {
    const data = res.response;
    const has = (n) => typeof data[n] !== 'undefined';

    if (data && has('page') && has('lastPage') && has('total') && has('perPage') && Array.isArray(data.data)) {
        res.response = new PaginatedResponse(data);
    } else if (data && has('pagination') && has('result')) {
        res.response = new PaginatedResponse(Object.assign({}, data.pagination, { data: data.result }));
    } else if (data && has('status')){
        if (data.status === 'OK') {
            res.response = data.result || null;
        } else {
            res.response = data.error;
        }
    }

    return res;
});