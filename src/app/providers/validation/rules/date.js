SweetValidator.rule('date',  {
    test: (val, format) => {
        if (SweetValidator.utils.isEmpty(val)) {
            return true;
        }

        var string = val,
            dateFormat = format || 'Ymd',
            dateString = string,
            compare,
            parse,
            day,
            month,
            dateParts;

        if (dateFormat !== 'Ymd' && dateFormat !== 'dmY') {
            return false;
        }

        if (dateFormat === 'dmY') {
            dateParts = dateString.replace(/[\/\-]/g, '-').split('-');
            dateString = [dateParts[2], dateParts[1], dateParts[0]].join('/');
        }

        parse = new Date(dateString);

        if (parse.toString() === 'Invalid Date') {
            return false;
        }

        day = ((parse.getUTCDate()) < 10) ? '0' + parse.getUTCDate() : parse.getUTCDate();
        month = ((parse.getMonth() + 1) < 10) ? '0' + (parse.getMonth() + 1) : (parse.getMonth() + 1);
        compare = [parse.getUTCFullYear(), month, day].join('/');

        return (compare === dateString) ? true : false;
    },

    message: 'Data inválida.'
});