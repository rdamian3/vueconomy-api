'use strict';

const Category = require('../models/category');

function addCategory(req, res) {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image
  });

  if (category.name != '' || category.name != null) {
    category.save(err => {
      if (err) {
        if (err.code == 11000) {
          return res.status(500).send('Duplicated category');
        }
        return res.status(500).send({
          message: `Error creating category: ${err}`
        });
      } else {
        return res.status(201).send({ category });
      }
    });
  } else {
    res.status(500).send({
      message: 'Error creating category'
    });
  }
}

module.exports = {
  addCategory
};
