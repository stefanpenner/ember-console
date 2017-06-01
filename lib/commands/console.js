'use strict';

const SilentError = require('silent-error');
const path = require('path');

module.exports = {
  name: 'console',
  description: 'runs your app in node and gives you a repl to it',

  availableOptions: [
    { name: 'build',       type: Boolean, default: 'auto' },
    { name: 'environment', type: String,  default: 'development', aliases: ['e',{'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'output-path', type: 'Path',  default: 'dist/',       aliases: ['o'] },
  ],

  run(options) {
    const Fastboot = require('fastboot');
    const repl = require('repl');
    const fs = require('fs');
    const semver = require('semver');
    const { addAwaitOutsideToReplServer } = require('await-outside');
    const dist = options.outputPath;

    const addon = this.project.addons.find(addon => addon.name === 'ember-cli-fastboot');;

    if (!addon) {
      throw new SilentError('You must have ember-cli-fastboot@1.0.0-rc.1 >= installed and working')
    }

    if (!semver.gte(addon.pkg.version, '1.0.0-rc.1')) {
      throw new SilentError(`You must have ember-cli-fastboot@1.0.0-rc.1 >= installed, you have: '${addon.pkg.version}'`);
    }

    let setup;
    options['suppress-sizes'] = true;
    if (options.build === true) {
      setup = this.runTask('Build', options);
    } else if (options.build === 'auto' && !fs.existsSync(dist)) {
      setup = this.runTask('Build', options);
    } else {
      setup = Promise.resolve();
    }

    return setup.then(() => {
      if (!fs.existsSync(dist)) {
        throw new SilentError('You must first ember your app (console is booted from dist/*)')
      }

      const app = new Fastboot({
        distPath: dist
      });

      app.visit('/').then(response => {
        const replServer = repl.start({
          prompt: '> '
        });

        addAwaitOutsideToReplServer(replServer);

        Object.assign(replServer.context, {
          get app()      {
            return {
              dist,
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
                return app.reload();
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
            }
          }
        });
      });

      return new Promise(_ => _);
    });
  }
};
