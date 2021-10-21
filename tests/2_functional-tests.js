const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testIssue = '';
suite('Functional Tests', function () {
  suite('POST requests', function () {
    test('an issue with every field', function (done) {
      chai
        .request(server)
        .post('/api/issues/tests')
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
          done();
        });
    });

    test('an issue with only required fields', function (done) {
      chai
        .request(server)
        .post('/api/issues/tests')
        .type('form')
        .send({
          'issue_title': 'Title 1',
          'issue_text': 'Text 1',
          'created_by': 'matonton'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          done();
        });
    });
    test('an issue with missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/issues/tests')
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
          done();
          /* function(err,res){ 
        const p = res.body;
        assert.equal(res.status, 200);
        if(err) { 
          done(err);
        } else { 
          done()
        }
      } */
        });
    });
  });
  suite('GET requests', function () {
    test('view issues on a project', function (done) {
      chai
        .request(server)
        .get('/api/issues/tests')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          done();
        });
    });
    // GET with one filter
    test('view issues on a project with one filter', function (done) {
      chai
        .request(server)
        .get(`/api/issues/tests/?_id=${testIssue}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          // assert.equal(res.body.issue_title, 'no longer true');
          done();
        });
    });

    // GET with multiple filters
    test('view issues on a project with multiple filters', function (done) {
      chai
        .request(server)
        .get(`/api/issues/tests/?_id=${testIssue}&created_by=inco`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          // assert.equal(res.body.issue_title, 'no longer true');
          done();
        });
    });

  });
  suite("PUT requests", function () {
    // PUT to update one field
    test('update one field on an issue', function (done) {
      chai
        .request(server)
        .put('/api/issues/tests/')
        .send({
          '_id': testIssue,
          'issue_text': 'monkeys in a barrel',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, testIssue);
          done();
        });
    });

    // PUT to update multiple fields
    test('update multiple fields on an issue', function (done) {
      chai
        .request(server)
        .put('/api/issues/tests/')
        .send({
          '_id': testIssue,
          'issue_text': 'monkeys in a barrel',
          'assigned_to': 'george'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, testIssue);
          done();
        });
    });

    // PUT to update and issue with missing _id
    test('update with missing _id', function (done) {
      chai
        .request(server)
        .put('/api/issues/tests/')
        .send({
          'issue_text': 'monkeys in a barrel',
          'assigned_to': 'george'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    // PUT to update an issue with no fields to update
    test('update with no update fields', function (done) {
      chai
        .request(server)
        .put('/api/issues/tests/')
        .send({
          '_id': testIssue,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'no update field(s) sent');
          done();
        });
    });

    // PUT to update an issue with an invalid _id
    test('update with invalid _id', function (done) {
      chai
        .request(server)
        .put('/api/issues/tests/')
        .send({
          '_id': '9fbf4ca0d1a786e410b6',
          'issue_text': 'monkeys in a barrel',
          'assigned_to': 'george'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not update');
          done();
        });
    });

  });
  suite("DELETE requests", function () {
    // TODO: DELETE an issue
    test('delete an issue', function (done) {
      chai
        .request(server)
        .delete('/api/issues/tests/')
        .send({
          '_id': testIssue,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
    });


    // TODO: DELETE an issue with an invalid _id
    test('delete an issue with invalid _id', function (done) {
      chai
        .request(server)
        .delete('/api/issues/tests/')
        .send({
          '_id': '6168ef37855ab9fa',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, '6168ef37855ab9fa');
          done();
        });
    });

    // TODO: DELETE an issue with missing _id
    test('delete an issue with missing _id', function (done) {
      chai
        .request(server)
        .delete('/api/issues/tests/')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

  });
});

