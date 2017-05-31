# ember-console

get a console (REPL) to you fastboot capable ember-app

*WARNING: still experimental, but ideas/help is wanted!*

[![asciicast](https://asciinema.org/a/4ustg8rdcbc1y38x82b848vt8.png)](https://asciinema.org/a/4ustg8rdcbc1y38x82b848vt8)

# Installation

```
yarn add ember-console
```

or


```
npm install ember-console
```

# Usage

1. ensure your app has `ember-cli-fastboot` >= `1.0.0-rc.1` installed and working
2. build your app `ember build`
3. run `ember console` and your app in `dist/` is started in fastboot, and a repl to it is opened.

Available commands:

* `.help` for repl specific commands
* `app`
  * `currentURL`
  * `routes`
  * `rootElement`
  * `lookup(fullName)`: enables looking up singletons, for example `lookup('router:mian')`
  * `reload()` reloads the app, if a new bulid has occured this can be used to reload new code.
  * `visit(path)` the fastboot `visit` helper, allowing you to manually navigate your app
  * `instance` the fastboot instance

# Development

## Installation

* `git clone <repository-url>` this repository
* `cd ember-console`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
