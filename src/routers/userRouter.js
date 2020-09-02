const User = require("../models/User");
const express = require("express");
const router = new express.Router();


/** Endpoint for user sign up */
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(401).send(e);
  }
});

/** Endpoint for User login */
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.FindByCredentials(req.body.email, req.body.password);
    res.send(user);
  } catch (e) {
    res.status(401).send(e);
  }
});

module.exports = router;