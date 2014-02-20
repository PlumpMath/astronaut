module.exports = ->

  @initConfig
    SRC_DIR: 'src/'
    DIST_DIR: 'public/'

    coffee:
      glob_to_multiple:
        expand: true
        flatten: true
        cwd: '<%= SRC_DIR %>'
        src: ['**/*.coffee']
        dest: '<%= DIST_DIR %>scripts'
        ext: '.js'

    stylus:
      compile:
        options:
          use: [ require 'nib' ]
        files:
          '<%= DIST_DIR %>styles/astronaut.css': '<%= SRC_DIR %>**/*.styl'

    watch:
      scripts:
        files: ['<%= SRC_DIR %>**/*.coffee']
        tasks: ['coffee']
      styles:
        files: ['<%= SRC_DIR %>**/*.styl']
        tasks: ['stylus']

  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-contrib-stylus'

  @registerTask 'default', ['coffee', 'stylus', 'watch']
