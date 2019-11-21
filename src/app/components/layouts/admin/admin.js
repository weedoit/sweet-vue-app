Layout('admin', {
    template: '@',

    data () {
        return {
            myAccountRoute: Env.get('MY_ACCOUNT_PAGE_PATH'),
            menuOpen: false
        };
    },

    methods: {
        logout () {
            const redirect = () => this.$router.replace(Env.get('LOGIN_PAGE_ROUTE'));

            AuthProvider.logout()
                .then(redirect)
                .catch(redirect);
        },

        toggleMenu () {
            this.menuOpen = !this.menuOpen;
        },

        closeMenu () {
            this.menuOpen = false;
        }
    }
})