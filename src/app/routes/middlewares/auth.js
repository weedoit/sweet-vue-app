Middleware.register('auth', (to, from, next) => {
    if (Auth.isLoggedIn()) {
        return next(); 
    } 

    return next(Env.get('LOGIN_PAGE_ROUTE', '/login'));
})