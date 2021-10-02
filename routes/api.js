'use strict';

module.exports = function (app) {
  // set up MongoDB infrastructure
  const mongoose = require('mongoose');
  mongoose.connect('mongodb+srv://hoopla:XxfQnridOJlUHvkC@cluster0.jk4rw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

  const { Schema } = mongoose;

  // build schema
  var issueSchema = new mongoose.Schema({
    assigned_to: String,
    status_text: String,	
    open:	Boolean,
    issue_title: String,
    issue_text: String,
    created_by: String,	
    created_on:	{ type: Date, default: Date.now },
    updated_on:	{ type: Date, default: Date.now }
  });

  // build model
  var IssueModel = mongoose.model('IssueModel', issueSchema);

  app.route('/api/issues/:project')

    .get(function (req, res){
      // capture project name, will be 'apitest'
      let project = req.params.project;
      
      // GET route that returns all data /api/issues/apitest
      // perform a query on mongoDB, with no parameters
      var issues = IssueModel.find({}, function (err, result) {
        if (err) return console.error(err);
        // console.log(result);
        res.json(result);
      });

      // TODO: can filter using standard query
      // can use parameters to limit in # of records in search
      // use req.query to access these
      var qFrom, qTo, qLimit;
      if (req.query.from) {
        qFrom = new Date(req.query.from);
      } else {
        qFrom = new Date(1900, 0);
      };
      if (req.query.to) {
        qTo = new Date(req.query.to);
      } else {
        qTo = new Date();

/*       IssueModel.findById({ _id: req.params._id }, function (err, result) {
      if (err) console.error(err);
      // must include count property
      var filtered = result.log.filter(function (e, i, a) {
        var exDate = new Date(e.date);
        return exDate >= qFrom && exDate <= qTo;
      });
      if (req.query.limit) {
        filtered = filtered.slice(0, req.query.limit);
      }
      //res.json({ _id: result._id, username: result.username, count: result.log.length, log: filtered });
      res.json(result);
      }) */
    };


    })
    
    .post(function (req, res){
      let project = req.params.project;
      // missing required fields, returns error: required field(s) missing
      if ( !req.body.issue_title || !req.body.issue_text || !req.body.created_by ) {
        res.json({ error: 'required field(s) missing' });
        return;

      }

      // submit create form data, returns created object
      // create document for new user based on form data
      var newIssue = new IssueModel({ 
        assigned_to: req.body.assigned_to, 
        status_text: req.body.status_text,	
        open:	true,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by
        //updated_on:	"",
        // created_on:	{ type: Date, default: Date.now },
      });
      newIssue.save(function (err) {
        if (err) return console.error(err);
      });
      console.log(newIssue._id);
      var _id = newIssue._id;

      res.json({ assigned_to: newIssue.assigned_to,
        status_text: newIssue.status_text,
        open: newIssue.open,
        _id: newIssue._id,
        issue_title: newIssue.issue_title,
        issue_text: newIssue.issue_text,
        created_by: newIssue.created_by,
        created_on: newIssue.created_on,
        updated_on: newIssue.updated_on
      });
    })
    
    .put(function (req, res){
      let project = req.params.project;
      // handle errors for incorrect submissions
      if (!req.body._id) return res.json({ error: 'missing _id' });
      if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text) return res.json({ error: 'no update field(s) sent' })

      // TODO: add update params after _id
      // ex) Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true }, function(err, person)...
      IssueModel.findOneAndUpdate({ _id: req.body._id }, issue_title : req.body.issue_title , function(err, result) {
       // handle error when cannot update
      if (err) {
          console.log(err);
          return res.json({ error: 'could not update' , '_id' : req.body._id });
        };
        if (!result) return res.json({ error : 'could not update', '_id' : req.body._id });
        // submit update form data, returns success json
        res.json({ result: 'successfully updated', '_id': req.body._id })
      });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      // handle errors for incorrect submission
      if ( !req.body._id ) return res.json({ error: 'missing _id' });
  
      // delete request, returns success or failure
      console.log(req.body);
      IssueModel.findOneAndRemove({ _id: req.body._id }, function(err, result) {
        if (err) {
          console.log(err);
          return res.json({ error: 'could not delete' , '_id' : req.body._id });
        };
        if (!result) return res.json({ error : 'could not delete', '_id' : req.body._id });
        res.json({ result : 'successfully deleted', '_id': req.body._id });
      });

    });
    
};
