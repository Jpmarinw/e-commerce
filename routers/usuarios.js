const { Usuario } = require("../models/usuario");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// TRAZER A LISTA DE USUÁRIOS
router.get(`/`, async (req, res) => {
  const usuarioList = await Usuario.find().select('-passwordHash');

  if (!usuarioList) {
    res.status(500).json({ sucess: false });
  }
  res.send(usuarioList);
});

// TRAZER USUÁRIO PELO ID
router.get("/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).select('-passwordHash');

  if (!usuario) {
    res.status(500).json({
      message: "O usuário com o ID informado não foi encontrado",
    });
  }
  res.status(200).send(usuario);
});

// ADICIONAR USUÁRIOS
router.post("/", async (req, res) => {
  let usuario = new Usuario({
    nome: req.body.nome,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.senha, 10),
    telefone: req.body.telefone,
    isAdmin: req.body.isAdmin,
    rua: req.body.rua,
    cep: req.body.cep,
    casa: req.body.casa,
    cidade: req.body.cidade,
    pais: req.body.pais,
  });

  usuario = await usuario.save();

  if (!usuario) return res.status(404).send("O usuário não foi criada!");
  res.send(usuario);
});

// ALTERAR UM USUÁRIO
router.put("/:id", async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(
    req.params.id,
    {
      nome: req.body.nome,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.senha, 10),
      telefone: req.body.telefone,
      isAdmin: req.body.isAdmin,
      rua: req.body.rua,
      cep: req.body.cep,
      casa: req.body.casa,
      cidade: req.body.cidade,
      pais: req.body.pais,
    },
    { new: true }
  );
  if (!usuario) return res.status(400).send("O usuário não foi criado!");
  res.send(usuario);
});

module.exports = router;
