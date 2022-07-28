class Plants {
    static async getPlantsList() {
        const response = await fetch('http://localhost:3000/api/plants');

        return await response.json();
    }

    static async addPlant(newPlant) {
        const response = await fetch('http://localhost:3000/api/plant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlant)
        });

        return await response.json();
    }

    static async getPlant(id) {
        const response = await fetch(`http://localhost:3000/api/plant/${id}`);

        return await response.json();
    }

    static async editPlant(updatedPlant) {
        await fetch(`http://localhost:3000/api/plant/${updatedPlant.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPlant)
        });
    }

    static async removePlant(id) {
        await fetch(`http://localhost:3000/api/plant/${id}`, {
            method: 'DELETE'
        });
    }

    static async removeSeveralPlants(checkedPlantsIds) {
        await fetch('http://localhost:3000/api/plants/several', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkedPlantsIds)
        });
    }

    static async clearPlantsList() {
        await fetch('http://localhost:3000/api/plants', {
            method: 'DELETE'
        });
    }
}

export default Plants;