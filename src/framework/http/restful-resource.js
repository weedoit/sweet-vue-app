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

    static process (request) {
        return new Promise((resolve, reject) => {
            const xhr = new (window.XMLHttpRequest || window.ActiveXObject)('MSXML2.XMLHTTP.3.0');

            this.applyInterceptors('request', request);

            if (request.method === 'GET' && request.data) {
                request.url += this.objectToQuerystring(request.data);
                request.data = null;
            }

            if (request.method === 'PUT') {
                request.data = request.data || {};
                request.method = 'POST';

                if (request.data instanceof FormData) {
                    request.data.append('_method', 'PUT');
                } else {
                    request.data._method = 'PUT';
                }
            }

            xhr.withCredentials = true;
            xhr.open(request.method, request.url, true);
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

            const input = !(request.data instanceof FormData)
                ? ((request.data) ? JSON.stringify(request.data) : '{}')
                : request.data;

            xhr.send(input);
        });
    }
}