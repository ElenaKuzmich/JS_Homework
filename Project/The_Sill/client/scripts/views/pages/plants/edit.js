import Component from '../../../views/component';

import Plants from '../../../models/plants';
import Instances from '../../../models/instances';

import EditTemplate from '../../../../templates/pages/plants/edit';
import Error404Template from '../../../../templates/pages/error404';

class Edit extends Component {
    constructor() {
        super();

        this.model = Plants;
    }

    async getData() {
        this.plant = await this.model.getPlant(this.urlParts.id);

        return this.plant;
    }

    async getInstanceData() {
        this.instances = await Instances.getInstancesList();
        this.instance = this.instances.find(instance => instance.commonName === this.plant.commonName);

        return this.instance;
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

    async getAdditionalData() {
        this.plants =  await this.model.getPlantsList();
        this.plants = this.plants.filter(plant => plant.userId === this.user.id);
        return this.plants;
    }

    async render(plant, instance, user, currentDate, plants) {
        let template;

        if (this.isEditEnable()) {
            plant.name = (plant.name === 'No Name') ? '' : plant.name;
            plant.description = (plant.description === 'No Description') ? '' : plant.description;

            template = EditTemplate({plant, instance, user, currentDate, plants});
        } else {
            template =  Error404Template();
        }

        return await template;
    }

    afterRender() {
        this.isEditEnable() && this.setActions();
    }

    isEditEnable() {
        return !this.plant.error &&
               this.plant.status !== 'Done' &&
               !location.hash.split(this.urlParts.action)[1];
    }

    setActions() {
        const plantPhotoGallery = document.getElementsByClassName('plant-edit__gallery')[0],
            photoItemsList = document.getElementsByClassName('plant-edit__photo-item'),
            plantPhoto = document.getElementsByClassName('plant-edit__photo')[0],
            plantNameField = document.getElementsByClassName('plant-edit__name')[0],
            plantDescriptionField = document.getElementsByClassName('plant-edit__description')[0],
            savePlantBtn = document.getElementsByClassName('plant-edit__btn-save')[0],
            noticeSaved = document.getElementsByClassName('plant-edit__saved')[0],
            remindersContainer = document.getElementsByClassName('plant-edit__reminders')[0],
            wateringSettingsHeader = document.getElementsByClassName('plant-edit__watering-set')[0],
            sprayingSettingsHeader = document.getElementsByClassName('plant-edit__spraying-set')[0],
            nutritionSettingsHeader = document.getElementsByClassName('plant-edit__nutrition-set')[0],
            wateringSettingsContainer = document.getElementsByClassName('plant-edit__watering-container')[0],
            sprayingSettingsContainer = document.getElementsByClassName('plant-edit__spraying-container')[0],
            nutritionSettingsContainer = document.getElementsByClassName('plant-edit__nutrition-container')[0];

        plantPhotoGallery.onclick = evt => {
            const target = evt.target,
                targetClassList = target.classList;

            if (targetClassList.contains('plant-edit__photo-item')) {
                this.choosePhoto(target, target.parentNode.previousElementSibling, photoItemsList, savePlantBtn, noticeSaved);
            }
        };

        plantNameField.onkeyup = () => {
            savePlantBtn.disabled = !plantNameField.value.trim();
            noticeSaved.classList.add('hidden');
        };

        plantDescriptionField.onkeyup = () => {
            savePlantBtn.disabled = !plantDescriptionField.value.trim();
            noticeSaved.classList.add('hidden');
        };

        savePlantBtn.onclick = () => this.editPlant(plantPhoto, plantNameField, plantDescriptionField, savePlantBtn, noticeSaved);

        remindersContainer.onkeyup = evt => {
            const target = evt.target,
                targetClassList = target.classList;

            if (targetClassList.contains('range')) {
                target.parentNode.parentNode.parentNode.getElementsByTagName('button')[0].previousElementSibling.classList.add('hidden');
                target.parentNode.parentNode.nextElementSibling.querySelectorAll('input[type=radio]')[0].disabled = false;
            }
        };

        remindersContainer.oninput = evt => {
            const target = evt.target,
                targetClassList = target.classList;

            if (targetClassList.contains('date')) {
                target.parentNode.parentNode.parentNode.getElementsByTagName('button')[0].previousElementSibling.classList.add('hidden');
                target.parentNode.parentNode.nextElementSibling.querySelectorAll('input[type=radio]')[0].disabled = false;
            }
        };

        remindersContainer.onclick = evt => {
            const target = evt.target,
                targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('plant-edit__watering-set'):
                case targetClassList.contains('plant-edit__spraying-set'):
                case targetClassList.contains('plant-edit__nutrition-set'):
                case targetClassList.contains('plant-edit__replanting-set'):
                    target.parentNode.getElementsByTagName('div')[1].classList.toggle('hidden');
                    break;

                case targetClassList.contains('radio'):
                    target.parentNode.parentNode.parentNode.getElementsByTagName('button')[0].disabled = false;
                    break;

                case targetClassList.contains('radio-age'):
                    target.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('button')[0].disabled = false;
                    break;

                case targetClassList.contains('plant-edit__watering-btn-save'):
                    this.wateringReminderEditPlant(target, wateringSettingsContainer.querySelector('input[type=date]'),
                                                    wateringSettingsContainer.querySelector('input[type=text]'),
                                                    wateringSettingsContainer.querySelectorAll('input[type=radio]')[0],
                                                    wateringSettingsContainer.querySelectorAll('input[type=radio]')[1],
                                                    target.previousElementSibling, wateringSettingsHeader.getElementsByTagName('span')[0],
                                                    wateringSettingsContainer);
                    break;

                case targetClassList.contains('plant-edit__spraying-btn-save'):
                    this.sprayingReminderEditPlant(target, sprayingSettingsContainer.querySelector('input[type=date]'),
                                                    sprayingSettingsContainer.querySelector('input[type=text]'),
                                                    sprayingSettingsContainer.querySelectorAll('input[type=radio]')[0],
                                                    sprayingSettingsContainer.querySelectorAll('input[type=radio]')[1],
                                                    target.previousElementSibling, sprayingSettingsHeader.getElementsByTagName('span')[0],
                                                    sprayingSettingsContainer);
                    break;

                case targetClassList.contains('plant-edit__nutrition-btn-save'):
                    this.nutritionReminderEditPlant(target, nutritionSettingsContainer.querySelector('input[type=date]'),
                                                     nutritionSettingsContainer.querySelector('input[type=text]'),
                                                     nutritionSettingsContainer.querySelectorAll('input[type=radio]')[0],
                                                     nutritionSettingsContainer.querySelectorAll('input[type=radio]')[1],
                                                     target.previousElementSibling, nutritionSettingsHeader.getElementsByTagName('span')[0],
                                                     nutritionSettingsContainer);
                    break;

/*
                case targetClassList.contains('plant-edit__replanting-btn-save'):
                    this.replantingReminderEditPlant(target, replantingSettingsContainer.querySelector('input[type=date]'),
                                                    replantingSettingsContainer.querySelector('input[type=text]'),
                                                    target.parentNode.previousElementSibling.querySelectorAll('input[type=radio]')[0],
                                                    target.parentNode.previousElementSibling.querySelectorAll('input[type=radio]')[1],
                                                    target.previousElementSibling, replantingSettingsHeader.getElementsByTagName('span')[0],
                                                    replantingSettingsContainer);
                    break;*/
            }
        };
    }

