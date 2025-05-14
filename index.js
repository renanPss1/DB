const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const Visita = require('./models/Visita');

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

// Rotas
// visualidados web do banco de dados
 app.get('/lista', function (req, res) {
   Visita.findAll({ raw: true })
     .then(function (visitas) {
       res.render('home', { visitas: visitas });
     })
     .catch(function (erro) {
       res.status(500).send('Erro ao carregar visitas: ' + erro);
     });
 });

// Página inicial
app.get('/', function(req, res) {
  res.render('paginainicial');
});

// Formulário de visitas
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
    res.redirect('/');
  }).catch(function (erro) {
    res.status(500).send('Erro ao salvar a visita: ' + erro);
  });
});

 app.get('/deletar/:id', function (req, res) {
   Visita.destroy({ where: { id: req.params.id } })
     .then(function () {
       
//       res.status(500).send('Visita deletada com sucesso!');
       res.redirect('/lista');
     })
     .catch(function (erro) {
       res.status(500).send('Erro ao deletar a visita: ' + erro);
     });
 });
//     rota get editar carrega os dados preeenchidos pela visita
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

// rota para atualizados os dados do cliente
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
    res.redirect('/lista');
  }).catch((erro) => {
    res.status(500).send('Erro ao atualizar visita: ' + erro);
  });
});


app.listen(3000, function () {
  console.log('Servidor rodando na URL http://localhost:3000');
});

