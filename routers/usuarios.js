const { Usuario } = require("../models/Usuario");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const usuarioList = await Usuario.find();

  if (!usuarioList) {
    res.status(500).json({ sucess: false });
  }
  res.send(usuarioList);
});

module.exports = router;
