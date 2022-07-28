const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'), // дает возможность манипулировать файлами на компьютере
    shortId = require('shortid'); // для генерации случайного идентификатора

router.post('/api/instance', (req, res) => {
    const instancesData = getInstancesFromDB(),
        instance = req.body;

    instance.id = shortId.generate();

    instancesData.push(instance);
    setInstancesToDB(instancesData);

    res.send(instance);
});

router.get('/api/instance/:id', (req, res) => {
    const instancesData = getInstancesFromDB(),
        instance = instancesData.find(instance => instance.id === req.params.id);

    instance ? res.send(instance) : res.status(404).send({error: 'Instance with given ID was not found'});
});

function getInstancesFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.instances'), 'utf8'));
}

function setInstancesToDB(instancesData) {
    fs.writeFileSync(config.get('database.instances'), JSON.stringify(instancesData));
}

module.exports = router;