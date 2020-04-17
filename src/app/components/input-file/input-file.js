Component('input-file', {
    template: '@',
    methods: {
        handleFile (el) {
            const files = this.$el.files;
            this.$emit('input', files.length ? files[0] : null);
        }
    }
});