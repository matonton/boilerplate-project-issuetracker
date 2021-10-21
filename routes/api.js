'use strict';

module.exports = function (app) {
  // set up MongoDB infrastructure
  const mongoose = require('mongoose');
  console.log(process.env.MONGO_DB);
  mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

  const { Schema } = mongoose;

  // build schema
  var issueSchema = new mongoose.Schema({
    assigned_to: { type: String, default: '' },
    status_text: { type: String, default: '' },
    open: Boolean,
    issue_title: String,
    issue_text: String,
    created_by: String,
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    // TODO: update to include project filtering
    project: String
  });

  // build model
  var IssueModel = mongoose.model('IssueModel', issueSchema);

  app.route('/api/issues/:project')

    app.route('/api/issues/:project')

    .get(function (req, res) {
      // capture project name, will be 'apitest'
      let project = req.params.project;

      // GET route that returns all data /api/issues/apitest
      if (!req.query) {
        // perform a query on mongoDB, with no parameters
        var issues = IssueModel.find({ project: project }, 'assigned_to _id status_text open issue_title issue_text created_by created_on updated_on', function (err, result) {
          if (err) return console.error(err);
          // console.log(result);
          return res.json(result);
        });
      };

      // can filter using standard query
      // filter results using filter after returning all
      // use req.query to access

      console.log(req.query, typeof req.query);
      // identify queries submitted
      let properties = ["assigned_to", "_id", "status_text", "open", "issue_title", "issue_text", "created_by", "created_on", "updated_on"];
      let queries = Object.keys(req.query);
      // for valid queries, add to filter stack
      let pass = queries.filter(function (e, i, a) {
        // console.log(e, properties.includes(e));
        return properties.includes(e);
      });
      console.log(pass);

      // create new object with passing properties and values
      let query = { project: project };

      pass.forEach(function (e, i, a) {
        console.log(e, typeof e, req.query[e], typeof req.query[e]);
        // Object.defineProperty(query, e, { value: req.query[e] });
        query[e] = req.query[e];
      });

      console.log(query);

      // new MongoDB query using properties in new object
      var filtered = IssueModel.find(query, function (err, result) {
        if (err) return console.error(err);
        // console.log(result);
        return res.json(result);
      });

      // return on overall issues find mongo query
      // return res.json(filtered);

    })

    .post(function (req, res) {
      let project = req.params.project;
      // missing required fields, returns error: required field(s) missing
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json({ error: 'required field(s) missing' });
        return;

      }

      // submit create form data, returns created object
      // create document for new user based on form data
      var newIssue = new IssueModel({
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        open: true,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        project: project
        // updated_on:	"",
        // created_on:	{ type: Date, default: Date.now },
      });
      newIssue.save(function (err) {
        if (err) return console.error(err);
      });
      console.log(newIssue._id);
      var _id = newIssue._id;

      res.json({
        assigned_to: newIssue.assigned_to,
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

    .put(function (req, res) {
      let project = req.params.project;
      // handle errors for incorrect submissions
      console.log(req.body);
      if (!req.body._id) return res.json({ error: 'missing _id' });
      /* if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text) return res.json({ error: 'no update field(s) sent' }) */
      try { 
          if(Object.keys(req.body).length == 1) { 
            return res.json({error: 'no update field(s) sent', _id: req.body._id})
          }
        } catch(err) { 
            return res.json({ error: 'could not update', _id: req.body._id})
        }
      // TOFIX: change to findOneAndUpdate?
      // add update params after _id
      // ex Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true }, function(err, person)...
      let updates = {  };
      if (req.body.issue_title) updates.issue_title = req.body.issue_title;
      if (req.body.issue_text) updates.issue_text = req.body.issue_text;
      if (req.body.created_by) updates.created_by = req.body.created_by;
      if (req.body.assigned_to) updates.assigned_to = req.body.assigned_to;
      if (req.body.status_text) updates.status_text = req.body.status_text;
      if (req.body.open) updates.open = false;
      updates.updated_on = Date.now();
      
      IssueModel.findOneAndUpdate({ _id: req.body._id, project: project }, updates, function (err, result) {
        // handle error when cannot update
        if (err) {
          console.log(err);
          return res.json({ error: 'could not update', '_id': req.body._id });
        };
        if (!result) return res.json({ error: 'could not update', '_id': req.body._id });
        // submit update form data, returns success json
        return res.json({ result: 'successfully updated', '_id': req.body._id });
          // done(null, updatedIssue);  
        
        
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      // handle errors for incorrect submission
      if (!req.body._id) return res.json({ error: 'missing _id' });

      // delete request, returns success or failure
      console.log(req.body);
      IssueModel.findOneAndRemove({ _id: req.body._id, project: project }, function (err, result) {
        if (err) {
          console.log(err);
          return res.json({ error: 'could not delete', '_id': req.body._id });
        };
        if (!result) return res.json({ error: 'could not delete', '_id': req.body._id });
        res.json({ result: 'successfully deleted', '_id': req.body._id });
      });

    });

};
