SweetValidator.rule('url',  {
    test: (val) => {
        if (SweetValidator.utils.isEmpty(val)) {
            return true;
        }
        
        const filter = /((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        return filter.test(val);
    },

    message: 'URL inválida.'
});