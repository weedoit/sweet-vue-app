RESTFullResource.intercept('request', (req) => {
	if (AuthProvider.isLoggedIn() && Env.get('AUTH_DRIVER') === 'jwt') {
		req.headers = req.headers || {};
		req.headers['Authorization'] = `Bearer ${AuthProvider.getUserData().getAccessToken()}`;
	}
});

RESTFullResource.intercept('response', (res, status) => {
	if (status === 403 && AuthProvider.isLoggedIn()) {
		AuthProvider.logout();
		window.location.reload();
	}
});