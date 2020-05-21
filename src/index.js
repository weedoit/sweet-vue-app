// -- DECLARE VENDORS --
// @vendor: 'vue-the-mask/dist/vue-the-mask.js'

// -- INITIALIZE VENDORS --
Vue.use(VueTheMask);

// -- SET ENVIROMENTS VARIABLES -- 
//
// ENV.set(KEY, VALUE, ENV = 'GLOBAL')
//
// Examples:
//   Env.set('MY_KEY', 'c4ca4238a0b923820dcc509a6f75849b');
//   Env.set('MY_KEY', 'c81e728d9d4c2f636f067f89cc14862c', 'PROD');
//
Env.set('CURRENT_ENV', 'LOCAL');

// @SH_ENV - START - DONT REMOVE THIS LINE!!
Env.set('PROJECT_NAME', 'sweetheart');
Env.set('API_URL', '');
Env.set('AUTH_DRIVER', 'session');
Env.set('AUTH_ENDPOINT', '/login');
Env.set('AFTER_LOGIN_REDIRECT', '/');
Env.set('MY_ACCOUNT_PAGE_PATH', '');
Env.set('LOGOUT_ENDPOINT', '/logout');
Env.set('LOGOUT_ENDPOINT_METHOD', 'GET');
Env.set('PUT_METHOD_SPOOFING', 'querystring');
Env.set('ONSAVE_ERROR', 'Fail to save resource');
Env.set('ONLOAD_ERROR', 'Fail to load resource');
Env.set('ONLOGIN_ERROR', 'Fail to log in');
// @SH_ENV - END - DONT REMOVE THIS LINE!!

App.start();
