SweetValidator.rule('required',  {
    test: (val) => {
        return !SweetValidator.utils.isEmpty(val);
    },

    message: 'Este campo é obrigatório.'
});