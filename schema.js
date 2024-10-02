const Joi = require("joi");

module.exports.blogSchema = Joi.object({
  blog: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null),
    }),
  }).required(),
});