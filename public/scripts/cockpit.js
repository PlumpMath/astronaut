(function() {
  define(['jquery', 'handlebars', 'text!templates/cockpit/boot.html', 'text!templates/cockpit/main.html', 'text!templates/cockpit/terminal.html', 'terminal'], function($, Handleabars, bootTemplate, mainTemplate, terminalTemplate) {
    var Cockpit;
    return Cockpit = (function() {
      function Cockpit(options) {
        this.options = options;
        this.bootTemplate = Handlebars.compile(bootTemplate);
        this.mainTemplate = Handlebars.compile(mainTemplate);
        this.terminalTemplate = Handlebars.compile(terminalTemplate);
      }

      Cockpit.prototype.initialize = function() {
        this.loadingProgress = {
          testNumber: 0
        };
        return this.render();
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
              return _this.renderTerminal();
            };
          })(this)), 100);
        }
      };

      Cockpit.prototype.renderTerminal = function() {
        var terminalHTML;
        terminalHTML = this.terminalTemplate();
        $('.cockpit-main').html(terminalHTML);
        $('.terminal-container').terminal((function(cmd, term) {
          return term.echo('hello');
        }), {
          greetings: 'good morning, dave'
        });
        return setTimeout((function() {
          return $('.terminal-container').addClass('visible');
        }), 500);
      };

      return Cockpit;

    })();
  });

}).call(this);
