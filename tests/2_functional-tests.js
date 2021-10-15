const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// TODO write functional tests
let testIssue = '';
suite('Functional Tests', function () {
  suite('POST requests', function () {
    test('an issue with every field', function () {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
          'assigned_to': 'Mark',
          'status_text': 'Cool',
          'issue_title': 'Title',
          'issue_text': 'Text',
          'created_by': 'matonton'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, 'Title');
          testIssue = res.body._id;
        });
    });

    test('an issue with only required fields', function () {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
          'issue_title': 'Title 1',
          'issue_text': 'Text 1',
          'created_by': 'matonton'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
        });
    });
    test('an issue with missing required fields', function () {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .type('form')
        .send({
          'issue_title': 'Title 2',
          'issue_text': 'Text 2',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          // console.log(res);
          assert.equal(res.body.error, 'required field(s) missing');
        });
    });
  });
  suite('GET requests', function () {
    test('view issues on a project', function () {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
        });
    });
    // GET with one filter
    test('view issues on a project with one filter', function () {
      chai
        .request(server)
        .get('/api/issues/apitest/?_id=61569f03c1199b97983e44ed')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, 'no longer true');
        });
    });

    // GET with multiple filters
    test('view issues on a project with multiple filters', function () {
      chai
        .request(server)
        .get('/api/issues/apitest/?_id=61569f03c1199b97983e44ed&created_by=inco')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, 'no longer true');
        });
    });

  });
  suite("PUT requests", function () {
    // PUT to update one field
    test('update one field on an issue', function () {
      chai
        .request(server)
        .put('/api/issues/apitest/')
        .send({
          '_id': '61569f03c1199b97983e44ed',
          'issue_text': 'monkeys in a barrel',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, '61569f03c1199b97983e44ed');
        });
    });

    // PUT to update multiple fields
    test('update multiple fields on an issue', function () {
      chai
        .request(server)
        .put('/api/issues/apitest/')
        .send({
          '_id': '61569f03c1199b97983e44ed',
          'issue_text': 'monkeys in a barrel',
          'assigned_to': 'george'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, '61569f03c1199b97983e44ed');
        });
    });

    // PUT to update and issue with missing _id
    test('update with missing _id', function () {
      chai
        .request(server)
        .put('/api/issues/apitest/')
        .send({
          'issue_text': 'monkeys in a barrel',
          'assigned_to': 'george'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
        });
    });

    // PUT to update an issue with no fields to update
    test('update with no update fields', function () {
      chai
        .request(server)
        .put('/api/issues/apitest/')
        .send({
          '_id': '61569f03c1199b97983e44ed',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'no update field(s) sent');
        });
    });

    // PUT to update an issue with an invalid _id
    test('update with invalid _id', function () {
      chai
        .request(server)
        .put('/api/issues/apitest/')
        .send({
          '_id': '61569f03c1',
          'issue_text': 'monkeys in a barrel',
          'assigned_to': 'george'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not update');
        });
    });

  });
  suite("DELETE requests", function () {
    // TODO: DELETE an issue
    test('delete an issue', function () {
      chai
        .request(server)
        .delete('/api/issues/apitest/')
        .send({
          '_id': testIssue,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully deleted');
        });
    });


    // TODO: DELETE an issue with an invalid _id
    test('delete an issue with invalid _id', function () {
      chai
        .request(server)
        .delete('/api/issues/apitest/')
        .send({
          '_id': '6168ef37855ab9fa',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, '6168ef37855ab9fa');
        });
    });

    // TODO: DELETE an issue with missing _id
    test('delete an issue with missing _id', function () {
      chai
        .request(server)
        .delete('/api/issues/apitest/')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
        });
    });

  });
});

