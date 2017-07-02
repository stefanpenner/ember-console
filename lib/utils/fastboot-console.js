'use strict';

const Fastboot = require('fastboot');

/**
 * FastBoot console that takes in a dist path and visits the root url and provides
 * a console API to debug app running in FastBoot.
 */
module.exports = function fastbootConsole(dist) {
  return new Promise((resolve, reject) => {
    const app = new Fastboot({
      distPath: dist
    });

    return app.visit('/').then((response) => {
      const fastbootConsoleApi = {
          dist,
          get html() {
            return response.html();
          },
          get currentURL() {
            return response.instance.lookup('router:main').get('currentURL');
          },
          get routes() {
            return Object.keys(response.instance.__container__.lookup('router:main').get('_routerMicrolib.recognizer.names'));
          },
          get rootElement() {
            return response.instance.rootElement;
          },
          lookup(fullName) {
            return response.instance.lookup(fullName);
          },
          reload() {
            app.reload()
            return app.visit('/').then(_response => response = _response);
          },
          visit() {
            return app.visit(...arguments);
          },
          get sandbox() {
            return app._app.sandbox.sandbox;
          },
          get instance() {
            return response.instance;
          }
      };
      resolve({app, response, fastbootConsoleApi})
    }, (error) => {
      reject(error)
    });
  });
}