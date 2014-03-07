require.config {
  baseUrl: '../'

  paths: {
    'jquery': 'lib/jquery-1.11.0.min'
    'threejs': 'lib/three'
    'planets': 'lib/threex.planets'
    'atmospheres': 'lib/threex.atmospherematerial'
    'text': 'lib/text'
    'handlebars': 'lib/handlebars-v1.3.0'
    'terminal': 'lib/jquery.terminal-0.7.12'
    'radio': 'lib/radio.min'
  }

  shim: {
    'threejs': {
      exports: 'THREE'
    }
    'planets': {
      deps: ['threejs']
      exports: 'THREEx.Planets'
    }
    'atmospheres': {
      deps: ['threejs']
      exports: 'THREEx.Atmospheres'
    }
    'handlebars': {
      exports: 'Handlebars'
    }
    'terminal': {
      deps: ['jquery']
      exports: 'Terminal'
    }
  }
}

require ['scripts/app'], (App) ->
  app = new App
  return app.initialize()
