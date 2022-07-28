class Users {

    static async getUsersList() {
        const response = await fetch('http://localhost:3000/api/users');

        return await response.json();
    }

    static async addUser(newUser) {
        const response = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        return await response.json();
    }

    static async getUser() {
        const response = await fetch('http://localhost:3000/api/user/active');

        return await response.json();
    }

    static async changeUserStatus(id) {
        await fetch(`http://localhost:3000/api/user/${id}/passive`, {
            method: 'PUT'
        });
    }

    static async changeUserStatusActive(username) {
        await fetch(`http://localhost:3000/api/user/${username}/active`, {
            method: 'PUT'
        });
    }

}

export default Users;