RESTFullResource.intercept('response', (res) => {
	const data = res.response;
	const has = (n) => typeof data[n] !== 'undefined';

	if (data && has('page') && has('lastPage') && has('total') && has('perPage') && Array.isArray(data.data)) {
		res.response = new PaginatedResponse(data);
	}

	return res;
});