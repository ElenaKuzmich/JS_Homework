const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'), // дает возможность манипулировать файлами на компьютере
    shortId = require('shortid'); // для генерации случайного идентификатора

router.post('/api/user', (req, res) => {
    const usersData = getUsersFromDB(),
        user = req.body;

    user.id = shortId.generate();
    user.error = '';

    usersData.push(user);
    setUsersToDB(usersData);

    res.send(user);
});

router.get('/api/user/active', (req, res) => {
    const usersData = getUsersFromDB(),
        user = usersData.find(user => user.status === 'Active');

    // user ? res.send(user) : res.status(404).send({error: 'User with given status was not found'});
    user ? res.send(user) : res.send({error: 'User with given ID was not found'});
});

router.put('/api/user/:id/passive', (req, res) => {
    const usersData = getUsersFromDB();

    usersData.find(user => user.id === req.params.id).status = 'Passive';

    setUsersToDB(usersData);

    res.sendStatus(204);
});

router.put('/api/user/:username/active', (req, res) => {
    const usersData = getUsersFromDB();

    usersData.find(user => user.username === req.params.username).status = 'Active';

    setUsersToDB(usersData);

    res.sendStatus(204);
});

function getUsersFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.users'), 'utf8'));
}

function setUsersToDB(usersData) {
    fs.writeFileSync(config.get('database.users'), JSON.stringify(usersData));
}

module.exports = router;