const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'); // дает возможность манипулировать файлами на компьютере

router.get('/api/plants', (req, res) => res.send(fs.readFileSync(config.get('database.plants'), 'utf8')));

router.delete('/api/plants', (req, res) => {
    fs.writeFileSync(config.get('database.plants'), JSON.stringify([]));

    res.sendStatus(204);
});

router.delete('/api/plants/several', (req, res) => {
    let plantsData = getPlantsFromDB(),
        checkedPlantsIds = req.body;

    for (let i = 0; i < checkedPlantsIds.length; i++) {
        plantsData = plantsData.filter(plant => plant.id !== checkedPlantsIds[i]);
    }

    setPlantsToDB(plantsData);

    res.sendStatus(204);
});

function getPlantsFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.plants'), 'utf8'));
}

function setPlantsToDB(plantsData) {
    fs.writeFileSync(config.get('database.plants'), JSON.stringify(plantsData));
}

module.exports = router;
