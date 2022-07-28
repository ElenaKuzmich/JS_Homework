import {parseCurrentURL} from '../helpers/utils.js';

import Users from '../models/users';

class Component {
    constructor() {
        this.urlParts = parseCurrentURL();
    }

    async getInstanceData() {}

    async getUserData() {
        this.user = await Users.getUser();

        return this.user;
    }

    async getData() {}

    getDateData() {}

    async getAdditionalData() {}

    afterRender() {}
}

export default Component;