import Component from '../../views/component';

import Plants from '../../models/plants';
import Users from '../../models/users';

import HeaderTemplate from '../../../templates/partials/header';

class Header extends Component {
    constructor() {
        super();

        this.model = Plants;
    }

    async getData() {
        this.plants =  await this.model.getPlantsList();
        this.plants = this.plants.filter(plant => plant.userId === this.user.id);
        return this.plants;
    }

    async render(plants, instances, user) {
        return await HeaderTemplate({page: this.urlParts.page, id: this.urlParts.id, plants, instances, user});
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const logOutBtn = document.getElementsByClassName('header__logout')[0],
            headerWrapper = document.getElementsByClassName('header__wrapper')[0];

        logOutBtn.onclick = evt => {
            evt.preventDefault();

            this.changeUserStatus(logOutBtn, headerWrapper);
        };
    }

    async changeUserStatus(logOutBtn, headerWrapper) {

        await Users.changeUserStatus(logOutBtn.dataset.id);

        if (this.urlParts.page === '') {
            const joinBtn = document.getElementsByClassName('about__btn-join')[0],
                loginBtn = document.getElementsByClassName('about__btn-login')[0],
                startBtn = document.getElementsByClassName('about__btn-start')[0];

            joinBtn.classList.remove('hidden');
            loginBtn.classList.remove('hidden');
            startBtn.classList.add('hidden');
        } else {
            this.redirectToAbout();
        }

        headerWrapper.classList.add('hidden');
    }

    redirectToAbout() {
        location.hash = '#/';
    }
}

export default Header;
