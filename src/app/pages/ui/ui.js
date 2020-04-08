Page('ui', {
    template: '@',

    data () {
        return {
            loading: true,
            sending: false,
            resource: {},
            datasources: {}
        }
    },

    methods: {},
    async mounted () {
        this.loading = false;
    }
});