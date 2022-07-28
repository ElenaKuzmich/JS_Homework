const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'),
    shortId = require('shortid');

router.post('/api/plant', (req, res) => {
    const plantsData = getPlantsFromDB(),
        plant = req.body;

    plant.id = shortId.generate();
    plant.name = plant.name.trim() || 'No Name';
    plant.description = plant.description.trim() || 'No Description';
    plant.status = 'In Progress';

    plant.checkWateringReminder = 'false';
    plant.checkSprayingReminder = 'false';
    plant.checkNutritionReminder = 'false';
    plant.checkReplantingReminder = 'false';

    plant.wateringLastDate = '';
    plant.msWateringLastDate = '';
    plant.msWateringNextDate = '';
    plant.wateringRange = '';

    plant.sprayingLastDate = '';
    plant.msSprayingLastDate = '';
    plant.msSprayingNextDate = '';
    plant.sprayingRange = '';

    plant.nutritionLastDate = '';
    plant.msNutritionLastDate = '';
    plant.msNutritionNextDate = '';
    plant.nutritionRange = '';

    plant.replantingLastDate = '';
    plant.msReplantingLastDate = '';
    plant.msReplantingNextDate = '';
    plant.replantingRange = '';

    plant.age = 'grown';
    plant.height = '';

    // plant.msCurrentDate = '';

    plantsData.unshift(plant);
    setPlantsToDB(plantsData);

    res.send(plant);
});

router.get('/api/plant/:id', (req, res) => {
    const plantsData = getPlantsFromDB(),
        plant = plantsData.find(plant => plant.id === req.params.id);

    plant ? res.send(plant) : res.status(404).send({error: 'Plant with given ID was not found'});
});

router.put('/api/plant/:id', (req, res) => {
    const plantsData = getPlantsFromDB(),
        plant = plantsData.find(plant => plant.id === req.params.id),
        updatedPlant = req.body;

    plant.name = updatedPlant.name || 'No Name';
    plant.description = updatedPlant.description || 'No Description';
    plant.photoTitle = updatedPlant.photoTitle;

    plant.checkWateringReminder = updatedPlant.checkWateringReminder;
    plant.checkSprayingReminder = updatedPlant.checkSprayingReminder;
    plant.checkNutritionReminder = updatedPlant.checkNutritionReminder;
    plant.checkReplantingReminder = updatedPlant.checkReplantingReminder;

    plant.wateringLastDate = updatedPlant.wateringLastDate;
    plant.msWateringLastDate = updatedPlant.msWateringLastDate;
    plant.msWateringNextDate = updatedPlant.msWateringNextDate;
    plant.wateringRange = updatedPlant.wateringRange;

    plant.sprayingLastDate = updatedPlant.sprayingLastDate;
    plant.msSprayingLastDate = updatedPlant.msSprayingLastDate;
    plant.msSprayingNextDate = updatedPlant.msSprayingNextDate;
    plant.sprayingRange = updatedPlant.sprayingRange;

    plant.nutritionLastDate = updatedPlant.nutritionLastDate;
    plant.msNutritionLastDate = updatedPlant.msNutritionLastDate;
    plant.msNutritionNextDate = updatedPlant.msNutritionNextDate;
    plant.nutritionRange = updatedPlant.nutritionRange;

    plant.replantingLastDate = updatedPlant.replantingLastDate;
    plant.msReplantingLastDate = updatedPlant.msReplantingLastDate;
    plant.msReplantingNextDate = updatedPlant.msReplantingNextDate;
    plant.replantingRange = updatedPlant.replantingRange;

    plant.age = updatedPlant.age;
    plant.height = updatedPlant.height;

    setPlantsToDB(plantsData);

    res.sendStatus(204);
});

router.put('/api/plant/:id/done', (req, res) => {
    const plantsData = getPlantsFromDB();

    plantsData.find(plant => plant.id === req.params.id).status = 'Done';

    setPlantsToDB(plantsData);

    res.sendStatus(204);
});

router.delete('/api/plant/:id', (req, res) => {
    const plantsData = getPlantsFromDB(),
        updatedData = plantsData.filter(plant => plant.id !== req.params.id);

    setPlantsToDB(updatedData);

    res.sendStatus(204);
});

function getPlantsFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.plants'), 'utf8'));
}

function setPlantsToDB(plantsData) {
    fs.writeFileSync(config.get('database.plants'), JSON.stringify(plantsData));
}

module.exports = router;