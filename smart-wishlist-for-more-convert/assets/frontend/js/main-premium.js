(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof2(i) ? i : i + ""; }
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
            this.node.textContent = this.text;
            document.body.appendChild(this.node);
          }
          this.show = function () {
            // Rerender tooltip.

            var location_order = ['top', 'right', 'bottom', 'left'];
            _self.node.textContent = _self.text;
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
          formData.append('nonce', wlfmc_l10n.ajax_nonce.load_fragments);
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
            product_type: t.attr('data-product-type'),
            nonce: t.data('nonce')
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
            item_id: item_id,
            nonce: t.data('nonce')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvanMvbWFpbi1wcmVtaXVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLENBQUMsVUFBVSxDQUFDLEVBQUU7RUFDYixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDZCxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVk7SUFDN0I7SUFDQSxJQUFJLGVBQWUsR0FBTyxFQUFFO01BQzNCLG1CQUFtQixHQUFHLEVBQUU7TUFDeEIsSUFBSSxHQUFrQixVQUFVLENBQUMsSUFBSTtNQUNyQyxlQUFlLEdBQU8sSUFBSTtNQUMxQixjQUFjLEdBQVEsVUFBVSxDQUFDLGNBQWM7TUFDL0MsY0FBYyxHQUFRLFVBQVUsQ0FBQyxjQUFjO01BQy9DLGNBQWMsR0FBUSxLQUFLO01BQzNCLFdBQVc7TUFDWCxlQUFlO0lBRWhCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHO01BQ2Qsc0JBQXNCLEVBQUUsU0FBeEIsc0JBQXNCLENBQUEsRUFBYztRQUNuQyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUUsaUNBQWtDLENBQUM7UUFFeEUsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNuQixPQUFPLEtBQUs7UUFDYjtRQUVBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1VBQ3BDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDLEVBQUU7WUFDMUMsT0FBTyxLQUFLO1VBQ2I7VUFFQSxJQUFJLElBQUksR0FBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENB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RUFBRztZQUNuRCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBRSxJQUFLLENBQUM7VUFDM0M7UUFDRDtRQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUUsb0VBQXFFLENBQUUsQ0FBQztRQUUvRixDQUFDLENBQUUsbUNBQW9DLENBQUMsQ0FBQyxRQUFRLENBQUUsZUFBZ0IsQ0FBQztNQUVyRSxDQUFDLENBQUMsT0FBUSxHQUFHLEVBQUc7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUksQ0FBQztRQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztNQUM1QjtJQUVELENBQUMsTUFBTTtNQUNOLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVCO0lBQ0E7SUFHQSxJQUFJLG1CQUFtQixHQUN0QixXQUFXLEtBQUssT0FBTyxFQUFFLElBQ3pCLEVBQUUsQ0FBQyxTQUFTLElBQ1osRUFBRSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsSUFDN0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLElBQzNCLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLGFBQzVCO0lBQ0QsSUFBSyxtQkFBbUIsRUFBRztNQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FDakMsMEJBQTBCLEVBQzFCLFlBQVc7UUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztNQUM1QixDQUNELENBQUM7SUFDRjtJQUNBO0VBRUMsQ0FBQyxDQUFDO0FBQ0gsQ0FBQyxFQUFFLE1BQU0sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogTWFpbiBTbWFydCBXb29Db21tZXJjZSBXaXNobGlzdCBKU1xuICpcbiAqIEBhdXRob3IgTW9yZUNvbnZlcnRcbiAqIEBwYWNrYWdlIFNtYXJ0IFdpc2hsaXN0IEZvciBNb3JlIENvbnZlcnRcbiAqXG4gKiBAdmVyc2lvbiAxLjguNFxuICovXG5cbi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG4oZnVuY3Rpb24gKCQpIHtcblx0JC5ub0NvbmZsaWN0KCk7XG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0XHQvKiA9PT0gTUFJTiBJTklUID09PSAqL1xuXHRcdHZhciBwcm9kdWN0X2luX2xpc3QgICAgID0gW10gLFxuXHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdCA9IFtdICxcblx0XHRcdGxhbmcgICAgICAgICAgICAgICAgPSB3bGZtY19sMTBuLmxhbmcsXG5cdFx0XHRyZW1vdmVfaXRlbV91cmwgICAgID0gbnVsbCxcblx0XHRcdHdpc2hsaXN0X2l0ZW1zICAgICAgPSB3bGZtY19sMTBuLndpc2hsaXN0X2l0ZW1zLFxuXHRcdFx0d2FpdGxpc3RfaXRlbXMgICAgICA9IHdsZm1jX2wxMG4ud2FpdGxpc3RfaXRlbXMsXG5cdFx0XHRwcm9kdWN0X2FkZGluZyAgICAgID0gZmFsc2UsXG5cdFx0XHRmcmFnbWVudHhocixcblx0XHRcdGZyYWdtZW50dGltZW91dDtcblxuXHRcdCQuZm4uV0xGTUMgPSB7XG5cdGluaXRfcHJlcGFyZV9xdHlfbGlua3M6IGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgcXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy53bGZtYy13aXNobGlzdC10YWJsZSAucXVhbnRpdHknICk7XG5cblx0XHRpZiAocXR5Lmxlbmd0aCA8IDEpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHF0eS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHF0eVtpXS5jbGFzc0xpc3QuY29udGFpbnMoICdoaWRkZW4nICkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcGx1cyAgPSBxdHlbaV0ucXVlcnlTZWxlY3RvciggJy5ib3RpZ2EtcXVhbnRpdHktcGx1cywgYS5wbHVzLCAuY3QtaW5jcmVhc2UnICksXG5cdFx0XHRcdG1pbnVzID0gcXR5W2ldLnF1ZXJ5U2VsZWN0b3IoICcuYm90aWdhLXF1YW50aXR5LW1pbnVzLCBhLm1pbnVzLCAuY3QtZGVjcmVhc2UnICk7XG5cblx0XHRcdGlmICggISBwbHVzIHx8ICEgbWludXMgfHwgcGx1cy5sZW5ndGggPCAxIHx8IG1pbnVzLmxlbmd0aCA8IDEgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHBsdXMuY2xhc3NMaXN0LmFkZCggJ3Nob3cnICk7XG5cdFx0XHRtaW51cy5jbGFzc0xpc3QuYWRkKCAnc2hvdycgKTtcblx0XHRcdHZhciBwbHVzX2Nsb25lICA9IHBsdXMuY2xvbmVOb2RlKCB0cnVlICksXG5cdFx0XHRcdG1pbnVzX2Nsb25lID0gbWludXMuY2xvbmVOb2RlKCB0cnVlICk7XG5cdFx0XHRwbHVzX2Nsb25lLmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdCdjbGljaycsXG5cdFx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciBpbnB1dCAgICAgICA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCAnLnF0eScgKSxcblx0XHRcdFx0XHRcdHZhbCAgICAgICAgID0gcGFyc2VGbG9hdCggaW5wdXQudmFsdWUsIDEwICkgfHwgMCxcblx0XHRcdFx0XHRcdGNoYW5nZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdIVE1MRXZlbnRzJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWF4X3ZhbCA9IChpbnB1dC5nZXRBdHRyaWJ1dGUoIFwibWF4XCIgKSAmJiBwYXJzZUZsb2F0KCBpbnB1dC5nZXRBdHRyaWJ1dGUoIFwibWF4XCIgKSwgMCApKSB8fCAxIC8gMDtcblx0XHRcdFx0XHRpbnB1dC52YWx1ZSAgID0gdmFsIDwgbWF4X3ZhbCA/IE1hdGgucm91bmQoIDEwMCAqICh2YWwgKyBwYXJzZUZsb2F0KCBpbnB1dC5zdGVwIHx8IFwiMVwiICkpICkgLyAxMDAgOiBtYXhfdmFsO1xuXG5cdFx0XHRcdFx0Ly8gaW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZSA9PT0gJycgPyAwIDogcGFyc2VJbnQoIGlucHV0LnZhbHVlICkgKyAxO1xuXHRcdFx0XHRcdGNoYW5nZUV2ZW50LmluaXRFdmVudCggJ2NoYW5nZScsIHRydWUsIGZhbHNlICk7XG5cdFx0XHRcdFx0aW5wdXQuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0XHRtaW51c19jbG9uZS5hZGRFdmVudExpc3RlbmVyKFxuXHRcdFx0XHQnY2xpY2snLFxuXHRcdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR2YXIgaW5wdXQgICAgICAgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvciggJy5xdHknICksXG5cdFx0XHRcdFx0XHR2YWwgICAgICAgICA9IHBhcnNlRmxvYXQoIGlucHV0LnZhbHVlLCAxMCApIHx8IDAsXG5cdFx0XHRcdFx0XHRjaGFuZ2VFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnSFRNTEV2ZW50cycgKTtcblx0XHRcdFx0XHRjb25zdCBtaW5fdmFsICAgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoIFwibWluXCIgKSA/IE1hdGgucm91bmQoIDEwMCAqIHBhcnNlRmxvYXQoIGlucHV0LmdldEF0dHJpYnV0ZSggXCJtaW5cIiApLCAwICkgKSAvIDEwMCA6IDA7XG5cdFx0XHRcdFx0aW5wdXQudmFsdWUgICAgID0gdmFsID4gbWluX3ZhbCA/IE1hdGgucm91bmQoIDEwMCAqICh2YWwgLSBwYXJzZUZsb2F0KCBpbnB1dC5zdGVwIHx8IFwiMVwiICkpICkgLyAxMDAgOiBtaW5fdmFsO1xuXG5cdFx0XHRcdFx0Ly8gaW5wdXQudmFsdWUgPSBwYXJzZUludCggaW5wdXQudmFsdWUgKSA+IDAgPyBwYXJzZUludCggaW5wdXQudmFsdWUgKSAtIDEgOiAwO1xuXHRcdFx0XHRcdGNoYW5nZUV2ZW50LmluaXRFdmVudCggJ2NoYW5nZScsIHRydWUsIGZhbHNlICk7XG5cdFx0XHRcdFx0aW5wdXQuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0XHRxdHlbaV0ucmVwbGFjZUNoaWxkKCBwbHVzX2Nsb25lLCBwbHVzICk7XG5cdFx0XHRxdHlbaV0ucmVwbGFjZUNoaWxkKCBtaW51c19jbG9uZSwgbWludXMgKTtcblx0XHR9XG5cblx0fSxcblxuXHRwcmVwYXJlX21pbmlfd2lzaGxpc3Q6IGZ1bmN0aW9uIChhKSB7XG5cdFx0aWYgKCBhLmhhc0NsYXNzKCAncG9zaXRpb24tYWJzb2x1dGUnICkgKSB7XG5cdFx0XHR2YXIgYW8gID0gYS5vZmZzZXQoKSxcblx0XHRcdFx0YWwgID0gYW8ubGVmdCxcblx0XHRcdFx0YXQgID0gYW8udG9wLFxuXHRcdFx0XHRhdyAgPSBhLm91dGVyV2lkdGgoKSxcblx0XHRcdFx0YWggID0gYS5vdXRlckhlaWdodCgpLFxuXHRcdFx0XHRsYSAgPSBwYXJzZUZsb2F0KCBhLmNzcyggJ2xlZnQnICkgKSxcblx0XHRcdFx0dGEgID0gcGFyc2VGbG9hdCggYS5jc3MoICd0b3AnICkgKSxcblx0XHRcdFx0YW9sID0gYWwgLSBsYSxcblx0XHRcdFx0YW90ID0gYXQgLSB0YSxcblx0XHRcdFx0X2xhID0gbGEsIF90YSA9IHRhLCB3dyA9ICQoIHdpbmRvdyApLndpZHRoKCksIGRoID0gJCggZG9jdW1lbnQgKS5oZWlnaHQoKSwgb3MgPSA1MCxcblx0XHRcdFx0ciAgID0gd3cgLSBhb2wgLSBhdyAtIG9zLCBsID0gb3MgLSBhb2wsIGIgPSBkaCAtIGFvdCAtIGFoIC0gb3M7XG5cdFx0XHRpZiAod3cgPD0gYXcpIHtcblx0XHRcdFx0X2xhID0gLTEgKiBhb2w7XG5cdFx0XHR9IGVsc2UgaWYgKDAgPiB3dyAtIChhdyArIG9zICogMikpIHtcblx0XHRcdFx0X2xhID0gKHd3IC0gYXcpIC8gMiAtIGFvbDtcblx0XHRcdH0gZWxzZSBpZiAoMCA8IGwpIHtcblx0XHRcdFx0X2xhID0gbDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IHIpIHtcblx0XHRcdFx0X2xhID0gcjtcblx0XHRcdH1cblx0XHRcdGlmIChkaCA8IGFoKSB7XG5cdFx0XHRcdGEuaGVpZ2h0KCBkaCAtIGEub3V0ZXJIZWlnaHQoKSArIGEuaGVpZ2h0KCkgKTtcblx0XHRcdFx0YWggPSBhLm91dGVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGggPD0gYWgpIHtcblx0XHRcdFx0X3RhID0gLTEgKiBhb3Q7XG5cdFx0XHR9IGVsc2UgaWYgKDAgPiBkaCAtIChhaCArIG9zICogMikpIHtcblx0XHRcdFx0X3RhID0gKGRoIC0gYWgpIC8gMiAtIGFvdDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IGIpIHtcblx0XHRcdFx0X3RhID0gYjtcblx0XHRcdH1cblx0XHRcdGEuY3NzKCB7bGVmdDogX2xhLCB0b3A6IF90YSx9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwID0gJCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXIuJyArIGEuYXR0ciggJ2RhdGEtaWQnICkgKTtcblx0XHRcdGlmICggdHlwZW9mIHAgIT09ICd1bmRlZmluZWQnICYmIDAgPCBwLmxlbmd0aCApIHtcblx0XHRcdFx0dmFyIHBvICA9IHAub2Zmc2V0KCksXG5cdFx0XHRcdFx0c3QgID0gJCggd2luZG93ICkuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0X2xhID0gcG8ubGVmdCxcblx0XHRcdFx0XHRfdGEgPSBwby50b3AgKyBwLmhlaWdodCgpIC0gc3QsXG5cdFx0XHRcdFx0YXcgID0gYS5vdXRlcldpZHRoKCksXG5cdFx0XHRcdFx0d3cgID0gJCggd2luZG93ICkud2lkdGgoKTtcblxuXHRcdFx0XHRpZiAoX2xhICsgYXcgPiB3dykge1xuXHRcdFx0XHRcdF9sYSA9IHd3IC0gYXcgLSAyMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRhLmNzcygge2xlZnQ6IF9sYSAsIHRvcDogX3RhIH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fSxcblxuXHRhcHBlbmR0b0JvZHk6IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0aWYgKCAhIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy5wb3NpdGlvbi1maXhlZCcgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgY291bnRlcl90eXBlID0gZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLWNvdW50ZXItaXRlbXMnICkuaGFzQ2xhc3MoICd3bGZtYy1saXN0cy1jb3VudGVyLWRyb3Bkb3duJyApID8gJ3dsZm1jLXByZW1pdW0tbGlzdC1jb3VudGVyJyA6IChlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmhhc0NsYXNzKCAnd2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJyApID8gJ3dsZm1jLXdhaXRsaXN0LWNvdW50ZXInIDogJ3dsZm1jLXdpc2hsaXN0LWNvdW50ZXInKTtcblx0XHRpZiAoIGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXdpc2hsaXN0LWNvdW50ZXInICkubGVuZ3RoID4gMCB8fCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy13YWl0bGlzdC1jb3VudGVyJyApLmxlbmd0aCA+IDAgfHwgZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtcHJlbWl1bS1saXN0LWNvdW50ZXInICkubGVuZ3RoID4gMCAgKSB7XG5cdFx0XHR2YXIgd2lkZ2V0SWQgID0gZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtd2lzaGxpc3QtY291bnRlcicgKS5kYXRhKCBcImlkXCIgKSB8fCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy13YWl0bGlzdC1jb3VudGVyJyApLmRhdGEoIFwiaWRcIiApIHx8IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXByZW1pdW0tbGlzdC1jb3VudGVyJyApLmRhdGEoIFwiaWRcIiApO1xuXHRcdFx0dmFyIGVsZW1lbnRJZCA9IGVsZW0uY2xvc2VzdCggJ1tkYXRhLWVsZW1lbnRvci1pZF0nICkuZGF0YSggXCJlbGVtZW50b3ItaWRcIiApO1xuXHRcdFx0dmFyIGVsZW1lbnRvciA9IFwiPGRpdiBjbGFzcz0nd2xmbWMtZWxlbWVudG9yIGVsZW1lbnRvciBlbGVtZW50b3ItXCIgKyBlbGVtZW50SWQgKyBcIiBcIiArIGNvdW50ZXJfdHlwZSArIFwiJz48ZGl2IGNsYXNzPSdlbGVtZW50b3ItZWxlbWVudCBlbGVtZW50b3ItZWxlbWVudC1cIiArIHdpZGdldElkICsgXCInPjwvZGl2PjwvZGl2PlwiO1xuXHRcdFx0JCggZWxlbWVudG9yICkuYXBwZW5kVG8oIFwiYm9keVwiICk7XG5cdFx0XHQkKCBcIi53bGZtYy1lbGVtZW50b3IuZWxlbWVudG9yLVwiICsgZWxlbWVudElkICsgXCIgLmVsZW1lbnRvci1lbGVtZW50LVwiICsgd2lkZ2V0SWQgKS5hcHBlbmQoIGVsZW0gKTtcblxuXHRcdH0gZWxzZSBpZiAoICEgZWxlbS5jbG9zZXN0KCAnLndsZm1jLWVsZW1lbnRvcicgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0dmFyIHdpZGdldElkICA9IGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWl0ZW1zJyApLmRhdGEoIFwiaWRcIiApO1xuXHRcdFx0dmFyIGVsZW1lbnRvciA9IFwiPGRpdiBjbGFzcz0nd2xmbWMtZWxlbWVudG9yIG5vLWVsZW1lbnRvci1cIiArIHdpZGdldElkICsgXCIgXCIgKyBjb3VudGVyX3R5cGUgKyBcIic+PC9kaXY+XCI7XG5cdFx0XHQkKCBlbGVtZW50b3IgKS5hcHBlbmRUbyggXCJib2R5XCIgKTtcblx0XHRcdCQoIFwiLndsZm1jLWVsZW1lbnRvci5uby1lbGVtZW50b3ItXCIgKyB3aWRnZXRJZCApLmFwcGVuZCggZWxlbSApO1xuXHRcdH1cblxuXHR9LFxuXG5cdHNob3dfbWluaV93aXNobGlzdDogZnVuY3Rpb24gKCkge1xuXHRcdCQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKS5yZW1vdmVDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHR2YXIgZWxlbSA9ICQoICcuZHJvcGRvd25fJyArICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1pZCcgKSApIHx8ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLWNvdW50ZXItZHJvcGRvd24nICk7XG5cdFx0JC5mbi5XTEZNQy5hcHBlbmR0b0JvZHkoIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkgKTtcblx0XHQkLmZuLldMRk1DLnByZXBhcmVfbWluaV93aXNobGlzdCggZWxlbSApO1xuXHRcdGVsZW0uYWRkQ2xhc3MoICdsaXN0cy1zaG93JyApO1xuXG5cdH0sXG5cblx0aGlkZV9taW5pX3dpc2hsaXN0OiBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgZWxlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLWNvdW50ZXItZHJvcGRvd24nICk7XG5cdFx0JCggJy53bGZtYy1maXJzdC10b3VjaCcgKS5yZW1vdmVDbGFzcyggJ3dsZm1jLWZpcnN0LXRvdWNoJyApO1xuXHRcdCQoICcud2xmbWMtZmlyc3QtY2xpY2snICkucmVtb3ZlQ2xhc3MoICd3bGZtYy1maXJzdC1jbGljaycgKTtcblx0XHRlbGVtLnJlbW92ZUNsYXNzKCAnbGlzdHMtc2hvdycgKTtcblxuXHR9LFxuXG5cdHJlSW5pdF93bGZtYzogZnVuY3Rpb24gKCkge1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dsZm1jX2luaXQnICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEhhbmRsZSBEcmFnICYgRHJvcCBvZiBpdGVtcyBmb3Igc29ydGluZ1xuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICogQHNpbmNlIDEuNi44XG5cdCAqL1xuXHRpbml0X2RyYWdfbl9kcm9wOiBmdW5jdGlvbiAoKSB7XG5cblx0XHQkKCAndGFibGUud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKS5maWx0ZXIoICcuc29ydGFibGUnICkubm90KCAnLm5vLWludGVyYWN0aW9ucycgKS5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdCA9ICQoIHRoaXMgKSxcblx0XHRcdFx0anF4aHIgPSBmYWxzZTtcblxuXHRcdFx0XHR0LnNvcnRhYmxlKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGl0ZW1zOiAnLndsZm1jLXRhYmxlLWl0ZW1bZGF0YS1yb3ctaWRdJyxcblx0XHRcdFx0XHRcdGhhbmRsZTogXCIuc29ydGFibGUtaGFuZGxlXCIsXG5cdFx0XHRcdFx0XHRwbGFjZWhvbGRlcjogXCJ1aS1zb3J0YWJsZS1wbGFjZWhvbGRlclwiLFxuXHRcdFx0XHRcdFx0c2Nyb2xsOiB0cnVlLFxuXHRcdFx0XHRcdFx0c2Nyb2xsU2Vuc2l0aXZpdHk6IDQwLFxuXHRcdFx0XHRcdFx0dG9sZXJhbmNlIDogXCJwb2ludGVyXCIsXG5cdFx0XHRcdFx0XHRoZWxwZXI6IGZ1bmN0aW9uICggZSwgdWkgKSB7XG5cdFx0XHRcdFx0XHRcdHVpLmNoaWxkcmVuKCkuZWFjaChcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZWxlbXMgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53aXNobGlzdC1pdGVtcy13cmFwcGVyJyApLmZpbmQoICcuc2hvdy1tZXRhLWRhdGEnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIGVsZW1zLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxlbXMucmVtb3ZlQ2xhc3MoICdzaG93LW1ldGEtZGF0YScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsZW1zID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLXJvdy1tZXRhLWRhdGEnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIGVsZW1zLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsZW1zLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1aTtcblxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHVwZGF0ZTogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciByb3cgPSB0LmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLFxuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbnMgICA9IFtdLFxuXHRcdFx0XHRcdFx0XHRpICAgICAgICAgICA9IDA7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCAhIHJvdy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKCBqcXhociApIHtcblx0XHRcdFx0XHRcdFx0XHRqcXhoci5hYm9ydCgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cm93LmVhY2goXG5cdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHQuZmluZCggJ2lucHV0W25hbWUqPVwiW3Bvc2l0aW9uXVwiXScgKS52YWwoIGkrKyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbnMucHVzaCggdC5kYXRhKCAncm93LWlkJyApICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlbGVtZW50cyA9IHQuY2xvc2VzdCggJy53aXNobGlzdC1pdGVtcy13cmFwcGVyJyApLmZpbmQoICcucGFyZW50LXJvdy1pZC0nICsgdC5kYXRhKCAncm93LWlkJyApICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggZWxlbWVudHMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dC5hZnRlciggZWxlbWVudHMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0XHRcdGpxeGhyID0gJC5hamF4KFxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuc29ydF93aXNobGlzdF9pdGVtcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub25jZTogJCggJyN3bGZtYy13aXNobGlzdC1mb3JtIHRhYmxlLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uczogcG9zaXRpb25zLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHdpc2hsaXN0X3Rva2VuOiB0LmRhdGEoICd0b2tlbicgKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwYWdlOiB0LmRhdGEoICdwYWdlJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBlcl9wYWdlOiB0LmRhdGEoICdwZXItcGFnZScgKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybFxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdC8qID09PSBUb29sdGlwID09PSAqL1xuXHRpbml0X3Rvb2x0aXA6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgd2xmbWNfdG9vbHRpcCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBpbnN0YW5jZTtcblx0XHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMuaWRTZWxlY3RvciAgPSAnd2xmbWMtdG9vbHRpcCc7XG5cdFx0XHR0aGlzLnRleHQgICAgICAgID0gJyc7XG5cdFx0XHR0aGlzLnRvcCAgICAgICAgID0gMDtcblx0XHRcdHRoaXMubGVmdCAgICAgICAgPSAwO1xuXHRcdFx0dGhpcy5kaXJlY3Rpb24gICA9IHR5cGVvZiB0aGlzLmRpcmVjdGlvbiAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmRpcmVjdGlvbiA6ICdib3R0b20nO1xuXHRcdFx0dGhpcy50X3R5cGUgICAgICA9IHR5cGVvZiB0aGlzLnRfdHlwZSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLnRfdHlwZSA6ICdkZWZhdWx0Jztcblx0XHRcdHRoaXMudGFyZ2V0ICAgICAgPSAnJztcblx0XHRcdHRoaXMuaGlkZVRpbWVvdXQgPSBudWxsO1xuXG5cdFx0XHQvLyBDcmVhdGUgYWN0dWFsIGVsZW1lbnQgYW5kIHRpZSBlbGVtZW50IHRvIG9iamVjdCBmb3IgcmVmZXJlbmNlLlxuXHRcdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHRoaXMuaWRTZWxlY3RvciApO1xuXG5cdFx0XHRpZiAoICEgdGhpcy5ub2RlICkge1xuXHRcdFx0XHR0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdFx0XHRcdHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgdGhpcy5pZFNlbGVjdG9yICk7XG5cdFx0XHRcdHRoaXMubm9kZS5jbGFzc05hbWUgPSB0aGlzLm5vZGUuY2xhc3NOYW1lICsgXCJ0b29sdGlwX19oaWRkZW5cIjtcblx0XHRcdFx0dGhpcy5ub2RlLnRleHRDb250ZW50ID0gdGhpcy50ZXh0O1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0aGlzLm5vZGUgKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc2hvdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8gUmVyZW5kZXIgdG9vbHRpcC5cblxuXHRcdFx0XHR2YXIgbG9jYXRpb25fb3JkZXIgPSBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddO1xuXG5cdFx0XHRcdF9zZWxmLm5vZGUudGV4dENvbnRlbnQgPSBfc2VsZi50ZXh0O1xuXHRcdFx0XHR2YXIgZGlyZWN0aW9uICAgICAgICA9IF9zZWxmLmRpcmVjdGlvbjtcblx0XHRcdFx0dmFyIHRfdHlwZSAgICAgICAgICAgPSBfc2VsZi50X3R5cGU7XG5cdFx0XHRcdGlmIChkaXJlY3Rpb24pIHtcblx0XHRcdFx0XHQkKCB0aGlzLm5vZGUgKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2V4cGFuZGVkIHRvb2x0aXBfX2V4cGFuZGVkLScgKyBkaXJlY3Rpb24gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKCB0aGlzLm5vZGUgKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2V4cGFuZGVkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQoIHRoaXMubm9kZSApLmFkZENsYXNzKCAnd2xmbWMtdG9vbHRpcC0nICsgdF90eXBlICk7XG5cblx0XHRcdFx0JCggdGhpcy5ub2RlICkucmVtb3ZlQ2xhc3MoICd0b29sdGlwX19oaWRkZW4nICk7XG5cblx0XHRcdFx0aWYgKG9mZnNjcmVlbiggJCggd2xmbWNUb29sdGlwLm5vZGUgKSApKSB7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmhpZGUoKTtcblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID0gbG9jYXRpb25fb3JkZXJbbG9jYXRpb25fb3JkZXIuaW5kZXhPZiggd2xmbWNUb29sdGlwLmRpcmVjdGlvbiApICsgMV07XG5cdFx0XHRcdFx0bW92ZVRpcCggd2xmbWNUb29sdGlwLm5vZGUsIHdsZm1jVG9vbHRpcC50YXJnZXQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdC8vIEhpZGUgdG9vbHRpcC5cblx0XHRcdFx0Ly8gSGlkZSB0b29sdGlwLlxuXHRcdFx0XHRpZiAoX3NlbGYuaGlkZVRpbWVvdXQpIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIF9zZWxmLmhpZGVUaW1lb3V0ICk7XG5cdFx0XHRcdFx0X3NlbGYuaGlkZVRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQoIF9zZWxmLm5vZGUgKS5jc3MoICd0b3AnLCAnMCcgKTtcblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmNzcyggJ2xlZnQnLCAnMCcgKTtcblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmF0dHIoICdjbGFzcycsICcnICk7XG5cdFx0XHRcdCQoIF9zZWxmLm5vZGUgKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2hpZGRlbicgKTtcblx0XHRcdH07XG5cblx0XHR9O1xuXHRcdC8vIE1vdmUgdGlwIHRvIHByb3BlciBsb2NhdGlvbiBiZWZvcmUgZGlzcGxheS5cblx0XHR2YXIgb2Zmc2NyZWVuID0gZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRyZXR1cm4gKChlbC5vZmZzZXRMZWZ0ICsgZWwub2Zmc2V0V2lkdGgpIDwgMCB8fCAoZWwub2Zmc2V0VG9wICsgZWwub2Zmc2V0SGVpZ2h0KSA8IDAgfHwgKGVsLm9mZnNldExlZnQgKyBlbC5vZmZzZXRXaWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIHx8IGVsLm9mZnNldFRvcCArIGVsLm9mZnNldEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkpO1xuXHRcdH07XG5cdFx0dmFyIG1vdmVUaXAgICA9IGZ1bmN0aW9uIChlbGwsIHRhcmdldCkge1xuXG5cdFx0XHR2YXIgJHRhcmdldCA9ICQoIHRhcmdldCApO1xuXHRcdFx0dmFyICRlbGwgICAgPSAkKCBlbGwgKTtcblx0XHRcdHZhciBib2R5ICAgID0gJCggXCJib2R5XCIgKS5vZmZzZXQoKTtcblx0XHRcdCQoIFwiYm9keVwiICkuY3NzKCB7J3Bvc2l0aW9uJzogJ3JlbGF0aXZlJ30gKTtcblxuXHRcdFx0Ly8gZml4ICRlbGwgc2l6ZSBhZnRlciBjaGFuZ2UgbmV3IHRvb2x0aXAgdGV4dC5cblx0XHRcdHdsZm1jVG9vbHRpcC5zaG93KCk7XG5cdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZSgpO1xuXG5cdFx0XHR2YXIgYnV1ID0gNzsgLy8gRGVmYXVsdCBwYWRkaW5nIHNpemUgaW4gcHguXG5cdFx0XHQvLyB2YXIgY2VudGVyX2hlaWdodCA9IC0oJGVsbC5vdXRlckhlaWdodCgpIC8gMikgLyAyO1xuXHRcdFx0dmFyIGNlbnRlcl9oZWlnaHQgPSAoKCR0YXJnZXQub3V0ZXJIZWlnaHQoKSAtICRlbGwub3V0ZXJIZWlnaHQoKSApIC8gMik7XG5cdFx0XHR2YXIgY2VudGVyX3dpZHRoICA9IC0oJGVsbC5vdXRlcldpZHRoKCkgLyAyKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMjtcblxuXHRcdFx0dmFyIGxvY2F0aW9ucyAgICAgID0ge1xuXHRcdFx0XHQndG9wJzogWy0kZWxsLm91dGVySGVpZ2h0KCkgLSBidXUsIGNlbnRlcl93aWR0aF0sXG5cdFx0XHRcdCdyaWdodCc6IFtjZW50ZXJfaGVpZ2h0LCAkdGFyZ2V0Lm91dGVyV2lkdGgoKSArIGJ1dV0sXG5cdFx0XHRcdCdib3R0b20nOiBbJHRhcmdldC5vdXRlckhlaWdodCgpICsgYnV1LCBjZW50ZXJfd2lkdGhdLFxuXHRcdFx0XHQnbGVmdCc6IFtjZW50ZXJfaGVpZ2h0LCAtJGVsbC5vdXRlcldpZHRoKCkgLSBidXVdXG5cdFx0XHR9O1xuXHRcdFx0dmFyIGxvY2F0aW9uX29yZGVyID0gWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXTtcblx0XHRcdHZhciBsb2NhdGlvbl9rZXlzICA9IE9iamVjdC5rZXlzKCBsb2NhdGlvbnMgKTtcblx0XHRcdGlmICh3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID09PSAndG9wJyB8fCB3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID09PSAnYm90dG9tJykge1xuXHRcdFx0XHQkZWxsLmNzcyggJ3RvcCcsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gKGJvZHkudG9wKSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVswXSApO1xuXHRcdFx0XHQkZWxsLmNzcyggJ2xlZnQnLCAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSAoYm9keS5sZWZ0KSArIChidXUgLyAyKSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVsxXSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyAkZWxsLmNzcyggJ3RvcCcsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gKGJvZHkudG9wKSArIChidXUgLyAyKSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVswXSApO1xuXHRcdFx0XHR2YXIgdG9wID0gbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzBdIC0gKGJ1dSAvIDIpO1xuXHRcdFx0XHR0b3AgICAgID0gdG9wIDwgMCA/IHRvcCArIChidXUgLyAyKSA6IHRvcDtcblx0XHRcdFx0JGVsbC5jc3MoICd0b3AnLCAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIChib2R5LnRvcCkgKyB0b3AgKTtcblx0XHRcdFx0JGVsbC5jc3MoICdsZWZ0JywgJHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gKGJvZHkubGVmdCkgKyBsb2NhdGlvbnNbd2xmbWNUb29sdGlwLmRpcmVjdGlvbl1bMV0gKTtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKG9mZnNjcmVlbiggJGVsbCApKSB7XG5cdFx0XHRcdHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPSBsb2NhdGlvbl9vcmRlcltsb2NhdGlvbl9vcmRlci5pbmRleE9mKCB3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uICkgKyAxXTtcblx0XHRcdFx0d2xmbWNUb29sdGlwLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdsZm1jVG9vbHRpcC5zaG93KCk7XG5cdFx0XHR9XG5cblx0XHR9O1xuXG5cdFx0Ly8gQ3JlYXRlIGdsb2JhbCB3bGZtY190b29sdGlwLlxuXHRcdHZhciB3bGZtY1Rvb2x0aXAgPSBuZXcgd2xmbWNfdG9vbHRpcCgpO1xuXHRcdC8vIERldGVjdCBpZiBkZXZpY2UgaXMgdG91Y2gtZW5hYmxlZFxuXHRcdHZhciBpc1RvdWNoRGV2aWNlID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDA7XG5cdFx0Ly8gTW91c2VvdmVyIHRvIHNob3cuXG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdtb3VzZWVudGVyIHRvdWNoc3RhcnQnLFxuXHRcdFx0XCIud2xmbWMtdG9vbHRpcFwiLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0dmFyIF9zZWxmICAgICAgICAgICA9IHRoaXM7XG5cdFx0XHRcdHdsZm1jVG9vbHRpcC50YXJnZXQgPSBfc2VsZjsgLy8gRGVmYXVsdCB0byBzZWxmLlxuXHRcdFx0XHR2YXIgbmFtZV9jbGFzc2VzICAgID0gX3NlbGYuY2xhc3NOYW1lLnNwbGl0KCAnICcgKTtcblx0XHRcdFx0bmFtZV9jbGFzc2VzLmZvckVhY2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGNjKSB7XG5cdFx0XHRcdFx0XHRpZiAoY2MuaW5kZXhPZiggJ3dsZm1jLXRvb2x0aXAtJyApICE9IC0xKSB7IC8vIEZpbmQgYSBkaXJlY3Rpb25hbCB0YWcuXG5cdFx0XHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPSBjYy5zcGxpdCggJy0nIClbY2Muc3BsaXQoICctJyApLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoJCggdGhpcyApLmF0dHIoICdkYXRhLXRvb2x0aXAtdHlwZScgKSkge1xuXG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLnRfdHlwZSA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS10b29sdGlwLXR5cGUnICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoJCggdGhpcyApLmF0dHIoICdkYXRhLXRvb2x0aXAtdGV4dCcgKSkge1xuXG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLnRleHQgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtdG9vbHRpcC10ZXh0JyApO1xuXHRcdFx0XHRcdG1vdmVUaXAoIHdsZm1jVG9vbHRpcC5ub2RlLCB3bGZtY1Rvb2x0aXAudGFyZ2V0ICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBQcmV2ZW50IGRlZmF1bHQgdG91Y2ggYmVoYXZpb3IgdG8gYXZvaWQgc2Nyb2xsaW5nIGlzc3Vlc1xuXHRcdFx0XHRpZiAoZS50eXBlID09PSAndG91Y2hzdGFydCcpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgZXhpc3RpbmcgaGlkZSB0aW1lb3V0XG5cdFx0XHRcdGlmICh3bGZtY1Rvb2x0aXAuaGlkZVRpbWVvdXQpIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHdsZm1jVG9vbHRpcC5oaWRlVGltZW91dCApO1xuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlVGltZW91dCA9IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdtb3VzZWxlYXZlIHRvdWNoZW5kJyxcblx0XHRcdFwiLndsZm1jLXRvb2x0aXBcIixcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIFJlLWhpZGUgdG9vbHRpcC5cblx0XHRcdFx0Ly8gSGlkZSB0b29sdGlwIGFmdGVyIGEgc2hvcnQgZGVsYXkgb24gdG91Y2ggZGV2aWNlc1xuXHRcdFx0XHRpZiAoZS50eXBlID09PSAndG91Y2hlbmQnICYmIGlzVG91Y2hEZXZpY2UpIHtcblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdDEwMDBcblx0XHRcdFx0XHQpOyAvLyAxLXNlY29uZCBkZWxheSBiZWZvcmUgaGlkaW5nXG5cdFx0XHRcdH0gZWxzZSBpZiAoZS50eXBlID09PSAnbW91c2VsZWF2ZScpIHtcblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHQvLyBIaWRlIHRvb2x0aXAgaWYgY2xpY2tpbmcvdGFwcGluZyBvdXRzaWRlXG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCd0b3VjaHN0YXJ0IGNsaWNrJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGlmICggISAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2xmbWMtdG9vbHRpcCcgKS5sZW5ndGggJiYgISAkKCBlLnRhcmdldCApLmlzKCB3bGZtY1Rvb2x0aXAubm9kZSApKSB7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0aW5pdF9maXhfb25faW1hZ2Vfc2luZ2xlX3Bvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCQoICcud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5X193cmFwcGVyIC53bGZtYy10b3Atb2YtaW1hZ2UnICkubGVuZ3RoID4gMCkge1xuXHRcdFx0JCggJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnlfX3dyYXBwZXIgLndsZm1jLXRvcC1vZi1pbWFnZScgKS5lYWNoKFxuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmluc2VydEFmdGVyKCAkKCB0aGlzICkucGFyZW50KCkgKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvKmNvbnN0IHRvcE9mSW1hZ2VFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcud2xmbWMtdG9wLW9mLWltYWdlJyApO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0b3BPZkltYWdlRWxlbXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRFbGVtID0gdG9wT2ZJbWFnZUVsZW1zW2ldO1xuXHRcdFx0Ly8gU2V0IHRoZSBtYXJnaW4gdG9wIG9mIHRoZSBuZXh0IHNpYmxpbmcgZWxlbWVudCB0byB0aGUgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IGVsZW1lbnQuXG5cdFx0XHRpZiAoY3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG5cdFx0XHRcdGxldCBwb3NpdGlvbkNsYXNzICAgPSBbLi4uY3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdF0uZmluZCggY2xhc3NOYW1lID0+IGNsYXNzTmFtZS5zdGFydHNXaXRoKCBcIndsZm1jX3Bvc2l0aW9uX2ltYWdlX1wiICkgKTtcblx0XHRcdFx0bGV0IGN1cnJlbnRQb3NpdGlvbiA9IFsuLi5jdXJyZW50RWxlbS5jbGFzc0xpc3RdLmZpbmQoIGNsYXNzTmFtZSA9PiBjbGFzc05hbWUuc3RhcnRzV2l0aCggXCJ3bGZtY19wb3NpdGlvbl9pbWFnZV9cIiApICk7XG5cdFx0XHRcdGlmIChwb3NpdGlvbkNsYXNzID09PSBjdXJyZW50UG9zaXRpb24pIHtcblx0XHRcdFx0XHRpZiAoJ3dsZm1jX3Bvc2l0aW9uX2ltYWdlX3RvcF9sZWZ0JyA9PT0gcG9zaXRpb25DbGFzcyB8fCAnd2xmbWNfcG9zaXRpb25faW1hZ2VfdG9wX3JpZ2h0JyA9PT0gcG9zaXRpb25DbGFzcykge1xuXHRcdFx0XHRcdFx0bGV0IG1hcmdpblRvcCA9IGAke2N1cnJlbnRFbGVtLm9mZnNldEhlaWdodCArIDV9cHhgO1xuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIHByZXZpb3VzIHNpYmxpbmdzIHdpdGggdGhlIHNhbWUgcG9zaXRpb24gY2xhc3MgYW5kIGFkZCB0aGVpciBoZWlnaHRzIGFuZCBnYXAgdmFsdWVzIHRvIG1hcmdpblRvcC5cblx0XHRcdFx0XHRcdGxldCBwcmV2U2libGluZyA9IGN1cnJlbnRFbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR3aGlsZSAocHJldlNpYmxpbmcgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2xmbWMtdG9wLW9mLWltYWdlJyApICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyggcG9zaXRpb25DbGFzcyApKSB7XG5cdFx0XHRcdFx0XHRcdG1hcmdpblRvcCAgID0gYGNhbGMoICR7bWFyZ2luVG9wfSArICR7cHJldlNpYmxpbmcub2Zmc2V0SGVpZ2h0ICsgNX1weCApYDtcblx0XHRcdFx0XHRcdFx0cHJldlNpYmxpbmcgPSBwcmV2U2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblRvcDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCd3bGZtY19wb3NpdGlvbl9pbWFnZV9ib3R0b21fbGVmdCcgPT09IHBvc2l0aW9uQ2xhc3MgfHwgJ3dsZm1jX3Bvc2l0aW9uX2ltYWdlX2JvdHRvbV9yaWdodCcgPT09IHBvc2l0aW9uQ2xhc3MpIHtcblx0XHRcdFx0XHRcdGxldCBtYXJnaW5Cb3R0b20gPSBgJHtjdXJyZW50RWxlbS5vZmZzZXRIZWlnaHQgKyA1fXB4YDtcblx0XHRcdFx0XHRcdC8vIENoZWNrIGZvciBwcmV2aW91cyBzaWJsaW5ncyB3aXRoIHRoZSBzYW1lIHBvc2l0aW9uIGNsYXNzIGFuZCBhZGQgdGhlaXIgaGVpZ2h0cyBhbmQgZ2FwIHZhbHVlcyB0byBtYXJnaW5Cb3R0b20uXG5cdFx0XHRcdFx0XHRsZXQgcHJldlNpYmxpbmcgPSBjdXJyZW50RWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0d2hpbGUgKHByZXZTaWJsaW5nICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyggJ3dsZm1jLXRvcC1vZi1pbWFnZScgKSAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoIHBvc2l0aW9uQ2xhc3MgKSkge1xuXHRcdFx0XHRcdFx0XHRtYXJnaW5Cb3R0b20gPSBgY2FsYyggJHttYXJnaW5Cb3R0b219ICsgJHtwcmV2U2libGluZy5vZmZzZXRIZWlnaHQgKyA1fXB4IClgO1xuXHRcdFx0XHRcdFx0XHRwcmV2U2libGluZyAgPSBwcmV2U2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1hcmdpbkJvdHRvbSA9IG1hcmdpbkJvdHRvbTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9Ki9cblxuXHR9LFxuXG5cdC8qID09PSBJTklUIEZVTkNUSU9OUyA9PT0gKi9cblxuXHQvKipcblx0ICogSW5pdCBwb3B1cCBmb3IgYWxsIGxpbmtzIHdpdGggdGhlIHBsdWdpbiB0aGF0IG9wZW4gYSBwb3B1cFxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGluaXRfd2lzaGxpc3RfcG9wdXA6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyBhZGQgJiByZW1vdmUgY2xhc3MgdG8gYm9keSB3aGVuIHBvcHVwIGlzIG9wZW5lZC5cblx0XHR2YXIgY2FsbGJhY2sgICAgICAgPSBmdW5jdGlvbiAobm9kZSwgb3ApIHtcblx0XHRcdGlmICh0eXBlb2Ygbm9kZS5jbGFzc0xpc3QgIT09ICd1bmRlZmluZWQnICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2xmbWMtb3ZlcmxheScgKSkge1xuXHRcdFx0XHR2YXIgbWV0aG9kID0gJ3JlbW92ZScgPT09IG9wID8gJ3JlbW92ZUNsYXNzJyA6ICdhZGRDbGFzcyc7XG5cblx0XHRcdFx0JCggJ2JvZHknIClbbWV0aG9kXSggJ3dsZm1jLXdpdGgtcG9wdXAnICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcdGNhbGxiYWNrQWRkICAgID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdFx0Y2FsbGJhY2soIG5vZGUsICdhZGQnICk7XG5cdFx0XHR9LFxuXHRcdFx0Y2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAobm9kZSkge1xuXHRcdFx0XHRjYWxsYmFjayggbm9kZSwgJ3JlbW92ZScgKTtcblx0XHRcdH0sXG5cdFx0XHRvYnNlcnZlciAgICAgICA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuXHRcdFx0XHRmdW5jdGlvbiAobXV0YXRpb25zTGlzdCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgaW4gbXV0YXRpb25zTGlzdCkge1xuXHRcdFx0XHRcdFx0dmFyIG11dGF0aW9uID0gbXV0YXRpb25zTGlzdFtpXTtcblx0XHRcdFx0XHRcdGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtdXRhdGlvbi5hZGRlZE5vZGVzICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHRtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goIGNhbGxiYWNrQWRkICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtdXRhdGlvbi5yZW1vdmVkTm9kZXMgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHRcdG11dGF0aW9uLnJlbW92ZWROb2Rlcy5mb3JFYWNoKCBjYWxsYmFja1JlbW92ZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShcblx0XHRcdGRvY3VtZW50LmJvZHksXG5cdFx0XHR7XG5cdFx0XHRcdGNoaWxkTGlzdDogdHJ1ZVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEluaXQgY2hlY2tib3ggaGFuZGxpbmdcblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X2NoZWNrYm94X2hhbmRsaW5nOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGNoZWNrYm94ZXMgPSAkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLCAud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZmluZCggJ3Rib2R5IC5wcm9kdWN0LWNoZWNrYm94IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHR2YXIgbGluayAgICAgICA9ICQoICcubXVsdGlwbGUtcHJvZHVjdC1tb3ZlLC5tdWx0aXBsZS1wcm9kdWN0LWNvcHknICk7XG5cdFx0Y2hlY2tib3hlcy5vZmYoICdjaGFuZ2UnICkub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgdCA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRwID0gdC5wYXJlbnQoKTtcblxuXHRcdFx0XHRpZiAoICEgdC5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRcdFx0JCggJ2lucHV0W25hbWU9XCInICsgdC5hdHRyKCAnbmFtZScgKSArICdcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydCcgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0MicgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cC5yZW1vdmVDbGFzcyggJ2NoZWNrZWQnIClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICd1bmNoZWNrZWQnIClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoIHQuaXMoICc6Y2hlY2tlZCcgKSA/ICdjaGVja2VkJyA6ICd1bmNoZWNrZWQnICk7XG5cblx0XHRcdFx0aWYgKCBsaW5rLmxlbmd0aCA+IDAgKSB7XG5cblx0XHRcdFx0XHR2YXIgaXNDaGVja2VkID0gY2hlY2tib3hlcy5pcyggJzpjaGVja2VkJyApO1xuXHRcdFx0XHRcdGlmIChpc0NoZWNrZWQpIHtcblx0XHRcdFx0XHRcdGxpbmsuc2hvdygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsaW5rLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHJvdyAgICAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICd0cicgKTtcblx0XHRcdFx0XHR2YXIgaXRlbUlkICAgICAgICAgPSByb3cuYXR0ciggJ2RhdGEtaXRlbS1pZCcgKTtcblx0XHRcdFx0XHR2YXIgZXhpc3RpbmdJdGVtSWQgPSBsaW5rLmF0dHIoICdkYXRhLWl0ZW0taWQnICk7XG5cdFx0XHRcdFx0aWYgKCAgdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdFx0aWYgKGV4aXN0aW5nSXRlbUlkKSB7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZC5wdXNoKCBpdGVtSWQgKTtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBleGlzdGluZ0l0ZW1JZC5qb2luKCAnLCcgKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gaXRlbUlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoZXhpc3RpbmdJdGVtSWQpIHtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBleGlzdGluZ0l0ZW1JZC5zcGxpdCggJywnICk7XG5cdFx0XHRcdFx0XHRcdHZhciBpbmRleCAgICAgID0gZXhpc3RpbmdJdGVtSWQuaW5kZXhPZiggaXRlbUlkICk7XG5cdFx0XHRcdFx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZC5zcGxpY2UoIGluZGV4LCAxICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBleGlzdGluZ0l0ZW1JZC5qb2luKCAnLCcgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsaW5rLmF0dHIoICdkYXRhLWl0ZW0taWQnLCBleGlzdGluZ0l0ZW1JZCApO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fSxcblxuXHQvKipcblx0ICogSW5pdCBqcyBoYW5kbGluZyBvbiB3aXNobGlzdCB0YWJsZSBpdGVtcyBhZnRlciBhamF4IHVwZGF0ZVxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuaW5pdF9wcmVwYXJlX3F0eV9saW5rcygpO1xuXHRcdHRoaXMuaW5pdF9jaGVja2JveF9oYW5kbGluZygpO1xuXHRcdC8vIHRoaXMuaW5pdF9xdWFudGl0eSgpO1xuXHRcdC8vIHRoaXMuaW5pdF9jb3B5X3dpc2hsaXN0X2xpbmsoKTtcblx0XHQvLyB0aGlzLmluaXRfdG9vbHRpcCgpO1xuXHRcdC8vIHRoaXMuaW5pdF9jb21wb25lbnRzKCk7XG5cdFx0Ly8gdGhpcy5pbml0X2xheW91dCgpO1xuXHRcdHRoaXMuaW5pdF9kcmFnX25fZHJvcCgpO1xuXHRcdC8vIHRoaXMuaW5pdF9wb3B1cF9jaGVja2JveF9oYW5kbGluZygpO1xuXHRcdHRoaXMuaW5pdF9kcm9wZG93bl9saXN0cygpO1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dsZm1jX2luaXRfYWZ0ZXJfYWpheCcgKTtcblx0fSxcblxuXHQvKipcblx0ICogSGFuZGxlIHF1YW50aXR5IGlucHV0IGNoYW5nZSBmb3IgZWFjaCB3aXNobGlzdCBpdGVtXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF9xdWFudGl0eTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBqcXhocixcblx0XHRcdHRpbWVvdXQ7XG5cblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnLndsZm1jLXdpc2hsaXN0LXRhYmxlIC5xdWFudGl0eSA6aW5wdXQsIC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZSAucXVhbnRpdHkgOmlucHV0Jyxcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0cm93ICAgICAgICAgICA9IHQuY2xvc2VzdCggJ1tkYXRhLXJvdy1pZF0nICksXG5cdFx0XHRcdFx0cHJvZHVjdF9pZCAgICA9IHJvdy5kYXRhKCAncm93LWlkJyApLFxuXHRcdFx0XHRcdGNhcnRfaXRlbV9rZXkgPSByb3cuZGF0YSggJ2NhcnQtaXRlbS1rZXknICksXG5cdFx0XHRcdFx0dGFibGUgICAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICksXG5cdFx0XHRcdFx0dG9rZW4gICAgICAgICA9IHRhYmxlLmRhdGEoICd0b2tlbicgKTtcblxuXHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVvdXQgKTtcblxuXHRcdFx0XHQvLyBzZXQgYWRkIHRvIGNhcnQgbGluayB0byBhZGQgc3BlY2lmaWMgcXR5IHRvIGNhcnQuXG5cdFx0XHRcdHJvdy5maW5kKCAnLmFkZF90b19jYXJ0X2J1dHRvbicgKS5hdHRyKCAnZGF0YS1xdWFudGl0eScsIHQudmFsKCkgKTtcblxuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZiAoanF4aHIpIHtcblx0XHRcdFx0XHRcdFx0anF4aHIuYWJvcnQoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0anF4aHIgPSAkLmFqYXgoXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMudXBkYXRlX2l0ZW1fcXVhbnRpdHksXG5cdFx0XHRcdFx0XHRcdFx0XHRub25jZTogdGFibGUuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXJ0X2l0ZW1fa2V5OiBjYXJ0X2l0ZW1fa2V5LFxuXHRcdFx0XHRcdFx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHRva2VuLFxuXHRcdFx0XHRcdFx0XHRcdFx0cXVhbnRpdHk6IHQudmFsKCksXG5cdFx0XHRcdFx0XHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRcdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmJsb2NrKCByb3cgKTtcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnVuYmxvY2soIHJvdyApO1xuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHQvKmlmICh0eXBlb2YgcmVzcG9uc2UuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggcmVzcG9uc2UuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSovXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0MTAwMFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0aW5pdF9wb3B1cHM6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCAnYm9keScgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLXBvcHVwLXRyaWdnZXI6bm90KC53bGZtYy1kaXNhYmxlZCknLFxuXHRcdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBpZCAgICAgICAgICAgID0gJCggdGhpcyApLmRhdGEoICdwb3B1cC1pZCcgKTtcblx0XHRcdFx0dmFyIGVsZW0gICAgICAgICAgPSAkKCAnIycgKyBpZCApO1xuXHRcdFx0XHR2YXIgcG9wdXBfd3JhcHBlciA9ICQoICcjJyArIGlkICsgJ193cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggISBwb3B1cF93cmFwcGVyLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdFx0XHRcdGNvbG9yOiAnIzMzMycsXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uOiAnYWxsIDAuM3MnLFxuXHRcdFx0XHRcdFx0aG9yaXpvbnRhbDogZWxlbS5kYXRhKCAnaG9yaXpvbnRhbCcgKSxcblx0XHRcdFx0XHRcdHZlcnRpY2FsOiBlbGVtLmRhdGEoICd2ZXJ0aWNhbCcgKVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0ZWxlbS5wb3B1cCggZGVmYXVsdE9wdGlvbnMgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKCAnI3dsZm1jLXRvb2x0aXAnIClcblx0XHRcdFx0XHQuY3NzKFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQndG9wJzogJzAnLFxuXHRcdFx0XHRcdFx0XHQnbGVmdCc6ICcwJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoKVxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ3Rvb2x0aXBfX2hpZGRlbicgKTtcblx0XHRcdFx0JCggJyMnICsgaWQgKS5wb3B1cCggJ3Nob3cnICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHRcdCQoICdib2R5JyApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2xmbWMtcG9wdXAtY2xvc2UnLFxuXHRcdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBpZCA9ICQoIHRoaXMgKS5kYXRhKCAncG9wdXAtaWQnICk7XG5cdFx0XHRcdCQoICcjJyArIGlkICkucG9wdXAoICdoaWRlJyApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHR9LFxuXG5cdGluaXRfbGF5b3V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGpxeGhyLFxuXHRcdFx0dGltZW91dDtcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2xmbWMtdG9nZ2xlLWxheW91dCcsXG5cdFx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIGVsZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdGVsZW0udG9nZ2xlQ2xhc3MoICdsaXN0JyApLnRvZ2dsZUNsYXNzKCAnZ3JpZCcgKTtcblx0XHRcdFx0ZWxlbS5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJy53bGZtYy1saXN0JyApLnRvZ2dsZUNsYXNzKCAndmlldy1tb2RlLWxpc3QnICkudG9nZ2xlQ2xhc3MoICd2aWV3LW1vZGUtZ3JpZCcgKTtcblxuXHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVvdXQgKTtcblxuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZiAoanF4aHIpIHtcblx0XHRcdFx0XHRcdFx0anF4aHIuYWJvcnQoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0anF4aHIgPSAkLmFqYXgoXG5cdFx0XHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5jaGFuZ2VfbGF5b3V0LFxuXHRcdFx0XHRcdFx0XHRcdFx0bm9uY2U6IGVsZW0uZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdG5ld19sYXlvdXQ6IGVsZW0uaGFzQ2xhc3MoICdsaXN0JyApID8gJ2dyaWQnIDogJ2xpc3QnLFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBhbnl0aGluZy5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQxMDAwXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfY29tcG9uZW50czogZnVuY3Rpb24gKCkge1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1saXN0IC5wcm9kdWN0LWNvbXBvbmVudHMnLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgJHRoaXMgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgZWxlbSAgICAgICAgID0gJHRoaXMuY2xvc2VzdCggJ3RyJyApO1xuXHRcdFx0XHR2YXIgJG1ldGFEYXRhICAgID0gZWxlbS5maW5kKCAnLndsZm1jLWFic29sdXRlLW1ldGEtZGF0YScgKTtcblx0XHRcdFx0dmFyICRuZXh0ICAgICAgICA9IGVsZW0ubmV4dCggJy53bGZtYy1yb3ctbWV0YS1kYXRhJyApLmZpbHRlciggJy53bGZtYy1yb3ctbWV0YS1kYXRhJyApO1xuXHRcdFx0XHR2YXIgaXNOZXh0SGlkZGVuID0gJG5leHQuaGFzQ2xhc3MoICdoaWRlJyApO1xuXG5cdFx0XHRcdCRtZXRhRGF0YS5mYWRlVG9nZ2xlKCk7XG5cdFx0XHRcdCRuZXh0LnRvZ2dsZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0ZWxlbS50b2dnbGVDbGFzcyggJ3Nob3ctbWV0YS1kYXRhJywgaXNOZXh0SGlkZGVuICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLWxpc3QgLmNsb3NlLWNvbXBvbmVudHMnLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgZWxlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAndHInICk7XG5cdFx0XHRcdGVsZW0uZmluZCggJy53bGZtYy1hYnNvbHV0ZS1tZXRhLWRhdGEnICkuZmFkZVRvZ2dsZSgpO1xuXHRcdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCAnc2hvdy1tZXRhLWRhdGEnICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnLmxpc3QtaXRlbS1jaGVja2JveCcsXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0dmFyIHNlbGVjdGVkSXRlbSAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKTtcblx0XHRcdFx0dmFyIHBhcmVudENvbnRhaW5lciA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lciwgLndsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyLCAud2xmbWMtY29weS10by1saXN0LXdyYXBwZXInICk7XG5cdFx0XHRcdGlmIChwYXJlbnRDb250YWluZXIuaGFzQ2xhc3MoICd3bGZtYy1hZGQtdG8tbGlzdC1jb250YWluZXInICkpIHtcblx0XHRcdFx0XHRpZiAoJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZEl0ZW0ucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBhcmVudENvbnRhaW5lci5oYXNDbGFzcyggJ3dsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyJyApIHx8IHBhcmVudENvbnRhaW5lci5oYXNDbGFzcyggJ3dsZm1jLWNvcHktdG8tbGlzdC13cmFwcGVyJyApKSB7XG5cdFx0XHRcdFx0dmFyIGNoZWNrYm94ZXMgPSBwYXJlbnRDb250YWluZXIuZmluZCggJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHRcdFx0XHRwYXJlbnRDb250YWluZXIuZmluZCggJy5saXN0LWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdFx0XHRpZiAoJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdFx0XHRcdFx0Y2hlY2tib3hlcy5ub3QoICQoIHRoaXMgKSApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfZHJvcGRvd25fbGlzdHM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZHJvcGRvd25FbGVtZW50ID0gJCggJyN3bGZtY19teV9saXN0cycgKTtcblx0XHRpZiAoICEgZHJvcGRvd25FbGVtZW50IHx8IGRyb3Bkb3duRWxlbWVudC5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKGRyb3Bkb3duRWxlbWVudC5kYXRhKCAnZWRpdGFibGUtc2VsZWN0JyApKSB7XG5cdFx0XHRkcm9wZG93bkVsZW1lbnQud2xmbWNEcm9wRG93biggJ2Rlc3Ryb3knICk7XG5cdFx0fVxuXHRcdGRyb3Bkb3duRWxlbWVudFxuXHRcdFx0Lm9uKFxuXHRcdFx0XHQnc2VsZWN0LmVkaXRhYmxlLXNlbGVjdCcsXG5cdFx0XHRcdGZ1bmN0aW9uIChlLCBsaSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgKGxpKSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1kcm9wZG93bi13cmFwcGVyJyApLmFkZENsYXNzKCAnd2xmbWMtYWN0aW9uIHdsZm1jLWxvYWRpbmctYWx0IHdsZm1jLWludmVyc2UnICk7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkudmFsKCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1kcm9wZG93bi13cmFwcGVyJyApLmZpbmQoICcubGlzdC1pdGVtW2RhdGEtd2lzaGxpc3QtaWQ9XCInICsgbGkudmFsKCkgKyAnXCJdIC5saXN0LW5hbWUnICkudGV4dCgpICk7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLWRyb3Bkb3duLXdyYXBwZXInICkuZmluZCggJy5saXN0LWl0ZW1bZGF0YS13aXNobGlzdC1pZD1cIicgKyBsaS52YWwoKSArICdcIl0nICkuZGF0YSggJ3VybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdClcblx0XHRcdC53bGZtY0Ryb3BEb3duKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZWZmZWN0czogJ3NsaWRlJyxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbml0IGhhbmRsaW5nIGZvciBjb3B5IGJ1dHRvblxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGluaXRfY29weV93aXNobGlzdF9saW5rOiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLmNvcHktbGluay10cmlnZ2VyJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIG9ial90b19jb3B5ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdHZhciBoaWRkZW4gPSAkKFxuXHRcdFx0XHRcdCc8aW5wdXQvPicsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFsOiBvYmpfdG9fY29weS5hdHRyKCAnZGF0YS1ocmVmJyApLFxuXHRcdFx0XHRcdFx0dHlwZTogJ3RleHQnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdCQoICdib2R5JyApLmFwcGVuZCggaGlkZGVuICk7XG5cblx0XHRcdFx0aWYgKCQuZm4uV0xGTUMuaXNPUygpKSB7XG5cdFx0XHRcdFx0aGlkZGVuWzBdLnNldFNlbGVjdGlvblJhbmdlKCAwLCA5OTk5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aGlkZGVuLnNlbGVjdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcblxuXHRcdFx0XHRoaWRkZW4ucmVtb3ZlKCk7XG5cblx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHdsZm1jX2wxMG4ubGFiZWxzLmxpbmtfY29waWVkICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGZyYWdtZW50cyB0aGF0IG5lZWQgdG8gYmUgcmVmcmVzaGVkIGluIHRoZSBwYWdlXG5cdCAqXG5cdCAqIEBwYXJhbSBzZWFyY2ggc3RyaW5nIFJlZiB0byBzZWFyY2ggYW1vbmcgYWxsIGZyYWdtZW50cyBpbiB0aGUgcGFnZVxuXHQgKiBAcmV0dXJuIG9iamVjdCBPYmplY3QgY29udGFpbmluZyBhIHByb3BlcnR5IGZvciBlYWNoIGZyYWdtZW50IHRoYXQgbWF0Y2hlcyBzZWFyY2hcblx0ICovXG5cdHJldHJpZXZlX2ZyYWdtZW50czogZnVuY3Rpb24gKHNlYXJjaCkge1xuXHRcdHZhciBvcHRpb25zICAgPSB7fSxcblx0XHRcdGZyYWdtZW50cyA9IG51bGw7XG5cblx0XHRpZiAoc2VhcmNoKSB7XG5cdFx0XHRpZiAodHlwZW9mIHNlYXJjaCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0c2VhcmNoID0gJC5leHRlbmQoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZnJhZ21lbnRzOiBudWxsLFxuXHRcdFx0XHRcdFx0czogJycsXG5cdFx0XHRcdFx0XHRjb250YWluZXI6ICQoIGRvY3VtZW50ICksXG5cdFx0XHRcdFx0XHRmaXJzdExvYWQ6IGZhbHNlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZWFyY2hcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoICEgc2VhcmNoLmZyYWdtZW50cykge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IHNlYXJjaC5jb250YWluZXIuZmluZCggJy53bGZtYy13aXNobGlzdC1mcmFnbWVudCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBzZWFyY2guZnJhZ21lbnRzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNlYXJjaC5zKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gZnJhZ21lbnRzLm5vdCggJ1tkYXRhLWZyYWdtZW50LXJlZl0nICkuYWRkKCBmcmFnbWVudHMuZmlsdGVyKCAnW2RhdGEtZnJhZ21lbnQtcmVmPVwiJyArIHNlYXJjaC5zICsgJ1wiXScgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNlYXJjaC5maXJzdExvYWQpIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBmcmFnbWVudHMuZmlsdGVyKCAnLm9uLWZpcnN0LWxvYWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZyYWdtZW50cyA9ICQoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzZWFyY2ggPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gZnJhZ21lbnRzLm5vdCggJ1tkYXRhLWZyYWdtZW50LXJlZl0nICkuYWRkKCBmcmFnbWVudHMuZmlsdGVyKCAnW2RhdGEtZnJhZ21lbnQtcmVmPVwiJyArIHNlYXJjaCArICdcIl0nICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmcmFnbWVudHMgPSAkKCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApO1xuXHRcdH1cblxuXHRcdGlmIChmcmFnbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRmcmFnbWVudHMuZWFjaChcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciB0ICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRcdGlkID0gdC5hdHRyKCAnY2xhc3MnICkuc3BsaXQoICcgJyApLmZpbHRlcihcblx0XHRcdFx0XHRcdFx0KHZhbCkgPT4ge3JldHVybiB2YWwubGVuZ3RoICYmIHZhbCAhPT0gJ2V4aXN0cyc7fVxuXHRcdFx0XHRcdFx0KS5qb2luKCB3bGZtY19sMTBuLmZyYWdtZW50c19pbmRleF9nbHVlICk7XG5cblx0XHRcdFx0XHRvcHRpb25zW2lkXSA9IHQuZGF0YSggJ2ZyYWdtZW50LW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBvcHRpb25zO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkIGZyYWdtZW50cyBvbiBwYWdlIGxvYWRpbmdcblx0ICpcblx0ICogQHBhcmFtIHNlYXJjaCBzdHJpbmcgUmVmIHRvIHNlYXJjaCBhbW9uZyBhbGwgZnJhZ21lbnRzIGluIHRoZSBwYWdlXG5cdCAqIEBwYXJhbSBzdWNjZXNzIGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBzdWNjZXNzQXJncyBhcnJheVxuXHQgKi9cblx0bG9hZF9mcmFnbWVudHM6IGZ1bmN0aW9uIChzZWFyY2gsIHN1Y2Nlc3MsIHN1Y2Nlc3NBcmdzKSB7XG5cblx0XHRjbGVhclRpbWVvdXQoIGZyYWdtZW50dGltZW91dCApO1xuXG5cdFx0ZnJhZ21lbnR0aW1lb3V0ID0gc2V0VGltZW91dChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCBmcmFnbWVudHhociApIHtcblx0XHRcdFx0XHRmcmFnbWVudHhoci5hYm9ydCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlYXJjaCA9ICQuZXh0ZW5kKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZpcnN0TG9hZDogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2VhcmNoXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0dmFyIGZyYWdtZW50cyA9ICQuZm4uV0xGTUMucmV0cmlldmVfZnJhZ21lbnRzKCBzZWFyY2ggKTtcblx0XHRcdFx0Ly8gY3JlYXRlIGEgbmV3IEZvcm1EYXRhIG9iamVjdC5cblx0XHRcdFx0dmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCggJ2FjdGlvbicsIHdsZm1jX2wxMG4uYWN0aW9ucy5sb2FkX2ZyYWdtZW50cyApO1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICdjb250ZXh0JywgJ2Zyb250ZW5kJyApO1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICdub25jZScsIHdsZm1jX2wxMG4uYWpheF9ub25jZS5sb2FkX2ZyYWdtZW50cyApO1xuXHRcdFx0XHRpZiAoIGZyYWdtZW50cykge1xuXHRcdFx0XHRcdC8vIGNvbnZlcnQgb2JqZWN0IHRvIEpTT04gc3RyaW5nLlxuXHRcdFx0XHRcdHZhciBmcmFnbWVudEpzb24gPSBKU09OLnN0cmluZ2lmeSggZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0Ly8gY3JlYXRlIGEgZmlsZSBmcm9tIEpTT04gc3RyaW5nLlxuXHRcdFx0XHRcdHZhciBmaWxlID0gbmV3IEZpbGUoIFtmcmFnbWVudEpzb25dLCAnZnJhZ21lbnQuanNvbicgKTtcblx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICdmcmFnbWVudHNfZmlsZScsIGZpbGUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZyYWdtZW50eGhyID0gJC5hamF4KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hZG1pbl91cmwsIC8vIGFqYXhfdXJsLFxuXHRcdFx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdFx0XHQvKmJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCovXG5cdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGRhdGEuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3VjY2Vzcy5hcHBseSggbnVsbCwgc3VjY2Vzc0FyZ3MgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyAkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19mcmFnbWVudHNfbG9hZGVkJywgW2ZyYWdtZW50cywgZGF0YS5mcmFnbWVudHMsIHNlYXJjaC5maXJzdExvYWRdICk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdCQoICcjd2xmbWMtbGlzdHMsI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkuYWRkQ2xhc3MoICdvbi1maXJzdC1sb2FkJyApO1xuXG5cdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGRhdGEucHJvZHVjdHMgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBkYXRhLnByb2R1Y3RzICkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBkYXRhLndhaXRsaXN0ICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggZGF0YS53YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgZGF0YS5sYW5nICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9sYW5nX2hhc2goIGRhdGEubGFuZyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdDEwMFxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlcGxhY2UgZnJhZ21lbnRzIHdpdGggdGVtcGxhdGUgcmVjZWl2ZWRcblx0ICpcblx0ICogQHBhcmFtIGZyYWdtZW50cyBhcnJheSBBcnJheSBvZiBmcmFnbWVudHMgdG8gcmVwbGFjZVxuXHQgKi9cblx0cmVwbGFjZV9mcmFnbWVudHM6IGZ1bmN0aW9uIChmcmFnbWVudHMpIHtcblx0XHQkLmVhY2goXG5cdFx0XHRmcmFnbWVudHMsXG5cdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHR2YXIgaXRlbVNlbGVjdG9yID0gJy4nICsgaS5zcGxpdCggd2xmbWNfbDEwbi5mcmFnbWVudHNfaW5kZXhfZ2x1ZSApLmZpbHRlcihcblx0XHRcdFx0XHQodmFsKSA9PiB7cmV0dXJuIHZhbC5sZW5ndGggJiYgdmFsICE9PSAnZXhpc3RzJyAmJiB2YWwgIT09ICd3aXRoLWNvdW50Jzt9XG5cdFx0XHRcdCkuam9pbiggJy4nICksXG5cdFx0XHRcdFx0dG9SZXBsYWNlICAgID0gJCggaXRlbVNlbGVjdG9yICk7XG5cdFx0XHRcdC8vIGZpbmQgcmVwbGFjZSB0ZW1wbGF0ZS5cblx0XHRcdFx0dmFyIHJlcGxhY2VXaXRoID0gJCggdiApLmZpbHRlciggaXRlbVNlbGVjdG9yICk7XG5cblx0XHRcdFx0aWYgKCAhIHJlcGxhY2VXaXRoLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJlcGxhY2VXaXRoID0gJCggdiApLmZpbmQoIGl0ZW1TZWxlY3RvciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRvUmVwbGFjZS5sZW5ndGggJiYgcmVwbGFjZVdpdGgubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dG9SZXBsYWNlLnJlcGxhY2VXaXRoKCByZXBsYWNlV2l0aCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHQvKiA9PT0gRVZFTlQgSEFORExJTkcgPT09ICovXG5cblx0bG9hZF9hdXRvbWF0aW9uczogZnVuY3Rpb24gKHByb2R1Y3RfaWQsIHdpc2hsaXN0X2lkLCBjdXN0b21lcl9pZCwgbGlzdF90eXBlLCBub25jZSkge1xuXHRcdCQuYWpheChcblx0XHRcdHtcblxuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5sb2FkX2F1dG9tYXRpb25zLFxuXHRcdFx0XHRcdG5vbmNlOiBub25jZSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHBhcnNlSW50KCBwcm9kdWN0X2lkICksXG5cdFx0XHRcdFx0d2lzaGxpc3RfaWQ6IHBhcnNlSW50KCB3aXNobGlzdF9pZCApLFxuXHRcdFx0XHRcdGN1c3RvbWVyX2lkOiBwYXJzZUludCggY3VzdG9tZXJfaWQgKSxcblx0XHRcdFx0XHRsaXN0X3R5cGU6IGxpc3RfdHlwZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gYW55dGhpbmcuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGFkZF90b19zYXZlX2Zvcl9sYXRlcjogZnVuY3Rpb24gKCBjYXJ0X2l0ZW1fa2V5ICwgZWxlbSApIHtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmFkZF90b19zYXZlX2Zvcl9sYXRlcl9hY3Rpb24sXG5cdFx0XHRub25jZTogd2xmbWNfbDEwbi5hamF4X25vbmNlLmFkZF90b19zYXZlX2Zvcl9sYXRlcl9ub25jZSxcblx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRhZGRfdG9fc2F2ZV9mb3JfbGF0ZXI6IGNhcnRfaXRlbV9rZXksXG5cdFx0XHRtZXJnZV9zYXZlX2Zvcl9sYXRlcjogd2xmbWNfbDEwbi5tZXJnZV9zYXZlX2Zvcl9sYXRlcixcblx0XHRcdHJlbW92ZV9mcm9tX2NhcnRfaXRlbTogd2xmbWNfbDEwbi5yZW1vdmVfZnJvbV9jYXJ0X2l0ZW0sXG5cdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKClcblx0XHR9O1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSApIHtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uc2F2ZV9mb3JfbGF0ZXJfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0Ly9kYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIGJlZm9yZVNlbmQoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggZWxlbSAmJiBlbGVtLmxlbmd0aCApIHtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0gJiYgZWxlbS5sZW5ndGggKSB7XG5cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAoICd0cnVlJyA9PT0gcmVzcG9uc2VfcmVzdWx0ICkge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdFx0LyppZiAodHlwZW9mIHJlc3BvbnNlLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIHJlc3BvbnNlLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHRcdGlmIChzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHdsZm1jX2wxMG4ubGFiZWxzLnNmbF9wcm9kdWN0X2FkZGVkX3RleHQgKSkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcyggd2xmbWNfbDEwbi5sYWJlbHMuc2ZsX3Byb2R1Y3RfYWRkZWRfdGV4dCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFyIGF1dG9tYXRpb25fbGlzdF90eXBlID0gd2xmbWNfbDEwbi5tZXJnZV9zYXZlX2Zvcl9sYXRlciA/ICggd2xmbWNfbDEwbi5tZXJnZV9saXN0cyA/ICdsaXN0cycgOiAnd2lzaGxpc3QnICkgOiAnc2F2ZS1mb3ItbGF0ZXInO1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCByZXNwb25zZS5wcm9kdWN0X2lkLCByZXNwb25zZS53aXNobGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsIGF1dG9tYXRpb25fbGlzdF90eXBlLCByZXNwb25zZS5sb2FkX2F1dG9tYXRpb25fbm9uY2UgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCByZXNwb25zZS5jb3VudCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmF0dHIoICdkYXRhLWNvdW50JywgcmVzcG9uc2UuY291bnQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnd2NfdXBkYXRlX2NhcnQnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0Y2hlY2tfd2FpdGxpc3RfbW9kdWxlczogZnVuY3Rpb24gKCBkYXRhLCBwcm9kdWN0X2lkLCB2YXJpYXRpb25faWQgKSB7XG5cdFx0aWYgKCAhIHByb2R1Y3RfaWQgfHwgISB2YXJpYXRpb25faWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHZhciBwcm9kdWN0X3R5cGUgPSAndmFyaWF0aW9uJztcblx0XHRpZiAoICEgZGF0YSApIHtcblx0XHRcdHZhcmlhdGlvbl9pZCA9IHByb2R1Y3RfaWQ7XG5cdFx0XHRwcm9kdWN0X3R5cGUgPSAndmFyaWFibGUnO1xuXHRcdH1cblx0XHRsZXQgdGFyZ2V0cyAgICAgID0gJCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QgW2RhdGEtcGFyZW50LXByb2R1Y3QtaWQ9XCInICsgcHJvZHVjdF9pZCArICdcIl0nICksXG5cdFx0XHR0YXJnZXRfYm94ZXMgPSAkKCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrIFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApO1xuXG5cdFx0dGFyZ2V0X2JveGVzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGxldCB0ICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0Y29udGFpbmVyID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrJyApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblx0XHRcdFx0Y29udGFpbmVyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKGksIGNsYXNzZXMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWF0Y2goIC93bGZtYy1hZGQtdG8tb3V0b2ZzdG9jay1cXFMrL2cgKS5qb2luKCAnICcgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0LmFkZENsYXNzKCAnd2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHZhcmlhdGlvbl9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXG5cdFx0XHRcdGxldCBvdXRvZnN0b2NrYm94ID0gJCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jay0nICsgdmFyaWF0aW9uX2lkICk7XG5cblx0XHRcdFx0aWYgKG91dG9mc3RvY2tib3gubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0b3V0b2ZzdG9ja2JveCA9ICQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIG51bGwgIT09IGRhdGEgKSB7XG5cdFx0XHRcdFx0aWYgKGRhdGEud2xmbWNfaGlkZV9iYWNrX2luX3N0b2NrIHx8ICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLmV4Y2x1ZGVfYmFja19pbl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0b3V0b2ZzdG9ja2JveC5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG91dG9mc3RvY2tib3gucmVtb3ZlQ2xhc3MoICdoaWRlJyApOyAvLyBzaG93IG91dG9mc3RvY2sgYm94LlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsZXQgb3V0X29mX3N0b2NrID0gb3V0b2ZzdG9ja2JveC5kYXRhKCAncHJvZHVjdC1vdXRvZnN0b2NrJyApO1xuXHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIG91dF9vZl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0b3V0b2ZzdG9ja2JveC5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG91dG9mc3RvY2tib3guYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHYgIT09ICd1bmRlZmluZWQnICYmIHYucHJvZHVjdF9pZCAmJiB2LnByb2R1Y3RfaWQgPT09IHZhcmlhdGlvbl9pZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgb3V0b2ZzdG9ja2JveCA9ICQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHYucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdFx0XHRvdXRvZnN0b2NrYm94LnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHRvdXRvZnN0b2NrYm94LmVhY2goXG5cdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5iYWNrX2luX3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoIHRoaXMgKS5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdG91dG9mc3RvY2tib3guZmluZCggJy53bGZtYy1hZGQtYnV0dG9uID4gYScgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICkuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJywgcHJvZHVjdF90eXBlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHRhcmdldHMuZWFjaChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgICAgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGNvbnRhaW5lciAgICAgICAgICAgID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13YWl0bGlzdCcgKSxcblx0XHRcdFx0XHRwb3B1cCAgICAgICAgICAgICAgICA9ICQoICcjJyArIHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QnICkuZGF0YSggJ3BvcHVwLWlkJyApICksXG5cdFx0XHRcdFx0YmFja2luc3RvY2tfY2hlY2tib3ggPSBwb3B1cC5sZW5ndGggPyBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKSA6IGZhbHNlICxcblx0XHRcdFx0XHRwcmljZWNoYW5nZV9jaGVja2JveCA9IHBvcHVwLmxlbmd0aCA/IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcmljZS1jaGFuZ2VcIl0nICkgOiBmYWxzZSAsXG5cdFx0XHRcdFx0bG93c3RvY2tfY2hlY2tib3ggICAgPSBwb3B1cC5sZW5ndGggPyBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbG93LXN0b2NrXCJdJyApIDogZmFsc2UgLFxuXHRcdFx0XHRcdG9uc2FsZV9jaGVja2JveCAgICAgID0gcG9wdXAubGVuZ3RoID8gcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X29uLXNhbGVcIl0nICkgOiBmYWxzZSxcblx0XHRcdFx0XHRhdmFpbGFibGVfbW9kdWxlcyAgICA9IGNvbnRhaW5lci5kYXRhKCAnYXZhaWxhYmxlLWxpc3RzJyApO1xuXG5cdFx0XHRcdGNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ29wYWNpdHktaGFsZicgKTtcblx0XHRcdFx0aWYgKCBkYXRhICkge1xuXHRcdFx0XHRcdGlmICggZGF0YS5pc19pbl9zdG9jayApIHtcblx0XHRcdFx0XHRcdGlmICggbG93c3RvY2tfY2hlY2tib3gubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBkYXRhLmVuYWJsZV9sb3dfc3RvY2sgJiYgJC5mbi5XTEZNQy5pc1RydWUoIGRhdGEuZW5hYmxlX2xvd19zdG9jayApICYmICEgJC5mbi5XTEZNQy5pc1RydWUoIGRhdGEuZXhjbHVkZV9sb3dfc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRsb3dzdG9ja19jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bG93c3RvY2tfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIHByaWNlY2hhbmdlX2NoZWNrYm94Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGRhdGEuZXhjbHVkZV9wcmljZV9jaGFuZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwcmljZWNoYW5nZV9jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cHJpY2VjaGFuZ2VfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIGJhY2tpbnN0b2NrX2NoZWNrYm94Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggZGF0YS53bGZtY19oaWRlX2JhY2tfaW5fc3RvY2sgKSB7XG5cdFx0XHRcdFx0XHRcdFx0YmFja2luc3RvY2tfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGJhY2tpbnN0b2NrX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIG9uc2FsZV9jaGVja2JveC5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGRhdGEuZGlzcGxheV9wcmljZSAhPT0gZGF0YS5kaXNwbGF5X3JlZ3VsYXJfcHJpY2UgfHwgJC5mbi5XTEZNQy5pc1RydWUoIGRhdGEuZXhjbHVkZV9vbl9zYWxlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0b25zYWxlX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRvbnNhbGVfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIGhpZGUgYWRkIHRvIHdhaXRsaXN0IGJ1dHRvbnMgaWYgbm90IGFjdGl2ZSBtb2R1bGVzIGluIHBvcHVwLlxuXHRcdFx0XHRcdFx0aWYgKCAhIHBvcHVwLmZpbmQoICcud2xmbWMtd2FpdGxpc3Qtc2VsZWN0LXR5cGUgLmxpc3QtaXRlbTpub3QoLmhpZGUpJyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCAnb3BhY2l0eS1oYWxmJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBhdmFpbGFibGVfbW9kdWxlcyA9PT0gXCJvYmplY3RcIiAmJiAnYmFjay1pbi1zdG9jaycgaW4gYXZhaWxhYmxlX21vZHVsZXMgJiYgISAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5leGNsdWRlX2JhY2tfaW5fc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdGlmICggYmFja2luc3RvY2tfY2hlY2tib3gubGVuZ3RoID4gMCAgKSB7XG5cdFx0XHRcdFx0XHRcdGJhY2tpbnN0b2NrX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggcHJpY2VjaGFuZ2VfY2hlY2tib3gubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0cHJpY2VjaGFuZ2VfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBsb3dzdG9ja19jaGVja2JveC5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRsb3dzdG9ja19jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIG9uc2FsZV9jaGVja2JveC5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRvbnNhbGVfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoICdvcGFjaXR5LWhhbGYnICk7IC8vIGhpZGUgYWRkIHRvIHdhaXRsaXN0IGJ1dHRvbnMuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHZhcmlhdGlvbl9pZCApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcmljZS1jaGFuZ2VcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3Rfb24tc2FsZVwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9sb3ctc3RvY2tcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdGNvbnRhaW5lclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIChpLCBjbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hdGNoKCAvd2xmbWMtYWRkLXRvLXdhaXRsaXN0LVxcUysvZyApLmpvaW4oICcgJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoICd3bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArIHZhcmlhdGlvbl9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdCxcblx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJyAmJiB2LnByb2R1Y3RfaWQgJiYgdi5wcm9kdWN0X2lkID09IHZhcmlhdGlvbl9pZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB2LnByaWNlX2NoYW5nZSApIHx8ICQuZm4uV0xGTUMuaXNUcnVlKCB2Lm9uX3NhbGUgKSB8fCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5sb3dfc3RvY2sgKSB8fCAoICQuZm4uV0xGTUMuaXNUcnVlKCB2LmJhY2tfaW5fc3RvY2sgKSAmJiBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5sZW5ndGggPiAwICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHYuYmFja19pbl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9iYWNrLWluLXN0b2NrXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHYucHJpY2VfY2hhbmdlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X3ByaWNlLWNoYW5nZVwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB2Lm9uX3NhbGUgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3Rfb24tc2FsZVwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB2Lmxvd19zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9sb3ctc3RvY2tcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2FkZF90b193YWl0bGlzdCcgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICkuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJywgcHJvZHVjdF90eXBlICk7XG5cdFx0XHRcdGlmICggJ3ZhcmlhYmxlJyA9PT0gcHJvZHVjdF90eXBlICYmICQuZm4uV0xGTUMuaXNUcnVlKCB3bGZtY19sMTBuLndhaXRsaXN0X3JlcXVpcmVkX3Byb2R1Y3RfdmFyaWF0aW9uICkgKSB7XG5cdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcicgKS5hZGRDbGFzcyggJ3dsZm1jLWRpc2FibGVkJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLXBvcHVwLXRyaWdnZXInICkucmVtb3ZlQ2xhc3MoICd3bGZtYy1kaXNhYmxlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0Y2hlY2tfcHJvZHVjdHM6IGZ1bmN0aW9uIChwcm9kdWN0cykge1xuXHRcdGlmICggbnVsbCAhPT0gcHJvZHVjdHMgKSB7XG5cdFx0XHRwcm9kdWN0X2luX2xpc3QgICA9IFtdO1xuXHRcdFx0dmFyIGNvdW50ZXJfaXRlbXMgPSAkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAud2xmbWMtY291bnRlci1pdGVtJyApO1xuXHRcdFx0aWYgKCBjb3VudGVyX2l0ZW1zLmxlbmd0aCAmJiBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICkge1xuXHRcdFx0XHRjb3VudGVyX2l0ZW1zLmVhY2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dmFyIHBfaWQgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtcm93LWlkJyApO1xuXHRcdFx0XHRcdFx0aWYgKCAhICQuZ3JlcChcblx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoIGl0ZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0ucHJvZHVjdF9pZCA9PT0gcF9pZDsgfVxuXHRcdFx0XHRcdFx0KS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgcF9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRhYmxlX2l0ZW1zXHQ9ICQoICcud2xmbWMtd2lzaGxpc3QtZm9ybSAud2xmbWMtdGFibGUtaXRlbScgKTtcblx0XHRcdGlmICggdGFibGVfaXRlbXMubGVuZ3RoICYmIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggKSB7XG5cdFx0XHRcdHRhYmxlX2l0ZW1zLmVhY2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dmFyIHBfaWQgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtcm93LWlkJyApO1xuXHRcdFx0XHRcdFx0aWYgKCAhICQuZ3JlcChcblx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoIGl0ZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0ucHJvZHVjdF9pZCA9PT0gcF9pZDsgfVxuXHRcdFx0XHRcdFx0KS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIHBfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXG5cdFx0XHQkLmVhY2goXG5cdFx0XHRcdHByb2R1Y3RzLFxuXHRcdFx0XHRmdW5jdGlvbiAoIGlkLCBpdGVtRGF0YSApIHtcblx0XHRcdFx0XHR2YXIgc2FtZV9wcm9kdWN0cyA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBpdGVtRGF0YS5wcm9kdWN0X2lkICk7XG5cdFx0XHRcdFx0c2FtZV9wcm9kdWN0cy5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdCQoIHRoaXMgKS5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLWl0ZW0taWQnLCBpdGVtRGF0YS5pdGVtX2lkICk7XG5cdFx0XHRcdFx0XHRcdCQoIHRoaXMgKS5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJywgaXRlbURhdGEud2lzaGxpc3RfaWQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyICAucHJvZHVjdHMtY291bnRlci1udW1iZXInICkudGV4dCggaXRlbURhdGEubGVuZ3RoICk7XG5cdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdpc2hsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggaXRlbURhdGEubGVuZ3RoICk7XG5cblx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QucHVzaCggaXRlbURhdGEgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblxuXHRjaGVja193YWl0bGlzdF9wcm9kdWN0czogZnVuY3Rpb24gKHByb2R1Y3RzKSB7XG5cdFx0aWYgKCBudWxsICE9PSBwcm9kdWN0cyApIHtcblx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3QgPSBbXTtcblx0XHRcdHZhciBjb3VudGVyX2l0ZW1zICAgPSAkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAud2xmbWMtY291bnRlci1pdGVtJyApO1xuXHRcdFx0aWYgKCBjb3VudGVyX2l0ZW1zLmxlbmd0aCAmJiBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aCApIHtcblx0XHRcdFx0Y291bnRlcl9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3QsXG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uICggaXRlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS5wcm9kdWN0X2lkID09PSBwX2lkOyB9XG5cdFx0XHRcdFx0XHQpLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBwX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdGFibGVfaXRlbXNcdD0gJCggJy53bGZtYy13YWl0bGlzdC10YWJsZSAud2xmbWMtdGFibGUtaXRlbScgKTtcblx0XHRcdGlmICggdGFibGVfaXRlbXMubGVuZ3RoICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICkge1xuXHRcdFx0XHR0YWJsZV9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3QsXG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uICggaXRlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS5wcm9kdWN0X2lkID09PSBwX2lkOyB9XG5cdFx0XHRcdFx0XHQpLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC10YWJsZScgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIHBfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdCQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2snICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHQkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdCcgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdCQuZWFjaChcblx0XHRcdFx0cHJvZHVjdHMsXG5cdFx0XHRcdGZ1bmN0aW9uICggaWQsIGl0ZW1EYXRhICkge1xuXHRcdFx0XHRcdHZhciBzYW1lX3Byb2R1Y3RzID0gJCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArIGl0ZW1EYXRhLnByb2R1Y3RfaWQgKTtcblx0XHRcdFx0XHRzYW1lX3Byb2R1Y3RzLmVhY2goXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBwb3B1cCA9ICQoICcjJyArICQoIHRoaXMgKS5kYXRhKCAncG9wdXAtaWQnICkgKTtcblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEucHJpY2VfY2hhbmdlICkgfHwgJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLm9uX3NhbGUgKSB8fCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEubG93X3N0b2NrICkgfHwgKCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEuYmFja19pbl9zdG9jayApICYmIHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9iYWNrLWluLXN0b2NrXCJdJyApLmxlbmd0aCA+IDAgKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEuYmFja19pbl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9iYWNrLWluLXN0b2NrXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9iYWNrLWluLXN0b2NrXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLnByaWNlX2NoYW5nZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcmljZS1jaGFuZ2VcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X3ByaWNlLWNoYW5nZVwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBpdGVtRGF0YS5vbl9zYWxlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X29uLXNhbGVcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X29uLXNhbGVcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEubG93X3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2xvdy1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbG93LXN0b2NrXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0dmFyIG91dG9mc3RvY2tib3ggPSAkKCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrLScgKyBpdGVtRGF0YS5wcm9kdWN0X2lkICk7XG5cdFx0XHRcdFx0b3V0b2ZzdG9ja2JveC5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBpdGVtRGF0YS5iYWNrX2luX3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13YWl0bGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdC5wdXNoKCBpdGVtRGF0YSApO1xuXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9LFxuXHQvKiogU2V0IHRoZSB3aXNobGlzdCBoYXNoIGluIGJvdGggc2Vzc2lvbiBhbmQgbG9jYWwgc3RvcmFnZSAqL1xuXHRzZXRfcHJvZHVjdHNfaGFzaDogZnVuY3Rpb24gKCAgcHJvZHVjdHMgKSB7XG5cdFx0aWYgKCAkc3VwcG9ydHNfaHRtbDVfc3RvcmFnZSApIHtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSwgcHJvZHVjdHMgKTtcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICwgcHJvZHVjdHMgKTtcblx0XHR9XG5cdFx0JC5mbi5XTEZNQy5jaGVja19wcm9kdWN0cyggSlNPTi5wYXJzZSggcHJvZHVjdHMgKSApO1xuXHR9LFxuXG5cdC8qKiBTZXQgdGhlIHdhaXRsaXN0IGhhc2ggaW4gYm90aCBzZXNzaW9uIGFuZCBsb2NhbCBzdG9yYWdlICovXG5cdHNldF93YWl0bGlzdF9oYXNoOiBmdW5jdGlvbiAoICBwcm9kdWN0cyApIHtcblx0XHRpZiAoICRzdXBwb3J0c19odG1sNV9zdG9yYWdlICkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5LCBwcm9kdWN0cyApO1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgLCBwcm9kdWN0cyApO1xuXG5cdFx0fVxuXHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfcHJvZHVjdHMoIEpTT04ucGFyc2UoIHByb2R1Y3RzICkgKTtcblx0fSxcblxuXHRzZXRfbGFuZ19oYXNoOiBmdW5jdGlvbiAoICBsYW5nICkge1xuXHRcdGlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSwgbGFuZyApO1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSAsIGxhbmcgKTtcblx0XHR9XG5cdH0sXG5cblx0dmFsaWRhdGVFbWFpbDogZnVuY3Rpb24gKGVtYWlsKSB7XG5cdFx0dmFyIHJlID1cblx0XHRcdC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvO1xuXHRcdHJldHVybiByZS50ZXN0KCBTdHJpbmcoIGVtYWlsICkudG9Mb3dlckNhc2UoKSApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBwYXNzZWQgdmFsdWUgY291bGQgYmUgY29uc2lkZXJlZCB0cnVlXG5cdCAqL1xuXHRpc1RydWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHJldHVybiB0cnVlID09PSB2YWx1ZSB8fCAneWVzJyA9PT0gdmFsdWUgfHwgJzEnID09PSB2YWx1ZSB8fCAxID09PSB2YWx1ZSB8fCAndHJ1ZScgPT09IHZhbHVlO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBkZXZpY2UgaXMgYW4gSU9TIGRldmljZVxuXHQgKi9cblx0aXNPUzogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKCAvaXBhZHxpcGhvbmUvaSApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBBZGQgbG9hZGluZyB0byBlbGVtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRsb2FkaW5nOiBmdW5jdGlvbiAoIGl0ZW0gKSB7XG5cdFx0aWYgKCBpdGVtLmZpbmQoICdpJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRpdGVtLmFkZENsYXNzKCAnd2xmbWMtYWN0aW9uIHdsZm1jLWxvYWRpbmcnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoICd3bGZtYy1hY3Rpb24gd2xmbWMtbG9hZGluZy1hbHQnICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZW1vdmUgbG9hZGluZyB0byBlbGVtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHR1bmxvYWRpbmc6IGZ1bmN0aW9uICggaXRlbSApIHtcblx0XHRpdGVtLnJlbW92ZUNsYXNzKCAnd2xmbWMtbG9hZGluZyB3bGZtYy1sb2FkaW5nLWFsdCcgKTtcblx0fSxcblxuXHQvKipcblx0ICogQmxvY2sgaXRlbSBpZiBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbSBqUXVlcnkgb2JqZWN0XG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0YmxvY2s6IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0aWYgKHR5cGVvZiAkLmZuLmJsb2NrICE9PSAndW5kZWZpbmVkJyAmJiB3bGZtY19sMTBuLmVuYWJsZV9hamF4X2xvYWRpbmcpIHtcblx0XHRcdGl0ZW0uZmFkZVRvKCAnNDAwJywgJzAuNicgKS5ibG9jayhcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0XHRcdFx0b3ZlcmxheUNTUzoge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZCAgICA6ICd0cmFuc3BhcmVudCB1cmwoJyArIHdsZm1jX2wxMG4uYWpheF9sb2FkZXJfdXJsICsgJykgbm8tcmVwZWF0IGNlbnRlcicsXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZTogJzQwcHggNDBweCcsXG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblxuXHR0YWJsZV9ibG9jazogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgJC5mbi5ibG9jayAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLXdyYXBwZXIsIC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZS13cmFwcGVyJyApLmZhZGVUbyggJzQwMCcsICcwLjYnICkuYmxvY2soXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtZXNzYWdlOiBudWxsLFxuXHRcdFx0XHRcdG92ZXJsYXlDU1M6IHtcblx0XHRcdFx0XHRcdGJhY2tncm91bmQgICAgOiAndHJhbnNwYXJlbnQgdXJsKCcgKyB3bGZtY19sMTBuLmFqYXhfbG9hZGVyX3VybCArICcpIG5vLXJlcGVhdCBjZW50ZXInLFxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZFNpemU6ICc4MHB4IDgwcHgnLFxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFVuYmxvY2sgaXRlbSBpZiBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbSBqUXVlcnkgb2JqZWN0XG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0dW5ibG9jazogZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRpZiAodHlwZW9mICQuZm4udW5ibG9jayAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGl0ZW0uc3RvcCggdHJ1ZSApLmNzcyggJ29wYWNpdHknLCAnMScgKS51bmJsb2NrKCk7XG5cdFx0XHQkKCAnLnRvb2x0aXBfX2V4cGFuZGVkJyApLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoICd0b29sdGlwX19oaWRkZW4nICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBjb29raWVzIGFyZSBlbmFibGVkXG5cdCAqXG5cdCAqIEByZXR1cm4gYm9vbGVhblxuXHQgKi9cblx0aXNfY29va2llX2VuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAobmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIHNldCBhbmQgcmVhZCBjb29raWUuXG5cdFx0ZG9jdW1lbnQuY29va2llID0gJ2Nvb2tpZXRlc3Q9MSc7XG5cdFx0dmFyIHJldCAgICAgICAgID0gZG9jdW1lbnQuY29va2llLmluZGV4T2YoICdjb29raWV0ZXN0PScgKSAhPT0gLTE7XG5cblx0XHQvLyBkZWxldGUgY29va2llLlxuXHRcdGRvY3VtZW50LmNvb2tpZSA9ICdjb29raWV0ZXN0PTE7IGV4cGlyZXM9VGh1LCAwMS1KYW4tMTk3MCAwMDowMDowMSBHTVQnO1xuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHRzZXRDb29raWU6IGZ1bmN0aW9uIChjb29raWVfbmFtZSwgdmFsdWUpIHtcblx0XHR2YXIgZXhkYXRlID0gbmV3IERhdGUoKTtcblx0XHRleGRhdGUuc2V0RGF0ZSggZXhkYXRlLmdldERhdGUoKSArICgzNjUgKiAyNSkgKTtcblx0XHRkb2N1bWVudC5jb29raWUgPSBjb29raWVfbmFtZSArIFwiPVwiICsgZXNjYXBlKCB2YWx1ZSApICsgXCI7IGV4cGlyZXM9XCIgKyBleGRhdGUudG9VVENTdHJpbmcoKSArIFwiOyBwYXRoPS9cIjtcblx0fSxcblxuXHR1cGRhdGVVUkxQYXJhbWV0ZXI6IGZ1bmN0aW9uICh1cmwsIHBhcmFtLCBwYXJhbVZhbCkge1xuXHRcdHZhciBuZXdBZGRpdGlvbmFsVVJMID0gXCJcIjtcblx0XHR2YXIgdGVtcEFycmF5ICAgICAgICA9IHVybC5zcGxpdCggXCI/XCIgKTtcblx0XHR2YXIgYmFzZVVSTCAgICAgICAgICA9IHRlbXBBcnJheVswXTtcblx0XHR2YXIgYWRkaXRpb25hbFVSTCAgICA9IHRlbXBBcnJheVsxXTtcblx0XHR2YXIgdGVtcCAgICAgICAgICAgICA9IFwiXCI7XG5cdFx0aWYgKGFkZGl0aW9uYWxVUkwpIHtcblx0XHRcdHRlbXBBcnJheSA9IGFkZGl0aW9uYWxVUkwuc3BsaXQoIFwiJlwiICk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodGVtcEFycmF5W2ldLnNwbGl0KCAnPScgKVswXSAhPT0gcGFyYW0pIHtcblx0XHRcdFx0XHRuZXdBZGRpdGlvbmFsVVJMICs9IHRlbXAgKyB0ZW1wQXJyYXlbaV07XG5cdFx0XHRcdFx0dGVtcCAgICAgICAgICAgICAgPSBcIiZcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciByb3dzX3R4dCA9IHRlbXAgKyBcIlwiICsgcGFyYW0gKyBcIj1cIiArIHBhcmFtVmFsLnJlcGxhY2UoICcjJywgJycgKTtcblx0XHRyZXR1cm4gYmFzZVVSTCArIFwiP1wiICsgbmV3QWRkaXRpb25hbFVSTCArIHJvd3NfdHh0O1xuXHR9LFxuXG5cdGdldFVybFBhcmFtZXRlcjogZnVuY3Rpb24gKHVybCwgc1BhcmFtKSB7XG5cdFx0dmFyIHNQYWdlVVJMICAgICAgPSBkZWNvZGVVUklDb21wb25lbnQoIHVybC5zdWJzdHJpbmcoIDEgKSApLFxuXHRcdFx0c1VSTFZhcmlhYmxlcyA9IHNQYWdlVVJMLnNwbGl0KCAvWyZ8P10rLyApLFxuXHRcdFx0c1BhcmFtZXRlck5hbWUsXG5cdFx0XHRpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHNVUkxWYXJpYWJsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNQYXJhbWV0ZXJOYW1lID0gc1VSTFZhcmlhYmxlc1tpXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdGlmIChzUGFyYW1ldGVyTmFtZVswXSA9PT0gc1BhcmFtKSB7XG5cdFx0XHRcdHJldHVybiBzUGFyYW1ldGVyTmFtZVsxXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNQYXJhbWV0ZXJOYW1lWzFdO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcbn07XG47XG5cblx0XHRcbnRvYXN0ci5vcHRpb25zID0ge1xuXHR0YXBUb0Rpc21pc3M6IHRydWUsXG5cdHRvYXN0Q2xhc3M6ICd0b2FzdCcsXG5cdGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcblx0ZGVidWc6IGZhbHNlLFxuXHRjbG9zZUJ1dHRvbjogZmFsc2UsXG5cdHNob3dNZXRob2Q6ICdmYWRlSW4nLFxuXHRzaG93RHVyYXRpb246IDMwMCxcblx0c2hvd0Vhc2luZzogJ3N3aW5nJyxcblx0b25TaG93bjogdW5kZWZpbmVkLFxuXHRoaWRlTWV0aG9kOiAnZmFkZU91dCcsXG5cdGhpZGVEdXJhdGlvbjogMTAwMCxcblx0aGlkZUVhc2luZzogJ3N3aW5nJyxcblx0b25IaWRkZW46IHVuZGVmaW5lZCxcblx0Y2xvc2VNZXRob2Q6IGZhbHNlLFxuXHRjbG9zZUR1cmF0aW9uOiBmYWxzZSxcblx0Y2xvc2VFYXNpbmc6IGZhbHNlLFxuXHRjbG9zZU9uSG92ZXI6IHRydWUsXG5cdGV4dGVuZGVkVGltZU91dDogMjAwMDAsXG5cdGljb25DbGFzc2VzOiB7XG5cdFx0ZXJyb3I6ICd0b2FzdC1lcnJvcicsXG5cdFx0aW5mbzogJ3RvYXN0LWluZm8nLFxuXHRcdHN1Y2Nlc3M6ICd0b2FzdC1zdWNjZXNzJyxcblx0XHR3YXJuaW5nOiAndG9hc3Qtd2FybmluZydcblx0fSxcblx0aWNvbkNsYXNzOiAndG9hc3QtaW5mbycsXG5cdHBvc2l0aW9uQ2xhc3M6IHdsZm1jX2wxMG4udG9hc3RfcG9zaXRpb24gPT09ICdkZWZhdWx0JyA/ICh3bGZtY19sMTBuLmlzX3J0bCA/ICd0b2FzdC10b3AtcmlnaHQnIDogJ3RvYXN0LXRvcC1sZWZ0JykgOiB3bGZtY19sMTBuLnRvYXN0X3Bvc2l0aW9uLFxuXHR0aW1lT3V0OiA1MDAwLFxuXHR0aXRsZUNsYXNzOiAndG9hc3QtdGl0bGUnLFxuXHRtZXNzYWdlQ2xhc3M6ICd0b2FzdC1tZXNzYWdlJyxcblx0ZXNjYXBlSHRtbDogZmFsc2UsXG5cdHRhcmdldDogJ2JvZHknLFxuXHRuZXdlc3RPblRvcDogdHJ1ZSxcblx0cHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuXHRwcm9ncmVzc0JhcjogdHJ1ZSxcblx0cHJvZ3Jlc3NDbGFzczogJ3RvYXN0LXByb2dyZXNzJyxcblx0cnRsOiAod2xmbWNfbDEwbi5pc19ydGwpID8gdHJ1ZSA6IGZhbHNlXG59XG47XG5cblx0XHRcbmlmICggd2xmbWNfbDEwbi5pc19zYXZlX2Zvcl9sYXRlcl9lbmFibGVkICYmIHdsZm1jX2wxMG4uaXNfc2F2ZV9mb3JfbGF0ZXJfcG9wdXBfcmVtb3ZlX2VuYWJsZWQgKSB7XG5cblx0JCggJy53b29jb21tZXJjZS1jYXJ0LWZvcm0gLnByb2R1Y3QtcmVtb3ZlIGEucmVtb3ZlJyApLm9mZiggJ2NsaWNrJyApLnVuYmluZCggJ2NsaWNrJyApLmRhdGEoICdldmVudHMnLCBudWxsICk7XG5cdCQoICdib2R5JyApLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0J2Zvcm0ud29vY29tbWVyY2UtY2FydC1mb3JtIGEucmVtb3ZlJyxcblx0XHRmdW5jdGlvbihldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR2YXIgdCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0cmVtb3ZlX2l0ZW1fdXJsID0gdC5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0dmFyIGVsZW0gICAgICAgICAgID0gJCggJyNhZGRfdG9fc2F2ZV9mb3JfbGF0ZXJfcG9wdXAnICk7XG5cdFx0XHR2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdFx0Y29sb3I6ICcjMzMzJyxcblx0XHRcdFx0dHJhbnNpdGlvbjogJ2FsbCAwLjNzJyxcblx0XHRcdFx0aG9yaXpvbnRhbDogZWxlbS5kYXRhKCAnaG9yaXpvbnRhbCcgKSxcblx0XHRcdFx0dmVydGljYWw6IGVsZW0uZGF0YSggJ3ZlcnRpY2FsJyApXG5cdFx0XHR9O1xuXHRcdFx0ZWxlbS5wb3B1cCggZGVmYXVsdE9wdGlvbnMgKTtcblx0XHRcdGVsZW0ucG9wdXAoICdzaG93JyApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcbn1cbjtcblxuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnd2xmbWNfaW5pdCcsXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2ZpeF9vbl9pbWFnZV9zaW5nbGVfcG9zaXRpb24oKTtcblxuXHRcdFx0XHR2YXIgdCAgICAgICAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0YiAgICAgICAgICAgICAgICAgICAgICAgPSAkKCAnYm9keScgKSxcblx0XHRcdFx0XHRjYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCA9ICh0eXBlb2YgKHdjX2FkZF90b19jYXJ0X3BhcmFtcykgIT09ICd1bmRlZmluZWQnICYmIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gbnVsbCkgPyB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgOiAnJztcblx0XHRcdFx0XG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWxpc3QgYnV0dG9uW25hbWU9XCJhcHBseV9idWxrX2FjdGlvbnNcIl0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRsZXQgZWxlbSA9ICAkKCB0aGlzICkuY2xvc2VzdCgnLmFjdGlvbi13cmFwcGVyJykuZmluZCgnc2VsZWN0W25hbWU9XCJidWxrX2FjdGlvbnNcIl0nKTtcblx0XHRsZXQgcXVhbnRpdHlfZmllbGRzID0gJCggdGhpcyApLmNsb3Nlc3QoJ2Zvcm0nKS5maW5kKCdpbnB1dC5xdHknKTtcblx0XHRpZiAoIGVsZW0ubGVuZ3RoID4gMCAmJiAnZGVsZXRlJyA9PT0gZWxlbS52YWwoKSAmJiBxdWFudGl0eV9maWVsZHMubGVuZ3RoID4gMCApIHtcblx0XHRcdHF1YW50aXR5X2ZpZWxkcy5hdHRyKCBcImRpc2FibGVkXCIsdHJ1ZSApO1xuXHRcdH1cblx0fVxuKTtcblxuYi5vbihcblx0J2NoYW5nZScsXG5cdCcjYnVsa19hZGRfdG9fY2FydCwjYnVsa19hZGRfdG9fY2FydDInLFxuXHRmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHQgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRjaGVja2JveGVzID0gdC5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5maW5kKCAnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOm5vdCg6ZGlzYWJsZWQpJyApO1xuXHRcdGlmICh0LmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdGNoZWNrYm94ZXMucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0JyApLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQyJyApLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNoZWNrYm94ZXMucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0MicgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0fVxuXHR9XG4pO1xuXG5cbmIub24oXG5cdCdzdWJtaXQnLFxuXHQnLndsZm1jLXBvcHVwLWZvcm0nLFxuXHRmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG50Lm9uKFxuXHQnZm91bmRfdmFyaWF0aW9uJyxcblx0ZnVuY3Rpb24gKGV2LCB2YXJpYXRpb24pIHtcblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgICAgID0gJCggZXYudGFyZ2V0ICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICAgICAgPSB0LmRhdGEoICdwcm9kdWN0X2lkJyApLFxuXHRcdFx0dmFyaWF0aW9uX2RhdGEgICAgICAgID0gdmFyaWF0aW9uO1xuXHRcdHZhcmlhdGlvbl9kYXRhLnByb2R1Y3RfaWQgPSBwcm9kdWN0X2lkO1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dsZm1jX3Nob3dfdmFyaWF0aW9uJywgdmFyaWF0aW9uX2RhdGEgKTtcblx0fVxuKTtcblxudC5vbiggJ3dsZm1jX3JlbG9hZF9mcmFnbWVudHMnLCAkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzICk7XG5cbnQub24oXG5cdCd3bGZtY19mcmFnbWVudHNfbG9hZGVkJyxcblx0ZnVuY3Rpb24gKGV2LCBvcmlnaW5hbCwgdXBkYXRlLCBmaXJzdExvYWQpIHtcblx0XHRpZiAoICEgZmlyc3RMb2FkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JCggJy52YXJpYXRpb25zX2Zvcm0nICkuZmluZCggJy52YXJpYXRpb25zIHNlbGVjdCcgKS5sYXN0KCkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fVxuKTtcblxuLyogPT09IFRBQlMgPT09ICovXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXRhYnMgYTpub3QoLmV4dGVybmFsLWxpbmspJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgY29udGVudCA9ICQoIHRoaXMgKS5kYXRhKCAnY29udGVudCcgKTtcblx0XHQkKCAnLndsZm1jLXRhYi1jb250ZW50JyApLmhpZGUoKTtcblx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy10YWJzLXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdhY3RpdmUtdGFiLWNhcnQgYWN0aXZlLXRhYi1zYXZlLWZvci1sYXRlcicgKTtcblx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy10YWJzLXdyYXBwZXInICkuYWRkQ2xhc3MoICdhY3RpdmUtdGFiLScgKyBjb250ZW50ICk7XG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtdGFicyBhJyApLnJlbW92ZUNsYXNzKCAnbmF2LXRhYi1hY3RpdmUnICk7XG5cdFx0JCggdGhpcyApLmFkZENsYXNzKCAnbmF2LXRhYi1hY3RpdmUnICk7XG5cdFx0JCggJy53bGZtY19jb250ZW50XycgKyBjb250ZW50ICkuc2hvdygpO1xuXHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSggJycsICcnLCAkLmZuLldMRk1DLnVwZGF0ZVVSTFBhcmFtZXRlciggd2luZG93LmxvY2F0aW9uLmhyZWYsIFwidGFiXCIsIGNvbnRlbnQgKSApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuLyogPT09IEdEUFIgPT09ICovXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWdkcHItYnRuJyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGFjdGlvbl90eXBlID0gZWxlbS5kYXRhKCAnYWN0aW9uJyApLFxuXHRcdFx0Y2lkICAgICAgICAgPSBlbGVtLmRhdGEoICdjaWQnICk7XG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5nZHByX2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogZWxlbS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHQnYWN0aW9uX3R5cGUnIDogYWN0aW9uX3R5cGUsXG5cdFx0XHRcdFx0J2NpZCcgOiBjaWRcblx0XHRcdFx0fSxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQoICcud2xmbWMtZ2Rwci1ub3RpY2Utd3JhcHBlciwgLndsZm1jLXVuc3Vic2NyaWJlLW5vdGljZS13cmFwcGVyJykucmVtb3ZlKCk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcbjtcblx0XHRcdFx0XG50Lm9uKFxuXHQnY2xpY2snLFxuXHQnYm9keS5lbGVtZW50b3ItZWRpdG9yLWFjdGl2ZSAud2xmbWMtbGlzdHMtaGVhZGVyIGEsYm9keS5lbGVtZW50b3ItZWRpdG9yLWFjdGl2ZSBhLndsZm1jLW9wZW4tbGlzdC1saW5rJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIGhyZWYgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cdFx0aWYgKGhyZWYgJiYgaHJlZiAhPT0gJyMnICYmIGhyZWYgIT09ICcjIScpIHtcblx0XHRcdCQuZm4uV0xGTUMuYmxvY2soICQoICcud2xmbWMtdGFiLWNvbnRlbnQnICkgKTtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdCQuYWpheChcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHVybDogaHJlZixcblx0XHRcdFx0XHR0eXBlOiAnR0VUJyxcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2h0bWwnLFxuXHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2YXIgJHJlc3BvbnNlID0gJCggZGF0YSApLFxuXHRcdFx0XHRcdFx0XHQkaGVhZGVyICAgPSAkcmVzcG9uc2UuZmluZCggJy53bGZtYy1saXN0cy1oZWFkZXInICksXG5cdFx0XHRcdFx0XHRcdCRjb250ZW50ICA9ICRyZXNwb25zZS5maW5kKCAnLndsZm1jLXRhYi1jb250ZW50JyApO1xuXHRcdFx0XHRcdFx0aWYgKCRjb250ZW50KSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtdGFiLWNvbnRlbnQnICkucmVwbGFjZVdpdGgoICRjb250ZW50ICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoJGhlYWRlcikge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLWxpc3RzLWhlYWRlcicgKS5yZXBsYWNlV2l0aCggJGhlYWRlciApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGhyZWYgIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKSB7XG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgge3BhdGg6IGhyZWZ9LCAnJywgaHJlZiApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cbik7XG47XG5cdFx0XHRcdC8qID09PSBXSVNITElTVCA9PT0gKi9cblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hZGRfdG9fd2lzaGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCBwcm9kdWN0X2FkZGluZyAmJiBBcnJheS5pc0FycmF5KHByb2R1Y3RfaW5fbGlzdCkgJiYgISBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X2FkZGluZyApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0ZWxfd3JhcCAgICAgICAgICAgPSB0LmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBwcm9kdWN0X2lkICksXG5cdFx0XHRmaWx0ZXJlZF9kYXRhICAgICA9IG51bGwsXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3RvX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX3dpc2hsaXN0OiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRwcm9kdWN0X3R5cGU6IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0XHRub25jZTogdC5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdC8vIHdpc2hsaXN0X2lkOiB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0XHQvLyBmcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggcHJvZHVjdF9pZCApXG5cdFx0XHR9O1xuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19hZGRfdG9fd2lzaGxpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRsZXQgY3VycmVudF9wcm9kdWN0X2Zvcm07XG5cblx0XHRpZiAoICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpLmxlbmd0aCApIHtcblxuXHRcdFx0bGV0IGJ1dHRvbiA9ICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKTtcblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gYnV0dG9uLmNsb3Nlc3QoJ2Zvcm0nKS5lcSggMCApO1xuXG5cdFx0fVxuXG5cdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0aWYgKCAgdHlwZW9mIGN1cnJlbnRfcHJvZHVjdF9mb3JtICE9PSAndW5kZWZpbmVkJyAmJiBjdXJyZW50X3Byb2R1Y3RfZm9ybS5sZW5ndGggPiAwKSB7XG5cdFx0XHQvKmN1cnJlbnRfcHJvZHVjdF9mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT0nYWRkLXRvLWNhcnQnXVwiICkuYXR0ciggXCJkaXNhYmxlZFwiLHRydWUgKTtcblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT0nYWRkLXRvLWNhcnQnXVwiICkucmVtb3ZlQXR0ciggXCJkaXNhYmxlZFwiICk7Ki9cblx0XHRcdGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCBjdXJyZW50X3Byb2R1Y3RfZm9ybS5nZXQoIDAgKSApO1xuXHRcdFx0LyokLmVhY2goXG5cdFx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtLFxuXHRcdFx0XHRmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cdFx0XHRcdFx0JCggZWxlbWVudCApLmZpbmQoICdkaXYuY29tcG9zaXRlX2NvbXBvbmVudCcgKS5ub3QoICc6dmlzaWJsZScgKS5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1pdGVtX2lkJyApO1xuXHRcdFx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICd3Y2NwX2NvbXBvbmVudF9zZWxlY3Rpb25fbmlsWycgKyBpZCArICddJyAsICcxJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7Ki9cblx0XHRcdGZvcm1EYXRhLmRlbGV0ZSggJ2FkZC10by1jYXJ0JyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgYWRkX3RvX2NhcnRfbGluayA9IHQuY2xvc2VzdCggJy5wcm9kdWN0LnBvc3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICkuZmluZCggJy5hZGRfdG9fY2FydF9idXR0b24nICk7XG5cdFx0XHRpZiAoIGFkZF90b19jYXJ0X2xpbmsubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhLnF1YW50aXR5ID0gYWRkX3RvX2NhcnRfbGluay5hdHRyKCAnZGF0YS1xdWFudGl0eScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmVhY2goXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZnVuY3Rpb24oa2V5LHZhbHVlT2JqKXtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXkgLCB0eXBlb2YgdmFsdWVPYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoIHZhbHVlT2JqICkgOiB2YWx1ZU9iaiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRqUXVlcnkoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnd2xmbWNfYWRkaW5nX3RvX3dpc2hsaXN0JyApO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0cHJvZHVjdF9hZGRpbmcgPSBmYWxzZTtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdC8vZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdGNhY2hlOiBmYWxzZSxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwcm9kdWN0X2FkZGluZyA9IHRydWU7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHByb2R1Y3RfYWRkaW5nID0gZmFsc2U7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgfHwgcmVzcG9uc2VfcmVzdWx0ID09PSAnZXhpc3RzJykge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UuaXRlbV9pZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBwcm9kdWN0X2luX2xpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aXNobGlzdF9pZDogcmVzcG9uc2Uud2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1faWQ6IHJlc3BvbnNlLml0ZW1faWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHBhcnNlSW50KCBwcm9kdWN0X2lkICksXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgcG9wdXBfaWQgPSBlbF93cmFwLmF0dHIoICdkYXRhLXBvcHVwLWlkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAocG9wdXBfaWQpIHtcblxuXHRcdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgICAgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0dmFyIGVsZW0gICAgICAgICAgID0gJCggJyMnICsgcG9wdXBfaWQgKTtcblx0XHRcdFx0XHRcdFx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJyMzMzMnLFxuXHRcdFx0XHRcdFx0XHRcdHRyYW5zaXRpb246ICdhbGwgMC4zcycsXG5cdFx0XHRcdFx0XHRcdFx0aG9yaXpvbnRhbDogZWxlbS5kYXRhKCAnaG9yaXpvbnRhbCcgKSxcblx0XHRcdFx0XHRcdFx0XHR2ZXJ0aWNhbDogZWxlbS5kYXRhKCAndmVydGljYWwnIClcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0ZWxlbS5wb3B1cCggZGVmYXVsdE9wdGlvbnMgKTtcblx0XHRcdFx0XHRcdFx0JCgnI3dsZm1jLXRvb2x0aXAnKVxuXHRcdFx0XHRcdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdFx0XHRcdFx0J3RvcCc6ICcwJyxcblx0XHRcdFx0XHRcdFx0XHRcdCdsZWZ0JzogJzAnXG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoKVxuXHRcdFx0XHRcdFx0XHRcdC5hZGRDbGFzcygndG9vbHRpcF9faGlkZGVuJyk7XG5cdFx0XHRcdFx0XHRcdGVsZW0ucG9wdXAoICdzaG93JyApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X2FkZGVkX3RleHQgKSAmJiByZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJykge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcyggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9hZGRlZF90ZXh0ICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9hdXRvbWF0aW9ucyggcHJvZHVjdF9pZCwgcmVzcG9uc2Uud2lzaGxpc3RfaWQsIHJlc3BvbnNlLmN1c3RvbWVyX2lkLCAnd2lzaGxpc3QnLCByZXNwb25zZS5sb2FkX2F1dG9tYXRpb25fbm9uY2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICYmIHdsZm1jX2wxMG4uY2xpY2tfYmVoYXZpb3IgPT09ICdhZGQtcmVkaXJlY3QnICkge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3bGZtY19sMTBuLndpc2hsaXN0X3BhZ2VfdXJsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZS5tZXNzYWdlICkgJiYgcmVzcG9uc2VfcmVzdWx0ICE9PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXG5cdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX2FkZGVkX3RvX3dpc2hsaXN0JywgW3QsIGVsX3dyYXBdICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hamF4X2FkZF90b19jYXJ0Om5vdCguZGlzYWJsZWQpJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZCAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW1faWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCA9IHQuYXR0ciggJ2RhdGEtd2lzaGxpc3RfaWQnICksXG5cdFx0XHRkYXRhICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3RvX2NhcnRfYWN0aW9uLFxuXHRcdFx0XHRub25jZTogdC5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGxpZDogaXRlbV9pZCxcblx0XHRcdFx0d2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdH07XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHQucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHR0LmFkZENsYXNzKCAnbG9hZGluZycgKTtcblxuXHRcdC8vIEFsbG93IDNyZCBwYXJ0aWVzIHRvIHZhbGlkYXRlIGFuZCBxdWl0IGVhcmx5LlxuXHRcdGlmICggZmFsc2UgPT09ICQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VySGFuZGxlciggJ3Nob3VsZF9zZW5kX2FqYXhfcmVxdWVzdC5hZGRpbmdfdG9fY2FydCcsIFsgdCBdICkgKSB7XG5cdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FqYXhfcmVxdWVzdF9ub3Rfc2VudC5hZGRpbmdfdG9fY2FydCcsIFsgZmFsc2UsIGZhbHNlLCB0IF0gKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FkZGluZ190b19jYXJ0JywgWyB0LCBkYXRhIF0gKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuXHRcdFx0XHRcdGlmICggISByZXNwb25zZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yIHx8ICggcmVzcG9uc2Uuc3VjY2VzcyAmJiAhICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZS5zdWNjZXNzICkgKSApIHtcblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2UucHJvZHVjdF91cmwgKSB7XG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHJlc3BvbnNlLnByb2R1Y3RfdXJsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoICcnICE9PSB3bGZtY19sMTBuLmxhYmVscy5mYWlsZWRfYWRkX3RvX2NhcnRfbWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5mYWlsZWRfYWRkX3RvX2NhcnRfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBSZWRpcmVjdCB0byBjYXJ0IG9wdGlvbi5cblx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCApICkge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF91cmw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCd3Y19mcmFnbWVudF9yZWZyZXNoJyk7XG5cdFx0XHRcdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IHNvIHRoZW1lcyBjYW4gcmVmcmVzaCBvdGhlciBhcmVhcy5cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkZWRfdG9fY2FydCcsIFsgcmVzcG9uc2UuZnJhZ21lbnRzLCByZXNwb25zZS5jYXJ0X2hhc2gsIHQgXSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoICcnICE9PSB3bGZtY19sMTBuLmxhYmVscy5hZGRlZF90b19jYXJ0X21lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5hZGRlZF90b19jYXJ0X21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UubWVzc2FnZSAmJiAnJyAhPT0gcmVzcG9uc2UubWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkX3RvX2NhcnRfbWVzc2FnZScsIFsgcmVzcG9uc2UubWVzc2FnZSwgdF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1idG4tbG9naW4tbmVlZCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5sb2dpbl9uZWVkICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FscmVhZHlfaW5fd2lzaGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMuYWxyZWFkeV9pbl93aXNobGlzdF90ZXh0ICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXdpc2hsaXN0LXRhYmxlIC5yZW1vdmVfZnJvbV93aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgdGFibGUgICAgICAgICAgPSB0LnBhcmVudHMoICcud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKSxcblx0XHRcdHJvdyAgICAgICAgICAgID0gdC5wYXJlbnRzKCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdGRhdGFfcm93X2lkICAgID0gcm93LmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCAgICA9IHRhYmxlLmRhdGEoICdpZCcgKSxcblx0XHRcdHdpc2hsaXN0X3Rva2VuID0gdGFibGUuZGF0YSggJ3Rva2VuJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHQuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV93aXNobGlzdDogZGF0YV9yb3dfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHdpc2hsaXN0X3Rva2VuLFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKCBkYXRhX3Jvd19pZCApXG5cdFx0XHR9O1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMuYmxvY2soIHJvdyApO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmJsb2NrKCByb3cgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRsZXQgaTtcblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0LyppZiAodHlwZW9mIGRhdGEuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLnJlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0cm93LmFkZENsYXNzKCdkaXNhYmxlZC1yb3cnKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX2xpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fbGlzdFtpXS5wcm9kdWN0X2lkID09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dpc2hsaXN0JywgW3QsIHJvdyAsIGRhdGFdICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2FpdGxpc3QnLCBbdCwgcm93ICwgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl93YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2sgdG91Y2hlbmQnLFxuXHQnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2lzaGxpc3QgLnJlbW92ZV9mcm9tX3dpc2hsaXN0LC53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdhaXRsaXN0IC5yZW1vdmVfZnJvbV93aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgdGFibGUgICAgICAgICAgPSB0LnBhcmVudHMoICcud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKSxcblx0XHRcdHJvdyAgICAgICAgICAgID0gdC5wYXJlbnRzKCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdGRhdGFfcm93X2lkICAgID0gcm93LmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHRkYXRhX2l0ZW1faWQgICA9IHJvdy5kYXRhKCAnaXRlbS1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkICAgID0gcm93LmRhdGEoICd3aXNobGlzdC1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X3Rva2VuID0gcm93LmRhdGEoICd3aXNobGlzdC10b2tlbicgKSxcblx0XHRcdGxpc3RfdGFibGUgICAgICAgICAgICAgICAgICA9ICQoJy53bGZtYy13aXNobGlzdC1mb3JtIC53bGZtYy13aXNobGlzdC10YWJsZScpLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHQuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV93aXNobGlzdDogZGF0YV9yb3dfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHdpc2hsaXN0X3Rva2VuLFxuXHRcdFx0XHRtZXJnZV9saXN0czogd2xmbWNfbDEwbi5tZXJnZV9saXN0cyxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggZGF0YV9yb3dfaWQgKVxuXHRcdFx0fTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXG5cdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdHZhciBsb2FkX2ZyYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX2xpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdFtpXS53aXNobGlzdF9pZCA9PT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl9saXN0W2ldLnByb2R1Y3RfaWQgPT09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dpc2hsaXN0JywgW3QsIHJvdywgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ud2lzaGxpc3RfaWQgPT09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dhaXRsaXN0JywgW3QsIHJvdywgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl93YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggdC5jbG9zZXN0KCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQvLyQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGRhdGEuY291bnQgKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdpc2hsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggZGF0YS5jb3VudCApO1xuXG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LndsZm1jLWFkZC10by13aXNobGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggdC5jbG9zZXN0KCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQvLyQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGRhdGEuY291bnQgKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdhaXRsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggZGF0YS5jb3VudCApO1xuXG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LndsZm1jLWFkZC10by13YWl0bGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggbGlzdF90YWJsZS5sZW5ndGggPiAwICYmIHBhcnNlSW50KCB3aXNobGlzdF9pZCApID09PSBwYXJzZUludCggbGlzdF90YWJsZS5hdHRyKCAnZGF0YS1pZCcgKSApICkge1xuXHRcdFx0XHRcdFx0XHRsaXN0X3RhYmxlLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkuYWRkQ2xhc3MoJ2Rpc2FibGVkLXJvdycpO1xuXHRcdFx0XHRcdFx0XHRsb2FkX2ZyYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKChkYXRhLmNvdW50IDwgMSB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkgKSB7XG5cdFx0XHRcdFx0XHRcdGxvYWRfZnJhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggbG9hZF9mcmFnICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvKmlmICgoZGF0YS5jb3VudCA8IDEgfHwgISB0YWJsZS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5sZW5ndGgpICYmIHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19kZWxldGVfaXRlbScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0aXRlbV9pZCAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWQnICksXG5cdFx0XHRlbF93cmFwICAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBwcm9kdWN0X2lkICksXG5cdFx0XHRkYXRhICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuZGVsZXRlX2l0ZW1fYWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHR3aXNobGlzdF9pZDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdGl0ZW1faWQ6IGl0ZW1faWQsXG5cdFx0XHRcdG5vbmNlOiB0LmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggcHJvZHVjdF9pZCApXG5cdFx0XHR9O1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgZnJhZ21lbnRzICAgICAgICA9IHJlc3BvbnNlLmZyYWdtZW50cyxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuXG5cdFx0XHRcdFx0aWYgKCd0cnVlJyA9PT0gcmVzcG9uc2UucmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRlbF93cmFwLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QgPSAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LFxuXHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZS5pdGVtX2lkICE9PSBwYXJzZUludCggaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISB0LmNsb3Nlc3QoICcud2xmbWMtcmVtb3ZlLWJ1dHRvbicgKS5sZW5ndGggJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCd0cnVlJyA9PT0gcmVzcG9uc2UucmVzdWx0ICYmICcnICE9PSAkLnRyaW0oIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfcmVtb3ZlZF90ZXh0ICkpIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9yZW1vdmVkX3RleHQgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdC8qaWYgKHR5cGVvZiBmcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXG5cdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX3JlbW92ZWRfZnJvbV93aXNobGlzdCcsIFt0LCBlbF93cmFwLCByZXNwb25zZV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbnQub24oXG5cdCd3bGZtY19zaG93X3ZhcmlhdGlvbicgLFxuXHRmdW5jdGlvbiAoZXYsIGRhdGEpIHtcblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gZGF0YS5wcm9kdWN0X2lkLFxuXHRcdFx0dmFyaWF0aW9uX2lkICAgICAgPSBkYXRhLnZhcmlhdGlvbl9pZCxcblx0XHRcdHRhcmdldHMgICAgICAgICAgID0gJCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QgW2RhdGEtcGFyZW50LXByb2R1Y3QtaWQ9XCInICsgcHJvZHVjdF9pZCArICdcIl0nICksXG5cdFx0XHRlbmFibGVfb3V0b2ZzdG9jayA9IHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuZGF0YSggJ2VuYWJsZS1vdXRvZnN0b2NrJyApO1xuXHRcdGlmICggISBwcm9kdWN0X2lkIHx8ICEgdmFyaWF0aW9uX2lkIHx8ICEgdGFyZ2V0cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCAhIGVuYWJsZV9vdXRvZnN0b2NrICYmICEgZGF0YS5pc19pbl9zdG9jaykge1xuXHRcdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdH1cblx0XHR2YXIgcG9wdXBJZCA9IHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuYXR0ciggJ2RhdGEtcG9wdXAtaWQnICk7XG5cdFx0aWYgKCBwb3B1cElkICkge1xuXHRcdFx0dmFyIHBvcHVwICAgPSAkKCcjJyArIHBvcHVwSWQpO1xuXHRcdFx0aWYgKHBvcHVwLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgcHJvZHVjdF90aXRsZSAgPSBwb3B1cC5kYXRhKCAncHJvZHVjdC10aXRsZScgKTtcblx0XHRcdFx0dmFyIGRlc2MgICAgICAgICAgID0gd2xmbWNfbDEwbi5sYWJlbHMucG9wdXBfY29udGVudDtcblx0XHRcdFx0dmFyIHRpdGxlICAgICAgICAgID0gd2xmbWNfbDEwbi5sYWJlbHMucG9wdXBfdGl0bGU7XG5cdFx0XHRcdHZhciBpbWFnZV9zaXplICAgICA9IHBvcHVwLmRhdGEoICdpbWFnZS1zaXplJyApO1xuXHRcdFx0XHR2YXIgaW1nICAgICAgICAgICAgPSBwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWhlYWRlciBpbWcnICkuZGF0YSggJ3NyYycgKTtcblx0XHRcdFx0dmFyIG9yaWdpbmFsX3ByaWNlID0gcG9wdXAuZmluZCggJy53bGZtYy1wYXJlbnQtcHJvZHVjdC1wcmljZScgKS5odG1sKCk7XG5cdFx0XHRcdHZhciBwcm9kdWN0X3ByaWNlICA9ICcnICE9PSBkYXRhLnByaWNlX2h0bWwgPyBkYXRhLnByaWNlX2h0bWwgOiBvcmlnaW5hbF9wcmljZTtcblxuXHRcdFx0XHRkZXNjID0gZGVzYy5yZXBsYWNlKCAne3Byb2R1Y3RfcHJpY2V9JywgcHJvZHVjdF9wcmljZSApO1xuXHRcdFx0XHRkZXNjID0gZGVzYy5yZXBsYWNlKCAne3Byb2R1Y3RfbmFtZX0nLCBwcm9kdWN0X3RpdGxlICk7XG5cblx0XHRcdFx0dGl0bGUgPSB0aXRsZS5yZXBsYWNlKCAne3Byb2R1Y3RfcHJpY2V9JywgcHJvZHVjdF9wcmljZSApO1xuXHRcdFx0XHR0aXRsZSA9IHRpdGxlLnJlcGxhY2UoICd7cHJvZHVjdF9uYW1lfScsIHByb2R1Y3RfdGl0bGUgKTtcblxuXHRcdFx0XHRpZiAoZGF0YS5pbWFnZV9pZCAmJiAndHJ1ZScgPT0gcG9wdXAuZGF0YSggJ3VzZS1mZWF0dXJlZCcgKSkge1xuXHRcdFx0XHRcdGltZyA9ICdsYXJnZScgPT09IGltYWdlX3NpemUgPyBkYXRhLmltYWdlLmZ1bGxfc3JjIDogKCd0aHVtYm5haWwnID09PSBpbWFnZV9zaXplID8gZGF0YS5pbWFnZS50aHVtYl9zcmMgOiBkYXRhLmltYWdlLnNyYyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLXRpdGxlJyApLmh0bWwoIHRpdGxlICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtZGVzYycgKS5odG1sKCBkZXNjICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtaGVhZGVyIGltZycgKS5hdHRyKCAnc3JjJywgaW1nICk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0Y29udGFpbmVyID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKTtcblxuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0Y29udGFpbmVyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIChpLCBjbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWF0Y2goIC93bGZtYy1hZGQtdG8td2lzaGxpc3QtXFxTKy9nICkuam9pbiggJyAnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggJ3dsZm1jLWFkZC10by13aXNobGlzdC0nICsgdmFyaWF0aW9uX2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtYWRkdG93aXNobGlzdCBhJyApLmF0dHIoICdocmVmJywgY29udGFpbmVyLmF0dHIoICdkYXRhLWFkZC11cmwnICkucmVwbGFjZSggXCIjcHJvZHVjdF9pZFwiLCB2YXJpYXRpb25faWQgKSApO1xuXHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1yZW1vdmVmcm9td2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1yZW1vdmUtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgdmFyaWF0aW9uX2lkICkgKTtcblx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJyAmJiB2LnByb2R1Y3RfaWQgJiYgdi5wcm9kdWN0X2lkID09IHZhcmlhdGlvbl9pZCkge1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJywgdi53aXNobGlzdF9pZCApO1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS1pdGVtLWlkJywgdi5pdGVtX2lkICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuKTtcbnQub24oXG5cdCdyZXNldF9kYXRhJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgPSB0LmRhdGEoICdwcm9kdWN0X2lkJyApLFxuXHRcdFx0dGFyZ2V0cyAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0IFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApO1xuXHRcdGlmICggISBwcm9kdWN0X2lkIHx8ICEgdGFyZ2V0cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHR2YXIgcG9wdXBJZCA9IHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuYXR0ciggJ2RhdGEtcG9wdXAtaWQnICk7XG5cdFx0aWYgKCBwb3B1cElkICkge1xuXHRcdFx0dmFyIHBvcHVwICAgPSAkKCcjJyArIHBvcHVwSWQpO1xuXHRcdFx0aWYgKHBvcHVwLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgb3JpZ2luYWxfcHJpY2UgPSBwb3B1cC5maW5kKCAnLndsZm1jLXBhcmVudC1wcm9kdWN0LXByaWNlJyApLmh0bWwoKTtcblx0XHRcdFx0dmFyIHByb2R1Y3RfdGl0bGUgID0gcG9wdXAuZGF0YSggJ3Byb2R1Y3QtdGl0bGUnICk7XG5cdFx0XHRcdHZhciBkZXNjICAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX2NvbnRlbnQ7XG5cdFx0XHRcdHZhciB0aXRsZSAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX3RpdGxlO1xuXG5cdFx0XHRcdHZhciBpbWcgPSBwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWhlYWRlciBpbWcnICkuZGF0YSggJ3NyYycgKTtcblxuXHRcdFx0XHRkZXNjID0gZGVzYy5yZXBsYWNlKCAne3Byb2R1Y3RfcHJpY2V9Jywgb3JpZ2luYWxfcHJpY2UgKTtcblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X25hbWV9JywgcHJvZHVjdF90aXRsZSApO1xuXG5cdFx0XHRcdHRpdGxlID0gdGl0bGUucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIG9yaWdpbmFsX3ByaWNlICk7XG5cdFx0XHRcdHRpdGxlID0gdGl0bGUucmVwbGFjZSggJ3twcm9kdWN0X25hbWV9JywgcHJvZHVjdF90aXRsZSApO1xuXG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtdGl0bGUnICkuaHRtbCggdGl0bGUgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1kZXNjJyApLmh0bWwoIGRlc2MgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1oZWFkZXIgaW1nJyApLmF0dHIoICdzcmMnLCBpbWcgKTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRhcmdldHMuZWFjaChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRjb250YWluZXIgPSB0LmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApO1xuXG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0Y29udGFpbmVyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIChpLCBjbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWF0Y2goIC93bGZtYy1hZGQtdG8td2lzaGxpc3QtXFxTKy9nICkuam9pbiggJyAnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggJ3dsZm1jLWFkZC10by13aXNobGlzdC0nICsgcHJvZHVjdF9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLWFkZHRvd2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1hZGQtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgcHJvZHVjdF9pZCApICk7XG5cdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLXJlbW92ZWZyb213aXNobGlzdCBhJyApLmF0dHIoICdocmVmJywgY29udGFpbmVyLmF0dHIoICdkYXRhLXJlbW92ZS11cmwnICkucmVwbGFjZSggXCIjcHJvZHVjdF9pZFwiLCBwcm9kdWN0X2lkICkgKTtcblx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJyAmJiB2LnByb2R1Y3RfaWQgJiYgdi5wcm9kdWN0X2lkID09IHByb2R1Y3RfaWQpIHtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcsIHYud2lzaGxpc3RfaWQgKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWNfZGVsZXRlX2l0ZW0nICkuYXR0ciggJ2RhdGEtaXRlbS1pZCcsIHYuaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0fVxuKTtcbjtcblx0XHRcdFx0LyogPT09IFdhaXRsaXN0ID09PSAqL1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXdhaXRsaXN0LWJ0bi1sb2dpbi1uZWVkJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X2xvZ2luX25lZWQgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG50Lm9uKFxuXHQnd2xmbWNfc2hvd192YXJpYXRpb24nLFxuXHRmdW5jdGlvbiAoZXYsIGRhdGEpIHtcblx0XHR2YXJcdHByb2R1Y3RfaWQgICA9IGRhdGEucHJvZHVjdF9pZCxcblx0XHRcdHZhcmlhdGlvbl9pZCA9IGRhdGEudmFyaWF0aW9uX2lkO1xuXHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfbW9kdWxlcyggZGF0YSwgcHJvZHVjdF9pZCwgdmFyaWF0aW9uX2lkICk7XG5cdH1cbik7XG5cbnQub24oXG5cdCdyZXNldF9kYXRhJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgPSB0LmRhdGEoICdwcm9kdWN0X2lkJyApO1xuXHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfbW9kdWxlcyggbnVsbCAsIHByb2R1Y3RfaWQsIHByb2R1Y3RfaWQgKTtcblx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB3bGZtY19sMTBuLndhaXRsaXN0X3JlcXVpcmVkX3Byb2R1Y3RfdmFyaWF0aW9uICkgKSB7XG5cdFx0XHRsZXQgZWxlbSA9ICQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyBwcm9kdWN0X2lkICk7XG5cdFx0XHRlbGVtLmZpbmQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcicgKS5hZGRDbGFzcyggJ3dsZm1jLWRpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2hpZGVfdmFyaWF0aW9uJyxcblx0Jy52YXJpYXRpb25zX2Zvcm0nLFxuXHRmdW5jdGlvbiAoYSkge1xuXHRcdGxldCBlbGVtID0gJCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArICQoIHRoaXMgKS5kYXRhKCAncHJvZHVjdF9pZCcgKSApO1xuXHRcdGlmICggZWxlbS5sZW5ndGggPiAwICYmICQuZm4uV0xGTUMuaXNUcnVlKCB3bGZtY19sMTBuLndhaXRsaXN0X3JlcXVpcmVkX3Byb2R1Y3RfdmFyaWF0aW9uICkgKSB7XG5cdFx0XHRhLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlbGVtLmZpbmQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcicgKS5hZGRDbGFzcyggJ3dsZm1jLWRpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J3Nob3dfdmFyaWF0aW9uJyxcblx0Jy52YXJpYXRpb25zX2Zvcm0nLFxuXHRmdW5jdGlvbiAoYSwgYiwgZCkge1xuXHRcdGxldCBlbGVtID0gJCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArICQoIHRoaXMgKS5kYXRhKCAncHJvZHVjdF9pZCcgKSApO1xuXHRcdGlmICggZWxlbS5sZW5ndGggPiAwICkge1xuXHRcdFx0YS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZWxlbS5maW5kKCAnLndsZm1jLXBvcHVwLXRyaWdnZXInICkucmVtb3ZlQ2xhc3MoICd3bGZtYy1kaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtYWRkLXRvLXdhaXRsaXN0IC53bGZtYy1wb3B1cC10cmlnZ2VyLndsZm1jLWRpc2FibGVkJyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMud2FpdGxpc3RfbWFrZV9hX3NlbGVjdGlvbl90ZXh0ICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b193YWl0bGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHRwYXJlbnRfcHJvZHVjdF9pZCA9IHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnICksXG5cdFx0XHRmaWx0ZXJlZF9kYXRhICAgICA9IG51bGwsXG5cdFx0XHRwb3B1cCAgICAgICAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy1wb3B1cCcgKSxcblx0XHRcdG9uX3NhbGUgICAgICAgICAgID0gcG9wdXAuZmluZCggJy53bGZtYy13YWl0bGlzdC1zZWxlY3QtdHlwZSBpbnB1dFtuYW1lPWxpc3Rfb24tc2FsZV06Y2hlY2tlZCcgKS5sZW5ndGggPiAwID8gMSA6IDAsXG5cdFx0XHRiYWNrX2luX3N0b2NrICAgICA9IHBvcHVwLmZpbmQoICcud2xmbWMtd2FpdGxpc3Qtc2VsZWN0LXR5cGUgaW5wdXRbbmFtZT1saXN0X2JhY2staW4tc3RvY2tdOmNoZWNrZWQnICkubGVuZ3RoID4gMCA/IDEgOiAwLFxuXHRcdFx0cHJpY2VfY2hhbmdlICAgICAgPSBwb3B1cC5maW5kKCAnLndsZm1jLXdhaXRsaXN0LXNlbGVjdC10eXBlIGlucHV0W25hbWU9bGlzdF9wcmljZS1jaGFuZ2VdOmNoZWNrZWQnICkubGVuZ3RoID4gMCA/IDEgOiAwLFxuXHRcdFx0bG93X3N0b2NrICAgICAgICAgPSBwb3B1cC5maW5kKCAnLndsZm1jLXdhaXRsaXN0LXNlbGVjdC10eXBlIGlucHV0W25hbWU9bGlzdF9sb3ctc3RvY2tdOmNoZWNrZWQnICkubGVuZ3RoID4gMCA/IDEgOiAwLFxuXHRcdFx0ZW1haWwgICAgICAgICAgICAgPSBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT13bGZtY19lbWFpbF0nICkubGVuZ3RoID4gMCA/IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPXdsZm1jX2VtYWlsXScgKS52YWwoKS50cmltKCkgOiBmYWxzZSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfcHJvZHVjdF90b193YWl0bGlzdF9hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGFkZF90b193YWl0bGlzdDogcHJvZHVjdF9pZCxcblx0XHRcdFx0cHJvZHVjdF90eXBlOiB0LmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScgKSxcblx0XHRcdFx0b25fc2FsZSA6IG9uX3NhbGUsXG5cdFx0XHRcdGJhY2tfaW5fc3RvY2sgOmJhY2tfaW5fc3RvY2ssXG5cdFx0XHRcdHByaWNlX2NoYW5nZSA6IHByaWNlX2NoYW5nZSxcblx0XHRcdFx0bG93X3N0b2NrICA6IGxvd19zdG9jayxcblx0XHRcdFx0d2xmbWNfZW1haWwgOiBlbWFpbFxuXHRcdFx0fTtcblxuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoIGZhbHNlICE9PSBlbWFpbCAmJiAnJyA9PT0gZW1haWwgKSB7XG5cdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X2VtYWlsX3JlcXVpcmVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICggZmFsc2UgIT09IGVtYWlsICYmICEgJC5mbi5XTEZNQy52YWxpZGF0ZUVtYWlsKGVtYWlsKSApIHtcblx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMud2FpdGxpc3RfZW1haWxfZm9ybWF0ICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2FkZF90b193YWl0bGlzdF9kYXRhJywgW3QsIGRhdGFdICkpIHtcblx0XHRcdGRhdGEgPSBmaWx0ZXJlZF9kYXRhO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyZW50X3Byb2R1Y3RfZm9ybTtcblxuXHRcdGlmICggJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJykubGVuZ3RoICkge1xuXG5cdFx0XHRsZXQgYnV0dG9uID0gJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpO1xuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSBidXR0b24uY2xvc2VzdCgnZm9ybScpLmVxKCAwICk7XG5cblx0XHR9XG5cblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRpZiAoICB0eXBlb2YgY3VycmVudF9wcm9kdWN0X2Zvcm0gIT09ICd1bmRlZmluZWQnICYmIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCBjdXJyZW50X3Byb2R1Y3RfZm9ybS5nZXQoIDAgKSApO1xuXHRcdFx0Zm9ybURhdGEuZGVsZXRlKCAnYWRkLXRvLWNhcnQnICk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKFxuXHRcdFx0ZGF0YSxcblx0XHRcdGZ1bmN0aW9uKGtleSx2YWx1ZU9iail7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCgga2V5ICwgdHlwZW9mIHZhbHVlT2JqID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KCB2YWx1ZU9iaiApIDogdmFsdWVPYmogKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ3dsZm1jX2FkZGluZ190b193YWl0bGlzdCcgKTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ud2FpdGxpc3RfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdC8vZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdGNhY2hlOiBmYWxzZSxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX3Jlc3VsdCAgPSByZXNwb25zZS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZSxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICkge1xuXG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApICkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGV0IGxpc3RfdHlwZSA9ICd3YWl0bGlzdCc7XG5cdFx0XHRcdFx0XHRpZiAob25fc2FsZSA9PT0gMSkgbGlzdF90eXBlICs9ICcsb24tc2FsZSc7XG5cdFx0XHRcdFx0XHRpZiAocHJpY2VfY2hhbmdlID09PSAxKSBsaXN0X3R5cGUgKz0gJyxwcmljZS1jaGFuZ2UnO1xuXHRcdFx0XHRcdFx0aWYgKGJhY2tfaW5fc3RvY2sgPT09IDEpIGxpc3RfdHlwZSArPSAnLGJhY2staW4tc3RvY2snO1xuXHRcdFx0XHRcdFx0aWYgKGxvd19zdG9jayA9PT0gMSkgbGlzdF90eXBlICs9ICcsbG93LXN0b2NrJztcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS53aXNobGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsIGxpc3RfdHlwZSwgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b19vdXRvZnN0b2NrJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHBhcmVudF9wcm9kdWN0X2lkID0gdC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHdsZm1jX2VtYWlsICAgICAgID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrJyApLmZpbmQoICdpbnB1dFtuYW1lPXdsZm1jX2VtYWlsXScgKSxcblx0XHRcdGZpbHRlcmVkX2RhdGEgICAgID0gbnVsbCxcblx0XHRcdGVtYWlsICAgICAgICAgICAgID0gd2xmbWNfZW1haWwubGVuZ3RoID4gMCA/IHdsZm1jX2VtYWlsLnZhbCgpLnRyaW0oKSA6IGZhbHNlLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmFkZF9wcm9kdWN0X3RvX3dhaXRsaXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX3dhaXRsaXN0OiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRwcm9kdWN0X3R5cGU6IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0XHRvbl9zYWxlIDogMCxcblx0XHRcdFx0YmFja19pbl9zdG9jayA6IDEsXG5cdFx0XHRcdHByaWNlX2NoYW5nZSA6IDAsXG5cdFx0XHRcdGxvd19zdG9jayAgOiAwLFxuXHRcdFx0XHR3bGZtY19lbWFpbCA6ICBlbWFpbFxuXHRcdFx0fTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCBmYWxzZSAhPT0gZW1haWwgJiYgJycgPT09IGVtYWlsICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy53YWl0bGlzdF9lbWFpbF9yZXF1aXJlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIGZhbHNlICE9PSBlbWFpbCAmJiAhICQuZm4uV0xGTUMudmFsaWRhdGVFbWFpbChlbWFpbCkgKSB7XG5cdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X2VtYWlsX2Zvcm1hdCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBhbGxvdyB0aGlyZCBwYXJ0eSBjb2RlIHRvIGZpbHRlciBkYXRhLlxuXHRcdGlmIChmaWx0ZXJlZF9kYXRhID09PSAkKCBkb2N1bWVudCApLnRyaWdnZXJIYW5kbGVyKCAnd2xmbWNfYWRkX3RvX3dhaXRsaXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0bGV0IGN1cnJlbnRfcHJvZHVjdF9mb3JtO1xuXG5cdFx0aWYgKCAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCAgKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKS5sZW5ndGggKSB7XG5cblx0XHRcdGxldCBidXR0b24gPSAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCdmb3JtJykuZXEoIDAgKTtcblxuXHRcdH1cblxuXHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdGlmICggIHR5cGVvZiBjdXJyZW50X3Byb2R1Y3RfZm9ybSAhPT0gJ3VuZGVmaW5lZCcgJiYgY3VycmVudF9wcm9kdWN0X2Zvcm0ubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9ybURhdGEgPSBuZXcgRm9ybURhdGEoIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmdldCggMCApICk7XG5cdFx0XHRmb3JtRGF0YS5kZWxldGUoICdhZGQtdG8tY2FydCcgKTtcblx0XHR9XG5cblx0XHQkLmVhY2goXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZnVuY3Rpb24oa2V5LHZhbHVlT2JqKXtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXkgLCB0eXBlb2YgdmFsdWVPYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoIHZhbHVlT2JqICkgOiB2YWx1ZU9iaiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRqUXVlcnkoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnd2xmbWNfYWRkaW5nX3RvX3dhaXRsaXN0JyApO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi53YWl0bGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0Ly9kYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAocmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgKSB7XG5cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlX21lc3NhZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHByb2R1Y3RfaWQgKS5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS53aXNobGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsICdiYWNrLWluLXN0b2NrJywgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfY2FuY2VsX291dG9mc3RvY2snLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmFkZF9wcm9kdWN0X3RvX3dhaXRsaXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX3dhaXRsaXN0OiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRwcm9kdWN0X3R5cGU6IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0XHRvbl9zYWxlIDogMCxcblx0XHRcdFx0YmFja19pbl9zdG9jayA6IDAsXG5cdFx0XHRcdHByaWNlX2NoYW5nZSA6IDAsXG5cdFx0XHRcdGxvd19zdG9jayAgOiAwLFxuXHRcdFx0fTtcblxuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc19jb29raWVfZW5hYmxlZCgpKSB7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLndhaXRsaXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmIChyZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyApIHtcblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jay0nICsgcHJvZHVjdF9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuO1xuXHRcdFx0XHQvKiA9PT0gTVVMVEkgTElTVCA9PT0gKi9cblxubGV0IFByZXZMaXN0c1N0YXRlID0gW107XG5cbmIub24oXG5cdCdpbnB1dCcsXG5cdCcud2xmbWMtcG9wdXAtbGlzdHMtd3JhcHBlciAuc2VhcmNoLWlucHV0Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlYXJjaFRlcm0gICA9ICQoIHRoaXMgKS52YWwoKS50b0xvd2VyQ2FzZSgpO1xuXHRcdHZhciBsaXN0ICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1wb3B1cC1saXN0cy13cmFwcGVyJyApLmZpbmQoICcubGlzdCcgKTtcblx0XHR2YXIgbm9SZXN1bHRzUm93ID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtcG9wdXAtbGlzdHMtd3JhcHBlcicgKS5maW5kKCAnLm5vLXJlc3VsdHMtcm93JyApO1xuXG5cdFx0dmFyIG51bVZpc2libGVJdGVtcyA9IDA7XG5cdFx0aWYgKCBsaXN0LmZpbmQoICcubGlzdC1pdGVtJyApLmxlbmd0aCApIHtcblx0XHRcdGxpc3QuZmluZCggJy5saXN0LWl0ZW0nICkuZWFjaChcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0XHRpZiAodGV4dC5pbmRleE9mKCBzZWFyY2hUZXJtICkgPiAtMSkge1xuXHRcdFx0XHRcdFx0JCggdGhpcyApLnNob3coKTtcblx0XHRcdFx0XHRcdG51bVZpc2libGVJdGVtcysrO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHRcdGlmIChudW1WaXNpYmxlSXRlbXMgPT09IDApIHtcblx0XHRcdFx0bm9SZXN1bHRzUm93LnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vUmVzdWx0c1Jvdy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIHRoaXMgKS52YWwoICcnICk7XG5cdFx0fVxuXHR9XG4pO1xuXG4vKmIub24oXG5cdCdjaGFuZ2UnLFxuXHQnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lciAubGlzdC1pdGVtLWNoZWNrYm94Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdGVkSXRlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKTtcblxuXHRcdGlmICgkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0c2VsZWN0ZWRJdGVtLmFkZENsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlbGVjdGVkSXRlbS5yZW1vdmVDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdH1cblx0fVxuKTtcblxuYi5vbihcblx0J2NoYW5nZScsXG5cdCcud2xmbWMtbW92ZS10by1saXN0LXdyYXBwZXIgLmxpc3QtaXRlbS1jaGVja2JveCcsXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxlY3RlZEl0ZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJy5saXN0LWl0ZW0nICk7XG5cdFx0dmFyIGNoZWNrYm94ZXMgPSAkKHRoaXMpLmNsb3Nlc3QoJy53bGZtYy1tb3ZlLXRvLWxpc3Qtd3JhcHBlcicpLmZpbmQoJ2lucHV0W25hbWU9XCJkZXN0aW5hdGlvbl93aXNobGlzdF9pZFwiXScpO1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLndsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyJykuZmluZCgnLmxpc3QtaXRlbScpLnJlbW92ZUNsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0aWYgKCQoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdGNoZWNrYm94ZXMubm90KCQodGhpcykpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cdFx0fVxuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2hhbmdlJyxcblx0Jy53bGZtYy1jb3B5LXRvLWxpc3Qtd3JhcHBlciAubGlzdC1pdGVtLWNoZWNrYm94Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdGVkSXRlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKTtcblx0XHR2YXIgY2hlY2tib3hlcyA9ICQodGhpcykuY2xvc2VzdCgnLndsZm1jLWNvcHktdG8tbGlzdC13cmFwcGVyJykuZmluZCgnaW5wdXRbbmFtZT1cImRlc3RpbmF0aW9uX3dpc2hsaXN0X2lkXCJdJyk7XG5cdFx0JCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtY29weS10by1saXN0LXdyYXBwZXInKS5maW5kKCcubGlzdC1pdGVtJykucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRpZiAoJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdFx0Y2hlY2tib3hlcy5ub3QoJCh0aGlzKSkucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcblx0XHR9XG5cdH1cbik7Ki9cblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1jcmVhdGUtbmV3LWxpc3QnLFxuXHRmdW5jdGlvbigpIHtcblx0XHR2YXIgcGFyZW50X3BvcHVwID0gJCggJyMnICsgJCggdGhpcyApLmF0dHIoICdkYXRhLXBhcmVudC1wb3B1cC1pZCcgKSApO1xuXHRcdHZhciBjaGlsZF9wb3B1cCAgPSAkKCAnIycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtY2hpbGQtcG9wdXAtaWQnICkgKTtcblxuXHRcdHBhcmVudF9wb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cblx0XHRjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdGNvbG9yOiAnIzMzMycsXG5cdFx0XHR0cmFuc2l0aW9uOiAnYWxsIDAuMXMnLFxuXHRcdFx0aG9yaXpvbnRhbDogY2hpbGRfcG9wdXAuZGF0YSggJ2hvcml6b250YWwnICksXG5cdFx0XHR2ZXJ0aWNhbDogY2hpbGRfcG9wdXAuZGF0YSggJ3ZlcnRpY2FsJyApXG5cdFx0fTtcblxuXHRcdGNoaWxkX3BvcHVwLnBvcHVwKFxuXHRcdFx0e1xuXHRcdFx0XHQuLi5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0b25jbG9zZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cGFyZW50X3BvcHVwLnBvcHVwKCAnc2hvdycgKTtcblx0XHRcdFx0XHRjaGlsZF9wb3B1cC5wb3B1cChcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Li4uZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdFx0XHRcdG9uY2xvc2U6IG51bGxcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGNoaWxkX3BvcHVwLnBvcHVwKCAnc2hvdycgKTtcblxuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXRvZ2dsZS1wcml2YWN5Jyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHJvdyAgICAgICAgID0gZWxlbS5wYXJlbnRzKCAnW2RhdGEtd2lzaGxpc3QtaWRdJyApLFxuXHRcdFx0b2xkX3ByaXZhY3kgPSBwYXJzZUludCggZWxlbS5hdHRyKCAnZGF0YS1wcml2YWN5JyApICksXG5cdFx0XHRuZXdfcHJpdmFjeSA9IDAgPT09IG9sZF9wcml2YWN5ID8gMSA6IDAsXG5cdFx0XHR3aXNobGlzdF9pZCA9IHJvdy5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcgKSxcblx0XHRcdGljb24gICAgICAgID0gZWxlbS5maW5kKCAnaScgKSxcblx0XHRcdGVkaXRfcG9wdXAgID0gJCggJyNlZGl0X3BvcHVwXycgKyB3aXNobGlzdF9pZCApO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ubXVsdGlfbGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmNoYW5nZV9wcml2YWN5X2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogZWxlbS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHQnd2lzaGxpc3RfaWQnIDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0J2xpc3RfcHJpdmFjeScgOiBuZXdfcHJpdmFjeVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRpZiAoICEgZGF0YSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWNvbi5yZW1vdmVDbGFzcyggJ3dsZm1jLWljb24tdW5sb2NrIHdsZm1jLWljb24tbG9jaycgKTtcblx0XHRcdFx0XHRpY29uLmFkZENsYXNzKCBvbGRfcHJpdmFjeSA9PT0gMCA/ICd3bGZtYy1pY29uLWxvY2snIDogJ3dsZm1jLWljb24tdW5sb2NrJyApO1xuXHRcdFx0XHRcdGVkaXRfcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X3ByaXZhY3lcIl1bdmFsdWU9XCInICsgbmV3X3ByaXZhY3kgKyAnXCJdJyApLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHRcdFx0ZWxlbS5hdHRyKCAnZGF0YS1wcml2YWN5JyAsIG5ld19wcml2YWN5ICk7XG5cdFx0XHRcdFx0aWYoIG5ld19wcml2YWN5ID09PSAwICkge1xuXHRcdFx0XHRcdFx0JCgnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cInNoYXJlX3BvcHVwXycgKyB3aXNobGlzdF9pZCArICdcIl0nKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXHRcdFx0XHRcdFx0JCgnLnNoYXJlLXdyYXBwZXInKS5zaG93KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCQoJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJzaGFyZV9wb3B1cF8nICsgd2lzaGxpc3RfaWQgKyAnXCJdJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHRcdFx0XHRcdCQoJy5zaGFyZS13cmFwcGVyJykuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWRlbGV0ZS1saXN0Jyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHdpc2hsaXN0X2lkID0gZWxlbS5kYXRhKCAnd2lzaGxpc3QtaWQnICksXG5cdFx0XHRwb3B1cFx0XHQ9ICQoICcjJyArIGVsZW0uZGF0YSggJ3BvcHVwLWlkJyApICksXG5cdFx0XHRyb3cgICAgICAgICA9ICQoICd1bC53bGZtYy1tYW5hZ2UtbGlzdHMgbGlbZGF0YS13aXNobGlzdC1pZD1cIicgKyB3aXNobGlzdF9pZCArICdcIl0sYS5saXN0LXJvd1tkYXRhLWxpc3QtaWQ9XCInICsgd2lzaGxpc3RfaWQgKyAnXCJdLCAud2xmbWMtZHJvcGRvd24tY29udGVudCBsaVtkYXRhLXdpc2hsaXN0LWlkPVwiJyArIHdpc2hsaXN0X2lkICsgJ1wiXScgKSxcblx0XHRcdHRhYmxlICAgICAgID0gJCgnLndsZm1jLXdpc2hsaXN0LXRhYmxlW2RhdGEtaWQ9XCInICsgd2lzaGxpc3RfaWQgKyAnXCJdJyk7XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuZGVsZXRlX2xpc3RfYWN0aW9uLFxuXHRcdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLWxpc3RzJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdHdpc2hsaXN0X2lkIDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISBkYXRhLnJlc3VsdCApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdHJvdy5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdGlmICgkKCcjd2xmbWNfbXlfbGlzdHNfZHJvcGRvd24gbGknKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0JCgnLndsZm1jLXNlbGVjdC1saXN0LXdyYXBwZXInKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdFx0XHRcdFx0XHQkKCcud2xmbWMtbGlzdC1hY3Rpb25zLXdyYXBwZXIgLndsZm1jLW5ldy1saXN0JykuY3NzKCdkaXNwbGF5JywgJycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCB0YWJsZS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdsZm1jX2wxMG4ubGlzdHNfcGFnZV91cmw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdC8qaWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1zYXZlLWxpc3QnLFxuXHRmdW5jdGlvbihldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGVsZW0gICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgPSBlbGVtLmRhdGEoICd3aXNobGlzdC1pZCcgKSxcblx0XHRcdHJvdyAgICAgICAgID0gJCggJ3VsLndsZm1jLW1hbmFnZS1saXN0cyBsaVtkYXRhLXdpc2hsaXN0LWlkPVwiJyArIHdpc2hsaXN0X2lkICsgJ1wiXSxhLmxpc3Qtcm93W2RhdGEtbGlzdC1pZD1cIicgKyB3aXNobGlzdF9pZCArICdcIl0sIC53bGZtYy1saXN0LWFjdGlvbnMtd3JhcHBlcicgKSxcblx0XHRcdHBvcHVwXHRcdD0gJCggJyMnICsgZWxlbS5kYXRhKCAncG9wdXAtaWQnICkgKSxcblx0XHRcdHByaXZhY3kgXHQ9IHBhcnNlSW50KCBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpdmFjeVwiXTpjaGVja2VkJyApLnZhbCgpICksXG5cdFx0XHRuYW1lIFx0XHQ9IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9uYW1lXCJdJyApLnZhbCgpLFxuXHRcdFx0ZGVzYyBcdFx0PSBwb3B1cC5maW5kKCAndGV4dGFyZWFbbmFtZT1cImxpc3RfZGVzY3JpcHRpb25zXCJdJyApLnZhbCgpLFxuXHRcdFx0aWNvblByaXZhY3kgPSByb3cuZmluZCggJy53bGZtYy10b2dnbGUtcHJpdmFjeSBpJyApO1xuXHRcdGlmICggJycgPT09ICQudHJpbSggbmFtZSApICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5tdWx0aV9saXN0X2xpc3RfbmFtZV9yZXF1aXJlZCApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMudXBkYXRlX2xpc3RfYWN0aW9uLFxuXHRcdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLWxpc3RzJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdHdpc2hsaXN0X2lkIDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0bGlzdF9wcml2YWN5OiBwcml2YWN5LFxuXHRcdFx0XHRcdGxpc3RfbmFtZTpuYW1lLFxuXHRcdFx0XHRcdGxpc3RfZGVzY3JpcHRpb25zOmRlc2MsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISBkYXRhLnJlc3VsdCApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdHJvdy5maW5kKCAnLmxpc3QtbmFtZScgKS50ZXh0KCBuYW1lICk7XG5cdFx0XHRcdFx0XHRyb3cuZmluZCggJy5saXN0LWRlc2MnICkudGV4dCggZGVzYyApO1xuXHRcdFx0XHRcdFx0cm93LmZpbmQoICcud2xmbWMtdG9nZ2xlLXByaXZhY3knICkuYXR0ciggJ2RhdGEtcHJpdmFjeScsIHByaXZhY3kgKTtcblx0XHRcdFx0XHRcdGljb25Qcml2YWN5LnJlbW92ZUNsYXNzKCAnd2xmbWMtaWNvbi11bmxvY2sgd2xmbWMtaWNvbi1sb2NrJyApO1xuXHRcdFx0XHRcdFx0aWNvblByaXZhY3kuYWRkQ2xhc3MoIHByaXZhY3kgPT09IDAgPyAnd2xmbWMtaWNvbi11bmxvY2snIDogJ3dsZm1jLWljb24tbG9jaycgKTtcblx0XHRcdFx0XHRcdGlmKCBwcml2YWN5ID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwic2hhcmVfcG9wdXBfJyArIHdpc2hsaXN0X2lkICsgJ1wiXScpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG5cdFx0XHRcdFx0XHRcdCQoJy5zaGFyZS13cmFwcGVyJykuc2hvdygpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JCgnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cInNoYXJlX3BvcHVwXycgKyB3aXNobGlzdF9pZCArICdcIl0nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdFx0XHRcdFx0XHQkKCcuc2hhcmUtd3JhcHBlcicpLmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSxcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWFkZC1saXN0Jyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgID0gJCggdGhpcyApLFxuXHRcdFx0cG9wdXAgICA9ICQoICcjbmV3X2xpc3RfcG9wdXAnICksXG5cdFx0XHRwcml2YWN5ID0gcGFyc2VJbnQoIHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcml2YWN5XCJdOmNoZWNrZWQnICkudmFsKCkgKSxcblx0XHRcdG5hbWUgICAgPSBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbmFtZVwiXScgKS52YWwoKSxcblx0XHRcdGRlc2MgICAgPSBwb3B1cC5maW5kKCAndGV4dGFyZWFbbmFtZT1cImxpc3RfZGVzY3JpcHRpb25zXCJdJyApLnZhbCgpO1xuXHRcdGlmICggJycgPT09ICQudHJpbSggbmFtZSApICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5tdWx0aV9saXN0X2xpc3RfbmFtZV9yZXF1aXJlZCApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuY3JlYXRlX25ld19saXN0X2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogIGVsZW0uZGF0YSgnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRsaXN0X3ByaXZhY3k6IHByaXZhY3ksXG5cdFx0XHRcdFx0bGlzdF9uYW1lOm5hbWUsXG5cdFx0XHRcdFx0bGlzdF9kZXNjcmlwdGlvbnM6ZGVzYyxcblx0XHRcdFx0XHRmcmFnbWVudHM6ICggJCggJy53aXNobGlzdC1lbXB0eS1yb3cgLndsZm1jLW5ldy1saXN0JykubGVuZ3RoID4gMCApID8gJC5mbi5XTEZNQy5yZXRyaWV2ZV9mcmFnbWVudHMoKSA6ICQuZm4uV0xGTUMucmV0cmlldmVfZnJhZ21lbnRzKCAnbGlzdF9jb3VudGVyJyApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISBkYXRhLnJlc3VsdCApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCQoJy53bGZtYy1saXN0LWFjdGlvbnMtd3JhcHBlciAud2xmbWMtbmV3LWxpc3QnKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbmFtZVwiXScgKS52YWwoJycpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2Rlc2NyaXB0aW9uc1wiXScgKS52YWwoJycpO1xuXHRcdFx0XHRcdFx0cG9wdXAucG9wdXAoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0dmFyIHRlbXBsYXRlID0gd3AudGVtcGxhdGUoICd3bGZtYy1saXN0LWl0ZW0nICk7XG5cdFx0XHRcdFx0XHR2YXIgaHRtbCAgICAgPSB0ZW1wbGF0ZSggZGF0YSApO1xuXHRcdFx0XHRcdFx0aWYgKCAkKCcjbW92ZV9wb3B1cCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cCB1bC5saXN0JyApLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgdWwubGlzdCcgKS5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94W3ZhbHVlPVwiJyArIGRhdGEud2lzaGxpc3RfaWQgKyAnXCJdJykucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgLmxpc3QtZW1wdHknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgLm5vLXJlc3VsdHMtcm93JyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwIC53bGZtYy1zZWFyY2gtbGlzdHMnKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cCAud2xmbWNfbW92ZV90b19saXN0JykuYXR0ciggJ3N0eWxlJywgJycpO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCcjY29weV9wb3B1cCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcjY29weV9wb3B1cCB1bC5saXN0JyApLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgdWwubGlzdCcgKS5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94W3ZhbHVlPVwiJyArIGRhdGEud2lzaGxpc3RfaWQgKyAnXCJdJykucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgLmxpc3QtZW1wdHknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgLm5vLXJlc3VsdHMtcm93JyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNjb3B5X3BvcHVwIC53bGZtYy1zZWFyY2gtbGlzdHMnKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdCQoICcjY29weV9wb3B1cCAud2xmbWNfY29weV90b19saXN0JykuYXR0ciggJ3N0eWxlJywgJycpO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIHVsLmxpc3QnICkuYXBwZW5kKCBodG1sICk7XG5cdFx0XHRcdFx0XHRcdFByZXZMaXN0c1N0YXRlLnB1c2goIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgdWwubGlzdCcgKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5vbignY2hhbmdlJywgV2xmbWNDaGVja2JveExpc3RzQ2hhbmdlKTtcblx0XHRcdFx0XHRcdFx0JCggJyNhZGRfdG9fbGlzdF9wb3B1cCB1bC5saXN0JyApLmZpbmQoICdpbnB1dC5saXN0LWl0ZW0tY2hlY2tib3hbdmFsdWU9XCInICsgZGF0YS53aXNobGlzdF9pZCArICdcIl0nKS5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgLmxpc3QtZW1wdHknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIC5uby1yZXN1bHRzLXJvdycgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgLndsZm1jLXNlYXJjaC1saXN0cycpLmF0dHIoICdzdHlsZScsICcnKTtcblx0XHRcdFx0XHRcdFx0JCggJyNhZGRfdG9fbGlzdF9wb3B1cCAud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgLndsZm1jLW1hbmFnZS1idG4nKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCd3bGZtYy1kcm9wZG93bi1pdGVtJyk7XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdFx0XHRcdFx0XHRpZiAoJCgnI3dsZm1jX215X2xpc3RzX2Ryb3Bkb3duJykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGh0bWwgPSB0ZW1wbGF0ZShkYXRhKTtcblx0XHRcdFx0XHRcdFx0XHQkKCAnI3dsZm1jX215X2xpc3RzX2Ryb3Bkb3duJyApLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtc2VsZWN0LWxpc3Qtd3JhcHBlcicpLnJlbW92ZUNsYXNzKCAnaGlkZScpO1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9kcm9wZG93bl9saXN0cygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmcoKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAkKCcud2xmbWMtbGlzdHMnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmJsb2NrKCAkKCcud2xmbWMtbGlzdHMnKSApO1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxudC5vbihcblx0J3dsZm1jX3Nob3dfdmFyaWF0aW9uJyAsXG5cdGZ1bmN0aW9uIChldiwgZGF0YSkge1xuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSBkYXRhLnByb2R1Y3RfaWQsXG5cdFx0XHR2YXJpYXRpb25faWQgICAgICA9IGRhdGEudmFyaWF0aW9uX2lkLFxuXHRcdFx0dGFyZ2V0cyAgICAgICAgICAgPSAkKCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0IFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApLFxuXHRcdFx0ZW5hYmxlX291dG9mc3RvY2sgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLW11bHRpLWxpc3QnICkuZGF0YSggJ2VuYWJsZS1vdXRvZnN0b2NrJyApO1xuXHRcdGlmICggISBwcm9kdWN0X2lkIHx8ICEgdmFyaWF0aW9uX2lkIHx8ICEgdGFyZ2V0cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCAhIGVuYWJsZV9vdXRvZnN0b2NrICYmICEgZGF0YS5pc19pbl9zdG9jaykge1xuXHRcdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0JyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHR9XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblx0XHRcdH1cblx0XHQpO1xuXHRcdC8vJCggJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXScgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cdFx0JCggJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXVtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApLmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKTtcblx0fVxuKTtcblxudC5vbihcblx0J3Jlc2V0X2RhdGEnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCA9IHQuZGF0YSggJ3Byb2R1Y3RfaWQnICksXG5cdFx0XHR0YXJnZXRzICAgID0gJCggJy53bGZtYy1hZGQtdG8tbXVsdGktbGlzdCBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKTtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHRhcmdldHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblxuXHRcdHRhcmdldHMuZWFjaChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgPSAkKCB0aGlzICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdH1cblx0XHQpO1xuXHRcdC8vJCggJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXScgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdCQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiYWRkX3RvX2xpc3RfcG9wdXBcIl1bZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cIm1vdmVfcG9wdXBcIl0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHBvcHVwXHRcdFx0ICA9ICQoICcjbW92ZV9wb3B1cCcgKSxcblx0XHRcdGl0ZW1faWRzICAgICAgICAgID0gdC5kYXRhKCdpdGVtLWlkJyk7XG5cblx0XHRwb3B1cC5maW5kKCAnLndsZm1jX21vdmVfdG9fbGlzdCcgKS5hdHRyKCAnZGF0YS1pdGVtLWlkcycsIGl0ZW1faWRzICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiY29weV9wb3B1cFwiXScsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNjb3B5X3BvcHVwJyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmRhdGEoJ2l0ZW0taWQnKTtcblxuXHRcdHBvcHVwLmZpbmQoICcud2xmbWNfY29weV90b19saXN0JyApLmF0dHIoICdkYXRhLWl0ZW0taWRzJywgaXRlbV9pZHMgKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJhZGRfdG9fbGlzdF9wb3B1cFwiXScsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHRwYXJlbnRfcHJvZHVjdF9pZCA9IHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnICksXG5cdFx0XHRwcm9kdWN0X3R5cGUgICAgICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0ZXhjbHVkZV9kZWZhdWx0ICAgPSB0LmF0dHIoICdkYXRhLWV4Y2x1ZGUtZGVmYXVsdCcgKSxcblx0XHRcdGNhcnRfaXRlbV9rZXkgICAgID0gdC5hdHRyKCAnZGF0YS1jYXJ0X2l0ZW1fa2V5JyApLFxuXHRcdFx0c2F2ZV9jYXJ0ICAgICAgICAgPSB0LmF0dHIoICdkYXRhLXNhdmUtY2FydCcgKSxcblx0XHRcdHBvcHVwXHRcdFx0ICAgICAgICAgICAgICA9ICQoICcjYWRkX3RvX2xpc3RfcG9wdXAnICksXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMubG9hZF9saXN0c19hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdHByb2R1Y3RfaWQ6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdGV4Y2x1ZGVfZGVmYXVsdDogZXhjbHVkZV9kZWZhdWx0XG5cdFx0XHR9O1xuXG5cdFx0Ly8gQ2hlY2sgaWYgY2FydF9pdGVtX2tleSBpcyBkZWZpbmVkIGJlZm9yZSBhZGRpbmcgaXQgdG8gdGhlIGRhdGEgb2JqZWN0XG5cdFx0aWYgKHR5cGVvZiBjYXJ0X2l0ZW1fa2V5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0ZGF0YS5jYXJ0X2l0ZW1fa2V5ID0gY2FydF9pdGVtX2tleTtcblx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnICkuYXR0ciggJ2RhdGEtY2FydF9pdGVtX2tleScsIGNhcnRfaXRlbV9rZXkgKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHNhdmVfY2FydCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnICkuYXR0ciggJ2RhdGEtc2F2ZS1jYXJ0Jywgc2F2ZV9jYXJ0ICk7XG5cdFx0fVxuXG5cdFx0cG9wdXAuZmluZCggJy53bGZtY19hZGRfdG9fbXVsdGlfbGlzdCcgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnLCBwcm9kdWN0X3R5cGUgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApLmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcGFyZW50X3Byb2R1Y3RfaWQgKTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLm11bHRpX2xpc3RfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmJsb2NrKCBwb3B1cC5maW5kKCAnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lcicgKSApO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmJsb2NrKCBwb3B1cC5maW5kKCAnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lcicgKSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0ZGF0YSAgICAgICAgICAgICA9IHJlc3BvbnNlLmRhdGEsXG5cdFx0XHRcdFx0XHRwcm9kdWN0X2xpc3RzXHQgPSByZXNwb25zZS5wcm9kdWN0X2xpc3RzLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICYmIDAgPCBkYXRhLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdHZhciB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCAnd2xmbWMtbGlzdC1pdGVtJyApO1xuXHRcdFx0XHRcdFx0dmFyIGh0bWwgICAgID0gJyc7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aHRtbCArPSB0ZW1wbGF0ZSggZGF0YVtpXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1zZWFyY2gtbGlzdHMnKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLmxpc3QnICkuaHRtbCggaHRtbCApO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1udW1iZXInICkudGV4dCggcHJvZHVjdF9saXN0cy5sZW5ndGggKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcubGlzdC1lbXB0eScgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JyApLmF0dHIoICdkYXRhLWxpc3QtaWRzJyAsIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2xpc3RzICkgKS5hdHRyKCAnc3R5bGUnLCAnJyApO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1tYW5hZ2UtYnRuJykuYXR0ciggJ3N0eWxlJywgJycpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCgnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdFx0XHRcdC8vIEFkZCBldmVudCB0byBjaGVja2JveCB0byBkaXNhYmxlIHN1Ym1pdCBidXR0b24gaWYgeW91IGRvIG5vdCBjaGFuZ2UgYW55dGhpbmcncy5cblx0XHRcdFx0XHRcdFByZXZMaXN0c1N0YXRlID0gcG9wdXAuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykubWFwKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJCh0aGlzKS5wcm9wKCdjaGVja2VkJyk7XG5cdFx0XHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0XHRcdHBvcHVwLm9uKCdjaGFuZ2UnLCAnLmxpc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgV2xmbWNDaGVja2JveExpc3RzQ2hhbmdlKTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLW1hbmFnZS1idG4nKS5jc3MoICdkaXNwbGF5JywgJ25vbmUgIWltcG9ydGFudCcpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1zZWFyY2gtbGlzdHMnKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLmxpc3QnICkuaHRtbCggJycgKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcubGlzdC1lbXB0eScgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLW51bWJlcicgKS50ZXh0KCAwICk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JykuY3NzKCAnZGlzcGxheScsICdub25lICFpbXBvcnRhbnQnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHRwb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0Y2FydF9pdGVtX2tleSAgICAgPSB0LmF0dHIoICdkYXRhLWNhcnRfaXRlbV9rZXknICksXG5cdFx0XHRzYXZlX2NhcnQgICAgICAgICA9IHQuYXR0ciggJ2RhdGEtc2F2ZS1jYXJ0JyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNhZGRfdG9fbGlzdF9wb3B1cCcgKSxcblx0XHRcdGN1cnJlbnRfbGlzdHMgICAgID0gSlNPTi5wYXJzZSggdC5hdHRyKCAnZGF0YS1saXN0LWlkcycgKSApLFxuXHRcdFx0d2lzaGxpc3RfaWRzICAgICAgPSBwb3B1cC5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94OmNoZWNrZWQnICkubWFwKFxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0KS5nZXQoKSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfcHJvZHVjdF90b19saXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX2xpc3Q6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdHByb2R1Y3RfdHlwZTogdC5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnICksXG5cdFx0XHRcdGN1cnJlbnRfbGlzdHM6IGN1cnJlbnRfbGlzdHMsXG5cdFx0XHRcdHdpc2hsaXN0X2lkczogd2lzaGxpc3RfaWRzLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV9jYXJ0X2l0ZW06IHdsZm1jX2wxMG4ucmVtb3ZlX2Zyb21fY2FydF9pdGVtLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV9jYXJ0X2FsbDogd2xmbWNfbDEwbi5yZW1vdmVfZnJvbV9jYXJ0X2FsbFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKClcblx0XHRcdH07XG5cdFx0aWYgKHR5cGVvZiBjYXJ0X2l0ZW1fa2V5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0ZGF0YS5jYXJ0X2l0ZW1fa2V5ID0gY2FydF9pdGVtX2tleTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBzYXZlX2NhcnQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRkYXRhLnNhdmVfY2FydCA9IHNhdmVfY2FydDtcblx0XHR9XG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2FkZF90b19tdWx0aV9saXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0bGV0IGN1cnJlbnRfcHJvZHVjdF9mb3JtO1xuXG5cdFx0aWYgKCAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCAgKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKS5sZW5ndGggKSB7XG5cblx0XHRcdGxldCBidXR0b24gPSAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCdmb3JtJykuZXEoIDAgKTtcblxuXHRcdH1cblxuXHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdGlmICggIHR5cGVvZiBjdXJyZW50X3Byb2R1Y3RfZm9ybSAhPT0gJ3VuZGVmaW5lZCcgJiYgY3VycmVudF9wcm9kdWN0X2Zvcm0ubGVuZ3RoID4gMCkge1xuXHRcdFx0LypjdXJyZW50X3Byb2R1Y3RfZm9ybS5maW5kKCBcImlucHV0W25hbWU9J2FkZC10by1jYXJ0J11cIiApLmF0dHIoIFwiZGlzYWJsZWRcIix0cnVlICk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybS5maW5kKCBcImlucHV0W25hbWU9J2FkZC10by1jYXJ0J11cIiApLnJlbW92ZUF0dHIoIFwiZGlzYWJsZWRcIiApOyovXG5cdFx0XHRmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSggY3VycmVudF9wcm9kdWN0X2Zvcm0uZ2V0KCAwICkgKTtcblx0XHRcdGZvcm1EYXRhLmRlbGV0ZSggJ2FkZC10by1jYXJ0JyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgYWRkX3RvX2NhcnRfbGluayA9IHQuY2xvc2VzdCggJy5wcm9kdWN0LnBvc3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICkuZmluZCggJy5hZGRfdG9fY2FydF9idXR0b24nICk7XG5cdFx0XHRpZiAoIGFkZF90b19jYXJ0X2xpbmsubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhLnF1YW50aXR5ID0gYWRkX3RvX2NhcnRfbGluay5hdHRyKCAnZGF0YS1xdWFudGl0eScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmVhY2goXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZnVuY3Rpb24oa2V5LHZhbHVlT2JqKXtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXkgLCB0eXBlb2YgdmFsdWVPYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoIHZhbHVlT2JqICkgOiB2YWx1ZU9iaiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ3dsZm1jX2FkZGluZ190b19tdWx0aV9saXN0JyApO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBmb3JtRGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHQvL2RhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcblx0XHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmIChyZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlLnVwZGF0ZV9jYXJ0ICkgKSB7XG5cdFx0XHRcdFx0XHRcdCQoZG9jdW1lbnQpLnRyaWdnZXIoJ3djX3VwZGF0ZV9jYXJ0Jyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiByZXNwb25zZS5leGlzdHMgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UuZXhpc3RzICkgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2UuZXhpc3RzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggd2xmbWNfbDEwbi5sYWJlbHMubXVsdGlfbGlzdF9zYXZlZF90ZXh0ICkgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5tdWx0aV9saXN0X3NhdmVkX3RleHQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggKCByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkICYmIHJlc3BvbnNlLmRlZmF1bHRfd2lzaGxpc3RfaWQgIT09ICdmYWxzZScgKSB8fCAoIHJlc3BvbnNlLmRlZmF1bHRfd2lzaGxpc3RfaWQgJiYgcmVzcG9uc2UubGFzdF9saXN0X2lkICYmICByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkID09PSByZXNwb25zZS5sYXN0X2xpc3RfaWQgKSApIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkLCByZXNwb25zZS5jdXN0b21lcl9pZCwgJ3dpc2hsaXN0JywgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCByZXNwb25zZS5sYXN0X2xpc3RfaWQgJiYgcmVzcG9uc2UubGFzdF9saXN0X2lkICE9PSAnZmFsc2UnICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfYXV0b21hdGlvbnMoIHByb2R1Y3RfaWQsIHJlc3BvbnNlLmxhc3RfbGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsICdsaXN0cycsIHJlc3BvbnNlLmxvYWRfYXV0b21hdGlvbl9ub25jZSApO1xuXHRcdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHRcdC8qaWYgKHR5cGVvZiByZXNwb25zZS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCByZXNwb25zZS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX21vdmVfdG9fbGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWRzJyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNtb3ZlX3BvcHVwJyApLFxuXHRcdFx0Y3VycmVudF9saXN0ICAgICAgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgICAgICA9IHBvcHVwLmZpbmQoICdpbnB1dC5saXN0LWl0ZW0tY2hlY2tib3g6Y2hlY2tlZCcgKS52YWwoKSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246ICB3bGZtY19sMTBuLmFjdGlvbnMubW92ZV90b19hbm90aGVyX2xpc3QsXG5cdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0gdGFibGUud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRpdGVtX2lkczogaXRlbV9pZHMsXG5cdFx0XHRcdGN1cnJlbnRfbGlzdDogY3VycmVudF9saXN0LFxuXHRcdFx0XHRkZXN0aW5hdGlvbl93aXNobGlzdF9pZDogd2lzaGxpc3RfaWQsXG5cdFx0XHR9O1xuXG5cdFx0aWYoIGRhdGEuY3VycmVudF9saXN0ID09PSAnJyB8fCBkYXRhLmRlc3RpbmF0aW9uX3dpc2hsaXN0X2lkID09PSAnJyB8fCBkYXRhLml0ZW1faWRzID09PSAnJyApe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19tb3ZlX3RvX2xpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfbWVzc2FnZSA9IHdsZm1jX2wxMG4ubGFiZWxzLm11bHRpX2xpc3Rfc3VjY2Vzc2Z1bGx5X21vdmVfbWVzc2FnZS5yZXBsYWNlKCAne3dpc2hsaXN0X25hbWV9JywgcmVzcG9uc2Uud2lzaGxpc3RfbmFtZSApO1xuXG5cdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggcmVzcG9uc2VfcmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCcnLCBmdW5jdGlvbihzaG93X3RvYXN0LCByZXNwb25zZV9tZXNzYWdlKXtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwJyApLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwX2JhY2tncm91bmQnICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cF93cmFwcGVyJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZV9tZXNzYWdlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgW3Nob3dfdG9hc3QsIHJlc3BvbnNlX21lc3NhZ2UgXSk7XG5cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlX3Jlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0cG9wdXAucG9wdXAoICdoaWRlJyApO1xuXG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2NvcHlfdG9fbGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWRzJyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0cG9wdXBcdFx0XHQgID0gJCggJyNjb3B5X3BvcHVwJyApLFxuXHRcdFx0Y3VycmVudF9saXN0ICAgICAgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgICAgICA9IHBvcHVwLmZpbmQoICdpbnB1dC5saXN0LWl0ZW0tY2hlY2tib3g6Y2hlY2tlZCcgKS52YWwoKSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246ICB3bGZtY19sMTBuLmFjdGlvbnMuY29weV90b19hbm90aGVyX2xpc3QsXG5cdFx0XHRcdG5vbmNlOiAkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0gdGFibGUud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRpdGVtX2lkczogaXRlbV9pZHMsXG5cdFx0XHRcdGN1cnJlbnRfbGlzdDogY3VycmVudF9saXN0LFxuXHRcdFx0XHR3aXNobGlzdDogd2lzaGxpc3RfaWQsXG5cdFx0XHR9O1xuXG5cdFx0aWYoIGRhdGEuY3VycmVudF9saXN0ID09PSAnJyB8fCBkYXRhLmRlc3RpbmF0aW9uX3dpc2hsaXN0X2lkID09PSAnJyB8fCBkYXRhLml0ZW1faWRzID09PSAnJyApe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19jb3B5X3RvX2xpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfbWVzc2FnZSA9IHdsZm1jX2wxMG4ubGFiZWxzLnN1Y2Nlc3NmdWxseV9jb3B5X21lc3NhZ2UucmVwbGFjZSggJ3t3aXNobGlzdF9uYW1lfScsIHJlc3BvbnNlLndpc2hsaXN0X25hbWUgKTtcblxuXHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlX3Jlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygnJywgZnVuY3Rpb24oc2hvd190b2FzdCwgcmVzcG9uc2VfbWVzc2FnZSl7XG5cdFx0XHRcdFx0XHRcdCQoICcjY29weV9wb3B1cF9iYWNrZ3JvdW5kJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXBfd3JhcHBlcicgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIFtzaG93X3RvYXN0LCByZXNwb25zZV9tZXNzYWdlIF0pO1xuXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZV9yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19jb3B5X3RvX2RlZmF1bHRfbGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZHMgICAgICAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWQnICksXG5cdFx0XHRmaWx0ZXJlZF9kYXRhICAgICA9IG51bGwsXG5cdFx0XHRjdXJyZW50X2xpc3QgICAgICA9IHQuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnICksXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiAgd2xmbWNfbDEwbi5hY3Rpb25zLmNvcHlfdG9fYW5vdGhlcl9saXN0LFxuXHRcdFx0XHRub25jZTogJCggJyN3bGZtYy13aXNobGlzdC1mb3JtIHRhYmxlLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0aXRlbV9pZHM6IGl0ZW1faWRzLFxuXHRcdFx0XHR3aXNobGlzdDogJ2RlZmF1bHQnLFxuXHRcdFx0XHRjdXJyZW50X2xpc3Q6IGN1cnJlbnRfbGlzdCxcblx0XHRcdH07XG5cblx0XHRpZiggZGF0YS5jdXJyZW50X2xpc3QgPT09ICcnIHx8IGRhdGEuaXRlbV9pZHMgPT09ICcnICl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2NvcHlfdG9fZGVmYXVsdF9saXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX21lc3NhZ2UgPSB3bGZtY19sMTBuLmxhYmVscy5zdWNjZXNzZnVsbHlfY29weV9tZXNzYWdlLnJlcGxhY2UoICd7d2lzaGxpc3RfbmFtZX0nLCByZXNwb25zZS53aXNobGlzdF9uYW1lICk7XG5cblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZV9yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoICdsaXN0X2NvdW50ZXInICk7XG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZV9tZXNzYWdlICkgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISAkLmZuLldMRk1DLmlzVHJ1ZSggcmVzcG9uc2VfcmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLW11bHRpLWxpc3QtYnRuLWxvZ2luLW5lZWQnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMubXVsdGlfbGlzdF9sb2dpbl9uZWVkICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5cbmZ1bmN0aW9uIFdsZm1jQ2hlY2tib3hMaXN0c0NoYW5nZSgpIHtcblx0bGV0IHBvcHVwID0gJCggJyNhZGRfdG9fbGlzdF9wb3B1cCcgKTtcblx0Y29uc3Qgc3VibWl0QnRuID0gcG9wdXAuZmluZCgnLndsZm1jX2FkZF90b19tdWx0aV9saXN0Jyk7XG5cdGNvbnN0IGNoZWNrYm94ZXMgPSBwb3B1cC5maW5kKCcubGlzdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblx0Y29uc3QgaGFzQ2hhbmdlZCA9IGNoZWNrYm94ZXMudG9BcnJheSgpLnNvbWUoKGNiLCBpbmRleCkgPT4gJChjYikucHJvcCgnY2hlY2tlZCcpICE9PSBQcmV2TGlzdHNTdGF0ZVtpbmRleF0pO1xuXHRzdWJtaXRCdG4ucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0aWYgKGhhc0NoYW5nZWQpIHtcblx0XHRzdWJtaXRCdG4ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdH1cbn1cbjtcblx0XHRcdFx0LyogPT09IFNBVkUgRk9SIExBVEVSID09PSAqL1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWxpc3QgLnJlbW92ZS1hbGwtZnJvbS1zYXZlLWZvci1sYXRlci1idG4nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRsZXQgcXVhbnRpdHlfZmllbGRzID0gJCggdGhpcyApLmNsb3Nlc3QoJ2Zvcm0nKS5maW5kKCdpbnB1dC5xdHknKTtcblx0XHRpZiAoIHF1YW50aXR5X2ZpZWxkcy5sZW5ndGggPiAwICkge1xuXHRcdFx0cXVhbnRpdHlfZmllbGRzLmF0dHIoIFwiZGlzYWJsZWRcIix0cnVlICk7XG5cdFx0fVxuXHR9XG4pO1xuXG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfYWRkX3RvX3NhdmVfZm9yX2xhdGVyJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgdCAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGNhcnRfaXRlbV9rZXkgPSB0LmF0dHIoICdkYXRhLWNhcnRfaXRlbV9rZXknICk7XG5cdFx0JC5mbi5XTEZNQy5hZGRfdG9fc2F2ZV9mb3JfbGF0ZXIoIGNhcnRfaXRlbV9rZXksIHQgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfcmVtb3ZlX2Zyb21fc2F2ZV9mb3JfbGF0ZXInLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIHQgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHJvdyAgICAgICAgICA9IHQucGFyZW50cyggJ1tkYXRhLWl0ZW0taWRdJyApLFxuXHRcdFx0ZGF0YV9pdGVtX2lkID0gcm93LmRhdGEoICdpdGVtLWlkJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5yZW1vdmVfZnJvbV9zYXZlX2Zvcl9sYXRlcl9hY3Rpb24sXG5cdFx0XHRcdG5vbmNlOiB3bGZtY19sMTBuLmFqYXhfbm9uY2UucmVtb3ZlX2Zyb21fc2F2ZV9mb3JfbGF0ZXJfbm9uY2UsXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdHJlbW92ZV9mcm9tX3NhdmVfZm9yX2xhdGVyOiBkYXRhX2l0ZW1faWQsXG5cdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoKVxuXHRcdFx0fTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLnNhdmVfZm9yX2xhdGVyX2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRpZiAoICEgZGF0YSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdC8qaWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0aWYgKCBkYXRhLmNvdW50ICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmF0dHIoICdkYXRhLWNvdW50JywgZGF0YS5jb3VudCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggJ3RydWUnID09PSBkYXRhLnJlc3VsdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfcHJvZHVjdF9yZW1vdmVkX3RleHQgKSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfcHJvZHVjdF9yZW1vdmVkX3RleHQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIGRhdGEuY291bnQgIT09ICd1bmRlZmluZWQnICYmIDAgPT09IGRhdGEuY291bnQgKSB7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblxuXHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fc2F2ZV9mb3JfbGF0ZXInLCBbdCwgcm93ICwgZGF0YV0gKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfc2F2ZV9mb3JfbGF0ZXJfYWpheF9hZGRfdG9fY2FydCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZCA9IHQuYXR0ciggJ2RhdGEtaXRlbV9pZCcgKSxcblx0XHRcdGRhdGEgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnNhdmVfZm9yX2xhdGVyX2FkZF90b19jYXJ0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHdsZm1jX2wxMG4uYWpheF9ub25jZS5hZGRfdG9fY2FydF9mcm9tX3NmbF9ub25jZSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0aXRlbV9pZDogaXRlbV9pZCxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0XHR9O1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR0LnJlbW92ZUNsYXNzKCAnYWRkZWQnICk7XG5cdFx0dC5hZGRDbGFzcyggJ2xvYWRpbmcnICk7XG5cblx0XHQvLyBBbGxvdyAzcmQgcGFydGllcyB0byB2YWxpZGF0ZSBhbmQgcXVpdCBlYXJseS5cblx0XHRpZiAoIGZhbHNlID09PSAkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlckhhbmRsZXIoICdzaG91bGRfc2VuZF9hamF4X3JlcXVlc3QuYWRkaW5nX3RvX2NhcnQnLCBbIHQgXSApICkge1xuXHRcdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhamF4X3JlcXVlc3Rfbm90X3NlbnQuYWRkaW5nX3RvX2NhcnQnLCBbIGZhbHNlLCBmYWxzZSwgdCBdICk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhZGRpbmdfdG9fY2FydCcsIFsgdCwge30gXSApO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uc2F2ZV9mb3JfbGF0ZXJfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHQvL2RhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGlmICggISByZXNwb25zZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIHJlc3BvbnNlLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVwbGFjZV9mcmFnbWVudHMoIHJlc3BvbnNlLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UuZXJyb3IgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlLmVycm9yICk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISAkKCAnZm9ybS53b29jb21tZXJjZS1jYXJ0LWZvcm0nICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlc3BvbnNlLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzcG9uc2UuZnJhZ21lbnRzLndsZm1jX3NhdmVfZm9yX2xhdGVyX2NvdW50ICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy10YWJzLXdyYXBwZXInICkuYXR0ciggJ2RhdGEtY291bnQnLCByZXNwb25zZS5mcmFnbWVudHMud2xmbWNfc2F2ZV9mb3JfbGF0ZXJfY291bnQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCd3Y19mcmFnbWVudF9yZWZyZXNoJyk7XG5cdFx0XHRcdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IHNvIHRoZW1lcyBjYW4gcmVmcmVzaCBvdGhlciBhcmVhcy5cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkZWRfdG9fY2FydCcsIFsgcmVzcG9uc2UuZnJhZ21lbnRzLCByZXNwb25zZS5jYXJ0X2hhc2gsIHQgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnI2FkZF90b19zYXZlX2Zvcl9sYXRlcl9wb3B1cCAjYWRkX2l0ZW0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcjYWRkX3RvX3NhdmVfZm9yX2xhdGVyX3BvcHVwJyApLnBvcHVwKCAnaGlkZScgKTtcblx0XHR2YXIgY2FydF9pdGVtX2tleSA9ICQuZm4uV0xGTUMuZ2V0VXJsUGFyYW1ldGVyKCByZW1vdmVfaXRlbV91cmwsICdyZW1vdmVfaXRlbScgKTtcblx0XHR2YXIgcm93ICAgICAgICAgICA9ICQoICdhW2hyZWY9XCInICsgcmVtb3ZlX2l0ZW1fdXJsICsgJ1wiXScgKS5jbG9zZXN0KCAndHInICk7XG5cdFx0JC5mbi5XTEZNQy5hZGRfdG9fc2F2ZV9mb3JfbGF0ZXIoIGNhcnRfaXRlbV9rZXksIHJvdyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuYi5vbihcblx0J2NsaWNrJyxcblx0JyNhZGRfdG9fc2F2ZV9mb3JfbGF0ZXJfcG9wdXAgI3JlbW92ZV9pdGVtJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnI2FkZF90b19zYXZlX2Zvcl9sYXRlcl9wb3B1cCcgKS5wb3B1cCggJ2hpZGUnICk7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSByZW1vdmVfaXRlbV91cmw7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXNmbC1idG4tbG9naW4tbmVlZCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfbG9naW5fbmVlZCApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuLyogPT09IEFDQ09SRElPTiA9PT0gKi9cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtYWNjb3JkaW9uLWhlYWRlcicsXG5cdGZ1bmN0aW9uKCBldiApIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmICggISAkKCB0aGlzICkuaGFzQ2xhc3MoICdhY3RpdmUnICkgKSB7XG5cdFx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdCQoIHRoaXMgKS5uZXh0KCBcIi53bGZtYy1hY2NvcmRpb24tcGFuZWxcIiApLnNsaWRlRG93bigpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0JCggdGhpcyApLm5leHQoIFwiLndsZm1jLWFjY29yZGlvbi1wYW5lbFwiICkuc2xpZGVVcCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbi8qID09PSBDTE9TRSBOT1RJQ0UgPT09ICovXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXNhdmUtZm9yLWxhdGVyLWZvcm0gYS53bGZtYy1jbG9zZS1ub3RpY2UnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdCQuZm4uV0xGTUMuc2V0Q29va2llKCAnd2xmbWNfc2F2ZV9mb3JfbGF0ZXJfbm90aWNlJywgdHJ1ZSApO1xuXG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtbm90aWNlLXdyYXBwZXInICkuYW5pbWF0ZSgge29wYWNpdHk6MCB9LCBcInNsb3dcIiApLnJlbW92ZSgpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuO1xuXHRcdFx0XHRcblxudC5vbihcblx0J2FkZGluZ190b19jYXJ0Jyxcblx0J2JvZHknLFxuXHRmdW5jdGlvbiAoZXYsIGJ1dHRvbiwgZGF0YSkge1xuXHRcdGlmICh0eXBlb2YgYnV0dG9uICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmxlbmd0aCkge1xuXHRcdFx0ZGF0YS53aXNobGlzdF9pZCAgID0gYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmRhdGEoICdpZCcgKTtcblx0XHRcdGRhdGEud2lzaGxpc3RfdHlwZSA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnd2lzaGxpc3QtdHlwZScgKTtcblx0XHRcdGRhdGEuY3VzdG9tZXJfaWQgICA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnY3VzdG9tZXItaWQnICk7XG5cdFx0XHRkYXRhLmlzX293bmVyICAgICAgPSBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZGF0YSggJ2lzLW93bmVyJyApO1xuXHRcdFx0dHlwZW9mIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKCB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSB3bGZtY19sMTBuLnJlZGlyZWN0X3RvX2NhcnQgKTtcblxuXHRcdFx0LypsZXQgcHJvZHVjdF9tZXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gYnV0dG9uLmRhdGEoICd3bGZtY19wcm9kdWN0X21ldGEnICk7XG5cdFx0XHRpZiAocHJvZHVjdF9tZXRhKSB7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X21ldGEsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGssdmFsdWUpIHtcblx0XHRcdFx0XHRcdGRhdGFba10gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGRhdGEud2xmbWNfcHJvZHVjdF9tZXRhID0gdHJ1ZTtcblx0XHRcdH0qL1xuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2FkZGVkX3RvX2NhcnQnLFxuXHQnYm9keScsXG5cdGZ1bmN0aW9uIChldiwgZnJhZ21lbnRzLCBjYXJ0aGFzaCwgYnV0dG9uKSB7XG5cdFx0aWYgKHR5cGVvZiBidXR0b24gIT09ICd1bmRlZmluZWQnICYmIGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmxlbmd0aCkge1xuXHRcdFx0dHlwZW9mIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKCB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSBjYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCApO1xuXG5cdFx0XHR2YXIgdHIgICAgIFx0XHQgICA9IGJ1dHRvbi5jbG9zZXN0KCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdFx0dGFibGUgIFx0XHQgICA9IHRyLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICksXG5cdFx0XHRcdG9wdGlvbnNcdFx0ICAgPSB0YWJsZS5kYXRhKCAnZnJhZ21lbnQtb3B0aW9ucycgKSxcblx0XHRcdFx0ZGF0YV9yb3dfaWQgICAgPSB0ci5kYXRhKCAncm93LWlkJyApLFxuXHRcdFx0XHR3aXNobGlzdF9pZCAgICA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ2lkJyApLFxuXHRcdFx0XHR3aXNobGlzdF90b2tlbiA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ3Rva2VuJyApLFxuXHRcdFx0XHRsaXN0X3R5cGUgICAgICA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ3dpc2hsaXN0LXR5cGUnICksXG5cdFx0XHRcdHJlbG9hZF9mcmFnbWVudCA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHRcdHRyLmZpbmQoICcuYWRkZWRfdG9fY2FydCcgKS5yZW1vdmUoKTtcblx0XHRcdGlmICh3bGZtY19sMTBuLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FmdGVyX2FkZF90b19jYXJ0ICYmIG9wdGlvbnMuaXNfdXNlcl9vd25lcikge1xuXG5cdFx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIGRhdGFfcm93X2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblxuXHRcdFx0XHRpZiAoICd3aXNobGlzdCcgPT09IGxpc3RfdHlwZSApIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHR2YXIgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fbGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3RbaV0ud2lzaGxpc3RfaWQgPT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl9saXN0W2ldLnByb2R1Y3RfaWQgPT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIGRhdGFfcm93X2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyIC5wcm9kdWN0cy1jb3VudGVyLW51bWJlcicgKS50ZXh0KCBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2lzaGxpc3QgLnRvdGFsLXByb2R1Y3RzIC53bGZtYy10b3RhbC1jb3VudCcgKS50ZXh0KCBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRpZiAoKCAhIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggfHwgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCA9PT0gMCB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13aXNobGlzdC10YWJsZS13cmFwcGVyJyApLmVtcHR5KCk7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVsb2FkX2ZyYWdtZW50ID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoICd3YWl0bGlzdCcgPT09IGxpc3RfdHlwZSApIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdGxldCBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3dhaXRsaXN0X2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX3dhaXRsaXN0ICkgKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgZGF0YV9yb3dfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXIgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdC53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cblx0XHRcdFx0XHRcdGlmICggKCAhIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoIHx8IHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoID09PSAwIHx8ICEgdGFibGUuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkubGVuZ3RoKSkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZWxvYWRfZnJhZ21lbnQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggJ2xpc3RzJyA9PT0gbGlzdF90eXBlICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMucmVsb2FkX2ZyYWdtZW50ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcmVsb2FkX2ZyYWdtZW50ICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYnV0dG9uICE9PSAndW5kZWZpbmVkJyAmJiBidXR0b24uY2xvc2VzdCggJy53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5sZW5ndGgpIHtcblx0XHRcdHZhciB0ciAgICAgICAgICAgPSBidXR0b24uY2xvc2VzdCggJ1tkYXRhLWl0ZW0taWRdJyApLFxuXHRcdFx0XHR0YWJsZSAgICAgICAgPSB0ci5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApLFxuXHRcdFx0XHRvcHRpb25zICAgICAgPSB0YWJsZS5kYXRhKCAnZnJhZ21lbnQtb3B0aW9ucycgKSxcblx0XHRcdFx0ZGF0YV9pdGVtX2lkID0gdHIuZGF0YSggJ2l0ZW0taWQnICk7XG5cdFx0XHRidXR0b24ucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHRcdHRyLmZpbmQoICcuYWRkZWRfdG9fY2FydCcgKS5yZW1vdmUoKTtcblx0XHRcdGlmICggb3B0aW9ucy5pc191c2VyX293bmVyKSB7XG5cdFx0XHRcdCQoICcud2xmbWMtc2F2ZS1mb3ItbGF0ZXItZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoICEgJCggJy53bGZtYy1zYXZlLWZvci1sYXRlci1pdGVtcy13cmFwcGVyIC5zYXZlLWZvci1sYXRlci1pdGVtcy13cmFwcGVyIHRyJyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2FkZF90b19jYXJ0X21lc3NhZ2UnLFxuXHQnYm9keScsXG5cdGZ1bmN0aW9uICggZSwgbWVzc2FnZSwgdCApIHtcblx0XHR2YXIgd3JhcHBlciA9ICQoICcud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyIC53b29jb21tZXJjZS1lcnJvciwud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyIC53b29jb21tZXJjZS1tZXNzYWdlJyApO1xuXG5cdFx0dC5yZW1vdmVDbGFzcyggJ2xvYWRpbmcnICk7XG5cdFx0aWYgKHdyYXBwZXIubGVuZ3RoID09PSAwKSB7XG5cdFx0XHQkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkucHJlcGVuZCggbWVzc2FnZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3cmFwcGVyLmZhZGVPdXQoXG5cdFx0XHRcdDMwMCxcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCcud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyJykucmVwbGFjZVdpdGgoIG1lc3NhZ2UgKS5mYWRlSW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbik7XG5cbnQub24oICdjYXJ0X3BhZ2VfcmVmcmVzaGVkJywgJ2JvZHknLCAkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCApO1xuO1xuXHRcdFx0XHQvKiA9PT0gRFJPUERPV04gQ09VTlRFUiA9PT0gKi9cblxuaWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCkpIHtcblx0dmFyIHdsZm1jX3N3aXBlX3RyaWdnZXI7XG5cdGIub24oXG5cdFx0J3RvdWNoc3RhcnQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3Zlciwud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljaycsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdHdsZm1jX3N3aXBlX3RyaWdnZXIgPSBmYWxzZTtcblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2htb3ZlJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIsLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2snLFxuXHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR3bGZtY19zd2lwZV90cmlnZ2VyID0gdHJ1ZTtcblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2hlbmQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24sLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2sgIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBlbGVtID0gJCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtY291bnRlci13cmFwcGVyJyk7XG5cdFx0XHRpZiAoZWxlbS5oYXNDbGFzcyggJ3dsZm1jLWZpcnN0LXRvdWNoJyApKSB7XG5cdFx0XHRcdGlmICggISB3bGZtY19zd2lwZV90cmlnZ2VyKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5oaWRlX21pbmlfd2lzaGxpc3QuY2FsbCggJCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICksIGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkLmZuLldMRk1DLnNob3dfbWluaV93aXNobGlzdC5jYWxsKCB0aGlzLCBlICk7XG5cdFx0XHRcdGVsZW0uYWRkQ2xhc3MoICd3bGZtYy1maXJzdC10b3VjaCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2hlbmQnLFxuXHRcdCc6bm90KC53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyKTpub3QoLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2spJyxcblx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKCQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMuaGlkZV9taW5pX3dpc2hsaXN0LmNhbGwoICQoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLCBlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXHQvLyBmaXggdXJsIGluIGRyb3Bkb3duIGluIGlwaG9uZSBkZXZpY2VzXG5cdGIub24oXG5cdFx0J3RvdWNoZW5kJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24gYTpub3QoLnJlbW92ZV9mcm9tX3dpc2hsaXN0KScsXG5cdFx0ZnVuY3Rpb24oZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xufSBlbHNlIHtcblx0Yi5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdFx0JC5mbi5XTEZNQy5hcHBlbmR0b0JvZHkoIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkgKTtcblx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cdFx0XHRlbGVtLnRvZ2dsZUNsYXNzKCAnbGlzdHMtc2hvdycgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cblx0dC5vbihcblx0XHRcImNsaWNrXCIsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoXCIud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd25cIik7XG5cdFx0XHRpZiAoJHRyaWdnZXIgIT09IGV2LnRhcmdldCAmJiAhICR0cmlnZ2VyLmhhcyggZXYudGFyZ2V0ICkubGVuZ3RoKSB7XG5cdFx0XHRcdCQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKS5yZW1vdmVDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQnbW91c2VvdmVyJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXItZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcblx0Yi5vbihcblx0XHQnbW91c2VvdXQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXHRiLm9uKFxuXHRcdCdtb3VzZW92ZXInLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdFx0JCggZWxlbSApLmFkZENsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0JC5mbi5XTEZNQy5hcHBlbmR0b0JvZHkoIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkgKTtcblx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cdGIub24oXG5cdFx0J21vdXNlb3V0Jyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBlbGVtID0gJCggJy5kcm9wZG93bl8nICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWlkJyApICk7XG5cdFx0XHQkKCBlbGVtICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXG5cdCQoICcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nICkuaG92ZXJJbnRlbnQoXG5cdFx0e1xuXHRcdFx0aW50ZXJ2YWw6IDAsXG5cdFx0XHR0aW1lb3V0OiAxMDAsXG5cdFx0XHRvdmVyOiAkLmZuLldMRk1DLnNob3dfbWluaV93aXNobGlzdCxcblx0XHRcdG91dDogJC5mbi5XTEZNQy5oaWRlX21pbmlfd2lzaGxpc3Rcblx0XHR9XG5cdCk7XG59XG47XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3ByZXBhcmVfcXR5X2xpbmtzKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3dpc2hsaXN0X3BvcHVwKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3F1YW50aXR5KCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NvcHlfd2lzaGxpc3RfbGluaygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF90b29sdGlwKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NvbXBvbmVudHMoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcG9wdXBzKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2xheW91dCgpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9kcmFnX25fZHJvcCgpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9wb3B1cF9jaGVja2JveF9oYW5kbGluZygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9kcm9wZG93bl9saXN0cygpO1xuXHRcdFx0fVxuXHRcdCkudHJpZ2dlciggJ3dsZm1jX2luaXQnICk7XG5cblx0XHQvLyBmaXggd2l0aCBqZXQgd29vIGJ1aWxkZXIgcGx1Z2luLlxuXG4kKCBkb2N1bWVudCApXG5cdC5vbiggJ2pldC1maWx0ZXItY29udGVudC1yZW5kZXJlZCcsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jIClcblx0Lm9uKCAnamV0LXdvby1idWlsZGVyLWNvbnRlbnQtcmVuZGVyZWQnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApXG5cdC5vbiggJ2pldC1lbmdpbmUvbGlzdGluZy1ncmlkL2FmdGVyLWxvYWQtbW9yZScsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jIClcblx0Lm9uKCAnamV0LWVuZ2luZS9saXN0aW5nLWdyaWQvYWZ0ZXItbGF6eS1sb2FkJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKVxuXHQub24oICdqZXQtY3ctbG9hZGVkJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKTtcbi8vIGxvYWQgZnJhZ21lbnQgZm9yIGZpeCBmaWx0ZXIgZXZlcnl0aGluZyBhamF4IHJlc3BvbnNlLlxuJCggZG9jdW1lbnQgKS5yZWFkeSggJC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cyApO1xuLy8gbG9hZCBmcmFnbWVudCBmb3IgZml4IGJ1ZyB3aXRoIGFqYXggZmlsdGVyIERlc3RpbnkgRWxlbWVudHMgcGx1Z2luXG4kKCBkb2N1bWVudCApLm9uKCAnZGVDb250ZW50TG9hZGVkJyAsICQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMgKTtcbi8vIGZpeCB3YWl0bGlzdCBwb3B1cCBhZnRlciB3cGMgY29tcG9zaXRlIHByb2R1Y3QgZ2FsbGVyeSBsb2FkZWQgaW4gc2luZ2xlIHByb2R1Y3QgcGFnZVxuJCggZG9jdW1lbnQgKS5vbiggJ3dvb2NvX2dhbGxlcnlfbG9hZGVkJywgZnVuY3Rpb24oIGUsIHByb2R1Y3RfaWQgKSB7XG5cdGlmICggcHJvZHVjdF9pZCApIHtcblx0XHQkKCcqW2lkXj1cImFkZF90b193YWl0bGlzdF9wb3B1cF8nICsgcHJvZHVjdF9pZCArICdfXCJdLnBvcHVwX3dyYXBwZXInKS5yZW1vdmUoKTtcblx0fVxufSk7XG47XG5cblx0XHRcbnZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuXHRmdW5jdGlvbihtdXRhdGlvbnMpIHtcblx0XHRtdXRhdGlvbnMuZm9yRWFjaChcblx0XHRcdGZ1bmN0aW9uKG11dGF0aW9uKSB7XG5cdFx0XHRcdGlmICggJCggJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnlfX3dyYXBwZXIgLndsZm1jLXRvcC1vZi1pbWFnZScgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9maXhfb25faW1hZ2Vfc2luZ2xlX3Bvc2l0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZml4IHRvcCBvZiBpbWFnZSBmb3IgcG93ZXItcGFjayBzaW5nbGUgcHJvZHVjdC5cblx0XHRcdFx0aWYgKCAkKCAnLnBwLXNpbmdsZS1wcm9kdWN0IC5lbnRyeS1zdW1tYXJ5ID4gLndsZm1jLXRvcC1vZi1pbWFnZScgKS5sZW5ndGggPiAwICYmICQoICcucHAtc2luZ2xlLXByb2R1Y3QgLmVudHJ5LXN1bW1hcnkgLnNpbmdsZS1wcm9kdWN0LWltYWdlJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0JCggJy5wcC1zaW5nbGUtcHJvZHVjdCcgKS5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHZhciAkd2xmbWNUb3BPZkltYWdlICAgID0gJCggdGhpcyApLmZpbmQoICcud2xmbWMtdG9wLW9mLWltYWdlJyApO1xuXHRcdFx0XHRcdFx0XHR2YXIgJHNpbmdsZVByb2R1Y3RJbWFnZSA9ICQoIHRoaXMgKS5maW5kKCAnLnNpbmdsZS1wcm9kdWN0LWltYWdlJyApO1xuXHRcdFx0XHRcdFx0XHRpZiAoICR3bGZtY1RvcE9mSW1hZ2UubGVuZ3RoID4gMCAmJiAkc2luZ2xlUHJvZHVjdEltYWdlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHQkd2xmbWNUb3BPZkltYWdlLmFwcGVuZFRvKCAkc2luZ2xlUHJvZHVjdEltYWdlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuKTtcbm9ic2VydmVyLm9ic2VydmUoICQoICdib2R5JyApWzBdLCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9ICk7XG47XG5cblx0XHQvKiA9PT0gRFJPUERPV04gQ09VTlRFUiA9PT0gKi9cblxuJCggd2luZG93ICkub24oXG5cdFwic2Nyb2xsIHJlc2l6ZVwiLFxuXHRmdW5jdGlvbigpIHtcblx0XHQkKCBcIi53bGZtYy1jb3VudGVyLWRyb3Bkb3duXCIgKS5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCAkKCB0aGlzICkgKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG4pO1xuO1xuXG5cdFx0LyogU3RvcmFnZSBIYW5kbGluZyAqL1xuXG52YXIgJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgPSB0cnVlLFxuXHR3aXNobGlzdF9oYXNoX2tleSAgICAgICA9IHdsZm1jX2wxMG4ud2lzaGxpc3RfaGFzaF9rZXksXG5cdHByb2R1Y3RzX2hhc2hfa2V5IFx0XHQ9IHdpc2hsaXN0X2hhc2hfa2V5ICsgJ19wcm9kdWN0cycsXG5cdHdhaXRsaXN0X2hhc2hfa2V5IFx0XHQ9IHdpc2hsaXN0X2hhc2hfa2V5ICsgJ193YWl0bGlzdCcsXG5cdGxhbmdfaGFzaF9rZXlcdFx0XHQ9IHdpc2hsaXN0X2hhc2hfa2V5ICsgJ19sYW5nJztcblxudHJ5IHtcblx0JHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgPSAoICdzZXNzaW9uU3RvcmFnZScgaW4gd2luZG93ICYmIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSAhPT0gbnVsbCApO1xuXHR3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggJ3dsZm1jJywgJ3Rlc3QnICk7XG5cdHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCAnd2xmbWMnICk7XG5cdHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSggJ3dsZm1jJywgJ3Rlc3QnICk7XG5cdHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSggJ3dsZm1jJyApO1xufSBjYXRjaCAoIGVyciApIHtcblx0JHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgPSBmYWxzZTtcbn1cblxuaWYgKCB3bGZtY19sMTBuLmlzX2NhY2hlX2VuYWJsZWQgJiYgd2xmbWNfbDEwbi5pc19wYWdlX2NhY2hlX2VuYWJsZWQgKSB7XG5cdCQuZm4uV0xGTUMudGFibGVfYmxvY2soKTtcbn1cblxuLyogV2lzaGxpc3QgSGFuZGxpbmcgKi9cbmlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cblx0Ly8gUmVmcmVzaCB3aGVuIHN0b3JhZ2UgY2hhbmdlcyBpbiBhbm90aGVyIHRhYi5cblx0JCggd2luZG93ICkub24oXG5cdFx0J3N0b3JhZ2Ugb25zdG9yYWdlJyxcblx0XHRmdW5jdGlvbiAoIGUgKSB7XG5cdFx0XHRpZiAoICggcHJvZHVjdHNfaGFzaF9rZXkgPT09IGUub3JpZ2luYWxFdmVudC5rZXkgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICkgIT09IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICkgKSB8fFxuXHRcdFx0XHQoIHdhaXRsaXN0X2hhc2hfa2V5ID09PSBlLm9yaWdpbmFsRXZlbnQua2V5ICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCB3YWl0bGlzdF9oYXNoX2tleSApICE9PSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCB3YWl0bGlzdF9oYXNoX2tleSApICkgKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Ly8gUmVmcmVzaCB3aGVuIHBhZ2UgaXMgc2hvd24gYWZ0ZXIgYmFjayBidXR0b24gKHNhZmFyaSkuXG5cdCQoIHdpbmRvdyApLm9uKFxuXHRcdCdwYWdlc2hvdycgLFxuXHRcdGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0aWYgKCBlLm9yaWdpbmFsRXZlbnQucGVyc2lzdGVkICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdHRyeSB7XG5cblx0XHRpZiAoIHdsZm1jX2wxMG4uaXNfY2FjaGVfZW5hYmxlZCApIHtcblx0XHRcdHRocm93ICdOZWVkIFVwZGF0ZSB3aXNobGlzdCBkYXRhJztcblx0XHR9XG5cdFx0aWYgKCB3bGZtY19sMTBuLnVwZGF0ZV93aXNobGlzdHNfZGF0YSB8fCAoIG51bGwgIT09IGxhbmcgJiYgbGFuZyAhPT0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oIGxhbmdfaGFzaF9rZXkgKSApIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICE9PSBKU09OLnN0cmluZ2lmeSggd2lzaGxpc3RfaXRlbXMgKSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgKSAhPT0gSlNPTi5zdHJpbmdpZnkoIHdhaXRsaXN0X2l0ZW1zICkgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXksICcnICk7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXksICcnICk7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSwgJycgKTtcblx0XHRcdCQuZm4uV0xGTUMuY2hlY2tfcHJvZHVjdHMoIHdpc2hsaXN0X2l0ZW1zICk7XG5cdFx0XHQkLmZuLldMRk1DLmNoZWNrX3dhaXRsaXN0X3Byb2R1Y3RzKCB3YWl0bGlzdF9pdGVtcyApO1xuXHRcdFx0dGhyb3cgJ05lZWQgVXBkYXRlIHdpc2hsaXN0IGRhdGEnO1xuXHRcdH1cblxuXHRcdGlmICggbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICkgKSB7XG5cdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICk7XG5cdFx0XHRpZiAoJ29iamVjdCcgPT09IF90eXBlb2YoIGRhdGEgKSAmJiBudWxsICE9PSBkYXRhICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmNoZWNrX3Byb2R1Y3RzKCBkYXRhICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgKSApIHtcblx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5ICkgKTtcblx0XHRcdGlmICgnb2JqZWN0JyA9PT0gX3R5cGVvZiggZGF0YSApICYmIG51bGwgIT09IGRhdGEgKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfcHJvZHVjdHMoIGRhdGEgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmZuLldMRk1DLnVuYmxvY2soICQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUtd3JhcHBlciwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkgKTtcblxuXHRcdCQoICcjd2xmbWMtbGlzdHMsI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkuYWRkQ2xhc3MoICdvbi1maXJzdC1sb2FkJyApO1xuXG5cdH0gY2F0Y2ggKCBlcnIgKSB7XG5cdFx0Y29uc29sZS5sb2coIGVyciApO1xuXHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0fVxuXG59IGVsc2Uge1xuXHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG59XG47XG5cblx0XHRcbnZhciBoYXNTZWxlY3RpdmVSZWZyZXNoID0gKFxuXHQndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdwICYmXG5cdHdwLmN1c3RvbWl6ZSAmJlxuXHR3cC5jdXN0b21pemUuc2VsZWN0aXZlUmVmcmVzaCAmJlxuXHR3cC5jdXN0b21pemUud2lkZ2V0c1ByZXZpZXcgJiZcblx0d3AuY3VzdG9taXplLndpZGdldHNQcmV2aWV3LldpZGdldFBhcnRpYWxcbik7XG5pZiAoIGhhc1NlbGVjdGl2ZVJlZnJlc2ggKSB7XG5cdHdwLmN1c3RvbWl6ZS5zZWxlY3RpdmVSZWZyZXNoLmJpbmQoXG5cdFx0J3BhcnRpYWwtY29udGVudC1yZW5kZXJlZCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0fVxuXHQpO1xufVxuO1xuXG5cdH0pO1xufSkoalF1ZXJ5KTtcbiJdfQ==
