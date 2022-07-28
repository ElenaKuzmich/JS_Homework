const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'); // дает возможность манипулировать файлами на компьютере

router.get('/api/users', (req, res) => res.send(fs.readFileSync(config.get('database.users'), 'utf8')));

router.delete('/api/users', (req, res) => {
    fs.writeFileSync(config.get('database.users'), JSON.stringify([]));

    res.sendStatus(204);
});

module.exports = router;
