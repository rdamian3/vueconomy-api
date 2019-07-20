'use strict';

const Category = require('../models/category');

function addCategory(req, res) {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    author: req.body.userId
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

function updateCategory(req, res) {
  let categoryId = req.params.categoryId;
  let update = req.body;

  Category.findByIdAndUpdate(
    categoryId,
    update,
    { new: true },
    (err, category) => {
      if (err) {
        res.status(500).send({ message: `Error updating category: ${err}` });
      } else {
        res.status(200).send({ category });
      }
    }
  );
}

function deleteCategory(req, res) {
  let categoryId = req.params.categoryId;

  Category.findById(categoryId, (err, category) => {
    if (err) {
      res.status(500).send({ message: `Error deleting category: ${err}` });
    } else {
      category.remove(err => {
        if (err) {
          res.status(500).send({ message: `Error deleting category: ${err}` });
        } else {
          res.status(200).send({ message: 'category deleted' });
        }
      });
    }
  });
}

function getCategories(req, res) {
  Category.find({ author: req.param('userId') }, (err, categories) => {
    if (err) {
      return res
        .status(500)
        .send({ message: `Error with the request: ${err}` });
    }
    res.send(200, { categories });
  });
}

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories
};
