import Component from '../../../views/component';

import Plants from '../../../models/plants';
import Instances from '../../../models/instances';

import AddAndListTemplate from '../../../../templates/pages/plants/add-list';
import PlantTemplate from '../../../../templates/pages/plants/plant';

class AddAndList extends Component {
    constructor() {
        super();

        this.model = Plants;
    }

    getDateData() {
        let date = new Date(),
            currentMonth = date.getMonth(),
            string = date.toLocaleDateString(),
            ms = Date.now(),
            season;

        if (currentMonth >= 2 && currentMonth <= 4) {
            season = 'spring';
        } else if (currentMonth >= 5 && currentMonth <= 7) {
            season = 'summer';
        } else if (currentMonth >= 8 && currentMonth <= 10) {
            season = 'autumn';
        } else if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) {
            season = 'winter';
        }

        this.currentDate = {season, string, ms};

        return this.currentDate;
    }

    async getData() {
        let msCurrentDate = Date.now();

        this.plants = await this.model.getPlantsList();
        this.plants = this.plants.filter(plant => plant.userId === this.user.id);

        for (let plant of this.plants) {
            plant.msCurrentDate = msCurrentDate;
        }
        return this.plants;
    }

    async getInstanceData() {
        this.instances = await Instances.getInstancesList();
        // return await Instances.getInstancesList();
        return this.instances;
    }

    async render(plants, instances, user) {
        return await AddAndListTemplate({plants, instances, user});
    }

    afterRender() {
        this.setActions();

        this.countPlantsAmount();
    }

    setActions() {
        const plantNameField = document.getElementsByClassName('plant-add__name')[0],
            plantDescriptionField = document.getElementsByClassName('plant-add__description')[0],
            formationContainer = document.getElementsByClassName('plant-add__creation')[0],
            addPlantBtn = document.getElementsByClassName('plant-add__btn-add')[0],
            plantContainersList = document.getElementsByClassName('plant'),
            plantsContainer = document.getElementsByClassName('plants')[0],
            clearPlantsListBtn = plantsContainer.getElementsByClassName('plants__btn-clear')[0],
            plantsList = plantsContainer.getElementsByClassName('plants__list')[0],
            checkInputsList = document.getElementsByClassName('plant__check'),
            selectPlantBtn = plantsContainer.getElementsByClassName('plants__btn-select')[0],
            plantSelectContainer = document.getElementsByClassName('plant-add__select-container')[0],
            plantSelectField = document.getElementsByClassName('plant-add__select')[0],
            plantsCollectionContainer = document.getElementsByClassName('plant-add__collection')[0],
            plantsCollection = document.getElementsByClassName('plant-add__instance'),
            // plantPreview = document.getElementsByClassName('plant-add__preview')[0],
            plantPhotoPreview = document.getElementsByClassName('plant-add__photo')[0];

        plantSelectField.onclick = () => plantsCollectionContainer.classList.toggle('hidden');

/*
        window.onclick = evt => {
            if (evt.target === plantSelectContainer) {
                if (!plantsCollectionContainer.classList.contains('hidden')) {
                    plantsCollectionContainer.classList.add('hidden');
                }
            }
        };
*/

        formationContainer.onkeyup = evt => {
            const target = evt.target,
                targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('plant-add__name'):
                    this.formName(addPlantBtn, plantSelectField);
                    break;

                case targetClassList.contains('plant-add__description'):
                    this.formDescription(addPlantBtn, plantSelectField);
                    break;
            }
        };

        plantSelectField.onkeyup = () => this.searchPlant(plantSelectField, plantsCollectionContainer, plantsCollection, addPlantBtn);

        plantSelectContainer.onclick = evt => {
            const target = evt.target,
                targetClassList = target.classList;
            if (targetClassList.contains('plant-add__instance')) {
                this.selectPlant(target, plantsCollectionContainer, plantSelectField, addPlantBtn, plantNameField, plantDescriptionField);
                // this.selectPlant(target, target.parentNode.children, plantSelectField, addPlantBtn);
            }
        };

        plantSelectContainer.onmouseover = evt => {
            const target = evt.target,
                targetClassList = target.classList;
            if (targetClassList.contains('plant-add__instance')) {
                this.showPreview(target, plantsCollection, plantPhotoPreview);
            }
        };

        addPlantBtn.onclick = () => this.addPlant(plantPhotoPreview, plantSelectField, plantNameField, plantDescriptionField, addPlantBtn,
                                                clearPlantsListBtn, plantsList, selectPlantBtn);

        plantsContainer.onclick = evt => {
            const target = evt.target,
                targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('plants__btn-clear'):
                    this.clearPlantsList(plantsList, clearPlantsListBtn, addPlantBtn, checkInputsList, plantContainersList, plantSelectField,
                        plantNameField, plantDescriptionField, selectPlantBtn);
                    break;

                case targetClassList.contains('plants__btn-select'):
                    this.useSelectEnable(target, plantsList, checkInputsList, clearPlantsListBtn, plantSelectField,
                                               plantNameField, plantDescriptionField, addPlantBtn);
                    break;

                case targetClassList.contains('plant__check'):
                    this.selectPlantsForRemove(checkInputsList, clearPlantsListBtn);
                    break;

                case targetClassList.contains('plant__photo'):
                    this.redirectToPlantInfo(target.dataset.id);
                    break;

                case targetClassList.contains('plant__watering-btn'):
                case targetClassList.contains('plant__spraying-btn'):
                case targetClassList.contains('plant__nutrition-btn'):
                case targetClassList.contains('plant__replanting-btn'):
                    this.changeLastDate(target, target.dataset.id);
                    break;

                case targetClassList.contains('plant__btn-remove'):
                    this.removePlant(plantsList, target.parentNode.parentNode.parentNode, clearPlantsListBtn, addPlantBtn);
                    break;
            }
        };
    }

    searchPlant(plantSelectField, plantsCollectionContainer, plantsCollection, addPlantBtn) {
        let filter = plantSelectField.value.trim().toLowerCase();
        for (let i = 0; i < plantsCollection.length; i++) {
            if (plantsCollection[i].innerHTML.toLowerCase().startsWith(filter)) {
                // plantsCollection[i].style.display = 'block';
                if (!plantsCollection[i].classList.contains('active')) {
                    plantsCollection[i].classList.add('active');
                }
                if (plantsCollection[i].classList.contains('hidden')) {
                    plantsCollection[i].classList.remove('hidden');
                }
            } else {
                // plantsCollection[i].style.display = 'none';
                if (plantsCollection[i].classList.contains('active')) {
                    plantsCollection[i].classList.remove('active');
                }
                if (!plantsCollection[i].classList.contains('hidden')) {
                    plantsCollection[i].classList.add('hidden');
                }
            }
        }
        addPlantBtn.nextElementSibling.classList.add('hidden');
    }

    selectPlant(instanceItem, plantsCollectionContainer, plantSelectField, addPlantBtn, plantNameField, plantDescriptionField) {
        plantSelectField.value = instanceItem.innerHTML;
        plantsCollectionContainer.classList.add('hidden');
        plantNameField.value = '';
        plantDescriptionField.value = '';

        if (this.isRepeatPlantCommonName(plantSelectField)) {
            addPlantBtn.disabled = true;
        } else {
            addPlantBtn.disabled = false;
        }

        addPlantBtn.nextElementSibling.classList.add('hidden');
    }

    formName(addPlantBtn, plantSelectField) {
        addPlantBtn.nextElementSibling.classList.add('hidden');

        if (this.isRepeatPlantCommonName(plantSelectField)) {
            addPlantBtn.disabled = false;
        }
    }

    formDescription(addPlantBtn, plantSelectField) {
        addPlantBtn.nextElementSibling.classList.add('hidden');

        if (this.isRepeatPlantCommonName(plantSelectField)) {
            addPlantBtn.disabled = false;
        }
    }

    isRepeatPlantCommonName(plantSelectField) {
        for (let i = 0; i < this.plants.length; i++) {
            if (plantSelectField.value === this.plants[i].commonName) {
                return true;
            }
        }
        return false;
    }

    showPreview(target, plantsCollection, plantPhotoPreview) {
        for (let i = 0; i < this.instances.length; i++) {
            if (target.innerHTML === this.instances[i].commonName) {
                plantPhotoPreview.setAttribute('src', `../../../images/instances/${this.instances[i].photoTitle1}`);
            }
        }
    }

    async addPlant(plantPhotoPreview, plantSelectField, plantNameField, plantDescriptionField, addPlantBtn, clearPlantsListBtn, plantsList, selectPlantBtn) {
        const instances = this.instances;

        const instance = isExistingPlant();
        function isExistingPlant() {
            for (let i = 0; i < instances.length; i++) {
                if (plantSelectField.value.toLowerCase().trim() === instances[i].commonName.toLowerCase()) {
                    return instances[i];
                }
            }
            return false;
        }

        if (instance) {
            let newPlant = {
                commonName: instance.commonName,
                botanicalName: instance.botanicalName,
                name: plantNameField.value.trim(), // Name
                description: plantDescriptionField.value.trim(),
                photoTitle: instance.photoTitle1,
                flowering: instance.flowering,
                deciduous: instance.deciduous,
                fruitful: instance.fruitful,
                forLowLight: instance.forLowLight,
                forHighLight: instance.forHighLight,
                humidityLoving: instance.humidityLoving,
                droughtTolerant: instance.droughtTolerant,
                msCurrentDate: this.currentDate.ms,
                userId: this.user.id
            };

            newPlant = await this.model.addPlant(newPlant);

            this.clearAddPlant(plantSelectField, plantNameField, plantDescriptionField, addPlantBtn);

            addPlantBtn.nextElementSibling.classList.remove('hidden');

            clearPlantsListBtn.disabled && (clearPlantsListBtn.disabled = false);

            plantsList.insertAdjacentHTML('afterbegin', await PlantTemplate({plant: newPlant}));
            plantPhotoPreview.setAttribute('src', '../../../images/previews/plants-preview.jpg');

            this.plants.unshift(newPlant);
            this.countPlantsAmount();

            selectPlantBtn.disabled && (selectPlantBtn.disabled = false);

        } else {
            plantSelectField.insertAdjacentHTML('beforebegin', '<p class="modal__error">Enter a valid plant common name or select from the list</p>');
        }
    }

    clearAddPlant(plantSelectField, plantNameField, plantDescriptionField, addPlantBtn) {
        plantSelectField.value = '';
        plantNameField.value = '';
        plantDescriptionField.value = '';
        addPlantBtn.disabled = true;
    }

    countPlantsAmount() {
        const plantsCounter = document.getElementsByClassName('plants__counter')[0],
            plantsHeaderCounter = document.getElementsByClassName('header__plants')[0],
            totalAmount = document.getElementsByClassName('plant').length,
            toBeVerbForm = (totalAmount === 1) ? 'is' : 'are',
            plantWordForm = (totalAmount === 1) ? 'plant' : 'plants';

        plantsCounter.innerHTML = !totalAmount ?
            'Plants list is empty' :
            `There ${toBeVerbForm} <span class="plants__counter-total">${totalAmount}</span> ${plantWordForm} in the list`;

        plantsHeaderCounter.innerHTML = `${totalAmount} ${plantWordForm}` ;
    }

    useSelectEnable(selectBtn, plantsList, checkInputsList, clearPlantsListBtn, plantSelectField,
                          plantNameField, plantDescriptionField, addPlantBtn) {

        if (checkInputsList[0].disabled) {
            selectBtn.innerHTML = 'Cancel';

            for (let checkInput of checkInputsList) {
                checkInput.disabled = false;
            }

            plantSelectField.disabled = true;
            plantNameField.disabled = true;
            plantDescriptionField.disabled = true;
            addPlantBtn.disabled = true;

        } else if (!checkInputsList[0].disabled) {
            selectBtn.innerHTML = 'Select Plants';

            for (let checkInput of checkInputsList) {
                checkInput.checked = false;
                checkInput.disabled = true;
            }

            plantSelectField.disabled = false;
            plantNameField.disabled = false;
            plantDescriptionField.disabled = false;
            addPlantBtn.disabled = true;
            clearPlantsListBtn.innerHTML = 'Clear Plants List';
        }
    }

    selectPlantsForRemove(checkInputsList, clearPlantsListBtn) {
        function countCheckedInputAmount() {
            let checkedInputAmount = 0;

            for (let checkInput of checkInputsList) {
                if (checkInput.checked) {
                    checkedInputAmount++;
                }
            }
            return checkedInputAmount;
        }

        if (countCheckedInputAmount() === 0) {
            clearPlantsListBtn.innerHTML = 'Clear Plants List';
        } else if (countCheckedInputAmount() === 1) {
            clearPlantsListBtn.innerHTML = 'Remove Selected Plant';
        } else if (countCheckedInputAmount() > 1) {
            clearPlantsListBtn.innerHTML = `Remove ${countCheckedInputAmount()} Selected Plants`;
        }
    }

    async clearPlantsList(plantsList, clearPlantsListBtn, addPlantBtn, checkInputsList, plantContainersList, plantSelectField,
                          plantNameField, plantDescriptionField, selectPlantBtn) {
        function countCheckedInputAmount() {
            let checkedInputAmount = 0;

            for (let checkInput of checkInputsList) {
                if (checkInput.checked) {
                    checkedInputAmount++;
                }
            }
            return checkedInputAmount;
        }

         if (countCheckedInputAmount() > 0) {
            if (confirm('Are you sure?')) {
                const checkedPlantsIds = [];
                for (let checkInput of checkInputsList) {
                    if (checkInput.checked) {
                        const plantContainer = checkInput.parentNode.parentNode;
                        checkedPlantsIds.push(plantContainer.dataset.id);
                        this.plants = this.plants.filter(plant => plant.id !== plantContainer.dataset.id);
                    }
                }

                await this.model.removeSeveralPlants(checkedPlantsIds);

                for (let i = 0; i < plantContainersList.length; i++) {
                    for (let j = 0; j < checkedPlantsIds.length; j++) {
                        if (plantContainersList[i].dataset.id === checkedPlantsIds[j]) {
                            plantContainersList[i].remove();
                        }
                    }
                }

                plantSelectField.disabled = false;
                plantNameField.disabled = false;
                plantDescriptionField.disabled = false;
                addPlantBtn.disabled = true;
                clearPlantsListBtn.innerHTML = 'Clear Plants List';
                for (let checkInput of checkInputsList) {
                    checkInput.disabled = true;
                }
                selectPlantBtn.innerHTML = 'Select Plants';

                !plantsList.children.length && (clearPlantsListBtn.disabled = true);

                addPlantBtn.nextElementSibling.classList.add('hidden');

                this.countPlantsAmount();
            }
        } else {
            if (confirm('Are you sure?')) {
                await this.model.clearPlantsList();

                clearPlantsListBtn.disabled = true;
                plantsList.innerHTML = '';

                this.countPlantsAmount();

                addPlantBtn.nextElementSibling.classList.add('hidden');
                this.plants.length = 0;
                selectPlantBtn.disabled = true;

                plantSelectField.disabled = false;
                plantNameField.disabled = false;
                plantDescriptionField.disabled = false;
            }
        }
    }

    redirectToPlantInfo(id) {
        location.hash = `#/plant/${id}`;
    }

    async changeLastDate(reminderBtn, plantId) {
        this.plant = this.plants.find(plant => plant.id === plantId);

        if (reminderBtn.classList.contains('plant__watering-btn')) {
            this.plant.wateringLastDate = this.currentDate.string;
            this.plant.msWateringLastDate = this.currentDate.ms;

            if (this.plant.wateringRange !== '') {
                this.plant.msWateringNextDate = this.currentDate.ms + this.plant.wateringRange * 86400000;

            } else if  (this.plant.wateringRange !== '0') {
                    this.plant.msWateringNextDate = this.currentDate.ms + 365 * 86400000;

            } else {
                if (this.currentDate.season === 'winter') {
                    if (this.plant.winterWatering === '0') {
                        this.plant.msWateringNextDate = this.currentDate.ms + 365 * 86400000;
                    } else {
                        this.plant.msWateringNextDate = this.currentDate.ms + this.plant.winterWatering * 86400000;
                    }
                } else if (this.currentDate.season === 'spring') {
                    if (this.plant.springWatering === '0') {
                        this.plant.msWateringNextDate = this.currentDate.ms + 365 * 86400000;
                    } else {
                        this.plant.msWateringNextDate = this.currentDate.ms + this.plant.springWatering * 86400000;
                    }
                } else if (this.currentDate.season === 'summer') {
                    if (this.plant.summerWatering === '0') {
                        this.plant.msWateringNextDate = this.currentDate.ms + 365 * 86400000;
                    } else {
                        this.plant.msWateringNextDate = this.currentDate.ms + this.plant.summerWatering * 86400000;
                    }
                } else if (this.currentDate.season === 'autumn') {
                    if (this.plant.autumnWatering === '0') {
                        this.plant.msWateringNextDate = this.currentDate.ms + 365 * 86400000;
                    } else {
                        this.plant.msWateringNextDate = this.currentDate.ms + this.plant.autumnWatering * 86400000;
                    }
                }
            }

        } else if (reminderBtn.classList.contains('plant__spraying-btn')) {
            this.plant.sprayingLastDate = this.currentDate.string;
            this.plant.msSprayingLastDate = this.currentDate.ms;

            if (this.plant.sprayingRange !== '') {
                this.plant.msSprayingNextDate = this.currentDate.ms + this.plant.sprayingRange * 86400000;

            } else {
                if (this.currentDate.season === 'winter') {
                    this.plant.msSprayingNextDate = this.currentDate.ms + this.plant.winterSpraying * 86400000;

                } else if (this.currentDate.season === 'spring') {
                    this.plant.msSprayingNextDate = this.currentDate.ms + this.plant.springSpraying * 86400000;

                } else if (this.currentDate.season === 'summer') {
                    this.plant.msSprayingNextDate = this.currentDate.ms + this.plant.summerSpraying * 86400000;

                } else if (this.currentDate.season === 'autumn') {
                    this.plant.msSprayingNextDate = this.currentDate.ms + this.plant.autumnSpraying * 86400000;
                }
            }

        } else if (reminderBtn.classList.contains('plant__nutrition-btn')) {
            this.plant.nutritionLastDate = this.currentDate.string;
            this.plant.msNutritionLastDate = this.currentDate.ms;

            if (this.plant.nutritionRange !== '') {
                this.plant.msNutritionNextDate = this.currentDate.ms + this.plant.nutritionRange * 86400000;

            } else {
                if (this.currentDate.season === 'winter') {
                    this.plant.msNutritionNextDate = this.currentDate.ms + this.plant.winterNutrition * 86400000;

                } else if (this.currentDate.season === 'spring') {
                    this.plant.msNutritionNextDate = this.currentDate.ms + this.plant.springNutrition * 86400000;

                } else if (this.currentDate.season === 'summer') {
                    this.plant.msNutritionNextDate = this.currentDate.ms + this.plant.summerNutrition * 86400000;

                } else if (this.currentDate.season === 'autumn') {
                    this.plant.msNutritionNextDate = this.currentDate.ms + this.plant.autumnNutrition * 86400000;
                }
            }

        } else if (reminderBtn.classList.contains('plant__replanting-btn')) {
            this.plant.replantingLastDate = this.currentDate.string;
            this.plant.msReplantingLastDate = this.currentDate.ms;

            if (this.plant.replantingRange !== '') {
                this.plant.msReplantingNextDate = this.currentDate.ms + this.plant.replantingRange * 86400000;

            } else {
                if (this.currentDate.season === 'winter') {
                    this.plant.msReplantingNextDate = this.currentDate.ms + this.plant.winterReplanting * 86400000;

                } else if (this.currentDate.season === 'spring') {
                    this.plant.msReplantingNextDate = this.currentDate.ms + this.plant.springReplanting * 86400000;

                } else if (this.currentDate.season === 'summer') {
                    this.plant.msReplantingNextDate = this.currentDate.ms + this.plant.summerReplanting * 86400000;

                } else if (this.currentDate.season === 'autumn') {
                    this.plant.msReplantingNextDate = this.currentDate.ms + this.plant.autumnReplanting * 86400000;
                }
            }
        }

        await this.model.editPlant(this.plant);

        reminderBtn.disabled = true;
    }

    async removePlant(plantsList, plantContainer, clearPlantsListBtn, addPlantBtn) {
        if (confirm('Are you sure?')) {
            await this.model.removePlant(plantContainer.dataset.id);

            plantContainer.remove();
            !plantsList.children.length && (clearPlantsListBtn.disabled = true);
            addPlantBtn.nextElementSibling.classList.add('hidden');
            this.plants = this.plants.filter(plant => plant.id !== plantContainer.dataset.id);

            this.countPlantsAmount();
        }
    }
}

export default AddAndList;