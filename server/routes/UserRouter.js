const { Router } = require("express");
const { User } = require("../models/sequelize");
const { prettifyValidationErrors } = require("../lib/utils");

const router = Router();

router.get("/", (request, response) => {
  User.findAll({ where: request.query })
    .then((data) => response.json(data))
    .catch((e) => response.sendStatus(500));
});
router.post("/", (req, res) => {
  new User(req.body)
    .save()
    .then((data) => res.status(201).json(data))
    .catch((e) => {
      if (e.name === "SequelizeValidationError") {
        console.error(e);
        res.status(400).json(prettifyValidationErrors(e.errors));
      } else {
        console.log(e);
        res.sendStatus(500);
      }
    });
});
router.get("/:id", (request, response) => {
  const { id } = request.params;
  User.findByPk(id)
    .then((data) =>
      data === null ? response.sendStatus(404) : response.json(data)
    )
    .catch((e) => response.sendStatus(500));
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  User.update(req.body, {
    where: { id },
    returning: true,
    individualHooks: true,
  })
    .then(([, [data]]) =>
      data !== undefined ? res.status(200).json(data) : res.sendStatus(404)
    )
    .catch((e) => {
      if (e.name === "SequelizeValidationError") {
        res.status(400).json(prettifyValidationErrors(e.errors));
      } else {
        res.sendStatus(500);
      }
    });
});
router.delete("/:id", (request, response) => {
  const { id } = request.params;
  User.destroy({ where: { id } })
    .then((data) =>
      data === 0 ? response.sendStatus(404) : response.sendStatus(204)
    )
    .catch((e) => response.sendStatus(500));
});

module.exports = router;
