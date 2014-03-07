define [
  'jquery'
  'handlebars'
  'radio'
  'text!templates/cockpit/boot.html'
  'text!templates/cockpit/main.html'
  'text!templates/cockpit/terminal.html'
  'text!templates/cockpit/indicators.html'
  'scripts/system'
  'terminal'
], 
(
  $
  Handleabars
  radio
  bootTemplate
  mainTemplate
  terminalTemplate
  indicatorsTemplate
  System
) ->

  class Cockpit
    constructor: (@options) ->
      @bootTemplate = Handlebars.compile bootTemplate
      @mainTemplate = Handlebars.compile mainTemplate
      @terminalTemplate = Handlebars.compile terminalTemplate
      @indicatorsTemplate = Handlebars.compile indicatorsTemplate

      # construct ship systems as object
      @engine = new System { type: 'ENG', status: 'off' }
      @hull = new System { type: 'HULL', status: 'off'  }
      @comms = new System { type: 'COMM', status: 'off'  }
      @oxygen = new System { type: 'O2', status: 'off'  }
      @hud = new System { type: 'HUD', status: 'off'  }
      @power = new System { type: 'PWR', status: 'off'  }

      @systems = systems: [
        @engine
        @comms
        @oxygen
        @hull
        @hud
        @power
      ]

    initialize: ->
      @loadingProgress = { testNumber: 0 }
      @render()

      # on boot complete
      radio('bootUp').subscribe (status) =>
        if status is 'complete'
          @renderTerminal()
          @renderIndicators()

      # on systems status change
      radio('indicators').subscribe (action) =>
        if action is 'update'
          @updateIndicators()

        if action is 'activate'
          @activateIndicators()

        if action is 'update'
          @updateIndicators()

    # once indicators are on, set initial state and update
    activateIndicators: ->
      # set all to fail
      for system in @systems.systems
        system.status = 'fail'

      radio('indicators').broadcast('update')

      @power.status = 'warn'
      @hud.status = 'warn'
      @hull.status = 'ok'
      @oxygen.status = 'warn'

      setTimeout (->
        radio('indicators').broadcast('update')
      ), 500

    updateIndicators: ->
      for system in @systems.systems
        $system = $(".#{system.type}")

        if !$system.hasClass(system.status)
          $system.removeClass('fail', 'ok', 'warn')
          $system.addClass system.status

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
          $('.booter').remove()
          radio('bootUp').broadcast('complete')
        ), 100

    renderIndicators: ->
      indicatorsHTML = @indicatorsTemplate @systems
      if !$('.indicators-container').length
        $('.cockpit-main').append indicatorsHTML

        # make em visible
        $('.indicator').each (i, el) ->
          setTimeout (->
            $(el).addClass 'visible'
          ), 200 + (i * 150)

        setTimeout (->
          radio('indicators').broadcast('activate')
        ), 3000

    renderTerminal: ->
      terminalHTML = @terminalTemplate()
      if !$('.terminal-container').length
        $('.cockpit-main').append terminalHTML
        $('.terminal-container').terminal ((cmd, term) ->
          term.echo 'hello'
        ), {
          greetings: 'good morning, dave'
        }

        setTimeout (->
          $('.terminal-container').addClass 'pullDownTerminal'
        ), 500

