class LoggedUser {
    name = null;
    email = null;
    picture = null;
    role = null;
    token = null;
    permissions = [];

    constructor (userdata) {
        if (userdata) {
            for (let key in userdata) {
                if (userdata.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                    this[key] = userdata[key];
                }
            }
        }
    }

    getName () {
        return this.name;
    }

    getEmail () {
        return this.email;
    }
    
    getRole () {
        return this.role;
    }

    getAccessToken () {
        return this.token;
    }

    hasPermission (name) {
        return Array.isArray(this.permissions) && this.permissions.indexOf(name) >= 0;
    }

    getPicture () {
        return this.picture
            ? this.picture
            : 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0ibDEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU4Ljc1IDI1OC43NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjU4Ljc1IDI1OC43NTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+PGc+PGNpcmNsZSBjeD0iMTI5LjM3NSIgY3k9IjYwIiByPSI2MCIgZmlsbD0iI0VDRUNFQyIvPjxwYXRoIGQ9Ik0xMjkuMzc1LDE1MGMtNjAuMDYxLDAtMTA4Ljc1LDQ4LjY4OS0xMDguNzUsMTA4Ljc1aDIxNy41QzIzOC4xMjUsMTk4LjY4OSwxODkuNDM2LDE1MCwxMjkuMzc1LDE1MHoiIGZpbGw9IiNFQ0VDRUMiLz48L2c+PC9zdmc+Cg=='
    }
}