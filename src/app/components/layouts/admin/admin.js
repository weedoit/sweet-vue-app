Layout('admin', {
    template: '@',

    data () {
        console.log(Env.get('MY_ACCOUNT_PAGE_PATH'));

        return {
            myAccountRoute: Env.get('MY_ACCOUNT_PAGE_PATH')
        };
    },

    methods: {
        logout () {
            const redirect = () => this.$router.replace(Env.get('LOGIN_PAGE_ROUTE'));

            AuthProvider.logout()
                .then(redirect)
                .catch(redirect);
        }
    }
})