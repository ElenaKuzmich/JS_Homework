const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'); // дает возможность манипулировать файлами на компьютере

router.get('/api/instances', (req, res) => res.send(fs.readFileSync(config.get('database.instances'), 'utf8')));

router.delete('/api/instances', (req, res) => {
    fs.writeFileSync(config.get('database.instances'), JSON.stringify([]));

    res.sendStatus(204);
});

module.exports = router;
