define [
  'jquery'
  'handlebars'
  'text!templates/cockpit/boot.html'
  'text!templates/cockpit/main.html'
  'text!templates/cockpit/terminal.html'
  'terminal'
], ($, Handleabars, bootTemplate, mainTemplate, terminalTemplate) ->

  class Cockpit
    constructor: (@options) ->
      @bootTemplate = Handlebars.compile bootTemplate
      @mainTemplate = Handlebars.compile mainTemplate
      @terminalTemplate = Handlebars.compile terminalTemplate

    initialize: ->
      @loadingProgress = { testNumber: 0 }
      @render()

    render: ->
      html = @mainTemplate()
      $('body').append html

      @renderBoot()

    renderBoot: ->
      bootHTML = @bootTemplate @loadingProgress
      $('.cockpit-main').html bootHTML

      if id is undefined
        id = setInterval (=>
          if @loadingProgress.testNumber isnt 100
            @loadingProgress.testNumber += 1
            return @renderBoot()
          clearInterval id
          return @renderTerminal()
        ), 100

    renderTerminal: ->
      terminalHTML = @terminalTemplate()
      $('.cockpit-main').html terminalHTML
      $('.terminal-container').terminal ((cmd, term) ->
        term.echo 'hello'
      ), {
        greetings: 'good morning, dave'
      }

      setTimeout (->
        $('.terminal-container').addClass 'visible'
      ), 500

