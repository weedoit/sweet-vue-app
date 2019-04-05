SweetValidator.rule('confirmed', {
    test: (val, target) => {
        const targetValue = SweetValidator.utils.getInputValueByName(target);
        return val === targetValue;
    },

    message: 'Campos não conferem.'
});