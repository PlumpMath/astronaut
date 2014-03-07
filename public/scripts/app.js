(function() {
  define(['jquery', 'threejs', 'radio', 'scripts/cockpit', 'planets', 'atmospheres'], function($, THREE, radio, Cockpit) {
    var App;
    return App = (function() {
      function App(options) {
        this.options = options;
      }

      App.prototype.initialize = function() {
        this.updateFns = [];
        this.renderer = new THREE.WebGLRenderer({
          antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;
        $('body').append(this.renderer.domElement);
        $('canvas').addClass('blur');
        this.listenForEvents();
        this.createScene();
        this.createCamera();
        this.createStarfield();
        this.createLights();
        this.createPlanets();
        this.render();
        return this.createCockpit();
      };

      App.prototype.createScene = function() {
        return this.scene = new THREE.Scene;
      };

      App.prototype.createCamera = function() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = 10;
        return this.updateFns.push((function(_this) {
          return function(delta, now) {
            _this.camera.rotation.x += 0.01 * delta;
            return _this.camera.rotation.y += 0.015 * delta;
          };
        })(this));
      };

      App.prototype.createStarfield = function() {
        var geometry, material, starfield;
        geometry = new THREE.SphereGeometry(90, 32, 32);
        material = new THREE.MeshBasicMaterial();
        material.map = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png');
        material.side = THREE.BackSide;
        starfield = new THREE.Mesh(geometry, material);
        return this.scene.add(starfield);
      };

      App.prototype.createCockpit = function() {
        var cockpit;
        cockpit = new Cockpit;
        return cockpit.initialize();
      };

      App.prototype.createLights = function() {
        var dLight;
        this.scene.add(new THREE.AmbientLight(0x888888));
        dLight = new THREE.DirectionalLight(0xcccccc, 1);
        dLight.position.set(5, 5, 5);
        dLight.castShadow = true;
        dLight.shadowCameraNear = 0.01;
        dLight.shadowCameraFar = 15;
        dLight.shadowCameraFov = 45;
        dLight.shadowCameraLeft = -1;
        dLight.shadowCameraRight = 1;
        dLight.shadowCameraTop = 1;
        dLight.shadowCameraBottom = -1;
        dLight.shadowBias = 0.001;
        dLight.shadowDarkness = 0.2;
        dLight.shadowMapWidth = 1024;
        dLight.shadowMapHeight = 1024;
        return this.scene.add(dLight);
      };

      App.prototype.createPlanets = function() {
        var clouds, earth;
        earth = THREEx.Planets.createEarth();
        clouds = THREEx.Planets.createEarthCloud();
        this.scene.add(earth);
        this.scene.add(clouds);
        this.updateFns.push(function(delta, now) {
          earth.rotation.x += 0.05 * delta;
          return earth.rotation.y += 0.1 * delta;
        });
        return this.updateFns.push(function(delta, now) {
          return clouds.rotation.y += 1 / 8 * delta;
        });
      };

      App.prototype.listenForEvents = function() {
        return radio('bootUp').subscribe((function(_this) {
          return function(status) {
            if (status === 'complete') {
              return $('canvas').removeClass('blur');
            }
          };
        })(this));
      };

      App.prototype.render = function() {
        var animate;
        this.updateFns.push((function(_this) {
          return function() {
            return _this.renderer.render(_this.scene, _this.camera);
          };
        })(this));
        animate = (function(_this) {
          return function(nowMsec) {
            var deltaMsec, lastTimeMsec;
            requestAnimationFrame(animate);
            lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
            deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
            lastTimeMsec = nowMsec;
            return _this.updateFns.forEach(function(updateFn) {
              return updateFn(deltaMsec / 1000, nowMsec / 1000);
            });
          };
        })(this);
        return requestAnimationFrame(animate);
      };

      return App;

    })();
  });

}).call(this);
