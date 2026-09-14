var WLFMC = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/frontend/js/modern/entry-free.js
  var entry_free_exports = {};
  __export(entry_free_exports, {
    default: () => entry_free_default
  });

  // node_modules/mitt/dist/mitt.mjs
  function mitt_default(n) {
    return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    }, off: function(t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    }, emit: function(t, e) {
      var i = n.get(t);
      i && i.slice().map(function(n2) {
        n2(e);
      }), (i = n.get("*")) && i.slice().map(function(n2) {
        n2(t, e);
      });
    } };
  }

  // src/frontend/js/modern/shared/constants.js
  var STORAGE_KEYS = {
    WISHLIST: "wlfmc_modern_wishlist",
    WAITLIST: "wlfmc_modern_waitlist",
    MULTI_LIST: "wlfmc_modern_multi_list",
    CONFIG: "wlfmc_modern_config",
    QUEUE_STATE: "wlfmc_queue_state",
    SYNC_VERSION: "wlfmc_sync_version",
    SYNC_DATA: "wlfmc_sync_data",
    LAST_SYNC: "wlfmc_last_sync",
    PRODUCTS_HASH: "wlfmc_products_hash",
    WAITLIST_HASH: "wlfmc_waitlist_hash",
    LANG_HASH: "wlfmc_lang_hash"
  };
  var EVENTS = {
    WISHLIST_ADDED: "wishlist:added",
    WISHLIST_REMOVED: "wishlist:removed",
    WISHLIST_UPDATED: "wishlist:updated",
    WISHLIST_COUNT_CHANGED: "wishlist:countChanged",
    WISHLIST_ITEM_UPDATED: "wishlist:itemUpdated",
    WISHLIST_ITEM_ADDED_TO_CART: "wishlist:itemAddedToCart",
    WISHLIST_ITEM_ADD_TO_CART_FAILED: "wishlist:itemAddToCartFailed",
    WAITLIST_ADDED: "waitlist:added",
    WAITLIST_REMOVED: "waitlist:removed",
    WAITLIST_UPDATED: "waitlist:updated",
    WAITLIST_COUNT_CHANGED: "waitlist:countChanged",
    MULTI_LIST_ADDED: "multiList:added",
    MULTI_LIST_REMOVED: "multiList:removed",
    MULTI_LIST_UPDATED: "multiList:updated",
    MULTI_LIST_COUNT_CHANGED: "multiList:countChanged",
    MULTI_LIST_CREATED: "multiList:created",
    MULTI_LIST_DELETED: "multiList:deleted",
    MULTI_LIST_PRIVACY_CHANGED: "multiList:privacyChanged",
    SAVE_FOR_LATER_ADDED: "saveForLater:added",
    SAVE_FOR_LATER_REMOVED: "saveForLater:removed",
    SAVE_FOR_LATER_UPDATED: "saveForLater:updated",
    SAVE_FOR_LATER_COUNT_CHANGED: "saveForLater:countChanged",
    ACTION_STARTED: "action:started",
    ACTION_COMPLETED: "action:completed",
    ACTION_FAILED: "action:failed",
    ACTION_RETRY: "action:retry",
    ACTION_TIMEOUT: "action:timeout",
    SYNC_STARTED: "sync:started",
    SYNC_COMPLETED: "sync:completed",
    SYNC_FAILED: "sync:failed",
    STATE_CHANGED: "state:changed",
    OFFLINE_STATUS_CHANGED: "offline:statusChanged",
    SYSTEM_READY: "system:ready",
    UI_REINIT: "ui:reinit",
    CONTENT_UPDATED: "content:updated"
  };
  var AJAX_ACTIONS = {
    WISHLIST_ADD: "wlfmc_add_to_wishlist",
    WISHLIST_REMOVE: "wlfmc_remove_from_wishlist",
    WISHLIST_DELETE_ITEM: "wlfmc_delete_item",
    WISHLIST_ADD_TO_CART: "wlfmc_add_to_cart",
    WISHLIST_SORT: "wlfmc_sort_wishlist_items",
    WISHLIST_UPDATE_QUANTITY: "wlfmc_update_item_quantity",
    WISHLIST_CHANGE_LAYOUT: "wlfmc_change_layout",
    WAITLIST_ADD: "wlfmc_add_product_to_waitlist",
    WAITLIST_REMOVE: "wlfmc_remove_from_wishlist",
    MULTI_LIST_ADD: "wlfmc_add_product_to_list",
    MULTI_LIST_REMOVE: "wlfmc_remove_from_wishlist",
    MULTI_LIST_MOVE: "wlfmc_move_to_another_list",
    MULTI_LIST_COPY: "wlfmc_copy_to_list",
    MULTI_LIST_CREATE: "wlfmc_create_new_list",
    MULTI_LIST_DELETE: "wlfmc_delete_list",
    MULTI_LIST_UPDATE: "wlfmc_update_list",
    MULTI_LIST_PRIVACY: "wlfmc_change_privacy",
    MULTI_LIST_LOAD: "wlfmc_load_lists",
    SAVE_FOR_LATER_ADD: "wlfmc_add_to_save_for_later",
    SAVE_FOR_LATER_REMOVE: "wlfmc_remove_from_save_for_later",
    SAVE_FOR_LATER_ADD_TO_CART: "wlfmc_save_for_later_add_to_cart",
    SAVE_FOR_LATER_ADD_ALL: "wlfmc_add_all_to_save_for_later",
    LOAD_AUTOMATIONS: "wlfmc_load_automations",
    GDPR_ACTION: "wlfmc_change_gdpr_status"
  };

  // src/frontend/js/modern/core/event-bus.js
  var EventBus = class {
    constructor() {
      this._bus = mitt_default();
      this._listeners = /* @__PURE__ */ new Map();
      this._eventHistory = [];
      this._maxHistory = 100;
    }
    on(event, callback) {
      this._bus.on(event, callback);
      if (!this._listeners.has(event)) {
        this._listeners.set(event, /* @__PURE__ */ new Set());
      }
      this._listeners.get(event).add(callback);
      return this;
    }
    off(event, callback) {
      this._bus.off(event, callback);
      if (this._listeners.has(event)) {
        this._listeners.get(event).delete(callback);
      }
      return this;
    }
    emit(event, data = {}) {
      const payload = {
        ...data,
        _meta: {
          timestamp: Date.now(),
          event,
          source: "modern"
        }
      };
      console.log(`[EventBus] \u2192 ${event}`, payload);
      this._eventHistory.push({ event, payload, time: Date.now() });
      if (this._eventHistory.length > this._maxHistory) {
        this._eventHistory.shift();
      }
      this._bus.emit(event, payload);
      this._bus.emit(EVENTS.STATE_CHANGED, {
        event,
        data: payload
      });
      return this;
    }
    once(event, callback) {
      const wrapper = (data) => {
        this.off(event, wrapper);
        callback(data);
      };
      this.on(event, wrapper);
      return this;
    }
    waitFor(event, timeout = 3e4) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.off(event, handler);
          reject(new Error(`Timeout waiting for: ${event}`));
        }, timeout);
        const handler = (data) => {
          clearTimeout(timer);
          this.off(event, handler);
          resolve(data);
        };
        this.on(event, handler);
      });
    }
    getHistory() {
      return this._eventHistory;
    }
    clear() {
      this._listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => this._bus.off(event, cb));
      });
      this._listeners.clear();
      this._eventHistory = [];
      return this;
    }
    listenerCount(event) {
      return this._listeners.get(event)?.size || 0;
    }
  };
  var eventBus = new EventBus();

  // src/frontend/js/modern/shared/ui-helpers.js
  var _loadingTimers = /* @__PURE__ */ new WeakMap();
  function showError(message) {
    if (typeof window.wlfmc_toastr !== "undefined" && String(message).trim() !== "") {
      return window.wlfmc_toastr.error(message);
    }
    console.error("[WLFMC] Error:", message);
    return null;
  }
  function showSuccess(message) {
    if (typeof window.wlfmc_toastr !== "undefined" && String(message).trim() !== "") {
      return window.wlfmc_toastr.success(message);
    }
    console.log("[WLFMC] Success:", message);
    return null;
  }
  function showInfo(message) {
    if (typeof window.wlfmc_toastr !== "undefined" && String(message).trim() !== "") {
      return window.wlfmc_toastr.info(message);
    }
    console.log("[WLFMC] Info:", message);
    return null;
  }
  function block(element, loaderUrl = null) {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return;
    if (window.wlfmc_l10n?.enable_ajax_loading === "0") {
      el.style.opacity = "0.6";
      return;
    }
    const url = loaderUrl || window.wlfmc_l10n?.ajax_loader_url || "";
    el.style.opacity = "0.6";
    el.style.position = "relative";
    const overlay = document.createElement("div");
    overlay.className = "wlfmc-block-overlay";
    overlay.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background:transparent url(${url}) no-repeat center;background-size:40px 40px;z-index:9999;`;
    el.appendChild(overlay);
  }
  function unblock(element) {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return;
    el.style.opacity = "1";
    el.querySelectorAll(".wlfmc-block-overlay").forEach((ov) => ov.remove());
    document.querySelectorAll(".tooltip__expanded").forEach((t) => {
      t.className = "tooltip__hidden";
    });
  }
  async function loading(element) {
    if (!element) return Promise.resolve();
    const isEnabled = window.wlfmc_l10n?.enable_ajax_loading === "1" || window.wlfmc_l10n?.enable_ajax_loading === true;
    if (!isEnabled) {
      return Promise.resolve();
    }
    if (_loadingTimers.has(element)) {
      clearTimeout(_loadingTimers.get(element));
      _loadingTimers.delete(element);
    }
    const hasIcon = element.querySelector("i") !== null;
    element.classList.add("wlfmc-action", hasIcon ? "wlfmc-loading" : "wlfmc-loading-alt");
    return new Promise((resolve) => {
      const timerId = setTimeout(() => {
        unloading(element);
        _loadingTimers.delete(element);
        resolve();
      }, 500);
      _loadingTimers.set(element, timerId);
    });
  }
  function unloading(element) {
    if (!element) return;
    if (_loadingTimers.has(element)) {
      clearTimeout(_loadingTimers.get(element));
      _loadingTimers.delete(element);
    }
    element.classList.remove("wlfmc-loading", "wlfmc-loading-alt");
  }
  function ensurejQuery(el) {
    const $ = window.jQuery;
    if (!$ || !el) return el;
    return el instanceof $ ? el : $(el);
  }
  function ensureNative(el) {
    const $ = window.jQuery;
    if (!$ || !el) return el;
    return el instanceof $ ? el[0] : el;
  }

  // src/frontend/js/modern/shared/scope-helpers.js
  var ScopeHelper = {
    /**
     * Wishlist scope
     * @param {number|string} productId
     * @param {number|string|null} listId
     * @param {boolean} isMerge
     * @returns {string}
     */
    wishlist(productId, listId = null, isMerge = false) {
      if (isMerge && listId && listId !== "0" && listId !== 0) {
        return `wishlist::merge::${productId}::${listId}`;
      }
      return `wishlist::product::${productId}`;
    },
    /**
     * Multi-list scope
     * @param {number|string} productId
     * @param {number|string} listId
     * @returns {string}
     */
    multiList(productId, listId) {
      return `multilist::${productId}::${listId}`;
    },
    /**
     * Multi-list batch scope (when adding to multiple lists at once)
     * @param {number|string} productId
     * @returns {string}
     */
    multiListBatch(productId) {
      return `multilist::batch::${productId}`;
    },
    /**
     * Multi-list management scope — create/update/delete/privacy
     * @param {string} operation - create, update, delete, privacy
     * @param {number|string|null} listId
     * @returns {string}
     */
    multiListManage(operation, listId = null) {
      if (operation === "create") {
        return `multilist::manage::create::${listId}`;
      }
      return `multilist::manage::${operation}::${listId}`;
    },
    /**
     * Multi-list move scope
     * @param {number|string} productId
     * @param {number|string} sourceListId
     * @param {number|string} destListId
     * @returns {string}
     */
    multiListMove(productId, sourceListId, destListId) {
      return `multilist::move::${productId}::${sourceListId}::${destListId}`;
    },
    /**
     * Multi-list copy scope
     * @param {number|string} productId
     * @param {number|string} sourceListId
     * @param {number|string} destListId
     * @returns {string}
     */
    multiListCopy(productId, sourceListId, destListId) {
      return `multilist::copy::${productId}::${sourceListId}::${destListId}`;
    },
    /**
     * Waitlist scope
     * @param {number|string} productId
     * @returns {string}
     */
    waitlist(productId) {
      return `waitlist::product::${productId}`;
    },
    /**
     * Save-for-Later scope
     * Uses cart_item_key as primary identifier because same product can have multiple cart items.
     * @param {string|null} cartItemKey
     * @param {number|string|null} productId
     * @returns {string}
     */
    sfl(cartItemKey, productId = null) {
      if (cartItemKey) return `sfl::cart::${cartItemKey}`;
      if (productId) return `sfl::product::${productId}`;
      return `sfl::unknown::${Date.now()}`;
    },
    /**
     * SFL item scope — for remove/add-to-cart by item_id
     * @param {number|string} itemId
     * @returns {string}
     */
    sflItem(itemId) {
      return `sfl::item::${itemId}`;
    },
    /**
     * Save-for-Later batch scope
     * @returns {string}
     */
    sflBatch() {
      return `sfl::batch`;
    },
    /**
     * Generic scope for any other operation
     * @param {string} module
     * @param {string} operation
     * @param {number|string} id
     * @returns {string}
     */
    generic(module, operation, id) {
      return `${module}::${operation}::${id}`;
    }
  };

  // src/frontend/js/modern/lib/light-queue.js
  var LightQueue = class {
    constructor({ concurrency = 5, autoStart = true } = {}) {
      this._concurrency = Math.max(1, concurrency);
      this._autoStart = autoStart;
      this._pendingCount = 0;
      this._queue = [];
      this._isPaused = !autoStart;
      this._listeners = { add: [], idle: [], error: [] };
    }
    /**
     * Add a promise-returning function to the queue.
     * @param {Function} fn - Async function to execute
     * @returns {Promise<any>} Resolves/rejects when the task completes
     */
    add(fn) {
      return new Promise((resolve, reject) => {
        const task = { fn, resolve, reject };
        this._queue.push(task);
        this._emit("add");
        this._tryNext();
      });
    }
    /**
     * Process next tasks if concurrency allows and queue is not paused.
     * @private
     */
    _tryNext() {
      if (this._isPaused) return;
      while (this._pendingCount < this._concurrency && this._queue.length > 0) {
        const task = this._queue.shift();
        this._pendingCount++;
        Promise.resolve().then(() => task.fn()).then(
          (result) => {
            this._pendingCount--;
            task.resolve(result);
            this._checkIdle();
            this._tryNext();
          },
          (error) => {
            this._pendingCount--;
            this._emit("error", error);
            task.reject(error);
            this._checkIdle();
            this._tryNext();
          }
        );
      }
    }
    /**
     * Emit idle event when all work is done.
     * @private
     */
    _checkIdle() {
      if (this._pendingCount === 0 && this._queue.length === 0) {
        this._emit("idle");
      }
    }
    /**
     * Simple internal event emitter.
     * @private
     */
    _emit(event, data) {
      const handlers = this._listeners[event];
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        try {
          handlers[i](data);
        } catch (e) {
          console.error(`[LightQueue] Handler error for "${event}":`, e);
        }
      }
    }
    /**
     * Subscribe to queue events.
     * @param {'add'|'idle'|'error'} event
     * @param {Function} handler
     */
    on(event, handler) {
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(handler);
    }
    /** Pause processing (queued items stay in buffer). */
    pause() {
      this._isPaused = true;
    }
    /** Resume processing. */
    start() {
      this._isPaused = false;
      this._tryNext();
    }
    /** Number of items waiting in queue (not yet started). */
    get size() {
      return this._queue.length;
    }
    /** Number of items currently executing. */
    get pending() {
      return this._pendingCount;
    }
    /** Clear all listeners and pending state. */
    clear() {
      this._queue = [];
      this._pendingCount = 0;
      this._listeners = { add: [], idle: [], error: [] };
    }
  };

  // src/frontend/js/modern/core/queue.js
  var QUEUE_CONFIG = {
    maxRetries: 3,
    retryDelay: 1e3,
    backoff: "exponential",
    maxDelay: 3e4,
    concurrency: 5
  };
  var OFFLINE_STORAGE_KEY = "wlfmc_offline_queue";
  var QueueManager = class {
    constructor() {
      this.queue = null;
      this.initialized = false;
      this._offlineBuffer = [];
      this._activeControllers = /* @__PURE__ */ new Map();
      this._currentTaskId = /* @__PURE__ */ new Map();
      this._taskCounter = 0;
      this._pendingOfflinePromises = /* @__PURE__ */ new Map();
    }
    _buildActionMap() {
      const l10nActions = window.wlfmc_l10n?.actions || {};
      const pick = (constant, key) => l10nActions[key] || constant;
      return {
        // ─── Wishlist ───────────────────────────────────────────
        add_to_wishlist: pick(AJAX_ACTIONS.WISHLIST_ADD, "add_to_wishlist_action"),
        remove_from_wishlist: pick(AJAX_ACTIONS.WISHLIST_REMOVE, "remove_from_wishlist_action"),
        delete_item: pick(AJAX_ACTIONS.WISHLIST_DELETE_ITEM, "delete_item_action"),
        add_to_cart: pick(AJAX_ACTIONS.WISHLIST_ADD_TO_CART, "add_to_cart_action"),
        sort_items: pick(AJAX_ACTIONS.WISHLIST_SORT, "sort_wishlist_items"),
        update_item_quantity: pick(AJAX_ACTIONS.WISHLIST_UPDATE_QUANTITY, "update_item_quantity"),
        change_layout: pick(AJAX_ACTIONS.WISHLIST_CHANGE_LAYOUT, "change_layout"),
        gdpr_action: pick(AJAX_ACTIONS.GDPR_ACTION, "gdpr_action"),
        load_automations: pick(AJAX_ACTIONS.LOAD_AUTOMATIONS, "load_automations"),
        load_fragments: pick("wlfmc_load_fragments", "load_fragments"),
        // ─── Waitlist ───────────────────────────────────────────
        add_to_waitlist: pick(AJAX_ACTIONS.WAITLIST_ADD, "add_product_to_waitlist_action"),
        remove_from_waitlist: pick(AJAX_ACTIONS.WAITLIST_REMOVE, "remove_from_wishlist_action"),
        // ─── Multi-list ─────────────────────────────────────────
        add_to_list: pick(AJAX_ACTIONS.MULTI_LIST_ADD, "add_product_to_list_action"),
        remove_from_list: pick(AJAX_ACTIONS.MULTI_LIST_REMOVE, "remove_from_wishlist_action"),
        move_to_list: pick(AJAX_ACTIONS.MULTI_LIST_MOVE, "move_to_another_list"),
        copy_to_list: pick(AJAX_ACTIONS.MULTI_LIST_COPY, "copy_to_another_list"),
        create_list: pick(AJAX_ACTIONS.MULTI_LIST_CREATE, "create_new_list_action"),
        delete_list: pick(AJAX_ACTIONS.MULTI_LIST_DELETE, "delete_list_action"),
        update_list: pick(AJAX_ACTIONS.MULTI_LIST_UPDATE, "update_list_action"),
        change_privacy: pick(AJAX_ACTIONS.MULTI_LIST_PRIVACY, "change_privacy_action"),
        load_lists: pick(AJAX_ACTIONS.MULTI_LIST_LOAD, "load_lists_action"),
        // ─── Save for Later ─────────────────────────────────────
        add_to_save_for_later: pick(AJAX_ACTIONS.SAVE_FOR_LATER_ADD, "add_to_save_for_later_action"),
        remove_from_save_for_later: pick(AJAX_ACTIONS.SAVE_FOR_LATER_REMOVE, "remove_from_save_for_later_action"),
        save_for_later_add_to_cart: pick(AJAX_ACTIONS.SAVE_FOR_LATER_ADD_TO_CART, "save_for_later_add_to_cart_action"),
        add_all_to_save_for_later: pick(AJAX_ACTIONS.SAVE_FOR_LATER_ADD_ALL, "add_all_to_save_for_later")
      };
    }
    init() {
      if (this.initialized) return;
      this.queue = new LightQueue({
        concurrency: QUEUE_CONFIG.concurrency,
        autoStart: true
      });
      this._setupOnlineListeners();
      this._loadOfflineBuffer();
      this.initialized = true;
      console.log("[QueueManager] Initialized with real AbortController support");
    }
    /**
     * Resolve the correct AJAX URL for a given operation,
     * matching the legacy architecture exactly.
     *
     * @param {string} operation - The operation identifier
     * @returns {string} The correct AJAX URL
     */
    _getAjaxUrlForOperation(operation) {
      const l10n = window.wlfmc_l10n || {};
      const URL_MAP = {
        // General AJAX URL (wlfmc_l10n.ajax_url)
        add_to_wishlist: "ajax_url",
        remove_from_wishlist: "ajax_url",
        delete_item: "ajax_url",
        update_item_quantity: "ajax_url",
        change_layout: "ajax_url",
        gdpr_action: "ajax_url",
        load_automations: "ajax_url",
        remove_from_waitlist: "ajax_url",
        remove_from_list: "ajax_url",
        // Admin AJAX URL (wlfmc_l10n.admin_url)
        add_to_cart: "admin_url",
        sort_items: "admin_url",
        move_to_list: "admin_url",
        copy_to_list: "admin_url",
        // Waitlist AJAX URL (wlfmc_l10n.waitlist_ajax_url)
        add_to_waitlist: "waitlist_ajax_url",
        // Multi-list AJAX URL (wlfmc_l10n.multi_list_ajax_url)
        add_to_list: "multi_list_ajax_url",
        create_list: "multi_list_ajax_url",
        delete_list: "multi_list_ajax_url",
        update_list: "multi_list_ajax_url",
        change_privacy: "multi_list_ajax_url",
        load_lists: "multi_list_ajax_url",
        // Save for Later AJAX URL (wlfmc_l10n.save_for_later_ajax_url)
        add_to_save_for_later: "save_for_later_ajax_url",
        remove_from_save_for_later: "save_for_later_ajax_url",
        save_for_later_add_to_cart: "save_for_later_ajax_url",
        add_all_to_save_for_later: "save_for_later_ajax_url"
      };
      const urlKey = URL_MAP[operation];
      if (urlKey && l10n[urlKey]) {
        return l10n[urlKey];
      }
      return l10n.ajax_url || l10n.admin_url || "";
    }
    _buildHeaders() {
      const l10n = window.wlfmc_l10n || {};
      const headers = {};
      if (l10n.ajax_mode === "rest_api" && l10n.nonce) {
        headers["X-WP-Nonce"] = l10n.nonce;
      }
      return headers;
    }
    _setupOnlineListeners() {
      window.addEventListener("online", () => {
        eventBus.emit(EVENTS.OFFLINE_STATUS_CHANGED, { online: true });
        this._processOfflineBuffer();
      });
      window.addEventListener("offline", () => {
        eventBus.emit(EVENTS.OFFLINE_STATUS_CHANGED, { online: false });
      });
    }
    _resolveScope(operation, data) {
      if (data instanceof FormData) {
        const explicitScope = data.get("_scope");
        if (explicitScope) return String(explicitScope);
      } else if (typeof data === "object" && data !== null && data._scope) {
        return String(data._scope);
      }
      let productId = null;
      let listId = null;
      let lists = null;
      let cartItemKey = null;
      let itemId = null;
      const isMerge = window.wlfmc_l10n?.merge_lists === "true";
      if (data instanceof FormData) {
        productId = data.get("add_to_wishlist") || data.get("remove_from_wishlist") || data.get("add_to_waitlist") || data.get("product_id") || data.get("add_to_list");
        listId = data.get("wishlist_id");
        lists = data.get("wishlist_ids");
        if (lists) {
          try {
            lists = JSON.parse(lists);
          } catch {
            lists = [lists];
          }
          if (!Array.isArray(lists)) lists = [lists];
        }
        cartItemKey = data.get("cart_item_key") || data.get("add_to_save_for_later");
        itemId = data.get("item_id");
      } else if (typeof data === "object" && data !== null) {
        productId = data.product_id || data.add_to_wishlist || data.remove_from_wishlist || data.add_to_waitlist || data.add_to_list;
        lists = Array.isArray(data.wishlist_ids) ? data.wishlist_ids : data.wishlist_ids ? [data.wishlist_ids] : null;
        listId = data.wishlist_id;
        cartItemKey = data.cart_item_key || data.add_to_save_for_later;
        itemId = data.item_id;
      }
      switch (operation) {
        case "add_to_wishlist":
        case "remove_from_wishlist":
        case "delete_item":
          return ScopeHelper.wishlist(productId, listId, isMerge);
        case "add_to_waitlist":
        case "remove_from_waitlist":
          return ScopeHelper.waitlist(productId);
        case "add_to_list":
        case "remove_from_list":
          if (lists && lists.length > 1) return ScopeHelper.multiListBatch(productId);
          if (lists && lists.length === 1) return ScopeHelper.multiList(productId, lists[0]);
          return ScopeHelper.multiList(productId, listId);
        case "move_to_list":
          return ScopeHelper.multiListMove(productId || itemId, data?.source_list_id || data?.current_list, data?.dest_list_id || data?.destination_wishlist_id);
        case "copy_to_list":
          return ScopeHelper.multiListCopy(productId || itemId, data?.source_list_id || data?.current_list, data?.dest_list_id || data?.wishlist);
        case "create_list":
          return ScopeHelper.multiListManage("create");
        case "update_list":
        case "delete_list":
        case "change_privacy":
          return ScopeHelper.multiListManage(operation, listId);
        case "add_to_save_for_later":
          return ScopeHelper.sfl(cartItemKey, productId);
        case "remove_from_save_for_later":
        case "save_for_later_add_to_cart":
          return ScopeHelper.sflItem(itemId || cartItemKey || "unknown");
        case "add_all_to_save_for_later":
          return ScopeHelper.sflBatch();
        case "update_item_quantity":
          if (data?._table_scope === "save_for_later" || data?.table_scope === "save_for_later") {
            return ScopeHelper.sfl(cartItemKey, productId);
          }
          return ScopeHelper.wishlist(productId, listId, isMerge);
        default:
          return ScopeHelper.generic("core", operation, productId || listId || cartItemKey || itemId || "global");
      }
    }
    /**
     * Add operation with deduplication.
     * If a previous operation for the same scope exists (in-flight or queued), it is cancelled.
     */
    addWithDeduplication(operation, data, options = {}) {
      if (!this.initialized) this.init();
      const scope = this._resolveScope(operation, data);
      if (this._activeControllers.has(scope)) {
        const prevController = this._activeControllers.get(scope);
        prevController.abort();
        this._activeControllers.delete(scope);
        console.log(`[QueueManager] Aborted previous in-flight request for scope: ${scope}`);
      }
      const taskId = ++this._taskCounter;
      this._currentTaskId.set(scope, taskId);
      if (!navigator.onLine) {
        return this._addToOfflineBuffer(operation, data, options, scope);
      }
      const controller = new AbortController();
      this._activeControllers.set(scope, controller);
      const promise = this.queue.add(() => {
        if (this._currentTaskId.get(scope) !== taskId) {
          console.log(`[QueueManager] Task superseded for scope: ${scope}`);
          const err = new Error("Operation cancelled");
          err.name = "AbortError";
          throw err;
        }
        return this._executeWithRetry(operation, data, options, controller, scope);
      });
      const finalPromise = promise.finally(() => {
        if (this._activeControllers.get(scope) === controller) {
          this._activeControllers.delete(scope);
        }
        if (this._currentTaskId.get(scope) === taskId) {
          this._currentTaskId.delete(scope);
        }
      });
      finalPromise.catch(() => {
      });
      return promise;
    }
    /**
     * Explicitly cancel any in-flight or queued operation for a scope.
     * Used by ConflictManager when a delete arrives while add is in-flight/queued.
     */
    cancelByScope(scope) {
      if (this._activeControllers.has(scope)) {
        this._activeControllers.get(scope).abort();
        this._activeControllers.delete(scope);
        console.log(`[QueueManager] Explicitly cancelled in-flight for scope: ${scope}`);
      }
      this._currentTaskId.set(scope, ++this._taskCounter);
    }
    /**
     * Alias for backward compatibility
     */
    abortByScope(scope) {
      this.cancelByScope(scope);
    }
    async _executeWithRetry(operation, data, options, controller, scope, attempt = 1) {
      try {
        let result;
        if (data instanceof FormData) {
          result = await this._executeOperationWithFormData(operation, data, controller);
        } else {
          result = await this._executeOperation(operation, data, controller);
        }
        return this.normalizeResponse(result);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(`[QueueManager] Operation ${operation} aborted for scope ${scope}`);
          throw error;
        }
        if (error.status === 401 || error.status === 403) {
          showError(window.wlfmc_l10n?.labels?.session_expired);
          const myAccountUrl = window.wlfmc_l10n?.login_url;
          if (window.location) window.location.href = myAccountUrl;
          throw error;
        }
        if (this._isNetworkError(error) && attempt <= QUEUE_CONFIG.maxRetries) {
          const delay = this._calculateBackoff(attempt);
          eventBus.emit(EVENTS.ACTION_RETRY, { operation, attempt, delay, scope });
          await new Promise((r) => setTimeout(r, delay));
          return this._executeWithRetry(operation, data, options, controller, scope, attempt + 1);
        }
        throw error;
      }
    }
    _isNetworkError(error) {
      const message = (error.message || "").toLowerCase();
      return error.status === 0 || error.code === "ECONNABORTED" || message.includes("networkerror") || message.includes("failed to fetch") || message.includes("network request failed") || message.includes("load failed");
    }
    _calculateBackoff(attempt) {
      if (QUEUE_CONFIG.backoff === "exponential") {
        return Math.min(QUEUE_CONFIG.retryDelay * Math.pow(2, attempt - 1), QUEUE_CONFIG.maxDelay);
      }
      return Math.min(QUEUE_CONFIG.retryDelay * attempt, QUEUE_CONFIG.maxDelay);
    }
    async _executeOperationWithFormData(operation, formData, controller) {
      const action = this._buildActionMap()[operation];
      if (!action) throw new Error(`Unknown operation: ${operation}`);
      if (!formData.has("action")) formData.append("action", action);
      if (!formData.has("context")) formData.append("context", "frontend");
      const nonce = window.wlfmc_l10n?.nonce || "";
      if (nonce && !formData.has("nonce")) formData.append("nonce", nonce);
      const headers = this._buildHeaders();
      const url = this._getAjaxUrlForOperation(operation);
      const fetchOptions = {
        method: "POST",
        body: formData,
        signal: controller.signal,
        credentials: "same-origin",
        keepalive: true
      };
      if (Object.keys(headers).length > 0) fetchOptions.headers = headers;
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        const error = new Error(`HTTP error ${response.status}`);
        error.status = response.status;
        throw error;
      }
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        console.error("[QueueManager] Non-JSON response:", text.substring(0, 500));
        throw new Error("Server returned non-JSON response");
      }
      return await response.json();
    }
    async _executeOperation(operation, data, controller) {
      const action = this._buildActionMap()[operation];
      if (!action) throw new Error(`Unknown operation: ${operation}`);
      const formData = new FormData();
      formData.append("action", data.action || action);
      formData.append("context", data.context || "frontend");
      const nonce = data.nonce;
      if (nonce) formData.append("nonce", nonce);
      Object.entries(data).forEach(([key, value]) => {
        if (key === "action" || key === "context" || key === "nonce" || key === "_scope") return;
        if (value === null || value === void 0) return;
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key + "[]", String(item)));
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      return this._executeOperationWithFormData(operation, formData, controller);
    }
    // === Offline Buffer ===
    _loadOfflineBuffer() {
      try {
        const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
        if (stored) {
          this._offlineBuffer = JSON.parse(stored);
          if (!Array.isArray(this._offlineBuffer)) this._offlineBuffer = [];
        } else {
          this._offlineBuffer = [];
        }
        this._pendingOfflinePromises.clear();
      } catch {
        this._offlineBuffer = [];
        this._pendingOfflinePromises.clear();
      }
    }
    _saveOfflineBuffer() {
      try {
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(this._offlineBuffer));
      } catch (e) {
        console.warn("[QueueManager] Failed to save offline buffer", e);
      }
    }
    _addToOfflineBuffer(operation, data, options, scope) {
      return new Promise((resolve, reject) => {
        const serializableData = data instanceof FormData ? this._serializeFormData(data) : data;
        const timestamp = Date.now();
        const item = {
          operation,
          data: serializableData,
          options,
          scope,
          timestamp
        };
        this._pendingOfflinePromises.set(timestamp, { resolve, reject });
        this._offlineBuffer.push(item);
        this._saveOfflineBuffer();
        eventBus.emit(EVENTS.OFFLINE_STATUS_CHANGED, { online: false });
        console.log("[QueueManager] Added to offline buffer:", operation);
      });
    }
    _serializeFormData(formData) {
      const obj = {};
      for (const [key, value] of formData.entries()) obj[key] = value;
      return { __formData: true, data: obj };
    }
    _deserializeToFormData(serialized) {
      if (serialized.__formData) {
        const formData = new FormData();
        Object.entries(serialized.data).forEach(([key, value]) => formData.append(key, value));
        return formData;
      }
      return serialized;
    }
    async _processOfflineBuffer() {
      if (this._offlineBuffer.length === 0 || !navigator.onLine) return;
      const items = [...this._offlineBuffer];
      this._offlineBuffer = [];
      this._saveOfflineBuffer();
      for (const item of items) {
        try {
          const data = this._deserializeToFormData(item.data);
          const result = await this.addWithDeduplication(item.operation, data, item.options);
          const handlers = this._pendingOfflinePromises.get(item.timestamp);
          if (handlers) {
            handlers.resolve(result);
            this._pendingOfflinePromises.delete(item.timestamp);
          }
        } catch (error) {
          if (!navigator.onLine) {
            this._offlineBuffer.push(item);
            this._saveOfflineBuffer();
          } else {
            const handlers = this._pendingOfflinePromises.get(item.timestamp);
            if (handlers) {
              handlers.reject(error);
              this._pendingOfflinePromises.delete(item.timestamp);
            }
          }
        }
      }
      if (this._offlineBuffer.length > 0) {
        setTimeout(() => this._processOfflineBuffer(), 5e3);
      }
    }
    /**
     * Normalize server response.
     * Error messages come from the server response (already translated).
     * Fallback uses wlfmc_l10n.labels.operation_failed (also translated).
     */
    normalizeResponse(result) {
      if (result && typeof result === "object") {
        if ("success" in result) {
          if (result.success === true) {
            return result.data !== void 0 ? result.data : result;
          } else {
            const errorMsg = result.data?.message || result.message || window.wlfmc_l10n?.labels?.operation_failed;
            const error = new Error(errorMsg);
            error.status = result.data?.status || 500;
            throw error;
          }
        }
        if ("result" in result) {
          if (result.result === "true" || result.result === true || result.result === "exists") {
            return result;
          } else if (result.result === "false" || result.result === false) {
            const errorMsg = result.message || window.wlfmc_l10n?.labels?.operation_failed;
            const error = new Error(errorMsg);
            error.status = 500;
            throw error;
          }
        }
        return result;
      }
      return result;
    }
    getStatus() {
      return {
        isProcessing: this.queue?.size > 0 || this.queue?.pending > 0,
        offlineItems: this._offlineBuffer.length,
        queueSize: this.queue?.size || 0,
        pending: this.queue?.pending || 0,
        activeControllers: this._activeControllers.size
      };
    }
    clearOfflineBuffer() {
      this._offlineBuffer = [];
      this._saveOfflineBuffer();
      this._pendingOfflinePromises.clear();
    }
  };
  var queueManager = new QueueManager();

  // src/frontend/js/modern/shared/validators.js
  var validators = {
    isValidEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    // ---- Added helpers ----
    isCookieEnabled() {
      if (navigator.cookieEnabled) return true;
      document.cookie = "cookietest=1";
      const ret = document.cookie.indexOf("cookietest=") !== -1;
      document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return ret;
    },
    setCookie(name, value, days = 365 * 25) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + days);
      document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date.toUTCString() + "; path=/";
    },
    getCookie(name) {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      if (match) return decodeURIComponent(match[2]);
      return null;
    },
    isTrue(value) {
      return value === true || value === "yes" || value === "1" || value === 1 || value === "true";
    },
    isOS() {
      return navigator.userAgent.match(/ipad|iphone/i);
    },
    updateURLParameter(url, param, paramVal) {
      const tempArray = url.split("?");
      const baseURL = tempArray[0];
      let additionalURL = tempArray[1] || "";
      let newAdditionalURL = "";
      let temp = "";
      if (additionalURL) {
        const items = additionalURL.split("&");
        for (let i = 0; i < items.length; i++) {
          if (items[i].split("=")[0] !== param) {
            newAdditionalURL += temp + items[i];
            temp = "&";
          }
        }
      }
      const rows_txt = temp + "" + param + "=" + paramVal.replace("#", "");
      return baseURL + "?" + newAdditionalURL + rows_txt;
    },
    getUrlParameter(url, sParam) {
      const sPageURL = decodeURIComponent(url.substring(1));
      const sURLVariables = sPageURL.split(/[&|?]+/);
      for (let i = 0; i < sURLVariables.length; i++) {
        const sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] === sParam) {
          return sParameterName[1] === void 0 ? true : sParameterName[1];
        }
      }
      return null;
    }
  };
  var validators_default = validators;

  // src/frontend/js/modern/core/conflict-manager.js
  var OP_STATE = {
    QUEUED: "queued",
    // Chained, not yet started
    IN_FLIGHT: "in_flight",
    // HTTP request sent
    CONFIRMED: "confirmed",
    // Server confirmed success
    ROLLED_BACK: "rolled_back",
    // Rolled back due to error
    CANCELLED: "cancelled"
    // Coalesced away / superseded before sending
  };
  var OPTIMISTIC_UI_DELAY = validators.isTrue(window.wlfmc_l10n?.enable_ajax_loading) ? 500 : 0;
  var ScopeTracker = class {
    constructor(scope) {
      this.scope = scope;
      this.operations = [];
      this.chain = Promise.resolve();
    }
    addOperation(op) {
      this.operations.push(op);
      if (this.operations.length > 40) {
        this.operations = this.operations.filter(
          (o) => o.state === OP_STATE.QUEUED || o.state === OP_STATE.IN_FLIGHT || this.operations.indexOf(o) >= this.operations.length - 20
        );
      }
    }
    getPendingOperations() {
      return this.operations.filter(
        (op) => op.state === OP_STATE.QUEUED || op.state === OP_STATE.IN_FLIGHT
      );
    }
  };
  var ConflictManager = class {
    constructor() {
      this._scopes = /* @__PURE__ */ new Map();
      this._initialized = false;
      this._persistenceKey = "wlfmc_pending_operations";
      this._identities = /* @__PURE__ */ new Map();
    }
    init() {
      if (this._initialized) return;
      eventBus.on(EVENTS.ACTION_STARTED, (data) => {
        if (data.scope) this._onOperationStarted(data);
      });
      this._initialized = true;
      console.log("[ConflictManager] Initialized (serialized mode)");
    }
    getTracker(scope) {
      if (!this._scopes.has(scope)) {
        this._scopes.set(scope, new ScopeTracker(scope));
      }
      return this._scopes.get(scope);
    }
    /* ═══ Identity Store ═══ */
    /**
     * Store server-confirmed identity for a scope.
     * Called by module actions via onDataOnly when an ADD response
     * arrives but a REMOVE is already pending.
     */
    storeIdentity(scope, identity) {
      if (!identity) return;
      this._identities.set(scope, { ...identity, _ts: Date.now() });
    }
    /**
     * Retrieve stored identity for a scope.
     * Returns null if no identity has been stored.
     */
    getIdentity(scope) {
      return this._identities.get(scope) || null;
    }
    /**
     * Remove stored identity after it has been consumed.
     */
    clearIdentity(scope) {
      this._identities.delete(scope);
    }
    /* ═══ Visual Feedback ═══ */
    /**
     * Start visual feedback (loading indicator + optimistic mutation timer)
     * immediately when the operation is enqueued, independent of its position
     * in the serialization queue.
     *
     * For optimistic operations the loading helper runs for its minimum
     * perceivable duration and the state mutation is applied after
     * OPTIMISTIC_UI_DELAY. For non-optimistic operations the loading class
     * persists until the server response releases it.
     */
    _startVisualFeedback(operation, config) {
      const { optimisticFn, element, actionId } = config;
      if (optimisticFn) {
        const applyOptimistic = () => {
          try {
            optimisticFn();
          } catch (e) {
            console.error(`[ConflictManager] Optimistic apply failed for ${actionId}:`, e);
          }
        };
        if (element) {
          loading(element).catch(() => {
          });
        }
        operation._pendingOptimisticApply = applyOptimistic;
        operation._optimisticTimer = setTimeout(() => {
          if (operation._pendingOptimisticApply) {
            operation._pendingOptimisticApply();
            operation._pendingOptimisticApply = null;
          }
          operation._optimisticTimer = null;
        }, OPTIMISTIC_UI_DELAY);
      } else if (element) {
        const hasIcon = element.querySelector("i") !== null;
        element.classList.add("wlfmc-action", hasIcon ? "wlfmc-loading" : "wlfmc-loading-alt");
        operation._releaseLoading = () => {
          element.classList.remove("wlfmc-loading", "wlfmc-loading-alt");
        };
      }
    }
    /**
     * Cancel a still-pending optimistic mutation WITHOUT applying it.
     * Used when an operation is superseded before its optimistic delay elapses.
     */
    _cancelPendingOptimistic(operation) {
      if (operation._optimisticTimer) {
        clearTimeout(operation._optimisticTimer);
        operation._optimisticTimer = null;
      }
      operation._pendingOptimisticApply = null;
    }
    /**
     * Fully tear down visual feedback for an operation that will never run
     * (coalesced while still QUEUED): cancel the pending optimistic mutation
     * and release any persistent loading indicator.
     */
    _cancelVisualFeedback(operation) {
      this._cancelPendingOptimistic(operation);
      if (operation._releaseLoading) {
        try {
          operation._releaseLoading();
        } catch (e) {
        }
        operation._releaseLoading = null;
      }
    }
    /* ═══ Main Entry Point ═══ */
    /**
     * Main entry point: Execute an operation with full conflict management.
     */
    execute(config) {
      const { scope, type, productId, actionId } = config;
      const tracker = this.getTracker(scope);
      const pendingSame = tracker.operations.find(
        (op) => op.type === type && (op.state === OP_STATE.QUEUED || op.state === OP_STATE.IN_FLIGHT) && String(op.productId) === String(productId)
      );
      if (pendingSame && pendingSame._resultPromise) {
        return pendingSame._resultPromise;
      }
      const isRemoval = "remove" === type || "delete" === type;
      const oppositeTypes = isRemoval ? ["add"] : ["remove", "delete"];
      const pendingOpposites = tracker.operations.filter(
        (op) => oppositeTypes.includes(op.type) && (op.state === OP_STATE.QUEUED || op.state === OP_STATE.IN_FLIGHT) && String(op.productId) === String(productId)
      );
      let coalesced = false;
      for (const pendingOpposite of pendingOpposites) {
        console.log(`[ConflictManager] Chain annihilation: ${pendingOpposite.state} ${pendingOpposite.type} cancelled by ${type}`);
        if (pendingOpposite.state === OP_STATE.IN_FLIGHT) {
          this._cancelPendingOptimistic(pendingOpposite);
        } else {
          this._cancelVisualFeedback(pendingOpposite);
        }
        pendingOpposite.state = OP_STATE.CANCELLED;
      }
      coalesced = false;
      const operation = {
        actionId,
        type,
        module: config.module,
        productId,
        listId: config.listId,
        state: OP_STATE.QUEUED,
        timestamp: Date.now()
      };
      let resolveResult;
      const resultPromise = new Promise((resolve) => {
        resolveResult = resolve;
      });
      operation._resolveResult = resolveResult;
      operation._resultPromise = resultPromise;
      tracker.addOperation(operation);
      this._startVisualFeedback(operation, config);
      eventBus.emit(EVENTS.ACTION_STARTED, { actionId, scope, type });
      const run = () => {
        this._runOperation(config, tracker, operation, coalesced);
        return resultPromise;
      };
      tracker.chain = tracker.chain.then(run, run);
      return resultPromise;
    }
    /* ═══ Operation Runner ═══ */
    async _runOperation(config, tracker, operation, coalesced) {
      const {
        scope,
        actionId,
        type,
        productId,
        listId,
        module,
        serverFn,
        onSuccess,
        onError,
        optimisticFn,
        rollbackFn,
        element,
        onDataOnly
      } = config;
      if (coalesced) {
        operation.state = OP_STATE.CONFIRMED;
        operation.confirmedAt = Date.now();
        eventBus.emit(EVENTS.ACTION_COMPLETED, { actionId, scope, type, status: "coalesced" });
        const inferredResult = { success: true, inferred: true, coalesced: true };
        if (onSuccess) onSuccess(inferredResult);
        operation._resolveResult?.(inferredResult);
        return;
      }
      operation.state = OP_STATE.IN_FLIGHT;
      const flushOptimistic = () => {
        if (operation._optimisticTimer) {
          clearTimeout(operation._optimisticTimer);
          operation._optimisticTimer = null;
        }
        if (operation._pendingOptimisticApply) {
          operation._pendingOptimisticApply();
          operation._pendingOptimisticApply = null;
        }
      };
      const cancelOptimistic = () => {
        this._cancelPendingOptimistic(operation);
      };
      const releaseLoading = () => {
        if (operation._releaseLoading) {
          try {
            operation._releaseLoading();
          } catch (e) {
          }
          operation._releaseLoading = null;
        }
      };
      try {
        const TIMEOUT = 3e4;
        const serverPromise = Promise.race([
          serverFn(),
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Operation timed out")), TIMEOUT)
          )
        ]);
        serverPromise.then((result) => {
          operation.state = OP_STATE.CONFIRMED;
          operation.confirmedAt = Date.now();
          releaseLoading();
          const superseded = this._hasPendingOpposite(tracker, operation);
          if (superseded) {
            cancelOptimistic();
            if (onDataOnly) {
              try {
                onDataOnly(result);
              } catch (e) {
                console.error(`[ConflictManager] onDataOnly failed for ${actionId}:`, e);
              }
            }
          } else {
            flushOptimistic();
            if (onSuccess) onSuccess(result);
          }
          operation._resolveResult?.(result);
          eventBus.emit(EVENTS.ACTION_COMPLETED, {
            actionId,
            scope,
            type,
            result,
            status: superseded ? "data_only" : "success"
          });
        }).catch((error) => {
          if (error?.name === "AbortError" || error?.message === "Operation cancelled") {
            if (operation._optimisticTimer || operation._pendingOptimisticApply) {
              cancelOptimistic();
            } else if (rollbackFn) {
              try {
                rollbackFn();
              } catch (e) {
                console.error("[ConflictManager] Rollback on abort failed:", e);
              }
            }
            releaseLoading();
            console.log(`[ConflictManager] Operation ${actionId} superseded/aborted.`);
            operation.state = OP_STATE.CANCELLED;
            operation._resolveResult?.({ success: false, superseded: true });
            eventBus.emit(EVENTS.ACTION_COMPLETED, {
              actionId,
              scope,
              type,
              status: "cancelled"
            });
            return;
          }
          flushOptimistic();
          releaseLoading();
          if (this._isNotFoundError(error)) {
            console.log(`[ConflictManager] "${error.message}" treated as already-settled`);
            operation.state = OP_STATE.CONFIRMED;
            operation.confirmedAt = Date.now();
            const inferredResult = { success: true, inferred: true };
            if (onSuccess) onSuccess(inferredResult);
            operation._resolveResult?.(inferredResult);
            return;
          }
          operation.state = OP_STATE.ROLLED_BACK;
          try {
            if (rollbackFn) rollbackFn();
          } catch (e) {
            console.error("[ConflictManager] Rollback failed:", e);
          }
          if (onError) onError(error);
          operation._resolveResult?.(null);
          eventBus.emit(EVENTS.ACTION_FAILED, {
            actionId,
            scope,
            type,
            error: error.message
          });
        });
        return;
      } catch (error) {
        cancelOptimistic();
        operation.state = OP_STATE.ROLLED_BACK;
        try {
          if (rollbackFn) rollbackFn();
        } catch (e) {
        }
        releaseLoading();
        if (onError) onError(error);
        operation._resolveResult?.(null);
        eventBus.emit(EVENTS.ACTION_FAILED, { actionId, scope, type, error: error.message });
      }
    }
    /* ═══ Helpers ═══ */
    /**
     * Check whether a pending (QUEUED or IN_FLIGHT) operation of the
     * opposite type exists for the same product within this tracker.
     * Used at response time to decide between full UI update and
     * data-only extraction.
     */
    _hasPendingOpposite(tracker, operation) {
      const removalTypes = ["remove", "delete"];
      const addTypes = ["add", "create"];
      const currentIsRemoval = removalTypes.includes(operation.type);
      const currentIsAdd = addTypes.includes(operation.type);
      return tracker.operations.some((op) => {
        if (op === operation) return false;
        if (op.state !== OP_STATE.QUEUED && op.state !== OP_STATE.IN_FLIGHT) return false;
        if (String(op.productId) !== String(operation.productId)) return false;
        const opIsRemoval = removalTypes.includes(op.type);
        const opIsAdd = addTypes.includes(op.type);
        return currentIsRemoval && opIsAdd || currentIsAdd && opIsRemoval;
      });
    }
    _isNotFoundError(error) {
      const msg = (error.message || "").toLowerCase();
      return msg.includes("not found") || msg.includes("does not exist") || msg.includes("no item") || msg.includes("item not") || msg.includes("product not") || error.status === 404;
    }
    _onOperationStarted() {
    }
    getPendingOperations() {
      const pending = [];
      for (const [scope, tracker] of this._scopes) {
        const ops = tracker.getPendingOperations();
        if (ops.length > 0) {
          pending.push({
            scope,
            operations: ops.map((op) => ({
              actionId: op.actionId,
              type: op.type,
              module: op.module,
              productId: op.productId,
              listId: op.listId,
              state: op.state,
              timestamp: op.timestamp
            }))
          });
        }
      }
      return pending;
    }
    /**
     * Get ALL operations (including CONFIRMED) within the tracker's memory window.
     * Used by StateCache to protect recently confirmed items from stale server syncs.
     */
    getOperations() {
      const all = [];
      for (const [scope, tracker] of this._scopes) {
        if (tracker.operations.length > 0) {
          all.push({
            scope,
            operations: tracker.operations.map((op) => ({
              actionId: op.actionId,
              type: op.type,
              module: op.module,
              productId: op.productId,
              listId: op.listId,
              state: op.state,
              timestamp: op.timestamp,
              confirmedAt: op.confirmedAt
            }))
          });
        }
      }
      return all;
    }
    persistPendingOperations() {
      const pending = this.getPendingOperations();
      if (pending.length > 0) {
        try {
          sessionStorage.setItem(this._persistenceKey, JSON.stringify(pending));
          console.log(`[ConflictManager] Persisted ${pending.length} pending operation groups`);
        } catch (e) {
          console.warn("[ConflictManager] Failed to persist operations:", e);
        }
      }
    }
    clear() {
      this._scopes.clear();
      this._identities.clear();
    }
    destroy() {
      this._scopes.clear();
      this._identities.clear();
      this._initialized = false;
    }
  };
  var conflictManager = new ConflictManager();
  var conflict_manager_default = conflictManager;

  // src/frontend/js/modern/core/state-cache.js
  var StateCache = class {
    constructor() {
      this._data = {
        wishlist: { items: [], count: 0 },
        waitlist: { items: [], count: 0 },
        multiList: { lists: [], count: 0 },
        config: { userId: "", sessionId: "", isLoggedIn: false, mergeLists: false },
        ui: { isProcessing: false, pendingActions: 0, lastError: null, isOnline: navigator.onLine, activeTab: "wishlist" }
      };
      this._index = {
        wishlist: /* @__PURE__ */ new Map(),
        waitlist: /* @__PURE__ */ new Map(),
        multiList: /* @__PURE__ */ new Map()
      };
      this._listeners = /* @__PURE__ */ new Map();
      this._version = 0;
      this._flushTimer = null;
      this._dirty = /* @__PURE__ */ new Set();
      this._pendingNotifyModules = /* @__PURE__ */ new Set();
      this._notifyScheduled = false;
    }
    getList(listId) {
      return this._index.multiList.get(String(listId)) || null;
    }
    setConfig(config) {
      this._data.config = { ...this._data.config, ...config };
      if ("mergeLists" in this._data.config) {
        this._data.config.mergeLists = this._data.config.mergeLists === true || this._data.config.mergeLists === "true";
      }
      this._markDirty("config");
    }
    getConfig() {
      return this._data.config;
    }
    getUIState() {
      return this._data.ui;
    }
    setUIState(state) {
      this._data.ui = { ...this._data.ui, ...state };
      this._markDirty("ui");
    }
    getItems(module) {
      if (module === "wishlist") {
        return this._getWishlistItemsWithMergeLogic();
      }
      return this._data[module]?.items || [];
    }
    getCount(module) {
      if (module === "wishlist") {
        return this._getWishlistItemsWithMergeLogic().length;
      }
      return this._data[module]?.count || 0;
    }
    getLists() {
      return this._data.multiList.lists || [];
    }
    getItem(module, id) {
      const key = String(id);
      const index = this._index[module];
      if (!index) return null;
      return index.get(key) || null;
    }
    hasItem(module, id) {
      const key = String(id);
      const index = this._index[module];
      return index ? index.has(key) : false;
    }
    getProductListCount(productId) {
      const pid = String(productId);
      let count = 0;
      for (const list of this._data.multiList.lists) {
        const items = list.wishlist_items || [];
        if (items.some((item) => String(item.product_id) === pid)) {
          count++;
        }
      }
      return count;
    }
    getFullState() {
      return {
        wishlist: { items: this._data.wishlist.items, count: this._data.wishlist.count },
        waitlist: { items: this._data.waitlist.items, count: this._data.waitlist.count },
        multiList: { lists: this._data.multiList.lists, count: this._data.multiList.count },
        config: { ...this._data.config },
        ui: { ...this._data.ui }
      };
    }
    /**
     * Public accessor for the merged/deduplicated wishlist item set.
     * Used by BaseListUI.syncCounterItems and WishlistUI.syncAddButtons
     * so the counter always reflects the true merged state.
     */
    getMergedWishlistItems() {
      return this._getWishlistItemsWithMergeLogic();
    }
    /**
     * Check whether a product exists in ANY multi-list OR in the raw
     * wishlist array (covers optimistic adds not yet assigned to a list).
     * In merge mode this determines the "exists" state of add-to-wishlist
     * buttons regardless of which specific list holds the product.
     */
    isProductInAnyList(productId) {
      const pid = String(productId);
      for (const list of this._data.multiList.lists) {
        const items = list.wishlist_items || [];
        if (items.some((item) => String(item.product_id) === pid)) {
          return true;
        }
      }
      const rawItems = this._data.wishlist?.items || [];
      return rawItems.some((item) => String(item.product_id) === pid);
    }
    /**
     * Merge Lists logic — replicates the old wishlistItems computed behavior.
     *
     * Non-merge mode: only items belonging to the default wishlist are shown.
     * Merge mode: collect items from BOTH the flat wishlist array AND every
     *             multi-list's wishlist_items, deduplicate by product_id
     *             (keep highest item_id), attach concatenated list_name,
     *             sort by item_id desc.
     *
     * Optimistic items (_optimistic: true) are ALWAYS included in both modes.
     */
    _getWishlistItemsWithMergeLogic() {
      const rawItems = this._data.wishlist?.items || [];
      const isMerge = this._data.config?.mergeLists === true;
      const lists = this._data.multiList?.lists || [];
      let defaultWishlistId = null;
      const listNameMap = /* @__PURE__ */ new Map();
      const productListNamesMap = /* @__PURE__ */ new Map();
      for (const list of lists) {
        const listId = String(list.wishlist_id ?? list.id ?? "");
        const listName = list.wishlist_name ?? list.name ?? "";
        if (list.is_default === true || list.is_default === "true" || list.is_default === 1 || list.is_default === "1") {
          defaultWishlistId = listId;
        }
        if (listId) {
          listNameMap.set(listId, listName);
        }
        const listItems = normalizeItems(list.wishlist_items || list.items);
        for (const item of listItems) {
          if (!item || item.product_id === void 0) continue;
          const pid = String(item.product_id);
          if (!productListNamesMap.has(pid)) {
            productListNamesMap.set(pid, /* @__PURE__ */ new Set());
          }
          productListNamesMap.get(pid).add(listName);
        }
      }
      let mergedSourceItems = [...rawItems];
      if (isMerge) {
        const existingPids = new Set(rawItems.map((i) => String(i.product_id)));
        for (const list of lists) {
          const listItems = normalizeItems(list.wishlist_items || list.items);
          for (const item of listItems) {
            if (!item || item.product_id === void 0) continue;
            const pid = String(item.product_id);
            if (!existingPids.has(pid)) {
              mergedSourceItems.push({
                ...item,
                wishlist_id: list.wishlist_id ?? list.id ?? ""
              });
              existingPids.add(pid);
            }
          }
        }
      }
      if (!mergedSourceItems.length) return [];
      if (!isMerge) {
        if (defaultWishlistId !== null) {
          return mergedSourceItems.filter(
            (item) => item._optimistic === true || String(item.wishlist_id) === String(defaultWishlistId)
          );
        }
        return mergedSourceItems;
      }
      const validListIds = new Set(listNameMap.keys());
      const filtered = mergedSourceItems.filter(
        (item) => item._optimistic === true || validListIds.has(String(item.wishlist_id)) || lists.some((l) => String(l.wishlist_id ?? l.id) === String(item.wishlist_id))
      );
      const byProduct = /* @__PURE__ */ new Map();
      for (const item of filtered) {
        if (!item || item.product_id === void 0) continue;
        const pid = String(item.product_id);
        const existing = byProduct.get(pid);
        if (!existing || parseInt(item.item_id || 0, 10) > parseInt(existing.item_id || 0, 10)) {
          byProduct.set(pid, item);
        }
      }
      const result = [];
      for (const [, item] of byProduct) {
        const pid = String(item.product_id);
        const listNames = productListNamesMap.get(pid);
        const mergedListName = listNames ? [...listNames].join(", ") : "";
        result.push({ ...item, list_name: mergedListName });
      }
      result.sort(
        (a, b) => parseInt(b.item_id || 0, 10) - parseInt(a.item_id || 0, 10)
      );
      return result;
    }
    setModuleData(module, data, count) {
      let finalItems = data || [];
      try {
        const recentOps = conflict_manager_default?.getOperations?.() || [];
        const pendingRemove = /* @__PURE__ */ new Set();
        const pendingAdd = /* @__PURE__ */ new Set();
        const RECENT_CONFIRM_WINDOW_MS = 1e4;
        const now = Date.now();
        const multiListPendingRemove = /* @__PURE__ */ new Map();
        const multiListPendingAdd = /* @__PURE__ */ new Map();
        for (const group of recentOps) {
          for (const op of group.operations) {
            if (op.module === module) {
              const isPending = op.state === "queued" || op.state === "in_flight";
              const confirmationTime = op.confirmedAt || op.timestamp;
              const isRecentlyConfirmed = op.state === "confirmed" && now - confirmationTime < RECENT_CONFIRM_WINDOW_MS;
              if (!isPending && !isRecentlyConfirmed) continue;
              if (module === "multiList") {
                if (["create", "delete", "update", "privacy"].includes(op.type) || op.type === "add" && !op.productId) {
                  const listId = String(op.listId);
                  if (!listId || listId === "undefined") continue;
                  if (op.type === "delete") {
                    pendingRemove.add(listId);
                    pendingAdd.delete(listId);
                  } else if (op.type === "create") {
                    if (!pendingRemove.has(listId)) pendingAdd.add(listId);
                  }
                } else if (op.productId) {
                  const productId = String(op.productId);
                  const listId = op.listId ? String(op.listId) : "__ALL__";
                  if (op.type === "remove" || op.type === "delete") {
                    if (!multiListPendingRemove.has(listId)) multiListPendingRemove.set(listId, /* @__PURE__ */ new Set());
                    multiListPendingRemove.get(listId).add(productId);
                  } else if (op.type === "add") {
                    if (!multiListPendingAdd.has(listId)) multiListPendingAdd.set(listId, /* @__PURE__ */ new Set());
                    multiListPendingAdd.get(listId).add(productId);
                  }
                }
              } else {
                let id = String(op.productId || op.cartItemKey || op.itemId);
                if (!id || id === "undefined") continue;
                if (op.type === "remove" || op.type === "delete") {
                  pendingRemove.add(id);
                  pendingAdd.delete(id);
                } else if (op.type === "add" || op.type === "create") {
                  if (!pendingRemove.has(id)) pendingAdd.add(id);
                }
              }
            }
          }
        }
        const currentItems = this._data[module]?.items || this._data[module]?.lists || [];
        const keyField = module === "multiList" ? "wishlist_id" : "product_id";
        if (module === "multiList") {
          if (pendingRemove.size > 0) {
            finalItems = finalItems.filter((list) => !pendingRemove.has(String(list.wishlist_id || list.id)));
          }
          if (pendingAdd.size > 0) {
            const serverListIds = new Set(finalItems.map((l) => String(l.wishlist_id || l.id)));
            for (const listId of pendingAdd) {
              if (!serverListIds.has(listId)) {
                const localList = currentItems.find((l) => String(l.wishlist_id || l.id) === listId);
                if (localList) finalItems.push(localList);
              }
            }
          }
          if (multiListPendingRemove.size > 0 || multiListPendingAdd.size > 0) {
            finalItems = finalItems.map((list) => {
              const listId = String(list.wishlist_id || list.id);
              let items = Array.isArray(list.wishlist_items) ? [...list.wishlist_items] : [];
              let modified = false;
              const pRemove = multiListPendingRemove.get(listId);
              const pRemoveAll = multiListPendingRemove.get("__ALL__");
              if (pRemove && pRemove.size > 0 || pRemoveAll && pRemoveAll.size > 0) {
                const before = items.length;
                items = items.filter((i) => {
                  const pid = String(i.product_id);
                  return !(pRemove?.has(pid) || pRemoveAll?.has(pid));
                });
                if (items.length !== before) modified = true;
              }
              const pAdd = multiListPendingAdd.get(listId);
              const pAddAll = multiListPendingAdd.get("__ALL__");
              if (pAdd && pAdd.size > 0 || pAddAll && pAddAll.size > 0) {
                const serverPids = new Set(items.map((i) => String(i.product_id)));
                const localList = currentItems.find((l) => String(l.wishlist_id || l.id) === listId);
                const localItems = localList?.wishlist_items || [];
                const pidsToCheck = /* @__PURE__ */ new Set([...pAdd || [], ...pAddAll || []]);
                for (const pid of pidsToCheck) {
                  if (!serverPids.has(pid)) {
                    const localItem = localItems.find((i) => String(i.product_id) === pid);
                    if (localItem) {
                      items.push(localItem);
                      modified = true;
                    }
                  }
                }
              }
              if (modified) return { ...list, wishlist_items: items };
              return list;
            });
          }
        } else {
          if (pendingRemove.size > 0 || pendingAdd.size > 0) {
            if (pendingRemove.size > 0) {
              finalItems = finalItems.filter((item) => {
                const pid = String(item[keyField] || item.product_id || item.wishlist_id);
                return !pendingRemove.has(pid);
              });
            }
            if (pendingAdd.size > 0) {
              const serverPids = new Set(finalItems.map((i) => String(i[keyField] || i.product_id || i.wishlist_id)));
              for (const pid of pendingAdd) {
                if (!serverPids.has(pid)) {
                  const localItem = currentItems.find((i) => String(i[keyField] || i.product_id || i.wishlist_id) === pid);
                  if (localItem) finalItems.push(localItem);
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn("[StateCache] Merge with recent operations failed:", e);
      }
      if (module === "multiList") {
        this._data[module] = { lists: finalItems, count: count ?? (finalItems ? finalItems.length : 0) };
      } else {
        this._data[module] = { items: finalItems, count: count ?? (finalItems ? finalItems.length : 0) };
      }
      this._rebuildIndex(module);
      this._version++;
      this._markDirty(module);
      this._notify(module, "replace");
    }
    upsertItem(module, id, itemData) {
      const key = String(id);
      const index = this._index[module];
      if (!index) return;
      const existing = index.get(key);
      if (existing) {
        Object.assign(existing, itemData);
      } else {
        const newItem = { ...itemData };
        this._data[module].items.push(newItem);
        index.set(key, newItem);
        this._data[module].count++;
      }
      this._version++;
      this._markDirty(module);
      this._notify(module, "upsert", { id });
    }
    removeItem(module, id) {
      const key = String(id);
      const index = this._index[module];
      if (!index || !index.has(key)) return false;
      index.delete(key);
      const items = this._data[module].items;
      const idx = items.findIndex((item) => String(item["product_id"]) === key);
      if (idx !== -1) {
        items.splice(idx, 1);
        this._data[module].count--;
      }
      this._version++;
      this._markDirty(module);
      this._notify(module, "remove", { id });
      return true;
    }
    updateItem(module, id, updates) {
      const key = String(id);
      const index = this._index[module];
      if (!index) return false;
      const item = index.get(key);
      if (!item) return false;
      Object.assign(item, updates);
      this._version++;
      this._markDirty(module);
      this._notify(module, "update", { id });
      return true;
    }
    confirmItem(module, id, serverData) {
      const key = String(id);
      const index = this._index[module];
      if (!index) return;
      const item = index.get(key);
      if (!item) return;
      const { display, _optimistic, _timestamp, ...cleanData } = serverData || {};
      Object.assign(item, cleanData, { _optimistic: false });
      this._version++;
      this._markDirty(module);
      this._notify(module, "confirm", { id });
    }
    rollbackItem(module, id) {
      const key = String(id);
      const index = this._index[module];
      if (!index) return;
      const item = index.get(key);
      if (!item || item._optimistic !== true) return;
      this.removeItem(module, id);
    }
    addList(listData) {
      const lists = this._data.multiList.lists;
      const newList = { ...listData, _optimistic: true, _timestamp: Date.now() };
      lists.push(newList);
      this._data.multiList.count = lists.length;
      this._index.multiList.set(String(listData.wishlist_id), newList);
      this._version++;
      this._markDirty("multiList");
      this._notify("multiList", "list-added", { listId: listData.wishlist_id });
      if (this._data.config?.mergeLists) {
        this._notify("wishlist", "multi-list-changed");
      }
      return newList;
    }
    updateList(listId, updates) {
      const list = this._index.multiList.get(String(listId));
      if (!list) return false;
      const oldWishlistId = String(list.wishlist_id);
      Object.assign(list, updates);
      const newWishlistId = String(list.wishlist_id);
      if (oldWishlistId !== newWishlistId) {
        this._index.multiList.delete(oldWishlistId);
        this._index.multiList.set(newWishlistId, list);
      }
      this._version++;
      this._markDirty("multiList");
      this._notify("multiList", "list-updated", { listId: newWishlistId });
      if (this._data.config?.mergeLists && "wishlist_items" in updates) {
        this._notify("wishlist", "multi-list-changed");
      }
      return true;
    }
    removeList(listId) {
      const key = String(listId);
      const lists = this._data.multiList.lists;
      const idx = lists.findIndex((l) => String(l.wishlist_id) === key);
      if (idx === -1) return false;
      lists.splice(idx, 1);
      this._index.multiList.delete(key);
      this._data.multiList.count = lists.length;
      this._version++;
      this._markDirty("multiList");
      this._notify("multiList", "list-removed", { listId });
      if (this._data.config?.mergeLists) {
        this._notify("wishlist", "multi-list-changed");
      }
      return true;
    }
    addItemToList(listId, productId, itemData = {}) {
      const list = this._index.multiList.get(String(listId));
      if (!list) return false;
      if (!list.wishlist_items) list.wishlist_items = [];
      const exists = list.wishlist_items.some((item) => String(item.product_id) === String(productId));
      if (exists) return false;
      const newItem = {
        product_id: productId,
        item_id: itemData.item_id || null,
        quantity: itemData.quantity || 1,
        _optimistic: true,
        _timestamp: Date.now(),
        ...itemData
      };
      list.wishlist_items.push(newItem);
      this._version++;
      this._markDirty("multiList");
      this._notify("multiList", "item-added", { listId, productId });
      if (this._data.config?.mergeLists) {
        this._notify("wishlist", "multi-list-changed");
      }
      return true;
    }
    removeItemFromList(listId, productId) {
      const list = this._index.multiList.get(String(listId));
      if (!list || !list.wishlist_items) return false;
      const before = list.wishlist_items.length;
      list.wishlist_items = list.wishlist_items.filter(
        (item) => String(item.product_id) !== String(productId)
      );
      if (list.wishlist_items.length === before) return false;
      this._version++;
      this._markDirty("multiList");
      this._notify("multiList", "item-removed", { listId, productId });
      if (this._data.config?.mergeLists) {
        const pid = String(productId);
        const stillInAnotherList = this._data.multiList.lists.some((l) => {
          if (String(l.wishlist_id) === String(listId)) return false;
          return (l.wishlist_items || []).some((i) => String(i.product_id) === pid);
        });
        if (!stillInAnotherList) {
          const rawItems = this._data.wishlist.items;
          const rawBefore = rawItems.length;
          this._data.wishlist.items = rawItems.filter(
            (item) => String(item.product_id) !== pid
          );
          if (this._data.wishlist.items.length !== rawBefore) {
            this._data.wishlist.count = this._data.wishlist.items.length;
            this._markDirty("wishlist");
            this._rebuildIndex("wishlist");
          }
        } else {
          const remainingList = this._data.multiList.lists.find((l) => {
            if (String(l.wishlist_id) === String(listId)) return false;
            return (l.wishlist_items || []).some((i) => String(i.product_id) === pid);
          });
          if (remainingList) {
            const rawItem = this._data.wishlist.items.find(
              (item) => String(item.product_id) === pid
            );
            if (rawItem) {
              rawItem.wishlist_id = String(remainingList.wishlist_id ?? remainingList.id ?? "");
              const remainingItem = (remainingList.wishlist_items || []).find(
                (i) => String(i.product_id) === pid
              );
              if (remainingItem) {
                if (remainingItem.item_id !== void 0) rawItem.item_id = remainingItem.item_id;
                if (remainingItem.remove_nonce) rawItem.remove_nonce = remainingItem.remove_nonce;
                if (remainingItem.wishlist_token) rawItem.wishlist_token = remainingItem.wishlist_token;
                if (remainingItem.remove_url) rawItem.remove_url = remainingItem.remove_url;
              }
              this._markDirty("wishlist");
            }
          }
        }
        this._notify("wishlist", "multi-list-changed");
      }
      return true;
    }
    /* ═══════════════════════════════════════════
       REACTIVE SUBSCRIPTIONS (Single Source of Truth)
    ════════════════════════════════════════════ */
    subscribe(module, callback) {
      if (!this._listeners.has(module)) {
        this._listeners.set(module, /* @__PURE__ */ new Set());
      }
      this._listeners.get(module).add(callback);
      return () => {
        this._listeners.get(module)?.delete(callback);
      };
    }
    _notify(module, type, detail = {}) {
      this._scheduleNotify(module);
    }
    _scheduleNotify(module) {
      this._pendingNotifyModules.add(module);
      if (!this._notifyScheduled) {
        this._notifyScheduled = true;
        Promise.resolve().then(() => {
          this._notifyScheduled = false;
          const modules = [...this._pendingNotifyModules];
          this._pendingNotifyModules.clear();
          for (const mod of modules) {
            this._notifyListeners(mod);
          }
        });
      }
    }
    _notifyListeners(module) {
      const listeners = this._listeners.get(module);
      if (!listeners) return;
      for (const cb of listeners) {
        try {
          cb({ module, version: this._version });
        } catch (e) {
          console.warn(`[StateCache] Listener error for ${module}:`, e);
        }
      }
    }
    /* ═══════════════════════════════════════════
       PERSISTENCE
    ════════════════════════════════════════════ */
    _markDirty(module) {
      this._dirty.add(module);
      if (!this._flushTimer) {
        this._flushTimer = setTimeout(() => {
          this._flushTimer = null;
          this._flush();
        }, 200);
      }
    }
    _flush() {
      if (this._dirty.size === 0) return;
      const modulesToFlush = [...this._dirty];
      this._dirty.clear();
      try {
        document.dispatchEvent(new CustomEvent("wlfmc:cache-flush", {
          detail: { modules: modulesToFlush, data: this._data }
        }));
      } catch (e) {
      }
    }
    getRawForPersistence(modules) {
      const result = {};
      for (const mod of modules) {
        if (this._data[mod]) {
          result[mod] = { ...this._data[mod] };
        }
      }
      return result;
    }
    _rebuildIndex(module) {
      const index = this._index[module];
      if (!index) return;
      index.clear();
      if (module === "multiList") {
        const lists = this._data.multiList.lists || [];
        for (const list of lists) {
          index.set(String(list.wishlist_id), list);
        }
      } else {
        const items = this._data[module].items || [];
        const keyField = "product_id";
        for (const item of items) {
          if (item && item[keyField] !== void 0) {
            index.set(String(item[keyField]), item);
          }
        }
      }
    }
    get version() {
      return this._version;
    }
    clear() {
      for (const module of Object.keys(this._data)) {
        if (module === "config") {
          this._data.config = { userId: "", sessionId: "", isLoggedIn: false, mergeLists: false };
        } else if (module === "multiList") {
          this._data.multiList = { lists: [], count: 0 };
        } else {
          this._data[module] = { items: [], count: 0 };
        }
      }
      for (const index of Object.values(this._index)) {
        index.clear();
      }
      this._version++;
      this._notify("wishlist", "clear");
      this._notify("waitlist", "clear");
      this._notify("multiList", "clear");
    }
  };
  var stateCache = new StateCache();
  var state_cache_default = stateCache;

  // node_modules/idb/build/index.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(this.request);
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));
  var advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
  var methodMap = {};
  var advanceResults = /* @__PURE__ */ new WeakMap();
  var ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
  var cursorIteratorTraps = {
    get(target, prop) {
      if (!advanceMethodProps.includes(prop))
        return target[prop];
      let cachedFunc = methodMap[prop];
      if (!cachedFunc) {
        cachedFunc = methodMap[prop] = function(...args) {
          advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
        };
      }
      return cachedFunc;
    }
  };
  async function* iterate(...args) {
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
      cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
      return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
      yield proxiedCursor;
      cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
      advanceResults.delete(proxiedCursor);
    }
  }
  function isIteratorProp(target, prop) {
    return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
      if (isIteratorProp(target, prop))
        return iterate;
      return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
      return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    }
  }));

  // src/frontend/js/modern/core/storage/idb-driver.js
  var DB_NAME = "wlfmc_storage";
  var DB_VERSION = 2;
  var KV_STORE = "kv";
  function isIndexedDBSupported() {
    try {
      return typeof window !== "undefined" && !!window.indexedDB;
    } catch (e) {
      return false;
    }
  }
  function openDB2(dbName = DB_NAME, options = {}) {
    return openDB(dbName, options.version || DB_VERSION, {
      upgrade(database, oldVersion, newVersion, transaction) {
        if (!database.objectStoreNames.contains(KV_STORE)) {
          database.createObjectStore(KV_STORE);
        }
        if (typeof options.upgrade === "function") {
          options.upgrade(database, oldVersion, newVersion, transaction);
        }
      },
      blocked() {
        console.warn("[idb-driver] Database open blocked by another tab/connection.");
        if (typeof options.blocked === "function") options.blocked();
      },
      terminated() {
        console.warn("[idb-driver] Database connection terminated unexpectedly.");
        if (typeof options.terminated === "function") options.terminated();
      }
    });
  }
  function deleteDB(dbName = DB_NAME) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        console.warn("[idb-driver] Database deletion blocked by another tab.");
        resolve();
      };
    });
  }

  // src/frontend/js/modern/core/storage/resilient-storage.js
  var HEALTH_KEY = "_wlfmc_health";
  var PREV_HEALTH_KEY = "_wlfmc_health_prev";
  var HEALTH_INTERVAL_MS = 45e3;
  var RECOVERY_EVERY = 5;
  var ResilientStorage = class {
    constructor() {
      this._db = null;
      this._mode = "idle";
      this._reason = "";
      this._memory = /* @__PURE__ */ new Map();
      this._journal = [];
      this._timer = null;
      this._tick = 0;
      this._initialized = false;
    }
    /* ── Lifecycle ─────────────────────────────────────────────────────── */
    /**
     * Open the durable backend or silently fall back to RAM.
     * Never throws.
     */
    /**
     * Open the durable backend or silently fall back to RAM.
     * If the database is corrupted (e.g., missing object stores after
     * manual deletion or partial upgrade), it self-heals by deleting
     * and recreating the database.
     * Never throws.
     */
    async init() {
      if (this._initialized) return;
      this._initialized = true;
      try {
        if (!isIndexedDBSupported()) throw new Error("unsupported");
        this._db = await openDB2();
        await this._writeSentinel(HEALTH_KEY);
        const readBack = await this._db.get(KV_STORE, HEALTH_KEY);
        if (!readBack || !readBack.t) throw new Error("probe-failed");
        this._setMode("idb", "");
        this._startHealthLoop();
      } catch (error) {
        const isCorrupt = error?.name === "NotFoundError" || (error?.message || "").includes("not a known object store");
        if (isCorrupt) {
          try {
            if (this._db) {
              this._db.close();
              this._db = null;
            }
            await deleteDB();
            this._db = await openDB2();
            await this._writeSentinel(HEALTH_KEY);
            const check = await this._db.get(KV_STORE, HEALTH_KEY);
            if (check && check.t) {
              this._setMode("idb", "self-healed");
              this._startHealthLoop();
              return;
            }
          } catch (retryError) {
            console.error("[ResilientStorage] Self-heal failed:", retryError);
          }
        }
        console.error("[ResilientStorage] IDB initialization failed:", error);
        this._degrade(this._reasonFor(error), true);
        this._startHealthLoop();
      }
    }
    /* ── Public API (always resolves; never throws) ─────────────────────── */
    getMode() {
      return this._mode;
    }
    isVolatile() {
      return this._mode !== "idb";
    }
    async get(key) {
      if (this._mode === "idb") {
        try {
          return await this._db.get(KV_STORE, key);
        } catch (e) {
          this._degrade("runtime-error");
        }
      }
      return this._memory.has(key) ? this._memory.get(key) : void 0;
    }
    async set(key, value) {
      if (this._mode === "idb") {
        try {
          await this._db.put(KV_STORE, value, key);
          return true;
        } catch (e) {
          this._degrade("runtime-error");
        }
      }
      this._memory.set(key, value);
      this._journal.push({ key, value, t: Date.now() });
      if (this._journal.length > 500) this._journal.splice(0, this._journal.length - 500);
      return false;
    }
    async remove(key) {
      if (this._mode === "idb") {
        try {
          await this._db.delete(KV_STORE, key);
          return;
        } catch (e) {
          this._degrade("runtime-error");
        }
      }
      this._memory.delete(key);
      this._journal.push({ key, value: void 0, t: Date.now(), deleted: true });
    }
    async keys() {
      if (this._mode === "idb") {
        try {
          return await this._db.getAllKeys(KV_STORE) || [];
        } catch (e) {
          this._degrade("runtime-error");
        }
      }
      return Array.from(this._memory.keys());
    }
    /**
     * Read every non-internal key (used for boot recovery).
     */
    async exportAll() {
      const keys = await this.keys();
      const out = /* @__PURE__ */ new Map();
      for (const key of keys) {
        if (String(key).startsWith("_")) continue;
        out.set(key, await this.get(key));
      }
      return out;
    }
    /* ── Health monitoring ─────────────────────────────────────────────── */
    _startHealthLoop() {
      if (this._timer) clearInterval(this._timer);
      this._tick = 0;
      this._timer = setInterval(() => this._healthTick(), HEALTH_INTERVAL_MS);
    }
    async _healthTick() {
      this._tick++;
      if (this._mode === "idb") {
        try {
          const prev = await this._db.get(KV_STORE, PREV_HEALTH_KEY);
          if (prev && prev.t && !await this._db.get(KV_STORE, HEALTH_KEY)) {
            throw new Error("evicted");
          }
          const current = await this._db.get(KV_STORE, HEALTH_KEY);
          await this._db.put(KV_STORE, current || { t: Date.now() }, PREV_HEALTH_KEY);
          await this._writeSentinel(HEALTH_KEY);
          return;
        } catch (error) {
          this._degrade("evicted");
        }
      }
      if (this._mode === "memory" && this._tick % RECOVERY_EVERY === 0) {
        await this._tryRecovery();
      }
    }
    async _tryRecovery() {
      try {
        this._db = await openDB2();
        await this._writeSentinel(HEALTH_KEY);
        const readBack = await this._db.get(KV_STORE, HEALTH_KEY);
        if (!readBack || !readBack.t) throw new Error("probe-failed");
        for (let i = this._journal.length - 1; i >= 0; i--) {
          const entry = this._journal[i];
          if (entry.deleted) {
            await this._db.delete(KV_STORE, entry.key).catch(() => {
            });
          } else {
            await this._db.put(KV_STORE, entry.value, entry.key).catch(() => {
            });
          }
        }
        this._journal.length = 0;
        for (const [key, value] of this._memory.entries()) {
          await this._db.put(KV_STORE, value, key).catch(() => {
          });
        }
        this._setMode("idb", "recovered");
      } catch (e) {
      }
    }
    _writeSentinel(key) {
      return this._db.put(KV_STORE, { t: Date.now() }, key);
    }
    /* ── Mode transitions & notifications ──────────────────────────────── */
    _reasonFor(error) {
      const msg = error && error.message || "";
      if ("unsupported" === msg) return "unsupported";
      if (/blocked|version/i.test(msg)) return "blocked";
      if (/quota/i.test(msg)) return "quota";
      return "open-failed";
    }
    _degrade(reason, initial = false) {
      this._mode = "memory";
      this._reason = reason;
      this._notify(initial ? `initial (${reason})` : reason);
    }
    _setMode(mode, reason = "") {
      this._mode = mode;
      this._reason = reason;
      this._notify(reason);
    }
    _notify(reason) {
      const detail = {
        mode: this._mode,
        volatile: this.isVolatile(),
        reason
      };
      window.wlfmcStorageMode = detail.mode;
      try {
        document.dispatchEvent(new CustomEvent("wlfmc:storage-state", { detail }));
      } catch (e) {
      }
      eventBus.emit("storage:state", detail);
      console.warn(`[ResilientStorage] mode=${detail.mode} (${reason})`);
    }
  };
  var resilientStorage = new ResilientStorage();

  // src/frontend/js/modern/core/storage/display-store.js
  var KEY_PREFIX = "_display_";
  var MAX_ENTRIES_PER_MODULE = 500;
  var SHARED_FIELDS = /* @__PURE__ */ new Set(["name", "image", "price", "url"]);
  function extractShared(displayData) {
    if (!displayData) return null;
    const shared = {};
    for (const field of SHARED_FIELDS) {
      if (displayData[field] !== void 0) {
        shared[field] = displayData[field];
      }
    }
    return Object.keys(shared).length > 0 ? shared : null;
  }
  var DisplayStore = class {
    constructor() {
      this._cache = /* @__PURE__ */ new Map();
      this._recovered = /* @__PURE__ */ new Set();
    }
    _key(moduleName, productId) {
      return `${KEY_PREFIX}${moduleName}_${productId}`;
    }
    _moduleEntries(moduleName) {
      if (!this._cache.has(moduleName)) {
        this._cache.set(moduleName, /* @__PURE__ */ new Map());
      }
      return this._cache.get(moduleName);
    }
    /**
     * Store SHARED display data for a product within a module.
     * Only product-level fields (name/image/price/url) are stored.
     * List-specific fields (remove_url, nonce, item_id) live on the item.
     * RAM Map is updated synchronously; IDB write is fire-and-forget.
     */
    set(moduleName, productId, data) {
      const shared = extractShared(data);
      if (!shared) return;
      const entries = this._moduleEntries(moduleName);
      const existing = entries.get(String(productId)) || {};
      entries.set(String(productId), { ...existing, ...shared });
      if (entries.size > MAX_ENTRIES_PER_MODULE) {
        const firstKey = entries.keys().next().value;
        entries.delete(firstKey);
        resilientStorage.remove(this._key(moduleName, firstKey));
      }
      resilientStorage.set(
        this._key(moduleName, productId),
        entries.get(String(productId))
      );
    }
    /**
     * Synchronous read from RAM cache.
     * Returns null if not found.
     */
    get(moduleName, productId) {
      const entries = this._moduleEntries(moduleName);
      return entries.get(String(productId)) || null;
    }
    /**
     * Batch-write display data extracted from sync/hydration items.
     * Items format: [{ product_id, display: {...} }, ...]
     */
    bulkSet(moduleName, items) {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        if (item?.display && item.product_id !== void 0) {
          this.set(moduleName, item.product_id, item.display);
        }
      }
    }
    /**
     * Pre-load all cached display entries for a module from IDB into RAM.
     * Must complete BEFORE any rendering that depends on display data.
     */
    async recover(moduleName) {
      if (this._recovered.has(moduleName)) return;
      this._recovered.add(moduleName);
      try {
        const prefix = `${KEY_PREFIX}${moduleName}_`;
        const allKeys = await resilientStorage.keys();
        for (const fullKey of allKeys) {
          if (typeof fullKey !== "string" || !fullKey.startsWith(prefix)) continue;
          const productId = fullKey.slice(prefix.length);
          const data = await resilientStorage.get(fullKey);
          if (data && (data.name || data.image)) {
            this._moduleEntries(moduleName).set(String(productId), data);
          }
        }
      } catch (error) {
        console.warn(`[DisplayStore] Recovery failed for ${moduleName}:`, error);
      }
    }
    /**
     * Clear all entries for a module (e.g., after account switch).
     */
    clear(moduleName) {
      const entries = this._moduleEntries(moduleName);
      for (const [productId] of entries) {
        resilientStorage.remove(this._key(moduleName, productId));
      }
      entries.clear();
    }
    /**
     * Remove a single product's shared display entry for a module.
     */
    remove(moduleName, productId) {
      const entries = this._moduleEntries(moduleName);
      if (!entries.delete(String(productId))) return;
      resilientStorage.remove(this._key(moduleName, productId));
    }
  };
  var displayStore = new DisplayStore();

  // src/frontend/js/modern/shared/store-helpers.js
  var LIST_SPECIFIC_FIELDS = [
    "remove_url",
    "remove_nonce",
    "wishlist_token",
    "list_name",
    "item_id",
    "wishlist_id"
  ];
  var BaseStore = class {
    constructor(moduleName, itemKey = "product_id") {
      this.moduleName = moduleName;
      this.itemKey = itemKey;
    }
    get items() {
      return { get: () => stateCache.getItems(this.moduleName) };
    }
    get count() {
      return { get: () => stateCache.getCount(this.moduleName) };
    }
    hasItem(id) {
      const needle = String(id);
      return stateCache.getItems(this.moduleName).some((item) => String(item[this.itemKey]) === needle);
    }
    getItem(id) {
      const needle = String(id);
      return stateCache.getItems(this.moduleName).find((item) => String(item[this.itemKey]) === needle) || null;
    }
    findItem(predicate) {
      return stateCache.getItems(this.moduleName).find(predicate) || null;
    }
    getItemsBy(field, value) {
      const needle = String(value);
      return stateCache.getItems(this.moduleName).filter((item) => String(item[field]) === needle);
    }
    addItem(id, data = {}) {
      if (this.hasItem(id)) return false;
      const newItem = { [this.itemKey]: id, _optimistic: true, _timestamp: Date.now(), ...data };
      stateCache.upsertItem(this.moduleName, String(id), newItem);
      return true;
    }
    removeItem(id) {
      return stateCache.removeItem(this.moduleName, String(id));
    }
    updateItem(id, updates) {
      return stateCache.updateItem(this.moduleName, String(id), updates);
    }
    confirmAdd(id, serverData) {
      const { display, ...cleanData } = serverData || {};
      if (display) {
        for (const key of LIST_SPECIFIC_FIELDS) {
          if (display[key] !== void 0 && cleanData[key] === void 0) {
            cleanData[key] = display[key];
          }
        }
      }
      stateCache.confirmItem(this.moduleName, String(id), cleanData);
    }
    rollbackAdd(id) {
      stateCache.rollbackItem(this.moduleName, String(id));
    }
    getFullState() {
      return { items: stateCache.getItems(this.moduleName), count: stateCache.getCount(this.moduleName) };
    }
    clear() {
      stateCache.setModuleData(this.moduleName, [], 0);
    }
    /* ═══ Display Data (delegated to DisplayStore) ═══ */
    /**
     * Store shared display data for a product within this module's namespace.
     * RAM Map is updated synchronously; IDB write is fire-and-forget.
     */
    setDisplayData(productId, data) {
      displayStore.set(this.moduleName, productId, data);
    }
    /**
     * Synchronous read of display data from RAM cache.
     * Returns null if not found.
     */
    getDisplayData(productId) {
      return displayStore.get(this.moduleName, productId);
    }
    /**
     * Batch-set display data extracted from sync/hydration items.
     * Items format: [{ product_id, display: {...} }, ...]
     */
    setBulkDisplayData(items) {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        if (!item || item.product_id === void 0) continue;
        if (item.display && (item.display.name || item.display.image)) {
          this.setDisplayData(item.product_id, item.display);
        } else if (item.name || item.image) {
          this.setDisplayData(item.product_id, item);
        }
      }
    }
    /* ═══ Sync ═══ */
    /**
     * Sync module data from server response.
     * Strips bulky display objects from items BEFORE persisting
     * and routes them to the IDB-backed DisplayStore.
     */
    syncFromData(data) {
      let items = data.items || [];
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item?.display && item.product_id !== void 0) {
            displayStore.set(this.moduleName, item.product_id, item.display);
          }
        });
        items = items.map((item) => {
          const { display, ...rest } = item;
          if (display) {
            for (const key of LIST_SPECIFIC_FIELDS) {
              if (display[key] !== void 0 && rest[key] === void 0) {
                rest[key] = display[key];
              }
            }
          }
          return rest;
        });
      }
      stateCache.setModuleData(this.moduleName, items, data.count || items.length);
    }
    batchUpdate(updates) {
      const current = stateCache.getItems(this.moduleName);
      const updated = current.map((item) => {
        const update = updates.find((u) => String(u[this.itemKey]) === String(item[this.itemKey]));
        return update ? { ...item, ...update } : item;
      });
      stateCache.setModuleData(this.moduleName, updated, updated.length);
    }
  };
  function normalizeItems(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      return Object.values(data);
    }
    return [];
  }
  function extractListsFromObject(data) {
    if (!data) return [];
    let rawLists = null;
    if (Array.isArray(data)) {
      rawLists = data;
    } else if (typeof data === "object") {
      if (Array.isArray(data.lists)) {
        rawLists = data.lists;
      } else if (data.items && typeof data.items === "object") {
        rawLists = Array.isArray(data.items) ? data.items : Object.values(data.items);
      } else {
        rawLists = Object.values(data).filter(
          (v) => v && typeof v === "object" && !Array.isArray(v)
        );
      }
    }
    if (!rawLists || !Array.isArray(rawLists)) return [];
    return rawLists.map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        ...item,
        wishlist_id: String(item.wishlist_id ?? item.id ?? ""),
        wishlist_name: item.wishlist_name ?? item.name ?? "",
        wishlist_desc: item.wishlist_desc ?? item.description ?? "",
        wishlist_privacy: Number(item.wishlist_privacy ?? item.privacy ?? 0),
        wishlist_items: normalizeItems(item.wishlist_items ?? item.items ?? []),
        wishlist_url: item.wishlist_url ?? item.url ?? "",
        wishlist_image: item.wishlist_image ?? item.image ?? "",
        is_default: item.is_default ?? false,
        count: Number(item.count ?? 0)
      };
    }).filter(Boolean);
  }

  // src/frontend/js/modern/core/sync-gateway.js
  var LIST_SPECIFIC_FIELDS2 = [
    "remove_url",
    "remove_nonce",
    "wishlist_token",
    "list_name",
    "item_id",
    "wishlist_id"
  ];
  function extractDisplays(moduleName, items) {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (item?.display && item.product_id !== void 0) {
        displayStore.set(moduleName, item.product_id, item.display);
        for (const key of LIST_SPECIFIC_FIELDS2) {
          if (item.display[key] !== void 0 && item[key] === void 0) {
            item[key] = item.display[key];
          }
        }
        delete item.display;
      }
    }
  }
  function extractMultiListDisplays(listsData) {
    const lists = extractListsFromObject(listsData);
    for (const list of lists) {
      const rawItems = list?.wishlist_items || list?.items || {};
      const items = normalizeItems(rawItems);
      for (const item of items) {
        if (item?.display && item.product_id !== void 0) {
          displayStore.set("multiList", item.product_id, item.display);
          for (const key of LIST_SPECIFIC_FIELDS2) {
            if (item.display[key] !== void 0 && item[key] === void 0) {
              item[key] = item.display[key];
            }
          }
          delete item.display;
        }
      }
    }
  }
  var SyncGateway = class {
    applyServerData(data, options = {}) {
      const isMerge = window.wlfmc_l10n?.merge_lists === "true";
      if (data.wishlist) {
        const items = normalizeItems(data.wishlist.items);
        extractDisplays("wishlist", items);
        if (isMerge && data.lists) {
          const lists = extractListsFromObject(data.lists);
          for (const list of lists) {
            const listItems = normalizeItems(list.items || list.wishlist_items);
            for (const item of listItems) {
              if (item?.display && item.product_id !== void 0) {
                displayStore.set("wishlist", item.product_id, item.display);
              }
            }
          }
        }
        stateCache.setModuleData("wishlist", items, data.wishlist.count || items.length);
      }
      if (data.waitlist) {
        const items = normalizeItems(data.waitlist.items);
        extractDisplays("waitlist", items);
        stateCache.setModuleData("waitlist", items, data.waitlist.count || items.length);
      }
      if (data.lists) {
        extractMultiListDisplays(data.lists);
        const lists = extractListsFromObject(data.lists).map((list) => ({
          ...list,
          wishlist_items: normalizeItems(list.wishlist_items || list.items)
        }));
        stateCache.setModuleData("multiList", lists, data.lists.count || lists.length);
      }
      eventBus.emit(EVENTS.SYNC_COMPLETED, {
        data,
        remoteTriggered: !!options.remoteTriggered,
        source: "gateway"
      });
    }
    applyHydrationData(module, items, count) {
      if (module === "wishlist" || module === "waitlist") {
        extractDisplays(module, items);
      } else if (module === "multiList") {
        extractMultiListDisplays({ lists: items });
        items = items.map((list) => ({
          ...list,
          wishlist_items: normalizeItems(list.wishlist_items || list.items)
        }));
      }
      stateCache.setModuleData(module, items, count ?? items.length);
    }
    patchItem(module, id, updates) {
      stateCache.updateItem(module, id, updates);
    }
    upsertItem(module, id, data) {
      stateCache.upsertItem(module, id, data);
    }
    removeItem(module, id) {
      stateCache.removeItem(module, id);
    }
  };
  var syncGateway = new SyncGateway();

  // src/frontend/js/modern/core/fragment-manager.js
  var FRAGMENT_GLUE = window.wlfmc_l10n?.fragments_index_glue || ".";
  var EXCLUDED_REFS = /* @__PURE__ */ new Set([
    "wishlist_counter",
    "waitlist_counter",
    "list_counter",
    "save_for_later_counter"
  ]);
  var FragmentManager = class {
    constructor() {
      this._timeout = null;
      this._controller = null;
      this._replaceLock = false;
    }
    get isReplacing() {
      return this._replaceLock;
    }
    /**
     * Collect fragment configs from DOM elements carrying
     * `.wlfmc-wishlist-fragment` class + `data-fragment-options` attribute.
     * Counter fragments are ALWAYS excluded (handled by point-updates).
     */
    retrieveFragments(search = {}) {
      let fragments = null;
      const container = search.container || document;
      if (search.fragments) {
        fragments = search.fragments;
      } else {
        fragments = Array.from(container.querySelectorAll(".wlfmc-wishlist-fragment"));
      }
      fragments = fragments.filter((el) => {
        const ref = el.dataset.fragmentRef || "";
        if (EXCLUDED_REFS.has(ref)) return false;
        if (el.classList.contains("wlfmc-counter-wrapper")) return false;
        return true;
      });
      if (search.s) {
        fragments = fragments.filter(
          (el) => !el.dataset.fragmentRef || el.dataset.fragmentRef === search.s
        );
      }
      if (!fragments || !fragments.length) return null;
      const options = {};
      fragments.forEach((el) => {
        const classes = el.className.split(" ").filter((c) => c && c !== "exists");
        const id = classes.join(FRAGMENT_GLUE);
        try {
          options[id] = JSON.parse(el.dataset.fragmentOptions || "{}");
        } catch (e) {
        }
      });
      return Object.keys(options).length ? options : null;
    }
    /**
     * Load fresh HTML for fragments from the server.
     * Uses admin-ajax POST (bypasses page cache).
     */
    loadFragments(search = {}, success = null, successArgs = []) {
      if (this._replaceLock) return;
      clearTimeout(this._timeout);
      if (this._controller) {
        this._controller.abort();
        this._controller = null;
      }
      this._timeout = setTimeout(() => {
        this._controller = new AbortController();
        search = { firstLoad: true, ...search };
        const fragments = this.retrieveFragments(search);
        if (!fragments) {
          if (success) success.apply(null, successArgs);
          return;
        }
        const formData = new FormData();
        formData.append("action", "wlfmc_load_fragments");
        formData.append("context", "frontend");
        const nonce = window.wlfmc_l10n?.ajax_nonce?.load_fragments || "";
        formData.append("nonce", nonce);
        const file = new File([JSON.stringify(fragments)], "fragment.json");
        formData.append("fragments_file", file);
        const url = window.wlfmc_l10n?.admin_url;
        block(".wlfmc-wishlist-table-wrapper, .wlfmc-save-for-later-table-wrapper");
        fetch(url, {
          method: "POST",
          body: formData,
          credentials: "same-origin",
          signal: this._controller.signal
        }).then((response) => response.json()).then((data) => {
          unblock(".wlfmc-wishlist-table-wrapper, .wlfmc-save-for-later-table-wrapper");
          if (data.fragments) {
            this.replaceFragments(data.fragments);
            if (data.products) {
              const products = normalizeItems(data.products);
              syncGateway.applyHydrationData("wishlist", products, products.length);
            }
            if (data.waitlist) {
              const waitlist = normalizeItems(data.waitlist);
              syncGateway.applyHydrationData("waitlist", waitlist, waitlist.length);
            }
          }
          if (success) success.apply(null, successArgs);
          this._controller = null;
        }).catch((error) => {
          if (error.name !== "AbortError") {
            console.warn("[FragmentManager] Load failed:", error);
          }
          unblock(".wlfmc-wishlist-table-wrapper, .wlfmc-save-for-later-table-wrapper");
          this._controller = null;
        });
      }, 300);
    }
    /**
     * Replace matched DOM elements with freshly rendered HTML.
     */
    replaceFragments(fragments) {
      this._replaceLock = true;
      Object.entries(fragments).forEach(([id, html]) => {
        const selector = "." + id.split(FRAGMENT_GLUE).filter((c) => c && c !== "exists" && c !== "with-count").join(".");
        const targets = document.querySelectorAll(selector);
        if (!targets.length) return;
        const temp = document.createElement("div");
        temp.innerHTML = html;
        let source = temp.querySelector(selector);
        if (!source) {
          for (const child of temp.children) {
            if (child.matches(selector)) {
              source = child;
              break;
            }
          }
        }
        if (source) {
          targets.forEach((el) => {
            const clone = source.cloneNode(true);
            if (el.dataset.fragmentOptions && !clone.dataset.fragmentOptions) {
              clone.dataset.fragmentOptions = el.dataset.fragmentOptions;
            }
            el.replaceWith(clone);
          });
        }
      });
      eventBus.emit(EVENTS.CONTENT_UPDATED);
      const $ = window.jQuery;
      if ($) $(document).trigger("wlfmc_init_after_ajax");
      setTimeout(() => {
        this._replaceLock = false;
      }, 300);
    }
    reloadFragments() {
      this.loadFragments();
    }
  };
  var fragmentManager = new FragmentManager();
  var fragment_manager_default = fragmentManager;

  // src/frontend/js/modern/shared/dom-helpers.js
  function extractProductId(element) {
    if (!element) return null;
    let id = element.dataset.productId || element.dataset.product_id || element.dataset.rowId;
    if (!id) {
      id = element.getAttribute("data-product-id") || element.getAttribute("data-product_id") || element.getAttribute("data-row-id");
    }
    if (!id) {
      const parent = element.closest(
        "[data-product-id], [data-product_id], [data-row-id]"
      );
      if (parent) {
        id = parent.dataset.productId || parent.dataset.product_id || parent.dataset.rowId;
      }
    }
    if (!id) {
      const form = element.closest("form.cart, form.vtajaxform");
      if (form) {
        const input = form.querySelector(
          'input[name="add-to-cart"], input[name="product_id"]'
        );
        if (input) id = input.value;
      }
    }
    return id ? parseInt(id, 10) : null;
  }
  function extractParentProductId(element) {
    let id = element.dataset.parentProductId || element.dataset.parent_product_id;
    if (!id) id = element.getAttribute("data-parent-product-id") || element.getAttribute("data-parent_product_id");
    if (!id) {
      const parent = element.closest("[data-parent-product-id], [data-parent_product_id]");
      if (parent) id = parent.dataset.parentProductId || parent.dataset.parent_product_id;
    }
    return id ? parseInt(id, 10) : null;
  }
  function findProductForm(element, parentProductId) {
    let form = null;
    if (parentProductId) {
      const selectors = [
        `form.cart[method="post"][data-product_id="${parentProductId}"]`,
        `form.vtajaxform[method="post"][data-product_id="${parentProductId}"]`
      ];
      for (const s of selectors) {
        const f = document.querySelector(s);
        if (f) {
          form = f;
          break;
        }
      }
    }
    if (!form) {
      const f = element.closest('form.cart[method="post"], form.vtajaxform[method="post"]');
      if (f) form = f;
    }
    if (!form && parentProductId) {
      const button = document.querySelector(
        `form.cart[method="post"] button[name="add-to-cart"][value="${parentProductId}"], form.vtajaxform[method="post"] button[name="add-to-cart"][value="${parentProductId}"], form.cart[method="post"] input[name="add-to-cart"][value="${parentProductId}"]`
      );
      if (button) form = button.closest("form");
    }
    return form;
  }
  function buildFormData(element, productId, parentProductId) {
    const productType = element.dataset.productType || "simple";
    let quantity = parseInt(element.dataset.quantity || 1, 10);
    const form = findProductForm(element, parentProductId);
    let formData = new FormData();
    if (form) {
      formData = new FormData(form);
      formData.delete("add-to-cart");
      if (formData.has("quantity")) {
        const qty = formData.get("quantity");
        if (qty) quantity = parseInt(qty, 10);
      }
    } else {
      const addToCartLink = element.closest(".product.post-" + parentProductId)?.querySelector(".add_to_cart_button");
      if (addToCartLink) {
        const qty = addToCartLink.dataset.quantity;
        if (qty) quantity = parseInt(qty, 10);
      }
    }
    const nonce = element.dataset.nonce || element.getAttribute("data-nonce");
    if (nonce && !formData.has("nonce")) formData.append("nonce", nonce);
    if (!formData.has("context")) formData.append("context", "frontend");
    if (!formData.has("quantity")) formData.append("quantity", String(quantity));
    return { formData, quantity, productType, hasForm: !!form };
  }
  function getWishlistIdFromElement(element) {
    let wid = element.dataset.wishlistId || element.dataset.wishlist_id;
    if (!wid) wid = element.getAttribute("data-wishlist-id") || element.getAttribute("data-wishlist_id");
    if (!wid) {
      const table = element.closest(".wlfmc-wishlist-table, .wlfmc-wishlist-items-wrapper");
      if (table) wid = table.dataset.id || table.getAttribute("data-id");
    }
    return wid ? parseInt(wid, 10) : 0;
  }
  function getItemIdFromElement(element) {
    let id = element.dataset.itemId || element.dataset.item_id;
    if (!id) id = element.getAttribute("data-item-id") || element.getAttribute("data-item_id");
    if (!id) {
      const row = element.closest("[data-item-id], [data-item_id]");
      if (row) id = row.dataset.itemId || row.dataset.item_id || row.getAttribute("data-item-id");
    }
    return id ? parseInt(id, 10) : 0;
  }

  // src/frontend/js/modern/core/event-manager.js
  var EventManager = class {
    constructor() {
      this._handlers = /* @__PURE__ */ new Map();
      this._registered = false;
      this._qtyTimeout = null;
      this._supportedEvents = [
        "click",
        "change",
        "input",
        "submit",
        "mouseenter",
        "mouseleave",
        "focusin",
        "focusout",
        "touchstart",
        "touchend",
        "keyup",
        "keydown"
      ];
      this._originalCartRedirectAfterAdd = null;
      this._globalHandlers = {};
    }
    registerHandler(selector, eventName, handler, priority = 0, module = "core") {
      if (!this._handlers.has(eventName)) {
        this._handlers.set(eventName, []);
      }
      const handlers = this._handlers.get(eventName);
      handlers.push({ handler, priority, module, selector, eventName });
      handlers.sort((a, b) => b.priority - a.priority);
      if (!this._registered) {
        this._registerGlobalListeners();
      }
    }
    registerModuleHandlers(moduleName, handlers) {
      handlers.forEach(({ selector, eventName = "click", handler, priority = 0 }) => {
        this.registerHandler(selector, eventName, handler, priority, moduleName);
      });
      console.log(`[EventManager] ${handlers.length} handlers registered for ${moduleName}`);
    }
    registerCoreHandlers() {
      this.registerHandler('.wlfmc-list button[name="apply_bulk_actions"]', "click", this._handleBulkAction.bind(this), 60);
      this.registerHandler(".wlfmc-gdpr-btn", "click", this._handleGdpr.bind(this), 50);
      this.registerHandler(".wlfmc-close-notice", "click", this._handleCloseNotice.bind(this), 40);
      this.registerHandler(
        '.wlfmc-wishlist-table .product-checkbox input[type="checkbox"], .wlfmc-save-for-later-table .product-checkbox input[type="checkbox"]',
        "change",
        this._handleCheckboxChange.bind(this),
        40
      );
      this.registerHandler("#bulk_add_to_cart, #bulk_add_to_cart2", "change", this._handleBulkSelectChange.bind(this), 35);
      this.registerHandler(
        ".wlfmc-wishlist-table .quantity input, .wlfmc-wishlist-table .quantity select, .wlfmc-wishlist-table .quantity textarea, .wlfmc-save-for-later-table .quantity input, .wlfmc-save-for-later-table .quantity select, .wlfmc-save-for-later-table .quantity textarea",
        "change",
        this._handleQuantityChange.bind(this),
        30
      );
      this.registerHandler(".copy-link-trigger", "click", this._handleCopyLink.bind(this), 20);
      this.registerHandler(".wlfmc-products-counter-wishlist .remove_from_wishlist, .wlfmc-products-counter-waitlist .remove_from_wishlist", "click", this._handleCounterRemove.bind(this), 90);
      this.registerHandler(".wlfmc-products-counter-wishlist .remove_from_wishlist, .wlfmc-products-counter-waitlist .remove_from_wishlist", "touchend", this._handleCounterRemoveTouch.bind(this), 90);
      this.registerHandler(".wlfmc-list .product-components", "click", this._handleProductComponents.bind(this), 60);
      this.registerHandler(".wlfmc-list .close-components", "click", this._handleCloseComponents.bind(this), 60);
      this._initPrepareQtyLinks();
      this._setupVariationHandlers();
      this._setupJQueryEventBridge();
      this._setupEventBusHandlers();
      document.addEventListener("adding_to_cart", (event) => {
        this._handleAddingToCart(event, event.detail?.button, event.detail?.data || {});
      });
      document.addEventListener("added_to_cart", (event) => {
        const { fragments, carthash, button } = event.detail || {};
        this._handleAddedToCart(event, fragments, carthash, button);
      });
      document.addEventListener("cart_page_refreshed", () => {
        this._handleCartPageRefreshed();
      });
      console.log("[EventManager] Core handlers registered");
    }
    _handleCounterRemoveTouch(event, element) {
      event.preventDefault();
      this._handleCounterRemove(event, element);
    }
    _registerGlobalListeners() {
      const captureEvents = ["click", "submit", "focusin", "focusout"];
      this._supportedEvents.forEach((eventName) => {
        const useCapture = captureEvents.includes(eventName);
        const target = useCapture ? window : document;
        const handler = (e) => this._globalHandler(e, eventName);
        this._globalHandlers[eventName] = handler;
        target.addEventListener(eventName, handler, useCapture);
      });
      this._registered = true;
    }
    _globalHandler(event, eventName) {
      const target = event.target;
      if (!target || !target.closest) return;
      const handlers = this._handlers.get(eventName);
      if (!handlers || handlers.length === 0) return;
      const matchedHandlers = [];
      for (const h of handlers) {
        let validSelector = h.selector;
        if (validSelector.includes(":input")) {
          validSelector = validSelector.replace(/:input/g, "input, select, textarea");
        }
        const element = target.closest(validSelector);
        if (element) {
          matchedHandlers.push({ ...h, element });
        }
      }
      if (matchedHandlers.length === 0) return;
      const specificHandler = matchedHandlers.find((h) => h.selector.includes("["));
      const executed = /* @__PURE__ */ new Set();
      for (const { handler, element, selector } of matchedHandlers) {
        if (specificHandler && selector !== specificHandler.selector && !selector.includes("[")) {
          continue;
        }
        if (!executed.has(selector)) {
          executed.add(selector);
          try {
            handler(event, element);
          } catch (error) {
            console.error(`[EventManager] Handler error for ${selector}:`, error);
          }
        }
      }
      if (event.cancelable && (eventName === "click" || eventName === "submit")) {
        const submitControl = eventName === "click" && target.closest('button[type="submit"], input[type="submit"], button:not([type])') && !target.closest(".wlfmc-popup-form");
        if (!submitControl) {
          event.preventDefault();
        }
      }
    }
    _setupJQueryEventBridge() {
      const jQuery = window.jQuery;
      if (!jQuery) {
        console.warn("[EventManager] jQuery not available \u2014 WooCommerce event bridge skipped");
        return;
      }
      const _bridgingEvents = /* @__PURE__ */ new Set();
      const guardBridge = (eventName, fn) => {
        if (_bridgingEvents.has(eventName)) return;
        _bridgingEvents.add(eventName);
        try {
          fn();
        } finally {
          setTimeout(() => _bridgingEvents.delete(eventName), 0);
        }
      };
      jQuery(document.body).on("adding_to_cart", (ev, button, data) => {
        const nativeEvent = new CustomEvent("adding_to_cart", {
          bubbles: true,
          cancelable: true,
          detail: { button: ensureNative(button), data: data || {} }
        });
        document.dispatchEvent(nativeEvent);
        console.log("[EventManager] Bridge: adding_to_cart \u2192 native");
      });
      jQuery(document.body).on("added_to_cart", (ev, fragments, carthash, button) => {
        const nativeEvent = new CustomEvent("added_to_cart", {
          bubbles: true,
          cancelable: true,
          detail: { fragments, carthash, button: ensureNative(button) }
        });
        document.dispatchEvent(nativeEvent);
        console.log("[EventManager] Bridge: added_to_cart \u2192 native");
      });
      jQuery(document.body).on("cart_page_refreshed", () => {
        const nativeEvent = new CustomEvent("cart_page_refreshed", {
          bubbles: true,
          cancelable: true,
          detail: {}
        });
        document.dispatchEvent(nativeEvent);
        console.log("[EventManager] Bridge: cart_page_refreshed \u2192 native");
      });
      jQuery(document.body).on("add_to_cart_message", (ev, message, button) => {
        const nativeEvent = new CustomEvent("add_to_cart_message", {
          bubbles: true,
          cancelable: true,
          detail: { message, button: ensureNative(button) }
        });
        document.dispatchEvent(nativeEvent);
        console.log("[EventManager] Bridge: add_to_cart_message \u2192 native");
      });
      jQuery(document.body).on("wlfmc_adding_to_wishlist", () => {
        guardBridge("wlfmc_adding_to_wishlist", () => {
          document.body.dispatchEvent(new CustomEvent("wlfmc_adding_to_wishlist", { bubbles: true }));
        });
      });
      jQuery(document.body).on("wlfmc_adding_to_waitlist", () => {
        guardBridge("wlfmc_adding_to_waitlist", () => {
          document.body.dispatchEvent(new CustomEvent("wlfmc_adding_to_waitlist", { bubbles: true }));
        });
      });
      jQuery(document.body).on("wlfmc_adding_to_multi_list", () => {
        guardBridge("wlfmc_adding_to_multi_list", () => {
          document.body.dispatchEvent(new CustomEvent("wlfmc_adding_to_multi_list", { bubbles: true }));
        });
      });
      jQuery(document.body).on("wlfmc_added_to_wishlist", (ev, button, wrapper) => {
        guardBridge("wlfmc_added_to_wishlist", () => {
          const nativeEvent = new CustomEvent("wlfmc_added_to_wishlist", {
            bubbles: true,
            detail: { button, wrapper }
          });
          document.body.dispatchEvent(nativeEvent);
        });
      });
      jQuery(document.body).on("wlfmc_removed_from_wishlist", (ev, button, row, data) => {
        guardBridge("wlfmc_removed_from_wishlist", () => {
          const nativeEvent = new CustomEvent("wlfmc_removed_from_wishlist", {
            bubbles: true,
            detail: { button, row, data }
          });
          document.body.dispatchEvent(nativeEvent);
        });
      });
      jQuery(document.body).on("wlfmc_removed_from_waitlist", (ev, button, row, data) => {
        guardBridge("wlfmc_removed_from_waitlist", () => {
          const nativeEvent = new CustomEvent("wlfmc_removed_from_waitlist", {
            bubbles: true,
            detail: { button, row, data }
          });
          document.body.dispatchEvent(nativeEvent);
        });
      });
      jQuery(document.body).on("wlfmc_removed_from_save_for_later", (ev, button, row, data) => {
        guardBridge("wlfmc_removed_from_save_for_later", () => {
          const nativeEvent = new CustomEvent("wlfmc_removed_from_save_for_later", {
            bubbles: true,
            detail: { button, row, data }
          });
          document.body.dispatchEvent(nativeEvent);
        });
      });
      console.log("[EventManager] jQuery \u2192 Native event bridge registered (with recursion guard)");
    }
    // ---------- Qty Plus/Minus ----------
    _initPrepareQtyLinks() {
      const qtyContainers = document.querySelectorAll(".wlfmc-wishlist-table .quantity, .wlfmc-save-for-later-table .quantity");
      qtyContainers.forEach((qty) => {
        if (qty.classList.contains("hidden")) return;
        const plus = qty.querySelector(".botiga-quantity-plus, a.plus, .ct-increase");
        const minus = qty.querySelector(".botiga-quantity-minus, a.minus, .ct-decrease");
        if (plus) plus.classList.add("show");
        if (minus) minus.classList.add("show");
      });
      if (this._qtyDelegated) return;
      this._qtyDelegated = true;
      document.addEventListener("click", (e) => {
        const plusSelector = ".wlfmc-wishlist-table .quantity .ct-increase, .wlfmc-wishlist-table .quantity .botiga-quantity-plus, .wlfmc-wishlist-table .quantity a.plus, .wlfmc-save-for-later-table .quantity .ct-increase, .wlfmc-save-for-later-table .quantity .botiga-quantity-plus, .wlfmc-save-for-later-table .quantity a.plus";
        const minusSelector = ".wlfmc-wishlist-table .quantity .ct-decrease, .wlfmc-wishlist-table .quantity .botiga-quantity-minus, .wlfmc-wishlist-table .quantity a.minus, .wlfmc-save-for-later-table .quantity .ct-decrease, .wlfmc-save-for-later-table .quantity .botiga-quantity-minus, .wlfmc-save-for-later-table .quantity a.minus";
        const plus = e.target.closest(plusSelector);
        const minus = e.target.closest(minusSelector);
        if (!plus && !minus) return;
        const qty = (plus || minus).closest(".quantity");
        if (!qty) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const input = qty.querySelector(".qty");
        if (!input) return;
        let val = parseFloat(input.value) || 0;
        const step = parseFloat(input.step) || 1;
        if (plus) {
          const max = input.getAttribute("max") ? parseFloat(input.getAttribute("max")) : Infinity;
          input.value = val < max ? Math.round((val + step) * 100) / 100 : max;
        } else if (minus) {
          const min = input.getAttribute("min") ? Math.round(parseFloat(input.getAttribute("min")) * 100) / 100 : 0;
          input.value = val > min ? Math.round((val - step) * 100) / 100 : min;
        }
        input.dispatchEvent(new Event("change", { bubbles: true, cancelable: false }));
      }, true);
    }
    // ---------- Event Bus Handlers ----------
    _setupEventBusHandlers() {
      eventBus.on(EVENTS.CONTENT_UPDATED, () => {
        this._initPrepareQtyLinks();
      });
      eventBus.on("cart:message", (data) => {
        this._handleAddToCartMessage(data.message, data.button);
      });
    }
    _handleAddToCartMessage(message, button) {
      const wrapper = document.querySelector(".woocommerce-notices-wrapper .woocommerce-error, .woocommerce-notices-wrapper .woocommerce-message");
      if (button) button.classList.remove("loading");
      if (!wrapper) {
        const form = document.getElementById("wlfmc-wishlist-form");
        if (form) form.insertAdjacentHTML("afterbegin", message);
      } else {
        const noticesWrapper = wrapper.closest(".woocommerce-notices-wrapper");
        wrapper.style.opacity = "0";
        setTimeout(() => {
          if (noticesWrapper) {
            noticesWrapper.insertAdjacentHTML("beforebegin", message);
            noticesWrapper.remove();
          }
        }, 300);
      }
    }
    _handleBulkAction(event, element) {
      const wrapper = element.closest(".wlfmc-list") || element.closest(".action-wrapper");
      if (!wrapper) return;
      const select = wrapper.querySelector('select[name="bulk_actions"]');
      if (!select || !select.value) return;
      if (select.value === "delete") {
        const form = wrapper.closest("form");
        if (form) form.querySelectorAll("input.qty").forEach((el) => el.disabled = true);
      }
    }
    _handleCheckboxChange(event, element) {
      const p = element.parentElement;
      p.classList.remove("checked", "unchecked");
      p.classList.add(element.checked ? "checked" : "unchecked");
      if (!element.checked) {
        const name = element.getAttribute("name");
        if (name) {
          document.querySelectorAll(`input[name="${name}"]`).forEach((cb) => {
            cb.checked = false;
          });
        }
        const bulk1 = document.getElementById("bulk_add_to_cart");
        const bulk2 = document.getElementById("bulk_add_to_cart2");
        if (bulk1) bulk1.checked = false;
        if (bulk2) bulk2.checked = false;
      }
      const table = element.closest(".wlfmc-wishlist-table, .wlfmc-save-for-later-table");
      if (!table) return;
      const anyChecked = table.querySelectorAll('.product-checkbox input[type="checkbox"]:checked').length > 0;
      table.querySelectorAll(".multiple-product-move, .multiple-product-copy").forEach((link) => {
        link.style.display = anyChecked ? "" : "none";
      });
      let itemIds = "";
      table.querySelectorAll('.product-checkbox input[type="checkbox"]:checked').forEach((cb) => {
        const cbRow = cb.closest("[data-item-id]");
        if (cbRow && cbRow.dataset.itemId) {
          itemIds += (itemIds ? "," : "") + cbRow.dataset.itemId;
        }
      });
      table.querySelectorAll(".multiple-product-move, .multiple-product-copy").forEach((link) => {
        link.dataset.itemId = itemIds;
        link.setAttribute("data-item-id", itemIds);
      });
    }
    _handleBulkSelectChange(event, element) {
      const checked = element.checked;
      const table = element.closest(".wlfmc-wishlist-table, .wlfmc-save-for-later-table");
      if (!table) return;
      const checkboxes = table.querySelectorAll('[data-row-id] .product-checkbox input[type="checkbox"]:not(:disabled)');
      checkboxes.forEach((cb) => {
        cb.checked = checked;
        cb.dispatchEvent(new Event("change", { bubbles: true }));
      });
      const bulk1 = document.getElementById("bulk_add_to_cart");
      const bulk2 = document.getElementById("bulk_add_to_cart2");
      if (bulk1) bulk1.checked = checked;
      if (bulk2) bulk2.checked = checked;
    }
    _handleQuantityChange(event, element) {
      clearTimeout(this._qtyTimeout);
      this._qtyTimeout = setTimeout(() => {
        const row = element.closest("[data-row-id]");
        if (!row) return;
        const productId = row.dataset.rowId;
        const cartItemKey = row.dataset.cartItemKey;
        const table = row.closest(".wlfmc-wishlist-table, .wlfmc-save-for-later-table");
        const token = table?.dataset.token;
        const nonce = table?.dataset.nonce;
        const value = element.value;
        const addBtn = row.querySelector(".add_to_cart_button, .wlfmc_ajax_add_to_cart");
        if (addBtn) {
          addBtn.setAttribute("data-quantity", value);
          addBtn.setAttribute("href", (addBtn.getAttribute("href") || "").replace(/quantity=\d+/g, "quantity=" + value));
        }
        const scope = table?.classList.contains("wlfmc-save-for-later-table") ? "save_for_later" : "wishlist";
        queueManager.addWithDeduplication("update_item_quantity", {
          nonce,
          context: "frontend",
          product_id: productId,
          cart_item_key: cartItemKey,
          wishlist_token: token,
          quantity: value,
          _table_scope: scope
        }).then((result) => {
          if (result && result.success) {
            row.setAttribute("data-quantity", value);
            fragmentManager.loadFragments({ s: scope });
            eventBus.emit(EVENTS.CONTENT_UPDATED);
          }
        }).catch(() => {
        });
      }, 1e3);
    }
    _handleCopyLink(event, element) {
      event.preventDefault();
      const url = element.dataset.href || element.getAttribute("data-href");
      if (!url) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showSuccess(window.wlfmc_l10n?.labels?.link_copied);
        });
      } else {
        const hidden = document.createElement("input");
        hidden.value = url;
        hidden.type = "text";
        document.body.appendChild(hidden);
        if (/ipad|iphone/i.test(navigator.userAgent)) {
          hidden.contentEditable = true;
          hidden.readOnly = false;
          const range = document.createRange();
          range.selectNodeContents(hidden);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else {
          hidden.select();
        }
        document.execCommand("copy");
        document.execCommand("copy");
        hidden.remove();
        showSuccess(window.wlfmc_l10n?.labels?.link_copied);
      }
    }
    _handleAddingToCart(event, button, data) {
      if (button && button.closest(".wlfmc-wishlist-table, .wlfmc-save-for-later-table")) {
        const table = button.closest(".wlfmc-wishlist-table, .wlfmc-save-for-later-table");
        if (table) {
          data.wishlist_id = table.dataset.id;
          data.wishlist_type = table.dataset.wishlistType;
          data.customer_id = table.dataset.customerId;
          data.is_owner = table.dataset.isOwner;
          if (typeof wc_add_to_cart_params !== "undefined") {
            this._originalCartRedirectAfterAdd = wc_add_to_cart_params.cart_redirect_after_add;
            wc_add_to_cart_params.cart_redirect_after_add = window.wlfmc_l10n?.redirect_to_cart || "";
          }
        }
      }
    }
    _handleAddedToCart(event, fragments, carthash, button) {
      if (!button) return;
      if (typeof wc_add_to_cart_params !== "undefined" && this._originalCartRedirectAfterAdd !== null) {
        wc_add_to_cart_params.cart_redirect_after_add = this._originalCartRedirectAfterAdd;
        this._originalCartRedirectAfterAdd = null;
      }
      button.classList.remove("added");
      const tr = button.closest("[data-row-id]");
      if (tr) {
        const addedToCart = tr.querySelector(".added_to_cart");
        if (addedToCart) addedToCart.remove();
      }
      const wishlistTable = button.closest(".wlfmc-wishlist-table");
      if (wishlistTable) {
        const removeAfterAdd = window.wlfmc_l10n?.remove_from_wishlist_after_add_to_cart;
        const fragmentEl = tr?.closest(".wlfmc-wishlist-fragment");
        const fragmentOptions = fragmentEl?.dataset?.fragmentOptions;
        let isUserOwner = true;
        if (fragmentOptions) {
          try {
            const opts = JSON.parse(fragmentOptions);
            isUserOwner = opts.is_user_owner !== false && opts.is_user_owner !== "false";
          } catch (e) {
            isUserOwner = true;
          }
        }
        if (removeAfterAdd && isUserOwner) {
          const row = button.closest("[data-row-id]");
          if (row) {
            const rowId = row.dataset.rowId;
            const table = row.closest(".wlfmc-wishlist-fragment");
            const listType = table?.querySelector(".wlfmc-wishlist-table")?.dataset.wishlistType || "wishlist";
            const wishlistId = table?.querySelector(".wlfmc-wishlist-table")?.dataset.id;
            if (rowId) {
              eventBus.emit("cart:item_added_to_cart", { rowId, wishlistId, listType, isUserOwner, button });
            }
          }
        }
      }
      const sflTable = button.closest(".wlfmc-save-for-later-table");
      if (sflTable) {
        const row = button.closest("[data-item-id]");
        if (row) {
          const itemId = row.dataset.itemId;
          const fragmentEl = row.closest(".wlfmc-wishlist-fragment");
          const fragmentOptions = fragmentEl?.dataset?.fragmentOptions;
          let isUserOwner = true;
          if (fragmentOptions) {
            try {
              const opts = JSON.parse(fragmentOptions);
              isUserOwner = opts.is_user_owner !== false && opts.is_user_owner !== "false";
            } catch (e) {
              isUserOwner = true;
            }
          }
          if (itemId && isUserOwner) {
            eventBus.emit("cart:sfl_item_added_to_cart", { itemId });
          }
        }
      }
    }
    _handleCartPageRefreshed() {
      this._initPrepareQtyLinks();
      eventBus.emit(EVENTS.CONTENT_UPDATED);
    }
    _handleCounterRemove(event, element) {
      const wrapperEl = element.closest(".wlfmc-counter-wrapper");
      const isWishlist = String(wrapperEl?.dataset.counterType || "wishlist") !== "waitlist";
      const productId = extractProductId(element);
      if (!productId) {
        return;
      }
      const row = element.closest("[data-row-id]");
      let wishlistId = getWishlistIdFromElement(element);
      if (!wishlistId && row) {
        wishlistId = parseInt(row.dataset.wishlistId || row.getAttribute("data-wishlist-id") || "0", 10) || 0;
      }
      const nonce = element.dataset.nonce || element.getAttribute("data-nonce");
      const wishlistToken = row?.getAttribute("data-wishlist-token") || row?.dataset?.wishlistToken || "";
      eventBus.emit("counter:remove", {
        isWishlist,
        productId,
        wishlistId,
        nonce,
        wishlistToken,
        element
      });
    }
    _handleProductComponents(event, element) {
      event.preventDefault();
      const row = element.closest("tr");
      if (!row) return;
      const metaData = row.querySelector(".wlfmc-absolute-meta-data");
      const nextRow = row.nextElementSibling;
      const isNextHidden = nextRow && nextRow.classList.contains("hide");
      if (metaData) {
        metaData.style.display = metaData.style.display === "none" || metaData.style.display === "" ? "block" : "none";
      }
      if (nextRow && nextRow.classList.contains("wlfmc-row-meta-data")) {
        nextRow.classList.toggle("hide");
      }
      row.classList.toggle("show-meta-data", isNextHidden);
    }
    _handleCloseComponents(event, element) {
      event.preventDefault();
      const row = element.closest("tr");
      if (!row) return;
      const metaData = row.querySelector(".wlfmc-absolute-meta-data");
      if (metaData) metaData.style.display = "none";
      row.classList.remove("show-meta-data");
      const nextRow = row.nextElementSibling;
      if (nextRow && nextRow.classList.contains("wlfmc-row-meta-data")) {
        nextRow.classList.add("hide");
      }
    }
    _setupVariationHandlers() {
      const jQuery = window.jQuery;
      if (!jQuery) {
        console.warn("[EventManager] jQuery not available for variation bridge");
        return;
      }
      const _variationGuard = {
        reset_data: false,
        hide_variation: false
      };
      jQuery(document).on("found_variation", (ev, variation) => {
        const target = jQuery(ev.target);
        const productId = target.data("product_id");
        const variationData = { ...variation, product_id: productId };
        eventBus.emit("variation:shown", variationData);
      });
      jQuery(document).on("reset_data", (ev) => {
        if (_variationGuard.reset_data) return;
        _variationGuard.reset_data = true;
        const target = jQuery(ev.target);
        const productId = target.data("product_id");
        if (productId) {
          eventBus.emit("variation:reset", { productId: parseInt(productId, 10) });
        }
        setTimeout(() => {
          _variationGuard.reset_data = false;
        }, 0);
      });
      jQuery(document).on("hide_variation", ".variations_form", (ev) => {
        if (_variationGuard.hide_variation) return;
        _variationGuard.hide_variation = true;
        const target = jQuery(ev.target);
        const productId = target.data("product_id");
        if (productId) {
          eventBus.emit("variation:hide", { productId: parseInt(productId, 10) });
        }
        setTimeout(() => {
          _variationGuard.hide_variation = false;
        }, 0);
      });
      jQuery(document).on("show_variation", ".variations_form", (ev, variation) => {
      });
      console.log("[EventManager] Variation bridge handlers registered (with recursion guard)");
    }
    _handleGdpr(event, element) {
      const actionType = element.dataset.action;
      const customerId = parseInt(element.dataset.cid, 10);
      const nonce = element.dataset.nonce;
      if (!actionType || !customerId) return;
      if (element.querySelector("i") !== null) {
        element.classList.add("wlfmc-action", "wlfmc-loading");
      } else {
        element.classList.add("wlfmc-action", "wlfmc-loading-alt");
      }
      const gdprAction = window.wlfmc_l10n?.actions?.gdpr_action || "wlfmc_change_gdpr_status";
      queueManager.addWithDeduplication("gdpr_action", {
        action: gdprAction,
        action_type: actionType,
        cid: customerId,
        nonce,
        context: "frontend"
      }).then((result) => {
        if (result.success || result.result === "true") {
          document.querySelectorAll(".wlfmc-gdpr-notice-wrapper, .wlfmc-unsubscribe-notice-wrapper").forEach((el) => el.remove());
        }
      }).catch(() => {
      }).finally(() => {
        element.classList.remove("wlfmc-loading", "wlfmc-loading-alt");
      });
    }
    _handleCloseNotice(event, element) {
      if (!validators.isCookieEnabled()) {
        window.alert(window.wlfmc_l10n?.labels?.cookie_disabled);
        return;
      }
      const wrapper = element.closest(".wlfmc-notice-wrapper");
      if (wrapper) {
        wrapper.style.opacity = "0";
        setTimeout(() => wrapper.remove(), 300);
      }
      validators.setCookie("wlfmc_save_for_later_notice", "true", 365 * 25);
    }
    destroy() {
      const captureEvents = ["click", "submit", "focusin", "focusout"];
      this._supportedEvents.forEach((eventName) => {
        const handler = this._globalHandlers[eventName];
        if (handler) {
          const useCapture = captureEvents.includes(eventName);
          const target = useCapture ? window : document;
          target.removeEventListener(eventName, handler, useCapture);
        }
      });
      this._handlers.clear();
      this._globalHandlers = {};
      this._registered = false;
      const jQuery = window.jQuery;
      if (jQuery) {
        jQuery(document.body).off("adding_to_cart added_to_cart cart_page_refreshed add_to_cart_message");
        jQuery(document.body).off("wlfmc_adding_to_wishlist wlfmc_adding_to_waitlist wlfmc_adding_to_multi_list");
        jQuery(document.body).off("wlfmc_added_to_wishlist wlfmc_removed_from_wishlist");
        jQuery(document.body).off("wlfmc_removed_from_waitlist wlfmc_removed_from_save_for_later");
        jQuery(document).off("found_variation reset_data");
        jQuery(document).off("hide_variation", ".variations_form");
        jQuery(document).off("show_variation", ".variations_form");
      }
    }
  };
  var eventManager = new EventManager();

  // src/frontend/js/modern/core/sync.js
  var LAST_SYNC_KEY = "wlfmc_last_sync";
  var HEARTBEAT_INTERVAL = 3e3;
  var LEADER_TIMEOUT = 7500;
  var STARTUP_WAIT = 900;
  var SYNC_INTERVAL = 10 * 60 * 1e3;
  var VISIBILITY_THROTTLE = 1e4;
  var SyncManager = class {
    constructor() {
      this.isSyncing = false;
      this._pendingSync = false;
      this._lastSyncTimestamp = null;
      this._broadcastDebounce = null;
      this._remoteSyncTimer = null;
      this._boundStorageHandler = null;
      this._boundVisibilityHandler = null;
      this._lastVisibilityCheck = 0;
      this._tabId = this._generateTabId();
      this._isLeader = false;
      this._leaderId = null;
      this._leaderLastSeen = 0;
      this._heartbeatTimer = null;
      this._healthCheckTimer = null;
      this._periodicSyncTimer = null;
      this._channel = null;
      this._channelAvailable = false;
      this._syncRequestPending = false;
      this._syncRequestTimer = null;
    }
    /* ═══════════════════════════════════════════
       Initialization
    ════════════════════════════════════════════ */
    init() {
      this._initChannel();
      this._initLeaderElection();
      this._boundStorageHandler = this._handleStorageEvent.bind(this);
      window.addEventListener("storage", this._boundStorageHandler);
      window.addEventListener("beforeunload", () => {
        if (this._isLeader) {
          this._send({ type: "leader_resign", tabId: this._tabId });
        }
      });
      this._boundVisibilityHandler = this._handleVisibilityChange.bind(this);
      document.addEventListener("visibilitychange", this._boundVisibilityHandler);
      console.log("[SyncManager] Initialized (Leader Election mode)", {
        tabId: this._tabId,
        channelAvailable: this._channelAvailable
      });
    }
    _generateTabId() {
      try {
        return crypto.randomUUID();
      } catch {
        return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      }
    }
    _initChannel() {
      try {
        this._channel = new BroadcastChannel("wlfmc_sync");
        this._channelAvailable = true;
        this._channel.onmessage = this._handleChannelMessage.bind(this);
        console.log("[SyncManager] BroadcastChannel initialized");
      } catch (e) {
        this._channelAvailable = false;
        console.warn("[SyncManager] BroadcastChannel unavailable \u2014 fallback mode");
      }
    }
    /* ═══════════════════════════════════════════
       Cache Validation (merged from CacheValidator)
       Runs when the user returns to this tab.
    ═════════════════════════════════════════════ */
    _handleVisibilityChange() {
      if (document.hidden) return;
      const now = Date.now();
      if (now - this._lastVisibilityCheck < VISIBILITY_THROTTLE) return;
      this._lastVisibilityCheck = now;
      const updateWishlistsData = window.wlfmc_l10n?.update_wishlists_data;
      if (updateWishlistsData) {
        console.log("[SyncManager] Visibility change: forcing sync (update_wishlists_data)");
        this.syncAll();
        return;
      }
      const currentLang = window.wlfmc_l10n?.lang || "";
      const storedLang = localStorage.getItem(STORAGE_KEYS.LANG_HASH) || "";
      if (currentLang && storedLang && currentLang !== storedLang) {
        console.log("[SyncManager] Language changed, purging cache");
        localStorage.setItem(STORAGE_KEYS.PRODUCTS_HASH, "");
        localStorage.setItem(STORAGE_KEYS.WAITLIST_HASH, "");
        localStorage.setItem(STORAGE_KEYS.LANG_HASH, "");
        stateCache.clear();
        try {
          localStorage.removeItem(STORAGE_KEYS.WISHLIST);
          localStorage.removeItem(STORAGE_KEYS.WAITLIST);
          localStorage.removeItem(STORAGE_KEYS.MULTI_LIST);
        } catch (e) {
        }
        this.syncAll({ forceLocal: true });
        return;
      }
      const lastSync = localStorage.getItem(LAST_SYNC_KEY);
      const stale = !lastSync || now - parseInt(lastSync, 10) > SYNC_INTERVAL;
      if (stale) {
        console.log("[SyncManager] Cache stale, syncing with server...");
        this.syncAll();
      }
    }
    /* ═══════════════════════════════════════════
       Leader Election
    ════════════════════════════════════════════ */
    _initLeaderElection() {
      if (!this._channelAvailable) {
        console.log("[SyncManager] No BroadcastChannel \u2014 becoming leader (fallback mode)");
        this._isLeader = true;
        this._leaderId = this._tabId;
        this._startPeriodicSync();
        return;
      }
      this._send({ type: "tab_announce", tabId: this._tabId, timestamp: Date.now() });
      setTimeout(() => {
        if (!this._leaderId) {
          console.log("[SyncManager] No leader found, claiming leadership");
          this._claimLeadership();
        } else {
          console.log("[SyncManager] Leader exists:", this._leaderId);
        }
      }, STARTUP_WAIT);
      this._healthCheckTimer = setInterval(() => {
        this._checkLeaderHealth();
      }, LEADER_TIMEOUT);
    }
    _claimLeadership() {
      this._isLeader = true;
      this._leaderId = this._tabId;
      this._leaderLastSeen = Date.now();
      this._send({
        type: "leader_claim",
        tabId: this._tabId,
        timestamp: Date.now()
      });
      this._startHeartbeat();
      this._startPeriodicSync();
      console.log("[SyncManager] This tab is now the LEADER");
    }
    _startHeartbeat() {
      if (this._heartbeatTimer) clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = setInterval(() => {
        if (this._isLeader) {
          this._send({
            type: "leader_heartbeat",
            tabId: this._tabId,
            timestamp: Date.now()
          });
        }
      }, HEARTBEAT_INTERVAL);
    }
    _startPeriodicSync() {
      if (this._periodicSyncTimer) clearInterval(this._periodicSyncTimer);
      this._periodicSyncTimer = setInterval(() => {
        if (this._isLeader && !document.hidden) {
          console.log("[SyncManager] Periodic sync (leader)");
          this.syncAll();
        }
      }, SYNC_INTERVAL);
    }
    _checkLeaderHealth() {
      if (this._isLeader) return;
      const now = Date.now();
      if (this._leaderId && now - this._leaderLastSeen > LEADER_TIMEOUT) {
        console.log("[SyncManager] Leader appears dead \u2014 re-electing");
        this._leaderId = null;
        this._claimLeadership();
      }
    }
    _stepDown() {
      this._isLeader = false;
      if (this._heartbeatTimer) {
        clearInterval(this._heartbeatTimer);
        this._heartbeatTimer = null;
      }
      if (this._periodicSyncTimer) {
        clearInterval(this._periodicSyncTimer);
        this._periodicSyncTimer = null;
      }
      console.log("[SyncManager] Stepped down from leadership");
    }
    /* ═══════════════════════════════════════════
       BroadcastChannel Message Handler
    ════════════════════════════════════════════ */
    _handleChannelMessage(event) {
      const msg = event.data;
      if (!msg || !msg.type) return;
      switch (msg.type) {
        case "tab_announce":
          if (this._isLeader && msg.tabId !== this._tabId) {
            this._send({
              type: "leader_heartbeat",
              tabId: this._tabId,
              timestamp: Date.now()
            });
          }
          break;
        case "leader_heartbeat":
          if (msg.tabId !== this._tabId) {
            this._leaderId = msg.tabId;
            this._leaderLastSeen = Date.now();
            if (this._isLeader && msg.tabId < this._tabId) {
              console.log("[SyncManager] Another tab has priority \u2014 stepping down");
              this._stepDown();
            }
          }
          break;
        case "leader_claim":
          if (msg.tabId !== this._tabId) {
            this._leaderId = msg.tabId;
            this._leaderLastSeen = Date.now();
            if (this._isLeader && msg.tabId < this._tabId) {
              console.log("[SyncManager] Another tab claimed leadership \u2014 stepping down");
              this._stepDown();
            }
          }
          break;
        case "leader_resign":
          if (msg.tabId === this._leaderId) {
            console.log("[SyncManager] Leader resigned \u2014 claiming leadership");
            this._leaderId = null;
            this._claimLeadership();
          }
          break;
        case "request_sync":
          if (this._isLeader && msg.tabId !== this._tabId) {
            console.log("[SyncManager] Received sync request from tab:", msg.tabId);
            this._scheduleRemoteSync();
          }
          break;
        case "sync_result":
          if (msg.tabId !== this._tabId && msg.data) {
            console.log("[SyncManager] Received sync result from leader");
            this._applySyncData(msg.data, { remoteTriggered: true });
            this._lastSyncTimestamp = Date.now();
            localStorage.setItem(LAST_SYNC_KEY, String(this._lastSyncTimestamp));
            localStorage.setItem(
              STORAGE_KEYS.LANG_HASH,
              window.wlfmc_l10n?.lang || ""
            );
            this._syncRequestPending = false;
          }
          break;
        case "sync_started":
          if (msg.tabId !== this._tabId) {
            eventBus.emit(EVENTS.SYNC_STARTED);
          }
          break;
        case "sync_failed":
          if (msg.tabId !== this._tabId) {
            eventBus.emit(EVENTS.SYNC_FAILED, { error: msg.error });
            this._syncRequestPending = false;
          }
          break;
        // NEW: Incremental update from leader (avoid full sync for small changes)
        case "incremental_update":
          if (msg.tabId !== this._tabId && msg.update) {
            console.log("[SyncManager] Received incremental update", msg.update);
            this._applyIncrementalUpdate(msg.update);
          }
          break;
      }
    }
    _send(message) {
      if (!this._channelAvailable || !this._channel) return;
      try {
        this._channel.postMessage(message);
      } catch (e) {
        console.warn("[SyncManager] Channel send failed:", e);
      }
    }
    /* ═══════════════════════════════════════════
       Cross-Tab Broadcast (outgoing)
    ════════════════════════════════════════════ */
    /**
     * Notify other tabs that data has changed.
     *
     * IMPORTANT: This does NOT trigger sync in the current tab!
     * The current tab already has the correct state after a successful operation.
     * Only other tabs need to be notified.
     *
     * Uses BroadcastChannel when available, localStorage as fallback.
     */
    broadcastUpdate(update) {
      try {
        clearTimeout(this._broadcastDebounce);
        this._broadcastDebounce = setTimeout(() => {
          if (this._channelAvailable) {
            this._send({
              type: "incremental_update",
              tabId: this._tabId,
              timestamp: Date.now(),
              update: {
                type: update.type,
                productId: update.productId,
                data: update.data
              }
            });
            console.log("[SyncManager] Broadcasted incremental update:", update.type);
          } else {
            const payload = {
              type: update.type,
              data: update.data,
              timestamp: Date.now(),
              version: 1,
              source: "broadcast"
            };
            localStorage.setItem(STORAGE_KEYS.SYNC_DATA, JSON.stringify(payload));
            sessionStorage.setItem(
              STORAGE_KEYS.SYNC_DATA + "_sent",
              String(Date.now())
            );
            console.log("[SyncManager] Broadcasted via localStorage (fallback)");
          }
        }, 50);
      } catch (error) {
        console.warn("[SyncManager] Broadcast failed:", error);
      }
    }
    /* ═══════════════════════════════════════════
       Incremental Update Handler
    ════════════════════════════════════════════ */
    /**
     * Apply incremental updates from other tabs without full sync.
     * This is much more efficient than requesting a full sync for every small change.
     */
    /**
     * Apply incremental updates from other tabs without full sync.
     * This is much more efficient than requesting a full sync for every small change.
     */
    _applyIncrementalUpdate(update) {
      const { type, productId, data } = update;
      const serverResponse = data?.data || data;
      switch (type) {
        case EVENTS.WISHLIST_ADDED:
          if (productId && serverResponse) {
            const module = this._getModuleFromEvent(type);
            if (module) {
              console.log("[SyncManager] Applying incremental add for:", module, productId);
              if (serverResponse.display) {
                displayStore.set(module, productId, serverResponse.display);
              }
              const {
                display,
                success,
                count,
                message,
                result,
                load_automation_nonce,
                customer_id,
                wishlist_url,
                ...cleanData
              } = serverResponse;
              syncGateway.upsertItem(module, productId, {
                ...cleanData,
                product_id: productId,
                // Ensure product_id is explicitly set for UI reconciliation
                fromOtherTab: true
              });
              this._reloadTableIfNeeded(module);
            }
          }
          break;
        case EVENTS.WISHLIST_REMOVED:
          if (productId) {
            const module = this._getModuleFromEvent(type);
            if (module) {
              console.log("[SyncManager] Applying incremental remove for:", module, productId);
              syncGateway.removeItem(module, productId);
              this._reloadTableIfNeeded(module);
            }
          }
          break;
        // For complex operations (multi-list, list create/delete/etc), request full sync
        default:
          console.log("[SyncManager] Complex operation or multi-list update \u2014 requesting full sync");
          this._scheduleRemoteSync();
          break;
      }
    }
    /**
     * Check if the current page contains a table/wrapper for the given module
     * and reload its fragments to reflect the cross-tab change.
     *
     * This ensures that when a user adds/removes an item in Tab A,
     * the main table in Tab B (if viewing that list) is refreshed.
     */
    _reloadTableIfNeeded(module) {
      let selector = "";
      let fragmentScope = "";
      switch (module) {
        case "wishlist":
          selector = ".wlfmc-default-table";
          fragmentScope = "wishlist";
          break;
        case "waitlist":
          selector = ".wlfmc-waitlist-table";
          fragmentScope = "waitlist";
          break;
        case "saveForLater":
          selector = ".wlfmc-save-for-later-table";
          fragmentScope = "save_for_later";
          break;
        case "multiList":
          selector = ".wlfmc-multi-list-table[data-id]";
          fragmentScope = "";
          break;
      }
      if (selector && document.querySelector(selector)) {
        console.log(`[SyncManager] Table detected for ${module} \u2014 reloading fragments`);
        fragmentManager.loadFragments(fragmentScope ? { s: fragmentScope } : {});
      }
    }
    _getModuleFromEvent(eventType) {
      if (eventType.includes("wishlist")) return "wishlist";
      if (eventType.includes("waitlist")) return "waitlist";
      if (eventType.includes("multiList")) return "multiList";
      if (eventType.includes("saveForLater")) return "saveForLater";
      return null;
    }
    /* ═══════════════════════════════════════════
       Storage Event Fallback
    ════════════════════════════════════════════ */
    _handleStorageEvent(event) {
      if (this._channelAvailable) return;
      if (event.key !== STORAGE_KEYS.SYNC_DATA) return;
      if (!event.newValue) return;
      try {
        const data = JSON.parse(event.newValue);
        const sentTime = sessionStorage.getItem(STORAGE_KEYS.SYNC_DATA + "_sent");
        if (sentTime && Math.abs(parseInt(sentTime, 10) - data.timestamp) < 100) {
          return;
        }
        console.log("[SyncManager] Received storage event:", data.type);
        this._processSyncData(data);
      } catch (error) {
        console.warn("[SyncManager] Storage event error:", error);
      }
    }
    _processSyncData(data) {
      if (data.type === "cache_update") return;
      this._scheduleRemoteSync();
    }
    _scheduleRemoteSync() {
      clearTimeout(this._remoteSyncTimer);
      this._remoteSyncTimer = setTimeout(() => {
        if (queueManager.getStatus().isProcessing) {
          console.log("[SyncManager] Queue busy, rescheduling sync");
          this._scheduleRemoteSync();
          return;
        }
        this.syncAll({ remoteTriggered: true });
      }, 300);
    }
    /* ═══════════════════════════════════════════
       Server Sync (single path)
    ════════════════════════════════════════════ */
    /**
     * Synchronize with the server.
     *
     * If this tab is the leader (or no leader exists yet, or BroadcastChannel
     * is unavailable), it performs the actual HTTP request.
     * Otherwise it delegates to the leader via BroadcastChannel.
     *
     * @param {object} options
     * @param {boolean} options.remoteTriggered - Whether triggered by cross-tab signal
     * @param {boolean} options.forceLocal - Force this tab to sync locally
     */
    async syncAll(options = {}) {
      const shouldSyncLocally = !this._channelAvailable || this._isLeader || !this._leaderId || options.forceLocal;
      if (!shouldSyncLocally) {
        if (this._syncRequestPending) {
          console.log("[SyncManager] Sync request already pending");
          return;
        }
        console.log("[SyncManager] Delegating sync to leader:", this._leaderId);
        this._syncRequestPending = true;
        this._send({
          type: "request_sync",
          tabId: this._tabId,
          timestamp: Date.now()
        });
        this._syncRequestTimer = setTimeout(() => {
          if (this._syncRequestPending) {
            console.warn("[SyncManager] Sync request timeout \u2014 forcing local sync");
            this._syncRequestPending = false;
            this.syncAll({ forceLocal: true });
          }
        }, 1e4);
        return;
      }
      if (this.isSyncing) {
        console.log("[SyncManager] Sync already in progress, queueing");
        this._pendingSync = true;
        return;
      }
      this.isSyncing = true;
      eventBus.emit(EVENTS.SYNC_STARTED);
      if (this._isLeader && this._channelAvailable) {
        this._send({
          type: "sync_started",
          tabId: this._tabId,
          timestamp: Date.now()
        });
      }
      try {
        const l10n = window.wlfmc_l10n || {};
        const action = l10n.actions && l10n.actions.modern_sync || "wlfmc_modern_sync";
        const isRest = l10n.ajax_mode === "rest_api";
        const url = l10n.ajax_url;
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };
        if (isRest && l10n.nonce) {
          headers["X-WP-Nonce"] = l10n.nonce;
        }
        console.log("[SyncManager] Starting sync request");
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: new URLSearchParams({
            action,
            nonce: l10n.ajax_nonce.sync_nonce || ""
          })
        });
        const result = await response.json();
        if (result.success) {
          console.log("[SyncManager] Sync successful, applying data");
          this._applySyncData(result.data, options);
          this._lastSyncTimestamp = Date.now();
          localStorage.setItem(LAST_SYNC_KEY, String(this._lastSyncTimestamp));
          localStorage.setItem(
            STORAGE_KEYS.LANG_HASH,
            window.wlfmc_l10n?.lang || ""
          );
          if (this._isLeader && this._channelAvailable) {
            this._send({
              type: "sync_result",
              tabId: this._tabId,
              data: result.data,
              timestamp: Date.now()
            });
          }
        } else {
          throw new Error(result.data?.message || "Sync failed");
        }
      } catch (error) {
        console.warn("[SyncManager] Sync failed:", error);
        eventBus.emit(EVENTS.SYNC_FAILED, { error: error.message });
        if (this._isLeader && this._channelAvailable) {
          this._send({
            type: "sync_failed",
            tabId: this._tabId,
            error: error.message,
            timestamp: Date.now()
          });
        }
      }
      this.isSyncing = false;
      this._syncRequestPending = false;
      if (this._syncRequestTimer) {
        clearTimeout(this._syncRequestTimer);
        this._syncRequestTimer = null;
      }
      if (this._pendingSync) {
        this._pendingSync = false;
        console.log("[SyncManager] Processing queued sync");
        await this.syncAll(options);
      }
    }
    /**
     * Apply server data through the single SyncGateway.
     */
    _applySyncData(data, options = {}) {
      syncGateway.applyServerData(data, {
        remoteTriggered: !!options.remoteTriggered
      });
    }
    /* ═══════════════════════════════════════════
       Public API
    ════════════════════════════════════════════ */
    getLastSyncTime() {
      return this._lastSyncTimestamp;
    }
    get isLeader() {
      return this._isLeader;
    }
    get leaderId() {
      return this._leaderId;
    }
    /**
     * Manually trigger a sync (useful for testing/debugging)
     */
    forceSync() {
      console.log("[SyncManager] Manual sync triggered");
      this.syncAll({ forceLocal: true });
    }
    destroy() {
      clearTimeout(this._remoteSyncTimer);
      clearTimeout(this._broadcastDebounce);
      clearTimeout(this._syncRequestTimer);
      if (this._heartbeatTimer) {
        clearInterval(this._heartbeatTimer);
        this._heartbeatTimer = null;
      }
      if (this._healthCheckTimer) {
        clearInterval(this._healthCheckTimer);
        this._healthCheckTimer = null;
      }
      if (this._periodicSyncTimer) {
        clearInterval(this._periodicSyncTimer);
        this._periodicSyncTimer = null;
      }
      if (this._boundStorageHandler) {
        window.removeEventListener("storage", this._boundStorageHandler);
        this._boundStorageHandler = null;
      }
      if (this._boundVisibilityHandler) {
        document.removeEventListener("visibilitychange", this._boundVisibilityHandler);
        this._boundVisibilityHandler = null;
      }
      if (this._channel) {
        this._channel.close();
        this._channel = null;
      }
      console.log("[SyncManager] Destroyed");
    }
  };
  var syncManager = new SyncManager();

  // src/frontend/js/modern/ui/tooltip-handler.js
  var TooltipHandler = class {
    constructor() {
      this._tooltip = null;
      this._hideTimeout = null;
      this._isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      this._boundEvents = [];
      this._direction = "bottom";
      this._tType = "default";
      this._text = "";
      this._target = null;
      this._safeMargin = 8;
    }
    init() {
      this._createTooltipElement();
      this._bindEvents();
    }
    _createTooltipElement() {
      const old = document.getElementById("wlfmc-tooltip");
      if (old) old.remove();
      this._tooltip = document.createElement("div");
      this._tooltip.id = "wlfmc-tooltip";
      this._tooltip.className = "tooltip__hidden";
      this._tooltip.style.position = "absolute";
      this._tooltip.style.zIndex = "999999";
      document.body.appendChild(this._tooltip);
    }
    _bindEvents() {
      const self = this;
      const getSafeTarget = (target) => {
        if (!target || !(target instanceof Element)) return null;
        return target;
      };
      const onMouseEnter = (e) => {
        const safeTarget = getSafeTarget(e.target);
        if (!safeTarget) return;
        const target = safeTarget.closest(".wlfmc-tooltip");
        if (!target) return;
        self._target = target;
        self._tType = target.dataset.tooltipType || "default";
        self._text = target.dataset.tooltipText || "";
        if (!self._text) return;
        const cachedDir = target._wlfmcTooltipDirection;
        if (cachedDir) {
          self._direction = cachedDir;
        } else {
          const dirClass = Array.from(target.classList).find((c) => c.startsWith("wlfmc-tooltip-"));
          self._direction = dirClass ? dirClass.split("-").pop() : "bottom";
        }
        if (e.type === "touchstart") e.preventDefault();
        if (self._hideTimeout) {
          clearTimeout(self._hideTimeout);
          self._hideTimeout = null;
        }
        self._positionAndShowTooltip(target);
      };
      const onMouseLeave = (e) => {
        const safeTarget = getSafeTarget(e.target);
        if (e.type === "touchend" && self._isTouchDevice) {
          self._hideTimeout = setTimeout(() => self._hideTooltip(), 1e3);
        } else if (e.type === "mouseleave") {
          self._hideTooltip();
        }
      };
      const onClickOutside = (e) => {
        const safeTarget = getSafeTarget(e.target);
        if (!safeTarget) return;
        if (!safeTarget.closest(".wlfmc-tooltip") && safeTarget !== self._tooltip) {
          self._hideTooltip();
        }
      };
      document.addEventListener("mouseenter", onMouseEnter, true);
      document.addEventListener("mouseleave", onMouseLeave, true);
      if (this._isTouchDevice) {
        document.addEventListener("touchstart", onMouseEnter, { passive: false });
        document.addEventListener("touchend", onMouseLeave, { passive: false });
      }
      document.addEventListener("touchstart", onClickOutside);
      document.addEventListener("click", onClickOutside);
      this._boundEvents = [
        { event: "mouseenter", handler: onMouseEnter, options: true },
        { event: "mouseleave", handler: onMouseLeave, options: true },
        { event: "touchstart", handler: onMouseEnter, options: { passive: false } },
        { event: "touchend", handler: onMouseLeave, options: { passive: false } },
        { event: "touchstart", handler: onClickOutside, options: void 0 },
        { event: "click", handler: onClickOutside, options: void 0 }
      ];
    }
    /**
     * Core positioning logic with intelligent fallback.
     * Calculates available space and picks the best fitting position.
     */
    _positionAndShowTooltip(target) {
      if (!this._tooltip || !target) return;
      this._tooltip.innerHTML = this._text;
      this._tooltip.className = `tooltip__expanded wlfmc-tooltip-${this._tType}`;
      this._tooltip.style.visibility = "hidden";
      this._tooltip.style.display = "block";
      this._tooltip.style.top = "-9999px";
      this._tooltip.style.left = "-9999px";
      void this._tooltip.offsetWidth;
      const tipRect = this._tooltip.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      const gap = 7;
      const positions = {
        top: {
          x: targetRect.left + targetRect.width / 2 - tipRect.width / 2,
          y: targetRect.top - tipRect.height - gap
        },
        bottom: {
          x: targetRect.left + targetRect.width / 2 - tipRect.width / 2,
          y: targetRect.bottom + gap
        },
        left: {
          x: targetRect.left - tipRect.width - gap,
          y: targetRect.top + targetRect.height / 2 - tipRect.height / 2
        },
        right: {
          x: targetRect.right + gap,
          y: targetRect.top + targetRect.height / 2 - tipRect.height / 2
        }
      };
      const fits = (pos) => {
        return pos.x >= this._safeMargin && pos.x + tipRect.width <= winWidth - this._safeMargin && pos.y >= this._safeMargin && pos.y + tipRect.height <= winHeight - this._safeMargin;
      };
      let finalPos = null;
      let finalDir = this._direction;
      if (fits(positions[this._direction])) {
        finalPos = positions[this._direction];
      } else {
        const fallbackOrder = ["top", "bottom", "left", "right"].filter((d) => d !== this._direction);
        for (const dir of fallbackOrder) {
          if (fits(positions[dir])) {
            finalPos = positions[dir];
            finalDir = dir;
            break;
          }
        }
        if (!finalPos) {
          let maxVisibleArea = -1;
          let bestFallbackDir = this._direction;
          Object.entries(positions).forEach(([dir, pos]) => {
            const visibleX = Math.min(pos.x + tipRect.width, winWidth) - Math.max(pos.x, 0);
            const visibleY = Math.min(pos.y + tipRect.height, winHeight) - Math.max(pos.y, 0);
            const area = visibleX * visibleY;
            if (area > maxVisibleArea) {
              maxVisibleArea = area;
              bestFallbackDir = dir;
            }
          });
          finalPos = positions[bestFallbackDir];
          finalDir = bestFallbackDir;
        }
      }
      finalPos.x = Math.max(this._safeMargin, Math.min(finalPos.x, winWidth - tipRect.width - this._safeMargin));
      finalPos.y = Math.max(this._safeMargin, Math.min(finalPos.y, winHeight - tipRect.height - this._safeMargin));
      this._tooltip.style.left = `${finalPos.x + window.scrollX}px`;
      this._tooltip.style.top = `${finalPos.y + window.scrollY}px`;
      this._tooltip.style.visibility = "visible";
      this._tooltip.classList.remove("tooltip__expanded-top", "tooltip__expanded-bottom", "tooltip__expanded-left", "tooltip__expanded-right");
      this._tooltip.classList.add(`tooltip__expanded-${finalDir}`);
      target._wlfmcTooltipDirection = finalDir;
    }
    _showTooltip() {
      if (this._target) {
        this._positionAndShowTooltip(this._target);
      }
    }
    _hideTooltip() {
      if (!this._tooltip) return;
      if (this._hideTimeout) {
        clearTimeout(this._hideTimeout);
        this._hideTimeout = null;
      }
      this._tooltip.style.top = "0";
      this._tooltip.style.left = "0";
      this._tooltip.className = "tooltip__hidden";
      this._tooltip.style.display = "";
      this._tooltip.style.visibility = "";
    }
    destroy() {
      this._boundEvents.forEach(({ event, handler, options }) => {
        document.removeEventListener(event, handler, options);
      });
      this._boundEvents = [];
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    }
  };

  // src/frontend/js/modern/ui/dropdown-handler.js
  var DropdownHandler = class {
    constructor() {
      this._timeout = null;
      this._isTouchDevice = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
      this._boundEvents = [];
      this._swipeTrigger = false;
      this._hideTimers = /* @__PURE__ */ new Map();
      this._hoverIntentTimers = /* @__PURE__ */ new Map();
      this._hoverIntentOver = /* @__PURE__ */ new Map();
    }
    init() {
      if (this._isTouchDevice) {
        this._bindTouchEvents();
      } else {
        this._bindDesktopEvents();
      }
      this._bindScrollResize();
    }
    _bindTouchEvents() {
      const onTouchStart = (e) => {
        const wrapper = e.target.closest(".wlfmc-counter-wrapper.show-list-on-hover, .wlfmc-counter-wrapper.show-list-on-click");
        if (wrapper) {
          this._swipeTrigger = false;
        }
      };
      const onTouchMove = (e) => {
        const wrapper = e.target.closest(".wlfmc-counter-wrapper.show-list-on-hover, .wlfmc-counter-wrapper.show-list-on-click");
        if (wrapper) {
          this._swipeTrigger = true;
        }
      };
      const onTouchEnd = (e) => {
        const link = e.target.closest(".wlfmc-counter-wrapper .wlfmc-counter.has-dropdown a:not(.remove_from_wishlist)");
        if (link) {
          e.stopImmediatePropagation();
          e.preventDefault();
          window.location.href = link.getAttribute("href");
          return;
        }
        const counterWrapper = e.target.closest(".wlfmc-counter-wrapper");
        if (!counterWrapper) {
          this._hideAllDropdowns();
          return;
        }
        const trigger = e.target.closest(
          ".wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter.has-dropdown, .wlfmc-counter-wrapper.show-list-on-click .wlfmc-counter.has-dropdown"
        );
        if (!trigger) return;
        const wrapper = trigger.closest(".wlfmc-counter-wrapper");
        const dropdown = wrapper.querySelector(".wlfmc-counter-dropdown");
        if (!dropdown) return;
        if (wrapper.classList.contains("wlfmc-first-touch")) {
          if (!this._swipeTrigger) {
            this._hideAllDropdowns();
          }
        } else {
          e.stopImmediatePropagation();
          e.preventDefault();
          this._showDropdown(dropdown, wrapper);
          wrapper.classList.add("wlfmc-first-touch");
        }
      };
      document.addEventListener("touchstart", onTouchStart, { passive: true });
      document.addEventListener("touchmove", onTouchMove, { passive: true });
      document.addEventListener("touchend", onTouchEnd, { passive: false });
      this._boundEvents.push(
        { target: document, event: "touchstart", handler: onTouchStart, options: { passive: true } },
        { target: document, event: "touchmove", handler: onTouchMove, options: { passive: true } },
        { target: document, event: "touchend", handler: onTouchEnd, options: { passive: false } }
      );
    }
    _bindDesktopEvents() {
      const HOVER_INTENT_DELAY = 100;
      const onClick = (e) => {
        const trigger = e.target.closest(".wlfmc-counter-wrapper.show-list-on-click .wlfmc-counter.has-dropdown");
        if (trigger) {
          e.stopImmediatePropagation();
          e.preventDefault();
          const wrapper = trigger.closest(".wlfmc-counter-wrapper");
          const dropdown = this._getDropdown(trigger, wrapper);
          if (dropdown) {
            this._toggleDropdown(dropdown, wrapper);
          }
          return false;
        }
        if (!e.target.closest(".wlfmc-counter-dropdown") && !e.target.closest(".wlfmc-counter.has-dropdown")) {
          this._hideAllDropdowns();
        }
      };
      const onMouseOver = (e) => {
        const trigger = e.target.closest(".wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter.has-dropdown");
        if (trigger) {
          const wrapper = trigger.closest(".wlfmc-counter-wrapper");
          const dataId = wrapper.dataset.id || trigger.getAttribute("data-id") || "default";
          if (this._hideTimers.has(dataId)) {
            clearTimeout(this._hideTimers.get(dataId));
            this._hideTimers.delete(dataId);
          }
          if (!this._hoverIntentOver.has(dataId)) {
            if (this._hoverIntentTimers.has(dataId)) {
              clearTimeout(this._hoverIntentTimers.get(dataId));
            }
            const timer = setTimeout(() => {
              this._hoverIntentOver.set(dataId, true);
              const dropdown = this._getDropdown(trigger, wrapper);
              if (dropdown) this._showDropdown(dropdown, wrapper);
              this._hoverIntentTimers.delete(dataId);
            }, HOVER_INTENT_DELAY);
            this._hoverIntentTimers.set(dataId, timer);
          }
          return;
        }
        const dd = e.target.closest(".wlfmc-counter-dropdown");
        if (dd) {
          const wrapper = this._findWrapperForDropdown(dd);
          if (wrapper && wrapper.classList.contains("show-list-on-hover")) {
            const dataId = wrapper.dataset.id || "default";
            if (this._hideTimers.has(dataId)) {
              clearTimeout(this._hideTimers.get(dataId));
              this._hideTimers.delete(dataId);
            }
          }
        }
      };
      const onMouseOut = (e) => {
        const dd = e.target.closest(".wlfmc-counter-dropdown");
        const trigger = e.target.closest(".wlfmc-counter-wrapper.show-list-on-hover .wlfmc-counter.has-dropdown");
        let wrapper = null;
        let dropdown = null;
        if (dd) {
          wrapper = this._findWrapperForDropdown(dd);
          dropdown = dd;
        } else if (trigger) {
          wrapper = trigger.closest(".wlfmc-counter-wrapper");
          dropdown = this._getDropdown(trigger, wrapper);
        }
        if (!wrapper || !dropdown || !wrapper.classList.contains("show-list-on-hover")) return;
        if (e.relatedTarget && (dd?.contains(e.relatedTarget) || wrapper.contains(e.relatedTarget))) return;
        const dataId = wrapper.dataset.id || "default";
        this._hoverIntentOver.delete(dataId);
        this._hideDropdown(dropdown, wrapper, HOVER_INTENT_DELAY);
      };
      document.addEventListener("click", onClick);
      document.addEventListener("mouseover", onMouseOver);
      document.addEventListener("mouseout", onMouseOut);
      this._boundEvents.push(
        { target: document, event: "click", handler: onClick },
        { target: document, event: "mouseover", handler: onMouseOver },
        { target: document, event: "mouseout", handler: onMouseOut }
      );
    }
    /**
     * Reposition visible dropdowns on scroll and window resize.
     * Only currently visible (.lists-show) dropdowns are recalculated
     * to avoid unnecessary layout reads on hidden elements.
     */
    _bindScrollResize() {
      const onScrollResize = () => {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
          document.querySelectorAll(".wlfmc-counter-dropdown.lists-show").forEach((dd) => {
            this._preparePosition(dd);
          });
        }, 50);
      };
      window.addEventListener("scroll", onScrollResize, { passive: true });
      window.addEventListener("resize", onScrollResize, { passive: true });
      this._boundEvents.push(
        { target: window, event: "scroll", handler: onScrollResize },
        { target: window, event: "resize", handler: onScrollResize }
      );
    }
    _getDropdown(trigger, wrapper) {
      const innerDropdown = wrapper?.querySelector(".wlfmc-counter-dropdown");
      if (innerDropdown) {
        const dataId2 = wrapper.dataset.id || trigger?.getAttribute("data-id");
        if (dataId2) {
          document.querySelectorAll(`.dropdown_${dataId2}`).forEach((el) => {
            if (el !== innerDropdown && !el.closest(".wlfmc-counter-wrapper")) {
              el.remove();
            }
          });
        }
        return innerDropdown;
      }
      const dataId = trigger?.getAttribute("data-id") || wrapper?.dataset.id;
      if (dataId) {
        return document.querySelector(`.dropdown_${dataId}`);
      }
      return null;
    }
    /**
     * Resolve the counter wrapper that owns a given dropdown.
     * Checks data-id first (works for body-appended fixed dropdowns),
     * then falls back to closest wrapper ancestor (inline dropdowns).
     */
    _findWrapperForDropdown(dd) {
      if (dd.dataset.id) {
        const wrapper = document.querySelector(`.wlfmc-counter-wrapper[data-id="${dd.dataset.id}"]`);
        if (wrapper) return wrapper;
      }
      return dd.closest(".wlfmc-counter-wrapper");
    }
    _hideAllDropdowns() {
      this._hideTimers.forEach((timer) => clearTimeout(timer));
      this._hideTimers.clear();
      this._hoverIntentTimers.forEach((timer) => clearTimeout(timer));
      this._hoverIntentTimers.clear();
      document.querySelectorAll(".wlfmc-counter-dropdown.lists-show").forEach((dd) => {
        dd.classList.remove("lists-show");
      });
      document.querySelectorAll(".wlfmc-first-touch").forEach((el) => el.classList.remove("wlfmc-first-touch"));
      document.querySelectorAll(".wlfmc-first-click").forEach((el) => el.classList.remove("wlfmc-first-click"));
    }
    _toggleDropdown(dropdown, wrapper) {
      if (dropdown.classList.contains("lists-show")) {
        this._hideDropdown(dropdown, wrapper);
      } else {
        this._showDropdown(dropdown, wrapper);
      }
    }
    _showDropdown(dropdown, wrapper) {
      if (!dropdown) return;
      const id = wrapper?.dataset.id || dropdown.dataset.id || "";
      if (this._hideTimers.has(id)) {
        clearTimeout(this._hideTimers.get(id));
        this._hideTimers.delete(id);
      }
      if (this._hoverIntentTimers.has(id)) {
        clearTimeout(this._hoverIntentTimers.get(id));
        this._hoverIntentTimers.delete(id);
      }
      if (dropdown.classList.contains("lists-show")) {
        this._preparePosition(dropdown);
        return;
      }
      this._hideAllDropdowns();
      if (dropdown.dataset.positionMode === "fixed" || wrapper?.querySelector(".position-fixed")) {
        this._appendToBody(dropdown, wrapper);
      }
      this._preparePosition(dropdown);
      dropdown.classList.add("lists-show");
    }
    _hideDropdown(dropdown, wrapper = null, delay = 0) {
      if (!dropdown) return;
      const id = wrapper?.dataset.id || dropdown.dataset.id || "";
      if (this._hideTimers.has(id)) {
        clearTimeout(this._hideTimers.get(id));
        this._hideTimers.delete(id);
      }
      if (delay > 0) {
        const timer = setTimeout(() => {
          dropdown.classList.remove("lists-show");
          document.querySelectorAll(".wlfmc-first-touch").forEach((el) => el.classList.remove("wlfmc-first-touch"));
          document.querySelectorAll(".wlfmc-first-click").forEach((el) => el.classList.remove("wlfmc-first-click"));
          this._hideTimers.delete(id);
        }, delay);
        this._hideTimers.set(id, timer);
      } else {
        dropdown.classList.remove("lists-show");
      }
    }
    _appendToBody(dropdown, wrapper) {
      if (dropdown.parentElement === document.body) return;
      const counterType = wrapper.classList.contains("wlfmc-lists-counter-wrapper") ? "wlfmc-premium-list-counter" : wrapper.classList.contains("wlfmc-waitlist-counter-wrapper") ? "wlfmc-waitlist-counter" : "wlfmc-wishlist-counter";
      const elementorWidget = wrapper.closest(".elementor-widget");
      if (elementorWidget) {
        const widgetId = elementorWidget.dataset.id || elementorWidget.id;
        const elementorId = elementorWidget.closest("[data-elementor-id]")?.dataset.elementorId || "";
        let container = document.querySelector(`.wlfmc-elementor.elementor-${elementorId}`);
        if (!container) {
          container = document.createElement("div");
          container.className = `wlfmc-elementor elementor elementor-${elementorId} ${counterType}`;
          document.body.appendChild(container);
        }
        let inner = container.querySelector(`.elementor-element-${widgetId}`);
        if (!inner) {
          inner = document.createElement("div");
          inner.className = `elementor-element elementor-element-${widgetId}`;
          container.appendChild(inner);
        }
        inner.appendChild(dropdown);
      } else {
        const widgetId = wrapper.querySelector(".wlfmc-counter-items")?.dataset.id || "default";
        let container = document.querySelector(`.wlfmc-elementor.no-elementor-${widgetId}`);
        if (!container) {
          container = document.createElement("div");
          container.className = `wlfmc-elementor no-elementor-${widgetId} ${counterType}`;
          document.body.appendChild(container);
        }
        container.appendChild(dropdown);
      }
    }
    /**
     * Master position dispatcher.
     * Delegates to the appropriate strategy based on the positioning mode
     * so that scroll/resize recalculations always use correct coordinates.
     */
    _preparePosition(dropdown) {
      const wrapper = this._findWrapperForDropdown(dropdown);
      if (!wrapper) return;
      if (dropdown.classList.contains("position-absolute")) {
        this._positionAbsolute(dropdown, wrapper);
      } else {
        this._positionFixed(dropdown, wrapper);
      }
    }
    /**
     * Fixed-mode positioning.
     * The dropdown is detached to <body>, so its coordinates are
     * viewport-relative. On every call we read the trigger's current
     * getBoundingClientRect() so the dropdown tracks the trigger through
     * page scroll and window resize.
     */
    _positionFixed(dropdown, wrapper) {
      const triggerRect = wrapper.getBoundingClientRect();
      const ddWidth = dropdown.offsetWidth;
      const ddHeight = dropdown.offsetHeight;
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      const margin = 10;
      let left = triggerRect.left;
      let top = triggerRect.bottom;
      if (left + ddWidth > winWidth - margin) {
        left = Math.max(margin, winWidth - ddWidth - margin);
      }
      if (left < margin) {
        left = margin;
      }
      if (top + ddHeight > winHeight - margin && triggerRect.top - ddHeight > margin) {
        top = triggerRect.top - ddHeight;
      }
      dropdown.style.left = left + "px";
      dropdown.style.top = top + "px";
    }
    /**
     * Absolute-mode positioning.
     * The dropdown lives inside its wrapper, so the base position is relative
     * to the wrapper and naturally scrolls with it. We first clear any
     * previously computed inline offsets to read the CSS-defined natural
     * position, then apply viewport-overflow clamping.
     *
     * This avoids the accumulation bug where getComputedStyle values from a
     * previous run were fed back into the next calculation.
     */
    _positionAbsolute(dropdown, wrapper) {
      dropdown.style.left = "";
      dropdown.style.top = "";
      const naturalLeft = dropdown.offsetLeft;
      const naturalTop = dropdown.offsetTop;
      const ddRect = dropdown.getBoundingClientRect();
      const winWidth = window.innerWidth;
      const docHeight = document.documentElement.scrollHeight;
      const margin = 50;
      let left = naturalLeft;
      let top = naturalTop;
      if (ddRect.right > winWidth - margin) {
        left -= ddRect.right - winWidth + margin;
      }
      if (ddRect.left + (left - naturalLeft) < margin) {
        left = naturalLeft + (margin - ddRect.left);
      }
      if (docHeight < ddRect.height) {
        dropdown.style.height = docHeight - margin + "px";
        dropdown.style.overflowY = "auto";
        top = 0;
      } else if (ddRect.bottom > docHeight - margin) {
        top -= ddRect.bottom - docHeight + margin;
      }
      dropdown.style.left = left + "px";
      dropdown.style.top = top + "px";
    }
    destroy() {
      this._boundEvents.forEach(({ target, event, handler, options }) => {
        target.removeEventListener(event, handler, options);
      });
      this._boundEvents = [];
      this._hideTimers.forEach((timer) => clearTimeout(timer));
      this._hideTimers.clear();
      this._hoverIntentTimers.forEach((timer) => clearTimeout(timer));
      this._hoverIntentTimers.clear();
    }
  };

  // src/frontend/js/modern/lib/popup-lite.js
  var popupInstances = /* @__PURE__ */ new Map();
  var visiblePopupStack = [];
  var _cachedMaxZ = null;
  var _cachedMaxZTime = 0;
  var Z_INDEX_CACHE_TTL = 5e3;
  var FOCUSABLE_SELECTORS = [
    "a[href]",
    "area[href]",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "iframe",
    "object",
    "embed",
    "*[tabindex]",
    "*[contenteditable]"
  ].join(", ");
  var scrollbarWidth = null;
  function getScrollbarWidth() {
    if (scrollbarWidth !== null) return scrollbarWidth;
    const parent = document.createElement("div");
    parent.style.cssText = "width:50px;height:50px;overflow:auto;position:absolute;top:-9999px;left:-9999px;";
    const child = document.createElement("div");
    parent.appendChild(child);
    document.body.appendChild(parent);
    scrollbarWidth = parent.offsetWidth - child.offsetWidth;
    document.body.removeChild(parent);
    return scrollbarWidth;
  }
  function getDefaultOptions(popup) {
    return {
      absolute: false,
      color: "#333",
      opacity: "0.5",
      transition: "all 0.3s",
      horizontal: popup.dataset.horizontal || "center",
      vertical: popup.dataset.vertical || "middle",
      scrolllock: true,
      background: true,
      escape: true,
      blur: true,
      keepfocus: true,
      focuselement: null,
      focusdelay: 50,
      onclose: null,
      onopen: null,
      beforeopen: null
    };
  }
  function updateBodyState() {
    const visibleCount = [...popupInstances.values()].filter((inst) => inst.visible).length;
    if (visibleCount > 0) {
      document.body.classList.add("wlfmc-with-popup");
      document.documentElement.classList.add("popup_visible");
      const scrollLockNeeded = [...popupInstances.values()].some((inst) => inst.visible && inst.options.scrolllock);
      if (scrollLockNeeded) {
        const hasScrollableBody = document.body.scrollHeight > window.innerHeight;
        if (hasScrollableBody) {
          const sbw = getScrollbarWidth();
          const currentMarginRight = parseInt(getComputedStyle(document.body).marginRight, 10) || 0;
          document.body.style.marginRight = currentMarginRight + sbw + "px";
        }
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.classList.remove("wlfmc-with-popup");
      document.documentElement.classList.remove("popup_visible");
      document.body.style.overflow = "";
      document.body.style.marginRight = "";
    }
  }
  function trapFocus(popup, event) {
    if (event.key !== "Tab" && event.keyCode !== 9) return;
    if (!popup) return;
    const focusableItems = Array.from(popup.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
      (el) => el.offsetParent !== null
    );
    if (focusableItems.length === 0) {
      event.preventDefault();
      popup.focus();
      return;
    }
    const focusedItem = document.activeElement;
    const focusedIndex = focusableItems.indexOf(focusedItem);
    if (event.shiftKey) {
      if (focusedIndex === 0 || focusedIndex === -1) {
        event.preventDefault();
        focusableItems[focusableItems.length - 1].focus();
      }
    } else {
      if (focusedIndex === focusableItems.length - 1 || focusedIndex === -1) {
        event.preventDefault();
        focusableItems[0].focus();
      }
    }
  }
  function applyAriaAttributes(popup, visible) {
    popup.setAttribute("aria-hidden", String(!visible));
    popup.setAttribute("role", "dialog");
    if (visible) {
      popup.setAttribute("aria-modal", "true");
    } else {
      popup.removeAttribute("aria-modal");
    }
    if (!popup.getAttribute("aria-label") && !popup.getAttribute("aria-labelledby")) {
      const title = popup.querySelector(".wlfmc-popup-title");
      if (title) {
        if (!title.id) {
          title.id = popup.id + "_title";
        }
        popup.setAttribute("aria-labelledby", title.id);
      } else {
        popup.setAttribute("aria-label", "Popup dialog");
      }
    }
  }
  function calculateMaxZIndex() {
    const now = Date.now();
    if (_cachedMaxZ !== null && now - _cachedMaxZTime < Z_INDEX_CACHE_TTL) {
      return _cachedMaxZ;
    }
    let maxZ = 0;
    const candidates = document.querySelectorAll(
      '[style*="z-index"], .wlfmc-popup, .popup_wrapper, [class*="modal"], [class*="overlay"], [class*="dropdown"]'
    );
    for (const el of candidates) {
      const z = getComputedStyle(el).zIndex;
      if (z !== "auto") {
        const zInt = parseInt(z, 10);
        if (!isNaN(zInt) && zInt > maxZ) {
          maxZ = zInt;
        }
      }
    }
    _cachedMaxZ = maxZ;
    _cachedMaxZTime = now;
    return maxZ;
  }
  function getOrCreate(popup, options = {}) {
    const id = popup.id;
    if (!id) return null;
    if (popupInstances.has(id)) {
      const existing = popupInstances.get(id);
      if (Object.keys(options).length > 0) {
        existing.options = { ...existing.options, ...options };
      }
      return existing;
    }
    const existingWrapper = document.getElementById(`${id}_wrapper`);
    if (existingWrapper) {
      const instance2 = {
        id,
        popup,
        wrapper: existingWrapper,
        background: document.getElementById(`${id}_background`),
        options: { ...getDefaultOptions(popup), ...options },
        visible: false,
        focusedElementBefore: null
      };
      popupInstances.set(id, instance2);
      applyAriaAttributes(popup, false);
      return instance2;
    }
    const mergedOptions = { ...getDefaultOptions(popup), ...options };
    const useAutoZ = mergedOptions.autozindex === true;
    const maxZ = useAutoZ ? calculateMaxZIndex() : 0;
    const bgZ = useAutoZ ? maxZ + 1 : 1e5;
    const wrapperZ = useAutoZ ? maxZ + 2 : 100001;
    const background = document.createElement("div");
    background.id = `${id}_background`;
    background.className = "popup_background wlfmc-overlay";
    background.style.cssText = [
      "opacity:0",
      "visibility:hidden",
      `background-color:${mergedOptions.color}`,
      "position:fixed",
      "top:0",
      "right:0",
      "bottom:0",
      "left:0",
      `z-index:${bgZ}`
    ].join(";");
    if (mergedOptions.transition) background.style.transition = mergedOptions.transition;
    const iOS = /(iPad|iPhone|iPod)/.test(navigator.userAgent);
    if (iOS) {
      background.style.cursor = "pointer";
    }
    const wrapper = document.createElement("div");
    wrapper.id = `${id}_wrapper`;
    wrapper.className = "popup_wrapper";
    wrapper.style.cssText = [
      "opacity:0",
      "visibility:hidden",
      "position:fixed",
      "width:100%",
      "height:100%",
      "top:0",
      "left:0",
      `text-align:${mergedOptions.horizontal}`,
      "overflow:auto",
      `z-index:${wrapperZ}`
    ].join(";");
    if (mergedOptions.transition) wrapper.style.transition = mergedOptions.transition;
    const align = document.createElement("div");
    align.className = "popup_align";
    align.style.cssText = "display:inline-block;vertical-align:middle;height:100%;";
    wrapper.appendChild(align);
    popup.classList.add("popup_content");
    popup.style.verticalAlign = mergedOptions.vertical;
    popup.style.position = "relative";
    popup.style.textAlign = "left";
    if (mergedOptions.transition) popup.style.transition = mergedOptions.transition;
    popup.style.outline = "none";
    wrapper.appendChild(popup);
    document.body.appendChild(background);
    document.body.appendChild(wrapper);
    applyAriaAttributes(popup, false);
    const instance = {
      id,
      popup,
      wrapper,
      background,
      options: mergedOptions,
      visible: false,
      focusedElementBefore: null
    };
    popupInstances.set(id, instance);
    return instance;
  }
  function showPopup(popup) {
    const id = popup.id;
    if (!id) return;
    if (!popupInstances.has(id)) {
      getOrCreate(popup);
    }
    const instance = popupInstances.get(id);
    if (!instance || instance.visible) return;
    const { wrapper, background, options } = instance;
    if (typeof options.beforeopen === "function") {
      options.beforeopen.call(popup);
    }
    instance.focusedElementBefore = document.activeElement;
    document.documentElement.classList.add("popup_visible", `popup_visible_${id}`);
    wrapper.classList.add("popup_wrapper_visible");
    setTimeout(() => {
      wrapper.style.visibility = "visible";
      wrapper.style.opacity = "1";
      background.style.visibility = "visible";
      background.style.opacity = options.opacity || "0.5";
    }, 20);
    if (options.transition) {
      const onTransitionEnd = () => {
        wrapper.removeEventListener("transitionend", onTransitionEnd);
        if (typeof options.opentransitionend === "function") {
          options.opentransitionend.call(popup);
        }
      };
      wrapper.addEventListener("transitionend", onTransitionEnd);
    } else {
      if (typeof options.opentransitionend === "function") {
        options.opentransitionend.call(popup);
      }
    }
    if (options.blur) {
      background.onclick = () => hidePopup(popup);
    }
    if (options.escape) {
      instance._escHandler = (e) => {
        if ((e.key === "Escape" || e.keyCode === 27) && visiblePopupStack[visiblePopupStack.length - 1] === id) {
          hidePopup(popup);
        }
      };
      document.addEventListener("keydown", instance._escHandler);
    }
    if (options.keepfocus) {
      instance._focusTrapHandler = (e) => {
        if (visiblePopupStack[visiblePopupStack.length - 1] === id) {
          trapFocus(popup, e);
        }
      };
      document.addEventListener("keydown", instance._focusTrapHandler);
      popup.setAttribute("tabindex", "-1");
      setTimeout(() => {
        if (options.focuselement === "closebutton") {
          const closeBtn = popup.querySelector(".wlfmc-popup-close:first-of-type");
          if (closeBtn) closeBtn.focus();
        } else if (options.focuselement) {
          const target = document.querySelector(options.focuselement);
          if (target) target.focus();
        } else {
          popup.focus();
        }
      }, options.focusdelay || 50);
    }
    applyAriaAttributes(popup, true);
    visiblePopupStack.push(id);
    instance.visible = true;
    updateBodyState();
    if (typeof options.onopen === "function") {
      options.onopen.call(popup);
    }
  }
  function hidePopup(popup) {
    const id = popup.id;
    const instance = popupInstances.get(id);
    if (!instance || !instance.visible) return;
    const { wrapper, background, options } = instance;
    document.documentElement.classList.remove(`popup_visible_${id}`);
    wrapper.classList.remove("popup_wrapper_visible");
    wrapper.style.visibility = "hidden";
    wrapper.style.opacity = "0";
    background.style.visibility = "hidden";
    background.style.opacity = "0";
    if (instance._escHandler) {
      document.removeEventListener("keydown", instance._escHandler);
      instance._escHandler = null;
    }
    if (instance._focusTrapHandler) {
      document.removeEventListener("keydown", instance._focusTrapHandler);
      instance._focusTrapHandler = null;
    }
    background.onclick = null;
    applyAriaAttributes(popup, false);
    if (options.keepfocus && instance.focusedElementBefore) {
      const el = instance.focusedElementBefore;
      if (el && el.offsetParent !== null) {
        el.focus();
      }
    }
    instance.focusedElementBefore = null;
    const idx = visiblePopupStack.indexOf(id);
    if (idx > -1) visiblePopupStack.splice(idx, 1);
    instance.visible = false;
    updateBodyState();
    if (typeof options.onclose === "function") {
      const fn = options.onclose;
      options.onclose = null;
      fn.call(popup);
    }
  }
  function hideAllPopups() {
    const visible = [...popupInstances.values()].filter((inst) => inst.visible);
    visible.reverse().forEach((inst) => hidePopup(inst.popup));
  }
  function isPopupVisible(popup) {
    const instance = popupInstances.get(popup.id);
    return instance ? instance.visible : false;
  }
  function destroyPopup(popup) {
    const id = popup.id;
    if (!id) return;
    const instance = popupInstances.get(id);
    if (instance && instance.visible) {
      hidePopup(popup);
    }
    const wrapper = document.getElementById(`${id}_wrapper`);
    const background = document.getElementById(`${id}_background`);
    if (wrapper && wrapper.contains(popup)) {
      wrapper.removeChild(popup);
    }
    wrapper?.remove();
    background?.remove();
    popupInstances.delete(id);
    const idx = visiblePopupStack.indexOf(id);
    if (idx > -1) visiblePopupStack.splice(idx, 1);
    updateBodyState();
  }

  // src/frontend/js/modern/ui/popup-handler.js
  var PopupHandler = class {
    constructor() {
      this._boundEvents = [];
    }
    init() {
      this._bindPopupClose();
      this._bindPopupFormSubmit();
    }
    _bindPopupClose() {
      const onClick = (e) => {
        const closeBtn = e.target.closest(".wlfmc-popup-close");
        if (!closeBtn) return;
        e.preventDefault();
        e.stopPropagation();
        const popupId = closeBtn.dataset.popupId;
        if (!popupId) return;
        const popup = document.getElementById(popupId);
        if (!popup) return;
        hidePopup(popup);
      };
      document.addEventListener("click", onClick, true);
      this._boundEvents.push({ event: "click", handler: onClick, options: true });
    }
    _bindPopupFormSubmit() {
      const onSubmit = (e) => {
        if (e.target.closest(".wlfmc-popup-form")) {
          e.preventDefault();
          return false;
        }
      };
      document.addEventListener("submit", onSubmit, true);
      this._boundEvents.push({ event: "submit", handler: onSubmit, options: true });
    }
    destroy() {
      this._boundEvents.forEach(({ event, handler, options }) => {
        document.removeEventListener(event, handler, options);
      });
      this._boundEvents = [];
    }
  };

  // src/frontend/js/modern/lib/sortable-lite.js
  var SortableLite = class {
    constructor(container, options = {}) {
      this.container = container;
      this.options = {
        items: "[data-row-id]",
        handle: ".sortable-handle",
        placeholderClass: "ui-sortable-placeholder",
        scrollSensitivity: 40,
        dragStartDistance: 5,
        dropAnimationMs: 100,
        update: null,
        ...options
      };
      this._pendingItem = null;
      this._dragging = null;
      this._placeholder = null;
      this._helperWrapper = null;
      this._started = false;
      this._startX = 0;
      this._startY = 0;
      this._offsetX = 0;
      this._offsetY = 0;
      this._currentX = 0;
      this._currentY = 0;
      this._onMouseDown = this._onMouseDown.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
      this._init();
    }
    _init() {
      this.container.addEventListener("mousedown", this._onMouseDown);
      this.container.style.userSelect = "none";
    }
    _getItems() {
      return Array.from(this.container.querySelectorAll(this.options.items));
    }
    /**
     * Detect the view-mode class from the parent table.
     */
    _getViewModeClass() {
      const table = this.container.closest(".wlfmc-wishlist-table, .wlfmc-save-for-later-table");
      if (table && table.classList.contains("view-mode-grid")) return "view-mode-grid";
      return "view-mode-list";
    }
    /**
     * Build the floating helper as a mini-table that reuses the original
     * table's view-mode classes. All existing CSS applies automatically.
     */
    _createHelper(item) {
      const rect = item.getBoundingClientRect();
      const viewModeClass = this._getViewModeClass();
      const wrapper = document.createElement("div");
      wrapper.className = "wlfmc-sortable-helper";
      wrapper.style.width = rect.width + "px";
      wrapper.style.top = rect.top + "px";
      wrapper.style.left = rect.left + "px";
      const miniTable = document.createElement("table");
      miniTable.className = "wlfmc-wishlist-table  wlfmc-list " + viewModeClass;
      miniTable.style.borderSpacing = "0";
      miniTable.style.margin = "0";
      miniTable.style.width = "100%";
      miniTable.style.tableLayout = "fixed";
      const tbody = document.createElement("tbody");
      tbody.className = "wishlist-items-wrapper";
      const clone = item.cloneNode(true);
      clone.classList.remove("show-meta-data", "ui-sortable-helper");
      clone.removeAttribute("style");
      const srcCells = item.querySelectorAll("td");
      const handleCell = clone.querySelector("td.sortable-handle");
      if (handleCell) handleCell.remove();
      tbody.appendChild(clone);
      miniTable.appendChild(tbody);
      wrapper.appendChild(miniTable);
      document.body.appendChild(wrapper);
      return wrapper;
    }
    _onMouseDown(e) {
      if (e.button !== 0) return;
      const handle = e.target.closest(this.options.handle);
      if (!handle) return;
      const item = handle.closest(this.options.items);
      if (!item || !this.container.contains(item)) return;
      e.preventDefault();
      this._pendingItem = item;
      this._started = false;
      this._startX = e.clientX;
      this._startY = e.clientY;
      const rect = item.getBoundingClientRect();
      this._offsetX = e.clientX - rect.left;
      this._offsetY = e.clientY - rect.top;
      document.addEventListener("mousemove", this._onMouseMove);
      document.addEventListener("mouseup", this._onMouseUp);
    }
    _startDrag(item) {
      this._started = true;
      this._dragging = item;
      const rect = item.getBoundingClientRect();
      const placeholder = document.createElement("tr");
      placeholder.className = this.options.placeholderClass;
      placeholder.style.height = rect.height + "px";
      item.parentNode.insertBefore(placeholder, item);
      this._placeholder = placeholder;
      if (this._getViewModeClass() === "view-mode-grid") {
        const anyItem = this._getItems().find((it) => it !== item);
        if (anyItem) {
          const cardRect = anyItem.getBoundingClientRect();
          placeholder.style.width = cardRect.width + "px";
          placeholder.style.height = cardRect.height + "px";
          placeholder.style.display = "inline-block";
        }
      }
      this._helperWrapper = this._createHelper(item);
      item.style.display = "none";
      this._hideMetaDataDuringDrag(item);
      this.container.classList.add("wlfmc-sortable-active");
    }
    _onMouseMove(e) {
      const item = this._pendingItem;
      if (!item) return;
      if (!this._started) {
        const dx = e.clientX - this._startX;
        const dy = e.clientY - this._startY;
        if (Math.hypot(dx, dy) < this.options.dragStartDistance) return;
        this._startDrag(item);
      }
      e.preventDefault();
      this._currentX = e.clientX;
      this._currentY = e.clientY;
      if (this._helperWrapper) {
        this._helperWrapper.style.left = e.clientX - this._offsetX + "px";
        this._helperWrapper.style.top = e.clientY - this._offsetY + "px";
      }
      this._autoScroll(e.clientY);
      this._updatePlaceholder(e.clientY);
    }
    _autoScroll(y) {
      const sens = this.options.scrollSensitivity;
      const vh = window.innerHeight;
      if (y < sens) {
        window.scrollBy(0, -10);
      } else if (y > vh - sens) {
        window.scrollBy(0, 10);
      }
    }
    _updatePlaceholder(y) {
      const placeholder = this._placeholder;
      if (!placeholder) return;
      const items = this._getItems().filter((it) => it !== this._dragging);
      if (items.length === 0) {
        const tbody = this.container.querySelector("tbody") || this.container;
        tbody.appendChild(placeholder);
        return;
      }
      const isGrid = this._getViewModeClass() === "view-mode-grid";
      if (!isGrid) {
        let target = null;
        for (const item of items) {
          const rect = item.getBoundingClientRect();
          if (y < rect.top + rect.height / 2) {
            target = item;
            break;
          }
        }
        if (target) {
          if (placeholder.nextElementSibling !== target) {
            target.parentNode.insertBefore(placeholder, target);
          }
        } else {
          const last = items[items.length - 1];
          if (placeholder.previousElementSibling !== last) {
            last.parentNode.insertBefore(placeholder, last.nextSibling);
          }
        }
        return;
      }
      const x = this._currentX;
      let closestItem = null;
      let closestDistance = Infinity;
      let closestRect = null;
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = dx * dx + dy * dy;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
          closestRect = rect;
        }
      }
      if (!closestItem) return;
      const diagY = closestRect.top + (closestRect.right - x) / closestRect.width * closestRect.height;
      const shouldInsertBefore = y < diagY;
      if (shouldInsertBefore) {
        if (placeholder.nextElementSibling !== closestItem) {
          closestItem.parentNode.insertBefore(placeholder, closestItem);
        }
      } else {
        const nextSibling = closestItem.nextElementSibling;
        if (placeholder.nextSibling !== nextSibling) {
          closestItem.parentNode.insertBefore(placeholder, nextSibling);
        }
      }
      placeholder.style.width = closestRect.width + "px";
      placeholder.style.height = closestRect.height + "px";
      placeholder.style.display = "inline-block";
    }
    _onMouseUp(e) {
      document.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("mouseup", this._onMouseUp);
      const item = this._pendingItem;
      this._pendingItem = null;
      if (!item || !this._started) return;
      const helperWrapper = this._helperWrapper;
      const placeholder = this._placeholder;
      const dropRect = placeholder ? placeholder.getBoundingClientRect() : null;
      if (placeholder && placeholder.parentNode) {
        item.style.display = "";
        item.style.visibility = "hidden";
        placeholder.parentNode.insertBefore(item, placeholder);
        placeholder.remove();
      }
      this._placeholder = null;
      this._dragging = null;
      this.container.classList.remove("wlfmc-sortable-active");
      this._renumberPositions();
      this._repositionChildRows();
      const finalize = () => {
        item.style.visibility = "";
        if (helperWrapper && helperWrapper.parentNode) helperWrapper.remove();
        this._helperWrapper = null;
      };
      if (helperWrapper && dropRect) {
        const duration = this.options.dropAnimationMs;
        const fadeDelay = Math.round(duration * 0.4);
        const fadeDuration = duration - fadeDelay;
        helperWrapper.style.transition = `top ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), left ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${fadeDuration}ms ease-in ${fadeDelay}ms, transform ${duration}ms ease-out`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            helperWrapper.style.top = dropRect.top + "px";
            helperWrapper.style.left = dropRect.left + "px";
            helperWrapper.style.opacity = "0";
            helperWrapper.style.transform = "scale(0.96)";
          });
        });
        let finalized = false;
        const onTransitionEnd = (ev) => {
          if (ev.propertyName !== "top") return;
          if (finalized) return;
          finalized = true;
          helperWrapper.removeEventListener("transitionend", onTransitionEnd);
          finalize();
        };
        helperWrapper.addEventListener("transitionend", onTransitionEnd);
        setTimeout(() => {
          if (!finalized) {
            finalized = true;
            helperWrapper.removeEventListener("transitionend", onTransitionEnd);
            finalize();
          }
        }, duration + 100);
      } else {
        finalize();
      }
      if (typeof this.options.update === "function") {
        this.options.update(e, { item });
      }
    }
    _hideMetaDataDuringDrag(draggedItem) {
      const wrapper = draggedItem.closest(".wishlist-items-wrapper");
      if (!wrapper) return;
      wrapper.querySelectorAll(".show-meta-data").forEach((el) => {
        el.classList.remove("show-meta-data");
      });
      wrapper.querySelectorAll(".wlfmc-row-meta-data").forEach((el) => {
        el.classList.add("hide");
      });
    }
    _repositionChildRows() {
      const items = this._getItems();
      items.forEach((row) => {
        const rowId = row.getAttribute("data-row-id");
        if (!rowId) return;
        const wrapper = row.closest(".wishlist-items-wrapper");
        if (!wrapper) return;
        const childRows = wrapper.querySelectorAll(`.parent-row-id-${rowId}`);
        if (childRows.length > 0) {
          childRows.forEach((child) => {
            row.after(child);
          });
        }
      });
    }
    _renumberPositions() {
      this.container.querySelectorAll('input[name*="[position]"]').forEach((input, idx) => {
        input.value = String(idx);
      });
    }
    destroy() {
      this.container.removeEventListener("mousedown", this._onMouseDown);
      document.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("mouseup", this._onMouseUp);
      this.container.style.userSelect = "";
    }
  };

  // src/frontend/js/modern/ui/sortable-handler.js
  var SortableHandler = class {
    constructor() {
      this._instances = /* @__PURE__ */ new Map();
      this._boundEvents = [];
    }
    init() {
      this._initAllTables();
      const onContentUpdated = () => {
        this._initAllTables();
      };
      eventBus.on(EVENTS.CONTENT_UPDATED, onContentUpdated);
      this._boundEvents.push({ event: EVENTS.CONTENT_UPDATED, handler: onContentUpdated });
    }
    _initAllTables() {
      const tables = document.querySelectorAll(
        "table.wlfmc-wishlist-items-wrapper.sortable:not(.no-interactions)"
      );
      tables.forEach((table) => {
        const tableId = table.dataset.id || table.dataset.token || "default";
        if (this._instances.has(tableId)) {
          const existing = this._instances.get(tableId);
          if (existing.element === table) return;
          existing.destroy();
          this._instances.delete(tableId);
        }
        const inst = new SortableLite(table, {
          items: ".wlfmc-table-item[data-row-id]",
          handle: ".sortable-handle",
          placeholderClass: "ui-sortable-placeholder",
          scrollSensitivity: 40,
          update: () => {
            this._handleSortUpdate(table);
          }
        });
        this._instances.set(tableId, inst);
      });
    }
    _handleSortUpdate(table) {
      const positions = [];
      table.querySelectorAll("[data-row-id]").forEach((row) => {
        positions.push(row.dataset.rowId);
      });
      if (positions.length === 0) return;
      const nonce = table.dataset.nonce || document.querySelector("#wlfmc-wishlist-form table.wlfmc-wishlist-table")?.dataset.nonce || "";
      queueManager.addWithDeduplication("sort_items", {
        nonce,
        positions,
        wishlist_token: table.dataset.token,
        page: table.dataset.page || "",
        per_page: table.dataset.perPage || table.dataset.per_page || ""
      }).catch((err) => {
        console.warn("[SortableHandler] Sort failed:", err);
      });
    }
    reInit() {
      this._initAllTables();
    }
    destroy() {
      this._instances.forEach((inst) => inst.destroy());
      this._instances.clear();
      this._boundEvents.forEach(({ event, handler }) => {
        eventBus.off(event, handler);
      });
      this._boundEvents = [];
    }
  };

  // src/frontend/js/modern/ui/layout-handler.js
  var LayoutHandler = class {
    constructor() {
      this._boundEvents = [];
    }
    init() {
      this._bindLayoutToggle();
      this._bindTabs();
      this._bindTabbedPageLinks();
    }
    _bindLayoutToggle() {
      const handler = (e) => {
        const btn = e.target.closest(".wlfmc-toggle-layout");
        if (!btn) return;
        e.preventDefault();
        btn.classList.toggle("list");
        btn.classList.toggle("grid");
        const table = btn.closest(".wlfmc-wishlist-form")?.querySelector(".wlfmc-list");
        if (table) {
          table.classList.toggle("view-mode-list");
          table.classList.toggle("view-mode-grid");
        }
        const newLayout = btn.classList.contains("list") ? "grid" : "list";
        const nonce = btn.dataset.nonce;
        queueManager.addWithDeduplication("change_layout", {
          action: "wlfmc_change_layout",
          new_layout: newLayout,
          nonce,
          context: "frontend"
        }).catch((error) => {
          if (error && error.name === "AbortError") return;
          btn.classList.toggle("list");
          btn.classList.toggle("grid");
          if (table) {
            table.classList.toggle("view-mode-list");
            table.classList.toggle("view-mode-grid");
          }
        });
      };
      document.addEventListener("click", handler);
      this._boundEvents.push({ target: document, event: "click", handler });
    }
    _bindTabs() {
      const handler = (e) => {
        const link = e.target.closest(".wlfmc-tabs a:not(.external-link)");
        if (!link) return;
        e.preventDefault();
        const content = link.dataset.content;
        const wrapper = link.closest(".wlfmc-tabs-wrapper");
        if (!wrapper) return;
        wrapper.classList.remove("active-tab-cart", "active-tab-save-for-later", "active-tab-wishlist", "active-tab-waitlist", "active-tab-lists");
        wrapper.classList.add("active-tab-" + content);
        wrapper.querySelectorAll(".wlfmc-tab-content").forEach((el) => el.style.display = "none");
        wrapper.querySelectorAll(".wlfmc-tabs a").forEach((el) => el.classList.remove("nav-tab-active"));
        link.classList.add("nav-tab-active");
        const targetContent = wrapper.querySelector(`.wlfmc_content_${content}`);
        if (targetContent) targetContent.style.display = "block";
        const url = new URL(window.location.href);
        url.searchParams.set("tab", content);
        window.history.replaceState({}, "", url.toString());
        if (content === "save-for-later") {
          eventBus.emit(EVENTS.CONTENT_UPDATED);
        }
      };
      document.addEventListener("click", handler);
      this._boundEvents.push({ target: document, event: "click", handler });
    }
    _bindTabbedPageLinks() {
      const handler = (e) => {
        const link = e.target.closest(".wlfmc-lists-header a:not(.external-link), a.wlfmc-open-list-link");
        if (!link) return;
        const href = link.getAttribute("href");
        if (!href || href === "#" || href === "#!" || href.includes("javascript:")) return;
        if (!document.body.classList.contains("elementor-editor-active")) {
          return;
        }
        const wrapper = link.closest(".wlfmc-wishlist-page");
        if (!wrapper) return;
        e.preventDefault();
        e.stopPropagation();
        const tabContent = wrapper.querySelector(".wlfmc-tab-content");
        if (tabContent) {
          block(tabContent);
        }
        this._loadTabContentWithBlock(href, wrapper, tabContent);
      };
      document.addEventListener("click", handler);
      this._boundEvents.push({ target: document, event: "click", handler });
    }
    _loadTabContentWithBlock(url, wrapper, tabContent) {
      fetch(url, { method: "GET", credentials: "same-origin" }).then((response) => response.text()).then((html) => {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        const newHeader = temp.querySelector(".wlfmc-lists-header");
        const newContent = temp.querySelector(".wlfmc-tab-content");
        if (newHeader) {
          const oldHeader = wrapper.querySelector(".wlfmc-lists-header");
          if (oldHeader) oldHeader.replaceWith(newHeader);
        }
        if (newContent) {
          const oldContent = wrapper.querySelector(".wlfmc-tab-content");
          if (oldContent) oldContent.replaceWith(newContent);
        }
        window.history.pushState({ path: url }, "", url);
        eventBus.emit(EVENTS.CONTENT_UPDATED);
      }).catch((error) => {
        console.warn("[LayoutHandler] Load tab content failed:", error);
      }).finally(() => {
        const currentTabContent = wrapper.querySelector(".wlfmc-tab-content");
        if (currentTabContent) {
          unblock(currentTabContent);
        } else if (tabContent) {
          unblock(tabContent);
        }
      });
    }
    destroy() {
      this._boundEvents.forEach(({ target, event, handler }) => {
        target.removeEventListener(event, handler);
      });
      this._boundEvents = [];
    }
  };

  // src/frontend/js/modern/ui/image-fix-handler.js
  var ImageFixHandler = class {
    constructor() {
      this._observer = null;
      this._movedElements = /* @__PURE__ */ new WeakSet();
      this._debounceTimer = null;
      this._DEBOUNCE_MS = 150;
      this._rafId = null;
    }
    init() {
      this._fixTopOfImage();
      this._fixPowerPack();
      this._setupObserver();
    }
    _fixTopOfImage() {
      document.querySelectorAll(".woocommerce-product-gallery__wrapper .wlfmc-top-of-image").forEach((el) => {
        if (this._movedElements.has(el)) return;
        const parentEl = el.parentElement;
        if (parentEl && parentEl.parentElement) {
          parentEl.after(el);
          this._movedElements.add(el);
        }
      });
    }
    _fixPowerPack() {
      document.querySelectorAll(".pp-single-product").forEach((container) => {
        const topImage = container.querySelector(".entry-summary > .wlfmc-top-of-image");
        const image = container.querySelector(".entry-summary .single-product-image");
        if (topImage && image) {
          image.appendChild(topImage);
        }
      });
    }
    _setupObserver() {
      if (this._observer) this._observer.disconnect();
      this._observer = new MutationObserver((mutations) => {
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
          if (this._rafId) cancelAnimationFrame(this._rafId);
          this._rafId = requestAnimationFrame(() => {
            this._fixTopOfImage();
            this._fixPowerPack();
            this._rafId = null;
          });
          this._debounceTimer = null;
        }, this._DEBOUNCE_MS);
      });
      this._observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    destroy() {
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      if (this._debounceTimer) {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = null;
      }
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
    }
  };

  // src/frontend/js/modern/lib/dropdown-lite.js
  var DropdownLite = class {
    constructor(input, options = {}) {
      this.input = input;
      this.options = {
        filter: true,
        effects: "default",
        // default, fade, slide
        duration: "fast",
        // fast, slow, or number in ms
        trigger: "focus",
        // focus, manual
        ...options
      };
      this._visible = false;
      this._isAnimating = false;
      this._dropdownId = input.dataset.dropdown;
      this._list = this._dropdownId ? document.getElementById(this._dropdownId) : null;
      this._durationMs = this._getDurationMs(this.options.duration);
      if (!this._list) return;
      this._init();
    }
    /**
     * Initialize the dropdown instance
     */
    _init() {
      this.input.classList.add("wlfmc-dropdown-input");
      this._handlers = {
        input: () => this._filter(),
        keydown: (e) => this._onKeyDown(e),
        focus: () => this._handleFocus(),
        blur: () => this._handleBlur(),
        listMouseMove: (e) => this._onListMouseMove(e),
        listMouseDown: (e) => this._onListMouseDown(e),
        listClick: (e) => this._onListClick(e),
        listMouseUp: () => this._onListMouseUp()
      };
      this.input.addEventListener("input", this._handlers.input);
      this.input.addEventListener("keydown", this._handlers.keydown);
      if (this.options.trigger === "focus") {
        this.input.addEventListener("focus", this._handlers.focus);
        this.input.addEventListener("blur", this._handlers.blur);
      }
      this._list.addEventListener("mousemove", this._handlers.listMouseMove);
      this._list.addEventListener("mousedown", this._handlers.listMouseDown);
      this._list.addEventListener("click", this._handlers.listClick);
      this._list.addEventListener("mouseup", this._handlers.listMouseUp);
      this._filter();
      this._trigger("created");
    }
    /**
     * Convert duration option to milliseconds
     */
    _getDurationMs(duration) {
      if (typeof duration === "number") return duration;
      switch (duration) {
        case "slow":
          return 600;
        case "fast":
        default:
          return 200;
      }
    }
    /**
     * Handle input focus - show dropdown immediately
     */
    _handleFocus() {
      this.input.classList.remove("wlfmc-pulse");
      this.show();
    }
    /**
     * Handle input blur with intelligent delay
     * Prevents closing when user clicks on list items or is still interacting
     */
    _handleBlur() {
      setTimeout(() => {
        const activeEl = document.activeElement;
        const isHoveringList = this._list.matches(":hover");
        const isFocusedInList = this._list.contains(activeEl);
        const isInputFocused = activeEl === this.input;
        if (!isHoveringList && !isFocusedInList && !isInputFocused) {
          this.hide();
        } else if (!isInputFocused && (isHoveringList || isFocusedInList)) {
          requestAnimationFrame(() => {
            if (this._visible) this.input.focus();
          });
        }
      }, 150);
    }
    /**
     * Show dropdown with configured animation
     */
    show() {
      if (!this._list || this._isAnimating) return;
      const inputRect = this.input.getBoundingClientRect();
      Object.assign(this._list.style, {
        position: "absolute",
        width: inputRect.width + "px",
        zIndex: "99999",
        top: this.input.offsetTop + this.input.offsetHeight - 1 + "px",
        left: this.input.offsetLeft + "px"
      });
      const visibleItems = Array.from(this._list.querySelectorAll("li")).filter((li) => li.style.display !== "none");
      if (visibleItems.length === 0) return;
      this._visible = true;
      this.input.classList.add("open");
      this._trigger("show");
      this._animateShow().then(() => {
        this._trigger("shown");
      });
    }
    /**
     * Hide dropdown with configured animation
     */
    hide() {
      if (!this._visible || this._isAnimating || !this._list) return;
      this._trigger("hide");
      this.input.classList.remove("open");
      this._animateHide().then(() => {
        this._visible = false;
        this._trigger("hidden");
      });
    }
    /**
     * Animation handler for showing dropdown
     */
    _animateShow() {
      return new Promise((resolve) => {
        this._isAnimating = true;
        const effect = this.options.effects;
        const duration = this._durationMs;
        if (effect === "fade") {
          this._list.style.opacity = "0";
          this._list.style.display = "block";
          const animation = this._list.animate([
            { opacity: 0 },
            { opacity: 1 }
          ], { duration, easing: "ease-out" });
          animation.onfinish = () => {
            this._list.style.opacity = "1";
            this._isAnimating = false;
            resolve();
          };
        } else if (effect === "slide") {
          this._list.style.height = "0";
          this._list.style.overflow = "hidden";
          this._list.style.display = "block";
          const naturalHeight = this._list.scrollHeight;
          const animation = this._list.animate([
            { height: "0px", opacity: 0 },
            { height: naturalHeight + "px", opacity: 1 }
          ], { duration, easing: "ease-out" });
          animation.onfinish = () => {
            this._list.style.height = "";
            this._list.style.overflow = "";
            this._list.style.opacity = "1";
            this._isAnimating = false;
            resolve();
          };
        } else {
          this._list.style.display = "block";
          this._isAnimating = false;
          resolve();
        }
      });
    }
    /**
     * Animation handler for hiding dropdown
     */
    _animateHide() {
      return new Promise((resolve) => {
        this._isAnimating = true;
        const effect = this.options.effects;
        const duration = this._durationMs;
        if (effect === "fade") {
          const animation = this._list.animate([
            { opacity: 1 },
            { opacity: 0 }
          ], { duration, easing: "ease-in" });
          animation.onfinish = () => {
            this._list.style.display = "none";
            this._list.style.opacity = "";
            this._isAnimating = false;
            resolve();
          };
        } else if (effect === "slide") {
          const currentHeight = this._list.offsetHeight;
          this._list.style.overflow = "hidden";
          const animation = this._list.animate([
            { height: currentHeight + "px", opacity: 1 },
            { height: "0px", opacity: 0 }
          ], { duration, easing: "ease-in" });
          animation.onfinish = () => {
            this._list.style.display = "none";
            this._list.style.height = "";
            this._list.style.overflow = "";
            this._list.style.opacity = "";
            this._isAnimating = false;
            resolve();
          };
        } else {
          this._list.style.display = "none";
          this._isAnimating = false;
          resolve();
        }
      });
    }
    /**
     * Filter list items based on input value
     */
    _filter() {
      if (!this._list) return;
      const search = this.input.value.toLowerCase().trim();
      let hiddenCount = 0;
      const items = this._list.querySelectorAll("li");
      items.forEach((li) => {
        const text = li.textContent.toLowerCase();
        const match = !this.options.filter || text.indexOf(search) > -1;
        li.style.display = match ? "" : "none";
        if (match) {
          li.classList.add("es-visible");
        } else {
          li.classList.remove("es-visible");
          hiddenCount++;
        }
      });
      if (items.length > 0 && hiddenCount === items.length) {
        this.hide();
      } else if (this._visible && this.options.filter) {
        requestAnimationFrame(() => this._ensureVisibleItemHighlighted());
      }
    }
    /**
     * Ensure at least one item is highlighted when dropdown opens/filters
     */
    _ensureVisibleItemHighlighted() {
      const selected = this._list.querySelector("li.selected.es-visible");
      if (!selected) {
        const firstVisible = this._list.querySelector("li.es-visible:not([disabled])");
        if (firstVisible) this._highlight(firstVisible);
      }
    }
    /**
     * Highlight a specific list item
     */
    _highlight(li) {
      this._list.querySelectorAll(".selected").forEach((el) => el.classList.remove("selected"));
      li.classList.add("selected");
      const rect = li.getBoundingClientRect();
      const listRect = this._list.getBoundingClientRect();
      if (rect.top < listRect.top) {
        this._list.scrollTop -= listRect.top - rect.top;
      } else if (rect.bottom > listRect.bottom) {
        this._list.scrollTop += rect.bottom - listRect.bottom;
      }
    }
    /**
     * Select a list item
     */
    _select(li) {
      if (!li || li.hasAttribute("disabled") || !li.classList.contains("es-visible")) return;
      this.input.value = li.textContent.trim();
      if (this.options.filter) {
        this.hide();
      }
      this._filter();
      this._trigger("select", li);
    }
    /**
     * Keyboard navigation handler
     */
    _onKeyDown(e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          this._highlightNext(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          this._highlightNext(-1);
          break;
        case "Enter":
          if (this._visible) {
            e.preventDefault();
            const selected = this._list.querySelector("li.selected");
            if (selected) this._select(selected);
          }
          break;
        case "Escape":
        case "Tab":
          this.hide();
          break;
        default:
          if (this._visible) {
            requestAnimationFrame(() => this._ensureVisibleItemHighlighted());
          }
          break;
      }
    }
    /**
     * Navigate through visible items
     */
    _highlightNext(direction) {
      const visibles = Array.from(this._list.querySelectorAll("li.es-visible:not([disabled])"));
      if (visibles.length === 0) return;
      const current = this._list.querySelector("li.selected");
      let idx = current ? visibles.indexOf(current) : -1;
      idx = (idx + direction + visibles.length) % visibles.length;
      this._highlight(visibles[idx]);
    }
    /**
     * Mouse move handler for list hover highlighting
     */
    _onListMouseMove(e) {
      const li = e.target.closest("li:not([disabled])");
      if (!li || !this._list.contains(li)) return;
      this._highlight(li);
    }
    /**
     * Mouse down handler for selection
     */
    _onListMouseDown(e) {
      const li = e.target.closest("li");
      if (!li || !this._list.contains(li)) return;
      if (li.hasAttribute("disabled")) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (!li.classList.contains("list-item")) {
        this._select(li);
      }
    }
    /**
     * Click handler for anchor links within list
     */
    _onListClick(e) {
      const link = e.target.closest("a.select-list");
      if (!link || !this._list.contains(link)) return;
      e.preventDefault();
      const li = link.closest("li");
      if (li) this._select(li);
    }
    /**
     * Clean up selected state on mouse up
     */
    _onListMouseUp() {
      this._list.querySelectorAll("li.selected").forEach((el) => el.classList.remove("selected"));
    }
    /**
     * Dispatch custom event with namespace compatibility
     */
    _trigger(event, detail = null) {
      const customEvent = new CustomEvent(`${event}.editable-select`, {
        bubbles: true,
        cancelable: true,
        detail
      });
      this.input.dispatchEvent(customEvent);
    }
    /**
     * Cleanup and destroy instance
     */
    destroy() {
      this.input.classList.remove("wlfmc-dropdown-input", "open");
      if (this._handlers) {
        this.input.removeEventListener("input", this._handlers.input);
        this.input.removeEventListener("keydown", this._handlers.keydown);
        this.input.removeEventListener("focus", this._handlers.focus);
        this.input.removeEventListener("blur", this._handlers.blur);
        if (this._list) {
          this._list.removeEventListener("mousemove", this._handlers.listMouseMove);
          this._list.removeEventListener("mousedown", this._handlers.listMouseDown);
          this._list.removeEventListener("click", this._handlers.listClick);
          this._list.removeEventListener("mouseup", this._handlers.listMouseUp);
        }
      }
      if (this._list) {
        this._list.style.display = "";
        this._list.style.opacity = "";
        this._list.style.height = "";
        this._list.style.overflow = "";
      }
      delete this.input._dropdownLiteInstance;
    }
  };

  // src/frontend/js/modern/core/ui-manager.js
  var UIManager = class {
    constructor() {
      this.tooltip = new TooltipHandler();
      this.dropdown = new DropdownHandler();
      this.popup = new PopupHandler();
      this.sortable = new SortableHandler();
      this.layout = new LayoutHandler();
      this.imageFix = new ImageFixHandler();
      this._initialized = false;
      this._reinitializing = false;
      this._listsDropdown = null;
      this._premium = false;
    }
    init(options = {}) {
      if (this._initialized) return;
      this.tooltip.init();
      this.dropdown.init();
      this.popup.init();
      this.imageFix.init();
      this._premium = options.premium || false;
      if (this._premium) {
        this.sortable.init();
        this.layout.init();
        this._initDropdownLists();
      }
      eventBus.on(EVENTS.CONTENT_UPDATED, () => {
        if (this._premium) {
          this._initDropdownLists();
        }
      });
      eventBus.on("ui:reinit", () => this.reInit());
      this._initialized = true;
      console.log("[UIManager] Initialized");
    }
    destroy() {
      this.tooltip.destroy?.();
      this.dropdown.destroy?.();
      this.popup.destroy?.();
      this.imageFix.destroy?.();
      if (this._premium) {
        this.sortable.destroy?.();
        this.layout.destroy?.();
      }
      this._initialized = false;
      if (this._listsDropdown) {
        this._listsDropdown.destroy();
        this._listsDropdown = null;
      }
      console.log("[UIManager] Destroyed");
    }
    reInit() {
      if (this._reinitializing) return;
      this._reinitializing = true;
      try {
        const opts = { premium: this._premium };
        this.destroy();
        this.init(opts);
      } finally {
        this._reinitializing = false;
      }
    }
    /**
     * Initialize the premium "My Lists" dropdown widget.
     * Called on init and after every CONTENT_UPDATED event.
     */
    _initDropdownLists() {
      const dropdownElement = document.getElementById("wlfmc_my_lists");
      if (!dropdownElement) return;
      if (this._listsDropdown) {
        this._listsDropdown.destroy();
        this._listsDropdown = null;
      }
      this._listsDropdown = new DropdownLite(dropdownElement, {
        effects: "slide"
      });
      dropdownElement.addEventListener("select.editable-select", (e) => {
        const li = e.detail;
        if (!li) return;
        const wrapper = dropdownElement.closest(".wlfmc-dropdown-wrapper");
        if (!wrapper) return;
        wrapper.classList.add("wlfmc-action", "wlfmc-loading-alt", "wlfmc-inverse");
        const wishlistId = li.getAttribute("value") || li.value || "";
        const target = wrapper.querySelector(`.list-item[data-wishlist-id="${wishlistId}"]`);
        if (!target) return;
        const listName = target.querySelector(".list-name")?.textContent || "";
        dropdownElement.value = listName;
        const url = target.getAttribute("data-url") || target.dataset.url;
        if (url) window.location.href = url;
      });
    }
  };
  var uiManager = new UIManager();
  var ui_manager_default = uiManager;

  // src/frontend/js/modern/core/third-party-integration.js
  var REINIT_EVENTS = [
    "jet-filter-content-rendered",
    "jet-woo-builder-content-rendered",
    "jet-engine/listing-grid/after-load-more",
    "jet-engine/listing-grid/after-lazy-load",
    "jet-cw-loaded"
  ];
  var JQUERY_ONLY_EVENTS = [
    "deContentLoaded",
    "wooco_gallery_loaded",
    "yith_wcwl_refresh_fragments",
    "wc_fragment_refresh",
    "wlfmc_reload_fragments"
  ];
  var ThirdPartyIntegration = class {
    constructor() {
      this._initialized = false;
      this._jQueryBoundEvents = [];
    }
    init() {
      if (this._initialized) return;
      REINIT_EVENTS.forEach((evt) => this._onjQuery(evt, () => this._reinit()));
      JQUERY_ONLY_EVENTS.forEach((evt) => this._onjQuery(evt, () => syncManager.syncAll()));
      this._offjQuery("wooco_gallery_loaded");
      this._onjQuery("wooco_gallery_loaded", (e) => {
        const productId = e.detail?.productId || e.detail;
        if (productId) {
          document.querySelectorAll(`*[id^="add_to_waitlist_popup_${productId}_"].popup_wrapper`).forEach((el) => el.remove());
        }
        syncManager.syncAll();
      });
      if (typeof wp !== "undefined" && wp.customize && wp.customize.selectiveRefresh && wp.customize.widgetsPreview && wp.customize.widgetsPreview.WidgetPartial) {
        wp.customize.selectiveRefresh.bind("partial-content-rendered", () => {
          syncManager.syncAll();
        });
      }
      this._initialized = true;
    }
    /**
     * Bind a jQuery event exactly once.
     * Replaces the previous triple-binding pattern.
     */
    _onjQuery(event, callback) {
      const $ = window.jQuery;
      if (!$) return;
      $(document.body).on(event, callback);
      this._jQueryBoundEvents.push({ event, callback });
    }
    /**
     * Remove a previously bound jQuery event.
     */
    _offjQuery(event) {
      const $ = window.jQuery;
      if (!$) return;
      this._jQueryBoundEvents = this._jQueryBoundEvents.filter((entry) => {
        if (entry.event === event) {
          $(document.body).off(event, entry.callback);
          return false;
        }
        return true;
      });
    }
    _reinit() {
      eventBus.emit("ui:reinit");
      eventBus.emit(EVENTS.CONTENT_UPDATED);
      syncManager.syncAll();
    }
    destroy() {
      const $ = window.jQuery;
      if ($) {
        this._jQueryBoundEvents.forEach(({ event, callback }) => {
          $(document.body).off(event, callback);
        });
      }
      this._jQueryBoundEvents = [];
      this._initialized = false;
    }
  };
  var thirdPartyIntegration = new ThirdPartyIntegration();
  var third_party_integration_default = thirdPartyIntegration;

  // src/frontend/js/modern/lib/toastr-lite.js
  var ToastrLite = class {
    constructor() {
      this.options = {
        tapToDismiss: true,
        toastClass: "toast",
        containerId: "toast-container",
        debug: false,
        closeButton: false,
        showDuration: 300,
        hideDuration: 1e3,
        closeOnHover: true,
        extendedTimeOut: 1e3,
        iconClasses: {
          error: "toast-error",
          info: "toast-info",
          success: "toast-success",
          warning: "toast-warning"
        },
        iconClass: "toast-info",
        positionClass: "toast-top-left",
        timeOut: 5e3,
        titleClass: "toast-title",
        messageClass: "toast-message",
        escapeHtml: false,
        target: "body",
        closeHtml: '<button type="button">&times;</button>',
        closeClass: "toast-close-button",
        newestOnTop: true,
        preventDuplicates: false,
        progressBar: true,
        progressClass: "toast-progress",
        rtl: false,
        maxVisible: 3
        // 0 = unlimited, matches original behavior
      };
      this._toastId = 0;
      this._activeMessages = /* @__PURE__ */ new Set();
      this._container = null;
      this._activeToasts = /* @__PURE__ */ new Map();
      this._previousToastMessage = void 0;
      this._configured = false;
      this._handleMouseEnter = this._handleMouseEnter.bind(this);
      this._handleMouseLeave = this._handleMouseLeave.bind(this);
      this._handleTap = this._handleTap.bind(this);
      this._handleCloseClick = this._handleCloseClick.bind(this);
    }
    /* ── Configuration ─────────────────────────────────────────────── */
    /**
     * Apply runtime configuration from localized data (wlfmc_l10n).
     * Idempotent: safe to call multiple times.
     */
    applyConfig() {
      if (this._configured) return;
      const l10n = window.wlfmc_l10n || {};
      this.options.rtl = !!l10n.is_rtl;
      this.options.positionClass = this._getPositionClass();
      this._configured = true;
    }
    _getPositionClass() {
      const l10n = window.wlfmc_l10n || {};
      const pos = l10n.toast_position;
      if (pos && pos !== "default") return pos;
      return l10n.is_rtl ? "toast-top-right" : "toast-top-left";
    }
    /* ── Container Management ──────────────────────────────────────── */
    _getContainer(create = true) {
      if (this._container && document.body.contains(this._container)) {
        return this._container;
      }
      this._container = document.getElementById(this.options.containerId);
      if (!this._container && create) {
        this._container = document.createElement("div");
        this._container.id = this.options.containerId;
        this._container.className = this.options.positionClass;
        this._container.style.overflowAnchor = "none";
        const target = document.querySelector(this.options.target) || document.body;
        target.appendChild(this._container);
      }
      return this._container;
    }
    _cleanupContainer() {
      if (this._activeToasts.size === 0 && this._container) {
        requestAnimationFrame(() => {
          if (this._activeToasts.size === 0 && this._container?.parentNode) {
            this._container.parentNode.removeChild(this._container);
            this._container = null;
            this._activeMessages.clear();
            this._previousToastMessage = void 0;
          }
        });
      }
    }
    /* ── HTML Helpers ──────────────────────────────────────────────── */
    _escapeHtml(source) {
      if (source == null) return "";
      return String(source).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    /* ── Toast Creation & Lifecycle ────────────────────────────────── */
    _notify(type, message, title, optionsOverride) {
      const options = { ...this.options, ...optionsOverride || {} };
      const iconClass = options.iconClasses[type] || options.iconClass;
      if (options.preventDuplicates) {
        if (message === this._previousToastMessage) return null;
        if (message && this._activeMessages.has(String(message))) return null;
      }
      this._evictIfNeeded(options);
      const container = this._getContainer(true);
      const toastEl = this._createToastElement(type, message, title, iconClass, options);
      const meta = {
        message: message ? String(message) : "",
        timeoutId: null,
        extTimeoutId: null,
        isPaused: false,
        remainingTime: options.timeOut,
        startTime: Date.now(),
        options
      };
      this._activeToasts.set(toastEl, meta);
      if (message) {
        this._activeMessages.add(String(message));
        this._previousToastMessage = message;
      }
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      if (options.newestOnTop) {
        container.insertBefore(toastEl, container.firstChild);
      } else {
        container.appendChild(toastEl);
      }
      window.scrollTo(scrollX, scrollY);
      requestAnimationFrame(() => {
        toastEl.classList.add("toast-visible");
        if (options.progressBar) {
          this._startProgress(toastEl, options.timeOut);
        }
        this._scheduleHide(toastEl, options.timeOut);
      });
      this._toastId++;
      return toastEl;
    }
    _createToastElement(type, message, title, iconClass, options) {
      const toastEl = document.createElement("div");
      toastEl.className = `${options.toastClass} ${iconClass}`;
      if (options.rtl) toastEl.classList.add("rtl");
      toastEl.setAttribute("aria-live", type === "error" || type === "warning" ? "assertive" : "polite");
      toastEl.dataset.toastId = ++this._toastId;
      if (options.closeButton) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = options.closeHtml;
        const closeBtn = wrapper.firstElementChild;
        if (closeBtn) {
          closeBtn.classList.add(options.closeClass);
          closeBtn.setAttribute("role", "button");
          toastEl._closeBtn = closeBtn;
          toastEl.insertBefore(closeBtn, toastEl.firstChild);
        }
      }
      if (title) {
        const titleEl = document.createElement("div");
        titleEl.className = options.titleClass;
        titleEl.textContent = options.escapeHtml ? this._escapeHtml(title) : title;
        toastEl.appendChild(titleEl);
      }
      if (message) {
        const msgEl = document.createElement("div");
        msgEl.className = options.messageClass;
        if (options.escapeHtml) {
          msgEl.textContent = this._escapeHtml(message);
        } else {
          msgEl.innerHTML = message;
        }
        toastEl.appendChild(msgEl);
      }
      if (options.progressBar) {
        const progressEl = document.createElement("div");
        progressEl.className = options.progressClass;
        toastEl.appendChild(progressEl);
        toastEl._progressEl = progressEl;
      }
      if (options.tapToDismiss) {
        toastEl.addEventListener("click", this._handleTap);
      }
      if (options.closeButton && toastEl._closeBtn) {
        toastEl._closeBtn.addEventListener("click", this._handleCloseClick);
      }
      if (options.closeOnHover) {
        toastEl.addEventListener("mouseenter", this._handleMouseEnter);
        toastEl.addEventListener("mouseleave", this._handleMouseLeave);
      }
      return toastEl;
    }
    /* ── CSS-Driven Progress Bar ───────────────────────────────────── */
    /**
     * Starts progress bar using pure CSS transition.
     * Eliminates the need for any JS animation loop or interval.
     */
    _startProgress(toastEl, durationMs) {
      const el = toastEl._progressEl;
      if (!el) return;
      el.style.transition = "none";
      el.style.width = "100%";
      void el.offsetWidth;
      el.style.transition = `width ${durationMs}ms linear`;
      el.style.width = "0%";
    }
    _pauseProgress(toastEl) {
      const el = toastEl._progressEl;
      if (!el) return;
      const currentWidth = getComputedStyle(el).width;
      el.style.transition = "none";
      el.style.width = currentWidth;
    }
    _resumeProgress(toastEl, remainingMs) {
      const el = toastEl._progressEl;
      if (!el || remainingMs <= 0) return;
      void el.offsetWidth;
      el.style.transition = `width ${remainingMs}ms linear`;
      el.style.width = "0%";
    }
    /* ── Timer Management ──────────────────────────────────────────── */
    _scheduleHide(toastEl, delay) {
      const meta = this._activeToasts.get(toastEl);
      if (!meta) return;
      clearTimeout(meta.timeoutId);
      clearTimeout(meta.extTimeoutId);
      meta.startTime = Date.now();
      meta.remainingTime = delay;
      meta.timeoutId = setTimeout(() => {
        this._hideToast(toastEl);
      }, delay);
    }
    _handleMouseEnter(e) {
      const toastEl = e.currentTarget;
      const meta = this._activeToasts.get(toastEl);
      if (!meta || meta.isPaused) return;
      meta.isPaused = true;
      clearTimeout(meta.timeoutId);
      clearTimeout(meta.extTimeoutId);
      const elapsed = Date.now() - meta.startTime;
      meta.remainingTime = Math.max(0, meta.remainingTime - elapsed);
      this._pauseProgress(toastEl);
    }
    _handleMouseLeave(e) {
      const toastEl = e.currentTarget;
      const meta = this._activeToasts.get(toastEl);
      if (!meta || !meta.isPaused) return;
      meta.isPaused = false;
      const nextDelay = meta.options.extendedTimeOut > 0 ? meta.options.extendedTimeOut : meta.remainingTime;
      meta.remainingTime = nextDelay;
      this._resumeProgress(toastEl, nextDelay);
      this._scheduleHide(toastEl, nextDelay);
    }
    _handleTap(e) {
      if (e.target.closest(".toast-close-button")) return;
      const toastEl = e.currentTarget;
      const meta = this._activeToasts.get(toastEl);
      if (meta?.options.tapToDismiss) {
        this._hideToast(toastEl);
      }
    }
    _handleCloseClick(e) {
      e.stopPropagation();
      const toastEl = e.currentTarget.closest(".toast");
      if (toastEl) this._hideToast(toastEl, true);
    }
    /* ── Eviction & Removal ────────────────────────────────────────── */
    _evictIfNeeded(options) {
      const max = options.maxVisible;
      if (!max || max <= 0 || this._activeToasts.size < max) return;
      const excess = this._activeToasts.size - max + 1;
      let count = 0;
      for (const [el] of this._activeToasts) {
        if (count >= excess) break;
        this._removeImmediately(el);
        count++;
      }
    }
    _hideToast(toastEl, force = false) {
      const meta = this._activeToasts.get(toastEl);
      if (!meta) return;
      if (!force && toastEl.contains(document.activeElement)) return;
      clearTimeout(meta.timeoutId);
      clearTimeout(meta.extTimeoutId);
      this._activeToasts.delete(toastEl);
      if (meta.message) this._activeMessages.delete(meta.message);
      toastEl.classList.remove("toast-visible");
      toastEl.classList.add("toast-hiding");
      toastEl.style.pointerEvents = "none";
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.parentNode.removeChild(toastEl);
        }
        this._detachListeners(toastEl);
        this._cleanupContainer();
      }, meta.options.hideDuration);
    }
    _removeImmediately(toastEl) {
      const meta = this._activeToasts.get(toastEl);
      if (meta) {
        clearTimeout(meta.timeoutId);
        clearTimeout(meta.extTimeoutId);
        if (meta.message) this._activeMessages.delete(meta.message);
        this._activeToasts.delete(toastEl);
      }
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
      this._detachListeners(toastEl);
      this._cleanupContainer();
    }
    _detachListeners(toastEl) {
      toastEl.removeEventListener("click", this._handleTap);
      toastEl.removeEventListener("mouseenter", this._handleMouseEnter);
      toastEl.removeEventListener("mouseleave", this._handleMouseLeave);
      if (toastEl._closeBtn) {
        toastEl._closeBtn.removeEventListener("click", this._handleCloseClick);
      }
    }
    /* ── Public API ────────────────────────────────────────────────── */
    error(message, title, optionsOverride) {
      return this._notify("error", message, title, optionsOverride);
    }
    info(message, title, optionsOverride) {
      return this._notify("info", message, title, optionsOverride);
    }
    success(message, title, optionsOverride) {
      return this._notify("success", message, title, optionsOverride);
    }
    warning(message, title, optionsOverride) {
      return this._notify("warning", message, title, optionsOverride);
    }
    clear(toastEl, clearOptions) {
      const container = this._getContainer(false);
      if (!container) return;
      if (toastEl) {
        this._hideToast(toastEl, clearOptions?.force);
      } else {
        [...this._activeToasts.keys()].forEach((el) => {
          this._hideToast(el, clearOptions?.force);
        });
      }
    }
    remove(toastEl) {
      if (toastEl) this._removeImmediately(toastEl);
    }
  };
  var toastrLite = new ToastrLite();
  if (typeof window.wlfmc_l10n !== "undefined") {
    toastrLite.applyConfig();
  }
  var toastr_lite_default = toastrLite;

  // src/frontend/js/modern/core/init-gate.js
  var gate = Promise.resolve();
  function setInitGate(promise) {
    gate = Promise.resolve(promise).catch(() => {
    });
  }
  function waitForInit(timeoutMs = 2500) {
    let timer = null;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(resolve, timeoutMs);
    });
    return Promise.race([gate, timeout]).finally(() => clearTimeout(timer));
  }

  // src/frontend/js/modern/core/persistence-writer.js
  var MODULE_KEY_MAP = {
    wishlist: STORAGE_KEYS.WISHLIST,
    waitlist: STORAGE_KEYS.WAITLIST,
    multiList: STORAGE_KEYS.MULTI_LIST
  };
  var _lastHashes = /* @__PURE__ */ new Map();
  function quickHash(obj) {
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash;
  }
  async function writeModule(module) {
    const key = MODULE_KEY_MAP[module];
    if (!key) return;
    const data = module === "multiList" ? { lists: stateCache.getLists(), count: stateCache.getCount(module) } : { items: stateCache.getItems(module), count: stateCache.getCount(module) };
    const hash = quickHash(data);
    if (_lastHashes.get(module) === hash) return;
    _lastHashes.set(module, hash);
    const formatted = { ...data, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() };
    try {
      localStorage.setItem(key, JSON.stringify(formatted));
    } catch (e) {
      if (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith("wlfmc_") && k !== key) {
            localStorage.removeItem(k);
            try {
              localStorage.setItem(key, JSON.stringify(formatted));
              break;
            } catch (err) {
            }
          }
        }
      }
    }
    try {
      await resilientStorage.set(key, { __wlfmc_ts: Date.now(), data: formatted });
    } catch (e) {
    }
  }
  function initPersistenceWriter() {
    document.addEventListener("wlfmc:cache-flush", (event) => {
      const { modules } = event.detail || {};
      if (!modules || modules.length === 0) return;
      for (const module of modules) writeModule(module);
    });
    window.addEventListener("beforeunload", () => {
      for (const module of Object.keys(MODULE_KEY_MAP)) writeModule(module);
    });
    console.log("[PersistenceWriter] Initialized (Direct Storage Mode)");
  }
  async function recoverFromPersistence() {
    for (const [module, key] of Object.entries(MODULE_KEY_MAP)) {
      try {
        let storeData = null;
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            storeData = JSON.parse(raw);
          } catch {
          }
        }
        if (!storeData) {
          const envelope = await resilientStorage.get(key);
          if (envelope && envelope.data) storeData = envelope.data;
        }
        if (storeData) {
          if (module === "multiList") {
            stateCache.setModuleData(module, storeData.lists || [], storeData.count || 0);
          } else {
            stateCache.setModuleData(module, storeData.items || [], storeData.count || 0);
          }
        }
      } catch (error) {
        console.warn(`[PersistenceWriter] Recovery failed for ${module}:`, error);
      }
    }
  }

  // src/frontend/js/modern/core/account-guard.js
  var STORAGE_PREFIX = "wlfmc_";
  var AccountGuard = class {
    constructor() {
      this._checked = false;
    }
    async checkAndPurge() {
      if (this._checked) return false;
      this._checked = true;
      const currentUserId = String(window.wlfmc_l10n?.userId || 0);
      const currentSessionId = String(window.wlfmc_l10n?.sessionId || "");
      const stored = this._readStoredIdentity();
      const storedUserId = stored.userId || "";
      const isAccountChanged = storedUserId !== currentUserId;
      if (isAccountChanged) {
        console.log(
          `[AccountGuard] Account changed: "${storedUserId}" \u2192 "${currentUserId}". Purging all local data...`
        );
        await this._purgeAll();
      } else if (stored.sessionId !== currentSessionId) {
        console.log("[AccountGuard] Same user, new session. Updating sessionId.");
      }
      this._writeStoredIdentity(currentUserId, currentSessionId);
      return isAccountChanged;
    }
    _readStoredIdentity() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
        if (!raw) return { userId: "", sessionId: "" };
        const parsed = JSON.parse(raw);
        return {
          userId: String(parsed.userId || ""),
          sessionId: String(parsed.sessionId || "")
        };
      } catch {
        return { userId: "", sessionId: "" };
      }
    }
    _writeStoredIdentity(userId, sessionId) {
      try {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({
          userId,
          sessionId,
          isLoggedIn: userId !== "0" && userId !== "",
          mergeLists: window.wlfmc_l10n?.merge_lists === "true"
        }));
      } catch (e) {
        console.warn("[AccountGuard] Failed to write identity:", e);
      }
    }
    async _purgeAll() {
      this._clearLocalStorage();
      this._clearSessionStorage();
      await this._clearIndexedDB();
      stateCache.clear();
      console.log("[AccountGuard] All local data purged.");
    }
    _clearLocalStorage() {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        if (keysToRemove.length > 0) {
          console.log(`[AccountGuard] Removed ${keysToRemove.length} localStorage keys`);
        }
      } catch (e) {
        console.warn("[AccountGuard] localStorage purge failed:", e);
      }
    }
    _clearSessionStorage() {
      try {
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => sessionStorage.removeItem(key));
      } catch (e) {
      }
    }
    async _clearIndexedDB() {
      try {
        await deleteDB();
        console.log("[AccountGuard] IndexedDB deleted");
      } catch (e) {
        console.warn("[AccountGuard] IndexedDB purge failed:", e);
      }
    }
    destroy() {
      this._checked = false;
    }
  };
  var accountGuard = new AccountGuard();
  var account_guard_default = accountGuard;

  // src/frontend/js/modern/system.js
  window.wlfmc_toastr = toastr_lite_default;
  window.wlfmc_popup = Object.freeze({
    show: showPopup,
    hide: hidePopup,
    getOrCreate,
    hideAll: hideAllPopups,
    isVisible: isPopupVisible,
    destroy: destroyPopup
  });
  window.toastr = window.toastr || toastr_lite_default;
  function registerLegacyJQueryBridge() {
    const $ = window.jQuery;
    if (!$) {
      return;
    }
    if (!$.fn.popup) {
      $.fn.popup = function(action) {
        const el = this[0];
        if (!el) return this;
        switch (action) {
          case "hide":
            hidePopup(el);
            break;
          case "show":
            showPopup(el);
            break;
          case "destroy":
            destroyPopup(el);
            break;
        }
        return this;
      };
    }
    if (!$.fn.WLFMC) {
      $.fn.WLFMC = {};
    }
    if (!$.fn.WLFMC.is_cookie_enabled) {
      $.fn.WLFMC.is_cookie_enabled = function() {
        return validators.isCookieEnabled();
      };
    }
    if (!$.fn.WLFMC.isTrue) {
      $.fn.WLFMC.isTrue = function(value) {
        return validators.isTrue(value);
      };
    }
    if (!$.fn.WLFMC.validateEmail) {
      $.fn.WLFMC.validateEmail = function(email) {
        return validators.isValidEmail(email);
      };
    }
    if (!$.fn.WLFMC.loading) {
      $.fn.WLFMC.loading = function(el) {
        if (!el) return;
        const hasIcon = el.find("i").length > 0;
        el.addClass("wlfmc-action").addClass(hasIcon ? "wlfmc-loading" : "wlfmc-loading-alt");
      };
    }
    if (!$.fn.WLFMC.unloading) {
      $.fn.WLFMC.unloading = function(el) {
        if (!el) return;
        el.removeClass("wlfmc-loading wlfmc-loading-alt");
      };
    }
    if (!$.fn.WLFMC.setCookie) {
      $.fn.WLFMC.setCookie = function(name, value, days) {
        validators.setCookie(name, value, days);
      };
    }
    if (!$.fn.WLFMC.getCookie) {
      $.fn.WLFMC.getCookie = function(name) {
        return validators.getCookie(name);
      };
    }
  }
  if (window.jQuery) {
    registerLegacyJQueryBridge();
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", registerLegacyJQueryBridge);
    } else {
      registerLegacyJQueryBridge();
    }
  }
  function createModernSystem(modules = []) {
    return {
      initialized: false,
      _reinitializing: false,
      _isEnabled: false,
      _premium: false,
      _initialRefreshDone: false,
      _modules: modules.reduce((acc, mod) => {
        acc[mod.name] = mod;
        return acc;
      }, {}),
      async init(options = {}) {
        if (this.initialized) return;
        this._premium = options.premium || false;
        try {
          const userId = window.wlfmc_l10n?.userId || 0;
          const sessionId = window.wlfmc_l10n?.sessionId || "";
          const mergeLists = validators.isTrue(window.wlfmc_l10n?.merge_lists);
          await account_guard_default.checkAndPurge();
          state_cache_default.setConfig({
            userId: userId || "",
            sessionId: sessionId || "",
            isLoggedIn: userId ? true : false,
            mergeLists: mergeLists ? true : false
          });
          queueManager.init();
          conflictManager.init();
          await Promise.all(modules.map((mod) => mod.init()));
          await resilientStorage.init();
          await recoverFromPersistence();
          initPersistenceWriter();
          await Promise.all([
            displayStore.recover("wishlist"),
            displayStore.recover("waitlist"),
            displayStore.recover("multiList")
          ]);
          syncManager.init();
          third_party_integration_default.init();
          toastr_lite_default.applyConfig();
          eventManager.registerCoreHandlers();
          ui_manager_default.init({ premium: this._premium });
          this._setupEventListeners();
          this._isEnabled = true;
          this.initialized = true;
          eventBus.emit(EVENTS.SYSTEM_READY, {
            version: "3.0.0",
            premium: this._premium
          });
          Object.values(this._modules).forEach((mod) => {
            if (typeof mod.applyState === "function") mod.applyState();
          });
          eventBus.emit("system:data-ready");
          const $ = window.jQuery;
          if ($) $(document).trigger("wlfmc_init");
          if (!this._initialRefreshDone) {
            this._initialRefreshDone = true;
            const initialSync = syncManager.syncAll({ forceLocal: true }).catch((error) => {
              console.warn("[ModernSystem] Initial sync failed:", error);
            });
            setInitGate(initialSync);
          } else {
            setInitGate(Promise.resolve());
          }
        } catch (error) {
          console.error("[ModernSystem] Init failed:", error);
        }
      },
      _setupEventListeners() {
        eventBus.on(EVENTS.WISHLIST_ADDED, (data) => {
          if (data.fromOtherTab) return;
          if (data.status === "success" || data.status === "already_exists") {
            syncManager.broadcastUpdate({
              type: EVENTS.WISHLIST_ADDED,
              productId: data.productId,
              data
            });
          }
        });
        eventBus.on(EVENTS.WISHLIST_REMOVED, (data) => {
          if (data.fromOtherTab) return;
          if (data.status === "success") {
            syncManager.broadcastUpdate({
              type: EVENTS.WISHLIST_REMOVED,
              productId: data.productId,
              data
            });
          }
        });
        eventBus.on(EVENTS.WAITLIST_ADDED, (data) => {
          if (data.fromOtherTab) return;
          if (data.status === "success" || data.status === "updated") {
            syncManager.broadcastUpdate({
              type: EVENTS.WAITLIST_ADDED,
              productId: data.productId,
              data
            });
          }
        });
        eventBus.on(EVENTS.MULTI_LIST_ADDED, (data) => {
          if (data.fromOtherTab) return;
          if (data.status === "success") {
            syncManager.broadcastUpdate({
              type: EVENTS.MULTI_LIST_ADDED,
              productId: data.productId,
              data
            });
            const isMerge = state_cache_default.getConfig()?.mergeLists === true;
            if (isMerge && data.productId && data.data) {
              syncManager.broadcastUpdate({
                type: EVENTS.WISHLIST_ADDED,
                productId: data.productId,
                data: {
                  ...data.data,
                  mergedFromMultiList: true
                }
              });
            }
          }
        });
        eventBus.on(EVENTS.MULTI_LIST_REMOVED, (data) => {
          if (data.fromOtherTab) return;
          if (data.status === "success") {
            syncManager.broadcastUpdate({
              type: EVENTS.MULTI_LIST_REMOVED,
              productId: data.productId,
              data
            });
            const isMerge = state_cache_default.getConfig()?.mergeLists === true;
            if (isMerge && data.productId) {
              syncManager.broadcastUpdate({
                type: EVENTS.WISHLIST_REMOVED,
                productId: data.productId,
                data: { ...data, mergedFromMultiList: true }
              });
            }
          }
        });
        eventBus.on(EVENTS.MULTI_LIST_CREATED, (data) => {
          if (data.fromOtherTab) return;
          if (data.status === "success") {
            syncManager.broadcastUpdate({
              type: EVENTS.MULTI_LIST_CREATED,
              data
            });
          }
        });
        eventBus.on(EVENTS.MULTI_LIST_DELETED, (data) => {
          if (data.fromOtherTab) return;
          if (data.status === "success") {
            syncManager.broadcastUpdate({
              type: EVENTS.MULTI_LIST_DELETED,
              data
            });
            const isMerge = state_cache_default.getConfig()?.mergeLists === true;
            if (isMerge) {
              syncManager.broadcastUpdate({
                type: EVENTS.WISHLIST_REMOVED,
                productId: null,
                data: { ...data, mergedListDeleted: true }
              });
            }
          }
        });
        eventBus.on(EVENTS.ACTION_FAILED, (data) => {
          if (data.error) console.warn("[Action Failed]", data);
        });
        eventBus.on(EVENTS.OFFLINE_STATUS_CHANGED, (data) => {
          console.log(
            "[ModernSystem]",
            data.online ? "Back online" : "Going offline"
          );
        });
        document.addEventListener("add_to_cart_message", (ev) => {
          const { message, button } = ev.detail || {};
          eventBus.emit("cart:message", { message, button });
        });
        let storageWarningShown = false;
        document.addEventListener("wlfmc:storage-state", (event) => {
          const detail = event.detail || {};
          window.wlfmcStorageMode = detail.mode;
          if (detail.volatile && !storageWarningShown) {
            storageWarningShown = true;
            showInfo(window.wlfmc_l10n?.labels?.storage_volatile_warning);
          }
        });
        window.addEventListener("beforeunload", () => {
          conflictManager.persistPendingOperations();
        });
        window.addEventListener("pageshow", (event) => {
          if (event.persisted) {
            syncManager.syncAll();
          }
        });
      },
      getStatus() {
        const moduleStatus = {};
        Object.keys(this._modules).forEach((name) => {
          const mod = this._modules[name];
          moduleStatus[name] = mod.getStatus ? mod.getStatus() : {};
        });
        return {
          initialized: this.initialized,
          enabled: this._isEnabled,
          premium: this._premium,
          queue: queueManager.getStatus(),
          store: state_cache_default.getFullState(),
          modules: moduleStatus
        };
      },
      disable() {
        if (!this._isEnabled) return;
        this._isEnabled = false;
      }
    };
  }

  // src/frontend/js/modern/modules/wishlist/store.js
  var WishlistStore = class extends BaseStore {
    constructor() {
      super("wishlist", "product_id");
    }
  };
  var wishlistModuleStore = new WishlistStore();
  var store_default = wishlistModuleStore;

  // src/frontend/js/modern/shared/module-base.js
  var BaseModule = class {
    constructor(name, store, actions, ui, handlers = []) {
      this.name = name;
      this.store = store;
      this.actions = actions;
      this.ui = ui;
      this.handlers = handlers;
      this._initialized = false;
      eventBus.on("ui:applyState", () => {
        if (this.applyState) this.applyState();
      });
    }
    init() {
      if (this._initialized) return;
      if (this.handlers && this.handlers.length > 0) {
        eventManager.registerModuleHandlers(this.name, this.handlers);
      }
      this._initialized = true;
    }
    getStatus() {
      const count = this.store.count ? this.store.count.get() : 0;
      const items = this.store.items ? this.store.items.get() : [];
      return { count, items: items.length };
    }
    async executeWithConflictManagement(scope, actionId, optimisticFn, rollbackFn, serverFn, onSuccess, onError, config = {}) {
      await waitForInit();
      return conflictManager.execute({
        scope,
        actionId,
        type: config.type || "add",
        module: this.name,
        productId: config.productId || null,
        listId: config.listId || null,
        optimisticFn,
        rollbackFn,
        serverFn,
        onSuccess,
        onError,
        // Data-only callback: invoked when the server response arrives
        // but a newer opposite operation is already pending. The module
        // uses this to persist identity data (item_id, wishlist_id)
        // without triggering any UI side-effects.
        onDataOnly: config.onDataOnly || null,
        serverData: config.serverData || null,
        options: config.options || {},
        element: config.element || null
      });
    }
    /**
     * Capture the current store item + cached display data before an optimistic
     * removal, so a rollback can restore the exact previous state (no ghost rows).
     */
    snapshotItem(productId) {
      const item = this.store.getItem ? this.store.getItem(productId) : null;
      const display = this.store.getDisplayData ? this.store.getDisplayData(productId) : null;
      return { item, display };
    }
    /**
     * Restore a snapshot taken with snapshotItem(). Re-adds the store item with
     * its original data and patches the UI back (pending state never persists).
     */
    restoreSnapshot(snapshot, productId) {
      if (!snapshot || !snapshot.item) return;
      if (!this.store.hasItem(productId)) {
        const { _optimistic, _timestamp, ...itemData } = snapshot.item;
        this.store.addItem(productId, itemData);
      }
      if (snapshot.display && this.store.setDisplayData) {
        this.store.setDisplayData(productId, snapshot.display);
      }
      if (this.ui?.confirmCounterItem) {
        this.ui.confirmCounterItem(productId, { ...snapshot.item || {}, ...snapshot.display || {} });
      }
      if (this.ui?.updateAddButton) {
        this.ui.updateAddButton(productId, snapshot.item || {});
      }
    }
    registerHandlers(handlers) {
      if (handlers && handlers.length) {
        eventManager.registerModuleHandlers(this.name, handlers);
      }
    }
    applyState() {
    }
    reInit() {
      if (this.ui && typeof this.ui.reInit === "function") {
        this.ui.reInit();
      }
      eventBus.emit(EVENTS.UI_REINIT, { module: this.name });
    }
  };

  // src/frontend/js/modern/shared/base-list-ui.js
  var BaseListUI = class {
    constructor(config) {
      this.moduleName = config.moduleName;
      this.store = config.store;
      this.selectors = config.selectors || {};
      this._selectors = {
        table: `.wlfmc-${this.moduleName}-table`,
        tableWrapper: `.wlfmc-${this.moduleName}-table-wrapper`,
        row: ".wlfmc-table-item",
        ...this.selectors
      };
      this._counterSelectors = this._resolveCounterSelectors();
      this._configCache = /* @__PURE__ */ new Map();
      this._renderScheduled = false;
      if (this.store) {
        this._stateUnsubscribe = stateCache.subscribe(this.moduleName, () => {
          this._scheduleRender();
        });
      } else {
        this._stateUnsubscribe = null;
      }
    }
    /* ═══════════════════════════════════════════
       REACTIVE RENDERING (Single Source of Truth)
    ════════════════════════════════════════════ */
    /**
     * Schedule a render pass in the next microtask.
     * Multiple state mutations within the same tick collapse into one render.
     */
    _scheduleRender() {
      if (this._renderScheduled) return;
      this._renderScheduled = true;
      Promise.resolve().then(() => {
        this._renderScheduled = false;
        this.renderFromState();
      });
    }
    /**
     * Full render from state — the single entry point for all UI reconciliation.
     * Reads items and count exclusively from StateCache (the single source of
     * truth) and reconciles counter numbers, icons, mini-list rows, and
     * empty-state visibility.
     *
     * Subclasses with different rendering needs (e.g. multi-list rows)
     * override this method.
     */
    renderFromState() {
      const items = stateCache.getItems(this.moduleName);
      const count = stateCache.getCount(this.moduleName);
      this.syncCounterItems(items);
      this.updateCounter(count);
    }
    /**
     * Tear down the reactive subscription to prevent memory leaks.
     */
    destroy() {
      if (this._stateUnsubscribe) {
        this._stateUnsubscribe();
        this._stateUnsubscribe = null;
      }
      this._configCache.clear();
    }
    /* ═══════════════════════════════════════════
       COUNTER SELECTORS / CONFIG
       Unified wrapper selector with data-counter-type filtering.
       PHP templates render 'wlfmc-counter-wrapper' on all counter types;
       module-specific filtering is done via data-counter-type attribute.
    ════════════════════════════════════════════ */
    _resolveCounterSelectors() {
      return {
        wrapper: ".wlfmc-counter-wrapper",
        itemsContainer: ".wlfmc-wishlist-items-wrapper",
        contentContainer: ".wlfmc-counter-content",
        viewLink: ".wlfmc-view-wishlist-link",
        total: ".total-products",
        totalCount: ".wlfmc-total-count",
        number: ".products-counter-number",
        icon: ".wlfmc-counter-icon",
        emptyClass: "wlfmc-wishlist-empty"
      };
    }
    _getConfig(wrapper) {
      if (!wrapper) return null;
      const uniqueId = wrapper.dataset.id || wrapper.getAttribute("data-id");
      const counterType = wrapper.dataset.counterType || wrapper.getAttribute("data-counter-type") || this.moduleName;
      if (!uniqueId) {
        console.log("[BaseListUI] Counter wrapper missing data-id:", wrapper);
        return null;
      }
      const key = `${counterType}_${uniqueId}`;
      if (!this._configCache.has(key)) {
        this._configCache.set(key, {
          uniqueId,
          counterType,
          emptyIcon: wrapper.dataset.emptyIcon || "",
          hasItemsIcon: wrapper.dataset.hasItemsIcon || "",
          url: wrapper.dataset.wishlistUrl || wrapper.dataset.listsUrl || "",
          buttonText: wrapper.dataset.buttonText || "",
          totalText: wrapper.dataset.totalText || "",
          buttonPosition: wrapper.dataset.buttonPosition || "after",
          showTotals: wrapper.dataset.showTotals !== "0",
          showButton: wrapper.dataset.showButton !== "0",
          showCounter: wrapper.dataset.showCounter !== "0",
          numberPosition: wrapper.dataset.productsNumberPosition || this._detectNumberPosition(wrapper.querySelector(".wlfmc-counter")),
          token: wrapper.dataset.wishlistToken || "",
          id: wrapper.dataset.wishlistId || "",
          perPage: parseInt(wrapper.dataset.perPage || wrapper.dataset.per_page || "0", 10) || 0,
          hideZero: wrapper.dataset.hideZero === "1",
          hideIfEmpty: wrapper.dataset.hideIfEmpty === "1"
        });
      }
      return this._configCache.get(key);
    }
    _detectNumberPosition(anchor) {
      if (!anchor) return "";
      const cls = Array.from(anchor.classList).find((c) => c.startsWith("products-number-position-"));
      return cls ? cls.replace("products-number-position-", "") : "";
    }
    _ensureCounterNumbers(wrapper, config) {
      const selectors = this._counterSelectors;
      const anchor = wrapper.querySelector(".wlfmc-counter");
      if (!anchor || !config.showCounter) return;
      const pos = config.numberPosition || this._detectNumberPosition(anchor);
      const isRtl = document.documentElement.dir === "rtl" || window.wlfmc_l10n?.is_rtl === true;
      const makeNumber = (extraClass) => {
        let num2 = null;
        if (extraClass) {
          num2 = wrapper.querySelector(`.products-counter-number.${extraClass}`);
        } else {
          num2 = anchor.querySelector(
            ":scope > .products-counter-number:not(.position-top-left):not(.position-top-right)"
          );
        }
        if (!num2) {
          num2 = document.createElement("span");
          num2.className = "wlfmc-counter-number products-counter-number" + (extraClass ? " " + extraClass : "");
        }
        return num2;
      };
      if ("top-right" === pos || "top-left" === pos) {
        const iconEl2 = wrapper.querySelector(selectors.icon);
        if (!iconEl2) return;
        const num2 = makeNumber("top-right" === pos ? "position-top-right" : "position-top-left");
        if (num2.parentNode !== iconEl2) {
          iconEl2.appendChild(num2);
        }
        return;
      }
      const wantBeforeText = "left" === pos && !isRtl || "right" === pos && isRtl;
      const num = makeNumber("");
      const textEl = anchor.querySelector(":scope > .wlfmc-counter-text");
      const iconEl = anchor.querySelector(":scope > .wlfmc-counter-icon");
      if (wantBeforeText) {
        if (textEl) {
          textEl.before(num);
        } else if (iconEl) {
          iconEl.after(num);
        } else {
          anchor.prepend(num);
        }
      } else if (textEl) {
        textEl.after(num);
      } else {
        anchor.appendChild(num);
      }
    }
    _forEachCounter(fn) {
      const moduleType = this.moduleName;
      document.querySelectorAll(this._counterSelectors.wrapper).forEach((wrapper) => {
        const counterType = wrapper.dataset.counterType || wrapper.getAttribute("data-counter-type") || "";
        if (counterType && counterType !== moduleType) return;
        const config = this._getConfig(wrapper);
        if (config) {
          fn(wrapper, config, this._counterSelectors);
        }
      });
    }
    /* ═══════════════════════════════════════════
       COUNTER NUMBER / ICON / VISIBILITY
       Single source of truth for all counter updates.
       No external registry needed.
    ════════════════════════════════════════════ */
    updateCounter(count = null) {
      let finalCount;
      if (count !== null && count !== void 0 && Number.isFinite(count)) {
        finalCount = count;
      } else {
        try {
          finalCount = this.store.count.get();
        } catch (e) {
          finalCount = this.getDomCount ? this.getDomCount() : 0;
        }
      }
      const selectors = this._counterSelectors;
      const str = String(finalCount);
      this._forEachCounter((wrapper, config) => {
        this._ensureCounterNumbers(wrapper, config);
        wrapper.querySelectorAll(selectors.number).forEach((el) => {
          if (el.textContent !== str) el.textContent = str;
        });
        const iconEl = wrapper.querySelector(selectors.icon);
        if (iconEl) {
          this._updateIconGraphic(iconEl, finalCount > 0 ? config.hasItemsIcon : config.emptyIcon);
        }
        if (config.hideZero) {
          wrapper.querySelectorAll(selectors.number).forEach((el) => {
            el.style.display = finalCount === 0 ? "none" : "";
          });
        }
        if (config.hideIfEmpty) wrapper.style.display = finalCount === 0 ? "none" : "";
        wrapper.classList.toggle("empty", finalCount === 0);
        wrapper.querySelectorAll(`${selectors.total} ${selectors.totalCount}`).forEach((el) => {
          if (el.textContent !== str) el.textContent = str;
        });
        const itemsWrap = wrapper.querySelector(selectors.itemsContainer);
        const rowCount = itemsWrap ? itemsWrap.querySelectorAll("[data-row-id]").length : 0;
        const showStructure = finalCount > 0 && rowCount > 0;
        this._ensureExtras(wrapper, config, showStructure ? finalCount : 0);
        this._setEmptyState(wrapper, config, !showStructure);
      });
    }
    _updateIconGraphic(iconEl, html) {
      const previous = iconEl.dataset.wlfmcIcon || "";
      if (previous === html) return;
      iconEl.dataset.wlfmcIcon = html;
      const holder = document.createElement("div");
      holder.innerHTML = html;
      const nextNodes = Array.from(holder.childNodes);
      Array.from(iconEl.childNodes).forEach((node) => {
        if (node.nodeType === 1 && node.classList && node.classList.contains("products-counter-number")) {
          return;
        }
        node.remove();
      });
      const firstNumber = iconEl.querySelector(".products-counter-number");
      nextNodes.forEach((node) => {
        iconEl.insertBefore(node, firstNumber || null);
      });
    }
    /* ═══════════════════════════════════════════
       TOTALS & VIEW LINKS (empty <-> full structure switch)
    ════════════════════════════════════════════ */
    _ensureExtras(wrapper, config, count) {
      const selectors = this._counterSelectors;
      const content = wrapper.querySelector(selectors.contentContainer);
      if (!content) return;
      const itemsWrap = content.querySelector(selectors.itemsContainer);
      const totals = content.querySelector(":scope > " + selectors.total);
      let beforeLink = null;
      let afterLink = null;
      content.querySelectorAll(":scope > " + selectors.viewLink).forEach((link) => {
        if (link.classList.contains("center-align")) {
          afterLink = afterLink || link;
        } else {
          beforeLink = beforeLink || link;
        }
      });
      if (count > 0) {
        if (!beforeLink && config.showButton && "before" === config.buttonPosition && config.buttonText) {
          beforeLink = document.createElement("a");
          beforeLink.href = config.url;
          beforeLink.className = selectors.viewLink.replace(".", "");
          beforeLink.textContent = config.buttonText;
          content.insertBefore(beforeLink, content.firstChild);
        }
        if (!totals && config.showTotals && itemsWrap) {
          const totalsEl = document.createElement("div");
          totalsEl.className = "total-products d-flex space-between";
          const title = document.createElement("span");
          title.className = "wlfmc-total-title";
          title.textContent = config.totalText;
          const value = document.createElement("span");
          value.className = "wlfmc-total-count";
          value.textContent = String(count);
          totalsEl.appendChild(title);
          totalsEl.appendChild(value);
          itemsWrap.after(totalsEl);
        }
        if (!afterLink && config.showButton && "after" === config.buttonPosition && config.buttonText) {
          afterLink = document.createElement("a");
          afterLink.href = config.url;
          afterLink.className = selectors.viewLink.replace(".", "") + " center-align";
          afterLink.textContent = config.buttonText;
          content.appendChild(afterLink);
        }
        content.querySelectorAll(`${selectors.total}, ${selectors.viewLink}`).forEach((el) => {
          el.style.display = "";
        });
      } else {
        content.querySelectorAll(`${selectors.itemsContainer},${selectors.total}, ${selectors.viewLink}`).forEach((el) => {
          el.remove();
        });
      }
    }
    _setEmptyState(wrapper, config, isEmpty) {
      const selectors = this._counterSelectors;
      const content = wrapper.querySelector(selectors.contentContainer);
      if (!content) return;
      const existingEmpty = content.querySelector(":scope > ." + selectors.emptyClass);
      if (isEmpty && !existingEmpty) {
        const template = window.wp?.template?.(`wlfmc-mini-${config.counterType}-empty-${config.uniqueId}`);
        if (template) {
          const holder = document.createElement("div");
          holder.innerHTML = template({});
          const emptyEl = holder.firstElementChild;
          if (emptyEl) content.appendChild(emptyEl);
        }
      } else if (!isEmpty && existingEmpty) {
        existingEmpty.remove();
      }
      this._ensureExtras(wrapper, config, isEmpty ? 0 : 1);
    }
    _ensureItemsWrapper(wrapper) {
      const selectors = this._counterSelectors;
      const content = wrapper.querySelector(selectors.contentContainer);
      if (!content) return null;
      let itemsWrap = content.querySelector(":scope > " + selectors.itemsContainer);
      if (!itemsWrap) {
        itemsWrap = document.createElement("div");
        itemsWrap.className = "wlfmc-mini-wishlist-list wlfmc-wishlist-items-wrapper";
        const anchor = content.querySelector(":scope > " + selectors.total) || Array.from(content.children).find(
          (el) => el.classList.contains("center-align") && el.matches(selectors.viewLink)
        );
        content.insertBefore(itemsWrap, anchor || null);
      }
      return itemsWrap;
    }
    /* ═══════════════════════════════════════════
       COUNTER ITEMS (point-update primitives)
    ════════════════════════════════════════════ */
    _resolveDisplay(item) {
      if (!item) return null;
      const pid = String(item.product_id);
      const shared = this.store && this.store.getDisplayData ? this.store.getDisplayData(pid) : null;
      const listSpecific = {};
      if (item.item_id !== void 0) listSpecific.item_id = item.item_id;
      if (item.wishlist_id !== void 0) listSpecific.wishlist_id = item.wishlist_id;
      if (item.remove_url !== void 0) listSpecific.remove_url = item.remove_url;
      if (item.remove_nonce !== void 0) listSpecific.remove_nonce = item.remove_nonce;
      if (item.list_name !== void 0) listSpecific.list_name = item.list_name;
      if (item.wishlist_token !== void 0) listSpecific.wishlist_token = item.wishlist_token;
      if (shared) {
        return { ...shared, ...listSpecific };
      }
      if (item.display && (item.display.name || item.display.image)) {
        return { ...item.display, ...listSpecific };
      }
      if (item.name || item.image) return item;
      return null;
    }
    _renderItemElement(wrapper, config, productId, data, pending) {
      const template = window.wp?.template?.(`wlfmc-mini-${config.counterType}-item-${config.uniqueId}`);
      if (!template) {
        console.log("[BaseListUI] Template not found:", `wlfmc-mini-${config.counterType}-item-${config.uniqueId}`);
        return null;
      }
      const holder = document.createElement("div");
      holder.innerHTML = template({ product_id: productId, ...data, pending: !!pending });
      return holder.firstElementChild;
    }
    _patchItemElement(el, data = {}, pending = false) {
      if (!el) return;
      if (pending) {
        el.classList.add("wlfmc-pending");
      } else {
        if (data.image) {
          const thumb = el.querySelector(".product-thumbnail");
          if (thumb) thumb.innerHTML = data.image;
        }
        if (data.name !== void 0 && data.name !== "") {
          const nameEl = el.querySelector(".product-name");
          if (nameEl) nameEl.textContent = data.name;
        }
        if (data.price) {
          const priceSpan = el.querySelector(".product-price span");
          if (priceSpan) priceSpan.innerHTML = data.price;
        }
        if (data.item_id) el.dataset.itemId = data.item_id;
        if (data.wishlist_id) el.dataset.wishlistId = data.wishlist_id;
        if (data.wishlist_token) el.dataset.wishlistToken = data.wishlist_token;
        if (data.url) {
          el.querySelectorAll("a.product-thumbnail, a.product-name").forEach((a) => {
            a.setAttribute("href", data.url);
          });
        }
        if (data.remove_url || data.remove_nonce) {
          const removeLink = el.querySelector(".remove_from_wishlist");
          if (removeLink) {
            if (data.remove_url) removeLink.setAttribute("href", data.remove_url);
            if (data.remove_nonce) removeLink.setAttribute("data-nonce", data.remove_nonce);
          }
        }
        if (data.list_name !== void 0) {
          const badgeHost = el.querySelector(".max-100");
          if (badgeHost) {
            let badge = badgeHost.querySelector(".wlfmc-badge");
            if (data.list_name) {
              if (!badge) {
                badge = document.createElement("div");
                badge.className = "wlfmc-badge";
                badgeHost.appendChild(badge);
              }
              badge.textContent = data.list_name;
              badge.style.display = "";
            } else if (badge) {
              badge.remove();
            }
          }
        }
        el.classList.remove("wlfmc-pending");
      }
      el.querySelectorAll("a, button, input, select").forEach((child) => {
        if (pending) {
          child.setAttribute("disabled", "disabled");
        } else {
          child.removeAttribute("disabled");
        }
        child.style.pointerEvents = "";
      });
    }
    addCounterItem(productId, itemData = {}) {
      this._forEachCounter((wrapper, config) => {
        const itemsWrap = this._ensureItemsWrapper(wrapper);
        if (!itemsWrap) return;
        if (itemsWrap.querySelector(`[data-row-id="${productId}"]`)) return;
        const itemEl = this._renderItemElement(wrapper, config, productId, itemData, true);
        if (!itemEl) return;
        itemsWrap.appendChild(itemEl);
        this._setEmptyState(wrapper, config, false);
      });
    }
    confirmCounterItem(productId, serverData = {}) {
      this._forEachCounter((wrapper) => {
        const itemsWrap = wrapper.querySelector(this._counterSelectors.itemsContainer);
        if (!itemsWrap) return;
        const itemEl = itemsWrap.querySelector(`[data-row-id="${productId}"]`);
        if (!itemEl) return;
        this._patchItemElement(itemEl, serverData, false);
      });
    }
    removeCounterItem(productId) {
      this._forEachCounter((wrapper, config) => {
        const itemsWrap = wrapper.querySelector(this._counterSelectors.itemsContainer);
        if (!itemsWrap) return;
        const itemEl = itemsWrap.querySelector(`[data-row-id="${productId}"]`);
        if (itemEl) itemEl.remove();
        const remaining = itemsWrap.querySelectorAll("[data-row-id]");
        if (remaining.length === 0) {
          this._setEmptyState(wrapper, config, true);
        }
      });
    }
    /**
     * Diff-sync counter mini-list rows with the current StateCache snapshot.
     *
     * In merge mode (wishlist module only), uses getMergedWishlistItems()
     * which returns deduplicated items from ALL lists with concatenated
     * list_name badges. This ensures the counter reflects the true merged
     * state without requiring a page refresh.
     *
     * Optimistic-aware reconciliation:
     *  - Items with _optimistic: true  → rendered/kept as pending rows
     *  - Items with _optimistic: false → confirmed rows (pending class removed)
     *  - Pending DOM rows whose state item is now confirmed → patched & un-pended
     *  - Pending DOM rows whose state item is still pending  → left untouched
     *  - Stale rows not present in state → removed (pending or not)
     */
    syncCounterItems(items = []) {
      const selectors = this._counterSelectors;
      const isMerge = this.moduleName === "wishlist" && stateCache.getConfig()?.mergeLists === true;
      const source = isMerge ? stateCache.getMergedWishlistItems() : (items || []).filter((item) => item && item.product_id !== void 0);
      this._forEachCounter((wrapper, config) => {
        const content = wrapper.querySelector(selectors.contentContainer);
        if (!content) return;
        const itemsWrap = this._ensureItemsWrapper(wrapper);
        const desired = /* @__PURE__ */ new Map();
        const limited = config.perPage > 0 ? source.slice(0, config.perPage) : source;
        limited.forEach((item) => desired.set(String(item.product_id), item));
        desired.forEach((item, pid) => {
          let el = itemsWrap.querySelector(`[data-row-id="${pid}"]`);
          const isPending = item._optimistic === true;
          if (el) {
            if (el.classList.contains("wlfmc-pending")) {
              if (isPending) {
                if (isMerge && item.list_name !== void 0) {
                  this._patchItemElement(el, { list_name: item.list_name }, true);
                }
                return;
              }
              const data = this._resolveDisplay(item);
              this._patchItemElement(el, data || {}, false);
              return;
            }
            if (!isPending) {
              const data = this._resolveDisplay(item);
              if (data) this._patchItemElement(el, data, false);
            }
          } else {
            const data = this._resolveDisplay(item);
            if (!isPending && (!data || !data.name && !data.image)) return;
            el = this._renderItemElement(wrapper, config, pid, data || {}, isPending);
            if (!el) return;
            if (isPending) el.classList.add("wlfmc-pending");
            itemsWrap.appendChild(el);
          }
        });
        itemsWrap.querySelectorAll("[data-row-id]").forEach((el) => {
          const pid = el.getAttribute("data-row-id");
          if (!desired.has(String(pid))) {
            el.remove();
          }
        });
        const hasRows = itemsWrap.querySelectorAll("[data-row-id]").length > 0;
        this._setEmptyState(wrapper, config, !hasRows);
      });
    }
    /* ═══════════════════════════════════════════
       UTILITIES
    ════════════════════════════════════════════ */
    getDomCount() {
      const ids = /* @__PURE__ */ new Set();
      document.querySelectorAll(`.wlfmc-add-to-${this.moduleName}.exists`).forEach((el) => {
        const cls = Array.from(el.classList).find((c) => c.startsWith(`wlfmc-add-to-${this.moduleName}-`));
        const pid = cls ? cls.replace(`wlfmc-add-to-${this.moduleName}-`, "") : el.dataset.productId || "";
        if (pid) ids.add(String(pid));
      });
      return ids.size;
    }
    reInit() {
      this._configCache.clear();
    }
  };

  // src/frontend/js/modern/modules/wishlist/ui.js
  var WishlistUI = class extends BaseListUI {
    constructor() {
      super({
        moduleName: "wishlist",
        store: store_default,
        selectors: {
          wishlistTable: ".wlfmc-wishlist-table",
          tableWrapper: ".wlfmc-wishlist-table-wrapper",
          miniWishlist: ".wlfmc-products-counter-wrapper"
        }
      });
    }
    /* ═══════════════════════════════════════════
       REACTIVE RENDER — Single Source of Truth
       Overrides BaseListUI to also reconcile
       product-page add-to-wishlist buttons.
    ════════════════════════════════════════════ */
    renderFromState() {
      const items = state_cache_default.getItems(this.moduleName);
      const count = state_cache_default.getCount(this.moduleName);
      this.syncCounterItems(items);
      this.updateCounter(count);
      this.syncAddButtons(items);
    }
    /**
     * Reconcile all add-to-wishlist buttons on product pages with the
     * current StateCache snapshot. Adds/removes the 'exists' class and
     * patches delete-button dataset attributes.
     *
     * In merge mode, a product is considered "exists" if it appears in
     * ANY multi-list, not just the default wishlist.
     */
    syncAddButtons(items) {
      const isMerge = state_cache_default.getConfig()?.mergeLists === true;
      const currentProductIds = new Set(
        (items || []).map((item) => String(item.product_id))
      );
      const itemMap = /* @__PURE__ */ new Map();
      (items || []).forEach((item) => {
        itemMap.set(String(item.product_id), item);
      });
      document.querySelectorAll(".wlfmc-add-to-wishlist").forEach((el) => {
        const cls = Array.from(el.classList).find((c) => c.startsWith("wlfmc-add-to-wishlist-"));
        const pid = cls ? cls.replace("wlfmc-add-to-wishlist-", "") : el.dataset.productId || "";
        if (!pid) return;
        const shouldBeExists = isMerge ? state_cache_default.isProductInAnyList(pid) : currentProductIds.has(String(pid));
        const isCurrentlyExists = el.classList.contains("exists");
        if (shouldBeExists && !isCurrentlyExists) {
          el.classList.add("exists");
          const item = itemMap.get(String(pid));
          if (item?.item_id) {
            const deleteBtn = el.querySelector(".wlfmc_delete_item");
            if (deleteBtn) {
              deleteBtn.dataset.itemId = item.item_id;
              deleteBtn.dataset.wishlistId = item.wishlist_id;
            }
          }
        } else if (!shouldBeExists && isCurrentlyExists) {
          el.classList.remove("exists");
        }
      });
    }
    /**
     * Refresh the wishlist TABLE content via targeted fragment loading.
     * Delegates to FragmentManager which handles the admin-ajax call,
     * DOM replacement, and re-initialization automatically.
     */
    refreshTableFromServer() {
      fragment_manager_default.loadFragments({ s: "wishlist" });
    }
    updateAddButton(productId, data = {}) {
      const selector = `.wlfmc-add-to-wishlist-${productId}`;
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add("exists");
        if (data.item_id) {
          const removeBtn = el.querySelector(".wlfmc_delete_item");
          if (removeBtn) {
            removeBtn.dataset.itemId = data.item_id;
            removeBtn.dataset.wishlistId = data.wishlist_id || "";
          }
        }
        const afterSecondClick = el.dataset.afterSecondClick || "remove";
        el.classList.remove("show-remove-after-add", "show-browse-after-add", "show-exists-after-add");
        el.classList.add(`show-${afterSecondClick}-after-add`);
      });
      this.showTableRow(productId);
      this.showMiniWishlistItem(productId);
    }
    updateRemoveButton(productId) {
      const isMerge = state_cache_default.getConfig()?.mergeLists === true;
      const selector = `.wlfmc-add-to-wishlist-${productId}`;
      if (isMerge) {
        const stillInAnyList = state_cache_default.isProductInAnyList(productId);
        if (!stillInAnyList) {
          document.querySelectorAll(selector).forEach((el) => {
            el.classList.remove("exists");
          });
          this.hideMiniWishlistItem(productId);
        }
      } else {
        document.querySelectorAll(selector).forEach((el) => {
          el.classList.remove("exists");
        });
        this.hideMiniWishlistItem(productId);
      }
    }
    hideTableRow(productId) {
      document.querySelectorAll(`${this._selectors.wishlistTable} [data-row-id="${productId}"]`).forEach((row) => {
        row.style.display = "none";
      });
    }
    showTableRow(productId) {
      document.querySelectorAll(`${this._selectors.wishlistTable} [data-row-id="${productId}"]`).forEach((row) => {
        row.style.display = "";
      });
    }
    hideMiniWishlistItem(productId) {
      document.querySelectorAll(`${this._selectors.miniWishlist} [data-row-id="${productId}"]`).forEach((item) => {
        item.style.display = "none";
      });
    }
    showMiniWishlistItem(productId) {
      document.querySelectorAll(`${this._selectors.miniWishlist} [data-row-id="${productId}"]`).forEach((item) => {
        item.style.display = "";
      });
    }
    updatePopupContent(popup, data = {}, productTitle = "", originalPrice = "") {
      if (!popup) return;
      const popupData = popup.dataset;
      const titleTemplate = window.wlfmc_l10n?.labels?.popup_title;
      const descTemplate = window.wlfmc_l10n?.labels?.popup_content;
      const price = data.price_html || originalPrice || popup.querySelector(".wlfmc-parent-product-price")?.innerHTML || "";
      const title = productTitle || popupData.productTitle || "";
      let titleHtml = titleTemplate.replace(/{product_name}/g, title).replace(/{product_price}/g, price);
      let descHtml = descTemplate.replace(/{product_name}/g, title).replace(/{product_price}/g, price);
      const titleEl = popup.querySelector(".wlfmc-popup-title");
      const descEl = popup.querySelector(".wlfmc-popup-desc");
      if (titleEl) titleEl.innerHTML = titleHtml;
      if (descEl) descEl.innerHTML = descHtml;
      const img = popup.querySelector(".wlfmc-popup-header img");
      if (img) {
        const useFeatured = popupData.useFeatured === "true";
        const imageSize = popupData.imageSize || "large";
        let imageSrc = img.dataset.src || img.src;
        if (useFeatured && data.image_id) {
          if (imageSize === "large" && data.image?.full_src) imageSrc = data.image.full_src;
          else if (imageSize === "thumbnail" && data.image?.thumb_src) imageSrc = data.image.thumb_src;
          else if (data.image?.src) imageSrc = data.image.src;
        }
        img.src = imageSrc;
      }
      const priceHidden = popup.querySelector(".wlfmc-parent-product-price");
      if (priceHidden) priceHidden.innerHTML = price;
    }
    showWishlistPopupIfNeeded(element, productId) {
      const elWrap = element.closest(`.wlfmc-add-to-wishlist-${productId}`);
      if (!elWrap) return;
      const popupId = elWrap.dataset.popupId;
      if (!popupId && window.wlfmc_l10n?.labels?.product_added_text) {
        showSuccess(window.wlfmc_l10n.labels.product_added_text);
      }
      if (!popupId) {
        return;
      }
      const popup = document.getElementById(popupId);
      if (!popup) return;
      const tooltip = document.getElementById("wlfmc-tooltip");
      if (tooltip) {
        tooltip.style.top = "0";
        tooltip.style.left = "0";
        tooltip.className = "tooltip__hidden";
      }
      const productTitle = popup.dataset.productTitle || "";
      const originalPrice = popup.querySelector(".wlfmc-parent-product-price")?.innerHTML || "";
      const variationData = {
        price_html: originalPrice,
        image: { src: popup.querySelector(".wlfmc-popup-header img")?.src || "" }
      };
      this.updatePopupContent(popup, variationData, productTitle, originalPrice);
      showPopup(popup);
    }
  };
  var wishlistUI = new WishlistUI();
  var ui_default = wishlistUI;

  // src/frontend/js/modern/shared/api-helpers.js
  function loadAutomations(productId, wishlistId, customerId, listType, nonce) {
    if (!productId || !wishlistId || !customerId) return;
    const l10n = window.wlfmc_l10n || {};
    const action = l10n.actions && l10n.actions.load_automations || "wlfmc_load_automations";
    const isRest = l10n.ajax_mode === "rest_api";
    const formData = new FormData();
    formData.append("action", action);
    formData.append("nonce", nonce || l10n.nonce || "");
    formData.append("context", "frontend");
    formData.append("product_id", String(productId));
    formData.append("wishlist_id", String(wishlistId));
    formData.append("customer_id", String(customerId));
    formData.append("list_type", listType);
    const options = { method: "POST", body: formData };
    const headers = {};
    if (isRest && l10n.nonce) {
      headers["X-WP-Nonce"] = l10n.nonce;
      options.headers = headers;
    }
    return fetch(l10n.ajax_url, options).catch((error) => console.warn("[API] Load automations failed:", error));
  }

  // src/frontend/js/modern/modules/wishlist/actions.js
  var WishlistActions = class extends BaseModule {
    constructor() {
      super("wishlist", store_default, null, ui_default);
    }
    _getIsMerge() {
      return window.wlfmc_l10n?.merge_lists === "true";
    }
    _getIsMergeSaveForLater() {
      return window.wlfmc_l10n?.merge_save_for_later === true || window.wlfmc_l10n?.merge_save_for_later === "1" || window.wlfmc_l10n?.merge_save_for_later === "true";
    }
    async add(productId, formData, options = {}) {
      const isMerge = this._getIsMerge();
      const scope = ScopeHelper.wishlist(productId, options.wishlistId || null, isMerge);
      const actionId = `wishlist_add_${productId}_${Date.now()}`;
      let successToastEl = null;
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => {
          this._optimisticAdd(productId, options.data || {});
          if (options.element) {
            this.ui.showWishlistPopupIfNeeded(options.element, productId);
          } else {
            successToastEl = showSuccess(window.wlfmc_l10n?.labels?.product_added_text);
          }
        },
        () => {
          this._optimisticRemove(productId);
          if (successToastEl && window.wlfmc_toastr) {
            window.wlfmc_toastr.clear(successToastEl, { force: true });
            successToastEl = null;
          }
        },
        () => queueManager.addWithDeduplication("add_to_wishlist", formData),
        (result) => this._handleAddSuccess(productId, result),
        (error) => this._handleAddError(productId, error),
        {
          type: "add",
          productId,
          listId: options.wishlistId,
          element: options?.element,
          onDataOnly: (result) => {
            if (result) {
              conflictManager.storeIdentity(scope, {
                item_id: result.item_id || null,
                wishlist_id: result.wishlist_id || null,
                wishlist_token: result.wishlist_token || "",
                remove_nonce: result.nonce || result.remove_nonce || ""
              });
            }
          }
        }
      );
    }
    async remove(productId, wishlistId = 0, wishlistToken = "", nonce = "", element = null) {
      const isMerge = this._getIsMerge();
      const scope = ScopeHelper.wishlist(productId, wishlistId, isMerge);
      const actionId = `wishlist_remove_${productId}_${Date.now()}`;
      let row = null;
      if (element) {
        row = element.closest("[data-row-id]");
        if (row) {
          row.classList.add("disabled-row");
          row.setAttribute("aria-busy", "true");
        }
        element.setAttribute("disabled", "true");
      }
      const snapshot = this.snapshotItem(productId);
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => this._optimisticRemove(productId),
        () => {
          this.restoreSnapshot(snapshot, productId);
          if (row) row.classList.remove("disabled-row");
        },
        () => {
          const identity = conflictManager.getIdentity(scope);
          const resolvedWishlistId = identity?.wishlist_id || wishlistId;
          const resolvedToken = identity?.wishlist_token || wishlistToken;
          const resolvedNonce = identity?.remove_nonce || nonce;
          if (identity) conflictManager.clearIdentity(scope);
          return queueManager.addWithDeduplication("remove_from_wishlist", {
            product_id: productId,
            remove_from_wishlist: productId,
            wishlist_id: resolvedWishlistId,
            wishlist_token: resolvedToken,
            nonce: resolvedNonce,
            _scope: scope
          });
        },
        (result) => {
          this._handleRemoveSuccess(productId, result, element, row);
        },
        (error) => {
          this._handleRemoveError(productId, error);
          if (row) row.classList.remove("disabled-row");
        },
        { type: "remove", productId, listId: wishlistId, element }
      );
    }
    async deleteByItemId(productId, itemId, wishlistId = 0, nonce = "", element) {
      const isMerge = this._getIsMerge();
      const scope = ScopeHelper.wishlist(productId, wishlistId, isMerge);
      const actionId = `wishlist_delete_${productId}_${Date.now()}`;
      const row = element?.closest("[data-row-id]");
      const snapshot = this.snapshotItem(productId);
      let removedToastEl = null;
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => {
          this._optimisticRemove(productId);
          if (window.wlfmc_l10n?.labels?.product_removed_text) {
            removedToastEl = showError(window.wlfmc_l10n.labels.product_removed_text);
          }
        },
        () => {
          this.restoreSnapshot(snapshot, productId);
          if (row) row.classList.remove("disabled-row");
          if (removedToastEl && window.wlfmc_toastr) {
            window.wlfmc_toastr.clear(removedToastEl, { force: true });
            removedToastEl = null;
          }
        },
        () => {
          const identity = conflictManager.getIdentity(scope);
          const resolvedWishlistId = identity?.wishlist_id || wishlistId;
          const resolvedItemId = identity?.item_id || itemId;
          const resolvedNonce = identity?.remove_nonce || nonce;
          if (identity) conflictManager.clearIdentity(scope);
          return queueManager.addWithDeduplication("delete_item", {
            product_id: productId,
            remove_from_wishlist: productId,
            wishlist_id: resolvedWishlistId,
            item_id: resolvedItemId,
            nonce: resolvedNonce,
            _scope: scope
          });
        },
        (result) => {
          this._handleRemoveSuccess(productId, result, element, row);
        },
        (error) => {
          this._handleRemoveError(productId, error);
        },
        { type: "delete", productId, listId: wishlistId, element }
      );
    }
    async counterRemove(productId, wishlistId = 0, nonce = "", wishlistToken = "", element = null) {
      const isMerge = this._getIsMerge();
      const scope = ScopeHelper.wishlist(productId, wishlistId, isMerge);
      const actionId = `wishlist_counter_remove_${productId}_${Date.now()}`;
      const snapshot = this.snapshotItem(productId);
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => this._optimisticRemove(productId),
        () => this.restoreSnapshot(snapshot, productId),
        () => {
          const identity = conflictManager.getIdentity(scope);
          const resolvedWishlistId = identity?.wishlist_id || wishlistId;
          const resolvedToken = identity?.wishlist_token || wishlistToken;
          const resolvedNonce = identity?.remove_nonce || nonce;
          if (identity) conflictManager.clearIdentity(scope);
          return queueManager.addWithDeduplication("remove_from_wishlist", {
            product_id: productId,
            remove_from_wishlist: productId,
            wishlist_id: resolvedWishlistId,
            wishlist_token: resolvedToken,
            merge_lists: isMerge,
            nonce: resolvedNonce,
            _scope: scope
          });
        },
        (result) => this._handleRemoveSuccess(productId, result, element, null),
        (error) => this._handleRemoveError(productId, error),
        { type: "remove", productId, listId: wishlistId, element }
      );
    }
    /* ═══════════════════════════════════════════
       OPTIMISTIC — State mutations ONLY.
       Toast is shown here (optimistic) and tracked
       so rollbackFn can dismiss it on failure.
    ════════════════════════════════════════════ */
    _optimisticAdd(productId, data = {}) {
      if (this.store.hasItem(productId)) {
        this.store.updateItem(productId, { ...data, _optimistic: true, _timestamp: Date.now() });
      } else {
        this.store.addItem(productId, data);
      }
      this.ui.updateAddButton(productId, { item_id: data.item_id || null, wishlist_id: data.wishlist_id || null });
    }
    _optimisticRemove(productId) {
      try {
        const pid = parseInt(productId, 10);
        if (this.store.hasItem(pid)) {
          this.store.removeItem(pid);
        }
        this.ui.updateRemoveButton(pid);
      } catch (error) {
        console.error("[Wishlist] Optimistic remove failed:", error);
      }
    }
    /* ═══════════════════════════════════════════
       SUCCESS / ERROR HANDLERS
       All toast messages come from wlfmc_l10n.labels
       (server-localized) or from error.message which
       carries the server-translated message.
    ════════════════════════════════════════════ */
    _handleAddSuccess(productId, result) {
      if (!result) return;
      if (result.result === "exists") {
        const alreadyText = window.wlfmc_l10n?.labels?.already_in_wishlist_text;
        if (alreadyText) {
          showError(alreadyText);
        }
        eventBus.emit(EVENTS.WISHLIST_ADDED, { productId, status: "already_exists", data: result });
        return;
      }
      if (window.wlfmc_l10n?.click_behavior === "add-redirect" && window.wlfmc_l10n?.wishlist_page_url) {
        window.location.href = window.wlfmc_l10n.wishlist_page_url;
      }
      if (result.item_id) {
        if (result.display) {
          this.store.setDisplayData(productId, result.display);
        }
        this.store.confirmAdd(productId, result);
        this.ui.updateAddButton(productId, { item_id: result.item_id, wishlist_id: result.wishlist_id });
        const jQuery = window.jQuery;
        if (jQuery) {
          const button = document.querySelector(`.wlfmc_add_to_wishlist[data-product-id="${productId}"]`);
          const wrapper = document.querySelector(`.wlfmc-add-to-wishlist-${productId}`);
          jQuery(document.body).trigger("wlfmc_added_to_wishlist", [ensurejQuery(button), ensurejQuery(wrapper)]);
        }
        if (result.wishlist_id && result.customer_id && result.load_automation_nonce) {
          loadAutomations(productId, result.wishlist_id, result.customer_id, "wishlist", result.load_automation_nonce);
        }
      }
      eventBus.emit(EVENTS.WISHLIST_ADDED, { productId, status: "success", data: result });
    }
    _handleAddError(productId, error) {
      showError(error.message || window.wlfmc_l10n?.labels?.operation_failed);
      eventBus.emit(EVENTS.WISHLIST_ADDED, { productId, status: "failed", error: error.message });
    }
    _handleRemoveSuccess(productId, result, element = null, row = null) {
      if (this.store.hasItem(productId)) {
        this.store.removeItem(productId);
      }
      this.ui.updateRemoveButton(productId);
      fragmentManager.loadFragments();
      const jQuery = window.jQuery;
      if (jQuery) {
        jQuery(document.body).trigger("wlfmc_removed_from_wishlist", [ensurejQuery(element), ensurejQuery(row), result]);
      }
      if (result.message) {
        showError(result.message);
      }
      eventBus.emit(EVENTS.WISHLIST_REMOVED, { productId, status: "success", data: result });
    }
    _handleRemoveError(productId, error) {
      showError(error.message || window.wlfmc_l10n?.labels?.operation_failed);
      eventBus.emit(EVENTS.WISHLIST_REMOVED, { productId, status: "failed", error: error.message });
    }
    isInWishlist(productId) {
      return this.store.hasItem(productId);
    }
  };
  var wishlistActions = new WishlistActions();
  var actions_default = wishlistActions;

  // src/frontend/js/modern/shared/variation-handler.js
  function handleVariationShown(data, moduleType, store, ui) {
    const productId = data.product_id;
    const variationId = data.variation_id;
    if (!productId || !variationId) return;
    if (moduleType === "multiList") {
      return;
    }
    const prefix = moduleType === "wishlist" ? "wlfmc-add-to-wishlist" : "wlfmc-add-to-waitlist";
    const targets = document.querySelectorAll(`.${prefix} [data-parent-product-id="${productId}"]`);
    if (!targets.length) return;
    if (moduleType === "wishlist") {
      const enableOutofstock = targets[0]?.closest(`.${prefix}`)?.dataset.enableOutofstock;
      if (!enableOutofstock && !data.is_in_stock) {
        targets.forEach((el) => el.closest(`.${prefix}`)?.classList.add("hide"));
      } else {
        targets.forEach((el) => el.closest(`.${prefix}`)?.classList.remove("hide"));
      }
    } else {
      targets.forEach((el) => {
        const container = el.closest(`.${prefix}`);
        if (container) container.classList.remove("hide");
      });
    }
    const popupId = targets[0]?.closest(`.${prefix}`)?.dataset.popupId;
    if (popupId && moduleType === "wishlist") {
      const popup = document.getElementById(popupId);
      if (popup) {
        const productTitle = popup.dataset.productTitle || "";
        const originalPrice = popup.querySelector(".wlfmc-parent-product-price")?.innerHTML || "";
        ui.updatePopupContent(popup, data, productTitle, originalPrice);
      }
    }
    targets.forEach((el) => {
      const container = el.closest(`.${prefix}`);
      if (!container) return;
      el.dataset.parentProductId = productId;
      el.dataset.productId = variationId;
      container.className = container.className.replace(new RegExp(`${prefix}-\\d+`, "g"), `${prefix}-${variationId}`);
      container.classList.remove("exists");
      if (moduleType === "wishlist") {
        const addLink = container.querySelector(".wlfmc-addtowishlist a");
        if (addLink) addLink.href = container.dataset.addUrl?.replace("#product_id", variationId) || "#";
        const removeLink = container.querySelector(".wlfmc-removefromwishlist a");
        if (removeLink) removeLink.href = container.dataset.removeUrl?.replace("#product_id", variationId) || "#";
      }
      const items = store.items.get();
      const found = items.find((item) => String(item.product_id) === String(variationId));
      if (found) {
        container.classList.add("exists");
        const deleteBtn = container.querySelector(".wlfmc_delete_item");
        if (deleteBtn) {
          deleteBtn.dataset.wishlistId = found.wishlist_id;
          deleteBtn.dataset.itemId = found.item_id;
        }
      }
      if (productId && moduleType === "waitlist") {
        const trigger = container.querySelector(".wlfmc-popup-trigger");
        if (trigger) trigger.classList.remove("wlfmc-disabled");
      }
    });
  }
  function handleVariationReset(productId, moduleType, store, ui) {
    if (!productId) return;
    if (moduleType === "multiList") {
      return;
    }
    const prefix = moduleType === "wishlist" ? "wlfmc-add-to-wishlist" : "wlfmc-add-to-waitlist";
    const targets = document.querySelectorAll(`.${prefix} [data-parent-product-id="${productId}"]`);
    if (!targets.length) return;
    targets.forEach((el) => {
      const container = el.closest(`.${prefix}`);
      if (!container) return;
      container.classList.remove("hide");
      el.dataset.parentProductId = productId;
      el.dataset.productId = productId;
      container.className = container.className.replace(new RegExp(`${prefix}-\\d+`, "g"), `${prefix}-${productId}`);
      container.classList.remove("exists");
      if (moduleType === "wishlist") {
        const addLink = container.querySelector(".wlfmc-addtowishlist a");
        if (addLink) addLink.href = container.dataset.addUrl?.replace("#product_id", productId) || "#";
        const removeLink = container.querySelector(".wlfmc-removefromwishlist a");
        if (removeLink) removeLink.href = container.dataset.removeUrl?.replace("#product_id", productId) || "#";
      }
      const items = store.items.get();
      const found = items.find((item) => String(item.product_id) === String(productId));
      if (found) {
        container.classList.add("exists");
        const deleteBtn = container.querySelector(".wlfmc_delete_item");
        if (deleteBtn) {
          deleteBtn.dataset.wishlistId = found.wishlist_id;
          deleteBtn.dataset.itemId = found.item_id;
        }
      }
      if (moduleType === "waitlist") {
        const l10n = window.wlfmc_l10n || {};
        if (validators.isTrue(l10n.waitlist_required_product_variation)) {
          const trigger = container.querySelector(".wlfmc-popup-trigger");
          if (trigger) trigger.classList.add("wlfmc-disabled");
        }
      }
      const popupId = container?.dataset.popupId;
      if (popupId && moduleType === "wishlist") {
        const popup = document.getElementById(popupId);
        if (popup) {
          const productTitle = popup.dataset.productTitle || "";
          const originalPrice = popup.querySelector(".wlfmc-parent-product-price")?.innerHTML || "";
          const desc = window.wlfmc_l10n?.labels?.popup_content;
          const title = window.wlfmc_l10n?.labels?.popup_title;
          const img = popup.querySelector(".wlfmc-popup-header img")?.dataset.src || "";
          const titleEl = popup.querySelector(".wlfmc-popup-title");
          const descEl = popup.querySelector(".wlfmc-popup-desc");
          if (titleEl) {
            titleEl.innerHTML = title.replace(/{product_name}/g, productTitle).replace(/{product_price}/g, originalPrice);
          }
          if (descEl) {
            descEl.innerHTML = desc.replace(/{product_name}/g, productTitle).replace(/{product_price}/g, originalPrice);
          }
          const imgEl = popup.querySelector(".wlfmc-popup-header img");
          if (imgEl) imgEl.src = img;
        }
      }
    });
  }

  // src/frontend/js/modern/shared/cart-helpers.js
  function shouldSendAddToCartRequest(button) {
    const jQuery = window.jQuery;
    if (!jQuery) return true;
    const result = jQuery(document.body).triggerHandler("should_send_ajax_request.adding_to_cart", [ensurejQuery(button)]);
    return result !== false;
  }
  function triggerAddingToCart(button, data) {
    const jQuery = window.jQuery;
    if (jQuery) {
      jQuery(document.body).trigger("adding_to_cart", [ensurejQuery(button), data || {}]);
    }
  }
  function triggerAddedToCartEvents(fragments, cartHash, button) {
    const jQuery = window.jQuery;
    if (jQuery) {
      jQuery(document.body).trigger("wc_fragment_refresh");
      jQuery(document.body).trigger("added_to_cart", [fragments, cartHash, ensurejQuery(button)]);
    }
  }
  function triggerAjaxRequestNotSent(button) {
    const jQuery = window.jQuery;
    if (jQuery) {
      jQuery(document.body).trigger("ajax_request_not_sent.adding_to_cart", [false, false, ensurejQuery(button)]);
    }
  }

  // src/frontend/js/modern/shared/filter-helpers.js
  function applyModuleFilter(eventName, element, data) {
    const jQuery = window.jQuery;
    if (jQuery) {
      const jQueryElement = ensurejQuery(element);
      const filtered = jQuery(document).triggerHandler(eventName, [jQueryElement, data]);
      if (filtered !== null && filtered !== void 0 && filtered !== false) {
        return filtered;
      }
      return data;
    }
    const nativeEvent = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: { element, data }
    });
    document.dispatchEvent(nativeEvent);
    return nativeEvent.detail?.modifiedData || data;
  }

  // src/frontend/js/modern/modules/multi-list/store.js
  var LIST_SPECIFIC_FIELDS3 = [
    "remove_url",
    "remove_nonce",
    "wishlist_token",
    "list_name",
    "item_id",
    "wishlist_id"
  ];
  var MultiListStore = class extends BaseStore {
    constructor() {
      super("multiList", "wishlist_id");
    }
    /* ═══ Override getters for list-based structure ═══ */
    get items() {
      return { get: () => stateCache.getLists() };
    }
    get lists() {
      return { get: () => stateCache.getLists() };
    }
    get count() {
      return { get: () => stateCache.getCount("multiList") };
    }
    /* ═══ List-specific queries ═══ */
    getList(listId) {
      return stateCache.getList(String(listId)) || null;
    }
    hasList(listId) {
      return !!stateCache.getList(String(listId));
    }
    hasProductInList(listId, productId) {
      const list = this.getList(listId);
      if (!list) return false;
      return (list.wishlist_items || []).some(
        (i) => String(i.product_id) === String(productId)
      );
    }
    getListsByProduct(productId) {
      return stateCache.getLists().filter(
        (l) => (l.wishlist_items || []).some(
          (i) => String(i.product_id) === String(productId)
        )
      );
    }
    getProductListCount(productId) {
      return this.getListsByProduct(productId).length;
    }
    isPendingList(listId) {
      return String(listId).startsWith("temp_");
    }
    getRealListId(tempId) {
      const list = this.getList(tempId);
      if (list && !this.isPendingList(list.wishlist_id)) {
        return list.wishlist_id;
      }
      return null;
    }
    getUserLists(sourceLists = null, excludeDefault = null) {
      const lists = sourceLists || stateCache.getLists();
      const isMerge = validators.isTrue(window.wlfmc_l10n?.merge_lists);
      const shouldExclude = excludeDefault !== null ? validators.isTrue(excludeDefault) : !isMerge;
      if (!shouldExclude) return [...lists];
      return lists.filter((list) => !validators.isTrue(list.is_default));
    }
    /* ═══ List CRUD ═══ */
    addList(listData) {
      return stateCache.addList(listData);
    }
    updateList(listId, updates) {
      return stateCache.updateList(String(listId), updates);
    }
    removeList(listId) {
      return stateCache.removeList(String(listId));
    }
    /* ═══ Item-in-list operations ═══ */
    addItemToList(listId, productId, data = {}) {
      return stateCache.addItemToList(String(listId), String(productId), data);
    }
    removeItemFromList(listId, productId) {
      return stateCache.removeItemFromList(String(listId), String(productId));
    }
    confirmAddItem(listId, productId, serverData) {
      const list = this.getList(listId);
      if (!list) return;
      const items = list.wishlist_items || [];
      const idx = items.findIndex(
        (i) => String(i.product_id) === String(productId) && i._optimistic
      );
      if (idx === -1) return;
      const updated = [...items];
      const display = serverData?.display || {};
      const mergedData = { ...updated[idx] };
      for (const key of LIST_SPECIFIC_FIELDS3) {
        if (serverData?.[key] !== void 0) mergedData[key] = serverData[key];
      }
      for (const key of LIST_SPECIFIC_FIELDS3) {
        if (mergedData[key] === void 0 && display[key] !== void 0) {
          mergedData[key] = display[key];
        }
      }
      mergedData._optimistic = false;
      updated[idx] = mergedData;
      stateCache.updateList(String(listId), { wishlist_items: updated });
    }
    rollbackAddItem(listId, productId) {
      const list = this.getList(listId);
      if (!list) return;
      const filtered = (list.wishlist_items || []).filter(
        (i) => !(String(i.product_id) === String(productId) && i._optimistic)
      );
      stateCache.updateList(String(listId), { wishlist_items: filtered });
    }
    /* ═══ Override clear ═══ */
    clear() {
      stateCache.setModuleData("multiList", [], 0);
    }
    /* ═══ Override syncFromData for nested list structure ═══ */
    /**
     * Multi-list sync strips display data from nested wishlist_items
     * and routes it to the DisplayStore under the 'multiList' namespace.
     */
    syncFromData(data) {
      let lists = (data.lists || []).map((list) => ({
        ...list,
        wishlist_items: normalizeItems(list.wishlist_items).map((item) => {
          if (item?.display && item.product_id !== void 0) {
            displayStore.set("multiList", item.product_id, item.display);
          }
          const { display, ...rest } = item;
          if (display) {
            for (const key of LIST_SPECIFIC_FIELDS3) {
              if (display[key] !== void 0 && rest[key] === void 0) {
                rest[key] = display[key];
              }
            }
          }
          return rest;
        })
      }));
      stateCache.setModuleData("multiList", lists, data.count || lists.length);
    }
  };
  var multiListModuleStore = new MultiListStore();
  var store_default2 = multiListModuleStore;

  // src/frontend/js/modern/modules/multi-list/ui.js
  var MultiListUI = class extends BaseListUI {
    constructor() {
      super({
        moduleName: "multiList",
        store: store_default2,
        selectors: {
          addButton: ".wlfmc-add-to-multi-list",
          listContainer: ".wlfmc-manage-lists",
          dropdown: ".wlfmc-dropdown-content"
        }
      });
      this._prevStates = [];
    }
    /**
     * Reactive render for multi-list: syncs list-counter rows and the
     * lists counter icon from the current StateCache snapshot.
     */
    renderFromState() {
      this.syncListCounterRows();
      this.updateCounterIcon();
      this.updateListItemCounts();
      this.updateAllProductListCounts();
    }
    /**
     * Update the counter icon for multi-list counters based on list count.
     *
     * Multi-list counters are rendered with data-counter-type="lists",
     * which does not match the module name 'multiList'. Because of that,
     * BaseListUI.updateCounter() skips these wrappers inside _forEachCounter.
     *
     * This dedicated method updates only the icon graphic and empty-state
     * visibility for multi-list counters, keeping the change minimal and
     * avoiding any side effects on other counter types.
     */
    updateCounterIcon() {
      const count = this._getFreshListCount();
      document.querySelectorAll(".wlfmc-lists-counter-wrapper").forEach((wrapper) => {
        const config = this._getConfig(wrapper);
        if (!config) return;
        const iconEl = wrapper.querySelector(this._counterSelectors.icon);
        if (iconEl) {
          this._updateIconGraphic(iconEl, count > 0 ? config.hasItemsIcon : config.emptyIcon);
        }
        wrapper.classList.toggle("empty", count === 0);
        if (config.hideIfEmpty) {
          wrapper.style.display = count === 0 ? "none" : "";
        }
      });
    }
    _getManageContainer() {
      return document.querySelector("#wlfmc-lists.wlfmc-lists");
    }
    _getFreshListCount() {
      const lists = store_default2.getUserLists();
      return Array.isArray(lists) ? lists.length : 0;
    }
    _ensureManageStructure(container) {
      if (!container) return null;
      const existing = container.querySelector("ul.wlfmc-manage-lists");
      if (existing) return existing;
      container.querySelector(".lists-empty")?.remove();
      if (!container.querySelector(".create-new-list-desc")) {
        const headerTemplate = window.wp?.template?.("wlfmc-list-page-header");
        if (headerTemplate) {
          container.insertAdjacentHTML("beforeend", headerTemplate({}));
        }
      }
      const manage = document.createElement("ul");
      manage.className = "wlfmc-manage-lists";
      container.appendChild(manage);
      return manage;
    }
    isManagePageEmpty() {
      const container = this._getManageContainer();
      if (!container || !container.querySelector(".lists-empty")) return false;
      return this._getFreshListCount() === 0;
    }
    renderMultiListPopup(popup, lists, productLists) {
      const listContainer = popup.querySelector(".list");
      if (!listContainer) return;
      listContainer.innerHTML = "";
      const emptyMsg = popup.querySelector(".list-empty");
      if (emptyMsg) emptyMsg.style.display = "none";
      const noResults = popup.querySelector(".no-results-row");
      if (noResults) noResults.style.display = "none";
      lists = store_default2.getUserLists(lists);
      if (!lists || lists.length === 0) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "list-empty";
        emptyDiv.textContent = window.wlfmc_l10n?.labels?.multi_list_empty_list_text || "";
        listContainer.appendChild(emptyDiv);
        const saveBtn2 = popup.querySelector(".wlfmc_add_to_multi_list");
        if (saveBtn2) saveBtn2.style.display = "none";
        return;
      }
      const template = window.wp?.template?.("wlfmc-list-item");
      if (!template) return;
      this._prevStates = [];
      let html = "";
      lists.forEach((list) => {
        const isOnList = productLists.includes(list.wishlist_id);
        this._prevStates.push(isOnList);
        const items = this._getListItems(list);
        html += template({
          wishlist_id: list.wishlist_id,
          wishlist_name: list.wishlist_name || "",
          wishlist_desc: this._formatListDesc(list),
          wishlist_image: list.wishlist_image || this._resolveListImage(items),
          wishlist_url: list.wishlist_url || "#",
          is_on_list: isOnList
        });
      });
      listContainer.innerHTML = html;
      popup._wlfmcPrevStates = [...this._prevStates];
      const counter = popup.querySelector(".wlfmc-number");
      if (counter) counter.textContent = productLists.length;
      const saveBtn = popup.querySelector(".wlfmc_add_to_multi_list");
      if (saveBtn) {
        saveBtn.dataset.listIds = JSON.stringify(productLists);
        saveBtn.setAttribute("data-list-ids", JSON.stringify(productLists));
        saveBtn.style.display = "";
        saveBtn.disabled = true;
      }
    }
    _getListItems(list) {
      const raw = list?.wishlist_items ?? list?.items ?? [];
      return normalizeItems(raw);
    }
    _formatListDesc(list) {
      const items = this._getListItems(list);
      const count = Array.isArray(items) ? items.length : parseInt(list?.count || list?.wishlist_count || 0, 10);
      const desc = list?.wishlist_desc || list?.description || "";
      if (count > 0) {
        return desc ? `${count} items - ${desc}` : `${count} items`;
      }
      return desc;
    }
    getProductListsFromCache(productId) {
      const allLists = store_default2.getUserLists();
      const productList = [];
      if (!Array.isArray(allLists)) return [];
      allLists.forEach((list) => {
        if (list.wishlist_items && Array.isArray(list.wishlist_items) && list.wishlist_items.some((item) => String(item.product_id) === String(productId))) {
          productList.push(list.wishlist_id);
        }
      });
      return productList;
    }
    updateProductListCount(productId) {
      const productLists = this.getProductListsFromCache(productId);
      const count = productLists.length;
      const countSelector = [
        `.wlfmc-addtomultilist a[data-product-id="${productId}"] .wlfmc-multi-list-count`,
        `.wlfmc-addtomergelists a[data-product-id="${productId}"] .wlfmc-multi-list-count`
      ].join(", ");
      document.querySelectorAll(countSelector).forEach((el) => {
        if (count > 0) {
          el.textContent = String(count);
          el.style.display = "";
          el.classList.add("has-items");
        } else {
          el.textContent = "0";
          el.style.display = "none";
          el.classList.remove("has-items");
        }
      });
      const triggerSelector = [
        `.wlfmc-addtomultilist a[data-product-id="${productId}"]`,
        `.wlfmc-addtomergelists a[data-product-id="${productId}"]`
      ].join(", ");
      document.querySelectorAll(triggerSelector).forEach((trigger) => {
        const wrapper = trigger.closest(".wlfmc-add-to-multi-list");
        if (wrapper) {
          if (count > 0) {
            wrapper.classList.add("exists");
          } else {
            wrapper.classList.remove("exists");
          }
        }
      });
    }
    /**
     * Reconcile ALL product-level multi-list count badges on the page.
     * Called reactively whenever multiList state changes.
     */
    updateAllProductListCounts() {
      const triggers = document.querySelectorAll(
        ".wlfmc-addtomultilist a[data-product-id], .wlfmc-addtomergelists a[data-product-id]"
      );
      triggers.forEach((trigger) => {
        const productId = parseInt(trigger.dataset.productId, 10);
        if (productId) {
          this.updateProductListCount(productId);
        }
      });
    }
    updateAddButton(productId, listIds, data = {}) {
      if (!Array.isArray(listIds)) listIds = listIds != null ? [listIds] : [];
      const popup = document.getElementById("add_to_list_popup");
      if (popup) {
        const addBtn = popup.querySelector(".wlfmc_add_to_multi_list");
        const freshProductLists = this.getProductListsFromCache(productId);
        if (addBtn) {
          addBtn.dataset.listIds = JSON.stringify(freshProductLists);
          addBtn.setAttribute("data-list-ids", JSON.stringify(freshProductLists));
        }
        const numberEl = popup.querySelector(".wlfmc-number");
        if (numberEl) numberEl.textContent = listIds.length;
      }
      if (Array.isArray(listIds)) {
        listIds.forEach((listId) => {
          const el = document.querySelector(`.wlfmc-add-to-multi-list[data-list-id="${listId}"]`);
          if (el) el.classList.add("exists");
        });
      }
    }
    updateListItemCounts() {
      const allLists = store_default2.lists.get();
      if (!Array.isArray(allLists)) return;
      allLists.forEach((list) => {
        const listId = String(list.wishlist_id);
        const desc = this._formatListDesc(list);
        const items = Array.isArray(list.wishlist_items) ? list.wishlist_items : null;
        const count = items !== null ? items.length : parseInt(list.count || list.wishlist_count || 0, 10);
        const popup = document.getElementById("add_to_list_popup");
        if (!popup) return;
        const row = popup.querySelector(`li[data-wishlist-id="${listId}"]`);
        if (!row) return;
        const descEl = row.querySelector("small, .list-desc");
        if (descEl) descEl.textContent = desc;
        const miniRow = document.querySelector(
          `.wlfmc-lists-counter-wrapper a.list-row[data-list-id="${listId}"]`
        );
        if (miniRow) {
          const descEl2 = miniRow.querySelector(".list-desc");
          if (descEl2) descEl2.textContent = desc;
          const countEl = miniRow.querySelector(".list-total-count");
          if (countEl) countEl.textContent = `${count} items`;
        }
      });
    }
    updateRemoveButton(productId, listId) {
      const el = document.querySelector(`.wlfmc-add-to-multi-list[data-list-id="${listId}"]`);
      if (el) el.classList.remove("exists");
    }
    updateListUI(data) {
      const listId = data.wishlist_id || data.id;
      if (!listId) return;
      const payload = {
        wishlist_id: listId,
        wishlist_name: data.name || data.wishlist_name || "",
        wishlist_desc: data.description || data.wishlist_desc || "",
        wishlist_desc_raw: data.wishlist_desc_raw || data.description || data.wishlist_desc || "",
        wishlist_image: data.wishlist_image || "",
        wishlist_url: data.wishlist_url || "#",
        wishlist_privacy: data.privacy !== void 0 ? Number(data.privacy) : Number(data.wishlist_privacy || 0),
        is_on_list: !!data.is_on_list,
        pending: !!(data.pending || data._optimistic),
        lists_nonce: data.lists_nonce || "",
        delete_nonce: data.delete_nonce || "",
        privacy_nonce: data.privacy_nonce || ""
      };
      const renderInto = (templateId, container, insert = "beforeend") => {
        if (!container) return null;
        const template = window.wp?.template?.(templateId);
        if (!template) return null;
        const html = template({ ...payload });
        container.insertAdjacentHTML(insert, html);
        return container.lastElementChild;
      };
      ["move_popup", "copy_popup", "add_to_list_popup"].forEach((popupId) => {
        const popupEl = document.getElementById(popupId);
        const container = popupEl?.querySelector("ul.list");
        if (container && !container.querySelector(`[data-wishlist-id="${listId}"]`)) {
          renderInto("wlfmc-list-item", container);
        }
      });
      const dropdown = document.getElementById("wlfmc_my_lists_dropdown");
      if (dropdown && !dropdown.querySelector(`[data-wishlist-id="${listId}"]`)) {
        renderInto("wlfmc-dropdown-item", dropdown);
        dropdown.closest(".wlfmc-select-list-wrapper")?.classList.remove("hide");
      }
      const manage = this._ensureManageStructure(this._getManageContainer()) || document.querySelector(this._selectors.listContainer);
      if (manage) {
        const existingItem = manage.querySelector(`li[data-wishlist-id="${listId}"]`);
        if (!existingItem) {
          renderInto("wlfmc-manage-list-item", manage);
        } else if (!payload.pending) {
          this._patchManageListItem(existingItem, payload);
        }
        if (!payload.pending) {
          if (!document.getElementById(`edit_popup_${listId}`)) {
            renderInto("wlfmc-edit-popup", document.body);
          }
          if (!document.getElementById(`delete_popup_${listId}`)) {
            renderInto("wlfmc-delete-popup", document.body);
          }
        }
      }
    }
    /**
     * Patch an existing manage-list item after server confirmation.
     * Updates URL, nonces and removes pending visual state.
     * Called when the list row was morphed in place (temp → real ID)
     * and needs its attributes synced with server data.
     */
    _patchManageListItem(item, payload) {
      if (payload.wishlist_url && payload.wishlist_url !== "#") {
        item.querySelectorAll('a[href="#"], a.list-row, .wlfmc-open-list-link').forEach((link) => {
          link.setAttribute("href", payload.wishlist_url);
        });
      }
      if (payload.delete_nonce) {
        const deleteBtn = item.querySelector(".wlfmc-delete-list");
        if (deleteBtn) {
          deleteBtn.setAttribute("data-nonce", payload.delete_nonce);
        }
      }
      if (payload.privacy_nonce) {
        const privacyBtn = item.querySelector(".wlfmc-toggle-privacy");
        if (privacyBtn) {
          privacyBtn.setAttribute("data-nonce", payload.privacy_nonce);
        }
      }
      if (payload.lists_nonce) {
        const saveBtn = item.querySelector(".wlfmc-save-list");
        if (saveBtn) {
          saveBtn.setAttribute("data-nonce", payload.lists_nonce);
        }
      }
      item.classList.remove("wlfmc-pending");
    }
    /**
     * Point-patch the per-row item counts after move/copy operations.
     */
    patchListRowCount(listId, count) {
      document.querySelectorAll(`.list-row[data-list-id="${listId}"] .list-total-count`).forEach((el) => {
        el.textContent = `${count} items`;
      });
    }
    removeListUI(listId) {
      this.syncListCounterRows();
      document.querySelectorAll(`[data-wishlist-id="${listId}"]`).forEach((el) => el.remove());
      const dropdown = document.querySelector(this._selectors.dropdown);
      if (dropdown) {
        dropdown.querySelectorAll(`[data-wishlist-id="${listId}"]`).forEach((el) => el.remove());
      }
      const editPopup = document.getElementById(`edit_popup_${listId}`);
      if (editPopup) {
        destroyPopup(editPopup);
      }
      const deletePopup = document.getElementById(`delete_popup_${listId}`);
      if (deletePopup) {
        destroyPopup(deletePopup);
      }
      this.reconcileListPagination();
    }
    reconcileListPagination() {
      const container = this._getManageContainer();
      if (!container) return;
      const perPage = parseInt(container.dataset.perPage || "10", 10) || 10;
      const currentPage = parseInt(container.dataset.currentPage || "1", 10) || 1;
      const totalLists = this._getFreshListCount();
      const listContainer = container.querySelector("ul.wlfmc-manage-lists");
      const visibleRows = listContainer ? listContainer.querySelectorAll(":scope > li").length : 0;
      if (totalLists === 0) {
        this._renderListsEmptyState(container);
        return;
      }
      if (visibleRows === 0 && currentPage === 1 && totalLists <= perPage) {
        this._renderListsEmptyState(container);
        return;
      }
      if (visibleRows === 0) {
        if (currentPage > 1) {
          this._navigateToListPage(currentPage - 1);
        } else {
          fragment_manager_default.loadFragments();
        }
        return;
      }
      const totalPages = Math.max(1, Math.ceil(totalLists / perPage));
      if (currentPage > totalPages) {
        this._navigateToListPage(totalPages);
      }
    }
    _navigateToListPage(page) {
      const baseUrl = window.wlfmc_l10n?.lists_page_url || window.location.href;
      const url = new URL(baseUrl, window.location.origin);
      if (page <= 1) {
        url.searchParams.delete("pagenum");
      } else {
        url.searchParams.set("pagenum", String(page));
      }
      const container = document.getElementById("wlfmc-lists");
      if (container) container.dataset.currentPage = String(page);
      window.location.href = url.toString();
    }
    _renderListsEmptyState(container) {
      if (!container) return;
      container.querySelector("ul.wlfmc-manage-lists")?.remove();
      container.querySelector("nav")?.remove();
      const headerRow = container.querySelector(".create-new-list-desc")?.parentElement;
      if (headerRow) headerRow.remove();
      if (container.querySelector(".lists-empty")) return;
      const template = window.wp?.template?.("wlfmc-list-page-empty");
      if (!template) return;
      const holder = document.createElement("div");
      holder.innerHTML = template({});
      const emptyEl = holder.firstElementChild;
      if (emptyEl) container.appendChild(emptyEl);
    }
    updatePrivacyUI(listId, privacy) {
      const el = document.querySelector(`[data-wishlist-id="${listId}"] .wlfmc-toggle-privacy`);
      if (el) {
        el.dataset.privacy = privacy;
        el.setAttribute("data-privacy", String(privacy));
        const icon = el.querySelector("i");
        if (icon) icon.className = privacy === 1 ? "wlfmc-icon-lock" : "wlfmc-icon-unlock";
      }
    }
    /**
     * Point-patch ALL DOM elements referencing a list's editable fields.
     */
    refreshListDetails(listId, data) {
      const name = data.wishlist_name || "";
      const desc = data.wishlist_desc || "";
      const privacy = data.wishlist_privacy !== void 0 ? Number(data.wishlist_privacy) : null;
      const list = store_default2.getList(listId);
      const combinedDesc = this._formatListDesc({
        wishlist_items: list?.wishlist_items,
        count: list?.count,
        wishlist_desc: desc
      });
      const headerIdEl = document.querySelector(
        `.wlfmc-list-actions-wrapper [data-wishlist-id="${listId}"]`
      );
      if (headerIdEl) {
        const wrapper = headerIdEl.closest(".wlfmc-list-actions-wrapper");
        if (wrapper) {
          const nameEl = wrapper.querySelector(".list-name");
          const descEl = wrapper.querySelector(".list-desc");
          if (nameEl) nameEl.textContent = name;
          if (descEl) descEl.textContent = desc;
        }
      }
      document.querySelectorAll(
        `ul.wlfmc-manage-lists li[data-wishlist-id="${listId}"]`
      ).forEach((li) => {
        const nameEl = li.querySelector(".list-name");
        const descEl = li.querySelector(".list-desc");
        if (nameEl) nameEl.textContent = name;
        if (descEl) descEl.textContent = desc;
      });
      document.querySelectorAll(
        `#wlfmc_my_lists_dropdown li[data-wishlist-id="${listId}"]`
      ).forEach((li) => {
        const nameEl = li.querySelector(".list-name");
        const descEl = li.querySelector(".list-desc");
        if (nameEl) nameEl.textContent = name;
        if (descEl) descEl.textContent = combinedDesc;
      });
      ["add_to_list_popup", "move_popup", "copy_popup"].forEach((popupId) => {
        const popup = document.getElementById(popupId);
        if (!popup) return;
        const row = popup.querySelector(`li[data-wishlist-id="${listId}"]`);
        if (!row) return;
        const nameEl = row.querySelector("strong");
        const descEl = row.querySelector("small");
        if (nameEl) nameEl.textContent = name;
        if (descEl) descEl.textContent = combinedDesc;
      });
      document.querySelectorAll(
        `.wlfmc-lists-counter-wrapper a.list-row[data-list-id="${listId}"]`
      ).forEach((row) => {
        const nameEl = row.querySelector(".list-name");
        const descEl = row.querySelector(".list-desc");
        if (nameEl) nameEl.textContent = name;
        if (descEl) descEl.textContent = desc;
      });
      if (privacy !== null) {
        this.updatePrivacyUI(listId, privacy);
        if (privacy === 0) {
          document.querySelectorAll(
            `.wlfmc-popup-trigger[data-popup-id="share_popup_${listId}"]`
          ).forEach((el) => {
            el.style.display = "";
          });
          document.querySelectorAll(".share-wrapper").forEach((el) => {
            el.style.display = "";
          });
        } else {
          document.querySelectorAll(
            `.wlfmc-popup-trigger[data-popup-id="share_popup_${listId}"]`
          ).forEach((el) => {
            el.style.display = "none";
          });
          document.querySelectorAll(".share-wrapper").forEach((el) => {
            el.style.display = "none";
          });
        }
      }
    }
    /**
     * Sync ALL lists-counter mini rows with the current store state.
     */
    /**
     * Sync ALL lists-counter mini rows with the current store state.
     * Single source of truth for list-counter DOM reconciliation.
     */
    syncListCounterRows() {
      const allLists = store_default2.lists.get();
      if (!Array.isArray(allLists)) return;
      let lists = store_default2.getUserLists(allLists);
      lists = [...lists].sort((a, b) => {
        const countA = Array.isArray(a.wishlist_items) ? a.wishlist_items.length : 0;
        const countB = Array.isArray(b.wishlist_items) ? b.wishlist_items.length : 0;
        return countB - countA;
      });
      const processedParents = /* @__PURE__ */ new Set();
      document.querySelectorAll(".wlfmc-lists-counter-wrapper").forEach((wrapper) => {
        const uniqueId = wrapper.dataset.id || wrapper.getAttribute("data-id");
        const contentArea = wrapper.querySelector(".wlfmc-counter-content");
        const perPage = parseInt(wrapper.dataset.perPage || wrapper.getAttribute("data-per-page") || "0", 10);
        const visibleLists = perPage > 0 ? lists.slice(0, perPage) : lists;
        const remainingRows = visibleLists.length;
        const shouldHide = wrapper.dataset.hideIfEmpty === "1" && remainingRows === 0;
        wrapper.style.display = shouldHide ? "none" : "";
        if (!contentArea) return;
        if (remainingRows === 0) {
          contentArea.querySelectorAll(".wlfmc-view-lists-link").forEach((el) => el.remove());
          const itemsWrap2 = contentArea.querySelector(".wlfmc-wishlist-items-wrapper");
          if (itemsWrap2) itemsWrap2.remove();
          if (!contentArea.querySelector(".wlfmc-lists-empty")) {
            const emptyTemplate = uniqueId ? window.wp?.template?.(`wlfmc-mini-list-empty-${uniqueId}`) : null;
            if (emptyTemplate) {
              const holder = document.createElement("div");
              holder.innerHTML = emptyTemplate({});
              if (holder.firstElementChild) contentArea.appendChild(holder.firstElementChild);
            }
          }
          return;
        }
        contentArea.querySelector(".wlfmc-lists-empty")?.remove();
        let itemsWrap = contentArea.querySelector(".wlfmc-wishlist-items-wrapper");
        if (!itemsWrap && uniqueId) {
          const structureTemplate = window.wp?.template?.(`wlfmc-mini-list-structure-${uniqueId}`);
          if (structureTemplate) {
            const holder = document.createElement("div");
            holder.innerHTML = structureTemplate({});
            while (holder.firstElementChild) {
              contentArea.appendChild(holder.firstElementChild);
            }
            itemsWrap = contentArea.querySelector(".wlfmc-wishlist-items-wrapper");
          }
        }
        if (!itemsWrap) return;
        visibleLists.forEach((list) => {
          const row = itemsWrap.querySelector(`.list-row[data-list-id="${list.wishlist_id}"]`);
          if (row) this._patchListCounterRow(row, list);
        });
        if (uniqueId) {
          const template = window.wp?.template?.(`wlfmc-mini-list-item-${uniqueId}`);
          if (template) {
            visibleLists.forEach((list) => {
              if (itemsWrap.querySelector(`.list-row[data-list-id="${list.wishlist_id}"]`)) return;
              const items = Array.isArray(list.wishlist_items) ? list.wishlist_items : [];
              const imageHtml = this._resolveListImage(items);
              const count = items.length || parseInt(list.count || list.wishlist_count || 0, 10);
              const holder = document.createElement("div");
              holder.innerHTML = template({
                wishlist_id: list.wishlist_id,
                wishlist_token: list.wishlist_token || "",
                wishlist_url: list.wishlist_url || "#",
                wishlist_image: imageHtml,
                wishlist_name: list.wishlist_name || "",
                wishlist_desc: list.wishlist_desc || "",
                wishlist_count: count,
                pending: list._optimistic === true
              });
              const newRow = holder.firstElementChild;
              if (newRow) {
                const title = itemsWrap.querySelector(".wlfmc-counter-title");
                if (title) title.after(newRow);
                else itemsWrap.prepend(newRow);
              }
            });
          }
        }
        const visibleIds = new Set(visibleLists.map((l) => String(l.wishlist_id)));
        itemsWrap.querySelectorAll(".list-row").forEach((row) => {
          if (!visibleIds.has(row.dataset.listId)) row.remove();
        });
        visibleLists.forEach((list) => {
          const row = itemsWrap.querySelector(`.list-row[data-list-id="${list.wishlist_id}"]`);
          if (row) itemsWrap.appendChild(row);
        });
      });
    }
    _patchListCounterRow(row, list) {
      const items = Array.isArray(list.wishlist_items) ? list.wishlist_items : null;
      const count = items !== null ? items.length : parseInt(list.count || list.wishlist_count || 0, 10);
      const countEl = row.querySelector(".list-total-count");
      if (countEl) {
        countEl.textContent = `${count} items`;
      }
      const imageHtml = this._resolveListImage(items || []);
      const flexContainer = row.querySelector(":scope > .d-flex");
      if (flexContainer) {
        const existingImg = flexContainer.querySelector(":scope > img");
        if (imageHtml) {
          const holder = document.createElement("div");
          holder.innerHTML = imageHtml;
          const newImg = holder.firstElementChild;
          if (existingImg && newImg) {
            existingImg.replaceWith(newImg);
          } else if (!existingImg && newImg) {
            flexContainer.insertBefore(newImg, flexContainer.firstChild);
          }
        } else if ((!items || !items.length) && existingImg) {
          existingImg.remove();
        }
      }
      if (list.wishlist_url) {
        row.setAttribute("href", list.wishlist_url);
      }
      if (list._optimistic === true) {
        row.classList.add("wlfmc-pending");
      } else {
        row.classList.remove("wlfmc-pending");
      }
    }
    _resolveListImage(items, position = "last") {
      if (!items || items.length === 0) return "";
      const item = "first" === position ? items[0] : items[items.length - 1];
      if (!item || item.product_id === void 0) return "";
      const pid = item.product_id;
      let display = displayStore.get("multiList", pid);
      if (!display) {
        display = displayStore.get("wishlist", pid);
      }
      return display?.image || "";
    }
  };
  var multiListUI = new MultiListUI();
  var ui_default2 = multiListUI;

  // src/frontend/js/modern/modules/multi-list/actions.js
  var MultiListActions = class extends BaseModule {
    constructor() {
      super("multiList", store_default2, null, ui_default2);
      this._listCreationPromises = /* @__PURE__ */ new Map();
    }
    waitForListCreation(tempId) {
      const entry = this._listCreationPromises.get(tempId);
      if (!entry) {
        const list = this.store.getList(tempId);
        if (list && !this.store.isPendingList(list.wishlist_id)) {
          return Promise.resolve(list.wishlist_id);
        }
        return Promise.resolve(tempId);
      }
      return entry.promise;
    }
    _closeParentPopup(element) {
      if (!element) return;
      const popup = element.closest(".wlfmc-popup");
      if (popup) {
        hidePopup(popup);
      }
    }
    _injectListIntoOpenPopups(listData, getIsOnList = null) {
      ["add_to_list_popup", "move_popup", "copy_popup"].forEach((popupId) => {
        const popupEl = document.getElementById(popupId);
        if (!popupEl) return;
        const isVisible = popupEl.closest(".popup_wrapper_visible") !== null || popupEl.closest(".popup_wrapper")?.classList.contains("popup_wrapper_visible") || document.documentElement.classList.contains(`popup_visible_${popupId}`);
        if (!isVisible) return;
        const listContainer = popupEl.querySelector("ul.list");
        if (!listContainer) return;
        if (listContainer.querySelector(`[data-wishlist-id="${listData.wishlist_id}"]`)) return;
        const template = window.wp?.template?.("wlfmc-list-item");
        if (!template) return;
        let isOnList = false;
        if (typeof getIsOnList === "function") {
          isOnList = getIsOnList(popupId);
        } else if (typeof getIsOnList === "boolean") {
          isOnList = getIsOnList;
        }
        const html = template({
          wishlist_id: listData.wishlist_id,
          wishlist_name: listData.wishlist_name,
          wishlist_desc: listData.wishlist_desc || "",
          wishlist_image: listData.wishlist_image || "",
          wishlist_url: "#",
          is_on_list: isOnList
        });
        listContainer.insertAdjacentHTML("beforeend", html);
        const emptyMsg = popupEl.querySelector(".list-empty");
        if (emptyMsg) emptyMsg.style.display = "none";
        const noResults = popupEl.querySelector(".no-results-row");
        if (noResults) noResults.style.display = "none";
        const saveBtn = popupEl.querySelector(".wlfmc_add_to_multi_list");
        if (saveBtn) saveBtn.style.display = "";
      });
    }
    async addFromHandler(productId, formData, options = {}) {
      const { wishlistIds = [], currentLists = [], cartItemKey = "" } = options;
      const actionId = `multi_sync_${productId}_${Date.now()}`;
      const toAdd = wishlistIds.filter((id) => !currentLists.map(String).includes(String(id)));
      const toRemove = currentLists.filter((id) => !wishlistIds.map(String).includes(String(id)));
      const scope = ScopeHelper.multiListBatch(productId);
      const isCartMode = !!cartItemKey;
      return this.executeWithConflictManagement(
        scope,
        actionId,
        isCartMode ? null : () => {
          if (toAdd.length) this._optimisticAdd(productId, toAdd);
          if (toRemove.length) this._optimisticRemove(productId, toRemove);
          if (!toAdd.length && !toRemove.length) return;
          this._closeParentPopup(options?.element);
        },
        isCartMode ? null : () => {
          if (toAdd.length) this._optimisticRemove(productId, toAdd);
          if (toRemove.length) this._optimisticAdd(productId, toRemove);
        },
        () => {
          const tempIds = wishlistIds.filter((id) => this.store.isPendingList(id));
          if (tempIds.length > 0) {
            return Promise.all(tempIds.map((id) => this.waitForListCreation(id))).then((realIds) => {
              const resolvedIds = wishlistIds.map((id) => {
                const idx = tempIds.indexOf(id);
                return idx >= 0 ? realIds[idx] : id;
              });
              formData.delete("wishlist_ids");
              formData.append("wishlist_ids", JSON.stringify(resolvedIds));
              if (formData.has("current_lists")) {
                try {
                  const cl = JSON.parse(formData.get("current_lists"));
                  const resolvedCL = cl.map((id) => {
                    const idx = tempIds.indexOf(id);
                    return idx >= 0 ? realIds[idx] : id;
                  });
                  formData.delete("current_lists");
                  formData.append("current_lists", JSON.stringify(resolvedCL));
                } catch (e) {
                }
              }
              return queueManager.addWithDeduplication("add_to_list", formData);
            });
          }
          return queueManager.addWithDeduplication("add_to_list", formData);
        },
        (result) => {
          const prod_id = productId || result.product_id;
          this._handleSyncSuccess(prod_id, toAdd, toRemove, result);
          if (isCartMode) {
            this._closeParentPopup(options?.element);
          }
        },
        (error) => this._handleAddError(productId, toAdd.length ? toAdd : toRemove, error),
        { type: "add", productId, element: options?.element }
      );
    }
    async removeFromList(productId, listId, nonce = "", element = null, wishlistToken = "") {
      const actionId = `multi_remove_${productId}_${listId}_${Date.now()}`;
      const scope = ScopeHelper.multiList(productId, listId);
      const requestData = {
        product_id: productId,
        remove_from_wishlist: productId,
        wishlist_id: listId,
        nonce,
        _scope: scope
      };
      if (wishlistToken) {
        requestData.wishlist_token = wishlistToken;
      }
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => {
          this._optimisticRemove(productId, [listId]);
          this._closeParentPopup(element);
        },
        () => this._optimisticAdd(productId, [listId]),
        () => queueManager.addWithDeduplication("remove_from_list", requestData),
        (result) => {
          this.ui.updateRemoveButton(productId, listId);
          fragmentManager.loadFragments();
          eventBus.emit(EVENTS.MULTI_LIST_REMOVED, { productId, listId, status: "success", data: result });
        },
        (error) => {
          showError(error.message || window.wlfmc_l10n?.labels?.multi_list_add_failed);
          eventBus.emit(EVENTS.MULTI_LIST_REMOVED, { productId, listId, status: "failed", error: error.message });
        },
        { type: "remove", productId, listId, element }
      );
    }
    async createFromHandler(name, description, privacy, nonce, element = null) {
      const actionId = `multi_create_${Date.now()}`;
      const tempId = "temp_" + Date.now();
      this._lastTempId = tempId;
      const scope = ScopeHelper.multiListManage("create", tempId);
      let resolveCreation, rejectCreation;
      const creationPromise = new Promise((resolve, reject) => {
        resolveCreation = resolve;
        rejectCreation = reject;
      });
      this._listCreationPromises.set(tempId, {
        promise: creationPromise,
        resolve: resolveCreation,
        reject: rejectCreation
      });
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => {
          this._optimisticCreate(name, description, privacy, tempId);
          this._closeParentPopup(element);
        },
        () => {
          this._optimisticDelete(tempId);
          const entry = this._listCreationPromises.get(tempId);
          if (entry) {
            entry.reject(new Error("List creation rolled back"));
            this._listCreationPromises.delete(tempId);
          }
        },
        () => queueManager.addWithDeduplication("create_list", {
          list_name: name,
          list_descriptions: description,
          list_privacy: privacy,
          nonce,
          _scope: scope
        }),
        (result) => this._handleCreateSuccess(result, tempId),
        (error) => this._handleCreateError(error),
        { type: "create", listId: tempId, element }
      );
    }
    async deleteFromHandler(listId, nonce, element = null) {
      const actionId = `multi_delete_${listId}_${Date.now()}`;
      const scope = ScopeHelper.multiListManage("delete", listId);
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => {
          this._optimisticDelete(listId);
          this._closeParentPopup(element);
        },
        () => {
        },
        () => queueManager.addWithDeduplication("delete_list", {
          wishlist_id: listId,
          nonce,
          _scope: scope
        }),
        (result) => this._handleDeleteSuccess(listId, result),
        (error) => this._handleDeleteError(listId, error),
        { type: "delete", listId, element }
      );
    }
    async changePrivacyFromHandler(listId, newPrivacy, currentPrivacy, nonce, element) {
      const actionId = `multi_privacy_${listId}_${Date.now()}`;
      const scope = ScopeHelper.multiListManage("privacy", listId);
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => this._optimisticPrivacy(listId, newPrivacy),
        () => this._optimisticPrivacy(listId, currentPrivacy),
        () => queueManager.addWithDeduplication("change_privacy", {
          wishlist_id: listId,
          list_privacy: newPrivacy,
          nonce,
          _scope: scope
        }),
        (result) => this._handlePrivacySuccess(listId, newPrivacy, result),
        (error) => this._handlePrivacyError(listId, currentPrivacy, error),
        { type: "update", listId, element }
      );
    }
    async updateFromHandler(listId, name, description, privacy, nonce, element = null) {
      const actionId = `multi_update_${listId}_${Date.now()}`;
      const scope = ScopeHelper.multiListManage("update", listId);
      const oldData = this._getListData(listId);
      return this.executeWithConflictManagement(
        scope,
        actionId,
        () => {
          this._optimisticUpdate(listId, name, description, privacy);
          this._closeParentPopup(element);
        },
        () => {
          if (oldData) {
            this._optimisticUpdate(listId, oldData.wishlist_name, oldData.wishlist_desc, oldData.wishlist_privacy);
          }
        },
        () => queueManager.addWithDeduplication("update_list", {
          wishlist_id: listId,
          list_name: name,
          list_descriptions: description,
          list_privacy: privacy,
          nonce,
          _scope: scope
        }),
        (result) => this._handleUpdateSuccess(listId, result, { name, description, privacy }),
        (error) => this._handleUpdateError(listId, error),
        { type: "update", listId, element }
      );
    }
    /* ═══════════════════════════════════════════
       OPTIMISTIC — State mutations ONLY.
       All counter/list UI reconciliation is handled
       reactively by MultiListUI.renderFromState().
    ════════════════════════════════════════════ */
    _optimisticAdd(productId, listIds) {
      for (const listId of listIds) {
        this.store.addItemToList(listId, productId);
      }
      this.ui.updateAddButton(productId, listIds);
    }
    _optimisticRemove(productId, listIds) {
      if (!Array.isArray(listIds)) return;
      for (const listId of listIds) {
        this.store.removeItemFromList(listId, productId);
      }
      if (this.store.getProductListCount(productId) === 0) {
        displayStore.remove("multiList", productId);
      }
      this.ui.updateAddButton(productId, []);
    }
    _optimisticCreate(name, description, privacy, tempId) {
      const list = this.store.addList({
        wishlist_id: tempId,
        wishlist_name: name,
        wishlist_desc: description,
        wishlist_privacy: privacy,
        wishlist_items: [],
        _optimistic: true
      });
      this.ui.updateListUI({
        wishlist_id: tempId,
        wishlist_name: name,
        wishlist_desc: description,
        wishlist_privacy: privacy,
        wishlist_items: [],
        pending: true
      });
      this._injectListIntoOpenPopups({
        wishlist_id: tempId,
        wishlist_name: name,
        wishlist_desc: description,
        wishlist_privacy: privacy
      });
      ["add_to_list_popup", "move_popup", "copy_popup"].forEach((popupId) => {
        const popupEl = document.getElementById(popupId);
        if (!popupEl) return;
        const saveBtn = popupEl.querySelector(".wlfmc_add_to_multi_list");
        if (saveBtn) saveBtn.style.display = "";
        const emptyMsg = popupEl.querySelector(".list-empty");
        if (emptyMsg) emptyMsg.style.display = "none";
        const noResults = popupEl.querySelector(".no-results-row");
        if (noResults) noResults.style.display = "none";
        const checkbox = popupEl.querySelector(
          `input.list-item-checkbox[value="${tempId}"]`
        );
        if (checkbox) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (!Array.isArray(popupEl._wlfmcPrevStates)) {
          popupEl._wlfmcPrevStates = [];
        }
        popupEl._wlfmcPrevStates.push(false);
      });
    }
    _optimisticDelete(listId) {
      const list = this.store.getList(listId);
      this._lastDeletedList = list ? { ...list } : null;
      this.store.removeList(listId);
      this.ui.removeListUI(listId);
    }
    _optimisticUpdate(listId, name, description, privacy) {
      this.store.updateList(listId, {
        wishlist_name: name,
        wishlist_desc: description,
        wishlist_privacy: privacy
      });
      this.ui.refreshListDetails(listId, {
        wishlist_id: listId,
        wishlist_name: name,
        wishlist_desc: description,
        wishlist_privacy: privacy
      });
    }
    _optimisticPrivacy(listId, privacy) {
      this.store.updateList(listId, { wishlist_privacy: privacy });
      this.ui.updatePrivacyUI(listId, privacy);
    }
    /* ═══════════════════════════════════════════
       SUCCESS HANDLERS — Confirm state + side effects.
       No updateCounter / syncListCounterRows /
       updateListItemCounts / updateProductListCount calls.
       Reactive rendering handles all UI reconciliation.
    ════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════
      SUCCESS HANDLERS — Confirm state + side effects.
      _syncMergedWishlist has been REMOVED.
      Wishlist counter reconciliation in merge mode is now
      fully reactive via StateCache notifications triggered
      by addItemToList / removeItemFromList.
    ════════════════════════════════════════════ */
    _handleSyncSuccess(productId, toAdd, toRemove, result) {
      if (result.display) {
        displayStore.set("multiList", productId, result.display);
      }
      for (const listId of toAdd) {
        this.store.confirmAddItem(listId, productId, result);
      }
      for (const listId of toRemove) {
        this.store.removeItemFromList(listId, productId);
      }
      if (toAdd.length > 0 && result.customer_id) {
        const listType = result.default_wishlist_id && result.default_wishlist_id !== "false" ? "wishlist" : "lists";
        const automationWishlistId = result.default_wishlist_id && result.default_wishlist_id !== "false" ? result.default_wishlist_id : result.last_list_id;
        if (automationWishlistId) {
          loadAutomations(productId, automationWishlistId, result.customer_id, listType, result.load_automation_nonce);
        }
      }
      eventBus.emit(EVENTS.MULTI_LIST_ADDED, {
        productId,
        listIds: toAdd,
        removedListIds: toRemove,
        status: "success",
        data: result
      });
    }
    _handleAddSuccess(productId, listIds, result) {
      if (result.display) {
        displayStore.set("multiList", productId, result.display);
      }
      for (const listId of listIds) {
        this.store.confirmAddItem(listId, productId, result);
      }
      this.ui.updateAddButton(productId, listIds, result);
      if (result.customer_id) {
        const listType = result.default_wishlist_id && result.default_wishlist_id !== "false" ? "wishlist" : "lists";
        const automationWishlistId = result.default_wishlist_id && result.default_wishlist_id !== "false" ? result.default_wishlist_id : result.last_list_id;
        if (automationWishlistId) {
          loadAutomations(productId, automationWishlistId, result.customer_id, listType, result.load_automation_nonce);
        }
      }
      eventBus.emit(EVENTS.MULTI_LIST_ADDED, { productId, listIds, status: "success", data: result });
    }
    _handleAddError(productId, listIds, error) {
      showError(error.message || window.wlfmc_l10n?.labels?.multi_list_add_failed);
      eventBus.emit(EVENTS.MULTI_LIST_ADDED, { productId, listIds, status: "failed", error: error.message });
    }
    _handleCreateSuccess(result, tempId) {
      if (result.wishlist_id) {
        const entry = this._listCreationPromises.get(tempId);
        if (entry) {
          entry.resolve(result.wishlist_id);
          this._listCreationPromises.delete(tempId);
        }
        document.querySelectorAll(`[data-wishlist-id="${tempId}"]`).forEach((el) => {
          el.setAttribute("data-wishlist-id", result.wishlist_id);
          const cb = el.querySelector(`input.list-item-checkbox[value="${tempId}"]`) || el.querySelector(`input[type="checkbox"][value="${tempId}"]`);
          if (cb) cb.value = result.wishlist_id;
          el.classList.remove("wlfmc-pending");
        });
        document.querySelectorAll(`[data-list-id="${tempId}"]`).forEach((el) => {
          el.setAttribute("data-list-id", result.wishlist_id);
        });
        const editPopup = document.getElementById(`edit_popup_${tempId}`);
        if (editPopup) editPopup.id = `edit_popup_${result.wishlist_id}`;
        const deletePopup = document.getElementById(`delete_popup_${tempId}`);
        if (deletePopup) deletePopup.id = `delete_popup_${result.wishlist_id}`;
        const sharePopup = document.getElementById(`share_popup_${tempId}`);
        if (sharePopup) sharePopup.id = `share_popup_${result.wishlist_id}`;
        document.querySelectorAll(`[data-popup-id="edit_popup_${tempId}"]`).forEach((el) => {
          el.setAttribute("data-popup-id", `edit_popup_${result.wishlist_id}`);
        });
        document.querySelectorAll(`[data-popup-id="delete_popup_${tempId}"]`).forEach((el) => {
          el.setAttribute("data-popup-id", `delete_popup_${result.wishlist_id}`);
        });
        document.querySelectorAll(`[data-popup-id="share_popup_${tempId}"]`).forEach((el) => {
          el.setAttribute("data-popup-id", `share_popup_${result.wishlist_id}`);
        });
        const wishlistUrl = result.wishlist_url || result.url || "";
        if (tempId) {
          this.store.updateList(tempId, {
            wishlist_id: result.wishlist_id,
            wishlist_name: result.wishlist_name || result.list_name || "",
            wishlist_desc: result.wishlist_desc || result.list_descriptions || "",
            wishlist_privacy: result.wishlist_privacy || 0,
            wishlist_url: wishlistUrl,
            wishlist_token: result.wishlist_token || "",
            _optimistic: false
          });
        }
        const pageNonce = document.querySelector("#wlfmc-lists")?.dataset.nonce || "";
        const listsNonce = result.lists_nonce || result.nonce || pageNonce;
        const deleteNonce = result.delete_nonce || pageNonce;
        const privacyNonce = result.privacy_nonce || pageNonce;
        this.ui.updateListUI({
          wishlist_id: result.wishlist_id,
          wishlist_name: result.wishlist_name || result.list_name || "",
          wishlist_desc: result.wishlist_desc || result.list_descriptions || "",
          wishlist_privacy: result.wishlist_privacy || 0,
          wishlist_token: result.wishlist_token || "",
          wishlist_url: wishlistUrl,
          wishlist_count: 0,
          pending: false,
          lists_nonce: listsNonce,
          delete_nonce: deleteNonce,
          privacy_nonce: privacyNonce
        });
        this._injectListIntoOpenPopups({
          wishlist_id: result.wishlist_id,
          wishlist_name: result.wishlist_name || result.list_name || "",
          wishlist_desc: result.wishlist_desc || result.list_descriptions || "",
          wishlist_privacy: result.wishlist_privacy || 0
        }, false);
        document.querySelectorAll(".wlfmc-list-actions-wrapper .wlfmc-new-list").forEach((el) => el.style.display = "none");
        eventBus.emit(EVENTS.MULTI_LIST_CREATED, { listId: result.wishlist_id, status: "success", data: result });
      }
    }
    _handleCreateError(error) {
      if (this._lastTempId) {
        const entry = this._listCreationPromises.get(this._lastTempId);
        if (entry) {
          entry.reject(error);
          this._listCreationPromises.delete(this._lastTempId);
        }
        this._optimisticDelete(this._lastTempId);
        this._lastTempId = null;
      }
      showError(error.message || window.wlfmc_l10n?.labels?.multi_list_create_failed);
      eventBus.emit(EVENTS.MULTI_LIST_CREATED, { status: "failed", error: error.message });
    }
    _handleUpdateSuccess(listId, result, sentData) {
      const name = result?.wishlist_name || result?.list_name || sentData?.name || "";
      const desc = result?.wishlist_desc || result?.list_descriptions || sentData?.description || "";
      const privacy = result?.wishlist_privacy !== void 0 ? Number(result.wishlist_privacy) : sentData?.privacy ?? 0;
      this.store.updateList(listId, {
        wishlist_name: name,
        wishlist_desc: desc,
        wishlist_privacy: privacy
      });
      this.ui.refreshListDetails(listId, {
        wishlist_name: name,
        wishlist_desc: desc,
        wishlist_privacy: privacy
      });
      eventBus.emit(EVENTS.MULTI_LIST_UPDATED, { listId, status: "success", data: result });
    }
    _handleUpdateError(listId, error) {
      showError(error.message || window.wlfmc_l10n?.labels?.multi_list_update_failed);
      eventBus.emit(EVENTS.MULTI_LIST_UPDATED, { listId, status: "failed", error: error.message });
    }
    _handleDeleteSuccess(listId, result) {
      this.ui.removeListUI(listId);
      eventBus.emit(EVENTS.MULTI_LIST_DELETED, { listId, status: "success", data: result });
    }
    _handleDeleteError(listId, error) {
      showError(error.message || window.wlfmc_l10n?.labels?.multi_list_delete_failed);
      eventBus.emit(EVENTS.MULTI_LIST_DELETED, { listId, status: "failed", error: error.message });
    }
    _handlePrivacySuccess(listId, privacy, result) {
      this.ui.updatePrivacyUI(listId, privacy);
      eventBus.emit(EVENTS.MULTI_LIST_PRIVACY_CHANGED, { listId, privacy, status: "success", data: result });
    }
    _handlePrivacyError(listId, oldPrivacy, error) {
      showError(error.message || window.wlfmc_l10n?.labels?.multi_list_privacy_failed);
      eventBus.emit(EVENTS.MULTI_LIST_PRIVACY_CHANGED, { listId, privacy: oldPrivacy, status: "failed", error: error.message });
    }
    _getListData(listId) {
      return this.store.getList(listId);
    }
    /**
     * Load user lists with context-aware behavior.
     *
     * Three operational modes:
     * 1. cartItemKey + popup → Always fetch from server (bypass cache), block popup UI
     * 2. productId + popup   → Cache-first; fall back to server if cache is empty
     * 3. No popup context    → Cache-first; fall back to server without product context
     *
     * @param {object}              options
     * @param {number|string|null}  options.productId
     * @param {string|null}         options.cartItemKey
     * @param {string|boolean|null} options.excludeDefault
     * @param {HTMLElement|null}    options.popup
     * @returns {Promise<Array>}
     */
    async loadLists({ productId = null, cartItemKey = null, excludeDefault = null, popup = null } = {}) {
      const isMerge = window.wlfmc_l10n?.merge_lists === "true";
      if (excludeDefault === null) {
        excludeDefault = isMerge ? "false" : "true";
      }
      if (cartItemKey && popup) {
        return this._loadListsForPopup({ popup, excludeDefault, cartItemKey, productId });
      }
      if (productId && popup) {
        const cachedLists2 = stateCache.getLists();
        if (cachedLists2 && cachedLists2.length > 0) {
          const lists = this.store.getUserLists(cachedLists2, excludeDefault);
          const productLists = ui_default2.getProductListsFromCache(productId);
          ui_default2.renderMultiListPopup(popup, lists, productLists);
          return lists;
        }
        return this._loadListsForPopup({ popup, excludeDefault, productId });
      }
      const cachedLists = stateCache.getLists();
      if (cachedLists && cachedLists.length > 0) {
        return this.store.getUserLists(cachedLists, excludeDefault);
      }
      return this._fetchListsFromServer({ excludeDefault });
    }
    /**
     * Fetch lists from server and render them into the popup.
     * Blocks the popup container during the request lifecycle.
     *
     * @param {object}              options
     * @param {HTMLElement}         options.popup
     * @param {string|boolean}      options.excludeDefault
     * @param {number|string|null}  options.productId
     * @param {string|null}         options.cartItemKey
     * @returns {Promise<Array>}
     */
    async _loadListsForPopup({ popup, excludeDefault, productId = null, cartItemKey = null }) {
      const container = popup.querySelector(".wlfmc-add-to-list-container");
      if (container) {
        block(container);
      }
      try {
        const { lists, productLists, error } = await this._fetchListsFromServer({
          excludeDefault,
          productId,
          cartItemKey,
          raw: true
        });
        if (error) {
          showError(error);
          hidePopup(popup);
          return [];
        }
        ui_default2.renderMultiListPopup(popup, lists, productLists);
        return lists;
      } finally {
        if (container) {
          unblock(container);
        }
      }
    }
    /**
     * Core server fetch for lists.
     *
     * @param {object}              options
     * @param {string|boolean|null} options.excludeDefault
     * @param {number|string|null}  options.productId
     * @param {string|null}         options.cartItemKey
     * @param {boolean}             options.raw - Return full response shape { lists, productLists, error }
     * @returns {Promise<Array|{lists: Array, productLists: Array, error: string|null}>}
     */
    async _fetchListsFromServer({ excludeDefault, productId = null, cartItemKey = null, raw = false }) {
      const l10n = window.wlfmc_l10n || {};
      const ajaxUrl = l10n.multi_list_ajax_url || l10n.ajax_url;
      const actionName = l10n.actions && l10n.actions.load_lists_action || "wlfmc_load_lists";
      const params = {
        action: actionName,
        nonce: l10n.nonce || "",
        context: "frontend",
        exclude_default: excludeDefault
      };
      if (productId) {
        params.product_id = String(productId);
      }
      if (cartItemKey) {
        params.cart_item_key = cartItemKey;
      }
      const headers = { "Content-Type": "application/x-www-form-urlencoded" };
      if (l10n.ajax_mode === "rest_api" && l10n.nonce) {
        headers["X-WP-Nonce"] = l10n.nonce;
      }
      try {
        const response = await fetch(ajaxUrl, {
          method: "POST",
          headers,
          body: new URLSearchParams(params)
        });
        const data = await response.json();
        if (data.result === "true" && data.data) {
          const lists = Array.isArray(data.data) ? data.data : [];
          const productLists = Array.isArray(data.product_lists) ? data.product_lists : [];
          this.store.syncFromData({ lists, count: lists.length });
          if (raw) {
            return { lists: this.store.getUserLists(lists, excludeDefault), productLists, error: null };
          }
          return this.store.getUserLists(lists, excludeDefault);
        }
        const errorMessage = data.message || null;
        return raw ? { lists: [], productLists: [], error: errorMessage } : [];
      } catch (error) {
        console.warn("[MultiList] Load lists failed:", error);
        return raw ? { lists: [], productLists: [], error: null } : [];
      }
    }
  };
  var multiListActions = new MultiListActions();
  var actions_default2 = multiListActions;

  // src/frontend/js/modern/modules/wishlist/index.js
  var wishlistHandlers = [
    {
      selector: ".wlfmc_add_to_wishlist",
      eventName: "click",
      handler: (event, element) => {
        const productId = extractProductId(element);
        if (!productId) return;
        if (window.wlfmc_l10n?.merge_lists === "true") return;
        const parentProductId = extractParentProductId(element) || productId;
        const { formData, quantity, productType } = buildFormData(element, productId, parentProductId);
        if (!formData.has("add_to_wishlist")) formData.append("add_to_wishlist", String(productId));
        if (!formData.has("product_type")) formData.append("product_type", productType);
        const filterData = {
          add_to_wishlist: productId,
          product_type: productType,
          quantity
        };
        const filteredResult = applyModuleFilter("wlfmc_add_to_wishlist_data", element, filterData);
        if (filteredResult && typeof filteredResult === "object") {
          Object.entries(filteredResult).forEach(([key, value]) => {
            if (!formData.has(key)) {
              formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
            }
          });
        }
        if (!validators_default.isCookieEnabled()) {
          window.alert(window.wlfmc_l10n?.labels?.cookie_disabled);
          return;
        }
        const jQuery = window.jQuery;
        if (jQuery) jQuery(document.body).trigger("wlfmc_adding_to_wishlist");
        if (window.wlfmc_l10n?.click_behavior === "add-redirect") {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = window.location.origin + window.location.pathname + "?add_to_wishlist=" + encodeURIComponent(productId);
          form.style.display = "none";
          let hasFiles = false;
          formData.forEach((value, key) => {
            if (key === "add_to_wishlist") return;
            if (value instanceof File) {
              hasFiles = true;
              const dt = new DataTransfer();
              dt.items.add(value);
              const input = document.createElement("input");
              input.type = "file";
              input.name = key;
              input.files = dt.files;
              form.appendChild(input);
            } else {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = key;
              input.value = value;
              form.appendChild(input);
            }
          });
          if (hasFiles) form.enctype = "multipart/form-data";
          document.body.appendChild(form);
          form.submit();
          return;
        }
        actions_default.add(productId, formData, { element, data: { quantity } });
      },
      priority: 100
    },
    {
      selector: ".wlfmc-wishlist-table .remove_from_wishlist",
      eventName: "click",
      handler: (event, element) => {
        const productId = extractProductId(element);
        if (!productId) return;
        const wishlistId = getWishlistIdFromElement(element);
        const nonce = element.dataset.nonce || element.getAttribute("data-nonce");
        const table = element.closest(".wlfmc-wishlist-items-wrapper");
        const wishlistToken = table?.dataset?.token || table?.getAttribute("data-token") || "";
        const row = element.closest("[data-row-id]");
        if (row) {
          row.classList.add("disabled-row");
        }
        const isMerge = state_cache_default.getConfig()?.mergeLists === true;
        const wishlistTable = element.closest(".wlfmc-wishlist-table");
        const isMultiListTable = String(wishlistTable?.dataset.wishlistType || "") === "lists";
        const listId = parseInt(wishlistId, 10) || 0;
        if (listId > 0 && (isMerge || isMultiListTable)) {
          actions_default2.removeFromList(productId, wishlistId, nonce, element, wishlistToken);
          return;
        }
        actions_default.remove(productId, wishlistId, wishlistToken, nonce, element);
      },
      priority: 90
    },
    {
      selector: ".wlfmc_delete_item",
      eventName: "click",
      handler: (event, element) => {
        const itemId = getItemIdFromElement(element);
        const productId = extractProductId(element) || 0;
        const wishlistId = getWishlistIdFromElement(element);
        const nonce = element.dataset.nonce || element.getAttribute("data-nonce");
        if (!itemId && !productId) return;
        actions_default.deleteByItemId(productId || 0, itemId, wishlistId, nonce, element);
      },
      priority: 100
    },
    {
      selector: ".wlfmc_ajax_add_to_cart:not(.disabled)",
      eventName: "click",
      handler: (event, element) => {
        const itemId = getItemIdFromElement(element);
        const wishlistId = getWishlistIdFromElement(element);
        const nonce = element.dataset.nonce || element.getAttribute("data-nonce");
        if (!itemId) return;
        if (!shouldSendAddToCartRequest(element)) {
          triggerAjaxRequestNotSent(element);
          return;
        }
        element.classList.remove("added");
        element.classList.add("loading");
        const addToCartData = { action: "wlfmc_add_to_cart", lid: itemId, wid: wishlistId, nonce };
        triggerAddingToCart(element, addToCartData);
        queueManager.addWithDeduplication("add_to_cart", addToCartData).then((result) => {
          if (result.error) {
            if (result.product_url) {
              window.location = result.product_url;
              return;
            }
            showError(result.error || window.wlfmc_l10n?.labels?.failed_add_to_cart_message);
            return;
          }
          if (typeof wc_add_to_cart_params !== "undefined" && validators_default.isTrue(wc_add_to_cart_params.cart_redirect_after_add)) {
            window.location = wc_add_to_cart_params.cart_url;
            return;
          }
          triggerAddedToCartEvents(result.fragments, result.cart_hash, element);
          if (result.fragments) {
            const miniCart = document.querySelector("div.widget_shopping_cart_content");
            if (miniCart && result.fragments["div.widget_shopping_cart_content"]) {
              miniCart.outerHTML = result.fragments["div.widget_shopping_cart_content"];
            }
          }
          if (window.wlfmc_l10n?.labels?.added_to_cart_message) {
            showSuccess(window.wlfmc_l10n.labels.added_to_cart_message);
          }
          if (window.wlfmc_l10n?.remove_from_wishlist_after_add_to_cart) {
            const removeBtn = element.closest("tr")?.querySelector(".remove_from_wishlist");
            if (removeBtn) removeBtn.dispatchEvent(new Event("click", { bubbles: true, cancelable: true }));
          }
          if (result.message) {
            const jQuery = window.jQuery;
            if (jQuery) {
              jQuery(document.body).trigger("add_to_cart_message", [result.message, ensurejQuery(element)]);
            } else {
              document.body.dispatchEvent(new CustomEvent("add_to_cart_message", {
                bubbles: true,
                detail: { message: result.message, button: element }
              }));
            }
          }
        }).catch((error) => {
          showError(error.message || window.wlfmc_l10n?.labels?.add_to_cart_failed);
        }).finally(() => element.classList.remove("loading"));
      },
      priority: 80
    },
    {
      selector: ".wlfmc_already_in_wishlist",
      eventName: "click",
      handler: (event) => {
        event.preventDefault();
        showError(window.wlfmc_l10n?.labels?.already_in_wishlist_text);
      },
      priority: 50
    },
    {
      selector: ".wlfmc-btn-login-need",
      eventName: "click",
      handler: (event) => {
        event.preventDefault();
        showError(window.wlfmc_l10n?.labels?.login_need);
      },
      priority: 50
    },
    {
      selector: ".wlfmc-popup-trigger:not(.wlfmc-disabled):not(.wlfmc-waitlist-btn-login-need):not(.wlfmc-multi-list-btn-login-need)",
      eventName: "click",
      handler: (event, element) => {
        event.preventDefault();
        const popupId = element.dataset.popupId;
        if (!popupId) return;
        const popup = document.getElementById(popupId);
        if (!popup) return;
        const tooltip = document.getElementById("wlfmc-tooltip");
        if (tooltip) {
          tooltip.style.top = "0";
          tooltip.style.left = "0";
          tooltip.className = "tooltip__hidden";
        }
        getOrCreate(popup, {
          absolute: false,
          color: "#333",
          transition: "all 0.3s",
          horizontal: popup.dataset.horizontal || "center",
          vertical: popup.dataset.vertical || "center"
        });
        showPopup(popup);
      },
      priority: 70
    }
  ];
  var wishlistModule = {
    name: "wishlist",
    store: store_default,
    actions: actions_default,
    ui: ui_default,
    init() {
      eventManager.registerModuleHandlers("wishlist", wishlistHandlers);
      eventBus.on("variation:shown", (data) => handleVariationShown(data, "wishlist", store_default, ui_default));
      eventBus.on("variation:reset", (data) => handleVariationReset(data.productId, "wishlist", store_default, ui_default));
      eventBus.on("cache:apply", () => this.applyState());
      eventBus.on("store:sync-wishlist", (data) => {
        store_default.syncFromData(data);
        this.applyState();
      });
      eventBus.on("system:data-ready", () => this.applyState());
      eventBus.on(EVENTS.SYNC_COMPLETED, (result) => {
        if (result?.remoteTriggered) {
          fragmentManager.loadFragments({ s: "wishlist" });
        }
        this.applyState();
      });
      eventBus.on("counter:remove", ({ isWishlist, productId, wishlistId, nonce, wishlistToken, element = null }) => {
        if (!isWishlist) return;
        const isMerge = state_cache_default.getConfig()?.mergeLists === true;
        if (isMerge && wishlistId) {
          if (element) {
            const row = element.closest("[data-row-id]");
            if (row) {
              const lists = state_cache_default.getLists();
              const nextList = lists.find((l) => {
                if (String(l.wishlist_id ?? l.id) === String(wishlistId)) return false;
                return (l.wishlist_items || []).some(
                  (i) => String(i.product_id) === String(productId)
                );
              });
              if (nextList) {
                const nextListId = String(nextList.wishlist_id ?? nextList.id ?? "");
                row.dataset.wishlistId = nextListId;
                row.setAttribute("data-wishlist-id", nextListId);
                const nextItem = (nextList.wishlist_items || []).find(
                  (i) => String(i.product_id) === String(productId)
                );
                if (nextItem) {
                  if (nextItem.remove_nonce) {
                    const removeLink = row.querySelector(".remove_from_wishlist");
                    if (removeLink) {
                      removeLink.setAttribute("data-nonce", nextItem.remove_nonce);
                    }
                  }
                  if (nextItem.wishlist_token) {
                    row.setAttribute("data-wishlist-token", nextItem.wishlist_token);
                    row.dataset.wishlistToken = nextItem.wishlist_token;
                  }
                }
              }
            }
          }
          actions_default2.removeFromList(productId, wishlistId, nonce, element);
          return;
        }
        const item = store_default.getItem(productId);
        actions_default.counterRemove(
          productId,
          item?.wishlist_id || wishlistId || 0,
          item?.remove_nonce || nonce || "",
          item?.wishlist_token || wishlistToken || "",
          element
        );
      });
      eventBus.on("cart:item_added_to_cart", ({ rowId, wishlistId, listType, isUserOwner }) => {
        if (listType !== "wishlist" || !isUserOwner) return;
        actions_default.remove(rowId, wishlistId);
      });
    },
    applyState() {
    },
    getStatus() {
      return { count: store_default.count.get(), items: store_default.items.get().length };
    }
  };
  var wishlist_default = wishlistModule;

  // src/frontend/js/modern/entry-free.js
  var modernSystem = createModernSystem([wishlist_default]);
  document.addEventListener("DOMContentLoaded", () => {
    modernSystem.init({ premium: false });
  });
  var entry_free_default = modernSystem;
  return __toCommonJS(entry_free_exports);
})();
//# sourceMappingURL=modern-free-bundle.js.map
