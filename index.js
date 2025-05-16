const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const Visita = require('./models/Visita');
const { Op } = require('sequelize'); // IMPORTAÇÃO NECESSÁRIA PARA BUSCA

// Template engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Página inicial
app.get('/', function(req, res) {
  res.render('paginainicial');
});

// Página de cadastro
app.get('/cad', function(req, res) {
  res.render('formulario');
});

// Página sobre
app.get('/sobre', function(req, res) {
  res.render('sobre');
});

// Página de animais
app.get('/animais', function(req, res) {
  res.render('animais');
});

// Página de "Acessar Formulários" - lista todas as visitas
app.get('/editar', function (req, res) {
  Visita.findAll({ raw: true })
    .then(function (visitas) {
      res.render('home', { visitas: visitas });
    })
    .catch(function (erro) {
      res.status(500).send('Erro ao carregar visitas: ' + erro);
    });
});

// Rota de busca por nome ou CPF
app.get('/buscar', function (req, res) {
  const termo = req.query.q || '';

  Visita.findAll({
    where: {
      [Op.or]: [
        { nome: { [Op.like]: `%${termo}%` } },
        { cpf: { [Op.like]: `%${termo}%` } }
      ]
    },
    raw: true
  })
  .then(function (visitas) {
    res.render('home', {
      visitas: visitas,
      query: termo
    });
  })
  .catch(function (erro) {
    res.status(500).send('Erro na busca: ' + erro);
  });
});

// Rota antiga de listagem (ainda mantida se quiser usar)
app.get('/lista', function (req, res) {
  Visita.findAll({ raw: true })
    .then(function (visitas) {
      res.render('home', { visitas: visitas });
    })
    .catch(function (erro) {
      res.status(500).send('Erro ao carregar visitas: ' + erro);
    });
});

// Adiciona nova visita
app.post('/add', function (req, res) {
  Visita.create({
    nome: req.body.nome,
    email: req.body.email,
    numeroCelular: req.body.numeroCelular,
    cpf: req.body.cpf,
    animal: req.body.animal,
    dataVisita: req.body.dataVisita,
    horaVisita: req.body.horaVisita
  }).then(function () {
    // Redireciona para a página de "INICIO"
    res.redirect('/');
  }).catch(function (erro) {
    res.status(500).send('Erro ao salvar a visita: ' + erro);
  });
});

// Deletar visita
app.get('/deletar/:id', function (req, res) {
  Visita.destroy({ where: { id: req.params.id } })
    .then(function () {
      res.redirect('/editar');
    })
    .catch(function (erro) {
      res.status(500).send('Erro ao deletar a visita: ' + erro);
    });
});

// Carregar formulário de edição
app.get('/editar/:id', function (req, res) {
  Visita.findByPk(req.params.id)
    .then(function (visita) {
      if (visita) {
        res.render('editar', { visita: visita });
      } else {
        res.status(404).send('Visita não encontrada.');
      }
    })
    .catch(function (erro) {
      res.status(500).send('Erro ao buscar visita: ' + erro);
    });
});

// Atualizar dados da visita
app.post('/atualizar/:id', function (req, res) {
  Visita.update({
    nome: req.body.nome,
    email: req.body.email,
    numeroCelular: req.body.numeroCelular,
    cpf: req.body.cpf,
    animal: req.body.animal,
    dataVisita: req.body.dataVisita,
    horaVisita: req.body.horaVisita
  }, {
    where: { id: req.params.id }
  }).then(() => {
    res.redirect('/editar');
  }).catch((erro) => {
    res.status(500).send('Erro ao atualizar visita: ' + erro);
  });
});

// Iniciar servidor
app.listen(3000, function () {
  console.log('Servidor rodando na URL http://localhost:3000');
});
