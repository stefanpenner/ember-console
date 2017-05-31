/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-console',
  includedCommands() {
    return {
      console: require('./lib/commands/console')
    };
  }
};


