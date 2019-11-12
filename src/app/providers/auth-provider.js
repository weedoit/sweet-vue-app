class AuthProvider extends Auth {
    static async authenticate (credentials) {
        const data = await AuthResource.store(credentials);
        const user = this.normalizeUserData(data);

        this.setUserData(user);
    }

    static normalizeUserData (userdata) {
        return new LoggedUser({ 
            name: userdata.name,
            email: userdata.email,
            role: userdata.role,
            permissions: userdata.permissions,
            picture: userdata.picture
        });
    }
}