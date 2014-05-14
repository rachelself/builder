'use strict';


var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper');        // creates an object with property treeHelper and value fn getClass
var _ = require('lodash');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Builder'});
};

exports.login = (req, res)=>{

  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username:user.username},(e, fobj)=>{ //check for user existing in db

    if(fobj){
      res.send(fobj); // if username is found, return to browser
    }else{
      users.save(user, (e, sobj)=>res.send(sobj)); // if not found, save in db
                                                  // and send to browser
    }

  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);    // req with userId comes in in the body
  var tree = {};                                   // tree object
  tree.height = 0;
  tree.userId = userId;
  tree.isHealthy = true;
  tree.isChopped = false;

  trees.save(tree, (e,obj)=>                       // save the tree
    res.render('game/tree', {trees: obj, treeHelper:treeHelper}, (e, html)=>{  // render a file called tree.jade in the game view folder
      res.send(html);                              // pass it the object (an array of trees)
                                                  // grab html that's rendered so we can do what we want
                                                  // treehelper is in lib > function helpful when rendering jade
  }));
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);

  trees.find({userId:userId}).toArray((e, objs)=>{    // find all the trees with that userId - put in an array
    res.render('game/forest', {trees: objs, treeHelper:treeHelper}, (e, html)=>{  // render forest.jade in game
      res.send(html);

    });
  });

};


exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  trees.findOne({_id:treeId}, (e, tree)=>{              // find that tree in the db
    tree.height += _.random(0, 2);                      // increment the height by random num
    tree.isHealthy = _.random(0, 100) !== 70;           // isHealthy = true if the random num is not 70
    trees.save(tree, (e, count)=>{                      // save the updated tree into trees

      res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e, html)=>{
        res.send(html);                                // re-render tree, send back html

      });

    });
  });

};

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  var userId = Mongo.ObjectID(req.body.userId);

  // var wood;

  trees.findOne({_id:treeId}, (e, tree)=>{

    var wood = tree.height / 2;
    tree.height = 0;                          // should add class .chopped
    tree.isChopped = true;
    //tree.isHealthy = false;                    // should add class .dead
    trees.save(tree, (e, count)=>{


      users.findOne({_id:userId}, (e, user)=>{
        //console.log(user);
        user.wood += wood;
        users.save(user, (e, count)=>{
          //console.log(a,b,c,d);
          res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e, html)=>{

            res.send({html:html, user:user});
            // res.send(user);
          });
        });
      });
    });
  });
};
