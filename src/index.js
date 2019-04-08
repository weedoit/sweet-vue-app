// -- DECLARE VENDORS --
// @vendor: 'js-cookie/src/js.cookie.js'
// @vendor: 'vue-the-mask/dist/vue-the-mask.js'
// @vendor: 'izitoast/dist/js/iziToast.js'
// @vendor: 'izitoast/dist/css/iziToast.css'

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
// @SH_ENV - END - DONT REMOVE THIS LINE!!

App.start();