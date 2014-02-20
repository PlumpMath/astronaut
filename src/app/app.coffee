define [
  'jquery'
  'threejs'
  'scripts/cockpit'
  'planets'
  'atmospheres'
], ($, THREE, Cockpit) ->

  class App
    constructor: (@options) ->

    initialize: ->
      @updateFns = []

      @renderer = new THREE.WebGLRenderer {
        antialias: true
      }

      @renderer.setSize window.innerWidth, window.innerHeight
      @renderer.shadowMapEnabled = true
      document.body.appendChild @renderer.domElement

      @createScene()
      @createCamera()
      @createLights()
      @createPlanets()
      # @createControls()
      @render()
      @createCockpit()

    createScene: ->
      @scene = new THREE.Scene

    createCamera: ->
      @camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.01,
        100
      )
      @camera.position.z = 3

    createCockpit: ->
      cockpit = new Cockpit
      cockpit.initialize()

    createLights: ->
      # add ambient lighting
      @scene.add new THREE.AmbientLight(0x888888)

      # add directional light
      dLight = new THREE.DirectionalLight(0xcccccc, 1)
      dLight.position.set 5, 5, 5
      dLight.castShadow = true
      dLight.shadowCameraNear = 0.01
      dLight.shadowCameraFar = 15
      dLight.shadowCameraFov = 45
      dLight.shadowCameraLeft = -1
      dLight.shadowCameraRight = 1
      dLight.shadowCameraTop = 1
      dLight.shadowCameraBottom = -1
      dLight.shadowBias = 0.001
      dLight.shadowDarkness = 0.2
      dLight.shadowMapWidth = 1024
      dLight.shadowMapHeight = 1024
      @scene.add dLight

    createPlanets: ->
      earth = THREEx.Planets.createEarth()
      clouds = THREEx.Planets.createEarthCloud()

      @scene.add earth
      @scene.add clouds

      @updateFns.push (delta, now) ->
        clouds.rotation.y += 1/8 * delta

    render: ->
      @updateFns.push =>
        @renderer.render @scene, @camera

      animate = (nowMsec) =>
        # keep looping
        requestAnimationFrame animate
        # measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
        deltaMsec = Math.min 200, nowMsec - lastTimeMsec
        lastTimeMsec = nowMsec

        return @updateFns.forEach((updateFn) =>
          updateFn (deltaMsec / 1000), (nowMsec / 1000)
        )

      return requestAnimationFrame animate
