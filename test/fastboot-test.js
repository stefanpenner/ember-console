const assert = require('chai').assert;
const fastbootConsole = require('../lib/utils/fastboot-console');

const DIST_PATH = 'dist';

describe('FastBoot Console', function() {
  it('should throw error if dist path is not defined', function() {
    return fastbootConsole('non-existent-path')
      .catch(function(error) {
        assert.include(error.message, 'Couldn\'t find');
      });
  });

  it('should return fastboot console API when dist path is correctly defined', function() {
    return fastbootConsole(DIST_PATH).then(function(data) {
      assert.isDefined(data.app);
      assert.isDefined(data.response);
      assert.isDefined(data.fastbootConsoleApi);
    });
  });

  describe('API', function() {
    var fastbootConsoleApi;

    beforeEach(function() {
      return fastbootConsole(DIST_PATH).then(function(data) {
        fastbootConsoleApi = data.fastbootConsoleApi;
      });
    });

    it('should define dist property correctly', function() {
      assert.equal(fastbootConsoleApi.dist, DIST_PATH);
    });

    it('should return html content of the request correctly', function() {
      return fastbootConsoleApi.html.then(function(result) {
        assert.include(result, 'You’ve officially spun up your very first Ember app :-)');
      });
    });

    it('should get current url', function() {
      assert.equal(fastbootConsoleApi.currentURL, '/');
    });

    it('should get all routes of the app', function() {
      const expectedRoutes = [ 'application_loading',
        'application_error',
        'loading',
        'error',
        'index_loading',
        'index_error',
        'index',
        'application'
      ];
      assert.deepEqual(fastbootConsoleApi.routes, expectedRoutes);
    });

    it('should get the rootElement', function() {
      assert.isDefined(fastbootConsoleApi.rootElement);
    });

    it('reload should work correctly', function() {
      return fastbootConsoleApi.reload().then(function(resp) {
        return resp.html();
      })
      .then(function(result) {
        assert.include(result, 'You’ve officially spun up your very first Ember app :-)');
      });
    });

    it('AMD modules should be loaded in sandbox', function() {
      assert.isAbove(Object.keys(fastbootConsoleApi.sandbox.require.entries).length, 0);
    });
  });
});