"use strict";

/** * Gutenberg Block * * @author MoreConvert * @package Smart Wishlist For More Convert */

var registerBlockType = wp.blocks.registerBlockType;
var _wp$i18n = wp.i18n,
  __ = _wp$i18n.__,
  sprintf = _wp$i18n.sprintf;
var InspectorControls = wp.blockEditor.InspectorControls;
var _wp$components = wp.components,
  PanelBody = _wp$components.PanelBody,
  ToggleControl = _wp$components.ToggleControl;

// Function to get the appropriate icon based on list type.
var getIconByType = function getIconByType(type) {
  switch (type) {
    case 'wishlist':
      return 'heart';
    case 'multi-list':
      return 'list-view';
    case 'waitlist':
      return 'bell';
    default:
      return 'heart';
  }
};
var registerAddToListBlock = function registerAddToListBlock(type, title, shortcode) {
  var isPremium = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  registerBlockType("wlfmc/add-to-".concat(type), {
    title: sprintf(/* translators: %s is the type of list (e.g., Wishlist, Multi-list, Waitlist). */
    __('MC Add to %s', 'wc-wlfmc-wishlist'), title),
    description: sprintf(/* translators: %s is the type of list (e.g., Wishlist, Multi-list, Waitlist). */
    __('A button to add products to %s.', 'wc-wlfmc-wishlist'), title),
    icon: getIconByType(type),
    category: 'woocommerce-product-elements',
    keywords: [title, sprintf(/* translators: %s is the type of list (e.g., Wishlist, Multi-list, Waitlist). */
    __('add to %s', 'wc-wlfmc-wishlist'), title)],
    attributes: {
      is_single: {
        type: 'boolean',
        "default": false
      }
    },
    supports: {
      html: false
    },
    edit: function edit(_ref) {
      var _window$wlfmcBlockSet;
      var attributes = _ref.attributes,
        setAttributes = _ref.setAttributes;
      // Check if premium version is required and not active.
      if (isPremium && !((_window$wlfmcBlockSet = window.wlfmcBlockSettings) !== null && _window$wlfmcBlockSet !== void 0 && _window$wlfmcBlockSet.isPremium)) {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            border: '1px dashed #ccc',
            padding: '20px',
            textAlign: 'center',
            color: 'red'
          }
        }, sprintf(/* translators: %s is the type of list (e.g., Wishlist, Multi-list, Waitlist). */
        __('The %s feature requires the Pro version of the plugin.', 'wc-wlfmc-wishlist'), title));
      }

      // Static button rendering to mimic shortcode output.
      var buttonText = sprintf(/* translators: %s is the type of list (e.g., Wishlist, Multi-list, Waitlist). */
      __('Add to %s', 'wc-wlfmc-wishlist'), title);
      var shortcodeAttributes = attributes.is_single ? ' is_single="true"' : '';
      var shortcodeString = "[".concat(shortcode).concat(shortcodeAttributes, "]");
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
        title: sprintf(/* translators: %s is the type of list (e.g., Wishlist, Multi-list, Waitlist). */
        __('%s Settings', 'wc-wlfmc-wishlist'), title)
      }, /*#__PURE__*/React.createElement(ToggleControl, {
        label: __('Treat as Single Product Page', 'wc-wlfmc-wishlist'),
        help: __('Enable if this button is on a single product context.', 'wc-wlfmc-wishlist'),
        checked: attributes.is_single,
        onChange: function onChange(value) {
          return setAttributes({
            is_single: value
          });
        }
      }))), /*#__PURE__*/React.createElement("div", {
        className: "wlfmc-add-to-".concat(type, "-wrapper")
      }, /*#__PURE__*/React.createElement("a", {
        href: "#",
        className: "wlfmc-add-to-".concat(type, " button"),
        "data-shortcode": shortcodeString
      }, buttonText)));
    },
    save: function save() {
      return null;
    }
  });
};

// Register all blocks.
registerAddToListBlock('wishlist', __('Wishlist', 'wc-wlfmc-wishlist'), 'wlfmc_add_to_wishlist');
registerAddToListBlock('multi-list', __('Multi-list', 'wc-wlfmc-wishlist'), 'wlfmc_add_to_multi_list', true);
registerAddToListBlock('waitlist', __('Waitlist', 'wc-wlfmc-wishlist'), 'wlfmc_add_to_waitlist', true);