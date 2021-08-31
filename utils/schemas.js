const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports.usersSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().required(),
  phone1: Joi.string().required(),
  phone2: Joi.string().required(),
  password: Joi.string().required(),
}).required();
