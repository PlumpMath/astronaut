(function() {
  define(['jquery', 'handlebars', 'radio', 'text!templates/cockpit/boot.html', 'text!templates/cockpit/main.html', 'text!templates/cockpit/terminal.html', 'text!templates/cockpit/indicators.html', 'scripts/system', 'terminal'], function($, Handleabars, radio, bootTemplate, mainTemplate, terminalTemplate, indicatorsTemplate, System) {
    var Cockpit;
    return Cockpit = (function() {
      function Cockpit(options) {
        this.options = options;
        this.bootTemplate = Handlebars.compile(bootTemplate);
        this.mainTemplate = Handlebars.compile(mainTemplate);
        this.terminalTemplate = Handlebars.compile(terminalTemplate);
        this.indicatorsTemplate = Handlebars.compile(indicatorsTemplate);
        this.engine = new System({
          type: 'ENG',
          status: 'off'
        });
        this.hull = new System({
          type: 'HULL',
          status: 'off'
        });
        this.comms = new System({
          type: 'COMM',
          status: 'off'
        });
        this.oxygen = new System({
          type: 'O2',
          status: 'off'
        });
        this.hud = new System({
          type: 'HUD',
          status: 'off'
        });
        this.power = new System({
          type: 'PWR',
          status: 'off'
        });
        this.systems = {
          systems: [this.engine, this.comms, this.oxygen, this.hull, this.hud, this.power]
        };
      }

      Cockpit.prototype.initialize = function() {
        this.loadingProgress = {
          testNumber: 0
        };
        this.render();
        radio('bootUp').subscribe((function(_this) {
          return function(status) {
            if (status === 'complete') {
              _this.renderTerminal();
              return _this.renderIndicators();
            }
          };
        })(this));
        return radio('indicators').subscribe((function(_this) {
          return function(action) {
            if (action === 'update') {
              _this.updateIndicators();
            }
            if (action === 'activate') {
              _this.activateIndicators();
            }
            if (action === 'update') {
              return _this.updateIndicators();
            }
          };
        })(this));
      };

      Cockpit.prototype.activateIndicators = function() {
        var system, _i, _len, _ref;
        _ref = this.systems.systems;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          system = _ref[_i];
          system.status = 'fail';
        }
        radio('indicators').broadcast('update');
        this.power.status = 'warn';
        this.hud.status = 'warn';
        this.hull.status = 'ok';
        this.oxygen.status = 'warn';
        return setTimeout((function() {
          return radio('indicators').broadcast('update');
        }), 500);
      };

      Cockpit.prototype.updateIndicators = function() {
        var $system, system, _i, _len, _ref, _results;
        _ref = this.systems.systems;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          system = _ref[_i];
          $system = $("." + system.type);
          if (!$system.hasClass(system.status)) {
            $system.removeClass('fail', 'ok', 'warn');
            _results.push($system.addClass(system.status));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Cockpit.prototype.render = function() {
        var html;
        html = this.mainTemplate();
        $('body').append(html);
        return this.renderBoot();
      };

      Cockpit.prototype.renderBoot = function() {
        var bootHTML, id;
        bootHTML = this.bootTemplate(this.loadingProgress);
        $('.cockpit-main').html(bootHTML);
        if (id === void 0) {
          return id = setInterval(((function(_this) {
            return function() {
              if (_this.loadingProgress.testNumber !== 100) {
                _this.loadingProgress.testNumber += 1;
                return _this.renderBoot();
              }
              clearInterval(id);
              $('.booter').remove();
              return radio('bootUp').broadcast('complete');
            };
          })(this)), 100);
        }
      };

      Cockpit.prototype.renderIndicators = function() {
        var indicatorsHTML;
        indicatorsHTML = this.indicatorsTemplate(this.systems);
        if (!$('.indicators-container').length) {
          $('.cockpit-main').append(indicatorsHTML);
          $('.indicator').each(function(i, el) {
            return setTimeout((function() {
              return $(el).addClass('visible');
            }), 200 + (i * 150));
          });
          return setTimeout((function() {
            return radio('indicators').broadcast('activate');
          }), 3000);
        }
      };

      Cockpit.prototype.renderTerminal = function() {
        var terminalHTML;
        terminalHTML = this.terminalTemplate();
        if (!$('.terminal-container').length) {
          $('.cockpit-main').append(terminalHTML);
          $('.terminal-container').terminal((function(cmd, term) {
            return term.echo('hello');
          }), {
            greetings: 'good morning, dave'
          });
          return setTimeout((function() {
            return $('.terminal-container').addClass('pullDownTerminal');
          }), 500);
        }
      };

      return Cockpit;

    })();
  });

}).call(this);
