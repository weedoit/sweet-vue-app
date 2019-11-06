class App {
    static start () {
        const params = {
            router: Router.createVueRouter()
        };

        return (new Vue(params)).$mount('#app');
    }
}