SweetValidator.rule('email',  {
    test: (val) => {
        if (SweetValidator.utils.isEmpty(val)) {
            return true;
        }

        const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        return !!(filter.test(val));
    },

    message: 'E-mail inválido.'
});