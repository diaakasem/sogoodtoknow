
const _ = require('lodash');
const yahoo = require('./node/yahoo');
const Yahoo = new yahoo.Yahoo();
const twitter = require('./node/twitter');
const Twitter = new twitter.Twitter();
const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const db = require('./node/db');
const {Manager} = require('./node/youwiki');
const mongoose = require('mongoose');

var deleteFolderRecursive = function(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      const curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(path);
  }
};


const projectsPath = path.join(__dirname, 'app', 'projects');

const express = require("express");
const busboy = require('express-busboy');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const app = express();
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/app'));
const bodyParserConfig = {
  limit: '999kb',
  extended: true,
  parameterLimit: 5000000
};
app.use(bodyParser.json(bodyParserConfig));
app.use(bodyParser.urlencoded(bodyParserConfig));
app.use(errorHandler());
app.engine('html', require('ejs').renderFile);
app.set('db connect string', 'mongodb://localhost/dwikia');
db.config(app);
const ProjectModel = mongoose.model('Project');

app.get('/wikipedia/build/:name', (req, res)=> res.json({ hello: 'world' }));


const m = new Manager();

const end = (req, res)=>
  function(meta){
    if (meta === 'error') { return res.json({result: "error"}); }
    meta.status = 'created';
    let project = new ProjectModel();
    project = _.extend(project, meta);
    return project.save(function(err, obj){
      if (err) { return res.json({"error": err}); }
      console.log("Returning result...");
      return res.json({result: "done"});});
  }
;

app.post('/build/url/', function(req, res){
  const { url } = req.body;
  return m.run(url, end(req, res));
});

app.post('/build/random/', (req, res)=> m.run('random', end(req, res)));

app.post('/build/today/', (req, res)=> m.run(null, end(req, res)));

app.post('/project/', function(req, res){
  //name = req.body.name
  const { status } = req.body;
  //projects = fs.readdirSync(projectsPath)
  return ProjectModel.find({status}, (err, list)=> {
    res.status(200).send(list);
  });
});

app.delete('/project/id/:id', function(req, res){
  const { id } = req.params;
  return ProjectModel.remove({_id: id}, (err, project)=> res.json(project));
});

app.delete('/project/:name', function(req, res){
  const { name } = req.params;
  return ProjectModel.remove({name}, function(err, project){
    deleteFolderRecursive(path.join('app', 'projects', name));
    return res.json(project);
  });
});

app.post('/project/:id', function(req, res){
  const { status } = req.body;
  return ProjectModel.update({_id: req.params.id}, {status}, (err, project)=> res.json(project));
});

app.get('/project/:id', function(req, res){
  const { id } = req.params;
  return ProjectModel.findOne({_id: id}, (err, project)=> res.json(project));
});

app.get('/trends/:name', function(req, res){
  const { name } = req.params;
  return Twitter.placeTrends(name, function(err, obj){
    console.log(obj);
    return res.send(obj);
  });
});

//app.get '/trends/:name', (req, res)->
  //name = req.params.name
  //console.log name
  //Yahoo.woeid  name, (err, woeid)->
    //if err
      //return console.error 'Error yahoo', err
    //Twitter.trendsFor woeid, (err, obj)->
      //console.log obj
      //res.send obj


app.listen(4000);
