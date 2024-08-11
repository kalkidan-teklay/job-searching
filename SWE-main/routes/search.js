const express = require('express');
const bodyParser = require('body-parser');
const searchController = require('../controllers/search');
const path = require('path');
const router = express.Router();


router.post('/searchJob', async (req, res) => {
    const department = req.body.department;
    try {
      const result = await searchController.searchJob(department);
      res.json(result);
    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  });

  router.post('/searchUser', async (req, res) => {
    const name = req.body.name;
    try {
        const result = await searchController.searchUser(name);
        res.json(result);
    } catch(error) {
        res.status(500).send(error);
    }
});
module.exports = router;