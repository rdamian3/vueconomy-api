"use strict";

var Category = require("../models/category");

function addCategory(req, res) {
  var category = new Category({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    author: req.user.userId
  });

  if (category.name !== "" || category.name !== null) {
    category.save(function (err) {
      if (err) {
        if (err.code === 11000) {
          return res.status(500).send("Duplicated category");
        }

        return res.status(500).send({
          message: "Error creating category: ".concat(err)
        });
      }

      return res.status(201).send({
        category: category
      });
    });
  } else {
    res.status(500).send({
      message: "Error creating category"
    });
  }
}

function updateCategory(req, res) {
  var categoryId = req.params.categoryId;
  var update = req.body;
  Category.findByIdAndUpdate(categoryId, update, {
    "new": true
  }, function (err, category) {
    if (err) {
      res.status(500).send({
        message: "Error updating category: ".concat(err)
      });
    } else {
      res.status(200).send({
        category: category
      });
    }
  });
}

function deleteCategory(req, res) {
  var categoryId = req.headers.categoryid;
  Category.findById(categoryId, function (err, category) {
    if (err) {
      res.status(500).send({
        message: "Error deleting category: ".concat(err)
      });
    } else {
      category.remove(function (err) {
        if (err) {
          res.status(500).send({
            message: "Error deleting category: ".concat(err)
          });
        } else {
          res.status(200).send({
            message: "category deleted"
          });
        }
      });
    }
  });
}

function getCategories(req, res) {
  Category.find({
    author: req.user.userId
  }, function (err, categories) {
    if (err) {
      return res.status(500).send({
        message: "Error with the request: ".concat(err)
      });
    }

    res.send(200, {
      categories: categories
    });
  });
}

module.exports = {
  addCategory: addCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,
  getCategories: getCategories
};