(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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
      lang = wlfmc_l10n.lang,
      remove_item_url = null,
      wishlist_items = wlfmc_l10n.wishlist_items,
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
        // this.init_drag_n_drop();
        // this.init_popup_checkbox_handling();
        // this.init_dropdown_lists();
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
      /** Set the wishlist hash in both session and local storage */
      set_products_hash: function set_products_hash(products) {
        if ($supports_html5_storage) {
          localStorage.setItem(products_hash_key, products);
          sessionStorage.setItem(products_hash_key, products);
        }
        $.fn.WLFMC.check_products(JSON.parse(products));
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
      $.fn.WLFMC.init_popup_checkbox_handling();
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
        if (products_hash_key === e.originalEvent.key && localStorage.getItem(products_hash_key) !== sessionStorage.getItem(products_hash_key)) {
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
        if (wlfmc_l10n.update_wishlists_data || null !== lang && lang !== localStorage.getItem(lang_hash_key) || localStorage.getItem(products_hash_key) !== JSON.stringify(wishlist_items)) {
          localStorage.setItem(products_hash_key, '');
          localStorage.setItem(lang_hash_key, '');
          $.fn.WLFMC.check_products(wishlist_items);
          throw 'Need Update wishlist data';
        }
        if (localStorage.getItem(products_hash_key)) {
          var data = JSON.parse(localStorage.getItem(products_hash_key));
          if ('object' === _typeof(data) && null !== data) {
            $.fn.WLFMC.check_products(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQyxVQUFVLENBQUMsRUFBRTtFQUNiLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUNkLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWTtJQUM3QjtJQUNBLElBQUksZUFBZSxHQUFPLEVBQUU7TUFDM0IsSUFBSSxHQUFrQixVQUFVLENBQUMsSUFBSTtNQUNyQyxlQUFlLEdBQU8sSUFBSTtNQUMxQixjQUFjLEdBQVEsVUFBVSxDQUFDLGNBQWM7TUFDL0MsY0FBYyxHQUFRLEtBQUs7TUFDM0IsV0FBVztNQUNYLGVBQWU7SUFFaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUc7TUFDZCxzQkFBc0IsRUFBRSxTQUF4QixzQkFBc0IsQ0FBQSxFQUFjO1FBQ25DLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBRSxpQ0FBa0MsQ0FBQztRQUV4RSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ25CLE9BQU8sS0FBSztRQUNiO1FBRUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7VUFDcEMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBRSxRQUFTLENBQUMsRUFBRTtZQUMxQyxPQUFPLEtBQUs7VUFDYjtVQUVBLElBQUksSUFBSSxHQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUUsNkNBQThDLENBQUM7WUFDaEYsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxh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QUFDLENBQUM7TUFDNUIsQ0FDRCxDQUFDO0lBQ0Y7SUFDQTtFQUVDLENBQUMsQ0FBQztBQUNILENBQUMsRUFBRSxNQUFNLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIE1haW4gU21hcnQgV29vQ29tbWVyY2UgV2lzaGxpc3QgSlNcbiAqXG4gKiBAYXV0aG9yIE1vcmVDb252ZXJ0XG4gKiBAcGFja2FnZSBTbWFydCBXaXNobGlzdCBGb3IgTW9yZSBDb252ZXJ0XG4gKlxuICogQHZlcnNpb24gMS44LjRcbiAqL1xuXG4vKmpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuKGZ1bmN0aW9uICgkKSB7XG5cdCQubm9Db25mbGljdCgpO1xuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0LyogPT09IE1BSU4gSU5JVCA9PT0gKi9cblx0XHR2YXIgcHJvZHVjdF9pbl9saXN0ICAgICA9IFtdICxcblx0XHRcdGxhbmcgICAgICAgICAgICAgICAgPSB3bGZtY19sMTBuLmxhbmcsXG5cdFx0XHRyZW1vdmVfaXRlbV91cmwgICAgID0gbnVsbCxcblx0XHRcdHdpc2hsaXN0X2l0ZW1zICAgICAgPSB3bGZtY19sMTBuLndpc2hsaXN0X2l0ZW1zLFxuXHRcdFx0cHJvZHVjdF9hZGRpbmcgICAgICA9IGZhbHNlLFxuXHRcdFx0ZnJhZ21lbnR4aHIsXG5cdFx0XHRmcmFnbWVudHRpbWVvdXQ7XG5cblx0XHQkLmZuLldMRk1DID0ge1xuXHRpbml0X3ByZXBhcmVfcXR5X2xpbmtzOiBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHF0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcud2xmbWMtd2lzaGxpc3QtdGFibGUgLnF1YW50aXR5JyApO1xuXG5cdFx0aWYgKHF0eS5sZW5ndGggPCAxKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBxdHkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChxdHlbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCAnaGlkZGVuJyApKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHBsdXMgID0gcXR5W2ldLnF1ZXJ5U2VsZWN0b3IoICcuYm90aWdhLXF1YW50aXR5LXBsdXMsIGEucGx1cywgLmN0LWluY3JlYXNlJyApLFxuXHRcdFx0XHRtaW51cyA9IHF0eVtpXS5xdWVyeVNlbGVjdG9yKCAnLmJvdGlnYS1xdWFudGl0eS1taW51cywgYS5taW51cywgLmN0LWRlY3JlYXNlJyApO1xuXG5cdFx0XHRpZiAoICEgcGx1cyB8fCAhIG1pbnVzIHx8IHBsdXMubGVuZ3RoIDwgMSB8fCBtaW51cy5sZW5ndGggPCAxICkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRwbHVzLmNsYXNzTGlzdC5hZGQoICdzaG93JyApO1xuXHRcdFx0bWludXMuY2xhc3NMaXN0LmFkZCggJ3Nob3cnICk7XG5cdFx0XHR2YXIgcGx1c19jbG9uZSAgPSBwbHVzLmNsb25lTm9kZSggdHJ1ZSApLFxuXHRcdFx0XHRtaW51c19jbG9uZSA9IG1pbnVzLmNsb25lTm9kZSggdHJ1ZSApO1xuXHRcdFx0cGx1c19jbG9uZS5hZGRFdmVudExpc3RlbmVyKFxuXHRcdFx0XHQnY2xpY2snLFxuXHRcdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR2YXIgaW5wdXQgICAgICAgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvciggJy5xdHknICksXG5cdFx0XHRcdFx0XHR2YWwgICAgICAgICA9IHBhcnNlRmxvYXQoIGlucHV0LnZhbHVlLCAxMCApIHx8IDAsXG5cdFx0XHRcdFx0XHRjaGFuZ2VFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnSFRNTEV2ZW50cycgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1heF92YWwgPSAoaW5wdXQuZ2V0QXR0cmlidXRlKCBcIm1heFwiICkgJiYgcGFyc2VGbG9hdCggaW5wdXQuZ2V0QXR0cmlidXRlKCBcIm1heFwiICksIDAgKSkgfHwgMSAvIDA7XG5cdFx0XHRcdFx0aW5wdXQudmFsdWUgICA9IHZhbCA8IG1heF92YWwgPyBNYXRoLnJvdW5kKCAxMDAgKiAodmFsICsgcGFyc2VGbG9hdCggaW5wdXQuc3RlcCB8fCBcIjFcIiApKSApIC8gMTAwIDogbWF4X3ZhbDtcblxuXHRcdFx0XHRcdC8vIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWUgPT09ICcnID8gMCA6IHBhcnNlSW50KCBpbnB1dC52YWx1ZSApICsgMTtcblx0XHRcdFx0XHRjaGFuZ2VFdmVudC5pbml0RXZlbnQoICdjaGFuZ2UnLCB0cnVlLCBmYWxzZSApO1xuXHRcdFx0XHRcdGlucHV0LmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdFx0bWludXNfY2xvbmUuYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0J2NsaWNrJyxcblx0XHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dmFyIGlucHV0ICAgICAgID0gdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoICcucXR5JyApLFxuXHRcdFx0XHRcdFx0dmFsICAgICAgICAgPSBwYXJzZUZsb2F0KCBpbnB1dC52YWx1ZSwgMTAgKSB8fCAwLFxuXHRcdFx0XHRcdFx0Y2hhbmdlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0hUTUxFdmVudHMnICk7XG5cdFx0XHRcdFx0Y29uc3QgbWluX3ZhbCAgID0gaW5wdXQuZ2V0QXR0cmlidXRlKCBcIm1pblwiICkgPyBNYXRoLnJvdW5kKCAxMDAgKiBwYXJzZUZsb2F0KCBpbnB1dC5nZXRBdHRyaWJ1dGUoIFwibWluXCIgKSwgMCApICkgLyAxMDAgOiAwO1xuXHRcdFx0XHRcdGlucHV0LnZhbHVlICAgICA9IHZhbCA+IG1pbl92YWwgPyBNYXRoLnJvdW5kKCAxMDAgKiAodmFsIC0gcGFyc2VGbG9hdCggaW5wdXQuc3RlcCB8fCBcIjFcIiApKSApIC8gMTAwIDogbWluX3ZhbDtcblxuXHRcdFx0XHRcdC8vIGlucHV0LnZhbHVlID0gcGFyc2VJbnQoIGlucHV0LnZhbHVlICkgPiAwID8gcGFyc2VJbnQoIGlucHV0LnZhbHVlICkgLSAxIDogMDtcblx0XHRcdFx0XHRjaGFuZ2VFdmVudC5pbml0RXZlbnQoICdjaGFuZ2UnLCB0cnVlLCBmYWxzZSApO1xuXHRcdFx0XHRcdGlucHV0LmRpc3BhdGNoRXZlbnQoIGNoYW5nZUV2ZW50ICk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdFx0cXR5W2ldLnJlcGxhY2VDaGlsZCggcGx1c19jbG9uZSwgcGx1cyApO1xuXHRcdFx0cXR5W2ldLnJlcGxhY2VDaGlsZCggbWludXNfY2xvbmUsIG1pbnVzICk7XG5cdFx0fVxuXG5cdH0sXG5cblx0cHJlcGFyZV9taW5pX3dpc2hsaXN0OiBmdW5jdGlvbiAoYSkge1xuXHRcdGlmICggYS5oYXNDbGFzcyggJ3Bvc2l0aW9uLWFic29sdXRlJyApICkge1xuXHRcdFx0dmFyIGFvICA9IGEub2Zmc2V0KCksXG5cdFx0XHRcdGFsICA9IGFvLmxlZnQsXG5cdFx0XHRcdGF0ICA9IGFvLnRvcCxcblx0XHRcdFx0YXcgID0gYS5vdXRlcldpZHRoKCksXG5cdFx0XHRcdGFoICA9IGEub3V0ZXJIZWlnaHQoKSxcblx0XHRcdFx0bGEgID0gcGFyc2VGbG9hdCggYS5jc3MoICdsZWZ0JyApICksXG5cdFx0XHRcdHRhICA9IHBhcnNlRmxvYXQoIGEuY3NzKCAndG9wJyApICksXG5cdFx0XHRcdGFvbCA9IGFsIC0gbGEsXG5cdFx0XHRcdGFvdCA9IGF0IC0gdGEsXG5cdFx0XHRcdF9sYSA9IGxhLCBfdGEgPSB0YSwgd3cgPSAkKCB3aW5kb3cgKS53aWR0aCgpLCBkaCA9ICQoIGRvY3VtZW50ICkuaGVpZ2h0KCksIG9zID0gNTAsXG5cdFx0XHRcdHIgICA9IHd3IC0gYW9sIC0gYXcgLSBvcywgbCA9IG9zIC0gYW9sLCBiID0gZGggLSBhb3QgLSBhaCAtIG9zO1xuXHRcdFx0aWYgKHd3IDw9IGF3KSB7XG5cdFx0XHRcdF9sYSA9IC0xICogYW9sO1xuXHRcdFx0fSBlbHNlIGlmICgwID4gd3cgLSAoYXcgKyBvcyAqIDIpKSB7XG5cdFx0XHRcdF9sYSA9ICh3dyAtIGF3KSAvIDIgLSBhb2w7XG5cdFx0XHR9IGVsc2UgaWYgKDAgPCBsKSB7XG5cdFx0XHRcdF9sYSA9IGw7XG5cdFx0XHR9IGVsc2UgaWYgKDAgPiByKSB7XG5cdFx0XHRcdF9sYSA9IHI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGggPCBhaCkge1xuXHRcdFx0XHRhLmhlaWdodCggZGggLSBhLm91dGVySGVpZ2h0KCkgKyBhLmhlaWdodCgpICk7XG5cdFx0XHRcdGFoID0gYS5vdXRlckhlaWdodCgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRoIDw9IGFoKSB7XG5cdFx0XHRcdF90YSA9IC0xICogYW90O1xuXHRcdFx0fSBlbHNlIGlmICgwID4gZGggLSAoYWggKyBvcyAqIDIpKSB7XG5cdFx0XHRcdF90YSA9IChkaCAtIGFoKSAvIDIgLSBhb3Q7XG5cdFx0XHR9IGVsc2UgaWYgKDAgPiBiKSB7XG5cdFx0XHRcdF90YSA9IGI7XG5cdFx0XHR9XG5cdFx0XHRhLmNzcygge2xlZnQ6IF9sYSwgdG9wOiBfdGEsfSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcCA9ICQoICcud2xmbWMtY291bnRlci13cmFwcGVyLicgKyBhLmF0dHIoICdkYXRhLWlkJyApICk7XG5cdFx0XHRpZiAoIHR5cGVvZiBwICE9PSAndW5kZWZpbmVkJyAmJiAwIDwgcC5sZW5ndGggKSB7XG5cdFx0XHRcdHZhciBwbyAgPSBwLm9mZnNldCgpLFxuXHRcdFx0XHRcdHN0ICA9ICQoIHdpbmRvdyApLnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRcdF9sYSA9IHBvLmxlZnQsXG5cdFx0XHRcdFx0X3RhID0gcG8udG9wICsgcC5oZWlnaHQoKSAtIHN0LFxuXHRcdFx0XHRcdGF3ICA9IGEub3V0ZXJXaWR0aCgpLFxuXHRcdFx0XHRcdHd3ICA9ICQoIHdpbmRvdyApLndpZHRoKCk7XG5cblx0XHRcdFx0aWYgKF9sYSArIGF3ID4gd3cpIHtcblx0XHRcdFx0XHRfbGEgPSB3dyAtIGF3IC0gMjA7XG5cdFx0XHRcdH1cblx0XHRcdFx0YS5jc3MoIHtsZWZ0OiBfbGEgLCB0b3A6IF90YSB9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0sXG5cblx0YXBwZW5kdG9Cb2R5OiBmdW5jdGlvbiAoZWxlbSkge1xuXHRcdGlmICggISBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcucG9zaXRpb24tZml4ZWQnICkubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dmFyIGNvdW50ZXJfdHlwZSA9IGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWl0ZW1zJyApLmhhc0NsYXNzKCAnd2xmbWMtbGlzdHMtY291bnRlci1kcm9wZG93bicgKSA/ICd3bGZtYy1wcmVtaXVtLWxpc3QtY291bnRlcicgOiAoZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5oYXNDbGFzcyggJ3dsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKSA/ICd3bGZtYy13YWl0bGlzdC1jb3VudGVyJyA6ICd3bGZtYy13aXNobGlzdC1jb3VudGVyJyk7XG5cdFx0aWYgKCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy13aXNobGlzdC1jb3VudGVyJyApLmxlbmd0aCA+IDAgfHwgZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtd2FpdGxpc3QtY291bnRlcicgKS5sZW5ndGggPiAwIHx8IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXByZW1pdW0tbGlzdC1jb3VudGVyJyApLmxlbmd0aCA+IDAgICkge1xuXHRcdFx0dmFyIHdpZGdldElkICA9IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXdpc2hsaXN0LWNvdW50ZXInICkuZGF0YSggXCJpZFwiICkgfHwgZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtd2FpdGxpc3QtY291bnRlcicgKS5kYXRhKCBcImlkXCIgKSB8fCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy1wcmVtaXVtLWxpc3QtY291bnRlcicgKS5kYXRhKCBcImlkXCIgKTtcblx0XHRcdHZhciBlbGVtZW50SWQgPSBlbGVtLmNsb3Nlc3QoICdbZGF0YS1lbGVtZW50b3ItaWRdJyApLmRhdGEoIFwiZWxlbWVudG9yLWlkXCIgKTtcblx0XHRcdHZhciBlbGVtZW50b3IgPSBcIjxkaXYgY2xhc3M9J3dsZm1jLWVsZW1lbnRvciBlbGVtZW50b3IgZWxlbWVudG9yLVwiICsgZWxlbWVudElkICsgXCIgXCIgKyBjb3VudGVyX3R5cGUgKyBcIic+PGRpdiBjbGFzcz0nZWxlbWVudG9yLWVsZW1lbnQgZWxlbWVudG9yLWVsZW1lbnQtXCIgKyB3aWRnZXRJZCArIFwiJz48L2Rpdj48L2Rpdj5cIjtcblx0XHRcdCQoIGVsZW1lbnRvciApLmFwcGVuZFRvKCBcImJvZHlcIiApO1xuXHRcdFx0JCggXCIud2xmbWMtZWxlbWVudG9yLmVsZW1lbnRvci1cIiArIGVsZW1lbnRJZCArIFwiIC5lbGVtZW50b3ItZWxlbWVudC1cIiArIHdpZGdldElkICkuYXBwZW5kKCBlbGVtICk7XG5cblx0XHR9IGVsc2UgaWYgKCAhIGVsZW0uY2xvc2VzdCggJy53bGZtYy1lbGVtZW50b3InICkubGVuZ3RoID4gMCApIHtcblx0XHRcdHZhciB3aWRnZXRJZCAgPSBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1pdGVtcycgKS5kYXRhKCBcImlkXCIgKTtcblx0XHRcdHZhciBlbGVtZW50b3IgPSBcIjxkaXYgY2xhc3M9J3dsZm1jLWVsZW1lbnRvciBuby1lbGVtZW50b3ItXCIgKyB3aWRnZXRJZCArIFwiIFwiICsgY291bnRlcl90eXBlICsgXCInPjwvZGl2PlwiO1xuXHRcdFx0JCggZWxlbWVudG9yICkuYXBwZW5kVG8oIFwiYm9keVwiICk7XG5cdFx0XHQkKCBcIi53bGZtYy1lbGVtZW50b3Iubm8tZWxlbWVudG9yLVwiICsgd2lkZ2V0SWQgKS5hcHBlbmQoIGVsZW0gKTtcblx0XHR9XG5cblx0fSxcblxuXHRzaG93X21pbmlfd2lzaGxpc3Q6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCAnLndsZm1jLWNvdW50ZXItZHJvcGRvd24nICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdCQuZm4uV0xGTUMuYXBwZW5kdG9Cb2R5KCBlbGVtLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApICk7XG5cdFx0JC5mbi5XTEZNQy5wcmVwYXJlX21pbmlfd2lzaGxpc3QoIGVsZW0gKTtcblx0XHRlbGVtLmFkZENsYXNzKCAnbGlzdHMtc2hvdycgKTtcblxuXHR9LFxuXG5cdGhpZGVfbWluaV93aXNobGlzdDogZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIGVsZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdCQoICcud2xmbWMtZmlyc3QtdG91Y2gnICkucmVtb3ZlQ2xhc3MoICd3bGZtYy1maXJzdC10b3VjaCcgKTtcblx0XHQkKCAnLndsZm1jLWZpcnN0LWNsaWNrJyApLnJlbW92ZUNsYXNzKCAnd2xmbWMtZmlyc3QtY2xpY2snICk7XG5cdFx0ZWxlbS5yZW1vdmVDbGFzcyggJ2xpc3RzLXNob3cnICk7XG5cblx0fSxcblxuXHRyZUluaXRfd2xmbWM6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19pbml0JyApO1xuXHR9LFxuXG5cdC8qID09PSBUb29sdGlwID09PSAqL1xuXHRpbml0X3Rvb2x0aXA6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgd2xmbWNfdG9vbHRpcCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBpbnN0YW5jZTtcblx0XHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMuaWRTZWxlY3RvciAgPSAnd2xmbWMtdG9vbHRpcCc7XG5cdFx0XHR0aGlzLnRleHQgICAgICAgID0gJyc7XG5cdFx0XHR0aGlzLnRvcCAgICAgICAgID0gMDtcblx0XHRcdHRoaXMubGVmdCAgICAgICAgPSAwO1xuXHRcdFx0dGhpcy5kaXJlY3Rpb24gICA9IHR5cGVvZiB0aGlzLmRpcmVjdGlvbiAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmRpcmVjdGlvbiA6ICdib3R0b20nO1xuXHRcdFx0dGhpcy50X3R5cGUgICAgICA9IHR5cGVvZiB0aGlzLnRfdHlwZSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLnRfdHlwZSA6ICdkZWZhdWx0Jztcblx0XHRcdHRoaXMudGFyZ2V0ICAgICAgPSAnJztcblx0XHRcdHRoaXMuaGlkZVRpbWVvdXQgPSBudWxsO1xuXG5cdFx0XHQvLyBDcmVhdGUgYWN0dWFsIGVsZW1lbnQgYW5kIHRpZSBlbGVtZW50IHRvIG9iamVjdCBmb3IgcmVmZXJlbmNlLlxuXHRcdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHRoaXMuaWRTZWxlY3RvciApO1xuXG5cdFx0XHRpZiAoICEgdGhpcy5ub2RlICkge1xuXHRcdFx0XHR0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdFx0XHRcdHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgdGhpcy5pZFNlbGVjdG9yICk7XG5cdFx0XHRcdHRoaXMubm9kZS5jbGFzc05hbWUgPSB0aGlzLm5vZGUuY2xhc3NOYW1lICsgXCJ0b29sdGlwX19oaWRkZW5cIjtcblx0XHRcdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IHRoaXMudGV4dDtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggdGhpcy5ub2RlICk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNob3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdC8vIFJlcmVuZGVyIHRvb2x0aXAuXG5cblx0XHRcdFx0dmFyIGxvY2F0aW9uX29yZGVyID0gWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXTtcblxuXHRcdFx0XHRfc2VsZi5ub2RlLmlubmVySFRNTCA9IF9zZWxmLnRleHQ7XG5cdFx0XHRcdHZhciBkaXJlY3Rpb24gICAgICAgID0gX3NlbGYuZGlyZWN0aW9uO1xuXHRcdFx0XHR2YXIgdF90eXBlICAgICAgICAgICA9IF9zZWxmLnRfdHlwZTtcblx0XHRcdFx0aWYgKGRpcmVjdGlvbikge1xuXHRcdFx0XHRcdCQoIHRoaXMubm9kZSApLmFkZENsYXNzKCAndG9vbHRpcF9fZXhwYW5kZWQgdG9vbHRpcF9fZXhwYW5kZWQtJyArIGRpcmVjdGlvbiApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoIHRoaXMubm9kZSApLmFkZENsYXNzKCAndG9vbHRpcF9fZXhwYW5kZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JCggdGhpcy5ub2RlICkuYWRkQ2xhc3MoICd3bGZtYy10b29sdGlwLScgKyB0X3R5cGUgKTtcblxuXHRcdFx0XHQkKCB0aGlzLm5vZGUgKS5yZW1vdmVDbGFzcyggJ3Rvb2x0aXBfX2hpZGRlbicgKTtcblxuXHRcdFx0XHRpZiAob2Zmc2NyZWVuKCAkKCB3bGZtY1Rvb2x0aXAubm9kZSApICkpIHtcblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZSgpO1xuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPSBsb2NhdGlvbl9vcmRlcltsb2NhdGlvbl9vcmRlci5pbmRleE9mKCB3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uICkgKyAxXTtcblx0XHRcdFx0XHRtb3ZlVGlwKCB3bGZtY1Rvb2x0aXAubm9kZSwgd2xmbWNUb29sdGlwLnRhcmdldCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cblx0XHRcdHRoaXMuaGlkZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8gSGlkZSB0b29sdGlwLlxuXHRcdFx0XHQvLyBIaWRlIHRvb2x0aXAuXG5cdFx0XHRcdGlmIChfc2VsZi5oaWRlVGltZW91dCkge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggX3NlbGYuaGlkZVRpbWVvdXQgKTtcblx0XHRcdFx0XHRfc2VsZi5oaWRlVGltZW91dCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmNzcyggJ3RvcCcsICcwJyApO1xuXHRcdFx0XHQkKCBfc2VsZi5ub2RlICkuY3NzKCAnbGVmdCcsICcwJyApO1xuXHRcdFx0XHQkKCBfc2VsZi5ub2RlICkuYXR0ciggJ2NsYXNzJywgJycgKTtcblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmFkZENsYXNzKCAndG9vbHRpcF9faGlkZGVuJyApO1xuXHRcdFx0fTtcblxuXHRcdH07XG5cdFx0Ly8gTW92ZSB0aXAgdG8gcHJvcGVyIGxvY2F0aW9uIGJlZm9yZSBkaXNwbGF5LlxuXHRcdHZhciBvZmZzY3JlZW4gPSBmdW5jdGlvbiAoZWwpIHtcblx0XHRcdHJldHVybiAoKGVsLm9mZnNldExlZnQgKyBlbC5vZmZzZXRXaWR0aCkgPCAwIHx8IChlbC5vZmZzZXRUb3AgKyBlbC5vZmZzZXRIZWlnaHQpIDwgMCB8fCAoZWwub2Zmc2V0TGVmdCArIGVsLm9mZnNldFdpZHRoID4gd2luZG93LmlubmVyV2lkdGggfHwgZWwub2Zmc2V0VG9wICsgZWwub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSk7XG5cdFx0fTtcblx0XHR2YXIgbW92ZVRpcCAgID0gZnVuY3Rpb24gKGVsbCwgdGFyZ2V0KSB7XG5cblx0XHRcdHZhciAkdGFyZ2V0ID0gJCggdGFyZ2V0ICk7XG5cdFx0XHR2YXIgJGVsbCAgICA9ICQoIGVsbCApO1xuXHRcdFx0dmFyIGJvZHkgICAgPSAkKCBcImJvZHlcIiApLm9mZnNldCgpO1xuXHRcdFx0JCggXCJib2R5XCIgKS5jc3MoIHsncG9zaXRpb24nOiAncmVsYXRpdmUnfSApO1xuXG5cdFx0XHQvLyBmaXggJGVsbCBzaXplIGFmdGVyIGNoYW5nZSBuZXcgdG9vbHRpcCB0ZXh0LlxuXHRcdFx0d2xmbWNUb29sdGlwLnNob3coKTtcblx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cblx0XHRcdHZhciBidXUgPSA3OyAvLyBEZWZhdWx0IHBhZGRpbmcgc2l6ZSBpbiBweC5cblx0XHRcdC8vIHZhciBjZW50ZXJfaGVpZ2h0ID0gLSgkZWxsLm91dGVySGVpZ2h0KCkgLyAyKSAvIDI7XG5cdFx0XHR2YXIgY2VudGVyX2hlaWdodCA9ICgoJHRhcmdldC5vdXRlckhlaWdodCgpIC0gJGVsbC5vdXRlckhlaWdodCgpICkgLyAyKTtcblx0XHRcdHZhciBjZW50ZXJfd2lkdGggID0gLSgkZWxsLm91dGVyV2lkdGgoKSAvIDIpICsgJHRhcmdldC5vdXRlcldpZHRoKCkgLyAyO1xuXG5cdFx0XHR2YXIgbG9jYXRpb25zICAgICAgPSB7XG5cdFx0XHRcdCd0b3AnOiBbLSRlbGwub3V0ZXJIZWlnaHQoKSAtIGJ1dSwgY2VudGVyX3dpZHRoXSxcblx0XHRcdFx0J3JpZ2h0JzogW2NlbnRlcl9oZWlnaHQsICR0YXJnZXQub3V0ZXJXaWR0aCgpICsgYnV1XSxcblx0XHRcdFx0J2JvdHRvbSc6IFskdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyBidXUsIGNlbnRlcl93aWR0aF0sXG5cdFx0XHRcdCdsZWZ0JzogW2NlbnRlcl9oZWlnaHQsIC0kZWxsLm91dGVyV2lkdGgoKSAtIGJ1dV1cblx0XHRcdH07XG5cdFx0XHR2YXIgbG9jYXRpb25fb3JkZXIgPSBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddO1xuXHRcdFx0dmFyIGxvY2F0aW9uX2tleXMgID0gT2JqZWN0LmtleXMoIGxvY2F0aW9ucyApO1xuXHRcdFx0aWYgKHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPT09ICd0b3AnIHx8IHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPT09ICdib3R0b20nKSB7XG5cdFx0XHRcdCRlbGwuY3NzKCAndG9wJywgJHRhcmdldC5vZmZzZXQoKS50b3AgLSAoYm9keS50b3ApICsgbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzBdICk7XG5cdFx0XHRcdCRlbGwuY3NzKCAnbGVmdCcsICR0YXJnZXQub2Zmc2V0KCkubGVmdCAtIChib2R5LmxlZnQpICsgKGJ1dSAvIDIpICsgbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzFdICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vICRlbGwuY3NzKCAndG9wJywgJHRhcmdldC5vZmZzZXQoKS50b3AgLSAoYm9keS50b3ApICsgKGJ1dSAvIDIpICsgbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzBdICk7XG5cdFx0XHRcdHZhciB0b3AgPSBsb2NhdGlvbnNbd2xmbWNUb29sdGlwLmRpcmVjdGlvbl1bMF0gLSAoYnV1IC8gMik7XG5cdFx0XHRcdHRvcCAgICAgPSB0b3AgPCAwID8gdG9wICsgKGJ1dSAvIDIpIDogdG9wO1xuXHRcdFx0XHQkZWxsLmNzcyggJ3RvcCcsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gKGJvZHkudG9wKSArIHRvcCApO1xuXHRcdFx0XHQkZWxsLmNzcyggJ2xlZnQnLCAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSAoYm9keS5sZWZ0KSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVsxXSApO1xuXG5cdFx0XHR9XG5cdFx0XHRpZiAob2Zmc2NyZWVuKCAkZWxsICkpIHtcblx0XHRcdFx0d2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9IGxvY2F0aW9uX29yZGVyW2xvY2F0aW9uX29yZGVyLmluZGV4T2YoIHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gKSArIDFdO1xuXHRcdFx0XHR3bGZtY1Rvb2x0aXAuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2xmbWNUb29sdGlwLnNob3coKTtcblx0XHRcdH1cblxuXHRcdH07XG5cblx0XHQvLyBDcmVhdGUgZ2xvYmFsIHdsZm1jX3Rvb2x0aXAuXG5cdFx0dmFyIHdsZm1jVG9vbHRpcCA9IG5ldyB3bGZtY190b29sdGlwKCk7XG5cdFx0Ly8gRGV0ZWN0IGlmIGRldmljZSBpcyB0b3VjaC1lbmFibGVkXG5cdFx0dmFyIGlzVG91Y2hEZXZpY2UgPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMDtcblx0XHQvLyBNb3VzZW92ZXIgdG8gc2hvdy5cblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J21vdXNlZW50ZXIgdG91Y2hzdGFydCcsXG5cdFx0XHRcIi53bGZtYy10b29sdGlwXCIsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR2YXIgX3NlbGYgICAgICAgICAgID0gdGhpcztcblx0XHRcdFx0d2xmbWNUb29sdGlwLnRhcmdldCA9IF9zZWxmOyAvLyBEZWZhdWx0IHRvIHNlbGYuXG5cdFx0XHRcdHZhciBuYW1lX2NsYXNzZXMgICAgPSBfc2VsZi5jbGFzc05hbWUuc3BsaXQoICcgJyApO1xuXHRcdFx0XHRuYW1lX2NsYXNzZXMuZm9yRWFjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoY2MpIHtcblx0XHRcdFx0XHRcdGlmIChjYy5pbmRleE9mKCAnd2xmbWMtdG9vbHRpcC0nICkgIT0gLTEpIHsgLy8gRmluZCBhIGRpcmVjdGlvbmFsIHRhZy5cblx0XHRcdFx0XHRcdFx0d2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9IGNjLnNwbGl0KCAnLScgKVtjYy5zcGxpdCggJy0nICkubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICgkKCB0aGlzICkuYXR0ciggJ2RhdGEtdG9vbHRpcC10eXBlJyApKSB7XG5cblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAudF90eXBlID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXRvb2x0aXAtdHlwZScgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICgkKCB0aGlzICkuYXR0ciggJ2RhdGEtdG9vbHRpcC10ZXh0JyApKSB7XG5cblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAudGV4dCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS10b29sdGlwLXRleHQnICk7XG5cdFx0XHRcdFx0bW92ZVRpcCggd2xmbWNUb29sdGlwLm5vZGUsIHdsZm1jVG9vbHRpcC50YXJnZXQgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIFByZXZlbnQgZGVmYXVsdCB0b3VjaCBiZWhhdmlvciB0byBhdm9pZCBzY3JvbGxpbmcgaXNzdWVzXG5cdFx0XHRcdGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBleGlzdGluZyBoaWRlIHRpbWVvdXRcblx0XHRcdFx0aWYgKHdsZm1jVG9vbHRpcC5oaWRlVGltZW91dCkge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggd2xmbWNUb29sdGlwLmhpZGVUaW1lb3V0ICk7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmhpZGVUaW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J21vdXNlbGVhdmUgdG91Y2hlbmQnLFxuXHRcdFx0XCIud2xmbWMtdG9vbHRpcFwiLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gUmUtaGlkZSB0b29sdGlwLlxuXHRcdFx0XHQvLyBIaWRlIHRvb2x0aXAgYWZ0ZXIgYSBzaG9ydCBkZWxheSBvbiB0b3VjaCBkZXZpY2VzXG5cdFx0XHRcdGlmIChlLnR5cGUgPT09ICd0b3VjaGVuZCcgJiYgaXNUb3VjaERldmljZSkge1xuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlVGltZW91dCA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0MTAwMFxuXHRcdFx0XHRcdCk7IC8vIDEtc2Vjb25kIGRlbGF5IGJlZm9yZSBoaWRpbmdcblx0XHRcdFx0fSBlbHNlIGlmIChlLnR5cGUgPT09ICdtb3VzZWxlYXZlJykge1xuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHRcdC8vIEhpZGUgdG9vbHRpcCBpZiBjbGlja2luZy90YXBwaW5nIG91dHNpZGVcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J3RvdWNoc3RhcnQgY2xpY2snLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKCAhICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53bGZtYy10b29sdGlwJyApLmxlbmd0aCAmJiAhICQoIGUudGFyZ2V0ICkuaXMoIHdsZm1jVG9vbHRpcC5ub2RlICkpIHtcblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRpbml0X2ZpeF9vbl9pbWFnZV9zaW5nbGVfcG9zaXRpb246IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoJCggJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnlfX3dyYXBwZXIgLndsZm1jLXRvcC1vZi1pbWFnZScgKS5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKCAnLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeV9fd3JhcHBlciAud2xmbWMtdG9wLW9mLWltYWdlJyApLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuaW5zZXJ0QWZ0ZXIoICQoIHRoaXMgKS5wYXJlbnQoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8qY29uc3QgdG9wT2ZJbWFnZUVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy53bGZtYy10b3Atb2YtaW1hZ2UnICk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRvcE9mSW1hZ2VFbGVtcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgY3VycmVudEVsZW0gPSB0b3BPZkltYWdlRWxlbXNbaV07XG5cdFx0XHQvLyBTZXQgdGhlIG1hcmdpbiB0b3Agb2YgdGhlIG5leHQgc2libGluZyBlbGVtZW50IHRvIHRoZSBoZWlnaHQgb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cblx0XHRcdGlmIChjdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcpIHtcblx0XHRcdFx0bGV0IHBvc2l0aW9uQ2xhc3MgICA9IFsuLi5jdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0XS5maW5kKCBjbGFzc05hbWUgPT4gY2xhc3NOYW1lLnN0YXJ0c1dpdGgoIFwid2xmbWNfcG9zaXRpb25faW1hZ2VfXCIgKSApO1xuXHRcdFx0XHRsZXQgY3VycmVudFBvc2l0aW9uID0gWy4uLmN1cnJlbnRFbGVtLmNsYXNzTGlzdF0uZmluZCggY2xhc3NOYW1lID0+IGNsYXNzTmFtZS5zdGFydHNXaXRoKCBcIndsZm1jX3Bvc2l0aW9uX2ltYWdlX1wiICkgKTtcblx0XHRcdFx0aWYgKHBvc2l0aW9uQ2xhc3MgPT09IGN1cnJlbnRQb3NpdGlvbikge1xuXHRcdFx0XHRcdGlmICgnd2xmbWNfcG9zaXRpb25faW1hZ2VfdG9wX2xlZnQnID09PSBwb3NpdGlvbkNsYXNzIHx8ICd3bGZtY19wb3NpdGlvbl9pbWFnZV90b3BfcmlnaHQnID09PSBwb3NpdGlvbkNsYXNzKSB7XG5cdFx0XHRcdFx0XHRsZXQgbWFyZ2luVG9wID0gYCR7Y3VycmVudEVsZW0ub2Zmc2V0SGVpZ2h0ICsgNX1weGA7XG5cdFx0XHRcdFx0XHQvLyBDaGVjayBmb3IgcHJldmlvdXMgc2libGluZ3Mgd2l0aCB0aGUgc2FtZSBwb3NpdGlvbiBjbGFzcyBhbmQgYWRkIHRoZWlyIGhlaWdodHMgYW5kIGdhcCB2YWx1ZXMgdG8gbWFyZ2luVG9wLlxuXHRcdFx0XHRcdFx0bGV0IHByZXZTaWJsaW5nID0gY3VycmVudEVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZztcblx0XHRcdFx0XHRcdHdoaWxlIChwcmV2U2libGluZyAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoICd3bGZtYy10b3Atb2YtaW1hZ2UnICkgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCBwb3NpdGlvbkNsYXNzICkpIHtcblx0XHRcdFx0XHRcdFx0bWFyZ2luVG9wICAgPSBgY2FsYyggJHttYXJnaW5Ub3B9ICsgJHtwcmV2U2libGluZy5vZmZzZXRIZWlnaHQgKyA1fXB4IClgO1xuXHRcdFx0XHRcdFx0XHRwcmV2U2libGluZyA9IHByZXZTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVG9wO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoJ3dsZm1jX3Bvc2l0aW9uX2ltYWdlX2JvdHRvbV9sZWZ0JyA9PT0gcG9zaXRpb25DbGFzcyB8fCAnd2xmbWNfcG9zaXRpb25faW1hZ2VfYm90dG9tX3JpZ2h0JyA9PT0gcG9zaXRpb25DbGFzcykge1xuXHRcdFx0XHRcdFx0bGV0IG1hcmdpbkJvdHRvbSA9IGAke2N1cnJlbnRFbGVtLm9mZnNldEhlaWdodCArIDV9cHhgO1xuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIHByZXZpb3VzIHNpYmxpbmdzIHdpdGggdGhlIHNhbWUgcG9zaXRpb24gY2xhc3MgYW5kIGFkZCB0aGVpciBoZWlnaHRzIGFuZCBnYXAgdmFsdWVzIHRvIG1hcmdpbkJvdHRvbS5cblx0XHRcdFx0XHRcdGxldCBwcmV2U2libGluZyA9IGN1cnJlbnRFbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR3aGlsZSAocHJldlNpYmxpbmcgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2xmbWMtdG9wLW9mLWltYWdlJyApICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyggcG9zaXRpb25DbGFzcyApKSB7XG5cdFx0XHRcdFx0XHRcdG1hcmdpbkJvdHRvbSA9IGBjYWxjKCAke21hcmdpbkJvdHRvbX0gKyAke3ByZXZTaWJsaW5nLm9mZnNldEhlaWdodCArIDV9cHggKWA7XG5cdFx0XHRcdFx0XHRcdHByZXZTaWJsaW5nICA9IHByZXZTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJyZW50RWxlbS5uZXh0RWxlbWVudFNpYmxpbmcuc3R5bGUubWFyZ2luQm90dG9tID0gbWFyZ2luQm90dG9tO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0qL1xuXG5cdH0sXG5cblx0LyogPT09IElOSVQgRlVOQ1RJT05TID09PSAqL1xuXG5cdC8qKlxuXHQgKiBJbml0IHBvcHVwIGZvciBhbGwgbGlua3Mgd2l0aCB0aGUgcGx1Z2luIHRoYXQgb3BlbiBhIHBvcHVwXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF93aXNobGlzdF9wb3B1cDogZnVuY3Rpb24gKCkge1xuXG5cdFx0Ly8gYWRkICYgcmVtb3ZlIGNsYXNzIHRvIGJvZHkgd2hlbiBwb3B1cCBpcyBvcGVuZWQuXG5cdFx0dmFyIGNhbGxiYWNrICAgICAgID0gZnVuY3Rpb24gKG5vZGUsIG9wKSB7XG5cdFx0XHRpZiAodHlwZW9mIG5vZGUuY2xhc3NMaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucyggJ3dsZm1jLW92ZXJsYXknICkpIHtcblx0XHRcdFx0dmFyIG1ldGhvZCA9ICdyZW1vdmUnID09PSBvcCA/ICdyZW1vdmVDbGFzcycgOiAnYWRkQ2xhc3MnO1xuXG5cdFx0XHRcdCQoICdib2R5JyApW21ldGhvZF0oICd3bGZtYy13aXRoLXBvcHVwJyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XHRjYWxsYmFja0FkZCAgICA9IGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0XHRcdGNhbGxiYWNrKCBub2RlLCAnYWRkJyApO1xuXHRcdFx0fSxcblx0XHRcdGNhbGxiYWNrUmVtb3ZlID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdFx0Y2FsbGJhY2soIG5vZGUsICdyZW1vdmUnICk7XG5cdFx0XHR9LFxuXHRcdFx0b2JzZXJ2ZXIgICAgICAgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcblx0XHRcdFx0ZnVuY3Rpb24gKG11dGF0aW9uc0xpc3QpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpIGluIG11dGF0aW9uc0xpc3QpIHtcblx0XHRcdFx0XHRcdHZhciBtdXRhdGlvbiA9IG11dGF0aW9uc0xpc3RbaV07XG5cdFx0XHRcdFx0XHRpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgbXV0YXRpb24uYWRkZWROb2RlcyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKCBjYWxsYmFja0FkZCApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgbXV0YXRpb24ucmVtb3ZlZE5vZGVzICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHRtdXRhdGlvbi5yZW1vdmVkTm9kZXMuZm9yRWFjaCggY2FsbGJhY2tSZW1vdmUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdG9ic2VydmVyLm9ic2VydmUoXG5cdFx0XHRkb2N1bWVudC5ib2R5LFxuXHRcdFx0e1xuXHRcdFx0XHRjaGlsZExpc3Q6IHRydWVcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbml0IGNoZWNrYm94IGhhbmRsaW5nXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF9jaGVja2JveF9oYW5kbGluZzogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBjaGVja2JveGVzID0gJCggJy53bGZtYy13aXNobGlzdC10YWJsZSwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmZpbmQoICd0Ym9keSAucHJvZHVjdC1jaGVja2JveCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0dmFyIGxpbmsgICAgICAgPSAkKCAnLm11bHRpcGxlLXByb2R1Y3QtbW92ZSwubXVsdGlwbGUtcHJvZHVjdC1jb3B5JyApO1xuXHRcdGNoZWNrYm94ZXMub2ZmKCAnY2hhbmdlJyApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIHQgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0cCA9IHQucGFyZW50KCk7XG5cblx0XHRcdFx0aWYgKCAhIHQuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0XHRcdCQoICdpbnB1dFtuYW1lPVwiJyArIHQuYXR0ciggJ25hbWUnICkgKyAnXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydDInICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHAucmVtb3ZlQ2xhc3MoICdjaGVja2VkJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAndW5jaGVja2VkJyApXG5cdFx0XHRcdFx0LmFkZENsYXNzKCB0LmlzKCAnOmNoZWNrZWQnICkgPyAnY2hlY2tlZCcgOiAndW5jaGVja2VkJyApO1xuXG5cdFx0XHRcdGlmICggbGluay5sZW5ndGggPiAwICkge1xuXG5cdFx0XHRcdFx0dmFyIGlzQ2hlY2tlZCA9IGNoZWNrYm94ZXMuaXMoICc6Y2hlY2tlZCcgKTtcblx0XHRcdFx0XHRpZiAoaXNDaGVja2VkKSB7XG5cdFx0XHRcdFx0XHRsaW5rLnNob3coKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGluay5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciByb3cgICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAndHInICk7XG5cdFx0XHRcdFx0dmFyIGl0ZW1JZCAgICAgICAgID0gcm93LmF0dHIoICdkYXRhLWl0ZW0taWQnICk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nSXRlbUlkID0gbGluay5hdHRyKCAnZGF0YS1pdGVtLWlkJyApO1xuXHRcdFx0XHRcdGlmICggIHQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRcdGlmIChleGlzdGluZ0l0ZW1JZCkge1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZCA9IGV4aXN0aW5nSXRlbUlkLnNwbGl0KCAnLCcgKTtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQucHVzaCggaXRlbUlkICk7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuam9pbiggJywnICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZCA9IGl0ZW1JZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKGV4aXN0aW5nSXRlbUlkKSB7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggICAgICA9IGV4aXN0aW5nSXRlbUlkLmluZGV4T2YoIGl0ZW1JZCApO1xuXHRcdFx0XHRcdFx0XHRpZiAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQuc3BsaWNlKCBpbmRleCwgMSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuam9pbiggJywnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGluay5hdHRyKCAnZGF0YS1pdGVtLWlkJywgZXhpc3RpbmdJdGVtSWQgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEluaXQganMgaGFuZGxpbmcgb24gd2lzaGxpc3QgdGFibGUgaXRlbXMgYWZ0ZXIgYWpheCB1cGRhdGVcblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X2hhbmRsaW5nX2FmdGVyX2FqYXg6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmluaXRfcHJlcGFyZV9xdHlfbGlua3MoKTtcblx0XHR0aGlzLmluaXRfY2hlY2tib3hfaGFuZGxpbmcoKTtcblx0XHQvLyB0aGlzLmluaXRfcXVhbnRpdHkoKTtcblx0XHQvLyB0aGlzLmluaXRfY29weV93aXNobGlzdF9saW5rKCk7XG5cdFx0Ly8gdGhpcy5pbml0X3Rvb2x0aXAoKTtcblx0XHQvLyB0aGlzLmluaXRfY29tcG9uZW50cygpO1xuXHRcdC8vIHRoaXMuaW5pdF9sYXlvdXQoKTtcblx0XHQvLyB0aGlzLmluaXRfZHJhZ19uX2Ryb3AoKTtcblx0XHQvLyB0aGlzLmluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmcoKTtcblx0XHQvLyB0aGlzLmluaXRfZHJvcGRvd25fbGlzdHMoKTtcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19pbml0X2FmdGVyX2FqYXgnICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEhhbmRsZSBxdWFudGl0eSBpbnB1dCBjaGFuZ2UgZm9yIGVhY2ggd2lzaGxpc3QgaXRlbVxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGluaXRfcXVhbnRpdHk6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIganF4aHIsXG5cdFx0XHR0aW1lb3V0O1xuXG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0Jy53bGZtYy13aXNobGlzdC10YWJsZSAucXVhbnRpdHkgOmlucHV0LCAud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUgLnF1YW50aXR5IDppbnB1dCcsXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdHJvdyAgICAgICAgICAgPSB0LmNsb3Nlc3QoICdbZGF0YS1yb3ctaWRdJyApLFxuXHRcdFx0XHRcdHByb2R1Y3RfaWQgICAgPSByb3cuZGF0YSggJ3Jvdy1pZCcgKSxcblx0XHRcdFx0XHRjYXJ0X2l0ZW1fa2V5ID0gcm93LmRhdGEoICdjYXJ0LWl0ZW0ta2V5JyApLFxuXHRcdFx0XHRcdHRhYmxlICAgICAgICAgPSB0LmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLFxuXHRcdFx0XHRcdHRva2VuICAgICAgICAgPSB0YWJsZS5kYXRhKCAndG9rZW4nICk7XG5cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XG5cblx0XHRcdFx0Ly8gc2V0IGFkZCB0byBjYXJ0IGxpbmsgdG8gYWRkIHNwZWNpZmljIHF0eSB0byBjYXJ0LlxuXHRcdFx0XHRyb3cuZmluZCggJy5hZGRfdG9fY2FydF9idXR0b24nICkuYXR0ciggJ2RhdGEtcXVhbnRpdHknLCB0LnZhbCgpICk7XG5cblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aWYgKGpxeGhyKSB7XG5cdFx0XHRcdFx0XHRcdGpxeGhyLmFib3J0KCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGpxeGhyID0gJC5hamF4KFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnVwZGF0ZV9pdGVtX3F1YW50aXR5LFxuXHRcdFx0XHRcdFx0XHRcdFx0bm9uY2U6IHRhYmxlLmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2lkOiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FydF9pdGVtX2tleTogY2FydF9pdGVtX2tleSxcblx0XHRcdFx0XHRcdFx0XHRcdHdpc2hsaXN0X3Rva2VuOiB0b2tlbixcblx0XHRcdFx0XHRcdFx0XHRcdHF1YW50aXR5OiB0LnZhbCgpLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cygpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0XHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5ibG9jayggcm93ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy51bmJsb2NrKCByb3cgKTtcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0LyppZiAodHlwZW9mIHJlc3BvbnNlLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIHJlc3BvbnNlLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0qL1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdDEwMDBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfcG9wdXBzOiBmdW5jdGlvbiAoKSB7XG5cblx0XHQkKCAnYm9keScgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLXBvcHVwLXRyaWdnZXI6bm90KC53bGZtYy1kaXNhYmxlZCknLFxuXHRcdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBpZCAgICAgICAgICAgID0gJCggdGhpcyApLmRhdGEoICdwb3B1cC1pZCcgKTtcblx0XHRcdFx0dmFyIGVsZW0gICAgICAgICAgPSAkKCAnIycgKyBpZCApO1xuXHRcdFx0XHR2YXIgcG9wdXBfd3JhcHBlciA9ICQoICcjJyArIGlkICsgJ193cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggISBwb3B1cF93cmFwcGVyLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdFx0XHRcdGNvbG9yOiAnIzMzMycsXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uOiAnYWxsIDAuM3MnLFxuXHRcdFx0XHRcdFx0aG9yaXpvbnRhbDogZWxlbS5kYXRhKCAnaG9yaXpvbnRhbCcgKSxcblx0XHRcdFx0XHRcdHZlcnRpY2FsOiBlbGVtLmRhdGEoICd2ZXJ0aWNhbCcgKVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0ZWxlbS5wb3B1cCggZGVmYXVsdE9wdGlvbnMgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKCAnI3dsZm1jLXRvb2x0aXAnIClcblx0XHRcdFx0XHQuY3NzKFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQndG9wJzogJzAnLFxuXHRcdFx0XHRcdFx0XHQnbGVmdCc6ICcwJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoKVxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ3Rvb2x0aXBfX2hpZGRlbicgKTtcblx0XHRcdFx0JCggJyMnICsgaWQgKS5wb3B1cCggJ3Nob3cnICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHRcdCQoICdib2R5JyApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2xmbWMtcG9wdXAtY2xvc2UnLFxuXHRcdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBpZCA9ICQoIHRoaXMgKS5kYXRhKCAncG9wdXAtaWQnICk7XG5cdFx0XHRcdCQoICcjJyArIGlkICkucG9wdXAoICdoaWRlJyApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHR9LFxuXG5cdGluaXRfY29tcG9uZW50czogZnVuY3Rpb24gKCkge1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1saXN0IC5wcm9kdWN0LWNvbXBvbmVudHMnLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgJHRoaXMgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgZWxlbSAgICAgICAgID0gJHRoaXMuY2xvc2VzdCggJ3RyJyApO1xuXHRcdFx0XHR2YXIgJG1ldGFEYXRhICAgID0gZWxlbS5maW5kKCAnLndsZm1jLWFic29sdXRlLW1ldGEtZGF0YScgKTtcblx0XHRcdFx0dmFyICRuZXh0ICAgICAgICA9IGVsZW0ubmV4dCggJy53bGZtYy1yb3ctbWV0YS1kYXRhJyApLmZpbHRlciggJy53bGZtYy1yb3ctbWV0YS1kYXRhJyApO1xuXHRcdFx0XHR2YXIgaXNOZXh0SGlkZGVuID0gJG5leHQuaGFzQ2xhc3MoICdoaWRlJyApO1xuXG5cdFx0XHRcdCRtZXRhRGF0YS5mYWRlVG9nZ2xlKCk7XG5cdFx0XHRcdCRuZXh0LnRvZ2dsZUNsYXNzKCAnaGlkZScgKTtcblx0XHRcdFx0ZWxlbS50b2dnbGVDbGFzcyggJ3Nob3ctbWV0YS1kYXRhJywgaXNOZXh0SGlkZGVuICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndsZm1jLWxpc3QgLmNsb3NlLWNvbXBvbmVudHMnLFxuXHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgZWxlbSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAndHInICk7XG5cdFx0XHRcdGVsZW0uZmluZCggJy53bGZtYy1hYnNvbHV0ZS1tZXRhLWRhdGEnICkuZmFkZVRvZ2dsZSgpO1xuXHRcdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCAnc2hvdy1tZXRhLWRhdGEnICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnLmxpc3QtaXRlbS1jaGVja2JveCcsXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0dmFyIHNlbGVjdGVkSXRlbSAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLmxpc3QtaXRlbScgKTtcblx0XHRcdFx0dmFyIHBhcmVudENvbnRhaW5lciA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lciwgLndsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyLCAud2xmbWMtY29weS10by1saXN0LXdyYXBwZXInICk7XG5cdFx0XHRcdGlmIChwYXJlbnRDb250YWluZXIuaGFzQ2xhc3MoICd3bGZtYy1hZGQtdG8tbGlzdC1jb250YWluZXInICkpIHtcblx0XHRcdFx0XHRpZiAoJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZEl0ZW0ucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBhcmVudENvbnRhaW5lci5oYXNDbGFzcyggJ3dsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyJyApIHx8IHBhcmVudENvbnRhaW5lci5oYXNDbGFzcyggJ3dsZm1jLWNvcHktdG8tbGlzdC13cmFwcGVyJyApKSB7XG5cdFx0XHRcdFx0dmFyIGNoZWNrYm94ZXMgPSBwYXJlbnRDb250YWluZXIuZmluZCggJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHRcdFx0XHRwYXJlbnRDb250YWluZXIuZmluZCggJy5saXN0LWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdFx0XHRpZiAoJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdFx0XHRcdFx0Y2hlY2tib3hlcy5ub3QoICQoIHRoaXMgKSApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbml0IGhhbmRsaW5nIGZvciBjb3B5IGJ1dHRvblxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGluaXRfY29weV93aXNobGlzdF9saW5rOiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLmNvcHktbGluay10cmlnZ2VyJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIG9ial90b19jb3B5ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdHZhciBoaWRkZW4gPSAkKFxuXHRcdFx0XHRcdCc8aW5wdXQvPicsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFsOiBvYmpfdG9fY29weS5hdHRyKCAnZGF0YS1ocmVmJyApLFxuXHRcdFx0XHRcdFx0dHlwZTogJ3RleHQnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdCQoICdib2R5JyApLmFwcGVuZCggaGlkZGVuICk7XG5cblx0XHRcdFx0aWYgKCQuZm4uV0xGTUMuaXNPUygpKSB7XG5cdFx0XHRcdFx0aGlkZGVuWzBdLnNldFNlbGVjdGlvblJhbmdlKCAwLCA5OTk5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aGlkZGVuLnNlbGVjdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcblxuXHRcdFx0XHRoaWRkZW4ucmVtb3ZlKCk7XG5cblx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHdsZm1jX2wxMG4ubGFiZWxzLmxpbmtfY29waWVkICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGZyYWdtZW50cyB0aGF0IG5lZWQgdG8gYmUgcmVmcmVzaGVkIGluIHRoZSBwYWdlXG5cdCAqXG5cdCAqIEBwYXJhbSBzZWFyY2ggc3RyaW5nIFJlZiB0byBzZWFyY2ggYW1vbmcgYWxsIGZyYWdtZW50cyBpbiB0aGUgcGFnZVxuXHQgKiBAcmV0dXJuIG9iamVjdCBPYmplY3QgY29udGFpbmluZyBhIHByb3BlcnR5IGZvciBlYWNoIGZyYWdtZW50IHRoYXQgbWF0Y2hlcyBzZWFyY2hcblx0ICovXG5cdHJldHJpZXZlX2ZyYWdtZW50czogZnVuY3Rpb24gKHNlYXJjaCkge1xuXHRcdHZhciBvcHRpb25zICAgPSB7fSxcblx0XHRcdGZyYWdtZW50cyA9IG51bGw7XG5cblx0XHRpZiAoc2VhcmNoKSB7XG5cdFx0XHRpZiAodHlwZW9mIHNlYXJjaCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0c2VhcmNoID0gJC5leHRlbmQoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZnJhZ21lbnRzOiBudWxsLFxuXHRcdFx0XHRcdFx0czogJycsXG5cdFx0XHRcdFx0XHRjb250YWluZXI6ICQoIGRvY3VtZW50ICksXG5cdFx0XHRcdFx0XHRmaXJzdExvYWQ6IGZhbHNlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZWFyY2hcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoICEgc2VhcmNoLmZyYWdtZW50cykge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IHNlYXJjaC5jb250YWluZXIuZmluZCggJy53bGZtYy13aXNobGlzdC1mcmFnbWVudCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBzZWFyY2guZnJhZ21lbnRzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNlYXJjaC5zKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gZnJhZ21lbnRzLm5vdCggJ1tkYXRhLWZyYWdtZW50LXJlZl0nICkuYWRkKCBmcmFnbWVudHMuZmlsdGVyKCAnW2RhdGEtZnJhZ21lbnQtcmVmPVwiJyArIHNlYXJjaC5zICsgJ1wiXScgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNlYXJjaC5maXJzdExvYWQpIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBmcmFnbWVudHMuZmlsdGVyKCAnLm9uLWZpcnN0LWxvYWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZyYWdtZW50cyA9ICQoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzZWFyY2ggPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gZnJhZ21lbnRzLm5vdCggJ1tkYXRhLWZyYWdtZW50LXJlZl0nICkuYWRkKCBmcmFnbWVudHMuZmlsdGVyKCAnW2RhdGEtZnJhZ21lbnQtcmVmPVwiJyArIHNlYXJjaCArICdcIl0nICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmcmFnbWVudHMgPSAkKCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApO1xuXHRcdH1cblxuXHRcdGlmIChmcmFnbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRmcmFnbWVudHMuZWFjaChcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciB0ICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRcdGlkID0gdC5hdHRyKCAnY2xhc3MnICkuc3BsaXQoICcgJyApLmZpbHRlcihcblx0XHRcdFx0XHRcdFx0KHZhbCkgPT4ge3JldHVybiB2YWwubGVuZ3RoICYmIHZhbCAhPT0gJ2V4aXN0cyc7fVxuXHRcdFx0XHRcdFx0KS5qb2luKCB3bGZtY19sMTBuLmZyYWdtZW50c19pbmRleF9nbHVlICk7XG5cblx0XHRcdFx0XHRvcHRpb25zW2lkXSA9IHQuZGF0YSggJ2ZyYWdtZW50LW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBvcHRpb25zO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkIGZyYWdtZW50cyBvbiBwYWdlIGxvYWRpbmdcblx0ICpcblx0ICogQHBhcmFtIHNlYXJjaCBzdHJpbmcgUmVmIHRvIHNlYXJjaCBhbW9uZyBhbGwgZnJhZ21lbnRzIGluIHRoZSBwYWdlXG5cdCAqIEBwYXJhbSBzdWNjZXNzIGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBzdWNjZXNzQXJncyBhcnJheVxuXHQgKi9cblx0bG9hZF9mcmFnbWVudHM6IGZ1bmN0aW9uIChzZWFyY2gsIHN1Y2Nlc3MsIHN1Y2Nlc3NBcmdzKSB7XG5cblx0XHRjbGVhclRpbWVvdXQoIGZyYWdtZW50dGltZW91dCApO1xuXG5cdFx0ZnJhZ21lbnR0aW1lb3V0ID0gc2V0VGltZW91dChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCBmcmFnbWVudHhociApIHtcblx0XHRcdFx0XHRmcmFnbWVudHhoci5hYm9ydCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlYXJjaCA9ICQuZXh0ZW5kKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZpcnN0TG9hZDogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2VhcmNoXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0dmFyIGZyYWdtZW50cyA9ICQuZm4uV0xGTUMucmV0cmlldmVfZnJhZ21lbnRzKCBzZWFyY2ggKTtcblx0XHRcdFx0Ly8gY3JlYXRlIGEgbmV3IEZvcm1EYXRhIG9iamVjdC5cblx0XHRcdFx0dmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCggJ2FjdGlvbicsIHdsZm1jX2wxMG4uYWN0aW9ucy5sb2FkX2ZyYWdtZW50cyApO1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICdjb250ZXh0JywgJ2Zyb250ZW5kJyApO1xuXHRcdFx0XHRpZiAoIGZyYWdtZW50cykge1xuXHRcdFx0XHRcdC8vIGNvbnZlcnQgb2JqZWN0IHRvIEpTT04gc3RyaW5nLlxuXHRcdFx0XHRcdHZhciBmcmFnbWVudEpzb24gPSBKU09OLnN0cmluZ2lmeSggZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0Ly8gY3JlYXRlIGEgZmlsZSBmcm9tIEpTT04gc3RyaW5nLlxuXHRcdFx0XHRcdHZhciBmaWxlID0gbmV3IEZpbGUoIFtmcmFnbWVudEpzb25dLCAnZnJhZ21lbnQuanNvbicgKTtcblx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICdmcmFnbWVudHNfZmlsZScsIGZpbGUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZyYWdtZW50eGhyID0gJC5hamF4KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hZG1pbl91cmwsIC8vIGFqYXhfdXJsLFxuXHRcdFx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdFx0XHQvKmJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCovXG5cdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGRhdGEuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3VjY2Vzcy5hcHBseSggbnVsbCwgc3VjY2Vzc0FyZ3MgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyAkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19mcmFnbWVudHNfbG9hZGVkJywgW2ZyYWdtZW50cywgZGF0YS5mcmFnbWVudHMsIHNlYXJjaC5maXJzdExvYWRdICk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdCQoICcjd2xmbWMtbGlzdHMsI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkuYWRkQ2xhc3MoICdvbi1maXJzdC1sb2FkJyApO1xuXG5cdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGRhdGEucHJvZHVjdHMgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBkYXRhLnByb2R1Y3RzICkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBkYXRhLndhaXRsaXN0ICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggZGF0YS53YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgZGF0YS5sYW5nICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9sYW5nX2hhc2goIGRhdGEubGFuZyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdDEwMFxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlcGxhY2UgZnJhZ21lbnRzIHdpdGggdGVtcGxhdGUgcmVjZWl2ZWRcblx0ICpcblx0ICogQHBhcmFtIGZyYWdtZW50cyBhcnJheSBBcnJheSBvZiBmcmFnbWVudHMgdG8gcmVwbGFjZVxuXHQgKi9cblx0cmVwbGFjZV9mcmFnbWVudHM6IGZ1bmN0aW9uIChmcmFnbWVudHMpIHtcblx0XHQkLmVhY2goXG5cdFx0XHRmcmFnbWVudHMsXG5cdFx0XHRmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHR2YXIgaXRlbVNlbGVjdG9yID0gJy4nICsgaS5zcGxpdCggd2xmbWNfbDEwbi5mcmFnbWVudHNfaW5kZXhfZ2x1ZSApLmZpbHRlcihcblx0XHRcdFx0XHQodmFsKSA9PiB7cmV0dXJuIHZhbC5sZW5ndGggJiYgdmFsICE9PSAnZXhpc3RzJyAmJiB2YWwgIT09ICd3aXRoLWNvdW50Jzt9XG5cdFx0XHRcdCkuam9pbiggJy4nICksXG5cdFx0XHRcdFx0dG9SZXBsYWNlICAgID0gJCggaXRlbVNlbGVjdG9yICk7XG5cdFx0XHRcdC8vIGZpbmQgcmVwbGFjZSB0ZW1wbGF0ZS5cblx0XHRcdFx0dmFyIHJlcGxhY2VXaXRoID0gJCggdiApLmZpbHRlciggaXRlbVNlbGVjdG9yICk7XG5cblx0XHRcdFx0aWYgKCAhIHJlcGxhY2VXaXRoLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJlcGxhY2VXaXRoID0gJCggdiApLmZpbmQoIGl0ZW1TZWxlY3RvciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRvUmVwbGFjZS5sZW5ndGggJiYgcmVwbGFjZVdpdGgubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dG9SZXBsYWNlLnJlcGxhY2VXaXRoKCByZXBsYWNlV2l0aCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHQvKiA9PT0gRVZFTlQgSEFORExJTkcgPT09ICovXG5cblx0bG9hZF9hdXRvbWF0aW9uczogZnVuY3Rpb24gKHByb2R1Y3RfaWQsIHdpc2hsaXN0X2lkLCBjdXN0b21lcl9pZCwgbGlzdF90eXBlLCBub25jZSkge1xuXHRcdCQuYWpheChcblx0XHRcdHtcblxuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5sb2FkX2F1dG9tYXRpb25zLFxuXHRcdFx0XHRcdG5vbmNlOiBub25jZSxcblx0XHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHBhcnNlSW50KCBwcm9kdWN0X2lkICksXG5cdFx0XHRcdFx0d2lzaGxpc3RfaWQ6IHBhcnNlSW50KCB3aXNobGlzdF9pZCApLFxuXHRcdFx0XHRcdGN1c3RvbWVyX2lkOiBwYXJzZUludCggY3VzdG9tZXJfaWQgKSxcblx0XHRcdFx0XHRsaXN0X3R5cGU6IGxpc3RfdHlwZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gYW55dGhpbmcuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdGNoZWNrX3Byb2R1Y3RzOiBmdW5jdGlvbiAocHJvZHVjdHMpIHtcblx0XHRpZiAoIG51bGwgIT09IHByb2R1Y3RzICkge1xuXHRcdFx0cHJvZHVjdF9pbl9saXN0ICAgPSBbXTtcblx0XHRcdHZhciBjb3VudGVyX2l0ZW1zID0gJCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXIgLndsZm1jLWNvdW50ZXItaXRlbScgKTtcblx0XHRcdGlmICggY291bnRlcl9pdGVtcy5sZW5ndGggJiYgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCApIHtcblx0XHRcdFx0Y291bnRlcl9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCBpdGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpdGVtLnByb2R1Y3RfaWQgPT09IHBfaWQ7IH1cblx0XHRcdFx0XHRcdCkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIHBfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHZhciB0YWJsZV9pdGVtc1x0PSAkKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0gLndsZm1jLXRhYmxlLWl0ZW0nICk7XG5cdFx0XHRpZiAoIHRhYmxlX2l0ZW1zLmxlbmd0aCAmJiBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICkge1xuXHRcdFx0XHR0YWJsZV9pdGVtcy5lYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoXG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCBpdGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpdGVtLnByb2R1Y3RfaWQgPT09IHBfaWQ7IH1cblx0XHRcdFx0XHRcdCkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBwX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHQkKCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRwcm9kdWN0cyxcblx0XHRcdFx0ZnVuY3Rpb24gKCBpZCwgaXRlbURhdGEgKSB7XG5cdFx0XHRcdFx0dmFyIHNhbWVfcHJvZHVjdHMgPSAkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC0nICsgaXRlbURhdGEucHJvZHVjdF9pZCApO1xuXHRcdFx0XHRcdHNhbWVfcHJvZHVjdHMuZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS1pdGVtLWlkJywgaXRlbURhdGEuaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcsIGl0ZW1EYXRhLndpc2hsaXN0X2lkICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13aXNobGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LnB1c2goIGl0ZW1EYXRhICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqIFNldCB0aGUgd2lzaGxpc3QgaGFzaCBpbiBib3RoIHNlc3Npb24gYW5kIGxvY2FsIHN0b3JhZ2UgKi9cblx0c2V0X3Byb2R1Y3RzX2hhc2g6IGZ1bmN0aW9uICggIHByb2R1Y3RzICkge1xuXHRcdGlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXksIHByb2R1Y3RzICk7XG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSAsIHByb2R1Y3RzICk7XG5cdFx0fVxuXHRcdCQuZm4uV0xGTUMuY2hlY2tfcHJvZHVjdHMoIEpTT04ucGFyc2UoIHByb2R1Y3RzICkgKTtcblx0fSxcblxuXHRzZXRfbGFuZ19oYXNoOiBmdW5jdGlvbiAoICBsYW5nICkge1xuXHRcdGlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSwgbGFuZyApO1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSAsIGxhbmcgKTtcblx0XHR9XG5cdH0sXG5cblx0dmFsaWRhdGVFbWFpbDogZnVuY3Rpb24gKGVtYWlsKSB7XG5cdFx0dmFyIHJlID1cblx0XHRcdC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvO1xuXHRcdHJldHVybiByZS50ZXN0KCBTdHJpbmcoIGVtYWlsICkudG9Mb3dlckNhc2UoKSApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBwYXNzZWQgdmFsdWUgY291bGQgYmUgY29uc2lkZXJlZCB0cnVlXG5cdCAqL1xuXHRpc1RydWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHJldHVybiB0cnVlID09PSB2YWx1ZSB8fCAneWVzJyA9PT0gdmFsdWUgfHwgJzEnID09PSB2YWx1ZSB8fCAxID09PSB2YWx1ZSB8fCAndHJ1ZScgPT09IHZhbHVlO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBkZXZpY2UgaXMgYW4gSU9TIGRldmljZVxuXHQgKi9cblx0aXNPUzogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKCAvaXBhZHxpcGhvbmUvaSApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBBZGQgbG9hZGluZyB0byBlbGVtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRsb2FkaW5nOiBmdW5jdGlvbiAoIGl0ZW0gKSB7XG5cdFx0aWYgKCBpdGVtLmZpbmQoICdpJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRpdGVtLmFkZENsYXNzKCAnd2xmbWMtYWN0aW9uIHdsZm1jLWxvYWRpbmcnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoICd3bGZtYy1hY3Rpb24gd2xmbWMtbG9hZGluZy1hbHQnICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZW1vdmUgbG9hZGluZyB0byBlbGVtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHR1bmxvYWRpbmc6IGZ1bmN0aW9uICggaXRlbSApIHtcblx0XHRpdGVtLnJlbW92ZUNsYXNzKCAnd2xmbWMtbG9hZGluZyB3bGZtYy1sb2FkaW5nLWFsdCcgKTtcblx0fSxcblxuXHQvKipcblx0ICogQmxvY2sgaXRlbSBpZiBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbSBqUXVlcnkgb2JqZWN0XG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0YmxvY2s6IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0aWYgKHR5cGVvZiAkLmZuLmJsb2NrICE9PSAndW5kZWZpbmVkJyAmJiB3bGZtY19sMTBuLmVuYWJsZV9hamF4X2xvYWRpbmcpIHtcblx0XHRcdGl0ZW0uZmFkZVRvKCAnNDAwJywgJzAuNicgKS5ibG9jayhcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0XHRcdFx0b3ZlcmxheUNTUzoge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZCAgICA6ICd0cmFuc3BhcmVudCB1cmwoJyArIHdsZm1jX2wxMG4uYWpheF9sb2FkZXJfdXJsICsgJykgbm8tcmVwZWF0IGNlbnRlcicsXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZTogJzQwcHggNDBweCcsXG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblxuXHR0YWJsZV9ibG9jazogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgJC5mbi5ibG9jayAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLXdyYXBwZXIsIC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZS13cmFwcGVyJyApLmZhZGVUbyggJzQwMCcsICcwLjYnICkuYmxvY2soXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtZXNzYWdlOiBudWxsLFxuXHRcdFx0XHRcdG92ZXJsYXlDU1M6IHtcblx0XHRcdFx0XHRcdGJhY2tncm91bmQgICAgOiAndHJhbnNwYXJlbnQgdXJsKCcgKyB3bGZtY19sMTBuLmFqYXhfbG9hZGVyX3VybCArICcpIG5vLXJlcGVhdCBjZW50ZXInLFxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZFNpemU6ICc4MHB4IDgwcHgnLFxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFVuYmxvY2sgaXRlbSBpZiBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbSBqUXVlcnkgb2JqZWN0XG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0dW5ibG9jazogZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRpZiAodHlwZW9mICQuZm4udW5ibG9jayAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGl0ZW0uc3RvcCggdHJ1ZSApLmNzcyggJ29wYWNpdHknLCAnMScgKS51bmJsb2NrKCk7XG5cdFx0XHQkKCAnLnRvb2x0aXBfX2V4cGFuZGVkJyApLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoICd0b29sdGlwX19oaWRkZW4nICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBjb29raWVzIGFyZSBlbmFibGVkXG5cdCAqXG5cdCAqIEByZXR1cm4gYm9vbGVhblxuXHQgKi9cblx0aXNfY29va2llX2VuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAobmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIHNldCBhbmQgcmVhZCBjb29raWUuXG5cdFx0ZG9jdW1lbnQuY29va2llID0gJ2Nvb2tpZXRlc3Q9MSc7XG5cdFx0dmFyIHJldCAgICAgICAgID0gZG9jdW1lbnQuY29va2llLmluZGV4T2YoICdjb29raWV0ZXN0PScgKSAhPT0gLTE7XG5cblx0XHQvLyBkZWxldGUgY29va2llLlxuXHRcdGRvY3VtZW50LmNvb2tpZSA9ICdjb29raWV0ZXN0PTE7IGV4cGlyZXM9VGh1LCAwMS1KYW4tMTk3MCAwMDowMDowMSBHTVQnO1xuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHRzZXRDb29raWU6IGZ1bmN0aW9uIChjb29raWVfbmFtZSwgdmFsdWUpIHtcblx0XHR2YXIgZXhkYXRlID0gbmV3IERhdGUoKTtcblx0XHRleGRhdGUuc2V0RGF0ZSggZXhkYXRlLmdldERhdGUoKSArICgzNjUgKiAyNSkgKTtcblx0XHRkb2N1bWVudC5jb29raWUgPSBjb29raWVfbmFtZSArIFwiPVwiICsgZXNjYXBlKCB2YWx1ZSApICsgXCI7IGV4cGlyZXM9XCIgKyBleGRhdGUudG9VVENTdHJpbmcoKSArIFwiOyBwYXRoPS9cIjtcblx0fSxcblxuXHR1cGRhdGVVUkxQYXJhbWV0ZXI6IGZ1bmN0aW9uICh1cmwsIHBhcmFtLCBwYXJhbVZhbCkge1xuXHRcdHZhciBuZXdBZGRpdGlvbmFsVVJMID0gXCJcIjtcblx0XHR2YXIgdGVtcEFycmF5ICAgICAgICA9IHVybC5zcGxpdCggXCI/XCIgKTtcblx0XHR2YXIgYmFzZVVSTCAgICAgICAgICA9IHRlbXBBcnJheVswXTtcblx0XHR2YXIgYWRkaXRpb25hbFVSTCAgICA9IHRlbXBBcnJheVsxXTtcblx0XHR2YXIgdGVtcCAgICAgICAgICAgICA9IFwiXCI7XG5cdFx0aWYgKGFkZGl0aW9uYWxVUkwpIHtcblx0XHRcdHRlbXBBcnJheSA9IGFkZGl0aW9uYWxVUkwuc3BsaXQoIFwiJlwiICk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodGVtcEFycmF5W2ldLnNwbGl0KCAnPScgKVswXSAhPT0gcGFyYW0pIHtcblx0XHRcdFx0XHRuZXdBZGRpdGlvbmFsVVJMICs9IHRlbXAgKyB0ZW1wQXJyYXlbaV07XG5cdFx0XHRcdFx0dGVtcCAgICAgICAgICAgICAgPSBcIiZcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciByb3dzX3R4dCA9IHRlbXAgKyBcIlwiICsgcGFyYW0gKyBcIj1cIiArIHBhcmFtVmFsLnJlcGxhY2UoICcjJywgJycgKTtcblx0XHRyZXR1cm4gYmFzZVVSTCArIFwiP1wiICsgbmV3QWRkaXRpb25hbFVSTCArIHJvd3NfdHh0O1xuXHR9LFxuXG5cdGdldFVybFBhcmFtZXRlcjogZnVuY3Rpb24gKHVybCwgc1BhcmFtKSB7XG5cdFx0dmFyIHNQYWdlVVJMICAgICAgPSBkZWNvZGVVUklDb21wb25lbnQoIHVybC5zdWJzdHJpbmcoIDEgKSApLFxuXHRcdFx0c1VSTFZhcmlhYmxlcyA9IHNQYWdlVVJMLnNwbGl0KCAvWyZ8P10rLyApLFxuXHRcdFx0c1BhcmFtZXRlck5hbWUsXG5cdFx0XHRpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHNVUkxWYXJpYWJsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNQYXJhbWV0ZXJOYW1lID0gc1VSTFZhcmlhYmxlc1tpXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdGlmIChzUGFyYW1ldGVyTmFtZVswXSA9PT0gc1BhcmFtKSB7XG5cdFx0XHRcdHJldHVybiBzUGFyYW1ldGVyTmFtZVsxXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNQYXJhbWV0ZXJOYW1lWzFdO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcbn07XG47XG5cblx0XHRcbnRvYXN0ci5vcHRpb25zID0ge1xuXHR0YXBUb0Rpc21pc3M6IHRydWUsXG5cdHRvYXN0Q2xhc3M6ICd0b2FzdCcsXG5cdGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcblx0ZGVidWc6IGZhbHNlLFxuXHRjbG9zZUJ1dHRvbjogZmFsc2UsXG5cdHNob3dNZXRob2Q6ICdmYWRlSW4nLFxuXHRzaG93RHVyYXRpb246IDMwMCxcblx0c2hvd0Vhc2luZzogJ3N3aW5nJyxcblx0b25TaG93bjogdW5kZWZpbmVkLFxuXHRoaWRlTWV0aG9kOiAnZmFkZU91dCcsXG5cdGhpZGVEdXJhdGlvbjogMTAwMCxcblx0aGlkZUVhc2luZzogJ3N3aW5nJyxcblx0b25IaWRkZW46IHVuZGVmaW5lZCxcblx0Y2xvc2VNZXRob2Q6IGZhbHNlLFxuXHRjbG9zZUR1cmF0aW9uOiBmYWxzZSxcblx0Y2xvc2VFYXNpbmc6IGZhbHNlLFxuXHRjbG9zZU9uSG92ZXI6IHRydWUsXG5cdGV4dGVuZGVkVGltZU91dDogMjAwMDAsXG5cdGljb25DbGFzc2VzOiB7XG5cdFx0ZXJyb3I6ICd0b2FzdC1lcnJvcicsXG5cdFx0aW5mbzogJ3RvYXN0LWluZm8nLFxuXHRcdHN1Y2Nlc3M6ICd0b2FzdC1zdWNjZXNzJyxcblx0XHR3YXJuaW5nOiAndG9hc3Qtd2FybmluZydcblx0fSxcblx0aWNvbkNsYXNzOiAndG9hc3QtaW5mbycsXG5cdHBvc2l0aW9uQ2xhc3M6IHdsZm1jX2wxMG4udG9hc3RfcG9zaXRpb24gPT09ICdkZWZhdWx0JyA/ICh3bGZtY19sMTBuLmlzX3J0bCA/ICd0b2FzdC10b3AtcmlnaHQnIDogJ3RvYXN0LXRvcC1sZWZ0JykgOiB3bGZtY19sMTBuLnRvYXN0X3Bvc2l0aW9uLFxuXHR0aW1lT3V0OiA1MDAwLFxuXHR0aXRsZUNsYXNzOiAndG9hc3QtdGl0bGUnLFxuXHRtZXNzYWdlQ2xhc3M6ICd0b2FzdC1tZXNzYWdlJyxcblx0ZXNjYXBlSHRtbDogZmFsc2UsXG5cdHRhcmdldDogJ2JvZHknLFxuXHRuZXdlc3RPblRvcDogdHJ1ZSxcblx0cHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuXHRwcm9ncmVzc0JhcjogdHJ1ZSxcblx0cHJvZ3Jlc3NDbGFzczogJ3RvYXN0LXByb2dyZXNzJyxcblx0cnRsOiAod2xmbWNfbDEwbi5pc19ydGwpID8gdHJ1ZSA6IGZhbHNlXG59XG47XG5cblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J3dsZm1jX2luaXQnLFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9maXhfb25faW1hZ2Vfc2luZ2xlX3Bvc2l0aW9uKCk7XG5cblx0XHRcdFx0dmFyIHQgICAgICAgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGIgICAgICAgICAgICAgICAgICAgICAgID0gJCggJ2JvZHknICksXG5cdFx0XHRcdFx0Y2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSAodHlwZW9mICh3Y19hZGRfdG9fY2FydF9wYXJhbXMpICE9PSAndW5kZWZpbmVkJyAmJiB3Y19hZGRfdG9fY2FydF9wYXJhbXMgIT09IG51bGwpID8gd2NfYWRkX3RvX2NhcnRfcGFyYW1zLmNhcnRfcmVkaXJlY3RfYWZ0ZXJfYWRkIDogJyc7XG5cdFx0XHRcdFxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1saXN0IGJ1dHRvbltuYW1lPVwiYXBwbHlfYnVsa19hY3Rpb25zXCJdJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0bGV0IGVsZW0gPSAgJCggdGhpcyApLmNsb3Nlc3QoJy5hY3Rpb24td3JhcHBlcicpLmZpbmQoJ3NlbGVjdFtuYW1lPVwiYnVsa19hY3Rpb25zXCJdJyk7XG5cdFx0bGV0IHF1YW50aXR5X2ZpZWxkcyA9ICQoIHRoaXMgKS5jbG9zZXN0KCdmb3JtJykuZmluZCgnaW5wdXQucXR5Jyk7XG5cdFx0aWYgKCBlbGVtLmxlbmd0aCA+IDAgJiYgJ2RlbGV0ZScgPT09IGVsZW0udmFsKCkgJiYgcXVhbnRpdHlfZmllbGRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRxdWFudGl0eV9maWVsZHMuYXR0ciggXCJkaXNhYmxlZFwiLHRydWUgKTtcblx0XHR9XG5cdH1cbik7XG5cbmIub24oXG5cdCdjaGFuZ2UnLFxuXHQnI2J1bGtfYWRkX3RvX2NhcnQsI2J1bGtfYWRkX3RvX2NhcnQyJyxcblx0ZnVuY3Rpb24gKCkge1xuXHRcdHZhciB0ICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0Y2hlY2tib3hlcyA9IHQuY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkuZmluZCggJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXTpub3QoOmRpc2FibGVkKScgKTtcblx0XHRpZiAodC5pcyggJzpjaGVja2VkJyApKSB7XG5cdFx0XHRjaGVja2JveGVzLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydCcgKS5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0MicgKS5wcm9wKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjaGVja2JveGVzLnByb3AoICdjaGVja2VkJywgZmFsc2UgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0JyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydDInICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdH1cblx0fVxuKTtcblxuXG5iLm9uKFxuXHQnc3VibWl0Jyxcblx0Jy53bGZtYy1wb3B1cC1mb3JtJyxcblx0ZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxudC5vbihcblx0J2ZvdW5kX3ZhcmlhdGlvbicsXG5cdGZ1bmN0aW9uIChldiwgdmFyaWF0aW9uKSB7XG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgICAgID0gdC5kYXRhKCAncHJvZHVjdF9pZCcgKSxcblx0XHRcdHZhcmlhdGlvbl9kYXRhICAgICAgICA9IHZhcmlhdGlvbjtcblx0XHR2YXJpYXRpb25fZGF0YS5wcm9kdWN0X2lkID0gcHJvZHVjdF9pZDtcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3bGZtY19zaG93X3ZhcmlhdGlvbicsIHZhcmlhdGlvbl9kYXRhICk7XG5cdH1cbik7XG5cbnQub24oICd3bGZtY19yZWxvYWRfZnJhZ21lbnRzJywgJC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cyApO1xuXG50Lm9uKFxuXHQnd2xmbWNfZnJhZ21lbnRzX2xvYWRlZCcsXG5cdGZ1bmN0aW9uIChldiwgb3JpZ2luYWwsIHVwZGF0ZSwgZmlyc3RMb2FkKSB7XG5cdFx0aWYgKCAhIGZpcnN0TG9hZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQoICcudmFyaWF0aW9uc19mb3JtJyApLmZpbmQoICcudmFyaWF0aW9ucyBzZWxlY3QnICkubGFzdCgpLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cbik7XG5cbi8qID09PSBUQUJTID09PSAqL1xuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy10YWJzIGE6bm90KC5leHRlcm5hbC1saW5rKScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGNvbnRlbnQgPSAkKCB0aGlzICkuZGF0YSggJ2NvbnRlbnQnICk7XG5cdFx0JCggJy53bGZtYy10YWItY29udGVudCcgKS5oaWRlKCk7XG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtdGFicy13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnYWN0aXZlLXRhYi1jYXJ0IGFjdGl2ZS10YWItc2F2ZS1mb3ItbGF0ZXInICk7XG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmFkZENsYXNzKCAnYWN0aXZlLXRhYi0nICsgY29udGVudCApO1xuXHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLXRhYnMtd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLXRhYnMgYScgKS5yZW1vdmVDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXHRcdCQoIHRoaXMgKS5hZGRDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXHRcdCQoICcud2xmbWNfY29udGVudF8nICsgY29udGVudCApLnNob3coKTtcblx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoICcnLCAnJywgJC5mbi5XTEZNQy51cGRhdGVVUkxQYXJhbWV0ZXIoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBcInRhYlwiLCBjb250ZW50ICkgKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbi8qID09PSBHRFBSID09PSAqL1xuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1nZHByLWJ0bicsXG5cdGZ1bmN0aW9uKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgZWxlbSAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRhY3Rpb25fdHlwZSA9IGVsZW0uZGF0YSggJ2FjdGlvbicgKSxcblx0XHRcdGNpZCAgICAgICAgID0gZWxlbS5kYXRhKCAnY2lkJyApO1xuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuZ2Rwcl9hY3Rpb24sXG5cdFx0XHRcdFx0bm9uY2U6IGVsZW0uZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0J2FjdGlvbl90eXBlJyA6IGFjdGlvbl90eXBlLFxuXHRcdFx0XHRcdCdjaWQnIDogY2lkXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggZWxlbSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGlmICggISBkYXRhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKCAnLndsZm1jLWdkcHItbm90aWNlLXdyYXBwZXIsIC53bGZtYy11bnN1YnNjcmliZS1ub3RpY2Utd3JhcHBlcicpLnJlbW92ZSgpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHR9XG5cdFx0KTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG47XG5cdFx0XHRcdC8qID09PSBXSVNITElTVCA9PT0gKi9cblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hZGRfdG9fd2lzaGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCBwcm9kdWN0X2FkZGluZyAmJiBBcnJheS5pc0FycmF5KHByb2R1Y3RfaW5fbGlzdCkgJiYgISBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICkge1xuXHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X2FkZGluZyApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgICAgICAgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0cGFyZW50X3Byb2R1Y3RfaWQgPSB0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJyApLFxuXHRcdFx0ZWxfd3JhcCAgICAgICAgICAgPSB0LmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBwcm9kdWN0X2lkICksXG5cdFx0XHRmaWx0ZXJlZF9kYXRhICAgICA9IG51bGwsXG5cdFx0XHRkYXRhICAgICAgICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3RvX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0YWRkX3RvX3dpc2hsaXN0OiBwcm9kdWN0X2lkLFxuXHRcdFx0XHRwcm9kdWN0X3R5cGU6IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC10eXBlJyApLFxuXHRcdFx0XHQvLyB3aXNobGlzdF9pZDogdC5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcgKSxcblx0XHRcdFx0Ly8gZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoIHByb2R1Y3RfaWQgKVxuXHRcdFx0fTtcblx0XHQvLyBhbGxvdyB0aGlyZCBwYXJ0eSBjb2RlIHRvIGZpbHRlciBkYXRhLlxuXHRcdGlmIChmaWx0ZXJlZF9kYXRhID09PSAkKCBkb2N1bWVudCApLnRyaWdnZXJIYW5kbGVyKCAnd2xmbWNfYWRkX3RvX3dpc2hsaXN0X2RhdGEnLCBbdCwgZGF0YV0gKSkge1xuXHRcdFx0ZGF0YSA9IGZpbHRlcmVkX2RhdGE7XG5cdFx0fVxuXG5cdFx0bGV0IGN1cnJlbnRfcHJvZHVjdF9mb3JtO1xuXG5cdFx0aWYgKCAkKCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggdGhpcyApLmNsb3Nlc3QoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoICcjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0uY2FydFttZXRob2Q9cG9zdF0sI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdJyApLmxlbmd0aCAgKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkuZXEoIDAgKTtcblxuXHRcdH0gZWxzZSBpZiAoICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKS5sZW5ndGggKSB7XG5cblx0XHRcdGxldCBidXR0b24gPSAkKCdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBpbnB1dFtuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCdmb3JtJykuZXEoIDAgKTtcblxuXHRcdH1cblxuXHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdGlmICggIHR5cGVvZiBjdXJyZW50X3Byb2R1Y3RfZm9ybSAhPT0gJ3VuZGVmaW5lZCcgJiYgY3VycmVudF9wcm9kdWN0X2Zvcm0ubGVuZ3RoID4gMCkge1xuXHRcdFx0LypjdXJyZW50X3Byb2R1Y3RfZm9ybS5maW5kKCBcImlucHV0W25hbWU9J2FkZC10by1jYXJ0J11cIiApLmF0dHIoIFwiZGlzYWJsZWRcIix0cnVlICk7XG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybS5maW5kKCBcImlucHV0W25hbWU9J2FkZC10by1jYXJ0J11cIiApLnJlbW92ZUF0dHIoIFwiZGlzYWJsZWRcIiApOyovXG5cdFx0XHRmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSggY3VycmVudF9wcm9kdWN0X2Zvcm0uZ2V0KCAwICkgKTtcblx0XHRcdC8qJC5lYWNoKFxuXHRcdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSxcblx0XHRcdFx0ZnVuY3Rpb24oIGluZGV4LCBlbGVtZW50ICkge1xuXHRcdFx0XHRcdCQoIGVsZW1lbnQgKS5maW5kKCAnZGl2LmNvbXBvc2l0ZV9jb21wb25lbnQnICkubm90KCAnOnZpc2libGUnICkuZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgaWQgPSAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaXRlbV9pZCcgKTtcblx0XHRcdFx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCAnd2NjcF9jb21wb25lbnRfc2VsZWN0aW9uX25pbFsnICsgaWQgKyAnXScgLCAnMScgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHQpOyovXG5cdFx0XHRmb3JtRGF0YS5kZWxldGUoICdhZGQtdG8tY2FydCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IGFkZF90b19jYXJ0X2xpbmsgPSB0LmNsb3Nlc3QoICcucHJvZHVjdC5wb3N0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCApLmZpbmQoICcuYWRkX3RvX2NhcnRfYnV0dG9uJyApO1xuXHRcdFx0aWYgKCBhZGRfdG9fY2FydF9saW5rLmxlbmd0aCApIHtcblx0XHRcdFx0ZGF0YS5xdWFudGl0eSA9IGFkZF90b19jYXJ0X2xpbmsuYXR0ciggJ2RhdGEtcXVhbnRpdHknICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JC5lYWNoKFxuXHRcdFx0ZGF0YSxcblx0XHRcdGZ1bmN0aW9uKGtleSx2YWx1ZU9iail7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCgga2V5ICwgdHlwZW9mIHZhbHVlT2JqID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KCB2YWx1ZU9iaiApIDogdmFsdWVPYmogKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ3dsZm1jX2FkZGluZ190b193aXNobGlzdCcgKTtcblxuXHRcdGlmICggISAkLmZuLldMRk1DLmlzX2Nvb2tpZV9lbmFibGVkKCkpIHtcblx0XHRcdHByb2R1Y3RfYWRkaW5nID0gZmFsc2U7XG5cdFx0XHR3aW5kb3cuYWxlcnQoIHdsZm1jX2wxMG4ubGFiZWxzLmNvb2tpZV9kaXNhYmxlZCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBmb3JtRGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHQvL2RhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcblx0XHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxuXHRcdFx0XHRjYWNoZTogZmFsc2UsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHJvZHVjdF9hZGRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRwcm9kdWN0X2FkZGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VfcmVzdWx0ICA9IHJlc3BvbnNlLnJlc3VsdCxcblx0XHRcdFx0XHRcdHJlc3BvbnNlX21lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICA9IHRydWU7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnIHx8IHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ2V4aXN0cycpIHtcblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlLml0ZW1faWQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QucHVzaChcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2lzaGxpc3RfaWQ6IHJlc3BvbnNlLndpc2hsaXN0X2lkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtX2lkOiByZXNwb25zZS5pdGVtX2lkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2lkOiBwYXJzZUludCggcHJvZHVjdF9pZCApLFxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIHBvcHVwX2lkID0gZWxfd3JhcC5hdHRyKCAnZGF0YS1wb3B1cC1pZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKHBvcHVwX2lkKSB7XG5cblx0XHRcdFx0XHRcdFx0c2hvd190b2FzdCAgICAgICAgID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHZhciBlbGVtICAgICAgICAgICA9ICQoICcjJyArIHBvcHVwX2lkICk7XG5cdFx0XHRcdFx0XHRcdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0XHRhYnNvbHV0ZTogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICcjMzMzJyxcblx0XHRcdFx0XHRcdFx0XHR0cmFuc2l0aW9uOiAnYWxsIDAuM3MnLFxuXHRcdFx0XHRcdFx0XHRcdGhvcml6b250YWw6IGVsZW0uZGF0YSggJ2hvcml6b250YWwnICksXG5cdFx0XHRcdFx0XHRcdFx0dmVydGljYWw6IGVsZW0uZGF0YSggJ3ZlcnRpY2FsJyApXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGVsZW0ucG9wdXAoIGRlZmF1bHRPcHRpb25zICk7XG5cdFx0XHRcdFx0XHRcdCQoJyN3bGZtYy10b29sdGlwJylcblx0XHRcdFx0XHRcdFx0XHQuY3NzKHtcblx0XHRcdFx0XHRcdFx0XHRcdCd0b3AnOiAnMCcsXG5cdFx0XHRcdFx0XHRcdFx0XHQnbGVmdCc6ICcwJ1xuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKClcblx0XHRcdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ3Rvb2x0aXBfX2hpZGRlbicpO1xuXHRcdFx0XHRcdFx0XHRlbGVtLnBvcHVwKCAnc2hvdycgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9hZGRlZF90ZXh0ICkgJiYgcmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScpIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfYWRkZWRfdGV4dCApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfYXV0b21hdGlvbnMoIHByb2R1Y3RfaWQsIHJlc3BvbnNlLndpc2hsaXN0X2lkLCByZXNwb25zZS5jdXN0b21lcl9pZCwgJ3dpc2hsaXN0JywgcmVzcG9uc2UubG9hZF9hdXRvbWF0aW9uX25vbmNlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJyAmJiB3bGZtY19sMTBuLmNsaWNrX2JlaGF2aW9yID09PSAnYWRkLXJlZGlyZWN0JyApIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2xmbWNfbDEwbi53aXNobGlzdF9wYWdlX3VybDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHNob3dfdG9hc3QgJiYgJycgIT09ICQudHJpbSggcmVzcG9uc2UubWVzc2FnZSApICYmIHJlc3BvbnNlX3Jlc3VsdCAhPT0gJ3RydWUnICkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblxuXHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19hZGRlZF90b193aXNobGlzdCcsIFt0LCBlbF93cmFwXSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfYWpheF9hZGRfdG9fY2FydDpub3QoLmRpc2FibGVkKScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGl0ZW1faWQgICAgID0gdC5hdHRyKCAnZGF0YS1pdGVtX2lkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0X2lkJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmFkZF90b19jYXJ0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHQuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRsaWQ6IGl0ZW1faWQsXG5cdFx0XHRcdHdpZDogd2lzaGxpc3RfaWQsXG5cdFx0XHR9O1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR0LnJlbW92ZUNsYXNzKCAnYWRkZWQnICk7XG5cdFx0dC5hZGRDbGFzcyggJ2xvYWRpbmcnICk7XG5cblx0XHQvLyBBbGxvdyAzcmQgcGFydGllcyB0byB2YWxpZGF0ZSBhbmQgcXVpdCBlYXJseS5cblx0XHRpZiAoIGZhbHNlID09PSAkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlckhhbmRsZXIoICdzaG91bGRfc2VuZF9hamF4X3JlcXVlc3QuYWRkaW5nX3RvX2NhcnQnLCBbIHQgXSApICkge1xuXHRcdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhamF4X3JlcXVlc3Rfbm90X3NlbnQuYWRkaW5nX3RvX2NhcnQnLCBbIGZhbHNlLCBmYWxzZSwgdCBdICk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0JCggZG9jdW1lbnQuYm9keSApLnRyaWdnZXIoICdhZGRpbmdfdG9fY2FydCcsIFsgdCwgZGF0YSBdICk7XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hZG1pbl91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cblx0XHRcdFx0XHRpZiAoICEgcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZS5lcnJvciB8fCAoIHJlc3BvbnNlLnN1Y2Nlc3MgJiYgISAkLmZuLldMRk1DLmlzVHJ1ZSggcmVzcG9uc2Uuc3VjY2VzcyApICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLnByb2R1Y3RfdXJsICkge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSByZXNwb25zZS5wcm9kdWN0X3VybDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCAnJyAhPT0gd2xmbWNfbDEwbi5sYWJlbHMuZmFpbGVkX2FkZF90b19jYXJ0X21lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMuZmFpbGVkX2FkZF90b19jYXJ0X21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gUmVkaXJlY3QgdG8gY2FydCBvcHRpb24uXG5cdFx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgKSApIHtcblx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uID0gd2NfYWRkX3RvX2NhcnRfcGFyYW1zLmNhcnRfdXJsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlcignd2NfZnJhZ21lbnRfcmVmcmVzaCcpO1xuXHRcdFx0XHRcdFx0Ly8gVHJpZ2dlciBldmVudCBzbyB0aGVtZXMgY2FuIHJlZnJlc2ggb3RoZXIgYXJlYXMuXG5cdFx0XHRcdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FkZGVkX3RvX2NhcnQnLCBbIHJlc3BvbnNlLmZyYWdtZW50cywgcmVzcG9uc2UuY2FydF9oYXNoLCB0IF0gKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAnJyAhPT0gd2xmbWNfbDEwbi5sYWJlbHMuYWRkZWRfdG9fY2FydF9tZXNzYWdlICkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcyggd2xmbWNfbDEwbi5sYWJlbHMuYWRkZWRfdG9fY2FydF9tZXNzYWdlICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLm1lc3NhZ2UgJiYgJycgIT09IHJlc3BvbnNlLm1lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FkZF90b19jYXJ0X21lc3NhZ2UnLCBbIHJlc3BvbnNlLm1lc3NhZ2UsIHRdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWMtYnRuLWxvZ2luLW5lZWQnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMubG9naW5fbmVlZCApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hbHJlYWR5X2luX3dpc2hsaXN0Jyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLmFscmVhZHlfaW5fd2lzaGxpc3RfdGV4dCApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy13aXNobGlzdC10YWJsZSAucmVtb3ZlX2Zyb21fd2lzaGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCA9ICQoIHRoaXMgKTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIHRhYmxlICAgICAgICAgID0gdC5wYXJlbnRzKCAnLndsZm1jLXdpc2hsaXN0LWl0ZW1zLXdyYXBwZXInICksXG5cdFx0XHRyb3cgICAgICAgICAgICA9IHQucGFyZW50cyggJ1tkYXRhLXJvdy1pZF0nICksXG5cdFx0XHRkYXRhX3Jvd19pZCAgICA9IHJvdy5kYXRhKCAncm93LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgICAgPSB0YWJsZS5kYXRhKCAnaWQnICksXG5cdFx0XHR3aXNobGlzdF90b2tlbiA9IHRhYmxlLmRhdGEoICd0b2tlbicgKSxcblx0XHRcdGRhdGEgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5yZW1vdmVfZnJvbV93aXNobGlzdF9hY3Rpb24sXG5cdFx0XHRcdG5vbmNlOiB0LmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0cmVtb3ZlX2Zyb21fd2lzaGxpc3Q6IGRhdGFfcm93X2lkLFxuXHRcdFx0XHR3aXNobGlzdF9pZDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X3Rva2VuOiB3aXNobGlzdF90b2tlbixcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggZGF0YV9yb3dfaWQgKVxuXHRcdFx0fTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmJsb2NrKCByb3cgKTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5ibG9jayggcm93ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0bGV0IGk7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdC8qaWYgKHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdHJvdy5hZGRDbGFzcygnZGlzYWJsZWQtcm93Jyk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl9saXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdFtpXS53aXNobGlzdF9pZCA9PSB3aXNobGlzdF9pZCAmJiBwcm9kdWN0X2luX2xpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX3JlbW92ZWRfZnJvbV93aXNobGlzdCcsIFt0LCByb3cgLCBkYXRhXSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPD0gcHJvZHVjdF9jb3VudCAtIDE7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl93YWl0bGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl93YWl0bGlzdFtpXS53aXNobGlzdF9pZCA9PSB3aXNobGlzdF9pZCAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLnByb2R1Y3RfaWQgPT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dhaXRsaXN0JywgW3QsIHJvdyAsIGRhdGFdICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfd2FpdGxpc3RfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fd2FpdGxpc3QgKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2luaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrIHRvdWNoZW5kJyxcblx0Jy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdpc2hsaXN0IC5yZW1vdmVfZnJvbV93aXNobGlzdCwud2xmbWMtcHJvZHVjdHMtY291bnRlci13YWl0bGlzdCAucmVtb3ZlX2Zyb21fd2lzaGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCA9ICQoIHRoaXMgKTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIHRhYmxlICAgICAgICAgID0gdC5wYXJlbnRzKCAnLndsZm1jLXdpc2hsaXN0LWl0ZW1zLXdyYXBwZXInICksXG5cdFx0XHRyb3cgICAgICAgICAgICA9IHQucGFyZW50cyggJ1tkYXRhLXJvdy1pZF0nICksXG5cdFx0XHRkYXRhX3Jvd19pZCAgICA9IHJvdy5kYXRhKCAncm93LWlkJyApLFxuXHRcdFx0ZGF0YV9pdGVtX2lkICAgPSByb3cuZGF0YSggJ2l0ZW0taWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCAgICA9IHJvdy5kYXRhKCAnd2lzaGxpc3QtaWQnICksXG5cdFx0XHR3aXNobGlzdF90b2tlbiA9IHJvdy5kYXRhKCAnd2lzaGxpc3QtdG9rZW4nICksXG5cdFx0XHRsaXN0X3RhYmxlICAgICAgICAgICAgICAgICAgPSAkKCcud2xmbWMtd2lzaGxpc3QtZm9ybSAud2xmbWMtd2lzaGxpc3QtdGFibGUnKSxcblx0XHRcdGRhdGEgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5yZW1vdmVfZnJvbV93aXNobGlzdF9hY3Rpb24sXG5cdFx0XHRcdG5vbmNlOiB0LmRhdGEoICdub25jZScgKSxcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0cmVtb3ZlX2Zyb21fd2lzaGxpc3Q6IGRhdGFfcm93X2lkLFxuXHRcdFx0XHR3aXNobGlzdF9pZDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X3Rva2VuOiB3aXNobGlzdF90b2tlbixcblx0XHRcdFx0bWVyZ2VfbGlzdHM6IHdsZm1jX2wxMG4ubWVyZ2VfbGlzdHMsXG5cdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoIGRhdGFfcm93X2lkIClcblx0XHRcdH07XG5cblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblxuXHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIGRhdGEucmVzdWx0ICkgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbG9hZF9mcmFnID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl9saXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gcHJvZHVjdF9jb3VudCAtIDE7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3RbaV0ud2lzaGxpc3RfaWQgPT09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fbGlzdFtpXS5wcm9kdWN0X2lkID09PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX3JlbW92ZWRfZnJvbV93aXNobGlzdCcsIFt0LCByb3csIGRhdGFdICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl93YWl0bGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl93YWl0bGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLndpc2hsaXN0X2lkID09PSB3aXNobGlzdF9pZCAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLnByb2R1Y3RfaWQgPT09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX3dhaXRsaXN0LnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX3JlbW92ZWRfZnJvbV93YWl0bGlzdCcsIFt0LCByb3csIGRhdGFdICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfd2FpdGxpc3RfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fd2FpdGxpc3QgKSApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoIHQuY2xvc2VzdCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXInICkubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJ1tkYXRhLWl0ZW0taWQ9XCInICsgZGF0YV9pdGVtX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0Ly8kKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJ1tkYXRhLWl0ZW0taWQ9XCInICsgZGF0YV9pdGVtX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXIgIC5wcm9kdWN0cy1jb3VudGVyLW51bWJlcicgKS50ZXh0KCBkYXRhLmNvdW50ICk7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13aXNobGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIGRhdGEuY291bnQgKTtcblxuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIHQuY2xvc2VzdCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXInICkubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJ1tkYXRhLWl0ZW0taWQ9XCInICsgZGF0YV9pdGVtX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0Ly8kKCAnLndsZm1jLXdpc2hsaXN0LWZvcm0nICkuZmluZCggJ1tkYXRhLWl0ZW0taWQ9XCInICsgZGF0YV9pdGVtX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXIgIC5wcm9kdWN0cy1jb3VudGVyLW51bWJlcicgKS50ZXh0KCBkYXRhLmNvdW50ICk7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13YWl0bGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIGRhdGEuY291bnQgKTtcblxuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdC53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIGxpc3RfdGFibGUubGVuZ3RoID4gMCAmJiBwYXJzZUludCggd2lzaGxpc3RfaWQgKSA9PT0gcGFyc2VJbnQoIGxpc3RfdGFibGUuYXR0ciggJ2RhdGEtaWQnICkgKSApIHtcblx0XHRcdFx0XHRcdFx0bGlzdF90YWJsZS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLmFkZENsYXNzKCdkaXNhYmxlZC1yb3cnKTtcblx0XHRcdFx0XHRcdFx0bG9hZF9mcmFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgoZGF0YS5jb3VudCA8IDEgfHwgISB0YWJsZS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5sZW5ndGgpICkge1xuXHRcdFx0XHRcdFx0XHRsb2FkX2ZyYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoIGxvYWRfZnJhZyApIHtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LyppZiAoKGRhdGEuY291bnQgPCAxIHx8ICEgdGFibGUuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkubGVuZ3RoKSAmJiB0eXBlb2YgZGF0YS5mcmFnbWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCBkYXRhLmZyYWdtZW50cyApO1xuXHRcdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbik7XG5cbmIub24oXG5cdCdjbGljaycsXG5cdCcud2xmbWNfZGVsZXRlX2l0ZW0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRwcm9kdWN0X2lkICA9IHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkID0gdC5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcgKSxcblx0XHRcdGl0ZW1faWQgICAgID0gdC5hdHRyKCAnZGF0YS1pdGVtLWlkJyApLFxuXHRcdFx0ZWxfd3JhcCAgICAgPSAkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC0nICsgcHJvZHVjdF9pZCApLFxuXHRcdFx0ZGF0YSAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmRlbGV0ZV9pdGVtX2FjdGlvbixcblx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0d2lzaGxpc3RfaWQ6IHdpc2hsaXN0X2lkLFxuXHRcdFx0XHRpdGVtX2lkOiBpdGVtX2lkLFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKCBwcm9kdWN0X2lkIClcblx0XHRcdH07XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHQkLmFqYXgoXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCB0ICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdHZhciBmcmFnbWVudHMgICAgICAgID0gcmVzcG9uc2UuZnJhZ21lbnRzLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG5cblx0XHRcdFx0XHRpZiAoJ3RydWUnID09PSByZXNwb25zZS5yZXN1bHQpIHtcblx0XHRcdFx0XHRcdGVsX3dyYXAucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBwcm9kdWN0X2luX2xpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdCAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCA9ICQuZ3JlcChcblx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QsXG5cdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBlLml0ZW1faWQgIT09IHBhcnNlSW50KCBpdGVtX2lkICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCAhIHQuY2xvc2VzdCggJy53bGZtYy1yZW1vdmUtYnV0dG9uJyApLmxlbmd0aCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZV9tZXNzYWdlICkpIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciggcmVzcG9uc2VfbWVzc2FnZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJ3RydWUnID09PSByZXNwb25zZS5yZXN1bHQgJiYgJycgIT09ICQudHJpbSggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9yZW1vdmVkX3RleHQgKSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X3JlbW92ZWRfdGV4dCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0LyppZiAodHlwZW9mIGZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHJlcGxhY2VfZnJhZ21lbnRzKCBmcmFnbWVudHMgKTtcblx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cblx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dpc2hsaXN0JywgW3QsIGVsX3dyYXAsIHJlc3BvbnNlXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxudC5vbihcblx0J3dsZm1jX3Nob3dfdmFyaWF0aW9uJyAsXG5cdGZ1bmN0aW9uIChldiwgZGF0YSkge1xuXHRcdHZhciB0ICAgICAgICAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSBkYXRhLnByb2R1Y3RfaWQsXG5cdFx0XHR2YXJpYXRpb25faWQgICAgICA9IGRhdGEudmFyaWF0aW9uX2lkLFxuXHRcdFx0dGFyZ2V0cyAgICAgICAgICAgPSAkKCAnLndsZm1jLWFkZC10by13aXNobGlzdCBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKSxcblx0XHRcdGVuYWJsZV9vdXRvZnN0b2NrID0gdGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5kYXRhKCAnZW5hYmxlLW91dG9mc3RvY2snICk7XG5cdFx0aWYgKCAhIHByb2R1Y3RfaWQgfHwgISB2YXJpYXRpb25faWQgfHwgISB0YXJnZXRzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoICEgZW5hYmxlX291dG9mc3RvY2sgJiYgISBkYXRhLmlzX2luX3N0b2NrKSB7XG5cdFx0XHR0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLmFkZENsYXNzKCAnaGlkZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0fVxuXHRcdHZhciBwb3B1cElkID0gdGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5hdHRyKCAnZGF0YS1wb3B1cC1pZCcgKTtcblx0XHRpZiAoIHBvcHVwSWQgKSB7XG5cdFx0XHR2YXIgcG9wdXAgICA9ICQoJyMnICsgcG9wdXBJZCk7XG5cdFx0XHRpZiAocG9wdXAubGVuZ3RoKSB7XG5cdFx0XHRcdHZhciBwcm9kdWN0X3RpdGxlICA9IHBvcHVwLmRhdGEoICdwcm9kdWN0LXRpdGxlJyApO1xuXHRcdFx0XHR2YXIgZGVzYyAgICAgICAgICAgPSB3bGZtY19sMTBuLmxhYmVscy5wb3B1cF9jb250ZW50O1xuXHRcdFx0XHR2YXIgdGl0bGUgICAgICAgICAgPSB3bGZtY19sMTBuLmxhYmVscy5wb3B1cF90aXRsZTtcblx0XHRcdFx0dmFyIGltYWdlX3NpemUgICAgID0gcG9wdXAuZGF0YSggJ2ltYWdlLXNpemUnICk7XG5cdFx0XHRcdHZhciBpbWcgICAgICAgICAgICA9IHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtaGVhZGVyIGltZycgKS5kYXRhKCAnc3JjJyApO1xuXHRcdFx0XHR2YXIgb3JpZ2luYWxfcHJpY2UgPSBwb3B1cC5maW5kKCAnLndsZm1jLXBhcmVudC1wcm9kdWN0LXByaWNlJyApLmh0bWwoKTtcblx0XHRcdFx0dmFyIHByb2R1Y3RfcHJpY2UgID0gJycgIT09IGRhdGEucHJpY2VfaHRtbCA/IGRhdGEucHJpY2VfaHRtbCA6IG9yaWdpbmFsX3ByaWNlO1xuXG5cdFx0XHRcdGRlc2MgPSBkZXNjLnJlcGxhY2UoICd7cHJvZHVjdF9wcmljZX0nLCBwcm9kdWN0X3ByaWNlICk7XG5cdFx0XHRcdGRlc2MgPSBkZXNjLnJlcGxhY2UoICd7cHJvZHVjdF9uYW1lfScsIHByb2R1Y3RfdGl0bGUgKTtcblxuXHRcdFx0XHR0aXRsZSA9IHRpdGxlLnJlcGxhY2UoICd7cHJvZHVjdF9wcmljZX0nLCBwcm9kdWN0X3ByaWNlICk7XG5cdFx0XHRcdHRpdGxlID0gdGl0bGUucmVwbGFjZSggJ3twcm9kdWN0X25hbWV9JywgcHJvZHVjdF90aXRsZSApO1xuXG5cdFx0XHRcdGlmIChkYXRhLmltYWdlX2lkICYmICd0cnVlJyA9PSBwb3B1cC5kYXRhKCAndXNlLWZlYXR1cmVkJyApKSB7XG5cdFx0XHRcdFx0aW1nID0gJ2xhcmdlJyA9PT0gaW1hZ2Vfc2l6ZSA/IGRhdGEuaW1hZ2UuZnVsbF9zcmMgOiAoJ3RodW1ibmFpbCcgPT09IGltYWdlX3NpemUgPyBkYXRhLmltYWdlLnRodW1iX3NyYyA6IGRhdGEuaW1hZ2Uuc3JjKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtdGl0bGUnICkuaHRtbCggdGl0bGUgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1kZXNjJyApLmh0bWwoIGRlc2MgKTtcblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1oZWFkZXIgaW1nJyApLmF0dHIoICdzcmMnLCBpbWcgKTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRhcmdldHMuZWFjaChcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdFx0XHRjb250YWluZXIgPSB0LmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApO1xuXG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cdFx0XHRcdHQuYXR0ciggJ2RhdGEtcHJvZHVjdC1pZCcsIHZhcmlhdGlvbl9pZCApO1xuXG5cdFx0XHRcdGlmIChjb250YWluZXIubGVuZ3RoKSB7XG5cblx0XHRcdFx0XHRjb250YWluZXJcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKGksIGNsYXNzZXMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xhc3Nlcy5tYXRjaCggL3dsZm1jLWFkZC10by13aXNobGlzdC1cXFMrL2cgKS5qb2luKCAnICcgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCAnd2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyB2YXJpYXRpb25faWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1hZGR0b3dpc2hsaXN0IGEnICkuYXR0ciggJ2hyZWYnLCBjb250YWluZXIuYXR0ciggJ2RhdGEtYWRkLXVybCcgKS5yZXBsYWNlKCBcIiNwcm9kdWN0X2lkXCIsIHZhcmlhdGlvbl9pZCApICk7XG5cdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLXJlbW92ZWZyb213aXNobGlzdCBhJyApLmF0dHIoICdocmVmJywgY29udGFpbmVyLmF0dHIoICdkYXRhLXJlbW92ZS11cmwnICkucmVwbGFjZSggXCIjcHJvZHVjdF9pZFwiLCB2YXJpYXRpb25faWQgKSApO1xuXHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHYgIT09ICd1bmRlZmluZWQnICYmIHYucHJvZHVjdF9pZCAmJiB2LnByb2R1Y3RfaWQgPT0gdmFyaWF0aW9uX2lkKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWNfZGVsZXRlX2l0ZW0nICkuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnLCB2Lndpc2hsaXN0X2lkICk7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLWl0ZW0taWQnLCB2Lml0ZW1faWQgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG4pO1xudC5vbihcblx0J3Jlc2V0X2RhdGEnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgdCAgICAgICAgICA9ICQoIGV2LnRhcmdldCApLFxuXHRcdFx0cHJvZHVjdF9pZCA9IHQuZGF0YSggJ3Byb2R1Y3RfaWQnICksXG5cdFx0XHR0YXJnZXRzICAgID0gJCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QgW2RhdGEtcGFyZW50LXByb2R1Y3QtaWQ9XCInICsgcHJvZHVjdF9pZCArICdcIl0nICk7XG5cdFx0aWYgKCAhIHByb2R1Y3RfaWQgfHwgISB0YXJnZXRzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkucmVtb3ZlQ2xhc3MoICdoaWRlJyApO1xuXHRcdHZhciBwb3B1cElkID0gdGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5hdHRyKCAnZGF0YS1wb3B1cC1pZCcgKTtcblx0XHRpZiAoIHBvcHVwSWQgKSB7XG5cdFx0XHR2YXIgcG9wdXAgICA9ICQoJyMnICsgcG9wdXBJZCk7XG5cdFx0XHRpZiAocG9wdXAubGVuZ3RoKSB7XG5cdFx0XHRcdHZhciBvcmlnaW5hbF9wcmljZSA9IHBvcHVwLmZpbmQoICcud2xmbWMtcGFyZW50LXByb2R1Y3QtcHJpY2UnICkuaHRtbCgpO1xuXHRcdFx0XHR2YXIgcHJvZHVjdF90aXRsZSAgPSBwb3B1cC5kYXRhKCAncHJvZHVjdC10aXRsZScgKTtcblx0XHRcdFx0dmFyIGRlc2MgICAgICAgICAgID0gd2xmbWNfbDEwbi5sYWJlbHMucG9wdXBfY29udGVudDtcblx0XHRcdFx0dmFyIHRpdGxlICAgICAgICAgID0gd2xmbWNfbDEwbi5sYWJlbHMucG9wdXBfdGl0bGU7XG5cblx0XHRcdFx0dmFyIGltZyA9IHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtaGVhZGVyIGltZycgKS5kYXRhKCAnc3JjJyApO1xuXG5cdFx0XHRcdGRlc2MgPSBkZXNjLnJlcGxhY2UoICd7cHJvZHVjdF9wcmljZX0nLCBvcmlnaW5hbF9wcmljZSApO1xuXHRcdFx0XHRkZXNjID0gZGVzYy5yZXBsYWNlKCAne3Byb2R1Y3RfbmFtZX0nLCBwcm9kdWN0X3RpdGxlICk7XG5cblx0XHRcdFx0dGl0bGUgPSB0aXRsZS5yZXBsYWNlKCAne3Byb2R1Y3RfcHJpY2V9Jywgb3JpZ2luYWxfcHJpY2UgKTtcblx0XHRcdFx0dGl0bGUgPSB0aXRsZS5yZXBsYWNlKCAne3Byb2R1Y3RfbmFtZX0nLCBwcm9kdWN0X3RpdGxlICk7XG5cblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC10aXRsZScgKS5odG1sKCB0aXRsZSApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWRlc2MnICkuaHRtbCggZGVzYyApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWhlYWRlciBpbWcnICkuYXR0ciggJ3NyYycsIGltZyApO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdCAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICk7XG5cblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXG5cdFx0XHRcdGlmIChjb250YWluZXIubGVuZ3RoKSB7XG5cblx0XHRcdFx0XHRjb250YWluZXJcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKGksIGNsYXNzZXMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xhc3Nlcy5tYXRjaCggL3dsZm1jLWFkZC10by13aXNobGlzdC1cXFMrL2cgKS5qb2luKCAnICcgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCAnd2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBwcm9kdWN0X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtYWRkdG93aXNobGlzdCBhJyApLmF0dHIoICdocmVmJywgY29udGFpbmVyLmF0dHIoICdkYXRhLWFkZC11cmwnICkucmVwbGFjZSggXCIjcHJvZHVjdF9pZFwiLCBwcm9kdWN0X2lkICkgKTtcblx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtcmVtb3ZlZnJvbXdpc2hsaXN0IGEnICkuYXR0ciggJ2hyZWYnLCBjb250YWluZXIuYXR0ciggJ2RhdGEtcmVtb3ZlLXVybCcgKS5yZXBsYWNlKCBcIiNwcm9kdWN0X2lkXCIsIHByb2R1Y3RfaWQgKSApO1xuXHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHYgIT09ICd1bmRlZmluZWQnICYmIHYucHJvZHVjdF9pZCAmJiB2LnByb2R1Y3RfaWQgPT0gcHJvZHVjdF9pZCkge1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJywgdi53aXNobGlzdF9pZCApO1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS1pdGVtLWlkJywgdi5pdGVtX2lkICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHR9XG4pO1xuO1xuXHRcdFx0XHRcblxudC5vbihcblx0J2FkZGluZ190b19jYXJ0Jyxcblx0J2JvZHknLFxuXHRmdW5jdGlvbiAoZXYsIGJ1dHRvbiwgZGF0YSkge1xuXHRcdGlmICh0eXBlb2YgYnV0dG9uICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmxlbmd0aCkge1xuXHRcdFx0ZGF0YS53aXNobGlzdF9pZCAgID0gYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmRhdGEoICdpZCcgKTtcblx0XHRcdGRhdGEud2lzaGxpc3RfdHlwZSA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnd2lzaGxpc3QtdHlwZScgKTtcblx0XHRcdGRhdGEuY3VzdG9tZXJfaWQgICA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnY3VzdG9tZXItaWQnICk7XG5cdFx0XHRkYXRhLmlzX293bmVyICAgICAgPSBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZGF0YSggJ2lzLW93bmVyJyApO1xuXHRcdFx0dHlwZW9mIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKCB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSB3bGZtY19sMTBuLnJlZGlyZWN0X3RvX2NhcnQgKTtcblxuXHRcdFx0LypsZXQgcHJvZHVjdF9tZXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gYnV0dG9uLmRhdGEoICd3bGZtY19wcm9kdWN0X21ldGEnICk7XG5cdFx0XHRpZiAocHJvZHVjdF9tZXRhKSB7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X21ldGEsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGssdmFsdWUpIHtcblx0XHRcdFx0XHRcdGRhdGFba10gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGRhdGEud2xmbWNfcHJvZHVjdF9tZXRhID0gdHJ1ZTtcblx0XHRcdH0qL1xuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2FkZGVkX3RvX2NhcnQnLFxuXHQnYm9keScsXG5cdGZ1bmN0aW9uIChldiwgZnJhZ21lbnRzLCBjYXJ0aGFzaCwgYnV0dG9uKSB7XG5cdFx0aWYgKHR5cGVvZiBidXR0b24gIT09ICd1bmRlZmluZWQnICYmIGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlJyApLmxlbmd0aCkge1xuXHRcdFx0dHlwZW9mIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKCB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgPSBjYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCApO1xuXG5cdFx0XHR2YXIgdHIgICAgIFx0XHQgICA9IGJ1dHRvbi5jbG9zZXN0KCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdFx0dGFibGUgIFx0XHQgICA9IHRyLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICksXG5cdFx0XHRcdG9wdGlvbnNcdFx0ICAgPSB0YWJsZS5kYXRhKCAnZnJhZ21lbnQtb3B0aW9ucycgKSxcblx0XHRcdFx0ZGF0YV9yb3dfaWQgICAgPSB0ci5kYXRhKCAncm93LWlkJyApLFxuXHRcdFx0XHR3aXNobGlzdF9pZCAgICA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ2lkJyApLFxuXHRcdFx0XHR3aXNobGlzdF90b2tlbiA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ3Rva2VuJyApLFxuXHRcdFx0XHRsaXN0X3R5cGUgICAgICA9IHRhYmxlLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkuZGF0YSggJ3dpc2hsaXN0LXR5cGUnICksXG5cdFx0XHRcdHJlbG9hZF9mcmFnbWVudCA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHRcdHRyLmZpbmQoICcuYWRkZWRfdG9fY2FydCcgKS5yZW1vdmUoKTtcblx0XHRcdGlmICh3bGZtY19sMTBuLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FmdGVyX2FkZF90b19jYXJ0ICYmIG9wdGlvbnMuaXNfdXNlcl9vd25lcikge1xuXG5cdFx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIGRhdGFfcm93X2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblxuXHRcdFx0XHRpZiAoICd3aXNobGlzdCcgPT09IGxpc3RfdHlwZSApIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHR2YXIgcHJvZHVjdF9jb3VudCA9IHByb2R1Y3RfaW5fbGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3RbaV0ud2lzaGxpc3RfaWQgPT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl9saXN0W2ldLnByb2R1Y3RfaWQgPT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtcm93LWlkPVwiJyArIGRhdGFfcm93X2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyIC5wcm9kdWN0cy1jb3VudGVyLW51bWJlcicgKS50ZXh0KCBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2lzaGxpc3QgLnRvdGFsLXByb2R1Y3RzIC53bGZtYy10b3RhbC1jb3VudCcgKS50ZXh0KCBwcm9kdWN0X2luX2xpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13aXNobGlzdC53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cdFx0XHRcdFx0XHRpZiAoKCAhIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggfHwgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCA9PT0gMCB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13aXNobGlzdC10YWJsZS13cmFwcGVyJyApLmVtcHR5KCk7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMucmVsb2FkX2ZyYWdtZW50ID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoICd3YWl0bGlzdCcgPT09IGxpc3RfdHlwZSApIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdGxldCBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3dhaXRsaXN0X2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX3dhaXRsaXN0ICkgKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgZGF0YV9yb3dfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXIgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoICk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLWFkZC10by13YWl0bGlzdC53bGZtYy1hZGQtdG8td2FpdGxpc3QtJyArIGRhdGFfcm93X2lkICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cblx0XHRcdFx0XHRcdGlmICggKCAhIHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoIHx8IHByb2R1Y3RfaW5fd2FpdGxpc3QubGVuZ3RoID09PSAwIHx8ICEgdGFibGUuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkubGVuZ3RoKSkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZWxvYWRfZnJhZ21lbnQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggJ2xpc3RzJyA9PT0gbGlzdF90eXBlICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMucmVsb2FkX2ZyYWdtZW50ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcmVsb2FkX2ZyYWdtZW50ICkge1xuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYnV0dG9uICE9PSAndW5kZWZpbmVkJyAmJiBidXR0b24uY2xvc2VzdCggJy53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5sZW5ndGgpIHtcblx0XHRcdHZhciB0ciAgICAgICAgICAgPSBidXR0b24uY2xvc2VzdCggJ1tkYXRhLWl0ZW0taWRdJyApLFxuXHRcdFx0XHR0YWJsZSAgICAgICAgPSB0ci5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApLFxuXHRcdFx0XHRvcHRpb25zICAgICAgPSB0YWJsZS5kYXRhKCAnZnJhZ21lbnQtb3B0aW9ucycgKSxcblx0XHRcdFx0ZGF0YV9pdGVtX2lkID0gdHIuZGF0YSggJ2l0ZW0taWQnICk7XG5cdFx0XHRidXR0b24ucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHRcdHRyLmZpbmQoICcuYWRkZWRfdG9fY2FydCcgKS5yZW1vdmUoKTtcblx0XHRcdGlmICggb3B0aW9ucy5pc191c2VyX293bmVyKSB7XG5cdFx0XHRcdCQoICcud2xmbWMtc2F2ZS1mb3ItbGF0ZXItZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoICEgJCggJy53bGZtYy1zYXZlLWZvci1sYXRlci1pdGVtcy13cmFwcGVyIC5zYXZlLWZvci1sYXRlci1pdGVtcy13cmFwcGVyIHRyJyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuKTtcblxudC5vbihcblx0J2FkZF90b19jYXJ0X21lc3NhZ2UnLFxuXHQnYm9keScsXG5cdGZ1bmN0aW9uICggZSwgbWVzc2FnZSwgdCApIHtcblx0XHR2YXIgd3JhcHBlciA9ICQoICcud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyIC53b29jb21tZXJjZS1lcnJvciwud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyIC53b29jb21tZXJjZS1tZXNzYWdlJyApO1xuXG5cdFx0dC5yZW1vdmVDbGFzcyggJ2xvYWRpbmcnICk7XG5cdFx0aWYgKHdyYXBwZXIubGVuZ3RoID09PSAwKSB7XG5cdFx0XHQkKCAnI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkucHJlcGVuZCggbWVzc2FnZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3cmFwcGVyLmZhZGVPdXQoXG5cdFx0XHRcdDMwMCxcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCcud29vY29tbWVyY2Utbm90aWNlcy13cmFwcGVyJykucmVwbGFjZVdpdGgoIG1lc3NhZ2UgKS5mYWRlSW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbik7XG5cbnQub24oICdjYXJ0X3BhZ2VfcmVmcmVzaGVkJywgJ2JvZHknLCAkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCApO1xuO1xuXHRcdFx0XHQvKiA9PT0gRFJPUERPV04gQ09VTlRFUiA9PT0gKi9cblxuaWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCkpIHtcblx0dmFyIHdsZm1jX3N3aXBlX3RyaWdnZXI7XG5cdGIub24oXG5cdFx0J3RvdWNoc3RhcnQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3Zlciwud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljaycsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdHdsZm1jX3N3aXBlX3RyaWdnZXIgPSBmYWxzZTtcblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2htb3ZlJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIsLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2snLFxuXHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR3bGZtY19zd2lwZV90cmlnZ2VyID0gdHJ1ZTtcblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2hlbmQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24sLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2sgIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBlbGVtID0gJCh0aGlzKS5jbG9zZXN0KCcud2xmbWMtY291bnRlci13cmFwcGVyJyk7XG5cdFx0XHRpZiAoZWxlbS5oYXNDbGFzcyggJ3dsZm1jLWZpcnN0LXRvdWNoJyApKSB7XG5cdFx0XHRcdGlmICggISB3bGZtY19zd2lwZV90cmlnZ2VyKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5oaWRlX21pbmlfd2lzaGxpc3QuY2FsbCggJCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICksIGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkLmZuLldMRk1DLnNob3dfbWluaV93aXNobGlzdC5jYWxsKCB0aGlzLCBlICk7XG5cdFx0XHRcdGVsZW0uYWRkQ2xhc3MoICd3bGZtYy1maXJzdC10b3VjaCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQndG91Y2hlbmQnLFxuXHRcdCc6bm90KC53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyKTpub3QoLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24tY2xpY2spJyxcblx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKCQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMuaGlkZV9taW5pX3dpc2hsaXN0LmNhbGwoICQoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLCBlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXHQvLyBmaXggdXJsIGluIGRyb3Bkb3duIGluIGlwaG9uZSBkZXZpY2VzXG5cdGIub24oXG5cdFx0J3RvdWNoZW5kJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24gYTpub3QoLnJlbW92ZV9mcm9tX3dpc2hsaXN0KScsXG5cdFx0ZnVuY3Rpb24oZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xufSBlbHNlIHtcblx0Yi5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdFx0JC5mbi5XTEZNQy5hcHBlbmR0b0JvZHkoIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkgKTtcblx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cdFx0XHRlbGVtLnRvZ2dsZUNsYXNzKCAnbGlzdHMtc2hvdycgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cblx0dC5vbihcblx0XHRcImNsaWNrXCIsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoXCIud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd25cIik7XG5cdFx0XHRpZiAoJHRyaWdnZXIgIT09IGV2LnRhcmdldCAmJiAhICR0cmlnZ2VyLmhhcyggZXYudGFyZ2V0ICkubGVuZ3RoKSB7XG5cdFx0XHRcdCQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKS5yZW1vdmVDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Yi5vbihcblx0XHQnbW91c2VvdmVyJyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXItZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcblx0Yi5vbihcblx0XHQnbW91c2VvdXQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXHRiLm9uKFxuXHRcdCdtb3VzZW92ZXInLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKSB8fCAkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApO1xuXHRcdFx0JCggZWxlbSApLmFkZENsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0JC5mbi5XTEZNQy5hcHBlbmR0b0JvZHkoIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkgKTtcblx0XHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cdGIub24oXG5cdFx0J21vdXNlb3V0Jyxcblx0XHQnLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBlbGVtID0gJCggJy5kcm9wZG93bl8nICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWlkJyApICk7XG5cdFx0XHQkKCBlbGVtICkucmVtb3ZlQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXG5cdCQoICcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nICkuaG92ZXJJbnRlbnQoXG5cdFx0e1xuXHRcdFx0aW50ZXJ2YWw6IDAsXG5cdFx0XHR0aW1lb3V0OiAxMDAsXG5cdFx0XHRvdmVyOiAkLmZuLldMRk1DLnNob3dfbWluaV93aXNobGlzdCxcblx0XHRcdG91dDogJC5mbi5XTEZNQy5oaWRlX21pbmlfd2lzaGxpc3Rcblx0XHR9XG5cdCk7XG59XG47XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3ByZXBhcmVfcXR5X2xpbmtzKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3dpc2hsaXN0X3BvcHVwKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3F1YW50aXR5KCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NvcHlfd2lzaGxpc3RfbGluaygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF90b29sdGlwKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2NvbXBvbmVudHMoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcG9wdXBzKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3BvcHVwX2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cdFx0XHR9XG5cdFx0KS50cmlnZ2VyKCAnd2xmbWNfaW5pdCcgKTtcblxuXHRcdC8vIGZpeCB3aXRoIGpldCB3b28gYnVpbGRlciBwbHVnaW4uXG5cbiQoIGRvY3VtZW50IClcblx0Lm9uKCAnamV0LWZpbHRlci1jb250ZW50LXJlbmRlcmVkJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKVxuXHQub24oICdqZXQtd29vLWJ1aWxkZXItY29udGVudC1yZW5kZXJlZCcsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jIClcblx0Lm9uKCAnamV0LWVuZ2luZS9saXN0aW5nLWdyaWQvYWZ0ZXItbG9hZC1tb3JlJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKVxuXHQub24oICdqZXQtZW5naW5lL2xpc3RpbmctZ3JpZC9hZnRlci1sYXp5LWxvYWQnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApXG5cdC5vbiggJ2pldC1jdy1sb2FkZWQnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApO1xuLy8gbG9hZCBmcmFnbWVudCBmb3IgZml4IGZpbHRlciBldmVyeXRoaW5nIGFqYXggcmVzcG9uc2UuXG4kKCBkb2N1bWVudCApLnJlYWR5KCAkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzICk7XG4vLyBsb2FkIGZyYWdtZW50IGZvciBmaXggYnVnIHdpdGggYWpheCBmaWx0ZXIgRGVzdGlueSBFbGVtZW50cyBwbHVnaW5cbiQoIGRvY3VtZW50ICkub24oICdkZUNvbnRlbnRMb2FkZWQnICwgJC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cyApO1xuLy8gZml4IHdhaXRsaXN0IHBvcHVwIGFmdGVyIHdwYyBjb21wb3NpdGUgcHJvZHVjdCBnYWxsZXJ5IGxvYWRlZCBpbiBzaW5nbGUgcHJvZHVjdCBwYWdlXG4kKCBkb2N1bWVudCApLm9uKCAnd29vY29fZ2FsbGVyeV9sb2FkZWQnLCBmdW5jdGlvbiggZSwgcHJvZHVjdF9pZCApIHtcblx0aWYgKCBwcm9kdWN0X2lkICkge1xuXHRcdCQoJypbaWRePVwiYWRkX3RvX3dhaXRsaXN0X3BvcHVwXycgKyBwcm9kdWN0X2lkICsgJ19cIl0ucG9wdXBfd3JhcHBlcicpLnJlbW92ZSgpO1xuXHR9XG59KTtcbjtcblxuXHRcdFxudmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG5cdGZ1bmN0aW9uKG11dGF0aW9ucykge1xuXHRcdG11dGF0aW9ucy5mb3JFYWNoKFxuXHRcdFx0ZnVuY3Rpb24obXV0YXRpb24pIHtcblx0XHRcdFx0aWYgKCAkKCAnLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeV9fd3JhcHBlciAud2xmbWMtdG9wLW9mLWltYWdlJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2ZpeF9vbl9pbWFnZV9zaW5nbGVfcG9zaXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBmaXggdG9wIG9mIGltYWdlIGZvciBwb3dlci1wYWNrIHNpbmdsZSBwcm9kdWN0LlxuXHRcdFx0XHRpZiAoICQoICcucHAtc2luZ2xlLXByb2R1Y3QgLmVudHJ5LXN1bW1hcnkgPiAud2xmbWMtdG9wLW9mLWltYWdlJyApLmxlbmd0aCA+IDAgJiYgJCggJy5wcC1zaW5nbGUtcHJvZHVjdCAuZW50cnktc3VtbWFyeSAuc2luZ2xlLXByb2R1Y3QtaW1hZ2UnICkubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHQkKCAnLnBwLXNpbmdsZS1wcm9kdWN0JyApLmVhY2goXG5cdFx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0dmFyICR3bGZtY1RvcE9mSW1hZ2UgICAgPSAkKCB0aGlzICkuZmluZCggJy53bGZtYy10b3Atb2YtaW1hZ2UnICk7XG5cdFx0XHRcdFx0XHRcdHZhciAkc2luZ2xlUHJvZHVjdEltYWdlID0gJCggdGhpcyApLmZpbmQoICcuc2luZ2xlLXByb2R1Y3QtaW1hZ2UnICk7XG5cdFx0XHRcdFx0XHRcdGlmICggJHdsZm1jVG9wT2ZJbWFnZS5sZW5ndGggPiAwICYmICRzaW5nbGVQcm9kdWN0SW1hZ2UubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdCR3bGZtY1RvcE9mSW1hZ2UuYXBwZW5kVG8oICRzaW5nbGVQcm9kdWN0SW1hZ2UgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG4pO1xub2JzZXJ2ZXIub2JzZXJ2ZSggJCggJ2JvZHknIClbMF0sIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0gKTtcbjtcblxuXHRcdC8qID09PSBEUk9QRE9XTiBDT1VOVEVSID09PSAqL1xuXG4kKCB3aW5kb3cgKS5vbihcblx0XCJzY3JvbGwgcmVzaXplXCIsXG5cdGZ1bmN0aW9uKCkge1xuXHRcdCQoIFwiLndsZm1jLWNvdW50ZXItZHJvcGRvd25cIiApLmVhY2goXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0JC5mbi5XTEZNQy5wcmVwYXJlX21pbmlfd2lzaGxpc3QoICQoIHRoaXMgKSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbik7XG47XG5cblx0XHQvKiBTdG9yYWdlIEhhbmRsaW5nICovXG5cbnZhciAkc3VwcG9ydHNfaHRtbDVfc3RvcmFnZSA9IHRydWUsXG5cdHdpc2hsaXN0X2hhc2hfa2V5ICAgICAgID0gd2xmbWNfbDEwbi53aXNobGlzdF9oYXNoX2tleSxcblx0cHJvZHVjdHNfaGFzaF9rZXkgXHRcdD0gd2lzaGxpc3RfaGFzaF9rZXkgKyAnX3Byb2R1Y3RzJyxcblx0bGFuZ19oYXNoX2tleVx0XHRcdD0gd2lzaGxpc3RfaGFzaF9rZXkgKyAnX2xhbmcnO1xuXG50cnkge1xuXHQkc3VwcG9ydHNfaHRtbDVfc3RvcmFnZSA9ICggJ3Nlc3Npb25TdG9yYWdlJyBpbiB3aW5kb3cgJiYgd2luZG93LnNlc3Npb25TdG9yYWdlICE9PSBudWxsICk7XG5cdHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCAnd2xmbWMnLCAndGVzdCcgKTtcblx0d2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oICd3bGZtYycgKTtcblx0d2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCAnd2xmbWMnLCAndGVzdCcgKTtcblx0d2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCAnd2xmbWMnICk7XG59IGNhdGNoICggZXJyICkge1xuXHQkc3VwcG9ydHNfaHRtbDVfc3RvcmFnZSA9IGZhbHNlO1xufVxuXG5pZiAoIHdsZm1jX2wxMG4uaXNfY2FjaGVfZW5hYmxlZCAmJiB3bGZtY19sMTBuLmlzX3BhZ2VfY2FjaGVfZW5hYmxlZCApIHtcblx0JC5mbi5XTEZNQy50YWJsZV9ibG9jaygpO1xufVxuXG4vKiBXaXNobGlzdCBIYW5kbGluZyAqL1xuaWYgKCAkc3VwcG9ydHNfaHRtbDVfc3RvcmFnZSApIHtcblxuXHQvLyBSZWZyZXNoIHdoZW4gc3RvcmFnZSBjaGFuZ2VzIGluIGFub3RoZXIgdGFiLlxuXHQkKCB3aW5kb3cgKS5vbihcblx0XHQnc3RvcmFnZSBvbnN0b3JhZ2UnLFxuXHRcdGZ1bmN0aW9uICggZSApIHtcblx0XHRcdGlmICggKCBwcm9kdWN0c19oYXNoX2tleSA9PT0gZS5vcmlnaW5hbEV2ZW50LmtleSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXkgKSAhPT0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXkgKSApICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdC8vIFJlZnJlc2ggd2hlbiBwYWdlIGlzIHNob3duIGFmdGVyIGJhY2sgYnV0dG9uIChzYWZhcmkpLlxuXHQkKCB3aW5kb3cgKS5vbihcblx0XHQncGFnZXNob3cnICxcblx0XHRmdW5jdGlvbiggZSApIHtcblx0XHRcdGlmICggZS5vcmlnaW5hbEV2ZW50LnBlcnNpc3RlZCApIHtcblx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHR0cnkge1xuXG5cdFx0aWYgKCB3bGZtY19sMTBuLmlzX2NhY2hlX2VuYWJsZWQgKSB7XG5cdFx0XHR0aHJvdyAnTmVlZCBVcGRhdGUgd2lzaGxpc3QgZGF0YSc7XG5cdFx0fVxuXHRcdGlmICggd2xmbWNfbDEwbi51cGRhdGVfd2lzaGxpc3RzX2RhdGEgfHwgKCBudWxsICE9PSBsYW5nICYmIGxhbmcgIT09IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBsYW5nX2hhc2hfa2V5ICkgKSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXkgKSAhPT0gSlNPTi5zdHJpbmdpZnkoIHdpc2hsaXN0X2l0ZW1zICkgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXksICcnICk7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSwgJycgKTtcblx0XHRcdCQuZm4uV0xGTUMuY2hlY2tfcHJvZHVjdHMoIHdpc2hsaXN0X2l0ZW1zICk7XG5cdFx0XHR0aHJvdyAnTmVlZCBVcGRhdGUgd2lzaGxpc3QgZGF0YSc7XG5cdFx0fVxuXG5cdFx0aWYgKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXkgKSApIHtcblx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHByb2R1Y3RzX2hhc2hfa2V5ICkgKTtcblx0XHRcdGlmICgnb2JqZWN0JyA9PT0gX3R5cGVvZiggZGF0YSApICYmIG51bGwgIT09IGRhdGEgKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMuY2hlY2tfcHJvZHVjdHMoIGRhdGEgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmZuLldMRk1DLnVuYmxvY2soICQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUtd3JhcHBlciwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkgKTtcblxuXHRcdCQoICcjd2xmbWMtbGlzdHMsI3dsZm1jLXdpc2hsaXN0LWZvcm0nICkuYWRkQ2xhc3MoICdvbi1maXJzdC1sb2FkJyApO1xuXG5cdH0gY2F0Y2ggKCBlcnIgKSB7XG5cdFx0Y29uc29sZS5sb2coIGVyciApO1xuXHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0fVxuXG59IGVsc2Uge1xuXHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG59XG47XG5cblx0XHRcbnZhciBoYXNTZWxlY3RpdmVSZWZyZXNoID0gKFxuXHQndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdwICYmXG5cdHdwLmN1c3RvbWl6ZSAmJlxuXHR3cC5jdXN0b21pemUuc2VsZWN0aXZlUmVmcmVzaCAmJlxuXHR3cC5jdXN0b21pemUud2lkZ2V0c1ByZXZpZXcgJiZcblx0d3AuY3VzdG9taXplLndpZGdldHNQcmV2aWV3LldpZGdldFBhcnRpYWxcbik7XG5pZiAoIGhhc1NlbGVjdGl2ZVJlZnJlc2ggKSB7XG5cdHdwLmN1c3RvbWl6ZS5zZWxlY3RpdmVSZWZyZXNoLmJpbmQoXG5cdFx0J3BhcnRpYWwtY29udGVudC1yZW5kZXJlZCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0fVxuXHQpO1xufVxuO1xuXG5cdH0pO1xufSkoalF1ZXJ5KTtcbiJdfQ==
