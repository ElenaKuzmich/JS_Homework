class Instances {
    static async getInstancesList() {
        const response = await fetch('http://localhost:3000/api/instances');

        return await response.json();
    }

    static async addInstance(newInstance) {
        const response = await fetch('http://localhost:3000/api/instance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newInstance)
        });

        return await response.json();
    }

    static async getInstance(id) {
        const response = await fetch(`http://localhost:3000/api/instance/${id}`);

        return await response.json();
    }
}

export default Instances;