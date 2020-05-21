Page('ui', {
    template: '@',

    filters: {
        gulag (value) {
            return value;
        }
    },

    data () {
        return {
            loading: true,
            sending: false,
            resource: {
                'default': null,
                primary: null,
                success: null,
                info: null,
                warning: null,
                danger: null,
                small: null,
                medium: null,
                large: null,
                rounded: null
            },

            datasources: {}
        }
    },

    methods: {
        onPaginate (page) {
            const params = {
                query: {
                    page
                }
            };
            this.$router.push(params, () => this.loadResources(page));
        }
    },

    async mounted () {
        this.loading = false;
    }
});