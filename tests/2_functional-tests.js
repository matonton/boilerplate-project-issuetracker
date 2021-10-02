const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // TODO write functional tests
  test('an issue with every field', function() {
    chai
      .request(server)
      .post('/api/issues/')
      .end(function(err, res) {
        assert.equal(res.status, 200);

      });
  });
});
