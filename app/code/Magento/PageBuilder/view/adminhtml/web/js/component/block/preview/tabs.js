/*eslint-disable */
define(["jquery", "knockout", "tabs", "underscore", "Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/block/preview/block"], function (_jquery, _knockout, _tabs, _underscore, _colorConverter, _eventBus, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Tabs =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Tabs, _PreviewBlock);

    /**
     * Assign a debounce and delay to the init of tabs to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Tabs(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.focusedTab = _knockout.observable();
      _this.activeTab = _knockout.observable();
      _this.element = void 0;
      _this.buildTabs = _underscore.debounce(function () {
        if (_this.element && _this.element.children.length > 0) {
          try {
            (0, _jquery)(_this.element).tabs("destroy");
          } catch (e) {// We aren't concerned if this fails, tabs throws an Exception when we cannot destroy
          }

          (0, _jquery)(_this.element).tabs({
            active: _this.activeTab() || 1
          });
        }
      }, 10);

      _eventBus.on("tabs:block:ready", function (event, params) {
        if (params.id === _this.parent.id && _this.element) {
          _this.buildTabs();
        }
      });

      _eventBus.on("tab:block:create", function (event, params) {
        if (_this.element && params.block.parent.id === _this.parent.id) {
          _this.buildTabs();
        }
      });

      _eventBus.on("tab:block:removed", function (event, params) {
        if (_this.element && params.block.parent.id === _this.parent.id) {
          _this.buildTabs();
        }
      });

      _this.activeTab.subscribe(function (index) {
        (0, _jquery)(_this.element).tabs("option", "active", index);
      }); // Set the stage to interacting when a tab is focused


      _this.focusedTab.subscribe(function (value) {
        _this.parent.stage.interacting(value !== null);
      });

      return _this;
    }
    /**
     * Set the active tab, we maintain a reference to it in an observable for when we rebuild the tab instance
     *
     * @param {number} index
     */


    var _proto = Tabs.prototype;

    _proto.setActiveTab = function setActiveTab(index) {
      this.activeTab(index);
    };
    /**
     * Set the focused tab
     *
     * @param {number} index
     * @param {boolean} force
     */


    _proto.setFocusedTab = function setFocusedTab(index, force) {
      if (force === void 0) {
        force = false;
      }

      this.setActiveTab(index);

      if (force) {
        this.focusedTab(null);
      }

      this.focusedTab(index);

      if (this.element) {
        _underscore.defer(function () {
          document.execCommand("selectAll", false, null);
        });
      }
    };
    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */


    _proto.onContainerRender = function onContainerRender(element) {
      this.element = element;
      this.buildTabs();
    };
    /**
     * Handle clicking on a tab
     *
     * @param {number} index
     * @param {Event} event
     */


    _proto.onTabClick = function onTabClick(index, event) {
      // The options menu is within the tab, so don't change the focus if we click an item within
      if ((0, _jquery)(event.target).parents(".pagebuilder-options").length > 0) {
        return;
      }

      this.setFocusedTab(index);
    };
    /**
     * Get the Tab header style attributes for the preview
     *
     * @returns {any}
     */


    _proto.getTabHeaderStyles = function getTabHeaderStyles(index) {
      var borderRadius = this.data.border_radius();
      var borderColor = this.data.border_color() === "" ? this.data.border_color() : (0, _colorConverter.fromHex)(this.data.border_color(), "1");
      var border = this.data.border() + " " + borderColor + " " + this.data.border_width() + "px";
      var marginBottom = this.data.border_width() === "1" ? "-2px" : "-" + Math.round(this.data.border_width() * (4 / 3)) + "px";
      var styles = {
        border: border,
        marginBottom: marginBottom,
        borderRadius: borderRadius + "px " + borderRadius + "px 0px 0px",
        borderBottomColor: "",
        borderBottomStyle: "solid",
        borderBottomWidth: "2px",
        marginLeft: "0px",
        zIndex: -index
      };

      if (index !== 0) {
        styles.marginLeft = "-" + this.data.border_width() + "px";
      }

      if (index === this.activeTab()) {
        styles.borderBottomColor = this.data.border() !== "_default" ? "rgba(255,255,255,1)" : "transparent";
        styles.borderBottomWidth = Math.abs(parseInt(marginBottom, 10)) + 1 + "px";
      } else {
        styles.borderBottomColor = "transparent";
      }

      return styles;
    };
    /**
     * Get the Tabs border style attributes to wrap tabs in the preview
     *
     * @returns {any}
     */


    _proto.getTabsBorderWrapper = function getTabsBorderWrapper() {
      var borderRadius = this.data.border_radius();
      var borderColor = this.data.border_color() === "" ? this.data.border_color() : (0, _colorConverter.fromHex)(this.data.border_color(), "1");
      return {
        border: this.data.border() + " " + borderColor + " " + this.data.border_width() + "px",
        borderRadius: "0px " + borderRadius + "px " + borderRadius + "px " + borderRadius + "px"
      };
    };
    /**
     * Get the Tabs border style attributes to wrap tabs in the preview
     *
     * @returns {any}
     */


    _proto.getTabHeaderLinkBorder = function getTabHeaderLinkBorder() {
      if (this.data.border() !== "_default") {
        return {
          borderColor: "transparent",
          borderRadius: "3px"
        };
      }

      return null;
    };
    /**
     * Get the Tabs navigation alignement and applies to tab headers in the preview
     *
     * @returns {any}
     */


    _proto.getNavigationAlignment = function getNavigationAlignment() {
      return {
        textAlign: this.data.navigation_alignment()
      };
    };

    return Tabs;
  }(_block); // Resolve issue with jQuery UI tabs blocking events on content editable areas


  var originalTabKeyDown = _jquery.ui.tabs.prototype._tabKeydown;

  _jquery.ui.tabs.prototype._tabKeydown = function (event) {
    // If the target is content editable don't handle any events
    if ((0, _jquery)(event.target).attr("contenteditable")) {
      return;
    }

    originalTabKeyDown.call(this, event);
  };

  return Tabs;
});
//# sourceMappingURL=tabs.js.map
