(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof2(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof2(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof2(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof2(o) { "@babel/helpers - typeof"; return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof2(o); }
/**
 * Main Smart WooCommerce Wishlist JS
 *
 * @author MoreConvert
 * @package Smart Wishlist For More Convert
 *
 * @version 1.8.4
 */

/*jshint esversion: 6 */

(function ($) {
  $.noConflict();
  $(document).ready(function () {
    /* === MAIN INIT === */
    var product_in_list = [],
      product_in_waitlist = [],
      lang = wlfmc_l10n.lang,
      remove_item_url = null,
      wishlist_items = wlfmc_l10n.wishlist_items,
      waitlist_items = wlfmc_l10n.waitlist_items,
      product_adding = false,
      fragmentxhr,
      fragmenttimeout;
    $.fn.WLFMC = {
      init_prepare_qty_links: function init_prepare_qty_links() {
        var qty = document.querySelectorAll('.wlfmc-wishlist-table .quantity');
        if (qty.length < 1) {
          return false;
        }
        for (var i = 0; i < qty.length; i++) {
          if (qty[i].classList.contains('hidden')) {
            return false;
          }
          var plus = qty[i].querySelector('.botiga-quantity-plus, a.plus, .ct-increase'),
            minus = qty[i].querySelector('.botiga-quantity-minus, a.minus, .ct-decrease');
          if (!plus || !minus || plus.length < 1 || minus.length < 1) {
            return false;
          }
          plus.classList.add('show');
          minus.classList.add('show');
          var plus_clone = plus.cloneNode(true),
            minus_clone = minus.cloneNode(true);
          plus_clone.addEventListener('click', function (e) {
            e.preventDefault();
            var input = this.parentNode.querySelector('.qty'),
              val = parseFloat(input.value, 10) || 0,
              changeEvent = document.createEvent('HTMLEvents');
            var max_val = input.getAttribute("max") && parseFloat(input.getAttribute("max"), 0) || 1 / 0;
            input.value = val < max_val ? Math.round(100 * (val + parseFloat(input.step || "1"))) / 100 : max_val;

            // input.value = input.value === '' ? 0 : parseInt( input.value ) + 1;
            changeEvent.initEvent('change', true, false);
            input.dispatchEvent(changeEvent);
            return false;
          });
          minus_clone.addEventListener('click', function (e) {
            e.preventDefault();
            var input = this.parentNode.querySelector('.qty'),
              val = parseFloat(input.value, 10) || 0,
              changeEvent = document.createEvent('HTMLEvents');
            var min_val = input.getAttribute("min") ? Math.round(100 * parseFloat(input.getAttribute("min"), 0)) / 100 : 0;
            input.value = val > min_val ? Math.round(100 * (val - parseFloat(input.step || "1"))) / 100 : min_val;

            // input.value = parseInt( input.value ) > 0 ? parseInt( input.value ) - 1 : 0;
            changeEvent.initEvent('change', true, false);
            input.dispatchEvent(changeEvent);
            return false;
          });
          qty[i].replaceChild(plus_clone, plus);
          qty[i].replaceChild(minus_clone, minus);
        }
      },
      prepare_mini_wishlist: function prepare_mini_wishlist(a) {
        if (a.hasClass('position-absolute')) {
          var ao = a.offset(),
            al = ao.left,
            at = ao.top,
            aw = a.outerWidth(),
            ah = a.outerHeight(),
            la = parseFloat(a.css('left')),
            ta = parseFloat(a.css('top')),
            aol = al - la,
            aot = at - ta,
            _la = la,
            _ta = ta,
            ww = $(window).width(),
            dh = $(document).height(),
            os = 50,
            r = ww - aol - aw - os,
            l = os - aol,
            b = dh - aot - ah - os;
          if (ww <= aw) {
            _la = -1 * aol;
          } else if (0 > ww - (aw + os * 2)) {
            _la = (ww - aw) / 2 - aol;
          } else if (0 < l) {
            _la = l;
          } else if (0 > r) {
            _la = r;
          }
          if (dh < ah) {
            a.height(dh - a.outerHeight() + a.height());
            ah = a.outerHeight();
          }
          if (dh <= ah) {
            _ta = -1 * aot;
          } else if (0 > dh - (ah + os * 2)) {
            _ta = (dh - ah) / 2 - aot;
          } else if (0 > b) {
            _ta = b;
          }
          a.css({
            left: _la,
            top: _ta
          });
        } else {
          var p = $('.wlfmc-counter-wrapper.' + a.attr('data-id'));
          if (typeof p !== 'undefined' && 0 < p.length) {
            var po = p.offset(),
              st = $(window).scrollTop(),
              _la = po.left,
              _ta = po.top + p.height() - st,
              aw = a.outerWidth(),
              ww = $(window).width();
            if (_la + aw > ww) {
              _la = ww - aw - 20;
            }
            a.css({
              left: _la,
              top: _ta
            });
          }
        }
      },
      appendtoBody: function appendtoBody(elem) {
        if (!elem.closest('.wlfmc-counter-wrapper').find('.position-fixed').length > 0) {
          return;
        }
        var counter_type = elem.closest('.wlfmc-counter-wrapper').find('.wlfmc-counter-items').hasClass('wlfmc-lists-counter-dropdown') ? 'wlfmc-premium-list-counter' : elem.closest('.wlfmc-counter-wrapper').hasClass('wlfmc-waitlist-counter-wrapper') ? 'wlfmc-waitlist-counter' : 'wlfmc-wishlist-counter';
        if (elem.closest('.elementor-widget-wlfmc-wishlist-counter').length > 0 || elem.closest('.elementor-widget-wlfmc-waitlist-counter').length > 0 || elem.closest('.elementor-widget-wlfmc-premium-list-counter').length > 0) {
          var widgetId = elem.closest('.elementor-widget-wlfmc-wishlist-counter').data("id") || elem.closest('.elementor-widget-wlfmc-waitlist-counter').data("id") || elem.closest('.elementor-widget-wlfmc-premium-list-counter').data("id");
          var elementId = elem.closest('[data-elementor-id]').data("elementor-id");
          var elementor = "<div class='wlfmc-elementor elementor elementor-" + elementId + " " + counter_type + "'><div class='elementor-element elementor-element-" + widgetId + "'></div></div>";
          $(elementor).appendTo("body");
          $(".wlfmc-elementor.elementor-" + elementId + " .elementor-element-" + widgetId).append(elem);
        } else if (!elem.closest('.wlfmc-elementor').length > 0) {
          var widgetId = elem.closest('.wlfmc-counter-wrapper').find('.wlfmc-counter-items').data("id");
          var elementor = "<div class='wlfmc-elementor no-elementor-" + widgetId + " " + counter_type + "'></div>";
          $(elementor).appendTo("body");
          $(".wlfmc-elementor.no-elementor-" + widgetId).append(elem);
        }
      },
      show_mini_wishlist: function show_mini_wishlist() {
        $('.wlfmc-counter-dropdown').removeClass("lists-show");
        var elem = $('.dropdown_' + $(this).attr('data-id')) || $(this).closest('.wlfmc-counter-wrapper').find('.wlfmc-counter-dropdown');
        $.fn.WLFMC.appendtoBody(elem.closest('.wlfmc-counter-wrapper'));
        $.fn.WLFMC.prepare_mini_wishlist(elem);
        elem.addClass('lists-show');
      },
      hide_mini_wishlist: function hide_mini_wishlist() {
        var elem = $(this).closest('.wlfmc-counter-wrapper').find('.wlfmc-counter-dropdown');
        $('.wlfmc-first-touch').removeClass('wlfmc-first-touch');
        $('.wlfmc-first-click').removeClass('wlfmc-first-click');
        elem.removeClass('lists-show');
      },
      reInit_wlfmc: function reInit_wlfmc() {
        $(document).trigger('wlfmc_init');
      },
      /**
       * Handle Drag & Drop of items for sorting
       *
       * @return void
       * @since 1.6.8
       */
      init_drag_n_drop: function init_drag_n_drop() {
        $('table.wlfmc-wishlist-items-wrapper').filter('.sortable').not('.no-interactions').each(function () {
          var t = $(this),
            jqxhr = false;
          t.sortable({
            items: '.wlfmc-table-item[data-row-id]',
            handle: ".sortable-handle",
            placeholder: "ui-sortable-placeholder",
            scroll: true,
            scrollSensitivity: 40,
            tolerance: "pointer",
            helper: function helper(e, ui) {
              ui.children().each(function () {
                var elems = $(this).closest('.wishlist-items-wrapper').find('.show-meta-data');
                if (elems.length > 0) {
                  elems.removeClass('show-meta-data');
                }
                elems = $(this).closest('.wishlist-items-wrapper').find('.wlfmc-row-meta-data');
                if (elems.length > 0) {
                  elems.addClass('hide');
                }
              });
              return ui;
            },
            update: function update(event, ui) {
              var row = t.find('[data-row-id]'),
                positions = [],
                i = 0;
              if (!row.length) {
                return;
              }
              if (jqxhr) {
                jqxhr.abort();
              }
              row.each(function () {
                var t = $(this);
                t.find('input[name*="[position]"]').val(i++);
                positions.push(t.data('row-id'));
                var elements = t.closest('.wishlist-items-wrapper').find('.parent-row-id-' + t.data('row-id'));
                if (elements.length > 0) {
                  t.after(elements);
                }
              });
              jqxhr = $.ajax({
                data: {
                  action: wlfmc_l10n.actions.sort_wishlist_items,
                  nonce: $('#wlfmc-wishlist-form table.wlfmc-wishlist-table').data('nonce'),
                  context: 'frontend',
                  positions: positions,
                  wishlist_token: t.data('token'),
                  page: t.data('page'),
                  per_page: t.data('per-page')
                },
                method: 'POST',
                url: wlfmc_l10n.admin_url
              });
            }
          }).disableSelection();
        });
      },
      /* === Tooltip === */
      init_tooltip: function init_tooltip() {
        var wlfmc_tooltip = function wlfmc_tooltip() {
          var instance;
          var _self = this;
          this.idSelector = 'wlfmc-tooltip';
          this.text = '';
          this.top = 0;
          this.left = 0;
          this.direction = typeof this.direction !== 'undefined' ? this.direction : 'bottom';
          this.t_type = typeof this.t_type !== 'undefined' ? this.t_type : 'default';
          this.target = '';
          this.hideTimeout = null;

          // Create actual element and tie element to object for reference.
          this.node = document.getElementById(this.idSelector);
          if (!this.node) {
            this.node = document.createElement("div");
            this.node.setAttribute("id", this.idSelector);
            this.node.className = this.node.className + "tooltip__hidden";
            this.node.innerHTML = this.text;
            document.body.appendChild(this.node);
          }
          this.show = function () {
            // Rerender tooltip.

            var location_order = ['top', 'right', 'bottom', 'left'];
            _self.node.innerHTML = _self.text;
            var direction = _self.direction;
            var t_type = _self.t_type;
            if (direction) {
              $(this.node).addClass('tooltip__expanded tooltip__expanded-' + direction);
            } else {
              $(this.node).addClass('tooltip__expanded');
            }
            $(this.node).addClass('wlfmc-tooltip-' + t_type);
            $(this.node).removeClass('tooltip__hidden');
            if (offscreen($(wlfmcTooltip.node))) {
              wlfmcTooltip.hide();
              wlfmcTooltip.direction = location_order[location_order.indexOf(wlfmcTooltip.direction) + 1];
              moveTip(wlfmcTooltip.node, wlfmcTooltip.target);
            }
          };
          this.hide = function () {
            // Hide tooltip.
            // Hide tooltip.
            if (_self.hideTimeout) {
              clearTimeout(_self.hideTimeout);
              _self.hideTimeout = null;
            }
            $(_self.node).css('top', '0');
            $(_self.node).css('left', '0');
            $(_self.node).attr('class', '');
            $(_self.node).addClass('tooltip__hidden');
          };
        };
        // Move tip to proper location before display.
        var offscreen = function offscreen(el) {
          return el.offsetLeft + el.offsetWidth < 0 || el.offsetTop + el.offsetHeight < 0 || el.offsetLeft + el.offsetWidth > window.innerWidth || el.offsetTop + el.offsetHeight > window.innerHeight;
        };
        var moveTip = function moveTip(ell, target) {
          var $target = $(target);
          var $ell = $(ell);
          var body = $("body").offset();
          $("body").css({
            'position': 'relative'
          });

          // fix $ell size after change new tooltip text.
          wlfmcTooltip.show();
          wlfmcTooltip.hide();
          var buu = 7; // Default padding size in px.
          // var center_height = -($ell.outerHeight() / 2) / 2;
          var center_height = ($target.outerHeight() - $ell.outerHeight()) / 2;
          var center_width = -($ell.outerWidth() / 2) + $target.outerWidth() / 2;
          var locations = {
            'top': [-$ell.outerHeight() - buu, center_width],
            'right': [center_height, $target.outerWidth() + buu],
            'bottom': [$target.outerHeight() + buu, center_width],
            'left': [center_height, -$ell.outerWidth() - buu]
          };
          var location_order = ['top', 'right', 'bottom', 'left'];
          var location_keys = Object.keys(locations);
          if (wlfmcTooltip.direction === 'top' || wlfmcTooltip.direction === 'bottom') {
            $ell.css('top', $target.offset().top - body.top + locations[wlfmcTooltip.direction][0]);
            $ell.css('left', $target.offset().left - body.left + buu / 2 + locations[wlfmcTooltip.direction][1]);
          } else {
            // $ell.css( 'top', $target.offset().top - (body.top) + (buu / 2) + locations[wlfmcTooltip.direction][0] );
            var top = locations[wlfmcTooltip.direction][0] - buu / 2;
            top = top < 0 ? top + buu / 2 : top;
            $ell.css('top', $target.offset().top - body.top + top);
            $ell.css('left', $target.offset().left - body.left + locations[wlfmcTooltip.direction][1]);
          }
          if (offscreen($ell)) {
            wlfmcTooltip.direction = location_order[location_order.indexOf(wlfmcTooltip.direction) + 1];
            wlfmcTooltip.show();
          } else {
            wlfmcTooltip.show();
          }
        };

        // Create global wlfmc_tooltip.
        var wlfmcTooltip = new wlfmc_tooltip();
        // Detect if device is touch-enabled
        var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        // Mouseover to show.
        $(document).on('mouseenter touchstart', ".wlfmc-tooltip", function (e) {
          var _self = this;
          wlfmcTooltip.target = _self; // Default to self.
          var name_classes = _self.className.split(' ');
          name_classes.forEach(function (cc) {
            if (cc.indexOf('wlfmc-tooltip-') != -1) {
              // Find a directional tag.
              wlfmcTooltip.direction = cc.split('-')[cc.split('-').length - 1];
            }
          });
          if ($(this).attr('data-tooltip-type')) {
            wlfmcTooltip.t_type = $(this).attr('data-tooltip-type');
          }
          if ($(this).attr('data-tooltip-text')) {
            wlfmcTooltip.text = $(this).attr('data-tooltip-text');
            moveTip(wlfmcTooltip.node, wlfmcTooltip.target);
          }
          // Prevent default touch behavior to avoid scrolling issues
          if (e.type === 'touchstart') {
            e.preventDefault();
          }

          // Clear any existing hide timeout
          if (wlfmcTooltip.hideTimeout) {
            clearTimeout(wlfmcTooltip.hideTimeout);
            wlfmcTooltip.hideTimeout = null;
          }
        });
        $(document).on('mouseleave touchend', ".wlfmc-tooltip", function (e) {
          // Re-hide tooltip.
          // Hide tooltip after a short delay on touch devices
          if (e.type === 'touchend' && isTouchDevice) {
            wlfmcTooltip.hideTimeout = setTimeout(function () {
              wlfmcTooltip.hide();
            }, 1000); // 1-second delay before hiding
          } else if (e.type === 'mouseleave') {
            wlfmcTooltip.hide();
          }
        });
        // Hide tooltip if clicking/tapping outside
        $(document).on('touchstart click', function (e) {
          if (!$(e.target).closest('.wlfmc-tooltip').length && !$(e.target).is(wlfmcTooltip.node)) {
            wlfmcTooltip.hide();
          }
        });
      },
      init_fix_on_image_single_position: function init_fix_on_image_single_position() {
        if ($('.woocommerce-product-gallery__wrapper .wlfmc-top-of-image').length > 0) {
          $('.woocommerce-product-gallery__wrapper .wlfmc-top-of-image').each(function () {
            $(this).insertAfter($(this).parent());
          });
        }

        /*const topOfImageElems = document.querySelectorAll( '.wlfmc-top-of-image' );
        	for (let i = 0; i < topOfImageElems.length; i++) {
        	const currentElem = topOfImageElems[i];
        	// Set the margin top of the next sibling element to the height of the current element.
        	if (currentElem.nextElementSibling) {
        		let positionClass   = [...currentElem.nextElementSibling.classList].find( className => className.startsWith( "wlfmc_position_image_" ) );
        		let currentPosition = [...currentElem.classList].find( className => className.startsWith( "wlfmc_position_image_" ) );
        		if (positionClass === currentPosition) {
        			if ('wlfmc_position_image_top_left' === positionClass || 'wlfmc_position_image_top_right' === positionClass) {
        				let marginTop = `${currentElem.offsetHeight + 5}px`;
        				// Check for previous siblings with the same position class and add their heights and gap values to marginTop.
        				let prevSibling = currentElem.previousElementSibling;
        				while (prevSibling && prevSibling.classList.contains( 'wlfmc-top-of-image' ) && prevSibling.classList.contains( positionClass )) {
        					marginTop   = `calc( ${marginTop} + ${prevSibling.offsetHeight + 5}px )`;
        					prevSibling = prevSibling.previousElementSibling;
        				}
        				currentElem.nextElementSibling.style.marginTop = marginTop;
        			} else if ('wlfmc_position_image_bottom_left' === positionClass || 'wlfmc_position_image_bottom_right' === positionClass) {
        				let marginBottom = `${currentElem.offsetHeight + 5}px`;
        				// Check for previous siblings with the same position class and add their heights and gap values to marginBottom.
        				let prevSibling = currentElem.previousElementSibling;
        				while (prevSibling && prevSibling.classList.contains( 'wlfmc-top-of-image' ) && prevSibling.classList.contains( positionClass )) {
        					marginBottom = `calc( ${marginBottom} + ${prevSibling.offsetHeight + 5}px )`;
        					prevSibling  = prevSibling.previousElementSibling;
        				}
        				currentElem.nextElementSibling.style.marginBottom = marginBottom;
        			}
        		}
        	}
        }*/
      },
      /* === INIT FUNCTIONS === */

      /**
       * Init popup for all links with the plugin that open a popup
       *
       * @return void
       */
      init_wishlist_popup: function init_wishlist_popup() {
        // add & remove class to body when popup is opened.
        var callback = function callback(node, op) {
            if (typeof node.classList !== 'undefined' && node.classList.contains('wlfmc-overlay')) {
              var method = 'remove' === op ? 'removeClass' : 'addClass';
              $('body')[method]('wlfmc-with-popup');
            }
          },
          callbackAdd = function callbackAdd(node) {
            callback(node, 'add');
          },
          callbackRemove = function callbackRemove(node) {
            callback(node, 'remove');
          },
          observer = new MutationObserver(function (mutationsList) {
            for (var i in mutationsList) {
              var mutation = mutationsList[i];
              if (mutation.type === 'childList') {
                if (typeof mutation.addedNodes !== 'undefined') {
                  mutation.addedNodes.forEach(callbackAdd);
                }
                if (typeof mutation.removedNodes !== 'undefined') {
                  mutation.removedNodes.forEach(callbackRemove);
                }
              }
            }
          });
        observer.observe(document.body, {
          childList: true
        });
      },
      /**
       * Init checkbox handling
       *
       * @return void
       */
      init_checkbox_handling: function init_checkbox_handling() {
        var checkboxes = $('.wlfmc-wishlist-table, .wlfmc-save-for-later-table').find('tbody .product-checkbox input[type="checkbox"]');
        var link = $('.multiple-product-move,.multiple-product-copy');
        checkboxes.off('change').on('change', function (e) {
          e.preventDefault();
          var t = $(this),
            p = t.parent();
          if (!t.is(':checked')) {
            $('input[name="' + t.attr('name') + '"]').prop('checked', false);
            $('#bulk_add_to_cart').prop('checked', false);
            $('#bulk_add_to_cart2').prop('checked', false);
          }
          p.removeClass('checked').removeClass('unchecked').addClass(t.is(':checked') ? 'checked' : 'unchecked');
          if (link.length > 0) {
            var isChecked = checkboxes.is(':checked');
            if (isChecked) {
              link.show();
            } else {
              link.hide();
            }
            var row = $(this).closest('tr');
            var itemId = row.attr('data-item-id');
            var existingItemId = link.attr('data-item-id');
            if (t.is(':checked')) {
              if (existingItemId) {
                existingItemId = existingItemId.split(',');
                existingItemId.push(itemId);
                existingItemId = existingItemId.join(',');
              } else {
                existingItemId = itemId;
              }
            } else {
              if (existingItemId) {
                existingItemId = existingItemId.split(',');
                var index = existingItemId.indexOf(itemId);
                if (index !== -1) {
                  existingItemId.splice(index, 1);
                }
                existingItemId = existingItemId.join(',');
              }
            }
            link.attr('data-item-id', existingItemId);
          }
          return false;
        }).trigger('change');
      },
      /**
       * Init js handling on wishlist table items after ajax update
       *
       * @return void
       */
      init_handling_after_ajax: function init_handling_after_ajax() {
        this.init_prepare_qty_links();
        this.init_checkbox_handling();
        // this.init_quantity();
        // this.init_copy_wishlist_link();
        // this.init_tooltip();
        // this.init_components();
        // this.init_layout();
        this.init_drag_n_drop();
        // this.init_popup_checkbox_handling();
        this.init_dropdown_lists();
        $(document).trigger('wlfmc_init_after_ajax');
      },
      /**
       * Handle quantity input change for each wishlist item
       *
       * @return void
       */
      init_quantity: function init_quantity() {
        var jqxhr, timeout;
        $(document).on('change', '.wlfmc-wishlist-table .quantity :input, .wlfmc-save-for-later-table .quantity :input', function () {
          var t = $(this),
            row = t.closest('[data-row-id]'),
            product_id = row.data('row-id'),
            cart_item_key = row.data('cart-item-key'),
            table = t.closest('.wlfmc-wishlist-table,.wlfmc-save-for-later-table'),
            token = table.data('token');
          clearTimeout(timeout);

          // set add to cart link to add specific qty to cart.
          row.find('.add_to_cart_button').attr('data-quantity', t.val());
          timeout = setTimeout(function () {
            if (jqxhr) {
              jqxhr.abort();
            }
            jqxhr = $.ajax({
              url: wlfmc_l10n.ajax_url,
              data: {
                action: wlfmc_l10n.actions.update_item_quantity,
                nonce: table.data('nonce'),
                context: 'frontend',
                product_id: product_id,
                cart_item_key: cart_item_key,
                wishlist_token: token,
                quantity: t.val()
                //fragments: retrieve_fragments()
              },
              method: 'POST',
              beforeSend: function beforeSend(xhr) {
                if (wlfmc_l10n.ajax_mode === 'rest_api') {
                  xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
                }
                $.fn.WLFMC.block(row);
              },
              complete: function complete() {
                $.fn.WLFMC.unblock(row);
              },
              success: function success(response) {
                $.fn.WLFMC.load_fragments();
                /*if (typeof response.fragments !== 'undefined') {
                	replace_fragments( response.fragments );
                	init_handling_after_ajax();
                }*/
              }
            });
          }, 1000);
        });
      },
      init_popups: function init_popups() {
        $('body').on('click', '.wlfmc-popup-trigger:not(.wlfmc-disabled)', function (ev) {
          ev.preventDefault();
          var id = $(this).data('popup-id');
          var elem = $('#' + id);
          var popup_wrapper = $('#' + id + '_wrapper');
          if (!popup_wrapper.length) {
            var defaultOptions = {
              absolute: false,
              color: '#333',
              transition: 'all 0.3s',
              horizontal: elem.data('horizontal'),
              vertical: elem.data('vertical')
            };
            elem.popup(defaultOptions);
          }
          $('#wlfmc-tooltip').css({
            'top': '0',
            'left': '0'
          }).removeClass().addClass('tooltip__hidden');
          $('#' + id).popup('show');
          return false;
        });
        $('body').on('click', '.wlfmc-popup-close', function (ev) {
          ev.preventDefault();
          var id = $(this).data('popup-id');
          $('#' + id).popup('hide');
          return false;
        });
      },
      init_layout: function init_layout() {
        var jqxhr, timeout;
        $(document).on('click', '.wlfmc-toggle-layout', function (ev) {
          ev.preventDefault();
          var elem = $(this);
          elem.toggleClass('list').toggleClass('grid');
          elem.closest('.wlfmc-wishlist-form').find('.wlfmc-list').toggleClass('view-mode-list').toggleClass('view-mode-grid');
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            if (jqxhr) {
              jqxhr.abort();
            }
            jqxhr = $.ajax({
              url: wlfmc_l10n.ajax_url,
              data: {
                action: wlfmc_l10n.actions.change_layout,
                nonce: elem.data('nonce'),
                context: 'frontend',
                new_layout: elem.hasClass('list') ? 'grid' : 'list'
              },
              method: 'POST',
              beforeSend: function beforeSend(xhr) {
                if (wlfmc_l10n.ajax_mode === 'rest_api') {
                  xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
                }
              },
              complete: function complete() {
                // anything.
              }
            });
          }, 1000);
          return false;
        });
      },
      init_components: function init_components() {
        $(document).on('click', '.wlfmc-list .product-components', function (e) {
          e.preventDefault();
          var $this = $(this);
          var elem = $this.closest('tr');
          var $metaData = elem.find('.wlfmc-absolute-meta-data');
          var $next = elem.next('.wlfmc-row-meta-data').filter('.wlfmc-row-meta-data');
          var isNextHidden = $next.hasClass('hide');
          $metaData.fadeToggle();
          $next.toggleClass('hide');
          elem.toggleClass('show-meta-data', isNextHidden);
          return false;
        });
        $(document).on('click', '.wlfmc-list .close-components', function (e) {
          e.preventDefault();
          var elem = $(this).closest('tr');
          elem.find('.wlfmc-absolute-meta-data').fadeToggle();
          elem.removeClass('show-meta-data');
          return false;
        });
      },
      init_popup_checkbox_handling: function init_popup_checkbox_handling() {
        $(document).on('change', '.list-item-checkbox', function () {
          var selectedItem = $(this).closest('.list-item');
          var parentContainer = $(this).closest('.wlfmc-add-to-list-container, .wlfmc-move-to-list-wrapper, .wlfmc-copy-to-list-wrapper');
          if (parentContainer.hasClass('wlfmc-add-to-list-container')) {
            if ($(this).is(':checked')) {
              selectedItem.addClass('selected');
            } else {
              selectedItem.removeClass('selected');
            }
          }
          if (parentContainer.hasClass('wlfmc-move-to-list-wrapper') || parentContainer.hasClass('wlfmc-copy-to-list-wrapper')) {
            var checkboxes = parentContainer.find('input[type="checkbox"]');
            parentContainer.find('.list-item').removeClass('selected');
            if ($(this).is(':checked')) {
              selectedItem.addClass('selected');
              checkboxes.not($(this)).prop('checked', false);
            }
          }
        });
      },
      init_dropdown_lists: function init_dropdown_lists() {
        var dropdownElement = $('#wlfmc_my_lists');
        if (!dropdownElement || dropdownElement.length === 0) {
          return;
        }
        if (dropdownElement.data('editable-select')) {
          dropdownElement.wlfmcDropDown('destroy');
        }
        dropdownElement.on('select.editable-select', function (e, li) {
          if (typeof li !== 'undefined') {
            $(this).closest('.wlfmc-dropdown-wrapper').addClass('wlfmc-action wlfmc-loading-alt wlfmc-inverse');
            $(this).val($(this).closest('.wlfmc-dropdown-wrapper').find('.list-item[data-wishlist-id="' + li.val() + '"] .list-name').text());
            window.location.href = $(this).closest('.wlfmc-dropdown-wrapper').find('.list-item[data-wishlist-id="' + li.val() + '"]').data('url');
          }
        }).wlfmcDropDown({
          effects: 'slide'
        });
      },
      /**
       * Init handling for copy button
       *
       * @return void
       */
      init_copy_wishlist_link: function init_copy_wishlist_link() {
        $(document).on('click', '.copy-link-trigger', function (e) {
          e.stopImmediatePropagation();
          e.preventDefault();
          var obj_to_copy = $(this);
          var hidden = $('<input/>', {
            val: obj_to_copy.attr('data-href'),
            type: 'text'
          });
          $('body').append(hidden);
          if ($.fn.WLFMC.isOS()) {
            hidden[0].setSelectionRange(0, 9999);
          } else {
            hidden.select();
          }
          document.execCommand('copy');
          hidden.remove();
          toastr.success(wlfmc_l10n.labels.link_copied);
          return false;
        });
      },
      /**
       * Retrieve fragments that need to be refreshed in the page
       *
       * @param search string Ref to search among all fragments in the page
       * @return object Object containing a property for each fragment that matches search
       */
      retrieve_fragments: function retrieve_fragments(search) {
        var options = {},
          fragments = null;
        if (search) {
          if (_typeof2(search) === 'object') {
            search = $.extend({
              fragments: null,
              s: '',
              container: $(document),
              firstLoad: false
            }, search);
            if (!search.fragments) {
              fragments = search.container.find('.wlfmc-wishlist-fragment');
            } else {
              fragments = search.fragments;
            }
            if (search.s) {
              fragments = fragments.not('[data-fragment-ref]').add(fragments.filter('[data-fragment-ref="' + search.s + '"]'));
            }
            if (search.firstLoad) {
              fragments = fragments.filter('.on-first-load');
            }
          } else {
            fragments = $('.wlfmc-wishlist-fragment');
            if (typeof search === 'string' || typeof search === 'number') {
              fragments = fragments.not('[data-fragment-ref]').add(fragments.filter('[data-fragment-ref="' + search + '"]'));
            }
          }
        } else {
          fragments = $('.wlfmc-wishlist-fragment');
        }
        if (fragments.length) {
          fragments.each(function () {
            var t = $(this),
              id = t.attr('class').split(' ').filter(function (val) {
                return val.length && val !== 'exists';
              }).join(wlfmc_l10n.fragments_index_glue);
            options[id] = t.data('fragment-options');
          });
        } else {
          return null;
        }
        return options;
      },
      /**
       * Load fragments on page loading
       *
       * @param search string Ref to search among all fragments in the page
       * @param success function
       * @param successArgs array
       */
      load_fragments: function load_fragments(search, _success, successArgs) {
        clearTimeout(fragmenttimeout);
        fragmenttimeout = setTimeout(function () {
          if (fragmentxhr) {
            fragmentxhr.abort();
          }
          search = $.extend({
            firstLoad: true
          }, search);
          var fragments = $.fn.WLFMC.retrieve_fragments(search);
          // create a new FormData object.
          var formData = new FormData();
          formData.append('action', wlfmc_l10n.actions.load_fragments);
          formData.append('context', 'frontend');
          if (fragments) {
            // convert object to JSON string.
            var fragmentJson = JSON.stringify(fragments);
            // create a file from JSON string.
            var file = new File([fragmentJson], 'fragment.json');
            formData.append('fragments_file', file);
          }
          fragmentxhr = $.ajax({
            url: wlfmc_l10n.admin_url,
            // ajax_url,
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            /*beforeSend: function (xhr) {
            	if (wlfmc_l10n.ajax_mode === 'rest_api') {
            		xhr.setRequestHeader( 'X-WP-Nonce', wlfmc_l10n.nonce );
            	}
            },*/
            success: function success(data) {
              if (typeof data.fragments !== 'undefined') {
                if (typeof _success === 'function') {
                  _success.apply(null, successArgs);
                }
                $.fn.WLFMC.replace_fragments(data.fragments);
                $.fn.WLFMC.init_handling_after_ajax();

                // $( document ).trigger( 'wlfmc_fragments_loaded', [fragments, data.fragments, search.firstLoad] );
              }
              $('#wlfmc-lists,#wlfmc-wishlist-form').addClass('on-first-load');
              if (typeof data.products !== 'undefined') {
                $.fn.WLFMC.set_products_hash(JSON.stringify(data.products));
              }
              if (typeof data.waitlist !== 'undefined') {
                $.fn.WLFMC.set_waitlist_hash(JSON.stringify(data.waitlist));
              }
              if (typeof data.lang !== 'undefined') {
                $.fn.WLFMC.set_lang_hash(data.lang);
              }
            }
          });
        }, 100);
      },
      /**
       * Replace fragments with template received
       *
       * @param fragments array Array of fragments to replace
       */
      replace_fragments: function replace_fragments(fragments) {
        $.each(fragments, function (i, v) {
          var itemSelector = '.' + i.split(wlfmc_l10n.fragments_index_glue).filter(function (val) {
              return val.length && val !== 'exists' && val !== 'with-count';
            }).join('.'),
            toReplace = $(itemSelector);
          // find replace template.
          var replaceWith = $(v).filter(itemSelector);
          if (!replaceWith.length) {
            replaceWith = $(v).find(itemSelector);
          }
          if (toReplace.length && replaceWith.length) {
            toReplace.replaceWith(replaceWith);
          }
        });
      },
      /* === EVENT HANDLING === */

      load_automations: function load_automations(product_id, wishlist_id, customer_id, list_type, nonce) {
        $.ajax({
          url: wlfmc_l10n.ajax_url,
          data: {
            action: wlfmc_l10n.actions.load_automations,
            nonce: nonce,
            context: 'frontend',
            product_id: parseInt(product_id),
            wishlist_id: parseInt(wishlist_id),
            customer_id: parseInt(customer_id),
            list_type: list_type
          },
          method: 'POST',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
          },
          complete: function complete() {
            // anything.
          }
        });
      },
      add_to_save_for_later: function add_to_save_for_later(cart_item_key, elem) {
        var data = {
          action: wlfmc_l10n.actions.add_to_save_for_later_action,
          nonce: wlfmc_l10n.ajax_nonce.add_to_save_for_later_nonce,
          context: 'frontend',
          add_to_save_for_later: cart_item_key,
          merge_save_for_later: wlfmc_l10n.merge_save_for_later,
          remove_from_cart_item: wlfmc_l10n.remove_from_cart_item
          //fragments: retrieve_fragments()
        };
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.ajax({
          url: wlfmc_l10n.save_for_later_ajax_url,
          data: data,
          type: 'POST',
          //dataType: 'json',
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            if (elem && elem.length) {
              $.fn.WLFMC.loading(elem);
            }
          },
          complete: function complete() {
            if (elem && elem.length) {
              $.fn.WLFMC.unloading(elem);
            }
          },
          success: function success(response) {
            var response_result = response.result,
              response_message = response.message,
              show_toast = true;
            if ('true' === response_result) {
              $.fn.WLFMC.load_fragments();
              /*if (typeof response.fragments !== 'undefined') {
              	replace_fragments( response.fragments );
              }*/

              if (show_toast && '' !== $.trim(wlfmc_l10n.labels.sfl_product_added_text)) {
                toastr.success(wlfmc_l10n.labels.sfl_product_added_text);
              }
              var automation_list_type = wlfmc_l10n.merge_save_for_later ? wlfmc_l10n.merge_lists ? 'lists' : 'wishlist' : 'save-for-later';
              $.fn.WLFMC.load_automations(response.product_id, response.wishlist_id, response.customer_id, automation_list_type, response.load_automation_nonce);
              if (response.count !== 'undefined') {
                $('.wlfmc-tabs-wrapper').attr('data-count', response.count);
              }
              $(document.body).trigger('wc_update_cart');
            }
            if (show_toast && '' !== $.trim(response.message) && response_result !== 'true') {
              toastr.error(response_message);
            }
          }
        });
      },
      check_waitlist_modules: function check_waitlist_modules(data, product_id, variation_id) {
        if (!product_id || !variation_id) {
          return;
        }
        var product_type = 'variation';
        if (!data) {
          variation_id = product_id;
          product_type = 'variable';
        }
        var targets = $('.wlfmc-add-to-waitlist [data-parent-product-id="' + product_id + '"]'),
          target_boxes = $('.wlfmc-add-to-outofstock [data-parent-product-id="' + product_id + '"]');
        target_boxes.each(function () {
          var t = $(this),
            container = t.closest('.wlfmc-add-to-outofstock');
          t.attr('data-parent-product-id', product_id);
          t.attr('data-product-id', variation_id);
          container.removeClass(function (i, classes) {
            return classes.match(/wlfmc-add-to-outofstock-\S+/g).join(' ');
          }).addClass('wlfmc-add-to-outofstock-' + variation_id).removeClass('exists');
          var outofstockbox = $('.wlfmc-add-to-outofstock-' + variation_id);
          if (outofstockbox.length === 0) {
            outofstockbox = $('.wlfmc-add-to-outofstock-' + product_id);
          }
          if (null !== data) {
            if (data.wlfmc_hide_back_in_stock || $.fn.WLFMC.isTrue(data.exclude_back_in_stock)) {
              outofstockbox.addClass('hide');
            } else {
              outofstockbox.removeClass('hide'); // show outofstock box.
            }
          } else {
            var out_of_stock = outofstockbox.data('product-outofstock');
            if ($.fn.WLFMC.isTrue(out_of_stock)) {
              outofstockbox.removeClass('hide');
            } else {
              outofstockbox.addClass('hide');
            }
          }
          $.each(product_in_waitlist, function (i, v) {
            if (typeof v !== 'undefined' && v.product_id && v.product_id === variation_id) {
              var outofstockbox = $('.wlfmc-add-to-outofstock-' + v.product_id);
              outofstockbox.removeClass('exists');
              outofstockbox.each(function () {
                if ($.fn.WLFMC.isTrue(v.back_in_stock)) {
                  $(this).addClass('exists');
                }
              });
            }
          });
          outofstockbox.find('.wlfmc-add-button > a').attr('data-parent-product-id', product_id).attr('data-product-id', variation_id).attr('data-product-type', product_type);
        });
        targets.each(function () {
          var t = $(this),
            container = t.closest('.wlfmc-add-to-waitlist'),
            popup = $('#' + t.closest('.wlfmc-add-to-waitlist').data('popup-id')),
            backinstock_checkbox = popup.length ? popup.find('input[name="list_back-in-stock"]') : false,
            pricechange_checkbox = popup.length ? popup.find('input[name="list_price-change"]') : false,
            lowstock_checkbox = popup.length ? popup.find('input[name="list_low-stock"]') : false,
            onsale_checkbox = popup.length ? popup.find('input[name="list_on-sale"]') : false,
            available_modules = container.data('available-lists');
          container.removeClass('opacity-half');
          if (data) {
            if (data.is_in_stock) {
              if (lowstock_checkbox.length > 0) {
                if (data.enable_low_stock && $.fn.WLFMC.isTrue(data.enable_low_stock) && !$.fn.WLFMC.isTrue(data.exclude_low_stock)) {
                  lowstock_checkbox.closest('.list-item').removeClass('hide');
                } else {
                  lowstock_checkbox.closest('.list-item').addClass('hide');
                }
              }
              if (pricechange_checkbox.length > 0) {
                if ($.fn.WLFMC.isTrue(data.exclude_price_change)) {
                  pricechange_checkbox.closest('.list-item').addClass('hide');
                } else {
                  pricechange_checkbox.closest('.list-item').removeClass('hide');
                }
              }
              if (backinstock_checkbox.length > 0) {
                if (data.wlfmc_hide_back_in_stock) {
                  backinstock_checkbox.closest('.list-item').addClass('hide');
                } else {
                  backinstock_checkbox.closest('.list-item').removeClass('hide');
                }
              }
              if (onsale_checkbox.length > 0) {
                if (data.display_price !== data.display_regular_price || $.fn.WLFMC.isTrue(data.exclude_on_sale)) {
                  onsale_checkbox.closest('.list-item').addClass('hide');
                } else {
                  onsale_checkbox.closest('.list-item').removeClass('hide');
                }
              }

              // hide add to waitlist buttons if not active modules in popup.
              if (!popup.find('.wlfmc-waitlist-select-type .list-item:not(.hide)').length) {
                container.addClass('opacity-half');
              }
            } else if (_typeof2(available_modules) === "object" && 'back-in-stock' in available_modules && !$.fn.WLFMC.isTrue(data.exclude_back_in_stock)) {
              if (backinstock_checkbox.length > 0) {
                backinstock_checkbox.closest('.list-item').removeClass('hide');
              }
              if (pricechange_checkbox.length > 0) {
                pricechange_checkbox.closest('.list-item').addClass('hide');
              }
              if (lowstock_checkbox.length > 0) {
                lowstock_checkbox.closest('.list-item').addClass('hide');
              }
              if (onsale_checkbox.length > 0) {
                onsale_checkbox.closest('.list-item').addClass('hide');
              }
            } else {
              container.addClass('opacity-half'); // hide add to waitlist buttons.
            }
          }
          t.attr('data-parent-product-id', product_id);
          t.attr('data-product-id', variation_id);
          popup.find('input[name="list_back-in-stock"]').prop('checked', false);
          popup.find('input[name="list_price-change"]').prop('checked', false);
          popup.find('input[name="list_on-sale"]').prop('checked', false);
          popup.find('input[name="list_low-stock"]').prop('checked', false);
          container.removeClass(function (i, classes) {
            return classes.match(/wlfmc-add-to-waitlist-\S+/g).join(' ');
          }).addClass('wlfmc-add-to-waitlist-' + variation_id).removeClass('exists');
          $.each(product_in_waitlist, function (i, v) {
            if (typeof v !== 'undefined' && v.product_id && v.product_id == variation_id) {
              if ($.fn.WLFMC.isTrue(v.price_change) || $.fn.WLFMC.isTrue(v.on_sale) || $.fn.WLFMC.isTrue(v.low_stock) || $.fn.WLFMC.isTrue(v.back_in_stock) && popup.find('input[name="list_back-in-stock"]').length > 0) {
                container.addClass('exists');
              }
              if ($.fn.WLFMC.isTrue(v.back_in_stock)) {
                popup.find('input[name="list_back-in-stock"]').prop('checked', true);
              }
              if ($.fn.WLFMC.isTrue(v.price_change)) {
                popup.find('input[name="list_price-change"]').prop('checked', true);
              }
              if ($.fn.WLFMC.isTrue(v.on_sale)) {
                popup.find('input[name="list_on-sale"]').prop('checked', true);
              }
              if ($.fn.WLFMC.isTrue(v.low_stock)) {
                popup.find('input[name="list_low-stock"]').prop('checked', true);
              }
            }
          });
          popup.find('.wlfmc_add_to_waitlist').attr('data-parent-product-id', product_id).attr('data-product-id', variation_id).attr('data-product-type', product_type);
          if ('variable' === product_type && $.fn.WLFMC.isTrue(wlfmc_l10n.waitlist_required_product_variation)) {
            container.find('.wlfmc-popup-trigger').addClass('wlfmc-disabled');
          } else {
            container.find('.wlfmc-popup-trigger').removeClass('wlfmc-disabled');
          }
        });
      },
      check_products: function check_products(products) {
        if (null !== products) {
          product_in_list = [];
          var counter_items = $('.wlfmc-products-counter-wrapper .wlfmc-counter-item');
          if (counter_items.length && product_in_list.length) {
            counter_items.each(function () {
              var p_id = $(this).attr('data-row-id');
              if (!$.grep(product_in_list, function (item) {
                return item.product_id === p_id;
              }).length) {
                $('.wlfmc-products-counter-wrapper').find('[data-row-id="' + p_id + '"]').remove();
              }
            });
          }
          var table_items = $('.wlfmc-wishlist-form .wlfmc-table-item');
          if (table_items.length && product_in_list.length) {
            table_items.each(function () {
              var p_id = $(this).attr('data-row-id');
              if (!$.grep(product_in_list, function (item) {
                return item.product_id === p_id;
              }).length) {
                $('.wlfmc-wishlist-form').find('[data-row-id="' + p_id + '"]').remove();
              }
            });
          }
          $('.wlfmc-add-to-wishlist').removeClass('exists');
          $.each(products, function (id, itemData) {
            var same_products = $('.wlfmc-add-to-wishlist-' + itemData.product_id);
            same_products.each(function () {
              $(this).addClass('exists');
              $(this).find('.wlfmc_delete_item').attr('data-item-id', itemData.item_id);
              $(this).find('.wlfmc_delete_item').attr('data-wishlist-id', itemData.wishlist_id);
            });
            $('.wlfmc-products-counter-wrapper  .products-counter-number').text(itemData.length);
            $('.wlfmc-products-counter-wishlist .total-products .wlfmc-total-count').text(itemData.length);
            product_in_list.push(itemData);
          });
        }
      },
      check_waitlist_products: function check_waitlist_products(products) {
        if (null !== products) {
          product_in_waitlist = [];
          var counter_items = $('.wlfmc-waitlist-counter-wrapper .wlfmc-counter-item');
          if (counter_items.length && product_in_waitlist.length) {
            counter_items.each(function () {
              var p_id = $(this).attr('data-row-id');
              if (!$.grep(product_in_waitlist, function (item) {
                return item.product_id === p_id;
              }).length) {
                $('.wlfmc-waitlist-counter-wrapper').find('[data-row-id="' + p_id + '"]').remove();
              }
            });
          }
          var table_items = $('.wlfmc-waitlist-table .wlfmc-table-item');
          if (table_items.length && product_in_waitlist.length) {
            table_items.each(function () {
              var p_id = $(this).attr('data-row-id');
              if (!$.grep(product_in_waitlist, function (item) {
                return item.product_id === p_id;
              }).length) {
                $('.wlfmc-waitlist-table').find('[data-row-id="' + p_id + '"]').remove();
              }
            });
          }
          $('.wlfmc-add-to-outofstock').removeClass('exists');
          $('.wlfmc-add-to-waitlist').removeClass('exists');
          $.each(products, function (id, itemData) {
            var same_products = $('.wlfmc-add-to-waitlist-' + itemData.product_id);
            same_products.each(function () {
              var popup = $('#' + $(this).data('popup-id'));
              if ($.fn.WLFMC.isTrue(itemData.price_change) || $.fn.WLFMC.isTrue(itemData.on_sale) || $.fn.WLFMC.isTrue(itemData.low_stock) || $.fn.WLFMC.isTrue(itemData.back_in_stock) && popup.find('input[name="list_back-in-stock"]').length > 0) {
                $(this).addClass('exists');
              }
              if ($.fn.WLFMC.isTrue(itemData.back_in_stock)) {
                popup.find('input[name="list_back-in-stock"]').prop('checked', true);
              } else {
                popup.find('input[name="list_back-in-stock"]').prop('checked', false);
              }
              if ($.fn.WLFMC.isTrue(itemData.price_change)) {
                popup.find('input[name="list_price-change"]').prop('checked', true);
              } else {
                popup.find('input[name="list_price-change"]').prop('checked', false);
              }
              if ($.fn.WLFMC.isTrue(itemData.on_sale)) {
                popup.find('input[name="list_on-sale"]').prop('checked', true);
              } else {
                popup.find('input[name="list_on-sale"]').prop('checked', false);
              }
              if ($.fn.WLFMC.isTrue(itemData.low_stock)) {
                popup.find('input[name="list_low-stock"]').prop('checked', true);
              } else {
                popup.find('input[name="list_low-stock"]').prop('checked', false);
              }
            });
            var outofstockbox = $('.wlfmc-add-to-outofstock-' + itemData.product_id);
            outofstockbox.each(function () {
              if ($.fn.WLFMC.isTrue(itemData.back_in_stock)) {
                $(this).addClass('exists');
              }
            });
            $('.wlfmc-waitlist-counter-wrapper  .products-counter-number').text(itemData.length);
            $('.wlfmc-products-counter-waitlist .total-products .wlfmc-total-count').text(itemData.length);
            product_in_waitlist.push(itemData);
          });
        }
      },
      /** Set the wishlist hash in both session and local storage */
      set_products_hash: function set_products_hash(products) {
        if ($supports_html5_storage) {
          localStorage.setItem(products_hash_key, products);
          sessionStorage.setItem(products_hash_key, products);
        }
        $.fn.WLFMC.check_products(JSON.parse(products));
      },
      /** Set the waitlist hash in both session and local storage */
      set_waitlist_hash: function set_waitlist_hash(products) {
        if ($supports_html5_storage) {
          localStorage.setItem(waitlist_hash_key, products);
          sessionStorage.setItem(waitlist_hash_key, products);
        }
        $.fn.WLFMC.check_waitlist_products(JSON.parse(products));
      },
      set_lang_hash: function set_lang_hash(lang) {
        if ($supports_html5_storage) {
          localStorage.setItem(lang_hash_key, lang);
          sessionStorage.setItem(lang_hash_key, lang);
        }
      },
      validateEmail: function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      /**
       * Check if passed value could be considered true
       */
      isTrue: function isTrue(value) {
        return true === value || 'yes' === value || '1' === value || 1 === value || 'true' === value;
      },
      /**
       * Check if device is an IOS device
       */
      isOS: function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
      },
      /**
       * Add loading to element
       *
       * @param item jQuery object
       * @return void
       */
      loading: function loading(item) {
        if (item.find('i').length > 0) {
          item.addClass('wlfmc-action wlfmc-loading');
        } else {
          item.addClass('wlfmc-action wlfmc-loading-alt');
        }
      },
      /**
       * Remove loading to element
       *
       * @param item jQuery object
       * @return void
       */
      unloading: function unloading(item) {
        item.removeClass('wlfmc-loading wlfmc-loading-alt');
      },
      /**
       * Block item if possible
       *
       * @param item jQuery object
       * @return void
       */
      block: function block(item) {
        if (typeof $.fn.block !== 'undefined' && wlfmc_l10n.enable_ajax_loading) {
          item.fadeTo('400', '0.6').block({
            message: null,
            overlayCSS: {
              background: 'transparent url(' + wlfmc_l10n.ajax_loader_url + ') no-repeat center',
              backgroundSize: '40px 40px',
              opacity: 1
            }
          });
        }
      },
      table_block: function table_block() {
        if (typeof $.fn.block !== 'undefined') {
          $('.wlfmc-wishlist-table-wrapper, .wlfmc-save-for-later-table-wrapper').fadeTo('400', '0.6').block({
            message: null,
            overlayCSS: {
              background: 'transparent url(' + wlfmc_l10n.ajax_loader_url + ') no-repeat center',
              backgroundSize: '80px 80px',
              opacity: 1
            }
          });
        }
      },
      /**
       * Unblock item if possible
       *
       * @param item jQuery object
       * @return void
       */
      unblock: function unblock(item) {
        if (typeof $.fn.unblock !== 'undefined') {
          item.stop(true).css('opacity', '1').unblock();
          $('.tooltip__expanded').removeClass().addClass('tooltip__hidden');
        }
      },
      /**
       * Check if cookies are enabled
       *
       * @return boolean
       */
      is_cookie_enabled: function is_cookie_enabled() {
        if (navigator.cookieEnabled) {
          return true;
        }

        // set and read cookie.
        document.cookie = 'cookietest=1';
        var ret = document.cookie.indexOf('cookietest=') !== -1;

        // delete cookie.
        document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return ret;
      },
      setCookie: function setCookie(cookie_name, value) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + 365 * 25);
        document.cookie = cookie_name + "=" + escape(value) + "; expires=" + exdate.toUTCString() + "; path=/";
      },
      updateURLParameter: function updateURLParameter(url, param, paramVal) {
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
          tempArray = additionalURL.split("&");
          for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] !== param) {
              newAdditionalURL += temp + tempArray[i];
              temp = "&";
            }
          }
        }
        var rows_txt = temp + "" + param + "=" + paramVal.replace('#', '');
        return baseURL + "?" + newAdditionalURL + rows_txt;
      },
      getUrlParameter: function getUrlParameter(url, sParam) {
        var sPageURL = decodeURIComponent(url.substring(1)),
          sURLVariables = sPageURL.split(/[&|?]+/),
          sParameterName,
          i;
        for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
          }
        }
      }
    };
    ;
    toastr.options = {
      tapToDismiss: true,
      toastClass: 'toast',
      containerId: 'toast-container',
      debug: false,
      closeButton: false,
      showMethod: 'fadeIn',
      showDuration: 300,
      showEasing: 'swing',
      onShown: undefined,
      hideMethod: 'fadeOut',
      hideDuration: 1000,
      hideEasing: 'swing',
      onHidden: undefined,
      closeMethod: false,
      closeDuration: false,
      closeEasing: false,
      closeOnHover: true,
      extendedTimeOut: 20000,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      iconClass: 'toast-info',
      positionClass: wlfmc_l10n.toast_position === 'default' ? wlfmc_l10n.is_rtl ? 'toast-top-right' : 'toast-top-left' : wlfmc_l10n.toast_position,
      timeOut: 5000,
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      escapeHtml: false,
      target: 'body',
      newestOnTop: true,
      preventDuplicates: false,
      progressBar: true,
      progressClass: 'toast-progress',
      rtl: wlfmc_l10n.is_rtl ? true : false
    };
    if (wlfmc_l10n.is_save_for_later_enabled && wlfmc_l10n.is_save_for_later_popup_remove_enabled) {
      $('.woocommerce-cart-form .product-remove a.remove').off('click').unbind('click').data('events', null);
      $('body').on('click', 'form.woocommerce-cart-form a.remove', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var t = $(this);
        remove_item_url = t.attr('href');
        var elem = $('#add_to_save_for_later_popup');
        var defaultOptions = {
          absolute: false,
          color: '#333',
          transition: 'all 0.3s',
          horizontal: elem.data('horizontal'),
          vertical: elem.data('vertical')
        };
        elem.popup(defaultOptions);
        elem.popup('show');
        return false;
      });
    }
    ;
    $(document).on('wlfmc_init', function () {
      $.fn.WLFMC.init_fix_on_image_single_position();
      var t = $(this),
        b = $('body'),
        cart_redirect_after_add = typeof wc_add_to_cart_params !== 'undefined' && wc_add_to_cart_params !== null ? wc_add_to_cart_params.cart_redirect_after_add : '';
      b.on('click', '.wlfmc-list button[name="apply_bulk_actions"]', function (ev) {
        var elem = $(this).closest('.action-wrapper').find('select[name="bulk_actions"]');
        var quantity_fields = $(this).closest('form').find('input.qty');
        if (elem.length > 0 && 'delete' === elem.val() && quantity_fields.length > 0) {
          quantity_fields.attr("disabled", true);
        }
      });
      b.on('change', '#bulk_add_to_cart,#bulk_add_to_cart2', function () {
        var t = $(this),
          checkboxes = t.closest('.wlfmc-wishlist-table,.wlfmc-save-for-later-table').find('[data-row-id]').find('input[type="checkbox"]:not(:disabled)');
        if (t.is(':checked')) {
          checkboxes.prop('checked', 'checked').trigger('change');
          $('#bulk_add_to_cart').prop('checked', 'checked');
          $('#bulk_add_to_cart2').prop('checked', 'checked');
        } else {
          checkboxes.prop('checked', false).trigger('change');
          $('#bulk_add_to_cart').prop('checked', false);
          $('#bulk_add_to_cart2').prop('checked', false);
        }
      });
      b.on('submit', '.wlfmc-popup-form', function () {
        return false;
      });
      t.on('found_variation', function (ev, variation) {
        var t = $(ev.target),
          product_id = t.data('product_id'),
          variation_data = variation;
        variation_data.product_id = product_id;
        $(document).trigger('wlfmc_show_variation', variation_data);
      });
      t.on('wlfmc_reload_fragments', $.fn.WLFMC.load_fragments);
      t.on('wlfmc_fragments_loaded', function (ev, original, update, firstLoad) {
        if (!firstLoad) {
          return;
        }
        $('.variations_form').find('.variations select').last().trigger('change');
      });

      /* === TABS === */
      b.on('click', '.wlfmc-tabs a:not(.external-link)', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var content = $(this).data('content');
        $('.wlfmc-tab-content').hide();
        $(this).closest('.wlfmc-tabs-wrapper').removeClass('active-tab-cart active-tab-save-for-later');
        $(this).closest('.wlfmc-tabs-wrapper').addClass('active-tab-' + content);
        $(this).closest('.wlfmc-tabs-wrapper').find('.wlfmc-tabs a').removeClass('nav-tab-active');
        $(this).addClass('nav-tab-active');
        $('.wlfmc_content_' + content).show();
        window.history.replaceState('', '', $.fn.WLFMC.updateURLParameter(window.location.href, "tab", content));
        return false;
      });

      /* === GDPR === */
      b.on('click', '.wlfmc-gdpr-btn', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var elem = $(this),
          action_type = elem.data('action'),
          cid = elem.data('cid');
        $.ajax({
          url: wlfmc_l10n.ajax_url,
          data: {
            action: wlfmc_l10n.actions.gdpr_action,
            nonce: elem.data('nonce'),
            context: 'frontend',
            'action_type': action_type,
            'cid': cid
          },
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(elem);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(elem);
          },
          success: function success(data) {
            if (!data) {
              return;
            }
            $('.wlfmc-gdpr-notice-wrapper, .wlfmc-unsubscribe-notice-wrapper').remove();
          }
        });
        return false;
      });
      ;
      t.on('click', 'body.elementor-editor-active .wlfmc-lists-header a,body.elementor-editor-active a.wlfmc-open-list-link', function (ev) {
        var href = $(this).attr('href');
        if (href && href !== '#' && href !== '#!') {
          $.fn.WLFMC.block($('.wlfmc-tab-content'));
          ev.stopImmediatePropagation();
          ev.preventDefault();
          $.ajax({
            url: href,
            type: 'GET',
            dataType: 'html',
            success: function success(data) {
              var $response = $(data),
                $header = $response.find('.wlfmc-lists-header'),
                $content = $response.find('.wlfmc-tab-content');
              if ($content) {
                $('.wlfmc-tab-content').replaceWith($content);
              }
              if ($header) {
                $('.wlfmc-lists-header').replaceWith($header);
              }
              if (href !== window.location.href) {
                window.history.pushState({
                  path: href
                }, '', href);
              }
            }
          });
          return false;
        }
      });
      ;
      /* === WISHLIST === */

      b.on('click', '.wlfmc_add_to_wishlist', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        if (product_adding && Array.isArray(product_in_list) && !product_in_list.length) {
          toastr.error(wlfmc_l10n.labels.product_adding);
          return;
        }
        var t = $(this),
          product_id = t.attr('data-product-id'),
          parent_product_id = t.attr('data-parent-product-id'),
          el_wrap = t.closest('.wlfmc-add-to-wishlist-' + product_id),
          filtered_data = null,
          data = {
            action: wlfmc_l10n.actions.add_to_wishlist_action,
            context: 'frontend',
            add_to_wishlist: product_id,
            product_type: t.attr('data-product-type')
            // wishlist_id: t.attr( 'data-wishlist-id' ),
            // fragments: retrieve_fragments( product_id )
          };
        // allow third party code to filter data.
        if (filtered_data === $(document).triggerHandler('wlfmc_add_to_wishlist_data', [t, data])) {
          data = filtered_data;
        }
        var current_product_form;
        if ($('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').length) {
          current_product_form = $('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').eq(0);
        } else if ($(this).closest('form.cart[method=post], form.vtajaxform[method=post]').length) {
          current_product_form = $(this).closest('form.cart[method=post], form.vtajaxform[method=post]').eq(0);
        } else if ($('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').length) {
          current_product_form = $('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').eq(0);
        } else if ($('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]').length) {
          var button = $('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]');
          current_product_form = button.closest('form').eq(0);
        }
        var formData = new FormData();
        if (typeof current_product_form !== 'undefined' && current_product_form.length > 0) {
          /*current_product_form.find( "input[name='add-to-cart']" ).attr( "disabled",true );
          current_product_form.find( "input[name='add-to-cart']" ).removeAttr( "disabled" );*/
          formData = new FormData(current_product_form.get(0));
          /*$.each(
          	current_product_form,
          	function( index, element ) {
          		$( element ).find( 'div.composite_component' ).not( ':visible' ).each(
          			function() {
          				var id = $( this ).attr( 'data-item_id' );
          				formData.append( 'wccp_component_selection_nil[' + id + ']' , '1' );
          			}
          		);
          	}
          );*/
          formData["delete"]('add-to-cart');
        } else {
          var add_to_cart_link = t.closest('.product.post-' + parent_product_id).find('.add_to_cart_button');
          if (add_to_cart_link.length) {
            data.quantity = add_to_cart_link.attr('data-quantity');
          }
        }
        $.each(data, function (key, valueObj) {
          formData.append(key, _typeof2(valueObj) === 'object' ? JSON.stringify(valueObj) : valueObj);
        });
        jQuery(document.body).trigger('wlfmc_adding_to_wishlist');
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          product_adding = false;
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.ajax({
          url: wlfmc_l10n.ajax_url,
          data: formData,
          type: 'POST',
          //dataType: 'json',
          contentType: false,
          processData: false,
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            product_adding = true;
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            product_adding = false;
            $.fn.WLFMC.unloading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              response_message = response.message,
              show_toast = true;
            if (response_result === 'true' || response_result === 'exists') {
              $.fn.WLFMC.load_fragments();
              if (response.item_id) {
                if (typeof product_in_list !== 'undefined' && product_in_list !== null) {
                  product_in_list.push({
                    wishlist_id: response.wishlist_id,
                    item_id: response.item_id,
                    product_id: parseInt(product_id)
                  });
                  $.fn.WLFMC.set_products_hash(JSON.stringify(product_in_list));
                }
              }
              var popup_id = el_wrap.attr('data-popup-id');
              if (popup_id) {
                show_toast = false;
                var elem = $('#' + popup_id);
                var defaultOptions = {
                  absolute: false,
                  color: '#333',
                  transition: 'all 0.3s',
                  horizontal: elem.data('horizontal'),
                  vertical: elem.data('vertical')
                };
                elem.popup(defaultOptions);
                $('#wlfmc-tooltip').css({
                  'top': '0',
                  'left': '0'
                }).removeClass().addClass('tooltip__hidden');
                elem.popup('show');
              }
              if (show_toast && '' !== $.trim(wlfmc_l10n.labels.product_added_text) && response_result === 'true') {
                toastr.success(wlfmc_l10n.labels.product_added_text);
              }
              if (response_result === 'true') {
                $.fn.WLFMC.load_automations(product_id, response.wishlist_id, response.customer_id, 'wishlist', response.load_automation_nonce);
              }
            }
            if (response_result === 'true' && wlfmc_l10n.click_behavior === 'add-redirect') {
              window.location.href = wlfmc_l10n.wishlist_page_url;
            }
            if (show_toast && '' !== $.trim(response.message) && response_result !== 'true') {
              toastr.error(response_message);
            }
            $.fn.WLFMC.init_handling_after_ajax();
            $('body').trigger('wlfmc_added_to_wishlist', [t, el_wrap]);
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_ajax_add_to_cart:not(.disabled)', function (ev) {
        var t = $(this),
          item_id = t.attr('data-item_id'),
          wishlist_id = t.attr('data-wishlist_id'),
          data = {
            action: wlfmc_l10n.actions.add_to_cart_action,
            nonce: t.data('nonce'),
            context: 'frontend',
            lid: item_id,
            wid: wishlist_id
          };
        ev.stopImmediatePropagation();
        ev.preventDefault();
        t.removeClass('added');
        t.addClass('loading');

        // Allow 3rd parties to validate and quit early.
        if (false === $(document.body).triggerHandler('should_send_ajax_request.adding_to_cart', [t])) {
          $(document.body).trigger('ajax_request_not_sent.adding_to_cart', [false, false, t]);
          return true;
        }
        $(document.body).trigger('adding_to_cart', [t, data]);
        $.ajax({
          url: wlfmc_l10n.admin_url,
          data: data,
          type: 'POST',
          dataType: 'json',
          success: function success(response) {
            if (!response) {
              return;
            }
            if (response.error || response.success && !$.fn.WLFMC.isTrue(response.success)) {
              if (response.product_url) {
                window.location = response.product_url;
                return;
              }
              if ('' !== wlfmc_l10n.labels.failed_add_to_cart_message) {
                toastr.error(wlfmc_l10n.labels.failed_add_to_cart_message);
              }
            } else {
              // Redirect to cart option.
              if ($.fn.WLFMC.isTrue(wc_add_to_cart_params.cart_redirect_after_add)) {
                window.location = wc_add_to_cart_params.cart_url;
                return;
              }
              $(document.body).trigger('wc_fragment_refresh');
              // Trigger event so themes can refresh other areas.
              $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, t]);
              if ('' !== wlfmc_l10n.labels.added_to_cart_message) {
                toastr.success(wlfmc_l10n.labels.added_to_cart_message);
              }
            }
            if (response.message && '' !== response.message) {
              $(document.body).trigger('add_to_cart_message', [response.message, t]);
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc-btn-login-need', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toastr.error(wlfmc_l10n.labels.login_need);
        return false;
      });
      b.on('click', '.wlfmc_already_in_wishlist', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toastr.error(wlfmc_l10n.labels.already_in_wishlist_text);
        return false;
      });
      b.on('click', '.wlfmc-wishlist-table .remove_from_wishlist', function (ev) {
        var t = $(this);
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var table = t.parents('.wlfmc-wishlist-items-wrapper'),
          row = t.parents('[data-row-id]'),
          data_row_id = row.data('row-id'),
          wishlist_id = table.data('id'),
          wishlist_token = table.data('token'),
          data = {
            action: wlfmc_l10n.actions.remove_from_wishlist_action,
            nonce: t.data('nonce'),
            context: 'frontend',
            remove_from_wishlist: data_row_id,
            wishlist_id: wishlist_id,
            wishlist_token: wishlist_token
            //fragments: retrieve_fragments( data_row_id )
          };
        $.ajax({
          url: wlfmc_l10n.ajax_url,
          data: data,
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.block(row);
          },
          complete: function complete() {
            $.fn.WLFMC.unblock(row);
          },
          success: function success(data) {
            var i;
            $.fn.WLFMC.load_fragments();
            /*if (typeof data.fragments !== 'undefined') {
            	replace_fragments( data.fragments );
            }*/

            if ($.fn.WLFMC.isTrue(data.result)) {
              row.addClass('disabled-row');
              if (typeof product_in_list !== 'undefined' && product_in_list !== null) {
                var product_count = product_in_list.length;
                for (i = 0; i <= product_count - 1; i++) {
                  if (typeof product_in_list[i] !== 'undefined' && product_in_list[i].wishlist_id == wishlist_id && product_in_list[i].product_id == data_row_id) {
                    product_in_list.splice(i, 1);
                    $('body').trigger('wlfmc_removed_from_wishlist', [t, row, data]);
                    break;
                  }
                }
                $.fn.WLFMC.set_products_hash(JSON.stringify(product_in_list));
              }
              if (typeof product_in_waitlist !== 'undefined' && product_in_waitlist !== null) {
                var _product_count = product_in_waitlist.length;
                for (i = 0; i <= _product_count - 1; i++) {
                  if (typeof product_in_waitlist[i] !== 'undefined' && product_in_waitlist[i].wishlist_id == wishlist_id && product_in_waitlist[i].product_id == data_row_id) {
                    product_in_waitlist.splice(i, 1);
                    $('body').trigger('wlfmc_removed_from_waitlist', [t, row, data]);
                    break;
                  }
                }
                $.fn.WLFMC.set_waitlist_hash(JSON.stringify(product_in_waitlist));
              }
            }
            //init_handling_after_ajax();
          }
        });
        return false;
      });
      b.on('click touchend', '.wlfmc-products-counter-wishlist .remove_from_wishlist,.wlfmc-products-counter-waitlist .remove_from_wishlist', function (ev) {
        var t = $(this);
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var table = t.parents('.wlfmc-wishlist-items-wrapper'),
          row = t.parents('[data-row-id]'),
          data_row_id = row.data('row-id'),
          data_item_id = row.data('item-id'),
          wishlist_id = row.data('wishlist-id'),
          wishlist_token = row.data('wishlist-token'),
          list_table = $('.wlfmc-wishlist-form .wlfmc-wishlist-table'),
          data = {
            action: wlfmc_l10n.actions.remove_from_wishlist_action,
            nonce: t.data('nonce'),
            context: 'frontend',
            remove_from_wishlist: data_row_id,
            wishlist_id: wishlist_id,
            wishlist_token: wishlist_token,
            merge_lists: wlfmc_l10n.merge_lists
            //fragments: retrieve_fragments( data_row_id )
          };
        $.ajax({
          url: wlfmc_l10n.ajax_url,
          data: data,
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(t);
          },
          success: function success(data) {
            if ($.fn.WLFMC.isTrue(data.result)) {
              var load_frag = false;
              if (typeof product_in_list !== 'undefined' && product_in_list !== null) {
                var product_count = product_in_list.length;
                for (var i = 0; i <= product_count - 1; i++) {
                  if (typeof product_in_list[i] !== 'undefined' && product_in_list[i].wishlist_id === wishlist_id && product_in_list[i].product_id === data_row_id) {
                    product_in_list.splice(i, 1);
                    $('body').trigger('wlfmc_removed_from_wishlist', [t, row, data]);
                    break;
                  }
                }
                $.fn.WLFMC.set_products_hash(JSON.stringify(product_in_list));
              }
              if (typeof product_in_waitlist !== 'undefined' && product_in_waitlist !== null) {
                var product_count = product_in_waitlist.length;
                for (var i = 0; i <= product_count - 1; i++) {
                  if (typeof product_in_waitlist[i] !== 'undefined' && product_in_waitlist[i].wishlist_id === wishlist_id && product_in_waitlist[i].product_id === data_row_id) {
                    product_in_waitlist.splice(i, 1);
                    $('body').trigger('wlfmc_removed_from_waitlist', [t, row, data]);
                    break;
                  }
                }
                $.fn.WLFMC.set_waitlist_hash(JSON.stringify(product_in_waitlist));
              }
              if (t.closest('.wlfmc-products-counter-wrapper').length > 0) {
                $('.wlfmc-products-counter-wrapper').find('[data-item-id="' + data_item_id + '"]').remove();
                //$( '.wlfmc-wishlist-form' ).find( '[data-item-id="' + data_item_id + '"]' ).remove();
                $('.wlfmc-products-counter-wrapper  .products-counter-number').text(data.count);
                $('.wlfmc-products-counter-wishlist .total-products .wlfmc-total-count').text(data.count);
                $('.wlfmc-add-to-wishlist.wlfmc-add-to-wishlist-' + data_row_id).removeClass('exists');
              }
              if (t.closest('.wlfmc-waitlist-counter-wrapper').length > 0) {
                $('.wlfmc-waitlist-counter-wrapper').find('[data-item-id="' + data_item_id + '"]').remove();
                //$( '.wlfmc-wishlist-form' ).find( '[data-item-id="' + data_item_id + '"]' ).remove();
                $('.wlfmc-waitlist-counter-wrapper  .products-counter-number').text(data.count);
                $('.wlfmc-products-counter-waitlist .total-products .wlfmc-total-count').text(data.count);
                $('.wlfmc-add-to-waitlist.wlfmc-add-to-waitlist-' + data_row_id).removeClass('exists');
              }
              if (list_table.length > 0 && parseInt(wishlist_id) === parseInt(list_table.attr('data-id'))) {
                list_table.find('[data-item-id="' + data_item_id + '"]').addClass('disabled-row');
                load_frag = true;
              }
              if (data.count < 1 || !table.find('[data-row-id]').length) {
                load_frag = true;
              }
              if (load_frag) {
                $.fn.WLFMC.load_fragments();
              }
              /*if ((data.count < 1 || ! table.find( '[data-row-id]' ).length) && typeof data.fragments !== 'undefined') {
              	replace_fragments( data.fragments );
              }*/
            }
            $.fn.WLFMC.init_handling_after_ajax();
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_delete_item', function (ev) {
        var t = $(this),
          product_id = t.attr('data-product-id'),
          wishlist_id = t.attr('data-wishlist-id'),
          item_id = t.attr('data-item-id'),
          el_wrap = $('.wlfmc-add-to-wishlist-' + product_id),
          data = {
            action: wlfmc_l10n.actions.delete_item_action,
            context: 'frontend',
            wishlist_id: wishlist_id,
            item_id: item_id
            //fragments: retrieve_fragments( product_id )
          };
        ev.stopImmediatePropagation();
        ev.preventDefault();
        $.ajax({
          url: wlfmc_l10n.ajax_url,
          data: data,
          method: 'post',
          dataType: 'json',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(t);
          },
          success: function success(response) {
            var fragments = response.fragments,
              response_message = response.message;
            if ('true' === response.result) {
              el_wrap.removeClass('exists');
              if (typeof product_in_list !== 'undefined' && product_in_list !== null) {
                product_in_list = $.grep(product_in_list, function (e) {
                  return e.item_id !== parseInt(item_id);
                });
                $.fn.WLFMC.set_products_hash(JSON.stringify(product_in_list));
              }
            }
            if (!t.closest('.wlfmc-remove-button').length && '' !== $.trim(response_message)) {
              toastr.error(response_message);
            }
            if ('true' === response.result && '' !== $.trim(wlfmc_l10n.labels.product_removed_text)) {
              toastr.error(wlfmc_l10n.labels.product_removed_text);
            }
            $.fn.WLFMC.load_fragments();
            /*if (typeof fragments !== 'undefined') {
            	replace_fragments( fragments );
            }*/

            $.fn.WLFMC.init_handling_after_ajax();
            $('body').trigger('wlfmc_removed_from_wishlist', [t, el_wrap, response]);
          }
        });
        return false;
      });
      t.on('wlfmc_show_variation', function (ev, data) {
        var t = $(ev.target),
          product_id = data.product_id,
          variation_id = data.variation_id,
          targets = $('.wlfmc-add-to-wishlist [data-parent-product-id="' + product_id + '"]'),
          enable_outofstock = targets.closest('.wlfmc-add-to-wishlist').data('enable-outofstock');
        if (!product_id || !variation_id || !targets.length) {
          return;
        }
        if (!enable_outofstock && !data.is_in_stock) {
          targets.closest('.wlfmc-add-to-wishlist').addClass('hide');
        } else {
          targets.closest('.wlfmc-add-to-wishlist').removeClass('hide');
        }
        var popupId = targets.closest('.wlfmc-add-to-wishlist').attr('data-popup-id');
        if (popupId) {
          var popup = $('#' + popupId);
          if (popup.length) {
            var product_title = popup.data('product-title');
            var desc = wlfmc_l10n.labels.popup_content;
            var title = wlfmc_l10n.labels.popup_title;
            var image_size = popup.data('image-size');
            var img = popup.find('.wlfmc-popup-header img').data('src');
            var original_price = popup.find('.wlfmc-parent-product-price').html();
            var product_price = '' !== data.price_html ? data.price_html : original_price;
            desc = desc.replace('{product_price}', product_price);
            desc = desc.replace('{product_name}', product_title);
            title = title.replace('{product_price}', product_price);
            title = title.replace('{product_name}', product_title);
            if (data.image_id && 'true' == popup.data('use-featured')) {
              img = 'large' === image_size ? data.image.full_src : 'thumbnail' === image_size ? data.image.thumb_src : data.image.src;
            }
            popup.find('.wlfmc-popup-title').html(title);
            popup.find('.wlfmc-popup-desc').html(desc);
            popup.find('.wlfmc-popup-header img').attr('src', img);
          }
        }
        targets.each(function () {
          var t = $(this),
            container = t.closest('.wlfmc-add-to-wishlist');
          t.attr('data-parent-product-id', product_id);
          t.attr('data-product-id', variation_id);
          if (container.length) {
            container.removeClass(function (i, classes) {
              return classes.match(/wlfmc-add-to-wishlist-\S+/g).join(' ');
            }).addClass('wlfmc-add-to-wishlist-' + variation_id).removeClass('exists');
          }
          container.find('.wlfmc-addtowishlist a').attr('href', container.attr('data-add-url').replace("#product_id", variation_id));
          container.find('.wlfmc-removefromwishlist a').attr('href', container.attr('data-remove-url').replace("#product_id", variation_id));
          $.each(product_in_list, function (i, v) {
            if (typeof v !== 'undefined' && v.product_id && v.product_id == variation_id) {
              container.addClass('exists');
              container.find('.wlfmc_delete_item').attr('data-wishlist-id', v.wishlist_id);
              container.find('.wlfmc_delete_item').attr('data-item-id', v.item_id);
            }
          });
        });
      });
      t.on('reset_data', function (ev) {
        var t = $(ev.target),
          product_id = t.data('product_id'),
          targets = $('.wlfmc-add-to-wishlist [data-parent-product-id="' + product_id + '"]');
        if (!product_id || !targets.length) {
          return;
        }
        targets.closest('.wlfmc-add-to-wishlist').removeClass('hide');
        var popupId = targets.closest('.wlfmc-add-to-wishlist').attr('data-popup-id');
        if (popupId) {
          var popup = $('#' + popupId);
          if (popup.length) {
            var original_price = popup.find('.wlfmc-parent-product-price').html();
            var product_title = popup.data('product-title');
            var desc = wlfmc_l10n.labels.popup_content;
            var title = wlfmc_l10n.labels.popup_title;
            var img = popup.find('.wlfmc-popup-header img').data('src');
            desc = desc.replace('{product_price}', original_price);
            desc = desc.replace('{product_name}', product_title);
            title = title.replace('{product_price}', original_price);
            title = title.replace('{product_name}', product_title);
            popup.find('.wlfmc-popup-title').html(title);
            popup.find('.wlfmc-popup-desc').html(desc);
            popup.find('.wlfmc-popup-header img').attr('src', img);
          }
        }
        targets.each(function () {
          var t = $(this),
            container = t.closest('.wlfmc-add-to-wishlist');
          t.attr('data-parent-product-id', product_id);
          t.attr('data-product-id', product_id);
          if (container.length) {
            container.removeClass(function (i, classes) {
              return classes.match(/wlfmc-add-to-wishlist-\S+/g).join(' ');
            }).addClass('wlfmc-add-to-wishlist-' + product_id).removeClass('exists');
          }
          container.find('.wlfmc-addtowishlist a').attr('href', container.attr('data-add-url').replace("#product_id", product_id));
          container.find('.wlfmc-removefromwishlist a').attr('href', container.attr('data-remove-url').replace("#product_id", product_id));
          $.each(product_in_list, function (i, v) {
            if (typeof v !== 'undefined' && v.product_id && v.product_id == product_id) {
              container.addClass('exists');
              container.find('.wlfmc_delete_item').attr('data-wishlist-id', v.wishlist_id);
              container.find('.wlfmc_delete_item').attr('data-item-id', v.item_id);
            }
          });
        });
      });
      ;
      /* === Waitlist === */

      b.on('click', '.wlfmc-waitlist-btn-login-need', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toastr.error(wlfmc_l10n.labels.waitlist_login_need);
        return false;
      });
      t.on('wlfmc_show_variation', function (ev, data) {
        var product_id = data.product_id,
          variation_id = data.variation_id;
        $.fn.WLFMC.check_waitlist_modules(data, product_id, variation_id);
      });
      t.on('reset_data', function (ev) {
        var t = $(ev.target),
          product_id = t.data('product_id');
        $.fn.WLFMC.check_waitlist_modules(null, product_id, product_id);
        if ($.fn.WLFMC.isTrue(wlfmc_l10n.waitlist_required_product_variation)) {
          var elem = $('.wlfmc-add-to-waitlist-' + product_id);
          elem.find('.wlfmc-popup-trigger').addClass('wlfmc-disabled');
        }
      });
      t.on('hide_variation', '.variations_form', function (a) {
        var elem = $('.wlfmc-add-to-waitlist-' + $(this).data('product_id'));
        if (elem.length > 0 && $.fn.WLFMC.isTrue(wlfmc_l10n.waitlist_required_product_variation)) {
          a.preventDefault();
          elem.find('.wlfmc-popup-trigger').addClass('wlfmc-disabled');
        }
      });
      t.on('show_variation', '.variations_form', function (a, b, d) {
        var elem = $('.wlfmc-add-to-waitlist-' + $(this).data('product_id'));
        if (elem.length > 0) {
          a.preventDefault();
          elem.find('.wlfmc-popup-trigger').removeClass('wlfmc-disabled');
        }
      });
      b.on('click', '.wlfmc-add-to-waitlist .wlfmc-popup-trigger.wlfmc-disabled', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toastr.error(wlfmc_l10n.labels.waitlist_make_a_selection_text);
        return false;
      });
      b.on('click', '.wlfmc_add_to_waitlist', function (ev) {
        var t = $(this),
          product_id = t.attr('data-product-id'),
          parent_product_id = t.attr('data-parent-product-id'),
          filtered_data = null,
          popup = t.closest('.wlfmc-popup'),
          on_sale = popup.find('.wlfmc-waitlist-select-type input[name=list_on-sale]:checked').length > 0 ? 1 : 0,
          back_in_stock = popup.find('.wlfmc-waitlist-select-type input[name=list_back-in-stock]:checked').length > 0 ? 1 : 0,
          price_change = popup.find('.wlfmc-waitlist-select-type input[name=list_price-change]:checked').length > 0 ? 1 : 0,
          low_stock = popup.find('.wlfmc-waitlist-select-type input[name=list_low-stock]:checked').length > 0 ? 1 : 0,
          email = popup.find('input[name=wlfmc_email]').length > 0 ? popup.find('input[name=wlfmc_email]').val().trim() : false,
          data = {
            action: wlfmc_l10n.actions.add_product_to_waitlist_action,
            context: 'frontend',
            add_to_waitlist: product_id,
            product_type: t.attr('data-product-type'),
            on_sale: on_sale,
            back_in_stock: back_in_stock,
            price_change: price_change,
            low_stock: low_stock,
            wlfmc_email: email
          };
        ev.stopImmediatePropagation();
        ev.preventDefault();
        if (false !== email && '' === email) {
          toastr.error(wlfmc_l10n.labels.waitlist_email_required);
          return;
        }
        if (false !== email && !$.fn.WLFMC.validateEmail(email)) {
          toastr.error(wlfmc_l10n.labels.waitlist_email_format);
          return;
        }

        // allow third party code to filter data.
        if (filtered_data === $(document).triggerHandler('wlfmc_add_to_waitlist_data', [t, data])) {
          data = filtered_data;
        }
        var current_product_form;
        if ($('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').length) {
          current_product_form = $('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').eq(0);
        } else if ($(this).closest('form.cart[method=post], form.vtajaxform[method=post]').length) {
          current_product_form = $(this).closest('form.cart[method=post], form.vtajaxform[method=post]').eq(0);
        } else if ($('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').length) {
          current_product_form = $('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').eq(0);
        } else if ($('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]').length) {
          var button = $('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]');
          current_product_form = button.closest('form').eq(0);
        }
        var formData = new FormData();
        if (typeof current_product_form !== 'undefined' && current_product_form.length > 0) {
          formData = new FormData(current_product_form.get(0));
          formData["delete"]('add-to-cart');
        }
        $.each(data, function (key, valueObj) {
          formData.append(key, _typeof2(valueObj) === 'object' ? JSON.stringify(valueObj) : valueObj);
        });
        jQuery(document.body).trigger('wlfmc_adding_to_waitlist');
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.ajax({
          url: wlfmc_l10n.waitlist_ajax_url,
          data: formData,
          type: 'POST',
          //dataType: 'json',
          contentType: false,
          processData: false,
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              response_message = response.message,
              show_toast = true;
            if (response_result === 'true') {
              $.fn.WLFMC.load_fragments();
              popup.popup('hide');
              if (show_toast && '' !== $.trim(response_message)) {
                toastr.success(response_message);
              }
              var list_type = 'waitlist';
              if (on_sale === 1) list_type += ',on-sale';
              if (price_change === 1) list_type += ',price-change';
              if (back_in_stock === 1) list_type += ',back-in-stock';
              if (low_stock === 1) list_type += ',low-stock';
              $.fn.WLFMC.load_automations(product_id, response.wishlist_id, response.customer_id, list_type, response.load_automation_nonce);
            }
            if (show_toast && '' !== $.trim(response.message) && response_result !== 'true') {
              toastr.error(response_message);
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_add_to_outofstock', function (ev) {
        var t = $(this),
          product_id = t.attr('data-product-id'),
          parent_product_id = t.attr('data-parent-product-id'),
          wlfmc_email = t.closest('.wlfmc-add-to-outofstock').find('input[name=wlfmc_email]'),
          filtered_data = null,
          email = wlfmc_email.length > 0 ? wlfmc_email.val().trim() : false,
          data = {
            action: wlfmc_l10n.actions.add_product_to_waitlist_action,
            context: 'frontend',
            add_to_waitlist: product_id,
            product_type: t.attr('data-product-type'),
            on_sale: 0,
            back_in_stock: 1,
            price_change: 0,
            low_stock: 0,
            wlfmc_email: email
          };
        ev.stopImmediatePropagation();
        ev.preventDefault();
        if (false !== email && '' === email) {
          toastr.error(wlfmc_l10n.labels.waitlist_email_required);
          return;
        }
        if (false !== email && !$.fn.WLFMC.validateEmail(email)) {
          toastr.error(wlfmc_l10n.labels.waitlist_email_format);
          return;
        }
        // allow third party code to filter data.
        if (filtered_data === $(document).triggerHandler('wlfmc_add_to_waitlist_data', [t, data])) {
          data = filtered_data;
        }
        var current_product_form;
        if ($('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').length) {
          current_product_form = $('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').eq(0);
        } else if ($(this).closest('form.cart[method=post], form.vtajaxform[method=post]').length) {
          current_product_form = $(this).closest('form.cart[method=post], form.vtajaxform[method=post]').eq(0);
        } else if ($('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').length) {
          current_product_form = $('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').eq(0);
        } else if ($('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]').length) {
          var button = $('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]');
          current_product_form = button.closest('form').eq(0);
        }
        var formData = new FormData();
        if (typeof current_product_form !== 'undefined' && current_product_form.length > 0) {
          formData = new FormData(current_product_form.get(0));
          formData["delete"]('add-to-cart');
        }
        $.each(data, function (key, valueObj) {
          formData.append(key, _typeof2(valueObj) === 'object' ? JSON.stringify(valueObj) : valueObj);
        });
        jQuery(document.body).trigger('wlfmc_adding_to_waitlist');
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.ajax({
          url: wlfmc_l10n.waitlist_ajax_url,
          data: formData,
          type: 'POST',
          //dataType: 'json',
          contentType: false,
          processData: false,
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              response_message = response.message,
              show_toast = true;
            if (response_result === 'true') {
              $.fn.WLFMC.load_fragments();
              if (show_toast && '' !== $.trim(response_message)) {
                toastr.success(response_message);
              }
              $('.wlfmc-add-to-outofstock-' + product_id).addClass('exists');
              $.fn.WLFMC.load_automations(product_id, response.wishlist_id, response.customer_id, 'back-in-stock', response.load_automation_nonce);
            }
            if (show_toast && '' !== $.trim(response.message) && response_result !== 'true') {
              toastr.error(response_message);
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_cancel_outofstock', function (ev) {
        var t = $(this),
          product_id = t.attr('data-product-id'),
          parent_product_id = t.attr('data-parent-product-id'),
          data = {
            action: wlfmc_l10n.actions.add_product_to_waitlist_action,
            context: 'frontend',
            add_to_waitlist: product_id,
            product_type: t.attr('data-product-type'),
            on_sale: 0,
            back_in_stock: 0,
            price_change: 0,
            low_stock: 0
          };
        ev.stopImmediatePropagation();
        ev.preventDefault();
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.ajax({
          url: wlfmc_l10n.waitlist_ajax_url,
          data: data,
          type: 'POST',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              response_message = response.message,
              show_toast = true;
            if (response_result === 'true') {
              if (show_toast && '' !== $.trim(response_message)) {
                toastr.error(response_message);
              }
              $('.wlfmc-add-to-outofstock-' + product_id).removeClass('exists');
              $.fn.WLFMC.load_fragments();
            }
            if (show_toast && '' !== $.trim(response.message) && response_result !== 'true') {
              toastr.error(response_message);
            }
          }
        });
        return false;
      });
      ;
      /* === MULTI LIST === */

      var PrevListsState = [];
      b.on('input', '.wlfmc-popup-lists-wrapper .search-input', function () {
        var searchTerm = $(this).val().toLowerCase();
        var list = $(this).closest('.wlfmc-popup-lists-wrapper').find('.list');
        var noResultsRow = $(this).closest('.wlfmc-popup-lists-wrapper').find('.no-results-row');
        var numVisibleItems = 0;
        if (list.find('.list-item').length) {
          list.find('.list-item').each(function () {
            var text = $(this).text().toLowerCase();
            if (text.indexOf(searchTerm) > -1) {
              $(this).show();
              numVisibleItems++;
            } else {
              $(this).hide();
            }
          });
          if (numVisibleItems === 0) {
            noResultsRow.show();
          } else {
            noResultsRow.hide();
          }
        } else {
          $(this).val('');
        }
      });

      /*b.on(
      	'change',
      	'.wlfmc-add-to-list-container .list-item-checkbox',
      	function() {
      		var selectedItem = $( this ).closest( '.list-item' );
      
      		if ($( this ).is( ':checked' )) {
      			selectedItem.addClass( 'selected' );
      		} else {
      			selectedItem.removeClass( 'selected' );
      		}
      	}
      );
      
      b.on(
      	'change',
      	'.wlfmc-move-to-list-wrapper .list-item-checkbox',
      	function() {
      		var selectedItem = $( this ).closest( '.list-item' );
      		var checkboxes = $(this).closest('.wlfmc-move-to-list-wrapper').find('input[name="destination_wishlist_id"]');
      		$(this).closest('.wlfmc-move-to-list-wrapper').find('.list-item').removeClass( 'selected' );
      		if ($( this ).is( ':checked' )) {
      			selectedItem.addClass( 'selected' );
      			checkboxes.not($(this)).prop('checked', false);
      		}
      	}
      );
      
      b.on(
      	'change',
      	'.wlfmc-copy-to-list-wrapper .list-item-checkbox',
      	function() {
      		var selectedItem = $( this ).closest( '.list-item' );
      		var checkboxes = $(this).closest('.wlfmc-copy-to-list-wrapper').find('input[name="destination_wishlist_id"]');
      		$(this).closest('.wlfmc-copy-to-list-wrapper').find('.list-item').removeClass( 'selected' );
      		if ($( this ).is( ':checked' )) {
      			selectedItem.addClass( 'selected' );
      			checkboxes.not($(this)).prop('checked', false);
      		}
      	}
      );*/

      b.on('click', '.wlfmc-create-new-list', function () {
        var parent_popup = $('#' + $(this).attr('data-parent-popup-id'));
        var child_popup = $('#' + $(this).attr('data-child-popup-id'));
        parent_popup.popup('hide');
        var defaultOptions = {
          absolute: false,
          color: '#333',
          transition: 'all 0.1s',
          horizontal: child_popup.data('horizontal'),
          vertical: child_popup.data('vertical')
        };
        child_popup.popup(_objectSpread(_objectSpread({}, defaultOptions), {}, {
          onclose: function onclose() {
            parent_popup.popup('show');
            child_popup.popup(_objectSpread(_objectSpread({}, defaultOptions), {}, {
              onclose: null
            }));
          }
        }));
        child_popup.popup('show');
      });
      b.on('click', '.wlfmc-toggle-privacy', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var elem = $(this),
          row = elem.parents('[data-wishlist-id]'),
          old_privacy = parseInt(elem.attr('data-privacy')),
          new_privacy = 0 === old_privacy ? 1 : 0,
          wishlist_id = row.attr('data-wishlist-id'),
          icon = elem.find('i'),
          edit_popup = $('#edit_popup_' + wishlist_id);
        $.ajax({
          url: wlfmc_l10n.multi_list_ajax_url,
          data: {
            action: wlfmc_l10n.actions.change_privacy_action,
            nonce: elem.data('nonce'),
            context: 'frontend',
            'wishlist_id': wishlist_id,
            'list_privacy': new_privacy
          },
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(elem);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(elem);
          },
          success: function success(data) {
            if (!data) {
              return;
            }
            icon.removeClass('wlfmc-icon-unlock wlfmc-icon-lock');
            icon.addClass(old_privacy === 0 ? 'wlfmc-icon-lock' : 'wlfmc-icon-unlock');
            edit_popup.find('input[name="list_privacy"][value="' + new_privacy + '"]').prop('checked', 'checked');
            elem.attr('data-privacy', new_privacy);
            if (new_privacy === 0) {
              $('.wlfmc-popup-trigger[data-popup-id="share_popup_' + wishlist_id + '"]').removeAttr('style');
              $('.share-wrapper').show();
            } else {
              $('.wlfmc-popup-trigger[data-popup-id="share_popup_' + wishlist_id + '"]').css('display', 'none');
              $('.share-wrapper').hide();
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc-delete-list', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var elem = $(this),
          wishlist_id = elem.data('wishlist-id'),
          popup = $('#' + elem.data('popup-id')),
          row = $('ul.wlfmc-manage-lists li[data-wishlist-id="' + wishlist_id + '"],a.list-row[data-list-id="' + wishlist_id + '"], .wlfmc-dropdown-content li[data-wishlist-id="' + wishlist_id + '"]'),
          table = $('.wlfmc-wishlist-table[data-id="' + wishlist_id + '"]');
        $.ajax({
          url: wlfmc_l10n.multi_list_ajax_url,
          data: {
            action: wlfmc_l10n.actions.delete_list_action,
            nonce: $('#wlfmc-lists').data('nonce'),
            context: 'frontend',
            wishlist_id: wishlist_id
            //fragments: retrieve_fragments()
          },
          method: 'POST',
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(elem);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(elem);
          },
          success: function success(data) {
            if (!data) {
              return;
            }
            if (!data.result) {
              toastr.error(data.message);
            } else {
              popup.popup('hide');
              row.remove();
              if ($('#wlfmc_my_lists_dropdown li').length === 0) {
                $('.wlfmc-select-list-wrapper').addClass('hide');
                $('.wlfmc-list-actions-wrapper .wlfmc-new-list').css('display', '');
              }
              if (table.length > 0) {
                window.location.href = wlfmc_l10n.lists_page_url;
              }
            }
            $.fn.WLFMC.load_fragments();
            /*if (typeof data.fragments !== 'undefined') {
            	replace_fragments( data.fragments );
            }*/
          }
        });
        return false;
      });
      b.on('click', '.wlfmc-save-list', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var elem = $(this),
          wishlist_id = elem.data('wishlist-id'),
          row = $('ul.wlfmc-manage-lists li[data-wishlist-id="' + wishlist_id + '"],a.list-row[data-list-id="' + wishlist_id + '"], .wlfmc-list-actions-wrapper'),
          popup = $('#' + elem.data('popup-id')),
          privacy = parseInt(popup.find('input[name="list_privacy"]:checked').val()),
          name = popup.find('input[name="list_name"]').val(),
          desc = popup.find('textarea[name="list_descriptions"]').val(),
          iconPrivacy = row.find('.wlfmc-toggle-privacy i');
        if ('' === $.trim(name)) {
          toastr.error(wlfmc_l10n.labels.multi_list_list_name_required);
          return false;
        }
        $.ajax({
          url: wlfmc_l10n.multi_list_ajax_url,
          data: {
            action: wlfmc_l10n.actions.update_list_action,
            nonce: $('#wlfmc-lists').data('nonce'),
            context: 'frontend',
            wishlist_id: wishlist_id,
            list_privacy: privacy,
            list_name: name,
            list_descriptions: desc
          },
          method: 'POST',
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(elem);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(elem);
          },
          success: function success(data) {
            if (!data) {
              return;
            }
            if (!data.result) {
              toastr.error(data.message);
            } else {
              popup.popup('hide');
              row.find('.list-name').text(name);
              row.find('.list-desc').text(desc);
              row.find('.wlfmc-toggle-privacy').attr('data-privacy', privacy);
              iconPrivacy.removeClass('wlfmc-icon-unlock wlfmc-icon-lock');
              iconPrivacy.addClass(privacy === 0 ? 'wlfmc-icon-unlock' : 'wlfmc-icon-lock');
              if (privacy === 0) {
                $('.wlfmc-popup-trigger[data-popup-id="share_popup_' + wishlist_id + '"]').removeAttr('style');
                $('.share-wrapper').show();
              } else {
                $('.wlfmc-popup-trigger[data-popup-id="share_popup_' + wishlist_id + '"]').css('display', 'none');
                $('.share-wrapper').hide();
              }
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc-add-list', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var elem = $(this),
          popup = $('#new_list_popup'),
          privacy = parseInt(popup.find('input[name="list_privacy"]:checked').val()),
          name = popup.find('input[name="list_name"]').val(),
          desc = popup.find('textarea[name="list_descriptions"]').val();
        if ('' === $.trim(name)) {
          toastr.error(wlfmc_l10n.labels.multi_list_list_name_required);
          return false;
        }
        $.ajax({
          url: wlfmc_l10n.multi_list_ajax_url,
          data: {
            action: wlfmc_l10n.actions.create_new_list_action,
            nonce: elem.data('nonce'),
            context: 'frontend',
            list_privacy: privacy,
            list_name: name,
            list_descriptions: desc,
            fragments: $('.wishlist-empty-row .wlfmc-new-list').length > 0 ? $.fn.WLFMC.retrieve_fragments() : $.fn.WLFMC.retrieve_fragments('list_counter')
          },
          method: 'POST',
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(elem);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(elem);
          },
          success: function success(data) {
            if (!data) {
              return;
            }
            if (!data.result) {
              toastr.error(data.message);
            } else {
              $('.wlfmc-list-actions-wrapper .wlfmc-new-list').hide();
              popup.find('input[name="list_name"]').val('');
              popup.find('input[name="list_descriptions"]').val('');
              popup.popup('hide');
              var template = wp.template('wlfmc-list-item');
              var html = template(data);
              if ($('#move_popup').length > 0) {
                $('#move_popup ul.list').append(html);
                $('#move_popup ul.list').find('input.list-item-checkbox[value="' + data.wishlist_id + '"]').prop('checked', 'checked').trigger('change');
                $('#move_popup .list-empty').hide();
                $('#move_popup .no-results-row').hide();
                $('#move_popup .wlfmc-search-lists').attr('style', '');
                $('#move_popup .wlfmc_move_to_list').attr('style', '');
              } else if ($('#copy_popup').length > 0) {
                $('#copy_popup ul.list').append(html);
                $('#copy_popup ul.list').find('input.list-item-checkbox[value="' + data.wishlist_id + '"]').prop('checked', 'checked').trigger('change');
                $('#copy_popup .list-empty').hide();
                $('#copy_popup .no-results-row').hide();
                $('#copy_popup .wlfmc-search-lists').attr('style', '');
                $('#copy_popup .wlfmc_copy_to_list').attr('style', '');
              } else {
                $('#add_to_list_popup ul.list').append(html);
                PrevListsState.push(false);
                $('#add_to_list_popup ul.list').find('input[type="checkbox"]').on('change', WlfmcCheckboxListsChange);
                $('#add_to_list_popup ul.list').find('input.list-item-checkbox[value="' + data.wishlist_id + '"]').prop('checked', 'checked').trigger('change');
                $('#add_to_list_popup .list-empty').hide();
                $('#add_to_list_popup .no-results-row').hide();
                $('#add_to_list_popup .wlfmc-search-lists').attr('style', '');
                $('#add_to_list_popup .wlfmc_add_to_multi_list').attr('style', '');
                $('#add_to_list_popup .wlfmc-manage-btn').attr('style', '');
              }
              template = wp.template('wlfmc-dropdown-item');
              if (typeof template === 'function') {
                if ($('#wlfmc_my_lists_dropdown').length > 0) {
                  html = template(data);
                  $('#wlfmc_my_lists_dropdown').append(html);
                  $('.wlfmc-select-list-wrapper').removeClass('hide');
                  $.fn.WLFMC.init_dropdown_lists();
                }
              }
              $.fn.WLFMC.init_popup_checkbox_handling();
              if ($('.wlfmc-lists').length > 0) {
                $.fn.WLFMC.block($('.wlfmc-lists'));
                $.fn.WLFMC.load_fragments();
              } else if (typeof data.fragments !== 'undefined') {
                $.fn.WLFMC.replace_fragments(data.fragments);
              }
            }
          }
        });
        return false;
      });
      t.on('wlfmc_show_variation', function (ev, data) {
        var t = $(ev.target),
          product_id = data.product_id,
          variation_id = data.variation_id,
          targets = $('.wlfmc-add-to-multi-list [data-parent-product-id="' + product_id + '"]'),
          enable_outofstock = targets.closest('.wlfmc-add-to-multi-list').data('enable-outofstock');
        if (!product_id || !variation_id || !targets.length) {
          return;
        }
        if (!enable_outofstock && !data.is_in_stock) {
          targets.closest('.wlfmc-add-to-multi-list').addClass('hide');
        } else {
          targets.closest('.wlfmc-add-to-multi-list').removeClass('hide');
        }
        targets.each(function () {
          var t = $(this);
          t.attr('data-parent-product-id', product_id);
          t.attr('data-product-id', variation_id);
        });
        //$( '.wlfmc-popup-trigger[data-popup-id="add_to_list_popup"]' ).attr( 'data-parent-product-id', product_id ).attr( 'data-product-id', variation_id );
        $('.wlfmc-popup-trigger[data-popup-id="add_to_list_popup"][data-parent-product-id="' + product_id + '"]').attr('data-product-id', variation_id);
      });
      t.on('reset_data', function (ev) {
        var t = $(ev.target),
          product_id = t.data('product_id'),
          targets = $('.wlfmc-add-to-multi-list [data-parent-product-id="' + product_id + '"]');
        if (!product_id || !targets.length) {
          return;
        }
        targets.closest('.wlfmc-add-to-multi-list').removeClass('hide');
        targets.each(function () {
          var t = $(this);
          t.attr('data-parent-product-id', product_id);
          t.attr('data-product-id', product_id);
        });
        //$( '.wlfmc-popup-trigger[data-popup-id="add_to_list_popup"]' ).attr( 'data-parent-product-id', product_id ).attr( 'data-product-id', product_id );
        $('.wlfmc-popup-trigger[data-popup-id="add_to_list_popup"][data-parent-product-id="' + product_id + '"]').attr('data-product-id', product_id);
      });
      b.on('click', '.wlfmc-popup-trigger[data-popup-id="move_popup"]', function (ev) {
        var t = $(this),
          popup = $('#move_popup'),
          item_ids = t.data('item-id');
        popup.find('.wlfmc_move_to_list').attr('data-item-ids', item_ids);
        return false;
      });
      b.on('click', '.wlfmc-popup-trigger[data-popup-id="copy_popup"]', function (ev) {
        var t = $(this),
          popup = $('#copy_popup'),
          item_ids = t.data('item-id');
        popup.find('.wlfmc_copy_to_list').attr('data-item-ids', item_ids);
        return false;
      });
      b.on('click', '.wlfmc-popup-trigger[data-popup-id="add_to_list_popup"]', function (ev) {
        var t = $(this),
          product_id = t.attr('data-product-id'),
          parent_product_id = t.attr('data-parent-product-id'),
          product_type = t.attr('data-product-type'),
          exclude_default = t.attr('data-exclude-default'),
          cart_item_key = t.attr('data-cart_item_key'),
          save_cart = t.attr('data-save-cart'),
          popup = $('#add_to_list_popup'),
          data = {
            action: wlfmc_l10n.actions.load_lists_action,
            context: 'frontend',
            product_id: product_id,
            exclude_default: exclude_default
          };

        // Check if cart_item_key is defined before adding it to the data object
        if (typeof cart_item_key !== 'undefined') {
          data.cart_item_key = cart_item_key;
          popup.find('.wlfmc_add_to_multi_list').attr('data-cart_item_key', cart_item_key);
        }
        if (typeof save_cart !== 'undefined') {
          popup.find('.wlfmc_add_to_multi_list').attr('data-save-cart', save_cart);
        }
        popup.find('.wlfmc_add_to_multi_list').attr('data-product-type', product_type).attr('data-product-id', product_id).attr('data-parent-product-id', parent_product_id);
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          ev.preventDefault();
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.ajax({
          url: wlfmc_l10n.multi_list_ajax_url,
          data: data,
          type: 'POST',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.block(popup.find('.wlfmc-add-to-list-container'));
          },
          complete: function complete() {
            $.fn.WLFMC.unblock(popup.find('.wlfmc-add-to-list-container'));
          },
          success: function success(response) {
            var response_result = response.result,
              response_message = response.message,
              data = response.data,
              product_lists = response.product_lists,
              show_toast = true;
            if (response_result === 'true' && 0 < data.length) {
              var template = wp.template('wlfmc-list-item');
              var html = '';
              for (var i = 0; i < data.length; i++) {
                html += template(data[i]);
              }
              popup.find('.wlfmc-search-lists').show();
              popup.find('.list').html(html);
              popup.find('.wlfmc-number').text(product_lists.length);
              popup.find('.list-empty').hide();
              popup.find('.wlfmc_add_to_multi_list').attr('data-list-ids', JSON.stringify(product_lists)).attr('style', '');
              popup.find('.wlfmc-manage-btn').attr('style', '');
              popup.find('.wlfmc_add_to_multi_list').prop('disabled', true);
              // Add event to checkbox to disable submit button if you do not change anything's.
              PrevListsState = popup.find('input[type="checkbox"]').map(function () {
                return $(this).prop('checked');
              }).get();
              popup.on('change', '.list input[type="checkbox"]', WlfmcCheckboxListsChange);
            } else {
              popup.find('.wlfmc-manage-btn').css('display', 'none !important');
              popup.find('.wlfmc-search-lists').hide();
              popup.find('.list').html('');
              popup.find('.list-empty').show();
              popup.find('.wlfmc-number').text(0);
              popup.find('.wlfmc_add_to_multi_list').css('display', 'none !important');
            }
            if (show_toast && '' !== $.trim(response.message) && response_result !== 'true') {
              toastr.error(response_message);
              popup.popup('hide');
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_add_to_multi_list', function (ev) {
        var t = $(this),
          product_id = t.attr('data-product-id'),
          parent_product_id = t.attr('data-parent-product-id'),
          cart_item_key = t.attr('data-cart_item_key'),
          save_cart = t.attr('data-save-cart'),
          filtered_data = null,
          popup = $('#add_to_list_popup'),
          current_lists = JSON.parse(t.attr('data-list-ids')),
          wishlist_ids = popup.find('input.list-item-checkbox:checked').map(function () {
            return this.value;
          }).get(),
          data = {
            action: wlfmc_l10n.actions.add_product_to_list_action,
            context: 'frontend',
            add_to_list: product_id,
            product_type: t.attr('data-product-type'),
            current_lists: current_lists,
            wishlist_ids: wishlist_ids,
            remove_from_cart_item: wlfmc_l10n.remove_from_cart_item,
            remove_from_cart_all: wlfmc_l10n.remove_from_cart_all
            //fragments: retrieve_fragments()
          };
        if (typeof cart_item_key !== 'undefined') {
          data.cart_item_key = cart_item_key;
        }
        if (typeof save_cart !== 'undefined') {
          data.save_cart = save_cart;
        }
        // allow third party code to filter data.
        if (filtered_data === $(document).triggerHandler('wlfmc_add_to_multi_list_data', [t, data])) {
          data = filtered_data;
        }
        var current_product_form;
        if ($('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').length) {
          current_product_form = $('form.cart[method=post][data-product_id="' + parent_product_id + '"], form.vtajaxform[method=post][data-product_id="' + parent_product_id + '"]').eq(0);
        } else if ($(this).closest('form.cart[method=post], form.vtajaxform[method=post]').length) {
          current_product_form = $(this).closest('form.cart[method=post], form.vtajaxform[method=post]').eq(0);
        } else if ($('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').length) {
          current_product_form = $('#product-' + parent_product_id + ' form.cart[method=post],#product-' + parent_product_id + ' form.vtajaxform[method=post]').eq(0);
        } else if ($('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]').length) {
          var button = $('form.cart[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.vtajaxform[method=post] button[name="add-to-cart"][value="' + parent_product_id + '"],form.cart[method=post] input[name="add-to-cart"][value="' + parent_product_id + '"]');
          current_product_form = button.closest('form').eq(0);
        }
        var formData = new FormData();
        if (typeof current_product_form !== 'undefined' && current_product_form.length > 0) {
          /*current_product_form.find( "input[name='add-to-cart']" ).attr( "disabled",true );
          current_product_form.find( "input[name='add-to-cart']" ).removeAttr( "disabled" );*/
          formData = new FormData(current_product_form.get(0));
          formData["delete"]('add-to-cart');
        } else {
          var add_to_cart_link = t.closest('.product.post-' + parent_product_id).find('.add_to_cart_button');
          if (add_to_cart_link.length) {
            data.quantity = add_to_cart_link.attr('data-quantity');
          }
        }
        $.each(data, function (key, valueObj) {
          formData.append(key, _typeof2(valueObj) === 'object' ? JSON.stringify(valueObj) : valueObj);
        });
        ev.stopImmediatePropagation();
        ev.preventDefault();
        jQuery(document.body).trigger('wlfmc_adding_to_multi_list');
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.ajax({
          url: wlfmc_l10n.multi_list_ajax_url,
          data: formData,
          type: 'POST',
          //dataType: 'json',
          contentType: false,
          processData: false,
          cache: false,
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              response_message = response.message,
              show_toast = true;
            if (response_result === 'true') {
              if ($.fn.WLFMC.isTrue(response.update_cart)) {
                $(document).trigger('wc_update_cart');
              }
              if (show_toast && response.exists && '' !== $.trim(response.exists)) {
                toastr.error(response.exists);
              }
              $.fn.WLFMC.load_fragments();
              popup.popup('hide');
              if (show_toast && '' !== $.trim(wlfmc_l10n.labels.multi_list_saved_text)) {
                toastr.success(wlfmc_l10n.labels.multi_list_saved_text);
              }
              if (response.default_wishlist_id && response.default_wishlist_id !== 'false' || response.default_wishlist_id && response.last_list_id && response.default_wishlist_id === response.last_list_id) {
                $.fn.WLFMC.load_automations(product_id, response.default_wishlist_id, response.customer_id, 'wishlist', response.load_automation_nonce);
              } else if (response.last_list_id && response.last_list_id !== 'false') {
                $.fn.WLFMC.load_automations(product_id, response.last_list_id, response.customer_id, 'lists', response.load_automation_nonce);
              }

              /*if (typeof response.fragments !== 'undefined') {
              	replace_fragments( response.fragments );
              }*/
            }
            if (show_toast && '' !== $.trim(response.message) && response_result !== 'true') {
              toastr.error(response_message);
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_move_to_list', function (ev) {
        var t = $(this),
          item_ids = t.attr('data-item-ids'),
          filtered_data = null,
          popup = $('#move_popup'),
          current_list = t.attr('data-wishlist-id'),
          wishlist_id = popup.find('input.list-item-checkbox:checked').val(),
          data = {
            action: wlfmc_l10n.actions.move_to_another_list,
            nonce: $('#wlfmc-wishlist-form table.wlfmc-wishlist-table').data('nonce'),
            context: 'frontend',
            item_ids: item_ids,
            current_list: current_list,
            destination_wishlist_id: wishlist_id
          };
        if (data.current_list === '' || data.destination_wishlist_id === '' || data.item_ids === '') {
          return;
        }

        // allow third party code to filter data.
        if (filtered_data === $(document).triggerHandler('wlfmc_move_to_list_data', [t, data])) {
          data = filtered_data;
        }
        ev.stopImmediatePropagation();
        ev.preventDefault();
        $.ajax({
          url: wlfmc_l10n.admin_url,
          data: data,
          dataType: 'json',
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            $.fn.WLFMC.loading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              show_toast = true;
            var response_message = wlfmc_l10n.labels.multi_list_successfully_move_message.replace('{wishlist_name}', response.wishlist_name);
            if ($.fn.WLFMC.isTrue(response_result)) {
              $.fn.WLFMC.load_fragments('', function (show_toast, response_message) {
                $('#move_popup').popup('hide');
                $('#move_popup_background').remove();
                $('#move_popup_wrapper').remove();
                if (show_toast && '' !== $.trim(response_message)) {
                  toastr.success(response_message);
                }
              }, [show_toast, response_message]);
            }
            if (!$.fn.WLFMC.isTrue(response_result)) {
              popup.popup('hide');
              $.fn.WLFMC.unloading(t);
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_copy_to_list', function (ev) {
        var t = $(this),
          item_ids = t.attr('data-item-ids'),
          filtered_data = null,
          popup = $('#copy_popup'),
          current_list = t.attr('data-wishlist-id'),
          wishlist_id = popup.find('input.list-item-checkbox:checked').val(),
          data = {
            action: wlfmc_l10n.actions.copy_to_another_list,
            nonce: $('#wlfmc-wishlist-form table.wlfmc-wishlist-table').data('nonce'),
            context: 'frontend',
            item_ids: item_ids,
            current_list: current_list,
            wishlist: wishlist_id
          };
        if (data.current_list === '' || data.destination_wishlist_id === '' || data.item_ids === '') {
          return;
        }

        // allow third party code to filter data.
        if (filtered_data === $(document).triggerHandler('wlfmc_copy_to_list_data', [t, data])) {
          data = filtered_data;
        }
        ev.stopImmediatePropagation();
        ev.preventDefault();
        $.ajax({
          url: wlfmc_l10n.admin_url,
          data: data,
          dataType: 'json',
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            $.fn.WLFMC.loading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              show_toast = true;
            var response_message = wlfmc_l10n.labels.successfully_copy_message.replace('{wishlist_name}', response.wishlist_name);
            if ($.fn.WLFMC.isTrue(response_result)) {
              $.fn.WLFMC.load_fragments('', function (show_toast, response_message) {
                $('#copy_popup_background').remove();
                $('#copy_popup_wrapper').remove();
                if (show_toast && '' !== $.trim(response_message)) {
                  toastr.success(response_message);
                }
              }, [show_toast, response_message]);
            }
            if (!$.fn.WLFMC.isTrue(response_result)) {
              popup.popup('hide');
              $.fn.WLFMC.unloading(t);
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_copy_to_default_list', function (ev) {
        var t = $(this),
          item_ids = t.attr('data-item-id'),
          filtered_data = null,
          current_list = t.attr('data-wishlist-id'),
          data = {
            action: wlfmc_l10n.actions.copy_to_another_list,
            nonce: $('#wlfmc-wishlist-form table.wlfmc-wishlist-table').data('nonce'),
            context: 'frontend',
            item_ids: item_ids,
            wishlist: 'default',
            current_list: current_list
          };
        if (data.current_list === '' || data.item_ids === '') {
          return;
        }

        // allow third party code to filter data.
        if (filtered_data === $(document).triggerHandler('wlfmc_copy_to_default_list_data', [t, data])) {
          data = filtered_data;
        }
        ev.stopImmediatePropagation();
        ev.preventDefault();
        $.ajax({
          url: wlfmc_l10n.admin_url,
          data: data,
          dataType: 'json',
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            $.fn.WLFMC.loading(t);
          },
          success: function success(response) {
            var response_result = response.result,
              show_toast = true;
            var response_message = wlfmc_l10n.labels.successfully_copy_message.replace('{wishlist_name}', response.wishlist_name);
            if ($.fn.WLFMC.isTrue(response_result)) {
              $.fn.WLFMC.load_fragments('list_counter');
              if (show_toast && '' !== $.trim(response_message)) {
                toastr.success(response_message);
              }
            }
            if (!$.fn.WLFMC.isTrue(response_result)) {
              $.fn.WLFMC.unloading(t);
            }
          }
        });
        return false;
      });
      b.on('click', '.wlfmc-multi-list-btn-login-need', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toastr.error(wlfmc_l10n.labels.multi_list_login_need);
        return false;
      });
      function WlfmcCheckboxListsChange() {
        var popup = $('#add_to_list_popup');
        var submitBtn = popup.find('.wlfmc_add_to_multi_list');
        var checkboxes = popup.find('.list input[type="checkbox"]');
        var hasChanged = checkboxes.toArray().some(function (cb, index) {
          return $(cb).prop('checked') !== PrevListsState[index];
        });
        submitBtn.prop('disabled', true);
        if (hasChanged) {
          submitBtn.prop('disabled', false);
        }
      }
      ;
      /* === SAVE FOR LATER === */

      b.on('click', '.wlfmc-list .remove-all-from-save-for-later-btn', function (ev) {
        var quantity_fields = $(this).closest('form').find('input.qty');
        if (quantity_fields.length > 0) {
          quantity_fields.attr("disabled", true);
        }
      });
      b.on('click', '.wlfmc_add_to_save_for_later', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var t = $(this),
          cart_item_key = t.attr('data-cart_item_key');
        $.fn.WLFMC.add_to_save_for_later(cart_item_key, t);
        return false;
      });
      b.on('click', '.wlfmc_remove_from_save_for_later', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var t = $(this),
          row = t.parents('[data-item-id]'),
          data_item_id = row.data('item-id'),
          data = {
            action: wlfmc_l10n.actions.remove_from_save_for_later_action,
            nonce: wlfmc_l10n.ajax_nonce.remove_from_save_for_later_nonce,
            context: 'frontend',
            remove_from_save_for_later: data_item_id
            //fragments: retrieve_fragments()
          };
        $.ajax({
          url: wlfmc_l10n.save_for_later_ajax_url,
          data: data,
          method: 'post',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
            $.fn.WLFMC.loading(t);
          },
          complete: function complete() {
            $.fn.WLFMC.unloading(t);
          },
          success: function success(data) {
            if (!data) {
              return;
            }
            $.fn.WLFMC.load_fragments();
            /*if (typeof data.fragments !== 'undefined') {
            	replace_fragments( data.fragments );
            }*/

            if (data.count !== 'undefined') {
              $('.wlfmc-tabs-wrapper').attr('data-count', data.count);
            }
            if ('true' === data.result && '' !== $.trim(wlfmc_l10n.labels.sfl_product_removed_text)) {
              toastr.error(wlfmc_l10n.labels.sfl_product_removed_text);
            }
            if (data.count !== 'undefined' && 0 === data.count) {
              $('.wlfmc-save-for-later-table-wrapper').empty();
            }
            $.fn.WLFMC.init_handling_after_ajax();
            $('body').trigger('wlfmc_removed_from_save_for_later', [t, row, data]);
          }
        });
        return false;
      });
      b.on('click', '.wlfmc_save_for_later_ajax_add_to_cart', function (ev) {
        var t = $(this),
          item_id = t.attr('data-item_id'),
          data = {
            action: wlfmc_l10n.actions.save_for_later_add_to_cart_action,
            nonce: wlfmc_l10n.ajax_nonce.add_to_cart_from_sfl_nonce,
            context: 'frontend',
            item_id: item_id
            //fragments: retrieve_fragments()
          };
        ev.stopImmediatePropagation();
        ev.preventDefault();
        t.removeClass('added');
        t.addClass('loading');

        // Allow 3rd parties to validate and quit early.
        if (false === $(document.body).triggerHandler('should_send_ajax_request.adding_to_cart', [t])) {
          $(document.body).trigger('ajax_request_not_sent.adding_to_cart', [false, false, t]);
          return true;
        }
        $(document.body).trigger('adding_to_cart', [t, {}]);
        $.ajax({
          url: wlfmc_l10n.save_for_later_ajax_url,
          data: data,
          method: 'post',
          //dataType: 'json',
          beforeSend: function beforeSend(xhr) {
            if (wlfmc_l10n.ajax_mode === 'rest_api') {
              xhr.setRequestHeader('X-WP-Nonce', wlfmc_l10n.nonce);
            }
          },
          success: function success(response) {
            if (!response) {
              return;
            }
            if (typeof response.fragments !== 'undefined') {
              $.fn.WLFMC.replace_fragments(response.fragments);
            }
            if (response.error) {
              toastr.error(response.error);
              return;
            }
            if (!$('form.woocommerce-cart-form').length) {
              location.reload();
            } else {
              if (typeof response.fragments !== 'undefined' && response.fragments.wlfmc_save_for_later_count !== 'undefined') {
                $('.wlfmc-tabs-wrapper').attr('data-count', response.fragments.wlfmc_save_for_later_count);
              }
              $(document.body).trigger('wc_fragment_refresh');
              // Trigger event so themes can refresh other areas.
              $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, t]);
            }
          }
        });
        return false;
      });
      b.on('click', '#add_to_save_for_later_popup #add_item', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        $('#add_to_save_for_later_popup').popup('hide');
        var cart_item_key = $.fn.WLFMC.getUrlParameter(remove_item_url, 'remove_item');
        var row = $('a[href="' + remove_item_url + '"]').closest('tr');
        $.fn.WLFMC.add_to_save_for_later(cart_item_key, row);
        return false;
      });
      b.on('click', '#add_to_save_for_later_popup #remove_item', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        $('#add_to_save_for_later_popup').popup('hide');
        window.location.href = remove_item_url;
        return false;
      });
      b.on('click', '.wlfmc-sfl-btn-login-need', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toastr.error(wlfmc_l10n.labels.sfl_login_need);
        return false;
      });

      /* === ACCORDION === */
      b.on('click', '.wlfmc-accordion-header', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        if (!$(this).hasClass('active')) {
          $(this).addClass("active");
          $(this).next(".wlfmc-accordion-panel").slideDown();
        } else {
          $(this).removeClass("active");
          $(this).next(".wlfmc-accordion-panel").slideUp();
        }
        return false;
      });

      /* === CLOSE NOTICE === */
      b.on('click', '.wlfmc-save-for-later-form a.wlfmc-close-notice', function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        if (!$.fn.WLFMC.is_cookie_enabled()) {
          window.alert(wlfmc_l10n.labels.cookie_disabled);
          return;
        }
        $.fn.WLFMC.setCookie('wlfmc_save_for_later_notice', true);
        $(this).closest('.wlfmc-notice-wrapper').animate({
          opacity: 0
        }, "slow").remove();
        return false;
      });
      ;
      t.on('adding_to_cart', 'body', function (ev, button, data) {
        if (typeof button !== 'undefined' && typeof data !== 'undefined' && button.closest('.wlfmc-wishlist-table,.wlfmc-save-for-later-table').length) {
          data.wishlist_id = button.closest('.wlfmc-wishlist-table,.wlfmc-save-for-later-table').data('id');
          data.wishlist_type = button.closest('.wlfmc-wishlist-table,.wlfmc-save-for-later-table').data('wishlist-type');
          data.customer_id = button.closest('.wlfmc-wishlist-table,.wlfmc-save-for-later-table').data('customer-id');
          data.is_owner = button.closest('.wlfmc-wishlist-table,.wlfmc-save-for-later-table').data('is-owner');
          typeof wc_add_to_cart_params !== 'undefined' && (wc_add_to_cart_params.cart_redirect_after_add = wlfmc_l10n.redirect_to_cart);

          /*let product_meta                            = button.data( 'wlfmc_product_meta' );
          if (product_meta) {
          	$.each(
          		product_meta,
          		function (k,value) {
          			data[k] = value;
          		}
          	);
          	data.wlfmc_product_meta = true;
          }*/
        }
      });
      t.on('added_to_cart', 'body', function (ev, fragments, carthash, button) {
        if (typeof button !== 'undefined' && button.closest('.wlfmc-wishlist-table').length) {
          typeof wc_add_to_cart_params !== 'undefined' && (wc_add_to_cart_params.cart_redirect_after_add = cart_redirect_after_add);
          var tr = button.closest('[data-row-id]'),
            table = tr.closest('.wlfmc-wishlist-fragment'),
            options = table.data('fragment-options'),
            data_row_id = tr.data('row-id'),
            wishlist_id = table.find('.wlfmc-wishlist-table').data('id'),
            wishlist_token = table.find('.wlfmc-wishlist-table').data('token'),
            list_type = table.find('.wlfmc-wishlist-table').data('wishlist-type'),
            reload_fragment = false;
          button.removeClass('added');
          tr.find('.added_to_cart').remove();
          if (wlfmc_l10n.remove_from_wishlist_after_add_to_cart && options.is_user_owner) {
            $('.wlfmc-wishlist-form').find('[data-row-id="' + data_row_id + '"]').remove();
            if ('wishlist' === list_type) {
              if (typeof product_in_list !== 'undefined' && product_in_list !== null) {
                var product_count = product_in_list.length;
                for (var i = 0; i <= product_count - 1; i++) {
                  if (typeof product_in_list[i] !== 'undefined' && product_in_list[i].wishlist_id == wishlist_id && product_in_list[i].product_id == data_row_id) {
                    product_in_list.splice(i, 1);
                  }
                }
                $.fn.WLFMC.set_products_hash(JSON.stringify(product_in_list));
                $('.wlfmc-products-counter-wrapper').find('[data-row-id="' + data_row_id + '"]').remove();
                $('.wlfmc-products-counter-wrapper .products-counter-number').text(product_in_list.length);
                $('.wlfmc-products-counter-wishlist .total-products .wlfmc-total-count').text(product_in_list.length);
                $('.wlfmc-add-to-wishlist.wlfmc-add-to-wishlist-' + data_row_id).removeClass('exists');
                if (!product_in_list.length || product_in_list.length === 0 || !table.find('[data-row-id]').length) {
                  $('.wlfmc-wishlist-table-wrapper').empty();
                  $.fn.WLFMC.reload_fragment = true;
                }
              }
            }
            if ('waitlist' === list_type) {
              if (typeof product_in_waitlist !== 'undefined' && product_in_waitlist !== null) {
                var _product_count2 = product_in_waitlist.length;
                for (i = 0; i <= _product_count2 - 1; i++) {
                  if (typeof product_in_waitlist[i] !== 'undefined' && product_in_waitlist[i].wishlist_id == wishlist_id && product_in_waitlist[i].product_id == data_row_id) {
                    product_in_waitlist.splice(i, 1);
                  }
                }
                $.fn.WLFMC.set_waitlist_hash(JSON.stringify(product_in_waitlist));
                $('.wlfmc-waitlist-counter-wrapper').find('[data-row-id="' + data_row_id + '"]').remove();
                $('.wlfmc-waitlist-counter-wrapper .products-counter-number').text(product_in_waitlist.length);
                $('.wlfmc-waitlist-counter-wrapper .total-products .wlfmc-total-count').text(product_in_waitlist.length);
                $('.wlfmc-add-to-waitlist.wlfmc-add-to-waitlist-' + data_row_id).removeClass('exists');
                if (!product_in_waitlist.length || product_in_waitlist.length === 0 || !table.find('[data-row-id]').length) {
                  $('.wlfmc-wishlist-table-wrapper').empty();
                  $.fn.WLFMC.reload_fragment = true;
                }
              }
            }
            if ('lists' === list_type) {
              $.fn.WLFMC.reload_fragment = true;
            }
            if (reload_fragment) {
              $.fn.WLFMC.load_fragments();
            }
          }
        } else if (typeof button !== 'undefined' && button.closest('.wlfmc-save-for-later-table').length) {
          var tr = button.closest('[data-item-id]'),
            table = tr.closest('.wlfmc-wishlist-fragment'),
            options = table.data('fragment-options'),
            data_item_id = tr.data('item-id');
          button.removeClass('added');
          tr.find('.added_to_cart').remove();
          if (options.is_user_owner) {
            $('.wlfmc-save-for-later-form').find('[data-item-id="' + data_item_id + '"]').remove();
            if (!$('.wlfmc-save-for-later-items-wrapper .save-for-later-items-wrapper tr').length) {
              $('.wlfmc-save-for-later-table-wrapper').empty();
            }
          }
        }
      });
      t.on('add_to_cart_message', 'body', function (e, message, t) {
        var wrapper = $('.woocommerce-notices-wrapper .woocommerce-error,.woocommerce-notices-wrapper .woocommerce-message');
        t.removeClass('loading');
        if (wrapper.length === 0) {
          $('#wlfmc-wishlist-form').prepend(message);
        } else {
          wrapper.fadeOut(300, function () {
            $(this).closest('.woocommerce-notices-wrapper').replaceWith(message).fadeIn();
          });
        }
      });
      t.on('cart_page_refreshed', 'body', $.fn.WLFMC.init_handling_after_ajax);
      ;
      /* === DROPDOWN COUNTER === */

      if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
        var wlfmc_swipe_trigger;
        b.on('touchstart', '.wlfmc-counter-wrapper.show-list-on-hover,.wlfmc-counter-wrapper.show-list-on-click', function (e) {
          wlfmc_swipe_trigger = false;
        });
        b.on('touchmove', '.wlfmc-counter-wrapper.show-list-on-hover,.wlfmc-counter-wrapper.show-list-on-click', function (e) {
          wlfmc_swipe_trigger = true;
        });
        b.on('touchend', '.wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter.has-dropdown,.wlfmc-counter-wrapper.show-list-on-click  .wlfmc-counter.has-dropdown', function (e) {
          var elem = $(this).closest('.wlfmc-counter-wrapper');
          if (elem.hasClass('wlfmc-first-touch')) {
            if (!wlfmc_swipe_trigger) {
              $.fn.WLFMC.hide_mini_wishlist.call($('.wlfmc-counter-wrapper'), e);
            }
          } else {
            e.stopImmediatePropagation();
            e.preventDefault();
            $.fn.WLFMC.show_mini_wishlist.call(this, e);
            elem.addClass('wlfmc-first-touch');
          }
        });
        b.on('touchend', ':not(.wlfmc-counter-wrapper.show-list-on-hover):not(.wlfmc-counter-wrapper.show-list-on-click)', function (e) {
          if ($(e.target).closest('.wlfmc-counter-wrapper').length === 0) {
            $.fn.WLFMC.hide_mini_wishlist.call($('.wlfmc-counter-wrapper'), e);
          }
        });
        // fix url in dropdown in iphone devices
        b.on('touchend', '.wlfmc-counter-wrapper .wlfmc-counter.has-dropdown a:not(.remove_from_wishlist)', function (ev) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          window.location.href = $(this).attr('href');
          return false;
        });
      } else {
        b.on('click', '.wlfmc-counter-wrapper.show-list-on-click .wlfmc-counter.has-dropdown', function (ev) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          var elem = $('.dropdown_' + $(this).attr('data-id')) || $(this).closest('.wlfmc-counter-wrapper').find('.wlfmc-counter-dropdown');
          $.fn.WLFMC.appendtoBody(elem.closest('.wlfmc-counter-wrapper'));
          $.fn.WLFMC.prepare_mini_wishlist(elem);
          elem.toggleClass('lists-show');
          return false;
        });
        t.on("click", function (ev) {
          var $trigger = $(".wlfmc-counter-wrapper.show-list-on-click .wlfmc-counter.has-dropdown");
          if ($trigger !== ev.target && !$trigger.has(ev.target).length) {
            $('.wlfmc-counter-dropdown').removeClass("lists-show");
          }
        });
        b.on('mouseover', '.wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter-dropdown', function (ev) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          $(this).addClass("lists-show");
          return false;
        });
        b.on('mouseout', '.wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter-dropdown', function (ev) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          $(this).removeClass("lists-show");
          return false;
        });
        b.on('mouseover', '.wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter.has-dropdown', function (ev) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          var elem = $('.dropdown_' + $(this).attr('data-id')) || $(this).closest('.wlfmc-counter-wrapper').find('.wlfmc-counter-dropdown');
          $(elem).addClass("lists-show");
          $.fn.WLFMC.appendtoBody(elem.closest('.wlfmc-counter-wrapper'));
          $.fn.WLFMC.prepare_mini_wishlist(elem);
          return false;
        });
        b.on('mouseout', '.wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter.has-dropdown', function (ev) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          var elem = $('.dropdown_' + $(this).attr('data-id'));
          $(elem).removeClass("lists-show");
          return false;
        });
        $('.wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter.has-dropdown').hoverIntent({
          interval: 0,
          timeout: 100,
          over: $.fn.WLFMC.show_mini_wishlist,
          out: $.fn.WLFMC.hide_mini_wishlist
        });
      }
      ;
      $.fn.WLFMC.init_prepare_qty_links();
      $.fn.WLFMC.init_wishlist_popup();
      $.fn.WLFMC.init_quantity();
      $.fn.WLFMC.init_checkbox_handling();
      $.fn.WLFMC.init_copy_wishlist_link();
      $.fn.WLFMC.init_tooltip();
      $.fn.WLFMC.init_components();
      $.fn.WLFMC.init_popups();
      $.fn.WLFMC.init_layout();
      $.fn.WLFMC.init_drag_n_drop();
      $.fn.WLFMC.init_popup_checkbox_handling();
      $.fn.WLFMC.init_dropdown_lists();
    }).trigger('wlfmc_init');

    // fix with jet woo builder plugin.

    $(document).on('jet-filter-content-rendered', $.fn.WLFMC.reInit_wlfmc).on('jet-woo-builder-content-rendered', $.fn.WLFMC.reInit_wlfmc).on('jet-engine/listing-grid/after-load-more', $.fn.WLFMC.reInit_wlfmc).on('jet-engine/listing-grid/after-lazy-load', $.fn.WLFMC.reInit_wlfmc).on('jet-cw-loaded', $.fn.WLFMC.reInit_wlfmc);
    // load fragment for fix filter everything ajax response.
    $(document).ready($.fn.WLFMC.load_fragments);
    // load fragment for fix bug with ajax filter Destiny Elements plugin
    $(document).on('deContentLoaded', $.fn.WLFMC.load_fragments);
    // fix waitlist popup after wpc composite product gallery loaded in single product page
    $(document).on('wooco_gallery_loaded', function (e, product_id) {
      if (product_id) {
        $('*[id^="add_to_waitlist_popup_' + product_id + '_"].popup_wrapper').remove();
      }
    });
    ;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if ($('.woocommerce-product-gallery__wrapper .wlfmc-top-of-image').length > 0) {
          $.fn.WLFMC.init_fix_on_image_single_position();
        }
        // fix top of image for power-pack single product.
        if ($('.pp-single-product .entry-summary > .wlfmc-top-of-image').length > 0 && $('.pp-single-product .entry-summary .single-product-image').length > 0) {
          $('.pp-single-product').each(function () {
            var $wlfmcTopOfImage = $(this).find('.wlfmc-top-of-image');
            var $singleProductImage = $(this).find('.single-product-image');
            if ($wlfmcTopOfImage.length > 0 && $singleProductImage.length > 0) {
              $wlfmcTopOfImage.appendTo($singleProductImage);
            }
          });
        }
      });
    });
    observer.observe($('body')[0], {
      childList: true,
      subtree: true
    });
    ;

    /* === DROPDOWN COUNTER === */

    $(window).on("scroll resize", function () {
      $(".wlfmc-counter-dropdown").each(function () {
        $.fn.WLFMC.prepare_mini_wishlist($(this));
      });
    });
    ;

    /* Storage Handling */

    var $supports_html5_storage = true,
      wishlist_hash_key = wlfmc_l10n.wishlist_hash_key,
      products_hash_key = wishlist_hash_key + '_products',
      waitlist_hash_key = wishlist_hash_key + '_waitlist',
      lang_hash_key = wishlist_hash_key + '_lang';
    try {
      $supports_html5_storage = 'sessionStorage' in window && window.sessionStorage !== null;
      window.sessionStorage.setItem('wlfmc', 'test');
      window.sessionStorage.removeItem('wlfmc');
      window.localStorage.setItem('wlfmc', 'test');
      window.localStorage.removeItem('wlfmc');
    } catch (err) {
      $supports_html5_storage = false;
    }
    if (wlfmc_l10n.is_cache_enabled && wlfmc_l10n.is_page_cache_enabled) {
      $.fn.WLFMC.table_block();
    }

    /* Wishlist Handling */
    if ($supports_html5_storage) {
      // Refresh when storage changes in another tab.
      $(window).on('storage onstorage', function (e) {
        if (products_hash_key === e.originalEvent.key && localStorage.getItem(products_hash_key) !== sessionStorage.getItem(products_hash_key) || waitlist_hash_key === e.originalEvent.key && localStorage.getItem(waitlist_hash_key) !== sessionStorage.getItem(waitlist_hash_key)) {
          $.fn.WLFMC.load_fragments();
        }
      });

      // Refresh when page is shown after back button (safari).
      $(window).on('pageshow', function (e) {
        if (e.originalEvent.persisted) {
          $.fn.WLFMC.load_fragments();
        }
      });
      try {
        if (wlfmc_l10n.is_cache_enabled) {
          throw 'Need Update wishlist data';
        }
        if (wlfmc_l10n.update_wishlists_data || null !== lang && lang !== localStorage.getItem(lang_hash_key) || localStorage.getItem(products_hash_key) !== JSON.stringify(wishlist_items) || localStorage.getItem(waitlist_hash_key) !== JSON.stringify(waitlist_items)) {
          localStorage.setItem(products_hash_key, '');
          localStorage.setItem(waitlist_hash_key, '');
          localStorage.setItem(lang_hash_key, '');
          $.fn.WLFMC.check_products(wishlist_items);
          $.fn.WLFMC.check_waitlist_products(waitlist_items);
          throw 'Need Update wishlist data';
        }
        if (localStorage.getItem(products_hash_key)) {
          var data = JSON.parse(localStorage.getItem(products_hash_key));
          if ('object' === _typeof(data) && null !== data) {
            $.fn.WLFMC.check_products(data);
          }
        }
        if (localStorage.getItem(waitlist_hash_key)) {
          var data = JSON.parse(localStorage.getItem(waitlist_hash_key));
          if ('object' === _typeof(data) && null !== data) {
            $.fn.WLFMC.check_waitlist_products(data);
          }
        }
        $.fn.WLFMC.unblock($('.wlfmc-wishlist-table-wrapper, .wlfmc-save-for-later-table-wrapper'));
        $('#wlfmc-lists,#wlfmc-wishlist-form').addClass('on-first-load');
      } catch (err) {
        console.log(err);
        $.fn.WLFMC.load_fragments();
      }
    } else {
      $.fn.WLFMC.load_fragments();
    }
    ;
    var hasSelectiveRefresh = 'undefined' !== typeof wp && wp.customize && wp.customize.selectiveRefresh && wp.customize.widgetsPreview && wp.customize.widgetsPreview.WidgetPartial;
    if (hasSelectiveRefresh) {
      wp.customize.selectiveRefresh.bind('partial-content-rendered', function () {
        $.fn.WLFMC.load_fragments();
      });
    }
    ;
  });
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvanMvbWFpbi1wcmVtaXVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLENBQUMsVUFBVSxDQUFDLEVBQUU7RUFDYixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDZCxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVk7SUFDN0I7SUFDQSxJQUFJLGVBQWUsR0FBTyxFQUFFO01BQzNCLG1CQUFtQixHQUFHLEVBQUU7TUFDeEIsSUFBSSxHQUFrQixVQUFVLENBQUMsSUFBSTtNQUNyQyxlQUFlLEdBQU8sSUFBSTtNQUMxQixjQUFjLEdBQVEsVUFBVSxDQUFDLGNBQWM7TUFDL0MsY0FBYyxHQUFRLFVBQVUsQ0FBQyxjQUFjO01BQy9DLGNBQWMsR0FBUSxLQUFLO01BQzNCLFdBQVc7TUFDWCxlQUFlO0lBRWhCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHO01BQ2Qsc0JBQXNCLEVBQUUsU0FBQSx1QkFBQSxFQUFZO1FBQ25DLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBRSxpQ0FBa0MsQ0FBQztRQUV4RSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ25CLE9BQU8sS0FBSztRQUNiO1FBRUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7VUFDcEMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUMsRUFBRTtZQUMxQyxPQUFPLEtBQUs7VUFDYjtVQUVBLElBQUksSUFBSSxHQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFh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LEdBQUcsR0FBRztVQUNqRCxDQUFDO1VBQ0QsSUFBSSxjQUFjLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7VUFDdkQsSUFBSSxhQUFhLEdBQUksTUFBTSxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUM7VUFDN0MsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLEtBQUssSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUM1RSxJQUFJLENBQUMsR0FBRyxDQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUksSUFBSSxDQUFDLEdBQUksR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQzNGLElBQUksQ0FBQyxHQUFHLENBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBSSxJQUFJLENBQUMsSUFBSyxHQUFJLEdBQUcsR0FBRyxDQUFFLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztVQUUzRyxDQUFDLE1BQU07WUFDTjtZQUNBLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUksR0FBRyxHQUFHLENBQUU7WUFDMUQsR0FBRyxHQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFJLEdBQUcsR0FBRyxDQUFFLEdBQUcsR0FBRztZQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUksSUFBSSxDQUFDLEdBQUksR0FBRyxHQUFJLENBQUM7WUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQyxJQUFLLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztVQUUvRjtVQUNBLElBQUksU0FBUyxDQUFFLElBQUssQ0FBQyxFQUFFO1lBQ3RCLFlBQVksQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUUsWUFBWSxDQUFDLFNBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3RixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7VUFDcEIsQ0FBQyxNQUFNO1lBQ04sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1VBQ3BCO1FBRUQsQ0FBQzs7UUFFRDtRQUNBLElBQUksWUFBWSxHQUFHLElBQUksYUFBYSxDQUFDLENBQUM7UUFDdEM7UUFDQSxJQUFJLGFBQWEsR0FBRyxjQUFjLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyxjQUFjLEdBQUcsQ0FBQztRQUM1RTtRQUNBLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxFQUFFLENBQ2YsdUJBQXVCLEVBQ3ZCLGdCQUFnQixFQUNoQixVQUFVLENBQUMsRUFBRTtVQUNaLElBQUksS0FBSyxHQUFhLElBQUk7VUFDMUIsWUFBWSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQztVQUM3QixJQUFJLFlBQVksR0FBTSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBRSxHQUFJLENBQUM7VUFDbEQsWUFBWSxDQUFDLE9BQU8sQ0FDbkIsVUFBVSxFQUFFLEVBQUU7WUFDYixJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUUsZ0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtjQUFFO2NBQzNDLFlBQVksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBRSxHQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFFLEdBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDckU7VUFDRCxDQUNELENBQUM7VUFFRCxJQUFJLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUMsRUFBRTtZQUUxQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUM7VUFFNUQ7VUFDQSxJQUFJLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUMsRUFBRTtZQUUxQyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUM7WUFDekQsT0FBTyxDQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLE1BQU8sQ0FBQztVQUVsRDtVQUNBO1VBQ0EsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtZQUM1QixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbkI7O1VBRUE7VUFDQSxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDN0IsWUFBWSxDQUFFLFlBQVksQ0FBQyxXQUFZLENBQUM7WUFDeEMsWUFBWSxDQUFDLFdBQVcsR0FBRyxJQUFJO1VBQ2hDO1FBRUQsQ0FDRCxDQUFDO1FBQ0QsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FDZixxQkFBcUIsRUFDckIsZ0JBQWdCLEVBQ2hCLFVBQVUsQ0FBQyxFQUFFO1VBQ1o7VUFDQTtVQUNBLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksYUFBYSxFQUFFO1lBQzNDLFlBQVksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUNwQyxZQUFZO2NBQ1gsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLENBQUMsRUFDRCxJQUNELENBQUMsQ0FBQyxDQUFDO1VBQ0osQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUU7WUFDbkMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1VBQ3BCO1FBQ0QsQ0FDRCxDQUFDO1FBQ0Q7UUFDQSxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLGtCQUFrQixFQUNsQixVQUFVLENBQUMsRUFBRTtVQUNaLElBQUssQ0FBRSxDQUFDLENBQUUsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBRSxnQkFBaUIsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLENBQUMsTUFBTyxDQUFDLENBQUMsRUFBRSxDQUFFLFlBQVksQ0FBQyxJQUFLLENBQUMsRUFBRTtZQUNuRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7VUFDcEI7UUFDRCxDQUNELENBQUM7TUFDRixDQUFDO01BRUQsaUNBQWlDLEVBQUUsU0FBQSxrQ0FBQSxFQUFZO1FBQzlDLElBQUksQ0FBQyxDQUFFLDJEQUE0RCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNoRixDQUFDLENBQUUsMkRBQTRELENBQUMsQ0FBQyxJQUFJLENBQ3BFLFlBQVk7WUFDWCxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsV0FBVyxDQUFFLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDO1VBQzVDLENBQ0QsQ0FBQztRQUNGOztRQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUdDLENBQUM7TUFFRDs7TUFFQTtBQUNEO0FBQ0E7QUFDQTtBQUNBO01BQ0MsbUJBQW1CLEVBQUUsU0FBQSxvQkFBQSxFQUFZO1FBQ2hDO1FBQ0EsSUFBSSxRQUFRLEdBQVMsU0FBakIsUUFBUSxDQUFtQixJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ3hDLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBRSxlQUFnQixDQUFDLEVBQUU7Y0FDeEYsSUFBSSxNQUFNLEdBQUcsUUFBUSxLQUFLLEVBQUUsR0FBRyxhQUFhLEdBQUcsVUFBVTtjQUV6RCxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUUsa0JBQW1CLENBQUM7WUFDMUM7VUFDRCxDQUFDO1VBQ0EsV0FBVyxHQUFNLFNBQWpCLFdBQVcsQ0FBZ0IsSUFBSSxFQUFFO1lBQ2hDLFFBQVEsQ0FBRSxJQUFJLEVBQUUsS0FBTSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFhLElBQUksRUFBRTtZQUNoQyxRQUFRLENBQUUsSUFBSSxFQUFFLFFBQVMsQ0FBQztVQUMzQixDQUFDO1VBQ0QsUUFBUSxHQUFTLElBQUksZ0JBQWdCLENBQ3BDLFVBQVUsYUFBYSxFQUFFO1lBQ3hCLEtBQUssSUFBSSxDQUFDLElBQUksYUFBYSxFQUFFO2NBQzVCLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUM7Y0FDL0IsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtnQkFDbEMsSUFBSyxPQUFPLFFBQVEsQ0FBQyxVQUFVLEtBQUssV0FBVyxFQUFHO2tCQUNqRCxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBRSxXQUFZLENBQUM7Z0JBQzNDO2dCQUVBLElBQUssT0FBTyxRQUFRLENBQUMsWUFBWSxLQUFLLFdBQVcsRUFBRztrQkFDbkQsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsY0FBZSxDQUFDO2dCQUNoRDtjQUNEO1lBQ0Q7VUFDRCxDQUNELENBQUM7UUFFRixRQUFRLENBQUMsT0FBTyxDQUNmLFFBQVEsQ0FBQyxJQUFJLEVBQ2I7VUFDQyxTQUFTLEVBQUU7UUFDWixDQUNELENBQUM7TUFDRixDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtNQUNDLHNCQUFzQixFQUFFLFNBQUEsdUJBQUEsRUFBWTtRQUNuQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUUsb0RBQXFELENBQUMsQ0FBQyxJQUFJLENBQUUsZ0RBQWlELENBQUM7UUFDbkksSUFBSSxJQUFJLEdBQVMsQ0FBQyxDQUFFLCtDQUFnRCxDQUFDO1FBQ3JFLFVBQVUsQ0FBQyxHQUFHLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUM1QixRQUFRLEVBQ1IsVUFBVSxDQUFDLEVBQUU7VUFFWixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQztZQUNoQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1VBRWYsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsVUFBVyxDQUFDLEVBQUU7WUFDMUIsQ0FBQyxDQUFFLGNBQWMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLE1BQU8sQ0FBQyxHQUFHLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1lBQ3RFLENBQUMsQ0FBRSxtQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1lBQ2pELENBQUMsQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1VBQ25EO1VBQ0EsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxTQUFVLENBQUMsQ0FDeEIsV0FBVyxDQUFFLFdBQVksQ0FBQyxDQUMxQixRQUFRLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxVQUFXLENBQUMsR0FBRyxTQUFTLEdBQUcsV0FBWSxDQUFDO1VBRTFELElBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7WUFFdEIsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBRSxVQUFXLENBQUM7WUFDM0MsSUFBSSxTQUFTLEVBQUU7Y0FDZCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWixDQUFDLE1BQU07Y0FDTixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWjtZQUNBLElBQUksR0FBRyxHQUFjLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsSUFBSyxDQUFDO1lBQzlDLElBQUksTUFBTSxHQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUUsY0FBZSxDQUFDO1lBQy9DLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsY0FBZSxDQUFDO1lBQ2hELElBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBRSxVQUFXLENBQUMsRUFBRztjQUMxQixJQUFJLGNBQWMsRUFBRTtnQkFDbkIsY0FBYyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDO2dCQUM1QyxjQUFjLENBQUMsSUFBSSxDQUFFLE1BQU8sQ0FBQztnQkFDN0IsY0FBYyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUUsR0FBSSxDQUFDO2NBQzVDLENBQUMsTUFBTTtnQkFDTixjQUFjLEdBQUcsTUFBTTtjQUN4QjtZQUNELENBQUMsTUFBTTtjQUNOLElBQUksY0FBYyxFQUFFO2dCQUNuQixjQUFjLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBRSxHQUFJLENBQUM7Z0JBQzVDLElBQUksS0FBSyxHQUFRLGNBQWMsQ0FBQyxPQUFPLENBQUUsTUFBTyxDQUFDO2dCQUNqRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtrQkFDakIsY0FBYyxDQUFDLE1BQU0sQ0FBRSxLQUFLLEVBQUUsQ0FBRSxDQUFDO2dCQUNsQztnQkFDQSxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBRSxHQUFJLENBQUM7Y0FDNUM7WUFDRDtZQUVBLElBQUksQ0FBQyxJQUFJLENBQUUsY0FBYyxFQUFFLGNBQWUsQ0FBQztVQUU1QztVQUNBLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxRQUFTLENBQUM7TUFDdEIsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7TUFDQyx3QkFBd0IsRUFBRSxTQUFBLHlCQUFBLEVBQVk7UUFDckMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDN0I7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZCO1FBQ0EsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSx1QkFBd0IsQ0FBQztNQUNqRCxDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtNQUNDLGFBQWEsRUFBRSxTQUFBLGNBQUEsRUFBWTtRQUMxQixJQUFJLEtBQUssRUFDUixPQUFPO1FBRVIsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FDZixRQUFRLEVBQ1Isc0ZBQXNGLEVBQ3RGLFlBQVk7VUFDWCxJQUFJLENBQUMsR0FBZSxDQUFDLENBQUUsSUFBSyxDQUFDO1lBQzVCLEdBQUcsR0FBYSxDQUFDLENBQUMsT0FBTyxDQUFFLGVBQWdCLENBQUM7WUFDNUMsVUFBVSxHQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUUsUUFBUyxDQUFDO1lBQ3BDLGFBQWEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7WUFDM0MsS0FBSyxHQUFXLENBQUMsQ0FBQyxPQUFPLENBQUUsbURBQW9ELENBQUM7WUFDaEYsS0FBSyxHQUFXLEtBQUssQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1VBRXRDLFlBQVksQ0FBRSxPQUFRLENBQUM7O1VBRXZCO1VBQ0EsR0FBRyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7VUFFbEUsT0FBTyxHQUFHLFVBQVUsQ0FDbkIsWUFBWTtZQUNYLElBQUksS0FBSyxFQUFFO2NBQ1YsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2Q7WUFFQSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDYjtjQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUTtjQUN4QixJQUFJLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CO2dCQUMvQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7Z0JBQzVCLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsYUFBYSxFQUFFLGFBQWE7Z0JBQzVCLGNBQWMsRUFBRSxLQUFLO2dCQUNyQixRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDaEI7Y0FDRCxDQUFDO2NBQ0QsTUFBTSxFQUFFLE1BQU07Y0FDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtnQkFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtrQkFDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO2dCQUN2RDtnQkFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDO2NBQ3hCLENBQUM7Y0FDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7Z0JBQ3JCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxHQUFJLENBQUM7Y0FDMUIsQ0FBQztjQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO2dCQUM1QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDM0I7QUFDVDtBQUNBO0FBQ0E7Y0FDUTtZQUNELENBQ0QsQ0FBQztVQUNGLENBQUMsRUFDRCxJQUNELENBQUM7UUFDRixDQUNELENBQUM7TUFDRixDQUFDO01BRUQsV0FBVyxFQUFFLFNBQUEsWUFBQSxFQUFZO1FBQ3hCLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxFQUFFLENBQ2IsT0FBTyxFQUNQLDJDQUEyQyxFQUMzQyxVQUFVLEVBQUUsRUFBRTtVQUNiLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixJQUFJLEVBQUUsR0FBYyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVcsQ0FBQztVQUNoRCxJQUFJLElBQUksR0FBWSxDQUFDLENBQUUsR0FBRyxHQUFHLEVBQUcsQ0FBQztVQUNqQyxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxVQUFXLENBQUM7VUFFOUMsSUFBSyxDQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDNUIsSUFBSSxjQUFjLEdBQUc7Y0FDcEIsUUFBUSxFQUFFLEtBQUs7Y0FDZixLQUFLLEVBQUUsTUFBTTtjQUNiLFVBQVUsRUFBRSxVQUFVO2NBQ3RCLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQztjQUNyQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFXO1lBQ2pDLENBQUM7WUFDRCxJQUFJLENBQUMsS0FBSyxDQUFFLGNBQWUsQ0FBQztVQUM3QjtVQUNBLENBQUMsQ0FBRSxnQkFBaUIsQ0FBQyxDQUNuQixHQUFHLENBQ0g7WUFDQyxLQUFLLEVBQUUsR0FBRztZQUNWLE1BQU0sRUFBRTtVQUNULENBQ0QsQ0FBQyxDQUNBLFdBQVcsQ0FBQyxDQUFDLENBQ2IsUUFBUSxDQUFFLGlCQUFrQixDQUFDO1VBQy9CLENBQUMsQ0FBRSxHQUFHLEdBQUcsRUFBRyxDQUFDLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztVQUM3QixPQUFPLEtBQUs7UUFDYixDQUNELENBQUM7UUFDRCxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsRUFBRSxDQUNiLE9BQU8sRUFDUCxvQkFBb0IsRUFDcEIsVUFBVSxFQUFFLEVBQUU7VUFDYixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFXLENBQUM7VUFDckMsQ0FBQyxDQUFFLEdBQUcsR0FBRyxFQUFHLENBQUMsQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO1VBQzdCLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQztNQUVGLENBQUM7TUFFRCxXQUFXLEVBQUUsU0FBQSxZQUFBLEVBQVk7UUFDeEIsSUFBSSxLQUFLLEVBQ1IsT0FBTztRQUNSLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxFQUFFLENBQ2YsT0FBTyxFQUNQLHNCQUFzQixFQUN0QixVQUFVLEVBQUUsRUFBRTtVQUNiLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztVQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFFLHNCQUF1QixDQUFDLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxnQkFBaUIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxnQkFBaUIsQ0FBQztVQUU1SCxZQUFZLENBQUUsT0FBUSxDQUFDO1VBRXZCLE9BQU8sR0FBRyxVQUFVLENBQ25CLFlBQVk7WUFDWCxJQUFJLEtBQUssRUFBRTtjQUNWLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNkO1lBRUEsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQ2I7Y0FFQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7Y0FDeEIsSUFBSSxFQUFFO2dCQUNMLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWE7Z0JBQ3hDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztnQkFDM0IsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQyxHQUFHLE1BQU0sR0FBRztjQUNoRCxDQUFDO2NBQ0QsTUFBTSxFQUFFLE1BQU07Y0FDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtnQkFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtrQkFDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO2dCQUN2RDtjQUNELENBQUM7Y0FDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7Z0JBQ3JCO2NBQUE7WUFFRixDQUNELENBQUM7VUFDRixDQUFDLEVBQ0QsSUFDRCxDQUFDO1VBQ0QsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVELGVBQWUsRUFBRSxTQUFBLGdCQUFBLEVBQVk7UUFDNUIsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FDZixPQUFPLEVBQ1AsaUNBQWlDLEVBQ2pDLFVBQVUsQ0FBQyxFQUFFO1VBQ1osQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ2xCLElBQUksS0FBSyxHQUFVLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDNUIsSUFBSSxJQUFJLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDeEMsSUFBSSxTQUFTLEdBQU0sSUFBSSxDQUFDLElBQUksQ0FBRSwyQkFBNEIsQ0FBQztVQUMzRCxJQUFJLEtBQUssR0FBVSxJQUFJLENBQUMsSUFBSSxDQUFFLHNCQUF1QixDQUFDLENBQUMsTUFBTSxDQUFFLHNCQUF1QixDQUFDO1VBQ3ZGLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO1VBRTNDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztVQUN0QixLQUFLLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztVQUMzQixJQUFJLENBQUMsV0FBVyxDQUFFLGdCQUFnQixFQUFFLFlBQWEsQ0FBQztVQUNsRCxPQUFPLEtBQUs7UUFFYixDQUNELENBQUM7UUFDRCxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLE9BQU8sRUFDUCwrQkFBK0IsRUFDL0IsVUFBVSxDQUFDLEVBQUU7VUFDWixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBRSwyQkFBNEIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1VBQ3JELElBQUksQ0FBQyxXQUFXLENBQUUsZ0JBQWlCLENBQUM7VUFDcEMsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVELDRCQUE0QixFQUFFLFNBQUEsNkJBQUEsRUFBWTtRQUN6QyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLFFBQVEsRUFDUixxQkFBcUIsRUFDckIsWUFBWTtVQUVYLElBQUksWUFBWSxHQUFNLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDO1VBQ3ZELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsd0ZBQXlGLENBQUM7VUFDbkksSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFFLDZCQUE4QixDQUFDLEVBQUU7WUFDOUQsSUFBSSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFFLFVBQVcsQ0FBQyxFQUFFO2NBQy9CLFlBQVksQ0FBQyxRQUFRLENBQUUsVUFBVyxDQUFDO1lBQ3BDLENBQUMsTUFBTTtjQUNOLFlBQVksQ0FBQyxXQUFXLENBQUUsVUFBVyxDQUFDO1lBQ3ZDO1VBQ0Q7VUFDQSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUUsNEJBQTZCLENBQUMsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFFLDRCQUE2QixDQUFDLEVBQUU7WUFDekgsSUFBSSxVQUFVLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztZQUNqRSxlQUFlLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxVQUFXLENBQUM7WUFDOUQsSUFBSSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFFLFVBQVcsQ0FBQyxFQUFFO2NBQy9CLFlBQVksQ0FBQyxRQUFRLENBQUUsVUFBVyxDQUFDO2NBQ25DLFVBQVUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFFLElBQUssQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUM7WUFDckQ7VUFDRDtRQUNELENBQ0QsQ0FBQztNQUNGLENBQUM7TUFFRCxtQkFBbUIsRUFBRSxTQUFBLG9CQUFBLEVBQVk7UUFDaEMsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFFLGlCQUFrQixDQUFDO1FBQzVDLElBQUssQ0FBRSxlQUFlLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7VUFDdkQ7UUFDRDtRQUNBLElBQUksZUFBZSxDQUFDLElBQUksQ0FBRSxpQkFBa0IsQ0FBQyxFQUFFO1VBQzlDLGVBQWUsQ0FBQyxhQUFhLENBQUUsU0FBVSxDQUFDO1FBQzNDO1FBQ0EsZUFBZSxDQUNiLEVBQUUsQ0FDRix3QkFBd0IsRUFDeEIsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFO1VBQ2hCLElBQUksT0FBUSxFQUFHLEtBQUssV0FBVyxFQUFHO1lBQ2pDLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUseUJBQTBCLENBQUMsQ0FBQyxRQUFRLENBQUUsOENBQStDLENBQUM7WUFDekcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHlCQUEwQixDQUFDLENBQUMsSUFBSSxDQUFFLCtCQUErQixHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGVBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO1lBQzNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUseUJBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUUsK0JBQStCLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLEtBQU0sQ0FBQztVQUM5STtRQUNELENBQ0QsQ0FBQyxDQUNBLGFBQWEsQ0FDYjtVQUNDLE9BQU8sRUFBRTtRQUNWLENBQ0QsQ0FBQztNQUVILENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO01BQ0MsdUJBQXVCLEVBQUUsU0FBQSx3QkFBQSxFQUFZO1FBQ3BDLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxFQUFFLENBQ2YsT0FBTyxFQUNQLG9CQUFvQixFQUNwQixVQUFVLENBQUMsRUFBRTtVQUNaLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQzVCLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNsQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO1VBRTNCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FDYixVQUFVLEVBQ1Y7WUFDQyxHQUFHLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBRSxXQUFZLENBQUM7WUFDcEMsSUFBSSxFQUFFO1VBQ1AsQ0FDRCxDQUFDO1VBRUQsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBRSxNQUFPLENBQUM7VUFFNUIsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBRSxDQUFDLEVBQUUsSUFBSyxDQUFDO1VBQ3ZDLENBQUMsTUFBTTtZQUNOLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUNoQjtVQUNBLFFBQVEsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDO1VBRTlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUVmLE1BQU0sQ0FBQyxPQUFPLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxXQUFZLENBQUM7VUFFL0MsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNDLGtCQUFrQixFQUFFLFNBQUEsbUJBQVUsTUFBTSxFQUFFO1FBQ3JDLElBQUksT0FBTyxHQUFLLENBQUMsQ0FBQztVQUNqQixTQUFTLEdBQUcsSUFBSTtRQUVqQixJQUFJLE1BQU0sRUFBRTtVQUNYLElBQUksUUFBQSxDQUFPLE1BQU0sTUFBSyxRQUFRLEVBQUU7WUFDL0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQ2hCO2NBQ0MsU0FBUyxFQUFFLElBQUk7Y0FDZixDQUFDLEVBQUUsRUFBRTtjQUNMLFNBQVMsRUFBRSxDQUFDLENBQUUsUUFBUyxDQUFDO2NBQ3hCLFNBQVMsRUFBRTtZQUNaLENBQUMsRUFDRCxNQUNELENBQUM7WUFFRCxJQUFLLENBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRTtjQUN4QixTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUUsMEJBQTJCLENBQUM7WUFDaEUsQ0FBQyxNQUFNO2NBQ04sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTO1lBQzdCO1lBRUEsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFO2NBQ2IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUUscUJBQXNCLENBQUMsQ0FBQyxHQUFHLENBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBRSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUssQ0FBRSxDQUFDO1lBQ3ZIO1lBRUEsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2NBQ3JCLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFFLGdCQUFpQixDQUFDO1lBQ2pEO1VBQ0QsQ0FBQyxNQUFNO1lBQ04sU0FBUyxHQUFHLENBQUMsQ0FBRSwwQkFBMkIsQ0FBQztZQUUzQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7Y0FDN0QsU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUUscUJBQXNCLENBQUMsQ0FBQyxHQUFHLENBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBRSxzQkFBc0IsR0FBRyxNQUFNLEdBQUcsSUFBSyxDQUFFLENBQUM7WUFDckg7VUFDRDtRQUNELENBQUMsTUFBTTtVQUNOLFNBQVMsR0FBRyxDQUFDLENBQUUsMEJBQTJCLENBQUM7UUFDNUM7UUFFQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7VUFDckIsU0FBUyxDQUFDLElBQUksQ0FDYixZQUFZO1lBQ1gsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFFLElBQUssQ0FBQztjQUNqQixFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUMsQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDLENBQUMsTUFBTSxDQUN6QyxVQUFDLEdBQUcsRUFBSztnQkFBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxLQUFLLFFBQVE7Y0FBQyxDQUNqRCxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVUsQ0FBQyxvQkFBcUIsQ0FBQztZQUUxQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztVQUMzQyxDQUNELENBQUM7UUFDRixDQUFDLE1BQU07VUFDTixPQUFPLElBQUk7UUFDWjtRQUVBLE9BQU8sT0FBTztNQUNmLENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNDLGNBQWMsRUFBRSxTQUFBLGVBQVUsTUFBTSxFQUFFLFFBQU8sRUFBRSxXQUFXLEVBQUU7UUFFdkQsWUFBWSxDQUFFLGVBQWdCLENBQUM7UUFFL0IsZUFBZSxHQUFHLFVBQVUsQ0FDM0IsWUFBWTtVQUNYLElBQUssV0FBVyxFQUFHO1lBQ2xCLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztVQUNwQjtVQUNBLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUNoQjtZQUNDLFNBQVMsRUFBRTtVQUNaLENBQUMsRUFDRCxNQUNELENBQUM7VUFFRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBRSxNQUFPLENBQUM7VUFDdkQ7VUFDQSxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDO1VBQzdCLFFBQVEsQ0FBQyxNQUFNLENBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBZSxDQUFDO1VBQzlELFFBQVEsQ0FBQyxNQUFNLENBQUUsU0FBUyxFQUFFLFVBQVcsQ0FBQztVQUN4QyxJQUFLLFNBQVMsRUFBRTtZQUNmO1lBQ0EsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxTQUFVLENBQUM7WUFDOUM7WUFDQSxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLGVBQWdCLENBQUM7WUFDdEQsUUFBUSxDQUFDLE1BQU0sQ0FBRSxnQkFBZ0IsRUFBRSxJQUFLLENBQUM7VUFDMUM7VUFFQSxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDbkI7WUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFNBQVM7WUFBRTtZQUMzQixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osV0FBVyxFQUFFLEtBQUs7WUFDbEIsV0FBVyxFQUFFLEtBQUs7WUFDbEI7QUFDTjtBQUNBO0FBQ0E7QUFDQTtZQUNNLE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO2NBQ3hCLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtnQkFDMUMsSUFBSSxPQUFPLFFBQU8sS0FBSyxVQUFVLEVBQUU7a0JBQ2xDLFFBQU8sQ0FBQyxLQUFLLENBQUUsSUFBSSxFQUFFLFdBQVksQ0FBQztnQkFDbkM7Z0JBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsSUFBSSxDQUFDLFNBQVUsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7Z0JBRXJDO2NBRUQ7Y0FFQSxDQUFDLENBQUUsbUNBQW9DLENBQUMsQ0FBQyxRQUFRLENBQUUsZUFBZ0IsQ0FBQztjQUVwRSxJQUFLLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUc7Z0JBQzNDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLFFBQVMsQ0FBRSxDQUFDO2NBQ2hFO2NBQ0EsSUFBSyxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFHO2dCQUMzQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxRQUFTLENBQUUsQ0FBQztjQUNoRTtjQUNBLElBQUssT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRztnQkFDdkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFFLElBQUksQ0FBQyxJQUFLLENBQUM7Y0FDdEM7WUFDRDtVQUNELENBQ0QsQ0FBQztRQUNGLENBQUMsRUFDRCxHQUNELENBQUM7TUFDRixDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtNQUNDLGlCQUFpQixFQUFFLFNBQUEsa0JBQVUsU0FBUyxFQUFFO1FBQ3ZDLENBQUMsQ0FBQyxJQUFJLENBQ0wsU0FBUyxFQUNULFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtVQUNmLElBQUksWUFBWSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxvQkFBcUIsQ0FBQyxDQUFDLE1BQU0sQ0FDekUsVUFBQyxHQUFHLEVBQUs7Y0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLEtBQUssWUFBWTtZQUFDLENBQ3pFLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBSSxDQUFDO1lBQ1osU0FBUyxHQUFNLENBQUMsQ0FBRSxZQUFhLENBQUM7VUFDakM7VUFDQSxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUUsQ0FBRSxDQUFDLENBQUMsTUFBTSxDQUFFLFlBQWEsQ0FBQztVQUUvQyxJQUFLLENBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUMxQixXQUFXLEdBQUcsQ0FBQyxDQUFFLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUM7VUFDMUM7VUFFQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUMzQyxTQUFTLENBQUMsV0FBVyxDQUFFLFdBQVksQ0FBQztVQUNyQztRQUNELENBQ0QsQ0FBQztNQUNGLENBQUM7TUFFRDs7TUFFQSxnQkFBZ0IsRUFBRSxTQUFBLGlCQUFVLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7UUFDbkYsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUVDLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUTtVQUN4QixJQUFJLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7WUFDM0MsS0FBSyxFQUFFLEtBQUs7WUFDWixPQUFPLEVBQUUsVUFBVTtZQUNuQixVQUFVLEVBQUUsUUFBUSxDQUFFLFVBQVcsQ0FBQztZQUNsQyxXQUFXLEVBQUUsUUFBUSxDQUFFLFdBQVksQ0FBQztZQUNwQyxXQUFXLEVBQUUsUUFBUSxDQUFFLFdBQVksQ0FBQztZQUNwQyxTQUFTLEVBQUU7VUFDWixDQUFDO1VBQ0QsTUFBTSxFQUFFLE1BQU07VUFDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtVQUNELENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFDckI7VUFBQTtRQUVGLENBQ0QsQ0FBQztNQUNGLENBQUM7TUFFRCxxQkFBcUIsRUFBRSxTQUFBLHNCQUFXLGFBQWEsRUFBRyxJQUFJLEVBQUc7UUFDeEQsSUFBSSxJQUFJLEdBQUc7VUFDVixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEI7VUFDdkQsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsMkJBQTJCO1VBQ3hELE9BQU8sRUFBRSxVQUFVO1VBQ25CLHFCQUFxQixFQUFFLGFBQWE7VUFDcEMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLG9CQUFvQjtVQUNyRCxxQkFBcUIsRUFBRSxVQUFVLENBQUM7VUFDbEM7UUFDRCxDQUFDO1FBRUQsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRztVQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztVQUNqRDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsdUJBQXVCO1VBQ3ZDLElBQUksRUFBRSxJQUFJO1VBQ1YsSUFBSSxFQUFFLE1BQU07VUFDWjtVQUNBLEtBQUssRUFBRSxLQUFLO1VBQ1osVUFBVSxFQUFFLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNwQyxJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUNBLElBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUc7Y0FFMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLElBQUssQ0FBQztZQUMzQjtVQUVELENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBUyxRQUFRLENBQUEsRUFBRztZQUM3QixJQUFLLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFHO2NBRTFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxJQUFLLENBQUM7WUFDN0I7VUFFRCxDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLGVBQWUsR0FBSSxRQUFRLENBQUMsTUFBTTtjQUNyQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsT0FBTztjQUNuQyxVQUFVLEdBQVMsSUFBSTtZQUV4QixJQUFLLE1BQU0sS0FBSyxlQUFlLEVBQUc7Y0FDakMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7Y0FDM0I7QUFDTjtBQUNBOztjQUVNLElBQUksVUFBVSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsc0JBQXVCLENBQUMsRUFBRTtnQkFDNUUsTUFBTSxDQUFDLE9BQU8sQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHNCQUF1QixDQUFDO2NBQzNEO2NBQ0EsSUFBSSxvQkFBb0IsR0FBRyxVQUFVLENBQUMsb0JBQW9CLEdBQUssVUFBVSxDQUFDLFdBQVcsR0FBRyxPQUFPLEdBQUcsVUFBVSxHQUFLLGdCQUFnQjtjQUNqSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBRSxRQUFRLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLENBQUMscUJBQXNCLENBQUM7Y0FFcEosSUFBSyxRQUFRLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRztnQkFDckMsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsS0FBTSxDQUFDO2NBQ2hFO2NBQ0EsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsZ0JBQWlCLENBQUM7WUFDL0M7WUFFQSxJQUFJLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRTtjQUNsRixNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO1lBQ2pDO1VBRUQ7UUFDRCxDQUNELENBQUM7TUFDRixDQUFDO01BRUQsc0JBQXNCLEVBQUUsU0FBQSx1QkFBVyxJQUFJLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRztRQUNuRSxJQUFLLENBQUUsVUFBVSxJQUFJLENBQUUsWUFBWSxFQUFHO1VBQ3JDO1FBQ0Q7UUFDQSxJQUFJLFlBQVksR0FBRyxXQUFXO1FBQzlCLElBQUssQ0FBRSxJQUFJLEVBQUc7VUFDYixZQUFZLEdBQUcsVUFBVTtVQUN6QixZQUFZLEdBQUcsVUFBVTtRQUMxQjtRQUNBLElBQUksT0FBTyxHQUFRLENBQUMsQ0FBRSxrREFBa0QsR0FBRyxVQUFVLEdBQUcsSUFBSyxDQUFDO1VBQzdGLFlBQVksR0FBRyxDQUFDLENBQUUsb0RBQW9ELEdBQUcsVUFBVSxHQUFHLElBQUssQ0FBQztRQUU3RixZQUFZLENBQUMsSUFBSSxDQUNoQixZQUFZO1VBQ1gsSUFBSSxDQUFDLEdBQVcsQ0FBQyxDQUFFLElBQUssQ0FBQztZQUN4QixTQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQztVQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF3QixFQUFFLFVBQVcsQ0FBQztVQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFlBQWEsQ0FBQztVQUN6QyxTQUFTLENBQ1AsV0FBVyxDQUNYLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtZQUNyQixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUUsOEJBQStCLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBSSxDQUFDO1VBQ25FLENBQ0QsQ0FBQyxDQUNBLFFBQVEsQ0FBRSwwQkFBMEIsR0FBRyxZQUFhLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO1VBRS9FLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBRSwyQkFBMkIsR0FBRyxZQUFhLENBQUM7VUFFbkUsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMvQixhQUFhLEdBQUcsQ0FBQyxDQUFFLDJCQUEyQixHQUFHLFVBQVcsQ0FBQztVQUM5RDtVQUNBLElBQUssSUFBSSxLQUFLLElBQUksRUFBRztZQUNwQixJQUFJLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFDLHFCQUFzQixDQUFDLEVBQUc7Y0FDdEYsYUFBYSxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7WUFDakMsQ0FBQyxNQUFNO2NBQ04sYUFBYSxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RDO1VBQ0QsQ0FBQyxNQUFNO1lBQ04sSUFBSSxZQUFZLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQztZQUM3RCxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxZQUFhLENBQUMsRUFBRztjQUN4QyxhQUFhLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztZQUNwQyxDQUFDLE1BQU07Y0FDTixhQUFhLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQztZQUNqQztVQUNEO1VBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTCxtQkFBbUIsRUFDbkIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2YsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxLQUFLLFlBQVksRUFBRTtjQUM5RSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUUsMkJBQTJCLEdBQUcsQ0FBQyxDQUFDLFVBQVcsQ0FBQztjQUNuRSxhQUFhLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztjQUNyQyxhQUFhLENBQUMsSUFBSSxDQUNqQixZQUFZO2dCQUNYLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQyxhQUFjLENBQUMsRUFBRztrQkFDM0MsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUM7Z0JBQy9CO2NBQ0QsQ0FDRCxDQUFDO1lBQ0Y7VUFFRCxDQUNELENBQUM7VUFDRCxhQUFhLENBQUMsSUFBSSxDQUFFLHVCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF3QixFQUFFLFVBQVcsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsRUFBRSxZQUFhLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW1CLEVBQUUsWUFBYSxDQUFDO1FBQzdLLENBQ0QsQ0FBQztRQUVELE9BQU8sQ0FBQyxJQUFJLENBQ1gsWUFBWTtVQUNYLElBQUksQ0FBQyxHQUFzQixDQUFDLENBQUUsSUFBSyxDQUFDO1lBQ25DLFNBQVMsR0FBYyxDQUFDLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDO1lBQzVELEtBQUssR0FBa0IsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVcsQ0FBRSxDQUFDO1lBQzFGLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxrQ0FBbUMsQ0FBQyxHQUFHLEtBQUs7WUFDOUYsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLGlDQUFrQyxDQUFDLEdBQUcsS0FBSztZQUM3RixpQkFBaUIsR0FBTSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsOEJBQStCLENBQUMsR0FBRyxLQUFLO1lBQzFGLGVBQWUsR0FBUSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsNEJBQTZCLENBQUMsR0FBRyxLQUFLO1lBQ3hGLGlCQUFpQixHQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUM7VUFFM0QsU0FBUyxDQUFDLFdBQVcsQ0FBRSxjQUFlLENBQUM7VUFDdkMsSUFBSyxJQUFJLEVBQUc7WUFDWCxJQUFLLElBQUksQ0FBQyxXQUFXLEVBQUc7Y0FDdkIsSUFBSyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUNuQyxJQUFLLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFDLGdCQUFpQixDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFDLGlCQUFrQixDQUFDLEVBQUc7a0JBQzNILGlCQUFpQixDQUFDLE9BQU8sQ0FBRSxZQUFhLENBQUMsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDO2dCQUNoRSxDQUFDLE1BQU07a0JBQ04saUJBQWlCLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7Z0JBQzdEO2NBQ0Q7Y0FDQSxJQUFLLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQ3RDLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxvQkFBcUIsQ0FBQyxFQUFHO2tCQUNyRCxvQkFBb0IsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQztnQkFDaEUsQ0FBQyxNQUFNO2tCQUNOLG9CQUFvQixDQUFDLE9BQU8sQ0FBRSxZQUFhLENBQUMsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDO2dCQUNuRTtjQUNEO2NBQ0EsSUFBSyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUN0QyxJQUFLLElBQUksQ0FBQyx3QkFBd0IsRUFBRztrQkFDcEMsb0JBQW9CLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7Z0JBQ2hFLENBQUMsTUFBTTtrQkFDTixvQkFBb0IsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztnQkFDbkU7Y0FFRDtjQUNBLElBQUssZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQ2pDLElBQUssSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMscUJBQXFCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxlQUFnQixDQUFDLEVBQUc7a0JBQ3JHLGVBQWUsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQztnQkFDM0QsQ0FBQyxNQUFNO2tCQUNOLGVBQWUsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztnQkFDOUQ7Y0FDRDs7Y0FFQTtjQUNBLElBQUssQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFFLG1EQUFvRCxDQUFDLENBQUMsTUFBTSxFQUFHO2dCQUNqRixTQUFTLENBQUMsUUFBUSxDQUFFLGNBQWUsQ0FBQztjQUNyQztZQUNELENBQUMsTUFBTSxJQUFLLFFBQUEsQ0FBTyxpQkFBaUIsTUFBSyxRQUFRLElBQUksZUFBZSxJQUFJLGlCQUFpQixJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxxQkFBc0IsQ0FBQyxFQUFHO2NBQ2hKLElBQUssb0JBQW9CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBSTtnQkFDdkMsb0JBQW9CLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7Y0FDbkU7Y0FDQSxJQUFLLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQ3RDLG9CQUFvQixDQUFDLE9BQU8sQ0FBRSxZQUFhLENBQUMsQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO2NBQ2hFO2NBQ0EsSUFBSyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUNuQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQztjQUM3RDtjQUNBLElBQUssZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQ2pDLGVBQWUsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQztjQUMzRDtZQUNELENBQUMsTUFBTTtjQUNOLFNBQVMsQ0FBQyxRQUFRLENBQUUsY0FBZSxDQUFDLENBQUMsQ0FBQztZQUN2QztVQUNEO1VBQ0EsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBd0IsRUFBRSxVQUFXLENBQUM7VUFDOUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsRUFBRSxZQUFhLENBQUM7VUFDekMsS0FBSyxDQUFDLElBQUksQ0FBRSxrQ0FBbUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1VBQ3pFLEtBQUssQ0FBQyxJQUFJLENBQUUsaUNBQWtDLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztVQUN4RSxLQUFLLENBQUMsSUFBSSxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUM7VUFDbkUsS0FBSyxDQUFDLElBQUksQ0FBRSw4QkFBK0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1VBRXJFLFNBQVMsQ0FDUCxXQUFXLENBQ1gsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFO1lBQ3JCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxHQUFJLENBQUM7VUFDakUsQ0FDRCxDQUFDLENBQ0EsUUFBUSxDQUFFLHdCQUF3QixHQUFHLFlBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7VUFDN0UsQ0FBQyxDQUFDLElBQUksQ0FDTCxtQkFBbUIsRUFDbkIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2YsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLFlBQVksRUFBRTtjQUM3RSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsWUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQyxPQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLFNBQVUsQ0FBQyxJQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsYUFBYyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBRSxrQ0FBbUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFHLEVBQUc7Z0JBQzNOLFNBQVMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDO2NBQy9CO2NBQ0EsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLGFBQWMsQ0FBQyxFQUFHO2dCQUMzQyxLQUFLLENBQUMsSUFBSSxDQUFFLGtDQUFtQyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxJQUFLLENBQUM7Y0FDekU7Y0FDQSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsWUFBYSxDQUFDLEVBQUc7Z0JBQzFDLEtBQUssQ0FBQyxJQUFJLENBQUUsaUNBQWtDLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLElBQUssQ0FBQztjQUN4RTtjQUNBLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQyxPQUFRLENBQUMsRUFBRztnQkFDckMsS0FBSyxDQUFDLElBQUksQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsSUFBSyxDQUFDO2NBQ25FO2NBQ0EsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLFNBQVUsQ0FBQyxFQUFHO2dCQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFFLDhCQUErQixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxJQUFLLENBQUM7Y0FDckU7WUFDRDtVQUVELENBQ0QsQ0FBQztVQUVELEtBQUssQ0FBQyxJQUFJLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXdCLEVBQUUsVUFBVyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFlBQWEsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBbUIsRUFBRSxZQUFhLENBQUM7VUFDckssSUFBSyxVQUFVLEtBQUssWUFBWSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxVQUFVLENBQUMsbUNBQW9DLENBQUMsRUFBRztZQUN6RyxTQUFTLENBQUMsSUFBSSxDQUFFLHNCQUF1QixDQUFDLENBQUMsUUFBUSxDQUFFLGdCQUFpQixDQUFDO1VBQ3RFLENBQUMsTUFBTTtZQUNOLFNBQVMsQ0FBQyxJQUFJLENBQUUsc0JBQXVCLENBQUMsQ0FBQyxXQUFXLENBQUUsZ0JBQWlCLENBQUM7VUFDekU7UUFDRCxDQUNELENBQUM7TUFDRixDQUFDO01BRUQsY0FBYyxFQUFFLFNBQUEsZUFBVSxRQUFRLEVBQUU7UUFDbkMsSUFBSyxJQUFJLEtBQUssUUFBUSxFQUFHO1VBQ3hCLGVBQWUsR0FBSyxFQUFFO1VBQ3RCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBRSxxREFBc0QsQ0FBQztVQUM5RSxJQUFLLGFBQWEsQ0FBQyxNQUFNLElBQUksZUFBZSxDQUFDLE1BQU0sRUFBRztZQUNyRCxhQUFhLENBQUMsSUFBSSxDQUNqQixZQUFZO2NBQ1gsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxhQUFjLENBQUM7Y0FDMUMsSUFBSyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ1osZUFBZSxFQUNmLFVBQVcsSUFBSSxFQUFHO2dCQUNqQixPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSTtjQUFFLENBQ25DLENBQUMsQ0FBQyxNQUFNLEVBQUc7Z0JBQ1YsQ0FBQyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixHQUFHLElBQUksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztjQUN2RjtZQUNELENBQ0QsQ0FBQztVQUNGO1VBQ0EsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFFLHdDQUF5QyxDQUFDO1VBQy9ELElBQUssV0FBVyxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFHO1lBQ25ELFdBQVcsQ0FBQyxJQUFJLENBQ2YsWUFBWTtjQUNYLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsYUFBYyxDQUFDO2NBQzFDLElBQUssQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUNaLGVBQWUsRUFDZixVQUFXLElBQUksRUFBRztnQkFDakIsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUk7Y0FBRSxDQUNuQyxDQUFDLENBQUMsTUFBTSxFQUFHO2dCQUNWLENBQUMsQ0FBRSxzQkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Y0FDNUU7WUFDRCxDQUNELENBQUM7VUFDRjtVQUNBLENBQUMsQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7VUFFckQsQ0FBQyxDQUFDLElBQUksQ0FDTCxRQUFRLEVBQ1IsVUFBVyxFQUFFLEVBQUUsUUFBUSxFQUFHO1lBQ3pCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBRSx5QkFBeUIsR0FBRyxRQUFRLENBQUMsVUFBVyxDQUFDO1lBQ3hFLGFBQWEsQ0FBQyxJQUFJLENBQ2pCLFlBQVk7Y0FDWCxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsUUFBUSxDQUFFLFFBQVMsQ0FBQztjQUM5QixDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLG9CQUFxQixDQUFDLENBQUMsSUFBSSxDQUFFLGNBQWMsRUFBRSxRQUFRLENBQUMsT0FBUSxDQUFDO2NBQy9FLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLFdBQVksQ0FBQztZQUN4RixDQUNELENBQUM7WUFDRCxDQUFDLENBQUUsMkRBQTRELENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE1BQU8sQ0FBQztZQUN4RixDQUFDLENBQUUscUVBQXNFLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE1BQU8sQ0FBQztZQUVsRyxlQUFlLENBQUMsSUFBSSxDQUFFLFFBQVMsQ0FBQztVQUVqQyxDQUNELENBQUM7UUFDRjtNQUNELENBQUM7TUFFRCx1QkFBdUIsRUFBRSxTQUFBLHdCQUFVLFFBQVEsRUFBRTtRQUM1QyxJQUFLLElBQUksS0FBSyxRQUFRLEVBQUc7VUFDeEIsbUJBQW1CLEdBQUcsRUFBRTtVQUN4QixJQUFJLGFBQWEsR0FBSyxDQUFDLENBQUUscURBQXNELENBQUM7VUFDaEYsSUFBSyxhQUFhLENBQUMsTUFBTSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sRUFBRztZQUN6RCxhQUFhLENBQUMsSUFBSSxDQUNqQixZQUFZO2NBQ1gsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxhQUFjLENBQUM7Y0FDMUMsSUFBSyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ1osbUJBQW1CLEVBQ25CLFVBQVcsSUFBSSxFQUFHO2dCQUNqQixPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSTtjQUFFLENBQ25DLENBQUMsQ0FBQyxNQUFNLEVBQUc7Z0JBQ1YsQ0FBQyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixHQUFHLElBQUksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztjQUN2RjtZQUNELENBQ0QsQ0FBQztVQUNGO1VBQ0EsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFFLHlDQUEwQyxDQUFDO1VBQ2hFLElBQUssV0FBVyxDQUFDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUc7WUFDdkQsV0FBVyxDQUFDLElBQUksQ0FDZixZQUFZO2NBQ1gsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxhQUFjLENBQUM7Y0FDMUMsSUFBSyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ1osbUJBQW1CLEVBQ25CLFVBQVcsSUFBSSxFQUFHO2dCQUNqQixPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSTtjQUFFLENBQ25DLENBQUMsQ0FBQyxNQUFNLEVBQUc7Z0JBQ1YsQ0FBQyxDQUFFLHVCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixHQUFHLElBQUksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztjQUM3RTtZQUNELENBQ0QsQ0FBQztVQUNGO1VBQ0EsQ0FBQyxDQUFFLDBCQUEyQixDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztVQUN2RCxDQUFDLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO1VBQ3JELENBQUMsQ0FBQyxJQUFJLENBQ0wsUUFBUSxFQUNSLFVBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRztZQUN6QixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUUseUJBQXlCLEdBQUcsUUFBUSxDQUFDLFVBQVcsQ0FBQztZQUN4RSxhQUFhLENBQUMsSUFBSSxDQUNqQixZQUFZO2NBQ1gsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVcsQ0FBRSxDQUFDO2NBQ25ELElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxZQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLE9BQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsU0FBVSxDQUFDLElBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxhQUFjLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFFLGtDQUFtQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUcsRUFBRztnQkFDdlAsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUM7Y0FDL0I7Y0FDQSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsYUFBYyxDQUFDLEVBQUc7Z0JBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLElBQUssQ0FBQztjQUN6RSxDQUFDLE1BQU07Z0JBQ04sS0FBSyxDQUFDLElBQUksQ0FBRSxrQ0FBbUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO2NBQzFFO2NBRUEsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLFlBQWEsQ0FBQyxFQUFHO2dCQUNqRCxLQUFLLENBQUMsSUFBSSxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxJQUFLLENBQUM7Y0FDeEUsQ0FBQyxNQUFNO2dCQUNOLEtBQUssQ0FBQyxJQUFJLENBQUUsaUNBQWtDLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztjQUN6RTtjQUVBLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxPQUFRLENBQUMsRUFBRztnQkFDNUMsS0FBSyxDQUFDLElBQUksQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsSUFBSyxDQUFDO2NBQ25FLENBQUMsTUFBTTtnQkFDTixLQUFLLENBQUMsSUFBSSxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUM7Y0FDcEU7Y0FFQSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsU0FBVSxDQUFDLEVBQUc7Z0JBQzlDLEtBQUssQ0FBQyxJQUFJLENBQUUsOEJBQStCLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLElBQUssQ0FBQztjQUNyRSxDQUFDLE1BQU07Z0JBQ04sS0FBSyxDQUFDLElBQUksQ0FBRSw4QkFBK0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO2NBQ3RFO1lBQ0QsQ0FDRCxDQUFDO1lBQ0QsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFFLDJCQUEyQixHQUFHLFFBQVEsQ0FBQyxVQUFXLENBQUM7WUFDMUUsYUFBYSxDQUFDLElBQUksQ0FDakIsWUFBWTtjQUNYLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxhQUFjLENBQUMsRUFBRztnQkFDbEQsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUM7Y0FDL0I7WUFDRCxDQUNELENBQUM7WUFDRCxDQUFDLENBQUUsMkRBQTRELENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE1BQU8sQ0FBQztZQUN4RixDQUFDLENBQUUscUVBQXNFLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE1BQU8sQ0FBQztZQUVsRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUUsUUFBUyxDQUFDO1VBRXJDLENBQ0QsQ0FBQztRQUNGO01BQ0QsQ0FBQztNQUNEO01BQ0EsaUJBQWlCLEVBQUUsU0FBQSxrQkFBWSxRQUFRLEVBQUc7UUFDekMsSUFBSyx1QkFBdUIsRUFBRztVQUM5QixZQUFZLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLFFBQVMsQ0FBQztVQUNuRCxjQUFjLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFHLFFBQVMsQ0FBQztRQUN2RDtRQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLFFBQVMsQ0FBRSxDQUFDO01BQ3BELENBQUM7TUFFRDtNQUNBLGlCQUFpQixFQUFFLFNBQUEsa0JBQVksUUFBUSxFQUFHO1FBQ3pDLElBQUssdUJBQXVCLEVBQUc7VUFDOUIsWUFBWSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxRQUFTLENBQUM7VUFDbkQsY0FBYyxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRyxRQUFTLENBQUM7UUFFdkQ7UUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLFFBQVMsQ0FBRSxDQUFDO01BQzdELENBQUM7TUFFRCxhQUFhLEVBQUUsU0FBQSxjQUFZLElBQUksRUFBRztRQUNqQyxJQUFLLHVCQUF1QixFQUFHO1VBQzlCLFlBQVksQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLElBQUssQ0FBQztVQUMzQyxjQUFjLENBQUMsT0FBTyxDQUFFLGFBQWEsRUFBRyxJQUFLLENBQUM7UUFDL0M7TUFDRCxDQUFDO01BRUQsYUFBYSxFQUFFLFNBQUEsY0FBVSxLQUFLLEVBQUU7UUFDL0IsSUFBSSxFQUFFLEdBQ0wsd0pBQXdKO1FBQ3pKLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUUsS0FBTSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUUsQ0FBQztNQUNoRCxDQUFDO01BRUQ7QUFDRDtBQUNBO01BQ0MsTUFBTSxFQUFFLFNBQUEsT0FBVSxLQUFLLEVBQUU7UUFDeEIsT0FBTyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLE1BQU0sS0FBSyxLQUFLO01BQzdGLENBQUM7TUFFRDtBQUNEO0FBQ0E7TUFDQyxJQUFJLEVBQUUsU0FBQSxLQUFBLEVBQVk7UUFDakIsT0FBTyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBRSxjQUFlLENBQUM7TUFDbkQsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNDLE9BQU8sRUFBRSxTQUFBLFFBQVcsSUFBSSxFQUFHO1FBQzFCLElBQUssSUFBSSxDQUFDLElBQUksQ0FBRSxHQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1VBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUUsNEJBQTZCLENBQUM7UUFDOUMsQ0FBQyxNQUFNO1VBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBRSxnQ0FBaUMsQ0FBQztRQUNsRDtNQUNELENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDQyxTQUFTLEVBQUUsU0FBQSxVQUFXLElBQUksRUFBRztRQUM1QixJQUFJLENBQUMsV0FBVyxDQUFFLGlDQUFrQyxDQUFDO01BQ3RELENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDQyxLQUFLLEVBQUUsU0FBQSxNQUFVLElBQUksRUFBRTtRQUN0QixJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssV0FBVyxJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRTtVQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFFLEtBQUssRUFBRSxLQUFNLENBQUMsQ0FBQyxLQUFLLENBQ2hDO1lBQ0MsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUU7Y0FDWCxVQUFVLEVBQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGVBQWUsR0FBRyxvQkFBb0I7Y0FDdEYsY0FBYyxFQUFFLFdBQVc7Y0FDM0IsT0FBTyxFQUFFO1lBQ1Y7VUFDRCxDQUNELENBQUM7UUFDRjtNQUNELENBQUM7TUFFRCxXQUFXLEVBQUUsU0FBQSxZQUFBLEVBQVk7UUFDeEIsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRztVQUN2QyxDQUFDLENBQUUsb0VBQXFFLENBQUMsQ0FBQyxNQUFNLENBQUUsS0FBSyxFQUFFLEtBQU0sQ0FBQyxDQUFDLEtBQUssQ0FDckc7WUFDQyxPQUFPLEVBQUUsSUFBSTtZQUNiLFVBQVUsRUFBRTtjQUNYLFVBQVUsRUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsZUFBZSxHQUFHLG9CQUFvQjtjQUN0RixjQUFjLEVBQUUsV0FBVztjQUMzQixPQUFPLEVBQUU7WUFDVjtVQUNELENBQ0QsQ0FBQztRQUNGO01BQ0QsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNDLE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO1FBQ3hCLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxXQUFXLEVBQUU7VUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUMsQ0FBQyxHQUFHLENBQUUsU0FBUyxFQUFFLEdBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1VBQ2pELENBQUMsQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFFLGlCQUFrQixDQUFDO1FBQ3RFO01BQ0QsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7TUFDQyxpQkFBaUIsRUFBRSxTQUFBLGtCQUFBLEVBQVk7UUFDOUIsSUFBSSxTQUFTLENBQUMsYUFBYSxFQUFFO1VBQzVCLE9BQU8sSUFBSTtRQUNaOztRQUVBO1FBQ0EsUUFBUSxDQUFDLE1BQU0sR0FBRyxjQUFjO1FBQ2hDLElBQUksR0FBRyxHQUFXLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFFLGFBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7UUFFakU7UUFDQSxRQUFRLENBQUMsTUFBTSxHQUFHLHFEQUFxRDtRQUV2RSxPQUFPLEdBQUc7TUFDWCxDQUFDO01BRUQsU0FBUyxFQUFFLFNBQUEsVUFBVSxXQUFXLEVBQUUsS0FBSyxFQUFFO1FBQ3hDLElBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBSSxHQUFHLEdBQUcsRUFBSSxDQUFDO1FBQy9DLFFBQVEsQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUUsS0FBTSxDQUFDLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLFVBQVU7TUFDekcsQ0FBQztNQUVELGtCQUFrQixFQUFFLFNBQUEsbUJBQVUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDbkQsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFO1FBQ3pCLElBQUksU0FBUyxHQUFVLEdBQUcsQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDO1FBQ3ZDLElBQUksT0FBTyxHQUFZLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxhQUFhLEdBQU0sU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBZSxFQUFFO1FBQ3pCLElBQUksYUFBYSxFQUFFO1VBQ2xCLFNBQVMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFFLEdBQUksQ0FBQztVQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFO2NBQzNDLGdCQUFnQixJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO2NBQ3ZDLElBQUksR0FBZ0IsR0FBRztZQUN4QjtVQUNEO1FBQ0Q7UUFFQSxJQUFJLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBRSxHQUFHLEVBQUUsRUFBRyxDQUFDO1FBQ3BFLE9BQU8sT0FBTyxHQUFHLEdBQUcsR0FBRyxnQkFBZ0IsR0FBRyxRQUFRO01BQ25ELENBQUM7TUFFRCxlQUFlLEVBQUUsU0FBQSxnQkFBVSxHQUFHLEVBQUUsTUFBTSxFQUFFO1FBQ3ZDLElBQUksUUFBUSxHQUFRLGtCQUFrQixDQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFFLENBQUM7VUFDM0QsYUFBYSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUUsUUFBUyxDQUFDO1VBQzFDLGNBQWM7VUFDZCxDQUFDO1FBRUYsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1VBQzFDLGNBQWMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFFLEdBQUksQ0FBQztVQUU5QyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDakMsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDO1VBQ2xFO1FBQ0Q7TUFDRDtJQUNELENBQUM7SUFDRDtJQUdBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7TUFDaEIsWUFBWSxFQUFFLElBQUk7TUFDbEIsVUFBVSxFQUFFLE9BQU87TUFDbkIsV0FBVyxFQUFFLGlCQUFpQjtNQUM5QixLQUFLLEVBQUUsS0FBSztNQUNaLFdBQVcsRUFBRSxLQUFLO01BQ2xCLFVBQVUsRUFBRSxRQUFRO01BQ3BCLFlBQVksRUFBRSxHQUFHO01BQ2pCLFVBQVUsRUFBRSxPQUFPO01BQ25CLE9BQU8sRUFBRSxTQUFTO01BQ2xCLFVBQVUsRUFBRSxTQUFTO01BQ3JCLFlBQVksRUFBRSxJQUFJO01BQ2xCLFVBQVUsRUFBRSxPQUFPO01BQ25CLFFBQVEsRUFBRSxTQUFTO01BQ25CLFdBQVcsRUFBRSxLQUFLO01BQ2xCLGFBQWEsRUFBRSxLQUFLO01BQ3BCLFdBQVcsRUFBRSxLQUFLO01BQ2xCLFlBQVksRUFBRSxJQUFJO01BQ2xCLGVBQWUsRUFBRSxLQUFLO01BQ3RCLFdBQVcsRUFBRTtRQUNaLEtBQUssRUFBRSxhQUFhO1FBQ3BCLElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLE9BQU8sRUFBRTtNQUNWLENBQUM7TUFDRCxTQUFTLEVBQUUsWUFBWTtNQUN2QixhQUFhLEVBQUUsVUFBVSxDQUFDLGNBQWMsS0FBSyxTQUFTLEdBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsR0FBRyxnQkFBZ0IsR0FBSSxVQUFVLENBQUMsY0FBYztNQUMvSSxPQUFPLEVBQUUsSUFBSTtNQUNiLFVBQVUsRUFBRSxhQUFhO01BQ3pCLFlBQVksRUFBRSxlQUFlO01BQzdCLFVBQVUsRUFBRSxLQUFLO01BQ2pCLE1BQU0sRUFBRSxNQUFNO01BQ2QsV0FBVyxFQUFFLElBQUk7TUFDakIsaUJBQWlCLEVBQUUsS0FBSztNQUN4QixXQUFXLEVBQUUsSUFBSTtNQUNqQixhQUFhLEVBQUUsZ0JBQWdCO01BQy9CLEdBQUcsRUFBRyxVQUFVLENBQUMsTUFBTSxHQUFJLElBQUksR0FBRztJQUNuQyxDQUFDO0lBSUQsSUFBSyxVQUFVLENBQUMseUJBQXlCLElBQUksVUFBVSxDQUFDLHNDQUFzQyxFQUFHO01BRWhHLENBQUMsQ0FBRSxpREFBa0QsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxPQUFRLENBQUMsQ0FBQyxNQUFNLENBQUUsT0FBUSxDQUFDLENBQUMsSUFBSSxDQUFFLFFBQVEsRUFBRSxJQUFLLENBQUM7TUFDOUcsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FDYixPQUFPLEVBQ1AscUNBQXFDLEVBQ3JDLFVBQVMsRUFBRSxFQUFFO1FBQ1osRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUM7UUFFakIsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsTUFBTyxDQUFDO1FBRWxDLElBQUksSUFBSSxHQUFhLENBQUMsQ0FBRSw4QkFBK0IsQ0FBQztRQUN4RCxJQUFJLGNBQWMsR0FBRztVQUNwQixRQUFRLEVBQUUsS0FBSztVQUNmLEtBQUssRUFBRSxNQUFNO1VBQ2IsVUFBVSxFQUFFLFVBQVU7VUFDdEIsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDO1VBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFVBQVc7UUFDakMsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLENBQUUsY0FBZSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO1FBQ3BCLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztJQUNGO0lBQ0E7SUFFRSxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLFlBQVksRUFDWixZQUFZO01BRVgsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztNQUU5QyxJQUFJLENBQUMsR0FBeUIsQ0FBQyxDQUFFLElBQUssQ0FBQztRQUN0QyxDQUFDLEdBQXlCLENBQUMsQ0FBRSxNQUFPLENBQUM7UUFDckMsdUJBQXVCLEdBQUksT0FBUSxxQkFBc0IsS0FBSyxXQUFXLElBQUkscUJBQXFCLEtBQUssSUFBSSxHQUFJLHFCQUFxQixDQUFDLHVCQUF1QixHQUFHLEVBQUU7TUFFdEssQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsK0NBQStDLEVBQy9DLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxJQUFJLEdBQUksQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztRQUNwRixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDakUsSUFBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7VUFDL0UsZUFBZSxDQUFDLElBQUksQ0FBRSxVQUFVLEVBQUMsSUFBSyxDQUFDO1FBQ3hDO01BQ0QsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxRQUFRLEVBQ1Isc0NBQXNDLEVBQ3RDLFlBQVk7UUFDWCxJQUFJLENBQUMsR0FBWSxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ3pCLFVBQVUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFFLG1EQUFvRCxDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUUsdUNBQXdDLENBQUM7UUFDdEosSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFFLFVBQVcsQ0FBQyxFQUFFO1VBQ3ZCLFVBQVUsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLFNBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxRQUFTLENBQUM7VUFDM0QsQ0FBQyxDQUFFLG1CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxTQUFVLENBQUM7VUFDckQsQ0FBQyxDQUFFLG9CQUFxQixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxTQUFVLENBQUM7UUFDdkQsQ0FBQyxNQUFNO1VBQ04sVUFBVSxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDLENBQUMsT0FBTyxDQUFFLFFBQVMsQ0FBQztVQUN2RCxDQUFDLENBQUUsbUJBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztVQUNqRCxDQUFDLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztRQUNuRDtNQUNELENBQ0QsQ0FBQztNQUdELENBQUMsQ0FBQyxFQUFFLENBQ0gsUUFBUSxFQUNSLG1CQUFtQixFQUNuQixZQUFZO1FBQ1gsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxpQkFBaUIsRUFDakIsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFO1FBQ3hCLElBQUksQ0FBQyxHQUF1QixDQUFDLENBQUUsRUFBRSxDQUFDLE1BQU8sQ0FBQztVQUN6QyxVQUFVLEdBQWMsQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUM7VUFDOUMsY0FBYyxHQUFVLFNBQVM7UUFDbEMsY0FBYyxDQUFDLFVBQVUsR0FBRyxVQUFVO1FBQ3RDLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxPQUFPLENBQUUsc0JBQXNCLEVBQUUsY0FBZSxDQUFDO01BQ2hFLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBZSxDQUFDO01BRTNELENBQUMsQ0FBQyxFQUFFLENBQ0gsd0JBQXdCLEVBQ3hCLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO1FBQzFDLElBQUssQ0FBRSxTQUFTLEVBQUU7VUFDakI7UUFDRDtRQUVBLENBQUMsQ0FBRSxrQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFFLFFBQVMsQ0FBQztNQUNoRixDQUNELENBQUM7O01BRUQ7TUFDQSxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxtQ0FBbUMsRUFDbkMsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUM7UUFDekMsQ0FBQyxDQUFFLG9CQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLFdBQVcsQ0FBRSwyQ0FBNEMsQ0FBQztRQUNyRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHFCQUFzQixDQUFDLENBQUMsUUFBUSxDQUFFLGFBQWEsR0FBRyxPQUFRLENBQUM7UUFDOUUsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDLENBQUMsV0FBVyxDQUFFLGdCQUFpQixDQUFDO1FBQ2xHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsZ0JBQWlCLENBQUM7UUFDdEMsQ0FBQyxDQUFFLGlCQUFpQixHQUFHLE9BQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQVEsQ0FBRSxDQUFDO1FBQzVHLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQzs7TUFFRDtNQUNBLENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLGlCQUFpQixFQUNqQixVQUFTLEVBQUUsRUFBRTtRQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBVSxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQzFCLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLFFBQVMsQ0FBQztVQUNuQyxHQUFHLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBRSxLQUFNLENBQUM7UUFDakMsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUTtVQUN4QixJQUFJLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ3RDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztZQUMzQixPQUFPLEVBQUUsVUFBVTtZQUNuQixhQUFhLEVBQUcsV0FBVztZQUMzQixLQUFLLEVBQUc7VUFDVCxDQUFDO1VBQ0QsTUFBTSxFQUFFLE1BQU07VUFDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDM0IsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsSUFBSyxDQUFDO1VBQzdCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtZQUN4QixJQUFLLENBQUUsSUFBSSxFQUFHO2NBQ2I7WUFDRDtZQUNBLENBQUMsQ0FBRSwrREFBK0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1VBQzdFO1FBRUQsQ0FDRCxDQUFDO1FBQ0QsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BQ0Q7TUFFQSxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx3R0FBd0csRUFDeEcsVUFBVSxFQUFFLEVBQUU7UUFDYixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLE1BQU8sQ0FBQztRQUNuQyxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7VUFDMUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBRSxvQkFBcUIsQ0FBRSxDQUFDO1VBQzdDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixDQUFDLENBQUMsSUFBSSxDQUNMO1lBQ0MsR0FBRyxFQUFFLElBQUk7WUFDVCxJQUFJLEVBQUUsS0FBSztZQUNYLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO2NBQ3hCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUM7Z0JBQ3hCLE9BQU8sR0FBSyxTQUFTLENBQUMsSUFBSSxDQUFFLHFCQUFzQixDQUFDO2dCQUNuRCxRQUFRLEdBQUksU0FBUyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQztjQUNuRCxJQUFJLFFBQVEsRUFBRTtnQkFDYixDQUFDLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO2NBQ2xEO2NBQ0EsSUFBSSxPQUFPLEVBQUU7Z0JBQ1osQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsV0FBVyxDQUFFLE9BQVEsQ0FBQztjQUNsRDtjQUNBLElBQUksSUFBSSxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBRTtrQkFBQyxJQUFJLEVBQUU7Z0JBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFLLENBQUM7Y0FDbkQ7WUFDRDtVQUNELENBQ0QsQ0FBQztVQUNELE9BQU8sS0FBSztRQUNiO01BQ0QsQ0FDRCxDQUFDO01BQ0Q7TUFDSTs7TUFFSixDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx3QkFBd0IsRUFDeEIsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsSUFBSyxjQUFjLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFFLGVBQWUsQ0FBQyxNQUFNLEVBQUc7VUFDbkYsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWUsQ0FBQztVQUNoRDtRQUNEO1FBRUEsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDaEMsVUFBVSxHQUFVLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUM7VUFDL0MsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztVQUN0RCxPQUFPLEdBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBRSx5QkFBeUIsR0FBRyxVQUFXLENBQUM7VUFDdkUsYUFBYSxHQUFPLElBQUk7VUFDeEIsSUFBSSxHQUFnQjtZQUNuQixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0I7WUFDakQsT0FBTyxFQUFFLFVBQVU7WUFDbkIsZUFBZSxFQUFFLFVBQVU7WUFDM0IsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CO1lBQzFDO1lBQ0E7VUFDRCxDQUFDO1FBQ0Y7UUFDQSxJQUFJLGFBQWEsS0FBSyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsY0FBYyxDQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBRSxDQUFDLEVBQUU7VUFDOUYsSUFBSSxHQUFHLGFBQWE7UUFDckI7UUFFQSxJQUFJLG9CQUFvQjtRQUV4QixJQUFLLENBQUMsQ0FBRSwwQ0FBMEMsR0FBRyxpQkFBaUIsR0FBRyxvREFBb0QsR0FBRyxpQkFBaUIsR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFbkssb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLDBDQUEwQyxHQUFHLGlCQUFpQixHQUFHLG9EQUFvRCxHQUFHLGlCQUFpQixHQUFHLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFckwsQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzREFBdUQsQ0FBQyxDQUFDLE1BQU0sRUFBRztVQUVoRyxvQkFBb0IsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHNEQUF1RCxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUUzRyxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUUsV0FBVyxHQUFHLGlCQUFpQixHQUFHLG1DQUFtQyxHQUFHLGlCQUFpQixHQUFHLCtCQUFnQyxDQUFDLENBQUMsTUFBTSxFQUFJO1VBRXRKLG9CQUFvQixHQUFHLENBQUMsQ0FBRSxXQUFXLEdBQUcsaUJBQWlCLEdBQUcsbUNBQW1DLEdBQUcsaUJBQWlCLEdBQUcsK0JBQWdDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRWhLLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBQywyREFBMkQsR0FBRyxpQkFBaUIsR0FBRyxvRUFBb0UsR0FBRyxpQkFBaUIsR0FBRyw2REFBNkQsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFN1IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLDJEQUEyRCxHQUFHLGlCQUFpQixHQUFHLG9FQUFvRSxHQUFHLGlCQUFpQixHQUFHLDZEQUE2RCxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQztVQUNyUixvQkFBb0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFdEQ7UUFFQSxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLElBQU0sT0FBTyxvQkFBb0IsS0FBSyxXQUFXLElBQUksb0JBQW9CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNyRjtBQUNIO1VBQ0csUUFBUSxHQUFHLElBQUksUUFBUSxDQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBRSxDQUFFLENBQUUsQ0FBQztVQUN4RDtBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO1VBQ0csUUFBUSxVQUFPLENBQUUsYUFBYyxDQUFDO1FBQ2pDLENBQUMsTUFBTTtVQUNOLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsR0FBRyxpQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQztVQUN0RyxJQUFLLGdCQUFnQixDQUFDLE1BQU0sRUFBRztZQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1VBQ3pEO1FBQ0Q7UUFFQSxDQUFDLENBQUMsSUFBSSxDQUNMLElBQUksRUFDSixVQUFTLEdBQUcsRUFBQyxRQUFRLEVBQUM7VUFDckIsUUFBUSxDQUFDLE1BQU0sQ0FBRSxHQUFHLEVBQUcsUUFBQSxDQUFPLFFBQVEsTUFBSyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxRQUFTLENBQUMsR0FBRyxRQUFTLENBQUM7UUFDOUYsQ0FDRCxDQUFDO1FBRUQsTUFBTSxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUM7UUFFN0QsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtVQUN0QyxjQUFjLEdBQUcsS0FBSztVQUN0QixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztVQUNqRDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUTtVQUN4QixJQUFJLEVBQUUsUUFBUTtVQUNkLElBQUksRUFBRSxNQUFNO1VBQ1o7VUFDQSxXQUFXLEVBQUUsS0FBSztVQUNsQixXQUFXLEVBQUUsS0FBSztVQUNsQixLQUFLLEVBQUUsS0FBSztVQUNaLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBQ0EsY0FBYyxHQUFHLElBQUk7WUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUV4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBQ3JCLGNBQWMsR0FBRyxLQUFLO1lBRXRCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBRTVCLElBQUksZUFBZSxHQUFJLFFBQVEsQ0FBQyxNQUFNO2NBQ3JDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPO2NBQ25DLFVBQVUsR0FBUyxJQUFJO1lBQ3hCLElBQUksZUFBZSxLQUFLLE1BQU0sSUFBSSxlQUFlLEtBQUssUUFBUSxFQUFFO2NBQy9ELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2NBRTNCLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDckIsSUFBSyxPQUFPLGVBQWUsS0FBSyxXQUFXLElBQUksZUFBZSxLQUFLLElBQUksRUFBRTtrQkFDeEUsZUFBZSxDQUFDLElBQUksQ0FDbkI7b0JBQ0MsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXO29CQUNqQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87b0JBQ3pCLFVBQVUsRUFBRSxRQUFRLENBQUUsVUFBVztrQkFDbEMsQ0FDRCxDQUFDO2tCQUNELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsZUFBZ0IsQ0FBRSxDQUFDO2dCQUNsRTtjQUNEO2NBRUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO2NBRTlDLElBQUksUUFBUSxFQUFFO2dCQUViLFVBQVUsR0FBVyxLQUFLO2dCQUMxQixJQUFJLElBQUksR0FBYSxDQUFDLENBQUUsR0FBRyxHQUFHLFFBQVMsQ0FBQztnQkFDeEMsSUFBSSxjQUFjLEdBQUc7a0JBQ3BCLFFBQVEsRUFBRSxLQUFLO2tCQUNmLEtBQUssRUFBRSxNQUFNO2tCQUNiLFVBQVUsRUFBRSxVQUFVO2tCQUN0QixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUM7a0JBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFVBQVc7Z0JBQ2pDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBRSxjQUFlLENBQUM7Z0JBQzVCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUNqQixHQUFHLENBQUM7a0JBQ0osS0FBSyxFQUFFLEdBQUc7a0JBQ1YsTUFBTSxFQUFFO2dCQUNULENBQUMsQ0FBQyxDQUNELFdBQVcsQ0FBQyxDQUFDLENBQ2IsUUFBUSxDQUFDLGlCQUFpQixDQUFDO2dCQUM3QixJQUFJLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztjQUNyQjtjQUVBLElBQUksVUFBVSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQW1CLENBQUMsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFFO2dCQUN0RyxNQUFNLENBQUMsT0FBTyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQW1CLENBQUM7Y0FDdkQ7Y0FFQSxJQUFLLGVBQWUsS0FBSyxNQUFNLEVBQUc7Z0JBQ2pDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxxQkFBc0IsQ0FBQztjQUNsSTtZQUNEO1lBRUEsSUFBSyxlQUFlLEtBQUssTUFBTSxJQUFJLFVBQVUsQ0FBQyxjQUFjLEtBQUssY0FBYyxFQUFHO2NBQ2pGLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxpQkFBaUI7WUFDcEQ7WUFFQSxJQUFLLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUNwRixNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO1lBQ2pDO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUVyQyxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsT0FBTyxDQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBRSxDQUFDO1VBRS9EO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asd0NBQXdDLEVBQ3hDLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLEdBQWEsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUMxQixPQUFPLEdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBRSxjQUFlLENBQUM7VUFDdEMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsa0JBQW1CLENBQUM7VUFDMUMsSUFBSSxHQUFVO1lBQ2IsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO1lBQzdDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztZQUN4QixPQUFPLEVBQUUsVUFBVTtZQUNuQixHQUFHLEVBQUUsT0FBTztZQUNaLEdBQUcsRUFBRTtVQUNOLENBQUM7UUFDRixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxPQUFRLENBQUM7UUFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxTQUFVLENBQUM7O1FBRXZCO1FBQ0EsSUFBSyxLQUFLLEtBQUssQ0FBQyxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxjQUFjLENBQUUseUNBQXlDLEVBQUUsQ0FBRSxDQUFDLENBQUcsQ0FBQyxFQUFHO1VBQ3RHLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHNDQUFzQyxFQUFFLENBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUcsQ0FBQztVQUN6RixPQUFPLElBQUk7UUFDWjtRQUNBLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLGdCQUFnQixFQUFFLENBQUUsQ0FBQyxFQUFFLElBQUksQ0FBRyxDQUFDO1FBRTNELENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFNBQVM7VUFDekIsSUFBSSxFQUFFLElBQUk7VUFDVixJQUFJLEVBQUUsTUFBTTtVQUNaLFFBQVEsRUFBRSxNQUFNO1VBQ2hCLE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBRTVCLElBQUssQ0FBRSxRQUFRLEVBQUc7Y0FDakI7WUFDRDtZQUVBLElBQUssUUFBUSxDQUFDLEtBQUssSUFBTSxRQUFRLENBQUMsT0FBTyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxPQUFRLENBQUcsRUFBRztjQUN4RixJQUFLLFFBQVEsQ0FBQyxXQUFXLEVBQUc7Z0JBQzNCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVc7Z0JBQ3RDO2NBQ0Q7Y0FDQSxJQUFLLEVBQUUsS0FBSyxVQUFVLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFHO2dCQUMxRCxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsMEJBQTJCLENBQUM7Y0FDN0Q7WUFDRCxDQUFDLE1BQU07Y0FDTjtjQUNBLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLHFCQUFxQixDQUFDLHVCQUF3QixDQUFDLEVBQUc7Z0JBQ3pFLE1BQU0sQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUMsUUFBUTtnQkFDaEQ7Y0FDRDtjQUNBLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO2NBQ2pEO2NBQ0EsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsZUFBZSxFQUFFLENBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBRyxDQUFDO2NBRTVGLElBQUssRUFBRSxLQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUc7Z0JBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxxQkFBc0IsQ0FBQztjQUMxRDtZQUVEO1lBRUEsSUFBSyxRQUFRLENBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSyxRQUFRLENBQUMsT0FBTyxFQUFHO2NBQ2xELENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHFCQUFxQixFQUFFLENBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUUsQ0FBQztZQUM1RTtVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsdUJBQXVCLEVBQ3ZCLFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFXLENBQUM7UUFDNUMsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsNEJBQTRCLEVBQzVCLFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyx3QkFBeUIsQ0FBQztRQUMxRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCw2Q0FBNkMsRUFDN0MsVUFBVSxFQUFFLEVBQUU7UUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixJQUFJLEtBQUssR0FBWSxDQUFDLENBQUMsT0FBTyxDQUFFLCtCQUFnQyxDQUFDO1VBQ2hFLEdBQUcsR0FBYyxDQUFDLENBQUMsT0FBTyxDQUFFLGVBQWdCLENBQUM7VUFDN0MsV0FBVyxHQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUUsUUFBUyxDQUFDO1VBQ3JDLFdBQVcsR0FBTSxLQUFLLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQztVQUNuQyxjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7VUFDdEMsSUFBSSxHQUFhO1lBQ2hCLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLDJCQUEyQjtZQUN0RCxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDeEIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsb0JBQW9CLEVBQUUsV0FBVztZQUNqQyxXQUFXLEVBQUUsV0FBVztZQUN4QixjQUFjLEVBQUU7WUFDaEI7VUFDRCxDQUFDO1FBRUYsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUTtVQUN4QixJQUFJLEVBQUUsSUFBSTtVQUNWLE1BQU0sRUFBRSxNQUFNO1VBQ2QsVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDO1VBRXhCLENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFDckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLEdBQUksQ0FBQztVQUMxQixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDM0I7QUFDTDtBQUNBOztZQUVLLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxNQUFPLENBQUMsRUFBRztjQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztjQUM1QixJQUFJLE9BQU8sZUFBZSxLQUFLLFdBQVcsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO2dCQUN2RSxJQUFJLGFBQWEsR0FBRyxlQUFlLENBQUMsTUFBTTtnQkFDMUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2tCQUN4QyxJQUFJLE9BQU8sZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFdBQVcsRUFBRTtvQkFDL0ksZUFBZSxDQUFDLE1BQU0sQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDO29CQUM5QixDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsT0FBTyxDQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRyxJQUFJLENBQUUsQ0FBQztvQkFDckU7a0JBQ0Q7Z0JBQ0Q7Z0JBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxlQUFnQixDQUFFLENBQUM7Y0FDbEU7Y0FDQSxJQUFJLE9BQU8sbUJBQW1CLEtBQUssV0FBVyxJQUFJLG1CQUFtQixLQUFLLElBQUksRUFBRTtnQkFDL0UsSUFBSSxjQUFhLEdBQUcsbUJBQW1CLENBQUMsTUFBTTtnQkFDOUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxjQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2tCQUN4QyxJQUFJLE9BQU8sbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFdBQVcsRUFBRTtvQkFDM0osbUJBQW1CLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUM7b0JBQ2xDLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxPQUFPLENBQUUsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFHLElBQUksQ0FBRSxDQUFDO29CQUNyRTtrQkFDRDtnQkFDRDtnQkFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLG1CQUFvQixDQUFFLENBQUM7Y0FDdEU7WUFDRDtZQUNBO1VBQ0Q7UUFDRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILGdCQUFnQixFQUNoQiwrR0FBK0csRUFDL0csVUFBVSxFQUFFLEVBQUU7UUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixJQUFJLEtBQUssR0FBWSxDQUFDLENBQUMsT0FBTyxDQUFFLCtCQUFnQyxDQUFDO1VBQ2hFLEdBQUcsR0FBYyxDQUFDLENBQUMsT0FBTyxDQUFFLGVBQWdCLENBQUM7VUFDN0MsV0FBVyxHQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUUsUUFBUyxDQUFDO1VBQ3JDLFlBQVksR0FBSyxHQUFHLENBQUMsSUFBSSxDQUFFLFNBQVUsQ0FBQztVQUN0QyxXQUFXLEdBQU0sR0FBRyxDQUFDLElBQUksQ0FBRSxhQUFjLENBQUM7VUFDMUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUM7VUFDN0MsVUFBVSxHQUFvQixDQUFDLENBQUMsNENBQTRDLENBQUM7VUFDN0UsSUFBSSxHQUFhO1lBQ2hCLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLDJCQUEyQjtZQUN0RCxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDeEIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsb0JBQW9CLEVBQUUsV0FBVztZQUNqQyxXQUFXLEVBQUUsV0FBVztZQUN4QixjQUFjLEVBQUUsY0FBYztZQUM5QixXQUFXLEVBQUUsVUFBVSxDQUFDO1lBQ3hCO1VBQ0QsQ0FBQztRQUVGLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7VUFDeEIsSUFBSSxFQUFFLElBQUk7VUFDVixNQUFNLEVBQUUsTUFBTTtVQUNkLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBQ3JCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO1lBRXhCLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxNQUFPLENBQUMsRUFBRztjQUN2QyxJQUFJLFNBQVMsR0FBRyxLQUFLO2NBQ3JCLElBQUksT0FBTyxlQUFlLEtBQUssV0FBVyxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZFLElBQUksYUFBYSxHQUFHLGVBQWUsQ0FBQyxNQUFNO2dCQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtrQkFDNUMsSUFBSSxPQUFPLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxXQUFXLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxXQUFXLEVBQUU7b0JBQ2pKLGVBQWUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQztvQkFDOUIsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBRSw2QkFBNkIsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFFLENBQUM7b0JBQ3BFO2tCQUNEO2dCQUNEO2dCQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsZUFBZ0IsQ0FBRSxDQUFDO2NBQ2xFO2NBRUEsSUFBSSxPQUFPLG1CQUFtQixLQUFLLFdBQVcsSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7Z0JBQy9FLElBQUksYUFBYSxHQUFHLG1CQUFtQixDQUFDLE1BQU07Z0JBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2tCQUM1QyxJQUFJLE9BQU8sbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxXQUFXLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxLQUFLLFdBQVcsRUFBRTtvQkFDN0osbUJBQW1CLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUM7b0JBQ2xDLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxPQUFPLENBQUUsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBRSxDQUFDO29CQUNwRTtrQkFDRDtnQkFDRDtnQkFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLG1CQUFvQixDQUFFLENBQUM7Y0FDdEU7Y0FFQSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsaUNBQWtDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUNoRSxDQUFDLENBQUUsaUNBQWtDLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEdBQUcsWUFBWSxHQUFHLElBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvRjtnQkFDQSxDQUFDLENBQUUsMkRBQTRELENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQU0sQ0FBQztnQkFDbkYsQ0FBQyxDQUFFLHFFQUFzRSxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxLQUFNLENBQUM7Z0JBRTdGLENBQUMsQ0FBRSwrQ0FBK0MsR0FBRyxXQUFZLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO2NBQzNGO2NBQ0EsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDaEUsQ0FBQyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixHQUFHLFlBQVksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0Y7Z0JBQ0EsQ0FBQyxDQUFFLDJEQUE0RCxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxLQUFNLENBQUM7Z0JBQ25GLENBQUMsQ0FBRSxxRUFBc0UsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsS0FBTSxDQUFDO2dCQUU3RixDQUFDLENBQUUsK0NBQStDLEdBQUcsV0FBWSxDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztjQUMzRjtjQUNBLElBQUssVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksUUFBUSxDQUFFLFdBQVksQ0FBQyxLQUFLLFFBQVEsQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFFLFNBQVUsQ0FBRSxDQUFDLEVBQUc7Z0JBQ3BHLFVBQVUsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEdBQUcsWUFBWSxHQUFHLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7Z0JBQ25GLFNBQVMsR0FBRyxJQUFJO2NBQ2pCO2NBQ0EsSUFBSyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQyxDQUFDLE1BQU0sRUFBSTtnQkFDaEUsU0FBUyxHQUFHLElBQUk7Y0FDakI7Y0FFQSxJQUFLLFNBQVMsRUFBRztnQkFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7Y0FDNUI7Y0FDQTtBQUNOO0FBQ0E7WUFFSztZQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7VUFDdEM7UUFDRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxvQkFBb0IsRUFDcEIsVUFBVSxFQUFFLEVBQUU7UUFDYixJQUFJLENBQUMsR0FBYSxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQzFCLFVBQVUsR0FBSSxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDO1VBQ3pDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLGtCQUFtQixDQUFDO1VBQzFDLE9BQU8sR0FBTyxDQUFDLENBQUMsSUFBSSxDQUFFLGNBQWUsQ0FBQztVQUN0QyxPQUFPLEdBQU8sQ0FBQyxDQUFFLHlCQUF5QixHQUFHLFVBQVcsQ0FBQztVQUN6RCxJQUFJLEdBQVU7WUFDYixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0I7WUFDN0MsT0FBTyxFQUFFLFVBQVU7WUFDbkIsV0FBVyxFQUFFLFdBQVc7WUFDeEIsT0FBTyxFQUFFO1lBQ1Q7VUFDRCxDQUFDO1FBQ0YsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7VUFDeEIsSUFBSSxFQUFFLElBQUk7VUFDVixNQUFNLEVBQUUsTUFBTTtVQUNkLFFBQVEsRUFBRSxNQUFNO1VBQ2hCLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBQzVCLElBQUksU0FBUyxHQUFVLFFBQVEsQ0FBQyxTQUFTO2NBQ3hDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPO1lBRXBDLElBQUksTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Y0FDL0IsT0FBTyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7Y0FDL0IsSUFBSyxPQUFPLGVBQWUsS0FBSyxXQUFXLElBQUksZUFBZSxLQUFLLElBQUksRUFBRTtnQkFFeEUsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQ3ZCLGVBQWUsRUFDZixVQUFVLENBQUMsRUFBRTtrQkFDWixPQUFPLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFFLE9BQVEsQ0FBQztnQkFDekMsQ0FDRCxDQUFDO2dCQUNELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsZUFBZ0IsQ0FBRSxDQUFDO2NBQ2xFO1lBQ0Q7WUFDQSxJQUFLLENBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzQkFBdUIsQ0FBQyxDQUFDLE1BQU0sSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQyxFQUFFO2NBQ3ZGLE1BQU0sQ0FBQyxLQUFLLENBQUUsZ0JBQWlCLENBQUM7WUFDakM7WUFDQSxJQUFJLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQXFCLENBQUMsRUFBRTtjQUMxRixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQXFCLENBQUM7WUFDdkQ7WUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMzQjtBQUNMO0FBQ0E7O1lBRUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUVyQyxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsT0FBTyxDQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUUsQ0FBQztVQUM3RTtRQUNELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsc0JBQXNCLEVBQ3RCLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRTtRQUNuQixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLEVBQUUsQ0FBQyxNQUFPLENBQUM7VUFDckMsVUFBVSxHQUFVLElBQUksQ0FBQyxVQUFVO1VBQ25DLFlBQVksR0FBUSxJQUFJLENBQUMsWUFBWTtVQUNyQyxPQUFPLEdBQWEsQ0FBQyxDQUFFLGtEQUFrRCxHQUFHLFVBQVUsR0FBRyxJQUFLLENBQUM7VUFDL0YsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBb0IsQ0FBQztRQUM1RixJQUFLLENBQUUsVUFBVSxJQUFJLENBQUUsWUFBWSxJQUFJLENBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRTtVQUN4RDtRQUNEO1FBQ0EsSUFBSyxDQUFFLGlCQUFpQixJQUFJLENBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRTtVQUMvQyxPQUFPLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQztRQUMvRCxDQUFDLE1BQU07VUFDTixPQUFPLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztRQUNsRTtRQUNBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQztRQUNqRixJQUFLLE9BQU8sRUFBRztVQUNkLElBQUksS0FBSyxHQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1VBQzlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixJQUFJLGFBQWEsR0FBSSxLQUFLLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7WUFDbEQsSUFBSSxJQUFJLEdBQWEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhO1lBQ3BELElBQUksS0FBSyxHQUFZLFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVztZQUNsRCxJQUFJLFVBQVUsR0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQztZQUMvQyxJQUFJLEdBQUcsR0FBYyxLQUFLLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDLENBQUMsSUFBSSxDQUFFLEtBQU0sQ0FBQztZQUMxRSxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLDZCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkUsSUFBSSxhQUFhLEdBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjO1lBRTlFLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLGFBQWMsQ0FBQztZQUN2RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsRUFBRSxhQUFjLENBQUM7WUFFdEQsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUUsYUFBYyxDQUFDO1lBQ3pELEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFFLGdCQUFnQixFQUFFLGFBQWMsQ0FBQztZQUV4RCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUUsY0FBZSxDQUFDLEVBQUU7Y0FDNUQsR0FBRyxHQUFHLE9BQU8sS0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUksV0FBVyxLQUFLLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUk7WUFDMUg7WUFFQSxLQUFLLENBQUMsSUFBSSxDQUFFLG9CQUFxQixDQUFDLENBQUMsSUFBSSxDQUFFLEtBQU0sQ0FBQztZQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQztZQUM5QyxLQUFLLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDLENBQUMsSUFBSSxDQUFFLEtBQUssRUFBRSxHQUFJLENBQUM7VUFFM0Q7UUFDRDtRQUVBLE9BQU8sQ0FBQyxJQUFJLENBQ1gsWUFBWTtVQUNYLElBQUksQ0FBQyxHQUFXLENBQUMsQ0FBRSxJQUFLLENBQUM7WUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUM7VUFFbEQsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBd0IsRUFBRSxVQUFXLENBQUM7VUFDOUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsRUFBRSxZQUFhLENBQUM7VUFFekMsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1lBRXJCLFNBQVMsQ0FDUCxXQUFXLENBQ1gsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFO2NBQ3JCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxHQUFJLENBQUM7WUFDakUsQ0FDRCxDQUFDLENBQ0EsUUFBUSxDQUFFLHdCQUF3QixHQUFHLFlBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7VUFDOUU7VUFDQSxTQUFTLENBQUMsSUFBSSxDQUFFLHdCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFFLGNBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxhQUFhLEVBQUUsWUFBYSxDQUFFLENBQUM7VUFDbEksU0FBUyxDQUFDLElBQUksQ0FBRSw2QkFBOEIsQ0FBQyxDQUFDLElBQUksQ0FBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBRSxpQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxhQUFhLEVBQUUsWUFBYSxDQUFFLENBQUM7VUFDMUksQ0FBQyxDQUFDLElBQUksQ0FDTCxlQUFlLEVBQ2YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2YsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLFlBQVksRUFBRTtjQUM3RSxTQUFTLENBQUMsUUFBUSxDQUFFLFFBQVMsQ0FBQztjQUM5QixTQUFTLENBQUMsSUFBSSxDQUFFLG9CQUFxQixDQUFDLENBQUMsSUFBSSxDQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxXQUFZLENBQUM7Y0FDaEYsU0FBUyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLE9BQVEsQ0FBQztZQUN6RTtVQUVELENBQ0QsQ0FBQztRQUNGLENBQ0QsQ0FBQztNQUNGLENBQ0QsQ0FBQztNQUNELENBQUMsQ0FBQyxFQUFFLENBQ0gsWUFBWSxFQUNaLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLEdBQVksQ0FBQyxDQUFFLEVBQUUsQ0FBQyxNQUFPLENBQUM7VUFDOUIsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDO1VBQ25DLE9BQU8sR0FBTSxDQUFDLENBQUUsa0RBQWtELEdBQUcsVUFBVSxHQUFHLElBQUssQ0FBQztRQUN6RixJQUFLLENBQUUsVUFBVSxJQUFJLENBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRTtVQUN0QztRQUNEO1FBRUEsT0FBTyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7UUFDakUsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1FBQ2pGLElBQUssT0FBTyxFQUFHO1VBQ2QsSUFBSSxLQUFLLEdBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7VUFDOUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsNkJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2RSxJQUFJLGFBQWEsR0FBSSxLQUFLLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7WUFDbEQsSUFBSSxJQUFJLEdBQWEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhO1lBQ3BELElBQUksS0FBSyxHQUFZLFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVztZQUVsRCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDLENBQUMsSUFBSSxDQUFFLEtBQU0sQ0FBQztZQUUvRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxjQUFlLENBQUM7WUFDeEQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUUsZ0JBQWdCLEVBQUUsYUFBYyxDQUFDO1lBRXRELEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLGNBQWUsQ0FBQztZQUMxRCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsRUFBRSxhQUFjLENBQUM7WUFFeEQsS0FBSyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxLQUFNLENBQUM7WUFDaEQsS0FBSyxDQUFDLElBQUksQ0FBRSxtQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUM7WUFDOUMsS0FBSyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBRSxLQUFLLEVBQUUsR0FBSSxDQUFDO1VBRTNEO1FBQ0Q7UUFFQSxPQUFPLENBQUMsSUFBSSxDQUNYLFlBQVk7VUFDWCxJQUFJLENBQUMsR0FBVyxDQUFDLENBQUUsSUFBSyxDQUFDO1lBQ3hCLFNBQVMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDO1VBRWxELENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXdCLEVBQUUsVUFBVyxDQUFDO1VBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsVUFBVyxDQUFDO1VBRXZDLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUVyQixTQUFTLENBQ1AsV0FBVyxDQUNYLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtjQUNyQixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBSSxDQUFDO1lBQ2pFLENBQ0QsQ0FBQyxDQUNBLFFBQVEsQ0FBRSx3QkFBd0IsR0FBRyxVQUFXLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO1VBQzVFO1VBQ0EsU0FBUyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBRSxjQUFlLENBQUMsQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLFVBQVcsQ0FBRSxDQUFDO1VBQ2hJLFNBQVMsQ0FBQyxJQUFJLENBQUUsNkJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLFVBQVcsQ0FBRSxDQUFDO1VBQ3hJLENBQUMsQ0FBQyxJQUFJLENBQ0wsZUFBZSxFQUNmLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNmLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxVQUFVLEVBQUU7Y0FDM0UsU0FBUyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUM7Y0FDOUIsU0FBUyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsV0FBWSxDQUFDO2NBQ2hGLFNBQVMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxPQUFRLENBQUM7WUFDekU7VUFFRCxDQUNELENBQUM7UUFDRixDQUNELENBQUM7TUFFRixDQUNELENBQUM7TUFDRDtNQUNJOztNQUVKLENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLGdDQUFnQyxFQUNoQyxVQUFVLEVBQUUsRUFBRTtRQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsbUJBQW9CLENBQUM7UUFDckQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxzQkFBc0IsRUFDdEIsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFO1FBQ25CLElBQUksVUFBVSxHQUFLLElBQUksQ0FBQyxVQUFVO1VBQ2pDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWTtRQUNqQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFlBQWEsQ0FBQztNQUNwRSxDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILFlBQVksRUFDWixVQUFVLEVBQUUsRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFZLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTyxDQUFDO1VBQzlCLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQztRQUNwQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBRSxJQUFJLEVBQUcsVUFBVSxFQUFFLFVBQVcsQ0FBQztRQUNsRSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxVQUFVLENBQUMsbUNBQW9DLENBQUMsRUFBRztVQUMxRSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUUseUJBQXlCLEdBQUcsVUFBVyxDQUFDO1VBQ3RELElBQUksQ0FBQyxJQUFJLENBQUUsc0JBQXVCLENBQUMsQ0FBQyxRQUFRLENBQUUsZ0JBQWlCLENBQUM7UUFDakU7TUFDRCxDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsVUFBVSxDQUFDLEVBQUU7UUFDWixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUseUJBQXlCLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUUsQ0FBQztRQUMxRSxJQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxVQUFVLENBQUMsbUNBQW9DLENBQUMsRUFBRztVQUM3RixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBRSxzQkFBdUIsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxnQkFBaUIsQ0FBQztRQUNqRTtNQUNELENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsZ0JBQWdCLEVBQ2hCLGtCQUFrQixFQUNsQixVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSx5QkFBeUIsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBRSxDQUFDO1FBQzFFLElBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7VUFDdEIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUUsc0JBQXVCLENBQUMsQ0FBQyxXQUFXLENBQUUsZ0JBQWlCLENBQUM7UUFDcEU7TUFDRCxDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCw0REFBNEQsRUFDNUQsVUFBUyxFQUFFLEVBQUU7UUFDWixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLDhCQUErQixDQUFDO1FBQ2hFLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHdCQUF3QixFQUN4QixVQUFVLEVBQUUsRUFBRTtRQUViLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLFVBQVUsR0FBVSxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDO1VBQy9DLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXlCLENBQUM7VUFDdEQsYUFBYSxHQUFPLElBQUk7VUFDeEIsS0FBSyxHQUFlLENBQUMsQ0FBQyxPQUFPLENBQUUsY0FBZSxDQUFDO1VBQy9DLE9BQU8sR0FBYSxLQUFLLENBQUMsSUFBSSxDQUFFLDhEQUErRCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztVQUNuSCxhQUFhLEdBQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxvRUFBcUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7VUFDekgsWUFBWSxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUUsbUVBQW9FLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1VBQ3hILFNBQVMsR0FBVyxLQUFLLENBQUMsSUFBSSxDQUFFLGdFQUFpRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztVQUNySCxLQUFLLEdBQWUsS0FBSyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLO1VBQ3JJLElBQUksR0FBZ0I7WUFDbkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsOEJBQThCO1lBQ3pELE9BQU8sRUFBRSxVQUFVO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDO1lBQzNDLE9BQU8sRUFBRyxPQUFPO1lBQ2pCLGFBQWEsRUFBRSxhQUFhO1lBQzVCLFlBQVksRUFBRyxZQUFZO1lBQzNCLFNBQVMsRUFBSSxTQUFTO1lBQ3RCLFdBQVcsRUFBRztVQUNmLENBQUM7UUFFRixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsSUFBSyxLQUFLLEtBQUssS0FBSyxJQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUc7VUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHVCQUF3QixDQUFDO1VBQ3pEO1FBQ0Q7UUFDQSxJQUFLLEtBQUssS0FBSyxLQUFLLElBQUksQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUc7VUFDM0QsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHFCQUFzQixDQUFDO1VBQ3ZEO1FBQ0Q7O1FBRUE7UUFDQSxJQUFJLGFBQWEsS0FBSyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsY0FBYyxDQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBRSxDQUFDLEVBQUU7VUFDOUYsSUFBSSxHQUFHLGFBQWE7UUFDckI7UUFFQSxJQUFJLG9CQUFvQjtRQUV4QixJQUFLLENBQUMsQ0FBRSwwQ0FBMEMsR0FBRyxpQkFBaUIsR0FBRyxvREFBb0QsR0FBRyxpQkFBaUIsR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFbkssb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLDBDQUEwQyxHQUFHLGlCQUFpQixHQUFHLG9EQUFvRCxHQUFHLGlCQUFpQixHQUFHLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFckwsQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzREFBdUQsQ0FBQyxDQUFDLE1BQU0sRUFBRztVQUVoRyxvQkFBb0IsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHNEQUF1RCxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUUzRyxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUUsV0FBVyxHQUFHLGlCQUFpQixHQUFHLG1DQUFtQyxHQUFHLGlCQUFpQixHQUFHLCtCQUFnQyxDQUFDLENBQUMsTUFBTSxFQUFJO1VBRXRKLG9CQUFvQixHQUFHLENBQUMsQ0FBRSxXQUFXLEdBQUcsaUJBQWlCLEdBQUcsbUNBQW1DLEdBQUcsaUJBQWlCLEdBQUcsK0JBQWdDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRWhLLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBQywyREFBMkQsR0FBRyxpQkFBaUIsR0FBRyxvRUFBb0UsR0FBRyxpQkFBaUIsR0FBRyw2REFBNkQsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFN1IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLDJEQUEyRCxHQUFHLGlCQUFpQixHQUFHLG9FQUFvRSxHQUFHLGlCQUFpQixHQUFHLDZEQUE2RCxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQztVQUNyUixvQkFBb0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFdEQ7UUFFQSxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLElBQU0sT0FBTyxvQkFBb0IsS0FBSyxXQUFXLElBQUksb0JBQW9CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNyRixRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUUsb0JBQW9CLENBQUMsR0FBRyxDQUFFLENBQUUsQ0FBRSxDQUFDO1VBQ3hELFFBQVEsVUFBTyxDQUFFLGFBQWMsQ0FBQztRQUNqQztRQUVBLENBQUMsQ0FBQyxJQUFJLENBQ0wsSUFBSSxFQUNKLFVBQVMsR0FBRyxFQUFDLFFBQVEsRUFBQztVQUNyQixRQUFRLENBQUMsTUFBTSxDQUFFLEdBQUcsRUFBRyxRQUFBLENBQU8sUUFBUSxNQUFLLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFFLFFBQVMsQ0FBQyxHQUFHLFFBQVMsQ0FBQztRQUM5RixDQUNELENBQUM7UUFFRCxNQUFNLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQztRQUU3RCxJQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO1VBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFnQixDQUFDO1VBQ2pEO1FBQ0Q7UUFFQSxDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxpQkFBaUI7VUFDakMsSUFBSSxFQUFFLFFBQVE7VUFDZCxJQUFJLEVBQUUsTUFBTTtVQUNaO1VBQ0EsV0FBVyxFQUFFLEtBQUs7VUFDbEIsV0FBVyxFQUFFLEtBQUs7VUFDbEIsS0FBSyxFQUFFLEtBQUs7VUFDWixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLENBQUM7VUFDeEIsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFDO1VBQzFCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUM1QixJQUFJLGVBQWUsR0FBSSxRQUFRLENBQUMsTUFBTTtjQUNyQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsT0FBTztjQUNuQyxVQUFVLEdBQVMsSUFBSTtZQUV4QixJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUc7Y0FFaEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7Y0FFM0IsS0FBSyxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7Y0FFckIsSUFBSSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsRUFBRztnQkFDckQsTUFBTSxDQUFDLE9BQU8sQ0FBRSxnQkFBaUIsQ0FBQztjQUNuQztjQUNBLElBQUksU0FBUyxHQUFHLFVBQVU7Y0FDMUIsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFLFNBQVMsSUFBSSxVQUFVO2NBQzFDLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRSxTQUFTLElBQUksZUFBZTtjQUNwRCxJQUFJLGFBQWEsS0FBSyxDQUFDLEVBQUUsU0FBUyxJQUFJLGdCQUFnQjtjQUN0RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUUsU0FBUyxJQUFJLFlBQVk7Y0FFOUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLHFCQUFzQixDQUFDO1lBRWpJO1lBRUEsSUFBSyxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE9BQVEsQ0FBQyxJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUc7Y0FDcEYsTUFBTSxDQUFDLEtBQUssQ0FBRSxnQkFBaUIsQ0FBQztZQUNqQztVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsMEJBQTBCLEVBQzFCLFVBQVUsRUFBRSxFQUFFO1FBRWIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDaEMsVUFBVSxHQUFVLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUM7VUFDL0MsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztVQUN0RCxXQUFXLEdBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQztVQUM3RixhQUFhLEdBQU8sSUFBSTtVQUN4QixLQUFLLEdBQWUsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLO1VBQzdFLElBQUksR0FBZ0I7WUFDbkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsOEJBQThCO1lBQ3pELE9BQU8sRUFBRSxVQUFVO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDO1lBQzNDLE9BQU8sRUFBRyxDQUFDO1lBQ1gsYUFBYSxFQUFHLENBQUM7WUFDakIsWUFBWSxFQUFHLENBQUM7WUFDaEIsU0FBUyxFQUFJLENBQUM7WUFDZCxXQUFXLEVBQUk7VUFDaEIsQ0FBQztRQUNGLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixJQUFLLEtBQUssS0FBSyxLQUFLLElBQUksRUFBRSxLQUFLLEtBQUssRUFBRztVQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsdUJBQXdCLENBQUM7VUFDekQ7UUFDRDtRQUNBLElBQUssS0FBSyxLQUFLLEtBQUssSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRztVQUMzRCxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMscUJBQXNCLENBQUM7VUFDdkQ7UUFDRDtRQUNBO1FBQ0EsSUFBSSxhQUFhLEtBQUssQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBRSw0QkFBNEIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQyxFQUFFO1VBQzlGLElBQUksR0FBRyxhQUFhO1FBQ3JCO1FBRUEsSUFBSSxvQkFBb0I7UUFFeEIsSUFBSyxDQUFDLENBQUUsMENBQTBDLEdBQUcsaUJBQWlCLEdBQUcsb0RBQW9ELEdBQUcsaUJBQWlCLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRW5LLG9CQUFvQixHQUFHLENBQUMsQ0FBRSwwQ0FBMEMsR0FBRyxpQkFBaUIsR0FBRyxvREFBb0QsR0FBRyxpQkFBaUIsR0FBRyxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXJMLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsc0RBQXVELENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFaEcsb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzREFBdUQsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFM0csQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFFLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxtQ0FBbUMsR0FBRyxpQkFBaUIsR0FBRywrQkFBZ0MsQ0FBQyxDQUFDLE1BQU0sRUFBSTtVQUV0SixvQkFBb0IsR0FBRyxDQUFDLENBQUUsV0FBVyxHQUFHLGlCQUFpQixHQUFHLG1DQUFtQyxHQUFHLGlCQUFpQixHQUFHLCtCQUFnQyxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUVoSyxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUMsMkRBQTJELEdBQUcsaUJBQWlCLEdBQUcsb0VBQW9FLEdBQUcsaUJBQWlCLEdBQUcsNkRBQTZELEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRTdSLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQywyREFBMkQsR0FBRyxpQkFBaUIsR0FBRyxvRUFBb0UsR0FBRyxpQkFBaUIsR0FBRyw2REFBNkQsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7VUFDclIsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXREO1FBRUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQztRQUM3QixJQUFNLE9BQU8sb0JBQW9CLEtBQUssV0FBVyxJQUFJLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDckYsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBRSxDQUFFLENBQUUsQ0FBQztVQUN4RCxRQUFRLFVBQU8sQ0FBRSxhQUFjLENBQUM7UUFDakM7UUFFQSxDQUFDLENBQUMsSUFBSSxDQUNMLElBQUksRUFDSixVQUFTLEdBQUcsRUFBQyxRQUFRLEVBQUM7VUFDckIsUUFBUSxDQUFDLE1BQU0sQ0FBRSxHQUFHLEVBQUcsUUFBQSxDQUFPLFFBQVEsTUFBSyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxRQUFTLENBQUMsR0FBRyxRQUFTLENBQUM7UUFDOUYsQ0FDRCxDQUFDO1FBRUQsTUFBTSxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUM7UUFFN0QsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtVQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztVQUNqRDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsaUJBQWlCO1VBQ2pDLElBQUksRUFBRSxRQUFRO1VBQ2QsSUFBSSxFQUFFLE1BQU07VUFDWjtVQUNBLFdBQVcsRUFBRSxLQUFLO1VBQ2xCLFdBQVcsRUFBRSxLQUFLO1VBQ2xCLEtBQUssRUFBRSxLQUFLO1VBQ1osVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBQztVQUMxQixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxlQUFlLEdBQUksUUFBUSxDQUFDLE1BQU07Y0FDckMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE9BQU87Y0FDbkMsVUFBVSxHQUFTLElBQUk7WUFFeEIsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFHO2NBRWhDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2NBRTNCLElBQUssVUFBVSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFpQixDQUFDLEVBQUc7Z0JBQ3RELE1BQU0sQ0FBQyxPQUFPLENBQUUsZ0JBQWlCLENBQUM7Y0FDbkM7Y0FDQSxDQUFDLENBQUUsMkJBQTJCLEdBQUcsVUFBVyxDQUFDLENBQUMsUUFBUSxDQUFFLFFBQVMsQ0FBQztjQUVsRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMscUJBQXNCLENBQUM7WUFFdkk7WUFFQSxJQUFLLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUNwRixNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO1lBQ2pDO1VBRUQ7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCwwQkFBMEIsRUFDMUIsVUFBVSxFQUFFLEVBQUU7UUFFYixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNoQyxVQUFVLEdBQVUsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBa0IsQ0FBQztVQUMvQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF5QixDQUFDO1VBQ3RELElBQUksR0FBZ0I7WUFDbkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsOEJBQThCO1lBQ3pELE9BQU8sRUFBRSxVQUFVO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDO1lBQzNDLE9BQU8sRUFBRyxDQUFDO1lBQ1gsYUFBYSxFQUFHLENBQUM7WUFDakIsWUFBWSxFQUFHLENBQUM7WUFDaEIsU0FBUyxFQUFJO1VBQ2QsQ0FBQztRQUVGLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixJQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO1VBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFnQixDQUFDO1VBQ2pEO1FBQ0Q7UUFFQSxDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxpQkFBaUI7VUFDakMsSUFBSSxFQUFFLElBQUk7VUFDVixJQUFJLEVBQUUsTUFBTTtVQUNaLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBQzVCLElBQUksZUFBZSxHQUFJLFFBQVEsQ0FBQyxNQUFNO2NBQ3JDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPO2NBQ25DLFVBQVUsR0FBUyxJQUFJO1lBRXhCLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUVoQyxJQUFJLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQyxFQUFFO2dCQUNwRCxNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO2NBQ2pDO2NBQ0EsQ0FBQyxDQUFFLDJCQUEyQixHQUFHLFVBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7Y0FDckUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFNUI7WUFFQSxJQUFLLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUNwRixNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO1lBQ2pDO1VBRUQ7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFDRDtNQUNJOztNQUVKLElBQUksY0FBYyxHQUFHLEVBQUU7TUFFdkIsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsMENBQTBDLEVBQzFDLFlBQVc7UUFDVixJQUFJLFVBQVUsR0FBSyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRCxJQUFJLElBQUksR0FBVyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztRQUNwRixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDO1FBRTlGLElBQUksZUFBZSxHQUFHLENBQUM7UUFDdkIsSUFBSyxJQUFJLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRztVQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDLElBQUksQ0FDN0IsWUFBVztZQUNWLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXpDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBRSxVQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtjQUNwQyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDaEIsZUFBZSxFQUFFO1lBQ2xCLENBQUMsTUFBTTtjQUNOLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQjtVQUNELENBQ0QsQ0FBQztVQUNELElBQUksZUFBZSxLQUFLLENBQUMsRUFBRTtZQUMxQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7VUFDcEIsQ0FBQyxNQUFNO1lBQ04sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1VBQ3BCO1FBQ0QsQ0FBQyxNQUFNO1VBQ04sQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBRSxFQUFHLENBQUM7UUFDcEI7TUFDRCxDQUNELENBQUM7O01BRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7TUFFQSxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx3QkFBd0IsRUFDeEIsWUFBVztRQUNWLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxzQkFBdUIsQ0FBRSxDQUFDO1FBQ3RFLElBQUksV0FBVyxHQUFJLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBRSxDQUFDO1FBRXJFLFlBQVksQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO1FBRTVCLElBQU0sY0FBYyxHQUFHO1VBQ3RCLFFBQVEsRUFBRSxLQUFLO1VBQ2YsS0FBSyxFQUFFLE1BQU07VUFDYixVQUFVLEVBQUUsVUFBVTtVQUN0QixVQUFVLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUM7VUFDNUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUUsVUFBVztRQUN4QyxDQUFDO1FBRUQsV0FBVyxDQUFDLEtBQUssQ0FBQSxhQUFBLENBQUEsYUFBQSxLQUVaLGNBQWM7VUFDakIsT0FBTyxFQUFFLFNBQUEsUUFBQSxFQUFXO1lBQ25CLFlBQVksQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO1lBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUEsYUFBQSxDQUFBLGFBQUEsS0FFWixjQUFjO2NBQ2pCLE9BQU8sRUFBRTtZQUFJLEVBRWYsQ0FBQztVQUNGO1FBQUMsRUFFSCxDQUFDO1FBRUQsV0FBVyxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7TUFFNUIsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsdUJBQXVCLEVBQ3ZCLFVBQVMsRUFBRSxFQUFFO1FBQ1osRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFVLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDMUIsR0FBRyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUUsb0JBQXFCLENBQUM7VUFDbEQsV0FBVyxHQUFHLFFBQVEsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFFLGNBQWUsQ0FBRSxDQUFDO1VBQ3JELFdBQVcsR0FBRyxDQUFDLEtBQUssV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDO1VBQ3ZDLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFLGtCQUFtQixDQUFDO1VBQzVDLElBQUksR0FBVSxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUksQ0FBQztVQUM5QixVQUFVLEdBQUksQ0FBQyxDQUFFLGNBQWMsR0FBRyxXQUFZLENBQUM7UUFFaEQsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsbUJBQW1CO1VBQ25DLElBQUksRUFBRTtZQUNMLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLHFCQUFxQjtZQUNoRCxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDM0IsT0FBTyxFQUFFLFVBQVU7WUFDbkIsYUFBYSxFQUFHLFdBQVc7WUFDM0IsY0FBYyxFQUFHO1VBQ2xCLENBQUM7VUFDRCxNQUFNLEVBQUUsTUFBTTtVQUNkLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLElBQUssQ0FBQztVQUMzQixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxJQUFLLENBQUM7VUFDN0IsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO1lBQ3hCLElBQUssQ0FBRSxJQUFJLEVBQUc7Y0FDYjtZQUNEO1lBQ0EsSUFBSSxDQUFDLFdBQVcsQ0FBRSxtQ0FBb0MsQ0FBQztZQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFFLFdBQVcsS0FBSyxDQUFDLEdBQUcsaUJBQWlCLEdBQUcsbUJBQW9CLENBQUM7WUFDNUUsVUFBVSxDQUFDLElBQUksQ0FBRSxvQ0FBb0MsR0FBRyxXQUFXLEdBQUcsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxTQUFVLENBQUM7WUFDekcsSUFBSSxDQUFDLElBQUksQ0FBRSxjQUFjLEVBQUcsV0FBWSxDQUFDO1lBQ3pDLElBQUksV0FBVyxLQUFLLENBQUMsRUFBRztjQUN2QixDQUFDLENBQUMsa0RBQWtELEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7Y0FDOUYsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxNQUFNO2NBQ04sQ0FBQyxDQUFDLGtEQUFrRCxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztjQUNqRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQjtVQUNEO1FBRUQsQ0FDRCxDQUFDO1FBQ0QsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asb0JBQW9CLEVBQ3BCLFVBQVMsRUFBRSxFQUFFO1FBQ1osRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFVLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDMUIsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsYUFBYyxDQUFDO1VBQ3hDLEtBQUssR0FBSSxDQUFDLENBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBVyxDQUFFLENBQUM7VUFDM0MsR0FBRyxHQUFXLENBQUMsQ0FBRSw2Q0FBNkMsR0FBRyxXQUFXLEdBQUcsOEJBQThCLEdBQUcsV0FBVyxHQUFHLG1EQUFtRCxHQUFHLFdBQVcsR0FBRyxJQUFLLENBQUM7VUFDeE0sS0FBSyxHQUFTLENBQUMsQ0FBQyxpQ0FBaUMsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXhFLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtVQUNuQyxJQUFJLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0I7WUFDN0MsS0FBSyxFQUFFLENBQUMsQ0FBRSxjQUFlLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1lBQzFDLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFdBQVcsRUFBRztZQUNkO1VBQ0QsQ0FBQztVQUNELE1BQU0sRUFBRSxNQUFNO1VBQ2QsS0FBSyxFQUFFLEtBQUs7VUFDWixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDM0IsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsSUFBSyxDQUFDO1VBQzdCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtZQUN4QixJQUFLLENBQUUsSUFBSSxFQUFHO2NBQ2I7WUFDRDtZQUNBLElBQUssQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHO2NBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUM3QixDQUFDLE1BQU07Y0FDTixLQUFLLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztjQUNyQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Y0FDWixJQUFJLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2xELENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ2hELENBQUMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO2NBQ3BFO2NBQ0EsSUFBSyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLGNBQWM7Y0FDakQ7WUFDRDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzNCO0FBQ0w7QUFDQTtVQUVJO1FBRUQsQ0FDRCxDQUFDO1FBQ0QsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asa0JBQWtCLEVBQ2xCLFVBQVMsRUFBRSxFQUFFO1FBQ1osRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFVLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDMUIsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsYUFBYyxDQUFDO1VBQ3hDLEdBQUcsR0FBVyxDQUFDLENBQUUsNkNBQTZDLEdBQUcsV0FBVyxHQUFHLDhCQUE4QixHQUFHLFdBQVcsR0FBRyxpQ0FBa0MsQ0FBQztVQUNqSyxLQUFLLEdBQUksQ0FBQyxDQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLFVBQVcsQ0FBRSxDQUFDO1VBQzNDLE9BQU8sR0FBSSxRQUFRLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxvQ0FBcUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7VUFDL0UsSUFBSSxHQUFLLEtBQUssQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUN0RCxJQUFJLEdBQUssS0FBSyxDQUFDLElBQUksQ0FBRSxvQ0FBcUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1VBQ2pFLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDO1FBQ3BELElBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDLEVBQUc7VUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLDZCQUE4QixDQUFDO1VBQy9ELE9BQU8sS0FBSztRQUNiO1FBQ0EsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsbUJBQW1CO1VBQ25DLElBQUksRUFBRTtZQUNMLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGtCQUFrQjtZQUM3QyxLQUFLLEVBQUUsQ0FBQyxDQUFFLGNBQWUsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDMUMsT0FBTyxFQUFFLFVBQVU7WUFDbkIsV0FBVyxFQUFHLFdBQVc7WUFDekIsWUFBWSxFQUFFLE9BQU87WUFDckIsU0FBUyxFQUFDLElBQUk7WUFDZCxpQkFBaUIsRUFBQztVQUNuQixDQUFDO1VBQ0QsTUFBTSxFQUFFLE1BQU07VUFDZCxLQUFLLEVBQUUsS0FBSztVQUNaLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLElBQUssQ0FBQztVQUMzQixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxJQUFLLENBQUM7VUFDN0IsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO1lBQ3hCLElBQUssQ0FBRSxJQUFJLEVBQUc7Y0FDYjtZQUNEO1lBQ0EsSUFBSyxDQUFFLElBQUksQ0FBQyxNQUFNLEVBQUc7Y0FDcEIsTUFBTSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQzdCLENBQUMsTUFBTTtjQUNOLEtBQUssQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO2NBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQztjQUNyQyxHQUFHLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUM7Y0FDckMsR0FBRyxDQUFDLElBQUksQ0FBRSx1QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxjQUFjLEVBQUUsT0FBUSxDQUFDO2NBQ25FLFdBQVcsQ0FBQyxXQUFXLENBQUUsbUNBQW9DLENBQUM7Y0FDOUQsV0FBVyxDQUFDLFFBQVEsQ0FBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLG1CQUFtQixHQUFHLGlCQUFrQixDQUFDO2NBQy9FLElBQUksT0FBTyxLQUFLLENBQUMsRUFBRztnQkFDbkIsQ0FBQyxDQUFDLGtEQUFrRCxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2dCQUM5RixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztjQUMzQixDQUFDLE1BQU07Z0JBQ04sQ0FBQyxDQUFDLGtEQUFrRCxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFDakcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDM0I7WUFDRDtVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBQ0QsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsaUJBQWlCLEVBQ2pCLFVBQVMsRUFBRSxFQUFFO1FBQ1osRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFNLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDdEIsS0FBSyxHQUFLLENBQUMsQ0FBRSxpQkFBa0IsQ0FBQztVQUNoQyxPQUFPLEdBQUcsUUFBUSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsb0NBQXFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO1VBQzlFLElBQUksR0FBTSxLQUFLLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7VUFDdkQsSUFBSSxHQUFNLEtBQUssQ0FBQyxJQUFJLENBQUUsb0NBQXFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRSxJQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQyxFQUFHO1VBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyw2QkFBOEIsQ0FBQztVQUMvRCxPQUFPLEtBQUs7UUFDYjtRQUNBLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtVQUNuQyxJQUFJLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0I7WUFDakQsS0FBSyxFQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQzNCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFNBQVMsRUFBQyxJQUFJO1lBQ2QsaUJBQWlCLEVBQUMsSUFBSTtZQUN0QixTQUFTLEVBQUksQ0FBQyxDQUFFLHFDQUFxQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUUsY0FBZTtVQUN2SixDQUFDO1VBQ0QsTUFBTSxFQUFFLE1BQU07VUFDZCxLQUFLLEVBQUUsS0FBSztVQUNaLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLElBQUssQ0FBQztVQUMzQixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxJQUFLLENBQUM7VUFDN0IsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO1lBQ3hCLElBQUssQ0FBRSxJQUFJLEVBQUc7Y0FDYjtZQUNEO1lBQ0EsSUFBSyxDQUFFLElBQUksQ0FBQyxNQUFNLEVBQUc7Y0FDcEIsTUFBTSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQzdCLENBQUMsTUFBTTtjQUNOLENBQUMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQ3ZELEtBQUssQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2NBQy9DLEtBQUssQ0FBQyxJQUFJLENBQUUsaUNBQWtDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2NBQ3ZELEtBQUssQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO2NBQ3JCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUUsaUJBQWtCLENBQUM7Y0FDL0MsSUFBSSxJQUFJLEdBQU8sUUFBUSxDQUFFLElBQUssQ0FBQztjQUMvQixJQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUNsQyxDQUFDLENBQUUscUJBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUUsSUFBSyxDQUFDO2dCQUN6QyxDQUFDLENBQUUscUJBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUUsa0NBQWtDLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLFNBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxRQUFTLENBQUM7Z0JBQy9JLENBQUMsQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxDQUFDLENBQUUsNkJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekMsQ0FBQyxDQUFFLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7Z0JBQ3hELENBQUMsQ0FBRSxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO2NBRXpELENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUN6QyxDQUFDLENBQUUscUJBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUUsSUFBSyxDQUFDO2dCQUN6QyxDQUFDLENBQUUscUJBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUUsa0NBQWtDLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLFNBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxRQUFTLENBQUM7Z0JBQy9JLENBQUMsQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxDQUFDLENBQUUsNkJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekMsQ0FBQyxDQUFFLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7Z0JBQ3hELENBQUMsQ0FBRSxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO2NBRXpELENBQUMsTUFBTTtnQkFDTixDQUFDLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxNQUFNLENBQUUsSUFBSyxDQUFDO2dCQUNoRCxjQUFjLENBQUMsSUFBSSxDQUFFLEtBQU0sQ0FBQztnQkFDNUIsQ0FBQyxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSx3QkFBd0IsQ0FBQztnQkFDdkcsQ0FBQyxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFFLGtDQUFrQyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxTQUFVLENBQUMsQ0FBQyxPQUFPLENBQUUsUUFBUyxDQUFDO2dCQUN0SixDQUFDLENBQUUsZ0NBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsQ0FBQyxDQUFFLG9DQUFxQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hELENBQUMsQ0FBRSx3Q0FBd0MsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO2dCQUMvRCxDQUFDLENBQUUsNkNBQTZDLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztnQkFDcEUsQ0FBQyxDQUFFLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7Y0FDOUQ7Y0FDQSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztjQUU3QyxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFFbkMsSUFBSSxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2tCQUM3QyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztrQkFDckIsQ0FBQyxDQUFFLDBCQUEyQixDQUFDLENBQUMsTUFBTSxDQUFFLElBQUssQ0FBQztrQkFDOUMsQ0FBQyxDQUFFLDRCQUE0QixDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU0sQ0FBQztrQkFDckQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDakM7Y0FDRDtjQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Y0FFekMsSUFBSyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBQyxjQUFjLENBQUUsQ0FBQztnQkFDckMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7Y0FDNUIsQ0FBQyxNQUFNLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtnQkFDakQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsSUFBSSxDQUFDLFNBQVUsQ0FBQztjQUMvQztZQUNEO1VBQ0Q7UUFFRCxDQUNELENBQUM7UUFDRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILHNCQUFzQixFQUN0QixVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUU7UUFDbkIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTyxDQUFDO1VBQ3JDLFVBQVUsR0FBVSxJQUFJLENBQUMsVUFBVTtVQUNuQyxZQUFZLEdBQVEsSUFBSSxDQUFDLFlBQVk7VUFDckMsT0FBTyxHQUFhLENBQUMsQ0FBRSxvREFBb0QsR0FBRyxVQUFVLEdBQUcsSUFBSyxDQUFDO1VBQ2pHLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUM7UUFDOUYsSUFBSyxDQUFFLFVBQVUsSUFBSSxDQUFFLFlBQVksSUFBSSxDQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUU7VUFDeEQ7UUFDRDtRQUNBLElBQUssQ0FBRSxpQkFBaUIsSUFBSSxDQUFFLElBQUksQ0FBQyxXQUFXLEVBQUU7VUFDL0MsT0FBTyxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7UUFDakUsQ0FBQyxNQUFNO1VBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7UUFDcEU7UUFFQSxPQUFPLENBQUMsSUFBSSxDQUNYLFlBQVk7VUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXdCLEVBQUUsVUFBVyxDQUFDO1VBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsWUFBYSxDQUFDO1FBQzFDLENBQ0QsQ0FBQztRQUNEO1FBQ0EsQ0FBQyxDQUFFLGtGQUFrRixHQUFHLFVBQVUsR0FBRyxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsWUFBYSxDQUFDO01BQ3BKLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsWUFBWSxFQUNaLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLEdBQVksQ0FBQyxDQUFFLEVBQUUsQ0FBQyxNQUFPLENBQUM7VUFDOUIsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDO1VBQ25DLE9BQU8sR0FBTSxDQUFDLENBQUUsb0RBQW9ELEdBQUcsVUFBVSxHQUFHLElBQUssQ0FBQztRQUMzRixJQUFLLENBQUUsVUFBVSxJQUFJLENBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRTtVQUN0QztRQUNEO1FBRUEsT0FBTyxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7UUFFbkUsT0FBTyxDQUFDLElBQUksQ0FDWCxZQUFZO1VBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNqQixDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF3QixFQUFFLFVBQVcsQ0FBQztVQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFVBQVcsQ0FBQztRQUN4QyxDQUNELENBQUM7UUFDRDtRQUNBLENBQUMsQ0FBRSxrRkFBa0YsR0FBRyxVQUFVLEdBQUcsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFVBQVcsQ0FBQztNQUNsSixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxrREFBa0QsRUFDbEQsVUFBVSxFQUFFLEVBQUU7UUFFYixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNoQyxLQUFLLEdBQU8sQ0FBQyxDQUFFLGFBQWMsQ0FBQztVQUM5QixRQUFRLEdBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFdEMsS0FBSyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLEVBQUUsUUFBUyxDQUFDO1FBRXJFLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLGtEQUFrRCxFQUNsRCxVQUFVLEVBQUUsRUFBRTtRQUViLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLEtBQUssR0FBTyxDQUFDLENBQUUsYUFBYyxDQUFDO1VBQzlCLFFBQVEsR0FBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUV0QyxLQUFLLENBQUMsSUFBSSxDQUFFLHFCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWUsRUFBRSxRQUFTLENBQUM7UUFFckUsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AseURBQXlELEVBQ3pELFVBQVUsRUFBRSxFQUFFO1FBRWIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDaEMsVUFBVSxHQUFVLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUM7VUFDL0MsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztVQUN0RCxZQUFZLEdBQVEsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBb0IsQ0FBQztVQUNqRCxlQUFlLEdBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxzQkFBdUIsQ0FBQztVQUNwRCxhQUFhLEdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQztVQUNsRCxTQUFTLEdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQztVQUM5QyxLQUFLLEdBQW1CLENBQUMsQ0FBRSxvQkFBcUIsQ0FBQztVQUNqRCxJQUFJLEdBQWdCO1lBQ25CLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGlCQUFpQjtZQUM1QyxPQUFPLEVBQUUsVUFBVTtZQUNuQixVQUFVLEVBQUUsVUFBVTtZQUN0QixlQUFlLEVBQUU7VUFDbEIsQ0FBQzs7UUFFRjtRQUNBLElBQUksT0FBTyxhQUFhLEtBQUssV0FBVyxFQUFFO1VBQ3pDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYTtVQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFFLDBCQUEyQixDQUFDLENBQUMsSUFBSSxDQUFFLG9CQUFvQixFQUFFLGFBQWMsQ0FBQztRQUNyRjtRQUVBLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO1VBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWdCLEVBQUUsU0FBVSxDQUFDO1FBQzdFO1FBRUEsS0FBSyxDQUFDLElBQUksQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBbUIsRUFBRSxZQUFhLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsVUFBVyxDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF3QixFQUFFLGlCQUFrQixDQUFDO1FBRTVLLElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUU7VUFDdEMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFnQixDQUFDO1VBQ2pEO1FBQ0Q7UUFFQSxDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxtQkFBbUI7VUFDbkMsSUFBSSxFQUFFLElBQUk7VUFDVixJQUFJLEVBQUUsTUFBTTtVQUNaLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsOEJBQStCLENBQUUsQ0FBQztVQUVqRSxDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBQ3JCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFFLDhCQUErQixDQUFFLENBQUM7VUFDbkUsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBQzVCLElBQUksZUFBZSxHQUFJLFFBQVEsQ0FBQyxNQUFNO2NBQ3JDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPO2NBQ25DLElBQUksR0FBZSxRQUFRLENBQUMsSUFBSTtjQUNoQyxhQUFhLEdBQUksUUFBUSxDQUFDLGFBQWE7Y0FDdkMsVUFBVSxHQUFTLElBQUk7WUFFeEIsSUFBSyxlQUFlLEtBQUssTUFBTSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFHO2NBQ3BELElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUUsaUJBQWtCLENBQUM7Y0FDL0MsSUFBSSxJQUFJLEdBQU8sRUFBRTtjQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxJQUFJLFFBQVEsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUM7Y0FDNUI7Y0FDQSxLQUFLLENBQUMsSUFBSSxDQUFFLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDekMsS0FBSyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDO2NBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxhQUFhLENBQUMsTUFBTyxDQUFDO2NBQzFELEtBQUssQ0FBQyxJQUFJLENBQUUsYUFBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDbEMsS0FBSyxDQUFDLElBQUksQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLEVBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxhQUFjLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFPLEVBQUUsRUFBRyxDQUFDO2NBQ3RILEtBQUssQ0FBQyxJQUFJLENBQUUsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztjQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7Y0FDN0Q7Y0FDQSxjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFXO2dCQUNwRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2NBQy9CLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2NBQ1IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsOEJBQThCLEVBQUUsd0JBQXdCLENBQUM7WUFFN0UsQ0FBQyxNQUFNO2NBQ04sS0FBSyxDQUFDLElBQUksQ0FBRSxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUUsaUJBQWlCLENBQUM7Y0FDbkUsS0FBSyxDQUFDLElBQUksQ0FBRSxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDLENBQUMsSUFBSSxDQUFFLEVBQUcsQ0FBQztjQUNoQyxLQUFLLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFFLENBQUM7Y0FDdkMsS0FBSyxDQUFDLElBQUksQ0FBRSwwQkFBMEIsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUUsaUJBQWlCLENBQUM7WUFDM0U7WUFFQSxJQUFLLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUNwRixNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO2NBQ2hDLEtBQUssQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO1lBQ3RCO1VBRUQ7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCwwQkFBMEIsRUFDMUIsVUFBVSxFQUFFLEVBQUU7UUFFYixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNoQyxVQUFVLEdBQVUsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBa0IsQ0FBQztVQUMvQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF5QixDQUFDO1VBQ3RELGFBQWEsR0FBTyxDQUFDLENBQUMsSUFBSSxDQUFFLG9CQUFxQixDQUFDO1VBQ2xELFNBQVMsR0FBVyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFpQixDQUFDO1VBQzlDLGFBQWEsR0FBTyxJQUFJO1VBQ3hCLEtBQUssR0FBTyxDQUFDLENBQUUsb0JBQXFCLENBQUM7VUFDckMsYUFBYSxHQUFPLElBQUksQ0FBQyxLQUFLLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFFLENBQUM7VUFDM0QsWUFBWSxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsQ0FBQyxHQUFHLENBQ3ZFLFlBQVc7WUFDVixPQUFPLElBQUksQ0FBQyxLQUFLO1VBQ2xCLENBQ0QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1VBQ1AsSUFBSSxHQUFnQjtZQUNuQixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQywwQkFBMEI7WUFDckQsT0FBTyxFQUFFLFVBQVU7WUFDbkIsV0FBVyxFQUFFLFVBQVU7WUFDdkIsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUM7WUFDM0MsYUFBYSxFQUFFLGFBQWE7WUFDNUIsWUFBWSxFQUFFLFlBQVk7WUFDMUIscUJBQXFCLEVBQUUsVUFBVSxDQUFDLHFCQUFxQjtZQUN2RCxvQkFBb0IsRUFBRSxVQUFVLENBQUM7WUFDakM7VUFDRCxDQUFDO1FBQ0YsSUFBSSxPQUFPLGFBQWEsS0FBSyxXQUFXLEVBQUU7VUFDekMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhO1FBQ25DO1FBQ0EsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLEVBQUU7VUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTO1FBQzNCO1FBQ0E7UUFDQSxJQUFJLGFBQWEsS0FBSyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsY0FBYyxDQUFFLDhCQUE4QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBRSxDQUFDLEVBQUU7VUFDaEcsSUFBSSxHQUFHLGFBQWE7UUFDckI7UUFFQSxJQUFJLG9CQUFvQjtRQUV4QixJQUFLLENBQUMsQ0FBRSwwQ0FBMEMsR0FBRyxpQkFBaUIsR0FBRyxvREFBb0QsR0FBRyxpQkFBaUIsR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFbkssb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLDBDQUEwQyxHQUFHLGlCQUFpQixHQUFHLG9EQUFvRCxHQUFHLGlCQUFpQixHQUFHLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFckwsQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzREFBdUQsQ0FBQyxDQUFDLE1BQU0sRUFBRztVQUVoRyxvQkFBb0IsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHNEQUF1RCxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUUzRyxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUUsV0FBVyxHQUFHLGlCQUFpQixHQUFHLG1DQUFtQyxHQUFHLGlCQUFpQixHQUFHLCtCQUFnQyxDQUFDLENBQUMsTUFBTSxFQUFJO1VBRXRKLG9CQUFvQixHQUFHLENBQUMsQ0FBRSxXQUFXLEdBQUcsaUJBQWlCLEdBQUcsbUNBQW1DLEdBQUcsaUJBQWlCLEdBQUcsK0JBQWdDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRWhLLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBQywyREFBMkQsR0FBRyxpQkFBaUIsR0FBRyxvRUFBb0UsR0FBRyxpQkFBaUIsR0FBRyw2REFBNkQsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFN1IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLDJEQUEyRCxHQUFHLGlCQUFpQixHQUFHLG9FQUFvRSxHQUFHLGlCQUFpQixHQUFHLDZEQUE2RCxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQztVQUNyUixvQkFBb0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFdEQ7UUFFQSxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLElBQU0sT0FBTyxvQkFBb0IsS0FBSyxXQUFXLElBQUksb0JBQW9CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNyRjtBQUNIO1VBQ0csUUFBUSxHQUFHLElBQUksUUFBUSxDQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBRSxDQUFFLENBQUUsQ0FBQztVQUN4RCxRQUFRLFVBQU8sQ0FBRSxhQUFjLENBQUM7UUFDakMsQ0FBQyxNQUFNO1VBQ04sSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFFLGdCQUFnQixHQUFHLGlCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFFLHFCQUFzQixDQUFDO1VBQ3RHLElBQUssZ0JBQWdCLENBQUMsTUFBTSxFQUFHO1lBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7VUFDekQ7UUFDRDtRQUVBLENBQUMsQ0FBQyxJQUFJLENBQ0wsSUFBSSxFQUNKLFVBQVMsR0FBRyxFQUFDLFFBQVEsRUFBQztVQUNyQixRQUFRLENBQUMsTUFBTSxDQUFFLEdBQUcsRUFBRyxRQUFBLENBQU8sUUFBUSxNQUFLLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFFLFFBQVMsQ0FBQyxHQUFHLFFBQVMsQ0FBQztRQUM5RixDQUNELENBQUM7UUFFRCxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsTUFBTSxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsNEJBQTZCLENBQUM7UUFFL0QsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtVQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztVQUNqRDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsbUJBQW1CO1VBQ25DLElBQUksRUFBRSxRQUFRO1VBQ2QsSUFBSSxFQUFFLE1BQU07VUFDWjtVQUNBLFdBQVcsRUFBRSxLQUFLO1VBQ2xCLFdBQVcsRUFBRSxLQUFLO1VBQ2xCLEtBQUssRUFBRSxLQUFLO1VBQ1osVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBQztVQUMxQixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxlQUFlLEdBQUksUUFBUSxDQUFDLE1BQU07Y0FDckMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE9BQU87Y0FDbkMsVUFBVSxHQUFTLElBQUk7WUFFeEIsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFHO2NBQ2hDLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxXQUFZLENBQUMsRUFBRztnQkFDaEQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztjQUN0QztjQUNBLElBQUksVUFBVSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE1BQU8sQ0FBQyxFQUFHO2dCQUN2RSxNQUFNLENBQUMsS0FBSyxDQUFFLFFBQVEsQ0FBQyxNQUFPLENBQUM7Y0FDaEM7Y0FDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztjQUUzQixLQUFLLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztjQUVyQixJQUFJLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHFCQUFzQixDQUFDLEVBQUc7Z0JBQzVFLE1BQU0sQ0FBQyxPQUFPLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxxQkFBc0IsQ0FBQztjQUMxRDtjQUNBLElBQU8sUUFBUSxDQUFDLG1CQUFtQixJQUFJLFFBQVEsQ0FBQyxtQkFBbUIsS0FBSyxPQUFPLElBQVEsUUFBUSxDQUFDLG1CQUFtQixJQUFJLFFBQVEsQ0FBQyxZQUFZLElBQUssUUFBUSxDQUFDLG1CQUFtQixLQUFLLFFBQVEsQ0FBQyxZQUFjLEVBQUc7Z0JBQzNNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLHFCQUFzQixDQUFDO2NBQzFJLENBQUMsTUFBTSxJQUFLLFFBQVEsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLFlBQVksS0FBSyxPQUFPLEVBQUc7Z0JBQ3hFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxxQkFBc0IsQ0FBQztjQUNoSTs7Y0FHQTtBQUNOO0FBQ0E7WUFFSztZQUVBLElBQUssVUFBVSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBQyxPQUFRLENBQUMsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFHO2NBQ3BGLE1BQU0sQ0FBQyxLQUFLLENBQUUsZ0JBQWlCLENBQUM7WUFDakM7VUFFRDtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHFCQUFxQixFQUNyQixVQUFVLEVBQUUsRUFBRTtRQUViLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLFFBQVEsR0FBWSxDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7VUFDN0MsYUFBYSxHQUFPLElBQUk7VUFDeEIsS0FBSyxHQUFPLENBQUMsQ0FBRSxhQUFjLENBQUM7VUFDOUIsWUFBWSxHQUFRLENBQUMsQ0FBQyxJQUFJLENBQUUsa0JBQW1CLENBQUM7VUFDaEQsV0FBVyxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUN6RSxJQUFJLEdBQWdCO1lBQ25CLE1BQU0sRUFBRyxVQUFVLENBQUMsT0FBTyxDQUFDLG9CQUFvQjtZQUNoRCxLQUFLLEVBQUUsQ0FBQyxDQUFFLGlEQUFrRCxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztZQUM3RSxPQUFPLEVBQUUsVUFBVTtZQUNuQixRQUFRLEVBQUUsUUFBUTtZQUNsQixZQUFZLEVBQUUsWUFBWTtZQUMxQix1QkFBdUIsRUFBRTtVQUMxQixDQUFDO1FBRUYsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssRUFBRSxFQUFFO1VBQzVGO1FBQ0Q7O1FBRUE7UUFDQSxJQUFJLGFBQWEsS0FBSyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsY0FBYyxDQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBRSxDQUFDLEVBQUU7VUFDM0YsSUFBSSxHQUFHLGFBQWE7UUFDckI7UUFFQSxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsU0FBUztVQUN6QixJQUFJLEVBQUUsSUFBSTtVQUNWLFFBQVEsRUFBRSxNQUFNO1VBQ2hCLE1BQU0sRUFBRSxNQUFNO1VBQ2QsVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFFMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxlQUFlLEdBQUksUUFBUSxDQUFDLE1BQU07Y0FDckMsVUFBVSxHQUFTLElBQUk7WUFFeEIsSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxRQUFRLENBQUMsYUFBYyxDQUFDO1lBRWxJLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLGVBQWdCLENBQUMsRUFBRztjQUMzQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLFVBQVMsVUFBVSxFQUFFLGdCQUFnQixFQUFDO2dCQUNuRSxDQUFDLENBQUUsYUFBYyxDQUFDLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztnQkFDbEMsQ0FBQyxDQUFFLHdCQUF5QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQyxFQUFHO2tCQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFFLGdCQUFpQixDQUFDO2dCQUNuQztjQUNELENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBRSxDQUFDO1lBR3BDO1lBQ0EsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxlQUFnQixDQUFDLEVBQUc7Y0FDN0MsS0FBSyxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7Y0FFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBQztZQUMxQjtVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AscUJBQXFCLEVBQ3JCLFVBQVUsRUFBRSxFQUFFO1FBRWIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDaEMsUUFBUSxHQUFZLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQztVQUM3QyxhQUFhLEdBQU8sSUFBSTtVQUN4QixLQUFLLEdBQU8sQ0FBQyxDQUFFLGFBQWMsQ0FBQztVQUM5QixZQUFZLEdBQVEsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztVQUNoRCxXQUFXLEdBQVEsS0FBSyxDQUFDLElBQUksQ0FBRSxrQ0FBbUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1VBQ3pFLElBQUksR0FBZ0I7WUFDbkIsTUFBTSxFQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CO1lBQ2hELEtBQUssRUFBRSxDQUFDLENBQUUsaURBQWtELENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1lBQzdFLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFlBQVksRUFBRSxZQUFZO1lBQzFCLFFBQVEsRUFBRTtVQUNYLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUU7VUFDNUY7UUFDRDs7UUFFQTtRQUNBLElBQUksYUFBYSxLQUFLLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxjQUFjLENBQUUseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFFLENBQUMsRUFBRTtVQUMzRixJQUFJLEdBQUcsYUFBYTtRQUNyQjtRQUVBLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1VBQ3pCLElBQUksRUFBRSxJQUFJO1VBQ1YsUUFBUSxFQUFFLE1BQU07VUFDaEIsTUFBTSxFQUFFLE1BQU07VUFDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUUxQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUM1QixJQUFJLGVBQWUsR0FBSSxRQUFRLENBQUMsTUFBTTtjQUNyQyxVQUFVLEdBQVMsSUFBSTtZQUV4QixJQUFJLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxhQUFjLENBQUM7WUFFdkgsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsZUFBZ0IsQ0FBQyxFQUFHO2NBQzNDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsVUFBUyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBQ25FLENBQUMsQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0QyxDQUFDLENBQUUscUJBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsRUFBRztrQkFDckQsTUFBTSxDQUFDLE9BQU8sQ0FBRSxnQkFBaUIsQ0FBQztnQkFDbkM7Y0FDRCxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQztZQUdwQztZQUNBLElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsZUFBZ0IsQ0FBQyxFQUFHO2NBQzdDLEtBQUssQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO2NBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7WUFDMUI7VUFFRDtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLDZCQUE2QixFQUM3QixVQUFVLEVBQUUsRUFBRTtRQUViLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLFFBQVEsR0FBWSxDQUFDLENBQUMsSUFBSSxDQUFFLGNBQWUsQ0FBQztVQUM1QyxhQUFhLEdBQU8sSUFBSTtVQUN4QixZQUFZLEdBQVEsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztVQUNoRCxJQUFJLEdBQWdCO1lBQ25CLE1BQU0sRUFBRyxVQUFVLENBQUMsT0FBTyxDQUFDLG9CQUFvQjtZQUNoRCxLQUFLLEVBQUUsQ0FBQyxDQUFFLGlEQUFrRCxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztZQUM3RSxPQUFPLEVBQUUsVUFBVTtZQUNuQixRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsU0FBUztZQUNuQixZQUFZLEVBQUU7VUFDZixDQUFDO1FBRUYsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEVBQUUsRUFBRTtVQUNyRDtRQUNEOztRQUVBO1FBQ0EsSUFBSSxhQUFhLEtBQUssQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBRSxpQ0FBaUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQyxFQUFFO1VBQ25HLElBQUksR0FBRyxhQUFhO1FBQ3JCO1FBRUEsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFNBQVM7VUFDekIsSUFBSSxFQUFFLElBQUk7VUFDVixRQUFRLEVBQUUsTUFBTTtVQUNoQixNQUFNLEVBQUUsTUFBTTtVQUNkLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBRTFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLENBQUM7VUFDeEIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBQzVCLElBQUksZUFBZSxHQUFJLFFBQVEsQ0FBQyxNQUFNO2NBQ3JDLFVBQVUsR0FBUyxJQUFJO1lBRXhCLElBQUksZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLGFBQWMsQ0FBQztZQUV2SCxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxlQUFnQixDQUFDLEVBQUc7Y0FDM0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFFLGNBQWUsQ0FBQztjQUMzQyxJQUFJLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQyxFQUFHO2dCQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFFLGdCQUFpQixDQUFDO2NBQ25DO1lBQ0Q7WUFDQSxJQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLGVBQWdCLENBQUMsRUFBRztjQUM3QyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFDO1lBQzFCO1VBRUQ7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxrQ0FBa0MsRUFDbEMsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHFCQUFzQixDQUFDO1FBQ3ZELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUdELFNBQVMsd0JBQXdCLENBQUEsRUFBRztRQUNuQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUUsb0JBQXFCLENBQUM7UUFDckMsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQztRQUN4RCxJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDO1FBQzdELElBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQUUsRUFBRSxLQUFLO1VBQUEsT0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLGNBQWMsQ0FBQyxLQUFLLENBQUM7UUFBQSxFQUFDO1FBQzVHLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztRQUNoQyxJQUFJLFVBQVUsRUFBRTtVQUNmLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztRQUNsQztNQUNEO01BQ0E7TUFDSTs7TUFFSixDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxpREFBaUQsRUFDakQsVUFBVSxFQUFFLEVBQUU7UUFDYixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDakUsSUFBSyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztVQUNqQyxlQUFlLENBQUMsSUFBSSxDQUFFLFVBQVUsRUFBQyxJQUFLLENBQUM7UUFDeEM7TUFDRCxDQUNELENBQUM7TUFHRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCw4QkFBOEIsRUFDOUIsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQWUsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUM1QixhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQztRQUMvQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBRSxhQUFhLEVBQUUsQ0FBRSxDQUFDO1FBQ3BELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLG1DQUFtQyxFQUNuQyxVQUFVLEVBQUUsRUFBRTtRQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixJQUFJLENBQUMsR0FBYyxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQzNCLEdBQUcsR0FBWSxDQUFDLENBQUMsT0FBTyxDQUFFLGdCQUFpQixDQUFDO1VBQzVDLFlBQVksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFLFNBQVUsQ0FBQztVQUNwQyxJQUFJLEdBQVc7WUFDZCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUM7WUFDNUQsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0NBQWdDO1lBQzdELE9BQU8sRUFBRSxVQUFVO1lBQ25CLDBCQUEwQixFQUFFO1lBQzVCO1VBQ0QsQ0FBQztRQUVGLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLHVCQUF1QjtVQUN2QyxJQUFJLEVBQUUsSUFBSTtVQUNWLE1BQU0sRUFBRSxNQUFNO1VBQ2QsVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBQztVQUMxQixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxJQUFJLEVBQUU7WUFDeEIsSUFBSyxDQUFFLElBQUksRUFBRztjQUNiO1lBQ0Q7WUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMzQjtBQUNMO0FBQ0E7O1lBRUssSUFBSyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRztjQUNqQyxDQUFDLENBQUUscUJBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFNLENBQUM7WUFDNUQ7WUFFQSxJQUFLLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsd0JBQXlCLENBQUMsRUFBRTtjQUMzRixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsd0JBQXlCLENBQUM7WUFDM0Q7WUFFQSxJQUFLLElBQUksQ0FBQyxLQUFLLEtBQUssV0FBVyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFHO2NBQ3JELENBQUMsQ0FBRSxxQ0FBc0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25EO1lBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUVyQyxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsT0FBTyxDQUFFLG1DQUFtQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRyxJQUFJLENBQUUsQ0FBQztVQUM1RTtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHdDQUF3QyxFQUN4QyxVQUFVLEVBQUUsRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFTLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDdEIsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsY0FBZSxDQUFDO1VBQ2xDLElBQUksR0FBTTtZQUNULE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGlDQUFpQztZQUM1RCxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQywwQkFBMEI7WUFDdkQsT0FBTyxFQUFFLFVBQVU7WUFDbkIsT0FBTyxFQUFFO1lBQ1Q7VUFDRCxDQUFDO1FBQ0YsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLENBQUMsQ0FBQyxXQUFXLENBQUUsT0FBUSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxRQUFRLENBQUUsU0FBVSxDQUFDOztRQUV2QjtRQUNBLElBQUssS0FBSyxLQUFLLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsY0FBYyxDQUFFLHlDQUF5QyxFQUFFLENBQUUsQ0FBQyxDQUFHLENBQUMsRUFBRztVQUN0RyxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzQ0FBc0MsRUFBRSxDQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFHLENBQUM7VUFDekYsT0FBTyxJQUFJO1FBQ1o7UUFDQSxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRyxDQUFDO1FBRXpELENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLHVCQUF1QjtVQUN2QyxJQUFJLEVBQUUsSUFBSTtVQUNWLE1BQU0sRUFBRSxNQUFNO1VBQ2Q7VUFDQSxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtVQUNELENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUM1QixJQUFLLENBQUUsUUFBUSxFQUFHO2NBQ2pCO1lBQ0Q7WUFFQSxJQUFJLE9BQU8sUUFBUSxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7Y0FDOUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsUUFBUSxDQUFDLFNBQVUsQ0FBQztZQUNuRDtZQUVBLElBQUssUUFBUSxDQUFDLEtBQUssRUFBRztjQUNyQixNQUFNLENBQUMsS0FBSyxDQUFFLFFBQVEsQ0FBQyxLQUFNLENBQUM7Y0FDOUI7WUFDRDtZQUNBLElBQUssQ0FBRSxDQUFDLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxNQUFNLEVBQUc7Y0FDakQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xCLENBQUMsTUFBTTtjQUNOLElBQUssT0FBTyxRQUFRLENBQUMsU0FBUyxLQUFLLFdBQVcsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLDBCQUEwQixLQUFLLFdBQVcsRUFBRztnQkFDakgsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLDBCQUEyQixDQUFDO2NBQy9GO2NBQ0EsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7Y0FDakQ7Y0FDQSxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxlQUFlLEVBQUUsQ0FBRSxRQUFRLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFHLENBQUM7WUFDN0Y7VUFFRDtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHdDQUF3QyxFQUN4QyxVQUFVLEVBQUUsRUFBRTtRQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUUsOEJBQStCLENBQUMsQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO1FBQ25ELElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBRSxlQUFlLEVBQUUsYUFBYyxDQUFDO1FBQ2hGLElBQUksR0FBRyxHQUFhLENBQUMsQ0FBRSxVQUFVLEdBQUcsZUFBZSxHQUFHLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7UUFDNUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUUsYUFBYSxFQUFFLEdBQUksQ0FBQztRQUV0RCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFDRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCwyQ0FBMkMsRUFDM0MsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFFLDhCQUErQixDQUFDLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztRQUNuRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxlQUFlO1FBQ3RDLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLDJCQUEyQixFQUMzQixVQUFVLEVBQUUsRUFBRTtRQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBZSxDQUFDO1FBQ2hELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQzs7TUFFRDtNQUNBLENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHlCQUF5QixFQUN6QixVQUFVLEVBQUUsRUFBRztRQUNkLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFLLENBQUUsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUMsRUFBRztVQUN2QyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsUUFBUSxDQUFFLFFBQVMsQ0FBQztVQUM5QixDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF5QixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFdkQsQ0FBQyxNQUFNO1VBQ04sQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7VUFDakMsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JEO1FBQ0EsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDOztNQUVEO01BQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsaURBQWlELEVBQ2pELFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUU7VUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGVBQWdCLENBQUM7VUFDakQ7UUFDRDtRQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSw2QkFBNkIsRUFBRSxJQUFLLENBQUM7UUFFM0QsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSx1QkFBd0IsQ0FBQyxDQUFDLE9BQU8sQ0FBRTtVQUFDLE9BQU8sRUFBQztRQUFFLENBQUMsRUFBRSxNQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyRixPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFDRDtNQUdBLENBQUMsQ0FBQyxFQUFFLENBQ0gsZ0JBQWdCLEVBQ2hCLE1BQU0sRUFDTixVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO1FBQzNCLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFFLG1EQUFvRCxDQUFDLENBQUMsTUFBTSxFQUFFO1VBQ2pKLElBQUksQ0FBQyxXQUFXLEdBQUssTUFBTSxDQUFDLE9BQU8sQ0FBRSxtREFBb0QsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUM7VUFDdkcsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFFLG1EQUFvRCxDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7VUFDbEgsSUFBSSxDQUFDLFdBQVcsR0FBSyxNQUFNLENBQUMsT0FBTyxDQUFFLG1EQUFvRCxDQUFDLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQztVQUNoSCxJQUFJLENBQUMsUUFBUSxHQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUUsbURBQW9ELENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBVyxDQUFDO1VBQzdHLE9BQU8scUJBQXFCLEtBQUssV0FBVyxLQUFNLHFCQUFxQixDQUFDLHVCQUF1QixHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBRTs7VUFFL0g7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7UUFDRTtNQUNELENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsZUFBZSxFQUNmLE1BQU0sRUFDTixVQUFVLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtRQUMxQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFFLHVCQUF3QixDQUFDLENBQUMsTUFBTSxFQUFFO1VBQ3RGLE9BQU8scUJBQXFCLEtBQUssV0FBVyxLQUFNLHFCQUFxQixDQUFDLHVCQUF1QixHQUFHLHVCQUF1QixDQUFFO1VBRTNILElBQUksRUFBRSxHQUFZLE1BQU0sQ0FBQyxPQUFPLENBQUUsZUFBZ0IsQ0FBQztZQUNsRCxLQUFLLEdBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQztZQUN0RCxPQUFPLEdBQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztZQUM5QyxXQUFXLEdBQU0sRUFBRSxDQUFDLElBQUksQ0FBRSxRQUFTLENBQUM7WUFDcEMsV0FBVyxHQUFNLEtBQUssQ0FBQyxJQUFJLENBQUUsdUJBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDO1lBQ25FLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLHVCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztZQUN0RSxTQUFTLEdBQVEsS0FBSyxDQUFDLElBQUksQ0FBRSx1QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1lBQzlFLGVBQWUsR0FBRyxLQUFLO1VBRXhCLE1BQU0sQ0FBQyxXQUFXLENBQUUsT0FBUSxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUNwQyxJQUFJLFVBQVUsQ0FBQyxzQ0FBc0MsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFO1lBRS9FLENBQUMsQ0FBRSxzQkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFbEYsSUFBSyxVQUFVLEtBQUssU0FBUyxFQUFHO2NBQy9CLElBQUksT0FBTyxlQUFlLEtBQUssV0FBVyxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZFLElBQUksYUFBYSxHQUFHLGVBQWUsQ0FBQyxNQUFNO2dCQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtrQkFDNUMsSUFBSSxPQUFPLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7b0JBQy9JLGVBQWUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQztrQkFDL0I7Z0JBQ0Q7Z0JBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxlQUFnQixDQUFFLENBQUM7Z0JBRWpFLENBQUMsQ0FBRSxpQ0FBa0MsQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdGLENBQUMsQ0FBRSwwREFBMkQsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLENBQUMsTUFBTyxDQUFDO2dCQUM5RixDQUFDLENBQUUscUVBQXNFLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZSxDQUFDLE1BQU8sQ0FBQztnQkFDekcsQ0FBQyxDQUFFLCtDQUErQyxHQUFHLFdBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7Z0JBQzFGLElBQU0sQ0FBRSxlQUFlLENBQUMsTUFBTSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDLENBQUMsTUFBTSxFQUFHO2tCQUMxRyxDQUFDLENBQUUsK0JBQWdDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztrQkFDNUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUk7Z0JBQ2xDO2NBQ0Q7WUFFRDtZQUNBLElBQUssVUFBVSxLQUFLLFNBQVMsRUFBRztjQUMvQixJQUFJLE9BQU8sbUJBQW1CLEtBQUssV0FBVyxJQUFJLG1CQUFtQixLQUFLLElBQUksRUFBRTtnQkFDL0UsSUFBSSxlQUFhLEdBQUcsbUJBQW1CLENBQUMsTUFBTTtnQkFDOUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxlQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2tCQUN4QyxJQUFJLE9BQU8sbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFdBQVcsRUFBRTtvQkFDM0osbUJBQW1CLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUM7a0JBQ25DO2dCQUNEO2dCQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsbUJBQW9CLENBQUUsQ0FBQztnQkFDckUsQ0FBQyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixHQUFHLFdBQVcsR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0YsQ0FBQyxDQUFFLDBEQUEyRCxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFtQixDQUFDLE1BQU8sQ0FBQztnQkFDbEcsQ0FBQyxDQUFFLG9FQUFxRSxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFtQixDQUFDLE1BQU8sQ0FBQztnQkFDNUcsQ0FBQyxDQUFFLCtDQUErQyxHQUFHLFdBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7Z0JBRTFGLElBQU8sQ0FBRSxtQkFBbUIsQ0FBQyxNQUFNLElBQUksbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQyxDQUFDLE1BQU0sRUFBRztrQkFDbkgsQ0FBQyxDQUFFLCtCQUFnQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7a0JBQzVDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJO2dCQUNsQztjQUNEO1lBQ0Q7WUFFQSxJQUFLLE9BQU8sS0FBSyxTQUFTLEVBQUc7Y0FDNUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUk7WUFDbEM7WUFFQSxJQUFLLGVBQWUsRUFBRztjQUN0QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1QjtVQUVEO1FBQ0QsQ0FBQyxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUUsNkJBQThCLENBQUMsQ0FBQyxNQUFNLEVBQUU7VUFDbkcsSUFBSSxFQUFFLEdBQWEsTUFBTSxDQUFDLE9BQU8sQ0FBRSxnQkFBaUIsQ0FBQztZQUNwRCxLQUFLLEdBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBRSwwQkFBMkIsQ0FBQztZQUN2RCxPQUFPLEdBQVEsS0FBSyxDQUFDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztZQUMvQyxZQUFZLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUM7VUFDcEMsTUFBTSxDQUFDLFdBQVcsQ0FBRSxPQUFRLENBQUM7VUFDN0IsRUFBRSxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1VBQ3BDLElBQUssT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUMzQixDQUFDLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEdBQUcsWUFBWSxHQUFHLElBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFGLElBQUssQ0FBRSxDQUFDLENBQUUsc0VBQXVFLENBQUMsQ0FBQyxNQUFNLEVBQUc7Y0FDM0YsQ0FBQyxDQUFFLHFDQUFzQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQ7VUFDRDtRQUNEO01BQ0QsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxxQkFBcUIsRUFDckIsTUFBTSxFQUNOLFVBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUc7UUFDMUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFFLG1HQUFvRyxDQUFDO1FBRXRILENBQUMsQ0FBQyxXQUFXLENBQUUsU0FBVSxDQUFDO1FBQzFCLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7VUFDekIsQ0FBQyxDQUFFLHNCQUF1QixDQUFDLENBQUMsT0FBTyxDQUFFLE9BQVEsQ0FBQztRQUMvQyxDQUFDLE1BQU07VUFDTixPQUFPLENBQUMsT0FBTyxDQUNkLEdBQUcsRUFDSCxZQUFZO1lBQ1gsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxPQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUNsRixDQUNELENBQUM7UUFDRjtNQUNELENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF5QixDQUFDO01BQzFFO01BQ0k7O01BRUosSUFBSyxjQUFjLElBQUksTUFBTSxJQUFLLE1BQU0sQ0FBQyxhQUFhLElBQUksUUFBUSxZQUFZLGFBQWMsRUFBRTtRQUM3RixJQUFJLG1CQUFtQjtRQUN2QixDQUFDLENBQUMsRUFBRSxDQUNILFlBQVksRUFDWixxRkFBcUYsRUFDckYsVUFBVSxDQUFDLEVBQUU7VUFDWixtQkFBbUIsR0FBRyxLQUFLO1FBQzVCLENBQ0QsQ0FBQztRQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsV0FBVyxFQUNYLHFGQUFxRixFQUNyRixVQUFVLENBQUMsRUFBRTtVQUNaLG1CQUFtQixHQUFHLElBQUk7UUFDM0IsQ0FDRCxDQUFDO1FBRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxVQUFVLEVBQ1YsOElBQThJLEVBQzlJLFVBQVUsQ0FBQyxFQUFFO1VBQ1osSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQztVQUNwRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUUsbUJBQW9CLENBQUMsRUFBRTtZQUN6QyxJQUFLLENBQUUsbUJBQW1CLEVBQUU7Y0FDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSx3QkFBeUIsQ0FBQyxFQUFFLENBQUUsQ0FBQztZQUN2RTtVQUNELENBQUMsTUFBTTtZQUNOLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUUsSUFBSSxFQUFFLENBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFFLG1CQUFvQixDQUFDO1VBQ3JDO1FBQ0QsQ0FDRCxDQUFDO1FBRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxVQUFVLEVBQ1YsZ0dBQWdHLEVBQ2hHLFVBQVUsQ0FBQyxFQUFFO1VBQ1osSUFBSSxDQUFDLENBQUUsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbkUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSx3QkFBeUIsQ0FBQyxFQUFFLENBQUUsQ0FBQztVQUN2RTtRQUNELENBQ0QsQ0FBQztRQUNEO1FBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxVQUFVLEVBQ1YsaUZBQWlGLEVBQ2pGLFVBQVMsRUFBRSxFQUFFO1VBQ1osRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7VUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ25CLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1VBQzNDLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQztNQUNGLENBQUMsTUFBTTtRQUNOLENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHVFQUF1RSxFQUN2RSxVQUFVLEVBQUUsRUFBRTtVQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsWUFBWSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBVSxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDO1VBQzdJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBRSxJQUFJLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFFLENBQUM7VUFDbkUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUUsSUFBSyxDQUFDO1VBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUUsWUFBYSxDQUFDO1VBQ2hDLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQztRQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLFVBQVUsRUFBRSxFQUFFO1VBQ2IsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLHVFQUF1RSxDQUFDO1VBQzNGLElBQUksUUFBUSxLQUFLLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBRSxRQUFRLENBQUMsR0FBRyxDQUFFLEVBQUUsQ0FBQyxNQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDakUsQ0FBQyxDQUFFLHlCQUEwQixDQUFDLENBQUMsV0FBVyxDQUFFLFlBQWEsQ0FBQztVQUMzRDtRQUNELENBQ0QsQ0FBQztRQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsV0FBVyxFQUNYLG1FQUFtRSxFQUNuRSxVQUFVLEVBQUUsRUFBRTtVQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsUUFBUSxDQUFFLFlBQWEsQ0FBQztVQUNsQyxPQUFPLEtBQUs7UUFDYixDQUNELENBQUM7UUFDRCxDQUFDLENBQUMsRUFBRSxDQUNILFVBQVUsRUFDVixtRUFBbUUsRUFDbkUsVUFBVSxFQUFFLEVBQUU7VUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztVQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbkIsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBRSxZQUFhLENBQUM7VUFDckMsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO1FBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxXQUFXLEVBQ1gsdUVBQXVFLEVBQ3ZFLFVBQVUsRUFBRSxFQUFFO1VBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7VUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ25CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSxZQUFZLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUM7VUFDN0ksQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBRSxZQUFhLENBQUM7VUFDbEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUUsQ0FBQztVQUNuRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBRSxJQUFLLENBQUM7VUFFeEMsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO1FBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxVQUFVLEVBQ1YsdUVBQXVFLEVBQ3ZFLFVBQVUsRUFBRSxFQUFFO1VBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7VUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ25CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSxZQUFZLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUUsQ0FBQztVQUMxRCxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsV0FBVyxDQUFFLFlBQWEsQ0FBQztVQUNyQyxPQUFPLEtBQUs7UUFDYixDQUNELENBQUM7UUFFRCxDQUFDLENBQUUsdUVBQXdFLENBQUMsQ0FBQyxXQUFXLENBQ3ZGO1VBQ0MsUUFBUSxFQUFFLENBQUM7VUFDWCxPQUFPLEVBQUUsR0FBRztVQUNaLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7VUFDbkMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQ0QsQ0FBQztNQUNGO01BQ0E7TUFFSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO01BRW5DLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7TUFFaEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7TUFFMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztNQUVuQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO01BRXBDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO01BRXpCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO01BRTVCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO01BRXhCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO01BRXhCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7TUFFN0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztNQUV6QyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pDLENBQ0QsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxZQUFhLENBQUM7O0lBRXpCOztJQUVGLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FDWCxFQUFFLENBQUUsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBYSxDQUFDLENBQzVELEVBQUUsQ0FBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFhLENBQUMsQ0FDakUsRUFBRSxDQUFFLHlDQUF5QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQWEsQ0FBQyxDQUN4RSxFQUFFLENBQUUseUNBQXlDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBYSxDQUFDLENBQ3hFLEVBQUUsQ0FBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBYSxDQUFDO0lBQ2hEO0lBQ0EsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFlLENBQUM7SUFDaEQ7SUFDQSxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUFFLGlCQUFpQixFQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWUsQ0FBQztJQUNqRTtJQUNBLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxFQUFFLENBQUUsc0JBQXNCLEVBQUUsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFHO01BQ25FLElBQUssVUFBVSxFQUFHO1FBQ2pCLENBQUMsQ0FBQywrQkFBK0IsR0FBRyxVQUFVLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUMvRTtJQUNELENBQUMsQ0FBQztJQUNGO0lBR0EsSUFBSSxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsQ0FDbEMsVUFBUyxTQUFTLEVBQUU7TUFDbkIsU0FBUyxDQUFDLE9BQU8sQ0FDaEIsVUFBUyxRQUFRLEVBQUU7UUFDbEIsSUFBSyxDQUFDLENBQUUsMkRBQTRELENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1VBQ2xGLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDL0M7UUFDQTtRQUNBLElBQUssQ0FBQyxDQUFFLHlEQUEwRCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUUseURBQTBELENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1VBQzdKLENBQUMsQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FDN0IsWUFBVztZQUNWLElBQUksZ0JBQWdCLEdBQU0sQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQztZQUNqRSxJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsdUJBQXdCLENBQUM7WUFDbkUsSUFBSyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Y0FDbkUsZ0JBQWdCLENBQUMsUUFBUSxDQUFFLG1CQUFvQixDQUFDO1lBQ2pEO1VBQ0QsQ0FDRCxDQUFDO1FBQ0Y7TUFDRCxDQUNELENBQUM7SUFDRixDQUNELENBQUM7SUFDRCxRQUFRLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUFFLFNBQVMsRUFBRSxJQUFJO01BQUUsT0FBTyxFQUFFO0lBQUssQ0FBRSxDQUFDO0lBQ3RFOztJQUVFOztJQUVGLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxFQUFFLENBQ2IsZUFBZSxFQUNmLFlBQVc7TUFDVixDQUFDLENBQUUseUJBQTBCLENBQUMsQ0FBQyxJQUFJLENBQ2xDLFlBQVc7UUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBRSxDQUFDLENBQUUsSUFBSyxDQUFFLENBQUM7TUFDOUMsQ0FDRCxDQUFDO0lBQ0YsQ0FDRCxDQUFDO0lBQ0Q7O0lBRUU7O0lBRUYsSUFBSSx1QkFBdUIsR0FBRyxJQUFJO01BQ2pDLGlCQUFpQixHQUFTLFVBQVUsQ0FBQyxpQkFBaUI7TUFDdEQsaUJBQWlCLEdBQUssaUJBQWlCLEdBQUcsV0FBVztNQUNyRCxpQkFBaUIsR0FBSyxpQkFBaUIsR0FBRyxXQUFXO01BQ3JELGFBQWEsR0FBSyxpQkFBaUIsR0FBRyxPQUFPO0lBRTlDLElBQUk7TUFDSCx1QkFBdUIsR0FBSyxnQkFBZ0IsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLGNBQWMsS0FBSyxJQUFNO01BQzFGLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFFLE9BQU8sRUFBRSxNQUFPLENBQUM7TUFDaEQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUUsT0FBUSxDQUFDO01BQzNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFFLE9BQU8sRUFBRSxNQUFPLENBQUM7TUFDOUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUUsT0FBUSxDQUFDO0lBQzFDLENBQUMsQ0FBQyxPQUFRLEdBQUcsRUFBRztNQUNmLHVCQUF1QixHQUFHLEtBQUs7SUFDaEM7SUFFQSxJQUFLLFVBQVUsQ0FBQyxnQkFBZ0IsSUFBSSxVQUFVLENBQUMscUJBQXFCLEVBQUc7TUFDdEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekI7O0lBRUE7SUFDQSxJQUFLLHVCQUF1QixFQUFHO01BRTlCO01BQ0EsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FDYixtQkFBbUIsRUFDbkIsVUFBVyxDQUFDLEVBQUc7UUFDZCxJQUFPLGlCQUFpQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUMsS0FBSyxjQUFjLENBQUMsT0FBTyxDQUFFLGlCQUFrQixDQUFDLElBQzFJLGlCQUFpQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUMsS0FBSyxjQUFjLENBQUMsT0FBTyxDQUFFLGlCQUFrQixDQUFHLEVBQUc7VUFDN0ksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUI7TUFDRCxDQUNELENBQUM7O01BRUQ7TUFDQSxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsRUFBRSxDQUNiLFVBQVUsRUFDVixVQUFVLENBQUMsRUFBRztRQUNiLElBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUc7VUFDaEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUI7TUFDRCxDQUNELENBQUM7TUFFRCxJQUFJO1FBRUgsSUFBSyxVQUFVLENBQUMsZ0JBQWdCLEVBQUc7VUFDbEMsTUFBTSwyQkFBMkI7UUFDbEM7UUFDQSxJQUFLLFVBQVUsQ0FBQyxxQkFBcUIsSUFBTSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxZQUFZLENBQUMsT0FBTyxDQUFFLGFBQWMsQ0FBRyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFFLGNBQWUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFFLGNBQWUsQ0FBQyxFQUFHO1VBQ2xSLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUUsRUFBRyxDQUFDO1VBQzdDLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUUsRUFBRyxDQUFDO1VBQzdDLFlBQVksQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLEVBQUcsQ0FBQztVQUN6QyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUUsY0FBZSxDQUFDO1VBQzNDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFFLGNBQWUsQ0FBQztVQUNwRCxNQUFNLDJCQUEyQjtRQUNsQztRQUVBLElBQUssWUFBWSxDQUFDLE9BQU8sQ0FBRSxpQkFBa0IsQ0FBQyxFQUFHO1VBQ2hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBRSxpQkFBa0IsQ0FBRSxDQUFDO1VBQ2xFLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBRSxJQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFHO1lBQ25ELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBRSxJQUFLLENBQUM7VUFDbEM7UUFDRDtRQUVBLElBQUssWUFBWSxDQUFDLE9BQU8sQ0FBRSxpQkFBa0IsQ0FBQyxFQUFHO1VBQ2hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBRSxpQkFBa0IsQ0FBRSxDQUFDO1VBQ2xFLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBRSxJQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFHO1lBQ25ELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFFLElBQUssQ0FBQztVQUMzQztRQUNEO1FBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRSxvRUFBcUUsQ0FBRSxDQUFDO1FBRS9GLENBQUMsQ0FBRSxtQ0FBb0MsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxlQUFnQixDQUFDO01BRXJFLENBQUMsQ0FBQyxPQUFRLEdBQUcsRUFBRztRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUUsR0FBSSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO01BQzVCO0lBRUQsQ0FBQyxNQUFNO01BQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUI7SUFDQTtJQUdBLElBQUksbUJBQW1CLEdBQ3RCLFdBQVcsS0FBSyxPQUFPLEVBQUUsSUFDekIsRUFBRSxDQUFDLFNBQVMsSUFDWixFQUFFLENBQUMsU0FBUyxDQUFDLGdCQUFnQixJQUM3QixFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsSUFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsYUFDNUI7SUFDRCxJQUFLLG1CQUFtQixFQUFHO01BQzFCLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUNqQywwQkFBMEIsRUFDMUIsWUFBVztRQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO01BQzVCLENBQ0QsQ0FBQztJQUNGO0lBQ0E7RUFFQyxDQUFDLENBQUM7QUFDSCxDQUFDLEVBQUUsTUFBTSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBNYWluIFNtYXJ0IFdvb0NvbW1lcmNlIFdpc2hsaXN0IEpTXG4gKlxuICogQGF1dGhvciBNb3JlQ29udmVydFxuICogQHBhY2thZ2UgU21hcnQgV2lzaGxpc3QgRm9yIE1vcmUgQ29udmVydFxuICpcbiAqIEB2ZXJzaW9uIDEuOC40XG4gKi9cblxuLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbihmdW5jdGlvbiAoJCkge1xuXHQkLm5vQ29uZmxpY3QoKTtcblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXHRcdC8qID09PSBNQUlOIElOSVQgPT09ICovXG5cdFx0dmFyIHByb2R1Y3RfaW5fbGlzdCAgICAgPSBbXSAsXG5cdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0ID0gW10gLFxuXHRcdFx0bGFuZyAgICAgICAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFuZyxcblx0XHRcdHJlbW92ZV9pdGVtX3VybCAgICAgPSBudWxsLFxuXHRcdFx0d2lzaGxpc3RfaXRlbXMgICAgICA9IHdsZm1jX2wxMG4ud2lzaGxpc3RfaXRlbXMsXG5cdFx0XHR3YWl0bGlzdF9pdGVtcyAgICAgID0gd2xmbWNfbDEwbi53YWl0bGlzdF9pdGVtcyxcblx0XHRcdHByb2R1Y3RfYWRkaW5nICAgICAgPSBmYWxzZSxcblx0XHRcdGZyYWdtZW50eGhyLFxuXHRcdFx0ZnJhZ21lbnR0aW1lb3V0O1xuXG5cdFx0JC5mbi5XTEZNQyA9IHtcblx0aW5pdF9wcmVwYXJlX3F0eV9saW5rczogZnVuY3Rpb24gKCkge1xuXHRcdGxldCBxdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlIC5xdWFudGl0eScgKTtcblxuXHRcdGlmIChxdHkubGVuZ3RoIDwgMSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcXR5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAocXR5W2ldLmNsYXNzTGlzdC5jb250YWlucyggJ2hpZGRlbicgKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBwbHVzICA9IHF0eVtpXS5xdWVyeVNlbGVjdG9yKCAnLmJvdGlnYS1xdWFudGl0eS1wbHVzLCBhLnBsdXMsIC5jdC1pbmNyZWFzZScgKSxcblx0XHRcdFx0bWludXMgPSBxdHlbaV0ucXVlcnlTZWxlY3RvciggJy5ib3RpZ2EtcXVhbnRpdHktbWludXMsIGEubWludXMsIC5jdC1kZWNyZWFzZScgKTtcblxuXHRcdFx0aWYgKCAhIHBsdXMgfHwgISBtaW51cyB8fCBwbHVzLmxlbmd0aCA8IDEgfHwgbWludXMubGVuZ3RoIDwgMSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cGx1cy5jbGFzc0xpc3QuYWRkKCAnc2hvdycgKTtcblx0XHRcdG1pbnVzLmNsYXNzTGlzdC5hZGQoICdzaG93JyApO1xuXHRcdFx0dmFyIHBsdXNfY2xvbmUgID0gcGx1cy5jbG9uZU5vZGUoIHRydWUgKSxcblx0XHRcdFx0bWludXNfY2xvbmUgPSBtaW51cy5jbG9uZU5vZGUoIHRydWUgKTtcblx0XHRcdHBsdXNfY2xvbmUuYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0J2NsaWNrJyxcblx0XHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dmFyIGlucHV0ICAgICAgID0gdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoICcucXR5JyApLFxuXHRcdFx0XHRcdFx0dmFsICAgICAgICAgPSBwYXJzZUZsb2F0KCBpbnB1dC52YWx1ZSwgMTAgKSB8fCAwLFxuXHRcdFx0XHRcdFx0Y2hhbmdlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0hUTUxFdmVudHMnICk7XG5cblx0XHRcdFx0XHRjb25zdCBtYXhfdmFsID0gKGlucHV0LmdldEF0dHJpYnV0ZSggXCJtYXhcIiApICYmIHBhcnNlRmxvYXQoIGlucHV0LmdldEF0dHJpYnV0ZSggXCJtYXhcIiApLCAwICkpIHx8IDEgLyAwO1xuXHRcdFx0XHRcdGlucHV0LnZhbHVlICAgPSB2YWwgPCBtYXhfdmFsID8gTWF0aC5yb3VuZCggMTAwICogKHZhbCArIHBhcnNlRmxvYXQoIGlucHV0LnN0ZXAgfHwgXCIxXCIgKSkgKSAvIDEwMCA6IG1heF92YWw7XG5cblx0XHRcdFx0XHQvLyBpbnB1dC52YWx1ZSA9IGlucHV0LnZhbHVlID09PSAnJyA/IDAgOiBwYXJzZUludCggaW5wdXQudmFsdWUgKSArIDE7XG5cdFx0XHRcdFx0Y2hhbmdlRXZlbnQuaW5pdEV2ZW50KCAnY2hhbmdlJywgdHJ1ZSwgZmFsc2UgKTtcblx0XHRcdFx0XHRpbnB1dC5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHRcdG1pbnVzX2Nsb25lLmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdCdjbGljaycsXG5cdFx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciBpbnB1dCAgICAgICA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCAnLnF0eScgKSxcblx0XHRcdFx0XHRcdHZhbCAgICAgICAgID0gcGFyc2VGbG9hdCggaW5wdXQudmFsdWUsIDEwICkgfHwgMCxcblx0XHRcdFx0XHRcdGNoYW5nZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdIVE1MRXZlbnRzJyApO1xuXHRcdFx0XHRcdGNvbnN0IG1pbl92YWwgICA9IGlucHV0LmdldEF0dHJpYnV0ZSggXCJtaW5cIiApID8gTWF0aC5yb3VuZCggMTAwICogcGFyc2VGbG9hdCggaW5wdXQuZ2V0QXR0cmlidXRlKCBcIm1pblwiICksIDAgKSApIC8gMTAwIDogMDtcblx0XHRcdFx0XHRpbnB1dC52YWx1ZSAgICAgPSB2YWwgPiBtaW5fdmFsID8gTWF0aC5yb3VuZCggMTAwICogKHZhbCAtIHBhcnNlRmxvYXQoIGlucHV0LnN0ZXAgfHwgXCIxXCIgKSkgKSAvIDEwMCA6IG1pbl92YWw7XG5cblx0XHRcdFx0XHQvLyBpbnB1dC52YWx1ZSA9IHBhcnNlSW50KCBpbnB1dC52YWx1ZSApID4gMCA/IHBhcnNlSW50KCBpbnB1dC52YWx1ZSApIC0gMSA6IDA7XG5cdFx0XHRcdFx0Y2hhbmdlRXZlbnQuaW5pdEV2ZW50KCAnY2hhbmdlJywgdHJ1ZSwgZmFsc2UgKTtcblx0XHRcdFx0XHRpbnB1dC5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHRcdHF0eVtpXS5yZXBsYWNlQ2hpbGQoIHBsdXNfY2xvbmUsIHBsdXMgKTtcblx0XHRcdHF0eVtpXS5yZXBsYWNlQ2hpbGQoIG1pbnVzX2Nsb25lLCBtaW51cyApO1xuXHRcdH1cblxuXHR9LFxuXG5cdHByZXBhcmVfbWluaV93aXNobGlzdDogZnVuY3Rpb24gKGEpIHtcblx0XHRpZiAoIGEuaGFzQ2xhc3MoICdwb3NpdGlvbi1hYnNvbHV0ZScgKSApIHtcblx0XHRcdHZhciBhbyAgPSBhLm9mZnNldCgpLFxuXHRcdFx0XHRhbCAgPSBhby5sZWZ0LFxuXHRcdFx0XHRhdCAgPSBhby50b3AsXG5cdFx0XHRcdGF3ICA9IGEub3V0ZXJXaWR0aCgpLFxuXHRcdFx0XHRhaCAgPSBhLm91dGVySGVpZ2h0KCksXG5cdFx0XHRcdGxhICA9IHBhcnNlRmxvYXQoIGEuY3NzKCAnbGVmdCcgKSApLFxuXHRcdFx0XHR0YSAgPSBwYXJzZUZsb2F0KCBhLmNzcyggJ3RvcCcgKSApLFxuXHRcdFx0XHRhb2wgPSBhbCAtIGxhLFxuXHRcdFx0XHRhb3QgPSBhdCAtIHRhLFxuXHRcdFx0XHRfbGEgPSBsYSwgX3RhID0gdGEsIHd3ID0gJCggd2luZG93ICkud2lkdGgoKSwgZGggPSAkKCBkb2N1bWVudCApLmhlaWdodCgpLCBvcyA9IDUwLFxuXHRcdFx0XHRyICAgPSB3dyAtIGFvbCAtIGF3IC0gb3MsIGwgPSBvcyAtIGFvbCwgYiA9IGRoIC0gYW90IC0gYWggLSBvcztcblx0XHRcdGlmICh3dyA8PSBhdykge1xuXHRcdFx0XHRfbGEgPSAtMSAqIGFvbDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IHd3IC0gKGF3ICsgb3MgKiAyKSkge1xuXHRcdFx0XHRfbGEgPSAod3cgLSBhdykgLyAyIC0gYW9sO1xuXHRcdFx0fSBlbHNlIGlmICgwIDwgbCkge1xuXHRcdFx0XHRfbGEgPSBsO1xuXHRcdFx0fSBlbHNlIGlmICgwID4gcikge1xuXHRcdFx0XHRfbGEgPSByO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRoIDwgYWgpIHtcblx0XHRcdFx0YS5oZWlnaHQoIGRoIC0gYS5vdXRlckhlaWdodCgpICsgYS5oZWlnaHQoKSApO1xuXHRcdFx0XHRhaCA9IGEub3V0ZXJIZWlnaHQoKTtcblx0XHRcdH1cblx0XHRcdGlmIChkaCA8PSBhaCkge1xuXHRcdFx0XHRfdGEgPSAtMSAqIGFvdDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IGRoIC0gKGFoICsgb3MgKiAyKSkge1xuXHRcdFx0XHRfdGEgPSAoZGggLSBhaCkgLyAyIC0gYW90O1xuXHRcdFx0fSBlbHNlIGlmICgwID4gYikge1xuXHRcdFx0XHRfdGEgPSBiO1xuXHRcdFx0fVxuXHRcdFx0YS5jc3MoIHtsZWZ0OiBfbGEsIHRvcDogX3RhLH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHAgPSAkKCAnLndsZm1jLWNvdW50ZXItd3JhcHBlci4nICsgYS5hdHRyKCAnZGF0YS1pZCcgKSApO1xuXHRcdFx0aWYgKCB0eXBlb2YgcCAhPT0gJ3VuZGVmaW5lZCcgJiYgMCA8IHAubGVuZ3RoICkge1xuXHRcdFx0XHR2YXIgcG8gID0gcC5vZmZzZXQoKSxcblx0XHRcdFx0XHRzdCAgPSAkKCB3aW5kb3cgKS5zY3JvbGxUb3AoKSxcblx0XHRcdFx0XHRfbGEgPSBwby5sZWZ0LFxuXHRcdFx0XHRcdF90YSA9IHBvLnRvcCArIHAuaGVpZ2h0KCkgLSBzdCxcblx0XHRcdFx0XHRhdyAgPSBhLm91dGVyV2lkdGgoKSxcblx0XHRcdFx0XHR3dyAgPSAkKCB3aW5kb3cgKS53aWR0aCgpO1xuXG5cdFx0XHRcdGlmIChfbGEgKyBhdyA+IHd3KSB7XG5cdFx0XHRcdFx0X2xhID0gd3cgLSBhdyAtIDIwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuY3NzKCB7bGVmdDogX2xhICwgdG9wOiBfdGEgfSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9LFxuXG5cdGFwcGVuZHRvQm9keTogZnVuY3Rpb24gKGVsZW0pIHtcblx0XHRpZiAoICEgZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLnBvc2l0aW9uLWZpeGVkJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHZhciBjb3VudGVyX3R5cGUgPSBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1pdGVtcycgKS5oYXNDbGFzcyggJ3dsZm1jLWxpc3RzLWNvdW50ZXItZHJvcGRvd24nICkgPyAnd2xmbWMtcHJlbWl1bS1saXN0LWNvdW50ZXInIDogKGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuaGFzQ2xhc3MoICd3bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXInICkgPyAnd2xmbWMtd2FpdGxpc3QtY291bnRlcicgOiAnd2xmbWMtd2lzaGxpc3QtY291bnRlcicpO1xuXHRcdGlmICggZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtd2lzaGxpc3QtY291bnRlcicgKS5sZW5ndGggPiAwIHx8IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXdhaXRsaXN0LWNvdW50ZXInICkubGVuZ3RoID4gMCB8fCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy1wcmVtaXVtLWxpc3QtY291bnRlcicgKS5sZW5ndGggPiAwICApIHtcblx0XHRcdHZhciB3aWRnZXRJZCAgPSBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy13aXNobGlzdC1jb3VudGVyJyApLmRhdGEoIFwiaWRcIiApIHx8IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXdhaXRsaXN0LWNvdW50ZXInICkuZGF0YSggXCJpZFwiICkgfHwgZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtcHJlbWl1bS1saXN0LWNvdW50ZXInICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHR2YXIgZWxlbWVudElkID0gZWxlbS5jbG9zZXN0KCAnW2RhdGEtZWxlbWVudG9yLWlkXScgKS5kYXRhKCBcImVsZW1lbnRvci1pZFwiICk7XG5cdFx0XHR2YXIgZWxlbWVudG9yID0gXCI8ZGl2IGNsYXNzPSd3bGZtYy1lbGVtZW50b3IgZWxlbWVudG9yIGVsZW1lbnRvci1cIiArIGVsZW1lbnRJZCArIFwiIFwiICsgY291bnRlcl90eXBlICsgXCInPjxkaXYgY2xhc3M9J2VsZW1lbnRvci1lbGVtZW50IGVsZW1lbnRvci1lbGVtZW50LVwiICsgd2lkZ2V0SWQgKyBcIic+PC9kaXY+PC9kaXY+XCI7XG5cdFx0XHQkKCBlbGVtZW50b3IgKS5hcHBlbmRUbyggXCJib2R5XCIgKTtcblx0XHRcdCQoIFwiLndsZm1jLWVsZW1lbnRvci5lbGVtZW50b3ItXCIgKyBlbGVtZW50SWQgKyBcIiAuZWxlbWVudG9yLWVsZW1lbnQtXCIgKyB3aWRnZXRJZCApLmFwcGVuZCggZWxlbSApO1xuXG5cdFx0fSBlbHNlIGlmICggISBlbGVtLmNsb3Nlc3QoICcud2xmbWMtZWxlbWVudG9yJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgd2lkZ2V0SWQgID0gZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLWNvdW50ZXItaXRlbXMnICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHR2YXIgZWxlbWVudG9yID0gXCI8ZGl2IGNsYXNzPSd3bGZtYy1lbGVtZW50b3Igbm8tZWxlbWVudG9yLVwiICsgd2lkZ2V0SWQgKyBcIiBcIiArIGNvdW50ZXJfdHlwZSArIFwiJz48L2Rpdj5cIjtcblx0XHRcdCQoIGVsZW1lbnRvciApLmFwcGVuZFRvKCBcImJvZHlcIiApO1xuXHRcdFx0JCggXCIud2xmbWMtZWxlbWVudG9yLm5vLWVsZW1lbnRvci1cIiArIHdpZGdldElkICkuYXBwZW5kKCBlbGVtICk7XG5cdFx0fVxuXG5cdH0sXG5cblx0c2hvd19taW5pX3dpc2hsaXN0OiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApLnJlbW92ZUNsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdHZhciBlbGVtID0gJCggJy5kcm9wZG93bl8nICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWlkJyApICkgfHwgJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKTtcblx0XHQkLmZuLldMRk1DLmFwcGVuZHRvQm9keSggZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKSApO1xuXHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cdFx0ZWxlbS5hZGRDbGFzcyggJ2xpc3RzLXNob3cnICk7XG5cblx0fSxcblxuXHRoaWRlX21pbmlfd2lzaGxpc3Q6IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBlbGVtID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKTtcblx0XHQkKCAnLndsZm1jLWZpcnN0LXRvdWNoJyApLnJlbW92ZUNsYXNzKCAnd2xmbWMtZmlyc3QtdG91Y2gnICk7XG5cdFx0JCggJy53bGZtYy1maXJzdC1jbGljaycgKS5yZW1vdmVDbGFzcyggJ3dsZm1jLWZpcnN0LWNsaWNrJyApO1xuXHRcdGVsZW0ucmVtb3ZlQ2xhc3MoICdsaXN0cy1zaG93JyApO1xuXG5cdH0sXG5cblx0cmVJbml0X3dsZm1jOiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd2xmbWNfaW5pdCcgKTtcblx0fSxcblxuXHQvKipcblx0ICogSGFuZGxlIERyYWcgJiBEcm9wIG9mIGl0ZW1zIGZvciBzb3J0aW5nXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKiBAc2luY2UgMS42Ljhcblx0ICovXG5cdGluaXRfZHJhZ19uX2Ryb3A6IGZ1bmN0aW9uICgpIHtcblxuXHRcdCQoICd0YWJsZS53bGZtYy13aXNobGlzdC1pdGVtcy13cmFwcGVyJyApLmZpbHRlciggJy5zb3J0YWJsZScgKS5ub3QoICcubm8taW50ZXJhY3Rpb25zJyApLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ID0gJCggdGhpcyApLFxuXHRcdFx0XHRqcXhociA9IGZhbHNlO1xuXG5cdFx0XHRcdHQuc29ydGFibGUoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aXRlbXM6ICcud2xmbWMtdGFibGUtaXRlbVtkYXRhLXJvdy1pZF0nLFxuXHRcdFx0XHRcdFx0aGFuZGxlOiBcIi5zb3J0YWJsZS1oYW5kbGVcIixcblx0XHRcdFx0XHRcdHBsYWNlaG9sZGVyOiBcInVpLXNvcnRhYmxlLXBsYWNlaG9sZGVyXCIsXG5cdFx0XHRcdFx0XHRzY3JvbGw6IHRydWUsXG5cdFx0XHRcdFx0XHRzY3JvbGxTZW5zaXRpdml0eTogNDAsXG5cdFx0XHRcdFx0XHR0b2xlcmFuY2UgOiBcInBvaW50ZXJcIixcblx0XHRcdFx0XHRcdGhlbHBlcjogZnVuY3Rpb24gKCBlLCB1aSApIHtcblx0XHRcdFx0XHRcdFx0dWkuY2hpbGRyZW4oKS5lYWNoKFxuXHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlbGVtcyA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndpc2hsaXN0LWl0ZW1zLXdyYXBwZXInICkuZmluZCggJy5zaG93LW1ldGEtZGF0YScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggZWxlbXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbGVtcy5yZW1vdmVDbGFzcyggJ3Nob3ctbWV0YS1kYXRhJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbXMgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53aXNobGlzdC1pdGVtcy13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtcm93LW1ldGEtZGF0YScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggZWxlbXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxlbXMuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHVpO1xuXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0dXBkYXRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJvdyA9IHQuZmluZCggJ1tkYXRhLXJvdy1pZF0nICksXG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9ucyAgID0gW10sXG5cdFx0XHRcdFx0XHRcdGkgICAgICAgICAgID0gMDtcblxuXHRcdFx0XHRcdFx0XHRpZiAoICEgcm93Lmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoIGpxeGhyICkge1xuXHRcdFx0XHRcdFx0XHRcdGpxeGhyLmFib3J0KCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyb3cuZWFjaChcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgdCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0dC5maW5kKCAnaW5wdXRbbmFtZSo9XCJbcG9zaXRpb25dXCJdJyApLnZhbCggaSsrICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9ucy5wdXNoKCB0LmRhdGEoICdyb3ctaWQnICkgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVsZW1lbnRzID0gdC5jbG9zZXN0KCAnLndpc2hsaXN0LWl0ZW1zLXdyYXBwZXInICkuZmluZCggJy5wYXJlbnQtcm93LWlkLScgKyB0LmRhdGEoICdyb3ctaWQnICkgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBlbGVtZW50cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0LmFmdGVyKCBlbGVtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdFx0anF4aHIgPSAkLmFqYXgoXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5zb3J0X3dpc2hsaXN0X2l0ZW1zLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0gdGFibGUud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb25zOiBwb3NpdGlvbnMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHQuZGF0YSggJ3Rva2VuJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBhZ2U6IHQuZGF0YSggJ3BhZ2UnICksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cGVyX3BhZ2U6IHQuZGF0YSggJ3Blci1wYWdlJyApXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0LyogPT09IFRvb2x0aXAgPT09ICovXG5cdGluaXRfdG9vbHRpcDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB3bGZtY190b29sdGlwID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGluc3RhbmNlO1xuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdFx0dGhpcy5pZFNlbGVjdG9yICA9ICd3bGZtYy10b29sdGlwJztcblx0XHRcdHRoaXMudGV4dCAgICAgICAgPSAnJztcblx0XHRcdHRoaXMudG9wICAgICAgICAgPSAwO1xuXHRcdFx0dGhpcy5sZWZ0ICAgICAgICA9IDA7XG5cdFx0XHR0aGlzLmRpcmVjdGlvbiAgID0gdHlwZW9mIHRoaXMuZGlyZWN0aW9uICE9PSAndW5kZWZpbmVkJyA/IHRoaXMuZGlyZWN0aW9uIDogJ2JvdHRvbSc7XG5cdFx0XHR0aGlzLnRfdHlwZSAgICAgID0gdHlwZW9mIHRoaXMudF90eXBlICE9PSAndW5kZWZpbmVkJyA/IHRoaXMudF90eXBlIDogJ2RlZmF1bHQnO1xuXHRcdFx0dGhpcy50YXJnZXQgICAgICA9ICcnO1xuXHRcdFx0dGhpcy5oaWRlVGltZW91dCA9IG51bGw7XG5cblx0XHRcdC8vIENyZWF0ZSBhY3R1YWwgZWxlbWVudCBhbmQgdGllIGVsZW1lbnQgdG8gb2JqZWN0IGZvciByZWZlcmVuY2UuXG5cdFx0XHR0aGlzLm5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggdGhpcy5pZFNlbGVjdG9yICk7XG5cblx0XHRcdGlmICggISB0aGlzLm5vZGUgKSB7XG5cdFx0XHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0XHRcdFx0dGhpcy5ub2RlLnNldEF0dHJpYnV0ZSggXCJpZFwiLCB0aGlzLmlkU2VsZWN0b3IgKTtcblx0XHRcdFx0dGhpcy5ub2RlLmNsYXNzTmFtZSA9IHRoaXMubm9kZS5jbGFzc05hbWUgKyBcInRvb2x0aXBfX2hpZGRlblwiO1xuXHRcdFx0XHR0aGlzLm5vZGUuaW5uZXJIVE1MID0gdGhpcy50ZXh0O1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0aGlzLm5vZGUgKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc2hvdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8gUmVyZW5kZXIgdG9vbHRpcC5cblxuXHRcdFx0XHR2YXIgbG9jYXRpb25fb3JkZXIgPSBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddO1xuXG5cdFx0XHRcdF9zZWxmLm5vZGUuaW5uZXJIVE1MID0gX3NlbGYudGV4dDtcblx0XHRcdFx0dmFyIGRpcmVjdGlvbiAgICAgICAgPSBfc2VsZi5kaXJlY3Rpb247XG5cdFx0XHRcdHZhciB0X3R5cGUgICAgICAgICAgID0gX3NlbGYudF90eXBlO1xuXHRcdFx0XHRpZiAoZGlyZWN0aW9uKSB7XG5cdFx0XHRcdFx0JCggdGhpcy5ub2RlICkuYWRkQ2xhc3MoICd0b29sdGlwX19leHBhbmRlZCB0b29sdGlwX19leHBhbmRlZC0nICsgZGlyZWN0aW9uICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JCggdGhpcy5ub2RlICkuYWRkQ2xhc3MoICd0b29sdGlwX19leHBhbmRlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKCB0aGlzLm5vZGUgKS5hZGRDbGFzcyggJ3dsZm1jLXRvb2x0aXAtJyArIHRfdHlwZSApO1xuXG5cdFx0XHRcdCQoIHRoaXMubm9kZSApLnJlbW92ZUNsYXNzKCAndG9vbHRpcF9faGlkZGVuJyApO1xuXG5cdFx0XHRcdGlmIChvZmZzY3JlZW4oICQoIHdsZm1jVG9vbHRpcC5ub2RlICkgKSkge1xuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9IGxvY2F0aW9uX29yZGVyW2xvY2F0aW9uX29yZGVyLmluZGV4T2YoIHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gKSArIDFdO1xuXHRcdFx0XHRcdG1vdmVUaXAoIHdsZm1jVG9vbHRpcC5ub2RlLCB3bGZtY1Rvb2x0aXAudGFyZ2V0ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQvLyBIaWRlIHRvb2x0aXAuXG5cdFx0XHRcdC8vIEhpZGUgdG9vbHRpcC5cblx0XHRcdFx0aWYgKF9zZWxmLmhpZGVUaW1lb3V0KSB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCBfc2VsZi5oaWRlVGltZW91dCApO1xuXHRcdFx0XHRcdF9zZWxmLmhpZGVUaW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKCBfc2VsZi5ub2RlICkuY3NzKCAndG9wJywgJzAnICk7XG5cdFx0XHRcdCQoIF9zZWxmLm5vZGUgKS5jc3MoICdsZWZ0JywgJzAnICk7XG5cdFx0XHRcdCQoIF9zZWxmLm5vZGUgKS5hdHRyKCAnY2xhc3MnLCAnJyApO1xuXHRcdFx0XHQkKCBfc2VsZi5ub2RlICkuYWRkQ2xhc3MoICd0b29sdGlwX19oaWRkZW4nICk7XG5cdFx0XHR9O1xuXG5cdFx0fTtcblx0XHQvLyBNb3ZlIHRpcCB0byBwcm9wZXIgbG9jYXRpb24gYmVmb3JlIGRpc3BsYXkuXG5cdFx0dmFyIG9mZnNjcmVlbiA9IGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0cmV0dXJuICgoZWwub2Zmc2V0TGVmdCArIGVsLm9mZnNldFdpZHRoKSA8IDAgfHwgKGVsLm9mZnNldFRvcCArIGVsLm9mZnNldEhlaWdodCkgPCAwIHx8IChlbC5vZmZzZXRMZWZ0ICsgZWwub2Zmc2V0V2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCB8fCBlbC5vZmZzZXRUb3AgKyBlbC5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpKTtcblx0XHR9O1xuXHRcdHZhciBtb3ZlVGlwICAgPSBmdW5jdGlvbiAoZWxsLCB0YXJnZXQpIHtcblxuXHRcdFx0dmFyICR0YXJnZXQgPSAkKCB0YXJnZXQgKTtcblx0XHRcdHZhciAkZWxsICAgID0gJCggZWxsICk7XG5cdFx0XHR2YXIgYm9keSAgICA9ICQoIFwiYm9keVwiICkub2Zmc2V0KCk7XG5cdFx0XHQkKCBcImJvZHlcIiApLmNzcyggeydwb3NpdGlvbic6ICdyZWxhdGl2ZSd9ICk7XG5cblx0XHRcdC8vIGZpeCAkZWxsIHNpemUgYWZ0ZXIgY2hhbmdlIG5ldyB0b29sdGlwIHRleHQuXG5cdFx0XHR3bGZtY1Rvb2x0aXAuc2hvdygpO1xuXHRcdFx0d2xmbWNUb29sdGlwLmhpZGUoKTtcblxuXHRcdFx0dmFyIGJ1dSA9IDc7IC8vIERlZmF1bHQgcGFkZGluZyBzaXplIGluIHB4LlxuXHRcdFx0Ly8gdmFyIGNlbnRlcl9oZWlnaHQgPSAtKCRlbGwub3V0ZXJIZWlnaHQoKSAvIDIpIC8gMjtcblx0XHRcdHZhciBjZW50ZXJfaGVpZ2h0ID0gKCgkdGFyZ2V0Lm91dGVySGVpZ2h0KCkgLSAkZWxsLm91dGVySGVpZ2h0KCkgKSAvIDIpO1xuXHRcdFx0dmFyIGNlbnRlcl93aWR0aCAgPSAtKCRlbGwub3V0ZXJXaWR0aCgpIC8gMikgKyAkdGFyZ2V0Lm91dGVyV2lkdGgoKSAvIDI7XG5cblx0XHRcdHZhciBsb2NhdGlvbnMgICAgICA9IHtcblx0XHRcdFx0J3RvcCc6IFstJGVsbC5vdXRlckhlaWdodCgpIC0gYnV1LCBjZW50ZXJfd2lkdGhdLFxuXHRcdFx0XHQncmlnaHQnOiBbY2VudGVyX2hlaWdodCwgJHRhcmdldC5vdXRlcldpZHRoKCkgKyBidXVdLFxuXHRcdFx0XHQnYm90dG9tJzogWyR0YXJnZXQub3V0ZXJIZWlnaHQoKSArIGJ1dSwgY2VudGVyX3dpZHRoXSxcblx0XHRcdFx0J2xlZnQnOiBbY2VudGVyX2hlaWdodCwgLSRlbGwub3V0ZXJXaWR0aCgpIC0gYnV1XVxuXHRcdFx0fTtcblx0XHRcdHZhciBsb2NhdGlvbl9vcmRlciA9IFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J107XG5cdFx0XHR2YXIgbG9jYXRpb25fa2V5cyAgPSBPYmplY3Qua2V5cyggbG9jYXRpb25zICk7XG5cdFx0XHRpZiAod2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9PT0gJ3RvcCcgfHwgd2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9PT0gJ2JvdHRvbScpIHtcblx0XHRcdFx0JGVsbC5jc3MoICd0b3AnLCAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIChib2R5LnRvcCkgKyBsb2NhdGlvbnNbd2xmbWNUb29sdGlwLmRpcmVjdGlvbl1bMF0gKTtcblx0XHRcdFx0JGVsbC5jc3MoICdsZWZ0JywgJHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gKGJvZHkubGVmdCkgKyAoYnV1IC8gMikgKyBsb2NhdGlvbnNbd2xmbWNUb29sdGlwLmRpcmVjdGlvbl1bMV0gKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gJGVsbC5jc3MoICd0b3AnLCAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIChib2R5LnRvcCkgKyAoYnV1IC8gMikgKyBsb2NhdGlvbnNbd2xmbWNUb29sdGlwLmRpcmVjdGlvbl1bMF0gKTtcblx0XHRcdFx0dmFyIHRvcCA9IGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVswXSAtIChidXUgLyAyKTtcblx0XHRcdFx0dG9wICAgICA9IHRvcCA8IDAgPyB0b3AgKyAoYnV1IC8gMikgOiB0b3A7XG5cdFx0XHRcdCRlbGwuY3NzKCAndG9wJywgJHRhcmdldC5vZmZzZXQoKS50b3AgLSAoYm9keS50b3ApICsgdG9wICk7XG5cdFx0XHRcdCRlbGwuY3NzKCAnbGVmdCcsICR0YXJnZXQub2Zmc2V0KCkubGVmdCAtIChib2R5LmxlZnQpICsgbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzFdICk7XG5cblx0XHRcdH1cblx0XHRcdGlmIChvZmZzY3JlZW4oICRlbGwgKSkge1xuXHRcdFx0XHR3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID0gbG9jYXRpb25fb3JkZXJbbG9jYXRpb25fb3JkZXIuaW5kZXhPZiggd2xmbWNUb29sdGlwLmRpcmVjdGlvbiApICsgMV07XG5cdFx0XHRcdHdsZm1jVG9vbHRpcC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3bGZtY1Rvb2x0aXAuc2hvdygpO1xuXHRcdFx0fVxuXG5cdFx0fTtcblxuXHRcdC8vIENyZWF0ZSBnbG9iYWwgd2xmbWNfdG9vbHRpcC5cblx0XHR2YXIgd2xmbWNUb29sdGlwID0gbmV3IHdsZm1jX3Rvb2x0aXAoKTtcblx0XHQvLyBEZXRlY3QgaWYgZGV2aWNlIGlzIHRvdWNoLWVuYWJsZWRcblx0XHR2YXIgaXNUb3VjaERldmljZSA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwO1xuXHRcdC8vIE1vdXNlb3ZlciB0byBzaG93LlxuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnbW91c2VlbnRlciB0b3VjaHN0YXJ0Jyxcblx0XHRcdFwiLndsZm1jLXRvb2x0aXBcIixcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciBfc2VsZiAgICAgICAgICAgPSB0aGlzO1xuXHRcdFx0XHR3bGZtY1Rvb2x0aXAudGFyZ2V0ID0gX3NlbGY7IC8vIERlZmF1bHQgdG8gc2VsZi5cblx0XHRcdFx0dmFyIG5hbWVfY2xhc3NlcyAgICA9IF9zZWxmLmNsYXNzTmFtZS5zcGxpdCggJyAnICk7XG5cdFx0XHRcdG5hbWVfY2xhc3Nlcy5mb3JFYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChjYykge1xuXHRcdFx0XHRcdFx0aWYgKGNjLmluZGV4T2YoICd3bGZtYy10b29sdGlwLScgKSAhPSAtMSkgeyAvLyBGaW5kIGEgZGlyZWN0aW9uYWwgdGFnLlxuXHRcdFx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID0gY2Muc3BsaXQoICctJyApW2NjLnNwbGl0KCAnLScgKS5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCQoIHRoaXMgKS5hdHRyKCAnZGF0YS10b29sdGlwLXR5cGUnICkpIHtcblxuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC50X3R5cGUgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtdG9vbHRpcC10eXBlJyApO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCQoIHRoaXMgKS5hdHRyKCAnZGF0YS10b29sdGlwLXRleHQnICkpIHtcblxuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC50ZXh0ID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXRvb2x0aXAtdGV4dCcgKTtcblx0XHRcdFx0XHRtb3ZlVGlwKCB3bGZtY1Rvb2x0aXAubm9kZSwgd2xmbWNUb29sdGlwLnRhcmdldCApO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gUHJldmVudCBkZWZhdWx0IHRvdWNoIGJlaGF2aW9yIHRvIGF2b2lkIHNjcm9sbGluZyBpc3N1ZXNcblx0XHRcdFx0aWYgKGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IGV4aXN0aW5nIGhpZGUgdGltZW91dFxuXHRcdFx0XHRpZiAod2xmbWNUb29sdGlwLmhpZGVUaW1lb3V0KSB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB3bGZtY1Rvb2x0aXAuaGlkZVRpbWVvdXQgKTtcblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZVRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnbW91c2VsZWF2ZSB0b3VjaGVuZCcsXG5cdFx0XHRcIi53bGZtYy10b29sdGlwXCIsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBSZS1oaWRlIHRvb2x0aXAuXG5cdFx0XHRcdC8vIEhpZGUgdG9vbHRpcCBhZnRlciBhIHNob3J0IGRlbGF5IG9uIHRvdWNoIGRldmljZXNcblx0XHRcdFx0aWYgKGUudHlwZSA9PT0gJ3RvdWNoZW5kJyAmJiBpc1RvdWNoRGV2aWNlKSB7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmhpZGVUaW1lb3V0ID0gc2V0VGltZW91dChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0d2xmbWNUb29sdGlwLmhpZGUoKTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQxMDAwXG5cdFx0XHRcdFx0KTsgLy8gMS1zZWNvbmQgZGVsYXkgYmVmb3JlIGhpZGluZ1xuXHRcdFx0XHR9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ21vdXNlbGVhdmUnKSB7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0Ly8gSGlkZSB0b29sdGlwIGlmIGNsaWNraW5nL3RhcHBpbmcgb3V0c2lkZVxuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQndG91Y2hzdGFydCBjbGljaycsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRpZiAoICEgJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndsZm1jLXRvb2x0aXAnICkubGVuZ3RoICYmICEgJCggZS50YXJnZXQgKS5pcyggd2xmbWNUb29sdGlwLm5vZGUgKSkge1xuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfZml4X29uX2ltYWdlX3NpbmdsZV9wb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuXHRcdGlmICgkKCAnLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeV9fd3JhcHBlciAud2xmbWMtdG9wLW9mLWltYWdlJyApLmxlbmd0aCA+IDApIHtcblx0XHRcdCQoICcud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5X193cmFwcGVyIC53bGZtYy10b3Atb2YtaW1hZ2UnICkuZWFjaChcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5pbnNlcnRBZnRlciggJCggdGhpcyApLnBhcmVudCgpICk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Lypjb25zdCB0b3BPZkltYWdlRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLndsZm1jLXRvcC1vZi1pbWFnZScgKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdG9wT2ZJbWFnZUVsZW1zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50RWxlbSA9IHRvcE9mSW1hZ2VFbGVtc1tpXTtcblx0XHRcdC8vIFNldCB0aGUgbWFyZ2luIHRvcCBvZiB0aGUgbmV4dCBzaWJsaW5nIGVsZW1lbnQgdG8gdGhlIGhlaWdodCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuXHRcdFx0aWYgKGN1cnJlbnRFbGVtLm5leHRFbGVtZW50U2libGluZykge1xuXHRcdFx0XHRsZXQgcG9zaXRpb25DbGFzcyAgID0gWy4uLmN1cnJlbnRFbGVtLm5leHRFbGVtZW50U2libGluZy5jbGFzc0xpc3RdLmZpbmQoIGNsYXNzTmFtZSA9PiBjbGFzc05hbWUuc3RhcnRzV2l0aCggXCJ3bGZtY19wb3NpdGlvbl9pbWFnZV9cIiApICk7XG5cdFx0XHRcdGxldCBjdXJyZW50UG9zaXRpb24gPSBbLi4uY3VycmVudEVsZW0uY2xhc3NMaXN0XS5maW5kKCBjbGFzc05hbWUgPT4gY2xhc3NOYW1lLnN0YXJ0c1dpdGgoIFwid2xmbWNfcG9zaXRpb25faW1hZ2VfXCIgKSApO1xuXHRcdFx0XHRpZiAocG9zaXRpb25DbGFzcyA9PT0gY3VycmVudFBvc2l0aW9uKSB7XG5cdFx0XHRcdFx0aWYgKCd3bGZtY19wb3NpdGlvbl9pbWFnZV90b3BfbGVmdCcgPT09IHBvc2l0aW9uQ2xhc3MgfHwgJ3dsZm1jX3Bvc2l0aW9uX2ltYWdlX3RvcF9yaWdodCcgPT09IHBvc2l0aW9uQ2xhc3MpIHtcblx0XHRcdFx0XHRcdGxldCBtYXJnaW5Ub3AgPSBgJHtjdXJyZW50RWxlbS5vZmZzZXRIZWlnaHQgKyA1fXB4YDtcblx0XHRcdFx0XHRcdC8vIENoZWNrIGZvciBwcmV2aW91cyBzaWJsaW5ncyB3aXRoIHRoZSBzYW1lIHBvc2l0aW9uIGNsYXNzIGFuZCBhZGQgdGhlaXIgaGVpZ2h0cyBhbmQgZ2FwIHZhbHVlcyB0byBtYXJnaW5Ub3AuXG5cdFx0XHRcdFx0XHRsZXQgcHJldlNpYmxpbmcgPSBjdXJyZW50RWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0d2hpbGUgKHByZXZTaWJsaW5nICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyggJ3dsZm1jLXRvcC1vZi1pbWFnZScgKSAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoIHBvc2l0aW9uQ2xhc3MgKSkge1xuXHRcdFx0XHRcdFx0XHRtYXJnaW5Ub3AgICA9IGBjYWxjKCAke21hcmdpblRvcH0gKyAke3ByZXZTaWJsaW5nLm9mZnNldEhlaWdodCArIDV9cHggKWA7XG5cdFx0XHRcdFx0XHRcdHByZXZTaWJsaW5nID0gcHJldlNpYmxpbmcucHJldmlvdXNFbGVtZW50U2libGluZztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cnJlbnRFbGVtLm5leHRFbGVtZW50U2libGluZy5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5Ub3A7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICgnd2xmbWNfcG9zaXRpb25faW1hZ2VfYm90dG9tX2xlZnQnID09PSBwb3NpdGlvbkNsYXNzIHx8ICd3bGZtY19wb3NpdGlvbl9pbWFnZV9ib3R0b21fcmlnaHQnID09PSBwb3NpdGlvbkNsYXNzKSB7XG5cdFx0XHRcdFx0XHRsZXQgbWFyZ2luQm90dG9tID0gYCR7Y3VycmVudEVsZW0ub2Zmc2V0SGVpZ2h0ICsgNX1weGA7XG5cdFx0XHRcdFx0XHQvLyBDaGVjayBmb3IgcHJldmlvdXMgc2libGluZ3Mgd2l0aCB0aGUgc2FtZSBwb3NpdGlvbiBjbGFzcyBhbmQgYWRkIHRoZWlyIGhlaWdodHMgYW5kIGdhcCB2YWx1ZXMgdG8gbWFyZ2luQm90dG9tLlxuXHRcdFx0XHRcdFx0bGV0IHByZXZTaWJsaW5nID0gY3VycmVudEVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZztcblx0XHRcdFx0XHRcdHdoaWxlIChwcmV2U2libGluZyAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoICd3bGZtYy10b3Atb2YtaW1hZ2UnICkgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCBwb3NpdGlvbkNsYXNzICkpIHtcblx0XHRcdFx0XHRcdFx0bWFyZ2luQm90dG9tID0gYGNhbGMoICR7bWFyZ2luQm90dG9tfSArICR7cHJldlNpYmxpbmcub2Zmc2V0SGVpZ2h0ICsgNX1weCApYDtcblx0XHRcdFx0XHRcdFx0cHJldlNpYmxpbmcgID0gcHJldlNpYmxpbmcucHJldmlvdXNFbGVtZW50U2libGluZztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cnJlbnRFbGVtLm5leHRFbGVtZW50U2libGluZy5zdHlsZS5tYXJnaW5Cb3R0b20gPSBtYXJnaW5Cb3R0b207XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSovXG5cblx0fSxcblxuXHQvKiA9PT0gSU5JVCBGVU5DVElPTlMgPT09ICovXG5cblx0LyoqXG5cdCAqIEluaXQgcG9wdXAgZm9yIGFsbCBsaW5rcyB3aXRoIHRoZSBwbHVnaW4gdGhhdCBvcGVuIGEgcG9wdXBcblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X3dpc2hsaXN0X3BvcHVwOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkICYgcmVtb3ZlIGNsYXNzIHRvIGJvZHkgd2hlbiBwb3B1cCBpcyBvcGVuZWQuXG5cdFx0dmFyIGNhbGxiYWNrICAgICAgID0gZnVuY3Rpb24gKG5vZGUsIG9wKSB7XG5cdFx0XHRpZiAodHlwZW9mIG5vZGUuY2xhc3NMaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucyggJ3dsZm1jLW92ZXJsYXknICkpIHtcblx0XHRcdFx0dmFyIG1ldGhvZCA9ICdyZW1vdmUnID09PSBvcCA/ICdyZW1vdmVDbGFzcycgOiAnYWRkQ2xhc3MnO1xuXG5cdFx0XHRcdCQoICdib2R5JyApW21ldGhvZF0oICd3bGZtYy13aXRoLXBvcHVwJyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XHRjYWxsYmFja0FkZCAgICA9IGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0XHRcdGNhbGxiYWNrKCBub2RlLCAnYWRkJyApO1xuXHRcdFx0fSxcblx0XHRcdGNhbGxiYWNrUmVtb3ZlID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdFx0Y2FsbGJhY2soIG5vZGUsICdyZW1vdmUnICk7XG5cdFx0XHR9LFxuXHRcdFx0b2JzZXJ2ZXIgICAgICAgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcblx0XHRcdFx0ZnVuY3Rpb24gKG11dGF0aW9uc0xpc3QpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpIGluIG11dGF0aW9uc0xpc3QpIHtcblx0XHRcdFx0XHRcdHZhciBtdXRhdGlvbiA9IG11dGF0aW9uc0xpc3RbaV07XG5cdFx0XHRcdFx0XHRpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgbXV0YXRpb24uYWRkZWROb2RlcyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKCBjYWxsYmFja0FkZCApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgbXV0YXRpb24ucmVtb3ZlZE5vZGVzICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHRtdXRhdGlvbi5yZW1vdmVkTm9kZXMuZm9yRWFjaCggY2FsbGJhY2tSZW1vdmUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdG9ic2VydmVyLm9ic2VydmUoXG5cdFx0XHRkb2N1bWVudC5ib2R5LFxuXHRcdFx0e1xuXHRcdFx0XHRjaGlsZExpc3Q6IHRydWVcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbml0IGNoZWNrYm94IGhhbmRsaW5nXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF9jaGVja2JveF9oYW5kbGluZzogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBjaGVja2JveGVzID0gJCggJy53bGZtYy13aXNobGlzdC10YWJsZSwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmZpbmQoICd0Ym9keSAucHJvZHVjdC1jaGVja2JveCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0dmFyIGxpbmsgICAgICAgPSAkKCAnLm11bHRpcGxlLXByb2R1Y3QtbW92ZSwubXVsdGlwbGUtcHJvZHVjdC1jb3B5JyApO1xuXHRcdGNoZWNrYm94ZXMub2ZmKCAnY2hhbmdlJyApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIHQgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0cCA9IHQucGFyZW50KCk7XG5cblx0XHRcdFx0aWYgKCAhIHQuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0XHRcdCQoICdpbnB1dFtuYW1lPVwiJyArIHQuYXR0ciggJ25hbWUnICkgKyAnXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydDInICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHAucmVtb3ZlQ2xhc3MoICdjaGVja2VkJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAndW5jaGVja2VkJyApXG5cdFx0XHRcdFx0LmFkZENsYXNzKCB0LmlzKCAnOmNoZWNrZWQnICkgPyAnY2hlY2tlZCcgOiAndW5jaGVja2VkJyApO1xuXG5cdFx0XHRcdGlmICggbGluay5sZW5ndGggPiAwICkge1xuXG5cdFx0XHRcdFx0dmFyIGlzQ2hlY2tlZCA9IGNoZWNrYm94ZXMuaXMoICc6Y2hlY2tlZCcgKTtcblx0XHRcdFx0XHRpZiAoaXNDaGVja2VkKSB7XG5cdFx0XHRcdFx0XHRsaW5rLnNob3coKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGluay5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciByb3cgICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAndHInICk7XG5cdFx0XHRcdFx0dmFyIGl0ZW1JZCAgICAgICAgID0gcm93LmF0dHIoICdkYXRhLWl0ZW0taWQnICk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nSXRlbUlkID0gbGluay5hdHRyKCAnZGF0YS1pdGVtLWlkJyApO1xuXHRcdFx0XHRcdGlmICggIHQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRcdGlmIChleGlzdGluZ0l0ZW1JZCkge1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZCA9IGV4aXN0aW5nSXRlbUlkLnNwbGl0KCAnLCcgKTtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQucHVzaCggaXRlbUlkICk7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuam9pbiggJywnICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZCA9IGl0ZW1JZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKGV4aXN0aW5nSXRlbUlkKSB7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggICAgICA9IGV4aXN0aW5nSXRlbUlkLmluZGV4T2YoIGl0ZW1JZCApO1xuXHRcdFx0XHRcdFx0XHRpZiAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQuc3BsaWNlKCBpbmRleCwgMSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuam9pbiggJywnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGluay5hdHRyKCAnZGF0YS1pdGVtLWlkJywgZXhpc3RpbmdJdGVtSWQgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEluaXQganMgaGFuZGxpbmcgb24gd2lzaGxpc3QgdGFibGUgaXRlbXMgYWZ0ZXIgYWpheCB1cGRhdGVcblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X2hhbmRsaW5nX2FmdGVyX2FqYXg6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmluaXRfcHJlcGFyZV9xdHlfbGlua3MoKTtcblx0XHR0aGlzLmluaXRfY2hlY2tib3hfaGFuZGxpbmcoKTtcblx0XHQvLyB0aGlzLmluaXRfcXVhbnRpdHkoKTtcblx0XHQvLyB0aGlzLmluaXRfY29weV93aXNobGlzdF9saW5rKCk7XG5cdFx0Ly8gdGhpcy5pbml0X3Rvb2x0aXAoKTtcblx0XHQvLyB0aGlzLmluaXRfY29tcG9uZW50cygpO1xuXHRcdC8vIHRoaXMuaW5pdF9sYXlvdXQoKTtcblx0XHR0aGlzLmluaXRfZHJhZ19uX2Ryb3AoKTtcblx0XHQvLyB0aGlzLmluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmcoKTtcblx0XHR0aGlzLmluaXRfZHJvcGRvd25fbGlzdHMoKTtcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19pbml0X2FmdGVyX2FqYXgnICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEhhbmRsZSBxdWFudGl0eSBpbnB1dCBjaGFuZ2UgZm9yIGVhY2ggd2lzaGxpc3QgaXRlbVxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGluaXRfcXVhbnRpdHk6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIganF4aHIsXG5cdFx0XHR0aW1lb3V0O1xuXG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0Jy53bGZtYy13aXNobGlzdC10YWJsZSAucXVhbnRpdHkgOmlucHV0LCAud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUgLnF1YW50aXR5IDppbnB1dCcsXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdHJvdyAgICAgICAgICAgPSB0LmNsb3Nlc3QoICdbZGF0YS1yb3ctaWRdJyApLFxuXHRcdFx0XHRcdHByb2R1Y3RfaWQgICAgPSByb3cuZGF0YSggJ3Jvdy1pZCcgKSxcblx0XHRcdFx0XHRjYXJ0X2l0ZW1fa2V5ID0gcm93LmRhdGEoICdjYXJ0LWl0ZW0ta2V5JyApLFxuXHRcdFx0XHRcdHRhYmxlICAgICAgICAgPSB0LmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLFxuXHRcdFx0XHRcdHRva2VuICAgICAgICAgPSB0YWJsZS5kYXRhKCAndG9rZW4nICk7XG5cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XG5cblx0XHRcdFx0Ly8gc2V0IGFkZCB0byBjYXJ0IGxpbmsgdG8gYWRkIHNwZWNpZmljIHF0eSB0byBjYXJ0LlxuXHRcdFx0XHRyb3cuZmluZCggJy5hZGRfdG9fY2FydF9idXR0b24nICkuYXR0ciggJ2RhdGEtcXVhbnRpdHknLCB0LnZhbCgpICk7XG5cblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aWYgKGpxeGhyKSB7XG5cdFx0XHRcdFx0XHRcdGpxeGhyLmFib3J0KCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGpxeGhyID0gJC5hamF4KFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnVwZGF0ZV9pdGVtX3F1YW50aXR5LFxuXHRcdFx0XHRcdFx0XHRcdFx0bm9uY2U6IHRhYmxlLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2lkOiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FydF9pdGVtX2tleTogY2FydF9pdGVtX2tleSxcblx0XHRcdFx0XHRcdFx0XHRcdHdpc2hsaXN0X3Rva2VuOiB0b2tlbixcblx0XHRcdFx0XHRcdFx0XHRcdHF1YW50aXR5OiB0LnZhbCgpLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0XHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5ibG9jayggcm93ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy51bmJsb2NrKCByb3cgKTtcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0LyppZiAodHlwZW9mIHJlc3BvbnNlLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIHJlc3BvbnNlLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0qL1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdDEwMDBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfcG9wdXBzOiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggJ2JvZHknICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1wb3B1cC10cmlnZ2VyOm5vdCgud2xmbWMtZGlzYWJsZWQpJyxcblx0XHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaWQgICAgICAgICAgICA9ICQoIHRoaXMgKS5kYXRhKCAncG9wdXAtaWQnICk7XG5cdFx0XHRcdHZhciBlbGVtICAgICAgICAgID0gJCggJyMnICsgaWQgKTtcblx0XHRcdFx0dmFyIHBvcHVwX3dyYXBwZXIgPSAkKCAnIycgKyBpZCArICdfd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoICEgcG9wdXBfd3JhcHBlci5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRhYnNvbHV0ZTogZmFsc2UsXG5cdFx0XHRcdFx0XHRjb2xvcjogJyMzMzMnLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbjogJ2FsbCAwLjNzJyxcblx0XHRcdFx0XHRcdGhvcml6b250YWw6IGVsZW0uZGF0YSggJ2hvcml6b250YWwnICksXG5cdFx0XHRcdFx0XHR2ZXJ0aWNhbDogZWxlbS5kYXRhKCAndmVydGljYWwnIClcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGVsZW0ucG9wdXAoIGRlZmF1bHRPcHRpb25zICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JCggJyN3bGZtYy10b29sdGlwJyApXG5cdFx0XHRcdFx0LmNzcyhcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0J3RvcCc6ICcwJyxcblx0XHRcdFx0XHRcdFx0J2xlZnQnOiAnMCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoICd0b29sdGlwX19oaWRkZW4nICk7XG5cdFx0XHRcdCQoICcjJyArIGlkICkucG9wdXAoICdzaG93JyApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KTtcblx0XHQkKCAnYm9keScgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLXBvcHVwLWNsb3NlJyxcblx0XHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaWQgPSAkKCB0aGlzICkuZGF0YSggJ3BvcHVwLWlkJyApO1xuXHRcdFx0XHQkKCAnIycgKyBpZCApLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0fSxcblxuXHRpbml0X2xheW91dDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBqcXhocixcblx0XHRcdHRpbWVvdXQ7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLXRvZ2dsZS1sYXlvdXQnLFxuXHRcdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBlbGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRlbGVtLnRvZ2dsZUNsYXNzKCAnbGlzdCcgKS50b2dnbGVDbGFzcyggJ2dyaWQnICk7XG5cdFx0XHRcdGVsZW0uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC1mb3JtJyApLmZpbmQoICcud2xmbWMtbGlzdCcgKS50b2dnbGVDbGFzcyggJ3ZpZXctbW9kZS1saXN0JyApLnRvZ2dsZUNsYXNzKCAndmlldy1tb2RlLWdyaWQnICk7XG5cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XG5cblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aWYgKGpxeGhyKSB7XG5cdFx0XHRcdFx0XHRcdGpxeGhyLmFib3J0KCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGpxeGhyID0gJC5hamF4KFxuXHRcdFx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuY2hhbmdlX2xheW91dCxcblx0XHRcdFx0XHRcdFx0XHRcdG5vbmNlOiBlbGVtLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRuZXdfbGF5b3V0OiBlbGVtLmhhc0NsYXNzKCAnbGlzdCcgKSA/ICdncmlkJyA6ICdsaXN0Jyxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRcdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gYW55dGhpbmcuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0MTAwMFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRpbml0X2NvbXBvbmVudHM6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2xmbWMtbGlzdCAucHJvZHVjdC1jb21wb25lbnRzJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyICR0aGlzICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0dmFyIGVsZW0gICAgICAgICA9ICR0aGlzLmNsb3Nlc3QoICd0cicgKTtcblx0XHRcdFx0dmFyICRtZXRhRGF0YSAgICA9IGVsZW0uZmluZCggJy53bGZtYy1hYnNvbHV0ZS1tZXRhLWRhdGEnICk7XG5cdFx0XHRcdHZhciAkbmV4dCAgICAgICAgPSBlbGVtLm5leHQoICcud2xmbWMtcm93LW1ldGEtZGF0YScgKS5maWx0ZXIoICcud2xmbWMtcm93LW1ldGEtZGF0YScgKTtcblx0XHRcdFx0dmFyIGlzTmV4dEhpZGRlbiA9ICRuZXh0Lmhhc0NsYXNzKCAnaGlkZScgKTtcblxuXHRcdFx0XHQkbWV0YURhdGEuZmFkZVRvZ2dsZSgpO1xuXHRcdFx0XHQkbmV4dC50b2dnbGVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdGVsZW0udG9nZ2xlQ2xhc3MoICdzaG93LW1ldGEtZGF0YScsIGlzTmV4dEhpZGRlbiApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1saXN0IC5jbG9zZS1jb21wb25lbnRzJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIGVsZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJ3RyJyApO1xuXHRcdFx0XHRlbGVtLmZpbmQoICcud2xmbWMtYWJzb2x1dGUtbWV0YS1kYXRhJyApLmZhZGVUb2dnbGUoKTtcblx0XHRcdFx0ZWxlbS5yZW1vdmVDbGFzcyggJ3Nob3ctbWV0YS1kYXRhJyApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRpbml0X3BvcHVwX2NoZWNrYm94X2hhbmRsaW5nOiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0Jy5saXN0LWl0ZW0tY2hlY2tib3gnLFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdHZhciBzZWxlY3RlZEl0ZW0gICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5saXN0LWl0ZW0nICk7XG5cdFx0XHRcdHZhciBwYXJlbnRDb250YWluZXIgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8tbGlzdC1jb250YWluZXIsIC53bGZtYy1tb3ZlLXRvLWxpc3Qtd3JhcHBlciwgLndsZm1jLWNvcHktdG8tbGlzdC13cmFwcGVyJyApO1xuXHRcdFx0XHRpZiAocGFyZW50Q29udGFpbmVyLmhhc0NsYXNzKCAnd2xmbWMtYWRkLXRvLWxpc3QtY29udGFpbmVyJyApKSB7XG5cdFx0XHRcdFx0aWYgKCQoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRJdGVtLnJlbW92ZUNsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwYXJlbnRDb250YWluZXIuaGFzQ2xhc3MoICd3bGZtYy1tb3ZlLXRvLWxpc3Qtd3JhcHBlcicgKSB8fCBwYXJlbnRDb250YWluZXIuaGFzQ2xhc3MoICd3bGZtYy1jb3B5LXRvLWxpc3Qtd3JhcHBlcicgKSkge1xuXHRcdFx0XHRcdHZhciBjaGVja2JveGVzID0gcGFyZW50Q29udGFpbmVyLmZpbmQoICdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0XHRcdFx0cGFyZW50Q29udGFpbmVyLmZpbmQoICcubGlzdC1pdGVtJyApLnJlbW92ZUNsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0XHRcdFx0aWYgKCQoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdFx0XHRcdGNoZWNrYm94ZXMubm90KCAkKCB0aGlzICkgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRpbml0X2Ryb3Bkb3duX2xpc3RzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRyb3Bkb3duRWxlbWVudCA9ICQoICcjd2xmbWNfbXlfbGlzdHMnICk7XG5cdFx0aWYgKCAhIGRyb3Bkb3duRWxlbWVudCB8fCBkcm9wZG93bkVsZW1lbnQubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmIChkcm9wZG93bkVsZW1lbnQuZGF0YSggJ2VkaXRhYmxlLXNlbGVjdCcgKSkge1xuXHRcdFx0ZHJvcGRvd25FbGVtZW50LndsZm1jRHJvcERvd24oICdkZXN0cm95JyApO1xuXHRcdH1cblx0XHRkcm9wZG93bkVsZW1lbnRcblx0XHRcdC5vbihcblx0XHRcdFx0J3NlbGVjdC5lZGl0YWJsZS1zZWxlY3QnLFxuXHRcdFx0XHRmdW5jdGlvbiAoZSwgbGkpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIChsaSkgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtZHJvcGRvd24td3JhcHBlcicgKS5hZGRDbGFzcyggJ3dsZm1jLWFjdGlvbiB3bGZtYy1sb2FkaW5nLWFsdCB3bGZtYy1pbnZlcnNlJyApO1xuXHRcdFx0XHRcdFx0JCggdGhpcyApLnZhbCggJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtZHJvcGRvd24td3JhcHBlcicgKS5maW5kKCAnLmxpc3QtaXRlbVtkYXRhLXdpc2hsaXN0LWlkPVwiJyArIGxpLnZhbCgpICsgJ1wiXSAubGlzdC1uYW1lJyApLnRleHQoKSApO1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1kcm9wZG93bi13cmFwcGVyJyApLmZpbmQoICcubGlzdC1pdGVtW2RhdGEtd2lzaGxpc3QtaWQ9XCInICsgbGkudmFsKCkgKyAnXCJdJyApLmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHQud2xmbWNEcm9wRG93bihcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVmZmVjdHM6ICdzbGlkZScsXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0fSxcblxuXHQvKipcblx0ICogSW5pdCBoYW5kbGluZyBmb3IgY29weSBidXR0b25cblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X2NvcHlfd2lzaGxpc3RfbGluazogZnVuY3Rpb24gKCkge1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy5jb3B5LWxpbmstdHJpZ2dlcicsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBvYmpfdG9fY29weSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHR2YXIgaGlkZGVuID0gJChcblx0XHRcdFx0XHQnPGlucHV0Lz4nLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHZhbDogb2JqX3RvX2NvcHkuYXR0ciggJ2RhdGEtaHJlZicgKSxcblx0XHRcdFx0XHRcdHR5cGU6ICd0ZXh0J1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0XHQkKCAnYm9keScgKS5hcHBlbmQoIGhpZGRlbiApO1xuXG5cdFx0XHRcdGlmICgkLmZuLldMRk1DLmlzT1MoKSkge1xuXHRcdFx0XHRcdGhpZGRlblswXS5zZXRTZWxlY3Rpb25SYW5nZSggMCwgOTk5OSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGhpZGRlbi5zZWxlY3QoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cblx0XHRcdFx0aGlkZGVuLnJlbW92ZSgpO1xuXG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5saW5rX2NvcGllZCApO1xuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBmcmFnbWVudHMgdGhhdCBuZWVkIHRvIGJlIHJlZnJlc2hlZCBpbiB0aGUgcGFnZVxuXHQgKlxuXHQgKiBAcGFyYW0gc2VhcmNoIHN0cmluZyBSZWYgdG8gc2VhcmNoIGFtb25nIGFsbCBmcmFnbWVudHMgaW4gdGhlIHBhZ2Vcblx0ICogQHJldHVybiBvYmplY3QgT2JqZWN0IGNvbnRhaW5pbmcgYSBwcm9wZXJ0eSBmb3IgZWFjaCBmcmFnbWVudCB0aGF0IG1hdGNoZXMgc2VhcmNoXG5cdCAqL1xuXHRyZXRyaWV2ZV9mcmFnbWVudHM6IGZ1bmN0aW9uIChzZWFyY2gpIHtcblx0XHR2YXIgb3B0aW9ucyAgID0ge30sXG5cdFx0XHRmcmFnbWVudHMgPSBudWxsO1xuXG5cdFx0aWYgKHNlYXJjaCkge1xuXHRcdFx0aWYgKHR5cGVvZiBzZWFyY2ggPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdHNlYXJjaCA9ICQuZXh0ZW5kKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZyYWdtZW50czogbnVsbCxcblx0XHRcdFx0XHRcdHM6ICcnLFxuXHRcdFx0XHRcdFx0Y29udGFpbmVyOiAkKCBkb2N1bWVudCApLFxuXHRcdFx0XHRcdFx0Zmlyc3RMb2FkOiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2VhcmNoXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCAhIHNlYXJjaC5mcmFnbWVudHMpIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBzZWFyY2guY29udGFpbmVyLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gc2VhcmNoLmZyYWdtZW50cztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzZWFyY2gucykge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IGZyYWdtZW50cy5ub3QoICdbZGF0YS1mcmFnbWVudC1yZWZdJyApLmFkZCggZnJhZ21lbnRzLmZpbHRlciggJ1tkYXRhLWZyYWdtZW50LXJlZj1cIicgKyBzZWFyY2gucyArICdcIl0nICkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzZWFyY2guZmlyc3RMb2FkKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gZnJhZ21lbnRzLmZpbHRlciggJy5vbi1maXJzdC1sb2FkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmcmFnbWVudHMgPSAkKCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApO1xuXG5cdFx0XHRcdGlmICh0eXBlb2Ygc2VhcmNoID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc2VhcmNoID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IGZyYWdtZW50cy5ub3QoICdbZGF0YS1mcmFnbWVudC1yZWZdJyApLmFkZCggZnJhZ21lbnRzLmZpbHRlciggJ1tkYXRhLWZyYWdtZW50LXJlZj1cIicgKyBzZWFyY2ggKyAnXCJdJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZnJhZ21lbnRzID0gJCggJy53bGZtYy13aXNobGlzdC1mcmFnbWVudCcgKTtcblx0XHR9XG5cblx0XHRpZiAoZnJhZ21lbnRzLmxlbmd0aCkge1xuXHRcdFx0ZnJhZ21lbnRzLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgdCAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0XHRpZCA9IHQuYXR0ciggJ2NsYXNzJyApLnNwbGl0KCAnICcgKS5maWx0ZXIoXG5cdFx0XHRcdFx0XHRcdCh2YWwpID0+IHtyZXR1cm4gdmFsLmxlbmd0aCAmJiB2YWwgIT09ICdleGlzdHMnO31cblx0XHRcdFx0XHRcdCkuam9pbiggd2xmbWNfbDEwbi5mcmFnbWVudHNfaW5kZXhfZ2x1ZSApO1xuXG5cdFx0XHRcdFx0b3B0aW9uc1tpZF0gPSB0LmRhdGEoICdmcmFnbWVudC1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3B0aW9ucztcblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBmcmFnbWVudHMgb24gcGFnZSBsb2FkaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSBzZWFyY2ggc3RyaW5nIFJlZiB0byBzZWFyY2ggYW1vbmcgYWxsIGZyYWdtZW50cyBpbiB0aGUgcGFnZVxuXHQgKiBAcGFyYW0gc3VjY2VzcyBmdW5jdGlvblxuXHQgKiBAcGFyYW0gc3VjY2Vzc0FyZ3MgYXJyYXlcblx0ICovXG5cdGxvYWRfZnJhZ21lbnRzOiBmdW5jdGlvbiAoc2VhcmNoLCBzdWNjZXNzLCBzdWNjZXNzQXJncykge1xuXG5cdFx0Y2xlYXJUaW1lb3V0KCBmcmFnbWVudHRpbWVvdXQgKTtcblxuXHRcdGZyYWdtZW50dGltZW91dCA9IHNldFRpbWVvdXQoXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICggZnJhZ21lbnR4aHIgKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnR4aHIuYWJvcnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWFyY2ggPSAkLmV4dGVuZChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmaXJzdExvYWQ6IHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNlYXJjaFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHZhciBmcmFnbWVudHMgPSAkLmZuLldMRk1DLnJldHJpZXZlX2ZyYWdtZW50cyggc2VhcmNoICk7XG5cdFx0XHRcdC8vIGNyZWF0ZSBhIG5ldyBGb3JtRGF0YSBvYmplY3QuXG5cdFx0XHRcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICdhY3Rpb24nLCB3bGZtY19sMTBuLmFjdGlvbnMubG9hZF9mcmFnbWVudHMgKTtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCAnY29udGV4dCcsICdmcm9udGVuZCcgKTtcblx0XHRcdFx0aWYgKCBmcmFnbWVudHMpIHtcblx0XHRcdFx0XHQvLyBjb252ZXJ0IG9iamVjdCB0byBKU09OIHN0cmluZy5cblx0XHRcdFx0XHR2YXIgZnJhZ21lbnRKc29uID0gSlNPTi5zdHJpbmdpZnkoIGZyYWdtZW50cyApO1xuXHRcdFx0XHRcdC8vIGNyZWF0ZSBhIGZpbGUgZnJvbSBKU09OIHN0cmluZy5cblx0XHRcdFx0XHR2YXIgZmlsZSA9IG5ldyBGaWxlKCBbZnJhZ21lbnRKc29uXSwgJ2ZyYWdtZW50Lmpzb24nICk7XG5cdFx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCAnZnJhZ21lbnRzX2ZpbGUnLCBmaWxlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmcmFnbWVudHhociA9ICQuYWpheChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsLCAvLyBhamF4X3VybCxcblx0XHRcdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxuXHRcdFx0XHRcdFx0LypiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwqL1xuXHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN1Y2Nlc3MuYXBwbHkoIG51bGwsIHN1Y2Nlc3NBcmdzICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd2xmbWNfZnJhZ21lbnRzX2xvYWRlZCcsIFtmcmFnbWVudHMsIGRhdGEuZnJhZ21lbnRzLCBzZWFyY2guZmlyc3RMb2FkXSApO1xuXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQkKCAnI3dsZm1jLWxpc3RzLCN3bGZtYy13aXNobGlzdC1mb3JtJyApLmFkZENsYXNzKCAnb24tZmlyc3QtbG9hZCcgKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBkYXRhLnByb2R1Y3RzICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggZGF0YS5wcm9kdWN0cyApICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgZGF0YS53YWl0bGlzdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfd2FpdGxpc3RfaGFzaCggSlNPTi5zdHJpbmdpZnkoIGRhdGEud2FpdGxpc3QgKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGRhdGEubGFuZyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfbGFuZ19oYXNoKCBkYXRhLmxhbmcgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHQxMDBcblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXBsYWNlIGZyYWdtZW50cyB3aXRoIHRlbXBsYXRlIHJlY2VpdmVkXG5cdCAqXG5cdCAqIEBwYXJhbSBmcmFnbWVudHMgYXJyYXkgQXJyYXkgb2YgZnJhZ21lbnRzIHRvIHJlcGxhY2Vcblx0ICovXG5cdHJlcGxhY2VfZnJhZ21lbnRzOiBmdW5jdGlvbiAoZnJhZ21lbnRzKSB7XG5cdFx0JC5lYWNoKFxuXHRcdFx0ZnJhZ21lbnRzLFxuXHRcdFx0ZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0dmFyIGl0ZW1TZWxlY3RvciA9ICcuJyArIGkuc3BsaXQoIHdsZm1jX2wxMG4uZnJhZ21lbnRzX2luZGV4X2dsdWUgKS5maWx0ZXIoXG5cdFx0XHRcdFx0KHZhbCkgPT4ge3JldHVybiB2YWwubGVuZ3RoICYmIHZhbCAhPT0gJ2V4aXN0cycgJiYgdmFsICE9PSAnd2l0aC1jb3VudCc7fVxuXHRcdFx0XHQpLmpvaW4oICcuJyApLFxuXHRcdFx0XHRcdHRvUmVwbGFjZSAgICA9ICQoIGl0ZW1TZWxlY3RvciApO1xuXHRcdFx0XHQvLyBmaW5kIHJlcGxhY2UgdGVtcGxhdGUuXG5cdFx0XHRcdHZhciByZXBsYWNlV2l0aCA9ICQoIHYgKS5maWx0ZXIoIGl0ZW1TZWxlY3RvciApO1xuXG5cdFx0XHRcdGlmICggISByZXBsYWNlV2l0aC5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXBsYWNlV2l0aCA9ICQoIHYgKS5maW5kKCBpdGVtU2VsZWN0b3IgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0b1JlcGxhY2UubGVuZ3RoICYmIHJlcGxhY2VXaXRoLmxlbmd0aCkge1xuXHRcdFx0XHRcdHRvUmVwbGFjZS5yZXBsYWNlV2l0aCggcmVwbGFjZVdpdGggKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0LyogPT09IEVWRU5UIEhBTkRMSU5HID09PSAqL1xuXG5cdGxvYWRfYXV0b21hdGlvbnM6IGZ1bmN0aW9uIChwcm9kdWN0X2lkLCB3aXNobGlzdF9pZCwgY3VzdG9tZXJfaWQsIGxpc3RfdHlwZSwgbm9uY2UpIHtcblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMubG9hZF9hdXRvbWF0aW9ucyxcblx0XHRcdFx0XHRub25jZTogbm9uY2UsXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRwcm9kdWN0X2lkOiBwYXJzZUludCggcHJvZHVjdF9pZCApLFxuXHRcdFx0XHRcdHdpc2hsaXN0X2lkOiBwYXJzZUludCggd2lzaGxpc3RfaWQgKSxcblx0XHRcdFx0XHRjdXN0b21lcl9pZDogcGFyc2VJbnQoIGN1c3RvbWVyX2lkICksXG5cdFx0XHRcdFx0bGlzdF90eXBlOiBsaXN0X3R5cGUsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vIGFueXRoaW5nLlxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRhZGRfdG9fc2F2ZV9mb3JfbGF0ZXI6IGZ1bmN0aW9uICggY2FydF9pdGVtX2tleSAsIGVsZW0gKSB7XG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfdG9fc2F2ZV9mb3JfbGF0ZXJfYWN0aW9uLFxuXHRcdFx0bm9uY2U6IHdsZm1jX2wxMG4uYWpheF9ub25jZS5hZGRfdG9fc2F2ZV9mb3JfbGF0ZXJfbm9uY2UsXG5cdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0YWRkX3RvX3NhdmVfZm9yX2xhdGVyOiBjYXJ0X2l0ZW1fa2V5LFxuXHRcdFx0bWVyZ2Vfc2F2ZV9mb3JfbGF0ZXI6IHdsZm1jX2wxMG4ubWVyZ2Vfc2F2ZV9mb3JfbGF0ZXIsXG5cdFx0XHRyZW1vdmVfZnJvbV9jYXJ0X2l0ZW06IHdsZm1jX2wxMG4ucmVtb3ZlX2Zyb21fY2FydF9pdGVtLFxuXHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0fTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkgKSB7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLnNhdmVfZm9yX2xhdGVyX2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdC8vZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiBiZWZvcmVTZW5kKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIGVsZW0gJiYgZWxlbS5sZW5ndGggKSB7XG5cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ubGVuZ3RoICkge1xuXG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX3Jlc3VsdCAgPSByZXNwb25zZS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZSxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKCAndHJ1ZScgPT09IHJlc3BvbnNlX3Jlc3VsdCApIHtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHRcdC8qaWYgKHR5cGVvZiByZXNwb25zZS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCByZXNwb25zZS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfcHJvZHVjdF9hZGRlZF90ZXh0ICkpIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHdsZm1jX2wxMG4ubGFiZWxzLnNmbF9wcm9kdWN0X2FkZGVkX3RleHQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBhdXRvbWF0aW9uX2xpc3RfdHlwZSA9IHdsZm1jX2wxMG4ubWVyZ2Vfc2F2ZV9mb3JfbGF0ZXIgPyAoIHdsZm1jX2wxMG4ubWVyZ2VfbGlzdHMgPyAnbGlzdHMnIDogJ3dpc2hsaXN0JyApIDogJ3NhdmUtZm9yLWxhdGVyJztcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9hdXRvbWF0aW9ucyggcmVzcG9uc2UucHJvZHVjdF9pZCwgcmVzcG9uc2Uud2lzaGxpc3RfaWQsIHJlc3BvbnNlLmN1c3RvbWVyX2lkLCBhdXRvbWF0aW9uX2xpc3RfdHlwZSwgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2UuY291bnQgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXRhYnMtd3JhcHBlcicgKS5hdHRyKCAnZGF0YS1jb3VudCcsIHJlc3BvbnNlLmNvdW50ICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ3djX3VwZGF0ZV9jYXJ0JyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJykge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGNoZWNrX3dhaXRsaXN0X21vZHVsZXM6IGZ1bmN0aW9uICggZGF0YSwgcHJvZHVjdF9pZCwgdmFyaWF0aW9uX2lkICkge1xuXHRcdGlmICggISBwcm9kdWN0X2lkIHx8ICEgdmFyaWF0aW9uX2lkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgcHJvZHVjdF90eXBlID0gJ3ZhcmlhdGlvbic7XG5cdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHR2YXJpYXRpb25faWQgPSBwcm9kdWN0X2lkO1xuXHRcdFx0cHJvZHVjdF90eXBlID0gJ3ZhcmlhYmxlJztcblx0XHR9XG5cdFx0bGV0IHRhcmdldHMgICAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0IFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApLFxuXHRcdFx0dGFyZ2V0X2JveGVzID0gJCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jayBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKTtcblxuXHRcdHRhcmdldF9ib3hlcy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRsZXQgdCAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jaycgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cdFx0XHRcdGNvbnRhaW5lclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIChpLCBjbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hdGNoKCAvd2xmbWMtYWRkLXRvLW91dG9mc3RvY2stXFxTKy9nICkuam9pbiggJyAnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ3dsZm1jLWFkZC10by1vdXRvZnN0b2NrLScgKyB2YXJpYXRpb25faWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0XHRsZXQgb3V0b2ZzdG9ja2JveCA9ICQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHZhcmlhdGlvbl9pZCApO1xuXG5cdFx0XHRcdGlmIChvdXRvZnN0b2NrYm94Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdG91dG9mc3RvY2tib3ggPSAkKCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrLScgKyBwcm9kdWN0X2lkICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCBudWxsICE9PSBkYXRhICkge1xuXHRcdFx0XHRcdGlmIChkYXRhLndsZm1jX2hpZGVfYmFja19pbl9zdG9jayB8fCAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5leGNsdWRlX2JhY2tfaW5fc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdG91dG9mc3RvY2tib3guYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvdXRvZnN0b2NrYm94LnJlbW92ZUNsYXNzKCAnaGlkZScgKTsgLy8gc2hvdyBvdXRvZnN0b2NrIGJveC5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGV0IG91dF9vZl9zdG9jayA9IG91dG9mc3RvY2tib3guZGF0YSggJ3Byb2R1Y3Qtb3V0b2ZzdG9jaycgKTtcblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBvdXRfb2Zfc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdG91dG9mc3RvY2tib3gucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvdXRvZnN0b2NrYm94LmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdCxcblx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJyAmJiB2LnByb2R1Y3RfaWQgJiYgdi5wcm9kdWN0X2lkID09PSB2YXJpYXRpb25faWQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG91dG9mc3RvY2tib3ggPSAkKCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrLScgKyB2LnByb2R1Y3RfaWQgKTtcblx0XHRcdFx0XHRcdFx0b3V0b2ZzdG9ja2JveC5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdFx0b3V0b2ZzdG9ja2JveC5lYWNoKFxuXHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHYuYmFja19pbl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRvdXRvZnN0b2NrYm94LmZpbmQoICcud2xmbWMtYWRkLWJ1dHRvbiA+IGEnICkuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICkuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHZhcmlhdGlvbl9pZCApLmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScsIHByb2R1Y3RfdHlwZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ICAgICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRjb250YWluZXIgICAgICAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QnICksXG5cdFx0XHRcdFx0cG9wdXAgICAgICAgICAgICAgICAgPSAkKCAnIycgKyB0LmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0JyApLmRhdGEoICdwb3B1cC1pZCcgKSApLFxuXHRcdFx0XHRcdGJhY2tpbnN0b2NrX2NoZWNrYm94ID0gcG9wdXAubGVuZ3RoID8gcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2JhY2staW4tc3RvY2tcIl0nICkgOiBmYWxzZSAsXG5cdFx0XHRcdFx0cHJpY2VjaGFuZ2VfY2hlY2tib3ggPSBwb3B1cC5sZW5ndGggPyBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpY2UtY2hhbmdlXCJdJyApIDogZmFsc2UgLFxuXHRcdFx0XHRcdGxvd3N0b2NrX2NoZWNrYm94ICAgID0gcG9wdXAubGVuZ3RoID8gcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2xvdy1zdG9ja1wiXScgKSA6IGZhbHNlICxcblx0XHRcdFx0XHRvbnNhbGVfY2hlY2tib3ggICAgICA9IHBvcHVwLmxlbmd0aCA/IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9vbi1zYWxlXCJdJyApIDogZmFsc2UsXG5cdFx0XHRcdFx0YXZhaWxhYmxlX21vZHVsZXMgICAgPSBjb250YWluZXIuZGF0YSggJ2F2YWlsYWJsZS1saXN0cycgKTtcblxuXHRcdFx0XHRjb250YWluZXIucmVtb3ZlQ2xhc3MoICdvcGFjaXR5LWhhbGYnICk7XG5cdFx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0XHRpZiAoIGRhdGEuaXNfaW5fc3RvY2sgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGxvd3N0b2NrX2NoZWNrYm94Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggZGF0YS5lbmFibGVfbG93X3N0b2NrICYmICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLmVuYWJsZV9sb3dfc3RvY2sgKSAmJiAhICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLmV4Y2x1ZGVfbG93X3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bG93c3RvY2tfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGxvd3N0b2NrX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBwcmljZWNoYW5nZV9jaGVja2JveC5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLmV4Y2x1ZGVfcHJpY2VfY2hhbmdlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cHJpY2VjaGFuZ2VfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHByaWNlY2hhbmdlX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBiYWNraW5zdG9ja19jaGVja2JveC5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGRhdGEud2xmbWNfaGlkZV9iYWNrX2luX3N0b2NrICkge1xuXHRcdFx0XHRcdFx0XHRcdGJhY2tpbnN0b2NrX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRiYWNraW5zdG9ja19jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBvbnNhbGVfY2hlY2tib3gubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBkYXRhLmRpc3BsYXlfcHJpY2UgIT09IGRhdGEuZGlzcGxheV9yZWd1bGFyX3ByaWNlIHx8ICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLmV4Y2x1ZGVfb25fc2FsZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdG9uc2FsZV9jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0b25zYWxlX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBoaWRlIGFkZCB0byB3YWl0bGlzdCBidXR0b25zIGlmIG5vdCBhY3RpdmUgbW9kdWxlcyBpbiBwb3B1cC5cblx0XHRcdFx0XHRcdGlmICggISBwb3B1cC5maW5kKCAnLndsZm1jLXdhaXRsaXN0LXNlbGVjdC10eXBlIC5saXN0LWl0ZW06bm90KC5oaWRlKScgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcyggJ29wYWNpdHktaGFsZicgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgYXZhaWxhYmxlX21vZHVsZXMgPT09IFwib2JqZWN0XCIgJiYgJ2JhY2staW4tc3RvY2snIGluIGF2YWlsYWJsZV9tb2R1bGVzICYmICEgJC5mbi5XTEZNQy5pc1RydWUoIGRhdGEuZXhjbHVkZV9iYWNrX2luX3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGJhY2tpbnN0b2NrX2NoZWNrYm94Lmxlbmd0aCA+IDAgICkge1xuXHRcdFx0XHRcdFx0XHRiYWNraW5zdG9ja19jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIHByaWNlY2hhbmdlX2NoZWNrYm94Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdHByaWNlY2hhbmdlX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggbG93c3RvY2tfY2hlY2tib3gubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0bG93c3RvY2tfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBvbnNhbGVfY2hlY2tib3gubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0b25zYWxlX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCAnb3BhY2l0eS1oYWxmJyApOyAvLyBoaWRlIGFkZCB0byB3YWl0bGlzdCBidXR0b25zLlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2JhY2staW4tc3RvY2tcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpY2UtY2hhbmdlXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X29uLXNhbGVcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbG93LXN0b2NrXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHRjb250YWluZXJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgY2xhc3Nlcykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xhc3Nlcy5tYXRjaCggL3dsZm1jLWFkZC10by13YWl0bGlzdC1cXFMrL2cgKS5qb2luKCAnICcgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0LmFkZENsYXNzKCAnd2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyB2YXJpYXRpb25faWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3QsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcgJiYgdi5wcm9kdWN0X2lkICYmIHYucHJvZHVjdF9pZCA9PSB2YXJpYXRpb25faWQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5wcmljZV9jaGFuZ2UgKSB8fCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5vbl9zYWxlICkgfHwgJC5mbi5XTEZNQy5pc1RydWUoIHYubG93X3N0b2NrICkgfHwgKCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5iYWNrX2luX3N0b2NrICkgJiYgcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2JhY2staW4tc3RvY2tcIl0nICkubGVuZ3RoID4gMCApICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB2LmJhY2tfaW5fc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB2LnByaWNlX2NoYW5nZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcmljZS1jaGFuZ2VcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5vbl9zYWxlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X29uLXNhbGVcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5sb3dfc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbG93LXN0b2NrXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtY19hZGRfdG9fd2FpdGxpc3QnICkuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICkuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHZhcmlhdGlvbl9pZCApLmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScsIHByb2R1Y3RfdHlwZSApO1xuXHRcdFx0XHRpZiAoICd2YXJpYWJsZScgPT09IHByb2R1Y3RfdHlwZSAmJiAkLmZuLldMRk1DLmlzVHJ1ZSggd2xmbWNfbDEwbi53YWl0bGlzdF9yZXF1aXJlZF9wcm9kdWN0X3ZhcmlhdGlvbiApICkge1xuXHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLXBvcHVwLXRyaWdnZXInICkuYWRkQ2xhc3MoICd3bGZtYy1kaXNhYmxlZCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1wb3B1cC10cmlnZ2VyJyApLnJlbW92ZUNsYXNzKCAnd2xmbWMtZGlzYWJsZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGNoZWNrX3Byb2R1Y3RzOiBmdW5jdGlvbiAocHJvZHVjdHMpIHtcblx0XHRpZiAoIG51bGwgIT09IHByb2R1Y3RzICkge1xuXHRcdFx0cHJvZHVjdF9pbl9saXN0ICAgPSBbXTtcblx0XHRcdHZhciBjb3VudGVyX2l0ZW1zID0gJCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXIgLndsZm1jLWNvdW50ZXItaXRlbScgKTtcblx0XHRcdGlmICggY291bnRlcl9pdGVtcy5sZW5ndGggJiYgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCApIHtcblx0XHRcdFx0Y291bnRlcl9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCBpdGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpdGVtLnByb2R1Y3RfaWQgPT09IHBfaWQ7IH1cblx0XHRcdFx0XHRcdCkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIHBfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHZhciB0YWJsZV9pdGVtc1x0PSAkKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0gLndsZm1jLXRhYmxlLWl0ZW0nICk7XG5cdFx0XHRpZiAoIHRhYmxlX2l0ZW1zLmxlbmd0aCAmJiBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICkge1xuXHRcdFx0XHR0YWJsZV9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCBpdGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpdGVtLnByb2R1Y3RfaWQgPT09IHBfaWQ7IH1cblx0XHRcdFx0XHRcdCkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBwX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHQkKCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRwcm9kdWN0cyxcblx0XHRcdFx0ZnVuY3Rpb24gKCBpZCwgaXRlbURhdGEgKSB7XG5cdFx0XHRcdFx0dmFyIHNhbWVfcHJvZHVjdHMgPSAkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC0nICsgaXRlbURhdGEucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdHNhbWVfcHJvZHVjdHMuZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS1pdGVtLWlkJywgaXRlbURhdGEuaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcsIGl0ZW1EYXRhLndpc2hsaXN0X2lkICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13aXNobGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LnB1c2goIGl0ZW1EYXRhICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cblx0Y2hlY2tfd2FpdGxpc3RfcHJvZHVjdHM6IGZ1bmN0aW9uIChwcm9kdWN0cykge1xuXHRcdGlmICggbnVsbCAhPT0gcHJvZHVjdHMgKSB7XG5cdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0ID0gW107XG5cdFx0XHR2YXIgY291bnRlcl9pdGVtcyAgID0gJCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXIgLndsZm1jLWNvdW50ZXItaXRlbScgKTtcblx0XHRcdGlmICggY291bnRlcl9pdGVtcy5sZW5ndGggJiYgcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGggKSB7XG5cdFx0XHRcdGNvdW50ZXJfaXRlbXMuZWFjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgcF9pZCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1yb3ctaWQnICk7XG5cdFx0XHRcdFx0XHRpZiAoICEgJC5ncmVwKFxuXHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoIGl0ZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0ucHJvZHVjdF9pZCA9PT0gcF9pZDsgfVxuXHRcdFx0XHRcdFx0KS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgcF9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRhYmxlX2l0ZW1zXHQ9ICQoICcud2xmbWMtd2FpdGxpc3QtdGFibGUgLndsZm1jLXRhYmxlLWl0ZW0nICk7XG5cdFx0XHRpZiAoIHRhYmxlX2l0ZW1zLmxlbmd0aCAmJiBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aCApIHtcblx0XHRcdFx0dGFibGVfaXRlbXMuZWFjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgcF9pZCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1yb3ctaWQnICk7XG5cdFx0XHRcdFx0XHRpZiAoICEgJC5ncmVwKFxuXHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoIGl0ZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0ucHJvZHVjdF9pZCA9PT0gcF9pZDsgfVxuXHRcdFx0XHRcdFx0KS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtdGFibGUnICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBwX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHQkKCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrJyApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0JCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QnICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHQkLmVhY2goXG5cdFx0XHRcdHByb2R1Y3RzLFxuXHRcdFx0XHRmdW5jdGlvbiAoIGlkLCBpdGVtRGF0YSApIHtcblx0XHRcdFx0XHR2YXIgc2FtZV9wcm9kdWN0cyA9ICQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyBpdGVtRGF0YS5wcm9kdWN0X2lkICk7XG5cdFx0XHRcdFx0c2FtZV9wcm9kdWN0cy5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgcG9wdXAgPSAkKCAnIycgKyAkKCB0aGlzICkuZGF0YSggJ3BvcHVwLWlkJyApICk7XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLnByaWNlX2NoYW5nZSApIHx8ICQuZm4uV0xGTUMuaXNUcnVlKCBpdGVtRGF0YS5vbl9zYWxlICkgfHwgJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmxvd19zdG9jayApIHx8ICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmJhY2tfaW5fc3RvY2sgKSAmJiBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5sZW5ndGggPiAwICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmJhY2tfaW5fc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBpdGVtRGF0YS5wcmljZV9jaGFuZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpY2UtY2hhbmdlXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcmljZS1jaGFuZ2VcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEub25fc2FsZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9vbi1zYWxlXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9vbi1zYWxlXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmxvd19zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9sb3ctc3RvY2tcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2xvdy1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHZhciBvdXRvZnN0b2NrYm94ID0gJCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jay0nICsgaXRlbURhdGEucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdG91dG9mc3RvY2tib3guZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEuYmFja19pbl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHRoaXMgKS5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXIgIC5wcm9kdWN0cy1jb3VudGVyLW51bWJlcicgKS50ZXh0KCBpdGVtRGF0YS5sZW5ndGggKTtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2FpdGxpc3QgLnRvdGFsLXByb2R1Y3RzIC53bGZtYy10b3RhbC1jb3VudCcgKS50ZXh0KCBpdGVtRGF0YS5sZW5ndGggKTtcblxuXHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3QucHVzaCggaXRlbURhdGEgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblx0LyoqIFNldCB0aGUgd2lzaGxpc3QgaGFzaCBpbiBib3RoIHNlc3Npb24gYW5kIGxvY2FsIHN0b3JhZ2UgKi9cblx0c2V0X3Byb2R1Y3RzX2hhc2g6IGZ1bmN0aW9uICggIHByb2R1Y3RzICkge1xuXHRcdGlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXksIHByb2R1Y3RzICk7XG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSAsIHByb2R1Y3RzICk7XG5cdFx0fVxuXHRcdCQuZm4uV0xGTUMuY2hlY2tfcHJvZHVjdHMoIEpTT04ucGFyc2UoIHByb2R1Y3RzICkgKTtcblx0fSxcblxuXHQvKiogU2V0IHRoZSB3YWl0bGlzdCBoYXNoIGluIGJvdGggc2Vzc2lvbiBhbmQgbG9jYWwgc3RvcmFnZSAqL1xuXHRzZXRfd2FpdGxpc3RfaGFzaDogZnVuY3Rpb24gKCAgcHJvZHVjdHMgKSB7XG5cdFx0aWYgKCAkc3VwcG9ydHNfaHRtbDVfc3RvcmFnZSApIHtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCB3YWl0bGlzdF9oYXNoX2tleSwgcHJvZHVjdHMgKTtcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5ICwgcHJvZHVjdHMgKTtcblxuXHRcdH1cblx0XHQkLmZuLldMRk1DLmNoZWNrX3dhaXRsaXN0X3Byb2R1Y3RzKCBKU09OLnBhcnNlKCBwcm9kdWN0cyApICk7XG5cdH0sXG5cblx0c2V0X2xhbmdfaGFzaDogZnVuY3Rpb24gKCAgbGFuZyApIHtcblx0XHRpZiAoICRzdXBwb3J0c19odG1sNV9zdG9yYWdlICkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oIGxhbmdfaGFzaF9rZXksIGxhbmcgKTtcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oIGxhbmdfaGFzaF9rZXkgLCBsYW5nICk7XG5cdFx0fVxuXHR9LFxuXG5cdHZhbGlkYXRlRW1haWw6IGZ1bmN0aW9uIChlbWFpbCkge1xuXHRcdHZhciByZSA9XG5cdFx0XHQvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLztcblx0XHRyZXR1cm4gcmUudGVzdCggU3RyaW5nKCBlbWFpbCApLnRvTG93ZXJDYXNlKCkgKTtcblx0fSxcblxuXHQvKipcblx0ICogQ2hlY2sgaWYgcGFzc2VkIHZhbHVlIGNvdWxkIGJlIGNvbnNpZGVyZWQgdHJ1ZVxuXHQgKi9cblx0aXNUcnVlOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRyZXR1cm4gdHJ1ZSA9PT0gdmFsdWUgfHwgJ3llcycgPT09IHZhbHVlIHx8ICcxJyA9PT0gdmFsdWUgfHwgMSA9PT0gdmFsdWUgfHwgJ3RydWUnID09PSB2YWx1ZTtcblx0fSxcblxuXHQvKipcblx0ICogQ2hlY2sgaWYgZGV2aWNlIGlzIGFuIElPUyBkZXZpY2Vcblx0ICovXG5cdGlzT1M6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCggL2lwYWR8aXBob25lL2kgKTtcblx0fSxcblxuXHQvKipcblx0ICogQWRkIGxvYWRpbmcgdG8gZWxlbWVudFxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbSBqUXVlcnkgb2JqZWN0XG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0bG9hZGluZzogZnVuY3Rpb24gKCBpdGVtICkge1xuXHRcdGlmICggaXRlbS5maW5kKCAnaScgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0aXRlbS5hZGRDbGFzcyggJ3dsZm1jLWFjdGlvbiB3bGZtYy1sb2FkaW5nJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpdGVtLmFkZENsYXNzKCAnd2xmbWMtYWN0aW9uIHdsZm1jLWxvYWRpbmctYWx0JyApO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUmVtb3ZlIGxvYWRpbmcgdG8gZWxlbWVudFxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbSBqUXVlcnkgb2JqZWN0XG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0dW5sb2FkaW5nOiBmdW5jdGlvbiAoIGl0ZW0gKSB7XG5cdFx0aXRlbS5yZW1vdmVDbGFzcyggJ3dsZm1jLWxvYWRpbmcgd2xmbWMtbG9hZGluZy1hbHQnICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEJsb2NrIGl0ZW0gaWYgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIGl0ZW0galF1ZXJ5IG9iamVjdFxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGJsb2NrOiBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGlmICh0eXBlb2YgJC5mbi5ibG9jayAhPT0gJ3VuZGVmaW5lZCcgJiYgd2xmbWNfbDEwbi5lbmFibGVfYWpheF9sb2FkaW5nKSB7XG5cdFx0XHRpdGVtLmZhZGVUbyggJzQwMCcsICcwLjYnICkuYmxvY2soXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtZXNzYWdlOiBudWxsLFxuXHRcdFx0XHRcdG92ZXJsYXlDU1M6IHtcblx0XHRcdFx0XHRcdGJhY2tncm91bmQgICAgOiAndHJhbnNwYXJlbnQgdXJsKCcgKyB3bGZtY19sMTBuLmFqYXhfbG9hZGVyX3VybCArICcpIG5vLXJlcGVhdCBjZW50ZXInLFxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZFNpemU6ICc0MHB4IDQwcHgnLFxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cblx0dGFibGVfYmxvY2s6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mICQuZm4uYmxvY2sgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0JCggJy53bGZtYy13aXNobGlzdC10YWJsZS13cmFwcGVyLCAud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUtd3JhcHBlcicgKS5mYWRlVG8oICc0MDAnLCAnMC42JyApLmJsb2NrKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWVzc2FnZTogbnVsbCxcblx0XHRcdFx0XHRvdmVybGF5Q1NTOiB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kICAgIDogJ3RyYW5zcGFyZW50IHVybCgnICsgd2xmbWNfbDEwbi5hamF4X2xvYWRlcl91cmwgKyAnKSBuby1yZXBlYXQgY2VudGVyJyxcblx0XHRcdFx0XHRcdGJhY2tncm91bmRTaXplOiAnODBweCA4MHB4Jyxcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBVbmJsb2NrIGl0ZW0gaWYgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIGl0ZW0galF1ZXJ5IG9iamVjdFxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdHVuYmxvY2s6IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0aWYgKHR5cGVvZiAkLmZuLnVuYmxvY2sgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRpdGVtLnN0b3AoIHRydWUgKS5jc3MoICdvcGFjaXR5JywgJzEnICkudW5ibG9jaygpO1xuXHRcdFx0JCggJy50b29sdGlwX19leHBhbmRlZCcgKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCAndG9vbHRpcF9faGlkZGVuJyApO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ2hlY2sgaWYgY29va2llcyBhcmUgZW5hYmxlZFxuXHQgKlxuXHQgKiBAcmV0dXJuIGJvb2xlYW5cblx0ICovXG5cdGlzX2Nvb2tpZV9lbmFibGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKG5hdmlnYXRvci5jb29raWVFbmFibGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBzZXQgYW5kIHJlYWQgY29va2llLlxuXHRcdGRvY3VtZW50LmNvb2tpZSA9ICdjb29raWV0ZXN0PTEnO1xuXHRcdHZhciByZXQgICAgICAgICA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKCAnY29va2lldGVzdD0nICkgIT09IC0xO1xuXG5cdFx0Ly8gZGVsZXRlIGNvb2tpZS5cblx0XHRkb2N1bWVudC5jb29raWUgPSAnY29va2lldGVzdD0xOyBleHBpcmVzPVRodSwgMDEtSmFuLTE5NzAgMDA6MDA6MDEgR01UJztcblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0c2V0Q29va2llOiBmdW5jdGlvbiAoY29va2llX25hbWUsIHZhbHVlKSB7XG5cdFx0dmFyIGV4ZGF0ZSA9IG5ldyBEYXRlKCk7XG5cdFx0ZXhkYXRlLnNldERhdGUoIGV4ZGF0ZS5nZXREYXRlKCkgKyAoMzY1ICogMjUpICk7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gY29va2llX25hbWUgKyBcIj1cIiArIGVzY2FwZSggdmFsdWUgKSArIFwiOyBleHBpcmVzPVwiICsgZXhkYXRlLnRvVVRDU3RyaW5nKCkgKyBcIjsgcGF0aD0vXCI7XG5cdH0sXG5cblx0dXBkYXRlVVJMUGFyYW1ldGVyOiBmdW5jdGlvbiAodXJsLCBwYXJhbSwgcGFyYW1WYWwpIHtcblx0XHR2YXIgbmV3QWRkaXRpb25hbFVSTCA9IFwiXCI7XG5cdFx0dmFyIHRlbXBBcnJheSAgICAgICAgPSB1cmwuc3BsaXQoIFwiP1wiICk7XG5cdFx0dmFyIGJhc2VVUkwgICAgICAgICAgPSB0ZW1wQXJyYXlbMF07XG5cdFx0dmFyIGFkZGl0aW9uYWxVUkwgICAgPSB0ZW1wQXJyYXlbMV07XG5cdFx0dmFyIHRlbXAgICAgICAgICAgICAgPSBcIlwiO1xuXHRcdGlmIChhZGRpdGlvbmFsVVJMKSB7XG5cdFx0XHR0ZW1wQXJyYXkgPSBhZGRpdGlvbmFsVVJMLnNwbGl0KCBcIiZcIiApO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHRlbXBBcnJheVtpXS5zcGxpdCggJz0nIClbMF0gIT09IHBhcmFtKSB7XG5cdFx0XHRcdFx0bmV3QWRkaXRpb25hbFVSTCArPSB0ZW1wICsgdGVtcEFycmF5W2ldO1xuXHRcdFx0XHRcdHRlbXAgICAgICAgICAgICAgID0gXCImXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgcm93c190eHQgPSB0ZW1wICsgXCJcIiArIHBhcmFtICsgXCI9XCIgKyBwYXJhbVZhbC5yZXBsYWNlKCAnIycsICcnICk7XG5cdFx0cmV0dXJuIGJhc2VVUkwgKyBcIj9cIiArIG5ld0FkZGl0aW9uYWxVUkwgKyByb3dzX3R4dDtcblx0fSxcblxuXHRnZXRVcmxQYXJhbWV0ZXI6IGZ1bmN0aW9uICh1cmwsIHNQYXJhbSkge1xuXHRcdHZhciBzUGFnZVVSTCAgICAgID0gZGVjb2RlVVJJQ29tcG9uZW50KCB1cmwuc3Vic3RyaW5nKCAxICkgKSxcblx0XHRcdHNVUkxWYXJpYWJsZXMgPSBzUGFnZVVSTC5zcGxpdCggL1smfD9dKy8gKSxcblx0XHRcdHNQYXJhbWV0ZXJOYW1lLFxuXHRcdFx0aTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBzVVJMVmFyaWFibGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzUGFyYW1ldGVyTmFtZSA9IHNVUkxWYXJpYWJsZXNbaV0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHRpZiAoc1BhcmFtZXRlck5hbWVbMF0gPT09IHNQYXJhbSkge1xuXHRcdFx0XHRyZXR1cm4gc1BhcmFtZXRlck5hbWVbMV0gPT09IHVuZGVmaW5lZCA/IHRydWUgOiBzUGFyYW1ldGVyTmFtZVsxXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG59O1xuO1xuXG5cdFx0XG50b2FzdHIub3B0aW9ucyA9IHtcblx0dGFwVG9EaXNtaXNzOiB0cnVlLFxuXHR0b2FzdENsYXNzOiAndG9hc3QnLFxuXHRjb250YWluZXJJZDogJ3RvYXN0LWNvbnRhaW5lcicsXG5cdGRlYnVnOiBmYWxzZSxcblx0Y2xvc2VCdXR0b246IGZhbHNlLFxuXHRzaG93TWV0aG9kOiAnZmFkZUluJyxcblx0c2hvd0R1cmF0aW9uOiAzMDAsXG5cdHNob3dFYXNpbmc6ICdzd2luZycsXG5cdG9uU2hvd246IHVuZGVmaW5lZCxcblx0aGlkZU1ldGhvZDogJ2ZhZGVPdXQnLFxuXHRoaWRlRHVyYXRpb246IDEwMDAsXG5cdGhpZGVFYXNpbmc6ICdzd2luZycsXG5cdG9uSGlkZGVuOiB1bmRlZmluZWQsXG5cdGNsb3NlTWV0aG9kOiBmYWxzZSxcblx0Y2xvc2VEdXJhdGlvbjogZmFsc2UsXG5cdGNsb3NlRWFzaW5nOiBmYWxzZSxcblx0Y2xvc2VPbkhvdmVyOiB0cnVlLFxuXHRleHRlbmRlZFRpbWVPdXQ6IDIwMDAwLFxuXHRpY29uQ2xhc3Nlczoge1xuXHRcdGVycm9yOiAndG9hc3QtZXJyb3InLFxuXHRcdGluZm86ICd0b2FzdC1pbmZvJyxcblx0XHRzdWNjZXNzOiAndG9hc3Qtc3VjY2VzcycsXG5cdFx0d2FybmluZzogJ3RvYXN0LXdhcm5pbmcnXG5cdH0sXG5cdGljb25DbGFzczogJ3RvYXN0LWluZm8nLFxuXHRwb3NpdGlvbkNsYXNzOiB3bGZtY19sMTBuLnRvYXN0X3Bvc2l0aW9uID09PSAnZGVmYXVsdCcgPyAod2xmbWNfbDEwbi5pc19ydGwgPyAndG9hc3QtdG9wLXJpZ2h0JyA6ICd0b2FzdC10b3AtbGVmdCcpIDogd2xmbWNfbDEwbi50b2FzdF9wb3NpdGlvbixcblx0dGltZU91dDogNTAwMCxcblx0dGl0bGVDbGFzczogJ3RvYXN0LXRpdGxlJyxcblx0bWVzc2FnZUNsYXNzOiAndG9hc3QtbWVzc2FnZScsXG5cdGVzY2FwZUh0bWw6IGZhbHNlLFxuXHR0YXJnZXQ6ICdib2R5Jyxcblx0bmV3ZXN0T25Ub3A6IHRydWUsXG5cdHByZXZlbnREdXBsaWNhdGVzOiBmYWxzZSxcblx0cHJvZ3Jlc3NCYXI6IHRydWUsXG5cdHByb2dyZXNzQ2xhc3M6ICd0b2FzdC1wcm9ncmVzcycsXG5cdHJ0bDogKHdsZm1jX2wxMG4uaXNfcnRsKSA/IHRydWUgOiBmYWxzZVxufVxuO1xuXG5cdFx0XG5pZiAoIHdsZm1jX2wxMG4uaXNfc2F2ZV9mb3JfbGF0ZXJfZW5hYmxlZCAmJiB3bGZtY19sMTBuLmlzX3NhdmVfZm9yX2xhdGVyX3BvcHVwX3JlbW92ZV9lbmFibGVkICkge1xuXG5cdCQoICcud29vY29tbWVyY2UtY2FydC1mb3JtIC5wcm9kdWN0LXJlbW92ZSBhLnJlbW92ZScgKS5vZmYoICdjbGljaycgKS51bmJpbmQoICdjbGljaycgKS5kYXRhKCAnZXZlbnRzJywgbnVsbCApO1xuXHQkKCAnYm9keScgKS5vbihcblx0XHQnY2xpY2snLFxuXHRcdCdmb3JtLndvb2NvbW1lcmNlLWNhcnQtZm9ybSBhLnJlbW92ZScsXG5cdFx0ZnVuY3Rpb24oZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dmFyIHQgPSAkKCB0aGlzICk7XG5cblx0XHRcdHJlbW92ZV9pdGVtX3VybCA9IHQuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdHZhciBlbGVtICAgICAgICAgICA9ICQoICcjYWRkX3RvX3NhdmVfZm9yX2xhdGVyX3BvcHVwJyApO1xuXHRcdFx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRhYnNvbHV0ZTogZmFsc2UsXG5cdFx0XHRcdGNvbG9yOiAnIzMzMycsXG5cdFx0XHRcdHRyYW5zaXRpb246ICdhbGwgMC4zcycsXG5cdFx0XHRcdGhvcml6b250YWw6IGVsZW0uZGF0YSggJ2hvcml6b250YWwnICksXG5cdFx0XHRcdHZlcnRpY2FsOiBlbGVtLmRhdGEoICd2ZXJ0aWNhbCcgKVxuXHRcdFx0fTtcblx0XHRcdGVsZW0ucG9wdXAoIGRlZmF1bHRPcHRpb25zICk7XG5cdFx0XHRlbGVtLnBvcHVwKCAnc2hvdycgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG59XG47XG5cblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J3dsZm1jX2luaXQnLFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9maXhfb25faW1hZ2Vfc2luZ2xlX3Bvc2l0aW9uKCk7XG5cblx0XHRcdFx0dmFyIHQgICAgICAgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGIgICAgICAgICAgICAgICAgICAgICAgID0gJCggJ2JvZHknICksXG5cdFx0XHRcdFx0Y2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSAodHlwZW9mICh3Y19hZGRfdG9fY2FydF9wYXJhbXMpICE9PSAndW5kZWZpbmVkJyAmJiB3Y19hZGRfdG9fY2FydF9wYXJhbXMgIT09IG51bGwpID8gd2NfYWRkX3RvX2NhcnRfcGFyYW1zLmNhcnRfcmVkaXJlY3RfYWZ0ZXJfYWRkIDogJyc7XG5cdFx0XHRcdFxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1saXN0IGJ1dHRvbltuYW1lPVwiYXBwbHlfYnVsa19hY3Rpb25zXCJdJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0bGV0IGVsZW0gPSAgJCggdGhpcyApLmNsb3Nlc3QoJy5hY3Rpb24td3JhcHBlcicpLmZpbmQoJ3NlbGVjdFtuYW1lPVwiYnVsa19hY3Rpb25zXCJdJyk7XG5cdFx0bGV0IHF1YW50aXR5X2ZpZWxkcyA9ICQoIHRoaXMgKS5jbG9zZXN0KCdmb3JtJykuZmluZCgnaW5wdXQucXR5Jyk7XG5cdFx0aWYgKCBlbGVtLmxlbmd0aCA+IDAgJiYgJ2RlbGV0ZScgPT09IGVsZW0udmFsKCkgJiYgcXVhbnRpdHlfZmllbGRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRxdWFudGl0eV9maWVsZHMuYXR0ciggXCJkaXNhYmxlZFwiLHRydWUgKTtcblx0XHR9XG5cdH1cbik7XG5cbmIub24oXG5cdCdjaGFuZ2UnLFxuXHQnI2J1bGtfYWRkX3RvX2NhcnQsI2J1bGtfYWRkX3RvX2NhcnQyJyxcblx0ZnVuY3Rpb24gKCkge1xuXHRcdHZhciB0ICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0Y2hlY2tib3hlcyA9IHQuY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkuZmluZCggJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXTpub3QoOmRpc2FibGVkKScgKTtcblx0XHRpZiAodC5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRjaGVja2JveGVzLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydCcgKS5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0MicgKS5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjaGVja2JveGVzLnByb3AoICdjaGVja2VkJywgZmFsc2UgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0JyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydDInICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdH1cblx0fVxuKTtcblxuXG5iLm9uKFxuXHQnc3VibWl0Jyxcblx0Jy53bGZtYy1wb3B1cC1mb3JtJyxcblx0ZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxudC5vbihcblx0J2ZvdW5kX3ZhcmlhdGlvbicsXG5cdGZ1bmN0aW9uIChldiwgdmFyaWF0aW9uKSB7XG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgICAgID0gdC5kYXRhKCAncHJvZHVjdF9pZCcgKSxcblx0XHRcdHZhcmlhdGlvbl9kYXRhICAgICAgICA9IHZhcmlhdGlvbjtcblx0XHR2YXJpYXRpb25fZGF0YS5wcm9kdWN0X2lkID0gcHJvZHVjdF9pZDtcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19zaG93X3ZhcmlhdGlvbicsIHZhcmlhdGlvbl9kYXRhICk7XG5cdH1cbik7XG5cbnQub24oICd3bGZtY19yZWxvYWRfZnJhZ21lbnRzJywgJC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cyApO1xuXG50Lm9uKFxuXHQnd2xmbWNfZnJhZ21lbnRzX2xvYWRlZCcsXG5cdGZ1bmN0aW9uIChldiwgb3JpZ2luYWwsIHVwZGF0ZSwgZmlyc3RMb2FkKSB7XG5cdFx0aWYgKCAhIGZpcnN0TG9hZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQoICcudmFyaWF0aW9uc19mb3JtJyApLmZpbmQoICcudmFyaWF0aW9ucyBzZWxlY3QnICkubGFzdCgpLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cbik7XG5cbi8qID09PSBUQUJTID09PSAqL1xuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy10YWJzIGE6bm90KC5leHRlcm5hbC1saW5rKScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGNvbnRlbnQgPSAkKCB0aGlzICkuZGF0YSggJ2NvbnRlbnQnICk7XG5cdFx0JCggJy53bGZtYy10YWItY29udGVudCcgKS5oaWRlKCk7XG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtdGFicy13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnYWN0aXZlLXRhYi1jYXJ0IGFjdGl2ZS10YWItc2F2ZS1mb3ItbGF0ZXInICk7XG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmFkZENsYXNzKCAnYWN0aXZlLXRhYi0nICsgY29udGVudCApO1xuXHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLXRhYnMtd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLXRhYnMgYScgKS5yZW1vdmVDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXHRcdCQoIHRoaXMgKS5hZGRDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXHRcdCQoICcud2xmbWNfY29udGVudF8nICsgY29udGVudCApLnNob3coKTtcblx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoICcnLCAnJywgJC5mbi5XTEZNQy51cGRhdGVVUkxQYXJhbWV0ZXIoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBcInRhYlwiLCBjb250ZW50ICkgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbi8qID09PSBHRFBSID09PSAqL1xuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1nZHByLWJ0bicsXG5cdGZ1bmN0aW9uKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgZWxlbSAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRhY3Rpb25fdHlwZSA9IGVsZW0uZGF0YSggJ2FjdGlvbicgKSxcblx0XHRcdGNpZCAgICAgICAgID0gZWxlbS5kYXRhKCAnY2lkJyApO1xuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuZ2Rwcl9hY3Rpb24sXG5cdFx0XHRcdFx0bm9uY2U6IGVsZW0uZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0J2FjdGlvbl90eXBlJyA6IGFjdGlvbl90eXBlLFxuXHRcdFx0XHRcdCdjaWQnIDogY2lkXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGlmICggISBkYXRhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKCAnLndsZm1jLWdkcHItbm90aWNlLXdyYXBwZXIsIC53bGZtYy11bnN1YnNjcmliZS1ub3RpY2Utd3JhcHBlcicpLnJlbW92ZSgpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHR9XG5cdFx0KTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG47XG5cdFx0XHRcdFxudC5vbihcblx0J2NsaWNrJyxcblx0J2JvZHkuZWxlbWVudG9yLWVkaXRvci1hY3RpdmUgLndsZm1jLWxpc3RzLWhlYWRlciBhLGJvZHkuZWxlbWVudG9yLWVkaXRvci1hY3RpdmUgYS53bGZtYy1vcGVuLWxpc3QtbGluaycsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHRcdGlmIChocmVmICYmIGhyZWYgIT09ICcjJyAmJiBocmVmICE9PSAnIyEnKSB7XG5cdFx0XHQkLmZuLldMRk1DLmJsb2NrKCAkKCAnLndsZm1jLXRhYi1jb250ZW50JyApICk7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkLmFqYXgoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR1cmw6IGhyZWYsXG5cdFx0XHRcdFx0dHlwZTogJ0dFVCcsXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdodG1sJyxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dmFyICRyZXNwb25zZSA9ICQoIGRhdGEgKSxcblx0XHRcdFx0XHRcdFx0JGhlYWRlciAgID0gJHJlc3BvbnNlLmZpbmQoICcud2xmbWMtbGlzdHMtaGVhZGVyJyApLFxuXHRcdFx0XHRcdFx0XHQkY29udGVudCAgPSAkcmVzcG9uc2UuZmluZCggJy53bGZtYy10YWItY29udGVudCcgKTtcblx0XHRcdFx0XHRcdGlmICgkY29udGVudCkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXRhYi1jb250ZW50JyApLnJlcGxhY2VXaXRoKCAkY29udGVudCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCRoZWFkZXIpIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1saXN0cy1oZWFkZXInICkucmVwbGFjZVdpdGgoICRoZWFkZXIgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChocmVmICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZikge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoIHtwYXRoOiBocmVmfSwgJycsIGhyZWYgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG4pO1xuO1xuXHRcdFx0XHQvKiA9PT0gV0lTSExJU1QgPT09ICovXG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfYWRkX3RvX3dpc2hsaXN0Jyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGlmICggcHJvZHVjdF9hZGRpbmcgJiYgQXJyYXkuaXNBcnJheShwcm9kdWN0X2luX2xpc3QpICYmICEgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCApIHtcblx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9hZGRpbmcgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHBhcmVudF9wcm9kdWN0X2lkID0gdC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcgKSxcblx0XHRcdGVsX3dyYXAgICAgICAgICAgID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdC0nICsgcHJvZHVjdF9pZCApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmFkZF90b193aXNobGlzdF9hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGFkZF90b193aXNobGlzdDogcHJvZHVjdF9pZCxcblx0XHRcdFx0cHJvZHVjdF90eXBlOiB0LmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScgKSxcblx0XHRcdFx0Ly8gd2lzaGxpc3RfaWQ6IHQuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnICksXG5cdFx0XHRcdC8vIGZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKCBwcm9kdWN0X2lkIClcblx0XHRcdH07XG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2FkZF90b193aXNobGlzdF9kYXRhJywgW3QsIGRhdGFdICkpIHtcblx0XHRcdGRhdGEgPSBmaWx0ZXJlZF9kYXRhO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyZW50X3Byb2R1Y3RfZm9ybTtcblxuXHRcdGlmICggJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJykubGVuZ3RoICkge1xuXG5cdFx0XHRsZXQgYnV0dG9uID0gJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpO1xuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSBidXR0b24uY2xvc2VzdCgnZm9ybScpLmVxKCAwICk7XG5cblx0XHR9XG5cblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRpZiAoICB0eXBlb2YgY3VycmVudF9wcm9kdWN0X2Zvcm0gIT09ICd1bmRlZmluZWQnICYmIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmxlbmd0aCA+IDApIHtcblx0XHRcdC8qY3VycmVudF9wcm9kdWN0X2Zvcm0uZmluZCggXCJpbnB1dFtuYW1lPSdhZGQtdG8tY2FydCddXCIgKS5hdHRyKCBcImRpc2FibGVkXCIsdHJ1ZSApO1xuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0uZmluZCggXCJpbnB1dFtuYW1lPSdhZGQtdG8tY2FydCddXCIgKS5yZW1vdmVBdHRyKCBcImRpc2FibGVkXCIgKTsqL1xuXHRcdFx0Zm9ybURhdGEgPSBuZXcgRm9ybURhdGEoIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmdldCggMCApICk7XG5cdFx0XHQvKiQuZWFjaChcblx0XHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0sXG5cdFx0XHRcdGZ1bmN0aW9uKCBpbmRleCwgZWxlbWVudCApIHtcblx0XHRcdFx0XHQkKCBlbGVtZW50ICkuZmluZCggJ2Rpdi5jb21wb3NpdGVfY29tcG9uZW50JyApLm5vdCggJzp2aXNpYmxlJyApLmVhY2goXG5cdFx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGlkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLWl0ZW1faWQnICk7XG5cdFx0XHRcdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCggJ3djY3BfY29tcG9uZW50X3NlbGVjdGlvbl9uaWxbJyArIGlkICsgJ10nICwgJzEnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0KTsqL1xuXHRcdFx0Zm9ybURhdGEuZGVsZXRlKCAnYWRkLXRvLWNhcnQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBhZGRfdG9fY2FydF9saW5rID0gdC5jbG9zZXN0KCAnLnByb2R1Y3QucG9zdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKS5maW5kKCAnLmFkZF90b19jYXJ0X2J1dHRvbicgKTtcblx0XHRcdGlmICggYWRkX3RvX2NhcnRfbGluay5sZW5ndGggKSB7XG5cdFx0XHRcdGRhdGEucXVhbnRpdHkgPSBhZGRfdG9fY2FydF9saW5rLmF0dHIoICdkYXRhLXF1YW50aXR5JyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCQuZWFjaChcblx0XHRcdGRhdGEsXG5cdFx0XHRmdW5jdGlvbihrZXksdmFsdWVPYmope1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoIGtleSAsIHR5cGVvZiB2YWx1ZU9iaiA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeSggdmFsdWVPYmogKSA6IHZhbHVlT2JqICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGpRdWVyeSggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICd3bGZtY19hZGRpbmdfdG9fd2lzaGxpc3QnICk7XG5cblx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc19jb29raWVfZW5hYmxlZCgpKSB7XG5cdFx0XHRwcm9kdWN0X2FkZGluZyA9IGZhbHNlO1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0Ly9kYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHByb2R1Y3RfYWRkaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cHJvZHVjdF9hZGRpbmcgPSBmYWxzZTtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX3Jlc3VsdCAgPSByZXNwb25zZS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZSxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXHRcdFx0XHRcdGlmIChyZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyB8fCByZXNwb25zZV9yZXN1bHQgPT09ICdleGlzdHMnKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZS5pdGVtX2lkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LnB1c2goXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpc2hsaXN0X2lkOiByZXNwb25zZS53aXNobGlzdF9pZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbV9pZDogcmVzcG9uc2UuaXRlbV9pZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pZDogcGFyc2VJbnQoIHByb2R1Y3RfaWQgKSxcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBwb3B1cF9pZCA9IGVsX3dyYXAuYXR0ciggJ2RhdGEtcG9wdXAtaWQnICk7XG5cblx0XHRcdFx0XHRcdGlmIChwb3B1cF9pZCkge1xuXG5cdFx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgICA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR2YXIgZWxlbSAgICAgICAgICAgPSAkKCAnIycgKyBwb3B1cF9pZCApO1xuXHRcdFx0XHRcdFx0XHR2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdFx0YWJzb2x1dGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAnIzMzMycsXG5cdFx0XHRcdFx0XHRcdFx0dHJhbnNpdGlvbjogJ2FsbCAwLjNzJyxcblx0XHRcdFx0XHRcdFx0XHRob3Jpem9udGFsOiBlbGVtLmRhdGEoICdob3Jpem9udGFsJyApLFxuXHRcdFx0XHRcdFx0XHRcdHZlcnRpY2FsOiBlbGVtLmRhdGEoICd2ZXJ0aWNhbCcgKVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRlbGVtLnBvcHVwKCBkZWZhdWx0T3B0aW9ucyApO1xuXHRcdFx0XHRcdFx0XHQkKCcjd2xmbWMtdG9vbHRpcCcpXG5cdFx0XHRcdFx0XHRcdFx0LmNzcyh7XG5cdFx0XHRcdFx0XHRcdFx0XHQndG9wJzogJzAnLFxuXHRcdFx0XHRcdFx0XHRcdFx0J2xlZnQnOiAnMCdcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygpXG5cdFx0XHRcdFx0XHRcdFx0LmFkZENsYXNzKCd0b29sdGlwX19oaWRkZW4nKTtcblx0XHRcdFx0XHRcdFx0ZWxlbS5wb3B1cCggJ3Nob3cnICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfYWRkZWRfdGV4dCApICYmIHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X2FkZGVkX3RleHQgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCByZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS53aXNobGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsICd3aXNobGlzdCcsIHJlc3BvbnNlLmxvYWRfYXV0b21hdGlvbl9ub25jZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgJiYgd2xmbWNfbDEwbi5jbGlja19iZWhhdmlvciA9PT0gJ2FkZC1yZWRpcmVjdCcgKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdsZm1jX2wxMG4ud2lzaGxpc3RfcGFnZV91cmw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cblx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfYWRkZWRfdG9fd2lzaGxpc3QnLCBbdCwgZWxfd3JhcF0gKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FqYXhfYWRkX3RvX2NhcnQ6bm90KC5kaXNhYmxlZCknLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRpdGVtX2lkICAgICA9IHQuYXR0ciggJ2RhdGEtaXRlbV9pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkID0gdC5hdHRyKCAnZGF0YS13aXNobGlzdF9pZCcgKSxcblx0XHRcdGRhdGEgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfdG9fY2FydF9hY3Rpb24sXG5cdFx0XHRcdG5vbmNlOiB0LmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0bGlkOiBpdGVtX2lkLFxuXHRcdFx0XHR3aWQ6IHdpc2hsaXN0X2lkLFxuXHRcdFx0fTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dC5yZW1vdmVDbGFzcyggJ2FkZGVkJyApO1xuXHRcdHQuYWRkQ2xhc3MoICdsb2FkaW5nJyApO1xuXG5cdFx0Ly8gQWxsb3cgM3JkIHBhcnRpZXMgdG8gdmFsaWRhdGUgYW5kIHF1aXQgZWFybHkuXG5cdFx0aWYgKCBmYWxzZSA9PT0gJCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXJIYW5kbGVyKCAnc2hvdWxkX3NlbmRfYWpheF9yZXF1ZXN0LmFkZGluZ190b19jYXJ0JywgWyB0IF0gKSApIHtcblx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWpheF9yZXF1ZXN0X25vdF9zZW50LmFkZGluZ190b19jYXJ0JywgWyBmYWxzZSwgZmFsc2UsIHQgXSApO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkaW5nX3RvX2NhcnQnLCBbIHQsIGRhdGEgXSApO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG5cdFx0XHRcdFx0aWYgKCAhIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UuZXJyb3IgfHwgKCByZXNwb25zZS5zdWNjZXNzICYmICEgJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlLnN1Y2Nlc3MgKSApICkge1xuXHRcdFx0XHRcdFx0aWYgKCByZXNwb25zZS5wcm9kdWN0X3VybCApIHtcblx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uID0gcmVzcG9uc2UucHJvZHVjdF91cmw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggJycgIT09IHdsZm1jX2wxMG4ubGFiZWxzLmZhaWxlZF9hZGRfdG9fY2FydF9tZXNzYWdlICkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLmZhaWxlZF9hZGRfdG9fY2FydF9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIFJlZGlyZWN0IHRvIGNhcnQgb3B0aW9uLlxuXHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggd2NfYWRkX3RvX2NhcnRfcGFyYW1zLmNhcnRfcmVkaXJlY3RfYWZ0ZXJfYWRkICkgKSB7XG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3VybDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoJ3djX2ZyYWdtZW50X3JlZnJlc2gnKTtcblx0XHRcdFx0XHRcdC8vIFRyaWdnZXIgZXZlbnQgc28gdGhlbWVzIGNhbiByZWZyZXNoIG90aGVyIGFyZWFzLlxuXHRcdFx0XHRcdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhZGRlZF90b19jYXJ0JywgWyByZXNwb25zZS5mcmFnbWVudHMsIHJlc3BvbnNlLmNhcnRfaGFzaCwgdCBdICk7XG5cblx0XHRcdFx0XHRcdGlmICggJycgIT09IHdsZm1jX2wxMG4ubGFiZWxzLmFkZGVkX3RvX2NhcnRfbWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHdsZm1jX2wxMG4ubGFiZWxzLmFkZGVkX3RvX2NhcnRfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZS5tZXNzYWdlICYmICcnICE9PSByZXNwb25zZS5tZXNzYWdlICkge1xuXHRcdFx0XHRcdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhZGRfdG9fY2FydF9tZXNzYWdlJywgWyByZXNwb25zZS5tZXNzYWdlLCB0XSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWJ0bi1sb2dpbi1uZWVkJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLmxvZ2luX25lZWQgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfYWxyZWFkeV9pbl93aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5hbHJlYWR5X2luX3dpc2hsaXN0X3RleHQgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtd2lzaGxpc3QtdGFibGUgLnJlbW92ZV9mcm9tX3dpc2hsaXN0Jyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgPSAkKCB0aGlzICk7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciB0YWJsZSAgICAgICAgICA9IHQucGFyZW50cyggJy53bGZtYy13aXNobGlzdC1pdGVtcy13cmFwcGVyJyApLFxuXHRcdFx0cm93ICAgICAgICAgICAgPSB0LnBhcmVudHMoICdbZGF0YS1yb3ctaWRdJyApLFxuXHRcdFx0ZGF0YV9yb3dfaWQgICAgPSByb3cuZGF0YSggJ3Jvdy1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkICAgID0gdGFibGUuZGF0YSggJ2lkJyApLFxuXHRcdFx0d2lzaGxpc3RfdG9rZW4gPSB0YWJsZS5kYXRhKCAndG9rZW4nICksXG5cdFx0XHRkYXRhICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMucmVtb3ZlX2Zyb21fd2lzaGxpc3RfYWN0aW9uLFxuXHRcdFx0XHRub25jZTogdC5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdHJlbW92ZV9mcm9tX3dpc2hsaXN0OiBkYXRhX3Jvd19pZCxcblx0XHRcdFx0d2lzaGxpc3RfaWQ6IHdpc2hsaXN0X2lkLFxuXHRcdFx0XHR3aXNobGlzdF90b2tlbjogd2lzaGxpc3RfdG9rZW4sXG5cdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoIGRhdGFfcm93X2lkIClcblx0XHRcdH07XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5ibG9jayggcm93ICk7XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLnVuYmxvY2soIHJvdyApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGxldCBpO1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHQvKmlmICh0eXBlb2YgZGF0YS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGRhdGEucmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHRyb3cuYWRkQ2xhc3MoJ2Rpc2FibGVkLXJvdycpO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fbGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPD0gcHJvZHVjdF9jb3VudCAtIDE7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3RbaV0ud2lzaGxpc3RfaWQgPT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl9saXN0W2ldLnByb2R1Y3RfaWQgPT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2lzaGxpc3QnLCBbdCwgcm93ICwgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl93YWl0bGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl93YWl0bGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ud2lzaGxpc3RfaWQgPT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl93YWl0bGlzdFtpXS5wcm9kdWN0X2lkID09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX3JlbW92ZWRfZnJvbV93YWl0bGlzdCcsIFt0LCByb3cgLCBkYXRhXSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3dhaXRsaXN0X2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX3dhaXRsaXN0ICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljayB0b3VjaGVuZCcsXG5cdCcud2xmbWMtcHJvZHVjdHMtY291bnRlci13aXNobGlzdCAucmVtb3ZlX2Zyb21fd2lzaGxpc3QsLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2FpdGxpc3QgLnJlbW92ZV9mcm9tX3dpc2hsaXN0Jyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgPSAkKCB0aGlzICk7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciB0YWJsZSAgICAgICAgICA9IHQucGFyZW50cyggJy53bGZtYy13aXNobGlzdC1pdGVtcy13cmFwcGVyJyApLFxuXHRcdFx0cm93ICAgICAgICAgICAgPSB0LnBhcmVudHMoICdbZGF0YS1yb3ctaWRdJyApLFxuXHRcdFx0ZGF0YV9yb3dfaWQgICAgPSByb3cuZGF0YSggJ3Jvdy1pZCcgKSxcblx0XHRcdGRhdGFfaXRlbV9pZCAgID0gcm93LmRhdGEoICdpdGVtLWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgICAgPSByb3cuZGF0YSggJ3dpc2hsaXN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfdG9rZW4gPSByb3cuZGF0YSggJ3dpc2hsaXN0LXRva2VuJyApLFxuXHRcdFx0bGlzdF90YWJsZSAgICAgICAgICAgICAgICAgID0gJCgnLndsZm1jLXdpc2hsaXN0LWZvcm0gLndsZm1jLXdpc2hsaXN0LXRhYmxlJyksXG5cdFx0XHRkYXRhICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMucmVtb3ZlX2Zyb21fd2lzaGxpc3RfYWN0aW9uLFxuXHRcdFx0XHRub25jZTogdC5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdHJlbW92ZV9mcm9tX3dpc2hsaXN0OiBkYXRhX3Jvd19pZCxcblx0XHRcdFx0d2lzaGxpc3RfaWQ6IHdpc2hsaXN0X2lkLFxuXHRcdFx0XHR3aXNobGlzdF90b2tlbjogd2lzaGxpc3RfdG9rZW4sXG5cdFx0XHRcdG1lcmdlX2xpc3RzOiB3bGZtY19sMTBuLm1lcmdlX2xpc3RzLFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKCBkYXRhX3Jvd19pZCApXG5cdFx0XHR9O1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLnJlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0dmFyIGxvYWRfZnJhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fbGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0W2ldLndpc2hsaXN0X2lkID09PSB3aXNobGlzdF9pZCAmJiBwcm9kdWN0X2luX2xpc3RbaV0ucHJvZHVjdF9pZCA9PT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2lzaGxpc3QnLCBbdCwgcm93LCBkYXRhXSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gcHJvZHVjdF9jb3VudCAtIDE7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl93YWl0bGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl93YWl0bGlzdFtpXS53aXNobGlzdF9pZCA9PT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl93YWl0bGlzdFtpXS5wcm9kdWN0X2lkID09PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2FpdGxpc3QnLCBbdCwgcm93LCBkYXRhXSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3dhaXRsaXN0X2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX3dhaXRsaXN0ICkgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCB0LmNsb3Nlc3QoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdC8vJCggJy53bGZtYy13aXNobGlzdC1mb3JtJyApLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyICAucHJvZHVjdHMtY291bnRlci1udW1iZXInICkudGV4dCggZGF0YS5jb3VudCApO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2lzaGxpc3QgLnRvdGFsLXByb2R1Y3RzIC53bGZtYy10b3RhbC1jb3VudCcgKS50ZXh0KCBkYXRhLmNvdW50ICk7XG5cblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3Qud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBkYXRhX3Jvd19pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCB0LmNsb3Nlc3QoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdC8vJCggJy53bGZtYy13aXNobGlzdC1mb3JtJyApLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyICAucHJvZHVjdHMtY291bnRlci1udW1iZXInICkudGV4dCggZGF0YS5jb3VudCApO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2FpdGxpc3QgLnRvdGFsLXByb2R1Y3RzIC53bGZtYy10b3RhbC1jb3VudCcgKS50ZXh0KCBkYXRhLmNvdW50ICk7XG5cblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3Qud2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyBkYXRhX3Jvd19pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBsaXN0X3RhYmxlLmxlbmd0aCA+IDAgJiYgcGFyc2VJbnQoIHdpc2hsaXN0X2lkICkgPT09IHBhcnNlSW50KCBsaXN0X3RhYmxlLmF0dHIoICdkYXRhLWlkJyApICkgKSB7XG5cdFx0XHRcdFx0XHRcdGxpc3RfdGFibGUuZmluZCggJ1tkYXRhLWl0ZW0taWQ9XCInICsgZGF0YV9pdGVtX2lkICsgJ1wiXScgKS5hZGRDbGFzcygnZGlzYWJsZWQtcm93Jyk7XG5cdFx0XHRcdFx0XHRcdGxvYWRfZnJhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoKGRhdGEuY291bnQgPCAxIHx8ICEgdGFibGUuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkubGVuZ3RoKSApIHtcblx0XHRcdFx0XHRcdFx0bG9hZF9mcmFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCBsb2FkX2ZyYWcgKSB7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8qaWYgKChkYXRhLmNvdW50IDwgMSB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkgJiYgdHlwZW9mIGRhdGEuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2RlbGV0ZV9pdGVtJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCA9IHQuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnICksXG5cdFx0XHRpdGVtX2lkICAgICA9IHQuYXR0ciggJ2RhdGEtaXRlbS1pZCcgKSxcblx0XHRcdGVsX3dyYXAgICAgID0gJCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIHByb2R1Y3RfaWQgKSxcblx0XHRcdGRhdGEgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5kZWxldGVfaXRlbV9hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdHdpc2hsaXN0X2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdFx0aXRlbV9pZDogaXRlbV9pZCxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggcHJvZHVjdF9pZCApXG5cdFx0XHR9O1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgZnJhZ21lbnRzICAgICAgICA9IHJlc3BvbnNlLmZyYWdtZW50cyxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuXG5cdFx0XHRcdFx0aWYgKCd0cnVlJyA9PT0gcmVzcG9uc2UucmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRlbF93cmFwLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QgPSAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LFxuXHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZS5pdGVtX2lkICE9PSBwYXJzZUludCggaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISB0LmNsb3Nlc3QoICcud2xmbWMtcmVtb3ZlLWJ1dHRvbicgKS5sZW5ndGggJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCd0cnVlJyA9PT0gcmVzcG9uc2UucmVzdWx0ICYmICcnICE9PSAkLnRyaW0oIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfcmVtb3ZlZF90ZXh0ICkpIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9yZW1vdmVkX3RleHQgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdC8qaWYgKHR5cGVvZiBmcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXG5cdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX3JlbW92ZWRfZnJvbV93aXNobGlzdCcsIFt0LCBlbF93cmFwLCByZXNwb25zZV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbnQub24oXG5cdCd3bGZtY19zaG93X3ZhcmlhdGlvbicgLFxuXHRmdW5jdGlvbiAoZXYsIGRhdGEpIHtcblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gZGF0YS5wcm9kdWN0X2lkLFxuXHRcdFx0dmFyaWF0aW9uX2lkICAgICAgPSBkYXRhLnZhcmlhdGlvbl9pZCxcblx0XHRcdHRhcmdldHMgICAgICAgICAgID0gJCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QgW2RhdGEtcGFyZW50LXByb2R1Y3QtaWQ9XCInICsgcHJvZHVjdF9pZCArICdcIl0nICksXG5cdFx0XHRlbmFibGVfb3V0b2ZzdG9jayA9IHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuZGF0YSggJ2VuYWJsZS1vdXRvZnN0b2NrJyApO1xuXHRcdGlmICggISBwcm9kdWN0X2lkIHx8ICEgdmFyaWF0aW9uX2lkIHx8ICEgdGFyZ2V0cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCAhIGVuYWJsZV9vdXRvZnN0b2NrICYmICEgZGF0YS5pc19pbl9zdG9jaykge1xuXHRcdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdH1cblx0XHR2YXIgcG9wdXBJZCA9IHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuYXR0ciggJ2RhdGEtcG9wdXAtaWQnICk7XG5cdFx0aWYgKCBwb3B1cElkICkge1xuXHRcdFx0dmFyIHBvcHVwICAgPSAkKCcjJyArIHBvcHVwSWQpO1xuXHRcdFx0aWYgKHBvcHVwLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgcHJvZHVjdF90aXRsZSAgPSBwb3B1cC5kYXRhKCAncHJvZHVjdC10aXRsZScgKTtcblx0XHRcdFx0dmFyIGRlc2MgICAgICAgICAgID0gd2xmbWNfbDEwbi5sYWJlbHMucG9wdXBfY29udGVudDtcblx0XHRcdFx0dmFyIHRpdGxlICAgICAgICAgID0gd2xmbWNfbDEwbi5sYWJlbHMucG9wdXBfdGl0bGU7XG5cdFx0XHRcdHZhciBpbWFnZV9zaXplICAgICA9IHBvcHVwLmRhdGEoICdpbWFnZS1zaXplJyApO1xuXHRcdFx0XHR2YXIgaW1nICAgICAgICAgICAgPSBwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWhlYWRlciBpbWcnICkuZGF0YSggJ3NyYycgKTtcblx0XHRcdFx0dmFyIG9yaWdpbmFsX3ByaWNlID0gcG9wdXAuZmluZCggJy53bGZtYy1wYXJlbnQtcHJvZHVjdC1wcmljZScgKS5odG1sKCk7XG5cdFx0XHRcdHZhciBwcm9kdWN0X3ByaWNlICA9ICcnICE9PSBkYXRhLnByaWNlX2h0bWwgPyBkYXRhLnByaWNlX2h0bWwgOiBvcmlnaW5hbF9wcmljZTtcblxuXHRcdFx0XHRkZXNjID0gZGVzYy5yZXBsYWNlKCAne3Byb2R1Y3RfcHJpY2V9JywgcHJvZHVjdF9wcmljZSApO1xuXHRcdFx0XHRkZXNjID0gZGVzYy5yZXBsYWNlKCAne3Byb2R1Y3RfbmFtZX0nLCBwcm9kdWN0X3RpdGxlICk7XG5cblx0XHRcdFx0dGl0bGUgPSB0aXRsZS5yZXBsYWNlKCAne3Byb2R1Y3RfcHJpY2V9JywgcHJvZHVjdF9wcmljZSApO1xuXHRcdFx0XHR0aXRsZSA9IHRpdGxlLnJlcGxhY2UoICd7cHJvZHVjdF9uYW1lfScsIHByb2R1Y3RfdGl0bGUgKTtcblxuXHRcdFx0XHRpZiAoZGF0YS5pbWFnZV9pZCAmJiAndHJ1ZScgPT0gcG9wdXAuZGF0YSggJ3VzZS1mZWF0dXJlZCcgKSkge1xuXHRcdFx0XHRcdGltZyA9ICdsYXJnZScgPT09IGltYWdlX3NpemUgPyBkYXRhLmltYWdlLmZ1bGxfc3JjIDogKCd0aHVtYm5haWwnID09PSBpbWFnZV9zaXplID8gZGF0YS5pbWFnZS50aHVtYl9zcmMgOiBkYXRhLmltYWdlLnNyYyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLXRpdGxlJyApLmh0bWwoIHRpdGxlICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtZGVzYycgKS5odG1sKCBkZXNjICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtaGVhZGVyIGltZycgKS5hdHRyKCAnc3JjJywgaW1nICk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0Y29udGFpbmVyID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKTtcblxuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0Y29udGFpbmVyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIChpLCBjbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWF0Y2goIC93bGZtYy1hZGQtdG8td2lzaGxpc3QtXFxTKy9nICkuam9pbiggJyAnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggJ3dsZm1jLWFkZC10by13aXNobGlzdC0nICsgdmFyaWF0aW9uX2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtYWRkdG93aXNobGlzdCBhJyApLmF0dHIoICdocmVmJywgY29udGFpbmVyLmF0dHIoICdkYXRhLWFkZC11cmwnICkucmVwbGFjZSggXCIjcHJvZHVjdF9pZFwiLCB2YXJpYXRpb25faWQgKSApO1xuXHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1yZW1vdmVmcm9td2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1yZW1vdmUtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgdmFyaWF0aW9uX2lkICkgKTtcblx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJyAmJiB2LnByb2R1Y3RfaWQgJiYgdi5wcm9kdWN0X2lkID09IHZhcmlhdGlvbl9pZCkge1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJywgdi53aXNobGlzdF9pZCApO1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS1pdGVtLWlkJywgdi5pdGVtX2lkICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuKTtcbnQub24oXG5cdCdyZXNldF9kYXRhJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgPSB0LmRhdGEoICdwcm9kdWN0X2lkJyApLFxuXHRcdFx0dGFyZ2V0cyAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0IFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApO1xuXHRcdGlmICggISBwcm9kdWN0X2lkIHx8ICEgdGFyZ2V0cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHR2YXIgcG9wdXBJZCA9IHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuYXR0ciggJ2RhdGEtcG9wdXAtaWQnICk7XG5cdFx0aWYgKCBwb3B1cElkICkge1xuXHRcdFx0dmFyIHBvcHVwICAgPSAkKCcjJyArIHBvcHVwSWQpO1xuXHRcdFx0aWYgKHBvcHVwLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgb3JpZ2luYWxfcHJpY2UgPSBwb3B1cC5maW5kKCAnLndsZm1jLXBhcmVudC1wcm9kdWN0LXByaWNlJyApLmh0bWwoKTtcblx0XHRcdFx0dmFyIHByb2R1Y3RfdGl0bGUgID0gcG9wdXAuZGF0YSggJ3Byb2R1Y3QtdGl0bGUnICk7XG5cdFx0XHRcdHZhciBkZXNjICAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX2NvbnRlbnQ7XG5cdFx0XHRcdHZhciB0aXRsZSAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX3RpdGxlO1xuXG5cdFx0XHRcdHZhciBpbWcgPSBwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWhlYWRlciBpbWcnICkuZGF0YSggJ3NyYycgKTtcblxuXHRcdFx0XHRkZXNjID0gZGVzYy5yZXBsYWNlKCAne3Byb2R1Y3RfcHJpY2V9Jywgb3JpZ2luYWxfcHJpY2UgKTtcblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X25hbWV9JywgcHJvZHVjdF90aXRsZSApO1xuXG5cdFx0XHRcdHRpdGxlID0gdGl0bGUucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIG9yaWdpbmFsX3ByaWNlICk7XG5cdFx0XHRcdHRpdGxlID0gdGl0bGUucmVwbGFjZSggJ3twcm9kdWN0X25hbWV9JywgcHJvZHVjdF90aXRsZSApO1xuXG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtdGl0bGUnICkuaHRtbCggdGl0bGUgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1kZXNjJyApLmh0bWwoIGRlc2MgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1oZWFkZXIgaW1nJyApLmF0dHIoICdzcmMnLCBpbWcgKTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRhcmdldHMuZWFjaChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRjb250YWluZXIgPSB0LmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApO1xuXG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0Y29udGFpbmVyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIChpLCBjbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWF0Y2goIC93bGZtYy1hZGQtdG8td2lzaGxpc3QtXFxTKy9nICkuam9pbiggJyAnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggJ3dsZm1jLWFkZC10by13aXNobGlzdC0nICsgcHJvZHVjdF9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLWFkZHRvd2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1hZGQtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgcHJvZHVjdF9pZCApICk7XG5cdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLXJlbW92ZWZyb213aXNobGlzdCBhJyApLmF0dHIoICdocmVmJywgY29udGFpbmVyLmF0dHIoICdkYXRhLXJlbW92ZS11cmwnICkucmVwbGFjZSggXCIjcHJvZHVjdF9pZFwiLCBwcm9kdWN0X2lkICkgKTtcblx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJyAmJiB2LnByb2R1Y3RfaWQgJiYgdi5wcm9kdWN0X2lkID09IHByb2R1Y3RfaWQpIHtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcsIHYud2lzaGxpc3RfaWQgKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWNfZGVsZXRlX2l0ZW0nICkuYXR0ciggJ2RhdGEtaXRlbS1pZCcsIHYuaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0fVxuKTtcbjtcblx0XHRcdFx0LyogPT09IFdhaXRsaXN0ID09PSAqL1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXdhaXRsaXN0LWJ0bi1sb2dpbi1uZWVkJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X2xvZ2luX25lZWQgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG50Lm9uKFxuXHQnd2xmbWNfc2hvd192YXJpYXRpb24nLFxuXHRmdW5jdGlvbiAoZXYsIGRhdGEpIHtcblx0XHR2YXJcdHByb2R1Y3RfaWQgICA9IGRhdGEucHJvZHVjdF9pZCxcblx0XHRcdHZhcmlhdGlvbl9pZCA9IGRhdGEudmFyaWF0aW9uX2lkO1xuXHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfbW9kdWxlcyggZGF0YSwgcHJvZHVjdF9pZCwgdmFyaWF0aW9uX2lkICk7XG5cdH1cbik7XG5cbnQub24oXG5cdCdyZXNldF9kYXRhJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgPSB0LmRhdGEoICdwcm9kdWN0X2lkJyApO1xuXHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfbW9kdWxlcyggbnVsbCAsIHByb2R1Y3RfaWQsIHByb2R1Y3RfaWQgKTtcblx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB3bGZtY19sMTBuLndhaXRsaXN0X3JlcXVpcmVkX3Byb2R1Y3RfdmFyaWF0aW9uICkgKSB7XG5cdFx0XHRsZXQgZWxlbSA9ICQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyBwcm9kdWN0X2lkICk7XG5cdFx0XHRlbGVtLmZpbmQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcicgKS5hZGRDbGFzcyggJ3dsZm1jLWRpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2hpZGVfdmFyaWF0aW9uJyxcblx0Jy52YXJpYXRpb25zX2Zvcm0nLFxuXHRmdW5jdGlvbiAoYSkge1xuXHRcdGxldCBlbGVtID0gJCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArICQoIHRoaXMgKS5kYXRhKCAncHJvZHVjdF9pZCcgKSApO1xuXHRcdGlmICggZWxlbS5sZW5ndGggPiAwICYmICQuZm4uV0xGTUMuaXNUcnVlKCB3bGZtY19sMTBuLndhaXRsaXN0X3JlcXVpcmVkX3Byb2R1Y3RfdmFyaWF0aW9uICkgKSB7XG5cdFx0XHRhLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlbGVtLmZpbmQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcicgKS5hZGRDbGFzcyggJ3dsZm1jLWRpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J3Nob3dfdmFyaWF0aW9uJyxcblx0Jy52YXJpYXRpb25zX2Zvcm0nLFxuXHRmdW5jdGlvbiAoYSwgYiwgZCkge1xuXHRcdGxldCBlbGVtID0gJCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArICQoIHRoaXMgKS5kYXRhKCAncHJvZHVjdF9pZCcgKSApO1xuXHRcdGlmICggZWxlbS5sZW5ndGggPiAwICkge1xuXHRcdFx0YS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZWxlbS5maW5kKCAnLndsZm1jLXBvcHVwLXRyaWdnZXInICkucmVtb3ZlQ2xhc3MoICd3bGZtYy1kaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtYWRkLXRvLXdhaXRsaXN0IC53bGZtYy1wb3B1cC10cmlnZ2VyLndsZm1jLWRpc2FibGVkJyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMud2FpdGxpc3RfbWFrZV9hX3NlbGVjdGlvbl90ZXh0ICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b193YWl0bGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHRwYXJlbnRfcHJvZHVjdF9pZCA9IHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnICksXG5cdFx0XHRmaWx0ZXJlZF9kYXRhICAgICA9IG51bGwsXG5cdFx0XHRwb3B1cCAgICAgICAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy1wb3B1cCcgKSxcblx0XHRcdG9uX3NhbGUgICAgICAgICAgID0gcG9wdXAuZmluZCggJy53bGZtYy13YWl0bGlzdC1zZWxlY3QtdHlwZSBpbnB1dFtuYW1lPWxpc3Rfb24tc2FsZV06Y2hlY2tlZCcgKS5sZW5ndGggPiAwID8gMSA6IDAsXG5cdFx0XHRiYWNrX2luX3N0b2NrICAgICA9IHBvcHVwLmZpbmQoICcud2xmbWMtd2FpdGxpc3Qtc2VsZWN0LXR5cGUgaW5wdXRbbmFtZT1saXN0X2JhY2staW4tc3RvY2tdOmNoZWNrZWQnICkubGVuZ3RoID4gMCA/IDEgOiAwLFxuXHRcdFx0cHJpY2VfY2hhbmdlICAgICAgPSBwb3B1cC5maW5kKCAnLndsZm1jLXdhaXRsaXN0LXNlbGVjdC10eXBlIGlucHV0W25hbWU9bGlzdF9wcmljZS1jaGFuZ2VdOmNoZWNrZWQnICkubGVuZ3RoID4gMCA/IDEgOiAwLFxuXHRcdFx0bG93X3N0b2NrICAgICAgICAgPSBwb3B1cC5maW5kKCAnLndsZm1jLXdhaXRsaXN0LXNlbGVjdC10eXBlIGlucHV0W25hbWU9bGlzdF9sb3ctc3RvY2tdOmNoZWNrZWQnICkubGVuZ3RoID4gMCA/IDEgOiAwLFxuXHRcdFx0ZW1haWwgICAgICAgICAgICAgPSBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT13bGZtY19lbWFpbF0nICkubGVuZ3RoID4gMCA/IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPXdsZm1jX2VtYWlsXScgKS52YWwoKS50cmltKCkgOiBmYWxzZSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfcHJvZHVjdF90b193YWl0bGlzdF9hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGFkZF90b193YWl0bGlzdDogcHJvZHVjdF9pZCxcblx0XHRcdFx0cHJvZHVjdF90eXBlOiB0LmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScgKSxcblx0XHRcdFx0b25fc2FsZSA6IG9uX3NhbGUsXG5cdFx0XHRcdGJhY2tfaW5fc3RvY2sgOmJhY2tfaW5fc3RvY2ssXG5cdFx0XHRcdHByaWNlX2NoYW5nZSA6IHByaWNlX2NoYW5nZSxcblx0XHRcdFx0bG93X3N0b2NrICA6IGxvd19zdG9jayxcblx0XHRcdFx0d2xmbWNfZW1haWwgOiBlbWFpbFxuXHRcdFx0fTtcblxuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoIGZhbHNlICE9PSBlbWFpbCAmJiAnJyA9PT0gZW1haWwgKSB7XG5cdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X2VtYWlsX3JlcXVpcmVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICggZmFsc2UgIT09IGVtYWlsICYmICEgJC5mbi5XTEZNQy52YWxpZGF0ZUVtYWlsKGVtYWlsKSApIHtcblx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMud2FpdGxpc3RfZW1haWxfZm9ybWF0ICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2FkZF90b193YWl0bGlzdF9kYXRhJywgW3QsIGRhdGFdICkpIHtcblx0XHRcdGRhdGEgPSBmaWx0ZXJlZF9kYXRhO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyZW50X3Byb2R1Y3RfZm9ybTtcblxuXHRcdGlmICggJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJykubGVuZ3RoICkge1xuXG5cdFx0XHRsZXQgYnV0dG9uID0gJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpO1xuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSBidXR0b24uY2xvc2VzdCgnZm9ybScpLmVxKCAwICk7XG5cblx0XHR9XG5cblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRpZiAoICB0eXBlb2YgY3VycmVudF9wcm9kdWN0X2Zvcm0gIT09ICd1bmRlZmluZWQnICYmIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCBjdXJyZW50X3Byb2R1Y3RfZm9ybS5nZXQoIDAgKSApO1xuXHRcdFx0Zm9ybURhdGEuZGVsZXRlKCAnYWRkLXRvLWNhcnQnICk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKFxuXHRcdFx0ZGF0YSxcblx0XHRcdGZ1bmN0aW9uKGtleSx2YWx1ZU9iail7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCgga2V5ICwgdHlwZW9mIHZhbHVlT2JqID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KCB2YWx1ZU9iaiApIDogdmFsdWVPYmogKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ3dsZm1jX2FkZGluZ190b193YWl0bGlzdCcgKTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ud2FpdGxpc3RfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdC8vZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdGNhY2hlOiBmYWxzZSxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX3Jlc3VsdCAgPSByZXNwb25zZS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZSxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICkge1xuXG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApICkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGV0IGxpc3RfdHlwZSA9ICd3YWl0bGlzdCc7XG5cdFx0XHRcdFx0XHRpZiAob25fc2FsZSA9PT0gMSkgbGlzdF90eXBlICs9ICcsb24tc2FsZSc7XG5cdFx0XHRcdFx0XHRpZiAocHJpY2VfY2hhbmdlID09PSAxKSBsaXN0X3R5cGUgKz0gJyxwcmljZS1jaGFuZ2UnO1xuXHRcdFx0XHRcdFx0aWYgKGJhY2tfaW5fc3RvY2sgPT09IDEpIGxpc3RfdHlwZSArPSAnLGJhY2staW4tc3RvY2snO1xuXHRcdFx0XHRcdFx0aWYgKGxvd19zdG9jayA9PT0gMSkgbGlzdF90eXBlICs9ICcsbG93LXN0b2NrJztcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS53aXNobGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsIGxpc3RfdHlwZSwgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b19vdXRvZnN0b2NrJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHBhcmVudF9wcm9kdWN0X2lkID0gdC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHdsZm1jX2VtYWlsICAgICAgID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrJyApLmZpbmQoICdpbnB1dFtuYW1lPXdsZm1jX2VtYWlsXScgKSxcblx0XHRcdGZpbHRlcmVkX2RhdGEgICAgID0gbnVsbCxcblx0XHRcdGVtYWlsICAgICAgICAgICAgID0gd2xmbWNfZW1haWwubGVuZ3RoID4gMCA/IHdsZm1jX2VtYWlsLnZhbCgpLnRyaW0oKSA6IGZhbHNlLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmFkZF9wcm9kdWN0X3RvX3dhaXRsaXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX3dhaXRsaXN0OiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRwcm9kdWN0X3R5cGU6IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0XHRvbl9zYWxlIDogMCxcblx0XHRcdFx0YmFja19pbl9zdG9jayA6IDEsXG5cdFx0XHRcdHByaWNlX2NoYW5nZSA6IDAsXG5cdFx0XHRcdGxvd19zdG9jayAgOiAwLFxuXHRcdFx0XHR3bGZtY19lbWFpbCA6ICBlbWFpbFxuXHRcdFx0fTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCBmYWxzZSAhPT0gZW1haWwgJiYgJycgPT09IGVtYWlsICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy53YWl0bGlzdF9lbWFpbF9yZXF1aXJlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIGZhbHNlICE9PSBlbWFpbCAmJiAhICQuZm4uV0xGTUMudmFsaWRhdGVFbWFpbChlbWFpbCkgKSB7XG5cdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X2VtYWlsX2Zvcm1hdCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBhbGxvdyB0aGlyZCBwYXJ0eSBjb2RlIHRvIGZpbHRlciBkYXRhLlxuXHRcdGlmIChmaWx0ZXJlZF9kYXRhID09PSAkKCBkb2N1bWVudCApLnRyaWdnZXJIYW5kbGVyKCAnd2xmbWNfYWRkX3RvX3dhaXRsaXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0bGV0IGN1cnJlbnRfcHJvZHVjdF9mb3JtO1xuXG5cdFx0aWYgKCAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCAgKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKS5sZW5ndGggKSB7XG5cblx0XHRcdGxldCBidXR0b24gPSAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCdmb3JtJykuZXEoIDAgKTtcblxuXHRcdH1cblxuXHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdGlmICggIHR5cGVvZiBjdXJyZW50X3Byb2R1Y3RfZm9ybSAhPT0gJ3VuZGVmaW5lZCcgJiYgY3VycmVudF9wcm9kdWN0X2Zvcm0ubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9ybURhdGEgPSBuZXcgRm9ybURhdGEoIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmdldCggMCApICk7XG5cdFx0XHRmb3JtRGF0YS5kZWxldGUoICdhZGQtdG8tY2FydCcgKTtcblx0XHR9XG5cblx0XHQkLmVhY2goXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZnVuY3Rpb24oa2V5LHZhbHVlT2JqKXtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXkgLCB0eXBlb2YgdmFsdWVPYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoIHZhbHVlT2JqICkgOiB2YWx1ZU9iaiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRqUXVlcnkoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnd2xmbWNfYWRkaW5nX3RvX3dhaXRsaXN0JyApO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi53YWl0bGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0Ly9kYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAocmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgKSB7XG5cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlX21lc3NhZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHByb2R1Y3RfaWQgKS5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS53aXNobGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsICdiYWNrLWluLXN0b2NrJywgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfY2FuY2VsX291dG9mc3RvY2snLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmFkZF9wcm9kdWN0X3RvX3dhaXRsaXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX3dhaXRsaXN0OiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRwcm9kdWN0X3R5cGU6IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0XHRvbl9zYWxlIDogMCxcblx0XHRcdFx0YmFja19pbl9zdG9jayA6IDAsXG5cdFx0XHRcdHByaWNlX2NoYW5nZSA6IDAsXG5cdFx0XHRcdGxvd19zdG9jayAgOiAwLFxuXHRcdFx0fTtcblxuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc19jb29raWVfZW5hYmxlZCgpKSB7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLndhaXRsaXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmIChyZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyApIHtcblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jay0nICsgcHJvZHVjdF9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuO1xuXHRcdFx0XHQvKiA9PT0gTVVMVEkgTElTVCA9PT0gKi9cblxubGV0IFByZXZMaXN0c1N0YXRlID0gW107XG5cbmIub24oXG5cdCdpbnB1dCcsXG5cdCcud2xmbWMtcG9wdXAtbGlzdHMtd3JhcHBlciAuc2VhcmNoLWlucHV0Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlYXJjaFRlcm0gICA9ICQoIHRoaXMgKS52YWwoKS50b0xvd2VyQ2FzZSgpO1xuXHRcdHZhciBsaXN0ICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1wb3B1cC1saXN0cy13cmFwcGVyJyApLmZpbmQoICcubGlzdCcgKTtcblx0XHR2YXIgbm9SZXN1bHRzUm93ID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtcG9wdXAtbGlzdHMtd3JhcHBlcicgKS5maW5kKCAnLm5vLXJlc3VsdHMtcm93JyApO1xuXG5cdFx0dmFyIG51bVZpc2libGVJdGVtcyA9IDA7XG5cdFx0aWYgKCBsaXN0LmZpbmQoICcubGlzdC1pdGVtJyApLmxlbmd0aCApIHtcblx0XHRcdGxpc3QuZmluZCggJy5saXN0LWl0ZW0nICkuZWFjaChcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0XHRpZiAodGV4dC5pbmRleE9mKCBzZWFyY2hUZXJtICkgPiAtMSkge1xuXHRcdFx0XHRcdFx0JCggdGhpcyApLnNob3coKTtcblx0XHRcdFx0XHRcdG51bVZpc2libGVJdGVtcysrO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHRcdGlmIChudW1WaXNpYmxlSXRlbXMgPT09IDApIHtcblx0XHRcdFx0bm9SZXN1bHRzUm93LnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vUmVzdWx0c1Jvdy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIHRoaXMgKS52YWwoICcnICk7XG5cdFx0fVxuXHR9XG4pO1xuXG4vKmIub24oXG5cdCdjaGFuZ2UnLFxuXHQnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lciAubGlzdC1pdGVtLWNoZWNrYm94Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdGVkSXRlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKTtcblxuXHRcdGlmICgkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0c2VsZWN0ZWRJdGVtLmFkZENsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlbGVjdGVkSXRlbS5yZW1vdmVDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdH1cblx0fVxuKTtcblxuYi5vbihcblx0J2NoYW5nZScsXG5cdCcud2xmbWMtbW92ZS10by1saXN0LXdyYXBwZXIgLmxpc3QtaXRlbS1jaGVja2JveCcsXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxlY3RlZEl0ZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJy5saXN0LWl0ZW0nICk7XG5cdFx0dmFyIGNoZWNrYm94ZXMgPSAkKHRoaXMpLmNsb3Nlc3QoJy53bGZtYy1tb3ZlLXRvLWxpc3Qtd3JhcHBlcicpLmZpbmQoJ2lucHV0W25hbWU9XCJkZXN0aW5hdGlvbl93aXNobGlzdF9pZFwiXScpO1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLndsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyJykuZmluZCgnLmxpc3QtaXRlbScpLnJlbW92ZUNsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0aWYgKCQoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdGNoZWNrYm94ZXMubm90KCQodGhpcykpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cdFx0fVxuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2hhbmdlJyxcblx0Jy53bGZtYy1jb3B5LXRvLWxpc3Qtd3JhcHBlciAubGlzdC1pdGVtLWNoZWNrYm94Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdGVkSXRlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKTtcblx0XHR2YXIgY2hlY2tib3hlcyA9ICQodGhpcykuY2xvc2VzdCgnLndsZm1jLWNvcHktdG8tbGlzdC13cmFwcGVyJykuZmluZCgnaW5wdXRbbmFtZT1cImRlc3RpbmF0aW9uX3dpc2hsaXN0X2lkXCJdJyk7XG5cdFx0JCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtY29weS10by1saXN0LXdyYXBwZXInKS5maW5kKCcubGlzdC1pdGVtJykucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRpZiAoJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdFx0Y2hlY2tib3hlcy5ub3QoJCh0aGlzKSkucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcblx0XHR9XG5cdH1cbik7Ki9cblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1jcmVhdGUtbmV3LWxpc3QnLFxuXHRmdW5jdGlvbigpIHtcblx0XHR2YXIgcGFyZW50X3BvcHVwID0gJCggJyMnICsgJCggdGhpcyApLmF0dHIoICdkYXRhLXBhcmVudC1wb3B1cC1pZCcgKSApO1xuXHRcdHZhciBjaGlsZF9wb3B1cCAgPSAkKCAnIycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtY2hpbGQtcG9wdXAtaWQnICkgKTtcblxuXHRcdHBhcmVudF9wb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cblx0XHRjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdGNvbG9yOiAnIzMzMycsXG5cdFx0XHR0cmFuc2l0aW9uOiAnYWxsIDAuMXMnLFxuXHRcdFx0aG9yaXpvbnRhbDogY2hpbGRfcG9wdXAuZGF0YSggJ2hvcml6b250YWwnICksXG5cdFx0XHR2ZXJ0aWNhbDogY2hpbGRfcG9wdXAuZGF0YSggJ3ZlcnRpY2FsJyApXG5cdFx0fTtcblxuXHRcdGNoaWxkX3BvcHVwLnBvcHVwKFxuXHRcdFx0e1xuXHRcdFx0XHQuLi5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0b25jbG9zZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cGFyZW50X3BvcHVwLnBvcHVwKCAnc2hvdycgKTtcblx0XHRcdFx0XHRjaGlsZF9wb3B1cC5wb3B1cChcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Li4uZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdFx0XHRcdG9uY2xvc2U6IG51bGxcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGNoaWxkX3BvcHVwLnBvcHVwKCAnc2hvdycgKTtcblxuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXRvZ2dsZS1wcml2YWN5Jyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHJvdyAgICAgICAgID0gZWxlbS5wYXJlbnRzKCAnW2RhdGEtd2lzaGxpc3QtaWRdJyApLFxuXHRcdFx0b2xkX3ByaXZhY3kgPSBwYXJzZUludCggZWxlbS5hdHRyKCAnZGF0YS1wcml2YWN5JyApICksXG5cdFx0XHRuZXdfcHJpdmFjeSA9IDAgPT09IG9sZF9wcml2YWN5ID8gMSA6IDAsXG5cdFx0XHR3aXNobGlzdF9pZCA9IHJvdy5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcgKSxcblx0XHRcdGljb24gICAgICAgID0gZWxlbS5maW5kKCAnaScgKSxcblx0XHRcdGVkaXRfcG9wdXAgID0gJCggJyNlZGl0X3BvcHVwXycgKyB3aXNobGlzdF9pZCApO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ubXVsdGlfbGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmNoYW5nZV9wcml2YWN5X2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogZWxlbS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHQnd2lzaGxpc3RfaWQnIDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0J2xpc3RfcHJpdmFjeScgOiBuZXdfcHJpdmFjeVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRpZiAoICEgZGF0YSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWNvbi5yZW1vdmVDbGFzcyggJ3dsZm1jLWljb24tdW5sb2NrIHdsZm1jLWljb24tbG9jaycgKTtcblx0XHRcdFx0XHRpY29uLmFkZENsYXNzKCBvbGRfcHJpdmFjeSA9PT0gMCA/ICd3bGZtYy1pY29uLWxvY2snIDogJ3dsZm1jLWljb24tdW5sb2NrJyApO1xuXHRcdFx0XHRcdGVkaXRfcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X3ByaXZhY3lcIl1bdmFsdWU9XCInICsgbmV3X3ByaXZhY3kgKyAnXCJdJyApLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHRcdFx0ZWxlbS5hdHRyKCAnZGF0YS1wcml2YWN5JyAsIG5ld19wcml2YWN5ICk7XG5cdFx0XHRcdFx0aWYoIG5ld19wcml2YWN5ID09PSAwICkge1xuXHRcdFx0XHRcdFx0JCgnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cInNoYXJlX3BvcHVwXycgKyB3aXNobGlzdF9pZCArICdcIl0nKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXHRcdFx0XHRcdFx0JCgnLnNoYXJlLXdyYXBwZXInKS5zaG93KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCQoJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJzaGFyZV9wb3B1cF8nICsgd2lzaGxpc3RfaWQgKyAnXCJdJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHRcdFx0XHRcdCQoJy5zaGFyZS13cmFwcGVyJykuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWRlbGV0ZS1saXN0Jyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHdpc2hsaXN0X2lkID0gZWxlbS5kYXRhKCAnd2lzaGxpc3QtaWQnICksXG5cdFx0XHRwb3B1cFx0XHQ9ICQoICcjJyArIGVsZW0uZGF0YSggJ3BvcHVwLWlkJyApICksXG5cdFx0XHRyb3cgICAgICAgICA9ICQoICd1bC53bGZtYy1tYW5hZ2UtbGlzdHMgbGlbZGF0YS13aXNobGlzdC1pZD1cIicgKyB3aXNobGlzdF9pZCArICdcIl0sYS5saXN0LXJvd1tkYXRhLWxpc3QtaWQ9XCInICsgd2lzaGxpc3RfaWQgKyAnXCJdLCAud2xmbWMtZHJvcGRvd24tY29udGVudCBsaVtkYXRhLXdpc2hsaXN0LWlkPVwiJyArIHdpc2hsaXN0X2lkICsgJ1wiXScgKSxcblx0XHRcdHRhYmxlICAgICAgID0gJCgnLndsZm1jLXdpc2hsaXN0LXRhYmxlW2RhdGEtaWQ9XCInICsgd2lzaGxpc3RfaWQgKyAnXCJdJyk7XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuZGVsZXRlX2xpc3RfYWN0aW9uLFxuXHRcdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLWxpc3RzJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdHdpc2hsaXN0X2lkIDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISBkYXRhLnJlc3VsdCApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdHJvdy5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdGlmICgkKCcjd2xmbWNfbXlfbGlzdHNfZHJvcGRvd24gbGknKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0JCgnLndsZm1jLXNlbGVjdC1saXN0LXdyYXBwZXInKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdFx0XHRcdFx0XHQkKCcud2xmbWMtbGlzdC1hY3Rpb25zLXdyYXBwZXIgLndsZm1jLW5ldy1saXN0JykuY3NzKCdkaXNwbGF5JywgJycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCB0YWJsZS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdsZm1jX2wxMG4ubGlzdHNfcGFnZV91cmw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdC8qaWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1zYXZlLWxpc3QnLFxuXHRmdW5jdGlvbihldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGVsZW0gICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgPSBlbGVtLmRhdGEoICd3aXNobGlzdC1pZCcgKSxcblx0XHRcdHJvdyAgICAgICAgID0gJCggJ3VsLndsZm1jLW1hbmFnZS1saXN0cyBsaVtkYXRhLXdpc2hsaXN0LWlkPVwiJyArIHdpc2hsaXN0X2lkICsgJ1wiXSxhLmxpc3Qtcm93W2RhdGEtbGlzdC1pZD1cIicgKyB3aXNobGlzdF9pZCArICdcIl0sIC53bGZtYy1saXN0LWFjdGlvbnMtd3JhcHBlcicgKSxcblx0XHRcdHBvcHVwXHRcdD0gJCggJyMnICsgZWxlbS5kYXRhKCAncG9wdXAtaWQnICkgKSxcblx0XHRcdHByaXZhY3kgXHQ9IHBhcnNlSW50KCBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpdmFjeVwiXTpjaGVja2VkJyApLnZhbCgpICksXG5cdFx0XHRuYW1lIFx0XHQ9IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9uYW1lXCJdJyApLnZhbCgpLFxuXHRcdFx0ZGVzYyBcdFx0PSBwb3B1cC5maW5kKCAndGV4dGFyZWFbbmFtZT1cImxpc3RfZGVzY3JpcHRpb25zXCJdJyApLnZhbCgpLFxuXHRcdFx0aWNvblByaXZhY3kgPSByb3cuZmluZCggJy53bGZtYy10b2dnbGUtcHJpdmFjeSBpJyApO1xuXHRcdGlmICggJycgPT09ICQudHJpbSggbmFtZSApICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5tdWx0aV9saXN0X2xpc3RfbmFtZV9yZXF1aXJlZCApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMudXBkYXRlX2xpc3RfYWN0aW9uLFxuXHRcdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLWxpc3RzJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdHdpc2hsaXN0X2lkIDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0bGlzdF9wcml2YWN5OiBwcml2YWN5LFxuXHRcdFx0XHRcdGxpc3RfbmFtZTpuYW1lLFxuXHRcdFx0XHRcdGxpc3RfZGVzY3JpcHRpb25zOmRlc2MsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISBkYXRhLnJlc3VsdCApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdHJvdy5maW5kKCAnLmxpc3QtbmFtZScgKS50ZXh0KCBuYW1lICk7XG5cdFx0XHRcdFx0XHRyb3cuZmluZCggJy5saXN0LWRlc2MnICkudGV4dCggZGVzYyApO1xuXHRcdFx0XHRcdFx0cm93LmZpbmQoICcud2xmbWMtdG9nZ2xlLXByaXZhY3knICkuYXR0ciggJ2RhdGEtcHJpdmFjeScsIHByaXZhY3kgKTtcblx0XHRcdFx0XHRcdGljb25Qcml2YWN5LnJlbW92ZUNsYXNzKCAnd2xmbWMtaWNvbi11bmxvY2sgd2xmbWMtaWNvbi1sb2NrJyApO1xuXHRcdFx0XHRcdFx0aWNvblByaXZhY3kuYWRkQ2xhc3MoIHByaXZhY3kgPT09IDAgPyAnd2xmbWMtaWNvbi11bmxvY2snIDogJ3dsZm1jLWljb24tbG9jaycgKTtcblx0XHRcdFx0XHRcdGlmKCBwcml2YWN5ID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwic2hhcmVfcG9wdXBfJyArIHdpc2hsaXN0X2lkICsgJ1wiXScpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG5cdFx0XHRcdFx0XHRcdCQoJy5zaGFyZS13cmFwcGVyJykuc2hvdygpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JCgnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cInNoYXJlX3BvcHVwXycgKyB3aXNobGlzdF9pZCArICdcIl0nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdFx0XHRcdFx0XHQkKCcuc2hhcmUtd3JhcHBlcicpLmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSxcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWFkZC1saXN0Jyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgID0gJCggdGhpcyApLFxuXHRcdFx0cG9wdXAgICA9ICQoICcjbmV3X2xpc3RfcG9wdXAnICksXG5cdFx0XHRwcml2YWN5ID0gcGFyc2VJbnQoIHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcml2YWN5XCJdOmNoZWNrZWQnICkudmFsKCkgKSxcblx0XHRcdG5hbWUgICAgPSBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbmFtZVwiXScgKS52YWwoKSxcblx0XHRcdGRlc2MgICAgPSBwb3B1cC5maW5kKCAndGV4dGFyZWFbbmFtZT1cImxpc3RfZGVzY3JpcHRpb25zXCJdJyApLnZhbCgpO1xuXHRcdGlmICggJycgPT09ICQudHJpbSggbmFtZSApICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5tdWx0aV9saXN0X2xpc3RfbmFtZV9yZXF1aXJlZCApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuY3JlYXRlX25ld19saXN0X2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogIGVsZW0uZGF0YSgnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRsaXN0X3ByaXZhY3k6IHByaXZhY3ksXG5cdFx0XHRcdFx0bGlzdF9uYW1lOm5hbWUsXG5cdFx0XHRcdFx0bGlzdF9kZXNjcmlwdGlvbnM6ZGVzYyxcblx0XHRcdFx0XHRmcmFnbWVudHM6ICggJCggJy53aXNobGlzdC1lbXB0eS1yb3cgLndsZm1jLW5ldy1saXN0JykubGVuZ3RoID4gMCApID8gJC5mbi5XTEZNQy5yZXRyaWV2ZV9mcmFnbWVudHMoKSA6ICQuZm4uV0xGTUMucmV0cmlldmVfZnJhZ21lbnRzKCAnbGlzdF9jb3VudGVyJyApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISBkYXRhLnJlc3VsdCApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCQoJy53bGZtYy1saXN0LWFjdGlvbnMtd3JhcHBlciAud2xmbWMtbmV3LWxpc3QnKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbmFtZVwiXScgKS52YWwoJycpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2Rlc2NyaXB0aW9uc1wiXScgKS52YWwoJycpO1xuXHRcdFx0XHRcdFx0cG9wdXAucG9wdXAoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0dmFyIHRlbXBsYXRlID0gd3AudGVtcGxhdGUoICd3bGZtYy1saXN0LWl0ZW0nICk7XG5cdFx0XHRcdFx0XHR2YXIgaHRtbCAgICAgPSB0ZW1wbGF0ZSggZGF0YSApO1xuXHRcdFx0XHRcdFx0aWYgKCAkKCcjbW92ZV9wb3B1cCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cCB1bC5saXN0JyApLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgdWwubGlzdCcgKS5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94W3ZhbHVlPVwiJyArIGRhdGEud2lzaGxpc3RfaWQgKyAnXCJdJykucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgLmxpc3QtZW1wdHknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgLm5vLXJlc3VsdHMtcm93JyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwIC53bGZtYy1zZWFyY2gtbGlzdHMnKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cCAud2xmbWNfbW92ZV90b19saXN0JykuYXR0ciggJ3N0eWxlJywgJycpO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCcjY29weV9wb3B1cCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcjY29weV9wb3B1cCB1bC5saXN0JyApLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgdWwubGlzdCcgKS5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94W3ZhbHVlPVwiJyArIGRhdGEud2lzaGxpc3RfaWQgKyAnXCJdJykucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgLmxpc3QtZW1wdHknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgLm5vLXJlc3VsdHMtcm93JyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNjb3B5X3BvcHVwIC53bGZtYy1zZWFyY2gtbGlzdHMnKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdCQoICcjY29weV9wb3B1cCAud2xmbWNfY29weV90b19saXN0JykuYXR0ciggJ3N0eWxlJywgJycpO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIHVsLmxpc3QnICkuYXBwZW5kKCBodG1sICk7XG5cdFx0XHRcdFx0XHRcdFByZXZMaXN0c1N0YXRlLnB1c2goIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgdWwubGlzdCcgKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5vbignY2hhbmdlJywgV2xmbWNDaGVja2JveExpc3RzQ2hhbmdlKTtcblx0XHRcdFx0XHRcdFx0JCggJyNhZGRfdG9fbGlzdF9wb3B1cCB1bC5saXN0JyApLmZpbmQoICdpbnB1dC5saXN0LWl0ZW0tY2hlY2tib3hbdmFsdWU9XCInICsgZGF0YS53aXNobGlzdF9pZCArICdcIl0nKS5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgLmxpc3QtZW1wdHknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIC5uby1yZXN1bHRzLXJvdycgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgLndsZm1jLXNlYXJjaC1saXN0cycpLmF0dHIoICdzdHlsZScsICcnKTtcblx0XHRcdFx0XHRcdFx0JCggJyNhZGRfdG9fbGlzdF9wb3B1cCAud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgLndsZm1jLW1hbmFnZS1idG4nKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCd3bGZtYy1kcm9wZG93bi1pdGVtJyk7XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdFx0XHRcdFx0XHRpZiAoJCgnI3dsZm1jX215X2xpc3RzX2Ryb3Bkb3duJykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGh0bWwgPSB0ZW1wbGF0ZShkYXRhKTtcblx0XHRcdFx0XHRcdFx0XHQkKCAnI3dsZm1jX215X2xpc3RzX2Ryb3Bkb3duJyApLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtc2VsZWN0LWxpc3Qtd3JhcHBlcicpLnJlbW92ZUNsYXNzKCAnaGlkZScpO1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9kcm9wZG93bl9saXN0cygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmcoKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAkKCcud2xmbWMtbGlzdHMnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmJsb2NrKCAkKCcud2xmbWMtbGlzdHMnKSApO1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxudC5vbihcblx0J3dsZm1jX3Nob3dfdmFyaWF0aW9uJyAsXG5cdGZ1bmN0aW9uIChldiwgZGF0YSkge1xuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSBkYXRhLnByb2R1Y3RfaWQsXG5cdFx0XHR2YXJpYXRpb25faWQgICAgICA9IGRhdGEudmFyaWF0aW9uX2lkLFxuXHRcdFx0dGFyZ2V0cyAgICAgICAgICAgPSAkKCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0IFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApLFxuXHRcdFx0ZW5hYmxlX291dG9mc3RvY2sgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLW11bHRpLWxpc3QnICkuZGF0YSggJ2VuYWJsZS1vdXRvZnN0b2NrJyApO1xuXHRcdGlmICggISBwcm9kdWN0X2lkIHx8ICEgdmFyaWF0aW9uX2lkIHx8ICEgdGFyZ2V0cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCAhIGVuYWJsZV9vdXRvZnN0b2NrICYmICEgZGF0YS5pc19pbl9zdG9jaykge1xuXHRcdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0JyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHR9XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblx0XHRcdH1cblx0XHQpO1xuXHRcdC8vJCggJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXScgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cdFx0JCggJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXVtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApLmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblx0fVxuKTtcblxudC5vbihcblx0J3Jlc2V0X2RhdGEnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCA9IHQuZGF0YSggJ3Byb2R1Y3RfaWQnICksXG5cdFx0XHR0YXJnZXRzICAgID0gJCggJy53bGZtYy1hZGQtdG8tbXVsdGktbGlzdCBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKTtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHRhcmdldHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblxuXHRcdHRhcmdldHMuZWFjaChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgPSAkKCB0aGlzICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdH1cblx0XHQpO1xuXHRcdC8vJCggJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXScgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdCQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiYWRkX3RvX2xpc3RfcG9wdXBcIl1bZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cIm1vdmVfcG9wdXBcIl0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHBvcHVwXHRcdFx0ICA9ICQoICcjbW92ZV9wb3B1cCcgKSxcblx0XHRcdGl0ZW1faWRzICAgICAgICAgID0gdC5kYXRhKCdpdGVtLWlkJyk7XG5cblx0XHRwb3B1cC5maW5kKCAnLndsZm1jX21vdmVfdG9fbGlzdCcgKS5hdHRyKCAnZGF0YS1pdGVtLWlkcycsIGl0ZW1faWRzICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiY29weV9wb3B1cFwiXScsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNjb3B5X3BvcHVwJyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmRhdGEoJ2l0ZW0taWQnKTtcblxuXHRcdHBvcHVwLmZpbmQoICcud2xmbWNfY29weV90b19saXN0JyApLmF0dHIoICdkYXRhLWl0ZW0taWRzJywgaXRlbV9pZHMgKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXScsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHRwYXJlbnRfcHJvZHVjdF9pZCA9IHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnICksXG5cdFx0XHRwcm9kdWN0X3R5cGUgICAgICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0ZXhjbHVkZV9kZWZhdWx0ICAgPSB0LmF0dHIoICdkYXRhLWV4Y2x1ZGUtZGVmYXVsdCcgKSxcblx0XHRcdGNhcnRfaXRlbV9rZXkgICAgID0gdC5hdHRyKCAnZGF0YS1jYXJ0X2l0ZW1fa2V5JyApLFxuXHRcdFx0c2F2ZV9jYXJ0ICAgICAgICAgPSB0LmF0dHIoICdkYXRhLXNhdmUtY2FydCcgKSxcblx0XHRcdHBvcHVwXHRcdFx0ICAgICAgICAgICAgICA9ICQoICcjYWRkX3RvX2xpc3RfcG9wdXAnICksXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMubG9hZF9saXN0c19hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdHByb2R1Y3RfaWQ6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdGV4Y2x1ZGVfZGVmYXVsdDogZXhjbHVkZV9kZWZhdWx0XG5cdFx0XHR9O1xuXG5cdFx0Ly8gQ2hlY2sgaWYgY2FydF9pdGVtX2tleSBpcyBkZWZpbmVkIGJlZm9yZSBhZGRpbmcgaXQgdG8gdGhlIGRhdGEgb2JqZWN0XG5cdFx0aWYgKHR5cGVvZiBjYXJ0X2l0ZW1fa2V5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0ZGF0YS5jYXJ0X2l0ZW1fa2V5ID0gY2FydF9pdGVtX2tleTtcblx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnICkuYXR0ciggJ2RhdGEtY2FydF9pdGVtX2tleScsIGNhcnRfaXRlbV9rZXkgKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHNhdmVfY2FydCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnICkuYXR0ciggJ2RhdGEtc2F2ZS1jYXJ0Jywgc2F2ZV9jYXJ0ICk7XG5cdFx0fVxuXG5cdFx0cG9wdXAuZmluZCggJy53bGZtY19hZGRfdG9fbXVsdGlfbGlzdCcgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnLCBwcm9kdWN0X3R5cGUgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApLmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcGFyZW50X3Byb2R1Y3RfaWQgKTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLm11bHRpX2xpc3RfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmJsb2NrKCBwb3B1cC5maW5kKCAnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lcicgKSApO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmJsb2NrKCBwb3B1cC5maW5kKCAnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lcicgKSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0ZGF0YSAgICAgICAgICAgICA9IHJlc3BvbnNlLmRhdGEsXG5cdFx0XHRcdFx0XHRwcm9kdWN0X2xpc3RzXHQgPSByZXNwb25zZS5wcm9kdWN0X2xpc3RzLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICYmIDAgPCBkYXRhLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdHZhciB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCAnd2xmbWMtbGlzdC1pdGVtJyApO1xuXHRcdFx0XHRcdFx0dmFyIGh0bWwgICAgID0gJyc7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aHRtbCArPSB0ZW1wbGF0ZSggZGF0YVtpXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1zZWFyY2gtbGlzdHMnKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLmxpc3QnICkuaHRtbCggaHRtbCApO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1udW1iZXInICkudGV4dCggcHJvZHVjdF9saXN0cy5sZW5ndGggKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcubGlzdC1lbXB0eScgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JyApLmF0dHIoICdkYXRhLWxpc3QtaWRzJyAsIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2xpc3RzICkgKS5hdHRyKCAnc3R5bGUnLCAnJyApO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1tYW5hZ2UtYnRuJykuYXR0ciggJ3N0eWxlJywgJycpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCgnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdFx0XHRcdC8vIEFkZCBldmVudCB0byBjaGVja2JveCB0byBkaXNhYmxlIHN1Ym1pdCBidXR0b24gaWYgeW91IGRvIG5vdCBjaGFuZ2UgYW55dGhpbmcncy5cblx0XHRcdFx0XHRcdFByZXZMaXN0c1N0YXRlID0gcG9wdXAuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykubWFwKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJCh0aGlzKS5wcm9wKCdjaGVja2VkJyk7XG5cdFx0XHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0XHRcdHBvcHVwLm9uKCdjaGFuZ2UnLCAnLmxpc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgV2xmbWNDaGVja2JveExpc3RzQ2hhbmdlKTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLW1hbmFnZS1idG4nKS5jc3MoICdkaXNwbGF5JywgJ25vbmUgIWltcG9ydGFudCcpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1zZWFyY2gtbGlzdHMnKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLmxpc3QnICkuaHRtbCggJycgKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcubGlzdC1lbXB0eScgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLW51bWJlcicgKS50ZXh0KCAwICk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JykuY3NzKCAnZGlzcGxheScsICdub25lICFpbXBvcnRhbnQnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHRwb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0Y2FydF9pdGVtX2tleSAgICAgPSB0LmF0dHIoICdkYXRhLWNhcnRfaXRlbV9rZXknICksXG5cdFx0XHRzYXZlX2NhcnQgICAgICAgICA9IHQuYXR0ciggJ2RhdGEtc2F2ZS1jYXJ0JyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNhZGRfdG9fbGlzdF9wb3B1cCcgKSxcblx0XHRcdGN1cnJlbnRfbGlzdHMgICAgID0gSlNPTi5wYXJzZSggdC5hdHRyKCAnZGF0YS1saXN0LWlkcycgKSApLFxuXHRcdFx0d2lzaGxpc3RfaWRzICAgICAgPSBwb3B1cC5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94OmNoZWNrZWQnICkubWFwKFxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0KS5nZXQoKSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfcHJvZHVjdF90b19saXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX2xpc3Q6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdHByb2R1Y3RfdHlwZTogdC5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnICksXG5cdFx0XHRcdGN1cnJlbnRfbGlzdHM6IGN1cnJlbnRfbGlzdHMsXG5cdFx0XHRcdHdpc2hsaXN0X2lkczogd2lzaGxpc3RfaWRzLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV9jYXJ0X2l0ZW06IHdsZm1jX2wxMG4ucmVtb3ZlX2Zyb21fY2FydF9pdGVtLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV9jYXJ0X2FsbDogd2xmbWNfbDEwbi5yZW1vdmVfZnJvbV9jYXJ0X2FsbFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKClcblx0XHRcdH07XG5cdFx0aWYgKHR5cGVvZiBjYXJ0X2l0ZW1fa2V5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0ZGF0YS5jYXJ0X2l0ZW1fa2V5ID0gY2FydF9pdGVtX2tleTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBzYXZlX2NhcnQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRkYXRhLnNhdmVfY2FydCA9IHNhdmVfY2FydDtcblx0XHR9XG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2FkZF90b19tdWx0aV9saXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0bGV0IGN1cnJlbnRfcHJvZHVjdF9mb3JtO1xuXG5cdFx0aWYgKCAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCAgKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKS5sZW5ndGggKSB7XG5cblx0XHRcdGxldCBidXR0b24gPSAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCdmb3JtJykuZXEoIDAgKTtcblxuXHRcdH1cblxuXHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdGlmICggIHR5cGVvZiBjdXJyZW50X3Byb2R1Y3RfZm9ybSAhPT0gJ3VuZGVmaW5lZCcgJiYgY3VycmVudF9wcm9kdWN0X2Zvcm0ubGVuZ3RoID4gMCkge1xuXHRcdFx0LypjdXJyZW50X3Byb2R1Y3RfZm9ybS5maW5kKCBcImlucHV0W25hbWU9J2FkZC10by1jYXJ0J11cIiApLmF0dHIoIFwiZGlzYWJsZWRcIix0cnVlICk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybS5maW5kKCBcImlucHV0W25hbWU9J2FkZC10by1jYXJ0J11cIiApLnJlbW92ZUF0dHIoIFwiZGlzYWJsZWRcIiApOyovXG5cdFx0XHRmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSggY3VycmVudF9wcm9kdWN0X2Zvcm0uZ2V0KCAwICkgKTtcblx0XHRcdGZvcm1EYXRhLmRlbGV0ZSggJ2FkZC10by1jYXJ0JyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgYWRkX3RvX2NhcnRfbGluayA9IHQuY2xvc2VzdCggJy5wcm9kdWN0LnBvc3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICkuZmluZCggJy5hZGRfdG9fY2FydF9idXR0b24nICk7XG5cdFx0XHRpZiAoIGFkZF90b19jYXJ0X2xpbmsubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhLnF1YW50aXR5ID0gYWRkX3RvX2NhcnRfbGluay5hdHRyKCAnZGF0YS1xdWFudGl0eScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmVhY2goXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZnVuY3Rpb24oa2V5LHZhbHVlT2JqKXtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXkgLCB0eXBlb2YgdmFsdWVPYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoIHZhbHVlT2JqICkgOiB2YWx1ZU9iaiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ3dsZm1jX2FkZGluZ190b19tdWx0aV9saXN0JyApO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBmb3JtRGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHQvL2RhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcblx0XHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmIChyZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlLnVwZGF0ZV9jYXJ0ICkgKSB7XG5cdFx0XHRcdFx0XHRcdCQoZG9jdW1lbnQpLnRyaWdnZXIoJ3djX3VwZGF0ZV9jYXJ0Jyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiByZXNwb25zZS5leGlzdHMgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UuZXhpc3RzICkgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2UuZXhpc3RzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggd2xmbWNfbDEwbi5sYWJlbHMubXVsdGlfbGlzdF9zYXZlZF90ZXh0ICkgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5tdWx0aV9saXN0X3NhdmVkX3RleHQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggKCByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkICYmIHJlc3BvbnNlLmRlZmF1bHRfd2lzaGxpc3RfaWQgIT09ICdmYWxzZScgKSB8fCAoIHJlc3BvbnNlLmRlZmF1bHRfd2lzaGxpc3RfaWQgJiYgcmVzcG9uc2UubGFzdF9saXN0X2lkICYmICByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkID09PSByZXNwb25zZS5sYXN0X2xpc3RfaWQgKSApIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkLCByZXNwb25zZS5jdXN0b21lcl9pZCwgJ3dpc2hsaXN0JywgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCByZXNwb25zZS5sYXN0X2xpc3RfaWQgJiYgcmVzcG9uc2UubGFzdF9saXN0X2lkICE9PSAnZmFsc2UnICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfYXV0b21hdGlvbnMoIHByb2R1Y3RfaWQsIHJlc3BvbnNlLmxhc3RfbGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsICdsaXN0cycsIHJlc3BvbnNlLmxvYWRfYXV0b21hdGlvbl9ub25jZSApO1xuXHRcdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHRcdC8qaWYgKHR5cGVvZiByZXNwb25zZS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCByZXNwb25zZS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX21vdmVfdG9fbGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWRzJyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNtb3ZlX3BvcHVwJyApLFxuXHRcdFx0Y3VycmVudF9saXN0ICAgICAgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgICAgICA9IHBvcHVwLmZpbmQoICdpbnB1dC5saXN0LWl0ZW0tY2hlY2tib3g6Y2hlY2tlZCcgKS52YWwoKSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246ICB3bGZtY19sMTBuLmFjdGlvbnMubW92ZV90b19hbm90aGVyX2xpc3QsXG5cdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0gdGFibGUud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRpdGVtX2lkczogaXRlbV9pZHMsXG5cdFx0XHRcdGN1cnJlbnRfbGlzdDogY3VycmVudF9saXN0LFxuXHRcdFx0XHRkZXN0aW5hdGlvbl93aXNobGlzdF9pZDogd2lzaGxpc3RfaWQsXG5cdFx0XHR9O1xuXG5cdFx0aWYoIGRhdGEuY3VycmVudF9saXN0ID09PSAnJyB8fCBkYXRhLmRlc3RpbmF0aW9uX3dpc2hsaXN0X2lkID09PSAnJyB8fCBkYXRhLml0ZW1faWRzID09PSAnJyApe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19tb3ZlX3RvX2xpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfbWVzc2FnZSA9IHdsZm1jX2wxMG4ubGFiZWxzLm11bHRpX2xpc3Rfc3VjY2Vzc2Z1bGx5X21vdmVfbWVzc2FnZS5yZXBsYWNlKCAne3dpc2hsaXN0X25hbWV9JywgcmVzcG9uc2Uud2lzaGxpc3RfbmFtZSApO1xuXG5cdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggcmVzcG9uc2VfcmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCcnLCBmdW5jdGlvbihzaG93X3RvYXN0LCByZXNwb25zZV9tZXNzYWdlKXtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwJyApLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwX2JhY2tncm91bmQnICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cF93cmFwcGVyJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZV9tZXNzYWdlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgW3Nob3dfdG9hc3QsIHJlc3BvbnNlX21lc3NhZ2UgXSk7XG5cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlX3Jlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0cG9wdXAucG9wdXAoICdoaWRlJyApO1xuXG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2NvcHlfdG9fbGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWRzJyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNjb3B5X3BvcHVwJyApLFxuXHRcdFx0Y3VycmVudF9saXN0ICAgICAgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgICAgICA9IHBvcHVwLmZpbmQoICdpbnB1dC5saXN0LWl0ZW0tY2hlY2tib3g6Y2hlY2tlZCcgKS52YWwoKSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246ICB3bGZtY19sMTBuLmFjdGlvbnMuY29weV90b19hbm90aGVyX2xpc3QsXG5cdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0gdGFibGUud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRpdGVtX2lkczogaXRlbV9pZHMsXG5cdFx0XHRcdGN1cnJlbnRfbGlzdDogY3VycmVudF9saXN0LFxuXHRcdFx0XHR3aXNobGlzdDogd2lzaGxpc3RfaWQsXG5cdFx0XHR9O1xuXG5cdFx0aWYoIGRhdGEuY3VycmVudF9saXN0ID09PSAnJyB8fCBkYXRhLmRlc3RpbmF0aW9uX3dpc2hsaXN0X2lkID09PSAnJyB8fCBkYXRhLml0ZW1faWRzID09PSAnJyApe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19jb3B5X3RvX2xpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfbWVzc2FnZSA9IHdsZm1jX2wxMG4ubGFiZWxzLnN1Y2Nlc3NmdWxseV9jb3B5X21lc3NhZ2UucmVwbGFjZSggJ3t3aXNobGlzdF9uYW1lfScsIHJlc3BvbnNlLndpc2hsaXN0X25hbWUgKTtcblxuXHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlX3Jlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygnJywgZnVuY3Rpb24oc2hvd190b2FzdCwgcmVzcG9uc2VfbWVzc2FnZSl7XG5cdFx0XHRcdFx0XHRcdCQoICcjY29weV9wb3B1cF9iYWNrZ3JvdW5kJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXBfd3JhcHBlcicgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIFtzaG93X3RvYXN0LCByZXNwb25zZV9tZXNzYWdlIF0pO1xuXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZV9yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19jb3B5X3RvX2RlZmF1bHRfbGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWQnICksXG5cdFx0XHRmaWx0ZXJlZF9kYXRhICAgICA9IG51bGwsXG5cdFx0XHRjdXJyZW50X2xpc3QgICAgICA9IHQuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnICksXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiAgd2xmbWNfbDEwbi5hY3Rpb25zLmNvcHlfdG9fYW5vdGhlcl9saXN0LFxuXHRcdFx0XHRub25jZTogJCggJyN3bGZtYy13aXNobGlzdC1mb3JtIHRhYmxlLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0aXRlbV9pZHM6IGl0ZW1faWRzLFxuXHRcdFx0XHR3aXNobGlzdDogJ2RlZmF1bHQnLFxuXHRcdFx0XHRjdXJyZW50X2xpc3Q6IGN1cnJlbnRfbGlzdCxcblx0XHRcdH07XG5cblx0XHRpZiggZGF0YS5jdXJyZW50X2xpc3QgPT09ICcnIHx8IGRhdGEuaXRlbV9pZHMgPT09ICcnICl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2NvcHlfdG9fZGVmYXVsdF9saXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX21lc3NhZ2UgPSB3bGZtY19sMTBuLmxhYmVscy5zdWNjZXNzZnVsbHlfY29weV9tZXNzYWdlLnJlcGxhY2UoICd7d2lzaGxpc3RfbmFtZX0nLCByZXNwb25zZS53aXNobGlzdF9uYW1lICk7XG5cblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZV9yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoICdsaXN0X2NvdW50ZXInICk7XG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZV9tZXNzYWdlICkgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISAkLmZuLldMRk1DLmlzVHJ1ZSggcmVzcG9uc2VfcmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLW11bHRpLWxpc3QtYnRuLWxvZ2luLW5lZWQnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMubXVsdGlfbGlzdF9sb2dpbl9uZWVkICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5cbmZ1bmN0aW9uIFdsZm1jQ2hlY2tib3hMaXN0c0NoYW5nZSgpIHtcblx0bGV0IHBvcHVwID0gJCggJyNhZGRfdG9fbGlzdF9wb3B1cCcgKTtcblx0Y29uc3Qgc3VibWl0QnRuID0gcG9wdXAuZmluZCgnLndsZm1jX2FkZF90b19tdWx0aV9saXN0Jyk7XG5cdGNvbnN0IGNoZWNrYm94ZXMgPSBwb3B1cC5maW5kKCcubGlzdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblx0Y29uc3QgaGFzQ2hhbmdlZCA9IGNoZWNrYm94ZXMudG9BcnJheSgpLnNvbWUoKGNiLCBpbmRleCkgPT4gJChjYikucHJvcCgnY2hlY2tlZCcpICE9PSBQcmV2TGlzdHNTdGF0ZVtpbmRleF0pO1xuXHRzdWJtaXRCdG4ucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0aWYgKGhhc0NoYW5nZWQpIHtcblx0XHRzdWJtaXRCdG4ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdH1cbn1cbjtcblx0XHRcdFx0LyogPT09IFNBVkUgRk9SIExBVEVSID09PSAqL1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWxpc3QgLnJlbW92ZS1hbGwtZnJvbS1zYXZlLWZvci1sYXRlci1idG4nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRsZXQgcXVhbnRpdHlfZmllbGRzID0gJCggdGhpcyApLmNsb3Nlc3QoJ2Zvcm0nKS5maW5kKCdpbnB1dC5xdHknKTtcblx0XHRpZiAoIHF1YW50aXR5X2ZpZWxkcy5sZW5ndGggPiAwICkge1xuXHRcdFx0cXVhbnRpdHlfZmllbGRzLmF0dHIoIFwiZGlzYWJsZWRcIix0cnVlICk7XG5cdFx0fVxuXHR9XG4pO1xuXG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfYWRkX3RvX3NhdmVfZm9yX2xhdGVyJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgdCAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGNhcnRfaXRlbV9rZXkgPSB0LmF0dHIoICdkYXRhLWNhcnRfaXRlbV9rZXknICk7XG5cdFx0JC5mbi5XTEZNQy5hZGRfdG9fc2F2ZV9mb3JfbGF0ZXIoIGNhcnRfaXRlbV9rZXksIHQgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfcmVtb3ZlX2Zyb21fc2F2ZV9mb3JfbGF0ZXInLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIHQgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHJvdyAgICAgICAgICA9IHQucGFyZW50cyggJ1tkYXRhLWl0ZW0taWRdJyApLFxuXHRcdFx0ZGF0YV9pdGVtX2lkID0gcm93LmRhdGEoICdpdGVtLWlkJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5yZW1vdmVfZnJvbV9zYXZlX2Zvcl9sYXRlcl9hY3Rpb24sXG5cdFx0XHRcdG5vbmNlOiB3bGZtY19sMTBuLmFqYXhfbm9uY2UucmVtb3ZlX2Zyb21fc2F2ZV9mb3JfbGF0ZXJfbm9uY2UsXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdHJlbW92ZV9mcm9tX3NhdmVfZm9yX2xhdGVyOiBkYXRhX2l0ZW1faWQsXG5cdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoKVxuXHRcdFx0fTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLnNhdmVfZm9yX2xhdGVyX2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRpZiAoICEgZGF0YSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdC8qaWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0aWYgKCBkYXRhLmNvdW50ICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmF0dHIoICdkYXRhLWNvdW50JywgZGF0YS5jb3VudCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggJ3RydWUnID09PSBkYXRhLnJlc3VsdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfcHJvZHVjdF9yZW1vdmVkX3RleHQgKSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfcHJvZHVjdF9yZW1vdmVkX3RleHQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIGRhdGEuY291bnQgIT09ICd1bmRlZmluZWQnICYmIDAgPT09IGRhdGEuY291bnQgKSB7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblxuXHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fc2F2ZV9mb3JfbGF0ZXInLCBbdCwgcm93ICwgZGF0YV0gKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfc2F2ZV9mb3JfbGF0ZXJfYWpheF9hZGRfdG9fY2FydCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZCA9IHQuYXR0ciggJ2RhdGEtaXRlbV9pZCcgKSxcblx0XHRcdGRhdGEgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnNhdmVfZm9yX2xhdGVyX2FkZF90b19jYXJ0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHdsZm1jX2wxMG4uYWpheF9ub25jZS5hZGRfdG9fY2FydF9mcm9tX3NmbF9ub25jZSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0aXRlbV9pZDogaXRlbV9pZCxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0XHR9O1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR0LnJlbW92ZUNsYXNzKCAnYWRkZWQnICk7XG5cdFx0dC5hZGRDbGFzcyggJ2xvYWRpbmcnICk7XG5cblx0XHQvLyBBbGxvdyAzcmQgcGFydGllcyB0byB2YWxpZGF0ZSBhbmQgcXVpdCBlYXJseS5cblx0XHRpZiAoIGZhbHNlID09PSAkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlckhhbmRsZXIoICdzaG91bGRfc2VuZF9hamF4X3JlcXVlc3QuYWRkaW5nX3RvX2NhcnQnLCBbIHQgXSApICkge1xuXHRcdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhamF4X3JlcXVlc3Rfbm90X3NlbnQuYWRkaW5nX3RvX2NhcnQnLCBbIGZhbHNlLCBmYWxzZSwgdCBdICk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhZGRpbmdfdG9fY2FydCcsIFsgdCwge30gXSApO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uc2F2ZV9mb3JfbGF0ZXJfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHQvL2RhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGlmICggISByZXNwb25zZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIHJlc3BvbnNlLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVwbGFjZV9mcmFnbWVudHMoIHJlc3BvbnNlLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UuZXJyb3IgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlLmVycm9yICk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISAkKCAnZm9ybS53b29jb21tZXJjZS1jYXJ0LWZvcm0nICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlc3BvbnNlLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzcG9uc2UuZnJhZ21lbnRzLndsZm1jX3NhdmVfZm9yX2xhdGVyX2NvdW50ICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy10YWJzLXdyYXBwZXInICkuYXR0ciggJ2RhdGEtY291bnQnLCByZXNwb25zZS5mcmFnbWVudHMud2xmbWNfc2F2ZV9mb3JfbGF0ZXJfY291bnQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCd3Y19mcmFnbWVudF9yZWZyZXNoJyk7XG5cdFx0XHRcdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IHNvIHRoZW1lcyBjYW4gcmVmcmVzaCBvdGhlciBhcmVhcy5cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkZWRfdG9fY2FydCcsIFsgcmVzcG9uc2UuZnJhZ21lbnRzLCByZXNwb25zZS5jYXJ0X2hhc2gsIHQgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnI2FkZF90b19zYXZlX2Zvcl9sYXRlcl9wb3B1cCAjYWRkX2l0ZW0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcjYWRkX3RvX3NhdmVfZm9yX2xhdGVyX3BvcHVwJyApLnBvcHVwKCAnaGlkZScgKTtcblx0XHR2YXIgY2FydF9pdGVtX2tleSA9ICQuZm4uV0xGTUMuZ2V0VXJsUGFyYW1ldGVyKCByZW1vdmVfaXRlbV91cmwsICdyZW1vdmVfaXRlbScgKTtcblx0XHR2YXIgcm93ICAgICAgICAgICA9ICQoICdhW2hyZWY9XCInICsgcmVtb3ZlX2l0ZW1fdXJsICsgJ1wiXScgKS5jbG9zZXN0KCAndHInICk7XG5cdFx0JC5mbi5XTEZNQy5hZGRfdG9fc2F2ZV9mb3JfbGF0ZXIoIGNhcnRfaXRlbV9rZXksIHJvdyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuYi5vbihcblx0J2NsaWNrJyxcblx0JyNhZGRfdG9fc2F2ZV9mb3JfbGF0ZXJfcG9wdXAgI3JlbW92ZV9pdGVtJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnI2FkZF90b19zYXZlX2Zvcl9sYXRlcl9wb3B1cCcgKS5wb3B1cCggJ2hpZGUnICk7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSByZW1vdmVfaXRlbV91cmw7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXNmbC1idG4tbG9naW4tbmVlZCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfbG9naW5fbmVlZCApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuLyogPT09IEFDQ09SRElPTiA9PT0gKi9cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtYWNjb3JkaW9uLWhlYWRlcicsXG5cdGZ1bmN0aW9uKCBldiApIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmICggISAkKCB0aGlzICkuaGFzQ2xhc3MoICdhY3RpdmUnICkgKSB7XG5cdFx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdCQoIHRoaXMgKS5uZXh0KCBcIi53bGZtYy1hY2NvcmRpb24tcGFuZWxcIiApLnNsaWRlRG93bigpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0JCggdGhpcyApLm5leHQoIFwiLndsZm1jLWFjY29yZGlvbi1wYW5lbFwiICkuc2xpZGVVcCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbi8qID09PSBDTE9TRSBOT1RJQ0UgPT09ICovXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXNhdmUtZm9yLWxhdGVyLWZvcm0gYS53bGZtYy1jbG9zZS1ub3RpY2UnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdCQuZm4uV0xGTUMuc2V0Q29va2llKCAnd2xmbWNfc2F2ZV9mb3JfbGF0ZXJfbm90aWNlJywgdHJ1ZSApO1xuXG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtbm90aWNlLXdyYXBwZXInICkuYW5pbWF0ZSgge29wYWNpdHk6MCB9LCBcInNsb3dcIiApLnJlbW92ZSgpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuO1xuXHRcdFx0XHRcblxudC5vbihcblx0J2FkZGluZ190b19jYXJ0Jyxcblx0J2JvZHknLFxuXHRmdW5jdGlvbiAoZXYsIGJ1dHRvbiwgZGF0YSkge1xuXHRcdGlmICh0eXBlb2YgYnV0dG9uICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmxlbmd0aCkge1xuXHRcdFx0ZGF0YS53aXNobGlzdF9pZCAgID0gYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmRhdGEoICdpZCcgKTtcblx0XHRcdGRhdGEud2lzaGxpc3RfdHlwZSA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnd2lzaGxpc3QtdHlwZScgKTtcblx0XHRcdGRhdGEuY3VzdG9tZXJfaWQgICA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnY3VzdG9tZXItaWQnICk7XG5cdFx0XHRkYXRhLmlzX293bmVyICAgICAgPSBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZGF0YSggJ2lzLW93bmVyJyApO1xuXHRcdFx0dHlwZW9mIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKCB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSB3bGZtY19sMTBuLnJlZGlyZWN0X3RvX2NhcnQgKTtcblxuXHRcdFx0LypsZXQgcHJvZHVjdF9tZXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gYnV0dG9uLmRhdGEoICd3bGZtY19wcm9kdWN0X21ldGEnICk7XG5cdFx0XHRpZiAocHJvZHVjdF9tZXRhKSB7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X21ldGEsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGssdmFsdWUpIHtcblx0XHRcdFx0XHRcdGRhdGFba10gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGRhdGEud2xmbWNfcHJvZHVjdF9tZXRhID0gdHJ1ZTtcblx0XHRcdH0qL1xuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2FkZGVkX3RvX2NhcnQnLFxuXHQnYm9keScsXG5cdGZ1bmN0aW9uIChldiwgZnJhZ21lbnRzLCBjYXJ0aGFzaCwgYnV0dG9uKSB7XG5cdFx0aWYgKHR5cGVvZiBidXR0b24gIT09ICd1bmRlZmluZWQnICYmIGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmxlbmd0aCkge1xuXHRcdFx0dHlwZW9mIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKCB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSBjYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCApO1xuXG5cdFx0XHR2YXIgdHIgICAgIFx0XHQgICA9IGJ1dHRvbi5jbG9zZXN0KCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdFx0dGFibGUgIFx0XHQgICA9IHRyLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICksXG5cdFx0XHRcdG9wdGlvbnNcdFx0ICAgPSB0YWJsZS5kYXRhKCAnZnJhZ21lbnQtb3B0aW9ucycgKSxcblx0XHRcdFx0ZGF0YV9yb3dfaWQgICAgPSB0ci5kYXRhKCAncm93LWlkJyApLFxuXHRcdFx0XHR3aXNobGlzdF9pZCAgICA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ2lkJyApLFxuXHRcdFx0XHR3aXNobGlzdF90b2tlbiA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ3Rva2VuJyApLFxuXHRcdFx0XHRsaXN0X3R5cGUgICAgICA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ3dpc2hsaXN0LXR5cGUnICksXG5cdFx0XHRcdHJlbG9hZF9mcmFnbWVudCA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHRcdHRyLmZpbmQoICcuYWRkZWRfdG9fY2FydCcgKS5yZW1vdmUoKTtcblx0XHRcdGlmICh3bGZtY19sMTBuLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FmdGVyX2FkZF90b19jYXJ0ICYmIG9wdGlvbnMuaXNfdXNlcl9vd25lcikge1xuXG5cdFx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIGRhdGFfcm93X2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblxuXHRcdFx0XHRpZiAoICd3aXNobGlzdCcgPT09IGxpc3RfdHlwZSApIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHR2YXIgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fbGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3RbaV0ud2lzaGxpc3RfaWQgPT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl9saXN0W2ldLnByb2R1Y3RfaWQgPT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIGRhdGFfcm93X2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyIC5wcm9kdWN0cy1jb3VudGVyLW51bWJlcicgKS50ZXh0KCBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2lzaGxpc3QgLnRvdGFsLXByb2R1Y3RzIC53bGZtYy10b3RhbC1jb3VudCcgKS50ZXh0KCBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRpZiAoKCAhIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggfHwgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCA9PT0gMCB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13aXNobGlzdC10YWJsZS13cmFwcGVyJyApLmVtcHR5KCk7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVsb2FkX2ZyYWdtZW50ID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoICd3YWl0bGlzdCcgPT09IGxpc3RfdHlwZSApIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdGxldCBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3dhaXRsaXN0X2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX3dhaXRsaXN0ICkgKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgZGF0YV9yb3dfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXIgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdC53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cblx0XHRcdFx0XHRcdGlmICggKCAhIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoIHx8IHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoID09PSAwIHx8ICEgdGFibGUuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkubGVuZ3RoKSkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZWxvYWRfZnJhZ21lbnQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggJ2xpc3RzJyA9PT0gbGlzdF90eXBlICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMucmVsb2FkX2ZyYWdtZW50ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcmVsb2FkX2ZyYWdtZW50ICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYnV0dG9uICE9PSAndW5kZWZpbmVkJyAmJiBidXR0b24uY2xvc2VzdCggJy53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5sZW5ndGgpIHtcblx0XHRcdHZhciB0ciAgICAgICAgICAgPSBidXR0b24uY2xvc2VzdCggJ1tkYXRhLWl0ZW0taWRdJyApLFxuXHRcdFx0XHR0YWJsZSAgICAgICAgPSB0ci5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApLFxuXHRcdFx0XHRvcHRpb25zICAgICAgPSB0YWJsZS5kYXRhKCAnZnJhZ21lbnQtb3B0aW9ucycgKSxcblx0XHRcdFx0ZGF0YV9pdGVtX2lkID0gdHIuZGF0YSggJ2l0ZW0taWQnICk7XG5cdFx0XHRidXR0b24ucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHRcdHRyLmZpbmQoICcuYWRkZWRfdG9fY2FydCcgKS5yZW1vdmUoKTtcblx0XHRcdGlmICggb3B0aW9ucy5pc191c2VyX293bmVyKSB7XG5cdFx0XHRcdCQoICcud2xmbWMtc2F2ZS1mb3ItbGF0ZXItZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoICEgJCggJy53bGZtYy1zYXZlLWZvci1sYXRlci1pdGVtcy13cmFwcGVyIC5zYXZlLWZvci1sYXRlci1pdGVtcy13cmFwcGVyIHRyJyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2FkZF90b19jYXJ0X21lc3NhZ2UnLFxuXHQnYm9keScsXG5cdGZ1bmN0aW9uICggZSwgbWVzc2FnZSwgdCApIHtcblx0XHR2YXIgd3JhcHBlciA9ICQoICcud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyIC53b29jb21tZXJjZS1lcnJvciwud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyIC53b29jb21tZXJjZS1tZXNzYWdlJyApO1xuXG5cdFx0dC5yZW1vdmVDbGFzcyggJ2xvYWRpbmcnICk7XG5cdFx0aWYgKHdyYXBwZXIubGVuZ3RoID09PSAwKSB7XG5cdFx0XHQkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkucHJlcGVuZCggbWVzc2FnZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3cmFwcGVyLmZhZGVPdXQoXG5cdFx0XHRcdDMwMCxcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCcud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyJykucmVwbGFjZVdpdGgoIG1lc3NhZ2UgKS5mYWRlSW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbik7XG5cbnQub24oICdjYXJ0X3BhZ2VfcmVmcmVzaGVkJywgJ2JvZHknLCAkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCApO1xuO1xuXHRcdFx0XHQvKiA9PT0gRFJPUERPV04gQ09VTlRFUiA9PT0gKi9cblxuaWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCkpIHtcblx0dmFyIHdsZm1jX3N3aXBlX3RyaWdnZXI7XG5cdGIub24oXG5cdFx0J3RvdWNoc3RhcnQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3Zlciwud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljaycsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdHdsZm1jX3N3aXBlX3RyaWdnZXIgPSBmYWxzZTtcblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2htb3ZlJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIsLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2snLFxuXHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR3bGZtY19zd2lwZV90cmlnZ2VyID0gdHJ1ZTtcblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2hlbmQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24sLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2sgIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBlbGVtID0gJCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtY291bnRlci13cmFwcGVyJyk7XG5cdFx0XHRpZiAoZWxlbS5oYXNDbGFzcyggJ3dsZm1jLWZpcnN0LXRvdWNoJyApKSB7XG5cdFx0XHRcdGlmICggISB3bGZtY19zd2lwZV90cmlnZ2VyKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5oaWRlX21pbmlfd2lzaGxpc3QuY2FsbCggJCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICksIGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkLmZuLldMRk1DLnNob3dfbWluaV93aXNobGlzdC5jYWxsKCB0aGlzLCBlICk7XG5cdFx0XHRcdGVsZW0uYWRkQ2xhc3MoICd3bGZtYy1maXJzdC10b3VjaCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2hlbmQnLFxuXHRcdCc6bm90KC53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyKTpub3QoLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2spJyxcblx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKCQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMuaGlkZV9taW5pX3dpc2hsaXN0LmNhbGwoICQoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLCBlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXHQvLyBmaXggdXJsIGluIGRyb3Bkb3duIGluIGlwaG9uZSBkZXZpY2VzXG5cdGIub24oXG5cdFx0J3RvdWNoZW5kJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24gYTpub3QoLnJlbW92ZV9mcm9tX3dpc2hsaXN0KScsXG5cdFx0ZnVuY3Rpb24oZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xufSBlbHNlIHtcblx0Yi5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdFx0JC5mbi5XTEZNQy5hcHBlbmR0b0JvZHkoIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkgKTtcblx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cdFx0XHRlbGVtLnRvZ2dsZUNsYXNzKCAnbGlzdHMtc2hvdycgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cblx0dC5vbihcblx0XHRcImNsaWNrXCIsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoXCIud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd25cIik7XG5cdFx0XHRpZiAoJHRyaWdnZXIgIT09IGV2LnRhcmdldCAmJiAhICR0cmlnZ2VyLmhhcyggZXYudGFyZ2V0ICkubGVuZ3RoKSB7XG5cdFx0XHRcdCQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKS5yZW1vdmVDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQnbW91c2VvdmVyJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXItZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcblx0Yi5vbihcblx0XHQnbW91c2VvdXQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXHRiLm9uKFxuXHRcdCdtb3VzZW92ZXInLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdFx0JCggZWxlbSApLmFkZENsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0JC5mbi5XTEZNQy5hcHBlbmR0b0JvZHkoIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkgKTtcblx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cdGIub24oXG5cdFx0J21vdXNlb3V0Jyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBlbGVtID0gJCggJy5kcm9wZG93bl8nICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWlkJyApICk7XG5cdFx0XHQkKCBlbGVtICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXG5cdCQoICcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nICkuaG92ZXJJbnRlbnQoXG5cdFx0e1xuXHRcdFx0aW50ZXJ2YWw6IDAsXG5cdFx0XHR0aW1lb3V0OiAxMDAsXG5cdFx0XHRvdmVyOiAkLmZuLldMRk1DLnNob3dfbWluaV93aXNobGlzdCxcblx0XHRcdG91dDogJC5mbi5XTEZNQy5oaWRlX21pbmlfd2lzaGxpc3Rcblx0XHR9XG5cdCk7XG59XG47XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3ByZXBhcmVfcXR5X2xpbmtzKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3dpc2hsaXN0X3BvcHVwKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3F1YW50aXR5KCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NvcHlfd2lzaGxpc3RfbGluaygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF90b29sdGlwKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NvbXBvbmVudHMoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcG9wdXBzKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2xheW91dCgpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9kcmFnX25fZHJvcCgpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9wb3B1cF9jaGVja2JveF9oYW5kbGluZygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9kcm9wZG93bl9saXN0cygpO1xuXHRcdFx0fVxuXHRcdCkudHJpZ2dlciggJ3dsZm1jX2luaXQnICk7XG5cblx0XHQvLyBmaXggd2l0aCBqZXQgd29vIGJ1aWxkZXIgcGx1Z2luLlxuXG4kKCBkb2N1bWVudCApXG5cdC5vbiggJ2pldC1maWx0ZXItY29udGVudC1yZW5kZXJlZCcsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jIClcblx0Lm9uKCAnamV0LXdvby1idWlsZGVyLWNvbnRlbnQtcmVuZGVyZWQnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApXG5cdC5vbiggJ2pldC1lbmdpbmUvbGlzdGluZy1ncmlkL2FmdGVyLWxvYWQtbW9yZScsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jIClcblx0Lm9uKCAnamV0LWVuZ2luZS9saXN0aW5nLWdyaWQvYWZ0ZXItbGF6eS1sb2FkJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKVxuXHQub24oICdqZXQtY3ctbG9hZGVkJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKTtcbi8vIGxvYWQgZnJhZ21lbnQgZm9yIGZpeCBmaWx0ZXIgZXZlcnl0aGluZyBhamF4IHJlc3BvbnNlLlxuJCggZG9jdW1lbnQgKS5yZWFkeSggJC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cyApO1xuLy8gbG9hZCBmcmFnbWVudCBmb3IgZml4IGJ1ZyB3aXRoIGFqYXggZmlsdGVyIERlc3RpbnkgRWxlbWVudHMgcGx1Z2luXG4kKCBkb2N1bWVudCApLm9uKCAnZGVDb250ZW50TG9hZGVkJyAsICQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMgKTtcbi8vIGZpeCB3YWl0bGlzdCBwb3B1cCBhZnRlciB3cGMgY29tcG9zaXRlIHByb2R1Y3QgZ2FsbGVyeSBsb2FkZWQgaW4gc2luZ2xlIHByb2R1Y3QgcGFnZVxuJCggZG9jdW1lbnQgKS5vbiggJ3dvb2NvX2dhbGxlcnlfbG9hZGVkJywgZnVuY3Rpb24oIGUsIHByb2R1Y3RfaWQgKSB7XG5cdGlmICggcHJvZHVjdF9pZCApIHtcblx0XHQkKCcqW2lkXj1cImFkZF90b193YWl0bGlzdF9wb3B1cF8nICsgcHJvZHVjdF9pZCArICdfXCJdLnBvcHVwX3dyYXBwZXInKS5yZW1vdmUoKTtcblx0fVxufSk7XG47XG5cblx0XHRcbnZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuXHRmdW5jdGlvbihtdXRhdGlvbnMpIHtcblx0XHRtdXRhdGlvbnMuZm9yRWFjaChcblx0XHRcdGZ1bmN0aW9uKG11dGF0aW9uKSB7XG5cdFx0XHRcdGlmICggJCggJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnlfX3dyYXBwZXIgLndsZm1jLXRvcC1vZi1pbWFnZScgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9maXhfb25faW1hZ2Vfc2luZ2xlX3Bvc2l0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZml4IHRvcCBvZiBpbWFnZSBmb3IgcG93ZXItcGFjayBzaW5nbGUgcHJvZHVjdC5cblx0XHRcdFx0aWYgKCAkKCAnLnBwLXNpbmdsZS1wcm9kdWN0IC5lbnRyeS1zdW1tYXJ5ID4gLndsZm1jLXRvcC1vZi1pbWFnZScgKS5sZW5ndGggPiAwICYmICQoICcucHAtc2luZ2xlLXByb2R1Y3QgLmVudHJ5LXN1bW1hcnkgLnNpbmdsZS1wcm9kdWN0LWltYWdlJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0JCggJy5wcC1zaW5nbGUtcHJvZHVjdCcgKS5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHZhciAkd2xmbWNUb3BPZkltYWdlICAgID0gJCggdGhpcyApLmZpbmQoICcud2xmbWMtdG9wLW9mLWltYWdlJyApO1xuXHRcdFx0XHRcdFx0XHR2YXIgJHNpbmdsZVByb2R1Y3RJbWFnZSA9ICQoIHRoaXMgKS5maW5kKCAnLnNpbmdsZS1wcm9kdWN0LWltYWdlJyApO1xuXHRcdFx0XHRcdFx0XHRpZiAoICR3bGZtY1RvcE9mSW1hZ2UubGVuZ3RoID4gMCAmJiAkc2luZ2xlUHJvZHVjdEltYWdlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHQkd2xmbWNUb3BPZkltYWdlLmFwcGVuZFRvKCAkc2luZ2xlUHJvZHVjdEltYWdlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuKTtcbm9ic2VydmVyLm9ic2VydmUoICQoICdib2R5JyApWzBdLCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9ICk7XG47XG5cblx0XHQvKiA9PT0gRFJPUERPV04gQ09VTlRFUiA9PT0gKi9cblxuJCggd2luZG93ICkub24oXG5cdFwic2Nyb2xsIHJlc2l6ZVwiLFxuXHRmdW5jdGlvbigpIHtcblx0XHQkKCBcIi53bGZtYy1jb3VudGVyLWRyb3Bkb3duXCIgKS5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCAkKCB0aGlzICkgKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG4pO1xuO1xuXG5cdFx0LyogU3RvcmFnZSBIYW5kbGluZyAqL1xuXG52YXIgJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgPSB0cnVlLFxuXHR3aXNobGlzdF9oYXNoX2tleSAgICAgICA9IHdsZm1jX2wxMG4ud2lzaGxpc3RfaGFzaF9rZXksXG5cdHByb2R1Y3RzX2hhc2hfa2V5IFx0XHQ9IHdpc2hsaXN0X2hhc2hfa2V5ICsgJ19wcm9kdWN0cycsXG5cdHdhaXRsaXN0X2hhc2hfa2V5IFx0XHQ9IHdpc2hsaXN0X2hhc2hfa2V5ICsgJ193YWl0bGlzdCcsXG5cdGxhbmdfaGFzaF9rZXlcdFx0XHQ9IHdpc2hsaXN0X2hhc2hfa2V5ICsgJ19sYW5nJztcblxudHJ5IHtcblx0JHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgPSAoICdzZXNzaW9uU3RvcmFnZScgaW4gd2luZG93ICYmIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSAhPT0gbnVsbCApO1xuXHR3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggJ3dsZm1jJywgJ3Rlc3QnICk7XG5cdHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCAnd2xmbWMnICk7XG5cdHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSggJ3dsZm1jJywgJ3Rlc3QnICk7XG5cdHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSggJ3dsZm1jJyApO1xufSBjYXRjaCAoIGVyciApIHtcblx0JHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgPSBmYWxzZTtcbn1cblxuaWYgKCB3bGZtY19sMTBuLmlzX2NhY2hlX2VuYWJsZWQgJiYgd2xmbWNfbDEwbi5pc19wYWdlX2NhY2hlX2VuYWJsZWQgKSB7XG5cdCQuZm4uV0xGTUMudGFibGVfYmxvY2soKTtcbn1cblxuLyogV2lzaGxpc3QgSGFuZGxpbmcgKi9cbmlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cblx0Ly8gUmVmcmVzaCB3aGVuIHN0b3JhZ2UgY2hhbmdlcyBpbiBhbm90aGVyIHRhYi5cblx0JCggd2luZG93ICkub24oXG5cdFx0J3N0b3JhZ2Ugb25zdG9yYWdlJyxcblx0XHRmdW5jdGlvbiAoIGUgKSB7XG5cdFx0XHRpZiAoICggcHJvZHVjdHNfaGFzaF9rZXkgPT09IGUub3JpZ2luYWxFdmVudC5rZXkgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICkgIT09IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICkgKSB8fFxuXHRcdFx0XHQoIHdhaXRsaXN0X2hhc2hfa2V5ID09PSBlLm9yaWdpbmFsRXZlbnQua2V5ICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCB3YWl0bGlzdF9oYXNoX2tleSApICE9PSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCB3YWl0bGlzdF9oYXNoX2tleSApICkgKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Ly8gUmVmcmVzaCB3aGVuIHBhZ2UgaXMgc2hvd24gYWZ0ZXIgYmFjayBidXR0b24gKHNhZmFyaSkuXG5cdCQoIHdpbmRvdyApLm9uKFxuXHRcdCdwYWdlc2hvdycgLFxuXHRcdGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0aWYgKCBlLm9yaWdpbmFsRXZlbnQucGVyc2lzdGVkICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdHRyeSB7XG5cblx0XHRpZiAoIHdsZm1jX2wxMG4uaXNfY2FjaGVfZW5hYmxlZCApIHtcblx0XHRcdHRocm93ICdOZWVkIFVwZGF0ZSB3aXNobGlzdCBkYXRhJztcblx0XHR9XG5cdFx0aWYgKCB3bGZtY19sMTBuLnVwZGF0ZV93aXNobGlzdHNfZGF0YSB8fCAoIG51bGwgIT09IGxhbmcgJiYgbGFuZyAhPT0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oIGxhbmdfaGFzaF9rZXkgKSApIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICE9PSBKU09OLnN0cmluZ2lmeSggd2lzaGxpc3RfaXRlbXMgKSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgKSAhPT0gSlNPTi5zdHJpbmdpZnkoIHdhaXRsaXN0X2l0ZW1zICkgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXksICcnICk7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXksICcnICk7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSwgJycgKTtcblx0XHRcdCQuZm4uV0xGTUMuY2hlY2tfcHJvZHVjdHMoIHdpc2hsaXN0X2l0ZW1zICk7XG5cdFx0XHQkLmZuLldMRk1DLmNoZWNrX3dhaXRsaXN0X3Byb2R1Y3RzKCB3YWl0bGlzdF9pdGVtcyApO1xuXHRcdFx0dGhyb3cgJ05lZWQgVXBkYXRlIHdpc2hsaXN0IGRhdGEnO1xuXHRcdH1cblxuXHRcdGlmICggbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICkgKSB7XG5cdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICk7XG5cdFx0XHRpZiAoJ29iamVjdCcgPT09IF90eXBlb2YoIGRhdGEgKSAmJiBudWxsICE9PSBkYXRhICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmNoZWNrX3Byb2R1Y3RzKCBkYXRhICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgKSApIHtcblx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5ICkgKTtcblx0XHRcdGlmICgnb2JqZWN0JyA9PT0gX3R5cGVvZiggZGF0YSApICYmIG51bGwgIT09IGRhdGEgKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfcHJvZHVjdHMoIGRhdGEgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmZuLldMRk1DLnVuYmxvY2soICQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUtd3JhcHBlciwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkgKTtcblxuXHRcdCQoICcjd2xmbWMtbGlzdHMsI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkuYWRkQ2xhc3MoICdvbi1maXJzdC1sb2FkJyApO1xuXG5cdH0gY2F0Y2ggKCBlcnIgKSB7XG5cdFx0Y29uc29sZS5sb2coIGVyciApO1xuXHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0fVxuXG59IGVsc2Uge1xuXHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG59XG47XG5cblx0XHRcbnZhciBoYXNTZWxlY3RpdmVSZWZyZXNoID0gKFxuXHQndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdwICYmXG5cdHdwLmN1c3RvbWl6ZSAmJlxuXHR3cC5jdXN0b21pemUuc2VsZWN0aXZlUmVmcmVzaCAmJlxuXHR3cC5jdXN0b21pemUud2lkZ2V0c1ByZXZpZXcgJiZcblx0d3AuY3VzdG9taXplLndpZGdldHNQcmV2aWV3LldpZGdldFBhcnRpYWxcbik7XG5pZiAoIGhhc1NlbGVjdGl2ZVJlZnJlc2ggKSB7XG5cdHdwLmN1c3RvbWl6ZS5zZWxlY3RpdmVSZWZyZXNoLmJpbmQoXG5cdFx0J3BhcnRpYWwtY29udGVudC1yZW5kZXJlZCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0fVxuXHQpO1xufVxuO1xuXG5cdH0pO1xufSkoalF1ZXJ5KTtcbiJdfQ==
