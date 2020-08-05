const express = require('express');
const monk = require('monk');
const Joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
const crud = db.get('crud');

const schema = Joi.object({
  name: Joi.string().trim().required(),
  age: Joi.string().trim().required(),
  aka: Joi.string().trim().required(),
});

const router = express.Router();

//read all
router.get('/', async (req, res, next) => {
  try {
    const items = await crud.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// read by id
router.get('/:id',async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await crud.findOne({
      _id: id,
    });
    if (!item) return next();
    return res.json(item);
    
  } catch (error) {
    next(error);
  }

});

// create
router.post('/',async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);
    const inserted = await crud.insert(value);
    res.json(inserted);
  } catch (error) {
    next(error);
    
  }
});

// update by id
router.put('/:id',async (req, res, next) => {
  try {
    const { id } = req.params;
    const value = await schema.validateAsync(req.body);
    const item = await crud.findOne({
      _id: id,
    });
    if (!item) return next();
    await crud.update({
      _id: id,
    }, {
      $set: value,
    });
    res.json(value);
  } catch (error) {
    next(error);
    
  }
});

// delete by id
router.delete('/:id',async (req, res, next) => {
  try {
    const { id } = req.params;
    await crud.remove({ _id: id });
    res.json({
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
