//@vendor: "toast/dist/toast.min.js";
//@vendor: "modal/dist/modal.min.js";

Page('home', {
    template: "@",

    data () {
        return {
            name: null
        }
    },

    methods: {
        submit () {
            if (this.SweetValidator.isValid()) {
                console.log('maO6e');
            }
        }
    }
});