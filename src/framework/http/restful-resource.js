class RESTFullResource {
    static endpoint () {
        return '';
    }

    static index () {
        throw new Error('This resource don\'t has the "index" method.');
    }

    static show () {
        throw new Error('This resource don\'t has the "show" method.');
    }

    static store () {
        throw new Error('This resource don\'t has the "store" method.');
    }

    static update () {
        throw new Error('This resource don\'t has the "update" method.');
    }

    static destroy () {
        throw new Error('This resource don\'t has the "destroy" method.');
    }

    static url (segment) {
        return [Env.get('API_URL', '/'), this.endpoint(), segment]
            .join('/')
            .replace(/([^:]\/)\/+/g, "$1")
            .replace(/\/$/, '');
    }

    static request (method, segment, data = {}, headers = {}) {
        return this.process({
            url: this.url(segment),
            method,
            data,
            headers
        });
    }

    static intercept (type, interceptor) {
        this.interceptors = this.interceptors || {
            request: [],
            response: []
        };

        this.interceptors[type].push(interceptor); 
    }

    static applyInterceptors (type, target) {
        let interceptors = [];

        if (this.interceptors && this.interceptors[type]) {
            interceptors = this.interceptors[type];
        }

        for (let x = 0, len = interceptors.length; x < len; x += 1) {
            const interceptor = interceptors[x];
            const interceptorReturn = interceptor(target);

            if (interceptorReturn) {
                target = interceptorReturn;
            }
        }

        return target;
    }

    // https://gist.github.com/tjmehta/9204891
    static objectToQuerystring (obj) {
        return Object.keys(obj).reduce(function (str, key, i) {
            var delimiter, val;
            delimiter = (i === 0) ? '?' : '&';
            key = encodeURIComponent(key);
            val = encodeURIComponent(obj[key]);
            return [str, delimiter, key, '=', val].join('');
        }, '');
    }

    static createFormData(object, form, namespace) {
        const formData = form || new FormData();
        
        for (let property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            
            const formKey = namespace ? `${namespace}[${property}]` : property;

            if (object[property] instanceof Date) {
                formData.append(formKey, object[property].toISOString());
            } else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
                this.createFormData(object[property], formData, formKey);
            } else {
                formData.append(formKey, object[property]);
            }
        }

        return formData;
    }

    static hasFile (obj) {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    
                    if (element instanceof File || (typeof element === 'object' && this.hasFile(element))) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    static process (request) {
        return new Promise((resolve, reject) => {
            let xhr = new (window.XMLHttpRequest || window.ActiveXObject)('MSXML2.XMLHTTP.3.0');
            let method = request.method;

            this.applyInterceptors('request', request);

            if (['POST', 'PUT'].includes(method) && this.hasFile(request.data)) {
                request.data = this.createFormData(request.data);
            }

            if (method === 'GET' && request.data) {
                request.url += this.objectToQuerystring(request.data);
                request.data = null;
            }

            if (method === 'PUT') {
                request.data = request.data || {};
                request.url += this.objectToQuerystring({ _method: 'PUT' });
                method = 'POST';

                if (request.data instanceof FormData) {
                    request.data.append('_method', 'PUT');
                } else {
                    request.data._method = 'PUT';
                }
            }

            xhr.withCredentials = true;
            xhr.open(method, request.url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            if (!(request.data instanceof FormData)) {
                xhr.setRequestHeader('Content-type', 'application/json');
            }

            if (request.headers) {
                for (const key in request.headers) {
                    if (request.headers.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, request.headers[key]);
                    }
                }
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    let response;

                    try {
                        response = JSON.parse(xhr.responseText);
                    } catch (error) {
                        return reject(error);
                    }

                    const changedResponse = this.applyInterceptors('response', { response, status: xhr.status });

                    if (changedResponse) {
                        response = changedResponse.response;
                    }

                    if ([200, 201, 202].indexOf(xhr.status) >= 0) {
                        resolve(response);
                    }

                    return reject(response);
                }
            };

            const payload = !(request.data instanceof FormData)
                ? ((request.data) ? JSON.stringify(request.data) : '{}')
                : request.data;

            xhr.send(payload);
        });
    }
}
