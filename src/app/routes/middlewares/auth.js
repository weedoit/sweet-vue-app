Middleware.register('auth', (to, from, next) => {
    if (Auth.isLoggedIn()) {
        next(); 
    } 

    return next('auth/login');
})