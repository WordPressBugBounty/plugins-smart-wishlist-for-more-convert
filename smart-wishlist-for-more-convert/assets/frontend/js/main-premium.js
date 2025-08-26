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

        // Mouseover to show.
        $(document).on('mouseenter', ".wlfmc-tooltip", function (ee) {
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
        });
        $(document).on('mouseleave', ".wlfmc-tooltip", function (ee) {
          // Re-hide tooltip.
          wlfmcTooltip.hide();
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
        //this.init_quantity();
        //this.init_copy_wishlist_link();
        //this.init_tooltip();
        //this.init_components();
        //this.init_layout();
        this.init_drag_n_drop();
        //this.init_popup_checkbox_handling();
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
            //ajax_url,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvanMvbWFpbi1wcmVtaXVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLENBQUMsVUFBVSxDQUFDLEVBQUU7RUFDYixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDZCxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVk7SUFDN0I7SUFDQSxJQUFJLGVBQWUsR0FBTyxFQUFFO01BQzNCLG1CQUFtQixHQUFHLEVBQUU7TUFDeEIsSUFBSSxHQUFrQixVQUFVLENBQUMsSUFBSTtNQUNyQyxlQUFlLEdBQU8sSUFBSTtNQUMxQixjQUFjLEdBQVEsVUFBVSxDQUFDLGNBQWM7TUFDL0MsY0FBYyxHQUFRLFVBQVUsQ0FBQyxjQUFjO01BQy9DLGNBQWMsR0FBUSxLQUFLO01BQzNCLFdBQVc7TUFDWCxlQUFlO0lBR2xCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHO01BQ1osc0JBQXNCLEVBQUUsU0FBQSx1QkFBQSxFQUFZO1FBQ25DLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBRSxpQ0FBa0MsQ0FBQztRQUV4RSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ25CLE9BQU8sS0FBSztRQUNiO1FBRUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7VUFDcEMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUMsRUFBRTtZQUMxQyxPQUFPLEtBQUs7VUFDYjtVQUVBLElBQUksSUFBSSxHQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUUsNkNBQThDLENBQUM7WUFDaEYsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUUsK0NBQWdELENBQUM7VUFFaEYsSUFBSyxDQUFFLElBQUksSUFBSSxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztZQUMvRCxPQUFPLEtBQUs7VUFDYjtVQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFFLE1BQU8sQ0FBQztVQUM1QixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBRSxNQUFPLENBQUM7VUFDN0IsSUFBSSxVQUFVLEdBQUksSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFLLENBQUM7WUFDdkMsV0FBVyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUUsSUFBSyxDQUFDO1VBQ3RDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDMUIsT0FBTyxFQUNQLFVBQVUsQ0FBQyxFQUFFO1lBQ1osQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksS0FBSyxHQUFTLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFFLE1BQU8sQ0FBQztjQUN4RCxHQUFHLEdBQVcsVUFBVSxDQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRyxDQUFDLElBQUksQ0FBQztjQUNoRCxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBRSxZQUFhLENBQUM7WUFFbkQsSUFBTSxPQUFPLEdBQUksS0FBSyxDQUFDLFlBQVksQ0FBRSxLQUFNLENBQUMsSUFBSSxVQUFVLENBQUUsS0FBSyxDQUFDLFlBQVksQ0FBRSxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUMsSUFBSyxDQUFDLEdBQUcsQ0FBQztZQUN0RyxLQUFLLENBQUMsS0FBSyxHQUFLLEdBQUcsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxHQUFHLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBRSxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUksQ0FBQyxDQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTzs7WUFFM0c7WUFDQSxXQUFXLENBQUMsU0FBUyxDQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBTSxDQUFDO1lBQzlDLEtBQUssQ0FBQyxhQUFhLENBQUUsV0FBWSxDQUFDO1lBQ2xDLE9BQU8sS0FBSztVQUNiLENBQ0QsQ0FBQztVQUNELFdBQVcsQ0FBQyxnQkFBZ0IsQ0FDM0IsT0FBTyxFQUNQLFVBQVUsQ0FBQyxFQUFFO1lBQ1osQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksS0FBSyxHQUFTLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFFLE1BQU8sQ0FBQztjQUN4RCxHQUFHLEdBQVcsVUFBVSxDQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRyxDQUFDLElBQUksQ0FBQztjQUNoRCxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBRSxZQUFhLENBQUM7WUFDbkQsSUFBTSxPQUFPLEdBQUssS0FBSyxDQUFDLFlBQVksQ0FBRSxLQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLEdBQUcsR0FBRyxVQUFVLENBQUUsS0FBSyxDQUFDLFlBQVksQ0FBRSxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQzFILEtBQUssQ0FBQyxLQUFLLEdBQU8sR0FBRyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLEdBQUcsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksR0FBSSxDQUFDLENBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxPQUFPOztZQUU3RztZQUNBLFdBQVcsQ0FBQyxTQUFTLENBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFNLENBQUM7WUFDOUMsS0FBSyxDQUFDLGFBQWEsQ0FBRSxXQUFZLENBQUM7WUFDbEMsT0FBTyxLQUFLO1VBQ2IsQ0FDRCxDQUFDO1VBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBRSxVQUFVLEVBQUUsSUFBSyxDQUFDO1VBQ3ZDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUUsV0FBVyxFQUFFLEtBQU0sQ0FBQztRQUMxQztNQUVELENBQUM7TUFFRCxxQkFBcUIsRUFBRSxTQUFBLHNCQUFVLENBQUMsRUFBRTtRQUNuQyxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsbUJBQW9CLENBQUMsRUFBRztVQUN4QyxJQUFJLEVBQUUsR0FBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkIsRUFBRSxHQUFJLEVBQUUsQ0FBQyxJQUFJO1lBQ2IsRUFBRSxHQUFJLEVBQUUsQ0FBQyxHQUFHO1lBQ1osRUFBRSxHQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwQixFQUFFLEdBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JCLEVBQUUsR0FBSSxVQUFVLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFPLENBQUUsQ0FBQztZQUNuQyxFQUFFLEdBQUksVUFBVSxDQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBTSxDQUFFLENBQUM7WUFDbEMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFO1lBQ2IsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFO1lBQ2IsR0FBRyxHQUFHLEVBQUU7WUFBRSxHQUFHLEdBQUcsRUFBRTtZQUFFLEVBQUUsR0FBRyxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQUUsRUFBRSxHQUFHLEVBQUU7WUFDbEYsQ0FBQyxHQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUU7WUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUc7WUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRTtVQUMvRCxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDYixHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRztVQUNmLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNsQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHO1VBQzFCLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDakIsR0FBRyxHQUFHLENBQUM7VUFDUixDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLEdBQUcsR0FBRyxDQUFDO1VBQ1I7VUFDQSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDWixDQUFDLENBQUMsTUFBTSxDQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUUsQ0FBQztZQUM3QyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1VBQ3JCO1VBQ0EsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2IsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUc7VUFDZixDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDbEMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRztVQUMxQixDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLEdBQUcsR0FBRyxDQUFDO1VBQ1I7VUFDQSxDQUFDLENBQUMsR0FBRyxDQUFFO1lBQUMsSUFBSSxFQUFFLEdBQUc7WUFBRSxHQUFHLEVBQUU7VUFBSSxDQUFFLENBQUM7UUFDaEMsQ0FBQyxNQUFNO1VBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFFLHlCQUF5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBVSxDQUFFLENBQUM7VUFDNUQsSUFBSyxPQUFPLENBQUMsS0FBSyxXQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUc7WUFDL0MsSUFBSSxFQUFFLEdBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2NBQ25CLEVBQUUsR0FBSSxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7Y0FDN0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJO2NBQ2IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRTtjQUM5QixFQUFFLEdBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2NBQ3BCLEVBQUUsR0FBSSxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUIsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtjQUNsQixHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO1lBQ25CO1lBQ0EsQ0FBQyxDQUFDLEdBQUcsQ0FBRTtjQUFDLElBQUksRUFBRSxHQUFHO2NBQUcsR0FBRyxFQUFFO1lBQUksQ0FBRSxDQUFDO1VBQ2pDO1FBQ0Q7TUFFRCxDQUFDO01BRUQsWUFBWSxFQUFFLFNBQUEsYUFBVSxJQUFJLEVBQUU7UUFDN0IsSUFBSyxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1VBQ3RGO1FBQ0Q7UUFDQSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsUUFBUSxDQUFDLDhCQUE4QixDQUFDLEdBQUcsNEJBQTRCLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQ0FBZ0MsQ0FBQyxHQUFHLHdCQUF3QixHQUFHLHdCQUF5QjtRQUMxUyxJQUFLLElBQUksQ0FBQyxPQUFPLENBQUUsMENBQTJDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsMENBQTJDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsOENBQStDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFJO1VBQ25PLElBQUksUUFBUSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsMENBQTJDLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBRSwwQ0FBMkMsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFFLDhDQUErQyxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQztVQUNqUCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFFLHFCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLGNBQWUsQ0FBQztVQUM1RSxJQUFJLFNBQVMsR0FBRyxrREFBa0QsR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLFlBQVksR0FBRyxvREFBb0QsR0FBRyxRQUFRLEdBQUcsZ0JBQWdCO1VBQ3hMLENBQUMsQ0FBRSxTQUFVLENBQUMsQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO1VBQ2pDLENBQUMsQ0FBRSw2QkFBNkIsR0FBRyxTQUFTLEdBQUcsc0JBQXNCLEdBQUcsUUFBUyxDQUFDLENBQUMsTUFBTSxDQUFFLElBQUssQ0FBQztRQUVsRyxDQUFDLE1BQU0sSUFBSyxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsa0JBQW1CLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1VBQzdELElBQUksUUFBUSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUsc0JBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDO1VBQ3BHLElBQUksU0FBUyxHQUFHLDJDQUEyQyxHQUFHLFFBQVEsR0FBRyxHQUFHLEdBQUcsWUFBWSxHQUFHLFVBQVU7VUFDeEcsQ0FBQyxDQUFFLFNBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7VUFDakMsQ0FBQyxDQUFFLGdDQUFnQyxHQUFHLFFBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxJQUFLLENBQUM7UUFDaEU7TUFFRCxDQUFDO01BRUQsa0JBQWtCLEVBQUUsU0FBQSxtQkFBQSxFQUFZO1FBQy9CLENBQUMsQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxZQUFhLENBQUM7UUFDMUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLFlBQVksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVUsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQztRQUM3SSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBRSxDQUFDO1FBQ25FLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFFLElBQUssQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFFLFlBQWEsQ0FBQztNQUU5QixDQUFDO01BRUQsa0JBQWtCLEVBQUUsU0FBQSxtQkFBQSxFQUFZO1FBRS9CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUM7UUFDMUYsQ0FBQyxDQUFFLG9CQUFxQixDQUFDLENBQUMsV0FBVyxDQUFFLG1CQUFvQixDQUFDO1FBQzVELENBQUMsQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxtQkFBb0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsV0FBVyxDQUFFLFlBQWEsQ0FBQztNQUVqQyxDQUFDO01BRUQsWUFBWSxFQUFFLFNBQUEsYUFBQSxFQUFZO1FBQ3pCLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDO01BQ3RDLENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDQyxnQkFBZ0IsRUFBRSxTQUFBLGlCQUFBLEVBQVk7UUFFN0IsQ0FBQyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFVO1VBQ25HLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDZCxLQUFLLEdBQUcsS0FBSztVQUVkLENBQUMsQ0FBQyxRQUFRLENBQUU7WUFDWCxLQUFLLEVBQUUsZ0NBQWdDO1lBQ3ZDLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxNQUFNLEVBQUUsSUFBSTtZQUNaLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsU0FBUyxFQUFHLFNBQVM7WUFDckIsTUFBTSxFQUFFLFNBQUEsT0FBVSxDQUFDLEVBQUUsRUFBRSxFQUFFO2NBQ3hCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO2dCQUM3QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2dCQUM5RSxJQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2tCQUN2QixLQUFLLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDO2dCQUNwQztnQkFDQSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFDL0UsSUFBSyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztrQkFDdkIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZCO2NBQ0QsQ0FBQyxDQUFDO2NBQ0YsT0FBTyxFQUFFO1lBRVYsQ0FBQztZQUNELE1BQU0sRUFBRSxTQUFBLE9BQVMsS0FBSyxFQUFFLEVBQUUsRUFBQztjQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDaEMsU0FBUyxHQUFHLEVBQUU7Z0JBQ2QsQ0FBQyxHQUFHLENBQUM7Y0FFTixJQUFJLENBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRTtnQkFDakI7Y0FDRDtjQUVBLElBQUksS0FBSyxFQUFFO2dCQUNWLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztjQUNkO2NBRUEsR0FBRyxDQUFDLElBQUksQ0FBRSxZQUFVO2dCQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUVmLENBQUMsQ0FBQyxJQUFJLENBQUUsMkJBQTRCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBRTlDLFNBQVMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQztnQkFFbEMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO2dCQUUvRixJQUFLLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2tCQUMxQixDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFDbEI7Y0FFRCxDQUFFLENBQUM7Y0FFSCxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDZCxJQUFJLEVBQUU7a0JBQ0wsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CO2tCQUM5QyxLQUFLLEVBQUUsQ0FBQyxDQUFFLGlEQUFrRCxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztrQkFDN0UsT0FBTyxFQUFFLFVBQVU7a0JBQ25CLFNBQVMsRUFBRSxTQUFTO2tCQUNwQixjQUFjLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7a0JBQy9CLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztrQkFDcEIsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVTtnQkFDNUIsQ0FBQztnQkFDRCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxHQUFHLEVBQUUsVUFBVSxDQUFDO2NBQ2pCLENBQUMsQ0FBQztZQUNIO1VBQ0QsQ0FBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN2QixDQUFFLENBQUM7TUFDSixDQUFDO01BRUQ7TUFDQSxZQUFZLEVBQUUsU0FBQSxhQUFBLEVBQVk7UUFDekIsSUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFBLEVBQWU7VUFDL0IsSUFBSSxRQUFRO1VBQ1osSUFBSSxLQUFLLEdBQUcsSUFBSTtVQUVoQixJQUFJLENBQUMsVUFBVSxHQUFHLGVBQWU7VUFDakMsSUFBSSxDQUFDLElBQUksR0FBUyxFQUFFO1VBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQVUsQ0FBQztVQUNuQixJQUFJLENBQUMsSUFBSSxHQUFTLENBQUM7VUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUTtVQUNuRixJQUFJLENBQUMsTUFBTSxHQUFPLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTO1VBQzlFLElBQUksQ0FBQyxNQUFNLEdBQU8sRUFBRTs7VUFFcEI7VUFDQSxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztVQUVwRCxJQUFLLENBQUUsSUFBSSxDQUFDLElBQUksRUFBRztZQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFpQjtZQUM3RCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSTtZQUMvQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1VBQ3JDO1VBQ0EsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZO1lBQUU7O1lBRXpCLElBQUksY0FBYyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDO1lBRXZELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJO1lBQ2pDLElBQUksU0FBUyxHQUFVLEtBQUssQ0FBQyxTQUFTO1lBQ3RDLElBQUksTUFBTSxHQUFhLEtBQUssQ0FBQyxNQUFNO1lBQ25DLElBQUksU0FBUyxFQUFFO2NBQ2QsQ0FBQyxDQUFFLElBQUksQ0FBQyxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsc0NBQXNDLEdBQUcsU0FBVSxDQUFDO1lBQzlFLENBQUMsTUFBTTtjQUNOLENBQUMsQ0FBRSxJQUFJLENBQUMsSUFBSyxDQUFDLENBQUMsUUFBUSxDQUFFLG1CQUFvQixDQUFDO1lBQy9DO1lBQ0EsQ0FBQyxDQUFFLElBQUksQ0FBQyxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsZ0JBQWdCLEdBQUcsTUFBTyxDQUFDO1lBRXBELENBQUMsQ0FBRSxJQUFJLENBQUMsSUFBSyxDQUFDLENBQUMsV0FBVyxDQUFFLGlCQUFrQixDQUFDO1lBRS9DLElBQUksU0FBUyxDQUFFLENBQUMsQ0FBRSxZQUFZLENBQUMsSUFBSyxDQUFFLENBQUMsRUFBRTtjQUN4QyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDbkIsWUFBWSxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBRSxZQUFZLENBQUMsU0FBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2NBQzdGLE9BQU8sQ0FBRSxZQUFZLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxNQUFPLENBQUM7WUFDbEQ7VUFFRCxDQUFDO1VBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZO1lBQUU7WUFDekIsQ0FBQyxDQUFFLEtBQUssQ0FBQyxJQUFLLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBSyxFQUFFLEdBQUksQ0FBQztZQUNqQyxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLEVBQUUsR0FBSSxDQUFDO1lBQ2xDLENBQUMsQ0FBRSxLQUFLLENBQUMsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQU8sRUFBRSxFQUFHLENBQUM7WUFDbkMsQ0FBQyxDQUFFLEtBQUssQ0FBQyxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsaUJBQWtCLENBQUM7VUFDOUMsQ0FBQztRQUVGLENBQUM7UUFDRDtRQUNBLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFhLEVBQUUsRUFBRTtVQUM3QixPQUFTLEVBQUUsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFdBQVcsR0FBSSxDQUFDLElBQUssRUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsWUFBWSxHQUFJLENBQUMsSUFBSyxFQUFFLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVk7UUFDcE0sQ0FBQztRQUNELElBQUksT0FBTyxHQUFLLFNBQVosT0FBTyxDQUFlLEdBQUcsRUFBRSxNQUFNLEVBQUU7VUFFdEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFFLE1BQU8sQ0FBQztVQUN6QixJQUFJLElBQUksR0FBTSxDQUFDLENBQUUsR0FBSSxDQUFDO1VBQ3RCLElBQUksSUFBSSxHQUFNLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUNsQyxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsR0FBRyxDQUFFO1lBQUMsVUFBVSxFQUFFO1VBQVUsQ0FBRSxDQUFDOztVQUUzQztVQUNBLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztVQUNuQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7VUFFbkIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7VUFDYjtVQUNBLElBQUksYUFBYSxHQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUssQ0FBRTtVQUN2RSxJQUFJLFlBQVksR0FBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUM7VUFFdkUsSUFBSSxTQUFTLEdBQVE7WUFDcEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsWUFBWSxDQUFDO1lBQ2hELE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDcEQsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLFlBQVksQ0FBQztZQUNyRCxNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxHQUFHO1VBQ2pELENBQUM7VUFDRCxJQUFJLGNBQWMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztVQUN2RCxJQUFJLGFBQWEsR0FBSSxNQUFNLENBQUMsSUFBSSxDQUFFLFNBQVUsQ0FBQztVQUM3QyxJQUFJLFlBQVksQ0FBQyxTQUFTLEtBQUssS0FBSyxJQUFJLFlBQVksQ0FBQyxTQUFTLEtBQUssUUFBUSxFQUFFO1lBQzVFLElBQUksQ0FBQyxHQUFHLENBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBSSxJQUFJLENBQUMsR0FBSSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFDM0YsSUFBSSxDQUFDLEdBQUcsQ0FBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQyxJQUFLLEdBQUksR0FBRyxHQUFHLENBQUUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1VBRTNHLENBQUMsTUFBTTtZQUNOO1lBQ0EsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBSSxHQUFHLEdBQUcsQ0FBRTtZQUMxRCxHQUFHLEdBQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUksR0FBRyxHQUFHLENBQUUsR0FBRyxHQUFHO1lBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBSSxJQUFJLENBQUMsR0FBSSxHQUFHLEdBQUksQ0FBQztZQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUksSUFBSSxDQUFDLElBQUssR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1VBRS9GO1VBQ0EsSUFBSSxTQUFTLENBQUUsSUFBSyxDQUFDLEVBQUU7WUFDdEIsWUFBWSxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBRSxZQUFZLENBQUMsU0FBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdGLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztVQUNwQixDQUFDLE1BQU07WUFDTixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7VUFDcEI7UUFFRCxDQUFDOztRQUVEO1FBQ0EsSUFBSSxZQUFZLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQzs7UUFFdEM7UUFDQSxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsVUFBVSxFQUFFLEVBQUU7VUFDYixJQUFJLEtBQUssR0FBYSxJQUFJO1VBQzFCLFlBQVksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUM7VUFDN0IsSUFBSSxZQUFZLEdBQU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDO1VBQ2xELFlBQVksQ0FBQyxPQUFPLENBQ25CLFVBQVUsRUFBRSxFQUFFO1lBQ2IsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFFLGdCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Y0FBRTtjQUMzQyxZQUFZLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBRSxHQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3JFO1VBQ0QsQ0FDRCxDQUFDO1VBRUQsSUFBSSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDLEVBQUU7WUFFMUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDO1VBRTVEO1VBQ0EsSUFBSSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDLEVBQUU7WUFFMUMsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDO1lBQ3pELE9BQU8sQ0FBRSxZQUFZLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxNQUFPLENBQUM7VUFFbEQ7UUFFRCxDQUNELENBQUM7UUFDRCxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsVUFBVSxFQUFFLEVBQUU7VUFBRTtVQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixDQUNELENBQUM7TUFDRixDQUFDO01BRUQsaUNBQWlDLEVBQUUsU0FBQSxrQ0FBQSxFQUFZO1FBQzlDLElBQUksQ0FBQyxDQUFFLDJEQUE0RCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNoRixDQUFDLENBQUUsMkRBQTRELENBQUMsQ0FBQyxJQUFJLENBQ3BFLFlBQVk7WUFDWCxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsV0FBVyxDQUFFLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDO1VBQzVDLENBQ0QsQ0FBQztRQUNGOztRQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUdDLENBQUM7TUFFRDs7TUFFQTtBQUNEO0FBQ0E7QUFDQTtBQUNBO01BQ0MsbUJBQW1CLEVBQUUsU0FBQSxvQkFBQSxFQUFZO1FBQ2hDO1FBQ0EsSUFBSSxRQUFRLEdBQVMsU0FBakIsUUFBUSxDQUFtQixJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ3ZDLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBRSxlQUFnQixDQUFDLEVBQUU7Y0FDeEYsSUFBSSxNQUFNLEdBQUcsUUFBUSxLQUFLLEVBQUUsR0FBRyxhQUFhLEdBQUcsVUFBVTtjQUV6RCxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUUsa0JBQW1CLENBQUM7WUFDMUM7VUFDRCxDQUFDO1VBQ0QsV0FBVyxHQUFNLFNBQWpCLFdBQVcsQ0FBZ0IsSUFBSSxFQUFFO1lBQ2hDLFFBQVEsQ0FBRSxJQUFJLEVBQUUsS0FBTSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFhLElBQUksRUFBRTtZQUNoQyxRQUFRLENBQUUsSUFBSSxFQUFFLFFBQVMsQ0FBQztVQUMzQixDQUFDO1VBQ0QsUUFBUSxHQUFTLElBQUksZ0JBQWdCLENBQ3BDLFVBQVUsYUFBYSxFQUFFO1lBQ3hCLEtBQUssSUFBSSxDQUFDLElBQUksYUFBYSxFQUFFO2NBQzVCLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUM7Y0FDL0IsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtnQkFDbEMsSUFBSyxPQUFPLFFBQVEsQ0FBQyxVQUFVLEtBQUssV0FBVyxFQUFHO2tCQUNqRCxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBRSxXQUFZLENBQUM7Z0JBQzNDO2dCQUVBLElBQUssT0FBTyxRQUFRLENBQUMsWUFBWSxLQUFLLFdBQVcsRUFBRztrQkFDbkQsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsY0FBZSxDQUFDO2dCQUNoRDtjQUNEO1lBQ0Q7VUFDRCxDQUNELENBQUM7UUFFRixRQUFRLENBQUMsT0FBTyxDQUNmLFFBQVEsQ0FBQyxJQUFJLEVBQ2I7VUFDQyxTQUFTLEVBQUU7UUFDWixDQUNELENBQUM7TUFDRixDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtNQUNDLHNCQUFzQixFQUFFLFNBQUEsdUJBQUEsRUFBWTtRQUNuQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUUsb0RBQXFELENBQUMsQ0FBQyxJQUFJLENBQUUsZ0RBQWlELENBQUM7UUFDbkksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLCtDQUErQyxDQUFDO1FBQzdELFVBQVUsQ0FBQyxHQUFHLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUM1QixRQUFRLEVBQ1IsVUFBVSxDQUFDLEVBQUU7VUFFWixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQztZQUNoQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1VBRWYsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsVUFBVyxDQUFDLEVBQUU7WUFDMUIsQ0FBQyxDQUFFLGNBQWMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLE1BQU8sQ0FBQyxHQUFHLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1lBQ3RFLENBQUMsQ0FBRSxtQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1lBQ2pELENBQUMsQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1VBQ25EO1VBQ0EsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxTQUFVLENBQUMsQ0FDeEIsV0FBVyxDQUFFLFdBQVksQ0FBQyxDQUMxQixRQUFRLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxVQUFXLENBQUMsR0FBRyxTQUFTLEdBQUcsV0FBWSxDQUFDO1VBRTFELElBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7WUFFdEIsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDekMsSUFBSSxTQUFTLEVBQUU7Y0FDZCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWixDQUFDLE1BQU07Y0FDTixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWjtZQUNBLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQy9CLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3JDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQzlDLElBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBRSxVQUFXLENBQUMsRUFBRztjQUMxQixJQUFJLGNBQWMsRUFBRTtnQkFDbkIsY0FBYyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUMxQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsY0FBYyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2NBQzFDLENBQUMsTUFBTTtnQkFDTixjQUFjLEdBQUcsTUFBTTtjQUN4QjtZQUNELENBQUMsTUFBTTtjQUNOLElBQUksY0FBYyxFQUFFO2dCQUNuQixjQUFjLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQzFDLElBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUMxQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtrQkFDakIsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQztnQkFDQSxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Y0FDMUM7WUFDRDtZQUVBLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQztVQUUxQztVQUNBLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxRQUFTLENBQUM7TUFDdEIsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7TUFDQyx3QkFBd0IsRUFBRSxTQUFBLHlCQUFBLEVBQVk7UUFDckMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDN0I7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZCO1FBQ0EsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSx1QkFBd0IsQ0FBQztNQUNqRCxDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtNQUNDLGFBQWEsRUFBRSxTQUFBLGNBQUEsRUFBWTtRQUMxQixJQUFJLEtBQUssRUFDUixPQUFPO1FBRVIsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FDZixRQUFRLEVBQ1Isc0ZBQXNGLEVBQ3RGLFlBQVk7VUFDWCxJQUFJLENBQUMsR0FBZSxDQUFDLENBQUUsSUFBSyxDQUFDO1lBQzVCLEdBQUcsR0FBYSxDQUFDLENBQUMsT0FBTyxDQUFFLGVBQWdCLENBQUM7WUFDNUMsVUFBVSxHQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUUsUUFBUyxDQUFDO1lBQ3BDLGFBQWEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7WUFDM0MsS0FBSyxHQUFXLENBQUMsQ0FBQyxPQUFPLENBQUUsbURBQW9ELENBQUM7WUFDaEYsS0FBSyxHQUFXLEtBQUssQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1VBRXRDLFlBQVksQ0FBRSxPQUFRLENBQUM7O1VBRXZCO1VBQ0EsR0FBRyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7VUFFbEUsT0FBTyxHQUFHLFVBQVUsQ0FDbkIsWUFBWTtZQUNYLElBQUksS0FBSyxFQUFFO2NBQ1YsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2Q7WUFFQSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDYjtjQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUTtjQUN4QixJQUFJLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CO2dCQUMvQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7Z0JBQzVCLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsYUFBYSxFQUFFLGFBQWE7Z0JBQzVCLGNBQWMsRUFBRSxLQUFLO2dCQUNyQixRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDaEI7Y0FDRCxDQUFDO2NBQ0QsTUFBTSxFQUFFLE1BQU07Y0FDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtnQkFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtrQkFDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO2dCQUN2RDtnQkFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUUsR0FBSSxDQUFDO2NBQ3hCLENBQUM7Y0FDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7Z0JBQ3JCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxHQUFJLENBQUM7Y0FDMUIsQ0FBQztjQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO2dCQUM1QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDM0I7QUFDVDtBQUNBO0FBQ0E7Y0FDUTtZQUNELENBQ0QsQ0FBQztVQUNGLENBQUMsRUFDRCxJQUNELENBQUM7UUFDRixDQUNELENBQUM7TUFDRixDQUFDO01BRUQsV0FBVyxFQUFFLFNBQUEsWUFBQSxFQUFZO1FBQ3hCLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxFQUFFLENBQ2IsT0FBTyxFQUNQLDJDQUEyQyxFQUMzQyxVQUFTLEVBQUUsRUFBRTtVQUNaLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixJQUFJLEVBQUUsR0FBZSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVcsQ0FBQztVQUNqRCxJQUFJLElBQUksR0FBYSxDQUFDLENBQUUsR0FBRyxHQUFHLEVBQUcsQ0FBQztVQUNsQyxJQUFJLGFBQWEsR0FBSSxDQUFDLENBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxVQUFVLENBQUM7VUFFOUMsSUFBSSxDQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDM0IsSUFBSSxjQUFjLEdBQUc7Y0FDcEIsUUFBUSxFQUFFLEtBQUs7Y0FDZixLQUFLLEVBQUUsTUFBTTtjQUNiLFVBQVUsRUFBRSxVQUFVO2NBQ3RCLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQztjQUNyQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFXO1lBQ2pDLENBQUM7WUFDRCxJQUFJLENBQUMsS0FBSyxDQUFFLGNBQWUsQ0FBQztVQUM3QjtVQUNBLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUNqQixHQUFHLENBQUM7WUFDSixLQUFLLEVBQUUsR0FBRztZQUNWLE1BQU0sRUFBRTtVQUNULENBQUMsQ0FBQyxDQUNELFdBQVcsQ0FBQyxDQUFDLENBQ2IsUUFBUSxDQUFDLGlCQUFpQixDQUFDO1VBQzdCLENBQUMsQ0FBRSxHQUFHLEdBQUcsRUFBRyxDQUFDLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztVQUM3QixPQUFPLEtBQUs7UUFDYixDQUNELENBQUM7UUFDRCxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsRUFBRSxDQUNiLE9BQU8sRUFDUCxvQkFBb0IsRUFDcEIsVUFBUyxFQUFFLEVBQUU7VUFDWixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFXLENBQUM7VUFDckMsQ0FBQyxDQUFFLEdBQUcsR0FBRyxFQUFHLENBQUMsQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO1VBQzdCLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQztNQUVGLENBQUM7TUFFRCxXQUFXLEVBQUUsU0FBQSxZQUFBLEVBQVk7UUFDeEIsSUFBSSxLQUFLLEVBQ1IsT0FBTztRQUNSLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxFQUFFLENBQ2YsT0FBTyxFQUNQLHNCQUFzQixFQUN0QixVQUFTLEVBQUUsRUFBRTtVQUNaLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztVQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFFLHNCQUF1QixDQUFDLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxnQkFBaUIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxnQkFBaUIsQ0FBQztVQUU1SCxZQUFZLENBQUUsT0FBUSxDQUFDO1VBRXZCLE9BQU8sR0FBRyxVQUFVLENBQ25CLFlBQVk7WUFDWCxJQUFJLEtBQUssRUFBRTtjQUNWLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNkO1lBRUEsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQ2I7Y0FFQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7Y0FDeEIsSUFBSSxFQUFFO2dCQUNMLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWE7Z0JBQ3hDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztnQkFDM0IsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQyxHQUFHLE1BQU0sR0FBRztjQUNoRCxDQUFDO2NBQ0QsTUFBTSxFQUFFLE1BQU07Y0FDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtnQkFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtrQkFDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO2dCQUN2RDtjQUNELENBQUM7Y0FDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7Z0JBQ3JCO2NBQUE7WUFFRixDQUNELENBQUM7VUFDRixDQUFDLEVBQ0QsSUFDRCxDQUFDO1VBQ0QsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVELGVBQWUsRUFBRSxTQUFBLGdCQUFBLEVBQVk7UUFDNUIsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FDZixPQUFPLEVBQ1AsaUNBQWlDLEVBQ2pDLFVBQVUsQ0FBQyxFQUFFO1VBQ1osQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ2xCLElBQUksS0FBSyxHQUFVLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDNUIsSUFBSSxJQUFJLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDeEMsSUFBSSxTQUFTLEdBQU0sSUFBSSxDQUFDLElBQUksQ0FBRSwyQkFBNEIsQ0FBQztVQUMzRCxJQUFJLEtBQUssR0FBVSxJQUFJLENBQUMsSUFBSSxDQUFFLHNCQUF1QixDQUFDLENBQUMsTUFBTSxDQUFFLHNCQUF1QixDQUFDO1VBQ3ZGLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO1VBRTNDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztVQUN0QixLQUFLLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztVQUMzQixJQUFJLENBQUMsV0FBVyxDQUFFLGdCQUFnQixFQUFFLFlBQWEsQ0FBQztVQUNsRCxPQUFPLEtBQUs7UUFFYixDQUNELENBQUM7UUFDRCxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLE9BQU8sRUFDUCwrQkFBK0IsRUFDL0IsVUFBVSxDQUFDLEVBQUU7VUFDWixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBRSwyQkFBNEIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1VBQ3JELElBQUksQ0FBQyxXQUFXLENBQUUsZ0JBQWlCLENBQUM7VUFDcEMsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVELDRCQUE0QixFQUFFLFNBQUEsNkJBQUEsRUFBWTtRQUN6QyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSxZQUFXO1VBRTVELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1VBQ2hELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0ZBQXdGLENBQUM7VUFDL0gsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLDZCQUE2QixDQUFDLEVBQUU7WUFDNUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2NBQzNCLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQ2xDLENBQUMsTUFBTTtjQUNOLFlBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO1lBQ3JDO1VBQ0Q7VUFDQSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLEVBQUU7WUFDckgsSUFBSSxVQUFVLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztZQUMvRCxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7WUFDMUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2NBQzNCLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO2NBQ2pDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7WUFDL0M7VUFDRDtRQUNELENBQUMsQ0FBQztNQUNILENBQUM7TUFFRCxtQkFBbUIsRUFBRSxTQUFBLG9CQUFBLEVBQVk7UUFDaEMsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDO1FBQzFDLElBQUksQ0FBQyxlQUFlLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7VUFDckQ7UUFDRDtRQUNBLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1VBQzVDLGVBQWUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1FBQ3pDO1FBQ0EsZUFBZSxDQUNiLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUU7VUFDOUMsSUFBSSxPQUFRLEVBQUcsS0FBSyxXQUFXLEVBQUc7WUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyw4Q0FBOEMsQ0FBQztZQUNuRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsK0JBQStCLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQztZQUNuSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLCtCQUErQixHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7VUFDdEk7UUFDRCxDQUFDLENBQUMsQ0FDRCxhQUFhLENBQUM7VUFDZCxPQUFPLEVBQUU7UUFDVixDQUFDLENBQUM7TUFFSixDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtNQUNDLHVCQUF1QixFQUFFLFNBQUEsd0JBQUEsRUFBWTtRQUNwQyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUNmLE9BQU8sRUFDUCxvQkFBb0IsRUFDcEIsVUFBVSxDQUFDLEVBQUU7VUFDWixDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQztVQUM1QixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbEIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUUzQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQ2IsVUFBVSxFQUNWO1lBQ0MsR0FBRyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUUsV0FBWSxDQUFDO1lBQ3BDLElBQUksRUFBRTtVQUNQLENBQ0QsQ0FBQztVQUVELENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxNQUFNLENBQUUsTUFBTyxDQUFDO1VBRTVCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUUsQ0FBQyxFQUFFLElBQUssQ0FBQztVQUN2QyxDQUFDLE1BQU07WUFDTixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7VUFDaEI7VUFDQSxRQUFRLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztVQUU5QixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7VUFFZixNQUFNLENBQUMsT0FBTyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBWSxDQUFDO1VBRS9DLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQztNQUNGLENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDQyxrQkFBa0IsRUFBRSxTQUFBLG1CQUFVLE1BQU0sRUFBRTtRQUNyQyxJQUFJLE9BQU8sR0FBSyxDQUFDLENBQUM7VUFDakIsU0FBUyxHQUFHLElBQUk7UUFFakIsSUFBSSxNQUFNLEVBQUU7VUFDWCxJQUFJLFFBQUEsQ0FBTyxNQUFNLE1BQUssUUFBUSxFQUFFO1lBQy9CLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUNoQjtjQUNDLFNBQVMsRUFBRSxJQUFJO2NBQ2YsQ0FBQyxFQUFFLEVBQUU7Y0FDTCxTQUFTLEVBQUUsQ0FBQyxDQUFFLFFBQVMsQ0FBQztjQUN4QixTQUFTLEVBQUU7WUFDWixDQUFDLEVBQ0QsTUFDRCxDQUFDO1lBRUQsSUFBSyxDQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Y0FDeEIsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFFLDBCQUEyQixDQUFDO1lBQ2hFLENBQUMsTUFBTTtjQUNOLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUztZQUM3QjtZQUVBLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRTtjQUNiLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFFLHFCQUFzQixDQUFDLENBQUMsR0FBRyxDQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUUsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFLLENBQUUsQ0FBQztZQUN2SDtZQUVBLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtjQUNyQixTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBRSxnQkFBaUIsQ0FBQztZQUNqRDtVQUNELENBQUMsTUFBTTtZQUNOLFNBQVMsR0FBRyxDQUFDLENBQUUsMEJBQTJCLENBQUM7WUFFM0MsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO2NBQzdELFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFFLHFCQUFzQixDQUFDLENBQUMsR0FBRyxDQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUUsc0JBQXNCLEdBQUcsTUFBTSxHQUFHLElBQUssQ0FBRSxDQUFDO1lBQ3JIO1VBQ0Q7UUFDRCxDQUFDLE1BQU07VUFDTixTQUFTLEdBQUcsQ0FBQyxDQUFFLDBCQUEyQixDQUFDO1FBQzVDO1FBRUEsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1VBQ3JCLFNBQVMsQ0FBQyxJQUFJLENBQ2IsWUFBWTtZQUNYLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBRSxJQUFLLENBQUM7Y0FDakIsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDLENBQUMsS0FBSyxDQUFFLEdBQUksQ0FBQyxDQUFDLE1BQU0sQ0FDekMsVUFBQyxHQUFHLEVBQUs7Z0JBQUMsT0FBTyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxRQUFRO2NBQUMsQ0FDakQsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFVLENBQUMsb0JBQXFCLENBQUM7WUFFMUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsa0JBQW1CLENBQUM7VUFDM0MsQ0FDRCxDQUFDO1FBQ0YsQ0FBQyxNQUFNO1VBQ04sT0FBTyxJQUFJO1FBQ1o7UUFFQSxPQUFPLE9BQU87TUFDZixDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDQyxjQUFjLEVBQUUsU0FBQSxlQUFVLE1BQU0sRUFBRSxRQUFPLEVBQUUsV0FBVyxFQUFFO1FBRXZELFlBQVksQ0FBRSxlQUFnQixDQUFDO1FBRS9CLGVBQWUsR0FBRyxVQUFVLENBQzNCLFlBQVk7VUFDWCxJQUFLLFdBQVcsRUFBRztZQUNsQixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7VUFDcEI7VUFDQSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FDaEI7WUFDQyxTQUFTLEVBQUU7VUFDWixDQUFDLEVBQ0QsTUFDRCxDQUFDO1VBRUQsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUUsTUFBTyxDQUFDO1VBQ3ZEO1VBQ0EsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQztVQUM3QixRQUFRLENBQUMsTUFBTSxDQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWUsQ0FBQztVQUM5RCxRQUFRLENBQUMsTUFBTSxDQUFFLFNBQVMsRUFBRSxVQUFXLENBQUM7VUFDeEMsSUFBSyxTQUFTLEVBQUU7WUFDZjtZQUNBLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUUsU0FBVSxDQUFDO1lBQzlDO1lBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxlQUFnQixDQUFDO1lBQ3RELFFBQVEsQ0FBQyxNQUFNLENBQUUsZ0JBQWdCLEVBQUUsSUFBSyxDQUFDO1VBQzFDO1VBRUEsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQ25CO1lBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1lBQUU7WUFDM0IsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsTUFBTTtZQUNaLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCO0FBQ047QUFDQTtBQUNBO0FBQ0E7WUFDTSxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtjQUN4QixJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7Z0JBQzFDLElBQUksT0FBTyxRQUFPLEtBQUssVUFBVSxFQUFFO2tCQUNsQyxRQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUM7Z0JBQ2pDO2dCQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFVLENBQUM7Z0JBQzlDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O2dCQUVyQztjQUVEO2NBRUEsQ0FBQyxDQUFFLG1DQUFvQyxDQUFDLENBQUMsUUFBUSxDQUFFLGVBQWdCLENBQUM7Y0FFcEUsSUFBSyxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFHO2dCQUMzQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxRQUFTLENBQUUsQ0FBQztjQUNoRTtjQUNBLElBQUssT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFdBQVcsRUFBRztnQkFDM0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsUUFBUyxDQUFFLENBQUM7Y0FDaEU7Y0FDQSxJQUFLLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUc7Z0JBQ3ZDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBRSxJQUFJLENBQUMsSUFBSyxDQUFDO2NBQ3RDO1lBQ0Q7VUFDRCxDQUNELENBQUM7UUFDRixDQUFDLEVBQ0QsR0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7TUFDQyxpQkFBaUIsRUFBRSxTQUFBLGtCQUFVLFNBQVMsRUFBRTtRQUN2QyxDQUFDLENBQUMsSUFBSSxDQUNMLFNBQVMsRUFDVCxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7VUFDZixJQUFJLFlBQVksR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsb0JBQXFCLENBQUMsQ0FBQyxNQUFNLENBQ3hFLFVBQUMsR0FBRyxFQUFLO2NBQUMsT0FBTyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLFlBQVk7WUFBQyxDQUN6RSxDQUFDLENBQUMsSUFBSSxDQUFFLEdBQUksQ0FBQztZQUNiLFNBQVMsR0FBTSxDQUFDLENBQUUsWUFBYSxDQUFDO1VBQ2pDO1VBQ0EsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFFLENBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxZQUFhLENBQUM7VUFFL0MsSUFBSyxDQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDMUIsV0FBVyxHQUFHLENBQUMsQ0FBRSxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDO1VBQzFDO1VBRUEsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDM0MsU0FBUyxDQUFDLFdBQVcsQ0FBRSxXQUFZLENBQUM7VUFDckM7UUFDRCxDQUNELENBQUM7TUFDRixDQUFDO01BRUQ7O01BRUEsZ0JBQWdCLEVBQUUsU0FBQSxpQkFBVSxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO1FBQ25GLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFFQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7VUFDeEIsSUFBSSxFQUFFO1lBQ0wsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO1lBQzNDLEtBQUssRUFBRSxLQUFLO1lBQ1osT0FBTyxFQUFFLFVBQVU7WUFDbkIsVUFBVSxFQUFFLFFBQVEsQ0FBRSxVQUFXLENBQUM7WUFDbEMsV0FBVyxFQUFFLFFBQVEsQ0FBRSxXQUFZLENBQUM7WUFDcEMsV0FBVyxFQUFFLFFBQVEsQ0FBRSxXQUFZLENBQUM7WUFDcEMsU0FBUyxFQUFFO1VBQ1osQ0FBQztVQUNELE1BQU0sRUFBRSxNQUFNO1VBQ2QsVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7VUFDRCxDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBQ3JCO1VBQUE7UUFFRixDQUNELENBQUM7TUFDRixDQUFDO01BRUQscUJBQXFCLEVBQUUsU0FBQSxzQkFBVyxhQUFhLEVBQUcsSUFBSSxFQUFFO1FBQ3ZELElBQUksSUFBSSxHQUFHO1VBQ1YsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsNEJBQTRCO1VBQ3ZELEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLDJCQUEyQjtVQUN4RCxPQUFPLEVBQUUsVUFBVTtVQUNuQixxQkFBcUIsRUFBRSxhQUFhO1VBQ3BDLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0I7VUFDckQscUJBQXFCLEVBQUUsVUFBVSxDQUFDO1VBQ2xDO1FBQ0QsQ0FBQztRQUVELElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUc7VUFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGVBQWdCLENBQUM7VUFDakQ7UUFDRDtRQUVBLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLHVCQUF1QjtVQUN2QyxJQUFJLEVBQUUsSUFBSTtVQUNWLElBQUksRUFBRSxNQUFNO1VBQ1o7VUFDQSxLQUFLLEVBQUUsS0FBSztVQUNaLFVBQVUsRUFBRSxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDcEMsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFDQSxJQUFLLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFHO2NBRTFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7WUFDM0I7VUFFRCxDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFBLEVBQUc7WUFDN0IsSUFBSyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRztjQUUxQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsSUFBSyxDQUFDO1lBQzdCO1VBRUQsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFTLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxlQUFlLEdBQUksUUFBUSxDQUFDLE1BQU07Y0FDckMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE9BQU87Y0FDbkMsVUFBVSxHQUFTLElBQUk7WUFFeEIsSUFBSyxNQUFNLEtBQUssZUFBZSxFQUFHO2NBQ2pDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2NBQzNCO0FBQ047QUFDQTs7Y0FFTSxJQUFJLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHNCQUF1QixDQUFDLEVBQUU7Z0JBQzVFLE1BQU0sQ0FBQyxPQUFPLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxzQkFBdUIsQ0FBQztjQUMzRDtjQUNBLElBQUksb0JBQW9CLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixHQUFLLFVBQVUsQ0FBQyxXQUFXLEdBQUcsT0FBTyxHQUFHLFVBQVUsR0FBSyxnQkFBZ0I7Y0FDakksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUUsUUFBUSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLHFCQUFzQixDQUFDO2NBRXBKLElBQUssUUFBUSxDQUFDLEtBQUssS0FBSyxXQUFXLEVBQUc7Z0JBQ3JDLENBQUMsQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLEtBQU0sQ0FBQztjQUNoRTtjQUNBLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLGdCQUFpQixDQUFDO1lBQy9DO1lBRUEsSUFBSSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE9BQVEsQ0FBQyxJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUU7Y0FDbEYsTUFBTSxDQUFDLEtBQUssQ0FBRSxnQkFBaUIsQ0FBQztZQUNqQztVQUVEO1FBQ0QsQ0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVELHNCQUFzQixFQUFFLFNBQUEsdUJBQVcsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUc7UUFDbkUsSUFBSyxDQUFFLFVBQVUsSUFBSSxDQUFFLFlBQVksRUFBRztVQUNyQztRQUNEO1FBQ0EsSUFBSSxZQUFZLEdBQUcsV0FBVztRQUM5QixJQUFLLENBQUUsSUFBSSxFQUFHO1VBQ2IsWUFBWSxHQUFHLFVBQVU7VUFDekIsWUFBWSxHQUFHLFVBQVU7UUFDMUI7UUFDQSxJQUFJLE9BQU8sR0FBUSxDQUFDLENBQUUsa0RBQWtELEdBQUcsVUFBVSxHQUFHLElBQUssQ0FBQztVQUM3RixZQUFZLEdBQUcsQ0FBQyxDQUFFLG9EQUFvRCxHQUFHLFVBQVUsR0FBRyxJQUFLLENBQUM7UUFFN0YsWUFBWSxDQUFDLElBQUksQ0FDaEIsWUFBVztVQUNWLElBQUksQ0FBQyxHQUFXLENBQUMsQ0FBRSxJQUFLLENBQUM7WUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUM7VUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBd0IsRUFBRSxVQUFXLENBQUM7VUFDOUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsRUFBRSxZQUFhLENBQUM7VUFDekMsU0FBUyxDQUNQLFdBQVcsQ0FDWCxVQUFVLENBQUMsRUFBRSxPQUFPLEVBQUU7WUFDckIsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFFLDhCQUErQixDQUFDLENBQUMsSUFBSSxDQUFFLEdBQUksQ0FBQztVQUNuRSxDQUNELENBQUMsQ0FDQSxRQUFRLENBQUUsMEJBQTBCLEdBQUcsWUFBYSxDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztVQUUvRSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsMkJBQTJCLEdBQUcsWUFBWSxDQUFDO1VBRWpFLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDL0IsYUFBYSxHQUFHLENBQUMsQ0FBQywyQkFBMkIsR0FBRyxVQUFVLENBQUM7VUFDNUQ7VUFDQSxJQUFLLElBQUksS0FBSyxJQUFJLEVBQUc7WUFDcEIsSUFBSSxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxxQkFBc0IsQ0FBQyxFQUFHO2NBQ3RGLGFBQWEsQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO1lBQ2pDLENBQUMsTUFBTTtjQUNOLGFBQWEsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDLENBQUMsQ0FBQztZQUN0QztVQUNELENBQUMsTUFBTTtZQUNOLElBQUksWUFBWSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUM7WUFDN0QsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsWUFBYSxDQUFDLEVBQUc7Y0FDeEMsYUFBYSxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7WUFDcEMsQ0FBQyxNQUFNO2NBQ04sYUFBYSxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7WUFDakM7VUFDRDtVQUVBLENBQUMsQ0FBQyxJQUFJLENBQ0wsbUJBQW1CLEVBQ25CLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNmLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsS0FBSyxZQUFZLEVBQUU7Y0FDOUUsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFFLDJCQUEyQixHQUFHLENBQUMsQ0FBQyxVQUFXLENBQUM7Y0FDbkUsYUFBYSxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7Y0FDckMsYUFBYSxDQUFDLElBQUksQ0FDakIsWUFBVztnQkFDVixJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsYUFBYyxDQUFDLEVBQUc7a0JBQzNDLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDO2dCQUMvQjtjQUNELENBQ0QsQ0FBQztZQUNGO1VBRUQsQ0FDRCxDQUFDO1VBQ0QsYUFBYSxDQUFDLElBQUksQ0FBRSx1QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBd0IsRUFBRSxVQUFXLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsWUFBYSxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFtQixFQUFFLFlBQWEsQ0FBQztRQUM3SyxDQUNELENBQUM7UUFFRCxPQUFPLENBQUMsSUFBSSxDQUNYLFlBQVk7VUFDWCxJQUFJLENBQUMsR0FBc0IsQ0FBQyxDQUFFLElBQUssQ0FBQztZQUNuQyxTQUFTLEdBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQztZQUM1RCxLQUFLLEdBQWtCLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFXLENBQUUsQ0FBQztZQUMxRixvQkFBb0IsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsR0FBRyxLQUFLO1lBQzlGLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxpQ0FBa0MsQ0FBQyxHQUFHLEtBQUs7WUFDN0YsaUJBQWlCLEdBQU0sS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLDhCQUErQixDQUFDLEdBQUcsS0FBSztZQUMxRixlQUFlLEdBQVEsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLDRCQUE2QixDQUFDLEdBQUcsS0FBSztZQUN4RixpQkFBaUIsR0FBTSxTQUFTLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDO1VBRTNELFNBQVMsQ0FBQyxXQUFXLENBQUUsY0FBZSxDQUFDO1VBQ3ZDLElBQUssSUFBSSxFQUFHO1lBQ1gsSUFBSyxJQUFJLENBQUMsV0FBVyxFQUFHO2NBQ3ZCLElBQUssaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDbkMsSUFBSyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxpQkFBa0IsQ0FBQyxFQUFHO2tCQUMzSCxpQkFBaUIsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztnQkFDaEUsQ0FBQyxNQUFNO2tCQUNOLGlCQUFpQixDQUFDLE9BQU8sQ0FBRSxZQUFhLENBQUMsQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO2dCQUM3RDtjQUNEO2NBQ0EsSUFBSyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUN0QyxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUMsb0JBQXFCLENBQUMsRUFBRztrQkFDckQsb0JBQW9CLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7Z0JBQ2hFLENBQUMsTUFBTTtrQkFDTixvQkFBb0IsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsV0FBVyxDQUFFLE1BQU8sQ0FBQztnQkFDbkU7Y0FDRDtjQUNBLElBQUssb0JBQW9CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDdEMsSUFBSyxJQUFJLENBQUMsd0JBQXdCLEVBQUc7a0JBQ3BDLG9CQUFvQixDQUFDLE9BQU8sQ0FBRSxZQUFhLENBQUMsQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO2dCQUNoRSxDQUFDLE1BQU07a0JBQ04sb0JBQW9CLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7Z0JBQ25FO2NBRUQ7Y0FDQSxJQUFLLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUNqQyxJQUFLLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDLHFCQUFxQixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUFHO2tCQUNyRyxlQUFlLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7Z0JBQzNELENBQUMsTUFBTTtrQkFDTixlQUFlLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7Z0JBQzlEO2NBQ0Q7O2NBRUE7Y0FDQSxJQUFLLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxtREFBb0QsQ0FBQyxDQUFDLE1BQU0sRUFBRztnQkFDakYsU0FBUyxDQUFDLFFBQVEsQ0FBRSxjQUFlLENBQUM7Y0FDckM7WUFDRCxDQUFDLE1BQU0sSUFBSyxRQUFBLENBQU8saUJBQWlCLE1BQUssUUFBUSxJQUFJLGVBQWUsSUFBSSxpQkFBaUIsSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUMscUJBQXNCLENBQUMsRUFBRztjQUNoSixJQUFLLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUk7Z0JBQ3ZDLG9CQUFvQixDQUFDLE9BQU8sQ0FBRSxZQUFhLENBQUMsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDO2NBQ25FO2NBQ0EsSUFBSyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUN0QyxvQkFBb0IsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDLENBQUMsUUFBUSxDQUFFLE1BQU8sQ0FBQztjQUNoRTtjQUNBLElBQUssaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDbkMsaUJBQWlCLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7Y0FDN0Q7Y0FDQSxJQUFLLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUNqQyxlQUFlLENBQUMsT0FBTyxDQUFFLFlBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7Y0FDM0Q7WUFDRCxDQUFDLE1BQU07Y0FDTixTQUFTLENBQUMsUUFBUSxDQUFFLGNBQWUsQ0FBQyxDQUFDLENBQUM7WUFDdkM7VUFDRDtVQUNBLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXdCLEVBQUUsVUFBVyxDQUFDO1VBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsWUFBYSxDQUFDO1VBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztVQUN6RSxLQUFLLENBQUMsSUFBSSxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUM7VUFDeEUsS0FBSyxDQUFDLElBQUksQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO1VBQ25FLEtBQUssQ0FBQyxJQUFJLENBQUUsOEJBQStCLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztVQUVyRSxTQUFTLENBQ1AsV0FBVyxDQUNYLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtZQUNyQixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBSSxDQUFDO1VBQ2pFLENBQ0QsQ0FBQyxDQUNBLFFBQVEsQ0FBRSx3QkFBd0IsR0FBRyxZQUFhLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO1VBQzdFLENBQUMsQ0FBQyxJQUFJLENBQ0wsbUJBQW1CLEVBQ25CLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNmLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxZQUFZLEVBQUU7Y0FDN0UsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLFlBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsT0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQyxTQUFVLENBQUMsSUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLGFBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBRyxFQUFHO2dCQUMzTixTQUFTLENBQUMsUUFBUSxDQUFFLFFBQVMsQ0FBQztjQUMvQjtjQUNBLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQyxhQUFjLENBQUMsRUFBRztnQkFDM0MsS0FBSyxDQUFDLElBQUksQ0FBRSxrQ0FBbUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsSUFBSyxDQUFDO2NBQ3pFO2NBQ0EsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLFlBQWEsQ0FBQyxFQUFHO2dCQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxJQUFLLENBQUM7Y0FDeEU7Y0FDQSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsT0FBUSxDQUFDLEVBQUc7Z0JBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLElBQUssQ0FBQztjQUNuRTtjQUNBLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQyxTQUFVLENBQUMsRUFBRztnQkFDdkMsS0FBSyxDQUFDLElBQUksQ0FBRSw4QkFBK0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsSUFBSyxDQUFDO2NBQ3JFO1lBQ0Q7VUFFRCxDQUNELENBQUM7VUFFRCxLQUFLLENBQUMsSUFBSSxDQUFFLHdCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF3QixFQUFFLFVBQVcsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsRUFBRSxZQUFhLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW1CLEVBQUUsWUFBYSxDQUFDO1VBQ3JLLElBQUssVUFBVSxLQUFLLFlBQVksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsVUFBVSxDQUFDLG1DQUFvQyxDQUFDLEVBQUc7WUFDekcsU0FBUyxDQUFDLElBQUksQ0FBRSxzQkFBdUIsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxnQkFBaUIsQ0FBQztVQUN0RSxDQUFDLE1BQU07WUFDTixTQUFTLENBQUMsSUFBSSxDQUFFLHNCQUF1QixDQUFDLENBQUMsV0FBVyxDQUFFLGdCQUFpQixDQUFDO1VBQ3pFO1FBQ0QsQ0FDRCxDQUFDO01BQ0YsQ0FBQztNQUVELGNBQWMsRUFBRSxTQUFBLGVBQVUsUUFBUSxFQUFDO1FBQ2xDLElBQUssSUFBSSxLQUFLLFFBQVEsRUFBRztVQUN4QixlQUFlLEdBQUssRUFBRTtVQUN0QixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUUscURBQXNELENBQUM7VUFDOUUsSUFBSyxhQUFhLENBQUMsTUFBTSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEVBQUc7WUFDckQsYUFBYSxDQUFDLElBQUksQ0FDakIsWUFBVztjQUNWLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsYUFBYyxDQUFDO2NBQzFDLElBQUssQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWUsRUFBRSxVQUFVLElBQUksRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSTtjQUFFLENBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRztnQkFDL0YsQ0FBQyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixHQUFHLElBQUksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztjQUN2RjtZQUNELENBQ0QsQ0FBQztVQUNGO1VBQ0EsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFFLHdDQUF5QyxDQUFDO1VBQy9ELElBQUssV0FBVyxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFHO1lBQ25ELFdBQVcsQ0FBQyxJQUFJLENBQ2YsWUFBVztjQUNWLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsYUFBYyxDQUFDO2NBQzFDLElBQUssQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWUsRUFBRSxVQUFVLElBQUksRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSTtjQUFFLENBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRztnQkFDL0YsQ0FBQyxDQUFFLHNCQUF1QixDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixHQUFHLElBQUksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztjQUM1RTtZQUNELENBQ0QsQ0FBQztVQUNGO1VBQ0EsQ0FBQyxDQUFFLHdCQUF5QixDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztVQUVyRCxDQUFDLENBQUMsSUFBSSxDQUNMLFFBQVEsRUFDUixVQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUc7WUFDekIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFFLHlCQUF5QixHQUFHLFFBQVEsQ0FBQyxVQUFXLENBQUM7WUFDeEUsYUFBYSxDQUFDLElBQUksQ0FDakIsWUFBVztjQUNWLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDO2NBQzlCLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQyxPQUFRLENBQUM7Y0FDL0UsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsV0FBWSxDQUFDO1lBQ3hGLENBQ0QsQ0FBQztZQUNELENBQUMsQ0FBRSwyREFBNEQsQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsTUFBTyxDQUFDO1lBQ3hGLENBQUMsQ0FBRSxxRUFBc0UsQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsTUFBTyxDQUFDO1lBRWxHLGVBQWUsQ0FBQyxJQUFJLENBQUUsUUFBUyxDQUFDO1VBRWpDLENBQ0QsQ0FBQztRQUNGO01BQ0QsQ0FBQztNQUVELHVCQUF1QixFQUFFLFNBQUEsd0JBQVUsUUFBUSxFQUFDO1FBQzNDLElBQUssSUFBSSxLQUFLLFFBQVEsRUFBRztVQUN4QixtQkFBbUIsR0FBRyxFQUFFO1VBQ3hCLElBQUksYUFBYSxHQUFLLENBQUMsQ0FBRSxxREFBc0QsQ0FBQztVQUNoRixJQUFLLGFBQWEsQ0FBQyxNQUFNLElBQUksbUJBQW1CLENBQUMsTUFBTSxFQUFHO1lBQ3pELGFBQWEsQ0FBQyxJQUFJLENBQ2pCLFlBQVc7Y0FDVixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQztjQUMxQyxJQUFLLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBbUIsRUFBRSxVQUFVLElBQUksRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSTtjQUFFLENBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRztnQkFDbkcsQ0FBQyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixHQUFHLElBQUksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztjQUN2RjtZQUNELENBQ0QsQ0FBQztVQUNGO1VBQ0EsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFFLHlDQUEwQyxDQUFDO1VBQ2hFLElBQUssV0FBVyxDQUFDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUc7WUFDdkQsV0FBVyxDQUFDLElBQUksQ0FDZixZQUFXO2NBQ1YsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxhQUFjLENBQUM7Y0FDMUMsSUFBSyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW1CLEVBQUUsVUFBVSxJQUFJLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUk7Y0FBRSxDQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUc7Z0JBQ25HLENBQUMsQ0FBRSx1QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Y0FDN0U7WUFDRCxDQUNELENBQUM7VUFDRjtVQUNBLENBQUMsQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7VUFDdkQsQ0FBQyxDQUFFLHdCQUF5QixDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztVQUNyRCxDQUFDLENBQUMsSUFBSSxDQUNMLFFBQVEsRUFDUixVQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUc7WUFDekIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFFLHlCQUF5QixHQUFHLFFBQVEsQ0FBQyxVQUFXLENBQUM7WUFDeEUsYUFBYSxDQUFDLElBQUksQ0FDakIsWUFBVztjQUNWLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFXLENBQUUsQ0FBQztjQUNuRCxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsWUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxPQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLFNBQVUsQ0FBQyxJQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsYUFBYyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBRSxrQ0FBbUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFHLEVBQUc7Z0JBQ3ZQLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDO2NBQy9CO2NBQ0EsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLGFBQWMsQ0FBQyxFQUFHO2dCQUNsRCxLQUFLLENBQUMsSUFBSSxDQUFFLGtDQUFtQyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxJQUFLLENBQUM7Y0FDekUsQ0FBQyxNQUFNO2dCQUNOLEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztjQUMxRTtjQUVBLElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxZQUFhLENBQUMsRUFBRztnQkFDakQsS0FBSyxDQUFDLElBQUksQ0FBRSxpQ0FBa0MsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsSUFBSyxDQUFDO2NBQ3hFLENBQUMsTUFBTTtnQkFDTixLQUFLLENBQUMsSUFBSSxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUM7Y0FDekU7Y0FFQSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFDLEVBQUc7Z0JBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLElBQUssQ0FBQztjQUNuRSxDQUFDLE1BQU07Z0JBQ04sS0FBSyxDQUFDLElBQUksQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsS0FBTSxDQUFDO2NBQ3BFO2NBRUEsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLFNBQVUsQ0FBQyxFQUFHO2dCQUM5QyxLQUFLLENBQUMsSUFBSSxDQUFFLDhCQUErQixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxJQUFLLENBQUM7Y0FDckUsQ0FBQyxNQUFNO2dCQUNOLEtBQUssQ0FBQyxJQUFJLENBQUUsOEJBQStCLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQztjQUN0RTtZQUNELENBQ0QsQ0FBQztZQUNELElBQUksYUFBYSxHQUFHLENBQUMsQ0FBRSwyQkFBMkIsR0FBRyxRQUFRLENBQUMsVUFBVyxDQUFDO1lBQzFFLGFBQWEsQ0FBQyxJQUFJLENBQ2pCLFlBQVc7Y0FDVixJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsYUFBYyxDQUFDLEVBQUc7Z0JBQ2xELENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDO2NBQy9CO1lBQ0QsQ0FDRCxDQUFDO1lBQ0QsQ0FBQyxDQUFFLDJEQUE0RCxDQUFDLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBQyxNQUFPLENBQUM7WUFDeEYsQ0FBQyxDQUFFLHFFQUFzRSxDQUFDLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBQyxNQUFPLENBQUM7WUFFbEcsbUJBQW1CLENBQUMsSUFBSSxDQUFFLFFBQVMsQ0FBQztVQUVyQyxDQUNELENBQUM7UUFDRjtNQUNELENBQUM7TUFDRDtNQUNBLGlCQUFpQixFQUFFLFNBQUEsa0JBQVksUUFBUSxFQUFHO1FBQ3pDLElBQUssdUJBQXVCLEVBQUc7VUFDOUIsWUFBWSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxRQUFTLENBQUM7VUFDbkQsY0FBYyxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRyxRQUFTLENBQUM7UUFDdkQ7UUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxRQUFTLENBQUUsQ0FBQztNQUNwRCxDQUFDO01BRUQ7TUFDQSxpQkFBaUIsRUFBRSxTQUFBLGtCQUFZLFFBQVEsRUFBRztRQUN6QyxJQUFLLHVCQUF1QixFQUFHO1VBQzlCLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUUsUUFBUyxDQUFDO1VBQ25ELGNBQWMsQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUcsUUFBUyxDQUFDO1FBRXZEO1FBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxRQUFTLENBQUUsQ0FBQztNQUM3RCxDQUFDO01BRUQsYUFBYSxFQUFFLFNBQUEsY0FBWSxJQUFJLEVBQUc7UUFDakMsSUFBSyx1QkFBdUIsRUFBRztVQUM5QixZQUFZLENBQUMsT0FBTyxDQUFFLGFBQWEsRUFBRSxJQUFLLENBQUM7VUFDM0MsY0FBYyxDQUFDLE9BQU8sQ0FBRSxhQUFhLEVBQUcsSUFBSyxDQUFDO1FBQy9DO01BQ0QsQ0FBQztNQUVELGFBQWEsRUFBRSxTQUFBLGNBQVUsS0FBSyxFQUFFO1FBQy9CLElBQUksRUFBRSxHQUNMLHdKQUF3SjtRQUN6SixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7TUFDNUMsQ0FBQztNQUVEO0FBQ0Q7QUFDQTtNQUNDLE1BQU0sRUFBRSxTQUFBLE9BQVUsS0FBSyxFQUFFO1FBQ3hCLE9BQU8sSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUssS0FBSztNQUM3RixDQUFDO01BRUQ7QUFDRDtBQUNBO01BQ0MsSUFBSSxFQUFFLFNBQUEsS0FBQSxFQUFZO1FBQ2pCLE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUUsY0FBZSxDQUFDO01BQ25ELENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDQyxPQUFPLEVBQUUsU0FBQSxRQUFXLElBQUksRUFBRztRQUMxQixJQUFLLElBQUksQ0FBQyxJQUFJLENBQUUsR0FBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztVQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFFLDRCQUE2QixDQUFDO1FBQzlDLENBQUMsTUFBTTtVQUNOLElBQUksQ0FBQyxRQUFRLENBQUUsZ0NBQWlDLENBQUM7UUFDbEQ7TUFDRCxDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0MsU0FBUyxFQUFFLFNBQUEsVUFBVyxJQUFJLEVBQUc7UUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBRSxpQ0FBa0MsQ0FBQztNQUN0RCxDQUFDO01BRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0MsS0FBSyxFQUFFLFNBQUEsTUFBVSxJQUFJLEVBQUU7UUFDdEIsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLFdBQVcsSUFBSSxVQUFVLENBQUMsbUJBQW1CLEVBQUU7VUFDeEUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxLQUFLLEVBQUUsS0FBTSxDQUFDLENBQUMsS0FBSyxDQUNoQztZQUNDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsVUFBVSxFQUFFO2NBQ1gsVUFBVSxFQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxlQUFlLEdBQUcsb0JBQW9CO2NBQ3RGLGNBQWMsRUFBRSxXQUFXO2NBQzNCLE9BQU8sRUFBRTtZQUNWO1VBQ0QsQ0FDRCxDQUFDO1FBQ0Y7TUFDRCxDQUFDO01BRUQsV0FBVyxFQUFFLFNBQUEsWUFBQSxFQUFZO1FBQ3hCLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssS0FBSyxXQUFXLEVBQUc7VUFDdkMsQ0FBQyxDQUFFLG9FQUFxRSxDQUFDLENBQUMsTUFBTSxDQUFFLEtBQUssRUFBRSxLQUFNLENBQUMsQ0FBQyxLQUFLLENBQ3JHO1lBQ0MsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUU7Y0FDWCxVQUFVLEVBQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGVBQWUsR0FBRyxvQkFBb0I7Y0FDdEYsY0FBYyxFQUFFLFdBQVc7Y0FDM0IsT0FBTyxFQUFFO1lBQ1Y7VUFDRCxDQUNELENBQUM7UUFDRjtNQUNELENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDQyxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtRQUN4QixJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO1VBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDLENBQUMsR0FBRyxDQUFFLFNBQVMsRUFBRSxHQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztVQUNqRCxDQUFDLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxpQkFBa0IsQ0FBQztRQUN0RTtNQUNELENBQUM7TUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO01BQ0MsaUJBQWlCLEVBQUUsU0FBQSxrQkFBQSxFQUFZO1FBQzlCLElBQUksU0FBUyxDQUFDLGFBQWEsRUFBRTtVQUM1QixPQUFPLElBQUk7UUFDWjs7UUFFQTtRQUNBLFFBQVEsQ0FBQyxNQUFNLEdBQUcsY0FBYztRQUNoQyxJQUFJLEdBQUcsR0FBVyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBRSxhQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7O1FBRWpFO1FBQ0EsUUFBUSxDQUFDLE1BQU0sR0FBRyxxREFBcUQ7UUFFdkUsT0FBTyxHQUFHO01BQ1gsQ0FBQztNQUVELFNBQVMsRUFBRSxTQUFBLFVBQVUsV0FBVyxFQUFFLEtBQUssRUFBRTtRQUN4QyxJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUksR0FBRyxHQUFHLEVBQUksQ0FBQztRQUMvQyxRQUFRLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFFLEtBQU0sQ0FBQyxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxVQUFVO01BQ3pHLENBQUM7TUFFRCxrQkFBa0IsRUFBRSxTQUFBLG1CQUFVLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ25ELElBQUksZ0JBQWdCLEdBQUcsRUFBRTtRQUN6QixJQUFJLFNBQVMsR0FBVSxHQUFHLENBQUMsS0FBSyxDQUFFLEdBQUksQ0FBQztRQUN2QyxJQUFJLE9BQU8sR0FBWSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksYUFBYSxHQUFNLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxJQUFJLEdBQWUsRUFBRTtRQUN6QixJQUFJLGFBQWEsRUFBRTtVQUNsQixTQUFTLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBRSxHQUFJLENBQUM7VUFDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFFLEdBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtjQUMzQyxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztjQUN2QyxJQUFJLEdBQWdCLEdBQUc7WUFDeEI7VUFDRDtRQUNEO1FBRUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUUsR0FBRyxFQUFFLEVBQUcsQ0FBQztRQUNwRSxPQUFPLE9BQU8sR0FBRyxHQUFHLEdBQUcsZ0JBQWdCLEdBQUcsUUFBUTtNQUNuRCxDQUFDO01BRUQsZUFBZSxFQUFFLFNBQUEsZ0JBQVUsR0FBRyxFQUFFLE1BQU0sRUFBRTtRQUN2QyxJQUFJLFFBQVEsR0FBUSxrQkFBa0IsQ0FBRSxHQUFHLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBRSxDQUFDO1VBQzNELGFBQWEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFFLFFBQVMsQ0FBQztVQUMxQyxjQUFjO1VBQ2QsQ0FBQztRQUVGLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtVQUMxQyxjQUFjLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBRSxHQUFJLENBQUM7VUFFOUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO1lBQ2pDLE9BQU8sY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxJQUFJLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztVQUNsRTtRQUNEO01BQ0Q7SUFDRCxDQUFDO0lBQ0Q7SUFHQSxNQUFNLENBQUMsT0FBTyxHQUFHO01BQ2hCLFlBQVksRUFBRSxJQUFJO01BQ2xCLFVBQVUsRUFBRSxPQUFPO01BQ25CLFdBQVcsRUFBRSxpQkFBaUI7TUFDOUIsS0FBSyxFQUFFLEtBQUs7TUFDWixXQUFXLEVBQUUsS0FBSztNQUNsQixVQUFVLEVBQUUsUUFBUTtNQUNwQixZQUFZLEVBQUUsR0FBRztNQUNqQixVQUFVLEVBQUUsT0FBTztNQUNuQixPQUFPLEVBQUUsU0FBUztNQUNsQixVQUFVLEVBQUUsU0FBUztNQUNyQixZQUFZLEVBQUUsSUFBSTtNQUNsQixVQUFVLEVBQUUsT0FBTztNQUNuQixRQUFRLEVBQUUsU0FBUztNQUNuQixXQUFXLEVBQUUsS0FBSztNQUNsQixhQUFhLEVBQUUsS0FBSztNQUNwQixXQUFXLEVBQUUsS0FBSztNQUNsQixZQUFZLEVBQUUsSUFBSTtNQUNsQixlQUFlLEVBQUUsS0FBSztNQUN0QixXQUFXLEVBQUU7UUFDWixLQUFLLEVBQUUsYUFBYTtRQUNwQixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsZUFBZTtRQUN4QixPQUFPLEVBQUU7TUFDVixDQUFDO01BQ0QsU0FBUyxFQUFFLFlBQVk7TUFDdkIsYUFBYSxFQUFFLFVBQVUsQ0FBQyxjQUFjLEtBQUssU0FBUyxHQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsZ0JBQWdCLEdBQUksVUFBVSxDQUFDLGNBQWM7TUFDL0ksT0FBTyxFQUFFLElBQUk7TUFDYixVQUFVLEVBQUUsYUFBYTtNQUN6QixZQUFZLEVBQUUsZUFBZTtNQUM3QixVQUFVLEVBQUUsS0FBSztNQUNqQixNQUFNLEVBQUUsTUFBTTtNQUNkLFdBQVcsRUFBRSxJQUFJO01BQ2pCLGlCQUFpQixFQUFFLEtBQUs7TUFDeEIsV0FBVyxFQUFFLElBQUk7TUFDakIsYUFBYSxFQUFFLGdCQUFnQjtNQUMvQixHQUFHLEVBQUcsVUFBVSxDQUFDLE1BQU0sR0FBSSxJQUFJLEdBQUc7SUFDbkMsQ0FBQztJQUlELElBQUssVUFBVSxDQUFDLHlCQUF5QixJQUFJLFVBQVUsQ0FBQyxzQ0FBc0MsRUFBRztNQUVoRyxDQUFDLENBQUUsaURBQWtELENBQUMsQ0FBQyxHQUFHLENBQUUsT0FBUSxDQUFDLENBQUMsTUFBTSxDQUFFLE9BQVEsQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLEVBQUUsSUFBSyxDQUFDO01BQzlHLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxFQUFFLENBQ2IsT0FBTyxFQUNQLHFDQUFxQyxFQUNyQyxVQUFTLEVBQUUsRUFBRTtRQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO1FBRWpCLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLE1BQU8sQ0FBQztRQUVsQyxJQUFJLElBQUksR0FBYSxDQUFDLENBQUUsOEJBQStCLENBQUM7UUFDeEQsSUFBSSxjQUFjLEdBQUc7VUFDcEIsUUFBUSxFQUFFLEtBQUs7VUFDZixLQUFLLEVBQUUsTUFBTTtVQUNiLFVBQVUsRUFBRSxVQUFVO1VBQ3RCLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQztVQUNyQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFXO1FBQ2pDLENBQUM7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFFLGNBQWUsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztRQUNwQixPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7SUFDRjtJQUNBO0lBRUUsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FDZixZQUFZLEVBQ1osWUFBWTtNQUVYLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7TUFFOUMsSUFBSSxDQUFDLEdBQXlCLENBQUMsQ0FBRSxJQUFLLENBQUM7UUFDdEMsQ0FBQyxHQUF5QixDQUFDLENBQUUsTUFBTyxDQUFDO1FBQ3JDLHVCQUF1QixHQUFJLE9BQVEscUJBQXNCLEtBQUssV0FBVyxJQUFJLHFCQUFxQixLQUFLLElBQUksR0FBSSxxQkFBcUIsQ0FBQyx1QkFBdUIsR0FBRyxFQUFFO01BRXRLLENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLCtDQUErQyxFQUMvQyxVQUFVLEVBQUUsRUFBRTtRQUNiLElBQUksSUFBSSxHQUFJLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUM7UUFDcEYsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2pFLElBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1VBQy9FLGVBQWUsQ0FBQyxJQUFJLENBQUUsVUFBVSxFQUFDLElBQUssQ0FBQztRQUN4QztNQUNELENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsUUFBUSxFQUNSLHNDQUFzQyxFQUN0QyxZQUFZO1FBQ1gsSUFBSSxDQUFDLEdBQVksQ0FBQyxDQUFFLElBQUssQ0FBQztVQUN6QixVQUFVLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxtREFBb0QsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDLENBQUMsSUFBSSxDQUFFLHVDQUF3QyxDQUFDO1FBQ3RKLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBRSxVQUFXLENBQUMsRUFBRTtVQUN2QixVQUFVLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxTQUFVLENBQUMsQ0FBQyxPQUFPLENBQUUsUUFBUyxDQUFDO1VBQzNELENBQUMsQ0FBRSxtQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsU0FBVSxDQUFDO1VBQ3JELENBQUMsQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsU0FBVSxDQUFDO1FBQ3ZELENBQUMsTUFBTTtVQUNOLFVBQVUsQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEtBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBRSxRQUFTLENBQUM7VUFDdkQsQ0FBQyxDQUFFLG1CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUM7VUFDakQsQ0FBQyxDQUFFLG9CQUFxQixDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUM7UUFDbkQ7TUFDRCxDQUNELENBQUM7TUFHRCxDQUFDLENBQUMsRUFBRSxDQUNILFFBQVEsRUFDUixtQkFBbUIsRUFDbkIsWUFBWTtRQUNYLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsaUJBQWlCLEVBQ2pCLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRTtRQUN4QixJQUFJLENBQUMsR0FBdUIsQ0FBQyxDQUFFLEVBQUUsQ0FBQyxNQUFPLENBQUM7VUFDekMsVUFBVSxHQUFjLENBQUMsQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDO1VBQzlDLGNBQWMsR0FBVSxTQUFTO1FBQ2xDLGNBQWMsQ0FBQyxVQUFVLEdBQUcsVUFBVTtRQUN0QyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsT0FBTyxDQUFFLHNCQUFzQixFQUFFLGNBQWUsQ0FBQztNQUNoRSxDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWUsQ0FBQztNQUUzRCxDQUFDLENBQUMsRUFBRSxDQUNILHdCQUF3QixFQUN4QixVQUFVLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTtRQUMxQyxJQUFLLENBQUUsU0FBUyxFQUFFO1VBQ2pCO1FBQ0Q7UUFFQSxDQUFDLENBQUUsa0JBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxRQUFTLENBQUM7TUFDaEYsQ0FDRCxDQUFDOztNQUVEO01BQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsbUNBQW1DLEVBQ25DLFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBVSxDQUFDO1FBQ3pDLENBQUMsQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUscUJBQXNCLENBQUMsQ0FBQyxXQUFXLENBQUUsMkNBQTRDLENBQUM7UUFDckcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxhQUFhLEdBQUcsT0FBUSxDQUFDO1FBQzlFLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUscUJBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxnQkFBaUIsQ0FBQztRQUNsRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsUUFBUSxDQUFFLGdCQUFpQixDQUFDO1FBQ3RDLENBQUMsQ0FBRSxpQkFBaUIsR0FBRyxPQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFRLENBQUUsQ0FBQztRQUM1RyxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7O01BRUQ7TUFDQSxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxpQkFBaUIsRUFDakIsVUFBUyxFQUFFLEVBQUU7UUFDWixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQVUsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUMxQixXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxRQUFTLENBQUM7VUFDbkMsR0FBRyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUUsS0FBTSxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7VUFDeEIsSUFBSSxFQUFFO1lBQ0wsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVztZQUN0QyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDM0IsT0FBTyxFQUFFLFVBQVU7WUFDbkIsYUFBYSxFQUFHLFdBQVc7WUFDM0IsS0FBSyxFQUFHO1VBQ1QsQ0FBQztVQUNELE1BQU0sRUFBRSxNQUFNO1VBQ2QsVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsSUFBSyxDQUFDO1VBQzNCLENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLElBQUssQ0FBQztVQUM3QixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxJQUFJLEVBQUU7WUFDeEIsSUFBSyxDQUFFLElBQUksRUFBRztjQUNiO1lBQ0Q7WUFDQSxDQUFDLENBQUUsK0RBQStELENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUM3RTtRQUVELENBQ0QsQ0FBQztRQUNELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUNEO01BRUEsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asd0dBQXdHLEVBQ3hHLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxNQUFPLENBQUM7UUFDbkMsSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1VBQzFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUUsb0JBQXFCLENBQUUsQ0FBQztVQUM3QyxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztVQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbkIsQ0FBQyxDQUFDLElBQUksQ0FDTDtZQUNDLEdBQUcsRUFBRSxJQUFJO1lBQ1QsSUFBSSxFQUFFLEtBQUs7WUFDWCxRQUFRLEVBQUUsTUFBTTtZQUNoQixPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtjQUN4QixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDO2dCQUN4QixPQUFPLEdBQUssU0FBUyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQztnQkFDbkQsUUFBUSxHQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUM7Y0FDbkQsSUFBSSxRQUFRLEVBQUU7Z0JBQ2IsQ0FBQyxDQUFFLG9CQUFxQixDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztjQUNsRDtjQUNBLElBQUksT0FBTyxFQUFFO2dCQUNaLENBQUMsQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxPQUFRLENBQUM7Y0FDbEQ7Y0FDQSxJQUFJLElBQUksS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtnQkFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUU7a0JBQUMsSUFBSSxFQUFFO2dCQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSyxDQUFDO2NBQ25EO1lBQ0Q7VUFDRCxDQUNELENBQUM7VUFDRCxPQUFPLEtBQUs7UUFDYjtNQUNELENBQ0QsQ0FBQztNQUNEO01BQ0k7O01BRUosQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asd0JBQXdCLEVBQ3hCLFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLElBQUssY0FBYyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBRSxlQUFlLENBQUMsTUFBTSxFQUFHO1VBQ25GLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFlLENBQUM7VUFDaEQ7UUFDRDtRQUVBLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLFVBQVUsR0FBVSxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDO1VBQy9DLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXlCLENBQUM7VUFDdEQsT0FBTyxHQUFhLENBQUMsQ0FBQyxPQUFPLENBQUUseUJBQXlCLEdBQUcsVUFBVyxDQUFDO1VBQ3ZFLGFBQWEsR0FBTyxJQUFJO1VBQ3hCLElBQUksR0FBZ0I7WUFDbkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsc0JBQXNCO1lBQ2pELE9BQU8sRUFBRSxVQUFVO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQjtZQUMxQztZQUNBO1VBQ0QsQ0FBQztRQUNGO1FBQ0EsSUFBSSxhQUFhLEtBQUssQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBRSw0QkFBNEIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQyxFQUFFO1VBQzlGLElBQUksR0FBRyxhQUFhO1FBQ3JCO1FBRUEsSUFBSSxvQkFBb0I7UUFFeEIsSUFBSyxDQUFDLENBQUUsMENBQTBDLEdBQUcsaUJBQWlCLEdBQUcsb0RBQW9ELEdBQUcsaUJBQWlCLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRW5LLG9CQUFvQixHQUFHLENBQUMsQ0FBRSwwQ0FBMEMsR0FBRyxpQkFBaUIsR0FBRyxvREFBb0QsR0FBRyxpQkFBaUIsR0FBRyxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXJMLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsc0RBQXVELENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFaEcsb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzREFBdUQsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFM0csQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFFLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxtQ0FBbUMsR0FBRyxpQkFBaUIsR0FBRywrQkFBZ0MsQ0FBQyxDQUFDLE1BQU0sRUFBSTtVQUV0SixvQkFBb0IsR0FBRyxDQUFDLENBQUUsV0FBVyxHQUFHLGlCQUFpQixHQUFHLG1DQUFtQyxHQUFHLGlCQUFpQixHQUFHLCtCQUFnQyxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUVoSyxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUMsMkRBQTJELEdBQUcsaUJBQWlCLEdBQUcsb0VBQW9FLEdBQUcsaUJBQWlCLEdBQUcsNkRBQTZELEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRTdSLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQywyREFBMkQsR0FBRyxpQkFBaUIsR0FBRyxvRUFBb0UsR0FBRyxpQkFBaUIsR0FBRyw2REFBNkQsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7VUFDclIsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXREO1FBRUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQztRQUM3QixJQUFNLE9BQU8sb0JBQW9CLEtBQUssV0FBVyxJQUFJLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDckY7QUFDSDtVQUNHLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBRSxvQkFBb0IsQ0FBQyxHQUFHLENBQUUsQ0FBRSxDQUFFLENBQUM7VUFDeEQ7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtVQUNHLFFBQVEsVUFBTyxDQUFFLGFBQWMsQ0FBQztRQUNqQyxDQUFDLE1BQU07VUFDTixJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUUsZ0JBQWdCLEdBQUcsaUJBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUUscUJBQXNCLENBQUM7VUFDdEcsSUFBSyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUc7WUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQztVQUN6RDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTCxJQUFJLEVBQ0osVUFBUyxHQUFHLEVBQUMsUUFBUSxFQUFDO1VBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQUUsR0FBRyxFQUFHLFFBQUEsQ0FBTyxRQUFRLE1BQUssUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUUsUUFBUyxDQUFDLEdBQUcsUUFBUyxDQUFDO1FBQzlGLENBQ0QsQ0FBQztRQUVELE1BQU0sQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLDBCQUEyQixDQUFDO1FBRTdELElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUU7VUFDdEMsY0FBYyxHQUFHLEtBQUs7VUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGVBQWdCLENBQUM7VUFDakQ7UUFDRDtRQUVBLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7VUFDeEIsSUFBSSxFQUFFLFFBQVE7VUFDZCxJQUFJLEVBQUUsTUFBTTtVQUNaO1VBQ0EsV0FBVyxFQUFFLEtBQUs7VUFDbEIsV0FBVyxFQUFFLEtBQUs7VUFDbEIsS0FBSyxFQUFFLEtBQUs7VUFDWixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUNBLGNBQWMsR0FBRyxJQUFJO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLENBQUM7VUFFeEIsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUNyQixjQUFjLEdBQUcsS0FBSztZQUV0QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFDO1VBQzFCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUU1QixJQUFJLGVBQWUsR0FBSSxRQUFRLENBQUMsTUFBTTtjQUNyQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsT0FBTztjQUNuQyxVQUFVLEdBQVMsSUFBSTtZQUN4QixJQUFJLGVBQWUsS0FBSyxNQUFNLElBQUksZUFBZSxLQUFLLFFBQVEsRUFBRTtjQUMvRCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztjQUUzQixJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3JCLElBQUssT0FBTyxlQUFlLEtBQUssV0FBVyxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7a0JBQ3hFLGVBQWUsQ0FBQyxJQUFJLENBQ25CO29CQUNDLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztvQkFDakMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO29CQUN6QixVQUFVLEVBQUUsUUFBUSxDQUFFLFVBQVc7a0JBQ2xDLENBQ0QsQ0FBQztrQkFDRCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLGVBQWdCLENBQUUsQ0FBQztnQkFDbEU7Y0FDRDtjQUVBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQztjQUU5QyxJQUFJLFFBQVEsRUFBRTtnQkFFYixVQUFVLEdBQVcsS0FBSztnQkFDMUIsSUFBSSxJQUFJLEdBQWEsQ0FBQyxDQUFFLEdBQUcsR0FBRyxRQUFTLENBQUM7Z0JBQ3hDLElBQUksY0FBYyxHQUFHO2tCQUNwQixRQUFRLEVBQUUsS0FBSztrQkFDZixLQUFLLEVBQUUsTUFBTTtrQkFDYixVQUFVLEVBQUUsVUFBVTtrQkFDdEIsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDO2tCQUNyQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFXO2dCQUNqQyxDQUFDO2dCQUNELElBQUksQ0FBQyxLQUFLLENBQUUsY0FBZSxDQUFDO2dCQUM1QixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDakIsR0FBRyxDQUFDO2tCQUNKLEtBQUssRUFBRSxHQUFHO2tCQUNWLE1BQU0sRUFBRTtnQkFDVCxDQUFDLENBQUMsQ0FDRCxXQUFXLENBQUMsQ0FBQyxDQUNiLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7Y0FDckI7Y0FFQSxJQUFJLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGtCQUFtQixDQUFDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRTtnQkFDdEcsTUFBTSxDQUFDLE9BQU8sQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGtCQUFtQixDQUFDO2NBQ3ZEO2NBRUEsSUFBSyxlQUFlLEtBQUssTUFBTSxFQUFHO2dCQUNqQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMscUJBQXNCLENBQUM7Y0FDbEk7WUFDRDtZQUVBLElBQUssZUFBZSxLQUFLLE1BQU0sSUFBSSxVQUFVLENBQUMsY0FBYyxLQUFLLGNBQWMsRUFBRztjQUNqRixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsaUJBQWlCO1lBQ3BEO1lBRUEsSUFBSyxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE9BQVEsQ0FBQyxJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUc7Y0FDcEYsTUFBTSxDQUFDLEtBQUssQ0FBRSxnQkFBaUIsQ0FBQztZQUNqQztZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFckMsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUUsQ0FBQztVQUUvRDtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHdDQUF3QyxFQUN4QyxVQUFVLEVBQUUsRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFhLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDMUIsT0FBTyxHQUFPLENBQUMsQ0FBQyxJQUFJLENBQUUsY0FBZSxDQUFDO1VBQ3RDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLGtCQUFtQixDQUFDO1VBQzFDLElBQUksR0FBVTtZQUNiLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGtCQUFrQjtZQUM3QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDeEIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsR0FBRyxFQUFFLE9BQU87WUFDWixHQUFHLEVBQUU7VUFDTixDQUFDO1FBQ0YsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLENBQUMsQ0FBQyxXQUFXLENBQUUsT0FBUSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxRQUFRLENBQUUsU0FBVSxDQUFDOztRQUV2QjtRQUNBLElBQUssS0FBSyxLQUFLLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsY0FBYyxDQUFFLHlDQUF5QyxFQUFFLENBQUUsQ0FBQyxDQUFHLENBQUMsRUFBRztVQUN0RyxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzQ0FBc0MsRUFBRSxDQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFHLENBQUM7VUFDekYsT0FBTyxJQUFJO1FBQ1o7UUFDQSxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsRUFBRSxDQUFFLENBQUMsRUFBRSxJQUFJLENBQUcsQ0FBQztRQUUzRCxDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1VBQ3pCLElBQUksRUFBRSxJQUFJO1VBQ1YsSUFBSSxFQUFFLE1BQU07VUFDWixRQUFRLEVBQUUsTUFBTTtVQUNoQixPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUU1QixJQUFLLENBQUUsUUFBUSxFQUFHO2NBQ2pCO1lBQ0Q7WUFFQSxJQUFLLFFBQVEsQ0FBQyxLQUFLLElBQU0sUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFHLEVBQUc7Y0FDeEYsSUFBSyxRQUFRLENBQUMsV0FBVyxFQUFHO2dCQUMzQixNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXO2dCQUN0QztjQUNEO2NBQ0EsSUFBSyxFQUFFLEtBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRztnQkFDMUQsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLDBCQUEyQixDQUFDO2NBQzdEO1lBQ0QsQ0FBQyxNQUFNO2NBQ047Y0FDQSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxxQkFBcUIsQ0FBQyx1QkFBd0IsQ0FBQyxFQUFHO2dCQUN6RSxNQUFNLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLFFBQVE7Z0JBQ2hEO2NBQ0Q7Y0FDQSxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztjQUNqRDtjQUNBLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLGVBQWUsRUFBRSxDQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUcsQ0FBQztjQUU1RixJQUFLLEVBQUUsS0FBSyxVQUFVLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFHO2dCQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMscUJBQXNCLENBQUM7Y0FDMUQ7WUFFRDtZQUVBLElBQUssUUFBUSxDQUFDLE9BQU8sSUFBSSxFQUFFLEtBQUssUUFBUSxDQUFDLE9BQU8sRUFBRztjQUNsRCxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxxQkFBcUIsRUFBRSxDQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFFLENBQUM7WUFDNUU7VUFFRDtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHVCQUF1QixFQUN2QixVQUFVLEVBQUUsRUFBRTtRQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVyxDQUFDO1FBQzVDLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLDRCQUE0QixFQUM1QixVQUFVLEVBQUUsRUFBRTtRQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsd0JBQXlCLENBQUM7UUFDMUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsNkNBQTZDLEVBQzdDLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQztRQUNqQixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsSUFBSSxLQUFLLEdBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBRSwrQkFBZ0MsQ0FBQztVQUNoRSxHQUFHLEdBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxlQUFnQixDQUFDO1VBQzdDLFdBQVcsR0FBTSxHQUFHLENBQUMsSUFBSSxDQUFFLFFBQVMsQ0FBQztVQUNyQyxXQUFXLEdBQU0sS0FBSyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUM7VUFDbkMsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1VBQ3RDLElBQUksR0FBYTtZQUNoQixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQywyQkFBMkI7WUFDdEQsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1lBQ3hCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLG9CQUFvQixFQUFFLFdBQVc7WUFDakMsV0FBVyxFQUFFLFdBQVc7WUFDeEIsY0FBYyxFQUFFO1lBQ2hCO1VBQ0QsQ0FBQztRQUVGLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVE7VUFDeEIsSUFBSSxFQUFFLElBQUk7VUFDVixNQUFNLEVBQUUsTUFBTTtVQUNkLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLEdBQUksQ0FBQztVQUV4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBQ3JCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxHQUFJLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO1lBQ3hCLElBQUksQ0FBQztZQUNMLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzNCO0FBQ0w7QUFDQTs7WUFFSyxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUMsTUFBTyxDQUFDLEVBQUc7Y0FDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7Y0FDNUIsSUFBSSxPQUFPLGVBQWUsS0FBSyxXQUFXLElBQUksZUFBZSxLQUFLLElBQUksRUFBRTtnQkFDdkUsSUFBSSxhQUFhLEdBQUcsZUFBZSxDQUFDLE1BQU07Z0JBQzFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtrQkFDeEMsSUFBSSxPQUFPLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7b0JBQy9JLGVBQWUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQztvQkFDOUIsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBRSw2QkFBNkIsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUcsSUFBSSxDQUFFLENBQUM7b0JBQ3JFO2tCQUNEO2dCQUNEO2dCQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsZUFBZ0IsQ0FBRSxDQUFDO2NBQ2xFO2NBQ0EsSUFBSSxPQUFPLG1CQUFtQixLQUFLLFdBQVcsSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7Z0JBQy9FLElBQUksY0FBYSxHQUFHLG1CQUFtQixDQUFDLE1BQU07Z0JBQzlDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksY0FBYSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtrQkFDeEMsSUFBSSxPQUFPLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7b0JBQzNKLG1CQUFtQixDQUFDLE1BQU0sQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDO29CQUNsQyxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsT0FBTyxDQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRyxJQUFJLENBQUUsQ0FBQztvQkFDckU7a0JBQ0Q7Z0JBQ0Q7Z0JBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxtQkFBb0IsQ0FBRSxDQUFDO2NBQ3RFO1lBQ0Q7WUFDQTtVQUNEO1FBQ0QsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxnQkFBZ0IsRUFDaEIsK0dBQStHLEVBQy9HLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQztRQUNqQixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsSUFBSSxLQUFLLEdBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBRSwrQkFBZ0MsQ0FBQztVQUNoRSxHQUFHLEdBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxlQUFnQixDQUFDO1VBQzdDLFdBQVcsR0FBTSxHQUFHLENBQUMsSUFBSSxDQUFFLFFBQVMsQ0FBQztVQUNyQyxZQUFZLEdBQUssR0FBRyxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUM7VUFDdEMsV0FBVyxHQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUUsYUFBYyxDQUFDO1VBQzFDLGNBQWMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFLGdCQUFpQixDQUFDO1VBQzdDLFVBQVUsR0FBb0IsQ0FBQyxDQUFDLDRDQUE0QyxDQUFDO1VBQzdFLElBQUksR0FBYTtZQUNoQixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQywyQkFBMkI7WUFDdEQsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1lBQ3hCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLG9CQUFvQixFQUFFLFdBQVc7WUFDakMsV0FBVyxFQUFFLFdBQVc7WUFDeEIsY0FBYyxFQUFFLGNBQWM7WUFDOUIsV0FBVyxFQUFFLFVBQVUsQ0FBQztZQUN4QjtVQUNELENBQUM7UUFFRixDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRO1VBQ3hCLElBQUksRUFBRSxJQUFJO1VBQ1YsTUFBTSxFQUFFLE1BQU07VUFDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLENBQUM7VUFDeEIsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFDO1VBQzFCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtZQUV4QixJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUMsTUFBTyxDQUFDLEVBQUc7Y0FDdkMsSUFBSSxTQUFTLEdBQUcsS0FBSztjQUNyQixJQUFJLE9BQU8sZUFBZSxLQUFLLFdBQVcsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO2dCQUN2RSxJQUFJLGFBQWEsR0FBRyxlQUFlLENBQUMsTUFBTTtnQkFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7a0JBQzVDLElBQUksT0FBTyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssV0FBVyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEtBQUssV0FBVyxFQUFFO29CQUNqSixlQUFlLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUM7b0JBQzlCLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxPQUFPLENBQUUsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBRSxDQUFDO29CQUNwRTtrQkFDRDtnQkFDRDtnQkFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLGVBQWdCLENBQUUsQ0FBQztjQUNsRTtjQUVBLElBQUksT0FBTyxtQkFBbUIsS0FBSyxXQUFXLElBQUksbUJBQW1CLEtBQUssSUFBSSxFQUFFO2dCQUMvRSxJQUFJLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNO2dCQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtrQkFDNUMsSUFBSSxPQUFPLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssV0FBVyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxXQUFXLEVBQUU7b0JBQzdKLG1CQUFtQixDQUFDLE1BQU0sQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDO29CQUNsQyxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsT0FBTyxDQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUUsQ0FBQztvQkFDcEU7a0JBQ0Q7Z0JBQ0Q7Z0JBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxtQkFBb0IsQ0FBRSxDQUFDO2NBQ3RFO2NBRUEsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDaEUsQ0FBQyxDQUFFLGlDQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixHQUFHLFlBQVksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0Y7Z0JBQ0EsQ0FBQyxDQUFFLDJEQUE0RCxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxLQUFNLENBQUM7Z0JBQ25GLENBQUMsQ0FBRSxxRUFBc0UsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsS0FBTSxDQUFDO2dCQUU3RixDQUFDLENBQUUsK0NBQStDLEdBQUcsV0FBWSxDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztjQUMzRjtjQUNBLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxpQ0FBa0MsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQ2hFLENBQUMsQ0FBRSxpQ0FBa0MsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsR0FBRyxZQUFZLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9GO2dCQUNBLENBQUMsQ0FBRSwyREFBNEQsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsS0FBTSxDQUFDO2dCQUNuRixDQUFDLENBQUUscUVBQXNFLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQU0sQ0FBQztnQkFFN0YsQ0FBQyxDQUFFLCtDQUErQyxHQUFHLFdBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFTLENBQUM7Y0FDM0Y7Y0FDQSxJQUFLLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBRSxXQUFZLENBQUMsS0FBSyxRQUFRLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUUsQ0FBQyxFQUFHO2dCQUNwRyxVQUFVLENBQUMsSUFBSSxDQUFFLGlCQUFpQixHQUFHLFlBQVksR0FBRyxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO2dCQUNuRixTQUFTLEdBQUcsSUFBSTtjQUNqQjtjQUNBLElBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUMsQ0FBQyxNQUFNLEVBQUk7Z0JBQ2hFLFNBQVMsR0FBRyxJQUFJO2NBQ2pCO2NBRUEsSUFBSyxTQUFTLEVBQUc7Z0JBQ2hCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2NBQzVCO2NBQ0E7QUFDTjtBQUNBO1lBRUs7WUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQ3RDO1FBQ0QsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asb0JBQW9CLEVBQ3BCLFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLEdBQWEsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUMxQixVQUFVLEdBQUksQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBa0IsQ0FBQztVQUN6QyxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztVQUMxQyxPQUFPLEdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBRSxjQUFlLENBQUM7VUFDdEMsT0FBTyxHQUFPLENBQUMsQ0FBRSx5QkFBeUIsR0FBRyxVQUFXLENBQUM7VUFDekQsSUFBSSxHQUFVO1lBQ2IsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO1lBQzdDLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLE9BQU8sRUFBRTtZQUNUO1VBQ0QsQ0FBQztRQUNGLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRO1VBQ3hCLElBQUksRUFBRSxJQUFJO1VBQ1YsTUFBTSxFQUFFLE1BQU07VUFDZCxRQUFRLEVBQUUsTUFBTTtVQUNoQixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLENBQUM7VUFDeEIsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFDO1VBQzFCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUM1QixJQUFJLFNBQVMsR0FBVSxRQUFRLENBQUMsU0FBUztjQUN4QyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsT0FBTztZQUVwQyxJQUFJLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxFQUFFO2NBQy9CLE9BQU8sQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO2NBQy9CLElBQUssT0FBTyxlQUFlLEtBQUssV0FBVyxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7Z0JBRXhFLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUN2QixlQUFlLEVBQ2YsVUFBVSxDQUFDLEVBQUU7a0JBQ1osT0FBTyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBRSxPQUFRLENBQUM7Z0JBQ3pDLENBQ0QsQ0FBQztnQkFDRCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLGVBQWdCLENBQUUsQ0FBQztjQUNsRTtZQUNEO1lBQ0EsSUFBSyxDQUFFLENBQUMsQ0FBQyxPQUFPLENBQUUsc0JBQXVCLENBQUMsQ0FBQyxNQUFNLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsRUFBRTtjQUN2RixNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO1lBQ2pDO1lBQ0EsSUFBSSxNQUFNLEtBQUssUUFBUSxDQUFDLE1BQU0sSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFxQixDQUFDLEVBQUU7Y0FDMUYsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFxQixDQUFDO1lBQ3ZEO1lBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDM0I7QUFDTDtBQUNBOztZQUVLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFckMsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBRSw2QkFBNkIsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFFLENBQUM7VUFDN0U7UUFDRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILHNCQUFzQixFQUN0QixVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUU7UUFDbkIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTyxDQUFDO1VBQ3JDLFVBQVUsR0FBVSxJQUFJLENBQUMsVUFBVTtVQUNuQyxZQUFZLEdBQVEsSUFBSSxDQUFDLFlBQVk7VUFDckMsT0FBTyxHQUFhLENBQUMsQ0FBRSxrREFBa0QsR0FBRyxVQUFVLEdBQUcsSUFBSyxDQUFDO1VBQy9GLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUM7UUFDNUYsSUFBSyxDQUFFLFVBQVUsSUFBSSxDQUFFLFlBQVksSUFBSSxDQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUU7VUFDeEQ7UUFDRDtRQUNBLElBQUssQ0FBRSxpQkFBaUIsSUFBSSxDQUFFLElBQUksQ0FBQyxXQUFXLEVBQUU7VUFDL0MsT0FBTyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxNQUFPLENBQUM7UUFDL0QsQ0FBQyxNQUFNO1VBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFPLENBQUM7UUFDbEU7UUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7UUFDakYsSUFBSyxPQUFPLEVBQUc7VUFDZCxJQUFJLEtBQUssR0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztVQUM5QixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBSSxhQUFhLEdBQUksS0FBSyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1lBQ2xELElBQUksSUFBSSxHQUFhLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYTtZQUNwRCxJQUFJLEtBQUssR0FBWSxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVc7WUFDbEQsSUFBSSxVQUFVLEdBQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUM7WUFDL0MsSUFBSSxHQUFHLEdBQWMsS0FBSyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBRSxLQUFNLENBQUM7WUFDMUUsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSw2QkFBOEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZFLElBQUksYUFBYSxHQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsY0FBYztZQUU5RSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxhQUFjLENBQUM7WUFDdkQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUUsZ0JBQWdCLEVBQUUsYUFBYyxDQUFDO1lBRXRELEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLGFBQWMsQ0FBQztZQUN6RCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsRUFBRSxhQUFjLENBQUM7WUFFeEQsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFFLGNBQWUsQ0FBQyxFQUFFO2NBQzVELEdBQUcsR0FBRyxPQUFPLEtBQUssVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFJLFdBQVcsS0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFJO1lBQzFIO1lBRUEsS0FBSyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxLQUFNLENBQUM7WUFDaEQsS0FBSyxDQUFDLElBQUksQ0FBRSxtQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUM7WUFDOUMsS0FBSyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBRSxLQUFLLEVBQUUsR0FBSSxDQUFDO1VBRTNEO1FBQ0Q7UUFFQSxPQUFPLENBQUMsSUFBSSxDQUNYLFlBQVk7VUFDWCxJQUFJLENBQUMsR0FBVyxDQUFDLENBQUUsSUFBSyxDQUFDO1lBQ3hCLFNBQVMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDO1VBRWxELENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXdCLEVBQUUsVUFBVyxDQUFDO1VBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsWUFBYSxDQUFDO1VBRXpDLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUVyQixTQUFTLENBQ1AsV0FBVyxDQUNYLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRTtjQUNyQixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUUsNEJBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBSSxDQUFDO1lBQ2pFLENBQ0QsQ0FBQyxDQUNBLFFBQVEsQ0FBRSx3QkFBd0IsR0FBRyxZQUFhLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO1VBQzlFO1VBQ0EsU0FBUyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBRSxjQUFlLENBQUMsQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLFlBQWEsQ0FBRSxDQUFDO1VBQ2xJLFNBQVMsQ0FBQyxJQUFJLENBQUUsNkJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLFlBQWEsQ0FBRSxDQUFDO1VBQzFJLENBQUMsQ0FBQyxJQUFJLENBQ0wsZUFBZSxFQUNmLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNmLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxZQUFZLEVBQUU7Y0FDN0UsU0FBUyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUM7Y0FDOUIsU0FBUyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsV0FBWSxDQUFDO2NBQ2hGLFNBQVMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxPQUFRLENBQUM7WUFDekU7VUFFRCxDQUNELENBQUM7UUFDRixDQUNELENBQUM7TUFDRixDQUNELENBQUM7TUFDRCxDQUFDLENBQUMsRUFBRSxDQUNILFlBQVksRUFDWixVQUFVLEVBQUUsRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFZLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTyxDQUFDO1VBQzlCLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQztVQUNuQyxPQUFPLEdBQU0sQ0FBQyxDQUFFLGtEQUFrRCxHQUFHLFVBQVUsR0FBRyxJQUFLLENBQUM7UUFDekYsSUFBSyxDQUFFLFVBQVUsSUFBSSxDQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUU7VUFDdEM7UUFDRDtRQUVBLE9BQU8sQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDO1FBQ2pFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQztRQUNqRixJQUFLLE9BQU8sRUFBRztVQUNkLElBQUksS0FBSyxHQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1VBQzlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLDZCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkUsSUFBSSxhQUFhLEdBQUksS0FBSyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1lBQ2xELElBQUksSUFBSSxHQUFhLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYTtZQUNwRCxJQUFJLEtBQUssR0FBWSxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVc7WUFFbEQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBRSxLQUFNLENBQUM7WUFFL0QsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUUsY0FBZSxDQUFDO1lBQ3hELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFFLGdCQUFnQixFQUFFLGFBQWMsQ0FBQztZQUV0RCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxjQUFlLENBQUM7WUFDMUQsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUUsZ0JBQWdCLEVBQUUsYUFBYyxDQUFDO1lBRXhELEtBQUssQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUUsS0FBTSxDQUFDO1lBQ2hELEtBQUssQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDO1lBQzlDLEtBQUssQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUUsS0FBSyxFQUFFLEdBQUksQ0FBQztVQUUzRDtRQUNEO1FBRUEsT0FBTyxDQUFDLElBQUksQ0FDWCxZQUFZO1VBQ1gsSUFBSSxDQUFDLEdBQVcsQ0FBQyxDQUFFLElBQUssQ0FBQztZQUN4QixTQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQztVQUVsRCxDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF3QixFQUFFLFVBQVcsQ0FBQztVQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFVBQVcsQ0FBQztVQUV2QyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFFckIsU0FBUyxDQUNQLFdBQVcsQ0FDWCxVQUFVLENBQUMsRUFBRSxPQUFPLEVBQUU7Y0FDckIsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFFLEdBQUksQ0FBQztZQUNqRSxDQUNELENBQUMsQ0FDQSxRQUFRLENBQUUsd0JBQXdCLEdBQUcsVUFBVyxDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVMsQ0FBQztVQUM1RTtVQUNBLFNBQVMsQ0FBQyxJQUFJLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUUsY0FBZSxDQUFDLENBQUMsT0FBTyxDQUFFLGFBQWEsRUFBRSxVQUFXLENBQUUsQ0FBQztVQUNoSSxTQUFTLENBQUMsSUFBSSxDQUFFLDZCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFFLGFBQWEsRUFBRSxVQUFXLENBQUUsQ0FBQztVQUN4SSxDQUFDLENBQUMsSUFBSSxDQUNMLGVBQWUsRUFDZixVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDZixJQUFJLE9BQU8sQ0FBQyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksVUFBVSxFQUFFO2NBQzNFLFNBQVMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDO2NBQzlCLFNBQVMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLFdBQVksQ0FBQztjQUNoRixTQUFTLENBQUMsSUFBSSxDQUFFLG9CQUFxQixDQUFDLENBQUMsSUFBSSxDQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsT0FBUSxDQUFDO1lBQ3pFO1VBRUQsQ0FDRCxDQUFDO1FBQ0YsQ0FDRCxDQUFDO01BRUYsQ0FDRCxDQUFDO01BQ0Q7TUFDSTs7TUFFSixDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxnQ0FBZ0MsRUFDaEMsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLG1CQUFvQixDQUFDO1FBQ3JELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUNELENBQUMsQ0FBQyxFQUFFLENBQ0gsc0JBQXNCLEVBQ3RCLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRTtRQUNuQixJQUFJLFVBQVUsR0FBSyxJQUFJLENBQUMsVUFBVTtVQUNqQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVk7UUFDakMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFhLENBQUM7TUFDcEUsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxZQUFZLEVBQ1osVUFBVSxFQUFFLEVBQUU7UUFDYixJQUFJLENBQUMsR0FBWSxDQUFDLENBQUUsRUFBRSxDQUFDLE1BQU8sQ0FBQztVQUM5QixVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUM7UUFDcEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUUsSUFBSSxFQUFHLFVBQVUsRUFBRSxVQUFXLENBQUM7UUFDbEUsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsVUFBVSxDQUFDLG1DQUFvQyxDQUFDLEVBQUc7VUFDMUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLHlCQUF5QixHQUFHLFVBQVcsQ0FBQztVQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFFLHNCQUF1QixDQUFDLENBQUMsUUFBUSxDQUFFLGdCQUFpQixDQUFDO1FBQ2pFO01BQ0QsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxnQkFBZ0IsRUFDaEIsa0JBQWtCLEVBQ2xCLFVBQVUsQ0FBQyxFQUFFO1FBQ1osSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLHlCQUF5QixHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFFLENBQUM7UUFDMUUsSUFBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsVUFBVSxDQUFDLG1DQUFvQyxDQUFDLEVBQUc7VUFDN0YsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUUsc0JBQXVCLENBQUMsQ0FBQyxRQUFRLENBQUUsZ0JBQWlCLENBQUM7UUFDakU7TUFDRCxDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUseUJBQXlCLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUUsQ0FBQztRQUMxRSxJQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1VBQ3RCLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNsQixJQUFJLENBQUMsSUFBSSxDQUFFLHNCQUF1QixDQUFDLENBQUMsV0FBVyxDQUFFLGdCQUFpQixDQUFDO1FBQ3BFO01BQ0QsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsNERBQTRELEVBQzVELFVBQVMsRUFBRSxFQUFFO1FBQ1osRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyw4QkFBK0IsQ0FBQztRQUNoRSxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx3QkFBd0IsRUFDeEIsVUFBVSxFQUFFLEVBQUU7UUFFYixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNoQyxVQUFVLEdBQVUsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBa0IsQ0FBQztVQUMvQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF5QixDQUFDO1VBQ3RELGFBQWEsR0FBTyxJQUFJO1VBQ3hCLEtBQUssR0FBZSxDQUFDLENBQUMsT0FBTyxDQUFFLGNBQWUsQ0FBQztVQUMvQyxPQUFPLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBRSw4REFBK0QsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7VUFDbkgsYUFBYSxHQUFPLEtBQUssQ0FBQyxJQUFJLENBQUUsb0VBQXFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1VBQ3pILFlBQVksR0FBUSxLQUFLLENBQUMsSUFBSSxDQUFFLG1FQUFvRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztVQUN4SCxTQUFTLEdBQVcsS0FBSyxDQUFDLElBQUksQ0FBRSxnRUFBaUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7VUFDckgsS0FBSyxHQUFlLEtBQUssQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSztVQUNySSxJQUFJLEdBQWdCO1lBQ25CLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLDhCQUE4QjtZQUN6RCxPQUFPLEVBQUUsVUFBVTtZQUNuQixlQUFlLEVBQUUsVUFBVTtZQUMzQixZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBb0IsQ0FBQztZQUMzQyxPQUFPLEVBQUcsT0FBTztZQUNqQixhQUFhLEVBQUUsYUFBYTtZQUM1QixZQUFZLEVBQUcsWUFBWTtZQUMzQixTQUFTLEVBQUksU0FBUztZQUN0QixXQUFXLEVBQUc7VUFDZixDQUFDO1FBRUYsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLElBQUssS0FBSyxLQUFLLEtBQUssSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFHO1VBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBd0IsQ0FBQztVQUN6RDtRQUNEO1FBQ0EsSUFBSyxLQUFLLEtBQUssS0FBSyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFHO1VBQzNELE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxxQkFBc0IsQ0FBQztVQUN2RDtRQUNEOztRQUVBO1FBQ0EsSUFBSSxhQUFhLEtBQUssQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBRSw0QkFBNEIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQyxFQUFFO1VBQzlGLElBQUksR0FBRyxhQUFhO1FBQ3JCO1FBRUEsSUFBSSxvQkFBb0I7UUFFeEIsSUFBSyxDQUFDLENBQUUsMENBQTBDLEdBQUcsaUJBQWlCLEdBQUcsb0RBQW9ELEdBQUcsaUJBQWlCLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRW5LLG9CQUFvQixHQUFHLENBQUMsQ0FBRSwwQ0FBMEMsR0FBRyxpQkFBaUIsR0FBRyxvREFBb0QsR0FBRyxpQkFBaUIsR0FBRyxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXJMLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsc0RBQXVELENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFaEcsb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzREFBdUQsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFM0csQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFFLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxtQ0FBbUMsR0FBRyxpQkFBaUIsR0FBRywrQkFBZ0MsQ0FBQyxDQUFDLE1BQU0sRUFBSTtVQUV0SixvQkFBb0IsR0FBRyxDQUFDLENBQUUsV0FBVyxHQUFHLGlCQUFpQixHQUFHLG1DQUFtQyxHQUFHLGlCQUFpQixHQUFHLCtCQUFnQyxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUVoSyxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUMsMkRBQTJELEdBQUcsaUJBQWlCLEdBQUcsb0VBQW9FLEdBQUcsaUJBQWlCLEdBQUcsNkRBQTZELEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRTdSLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQywyREFBMkQsR0FBRyxpQkFBaUIsR0FBRyxvRUFBb0UsR0FBRyxpQkFBaUIsR0FBRyw2REFBNkQsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7VUFDclIsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXREO1FBRUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQztRQUM3QixJQUFNLE9BQU8sb0JBQW9CLEtBQUssV0FBVyxJQUFJLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDckYsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBRSxDQUFFLENBQUUsQ0FBQztVQUN4RCxRQUFRLFVBQU8sQ0FBRSxhQUFjLENBQUM7UUFDakM7UUFFQSxDQUFDLENBQUMsSUFBSSxDQUNMLElBQUksRUFDSixVQUFTLEdBQUcsRUFBQyxRQUFRLEVBQUM7VUFDckIsUUFBUSxDQUFDLE1BQU0sQ0FBRSxHQUFHLEVBQUcsUUFBQSxDQUFPLFFBQVEsTUFBSyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxRQUFTLENBQUMsR0FBRyxRQUFTLENBQUM7UUFDOUYsQ0FDRCxDQUFDO1FBRUQsTUFBTSxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUM7UUFFN0QsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtVQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztVQUNqRDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsaUJBQWlCO1VBQ2pDLElBQUksRUFBRSxRQUFRO1VBQ2QsSUFBSSxFQUFFLE1BQU07VUFDWjtVQUNBLFdBQVcsRUFBRSxLQUFLO1VBQ2xCLFdBQVcsRUFBRSxLQUFLO1VBQ2xCLEtBQUssRUFBRSxLQUFLO1VBQ1osVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBQztVQUMxQixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxlQUFlLEdBQUksUUFBUSxDQUFDLE1BQU07Y0FDckMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE9BQU87Y0FDbkMsVUFBVSxHQUFTLElBQUk7WUFFeEIsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFHO2NBRWhDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2NBRTNCLEtBQUssQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO2NBRXJCLElBQUksVUFBVSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFpQixDQUFDLEVBQUc7Z0JBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUUsZ0JBQWlCLENBQUM7Y0FDbkM7Y0FDQSxJQUFJLFNBQVMsR0FBRyxVQUFVO2NBQzFCLElBQUksT0FBTyxLQUFLLENBQUMsRUFBRSxTQUFTLElBQUksVUFBVTtjQUMxQyxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUUsU0FBUyxJQUFJLGVBQWU7Y0FDcEQsSUFBSSxhQUFhLEtBQUssQ0FBQyxFQUFFLFNBQVMsSUFBSSxnQkFBZ0I7Y0FDdEQsSUFBSSxTQUFTLEtBQUssQ0FBQyxFQUFFLFNBQVMsSUFBSSxZQUFZO2NBRTlDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxxQkFBc0IsQ0FBQztZQUVqSTtZQUVBLElBQUssVUFBVSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBQyxPQUFRLENBQUMsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFHO2NBQ3BGLE1BQU0sQ0FBQyxLQUFLLENBQUUsZ0JBQWlCLENBQUM7WUFDakM7VUFFRDtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUNELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLDBCQUEwQixFQUMxQixVQUFVLEVBQUUsRUFBRTtRQUViLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLFVBQVUsR0FBVSxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDO1VBQy9DLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXlCLENBQUM7VUFDdEQsV0FBVyxHQUFTLENBQUMsQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxJQUFJLENBQUUseUJBQTBCLENBQUM7VUFDN0YsYUFBYSxHQUFPLElBQUk7VUFDeEIsS0FBSyxHQUFlLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSztVQUM3RSxJQUFJLEdBQWdCO1lBQ25CLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLDhCQUE4QjtZQUN6RCxPQUFPLEVBQUUsVUFBVTtZQUNuQixlQUFlLEVBQUUsVUFBVTtZQUMzQixZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBb0IsQ0FBQztZQUMzQyxPQUFPLEVBQUcsQ0FBQztZQUNYLGFBQWEsRUFBRyxDQUFDO1lBQ2pCLFlBQVksRUFBRyxDQUFDO1lBQ2hCLFNBQVMsRUFBSSxDQUFDO1lBQ2QsV0FBVyxFQUFJO1VBQ2hCLENBQUM7UUFDRixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsSUFBSyxLQUFLLEtBQUssS0FBSyxJQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUc7VUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHVCQUF3QixDQUFDO1VBQ3pEO1FBQ0Q7UUFDQSxJQUFLLEtBQUssS0FBSyxLQUFLLElBQUksQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUc7VUFDM0QsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHFCQUFzQixDQUFDO1VBQ3ZEO1FBQ0Q7UUFDQTtRQUNBLElBQUksYUFBYSxLQUFLLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxjQUFjLENBQUUsNEJBQTRCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFFLENBQUMsRUFBRTtVQUM5RixJQUFJLEdBQUcsYUFBYTtRQUNyQjtRQUVBLElBQUksb0JBQW9CO1FBRXhCLElBQUssQ0FBQyxDQUFFLDBDQUEwQyxHQUFHLGlCQUFpQixHQUFHLG9EQUFvRCxHQUFHLGlCQUFpQixHQUFHLElBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRztVQUVuSyxvQkFBb0IsR0FBRyxDQUFDLENBQUUsMENBQTBDLEdBQUcsaUJBQWlCLEdBQUcsb0RBQW9ELEdBQUcsaUJBQWlCLEdBQUcsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUVyTCxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHNEQUF1RCxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRWhHLG9CQUFvQixHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsc0RBQXVELENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRTNHLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBRSxXQUFXLEdBQUcsaUJBQWlCLEdBQUcsbUNBQW1DLEdBQUcsaUJBQWlCLEdBQUcsK0JBQWdDLENBQUMsQ0FBQyxNQUFNLEVBQUk7VUFFdEosb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxtQ0FBbUMsR0FBRyxpQkFBaUIsR0FBRywrQkFBZ0MsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFaEssQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFDLDJEQUEyRCxHQUFHLGlCQUFpQixHQUFHLG9FQUFvRSxHQUFHLGlCQUFpQixHQUFHLDZEQUE2RCxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRztVQUU3UixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsMkRBQTJELEdBQUcsaUJBQWlCLEdBQUcsb0VBQW9FLEdBQUcsaUJBQWlCLEdBQUcsNkRBQTZELEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1VBQ3JSLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUV0RDtRQUVBLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUM7UUFDN0IsSUFBTSxPQUFPLG9CQUFvQixLQUFLLFdBQVcsSUFBSSxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ3JGLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBRSxvQkFBb0IsQ0FBQyxHQUFHLENBQUUsQ0FBRSxDQUFFLENBQUM7VUFDeEQsUUFBUSxVQUFPLENBQUUsYUFBYyxDQUFDO1FBQ2pDO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTCxJQUFJLEVBQ0osVUFBUyxHQUFHLEVBQUMsUUFBUSxFQUFDO1VBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQUUsR0FBRyxFQUFHLFFBQUEsQ0FBTyxRQUFRLE1BQUssUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUUsUUFBUyxDQUFDLEdBQUcsUUFBUyxDQUFDO1FBQzlGLENBQ0QsQ0FBQztRQUVELE1BQU0sQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLDBCQUEyQixDQUFDO1FBRTdELElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUU7VUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGVBQWdCLENBQUM7VUFDakQ7UUFDRDtRQUVBLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLGlCQUFpQjtVQUNqQyxJQUFJLEVBQUUsUUFBUTtVQUNkLElBQUksRUFBRSxNQUFNO1VBQ1o7VUFDQSxXQUFXLEVBQUUsS0FBSztVQUNsQixXQUFXLEVBQUUsS0FBSztVQUNsQixLQUFLLEVBQUUsS0FBSztVQUNaLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBQzVCLElBQUksZUFBZSxHQUFJLFFBQVEsQ0FBQyxNQUFNO2NBQ3JDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPO2NBQ25DLFVBQVUsR0FBUyxJQUFJO1lBRXhCLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUVoQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztjQUUzQixJQUFLLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQyxFQUFHO2dCQUN0RCxNQUFNLENBQUMsT0FBTyxDQUFFLGdCQUFpQixDQUFDO2NBQ25DO2NBQ0EsQ0FBQyxDQUFFLDJCQUEyQixHQUFHLFVBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUM7Y0FFbEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLHFCQUFzQixDQUFDO1lBRXZJO1lBRUEsSUFBSyxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE9BQVEsQ0FBQyxJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUc7Y0FDcEYsTUFBTSxDQUFDLEtBQUssQ0FBRSxnQkFBaUIsQ0FBQztZQUNqQztVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsMEJBQTBCLEVBQzFCLFVBQVUsRUFBRSxFQUFFO1FBRWIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDaEMsVUFBVSxHQUFVLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUM7VUFDL0MsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztVQUN0RCxJQUFJLEdBQWdCO1lBQ25CLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLDhCQUE4QjtZQUN6RCxPQUFPLEVBQUUsVUFBVTtZQUNuQixlQUFlLEVBQUUsVUFBVTtZQUMzQixZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBb0IsQ0FBQztZQUMzQyxPQUFPLEVBQUcsQ0FBQztZQUNYLGFBQWEsRUFBRyxDQUFDO1lBQ2pCLFlBQVksRUFBRyxDQUFDO1lBQ2hCLFNBQVMsRUFBSTtVQUNkLENBQUM7UUFFRixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtVQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztVQUNqRDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsaUJBQWlCO1VBQ2pDLElBQUksRUFBRSxJQUFJO1VBQ1YsSUFBSSxFQUFFLE1BQU07VUFDWixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLENBQUM7VUFDeEIsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFDO1VBQzFCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUM1QixJQUFJLGVBQWUsR0FBSSxRQUFRLENBQUMsTUFBTTtjQUNyQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsT0FBTztjQUNuQyxVQUFVLEdBQVMsSUFBSTtZQUV4QixJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUc7Y0FFaEMsSUFBSSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsRUFBRTtnQkFDcEQsTUFBTSxDQUFDLEtBQUssQ0FBRSxnQkFBaUIsQ0FBQztjQUNqQztjQUNBLENBQUMsQ0FBRSwyQkFBMkIsR0FBRyxVQUFXLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO2NBQ3JFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTVCO1lBRUEsSUFBSyxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE9BQVEsQ0FBQyxJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUc7Y0FDcEYsTUFBTSxDQUFDLEtBQUssQ0FBRSxnQkFBaUIsQ0FBQztZQUNqQztVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BQ0Q7TUFDSTs7TUFFSixJQUFJLGNBQWMsR0FBRyxFQUFFO01BRXZCLENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLDBDQUEwQyxFQUMxQyxZQUFXO1FBQ1YsSUFBSSxVQUFVLEdBQUssQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEQsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7UUFDcEYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBa0IsQ0FBQztRQUU5RixJQUFJLGVBQWUsR0FBRyxDQUFDO1FBQ3ZCLElBQUssSUFBSSxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUMsQ0FBQyxJQUFJLENBQzdCLFlBQVc7WUFDVixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV6QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsVUFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Y0FDcEMsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQ2hCLGVBQWUsRUFBRTtZQUNsQixDQUFDLE1BQU07Y0FDTixDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakI7VUFDRCxDQUNELENBQUM7VUFDRCxJQUFJLGVBQWUsS0FBSyxDQUFDLEVBQUU7WUFDMUIsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1VBQ3BCLENBQUMsTUFBTTtZQUNOLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztVQUNwQjtRQUNELENBQUMsTUFBTTtVQUNOLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxHQUFHLENBQUUsRUFBRyxDQUFDO1FBQ3BCO01BQ0QsQ0FDRCxDQUFDOztNQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O01BRUEsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asd0JBQXdCLEVBQ3hCLFlBQVc7UUFDVixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUUsR0FBRyxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsc0JBQXVCLENBQUUsQ0FBQztRQUN0RSxJQUFJLFdBQVcsR0FBSSxDQUFDLENBQUUsR0FBRyxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUscUJBQXNCLENBQUUsQ0FBQztRQUVyRSxZQUFZLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztRQUU1QixJQUFNLGNBQWMsR0FBRztVQUN0QixRQUFRLEVBQUUsS0FBSztVQUNmLEtBQUssRUFBRSxNQUFNO1VBQ2IsVUFBVSxFQUFFLFVBQVU7VUFDdEIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUUsWUFBYSxDQUFDO1VBQzVDLFFBQVEsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFFLFVBQVc7UUFDeEMsQ0FBQztRQUVELFdBQVcsQ0FBQyxLQUFLLENBQUEsYUFBQSxDQUFBLGFBQUEsS0FFWixjQUFjO1VBQ2pCLE9BQU8sRUFBRSxTQUFBLFFBQUEsRUFBVztZQUNuQixZQUFZLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztZQUM1QixXQUFXLENBQUMsS0FBSyxDQUFBLGFBQUEsQ0FBQSxhQUFBLEtBRVosY0FBYztjQUNqQixPQUFPLEVBQUU7WUFBSSxFQUVmLENBQUM7VUFDRjtRQUFDLEVBRUgsQ0FBQztRQUVELFdBQVcsQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO01BRTVCLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHVCQUF1QixFQUN2QixVQUFTLEVBQUUsRUFBRTtRQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBVSxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQzFCLEdBQUcsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFFLG9CQUFxQixDQUFDO1VBQ2xELFdBQVcsR0FBRyxRQUFRLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxjQUFlLENBQUUsQ0FBQztVQUNyRCxXQUFXLEdBQUcsQ0FBQyxLQUFLLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQztVQUN2QyxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztVQUM1QyxJQUFJLEdBQVUsSUFBSSxDQUFDLElBQUksQ0FBRSxHQUFJLENBQUM7VUFDOUIsVUFBVSxHQUFJLENBQUMsQ0FBRSxjQUFjLEdBQUcsV0FBWSxDQUFDO1FBRWhELENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtVQUNuQyxJQUFJLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUI7WUFDaEQsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1lBQzNCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLGFBQWEsRUFBRyxXQUFXO1lBQzNCLGNBQWMsRUFBRztVQUNsQixDQUFDO1VBQ0QsTUFBTSxFQUFFLE1BQU07VUFDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDM0IsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsSUFBSyxDQUFDO1VBQzdCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtZQUN4QixJQUFLLENBQUUsSUFBSSxFQUFHO2NBQ2I7WUFDRDtZQUNBLElBQUksQ0FBQyxXQUFXLENBQUUsbUNBQW9DLENBQUM7WUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBRSxXQUFXLEtBQUssQ0FBQyxHQUFHLGlCQUFpQixHQUFHLG1CQUFvQixDQUFDO1lBQzVFLFVBQVUsQ0FBQyxJQUFJLENBQUUsb0NBQW9DLEdBQUcsV0FBVyxHQUFHLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsU0FBVSxDQUFDO1lBQ3pHLElBQUksQ0FBQyxJQUFJLENBQUUsY0FBYyxFQUFHLFdBQVksQ0FBQztZQUN6QyxJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUc7Y0FDdkIsQ0FBQyxDQUFDLGtEQUFrRCxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2NBQzlGLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUMsTUFBTTtjQUNOLENBQUMsQ0FBQyxrREFBa0QsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Y0FDakcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0I7VUFDRDtRQUVELENBQ0QsQ0FBQztRQUNELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLG9CQUFvQixFQUNwQixVQUFTLEVBQUUsRUFBRTtRQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBVSxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQzFCLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQztVQUN4QyxLQUFLLEdBQUksQ0FBQyxDQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLFVBQVcsQ0FBRSxDQUFDO1VBQzNDLEdBQUcsR0FBVyxDQUFDLENBQUUsNkNBQTZDLEdBQUcsV0FBVyxHQUFHLDhCQUE4QixHQUFHLFdBQVcsR0FBRyxtREFBbUQsR0FBRyxXQUFXLEdBQUcsSUFBSyxDQUFDO1VBQ3hNLEtBQUssR0FBUyxDQUFDLENBQUMsaUNBQWlDLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV4RSxDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxtQkFBbUI7VUFDbkMsSUFBSSxFQUFFO1lBQ0wsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO1lBQzdDLEtBQUssRUFBRSxDQUFDLENBQUUsY0FBZSxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztZQUMxQyxPQUFPLEVBQUUsVUFBVTtZQUNuQixXQUFXLEVBQUc7WUFDZDtVQUNELENBQUM7VUFDRCxNQUFNLEVBQUUsTUFBTTtVQUNkLEtBQUssRUFBRSxLQUFLO1VBQ1osVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7WUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsSUFBSyxDQUFDO1VBQzNCLENBQUM7VUFDRCxRQUFRLEVBQUUsU0FBQSxTQUFBLEVBQVk7WUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLElBQUssQ0FBQztVQUM3QixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxJQUFJLEVBQUU7WUFDeEIsSUFBSyxDQUFFLElBQUksRUFBRztjQUNiO1lBQ0Q7WUFDQSxJQUFLLENBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRztjQUNwQixNQUFNLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDN0IsQ0FBQyxNQUFNO2NBQ04sS0FBSyxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7Y0FDckIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2NBQ1osSUFBSSxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNsRCxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUNoRCxDQUFDLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztjQUNwRTtjQUNBLElBQUssS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQ3ZCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxjQUFjO2NBQ2pEO1lBQ0Q7WUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMzQjtBQUNMO0FBQ0E7VUFFSTtRQUVELENBQ0QsQ0FBQztRQUNELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLGtCQUFrQixFQUNsQixVQUFTLEVBQUUsRUFBRTtRQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBVSxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQzFCLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQztVQUN4QyxHQUFHLEdBQVcsQ0FBQyxDQUFFLDZDQUE2QyxHQUFHLFdBQVcsR0FBRyw4QkFBOEIsR0FBRyxXQUFXLEdBQUcsaUNBQWtDLENBQUM7VUFDakssS0FBSyxHQUFJLENBQUMsQ0FBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFXLENBQUUsQ0FBQztVQUMzQyxPQUFPLEdBQUksUUFBUSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsb0NBQXFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO1VBQy9FLElBQUksR0FBSyxLQUFLLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7VUFDdEQsSUFBSSxHQUFLLEtBQUssQ0FBQyxJQUFJLENBQUUsb0NBQXFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUNqRSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQztRQUNwRCxJQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQyxFQUFHO1VBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyw2QkFBOEIsQ0FBQztVQUMvRCxPQUFPLEtBQUs7UUFDYjtRQUNBLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtVQUNuQyxJQUFJLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0I7WUFDN0MsS0FBSyxFQUFFLENBQUMsQ0FBRSxjQUFlLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDO1lBQzFDLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFdBQVcsRUFBRyxXQUFXO1lBQ3pCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFNBQVMsRUFBQyxJQUFJO1lBQ2QsaUJBQWlCLEVBQUM7VUFDbkIsQ0FBQztVQUNELE1BQU0sRUFBRSxNQUFNO1VBQ2QsS0FBSyxFQUFFLEtBQUs7VUFDWixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDM0IsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsSUFBSyxDQUFDO1VBQzdCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtZQUN4QixJQUFLLENBQUUsSUFBSSxFQUFHO2NBQ2I7WUFDRDtZQUNBLElBQUssQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHO2NBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUM3QixDQUFDLE1BQU07Y0FDTixLQUFLLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztjQUNyQixHQUFHLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUM7Y0FDckMsR0FBRyxDQUFDLElBQUksQ0FBRSxZQUFhLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDO2NBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUUsdUJBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUUsY0FBYyxFQUFFLE9BQVEsQ0FBQztjQUNuRSxXQUFXLENBQUMsV0FBVyxDQUFFLG1DQUFvQyxDQUFDO2NBQzlELFdBQVcsQ0FBQyxRQUFRLENBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxtQkFBbUIsR0FBRyxpQkFBa0IsQ0FBQztjQUMvRSxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUc7Z0JBQ25CLENBQUMsQ0FBQyxrREFBa0QsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDOUYsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Y0FDM0IsQ0FBQyxNQUFNO2dCQUNOLENBQUMsQ0FBQyxrREFBa0QsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Z0JBQ2pHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQzNCO1lBQ0Q7VUFFRDtRQUVELENBQ0QsQ0FBQztRQUNELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLGlCQUFpQixFQUNqQixVQUFTLEVBQUUsRUFBRTtRQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBTSxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ3RCLEtBQUssR0FBSyxDQUFDLENBQUUsaUJBQWtCLENBQUM7VUFDaEMsT0FBTyxHQUFHLFFBQVEsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFFLG9DQUFxQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztVQUM5RSxJQUFJLEdBQU0sS0FBSyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1VBQ3ZELElBQUksR0FBTSxLQUFLLENBQUMsSUFBSSxDQUFFLG9DQUFxQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFLLENBQUMsRUFBRztVQUM1QixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsNkJBQThCLENBQUM7VUFDL0QsT0FBTyxLQUFLO1FBQ2I7UUFDQSxDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxtQkFBbUI7VUFDbkMsSUFBSSxFQUFFO1lBQ0wsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsc0JBQXNCO1lBQ2pELEtBQUssRUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUMzQixPQUFPLEVBQUUsVUFBVTtZQUNuQixZQUFZLEVBQUUsT0FBTztZQUNyQixTQUFTLEVBQUMsSUFBSTtZQUNkLGlCQUFpQixFQUFDLElBQUk7WUFDdEIsU0FBUyxFQUFJLENBQUMsQ0FBRSxxQ0FBcUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFFLGNBQWU7VUFDdkosQ0FBQztVQUNELE1BQU0sRUFBRSxNQUFNO1VBQ2QsS0FBSyxFQUFFLEtBQUs7VUFDWixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxJQUFLLENBQUM7VUFDM0IsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsSUFBSyxDQUFDO1VBQzdCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLElBQUksRUFBRTtZQUN4QixJQUFLLENBQUUsSUFBSSxFQUFHO2NBQ2I7WUFDRDtZQUNBLElBQUssQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHO2NBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUM3QixDQUFDLE1BQU07Y0FDTixDQUFDLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztjQUN2RCxLQUFLLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztjQUMvQyxLQUFLLENBQUMsSUFBSSxDQUFFLGlDQUFrQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztjQUN2RCxLQUFLLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztjQUNyQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFFLGlCQUFrQixDQUFDO2NBQy9DLElBQUksSUFBSSxHQUFPLFFBQVEsQ0FBRSxJQUFLLENBQUM7Y0FDL0IsSUFBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDbEMsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsTUFBTSxDQUFFLElBQUssQ0FBQztnQkFDekMsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLGtDQUFrQyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxTQUFVLENBQUMsQ0FBQyxPQUFPLENBQUUsUUFBUyxDQUFDO2dCQUMvSSxDQUFDLENBQUUseUJBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQyxDQUFFLDZCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUMsQ0FBRSxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO2dCQUN4RCxDQUFDLENBQUUsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztjQUV6RCxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDekMsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsTUFBTSxDQUFFLElBQUssQ0FBQztnQkFDekMsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLGtDQUFrQyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxTQUFVLENBQUMsQ0FBQyxPQUFPLENBQUUsUUFBUyxDQUFDO2dCQUMvSSxDQUFDLENBQUUseUJBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQyxDQUFFLDZCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUMsQ0FBRSxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO2dCQUN4RCxDQUFDLENBQUUsaUNBQWlDLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztjQUV6RCxDQUFDLE1BQU07Z0JBQ04sQ0FBQyxDQUFFLDRCQUE2QixDQUFDLENBQUMsTUFBTSxDQUFFLElBQUssQ0FBQztnQkFDaEQsY0FBYyxDQUFDLElBQUksQ0FBRSxLQUFNLENBQUM7Z0JBQzVCLENBQUMsQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsd0JBQXdCLENBQUM7Z0JBQ3ZHLENBQUMsQ0FBRSw0QkFBNkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxrQ0FBa0MsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsU0FBVSxDQUFDLENBQUMsT0FBTyxDQUFFLFFBQVMsQ0FBQztnQkFDdEosQ0FBQyxDQUFFLGdDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLENBQUMsQ0FBRSxvQ0FBcUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRCxDQUFDLENBQUUsd0NBQXdDLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztnQkFDL0QsQ0FBQyxDQUFFLDZDQUE2QyxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7Z0JBQ3BFLENBQUMsQ0FBRSxzQ0FBc0MsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO2NBQzlEO2NBQ0EsUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUM7Y0FFN0MsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7Z0JBRW5DLElBQUksQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtrQkFDN0MsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7a0JBQ3JCLENBQUMsQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxJQUFLLENBQUM7a0JBQzlDLENBQUMsQ0FBRSw0QkFBNEIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxNQUFNLENBQUM7a0JBQ3JELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ2pDO2NBQ0Q7Y0FDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2NBRXpDLElBQUssQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQ25DLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUMsY0FBYyxDQUFFLENBQUM7Z0JBQ3JDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2NBQzVCLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7Z0JBQ2pELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFVLENBQUM7Y0FDL0M7WUFDRDtVQUNEO1FBRUQsQ0FDRCxDQUFDO1FBQ0QsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxzQkFBc0IsRUFDdEIsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFO1FBQ25CLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsRUFBRSxDQUFDLE1BQU8sQ0FBQztVQUNyQyxVQUFVLEdBQVUsSUFBSSxDQUFDLFVBQVU7VUFDbkMsWUFBWSxHQUFRLElBQUksQ0FBQyxZQUFZO1VBQ3JDLE9BQU8sR0FBYSxDQUFDLENBQUUsb0RBQW9ELEdBQUcsVUFBVSxHQUFHLElBQUssQ0FBQztVQUNqRyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFFLDBCQUEyQixDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDO1FBQzlGLElBQUssQ0FBRSxVQUFVLElBQUksQ0FBRSxZQUFZLElBQUksQ0FBRSxPQUFPLENBQUMsTUFBTSxFQUFFO1VBQ3hEO1FBQ0Q7UUFDQSxJQUFLLENBQUUsaUJBQWlCLElBQUksQ0FBRSxJQUFJLENBQUMsV0FBVyxFQUFFO1VBQy9DLE9BQU8sQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxRQUFRLENBQUUsTUFBTyxDQUFDO1FBQ2pFLENBQUMsTUFBTTtVQUNOLE9BQU8sQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDO1FBQ3BFO1FBRUEsT0FBTyxDQUFDLElBQUksQ0FDWCxZQUFZO1VBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNqQixDQUFDLENBQUMsSUFBSSxDQUFFLHdCQUF3QixFQUFFLFVBQVcsQ0FBQztVQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFlBQWEsQ0FBQztRQUMxQyxDQUNELENBQUM7UUFDRDtRQUNBLENBQUMsQ0FBRSxrRkFBa0YsR0FBRyxVQUFVLEdBQUcsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFlBQWEsQ0FBQztNQUNwSixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILFlBQVksRUFDWixVQUFVLEVBQUUsRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFZLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTyxDQUFDO1VBQzlCLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLFlBQWEsQ0FBQztVQUNuQyxPQUFPLEdBQU0sQ0FBQyxDQUFFLG9EQUFvRCxHQUFHLFVBQVUsR0FBRyxJQUFLLENBQUM7UUFDM0YsSUFBSyxDQUFFLFVBQVUsSUFBSSxDQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUU7VUFDdEM7UUFDRDtRQUVBLE9BQU8sQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxXQUFXLENBQUUsTUFBTyxDQUFDO1FBRW5FLE9BQU8sQ0FBQyxJQUFJLENBQ1gsWUFBWTtVQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDakIsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBd0IsRUFBRSxVQUFXLENBQUM7VUFDOUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsRUFBRSxVQUFXLENBQUM7UUFDeEMsQ0FDRCxDQUFDO1FBQ0Q7UUFDQSxDQUFDLENBQUUsa0ZBQWtGLEdBQUcsVUFBVSxHQUFHLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxpQkFBaUIsRUFBRSxVQUFXLENBQUM7TUFDbEosQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asa0RBQWtELEVBQ2xELFVBQVUsRUFBRSxFQUFFO1FBRWIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDaEMsS0FBSyxHQUFPLENBQUMsQ0FBRSxhQUFjLENBQUM7VUFDOUIsUUFBUSxHQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRXRDLEtBQUssQ0FBQyxJQUFJLENBQUUscUJBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZSxFQUFFLFFBQVMsQ0FBQztRQUVyRSxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxrREFBa0QsRUFDbEQsVUFBVSxFQUFFLEVBQUU7UUFFYixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNoQyxLQUFLLEdBQU8sQ0FBQyxDQUFFLGFBQWMsQ0FBQztVQUM5QixRQUFRLEdBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFdEMsS0FBSyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLEVBQUUsUUFBUyxDQUFDO1FBRXJFLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHlEQUF5RCxFQUN6RCxVQUFVLEVBQUUsRUFBRTtRQUViLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLFVBQVUsR0FBVSxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFrQixDQUFDO1VBQy9DLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXlCLENBQUM7VUFDdEQsWUFBWSxHQUFRLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW9CLENBQUM7VUFDakQsZUFBZSxHQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsc0JBQXVCLENBQUM7VUFDcEQsYUFBYSxHQUFPLENBQUMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUM7VUFDbEQsU0FBUyxHQUFXLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUM7VUFDOUMsS0FBSyxHQUFtQixDQUFDLENBQUUsb0JBQXFCLENBQUM7VUFDakQsSUFBSSxHQUFnQjtZQUNuQixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7WUFDNUMsT0FBTyxFQUFFLFVBQVU7WUFDbkIsVUFBVSxFQUFFLFVBQVU7WUFDdEIsZUFBZSxFQUFFO1VBQ2xCLENBQUM7O1FBRUY7UUFDQSxJQUFJLE9BQU8sYUFBYSxLQUFLLFdBQVcsRUFBRTtVQUN6QyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWE7VUFDbEMsS0FBSyxDQUFDLElBQUksQ0FBRSwwQkFBMkIsQ0FBQyxDQUFDLElBQUksQ0FBRSxvQkFBb0IsRUFBRSxhQUFjLENBQUM7UUFDckY7UUFFQSxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBRTtVQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFFLDBCQUEyQixDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFnQixFQUFFLFNBQVUsQ0FBQztRQUM3RTtRQUVBLEtBQUssQ0FBQyxJQUFJLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxJQUFJLENBQUUsbUJBQW1CLEVBQUUsWUFBYSxDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixFQUFFLFVBQVcsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBd0IsRUFBRSxpQkFBa0IsQ0FBQztRQUU1SyxJQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO1VBQ3RDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixNQUFNLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztVQUNqRDtRQUNEO1FBRUEsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsbUJBQW1CO1VBQ25DLElBQUksRUFBRSxJQUFJO1VBQ1YsSUFBSSxFQUFFLE1BQU07VUFDWixVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2NBQ3hDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQztZQUN2RDtZQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFFLDhCQUErQixDQUFFLENBQUM7VUFFakUsQ0FBQztVQUNELFFBQVEsRUFBRSxTQUFBLFNBQUEsRUFBWTtZQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSw4QkFBK0IsQ0FBRSxDQUFDO1VBQ25FLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUM1QixJQUFJLGVBQWUsR0FBSSxRQUFRLENBQUMsTUFBTTtjQUNyQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsT0FBTztjQUNuQyxJQUFJLEdBQWUsUUFBUSxDQUFDLElBQUk7Y0FDaEMsYUFBYSxHQUFJLFFBQVEsQ0FBQyxhQUFhO2NBQ3ZDLFVBQVUsR0FBUyxJQUFJO1lBRXhCLElBQUssZUFBZSxLQUFLLE1BQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRztjQUNwRCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFFLGlCQUFrQixDQUFDO2NBQy9DLElBQUksSUFBSSxHQUFPLEVBQUU7Y0FDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksSUFBSSxRQUFRLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDO2NBQzVCO2NBQ0EsS0FBSyxDQUFDLElBQUksQ0FBRSxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUUsT0FBUSxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQztjQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUUsYUFBYSxDQUFDLE1BQU8sQ0FBQztjQUMxRCxLQUFLLENBQUMsSUFBSSxDQUFFLGFBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUUsMEJBQTJCLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZSxFQUFHLElBQUksQ0FBQyxTQUFTLENBQUUsYUFBYyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBTyxFQUFFLEVBQUcsQ0FBQztjQUN0SCxLQUFLLENBQUMsSUFBSSxDQUFFLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7Y0FDbkQsS0FBSyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO2NBQzdEO2NBQ0EsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBVztnQkFDcEUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztjQUMvQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztjQUNSLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLDhCQUE4QixFQUFFLHdCQUF3QixDQUFDO1lBRTdFLENBQUMsTUFBTTtjQUNOLEtBQUssQ0FBQyxJQUFJLENBQUUsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUUsU0FBUyxFQUFFLGlCQUFpQixDQUFDO2NBQ25FLEtBQUssQ0FBQyxJQUFJLENBQUUscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztjQUN6QyxLQUFLLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQyxDQUFDLElBQUksQ0FBRSxFQUFHLENBQUM7Y0FDaEMsS0FBSyxDQUFDLElBQUksQ0FBRSxhQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztjQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBRSxDQUFDO2NBQ3ZDLEtBQUssQ0FBQyxJQUFJLENBQUUsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLENBQUUsU0FBUyxFQUFFLGlCQUFpQixDQUFDO1lBQzNFO1lBRUEsSUFBSyxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLE9BQVEsQ0FBQyxJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUc7Y0FDcEYsTUFBTSxDQUFDLEtBQUssQ0FBRSxnQkFBaUIsQ0FBQztjQUNoQyxLQUFLLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztZQUN0QjtVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsMEJBQTBCLEVBQzFCLFVBQVUsRUFBRSxFQUFFO1FBRWIsSUFBSSxDQUFDLEdBQW1CLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDaEMsVUFBVSxHQUFVLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWtCLENBQUM7VUFDL0MsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztVQUN0RCxhQUFhLEdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBRSxvQkFBcUIsQ0FBQztVQUNsRCxTQUFTLEdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBaUIsQ0FBQztVQUM5QyxhQUFhLEdBQU8sSUFBSTtVQUN4QixLQUFLLEdBQU8sQ0FBQyxDQUFFLG9CQUFxQixDQUFDO1VBQ3JDLGFBQWEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBRSxDQUFDO1VBQzNELFlBQVksR0FBUSxLQUFLLENBQUMsSUFBSSxDQUFFLGtDQUFtQyxDQUFDLENBQUMsR0FBRyxDQUN2RSxZQUFXO1lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSztVQUNsQixDQUNELENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUNQLElBQUksR0FBZ0I7WUFDbkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsMEJBQTBCO1lBQ3JELE9BQU8sRUFBRSxVQUFVO1lBQ25CLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLG1CQUFvQixDQUFDO1lBQzNDLGFBQWEsRUFBRSxhQUFhO1lBQzVCLFlBQVksRUFBRSxZQUFZO1lBQzFCLHFCQUFxQixFQUFFLFVBQVUsQ0FBQyxxQkFBcUI7WUFDdkQsb0JBQW9CLEVBQUUsVUFBVSxDQUFDO1lBQ2pDO1VBQ0QsQ0FBQztRQUNGLElBQUksT0FBTyxhQUFhLEtBQUssV0FBVyxFQUFFO1VBQ3pDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYTtRQUNuQztRQUNBLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO1VBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUztRQUMzQjtRQUNBO1FBQ0EsSUFBSSxhQUFhLEtBQUssQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBRSw4QkFBOEIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQyxFQUFFO1VBQ2hHLElBQUksR0FBRyxhQUFhO1FBQ3JCO1FBRUEsSUFBSSxvQkFBb0I7UUFFeEIsSUFBSyxDQUFDLENBQUUsMENBQTBDLEdBQUcsaUJBQWlCLEdBQUcsb0RBQW9ELEdBQUcsaUJBQWlCLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRW5LLG9CQUFvQixHQUFHLENBQUMsQ0FBRSwwQ0FBMEMsR0FBRyxpQkFBaUIsR0FBRyxvREFBb0QsR0FBRyxpQkFBaUIsR0FBRyxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXJMLENBQUMsTUFBTSxJQUFLLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsc0RBQXVELENBQUMsQ0FBQyxNQUFNLEVBQUc7VUFFaEcsb0JBQW9CLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSxzREFBdUQsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFFM0csQ0FBQyxNQUFNLElBQUssQ0FBQyxDQUFFLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxtQ0FBbUMsR0FBRyxpQkFBaUIsR0FBRywrQkFBZ0MsQ0FBQyxDQUFDLE1BQU0sRUFBSTtVQUV0SixvQkFBb0IsR0FBRyxDQUFDLENBQUUsV0FBVyxHQUFHLGlCQUFpQixHQUFHLG1DQUFtQyxHQUFHLGlCQUFpQixHQUFHLCtCQUFnQyxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUUsQ0FBQztRQUVoSyxDQUFDLE1BQU0sSUFBSyxDQUFDLENBQUMsMkRBQTJELEdBQUcsaUJBQWlCLEdBQUcsb0VBQW9FLEdBQUcsaUJBQWlCLEdBQUcsNkRBQTZELEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFHO1VBRTdSLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQywyREFBMkQsR0FBRyxpQkFBaUIsR0FBRyxvRUFBb0UsR0FBRyxpQkFBaUIsR0FBRyw2REFBNkQsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7VUFDclIsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBRSxDQUFDO1FBRXREO1FBRUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQztRQUM3QixJQUFNLE9BQU8sb0JBQW9CLEtBQUssV0FBVyxJQUFJLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDckY7QUFDSDtVQUNHLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBRSxvQkFBb0IsQ0FBQyxHQUFHLENBQUUsQ0FBRSxDQUFFLENBQUM7VUFDeEQsUUFBUSxVQUFPLENBQUUsYUFBYyxDQUFDO1FBQ2pDLENBQUMsTUFBTTtVQUNOLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsR0FBRyxpQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxxQkFBc0IsQ0FBQztVQUN0RyxJQUFLLGdCQUFnQixDQUFDLE1BQU0sRUFBRztZQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1VBQ3pEO1FBQ0Q7UUFFQSxDQUFDLENBQUMsSUFBSSxDQUNMLElBQUksRUFDSixVQUFTLEdBQUcsRUFBQyxRQUFRLEVBQUM7VUFDckIsUUFBUSxDQUFDLE1BQU0sQ0FBRSxHQUFHLEVBQUcsUUFBQSxDQUFPLFFBQVEsTUFBSyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxRQUFTLENBQUMsR0FBRyxRQUFTLENBQUM7UUFDOUYsQ0FDRCxDQUFDO1FBRUQsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLE1BQU0sQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLDRCQUE2QixDQUFDO1FBRS9ELElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUU7VUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGVBQWdCLENBQUM7VUFDakQ7UUFDRDtRQUVBLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtVQUNuQyxJQUFJLEVBQUUsUUFBUTtVQUNkLElBQUksRUFBRSxNQUFNO1VBQ1o7VUFDQSxXQUFXLEVBQUUsS0FBSztVQUNsQixXQUFXLEVBQUUsS0FBSztVQUNsQixLQUFLLEVBQUUsS0FBSztVQUNaLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBQzVCLElBQUksZUFBZSxHQUFJLFFBQVEsQ0FBQyxNQUFNO2NBQ3JDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPO2NBQ25DLFVBQVUsR0FBUyxJQUFJO1lBRXhCLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUNoQyxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsV0FBWSxDQUFDLEVBQUc7Z0JBQ2hELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7Y0FDdEM7Y0FDQSxJQUFJLFVBQVUsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBQyxNQUFPLENBQUMsRUFBRztnQkFDdkUsTUFBTSxDQUFDLEtBQUssQ0FBRSxRQUFRLENBQUMsTUFBTyxDQUFDO2NBQ2hDO2NBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7Y0FFM0IsS0FBSyxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7Y0FFckIsSUFBSSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxxQkFBc0IsQ0FBQyxFQUFHO2dCQUM1RSxNQUFNLENBQUMsT0FBTyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMscUJBQXNCLENBQUM7Y0FDMUQ7Y0FDQSxJQUFPLFFBQVEsQ0FBQyxtQkFBbUIsSUFBSSxRQUFRLENBQUMsbUJBQW1CLEtBQUssT0FBTyxJQUFRLFFBQVEsQ0FBQyxtQkFBbUIsSUFBSSxRQUFRLENBQUMsWUFBWSxJQUFLLFFBQVEsQ0FBQyxtQkFBbUIsS0FBSyxRQUFRLENBQUMsWUFBYyxFQUFHO2dCQUMzTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxxQkFBc0IsQ0FBQztjQUMxSSxDQUFDLE1BQU0sSUFBSyxRQUFRLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxZQUFZLEtBQUssT0FBTyxFQUFHO2dCQUN4RSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMscUJBQXNCLENBQUM7Y0FDaEk7O2NBR0E7QUFDTjtBQUNBO1lBRUs7WUFFQSxJQUFLLFVBQVUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUMsT0FBUSxDQUFDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRztjQUNwRixNQUFNLENBQUMsS0FBSyxDQUFFLGdCQUFpQixDQUFDO1lBQ2pDO1VBRUQ7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxxQkFBcUIsRUFDckIsVUFBVSxFQUFFLEVBQUU7UUFFYixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNoQyxRQUFRLEdBQVksQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1VBQzdDLGFBQWEsR0FBTyxJQUFJO1VBQ3hCLEtBQUssR0FBTyxDQUFDLENBQUUsYUFBYyxDQUFDO1VBQzlCLFlBQVksR0FBUSxDQUFDLENBQUMsSUFBSSxDQUFFLGtCQUFtQixDQUFDO1VBQ2hELFdBQVcsR0FBUSxLQUFLLENBQUMsSUFBSSxDQUFFLGtDQUFtQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7VUFDekUsSUFBSSxHQUFnQjtZQUNuQixNQUFNLEVBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7WUFDaEQsS0FBSyxFQUFFLENBQUMsQ0FBRSxpREFBa0QsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDN0UsT0FBTyxFQUFFLFVBQVU7WUFDbkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsWUFBWSxFQUFFLFlBQVk7WUFDMUIsdUJBQXVCLEVBQUU7VUFDMUIsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLHVCQUF1QixLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEVBQUUsRUFBRTtVQUM1RjtRQUNEOztRQUVBO1FBQ0EsSUFBSSxhQUFhLEtBQUssQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQyxFQUFFO1VBQzNGLElBQUksR0FBRyxhQUFhO1FBQ3JCO1FBRUEsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5CLENBQUMsQ0FBQyxJQUFJLENBQ0w7VUFDQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFNBQVM7VUFDekIsSUFBSSxFQUFFLElBQUk7VUFDVixRQUFRLEVBQUUsTUFBTTtVQUNoQixNQUFNLEVBQUUsTUFBTTtVQUNkLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBRTFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLENBQUM7VUFDeEIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsUUFBUSxFQUFFO1lBQzVCLElBQUksZUFBZSxHQUFJLFFBQVEsQ0FBQyxNQUFNO2NBQ3JDLFVBQVUsR0FBUyxJQUFJO1lBRXhCLElBQUksZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxvQ0FBb0MsQ0FBQyxPQUFPLENBQUUsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLGFBQWMsQ0FBQztZQUVsSSxJQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxlQUFnQixDQUFDLEVBQUc7Y0FDM0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxVQUFTLFVBQVUsRUFBRSxnQkFBZ0IsRUFBQztnQkFDbkUsQ0FBQyxDQUFFLGFBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7Z0JBQ2xDLENBQUMsQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0QyxDQUFDLENBQUUscUJBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsRUFBRztrQkFDckQsTUFBTSxDQUFDLE9BQU8sQ0FBRSxnQkFBaUIsQ0FBQztnQkFDbkM7Y0FDRCxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQztZQUdwQztZQUNBLElBQUssQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsZUFBZ0IsQ0FBQyxFQUFHO2NBQzdDLEtBQUssQ0FBQyxLQUFLLENBQUUsTUFBTyxDQUFDO2NBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7WUFDMUI7VUFFRDtRQUVELENBQ0QsQ0FBQztRQUVELE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLHFCQUFxQixFQUNyQixVQUFVLEVBQUUsRUFBRTtRQUViLElBQUksQ0FBQyxHQUFtQixDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ2hDLFFBQVEsR0FBWSxDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUM7VUFDN0MsYUFBYSxHQUFPLElBQUk7VUFDeEIsS0FBSyxHQUFPLENBQUMsQ0FBRSxhQUFjLENBQUM7VUFDOUIsWUFBWSxHQUFRLENBQUMsQ0FBQyxJQUFJLENBQUUsa0JBQW1CLENBQUM7VUFDaEQsV0FBVyxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUUsa0NBQW1DLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUN6RSxJQUFJLEdBQWdCO1lBQ25CLE1BQU0sRUFBRyxVQUFVLENBQUMsT0FBTyxDQUFDLG9CQUFvQjtZQUNoRCxLQUFLLEVBQUUsQ0FBQyxDQUFFLGlEQUFrRCxDQUFDLENBQUMsSUFBSSxDQUFFLE9BQVEsQ0FBQztZQUM3RSxPQUFPLEVBQUUsVUFBVTtZQUNuQixRQUFRLEVBQUUsUUFBUTtZQUNsQixZQUFZLEVBQUUsWUFBWTtZQUMxQixRQUFRLEVBQUU7VUFDWCxDQUFDO1FBRUYsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssRUFBRSxFQUFFO1VBQzVGO1FBQ0Q7O1FBRUE7UUFDQSxJQUFJLGFBQWEsS0FBSyxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsY0FBYyxDQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBRSxDQUFDLEVBQUU7VUFDM0YsSUFBSSxHQUFHLGFBQWE7UUFDckI7UUFFQSxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsQ0FBQyxDQUFDLElBQUksQ0FDTDtVQUNDLEdBQUcsRUFBRSxVQUFVLENBQUMsU0FBUztVQUN6QixJQUFJLEVBQUUsSUFBSTtVQUNWLFFBQVEsRUFBRSxNQUFNO1VBQ2hCLE1BQU0sRUFBRSxNQUFNO1VBQ2QsVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFFMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxlQUFlLEdBQUksUUFBUSxDQUFDLE1BQU07Y0FDckMsVUFBVSxHQUFTLElBQUk7WUFFeEIsSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxRQUFRLENBQUMsYUFBYyxDQUFDO1lBRXZILElBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLGVBQWdCLENBQUMsRUFBRztjQUMzQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLFVBQVMsVUFBVSxFQUFFLGdCQUFnQixFQUFDO2dCQUNuRSxDQUFDLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLElBQUksVUFBVSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFFLGdCQUFpQixDQUFDLEVBQUc7a0JBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUUsZ0JBQWlCLENBQUM7Z0JBQ25DO2NBQ0QsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFFLENBQUM7WUFHcEM7WUFDQSxJQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLGVBQWdCLENBQUMsRUFBRztjQUM3QyxLQUFLLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztjQUVyQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBRSxDQUFDO1lBQzFCO1VBRUQ7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCw2QkFBNkIsRUFDN0IsVUFBVSxFQUFFLEVBQUU7UUFFYixJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUNoQyxRQUFRLEdBQVksQ0FBQyxDQUFDLElBQUksQ0FBRSxjQUFlLENBQUM7VUFDNUMsYUFBYSxHQUFPLElBQUk7VUFDeEIsWUFBWSxHQUFRLENBQUMsQ0FBQyxJQUFJLENBQUUsa0JBQW1CLENBQUM7VUFDaEQsSUFBSSxHQUFnQjtZQUNuQixNQUFNLEVBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7WUFDaEQsS0FBSyxFQUFFLENBQUMsQ0FBRSxpREFBa0QsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDN0UsT0FBTyxFQUFFLFVBQVU7WUFDbkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsWUFBWSxFQUFFO1VBQ2YsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUU7VUFDckQ7UUFDRDs7UUFFQTtRQUNBLElBQUksYUFBYSxLQUFLLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxjQUFjLENBQUUsaUNBQWlDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFFLENBQUMsRUFBRTtVQUNuRyxJQUFJLEdBQUcsYUFBYTtRQUNyQjtRQUVBLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1VBQ3pCLElBQUksRUFBRSxJQUFJO1VBQ1YsUUFBUSxFQUFFLE1BQU07VUFDaEIsTUFBTSxFQUFFLE1BQU07VUFDZCxVQUFVLEVBQUUsU0FBQSxXQUFVLEdBQUcsRUFBRTtZQUUxQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxDQUFDO1VBQ3hCLENBQUM7VUFDRCxPQUFPLEVBQUUsU0FBQSxRQUFVLFFBQVEsRUFBRTtZQUM1QixJQUFJLGVBQWUsR0FBSSxRQUFRLENBQUMsTUFBTTtjQUNyQyxVQUFVLEdBQVMsSUFBSTtZQUV4QixJQUFJLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxhQUFjLENBQUM7WUFFdkgsSUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsZUFBZ0IsQ0FBQyxFQUFHO2NBQzNDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBRSxjQUFlLENBQUM7Y0FDM0MsSUFBSSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsRUFBRztnQkFDckQsTUFBTSxDQUFDLE9BQU8sQ0FBRSxnQkFBaUIsQ0FBQztjQUNuQztZQUNEO1lBQ0EsSUFBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxlQUFnQixDQUFDLEVBQUc7Y0FDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUUsQ0FBQztZQUMxQjtVQUVEO1FBRUQsQ0FDRCxDQUFDO1FBRUQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BRUQsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1Asa0NBQWtDLEVBQ2xDLFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxxQkFBc0IsQ0FBQztRQUN2RCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFHRCxTQUFTLHdCQUF3QixDQUFBLEVBQUc7UUFDbkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFFLG9CQUFxQixDQUFDO1FBQ3JDLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUM7UUFDeEQsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQztRQUM3RCxJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFFLEVBQUUsS0FBSztVQUFBLE9BQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQUEsRUFBQztRQUM1RyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7UUFDaEMsSUFBSSxVQUFVLEVBQUU7VUFDZixTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7UUFDbEM7TUFDRDtNQUNBO01BQ0k7O01BRUosQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsaURBQWlELEVBQ2pELFVBQVUsRUFBRSxFQUFFO1FBQ2IsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2pFLElBQUssZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7VUFDakMsZUFBZSxDQUFDLElBQUksQ0FBRSxVQUFVLEVBQUMsSUFBSyxDQUFDO1FBQ3hDO01BQ0QsQ0FDRCxDQUFDO01BR0QsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsOEJBQThCLEVBQzlCLFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxHQUFlLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDNUIsYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUUsb0JBQXFCLENBQUM7UUFDL0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUUsYUFBYSxFQUFFLENBQUUsQ0FBQztRQUNwRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxtQ0FBbUMsRUFDbkMsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkIsSUFBSSxDQUFDLEdBQWMsQ0FBQyxDQUFFLElBQUssQ0FBQztVQUMzQixHQUFHLEdBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBRSxnQkFBaUIsQ0FBQztVQUM1QyxZQUFZLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBRSxTQUFVLENBQUM7VUFDcEMsSUFBSSxHQUFXO1lBQ2QsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsaUNBQWlDO1lBQzVELEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLGdDQUFnQztZQUM3RCxPQUFPLEVBQUUsVUFBVTtZQUNuQiwwQkFBMEIsRUFBRTtZQUM1QjtVQUNELENBQUM7UUFFRixDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyx1QkFBdUI7VUFDdkMsSUFBSSxFQUFFLElBQUk7VUFDVixNQUFNLEVBQUUsTUFBTTtVQUNkLFVBQVUsRUFBRSxTQUFBLFdBQVUsR0FBRyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7Y0FDeEMsR0FBRyxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDO1lBQ3ZEO1lBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLENBQUUsQ0FBQztVQUN4QixDQUFDO1VBQ0QsUUFBUSxFQUFFLFNBQUEsU0FBQSxFQUFZO1lBRXJCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFFLENBQUM7VUFDMUIsQ0FBQztVQUNELE9BQU8sRUFBRSxTQUFBLFFBQVUsSUFBSSxFQUFFO1lBQ3hCLElBQUssQ0FBRSxJQUFJLEVBQUc7Y0FDYjtZQUNEO1lBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDM0I7QUFDTDtBQUNBOztZQUVLLElBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxXQUFXLEVBQUc7Y0FDakMsQ0FBQyxDQUFFLHFCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBTSxDQUFDO1lBQzVEO1lBRUEsSUFBSyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHdCQUF5QixDQUFDLEVBQUU7Y0FDM0YsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLHdCQUF5QixDQUFDO1lBQzNEO1lBRUEsSUFBSyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRztjQUNyRCxDQUFDLENBQUUscUNBQXNDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRDtZQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFckMsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBRSxtQ0FBbUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUcsSUFBSSxDQUFFLENBQUM7VUFDNUU7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx3Q0FBd0MsRUFDeEMsVUFBVSxFQUFFLEVBQUU7UUFDYixJQUFJLENBQUMsR0FBUyxDQUFDLENBQUUsSUFBSyxDQUFDO1VBQ3RCLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLGNBQWUsQ0FBQztVQUNsQyxJQUFJLEdBQU07WUFDVCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUM7WUFDNUQsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsMEJBQTBCO1lBQ3ZELE9BQU8sRUFBRSxVQUFVO1lBQ25CLE9BQU8sRUFBRTtZQUNUO1VBQ0QsQ0FBQztRQUNGLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQixDQUFDLENBQUMsV0FBVyxDQUFFLE9BQVEsQ0FBQztRQUN4QixDQUFDLENBQUMsUUFBUSxDQUFFLFNBQVUsQ0FBQzs7UUFFdkI7UUFDQSxJQUFLLEtBQUssS0FBSyxDQUFDLENBQUUsUUFBUSxDQUFDLElBQUssQ0FBQyxDQUFDLGNBQWMsQ0FBRSx5Q0FBeUMsRUFBRSxDQUFFLENBQUMsQ0FBRyxDQUFDLEVBQUc7VUFDdEcsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsc0NBQXNDLEVBQUUsQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBRyxDQUFDO1VBQ3pGLE9BQU8sSUFBSTtRQUNaO1FBQ0EsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsZ0JBQWdCLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUcsQ0FBQztRQUV6RCxDQUFDLENBQUMsSUFBSSxDQUNMO1VBQ0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyx1QkFBdUI7VUFDdkMsSUFBSSxFQUFFLElBQUk7VUFDVixNQUFNLEVBQUUsTUFBTTtVQUNkO1VBQ0EsVUFBVSxFQUFFLFNBQUEsV0FBVSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtjQUN4QyxHQUFHLENBQUMsZ0JBQWdCLENBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUM7WUFDdkQ7VUFDRCxDQUFDO1VBQ0QsT0FBTyxFQUFFLFNBQUEsUUFBVSxRQUFRLEVBQUU7WUFDNUIsSUFBSyxDQUFFLFFBQVEsRUFBRztjQUNqQjtZQUNEO1lBRUEsSUFBSSxPQUFPLFFBQVEsQ0FBQyxTQUFTLEtBQUssV0FBVyxFQUFFO2NBQzlDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLFFBQVEsQ0FBQyxTQUFVLENBQUM7WUFDbkQ7WUFFQSxJQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUc7Y0FDckIsTUFBTSxDQUFDLEtBQUssQ0FBRSxRQUFRLENBQUMsS0FBTSxDQUFDO2NBQzlCO1lBQ0Q7WUFDQSxJQUFLLENBQUUsQ0FBQyxDQUFFLDRCQUE2QixDQUFDLENBQUMsTUFBTSxFQUFHO2NBQ2pELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQixDQUFDLE1BQU07Y0FDTixJQUFLLE9BQU8sUUFBUSxDQUFDLFNBQVMsS0FBSyxXQUFXLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsS0FBSyxXQUFXLEVBQUc7Z0JBQ2pILENBQUMsQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQywwQkFBMkIsQ0FBQztjQUMvRjtjQUNBLENBQUMsQ0FBRSxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO2NBQ2pEO2NBQ0EsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsZUFBZSxFQUFFLENBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBRyxDQUFDO1lBQzdGO1VBRUQ7UUFFRCxDQUNELENBQUM7UUFFRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx3Q0FBd0MsRUFDeEMsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFFLDhCQUErQixDQUFDLENBQUMsS0FBSyxDQUFFLE1BQU8sQ0FBQztRQUNuRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUUsZUFBZSxFQUFFLGFBQWMsQ0FBQztRQUNoRixJQUFJLEdBQUcsR0FBYSxDQUFDLENBQUUsVUFBVSxHQUFHLGVBQWUsR0FBRyxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsSUFBSyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFFLGFBQWEsRUFBRSxHQUFJLENBQUM7UUFFdEQsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxPQUFPLEVBQ1AsMkNBQTJDLEVBQzNDLFVBQVUsRUFBRSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBRSw4QkFBK0IsQ0FBQyxDQUFDLEtBQUssQ0FBRSxNQUFPLENBQUM7UUFDbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsZUFBZTtRQUN0QyxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCwyQkFBMkIsRUFDM0IsVUFBVSxFQUFFLEVBQUU7UUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWUsQ0FBQztRQUNoRCxPQUFPLEtBQUs7TUFDYixDQUNELENBQUM7O01BRUQ7TUFDQSxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx5QkFBeUIsRUFDekIsVUFBVSxFQUFFLEVBQUc7UUFDZCxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkIsSUFBSyxDQUFFLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsUUFBUyxDQUFDLEVBQUc7VUFDdkMsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUM7VUFDOUIsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXZELENBQUMsTUFBTTtVQUNOLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO1VBQ2pDLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRDtRQUNBLE9BQU8sS0FBSztNQUNiLENBQ0QsQ0FBQzs7TUFFRDtNQUNBLENBQUMsQ0FBQyxFQUFFLENBQ0gsT0FBTyxFQUNQLGlEQUFpRCxFQUNqRCxVQUFVLEVBQUUsRUFBRTtRQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO1VBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFnQixDQUFDO1VBQ2pEO1FBQ0Q7UUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsNkJBQTZCLEVBQUUsSUFBSyxDQUFDO1FBRTNELENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUUsdUJBQXdCLENBQUMsQ0FBQyxPQUFPLENBQUU7VUFBQyxPQUFPLEVBQUM7UUFBRSxDQUFDLEVBQUUsTUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckYsT0FBTyxLQUFLO01BQ2IsQ0FDRCxDQUFDO01BQ0Q7TUFHQSxDQUFDLENBQUMsRUFBRSxDQUNILGdCQUFnQixFQUNoQixNQUFNLEVBQ04sVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtRQUMzQixJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBRSxtREFBb0QsQ0FBQyxDQUFDLE1BQU0sRUFBRTtVQUNqSixJQUFJLENBQUMsV0FBVyxHQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUUsbURBQW9ELENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSyxDQUFDO1VBQ3ZHLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBRSxtREFBb0QsQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFnQixDQUFDO1VBQ2xILElBQUksQ0FBQyxXQUFXLEdBQUssTUFBTSxDQUFDLE9BQU8sQ0FBRSxtREFBb0QsQ0FBQyxDQUFDLElBQUksQ0FBRSxhQUFjLENBQUM7VUFDaEgsSUFBSSxDQUFDLFFBQVEsR0FBUSxNQUFNLENBQUMsT0FBTyxDQUFFLG1EQUFvRCxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQVcsQ0FBQztVQUM3RyxPQUFPLHFCQUFxQixLQUFLLFdBQVcsS0FBTSxxQkFBcUIsQ0FBQyx1QkFBdUIsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUU7O1VBRS9IO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO1FBQ0U7TUFDRCxDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILGVBQWUsRUFDZixNQUFNLEVBQ04sVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7UUFDMUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBRSx1QkFBd0IsQ0FBQyxDQUFDLE1BQU0sRUFBRTtVQUN0RixPQUFPLHFCQUFxQixLQUFLLFdBQVcsS0FBTSxxQkFBcUIsQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBRTtVQUUzSCxJQUFJLEVBQUUsR0FBWSxNQUFNLENBQUMsT0FBTyxDQUFFLGVBQWdCLENBQUM7WUFDbEQsS0FBSyxHQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUM7WUFDdEQsT0FBTyxHQUFPLEtBQUssQ0FBQyxJQUFJLENBQUUsa0JBQW1CLENBQUM7WUFDOUMsV0FBVyxHQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUUsUUFBUyxDQUFDO1lBQ3BDLFdBQVcsR0FBTSxLQUFLLENBQUMsSUFBSSxDQUFFLHVCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFFLElBQUssQ0FBQztZQUNuRSxjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSx1QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxPQUFRLENBQUM7WUFDdEUsU0FBUyxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUUsdUJBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQztZQUM5RSxlQUFlLEdBQUcsS0FBSztVQUV4QixNQUFNLENBQUMsV0FBVyxDQUFFLE9BQVEsQ0FBQztVQUM3QixFQUFFLENBQUMsSUFBSSxDQUFFLGdCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7VUFDcEMsSUFBSSxVQUFVLENBQUMsc0NBQXNDLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUUvRSxDQUFDLENBQUUsc0JBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWdCLEdBQUcsV0FBVyxHQUFHLElBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWxGLElBQUssVUFBVSxLQUFLLFNBQVMsRUFBRztjQUMvQixJQUFJLE9BQU8sZUFBZSxLQUFLLFdBQVcsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO2dCQUN2RSxJQUFJLGFBQWEsR0FBRyxlQUFlLENBQUMsTUFBTTtnQkFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7a0JBQzVDLElBQUksT0FBTyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksV0FBVyxFQUFFO29CQUMvSSxlQUFlLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUM7a0JBQy9CO2dCQUNEO2dCQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsZUFBZ0IsQ0FBRSxDQUFDO2dCQUVqRSxDQUFDLENBQUUsaUNBQWtDLENBQUMsQ0FBQyxJQUFJLENBQUUsZ0JBQWdCLEdBQUcsV0FBVyxHQUFHLElBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3RixDQUFDLENBQUUsMERBQTJELENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZSxDQUFDLE1BQU8sQ0FBQztnQkFDOUYsQ0FBQyxDQUFFLHFFQUFzRSxDQUFDLENBQUMsSUFBSSxDQUFFLGVBQWUsQ0FBQyxNQUFPLENBQUM7Z0JBQ3pHLENBQUMsQ0FBRSwrQ0FBK0MsR0FBRyxXQUFZLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO2dCQUMxRixJQUFNLENBQUUsZUFBZSxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsZUFBZ0IsQ0FBQyxDQUFDLE1BQU0sRUFBRztrQkFDMUcsQ0FBQyxDQUFFLCtCQUFnQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7a0JBQzVDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJO2dCQUNsQztjQUNEO1lBRUQ7WUFDQSxJQUFLLFVBQVUsS0FBSyxTQUFTLEVBQUc7Y0FDL0IsSUFBSSxPQUFPLG1CQUFtQixLQUFLLFdBQVcsSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7Z0JBQy9FLElBQUksZUFBYSxHQUFHLG1CQUFtQixDQUFDLE1BQU07Z0JBQzlDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksZUFBYSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtrQkFDeEMsSUFBSSxPQUFPLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7b0JBQzNKLG1CQUFtQixDQUFDLE1BQU0sQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDO2tCQUNuQztnQkFDRDtnQkFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFFLG1CQUFvQixDQUFFLENBQUM7Z0JBQ3JFLENBQUMsQ0FBRSxpQ0FBa0MsQ0FBQyxDQUFDLElBQUksQ0FBRSxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsSUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdGLENBQUMsQ0FBRSwwREFBMkQsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBbUIsQ0FBQyxNQUFPLENBQUM7Z0JBQ2xHLENBQUMsQ0FBRSxvRUFBcUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxtQkFBbUIsQ0FBQyxNQUFPLENBQUM7Z0JBQzVHLENBQUMsQ0FBRSwrQ0FBK0MsR0FBRyxXQUFZLENBQUMsQ0FBQyxXQUFXLENBQUUsUUFBUyxDQUFDO2dCQUUxRixJQUFPLENBQUUsbUJBQW1CLENBQUMsTUFBTSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFFLGVBQWdCLENBQUMsQ0FBQyxNQUFNLEVBQUc7a0JBQ25ILENBQUMsQ0FBRSwrQkFBZ0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2tCQUM1QyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsSUFBSTtnQkFDbEM7Y0FDRDtZQUNEO1lBRUEsSUFBSyxPQUFPLEtBQUssU0FBUyxFQUFHO2NBQzVCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJO1lBQ2xDO1lBRUEsSUFBSyxlQUFlLEVBQUc7Y0FDdEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDNUI7VUFFRDtRQUNELENBQUMsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFFLDZCQUE4QixDQUFDLENBQUMsTUFBTSxFQUFFO1VBQ25HLElBQUksRUFBRSxHQUFhLE1BQU0sQ0FBQyxPQUFPLENBQUUsZ0JBQWlCLENBQUM7WUFDcEQsS0FBSyxHQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUUsMEJBQTJCLENBQUM7WUFDdkQsT0FBTyxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUUsa0JBQW1CLENBQUM7WUFDL0MsWUFBWSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUUsU0FBVSxDQUFDO1VBQ3BDLE1BQU0sQ0FBQyxXQUFXLENBQUUsT0FBUSxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxJQUFJLENBQUUsZ0JBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUNwQyxJQUFLLE9BQU8sQ0FBQyxhQUFhLEVBQUU7WUFDM0IsQ0FBQyxDQUFFLDRCQUE2QixDQUFDLENBQUMsSUFBSSxDQUFFLGlCQUFpQixHQUFHLFlBQVksR0FBRyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRixJQUFLLENBQUUsQ0FBQyxDQUFFLHNFQUF1RSxDQUFDLENBQUMsTUFBTSxFQUFHO2NBQzNGLENBQUMsQ0FBRSxxQ0FBc0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25EO1VBQ0Q7UUFDRDtNQUNELENBQ0QsQ0FBQztNQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gscUJBQXFCLEVBQ3JCLE1BQU0sRUFDTixVQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFHO1FBQzFCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBRSxtR0FBb0csQ0FBQztRQUV0SCxDQUFDLENBQUMsV0FBVyxDQUFFLFNBQVUsQ0FBQztRQUMxQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1VBQ3pCLENBQUMsQ0FBRSxzQkFBdUIsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxPQUFRLENBQUM7UUFDL0MsQ0FBQyxNQUFNO1VBQ04sT0FBTyxDQUFDLE9BQU8sQ0FDZCxHQUFHLEVBQ0gsWUFBWTtZQUNYLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQyxXQUFXLENBQUUsT0FBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7VUFDbEYsQ0FDRCxDQUFDO1FBQ0Y7TUFDRCxDQUNELENBQUM7TUFFRCxDQUFDLENBQUMsRUFBRSxDQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBeUIsQ0FBQztNQUMxRTtNQUNJOztNQUVKLElBQUssY0FBYyxJQUFJLE1BQU0sSUFBSyxNQUFNLENBQUMsYUFBYSxJQUFJLFFBQVEsWUFBWSxhQUFjLEVBQUU7UUFDN0YsSUFBSSxtQkFBbUI7UUFDdkIsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxZQUFZLEVBQ1oscUZBQXFGLEVBQ3JGLFVBQVUsQ0FBQyxFQUFFO1VBQ1osbUJBQW1CLEdBQUcsS0FBSztRQUM1QixDQUNELENBQUM7UUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILFdBQVcsRUFDWCxxRkFBcUYsRUFDckYsVUFBVSxDQUFDLEVBQUU7VUFDWixtQkFBbUIsR0FBRyxJQUFJO1FBQzNCLENBQ0QsQ0FBQztRQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsVUFBVSxFQUNWLDhJQUE4SSxFQUM5SSxVQUFVLENBQUMsRUFBRTtVQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUM7VUFDcEQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFFLG1CQUFvQixDQUFDLEVBQUU7WUFDekMsSUFBSyxDQUFFLG1CQUFtQixFQUFFO2NBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsd0JBQXlCLENBQUMsRUFBRSxDQUFFLENBQUM7WUFDdkU7VUFDRCxDQUFDLE1BQU07WUFDTixDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFFLElBQUksRUFBRSxDQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBRSxtQkFBb0IsQ0FBQztVQUNyQztRQUNELENBQ0QsQ0FBQztRQUVELENBQUMsQ0FBQyxFQUFFLENBQ0gsVUFBVSxFQUNWLGdHQUFnRyxFQUNoRyxVQUFVLENBQUMsRUFBRTtVQUNaLElBQUksQ0FBQyxDQUFFLENBQUMsQ0FBQyxNQUFPLENBQUMsQ0FBQyxPQUFPLENBQUUsd0JBQXlCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ25FLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsd0JBQXlCLENBQUMsRUFBRSxDQUFFLENBQUM7VUFDdkU7UUFDRCxDQUNELENBQUM7UUFDRDtRQUNBLENBQUMsQ0FBQyxFQUFFLENBQ0gsVUFBVSxFQUNWLGlGQUFpRixFQUNqRixVQUFTLEVBQUUsRUFBRTtVQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztVQUMzQyxPQUFPLEtBQUs7UUFDYixDQUNELENBQUM7TUFDRixDQUFDLE1BQU07UUFDTixDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCx1RUFBdUUsRUFDdkUsVUFBVSxFQUFFLEVBQUU7VUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztVQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFFLFlBQVksR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLFNBQVUsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBRSx5QkFBMEIsQ0FBQztVQUM3SSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBRSx3QkFBeUIsQ0FBRSxDQUFDO1VBQ25FLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFFLElBQUssQ0FBQztVQUN4QyxJQUFJLENBQUMsV0FBVyxDQUFFLFlBQWEsQ0FBQztVQUNoQyxPQUFPLEtBQUs7UUFDYixDQUNELENBQUM7UUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILE9BQU8sRUFDUCxVQUFVLEVBQUUsRUFBRTtVQUNiLElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyx1RUFBdUUsQ0FBQztVQUMzRixJQUFJLFFBQVEsS0FBSyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsTUFBTyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ2pFLENBQUMsQ0FBRSx5QkFBMEIsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxZQUFhLENBQUM7VUFDM0Q7UUFDRCxDQUNELENBQUM7UUFFRCxDQUFDLENBQUMsRUFBRSxDQUNILFdBQVcsRUFDWCxtRUFBbUUsRUFDbkUsVUFBVSxFQUFFLEVBQUU7VUFDYixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQztVQUM3QixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7VUFDbkIsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBRSxZQUFhLENBQUM7VUFDbEMsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO1FBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FDSCxVQUFVLEVBQ1YsbUVBQW1FLEVBQ25FLFVBQVUsRUFBRSxFQUFFO1VBQ2IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7VUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ25CLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxXQUFXLENBQUUsWUFBYSxDQUFDO1VBQ3JDLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQztRQUNELENBQUMsQ0FBQyxFQUFFLENBQ0gsV0FBVyxFQUNYLHVFQUF1RSxFQUN2RSxVQUFVLEVBQUUsRUFBRTtVQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsWUFBWSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBVSxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFFLHlCQUEwQixDQUFDO1VBQzdJLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxRQUFRLENBQUUsWUFBYSxDQUFDO1VBQ2xDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBRSxJQUFJLENBQUMsT0FBTyxDQUFFLHdCQUF5QixDQUFFLENBQUM7VUFDbkUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUUsSUFBSyxDQUFDO1VBRXhDLE9BQU8sS0FBSztRQUNiLENBQ0QsQ0FBQztRQUNELENBQUMsQ0FBQyxFQUFFLENBQ0gsVUFBVSxFQUNWLHVFQUF1RSxFQUN2RSxVQUFVLEVBQUUsRUFBRTtVQUNiLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1VBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztVQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUUsWUFBWSxHQUFHLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBVSxDQUFFLENBQUM7VUFDMUQsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBRSxZQUFhLENBQUM7VUFDckMsT0FBTyxLQUFLO1FBQ2IsQ0FDRCxDQUFDO1FBRUQsQ0FBQyxDQUFFLHVFQUF3RSxDQUFDLENBQUMsV0FBVyxDQUN2RjtVQUNDLFFBQVEsRUFBRSxDQUFDO1VBQ1gsT0FBTyxFQUFFLEdBQUc7VUFDWixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCO1VBQ25DLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUNELENBQUM7TUFDRjtNQUNBO01BRUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztNQUVuQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO01BRWhDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO01BRTFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7TUFFbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztNQUVwQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztNQUV6QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztNQUU1QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUV4QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUV4QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO01BRTdCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7TUFFekMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNqQyxDQUNELENBQUMsQ0FBQyxPQUFPLENBQUUsWUFBYSxDQUFDOztJQUV6Qjs7SUFFRixDQUFDLENBQUUsUUFBUyxDQUFDLENBQ1gsRUFBRSxDQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQWEsQ0FBQyxDQUM1RCxFQUFFLENBQUUsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBYSxDQUFDLENBQ2pFLEVBQUUsQ0FBRSx5Q0FBeUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFhLENBQUMsQ0FDeEUsRUFBRSxDQUFFLHlDQUF5QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQWEsQ0FBQyxDQUN4RSxFQUFFLENBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQWEsQ0FBQztJQUNoRDtJQUNBLENBQUMsQ0FBRSxRQUFTLENBQUMsQ0FBQyxLQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBZSxDQUFDO0lBQ2hEO0lBQ0EsQ0FBQyxDQUFFLFFBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxpQkFBaUIsRUFBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFlLENBQUM7SUFDakU7SUFDQSxDQUFDLENBQUUsUUFBUyxDQUFDLENBQUMsRUFBRSxDQUFFLHNCQUFzQixFQUFFLFVBQVUsQ0FBQyxFQUFFLFVBQVUsRUFBRztNQUNuRSxJQUFLLFVBQVUsRUFBRztRQUNqQixDQUFDLENBQUMsK0JBQStCLEdBQUcsVUFBVSxHQUFHLG1CQUFtQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDL0U7SUFDRCxDQUFDLENBQUM7SUFDRjtJQUdBLElBQUksUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQ2xDLFVBQVMsU0FBUyxFQUFFO01BQ25CLFNBQVMsQ0FBQyxPQUFPLENBQ2hCLFVBQVMsUUFBUSxFQUFFO1FBQ2xCLElBQUssQ0FBQyxDQUFFLDJEQUE0RCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztVQUNsRixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQy9DO1FBQ0E7UUFDQSxJQUFLLENBQUMsQ0FBRSx5REFBMEQsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFFLHlEQUEwRCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztVQUM3SixDQUFDLENBQUUsb0JBQXFCLENBQUMsQ0FBQyxJQUFJLENBQzdCLFlBQVc7WUFDVixJQUFJLGdCQUFnQixHQUFNLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUscUJBQXNCLENBQUM7WUFDakUsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLHVCQUF3QixDQUFDO1lBQ25FLElBQUssZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2NBQ25FLGdCQUFnQixDQUFDLFFBQVEsQ0FBRSxtQkFBb0IsQ0FBQztZQUNqRDtVQUNELENBQ0QsQ0FBQztRQUNGO01BQ0QsQ0FDRCxDQUFDO0lBQ0YsQ0FDRCxDQUFDO0lBQ0QsUUFBUSxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFBRSxTQUFTLEVBQUUsSUFBSTtNQUFFLE9BQU8sRUFBRTtJQUFLLENBQUUsQ0FBQztJQUN0RTs7SUFFRTs7SUFFRixDQUFDLENBQUUsTUFBTyxDQUFDLENBQUMsRUFBRSxDQUNiLGVBQWUsRUFDZixZQUFXO01BQ1YsQ0FBQyxDQUFFLHlCQUEwQixDQUFDLENBQUMsSUFBSSxDQUNsQyxZQUFXO1FBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUUsQ0FBQyxDQUFFLElBQUssQ0FBRSxDQUFDO01BQzlDLENBQ0QsQ0FBQztJQUNGLENBQ0QsQ0FBQztJQUNEOztJQUVFOztJQUVGLElBQUksdUJBQXVCLEdBQUcsSUFBSTtNQUNqQyxpQkFBaUIsR0FBUyxVQUFVLENBQUMsaUJBQWlCO01BQ3RELGlCQUFpQixHQUFLLGlCQUFpQixHQUFHLFdBQVc7TUFDckQsaUJBQWlCLEdBQUssaUJBQWlCLEdBQUcsV0FBVztNQUNyRCxhQUFhLEdBQUssaUJBQWlCLEdBQUcsT0FBTztJQUU5QyxJQUFJO01BQ0gsdUJBQXVCLEdBQUssZ0JBQWdCLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxjQUFjLEtBQUssSUFBTTtNQUMxRixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBRSxPQUFPLEVBQUUsTUFBTyxDQUFDO01BQ2hELE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFFLE9BQVEsQ0FBQztNQUMzQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBRSxPQUFPLEVBQUUsTUFBTyxDQUFDO01BQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFFLE9BQVEsQ0FBQztJQUMxQyxDQUFDLENBQUMsT0FBUSxHQUFHLEVBQUc7TUFDZix1QkFBdUIsR0FBRyxLQUFLO0lBQ2hDO0lBRUEsSUFBSyxVQUFVLENBQUMsZ0JBQWdCLElBQUksVUFBVSxDQUFDLHFCQUFxQixFQUFHO01BQ3RFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pCOztJQUVBO0lBQ0EsSUFBSyx1QkFBdUIsRUFBRztNQUU5QjtNQUNBLENBQUMsQ0FBRSxNQUFPLENBQUMsQ0FBQyxFQUFFLENBQ2IsbUJBQW1CLEVBQ25CLFVBQVcsQ0FBQyxFQUFHO1FBQ2QsSUFBTyxpQkFBaUIsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFFLGlCQUFrQixDQUFDLEtBQUssY0FBYyxDQUFDLE9BQU8sQ0FBRSxpQkFBa0IsQ0FBQyxJQUMxSSxpQkFBaUIsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFFLGlCQUFrQixDQUFDLEtBQUssY0FBYyxDQUFDLE9BQU8sQ0FBRSxpQkFBa0IsQ0FBRyxFQUFHO1VBQzdJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCO01BQ0QsQ0FDRCxDQUFDOztNQUVEO01BQ0EsQ0FBQyxDQUFFLE1BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FDYixVQUFVLEVBQ1YsVUFBVSxDQUFDLEVBQUc7UUFDYixJQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFHO1VBQ2hDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCO01BQ0QsQ0FDRCxDQUFDO01BRUQsSUFBSTtRQUVILElBQUssVUFBVSxDQUFDLGdCQUFnQixFQUFHO1VBQ2xDLE1BQU0sMkJBQTJCO1FBQ2xDO1FBQ0EsSUFBSyxVQUFVLENBQUMscUJBQXFCLElBQU0sSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssWUFBWSxDQUFDLE9BQU8sQ0FBRSxhQUFjLENBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFFLGlCQUFrQixDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBRSxjQUFlLENBQUMsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFFLGlCQUFrQixDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBRSxjQUFlLENBQUMsRUFBRztVQUNsUixZQUFZLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLEVBQUcsQ0FBQztVQUM3QyxZQUFZLENBQUMsT0FBTyxDQUFFLGlCQUFpQixFQUFFLEVBQUcsQ0FBQztVQUM3QyxZQUFZLENBQUMsT0FBTyxDQUFFLGFBQWEsRUFBRSxFQUFHLENBQUM7VUFDekMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFFLGNBQWUsQ0FBQztVQUMzQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBRSxjQUFlLENBQUM7VUFDcEQsTUFBTSwyQkFBMkI7UUFDbEM7UUFFQSxJQUFLLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUMsRUFBRztVQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUUsQ0FBQztVQUNsRSxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUUsSUFBSyxDQUFDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRztZQUNuRCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUUsSUFBSyxDQUFDO1VBQ2xDO1FBQ0Q7UUFFQSxJQUFLLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUMsRUFBRztVQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLFlBQVksQ0FBQyxPQUFPLENBQUUsaUJBQWtCLENBQUUsQ0FBQztVQUNsRSxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUUsSUFBSyxDQUFDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRztZQUNuRCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBRSxJQUFLLENBQUM7VUFDM0M7UUFDRDtRQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUUsb0VBQXFFLENBQUUsQ0FBQztRQUUvRixDQUFDLENBQUUsbUNBQW9DLENBQUMsQ0FBQyxRQUFRLENBQUUsZUFBZ0IsQ0FBQztNQUVyRSxDQUFDLENBQUMsT0FBUSxHQUFHLEVBQUc7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUksQ0FBQztRQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztNQUM1QjtJQUVELENBQUMsTUFBTTtNQUNOLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVCO0lBQ0E7SUFHQSxJQUFJLG1CQUFtQixHQUN0QixXQUFXLEtBQUssT0FBTyxFQUFFLElBQ3pCLEVBQUUsQ0FBQyxTQUFTLElBQ1osRUFBRSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsSUFDN0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLElBQzNCLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLGFBQzVCO0lBQ0QsSUFBSyxtQkFBbUIsRUFBRztNQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FDakMsMEJBQTBCLEVBQzFCLFlBQVc7UUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztNQUM1QixDQUNELENBQUM7SUFDRjtJQUNBO0VBRUMsQ0FBQyxDQUFDO0FBQ0gsQ0FBQyxFQUFFLE1BQU0sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogTWFpbiBTbWFydCBXb29Db21tZXJjZSBXaXNobGlzdCBKU1xuICpcbiAqIEBhdXRob3IgTW9yZUNvbnZlcnRcbiAqIEBwYWNrYWdlIFNtYXJ0IFdpc2hsaXN0IEZvciBNb3JlIENvbnZlcnRcbiAqXG4gKiBAdmVyc2lvbiAxLjguNFxuICovXG5cbi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG4oZnVuY3Rpb24gKCQpIHtcblx0JC5ub0NvbmZsaWN0KCk7XG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0XHQvKiA9PT0gTUFJTiBJTklUID09PSAqL1xuXHRcdHZhciBwcm9kdWN0X2luX2xpc3QgICAgID0gW10gLFxuXHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdCA9IFtdICxcblx0XHRcdGxhbmcgICAgICAgICAgICAgICAgPSB3bGZtY19sMTBuLmxhbmcsXG5cdFx0XHRyZW1vdmVfaXRlbV91cmwgICAgID0gbnVsbCxcblx0XHRcdHdpc2hsaXN0X2l0ZW1zICAgICAgPSB3bGZtY19sMTBuLndpc2hsaXN0X2l0ZW1zLFxuXHRcdFx0d2FpdGxpc3RfaXRlbXMgICAgICA9IHdsZm1jX2wxMG4ud2FpdGxpc3RfaXRlbXMsXG5cdFx0XHRwcm9kdWN0X2FkZGluZyAgICAgID0gZmFsc2UsXG5cdFx0XHRmcmFnbWVudHhocixcblx0XHRcdGZyYWdtZW50dGltZW91dDtcblxuXHRcdFxuJC5mbi5XTEZNQyA9IHtcblx0aW5pdF9wcmVwYXJlX3F0eV9saW5rczogZnVuY3Rpb24gKCkge1xuXHRcdGxldCBxdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlIC5xdWFudGl0eScgKTtcblxuXHRcdGlmIChxdHkubGVuZ3RoIDwgMSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcXR5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAocXR5W2ldLmNsYXNzTGlzdC5jb250YWlucyggJ2hpZGRlbicgKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBwbHVzICA9IHF0eVtpXS5xdWVyeVNlbGVjdG9yKCAnLmJvdGlnYS1xdWFudGl0eS1wbHVzLCBhLnBsdXMsIC5jdC1pbmNyZWFzZScgKSxcblx0XHRcdFx0bWludXMgPSBxdHlbaV0ucXVlcnlTZWxlY3RvciggJy5ib3RpZ2EtcXVhbnRpdHktbWludXMsIGEubWludXMsIC5jdC1kZWNyZWFzZScgKTtcblxuXHRcdFx0aWYgKCAhIHBsdXMgfHwgISBtaW51cyB8fCBwbHVzLmxlbmd0aCA8IDEgfHwgbWludXMubGVuZ3RoIDwgMSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cGx1cy5jbGFzc0xpc3QuYWRkKCAnc2hvdycgKTtcblx0XHRcdG1pbnVzLmNsYXNzTGlzdC5hZGQoICdzaG93JyApO1xuXHRcdFx0dmFyIHBsdXNfY2xvbmUgID0gcGx1cy5jbG9uZU5vZGUoIHRydWUgKSxcblx0XHRcdFx0bWludXNfY2xvbmUgPSBtaW51cy5jbG9uZU5vZGUoIHRydWUgKTtcblx0XHRcdHBsdXNfY2xvbmUuYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0J2NsaWNrJyxcblx0XHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dmFyIGlucHV0ICAgICAgID0gdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoICcucXR5JyApLFxuXHRcdFx0XHRcdFx0dmFsICAgICAgICAgPSBwYXJzZUZsb2F0KCBpbnB1dC52YWx1ZSwgMTAgKSB8fCAwLFxuXHRcdFx0XHRcdFx0Y2hhbmdlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0hUTUxFdmVudHMnICk7XG5cblx0XHRcdFx0XHRjb25zdCBtYXhfdmFsID0gKGlucHV0LmdldEF0dHJpYnV0ZSggXCJtYXhcIiApICYmIHBhcnNlRmxvYXQoIGlucHV0LmdldEF0dHJpYnV0ZSggXCJtYXhcIiApLCAwICkpIHx8IDEgLyAwO1xuXHRcdFx0XHRcdGlucHV0LnZhbHVlICAgPSB2YWwgPCBtYXhfdmFsID8gTWF0aC5yb3VuZCggMTAwICogKHZhbCArIHBhcnNlRmxvYXQoIGlucHV0LnN0ZXAgfHwgXCIxXCIgKSkgKSAvIDEwMCA6IG1heF92YWw7XG5cblx0XHRcdFx0XHQvLyBpbnB1dC52YWx1ZSA9IGlucHV0LnZhbHVlID09PSAnJyA/IDAgOiBwYXJzZUludCggaW5wdXQudmFsdWUgKSArIDE7XG5cdFx0XHRcdFx0Y2hhbmdlRXZlbnQuaW5pdEV2ZW50KCAnY2hhbmdlJywgdHJ1ZSwgZmFsc2UgKTtcblx0XHRcdFx0XHRpbnB1dC5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHRcdG1pbnVzX2Nsb25lLmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdCdjbGljaycsXG5cdFx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciBpbnB1dCAgICAgICA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCAnLnF0eScgKSxcblx0XHRcdFx0XHRcdHZhbCAgICAgICAgID0gcGFyc2VGbG9hdCggaW5wdXQudmFsdWUsIDEwICkgfHwgMCxcblx0XHRcdFx0XHRcdGNoYW5nZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdIVE1MRXZlbnRzJyApO1xuXHRcdFx0XHRcdGNvbnN0IG1pbl92YWwgICA9IGlucHV0LmdldEF0dHJpYnV0ZSggXCJtaW5cIiApID8gTWF0aC5yb3VuZCggMTAwICogcGFyc2VGbG9hdCggaW5wdXQuZ2V0QXR0cmlidXRlKCBcIm1pblwiICksIDAgKSApIC8gMTAwIDogMDtcblx0XHRcdFx0XHRpbnB1dC52YWx1ZSAgICAgPSB2YWwgPiBtaW5fdmFsID8gTWF0aC5yb3VuZCggMTAwICogKHZhbCAtIHBhcnNlRmxvYXQoIGlucHV0LnN0ZXAgfHwgXCIxXCIgKSkgKSAvIDEwMCA6IG1pbl92YWw7XG5cblx0XHRcdFx0XHQvLyBpbnB1dC52YWx1ZSA9IHBhcnNlSW50KCBpbnB1dC52YWx1ZSApID4gMCA/IHBhcnNlSW50KCBpbnB1dC52YWx1ZSApIC0gMSA6IDA7XG5cdFx0XHRcdFx0Y2hhbmdlRXZlbnQuaW5pdEV2ZW50KCAnY2hhbmdlJywgdHJ1ZSwgZmFsc2UgKTtcblx0XHRcdFx0XHRpbnB1dC5kaXNwYXRjaEV2ZW50KCBjaGFuZ2VFdmVudCApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHRcdHF0eVtpXS5yZXBsYWNlQ2hpbGQoIHBsdXNfY2xvbmUsIHBsdXMgKTtcblx0XHRcdHF0eVtpXS5yZXBsYWNlQ2hpbGQoIG1pbnVzX2Nsb25lLCBtaW51cyApO1xuXHRcdH1cblxuXHR9LFxuXG5cdHByZXBhcmVfbWluaV93aXNobGlzdDogZnVuY3Rpb24gKGEpIHtcblx0XHRpZiAoIGEuaGFzQ2xhc3MoICdwb3NpdGlvbi1hYnNvbHV0ZScgKSApIHtcblx0XHRcdHZhciBhbyAgPSBhLm9mZnNldCgpLFxuXHRcdFx0XHRhbCAgPSBhby5sZWZ0LFxuXHRcdFx0XHRhdCAgPSBhby50b3AsXG5cdFx0XHRcdGF3ICA9IGEub3V0ZXJXaWR0aCgpLFxuXHRcdFx0XHRhaCAgPSBhLm91dGVySGVpZ2h0KCksXG5cdFx0XHRcdGxhICA9IHBhcnNlRmxvYXQoIGEuY3NzKCAnbGVmdCcgKSApLFxuXHRcdFx0XHR0YSAgPSBwYXJzZUZsb2F0KCBhLmNzcyggJ3RvcCcgKSApLFxuXHRcdFx0XHRhb2wgPSBhbCAtIGxhLFxuXHRcdFx0XHRhb3QgPSBhdCAtIHRhLFxuXHRcdFx0XHRfbGEgPSBsYSwgX3RhID0gdGEsIHd3ID0gJCggd2luZG93ICkud2lkdGgoKSwgZGggPSAkKCBkb2N1bWVudCApLmhlaWdodCgpLCBvcyA9IDUwLFxuXHRcdFx0XHRyICAgPSB3dyAtIGFvbCAtIGF3IC0gb3MsIGwgPSBvcyAtIGFvbCwgYiA9IGRoIC0gYW90IC0gYWggLSBvcztcblx0XHRcdGlmICh3dyA8PSBhdykge1xuXHRcdFx0XHRfbGEgPSAtMSAqIGFvbDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IHd3IC0gKGF3ICsgb3MgKiAyKSkge1xuXHRcdFx0XHRfbGEgPSAod3cgLSBhdykgLyAyIC0gYW9sO1xuXHRcdFx0fSBlbHNlIGlmICgwIDwgbCkge1xuXHRcdFx0XHRfbGEgPSBsO1xuXHRcdFx0fSBlbHNlIGlmICgwID4gcikge1xuXHRcdFx0XHRfbGEgPSByO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRoIDwgYWgpIHtcblx0XHRcdFx0YS5oZWlnaHQoIGRoIC0gYS5vdXRlckhlaWdodCgpICsgYS5oZWlnaHQoKSApO1xuXHRcdFx0XHRhaCA9IGEub3V0ZXJIZWlnaHQoKTtcblx0XHRcdH1cblx0XHRcdGlmIChkaCA8PSBhaCkge1xuXHRcdFx0XHRfdGEgPSAtMSAqIGFvdDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IGRoIC0gKGFoICsgb3MgKiAyKSkge1xuXHRcdFx0XHRfdGEgPSAoZGggLSBhaCkgLyAyIC0gYW90O1xuXHRcdFx0fSBlbHNlIGlmICgwID4gYikge1xuXHRcdFx0XHRfdGEgPSBiO1xuXHRcdFx0fVxuXHRcdFx0YS5jc3MoIHtsZWZ0OiBfbGEsIHRvcDogX3RhLH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHAgPSAkKCAnLndsZm1jLWNvdW50ZXItd3JhcHBlci4nICsgYS5hdHRyKCAnZGF0YS1pZCcgKSApO1xuXHRcdFx0aWYgKCB0eXBlb2YgcCAhPT0gJ3VuZGVmaW5lZCcgJiYgMCA8IHAubGVuZ3RoICkge1xuXHRcdFx0XHR2YXIgcG8gID0gcC5vZmZzZXQoKSxcblx0XHRcdFx0XHRzdCAgPSAkKCB3aW5kb3cgKS5zY3JvbGxUb3AoKSxcblx0XHRcdFx0XHRfbGEgPSBwby5sZWZ0LFxuXHRcdFx0XHRcdF90YSA9IHBvLnRvcCArIHAuaGVpZ2h0KCkgLSBzdCxcblx0XHRcdFx0XHRhdyAgPSBhLm91dGVyV2lkdGgoKSxcblx0XHRcdFx0XHR3dyAgPSAkKCB3aW5kb3cgKS53aWR0aCgpO1xuXG5cdFx0XHRcdGlmIChfbGEgKyBhdyA+IHd3KSB7XG5cdFx0XHRcdFx0X2xhID0gd3cgLSBhdyAtIDIwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuY3NzKCB7bGVmdDogX2xhICwgdG9wOiBfdGEgfSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9LFxuXG5cdGFwcGVuZHRvQm9keTogZnVuY3Rpb24gKGVsZW0pIHtcblx0XHRpZiAoICEgZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLnBvc2l0aW9uLWZpeGVkJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHZhciBjb3VudGVyX3R5cGUgPSBlbGVtLmNsb3Nlc3QoJy53bGZtYy1jb3VudGVyLXdyYXBwZXInKS5maW5kKCcud2xmbWMtY291bnRlci1pdGVtcycpLmhhc0NsYXNzKCd3bGZtYy1saXN0cy1jb3VudGVyLWRyb3Bkb3duJykgPyAnd2xmbWMtcHJlbWl1bS1saXN0LWNvdW50ZXInIDogKGVsZW0uY2xvc2VzdCgnLndsZm1jLWNvdW50ZXItd3JhcHBlcicpLmhhc0NsYXNzKCd3bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXInKSA/ICd3bGZtYy13YWl0bGlzdC1jb3VudGVyJyA6ICd3bGZtYy13aXNobGlzdC1jb3VudGVyJyk7XG5cdFx0aWYgKCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy13aXNobGlzdC1jb3VudGVyJyApLmxlbmd0aCA+IDAgfHwgZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtd2FpdGxpc3QtY291bnRlcicgKS5sZW5ndGggPiAwIHx8IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXByZW1pdW0tbGlzdC1jb3VudGVyJyApLmxlbmd0aCA+IDAgICkge1xuXHRcdFx0dmFyIHdpZGdldElkICA9IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXdpc2hsaXN0LWNvdW50ZXInICkuZGF0YSggXCJpZFwiICkgfHwgZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtd2FpdGxpc3QtY291bnRlcicgKS5kYXRhKCBcImlkXCIgKSB8fCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy1wcmVtaXVtLWxpc3QtY291bnRlcicgKS5kYXRhKCBcImlkXCIgKTtcblx0XHRcdHZhciBlbGVtZW50SWQgPSBlbGVtLmNsb3Nlc3QoICdbZGF0YS1lbGVtZW50b3ItaWRdJyApLmRhdGEoIFwiZWxlbWVudG9yLWlkXCIgKTtcblx0XHRcdHZhciBlbGVtZW50b3IgPSBcIjxkaXYgY2xhc3M9J3dsZm1jLWVsZW1lbnRvciBlbGVtZW50b3IgZWxlbWVudG9yLVwiICsgZWxlbWVudElkICsgXCIgXCIgKyBjb3VudGVyX3R5cGUgKyBcIic+PGRpdiBjbGFzcz0nZWxlbWVudG9yLWVsZW1lbnQgZWxlbWVudG9yLWVsZW1lbnQtXCIgKyB3aWRnZXRJZCArIFwiJz48L2Rpdj48L2Rpdj5cIjtcblx0XHRcdCQoIGVsZW1lbnRvciApLmFwcGVuZFRvKCBcImJvZHlcIiApO1xuXHRcdFx0JCggXCIud2xmbWMtZWxlbWVudG9yLmVsZW1lbnRvci1cIiArIGVsZW1lbnRJZCArIFwiIC5lbGVtZW50b3ItZWxlbWVudC1cIiArIHdpZGdldElkICkuYXBwZW5kKCBlbGVtICk7XG5cblx0XHR9IGVsc2UgaWYgKCAhIGVsZW0uY2xvc2VzdCggJy53bGZtYy1lbGVtZW50b3InICkubGVuZ3RoID4gMCApIHtcblx0XHRcdHZhciB3aWRnZXRJZCAgPSBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1pdGVtcycgKS5kYXRhKCBcImlkXCIgKTtcblx0XHRcdHZhciBlbGVtZW50b3IgPSBcIjxkaXYgY2xhc3M9J3dsZm1jLWVsZW1lbnRvciBuby1lbGVtZW50b3ItXCIgKyB3aWRnZXRJZCArIFwiIFwiICsgY291bnRlcl90eXBlICsgXCInPjwvZGl2PlwiO1xuXHRcdFx0JCggZWxlbWVudG9yICkuYXBwZW5kVG8oIFwiYm9keVwiICk7XG5cdFx0XHQkKCBcIi53bGZtYy1lbGVtZW50b3Iubm8tZWxlbWVudG9yLVwiICsgd2lkZ2V0SWQgKS5hcHBlbmQoIGVsZW0gKTtcblx0XHR9XG5cblx0fSxcblxuXHRzaG93X21pbmlfd2lzaGxpc3Q6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCAnLndsZm1jLWNvdW50ZXItZHJvcGRvd24nICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdCQuZm4uV0xGTUMuYXBwZW5kdG9Cb2R5KCBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApICk7XG5cdFx0JC5mbi5XTEZNQy5wcmVwYXJlX21pbmlfd2lzaGxpc3QoIGVsZW0gKTtcblx0XHRlbGVtLmFkZENsYXNzKCAnbGlzdHMtc2hvdycgKTtcblxuXHR9LFxuXG5cdGhpZGVfbWluaV93aXNobGlzdDogZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIGVsZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdCQoICcud2xmbWMtZmlyc3QtdG91Y2gnICkucmVtb3ZlQ2xhc3MoICd3bGZtYy1maXJzdC10b3VjaCcgKTtcblx0XHQkKCAnLndsZm1jLWZpcnN0LWNsaWNrJyApLnJlbW92ZUNsYXNzKCAnd2xmbWMtZmlyc3QtY2xpY2snICk7XG5cdFx0ZWxlbS5yZW1vdmVDbGFzcyggJ2xpc3RzLXNob3cnICk7XG5cblx0fSxcblxuXHRyZUluaXRfd2xmbWM6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19pbml0JyApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBIYW5kbGUgRHJhZyAmIERyb3Agb2YgaXRlbXMgZm9yIHNvcnRpbmdcblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqIEBzaW5jZSAxLjYuOFxuXHQgKi9cblx0aW5pdF9kcmFnX25fZHJvcDogZnVuY3Rpb24gKCkge1xuXG5cdFx0JCgndGFibGUud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicpLmZpbHRlcignLnNvcnRhYmxlJykubm90KCcubm8taW50ZXJhY3Rpb25zJykuZWFjaCggZnVuY3Rpb24oKXtcblx0XHRcdHZhciB0ID0gJCh0aGlzKSxcblx0XHRcdFx0anF4aHIgPSBmYWxzZTtcblxuXHRcdFx0dC5zb3J0YWJsZSgge1xuXHRcdFx0XHRpdGVtczogJy53bGZtYy10YWJsZS1pdGVtW2RhdGEtcm93LWlkXScsXG5cdFx0XHRcdGhhbmRsZTogXCIuc29ydGFibGUtaGFuZGxlXCIsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiBcInVpLXNvcnRhYmxlLXBsYWNlaG9sZGVyXCIsXG5cdFx0XHRcdHNjcm9sbDogdHJ1ZSxcblx0XHRcdFx0c2Nyb2xsU2Vuc2l0aXZpdHk6IDQwLFxuXHRcdFx0XHR0b2xlcmFuY2UgOiBcInBvaW50ZXJcIixcblx0XHRcdFx0aGVscGVyOiBmdW5jdGlvbiggZSwgdWkgKXtcblx0XHRcdFx0XHR1aS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgZWxlbXMgPSAkKHRoaXMpLmNsb3Nlc3QoJy53aXNobGlzdC1pdGVtcy13cmFwcGVyJykuZmluZCgnLnNob3ctbWV0YS1kYXRhJyk7XG5cdFx0XHRcdFx0XHRpZiAoIGVsZW1zLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGVsZW1zLnJlbW92ZUNsYXNzKCdzaG93LW1ldGEtZGF0YScpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxlbXMgPSAkKHRoaXMpLmNsb3Nlc3QoJy53aXNobGlzdC1pdGVtcy13cmFwcGVyJykuZmluZCgnLndsZm1jLXJvdy1tZXRhLWRhdGEnKTtcblx0XHRcdFx0XHRcdGlmICggZWxlbXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0ZWxlbXMuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gdWk7XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0dXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpe1xuXHRcdFx0XHRcdHZhciByb3cgPSB0LmZpbmQoJ1tkYXRhLXJvdy1pZF0nKSxcblx0XHRcdFx0XHRcdHBvc2l0aW9ucyA9IFtdLFxuXHRcdFx0XHRcdFx0aSA9IDA7XG5cblx0XHRcdFx0XHRpZiggISByb3cubGVuZ3RoICl7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYoIGpxeGhyICl7XG5cdFx0XHRcdFx0XHRqcXhoci5hYm9ydCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJvdy5lYWNoKCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dmFyIHQgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHR0LmZpbmQoICdpbnB1dFtuYW1lKj1cIltwb3NpdGlvbl1cIl0nICkudmFsKGkrKyk7XG5cblx0XHRcdFx0XHRcdHBvc2l0aW9ucy5wdXNoKCB0LmRhdGEoJ3Jvdy1pZCcpICk7XG5cblx0XHRcdFx0XHRcdHZhciBlbGVtZW50cyA9IHQuY2xvc2VzdCgnLndpc2hsaXN0LWl0ZW1zLXdyYXBwZXInKS5maW5kKCcucGFyZW50LXJvdy1pZC0nICsgdC5kYXRhKCdyb3ctaWQnKSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIGVsZW1lbnRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdHQuYWZ0ZXIoZWxlbWVudHMpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0anF4aHIgPSAkLmFqYXgoe1xuXHRcdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5zb3J0X3dpc2hsaXN0X2l0ZW1zLFxuXHRcdFx0XHRcdFx0XHRub25jZTogJCggJyN3bGZtYy13aXNobGlzdC1mb3JtIHRhYmxlLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRcdFx0cG9zaXRpb25zOiBwb3NpdGlvbnMsXG5cdFx0XHRcdFx0XHRcdHdpc2hsaXN0X3Rva2VuOiB0LmRhdGEoJ3Rva2VuJyksXG5cdFx0XHRcdFx0XHRcdHBhZ2U6IHQuZGF0YSgncGFnZScpLFxuXHRcdFx0XHRcdFx0XHRwZXJfcGFnZTogdC5kYXRhKCdwZXItcGFnZScpXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdFx0fSApO1xuXHR9LFxuXG5cdC8qID09PSBUb29sdGlwID09PSAqL1xuXHRpbml0X3Rvb2x0aXA6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgd2xmbWNfdG9vbHRpcCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBpbnN0YW5jZTtcblx0XHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMuaWRTZWxlY3RvciA9ICd3bGZtYy10b29sdGlwJztcblx0XHRcdHRoaXMudGV4dCAgICAgICA9ICcnO1xuXHRcdFx0dGhpcy50b3AgICAgICAgID0gMDtcblx0XHRcdHRoaXMubGVmdCAgICAgICA9IDA7XG5cdFx0XHR0aGlzLmRpcmVjdGlvbiAgPSB0eXBlb2YgdGhpcy5kaXJlY3Rpb24gIT09ICd1bmRlZmluZWQnID8gdGhpcy5kaXJlY3Rpb24gOiAnYm90dG9tJztcblx0XHRcdHRoaXMudF90eXBlICAgICA9IHR5cGVvZiB0aGlzLnRfdHlwZSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLnRfdHlwZSA6ICdkZWZhdWx0Jztcblx0XHRcdHRoaXMudGFyZ2V0ICAgICA9ICcnO1xuXG5cdFx0XHQvLyBDcmVhdGUgYWN0dWFsIGVsZW1lbnQgYW5kIHRpZSBlbGVtZW50IHRvIG9iamVjdCBmb3IgcmVmZXJlbmNlLlxuXHRcdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFNlbGVjdG9yKTtcblxuXHRcdFx0aWYgKCAhIHRoaXMubm9kZSApIHtcblx0XHRcdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdFx0dGhpcy5ub2RlLnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuaWRTZWxlY3Rvcik7XG5cdFx0XHRcdHRoaXMubm9kZS5jbGFzc05hbWUgPSB0aGlzLm5vZGUuY2xhc3NOYW1lICsgXCJ0b29sdGlwX19oaWRkZW5cIjtcblx0XHRcdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IHRoaXMudGV4dDtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zaG93ID0gZnVuY3Rpb24gKCkgeyAvLyBSZXJlbmRlciB0b29sdGlwLlxuXG5cdFx0XHRcdHZhciBsb2NhdGlvbl9vcmRlciA9IFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J107XG5cblx0XHRcdFx0X3NlbGYubm9kZS5pbm5lckhUTUwgPSBfc2VsZi50ZXh0O1xuXHRcdFx0XHR2YXIgZGlyZWN0aW9uICAgICAgICA9IF9zZWxmLmRpcmVjdGlvbjtcblx0XHRcdFx0dmFyIHRfdHlwZSAgICAgICAgICAgPSBfc2VsZi50X3R5cGU7XG5cdFx0XHRcdGlmIChkaXJlY3Rpb24pIHtcblx0XHRcdFx0XHQkKCB0aGlzLm5vZGUgKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2V4cGFuZGVkIHRvb2x0aXBfX2V4cGFuZGVkLScgKyBkaXJlY3Rpb24gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKCB0aGlzLm5vZGUgKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2V4cGFuZGVkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQoIHRoaXMubm9kZSApLmFkZENsYXNzKCAnd2xmbWMtdG9vbHRpcC0nICsgdF90eXBlICk7XG5cblx0XHRcdFx0JCggdGhpcy5ub2RlICkucmVtb3ZlQ2xhc3MoICd0b29sdGlwX19oaWRkZW4nICk7XG5cblx0XHRcdFx0aWYgKG9mZnNjcmVlbiggJCggd2xmbWNUb29sdGlwLm5vZGUgKSApKSB7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmhpZGUoKTtcblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID0gbG9jYXRpb25fb3JkZXJbbG9jYXRpb25fb3JkZXIuaW5kZXhPZiggd2xmbWNUb29sdGlwLmRpcmVjdGlvbiApICsgMV07XG5cdFx0XHRcdFx0bW92ZVRpcCggd2xmbWNUb29sdGlwLm5vZGUsIHdsZm1jVG9vbHRpcC50YXJnZXQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmhpZGUgPSBmdW5jdGlvbiAoKSB7IC8vIEhpZGUgdG9vbHRpcC5cblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmNzcyggJ3RvcCcsICcwJyApO1xuXHRcdFx0XHQkKCBfc2VsZi5ub2RlICkuY3NzKCAnbGVmdCcsICcwJyApO1xuXHRcdFx0XHQkKCBfc2VsZi5ub2RlICkuYXR0ciggJ2NsYXNzJywgJycgKTtcblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmFkZENsYXNzKCAndG9vbHRpcF9faGlkZGVuJyApO1xuXHRcdFx0fTtcblxuXHRcdH07XG5cdFx0Ly8gTW92ZSB0aXAgdG8gcHJvcGVyIGxvY2F0aW9uIGJlZm9yZSBkaXNwbGF5LlxuXHRcdHZhciBvZmZzY3JlZW4gPSBmdW5jdGlvbiAoZWwpIHtcblx0XHRcdHJldHVybiAoKGVsLm9mZnNldExlZnQgKyBlbC5vZmZzZXRXaWR0aCkgPCAwIHx8IChlbC5vZmZzZXRUb3AgKyBlbC5vZmZzZXRIZWlnaHQpIDwgMCB8fCAoZWwub2Zmc2V0TGVmdCArIGVsLm9mZnNldFdpZHRoID4gd2luZG93LmlubmVyV2lkdGggfHwgZWwub2Zmc2V0VG9wICsgZWwub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSk7XG5cdFx0fTtcblx0XHR2YXIgbW92ZVRpcCAgID0gZnVuY3Rpb24gKGVsbCwgdGFyZ2V0KSB7XG5cblx0XHRcdHZhciAkdGFyZ2V0ID0gJCggdGFyZ2V0ICk7XG5cdFx0XHR2YXIgJGVsbCAgICA9ICQoIGVsbCApO1xuXHRcdFx0dmFyIGJvZHkgICAgPSAkKCBcImJvZHlcIiApLm9mZnNldCgpO1xuXHRcdFx0JCggXCJib2R5XCIgKS5jc3MoIHsncG9zaXRpb24nOiAncmVsYXRpdmUnfSApO1xuXG5cdFx0XHQvLyBmaXggJGVsbCBzaXplIGFmdGVyIGNoYW5nZSBuZXcgdG9vbHRpcCB0ZXh0LlxuXHRcdFx0d2xmbWNUb29sdGlwLnNob3coKTtcblx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cblx0XHRcdHZhciBidXUgPSA3OyAvLyBEZWZhdWx0IHBhZGRpbmcgc2l6ZSBpbiBweC5cblx0XHRcdC8vIHZhciBjZW50ZXJfaGVpZ2h0ID0gLSgkZWxsLm91dGVySGVpZ2h0KCkgLyAyKSAvIDI7XG5cdFx0XHR2YXIgY2VudGVyX2hlaWdodCA9ICgoJHRhcmdldC5vdXRlckhlaWdodCgpIC0gJGVsbC5vdXRlckhlaWdodCgpICkgLyAyKTtcblx0XHRcdHZhciBjZW50ZXJfd2lkdGggID0gLSgkZWxsLm91dGVyV2lkdGgoKSAvIDIpICsgJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyO1xuXG5cdFx0XHR2YXIgbG9jYXRpb25zICAgICAgPSB7XG5cdFx0XHRcdCd0b3AnOiBbLSRlbGwub3V0ZXJIZWlnaHQoKSAtIGJ1dSwgY2VudGVyX3dpZHRoXSxcblx0XHRcdFx0J3JpZ2h0JzogW2NlbnRlcl9oZWlnaHQsICR0YXJnZXQub3V0ZXJXaWR0aCgpICsgYnV1XSxcblx0XHRcdFx0J2JvdHRvbSc6IFskdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyBidXUsIGNlbnRlcl93aWR0aF0sXG5cdFx0XHRcdCdsZWZ0JzogW2NlbnRlcl9oZWlnaHQsIC0kZWxsLm91dGVyV2lkdGgoKSAtIGJ1dV1cblx0XHRcdH07XG5cdFx0XHR2YXIgbG9jYXRpb25fb3JkZXIgPSBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddO1xuXHRcdFx0dmFyIGxvY2F0aW9uX2tleXMgID0gT2JqZWN0LmtleXMoIGxvY2F0aW9ucyApO1xuXHRcdFx0aWYgKHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPT09ICd0b3AnIHx8IHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPT09ICdib3R0b20nKSB7XG5cdFx0XHRcdCRlbGwuY3NzKCAndG9wJywgJHRhcmdldC5vZmZzZXQoKS50b3AgLSAoYm9keS50b3ApICsgbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzBdICk7XG5cdFx0XHRcdCRlbGwuY3NzKCAnbGVmdCcsICR0YXJnZXQub2Zmc2V0KCkubGVmdCAtIChib2R5LmxlZnQpICsgKGJ1dSAvIDIpICsgbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzFdICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vICRlbGwuY3NzKCAndG9wJywgJHRhcmdldC5vZmZzZXQoKS50b3AgLSAoYm9keS50b3ApICsgKGJ1dSAvIDIpICsgbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzBdICk7XG5cdFx0XHRcdHZhciB0b3AgPSBsb2NhdGlvbnNbd2xmbWNUb29sdGlwLmRpcmVjdGlvbl1bMF0gLSAoYnV1IC8gMik7XG5cdFx0XHRcdHRvcCAgICAgPSB0b3AgPCAwID8gdG9wICsgKGJ1dSAvIDIpIDogdG9wO1xuXHRcdFx0XHQkZWxsLmNzcyggJ3RvcCcsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gKGJvZHkudG9wKSArIHRvcCApO1xuXHRcdFx0XHQkZWxsLmNzcyggJ2xlZnQnLCAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSAoYm9keS5sZWZ0KSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVsxXSApO1xuXG5cdFx0XHR9XG5cdFx0XHRpZiAob2Zmc2NyZWVuKCAkZWxsICkpIHtcblx0XHRcdFx0d2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9IGxvY2F0aW9uX29yZGVyW2xvY2F0aW9uX29yZGVyLmluZGV4T2YoIHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gKSArIDFdO1xuXHRcdFx0XHR3bGZtY1Rvb2x0aXAuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2xmbWNUb29sdGlwLnNob3coKTtcblx0XHRcdH1cblxuXHRcdH07XG5cblx0XHQvLyBDcmVhdGUgZ2xvYmFsIHdsZm1jX3Rvb2x0aXAuXG5cdFx0dmFyIHdsZm1jVG9vbHRpcCA9IG5ldyB3bGZtY190b29sdGlwKCk7XG5cblx0XHQvLyBNb3VzZW92ZXIgdG8gc2hvdy5cblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J21vdXNlZW50ZXInLFxuXHRcdFx0XCIud2xmbWMtdG9vbHRpcFwiLFxuXHRcdFx0ZnVuY3Rpb24gKGVlKSB7XG5cdFx0XHRcdHZhciBfc2VsZiAgICAgICAgICAgPSB0aGlzO1xuXHRcdFx0XHR3bGZtY1Rvb2x0aXAudGFyZ2V0ID0gX3NlbGY7IC8vIERlZmF1bHQgdG8gc2VsZi5cblx0XHRcdFx0dmFyIG5hbWVfY2xhc3NlcyAgICA9IF9zZWxmLmNsYXNzTmFtZS5zcGxpdCggJyAnICk7XG5cdFx0XHRcdG5hbWVfY2xhc3Nlcy5mb3JFYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChjYykge1xuXHRcdFx0XHRcdFx0aWYgKGNjLmluZGV4T2YoICd3bGZtYy10b29sdGlwLScgKSAhPSAtMSkgeyAvLyBGaW5kIGEgZGlyZWN0aW9uYWwgdGFnLlxuXHRcdFx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID0gY2Muc3BsaXQoICctJyApW2NjLnNwbGl0KCAnLScgKS5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCQoIHRoaXMgKS5hdHRyKCAnZGF0YS10b29sdGlwLXR5cGUnICkpIHtcblxuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC50X3R5cGUgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtdG9vbHRpcC10eXBlJyApO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCQoIHRoaXMgKS5hdHRyKCAnZGF0YS10b29sdGlwLXRleHQnICkpIHtcblxuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC50ZXh0ID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXRvb2x0aXAtdGV4dCcgKTtcblx0XHRcdFx0XHRtb3ZlVGlwKCB3bGZtY1Rvb2x0aXAubm9kZSwgd2xmbWNUb29sdGlwLnRhcmdldCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdtb3VzZWxlYXZlJyxcblx0XHRcdFwiLndsZm1jLXRvb2x0aXBcIixcblx0XHRcdGZ1bmN0aW9uIChlZSkgeyAvLyBSZS1oaWRlIHRvb2x0aXAuXG5cdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRpbml0X2ZpeF9vbl9pbWFnZV9zaW5nbGVfcG9zaXRpb246IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoJCggJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnlfX3dyYXBwZXIgLndsZm1jLXRvcC1vZi1pbWFnZScgKS5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKCAnLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeV9fd3JhcHBlciAud2xmbWMtdG9wLW9mLWltYWdlJyApLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuaW5zZXJ0QWZ0ZXIoICQoIHRoaXMgKS5wYXJlbnQoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8qY29uc3QgdG9wT2ZJbWFnZUVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy53bGZtYy10b3Atb2YtaW1hZ2UnICk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRvcE9mSW1hZ2VFbGVtcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgY3VycmVudEVsZW0gPSB0b3BPZkltYWdlRWxlbXNbaV07XG5cdFx0XHQvLyBTZXQgdGhlIG1hcmdpbiB0b3Agb2YgdGhlIG5leHQgc2libGluZyBlbGVtZW50IHRvIHRoZSBoZWlnaHQgb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cblx0XHRcdGlmIChjdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcpIHtcblx0XHRcdFx0bGV0IHBvc2l0aW9uQ2xhc3MgICA9IFsuLi5jdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0XS5maW5kKCBjbGFzc05hbWUgPT4gY2xhc3NOYW1lLnN0YXJ0c1dpdGgoIFwid2xmbWNfcG9zaXRpb25faW1hZ2VfXCIgKSApO1xuXHRcdFx0XHRsZXQgY3VycmVudFBvc2l0aW9uID0gWy4uLmN1cnJlbnRFbGVtLmNsYXNzTGlzdF0uZmluZCggY2xhc3NOYW1lID0+IGNsYXNzTmFtZS5zdGFydHNXaXRoKCBcIndsZm1jX3Bvc2l0aW9uX2ltYWdlX1wiICkgKTtcblx0XHRcdFx0aWYgKHBvc2l0aW9uQ2xhc3MgPT09IGN1cnJlbnRQb3NpdGlvbikge1xuXHRcdFx0XHRcdGlmICgnd2xmbWNfcG9zaXRpb25faW1hZ2VfdG9wX2xlZnQnID09PSBwb3NpdGlvbkNsYXNzIHx8ICd3bGZtY19wb3NpdGlvbl9pbWFnZV90b3BfcmlnaHQnID09PSBwb3NpdGlvbkNsYXNzKSB7XG5cdFx0XHRcdFx0XHRsZXQgbWFyZ2luVG9wID0gYCR7Y3VycmVudEVsZW0ub2Zmc2V0SGVpZ2h0ICsgNX1weGA7XG5cdFx0XHRcdFx0XHQvLyBDaGVjayBmb3IgcHJldmlvdXMgc2libGluZ3Mgd2l0aCB0aGUgc2FtZSBwb3NpdGlvbiBjbGFzcyBhbmQgYWRkIHRoZWlyIGhlaWdodHMgYW5kIGdhcCB2YWx1ZXMgdG8gbWFyZ2luVG9wLlxuXHRcdFx0XHRcdFx0bGV0IHByZXZTaWJsaW5nID0gY3VycmVudEVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZztcblx0XHRcdFx0XHRcdHdoaWxlIChwcmV2U2libGluZyAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoICd3bGZtYy10b3Atb2YtaW1hZ2UnICkgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCBwb3NpdGlvbkNsYXNzICkpIHtcblx0XHRcdFx0XHRcdFx0bWFyZ2luVG9wICAgPSBgY2FsYyggJHttYXJnaW5Ub3B9ICsgJHtwcmV2U2libGluZy5vZmZzZXRIZWlnaHQgKyA1fXB4IClgO1xuXHRcdFx0XHRcdFx0XHRwcmV2U2libGluZyA9IHByZXZTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVG9wO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoJ3dsZm1jX3Bvc2l0aW9uX2ltYWdlX2JvdHRvbV9sZWZ0JyA9PT0gcG9zaXRpb25DbGFzcyB8fCAnd2xmbWNfcG9zaXRpb25faW1hZ2VfYm90dG9tX3JpZ2h0JyA9PT0gcG9zaXRpb25DbGFzcykge1xuXHRcdFx0XHRcdFx0bGV0IG1hcmdpbkJvdHRvbSA9IGAke2N1cnJlbnRFbGVtLm9mZnNldEhlaWdodCArIDV9cHhgO1xuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIHByZXZpb3VzIHNpYmxpbmdzIHdpdGggdGhlIHNhbWUgcG9zaXRpb24gY2xhc3MgYW5kIGFkZCB0aGVpciBoZWlnaHRzIGFuZCBnYXAgdmFsdWVzIHRvIG1hcmdpbkJvdHRvbS5cblx0XHRcdFx0XHRcdGxldCBwcmV2U2libGluZyA9IGN1cnJlbnRFbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR3aGlsZSAocHJldlNpYmxpbmcgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2xmbWMtdG9wLW9mLWltYWdlJyApICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyggcG9zaXRpb25DbGFzcyApKSB7XG5cdFx0XHRcdFx0XHRcdG1hcmdpbkJvdHRvbSA9IGBjYWxjKCAke21hcmdpbkJvdHRvbX0gKyAke3ByZXZTaWJsaW5nLm9mZnNldEhlaWdodCArIDV9cHggKWA7XG5cdFx0XHRcdFx0XHRcdHByZXZTaWJsaW5nICA9IHByZXZTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcuc3R5bGUubWFyZ2luQm90dG9tID0gbWFyZ2luQm90dG9tO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0qL1xuXG5cdH0sXG5cblx0LyogPT09IElOSVQgRlVOQ1RJT05TID09PSAqL1xuXG5cdC8qKlxuXHQgKiBJbml0IHBvcHVwIGZvciBhbGwgbGlua3Mgd2l0aCB0aGUgcGx1Z2luIHRoYXQgb3BlbiBhIHBvcHVwXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF93aXNobGlzdF9wb3B1cDogZnVuY3Rpb24gKCkge1xuXHRcdC8vIGFkZCAmIHJlbW92ZSBjbGFzcyB0byBib2R5IHdoZW4gcG9wdXAgaXMgb3BlbmVkLlxuXHRcdHZhciBjYWxsYmFjayAgICAgICA9IGZ1bmN0aW9uIChub2RlLCBvcCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG5vZGUuY2xhc3NMaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucyggJ3dsZm1jLW92ZXJsYXknICkpIHtcblx0XHRcdFx0XHR2YXIgbWV0aG9kID0gJ3JlbW92ZScgPT09IG9wID8gJ3JlbW92ZUNsYXNzJyA6ICdhZGRDbGFzcyc7XG5cblx0XHRcdFx0XHQkKCAnYm9keScgKVttZXRob2RdKCAnd2xmbWMtd2l0aC1wb3B1cCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNhbGxiYWNrQWRkICAgID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdFx0Y2FsbGJhY2soIG5vZGUsICdhZGQnICk7XG5cdFx0XHR9LFxuXHRcdFx0Y2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAobm9kZSkge1xuXHRcdFx0XHRjYWxsYmFjayggbm9kZSwgJ3JlbW92ZScgKTtcblx0XHRcdH0sXG5cdFx0XHRvYnNlcnZlciAgICAgICA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuXHRcdFx0XHRmdW5jdGlvbiAobXV0YXRpb25zTGlzdCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgaW4gbXV0YXRpb25zTGlzdCkge1xuXHRcdFx0XHRcdFx0dmFyIG11dGF0aW9uID0gbXV0YXRpb25zTGlzdFtpXTtcblx0XHRcdFx0XHRcdGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtdXRhdGlvbi5hZGRlZE5vZGVzICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHRtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goIGNhbGxiYWNrQWRkICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtdXRhdGlvbi5yZW1vdmVkTm9kZXMgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHRcdG11dGF0aW9uLnJlbW92ZWROb2Rlcy5mb3JFYWNoKCBjYWxsYmFja1JlbW92ZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShcblx0XHRcdGRvY3VtZW50LmJvZHksXG5cdFx0XHR7XG5cdFx0XHRcdGNoaWxkTGlzdDogdHJ1ZVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEluaXQgY2hlY2tib3ggaGFuZGxpbmdcblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X2NoZWNrYm94X2hhbmRsaW5nOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGNoZWNrYm94ZXMgPSAkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLCAud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZmluZCggJ3Rib2R5IC5wcm9kdWN0LWNoZWNrYm94IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHR2YXIgbGluayA9ICQoJy5tdWx0aXBsZS1wcm9kdWN0LW1vdmUsLm11bHRpcGxlLXByb2R1Y3QtY29weScpO1xuXHRcdGNoZWNrYm94ZXMub2ZmKCAnY2hhbmdlJyApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIHQgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0cCA9IHQucGFyZW50KCk7XG5cblx0XHRcdFx0aWYgKCAhIHQuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0XHRcdCQoICdpbnB1dFtuYW1lPVwiJyArIHQuYXR0ciggJ25hbWUnICkgKyAnXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydDInICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHAucmVtb3ZlQ2xhc3MoICdjaGVja2VkJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAndW5jaGVja2VkJyApXG5cdFx0XHRcdFx0LmFkZENsYXNzKCB0LmlzKCAnOmNoZWNrZWQnICkgPyAnY2hlY2tlZCcgOiAndW5jaGVja2VkJyApO1xuXG5cdFx0XHRcdGlmICggbGluay5sZW5ndGggPiAwICkge1xuXG5cdFx0XHRcdFx0dmFyIGlzQ2hlY2tlZCA9IGNoZWNrYm94ZXMuaXMoJzpjaGVja2VkJyk7XG5cdFx0XHRcdFx0aWYgKGlzQ2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0bGluay5zaG93KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxpbmsuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgcm93ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpO1xuXHRcdFx0XHRcdHZhciBpdGVtSWQgPSByb3cuYXR0cignZGF0YS1pdGVtLWlkJyk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nSXRlbUlkID0gbGluay5hdHRyKCdkYXRhLWl0ZW0taWQnKTtcblx0XHRcdFx0XHRpZiAoICB0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXhpc3RpbmdJdGVtSWQpIHtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBleGlzdGluZ0l0ZW1JZC5zcGxpdCgnLCcpO1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZC5wdXNoKGl0ZW1JZCk7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuam9pbignLCcpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBpdGVtSWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChleGlzdGluZ0l0ZW1JZCkge1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZCA9IGV4aXN0aW5nSXRlbUlkLnNwbGl0KCcsJyk7XG5cdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGV4aXN0aW5nSXRlbUlkLmluZGV4T2YoaXRlbUlkKTtcblx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBleGlzdGluZ0l0ZW1JZC5qb2luKCcsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGluay5hdHRyKCdkYXRhLWl0ZW0taWQnLCBleGlzdGluZ0l0ZW1JZCk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbml0IGpzIGhhbmRsaW5nIG9uIHdpc2hsaXN0IHRhYmxlIGl0ZW1zIGFmdGVyIGFqYXggdXBkYXRlXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF9oYW5kbGluZ19hZnRlcl9hamF4OiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5pbml0X3ByZXBhcmVfcXR5X2xpbmtzKCk7XG5cdFx0dGhpcy5pbml0X2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cdFx0Ly90aGlzLmluaXRfcXVhbnRpdHkoKTtcblx0XHQvL3RoaXMuaW5pdF9jb3B5X3dpc2hsaXN0X2xpbmsoKTtcblx0XHQvL3RoaXMuaW5pdF90b29sdGlwKCk7XG5cdFx0Ly90aGlzLmluaXRfY29tcG9uZW50cygpO1xuXHRcdC8vdGhpcy5pbml0X2xheW91dCgpO1xuXHRcdHRoaXMuaW5pdF9kcmFnX25fZHJvcCgpO1xuXHRcdC8vdGhpcy5pbml0X3BvcHVwX2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cdFx0dGhpcy5pbml0X2Ryb3Bkb3duX2xpc3RzKCk7XG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd2xmbWNfaW5pdF9hZnRlcl9hamF4JyApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBIYW5kbGUgcXVhbnRpdHkgaW5wdXQgY2hhbmdlIGZvciBlYWNoIHdpc2hsaXN0IGl0ZW1cblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X3F1YW50aXR5OiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGpxeGhyLFxuXHRcdFx0dGltZW91dDtcblxuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCcud2xmbWMtd2lzaGxpc3QtdGFibGUgLnF1YW50aXR5IDppbnB1dCwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlIC5xdWFudGl0eSA6aW5wdXQnLFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdCAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRyb3cgICAgICAgICAgID0gdC5jbG9zZXN0KCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdFx0XHRwcm9kdWN0X2lkICAgID0gcm93LmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHRcdFx0Y2FydF9pdGVtX2tleSA9IHJvdy5kYXRhKCAnY2FydC1pdGVtLWtleScgKSxcblx0XHRcdFx0XHR0YWJsZSAgICAgICAgID0gdC5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKSxcblx0XHRcdFx0XHR0b2tlbiAgICAgICAgID0gdGFibGUuZGF0YSggJ3Rva2VuJyApO1xuXG5cdFx0XHRcdGNsZWFyVGltZW91dCggdGltZW91dCApO1xuXG5cdFx0XHRcdC8vIHNldCBhZGQgdG8gY2FydCBsaW5rIHRvIGFkZCBzcGVjaWZpYyBxdHkgdG8gY2FydC5cblx0XHRcdFx0cm93LmZpbmQoICcuYWRkX3RvX2NhcnRfYnV0dG9uJyApLmF0dHIoICdkYXRhLXF1YW50aXR5JywgdC52YWwoKSApO1xuXG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGlmIChqcXhocikge1xuXHRcdFx0XHRcdFx0XHRqcXhoci5hYm9ydCgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRqcXhociA9ICQuYWpheChcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy51cGRhdGVfaXRlbV9xdWFudGl0eSxcblx0XHRcdFx0XHRcdFx0XHRcdG5vbmNlOiB0YWJsZS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pZDogcHJvZHVjdF9pZCxcblx0XHRcdFx0XHRcdFx0XHRcdGNhcnRfaXRlbV9rZXk6IGNhcnRfaXRlbV9rZXksXG5cdFx0XHRcdFx0XHRcdFx0XHR3aXNobGlzdF90b2tlbjogdG9rZW4sXG5cdFx0XHRcdFx0XHRcdFx0XHRxdWFudGl0eTogdC52YWwoKSxcblx0XHRcdFx0XHRcdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoKVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuYmxvY2soIHJvdyApO1xuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMudW5ibG9jayggcm93ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdC8qaWYgKHR5cGVvZiByZXNwb25zZS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCByZXNwb25zZS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9Ki9cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQxMDAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRpbml0X3BvcHVwczogZnVuY3Rpb24gKCkge1xuXHRcdCQoICdib2R5JyApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2xmbWMtcG9wdXAtdHJpZ2dlcjpub3QoLndsZm1jLWRpc2FibGVkKScsXG5cdFx0XHRmdW5jdGlvbihldikge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaWQgICAgICAgICAgICAgPSAkKCB0aGlzICkuZGF0YSggJ3BvcHVwLWlkJyApO1xuXHRcdFx0XHR2YXIgZWxlbSAgICAgICAgICAgPSAkKCAnIycgKyBpZCApO1xuXHRcdFx0XHR2YXIgcG9wdXBfd3JhcHBlciA9ICAkKCAnIycgKyBpZCArICdfd3JhcHBlcicpO1xuXG5cdFx0XHRcdGlmICghIHBvcHVwX3dyYXBwZXIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0YWJzb2x1dGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29sb3I6ICcjMzMzJyxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb246ICdhbGwgMC4zcycsXG5cdFx0XHRcdFx0XHRob3Jpem9udGFsOiBlbGVtLmRhdGEoICdob3Jpem9udGFsJyApLFxuXHRcdFx0XHRcdFx0dmVydGljYWw6IGVsZW0uZGF0YSggJ3ZlcnRpY2FsJyApXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRlbGVtLnBvcHVwKCBkZWZhdWx0T3B0aW9ucyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQoJyN3bGZtYy10b29sdGlwJylcblx0XHRcdFx0XHQuY3NzKHtcblx0XHRcdFx0XHRcdCd0b3AnOiAnMCcsXG5cdFx0XHRcdFx0XHQnbGVmdCc6ICcwJ1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ3Rvb2x0aXBfX2hpZGRlbicpO1xuXHRcdFx0XHQkKCAnIycgKyBpZCApLnBvcHVwKCAnc2hvdycgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCk7XG5cdFx0JCggJ2JvZHknICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1wb3B1cC1jbG9zZScsXG5cdFx0XHRmdW5jdGlvbihldikge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaWQgPSAkKCB0aGlzICkuZGF0YSggJ3BvcHVwLWlkJyApO1xuXHRcdFx0XHQkKCAnIycgKyBpZCApLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0fSxcblxuXHRpbml0X2xheW91dDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBqcXhocixcblx0XHRcdHRpbWVvdXQ7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLXRvZ2dsZS1sYXlvdXQnLFxuXHRcdFx0ZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIGVsZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdGVsZW0udG9nZ2xlQ2xhc3MoICdsaXN0JyApLnRvZ2dsZUNsYXNzKCAnZ3JpZCcgKTtcblx0XHRcdFx0ZWxlbS5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJy53bGZtYy1saXN0JyApLnRvZ2dsZUNsYXNzKCAndmlldy1tb2RlLWxpc3QnICkudG9nZ2xlQ2xhc3MoICd2aWV3LW1vZGUtZ3JpZCcgKTtcblxuXHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVvdXQgKTtcblxuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZiAoanF4aHIpIHtcblx0XHRcdFx0XHRcdFx0anF4aHIuYWJvcnQoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0anF4aHIgPSAkLmFqYXgoXG5cdFx0XHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5jaGFuZ2VfbGF5b3V0LFxuXHRcdFx0XHRcdFx0XHRcdFx0bm9uY2U6IGVsZW0uZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdG5ld19sYXlvdXQ6IGVsZW0uaGFzQ2xhc3MoICdsaXN0JyApID8gJ2dyaWQnIDogJ2xpc3QnLFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBhbnl0aGluZy5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQxMDAwXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfY29tcG9uZW50czogZnVuY3Rpb24gKCkge1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1saXN0IC5wcm9kdWN0LWNvbXBvbmVudHMnLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgJHRoaXMgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgZWxlbSAgICAgICAgID0gJHRoaXMuY2xvc2VzdCggJ3RyJyApO1xuXHRcdFx0XHR2YXIgJG1ldGFEYXRhICAgID0gZWxlbS5maW5kKCAnLndsZm1jLWFic29sdXRlLW1ldGEtZGF0YScgKTtcblx0XHRcdFx0dmFyICRuZXh0ICAgICAgICA9IGVsZW0ubmV4dCggJy53bGZtYy1yb3ctbWV0YS1kYXRhJyApLmZpbHRlciggJy53bGZtYy1yb3ctbWV0YS1kYXRhJyApO1xuXHRcdFx0XHR2YXIgaXNOZXh0SGlkZGVuID0gJG5leHQuaGFzQ2xhc3MoICdoaWRlJyApO1xuXG5cdFx0XHRcdCRtZXRhRGF0YS5mYWRlVG9nZ2xlKCk7XG5cdFx0XHRcdCRuZXh0LnRvZ2dsZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0ZWxlbS50b2dnbGVDbGFzcyggJ3Nob3ctbWV0YS1kYXRhJywgaXNOZXh0SGlkZGVuICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLWxpc3QgLmNsb3NlLWNvbXBvbmVudHMnLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgZWxlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAndHInICk7XG5cdFx0XHRcdGVsZW0uZmluZCggJy53bGZtYy1hYnNvbHV0ZS1tZXRhLWRhdGEnICkuZmFkZVRvZ2dsZSgpO1xuXHRcdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCAnc2hvdy1tZXRhLWRhdGEnICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLm9uKCdjaGFuZ2UnLCAnLmxpc3QtaXRlbS1jaGVja2JveCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR2YXIgc2VsZWN0ZWRJdGVtID0gJCh0aGlzKS5jbG9zZXN0KCcubGlzdC1pdGVtJyk7XG5cdFx0XHR2YXIgcGFyZW50Q29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtYWRkLXRvLWxpc3QtY29udGFpbmVyLCAud2xmbWMtbW92ZS10by1saXN0LXdyYXBwZXIsIC53bGZtYy1jb3B5LXRvLWxpc3Qtd3JhcHBlcicpO1xuXHRcdFx0aWYgKHBhcmVudENvbnRhaW5lci5oYXNDbGFzcygnd2xmbWMtYWRkLXRvLWxpc3QtY29udGFpbmVyJykpIHtcblx0XHRcdFx0aWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcblx0XHRcdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWRJdGVtLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocGFyZW50Q29udGFpbmVyLmhhc0NsYXNzKCd3bGZtYy1tb3ZlLXRvLWxpc3Qtd3JhcHBlcicpIHx8IHBhcmVudENvbnRhaW5lci5oYXNDbGFzcygnd2xmbWMtY29weS10by1saXN0LXdyYXBwZXInKSkge1xuXHRcdFx0XHR2YXIgY2hlY2tib3hlcyA9IHBhcmVudENvbnRhaW5lci5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblx0XHRcdFx0cGFyZW50Q29udGFpbmVyLmZpbmQoJy5saXN0LWl0ZW0nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0aWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcblx0XHRcdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdFx0Y2hlY2tib3hlcy5ub3QoJCh0aGlzKSkucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGluaXRfZHJvcGRvd25fbGlzdHM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZHJvcGRvd25FbGVtZW50ID0gJCgnI3dsZm1jX215X2xpc3RzJyk7XG5cdFx0aWYgKCFkcm9wZG93bkVsZW1lbnQgfHwgZHJvcGRvd25FbGVtZW50Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoZHJvcGRvd25FbGVtZW50LmRhdGEoJ2VkaXRhYmxlLXNlbGVjdCcpKSB7XG5cdFx0XHRkcm9wZG93bkVsZW1lbnQud2xmbWNEcm9wRG93bignZGVzdHJveScpO1xuXHRcdH1cblx0XHRkcm9wZG93bkVsZW1lbnRcblx0XHRcdC5vbignc2VsZWN0LmVkaXRhYmxlLXNlbGVjdCcsIGZ1bmN0aW9uIChlLCBsaSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIChsaSkgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdCgnLndsZm1jLWRyb3Bkb3duLXdyYXBwZXInKS5hZGRDbGFzcygnd2xmbWMtYWN0aW9uIHdsZm1jLWxvYWRpbmctYWx0IHdsZm1jLWludmVyc2UnKTtcblx0XHRcdFx0XHQkKHRoaXMpLnZhbCggJCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtZHJvcGRvd24td3JhcHBlcicpLmZpbmQoJy5saXN0LWl0ZW1bZGF0YS13aXNobGlzdC1pZD1cIicgKyBsaS52YWwoKSArICdcIl0gLmxpc3QtbmFtZScpLnRleHQoKSApO1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtZHJvcGRvd24td3JhcHBlcicpLmZpbmQoJy5saXN0LWl0ZW1bZGF0YS13aXNobGlzdC1pZD1cIicgKyBsaS52YWwoKSArICdcIl0nKS5kYXRhKCd1cmwnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC53bGZtY0Ryb3BEb3duKHtcblx0XHRcdFx0ZWZmZWN0czogJ3NsaWRlJyxcblx0XHRcdH0pO1xuXG5cdH0sXG5cblx0LyoqXG5cdCAqIEluaXQgaGFuZGxpbmcgZm9yIGNvcHkgYnV0dG9uXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF9jb3B5X3dpc2hsaXN0X2xpbms6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcuY29weS1saW5rLXRyaWdnZXInLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgb2JqX3RvX2NvcHkgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0dmFyIGhpZGRlbiA9ICQoXG5cdFx0XHRcdFx0JzxpbnB1dC8+Jyxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2YWw6IG9ial90b19jb3B5LmF0dHIoICdkYXRhLWhyZWYnICksXG5cdFx0XHRcdFx0XHR0eXBlOiAndGV4dCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0JCggJ2JvZHknICkuYXBwZW5kKCBoaWRkZW4gKTtcblxuXHRcdFx0XHRpZiAoJC5mbi5XTEZNQy5pc09TKCkpIHtcblx0XHRcdFx0XHRoaWRkZW5bMF0uc2V0U2VsZWN0aW9uUmFuZ2UoIDAsIDk5OTkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRoaWRkZW4uc2VsZWN0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoICdjb3B5JyApO1xuXG5cdFx0XHRcdGhpZGRlbi5yZW1vdmUoKTtcblxuXHRcdFx0XHR0b2FzdHIuc3VjY2Vzcyggd2xmbWNfbDEwbi5sYWJlbHMubGlua19jb3BpZWQgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICogUmV0cmlldmUgZnJhZ21lbnRzIHRoYXQgbmVlZCB0byBiZSByZWZyZXNoZWQgaW4gdGhlIHBhZ2Vcblx0ICpcblx0ICogQHBhcmFtIHNlYXJjaCBzdHJpbmcgUmVmIHRvIHNlYXJjaCBhbW9uZyBhbGwgZnJhZ21lbnRzIGluIHRoZSBwYWdlXG5cdCAqIEByZXR1cm4gb2JqZWN0IE9iamVjdCBjb250YWluaW5nIGEgcHJvcGVydHkgZm9yIGVhY2ggZnJhZ21lbnQgdGhhdCBtYXRjaGVzIHNlYXJjaFxuXHQgKi9cblx0cmV0cmlldmVfZnJhZ21lbnRzOiBmdW5jdGlvbiAoc2VhcmNoKSB7XG5cdFx0dmFyIG9wdGlvbnMgICA9IHt9LFxuXHRcdFx0ZnJhZ21lbnRzID0gbnVsbDtcblxuXHRcdGlmIChzZWFyY2gpIHtcblx0XHRcdGlmICh0eXBlb2Ygc2VhcmNoID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRzZWFyY2ggPSAkLmV4dGVuZChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmcmFnbWVudHM6IG51bGwsXG5cdFx0XHRcdFx0XHRzOiAnJyxcblx0XHRcdFx0XHRcdGNvbnRhaW5lcjogJCggZG9jdW1lbnQgKSxcblx0XHRcdFx0XHRcdGZpcnN0TG9hZDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNlYXJjaFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICggISBzZWFyY2guZnJhZ21lbnRzKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gc2VhcmNoLmNvbnRhaW5lci5maW5kKCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IHNlYXJjaC5mcmFnbWVudHM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc2VhcmNoLnMpIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBmcmFnbWVudHMubm90KCAnW2RhdGEtZnJhZ21lbnQtcmVmXScgKS5hZGQoIGZyYWdtZW50cy5maWx0ZXIoICdbZGF0YS1mcmFnbWVudC1yZWY9XCInICsgc2VhcmNoLnMgKyAnXCJdJyApICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc2VhcmNoLmZpcnN0TG9hZCkge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IGZyYWdtZW50cy5maWx0ZXIoICcub24tZmlyc3QtbG9hZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnJhZ21lbnRzID0gJCggJy53bGZtYy13aXNobGlzdC1mcmFnbWVudCcgKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIHNlYXJjaCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHNlYXJjaCA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBmcmFnbWVudHMubm90KCAnW2RhdGEtZnJhZ21lbnQtcmVmXScgKS5hZGQoIGZyYWdtZW50cy5maWx0ZXIoICdbZGF0YS1mcmFnbWVudC1yZWY9XCInICsgc2VhcmNoICsgJ1wiXScgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZyYWdtZW50cyA9ICQoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICk7XG5cdFx0fVxuXG5cdFx0aWYgKGZyYWdtZW50cy5sZW5ndGgpIHtcblx0XHRcdGZyYWdtZW50cy5lYWNoKFxuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHQgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdFx0aWQgPSB0LmF0dHIoICdjbGFzcycgKS5zcGxpdCggJyAnICkuZmlsdGVyKFxuXHRcdFx0XHRcdFx0XHQodmFsKSA9PiB7cmV0dXJuIHZhbC5sZW5ndGggJiYgdmFsICE9PSAnZXhpc3RzJzt9XG5cdFx0XHRcdFx0XHQpLmpvaW4oIHdsZm1jX2wxMG4uZnJhZ21lbnRzX2luZGV4X2dsdWUgKTtcblxuXHRcdFx0XHRcdG9wdGlvbnNbaWRdID0gdC5kYXRhKCAnZnJhZ21lbnQtb3B0aW9ucycgKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9wdGlvbnM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgZnJhZ21lbnRzIG9uIHBhZ2UgbG9hZGluZ1xuXHQgKlxuXHQgKiBAcGFyYW0gc2VhcmNoIHN0cmluZyBSZWYgdG8gc2VhcmNoIGFtb25nIGFsbCBmcmFnbWVudHMgaW4gdGhlIHBhZ2Vcblx0ICogQHBhcmFtIHN1Y2Nlc3MgZnVuY3Rpb25cblx0ICogQHBhcmFtIHN1Y2Nlc3NBcmdzIGFycmF5XG5cdCAqL1xuXHRsb2FkX2ZyYWdtZW50czogZnVuY3Rpb24gKHNlYXJjaCwgc3VjY2Vzcywgc3VjY2Vzc0FyZ3MpIHtcblxuXHRcdGNsZWFyVGltZW91dCggZnJhZ21lbnR0aW1lb3V0ICk7XG5cblx0XHRmcmFnbWVudHRpbWVvdXQgPSBzZXRUaW1lb3V0KFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoIGZyYWdtZW50eGhyICkge1xuXHRcdFx0XHRcdGZyYWdtZW50eGhyLmFib3J0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VhcmNoID0gJC5leHRlbmQoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Zmlyc3RMb2FkOiB0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZWFyY2hcblx0XHRcdFx0KTtcblxuXHRcdFx0XHR2YXIgZnJhZ21lbnRzID0gJC5mbi5XTEZNQy5yZXRyaWV2ZV9mcmFnbWVudHMoIHNlYXJjaCApO1xuXHRcdFx0XHQvLyBjcmVhdGUgYSBuZXcgRm9ybURhdGEgb2JqZWN0LlxuXHRcdFx0XHR2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCAnYWN0aW9uJywgd2xmbWNfbDEwbi5hY3Rpb25zLmxvYWRfZnJhZ21lbnRzICk7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCggJ2NvbnRleHQnLCAnZnJvbnRlbmQnICk7XG5cdFx0XHRcdGlmICggZnJhZ21lbnRzKSB7XG5cdFx0XHRcdFx0Ly8gY29udmVydCBvYmplY3QgdG8gSlNPTiBzdHJpbmcuXG5cdFx0XHRcdFx0dmFyIGZyYWdtZW50SnNvbiA9IEpTT04uc3RyaW5naWZ5KCBmcmFnbWVudHMgKTtcblx0XHRcdFx0XHQvLyBjcmVhdGUgYSBmaWxlIGZyb20gSlNPTiBzdHJpbmcuXG5cdFx0XHRcdFx0dmFyIGZpbGUgPSBuZXcgRmlsZSggW2ZyYWdtZW50SnNvbl0sICdmcmFnbWVudC5qc29uJyApO1xuXHRcdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCggJ2ZyYWdtZW50c19maWxlJywgZmlsZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnJhZ21lbnR4aHIgPSAkLmFqYXgoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCwgLy9hamF4X3VybCxcblx0XHRcdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxuXHRcdFx0XHRcdFx0LypiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwqL1xuXHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN1Y2Nlc3MuYXBwbHkobnVsbCwgc3VjY2Vzc0FyZ3MpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vICQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dsZm1jX2ZyYWdtZW50c19sb2FkZWQnLCBbZnJhZ21lbnRzLCBkYXRhLmZyYWdtZW50cywgc2VhcmNoLmZpcnN0TG9hZF0gKTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0JCggJyN3bGZtYy1saXN0cywjd2xmbWMtd2lzaGxpc3QtZm9ybScgKS5hZGRDbGFzcyggJ29uLWZpcnN0LWxvYWQnICk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgZGF0YS5wcm9kdWN0cyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIGRhdGEucHJvZHVjdHMgKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGRhdGEud2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3dhaXRsaXN0X2hhc2goIEpTT04uc3RyaW5naWZ5KCBkYXRhLndhaXRsaXN0ICkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBkYXRhLmxhbmcgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X2xhbmdfaGFzaCggZGF0YS5sYW5nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0MTAwXG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICogUmVwbGFjZSBmcmFnbWVudHMgd2l0aCB0ZW1wbGF0ZSByZWNlaXZlZFxuXHQgKlxuXHQgKiBAcGFyYW0gZnJhZ21lbnRzIGFycmF5IEFycmF5IG9mIGZyYWdtZW50cyB0byByZXBsYWNlXG5cdCAqL1xuXHRyZXBsYWNlX2ZyYWdtZW50czogZnVuY3Rpb24gKGZyYWdtZW50cykge1xuXHRcdCQuZWFjaChcblx0XHRcdGZyYWdtZW50cyxcblx0XHRcdGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdHZhciBpdGVtU2VsZWN0b3IgPSAnLicgKyBpLnNwbGl0KCB3bGZtY19sMTBuLmZyYWdtZW50c19pbmRleF9nbHVlICkuZmlsdGVyKFxuXHRcdFx0XHRcdFx0KHZhbCkgPT4ge3JldHVybiB2YWwubGVuZ3RoICYmIHZhbCAhPT0gJ2V4aXN0cycgJiYgdmFsICE9PSAnd2l0aC1jb3VudCc7fVxuXHRcdFx0XHRcdCkuam9pbiggJy4nICksXG5cdFx0XHRcdFx0dG9SZXBsYWNlICAgID0gJCggaXRlbVNlbGVjdG9yICk7XG5cdFx0XHRcdC8vIGZpbmQgcmVwbGFjZSB0ZW1wbGF0ZS5cblx0XHRcdFx0dmFyIHJlcGxhY2VXaXRoID0gJCggdiApLmZpbHRlciggaXRlbVNlbGVjdG9yICk7XG5cblx0XHRcdFx0aWYgKCAhIHJlcGxhY2VXaXRoLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJlcGxhY2VXaXRoID0gJCggdiApLmZpbmQoIGl0ZW1TZWxlY3RvciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRvUmVwbGFjZS5sZW5ndGggJiYgcmVwbGFjZVdpdGgubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dG9SZXBsYWNlLnJlcGxhY2VXaXRoKCByZXBsYWNlV2l0aCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHQvKiA9PT0gRVZFTlQgSEFORExJTkcgPT09ICovXG5cblx0bG9hZF9hdXRvbWF0aW9uczogZnVuY3Rpb24gKHByb2R1Y3RfaWQsIHdpc2hsaXN0X2lkLCBjdXN0b21lcl9pZCwgbGlzdF90eXBlLCBub25jZSkge1xuXHRcdCQuYWpheChcblx0XHRcdHtcblxuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5sb2FkX2F1dG9tYXRpb25zLFxuXHRcdFx0XHRcdG5vbmNlOiBub25jZSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHBhcnNlSW50KCBwcm9kdWN0X2lkICksXG5cdFx0XHRcdFx0d2lzaGxpc3RfaWQ6IHBhcnNlSW50KCB3aXNobGlzdF9pZCApLFxuXHRcdFx0XHRcdGN1c3RvbWVyX2lkOiBwYXJzZUludCggY3VzdG9tZXJfaWQgKSxcblx0XHRcdFx0XHRsaXN0X3R5cGU6IGxpc3RfdHlwZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gYW55dGhpbmcuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGFkZF90b19zYXZlX2Zvcl9sYXRlcjogZnVuY3Rpb24gKCBjYXJ0X2l0ZW1fa2V5ICwgZWxlbSApe1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3RvX3NhdmVfZm9yX2xhdGVyX2FjdGlvbixcblx0XHRcdG5vbmNlOiB3bGZtY19sMTBuLmFqYXhfbm9uY2UuYWRkX3RvX3NhdmVfZm9yX2xhdGVyX25vbmNlLFxuXHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdGFkZF90b19zYXZlX2Zvcl9sYXRlcjogY2FydF9pdGVtX2tleSxcblx0XHRcdG1lcmdlX3NhdmVfZm9yX2xhdGVyOiB3bGZtY19sMTBuLm1lcmdlX3NhdmVfZm9yX2xhdGVyLFxuXHRcdFx0cmVtb3ZlX2Zyb21fY2FydF9pdGVtOiB3bGZtY19sMTBuLnJlbW92ZV9mcm9tX2NhcnRfaXRlbSxcblx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoKVxuXHRcdH07XG5cblx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc19jb29raWVfZW5hYmxlZCgpICkge1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5zYXZlX2Zvcl9sYXRlcl9hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHQvL2RhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGNhY2hlOiBmYWxzZSxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gYmVmb3JlU2VuZCh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ubGVuZ3RoICkge1xuXG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuXHRcdFx0XHRcdGlmICggZWxlbSAmJiBlbGVtLmxlbmd0aCApIHtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmICggJ3RydWUnID09PSByZXNwb25zZV9yZXN1bHQgKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHQvKmlmICh0eXBlb2YgcmVzcG9uc2UuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggcmVzcG9uc2UuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggd2xmbWNfbDEwbi5sYWJlbHMuc2ZsX3Byb2R1Y3RfYWRkZWRfdGV4dCApKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5zZmxfcHJvZHVjdF9hZGRlZF90ZXh0ICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YXIgYXV0b21hdGlvbl9saXN0X3R5cGUgPSB3bGZtY19sMTBuLm1lcmdlX3NhdmVfZm9yX2xhdGVyID8gKCB3bGZtY19sMTBuLm1lcmdlX2xpc3RzID8gJ2xpc3RzJyA6ICd3aXNobGlzdCcgKSA6ICdzYXZlLWZvci1sYXRlcic7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfYXV0b21hdGlvbnMoIHJlc3BvbnNlLnByb2R1Y3RfaWQsIHJlc3BvbnNlLndpc2hsaXN0X2lkLCByZXNwb25zZS5jdXN0b21lcl9pZCwgYXV0b21hdGlvbl9saXN0X3R5cGUsIHJlc3BvbnNlLmxvYWRfYXV0b21hdGlvbl9ub25jZSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmNvdW50ICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy10YWJzLXdyYXBwZXInICkuYXR0ciggJ2RhdGEtY291bnQnLCByZXNwb25zZS5jb3VudCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICd3Y191cGRhdGVfY2FydCcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZS5tZXNzYWdlICkgJiYgcmVzcG9uc2VfcmVzdWx0ICE9PSAndHJ1ZScpIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRjaGVja193YWl0bGlzdF9tb2R1bGVzOiBmdW5jdGlvbiAoIGRhdGEsIHByb2R1Y3RfaWQsIHZhcmlhdGlvbl9pZCApIHtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHZhcmlhdGlvbl9pZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dmFyIHByb2R1Y3RfdHlwZSA9ICd2YXJpYXRpb24nO1xuXHRcdGlmICggISBkYXRhICkge1xuXHRcdFx0dmFyaWF0aW9uX2lkID0gcHJvZHVjdF9pZDtcblx0XHRcdHByb2R1Y3RfdHlwZSA9ICd2YXJpYWJsZSc7XG5cdFx0fVxuXHRcdGxldCB0YXJnZXRzICAgICAgPSAkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdCBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKSxcblx0XHRcdHRhcmdldF9ib3hlcyA9ICQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2sgW2RhdGEtcGFyZW50LXByb2R1Y3QtaWQ9XCInICsgcHJvZHVjdF9pZCArICdcIl0nICk7XG5cblx0XHR0YXJnZXRfYm94ZXMuZWFjaChcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZXQgdCAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jaycgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cdFx0XHRcdGNvbnRhaW5lclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIChpLCBjbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hdGNoKCAvd2xmbWMtYWRkLXRvLW91dG9mc3RvY2stXFxTKy9nICkuam9pbiggJyAnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ3dsZm1jLWFkZC10by1vdXRvZnN0b2NrLScgKyB2YXJpYXRpb25faWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0XHRsZXQgb3V0b2ZzdG9ja2JveCA9ICQoJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jay0nICsgdmFyaWF0aW9uX2lkKTtcblxuXHRcdFx0XHRpZiAob3V0b2ZzdG9ja2JveC5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRvdXRvZnN0b2NrYm94ID0gJCgnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrLScgKyBwcm9kdWN0X2lkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIG51bGwgIT09IGRhdGEgKSB7XG5cdFx0XHRcdFx0aWYgKGRhdGEud2xmbWNfaGlkZV9iYWNrX2luX3N0b2NrIHx8ICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLmV4Y2x1ZGVfYmFja19pbl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0b3V0b2ZzdG9ja2JveC5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG91dG9mc3RvY2tib3gucmVtb3ZlQ2xhc3MoICdoaWRlJyApOyAvLyBzaG93IG91dG9mc3RvY2sgYm94LlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsZXQgb3V0X29mX3N0b2NrID0gb3V0b2ZzdG9ja2JveC5kYXRhKCAncHJvZHVjdC1vdXRvZnN0b2NrJyApO1xuXHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIG91dF9vZl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0b3V0b2ZzdG9ja2JveC5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG91dG9mc3RvY2tib3guYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHYgIT09ICd1bmRlZmluZWQnICYmIHYucHJvZHVjdF9pZCAmJiB2LnByb2R1Y3RfaWQgPT09IHZhcmlhdGlvbl9pZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgb3V0b2ZzdG9ja2JveCA9ICQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHYucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdFx0XHRvdXRvZnN0b2NrYm94LnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHRvdXRvZnN0b2NrYm94LmVhY2goXG5cdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB2LmJhY2tfaW5fc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdFx0b3V0b2ZzdG9ja2JveC5maW5kKCAnLndsZm1jLWFkZC1idXR0b24gPiBhJyApLmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApLmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnLCBwcm9kdWN0X3R5cGUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dGFyZ2V0cy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdCAgICAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0Y29udGFpbmVyICAgICAgICAgICAgPSB0LmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0JyApLFxuXHRcdFx0XHRcdHBvcHVwICAgICAgICAgICAgICAgID0gJCggJyMnICsgdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13YWl0bGlzdCcgKS5kYXRhKCAncG9wdXAtaWQnICkgKSxcblx0XHRcdFx0XHRiYWNraW5zdG9ja19jaGVja2JveCA9IHBvcHVwLmxlbmd0aCA/IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9iYWNrLWluLXN0b2NrXCJdJyApIDogZmFsc2UgLFxuXHRcdFx0XHRcdHByaWNlY2hhbmdlX2NoZWNrYm94ID0gcG9wdXAubGVuZ3RoID8gcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X3ByaWNlLWNoYW5nZVwiXScgKSA6IGZhbHNlICxcblx0XHRcdFx0XHRsb3dzdG9ja19jaGVja2JveCAgICA9IHBvcHVwLmxlbmd0aCA/IHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9sb3ctc3RvY2tcIl0nICkgOiBmYWxzZSAsXG5cdFx0XHRcdFx0b25zYWxlX2NoZWNrYm94ICAgICAgPSBwb3B1cC5sZW5ndGggPyBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3Rfb24tc2FsZVwiXScgKSA6IGZhbHNlLFxuXHRcdFx0XHRcdGF2YWlsYWJsZV9tb2R1bGVzICAgID0gY29udGFpbmVyLmRhdGEoICdhdmFpbGFibGUtbGlzdHMnICk7XG5cblx0XHRcdFx0Y29udGFpbmVyLnJlbW92ZUNsYXNzKCAnb3BhY2l0eS1oYWxmJyApO1xuXHRcdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdFx0aWYgKCBkYXRhLmlzX2luX3N0b2NrICkge1xuXHRcdFx0XHRcdFx0aWYgKCBsb3dzdG9ja19jaGVja2JveC5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGRhdGEuZW5hYmxlX2xvd19zdG9jayAmJiAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5lbmFibGVfbG93X3N0b2NrICkgJiYgISAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5leGNsdWRlX2xvd19zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdGxvd3N0b2NrX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRsb3dzdG9ja19jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggcHJpY2VjaGFuZ2VfY2hlY2tib3gubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5leGNsdWRlX3ByaWNlX2NoYW5nZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHByaWNlY2hhbmdlX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwcmljZWNoYW5nZV9jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggYmFja2luc3RvY2tfY2hlY2tib3gubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBkYXRhLndsZm1jX2hpZGVfYmFja19pbl9zdG9jayApIHtcblx0XHRcdFx0XHRcdFx0XHRiYWNraW5zdG9ja19jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0YmFja2luc3RvY2tfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggb25zYWxlX2NoZWNrYm94Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggZGF0YS5kaXNwbGF5X3ByaWNlICE9PSBkYXRhLmRpc3BsYXlfcmVndWxhcl9wcmljZSB8fCAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5leGNsdWRlX29uX3NhbGUgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRvbnNhbGVfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG9uc2FsZV9jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gaGlkZSBhZGQgdG8gd2FpdGxpc3QgYnV0dG9ucyBpZiBub3QgYWN0aXZlIG1vZHVsZXMgaW4gcG9wdXAuXG5cdFx0XHRcdFx0XHRpZiAoICEgcG9wdXAuZmluZCggJy53bGZtYy13YWl0bGlzdC1zZWxlY3QtdHlwZSAubGlzdC1pdGVtOm5vdCguaGlkZSknICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoICdvcGFjaXR5LWhhbGYnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIGF2YWlsYWJsZV9tb2R1bGVzID09PSBcIm9iamVjdFwiICYmICdiYWNrLWluLXN0b2NrJyBpbiBhdmFpbGFibGVfbW9kdWxlcyAmJiAhICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLmV4Y2x1ZGVfYmFja19pbl9zdG9jayApICkge1xuXHRcdFx0XHRcdFx0aWYgKCBiYWNraW5zdG9ja19jaGVja2JveC5sZW5ndGggPiAwICApIHtcblx0XHRcdFx0XHRcdFx0YmFja2luc3RvY2tfY2hlY2tib3guY2xvc2VzdCggJy5saXN0LWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBwcmljZWNoYW5nZV9jaGVja2JveC5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHRwcmljZWNoYW5nZV9jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIGxvd3N0b2NrX2NoZWNrYm94Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGxvd3N0b2NrX2NoZWNrYm94LmNsb3Nlc3QoICcubGlzdC1pdGVtJyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggb25zYWxlX2NoZWNrYm94Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRcdG9uc2FsZV9jaGVja2JveC5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcyggJ29wYWNpdHktaGFsZicgKTsgLy8gaGlkZSBhZGQgdG8gd2FpdGxpc3QgYnV0dG9ucy5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9iYWNrLWluLXN0b2NrXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X3ByaWNlLWNoYW5nZVwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9vbi1zYWxlXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2xvdy1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Y29udGFpbmVyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKGksIGNsYXNzZXMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWF0Y2goIC93bGZtYy1hZGQtdG8td2FpdGxpc3QtXFxTKy9nICkuam9pbiggJyAnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ3dsZm1jLWFkZC10by13YWl0bGlzdC0nICsgdmFyaWF0aW9uX2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHYgIT09ICd1bmRlZmluZWQnICYmIHYucHJvZHVjdF9pZCAmJiB2LnByb2R1Y3RfaWQgPT0gdmFyaWF0aW9uX2lkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHYucHJpY2VfY2hhbmdlICkgfHwgJC5mbi5XTEZNQy5pc1RydWUoIHYub25fc2FsZSApIHx8ICQuZm4uV0xGTUMuaXNUcnVlKCB2Lmxvd19zdG9jayApIHx8ICggJC5mbi5XTEZNQy5pc1RydWUoIHYuYmFja19pbl9zdG9jayApICYmIHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9iYWNrLWluLXN0b2NrXCJdJyApLmxlbmd0aCA+IDAgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5iYWNrX2luX3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2JhY2staW4tc3RvY2tcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggdi5wcmljZV9jaGFuZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpY2UtY2hhbmdlXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHYub25fc2FsZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9vbi1zYWxlXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHYubG93X3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2xvdy1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWNfYWRkX3RvX3dhaXRsaXN0JyApLmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApLmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCB2YXJpYXRpb25faWQgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnLCBwcm9kdWN0X3R5cGUgKTtcblx0XHRcdFx0aWYgKCAndmFyaWFibGUnID09PSBwcm9kdWN0X3R5cGUgJiYgJC5mbi5XTEZNQy5pc1RydWUoIHdsZm1jX2wxMG4ud2FpdGxpc3RfcmVxdWlyZWRfcHJvZHVjdF92YXJpYXRpb24gKSApIHtcblx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1wb3B1cC10cmlnZ2VyJyApLmFkZENsYXNzKCAnd2xmbWMtZGlzYWJsZWQnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcicgKS5yZW1vdmVDbGFzcyggJ3dsZm1jLWRpc2FibGVkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRjaGVja19wcm9kdWN0czogZnVuY3Rpb24gKHByb2R1Y3RzKXtcblx0XHRpZiAoIG51bGwgIT09IHByb2R1Y3RzICkge1xuXHRcdFx0cHJvZHVjdF9pbl9saXN0ICAgPSBbXTtcblx0XHRcdHZhciBjb3VudGVyX2l0ZW1zID0gJCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXIgLndsZm1jLWNvdW50ZXItaXRlbScgKTtcblx0XHRcdGlmICggY291bnRlcl9pdGVtcy5sZW5ndGggJiYgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCApIHtcblx0XHRcdFx0Y291bnRlcl9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIHBfaWQgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtcm93LWlkJyApO1xuXHRcdFx0XHRcdFx0aWYgKCAhICQuZ3JlcCggcHJvZHVjdF9pbl9saXN0LCBmdW5jdGlvbiggaXRlbSApeyByZXR1cm4gaXRlbS5wcm9kdWN0X2lkID09PSBwX2lkOyB9ICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIHBfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHZhciB0YWJsZV9pdGVtc1x0PSAkKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0gLndsZm1jLXRhYmxlLWl0ZW0nICk7XG5cdFx0XHRpZiAoIHRhYmxlX2l0ZW1zLmxlbmd0aCAmJiBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICkge1xuXHRcdFx0XHR0YWJsZV9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIHBfaWQgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtcm93LWlkJyApO1xuXHRcdFx0XHRcdFx0aWYgKCAhICQuZ3JlcCggcHJvZHVjdF9pbl9saXN0LCBmdW5jdGlvbiggaXRlbSApeyByZXR1cm4gaXRlbS5wcm9kdWN0X2lkID09PSBwX2lkOyB9ICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBwX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHQkKCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRwcm9kdWN0cyxcblx0XHRcdFx0ZnVuY3Rpb24gKCBpZCwgaXRlbURhdGEgKSB7XG5cdFx0XHRcdFx0dmFyIHNhbWVfcHJvZHVjdHMgPSAkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC0nICsgaXRlbURhdGEucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdHNhbWVfcHJvZHVjdHMuZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdCQoIHRoaXMgKS5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLWl0ZW0taWQnLCBpdGVtRGF0YS5pdGVtX2lkICk7XG5cdFx0XHRcdFx0XHRcdCQoIHRoaXMgKS5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJywgaXRlbURhdGEud2lzaGxpc3RfaWQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyICAucHJvZHVjdHMtY291bnRlci1udW1iZXInICkudGV4dCggaXRlbURhdGEubGVuZ3RoICk7XG5cdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdpc2hsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggaXRlbURhdGEubGVuZ3RoICk7XG5cblx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QucHVzaCggaXRlbURhdGEgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblxuXHRjaGVja193YWl0bGlzdF9wcm9kdWN0czogZnVuY3Rpb24gKHByb2R1Y3RzKXtcblx0XHRpZiAoIG51bGwgIT09IHByb2R1Y3RzICkge1xuXHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdCA9IFtdO1xuXHRcdFx0dmFyIGNvdW50ZXJfaXRlbXMgICA9ICQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyIC53bGZtYy1jb3VudGVyLWl0ZW0nICk7XG5cdFx0XHRpZiAoIGNvdW50ZXJfaXRlbXMubGVuZ3RoICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICkge1xuXHRcdFx0XHRjb3VudGVyX2l0ZW1zLmVhY2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgcF9pZCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1yb3ctaWQnICk7XG5cdFx0XHRcdFx0XHRpZiAoICEgJC5ncmVwKCBwcm9kdWN0X2luX3dhaXRsaXN0LCBmdW5jdGlvbiggaXRlbSApeyByZXR1cm4gaXRlbS5wcm9kdWN0X2lkID09PSBwX2lkOyB9ICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIHBfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHZhciB0YWJsZV9pdGVtc1x0PSAkKCAnLndsZm1jLXdhaXRsaXN0LXRhYmxlIC53bGZtYy10YWJsZS1pdGVtJyApO1xuXHRcdFx0aWYgKCB0YWJsZV9pdGVtcy5sZW5ndGggJiYgcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGggKSB7XG5cdFx0XHRcdHRhYmxlX2l0ZW1zLmVhY2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgcF9pZCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1yb3ctaWQnICk7XG5cdFx0XHRcdFx0XHRpZiAoICEgJC5ncmVwKCBwcm9kdWN0X2luX3dhaXRsaXN0LCBmdW5jdGlvbiggaXRlbSApeyByZXR1cm4gaXRlbS5wcm9kdWN0X2lkID09PSBwX2lkOyB9ICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LXRhYmxlJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgcF9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0JCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jaycgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0JyApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRwcm9kdWN0cyxcblx0XHRcdFx0ZnVuY3Rpb24gKCBpZCwgaXRlbURhdGEgKSB7XG5cdFx0XHRcdFx0dmFyIHNhbWVfcHJvZHVjdHMgPSAkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdC0nICsgaXRlbURhdGEucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdHNhbWVfcHJvZHVjdHMuZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgcG9wdXAgPSAkKCAnIycgKyAkKCB0aGlzICkuZGF0YSggJ3BvcHVwLWlkJyApICk7XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLnByaWNlX2NoYW5nZSApIHx8ICQuZm4uV0xGTUMuaXNUcnVlKCBpdGVtRGF0YS5vbl9zYWxlICkgfHwgJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmxvd19zdG9jayApIHx8ICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmJhY2tfaW5fc3RvY2sgKSAmJiBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5sZW5ndGggPiAwICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmJhY2tfaW5fc3RvY2sgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfYmFjay1pbi1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBpdGVtRGF0YS5wcmljZV9jaGFuZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpY2UtY2hhbmdlXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcmljZS1jaGFuZ2VcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggaXRlbURhdGEub25fc2FsZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9vbi1zYWxlXCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9vbi1zYWxlXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGl0ZW1EYXRhLmxvd19zdG9jayApICkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9sb3ctc3RvY2tcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X2xvdy1zdG9ja1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHZhciBvdXRvZnN0b2NrYm94ID0gJCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jay0nICsgaXRlbURhdGEucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdG91dG9mc3RvY2tib3guZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBpdGVtRGF0YS5iYWNrX2luX3N0b2NrICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13YWl0bGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdC5wdXNoKCBpdGVtRGF0YSApO1xuXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9LFxuXHQvKiogU2V0IHRoZSB3aXNobGlzdCBoYXNoIGluIGJvdGggc2Vzc2lvbiBhbmQgbG9jYWwgc3RvcmFnZSAqL1xuXHRzZXRfcHJvZHVjdHNfaGFzaDogZnVuY3Rpb24gKCAgcHJvZHVjdHMgKSB7XG5cdFx0aWYgKCAkc3VwcG9ydHNfaHRtbDVfc3RvcmFnZSApIHtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSwgcHJvZHVjdHMgKTtcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICwgcHJvZHVjdHMgKTtcblx0XHR9XG5cdFx0JC5mbi5XTEZNQy5jaGVja19wcm9kdWN0cyggSlNPTi5wYXJzZSggcHJvZHVjdHMgKSApO1xuXHR9LFxuXG5cdC8qKiBTZXQgdGhlIHdhaXRsaXN0IGhhc2ggaW4gYm90aCBzZXNzaW9uIGFuZCBsb2NhbCBzdG9yYWdlICovXG5cdHNldF93YWl0bGlzdF9oYXNoOiBmdW5jdGlvbiAoICBwcm9kdWN0cyApIHtcblx0XHRpZiAoICRzdXBwb3J0c19odG1sNV9zdG9yYWdlICkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5LCBwcm9kdWN0cyApO1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgLCBwcm9kdWN0cyApO1xuXG5cdFx0fVxuXHRcdCQuZm4uV0xGTUMuY2hlY2tfd2FpdGxpc3RfcHJvZHVjdHMoIEpTT04ucGFyc2UoIHByb2R1Y3RzICkgKTtcblx0fSxcblxuXHRzZXRfbGFuZ19oYXNoOiBmdW5jdGlvbiAoICBsYW5nICkge1xuXHRcdGlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSwgbGFuZyApO1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSAsIGxhbmcgKTtcblx0XHR9XG5cdH0sXG5cblx0dmFsaWRhdGVFbWFpbDogZnVuY3Rpb24gKGVtYWlsKSB7XG5cdFx0dmFyIHJlID1cblx0XHRcdC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvO1xuXHRcdHJldHVybiByZS50ZXN0KFN0cmluZyhlbWFpbCkudG9Mb3dlckNhc2UoKSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIHBhc3NlZCB2YWx1ZSBjb3VsZCBiZSBjb25zaWRlcmVkIHRydWVcblx0ICovXG5cdGlzVHJ1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0cmV0dXJuIHRydWUgPT09IHZhbHVlIHx8ICd5ZXMnID09PSB2YWx1ZSB8fCAnMScgPT09IHZhbHVlIHx8IDEgPT09IHZhbHVlIHx8ICd0cnVlJyA9PT0gdmFsdWU7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGRldmljZSBpcyBhbiBJT1MgZGV2aWNlXG5cdCAqL1xuXHRpc09TOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goIC9pcGFkfGlwaG9uZS9pICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEFkZCBsb2FkaW5nIHRvIGVsZW1lbnRcblx0ICpcblx0ICogQHBhcmFtIGl0ZW0galF1ZXJ5IG9iamVjdFxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGxvYWRpbmc6IGZ1bmN0aW9uICggaXRlbSApIHtcblx0XHRpZiAoIGl0ZW0uZmluZCggJ2knICkubGVuZ3RoID4gMCApIHtcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoICd3bGZtYy1hY3Rpb24gd2xmbWMtbG9hZGluZycgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXRlbS5hZGRDbGFzcyggJ3dsZm1jLWFjdGlvbiB3bGZtYy1sb2FkaW5nLWFsdCcgKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlbW92ZSBsb2FkaW5nIHRvIGVsZW1lbnRcblx0ICpcblx0ICogQHBhcmFtIGl0ZW0galF1ZXJ5IG9iamVjdFxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdHVubG9hZGluZzogZnVuY3Rpb24gKCBpdGVtICkge1xuXHRcdGl0ZW0ucmVtb3ZlQ2xhc3MoICd3bGZtYy1sb2FkaW5nIHdsZm1jLWxvYWRpbmctYWx0JyApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBCbG9jayBpdGVtIGlmIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRibG9jazogZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRpZiAodHlwZW9mICQuZm4uYmxvY2sgIT09ICd1bmRlZmluZWQnICYmIHdsZm1jX2wxMG4uZW5hYmxlX2FqYXhfbG9hZGluZykge1xuXHRcdFx0aXRlbS5mYWRlVG8oICc0MDAnLCAnMC42JyApLmJsb2NrKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWVzc2FnZTogbnVsbCxcblx0XHRcdFx0XHRvdmVybGF5Q1NTOiB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kICAgIDogJ3RyYW5zcGFyZW50IHVybCgnICsgd2xmbWNfbDEwbi5hamF4X2xvYWRlcl91cmwgKyAnKSBuby1yZXBlYXQgY2VudGVyJyxcblx0XHRcdFx0XHRcdGJhY2tncm91bmRTaXplOiAnNDBweCA0MHB4Jyxcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9LFxuXG5cdHRhYmxlX2Jsb2NrOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiAkLmZuLmJsb2NrICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUtd3JhcHBlciwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkuZmFkZVRvKCAnNDAwJywgJzAuNicgKS5ibG9jayhcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0XHRcdFx0b3ZlcmxheUNTUzoge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZCAgICA6ICd0cmFuc3BhcmVudCB1cmwoJyArIHdsZm1jX2wxMG4uYWpheF9sb2FkZXJfdXJsICsgJykgbm8tcmVwZWF0IGNlbnRlcicsXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZTogJzgwcHggODBweCcsXG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogVW5ibG9jayBpdGVtIGlmIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHR1bmJsb2NrOiBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGlmICh0eXBlb2YgJC5mbi51bmJsb2NrICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0aXRlbS5zdG9wKCB0cnVlICkuY3NzKCAnb3BhY2l0eScsICcxJyApLnVuYmxvY2soKTtcblx0XHRcdCQoICcudG9vbHRpcF9fZXhwYW5kZWQnICkucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2hpZGRlbicgKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGNvb2tpZXMgYXJlIGVuYWJsZWRcblx0ICpcblx0ICogQHJldHVybiBib29sZWFuXG5cdCAqL1xuXHRpc19jb29raWVfZW5hYmxlZDogZnVuY3Rpb24gKCkge1xuXHRcdGlmIChuYXZpZ2F0b3IuY29va2llRW5hYmxlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGFuZCByZWFkIGNvb2tpZS5cblx0XHRkb2N1bWVudC5jb29raWUgPSAnY29va2lldGVzdD0xJztcblx0XHR2YXIgcmV0ICAgICAgICAgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZiggJ2Nvb2tpZXRlc3Q9JyApICE9PSAtMTtcblxuXHRcdC8vIGRlbGV0ZSBjb29raWUuXG5cdFx0ZG9jdW1lbnQuY29va2llID0gJ2Nvb2tpZXRlc3Q9MTsgZXhwaXJlcz1UaHUsIDAxLUphbi0xOTcwIDAwOjAwOjAxIEdNVCc7XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdHNldENvb2tpZTogZnVuY3Rpb24gKGNvb2tpZV9uYW1lLCB2YWx1ZSkge1xuXHRcdHZhciBleGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdGV4ZGF0ZS5zZXREYXRlKCBleGRhdGUuZ2V0RGF0ZSgpICsgKDM2NSAqIDI1KSApO1xuXHRcdGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZV9uYW1lICsgXCI9XCIgKyBlc2NhcGUoIHZhbHVlICkgKyBcIjsgZXhwaXJlcz1cIiArIGV4ZGF0ZS50b1VUQ1N0cmluZygpICsgXCI7IHBhdGg9L1wiO1xuXHR9LFxuXG5cdHVwZGF0ZVVSTFBhcmFtZXRlcjogZnVuY3Rpb24gKHVybCwgcGFyYW0sIHBhcmFtVmFsKSB7XG5cdFx0dmFyIG5ld0FkZGl0aW9uYWxVUkwgPSBcIlwiO1xuXHRcdHZhciB0ZW1wQXJyYXkgICAgICAgID0gdXJsLnNwbGl0KCBcIj9cIiApO1xuXHRcdHZhciBiYXNlVVJMICAgICAgICAgID0gdGVtcEFycmF5WzBdO1xuXHRcdHZhciBhZGRpdGlvbmFsVVJMICAgID0gdGVtcEFycmF5WzFdO1xuXHRcdHZhciB0ZW1wICAgICAgICAgICAgID0gXCJcIjtcblx0XHRpZiAoYWRkaXRpb25hbFVSTCkge1xuXHRcdFx0dGVtcEFycmF5ID0gYWRkaXRpb25hbFVSTC5zcGxpdCggXCImXCIgKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0ZW1wQXJyYXlbaV0uc3BsaXQoICc9JyApWzBdICE9PSBwYXJhbSkge1xuXHRcdFx0XHRcdG5ld0FkZGl0aW9uYWxVUkwgKz0gdGVtcCArIHRlbXBBcnJheVtpXTtcblx0XHRcdFx0XHR0ZW1wICAgICAgICAgICAgICA9IFwiJlwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHJvd3NfdHh0ID0gdGVtcCArIFwiXCIgKyBwYXJhbSArIFwiPVwiICsgcGFyYW1WYWwucmVwbGFjZSggJyMnLCAnJyApO1xuXHRcdHJldHVybiBiYXNlVVJMICsgXCI/XCIgKyBuZXdBZGRpdGlvbmFsVVJMICsgcm93c190eHQ7XG5cdH0sXG5cblx0Z2V0VXJsUGFyYW1ldGVyOiBmdW5jdGlvbiAodXJsLCBzUGFyYW0pIHtcblx0XHR2YXIgc1BhZ2VVUkwgICAgICA9IGRlY29kZVVSSUNvbXBvbmVudCggdXJsLnN1YnN0cmluZyggMSApICksXG5cdFx0XHRzVVJMVmFyaWFibGVzID0gc1BhZ2VVUkwuc3BsaXQoIC9bJnw/XSsvICksXG5cdFx0XHRzUGFyYW1ldGVyTmFtZSxcblx0XHRcdGk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgc1VSTFZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c1BhcmFtZXRlck5hbWUgPSBzVVJMVmFyaWFibGVzW2ldLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0aWYgKHNQYXJhbWV0ZXJOYW1lWzBdID09PSBzUGFyYW0pIHtcblx0XHRcdFx0cmV0dXJuIHNQYXJhbWV0ZXJOYW1lWzFdID09PSB1bmRlZmluZWQgPyB0cnVlIDogc1BhcmFtZXRlck5hbWVbMV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxufTtcbjtcblxuXHRcdFxudG9hc3RyLm9wdGlvbnMgPSB7XG5cdHRhcFRvRGlzbWlzczogdHJ1ZSxcblx0dG9hc3RDbGFzczogJ3RvYXN0Jyxcblx0Y29udGFpbmVySWQ6ICd0b2FzdC1jb250YWluZXInLFxuXHRkZWJ1ZzogZmFsc2UsXG5cdGNsb3NlQnV0dG9uOiBmYWxzZSxcblx0c2hvd01ldGhvZDogJ2ZhZGVJbicsXG5cdHNob3dEdXJhdGlvbjogMzAwLFxuXHRzaG93RWFzaW5nOiAnc3dpbmcnLFxuXHRvblNob3duOiB1bmRlZmluZWQsXG5cdGhpZGVNZXRob2Q6ICdmYWRlT3V0Jyxcblx0aGlkZUR1cmF0aW9uOiAxMDAwLFxuXHRoaWRlRWFzaW5nOiAnc3dpbmcnLFxuXHRvbkhpZGRlbjogdW5kZWZpbmVkLFxuXHRjbG9zZU1ldGhvZDogZmFsc2UsXG5cdGNsb3NlRHVyYXRpb246IGZhbHNlLFxuXHRjbG9zZUVhc2luZzogZmFsc2UsXG5cdGNsb3NlT25Ib3ZlcjogdHJ1ZSxcblx0ZXh0ZW5kZWRUaW1lT3V0OiAyMDAwMCxcblx0aWNvbkNsYXNzZXM6IHtcblx0XHRlcnJvcjogJ3RvYXN0LWVycm9yJyxcblx0XHRpbmZvOiAndG9hc3QtaW5mbycsXG5cdFx0c3VjY2VzczogJ3RvYXN0LXN1Y2Nlc3MnLFxuXHRcdHdhcm5pbmc6ICd0b2FzdC13YXJuaW5nJ1xuXHR9LFxuXHRpY29uQ2xhc3M6ICd0b2FzdC1pbmZvJyxcblx0cG9zaXRpb25DbGFzczogd2xmbWNfbDEwbi50b2FzdF9wb3NpdGlvbiA9PT0gJ2RlZmF1bHQnID8gKHdsZm1jX2wxMG4uaXNfcnRsID8gJ3RvYXN0LXRvcC1yaWdodCcgOiAndG9hc3QtdG9wLWxlZnQnKSA6IHdsZm1jX2wxMG4udG9hc3RfcG9zaXRpb24sXG5cdHRpbWVPdXQ6IDUwMDAsXG5cdHRpdGxlQ2xhc3M6ICd0b2FzdC10aXRsZScsXG5cdG1lc3NhZ2VDbGFzczogJ3RvYXN0LW1lc3NhZ2UnLFxuXHRlc2NhcGVIdG1sOiBmYWxzZSxcblx0dGFyZ2V0OiAnYm9keScsXG5cdG5ld2VzdE9uVG9wOiB0cnVlLFxuXHRwcmV2ZW50RHVwbGljYXRlczogZmFsc2UsXG5cdHByb2dyZXNzQmFyOiB0cnVlLFxuXHRwcm9ncmVzc0NsYXNzOiAndG9hc3QtcHJvZ3Jlc3MnLFxuXHRydGw6ICh3bGZtY19sMTBuLmlzX3J0bCkgPyB0cnVlIDogZmFsc2Vcbn1cbjtcblxuXHRcdFxuaWYgKCB3bGZtY19sMTBuLmlzX3NhdmVfZm9yX2xhdGVyX2VuYWJsZWQgJiYgd2xmbWNfbDEwbi5pc19zYXZlX2Zvcl9sYXRlcl9wb3B1cF9yZW1vdmVfZW5hYmxlZCApIHtcblxuXHQkKCAnLndvb2NvbW1lcmNlLWNhcnQtZm9ybSAucHJvZHVjdC1yZW1vdmUgYS5yZW1vdmUnICkub2ZmKCAnY2xpY2snICkudW5iaW5kKCAnY2xpY2snICkuZGF0YSggJ2V2ZW50cycsIG51bGwgKTtcblx0JCggJ2JvZHknICkub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnZm9ybS53b29jb21tZXJjZS1jYXJ0LWZvcm0gYS5yZW1vdmUnLFxuXHRcdGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHZhciB0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRyZW1vdmVfaXRlbV91cmwgPSB0LmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHR2YXIgZWxlbSAgICAgICAgICAgPSAkKCAnI2FkZF90b19zYXZlX2Zvcl9sYXRlcl9wb3B1cCcgKTtcblx0XHRcdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0YWJzb2x1dGU6IGZhbHNlLFxuXHRcdFx0XHRjb2xvcjogJyMzMzMnLFxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnYWxsIDAuM3MnLFxuXHRcdFx0XHRob3Jpem9udGFsOiBlbGVtLmRhdGEoICdob3Jpem9udGFsJyApLFxuXHRcdFx0XHR2ZXJ0aWNhbDogZWxlbS5kYXRhKCAndmVydGljYWwnIClcblx0XHRcdH07XG5cdFx0XHRlbGVtLnBvcHVwKCBkZWZhdWx0T3B0aW9ucyApO1xuXHRcdFx0ZWxlbS5wb3B1cCggJ3Nob3cnICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xufVxuO1xuXG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCd3bGZtY19pbml0Jyxcblx0XHRcdGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfZml4X29uX2ltYWdlX3NpbmdsZV9wb3NpdGlvbigpO1xuXG5cdFx0XHRcdHZhciB0ICAgICAgICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRiICAgICAgICAgICAgICAgICAgICAgICA9ICQoICdib2R5JyApLFxuXHRcdFx0XHRcdGNhcnRfcmVkaXJlY3RfYWZ0ZXJfYWRkID0gKHR5cGVvZiAod2NfYWRkX3RvX2NhcnRfcGFyYW1zKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2NfYWRkX3RvX2NhcnRfcGFyYW1zICE9PSBudWxsKSA/IHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCA6ICcnO1xuXHRcdFx0XHRcbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtbGlzdCBidXR0b25bbmFtZT1cImFwcGx5X2J1bGtfYWN0aW9uc1wiXScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGxldCBlbGVtID0gICQoIHRoaXMgKS5jbG9zZXN0KCcuYWN0aW9uLXdyYXBwZXInKS5maW5kKCdzZWxlY3RbbmFtZT1cImJ1bGtfYWN0aW9uc1wiXScpO1xuXHRcdGxldCBxdWFudGl0eV9maWVsZHMgPSAkKCB0aGlzICkuY2xvc2VzdCgnZm9ybScpLmZpbmQoJ2lucHV0LnF0eScpO1xuXHRcdGlmICggZWxlbS5sZW5ndGggPiAwICYmICdkZWxldGUnID09PSBlbGVtLnZhbCgpICYmIHF1YW50aXR5X2ZpZWxkcy5sZW5ndGggPiAwICkge1xuXHRcdFx0cXVhbnRpdHlfZmllbGRzLmF0dHIoIFwiZGlzYWJsZWRcIix0cnVlICk7XG5cdFx0fVxuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2hhbmdlJyxcblx0JyNidWxrX2FkZF90b19jYXJ0LCNidWxrX2FkZF90b19jYXJ0MicsXG5cdGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdCAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGNoZWNrYm94ZXMgPSB0LmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmZpbmQoICdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06bm90KDpkaXNhYmxlZCknICk7XG5cdFx0aWYgKHQuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0Y2hlY2tib3hlcy5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQnICkucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydDInICkucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2hlY2tib3hlcy5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydCcgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQyJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHR9XG5cdH1cbik7XG5cblxuYi5vbihcblx0J3N1Ym1pdCcsXG5cdCcud2xmbWMtcG9wdXAtZm9ybScsXG5cdGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbnQub24oXG5cdCdmb3VuZF92YXJpYXRpb24nLFxuXHRmdW5jdGlvbiAoZXYsIHZhcmlhdGlvbikge1xuXHRcdHZhciB0ICAgICAgICAgICAgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgICAgICA9IHQuZGF0YSggJ3Byb2R1Y3RfaWQnICksXG5cdFx0XHR2YXJpYXRpb25fZGF0YSAgICAgICAgPSB2YXJpYXRpb247XG5cdFx0dmFyaWF0aW9uX2RhdGEucHJvZHVjdF9pZCA9IHByb2R1Y3RfaWQ7XG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd2xmbWNfc2hvd192YXJpYXRpb24nLCB2YXJpYXRpb25fZGF0YSApO1xuXHR9XG4pO1xuXG50Lm9uKCAnd2xmbWNfcmVsb2FkX2ZyYWdtZW50cycsICQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMgKTtcblxudC5vbihcblx0J3dsZm1jX2ZyYWdtZW50c19sb2FkZWQnLFxuXHRmdW5jdGlvbiAoZXYsIG9yaWdpbmFsLCB1cGRhdGUsIGZpcnN0TG9hZCkge1xuXHRcdGlmICggISBmaXJzdExvYWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkKCAnLnZhcmlhdGlvbnNfZm9ybScgKS5maW5kKCAnLnZhcmlhdGlvbnMgc2VsZWN0JyApLmxhc3QoKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9XG4pO1xuXG4vKiA9PT0gVEFCUyA9PT0gKi9cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtdGFicyBhOm5vdCguZXh0ZXJuYWwtbGluayknLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBjb250ZW50ID0gJCggdGhpcyApLmRhdGEoICdjb250ZW50JyApO1xuXHRcdCQoICcud2xmbWMtdGFiLWNvbnRlbnQnICkuaGlkZSgpO1xuXHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLXRhYnMtd3JhcHBlcicgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZS10YWItY2FydCBhY3RpdmUtdGFiLXNhdmUtZm9yLWxhdGVyJyApO1xuXHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLXRhYnMtd3JhcHBlcicgKS5hZGRDbGFzcyggJ2FjdGl2ZS10YWItJyArIGNvbnRlbnQgKTtcblx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy10YWJzLXdyYXBwZXInICkuZmluZCggJy53bGZtYy10YWJzIGEnICkucmVtb3ZlQ2xhc3MoICduYXYtdGFiLWFjdGl2ZScgKTtcblx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoICduYXYtdGFiLWFjdGl2ZScgKTtcblx0XHQkKCAnLndsZm1jX2NvbnRlbnRfJyArIGNvbnRlbnQgKS5zaG93KCk7XG5cdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCAnJywgJycsICQuZm4uV0xGTUMudXBkYXRlVVJMUGFyYW1ldGVyKCB3aW5kb3cubG9jYXRpb24uaHJlZiwgXCJ0YWJcIiwgY29udGVudCApICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG4vKiA9PT0gR0RQUiA9PT0gKi9cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtZ2Rwci1idG4nLFxuXHRmdW5jdGlvbihldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGVsZW0gICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0YWN0aW9uX3R5cGUgPSBlbGVtLmRhdGEoICdhY3Rpb24nICksXG5cdFx0XHRjaWQgICAgICAgICA9IGVsZW0uZGF0YSggJ2NpZCcgKTtcblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmdkcHJfYWN0aW9uLFxuXHRcdFx0XHRcdG5vbmNlOiBlbGVtLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdCdhY3Rpb25fdHlwZScgOiBhY3Rpb25fdHlwZSxcblx0XHRcdFx0XHQnY2lkJyA6IGNpZFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRpZiAoICEgZGF0YSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCggJy53bGZtYy1nZHByLW5vdGljZS13cmFwcGVyLCAud2xmbWMtdW5zdWJzY3JpYmUtbm90aWNlLXdyYXBwZXInKS5yZW1vdmUoKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuO1xuXHRcdFx0XHRcbnQub24oXG5cdCdjbGljaycsXG5cdCdib2R5LmVsZW1lbnRvci1lZGl0b3ItYWN0aXZlIC53bGZtYy1saXN0cy1oZWFkZXIgYSxib2R5LmVsZW1lbnRvci1lZGl0b3ItYWN0aXZlIGEud2xmbWMtb3Blbi1saXN0LWxpbmsnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgaHJlZiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0XHRpZiAoaHJlZiAmJiBocmVmICE9PSAnIycgJiYgaHJlZiAhPT0gJyMhJykge1xuXHRcdFx0JC5mbi5XTEZNQy5ibG9jayggJCggJy53bGZtYy10YWItY29udGVudCcgKSApO1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JC5hamF4KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dXJsOiBocmVmLFxuXHRcdFx0XHRcdHR5cGU6ICdHRVQnLFxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnaHRtbCcsXG5cdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZhciAkcmVzcG9uc2UgPSAkKCBkYXRhICksXG5cdFx0XHRcdFx0XHRcdCRoZWFkZXIgICA9ICRyZXNwb25zZS5maW5kKCAnLndsZm1jLWxpc3RzLWhlYWRlcicgKSxcblx0XHRcdFx0XHRcdFx0JGNvbnRlbnQgID0gJHJlc3BvbnNlLmZpbmQoICcud2xmbWMtdGFiLWNvbnRlbnQnICk7XG5cdFx0XHRcdFx0XHRpZiAoJGNvbnRlbnQpIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy10YWItY29udGVudCcgKS5yZXBsYWNlV2l0aCggJGNvbnRlbnQgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgkaGVhZGVyKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtbGlzdHMtaGVhZGVyJyApLnJlcGxhY2VXaXRoKCAkaGVhZGVyICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYpIHtcblx0XHRcdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKCB7cGF0aDogaHJlZn0sICcnLCBocmVmICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuKTtcbjtcblx0XHRcdFx0LyogPT09IFdJU0hMSVNUID09PSAqL1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b193aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoIHByb2R1Y3RfYWRkaW5nICYmIEFycmF5LmlzQXJyYXkocHJvZHVjdF9pbl9saXN0KSAmJiAhIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggKSB7XG5cdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfYWRkaW5nICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHRwYXJlbnRfcHJvZHVjdF9pZCA9IHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnICksXG5cdFx0XHRlbF93cmFwICAgICAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIHByb2R1Y3RfaWQgKSxcblx0XHRcdGZpbHRlcmVkX2RhdGEgICAgID0gbnVsbCxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfdG9fd2lzaGxpc3RfYWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRhZGRfdG9fd2lzaGxpc3Q6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdHByb2R1Y3RfdHlwZTogdC5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnICksXG5cdFx0XHRcdC8vIHdpc2hsaXN0X2lkOiB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0XHQvLyBmcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggcHJvZHVjdF9pZCApXG5cdFx0XHR9O1xuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19hZGRfdG9fd2lzaGxpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRsZXQgY3VycmVudF9wcm9kdWN0X2Zvcm07XG5cblx0XHRpZiAoICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpLmxlbmd0aCApIHtcblxuXHRcdFx0bGV0IGJ1dHRvbiA9ICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKTtcblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gYnV0dG9uLmNsb3Nlc3QoJ2Zvcm0nKS5lcSggMCApO1xuXG5cdFx0fVxuXG5cdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0aWYgKCAgdHlwZW9mIGN1cnJlbnRfcHJvZHVjdF9mb3JtICE9PSAndW5kZWZpbmVkJyAmJiBjdXJyZW50X3Byb2R1Y3RfZm9ybS5sZW5ndGggPiAwKSB7XG5cdFx0XHQvKmN1cnJlbnRfcHJvZHVjdF9mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT0nYWRkLXRvLWNhcnQnXVwiICkuYXR0ciggXCJkaXNhYmxlZFwiLHRydWUgKTtcblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT0nYWRkLXRvLWNhcnQnXVwiICkucmVtb3ZlQXR0ciggXCJkaXNhYmxlZFwiICk7Ki9cblx0XHRcdGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCBjdXJyZW50X3Byb2R1Y3RfZm9ybS5nZXQoIDAgKSApO1xuXHRcdFx0LyokLmVhY2goXG5cdFx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtLFxuXHRcdFx0XHRmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cdFx0XHRcdFx0JCggZWxlbWVudCApLmZpbmQoICdkaXYuY29tcG9zaXRlX2NvbXBvbmVudCcgKS5ub3QoICc6dmlzaWJsZScgKS5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1pdGVtX2lkJyApO1xuXHRcdFx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICd3Y2NwX2NvbXBvbmVudF9zZWxlY3Rpb25fbmlsWycgKyBpZCArICddJyAsICcxJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7Ki9cblx0XHRcdGZvcm1EYXRhLmRlbGV0ZSggJ2FkZC10by1jYXJ0JyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgYWRkX3RvX2NhcnRfbGluayA9IHQuY2xvc2VzdCggJy5wcm9kdWN0LnBvc3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICkuZmluZCggJy5hZGRfdG9fY2FydF9idXR0b24nICk7XG5cdFx0XHRpZiAoIGFkZF90b19jYXJ0X2xpbmsubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhLnF1YW50aXR5ID0gYWRkX3RvX2NhcnRfbGluay5hdHRyKCAnZGF0YS1xdWFudGl0eScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmVhY2goXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZnVuY3Rpb24oa2V5LHZhbHVlT2JqKXtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXkgLCB0eXBlb2YgdmFsdWVPYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoIHZhbHVlT2JqICkgOiB2YWx1ZU9iaiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRqUXVlcnkoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnd2xmbWNfYWRkaW5nX3RvX3dpc2hsaXN0JyApO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0cHJvZHVjdF9hZGRpbmcgPSBmYWxzZTtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdC8vZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdGNhY2hlOiBmYWxzZSxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwcm9kdWN0X2FkZGluZyA9IHRydWU7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHByb2R1Y3RfYWRkaW5nID0gZmFsc2U7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgfHwgcmVzcG9uc2VfcmVzdWx0ID09PSAnZXhpc3RzJykge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UuaXRlbV9pZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBwcm9kdWN0X2luX2xpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aXNobGlzdF9pZDogcmVzcG9uc2Uud2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1faWQ6IHJlc3BvbnNlLml0ZW1faWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHBhcnNlSW50KCBwcm9kdWN0X2lkICksXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgcG9wdXBfaWQgPSBlbF93cmFwLmF0dHIoICdkYXRhLXBvcHVwLWlkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAocG9wdXBfaWQpIHtcblxuXHRcdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgICAgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0dmFyIGVsZW0gICAgICAgICAgID0gJCggJyMnICsgcG9wdXBfaWQgKTtcblx0XHRcdFx0XHRcdFx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJyMzMzMnLFxuXHRcdFx0XHRcdFx0XHRcdHRyYW5zaXRpb246ICdhbGwgMC4zcycsXG5cdFx0XHRcdFx0XHRcdFx0aG9yaXpvbnRhbDogZWxlbS5kYXRhKCAnaG9yaXpvbnRhbCcgKSxcblx0XHRcdFx0XHRcdFx0XHR2ZXJ0aWNhbDogZWxlbS5kYXRhKCAndmVydGljYWwnIClcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0ZWxlbS5wb3B1cCggZGVmYXVsdE9wdGlvbnMgKTtcblx0XHRcdFx0XHRcdFx0JCgnI3dsZm1jLXRvb2x0aXAnKVxuXHRcdFx0XHRcdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdFx0XHRcdFx0J3RvcCc6ICcwJyxcblx0XHRcdFx0XHRcdFx0XHRcdCdsZWZ0JzogJzAnXG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoKVxuXHRcdFx0XHRcdFx0XHRcdC5hZGRDbGFzcygndG9vbHRpcF9faGlkZGVuJyk7XG5cdFx0XHRcdFx0XHRcdGVsZW0ucG9wdXAoICdzaG93JyApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X2FkZGVkX3RleHQgKSAmJiByZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJykge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcyggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9hZGRlZF90ZXh0ICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9hdXRvbWF0aW9ucyggcHJvZHVjdF9pZCwgcmVzcG9uc2Uud2lzaGxpc3RfaWQsIHJlc3BvbnNlLmN1c3RvbWVyX2lkLCAnd2lzaGxpc3QnLCByZXNwb25zZS5sb2FkX2F1dG9tYXRpb25fbm9uY2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICYmIHdsZm1jX2wxMG4uY2xpY2tfYmVoYXZpb3IgPT09ICdhZGQtcmVkaXJlY3QnICkge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3bGZtY19sMTBuLndpc2hsaXN0X3BhZ2VfdXJsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZS5tZXNzYWdlICkgJiYgcmVzcG9uc2VfcmVzdWx0ICE9PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXG5cdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX2FkZGVkX3RvX3dpc2hsaXN0JywgW3QsIGVsX3dyYXBdICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hamF4X2FkZF90b19jYXJ0Om5vdCguZGlzYWJsZWQpJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZCAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW1faWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCA9IHQuYXR0ciggJ2RhdGEtd2lzaGxpc3RfaWQnICksXG5cdFx0XHRkYXRhICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3RvX2NhcnRfYWN0aW9uLFxuXHRcdFx0XHRub25jZTogdC5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGxpZDogaXRlbV9pZCxcblx0XHRcdFx0d2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdH07XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHQucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHR0LmFkZENsYXNzKCAnbG9hZGluZycgKTtcblxuXHRcdC8vIEFsbG93IDNyZCBwYXJ0aWVzIHRvIHZhbGlkYXRlIGFuZCBxdWl0IGVhcmx5LlxuXHRcdGlmICggZmFsc2UgPT09ICQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VySGFuZGxlciggJ3Nob3VsZF9zZW5kX2FqYXhfcmVxdWVzdC5hZGRpbmdfdG9fY2FydCcsIFsgdCBdICkgKSB7XG5cdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FqYXhfcmVxdWVzdF9ub3Rfc2VudC5hZGRpbmdfdG9fY2FydCcsIFsgZmFsc2UsIGZhbHNlLCB0IF0gKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FkZGluZ190b19jYXJ0JywgWyB0LCBkYXRhIF0gKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuXHRcdFx0XHRcdGlmICggISByZXNwb25zZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yIHx8ICggcmVzcG9uc2Uuc3VjY2VzcyAmJiAhICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZS5zdWNjZXNzICkgKSApIHtcblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2UucHJvZHVjdF91cmwgKSB7XG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHJlc3BvbnNlLnByb2R1Y3RfdXJsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoICcnICE9PSB3bGZtY19sMTBuLmxhYmVscy5mYWlsZWRfYWRkX3RvX2NhcnRfbWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5mYWlsZWRfYWRkX3RvX2NhcnRfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBSZWRpcmVjdCB0byBjYXJ0IG9wdGlvbi5cblx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCApICkge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF91cmw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCd3Y19mcmFnbWVudF9yZWZyZXNoJyk7XG5cdFx0XHRcdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IHNvIHRoZW1lcyBjYW4gcmVmcmVzaCBvdGhlciBhcmVhcy5cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkZWRfdG9fY2FydCcsIFsgcmVzcG9uc2UuZnJhZ21lbnRzLCByZXNwb25zZS5jYXJ0X2hhc2gsIHQgXSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoICcnICE9PSB3bGZtY19sMTBuLmxhYmVscy5hZGRlZF90b19jYXJ0X21lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5hZGRlZF90b19jYXJ0X21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UubWVzc2FnZSAmJiAnJyAhPT0gcmVzcG9uc2UubWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkX3RvX2NhcnRfbWVzc2FnZScsIFsgcmVzcG9uc2UubWVzc2FnZSwgdF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1idG4tbG9naW4tbmVlZCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5sb2dpbl9uZWVkICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FscmVhZHlfaW5fd2lzaGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMuYWxyZWFkeV9pbl93aXNobGlzdF90ZXh0ICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXdpc2hsaXN0LXRhYmxlIC5yZW1vdmVfZnJvbV93aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgdGFibGUgICAgICAgICAgPSB0LnBhcmVudHMoICcud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKSxcblx0XHRcdHJvdyAgICAgICAgICAgID0gdC5wYXJlbnRzKCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdGRhdGFfcm93X2lkICAgID0gcm93LmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCAgICA9IHRhYmxlLmRhdGEoICdpZCcgKSxcblx0XHRcdHdpc2hsaXN0X3Rva2VuID0gdGFibGUuZGF0YSggJ3Rva2VuJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHQuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV93aXNobGlzdDogZGF0YV9yb3dfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHdpc2hsaXN0X3Rva2VuLFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKCBkYXRhX3Jvd19pZCApXG5cdFx0XHR9O1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMuYmxvY2soIHJvdyApO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmJsb2NrKCByb3cgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRsZXQgaTtcblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0LyppZiAodHlwZW9mIGRhdGEuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLnJlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0cm93LmFkZENsYXNzKCdkaXNhYmxlZC1yb3cnKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX2xpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fbGlzdFtpXS5wcm9kdWN0X2lkID09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dpc2hsaXN0JywgW3QsIHJvdyAsIGRhdGFdICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2FpdGxpc3QnLCBbdCwgcm93ICwgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl93YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2sgdG91Y2hlbmQnLFxuXHQnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2lzaGxpc3QgLnJlbW92ZV9mcm9tX3dpc2hsaXN0LC53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdhaXRsaXN0IC5yZW1vdmVfZnJvbV93aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgdGFibGUgICAgICAgICAgPSB0LnBhcmVudHMoICcud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKSxcblx0XHRcdHJvdyAgICAgICAgICAgID0gdC5wYXJlbnRzKCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdGRhdGFfcm93X2lkICAgID0gcm93LmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHRkYXRhX2l0ZW1faWQgICA9IHJvdy5kYXRhKCAnaXRlbS1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkICAgID0gcm93LmRhdGEoICd3aXNobGlzdC1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X3Rva2VuID0gcm93LmRhdGEoICd3aXNobGlzdC10b2tlbicgKSxcblx0XHRcdGxpc3RfdGFibGUgICAgICAgICAgICAgICAgICA9ICQoJy53bGZtYy13aXNobGlzdC1mb3JtIC53bGZtYy13aXNobGlzdC10YWJsZScpLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHQuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV93aXNobGlzdDogZGF0YV9yb3dfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHdpc2hsaXN0X3Rva2VuLFxuXHRcdFx0XHRtZXJnZV9saXN0czogd2xmbWNfbDEwbi5tZXJnZV9saXN0cyxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggZGF0YV9yb3dfaWQgKVxuXHRcdFx0fTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXG5cdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdHZhciBsb2FkX2ZyYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX2xpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdFtpXS53aXNobGlzdF9pZCA9PT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl9saXN0W2ldLnByb2R1Y3RfaWQgPT09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dpc2hsaXN0JywgW3QsIHJvdywgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ud2lzaGxpc3RfaWQgPT09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dhaXRsaXN0JywgW3QsIHJvdywgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl93YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggdC5jbG9zZXN0KCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQvLyQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGRhdGEuY291bnQgKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdpc2hsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggZGF0YS5jb3VudCApO1xuXG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LndsZm1jLWFkZC10by13aXNobGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggdC5jbG9zZXN0KCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQvLyQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGRhdGEuY291bnQgKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdhaXRsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggZGF0YS5jb3VudCApO1xuXG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LndsZm1jLWFkZC10by13YWl0bGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggbGlzdF90YWJsZS5sZW5ndGggPiAwICYmIHBhcnNlSW50KCB3aXNobGlzdF9pZCApID09PSBwYXJzZUludCggbGlzdF90YWJsZS5hdHRyKCAnZGF0YS1pZCcgKSApICkge1xuXHRcdFx0XHRcdFx0XHRsaXN0X3RhYmxlLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkuYWRkQ2xhc3MoJ2Rpc2FibGVkLXJvdycpO1xuXHRcdFx0XHRcdFx0XHRsb2FkX2ZyYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKChkYXRhLmNvdW50IDwgMSB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkgKSB7XG5cdFx0XHRcdFx0XHRcdGxvYWRfZnJhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggbG9hZF9mcmFnICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvKmlmICgoZGF0YS5jb3VudCA8IDEgfHwgISB0YWJsZS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5sZW5ndGgpICYmIHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19kZWxldGVfaXRlbScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0aXRlbV9pZCAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWQnICksXG5cdFx0XHRlbF93cmFwICAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBwcm9kdWN0X2lkICksXG5cdFx0XHRkYXRhICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuZGVsZXRlX2l0ZW1fYWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHR3aXNobGlzdF9pZDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdGl0ZW1faWQ6IGl0ZW1faWQsXG5cdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoIHByb2R1Y3RfaWQgKVxuXHRcdFx0fTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIGZyYWdtZW50cyAgICAgICAgPSByZXNwb25zZS5mcmFnbWVudHMsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcblxuXHRcdFx0XHRcdGlmICgndHJ1ZScgPT09IHJlc3BvbnNlLnJlc3VsdCkge1xuXHRcdFx0XHRcdFx0ZWxfd3JhcC5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0ID0gJC5ncmVwKFxuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGUuaXRlbV9pZCAhPT0gcGFyc2VJbnQoIGl0ZW1faWQgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgdC5jbG9zZXN0KCAnLndsZm1jLXJlbW92ZS1idXR0b24nICkubGVuZ3RoICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlX21lc3NhZ2UgKSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgndHJ1ZScgPT09IHJlc3BvbnNlLnJlc3VsdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X3JlbW92ZWRfdGV4dCApKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfcmVtb3ZlZF90ZXh0ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHQvKmlmICh0eXBlb2YgZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblxuXHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2lzaGxpc3QnLCBbdCwgZWxfd3JhcCwgcmVzcG9uc2VdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG50Lm9uKFxuXHQnd2xmbWNfc2hvd192YXJpYXRpb24nICxcblx0ZnVuY3Rpb24gKGV2LCBkYXRhKSB7XG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggZXYudGFyZ2V0ICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICA9IGRhdGEucHJvZHVjdF9pZCxcblx0XHRcdHZhcmlhdGlvbl9pZCAgICAgID0gZGF0YS52YXJpYXRpb25faWQsXG5cdFx0XHR0YXJnZXRzICAgICAgICAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0IFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApLFxuXHRcdFx0ZW5hYmxlX291dG9mc3RvY2sgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLmRhdGEoICdlbmFibGUtb3V0b2ZzdG9jaycgKTtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHZhcmlhdGlvbl9pZCB8fCAhIHRhcmdldHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICggISBlbmFibGVfb3V0b2ZzdG9jayAmJiAhIGRhdGEuaXNfaW5fc3RvY2spIHtcblx0XHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHR9XG5cdFx0dmFyIHBvcHVwSWQgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLmF0dHIoICdkYXRhLXBvcHVwLWlkJyApO1xuXHRcdGlmICggcG9wdXBJZCApIHtcblx0XHRcdHZhciBwb3B1cCAgID0gJCgnIycgKyBwb3B1cElkKTtcblx0XHRcdGlmIChwb3B1cC5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIHByb2R1Y3RfdGl0bGUgID0gcG9wdXAuZGF0YSggJ3Byb2R1Y3QtdGl0bGUnICk7XG5cdFx0XHRcdHZhciBkZXNjICAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX2NvbnRlbnQ7XG5cdFx0XHRcdHZhciB0aXRsZSAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX3RpdGxlO1xuXHRcdFx0XHR2YXIgaW1hZ2Vfc2l6ZSAgICAgPSBwb3B1cC5kYXRhKCAnaW1hZ2Utc2l6ZScgKTtcblx0XHRcdFx0dmFyIGltZyAgICAgICAgICAgID0gcG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1oZWFkZXIgaW1nJyApLmRhdGEoICdzcmMnICk7XG5cdFx0XHRcdHZhciBvcmlnaW5hbF9wcmljZSA9IHBvcHVwLmZpbmQoICcud2xmbWMtcGFyZW50LXByb2R1Y3QtcHJpY2UnICkuaHRtbCgpO1xuXHRcdFx0XHR2YXIgcHJvZHVjdF9wcmljZSAgPSAnJyAhPT0gZGF0YS5wcmljZV9odG1sID8gZGF0YS5wcmljZV9odG1sIDogb3JpZ2luYWxfcHJpY2U7XG5cblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIHByb2R1Y3RfcHJpY2UgKTtcblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X25hbWV9JywgcHJvZHVjdF90aXRsZSApO1xuXG5cdFx0XHRcdHRpdGxlID0gdGl0bGUucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIHByb2R1Y3RfcHJpY2UgKTtcblx0XHRcdFx0dGl0bGUgPSB0aXRsZS5yZXBsYWNlKCAne3Byb2R1Y3RfbmFtZX0nLCBwcm9kdWN0X3RpdGxlICk7XG5cblx0XHRcdFx0aWYgKGRhdGEuaW1hZ2VfaWQgJiYgJ3RydWUnID09IHBvcHVwLmRhdGEoICd1c2UtZmVhdHVyZWQnICkpIHtcblx0XHRcdFx0XHRpbWcgPSAnbGFyZ2UnID09PSBpbWFnZV9zaXplID8gZGF0YS5pbWFnZS5mdWxsX3NyYyA6ICgndGh1bWJuYWlsJyA9PT0gaW1hZ2Vfc2l6ZSA/IGRhdGEuaW1hZ2UudGh1bWJfc3JjIDogZGF0YS5pbWFnZS5zcmMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC10aXRsZScgKS5odG1sKCB0aXRsZSApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWRlc2MnICkuaHRtbCggZGVzYyApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWhlYWRlciBpbWcnICkuYXR0ciggJ3NyYycsIGltZyApO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdCAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICk7XG5cblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lci5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdGNvbnRhaW5lclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgY2xhc3Nlcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hdGNoKCAvd2xmbWMtYWRkLXRvLXdpc2hsaXN0LVxcUysvZyApLmpvaW4oICcgJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoICd3bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIHZhcmlhdGlvbl9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLWFkZHRvd2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1hZGQtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgdmFyaWF0aW9uX2lkICkgKTtcblx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtcmVtb3ZlZnJvbXdpc2hsaXN0IGEnICkuYXR0ciggJ2hyZWYnLCBjb250YWluZXIuYXR0ciggJ2RhdGEtcmVtb3ZlLXVybCcgKS5yZXBsYWNlKCBcIiNwcm9kdWN0X2lkXCIsIHZhcmlhdGlvbl9pZCApICk7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcgJiYgdi5wcm9kdWN0X2lkICYmIHYucHJvZHVjdF9pZCA9PSB2YXJpYXRpb25faWQpIHtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcsIHYud2lzaGxpc3RfaWQgKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWNfZGVsZXRlX2l0ZW0nICkuYXR0ciggJ2RhdGEtaXRlbS1pZCcsIHYuaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbik7XG50Lm9uKFxuXHQncmVzZXRfZGF0YScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgICAgID0gJCggZXYudGFyZ2V0ICksXG5cdFx0XHRwcm9kdWN0X2lkID0gdC5kYXRhKCAncHJvZHVjdF9pZCcgKSxcblx0XHRcdHRhcmdldHMgICAgPSAkKCAnLndsZm1jLWFkZC10by13aXNobGlzdCBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKTtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHRhcmdldHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0dmFyIHBvcHVwSWQgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLmF0dHIoICdkYXRhLXBvcHVwLWlkJyApO1xuXHRcdGlmICggcG9wdXBJZCApIHtcblx0XHRcdHZhciBwb3B1cCAgID0gJCgnIycgKyBwb3B1cElkKTtcblx0XHRcdGlmIChwb3B1cC5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIG9yaWdpbmFsX3ByaWNlID0gcG9wdXAuZmluZCggJy53bGZtYy1wYXJlbnQtcHJvZHVjdC1wcmljZScgKS5odG1sKCk7XG5cdFx0XHRcdHZhciBwcm9kdWN0X3RpdGxlICA9IHBvcHVwLmRhdGEoICdwcm9kdWN0LXRpdGxlJyApO1xuXHRcdFx0XHR2YXIgZGVzYyAgICAgICAgICAgPSB3bGZtY19sMTBuLmxhYmVscy5wb3B1cF9jb250ZW50O1xuXHRcdFx0XHR2YXIgdGl0bGUgICAgICAgICAgPSB3bGZtY19sMTBuLmxhYmVscy5wb3B1cF90aXRsZTtcblxuXHRcdFx0XHR2YXIgaW1nID0gcG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1oZWFkZXIgaW1nJyApLmRhdGEoICdzcmMnICk7XG5cblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIG9yaWdpbmFsX3ByaWNlICk7XG5cdFx0XHRcdGRlc2MgPSBkZXNjLnJlcGxhY2UoICd7cHJvZHVjdF9uYW1lfScsIHByb2R1Y3RfdGl0bGUgKTtcblxuXHRcdFx0XHR0aXRsZSA9IHRpdGxlLnJlcGxhY2UoICd7cHJvZHVjdF9wcmljZX0nLCBvcmlnaW5hbF9wcmljZSApO1xuXHRcdFx0XHR0aXRsZSA9IHRpdGxlLnJlcGxhY2UoICd7cHJvZHVjdF9uYW1lfScsIHByb2R1Y3RfdGl0bGUgKTtcblxuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLXRpdGxlJyApLmh0bWwoIHRpdGxlICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtZGVzYycgKS5odG1sKCBkZXNjICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtaGVhZGVyIGltZycgKS5hdHRyKCAnc3JjJywgaW1nICk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0Y29udGFpbmVyID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKTtcblxuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lci5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdGNvbnRhaW5lclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgY2xhc3Nlcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hdGNoKCAvd2xmbWMtYWRkLXRvLXdpc2hsaXN0LVxcUysvZyApLmpvaW4oICcgJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoICd3bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIHByb2R1Y3RfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1hZGR0b3dpc2hsaXN0IGEnICkuYXR0ciggJ2hyZWYnLCBjb250YWluZXIuYXR0ciggJ2RhdGEtYWRkLXVybCcgKS5yZXBsYWNlKCBcIiNwcm9kdWN0X2lkXCIsIHByb2R1Y3RfaWQgKSApO1xuXHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1yZW1vdmVmcm9td2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1yZW1vdmUtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgcHJvZHVjdF9pZCApICk7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcgJiYgdi5wcm9kdWN0X2lkICYmIHYucHJvZHVjdF9pZCA9PSBwcm9kdWN0X2lkKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWNfZGVsZXRlX2l0ZW0nICkuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnLCB2Lndpc2hsaXN0X2lkICk7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLWl0ZW0taWQnLCB2Lml0ZW1faWQgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdH1cbik7XG47XG5cdFx0XHRcdC8qID09PSBXYWl0bGlzdCA9PT0gKi9cblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy13YWl0bGlzdC1idG4tbG9naW4tbmVlZCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy53YWl0bGlzdF9sb2dpbl9uZWVkICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xudC5vbihcblx0J3dsZm1jX3Nob3dfdmFyaWF0aW9uJyxcblx0ZnVuY3Rpb24gKGV2LCBkYXRhKSB7XG5cdFx0dmFyXHRwcm9kdWN0X2lkICAgPSBkYXRhLnByb2R1Y3RfaWQsXG5cdFx0XHR2YXJpYXRpb25faWQgPSBkYXRhLnZhcmlhdGlvbl9pZDtcblx0XHQkLmZuLldMRk1DLmNoZWNrX3dhaXRsaXN0X21vZHVsZXMoIGRhdGEsIHByb2R1Y3RfaWQsIHZhcmlhdGlvbl9pZCApO1xuXHR9XG4pO1xuXG50Lm9uKFxuXHQncmVzZXRfZGF0YScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgICAgID0gJCggZXYudGFyZ2V0ICksXG5cdFx0XHRwcm9kdWN0X2lkID0gdC5kYXRhKCAncHJvZHVjdF9pZCcgKTtcblx0XHQkLmZuLldMRk1DLmNoZWNrX3dhaXRsaXN0X21vZHVsZXMoIG51bGwgLCBwcm9kdWN0X2lkLCBwcm9kdWN0X2lkICk7XG5cdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggd2xmbWNfbDEwbi53YWl0bGlzdF9yZXF1aXJlZF9wcm9kdWN0X3ZhcmlhdGlvbiApICkge1xuXHRcdFx0bGV0IGVsZW0gPSAkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdC0nICsgcHJvZHVjdF9pZCApO1xuXHRcdFx0ZWxlbS5maW5kKCAnLndsZm1jLXBvcHVwLXRyaWdnZXInICkuYWRkQ2xhc3MoICd3bGZtYy1kaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cbik7XG5cbnQub24oXG5cdCdoaWRlX3ZhcmlhdGlvbicsXG5cdCcudmFyaWF0aW9uc19mb3JtJyxcblx0ZnVuY3Rpb24gKGEpIHtcblx0XHRsZXQgZWxlbSA9ICQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyAkKCB0aGlzICkuZGF0YSggJ3Byb2R1Y3RfaWQnICkgKTtcblx0XHRpZiAoIGVsZW0ubGVuZ3RoID4gMCAmJiAkLmZuLldMRk1DLmlzVHJ1ZSggd2xmbWNfbDEwbi53YWl0bGlzdF9yZXF1aXJlZF9wcm9kdWN0X3ZhcmlhdGlvbiApICkge1xuXHRcdFx0YS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZWxlbS5maW5kKCAnLndsZm1jLXBvcHVwLXRyaWdnZXInICkuYWRkQ2xhc3MoICd3bGZtYy1kaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cbik7XG5cbnQub24oXG5cdCdzaG93X3ZhcmlhdGlvbicsXG5cdCcudmFyaWF0aW9uc19mb3JtJyxcblx0ZnVuY3Rpb24gKGEsIGIsIGQpIHtcblx0XHRsZXQgZWxlbSA9ICQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyAkKCB0aGlzICkuZGF0YSggJ3Byb2R1Y3RfaWQnICkgKTtcblx0XHRpZiAoIGVsZW0ubGVuZ3RoID4gMCApIHtcblx0XHRcdGEucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGVsZW0uZmluZCggJy53bGZtYy1wb3B1cC10cmlnZ2VyJyApLnJlbW92ZUNsYXNzKCAnd2xmbWMtZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWFkZC10by13YWl0bGlzdCAud2xmbWMtcG9wdXAtdHJpZ2dlci53bGZtYy1kaXNhYmxlZCcsXG5cdGZ1bmN0aW9uKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X21ha2VfYV9zZWxlY3Rpb25fdGV4dCApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hZGRfdG9fd2FpdGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0cG9wdXAgICAgICAgICAgICAgPSB0LmNsb3Nlc3QoICcud2xmbWMtcG9wdXAnICksXG5cdFx0XHRvbl9zYWxlICAgICAgICAgICA9IHBvcHVwLmZpbmQoICcud2xmbWMtd2FpdGxpc3Qtc2VsZWN0LXR5cGUgaW5wdXRbbmFtZT1saXN0X29uLXNhbGVdOmNoZWNrZWQnICkubGVuZ3RoID4gMCA/IDEgOiAwLFxuXHRcdFx0YmFja19pbl9zdG9jayAgICAgPSBwb3B1cC5maW5kKCAnLndsZm1jLXdhaXRsaXN0LXNlbGVjdC10eXBlIGlucHV0W25hbWU9bGlzdF9iYWNrLWluLXN0b2NrXTpjaGVja2VkJyApLmxlbmd0aCA+IDAgPyAxIDogMCxcblx0XHRcdHByaWNlX2NoYW5nZSAgICAgID0gcG9wdXAuZmluZCggJy53bGZtYy13YWl0bGlzdC1zZWxlY3QtdHlwZSBpbnB1dFtuYW1lPWxpc3RfcHJpY2UtY2hhbmdlXTpjaGVja2VkJyApLmxlbmd0aCA+IDAgPyAxIDogMCxcblx0XHRcdGxvd19zdG9jayAgICAgICAgID0gcG9wdXAuZmluZCggJy53bGZtYy13YWl0bGlzdC1zZWxlY3QtdHlwZSBpbnB1dFtuYW1lPWxpc3RfbG93LXN0b2NrXTpjaGVja2VkJyApLmxlbmd0aCA+IDAgPyAxIDogMCxcblx0XHRcdGVtYWlsICAgICAgICAgICAgID0gcG9wdXAuZmluZCggJ2lucHV0W25hbWU9d2xmbWNfZW1haWxdJyApLmxlbmd0aCA+IDAgPyBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT13bGZtY19lbWFpbF0nICkudmFsKCkudHJpbSgpIDogZmFsc2UsXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3Byb2R1Y3RfdG9fd2FpdGxpc3RfYWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRhZGRfdG9fd2FpdGxpc3Q6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdHByb2R1Y3RfdHlwZTogdC5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnICksXG5cdFx0XHRcdG9uX3NhbGUgOiBvbl9zYWxlLFxuXHRcdFx0XHRiYWNrX2luX3N0b2NrIDpiYWNrX2luX3N0b2NrLFxuXHRcdFx0XHRwcmljZV9jaGFuZ2UgOiBwcmljZV9jaGFuZ2UsXG5cdFx0XHRcdGxvd19zdG9jayAgOiBsb3dfc3RvY2ssXG5cdFx0XHRcdHdsZm1jX2VtYWlsIDogZW1haWxcblx0XHRcdH07XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCBmYWxzZSAhPT0gZW1haWwgJiYgJycgPT09IGVtYWlsICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy53YWl0bGlzdF9lbWFpbF9yZXF1aXJlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIGZhbHNlICE9PSBlbWFpbCAmJiAhICQuZm4uV0xGTUMudmFsaWRhdGVFbWFpbChlbWFpbCkgKSB7XG5cdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLndhaXRsaXN0X2VtYWlsX2Zvcm1hdCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19hZGRfdG9fd2FpdGxpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRsZXQgY3VycmVudF9wcm9kdWN0X2Zvcm07XG5cblx0XHRpZiAoICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpLmxlbmd0aCApIHtcblxuXHRcdFx0bGV0IGJ1dHRvbiA9ICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKTtcblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gYnV0dG9uLmNsb3Nlc3QoJ2Zvcm0nKS5lcSggMCApO1xuXG5cdFx0fVxuXG5cdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0aWYgKCAgdHlwZW9mIGN1cnJlbnRfcHJvZHVjdF9mb3JtICE9PSAndW5kZWZpbmVkJyAmJiBjdXJyZW50X3Byb2R1Y3RfZm9ybS5sZW5ndGggPiAwKSB7XG5cdFx0XHRmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSggY3VycmVudF9wcm9kdWN0X2Zvcm0uZ2V0KCAwICkgKTtcblx0XHRcdGZvcm1EYXRhLmRlbGV0ZSggJ2FkZC10by1jYXJ0JyApO1xuXHRcdH1cblxuXHRcdCQuZWFjaChcblx0XHRcdGRhdGEsXG5cdFx0XHRmdW5jdGlvbihrZXksdmFsdWVPYmope1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoIGtleSAsIHR5cGVvZiB2YWx1ZU9iaiA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeSggdmFsdWVPYmogKSA6IHZhbHVlT2JqICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGpRdWVyeSggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICd3bGZtY19hZGRpbmdfdG9fd2FpdGxpc3QnICk7XG5cblx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc19jb29raWVfZW5hYmxlZCgpKSB7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLndhaXRsaXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBmb3JtRGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHQvL2RhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcblx0XHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmIChyZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyApIHtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXG5cdFx0XHRcdFx0XHRwb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cblx0XHRcdFx0XHRcdGlmIChzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlX21lc3NhZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGxldCBsaXN0X3R5cGUgPSAnd2FpdGxpc3QnO1xuXHRcdFx0XHRcdFx0aWYgKG9uX3NhbGUgPT09IDEpIGxpc3RfdHlwZSArPSAnLG9uLXNhbGUnO1xuXHRcdFx0XHRcdFx0aWYgKHByaWNlX2NoYW5nZSA9PT0gMSkgbGlzdF90eXBlICs9ICcscHJpY2UtY2hhbmdlJztcblx0XHRcdFx0XHRcdGlmIChiYWNrX2luX3N0b2NrID09PSAxKSBsaXN0X3R5cGUgKz0gJyxiYWNrLWluLXN0b2NrJztcblx0XHRcdFx0XHRcdGlmIChsb3dfc3RvY2sgPT09IDEpIGxpc3RfdHlwZSArPSAnLGxvdy1zdG9jayc7XG5cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9hdXRvbWF0aW9ucyggcHJvZHVjdF9pZCwgcmVzcG9uc2Uud2lzaGxpc3RfaWQsIHJlc3BvbnNlLmN1c3RvbWVyX2lkLCBsaXN0X3R5cGUsIHJlc3BvbnNlLmxvYWRfYXV0b21hdGlvbl9ub25jZSApO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hZGRfdG9fb3V0b2ZzdG9jaycsXG5cdGZ1bmN0aW9uIChldikge1xuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHRwYXJlbnRfcHJvZHVjdF9pZCA9IHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnICksXG5cdFx0XHR3bGZtY19lbWFpbCAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8tb3V0b2ZzdG9jaycgKS5maW5kKCAnaW5wdXRbbmFtZT13bGZtY19lbWFpbF0nICksXG5cdFx0XHRmaWx0ZXJlZF9kYXRhICAgICA9IG51bGwsXG5cdFx0XHRlbWFpbCAgICAgICAgICAgICA9IHdsZm1jX2VtYWlsLmxlbmd0aCA+IDAgPyB3bGZtY19lbWFpbC52YWwoKS50cmltKCkgOiBmYWxzZSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfcHJvZHVjdF90b193YWl0bGlzdF9hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGFkZF90b193YWl0bGlzdDogcHJvZHVjdF9pZCxcblx0XHRcdFx0cHJvZHVjdF90eXBlOiB0LmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScgKSxcblx0XHRcdFx0b25fc2FsZSA6IDAsXG5cdFx0XHRcdGJhY2tfaW5fc3RvY2sgOiAxLFxuXHRcdFx0XHRwcmljZV9jaGFuZ2UgOiAwLFxuXHRcdFx0XHRsb3dfc3RvY2sgIDogMCxcblx0XHRcdFx0d2xmbWNfZW1haWwgOiAgZW1haWxcblx0XHRcdH07XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGlmICggZmFsc2UgIT09IGVtYWlsICYmICcnID09PSBlbWFpbCApIHtcblx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMud2FpdGxpc3RfZW1haWxfcmVxdWlyZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCBmYWxzZSAhPT0gZW1haWwgJiYgISAkLmZuLldMRk1DLnZhbGlkYXRlRW1haWwoZW1haWwpICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy53YWl0bGlzdF9lbWFpbF9mb3JtYXQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gYWxsb3cgdGhpcmQgcGFydHkgY29kZSB0byBmaWx0ZXIgZGF0YS5cblx0XHRpZiAoZmlsdGVyZWRfZGF0YSA9PT0gJCggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggJ3dsZm1jX2FkZF90b193YWl0bGlzdF9kYXRhJywgW3QsIGRhdGFdICkpIHtcblx0XHRcdGRhdGEgPSBmaWx0ZXJlZF9kYXRhO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyZW50X3Byb2R1Y3RfZm9ybTtcblxuXHRcdGlmICggJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJykubGVuZ3RoICkge1xuXG5cdFx0XHRsZXQgYnV0dG9uID0gJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpO1xuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSBidXR0b24uY2xvc2VzdCgnZm9ybScpLmVxKCAwICk7XG5cblx0XHR9XG5cblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRpZiAoICB0eXBlb2YgY3VycmVudF9wcm9kdWN0X2Zvcm0gIT09ICd1bmRlZmluZWQnICYmIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCBjdXJyZW50X3Byb2R1Y3RfZm9ybS5nZXQoIDAgKSApO1xuXHRcdFx0Zm9ybURhdGEuZGVsZXRlKCAnYWRkLXRvLWNhcnQnICk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKFxuXHRcdFx0ZGF0YSxcblx0XHRcdGZ1bmN0aW9uKGtleSx2YWx1ZU9iail7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCgga2V5ICwgdHlwZW9mIHZhbHVlT2JqID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KCB2YWx1ZU9iaiApIDogdmFsdWVPYmogKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ3dsZm1jX2FkZGluZ190b193YWl0bGlzdCcgKTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ud2FpdGxpc3RfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdC8vZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdGNhY2hlOiBmYWxzZSxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX3Jlc3VsdCAgPSByZXNwb25zZS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZSxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICkge1xuXG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cblx0XHRcdFx0XHRcdGlmICggc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZV9tZXNzYWdlICkgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by1vdXRvZnN0b2NrLScgKyBwcm9kdWN0X2lkICkuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9hdXRvbWF0aW9ucyggcHJvZHVjdF9pZCwgcmVzcG9uc2Uud2lzaGxpc3RfaWQsIHJlc3BvbnNlLmN1c3RvbWVyX2lkLCAnYmFjay1pbi1zdG9jaycsIHJlc3BvbnNlLmxvYWRfYXV0b21hdGlvbl9ub25jZSApO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2NhbmNlbF9vdXRvZnN0b2NrJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHBhcmVudF9wcm9kdWN0X2lkID0gdC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcgKSxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfcHJvZHVjdF90b193YWl0bGlzdF9hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGFkZF90b193YWl0bGlzdDogcHJvZHVjdF9pZCxcblx0XHRcdFx0cHJvZHVjdF90eXBlOiB0LmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScgKSxcblx0XHRcdFx0b25fc2FsZSA6IDAsXG5cdFx0XHRcdGJhY2tfaW5fc3RvY2sgOiAwLFxuXHRcdFx0XHRwcmljZV9jaGFuZ2UgOiAwLFxuXHRcdFx0XHRsb3dfc3RvY2sgIDogMCxcblx0XHRcdH07XG5cblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi53YWl0bGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAocmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgKSB7XG5cblx0XHRcdFx0XHRcdGlmIChzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlX21lc3NhZ2UgKSkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLW91dG9mc3RvY2stJyArIHByb2R1Y3RfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZS5tZXNzYWdlICkgJiYgcmVzcG9uc2VfcmVzdWx0ICE9PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcbjtcblx0XHRcdFx0LyogPT09IE1VTFRJIExJU1QgPT09ICovXG5cbmxldCBQcmV2TGlzdHNTdGF0ZSA9IFtdO1xuXG5iLm9uKFxuXHQnaW5wdXQnLFxuXHQnLndsZm1jLXBvcHVwLWxpc3RzLXdyYXBwZXIgLnNlYXJjaC1pbnB1dCcsXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWFyY2hUZXJtICAgPSAkKCB0aGlzICkudmFsKCkudG9Mb3dlckNhc2UoKTtcblx0XHR2YXIgbGlzdCAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtcG9wdXAtbGlzdHMtd3JhcHBlcicgKS5maW5kKCAnLmxpc3QnICk7XG5cdFx0dmFyIG5vUmVzdWx0c1JvdyA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLXBvcHVwLWxpc3RzLXdyYXBwZXInICkuZmluZCggJy5uby1yZXN1bHRzLXJvdycgKTtcblxuXHRcdHZhciBudW1WaXNpYmxlSXRlbXMgPSAwO1xuXHRcdGlmICggbGlzdC5maW5kKCAnLmxpc3QtaXRlbScgKS5sZW5ndGggKSB7XG5cdFx0XHRsaXN0LmZpbmQoICcubGlzdC1pdGVtJyApLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRcdFx0aWYgKHRleHQuaW5kZXhPZiggc2VhcmNoVGVybSApID4gLTEpIHtcblx0XHRcdFx0XHRcdCQoIHRoaXMgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRudW1WaXNpYmxlSXRlbXMrKztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JCggdGhpcyApLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0XHRpZiAobnVtVmlzaWJsZUl0ZW1zID09PSAwKSB7XG5cdFx0XHRcdG5vUmVzdWx0c1Jvdy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub1Jlc3VsdHNSb3cuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCB0aGlzICkudmFsKCAnJyApO1xuXHRcdH1cblx0fVxuKTtcblxuLypiLm9uKFxuXHQnY2hhbmdlJyxcblx0Jy53bGZtYy1hZGQtdG8tbGlzdC1jb250YWluZXIgLmxpc3QtaXRlbS1jaGVja2JveCcsXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxlY3RlZEl0ZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJy5saXN0LWl0ZW0nICk7XG5cblx0XHRpZiAoJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWxlY3RlZEl0ZW0ucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHR9XG5cdH1cbik7XG5cbmIub24oXG5cdCdjaGFuZ2UnLFxuXHQnLndsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyIC5saXN0LWl0ZW0tY2hlY2tib3gnLFxuXHRmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZWN0ZWRJdGVtID0gJCggdGhpcyApLmNsb3Nlc3QoICcubGlzdC1pdGVtJyApO1xuXHRcdHZhciBjaGVja2JveGVzID0gJCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtbW92ZS10by1saXN0LXdyYXBwZXInKS5maW5kKCdpbnB1dFtuYW1lPVwiZGVzdGluYXRpb25fd2lzaGxpc3RfaWRcIl0nKTtcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy53bGZtYy1tb3ZlLXRvLWxpc3Qtd3JhcHBlcicpLmZpbmQoJy5saXN0LWl0ZW0nKS5yZW1vdmVDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdGlmICgkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0c2VsZWN0ZWRJdGVtLmFkZENsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0XHRjaGVja2JveGVzLm5vdCgkKHRoaXMpKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuXHRcdH1cblx0fVxuKTtcblxuYi5vbihcblx0J2NoYW5nZScsXG5cdCcud2xmbWMtY29weS10by1saXN0LXdyYXBwZXIgLmxpc3QtaXRlbS1jaGVja2JveCcsXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxlY3RlZEl0ZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJy5saXN0LWl0ZW0nICk7XG5cdFx0dmFyIGNoZWNrYm94ZXMgPSAkKHRoaXMpLmNsb3Nlc3QoJy53bGZtYy1jb3B5LXRvLWxpc3Qtd3JhcHBlcicpLmZpbmQoJ2lucHV0W25hbWU9XCJkZXN0aW5hdGlvbl93aXNobGlzdF9pZFwiXScpO1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLndsZm1jLWNvcHktdG8tbGlzdC13cmFwcGVyJykuZmluZCgnLmxpc3QtaXRlbScpLnJlbW92ZUNsYXNzKCAnc2VsZWN0ZWQnICk7XG5cdFx0aWYgKCQoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRzZWxlY3RlZEl0ZW0uYWRkQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdGNoZWNrYm94ZXMubm90KCQodGhpcykpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cdFx0fVxuXHR9XG4pOyovXG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtY3JlYXRlLW5ldy1saXN0Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhcmVudF9wb3B1cCA9ICQoICcjJyArICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcG9wdXAtaWQnICkgKTtcblx0XHR2YXIgY2hpbGRfcG9wdXAgID0gJCggJyMnICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWNoaWxkLXBvcHVwLWlkJyApICk7XG5cblx0XHRwYXJlbnRfcG9wdXAucG9wdXAoICdoaWRlJyApO1xuXG5cdFx0Y29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRhYnNvbHV0ZTogZmFsc2UsXG5cdFx0XHRjb2xvcjogJyMzMzMnLFxuXHRcdFx0dHJhbnNpdGlvbjogJ2FsbCAwLjFzJyxcblx0XHRcdGhvcml6b250YWw6IGNoaWxkX3BvcHVwLmRhdGEoICdob3Jpem9udGFsJyApLFxuXHRcdFx0dmVydGljYWw6IGNoaWxkX3BvcHVwLmRhdGEoICd2ZXJ0aWNhbCcgKVxuXHRcdH07XG5cblx0XHRjaGlsZF9wb3B1cC5wb3B1cChcblx0XHRcdHtcblx0XHRcdFx0Li4uZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdG9uY2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHBhcmVudF9wb3B1cC5wb3B1cCggJ3Nob3cnICk7XG5cdFx0XHRcdFx0Y2hpbGRfcG9wdXAucG9wdXAoXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC4uLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHRcdFx0XHRvbmNsb3NlOiBudWxsXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRjaGlsZF9wb3B1cC5wb3B1cCggJ3Nob3cnICk7XG5cblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy10b2dnbGUtcHJpdmFjeScsXG5cdGZ1bmN0aW9uKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgZWxlbSAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRyb3cgICAgICAgICA9IGVsZW0ucGFyZW50cyggJ1tkYXRhLXdpc2hsaXN0LWlkXScgKSxcblx0XHRcdG9sZF9wcml2YWN5ID0gcGFyc2VJbnQoIGVsZW0uYXR0ciggJ2RhdGEtcHJpdmFjeScgKSApLFxuXHRcdFx0bmV3X3ByaXZhY3kgPSAwID09PSBvbGRfcHJpdmFjeSA/IDEgOiAwLFxuXHRcdFx0d2lzaGxpc3RfaWQgPSByb3cuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnICksXG5cdFx0XHRpY29uICAgICAgICA9IGVsZW0uZmluZCggJ2knICksXG5cdFx0XHRlZGl0X3BvcHVwICA9ICQoICcjZWRpdF9wb3B1cF8nICsgd2lzaGxpc3RfaWQgKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLm11bHRpX2xpc3RfYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5jaGFuZ2VfcHJpdmFjeV9hY3Rpb24sXG5cdFx0XHRcdFx0bm9uY2U6IGVsZW0uZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0J3dpc2hsaXN0X2lkJyA6IHdpc2hsaXN0X2lkLFxuXHRcdFx0XHRcdCdsaXN0X3ByaXZhY3knIDogbmV3X3ByaXZhY3lcblx0XHRcdFx0fSxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGljb24ucmVtb3ZlQ2xhc3MoICd3bGZtYy1pY29uLXVubG9jayB3bGZtYy1pY29uLWxvY2snICk7XG5cdFx0XHRcdFx0aWNvbi5hZGRDbGFzcyggb2xkX3ByaXZhY3kgPT09IDAgPyAnd2xmbWMtaWNvbi1sb2NrJyA6ICd3bGZtYy1pY29uLXVubG9jaycgKTtcblx0XHRcdFx0XHRlZGl0X3BvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9wcml2YWN5XCJdW3ZhbHVlPVwiJyArIG5ld19wcml2YWN5ICsgJ1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdFx0XHRcdGVsZW0uYXR0ciggJ2RhdGEtcHJpdmFjeScgLCBuZXdfcHJpdmFjeSApO1xuXHRcdFx0XHRcdGlmKCBuZXdfcHJpdmFjeSA9PT0gMCApIHtcblx0XHRcdFx0XHRcdCQoJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJzaGFyZV9wb3B1cF8nICsgd2lzaGxpc3RfaWQgKyAnXCJdJykucmVtb3ZlQXR0cignc3R5bGUnKTtcblx0XHRcdFx0XHRcdCQoJy5zaGFyZS13cmFwcGVyJykuc2hvdygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkKCcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwic2hhcmVfcG9wdXBfJyArIHdpc2hsaXN0X2lkICsgJ1wiXScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0XHRcdFx0XHQkKCcuc2hhcmUtd3JhcHBlcicpLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1kZWxldGUtbGlzdCcsXG5cdGZ1bmN0aW9uKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgZWxlbSAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHR3aXNobGlzdF9pZCA9IGVsZW0uZGF0YSggJ3dpc2hsaXN0LWlkJyApLFxuXHRcdFx0cG9wdXBcdFx0PSAkKCAnIycgKyBlbGVtLmRhdGEoICdwb3B1cC1pZCcgKSApLFxuXHRcdFx0cm93ICAgICAgICAgPSAkKCAndWwud2xmbWMtbWFuYWdlLWxpc3RzIGxpW2RhdGEtd2lzaGxpc3QtaWQ9XCInICsgd2lzaGxpc3RfaWQgKyAnXCJdLGEubGlzdC1yb3dbZGF0YS1saXN0LWlkPVwiJyArIHdpc2hsaXN0X2lkICsgJ1wiXSwgLndsZm1jLWRyb3Bkb3duLWNvbnRlbnQgbGlbZGF0YS13aXNobGlzdC1pZD1cIicgKyB3aXNobGlzdF9pZCArICdcIl0nICksXG5cdFx0XHR0YWJsZSAgICAgICA9ICQoJy53bGZtYy13aXNobGlzdC10YWJsZVtkYXRhLWlkPVwiJyArIHdpc2hsaXN0X2lkICsgJ1wiXScpO1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ubXVsdGlfbGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmRlbGV0ZV9saXN0X2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogJCggJyN3bGZtYy1saXN0cycgKS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHR3aXNobGlzdF9pZCA6IHdpc2hsaXN0X2lkLFxuXHRcdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGlmICggISBkYXRhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgZGF0YS5yZXN1bHQgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIGRhdGEubWVzc2FnZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRyb3cucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRpZiAoJCgnI3dsZm1jX215X2xpc3RzX2Ryb3Bkb3duIGxpJykubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdCQoJy53bGZtYy1zZWxlY3QtbGlzdC13cmFwcGVyJykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdFx0XHRcdFx0JCgnLndsZm1jLWxpc3QtYWN0aW9ucy13cmFwcGVyIC53bGZtYy1uZXctbGlzdCcpLmNzcygnZGlzcGxheScsICcnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggdGFibGUubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3bGZtY19sMTBuLmxpc3RzX3BhZ2VfdXJsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHQvKmlmICh0eXBlb2YgZGF0YS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHR9LFxuXG5cdFx0XHR9XG5cdFx0KTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtc2F2ZS1saXN0Jyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHdpc2hsaXN0X2lkID0gZWxlbS5kYXRhKCAnd2lzaGxpc3QtaWQnICksXG5cdFx0XHRyb3cgICAgICAgICA9ICQoICd1bC53bGZtYy1tYW5hZ2UtbGlzdHMgbGlbZGF0YS13aXNobGlzdC1pZD1cIicgKyB3aXNobGlzdF9pZCArICdcIl0sYS5saXN0LXJvd1tkYXRhLWxpc3QtaWQ9XCInICsgd2lzaGxpc3RfaWQgKyAnXCJdLCAud2xmbWMtbGlzdC1hY3Rpb25zLXdyYXBwZXInICksXG5cdFx0XHRwb3B1cFx0XHQ9ICQoICcjJyArIGVsZW0uZGF0YSggJ3BvcHVwLWlkJyApICksXG5cdFx0XHRwcml2YWN5IFx0PSBwYXJzZUludCggcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X3ByaXZhY3lcIl06Y2hlY2tlZCcgKS52YWwoKSApLFxuXHRcdFx0bmFtZSBcdFx0PSBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfbmFtZVwiXScgKS52YWwoKSxcblx0XHRcdGRlc2MgXHRcdD0gcG9wdXAuZmluZCggJ3RleHRhcmVhW25hbWU9XCJsaXN0X2Rlc2NyaXB0aW9uc1wiXScgKS52YWwoKSxcblx0XHRcdGljb25Qcml2YWN5ID0gcm93LmZpbmQoICcud2xmbWMtdG9nZ2xlLXByaXZhY3kgaScgKTtcblx0XHRpZiAoICcnID09PSAkLnRyaW0oIG5hbWUgKSApIHtcblx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMubXVsdGlfbGlzdF9saXN0X25hbWVfcmVxdWlyZWQgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ubXVsdGlfbGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnVwZGF0ZV9saXN0X2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogJCggJyN3bGZtYy1saXN0cycgKS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHR3aXNobGlzdF9pZCA6IHdpc2hsaXN0X2lkLFxuXHRcdFx0XHRcdGxpc3RfcHJpdmFjeTogcHJpdmFjeSxcblx0XHRcdFx0XHRsaXN0X25hbWU6bmFtZSxcblx0XHRcdFx0XHRsaXN0X2Rlc2NyaXB0aW9uczpkZXNjLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGlmICggISBkYXRhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgZGF0YS5yZXN1bHQgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIGRhdGEubWVzc2FnZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRyb3cuZmluZCggJy5saXN0LW5hbWUnICkudGV4dCggbmFtZSApO1xuXHRcdFx0XHRcdFx0cm93LmZpbmQoICcubGlzdC1kZXNjJyApLnRleHQoIGRlc2MgKTtcblx0XHRcdFx0XHRcdHJvdy5maW5kKCAnLndsZm1jLXRvZ2dsZS1wcml2YWN5JyApLmF0dHIoICdkYXRhLXByaXZhY3knLCBwcml2YWN5ICk7XG5cdFx0XHRcdFx0XHRpY29uUHJpdmFjeS5yZW1vdmVDbGFzcyggJ3dsZm1jLWljb24tdW5sb2NrIHdsZm1jLWljb24tbG9jaycgKTtcblx0XHRcdFx0XHRcdGljb25Qcml2YWN5LmFkZENsYXNzKCBwcml2YWN5ID09PSAwID8gJ3dsZm1jLWljb24tdW5sb2NrJyA6ICd3bGZtYy1pY29uLWxvY2snICk7XG5cdFx0XHRcdFx0XHRpZiggcHJpdmFjeSA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0JCgnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cInNoYXJlX3BvcHVwXycgKyB3aXNobGlzdF9pZCArICdcIl0nKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXHRcdFx0XHRcdFx0XHQkKCcuc2hhcmUtd3JhcHBlcicpLnNob3coKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdCQoJy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJzaGFyZV9wb3B1cF8nICsgd2lzaGxpc3RfaWQgKyAnXCJdJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHRcdFx0XHRcdFx0JCgnLnNoYXJlLXdyYXBwZXInKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1hZGQtbGlzdCcsXG5cdGZ1bmN0aW9uKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgZWxlbSAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHBvcHVwICAgPSAkKCAnI25ld19saXN0X3BvcHVwJyApLFxuXHRcdFx0cHJpdmFjeSA9IHBhcnNlSW50KCBwb3B1cC5maW5kKCAnaW5wdXRbbmFtZT1cImxpc3RfcHJpdmFjeVwiXTpjaGVja2VkJyApLnZhbCgpICksXG5cdFx0XHRuYW1lICAgID0gcG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X25hbWVcIl0nICkudmFsKCksXG5cdFx0XHRkZXNjICAgID0gcG9wdXAuZmluZCggJ3RleHRhcmVhW25hbWU9XCJsaXN0X2Rlc2NyaXB0aW9uc1wiXScgKS52YWwoKTtcblx0XHRpZiAoICcnID09PSAkLnRyaW0oIG5hbWUgKSApIHtcblx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMubXVsdGlfbGlzdF9saXN0X25hbWVfcmVxdWlyZWQgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ubXVsdGlfbGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmNyZWF0ZV9uZXdfbGlzdF9hY3Rpb24sXG5cdFx0XHRcdFx0bm9uY2U6ICBlbGVtLmRhdGEoJ25vbmNlJyApLFxuXHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0bGlzdF9wcml2YWN5OiBwcml2YWN5LFxuXHRcdFx0XHRcdGxpc3RfbmFtZTpuYW1lLFxuXHRcdFx0XHRcdGxpc3RfZGVzY3JpcHRpb25zOmRlc2MsXG5cdFx0XHRcdFx0ZnJhZ21lbnRzOiAoICQoICcud2lzaGxpc3QtZW1wdHktcm93IC53bGZtYy1uZXctbGlzdCcpLmxlbmd0aCA+IDAgKSA/ICQuZm4uV0xGTUMucmV0cmlldmVfZnJhZ21lbnRzKCkgOiAkLmZuLldMRk1DLnJldHJpZXZlX2ZyYWdtZW50cyggJ2xpc3RfY291bnRlcicgKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGlmICggISBkYXRhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgZGF0YS5yZXN1bHQgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIGRhdGEubWVzc2FnZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkKCcud2xmbWMtbGlzdC1hY3Rpb25zLXdyYXBwZXIgLndsZm1jLW5ldy1saXN0JykuaGlkZSgpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJ2lucHV0W25hbWU9XCJsaXN0X25hbWVcIl0nICkudmFsKCcnKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICdpbnB1dFtuYW1lPVwibGlzdF9kZXNjcmlwdGlvbnNcIl0nICkudmFsKCcnKTtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0XHRcdHZhciB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCAnd2xmbWMtbGlzdC1pdGVtJyApO1xuXHRcdFx0XHRcdFx0dmFyIGh0bWwgICAgID0gdGVtcGxhdGUoIGRhdGEgKTtcblx0XHRcdFx0XHRcdGlmICggJCgnI21vdmVfcG9wdXAnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgdWwubGlzdCcgKS5hcHBlbmQoIGh0bWwgKTtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwIHVsLmxpc3QnICkuZmluZCggJ2lucHV0Lmxpc3QtaXRlbS1jaGVja2JveFt2YWx1ZT1cIicgKyBkYXRhLndpc2hsaXN0X2lkICsgJ1wiXScpLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwIC5saXN0LWVtcHR5JyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNtb3ZlX3BvcHVwIC5uby1yZXN1bHRzLXJvdycgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cCAud2xmbWMtc2VhcmNoLWxpc3RzJykuYXR0ciggJ3N0eWxlJywgJycpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXAgLndsZm1jX21vdmVfdG9fbGlzdCcpLmF0dHIoICdzdHlsZScsICcnKTtcblxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCgnI2NvcHlfcG9wdXAnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgdWwubGlzdCcgKS5hcHBlbmQoIGh0bWwgKTtcblx0XHRcdFx0XHRcdFx0JCggJyNjb3B5X3BvcHVwIHVsLmxpc3QnICkuZmluZCggJ2lucHV0Lmxpc3QtaXRlbS1jaGVja2JveFt2YWx1ZT1cIicgKyBkYXRhLndpc2hsaXN0X2lkICsgJ1wiXScpLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdFx0XHRcdFx0JCggJyNjb3B5X3BvcHVwIC5saXN0LWVtcHR5JyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNjb3B5X3BvcHVwIC5uby1yZXN1bHRzLXJvdycgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdCQoICcjY29weV9wb3B1cCAud2xmbWMtc2VhcmNoLWxpc3RzJykuYXR0ciggJ3N0eWxlJywgJycpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXAgLndsZm1jX2NvcHlfdG9fbGlzdCcpLmF0dHIoICdzdHlsZScsICcnKTtcblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JCggJyNhZGRfdG9fbGlzdF9wb3B1cCB1bC5saXN0JyApLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0XHRcdFx0XHRQcmV2TGlzdHNTdGF0ZS5wdXNoKCBmYWxzZSApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIHVsLmxpc3QnICkuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykub24oJ2NoYW5nZScsIFdsZm1jQ2hlY2tib3hMaXN0c0NoYW5nZSk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgdWwubGlzdCcgKS5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94W3ZhbHVlPVwiJyArIGRhdGEud2lzaGxpc3RfaWQgKyAnXCJdJykucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIC5saXN0LWVtcHR5JyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNhZGRfdG9fbGlzdF9wb3B1cCAubm8tcmVzdWx0cy1yb3cnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIC53bGZtYy1zZWFyY2gtbGlzdHMnKS5hdHRyKCAnc3R5bGUnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdCQoICcjYWRkX3RvX2xpc3RfcG9wdXAgLndsZm1jX2FkZF90b19tdWx0aV9saXN0JykuYXR0ciggJ3N0eWxlJywgJycpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI2FkZF90b19saXN0X3BvcHVwIC53bGZtYy1tYW5hZ2UtYnRuJykuYXR0ciggJ3N0eWxlJywgJycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSgnd2xmbWMtZHJvcGRvd24taXRlbScpO1xuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnZnVuY3Rpb24nKSB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCQoJyN3bGZtY19teV9saXN0c19kcm9wZG93bicpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRodG1sID0gdGVtcGxhdGUoZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0JCggJyN3bGZtY19teV9saXN0c19kcm9wZG93bicgKS5hcHBlbmQoIGh0bWwgKTtcblx0XHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXNlbGVjdC1saXN0LXdyYXBwZXInKS5yZW1vdmVDbGFzcyggJ2hpZGUnKTtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfZHJvcGRvd25fbGlzdHMoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3BvcHVwX2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cblx0XHRcdFx0XHRcdGlmICggJCgnLndsZm1jLWxpc3RzJykubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5ibG9jayggJCgnLndsZm1jLWxpc3RzJykgKTtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZGF0YS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHR9XG5cdFx0KTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbnQub24oXG5cdCd3bGZtY19zaG93X3ZhcmlhdGlvbicgLFxuXHRmdW5jdGlvbiAoZXYsIGRhdGEpIHtcblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gZGF0YS5wcm9kdWN0X2lkLFxuXHRcdFx0dmFyaWF0aW9uX2lkICAgICAgPSBkYXRhLnZhcmlhdGlvbl9pZCxcblx0XHRcdHRhcmdldHMgICAgICAgICAgID0gJCggJy53bGZtYy1hZGQtdG8tbXVsdGktbGlzdCBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKSxcblx0XHRcdGVuYWJsZV9vdXRvZnN0b2NrID0gdGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1tdWx0aS1saXN0JyApLmRhdGEoICdlbmFibGUtb3V0b2ZzdG9jaycgKTtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHZhcmlhdGlvbl9pZCB8fCAhIHRhcmdldHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICggISBlbmFibGVfb3V0b2ZzdG9jayAmJiAhIGRhdGEuaXNfaW5fc3RvY2spIHtcblx0XHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8tbXVsdGktbGlzdCcgKS5hZGRDbGFzcyggJ2hpZGUnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8tbXVsdGktbGlzdCcgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cdFx0XHR9XG5cdFx0KTtcblx0XHQvLyQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiYWRkX3RvX2xpc3RfcG9wdXBcIl0nICkuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICkuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHZhcmlhdGlvbl9pZCApO1xuXHRcdCQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiYWRkX3RvX2xpc3RfcG9wdXBcIl1bZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKS5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cdH1cbik7XG5cbnQub24oXG5cdCdyZXNldF9kYXRhJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgPSAkKCBldi50YXJnZXQgKSxcblx0XHRcdHByb2R1Y3RfaWQgPSB0LmRhdGEoICdwcm9kdWN0X2lkJyApLFxuXHRcdFx0dGFyZ2V0cyAgICA9ICQoICcud2xmbWMtYWRkLXRvLW11bHRpLWxpc3QgW2RhdGEtcGFyZW50LXByb2R1Y3QtaWQ9XCInICsgcHJvZHVjdF9pZCArICdcIl0nICk7XG5cdFx0aWYgKCAhIHByb2R1Y3RfaWQgfHwgISB0YXJnZXRzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8tbXVsdGktbGlzdCcgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cdFx0XHR9XG5cdFx0KTtcblx0XHQvLyQoICcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiYWRkX3RvX2xpc3RfcG9wdXBcIl0nICkuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICkuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHQkKCAnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cImFkZF90b19saXN0X3BvcHVwXCJdW2RhdGEtcGFyZW50LXByb2R1Y3QtaWQ9XCInICsgcHJvZHVjdF9pZCArICdcIl0nICkuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1wb3B1cC10cmlnZ2VyW2RhdGEtcG9wdXAtaWQ9XCJtb3ZlX3BvcHVwXCJdJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRwb3B1cFx0XHRcdCAgPSAkKCAnI21vdmVfcG9wdXAnICksXG5cdFx0XHRpdGVtX2lkcyAgICAgICAgICA9IHQuZGF0YSgnaXRlbS1pZCcpO1xuXG5cdFx0cG9wdXAuZmluZCggJy53bGZtY19tb3ZlX3RvX2xpc3QnICkuYXR0ciggJ2RhdGEtaXRlbS1pZHMnLCBpdGVtX2lkcyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXBvcHVwLXRyaWdnZXJbZGF0YS1wb3B1cC1pZD1cImNvcHlfcG9wdXBcIl0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHBvcHVwXHRcdFx0ICA9ICQoICcjY29weV9wb3B1cCcgKSxcblx0XHRcdGl0ZW1faWRzICAgICAgICAgID0gdC5kYXRhKCdpdGVtLWlkJyk7XG5cblx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2NvcHlfdG9fbGlzdCcgKS5hdHRyKCAnZGF0YS1pdGVtLWlkcycsIGl0ZW1faWRzICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtcG9wdXAtdHJpZ2dlcltkYXRhLXBvcHVwLWlkPVwiYWRkX3RvX2xpc3RfcG9wdXBcIl0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cHJvZHVjdF90eXBlICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtdHlwZScgKSxcblx0XHRcdGV4Y2x1ZGVfZGVmYXVsdCAgID0gdC5hdHRyKCAnZGF0YS1leGNsdWRlLWRlZmF1bHQnICksXG5cdFx0XHRjYXJ0X2l0ZW1fa2V5ICAgICA9IHQuYXR0ciggJ2RhdGEtY2FydF9pdGVtX2tleScgKSxcblx0XHRcdHNhdmVfY2FydCAgICAgICAgID0gdC5hdHRyKCAnZGF0YS1zYXZlLWNhcnQnICksXG5cdFx0XHRwb3B1cFx0XHRcdCAgICAgICAgICAgICAgPSAkKCAnI2FkZF90b19saXN0X3BvcHVwJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmxvYWRfbGlzdHNfYWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRwcm9kdWN0X2lkOiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRleGNsdWRlX2RlZmF1bHQ6IGV4Y2x1ZGVfZGVmYXVsdFxuXHRcdFx0fTtcblxuXHRcdC8vIENoZWNrIGlmIGNhcnRfaXRlbV9rZXkgaXMgZGVmaW5lZCBiZWZvcmUgYWRkaW5nIGl0IHRvIHRoZSBkYXRhIG9iamVjdFxuXHRcdGlmICh0eXBlb2YgY2FydF9pdGVtX2tleSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGRhdGEuY2FydF9pdGVtX2tleSA9IGNhcnRfaXRlbV9rZXk7XG5cdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JyApLmF0dHIoICdkYXRhLWNhcnRfaXRlbV9rZXknLCBjYXJ0X2l0ZW1fa2V5ICk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBzYXZlX2NhcnQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jX2FkZF90b19tdWx0aV9saXN0JyApLmF0dHIoICdkYXRhLXNhdmUtY2FydCcsIHNhdmVfY2FydCApO1xuXHRcdH1cblxuXHRcdHBvcHVwLmZpbmQoICcud2xmbWNfYWRkX3RvX211bHRpX2xpc3QnICkuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJywgcHJvZHVjdF90eXBlICkuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKS5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHBhcmVudF9wcm9kdWN0X2lkICk7XG5cblx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc19jb29raWVfZW5hYmxlZCgpKSB7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0d2luZG93LmFsZXJ0KCB3bGZtY19sMTBuLmxhYmVscy5jb29raWVfZGlzYWJsZWQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5tdWx0aV9saXN0X2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5ibG9jayggcG9wdXAuZmluZCggJy53bGZtYy1hZGQtdG8tbGlzdC1jb250YWluZXInICkgKTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5ibG9jayggcG9wdXAuZmluZCggJy53bGZtYy1hZGQtdG8tbGlzdC1jb250YWluZXInICkgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX3Jlc3VsdCAgPSByZXNwb25zZS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZSxcblx0XHRcdFx0XHRcdGRhdGEgICAgICAgICAgICAgPSByZXNwb25zZS5kYXRhLFxuXHRcdFx0XHRcdFx0cHJvZHVjdF9saXN0c1x0ID0gcmVzcG9uc2UucHJvZHVjdF9saXN0cyxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyAmJiAwIDwgZGF0YS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggJ3dsZm1jLWxpc3QtaXRlbScgKTtcblx0XHRcdFx0XHRcdHZhciBodG1sICAgICA9ICcnO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGh0bWwgKz0gdGVtcGxhdGUoIGRhdGFbaV0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtc2VhcmNoLWxpc3RzJykuc2hvdygpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy5saXN0JyApLmh0bWwoIGh0bWwgKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtbnVtYmVyJyApLnRleHQoIHByb2R1Y3RfbGlzdHMubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLmxpc3QtZW1wdHknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtY19hZGRfdG9fbXVsdGlfbGlzdCcgKS5hdHRyKCAnZGF0YS1saXN0LWlkcycgLCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9saXN0cyApICkuYXR0ciggJ3N0eWxlJywgJycgKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtbWFuYWdlLWJ0bicpLmF0dHIoICdzdHlsZScsICcnKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoJy53bGZtY19hZGRfdG9fbXVsdGlfbGlzdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHQvLyBBZGQgZXZlbnQgdG8gY2hlY2tib3ggdG8gZGlzYWJsZSBzdWJtaXQgYnV0dG9uIGlmIHlvdSBkbyBub3QgY2hhbmdlIGFueXRoaW5nJ3MuXG5cdFx0XHRcdFx0XHRQcmV2TGlzdHNTdGF0ZSA9IHBvcHVwLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLm1hcChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICQodGhpcykucHJvcCgnY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdFx0XHRwb3B1cC5vbignY2hhbmdlJywgJy5saXN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIFdsZm1jQ2hlY2tib3hMaXN0c0NoYW5nZSk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1tYW5hZ2UtYnRuJykuY3NzKCAnZGlzcGxheScsICdub25lICFpbXBvcnRhbnQnKTtcblx0XHRcdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtc2VhcmNoLWxpc3RzJykuaGlkZSgpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy5saXN0JyApLmh0bWwoICcnICk7XG5cdFx0XHRcdFx0XHRwb3B1cC5maW5kKCAnLmxpc3QtZW1wdHknICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1udW1iZXInICkudGV4dCggMCApO1xuXHRcdFx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtY19hZGRfdG9fbXVsdGlfbGlzdCcpLmNzcyggJ2Rpc3BsYXknLCAnbm9uZSAhaW1wb3J0YW50Jyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLm1lc3NhZ2UgKSAmJiByZXNwb25zZV9yZXN1bHQgIT09ICd0cnVlJyApIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0cG9wdXAucG9wdXAoICdoaWRlJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b19tdWx0aV9saXN0Jyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHBhcmVudF9wcm9kdWN0X2lkID0gdC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcgKSxcblx0XHRcdGNhcnRfaXRlbV9rZXkgICAgID0gdC5hdHRyKCAnZGF0YS1jYXJ0X2l0ZW1fa2V5JyApLFxuXHRcdFx0c2F2ZV9jYXJ0ICAgICAgICAgPSB0LmF0dHIoICdkYXRhLXNhdmUtY2FydCcgKSxcblx0XHRcdGZpbHRlcmVkX2RhdGEgICAgID0gbnVsbCxcblx0XHRcdHBvcHVwXHRcdFx0ICA9ICQoICcjYWRkX3RvX2xpc3RfcG9wdXAnICksXG5cdFx0XHRjdXJyZW50X2xpc3RzICAgICA9IEpTT04ucGFyc2UoIHQuYXR0ciggJ2RhdGEtbGlzdC1pZHMnICkgKSxcblx0XHRcdHdpc2hsaXN0X2lkcyAgICAgID0gcG9wdXAuZmluZCggJ2lucHV0Lmxpc3QtaXRlbS1jaGVja2JveDpjaGVja2VkJyApLm1hcChcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMudmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdCkuZ2V0KCksXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3Byb2R1Y3RfdG9fbGlzdF9hY3Rpb24sXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGFkZF90b19saXN0OiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRwcm9kdWN0X3R5cGU6IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0XHRjdXJyZW50X2xpc3RzOiBjdXJyZW50X2xpc3RzLFxuXHRcdFx0XHR3aXNobGlzdF9pZHM6IHdpc2hsaXN0X2lkcyxcblx0XHRcdFx0cmVtb3ZlX2Zyb21fY2FydF9pdGVtOiB3bGZtY19sMTBuLnJlbW92ZV9mcm9tX2NhcnRfaXRlbSxcblx0XHRcdFx0cmVtb3ZlX2Zyb21fY2FydF9hbGw6IHdsZm1jX2wxMG4ucmVtb3ZlX2Zyb21fY2FydF9hbGxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0XHR9O1xuXHRcdGlmICh0eXBlb2YgY2FydF9pdGVtX2tleSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGRhdGEuY2FydF9pdGVtX2tleSA9IGNhcnRfaXRlbV9rZXk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygc2F2ZV9jYXJ0ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0ZGF0YS5zYXZlX2NhcnQgPSBzYXZlX2NhcnQ7XG5cdFx0fVxuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19hZGRfdG9fbXVsdGlfbGlzdF9kYXRhJywgW3QsIGRhdGFdICkpIHtcblx0XHRcdGRhdGEgPSBmaWx0ZXJlZF9kYXRhO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyZW50X3Byb2R1Y3RfZm9ybTtcblxuXHRcdGlmICggJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5sZW5ndGggICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJykubGVuZ3RoICkge1xuXG5cdFx0XHRsZXQgYnV0dG9uID0gJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpO1xuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSBidXR0b24uY2xvc2VzdCgnZm9ybScpLmVxKCAwICk7XG5cblx0XHR9XG5cblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRpZiAoICB0eXBlb2YgY3VycmVudF9wcm9kdWN0X2Zvcm0gIT09ICd1bmRlZmluZWQnICYmIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmxlbmd0aCA+IDApIHtcblx0XHRcdC8qY3VycmVudF9wcm9kdWN0X2Zvcm0uZmluZCggXCJpbnB1dFtuYW1lPSdhZGQtdG8tY2FydCddXCIgKS5hdHRyKCBcImRpc2FibGVkXCIsdHJ1ZSApO1xuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0uZmluZCggXCJpbnB1dFtuYW1lPSdhZGQtdG8tY2FydCddXCIgKS5yZW1vdmVBdHRyKCBcImRpc2FibGVkXCIgKTsqL1xuXHRcdFx0Zm9ybURhdGEgPSBuZXcgRm9ybURhdGEoIGN1cnJlbnRfcHJvZHVjdF9mb3JtLmdldCggMCApICk7XG5cdFx0XHRmb3JtRGF0YS5kZWxldGUoICdhZGQtdG8tY2FydCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IGFkZF90b19jYXJ0X2xpbmsgPSB0LmNsb3Nlc3QoICcucHJvZHVjdC5wb3N0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCApLmZpbmQoICcuYWRkX3RvX2NhcnRfYnV0dG9uJyApO1xuXHRcdFx0aWYgKCBhZGRfdG9fY2FydF9saW5rLmxlbmd0aCApIHtcblx0XHRcdFx0ZGF0YS5xdWFudGl0eSA9IGFkZF90b19jYXJ0X2xpbmsuYXR0ciggJ2RhdGEtcXVhbnRpdHknICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JC5lYWNoKFxuXHRcdFx0ZGF0YSxcblx0XHRcdGZ1bmN0aW9uKGtleSx2YWx1ZU9iail7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCgga2V5ICwgdHlwZW9mIHZhbHVlT2JqID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KCB2YWx1ZU9iaiApIDogdmFsdWVPYmogKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGpRdWVyeSggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICd3bGZtY19hZGRpbmdfdG9fbXVsdGlfbGlzdCcgKTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4ubXVsdGlfbGlzdF9hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0Ly9kYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcblx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAocmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZS51cGRhdGVfY2FydCApICkge1xuXHRcdFx0XHRcdFx0XHQkKGRvY3VtZW50KS50cmlnZ2VyKCd3Y191cGRhdGVfY2FydCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgcmVzcG9uc2UuZXhpc3RzICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlLmV4aXN0cyApICkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlLmV4aXN0cyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXG5cdFx0XHRcdFx0XHRwb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cblx0XHRcdFx0XHRcdGlmIChzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHdsZm1jX2wxMG4ubGFiZWxzLm11bHRpX2xpc3Rfc2F2ZWRfdGV4dCApICkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcyggd2xmbWNfbDEwbi5sYWJlbHMubXVsdGlfbGlzdF9zYXZlZF90ZXh0ICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoICggcmVzcG9uc2UuZGVmYXVsdF93aXNobGlzdF9pZCAmJiByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkICE9PSAnZmFsc2UnICkgfHwgKCByZXNwb25zZS5kZWZhdWx0X3dpc2hsaXN0X2lkICYmIHJlc3BvbnNlLmxhc3RfbGlzdF9pZCAmJiAgcmVzcG9uc2UuZGVmYXVsdF93aXNobGlzdF9pZCA9PT0gcmVzcG9uc2UubGFzdF9saXN0X2lkICkgKSB7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9hdXRvbWF0aW9ucyggcHJvZHVjdF9pZCwgcmVzcG9uc2UuZGVmYXVsdF93aXNobGlzdF9pZCwgcmVzcG9uc2UuY3VzdG9tZXJfaWQsICd3aXNobGlzdCcsIHJlc3BvbnNlLmxvYWRfYXV0b21hdGlvbl9ub25jZSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggcmVzcG9uc2UubGFzdF9saXN0X2lkICYmIHJlc3BvbnNlLmxhc3RfbGlzdF9pZCAhPT0gJ2ZhbHNlJyApIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2F1dG9tYXRpb25zKCBwcm9kdWN0X2lkLCByZXNwb25zZS5sYXN0X2xpc3RfaWQsIHJlc3BvbnNlLmN1c3RvbWVyX2lkLCAnbGlzdHMnLCByZXNwb25zZS5sb2FkX2F1dG9tYXRpb25fbm9uY2UgKTtcblx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0XHQvKmlmICh0eXBlb2YgcmVzcG9uc2UuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggcmVzcG9uc2UuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZS5tZXNzYWdlICkgJiYgcmVzcG9uc2VfcmVzdWx0ICE9PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19tb3ZlX3RvX2xpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGl0ZW1faWRzICAgICAgICAgID0gdC5hdHRyKCAnZGF0YS1pdGVtLWlkcycgKSxcblx0XHRcdGZpbHRlcmVkX2RhdGEgICAgID0gbnVsbCxcblx0XHRcdHBvcHVwXHRcdFx0ICA9ICQoICcjbW92ZV9wb3B1cCcgKSxcblx0XHRcdGN1cnJlbnRfbGlzdCAgICAgID0gdC5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkICAgICAgPSBwb3B1cC5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94OmNoZWNrZWQnICkudmFsKCksXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiAgd2xmbWNfbDEwbi5hY3Rpb25zLm1vdmVfdG9fYW5vdGhlcl9saXN0LFxuXHRcdFx0XHRub25jZTogJCggJyN3bGZtYy13aXNobGlzdC1mb3JtIHRhYmxlLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0aXRlbV9pZHM6IGl0ZW1faWRzLFxuXHRcdFx0XHRjdXJyZW50X2xpc3Q6IGN1cnJlbnRfbGlzdCxcblx0XHRcdFx0ZGVzdGluYXRpb25fd2lzaGxpc3RfaWQ6IHdpc2hsaXN0X2lkLFxuXHRcdFx0fTtcblxuXHRcdGlmKCBkYXRhLmN1cnJlbnRfbGlzdCA9PT0gJycgfHwgZGF0YS5kZXN0aW5hdGlvbl93aXNobGlzdF9pZCA9PT0gJycgfHwgZGF0YS5pdGVtX2lkcyA9PT0gJycgKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBhbGxvdyB0aGlyZCBwYXJ0eSBjb2RlIHRvIGZpbHRlciBkYXRhLlxuXHRcdGlmIChmaWx0ZXJlZF9kYXRhID09PSAkKCBkb2N1bWVudCApLnRyaWdnZXJIYW5kbGVyKCAnd2xmbWNfbW92ZV90b19saXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX21lc3NhZ2UgPSB3bGZtY19sMTBuLmxhYmVscy5tdWx0aV9saXN0X3N1Y2Nlc3NmdWxseV9tb3ZlX21lc3NhZ2UucmVwbGFjZSggJ3t3aXNobGlzdF9uYW1lfScsIHJlc3BvbnNlLndpc2hsaXN0X25hbWUgKTtcblxuXHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlX3Jlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygnJywgZnVuY3Rpb24oc2hvd190b2FzdCwgcmVzcG9uc2VfbWVzc2FnZSl7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cCcgKS5wb3B1cCggJ2hpZGUnICk7XG5cdFx0XHRcdFx0XHRcdCQoICcjbW92ZV9wb3B1cF9iYWNrZ3JvdW5kJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnI21vdmVfcG9wdXBfd3JhcHBlcicgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIFtzaG93X3RvYXN0LCByZXNwb25zZV9tZXNzYWdlIF0pO1xuXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZV9yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdHBvcHVwLnBvcHVwKCAnaGlkZScgKTtcblxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19jb3B5X3RvX2xpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGl0ZW1faWRzICAgICAgICAgID0gdC5hdHRyKCAnZGF0YS1pdGVtLWlkcycgKSxcblx0XHRcdGZpbHRlcmVkX2RhdGEgICAgID0gbnVsbCxcblx0XHRcdHBvcHVwXHRcdFx0ICA9ICQoICcjY29weV9wb3B1cCcgKSxcblx0XHRcdGN1cnJlbnRfbGlzdCAgICAgID0gdC5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkICAgICAgPSBwb3B1cC5maW5kKCAnaW5wdXQubGlzdC1pdGVtLWNoZWNrYm94OmNoZWNrZWQnICkudmFsKCksXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiAgd2xmbWNfbDEwbi5hY3Rpb25zLmNvcHlfdG9fYW5vdGhlcl9saXN0LFxuXHRcdFx0XHRub25jZTogJCggJyN3bGZtYy13aXNobGlzdC1mb3JtIHRhYmxlLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0aXRlbV9pZHM6IGl0ZW1faWRzLFxuXHRcdFx0XHRjdXJyZW50X2xpc3Q6IGN1cnJlbnRfbGlzdCxcblx0XHRcdFx0d2lzaGxpc3Q6IHdpc2hsaXN0X2lkLFxuXHRcdFx0fTtcblxuXHRcdGlmKCBkYXRhLmN1cnJlbnRfbGlzdCA9PT0gJycgfHwgZGF0YS5kZXN0aW5hdGlvbl93aXNobGlzdF9pZCA9PT0gJycgfHwgZGF0YS5pdGVtX2lkcyA9PT0gJycgKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBhbGxvdyB0aGlyZCBwYXJ0eSBjb2RlIHRvIGZpbHRlciBkYXRhLlxuXHRcdGlmIChmaWx0ZXJlZF9kYXRhID09PSAkKCBkb2N1bWVudCApLnRyaWdnZXJIYW5kbGVyKCAnd2xmbWNfY29weV90b19saXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHNob3dfdG9hc3QgICAgICAgPSB0cnVlO1xuXG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX21lc3NhZ2UgPSB3bGZtY19sMTBuLmxhYmVscy5zdWNjZXNzZnVsbHlfY29weV9tZXNzYWdlLnJlcGxhY2UoICd7d2lzaGxpc3RfbmFtZX0nLCByZXNwb25zZS53aXNobGlzdF9uYW1lICk7XG5cblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZV9yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoJycsIGZ1bmN0aW9uKHNob3dfdG9hc3QsIHJlc3BvbnNlX21lc3NhZ2Upe1xuXHRcdFx0XHRcdFx0XHQkKCAnI2NvcHlfcG9wdXBfYmFja2dyb3VuZCcgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0JCggJyNjb3B5X3BvcHVwX3dyYXBwZXInICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdGlmIChzaG93X3RvYXN0ICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlX21lc3NhZ2UgKSApIHtcblx0XHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCBbc2hvd190b2FzdCwgcmVzcG9uc2VfbWVzc2FnZSBdKTtcblxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggISAkLmZuLldMRk1DLmlzVHJ1ZSggcmVzcG9uc2VfcmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHRwb3B1cC5wb3B1cCggJ2hpZGUnICk7XG5cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfY29weV90b19kZWZhdWx0X2xpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGl0ZW1faWRzICAgICAgICAgID0gdC5hdHRyKCAnZGF0YS1pdGVtLWlkJyApLFxuXHRcdFx0ZmlsdGVyZWRfZGF0YSAgICAgPSBudWxsLFxuXHRcdFx0Y3VycmVudF9saXN0ICAgICAgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogIHdsZm1jX2wxMG4uYWN0aW9ucy5jb3B5X3RvX2Fub3RoZXJfbGlzdCxcblx0XHRcdFx0bm9uY2U6ICQoICcjd2xmbWMtd2lzaGxpc3QtZm9ybSB0YWJsZS53bGZtYy13aXNobGlzdC10YWJsZScgKS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGl0ZW1faWRzOiBpdGVtX2lkcyxcblx0XHRcdFx0d2lzaGxpc3Q6ICdkZWZhdWx0Jyxcblx0XHRcdFx0Y3VycmVudF9saXN0OiBjdXJyZW50X2xpc3QsXG5cdFx0XHR9O1xuXG5cdFx0aWYoIGRhdGEuY3VycmVudF9saXN0ID09PSAnJyB8fCBkYXRhLml0ZW1faWRzID09PSAnJyApe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19jb3B5X3RvX2RlZmF1bHRfbGlzdF9kYXRhJywgW3QsIGRhdGFdICkpIHtcblx0XHRcdGRhdGEgPSBmaWx0ZXJlZF9kYXRhO1xuXHRcdH1cblxuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hZG1pbl91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3BvbnNlX3Jlc3VsdCAgPSByZXNwb25zZS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblxuXHRcdFx0XHRcdHZhciByZXNwb25zZV9tZXNzYWdlID0gd2xmbWNfbDEwbi5sYWJlbHMuc3VjY2Vzc2Z1bGx5X2NvcHlfbWVzc2FnZS5yZXBsYWNlKCAne3dpc2hsaXN0X25hbWV9JywgcmVzcG9uc2Uud2lzaGxpc3RfbmFtZSApO1xuXG5cdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggcmVzcG9uc2VfcmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCAnbGlzdF9jb3VudGVyJyApO1xuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2VfbWVzc2FnZSApICkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc1RydWUoIHJlc3BvbnNlX3Jlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1tdWx0aS1saXN0LWJ0bi1sb2dpbi1uZWVkJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLm11bHRpX2xpc3RfbG9naW5fbmVlZCApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuXG5mdW5jdGlvbiBXbGZtY0NoZWNrYm94TGlzdHNDaGFuZ2UoKSB7XG5cdGxldCBwb3B1cCA9ICQoICcjYWRkX3RvX2xpc3RfcG9wdXAnICk7XG5cdGNvbnN0IHN1Ym1pdEJ0biA9IHBvcHVwLmZpbmQoJy53bGZtY19hZGRfdG9fbXVsdGlfbGlzdCcpO1xuXHRjb25zdCBjaGVja2JveGVzID0gcG9wdXAuZmluZCgnLmxpc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cdGNvbnN0IGhhc0NoYW5nZWQgPSBjaGVja2JveGVzLnRvQXJyYXkoKS5zb21lKChjYiwgaW5kZXgpID0+ICQoY2IpLnByb3AoJ2NoZWNrZWQnKSAhPT0gUHJldkxpc3RzU3RhdGVbaW5kZXhdKTtcblx0c3VibWl0QnRuLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdGlmIChoYXNDaGFuZ2VkKSB7XG5cdFx0c3VibWl0QnRuLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHR9XG59XG47XG5cdFx0XHRcdC8qID09PSBTQVZFIEZPUiBMQVRFUiA9PT0gKi9cblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1saXN0IC5yZW1vdmUtYWxsLWZyb20tc2F2ZS1mb3ItbGF0ZXItYnRuJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0bGV0IHF1YW50aXR5X2ZpZWxkcyA9ICQoIHRoaXMgKS5jbG9zZXN0KCdmb3JtJykuZmluZCgnaW5wdXQucXR5Jyk7XG5cdFx0aWYgKCBxdWFudGl0eV9maWVsZHMubGVuZ3RoID4gMCApIHtcblx0XHRcdHF1YW50aXR5X2ZpZWxkcy5hdHRyKCBcImRpc2FibGVkXCIsdHJ1ZSApO1xuXHRcdH1cblx0fVxuKTtcblxuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b19zYXZlX2Zvcl9sYXRlcicsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIHQgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRjYXJ0X2l0ZW1fa2V5ID0gdC5hdHRyKCAnZGF0YS1jYXJ0X2l0ZW1fa2V5JyApO1xuXHRcdCQuZm4uV0xGTUMuYWRkX3RvX3NhdmVfZm9yX2xhdGVyKCBjYXJ0X2l0ZW1fa2V5LCB0ICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX3JlbW92ZV9mcm9tX3NhdmVfZm9yX2xhdGVyJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciB0ICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRyb3cgICAgICAgICAgPSB0LnBhcmVudHMoICdbZGF0YS1pdGVtLWlkXScgKSxcblx0XHRcdGRhdGFfaXRlbV9pZCA9IHJvdy5kYXRhKCAnaXRlbS1pZCcgKSxcblx0XHRcdGRhdGEgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMucmVtb3ZlX2Zyb21fc2F2ZV9mb3JfbGF0ZXJfYWN0aW9uLFxuXHRcdFx0XHRub25jZTogd2xmbWNfbDEwbi5hamF4X25vbmNlLnJlbW92ZV9mcm9tX3NhdmVfZm9yX2xhdGVyX25vbmNlLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV9zYXZlX2Zvcl9sYXRlcjogZGF0YV9pdGVtX2lkLFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKClcblx0XHRcdH07XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5zYXZlX2Zvcl9sYXRlcl9hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHQvKmlmICh0eXBlb2YgZGF0YS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdGlmICggZGF0YS5jb3VudCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXRhYnMtd3JhcHBlcicgKS5hdHRyKCAnZGF0YS1jb3VudCcsIGRhdGEuY291bnQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICd0cnVlJyA9PT0gZGF0YS5yZXN1bHQgJiYgJycgIT09ICQudHJpbSggd2xmbWNfbDEwbi5sYWJlbHMuc2ZsX3Byb2R1Y3RfcmVtb3ZlZF90ZXh0ICkpIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMuc2ZsX3Byb2R1Y3RfcmVtb3ZlZF90ZXh0ICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBkYXRhLmNvdW50ICE9PSAndW5kZWZpbmVkJyAmJiAwID09PSBkYXRhLmNvdW50ICkge1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZS13cmFwcGVyJyApLmVtcHR5KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cblx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3NhdmVfZm9yX2xhdGVyJywgW3QsIHJvdyAsIGRhdGFdICk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX3NhdmVfZm9yX2xhdGVyX2FqYXhfYWRkX3RvX2NhcnQnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGl0ZW1faWQgPSB0LmF0dHIoICdkYXRhLWl0ZW1faWQnICksXG5cdFx0XHRkYXRhICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5zYXZlX2Zvcl9sYXRlcl9hZGRfdG9fY2FydF9hY3Rpb24sXG5cdFx0XHRcdG5vbmNlOiB3bGZtY19sMTBuLmFqYXhfbm9uY2UuYWRkX3RvX2NhcnRfZnJvbV9zZmxfbm9uY2UsXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGl0ZW1faWQ6IGl0ZW1faWQsXG5cdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoKVxuXHRcdFx0fTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dC5yZW1vdmVDbGFzcyggJ2FkZGVkJyApO1xuXHRcdHQuYWRkQ2xhc3MoICdsb2FkaW5nJyApO1xuXG5cdFx0Ly8gQWxsb3cgM3JkIHBhcnRpZXMgdG8gdmFsaWRhdGUgYW5kIHF1aXQgZWFybHkuXG5cdFx0aWYgKCBmYWxzZSA9PT0gJCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXJIYW5kbGVyKCAnc2hvdWxkX3NlbmRfYWpheF9yZXF1ZXN0LmFkZGluZ190b19jYXJ0JywgWyB0IF0gKSApIHtcblx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWpheF9yZXF1ZXN0X25vdF9zZW50LmFkZGluZ190b19jYXJ0JywgWyBmYWxzZSwgZmFsc2UsIHQgXSApO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkaW5nX3RvX2NhcnQnLCBbIHQsIHt9IF0gKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLnNhdmVfZm9yX2xhdGVyX2FqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0Ly9kYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAoICEgcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiByZXNwb25zZS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnJlcGxhY2VfZnJhZ21lbnRzKCByZXNwb25zZS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZS5lcnJvciApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgJCggJ2Zvcm0ud29vY29tbWVyY2UtY2FydC1mb3JtJyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiByZXNwb25zZS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnICYmIHJlc3BvbnNlLmZyYWdtZW50cy53bGZtY19zYXZlX2Zvcl9sYXRlcl9jb3VudCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmF0dHIoICdkYXRhLWNvdW50JywgcmVzcG9uc2UuZnJhZ21lbnRzLndsZm1jX3NhdmVfZm9yX2xhdGVyX2NvdW50ICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlcignd2NfZnJhZ21lbnRfcmVmcmVzaCcpO1xuXHRcdFx0XHRcdFx0Ly8gVHJpZ2dlciBldmVudCBzbyB0aGVtZXMgY2FuIHJlZnJlc2ggb3RoZXIgYXJlYXMuXG5cdFx0XHRcdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FkZGVkX3RvX2NhcnQnLCBbIHJlc3BvbnNlLmZyYWdtZW50cywgcmVzcG9uc2UuY2FydF9oYXNoLCB0IF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0JyNhZGRfdG9fc2F2ZV9mb3JfbGF0ZXJfcG9wdXAgI2FkZF9pdGVtJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnI2FkZF90b19zYXZlX2Zvcl9sYXRlcl9wb3B1cCcgKS5wb3B1cCggJ2hpZGUnICk7XG5cdFx0dmFyIGNhcnRfaXRlbV9rZXkgPSAkLmZuLldMRk1DLmdldFVybFBhcmFtZXRlciggcmVtb3ZlX2l0ZW1fdXJsLCAncmVtb3ZlX2l0ZW0nICk7XG5cdFx0dmFyIHJvdyAgICAgICAgICAgPSAkKCAnYVtocmVmPVwiJyArIHJlbW92ZV9pdGVtX3VybCArICdcIl0nICkuY2xvc2VzdCggJ3RyJyApO1xuXHRcdCQuZm4uV0xGTUMuYWRkX3RvX3NhdmVfZm9yX2xhdGVyKCBjYXJ0X2l0ZW1fa2V5LCByb3cgKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcbmIub24oXG5cdCdjbGljaycsXG5cdCcjYWRkX3RvX3NhdmVfZm9yX2xhdGVyX3BvcHVwICNyZW1vdmVfaXRlbScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJyNhZGRfdG9fc2F2ZV9mb3JfbGF0ZXJfcG9wdXAnICkucG9wdXAoICdoaWRlJyApO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVtb3ZlX2l0ZW1fdXJsO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1zZmwtYnRuLWxvZ2luLW5lZWQnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMuc2ZsX2xvZ2luX25lZWQgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbi8qID09PSBBQ0NPUkRJT04gPT09ICovXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWFjY29yZGlvbi1oZWFkZXInLFxuXHRmdW5jdGlvbiggZXYgKSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRpZiAoICEgJCggdGhpcyApLmhhc0NsYXNzKCAnYWN0aXZlJyApICkge1xuXHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHQkKCB0aGlzICkubmV4dCggXCIud2xmbWMtYWNjb3JkaW9uLXBhbmVsXCIgKS5zbGlkZURvd24oKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdCQoIHRoaXMgKS5uZXh0KCBcIi53bGZtYy1hY2NvcmRpb24tcGFuZWxcIiApLnNsaWRlVXAoKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG4vKiA9PT0gQ0xPU0UgTk9USUNFID09PSAqL1xuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1zYXZlLWZvci1sYXRlci1mb3JtIGEud2xmbWMtY2xvc2Utbm90aWNlJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRpZiAoICEgJC5mbi5XTEZNQy5pc19jb29raWVfZW5hYmxlZCgpKSB7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQkLmZuLldMRk1DLnNldENvb2tpZSggJ3dsZm1jX3NhdmVfZm9yX2xhdGVyX25vdGljZScsIHRydWUgKTtcblxuXHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLW5vdGljZS13cmFwcGVyJyApLmFuaW1hdGUoIHtvcGFjaXR5OjAgfSwgXCJzbG93XCIgKS5yZW1vdmUoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcbjtcblx0XHRcdFx0XG5cbnQub24oXG5cdCdhZGRpbmdfdG9fY2FydCcsXG5cdCdib2R5Jyxcblx0ZnVuY3Rpb24gKGV2LCBidXR0b24sIGRhdGEpIHtcblx0XHRpZiAodHlwZW9mIGJ1dHRvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRhdGEgIT09ICd1bmRlZmluZWQnICYmIGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5sZW5ndGgpIHtcblx0XHRcdGRhdGEud2lzaGxpc3RfaWQgICA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnaWQnICk7XG5cdFx0XHRkYXRhLndpc2hsaXN0X3R5cGUgPSBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZGF0YSggJ3dpc2hsaXN0LXR5cGUnICk7XG5cdFx0XHRkYXRhLmN1c3RvbWVyX2lkICAgPSBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZGF0YSggJ2N1c3RvbWVyLWlkJyApO1xuXHRcdFx0ZGF0YS5pc19vd25lciAgICAgID0gYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmRhdGEoICdpcy1vd25lcicgKTtcblx0XHRcdHR5cGVvZiB3Y19hZGRfdG9fY2FydF9wYXJhbXMgIT09ICd1bmRlZmluZWQnICYmICggd2NfYWRkX3RvX2NhcnRfcGFyYW1zLmNhcnRfcmVkaXJlY3RfYWZ0ZXJfYWRkID0gd2xmbWNfbDEwbi5yZWRpcmVjdF90b19jYXJ0ICk7XG5cblx0XHRcdC8qbGV0IHByb2R1Y3RfbWV0YSAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGJ1dHRvbi5kYXRhKCAnd2xmbWNfcHJvZHVjdF9tZXRhJyApO1xuXHRcdFx0aWYgKHByb2R1Y3RfbWV0YSkge1xuXHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0cHJvZHVjdF9tZXRhLFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChrLHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRkYXRhW2tdID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRkYXRhLndsZm1jX3Byb2R1Y3RfbWV0YSA9IHRydWU7XG5cdFx0XHR9Ki9cblx0XHR9XG5cdH1cbik7XG5cbnQub24oXG5cdCdhZGRlZF90b19jYXJ0Jyxcblx0J2JvZHknLFxuXHRmdW5jdGlvbiAoZXYsIGZyYWdtZW50cywgY2FydGhhc2gsIGJ1dHRvbikge1xuXHRcdGlmICh0eXBlb2YgYnV0dG9uICE9PSAndW5kZWZpbmVkJyAmJiBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZScgKS5sZW5ndGgpIHtcblx0XHRcdHR5cGVvZiB3Y19hZGRfdG9fY2FydF9wYXJhbXMgIT09ICd1bmRlZmluZWQnICYmICggd2NfYWRkX3RvX2NhcnRfcGFyYW1zLmNhcnRfcmVkaXJlY3RfYWZ0ZXJfYWRkID0gY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgKTtcblxuXHRcdFx0dmFyIHRyICAgICBcdFx0ICAgPSBidXR0b24uY2xvc2VzdCggJ1tkYXRhLXJvdy1pZF0nICksXG5cdFx0XHRcdHRhYmxlICBcdFx0ICAgPSB0ci5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApLFxuXHRcdFx0XHRvcHRpb25zXHRcdCAgID0gdGFibGUuZGF0YSggJ2ZyYWdtZW50LW9wdGlvbnMnICksXG5cdFx0XHRcdGRhdGFfcm93X2lkICAgID0gdHIuZGF0YSggJ3Jvdy1pZCcgKSxcblx0XHRcdFx0d2lzaGxpc3RfaWQgICAgPSB0YWJsZS5maW5kKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICdpZCcgKSxcblx0XHRcdFx0d2lzaGxpc3RfdG9rZW4gPSB0YWJsZS5maW5kKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICd0b2tlbicgKSxcblx0XHRcdFx0bGlzdF90eXBlICAgICAgPSB0YWJsZS5maW5kKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmRhdGEoICd3aXNobGlzdC10eXBlJyApLFxuXHRcdFx0XHRyZWxvYWRfZnJhZ21lbnQgPSBmYWxzZTtcblxuXHRcdFx0YnV0dG9uLnJlbW92ZUNsYXNzKCAnYWRkZWQnICk7XG5cdFx0XHR0ci5maW5kKCAnLmFkZGVkX3RvX2NhcnQnICkucmVtb3ZlKCk7XG5cdFx0XHRpZiAod2xmbWNfbDEwbi5yZW1vdmVfZnJvbV93aXNobGlzdF9hZnRlcl9hZGRfdG9fY2FydCAmJiBvcHRpb25zLmlzX3VzZXJfb3duZXIpIHtcblxuXHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBkYXRhX3Jvd19pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cblx0XHRcdFx0aWYgKCAnd2lzaGxpc3QnID09PSBsaXN0X3R5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dmFyIHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX2xpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gcHJvZHVjdF9jb3VudCAtIDE7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fbGlzdFtpXS5wcm9kdWN0X2lkID09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblxuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBkYXRhX3Jvd19pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAucHJvZHVjdHMtY291bnRlci1udW1iZXInICkudGV4dCggcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCApO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdpc2hsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCApO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3Qud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBkYXRhX3Jvd19pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0aWYgKCggISBwcm9kdWN0X2luX2xpc3QubGVuZ3RoIHx8IHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggPT09IDAgfHwgISB0YWJsZS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5sZW5ndGgpKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUtd3JhcHBlcicgKS5lbXB0eSgpO1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnJlbG9hZF9mcmFnbWVudCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCAnd2FpdGxpc3QnID09PSBsaXN0X3R5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRsZXQgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl93YWl0bGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl93YWl0bGlzdFtpXS53aXNobGlzdF9pZCA9PSB3aXNobGlzdF9pZCAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLnByb2R1Y3RfaWQgPT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl93YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIGRhdGFfcm93X2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyIC5wcm9kdWN0cy1jb3VudGVyLW51bWJlcicgKS50ZXh0KCBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aCApO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXIgLnRvdGFsLXByb2R1Y3RzIC53bGZtYy10b3RhbC1jb3VudCcgKS50ZXh0KCBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aCApO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1hZGQtdG8td2FpdGxpc3Qud2xmbWMtYWRkLXRvLXdhaXRsaXN0LScgKyBkYXRhX3Jvd19pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoICggISBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aCB8fCBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aCA9PT0gMCB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13aXNobGlzdC10YWJsZS13cmFwcGVyJyApLmVtcHR5KCk7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVsb2FkX2ZyYWdtZW50ID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoICdsaXN0cycgPT09IGxpc3RfdHlwZSApIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLnJlbG9hZF9mcmFnbWVudCA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHJlbG9hZF9mcmFnbWVudCApIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGJ1dHRvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkubGVuZ3RoKSB7XG5cdFx0XHR2YXIgdHIgICAgICAgICAgID0gYnV0dG9uLmNsb3Nlc3QoICdbZGF0YS1pdGVtLWlkXScgKSxcblx0XHRcdFx0dGFibGUgICAgICAgID0gdHIuY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC1mcmFnbWVudCcgKSxcblx0XHRcdFx0b3B0aW9ucyAgICAgID0gdGFibGUuZGF0YSggJ2ZyYWdtZW50LW9wdGlvbnMnICksXG5cdFx0XHRcdGRhdGFfaXRlbV9pZCA9IHRyLmRhdGEoICdpdGVtLWlkJyApO1xuXHRcdFx0YnV0dG9uLnJlbW92ZUNsYXNzKCAnYWRkZWQnICk7XG5cdFx0XHR0ci5maW5kKCAnLmFkZGVkX3RvX2NhcnQnICkucmVtb3ZlKCk7XG5cdFx0XHRpZiAoIG9wdGlvbnMuaXNfdXNlcl9vd25lcikge1xuXHRcdFx0XHQkKCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLWZvcm0nICkuZmluZCggJ1tkYXRhLWl0ZW0taWQ9XCInICsgZGF0YV9pdGVtX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAhICQoICcud2xmbWMtc2F2ZS1mb3ItbGF0ZXItaXRlbXMtd3JhcHBlciAuc2F2ZS1mb3ItbGF0ZXItaXRlbXMtd3JhcHBlciB0cicgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JCggJy53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZS13cmFwcGVyJyApLmVtcHR5KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbik7XG5cbnQub24oXG5cdCdhZGRfdG9fY2FydF9tZXNzYWdlJyxcblx0J2JvZHknLFxuXHRmdW5jdGlvbiAoIGUsIG1lc3NhZ2UsIHQgKSB7XG5cdFx0dmFyIHdyYXBwZXIgPSAkKCAnLndvb2NvbW1lcmNlLW5vdGljZXMtd3JhcHBlciAud29vY29tbWVyY2UtZXJyb3IsLndvb2NvbW1lcmNlLW5vdGljZXMtd3JhcHBlciAud29vY29tbWVyY2UtbWVzc2FnZScgKTtcblxuXHRcdHQucmVtb3ZlQ2xhc3MoICdsb2FkaW5nJyApO1xuXHRcdGlmICh3cmFwcGVyLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0JCggJyN3bGZtYy13aXNobGlzdC1mb3JtJyApLnByZXBlbmQoIG1lc3NhZ2UgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d3JhcHBlci5mYWRlT3V0KFxuXHRcdFx0XHQzMDAsXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCgnLndvb2NvbW1lcmNlLW5vdGljZXMtd3JhcHBlcicpLnJlcGxhY2VXaXRoKCBtZXNzYWdlICkuZmFkZUluKCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9XG4pO1xuXG50Lm9uKCAnY2FydF9wYWdlX3JlZnJlc2hlZCcsICdib2R5JywgJC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXggKTtcbjtcblx0XHRcdFx0LyogPT09IERST1BET1dOIENPVU5URVIgPT09ICovXG5cbmlmICggJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8ICh3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gpKSB7XG5cdHZhciB3bGZtY19zd2lwZV90cmlnZ2VyO1xuXHRiLm9uKFxuXHRcdCd0b3VjaHN0YXJ0Jyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIsLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2snLFxuXHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR3bGZtY19zd2lwZV90cmlnZ2VyID0gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXG5cdGIub24oXG5cdFx0J3RvdWNobW92ZScsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyLC53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWNsaWNrJyxcblx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0d2xmbWNfc3dpcGVfdHJpZ2dlciA9IHRydWU7XG5cdFx0fVxuXHQpO1xuXG5cdGIub24oXG5cdFx0J3RvdWNoZW5kJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duLC53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWNsaWNrICAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR2YXIgZWxlbSA9ICQodGhpcykuY2xvc2VzdCgnLndsZm1jLWNvdW50ZXItd3JhcHBlcicpO1xuXHRcdFx0aWYgKGVsZW0uaGFzQ2xhc3MoICd3bGZtYy1maXJzdC10b3VjaCcgKSkge1xuXHRcdFx0XHRpZiAoICEgd2xmbWNfc3dpcGVfdHJpZ2dlcikge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMuaGlkZV9taW5pX3dpc2hsaXN0LmNhbGwoICQoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLCBlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JC5mbi5XTEZNQy5zaG93X21pbmlfd2lzaGxpc3QuY2FsbCggdGhpcywgZSApO1xuXHRcdFx0XHRlbGVtLmFkZENsYXNzKCAnd2xmbWMtZmlyc3QtdG91Y2gnICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGIub24oXG5cdFx0J3RvdWNoZW5kJyxcblx0XHQnOm5vdCgud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3Zlcik6bm90KC53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWNsaWNrKScsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdGlmICgkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmhpZGVfbWluaV93aXNobGlzdC5jYWxsKCAkKCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKSwgZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblx0Ly8gZml4IHVybCBpbiBkcm9wZG93biBpbiBpcGhvbmUgZGV2aWNlc1xuXHRiLm9uKFxuXHRcdCd0b3VjaGVuZCcsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duIGE6bm90KC5yZW1vdmVfZnJvbV93aXNobGlzdCknLFxuXHRcdGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcbn0gZWxzZSB7XG5cdGIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2sgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBlbGVtID0gJCggJy5kcm9wZG93bl8nICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWlkJyApICkgfHwgJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKTtcblx0XHRcdCQuZm4uV0xGTUMuYXBwZW5kdG9Cb2R5KCBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApICk7XG5cdFx0XHQkLmZuLldMRk1DLnByZXBhcmVfbWluaV93aXNobGlzdCggZWxlbSApO1xuXHRcdFx0ZWxlbS50b2dnbGVDbGFzcyggJ2xpc3RzLXNob3cnICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXG5cdHQub24oXG5cdFx0XCJjbGlja1wiLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0Y29uc3QgJHRyaWdnZXIgPSAkKFwiLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2sgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duXCIpO1xuXHRcdFx0aWYgKCR0cmlnZ2VyICE9PSBldi50YXJnZXQgJiYgISAkdHJpZ2dlci5oYXMoIGV2LnRhcmdldCApLmxlbmd0aCkge1xuXHRcdFx0XHQkKCAnLndsZm1jLWNvdW50ZXItZHJvcGRvd24nICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGIub24oXG5cdFx0J21vdXNlb3ZlcicsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyIC53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdCQoIHRoaXMgKS5hZGRDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cdGIub24oXG5cdFx0J21vdXNlb3V0Jyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXItZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcblx0Yi5vbihcblx0XHQnbW91c2VvdmVyJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBlbGVtID0gJCggJy5kcm9wZG93bl8nICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWlkJyApICkgfHwgJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKTtcblx0XHRcdCQoIGVsZW0gKS5hZGRDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHRcdCQuZm4uV0xGTUMuYXBwZW5kdG9Cb2R5KCBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApICk7XG5cdFx0XHQkLmZuLldMRk1DLnByZXBhcmVfbWluaV93aXNobGlzdCggZWxlbSApO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXHRiLm9uKFxuXHRcdCdtb3VzZW91dCcsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgZWxlbSA9ICQoICcuZHJvcGRvd25fJyArICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1pZCcgKSApO1xuXHRcdFx0JCggZWxlbSApLnJlbW92ZUNsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcblxuXHQkKCAnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duJyApLmhvdmVySW50ZW50KFxuXHRcdHtcblx0XHRcdGludGVydmFsOiAwLFxuXHRcdFx0dGltZW91dDogMTAwLFxuXHRcdFx0b3ZlcjogJC5mbi5XTEZNQy5zaG93X21pbmlfd2lzaGxpc3QsXG5cdFx0XHRvdXQ6ICQuZm4uV0xGTUMuaGlkZV9taW5pX3dpc2hsaXN0XG5cdFx0fVxuXHQpO1xufVxuO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9wcmVwYXJlX3F0eV9saW5rcygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF93aXNobGlzdF9wb3B1cCgpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9xdWFudGl0eSgpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9jaGVja2JveF9oYW5kbGluZygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9jb3B5X3dpc2hsaXN0X2xpbmsoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfdG9vbHRpcCgpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9jb21wb25lbnRzKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3BvcHVwcygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9sYXlvdXQoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfZHJhZ19uX2Ryb3AoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmcoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfZHJvcGRvd25fbGlzdHMoKTtcblx0XHRcdH1cblx0XHQpLnRyaWdnZXIoICd3bGZtY19pbml0JyApO1xuXG5cdFx0Ly8gZml4IHdpdGggamV0IHdvbyBidWlsZGVyIHBsdWdpbi5cblxuJCggZG9jdW1lbnQgKVxuXHQub24oICdqZXQtZmlsdGVyLWNvbnRlbnQtcmVuZGVyZWQnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApXG5cdC5vbiggJ2pldC13b28tYnVpbGRlci1jb250ZW50LXJlbmRlcmVkJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKVxuXHQub24oICdqZXQtZW5naW5lL2xpc3RpbmctZ3JpZC9hZnRlci1sb2FkLW1vcmUnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApXG5cdC5vbiggJ2pldC1lbmdpbmUvbGlzdGluZy1ncmlkL2FmdGVyLWxhenktbG9hZCcsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jIClcblx0Lm9uKCAnamV0LWN3LWxvYWRlZCcsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jICk7XG4vLyBsb2FkIGZyYWdtZW50IGZvciBmaXggZmlsdGVyIGV2ZXJ5dGhpbmcgYWpheCByZXNwb25zZS5cbiQoIGRvY3VtZW50ICkucmVhZHkoICQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMgKTtcbi8vIGxvYWQgZnJhZ21lbnQgZm9yIGZpeCBidWcgd2l0aCBhamF4IGZpbHRlciBEZXN0aW55IEVsZW1lbnRzIHBsdWdpblxuJCggZG9jdW1lbnQgKS5vbiggJ2RlQ29udGVudExvYWRlZCcgLCAkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzICk7XG4vLyBmaXggd2FpdGxpc3QgcG9wdXAgYWZ0ZXIgd3BjIGNvbXBvc2l0ZSBwcm9kdWN0IGdhbGxlcnkgbG9hZGVkIGluIHNpbmdsZSBwcm9kdWN0IHBhZ2VcbiQoIGRvY3VtZW50ICkub24oICd3b29jb19nYWxsZXJ5X2xvYWRlZCcsIGZ1bmN0aW9uKCBlLCBwcm9kdWN0X2lkICkge1xuXHRpZiAoIHByb2R1Y3RfaWQgKSB7XG5cdFx0JCgnKltpZF49XCJhZGRfdG9fd2FpdGxpc3RfcG9wdXBfJyArIHByb2R1Y3RfaWQgKyAnX1wiXS5wb3B1cF93cmFwcGVyJykucmVtb3ZlKCk7XG5cdH1cbn0pO1xuO1xuXG5cdFx0XG52YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcblx0ZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0bXV0YXRpb25zLmZvckVhY2goXG5cdFx0XHRmdW5jdGlvbihtdXRhdGlvbikge1xuXHRcdFx0XHRpZiAoICQoICcud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5X193cmFwcGVyIC53bGZtYy10b3Atb2YtaW1hZ2UnICkubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfZml4X29uX2ltYWdlX3NpbmdsZV9wb3NpdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGZpeCB0b3Agb2YgaW1hZ2UgZm9yIHBvd2VyLXBhY2sgc2luZ2xlIHByb2R1Y3QuXG5cdFx0XHRcdGlmICggJCggJy5wcC1zaW5nbGUtcHJvZHVjdCAuZW50cnktc3VtbWFyeSA+IC53bGZtYy10b3Atb2YtaW1hZ2UnICkubGVuZ3RoID4gMCAmJiAkKCAnLnBwLXNpbmdsZS1wcm9kdWN0IC5lbnRyeS1zdW1tYXJ5IC5zaW5nbGUtcHJvZHVjdC1pbWFnZScgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdCQoICcucHAtc2luZ2xlLXByb2R1Y3QnICkuZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJHdsZm1jVG9wT2ZJbWFnZSAgICA9ICQoIHRoaXMgKS5maW5kKCAnLndsZm1jLXRvcC1vZi1pbWFnZScgKTtcblx0XHRcdFx0XHRcdFx0dmFyICRzaW5nbGVQcm9kdWN0SW1hZ2UgPSAkKCB0aGlzICkuZmluZCggJy5zaW5nbGUtcHJvZHVjdC1pbWFnZScgKTtcblx0XHRcdFx0XHRcdFx0aWYgKCAkd2xmbWNUb3BPZkltYWdlLmxlbmd0aCA+IDAgJiYgJHNpbmdsZVByb2R1Y3RJbWFnZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0JHdsZm1jVG9wT2ZJbWFnZS5hcHBlbmRUbyggJHNpbmdsZVByb2R1Y3RJbWFnZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbik7XG5vYnNlcnZlci5vYnNlcnZlKCAkKCAnYm9keScgKVswXSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSApO1xuO1xuXG5cdFx0LyogPT09IERST1BET1dOIENPVU5URVIgPT09ICovXG5cbiQoIHdpbmRvdyApLm9uKFxuXHRcInNjcm9sbCByZXNpemVcIixcblx0ZnVuY3Rpb24oKSB7XG5cdFx0JCggXCIud2xmbWMtY291bnRlci1kcm9wZG93blwiICkuZWFjaChcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkLmZuLldMRk1DLnByZXBhcmVfbWluaV93aXNobGlzdCggJCggdGhpcyApICk7XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuKTtcbjtcblxuXHRcdC8qIFN0b3JhZ2UgSGFuZGxpbmcgKi9cblxudmFyICRzdXBwb3J0c19odG1sNV9zdG9yYWdlID0gdHJ1ZSxcblx0d2lzaGxpc3RfaGFzaF9rZXkgICAgICAgPSB3bGZtY19sMTBuLndpc2hsaXN0X2hhc2hfa2V5LFxuXHRwcm9kdWN0c19oYXNoX2tleSBcdFx0PSB3aXNobGlzdF9oYXNoX2tleSArICdfcHJvZHVjdHMnLFxuXHR3YWl0bGlzdF9oYXNoX2tleSBcdFx0PSB3aXNobGlzdF9oYXNoX2tleSArICdfd2FpdGxpc3QnLFxuXHRsYW5nX2hhc2hfa2V5XHRcdFx0PSB3aXNobGlzdF9oYXNoX2tleSArICdfbGFuZyc7XG5cbnRyeSB7XG5cdCRzdXBwb3J0c19odG1sNV9zdG9yYWdlID0gKCAnc2Vzc2lvblN0b3JhZ2UnIGluIHdpbmRvdyAmJiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgIT09IG51bGwgKTtcblx0d2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oICd3bGZtYycsICd0ZXN0JyApO1xuXHR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSggJ3dsZm1jJyApO1xuXHR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oICd3bGZtYycsICd0ZXN0JyApO1xuXHR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oICd3bGZtYycgKTtcbn0gY2F0Y2ggKCBlcnIgKSB7XG5cdCRzdXBwb3J0c19odG1sNV9zdG9yYWdlID0gZmFsc2U7XG59XG5cbmlmICggd2xmbWNfbDEwbi5pc19jYWNoZV9lbmFibGVkICYmIHdsZm1jX2wxMG4uaXNfcGFnZV9jYWNoZV9lbmFibGVkICkge1xuXHQkLmZuLldMRk1DLnRhYmxlX2Jsb2NrKCk7XG59XG5cbi8qIFdpc2hsaXN0IEhhbmRsaW5nICovXG5pZiAoICRzdXBwb3J0c19odG1sNV9zdG9yYWdlICkge1xuXG5cdC8vIFJlZnJlc2ggd2hlbiBzdG9yYWdlIGNoYW5nZXMgaW4gYW5vdGhlciB0YWIuXG5cdCQoIHdpbmRvdyApLm9uKFxuXHRcdCdzdG9yYWdlIG9uc3RvcmFnZScsXG5cdFx0ZnVuY3Rpb24gKCBlICkge1xuXHRcdFx0aWYgKCAoIHByb2R1Y3RzX2hhc2hfa2V5ID09PSBlLm9yaWdpbmFsRXZlbnQua2V5ICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICE9PSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICkgfHxcblx0XHRcdFx0KCB3YWl0bGlzdF9oYXNoX2tleSA9PT0gZS5vcmlnaW5hbEV2ZW50LmtleSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgKSAhPT0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggd2FpdGxpc3RfaGFzaF9rZXkgKSApICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdC8vIFJlZnJlc2ggd2hlbiBwYWdlIGlzIHNob3duIGFmdGVyIGJhY2sgYnV0dG9uIChzYWZhcmkpLlxuXHQkKCB3aW5kb3cgKS5vbihcblx0XHQncGFnZXNob3cnICxcblx0XHRmdW5jdGlvbiggZSApIHtcblx0XHRcdGlmICggZS5vcmlnaW5hbEV2ZW50LnBlcnNpc3RlZCApIHtcblx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHR0cnkge1xuXG5cdFx0aWYgKCB3bGZtY19sMTBuLmlzX2NhY2hlX2VuYWJsZWQgKSB7XG5cdFx0XHR0aHJvdyAnTmVlZCBVcGRhdGUgd2lzaGxpc3QgZGF0YSc7XG5cdFx0fVxuXHRcdGlmICggd2xmbWNfbDEwbi51cGRhdGVfd2lzaGxpc3RzX2RhdGEgfHwgKCBudWxsICE9PSBsYW5nICYmIGxhbmcgIT09IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBsYW5nX2hhc2hfa2V5ICkgKSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXkgKSAhPT0gSlNPTi5zdHJpbmdpZnkoIHdpc2hsaXN0X2l0ZW1zICkgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5ICkgIT09IEpTT04uc3RyaW5naWZ5KCB3YWl0bGlzdF9pdGVtcyApICkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5LCAnJyApO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5LCAnJyApO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oIGxhbmdfaGFzaF9rZXksICcnICk7XG5cdFx0XHQkLmZuLldMRk1DLmNoZWNrX3Byb2R1Y3RzKCB3aXNobGlzdF9pdGVtcyApO1xuXHRcdFx0JC5mbi5XTEZNQy5jaGVja193YWl0bGlzdF9wcm9kdWN0cyggd2FpdGxpc3RfaXRlbXMgKTtcblx0XHRcdHRocm93ICdOZWVkIFVwZGF0ZSB3aXNobGlzdCBkYXRhJztcblx0XHR9XG5cblx0XHRpZiAoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICkge1xuXHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXkgKSApO1xuXHRcdFx0aWYgKCdvYmplY3QnID09PSBfdHlwZW9mKCBkYXRhICkgJiYgbnVsbCAhPT0gZGF0YSApIHtcblx0XHRcdFx0JC5mbi5XTEZNQy5jaGVja19wcm9kdWN0cyggZGF0YSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHdhaXRsaXN0X2hhc2hfa2V5ICkgKSB7XG5cdFx0XHR2YXIgZGF0YSA9IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCB3YWl0bGlzdF9oYXNoX2tleSApICk7XG5cdFx0XHRpZiAoJ29iamVjdCcgPT09IF90eXBlb2YoIGRhdGEgKSAmJiBudWxsICE9PSBkYXRhICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmNoZWNrX3dhaXRsaXN0X3Byb2R1Y3RzKCBkYXRhICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JC5mbi5XTEZNQy51bmJsb2NrKCAkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLXdyYXBwZXIsIC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZS13cmFwcGVyJyApICk7XG5cblx0XHQkKCAnI3dsZm1jLWxpc3RzLCN3bGZtYy13aXNobGlzdC1mb3JtJyApLmFkZENsYXNzKCAnb24tZmlyc3QtbG9hZCcgKTtcblxuXHR9IGNhdGNoICggZXJyICkge1xuXHRcdGNvbnNvbGUubG9nKCBlcnIgKTtcblx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdH1cblxufSBlbHNlIHtcblx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xufVxuO1xuXG5cdFx0XG52YXIgaGFzU2VsZWN0aXZlUmVmcmVzaCA9IChcblx0J3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3cCAmJlxuXHR3cC5jdXN0b21pemUgJiZcblx0d3AuY3VzdG9taXplLnNlbGVjdGl2ZVJlZnJlc2ggJiZcblx0d3AuY3VzdG9taXplLndpZGdldHNQcmV2aWV3ICYmXG5cdHdwLmN1c3RvbWl6ZS53aWRnZXRzUHJldmlldy5XaWRnZXRQYXJ0aWFsXG4pO1xuaWYgKCBoYXNTZWxlY3RpdmVSZWZyZXNoICkge1xuXHR3cC5jdXN0b21pemUuc2VsZWN0aXZlUmVmcmVzaC5iaW5kKFxuXHRcdCdwYXJ0aWFsLWNvbnRlbnQtcmVuZGVyZWQnLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdH1cblx0KTtcbn1cbjtcblxuXHR9KTtcbn0pKGpRdWVyeSk7XG4iXX0=
