(() => {
    let inputs = [];
    let errors = [];
    let rules = {};

    const parseRule = (str) => {
        if (!str) {
            return [];
        }

        return str.split('|').reduce((acc, rule) => {
            const [name, args] = rule.split(':');

            if (name.indexOf('@if') === 0) {
                const matches = name.match(/^@if\((\w+),\s?(.*)\)$/);

                if (matches) {
                    const [ign, condition, realRule] = matches;
                    const rules = parseRule(realRule).map(c => { c.condition = condition; return c;});
                    return acc.concat(rules);
                }
            }

            acc.push({
                name,
                args: (args || '').split(',')
            })

            return acc;
        }, []);
    };

    const applyErrors = function (errors) {
        for (let x = 0, len = errors.length; x < len; x += 1) {
            const cur = errors[x];
            generateErrorMessageElement(cur.input, cur.message);
        }
    }

    const generateErrorMessageElement =  (input, text) => {
        const message = document.createElement('div');
        const parentNode = input.parentNode;

        message.innerHTML = text;
        message.classList.add('sh-validator-feedback');
        parentNode.appendChild(message);
        parentNode.classList.add('sh-validator-has-error');

        input.onfocus = function () {
            parentNode.classList.remove('sh-validator-has-error');
            message.remove();
            input.onfocus = null;
        };
    };

    const removeAllErrorMessages = () => {
        const elements = document.querySelectorAll('.form-control-feedback');
        const tooltips = Array.prototype.slice.call(elements);

        for (let x = 0, len = tooltips.length; x < len; x += 1) {
            const el = tooltips[x];
            el.parentNode.classList.remove('has-error', 'has-danger');
            el.remove();
        }
    }

    const getInputValue = (input) => {
        return input.value;
    }

    const cleanUpErrors = () => {
        for (var i = 0; i < errors.length; i++) {
            const input = errors[i].input;
            const parentNode = input.parentNode;
            const message = parentNode.querySelector('.sh-validator-feedback');

            if (message) {
                message.remove();
            }

            input.onfocus = null;
            parentNode.classList.remove('sh-validator-has-error');
        }

        errors = [];
    }

    const API = {
        errors () {
            return errors;
        },

        rule (name, { test, message }) {
            rules[name] = {
                test: test,
                message 
            };
        },

        validate (context = {}) {
            cleanUpErrors();

            for (let i = 0, len = inputs.length; i < len; i += 1) {
                const input = inputs[i];
                const inputRules = parseRule(input.getAttribute('rules'));

                for (let x = 0, rlen = inputRules.length; x < rlen; x += 1) {
                    const rule = inputRules[x];
                    const tester = rules[rule.name];

                    if (rule.condition && rule.condition !== '') {
                        if (!context[rule.condition]) {
                            continue;
                        }
                    }

                    if (tester) {
                        const params = [getInputValue(input)].concat(rule.args);

                        if (!tester.test.apply(tester, params)) {
                            errors.push({
                                input,
                                rule: rule.name,
                                message: tester.message
                            });

                            break;
                        }
                    }
                }
            }

            removeAllErrorMessages();
            applyErrors(errors);

            return errors.length === 0;
        },

        attach (el) {
            inputs.push(el);
        },

        detach (el) {
            const filtered = [];

            for (var i = inputs.length - 1; i >= 0; i--) {
                const cur = inputs[i];

                if (cur !== el) {
                    filtered.push(cur);
                }
            }

            inputs = filtered;
        },

        utils: {
            isEmpty (val) {
                if  (
                    (val instanceof Array && val.length === 0) ||
                    (val === null) ||
                    ((`${val}`).trim() === '')
                ) {
                    return true;
                }

                return false;
            },

            getInputValueByName (name) {
                let input = null;

                // 1st try
                for (var x = inputs.length - 1; x >= 0; x--) {
                    const cur = inputs[x];

                    if (cur.name === name) {
                        input = cur;
                        break;
                    }
                }

                // 2st try
                if (!input) {
                    input = document.getElementsByName(name);
                }

                return (input)
                    ? getInputValue(input)
                    : null;
            }
        }
    }

    if (window.Vue) {
        Vue.prototype.isValid = function () {
            const editing = typeof this.$route.params.id !== 'undefined';
            return API.validate({ edit: editing, create: !editing });
        }

        Vue.directive('sh-validate', {
            bind (el) {
                API.attach(el);
            },
            unbind (el) {
                API.detach(el);
            }
        });
    }

    window.SweetValidator = API;
})();