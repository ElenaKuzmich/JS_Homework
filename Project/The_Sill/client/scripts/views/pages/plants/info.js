import Component from '../../../views/component';

import Plants from '../../../models/plants';
import Instances from '../../../models/instances';

import InfoTemplate from '../../../../templates/pages/plants/info';
import Error404Template from '../../../../templates/pages/error404';

class Info extends Component {
    async getData() {
        this.plant = await Plants.getPlant(this.urlParts.id);

        return this.plant;
    }

    async getInstanceData() {
        this.instances = await Instances.getInstancesList();
        this.instance = this.instances.find(instance => instance.commonName === this.plant.commonName);

        return this.instance;
    }

    async getAdditionalData() {
        this.plants =  await Plants.getPlantsList();
        this.plants = this.plants.filter(plant => plant.userId === this.user.id);

        return this.plants;
    }

    async render(plant, instance, plants) {
        return await (!plant.error ? InfoTemplate({plant, instance, plants}) : Error404Template());
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const animItems = document.querySelectorAll('.anim-item');

        if (animItems.length > 0) {
            window.onscroll = () => this.animOnScroll(animItems);

            setTimeout(() => {
                this.animOnScroll(animItems);
            }, 300);
        }
    }

    animOnScroll(animItems) {
        for (let i = 0; i < animItems.length; i++) {
            const animItem = animItems[i],
                animItemHeight = animItem.offsetHeight,
                animItemOffset = this.offset(animItem).top,
                animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                animItem.classList.add('anim-active');
            } else {
                if (!animItem.classList.contains('anim-hide')) {
                    animItem.classList.remove('anim-active');
                }
            }
        }
    }

    offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
    }
}

export default Info;