    choosePhoto(photoItem, plantPhoto, photoItemsList, savePlantBtn, noticeSaved) {
        savePlantBtn.disabled = false;
        let photoItemAttributeSrc = photoItem.getAttribute('src');

        plantPhoto.setAttribute('src', photoItemAttributeSrc);

        for (let item of photoItemsList) {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            }
        }

        photoItem.classList.add('active');
        noticeSaved.classList.add('hidden');
    }

    async editPlant(plantPhoto, plantNameField, plantDescriptionField, savePlantBtn, noticeSaved) {

        this.plant.name = plantNameField.value.trim();
        this.plant.description = plantDescriptionField.value.trim();

        let plantPhotoAttributeSrc = plantPhoto.getAttribute('src'),
            photoTitle = plantPhotoAttributeSrc.split('/').pop();
        console.log(photoTitle); // eslint-disable-line no-console
        this.plant.photoTitle = photoTitle;

        await this.model.editPlant(this.plant);

        savePlantBtn.disabled = true;
        noticeSaved.classList.remove('hidden');
    }

    async wateringReminderEditPlant(saveReminderChangesBtn, wateringLastDateField, wateringRangeField, setReminderRadioBtn,
                                    removeReminderRadioBtn, savedNotice, checkStatusRemainder, wateringSettingsContainer) {
        const wateringLastDateInfo = saveReminderChangesBtn.parentNode.parentNode.parentNode.getElementsByClassName('plant-edit__last-date')[0],
            wateringInterval = saveReminderChangesBtn.parentNode.parentNode.parentNode.getElementsByClassName('plant-edit__interval')[0],
            toBeVerbForm = (this.plant.wateringRange === '1') ? 'is' : 'are',
            dayWordForm = (this.plant.wateringRange === '1') ? 'day' : 'days';

        if (removeReminderRadioBtn.checked) {
            this.plant.checkWateringReminder = 'false';

            removeReminderRadioBtn.checked = false;
            setReminderRadioBtn.disabled = false;
            removeReminderRadioBtn.disabled = true;

            checkStatusRemainder.innerHTML = 'Reminder is not set';
            checkStatusRemainder.setAttribute('class','');

            wateringLastDateInfo.innerHTML = '';
            wateringInterval.innerHTML = '';

            wateringSettingsContainer.classList.add('hidden');

        } else if (setReminderRadioBtn.checked) {
            let wateringLastDate = wateringLastDateField.value.trim(),
                wateringRange = wateringRangeField.value.trim();

            if (wateringLastDate !== '') {
                this.plant.wateringLastDate = wateringLastDate;
            } else {
                if (this.plant.wateringLastDate === '') {
                    this.plant.wateringLastDate = this.currentDate.string;
                    wateringLastDate = this.currentDate.string;
                } else {
                    wateringLastDate = this.plant.wateringLastDate;
                }
            }

            this.plant.wateringRange = wateringRange;
            this.plant.checkWateringReminder = 'true';

            let msWateringLastDate = Date.parse(wateringLastDate),
                msWateringNextDate;

            if (wateringRange !== '') {
                msWateringNextDate = msWateringLastDate + wateringRange * 86400000;
            } else if (wateringRange !== '0') {
                msWateringNextDate = msWateringLastDate + 365 * 86400000;
            } else {
                if (this.currentDate.season === 'winter') {
                    msWateringNextDate = msWateringLastDate + this.instance.winterWatering * 86400000;

                } else if (this.currentDate.season === 'spring') {
                    msWateringNextDate = msWateringLastDate + this.instance.springWatering * 86400000;

                } else if (this.currentDate.season === 'summer') {
                    msWateringNextDate = msWateringLastDate + this.instance.summerWatering * 86400000;

                } else if (this.currentDate.season === 'autumn') {
                    msWateringNextDate = msWateringLastDate + this.instance.autumnWatering * 86400000;
                }
            }

            this.plant.msWateringLastDate = msWateringLastDate;
            this.plant.msWateringNextDate = msWateringNextDate;

            setReminderRadioBtn.checked = false;
            setReminderRadioBtn.disabled = true;
            removeReminderRadioBtn.disabled = false;

            checkStatusRemainder.innerHTML = 'Reminder is set';
            checkStatusRemainder.setAttribute('class','done');

            wateringLastDateInfo.innerHTML = `The set watering last date: <b>${this.plant.wateringLastDate}</b>`;
            wateringInterval.innerHTML = (this.plant.wateringRange === '') ? '' : `The set watering interval ${toBeVerbForm} <b>${this.plant.wateringRange} ${dayWordForm}</b>`;
        }

        savedNotice.classList.remove('hidden');
        saveReminderChangesBtn.disabled = true;

        await this.model.editPlant(this.plant);

        this.clearSettingsFields(wateringLastDateField, wateringRangeField);
    }

    async sprayingReminderEditPlant(saveReminderChangesBtn, sprayingLastDateField, sprayingRangeField, setReminderRadioBtn,
                                    removeReminderRadioBtn, savedNotice, checkStatusRemainder, sprayingSettingsContainer) {
        const sprayingLastDateInfo = saveReminderChangesBtn.parentNode.parentNode.parentNode.getElementsByClassName('plant-edit__last-date')[0],
            sprayingInterval = saveReminderChangesBtn.parentNode.parentNode.parentNode.getElementsByClassName('plant-edit__interval')[0],
            toBeVerbForm = (this.plant.wateringRange === '1') ? 'is' : 'are',
            dayWordForm = (this.plant.wateringRange === '1') ? 'day' : 'days';

        if (removeReminderRadioBtn.checked) {
            this.plant.checkSprayingReminder = 'false';

            removeReminderRadioBtn.checked = false;
            setReminderRadioBtn.disabled = false;
            removeReminderRadioBtn.disabled = true;

            checkStatusRemainder.innerHTML = 'Reminder is not set';
            checkStatusRemainder.setAttribute('class','');

            sprayingLastDateInfo.innerHTML = '';
            sprayingInterval.innerHTML = '';

            sprayingSettingsContainer.classList.add('hidden');

        } else if (setReminderRadioBtn.checked) {
            let sprayingLastDate = sprayingLastDateField.value.trim(),
                sprayingRange = sprayingRangeField.value.trim();

            if (sprayingLastDate !== '') {
                this.plant.sprayingLastDate = sprayingLastDate;
            } else {
                if (this.plant.sprayingLastDate === '') {
                    this.plant.sprayingLastDate = this.currentDate.string;
                    sprayingLastDate = this.currentDate.string;
                } else {
                    sprayingLastDate = this.plant.sprayingLastDate;
                }
            }

            this.plant.sprayingRange = sprayingRange;
            this.plant.checkSprayingReminder = 'true';

            let msSprayingLastDate = Date.parse(sprayingLastDate),
                msSprayingNextDate;

            if (sprayingRange !== '') {
                msSprayingNextDate = msSprayingLastDate + sprayingRange * 86400000;

            } else {
                if (this.currentDate.season === 'winter') {
                    msSprayingNextDate = msSprayingLastDate + this.instance.winterSpraying * 86400000;

                } else if (this.currentDate.season === 'spring') {
                    msSprayingNextDate = msSprayingLastDate + this.instance.springSpraying * 86400000;

                } else if (this.currentDate.season === 'summer') {
                    msSprayingNextDate = msSprayingLastDate + this.instance.summerSpraying * 86400000;

                } else if (this.currentDate.season === 'autumn') {
                    msSprayingNextDate = msSprayingLastDate + this.instance.autumnSpraying * 86400000;
                }
            }

            this.plant.msSprayingLastDate = msSprayingLastDate;
            this.plant.msSprayingNextDate = msSprayingNextDate;

            setReminderRadioBtn.checked = false;
            setReminderRadioBtn.disabled = true;
            removeReminderRadioBtn.disabled = false;

            checkStatusRemainder.innerHTML = 'Reminder is set';
            checkStatusRemainder.setAttribute('class','done');

            sprayingLastDateInfo.innerHTML = `The set watering last date: <b>${this.plant.sprayingLastDate}</b>`;
            sprayingInterval.innerHTML = (this.plant.sprayingRange === '') ? '' : `The set watering interval ${toBeVerbForm} <b>${this.plant.sprayingRange} ${dayWordForm}</b>`;
        }

        savedNotice.classList.remove('hidden');
        saveReminderChangesBtn.disabled = true;

        await this.model.editPlant(this.plant);

        this.clearSettingsFields(sprayingLastDateField, sprayingRangeField);
    }

    async nutritionReminderEditPlant(saveReminderChangesBtn, nutritionLastDateField, nutritionRangeField, setReminderRadioBtn,
                                     removeReminderRadioBtn, savedNotice, checkStatusRemainder, nutritionSettingsContainer) {
        const nutritionLastDateInfo = saveReminderChangesBtn.parentNode.parentNode.parentNode.getElementsByClassName('plant-edit__last-date')[0],
            nutritionInterval = saveReminderChangesBtn.parentNode.parentNode.parentNode.getElementsByClassName('plant-edit__interval')[0],
            toBeVerbForm = (this.plant.wateringRange === '1') ? 'is' : 'are',
            dayWordForm = (this.plant.wateringRange === '1') ? 'day' : 'days';

        if (removeReminderRadioBtn.checked) {
            this.plant.checkNutritionReminder = 'false';

            removeReminderRadioBtn.checked = false;
            setReminderRadioBtn.disabled = false;
            removeReminderRadioBtn.disabled = true;

            checkStatusRemainder.innerHTML = 'Reminder is not set';
            checkStatusRemainder.setAttribute('class','');

            nutritionLastDateInfo.innerHTML = '';
            nutritionInterval.innerHTML = '';

            nutritionSettingsContainer.classList.add('hidden');

        } else if (setReminderRadioBtn.checked) {
            let nutritionLastDate = nutritionLastDateField.value.trim(),
                nutritionRange = nutritionRangeField.value.trim();

            if (nutritionLastDate !== '') {
                this.plant.nutritionLastDate = nutritionLastDate;
            } else {
                if (this.plant.nutritionLastDate === '') {
                    this.plant.nutritionLastDate = this.currentDate.string;
                    nutritionLastDate = this.currentDate.string;
                } else {
                    nutritionLastDate = this.plant.nutritionLastDate;
                }
            }

            this.plant.nutritionRange = nutritionRange;
            this.plant.checkNutritionReminder = 'true';

            let msNutritionLastDate = Date.parse(nutritionLastDate),
                msNutritionNextDate;

            if (nutritionRangeField.value.trim() !== '') {
                msNutritionNextDate = msNutritionLastDate + nutritionRange * 86400000;

            } else {
                if (this.currentDate.season === 'winter') {
                    msNutritionNextDate = msNutritionLastDate + this.instance.winterNutrition * 86400000;

                } else if (this.currentDate.season === 'spring') {
                    msNutritionNextDate = msNutritionLastDate + this.instance.springNutrition * 86400000;

                } else if (this.currentDate.season === 'summer') {
                    msNutritionNextDate = msNutritionLastDate + this.instance.summerNutrition * 86400000;

                } else if (this.currentDate.season === 'autumn') {
                    msNutritionNextDate = msNutritionLastDate + this.instance.autumnNutrition * 86400000;
                }
            }

            this.plant.msNutritionLastDate = msNutritionLastDate;
            this.plant.msNutritionNextDate = msNutritionNextDate;

            setReminderRadioBtn.checked = false;
            setReminderRadioBtn.disabled = true;
            removeReminderRadioBtn.disabled = false;

            checkStatusRemainder.innerHTML = 'Reminder is set';
            checkStatusRemainder.setAttribute('class','done');

            nutritionLastDateInfo.innerHTML = `The set watering last date: <b>${this.plant.nutritionLastDate}</b>`;
            nutritionInterval.innerHTML = (this.plant.nutritionRange === '') ? '' : `The set watering interval ${toBeVerbForm} <b>${this.plant.nutritionRange} ${dayWordForm}</b>`;
        }

        savedNotice.classList.remove('hidden');
        saveReminderChangesBtn.disabled = true;

        await this.model.editPlant(this.plant);

        this.clearSettingsFields(nutritionLastDateField, nutritionRangeField);
    }

    clearSettingsFields(lastDateField, rangeField) {
        lastDateField.value = '';
        rangeField.value = '';
    }
}

export default Edit;