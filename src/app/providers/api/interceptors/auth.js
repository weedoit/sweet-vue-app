RESTFullResource.intercept('request', (req) => {
    if (AuthProvider.isLoggedIn() && Env.get('AUTH_DRIVER') === 'jwt') {
        req.headers = req.headers || {};
        req.headers['Authorization'] = `Bearer ${AuthProvider.getUserData().getAccessToken()}`;
    }
});

RESTFullResource.intercept('response', (res) => {
    if (res.status === 401 && AuthProvider.isLoggedIn()) {
        AuthProvider.logout()
            .then(() => window.location.reload())
            .catch(() => window.location.reload());
    }
});