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
        //this.init_drag_n_drop();
        //this.init_popup_checkbox_handling();
        //this.init_dropdown_lists();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQyxVQUFVLENBQUMsRUFBRTtFQUNiLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUNkLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWTtJQUM3QjtJQUNBLElBQUksZUFBZSxHQUFPLEVBQUU7TUFDM0IsSUFBSSxHQUFrQixVQUFVLENBQUMsSUFBSTtNQUNyQyxlQUFlLEdBQU8sSUFBSTtNQUMxQixjQUFjLEdBQVEsVUFBVSxDQUFDLGNBQWM7TUFDL0MsY0FBYyxHQUFRLEtBQUs7TUFDM0IsV0FBVztNQUNYLGVBQWU7SUFHbEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUc7TUFDWixzQkFBc0IsRUFBRSxTQUFBLHVCQUFBLEVBQVk7UUFDbkMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFFLGlDQUFrQyxDQUFDO1FBRXhFLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDbkIsT0FBTyxLQUFLO1FBQ2I7UUFFQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtVQUNwQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFFLFFBQVMsQ0FBQyxFQUFFO1lBQzFDLE9BQU8sS0FBSztVQUNiO1VBRUEsSUFBSSxJQUFJLEdBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBRSw2Q0FBOEMsQ0FBQztZQUNoRixLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FB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QUFxRSxDQUFFLENBQUM7UUFFL0YsQ0FBQyxDQUFFLG1DQUFvQyxDQUFDLENBQUMsUUFBUSxDQUFFLGVBQWdCLENBQUM7TUFFckUsQ0FBQyxDQUFDLE9BQVEsR0FBRyxFQUFHO1FBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFJLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7TUFDNUI7SUFFRCxDQUFDLE1BQU07TUFDTixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1QjtJQUNBO0lBR0EsSUFBSSxtQkFBbUIsR0FDdEIsV0FBVyxLQUFLLE9BQU8sRUFBRSxJQUN6QixFQUFFLENBQUMsU0FBUyxJQUNaLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLElBQzdCLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxJQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxhQUM1QjtJQUNELElBQUssbUJBQW1CLEVBQUc7TUFDMUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQ2pDLDBCQUEwQixFQUMxQixZQUFXO1FBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7TUFDNUIsQ0FDRCxDQUFDO0lBQ0Y7SUFDQTtFQUVDLENBQUMsQ0FBQztBQUNILENBQUMsRUFBRSxNQUFNLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIE1haW4gU21hcnQgV29vQ29tbWVyY2UgV2lzaGxpc3QgSlNcbiAqXG4gKiBAYXV0aG9yIE1vcmVDb252ZXJ0XG4gKiBAcGFja2FnZSBTbWFydCBXaXNobGlzdCBGb3IgTW9yZSBDb252ZXJ0XG4gKlxuICogQHZlcnNpb24gMS44LjRcbiAqL1xuXG4vKmpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuKGZ1bmN0aW9uICgkKSB7XG5cdCQubm9Db25mbGljdCgpO1xuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0LyogPT09IE1BSU4gSU5JVCA9PT0gKi9cblx0XHR2YXIgcHJvZHVjdF9pbl9saXN0ICAgICA9IFtdICxcblx0XHRcdGxhbmcgICAgICAgICAgICAgICAgPSB3bGZtY19sMTBuLmxhbmcsXG5cdFx0XHRyZW1vdmVfaXRlbV91cmwgICAgID0gbnVsbCxcblx0XHRcdHdpc2hsaXN0X2l0ZW1zICAgICAgPSB3bGZtY19sMTBuLndpc2hsaXN0X2l0ZW1zLFxuXHRcdFx0cHJvZHVjdF9hZGRpbmcgICAgICA9IGZhbHNlLFxuXHRcdFx0ZnJhZ21lbnR4aHIsXG5cdFx0XHRmcmFnbWVudHRpbWVvdXQ7XG5cblx0XHRcbiQuZm4uV0xGTUMgPSB7XG5cdGluaXRfcHJlcGFyZV9xdHlfbGlua3M6IGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgcXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy53bGZtYy13aXNobGlzdC10YWJsZSAucXVhbnRpdHknICk7XG5cblx0XHRpZiAocXR5Lmxlbmd0aCA8IDEpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHF0eS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHF0eVtpXS5jbGFzc0xpc3QuY29udGFpbnMoICdoaWRkZW4nICkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcGx1cyAgPSBxdHlbaV0ucXVlcnlTZWxlY3RvciggJy5ib3RpZ2EtcXVhbnRpdHktcGx1cywgYS5wbHVzLCAuY3QtaW5jcmVhc2UnICksXG5cdFx0XHRcdG1pbnVzID0gcXR5W2ldLnF1ZXJ5U2VsZWN0b3IoICcuYm90aWdhLXF1YW50aXR5LW1pbnVzLCBhLm1pbnVzLCAuY3QtZGVjcmVhc2UnICk7XG5cblx0XHRcdGlmICggISBwbHVzIHx8ICEgbWludXMgfHwgcGx1cy5sZW5ndGggPCAxIHx8IG1pbnVzLmxlbmd0aCA8IDEgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHBsdXMuY2xhc3NMaXN0LmFkZCggJ3Nob3cnICk7XG5cdFx0XHRtaW51cy5jbGFzc0xpc3QuYWRkKCAnc2hvdycgKTtcblx0XHRcdHZhciBwbHVzX2Nsb25lICA9IHBsdXMuY2xvbmVOb2RlKCB0cnVlICksXG5cdFx0XHRcdG1pbnVzX2Nsb25lID0gbWludXMuY2xvbmVOb2RlKCB0cnVlICk7XG5cdFx0XHRwbHVzX2Nsb25lLmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdCdjbGljaycsXG5cdFx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciBpbnB1dCAgICAgICA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCAnLnF0eScgKSxcblx0XHRcdFx0XHRcdHZhbCAgICAgICAgID0gcGFyc2VGbG9hdCggaW5wdXQudmFsdWUsIDEwICkgfHwgMCxcblx0XHRcdFx0XHRcdGNoYW5nZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdIVE1MRXZlbnRzJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWF4X3ZhbCA9IChpbnB1dC5nZXRBdHRyaWJ1dGUoIFwibWF4XCIgKSAmJiBwYXJzZUZsb2F0KCBpbnB1dC5nZXRBdHRyaWJ1dGUoIFwibWF4XCIgKSwgMCApKSB8fCAxIC8gMDtcblx0XHRcdFx0XHRpbnB1dC52YWx1ZSAgID0gdmFsIDwgbWF4X3ZhbCA/IE1hdGgucm91bmQoIDEwMCAqICh2YWwgKyBwYXJzZUZsb2F0KCBpbnB1dC5zdGVwIHx8IFwiMVwiICkpICkgLyAxMDAgOiBtYXhfdmFsO1xuXG5cdFx0XHRcdFx0Ly8gaW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZSA9PT0gJycgPyAwIDogcGFyc2VJbnQoIGlucHV0LnZhbHVlICkgKyAxO1xuXHRcdFx0XHRcdGNoYW5nZUV2ZW50LmluaXRFdmVudCggJ2NoYW5nZScsIHRydWUsIGZhbHNlICk7XG5cdFx0XHRcdFx0aW5wdXQuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0XHRtaW51c19jbG9uZS5hZGRFdmVudExpc3RlbmVyKFxuXHRcdFx0XHQnY2xpY2snLFxuXHRcdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR2YXIgaW5wdXQgICAgICAgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvciggJy5xdHknICksXG5cdFx0XHRcdFx0XHR2YWwgICAgICAgICA9IHBhcnNlRmxvYXQoIGlucHV0LnZhbHVlLCAxMCApIHx8IDAsXG5cdFx0XHRcdFx0XHRjaGFuZ2VFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnSFRNTEV2ZW50cycgKTtcblx0XHRcdFx0XHRjb25zdCBtaW5fdmFsICAgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoIFwibWluXCIgKSA/IE1hdGgucm91bmQoIDEwMCAqIHBhcnNlRmxvYXQoIGlucHV0LmdldEF0dHJpYnV0ZSggXCJtaW5cIiApLCAwICkgKSAvIDEwMCA6IDA7XG5cdFx0XHRcdFx0aW5wdXQudmFsdWUgICAgID0gdmFsID4gbWluX3ZhbCA/IE1hdGgucm91bmQoIDEwMCAqICh2YWwgLSBwYXJzZUZsb2F0KCBpbnB1dC5zdGVwIHx8IFwiMVwiICkpICkgLyAxMDAgOiBtaW5fdmFsO1xuXG5cdFx0XHRcdFx0Ly8gaW5wdXQudmFsdWUgPSBwYXJzZUludCggaW5wdXQudmFsdWUgKSA+IDAgPyBwYXJzZUludCggaW5wdXQudmFsdWUgKSAtIDEgOiAwO1xuXHRcdFx0XHRcdGNoYW5nZUV2ZW50LmluaXRFdmVudCggJ2NoYW5nZScsIHRydWUsIGZhbHNlICk7XG5cdFx0XHRcdFx0aW5wdXQuZGlzcGF0Y2hFdmVudCggY2hhbmdlRXZlbnQgKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0XHRxdHlbaV0ucmVwbGFjZUNoaWxkKCBwbHVzX2Nsb25lLCBwbHVzICk7XG5cdFx0XHRxdHlbaV0ucmVwbGFjZUNoaWxkKCBtaW51c19jbG9uZSwgbWludXMgKTtcblx0XHR9XG5cblx0fSxcblxuXHRwcmVwYXJlX21pbmlfd2lzaGxpc3Q6IGZ1bmN0aW9uIChhKSB7XG5cdFx0aWYgKCBhLmhhc0NsYXNzKCAncG9zaXRpb24tYWJzb2x1dGUnICkgKSB7XG5cdFx0XHR2YXIgYW8gID0gYS5vZmZzZXQoKSxcblx0XHRcdFx0YWwgID0gYW8ubGVmdCxcblx0XHRcdFx0YXQgID0gYW8udG9wLFxuXHRcdFx0XHRhdyAgPSBhLm91dGVyV2lkdGgoKSxcblx0XHRcdFx0YWggID0gYS5vdXRlckhlaWdodCgpLFxuXHRcdFx0XHRsYSAgPSBwYXJzZUZsb2F0KCBhLmNzcyggJ2xlZnQnICkgKSxcblx0XHRcdFx0dGEgID0gcGFyc2VGbG9hdCggYS5jc3MoICd0b3AnICkgKSxcblx0XHRcdFx0YW9sID0gYWwgLSBsYSxcblx0XHRcdFx0YW90ID0gYXQgLSB0YSxcblx0XHRcdFx0X2xhID0gbGEsIF90YSA9IHRhLCB3dyA9ICQoIHdpbmRvdyApLndpZHRoKCksIGRoID0gJCggZG9jdW1lbnQgKS5oZWlnaHQoKSwgb3MgPSA1MCxcblx0XHRcdFx0ciAgID0gd3cgLSBhb2wgLSBhdyAtIG9zLCBsID0gb3MgLSBhb2wsIGIgPSBkaCAtIGFvdCAtIGFoIC0gb3M7XG5cdFx0XHRpZiAod3cgPD0gYXcpIHtcblx0XHRcdFx0X2xhID0gLTEgKiBhb2w7XG5cdFx0XHR9IGVsc2UgaWYgKDAgPiB3dyAtIChhdyArIG9zICogMikpIHtcblx0XHRcdFx0X2xhID0gKHd3IC0gYXcpIC8gMiAtIGFvbDtcblx0XHRcdH0gZWxzZSBpZiAoMCA8IGwpIHtcblx0XHRcdFx0X2xhID0gbDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IHIpIHtcblx0XHRcdFx0X2xhID0gcjtcblx0XHRcdH1cblx0XHRcdGlmIChkaCA8IGFoKSB7XG5cdFx0XHRcdGEuaGVpZ2h0KCBkaCAtIGEub3V0ZXJIZWlnaHQoKSArIGEuaGVpZ2h0KCkgKTtcblx0XHRcdFx0YWggPSBhLm91dGVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGggPD0gYWgpIHtcblx0XHRcdFx0X3RhID0gLTEgKiBhb3Q7XG5cdFx0XHR9IGVsc2UgaWYgKDAgPiBkaCAtIChhaCArIG9zICogMikpIHtcblx0XHRcdFx0X3RhID0gKGRoIC0gYWgpIC8gMiAtIGFvdDtcblx0XHRcdH0gZWxzZSBpZiAoMCA+IGIpIHtcblx0XHRcdFx0X3RhID0gYjtcblx0XHRcdH1cblx0XHRcdGEuY3NzKCB7bGVmdDogX2xhLCB0b3A6IF90YSx9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwID0gJCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXIuJyArIGEuYXR0ciggJ2RhdGEtaWQnICkgKTtcblx0XHRcdGlmICggdHlwZW9mIHAgIT09ICd1bmRlZmluZWQnICYmIDAgPCBwLmxlbmd0aCApIHtcblx0XHRcdFx0dmFyIHBvICA9IHAub2Zmc2V0KCksXG5cdFx0XHRcdFx0c3QgID0gJCggd2luZG93ICkuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0X2xhID0gcG8ubGVmdCxcblx0XHRcdFx0XHRfdGEgPSBwby50b3AgKyBwLmhlaWdodCgpIC0gc3QsXG5cdFx0XHRcdFx0YXcgID0gYS5vdXRlcldpZHRoKCksXG5cdFx0XHRcdFx0d3cgID0gJCggd2luZG93ICkud2lkdGgoKTtcblxuXHRcdFx0XHRpZiAoX2xhICsgYXcgPiB3dykge1xuXHRcdFx0XHRcdF9sYSA9IHd3IC0gYXcgLSAyMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRhLmNzcygge2xlZnQ6IF9sYSAsIHRvcDogX3RhIH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fSxcblxuXHRhcHBlbmR0b0JvZHk6IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0aWYgKCAhIGVsZW0uY2xvc2VzdCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJy5wb3NpdGlvbi1maXhlZCcgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgY291bnRlcl90eXBlID0gZWxlbS5jbG9zZXN0KCcud2xmbWMtY291bnRlci13cmFwcGVyJykuZmluZCgnLndsZm1jLWNvdW50ZXItaXRlbXMnKS5oYXNDbGFzcygnd2xmbWMtbGlzdHMtY291bnRlci1kcm9wZG93bicpID8gJ3dsZm1jLXByZW1pdW0tbGlzdC1jb3VudGVyJyA6IChlbGVtLmNsb3Nlc3QoJy53bGZtYy1jb3VudGVyLXdyYXBwZXInKS5oYXNDbGFzcygnd2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyJykgPyAnd2xmbWMtd2FpdGxpc3QtY291bnRlcicgOiAnd2xmbWMtd2lzaGxpc3QtY291bnRlcicpO1xuXHRcdGlmICggZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtd2lzaGxpc3QtY291bnRlcicgKS5sZW5ndGggPiAwIHx8IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXdhaXRsaXN0LWNvdW50ZXInICkubGVuZ3RoID4gMCB8fCBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy1wcmVtaXVtLWxpc3QtY291bnRlcicgKS5sZW5ndGggPiAwICApIHtcblx0XHRcdHZhciB3aWRnZXRJZCAgPSBlbGVtLmNsb3Nlc3QoICcuZWxlbWVudG9yLXdpZGdldC13bGZtYy13aXNobGlzdC1jb3VudGVyJyApLmRhdGEoIFwiaWRcIiApIHx8IGVsZW0uY2xvc2VzdCggJy5lbGVtZW50b3Itd2lkZ2V0LXdsZm1jLXdhaXRsaXN0LWNvdW50ZXInICkuZGF0YSggXCJpZFwiICkgfHwgZWxlbS5jbG9zZXN0KCAnLmVsZW1lbnRvci13aWRnZXQtd2xmbWMtcHJlbWl1bS1saXN0LWNvdW50ZXInICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHR2YXIgZWxlbWVudElkID0gZWxlbS5jbG9zZXN0KCAnW2RhdGEtZWxlbWVudG9yLWlkXScgKS5kYXRhKCBcImVsZW1lbnRvci1pZFwiICk7XG5cdFx0XHR2YXIgZWxlbWVudG9yID0gXCI8ZGl2IGNsYXNzPSd3bGZtYy1lbGVtZW50b3IgZWxlbWVudG9yIGVsZW1lbnRvci1cIiArIGVsZW1lbnRJZCArIFwiIFwiICsgY291bnRlcl90eXBlICsgXCInPjxkaXYgY2xhc3M9J2VsZW1lbnRvci1lbGVtZW50IGVsZW1lbnRvci1lbGVtZW50LVwiICsgd2lkZ2V0SWQgKyBcIic+PC9kaXY+PC9kaXY+XCI7XG5cdFx0XHQkKCBlbGVtZW50b3IgKS5hcHBlbmRUbyggXCJib2R5XCIgKTtcblx0XHRcdCQoIFwiLndsZm1jLWVsZW1lbnRvci5lbGVtZW50b3ItXCIgKyBlbGVtZW50SWQgKyBcIiAuZWxlbWVudG9yLWVsZW1lbnQtXCIgKyB3aWRnZXRJZCApLmFwcGVuZCggZWxlbSApO1xuXG5cdFx0fSBlbHNlIGlmICggISBlbGVtLmNsb3Nlc3QoICcud2xmbWMtZWxlbWVudG9yJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgd2lkZ2V0SWQgID0gZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLWNvdW50ZXItaXRlbXMnICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHR2YXIgZWxlbWVudG9yID0gXCI8ZGl2IGNsYXNzPSd3bGZtYy1lbGVtZW50b3Igbm8tZWxlbWVudG9yLVwiICsgd2lkZ2V0SWQgKyBcIiBcIiArIGNvdW50ZXJfdHlwZSArIFwiJz48L2Rpdj5cIjtcblx0XHRcdCQoIGVsZW1lbnRvciApLmFwcGVuZFRvKCBcImJvZHlcIiApO1xuXHRcdFx0JCggXCIud2xmbWMtZWxlbWVudG9yLm5vLWVsZW1lbnRvci1cIiArIHdpZGdldElkICkuYXBwZW5kKCBlbGVtICk7XG5cdFx0fVxuXG5cdH0sXG5cblx0c2hvd19taW5pX3dpc2hsaXN0OiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApLnJlbW92ZUNsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdHZhciBlbGVtID0gJCggJy5kcm9wZG93bl8nICsgJCggdGhpcyApLmF0dHIoICdkYXRhLWlkJyApICkgfHwgJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKTtcblx0XHQkLmZuLldMRk1DLmFwcGVuZHRvQm9keSggZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKSApO1xuXHRcdCQuZm4uV0xGTUMucHJlcGFyZV9taW5pX3dpc2hsaXN0KCBlbGVtICk7XG5cdFx0ZWxlbS5hZGRDbGFzcyggJ2xpc3RzLXNob3cnICk7XG5cblx0fSxcblxuXHRoaWRlX21pbmlfd2lzaGxpc3Q6IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBlbGVtID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtY291bnRlci1kcm9wZG93bicgKTtcblx0XHQkKCAnLndsZm1jLWZpcnN0LXRvdWNoJyApLnJlbW92ZUNsYXNzKCAnd2xmbWMtZmlyc3QtdG91Y2gnICk7XG5cdFx0JCggJy53bGZtYy1maXJzdC1jbGljaycgKS5yZW1vdmVDbGFzcyggJ3dsZm1jLWZpcnN0LWNsaWNrJyApO1xuXHRcdGVsZW0ucmVtb3ZlQ2xhc3MoICdsaXN0cy1zaG93JyApO1xuXG5cdH0sXG5cblx0cmVJbml0X3dsZm1jOiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd2xmbWNfaW5pdCcgKTtcblx0fSxcblxuXHQvKiA9PT0gVG9vbHRpcCA9PT0gKi9cblx0aW5pdF90b29sdGlwOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHdsZm1jX3Rvb2x0aXAgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgaW5zdGFuY2U7XG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXG5cdFx0XHR0aGlzLmlkU2VsZWN0b3IgPSAnd2xmbWMtdG9vbHRpcCc7XG5cdFx0XHR0aGlzLnRleHQgICAgICAgPSAnJztcblx0XHRcdHRoaXMudG9wICAgICAgICA9IDA7XG5cdFx0XHR0aGlzLmxlZnQgICAgICAgPSAwO1xuXHRcdFx0dGhpcy5kaXJlY3Rpb24gID0gdHlwZW9mIHRoaXMuZGlyZWN0aW9uICE9PSAndW5kZWZpbmVkJyA/IHRoaXMuZGlyZWN0aW9uIDogJ2JvdHRvbSc7XG5cdFx0XHR0aGlzLnRfdHlwZSAgICAgPSB0eXBlb2YgdGhpcy50X3R5cGUgIT09ICd1bmRlZmluZWQnID8gdGhpcy50X3R5cGUgOiAnZGVmYXVsdCc7XG5cdFx0XHR0aGlzLnRhcmdldCAgICAgPSAnJztcblxuXHRcdFx0Ly8gQ3JlYXRlIGFjdHVhbCBlbGVtZW50IGFuZCB0aWUgZWxlbWVudCB0byBvYmplY3QgZm9yIHJlZmVyZW5jZS5cblx0XHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRTZWxlY3Rvcik7XG5cblx0XHRcdGlmICggISB0aGlzLm5vZGUgKSB7XG5cdFx0XHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkU2VsZWN0b3IpO1xuXHRcdFx0XHR0aGlzLm5vZGUuY2xhc3NOYW1lID0gdGhpcy5ub2RlLmNsYXNzTmFtZSArIFwidG9vbHRpcF9faGlkZGVuXCI7XG5cdFx0XHRcdHRoaXMubm9kZS5pbm5lckhUTUwgPSB0aGlzLnRleHQ7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5ub2RlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc2hvdyA9IGZ1bmN0aW9uICgpIHsgLy8gUmVyZW5kZXIgdG9vbHRpcC5cblxuXHRcdFx0XHR2YXIgbG9jYXRpb25fb3JkZXIgPSBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddO1xuXG5cdFx0XHRcdF9zZWxmLm5vZGUuaW5uZXJIVE1MID0gX3NlbGYudGV4dDtcblx0XHRcdFx0dmFyIGRpcmVjdGlvbiAgICAgICAgPSBfc2VsZi5kaXJlY3Rpb247XG5cdFx0XHRcdHZhciB0X3R5cGUgICAgICAgICAgID0gX3NlbGYudF90eXBlO1xuXHRcdFx0XHRpZiAoZGlyZWN0aW9uKSB7XG5cdFx0XHRcdFx0JCggdGhpcy5ub2RlICkuYWRkQ2xhc3MoICd0b29sdGlwX19leHBhbmRlZCB0b29sdGlwX19leHBhbmRlZC0nICsgZGlyZWN0aW9uICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JCggdGhpcy5ub2RlICkuYWRkQ2xhc3MoICd0b29sdGlwX19leHBhbmRlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKCB0aGlzLm5vZGUgKS5hZGRDbGFzcyggJ3dsZm1jLXRvb2x0aXAtJyArIHRfdHlwZSApO1xuXG5cdFx0XHRcdCQoIHRoaXMubm9kZSApLnJlbW92ZUNsYXNzKCAndG9vbHRpcF9faGlkZGVuJyApO1xuXG5cdFx0XHRcdGlmIChvZmZzY3JlZW4oICQoIHdsZm1jVG9vbHRpcC5ub2RlICkgKSkge1xuXHRcdFx0XHRcdHdsZm1jVG9vbHRpcC5oaWRlKCk7XG5cdFx0XHRcdFx0d2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9IGxvY2F0aW9uX29yZGVyW2xvY2F0aW9uX29yZGVyLmluZGV4T2YoIHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gKSArIDFdO1xuXHRcdFx0XHRcdG1vdmVUaXAoIHdsZm1jVG9vbHRpcC5ub2RlLCB3bGZtY1Rvb2x0aXAudGFyZ2V0ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5oaWRlID0gZnVuY3Rpb24gKCkgeyAvLyBIaWRlIHRvb2x0aXAuXG5cdFx0XHRcdCQoIF9zZWxmLm5vZGUgKS5jc3MoICd0b3AnLCAnMCcgKTtcblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmNzcyggJ2xlZnQnLCAnMCcgKTtcblx0XHRcdFx0JCggX3NlbGYubm9kZSApLmF0dHIoICdjbGFzcycsICcnICk7XG5cdFx0XHRcdCQoIF9zZWxmLm5vZGUgKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2hpZGRlbicgKTtcblx0XHRcdH07XG5cblx0XHR9O1xuXHRcdC8vIE1vdmUgdGlwIHRvIHByb3BlciBsb2NhdGlvbiBiZWZvcmUgZGlzcGxheS5cblx0XHR2YXIgb2Zmc2NyZWVuID0gZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRyZXR1cm4gKChlbC5vZmZzZXRMZWZ0ICsgZWwub2Zmc2V0V2lkdGgpIDwgMCB8fCAoZWwub2Zmc2V0VG9wICsgZWwub2Zmc2V0SGVpZ2h0KSA8IDAgfHwgKGVsLm9mZnNldExlZnQgKyBlbC5vZmZzZXRXaWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIHx8IGVsLm9mZnNldFRvcCArIGVsLm9mZnNldEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkpO1xuXHRcdH07XG5cdFx0dmFyIG1vdmVUaXAgICA9IGZ1bmN0aW9uIChlbGwsIHRhcmdldCkge1xuXG5cdFx0XHR2YXIgJHRhcmdldCA9ICQoIHRhcmdldCApO1xuXHRcdFx0dmFyICRlbGwgICAgPSAkKCBlbGwgKTtcblx0XHRcdHZhciBib2R5ICAgID0gJCggXCJib2R5XCIgKS5vZmZzZXQoKTtcblx0XHRcdCQoIFwiYm9keVwiICkuY3NzKCB7J3Bvc2l0aW9uJzogJ3JlbGF0aXZlJ30gKTtcblxuXHRcdFx0Ly8gZml4ICRlbGwgc2l6ZSBhZnRlciBjaGFuZ2UgbmV3IHRvb2x0aXAgdGV4dC5cblx0XHRcdHdsZm1jVG9vbHRpcC5zaG93KCk7XG5cdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZSgpO1xuXG5cdFx0XHR2YXIgYnV1ID0gNzsgLy8gRGVmYXVsdCBwYWRkaW5nIHNpemUgaW4gcHguXG5cdFx0XHQvLyB2YXIgY2VudGVyX2hlaWdodCA9IC0oJGVsbC5vdXRlckhlaWdodCgpIC8gMikgLyAyO1xuXHRcdFx0dmFyIGNlbnRlcl9oZWlnaHQgPSAoKCR0YXJnZXQub3V0ZXJIZWlnaHQoKSAtICRlbGwub3V0ZXJIZWlnaHQoKSApIC8gMik7XG5cdFx0XHR2YXIgY2VudGVyX3dpZHRoICA9IC0oJGVsbC5vdXRlcldpZHRoKCkgLyAyKSArICR0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMjtcblxuXHRcdFx0dmFyIGxvY2F0aW9ucyAgICAgID0ge1xuXHRcdFx0XHQndG9wJzogWy0kZWxsLm91dGVySGVpZ2h0KCkgLSBidXUsIGNlbnRlcl93aWR0aF0sXG5cdFx0XHRcdCdyaWdodCc6IFtjZW50ZXJfaGVpZ2h0LCAkdGFyZ2V0Lm91dGVyV2lkdGgoKSArIGJ1dV0sXG5cdFx0XHRcdCdib3R0b20nOiBbJHRhcmdldC5vdXRlckhlaWdodCgpICsgYnV1LCBjZW50ZXJfd2lkdGhdLFxuXHRcdFx0XHQnbGVmdCc6IFtjZW50ZXJfaGVpZ2h0LCAtJGVsbC5vdXRlcldpZHRoKCkgLSBidXVdXG5cdFx0XHR9O1xuXHRcdFx0dmFyIGxvY2F0aW9uX29yZGVyID0gWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXTtcblx0XHRcdHZhciBsb2NhdGlvbl9rZXlzICA9IE9iamVjdC5rZXlzKCBsb2NhdGlvbnMgKTtcblx0XHRcdGlmICh3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID09PSAndG9wJyB8fCB3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uID09PSAnYm90dG9tJykge1xuXHRcdFx0XHQkZWxsLmNzcyggJ3RvcCcsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gKGJvZHkudG9wKSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVswXSApO1xuXHRcdFx0XHQkZWxsLmNzcyggJ2xlZnQnLCAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSAoYm9keS5sZWZ0KSArIChidXUgLyAyKSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVsxXSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyAkZWxsLmNzcyggJ3RvcCcsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gKGJvZHkudG9wKSArIChidXUgLyAyKSArIGxvY2F0aW9uc1t3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uXVswXSApO1xuXHRcdFx0XHR2YXIgdG9wID0gbG9jYXRpb25zW3dsZm1jVG9vbHRpcC5kaXJlY3Rpb25dWzBdIC0gKGJ1dSAvIDIpO1xuXHRcdFx0XHR0b3AgICAgID0gdG9wIDwgMCA/IHRvcCArIChidXUgLyAyKSA6IHRvcDtcblx0XHRcdFx0JGVsbC5jc3MoICd0b3AnLCAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIChib2R5LnRvcCkgKyB0b3AgKTtcblx0XHRcdFx0JGVsbC5jc3MoICdsZWZ0JywgJHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gKGJvZHkubGVmdCkgKyBsb2NhdGlvbnNbd2xmbWNUb29sdGlwLmRpcmVjdGlvbl1bMV0gKTtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKG9mZnNjcmVlbiggJGVsbCApKSB7XG5cdFx0XHRcdHdsZm1jVG9vbHRpcC5kaXJlY3Rpb24gPSBsb2NhdGlvbl9vcmRlcltsb2NhdGlvbl9vcmRlci5pbmRleE9mKCB3bGZtY1Rvb2x0aXAuZGlyZWN0aW9uICkgKyAxXTtcblx0XHRcdFx0d2xmbWNUb29sdGlwLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdsZm1jVG9vbHRpcC5zaG93KCk7XG5cdFx0XHR9XG5cblx0XHR9O1xuXG5cdFx0Ly8gQ3JlYXRlIGdsb2JhbCB3bGZtY190b29sdGlwLlxuXHRcdHZhciB3bGZtY1Rvb2x0aXAgPSBuZXcgd2xmbWNfdG9vbHRpcCgpO1xuXG5cdFx0Ly8gTW91c2VvdmVyIHRvIHNob3cuXG5cdFx0JCggZG9jdW1lbnQgKS5vbihcblx0XHRcdCdtb3VzZWVudGVyJyxcblx0XHRcdFwiLndsZm1jLXRvb2x0aXBcIixcblx0XHRcdGZ1bmN0aW9uIChlZSkge1xuXHRcdFx0XHR2YXIgX3NlbGYgICAgICAgICAgID0gdGhpcztcblx0XHRcdFx0d2xmbWNUb29sdGlwLnRhcmdldCA9IF9zZWxmOyAvLyBEZWZhdWx0IHRvIHNlbGYuXG5cdFx0XHRcdHZhciBuYW1lX2NsYXNzZXMgICAgPSBfc2VsZi5jbGFzc05hbWUuc3BsaXQoICcgJyApO1xuXHRcdFx0XHRuYW1lX2NsYXNzZXMuZm9yRWFjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoY2MpIHtcblx0XHRcdFx0XHRcdGlmIChjYy5pbmRleE9mKCAnd2xmbWMtdG9vbHRpcC0nICkgIT0gLTEpIHsgLy8gRmluZCBhIGRpcmVjdGlvbmFsIHRhZy5cblx0XHRcdFx0XHRcdFx0d2xmbWNUb29sdGlwLmRpcmVjdGlvbiA9IGNjLnNwbGl0KCAnLScgKVtjYy5zcGxpdCggJy0nICkubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICgkKCB0aGlzICkuYXR0ciggJ2RhdGEtdG9vbHRpcC10eXBlJyApKSB7XG5cblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAudF90eXBlID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXRvb2x0aXAtdHlwZScgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICgkKCB0aGlzICkuYXR0ciggJ2RhdGEtdG9vbHRpcC10ZXh0JyApKSB7XG5cblx0XHRcdFx0XHR3bGZtY1Rvb2x0aXAudGV4dCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS10b29sdGlwLXRleHQnICk7XG5cdFx0XHRcdFx0bW92ZVRpcCggd2xmbWNUb29sdGlwLm5vZGUsIHdsZm1jVG9vbHRpcC50YXJnZXQgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnbW91c2VsZWF2ZScsXG5cdFx0XHRcIi53bGZtYy10b29sdGlwXCIsXG5cdFx0XHRmdW5jdGlvbiAoZWUpIHsgLy8gUmUtaGlkZSB0b29sdGlwLlxuXHRcdFx0XHR3bGZtY1Rvb2x0aXAuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0aW5pdF9maXhfb25faW1hZ2Vfc2luZ2xlX3Bvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCQoICcud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5X193cmFwcGVyIC53bGZtYy10b3Atb2YtaW1hZ2UnICkubGVuZ3RoID4gMCkge1xuXHRcdFx0JCggJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnlfX3dyYXBwZXIgLndsZm1jLXRvcC1vZi1pbWFnZScgKS5lYWNoKFxuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmluc2VydEFmdGVyKCAkKCB0aGlzICkucGFyZW50KCkgKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvKmNvbnN0IHRvcE9mSW1hZ2VFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcud2xmbWMtdG9wLW9mLWltYWdlJyApO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0b3BPZkltYWdlRWxlbXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRFbGVtID0gdG9wT2ZJbWFnZUVsZW1zW2ldO1xuXHRcdFx0Ly8gU2V0IHRoZSBtYXJnaW4gdG9wIG9mIHRoZSBuZXh0IHNpYmxpbmcgZWxlbWVudCB0byB0aGUgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IGVsZW1lbnQuXG5cdFx0XHRpZiAoY3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG5cdFx0XHRcdGxldCBwb3NpdGlvbkNsYXNzICAgPSBbLi4uY3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdF0uZmluZCggY2xhc3NOYW1lID0+IGNsYXNzTmFtZS5zdGFydHNXaXRoKCBcIndsZm1jX3Bvc2l0aW9uX2ltYWdlX1wiICkgKTtcblx0XHRcdFx0bGV0IGN1cnJlbnRQb3NpdGlvbiA9IFsuLi5jdXJyZW50RWxlbS5jbGFzc0xpc3RdLmZpbmQoIGNsYXNzTmFtZSA9PiBjbGFzc05hbWUuc3RhcnRzV2l0aCggXCJ3bGZtY19wb3NpdGlvbl9pbWFnZV9cIiApICk7XG5cdFx0XHRcdGlmIChwb3NpdGlvbkNsYXNzID09PSBjdXJyZW50UG9zaXRpb24pIHtcblx0XHRcdFx0XHRpZiAoJ3dsZm1jX3Bvc2l0aW9uX2ltYWdlX3RvcF9sZWZ0JyA9PT0gcG9zaXRpb25DbGFzcyB8fCAnd2xmbWNfcG9zaXRpb25faW1hZ2VfdG9wX3JpZ2h0JyA9PT0gcG9zaXRpb25DbGFzcykge1xuXHRcdFx0XHRcdFx0bGV0IG1hcmdpblRvcCA9IGAke2N1cnJlbnRFbGVtLm9mZnNldEhlaWdodCArIDV9cHhgO1xuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIHByZXZpb3VzIHNpYmxpbmdzIHdpdGggdGhlIHNhbWUgcG9zaXRpb24gY2xhc3MgYW5kIGFkZCB0aGVpciBoZWlnaHRzIGFuZCBnYXAgdmFsdWVzIHRvIG1hcmdpblRvcC5cblx0XHRcdFx0XHRcdGxldCBwcmV2U2libGluZyA9IGN1cnJlbnRFbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0XHRcdFx0XHR3aGlsZSAocHJldlNpYmxpbmcgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2xmbWMtdG9wLW9mLWltYWdlJyApICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyggcG9zaXRpb25DbGFzcyApKSB7XG5cdFx0XHRcdFx0XHRcdG1hcmdpblRvcCAgID0gYGNhbGMoICR7bWFyZ2luVG9wfSArICR7cHJldlNpYmxpbmcub2Zmc2V0SGVpZ2h0ICsgNX1weCApYDtcblx0XHRcdFx0XHRcdFx0cHJldlNpYmxpbmcgPSBwcmV2U2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblRvcDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCd3bGZtY19wb3NpdGlvbl9pbWFnZV9ib3R0b21fbGVmdCcgPT09IHBvc2l0aW9uQ2xhc3MgfHwgJ3dsZm1jX3Bvc2l0aW9uX2ltYWdlX2JvdHRvbV9yaWdodCcgPT09IHBvc2l0aW9uQ2xhc3MpIHtcblx0XHRcdFx0XHRcdGxldCBtYXJnaW5Cb3R0b20gPSBgJHtjdXJyZW50RWxlbS5vZmZzZXRIZWlnaHQgKyA1fXB4YDtcblx0XHRcdFx0XHRcdC8vIENoZWNrIGZvciBwcmV2aW91cyBzaWJsaW5ncyB3aXRoIHRoZSBzYW1lIHBvc2l0aW9uIGNsYXNzIGFuZCBhZGQgdGhlaXIgaGVpZ2h0cyBhbmQgZ2FwIHZhbHVlcyB0byBtYXJnaW5Cb3R0b20uXG5cdFx0XHRcdFx0XHRsZXQgcHJldlNpYmxpbmcgPSBjdXJyZW50RWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0d2hpbGUgKHByZXZTaWJsaW5nICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyggJ3dsZm1jLXRvcC1vZi1pbWFnZScgKSAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoIHBvc2l0aW9uQ2xhc3MgKSkge1xuXHRcdFx0XHRcdFx0XHRtYXJnaW5Cb3R0b20gPSBgY2FsYyggJHttYXJnaW5Cb3R0b219ICsgJHtwcmV2U2libGluZy5vZmZzZXRIZWlnaHQgKyA1fXB4IClgO1xuXHRcdFx0XHRcdFx0XHRwcmV2U2libGluZyAgPSBwcmV2U2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3VycmVudEVsZW0ubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1hcmdpbkJvdHRvbSA9IG1hcmdpbkJvdHRvbTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9Ki9cblxuXHR9LFxuXG5cdC8qID09PSBJTklUIEZVTkNUSU9OUyA9PT0gKi9cblxuXHQvKipcblx0ICogSW5pdCBwb3B1cCBmb3IgYWxsIGxpbmtzIHdpdGggdGhlIHBsdWdpbiB0aGF0IG9wZW4gYSBwb3B1cFxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGluaXRfd2lzaGxpc3RfcG9wdXA6IGZ1bmN0aW9uICgpIHtcblxuXHRcdC8vIGFkZCAmIHJlbW92ZSBjbGFzcyB0byBib2R5IHdoZW4gcG9wdXAgaXMgb3BlbmVkLlxuXHRcdHZhciBjYWxsYmFjayAgICAgICA9IGZ1bmN0aW9uIChub2RlLCBvcCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG5vZGUuY2xhc3NMaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucyggJ3dsZm1jLW92ZXJsYXknICkpIHtcblx0XHRcdFx0XHR2YXIgbWV0aG9kID0gJ3JlbW92ZScgPT09IG9wID8gJ3JlbW92ZUNsYXNzJyA6ICdhZGRDbGFzcyc7XG5cblx0XHRcdFx0XHQkKCAnYm9keScgKVttZXRob2RdKCAnd2xmbWMtd2l0aC1wb3B1cCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNhbGxiYWNrQWRkICAgID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdFx0Y2FsbGJhY2soIG5vZGUsICdhZGQnICk7XG5cdFx0XHR9LFxuXHRcdFx0Y2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAobm9kZSkge1xuXHRcdFx0XHRjYWxsYmFjayggbm9kZSwgJ3JlbW92ZScgKTtcblx0XHRcdH0sXG5cdFx0XHRvYnNlcnZlciAgICAgICA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuXHRcdFx0XHRmdW5jdGlvbiAobXV0YXRpb25zTGlzdCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgaW4gbXV0YXRpb25zTGlzdCkge1xuXHRcdFx0XHRcdFx0dmFyIG11dGF0aW9uID0gbXV0YXRpb25zTGlzdFtpXTtcblx0XHRcdFx0XHRcdGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtdXRhdGlvbi5hZGRlZE5vZGVzICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHRtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goIGNhbGxiYWNrQWRkICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBtdXRhdGlvbi5yZW1vdmVkTm9kZXMgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRcdFx0XHRcdG11dGF0aW9uLnJlbW92ZWROb2Rlcy5mb3JFYWNoKCBjYWxsYmFja1JlbW92ZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShcblx0XHRcdGRvY3VtZW50LmJvZHksXG5cdFx0XHR7XG5cdFx0XHRcdGNoaWxkTGlzdDogdHJ1ZVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEluaXQgY2hlY2tib3ggaGFuZGxpbmdcblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X2NoZWNrYm94X2hhbmRsaW5nOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGNoZWNrYm94ZXMgPSAkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLCAud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZmluZCggJ3Rib2R5IC5wcm9kdWN0LWNoZWNrYm94IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHR2YXIgbGluayA9ICQoJy5tdWx0aXBsZS1wcm9kdWN0LW1vdmUsLm11bHRpcGxlLXByb2R1Y3QtY29weScpO1xuXHRcdGNoZWNrYm94ZXMub2ZmKCAnY2hhbmdlJyApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIHQgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0cCA9IHQucGFyZW50KCk7XG5cblx0XHRcdFx0aWYgKCAhIHQuaXMoICc6Y2hlY2tlZCcgKSkge1xuXHRcdFx0XHRcdCQoICdpbnB1dFtuYW1lPVwiJyArIHQuYXR0ciggJ25hbWUnICkgKyAnXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdCQoICcjYnVsa19hZGRfdG9fY2FydDInICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHAucmVtb3ZlQ2xhc3MoICdjaGVja2VkJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAndW5jaGVja2VkJyApXG5cdFx0XHRcdFx0LmFkZENsYXNzKCB0LmlzKCAnOmNoZWNrZWQnICkgPyAnY2hlY2tlZCcgOiAndW5jaGVja2VkJyApO1xuXG5cdFx0XHRcdGlmICggbGluay5sZW5ndGggPiAwICkge1xuXG5cdFx0XHRcdFx0dmFyIGlzQ2hlY2tlZCA9IGNoZWNrYm94ZXMuaXMoJzpjaGVja2VkJyk7XG5cdFx0XHRcdFx0aWYgKGlzQ2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0bGluay5zaG93KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxpbmsuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgcm93ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpO1xuXHRcdFx0XHRcdHZhciBpdGVtSWQgPSByb3cuYXR0cignZGF0YS1pdGVtLWlkJyk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nSXRlbUlkID0gbGluay5hdHRyKCdkYXRhLWl0ZW0taWQnKTtcblx0XHRcdFx0XHRpZiAoICB0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXhpc3RpbmdJdGVtSWQpIHtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBleGlzdGluZ0l0ZW1JZC5zcGxpdCgnLCcpO1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZC5wdXNoKGl0ZW1JZCk7XG5cdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkID0gZXhpc3RpbmdJdGVtSWQuam9pbignLCcpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBpdGVtSWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChleGlzdGluZ0l0ZW1JZCkge1xuXHRcdFx0XHRcdFx0XHRleGlzdGluZ0l0ZW1JZCA9IGV4aXN0aW5nSXRlbUlkLnNwbGl0KCcsJyk7XG5cdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGV4aXN0aW5nSXRlbUlkLmluZGV4T2YoaXRlbUlkKTtcblx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdGV4aXN0aW5nSXRlbUlkLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZXhpc3RpbmdJdGVtSWQgPSBleGlzdGluZ0l0ZW1JZC5qb2luKCcsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGluay5hdHRyKCdkYXRhLWl0ZW0taWQnLCBleGlzdGluZ0l0ZW1JZCk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbml0IGpzIGhhbmRsaW5nIG9uIHdpc2hsaXN0IHRhYmxlIGl0ZW1zIGFmdGVyIGFqYXggdXBkYXRlXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF9oYW5kbGluZ19hZnRlcl9hamF4OiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5pbml0X3ByZXBhcmVfcXR5X2xpbmtzKCk7XG5cdFx0dGhpcy5pbml0X2NoZWNrYm94X2hhbmRsaW5nKCk7XG5cdFx0Ly90aGlzLmluaXRfcXVhbnRpdHkoKTtcblx0XHQvL3RoaXMuaW5pdF9jb3B5X3dpc2hsaXN0X2xpbmsoKTtcblx0XHQvL3RoaXMuaW5pdF90b29sdGlwKCk7XG5cdFx0Ly90aGlzLmluaXRfY29tcG9uZW50cygpO1xuXHRcdC8vdGhpcy5pbml0X2xheW91dCgpO1xuXHRcdC8vdGhpcy5pbml0X2RyYWdfbl9kcm9wKCk7XG5cdFx0Ly90aGlzLmluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmcoKTtcblx0XHQvL3RoaXMuaW5pdF9kcm9wZG93bl9saXN0cygpO1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dsZm1jX2luaXRfYWZ0ZXJfYWpheCcgKTtcblx0fSxcblxuXHQvKipcblx0ICogSGFuZGxlIHF1YW50aXR5IGlucHV0IGNoYW5nZSBmb3IgZWFjaCB3aXNobGlzdCBpdGVtXG5cdCAqXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdF9xdWFudGl0eTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBqcXhocixcblx0XHRcdHRpbWVvdXQ7XG5cblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnLndsZm1jLXdpc2hsaXN0LXRhYmxlIC5xdWFudGl0eSA6aW5wdXQsIC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZSAucXVhbnRpdHkgOmlucHV0Jyxcblx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHQgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0cm93ICAgICAgICAgICA9IHQuY2xvc2VzdCggJ1tkYXRhLXJvdy1pZF0nICksXG5cdFx0XHRcdFx0cHJvZHVjdF9pZCAgICA9IHJvdy5kYXRhKCAncm93LWlkJyApLFxuXHRcdFx0XHRcdGNhcnRfaXRlbV9rZXkgPSByb3cuZGF0YSggJ2NhcnQtaXRlbS1rZXknICksXG5cdFx0XHRcdFx0dGFibGUgICAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICksXG5cdFx0XHRcdFx0dG9rZW4gICAgICAgICA9IHRhYmxlLmRhdGEoICd0b2tlbicgKTtcblxuXHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVvdXQgKTtcblxuXHRcdFx0XHQvLyBzZXQgYWRkIHRvIGNhcnQgbGluayB0byBhZGQgc3BlY2lmaWMgcXR5IHRvIGNhcnQuXG5cdFx0XHRcdHJvdy5maW5kKCAnLmFkZF90b19jYXJ0X2J1dHRvbicgKS5hdHRyKCAnZGF0YS1xdWFudGl0eScsIHQudmFsKCkgKTtcblxuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZiAoanF4aHIpIHtcblx0XHRcdFx0XHRcdFx0anF4aHIuYWJvcnQoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0anF4aHIgPSAkLmFqYXgoXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMudXBkYXRlX2l0ZW1fcXVhbnRpdHksXG5cdFx0XHRcdFx0XHRcdFx0XHRub25jZTogdGFibGUuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRjYXJ0X2l0ZW1fa2V5OiBjYXJ0X2l0ZW1fa2V5LFxuXHRcdFx0XHRcdFx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHRva2VuLFxuXHRcdFx0XHRcdFx0XHRcdFx0cXVhbnRpdHk6IHQudmFsKCksXG5cdFx0XHRcdFx0XHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRcdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmJsb2NrKCByb3cgKTtcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnVuYmxvY2soIHJvdyApO1xuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHQvKmlmICh0eXBlb2YgcmVzcG9uc2UuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBsYWNlX2ZyYWdtZW50cyggcmVzcG9uc2UuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSovXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0MTAwMFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0aW5pdF9wb3B1cHM6IGZ1bmN0aW9uICgpIHtcblxuXHRcdCQoICdib2R5JyApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2xmbWMtcG9wdXAtdHJpZ2dlcjpub3QoLndsZm1jLWRpc2FibGVkKScsXG5cdFx0XHRmdW5jdGlvbihldikge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaWQgICAgICAgICAgICAgPSAkKCB0aGlzICkuZGF0YSggJ3BvcHVwLWlkJyApO1xuXHRcdFx0XHR2YXIgZWxlbSAgICAgICAgICAgPSAkKCAnIycgKyBpZCApO1xuXHRcdFx0XHR2YXIgcG9wdXBfd3JhcHBlciA9ICAkKCAnIycgKyBpZCArICdfd3JhcHBlcicpO1xuXG5cdFx0XHRcdGlmICghIHBvcHVwX3dyYXBwZXIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0YWJzb2x1dGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29sb3I6ICcjMzMzJyxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb246ICdhbGwgMC4zcycsXG5cdFx0XHRcdFx0XHRob3Jpem9udGFsOiBlbGVtLmRhdGEoICdob3Jpem9udGFsJyApLFxuXHRcdFx0XHRcdFx0dmVydGljYWw6IGVsZW0uZGF0YSggJ3ZlcnRpY2FsJyApXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRlbGVtLnBvcHVwKCBkZWZhdWx0T3B0aW9ucyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQoJyN3bGZtYy10b29sdGlwJylcblx0XHRcdFx0XHQuY3NzKHtcblx0XHRcdFx0XHRcdCd0b3AnOiAnMCcsXG5cdFx0XHRcdFx0XHQnbGVmdCc6ICcwJ1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ3Rvb2x0aXBfX2hpZGRlbicpO1xuXHRcdFx0XHQkKCAnIycgKyBpZCApLnBvcHVwKCAnc2hvdycgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCk7XG5cdFx0JCggJ2JvZHknICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1wb3B1cC1jbG9zZScsXG5cdFx0XHRmdW5jdGlvbihldikge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaWQgPSAkKCB0aGlzICkuZGF0YSggJ3BvcHVwLWlkJyApO1xuXHRcdFx0XHQkKCAnIycgKyBpZCApLnBvcHVwKCAnaGlkZScgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0fSxcblxuXHRpbml0X2NvbXBvbmVudHM6IGZ1bmN0aW9uICgpIHtcblx0XHQkKCBkb2N1bWVudCApLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2xmbWMtbGlzdCAucHJvZHVjdC1jb21wb25lbnRzJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyICR0aGlzICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0dmFyIGVsZW0gICAgICAgICA9ICR0aGlzLmNsb3Nlc3QoICd0cicgKTtcblx0XHRcdFx0dmFyICRtZXRhRGF0YSAgICA9IGVsZW0uZmluZCggJy53bGZtYy1hYnNvbHV0ZS1tZXRhLWRhdGEnICk7XG5cdFx0XHRcdHZhciAkbmV4dCAgICAgICAgPSBlbGVtLm5leHQoICcud2xmbWMtcm93LW1ldGEtZGF0YScgKS5maWx0ZXIoICcud2xmbWMtcm93LW1ldGEtZGF0YScgKTtcblx0XHRcdFx0dmFyIGlzTmV4dEhpZGRlbiA9ICRuZXh0Lmhhc0NsYXNzKCAnaGlkZScgKTtcblxuXHRcdFx0XHQkbWV0YURhdGEuZmFkZVRvZ2dsZSgpO1xuXHRcdFx0XHQkbmV4dC50b2dnbGVDbGFzcyggJ2hpZGUnICk7XG5cdFx0XHRcdGVsZW0udG9nZ2xlQ2xhc3MoICdzaG93LW1ldGEtZGF0YScsIGlzTmV4dEhpZGRlbiApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53bGZtYy1saXN0IC5jbG9zZS1jb21wb25lbnRzJyxcblx0XHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIGVsZW0gPSAkKCB0aGlzICkuY2xvc2VzdCggJ3RyJyApO1xuXHRcdFx0XHRlbGVtLmZpbmQoICcud2xmbWMtYWJzb2x1dGUtbWV0YS1kYXRhJyApLmZhZGVUb2dnbGUoKTtcblx0XHRcdFx0ZWxlbS5yZW1vdmVDbGFzcyggJ3Nob3ctbWV0YS1kYXRhJyApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRpbml0X3BvcHVwX2NoZWNrYm94X2hhbmRsaW5nOiBmdW5jdGlvbiAoKSB7XG5cdFx0JCggZG9jdW1lbnQgKS5vbignY2hhbmdlJywgJy5saXN0LWl0ZW0tY2hlY2tib3gnLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIHNlbGVjdGVkSXRlbSA9ICQodGhpcykuY2xvc2VzdCgnLmxpc3QtaXRlbScpO1xuXHRcdFx0dmFyIHBhcmVudENvbnRhaW5lciA9ICQodGhpcykuY2xvc2VzdCgnLndsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lciwgLndsZm1jLW1vdmUtdG8tbGlzdC13cmFwcGVyLCAud2xmbWMtY29weS10by1saXN0LXdyYXBwZXInKTtcblx0XHRcdGlmIChwYXJlbnRDb250YWluZXIuaGFzQ2xhc3MoJ3dsZm1jLWFkZC10by1saXN0LWNvbnRhaW5lcicpKSB7XG5cdFx0XHRcdGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWRJdGVtLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGVjdGVkSXRlbS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHBhcmVudENvbnRhaW5lci5oYXNDbGFzcygnd2xmbWMtbW92ZS10by1saXN0LXdyYXBwZXInKSB8fCBwYXJlbnRDb250YWluZXIuaGFzQ2xhc3MoJ3dsZm1jLWNvcHktdG8tbGlzdC13cmFwcGVyJykpIHtcblx0XHRcdFx0dmFyIGNoZWNrYm94ZXMgPSBwYXJlbnRDb250YWluZXIuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cdFx0XHRcdHBhcmVudENvbnRhaW5lci5maW5kKCcubGlzdC1pdGVtJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWRJdGVtLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHRcdGNoZWNrYm94ZXMubm90KCQodGhpcykpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogSW5pdCBoYW5kbGluZyBmb3IgY29weSBidXR0b25cblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRpbml0X2NvcHlfd2lzaGxpc3RfbGluazogZnVuY3Rpb24gKCkge1xuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy5jb3B5LWxpbmstdHJpZ2dlcicsXG5cdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBvYmpfdG9fY29weSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHR2YXIgaGlkZGVuID0gJChcblx0XHRcdFx0XHQnPGlucHV0Lz4nLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHZhbDogb2JqX3RvX2NvcHkuYXR0ciggJ2RhdGEtaHJlZicgKSxcblx0XHRcdFx0XHRcdHR5cGU6ICd0ZXh0J1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0XHQkKCAnYm9keScgKS5hcHBlbmQoIGhpZGRlbiApO1xuXG5cdFx0XHRcdGlmICgkLmZuLldMRk1DLmlzT1MoKSkge1xuXHRcdFx0XHRcdGhpZGRlblswXS5zZXRTZWxlY3Rpb25SYW5nZSggMCwgOTk5OSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGhpZGRlbi5zZWxlY3QoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cblx0XHRcdFx0aGlkZGVuLnJlbW92ZSgpO1xuXG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5saW5rX2NvcGllZCApO1xuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBmcmFnbWVudHMgdGhhdCBuZWVkIHRvIGJlIHJlZnJlc2hlZCBpbiB0aGUgcGFnZVxuXHQgKlxuXHQgKiBAcGFyYW0gc2VhcmNoIHN0cmluZyBSZWYgdG8gc2VhcmNoIGFtb25nIGFsbCBmcmFnbWVudHMgaW4gdGhlIHBhZ2Vcblx0ICogQHJldHVybiBvYmplY3QgT2JqZWN0IGNvbnRhaW5pbmcgYSBwcm9wZXJ0eSBmb3IgZWFjaCBmcmFnbWVudCB0aGF0IG1hdGNoZXMgc2VhcmNoXG5cdCAqL1xuXHRyZXRyaWV2ZV9mcmFnbWVudHM6IGZ1bmN0aW9uIChzZWFyY2gpIHtcblx0XHR2YXIgb3B0aW9ucyAgID0ge30sXG5cdFx0XHRmcmFnbWVudHMgPSBudWxsO1xuXG5cdFx0aWYgKHNlYXJjaCkge1xuXHRcdFx0aWYgKHR5cGVvZiBzZWFyY2ggPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdHNlYXJjaCA9ICQuZXh0ZW5kKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZyYWdtZW50czogbnVsbCxcblx0XHRcdFx0XHRcdHM6ICcnLFxuXHRcdFx0XHRcdFx0Y29udGFpbmVyOiAkKCBkb2N1bWVudCApLFxuXHRcdFx0XHRcdFx0Zmlyc3RMb2FkOiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2VhcmNoXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCAhIHNlYXJjaC5mcmFnbWVudHMpIHtcblx0XHRcdFx0XHRmcmFnbWVudHMgPSBzZWFyY2guY29udGFpbmVyLmZpbmQoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gc2VhcmNoLmZyYWdtZW50cztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzZWFyY2gucykge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IGZyYWdtZW50cy5ub3QoICdbZGF0YS1mcmFnbWVudC1yZWZdJyApLmFkZCggZnJhZ21lbnRzLmZpbHRlciggJ1tkYXRhLWZyYWdtZW50LXJlZj1cIicgKyBzZWFyY2gucyArICdcIl0nICkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzZWFyY2guZmlyc3RMb2FkKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnRzID0gZnJhZ21lbnRzLmZpbHRlciggJy5vbi1maXJzdC1sb2FkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmcmFnbWVudHMgPSAkKCAnLndsZm1jLXdpc2hsaXN0LWZyYWdtZW50JyApO1xuXG5cdFx0XHRcdGlmICh0eXBlb2Ygc2VhcmNoID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc2VhcmNoID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdGZyYWdtZW50cyA9IGZyYWdtZW50cy5ub3QoICdbZGF0YS1mcmFnbWVudC1yZWZdJyApLmFkZCggZnJhZ21lbnRzLmZpbHRlciggJ1tkYXRhLWZyYWdtZW50LXJlZj1cIicgKyBzZWFyY2ggKyAnXCJdJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZnJhZ21lbnRzID0gJCggJy53bGZtYy13aXNobGlzdC1mcmFnbWVudCcgKTtcblx0XHR9XG5cblx0XHRpZiAoZnJhZ21lbnRzLmxlbmd0aCkge1xuXHRcdFx0ZnJhZ21lbnRzLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgdCAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0XHRpZCA9IHQuYXR0ciggJ2NsYXNzJyApLnNwbGl0KCAnICcgKS5maWx0ZXIoXG5cdFx0XHRcdFx0XHRcdCh2YWwpID0+IHtyZXR1cm4gdmFsLmxlbmd0aCAmJiB2YWwgIT09ICdleGlzdHMnO31cblx0XHRcdFx0XHRcdCkuam9pbiggd2xmbWNfbDEwbi5mcmFnbWVudHNfaW5kZXhfZ2x1ZSApO1xuXG5cdFx0XHRcdFx0b3B0aW9uc1tpZF0gPSB0LmRhdGEoICdmcmFnbWVudC1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3B0aW9ucztcblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBmcmFnbWVudHMgb24gcGFnZSBsb2FkaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSBzZWFyY2ggc3RyaW5nIFJlZiB0byBzZWFyY2ggYW1vbmcgYWxsIGZyYWdtZW50cyBpbiB0aGUgcGFnZVxuXHQgKiBAcGFyYW0gc3VjY2VzcyBmdW5jdGlvblxuXHQgKiBAcGFyYW0gc3VjY2Vzc0FyZ3MgYXJyYXlcblx0ICovXG5cdGxvYWRfZnJhZ21lbnRzOiBmdW5jdGlvbiAoc2VhcmNoLCBzdWNjZXNzLCBzdWNjZXNzQXJncykge1xuXG5cdFx0Y2xlYXJUaW1lb3V0KCBmcmFnbWVudHRpbWVvdXQgKTtcblxuXHRcdGZyYWdtZW50dGltZW91dCA9IHNldFRpbWVvdXQoXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICggZnJhZ21lbnR4aHIgKSB7XG5cdFx0XHRcdFx0ZnJhZ21lbnR4aHIuYWJvcnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWFyY2ggPSAkLmV4dGVuZChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmaXJzdExvYWQ6IHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNlYXJjaFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHZhciBmcmFnbWVudHMgPSAkLmZuLldMRk1DLnJldHJpZXZlX2ZyYWdtZW50cyggc2VhcmNoICk7XG5cdFx0XHRcdC8vIGNyZWF0ZSBhIG5ldyBGb3JtRGF0YSBvYmplY3QuXG5cdFx0XHRcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICdhY3Rpb24nLCB3bGZtY19sMTBuLmFjdGlvbnMubG9hZF9mcmFnbWVudHMgKTtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCAnY29udGV4dCcsICdmcm9udGVuZCcgKTtcblx0XHRcdFx0aWYgKCBmcmFnbWVudHMpIHtcblx0XHRcdFx0XHQvLyBjb252ZXJ0IG9iamVjdCB0byBKU09OIHN0cmluZy5cblx0XHRcdFx0XHR2YXIgZnJhZ21lbnRKc29uID0gSlNPTi5zdHJpbmdpZnkoIGZyYWdtZW50cyApO1xuXHRcdFx0XHRcdC8vIGNyZWF0ZSBhIGZpbGUgZnJvbSBKU09OIHN0cmluZy5cblx0XHRcdFx0XHR2YXIgZmlsZSA9IG5ldyBGaWxlKCBbZnJhZ21lbnRKc29uXSwgJ2ZyYWdtZW50Lmpzb24nICk7XG5cdFx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCAnZnJhZ21lbnRzX2ZpbGUnLCBmaWxlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmcmFnbWVudHhociA9ICQuYWpheChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWRtaW5fdXJsLCAvL2FqYXhfdXJsLFxuXHRcdFx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdFx0XHQvKmJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCovXG5cdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGRhdGEuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3VjY2Vzcy5hcHBseShudWxsLCBzdWNjZXNzQXJncyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZXBsYWNlX2ZyYWdtZW50cyggZGF0YS5mcmFnbWVudHMgKTtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd2xmbWNfZnJhZ21lbnRzX2xvYWRlZCcsIFtmcmFnbWVudHMsIGRhdGEuZnJhZ21lbnRzLCBzZWFyY2guZmlyc3RMb2FkXSApO1xuXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQkKCAnI3dsZm1jLWxpc3RzLCN3bGZtYy13aXNobGlzdC1mb3JtJyApLmFkZENsYXNzKCAnb24tZmlyc3QtbG9hZCcgKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBkYXRhLnByb2R1Y3RzICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggZGF0YS5wcm9kdWN0cyApICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgZGF0YS53YWl0bGlzdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfd2FpdGxpc3RfaGFzaCggSlNPTi5zdHJpbmdpZnkoIGRhdGEud2FpdGxpc3QgKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGRhdGEubGFuZyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfbGFuZ19oYXNoKCBkYXRhLmxhbmcgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHQxMDBcblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXBsYWNlIGZyYWdtZW50cyB3aXRoIHRlbXBsYXRlIHJlY2VpdmVkXG5cdCAqXG5cdCAqIEBwYXJhbSBmcmFnbWVudHMgYXJyYXkgQXJyYXkgb2YgZnJhZ21lbnRzIHRvIHJlcGxhY2Vcblx0ICovXG5cdHJlcGxhY2VfZnJhZ21lbnRzOiBmdW5jdGlvbiAoZnJhZ21lbnRzKSB7XG5cdFx0JC5lYWNoKFxuXHRcdFx0ZnJhZ21lbnRzLFxuXHRcdFx0ZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0dmFyIGl0ZW1TZWxlY3RvciA9ICcuJyArIGkuc3BsaXQoIHdsZm1jX2wxMG4uZnJhZ21lbnRzX2luZGV4X2dsdWUgKS5maWx0ZXIoXG5cdFx0XHRcdFx0XHQodmFsKSA9PiB7cmV0dXJuIHZhbC5sZW5ndGggJiYgdmFsICE9PSAnZXhpc3RzJyAmJiB2YWwgIT09ICd3aXRoLWNvdW50Jzt9XG5cdFx0XHRcdFx0KS5qb2luKCAnLicgKSxcblx0XHRcdFx0XHR0b1JlcGxhY2UgICAgPSAkKCBpdGVtU2VsZWN0b3IgKTtcblx0XHRcdFx0Ly8gZmluZCByZXBsYWNlIHRlbXBsYXRlLlxuXHRcdFx0XHR2YXIgcmVwbGFjZVdpdGggPSAkKCB2ICkuZmlsdGVyKCBpdGVtU2VsZWN0b3IgKTtcblxuXHRcdFx0XHRpZiAoICEgcmVwbGFjZVdpdGgubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmVwbGFjZVdpdGggPSAkKCB2ICkuZmluZCggaXRlbVNlbGVjdG9yICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodG9SZXBsYWNlLmxlbmd0aCAmJiByZXBsYWNlV2l0aC5sZW5ndGgpIHtcblx0XHRcdFx0XHR0b1JlcGxhY2UucmVwbGFjZVdpdGgoIHJlcGxhY2VXaXRoICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXG5cdC8qID09PSBFVkVOVCBIQU5ETElORyA9PT0gKi9cblxuXHRsb2FkX2F1dG9tYXRpb25zOiBmdW5jdGlvbiAocHJvZHVjdF9pZCwgd2lzaGxpc3RfaWQsIGN1c3RvbWVyX2lkLCBsaXN0X3R5cGUsIG5vbmNlKSB7XG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXG5cdFx0XHRcdHVybDogd2xmbWNfbDEwbi5hamF4X3VybCxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLmxvYWRfYXV0b21hdGlvbnMsXG5cdFx0XHRcdFx0bm9uY2U6IG5vbmNlLFxuXHRcdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdFx0cHJvZHVjdF9pZDogcGFyc2VJbnQoIHByb2R1Y3RfaWQgKSxcblx0XHRcdFx0XHR3aXNobGlzdF9pZDogcGFyc2VJbnQoIHdpc2hsaXN0X2lkICksXG5cdFx0XHRcdFx0Y3VzdG9tZXJfaWQ6IHBhcnNlSW50KCBjdXN0b21lcl9pZCApLFxuXHRcdFx0XHRcdGxpc3RfdHlwZTogbGlzdF90eXBlLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvLyBhbnl0aGluZy5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0Y2hlY2tfcHJvZHVjdHM6IGZ1bmN0aW9uIChwcm9kdWN0cyl7XG5cdFx0aWYgKCBudWxsICE9PSBwcm9kdWN0cyApIHtcblx0XHRcdHByb2R1Y3RfaW5fbGlzdCAgID0gW107XG5cdFx0XHR2YXIgY291bnRlcl9pdGVtcyA9ICQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyIC53bGZtYy1jb3VudGVyLWl0ZW0nICk7XG5cdFx0XHRpZiAoIGNvdW50ZXJfaXRlbXMubGVuZ3RoICYmIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggKSB7XG5cdFx0XHRcdGNvdW50ZXJfaXRlbXMuZWFjaChcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoIHByb2R1Y3RfaW5fbGlzdCwgZnVuY3Rpb24oIGl0ZW0gKXsgcmV0dXJuIGl0ZW0ucHJvZHVjdF9pZCA9PT0gcF9pZDsgfSApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBwX2lkICsgJ1wiXScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdGFibGVfaXRlbXNcdD0gJCggJy53bGZtYy13aXNobGlzdC1mb3JtIC53bGZtYy10YWJsZS1pdGVtJyApO1xuXHRcdFx0aWYgKCB0YWJsZV9pdGVtcy5sZW5ndGggJiYgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCApIHtcblx0XHRcdFx0dGFibGVfaXRlbXMuZWFjaChcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBwX2lkID0gJCggdGhpcyApLmF0dHIoICdkYXRhLXJvdy1pZCcgKTtcblx0XHRcdFx0XHRcdGlmICggISAkLmdyZXAoIHByb2R1Y3RfaW5fbGlzdCwgZnVuY3Rpb24oIGl0ZW0gKXsgcmV0dXJuIGl0ZW0ucHJvZHVjdF9pZCA9PT0gcF9pZDsgfSApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy13aXNobGlzdC1mb3JtJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgcF9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0JCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkucmVtb3ZlQ2xhc3MoICdleGlzdHMnICk7XG5cblx0XHRcdCQuZWFjaChcblx0XHRcdFx0cHJvZHVjdHMsXG5cdFx0XHRcdGZ1bmN0aW9uICggaWQsIGl0ZW1EYXRhICkge1xuXHRcdFx0XHRcdHZhciBzYW1lX3Byb2R1Y3RzID0gJCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIGl0ZW1EYXRhLnByb2R1Y3RfaWQgKTtcblx0XHRcdFx0XHRzYW1lX3Byb2R1Y3RzLmVhY2goXG5cdFx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS1pdGVtLWlkJywgaXRlbURhdGEuaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcsIGl0ZW1EYXRhLndpc2hsaXN0X2lkICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13aXNobGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIGl0ZW1EYXRhLmxlbmd0aCApO1xuXG5cdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0LnB1c2goIGl0ZW1EYXRhICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqIFNldCB0aGUgd2lzaGxpc3QgaGFzaCBpbiBib3RoIHNlc3Npb24gYW5kIGxvY2FsIHN0b3JhZ2UgKi9cblx0c2V0X3Byb2R1Y3RzX2hhc2g6IGZ1bmN0aW9uICggIHByb2R1Y3RzICkge1xuXHRcdGlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXksIHByb2R1Y3RzICk7XG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSAsIHByb2R1Y3RzICk7XG5cdFx0fVxuXHRcdCQuZm4uV0xGTUMuY2hlY2tfcHJvZHVjdHMoIEpTT04ucGFyc2UoIHByb2R1Y3RzICkgKTtcblx0fSxcblxuXHRzZXRfbGFuZ19oYXNoOiBmdW5jdGlvbiAoICBsYW5nICkge1xuXHRcdGlmICggJHN1cHBvcnRzX2h0bWw1X3N0b3JhZ2UgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSwgbGFuZyApO1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggbGFuZ19oYXNoX2tleSAsIGxhbmcgKTtcblx0XHR9XG5cdH0sXG5cblx0dmFsaWRhdGVFbWFpbDogZnVuY3Rpb24gKGVtYWlsKSB7XG5cdFx0dmFyIHJlID1cblx0XHRcdC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvO1xuXHRcdHJldHVybiByZS50ZXN0KFN0cmluZyhlbWFpbCkudG9Mb3dlckNhc2UoKSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIHBhc3NlZCB2YWx1ZSBjb3VsZCBiZSBjb25zaWRlcmVkIHRydWVcblx0ICovXG5cdGlzVHJ1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0cmV0dXJuIHRydWUgPT09IHZhbHVlIHx8ICd5ZXMnID09PSB2YWx1ZSB8fCAnMScgPT09IHZhbHVlIHx8IDEgPT09IHZhbHVlIHx8ICd0cnVlJyA9PT0gdmFsdWU7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGRldmljZSBpcyBhbiBJT1MgZGV2aWNlXG5cdCAqL1xuXHRpc09TOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goIC9pcGFkfGlwaG9uZS9pICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEFkZCBsb2FkaW5nIHRvIGVsZW1lbnRcblx0ICpcblx0ICogQHBhcmFtIGl0ZW0galF1ZXJ5IG9iamVjdFxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGxvYWRpbmc6IGZ1bmN0aW9uICggaXRlbSApIHtcblx0XHRpZiAoIGl0ZW0uZmluZCggJ2knICkubGVuZ3RoID4gMCApIHtcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoICd3bGZtYy1hY3Rpb24gd2xmbWMtbG9hZGluZycgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXRlbS5hZGRDbGFzcyggJ3dsZm1jLWFjdGlvbiB3bGZtYy1sb2FkaW5nLWFsdCcgKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlbW92ZSBsb2FkaW5nIHRvIGVsZW1lbnRcblx0ICpcblx0ICogQHBhcmFtIGl0ZW0galF1ZXJ5IG9iamVjdFxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdHVubG9hZGluZzogZnVuY3Rpb24gKCBpdGVtICkge1xuXHRcdGl0ZW0ucmVtb3ZlQ2xhc3MoICd3bGZtYy1sb2FkaW5nIHdsZm1jLWxvYWRpbmctYWx0JyApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBCbG9jayBpdGVtIGlmIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRibG9jazogZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRpZiAodHlwZW9mICQuZm4uYmxvY2sgIT09ICd1bmRlZmluZWQnICYmIHdsZm1jX2wxMG4uZW5hYmxlX2FqYXhfbG9hZGluZykge1xuXHRcdFx0aXRlbS5mYWRlVG8oICc0MDAnLCAnMC42JyApLmJsb2NrKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWVzc2FnZTogbnVsbCxcblx0XHRcdFx0XHRvdmVybGF5Q1NTOiB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kICAgIDogJ3RyYW5zcGFyZW50IHVybCgnICsgd2xmbWNfbDEwbi5hamF4X2xvYWRlcl91cmwgKyAnKSBuby1yZXBlYXQgY2VudGVyJyxcblx0XHRcdFx0XHRcdGJhY2tncm91bmRTaXplOiAnNDBweCA0MHB4Jyxcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9LFxuXG5cdHRhYmxlX2Jsb2NrOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiAkLmZuLmJsb2NrICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUtd3JhcHBlciwgLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlLXdyYXBwZXInICkuZmFkZVRvKCAnNDAwJywgJzAuNicgKS5ibG9jayhcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0XHRcdFx0b3ZlcmxheUNTUzoge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZCAgICA6ICd0cmFuc3BhcmVudCB1cmwoJyArIHdsZm1jX2wxMG4uYWpheF9sb2FkZXJfdXJsICsgJykgbm8tcmVwZWF0IGNlbnRlcicsXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZTogJzgwcHggODBweCcsXG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogVW5ibG9jayBpdGVtIGlmIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtIGpRdWVyeSBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHR1bmJsb2NrOiBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGlmICh0eXBlb2YgJC5mbi51bmJsb2NrICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0aXRlbS5zdG9wKCB0cnVlICkuY3NzKCAnb3BhY2l0eScsICcxJyApLnVuYmxvY2soKTtcblx0XHRcdCQoICcudG9vbHRpcF9fZXhwYW5kZWQnICkucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcyggJ3Rvb2x0aXBfX2hpZGRlbicgKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGNvb2tpZXMgYXJlIGVuYWJsZWRcblx0ICpcblx0ICogQHJldHVybiBib29sZWFuXG5cdCAqL1xuXHRpc19jb29raWVfZW5hYmxlZDogZnVuY3Rpb24gKCkge1xuXHRcdGlmIChuYXZpZ2F0b3IuY29va2llRW5hYmxlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGFuZCByZWFkIGNvb2tpZS5cblx0XHRkb2N1bWVudC5jb29raWUgPSAnY29va2lldGVzdD0xJztcblx0XHR2YXIgcmV0ICAgICAgICAgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZiggJ2Nvb2tpZXRlc3Q9JyApICE9PSAtMTtcblxuXHRcdC8vIGRlbGV0ZSBjb29raWUuXG5cdFx0ZG9jdW1lbnQuY29va2llID0gJ2Nvb2tpZXRlc3Q9MTsgZXhwaXJlcz1UaHUsIDAxLUphbi0xOTcwIDAwOjAwOjAxIEdNVCc7XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdHNldENvb2tpZTogZnVuY3Rpb24gKGNvb2tpZV9uYW1lLCB2YWx1ZSkge1xuXHRcdHZhciBleGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdGV4ZGF0ZS5zZXREYXRlKCBleGRhdGUuZ2V0RGF0ZSgpICsgKDM2NSAqIDI1KSApO1xuXHRcdGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZV9uYW1lICsgXCI9XCIgKyBlc2NhcGUoIHZhbHVlICkgKyBcIjsgZXhwaXJlcz1cIiArIGV4ZGF0ZS50b1VUQ1N0cmluZygpICsgXCI7IHBhdGg9L1wiO1xuXHR9LFxuXG5cdHVwZGF0ZVVSTFBhcmFtZXRlcjogZnVuY3Rpb24gKHVybCwgcGFyYW0sIHBhcmFtVmFsKSB7XG5cdFx0dmFyIG5ld0FkZGl0aW9uYWxVUkwgPSBcIlwiO1xuXHRcdHZhciB0ZW1wQXJyYXkgICAgICAgID0gdXJsLnNwbGl0KCBcIj9cIiApO1xuXHRcdHZhciBiYXNlVVJMICAgICAgICAgID0gdGVtcEFycmF5WzBdO1xuXHRcdHZhciBhZGRpdGlvbmFsVVJMICAgID0gdGVtcEFycmF5WzFdO1xuXHRcdHZhciB0ZW1wICAgICAgICAgICAgID0gXCJcIjtcblx0XHRpZiAoYWRkaXRpb25hbFVSTCkge1xuXHRcdFx0dGVtcEFycmF5ID0gYWRkaXRpb25hbFVSTC5zcGxpdCggXCImXCIgKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0ZW1wQXJyYXlbaV0uc3BsaXQoICc9JyApWzBdICE9PSBwYXJhbSkge1xuXHRcdFx0XHRcdG5ld0FkZGl0aW9uYWxVUkwgKz0gdGVtcCArIHRlbXBBcnJheVtpXTtcblx0XHRcdFx0XHR0ZW1wICAgICAgICAgICAgICA9IFwiJlwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHJvd3NfdHh0ID0gdGVtcCArIFwiXCIgKyBwYXJhbSArIFwiPVwiICsgcGFyYW1WYWwucmVwbGFjZSggJyMnLCAnJyApO1xuXHRcdHJldHVybiBiYXNlVVJMICsgXCI/XCIgKyBuZXdBZGRpdGlvbmFsVVJMICsgcm93c190eHQ7XG5cdH0sXG5cblx0Z2V0VXJsUGFyYW1ldGVyOiBmdW5jdGlvbiAodXJsLCBzUGFyYW0pIHtcblx0XHR2YXIgc1BhZ2VVUkwgICAgICA9IGRlY29kZVVSSUNvbXBvbmVudCggdXJsLnN1YnN0cmluZyggMSApICksXG5cdFx0XHRzVVJMVmFyaWFibGVzID0gc1BhZ2VVUkwuc3BsaXQoIC9bJnw/XSsvICksXG5cdFx0XHRzUGFyYW1ldGVyTmFtZSxcblx0XHRcdGk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgc1VSTFZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c1BhcmFtZXRlck5hbWUgPSBzVVJMVmFyaWFibGVzW2ldLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0aWYgKHNQYXJhbWV0ZXJOYW1lWzBdID09PSBzUGFyYW0pIHtcblx0XHRcdFx0cmV0dXJuIHNQYXJhbWV0ZXJOYW1lWzFdID09PSB1bmRlZmluZWQgPyB0cnVlIDogc1BhcmFtZXRlck5hbWVbMV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxufTtcbjtcblxuXHRcdFxudG9hc3RyLm9wdGlvbnMgPSB7XG5cdHRhcFRvRGlzbWlzczogdHJ1ZSxcblx0dG9hc3RDbGFzczogJ3RvYXN0Jyxcblx0Y29udGFpbmVySWQ6ICd0b2FzdC1jb250YWluZXInLFxuXHRkZWJ1ZzogZmFsc2UsXG5cdGNsb3NlQnV0dG9uOiBmYWxzZSxcblx0c2hvd01ldGhvZDogJ2ZhZGVJbicsXG5cdHNob3dEdXJhdGlvbjogMzAwLFxuXHRzaG93RWFzaW5nOiAnc3dpbmcnLFxuXHRvblNob3duOiB1bmRlZmluZWQsXG5cdGhpZGVNZXRob2Q6ICdmYWRlT3V0Jyxcblx0aGlkZUR1cmF0aW9uOiAxMDAwLFxuXHRoaWRlRWFzaW5nOiAnc3dpbmcnLFxuXHRvbkhpZGRlbjogdW5kZWZpbmVkLFxuXHRjbG9zZU1ldGhvZDogZmFsc2UsXG5cdGNsb3NlRHVyYXRpb246IGZhbHNlLFxuXHRjbG9zZUVhc2luZzogZmFsc2UsXG5cdGNsb3NlT25Ib3ZlcjogdHJ1ZSxcblx0ZXh0ZW5kZWRUaW1lT3V0OiAyMDAwMCxcblx0aWNvbkNsYXNzZXM6IHtcblx0XHRlcnJvcjogJ3RvYXN0LWVycm9yJyxcblx0XHRpbmZvOiAndG9hc3QtaW5mbycsXG5cdFx0c3VjY2VzczogJ3RvYXN0LXN1Y2Nlc3MnLFxuXHRcdHdhcm5pbmc6ICd0b2FzdC13YXJuaW5nJ1xuXHR9LFxuXHRpY29uQ2xhc3M6ICd0b2FzdC1pbmZvJyxcblx0cG9zaXRpb25DbGFzczogd2xmbWNfbDEwbi50b2FzdF9wb3NpdGlvbiA9PT0gJ2RlZmF1bHQnID8gKHdsZm1jX2wxMG4uaXNfcnRsID8gJ3RvYXN0LXRvcC1yaWdodCcgOiAndG9hc3QtdG9wLWxlZnQnKSA6IHdsZm1jX2wxMG4udG9hc3RfcG9zaXRpb24sXG5cdHRpbWVPdXQ6IDUwMDAsXG5cdHRpdGxlQ2xhc3M6ICd0b2FzdC10aXRsZScsXG5cdG1lc3NhZ2VDbGFzczogJ3RvYXN0LW1lc3NhZ2UnLFxuXHRlc2NhcGVIdG1sOiBmYWxzZSxcblx0dGFyZ2V0OiAnYm9keScsXG5cdG5ld2VzdE9uVG9wOiB0cnVlLFxuXHRwcmV2ZW50RHVwbGljYXRlczogZmFsc2UsXG5cdHByb2dyZXNzQmFyOiB0cnVlLFxuXHRwcm9ncmVzc0NsYXNzOiAndG9hc3QtcHJvZ3Jlc3MnLFxuXHRydGw6ICh3bGZtY19sMTBuLmlzX3J0bCkgPyB0cnVlIDogZmFsc2Vcbn1cbjtcblxuXHRcdCQoIGRvY3VtZW50ICkub24oXG5cdFx0XHQnd2xmbWNfaW5pdCcsXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2ZpeF9vbl9pbWFnZV9zaW5nbGVfcG9zaXRpb24oKTtcblxuXHRcdFx0XHR2YXIgdCAgICAgICAgICAgICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0YiAgICAgICAgICAgICAgICAgICAgICAgPSAkKCAnYm9keScgKSxcblx0XHRcdFx0XHRjYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCA9ICh0eXBlb2YgKHdjX2FkZF90b19jYXJ0X3BhcmFtcykgIT09ICd1bmRlZmluZWQnICYmIHdjX2FkZF90b19jYXJ0X3BhcmFtcyAhPT0gbnVsbCkgPyB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF9yZWRpcmVjdF9hZnRlcl9hZGQgOiAnJztcblx0XHRcdFx0XG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWxpc3QgYnV0dG9uW25hbWU9XCJhcHBseV9idWxrX2FjdGlvbnNcIl0nLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRsZXQgZWxlbSA9ICAkKCB0aGlzICkuY2xvc2VzdCgnLmFjdGlvbi13cmFwcGVyJykuZmluZCgnc2VsZWN0W25hbWU9XCJidWxrX2FjdGlvbnNcIl0nKTtcblx0XHRsZXQgcXVhbnRpdHlfZmllbGRzID0gJCggdGhpcyApLmNsb3Nlc3QoJ2Zvcm0nKS5maW5kKCdpbnB1dC5xdHknKTtcblx0XHRpZiAoIGVsZW0ubGVuZ3RoID4gMCAmJiAnZGVsZXRlJyA9PT0gZWxlbS52YWwoKSAmJiBxdWFudGl0eV9maWVsZHMubGVuZ3RoID4gMCApIHtcblx0XHRcdHF1YW50aXR5X2ZpZWxkcy5hdHRyKCBcImRpc2FibGVkXCIsdHJ1ZSApO1xuXHRcdH1cblx0fVxuKTtcblxuYi5vbihcblx0J2NoYW5nZScsXG5cdCcjYnVsa19hZGRfdG9fY2FydCwjYnVsa19hZGRfdG9fY2FydDInLFxuXHRmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHQgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRjaGVja2JveGVzID0gdC5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5maW5kKCAnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOm5vdCg6ZGlzYWJsZWQpJyApO1xuXHRcdGlmICh0LmlzKCAnOmNoZWNrZWQnICkpIHtcblx0XHRcdGNoZWNrYm94ZXMucHJvcCggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0JyApLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQyJyApLnByb3AoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNoZWNrYm94ZXMucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0XHQkKCAnI2J1bGtfYWRkX3RvX2NhcnQnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0JCggJyNidWxrX2FkZF90b19jYXJ0MicgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0fVxuXHR9XG4pO1xuXG5cbmIub24oXG5cdCdzdWJtaXQnLFxuXHQnLndsZm1jLXBvcHVwLWZvcm0nLFxuXHRmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG50Lm9uKFxuXHQnZm91bmRfdmFyaWF0aW9uJyxcblx0ZnVuY3Rpb24gKGV2LCB2YXJpYXRpb24pIHtcblx0XHR2YXIgdCAgICAgICAgICAgICAgICAgICAgID0gJCggZXYudGFyZ2V0ICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICAgICAgPSB0LmRhdGEoICdwcm9kdWN0X2lkJyApLFxuXHRcdFx0dmFyaWF0aW9uX2RhdGEgICAgICAgID0gdmFyaWF0aW9uO1xuXHRcdHZhcmlhdGlvbl9kYXRhLnByb2R1Y3RfaWQgPSBwcm9kdWN0X2lkO1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dsZm1jX3Nob3dfdmFyaWF0aW9uJywgdmFyaWF0aW9uX2RhdGEgKTtcblx0fVxuKTtcblxudC5vbiggJ3dsZm1jX3JlbG9hZF9mcmFnbWVudHMnLCAkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzICk7XG5cbnQub24oXG5cdCd3bGZtY19mcmFnbWVudHNfbG9hZGVkJyxcblx0ZnVuY3Rpb24gKGV2LCBvcmlnaW5hbCwgdXBkYXRlLCBmaXJzdExvYWQpIHtcblx0XHRpZiAoICEgZmlyc3RMb2FkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JCggJy52YXJpYXRpb25zX2Zvcm0nICkuZmluZCggJy52YXJpYXRpb25zIHNlbGVjdCcgKS5sYXN0KCkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fVxuKTtcblxuLyogPT09IFRBQlMgPT09ICovXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXRhYnMgYTpub3QoLmV4dGVybmFsLWxpbmspJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgY29udGVudCA9ICQoIHRoaXMgKS5kYXRhKCAnY29udGVudCcgKTtcblx0XHQkKCAnLndsZm1jLXRhYi1jb250ZW50JyApLmhpZGUoKTtcblx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy10YWJzLXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdhY3RpdmUtdGFiLWNhcnQgYWN0aXZlLXRhYi1zYXZlLWZvci1sYXRlcicgKTtcblx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53bGZtYy10YWJzLXdyYXBwZXInICkuYWRkQ2xhc3MoICdhY3RpdmUtdGFiLScgKyBjb250ZW50ICk7XG5cdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2xmbWMtdGFicy13cmFwcGVyJyApLmZpbmQoICcud2xmbWMtdGFicyBhJyApLnJlbW92ZUNsYXNzKCAnbmF2LXRhYi1hY3RpdmUnICk7XG5cdFx0JCggdGhpcyApLmFkZENsYXNzKCAnbmF2LXRhYi1hY3RpdmUnICk7XG5cdFx0JCggJy53bGZtY19jb250ZW50XycgKyBjb250ZW50ICkuc2hvdygpO1xuXHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSggJycsICcnLCAkLmZuLldMRk1DLnVwZGF0ZVVSTFBhcmFtZXRlciggd2luZG93LmxvY2F0aW9uLmhyZWYsIFwidGFiXCIsIGNvbnRlbnQgKSApO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuLyogPT09IEdEUFIgPT09ICovXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLWdkcHItYnRuJyxcblx0ZnVuY3Rpb24oZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdGFjdGlvbl90eXBlID0gZWxlbS5kYXRhKCAnYWN0aW9uJyApLFxuXHRcdFx0Y2lkICAgICAgICAgPSBlbGVtLmRhdGEoICdjaWQnICk7XG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5nZHByX2FjdGlvbixcblx0XHRcdFx0XHRub25jZTogZWxlbS5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0Y29udGV4dDogJ2Zyb250ZW5kJyxcblx0XHRcdFx0XHQnYWN0aW9uX3R5cGUnIDogYWN0aW9uX3R5cGUsXG5cdFx0XHRcdFx0J2NpZCcgOiBjaWRcblx0XHRcdFx0fSxcblx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcblx0XHRcdFx0XHRpZiAod2xmbWNfbDEwbi5hamF4X21vZGUgPT09ICdyZXN0X2FwaScpIHtcblx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdsZm1jX2wxMG4ubm9uY2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIGVsZW0gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMudW5sb2FkaW5nKCBlbGVtICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKCAhIGRhdGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQoICcud2xmbWMtZ2Rwci1ub3RpY2Utd3JhcHBlciwgLndsZm1jLXVuc3Vic2NyaWJlLW5vdGljZS13cmFwcGVyJykucmVtb3ZlKCk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdH1cblx0XHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcbjtcblx0XHRcdFx0LyogPT09IFdJU0hMSVNUID09PSAqL1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FkZF90b193aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoIHByb2R1Y3RfYWRkaW5nICYmIEFycmF5LmlzQXJyYXkocHJvZHVjdF9pbl9saXN0KSAmJiAhIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggKSB7XG5cdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfYWRkaW5nICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0cHJvZHVjdF9pZCAgICAgICAgPSB0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnICksXG5cdFx0XHRwYXJlbnRfcHJvZHVjdF9pZCA9IHQuYXR0ciggJ2RhdGEtcGFyZW50LXByb2R1Y3QtaWQnICksXG5cdFx0XHRlbF93cmFwICAgICAgICAgICA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIHByb2R1Y3RfaWQgKSxcblx0XHRcdGZpbHRlcmVkX2RhdGEgICAgID0gbnVsbCxcblx0XHRcdGRhdGEgICAgICAgICAgICAgID0ge1xuXHRcdFx0XHRhY3Rpb246IHdsZm1jX2wxMG4uYWN0aW9ucy5hZGRfdG9fd2lzaGxpc3RfYWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRhZGRfdG9fd2lzaGxpc3Q6IHByb2R1Y3RfaWQsXG5cdFx0XHRcdHByb2R1Y3RfdHlwZTogdC5hdHRyKCAnZGF0YS1wcm9kdWN0LXR5cGUnICksXG5cdFx0XHRcdC8vIHdpc2hsaXN0X2lkOiB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0XHQvLyBmcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggcHJvZHVjdF9pZCApXG5cdFx0XHR9O1xuXHRcdC8vIGFsbG93IHRoaXJkIHBhcnR5IGNvZGUgdG8gZmlsdGVyIGRhdGEuXG5cdFx0aWYgKGZpbHRlcmVkX2RhdGEgPT09ICQoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoICd3bGZtY19hZGRfdG9fd2lzaGxpc3RfZGF0YScsIFt0LCBkYXRhXSApKSB7XG5cdFx0XHRkYXRhID0gZmlsdGVyZWRfZGF0YTtcblx0XHR9XG5cblx0XHRsZXQgY3VycmVudF9wcm9kdWN0X2Zvcm07XG5cblx0XHRpZiAoICQoICdmb3JtLmNhcnRbbWV0aG9kPXBvc3RdW2RhdGEtcHJvZHVjdF9pZD1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScgKS5sZW5ndGggKSB7XG5cblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gJCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF1bZGF0YS1wcm9kdWN0X2lkPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XVtkYXRhLXByb2R1Y3RfaWQ9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdJyApLmVxKCAwICk7XG5cblx0XHR9IGVsc2UgaWYgKCAkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0sIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICkge1xuXG5cdFx0XHRjdXJyZW50X3Byb2R1Y3RfZm9ybSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCggJyNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSwjcHJvZHVjdC0nICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnIGZvcm0udnRhamF4Zm9ybVttZXRob2Q9cG9zdF0nICkubGVuZ3RoICApIHtcblxuXHRcdFx0Y3VycmVudF9wcm9kdWN0X2Zvcm0gPSAkKCAnI3Byb2R1Y3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJyBmb3JtLmNhcnRbbWV0aG9kPXBvc3RdLCNwcm9kdWN0LScgKyBwYXJlbnRfcHJvZHVjdF9pZCArICcgZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XScgKS5lcSggMCApO1xuXG5cdFx0fSBlbHNlIGlmICggJCgnZm9ybS5jYXJ0W21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLnZ0YWpheGZvcm1bbWV0aG9kPXBvc3RdIGJ1dHRvbltuYW1lPVwiYWRkLXRvLWNhcnRcIl1bdmFsdWU9XCInICsgcGFyZW50X3Byb2R1Y3RfaWQgKyAnXCJdLGZvcm0uY2FydFttZXRob2Q9cG9zdF0gaW5wdXRbbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXScpLmxlbmd0aCApIHtcblxuXHRcdFx0bGV0IGJ1dHRvbiA9ICQoJ2Zvcm0uY2FydFttZXRob2Q9cG9zdF0gYnV0dG9uW25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0sZm9ybS52dGFqYXhmb3JtW21ldGhvZD1wb3N0XSBidXR0b25bbmFtZT1cImFkZC10by1jYXJ0XCJdW3ZhbHVlPVwiJyArIHBhcmVudF9wcm9kdWN0X2lkICsgJ1wiXSxmb3JtLmNhcnRbbWV0aG9kPXBvc3RdIGlucHV0W25hbWU9XCJhZGQtdG8tY2FydFwiXVt2YWx1ZT1cIicgKyBwYXJlbnRfcHJvZHVjdF9pZCArICdcIl0nKTtcblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtID0gYnV0dG9uLmNsb3Nlc3QoJ2Zvcm0nKS5lcSggMCApO1xuXG5cdFx0fVxuXG5cdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0aWYgKCAgdHlwZW9mIGN1cnJlbnRfcHJvZHVjdF9mb3JtICE9PSAndW5kZWZpbmVkJyAmJiBjdXJyZW50X3Byb2R1Y3RfZm9ybS5sZW5ndGggPiAwKSB7XG5cdFx0XHQvKmN1cnJlbnRfcHJvZHVjdF9mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT0nYWRkLXRvLWNhcnQnXVwiICkuYXR0ciggXCJkaXNhYmxlZFwiLHRydWUgKTtcblx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT0nYWRkLXRvLWNhcnQnXVwiICkucmVtb3ZlQXR0ciggXCJkaXNhYmxlZFwiICk7Ki9cblx0XHRcdGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCBjdXJyZW50X3Byb2R1Y3RfZm9ybS5nZXQoIDAgKSApO1xuXHRcdFx0LyokLmVhY2goXG5cdFx0XHRcdGN1cnJlbnRfcHJvZHVjdF9mb3JtLFxuXHRcdFx0XHRmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cdFx0XHRcdFx0JCggZWxlbWVudCApLmZpbmQoICdkaXYuY29tcG9zaXRlX2NvbXBvbmVudCcgKS5ub3QoICc6dmlzaWJsZScgKS5lYWNoKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9ICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1pdGVtX2lkJyApO1xuXHRcdFx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoICd3Y2NwX2NvbXBvbmVudF9zZWxlY3Rpb25fbmlsWycgKyBpZCArICddJyAsICcxJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7Ki9cblx0XHRcdGZvcm1EYXRhLmRlbGV0ZSggJ2FkZC10by1jYXJ0JyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgYWRkX3RvX2NhcnRfbGluayA9IHQuY2xvc2VzdCggJy5wcm9kdWN0LnBvc3QtJyArIHBhcmVudF9wcm9kdWN0X2lkICkuZmluZCggJy5hZGRfdG9fY2FydF9idXR0b24nICk7XG5cdFx0XHRpZiAoIGFkZF90b19jYXJ0X2xpbmsubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhLnF1YW50aXR5ID0gYWRkX3RvX2NhcnRfbGluay5hdHRyKCAnZGF0YS1xdWFudGl0eScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkLmVhY2goXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZnVuY3Rpb24oa2V5LHZhbHVlT2JqKXtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXkgLCB0eXBlb2YgdmFsdWVPYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoIHZhbHVlT2JqICkgOiB2YWx1ZU9iaiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRqUXVlcnkoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnd2xmbWNfYWRkaW5nX3RvX3dpc2hsaXN0JyApO1xuXG5cdFx0aWYgKCAhICQuZm4uV0xGTUMuaXNfY29va2llX2VuYWJsZWQoKSkge1xuXHRcdFx0cHJvZHVjdF9hZGRpbmcgPSBmYWxzZTtcblx0XHRcdHdpbmRvdy5hbGVydCggd2xmbWNfbDEwbi5sYWJlbHMuY29va2llX2Rpc2FibGVkICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdC8vZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRcdGNhY2hlOiBmYWxzZSxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwcm9kdWN0X2FkZGluZyA9IHRydWU7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHByb2R1Y3RfYWRkaW5nID0gZmFsc2U7XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuXHRcdFx0XHRcdHZhciByZXNwb25zZV9yZXN1bHQgID0gcmVzcG9uc2UucmVzdWx0LFxuXHRcdFx0XHRcdFx0cmVzcG9uc2VfbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgID0gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgfHwgcmVzcG9uc2VfcmVzdWx0ID09PSAnZXhpc3RzJykge1xuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UuaXRlbV9pZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBwcm9kdWN0X2luX2xpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aXNobGlzdF9pZDogcmVzcG9uc2Uud2lzaGxpc3RfaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1faWQ6IHJlc3BvbnNlLml0ZW1faWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaWQ6IHBhcnNlSW50KCBwcm9kdWN0X2lkICksXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgcG9wdXBfaWQgPSBlbF93cmFwLmF0dHIoICdkYXRhLXBvcHVwLWlkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAocG9wdXBfaWQpIHtcblxuXHRcdFx0XHRcdFx0XHRzaG93X3RvYXN0ICAgICAgICAgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0dmFyIGVsZW0gICAgICAgICAgID0gJCggJyMnICsgcG9wdXBfaWQgKTtcblx0XHRcdFx0XHRcdFx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdGFic29sdXRlOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJyMzMzMnLFxuXHRcdFx0XHRcdFx0XHRcdHRyYW5zaXRpb246ICdhbGwgMC4zcycsXG5cdFx0XHRcdFx0XHRcdFx0aG9yaXpvbnRhbDogZWxlbS5kYXRhKCAnaG9yaXpvbnRhbCcgKSxcblx0XHRcdFx0XHRcdFx0XHR2ZXJ0aWNhbDogZWxlbS5kYXRhKCAndmVydGljYWwnIClcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0ZWxlbS5wb3B1cCggZGVmYXVsdE9wdGlvbnMgKTtcblx0XHRcdFx0XHRcdFx0JCgnI3dsZm1jLXRvb2x0aXAnKVxuXHRcdFx0XHRcdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdFx0XHRcdFx0J3RvcCc6ICcwJyxcblx0XHRcdFx0XHRcdFx0XHRcdCdsZWZ0JzogJzAnXG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoKVxuXHRcdFx0XHRcdFx0XHRcdC5hZGRDbGFzcygndG9vbHRpcF9faGlkZGVuJyk7XG5cdFx0XHRcdFx0XHRcdGVsZW0ucG9wdXAoICdzaG93JyApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X2FkZGVkX3RleHQgKSAmJiByZXNwb25zZV9yZXN1bHQgPT09ICd0cnVlJykge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcyggd2xmbWNfbDEwbi5sYWJlbHMucHJvZHVjdF9hZGRlZF90ZXh0ICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2VfcmVzdWx0ID09PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9hdXRvbWF0aW9ucyggcHJvZHVjdF9pZCwgcmVzcG9uc2Uud2lzaGxpc3RfaWQsIHJlc3BvbnNlLmN1c3RvbWVyX2lkLCAnd2lzaGxpc3QnLCByZXNwb25zZS5sb2FkX2F1dG9tYXRpb25fbm9uY2UgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlX3Jlc3VsdCA9PT0gJ3RydWUnICYmIHdsZm1jX2wxMG4uY2xpY2tfYmVoYXZpb3IgPT09ICdhZGQtcmVkaXJlY3QnICkge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3bGZtY19sMTBuLndpc2hsaXN0X3BhZ2VfdXJsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggc2hvd190b2FzdCAmJiAnJyAhPT0gJC50cmltKCByZXNwb25zZS5tZXNzYWdlICkgJiYgcmVzcG9uc2VfcmVzdWx0ICE9PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHJlc3BvbnNlX21lc3NhZ2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXG5cdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3dsZm1jX2FkZGVkX3RvX3dpc2hsaXN0JywgW3QsIGVsX3dyYXBdICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19hamF4X2FkZF90b19jYXJ0Om5vdCguZGlzYWJsZWQpJyxcblx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIHQgICAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0aXRlbV9pZCAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW1faWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCA9IHQuYXR0ciggJ2RhdGEtd2lzaGxpc3RfaWQnICksXG5cdFx0XHRkYXRhICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuYWRkX3RvX2NhcnRfYWN0aW9uLFxuXHRcdFx0XHRub25jZTogdC5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdGNvbnRleHQ6ICdmcm9udGVuZCcsXG5cdFx0XHRcdGxpZDogaXRlbV9pZCxcblx0XHRcdFx0d2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdH07XG5cdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHQucmVtb3ZlQ2xhc3MoICdhZGRlZCcgKTtcblx0XHR0LmFkZENsYXNzKCAnbG9hZGluZycgKTtcblxuXHRcdC8vIEFsbG93IDNyZCBwYXJ0aWVzIHRvIHZhbGlkYXRlIGFuZCBxdWl0IGVhcmx5LlxuXHRcdGlmICggZmFsc2UgPT09ICQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VySGFuZGxlciggJ3Nob3VsZF9zZW5kX2FqYXhfcmVxdWVzdC5hZGRpbmdfdG9fY2FydCcsIFsgdCBdICkgKSB7XG5cdFx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FqYXhfcmVxdWVzdF9ub3Rfc2VudC5hZGRpbmdfdG9fY2FydCcsIFsgZmFsc2UsIGZhbHNlLCB0IF0gKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQkKCBkb2N1bWVudC5ib2R5ICkudHJpZ2dlciggJ2FkZGluZ190b19jYXJ0JywgWyB0LCBkYXRhIF0gKTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFkbWluX3VybCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuXHRcdFx0XHRcdGlmICggISByZXNwb25zZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yIHx8ICggcmVzcG9uc2Uuc3VjY2VzcyAmJiAhICQuZm4uV0xGTUMuaXNUcnVlKCByZXNwb25zZS5zdWNjZXNzICkgKSApIHtcblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2UucHJvZHVjdF91cmwgKSB7XG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHJlc3BvbnNlLnByb2R1Y3RfdXJsO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoICcnICE9PSB3bGZtY19sMTBuLmxhYmVscy5mYWlsZWRfYWRkX3RvX2NhcnRfbWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5mYWlsZWRfYWRkX3RvX2NhcnRfbWVzc2FnZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBSZWRpcmVjdCB0byBjYXJ0IG9wdGlvbi5cblx0XHRcdFx0XHRcdGlmICggJC5mbi5XTEZNQy5pc1RydWUoIHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCApICkge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSB3Y19hZGRfdG9fY2FydF9wYXJhbXMuY2FydF91cmw7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCd3Y19mcmFnbWVudF9yZWZyZXNoJyk7XG5cdFx0XHRcdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IHNvIHRoZW1lcyBjYW4gcmVmcmVzaCBvdGhlciBhcmVhcy5cblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkZWRfdG9fY2FydCcsIFsgcmVzcG9uc2UuZnJhZ21lbnRzLCByZXNwb25zZS5jYXJ0X2hhc2gsIHQgXSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoICcnICE9PSB3bGZtY19sMTBuLmxhYmVscy5hZGRlZF90b19jYXJ0X21lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCB3bGZtY19sMTBuLmxhYmVscy5hZGRlZF90b19jYXJ0X21lc3NhZ2UgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UubWVzc2FnZSAmJiAnJyAhPT0gcmVzcG9uc2UubWVzc2FnZSApIHtcblx0XHRcdFx0XHRcdCQoIGRvY3VtZW50LmJvZHkgKS50cmlnZ2VyKCAnYWRkX3RvX2NhcnRfbWVzc2FnZScsIFsgcmVzcG9uc2UubWVzc2FnZSwgdF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtYy1idG4tbG9naW4tbmVlZCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dG9hc3RyLmVycm9yKCB3bGZtY19sMTBuLmxhYmVscy5sb2dpbl9uZWVkICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jX2FscmVhZHlfaW5fd2lzaGxpc3QnLFxuXHRmdW5jdGlvbiAoZXYpIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRvYXN0ci5lcnJvciggd2xmbWNfbDEwbi5sYWJlbHMuYWxyZWFkeV9pbl93aXNobGlzdF90ZXh0ICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2snLFxuXHQnLndsZm1jLXdpc2hsaXN0LXRhYmxlIC5yZW1vdmVfZnJvbV93aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgdGFibGUgICAgICAgICAgPSB0LnBhcmVudHMoICcud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKSxcblx0XHRcdHJvdyAgICAgICAgICAgID0gdC5wYXJlbnRzKCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdGRhdGFfcm93X2lkICAgID0gcm93LmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHR3aXNobGlzdF9pZCAgICA9IHRhYmxlLmRhdGEoICdpZCcgKSxcblx0XHRcdHdpc2hsaXN0X3Rva2VuID0gdGFibGUuZGF0YSggJ3Rva2VuJyApLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHQuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV93aXNobGlzdDogZGF0YV9yb3dfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHdpc2hsaXN0X3Rva2VuLFxuXHRcdFx0XHQvL2ZyYWdtZW50czogcmV0cmlldmVfZnJhZ21lbnRzKCBkYXRhX3Jvd19pZCApXG5cdFx0XHR9O1xuXG5cdFx0JC5hamF4KFxuXHRcdFx0e1xuXHRcdFx0XHR1cmw6IHdsZm1jX2wxMG4uYWpheF91cmwsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG5cdFx0XHRcdFx0aWYgKHdsZm1jX2wxMG4uYWpheF9tb2RlID09PSAncmVzdF9hcGknKSB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB3bGZtY19sMTBuLm5vbmNlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMuYmxvY2soIHJvdyApO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmJsb2NrKCByb3cgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRsZXQgaTtcblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0LyppZiAodHlwZW9mIGRhdGEuZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHRpZiAoICQuZm4uV0xGTUMuaXNUcnVlKCBkYXRhLnJlc3VsdCApICkge1xuXHRcdFx0XHRcdFx0cm93LmFkZENsYXNzKCdkaXNhYmxlZC1yb3cnKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX2xpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fbGlzdFtpXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fbGlzdFtpXS5wcm9kdWN0X2lkID09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dpc2hsaXN0JywgW3QsIHJvdyAsIGRhdGFdICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0W2ldLndpc2hsaXN0X2lkID09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2FpdGxpc3QnLCBbdCwgcm93ICwgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl93YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG5iLm9uKFxuXHQnY2xpY2sgdG91Y2hlbmQnLFxuXHQnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd2lzaGxpc3QgLnJlbW92ZV9mcm9tX3dpc2hsaXN0LC53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdhaXRsaXN0IC5yZW1vdmVfZnJvbV93aXNobGlzdCcsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ID0gJCggdGhpcyApO1xuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgdGFibGUgICAgICAgICAgPSB0LnBhcmVudHMoICcud2xmbWMtd2lzaGxpc3QtaXRlbXMtd3JhcHBlcicgKSxcblx0XHRcdHJvdyAgICAgICAgICAgID0gdC5wYXJlbnRzKCAnW2RhdGEtcm93LWlkXScgKSxcblx0XHRcdGRhdGFfcm93X2lkICAgID0gcm93LmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHRkYXRhX2l0ZW1faWQgICA9IHJvdy5kYXRhKCAnaXRlbS1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X2lkICAgID0gcm93LmRhdGEoICd3aXNobGlzdC1pZCcgKSxcblx0XHRcdHdpc2hsaXN0X3Rva2VuID0gcm93LmRhdGEoICd3aXNobGlzdC10b2tlbicgKSxcblx0XHRcdGxpc3RfdGFibGUgICAgICAgICAgICAgICAgICA9ICQoJy53bGZtYy13aXNobGlzdC1mb3JtIC53bGZtYy13aXNobGlzdC10YWJsZScpLFxuXHRcdFx0ZGF0YSAgICAgICAgICAgPSB7XG5cdFx0XHRcdGFjdGlvbjogd2xmbWNfbDEwbi5hY3Rpb25zLnJlbW92ZV9mcm9tX3dpc2hsaXN0X2FjdGlvbixcblx0XHRcdFx0bm9uY2U6IHQuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHRyZW1vdmVfZnJvbV93aXNobGlzdDogZGF0YV9yb3dfaWQsXG5cdFx0XHRcdHdpc2hsaXN0X2lkOiB3aXNobGlzdF9pZCxcblx0XHRcdFx0d2lzaGxpc3RfdG9rZW46IHdpc2hsaXN0X3Rva2VuLFxuXHRcdFx0XHRtZXJnZV9saXN0czogd2xmbWNfbDEwbi5tZXJnZV9saXN0cyxcblx0XHRcdFx0Ly9mcmFnbWVudHM6IHJldHJpZXZlX2ZyYWdtZW50cyggZGF0YV9yb3dfaWQgKVxuXHRcdFx0fTtcblxuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLnVubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXG5cdFx0XHRcdFx0aWYgKCAkLmZuLldMRk1DLmlzVHJ1ZSggZGF0YS5yZXN1bHQgKSApIHtcblx0XHRcdFx0XHRcdHZhciBsb2FkX2ZyYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX2xpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBwcm9kdWN0X2NvdW50IC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdFtpXS53aXNobGlzdF9pZCA9PT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl9saXN0W2ldLnByb2R1Y3RfaWQgPT09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dpc2hsaXN0JywgW3QsIHJvdywgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF9wcm9kdWN0c19oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl9saXN0ICkgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX3dhaXRsaXN0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ud2lzaGxpc3RfaWQgPT09IHdpc2hsaXN0X2lkICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ucHJvZHVjdF9pZCA9PT0gZGF0YV9yb3dfaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fd2FpdGxpc3Quc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2xmbWNfcmVtb3ZlZF9mcm9tX3dhaXRsaXN0JywgW3QsIHJvdywgZGF0YV0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnNldF93YWl0bGlzdF9oYXNoKCBKU09OLnN0cmluZ2lmeSggcHJvZHVjdF9pbl93YWl0bGlzdCApICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggdC5jbG9zZXN0KCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQvLyQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXByb2R1Y3RzLWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGRhdGEuY291bnQgKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdpc2hsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggZGF0YS5jb3VudCApO1xuXG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LndsZm1jLWFkZC10by13aXNobGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggdC5jbG9zZXN0KCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQvLyQoICcud2xmbWMtd2lzaGxpc3QtZm9ybScgKS5maW5kKCAnW2RhdGEtaXRlbS1pZD1cIicgKyBkYXRhX2l0ZW1faWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIGRhdGEuY291bnQgKTtcblx0XHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdhaXRsaXN0IC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggZGF0YS5jb3VudCApO1xuXG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LndsZm1jLWFkZC10by13YWl0bGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggbGlzdF90YWJsZS5sZW5ndGggPiAwICYmIHBhcnNlSW50KCB3aXNobGlzdF9pZCApID09PSBwYXJzZUludCggbGlzdF90YWJsZS5hdHRyKCAnZGF0YS1pZCcgKSApICkge1xuXHRcdFx0XHRcdFx0XHRsaXN0X3RhYmxlLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkuYWRkQ2xhc3MoJ2Rpc2FibGVkLXJvdycpO1xuXHRcdFx0XHRcdFx0XHRsb2FkX2ZyYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKChkYXRhLmNvdW50IDwgMSB8fCAhIHRhYmxlLmZpbmQoICdbZGF0YS1yb3ctaWRdJyApLmxlbmd0aCkgKSB7XG5cdFx0XHRcdFx0XHRcdGxvYWRfZnJhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggbG9hZF9mcmFnICkge1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvKmlmICgoZGF0YS5jb3VudCA8IDEgfHwgISB0YWJsZS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5sZW5ndGgpICYmIHR5cGVvZiBkYXRhLmZyYWdtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGRhdGEuZnJhZ21lbnRzICk7XG5cdFx0XHRcdFx0XHR9Ki9cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfaGFuZGxpbmdfYWZ0ZXJfYWpheCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuKTtcblxuYi5vbihcblx0J2NsaWNrJyxcblx0Jy53bGZtY19kZWxldGVfaXRlbScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgICAgICA9ICQoIHRoaXMgKSxcblx0XHRcdHByb2R1Y3RfaWQgID0gdC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJyApLFxuXHRcdFx0d2lzaGxpc3RfaWQgPSB0LmF0dHIoICdkYXRhLXdpc2hsaXN0LWlkJyApLFxuXHRcdFx0aXRlbV9pZCAgICAgPSB0LmF0dHIoICdkYXRhLWl0ZW0taWQnICksXG5cdFx0XHRlbF93cmFwICAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LScgKyBwcm9kdWN0X2lkICksXG5cdFx0XHRkYXRhICAgICAgICA9IHtcblx0XHRcdFx0YWN0aW9uOiB3bGZtY19sMTBuLmFjdGlvbnMuZGVsZXRlX2l0ZW1fYWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0OiAnZnJvbnRlbmQnLFxuXHRcdFx0XHR3aXNobGlzdF9pZDogd2lzaGxpc3RfaWQsXG5cdFx0XHRcdGl0ZW1faWQ6IGl0ZW1faWQsXG5cdFx0XHRcdC8vZnJhZ21lbnRzOiByZXRyaWV2ZV9mcmFnbWVudHMoIHByb2R1Y3RfaWQgKVxuXHRcdFx0fTtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQuYWpheChcblx0XHRcdHtcblx0XHRcdFx0dXJsOiB3bGZtY19sMTBuLmFqYXhfdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuXHRcdFx0XHRcdGlmICh3bGZtY19sMTBuLmFqYXhfbW9kZSA9PT0gJ3Jlc3RfYXBpJykge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgd2xmbWNfbDEwbi5ub25jZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZGluZyggdCApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy51bmxvYWRpbmcoIHQgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0dmFyIGZyYWdtZW50cyAgICAgICAgPSByZXNwb25zZS5mcmFnbWVudHMsXG5cdFx0XHRcdFx0XHRyZXNwb25zZV9tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcblxuXHRcdFx0XHRcdGlmICgndHJ1ZScgPT09IHJlc3BvbnNlLnJlc3VsdCkge1xuXHRcdFx0XHRcdFx0ZWxfd3JhcC5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHByb2R1Y3RfaW5fbGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl9saXN0ICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl9saXN0ID0gJC5ncmVwKFxuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdCxcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGUuaXRlbV9pZCAhPT0gcGFyc2VJbnQoIGl0ZW1faWQgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdCQuZm4uV0xGTUMuc2V0X3Byb2R1Y3RzX2hhc2goIEpTT04uc3RyaW5naWZ5KCBwcm9kdWN0X2luX2xpc3QgKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICEgdC5jbG9zZXN0KCAnLndsZm1jLXJlbW92ZS1idXR0b24nICkubGVuZ3RoICYmICcnICE9PSAkLnRyaW0oIHJlc3BvbnNlX21lc3NhZ2UgKSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCByZXNwb25zZV9tZXNzYWdlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgndHJ1ZScgPT09IHJlc3BvbnNlLnJlc3VsdCAmJiAnJyAhPT0gJC50cmltKCB3bGZtY19sMTBuLmxhYmVscy5wcm9kdWN0X3JlbW92ZWRfdGV4dCApKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoIHdsZm1jX2wxMG4ubGFiZWxzLnByb2R1Y3RfcmVtb3ZlZF90ZXh0ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdFx0XHQvKmlmICh0eXBlb2YgZnJhZ21lbnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0cmVwbGFjZV9mcmFnbWVudHMoIGZyYWdtZW50cyApO1xuXHRcdFx0XHRcdH0qL1xuXG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X2hhbmRsaW5nX2FmdGVyX2FqYXgoKTtcblxuXHRcdFx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3bGZtY19yZW1vdmVkX2Zyb21fd2lzaGxpc3QnLCBbdCwgZWxfd3JhcCwgcmVzcG9uc2VdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4pO1xuXG50Lm9uKFxuXHQnd2xmbWNfc2hvd192YXJpYXRpb24nICxcblx0ZnVuY3Rpb24gKGV2LCBkYXRhKSB7XG5cdFx0dmFyIHQgICAgICAgICAgICAgICAgID0gJCggZXYudGFyZ2V0ICksXG5cdFx0XHRwcm9kdWN0X2lkICAgICAgICA9IGRhdGEucHJvZHVjdF9pZCxcblx0XHRcdHZhcmlhdGlvbl9pZCAgICAgID0gZGF0YS52YXJpYXRpb25faWQsXG5cdFx0XHR0YXJnZXRzICAgICAgICAgICA9ICQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0IFtkYXRhLXBhcmVudC1wcm9kdWN0LWlkPVwiJyArIHByb2R1Y3RfaWQgKyAnXCJdJyApLFxuXHRcdFx0ZW5hYmxlX291dG9mc3RvY2sgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLmRhdGEoICdlbmFibGUtb3V0b2ZzdG9jaycgKTtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHZhcmlhdGlvbl9pZCB8fCAhIHRhcmdldHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICggISBlbmFibGVfb3V0b2ZzdG9jayAmJiAhIGRhdGEuaXNfaW5fc3RvY2spIHtcblx0XHRcdHRhcmdldHMuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICkuYWRkQ2xhc3MoICdoaWRlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLnJlbW92ZUNsYXNzKCAnaGlkZScgKTtcblx0XHR9XG5cdFx0dmFyIHBvcHVwSWQgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLmF0dHIoICdkYXRhLXBvcHVwLWlkJyApO1xuXHRcdGlmICggcG9wdXBJZCApIHtcblx0XHRcdHZhciBwb3B1cCAgID0gJCgnIycgKyBwb3B1cElkKTtcblx0XHRcdGlmIChwb3B1cC5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIHByb2R1Y3RfdGl0bGUgID0gcG9wdXAuZGF0YSggJ3Byb2R1Y3QtdGl0bGUnICk7XG5cdFx0XHRcdHZhciBkZXNjICAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX2NvbnRlbnQ7XG5cdFx0XHRcdHZhciB0aXRsZSAgICAgICAgICA9IHdsZm1jX2wxMG4ubGFiZWxzLnBvcHVwX3RpdGxlO1xuXHRcdFx0XHR2YXIgaW1hZ2Vfc2l6ZSAgICAgPSBwb3B1cC5kYXRhKCAnaW1hZ2Utc2l6ZScgKTtcblx0XHRcdFx0dmFyIGltZyAgICAgICAgICAgID0gcG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1oZWFkZXIgaW1nJyApLmRhdGEoICdzcmMnICk7XG5cdFx0XHRcdHZhciBvcmlnaW5hbF9wcmljZSA9IHBvcHVwLmZpbmQoICcud2xmbWMtcGFyZW50LXByb2R1Y3QtcHJpY2UnICkuaHRtbCgpO1xuXHRcdFx0XHR2YXIgcHJvZHVjdF9wcmljZSAgPSAnJyAhPT0gZGF0YS5wcmljZV9odG1sID8gZGF0YS5wcmljZV9odG1sIDogb3JpZ2luYWxfcHJpY2U7XG5cblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIHByb2R1Y3RfcHJpY2UgKTtcblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X25hbWV9JywgcHJvZHVjdF90aXRsZSApO1xuXG5cdFx0XHRcdHRpdGxlID0gdGl0bGUucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIHByb2R1Y3RfcHJpY2UgKTtcblx0XHRcdFx0dGl0bGUgPSB0aXRsZS5yZXBsYWNlKCAne3Byb2R1Y3RfbmFtZX0nLCBwcm9kdWN0X3RpdGxlICk7XG5cblx0XHRcdFx0aWYgKGRhdGEuaW1hZ2VfaWQgJiYgJ3RydWUnID09IHBvcHVwLmRhdGEoICd1c2UtZmVhdHVyZWQnICkpIHtcblx0XHRcdFx0XHRpbWcgPSAnbGFyZ2UnID09PSBpbWFnZV9zaXplID8gZGF0YS5pbWFnZS5mdWxsX3NyYyA6ICgndGh1bWJuYWlsJyA9PT0gaW1hZ2Vfc2l6ZSA/IGRhdGEuaW1hZ2UudGh1bWJfc3JjIDogZGF0YS5pbWFnZS5zcmMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC10aXRsZScgKS5odG1sKCB0aXRsZSApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWRlc2MnICkuaHRtbCggZGVzYyApO1xuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLWhlYWRlciBpbWcnICkuYXR0ciggJ3NyYycsIGltZyApO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdCAgICAgICAgID0gJCggdGhpcyApLFxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHQuY2xvc2VzdCggJy53bGZtYy1hZGQtdG8td2lzaGxpc3QnICk7XG5cblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wYXJlbnQtcHJvZHVjdC1pZCcsIHByb2R1Y3RfaWQgKTtcblx0XHRcdFx0dC5hdHRyKCAnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWF0aW9uX2lkICk7XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lci5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdGNvbnRhaW5lclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgY2xhc3Nlcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hdGNoKCAvd2xmbWMtYWRkLXRvLXdpc2hsaXN0LVxcUysvZyApLmpvaW4oICcgJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoICd3bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIHZhcmlhdGlvbl9pZCApLnJlbW92ZUNsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jLWFkZHRvd2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1hZGQtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgdmFyaWF0aW9uX2lkICkgKTtcblx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWMtcmVtb3ZlZnJvbXdpc2hsaXN0IGEnICkuYXR0ciggJ2hyZWYnLCBjb250YWluZXIuYXR0ciggJ2RhdGEtcmVtb3ZlLXVybCcgKS5yZXBsYWNlKCBcIiNwcm9kdWN0X2lkXCIsIHZhcmlhdGlvbl9pZCApICk7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcgJiYgdi5wcm9kdWN0X2lkICYmIHYucHJvZHVjdF9pZCA9PSB2YXJpYXRpb25faWQpIHtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCAnZXhpc3RzJyApO1xuXHRcdFx0XHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtY19kZWxldGVfaXRlbScgKS5hdHRyKCAnZGF0YS13aXNobGlzdC1pZCcsIHYud2lzaGxpc3RfaWQgKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWNfZGVsZXRlX2l0ZW0nICkuYXR0ciggJ2RhdGEtaXRlbS1pZCcsIHYuaXRlbV9pZCApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbik7XG50Lm9uKFxuXHQncmVzZXRfZGF0YScsXG5cdGZ1bmN0aW9uIChldikge1xuXHRcdHZhciB0ICAgICAgICAgID0gJCggZXYudGFyZ2V0ICksXG5cdFx0XHRwcm9kdWN0X2lkID0gdC5kYXRhKCAncHJvZHVjdF9pZCcgKSxcblx0XHRcdHRhcmdldHMgICAgPSAkKCAnLndsZm1jLWFkZC10by13aXNobGlzdCBbZGF0YS1wYXJlbnQtcHJvZHVjdC1pZD1cIicgKyBwcm9kdWN0X2lkICsgJ1wiXScgKTtcblx0XHRpZiAoICEgcHJvZHVjdF9pZCB8fCAhIHRhcmdldHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGFyZ2V0cy5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKS5yZW1vdmVDbGFzcyggJ2hpZGUnICk7XG5cdFx0dmFyIHBvcHVwSWQgPSB0YXJnZXRzLmNsb3Nlc3QoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0JyApLmF0dHIoICdkYXRhLXBvcHVwLWlkJyApO1xuXHRcdGlmICggcG9wdXBJZCApIHtcblx0XHRcdHZhciBwb3B1cCAgID0gJCgnIycgKyBwb3B1cElkKTtcblx0XHRcdGlmIChwb3B1cC5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIG9yaWdpbmFsX3ByaWNlID0gcG9wdXAuZmluZCggJy53bGZtYy1wYXJlbnQtcHJvZHVjdC1wcmljZScgKS5odG1sKCk7XG5cdFx0XHRcdHZhciBwcm9kdWN0X3RpdGxlICA9IHBvcHVwLmRhdGEoICdwcm9kdWN0LXRpdGxlJyApO1xuXHRcdFx0XHR2YXIgZGVzYyAgICAgICAgICAgPSB3bGZtY19sMTBuLmxhYmVscy5wb3B1cF9jb250ZW50O1xuXHRcdFx0XHR2YXIgdGl0bGUgICAgICAgICAgPSB3bGZtY19sMTBuLmxhYmVscy5wb3B1cF90aXRsZTtcblxuXHRcdFx0XHR2YXIgaW1nID0gcG9wdXAuZmluZCggJy53bGZtYy1wb3B1cC1oZWFkZXIgaW1nJyApLmRhdGEoICdzcmMnICk7XG5cblx0XHRcdFx0ZGVzYyA9IGRlc2MucmVwbGFjZSggJ3twcm9kdWN0X3ByaWNlfScsIG9yaWdpbmFsX3ByaWNlICk7XG5cdFx0XHRcdGRlc2MgPSBkZXNjLnJlcGxhY2UoICd7cHJvZHVjdF9uYW1lfScsIHByb2R1Y3RfdGl0bGUgKTtcblxuXHRcdFx0XHR0aXRsZSA9IHRpdGxlLnJlcGxhY2UoICd7cHJvZHVjdF9wcmljZX0nLCBvcmlnaW5hbF9wcmljZSApO1xuXHRcdFx0XHR0aXRsZSA9IHRpdGxlLnJlcGxhY2UoICd7cHJvZHVjdF9uYW1lfScsIHByb2R1Y3RfdGl0bGUgKTtcblxuXHRcdFx0XHRwb3B1cC5maW5kKCAnLndsZm1jLXBvcHVwLXRpdGxlJyApLmh0bWwoIHRpdGxlICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtZGVzYycgKS5odG1sKCBkZXNjICk7XG5cdFx0XHRcdHBvcHVwLmZpbmQoICcud2xmbWMtcG9wdXAtaGVhZGVyIGltZycgKS5hdHRyKCAnc3JjJywgaW1nICk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0YXJnZXRzLmVhY2goXG5cdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0ICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHRcdFx0Y29udGFpbmVyID0gdC5jbG9zZXN0KCAnLndsZm1jLWFkZC10by13aXNobGlzdCcgKTtcblxuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXBhcmVudC1wcm9kdWN0LWlkJywgcHJvZHVjdF9pZCApO1xuXHRcdFx0XHR0LmF0dHIoICdkYXRhLXByb2R1Y3QtaWQnLCBwcm9kdWN0X2lkICk7XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lci5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdGNvbnRhaW5lclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoaSwgY2xhc3Nlcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hdGNoKCAvd2xmbWMtYWRkLXRvLXdpc2hsaXN0LVxcUysvZyApLmpvaW4oICcgJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoICd3bGZtYy1hZGQtdG8td2lzaGxpc3QtJyArIHByb2R1Y3RfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1hZGR0b3dpc2hsaXN0IGEnICkuYXR0ciggJ2hyZWYnLCBjb250YWluZXIuYXR0ciggJ2RhdGEtYWRkLXVybCcgKS5yZXBsYWNlKCBcIiNwcm9kdWN0X2lkXCIsIHByb2R1Y3RfaWQgKSApO1xuXHRcdFx0XHRjb250YWluZXIuZmluZCggJy53bGZtYy1yZW1vdmVmcm9td2lzaGxpc3QgYScgKS5hdHRyKCAnaHJlZicsIGNvbnRhaW5lci5hdHRyKCAnZGF0YS1yZW1vdmUtdXJsJyApLnJlcGxhY2UoIFwiI3Byb2R1Y3RfaWRcIiwgcHJvZHVjdF9pZCApICk7XG5cdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRwcm9kdWN0X2luX2xpc3QsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcgJiYgdi5wcm9kdWN0X2lkICYmIHYucHJvZHVjdF9pZCA9PSBwcm9kdWN0X2lkKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoICcud2xmbWNfZGVsZXRlX2l0ZW0nICkuYXR0ciggJ2RhdGEtd2lzaGxpc3QtaWQnLCB2Lndpc2hsaXN0X2lkICk7XG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCAnLndsZm1jX2RlbGV0ZV9pdGVtJyApLmF0dHIoICdkYXRhLWl0ZW0taWQnLCB2Lml0ZW1faWQgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdH1cbik7XG47XG5cdFx0XHRcdFxuXG50Lm9uKFxuXHQnYWRkaW5nX3RvX2NhcnQnLFxuXHQnYm9keScsXG5cdGZ1bmN0aW9uIChldiwgYnV0dG9uLCBkYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiBidXR0b24gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkYXRhICE9PSAndW5kZWZpbmVkJyAmJiBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkubGVuZ3RoKSB7XG5cdFx0XHRkYXRhLndpc2hsaXN0X2lkICAgPSBidXR0b24uY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC10YWJsZSwud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUnICkuZGF0YSggJ2lkJyApO1xuXHRcdFx0ZGF0YS53aXNobGlzdF90eXBlID0gYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmRhdGEoICd3aXNobGlzdC10eXBlJyApO1xuXHRcdFx0ZGF0YS5jdXN0b21lcl9pZCAgID0gYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUsLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmRhdGEoICdjdXN0b21lci1pZCcgKTtcblx0XHRcdGRhdGEuaXNfb3duZXIgICAgICA9IGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLC53bGZtYy1zYXZlLWZvci1sYXRlci10YWJsZScgKS5kYXRhKCAnaXMtb3duZXInICk7XG5cdFx0XHR0eXBlb2Ygd2NfYWRkX3RvX2NhcnRfcGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiAoIHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCA9IHdsZm1jX2wxMG4ucmVkaXJlY3RfdG9fY2FydCApO1xuXG5cdFx0XHQvKmxldCBwcm9kdWN0X21ldGEgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBidXR0b24uZGF0YSggJ3dsZm1jX3Byb2R1Y3RfbWV0YScgKTtcblx0XHRcdGlmIChwcm9kdWN0X21ldGEpIHtcblx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdHByb2R1Y3RfbWV0YSxcblx0XHRcdFx0XHRmdW5jdGlvbiAoayx2YWx1ZSkge1xuXHRcdFx0XHRcdFx0ZGF0YVtrXSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdFx0ZGF0YS53bGZtY19wcm9kdWN0X21ldGEgPSB0cnVlO1xuXHRcdFx0fSovXG5cdFx0fVxuXHR9XG4pO1xuXG50Lm9uKFxuXHQnYWRkZWRfdG9fY2FydCcsXG5cdCdib2R5Jyxcblx0ZnVuY3Rpb24gKGV2LCBmcmFnbWVudHMsIGNhcnRoYXNoLCBidXR0b24pIHtcblx0XHRpZiAodHlwZW9mIGJ1dHRvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYnV0dG9uLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtdGFibGUnICkubGVuZ3RoKSB7XG5cdFx0XHR0eXBlb2Ygd2NfYWRkX3RvX2NhcnRfcGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiAoIHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCA9IGNhcnRfcmVkaXJlY3RfYWZ0ZXJfYWRkICk7XG5cblx0XHRcdHZhciB0ciAgICAgXHRcdCAgID0gYnV0dG9uLmNsb3Nlc3QoICdbZGF0YS1yb3ctaWRdJyApLFxuXHRcdFx0XHR0YWJsZSAgXHRcdCAgID0gdHIuY2xvc2VzdCggJy53bGZtYy13aXNobGlzdC1mcmFnbWVudCcgKSxcblx0XHRcdFx0b3B0aW9uc1x0XHQgICA9IHRhYmxlLmRhdGEoICdmcmFnbWVudC1vcHRpb25zJyApLFxuXHRcdFx0XHRkYXRhX3Jvd19pZCAgICA9IHRyLmRhdGEoICdyb3ctaWQnICksXG5cdFx0XHRcdHdpc2hsaXN0X2lkICAgID0gdGFibGUuZmluZCggJy53bGZtYy13aXNobGlzdC10YWJsZScgKS5kYXRhKCAnaWQnICksXG5cdFx0XHRcdHdpc2hsaXN0X3Rva2VuID0gdGFibGUuZmluZCggJy53bGZtYy13aXNobGlzdC10YWJsZScgKS5kYXRhKCAndG9rZW4nICksXG5cdFx0XHRcdGxpc3RfdHlwZSAgICAgID0gdGFibGUuZmluZCggJy53bGZtYy13aXNobGlzdC10YWJsZScgKS5kYXRhKCAnd2lzaGxpc3QtdHlwZScgKSxcblx0XHRcdFx0cmVsb2FkX2ZyYWdtZW50ID0gZmFsc2U7XG5cblx0XHRcdGJ1dHRvbi5yZW1vdmVDbGFzcyggJ2FkZGVkJyApO1xuXHRcdFx0dHIuZmluZCggJy5hZGRlZF90b19jYXJ0JyApLnJlbW92ZSgpO1xuXHRcdFx0aWYgKHdsZm1jX2wxMG4ucmVtb3ZlX2Zyb21fd2lzaGxpc3RfYWZ0ZXJfYWRkX3RvX2NhcnQgJiYgb3B0aW9ucy5pc191c2VyX293bmVyKSB7XG5cblx0XHRcdFx0JCggJy53bGZtYy13aXNobGlzdC1mb3JtJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgZGF0YV9yb3dfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXG5cdFx0XHRcdGlmICggJ3dpc2hsaXN0JyA9PT0gbGlzdF90eXBlICkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl9saXN0ICE9PSAndW5kZWZpbmVkJyAmJiBwcm9kdWN0X2luX2xpc3QgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdHZhciBwcm9kdWN0X2NvdW50ID0gcHJvZHVjdF9pbl9saXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IHByb2R1Y3RfY291bnQgLSAxOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBwcm9kdWN0X2luX2xpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fbGlzdFtpXS53aXNobGlzdF9pZCA9PSB3aXNobGlzdF9pZCAmJiBwcm9kdWN0X2luX2xpc3RbaV0ucHJvZHVjdF9pZCA9PSBkYXRhX3Jvd19pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHByb2R1Y3RfaW5fbGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfcHJvZHVjdHNfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fbGlzdCApICk7XG5cblx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13cmFwcGVyJyApLmZpbmQoICdbZGF0YS1yb3ctaWQ9XCInICsgZGF0YV9yb3dfaWQgKyAnXCJdJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy1wcm9kdWN0cy1jb3VudGVyLXdyYXBwZXIgLnByb2R1Y3RzLWNvdW50ZXItbnVtYmVyJyApLnRleHQoIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtcHJvZHVjdHMtY291bnRlci13aXNobGlzdCAudG90YWwtcHJvZHVjdHMgLndsZm1jLXRvdGFsLWNvdW50JyApLnRleHQoIHByb2R1Y3RfaW5fbGlzdC5sZW5ndGggKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdpc2hsaXN0LndsZm1jLWFkZC10by13aXNobGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblx0XHRcdFx0XHRcdGlmICgoICEgcHJvZHVjdF9pbl9saXN0Lmxlbmd0aCB8fCBwcm9kdWN0X2luX2xpc3QubGVuZ3RoID09PSAwIHx8ICEgdGFibGUuZmluZCggJ1tkYXRhLXJvdy1pZF0nICkubGVuZ3RoKSkge1xuXHRcdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdpc2hsaXN0LXRhYmxlLXdyYXBwZXInICkuZW1wdHkoKTtcblx0XHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5yZWxvYWRfZnJhZ21lbnQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggJ3dhaXRsaXN0JyA9PT0gbGlzdF90eXBlICkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcHJvZHVjdF9pbl93YWl0bGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvZHVjdF9pbl93YWl0bGlzdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHByb2R1Y3RfY291bnQgPSBwcm9kdWN0X2luX3dhaXRsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPD0gcHJvZHVjdF9jb3VudCAtIDE7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0gIT09ICd1bmRlZmluZWQnICYmIHByb2R1Y3RfaW5fd2FpdGxpc3RbaV0ud2lzaGxpc3RfaWQgPT0gd2lzaGxpc3RfaWQgJiYgcHJvZHVjdF9pbl93YWl0bGlzdFtpXS5wcm9kdWN0X2lkID09IGRhdGFfcm93X2lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cHJvZHVjdF9pbl93YWl0bGlzdC5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JC5mbi5XTEZNQy5zZXRfd2FpdGxpc3RfaGFzaCggSlNPTi5zdHJpbmdpZnkoIHByb2R1Y3RfaW5fd2FpdGxpc3QgKSApO1xuXHRcdFx0XHRcdFx0JCggJy53bGZtYy13YWl0bGlzdC1jb3VudGVyLXdyYXBwZXInICkuZmluZCggJ1tkYXRhLXJvdy1pZD1cIicgKyBkYXRhX3Jvd19pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHQkKCAnLndsZm1jLXdhaXRsaXN0LWNvdW50ZXItd3JhcHBlciAucHJvZHVjdHMtY291bnRlci1udW1iZXInICkudGV4dCggcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGggKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2FpdGxpc3QtY291bnRlci13cmFwcGVyIC50b3RhbC1wcm9kdWN0cyAud2xmbWMtdG90YWwtY291bnQnICkudGV4dCggcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGggKTtcblx0XHRcdFx0XHRcdCQoICcud2xmbWMtYWRkLXRvLXdhaXRsaXN0LndsZm1jLWFkZC10by13YWl0bGlzdC0nICsgZGF0YV9yb3dfaWQgKS5yZW1vdmVDbGFzcyggJ2V4aXN0cycgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAoICEgcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGggfHwgcHJvZHVjdF9pbl93YWl0bGlzdC5sZW5ndGggPT09IDAgfHwgISB0YWJsZS5maW5kKCAnW2RhdGEtcm93LWlkXScgKS5sZW5ndGgpKSB7XG5cdFx0XHRcdFx0XHRcdCQoICcud2xmbWMtd2lzaGxpc3QtdGFibGUtd3JhcHBlcicgKS5lbXB0eSgpO1xuXHRcdFx0XHRcdFx0XHQkLmZuLldMRk1DLnJlbG9hZF9mcmFnbWVudCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAnbGlzdHMnID09PSBsaXN0X3R5cGUgKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5yZWxvYWRfZnJhZ21lbnQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCByZWxvYWRfZnJhZ21lbnQgKSB7XG5cdFx0XHRcdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBidXR0b24gIT09ICd1bmRlZmluZWQnICYmIGJ1dHRvbi5jbG9zZXN0KCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLXRhYmxlJyApLmxlbmd0aCkge1xuXHRcdFx0dmFyIHRyICAgICAgICAgICA9IGJ1dHRvbi5jbG9zZXN0KCAnW2RhdGEtaXRlbS1pZF0nICksXG5cdFx0XHRcdHRhYmxlICAgICAgICA9IHRyLmNsb3Nlc3QoICcud2xmbWMtd2lzaGxpc3QtZnJhZ21lbnQnICksXG5cdFx0XHRcdG9wdGlvbnMgICAgICA9IHRhYmxlLmRhdGEoICdmcmFnbWVudC1vcHRpb25zJyApLFxuXHRcdFx0XHRkYXRhX2l0ZW1faWQgPSB0ci5kYXRhKCAnaXRlbS1pZCcgKTtcblx0XHRcdGJ1dHRvbi5yZW1vdmVDbGFzcyggJ2FkZGVkJyApO1xuXHRcdFx0dHIuZmluZCggJy5hZGRlZF90b19jYXJ0JyApLnJlbW92ZSgpO1xuXHRcdFx0aWYgKCBvcHRpb25zLmlzX3VzZXJfb3duZXIpIHtcblx0XHRcdFx0JCggJy53bGZtYy1zYXZlLWZvci1sYXRlci1mb3JtJyApLmZpbmQoICdbZGF0YS1pdGVtLWlkPVwiJyArIGRhdGFfaXRlbV9pZCArICdcIl0nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggISAkKCAnLndsZm1jLXNhdmUtZm9yLWxhdGVyLWl0ZW1zLXdyYXBwZXIgLnNhdmUtZm9yLWxhdGVyLWl0ZW1zLXdyYXBwZXIgdHInICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCQoICcud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUtd3JhcHBlcicgKS5lbXB0eSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG4pO1xuXG50Lm9uKFxuXHQnYWRkX3RvX2NhcnRfbWVzc2FnZScsXG5cdCdib2R5Jyxcblx0ZnVuY3Rpb24gKCBlLCBtZXNzYWdlLCB0ICkge1xuXHRcdHZhciB3cmFwcGVyID0gJCggJy53b29jb21tZXJjZS1ub3RpY2VzLXdyYXBwZXIgLndvb2NvbW1lcmNlLWVycm9yLC53b29jb21tZXJjZS1ub3RpY2VzLXdyYXBwZXIgLndvb2NvbW1lcmNlLW1lc3NhZ2UnICk7XG5cblx0XHR0LnJlbW92ZUNsYXNzKCAnbG9hZGluZycgKTtcblx0XHRpZiAod3JhcHBlci5sZW5ndGggPT09IDApIHtcblx0XHRcdCQoICcjd2xmbWMtd2lzaGxpc3QtZm9ybScgKS5wcmVwZW5kKCBtZXNzYWdlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdyYXBwZXIuZmFkZU91dChcblx0XHRcdFx0MzAwLFxuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoJy53b29jb21tZXJjZS1ub3RpY2VzLXdyYXBwZXInKS5yZXBsYWNlV2l0aCggbWVzc2FnZSApLmZhZGVJbigpO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuKTtcblxudC5vbiggJ2NhcnRfcGFnZV9yZWZyZXNoZWQnLCAnYm9keScsICQuZm4uV0xGTUMuaW5pdF9oYW5kbGluZ19hZnRlcl9hamF4ICk7XG47XG5cdFx0XHRcdC8qID09PSBEUk9QRE9XTiBDT1VOVEVSID09PSAqL1xuXG5pZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCAod2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSkge1xuXHR2YXIgd2xmbWNfc3dpcGVfdHJpZ2dlcjtcblx0Yi5vbihcblx0XHQndG91Y2hzdGFydCcsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyLC53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWNsaWNrJyxcblx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0d2xmbWNfc3dpcGVfdHJpZ2dlciA9IGZhbHNlO1xuXHRcdH1cblx0KTtcblxuXHRiLm9uKFxuXHRcdCd0b3VjaG1vdmUnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3Zlciwud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljaycsXG5cdFx0ZnVuY3Rpb24gKGUpIHtcblx0XHRcdHdsZm1jX3N3aXBlX3RyaWdnZXIgPSB0cnVlO1xuXHRcdH1cblx0KTtcblxuXHRiLm9uKFxuXHRcdCd0b3VjaGVuZCcsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93biwud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayAgLndsZm1jLWNvdW50ZXIuaGFzLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZSkge1xuXHRcdFx0dmFyIGVsZW0gPSAkKHRoaXMpLmNsb3Nlc3QoJy53bGZtYy1jb3VudGVyLXdyYXBwZXInKTtcblx0XHRcdGlmIChlbGVtLmhhc0NsYXNzKCAnd2xmbWMtZmlyc3QtdG91Y2gnICkpIHtcblx0XHRcdFx0aWYgKCAhIHdsZm1jX3N3aXBlX3RyaWdnZXIpIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLmhpZGVfbWluaV93aXNobGlzdC5jYWxsKCAkKCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKSwgZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQuZm4uV0xGTUMuc2hvd19taW5pX3dpc2hsaXN0LmNhbGwoIHRoaXMsIGUgKTtcblx0XHRcdFx0ZWxlbS5hZGRDbGFzcyggJ3dsZm1jLWZpcnN0LXRvdWNoJyApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRiLm9uKFxuXHRcdCd0b3VjaGVuZCcsXG5cdFx0Jzpub3QoLndsZm1jLWNvdW50ZXItd3JhcHBlci5zaG93LWxpc3Qtb24taG92ZXIpOm5vdCgud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1jbGljayknLFxuXHRcdGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRpZiAoJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0JC5mbi5XTEZNQy5oaWRlX21pbmlfd2lzaGxpc3QuY2FsbCggJCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXInICksIGUgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cdC8vIGZpeCB1cmwgaW4gZHJvcGRvd24gaW4gaXBob25lIGRldmljZXNcblx0Yi5vbihcblx0XHQndG91Y2hlbmQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93biBhOm5vdCgucmVtb3ZlX2Zyb21fd2lzaGxpc3QpJyxcblx0XHRmdW5jdGlvbihldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG59IGVsc2Uge1xuXHRiLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWNsaWNrIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgZWxlbSA9ICQoICcuZHJvcGRvd25fJyArICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1pZCcgKSApIHx8ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLWNvdW50ZXItZHJvcGRvd24nICk7XG5cdFx0XHQkLmZuLldMRk1DLmFwcGVuZHRvQm9keSggZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKSApO1xuXHRcdFx0JC5mbi5XTEZNQy5wcmVwYXJlX21pbmlfd2lzaGxpc3QoIGVsZW0gKTtcblx0XHRcdGVsZW0udG9nZ2xlQ2xhc3MoICdsaXN0cy1zaG93JyApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcblxuXHR0Lm9uKFxuXHRcdFwiY2xpY2tcIixcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGNvbnN0ICR0cmlnZ2VyID0gJChcIi53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWNsaWNrIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93blwiKTtcblx0XHRcdGlmICgkdHJpZ2dlciAhPT0gZXYudGFyZ2V0ICYmICEgJHRyaWdnZXIuaGFzKCBldi50YXJnZXQgKS5sZW5ndGgpIHtcblx0XHRcdFx0JCggJy53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyApLnJlbW92ZUNsYXNzKCBcImxpc3RzLXNob3dcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRiLm9uKFxuXHRcdCdtb3VzZW92ZXInLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHQpO1xuXHRiLm9uKFxuXHRcdCdtb3VzZW91dCcsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyIC53bGZtYy1jb3VudGVyLWRyb3Bkb3duJyxcblx0XHRmdW5jdGlvbiAoZXYpIHtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cdGIub24oXG5cdFx0J21vdXNlb3ZlcicsXG5cdFx0Jy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93bicsXG5cdFx0ZnVuY3Rpb24gKGV2KSB7XG5cdFx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgZWxlbSA9ICQoICcuZHJvcGRvd25fJyArICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1pZCcgKSApIHx8ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKS5maW5kKCAnLndsZm1jLWNvdW50ZXItZHJvcGRvd24nICk7XG5cdFx0XHQkKCBlbGVtICkuYWRkQ2xhc3MoIFwibGlzdHMtc2hvd1wiICk7XG5cdFx0XHQkLmZuLldMRk1DLmFwcGVuZHRvQm9keSggZWxlbS5jbG9zZXN0KCAnLndsZm1jLWNvdW50ZXItd3JhcHBlcicgKSApO1xuXHRcdFx0JC5mbi5XTEZNQy5wcmVwYXJlX21pbmlfd2lzaGxpc3QoIGVsZW0gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0KTtcblx0Yi5vbihcblx0XHQnbW91c2VvdXQnLFxuXHRcdCcud2xmbWMtY291bnRlci13cmFwcGVyLnNob3ctbGlzdC1vbi1ob3ZlciAud2xmbWMtY291bnRlci5oYXMtZHJvcGRvd24nLFxuXHRcdGZ1bmN0aW9uIChldikge1xuXHRcdFx0ZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGVsZW0gPSAkKCAnLmRyb3Bkb3duXycgKyAkKCB0aGlzICkuYXR0ciggJ2RhdGEtaWQnICkgKTtcblx0XHRcdCQoIGVsZW0gKS5yZW1vdmVDbGFzcyggXCJsaXN0cy1zaG93XCIgKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdCk7XG5cblx0JCggJy53bGZtYy1jb3VudGVyLXdyYXBwZXIuc2hvdy1saXN0LW9uLWhvdmVyIC53bGZtYy1jb3VudGVyLmhhcy1kcm9wZG93bicgKS5ob3ZlckludGVudChcblx0XHR7XG5cdFx0XHRpbnRlcnZhbDogMCxcblx0XHRcdHRpbWVvdXQ6IDEwMCxcblx0XHRcdG92ZXI6ICQuZm4uV0xGTUMuc2hvd19taW5pX3dpc2hsaXN0LFxuXHRcdFx0b3V0OiAkLmZuLldMRk1DLmhpZGVfbWluaV93aXNobGlzdFxuXHRcdH1cblx0KTtcbn1cbjtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcHJlcGFyZV9xdHlfbGlua3MoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfd2lzaGxpc3RfcG9wdXAoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcXVhbnRpdHkoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfY2hlY2tib3hfaGFuZGxpbmcoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfY29weV93aXNobGlzdF9saW5rKCk7XG5cblx0XHRcdFx0JC5mbi5XTEZNQy5pbml0X3Rvb2x0aXAoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfY29tcG9uZW50cygpO1xuXG5cdFx0XHRcdCQuZm4uV0xGTUMuaW5pdF9wb3B1cHMoKTtcblxuXHRcdFx0XHQkLmZuLldMRk1DLmluaXRfcG9wdXBfY2hlY2tib3hfaGFuZGxpbmcoKTtcblx0XHRcdH1cblx0XHQpLnRyaWdnZXIoICd3bGZtY19pbml0JyApO1xuXG5cdFx0Ly8gZml4IHdpdGggamV0IHdvbyBidWlsZGVyIHBsdWdpbi5cblxuJCggZG9jdW1lbnQgKVxuXHQub24oICdqZXQtZmlsdGVyLWNvbnRlbnQtcmVuZGVyZWQnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApXG5cdC5vbiggJ2pldC13b28tYnVpbGRlci1jb250ZW50LXJlbmRlcmVkJywgJC5mbi5XTEZNQy5yZUluaXRfd2xmbWMgKVxuXHQub24oICdqZXQtZW5naW5lL2xpc3RpbmctZ3JpZC9hZnRlci1sb2FkLW1vcmUnLCAkLmZuLldMRk1DLnJlSW5pdF93bGZtYyApXG5cdC5vbiggJ2pldC1lbmdpbmUvbGlzdGluZy1ncmlkL2FmdGVyLWxhenktbG9hZCcsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jIClcblx0Lm9uKCAnamV0LWN3LWxvYWRlZCcsICQuZm4uV0xGTUMucmVJbml0X3dsZm1jICk7XG4vLyBsb2FkIGZyYWdtZW50IGZvciBmaXggZmlsdGVyIGV2ZXJ5dGhpbmcgYWpheCByZXNwb25zZS5cbiQoIGRvY3VtZW50ICkucmVhZHkoICQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMgKTtcbi8vIGxvYWQgZnJhZ21lbnQgZm9yIGZpeCBidWcgd2l0aCBhamF4IGZpbHRlciBEZXN0aW55IEVsZW1lbnRzIHBsdWdpblxuJCggZG9jdW1lbnQgKS5vbiggJ2RlQ29udGVudExvYWRlZCcgLCAkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzICk7XG4vLyBmaXggd2FpdGxpc3QgcG9wdXAgYWZ0ZXIgd3BjIGNvbXBvc2l0ZSBwcm9kdWN0IGdhbGxlcnkgbG9hZGVkIGluIHNpbmdsZSBwcm9kdWN0IHBhZ2VcbiQoIGRvY3VtZW50ICkub24oICd3b29jb19nYWxsZXJ5X2xvYWRlZCcsIGZ1bmN0aW9uKCBlLCBwcm9kdWN0X2lkICkge1xuXHRpZiAoIHByb2R1Y3RfaWQgKSB7XG5cdFx0JCgnKltpZF49XCJhZGRfdG9fd2FpdGxpc3RfcG9wdXBfJyArIHByb2R1Y3RfaWQgKyAnX1wiXS5wb3B1cF93cmFwcGVyJykucmVtb3ZlKCk7XG5cdH1cbn0pO1xuO1xuXG5cdFx0XG52YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcblx0ZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0bXV0YXRpb25zLmZvckVhY2goXG5cdFx0XHRmdW5jdGlvbihtdXRhdGlvbikge1xuXHRcdFx0XHRpZiAoICQoICcud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5X193cmFwcGVyIC53bGZtYy10b3Atb2YtaW1hZ2UnICkubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHQkLmZuLldMRk1DLmluaXRfZml4X29uX2ltYWdlX3NpbmdsZV9wb3NpdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGZpeCB0b3Agb2YgaW1hZ2UgZm9yIHBvd2VyLXBhY2sgc2luZ2xlIHByb2R1Y3QuXG5cdFx0XHRcdGlmICggJCggJy5wcC1zaW5nbGUtcHJvZHVjdCAuZW50cnktc3VtbWFyeSA+IC53bGZtYy10b3Atb2YtaW1hZ2UnICkubGVuZ3RoID4gMCAmJiAkKCAnLnBwLXNpbmdsZS1wcm9kdWN0IC5lbnRyeS1zdW1tYXJ5IC5zaW5nbGUtcHJvZHVjdC1pbWFnZScgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdCQoICcucHAtc2luZ2xlLXByb2R1Y3QnICkuZWFjaChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJHdsZm1jVG9wT2ZJbWFnZSAgICA9ICQoIHRoaXMgKS5maW5kKCAnLndsZm1jLXRvcC1vZi1pbWFnZScgKTtcblx0XHRcdFx0XHRcdFx0dmFyICRzaW5nbGVQcm9kdWN0SW1hZ2UgPSAkKCB0aGlzICkuZmluZCggJy5zaW5nbGUtcHJvZHVjdC1pbWFnZScgKTtcblx0XHRcdFx0XHRcdFx0aWYgKCAkd2xmbWNUb3BPZkltYWdlLmxlbmd0aCA+IDAgJiYgJHNpbmdsZVByb2R1Y3RJbWFnZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0JHdsZm1jVG9wT2ZJbWFnZS5hcHBlbmRUbyggJHNpbmdsZVByb2R1Y3RJbWFnZSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbik7XG5vYnNlcnZlci5vYnNlcnZlKCAkKCAnYm9keScgKVswXSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSApO1xuO1xuXG5cdFx0LyogPT09IERST1BET1dOIENPVU5URVIgPT09ICovXG5cbiQoIHdpbmRvdyApLm9uKFxuXHRcInNjcm9sbCByZXNpemVcIixcblx0ZnVuY3Rpb24oKSB7XG5cdFx0JCggXCIud2xmbWMtY291bnRlci1kcm9wZG93blwiICkuZWFjaChcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkLmZuLldMRk1DLnByZXBhcmVfbWluaV93aXNobGlzdCggJCggdGhpcyApICk7XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuKTtcbjtcblxuXHRcdC8qIFN0b3JhZ2UgSGFuZGxpbmcgKi9cblxudmFyICRzdXBwb3J0c19odG1sNV9zdG9yYWdlID0gdHJ1ZSxcblx0d2lzaGxpc3RfaGFzaF9rZXkgICAgICAgPSB3bGZtY19sMTBuLndpc2hsaXN0X2hhc2hfa2V5LFxuXHRwcm9kdWN0c19oYXNoX2tleSBcdFx0PSB3aXNobGlzdF9oYXNoX2tleSArICdfcHJvZHVjdHMnLFxuXHRsYW5nX2hhc2hfa2V5XHRcdFx0PSB3aXNobGlzdF9oYXNoX2tleSArICdfbGFuZyc7XG5cbnRyeSB7XG5cdCRzdXBwb3J0c19odG1sNV9zdG9yYWdlID0gKCAnc2Vzc2lvblN0b3JhZ2UnIGluIHdpbmRvdyAmJiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgIT09IG51bGwgKTtcblx0d2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oICd3bGZtYycsICd0ZXN0JyApO1xuXHR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSggJ3dsZm1jJyApO1xuXHR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oICd3bGZtYycsICd0ZXN0JyApO1xuXHR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oICd3bGZtYycgKTtcbn0gY2F0Y2ggKCBlcnIgKSB7XG5cdCRzdXBwb3J0c19odG1sNV9zdG9yYWdlID0gZmFsc2U7XG59XG5cbmlmICggd2xmbWNfbDEwbi5pc19jYWNoZV9lbmFibGVkICYmIHdsZm1jX2wxMG4uaXNfcGFnZV9jYWNoZV9lbmFibGVkICkge1xuXHQkLmZuLldMRk1DLnRhYmxlX2Jsb2NrKCk7XG59XG5cbi8qIFdpc2hsaXN0IEhhbmRsaW5nICovXG5pZiAoICRzdXBwb3J0c19odG1sNV9zdG9yYWdlICkge1xuXG5cdC8vIFJlZnJlc2ggd2hlbiBzdG9yYWdlIGNoYW5nZXMgaW4gYW5vdGhlciB0YWIuXG5cdCQoIHdpbmRvdyApLm9uKFxuXHRcdCdzdG9yYWdlIG9uc3RvcmFnZScsXG5cdFx0ZnVuY3Rpb24gKCBlICkge1xuXHRcdFx0aWYgKCAoIHByb2R1Y3RzX2hhc2hfa2V5ID09PSBlLm9yaWdpbmFsRXZlbnQua2V5ICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICE9PSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICkgKSB7XG5cdFx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0Ly8gUmVmcmVzaCB3aGVuIHBhZ2UgaXMgc2hvd24gYWZ0ZXIgYmFjayBidXR0b24gKHNhZmFyaSkuXG5cdCQoIHdpbmRvdyApLm9uKFxuXHRcdCdwYWdlc2hvdycgLFxuXHRcdGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0aWYgKCBlLm9yaWdpbmFsRXZlbnQucGVyc2lzdGVkICkge1xuXHRcdFx0XHQkLmZuLldMRk1DLmxvYWRfZnJhZ21lbnRzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdHRyeSB7XG5cblx0XHRpZiAoIHdsZm1jX2wxMG4uaXNfY2FjaGVfZW5hYmxlZCApIHtcblx0XHRcdHRocm93ICdOZWVkIFVwZGF0ZSB3aXNobGlzdCBkYXRhJztcblx0XHR9XG5cdFx0aWYgKCB3bGZtY19sMTBuLnVwZGF0ZV93aXNobGlzdHNfZGF0YSB8fCAoIG51bGwgIT09IGxhbmcgJiYgbGFuZyAhPT0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oIGxhbmdfaGFzaF9rZXkgKSApIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICE9PSBKU09OLnN0cmluZ2lmeSggd2lzaGxpc3RfaXRlbXMgKSApIHtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSwgJycgKTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCBsYW5nX2hhc2hfa2V5LCAnJyApO1xuXHRcdFx0JC5mbi5XTEZNQy5jaGVja19wcm9kdWN0cyggd2lzaGxpc3RfaXRlbXMgKTtcblx0XHRcdHRocm93ICdOZWVkIFVwZGF0ZSB3aXNobGlzdCBkYXRhJztcblx0XHR9XG5cblx0XHRpZiAoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBwcm9kdWN0c19oYXNoX2tleSApICkge1xuXHRcdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggcHJvZHVjdHNfaGFzaF9rZXkgKSApO1xuXHRcdFx0aWYgKCdvYmplY3QnID09PSBfdHlwZW9mKCBkYXRhICkgJiYgbnVsbCAhPT0gZGF0YSApIHtcblx0XHRcdFx0JC5mbi5XTEZNQy5jaGVja19wcm9kdWN0cyggZGF0YSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCQuZm4uV0xGTUMudW5ibG9jayggJCggJy53bGZtYy13aXNobGlzdC10YWJsZS13cmFwcGVyLCAud2xmbWMtc2F2ZS1mb3ItbGF0ZXItdGFibGUtd3JhcHBlcicgKSApO1xuXG5cdFx0JCggJyN3bGZtYy1saXN0cywjd2xmbWMtd2lzaGxpc3QtZm9ybScgKS5hZGRDbGFzcyggJ29uLWZpcnN0LWxvYWQnICk7XG5cblx0fSBjYXRjaCAoIGVyciApIHtcblx0XHRjb25zb2xlLmxvZyggZXJyICk7XG5cdFx0JC5mbi5XTEZNQy5sb2FkX2ZyYWdtZW50cygpO1xuXHR9XG5cbn0gZWxzZSB7XG5cdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcbn1cbjtcblxuXHRcdFxudmFyIGhhc1NlbGVjdGl2ZVJlZnJlc2ggPSAoXG5cdCd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd3AgJiZcblx0d3AuY3VzdG9taXplICYmXG5cdHdwLmN1c3RvbWl6ZS5zZWxlY3RpdmVSZWZyZXNoICYmXG5cdHdwLmN1c3RvbWl6ZS53aWRnZXRzUHJldmlldyAmJlxuXHR3cC5jdXN0b21pemUud2lkZ2V0c1ByZXZpZXcuV2lkZ2V0UGFydGlhbFxuKTtcbmlmICggaGFzU2VsZWN0aXZlUmVmcmVzaCApIHtcblx0d3AuY3VzdG9taXplLnNlbGVjdGl2ZVJlZnJlc2guYmluZChcblx0XHQncGFydGlhbC1jb250ZW50LXJlbmRlcmVkJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdCQuZm4uV0xGTUMubG9hZF9mcmFnbWVudHMoKTtcblx0XHR9XG5cdCk7XG59XG47XG5cblx0fSk7XG59KShqUXVlcnkpO1xuIl19
