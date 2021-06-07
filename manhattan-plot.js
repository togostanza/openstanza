var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now$1 = function() {
  return root$2.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now$1());
  }

  function debounced() {
    var time = now$1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$1(value) && objectToString$1.call(value) == symbolTag$1);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol$1(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_debounce = debounce;

// In the absence of a WeakSet or WeakMap implementation, don't break, but don't cache either.
function noop$2() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
}
function createWeakMap() {
    if (typeof WeakMap !== "undefined") {
        return new WeakMap();
    }
    else {
        return fakeSetOrMap();
    }
}
/**
 * Creates and returns a no-op implementation of a WeakMap / WeakSet that never stores anything.
 */
function fakeSetOrMap() {
    return {
        add: noop$2,
        delete: noop$2,
        get: noop$2,
        set: noop$2,
        has: function (k) {
            return false;
        },
    };
}
// Safe hasOwnProperty
var hop = Object.prototype.hasOwnProperty;
var has = function (obj, prop) {
    return hop.call(obj, prop);
};
// Copy all own enumerable properties from source to target
function extend$1(target, source) {
    for (var prop in source) {
        if (has(source, prop)) {
            target[prop] = source[prop];
        }
    }
    return target;
}
var reLeadingNewline = /^[ \t]*(?:\r\n|\r|\n)/;
var reTrailingNewline = /(?:\r\n|\r|\n)[ \t]*$/;
var reStartsWithNewlineOrIsEmpty = /^(?:[\r\n]|$)/;
var reDetectIndentation = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/;
var reOnlyWhitespaceWithAtLeastOneNewline = /^[ \t]*[\r\n][ \t\r\n]*$/;
function _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options) {
    // If first interpolated value is a reference to outdent,
    // determine indentation level from the indentation of the interpolated value.
    var indentationLevel = 0;
    var match = strings[0].match(reDetectIndentation);
    if (match) {
        indentationLevel = match[1].length;
    }
    var reSource = "(\\r\\n|\\r|\\n).{0," + indentationLevel + "}";
    var reMatchIndent = new RegExp(reSource, "g");
    if (firstInterpolatedValueSetsIndentationLevel) {
        strings = strings.slice(1);
    }
    var newline = options.newline, trimLeadingNewline = options.trimLeadingNewline, trimTrailingNewline = options.trimTrailingNewline;
    var normalizeNewlines = typeof newline === "string";
    var l = strings.length;
    var outdentedStrings = strings.map(function (v, i) {
        // Remove leading indentation from all lines
        v = v.replace(reMatchIndent, "$1");
        // Trim a leading newline from the first string
        if (i === 0 && trimLeadingNewline) {
            v = v.replace(reLeadingNewline, "");
        }
        // Trim a trailing newline from the last string
        if (i === l - 1 && trimTrailingNewline) {
            v = v.replace(reTrailingNewline, "");
        }
        // Normalize newlines
        if (normalizeNewlines) {
            v = v.replace(/\r\n|\n|\r/g, function (_) { return newline; });
        }
        return v;
    });
    return outdentedStrings;
}
function concatStringsAndValues(strings, values) {
    var ret = "";
    for (var i = 0, l = strings.length; i < l; i++) {
        ret += strings[i];
        if (i < l - 1) {
            ret += values[i];
        }
    }
    return ret;
}
function isTemplateStringsArray(v) {
    return has(v, "raw") && has(v, "length");
}
/**
 * It is assumed that opts will not change.  If this is a problem, clone your options object and pass the clone to
 * makeInstance
 * @param options
 * @return {outdent}
 */
function createInstance(options) {
    /** Cache of pre-processed template literal arrays */
    var arrayAutoIndentCache = createWeakMap();
    /**
       * Cache of pre-processed template literal arrays, where first interpolated value is a reference to outdent,
       * before interpolated values are injected.
       */
    var arrayFirstInterpSetsIndentCache = createWeakMap();
    function outdent(stringsOrOptions) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        /* tslint:enable:no-shadowed-variable */
        if (isTemplateStringsArray(stringsOrOptions)) {
            var strings = stringsOrOptions;
            // Is first interpolated value a reference to outdent, alone on its own line, without any preceding non-whitespace?
            var firstInterpolatedValueSetsIndentationLevel = (values[0] === outdent || values[0] === defaultOutdent) &&
                reOnlyWhitespaceWithAtLeastOneNewline.test(strings[0]) &&
                reStartsWithNewlineOrIsEmpty.test(strings[1]);
            // Perform outdentation
            var cache = firstInterpolatedValueSetsIndentationLevel
                ? arrayFirstInterpSetsIndentCache
                : arrayAutoIndentCache;
            var renderedArray = cache.get(strings);
            if (!renderedArray) {
                renderedArray = _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options);
                cache.set(strings, renderedArray);
            }
            /** If no interpolated values, skip concatenation step */
            if (values.length === 0) {
                return renderedArray[0];
            }
            /** Concatenate string literals with interpolated values */
            var rendered = concatStringsAndValues(renderedArray, firstInterpolatedValueSetsIndentationLevel ? values.slice(1) : values);
            return rendered;
        }
        else {
            // Create and return a new instance of outdent with the given options
            return createInstance(extend$1(extend$1({}, options), stringsOrOptions || {}));
        }
    }
    var fullOutdent = extend$1(outdent, {
        string: function (str) {
            return _outdentArray([str], false, options)[0];
        },
    });
    return fullOutdent;
}
var defaultOutdent = createInstance({
    trimLeadingNewline: true,
    trimTrailingNewline: true,
});
if (typeof module !== "undefined") {
    // In webpack harmony-modules environments, module.exports is read-only,
    // so we fail gracefully.
    try {
        module.exports = defaultOutdent;
        Object.defineProperty(defaultOutdent, "__esModule", { value: true });
        defaultOutdent.default = defaultOutdent;
        defaultOutdent.outdent = defaultOutdent;
    }
    catch (e) { }
}

var alert = {
	name: "alert",
	keywords: [
		"warning",
		"triangle",
		"exclamation",
		"point"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M13 17.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-8.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z\"></path><path fill-rule=\"evenodd\" d=\"M9.836 3.244c.963-1.665 3.365-1.665 4.328 0l8.967 15.504c.963 1.667-.24 3.752-2.165 3.752H3.034c-1.926 0-3.128-2.085-2.165-3.752L9.836 3.244zm3.03.751a1 1 0 00-1.732 0L2.168 19.499A1 1 0 003.034 21h17.932a1 1 0 00.866-1.5L12.866 3.994z\"></path>"
		}
	}
};
var archive = {
	name: "archive",
	keywords: [
		"box",
		"catalog"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 2.5a.25.25 0 00-.25.25v1.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-1.5a.25.25 0 00-.25-.25H1.75zM0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0114.25 6H1.75A1.75 1.75 0 010 4.25v-1.5zM1.75 7a.75.75 0 01.75.75v5.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25v-5.5a.75.75 0 111.5 0v5.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25v-5.5A.75.75 0 011.75 7zm4.5 1a.75.75 0 000 1.5h3.5a.75.75 0 100-1.5h-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 2A1.75 1.75 0 001 3.75v3.5C1 8.216 1.784 9 2.75 9h18.5A1.75 1.75 0 0023 7.25v-3.5A1.75 1.75 0 0021.25 2H2.75zm18.5 1.5H2.75a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h18.5a.25.25 0 00.25-.25v-3.5a.25.25 0 00-.25-.25z\"></path><path d=\"M2.75 10a.75.75 0 01.75.75v9.5c0 .138.112.25.25.25h16.5a.25.25 0 00.25-.25v-9.5a.75.75 0 011.5 0v9.5A1.75 1.75 0 0120.25 22H3.75A1.75 1.75 0 012 20.25v-9.5a.75.75 0 01.75-.75z\"></path><path d=\"M9.75 11.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z\"></path>"
		}
	}
};
var beaker = {
	name: "beaker",
	keywords: [
		"experiment",
		"labs",
		"experimental",
		"feature",
		"test",
		"science",
		"education",
		"study",
		"development",
		"testing"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5 5.782V2.5h-.25a.75.75 0 010-1.5h6.5a.75.75 0 010 1.5H11v3.282l3.666 5.76C15.619 13.04 14.543 15 12.767 15H3.233c-1.776 0-2.852-1.96-1.899-3.458L5 5.782zM9.5 2.5h-3V6a.75.75 0 01-.117.403L4.73 9h6.54L9.617 6.403A.75.75 0 019.5 6V2.5zm-6.9 9.847L3.775 10.5h8.45l1.175 1.847a.75.75 0 01-.633 1.153H3.233a.75.75 0 01-.633-1.153z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M8 8.807V3.5h-.563a.75.75 0 010-1.5h9.125a.75.75 0 010 1.5H16v5.307l5.125 9.301c.964 1.75-.302 3.892-2.299 3.892H5.174c-1.998 0-3.263-2.142-2.3-3.892L8 8.807zM14.5 3.5h-5V9a.75.75 0 01-.093.362L7.127 13.5h9.746l-2.28-4.138A.75.75 0 0114.5 9V3.5zM4.189 18.832L6.3 15h11.4l2.111 3.832a1.125 1.125 0 01-.985 1.668H5.174a1.125 1.125 0 01-.985-1.668z\"></path>"
		}
	}
};
var bell = {
	name: "bell",
	keywords: [
		"notification"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z\"></path><path fill-rule=\"evenodd\" d=\"M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 1C8.318 1 5 3.565 5 7v4.539a3.25 3.25 0 01-.546 1.803l-2.2 3.299A1.518 1.518 0 003.519 19H8.5a3.5 3.5 0 107 0h4.982a1.518 1.518 0 001.263-2.36l-2.2-3.298A3.25 3.25 0 0119 11.539V7c0-3.435-3.319-6-7-6zM6.5 7c0-2.364 2.383-4.5 5.5-4.5s5.5 2.136 5.5 4.5v4.539c0 .938.278 1.854.798 2.635l2.199 3.299a.017.017 0 01.003.01l-.001.006-.004.006-.006.004-.007.001H3.518l-.007-.001-.006-.004-.004-.006-.001-.007.003-.01 2.2-3.298a4.75 4.75 0 00.797-2.635V7zM14 19h-4a2 2 0 104 0z\"></path>"
		}
	}
};
var bold = {
	name: "bold",
	keywords: [
		"markdown",
		"bold",
		"text"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4 2a1 1 0 00-1 1v10a1 1 0 001 1h5.5a3.5 3.5 0 001.852-6.47A3.5 3.5 0 008.5 2H4zm4.5 5a1.5 1.5 0 100-3H5v3h3.5zM5 9v3h4.5a1.5 1.5 0 000-3H5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6 4.75c0-.69.56-1.25 1.25-1.25h5a4.75 4.75 0 013.888 7.479A5 5 0 0114 20.5H7.25c-.69 0-1.25-.56-1.25-1.25V4.75zM8.5 13v5H14a2.5 2.5 0 000-5H8.5zm0-2.5h3.751A2.25 2.25 0 0012.25 6H8.5v4.5z\"></path>"
		}
	}
};
var book = {
	name: "book",
	keywords: [
		"book",
		"journal",
		"wiki",
		"readme"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M0 3.75A.75.75 0 01.75 3h7.497c1.566 0 2.945.8 3.751 2.014A4.496 4.496 0 0115.75 3h7.5a.75.75 0 01.75.75v15.063a.75.75 0 01-.755.75l-7.682-.052a3 3 0 00-2.142.878l-.89.891a.75.75 0 01-1.061 0l-.902-.901a3 3 0 00-2.121-.879H.75a.75.75 0 01-.75-.75v-15zm11.247 3.747a3 3 0 00-3-2.997H1.5V18h6.947a4.5 4.5 0 012.803.98l-.003-11.483zm1.503 11.485V7.5a3 3 0 013-3h6.75v13.558l-6.927-.047a4.5 4.5 0 00-2.823.971z\"></path>"
		}
	}
};
var bookmark = {
	name: "bookmark",
	keywords: [
		"tab",
		"star"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 2.5a.25.25 0 00-.25.25v9.91l3.023-2.489a.75.75 0 01.954 0l3.023 2.49V2.75a.25.25 0 00-.25-.25h-6.5zM3 2.75C3 1.784 3.784 1 4.75 1h6.5c.966 0 1.75.784 1.75 1.75v11.5a.75.75 0 01-1.227.579L8 11.722l-3.773 3.107A.75.75 0 013 14.25V2.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5 3.75C5 2.784 5.784 2 6.75 2h10.5c.966 0 1.75.784 1.75 1.75v17.5a.75.75 0 01-1.218.586L12 17.21l-5.781 4.625A.75.75 0 015 21.25V3.75zm1.75-.25a.25.25 0 00-.25.25v15.94l5.031-4.026a.75.75 0 01.938 0L17.5 19.69V3.75a.25.25 0 00-.25-.25H6.75z\"></path>"
		}
	}
};
var briefcase = {
	name: "briefcase",
	keywords: [
		"suitcase",
		"business"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.75 0A1.75 1.75 0 005 1.75V3H1.75A1.75 1.75 0 000 4.75v8.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H11V1.75A1.75 1.75 0 009.25 0h-2.5zM9.5 3V1.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25V3h3zM5 4.5H1.75a.25.25 0 00-.25.25V6a2 2 0 002 2h9a2 2 0 002-2V4.75a.25.25 0 00-.25-.25H5zm-1.5 5a3.484 3.484 0 01-2-.627v4.377c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V8.873a3.484 3.484 0 01-2 .627h-9z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M7.5 1.75C7.5.784 8.284 0 9.25 0h5.5c.966 0 1.75.784 1.75 1.75V4h4.75c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0121.25 22H2.75A1.75 1.75 0 011 20.25V5.75C1 4.784 1.784 4 2.75 4H7.5V1.75zm-5 10.24v8.26c0 .138.112.25.25.25h18.5a.25.25 0 00.25-.25v-8.26A4.233 4.233 0 0118.75 13H5.25a4.233 4.233 0 01-2.75-1.01zm19-3.24a2.75 2.75 0 01-2.75 2.75H5.25A2.75 2.75 0 012.5 8.75v-3a.25.25 0 01.25-.25h18.5a.25.25 0 01.25.25v3zm-6.5-7V4H9V1.75a.25.25 0 01.25-.25h5.5a.25.25 0 01.25.25z\"></path>"
		}
	}
};
var broadcast = {
	name: "broadcast",
	keywords: [
		"rss",
		"radio",
		"signal"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.267 1.457c.3.286.312.76.026 1.06A6.475 6.475 0 001.5 7a6.472 6.472 0 001.793 4.483.75.75 0 01-1.086 1.034 8.89 8.89 0 01-.276-.304l.569-.49-.569.49A7.971 7.971 0 010 7c0-2.139.84-4.083 2.207-5.517a.75.75 0 011.06-.026zm9.466 0a.75.75 0 011.06.026A7.975 7.975 0 0116 7c0 2.139-.84 4.083-2.207 5.517a.75.75 0 11-1.086-1.034A6.475 6.475 0 0014.5 7a6.475 6.475 0 00-1.793-4.483.75.75 0 01.026-1.06zM8.75 8.582a1.75 1.75 0 10-1.5 0v5.668a.75.75 0 001.5 0V8.582zM5.331 4.736a.75.75 0 10-1.143-.972A4.983 4.983 0 003 7c0 1.227.443 2.352 1.177 3.222a.75.75 0 001.146-.967A3.483 3.483 0 014.5 7c0-.864.312-1.654.831-2.264zm6.492-.958a.75.75 0 00-1.146.967c.514.61.823 1.395.823 2.255 0 .86-.31 1.646-.823 2.255a.75.75 0 101.146.967A4.983 4.983 0 0013 7a4.983 4.983 0 00-1.177-3.222z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M20.485 2.515a.75.75 0 00-1.06 1.06A10.465 10.465 0 0122.5 11c0 2.9-1.174 5.523-3.075 7.424a.75.75 0 001.06 1.061A11.965 11.965 0 0024 11c0-3.314-1.344-6.315-3.515-8.485zm-15.91 1.06a.75.75 0 00-1.06-1.06A11.965 11.965 0 000 11c0 3.313 1.344 6.314 3.515 8.485a.75.75 0 001.06-1.06A10.465 10.465 0 011.5 11c0-2.9 1.174-5.524 3.075-7.425zM8.11 7.11a.75.75 0 00-1.06-1.06A6.98 6.98 0 005 11a6.98 6.98 0 002.05 4.95.75.75 0 001.06-1.061 5.48 5.48 0 01-1.61-3.89 5.48 5.48 0 011.61-3.888zm8.84-1.06a.75.75 0 10-1.06 1.06A5.48 5.48 0 0117.5 11a5.48 5.48 0 01-1.61 3.889.75.75 0 101.06 1.06A6.98 6.98 0 0019 11a6.98 6.98 0 00-2.05-4.949zM14 11a2 2 0 01-1.25 1.855v8.395a.75.75 0 01-1.5 0v-8.395A2 2 0 1114 11z\"></path>"
		}
	}
};
var browser = {
	name: "browser",
	keywords: [
		"window",
		"web"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6 3h1v1H6V3zM4 3h1v1H4V3zM2 3h1v1H2V3zm12 10H2V5h12v8zm0-9H8V3h6v1zm1-1c0-.55-.45-1-1-1H2c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3z\"></path>"
		}
	}
};
var bug = {
	name: "bug",
	keywords: [
		"insect",
		"issue"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M11 10h3V9h-3V8l3.17-1.03-.34-.94L11 7V6c0-.55-.45-1-1-1V4c0-.48-.36-.88-.83-.97L10.2 2H12V1H9.8l-2 2h-.59L5.2 1H3v1h1.8l1.03 1.03C5.36 3.12 5 3.51 5 4v1c-.55 0-1 .45-1 1v1l-2.83-.97-.34.94L4 8v1H1v1h3v1L.83 12.03l.34.94L4 12v1c0 .55.45 1 1 1h1l1-1V6h1v7l1 1h1c.55 0 1-.45 1-1v-1l2.83.97.34-.94L11 11v-1zM9 5H6V4h3v1z\"></path>"
		}
	}
};
var calendar = {
	name: "calendar",
	keywords: [
		"time",
		"day",
		"month",
		"year",
		"date",
		"appointment"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6.75 0a.75.75 0 01.75.75V3h9V.75a.75.75 0 011.5 0V3h2.75c.966 0 1.75.784 1.75 1.75v16a1.75 1.75 0 01-1.75 1.75H3.25a1.75 1.75 0 01-1.75-1.75v-16C1.5 3.784 2.284 3 3.25 3H6V.75A.75.75 0 016.75 0zm-3.5 4.5a.25.25 0 00-.25.25V8h18V4.75a.25.25 0 00-.25-.25H3.25zM21 9.5H3v11.25c0 .138.112.25.25.25h17.5a.25.25 0 00.25-.25V9.5z\"></path>"
		}
	}
};
var check = {
	name: "check",
	keywords: [
		"mark",
		"yes",
		"confirm",
		"accept",
		"ok",
		"success"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M21.03 5.72a.75.75 0 010 1.06l-11.5 11.5a.75.75 0 01-1.072-.012l-5.5-5.75a.75.75 0 111.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 011.06 0z\"></path>"
		}
	}
};
var checklist = {
	name: "checklist",
	keywords: [
		"todo",
		"tasks"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.5 1.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v7.736a.75.75 0 101.5 0V1.75A1.75 1.75 0 0011.25 0h-8.5A1.75 1.75 0 001 1.75v11.5c0 .966.784 1.75 1.75 1.75h3.17a.75.75 0 000-1.5H2.75a.25.25 0 01-.25-.25V1.75zM4.75 4a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM4 7.75A.75.75 0 014.75 7h2a.75.75 0 010 1.5h-2A.75.75 0 014 7.75zm11.774 3.537a.75.75 0 00-1.048-1.074L10.7 14.145 9.281 12.72a.75.75 0 00-1.062 1.058l1.943 1.95a.75.75 0 001.055.008l4.557-4.45z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M3.5 3.75a.25.25 0 01.25-.25h13.5a.25.25 0 01.25.25v10a.75.75 0 001.5 0v-10A1.75 1.75 0 0017.25 2H3.75A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h7a.75.75 0 000-1.5h-7a.25.25 0 01-.25-.25V3.75z\"></path><path d=\"M6.25 7a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm-.75 4.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm16.28 4.53a.75.75 0 10-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.5-5.5z\"></path>"
		}
	}
};
var circle = {
	name: "circle",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.404 3.404a6.5 6.5 0 109.192 9.192 6.5 6.5 0 00-9.192-9.192zm-1.06 10.253A8 8 0 1113.656 2.343 8 8 0 012.343 13.657z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z\"></path>"
		}
	}
};
var clippy = {
	name: "clippy",
	keywords: [
		"copy",
		"paste",
		"save",
		"capture",
		"clipboard"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.962 2.513a.75.75 0 01-.475.949l-.816.272a.25.25 0 00-.171.237V21.25c0 .138.112.25.25.25h14.5a.25.25 0 00.25-.25V3.97a.25.25 0 00-.17-.236l-.817-.272a.75.75 0 01.474-1.424l.816.273A1.75 1.75 0 0121 3.97v17.28A1.75 1.75 0 0119.25 23H4.75A1.75 1.75 0 013 21.25V3.97a1.75 1.75 0 011.197-1.66l.816-.272a.75.75 0 01.949.475z\"></path><path fill-rule=\"evenodd\" d=\"M7 1.75C7 .784 7.784 0 8.75 0h6.5C16.216 0 17 .784 17 1.75v1.5A1.75 1.75 0 0115.25 5h-6.5A1.75 1.75 0 017 3.25v-1.5zm1.75-.25a.25.25 0 00-.25.25v1.5c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25v-1.5a.25.25 0 00-.25-.25h-6.5z\"></path>"
		}
	}
};
var clock$1 = {
	name: "clock",
	keywords: [
		"time",
		"hour",
		"minute",
		"second",
		"watch"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12.5 7.25a.75.75 0 00-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 00.744-1.302L12.5 12.315V7.25z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
};
var code = {
	name: "code",
	keywords: [
		"brackets"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M8.78 4.97a.75.75 0 010 1.06L2.81 12l5.97 5.97a.75.75 0 11-1.06 1.06l-6.5-6.5a.75.75 0 010-1.06l6.5-6.5a.75.75 0 011.06 0zm6.44 0a.75.75 0 000 1.06L21.19 12l-5.97 5.97a.75.75 0 101.06 1.06l6.5-6.5a.75.75 0 000-1.06l-6.5-6.5a.75.75 0 00-1.06 0z\"></path>"
		}
	}
};
var comment = {
	name: "comment",
	keywords: [
		"speak",
		"bubble"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.72-3.72a.75.75 0 01.53-.22h10a.25.25 0 00.25-.25V4.25a.25.25 0 00-.25-.25H3.25zm-1.75.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 01-1.75 1.75h-9.69l-3.573 3.573A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25z\"></path>"
		}
	}
};
var commit = {
	name: "commit",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M17.5 11.75a.75.75 0 01.75-.75h5a.75.75 0 010 1.5h-5a.75.75 0 01-.75-.75zm-17.5 0A.75.75 0 01.75 11h5a.75.75 0 010 1.5h-5a.75.75 0 01-.75-.75z\"></path><path fill-rule=\"evenodd\" d=\"M12 16.25a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 1.5a6 6 0 100-12 6 6 0 000 12z\"></path>"
		}
	}
};
var container = {
	name: "container",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M10.41.24l4.711 2.774A1.767 1.767 0 0116 4.54v5.01a1.77 1.77 0 01-.88 1.53l-7.753 4.521-.002.001a1.767 1.767 0 01-1.774 0H5.59L.873 12.85A1.762 1.762 0 010 11.327V6.292c0-.304.078-.598.22-.855l.004-.005.01-.019c.15-.262.369-.486.64-.643L8.641.239a1.75 1.75 0 011.765 0l.002.001zM9.397 1.534a.25.25 0 01.252 0l4.115 2.422-7.152 4.148a.267.267 0 01-.269 0L2.227 5.716l7.17-4.182zM7.365 9.402L8.73 8.61v4.46l-1.5.875V9.473a1.77 1.77 0 00.136-.071zm2.864 2.794V7.741l1.521-.882v4.45l-1.521.887zm3.021-1.762l1.115-.65h.002a.268.268 0 00.133-.232V5.264l-1.25.725v4.445zm-11.621 1.12l4.1 2.393V9.474a1.77 1.77 0 01-.138-.072L1.5 7.029v4.298c0 .095.05.181.129.227z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M13.152.682a2.25 2.25 0 012.269 0l.007.004 6.957 4.276a2.276 2.276 0 011.126 1.964v7.516c0 .81-.432 1.56-1.133 1.968l-.002.001-11.964 7.037-.004.003a2.276 2.276 0 01-2.284 0l-.026-.015-6.503-4.502a2.268 2.268 0 01-1.096-1.943V9.438c0-.392.1-.77.284-1.1l.003-.006.014-.026a2.28 2.28 0 01.82-.827h.002L13.152.681zm.757 1.295h-.001L2.648 8.616l6.248 4.247a.776.776 0 00.758-.01h.001l11.633-6.804-6.629-4.074a.75.75 0 00-.75.003zM18 9.709l-3.25 1.9v7.548L18 17.245V9.709zm1.5-.878v7.532l2.124-1.25a.777.777 0 00.387-.671V7.363L19.5 8.831zm-9.09 5.316l2.84-1.66v7.552l-3.233 1.902v-7.612c.134-.047.265-.107.391-.18l.002-.002zm-1.893 7.754V14.33a2.277 2.277 0 01-.393-.18l-.023-.014-6.102-4.147v7.003c0 .275.145.528.379.664l.025.014 6.114 4.232z\"></path>"
		}
	}
};
var copy = {
	name: "copy",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 3A1.75 1.75 0 003 4.75v9.5c0 .966.784 1.75 1.75 1.75h1.5a.75.75 0 000-1.5h-1.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v1.5a.75.75 0 001.5 0v-1.5A1.75 1.75 0 0014.25 3h-9.5zm5 5A1.75 1.75 0 008 9.75v9.5c0 .966.784 1.75 1.75 1.75h9.5A1.75 1.75 0 0021 19.25v-9.5A1.75 1.75 0 0019.25 8h-9.5zM9.5 9.75a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v9.5a.25.25 0 01-.25.25h-9.5a.25.25 0 01-.25-.25v-9.5z\"></path>"
		}
	}
};
var cpu = {
	name: "cpu",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.5.75a.75.75 0 00-1.5 0V2H3.75A1.75 1.75 0 002 3.75V5H.75a.75.75 0 000 1.5H2v3H.75a.75.75 0 000 1.5H2v1.25c0 .966.784 1.75 1.75 1.75H5v1.25a.75.75 0 001.5 0V14h3v1.25a.75.75 0 001.5 0V14h1.25A1.75 1.75 0 0014 12.25V11h1.25a.75.75 0 000-1.5H14v-3h1.25a.75.75 0 000-1.5H14V3.75A1.75 1.75 0 0012.25 2H11V.75a.75.75 0 00-1.5 0V2h-3V.75zm5.75 11.75h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25zM5.75 5a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5zm.75 4.5v-3h3v3h-3z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M8.75 8a.75.75 0 00-.75.75v6.5c0 .414.336.75.75.75h6.5a.75.75 0 00.75-.75v-6.5a.75.75 0 00-.75-.75h-6.5zm.75 6.5v-5h5v5h-5z\"></path><path fill-rule=\"evenodd\" d=\"M15.25 1a.75.75 0 01.75.75V4h2.25c.966 0 1.75.784 1.75 1.75V8h2.25a.75.75 0 010 1.5H20v5h2.25a.75.75 0 010 1.5H20v2.25A1.75 1.75 0 0118.25 20H16v2.25a.75.75 0 01-1.5 0V20h-5v2.25a.75.75 0 01-1.5 0V20H5.75A1.75 1.75 0 014 18.25V16H1.75a.75.75 0 010-1.5H4v-5H1.75a.75.75 0 010-1.5H4V5.75C4 4.784 4.784 4 5.75 4H8V1.75a.75.75 0 011.5 0V4h5V1.75a.75.75 0 01.75-.75zm3 17.5a.25.25 0 00.25-.25V5.75a.25.25 0 00-.25-.25H5.75a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5z\"></path>"
		}
	}
};
var dash = {
	name: "dash",
	keywords: [
		"hyphen",
		"range"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2 7.75A.75.75 0 012.75 7h10a.75.75 0 010 1.5h-10A.75.75 0 012 7.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z\"></path>"
		}
	}
};
var database = {
	name: "database",
	keywords: [
		"disks",
		"data"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.5 3.5c0-.133.058-.318.282-.55.227-.237.592-.484 1.1-.708C4.899 1.795 6.354 1.5 8 1.5c1.647 0 3.102.295 4.117.742.51.224.874.47 1.101.707.224.233.282.418.282.551 0 .133-.058.318-.282.55-.227.237-.592.484-1.1.708C11.101 5.205 9.646 5.5 8 5.5c-1.647 0-3.102-.295-4.117-.742-.51-.224-.874-.47-1.101-.707-.224-.233-.282-.418-.282-.551zM1 3.5c0-.626.292-1.165.7-1.59.406-.422.956-.767 1.579-1.041C4.525.32 6.195 0 8 0c1.805 0 3.475.32 4.722.869.622.274 1.172.62 1.578 1.04.408.426.7.965.7 1.591v9c0 .626-.292 1.165-.7 1.59-.406.422-.956.767-1.579 1.041C11.476 15.68 9.806 16 8 16c-1.805 0-3.475-.32-4.721-.869-.623-.274-1.173-.62-1.579-1.04-.408-.426-.7-.965-.7-1.591v-9zM2.5 8V5.724c.241.15.503.286.779.407C4.525 6.68 6.195 7 8 7c1.805 0 3.475-.32 4.722-.869.275-.121.537-.257.778-.407V8c0 .133-.058.318-.282.55-.227.237-.592.484-1.1.708C11.101 9.705 9.646 10 8 10c-1.647 0-3.102-.295-4.117-.742-.51-.224-.874-.47-1.101-.707C2.558 8.318 2.5 8.133 2.5 8zm0 2.225V12.5c0 .133.058.318.282.55.227.237.592.484 1.1.708 1.016.447 2.471.742 4.118.742 1.647 0 3.102-.295 4.117-.742.51-.224.874-.47 1.101-.707.224-.233.282-.418.282-.551v-2.275c-.241.15-.503.285-.778.406-1.247.549-2.917.869-4.722.869-1.805 0-3.475-.32-4.721-.869a6.236 6.236 0 01-.779-.406z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 1.25c-2.487 0-4.774.402-6.466 1.079-.844.337-1.577.758-2.112 1.264C2.886 4.1 2.5 4.744 2.5 5.5v12.987l.026.013H2.5c0 .756.386 1.4.922 1.907.535.506 1.268.927 2.112 1.264 1.692.677 3.979 1.079 6.466 1.079s4.773-.402 6.466-1.079c.844-.337 1.577-.758 2.112-1.264.536-.507.922-1.151.922-1.907h-.026l.026-.013V5.5c0-.756-.386-1.4-.922-1.907-.535-.506-1.268-.927-2.112-1.264C16.773 1.652 14.487 1.25 12 1.25zM4 5.5c0-.21.104-.487.453-.817.35-.332.899-.666 1.638-.962C7.566 3.131 9.655 2.75 12 2.75c2.345 0 4.434.382 5.909.971.74.296 1.287.63 1.638.962.35.33.453.606.453.817 0 .21-.104.487-.453.817-.35.332-.899.666-1.638.962-1.475.59-3.564.971-5.909.971-2.345 0-4.434-.382-5.909-.971-.74-.296-1.287-.63-1.638-.962C4.103 5.987 4 5.711 4 5.5zM20 12V7.871a7.842 7.842 0 01-1.534.8C16.773 9.348 14.487 9.75 12 9.75s-4.774-.402-6.466-1.079A7.843 7.843 0 014 7.871V12c0 .21.104.487.453.817.35.332.899.666 1.638.961 1.475.59 3.564.972 5.909.972 2.345 0 4.434-.382 5.909-.972.74-.295 1.287-.629 1.638-.96.35-.33.453-.607.453-.818zM4 14.371c.443.305.963.572 1.534.8 1.692.677 3.979 1.079 6.466 1.079s4.773-.402 6.466-1.079a7.842 7.842 0 001.534-.8v4.116l.013.013H20c0 .21-.104.487-.453.817-.35.332-.899.666-1.638.962-1.475.59-3.564.971-5.909.971-2.345 0-4.434-.382-5.909-.971-.74-.296-1.287-.63-1.638-.962-.35-.33-.453-.606-.453-.817h-.013L4 18.487V14.37z\"></path>"
		}
	}
};
var diff = {
	name: "diff",
	keywords: [
		"difference",
		"changes",
		"compare"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.75 1.75a.75.75 0 00-1.5 0V5H4a.75.75 0 000 1.5h3.25v3.25a.75.75 0 001.5 0V6.5H12A.75.75 0 0012 5H8.75V1.75zM4 13a.75.75 0 000 1.5h8a.75.75 0 100-1.5H4z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.25 3.5a.75.75 0 01.75.75V8.5h4.25a.75.75 0 010 1.5H13v4.25a.75.75 0 01-1.5 0V10H7.25a.75.75 0 010-1.5h4.25V4.25a.75.75 0 01.75-.75zM6.562 19.25a.75.75 0 01.75-.75h9.938a.75.75 0 010 1.5H7.312a.75.75 0 01-.75-.75z\"></path>"
		}
	}
};
var dot = {
	name: "dot",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM4 8a4 4 0 118 0 4 4 0 01-8 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 1.5a6 6 0 100-12 6 6 0 000 12z\"></path>"
		}
	}
};
var download = {
	name: "download",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z\"></path>"
		}
	}
};
var ellipsis = {
	name: "ellipsis",
	keywords: [
		"dot",
		"read",
		"more",
		"hidden",
		"expand"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 5.75C0 4.784.784 4 1.75 4h12.5c.966 0 1.75.784 1.75 1.75v4.5A1.75 1.75 0 0114.25 12H1.75A1.75 1.75 0 010 10.25v-4.5zM4 7a1 1 0 100 2 1 1 0 000-2zm3 1a1 1 0 112 0 1 1 0 01-2 0zm5-1a1 1 0 100 2 1 1 0 000-2z\"></path>"
		}
	}
};
var eye = {
	name: "eye",
	keywords: [
		"look",
		"watch",
		"see"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z\"></path><path fill-rule=\"evenodd\" d=\"M12 3.5c-3.432 0-6.125 1.534-8.054 3.24C2.02 8.445.814 10.352.33 11.202a1.6 1.6 0 000 1.598c.484.85 1.69 2.758 3.616 4.46C5.876 18.966 8.568 20.5 12 20.5c3.432 0 6.125-1.534 8.054-3.24 1.926-1.704 3.132-3.611 3.616-4.461a1.6 1.6 0 000-1.598c-.484-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5zM1.633 11.945c.441-.774 1.551-2.528 3.307-4.08C6.69 6.314 9.045 5 12 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.111.111 0 01.017.056.111.111 0 01-.017.056c-.441.774-1.551 2.527-3.307 4.08C17.31 17.685 14.955 19 12 19c-2.955 0-5.309-1.315-7.06-2.864-1.756-1.553-2.866-3.306-3.307-4.08A.11.11 0 011.616 12a.11.11 0 01.017-.055z\"></path>"
		}
	}
};
var file = {
	name: "file",
	keywords: [
		"file",
		"text",
		"words"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5 2.5a.5.5 0 00-.5.5v18a.5.5 0 00.5.5h14a.5.5 0 00.5-.5V8.5h-4a2 2 0 01-2-2v-4H5zm10 0v4a.5.5 0 00.5.5h4a.5.5 0 00-.146-.336l-4.018-4.018A.5.5 0 0015 2.5zM3 3a2 2 0 012-2h9.982a2 2 0 011.414.586l4.018 4.018A2 2 0 0121 7.018V21a2 2 0 01-2 2H5a2 2 0 01-2-2V3z\"></path>"
		}
	}
};
var filter$1 = {
	name: "filter",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M.75 3a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M2.75 6a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75zM6 11.75a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zm4 4.938a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z\"></path>"
		}
	}
};
var flame = {
	name: "flame",
	keywords: [
		"fire",
		"hot",
		"burn",
		"trending"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.788 2.788 0 01-1.436-.874A3.21 3.21 0 003 10c0 2.53 2.164 4.5 4.998 4.5zM9.533.753C9.496.34 9.16.009 8.77.146 7.035.75 4.34 3.187 5.997 6.5c.344.689.285 1.218.003 1.5-.419.419-1.54.487-2.04-.832-.173-.454-.659-.762-1.035-.454C2.036 7.44 1.5 8.702 1.5 10c0 3.512 2.998 6 6.498 6s6.5-2.5 6.5-6c0-2.137-1.128-3.26-2.312-4.438-1.19-1.184-2.436-2.425-2.653-4.81z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.185 21.5c4.059 0 7.065-2.84 7.065-6.75 0-2.337-1.093-3.489-2.678-5.158l-.021-.023c-1.44-1.517-3.139-3.351-3.649-6.557a6.14 6.14 0 00-1.911 1.76c-.787 1.144-1.147 2.633-.216 4.495.603 1.205.777 2.74-.277 3.794-.657.657-1.762 1.1-2.956.586-.752-.324-1.353-.955-1.838-1.79-.567.706-.954 1.74-.954 2.893 0 3.847 3.288 6.75 7.435 6.75zm2.08-19.873c-.017-.345-.296-.625-.632-.543-2.337.575-6.605 4.042-4.2 8.854.474.946.392 1.675.004 2.062-.64.64-1.874.684-2.875-1.815-.131-.327-.498-.509-.803-.334-1.547.888-2.509 2.86-2.509 4.899 0 4.829 4.122 8.25 8.935 8.25 4.812 0 8.565-3.438 8.565-8.25 0-2.939-1.466-4.482-3.006-6.102-1.61-1.694-3.479-3.476-3.479-7.021z\"></path>"
		}
	}
};
var fold = {
	name: "fold",
	keywords: [
		"unfold",
		"hide",
		"collapse"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M10.896 2H8.75V.75a.75.75 0 00-1.5 0V2H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0l2.896-2.896A.25.25 0 0010.896 2zM8.75 15.25a.75.75 0 01-1.5 0V14H5.104a.25.25 0 01-.177-.427l2.896-2.896a.25.25 0 01.354 0l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25zm-6.5-6.5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 15a.75.75 0 01.53.22l3.25 3.25a.75.75 0 11-1.06 1.06L12 16.81l-2.72 2.72a.75.75 0 01-1.06-1.06l3.25-3.25A.75.75 0 0112 15z\"></path><path fill-rule=\"evenodd\" d=\"M12 15.75a.75.75 0 01.75.75v5.75a.75.75 0 01-1.5 0V16.5a.75.75 0 01.75-.75zm.53-6.97a.75.75 0 01-1.06 0L8.22 5.53a.75.75 0 011.06-1.06L12 7.19l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25z\"></path><path fill-rule=\"evenodd\" d=\"M12 8.5a.75.75 0 01-.75-.75v-6a.75.75 0 011.5 0v6a.75.75 0 01-.75.75zM10.75 12a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75z\"></path>"
		}
	}
};
var gear = {
	name: "gear",
	keywords: [
		"settings"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M16 12a4 4 0 11-8 0 4 4 0 018 0zm-1.5 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z\"></path><path fill-rule=\"evenodd\" d=\"M12 1c-.268 0-.534.01-.797.028-.763.055-1.345.617-1.512 1.304l-.352 1.45c-.02.078-.09.172-.225.22a8.45 8.45 0 00-.728.303c-.13.06-.246.044-.315.002l-1.274-.776c-.604-.368-1.412-.354-1.99.147-.403.348-.78.726-1.129 1.128-.5.579-.515 1.387-.147 1.99l.776 1.275c.042.069.059.185-.002.315-.112.237-.213.48-.302.728-.05.135-.143.206-.221.225l-1.45.352c-.687.167-1.249.749-1.304 1.512a11.149 11.149 0 000 1.594c.055.763.617 1.345 1.304 1.512l1.45.352c.078.02.172.09.22.225.09.248.191.491.303.729.06.129.044.245.002.314l-.776 1.274c-.368.604-.354 1.412.147 1.99.348.403.726.78 1.128 1.129.579.5 1.387.515 1.99.147l1.275-.776c.069-.042.185-.059.315.002.237.112.48.213.728.302.135.05.206.143.225.221l.352 1.45c.167.687.749 1.249 1.512 1.303a11.125 11.125 0 001.594 0c.763-.054 1.345-.616 1.512-1.303l.352-1.45c.02-.078.09-.172.225-.22.248-.09.491-.191.729-.303.129-.06.245-.044.314-.002l1.274.776c.604.368 1.412.354 1.99-.147.403-.348.78-.726 1.129-1.128.5-.579.515-1.387.147-1.99l-.776-1.275c-.042-.069-.059-.185.002-.315.112-.237.213-.48.302-.728.05-.135.143-.206.221-.225l1.45-.352c.687-.167 1.249-.749 1.303-1.512a11.125 11.125 0 000-1.594c-.054-.763-.616-1.345-1.303-1.512l-1.45-.352c-.078-.02-.172-.09-.22-.225a8.469 8.469 0 00-.303-.728c-.06-.13-.044-.246-.002-.315l.776-1.274c.368-.604.354-1.412-.147-1.99-.348-.403-.726-.78-1.128-1.129-.579-.5-1.387-.515-1.99-.147l-1.275.776c-.069.042-.185.059-.315-.002a8.465 8.465 0 00-.728-.302c-.135-.05-.206-.143-.225-.221l-.352-1.45c-.167-.687-.749-1.249-1.512-1.304A11.149 11.149 0 0012 1zm-.69 1.525a9.648 9.648 0 011.38 0c.055.004.135.05.162.16l.351 1.45c.153.628.626 1.08 1.173 1.278.205.074.405.157.6.249a1.832 1.832 0 001.733-.074l1.275-.776c.097-.06.186-.036.228 0 .348.302.674.628.976.976.036.042.06.13 0 .228l-.776 1.274a1.832 1.832 0 00-.074 1.734c.092.195.175.395.248.6.198.547.652 1.02 1.278 1.172l1.45.353c.111.026.157.106.161.161a9.653 9.653 0 010 1.38c-.004.055-.05.135-.16.162l-1.45.351a1.833 1.833 0 00-1.278 1.173 6.926 6.926 0 01-.25.6 1.832 1.832 0 00.075 1.733l.776 1.275c.06.097.036.186 0 .228a9.555 9.555 0 01-.976.976c-.042.036-.13.06-.228 0l-1.275-.776a1.832 1.832 0 00-1.733-.074 6.926 6.926 0 01-.6.248 1.833 1.833 0 00-1.172 1.278l-.353 1.45c-.026.111-.106.157-.161.161a9.653 9.653 0 01-1.38 0c-.055-.004-.135-.05-.162-.16l-.351-1.45a1.833 1.833 0 00-1.173-1.278 6.928 6.928 0 01-.6-.25 1.832 1.832 0 00-1.734.075l-1.274.776c-.097.06-.186.036-.228 0a9.56 9.56 0 01-.976-.976c-.036-.042-.06-.13 0-.228l.776-1.275a1.832 1.832 0 00.074-1.733 6.948 6.948 0 01-.249-.6 1.833 1.833 0 00-1.277-1.172l-1.45-.353c-.111-.026-.157-.106-.161-.161a9.648 9.648 0 010-1.38c.004-.055.05-.135.16-.162l1.45-.351a1.833 1.833 0 001.278-1.173 6.95 6.95 0 01.249-.6 1.832 1.832 0 00-.074-1.734l-.776-1.274c-.06-.097-.036-.186 0-.228.302-.348.628-.674.976-.976.042-.036.13-.06.228 0l1.274.776a1.832 1.832 0 001.734.074 6.95 6.95 0 01.6-.249 1.833 1.833 0 001.172-1.277l.353-1.45c.026-.111.106-.157.161-.161z\"></path>"
		}
	}
};
var gift = {
	name: "gift",
	keywords: [
		"package",
		"present",
		"skill",
		"craft",
		"freebie"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 1.5a1.25 1.25 0 100 2.5h2.309c-.233-.818-.542-1.401-.878-1.793-.43-.502-.915-.707-1.431-.707zM2 2.75c0 .45.108.875.3 1.25h-.55A1.75 1.75 0 000 5.75v2c0 .698.409 1.3 1 1.582v4.918c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 14.25V9.332c.591-.281 1-.884 1-1.582v-2A1.75 1.75 0 0014.25 4h-.55a2.75 2.75 0 00-2.45-4c-.984 0-1.874.42-2.57 1.23A5.086 5.086 0 008 2.274a5.086 5.086 0 00-.68-1.042C6.623.42 5.733 0 4.75 0A2.75 2.75 0 002 2.75zM8.941 4h2.309a1.25 1.25 0 100-2.5c-.516 0-1 .205-1.43.707-.337.392-.646.975-.879 1.793zm-1.84 1.5H1.75a.25.25 0 00-.25.25v2c0 .138.112.25.25.25h5.5V5.5h-.149zm1.649 0V8h5.5a.25.25 0 00.25-.25v-2a.25.25 0 00-.25-.25h-5.5zm0 4h4.75v4.75a.25.25 0 01-.25.25h-4.5v-5zm-1.5 0v5h-4.5a.25.25 0 01-.25-.25V9.5h4.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3.75 3.75c0 .844.279 1.623.75 2.25H2.75A1.75 1.75 0 001 7.75v2.5c0 .698.409 1.3 1 1.582v8.418c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0022 20.25v-8.418c.591-.281 1-.884 1-1.582v-2.5A1.75 1.75 0 0021.25 6H19.5a3.75 3.75 0 00-3-6c-1.456 0-3.436.901-4.5 3.11C10.936.901 8.955 0 7.5 0a3.75 3.75 0 00-3.75 3.75zM11.22 6c-.287-3.493-2.57-4.5-3.72-4.5a2.25 2.25 0 000 4.5h3.72zm9.28 6v8.25a.25.25 0 01-.25.25h-7.5V12h7.75zm-9.25 8.5V12H3.5v8.25c0 .138.112.25.25.25h7.5zm10-10a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25h-8.5v3h8.5zm-18.5 0h8.5v-3h-8.5a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25zm16-6.75A2.25 2.25 0 0116.5 6h-3.72c.287-3.493 2.57-4.5 3.72-4.5a2.25 2.25 0 012.25 2.25z\"></path>"
		}
	}
};
var globe = {
	name: "globe",
	keywords: [
		"world",
		"earth",
		"planet"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.543 7.25h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.506 6.506 0 00-4.666 5.5zm2.733 1.5H1.543a6.506 6.506 0 004.666 5.5 11.13 11.13 0 01-.352-.552c-.715-1.192-1.437-2.874-1.581-4.948zm1.504 0h4.44a9.637 9.637 0 01-1.363 4.177c-.306.51-.612.919-.857 1.215a9.978 9.978 0 01-.857-1.215A9.637 9.637 0 015.78 8.75zm4.44-1.5H5.78a9.637 9.637 0 011.363-4.177c.306-.51.612-.919.857-1.215.245.296.55.705.857 1.215A9.638 9.638 0 0110.22 7.25zm1.504 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.506 6.506 0 004.666-5.5h-2.733zm2.733-1.5h-2.733c-.144-2.074-.866-3.756-1.58-4.948a11.738 11.738 0 00-.353-.552 6.506 6.506 0 014.666 5.5zM8 0a8 8 0 100 16A8 8 0 008 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.513 11.5h4.745c.1-3.037 1.1-5.49 2.093-7.204.39-.672.78-1.233 1.119-1.673C6.11 3.329 2.746 7 2.513 11.5zm4.77 1.5H2.552a9.505 9.505 0 007.918 8.377 15.698 15.698 0 01-1.119-1.673C8.413 18.085 7.47 15.807 7.283 13zm1.504 0h6.426c-.183 2.48-1.02 4.5-1.862 5.951-.476.82-.95 1.455-1.304 1.88L12 20.89l-.047-.057a13.888 13.888 0 01-1.304-1.88C9.807 17.5 8.969 15.478 8.787 13zm6.454-1.5H8.759c.1-2.708.992-4.904 1.89-6.451.476-.82.95-1.455 1.304-1.88L12 3.11l.047.057c.353.426.828 1.06 1.304 1.88.898 1.548 1.79 3.744 1.89 6.452zm1.476 1.5c-.186 2.807-1.13 5.085-2.068 6.704-.39.672-.78 1.233-1.118 1.673A9.505 9.505 0 0021.447 13h-4.731zm4.77-1.5h-4.745c-.1-3.037-1.1-5.49-2.093-7.204-.39-.672-.78-1.233-1.119-1.673 4.36.706 7.724 4.377 7.957 8.877z\"></path>"
		}
	}
};
var grabber = {
	name: "grabber",
	keywords: [
		"mover",
		"drap",
		"drop",
		"sort"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M10 13a1 1 0 100-2 1 1 0 000 2zm-4 0a1 1 0 100-2 1 1 0 000 2zm1-5a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm1-5a1 1 0 11-2 0 1 1 0 012 0zM6 5a1 1 0 100-2 1 1 0 000 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M15 18a1 1 0 100-2 1 1 0 000 2zm1-6a1 1 0 11-2 0 1 1 0 012 0zm-7 6a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm7-6a1 1 0 11-2 0 1 1 0 012 0zM9 8a1 1 0 100-2 1 1 0 000 2z\"></path>"
		}
	}
};
var graph = {
	name: "graph",
	keywords: [
		"trend",
		"stats",
		"statistics"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M2.5 2.75a.75.75 0 00-1.5 0v18.5c0 .414.336.75.75.75H20a.75.75 0 000-1.5H2.5V2.75z\"></path><path d=\"M22.28 7.78a.75.75 0 00-1.06-1.06l-5.72 5.72-3.72-3.72a.75.75 0 00-1.06 0l-6 6a.75.75 0 101.06 1.06l5.47-5.47 3.72 3.72a.75.75 0 001.06 0l6.25-6.25z\"></path>"
		}
	}
};
var heading = {
	name: "heading",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.75 2a.75.75 0 01.75.75V7h7V2.75a.75.75 0 011.5 0v10.5a.75.75 0 01-1.5 0V8.5h-7v4.75a.75.75 0 01-1.5 0V2.75A.75.75 0 013.75 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6.25 4a.75.75 0 01.75.75V11h10V4.75a.75.75 0 011.5 0v14.5a.75.75 0 01-1.5 0V12.5H7v6.75a.75.75 0 01-1.5 0V4.75A.75.75 0 016.25 4z\"></path>"
		}
	}
};
var heart = {
	name: "heart",
	keywords: [
		"love",
		"beat"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z\"></path>"
		}
	}
};
var history = {
	name: "history",
	keywords: [
		"time",
		"past",
		"revert",
		"back"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M11.998 2.5A9.503 9.503 0 003.378 8H5.75a.75.75 0 010 1.5H2a1 1 0 01-1-1V4.75a.75.75 0 011.5 0v1.697A10.997 10.997 0 0111.998 1C18.074 1 23 5.925 23 12s-4.926 11-11.002 11C6.014 23 1.146 18.223 1 12.275a.75.75 0 011.5-.037 9.5 9.5 0 009.498 9.262c5.248 0 9.502-4.253 9.502-9.5s-4.254-9.5-9.502-9.5z\"></path><path d=\"M12.5 7.25a.75.75 0 00-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 00.744-1.302L12.5 12.315V7.25z\"></path>"
		}
	}
};
var home = {
	name: "home",
	keywords: [
		"welcome",
		"index",
		"house",
		"building"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.156 1.835a.25.25 0 00-.312 0l-5.25 4.2a.25.25 0 00-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v5.25h2.75a.25.25 0 00.25-.25V6.23a.25.25 0 00-.094-.195l-5.25-4.2zM6.906.664a1.75 1.75 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2h-.001z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M11.03 2.59a1.5 1.5 0 011.94 0l7.5 6.363a1.5 1.5 0 01.53 1.144V19.5a1.5 1.5 0 01-1.5 1.5h-5.75a.75.75 0 01-.75-.75V14h-2v6.25a.75.75 0 01-.75.75H4.5A1.5 1.5 0 013 19.5v-9.403c0-.44.194-.859.53-1.144l7.5-6.363zM12 3.734l-7.5 6.363V19.5h5v-6.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v6.25h5v-9.403L12 3.734z\"></path>"
		}
	}
};
var hourglass = {
	name: "hourglass",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 1a.75.75 0 000 1.5h.75v1.25a4.75 4.75 0 001.9 3.8l.333.25c.134.1.134.3 0 .4l-.333.25a4.75 4.75 0 00-1.9 3.8v1.25h-.75a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5h-.75v-1.25a4.75 4.75 0 00-1.9-3.8l-.333-.25a.25.25 0 010-.4l.333-.25a4.75 4.75 0 001.9-3.8V2.5h.75a.75.75 0 000-1.5H2.75zM11 2.5H5v1.25a3.25 3.25 0 001.3 2.6l.333.25c.934.7.934 2.1 0 2.8l-.333.25a3.25 3.25 0 00-1.3 2.6v1.25h6v-1.25a3.25 3.25 0 00-1.3-2.6l-.333-.25a1.75 1.75 0 010-2.8l.333-.25a3.25 3.25 0 001.3-2.6V2.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 2a.75.75 0 000 1.5h.75v2.982a4.75 4.75 0 002.215 4.017l2.044 1.29a.25.25 0 010 .422l-2.044 1.29A4.75 4.75 0 005.5 17.518V20.5h-.75a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5h-.75v-2.982a4.75 4.75 0 00-2.215-4.017l-2.044-1.29a.25.25 0 010-.422l2.044-1.29A4.75 4.75 0 0018.5 6.482V3.5h.75a.75.75 0 000-1.5H4.75zM17 3.5H7v2.982A3.25 3.25 0 008.516 9.23l2.044 1.29a1.75 1.75 0 010 2.96l-2.044 1.29A3.25 3.25 0 007 17.518V20.5h10v-2.982a3.25 3.25 0 00-1.516-2.748l-2.044-1.29a1.75 1.75 0 010-2.96l2.044-1.29A3.25 3.25 0 0017 6.482V3.5z\"></path>"
		}
	}
};
var hubot = {
	name: "hubot",
	keywords: [
		"robot",
		"bot"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 8a8 8 0 1116 0v5.25a.75.75 0 01-1.5 0V8a6.5 6.5 0 10-13 0v5.25a.75.75 0 01-1.5 0V8zm5.5 4.25a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zM3 6.75C3 5.784 3.784 5 4.75 5h6.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0111.25 10h-6.5A1.75 1.75 0 013 8.25v-1.5zm1.47-.53a.75.75 0 011.06 0l.97.97.97-.97a.75.75 0 011.06 0l.97.97.97-.97a.75.75 0 111.06 1.06l-1.5 1.5a.75.75 0 01-1.06 0L8 7.81l-.97.97a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 010-1.06z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M0 13C0 6.373 5.373 1 12 1s12 5.373 12 12v8.657a.75.75 0 01-1.5 0V13c0-5.799-4.701-10.5-10.5-10.5S1.5 7.201 1.5 13v8.657a.75.75 0 01-1.5 0V13z\"></path><path d=\"M8 19.75a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5a.75.75 0 01-.75-.75z\"></path><path fill-rule=\"evenodd\" d=\"M5.25 9.5a1.75 1.75 0 00-1.75 1.75v3.5c0 .966.784 1.75 1.75 1.75h13.5a1.75 1.75 0 001.75-1.75v-3.5a1.75 1.75 0 00-1.75-1.75H5.25zm.22 1.47a.75.75 0 011.06 0L9 13.44l2.47-2.47a.75.75 0 011.06 0L15 13.44l2.47-2.47a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0L12 12.56l-2.47 2.47a.75.75 0 01-1.06 0l-3-3a.75.75 0 010-1.06z\"></path>"
		}
	}
};
var image = {
	name: "image",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M19.25 4.5H4.75a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h.19l9.823-9.823a1.75 1.75 0 012.475 0l2.262 2.262V4.75a.25.25 0 00-.25-.25zm.25 9.56l-3.323-3.323a.25.25 0 00-.354 0L7.061 19.5H19.25a.25.25 0 00.25-.25v-5.19zM4.75 3A1.75 1.75 0 003 4.75v14.5c0 .966.784 1.75 1.75 1.75h14.5A1.75 1.75 0 0021 19.25V4.75A1.75 1.75 0 0019.25 3H4.75zM8.5 9.5a1 1 0 100-2 1 1 0 000 2zm0 1.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z\"></path>"
		}
	}
};
var inbox = {
	name: "inbox",
	keywords: [
		"mail",
		"todo",
		"new",
		"messages"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.8 2.06A1.75 1.75 0 014.41 1h7.18c.7 0 1.333.417 1.61 1.06l2.74 6.395a.75.75 0 01.06.295v4.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25v-4.5a.75.75 0 01.06-.295L2.8 2.06zm1.61.44a.25.25 0 00-.23.152L1.887 8H4.75a.75.75 0 01.6.3L6.625 10h2.75l1.275-1.7a.75.75 0 01.6-.3h2.863L11.82 2.652a.25.25 0 00-.23-.152H4.41zm10.09 7h-2.875l-1.275 1.7a.75.75 0 01-.6.3h-3.5a.75.75 0 01-.6-.3L4.375 9.5H1.5v3.75c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V9.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4.801 3.57A1.75 1.75 0 016.414 2.5h11.174c.702 0 1.337.42 1.611 1.067l3.741 8.828c.04.092.06.192.06.293v7.562A1.75 1.75 0 0121.25 22H2.75A1.75 1.75 0 011 20.25v-7.5c0-.1.02-.199.059-.291L4.8 3.571zM6.414 4a.25.25 0 00-.23.153L2.88 12H8a.75.75 0 01.648.372L10.18 15h3.638l1.533-2.628a.75.75 0 01.64-.372l5.13-.051-3.304-7.797a.25.25 0 00-.23-.152H6.414zM21.5 13.445l-5.067.05-1.535 2.633a.75.75 0 01-.648.372h-4.5a.75.75 0 01-.648-.372L7.57 13.5H2.5v6.75c0 .138.112.25.25.25h18.5a.25.25 0 00.25-.25v-6.805z\"></path>"
		}
	}
};
var infinity = {
	name: "infinity",
	keywords: [
		"unlimited",
		"infinite"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.5 6c-1.086 0-2 .914-2 2 0 1.086.914 2 2 2 .525 0 1.122-.244 1.825-.727.51-.35 1.025-.79 1.561-1.273-.536-.483-1.052-.922-1.56-1.273C4.621 6.244 4.025 6 3.5 6zm4.5.984c-.59-.533-1.204-1.066-1.825-1.493-.797-.548-1.7-.991-2.675-.991C1.586 4.5 0 6.086 0 8s1.586 3.5 3.5 3.5c.975 0 1.878-.444 2.675-.991.621-.427 1.235-.96 1.825-1.493.59.533 1.204 1.066 1.825 1.493.797.547 1.7.991 2.675.991 1.914 0 3.5-1.586 3.5-3.5s-1.586-3.5-3.5-3.5c-.975 0-1.878.443-2.675.991-.621.427-1.235.96-1.825 1.493zM9.114 8c.536.483 1.052.922 1.56 1.273.704.483 1.3.727 1.826.727 1.086 0 2-.914 2-2 0-1.086-.914-2-2-2-.525 0-1.122.244-1.825.727-.51.35-1.025.79-1.561 1.273z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.25 8.5c-2.032 0-3.75 1.895-3.75 3.75S3.218 16 5.25 16c1.017 0 2.014-.457 3.062-1.253.89-.678 1.758-1.554 2.655-2.497-.897-.943-1.765-1.82-2.655-2.497C7.264 8.957 6.267 8.5 5.25 8.5zM12 11.16c-.887-.933-1.813-1.865-2.78-2.6C8.048 7.667 6.733 7 5.25 7 2.343 7 0 9.615 0 12.25s2.343 5.25 5.25 5.25c1.483 0 2.798-.668 3.97-1.56.967-.735 1.893-1.667 2.78-2.6.887.933 1.813 1.865 2.78 2.6 1.172.892 2.487 1.56 3.97 1.56 2.907 0 5.25-2.615 5.25-5.25S21.657 7 18.75 7c-1.483 0-2.798.668-3.97 1.56-.967.735-1.893 1.667-2.78 2.6zm1.033 1.09c.897.943 1.765 1.82 2.655 2.497C16.736 15.543 17.733 16 18.75 16c2.032 0 3.75-1.895 3.75-3.75S20.782 8.5 18.75 8.5c-1.017 0-2.014.457-3.062 1.253-.89.678-1.758 1.554-2.655 2.497z\"></path>"
		}
	}
};
var info = {
	name: "info",
	keywords: [
		"help"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M13 7.5a1 1 0 11-2 0 1 1 0 012 0zm-3 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.25h.75a.75.75 0 010 1.5h-3a.75.75 0 010-1.5h.75V12h-.75a.75.75 0 01-.75-.75z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
};
var insights = {
	name: "insights",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M11.75 3.5a.75.75 0 01.75.75v15.5a.75.75 0 01-1.5 0V4.25a.75.75 0 01.75-.75zm6.5 3.625a.75.75 0 01.75.75V19.75a.75.75 0 01-1.5 0V7.875a.75.75 0 01.75-.75zM5.25 11a.75.75 0 01.75.75v8a.75.75 0 01-1.5 0v-8a.75.75 0 01.75-.75z\"></path>"
		}
	}
};
var italic = {
	name: "italic",
	keywords: [
		"font",
		"italic",
		"style"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6 2.75A.75.75 0 016.75 2h6.5a.75.75 0 010 1.5h-2.505l-3.858 9H9.25a.75.75 0 010 1.5h-6.5a.75.75 0 010-1.5h2.505l3.858-9H6.75A.75.75 0 016 2.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M10 4.75a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-3.514l-5.828 13h3.342a.75.75 0 010 1.5h-8.5a.75.75 0 010-1.5h3.514l5.828-13H10.75a.75.75 0 01-.75-.75z\"></path>"
		}
	}
};
var key = {
	name: "key",
	keywords: [
		"key",
		"lock",
		"secure",
		"safe"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.5 5.5a4 4 0 112.731 3.795.75.75 0 00-.768.18L7.44 10.5H6.25a.75.75 0 00-.75.75v1.19l-.06.06H4.25a.75.75 0 00-.75.75v1.19l-.06.06H1.75a.25.25 0 01-.25-.25v-1.69l5.024-5.023a.75.75 0 00.181-.768A3.995 3.995 0 016.5 5.5zm4-5.5a5.5 5.5 0 00-5.348 6.788L.22 11.72a.75.75 0 00-.22.53v2C0 15.216.784 16 1.75 16h2a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V14h.75a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V12h.75a.75.75 0 00.53-.22l.932-.932A5.5 5.5 0 1010.5 0zm.5 6a1 1 0 100-2 1 1 0 000 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M16.75 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z\"></path><path fill-rule=\"evenodd\" d=\"M15.75 0a8.25 8.25 0 00-7.851 10.79L.513 18.178A1.75 1.75 0 000 19.414v2.836C0 23.217.784 24 1.75 24h1.5A1.75 1.75 0 005 22.25v-1a.25.25 0 01.25-.25h2.735a.75.75 0 00.545-.22l.214-.213A.875.875 0 009 19.948V18.5a.25.25 0 01.25-.25h1.086c.464 0 .91-.184 1.237-.513l1.636-1.636A8.25 8.25 0 1015.75 0zM9 8.25a6.75 6.75 0 114.288 6.287.75.75 0 00-.804.168l-1.971 1.972a.25.25 0 01-.177.073H9.25A1.75 1.75 0 007.5 18.5v1H5.25a1.75 1.75 0 00-1.75 1.75v1a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-2.836a.25.25 0 01.073-.177l7.722-7.721a.75.75 0 00.168-.804A6.73 6.73 0 019 8.25z\"></path>"
		}
	}
};
var law = {
	name: "law",
	keywords: [
		"legal",
		"bill"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.75 2.75a.75.75 0 00-1.5 0V4.5H9.276a1.75 1.75 0 00-.985.303L6.596 5.957A.25.25 0 016.455 6H2.353a.75.75 0 100 1.5H3.93L.563 15.18a.762.762 0 00.21.88c.08.064.161.125.309.221.186.121.452.278.792.433.68.311 1.662.62 2.876.62a6.919 6.919 0 002.876-.62c.34-.155.606-.312.792-.433.15-.097.23-.158.31-.223a.75.75 0 00.209-.878L5.569 7.5h.886c.351 0 .694-.106.984-.303l1.696-1.154A.25.25 0 019.275 6h1.975v14.5H6.763a.75.75 0 000 1.5h10.474a.75.75 0 000-1.5H12.75V6h1.974c.05 0 .1.015.14.043l1.697 1.154c.29.197.633.303.984.303h.886l-3.368 7.68a.75.75 0 00.23.896c.012.009 0 0 .002 0a3.154 3.154 0 00.31.206c.185.112.45.256.79.4a7.343 7.343 0 002.855.568 7.343 7.343 0 002.856-.569c.338-.143.604-.287.79-.399a3.5 3.5 0 00.31-.206.75.75 0 00.23-.896L20.07 7.5h1.578a.75.75 0 000-1.5h-4.102a.25.25 0 01-.14-.043l-1.697-1.154a1.75 1.75 0 00-.984-.303H12.75V2.75zM2.193 15.198a5.418 5.418 0 002.557.635 5.418 5.418 0 002.557-.635L4.75 9.368l-2.557 5.83zm14.51-.024c.082.04.174.083.275.126.53.223 1.305.45 2.272.45a5.846 5.846 0 002.547-.576L19.25 9.367l-2.547 5.807z\"></path>"
		}
	}
};
var link = {
	name: "link",
	keywords: [
		"connect",
		"hyperlink"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M14.78 3.653a3.936 3.936 0 115.567 5.567l-3.627 3.627a3.936 3.936 0 01-5.88-.353.75.75 0 00-1.18.928 5.436 5.436 0 008.12.486l3.628-3.628a5.436 5.436 0 10-7.688-7.688l-3 3a.75.75 0 001.06 1.061l3-3z\"></path><path d=\"M7.28 11.153a3.936 3.936 0 015.88.353.75.75 0 001.18-.928 5.436 5.436 0 00-8.12-.486L2.592 13.72a5.436 5.436 0 107.688 7.688l3-3a.75.75 0 10-1.06-1.06l-3 3a3.936 3.936 0 01-5.567-5.568l3.627-3.627z\"></path>"
		}
	}
};
var location = {
	name: "location",
	keywords: [
		"here",
		"marker"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z\"></path><path fill-rule=\"evenodd\" d=\"M19.071 3.429C15.166-.476 8.834-.476 4.93 3.429c-3.905 3.905-3.905 10.237 0 14.142l.028.028 5.375 5.375a2.359 2.359 0 003.336 0l5.403-5.403c3.905-3.905 3.905-10.237 0-14.142zM5.99 4.489A8.5 8.5 0 0118.01 16.51l-5.403 5.404a.859.859 0 01-1.214 0l-5.378-5.378-.002-.002-.023-.024a8.5 8.5 0 010-12.02z\"></path>"
		}
	}
};
var lock = {
	name: "lock",
	keywords: [
		"secure",
		"safe",
		"protected"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6 9V7.25C6 3.845 8.503 1 12 1s6 2.845 6 6.25V9h.5a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5v-8A2.5 2.5 0 015.5 9H6zm1.5-1.75C7.5 4.58 9.422 2.5 12 2.5c2.578 0 4.5 2.08 4.5 4.75V9h-9V7.25zm-3 4.25a1 1 0 011-1h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1v-8z\"></path>"
		}
	}
};
var mail = {
	name: "mail",
	keywords: [
		"email",
		"unread"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 3A1.75 1.75 0 000 4.75v14c0 .966.784 1.75 1.75 1.75h20.5A1.75 1.75 0 0024 18.75v-14A1.75 1.75 0 0022.25 3H1.75zM1.5 4.75a.25.25 0 01.25-.25h20.5a.25.25 0 01.25.25v.852l-10.36 7a.25.25 0 01-.28 0l-10.36-7V4.75zm0 2.662V18.75c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V7.412l-9.52 6.433c-.592.4-1.368.4-1.96 0L1.5 7.412z\"></path>"
		}
	}
};
var markdown = {
	name: "markdown",
	keywords: [
		"markup",
		"style"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z\"></path>"
		}
	}
};
var megaphone = {
	name: "megaphone",
	keywords: [
		"bullhorn",
		"loud",
		"shout",
		"broadcast"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M15.571.572A.75.75 0 0116 1.25L14.777.668c.001 0 0 0 0 0l-.015.012-.076.056a5.508 5.508 0 01-.345.224 9.982 9.982 0 01-1.463.719c-1.322.528-3.351 1.07-6.124 1.071a1.6 1.6 0 00-.861-.25H4a4 4 0 00-1.499 7.71.758.758 0 00-.001.04c0 2.32.486 3.93.813 4.75.262.66.897 1 1.517 1h1.197c.685 0 1.228-.389 1.546-.857.317-.466.468-1.09.31-1.696-.2-.767-.382-1.835-.383-3.183 2.394.086 4.177.577 5.378 1.057a9.965 9.965 0 011.463.719 5.7 5.7 0 01.421.28l.014.012h.002A.75.75 0 0016 11.75V1.25L14.777.668a.75.75 0 01.794-.096zM4.002 10.5c.033 1.969.45 3.306.704 3.946.004.01.01.02.027.03a.185.185 0 00.097.024h1.197c.083 0 .202-.047.305-.2a.608.608 0 00.1-.475 14.036 14.036 0 01-.43-3.329 1.64 1.64 0 01-.11.004h-1.89zM7.5 8.763c2.601.087 4.573.62 5.935 1.166.41.164.766.33 1.065.483V2.588c-.3.154-.654.319-1.065.483C12.073 3.616 10.1 4.15 7.5 4.237v4.526zM14.777.668zM1.5 6.5A2.5 2.5 0 014 4h1.893c.059 0 .107.048.107.107v4.786A.107.107 0 015.893 9H4a2.5 2.5 0 01-2.5-2.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M22 1.75a.75.75 0 00-1.161-.627c-.047.03-.094.057-.142.085a9.15 9.15 0 01-.49.262c-.441.22-1.11.519-2.002.82-1.78.6-4.45 1.21-7.955 1.21H6.5A5.5 5.5 0 005 14.293v.457c0 3.061.684 5.505 1.061 6.621.24.709.904 1.129 1.6 1.129h2.013c1.294 0 2.1-1.322 1.732-2.453-.412-1.268-.906-3.268-.906-5.547 0-.03-.002-.06-.005-.088 3.382.028 5.965.644 7.703 1.251.89.312 1.559.62 2 .849.084.043.171.096.261.15.357.214.757.455 1.142.25A.75.75 0 0022 16.25V1.75zM10.5 12.912c3.564.029 6.313.678 8.193 1.335.737.258 1.34.517 1.807.74V2.993c-.467.216-1.073.467-1.815.718-1.878.634-4.624 1.26-8.185 1.288v7.913zm-4 1.838v-.25H9c0 2.486.537 4.648.98 6.01a.398.398 0 01-.057.343c-.07.104-.162.147-.249.147H7.661c-.105 0-.161-.058-.179-.109-.344-1.018-.982-3.294-.982-6.141zM6.5 5H9v8H6.5a4 4 0 010-8z\"></path>"
		}
	}
};
var mention = {
	name: "mention",
	keywords: [
		"at",
		"ping"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 2.37a6.5 6.5 0 006.5 11.26.75.75 0 01.75 1.298 8 8 0 113.994-7.273.754.754 0 01.006.095v1.5a2.75 2.75 0 01-5.072 1.475A4 4 0 1112 8v1.25a1.25 1.25 0 002.5 0V7.867a6.5 6.5 0 00-9.75-5.496V2.37zM10.5 8a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M20.226 7.25a9.498 9.498 0 10-3.477 12.976.75.75 0 01.75 1.299c-5.26 3.037-11.987 1.235-15.024-4.026C-.562 12.24 1.24 5.512 6.501 2.475 11.76-.562 18.488 1.24 21.525 6.501a10.956 10.956 0 011.455 4.826c.013.056.02.113.02.173v2.25a3.5 3.5 0 01-6.623 1.581 5.5 5.5 0 111.112-3.682.76.76 0 01.011.129v1.972a2 2 0 104 0v-1.766a9.452 9.452 0 00-1.274-4.733zM16 12a4 4 0 10-8 0 4 4 0 008 0z\"></path>"
		}
	}
};
var meter = {
	name: "meter",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 1.5a6.5 6.5 0 106.016 4.035.75.75 0 011.388-.57 8 8 0 11-4.37-4.37.75.75 0 01-.569 1.389A6.479 6.479 0 008 1.5zm6.28.22a.75.75 0 010 1.06l-4.063 4.064a2.5 2.5 0 11-1.06-1.06L13.22 1.72a.75.75 0 011.06 0zM7 8a1 1 0 112 0 1 1 0 01-2 0z\"></path>"
		}
	}
};
var milestone = {
	name: "milestone",
	keywords: [
		"marker"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.75 0a.75.75 0 01.75.75V3h3.634c.414 0 .814.147 1.13.414l2.07 1.75a1.75 1.75 0 010 2.672l-2.07 1.75a1.75 1.75 0 01-1.13.414H8.5v5.25a.75.75 0 11-1.5 0V10H2.75A1.75 1.75 0 011 8.25v-3.5C1 3.784 1.784 3 2.75 3H7V.75A.75.75 0 017.75 0zm0 8.5h4.384a.25.25 0 00.161-.06l2.07-1.75a.25.25 0 000-.38l-2.07-1.75a.25.25 0 00-.161-.06H2.75a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M11.75 1a.75.75 0 01.75.75V4h6.532c.42 0 .826.15 1.143.425l3.187 2.75a1.75 1.75 0 010 2.65l-3.187 2.75a1.75 1.75 0 01-1.143.425H12.5v9.25a.75.75 0 01-1.5 0V13H3.75A1.75 1.75 0 012 11.25v-5.5C2 4.783 2.784 4 3.75 4H11V1.75a.75.75 0 01.75-.75zm0 4.5h7.282a.25.25 0 01.163.06l3.188 2.75a.25.25 0 010 .38l-3.188 2.75a.25.25 0 01-.163.06H3.75a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25h8z\"></path>"
		}
	}
};
var mirror = {
	name: "mirror",
	keywords: [
		"reflect"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.75 1.75a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5zM8 4a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 018 4zm.75 3.75a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5zM8 10a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 018 10zm0 3a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 018 13zm7.547-9.939A.75.75 0 0116 3.75v8.5a.75.75 0 01-1.265.545l-4.5-4.25a.75.75 0 010-1.09l4.5-4.25a.75.75 0 01.812-.144zM11.842 8l2.658 2.51V5.49L11.842 8zM0 12.25a.75.75 0 001.265.545l4.5-4.25a.75.75 0 000-1.09l-4.5-4.25A.75.75 0 000 3.75v8.5zm1.5-6.76L4.158 8 1.5 10.51V5.49z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 10.75a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zm0 4a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zm0 4a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zm0-12a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zm0-4a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zm9.553 3.314A.75.75 0 0122 6.75v10.5a.75.75 0 01-1.256.554l-5.75-5.25a.75.75 0 010-1.108l5.75-5.25a.75.75 0 01.809-.132zM16.613 12l3.887 3.55v-7.1L16.612 12zM2.447 17.936A.75.75 0 012 17.25V6.75a.75.75 0 011.256-.554l5.75 5.25a.75.75 0 010 1.108l-5.75 5.25a.75.75 0 01-.809.132zM7.387 12L3.5 8.45v7.1L7.388 12z\"></path>"
		}
	}
};
var moon = {
	name: "moon",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M9.598 1.591a.75.75 0 01.785-.175 7 7 0 11-8.967 8.967.75.75 0 01.961-.96 5.5 5.5 0 007.046-7.046.75.75 0 01.175-.786zm1.616 1.945a7 7 0 01-7.678 7.678 5.5 5.5 0 107.678-7.678z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M16.5 6c0 5.799-4.701 10.5-10.5 10.5-.426 0-.847-.026-1.26-.075A8.5 8.5 0 1016.425 4.74c.05.413.075.833.075 1.259zm-1.732-2.04A9.08 9.08 0 0114.999 6a9 9 0 01-11.04 8.768l-.004-.002a9.367 9.367 0 01-.78-.218c-.393-.13-.8.21-.67.602a9.938 9.938 0 00.329.855l.004.01A10.002 10.002 0 0012 22a10.002 10.002 0 004.015-19.16l-.01-.005a9.745 9.745 0 00-.855-.328c-.392-.13-.732.276-.602.67a8.934 8.934 0 01.218.779l.002.005z\"></path>"
		}
	}
};
var mute = {
	name: "mute",
	keywords: [
		"quiet",
		"sound",
		"audio",
		"turn",
		"off"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 2.75a.75.75 0 00-1.238-.57L3.472 5H1.75A1.75 1.75 0 000 6.75v2.5C0 10.216.784 11 1.75 11h1.723l3.289 2.82A.75.75 0 008 13.25V2.75zM4.238 6.32L6.5 4.38v7.24L4.238 9.68a.75.75 0 00-.488-.18h-2a.25.25 0 01-.25-.25v-2.5a.25.25 0 01.25-.25h2a.75.75 0 00.488-.18zm7.042-1.1a.75.75 0 10-1.06 1.06L11.94 8l-1.72 1.72a.75.75 0 101.06 1.06L13 9.06l1.72 1.72a.75.75 0 101.06-1.06L14.06 8l1.72-1.72a.75.75 0 00-1.06-1.06L13 6.94l-1.72-1.72z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 3.75a.75.75 0 00-1.255-.555L5.46 8H2.75A1.75 1.75 0 001 9.75v4.5c0 .966.784 1.75 1.75 1.75h2.71l5.285 4.805A.75.75 0 0012 20.25V3.75zM6.255 9.305l4.245-3.86v13.11l-4.245-3.86a.75.75 0 00-.505-.195h-3a.25.25 0 01-.25-.25v-4.5a.25.25 0 01.25-.25h3a.75.75 0 00.505-.195z\"></path><path d=\"M16.28 8.22a.75.75 0 10-1.06 1.06L17.94 12l-2.72 2.72a.75.75 0 101.06 1.06L19 13.06l2.72 2.72a.75.75 0 101.06-1.06L20.06 12l2.72-2.72a.75.75 0 00-1.06-1.06L19 10.94l-2.72-2.72z\"></path>"
		}
	}
};
var note = {
	name: "note",
	keywords: [
		"card",
		"paper",
		"ticket"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5zm1.75-.25a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H1.75zM3.5 6.25a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75zm1.75-.25a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H1.75z\"></path><path fill-rule=\"evenodd\" d=\"M5 8.75A.75.75 0 015.75 8h11.5a.75.75 0 010 1.5H5.75A.75.75 0 015 8.75zm0 4a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75z\"></path>"
		}
	}
};
var number = {
	name: "number",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1 5.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 5.25zm0 5.5a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75z\"></path><path fill-rule=\"evenodd\" d=\"M6.368 1.01a.75.75 0 01.623.859l-2 12.5a.75.75 0 01-1.482-.237l2-12.5a.75.75 0 01.86-.622zm5.5 0a.75.75 0 01.623.859l-2 12.5a.75.75 0 01-1.482-.237l2-12.5a.75.75 0 01.86-.622z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M2 8.25a.75.75 0 01.75-.75h18.5a.75.75 0 010 1.5H2.75A.75.75 0 012 8.25zm-.005 7.5a.75.75 0 01.75-.75v1.5a.75.75 0 01-.75-.75zm.75 0v.75H21.25a.75.75 0 000-1.5H2.745v.75z\"></path><path fill-rule=\"evenodd\" d=\"M9.62 2.01a.75.75 0 01.62.86l-3 18.5a.75.75 0 01-1.48-.24l3-18.5a.75.75 0 01.86-.62zm8 0a.75.75 0 01.62.86l-3 18.5a.75.75 0 01-1.48-.24l3-18.5a.75.75 0 01.86-.62z\"></path>"
		}
	}
};
var octoface = {
	name: "octoface",
	keywords: [
		"octocat",
		"brand"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.326 1.973a1.2 1.2 0 011.49-.832c.387.112.977.307 1.575.602.586.291 1.243.71 1.7 1.296.022.027.042.056.061.084A13.22 13.22 0 018 3c.67 0 1.289.037 1.861.108l.051-.07c.457-.586 1.114-1.004 1.7-1.295a9.654 9.654 0 011.576-.602 1.2 1.2 0 011.49.832c.14.493.356 1.347.479 2.29.079.604.123 1.28.07 1.936.541.977.773 2.11.773 3.301C16 13 14.5 15 8 15s-8-2-8-5.5c0-1.034.238-2.128.795-3.117-.08-.712-.034-1.46.052-2.12.122-.943.34-1.797.479-2.29zM8 13.065c6 0 6.5-2 6-4.27C13.363 5.905 11.25 5 8 5s-5.363.904-6 3.796c-.5 2.27 0 4.27 6 4.27z\"></path><path d=\"M4 8a1 1 0 012 0v1a1 1 0 01-2 0V8zm2.078 2.492c-.083-.264.146-.492.422-.492h3c.276 0 .505.228.422.492C9.67 11.304 8.834 12 8 12c-.834 0-1.669-.696-1.922-1.508zM10 8a1 1 0 112 0v1a1 1 0 11-2 0V8z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M7.75 11c-.69 0-1.25.56-1.25 1.25v1.5a1.25 1.25 0 102.5 0v-1.5C9 11.56 8.44 11 7.75 11zm1.27 4.5a.469.469 0 01.48-.5h5a.47.47 0 01.48.5c-.116 1.316-.759 2.5-2.98 2.5s-2.864-1.184-2.98-2.5zm7.23-4.5c-.69 0-1.25.56-1.25 1.25v1.5a1.25 1.25 0 102.5 0v-1.5c0-.69-.56-1.25-1.25-1.25z\"></path><path fill-rule=\"evenodd\" d=\"M21.255 3.82a1.725 1.725 0 00-2.141-1.195c-.557.16-1.406.44-2.264.866-.78.386-1.647.93-2.293 1.677A18.442 18.442 0 0012 5c-.93 0-1.784.059-2.569.17-.645-.74-1.505-1.28-2.28-1.664a13.876 13.876 0 00-2.265-.866 1.725 1.725 0 00-2.141 1.196 23.645 23.645 0 00-.69 3.292c-.125.97-.191 2.07-.066 3.112C1.254 11.882 1 13.734 1 15.527 1 19.915 3.13 23 12 23c8.87 0 11-3.053 11-7.473 0-1.794-.255-3.647-.99-5.29.127-1.046.06-2.15-.066-3.125a23.652 23.652 0 00-.689-3.292zM20.5 14c.5 3.5-1.5 6.5-8.5 6.5s-9-3-8.5-6.5c.583-4 3-6 8.5-6s7.928 2 8.5 6z\"></path>"
		}
	}
};
var organization = {
	name: "organization",
	keywords: [
		"people",
		"group",
		"team"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v1.25h2.25a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25h-8.5a.25.25 0 00-.25.25v12.5zM1.75 16A1.75 1.75 0 010 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 00.25-.25V8.285a.25.25 0 00-.111-.208l-1.055-.703a.75.75 0 11.832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0114.25 16h-3.5a.75.75 0 01-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 01-.75-.75V14h-1v1.25a.75.75 0 01-.75.75h-3zM3 3.75A.75.75 0 013.75 3h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 3.75zM3.75 6a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM3 9.75A.75.75 0 013.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 9.75zM7.75 9a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM7 6.75A.75.75 0 017.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 017 6.75zM7.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M7.25 12a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6.5 9.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM7.25 5a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM10 12.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm.75-4.25a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM10 5.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM14.25 12a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zm-.75-2.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM14.25 5a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z\"></path><path fill-rule=\"evenodd\" d=\"M3 20a2 2 0 002 2h3.75a.75.75 0 00.75-.75V19h3v2.25c0 .414.336.75.75.75H17c.092 0 .183-.006.272-.018a.758.758 0 00.166.018H21.5a2 2 0 002-2v-7.625a2 2 0 00-.8-1.6l-1-.75a.75.75 0 10-.9 1.2l1 .75a.5.5 0 01.2.4V20a.5.5 0 01-.5.5h-2.563c.041-.16.063-.327.063-.5V3a2 2 0 00-2-2H5a2 2 0 00-2 2v17zm2 .5a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5h12a.5.5 0 01.5.5v17a.5.5 0 01-.5.5h-3v-2.25a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75v2.25H5z\"></path>"
		}
	}
};
var paintbrush = {
	name: "paintbrush",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M11.134 1.535C9.722 2.562 8.16 4.057 6.889 5.312 5.8 6.387 5.041 7.401 4.575 8.294a3.745 3.745 0 00-3.227 1.054c-.43.431-.69 1.066-.86 1.657a11.982 11.982 0 00-.358 1.914A21.263 21.263 0 000 15.203v.054l.75-.007-.007.75h.054a14.404 14.404 0 00.654-.012 21.243 21.243 0 001.63-.118c.62-.07 1.3-.18 1.914-.357.592-.17 1.226-.43 1.657-.861a3.745 3.745 0 001.055-3.217c.908-.461 1.942-1.216 3.04-2.3 1.279-1.262 2.764-2.825 3.775-4.249.501-.706.923-1.428 1.125-2.096.2-.659.235-1.469-.368-2.07-.606-.607-1.42-.55-2.069-.34-.66.213-1.376.646-2.076 1.155zm-3.95 8.48a3.76 3.76 0 00-1.19-1.192 9.758 9.758 0 011.161-1.607l1.658 1.658a9.853 9.853 0 01-1.63 1.142zM.742 16l.007-.75-.75.008A.75.75 0 00.743 16zM12.016 2.749c-1.224.89-2.605 2.189-3.822 3.384l1.718 1.718c1.21-1.205 2.51-2.597 3.387-3.833.47-.662.78-1.227.912-1.662.134-.444.032-.551.009-.575h-.001V1.78c-.014-.014-.112-.113-.548.027-.432.14-.995.462-1.655.942zM1.62 13.089a19.56 19.56 0 00-.104 1.395 19.55 19.55 0 001.396-.104 10.528 10.528 0 001.668-.309c.526-.151.856-.325 1.011-.48a2.25 2.25 0 00-3.182-3.182c-.155.155-.329.485-.48 1.01a10.515 10.515 0 00-.309 1.67z\"></path>"
		}
	}
};
var pencil = {
	name: "pencil",
	keywords: [
		"edit",
		"change",
		"update",
		"write"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M17.263 2.177a1.75 1.75 0 012.474 0l2.586 2.586a1.75 1.75 0 010 2.474L19.53 10.03l-.012.013L8.69 20.378a1.75 1.75 0 01-.699.409l-5.523 1.68a.75.75 0 01-.935-.935l1.673-5.5a1.75 1.75 0 01.466-.756L14.476 4.963l2.787-2.786zm-2.275 4.371l-10.28 9.813a.25.25 0 00-.067.108l-1.264 4.154 4.177-1.271a.25.25 0 00.1-.059l10.273-9.806-2.94-2.939zM19 8.44l2.263-2.262a.25.25 0 000-.354l-2.586-2.586a.25.25 0 00-.354 0L16.061 5.5 19 8.44z\"></path>"
		}
	}
};
var people = {
	name: "people",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3.5 8a5.5 5.5 0 118.596 4.547 9.005 9.005 0 015.9 8.18.75.75 0 01-1.5.045 7.5 7.5 0 00-14.993 0 .75.75 0 01-1.499-.044 9.005 9.005 0 015.9-8.181A5.494 5.494 0 013.5 8zM9 4a4 4 0 100 8 4 4 0 000-8z\"></path><path d=\"M17.29 8c-.148 0-.292.01-.434.03a.75.75 0 11-.212-1.484 4.53 4.53 0 013.38 8.097 6.69 6.69 0 013.956 6.107.75.75 0 01-1.5 0 5.193 5.193 0 00-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0017.29 8z\"></path>"
		}
	}
};
var person = {
	name: "person",
	keywords: [
		"people",
		"man",
		"woman",
		"human"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm.061 3.073a4 4 0 10-5.123 0 6.004 6.004 0 00-3.431 5.142.75.75 0 001.498.07 4.5 4.5 0 018.99 0 .75.75 0 101.498-.07 6.005 6.005 0 00-3.432-5.142z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 2.5a5.5 5.5 0 00-3.096 10.047 9.005 9.005 0 00-5.9 8.18.75.75 0 001.5.045 7.5 7.5 0 0114.993 0 .75.75 0 101.499-.044 9.005 9.005 0 00-5.9-8.181A5.5 5.5 0 0012 2.5zM8 8a4 4 0 118 0 4 4 0 01-8 0z\"></path>"
		}
	}
};
var pin = {
	name: "pin",
	keywords: [
		"save",
		"star",
		"bookmark"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.456.734a1.75 1.75 0 012.826.504l.613 1.327a3.081 3.081 0 002.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.75.75 0 11-1.061 1.06L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.081 3.081 0 00-1.707-2.084l-1.327-.613a1.75 1.75 0 01-.504-2.826L4.456.734zM5.92 1.866a.25.25 0 00-.404-.072L1.794 5.516a.25.25 0 00.072.404l1.328.613A4.582 4.582 0 015.73 9.63l.584 2.454a.25.25 0 00.42.12l5.47-5.47a.25.25 0 00-.12-.42L9.63 5.73a4.581 4.581 0 01-3.098-2.537L5.92 1.866z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M7.886 1.553a1.75 1.75 0 012.869.604l.633 1.629a5.666 5.666 0 003.725 3.395l3.959 1.131a1.75 1.75 0 01.757 2.92L16.06 15l5.594 5.595a.75.75 0 11-1.06 1.06L15 16.061l-3.768 3.768a1.75 1.75 0 01-2.92-.757l-1.131-3.96a5.667 5.667 0 00-3.395-3.724l-1.63-.633a1.75 1.75 0 01-.603-2.869l6.333-6.333zm6.589 12.912l-.005.005-.005.005-4.294 4.293a.25.25 0 01-.417-.108l-1.13-3.96A7.166 7.166 0 004.33 9.99L2.7 9.356a.25.25 0 01-.086-.41l6.333-6.332a.25.25 0 01.41.086l.633 1.63a7.167 7.167 0 004.71 4.293l3.96 1.131a.25.25 0 01.108.417l-4.293 4.294z\"></path>"
		}
	}
};
var play = {
	name: "play",
	keywords: [
		"play",
		"start",
		"begin",
		"action"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M9.5 15.584V8.416a.5.5 0 01.77-.42l5.576 3.583a.5.5 0 010 .842l-5.576 3.584a.5.5 0 01-.77-.42z\"></path><path fill-rule=\"evenodd\" d=\"M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z\"></path>"
		}
	}
};
var plug = {
	name: "plug",
	keywords: [
		"hook",
		"webhook"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M10.276 3.09a.25.25 0 01.192-.09h.782a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25h-.782a.25.25 0 01-.192-.09l-.95-1.14a.75.75 0 00-.483-.264l-3.124-.39a.25.25 0 01-.219-.249V5.133a.25.25 0 01.219-.248l3.124-.39a.75.75 0 00.483-.265l.95-1.14zM4 8v1.867a1.75 1.75 0 001.533 1.737l2.83.354.761.912c.332.4.825.63 1.344.63h.782A1.75 1.75 0 0013 11.75V11h2.25a.75.75 0 000-1.5H13v-4h2.25a.75.75 0 000-1.5H13v-.75a1.75 1.75 0 00-1.75-1.75h-.782c-.519 0-1.012.23-1.344.63l-.76.913-2.831.353A1.75 1.75 0 004 5.133V6.5H2.5A2.5 2.5 0 000 9v5.25a.75.75 0 001.5 0V9a1 1 0 011-1H4z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M7 11.5v3.848a1.75 1.75 0 001.57 1.74l6.055.627 1.006 1.174a1.75 1.75 0 001.329.611h1.29A1.75 1.75 0 0020 17.75V15.5h3.25a.75.75 0 000-1.5H20V7.5h3.25a.75.75 0 000-1.5H20V3.75A1.75 1.75 0 0018.25 2h-1.29c-.51 0-.996.223-1.329.611l-1.006 1.174-6.055.626A1.75 1.75 0 007 6.151V10H2.937A2.938 2.938 0 000 12.938v8.312a.75.75 0 001.5 0v-8.313c0-.793.644-1.437 1.438-1.437H7zm9.77-7.913a.25.25 0 01.19-.087h1.29a.25.25 0 01.25.25v14a.25.25 0 01-.25.25h-1.29a.25.25 0 01-.19-.087l-1.2-1.401a.75.75 0 00-.493-.258l-6.353-.657a.25.25 0 01-.224-.249V6.152a.25.25 0 01.224-.249l6.353-.657a.75.75 0 00.492-.258l1.201-1.4z\"></path>"
		}
	}
};
var plus = {
	name: "plus",
	keywords: [
		"add",
		"new",
		"more"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z\"></path>"
		}
	}
};
var project$1 = {
	name: "project",
	keywords: [
		"board",
		"kanban",
		"columns",
		"scrum"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 0A1.75 1.75 0 000 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V1.75A1.75 1.75 0 0014.25 0H1.75zM1.5 1.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V1.75zM11.75 3a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75zm-8.25.75a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5zM8 3a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 3z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M7.25 6a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5A.75.75 0 007.25 6zM12 6a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 0012 6zm4 .75a.75.75 0 011.5 0v9.5a.75.75 0 01-1.5 0v-9.5z\"></path><path fill-rule=\"evenodd\" d=\"M3.75 2A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0022 20.25V3.75A1.75 1.75 0 0020.25 2H3.75zM3.5 3.75a.25.25 0 01.25-.25h16.5a.25.25 0 01.25.25v16.5a.25.25 0 01-.25.25H3.75a.25.25 0 01-.25-.25V3.75z\"></path>"
		}
	}
};
var pulse = {
	name: "pulse",
	keywords: [
		"graph",
		"trend",
		"line",
		"activity"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6 2a.75.75 0 01.696.471L10 10.731l1.304-3.26A.75.75 0 0112 7h3.25a.75.75 0 010 1.5h-2.742l-1.812 4.528a.75.75 0 01-1.392 0L6 4.77 4.696 8.03A.75.75 0 014 8.5H.75a.75.75 0 010-1.5h2.742l1.812-4.529A.75.75 0 016 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M9.002 2.5a.75.75 0 01.691.464l6.302 15.305 2.56-6.301a.75.75 0 01.695-.468h4a.75.75 0 010 1.5h-3.495l-3.06 7.532a.75.75 0 01-1.389.004L8.997 5.21l-3.054 7.329A.75.75 0 015.25 13H.75a.75.75 0 010-1.5h4l3.558-8.538a.75.75 0 01.694-.462z\"></path>"
		}
	}
};
var question = {
	name: "question",
	keywords: [
		"help",
		"explain"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zM6.92 6.085c.081-.16.19-.299.34-.398.145-.097.371-.187.74-.187.28 0 .553.087.738.225A.613.613 0 019 6.25c0 .177-.04.264-.077.318a.956.956 0 01-.277.245c-.076.051-.158.1-.258.161l-.007.004a7.728 7.728 0 00-.313.195 2.416 2.416 0 00-.692.661.75.75 0 001.248.832.956.956 0 01.276-.245 6.3 6.3 0 01.26-.16l.006-.004c.093-.057.204-.123.313-.195.222-.149.487-.355.692-.662.214-.32.329-.702.329-1.15 0-.76-.36-1.348-.863-1.725A2.76 2.76 0 008 4c-.631 0-1.155.16-1.572.438-.413.276-.68.638-.849.977a.75.75 0 101.342.67z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M10.97 8.265a1.45 1.45 0 00-.487.57.75.75 0 01-1.341-.67c.2-.402.513-.826.997-1.148C10.627 6.69 11.244 6.5 12 6.5c.658 0 1.369.195 1.934.619a2.45 2.45 0 011.004 2.006c0 1.033-.513 1.72-1.027 2.215-.19.183-.399.358-.579.508l-.147.123a4.329 4.329 0 00-.435.409v1.37a.75.75 0 11-1.5 0v-1.473c0-.237.067-.504.247-.736.22-.28.486-.517.718-.714l.183-.153.001-.001c.172-.143.324-.27.47-.412.368-.355.569-.676.569-1.136a.953.953 0 00-.404-.806C12.766 8.118 12.384 8 12 8c-.494 0-.814.121-1.03.265zM13 17a1 1 0 11-2 0 1 1 0 012 0z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
};
var quote = {
	name: "quote",
	keywords: [
		"quotation"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 2.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H1.75zm4 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM2.5 7.75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3 6.25a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.25zM3.75 11a.75.75 0 01.75.75v7a.75.75 0 01-1.5 0v-7a.75.75 0 01.75-.75zM8 12.313a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H8.75a.75.75 0 01-.75-.75zm0 5.937a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H8.75a.75.75 0 01-.75-.75z\"></path>"
		}
	}
};
var reply = {
	name: "reply",
	keywords: [
		"reply all",
		"back"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.78 1.97a.75.75 0 010 1.06L3.81 6h6.44A4.75 4.75 0 0115 10.75v2.5a.75.75 0 01-1.5 0v-2.5a3.25 3.25 0 00-3.25-3.25H3.81l2.97 2.97a.75.75 0 11-1.06 1.06L1.47 7.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M10.53 5.03a.75.75 0 10-1.06-1.06l-6.25 6.25a.75.75 0 000 1.06l6.25 6.25a.75.75 0 101.06-1.06L5.56 11.5H17a3.248 3.248 0 013.25 3.248v4.502a.75.75 0 001.5 0v-4.502A4.748 4.748 0 0017 10H5.56l4.97-4.97z\"></path>"
		}
	}
};
var repo = {
	name: "repo",
	keywords: [
		"book",
		"journal",
		"repository"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3 2.75A2.75 2.75 0 015.75 0h14.5a.75.75 0 01.75.75v20.5a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h5.25v-4H6A1.5 1.5 0 004.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 01-.6 1.374A3.25 3.25 0 013 18.75v-16zM19.5 1.5V15H6c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H19.5z\"></path><path d=\"M7 18.25a.25.25 0 01.25-.25h5a.25.25 0 01.25.25v5.01a.25.25 0 01-.397.201l-2.206-1.604a.25.25 0 00-.294 0L7.397 23.46a.25.25 0 01-.397-.2v-5.01z\"></path>"
		}
	}
};
var report = {
	name: "report",
	keywords: [
		"report",
		"abuse",
		"flag"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 1.5a.25.25 0 00-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h6.5a.25.25 0 00.25-.25v-9.5a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0114.25 13H8.06l-2.573 2.573A1.457 1.457 0 013 14.543V13H1.75A1.75 1.75 0 010 11.25v-9.5zM9 9a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.427-3.427A1.75 1.75 0 0111.164 17h9.586a.25.25 0 00.25-.25V4.25a.25.25 0 00-.25-.25H3.25zm-1.75.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 01-1.75 1.75h-9.586a.25.25 0 00-.177.073l-3.5 3.5A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25zM12 6a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0v-4A.75.75 0 0112 6zm0 9a1 1 0 100-2 1 1 0 000 2z\"></path>"
		}
	}
};
var rocket = {
	name: "rocket",
	keywords: [
		"staff",
		"stafftools",
		"blast",
		"off",
		"space",
		"launch",
		"ship"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M14.064 0a8.75 8.75 0 00-6.187 2.563l-.459.458c-.314.314-.616.641-.904.979H3.31a1.75 1.75 0 00-1.49.833L.11 7.607a.75.75 0 00.418 1.11l3.102.954c.037.051.079.1.124.145l2.429 2.428c.046.046.094.088.145.125l.954 3.102a.75.75 0 001.11.418l2.774-1.707a1.75 1.75 0 00.833-1.49V9.485c.338-.288.665-.59.979-.904l.458-.459A8.75 8.75 0 0016 1.936V1.75A1.75 1.75 0 0014.25 0h-.186zM10.5 10.625c-.088.06-.177.118-.266.175l-2.35 1.521.548 1.783 1.949-1.2a.25.25 0 00.119-.213v-2.066zM3.678 8.116L5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 00-.213.119l-1.2 1.95 1.782.547zm5.26-4.493A7.25 7.25 0 0114.063 1.5h.186a.25.25 0 01.25.25v.186a7.25 7.25 0 01-2.123 5.127l-.459.458a15.21 15.21 0 01-2.499 2.02l-2.317 1.5-2.143-2.143 1.5-2.317a15.25 15.25 0 012.02-2.5l.458-.458h.002zM12 5a1 1 0 11-2 0 1 1 0 012 0zm-8.44 9.56a1.5 1.5 0 10-2.12-2.12c-.734.73-1.047 2.332-1.15 3.003a.23.23 0 00.265.265c.671-.103 2.273-.416 3.005-1.148z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M20.322.75a10.75 10.75 0 00-7.373 2.926l-1.304 1.23A23.743 23.743 0 0010.103 6.5H5.066a1.75 1.75 0 00-1.5.85l-2.71 4.514a.75.75 0 00.49 1.12l4.571.963c.039.049.082.096.129.14L8.04 15.96l1.872 1.994c.044.047.091.09.14.129l.963 4.572a.75.75 0 001.12.488l4.514-2.709a1.75 1.75 0 00.85-1.5v-5.038a23.741 23.741 0 001.596-1.542l1.228-1.304a10.75 10.75 0 002.925-7.374V2.499A1.75 1.75 0 0021.498.75h-1.177zM16 15.112c-.333.248-.672.487-1.018.718l-3.393 2.262.678 3.223 3.612-2.167a.25.25 0 00.121-.214v-3.822zm-10.092-2.7L8.17 9.017c.23-.346.47-.685.717-1.017H5.066a.25.25 0 00-.214.121l-2.167 3.612 3.223.679zm8.07-7.644a9.25 9.25 0 016.344-2.518h1.177a.25.25 0 01.25.25v1.176a9.25 9.25 0 01-2.517 6.346l-1.228 1.303a22.248 22.248 0 01-3.854 3.257l-3.288 2.192-1.743-1.858a.764.764 0 00-.034-.034l-1.859-1.744 2.193-3.29a22.248 22.248 0 013.255-3.851l1.304-1.23zM17.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11 13c.9-.9.9-2.6 0-3.5-.9-.9-2.6-.9-3.5 0-1.209 1.209-1.445 3.901-1.49 4.743a.232.232 0 00.247.247c.842-.045 3.534-.281 4.743-1.49z\"></path>"
		}
	}
};
var rss = {
	name: "rss",
	keywords: [
		"broadcast",
		"feed",
		"atom"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.002 2.725a.75.75 0 01.797-.699C8.79 2.42 13.58 7.21 13.974 13.201a.75.75 0 11-1.497.098 10.502 10.502 0 00-9.776-9.776.75.75 0 01-.7-.798zM2 13a1 1 0 112 0 1 1 0 01-2 0zm.84-5.95a.75.75 0 00-.179 1.489c2.509.3 4.5 2.291 4.8 4.8a.75.75 0 101.49-.178A7.003 7.003 0 002.838 7.05z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3.5 3.25a.75.75 0 01.75-.75C14.053 2.5 22 10.447 22 20.25a.75.75 0 01-1.5 0C20.5 11.275 13.225 4 4.25 4a.75.75 0 01-.75-.75zM3.5 19a2 2 0 114 0 2 2 0 01-4 0zm.75-9.5a.75.75 0 000 1.5 9.25 9.25 0 019.25 9.25.75.75 0 001.5 0C15 14.313 10.187 9.5 4.25 9.5z\"></path>"
		}
	}
};
var ruby = {
	name: "ruby",
	keywords: [
		"code",
		"language"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.637 2.291A.75.75 0 014.23 2h7.54a.75.75 0 01.593.291l3.48 4.5a.75.75 0 01-.072.999l-7.25 7a.75.75 0 01-1.042 0l-7.25-7a.75.75 0 01-.072-.999l3.48-4.5zM4.598 3.5L1.754 7.177 8 13.207l6.246-6.03L11.402 3.5H4.598z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.873 3.26A.75.75 0 016.44 3h11.31a.75.75 0 01.576.27l5 6a.75.75 0 01-.028.992l-10.75 11.5a.75.75 0 01-1.096 0l-10.75-11.5a.75.75 0 01-.02-1.003l5.19-6zm.91 1.24L2.258 9.73 12 20.153l9.75-10.43L17.399 4.5H6.783z\"></path>"
		}
	}
};
var search = {
	name: "search",
	keywords: [
		"magnifying",
		"glass"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z\"></path>"
		}
	}
};
var server = {
	name: "server",
	keywords: [
		"computers",
		"racks",
		"ops"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 1A1.75 1.75 0 000 2.75v4c0 .372.116.717.314 1a1.742 1.742 0 00-.314 1v4c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0016 12.75v-4c0-.372-.116-.717-.314-1 .198-.283.314-.628.314-1v-4A1.75 1.75 0 0014.25 1H1.75zm0 7.5a.25.25 0 00-.25.25v4c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-4a.25.25 0 00-.25-.25H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v4a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25v-4zm5.5 2A.75.75 0 017.75 4h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 4.75zM7.75 10a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM3 4.75A.75.75 0 013.75 4h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 4.75zM3.75 10a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M10.75 6.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zM6 7.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 7.25zm4 9a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5a.75.75 0 01-.75-.75zm-3.25-.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z\"></path><path fill-rule=\"evenodd\" d=\"M3.25 2A1.75 1.75 0 001.5 3.75v7c0 .372.116.716.314 1a1.742 1.742 0 00-.314 1v7c0 .966.784 1.75 1.75 1.75h17.5a1.75 1.75 0 001.75-1.75v-7c0-.372-.116-.716-.314-1 .198-.284.314-.628.314-1v-7A1.75 1.75 0 0020.75 2H3.25zm0 9h17.5a.25.25 0 00.25-.25v-7a.25.25 0 00-.25-.25H3.25a.25.25 0 00-.25.25v7c0 .138.112.25.25.25zm0 1.5a.25.25 0 00-.25.25v7c0 .138.112.25.25.25h17.5a.25.25 0 00.25-.25v-7a.25.25 0 00-.25-.25H3.25z\"></path>"
		}
	}
};
var share = {
	name: "share",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.823.177L4.927 3.073a.25.25 0 00.177.427H7.25v5.75a.75.75 0 001.5 0V3.5h2.146a.25.25 0 00.177-.427L8.177.177a.25.25 0 00-.354 0zM3.75 6.5a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-6.5a.25.25 0 00-.25-.25h-1a.75.75 0 010-1.5h1c.966 0 1.75.784 1.75 1.75v6.5A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25v-6.5C2 5.784 2.784 5 3.75 5h1a.75.75 0 110 1.5h-1z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.53 1.22a.75.75 0 00-1.06 0L8.22 4.47a.75.75 0 001.06 1.06l1.97-1.97v10.69a.75.75 0 001.5 0V3.56l1.97 1.97a.75.75 0 101.06-1.06l-3.25-3.25zM5.5 9.75a.25.25 0 01.25-.25h2.5a.75.75 0 000-1.5h-2.5A1.75 1.75 0 004 9.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0020 20.25V9.75A1.75 1.75 0 0018.25 8h-2.5a.75.75 0 000 1.5h2.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H5.75a.25.25 0 01-.25-.25V9.75z\"></path>"
		}
	}
};
var shield = {
	name: "shield",
	keywords: [
		"security",
		"shield",
		"protection"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.467.133a1.75 1.75 0 011.066 0l5.25 1.68A1.75 1.75 0 0115 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.7 1.7 0 01-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 011.217-1.667l5.25-1.68zm.61 1.429a.25.25 0 00-.153 0l-5.25 1.68a.25.25 0 00-.174.238V7c0 1.358.275 2.666 1.057 3.86.784 1.194 2.121 2.34 4.366 3.297a.2.2 0 00.154 0c2.245-.956 3.582-2.104 4.366-3.298C13.225 9.666 13.5 8.36 13.5 7V3.48a.25.25 0 00-.174-.237l-5.25-1.68zM9 10.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.75a.75.75 0 10-1.5 0v3a.75.75 0 001.5 0v-3z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M13 15.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-8.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z\"></path><path fill-rule=\"evenodd\" d=\"M11.46.637a1.75 1.75 0 011.08 0l8.25 2.675A1.75 1.75 0 0122 4.976V10c0 6.19-3.77 10.705-9.401 12.83a1.699 1.699 0 01-1.198 0C5.771 20.704 2 16.19 2 10V4.976c0-.76.49-1.43 1.21-1.664L11.46.637zm.617 1.426a.25.25 0 00-.154 0L3.673 4.74a.249.249 0 00-.173.237V10c0 5.461 3.28 9.483 8.43 11.426a.2.2 0 00.14 0C17.22 19.483 20.5 15.46 20.5 10V4.976a.25.25 0 00-.173-.237l-8.25-2.676z\"></path>"
		}
	}
};
var skip = {
	name: "skip",
	keywords: [
		"skip",
		"slash"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm3.28 5.78a.75.75 0 00-1.06-1.06l-5.5 5.5a.75.75 0 101.06 1.06l5.5-5.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M17.28 7.78a.75.75 0 00-1.06-1.06l-9.5 9.5a.75.75 0 101.06 1.06l9.5-9.5z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
};
var smiley = {
	name: "smiley",
	keywords: [
		"emoji",
		"smile",
		"mood",
		"emotion"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M8.456 14.494a.75.75 0 011.068.17 3.08 3.08 0 00.572.492A3.381 3.381 0 0012 15.72c.855 0 1.487-.283 1.904-.562a3.081 3.081 0 00.572-.492l.021-.026a.75.75 0 011.197.905l-.027.034c-.013.016-.03.038-.052.063-.044.05-.105.119-.184.198a4.569 4.569 0 01-.695.566A4.88 4.88 0 0112 17.22a4.88 4.88 0 01-2.736-.814 4.57 4.57 0 01-.695-.566 3.253 3.253 0 01-.236-.261c-.259-.332-.223-.824.123-1.084z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path><path d=\"M9 10.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM16.25 12a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z\"></path>"
		}
	}
};
var square = {
	name: "square",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4 5.75C4 4.784 4.784 4 5.75 4h4.5c.966 0 1.75.784 1.75 1.75v4.5A1.75 1.75 0 0110.25 12h-4.5A1.75 1.75 0 014 10.25v-4.5zm1.75-.25a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h4.5a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-4.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6 7.75C6 6.784 6.784 6 7.75 6h8.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0116.25 18h-8.5A1.75 1.75 0 016 16.25v-8.5zm1.75-.25a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25h-8.5z\"></path>"
		}
	}
};
var squirrel = {
	name: "squirrel",
	keywords: [
		"ship",
		"shipit",
		"launch"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.499.75a.75.75 0 011.5 0v.996C5.9 2.903 6.793 3.65 7.662 4.376l.24.202c-.036-.694.055-1.422.426-2.163C9.1.873 10.794-.045 12.622.26 14.408.558 16 1.94 16 4.25c0 1.278-.954 2.575-2.44 2.734l.146.508.065.22c.203.701.412 1.455.476 2.226.142 1.707-.4 3.03-1.487 3.898C11.714 14.671 10.27 15 8.75 15h-6a.75.75 0 010-1.5h1.376a4.489 4.489 0 01-.563-1.191 3.833 3.833 0 01-.05-2.063 4.636 4.636 0 01-2.025-.293.75.75 0 11.525-1.406c1.357.507 2.376-.006 2.698-.318l.009-.01a.748.748 0 011.06 0 .75.75 0 01-.012 1.074c-.912.92-.992 1.835-.768 2.586.221.74.745 1.337 1.196 1.621H8.75c1.343 0 2.398-.296 3.074-.836.635-.507 1.036-1.31.928-2.602-.05-.603-.216-1.224-.422-1.93l-.064-.221c-.12-.407-.246-.84-.353-1.29a2.404 2.404 0 01-.507-.441 3.063 3.063 0 01-.633-1.248.75.75 0 011.455-.364c.046.185.144.436.31.627.146.168.353.305.712.305.738 0 1.25-.615 1.25-1.25 0-1.47-.95-2.315-2.123-2.51-1.172-.196-2.227.387-2.706 1.345-.46.92-.27 1.774.019 3.062l.042.19a.753.753 0 01.01.05c.348.443.666.949.94 1.553a.75.75 0 11-1.365.62c-.553-1.217-1.32-1.94-2.3-2.768a85.08 85.08 0 00-.317-.265c-.814-.68-1.75-1.462-2.692-2.619a3.74 3.74 0 00-1.023.88c-.406.495-.663 1.036-.722 1.508.116.122.306.21.591.239.388.038.797-.06 1.032-.19a.75.75 0 01.728 1.31c-.515.287-1.23.439-1.906.373-.682-.067-1.473-.38-1.879-1.193L.75 5.677V5.5c0-.984.48-1.94 1.077-2.664.46-.559 1.05-1.055 1.673-1.353V.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M18.377 3.49c-1.862-.31-3.718.62-4.456 2.095-.428.857-.691 1.624-.728 2.361-.035.71.138 1.444.67 2.252.644.854 1.199 1.913 1.608 3.346a.75.75 0 11-1.442.412c-.353-1.236-.82-2.135-1.372-2.865l-.008-.01c-.53-.698-1.14-1.242-1.807-1.778a50.724 50.724 0 00-.667-.524C9.024 7.884 7.71 6.863 6.471 5.16c-.59.287-1.248.798-1.806 1.454-.665.78-1.097 1.66-1.158 2.446.246.36.685.61 1.246.715.643.12 1.278.015 1.633-.182a.75.75 0 11.728 1.311c-.723.402-1.728.516-2.637.346-.916-.172-1.898-.667-2.398-1.666L2 9.427V9.25c0-1.323.678-2.615 1.523-3.607.7-.824 1.59-1.528 2.477-1.917V2.75a.75.75 0 111.5 0v1.27c1.154 1.67 2.363 2.612 3.568 3.551.207.162.415.323.621.489.001-.063.003-.126.006-.188.052-1.034.414-2.017.884-2.958 1.06-2.118 3.594-3.313 6.044-2.904 1.225.204 2.329.795 3.125 1.748C22.546 4.713 23 5.988 23 7.5c0 1.496-.913 3.255-2.688 3.652.838 1.699 1.438 3.768 1.181 5.697-.269 2.017-1.04 3.615-2.582 4.675C17.409 22.558 15.288 23 12.5 23H4.75a.75.75 0 010-1.5h2.322c-.58-.701-.998-1.578-1.223-2.471-.327-1.3-.297-2.786.265-4.131-.92.091-1.985-.02-3.126-.445a.75.75 0 11.524-1.406c1.964.733 3.428.266 4.045-.19.068-.06.137-.12.208-.18a.745.745 0 01.861-.076.746.746 0 01.32.368.752.752 0 01-.173.819c-.077.076-.16.15-.252.221-1.322 1.234-1.62 3.055-1.218 4.654.438 1.737 1.574 2.833 2.69 2.837H12.5c2.674 0 4.429-.433 5.56-1.212 1.094-.752 1.715-1.904 1.946-3.637.236-1.768-.445-3.845-1.407-5.529a.576.576 0 01-.012-.02 3.557 3.557 0 01-1.553-.94c-.556-.565-.89-1.243-1.012-1.73a.75.75 0 011.456-.364c.057.231.26.67.626 1.043.35.357.822.623 1.443.623 1.172 0 1.953-1.058 1.953-2.234 0-1.205-.357-2.127-.903-2.78-.547-.654-1.318-1.08-2.22-1.23z\"></path>"
		}
	}
};
var star = {
	name: "star",
	keywords: [
		"save",
		"remember",
		"like"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 .25a.75.75 0 01.673.418l3.058 6.197 6.839.994a.75.75 0 01.415 1.279l-4.948 4.823 1.168 6.811a.75.75 0 01-1.088.791L12 18.347l-6.117 3.216a.75.75 0 01-1.088-.79l1.168-6.812-4.948-4.823a.75.75 0 01.416-1.28l6.838-.993L11.328.668A.75.75 0 0112 .25zm0 2.445L9.44 7.882a.75.75 0 01-.565.41l-5.725.832 4.143 4.038a.75.75 0 01.215.664l-.978 5.702 5.121-2.692a.75.75 0 01.698 0l5.12 2.692-.977-5.702a.75.75 0 01.215-.664l4.143-4.038-5.725-.831a.75.75 0 01-.565-.41L12 2.694z\"></path>"
		}
	}
};
var stop = {
	name: "stop",
	keywords: [
		"block",
		"spam",
		"report"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm0 10a1 1 0 100-2 1 1 0 000 2z\"></path><path fill-rule=\"evenodd\" d=\"M7.328 1.47a.75.75 0 01.53-.22h8.284a.75.75 0 01.53.22l5.858 5.858c.141.14.22.33.22.53v8.284a.75.75 0 01-.22.53l-5.858 5.858a.75.75 0 01-.53.22H7.858a.75.75 0 01-.53-.22L1.47 16.672a.75.75 0 01-.22-.53V7.858a.75.75 0 01.22-.53L7.328 1.47zm.84 1.28L2.75 8.169v7.662l5.419 5.419h7.662l5.419-5.418V8.168L15.832 2.75H8.168z\"></path>"
		}
	}
};
var stopwatch = {
	name: "stopwatch",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5.75.75A.75.75 0 016.5 0h3a.75.75 0 010 1.5h-.75v1l-.001.041a6.718 6.718 0 013.464 1.435l.007-.006.75-.75a.75.75 0 111.06 1.06l-.75.75-.006.007a6.75 6.75 0 11-10.548 0L2.72 5.03l-.75-.75a.75.75 0 011.06-1.06l.75.75.007.006A6.718 6.718 0 017.25 2.541a.756.756 0 010-.041v-1H6.5a.75.75 0 01-.75-.75zM8 14.5A5.25 5.25 0 108 4a5.25 5.25 0 000 10.5zm.389-6.7l1.33-1.33a.75.75 0 111.061 1.06L9.45 8.861A1.502 1.502 0 018 10.75a1.5 1.5 0 11.389-2.95z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M10.25 0a.75.75 0 000 1.5h1v1.278a9.955 9.955 0 00-5.635 2.276L4.28 3.72a.75.75 0 00-1.06 1.06l1.315 1.316A9.962 9.962 0 002 12.75c0 5.523 4.477 10 10 10s10-4.477 10-10a9.962 9.962 0 00-2.535-6.654L20.78 4.78a.75.75 0 00-1.06-1.06l-1.334 1.334a9.955 9.955 0 00-5.636-2.276V1.5h1a.75.75 0 000-1.5h-3.5zM12 21.25a8.5 8.5 0 100-17 8.5 8.5 0 000 17zm4.03-12.53a.75.75 0 010 1.06l-2.381 2.382a1.75 1.75 0 11-1.06-1.06l2.38-2.382a.75.75 0 011.061 0z\"></path>"
		}
	}
};
var strikethrough = {
	name: "strikethrough",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.581 3.25c-2.036 0-2.778 1.082-2.778 1.786 0 .055.002.107.006.157a.75.75 0 01-1.496.114 3.56 3.56 0 01-.01-.271c0-1.832 1.75-3.286 4.278-3.286 1.418 0 2.721.58 3.514 1.093a.75.75 0 11-.814 1.26c-.64-.414-1.662-.853-2.7-.853zm3.474 5.25h3.195a.75.75 0 000-1.5H1.75a.75.75 0 000 1.5h6.018c.835.187 1.503.464 1.951.81.439.34.647.725.647 1.197 0 .428-.159.895-.594 1.267-.444.38-1.254.726-2.676.726-1.373 0-2.38-.493-2.86-.956a.75.75 0 00-1.042 1.079C3.992 13.393 5.39 14 7.096 14c1.652 0 2.852-.403 3.65-1.085a3.134 3.134 0 001.12-2.408 2.85 2.85 0 00-.811-2.007z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.36 5C9.37 5 8.105 6.613 8.105 7.848c0 .411.072.744.193 1.02a.75.75 0 01-1.373.603 3.993 3.993 0 01-.32-1.623c0-2.363 2.271-4.348 5.755-4.348 1.931 0 3.722.794 4.814 1.5a.75.75 0 11-.814 1.26c-.94-.607-2.448-1.26-4-1.26zm4.173 7.5h3.717a.75.75 0 000-1.5H3.75a.75.75 0 000 1.5h9.136c1.162.28 2.111.688 2.76 1.211.642.518.979 1.134.979 1.898a2.63 2.63 0 01-.954 2.036c-.703.601-1.934 1.105-3.999 1.105-2.018 0-3.529-.723-4.276-1.445a.75.75 0 10-1.042 1.08c1.066 1.028 2.968 1.865 5.318 1.865 2.295 0 3.916-.56 4.974-1.464a4.131 4.131 0 001.479-3.177c0-1.296-.608-2.316-1.538-3.066a5.77 5.77 0 00-.054-.043z\"></path>"
		}
	}
};
var sun = {
	name: "sun",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8 12a4 4 0 100-8 4 4 0 000 8zM8 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V.75A.75.75 0 018 0zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018 13zM2.343 2.343a.75.75 0 011.061 0l1.06 1.061a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zm9.193 9.193a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.061l-1.061-1.06a.75.75 0 010-1.061zM16 8a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0116 8zM3 8a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h1.5A.75.75 0 013 8zm10.657-5.657a.75.75 0 010 1.061l-1.061 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-9.193 9.193a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zm0 1.5a7 7 0 100-14 7 7 0 000 14zm12-7a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h2.5A.75.75 0 0124 12zM4 12a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h2.5A.75.75 0 014 12zm16.485-8.485a.75.75 0 010 1.06l-1.768 1.768a.75.75 0 01-1.06-1.06l1.767-1.768a.75.75 0 011.061 0zM6.343 17.657a.75.75 0 010 1.06l-1.768 1.768a.75.75 0 11-1.06-1.06l1.767-1.768a.75.75 0 011.061 0zM12 0a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0V.75A.75.75 0 0112 0zm0 20a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 0112 20zM3.515 3.515a.75.75 0 011.06 0l1.768 1.768a.75.75 0 11-1.06 1.06L3.515 4.575a.75.75 0 010-1.06zm14.142 14.142a.75.75 0 011.06 0l1.768 1.768a.75.75 0 01-1.06 1.06l-1.768-1.767a.75.75 0 010-1.061z\"></path>"
		}
	}
};
var sync = {
	name: "sync",
	keywords: [
		"cycle",
		"refresh",
		"loop"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M3.38 8A9.502 9.502 0 0112 2.5a9.502 9.502 0 019.215 7.182.75.75 0 101.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 00-9.5 5.452V4.75a.75.75 0 00-1.5 0V8.5a1 1 0 001 1h3.75a.75.75 0 000-1.5H3.38zm-.595 6.318a.75.75 0 00-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 001.5 0V15.5a1 1 0 00-1-1h-3.75a.75.75 0 000 1.5h2.37A9.502 9.502 0 0112 21.5c-4.446 0-8.181-3.055-9.215-7.182z\"></path>"
		}
	}
};
var tab = {
	name: "tab",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path d=\"M22 4.25a.75.75 0 00-1.5 0v15a.75.75 0 001.5 0v-15zm-9.72 14.28a.75.75 0 11-1.06-1.06l4.97-4.97H1.75a.75.75 0 010-1.5h14.44l-4.97-4.97a.75.75 0 011.06-1.06l6.25 6.25a.75.75 0 010 1.06l-6.25 6.25z\"></path>"
		}
	}
};
var tag = {
	name: "tag",
	keywords: [
		"release"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M7.75 6.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z\"></path><path fill-rule=\"evenodd\" d=\"M2.5 1A1.5 1.5 0 001 2.5v8.44c0 .397.158.779.44 1.06l10.25 10.25a1.5 1.5 0 002.12 0l8.44-8.44a1.5 1.5 0 000-2.12L12 1.44A1.5 1.5 0 0010.94 1H2.5zm0 1.5h8.44l10.25 10.25-8.44 8.44L2.5 10.94V2.5z\"></path>"
		}
	}
};
var tasklist = {
	name: "tasklist",
	keywords: [
		"todo"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.5 2.75a.25.25 0 01.25-.25h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75zM2.75 1A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1H2.75zm9.03 5.28a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M17.28 9.28a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z\"></path><path fill-rule=\"evenodd\" d=\"M3.75 2A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0022 20.25V3.75A1.75 1.75 0 0020.25 2H3.75zM3.5 3.75a.25.25 0 01.25-.25h16.5a.25.25 0 01.25.25v16.5a.25.25 0 01-.25.25H3.75a.25.25 0 01-.25-.25V3.75z\"></path>"
		}
	}
};
var telescope = {
	name: "telescope",
	keywords: [
		"science",
		"space",
		"look",
		"view",
		"explore"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M14.184 1.143a1.75 1.75 0 00-2.502-.57L.912 7.916a1.75 1.75 0 00-.53 2.32l.447.775a1.75 1.75 0 002.275.702l11.745-5.656a1.75 1.75 0 00.757-2.451l-1.422-2.464zm-1.657.669a.25.25 0 01.358.081l1.422 2.464a.25.25 0 01-.108.35l-2.016.97-1.505-2.605 1.85-1.26zM9.436 3.92l1.391 2.41-5.42 2.61-.942-1.63 4.97-3.39zM3.222 8.157l-1.466 1a.25.25 0 00-.075.33l.447.775a.25.25 0 00.325.1l1.598-.769-.83-1.436zm6.253 2.306a.75.75 0 00-.944-.252l-1.809.87a.75.75 0 00-.293.253L4.38 14.326a.75.75 0 101.238.848l1.881-2.75v2.826a.75.75 0 001.5 0v-2.826l1.881 2.75a.75.75 0 001.238-.848l-2.644-3.863z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M.408 15.13a2 2 0 01.59-2.642L17.038 1.33a2 2 0 012.85.602l2.828 4.644a2 2 0 01-.851 2.847l-17.762 8.43a2 2 0 01-2.59-.807L.408 15.13zm5.263-4.066l7.842-5.455 2.857 4.76-8.712 4.135-1.987-3.44zm-1.235.86L1.854 13.72a.5.5 0 00-.147.66l1.105 1.915a.5.5 0 00.648.201l2.838-1.347-1.862-3.225zm13.295-2.2L14.747 4.75l3.148-2.19a.5.5 0 01.713.151l2.826 4.644a.5.5 0 01-.212.712l-3.49 1.656z\"></path><path d=\"M17.155 22.87a.75.75 0 00.226-1.036l-4-6.239a.75.75 0 00-.941-.278l-2.75 1.25a.75.75 0 00-.318.274l-3.25 4.989a.75.75 0 001.256.819l3.131-4.806.51-.232v5.64a.75.75 0 101.5 0v-6.22l3.6 5.613a.75.75 0 001.036.226z\"></path>"
		}
	}
};
var terminal = {
	name: "terminal",
	keywords: [
		"code",
		"ops",
		"shell"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25V2.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H1.75zM7.25 8a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L5.44 8 3.72 6.28a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm1.5 1.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M9.25 12a.75.75 0 01-.22.53l-2.75 2.75a.75.75 0 01-1.06-1.06L7.44 12 5.22 9.78a.75.75 0 111.06-1.06l2.75 2.75c.141.14.22.331.22.53zm2 2a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5z\"></path><path fill-rule=\"evenodd\" d=\"M0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75zm1.75-.25a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H1.75z\"></path>"
		}
	}
};
var thumbsdown = {
	name: "thumbsdown",
	keywords: [
		"thumb",
		"thumbsdown",
		"rejected",
		"dislike"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.083 15.986c1.34.153 2.334-.982 2.334-2.183v-.5c0-1.329.646-2.123 1.317-2.614.329-.24.66-.403.919-.508a1.75 1.75 0 001.514.872h1a1.75 1.75 0 001.75-1.75v-7.5a1.75 1.75 0 00-1.75-1.75h-1a1.75 1.75 0 00-1.662 1.2c-.525-.074-1.068-.228-1.726-.415L9.305.705C8.151.385 6.765.053 4.917.053c-1.706 0-2.97.152-3.722 1.139-.353.463-.537 1.042-.669 1.672C.41 3.424.32 4.108.214 4.897l-.04.306c-.25 1.869-.266 3.318.188 4.316.244.537.622.943 1.136 1.2.495.248 1.066.334 1.669.334h1.422l-.015.112c-.07.518-.157 1.17-.157 1.638 0 .921.151 1.718.655 2.299.512.589 1.248.797 2.011.884zm4.334-13.232c-.706-.089-1.39-.284-2.072-.479a63.914 63.914 0 00-.441-.125c-1.096-.304-2.335-.597-3.987-.597-1.794 0-2.28.222-2.529.548-.147.193-.275.505-.393 1.07-.105.502-.188 1.124-.295 1.93l-.04.3c-.25 1.882-.19 2.933.067 3.497a.921.921 0 00.443.48c.208.104.52.175.997.175h1.75c.685 0 1.295.577 1.205 1.335-.022.192-.049.39-.075.586-.066.488-.13.97-.13 1.329 0 .808.144 1.15.288 1.316.137.157.401.303 1.048.377.307.035.664-.237.664-.693v-.5c0-1.922.978-3.127 1.932-3.825a5.862 5.862 0 011.568-.809V2.754zm1.75 6.798a.25.25 0 01-.25-.25v-7.5a.25.25 0 01.25-.25h1a.25.25 0 01.25.25v7.5a.25.25 0 01-.25.25h-1z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.596 21.957c-1.301.092-2.303-.986-2.303-2.206v-1.053c0-2.666-1.813-3.785-2.774-4.2a1.864 1.864 0 00-.523-.13A1.75 1.75 0 015.25 16h-1.5A1.75 1.75 0 012 14.25V3.75C2 2.784 2.784 2 3.75 2h1.5a1.75 1.75 0 011.742 1.58c.838-.06 1.667-.296 2.69-.586l.602-.17C11.748 2.419 13.497 2 15.828 2c2.188 0 3.693.204 4.583 1.372.422.554.65 1.255.816 2.05.148.708.262 1.57.396 2.58l.051.39c.319 2.386.328 4.18-.223 5.394-.293.644-.743 1.125-1.355 1.431-.59.296-1.284.404-2.036.404h-2.05l.056.429c.025.18.05.372.076.572.06.483.117 1.006.117 1.438 0 1.245-.222 2.253-.92 2.942-.684.674-1.668.879-2.743.955zM7 5.082c1.059-.064 2.079-.355 3.118-.651.188-.054.377-.108.568-.16 1.406-.392 3.006-.771 5.142-.771 2.277 0 3.004.274 3.39.781.216.283.388.718.54 1.448.136.65.242 1.45.379 2.477l.05.385c.32 2.398.253 3.794-.102 4.574-.16.352-.375.569-.66.711-.305.153-.74.245-1.365.245h-2.37c-.681 0-1.293.57-1.211 1.328.026.244.065.537.105.834l.07.527c.06.482.105.922.105 1.25 0 1.125-.213 1.617-.473 1.873-.275.27-.774.456-1.795.528-.351.024-.698-.274-.698-.71v-1.053c0-3.55-2.488-5.063-3.68-5.577A3.485 3.485 0 007 12.861V5.08zM3.75 3.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25h-1.5z\"></path>"
		}
	}
};
var thumbsup = {
	name: "thumbsup",
	keywords: [
		"thumb",
		"thumbsup",
		"prop",
		"ship",
		"like"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.834.066C7.494-.087 6.5 1.048 6.5 2.25v.5c0 1.329-.647 2.124-1.318 2.614-.328.24-.66.403-.918.508A1.75 1.75 0 002.75 5h-1A1.75 1.75 0 000 6.75v7.5C0 15.216.784 16 1.75 16h1a1.75 1.75 0 001.662-1.201c.525.075 1.067.229 1.725.415.152.043.31.088.475.133 1.154.32 2.54.653 4.388.653 1.706 0 2.97-.153 3.722-1.14.353-.463.537-1.042.668-1.672.118-.56.208-1.243.313-2.033l.04-.306c.25-1.869.265-3.318-.188-4.316a2.418 2.418 0 00-1.137-1.2C13.924 5.085 13.353 5 12.75 5h-1.422l.015-.113c.07-.518.157-1.17.157-1.637 0-.922-.151-1.719-.656-2.3-.51-.589-1.247-.797-2.01-.884zM4.5 13.3c.705.088 1.39.284 2.072.478l.441.125c1.096.305 2.334.598 3.987.598 1.794 0 2.28-.223 2.528-.549.147-.193.276-.505.394-1.07.105-.502.188-1.124.295-1.93l.04-.3c.25-1.882.189-2.933-.068-3.497a.922.922 0 00-.442-.48c-.208-.104-.52-.174-.997-.174H11c-.686 0-1.295-.577-1.206-1.336.023-.192.05-.39.076-.586.065-.488.13-.97.13-1.328 0-.809-.144-1.15-.288-1.316-.137-.158-.402-.304-1.048-.378C8.357 1.521 8 1.793 8 2.25v.5c0 1.922-.978 3.128-1.933 3.825a5.861 5.861 0 01-1.567.81V13.3zM2.75 6.5a.25.25 0 01.25.25v7.5a.25.25 0 01-.25.25h-1a.25.25 0 01-.25-.25v-7.5a.25.25 0 01.25-.25h1z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.596 2.043c-1.301-.092-2.303.986-2.303 2.206v1.053c0 2.666-1.813 3.785-2.774 4.2a1.866 1.866 0 01-.523.131A1.75 1.75 0 005.25 8h-1.5A1.75 1.75 0 002 9.75v10.5c0 .967.784 1.75 1.75 1.75h1.5a1.75 1.75 0 001.742-1.58c.838.06 1.667.296 2.69.586l.602.17c1.464.406 3.213.824 5.544.824 2.188 0 3.693-.204 4.583-1.372.422-.554.65-1.255.816-2.05.148-.708.262-1.57.396-2.58l.051-.39c.319-2.386.328-4.18-.223-5.394-.293-.644-.743-1.125-1.355-1.431-.59-.296-1.284-.404-2.036-.404h-2.05l.056-.429c.025-.18.05-.372.076-.572.06-.483.117-1.006.117-1.438 0-1.245-.222-2.253-.92-2.941-.684-.675-1.668-.88-2.743-.956zM7 18.918c1.059.064 2.079.355 3.118.652l.568.16c1.406.39 3.006.77 5.142.77 2.277 0 3.004-.274 3.39-.781.216-.283.388-.718.54-1.448.136-.65.242-1.45.379-2.477l.05-.384c.32-2.4.253-3.795-.102-4.575-.16-.352-.375-.568-.66-.711-.305-.153-.74-.245-1.365-.245h-2.37c-.681 0-1.293-.57-1.211-1.328.026-.243.065-.537.105-.834l.07-.527c.06-.482.105-.921.105-1.25 0-1.125-.213-1.617-.473-1.873-.275-.27-.774-.455-1.795-.528-.351-.024-.698.274-.698.71v1.053c0 3.55-2.488 5.063-3.68 5.577-.372.16-.754.232-1.113.26v7.78zM3.75 20.5a.25.25 0 01-.25-.25V9.75a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25h-1.5z\"></path>"
		}
	}
};
var tools = {
	name: "tools",
	keywords: [
		"screwdriver",
		"wrench",
		"settings"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5.433 2.304A4.494 4.494 0 003.5 6c0 1.598.832 3.002 2.09 3.802.518.328.929.923.902 1.64v.008l-.164 3.337a.75.75 0 11-1.498-.073l.163-3.33c.002-.085-.05-.216-.207-.316A5.996 5.996 0 012 6a5.994 5.994 0 012.567-4.92 1.482 1.482 0 011.673-.04c.462.296.76.827.76 1.423v2.82c0 .082.041.16.11.206l.75.51a.25.25 0 00.28 0l.75-.51A.25.25 0 009 5.282V2.463c0-.596.298-1.127.76-1.423a1.482 1.482 0 011.673.04A5.994 5.994 0 0114 6a5.996 5.996 0 01-2.786 5.068c-.157.1-.209.23-.207.315l.163 3.33a.75.75 0 11-1.498.074l-.164-3.345c-.027-.717.384-1.312.902-1.64A4.496 4.496 0 0012.5 6a4.494 4.494 0 00-1.933-3.696c-.024.017-.067.067-.067.16v2.818a1.75 1.75 0 01-.767 1.448l-.75.51a1.75 1.75 0 01-1.966 0l-.75-.51A1.75 1.75 0 015.5 5.282V2.463c0-.092-.043-.142-.067-.159zm.01-.005z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M7.875 2.292a.125.125 0 00-.032.018A7.24 7.24 0 004.75 8.25a7.247 7.247 0 003.654 6.297c.57.327.982.955.941 1.682v.002l-.317 6.058a.75.75 0 11-1.498-.078l.317-6.062v-.004c.006-.09-.047-.215-.188-.296A8.747 8.747 0 013.25 8.25a8.74 8.74 0 013.732-7.169 1.547 1.547 0 011.709-.064c.484.292.809.835.809 1.46v4.714a.25.25 0 00.119.213l2.25 1.385c.08.05.182.05.262 0l2.25-1.385a.25.25 0 00.119-.213V2.478c0-.626.325-1.169.81-1.461a1.547 1.547 0 011.708.064 8.74 8.74 0 013.732 7.17 8.747 8.747 0 01-4.41 7.598c-.14.081-.193.206-.188.296v.004l.318 6.062a.75.75 0 11-1.498.078l-.317-6.058v-.002c-.041-.727.37-1.355.94-1.682A7.247 7.247 0 0019.25 8.25a7.24 7.24 0 00-3.093-5.94.125.125 0 00-.032-.018l-.01-.001c-.003 0-.014 0-.031.01-.036.022-.084.079-.084.177V7.19a1.75 1.75 0 01-.833 1.49l-2.25 1.385a1.75 1.75 0 01-1.834 0l-2.25-1.384A1.75 1.75 0 018 7.192V2.477c0-.098-.048-.155-.084-.176a.062.062 0 00-.031-.011l-.01.001z\"></path>"
		}
	}
};
var trash = {
	name: "trash",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0a.25.25 0 01.25-.25h4.5a.25.25 0 01.25.25V3h-5V1.75z\"></path><path d=\"M4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z\"></path><path d=\"M9.206 7.501a.75.75 0 01.793.705l.5 8.5A.75.75 0 119 16.794l-.5-8.5a.75.75 0 01.705-.793zm6.293.793A.75.75 0 1014 8.206l-.5 8.5a.75.75 0 001.498.088l.5-8.5z\"></path>"
		}
	}
};
var trashcan = {
	name: "trashcan",
	keywords: [
		"garbage",
		"rubbish",
		"recycle",
		"delete"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z\"></path>"
		}
	}
};
var typography = {
	name: "typography",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.21 8.5L4.574 3.594 2.857 8.5H6.21zm.5 1.5l.829 2.487a.75.75 0 001.423-.474L5.735 2.332a1.216 1.216 0 00-2.302-.018l-3.39 9.688a.75.75 0 001.415.496L2.332 10H6.71zm3.13-4.358C10.53 4.374 11.87 4 13 4c1.5 0 3 .939 3 2.601v5.649a.75.75 0 01-1.448.275C13.995 12.82 13.3 13 12.5 13c-.77 0-1.514-.231-2.078-.709-.577-.488-.922-1.199-.922-2.041 0-.694.265-1.411.887-1.944C11 7.78 11.88 7.5 13 7.5h1.5v-.899c0-.54-.5-1.101-1.5-1.101-.869 0-1.528.282-1.84.858a.75.75 0 11-1.32-.716zM14.5 9H13c-.881 0-1.375.22-1.637.444-.253.217-.363.5-.363.806 0 .408.155.697.39.896.249.21.63.354 1.11.354.732 0 1.26-.209 1.588-.449.35-.257.412-.495.412-.551V9z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M10.414 15l1.63 4.505a.75.75 0 001.411-.51l-5.08-14.03a1.463 1.463 0 00-2.75 0l-5.08 14.03a.75.75 0 101.41.51L3.586 15h6.828zm-.544-1.5L7 5.572 4.13 13.5h5.74zm5.076-3.598c.913-1.683 2.703-2.205 4.284-2.205 1.047 0 2.084.312 2.878.885.801.577 1.392 1.455 1.392 2.548v8.12a.75.75 0 01-1.5 0v-.06a3.123 3.123 0 01-.044.025c-.893.52-2.096.785-3.451.785-1.051 0-2.048-.315-2.795-.948-.76-.643-1.217-1.578-1.217-2.702 0-.919.349-1.861 1.168-2.563.81-.694 2-1.087 3.569-1.087H22v-1.57c0-.503-.263-.967-.769-1.332-.513-.37-1.235-.6-2.001-.6-1.319 0-2.429.43-2.966 1.42a.75.75 0 01-1.318-.716zM22 14.2h-2.77c-1.331 0-2.134.333-2.593.726a1.82 1.82 0 00-.644 1.424c0 .689.267 1.203.686 1.557.43.365 1.065.593 1.826.593 1.183 0 2.102-.235 2.697-.581.582-.34.798-.74.798-1.134V14.2z\"></path>"
		}
	}
};
var unfold = {
	name: "unfold",
	keywords: [
		"expand",
		"open",
		"reveal"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 23a.75.75 0 01-.53-.22l-3.25-3.25a.75.75 0 111.06-1.06L12 21.19l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25A.75.75 0 0112 23z\"></path><path fill-rule=\"evenodd\" d=\"M12 22.25a.75.75 0 01-.75-.75v-5.75a.75.75 0 011.5 0v5.75a.75.75 0 01-.75.75zM10.75 12a.75.75 0 01.75-.75h1a.75.75 0 110 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM11.47 1.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 01-1.06 1.06L12 2.81 9.28 5.53a.75.75 0 01-1.06-1.06l3.25-3.25z\"></path><path fill-rule=\"evenodd\" d=\"M12 1.5a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6A.75.75 0 0112 1.5z\"></path>"
		}
	}
};
var unlock = {
	name: "unlock",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5.5 4a2.5 2.5 0 014.607-1.346.75.75 0 101.264-.808A4 4 0 004 4v2h-.501A1.5 1.5 0 002 7.5v6A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5v-6A1.5 1.5 0 0012.5 6h-7V4zm-.75 3.5H3.5v6h9v-6H4.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M7.5 7.25C7.5 4.58 9.422 2.5 12 2.5c2.079 0 3.71 1.34 4.282 3.242a.75.75 0 101.436-.432C16.971 2.825 14.792 1 12 1 8.503 1 6 3.845 6 7.25V9h-.5A2.5 2.5 0 003 11.5v8A2.5 2.5 0 005.5 22h13a2.5 2.5 0 002.5-2.5v-8A2.5 2.5 0 0018.5 9h-11V7.25zm-3 4.25a1 1 0 011-1h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1v-8z\"></path>"
		}
	}
};
var unmute = {
	name: "unmute",
	keywords: [
		"loud",
		"volume",
		"audio",
		"sound",
		"play"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.563 2.069A.75.75 0 018 2.75v10.5a.75.75 0 01-1.238.57L3.472 11H1.75A1.75 1.75 0 010 9.25v-2.5C0 5.784.784 5 1.75 5h1.723l3.289-2.82a.75.75 0 01.801-.111zM6.5 4.38L4.238 6.319a.75.75 0 01-.488.181h-2a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h2a.75.75 0 01.488.18L6.5 11.62V4.38zm6.096-2.038a.75.75 0 011.06 0 8 8 0 010 11.314.75.75 0 01-1.06-1.06 6.5 6.5 0 000-9.193.75.75 0 010-1.06v-.001zm-1.06 2.121a.75.75 0 10-1.061 1.061 3.5 3.5 0 010 4.95.75.75 0 101.06 1.06 5 5 0 000-7.07l.001-.001z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z\"></path><path d=\"M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z\"></path><path d=\"M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z\"></path>"
		}
	}
};
var unverified = {
	name: "unverified",
	keywords: [
		"insecure",
		"untrusted",
		"signed"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.415.52a2.678 2.678 0 013.17 0l.928.68c.153.113.33.186.518.215l1.138.175a2.678 2.678 0 012.241 2.24l.175 1.138c.029.187.102.365.215.518l.68.928a2.678 2.678 0 010 3.17l-.68.928a1.179 1.179 0 00-.215.518l-.175 1.138a2.678 2.678 0 01-2.241 2.241l-1.138.175a1.179 1.179 0 00-.518.215l-.928.68a2.678 2.678 0 01-3.17 0l-.928-.68a1.179 1.179 0 00-.518-.215L3.83 14.41a2.678 2.678 0 01-2.24-2.24l-.175-1.138a1.179 1.179 0 00-.215-.518l-.68-.928a2.678 2.678 0 010-3.17l.68-.928a1.17 1.17 0 00.215-.518l.175-1.14a2.678 2.678 0 012.24-2.24l1.138-.175c.187-.029.365-.102.518-.215l.928-.68zm2.282 1.209a1.178 1.178 0 00-1.394 0l-.928.68a2.678 2.678 0 01-1.18.489l-1.136.174a1.178 1.178 0 00-.987.987l-.174 1.137a2.678 2.678 0 01-.489 1.18l-.68.927c-.305.415-.305.98 0 1.394l.68.928c.256.348.423.752.489 1.18l.174 1.136c.078.51.478.909.987.987l1.137.174c.427.066.831.233 1.18.489l.927.68c.415.305.98.305 1.394 0l.928-.68a2.678 2.678 0 011.18-.489l1.136-.174c.51-.078.909-.478.987-.987l.174-1.137c.066-.427.233-.831.489-1.18l.68-.927c.305-.415.305-.98 0-1.394l-.68-.928a2.678 2.678 0 01-.489-1.18l-.174-1.136a1.178 1.178 0 00-.987-.987l-1.137-.174a2.678 2.678 0 01-1.18-.489l-.927-.68zM9 11a1 1 0 11-2 0 1 1 0 012 0zM6.92 6.085c.081-.16.19-.299.34-.398.145-.097.371-.187.74-.187.28 0 .553.087.738.225A.613.613 0 019 6.25c0 .177-.04.264-.077.318a.956.956 0 01-.277.245c-.076.051-.158.1-.258.161l-.007.004c-.093.056-.204.122-.313.195a2.416 2.416 0 00-.692.661.75.75 0 001.248.832.956.956 0 01.276-.245 6.3 6.3 0 01.26-.16l.006-.004c.093-.057.204-.123.313-.195.222-.149.487-.355.692-.662.214-.32.329-.702.329-1.15 0-.76-.36-1.348-.862-1.725A2.76 2.76 0 008 4c-.631 0-1.154.16-1.572.438-.413.276-.68.638-.849.977a.75.75 0 001.342.67z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M13 16.5a1 1 0 11-2 0 1 1 0 012 0zm-2.517-7.665c.112-.223.268-.424.488-.57C11.186 8.12 11.506 8 12 8c.384 0 .766.118 1.034.319a.953.953 0 01.403.806c0 .48-.218.81-.62 1.186a9.293 9.293 0 01-.409.354 19.8 19.8 0 00-.294.249c-.246.213-.524.474-.738.795l-.126.19V13.5a.75.75 0 001.5 0v-1.12c.09-.1.203-.208.347-.333.063-.055.14-.119.222-.187.166-.14.358-.3.52-.452.536-.5 1.098-1.2 1.098-2.283a2.45 2.45 0 00-1.003-2.006C13.37 6.695 12.658 6.5 12 6.5c-.756 0-1.373.191-1.861.517a2.944 2.944 0 00-.997 1.148.75.75 0 001.341.67z\"></path><path fill-rule=\"evenodd\" d=\"M9.864 1.2a3.61 3.61 0 014.272 0l1.375 1.01c.274.2.593.333.929.384l1.686.259a3.61 3.61 0 013.021 3.02l.259 1.687c.051.336.183.655.384.929l1.01 1.375a3.61 3.61 0 010 4.272l-1.01 1.375a2.11 2.11 0 00-.384.929l-.259 1.686a3.61 3.61 0 01-3.02 3.021l-1.687.259a2.11 2.11 0 00-.929.384l-1.375 1.01a3.61 3.61 0 01-4.272 0l-1.375-1.01a2.11 2.11 0 00-.929-.384l-1.686-.259a3.61 3.61 0 01-3.021-3.02l-.259-1.687a2.11 2.11 0 00-.384-.929L1.2 14.136a3.61 3.61 0 010-4.272l1.01-1.375a2.11 2.11 0 00.384-.929l.259-1.686a3.61 3.61 0 013.02-3.021l1.687-.259a2.11 2.11 0 00.929-.384L9.864 1.2zm3.384 1.209a2.11 2.11 0 00-2.496 0l-1.376 1.01a3.61 3.61 0 01-1.589.658l-1.686.258a2.11 2.11 0 00-1.766 1.766l-.258 1.686a3.61 3.61 0 01-.658 1.59l-1.01 1.375a2.11 2.11 0 000 2.496l1.01 1.376a3.61 3.61 0 01.658 1.589l.258 1.686a2.11 2.11 0 001.766 1.765l1.686.26a3.61 3.61 0 011.59.657l1.375 1.01a2.11 2.11 0 002.496 0l1.376-1.01a3.61 3.61 0 011.589-.658l1.686-.258a2.11 2.11 0 001.765-1.766l.26-1.686a3.61 3.61 0 01.657-1.59l1.01-1.375a2.11 2.11 0 000-2.496l-1.01-1.376a3.61 3.61 0 01-.658-1.589l-.258-1.686a2.11 2.11 0 00-1.766-1.766l-1.686-.258a3.61 3.61 0 01-1.59-.658l-1.375-1.01z\"></path>"
		}
	}
};
var upload = {
	name: "upload",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.53 1.22a.75.75 0 00-1.06 0L3.72 4.97a.75.75 0 001.06 1.06l2.47-2.47v6.69a.75.75 0 001.5 0V3.56l2.47 2.47a.75.75 0 101.06-1.06L8.53 1.22zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M4.97 12.97a.75.75 0 101.06 1.06L11 9.06v12.19a.75.75 0 001.5 0V9.06l4.97 4.97a.75.75 0 101.06-1.06l-6.25-6.25a.75.75 0 00-1.06 0l-6.25 6.25zM4.75 3.5a.75.75 0 010-1.5h14.5a.75.75 0 010 1.5H4.75z\"></path>"
		}
	}
};
var verified = {
	name: "verified",
	keywords: [
		"trusted",
		"secure",
		"trustworthy",
		"signed"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M9.585.52a2.678 2.678 0 00-3.17 0l-.928.68a1.178 1.178 0 01-.518.215L3.83 1.59a2.678 2.678 0 00-2.24 2.24l-.175 1.14a1.178 1.178 0 01-.215.518l-.68.928a2.678 2.678 0 000 3.17l.68.928c.113.153.186.33.215.518l.175 1.138a2.678 2.678 0 002.24 2.24l1.138.175c.187.029.365.102.518.215l.928.68a2.678 2.678 0 003.17 0l.928-.68a1.17 1.17 0 01.518-.215l1.138-.175a2.678 2.678 0 002.241-2.241l.175-1.138c.029-.187.102-.365.215-.518l.68-.928a2.678 2.678 0 000-3.17l-.68-.928a1.179 1.179 0 01-.215-.518L14.41 3.83a2.678 2.678 0 00-2.24-2.24l-1.138-.175a1.179 1.179 0 01-.518-.215L9.585.52zM7.303 1.728c.415-.305.98-.305 1.394 0l.928.68c.348.256.752.423 1.18.489l1.136.174c.51.078.909.478.987.987l.174 1.137c.066.427.233.831.489 1.18l.68.927c.305.415.305.98 0 1.394l-.68.928a2.678 2.678 0 00-.489 1.18l-.174 1.136a1.178 1.178 0 01-.987.987l-1.137.174a2.678 2.678 0 00-1.18.489l-.927.68c-.415.305-.98.305-1.394 0l-.928-.68a2.678 2.678 0 00-1.18-.489l-1.136-.174a1.178 1.178 0 01-.987-.987l-.174-1.137a2.678 2.678 0 00-.489-1.18l-.68-.927a1.178 1.178 0 010-1.394l.68-.928c.256-.348.423-.752.489-1.18l.174-1.136c.078-.51.478-.909.987-.987l1.137-.174a2.678 2.678 0 001.18-.489l.927-.68zM11.28 6.78a.75.75 0 00-1.06-1.06L7 8.94 5.78 7.72a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.75-3.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M17.03 9.78a.75.75 0 00-1.06-1.06l-5.47 5.47-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6-6z\"></path><path fill-rule=\"evenodd\" d=\"M14.136 1.2a3.61 3.61 0 00-4.272 0L8.489 2.21a2.11 2.11 0 01-.929.384l-1.686.259a3.61 3.61 0 00-3.021 3.02L2.594 7.56a2.11 2.11 0 01-.384.929L1.2 9.864a3.61 3.61 0 000 4.272l1.01 1.375c.2.274.333.593.384.929l.259 1.686a3.61 3.61 0 003.02 3.021l1.687.259c.336.051.655.183.929.384l1.375 1.01a3.61 3.61 0 004.272 0l1.375-1.01a2.11 2.11 0 01.929-.384l1.686-.259a3.61 3.61 0 003.021-3.02l.259-1.687a2.11 2.11 0 01.384-.929l1.01-1.375a3.61 3.61 0 000-4.272l-1.01-1.375a2.11 2.11 0 01-.384-.929l-.259-1.686a3.61 3.61 0 00-3.02-3.021l-1.687-.259a2.11 2.11 0 01-.929-.384L14.136 1.2zm-3.384 1.209a2.11 2.11 0 012.496 0l1.376 1.01a3.61 3.61 0 001.589.658l1.686.258a2.11 2.11 0 011.765 1.766l.26 1.686a3.61 3.61 0 00.657 1.59l1.01 1.375a2.11 2.11 0 010 2.496l-1.01 1.376a3.61 3.61 0 00-.658 1.589l-.258 1.686a2.11 2.11 0 01-1.766 1.765l-1.686.26a3.61 3.61 0 00-1.59.657l-1.375 1.01a2.11 2.11 0 01-2.496 0l-1.376-1.01a3.61 3.61 0 00-1.589-.658l-1.686-.258a2.11 2.11 0 01-1.766-1.766l-.258-1.686a3.61 3.61 0 00-.658-1.59l-1.01-1.375a2.11 2.11 0 010-2.496l1.01-1.376a3.61 3.61 0 00.658-1.589l.258-1.686a2.11 2.11 0 011.766-1.766l1.686-.258a3.61 3.61 0 001.59-.658l1.375-1.01z\"></path>"
		}
	}
};
var versions = {
	name: "versions",
	keywords: [
		"history",
		"commits"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.75 14A1.75 1.75 0 016 12.25v-8.5C6 2.784 6.784 2 7.75 2h6.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14h-6.5zm-.25-1.75c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25h-6.5a.25.25 0 00-.25.25v8.5zM4.9 3.508a.75.75 0 01-.274 1.025.25.25 0 00-.126.217v6.5a.25.25 0 00.126.217.75.75 0 01-.752 1.298A1.75 1.75 0 013 11.25v-6.5c0-.649.353-1.214.874-1.516a.75.75 0 011.025.274zM1.625 5.533a.75.75 0 10-.752-1.299A1.75 1.75 0 000 5.75v4.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217v-4.5a.25.25 0 01.126-.217z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M10 22a2 2 0 01-2-2V4a2 2 0 012-2h11a2 2 0 012 2v16a2 2 0 01-2 2H10zm-.5-2a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V4a.5.5 0 00-.5-.5H10a.5.5 0 00-.5.5v16zM6.17 4.165a.75.75 0 01-.335 1.006c-.228.114-.295.177-.315.201a.037.037 0 00-.008.016.387.387 0 00-.012.112v13c0 .07.008.102.012.112a.03.03 0 00.008.016c.02.024.087.087.315.201a.75.75 0 11-.67 1.342c-.272-.136-.58-.315-.81-.598C4.1 19.259 4 18.893 4 18.5v-13c0-.393.1-.759.355-1.073.23-.283.538-.462.81-.598a.75.75 0 011.006.336zM2.15 5.624a.75.75 0 01-.274 1.025c-.15.087-.257.17-.32.245C1.5 6.96 1.5 6.99 1.5 7v10c0 .01 0 .04.056.106.063.074.17.158.32.245a.75.75 0 11-.752 1.298C.73 18.421 0 17.907 0 17V7c0-.907.73-1.42 1.124-1.65a.75.75 0 011.025.274z\"></path>"
		}
	}
};
var video = {
	name: "video",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H1.75zM0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5z\"></path><path d=\"M6 10.559V5.442a.25.25 0 01.379-.215l4.264 2.559a.25.25 0 010 .428l-4.264 2.559A.25.25 0 016 10.559z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 4.5a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H1.75zM0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75z\"></path><path d=\"M9 15.584V8.416a.5.5 0 01.77-.42l5.576 3.583a.5.5 0 010 .842L9.77 16.005a.5.5 0 01-.77-.42z\"></path>"
		}
	}
};
var workflow = {
	name: "workflow",
	keywords: [
		"workflow",
		"actions"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 1.75C0 .784.784 0 1.75 0h3.5C6.216 0 7 .784 7 1.75v3.5A1.75 1.75 0 015.25 7H4v4a1 1 0 001 1h4v-1.25C9 9.784 9.784 9 10.75 9h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0114.25 16h-3.5A1.75 1.75 0 019 14.25v-.75H5A2.5 2.5 0 012.5 11V7h-.75A1.75 1.75 0 010 5.25v-3.5zm1.75-.25a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 00.25-.25v-3.5a.25.25 0 00-.25-.25h-3.5zm9 9a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 00.25-.25v-3.5a.25.25 0 00-.25-.25h-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1 3a2 2 0 012-2h6.5a2 2 0 012 2v6.5a2 2 0 01-2 2H7v4.063C7 16.355 7.644 17 8.438 17H12.5v-2.5a2 2 0 012-2H21a2 2 0 012 2V21a2 2 0 01-2 2h-6.5a2 2 0 01-2-2v-2.5H8.437A2.938 2.938 0 015.5 15.562V11.5H3a2 2 0 01-2-2V3zm2-.5a.5.5 0 00-.5.5v6.5a.5.5 0 00.5.5h6.5a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5H3zM14.5 14a.5.5 0 00-.5.5V21a.5.5 0 00.5.5H21a.5.5 0 00.5-.5v-6.5a.5.5 0 00-.5-.5h-6.5z\"></path>"
		}
	}
};
var x = {
	name: "x",
	keywords: [
		"remove",
		"close",
		"delete"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z\"></path>"
		}
	}
};
var zap = {
	name: "zap",
	keywords: [
		"electricity",
		"lightning",
		"props",
		"like",
		"star",
		"save"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M10.561 1.5a.016.016 0 00-.01.004L3.286 8.571A.25.25 0 003.462 9H6.75a.75.75 0 01.694 1.034l-1.713 4.188 6.982-6.793A.25.25 0 0012.538 7H9.25a.75.75 0 01-.683-1.06l2.008-4.418.003-.006a.02.02 0 00-.004-.009.02.02 0 00-.006-.006L10.56 1.5zM9.504.43a1.516 1.516 0 012.437 1.713L10.415 5.5h2.123c1.57 0 2.346 1.909 1.22 3.004l-7.34 7.142a1.25 1.25 0 01-.871.354h-.302a1.25 1.25 0 01-1.157-1.723L5.633 10.5H3.462c-1.57 0-2.346-1.909-1.22-3.004L9.503.429z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M16.168 2.924L4.51 13.061a.25.25 0 00.164.439h5.45a.75.75 0 01.692 1.041l-2.559 6.066 11.215-9.668a.25.25 0 00-.164-.439H14a.75.75 0 01-.687-1.05l2.855-6.526zm-.452-1.595a1.341 1.341 0 012.109 1.55L15.147 9h4.161c1.623 0 2.372 2.016 1.143 3.075L8.102 22.721a1.149 1.149 0 01-1.81-1.317L8.996 15H4.674c-1.619 0-2.37-2.008-1.148-3.07l12.19-10.6z\"></path>"
		}
	}
};
var data$1 = {
	alert: alert,
	archive: archive,
	"arrow-both": {
	name: "arrow-both",
	keywords: [
		"point",
		"direction",
		"left",
		"right"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.72 3.72a.75.75 0 011.06 1.06L2.56 7h10.88l-2.22-2.22a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M7.78 5.97a.75.75 0 00-1.06 0l-5.25 5.25a.75.75 0 000 1.06l5.25 5.25a.75.75 0 001.06-1.06L3.81 12.5h16.38l-3.97 3.97a.75.75 0 101.06 1.06l5.25-5.25a.75.75 0 000-1.06l-5.25-5.25a.75.75 0 10-1.06 1.06L20.19 11H3.81l3.97-3.97a.75.75 0 000-1.06z\"></path>"
		}
	}
},
	"arrow-down": {
	name: "arrow-down",
	keywords: [
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M13.03 8.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.47 9.28a.75.75 0 011.06-1.06l2.97 2.97V3.75a.75.75 0 011.5 0v7.44l2.97-2.97a.75.75 0 011.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4.97 13.22a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 10-1.06-1.06l-4.97 4.97V3.75a.75.75 0 00-1.5 0v14.44l-4.97-4.97a.75.75 0 00-1.06 0z\"></path>"
		}
	}
},
	"arrow-down-left": {
	name: "arrow-down-left",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.75 8.5a.75.75 0 00-.75.75v9c0 .414.336.75.75.75h9a.75.75 0 000-1.5H7.56L17.78 7.28a.75.75 0 00-1.06-1.06L6.5 16.44V9.25a.75.75 0 00-.75-.75z\"></path>"
		}
	}
},
	"arrow-down-right": {
	name: "arrow-down-right",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M18.25 8.5a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-9a.75.75 0 010-1.5h7.19L6.22 7.28a.75.75 0 011.06-1.06L17.5 16.44V9.25a.75.75 0 01.75-.75z\"></path>"
		}
	}
},
	"arrow-left": {
	name: "arrow-left",
	keywords: [
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M10.78 19.03a.75.75 0 01-1.06 0l-6.25-6.25a.75.75 0 010-1.06l6.25-6.25a.75.75 0 111.06 1.06L5.81 11.5h14.44a.75.75 0 010 1.5H5.81l4.97 4.97a.75.75 0 010 1.06z\"></path>"
		}
	}
},
	"arrow-right": {
	name: "arrow-right",
	keywords: [
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M13.22 19.03a.75.75 0 001.06 0l6.25-6.25a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 10-1.06 1.06l4.97 4.97H3.75a.75.75 0 000 1.5h14.44l-4.97 4.97a.75.75 0 000 1.06z\"></path>"
		}
	}
},
	"arrow-switch": {
	name: "arrow-switch",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M5.22 14.78a.75.75 0 001.06-1.06L4.56 12h8.69a.75.75 0 000-1.5H4.56l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3a.75.75 0 000 1.06l3 3zm5.56-6.5a.75.75 0 11-1.06-1.06l1.72-1.72H2.75a.75.75 0 010-1.5h8.69L9.72 2.28a.75.75 0 011.06-1.06l3 3a.75.75 0 010 1.06l-3 3z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M7.72 21.78a.75.75 0 001.06-1.06L5.56 17.5h14.69a.75.75 0 000-1.5H5.56l3.22-3.22a.75.75 0 10-1.06-1.06l-4.5 4.5a.75.75 0 000 1.06l4.5 4.5zm8.56-9.5a.75.75 0 11-1.06-1.06L18.44 8H3.75a.75.75 0 010-1.5h14.69l-3.22-3.22a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5z\"></path>"
		}
	}
},
	"arrow-up": {
	name: "arrow-up",
	keywords: [
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.47 7.78a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L9 4.81v7.44a.75.75 0 01-1.5 0V4.81L4.53 7.78a.75.75 0 01-1.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6.47 10.78a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L13 6.81v12.44a.75.75 0 01-1.5 0V6.81l-3.97 3.97a.75.75 0 01-1.06 0z\"></path>"
		}
	}
},
	"arrow-up-left": {
	name: "arrow-up-left",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.75 15.5a.75.75 0 01-.75-.75v-9A.75.75 0 015.75 5h9a.75.75 0 010 1.5H7.56l10.22 10.22a.75.75 0 11-1.06 1.06L6.5 7.56v7.19a.75.75 0 01-.75.75z\"></path>"
		}
	}
},
	"arrow-up-right": {
	name: "arrow-up-right",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M18.25 15.5a.75.75 0 00.75-.75v-9a.75.75 0 00-.75-.75h-9a.75.75 0 000 1.5h7.19L6.22 16.72a.75.75 0 101.06 1.06L17.5 7.56v7.19c0 .414.336.75.75.75z\"></path>"
		}
	}
},
	beaker: beaker,
	bell: bell,
	"bell-fill": {
	name: "bell-fill",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6 8a6 6 0 1112 0v2.917c0 .703.228 1.387.65 1.95L20.7 15.6a1.5 1.5 0 01-1.2 2.4h-15a1.5 1.5 0 01-1.2-2.4l2.05-2.733a3.25 3.25 0 00.65-1.95V8zm6 13.5A3.502 3.502 0 018.645 19h6.71A3.502 3.502 0 0112 21.5z\"></path>"
		}
	}
},
	"bell-slash": {
	name: "bell-slash",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 1.5c-.997 0-1.895.416-2.534 1.086A.75.75 0 014.38 1.55 5 5 0 0113 5v2.373a.75.75 0 01-1.5 0V5A3.5 3.5 0 008 1.5zM4.182 4.31L1.19 2.143a.75.75 0 10-.88 1.214L3 5.305v2.642a.25.25 0 01-.042.139L1.255 10.64A1.518 1.518 0 002.518 13h11.108l1.184.857a.75.75 0 10.88-1.214l-1.375-.996a1.196 1.196 0 00-.013-.01L4.198 4.321a.733.733 0 00-.016-.011zm7.373 7.19L4.5 6.391v1.556c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01.015.015 0 00.005.012.017.017 0 00.006.004l.007.001h9.037zM8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1.22 1.22a.75.75 0 011.06 0l20.5 20.5a.75.75 0 11-1.06 1.06L17.94 19H15.5a3.5 3.5 0 11-7 0H3.518a1.518 1.518 0 01-1.263-2.36l2.2-3.298A3.25 3.25 0 005 11.539V7c0-.294.025-.583.073-.866L1.22 2.28a.75.75 0 010-1.06zM10 19a2 2 0 104 0h-4zM6.5 7.56l9.94 9.94H3.517l-.007-.001-.006-.004-.004-.006-.001-.007.003-.01 2.2-3.298a4.75 4.75 0 00.797-2.635V7.56z\"></path><path d=\"M12 2.5c-1.463 0-2.8.485-3.788 1.257l-.04.032a.75.75 0 11-.935-1.173l.05-.04C8.548 1.59 10.212 1 12 1c3.681 0 7 2.565 7 6v4.539c0 .642.19 1.269.546 1.803l1.328 1.992a.75.75 0 11-1.248.832l-1.328-1.992a4.75 4.75 0 01-.798-2.635V7c0-2.364-2.383-4.5-5.5-4.5z\"></path>"
		}
	}
},
	bold: bold,
	book: book,
	bookmark: bookmark,
	"bookmark-fill": {
	name: "bookmark-fill",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6.69 2a1.75 1.75 0 00-1.75 1.756L5 21.253a.75.75 0 001.219.583L12 17.21l5.782 4.625A.75.75 0 0019 21.25V3.75A1.75 1.75 0 0017.25 2H6.69z\"></path>"
		}
	}
},
	"bookmark-slash": {
	name: "bookmark-slash",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.19 1.143a.75.75 0 10-.88 1.214L3 4.305v9.945a.75.75 0 001.206.596L8 11.944l3.794 2.902A.75.75 0 0013 14.25v-2.703l1.81 1.31a.75.75 0 10.88-1.214l-2.994-2.168a1.09 1.09 0 00-.014-.01L4.196 3.32a.712.712 0 00-.014-.01L1.19 1.143zM4.5 5.39v7.341l3.044-2.328a.75.75 0 01.912 0l3.044 2.328V10.46l-7-5.07zM5.865 1a.75.75 0 000 1.5h5.385a.25.25 0 01.25.25v3.624a.75.75 0 001.5 0V2.75A1.75 1.75 0 0011.25 1H5.865z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1.565 2.018a.75.75 0 00-.88 1.214L5 6.357v14.902a.75.75 0 001.219.585L12 17.21l5.781 4.633A.75.75 0 0019 21.259v-4.764l3.435 2.487a.75.75 0 10.88-1.215L1.565 2.017zM17.5 15.408l-11-7.965v12.254l5.031-4.032a.75.75 0 01.938 0l5.031 4.032v-4.288z\"></path><path d=\"M7.25 2a.75.75 0 000 1.5h10a.25.25 0 01.25.25v6.5a.75.75 0 001.5 0v-6.5A1.75 1.75 0 0017.25 2h-10z\"></path>"
		}
	}
},
	"bookmark-slash-fill": {
	name: "bookmark-slash-fill",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3.232 2.175a.75.75 0 10-.964 1.15l2.679 2.244L5 21.253a.75.75 0 001.219.583L12 17.21l5.782 4.625A.75.75 0 0019 21.25v-3.907l1.768 1.482a.75.75 0 10.964-1.15l-18.5-15.5zM7.422 2a.75.75 0 00-.482 1.325l10.828 9.073A.75.75 0 0019 11.823V3.75A1.75 1.75 0 0017.25 2H7.421h.001z\"></path>"
		}
	}
},
	briefcase: briefcase,
	broadcast: broadcast,
	browser: browser,
	bug: bug,
	calendar: calendar,
	check: check,
	"check-circle": {
	name: "check-circle",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM0 8a8 8 0 1116 0A8 8 0 010 8zm11.78-1.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M17.28 9.28a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
},
	"check-circle-fill": {
	name: "check-circle-fill",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm16.28-2.72a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z\"></path>"
		}
	}
},
	checklist: checklist,
	"chevron-down": {
	name: "chevron-down",
	keywords: [
		"triangle",
		"arrow"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.22 8.72a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00-1.06-1.06L12 14.44 6.28 8.72a.75.75 0 00-1.06 0z\"></path>"
		}
	}
},
	"chevron-left": {
	name: "chevron-left",
	keywords: [
		"triangle",
		"arrow"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M15.28 5.22a.75.75 0 00-1.06 0l-6.25 6.25a.75.75 0 000 1.06l6.25 6.25a.75.75 0 101.06-1.06L9.56 12l5.72-5.72a.75.75 0 000-1.06z\"></path>"
		}
	}
},
	"chevron-right": {
	name: "chevron-right",
	keywords: [
		"triangle",
		"arrow"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M8.72 18.78a.75.75 0 001.06 0l6.25-6.25a.75.75 0 000-1.06L9.78 5.22a.75.75 0 00-1.06 1.06L14.44 12l-5.72 5.72a.75.75 0 000 1.06z\"></path>"
		}
	}
},
	"chevron-up": {
	name: "chevron-up",
	keywords: [
		"triangle",
		"arrow"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.22 9.78a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L8 6.06 4.28 9.78a.75.75 0 01-1.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M18.78 15.28a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 00-1.06 0l-6.25 6.25a.75.75 0 101.06 1.06L12 9.56l5.72 5.72a.75.75 0 001.06 0z\"></path>"
		}
	}
},
	circle: circle,
	"circle-slash": {
	name: "circle-slash",
	keywords: [
		"no",
		"deny",
		"fail",
		"failure",
		"error",
		"bad"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 0110.535-5.096l-9.131 9.131A6.472 6.472 0 011.5 8zm2.465 5.096a6.5 6.5 0 009.131-9.131l-9.131 9.131zM8 0a8 8 0 100 16A8 8 0 008 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12A9.5 9.5 0 0112 2.5c2.353 0 4.507.856 6.166 2.273L4.773 18.166A9.462 9.462 0 012.5 12zm3.334 7.227A9.462 9.462 0 0012 21.5a9.5 9.5 0 009.5-9.5 9.462 9.462 0 00-2.273-6.166L5.834 19.227z\"></path>"
		}
	}
},
	clippy: clippy,
	clock: clock$1,
	code: code,
	"code-review": {
	name: "code-review",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25h-6.5a.75.75 0 00-.53.22L4.5 14.44v-2.19a.75.75 0 00-.75-.75h-2a.25.25 0 01-.25-.25v-8.5zM1.75 1A1.75 1.75 0 000 2.75v8.5C0 12.216.784 13 1.75 13H3v1.543a1.457 1.457 0 002.487 1.03L8.061 13h6.189A1.75 1.75 0 0016 11.25v-8.5A1.75 1.75 0 0014.25 1H1.75zm5.03 3.47a.75.75 0 010 1.06L5.31 7l1.47 1.47a.75.75 0 01-1.06 1.06l-2-2a.75.75 0 010-1.06l2-2a.75.75 0 011.06 0zm2.44 0a.75.75 0 000 1.06L10.69 7 9.22 8.47a.75.75 0 001.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M10.3 6.74a.75.75 0 01-.04 1.06l-2.908 2.7 2.908 2.7a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 011.06.04zm3.44 1.06a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.908-2.7-2.908-2.7z\"></path><path fill-rule=\"evenodd\" d=\"M1.5 4.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 01-1.75 1.75h-9.69l-3.573 3.573A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25zM3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.72-3.72a.75.75 0 01.53-.22h10a.25.25 0 00.25-.25V4.25a.25.25 0 00-.25-.25H3.25z\"></path>"
		}
	}
},
	"code-square": {
	name: "code-square",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm9.22 3.72a.75.75 0 000 1.06L10.69 8 9.22 9.47a.75.75 0 101.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0zM6.78 6.53a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 101.06-1.06L5.31 8l1.47-1.47z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M10.3 8.24a.75.75 0 01-.04 1.06L7.352 12l2.908 2.7a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 011.06.04zm3.44 1.06a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.908-2.7-2.908-2.7z\"></path><path fill-rule=\"evenodd\" d=\"M2 3.75C2 2.784 2.784 2 3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0120.25 22H3.75A1.75 1.75 0 012 20.25V3.75zm1.75-.25a.25.25 0 00-.25.25v16.5c0 .138.112.25.25.25h16.5a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H3.75z\"></path>"
		}
	}
},
	comment: comment,
	"comment-discussion": {
	name: "comment-discussion",
	keywords: [
		"converse",
		"talk"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 2.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-3.5a.75.75 0 00-.53.22L3.5 11.44V9.25a.75.75 0 00-.75-.75h-1a.25.25 0 01-.25-.25v-5.5zM1.75 1A1.75 1.75 0 000 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.457 1.457 0 002.487 1.03L7.061 10h3.189A1.75 1.75 0 0012 8.25v-5.5A1.75 1.75 0 0010.25 1h-8.5zM14.5 4.75a.25.25 0 00-.25-.25h-.5a.75.75 0 110-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0114.25 12H14v1.543a1.457 1.457 0 01-2.487 1.03L9.22 12.28a.75.75 0 111.06-1.06l2.22 2.22v-2.19a.75.75 0 01.75-.75h1a.25.25 0 00.25-.25v-5.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 1A1.75 1.75 0 000 2.75v9.5C0 13.216.784 14 1.75 14H3v1.543a1.457 1.457 0 002.487 1.03L8.061 14h6.189A1.75 1.75 0 0016 12.25v-9.5A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v9.5a.25.25 0 01-.25.25h-6.5a.75.75 0 00-.53.22L4.5 15.44v-2.19a.75.75 0 00-.75-.75h-2a.25.25 0 01-.25-.25v-9.5z\"></path><path d=\"M22.5 8.75a.25.25 0 00-.25-.25h-3.5a.75.75 0 010-1.5h3.5c.966 0 1.75.784 1.75 1.75v9.5A1.75 1.75 0 0122.25 20H21v1.543a1.457 1.457 0 01-2.487 1.03L15.939 20H10.75A1.75 1.75 0 019 18.25v-1.465a.75.75 0 011.5 0v1.465c0 .138.112.25.25.25h5.5a.75.75 0 01.53.22l2.72 2.72v-2.19a.75.75 0 01.75-.75h2a.25.25 0 00.25-.25v-9.5z\"></path>"
		}
	}
},
	commit: commit,
	container: container,
	copy: copy,
	cpu: cpu,
	"credit-card": {
	name: "credit-card",
	keywords: [
		"money",
		"billing",
		"payments",
		"transactions"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M10.75 9a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z\"></path><path fill-rule=\"evenodd\" d=\"M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5zm14.5 0V5h-13V3.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25zm0 2.75h-13v5.75c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V6.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M15.25 14a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z\"></path><path fill-rule=\"evenodd\" d=\"M1.75 3A1.75 1.75 0 000 4.75v14.5C0 20.216.784 21 1.75 21h20.5A1.75 1.75 0 0024 19.25V4.75A1.75 1.75 0 0022.25 3H1.75zM1.5 4.75a.25.25 0 01.25-.25h20.5a.25.25 0 01.25.25V8.5h-21V4.75zm0 5.25v9.25c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V10h-21z\"></path>"
		}
	}
},
	"cross-reference": {
	name: "cross-reference",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M16 1.25v4.146a.25.25 0 01-.427.177L14.03 4.03l-3.75 3.75a.75.75 0 11-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0111.604 1h4.146a.25.25 0 01.25.25zM2.75 3.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-2.5a.75.75 0 111.5 0v2.5A1.75 1.75 0 0113.25 13H9.06l-2.573 2.573A1.457 1.457 0 014 14.543V13H2.75A1.75 1.75 0 011 11.25v-7.5C1 2.784 1.784 2 2.75 2h5.5a.75.75 0 010 1.5h-5.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M16.5 2.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.06l-6.22 6.22a.75.75 0 11-1.06-1.06L20.94 3h-3.69a.75.75 0 01-.75-.75z\"></path><path d=\"M3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.72-3.72a.75.75 0 01.53-.22h10a.25.25 0 00.25-.25v-6a.75.75 0 011.5 0v6a1.75 1.75 0 01-1.75 1.75h-9.69l-3.573 3.573A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25c0-.966.784-1.75 1.75-1.75h11a.75.75 0 010 1.5h-11z\"></path>"
		}
	}
},
	dash: dash,
	database: database,
	"desktop-download": {
	name: "desktop-download",
	keywords: [
		"clone",
		"download"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M4.927 5.427l2.896 2.896a.25.25 0 00.354 0l2.896-2.896A.25.25 0 0010.896 5H8.75V.75a.75.75 0 10-1.5 0V5H5.104a.25.25 0 00-.177.427z\"></path><path d=\"M1.573 2.573a.25.25 0 00-.073.177v7.5a.25.25 0 00.25.25h12.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-3a.75.75 0 110-1.5h3A1.75 1.75 0 0116 2.75v7.5A1.75 1.75 0 0114.25 12h-3.727c.099 1.041.52 1.872 1.292 2.757A.75.75 0 0111.25 16h-6.5a.75.75 0 01-.565-1.243c.772-.885 1.192-1.716 1.292-2.757H1.75A1.75 1.75 0 010 10.25v-7.5A1.75 1.75 0 011.75 1h3a.75.75 0 010 1.5h-3a.25.25 0 00-.177.073zM6.982 12a5.72 5.72 0 01-.765 2.5h3.566a5.72 5.72 0 01-.765-2.5H6.982z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M11.25 9.331V.75a.75.75 0 011.5 0v8.58l1.949-2.11A.75.75 0 1115.8 8.237l-3.25 3.52a.75.75 0 01-1.102 0l-3.25-3.52A.75.75 0 119.3 7.22l1.949 2.111z\"></path><path fill-rule=\"evenodd\" d=\"M2.5 3.75a.25.25 0 01.25-.25h5.5a.75.75 0 100-1.5h-5.5A1.75 1.75 0 001 3.75v11.5c0 .966.784 1.75 1.75 1.75h6.204c-.171 1.375-.805 2.652-1.77 3.757A.75.75 0 007.75 22h8.5a.75.75 0 00.565-1.243c-.964-1.105-1.598-2.382-1.769-3.757h6.204A1.75 1.75 0 0023 15.25V3.75A1.75 1.75 0 0021.25 2h-5.5a.75.75 0 000 1.5h5.5a.25.25 0 01.25.25v11.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V3.75zM10.463 17c-.126 1.266-.564 2.445-1.223 3.5h5.52c-.66-1.055-1.098-2.234-1.223-3.5h-3.074z\"></path>"
		}
	}
},
	"device-camera": {
	name: "device-camera",
	keywords: [
		"photo",
		"picture",
		"image",
		"snapshot"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M15 3H7c0-.55-.45-1-1-1H2c-.55 0-1 .45-1 1-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM6 5H2V4h4v1zm4.5 7C8.56 12 7 10.44 7 8.5S8.56 5 10.5 5 14 6.56 14 8.5 12.44 12 10.5 12zM13 8.5c0 1.38-1.13 2.5-2.5 2.5S8 9.87 8 8.5 9.13 6 10.5 6 13 7.13 13 8.5z\"></path>"
		}
	}
},
	"device-camera-video": {
	name: "device-camera-video",
	keywords: [
		"watch",
		"view",
		"media",
		"stream"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M16 3.75a.75.75 0 00-1.136-.643L11 5.425V4.75A1.75 1.75 0 009.25 3h-7.5A1.75 1.75 0 000 4.75v6.5C0 12.216.784 13 1.75 13h7.5A1.75 1.75 0 0011 11.25v-.675l3.864 2.318A.75.75 0 0016 12.25v-8.5zm-5 5.075l3.5 2.1v-5.85l-3.5 2.1v1.65zM9.5 6.75v-2a.25.25 0 00-.25-.25h-7.5a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-4.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M24 5.25a.75.75 0 00-1.136-.643L16.5 8.425V6.25a1.75 1.75 0 00-1.75-1.75h-13A1.75 1.75 0 000 6.25v11C0 18.216.784 19 1.75 19h13a1.75 1.75 0 001.75-1.75v-2.175l6.364 3.818A.75.75 0 0024 18.25v-13zm-7.5 8.075l6 3.6V6.575l-6 3.6v3.15zM15 9.75v-3.5a.25.25 0 00-.25-.25h-13a.25.25 0 00-.25.25v11c0 .138.112.25.25.25h13a.25.25 0 00.25-.25v-7.5z\"></path>"
		}
	}
},
	"device-desktop": {
	name: "device-desktop",
	keywords: [
		"computer",
		"monitor"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 2.5h12.5a.25.25 0 01.25.25v7.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25v-7.5a.25.25 0 01.25-.25zM14.25 1H1.75A1.75 1.75 0 000 2.75v7.5C0 11.216.784 12 1.75 12h3.727c-.1 1.041-.52 1.872-1.292 2.757A.75.75 0 004.75 16h6.5a.75.75 0 00.565-1.243c-.772-.885-1.193-1.716-1.292-2.757h3.727A1.75 1.75 0 0016 10.25v-7.5A1.75 1.75 0 0014.25 1zM9.018 12H6.982a5.72 5.72 0 01-.765 2.5h3.566a5.72 5.72 0 01-.765-2.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M8.954 17H2.75A1.75 1.75 0 011 15.25V3.75C1 2.784 1.784 2 2.75 2h18.5c.966 0 1.75.784 1.75 1.75v11.5A1.75 1.75 0 0121.25 17h-6.204c.171 1.375.805 2.652 1.769 3.757A.75.75 0 0116.25 22h-8.5a.75.75 0 01-.565-1.243c.964-1.105 1.598-2.382 1.769-3.757zM21.5 3.75v11.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V3.75a.25.25 0 01.25-.25h18.5a.25.25 0 01.25.25zM13.537 17c.125 1.266.564 2.445 1.223 3.5H9.24c.659-1.055 1.097-2.234 1.223-3.5h3.074z\"></path>"
		}
	}
},
	"device-mobile": {
	name: "device-mobile",
	keywords: [
		"phone",
		"iphone",
		"cellphone"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.75 0A1.75 1.75 0 002 1.75v12.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 14.25V1.75A1.75 1.75 0 0012.25 0h-8.5zM3.5 1.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25V1.75zM8 13a1 1 0 100-2 1 1 0 000 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M10.25 5.25A.75.75 0 0111 4.5h2A.75.75 0 0113 6h-2a.75.75 0 01-.75-.75zM12 19.5a1 1 0 100-2 1 1 0 000 2z\"></path><path fill-rule=\"evenodd\" d=\"M4 2.75C4 1.784 4.784 1 5.75 1h12.5c.966 0 1.75.784 1.75 1.75v18.5A1.75 1.75 0 0118.25 23H5.75A1.75 1.75 0 014 21.25V2.75zm1.75-.25a.25.25 0 00-.25.25v18.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H5.75z\"></path>"
		}
	}
},
	diff: diff,
	"diff-added": {
	name: "diff-added",
	keywords: [
		"new",
		"addition",
		"plus"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M13.25 2.5H2.75a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25zM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25V2.75C1 1.784 1.784 1 2.75 1zM8 4a.75.75 0 01.75.75v2.5h2.5a.75.75 0 010 1.5h-2.5v2.5a.75.75 0 01-1.5 0v-2.5h-2.5a.75.75 0 010-1.5h2.5v-2.5A.75.75 0 018 4z\"></path>"
		}
	}
},
	"diff-ignored": {
	name: "diff-ignored",
	keywords: [
		"slash"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zm-1.97 4.78a.75.75 0 00-1.06-1.06l-5.5 5.5a.75.75 0 101.06 1.06l5.5-5.5z\"></path>"
		}
	}
},
	"diff-modified": {
	name: "diff-modified",
	keywords: [
		"dot",
		"changed",
		"updated"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zM8 10a2 2 0 100-4 2 2 0 000 4z\"></path>"
		}
	}
},
	"diff-removed": {
	name: "diff-removed",
	keywords: [
		"deleted",
		"subtracted",
		"dash"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zm-2 7.75a.75.75 0 000-1.5h-6.5a.75.75 0 000 1.5h6.5z\"></path>"
		}
	}
},
	"diff-renamed": {
	name: "diff-renamed",
	keywords: [
		"moved",
		"arrow"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zm-1.47 7.53a.75.75 0 000-1.06L8.53 4.22a.75.75 0 00-1.06 1.06l1.97 1.97H4.75a.75.75 0 000 1.5h4.69l-1.97 1.97a.75.75 0 101.06 1.06l3.25-3.25z\"></path>"
		}
	}
},
	dot: dot,
	"dot-fill": {
	name: "dot-fill",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 4a4 4 0 100 8 4 4 0 000-8z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12 18a6 6 0 100-12 6 6 0 000 12z\"></path>"
		}
	}
},
	download: download,
	ellipsis: ellipsis,
	eye: eye,
	"eye-closed": {
	name: "eye-closed",
	keywords: [
		"hidden",
		"invisible",
		"concealed",
		""
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M.143 2.31a.75.75 0 011.047-.167l14.5 10.5a.75.75 0 11-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.618 1.618 0 010-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 01.143 2.31zm3.386 3.378a14.21 14.21 0 00-1.85 2.244.12.12 0 00-.022.068c0 .021.006.045.022.068.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 016.058 7.52l-2.53-1.832zM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 11-.473-1.423A6.23 6.23 0 018 2c1.981 0 3.67.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.619 1.619 0 010 1.798c-.11.166-.248.365-.41.587a.75.75 0 11-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 000-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M8.052 5.837A9.715 9.715 0 0112 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.11.11 0 01.016.055.122.122 0 01-.017.06 16.766 16.766 0 01-1.53 2.218.75.75 0 101.163.946 18.253 18.253 0 001.67-2.42 1.607 1.607 0 00.001-1.602c-.485-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5c-1.695 0-3.215.374-4.552.963a.75.75 0 00.604 1.373z\"></path><path fill-rule=\"evenodd\" d=\"M19.166 17.987C17.328 19.38 14.933 20.5 12 20.5c-3.432 0-6.125-1.534-8.054-3.24C2.02 15.556.814 13.648.33 12.798a1.606 1.606 0 01.001-1.6A18.305 18.305 0 013.648 7.01L1.317 5.362a.75.75 0 11.866-1.224l20.5 14.5a.75.75 0 11-.866 1.224l-2.651-1.875zM4.902 7.898c-1.73 1.541-2.828 3.273-3.268 4.044a.118.118 0 00-.017.059c0 .015.003.034.016.055.441.774 1.551 2.527 3.307 4.08C6.69 17.685 9.045 19 12 19c2.334 0 4.29-.82 5.874-1.927l-3.516-2.487a3.5 3.5 0 01-5.583-3.949L4.902 7.899z\"></path>"
		}
	}
},
	file: file,
	"file-badge": {
	name: "file-badge",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M2.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h3.5a.75.75 0 010 1.5h-3.5A1.75 1.75 0 011 13.25V1.75C1 .784 1.784 0 2.75 0h8a1.75 1.75 0 011.508.862.75.75 0 11-1.289.768.25.25 0 00-.219-.13h-8z\"></path><path fill-rule=\"evenodd\" d=\"M8 7a4 4 0 116.49 3.13l.995 4.973a.75.75 0 01-.991.852l-2.409-.876a.25.25 0 00-.17 0l-2.409.876a.75.75 0 01-.991-.852l.994-4.973A3.993 3.993 0 018 7zm4-2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm0 6.5a4 4 0 001.104-.154l.649 3.243-1.155-.42c-.386-.14-.81-.14-1.196 0l-1.155.42.649-3.243A4 4 0 0012 11z\"></path>"
		}
	}
},
	"file-binary": {
	name: "file-binary",
	keywords: [
		"image",
		"video",
		"word",
		"powerpoint",
		"excel"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0114.25 15h-9a.75.75 0 010-1.5h9a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 0110 4.25V1.5H5.75a.25.25 0 00-.25.25v2a.75.75 0 01-1.5 0v-2zm7.5-.188V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013l-2.914-2.914a.272.272 0 00-.013-.011zM0 7.75C0 6.784.784 6 1.75 6h1.5C4.216 6 5 6.784 5 7.75v2.5A1.75 1.75 0 013.25 12h-1.5A1.75 1.75 0 010 10.25v-2.5zm1.75-.25a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25h-1.5zm5-1.5a.75.75 0 000 1.5h.75v3h-.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5H9V6.75A.75.75 0 008.25 6h-1.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3 3a2 2 0 012-2h9.982a2 2 0 011.414.586l4.018 4.018A2 2 0 0121 7.018V21a2 2 0 01-2 2H4.75a.75.75 0 010-1.5H19a.5.5 0 00.5-.5V8.5h-4a2 2 0 01-2-2v-4H5a.5.5 0 00-.5.5v6.25a.75.75 0 01-1.5 0V3zm12-.5v4a.5.5 0 00.5.5h4a.5.5 0 00-.146-.336l-4.018-4.018A.5.5 0 0015 2.5z\"></path><path fill-rule=\"evenodd\" d=\"M0 13.75C0 12.784.784 12 1.75 12h3c.966 0 1.75.784 1.75 1.75v4a1.75 1.75 0 01-1.75 1.75h-3A1.75 1.75 0 010 17.75v-4zm1.75-.25a.25.25 0 00-.25.25v4c0 .138.112.25.25.25h3a.25.25 0 00.25-.25v-4a.25.25 0 00-.25-.25h-3z\"></path><path d=\"M9 12a.75.75 0 000 1.5h1.5V18H9a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5H12v-5.25a.75.75 0 00-.75-.75H9z\"></path>"
		}
	}
},
	"file-code": {
	name: "file-code",
	keywords: [
		"text",
		"javascript",
		"html",
		"css",
		"php",
		"ruby",
		"coffeescript",
		"sass",
		"scss"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0114.25 15h-9a.75.75 0 010-1.5h9a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 0110 4.25V1.5H5.75a.25.25 0 00-.25.25v2.5a.75.75 0 01-1.5 0v-2.5zm7.5-.188V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013l-2.914-2.914a.272.272 0 00-.013-.011zM5.72 6.72a.75.75 0 000 1.06l1.47 1.47-1.47 1.47a.75.75 0 101.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0zM3.28 7.78a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 001.06-1.06L1.81 9.25l1.47-1.47z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3 3a2 2 0 012-2h9.982a2 2 0 011.414.586l4.018 4.018A2 2 0 0121 7.018V21a2 2 0 01-2 2H4.75a.75.75 0 010-1.5H19a.5.5 0 00.5-.5V8.5h-4a2 2 0 01-2-2v-4H5a.5.5 0 00-.5.5v6.25a.75.75 0 01-1.5 0V3zm12-.5v4a.5.5 0 00.5.5h4a.5.5 0 00-.146-.336l-4.018-4.018A.5.5 0 0015 2.5z\"></path><path d=\"M4.53 12.24a.75.75 0 01-.039 1.06l-2.639 2.45 2.64 2.45a.75.75 0 11-1.022 1.1l-3.23-3a.75.75 0 010-1.1l3.23-3a.75.75 0 011.06.04zm3.979 1.06a.75.75 0 111.02-1.1l3.231 3a.75.75 0 010 1.1l-3.23 3a.75.75 0 11-1.021-1.1l2.639-2.45-2.64-2.45z\"></path>"
		}
	}
},
	"file-diff": {
	name: "file-diff",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177l-2.914-2.914a.25.25 0 00-.177-.073H2.75zM1 1.75C1 .784 1.784 0 2.75 0h7.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V1.75zm7 1.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0V7h-1.5a.75.75 0 010-1.5h1.5V4A.75.75 0 018 3.25zm-3 8a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12.5 6.75a.75.75 0 00-1.5 0V9H8.75a.75.75 0 000 1.5H11v2.25a.75.75 0 001.5 0V10.5h2.25a.75.75 0 000-1.5H12.5V6.75zM8.75 16a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z\"></path><path fill-rule=\"evenodd\" d=\"M5 1a2 2 0 00-2 2v18a2 2 0 002 2h14a2 2 0 002-2V7.018a2 2 0 00-.586-1.414l-4.018-4.018A2 2 0 0014.982 1H5zm-.5 2a.5.5 0 01.5-.5h9.982a.5.5 0 01.354.146l4.018 4.018a.5.5 0 01.146.354V21a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V3z\"></path>"
		}
	}
},
	"file-directory": {
	name: "file-directory",
	keywords: [
		"folder"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3.75 4.5a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h16.5a.25.25 0 00.25-.25V7.687a.25.25 0 00-.25-.25h-8.471a1.75 1.75 0 01-1.447-.765L8.928 4.61a.25.25 0 00-.208-.11H3.75zM2 4.75C2 3.784 2.784 3 3.75 3h4.971c.58 0 1.12.286 1.447.765l1.404 2.063a.25.25 0 00.207.11h8.471c.966 0 1.75.783 1.75 1.75V19.25A1.75 1.75 0 0120.25 21H3.75A1.75 1.75 0 012 19.25V4.75z\"></path>"
		}
	}
},
	"file-directory-fill": {
	name: "file-directory-fill",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M2 4.75C2 3.784 2.784 3 3.75 3h4.971c.58 0 1.12.286 1.447.765l1.404 2.063a.25.25 0 00.207.11h8.471c.966 0 1.75.783 1.75 1.75V19.25A1.75 1.75 0 0120.25 21H3.75A1.75 1.75 0 012 19.25V4.75z\"></path>"
		}
	}
},
	"file-media": {
	name: "file-media",
	keywords: [
		"image",
		"video",
		"audio"
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M2.25 4a.25.25 0 00-.25.25v15.5c0 .138.112.25.25.25h3.178L14 10.977a1.75 1.75 0 012.506-.032L22 16.44V4.25a.25.25 0 00-.25-.25H2.25zm3.496 17.5H21.75a1.75 1.75 0 001.75-1.75V4.25a1.75 1.75 0 00-1.75-1.75H2.25A1.75 1.75 0 00.5 4.25v15.5c0 .966.784 1.75 1.75 1.75h3.496zM22 19.75v-1.19l-6.555-6.554a.25.25 0 00-.358.004L7.497 20H21.75a.25.25 0 00.25-.25zM9 9.25a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zm1.5 0a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0z\"></path>"
		}
	}
},
	"file-submodule": {
	name: "file-submodule",
	keywords: [
		"folder"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 2.75C0 1.784.784 1 1.75 1H5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 00.2.1h6.75c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25V2.75zm9.42 9.36l2.883-2.677a.25.25 0 000-.366L9.42 6.39a.25.25 0 00-.42.183V8.5H4.75a.75.75 0 100 1.5H9v1.927c0 .218.26.331.42.183z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M2 4.75C2 3.784 2.784 3 3.75 3h4.965a1.75 1.75 0 011.456.78l1.406 2.109a.25.25 0 00.208.111h8.465c.966 0 1.75.784 1.75 1.75v11.5A1.75 1.75 0 0120.25 21H3.75A1.75 1.75 0 012 19.25V4.75zm12.78 4.97a.75.75 0 10-1.06 1.06l1.72 1.72H6.75a.75.75 0 000 1.5h8.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3z\"></path>"
		}
	}
},
	"file-symlink-file": {
	name: "file-symlink-file",
	keywords: [
		"link",
		"alias"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2 1.75C2 .784 2.784 0 3.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0112.25 15h-7a.75.75 0 010-1.5h7a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75a.25.25 0 00-.25.25V4.5a.75.75 0 01-1.5 0V1.75zm7.5-.188V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013L9.513 1.573a.248.248 0 00-.013-.011zm-8 10.675a2.25 2.25 0 012.262-2.25L4 9.99v1.938c0 .218.26.331.42.183l2.883-2.677a.25.25 0 000-.366L4.42 6.39a.25.25 0 00-.42.183V8.49l-.23-.001A3.75 3.75 0 000 12.238v1.012a.75.75 0 001.5 0v-1.013z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3 3a2 2 0 012-2h9.982a2 2 0 011.414.586l4.018 4.018A2 2 0 0121 7.018V21a2 2 0 01-2 2H4.75a.75.75 0 010-1.5H19a.5.5 0 00.5-.5V8.5h-4a2 2 0 01-2-2v-4H5a.5.5 0 00-.5.5v6.25a.75.75 0 01-1.5 0V3zm12-.5v4a.5.5 0 00.5.5h4a.5.5 0 00-.146-.336l-4.018-4.018A.5.5 0 0015 2.5zm-5.692 12l-2.104-2.236a.75.75 0 111.092-1.028l3.294 3.5a.75.75 0 010 1.028l-3.294 3.5a.75.75 0 11-1.092-1.028L9.308 16H4.09a2.59 2.59 0 00-2.59 2.59v3.16a.75.75 0 01-1.5 0v-3.16a4.09 4.09 0 014.09-4.09h5.218z\"></path>"
		}
	}
},
	"file-zip": {
	name: "file-zip",
	keywords: [
		"compress",
		"archive"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M5 2.5a.5.5 0 00-.5.5v18a.5.5 0 00.5.5h1.75a.75.75 0 010 1.5H5a2 2 0 01-2-2V3a2 2 0 012-2h9.982a2 2 0 011.414.586l4.018 4.018A2 2 0 0121 7.018V21a2 2 0 01-2 2h-2.75a.75.75 0 010-1.5H19a.5.5 0 00.5-.5V7.018a.5.5 0 00-.146-.354l-4.018-4.018a.5.5 0 00-.354-.146H5z\"></path><path d=\"M11.5 15.75a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm.75-3.75a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zm-.75-2.25a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM12.25 6a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zm-.75-2.25a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM9.75 13.5a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zM9 11.25a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm.75-3.75a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zM9 5.25a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 019 5.25z\"></path><path fill-rule=\"evenodd\" d=\"M11 17a2 2 0 00-2 2v4.25c0 .414.336.75.75.75h3.5a.75.75 0 00.75-.75V19a2 2 0 00-2-2h-1zm-.5 2a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v3.5h-2V19z\"></path>"
		}
	}
},
	filter: filter$1,
	flame: flame,
	fold: fold,
	"fold-down": {
	name: "fold-down",
	keywords: [
		"unfold",
		"hide",
		"collapse",
		"down"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M8.177 14.323l2.896-2.896a.25.25 0 00-.177-.427H8.75V7.764a.75.75 0 10-1.5 0V11H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0zM2.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zM8.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 19a.75.75 0 01-.53-.22l-3.25-3.25a.75.75 0 111.06-1.06L12 17.19l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25A.75.75 0 0112 19z\"></path><path fill-rule=\"evenodd\" d=\"M12 18a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5A.75.75 0 0112 18zM10.75 6a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 012.75 6zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 016.75 6zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75z\"></path>"
		}
	}
},
	"fold-up": {
	name: "fold-up",
	keywords: [
		"unfold",
		"hide",
		"collapse",
		"up"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M7.823 1.677L4.927 4.573A.25.25 0 005.104 5H7.25v3.236a.75.75 0 101.5 0V5h2.146a.25.25 0 00.177-.427L8.177 1.677a.25.25 0 00-.354 0zM13.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zm-3.75.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM7.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM4 11.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM1.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M11.47 5.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 01-1.06 1.06L12 6.81 9.28 9.53a.75.75 0 01-1.06-1.06l3.25-3.25z\"></path><path fill-rule=\"evenodd\" d=\"M12 5.5a.75.75 0 01.75.75v8a.75.75 0 01-1.5 0v-8A.75.75 0 0112 5.5zM10.75 18a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75z\"></path>"
		}
	}
},
	gear: gear,
	gift: gift,
	"git-branch": {
	name: "git-branch",
	keywords: [
		"fork",
		"branch",
		"git",
		"duplicate"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.75 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 19.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM5.75 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z\"></path><path fill-rule=\"evenodd\" d=\"M5.75 16.75A.75.75 0 006.5 16V8A.75.75 0 005 8v8c0 .414.336.75.75.75z\"></path><path fill-rule=\"evenodd\" d=\"M17.5 8.75v-1H19v1a3.75 3.75 0 01-3.75 3.75h-7a1.75 1.75 0 00-1.75 1.75H5A3.25 3.25 0 018.25 11h7a2.25 2.25 0 002.25-2.25z\"></path>"
		}
	}
},
	"git-commit": {
	name: "git-commit",
	keywords: [
		"save"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M15.5 11.75a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm1.444-.75a5.001 5.001 0 00-9.888 0H2.75a.75.75 0 100 1.5h4.306a5.001 5.001 0 009.888 0h4.306a.75.75 0 100-1.5h-4.306z\"></path>"
		}
	}
},
	"git-compare": {
	name: "git-compare",
	keywords: [
		"difference",
		"changes"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M9.573.677L7.177 3.073a.25.25 0 000 .354l2.396 2.396A.25.25 0 0010 5.646V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5h-1V.854a.25.25 0 00-.427-.177zM6 12v-1.646a.25.25 0 01.427-.177l2.396 2.396a.25.25 0 010 .354l-2.396 2.396A.25.25 0 016 15.146V13.5H5A2.5 2.5 0 012.5 11V5.372a2.25 2.25 0 111.5 0V11a1 1 0 001 1h1zm6.75 0a.75.75 0 100 1.5.75.75 0 000-1.5zM4 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M19.75 17.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm-3.25 1.75a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z\"></path><path fill-rule=\"evenodd\" d=\"M13.905 1.72a.75.75 0 010 1.06L12.685 4h4.065a3.75 3.75 0 013.75 3.75v8.75a.75.75 0 01-1.5 0V7.75a2.25 2.25 0 00-2.25-2.25h-4.064l1.22 1.22a.75.75 0 01-1.061 1.06l-2.5-2.5a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 0zM4.25 6.5a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5zM7.5 4.75a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0z\"></path><path fill-rule=\"evenodd\" d=\"M10.095 22.28a.75.75 0 010-1.06l1.22-1.22H7.25a3.75 3.75 0 01-3.75-3.75V7.5a.75.75 0 011.5 0v8.75a2.25 2.25 0 002.25 2.25h4.064l-1.22-1.22a.75.75 0 111.061-1.06l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 01-1.06 0z\"></path>"
		}
	}
},
	"git-fork": {
	name: "git-fork",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm-3.25-1.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zm-3-12.75a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z\"></path><path fill-rule=\"evenodd\" d=\"M6.5 7.75v1A2.25 2.25 0 008.75 11h6.5a2.25 2.25 0 002.25-2.25v-1H19v1a3.75 3.75 0 01-3.75 3.75h-6.5A3.75 3.75 0 015 8.75v-1h1.5z\"></path><path fill-rule=\"evenodd\" d=\"M11.25 16.25v-5h1.5v5h-1.5z\"></path>"
		}
	}
},
	"git-merge": {
	name: "git-merge",
	keywords: [
		"join"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M5.75 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 19.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM5.75 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 15a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 13.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z\"></path><path fill-rule=\"evenodd\" d=\"M6.5 7.25c0 2.9 2.35 5.25 5.25 5.25h4.5V14h-4.5A6.75 6.75 0 015 7.25h1.5z\"></path><path fill-rule=\"evenodd\" d=\"M5.75 16.75A.75.75 0 006.5 16V8A.75.75 0 005 8v8c0 .414.336.75.75.75z\"></path>"
		}
	}
},
	"git-pull-request": {
	name: "git-pull-request",
	keywords: [
		"review"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 3a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 4.75a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM4.75 17.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zm17.75-1.75a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM16 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z\"></path><path fill-rule=\"evenodd\" d=\"M4.75 7.25A.75.75 0 015.5 8v8A.75.75 0 014 16V8a.75.75 0 01.75-.75zm8.655-5.53a.75.75 0 010 1.06L12.185 4h4.065A3.75 3.75 0 0120 7.75v8.75a.75.75 0 01-1.5 0V7.75a2.25 2.25 0 00-2.25-2.25h-4.064l1.22 1.22a.75.75 0 01-1.061 1.06l-2.5-2.5a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 0z\"></path>"
		}
	}
},
	globe: globe,
	grabber: grabber,
	graph: graph,
	heading: heading,
	heart: heart,
	"heart-fill": {
	name: "heart-fill",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.655 14.916L8 14.25l.345.666a.752.752 0 01-.69 0zm0 0L8 14.25l.345.666.002-.001.006-.003.018-.01a7.643 7.643 0 00.31-.17 22.08 22.08 0 003.433-2.414C13.956 10.731 16 8.35 16 5.5 16 2.836 13.914 1 11.75 1 10.203 1 8.847 1.802 8 3.02 7.153 1.802 5.797 1 4.25 1 2.086 1 0 2.836 0 5.5c0 2.85 2.045 5.231 3.885 6.818a22.075 22.075 0 003.744 2.584l.018.01.006.003h.002z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z\"></path>"
		}
	}
},
	history: history,
	home: home,
	"home-fill": {
	name: "home-fill",
	keywords: [
	],
	heights: {
		"24": {
			width: 24,
			path: "<path d=\"M12.97 2.59a1.5 1.5 0 00-1.94 0l-7.5 6.363A1.5 1.5 0 003 10.097V19.5A1.5 1.5 0 004.5 21h4.75a.75.75 0 00.75-.75V14h4v6.25c0 .414.336.75.75.75h4.75a1.5 1.5 0 001.5-1.5v-9.403a1.5 1.5 0 00-.53-1.144l-7.5-6.363z\"></path>"
		}
	}
},
	"horizontal-rule": {
	name: "horizontal-rule",
	keywords: [
		"hr"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M0 7.75A.75.75 0 01.75 7h14.5a.75.75 0 010 1.5H.75A.75.75 0 010 7.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M2 12.75a.75.75 0 01.75-.75h18.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z\"></path>"
		}
	}
},
	hourglass: hourglass,
	hubot: hubot,
	image: image,
	inbox: inbox,
	infinity: infinity,
	info: info,
	insights: insights,
	"issue-closed": {
	name: "issue-closed",
	keywords: [
		"done",
		"complete"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 0110.65-5.003.75.75 0 00.959-1.153 8 8 0 102.592 8.33.75.75 0 10-1.444-.407A6.5 6.5 0 011.5 8zM8 12a1 1 0 100-2 1 1 0 000 2zm0-8a.75.75 0 01.75.75v3.5a.75.75 0 11-1.5 0v-3.5A.75.75 0 018 4zm4.78 4.28l3-3a.75.75 0 00-1.06-1.06l-2.47 2.47-.97-.97a.749.749 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M2.5 12c0-5.24 4.288-9.5 9.593-9.5a9.608 9.608 0 017.197 3.219.75.75 0 001.12-.998A11.108 11.108 0 0012.093 1C5.973 1 1 5.919 1 12s4.973 11 11.093 11c5.403 0 9.91-3.832 10.893-8.915a.75.75 0 10-1.472-.285c-.848 4.381-4.74 7.7-9.421 7.7C6.788 21.5 2.5 17.24 2.5 12z\"></path><path d=\"M12 17a1 1 0 100-2 1 1 0 000 2zm0-10a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm11.28.78a.75.75 0 00-1.06-1.06l-3.47 3.47-1.47-1.47a.75.75 0 10-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z\"></path>"
		}
	}
},
	"issue-opened": {
	name: "issue-opened",
	keywords: [
		"new"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm1 9a1 1 0 11-2 0 1 1 0 012 0z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
},
	"issue-reopened": {
	name: "issue-reopened",
	keywords: [
		"regression"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 1.5a6.491 6.491 0 00-5.285 2.715l1.358 1.358A.25.25 0 013.896 6H.25A.25.25 0 010 5.75V2.104a.25.25 0 01.427-.177l1.216 1.216a8 8 0 0114.315 4.03.748.748 0 01-.668.83.75.75 0 01-.824-.676A6.501 6.501 0 008 1.5zM.712 8.004a.75.75 0 01.822.67 6.501 6.501 0 0011.751 3.111l-1.358-1.358a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.216-1.216A8 8 0 01.042 8.827a.75.75 0 01.67-.823zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M3.38 8A9.502 9.502 0 0112 2.5a9.502 9.502 0 019.215 7.182.75.75 0 101.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 00-9.5 5.452V4.75a.75.75 0 00-1.5 0V8.5a1 1 0 001 1h3.75a.75.75 0 000-1.5H3.38zm-.595 6.318a.75.75 0 00-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 001.5 0V15.5a1 1 0 00-1-1h-3.75a.75.75 0 000 1.5h2.37A9.502 9.502 0 0112 21.5c-4.446 0-8.181-3.055-9.215-7.182z\"></path><path d=\"M12 17a1 1 0 100-2 1 1 0 000 2zm0-10a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7z\"></path>"
		}
	}
},
	italic: italic,
	"kebab-horizontal": {
	name: "kebab-horizontal",
	keywords: [
		"kebab",
		"dot",
		"menu",
		"more"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M6 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm6 2a2 2 0 100-4 2 2 0 000 4z\"></path>"
		}
	}
},
	key: key,
	law: law,
	"light-bulb": {
	name: "light-bulb",
	keywords: [
		"idea"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 01-1.484.211c-.04-.282-.163-.547-.37-.847a8.695 8.695 0 00-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.75.75 0 01-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75zM6 15.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM5.75 12a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12 2.5c-3.81 0-6.5 2.743-6.5 6.119 0 1.536.632 2.572 1.425 3.56.172.215.347.422.527.635l.096.112c.21.25.427.508.63.774.404.531.783 1.128.995 1.834a.75.75 0 01-1.436.432c-.138-.46-.397-.89-.753-1.357a18.354 18.354 0 00-.582-.714l-.092-.11c-.18-.212-.37-.436-.555-.667C4.87 12.016 4 10.651 4 8.618 4 4.363 7.415 1 12 1s8 3.362 8 7.619c0 2.032-.87 3.397-1.755 4.5-.185.23-.375.454-.555.667l-.092.109c-.21.248-.405.481-.582.714-.356.467-.615.898-.753 1.357a.75.75 0 01-1.437-.432c.213-.706.592-1.303.997-1.834.202-.266.419-.524.63-.774l.095-.112c.18-.213.355-.42.527-.634.793-.99 1.425-2.025 1.425-3.561C18.5 5.243 15.81 2.5 12 2.5zM9.5 21.75a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zM8.75 18a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z\"></path>"
		}
	}
},
	link: link,
	"link-external": {
	name: "link-external",
	keywords: [
		"out",
		"see",
		"more",
		"go",
		"to"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M15.5 2.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.06l-6.22 6.22a.75.75 0 11-1.06-1.06L19.94 3h-3.69a.75.75 0 01-.75-.75z\"></path><path d=\"M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 010 1.5h-8.5a.25.25 0 00-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 00.25-.25v-8.5a.75.75 0 011.5 0v8.5a1.75 1.75 0 01-1.75 1.75H4.25a1.75 1.75 0 01-1.75-1.75V4.25z\"></path>"
		}
	}
},
	"list-ordered": {
	name: "list-ordered",
	keywords: [
		"numbers",
		"tasks",
		"todo",
		"items"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.003 2.5a.5.5 0 00-.723-.447l-1.003.5a.5.5 0 00.446.895l.28-.14V6H.5a.5.5 0 000 1h2.006a.5.5 0 100-1h-.503V2.5zM5 3.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 3.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM.924 10.32l.003-.004a.851.851 0 01.144-.153A.66.66 0 011.5 10c.195 0 .306.068.374.146a.57.57 0 01.128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 00.5.5h2.003a.5.5 0 000-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.858 1.858 0 00-.348.384l-.007.011-.002.004-.001.002-.001.001a.5.5 0 00.851.525zM.5 10.055l-.427-.26.427.26z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M3.604 3.089A.75.75 0 014 3.75V8.5h.75a.75.75 0 010 1.5h-3a.75.75 0 110-1.5h.75V5.151l-.334.223a.75.75 0 01-.832-1.248l1.5-1a.75.75 0 01.77-.037zM8.75 5.5a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5.5 15.75c0-.704-.271-1.286-.72-1.686a2.302 2.302 0 00-1.53-.564c-.535 0-1.094.178-1.53.565-.449.399-.72.982-.72 1.685a.75.75 0 001.5 0c0-.296.104-.464.217-.564A.805.805 0 013.25 15c.215 0 .406.072.533.185.113.101.217.268.217.565 0 .332-.069.48-.21.657-.092.113-.216.24-.403.419l-.147.14c-.152.144-.33.313-.52.504l-1.5 1.5a.75.75 0 00-.22.53v.25c0 .414.336.75.75.75H5A.75.75 0 005 19H3.31l.47-.47c.176-.176.333-.324.48-.465l.165-.156a5.98 5.98 0 00.536-.566c.358-.447.539-.925.539-1.593z\"></path>"
		}
	}
},
	"list-unordered": {
	name: "list-unordered",
	keywords: [
		"bullet",
		"point",
		"tasks",
		"todo",
		"items"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4 7a1 1 0 100-2 1 1 0 000 2zm4.75-1.5a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5 12a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 100-2 1 1 0 000 2z\"></path>"
		}
	}
},
	location: location,
	lock: lock,
	"logo-gist": {
	name: "logo-gist",
	keywords: [
		"brand",
		"github",
		"logo"
	],
	heights: {
		"16": {
			width: 25,
			path: "<path fill-rule=\"evenodd\" d=\"M4.7 8.73h2.45v4.02c-.55.27-1.64.34-2.53.34-2.56 0-3.47-2.2-3.47-5.05 0-2.85.91-5.06 3.48-5.06 1.28 0 2.06.23 3.28.73V2.66C7.27 2.33 6.25 2 4.63 2 1.13 2 0 4.69 0 8.03c0 3.34 1.11 6.03 4.63 6.03 1.64 0 2.81-.27 3.59-.64V7.73H4.7v1zm6.39 3.72V6.06h-1.05v6.28c0 1.25.58 1.72 1.72 1.72v-.89c-.48 0-.67-.16-.67-.7v-.02zm.25-8.72c0-.44-.33-.78-.78-.78s-.77.34-.77.78.33.78.77.78.78-.34.78-.78zm4.34 5.69c-1.5-.13-1.78-.48-1.78-1.17 0-.77.33-1.34 1.88-1.34 1.05 0 1.66.16 2.27.36v-.94c-.69-.3-1.52-.39-2.25-.39-2.2 0-2.92 1.2-2.92 2.31 0 1.08.47 1.88 2.73 2.08 1.55.13 1.77.63 1.77 1.34 0 .73-.44 1.42-2.06 1.42-1.11 0-1.86-.19-2.33-.36v.94c.5.2 1.58.39 2.33.39 2.38 0 3.14-1.2 3.14-2.41 0-1.28-.53-2.03-2.75-2.23h-.03zm8.58-2.47v-.86h-2.42v-2.5l-1.08.31v2.11l-1.56.44v.48h1.56v5c0 1.53 1.19 2.13 2.5 2.13.19 0 .52-.02.69-.05v-.89c-.19.03-.41.03-.61.03-.97 0-1.5-.39-1.5-1.34V6.94h2.42v.02-.01z\"></path>"
		}
	}
},
	"logo-github": {
	name: "logo-github",
	keywords: [
		"brand",
		"github",
		"logo"
	],
	heights: {
		"16": {
			width: 45,
			path: "<path fill-rule=\"evenodd\" d=\"M18.53 12.03h-.02c.009 0 .015.01.024.011h.006l-.01-.01zm.004.011c-.093.001-.327.05-.574.05-.78 0-1.05-.36-1.05-.83V8.13h1.59c.09 0 .16-.08.16-.19v-1.7c0-.09-.08-.17-.16-.17h-1.59V3.96c0-.08-.05-.13-.14-.13h-2.16c-.09 0-.14.05-.14.13v2.17s-1.09.27-1.16.28c-.08.02-.13.09-.13.17v1.36c0 .11.08.19.17.19h1.11v3.28c0 2.44 1.7 2.69 2.86 2.69.53 0 1.17-.17 1.27-.22.06-.02.09-.09.09-.16v-1.5a.177.177 0 00-.146-.18zM42.23 9.84c0-1.81-.73-2.05-1.5-1.97-.6.04-1.08.34-1.08.34v3.52s.49.34 1.22.36c1.03.03 1.36-.34 1.36-2.25zm2.43-.16c0 3.43-1.11 4.41-3.05 4.41-1.64 0-2.52-.83-2.52-.83s-.04.46-.09.52c-.03.06-.08.08-.14.08h-1.48c-.1 0-.19-.08-.19-.17l.02-11.11c0-.09.08-.17.17-.17h2.13c.09 0 .17.08.17.17v3.77s.82-.53 2.02-.53l-.01-.02c1.2 0 2.97.45 2.97 3.88zm-8.72-3.61h-2.1c-.11 0-.17.08-.17.19v5.44s-.55.39-1.3.39-.97-.34-.97-1.09V6.25c0-.09-.08-.17-.17-.17h-2.14c-.09 0-.17.08-.17.17v5.11c0 2.2 1.23 2.75 2.92 2.75 1.39 0 2.52-.77 2.52-.77s.05.39.08.45c.02.05.09.09.16.09h1.34c.11 0 .17-.08.17-.17l.02-7.47c0-.09-.08-.17-.19-.17zm-23.7-.01h-2.13c-.09 0-.17.09-.17.2v7.34c0 .2.13.27.3.27h1.92c.2 0 .25-.09.25-.27V6.23c0-.09-.08-.17-.17-.17zm-1.05-3.38c-.77 0-1.38.61-1.38 1.38 0 .77.61 1.38 1.38 1.38.75 0 1.36-.61 1.36-1.38 0-.77-.61-1.38-1.36-1.38zm16.49-.25h-2.11c-.09 0-.17.08-.17.17v4.09h-3.31V2.6c0-.09-.08-.17-.17-.17h-2.13c-.09 0-.17.08-.17.17v11.11c0 .09.09.17.17.17h2.13c.09 0 .17-.08.17-.17V8.96h3.31l-.02 4.75c0 .09.08.17.17.17h2.13c.09 0 .17-.08.17-.17V2.6c0-.09-.08-.17-.17-.17zM8.81 7.35v5.74c0 .04-.01.11-.06.13 0 0-1.25.89-3.31.89-2.49 0-5.44-.78-5.44-5.92S2.58 1.99 5.1 2c2.18 0 3.06.49 3.2.58.04.05.06.09.06.14L7.94 4.5c0 .09-.09.2-.2.17-.36-.11-.9-.33-2.17-.33-1.47 0-3.05.42-3.05 3.73s1.5 3.7 2.58 3.7c.92 0 1.25-.11 1.25-.11v-2.3H4.88c-.11 0-.19-.08-.19-.17V7.35c0-.09.08-.17.19-.17h3.74c.11 0 .19.08.19.17z\"></path>"
		}
	}
},
	mail: mail,
	"mark-github": {
	name: "mark-github",
	keywords: [
		"octocat",
		"brand",
		"github",
		"logo"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z\"></path>"
		}
	}
},
	markdown: markdown,
	megaphone: megaphone,
	mention: mention,
	meter: meter,
	milestone: milestone,
	mirror: mirror,
	moon: moon,
	"mortar-board": {
	name: "mortar-board",
	keywords: [
		"education",
		"learn",
		"teach"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M7.693 1.066a.75.75 0 01.614 0l7.25 3.25a.75.75 0 010 1.368L13 6.831v2.794c0 1.024-.81 1.749-1.66 2.173-.893.447-2.075.702-3.34.702-.278 0-.55-.012-.816-.036a.75.75 0 01.133-1.494c.22.02.45.03.683.03 1.082 0 2.025-.221 2.67-.543.69-.345.83-.682.83-.832V7.503L8.307 8.934a.75.75 0 01-.614 0L4 7.28v1.663c.296.105.575.275.812.512.438.438.688 1.059.688 1.796v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3c0-.737.25-1.358.688-1.796.237-.237.516-.407.812-.512V6.606L.443 5.684a.75.75 0 010-1.368l7.25-3.25zM2.583 5L8 7.428 13.416 5 8 2.572 2.583 5zM2.5 11.25c0-.388.125-.611.25-.735a.704.704 0 01.5-.203c.19 0 .37.071.5.203.125.124.25.347.25.735v2.25H2.5v-2.25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.292 2.06a.75.75 0 00-.584 0L.458 6.81a.75.75 0 000 1.38L4.25 9.793v3.803a2.901 2.901 0 00-1.327.757c-.579.58-.923 1.41-.923 2.43v4.5c0 .248.128.486.335.624.06.04.117.073.22.124.124.062.297.138.52.213.448.149 1.09.288 1.925.288s1.477-.14 1.925-.288c.223-.075.396-.15.52-.213a2.11 2.11 0 00.21-.117A.762.762 0 008 21.28v-4.5c0-1.018-.344-1.85-.923-2.428a2.9 2.9 0 00-1.327-.758v-3.17l5.958 2.516a.75.75 0 00.584 0l5.208-2.2v4.003a2.552 2.552 0 01-.079.085 4.057 4.057 0 01-.849.65c-.826.488-2.255 1.021-4.572 1.021-.612 0-1.162-.037-1.654-.1a.75.75 0 00-.192 1.487c.56.072 1.173.113 1.846.113 2.558 0 4.254-.592 5.334-1.23.538-.316.914-.64 1.163-.896a2.84 2.84 0 00.392-.482h.001A.75.75 0 0019 15v-4.892l4.542-1.917a.75.75 0 000-1.382l-11.25-4.75zM5 15c-.377 0-.745.141-1.017.413-.265.265-.483.7-.483 1.368v4.022c.299.105.797.228 1.5.228s1.201-.123 1.5-.228V16.78c0-.669-.218-1.103-.483-1.368A1.431 1.431 0 005 15zm7-3.564L2.678 7.5 12 3.564 21.322 7.5 12 11.436z\"></path>"
		}
	}
},
	mute: mute,
	"no-entry": {
	name: "no-entry",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.5 8a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0zM8 1a7 7 0 100 14A7 7 0 008 1zm3.25 7.75a.75.75 0 000-1.5h-6.5a.75.75 0 000 1.5h6.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0zM12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm6.25 11.75a.75.75 0 000-1.5H5.75a.75.75 0 000 1.5h12.5z\"></path>"
		}
	}
},
	"north-star": {
	name: "north-star",
	keywords: [
		"star",
		"snowflake",
		"asterisk"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M8.5.75a.75.75 0 00-1.5 0v5.19L4.391 3.33a.75.75 0 10-1.06 1.061L5.939 7H.75a.75.75 0 000 1.5h5.19l-2.61 2.609a.75.75 0 101.061 1.06L7 9.561v5.189a.75.75 0 001.5 0V9.56l2.609 2.61a.75.75 0 101.06-1.061L9.561 8.5h5.189a.75.75 0 000-1.5H9.56l2.61-2.609a.75.75 0 00-1.061-1.06L8.5 5.939V.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12.5 1.25a.75.75 0 00-1.5 0v8.69L6.447 5.385a.75.75 0 10-1.061 1.06L9.94 11H1.25a.75.75 0 000 1.5h8.69l-4.554 4.553a.75.75 0 001.06 1.061L11 13.561v8.689a.75.75 0 001.5 0v-8.69l4.553 4.554a.75.75 0 001.061-1.06L13.561 12.5h8.689a.75.75 0 000-1.5h-8.69l4.554-4.553a.75.75 0 10-1.06-1.061L12.5 9.939V1.25z\"></path>"
		}
	}
},
	note: note,
	number: number,
	octoface: octoface,
	organization: organization,
	"package": {
	name: "package",
	keywords: [
		"box",
		"ship"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.876.64a1.75 1.75 0 00-1.75 0l-8.25 4.762a1.75 1.75 0 00-.875 1.515v9.525c0 .625.334 1.203.875 1.515l8.25 4.763a1.75 1.75 0 001.75 0l8.25-4.762a1.75 1.75 0 00.875-1.516V6.917a1.75 1.75 0 00-.875-1.515L12.876.639zm-1 1.298a.25.25 0 01.25 0l7.625 4.402-7.75 4.474-7.75-4.474 7.625-4.402zM3.501 7.64v8.803c0 .09.048.172.125.216l7.625 4.402v-8.947L3.501 7.64zm9.25 13.421l7.625-4.402a.25.25 0 00.125-.216V7.639l-7.75 4.474v8.947z\"></path>"
		}
	}
},
	"package-dependencies": {
	name: "package-dependencies",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.122.392a1.75 1.75 0 011.756 0l5.25 3.045c.54.313.872.89.872 1.514V7.25a.75.75 0 01-1.5 0V5.677L7.75 8.432v6.384a1 1 0 01-1.502.865L.872 12.563A1.75 1.75 0 010 11.049V4.951c0-.624.332-1.2.872-1.514L6.122.392zM7.125 1.69l4.63 2.685L7 7.133 2.245 4.375l4.63-2.685a.25.25 0 01.25 0zM1.5 11.049V5.677l4.75 2.755v5.516l-4.625-2.683a.25.25 0 01-.125-.216zm11.672-.282a.75.75 0 10-1.087-1.034l-2.378 2.5a.75.75 0 000 1.034l2.378 2.5a.75.75 0 101.087-1.034L11.999 13.5h3.251a.75.75 0 000-1.5h-3.251l1.173-1.233z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M9.126.64a1.75 1.75 0 011.75 0l8.25 4.762c.103.06.199.128.286.206a.748.748 0 01.554.96c.023.113.035.23.035.35v3.332a.75.75 0 01-1.5 0V7.64l-7.75 4.474V22.36a.75.75 0 01-1.125.65l-8.75-5.052a1.75 1.75 0 01-.875-1.515V6.917c0-.119.012-.236.035-.35a.748.748 0 01.554-.96 1.75 1.75 0 01.286-.205L9.126.639zM1.501 7.638v8.803c0 .09.048.172.125.216l7.625 4.402v-8.947l-7.75-4.474zm8.5 3.175L2.251 6.34l7.625-4.402a.25.25 0 01.25 0l7.625 4.402-7.75 4.474z\"></path><path d=\"M16.617 17.5l2.895-2.702a.75.75 0 00-1.024-1.096l-4.285 4a.75.75 0 000 1.096l4.285 4a.75.75 0 101.024-1.096L16.617 19h6.633a.75.75 0 000-1.5h-6.633z\"></path>"
		}
	}
},
	"package-dependents": {
	name: "package-dependents",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6.122.392a1.75 1.75 0 011.756 0l5.25 3.045c.54.313.872.89.872 1.514V7.25a.75.75 0 01-1.5 0V5.677L7.75 8.432v6.384a1 1 0 01-1.502.865L.872 12.563A1.75 1.75 0 010 11.049V4.951c0-.624.332-1.2.872-1.514L6.122.392zM7.125 1.69l4.63 2.685L7 7.133 2.245 4.375l4.63-2.685a.25.25 0 01.25 0zM1.5 11.049V5.677l4.75 2.755v5.516l-4.625-2.683a.25.25 0 01-.125-.216zm10.828 3.684a.75.75 0 101.087 1.034l2.378-2.5a.75.75 0 000-1.034l-2.378-2.5a.75.75 0 00-1.087 1.034L13.501 12H10.25a.75.75 0 000 1.5h3.251l-1.173 1.233z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M9.126.64a1.75 1.75 0 011.75 0l8.25 4.762c.103.06.199.128.286.206a.748.748 0 01.554.96c.023.113.035.23.035.35v3.332a.75.75 0 01-1.5 0V7.64l-7.75 4.474V22.36a.75.75 0 01-1.125.65l-8.75-5.052a1.75 1.75 0 01-.875-1.515V6.917c0-.119.012-.236.035-.35a.748.748 0 01.554-.96 1.75 1.75 0 01.286-.205L9.126.639zM1.501 7.638v8.803c0 .09.048.172.125.216l7.625 4.402v-8.947l-7.75-4.474zm8.5 3.175L2.251 6.34l7.625-4.402a.25.25 0 01.25 0l7.625 4.402-7.75 4.474z\"></path><path d=\"M21.347 17.5l-2.894-2.702a.75.75 0 111.023-1.096l4.286 4a.75.75 0 010 1.096l-4.286 4a.75.75 0 11-1.023-1.096L21.347 19h-6.633a.75.75 0 010-1.5h6.633z\"></path>"
		}
	}
},
	paintbrush: paintbrush,
	"paper-airplane": {
	name: "paper-airplane",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.592 2.712L2.38 7.25h4.87a.75.75 0 110 1.5H2.38l-.788 4.538L13.929 8 1.592 2.712zM.989 8L.064 2.68a1.341 1.341 0 011.85-1.462l13.402 5.744a1.13 1.13 0 010 2.076L1.913 14.782a1.341 1.341 0 01-1.85-1.463L.99 8z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1.513 1.96a1.374 1.374 0 011.499-.21l19.335 9.215a1.146 1.146 0 010 2.07L3.012 22.25a1.374 1.374 0 01-1.947-1.46L2.49 12 1.065 3.21a1.374 1.374 0 01.448-1.25zm2.375 10.79l-1.304 8.042L21.031 12 2.584 3.208l1.304 8.042h7.362a.75.75 0 010 1.5H3.888z\"></path>"
		}
	}
},
	pencil: pencil,
	people: people,
	person: person,
	pin: pin,
	play: play,
	plug: plug,
	plus: plus,
	"plus-circle": {
	name: "plus-circle",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.75 4.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12.75 7.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
},
	project: project$1,
	pulse: pulse,
	question: question,
	quote: quote,
	reply: reply,
	repo: repo,
	"repo-clone": {
	name: "repo-clone",
	keywords: [
		"book",
		"journal",
		"repository"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M15 0H9v7c0 .55.45 1 1 1h1v1h1V8h3c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1zm-4 7h-1V6h1v1zm4 0h-3V6h3v1zm0-2h-4V1h4v4zM4 5H3V4h1v1zm0-2H3V2h1v1zM2 1h6V0H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h2v2l1.5-1.5L6 16v-2h5c.55 0 1-.45 1-1v-3H2V1zm9 10v2H6v-1H3v1H1v-2h10zM3 8h1v1H3V8zm1-1H3V6h1v1z\"></path>"
		}
	}
},
	"repo-forked": {
	name: "repo-forked",
	keywords: [
		"book",
		"journal",
		"copy"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z\"></path>"
		}
	}
},
	"repo-pull": {
	name: "repo-pull",
	keywords: [
		"book",
		"journal",
		"get"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M13 8V6H7V4h6V2l3 3-3 3zM4 2H3v1h1V2zm7 5h1v6c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2h-1V1H2v9h9V7zm0 4H1v2h2v-1h3v1h5v-2zM4 6H3v1h1V6zm0-2H3v1h1V4zM3 9h1V8H3v1z\"></path>"
		}
	}
},
	"repo-push": {
	name: "repo-push",
	keywords: [
		"book",
		"journal",
		"repository",
		"put"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M4.75 0A2.75 2.75 0 002 2.75v16.5A2.75 2.75 0 004.75 22h11a.75.75 0 000-1.5h-11c-.69 0-1.25-.56-1.25-1.25V18A1.5 1.5 0 015 16.5h7.25a.75.75 0 000-1.5H5c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H18.5v7a.75.75 0 001.5 0V.75a.75.75 0 00-.75-.75H4.75z\"></path><path d=\"M20 13.903l2.202 2.359a.75.75 0 001.096-1.024l-3.5-3.75a.75.75 0 00-1.096 0l-3.5 3.75a.75.75 0 101.096 1.024l2.202-2.36v9.348a.75.75 0 001.5 0v-9.347z\"></path>"
		}
	}
},
	"repo-template": {
	name: "repo-template",
	keywords: [
		"book",
		"new",
		"add",
		"template"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M6 .75A.75.75 0 016.75 0h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 016 .75zm5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V1.5h-.75A.75.75 0 0111 .75zM4.992.662a.75.75 0 01-.636.848c-.436.063-.783.41-.846.846a.75.75 0 01-1.485-.212A2.501 2.501 0 014.144.025a.75.75 0 01.848.637zM2.75 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 012.75 4zm10.5 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM2.75 8a.75.75 0 01.75.75v.268A1.72 1.72 0 013.75 9h.5a.75.75 0 010 1.5h-.5a.25.25 0 00-.25.25v.75c0 .28.114.532.3.714a.75.75 0 01-1.05 1.072A2.495 2.495 0 012 11.5V8.75A.75.75 0 012.75 8zm10.5 0a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-.75a.75.75 0 010-1.5h.75v-.25a.75.75 0 01.75-.75zM6 9.75A.75.75 0 016.75 9h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 016 9.75zm-1 2.5v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M5.75 0A2.75 2.75 0 003 2.75v1a.75.75 0 001.5 0v-1c0-.69.56-1.25 1.25-1.25h1a.75.75 0 000-1.5h-1zm4 0a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm7.5 0a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75h-3zM4.5 6.5a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V6.5zm16.5 0a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V6.5zM4.5 13.25a.75.75 0 00-1.5 0v5.5a3.25 3.25 0 001.95 2.98.75.75 0 10.6-1.375A1.75 1.75 0 014.5 18.75V18A1.5 1.5 0 016 16.5h.75a.75.75 0 000-1.5H6c-.546 0-1.059.146-1.5.401V13.25zm16.5 0a.75.75 0 00-1.5 0V15h-2.25a.75.75 0 000 1.5h2.25v4h-5.25a.75.75 0 000 1.5h6a.75.75 0 00.75-.75v-8zM9.75 15a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm-2.353 8.461A.25.25 0 017 23.26v-5.01a.25.25 0 01.25-.25h5a.25.25 0 01.25.25v5.01a.25.25 0 01-.397.201l-2.206-1.604a.25.25 0 00-.294 0L7.397 23.46z\"></path>"
		}
	}
},
	report: report,
	rocket: rocket,
	rss: rss,
	ruby: ruby,
	"screen-full": {
	name: "screen-full",
	keywords: [
		"fullscreen",
		"expand"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.75 2.5a.25.25 0 00-.25.25v2.5a.75.75 0 01-1.5 0v-2.5C1 1.784 1.784 1 2.75 1h2.5a.75.75 0 010 1.5h-2.5zM10 1.75a.75.75 0 01.75-.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a.75.75 0 01-1.5 0v-2.5a.25.25 0 00-.25-.25h-2.5a.75.75 0 01-.75-.75zM1.75 10a.75.75 0 01.75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 011 13.25v-2.5a.75.75 0 01.75-.75zm12.5 0a.75.75 0 01.75.75v2.5A1.75 1.75 0 0113.25 15h-2.5a.75.75 0 010-1.5h2.5a.25.25 0 00.25-.25v-2.5a.75.75 0 01.75-.75z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M4.75 4.5a.25.25 0 00-.25.25v3.5a.75.75 0 01-1.5 0v-3.5C3 3.784 3.784 3 4.75 3h3.5a.75.75 0 010 1.5h-3.5zM15 3.75a.75.75 0 01.75-.75h3.5c.966 0 1.75.784 1.75 1.75v3.5a.75.75 0 01-1.5 0v-3.5a.25.25 0 00-.25-.25h-3.5a.75.75 0 01-.75-.75zM3.75 15a.75.75 0 01.75.75v3.5c0 .138.112.25.25.25h3.5a.75.75 0 010 1.5h-3.5A1.75 1.75 0 013 19.25v-3.5a.75.75 0 01.75-.75zm16.5 0a.75.75 0 01.75.75v3.5A1.75 1.75 0 0119.25 21h-3.5a.75.75 0 010-1.5h3.5a.25.25 0 00.25-.25v-3.5a.75.75 0 01.75-.75z\"></path>"
		}
	}
},
	"screen-normal": {
	name: "screen-normal",
	keywords: [
		"fullscreen",
		"expand",
		"exit"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5.25 1a.75.75 0 01.75.75v2.5A1.75 1.75 0 014.25 6h-2.5a.75.75 0 010-1.5h2.5a.25.25 0 00.25-.25v-2.5A.75.75 0 015.25 1zm5.5 0a.75.75 0 01.75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 0110 4.25v-2.5a.75.75 0 01.75-.75zM1 10.75a.75.75 0 01.75-.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a.75.75 0 01-1.5 0v-2.5a.25.25 0 00-.25-.25h-2.5a.75.75 0 01-.75-.75zm9 1c0-.966.784-1.75 1.75-1.75h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v2.5a.75.75 0 01-1.5 0v-2.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M8.25 3a.75.75 0 01.75.75v3.5A1.75 1.75 0 017.25 9h-3.5a.75.75 0 010-1.5h3.5a.25.25 0 00.25-.25v-3.5A.75.75 0 018.25 3zm7.5 0a.75.75 0 01.75.75v3.5c0 .138.112.25.25.25h3.5a.75.75 0 010 1.5h-3.5A1.75 1.75 0 0115 7.25v-3.5a.75.75 0 01.75-.75zM3 15.75a.75.75 0 01.75-.75h3.5c.966 0 1.75.784 1.75 1.75v3.5a.75.75 0 01-1.5 0v-3.5a.25.25 0 00-.25-.25h-3.5a.75.75 0 01-.75-.75zm12 1c0-.966.784-1.75 1.75-1.75h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v3.5a.75.75 0 01-1.5 0v-3.5z\"></path>"
		}
	}
},
	search: search,
	server: server,
	share: share,
	"share-android": {
	name: "share-android",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M13.5 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 3a3 3 0 01-5.175 2.066l-3.92 2.179a3.005 3.005 0 010 1.51l3.92 2.179a3 3 0 11-.73 1.31l-3.92-2.178a3 3 0 110-4.133l3.92-2.178A3 3 0 1115 3zm-1.5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M20 5.5a3.5 3.5 0 01-6.062 2.385l-5.112 3.021a3.497 3.497 0 010 2.188l5.112 3.021a3.5 3.5 0 11-.764 1.29l-5.112-3.02a3.5 3.5 0 110-4.77l5.112-3.021v.001A3.5 3.5 0 1120 5.5zm-1.5 0a2 2 0 11-4 0 2 2 0 014 0zM5.5 14a2 2 0 100-4 2 2 0 000 4zm13 4.5a2 2 0 11-4 0 2 2 0 014 0z\"></path>"
		}
	}
},
	shield: shield,
	"shield-check": {
	name: "shield-check",
	keywords: [
		"security",
		"shield",
		"protection",
		"check",
		"success"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.533.133a1.75 1.75 0 00-1.066 0l-5.25 1.68A1.75 1.75 0 001 3.48V7c0 1.566.32 3.182 1.303 4.682.983 1.498 2.585 2.813 5.032 3.855a1.7 1.7 0 001.33 0c2.447-1.042 4.049-2.357 5.032-3.855C14.68 10.182 15 8.566 15 7V3.48a1.75 1.75 0 00-1.217-1.667L8.533.133zm-.61 1.429a.25.25 0 01.153 0l5.25 1.68a.25.25 0 01.174.238V7c0 1.358-.275 2.666-1.057 3.86-.784 1.194-2.121 2.34-4.366 3.297a.2.2 0 01-.154 0c-2.245-.956-3.582-2.104-4.366-3.298C2.775 9.666 2.5 8.36 2.5 7V3.48a.25.25 0 01.174-.237l5.25-1.68zM11.28 6.28a.75.75 0 00-1.06-1.06L7.25 8.19l-.97-.97a.75.75 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3.5-3.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M16.53 9.78a.75.75 0 00-1.06-1.06L11 13.19l-1.97-1.97a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5-5z\"></path><path fill-rule=\"evenodd\" d=\"M12.54.637a1.75 1.75 0 00-1.08 0L3.21 3.312A1.75 1.75 0 002 4.976V10c0 6.19 3.77 10.705 9.401 12.83.386.145.812.145 1.198 0C18.229 20.704 22 16.19 22 10V4.976c0-.759-.49-1.43-1.21-1.664L12.54.637zm-.617 1.426a.25.25 0 01.154 0l8.25 2.676a.25.25 0 01.173.237V10c0 5.461-3.28 9.483-8.43 11.426a.2.2 0 01-.14 0C6.78 19.483 3.5 15.46 3.5 10V4.976c0-.108.069-.203.173-.237l8.25-2.676z\"></path>"
		}
	}
},
	"shield-lock": {
	name: "shield-lock",
	keywords: [
		"protect",
		"shield",
		"lock"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.533.133a1.75 1.75 0 00-1.066 0l-5.25 1.68A1.75 1.75 0 001 3.48V7c0 1.566.32 3.182 1.303 4.682.983 1.498 2.585 2.813 5.032 3.855a1.7 1.7 0 001.33 0c2.447-1.042 4.049-2.357 5.032-3.855C14.68 10.182 15 8.566 15 7V3.48a1.75 1.75 0 00-1.217-1.667L8.533.133zm-.61 1.429a.25.25 0 01.153 0l5.25 1.68a.25.25 0 01.174.238V7c0 1.358-.275 2.666-1.057 3.86-.784 1.194-2.121 2.34-4.366 3.297a.2.2 0 01-.154 0c-2.245-.956-3.582-2.104-4.366-3.298C2.775 9.666 2.5 8.36 2.5 7V3.48a.25.25 0 01.174-.237l5.25-1.68zM9.5 6.5a1.5 1.5 0 01-.75 1.3v2.45a.75.75 0 01-1.5 0V7.8A1.5 1.5 0 119.5 6.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.077 2.563a.25.25 0 00-.154 0L3.673 5.24a.249.249 0 00-.173.237V10.5c0 5.461 3.28 9.483 8.43 11.426a.2.2 0 00.14 0c5.15-1.943 8.43-5.965 8.43-11.426V5.476a.25.25 0 00-.173-.237l-8.25-2.676zm-.617-1.426a1.75 1.75 0 011.08 0l8.25 2.675A1.75 1.75 0 0122 5.476V10.5c0 6.19-3.77 10.705-9.401 12.83a1.699 1.699 0 01-1.198 0C5.771 21.204 2 16.69 2 10.5V5.476c0-.76.49-1.43 1.21-1.664l8.25-2.675zM13 12.232A2 2 0 0012 8.5a2 2 0 00-1 3.732V15a1 1 0 102 0v-2.768z\"></path>"
		}
	}
},
	"shield-x": {
	name: "shield-x",
	keywords: [
		"security",
		"shield",
		"protection",
		"fail"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8.533.133a1.75 1.75 0 00-1.066 0l-5.25 1.68A1.75 1.75 0 001 3.48V7c0 1.566.32 3.182 1.303 4.682.983 1.498 2.585 2.813 5.032 3.855a1.7 1.7 0 001.33 0c2.447-1.042 4.049-2.357 5.032-3.855C14.68 10.182 15 8.566 15 7V3.48a1.75 1.75 0 00-1.217-1.667L8.533.133zm-.61 1.429a.25.25 0 01.153 0l5.25 1.68a.25.25 0 01.174.238V7c0 1.358-.275 2.666-1.057 3.86-.784 1.194-2.121 2.34-4.366 3.297a.2.2 0 01-.154 0c-2.245-.956-3.582-2.104-4.366-3.298C2.775 9.666 2.5 8.36 2.5 7V3.48a.25.25 0 01.174-.237l5.25-1.68zM6.78 5.22a.75.75 0 10-1.06 1.06L6.94 7.5 5.72 8.72a.75.75 0 001.06 1.06L8 8.56l1.22 1.22a.75.75 0 101.06-1.06L9.06 7.5l1.22-1.22a.75.75 0 10-1.06-1.06L8 6.44 6.78 5.22z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M9.28 7.72a.75.75 0 00-1.06 1.06l2.72 2.72-2.72 2.72a.75.75 0 101.06 1.06L12 12.56l2.72 2.72a.75.75 0 101.06-1.06l-2.72-2.72 2.72-2.72a.75.75 0 00-1.06-1.06L12 10.44 9.28 7.72z\"></path><path fill-rule=\"evenodd\" d=\"M12.54.637a1.75 1.75 0 00-1.08 0L3.21 3.312A1.75 1.75 0 002 4.976V10c0 6.19 3.77 10.705 9.401 12.83.386.145.812.145 1.198 0C18.229 20.704 22 16.19 22 10V4.976c0-.759-.49-1.43-1.21-1.664L12.54.637zm-.617 1.426a.25.25 0 01.154 0l8.25 2.676a.25.25 0 01.173.237V10c0 5.461-3.28 9.483-8.43 11.426a.2.2 0 01-.14 0C6.78 19.483 3.5 15.46 3.5 10V4.976c0-.108.069-.203.173-.237l8.25-2.676z\"></path>"
		}
	}
},
	"sign-in": {
	name: "sign-in",
	keywords: [
		"door",
		"arrow",
		"direction",
		"enter",
		"log in"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 13.25V2.75zm6.56 4.5l1.97-1.97a.75.75 0 10-1.06-1.06L6.22 7.47a.75.75 0 000 1.06l3.25 3.25a.75.75 0 101.06-1.06L8.56 8.75h5.69a.75.75 0 000-1.5H8.56z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3 3.25c0-.966.784-1.75 1.75-1.75h5.5a.75.75 0 010 1.5h-5.5a.25.25 0 00-.25.25v17.5c0 .138.112.25.25.25h5.5a.75.75 0 010 1.5h-5.5A1.75 1.75 0 013 20.75V3.25zm9.994 9.5l3.3 3.484a.75.75 0 01-1.088 1.032l-4.5-4.75a.75.75 0 010-1.032l4.5-4.75a.75.75 0 011.088 1.032l-3.3 3.484h8.256a.75.75 0 010 1.5h-8.256z\"></path>"
		}
	}
},
	"sign-out": {
	name: "sign-out",
	keywords: [
		"door",
		"arrow",
		"direction",
		"leave",
		"log out"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 13.25V2.75zm10.44 4.5H6.75a.75.75 0 000 1.5h5.69l-1.97 1.97a.75.75 0 101.06 1.06l3.25-3.25a.75.75 0 000-1.06l-3.25-3.25a.75.75 0 10-1.06 1.06l1.97 1.97z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M3 3.25c0-.966.784-1.75 1.75-1.75h5.5a.75.75 0 010 1.5h-5.5a.25.25 0 00-.25.25v17.5c0 .138.112.25.25.25h5.5a.75.75 0 010 1.5h-5.5A1.75 1.75 0 013 20.75V3.25zm16.006 9.5l-3.3 3.484a.75.75 0 001.088 1.032l4.5-4.75a.75.75 0 000-1.032l-4.5-4.75a.75.75 0 00-1.088 1.032l3.3 3.484H10.75a.75.75 0 000 1.5h8.256z\"></path>"
		}
	}
},
	skip: skip,
	smiley: smiley,
	square: square,
	"square-fill": {
	name: "square-fill",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M5.75 4A1.75 1.75 0 004 5.75v4.5c0 .966.784 1.75 1.75 1.75h4.5A1.75 1.75 0 0012 10.25v-4.5A1.75 1.75 0 0010.25 4h-4.5z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M7.75 6A1.75 1.75 0 006 7.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0018 16.25v-8.5A1.75 1.75 0 0016.25 6h-8.5z\"></path>"
		}
	}
},
	squirrel: squirrel,
	star: star,
	"star-fill": {
	name: "star-fill",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M12.672.668a.75.75 0 00-1.345 0L8.27 6.865l-6.838.994a.75.75 0 00-.416 1.279l4.948 4.823-1.168 6.811a.75.75 0 001.088.791L12 18.347l6.117 3.216a.75.75 0 001.088-.79l-1.168-6.812 4.948-4.823a.75.75 0 00-.416-1.28l-6.838-.993L12.672.668z\"></path>"
		}
	}
},
	stop: stop,
	stopwatch: stopwatch,
	strikethrough: strikethrough,
	sun: sun,
	sync: sync,
	tab: tab,
	tag: tag,
	tasklist: tasklist,
	telescope: telescope,
	terminal: terminal,
	"three-bars": {
	name: "three-bars",
	keywords: [
		"hamburger",
		"menu",
		"dropdown"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 100 1.5h12.5a.75.75 0 100-1.5H1.75z\"></path>"
		}
	}
},
	thumbsdown: thumbsdown,
	thumbsup: thumbsup,
	tools: tools,
	trash: trash,
	trashcan: trashcan,
	"triangle-down": {
	name: "triangle-down",
	keywords: [
		"arrow",
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M11.646 15.146L5.854 9.354a.5.5 0 01.353-.854h11.586a.5.5 0 01.353.854l-5.793 5.792a.5.5 0 01-.707 0z\"></path>"
		}
	}
},
	"triangle-left": {
	name: "triangle-left",
	keywords: [
		"arrow",
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M9.573 4.427L6.177 7.823a.25.25 0 000 .354l3.396 3.396a.25.25 0 00.427-.177V4.604a.25.25 0 00-.427-.177z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M8.854 11.646l5.792-5.792a.5.5 0 01.854.353v11.586a.5.5 0 01-.854.353l-5.792-5.792a.5.5 0 010-.708z\"></path>"
		}
	}
},
	"triangle-right": {
	name: "triangle-right",
	keywords: [
		"arrow",
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M6.427 4.427l3.396 3.396a.25.25 0 010 .354l-3.396 3.396A.25.25 0 016 11.396V4.604a.25.25 0 01.427-.177z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M15.146 12.354l-5.792 5.792a.5.5 0 01-.854-.353V6.207a.5.5 0 01.854-.353l5.792 5.792a.5.5 0 010 .708z\"></path>"
		}
	}
},
	"triangle-up": {
	name: "triangle-up",
	keywords: [
		"arrow",
		"point",
		"direction"
	],
	heights: {
		"16": {
			width: 16,
			path: "<path d=\"M4.427 9.573l3.396-3.396a.25.25 0 01.354 0l3.396 3.396a.25.25 0 01-.177.427H4.604a.25.25 0 01-.177-.427z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M12.354 8.854l5.792 5.792a.5.5 0 01-.353.854H6.207a.5.5 0 01-.353-.854l5.792-5.792a.5.5 0 01.708 0z\"></path>"
		}
	}
},
	typography: typography,
	unfold: unfold,
	unlock: unlock,
	unmute: unmute,
	unverified: unverified,
	upload: upload,
	verified: verified,
	versions: versions,
	video: video,
	workflow: workflow,
	x: x,
	"x-circle": {
	name: "x-circle",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M3.404 12.596a6.5 6.5 0 119.192-9.192 6.5 6.5 0 01-9.192 9.192zM2.344 2.343a8 8 0 1011.313 11.314A8 8 0 002.343 2.343zM6.03 4.97a.75.75 0 00-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 101.06 1.06L8 9.06l1.97 1.97a.75.75 0 101.06-1.06L9.06 8l1.97-1.97a.75.75 0 10-1.06-1.06L8 6.94 6.03 4.97z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path d=\"M9.036 7.976a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z\"></path><path fill-rule=\"evenodd\" d=\"M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z\"></path>"
		}
	}
},
	"x-circle-fill": {
	name: "x-circle-fill",
	keywords: [
	],
	heights: {
		"16": {
			width: 16,
			path: "<path fill-rule=\"evenodd\" d=\"M2.343 13.657A8 8 0 1113.657 2.343 8 8 0 012.343 13.657zM6.03 4.97a.75.75 0 00-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 101.06 1.06L8 9.06l1.97 1.97a.75.75 0 101.06-1.06L9.06 8l1.97-1.97a.75.75 0 10-1.06-1.06L8 6.94 6.03 4.97z\"></path>"
		},
		"24": {
			width: 24,
			path: "<path fill-rule=\"evenodd\" d=\"M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.036-4.024a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z\"></path>"
		}
	}
},
	zap: zap
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty$1.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

const DEFAULT_HEIGHT = 16;

for (const key of Object.keys(data$1)) {
  // Returns a string representation of html attributes
  const htmlAttributes = (icon, defaultOptions, options) => {
    const attributes = [];
    const attrObj = objectAssign({}, defaultOptions, options);

    // If the user passed in options
    if (options) {
      // If any of the width or height is passed in
      if (options['width'] || options['height']) {
        attrObj['width'] = options['width']
          ? options['width']
          : (parseInt(options['height']) * defaultOptions['width']) / defaultOptions['height'];
        attrObj['height'] = options['height']
          ? options['height']
          : (parseInt(options['width']) * defaultOptions['height']) / defaultOptions['width'];
      }

      // If the user passed in class
      if (options['class']) {
        attrObj['class'] = `octicon octicon-${key} ${options['class']}`;
        attrObj['class'].trim();
      }

      // If the user passed in aria-label
      if (options['aria-label']) {
        attrObj['aria-label'] = options['aria-label'];
        attrObj['role'] = 'img';

        // Un-hide the icon
        delete attrObj['aria-hidden'];
      }
    }

    for (const option of Object.keys(attrObj)) {
      attributes.push(`${option}="${attrObj[option]}"`);
    }

    return attributes.join(' ').trim()
  };

  // Set the symbol for easy access
  data$1[key].symbol = key;

  // Set options for each icon height
  for (const height of Object.keys(data$1[key].heights)) {
    data$1[key].heights[height].options = {
      version: '1.1',
      width: data$1[key].heights[height].width,
      height: parseInt(height),
      viewBox: `0 0 ${data$1[key].heights[height].width} ${height}`,
      class: `octicon octicon-${key}`,
      'aria-hidden': 'true'
    };
  }

  // Function to return an SVG object
  data$1[key].toSVG = function(options = {}) {
    const {height, width} = options;
    const naturalHeight = closestNaturalHeight(Object.keys(data$1[key].heights), height || width || DEFAULT_HEIGHT);
    return `<svg ${htmlAttributes(data$1[key], data$1[key].heights[naturalHeight].options, options)}>${
      data$1[key].heights[naturalHeight].path
    }</svg>`
  };
}

// Import data into exports
var octicons = data$1;

function closestNaturalHeight(naturalHeights, height) {
  return naturalHeights
    .map(naturalHeight => parseInt(naturalHeight, 10))
    .reduce((acc, naturalHeight) => (naturalHeight <= height ? naturalHeight : acc), naturalHeights[0])
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */
const reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.insertBefore(start, before);
        start = n;
    }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = window.trustedTypes &&
    trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        let value = this.getHTML();
        if (policy !== undefined) {
            // this is secure because `this.strings` is a TemplateStringsArray.
            // TODO: validate this when
            // https://github.com/tc39/proposal-array-is-template-object is
            // implemented.
            value = policy.createHTML(value);
        }
        template.innerHTML = value;
        return template;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        const parts = this.parts;
        // If we're assigning an attribute via syntax like:
        //    attr="${foo}"  or  attr=${foo}
        // but not
        //    attr="${foo} ${bar}" or attr="${foo} baz"
        // then we don't want to coerce the attribute value into one long
        // string. Instead we want to just return the value itself directly,
        // so that sanitizeDOMValue can get the actual value rather than
        // String(value)
        // The exception is if v is an array, in which case we do want to smash
        // it together into a string without calling String() on the array.
        //
        // This also allows trusted values (when using TrustedTypes) being
        // assigned to DOM sinks without being stringified in the process.
        if (l === 1 && strings[0] === '' && strings[1] === '') {
            const v = parts[0].value;
            if (typeof v === 'symbol') {
                return String(v);
            }
            if (typeof v === 'string' || !isIterable(v)) {
                return v;
            }
        }
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render$1 = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.4.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render$1(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = parts.get(renderContainer);
        parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof TemplateInstance ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        removeNodes(container, container.firstChild);
        container.appendChild(renderContainer);
        parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * Use this module if you want to create your own base class extending
 * [[UpdatingElement]].
 * @packageDocumentation
 */
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                // Type assert to adhere to Bazel's "must type assert JSON parse" rule.
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this
                    .requestUpdateInternal(name, oldValue, options);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._updateState = 0;
        this._updatePromise =
            new Promise((res) => this._enableUpdatingResolver = res);
        this._changedProperties = new Map();
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdateInternal();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This protected version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    requestUpdateInternal(name, oldValue, options) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            options = options || ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this.requestUpdateInternal(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this._hasRequestedUpdate) {
            return;
        }
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     * @deprecated Override `getUpdateComplete()` instead for forward
     *     compatibility with `lit-element` 3.0 / `@lit/reactive-element`.
     */
    _getUpdateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async getUpdateComplete() {
     *       await super.getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `supportsAdoptingStyleSheets` is true then we assume
            // CSSStyleSheet is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
/**
 * Wrap a value for interpolation in a [[`css`]] tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
};
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's [[LitElement.styles |
 * `styles`]] property to set element styles. For security reasons, only literal
 * string values may be used. To incorporate non-literal values [[`unsafeCSS`]]
 * may be used inside a template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.5.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the [[`properties`]] property or the [[`property`]] decorator.
 */
class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = userStyles === undefined ? [] : [userStyles];
        }
        // Ensure that there are no invalid CSSStyleSheet instances here. They are
        // invalid in two conditions.
        // (1) the sheet is non-constructible (`sheet` of a HTMLStyleElement), but
        //     this is impossible to check except via .replaceSync or use
        // (2) the ShadyCSS polyfill is enabled (:. supportsAdoptingStyleSheets is
        //     false)
        this._styles = this._styles.map((s) => {
            if (s instanceof CSSStyleSheet && !supportsAdoptingStyleSheets) {
                // Flatten the cssText from the passed constructible stylesheet (or
                // undetectable non-constructible stylesheet). The user might have
                // expected to update their stylesheets over time, but the alternative
                // is a crash.
                const cssText = Array.prototype.slice.call(s.cssRules)
                    .reduce((css, rule) => css + rule.cssText, '');
                return unsafeCSS(cssText);
            }
            return s;
        });
    }
    /**
     * Performs element initialization. By default this calls
     * [[`createRenderRoot`]] to create the element [[`renderRoot`]] node and
     * captures any pre-set values for registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot = this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow(this.constructor.shadowRootOptions);
    }
    /**
     * Applies styling to the element shadowRoot using the [[`styles`]]
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `NodePart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
LitElement['finalized'] = true;
/**
 * Reference to the underlying library method used to render the element's
 * DOM. By default, points to the `render` method from lit-html's shady-render
 * module.
 *
 * **Most users will never need to touch this property.**
 *
 * This  property should not be confused with the `render` instance method,
 * which should be overridden to define a template for the element.
 *
 * Advanced users creating a new base class based on LitElement can override
 * this property to point to a custom render method with a signature that
 * matches [shady-render's `render`
 * method](https://lit-html.polymer-project.org/api/modules/shady_render.html#render).
 *
 * @nocollapse
 */
LitElement.render = render;
/** @nocollapse */
LitElement.shadowRootOptions = { mode: 'open' };

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// For each part, remember the value that was last rendered to the part by the
// unsafeSVG directive, and the DocumentFragment that was last set as a value.
// The DocumentFragment is used as a unique key to check if the last value
// rendered to the part was with unsafeSVG. If not, we'll always re-render the
// value passed to unsafeSVG.
const previousValues = new WeakMap();
const isIe = window.navigator.userAgent.indexOf('Trident/') > 0;
/**
 * Renders the result as SVG, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */
const unsafeSVG = directive((value) => (part) => {
    if (!(part instanceof NodePart)) {
        throw new Error('unsafeSVG can only be used in text bindings');
    }
    const previousValue = previousValues.get(part);
    if (previousValue !== undefined && isPrimitive(value) &&
        value === previousValue.value && part.value === previousValue.fragment) {
        return;
    }
    const template = document.createElement('template');
    const content = template.content;
    let svgElement;
    if (isIe) {
        // IE can't set innerHTML of an svg element. However, it also doesn't
        // support Trusted Types, so it's ok for us to use a string when setting
        // innerHTML.
        template.innerHTML = `<svg>${value}</svg>`;
        svgElement = content.firstChild;
    }
    else {
        svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        content.appendChild(svgElement);
        svgElement.innerHTML = value;
    }
    content.removeChild(svgElement);
    reparentNodes(content, svgElement.firstChild);
    const fragment = document.importNode(content, true);
    part.setValue(fragment);
    previousValues.set(part, { value, fragment });
});

class MenuElement extends LitElement {
  constructor() {
    super();
    this.placement = '';
  }

  static get properties() {
    return {
      placement: { type: String },
      href: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        background-color: white;
        opacity: 0.5;
        transition: opacity 0.2s ease-in-out;

        width: 24px;
        height: 24px;
        border-radius: 12px;

        top: initial;
        right: 0;
        bottom: 0;
        left: initial;
      }

      :host(:hover) {
        opacity: 0.8;
      }

      a {
        display: block;
        padding: 4px;
      }

      a svg {
        display: block;
        transform: translateY(0.5px);
      }

      :host([placement='top-left']) {
        top: 0;
        right: initial;
        bottom: initial;
        left: 0;
      }

      :host([placement='top-right']) {
        top: 0;
        right: 0;
        bottom: initial;
        left: initial;
      }

      :host([placement='bottom-left']) {
        top: initial;
        right: initial;
        bottom: 0;
        left: 0;
      }

      :host([placement='none']) {
        display: none;
      }
    `;
  }

  render() {
    return html`<a
      class="dropdown-item"
      href=${this.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      ${unsafeSVG(octicons.info.toSVG({ width: 16 }))}
    </a>`;
  }
}

MenuElement.customElementName = 'togostanza--menu';

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$1 = root$1.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root$1, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$2(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var lodash_get = get$2;

class ContainerElement extends HTMLElement {
  dataSourceUrls = {};

  connectedCallback() {
    setTimeout(() => { // wait until stanzas ready
      const stanzaElements = Array.from(
        this.querySelectorAll('*')
      ).filter((el) => el.tagName.startsWith('TOGOSTANZA-') && 'stanza' in el);

      connectStanzasWithAttributes(this, stanzaElements);
      connectStanzasWithHandler(stanzaElements);
      connectDataSource(this);
    }, 0);
  }

  disconnectedCallback() {
    for (const entry of Object.values(this.dataSourceUrls)) {
      URL.revokeObjectURL(entry.value);
    }
  }

  async dataSourceUrlChanged(oldUrl, newUrl, receiver, targetAttribute) {
    this.disposeDataSourceUrl(oldUrl);

    const receiverElements = this.querySelectorAll(receiver);

    if (newUrl) {
      const objectUrl = await this.getOrCreateObjectUrl(newUrl);

      setEach(receiverElements, targetAttribute, objectUrl);
    } else {
      removeEach(receiverElements, targetAttribute);
    }
  }

  async getOrCreateObjectUrl(url) {
    const entry = this.dataSourceUrls[url];

    if (entry) {
      entry.count++;
      return entry.value;
    }

    const blob      = await fetch(url).then(res => res.blob());
    const objectUrl = URL.createObjectURL(blob);

    this.dataSourceUrls[url] = {
      value: objectUrl,
      count: 1
    };

    return objectUrl;
  }

  disposeDataSourceUrl(url) {
    const entry = this.dataSourceUrls[url];

    if (!entry) { return; }

    entry.count--;

    if (entry.count === 0) {
      URL.revokeObjectURL(entry.value);

      delete this.dataSourceUrls[url];
    }
  }
}

ContainerElement.customElementName = 'togostanza--container';

function connectStanzasWithHandler(stanzaElements) {
  for (const srcEl of stanzaElements) {
    for (const eventName of outgoingEventNames(srcEl.stanza)) {
      srcEl.addEventListener(eventName, (event) => {
        for (const destEl of stanzaElements) {
          if (incomingEventNames(destEl.stanza).includes(eventName)) {
            destEl.stanza.handleEvent(event);
          }
        }
      });
    }
  }
}

function connectStanzasWithAttributes(container, stanzaElements) {
  for (const mapElement of container.querySelectorAll('togostanza--event-map')) {
    const on              = mapElement.getAttribute('on');
    const receiver        = mapElement.getAttribute('receiver');
    const targetAttribute = mapElement.getAttribute('target-attribute');
    const valuePath       = mapElement.getAttribute('value-path');

    const receiverElements = container.querySelectorAll(receiver);

    for (const srcEl of stanzaElements) {
      if (!outgoingEventNames(srcEl.stanza).includes(on)) { continue; }

      srcEl.addEventListener(on, (event) => {
        const value = valuePath ? lodash_get(event.detail, valuePath) : event.detail;

        if (value === true) {
          setEach(receiverElements, targetAttribute, '');
        } else if (value === false || value === undefined) {
          removeEach(receiverElements, targetAttribute);
        } else if (value.constructor === String) { // a bit weird, but a unified way to determine string literals and objects
          setEach(receiverElements, targetAttribute, value);
        } else {
          setEach(receiverElements, targetAttribute, JSON.stringify(value));
        }
      });
    }
  }
}

function connectDataSource(container) {
  for (const dataSource of container.querySelectorAll('togostanza--data-source')) {
    dataSource.containerElement = container;

    const url             = dataSource.getAttribute('url');
    const receiver        = dataSource.getAttribute('receiver');
    const targetAttribute = dataSource.getAttribute('target-attribute');

    container.dataSourceUrlChanged(null, url, receiver, targetAttribute);
  }
}

function setEach(elements, key, value) {
  for (const el of elements) {
    el.setAttribute(key, value);
  }
}

function removeEach(elements, key) {
  for (const el of elements) {
    el.removeAttribute(key);
  }
}

function outgoingEventNames(stanza) {
  return stanza.metadata['stanza:outgoingEvent']?.map(e => e['stanza:key']) || [];
}

function incomingEventNames(stanza) {
  return stanza.metadata['stanza:incomingEvent']?.map(e => e['stanza:key']) || [];
}

class DataSourceElement extends HTMLElement {
  attributeChangedCallback(key, oldVal, newVal) {
    if (key !== 'url') { return; }

    const receiver        = this.getAttribute('receiver');
    const targetAttribute = this.getAttribute('target-attribute');

    this.containerElement?.dataSourceUrlChanged(oldVal, newVal, receiver, targetAttribute);
  }
}

DataSourceElement.observedAttributes = ['url'];
DataSourceElement.customElementName = 'togostanza--data-source';

var utils = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}

});

var exception = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
var errorProps = ['description', 'fileName', 'lineNumber', 'endLineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      endLineNumber = undefined,
      column = undefined,
      endColumn = undefined;

  if (loc) {
    line = loc.start.line;
    endLineNumber = loc.end.line;
    column = loc.start.column;
    endColumn = loc.end.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  try {
    if (loc) {
      this.lineNumber = line;
      this.endLineNumber = endLineNumber;

      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', {
          value: column,
          enumerable: true
        });
        Object.defineProperty(this, 'endColumn', {
          value: endColumn,
          enumerable: true
        });
      } else {
        this.column = column;
        this.endColumn = endColumn;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];

});

var blockHelperMissing = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = utils.createFrame(options.data);
        data.contextPath = utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];

});

var each = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }





var _exception2 = _interopRequireDefault(exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else if (commonjsGlobal.Symbol && context[commonjsGlobal.Symbol.iterator]) {
        var newContext = [];
        var iterator = context[commonjsGlobal.Symbol.iterator]();
        for (var it = iterator.next(); !it.done; it = iterator.next()) {
          newContext.push(it.value);
        }
        context = newContext;
        for (var j = context.length; i < j; i++) {
          execIteration(i, i, i === context.length - 1);
        }
      } else {
        (function () {
          var priorKey = undefined;

          Object.keys(context).forEach(function (key) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          });
          if (priorKey !== undefined) {
            execIteration(priorKey, i - 1, true);
          }
        })();
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];

});

var helperMissing = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }



var _exception2 = _interopRequireDefault(exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];

});

var _if = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }





var _exception2 = _interopRequireDefault(exception);

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (arguments.length != 2) {
      throw new _exception2['default']('#if requires exactly one argument');
    }
    if (utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    if (arguments.length != 2) {
      throw new _exception2['default']('#unless requires exactly one argument');
    }
    return instance.helpers['if'].call(this, conditional, {
      fn: options.inverse,
      inverse: options.fn,
      hash: options.hash
    });
  });
};

module.exports = exports['default'];

});

var log$1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];

});

var lookup = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field, options) {
    if (!obj) {
      // Note for 5.0: Change to "obj == null" in 5.0
      return obj;
    }
    return options.lookupProperty(obj, field);
  });
};

module.exports = exports['default'];

});

var _with = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }





var _exception2 = _interopRequireDefault(exception);

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (arguments.length != 2) {
      throw new _exception2['default']('#with requires exactly one argument');
    }
    if (utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = utils.createFrame(options.data);
        data.contextPath = utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];

});

var registerDefaultHelpers_1 = registerDefaultHelpers;
var moveHelperToHooks_1 = moveHelperToHooks;
// istanbul ignore next

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }



var _helpersBlockHelperMissing2 = _interopRequireDefault$3(blockHelperMissing);



var _helpersEach2 = _interopRequireDefault$3(each);



var _helpersHelperMissing2 = _interopRequireDefault$3(helperMissing);



var _helpersIf2 = _interopRequireDefault$3(_if);



var _helpersLog2 = _interopRequireDefault$3(log$1);



var _helpersLookup2 = _interopRequireDefault$3(lookup);



var _helpersWith2 = _interopRequireDefault$3(_with);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}

function moveHelperToHooks(instance, helperName, keepHelper) {
  if (instance.helpers[helperName]) {
    instance.hooks[helperName] = instance.helpers[helperName];
    if (!keepHelper) {
      delete instance.helpers[helperName];
    }
  }
}


var helpers = /*#__PURE__*/Object.defineProperty({
	registerDefaultHelpers: registerDefaultHelpers_1,
	moveHelperToHooks: moveHelperToHooks_1
}, '__esModule', {value: true});

var inline = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];

});

var registerDefaultDecorators_1 = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }



var _decoratorsInline2 = _interopRequireDefault$2(inline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


var decorators = /*#__PURE__*/Object.defineProperty({
	registerDefaultDecorators: registerDefaultDecorators_1
}, '__esModule', {value: true});

var logger_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      // eslint-disable-next-line no-console
      if (!console[method]) {
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];

});

var createNewLookupObject_2 = createNewLookupObject;



/**
 * Create a new object with "null"-prototype to avoid truthy results on prototype properties.
 * The resulting object can be used with "object[property]" to check if a property exists
 * @param {...object} sources a varargs parameter of source objects that will be merged
 * @returns {object}
 */

function createNewLookupObject() {
  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return utils.extend.apply(undefined, [Object.create(null)].concat(sources));
}


var createNewLookupObject_1 = /*#__PURE__*/Object.defineProperty({
	createNewLookupObject: createNewLookupObject_2
}, '__esModule', {value: true});

var createProtoAccessControl_1 = createProtoAccessControl;
var resultIsAllowed_1 = resultIsAllowed;
var resetLoggedProperties_1 = resetLoggedProperties;
// istanbul ignore next

function _interopRequireWildcard$1(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }





var logger$1 = _interopRequireWildcard$1(logger_1);

var loggedProperties = Object.create(null);

function createProtoAccessControl(runtimeOptions) {
  var defaultMethodWhiteList = Object.create(null);
  defaultMethodWhiteList['constructor'] = false;
  defaultMethodWhiteList['__defineGetter__'] = false;
  defaultMethodWhiteList['__defineSetter__'] = false;
  defaultMethodWhiteList['__lookupGetter__'] = false;

  var defaultPropertyWhiteList = Object.create(null);
  // eslint-disable-next-line no-proto
  defaultPropertyWhiteList['__proto__'] = false;

  return {
    properties: {
      whitelist: createNewLookupObject_1.createNewLookupObject(defaultPropertyWhiteList, runtimeOptions.allowedProtoProperties),
      defaultValue: runtimeOptions.allowProtoPropertiesByDefault
    },
    methods: {
      whitelist: createNewLookupObject_1.createNewLookupObject(defaultMethodWhiteList, runtimeOptions.allowedProtoMethods),
      defaultValue: runtimeOptions.allowProtoMethodsByDefault
    }
  };
}

function resultIsAllowed(result, protoAccessControl, propertyName) {
  if (typeof result === 'function') {
    return checkWhiteList(protoAccessControl.methods, propertyName);
  } else {
    return checkWhiteList(protoAccessControl.properties, propertyName);
  }
}

function checkWhiteList(protoAccessControlForType, propertyName) {
  if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
    return protoAccessControlForType.whitelist[propertyName] === true;
  }
  if (protoAccessControlForType.defaultValue !== undefined) {
    return protoAccessControlForType.defaultValue;
  }
  logUnexpecedPropertyAccessOnce(propertyName);
  return false;
}

function logUnexpecedPropertyAccessOnce(propertyName) {
  if (loggedProperties[propertyName] !== true) {
    loggedProperties[propertyName] = true;
    logger$1.log('error', 'Handlebars: Access has been denied to resolve the property "' + propertyName + '" because it is not an "own property" of its parent.\n' + 'You can add a runtime option to disable the check or this warning:\n' + 'See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details');
  }
}

function resetLoggedProperties() {
  Object.keys(loggedProperties).forEach(function (propertyName) {
    delete loggedProperties[propertyName];
  });
}


var protoAccess = /*#__PURE__*/Object.defineProperty({
	createProtoAccessControl: createProtoAccessControl_1,
	resultIsAllowed: resultIsAllowed_1,
	resetLoggedProperties: resetLoggedProperties_1
}, '__esModule', {value: true});

var HandlebarsEnvironment_1 = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }





var _exception2$1 = _interopRequireDefault$1(exception);







var _logger2 = _interopRequireDefault$1(logger_1);



var VERSION = '4.7.7';
var VERSION_1 = VERSION;
var COMPILER_REVISION = 8;
var COMPILER_REVISION_1 = COMPILER_REVISION;
var LAST_COMPATIBLE_COMPILER_REVISION = 7;

var LAST_COMPATIBLE_COMPILER_REVISION_1 = LAST_COMPATIBLE_COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0 <4.3.0',
  8: '>= 4.3.0'
};

var REVISION_CHANGES_1 = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers$1, partials, decorators$1) {
  this.helpers = helpers$1 || {};
  this.partials = partials || {};
  this.decorators = decorators$1 || {};

  helpers.registerDefaultHelpers(this);
  decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2$1['default']('Arg not supported with multiple helpers');
      }
      utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (utils.toString.call(name) === objectType) {
      utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2$1['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2$1['default']('Arg not supported with multiple decorators');
      }
      utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  },
  /**
   * Reset the memory of illegal property accesses that have already been logged.
   * @deprecated should only be used in handlebars test-cases
   */
  resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
    protoAccess.resetLoggedProperties();
  }
};

var log = _logger2['default'].log;

var log_1 = log;
var createFrame = utils.createFrame;
var logger = _logger2['default'];


var base = /*#__PURE__*/Object.defineProperty({
	HandlebarsEnvironment: HandlebarsEnvironment_1,
	VERSION: VERSION_1,
	COMPILER_REVISION: COMPILER_REVISION_1,
	LAST_COMPATIBLE_COMPILER_REVISION: LAST_COMPATIBLE_COMPILER_REVISION_1,
	REVISION_CHANGES: REVISION_CHANGES_1,
	log: log_1,
	createFrame: createFrame,
	logger: logger
}, '__esModule', {value: true});

var safeString = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];

});

var wrapHelper_2 = wrapHelper;

function wrapHelper(helper, transformOptionsFn) {
  if (typeof helper !== 'function') {
    // This should not happen, but apparently it does in https://github.com/wycats/handlebars.js/issues/1639
    // We try to make the wrapper least-invasive by not wrapping it, if the helper is not a function.
    return helper;
  }
  var wrapper = function wrapper() /* dynamic arguments */{
    var options = arguments[arguments.length - 1];
    arguments[arguments.length - 1] = transformOptionsFn(options);
    return helper.apply(this, arguments);
  };
  return wrapper;
}


var wrapHelper_1 = /*#__PURE__*/Object.defineProperty({
	wrapHelper: wrapHelper_2
}, '__esModule', {value: true});

var checkRevision_1 = checkRevision;
var template_1 = template;
var wrapProgram_1 = wrapProgram;
var resolvePartial_1 = resolvePartial;
var invokePartial_1 = invokePartial;
var noop_1 = noop$1;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }



var Utils = _interopRequireWildcard(utils);



var _exception2 = _interopRequireDefault(exception);









function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = base.COMPILER_REVISION;

  if (compilerRevision >= base.LAST_COMPATIBLE_COMPILER_REVISION && compilerRevision <= base.COMPILER_REVISION) {
    return;
  }

  if (compilerRevision < base.LAST_COMPATIBLE_COMPILER_REVISION) {
    var runtimeVersions = base.REVISION_CHANGES[currentRevision],
        compilerVersions = base.REVISION_CHANGES[compilerRevision];
    throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
  } else {
    // Use the embedded version info since the runtime doesn't know about this revision yet
    throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as pseudo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  // backwards compatibility for precompiled templates with compiler-version 7 (<4.3.0)
  var templateWasPrecompiledWithCompilerV7 = templateSpec.compiler && templateSpec.compiler[0] === 7;

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }
    partial = env.VM.resolvePartial.call(this, partial, context, options);

    var extendedOptions = Utils.extend({}, options, {
      hooks: this.hooks,
      protoAccessControl: this.protoAccessControl
    });

    var result = env.VM.invokePartial.call(this, partial, context, extendedOptions);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, extendedOptions);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name, loc) {
      if (!obj || !(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj, {
          loc: loc
        });
      }
      return container.lookupProperty(obj, name);
    },
    lookupProperty: function lookupProperty(parent, propertyName) {
      var result = parent[propertyName];
      if (result == null) {
        return result;
      }
      if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
        return result;
      }

      if (protoAccess.resultIsAllowed(result, container.protoAccessControl, propertyName)) {
        return result;
      }
      return undefined;
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        var result = depths[i] && container.lookupProperty(depths[i], name);
        if (result != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    mergeIfNeeded: function mergeIfNeeded(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },
    // An empty object to use as replacement for null-contexts
    nullContext: Object.seal({}),

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }

    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }

  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      var mergedHelpers = Utils.extend({}, env.helpers, options.helpers);
      wrapHelpersToPassLookupProperty(mergedHelpers, container);
      container.helpers = mergedHelpers;

      if (templateSpec.usePartial) {
        // Use mergeIfNeeded here to prevent compiling global partials multiple times
        container.partials = container.mergeIfNeeded(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = Utils.extend({}, env.decorators, options.decorators);
      }

      container.hooks = {};
      container.protoAccessControl = protoAccess.createProtoAccessControl(options);

      var keepHelperInHelpers = options.allowCallsToHelperMissing || templateWasPrecompiledWithCompilerV7;
      helpers.moveHelperToHooks(container, 'helperMissing', keepHelperInHelpers);
      helpers.moveHelperToHooks(container, 'blockHelperMissing', keepHelperInHelpers);
    } else {
      container.protoAccessControl = options.protoAccessControl; // internal option
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
      container.hooks = options.hooks;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

/**
 * This is currently part of the official API, therefore implementation details should not be changed.
 */

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  // Use the current closure context to save the partial-block if this partial
  var currentPartialBlock = options.data && options.data['partial-block'];
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop$1) {
    (function () {
      options.data = base.createFrame(options.data);
      // Wrapper function to get access to currentPartialBlock from the closure
      var fn = options.fn;
      partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        // Restore the partial-block from the closure for the execution of the block
        // i.e. the part inside the block of the partial call.
        options.data = base.createFrame(options.data);
        options.data['partial-block'] = currentPartialBlock;
        return fn(context, options);
      };
      if (fn.partials) {
        options.partials = Utils.extend({}, options.partials, fn.partials);
      }
    })();
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop$1() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}

function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
  Object.keys(mergedHelpers).forEach(function (helperName) {
    var helper = mergedHelpers[helperName];
    mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
  });
}

function passLookupPropertyOption(helper, container) {
  var lookupProperty = container.lookupProperty;
  return wrapHelper_1.wrapHelper(helper, function (options) {
    return Utils.extend({ lookupProperty: lookupProperty }, options);
  });
}


var runtime$1 = /*#__PURE__*/Object.defineProperty({
	checkRevision: checkRevision_1,
	template: template_1,
	wrapProgram: wrapProgram_1,
	resolvePartial: resolvePartial_1,
	invokePartial: invokePartial_1,
	noop: noop_1
}, '__esModule', {value: true});

var noConflict = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];

});

var handlebars_runtime = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }



var base$1 = _interopRequireWildcard(base);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)



var _handlebarsSafeString2 = _interopRequireDefault(safeString);



var _handlebarsException2 = _interopRequireDefault(exception);



var Utils = _interopRequireWildcard(utils);



var runtime = _interopRequireWildcard(runtime$1);



var _handlebarsNoConflict2 = _interopRequireDefault(noConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base$1.HandlebarsEnvironment();

  Utils.extend(hb, base$1);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];

});

// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
var runtime = handlebars_runtime['default'];

/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

var lodash_isequal = createCommonjsModule(function (module, exports) {
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;
});

function grouping(objs, ...keys) {
  const normalizedKeys = keys.map((key) => {
    if (key instanceof Array) {
      return {key, alias: key.join('_')};
    } else if (key instanceof Object) {
      return key;
    } else {
      return {key, alias: key};
    }
  });

  return _grouping(objs, normalizedKeys);
}

function _grouping(objs, keys, acc = {}) {
  const [currentKey, ...remainKeys] = keys;

  return groupBy(objs, obj => pluckKeyOrKeys(obj, currentKey.key)).map(([currentValue, remainValues]) => {
    if (remainKeys.length === 0) {
      return currentValue;
    } else {
      const nextKey = remainKeys[0];

      return {
        [currentKey.alias]: currentValue,
        [nextKey.alias]:    _grouping(remainValues, remainKeys)
      };
    }
  });
}

function groupBy(objs, keyFn) {
  const ret = [];

  objs.forEach((obj) => {
    const key   = keyFn(obj);
    const entry = ret.find(([existKey]) => lodash_isequal(existKey, key));

    if (entry) {
      entry[1].push(obj);
    } else {
      ret.push([key, [obj]]);
    }
  });

  return ret;
}

function pluckKeyOrKeys(obj, key) {
  return key instanceof Array ? key.map((k) => obj[k]) : obj[key];
}

function unwrapValueFromBinding(queryResult) {
  const bindings = queryResult.results.bindings;

  return bindings.map((binding) => {
    const ret = {};

    Object.keys(binding).forEach((key) => {
      ret[key] = binding[key].value;
    });

    return ret;
  });
}

class Stanza {
  constructor(host, metadata, templates, url, handleEvent) {
    this.host        = host;
    this.root        = host.shadowRoot;
    this.metadata    = metadata;
    this.url         = url;
    this.handleEvent = handleEvent;

    const handlebarsRuntime = runtime.create();

    this.templates = Object.fromEntries(templates.map(([name, spec]) => {
      return [name, handlebarsRuntime.template(spec)];
    }));

    const bbox = document.createElement('div');
    bbox.style.position = 'relative';

    const main = document.createElement('main');
    main.style.overflow = 'auto';
    bbox.appendChild(main);

    this.menu = document.createElement('togostanza--menu');
    this.menu.setAttribute('href', url.replace(/\.js$/, '.html'));
    this.setMenuPlacement(host.getAttribute('togostanza-menu-placement'));

    bbox.appendChild(this.menu);

    this.root.appendChild(bbox);

    // TODO migrate
    this.grouping               = grouping;
    this.unwrapValueFromBinding = unwrapValueFromBinding;
  }

  setMenuPlacement(placement) {
    if (placement) {
      this.menu.setAttribute('placement', placement);
    } else {
      this.menu.removeAttribute('placement');
    }
  }

  select(selector) {
    return this.root.querySelector(selector);
  }

  selectAll(selector) {
    return this.root.querySelectorAll(selector);
  }

  render({template: templateName, parameters, selector}) {
    const template = this.templates[templateName];

    if (!template) {
      throw new Error(`template "${templateName}" is missing, available templates: ${Object.keys(this.templates).join(', ')}`);
    }

    const html = template(parameters);

    this.select(selector || 'main').innerHTML = html;
  }

  async query({template, parameters, endpoint, method}) {
    const sparql  = this.templates[template](parameters);
    const payload = new URLSearchParams();

    payload.set('query', sparql);

    // NOTE specifying Content-Type explicitly because some browsers sends `application/x-www-form-urlencoded;charset=UTF-8` without this, and some endpoints may not support this form.
    return await fetch(endpoint, {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept':       'application/sparql-results+json'
      },
      body: payload
    }).then((res) => res.json());
  }

  importWebFontCSS(cssUrl) {
    const el = document.createElement('link');

    el.rel  = 'stylesheet';
    el.type = 'text/css';
    el.href = new URL(cssUrl, this.url).href;

    document.head.appendChild(el);
    this.root.appendChild(el.cloneNode());
  }
}

async function defineStanzaElement({stanzaModule, metadata, templates, url}) {
  const id        = metadata['@id'];
  const paramKeys = metadata['stanza:parameter'].map(param => param['stanza:key']);

  class StanzaElement extends HTMLElement {
    constructor() {
      super(...arguments);

      this.renderDebounced = lodash_debounce(() => {
        this.render();
      }, 50);

      ensureBuiltinElementsDefined();

      this.attachShadow({mode: 'open'});

      const handleEvent = (event) => {
        stanzaModule.handleEvent?.(this.stanza, this.params, event);
      };

      this.stanza = new Stanza(this, metadata, templates, url, handleEvent);
    }

    connectedCallback() {
      const hostStyle = document.createElement('style');
      hostStyle.append(cssVariableDefaults(metadata['stanza:style']) || '');
      this.shadowRoot.append(hostStyle);

      const shadowStyleLink = document.createElement('link');
      shadowStyleLink.rel = 'stylesheet';
      shadowStyleLink.href = url.replace(/\.js$/, '.css');
      this.shadowRoot.append(shadowStyleLink);

      this.renderDebounced();
      this.renderDebounced.flush();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'togostanza-menu-placement') {
        this.stanza.setMenuPlacement(newValue);
        return;
      }

      if (stanzaModule.handleAttributeChange) {
        stanzaModule.handleAttributeChange(this.stanza, this.params, name, oldValue, newValue);
      } else {
        this.renderDebounced();
      }
    }

    get params() {
      return Object.fromEntries(
        metadata['stanza:parameter'].map((param) => {
          const key  = param['stanza:key'];
          const type = param['stanza:type'];

          if (type === 'boolean') {
            return [key, this.attributes.hasOwnProperty(key)];
          }

          const valueStr = this.attributes[key]?.value;

          if (valueStr === null || valueStr === undefined) {
            return [key, valueStr];
          }

          let value;

          switch (type) {
            case 'number':
              value = Number(valueStr);
              break;
            case 'date':
            case 'datetime':
              value = new Date(valueStr);
              break;
            case 'json':
              value = JSON.parse(valueStr);
              break;
            default:
              value = valueStr;
          }

          return [key, value];
        })
      );
    }

    render() {
      stanzaModule.default(this.stanza, this.params);
    }
  }

  StanzaElement.observedAttributes = [...paramKeys, 'togostanza-menu-placement'];

  customElements.define(`togostanza-${id}`, StanzaElement);
}

function cssVariableDefaults(defs) {
  if (!defs) { return null; }

  return defaultOutdent`
    :host {
    ${defs.map(def => `  ${def['stanza:key']}: ${def['stanza:default']};`).join('\n')}
    }
  `;
}

function ensureBuiltinElementsDefined() {
  for (const el of [MenuElement, ContainerElement, DataSourceElement]) {
    const name = el.customElementName;

    if (!customElements.get(name)) {
      customElements.define(name, el);
    }
  }
}

var noop = {value: () => {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames$1(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames$1(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function array(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function arrayAll(select) {
  return function() {
    var group = select.apply(this, arguments);
    return group == null ? [] : array(group);
  };
}

function selection_selectAll(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection$1(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

function selection_selectChild(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : childMatcher(match)));
}

var filter = Array.prototype.filter;

function children() {
  return this.children;
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

function selection_selectChildren(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant$2(x) {
  return function() {
    return x;
  };
}

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

function selection_data(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$2(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = array(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection$1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {
  if (!(selection instanceof Selection$1)) throw new Error("invalid merge");

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection$1(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection$1(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  return Array.from(this);
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS$1(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction$1(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS$1(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction$1(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove$1 : typeof value === "function"
            ? styleFunction$1
            : styleConstant$1)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction$1
          : textConstant$1)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

function* selection_iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

var root = [null];

function Selection$1(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection$1([[document.documentElement]], root);
}

function selection_selection() {
  return this;
}

Selection$1.prototype = selection.prototype = {
  constructor: Selection$1,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
      : new Selection$1([[selector]], root);
}

function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

function nopropagation(event) {
  event.stopImmediatePropagation();
}

function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function dragDisable(view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

var constant$1 = x => () => x;

function DragEvent(type, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x, y, dx, dy,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    subject: {value: subject, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    identifier: {value: identifier, enumerable: true, configurable: true},
    active: {value: active, enumerable: true, configurable: true},
    x: {value: x, enumerable: true, configurable: true},
    y: {value: y, enumerable: true, configurable: true},
    dx: {value: dx, enumerable: true, configurable: true},
    dy: {value: dy, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(event, d) {
  return d == null ? {x: event.x, y: event.y} : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function drag() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned(event, d) {
    if (touchending || !filter.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    dragDisable(event.view);
    nopropagation(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }

  function mousemoved(event) {
    noevent(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }

  function mouseupped(event) {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent(event);
    gestures.mouse("end", event);
  }

  function touchstarted(event, d) {
    if (!filter.call(this, event, d)) return;
    var touches = event.changedTouches,
        c = container.call(this, event, d),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        nopropagation(event);
        gesture("start", event, touches[i]);
      }
    }
  }

  function touchmoved(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent(event);
        gesture("drag", event, touches[i]);
      }
    }
  }

  function touchended(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event);
        gesture("end", event, touches[i]);
      }
    }
  }

  function beforestart(that, container, event, d, identifier, touch) {
    var dispatch = listeners.copy(),
        p = pointer(touch || event, container), dx, dy,
        s;

    if ((s = subject.call(that, new DragEvent("beforestart", {
        sourceEvent: event,
        target: drag,
        identifier,
        active,
        x: p[0],
        y: p[1],
        dx: 0,
        dy: 0,
        dispatch
      }), d)) == null) return;

    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;

    return function gesture(type, event, touch) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[identifier] = gesture, n = active++; break;
        case "end": delete gestures[identifier], --active; // nobreak
        case "drag": p = pointer(touch || event, container), n = active; break;
      }
      dispatch.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch
        }),
        d
      );
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant$1(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$1(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$1(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(")
      + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.b) || 0))
      + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(")
        + (this.h || 0) + ", "
        + (this.s || 0) * 100 + "%, "
        + (this.l || 0) * 100 + "%"
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

var constant = x => () => x;

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

var degrees = 180 / Math.PI;

var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var svgNode;

/* eslint-disable no-undef */
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}

function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var frame = 0, // is an animation frame pending?
    timeout$1 = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(elapsed => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get(this.node(), id).ease;
}

function easeVarying(id, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function") throw new Error;
    set(this, id).ease = v;
  };
}

function transition_easeVarying(value) {
  if (typeof value !== "function") throw new Error;
  return this.each(easeVarying(this._id, value));
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection = selection.prototype.constructor;

function transition_selection() {
  return new Selection(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = set(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction(tweenValue(this, "text", value))
      : textConstant(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = set(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });

    // The selection was empty, resolve end immediately
    if (size === 0) resolve();
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  easeVarying: transition_easeVarying,
  end: transition_end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id} not found`);
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

function appendDlButton(buttonDiv, svg, filename, stanza) {
  const dlButtonSVG = select(buttonDiv)
    .append("svg")
    .attr("id", "dl_button")
    .attr("width", 32)
    .attr("height", 32);
  const dlListDiv = select(buttonDiv)
    .append("div")
    .attr("id", "dl_list")
    .style("display", "none");
  const g = dlButtonSVG
    .append("g")
    .attr("class", "circle_g")
    .on("click", function () {
      if (dlListDiv.style("display") === "none") {
        dlListDiv.style("display", "block");
      } else {
        dlListDiv.style("display", "none");
      }
    })
    .on("mouseover", function () {
      this.classList.add("hover");
    })
    .on("mouseout", function () {
      this.classList.remove("hover");
    });
  g.append("circle")
    .attr("cx", 16)
    .attr("cy", 16)
    .attr("r", 15)
    .attr("fill", "#FFFFFF");
  // .attr("stroke", "#000000");
  g.append("circle")
    .attr("cx", 8)
    .attr("cy", 16)
    .attr("r", 2)
    .attr("fill", "#000000");
  g.append("circle")
    .attr("cx", 16)
    .attr("cy", 16)
    .attr("r", 2)
    .attr("fill", "#000000");
  g.append("circle")
    .attr("cx", 24)
    .attr("cy", 16)
    .attr("r", 2)
    .attr("fill", "#000000");

  const listData = [
    { text: "Save as SVG", type: "svg" },
    { text: "Save as PNG", type: "png" },
  ];

  const dlListUl = dlListDiv.append("ul");
  dlListUl
    .selectAll(".dl_type")
    .data(listData)
    .enter()
    .append("li")
    .attr("class", "dl_type")
    .text(function (d) {
      return d.text;
    })
    .on("click", function (e, d) {
      downloadImg(select(svg), d.type, filename, stanza);
      dlListDiv.style("display", "none");
    })
    .on("mouseover", function () {
      this.classList.add("hover");
    })
    .on("mouseout", function () {
      this.classList.remove("hover");
    });

  const downloadImg = function (svg, format, filename, stanza) {
    let url, img, canvas, context;
    const pngZoom = 2; // png resolution rate

    svg.attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg");

    let style = "";
    console.log(
      'stanza.root.querySelector("style")',
      stanza.root.querySelector("style")
    );
    if (stanza.root.host && stanza.root.querySelector("style")) {
      style += stanza.root
        .querySelector("style")
        .innerHTML.replace(/[\r\n]/g, "")
        .match(/^\s*:host\s*{(.+)}\s*$/)[1];
    }
    console.log("stanza.root.host", stanza.root.host);

    const outerCode = document
      .querySelector(".overflow-auto")
      .innerHTML.replace("<code>", "")
      .replace("</code>", "");
    const customizedStyle = outerCode
      .replaceAll('""', "")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .match(/<style>[\s\S]*?<\/style>/);
    if (customizedStyle) {
      //when customize styles exist
      style += customizedStyle[0]
        .replace("<style>", "")
        .replace("</style>", "")
        .replace(/[\r\n]/g, "")
        .match(/^\s*togostanza-.+\s{\s(.+\s)+}\s*$/)[1];
    }

    const tmp = svg.node().outerHTML.match(/^([^>]+>)([\s\S]+)$/);
    const string = tmp[1] + "<style>svg{" + style + "}</style>" + tmp[2];
    const w = parseInt(svg.style("width"));
    const h = parseInt(svg.style("height"));

    // downloading function
    const aLinkClickDL = function () {
      if (format === "png") {
        context.drawImage(img, 0, 0, w, h, 0, 0, w * pngZoom, h * pngZoom);
        url = canvas.node().toDataURL("image/png");
      }

      const a = select("body").append("a");
      a.attr("class", "downloadLink")
        .attr("download", filename)
        .attr("href", url)
        .text("test")
        .style("display", "none");

      a.node().click();

      setTimeout(function () {
        window.URL.revokeObjectURL(url);
        if (format === "png") {
          canvas.remove();
        }
        a.remove();
      }, 10);
    };

    if (format === "svg") {
      // SVG
      filename += ".svg";
      const blobObject = new Blob([string], {
        type: "data:image/svg+xml;base64",
      });
      url = window.URL.createObjectURL(blobObject);
      aLinkClickDL();
    } else if (format === "png") {
      // PNG
      console.log(string);
      filename += ".png";
      img = new Image();
      img.src = "data:image/svg+xml;utf8," + encodeURIComponent(string);
      img.addEventListener("load", aLinkClickDL, false);

      canvas = select("body")
        .append("canvas")
        .attr("width", w * pngZoom)
        .attr("height", h * pngZoom)
        .style("display", "none");
      context = canvas.node().getContext("2d");
    }
  };
}

var dataset$1 = {
	"Study name is not half-width character.": [
		{
			"not provided": {
				"not provided": {
					condition1: "not provided",
					condition2: "hepatitis B",
					variants: [
						{
							ref: "A",
							stop: 14705100,
							"p-value": 0.0000467,
							start: 14705100,
							alt: "C",
							rsId: "rs7511708",
							chr: "chr1"
						},
						{
							gene_name: "NEK7",
							ref: "C",
							stop: 198097051,
							"p-value": 0.0000255,
							start: 198097051,
							alt: "T",
							rsId: "rs2226273",
							entrez_id: 140609,
							chr: "chr1"
						},
						{
							gene_name: "PLD5",
							ref: "G",
							stop: 242198204,
							"p-value": 0.0000401,
							start: 242198204,
							alt: "A",
							rsId: "rs871243",
							entrez_id: 200150,
							chr: "chr1"
						},
						{
							gene_name: "STAT4",
							ref: "G",
							stop: 191966452,
							"p-value": 0.0000402,
							start: 191966452,
							alt: "C",
							rsId: "rs7568275",
							entrez_id: 6775,
							chr: "chr2"
						},
						{
							gene_name: "STAT4",
							ref: "G",
							stop: 191969879,
							"p-value": 0.0000626,
							start: 191969879,
							alt: "C",
							rsId: "rs10181656",
							entrez_id: 6775,
							chr: "chr2"
						},
						{
							gene_name: "STAT4",
							ref: "C",
							stop: 191970120,
							"p-value": 0.0000294,
							start: 191970120,
							alt: "G",
							rsId: "rs7582694",
							entrez_id: 6775,
							chr: "chr2"
						},
						{
							gene_name: "CACNA2D3",
							ref: "G",
							stop: 54477378,
							"p-value": 0.0000531,
							start: 54477378,
							alt: "A",
							rsId: "rs11922560",
							entrez_id: 55799,
							chr: "chr3"
						},
						{
							gene_name: "RNF150",
							ref: "T",
							stop: 142011012,
							"p-value": 0.0000654,
							start: 142011012,
							alt: "C",
							rsId: "rs11931358",
							entrez_id: 57484,
							chr: "chr4"
						},
						{
							gene_name: "TENM2",
							ref: "C",
							stop: 165128192,
							"p-value": 0.0000971,
							start: 165128192,
							alt: "A",
							rsId: "rs4090557",
							entrez_id: 57451,
							chr: "chr5"
						},
						{
							gene_name: "TENM2",
							ref: "A",
							stop: 166456414,
							"p-value": 0.0000301,
							start: 166456414,
							alt: "C",
							rsId: "rs7708152",
							entrez_id: 57451,
							chr: "chr5"
						},
						{
							gene_name: "TENM2",
							ref: "C",
							stop: 166478982,
							"p-value": 0.0000987,
							start: 166478982,
							alt: "T",
							rsId: "rs11960582",
							entrez_id: 57451,
							chr: "chr5"
						},
						{
							gene_name: "OR5V1",
							ref: "T",
							stop: 29316852,
							"p-value": 0.000013,
							start: 29316852,
							alt: "C",
							rsId: "rs10447393",
							entrez_id: 81696,
							chr: "chr6"
						},
						{
							gene_name: "RAN",
							ref: "A",
							stop: 30434566,
							"p-value": 0.0000137,
							start: 30434566,
							alt: "G",
							rsId: "rs7764934",
							entrez_id: 5901,
							chr: "chr6"
						},
						{
							gene_name: "RAN",
							ref: "G",
							stop: 30446055,
							"p-value": 0.0000233,
							start: 30446055,
							alt: "A",
							rsId: "rs9295897",
							entrez_id: 5901,
							chr: "chr6"
						},
						{
							gene_name: "RAN",
							ref: "C",
							stop: 30449046,
							"p-value": 0.0000177,
							start: 30449046,
							alt: "T",
							rsId: "rs9295898",
							entrez_id: 5901,
							chr: "chr6"
						},
						{
							gene_name: "PPP1R10",
							ref: "A",
							stop: 30560796,
							"p-value": 0.0000198,
							start: 30560796,
							alt: "G",
							rsId: "rs13195066",
							entrez_id: 5514,
							chr: "chr6"
						},
						{
							gene_name: "ATAT1",
							ref: "T",
							stop: 30601067,
							"p-value": 0.00000716,
							start: 30601067,
							alt: "C",
							rsId: "rs13201129",
							entrez_id: 79969,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "A",
							stop: 30772378,
							"p-value": 5.03e-8,
							start: 30772378,
							alt: "G",
							rsId: "rs3094123",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "T",
							stop: 30782105,
							"p-value": 0.0000949,
							start: 30782105,
							alt: "C",
							rsId: "rs2894046",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "G",
							stop: 30786676,
							"p-value": 0.0000825,
							start: 30786676,
							alt: "A",
							rsId: "rs9348843",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "T",
							stop: 30788191,
							"p-value": 3.79e-8,
							start: 30788191,
							alt: "C",
							rsId: "rs3094111",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "T",
							stop: 30796738,
							"p-value": 1.91e-8,
							start: 30796738,
							alt: "C",
							rsId: "rs3130785",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "C",
							stop: 30800326,
							"p-value": 0.0000236,
							start: 30800326,
							alt: "T",
							rsId: "rs3130648",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "C",
							stop: 30822413,
							"p-value": 0.0000106,
							start: 30822413,
							alt: "T",
							rsId: "rs3095345",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "G",
							stop: 30853796,
							"p-value": 0.0000206,
							start: 30853796,
							alt: "A",
							rsId: "rs3131034",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "CDSN",
							ref: "A",
							stop: 31085200,
							"p-value": 0.0000608,
							start: 31085200,
							alt: "G",
							rsId: "rs3132553",
							entrez_id: 1041,
							chr: "chr6"
						},
						{
							gene_name: "CDSN",
							ref: "A",
							stop: 31085269,
							"p-value": 0.0000875,
							start: 31085269,
							alt: "G",
							rsId: "rs3132552",
							entrez_id: 1041,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "G",
							stop: 31086048,
							"p-value": 8.58e-7,
							start: 31086048,
							alt: "A",
							rsId: "rs3132550",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "G",
							stop: 31086402,
							"p-value": 0.0000222,
							start: 31086402,
							alt: "A",
							rsId: "rs3094211",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "C",
							stop: 31087240,
							"p-value": 0.0000144,
							start: 31087240,
							alt: "T",
							rsId: "rs3095323",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "T",
							stop: 31087908,
							"p-value": 0.0000207,
							start: 31087908,
							alt: "G",
							rsId: "rs3132547",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "A",
							stop: 31088232,
							"p-value": 0.0000205,
							start: 31088232,
							alt: "G",
							rsId: "rs2302398",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "C",
							stop: 31088241,
							"p-value": 0.0000166,
							start: 31088241,
							alt: "T",
							rsId: "rs2302397",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "G",
							stop: 31098832,
							"p-value": 2.54e-9,
							start: 31098832,
							alt: "A",
							rsId: "rs3131009",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C2",
							ref: "T",
							stop: 31107087,
							"p-value": 0.00000149,
							start: 31107087,
							alt: "C",
							rsId: "rs3094663",
							entrez_id: 170680,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "C",
							stop: 31107648,
							"p-value": 4.11e-7,
							start: 31107648,
							alt: "T",
							rsId: "rs1063646",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "G",
							stop: 31109882,
							"p-value": 0.00000237,
							start: 31109882,
							alt: "T",
							rsId: "rs1265086",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "T",
							stop: 31111400,
							"p-value": 7.66e-8,
							start: 31111400,
							alt: "C",
							rsId: "rs9263740",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "A",
							stop: 31113030,
							"p-value": 0.00000164,
							start: 31113030,
							alt: "G",
							rsId: "rs3132539",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "G",
							stop: 31114515,
							"p-value": 4.66e-7,
							start: 31114515,
							alt: "A",
							rsId: "rs9263749",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "A",
							stop: 31115874,
							"p-value": 0.00000111,
							start: 31115874,
							alt: "G",
							rsId: "rs9263758",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "POU5F1",
							ref: "A",
							stop: 31137165,
							"p-value": 8.46e-8,
							start: 31137165,
							alt: "G",
							rsId: "rs3130503",
							entrez_id: 5460,
							chr: "chr6"
						},
						{
							gene_name: "HCG27",
							ref: "A",
							stop: 31145271,
							"p-value": 1.92e-7,
							start: 31145271,
							alt: "G",
							rsId: "rs9501066",
							entrez_id: 253018,
							chr: "chr6"
						},
						{
							gene_name: "HCG27",
							ref: "C",
							stop: 31145991,
							"p-value": 1.04e-7,
							start: 31145991,
							alt: "T",
							rsId: "rs3871248",
							entrez_id: 253018,
							chr: "chr6"
						},
						{
							gene_name: "HCG27",
							ref: "G",
							stop: 31146439,
							"p-value": 0.00000558,
							start: 31146439,
							alt: "C",
							rsId: "rs1052986",
							entrez_id: 253018,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "G",
							stop: 31177034,
							"p-value": 6.58e-9,
							start: 31177034,
							alt: "A",
							rsId: "rs35016370",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "A",
							stop: 31177298,
							"p-value": 8.52e-9,
							start: 31177298,
							alt: "G",
							rsId: "rs35299283",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "G",
							stop: 31185265,
							"p-value": 7.45e-9,
							start: 31185265,
							alt: "A",
							rsId: "rs34518279",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "G",
							stop: 31233906,
							"p-value": 0.0000145,
							start: 31233906,
							alt: "A",
							rsId: "rs2524104",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31271320,
							"p-value": 6.64e-8,
							start: 31271320,
							alt: "A",
							rsId: "rs28367685",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31271680,
							"p-value": 2.69e-7,
							start: 31271680,
							alt: "C",
							rsId: "rs9468940",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31273745,
							"p-value": 7.28e-7,
							start: 31273745,
							alt: "C",
							rsId: "rs3873386",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31284476,
							"p-value": 0.00000104,
							start: 31284476,
							alt: "C",
							rsId: "rs28367701",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31288943,
							"p-value": 0.0000204,
							start: 31288943,
							alt: "G",
							rsId: "rs9265156",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31297092,
							"p-value": 0.0000056,
							start: 31297092,
							alt: "T",
							rsId: "rs9265477",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31297286,
							"p-value": 0.00000926,
							start: 31297286,
							alt: "T",
							rsId: "rs9265486",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31297936,
							"p-value": 0.00000535,
							start: 31297936,
							alt: "T",
							rsId: "rs9265526",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31299112,
							"p-value": 0.00000318,
							start: 31299112,
							alt: "T",
							rsId: "rs9265587",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31299189,
							"p-value": 0.00000613,
							start: 31299189,
							alt: "A",
							rsId: "rs9265596",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31299450,
							"p-value": 0.00000845,
							start: 31299450,
							alt: "T",
							rsId: "rs9265604",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31299694,
							"p-value": 0.00000394,
							start: 31299694,
							alt: "G",
							rsId: "rs9265621",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31300658,
							"p-value": 0.0000107,
							start: 31300658,
							alt: "C",
							rsId: "rs9265662",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31300968,
							"p-value": 0.00000594,
							start: 31300968,
							alt: "T",
							rsId: "rs9265675",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31301014,
							"p-value": 0.00000222,
							start: 31301014,
							alt: "A",
							rsId: "rs9265678",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31301118,
							"p-value": 0.00000598,
							start: 31301118,
							alt: "G",
							rsId: "rs9265682",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31302141,
							"p-value": 0.0000109,
							start: 31302141,
							alt: "A",
							rsId: "rs9265725",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31302791,
							"p-value": 0.00000611,
							start: 31302791,
							alt: "T",
							rsId: "rs28752875",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31303236,
							"p-value": 0.0000287,
							start: 31303236,
							alt: "G",
							rsId: "rs1634775",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31303879,
							"p-value": 0.0000136,
							start: 31303879,
							alt: "G",
							rsId: "rs28752923",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31307157,
							"p-value": 0.0000186,
							start: 31307157,
							alt: "C",
							rsId: "rs28753018",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31313760,
							"p-value": 0.00000158,
							start: 31313760,
							alt: "C",
							rsId: "rs28380912",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31314924,
							"p-value": 0.0000408,
							start: 31314924,
							alt: "A",
							rsId: "rs9265936",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31318820,
							"p-value": 0.0000747,
							start: 31318820,
							alt: "C",
							rsId: "rs9266044",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31320810,
							"p-value": 3.24e-7,
							start: 31320810,
							alt: "G",
							rsId: "rs2596503",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31329734,
							"p-value": 0.0000913,
							start: 31329734,
							alt: "T",
							rsId: "rs2523570",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31330370,
							"p-value": 0.00000469,
							start: 31330370,
							alt: "A",
							rsId: "rs2523564",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "A",
							stop: 31332239,
							"p-value": 6.17e-7,
							start: 31332239,
							alt: "C",
							rsId: "rs2596551",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31334174,
							"p-value": 0.00000648,
							start: 31334174,
							alt: "A",
							rsId: "rs2596574",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31336870,
							"p-value": 0.0000171,
							start: 31336870,
							alt: "T",
							rsId: "rs2253907",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31343221,
							"p-value": 0.0000086,
							start: 31343221,
							alt: "T",
							rsId: "rs2844550",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31343919,
							"p-value": 0.00000669,
							start: 31343919,
							alt: "A",
							rsId: "rs2523640",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31344098,
							"p-value": 0.00000565,
							start: 31344098,
							alt: "T",
							rsId: "rs2523639",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "T",
							stop: 31344273,
							"p-value": 0.0000211,
							start: 31344273,
							alt: "C",
							rsId: "rs2523638",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "T",
							stop: 31345513,
							"p-value": 0.0000131,
							start: 31345513,
							alt: "G",
							rsId: "rs28366078",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31345523,
							"p-value": 0.0000119,
							start: 31345523,
							alt: "T",
							rsId: "rs28366079",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31345844,
							"p-value": 0.00000737,
							start: 31345844,
							alt: "A",
							rsId: "rs2523632",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31346080,
							"p-value": 0.00000731,
							start: 31346080,
							alt: "A",
							rsId: "rs2523630",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31348464,
							"p-value": 2.73e-11,
							start: 31348464,
							alt: "A",
							rsId: "rs9266683",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31349922,
							"p-value": 0.0000417,
							start: 31349922,
							alt: "T",
							rsId: "rs9266722",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31350154,
							"p-value": 0.00000938,
							start: 31350154,
							alt: "T",
							rsId: "rs2523547",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "T",
							stop: 31350579,
							"p-value": 9.5e-12,
							start: 31350579,
							alt: "C",
							rsId: "rs3094596",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31351079,
							"p-value": 0.00000679,
							start: 31351079,
							alt: "T",
							rsId: "rs2523646",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31351313,
							"p-value": 0.0000777,
							start: 31351313,
							alt: "T",
							rsId: "rs9266749",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "A",
							stop: 31351999,
							"p-value": 0.00000508,
							start: 31351999,
							alt: "G",
							rsId: "rs28752473",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352201,
							"p-value": 0.00000963,
							start: 31352201,
							alt: "A",
							rsId: "rs28366088",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31352366,
							"p-value": 0.0000105,
							start: 31352366,
							alt: "A",
							rsId: "rs28752479",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352459,
							"p-value": 0.00000672,
							start: 31352459,
							alt: "T",
							rsId: "rs28366091",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352674,
							"p-value": 0.0000165,
							start: 31352674,
							alt: "A",
							rsId: "rs28366093",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352830,
							"p-value": 0.0000107,
							start: 31352830,
							alt: "A",
							rsId: "rs28366097",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352844,
							"p-value": 0.0000146,
							start: 31352844,
							alt: "A",
							rsId: "rs28366098",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31352902,
							"p-value": 0.00000676,
							start: 31352902,
							alt: "T",
							rsId: "rs28366099",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "T",
							stop: 31386019,
							"p-value": 0.00000762,
							start: 31386019,
							alt: "G",
							rsId: "rs9295990",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "T",
							stop: 31390621,
							"p-value": 0.00000734,
							start: 31390621,
							alt: "C",
							rsId: "rs2516447",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31417159,
							"p-value": 0.0000818,
							start: 31417159,
							alt: "A",
							rsId: "rs17200421",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31431691,
							"p-value": 0.00000786,
							start: 31431691,
							alt: "T",
							rsId: "rs2255221",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31431874,
							"p-value": 0.0000137,
							start: 31431874,
							alt: "T",
							rsId: "rs2395030",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31432006,
							"p-value": 0.00000815,
							start: 31432006,
							alt: "A",
							rsId: "rs2263318",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "T",
							stop: 31449022,
							"p-value": 0.0000421,
							start: 31449022,
							alt: "C",
							rsId: "rs2523650",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31463718,
							"p-value": 0.00000248,
							start: 31463718,
							alt: "A",
							rsId: "rs3828901",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "C",
							stop: 31465637,
							"p-value": 0.0000674,
							start: 31465637,
							alt: "T",
							rsId: "rs6915833",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MCCD1",
							ref: "C",
							stop: 31488904,
							"p-value": 0.0000552,
							start: 31488904,
							alt: "T",
							rsId: "rs3093995",
							entrez_id: 401250,
							chr: "chr6"
						},
						{
							gene_name: "MCCD1",
							ref: "A",
							stop: 31495370,
							"p-value": 0.0000664,
							start: 31495370,
							alt: "G",
							rsId: "rs3093984",
							entrez_id: 401250,
							chr: "chr6"
						},
						{
							gene_name: "MCCD1",
							ref: "G",
							stop: 31497744,
							"p-value": 0.0000527,
							start: 31497744,
							alt: "A",
							rsId: "rs3093979",
							entrez_id: 401250,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31499354,
							"p-value": 0.0000571,
							start: 31499354,
							alt: "T",
							rsId: "rs3130056",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31502767,
							"p-value": 0.0000552,
							start: 31502767,
							alt: "T",
							rsId: "rs3131628",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31503703,
							"p-value": 0.0000102,
							start: 31503703,
							alt: "T",
							rsId: "rs2075581",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "T",
							stop: 31506624,
							"p-value": 0.0000637,
							start: 31506624,
							alt: "C",
							rsId: "rs1129640",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "A",
							stop: 31506744,
							"p-value": 0.0000357,
							start: 31506744,
							alt: "C",
							rsId: "rs2516393",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31506854,
							"p-value": 0.0000783,
							start: 31506854,
							alt: "T",
							rsId: "rs2523511",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31507447,
							"p-value": 0.00000982,
							start: 31507447,
							alt: "T",
							rsId: "rs2239709",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "ATP6V1G2",
							ref: "G",
							stop: 31512799,
							"p-value": 0.0000106,
							start: 31512799,
							alt: "A",
							rsId: "rs2071593",
							entrez_id: 534,
							chr: "chr6"
						},
						{
							gene_name: "LTA",
							ref: "T",
							stop: 31526856,
							"p-value": 0.0000183,
							start: 31526856,
							alt: "C",
							rsId: "rs13192469",
							entrez_id: 4049,
							chr: "chr6"
						},
						{
							gene_name: "LTA",
							ref: "G",
							stop: 31528690,
							"p-value": 0.0000212,
							start: 31528690,
							alt: "A",
							rsId: "rs13215091",
							entrez_id: 4049,
							chr: "chr6"
						},
						{
							gene_name: "AIF1",
							ref: "C",
							stop: 31566204,
							"p-value": 0.0000103,
							start: 31566204,
							alt: "T",
							rsId: "rs2509217",
							entrez_id: 199,
							chr: "chr6"
						},
						{
							gene_name: "AIF1",
							ref: "C",
							stop: 31575276,
							"p-value": 4.85e-9,
							start: 31575276,
							alt: "T",
							rsId: "rs9348876",
							entrez_id: 199,
							chr: "chr6"
						},
						{
							gene_name: "PRRC2A",
							ref: "G",
							stop: 31604842,
							"p-value": 2.32e-7,
							start: 31604842,
							alt: "A",
							rsId: "rs3817659",
							entrez_id: 7916,
							chr: "chr6"
						},
						{
							gene_name: "BAG6",
							ref: "G",
							stop: 31615167,
							"p-value": 0.0000237,
							start: 31615167,
							alt: "A",
							rsId: "rs2844463",
							entrez_id: 7917,
							chr: "chr6"
						},
						{
							gene_name: "BAG6",
							ref: "T",
							stop: 31615514,
							"p-value": 1.05e-7,
							start: 31615514,
							alt: "C",
							rsId: "rs10484558",
							entrez_id: 7917,
							chr: "chr6"
						},
						{
							gene_name: "APOM",
							ref: "G",
							stop: 31625507,
							"p-value": 0.0000379,
							start: 31625507,
							alt: "T",
							rsId: "rs707922",
							entrez_id: 55937,
							chr: "chr6"
						},
						{
							gene_name: "LY6G5B",
							ref: "C",
							stop: 31639845,
							"p-value": 1.41e-7,
							start: 31639845,
							alt: "A",
							rsId: "rs11758242",
							entrez_id: 58496,
							chr: "chr6"
						},
						{
							gene_name: "ABHD16A",
							ref: "G",
							stop: 31665452,
							"p-value": 0.0000155,
							start: 31665452,
							alt: "A",
							rsId: "rs805273",
							entrez_id: 7920,
							chr: "chr6"
						},
						{
							gene_name: "SNORD48",
							ref: "C",
							stop: 31803074,
							"p-value": 3.57e-7,
							start: 31803074,
							alt: "T",
							rsId: "rs17201241",
							entrez_id: 26801,
							chr: "chr6"
						},
						{
							gene_name: "NEU1",
							ref: "C",
							stop: 31819164,
							"p-value": 1.34e-7,
							start: 31819164,
							alt: "A",
							rsId: "rs13191375",
							entrez_id: 4758,
							chr: "chr6"
						},
						{
							gene_name: "STK19",
							ref: "G",
							stop: 31947460,
							"p-value": 1.29e-10,
							start: 31947460,
							alt: "T",
							rsId: "rs389883",
							entrez_id: 8859,
							chr: "chr6"
						},
						{
							gene_name: "TNXB",
							ref: "C",
							stop: 32050544,
							"p-value": 0.0000181,
							start: 32050544,
							alt: "T",
							rsId: "rs3130287",
							entrez_id: 7148,
							chr: "chr6"
						},
						{
							gene_name: "TNXB",
							ref: "C",
							stop: 32071893,
							"p-value": 0.0000094,
							start: 32071893,
							alt: "T",
							rsId: "rs3134954",
							entrez_id: 7148,
							chr: "chr6"
						},
						{
							gene_name: "ATF6B",
							ref: "A",
							stop: 32080146,
							"p-value": 0.0000218,
							start: 32080146,
							alt: "C",
							rsId: "rs3130342",
							entrez_id: 1388,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "C",
							stop: 32170433,
							"p-value": 2.24e-8,
							start: 32170433,
							alt: "T",
							rsId: "rs2071287",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32171683,
							"p-value": 2.54e-10,
							start: 32171683,
							alt: "C",
							rsId: "rs2071277",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "G",
							stop: 32176782,
							"p-value": 6.46e-7,
							start: 32176782,
							alt: "T",
							rsId: "rs3132947",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "G",
							stop: 32182759,
							"p-value": 1.17e-13,
							start: 32182759,
							alt: "A",
							rsId: "rs206015",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32188640,
							"p-value": 1.22e-8,
							start: 32188640,
							alt: "C",
							rsId: "rs520692",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32188642,
							"p-value": 2.69e-7,
							start: 32188642,
							alt: "C",
							rsId: "rs520688",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32189841,
							"p-value": 1.33e-8,
							start: 32189841,
							alt: "G",
							rsId: "rs715299",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "C",
							stop: 32191339,
							"p-value": 5.86e-8,
							start: 32191339,
							alt: "T",
							rsId: "rs3830041",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32199144,
							"p-value": 4.74e-8,
							start: 32199144,
							alt: "A",
							rsId: "rs377763",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32203347,
							"p-value": 2.11e-8,
							start: 32203347,
							alt: "A",
							rsId: "rs508445",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32205045,
							"p-value": 1.01e-8,
							start: 32205045,
							alt: "A",
							rsId: "rs549182",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32208324,
							"p-value": 6.96e-8,
							start: 32208324,
							alt: "T",
							rsId: "rs424232",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32209027,
							"p-value": 2.48e-7,
							start: 32209027,
							alt: "C",
							rsId: "rs382259",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32209562,
							"p-value": 3.5e-9,
							start: 32209562,
							alt: "C",
							rsId: "rs380571",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32209963,
							"p-value": 1.45e-7,
							start: 32209963,
							alt: "C",
							rsId: "rs371156",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32210799,
							"p-value": 2.08e-7,
							start: 32210799,
							alt: "G",
							rsId: "rs419132",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32213008,
							"p-value": 3.11e-8,
							start: 32213008,
							alt: "A",
							rsId: "rs454875",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32218843,
							"p-value": 0.0000327,
							start: 32218843,
							alt: "G",
							rsId: "rs3115573",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32220685,
							"p-value": 0.0000327,
							start: 32220685,
							alt: "A",
							rsId: "rs3130315",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32236054,
							"p-value": 4.49e-8,
							start: 32236054,
							alt: "T",
							rsId: "rs3132933",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32253544,
							"p-value": 2.7e-8,
							start: 32253544,
							alt: "C",
							rsId: "rs6902465",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32283394,
							"p-value": 1.79e-7,
							start: 32283394,
							alt: "G",
							rsId: "rs493136",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32286252,
							"p-value": 2.02e-8,
							start: 32286252,
							alt: "A",
							rsId: "rs503042",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32292818,
							"p-value": 6.16e-8,
							start: 32292818,
							alt: "A",
							rsId: "rs536693",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32298814,
							"p-value": 5.79e-8,
							start: 32298814,
							alt: "A",
							rsId: "rs3129949",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32299592,
							"p-value": 0.00000167,
							start: 32299592,
							alt: "A",
							rsId: "rs1003879",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32299822,
							"p-value": 4.44e-8,
							start: 32299822,
							alt: "A",
							rsId: "rs1003878",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32301910,
							"p-value": 5.34e-8,
							start: 32301910,
							alt: "A",
							rsId: "rs2022537",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32309911,
							"p-value": 2.64e-7,
							start: 32309911,
							alt: "T",
							rsId: "rs3117137",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32321597,
							"p-value": 2.16e-8,
							start: 32321597,
							alt: "G",
							rsId: "rs1265761",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32338695,
							"p-value": 0.0000189,
							start: 32338695,
							alt: "G",
							rsId: "rs3129943",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32339511,
							"p-value": 0.00000866,
							start: 32339511,
							alt: "T",
							rsId: "rs2076535",
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "T",
							stop: 32343369,
							"p-value": 0.00000258,
							start: 32343369,
							alt: "C",
							rsId: "rs3117106",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "C",
							stop: 32345595,
							"p-value": 0.0000321,
							start: 32345595,
							alt: "G",
							rsId: "rs2395153",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "G",
							stop: 32346491,
							"p-value": 0.0000307,
							start: 32346491,
							alt: "A",
							rsId: "rs9268435",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "G",
							stop: 32370816,
							"p-value": 0.0000326,
							start: 32370816,
							alt: "A",
							rsId: "rs28362680",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32376176,
							"p-value": 0.00000266,
							start: 32376176,
							alt: "T",
							rsId: "rs3763311",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32379535,
							"p-value": 0.00000173,
							start: 32379535,
							alt: "C",
							rsId: "rs11961777",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32383573,
							"p-value": 1.77e-7,
							start: 32383573,
							alt: "T",
							rsId: "rs6912701",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32389255,
							"p-value": 0.00000209,
							start: 32389255,
							alt: "A",
							rsId: "rs3135365",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32391695,
							"p-value": 8.13e-10,
							start: 32391695,
							alt: "C",
							rsId: "rs28895026",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32396475,
							"p-value": 0.0000023,
							start: 32396475,
							alt: "G",
							rsId: "rs3129846",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32396506,
							"p-value": 4.81e-12,
							start: 32396506,
							alt: "G",
							rsId: "rs3129847",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32396615,
							"p-value": 3.74e-12,
							start: 32396615,
							alt: "T",
							rsId: "rs3135342",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32403655,
							"p-value": 2.69e-12,
							start: 32403655,
							alt: "G",
							rsId: "rs983561",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32404135,
							"p-value": 2.35e-12,
							start: 32404135,
							alt: "G",
							rsId: "rs5000563",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32407302,
							"p-value": 0.00000226,
							start: 32407302,
							alt: "G",
							rsId: "rs2395179",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32407310,
							"p-value": 0.00000173,
							start: 32407310,
							alt: "G",
							rsId: "rs2395180",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32408012,
							"p-value": 0.00000259,
							start: 32408012,
							alt: "A",
							rsId: "rs3129876",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32408044,
							"p-value": 5.1e-12,
							start: 32408044,
							alt: "C",
							rsId: "rs9268644",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32408597,
							"p-value": 2.36e-12,
							start: 32408597,
							alt: "A",
							rsId: "rs3129877",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32409242,
							"p-value": 1.36e-8,
							start: 32409242,
							alt: "A",
							rsId: "rs3135392",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32409484,
							"p-value": 9.65e-14,
							start: 32409484,
							alt: "T",
							rsId: "rs3129881",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32409530,
							"p-value": 1.93e-7,
							start: 32409530,
							alt: "A",
							rsId: "rs3129882",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32410137,
							"p-value": 0.0000758,
							start: 32410137,
							alt: "C",
							rsId: "rs3129883",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32410576,
							"p-value": 0.0000323,
							start: 32410576,
							alt: "C",
							rsId: "rs3129886",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32410691,
							"p-value": 2.32e-8,
							start: 32410691,
							alt: "A",
							rsId: "rs3129887",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32411376,
							"p-value": 2.65e-8,
							start: 32411376,
							alt: "G",
							rsId: "rs2239805",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32411846,
							"p-value": 0.0000636,
							start: 32411846,
							alt: "G",
							rsId: "rs2239802",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32413317,
							"p-value": 0.0000526,
							start: 32413317,
							alt: "T",
							rsId: "rs2395182",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32415218,
							"p-value": 9.32e-8,
							start: 32415218,
							alt: "A",
							rsId: "rs9469113",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "T",
							stop: 32421190,
							"p-value": 3.12e-7,
							start: 32421190,
							alt: "C",
							rsId: "rs28895131",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32421798,
							"p-value": 0.0000691,
							start: 32421798,
							alt: "T",
							rsId: "rs6457590",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "T",
							stop: 32427789,
							"p-value": 0.0000485,
							start: 32427789,
							alt: "C",
							rsId: "rs9268832",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32447953,
							"p-value": 3.19e-8,
							start: 32447953,
							alt: "A",
							rsId: "rs2395194",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "A",
							stop: 32448808,
							"p-value": 2.9e-8,
							start: 32448808,
							alt: "G",
							rsId: "rs7748494",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB6",
							ref: "C",
							stop: 32498584,
							"p-value": 3.55e-7,
							start: 32498584,
							alt: "A",
							rsId: "rs16870187",
							entrez_id: 3128,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32561370,
							"p-value": 0.00000188,
							start: 32561370,
							alt: "T",
							rsId: "rs35139284",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32574060,
							"p-value": 0.00000548,
							start: 32574060,
							alt: "C",
							rsId: "rs9270986",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32575369,
							"p-value": 0.00000322,
							start: 32575369,
							alt: "T",
							rsId: "rs9271055",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32577531,
							"p-value": 0.00000195,
							start: 32577531,
							alt: "G",
							rsId: "rs9271152",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32577646,
							"p-value": 0.00000291,
							start: 32577646,
							alt: "G",
							rsId: "rs9271160",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32578449,
							"p-value": 0.00000504,
							start: 32578449,
							alt: "C",
							rsId: "rs9271191",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32578885,
							"p-value": 0.00000206,
							start: 32578885,
							alt: "C",
							rsId: "rs9271203",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32581782,
							"p-value": 0.00000182,
							start: 32581782,
							alt: "T",
							rsId: "rs1966001",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32582577,
							"p-value": 0.00000585,
							start: 32582577,
							alt: "C",
							rsId: "rs3104415",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32583159,
							"p-value": 4.99e-10,
							start: 32583159,
							alt: "C",
							rsId: "rs4959106",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32583677,
							"p-value": 3.28e-10,
							start: 32583677,
							alt: "C",
							rsId: "rs36124427",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32584153,
							"p-value": 5.65e-11,
							start: 32584153,
							alt: "A",
							rsId: "rs28383233",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32585068,
							"p-value": 4.82e-7,
							start: 32585068,
							alt: "C",
							rsId: "rs28752534",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32586854,
							"p-value": 0.00000167,
							start: 32586854,
							alt: "A",
							rsId: "rs9271366",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32587768,
							"p-value": 0.00000252,
							start: 32587768,
							alt: "A",
							rsId: "rs9271413",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32587923,
							"p-value": 0.0000617,
							start: 32587923,
							alt: "G",
							rsId: "rs9271425",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32589051,
							"p-value": 0.0000343,
							start: 32589051,
							alt: "A",
							rsId: "rs9271489",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32589862,
							"p-value": 0.0000711,
							start: 32589862,
							alt: "A",
							rsId: "rs9271526",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32589983,
							"p-value": 0.0000766,
							start: 32589983,
							alt: "A",
							rsId: "rs9271538",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32593010,
							"p-value": 0.00000523,
							start: 32593010,
							alt: "A",
							rsId: "rs9271692",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32593095,
							"p-value": 0.0000182,
							start: 32593095,
							alt: "A",
							rsId: "rs9271697",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32593392,
							"p-value": 0.0000148,
							start: 32593392,
							alt: "A",
							rsId: "rs9271709",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32593507,
							"p-value": 0.00000483,
							start: 32593507,
							alt: "A",
							rsId: "rs9271720",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32594248,
							"p-value": 0.0000063,
							start: 32594248,
							alt: "A",
							rsId: "rs9271770",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32594274,
							"p-value": 0.000006,
							start: 32594274,
							alt: "C",
							rsId: "rs9271771",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32595027,
							"p-value": 0.00000965,
							start: 32595027,
							alt: "G",
							rsId: "rs9271848",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32595147,
							"p-value": 0.00000617,
							start: 32595147,
							alt: "T",
							rsId: "rs9271857",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32595679,
							"p-value": 0.000088,
							start: 32595679,
							alt: "A",
							rsId: "rs9271887",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32595859,
							"p-value": 0.00000354,
							start: 32595859,
							alt: "T",
							rsId: "rs9271893",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32595874,
							"p-value": 0.0000695,
							start: 32595874,
							alt: "T",
							rsId: "rs9271894",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32595954,
							"p-value": 0.00000888,
							start: 32595954,
							alt: "A",
							rsId: "rs9271897",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32596007,
							"p-value": 0.00000153,
							start: 32596007,
							alt: "G",
							rsId: "rs9271899",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32596566,
							"p-value": 0.00000391,
							start: 32596566,
							alt: "T",
							rsId: "rs9271926",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32600003,
							"p-value": 0.0000221,
							start: 32600003,
							alt: "C",
							rsId: "rs3104376",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32600291,
							"p-value": 0.00000893,
							start: 32600291,
							alt: "C",
							rsId: "rs9272113",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32600411,
							"p-value": 0.00000984,
							start: 32600411,
							alt: "T",
							rsId: "rs9272117",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32600501,
							"p-value": 0.00000728,
							start: 32600501,
							alt: "G",
							rsId: "rs9272120",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32600638,
							"p-value": 0.00000488,
							start: 32600638,
							alt: "G",
							rsId: "rs9272130",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32602482,
							"p-value": 0.0000247,
							start: 32602482,
							alt: "C",
							rsId: "rs3104369",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32609094,
							"p-value": 2.82e-9,
							start: 32609094,
							alt: "T",
							rsId: "rs1129737",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB1",
							ref: "G",
							stop: 32626086,
							"p-value": 0.0000027,
							start: 32626086,
							alt: "A",
							rsId: "rs7744001",
							entrez_id: 3119,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB1",
							ref: "A",
							stop: 32627700,
							"p-value": 2.84e-8,
							start: 32627700,
							alt: "G",
							rsId: "rs6689",
							entrez_id: 3119,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB1",
							ref: "A",
							stop: 32630407,
							"p-value": 1.5e-8,
							start: 32630407,
							alt: "G",
							rsId: "rs9274177",
							entrez_id: 3119,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32636433,
							"p-value": 4.99e-11,
							start: 32636433,
							alt: "G",
							rsId: "rs35800511",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32636785,
							"p-value": 4.73e-8,
							start: 32636785,
							alt: "T",
							rsId: "rs9274684",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32637418,
							"p-value": 9.23e-11,
							start: 32637418,
							alt: "A",
							rsId: "rs17205647",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32637538,
							"p-value": 1.7e-11,
							start: 32637538,
							alt: "A",
							rsId: "rs28371212",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32637833,
							"p-value": 2.01e-7,
							start: 32637833,
							alt: "A",
							rsId: "rs35195457",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32648490,
							"p-value": 1.5e-8,
							start: 32648490,
							alt: "A",
							rsId: "rs9275071",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32648809,
							"p-value": 2.05e-8,
							start: 32648809,
							alt: "G",
							rsId: "rs9275086",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32649416,
							"p-value": 4.75e-9,
							start: 32649416,
							alt: "T",
							rsId: "rs9275105",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32650256,
							"p-value": 1.42e-8,
							start: 32650256,
							alt: "T",
							rsId: "rs9275123",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32650550,
							"p-value": 5.61e-9,
							start: 32650550,
							alt: "C",
							rsId: "rs2858303",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32651495,
							"p-value": 1e-8,
							start: 32651495,
							alt: "T",
							rsId: "rs9275146",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32653018,
							"p-value": 1.37e-13,
							start: 32653018,
							alt: "C",
							rsId: "rs28371251",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32657452,
							"p-value": 3.58e-9,
							start: 32657452,
							alt: "C",
							rsId: "rs28371254",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32657505,
							"p-value": 2.63e-11,
							start: 32657505,
							alt: "C",
							rsId: "rs4538748",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32657543,
							"p-value": 3.36e-8,
							start: 32657543,
							alt: "T",
							rsId: "rs4642516",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32657817,
							"p-value": 3.34e-10,
							start: 32657817,
							alt: "T",
							rsId: "rs9275210",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32658310,
							"p-value": 0.0000102,
							start: 32658310,
							alt: "A",
							rsId: "rs9469220",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32658429,
							"p-value": 1.14e-14,
							start: 32658429,
							alt: "C",
							rsId: "rs9368737",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32659087,
							"p-value": 3.78e-7,
							start: 32659087,
							alt: "C",
							rsId: "rs9275220",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32663919,
							"p-value": 1.44e-9,
							start: 32663919,
							alt: "G",
							rsId: "rs2858313",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32664093,
							"p-value": 4.21e-10,
							start: 32664093,
							alt: "G",
							rsId: "rs2647015",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32664126,
							"p-value": 0.00000295,
							start: 32664126,
							alt: "G",
							rsId: "rs9275300",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32664279,
							"p-value": 7.62e-10,
							start: 32664279,
							alt: "T",
							rsId: "rs2647014",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32664677,
							"p-value": 2.71e-10,
							start: 32664677,
							alt: "G",
							rsId: "rs2647007",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32665311,
							"p-value": 0.0000247,
							start: 32665311,
							alt: "C",
							rsId: "rs17206147",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32666831,
							"p-value": 7.28e-7,
							start: 32666831,
							alt: "T",
							rsId: "rs9275329",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32667119,
							"p-value": 9.5e-8,
							start: 32667119,
							alt: "C",
							rsId: "rs3135006",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32667318,
							"p-value": 1.7e-7,
							start: 32667318,
							alt: "T",
							rsId: "rs9275337",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32668258,
							"p-value": 0.00000302,
							start: 32668258,
							alt: "T",
							rsId: "rs9275370",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32668296,
							"p-value": 3.09e-8,
							start: 32668296,
							alt: "C",
							rsId: "rs9275371",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32668323,
							"p-value": 0.0000666,
							start: 32668323,
							alt: "A",
							rsId: "rs2858310",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32668388,
							"p-value": 7.95e-7,
							start: 32668388,
							alt: "T",
							rsId: "rs9275372",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32668632,
							"p-value": 0.00000143,
							start: 32668632,
							alt: "A",
							rsId: "rs9275375",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32669018,
							"p-value": 4.04e-8,
							start: 32669018,
							alt: "A",
							rsId: "rs1612904",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32669084,
							"p-value": 4.72e-7,
							start: 32669084,
							alt: "C",
							rsId: "rs9275388",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32669568,
							"p-value": 3.14e-7,
							start: 32669568,
							alt: "C",
							rsId: "rs9275398",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32669767,
							"p-value": 3.96e-13,
							start: 32669767,
							alt: "C",
							rsId: "rs2647050",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32669883,
							"p-value": 4.37e-7,
							start: 32669883,
							alt: "G",
							rsId: "rs9275405",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32670000,
							"p-value": 2.81e-9,
							start: 32670000,
							alt: "T",
							rsId: "rs2858308",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32670110,
							"p-value": 4.44e-7,
							start: 32670110,
							alt: "C",
							rsId: "rs9275408",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32670136,
							"p-value": 5.08e-8,
							start: 32670136,
							alt: "C",
							rsId: "rs3135001",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32670244,
							"p-value": 4.91e-7,
							start: 32670244,
							alt: "G",
							rsId: "rs9275418",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32670255,
							"p-value": 3.09e-13,
							start: 32670255,
							alt: "T",
							rsId: "rs2856718",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32670956,
							"p-value": 1.79e-9,
							start: 32670956,
							alt: "T",
							rsId: "rs2856705",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32671014,
							"p-value": 2.83e-13,
							start: 32671014,
							alt: "A",
							rsId: "rs2856704",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32671103,
							"p-value": 0.0000281,
							start: 32671103,
							alt: "C",
							rsId: "rs13192471",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32671596,
							"p-value": 3.68e-7,
							start: 32671596,
							alt: "T",
							rsId: "rs9275440",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32671601,
							"p-value": 0.0000483,
							start: 32671601,
							alt: "T",
							rsId: "rs28451714",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32579708,
							"p-value": 0.00000279,
							start: 32579708,
							alt: "C",
							rsId: "rs13207945",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32672529,
							"p-value": 8.37e-9,
							start: 32672529,
							alt: "T",
							rsId: "rs9275474",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32672903,
							"p-value": 0.0000261,
							start: 32672903,
							alt: "A",
							rsId: "rs35030589",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32674130,
							"p-value": 0.0000777,
							start: 32674130,
							alt: "A",
							rsId: "rs9275507",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32674343,
							"p-value": 1.86e-7,
							start: 32674343,
							alt: "A",
							rsId: "rs28371271",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32674440,
							"p-value": 4.02e-8,
							start: 32674440,
							alt: "C",
							rsId: "rs28371272",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32674558,
							"p-value": 1.39e-8,
							start: 32674558,
							alt: "C",
							rsId: "rs28371274",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32674573,
							"p-value": 0.0000157,
							start: 32674573,
							alt: "C",
							rsId: "rs9275515",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32674643,
							"p-value": 0.0000505,
							start: 32674643,
							alt: "G",
							rsId: "rs9275516",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32674649,
							"p-value": 0.00000486,
							start: 32674649,
							alt: "G",
							rsId: "rs9275517",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32674700,
							"p-value": 0.00000643,
							start: 32674700,
							alt: "A",
							rsId: "rs9275518",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32675032,
							"p-value": 6.95e-10,
							start: 32675032,
							alt: "T",
							rsId: "rs17206343",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675067,
							"p-value": 1.58e-8,
							start: 32675067,
							alt: "C",
							rsId: "rs17206350",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675109,
							"p-value": 2.33e-9,
							start: 32675109,
							alt: "C",
							rsId: "rs9275524",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32675266,
							"p-value": 7.59e-10,
							start: 32675266,
							alt: "T",
							rsId: "rs17212748",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675449,
							"p-value": 8.39e-10,
							start: 32675449,
							alt: "C",
							rsId: "rs17212818",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675497,
							"p-value": 1.09e-9,
							start: 32675497,
							alt: "C",
							rsId: "rs17212832",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32675691,
							"p-value": 1e-9,
							start: 32675691,
							alt: "A",
							rsId: "rs17212867",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32676040,
							"p-value": 5.77e-10,
							start: 32676040,
							alt: "T",
							rsId: "rs28371287",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32676075,
							"p-value": 9.69e-10,
							start: 32676075,
							alt: "G",
							rsId: "rs28371289",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32677152,
							"p-value": 4.43e-10,
							start: 32677152,
							alt: "A",
							rsId: "rs16898264",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32677454,
							"p-value": 1.98e-8,
							start: 32677454,
							alt: "C",
							rsId: "rs28371302",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32678136,
							"p-value": 0.00000677,
							start: 32678136,
							alt: "T",
							rsId: "rs9275569",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678265,
							"p-value": 5.26e-10,
							start: 32678265,
							alt: "G",
							rsId: "rs28371311",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32678388,
							"p-value": 4.45e-10,
							start: 32678388,
							alt: "C",
							rsId: "rs28371315",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678740,
							"p-value": 1.15e-9,
							start: 32678740,
							alt: "G",
							rsId: "rs28371318",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678973,
							"p-value": 4.25e-8,
							start: 32678973,
							alt: "G",
							rsId: "rs17615250",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678999,
							"p-value": 0.0000179,
							start: 32678999,
							alt: "G",
							rsId: "rs9275572",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32679047,
							"p-value": 9.67e-11,
							start: 32679047,
							alt: "A",
							rsId: "rs28371322",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32679346,
							"p-value": 1.53e-10,
							start: 32679346,
							alt: "A",
							rsId: "rs28371333",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32679489,
							"p-value": 3.5e-10,
							start: 32679489,
							alt: "C",
							rsId: "rs17615293",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32680585,
							"p-value": 7.91e-10,
							start: 32680585,
							alt: "C",
							rsId: "rs17581425",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32680696,
							"p-value": 6.7e-9,
							start: 32680696,
							alt: "A",
							rsId: "rs17219288",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32680727,
							"p-value": 4.61e-9,
							start: 32680727,
							alt: "C",
							rsId: "rs17219309",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32680970,
							"p-value": 6.61e-9,
							start: 32680970,
							alt: "T",
							rsId: "rs7745656",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32681049,
							"p-value": 9.48e-9,
							start: 32681049,
							alt: "C",
							rsId: "rs2647087",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32681085,
							"p-value": 2.05e-9,
							start: 32681085,
							alt: "G",
							rsId: "rs2858333",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32681518,
							"p-value": 1.11e-8,
							start: 32681518,
							alt: "G",
							rsId: "rs2647088",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32682174,
							"p-value": 1.09e-8,
							start: 32682174,
							alt: "A",
							rsId: "rs3104404",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32682402,
							"p-value": 7.33e-13,
							start: 32682402,
							alt: "T",
							rsId: "rs3997849",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32682915,
							"p-value": 4.68e-10,
							start: 32682915,
							alt: "G",
							rsId: "rs3997854",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32684069,
							"p-value": 1.08e-8,
							start: 32684069,
							alt: "T",
							rsId: "rs6936707",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32685550,
							"p-value": 6.44e-9,
							start: 32685550,
							alt: "A",
							rsId: "rs3916765",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32685685,
							"p-value": 3.09e-9,
							start: 32685685,
							alt: "A",
							rsId: "rs3104398",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32687212,
							"p-value": 9.02e-10,
							start: 32687212,
							alt: "G",
							rsId: "rs3129743",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32687358,
							"p-value": 2.67e-9,
							start: 32687358,
							alt: "G",
							rsId: "rs3104401",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32687689,
							"p-value": 1.15e-7,
							start: 32687689,
							alt: "A",
							rsId: "rs9275689",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32688055,
							"p-value": 1.36e-7,
							start: 32688055,
							alt: "T",
							rsId: "rs9275700",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32688060,
							"p-value": 7.43e-8,
							start: 32688060,
							alt: "C",
							rsId: "rs9275701",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32688273,
							"p-value": 4.64e-9,
							start: 32688273,
							alt: "G",
							rsId: "rs9275714",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32688288,
							"p-value": 8.22e-10,
							start: 32688288,
							alt: "A",
							rsId: "rs9275715",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32688343,
							"p-value": 1.71e-7,
							start: 32688343,
							alt: "C",
							rsId: "rs9275717",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32688617,
							"p-value": 1.04e-7,
							start: 32688617,
							alt: "G",
							rsId: "rs9275727",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32688804,
							"p-value": 1.6e-7,
							start: 32688804,
							alt: "T",
							rsId: "rs9275737",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32688925,
							"p-value": 4.08e-8,
							start: 32688925,
							alt: "T",
							rsId: "rs9275743",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32689503,
							"p-value": 2.83e-8,
							start: 32689503,
							alt: "C",
							rsId: "rs9275772",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32689622,
							"p-value": 1.19e-7,
							start: 32689622,
							alt: "A",
							rsId: "rs9275773",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32689687,
							"p-value": 7.68e-8,
							start: 32689687,
							alt: "C",
							rsId: "rs9275775",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32690153,
							"p-value": 1.25e-7,
							start: 32690153,
							alt: "A",
							rsId: "rs9275798",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32690251,
							"p-value": 3.05e-7,
							start: 32690251,
							alt: "A",
							rsId: "rs9275802",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32690671,
							"p-value": 1.51e-7,
							start: 32690671,
							alt: "T",
							rsId: "rs9275825",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32690713,
							"p-value": 1.05e-8,
							start: 32690713,
							alt: "G",
							rsId: "rs9275826",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32691662,
							"p-value": 3.88e-7,
							start: 32691662,
							alt: "G",
							rsId: "rs9275878",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32691721,
							"p-value": 7.41e-8,
							start: 32691721,
							alt: "G",
							rsId: "rs9275879",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32691854,
							"p-value": 1.11e-7,
							start: 32691854,
							alt: "A",
							rsId: "rs9275884",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32691999,
							"p-value": 1.13e-7,
							start: 32691999,
							alt: "C",
							rsId: "rs9275894",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692023,
							"p-value": 1.07e-7,
							start: 32692023,
							alt: "C",
							rsId: "rs9275895",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32692060,
							"p-value": 1.13e-7,
							start: 32692060,
							alt: "G",
							rsId: "rs9275896",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32692122,
							"p-value": 6.85e-9,
							start: 32692122,
							alt: "T",
							rsId: "rs9275900",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							stop: 32692449,
							"p-value": 1.05e-7,
							start: 32692449,
							alt: "G",
							rsId: "rs9282246",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32692553,
							"p-value": 7.26e-8,
							start: 32692553,
							alt: "A",
							rsId: "rs9275917",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692580,
							"p-value": 1.06e-7,
							start: 32692580,
							alt: "C",
							rsId: "rs9275918",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32692588,
							"p-value": 1.2e-8,
							start: 32692588,
							alt: "A",
							rsId: "rs9275920",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692617,
							"p-value": 4.63e-7,
							start: 32692617,
							alt: "C",
							rsId: "rs9275921",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32692745,
							"p-value": 2.9e-8,
							start: 32692745,
							alt: "A",
							rsId: "rs9275926",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32692889,
							"p-value": 8.73e-8,
							start: 32692889,
							alt: "G",
							rsId: "rs9275934",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692919,
							"p-value": 9.87e-8,
							start: 32692919,
							alt: "G",
							rsId: "rs9275935",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693079,
							"p-value": 1.36e-7,
							start: 32693079,
							alt: "G",
							rsId: "rs9275944",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693182,
							"p-value": 1.87e-7,
							start: 32693182,
							alt: "G",
							rsId: "rs9275951",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32693520,
							"p-value": 5.33e-8,
							start: 32693520,
							alt: "A",
							rsId: "rs9275967",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693570,
							"p-value": 3.43e-9,
							start: 32693570,
							alt: "G",
							rsId: "rs9275969",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693681,
							"p-value": 5.49e-7,
							start: 32693681,
							alt: "G",
							rsId: "rs9275971",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32693752,
							"p-value": 1.63e-7,
							start: 32693752,
							alt: "A",
							rsId: "rs9275974",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32693821,
							"p-value": 2.26e-7,
							start: 32693821,
							alt: "T",
							rsId: "rs9275975",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32693861,
							"p-value": 3.81e-8,
							start: 32693861,
							alt: "A",
							rsId: "rs9275978",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32693903,
							"p-value": 1.27e-7,
							start: 32693903,
							alt: "A",
							rsId: "rs9275979",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32694452,
							"p-value": 3.88e-8,
							start: 32694452,
							alt: "T",
							rsId: "rs9275999",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32694519,
							"p-value": 1.15e-7,
							start: 32694519,
							alt: "G",
							rsId: "rs9276000",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32694520,
							"p-value": 1.61e-7,
							start: 32694520,
							alt: "G",
							rsId: "rs9276001",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32694604,
							"p-value": 1.08e-7,
							start: 32694604,
							alt: "G",
							rsId: "rs9276007",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32694633,
							"p-value": 6.11e-8,
							start: 32694633,
							alt: "T",
							rsId: "rs9276008",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32694641,
							"p-value": 9.87e-8,
							start: 32694641,
							alt: "C",
							rsId: "rs9276009",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32695168,
							"p-value": 5.75e-8,
							start: 32695168,
							alt: "A",
							rsId: "rs5029393",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32695432,
							"p-value": 9.14e-8,
							start: 32695432,
							alt: "T",
							rsId: "rs9276036",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32695434,
							"p-value": 2.37e-7,
							start: 32695434,
							alt: "G",
							rsId: "rs9276037",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32695521,
							"p-value": 1.35e-7,
							start: 32695521,
							alt: "C",
							rsId: "rs9276040",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32695603,
							"p-value": 3.13e-7,
							start: 32695603,
							alt: "C",
							rsId: "rs9276041",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32695904,
							"p-value": 2.35e-7,
							start: 32695904,
							alt: "C",
							rsId: "rs9276058",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32697100,
							"p-value": 3.85e-7,
							start: 32697100,
							alt: "G",
							rsId: "rs9276107",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32697887,
							"p-value": 1.81e-7,
							start: 32697887,
							alt: "C",
							rsId: "rs9276137",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32697907,
							"p-value": 2.05e-7,
							start: 32697907,
							alt: "C",
							rsId: "rs9276139",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32697943,
							"p-value": 2.37e-7,
							start: 32697943,
							alt: "T",
							rsId: "rs9276140",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32697962,
							"p-value": 7.58e-8,
							start: 32697962,
							alt: "T",
							rsId: "rs9276142",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32698098,
							"p-value": 2.01e-7,
							start: 32698098,
							alt: "C",
							rsId: "rs9276147",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32698322,
							"p-value": 1.54e-7,
							start: 32698322,
							alt: "C",
							rsId: "rs9276155",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32698369,
							"p-value": 1.37e-7,
							start: 32698369,
							alt: "C",
							rsId: "rs9276157",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32698899,
							"p-value": 3.29e-9,
							start: 32698899,
							alt: "A",
							rsId: "rs7751699",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32699716,
							"p-value": 1.02e-7,
							start: 32699716,
							alt: "T",
							rsId: "rs9276202",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32699745,
							"p-value": 3.38e-10,
							start: 32699745,
							alt: "C",
							rsId: "rs9276203",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32699904,
							"p-value": 2.96e-7,
							start: 32699904,
							alt: "T",
							rsId: "rs9276210",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32700741,
							"p-value": 6.19e-8,
							start: 32700741,
							alt: "C",
							rsId: "rs9276229",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32700833,
							"p-value": 4.73e-8,
							start: 32700833,
							alt: "A",
							rsId: "rs2859090",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32702422,
							"p-value": 1.01e-9,
							start: 32702422,
							alt: "A",
							rsId: "rs9276276",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32702449,
							"p-value": 5.18e-8,
							start: 32702449,
							alt: "G",
							rsId: "rs2859078",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32702813,
							"p-value": 9.66e-8,
							start: 32702813,
							alt: "C",
							rsId: "rs9276291",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32704630,
							"p-value": 0.0000134,
							start: 32704630,
							alt: "G",
							rsId: "rs12183007",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32704659,
							"p-value": 2.97e-8,
							start: 32704659,
							alt: "C",
							rsId: "rs9276311",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32704977,
							"p-value": 9.62e-9,
							start: 32704977,
							alt: "T",
							rsId: "rs9276317",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32705248,
							"p-value": 0.0000144,
							start: 32705248,
							alt: "C",
							rsId: "rs13214069",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32705276,
							"p-value": 0.0000106,
							start: 32705276,
							alt: "T",
							rsId: "rs13199787",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32705419,
							"p-value": 1.6e-8,
							start: 32705419,
							alt: "C",
							rsId: "rs9276328",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32705422,
							"p-value": 0.0000119,
							start: 32705422,
							alt: "C",
							rsId: "rs28576901",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32706042,
							"p-value": 4.43e-8,
							start: 32706042,
							alt: "G",
							rsId: "rs7773149",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32706234,
							"p-value": 5.02e-9,
							start: 32706234,
							alt: "A",
							rsId: "rs7773068",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32706334,
							"p-value": 4.82e-9,
							start: 32706334,
							alt: "G",
							rsId: "rs7773694",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32706480,
							"p-value": 5.21e-9,
							start: 32706480,
							alt: "T",
							rsId: "rs7755597",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32706719,
							"p-value": 0.000025,
							start: 32706719,
							alt: "C",
							rsId: "rs7773955",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32706974,
							"p-value": 0.0000256,
							start: 32706974,
							alt: "A",
							rsId: "rs12203644",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32707018,
							"p-value": 4.97e-8,
							start: 32707018,
							alt: "C",
							rsId: "rs9276362",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32707551,
							"p-value": 0.0000145,
							start: 32707551,
							alt: "G",
							rsId: "rs10947337",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32710396,
							"p-value": 0.0000368,
							start: 32710396,
							alt: "A",
							rsId: "rs9276410",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32710552,
							"p-value": 1.57e-8,
							start: 32710552,
							alt: "A",
							rsId: "rs9276412",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32711691,
							"p-value": 3.88e-10,
							start: 32711691,
							alt: "A",
							rsId: "rs16870693",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32712085,
							"p-value": 1.93e-8,
							start: 32712085,
							alt: "T",
							rsId: "rs9276428",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32712104,
							"p-value": 4.74e-8,
							start: 32712104,
							alt: "A",
							rsId: "rs9276429",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32712247,
							"p-value": 4.61e-8,
							start: 32712247,
							alt: "C",
							rsId: "rs9276431",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "C",
							stop: 32718162,
							"p-value": 5.81e-8,
							start: 32718162,
							alt: "T",
							rsId: "rs9276482",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "A",
							stop: 32725193,
							"p-value": 4.09e-8,
							start: 32725193,
							alt: "G",
							rsId: "rs2301271",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "C",
							stop: 32729459,
							"p-value": 2.41e-10,
							start: 32729459,
							alt: "T",
							rsId: "rs2071551",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "C",
							stop: 32729821,
							"p-value": 1.89e-9,
							start: 32729821,
							alt: "A",
							rsId: "rs7768538",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "A",
							stop: 32730012,
							"p-value": 1.08e-9,
							start: 32730012,
							alt: "G",
							rsId: "rs7453920",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "G",
							stop: 32730086,
							"p-value": 1.78e-9,
							start: 32730086,
							alt: "A",
							rsId: "rs2051549",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "A",
							stop: 32731710,
							"p-value": 0.0000666,
							start: 32731710,
							alt: "G",
							rsId: "rs1978029",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32733931,
							"p-value": 0.0000664,
							start: 32733931,
							alt: "A",
							rsId: "rs9276595",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32735295,
							"p-value": 0.0000538,
							start: 32735295,
							alt: "T",
							rsId: "rs2395264",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32735506,
							"p-value": 0.0000615,
							start: 32735506,
							alt: "G",
							rsId: "rs6457655",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32736103,
							"p-value": 0.0000366,
							start: 32736103,
							alt: "C",
							rsId: "rs9296043",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32736936,
							"p-value": 0.0000617,
							start: 32736936,
							alt: "T",
							rsId: "rs6901084",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32739888,
							"p-value": 4.86e-14,
							start: 32739888,
							alt: "C",
							rsId: "rs1383265",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "A",
							stop: 32739967,
							"p-value": 0.000018,
							start: 32739967,
							alt: "T",
							rsId: "rs1383264",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32757297,
							"p-value": 0.0000131,
							start: 32757297,
							alt: "T",
							rsId: "rs9276711",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32759448,
							"p-value": 0.00000235,
							start: 32759448,
							alt: "A",
							rsId: "rs3948793",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32672135,
							"p-value": 0.0000261,
							start: 32672135,
							alt: "T",
							rsId: "rs17499655",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32763888,
							"p-value": 0.0000173,
							start: 32763888,
							alt: "C",
							rsId: "rs9276726",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32765268,
							"p-value": 0.000022,
							start: 32765268,
							alt: "C",
							rsId: "rs6912002",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32765730,
							"p-value": 0.000019,
							start: 32765730,
							alt: "C",
							rsId: "rs1383259",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "A",
							stop: 32766345,
							"p-value": 0.0000177,
							start: 32766345,
							alt: "G",
							rsId: "rs7383562",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32766593,
							"p-value": 0.0000132,
							start: 32766593,
							alt: "T",
							rsId: "rs7383606",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32766854,
							"p-value": 0.0000108,
							start: 32766854,
							alt: "A",
							rsId: "rs9276734",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32767170,
							"p-value": 0.00000859,
							start: 32767170,
							alt: "G",
							rsId: "rs7382679",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32767432,
							"p-value": 0.0000138,
							start: 32767432,
							alt: "T",
							rsId: "rs7740209",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32767496,
							"p-value": 0.0000148,
							start: 32767496,
							alt: "C",
							rsId: "rs7382714",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32770482,
							"p-value": 0.0000135,
							start: 32770482,
							alt: "C",
							rsId: "rs6899857",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32775001,
							"p-value": 0.0000146,
							start: 32775001,
							alt: "T",
							rsId: "rs6917315",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32776087,
							"p-value": 0.0000105,
							start: 32776087,
							alt: "T",
							rsId: "rs7382649",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32776292,
							"p-value": 0.0000145,
							start: 32776292,
							alt: "A",
							rsId: "rs9276785",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32783896,
							"p-value": 0.0000301,
							start: 32783896,
							alt: "A",
							rsId: "rs2621326",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "T",
							stop: 32786882,
							"p-value": 4.06e-8,
							start: 32786882,
							alt: "C",
							rsId: "rs3763355",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "G",
							stop: 32786917,
							"p-value": 1.44e-8,
							start: 32786917,
							alt: "A",
							rsId: "rs3763354",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "T",
							stop: 32788511,
							"p-value": 0.0000112,
							start: 32788511,
							alt: "C",
							rsId: "rs9784758",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "C",
							stop: 32788878,
							"p-value": 1.67e-8,
							start: 32788878,
							alt: "A",
							rsId: "rs9784876",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "G",
							stop: 32804217,
							"p-value": 0.0000642,
							start: 32804217,
							alt: "A",
							rsId: "rs3819714",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "G",
							stop: 32804219,
							"p-value": 0.0000189,
							start: 32804219,
							alt: "T",
							rsId: "rs3819715",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "C",
							stop: 32805307,
							"p-value": 9.74e-7,
							start: 32805307,
							alt: "T",
							rsId: "rs2071466",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "PSMB8",
							ref: "C",
							stop: 32806576,
							"p-value": 0.0000822,
							start: 32806576,
							alt: "T",
							rsId: "rs4148869",
							entrez_id: 5696,
							chr: "chr6"
						},
						{
							gene_name: "PSMB8",
							ref: "T",
							stop: 32806786,
							"p-value": 0.0000642,
							start: 32806786,
							alt: "G",
							rsId: "rs4713598",
							entrez_id: 5696,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "C",
							stop: 32816700,
							"p-value": 0.0000182,
							start: 32816700,
							alt: "A",
							rsId: "rs2071482",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "T",
							stop: 32816998,
							"p-value": 0.0000163,
							start: 32816998,
							alt: "C",
							rsId: "rs12527715",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "T",
							stop: 32817774,
							"p-value": 0.0000368,
							start: 32817774,
							alt: "G",
							rsId: "rs2395269",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "T",
							stop: 32819865,
							"p-value": 0.0000263,
							start: 32819865,
							alt: "C",
							rsId: "rs2071481",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "PSMB9",
							ref: "G",
							stop: 32823567,
							"p-value": 0.0000129,
							start: 32823567,
							alt: "A",
							rsId: "rs991760",
							entrez_id: 5698,
							chr: "chr6"
						},
						{
							gene_name: "PSMB9",
							ref: "C",
							stop: 32825507,
							"p-value": 0.0000072,
							start: 32825507,
							alt: "T",
							rsId: "rs9276815",
							entrez_id: 5698,
							chr: "chr6"
						},
						{
							gene_name: "PPP1R2P1",
							ref: "A",
							stop: 32837737,
							"p-value": 0.0000354,
							start: 32837737,
							alt: "C",
							rsId: "rs17220262",
							entrez_id: 100507444,
							chr: "chr6"
						},
						{
							gene_name: "PPP1R2P1",
							ref: "G",
							stop: 32845672,
							"p-value": 0.0000109,
							start: 32845672,
							alt: "T",
							rsId: "rs4959118",
							entrez_id: 100507444,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "C",
							stop: 32850839,
							"p-value": 0.0000631,
							start: 32850839,
							alt: "T",
							rsId: "rs9276909",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "C",
							stop: 32851701,
							"p-value": 0.0000245,
							start: 32851701,
							alt: "T",
							rsId: "rs4947354",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "T",
							stop: 32852647,
							"p-value": 0.0000137,
							start: 32852647,
							alt: "C",
							rsId: "rs2187689",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "C",
							stop: 32853042,
							"p-value": 0.00000537,
							start: 32853042,
							alt: "A",
							rsId: "rs7767277",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "G",
							stop: 32854697,
							"p-value": 0.0000197,
							start: 32854697,
							alt: "A",
							rsId: "rs10046257",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "A",
							stop: 32859000,
							"p-value": 0.0000326,
							start: 32859000,
							alt: "G",
							rsId: "rs241413",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "G",
							stop: 32865911,
							"p-value": 0.00000115,
							start: 32865911,
							alt: "A",
							rsId: "rs9276915",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "T",
							stop: 32865997,
							"p-value": 0.0000296,
							start: 32865997,
							alt: "C",
							rsId: "rs241404",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "T",
							stop: 32869045,
							"p-value": 0.000028,
							start: 32869045,
							alt: "C",
							rsId: "rs241402",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "G",
							stop: 32871536,
							"p-value": 0.000037,
							start: 32871536,
							alt: "A",
							rsId: "rs241400",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "A",
							stop: 32895351,
							"p-value": 0.0000292,
							start: 32895351,
							alt: "G",
							rsId: "rs12526120",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMA",
							ref: "G",
							stop: 32910877,
							"p-value": 0.0000245,
							start: 32910877,
							alt: "A",
							rsId: "rs16871169",
							entrez_id: 3108,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOA",
							ref: "G",
							stop: 32968339,
							"p-value": 8e-9,
							start: 32968339,
							alt: "C",
							rsId: "rs2894311",
							entrez_id: 3111,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOA",
							ref: "T",
							stop: 32971150,
							"p-value": 6.74e-9,
							start: 32971150,
							alt: "C",
							rsId: "rs11966070",
							entrez_id: 3111,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 32977420,
							"p-value": 0.0000476,
							start: 32977420,
							alt: "T",
							rsId: "rs381218",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 32998564,
							"p-value": 0.0000046,
							start: 32998564,
							alt: "T",
							rsId: "rs1431396",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33017502,
							"p-value": 0.0000578,
							start: 33017502,
							alt: "A",
							rsId: "rs3130177",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33020777,
							"p-value": 5.33e-7,
							start: 33020777,
							alt: "T",
							rsId: "rs3097662",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33020842,
							"p-value": 0.00000147,
							start: 33020842,
							alt: "G",
							rsId: "rs3128953",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33020849,
							"p-value": 0.00000162,
							start: 33020849,
							alt: "G",
							rsId: "rs3128954",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33020929,
							"p-value": 0.00000194,
							start: 33020929,
							alt: "G",
							rsId: "rs7743129",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33021221,
							"p-value": 0.00000173,
							start: 33021221,
							alt: "G",
							rsId: "rs3128956",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33021256,
							"p-value": 0.00000139,
							start: 33021256,
							alt: "A",
							rsId: "rs3130586",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33021362,
							"p-value": 0.00000114,
							start: 33021362,
							alt: "G",
							rsId: "rs9277138",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33022467,
							"p-value": 0.00000142,
							start: 33022467,
							alt: "G",
							rsId: "rs3097663",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33022487,
							"p-value": 0.00000442,
							start: 33022487,
							alt: "A",
							rsId: "rs3130181",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33022518,
							"p-value": 0.00000165,
							start: 33022518,
							alt: "G",
							rsId: "rs3097664",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33022961,
							"p-value": 9.5e-7,
							start: 33022961,
							alt: "T",
							rsId: "rs9277171",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33023063,
							"p-value": 0.00000173,
							start: 33023063,
							alt: "C",
							rsId: "rs9277174",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33023150,
							"p-value": 0.0000143,
							start: 33023150,
							alt: "T",
							rsId: "rs9277176",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33023162,
							"p-value": 0.000004,
							start: 33023162,
							alt: "T",
							rsId: "rs9277177",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33023265,
							"p-value": 0.00000124,
							start: 33023265,
							alt: "G",
							rsId: "rs9277182",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33024606,
							"p-value": 1.31e-12,
							start: 33024606,
							alt: "G",
							rsId: "rs376877",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33024654,
							"p-value": 3.99e-20,
							start: 33024654,
							alt: "C",
							rsId: "rs3135402",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33025440,
							"p-value": 1.9e-7,
							start: 33025440,
							alt: "C",
							rsId: "rs2116260",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33025740,
							"p-value": 0.00000127,
							start: 33025740,
							alt: "C",
							rsId: "rs7757860",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33025824,
							"p-value": 5.01e-8,
							start: 33025824,
							alt: "A",
							rsId: "rs5025825",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33026110,
							"p-value": 8.47e-20,
							start: 33026110,
							alt: "C",
							rsId: "rs422544",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33026214,
							"p-value": 1.19e-21,
							start: 33026214,
							alt: "A",
							rsId: "rs2395308",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33026246,
							"p-value": 5.88e-23,
							start: 33026246,
							alt: "G",
							rsId: "rs2395309",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33026316,
							"p-value": 8.21e-22,
							start: 33026316,
							alt: "T",
							rsId: "rs2395310",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33026388,
							"p-value": 8.46e-7,
							start: 33026388,
							alt: "A",
							rsId: "rs34889247",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33031677,
							"p-value": 2.51e-21,
							start: 33031677,
							alt: "A",
							rsId: "rs35953215",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33032272,
							"p-value": 4.29e-21,
							start: 33032272,
							alt: "T",
							rsId: "rs17214533",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33032347,
							"p-value": 1.37e-21,
							start: 33032347,
							alt: "G",
							rsId: "rs17220927",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33032636,
							"p-value": 1.92e-21,
							start: 33032636,
							alt: "G",
							rsId: "rs17220961",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33032663,
							"p-value": 3.05e-21,
							start: 33032663,
							alt: "A",
							rsId: "rs17220968",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33032668,
							"p-value": 5.47e-21,
							start: 33032668,
							alt: "G",
							rsId: "rs17214573",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33032975,
							"p-value": 0.00000156,
							start: 33032975,
							alt: "C",
							rsId: "rs7905",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33033022,
							"p-value": 7.54e-22,
							start: 33033022,
							alt: "G",
							rsId: "rs3077",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33034113,
							"p-value": 9.4e-22,
							start: 33034113,
							alt: "C",
							rsId: "rs6899851",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33034815,
							"p-value": 0.00000209,
							start: 33034815,
							alt: "A",
							rsId: "rs1367728",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33034876,
							"p-value": 5.01e-21,
							start: 33034876,
							alt: "C",
							rsId: "rs9469332",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33035771,
							"p-value": 1.45e-7,
							start: 33035771,
							alt: "C",
							rsId: "rs1054025",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33035969,
							"p-value": 5.42e-22,
							start: 33035969,
							alt: "G",
							rsId: "rs3179779",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33036177,
							"p-value": 1.02e-21,
							start: 33036177,
							alt: "G",
							rsId: "rs3180554",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33037104,
							"p-value": 1.05e-21,
							start: 33037104,
							alt: "T",
							rsId: "rs34950776",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33037675,
							"p-value": 2.34e-21,
							start: 33037675,
							alt: "A",
							rsId: "rs10214910",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33039376,
							"p-value": 1.74e-21,
							start: 33039376,
							alt: "T",
							rsId: "rs34624643",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33039484,
							"p-value": 1.19e-21,
							start: 33039484,
							alt: "G",
							rsId: "rs13196639",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33039503,
							"p-value": 4.05e-21,
							start: 33039503,
							alt: "T",
							rsId: "rs34197320",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33039652,
							"p-value": 4.03e-7,
							start: 33039652,
							alt: "T",
							rsId: "rs35979982",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33039755,
							"p-value": 1.9e-21,
							start: 33039755,
							alt: "C",
							rsId: "rs13213265",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33039837,
							"p-value": 1.89e-21,
							start: 33039837,
							alt: "A",
							rsId: "rs36043556",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33040138,
							"p-value": 1.34e-7,
							start: 33040138,
							alt: "A",
							rsId: "rs4582419",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33040596,
							"p-value": 2.17e-21,
							start: 33040596,
							alt: "G",
							rsId: "rs4640928",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33040654,
							"p-value": 3.1e-7,
							start: 33040654,
							alt: "G",
							rsId: "rs6914348",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33040781,
							"p-value": 2.55e-21,
							start: 33040781,
							alt: "G",
							rsId: "rs9380337",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33040877,
							"p-value": 5.77e-22,
							start: 33040877,
							alt: "C",
							rsId: "rs9380339",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33041073,
							"p-value": 7.36e-8,
							start: 33041073,
							alt: "C",
							rsId: "rs9357156",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33041226,
							"p-value": 2.25e-21,
							start: 33041226,
							alt: "T",
							rsId: "rs4247257",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33041734,
							"p-value": 2.04e-11,
							start: 33041734,
							alt: "C",
							rsId: "rs2856830",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33042291,
							"p-value": 1.01e-7,
							start: 33042291,
							alt: "G",
							rsId: "rs9380340",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33042551,
							"p-value": 1.36e-7,
							start: 33042551,
							alt: "T",
							rsId: "rs9296073",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33042598,
							"p-value": 1.17e-7,
							start: 33042598,
							alt: "G",
							rsId: "rs9296074",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33042880,
							"p-value": 8.33e-7,
							start: 33042880,
							alt: "G",
							rsId: "rs987870",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33043526,
							"p-value": 4.53e-7,
							start: 33043526,
							alt: "T",
							rsId: "rs2071350",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33046082,
							"p-value": 7.85e-18,
							start: 33046082,
							alt: "T",
							rsId: "rs2856819",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33048921,
							"p-value": 3.76e-7,
							start: 33048921,
							alt: "G",
							rsId: "rs7770370",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33049211,
							"p-value": 1.58e-18,
							start: 33049211,
							alt: "T",
							rsId: "rs928976",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33049309,
							"p-value": 1.3e-7,
							start: 33049309,
							alt: "G",
							rsId: "rs9378176",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33049384,
							"p-value": 1.16e-7,
							start: 33049384,
							alt: "G",
							rsId: "rs9378177",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33049979,
							"p-value": 7.42e-19,
							start: 33049979,
							alt: "G",
							rsId: "rs9277357",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33050024,
							"p-value": 6.73e-17,
							start: 33050024,
							alt: "A",
							rsId: "rs9277359",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33050045,
							"p-value": 3.89e-18,
							start: 33050045,
							alt: "C",
							rsId: "rs9277361",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050078,
							"p-value": 2.38e-18,
							start: 33050078,
							alt: "G",
							rsId: "rs9277362",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050279,
							"p-value": 3.73e-18,
							start: 33050279,
							alt: "G",
							rsId: "rs9277378",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050325,
							"p-value": 0.0000166,
							start: 33050325,
							alt: "C",
							rsId: "rs9277379",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050441,
							"p-value": 1.85e-18,
							start: 33050441,
							alt: "A",
							rsId: "rs9277382",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050521,
							"p-value": 3.13e-18,
							start: 33050521,
							alt: "T",
							rsId: "rs9277387",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050654,
							"p-value": 9.13e-18,
							start: 33050654,
							alt: "A",
							rsId: "rs3128960",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050742,
							"p-value": 3.26e-18,
							start: 33050742,
							alt: "A",
							rsId: "rs3128961",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050877,
							"p-value": 1.2e-17,
							start: 33050877,
							alt: "G",
							rsId: "rs9277393",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33051051,
							"p-value": 5.51e-18,
							start: 33051051,
							alt: "G",
							rsId: "rs9277395",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051139,
							"p-value": 5.06e-17,
							start: 33051139,
							alt: "A",
							rsId: "rs9277396",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051562,
							"p-value": 7.17e-19,
							start: 33051562,
							alt: "A",
							rsId: "rs9277408",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051640,
							"p-value": 8.8e-16,
							start: 33051640,
							alt: "A",
							rsId: "rs9277410",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051683,
							"p-value": 4.95e-18,
							start: 33051683,
							alt: "T",
							rsId: "rs9277411",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051689,
							"p-value": 1.56e-17,
							start: 33051689,
							alt: "T",
							rsId: "rs9277412",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051720,
							"p-value": 4.42e-18,
							start: 33051720,
							alt: "A",
							rsId: "rs9277413",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051749,
							"p-value": 3.02e-17,
							start: 33051749,
							alt: "T",
							rsId: "rs9277418",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051820,
							"p-value": 6.44e-18,
							start: 33051820,
							alt: "A",
							rsId: "rs9277421",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33051865,
							"p-value": 4.62e-18,
							start: 33051865,
							alt: "C",
							rsId: "rs9277424",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051910,
							"p-value": 1.41e-18,
							start: 33051910,
							alt: "A",
							rsId: "rs9277426",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33052007,
							"p-value": 9.69e-18,
							start: 33052007,
							alt: "A",
							rsId: "rs9277429",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33052186,
							"p-value": 3.32e-18,
							start: 33052186,
							alt: "G",
							rsId: "rs9277434",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33052250,
							"p-value": 4.7e-18,
							start: 33052250,
							alt: "G",
							rsId: "rs9277437",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33052354,
							"p-value": 2.91e-17,
							start: 33052354,
							alt: "A",
							rsId: "rs9277441",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33053167,
							"p-value": 4.48e-18,
							start: 33053167,
							alt: "C",
							rsId: "rs9277458",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33053307,
							"p-value": 3.17e-18,
							start: 33053307,
							alt: "T",
							rsId: "rs9277463",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33053352,
							"p-value": 3.37e-18,
							start: 33053352,
							alt: "T",
							rsId: "rs9277464",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33053399,
							"p-value": 8.03e-18,
							start: 33053399,
							alt: "C",
							rsId: "rs9277466",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33053682,
							"p-value": 6.22e-18,
							start: 33053682,
							alt: "A",
							rsId: "rs9277471",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33053820,
							"p-value": 1.19e-17,
							start: 33053820,
							alt: "G",
							rsId: "rs9277481",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33053942,
							"p-value": 3.06e-18,
							start: 33053942,
							alt: "C",
							rsId: "rs9277489",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33054074,
							"p-value": 2.17e-19,
							start: 33054074,
							alt: "T",
							rsId: "rs9277496",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33054177,
							"p-value": 1.28e-18,
							start: 33054177,
							alt: "C",
							rsId: "rs9277508",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054207,
							"p-value": 1.02e-17,
							start: 33054207,
							alt: "G",
							rsId: "rs9277509",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33054281,
							"p-value": 6.83e-18,
							start: 33054281,
							alt: "A",
							rsId: "rs9277517",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054457,
							"p-value": 4.22e-18,
							start: 33054457,
							alt: "G",
							rsId: "rs1042544",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33054550,
							"p-value": 9.54e-18,
							start: 33054550,
							alt: "A",
							rsId: "rs931",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33054721,
							"p-value": 5.38e-18,
							start: 33054721,
							alt: "T",
							rsId: "rs9277533",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054807,
							"p-value": 3.65e-17,
							start: 33054807,
							alt: "G",
							rsId: "rs9277534",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054861,
							"p-value": 6.55e-18,
							start: 33054861,
							alt: "G",
							rsId: "rs9277535",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33054890,
							"p-value": 3.3e-18,
							start: 33054890,
							alt: "T",
							rsId: "rs9277536",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33055009,
							"p-value": 4.66e-18,
							start: 33055009,
							alt: "A",
							rsId: "rs9277537",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33055079,
							"p-value": 8.63e-19,
							start: 33055079,
							alt: "G",
							rsId: "rs9277539",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33055247,
							"p-value": 3.71e-17,
							start: 33055247,
							alt: "C",
							rsId: "rs9277542",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33055323,
							"p-value": 3.57e-18,
							start: 33055323,
							alt: "T",
							rsId: "rs9277545",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33055346,
							"p-value": 8.4e-18,
							start: 33055346,
							alt: "G",
							rsId: "rs9277546",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33055419,
							"p-value": 2.55e-17,
							start: 33055419,
							alt: "G",
							rsId: "rs9277549",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33055780,
							"p-value": 7.91e-18,
							start: 33055780,
							alt: "T",
							rsId: "rs3128963",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33055818,
							"p-value": 2.64e-18,
							start: 33055818,
							alt: "G",
							rsId: "rs3128964",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33055899,
							"p-value": 0.0000054,
							start: 33055899,
							alt: "A",
							rsId: "rs3128965",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33055946,
							"p-value": 0.000019,
							start: 33055946,
							alt: "A",
							rsId: "rs3128966",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33056069,
							"p-value": 4.83e-18,
							start: 33056069,
							alt: "A",
							rsId: "rs3117229",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33056207,
							"p-value": 1.74e-18,
							start: 33056207,
							alt: "T",
							rsId: "rs3130186",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33056405,
							"p-value": 3.71e-18,
							start: 33056405,
							alt: "T",
							rsId: "rs3130187",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33056435,
							"p-value": 5.88e-18,
							start: 33056435,
							alt: "T",
							rsId: "rs3117228",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33056566,
							"p-value": 5.18e-18,
							start: 33056566,
							alt: "C",
							rsId: "rs3091281",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33056962,
							"p-value": 1.47e-7,
							start: 33056962,
							alt: "T",
							rsId: "rs3097649",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33057013,
							"p-value": 1.28e-18,
							start: 33057013,
							alt: "C",
							rsId: "rs9277567",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33057244,
							"p-value": 2.55e-18,
							start: 33057244,
							alt: "G",
							rsId: "rs3091284",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33057440,
							"p-value": 1.59e-18,
							start: 33057440,
							alt: "T",
							rsId: "rs3097650",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33057711,
							"p-value": 3.85e-18,
							start: 33057711,
							alt: "A",
							rsId: "rs3117225",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33057835,
							"p-value": 3.3e-18,
							start: 33057835,
							alt: "T",
							rsId: "rs3097652",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33058718,
							"p-value": 2.29e-7,
							start: 33058718,
							alt: "A",
							rsId: "rs2068204",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33058952,
							"p-value": 4.08e-7,
							start: 33058952,
							alt: "A",
							rsId: "rs10484569",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33059262,
							"p-value": 6.41e-18,
							start: 33059262,
							alt: "C",
							rsId: "rs2179919",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33059669,
							"p-value": 0.00000806,
							start: 33059669,
							alt: "T",
							rsId: "rs2281390",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33059796,
							"p-value": 0.0000198,
							start: 33059796,
							alt: "G",
							rsId: "rs2281389",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33059996,
							"p-value": 1.54e-18,
							start: 33059996,
							alt: "G",
							rsId: "rs3128917",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33060064,
							"p-value": 2.55e-18,
							start: 33060064,
							alt: "A",
							rsId: "rs3117223",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33060118,
							"p-value": 1.83e-7,
							start: 33060118,
							alt: "A",
							rsId: "rs2281388",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33060870,
							"p-value": 0.0000131,
							start: 33060870,
							alt: "T",
							rsId: "rs2295119",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33060949,
							"p-value": 1.02e-17,
							start: 33060949,
							alt: "T",
							rsId: "rs3117222",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33061098,
							"p-value": 0.00001,
							start: 33061098,
							alt: "C",
							rsId: "rs3128918",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33061690,
							"p-value": 1.99e-18,
							start: 33061690,
							alt: "C",
							rsId: "rs3130190",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33061947,
							"p-value": 1.78e-18,
							start: 33061947,
							alt: "T",
							rsId: "rs3117221",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33062587,
							"p-value": 2.28e-18,
							start: 33062587,
							alt: "A",
							rsId: "rs3117219",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33062715,
							"p-value": 0.000012,
							start: 33062715,
							alt: "A",
							rsId: "rs3117218",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33062822,
							"p-value": 5.6e-18,
							start: 33062822,
							alt: "G",
							rsId: "rs2144016",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33062889,
							"p-value": 3.92e-19,
							start: 33062889,
							alt: "A",
							rsId: "rs2144015",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33063196,
							"p-value": 3.93e-18,
							start: 33063196,
							alt: "G",
							rsId: "rs2179916",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33063272,
							"p-value": 1.51e-18,
							start: 33063272,
							alt: "T",
							rsId: "rs3130197",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33063931,
							"p-value": 3.32e-18,
							start: 33063931,
							alt: "G",
							rsId: "rs3130198",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33064451,
							"p-value": 4.11e-18,
							start: 33064451,
							alt: "A",
							rsId: "rs3117214",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33064598,
							"p-value": 0.0000288,
							start: 33064598,
							alt: "A",
							rsId: "rs3130200",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33064786,
							"p-value": 1.62e-18,
							start: 33064786,
							alt: "G",
							rsId: "rs7757520",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33065676,
							"p-value": 1.48e-17,
							start: 33065676,
							alt: "G",
							rsId: "rs2395316",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33067211,
							"p-value": 1.09e-18,
							start: 33067211,
							alt: "T",
							rsId: "rs2395319",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33070749,
							"p-value": 1.38e-18,
							start: 33070749,
							alt: "A",
							rsId: "rs3128921",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33071600,
							"p-value": 0.0000117,
							start: 33071600,
							alt: "A",
							rsId: "rs3128925",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33071708,
							"p-value": 0.000051,
							start: 33071708,
							alt: "A",
							rsId: "rs3129196",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33072172,
							"p-value": 2.5e-7,
							start: 33072172,
							alt: "G",
							rsId: "rs4282438",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33072266,
							"p-value": 0.0000155,
							start: 33072266,
							alt: "T",
							rsId: "rs2064478",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33072539,
							"p-value": 4.85e-8,
							start: 33072539,
							alt: "T",
							rsId: "rs9296079",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33072729,
							"p-value": 0.000036,
							start: 33072729,
							alt: "T",
							rsId: "rs3130210",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33073068,
							"p-value": 0.0000171,
							start: 33073068,
							alt: "G",
							rsId: "rs3117236",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33073322,
							"p-value": 1.24e-17,
							start: 33073322,
							alt: "G",
							rsId: "rs2064476",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33073515,
							"p-value": 0.0000225,
							start: 33073515,
							alt: "A",
							rsId: "rs2064473",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33073789,
							"p-value": 5.54e-7,
							start: 33073789,
							alt: "C",
							rsId: "rs17221241",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33073904,
							"p-value": 7.2e-8,
							start: 33073904,
							alt: "T",
							rsId: "rs9368752",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33073984,
							"p-value": 0.0000238,
							start: 33073984,
							alt: "G",
							rsId: "rs3117234",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33074569,
							"p-value": 0.0000281,
							start: 33074569,
							alt: "G",
							rsId: "rs3117232",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33074908,
							"p-value": 1.84e-18,
							start: 33074908,
							alt: "G",
							rsId: "rs3117231",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33075443,
							"p-value": 0.0000313,
							start: 33075443,
							alt: "T",
							rsId: "rs910320",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33075635,
							"p-value": 0.0000337,
							start: 33075635,
							alt: "G",
							rsId: "rs3117230",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33076539,
							"p-value": 3.53e-7,
							start: 33076539,
							alt: "T",
							rsId: "rs9296080",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33079166,
							"p-value": 6.98e-7,
							start: 33079166,
							alt: "T",
							rsId: "rs9380343",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33079385,
							"p-value": 4.66e-8,
							start: 33079385,
							alt: "T",
							rsId: "rs12174662",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33079476,
							"p-value": 7.66e-17,
							start: 33079476,
							alt: "A",
							rsId: "rs9394133",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33079689,
							"p-value": 7.79e-7,
							start: 33079689,
							alt: "T",
							rsId: "rs9380344",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33079812,
							"p-value": 0.00000145,
							start: 33079812,
							alt: "G",
							rsId: "rs6937061",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33080360,
							"p-value": 1.42e-7,
							start: 33080360,
							alt: "G",
							rsId: "rs9348906",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33080799,
							"p-value": 0.00000725,
							start: 33080799,
							alt: "G",
							rsId: "rs9366814",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33081707,
							"p-value": 0.00000283,
							start: 33081707,
							alt: "T",
							rsId: "rs34823653",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33082040,
							"p-value": 0.0000932,
							start: 33082040,
							alt: "C",
							rsId: "rs9277628",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33082267,
							"p-value": 0.0000159,
							start: 33082267,
							alt: "A",
							rsId: "rs9277630",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33082308,
							"p-value": 0.0000191,
							start: 33082308,
							alt: "A",
							rsId: "rs733208",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33082359,
							"p-value": 0.0000178,
							start: 33082359,
							alt: "C",
							rsId: "rs9277632",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33082468,
							"p-value": 0.000019,
							start: 33082468,
							alt: "C",
							rsId: "rs733209",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33082635,
							"p-value": 0.0000167,
							start: 33082635,
							alt: "T",
							rsId: "rs9277637",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33082692,
							"p-value": 0.0000128,
							start: 33082692,
							alt: "C",
							rsId: "rs9277638",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33083134,
							"p-value": 0.00000739,
							start: 33083134,
							alt: "A",
							rsId: "rs2395349",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33083458,
							"p-value": 0.00000229,
							start: 33083458,
							alt: "A",
							rsId: "rs9277641",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33083599,
							"p-value": 0.00000876,
							start: 33083599,
							alt: "G",
							rsId: "rs9277644",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33084596,
							"p-value": 0.000019,
							start: 33084596,
							alt: "A",
							rsId: "rs9277660",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33084641,
							"p-value": 0.0000231,
							start: 33084641,
							alt: "C",
							rsId: "rs9277661",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33085461,
							"p-value": 0.0000297,
							start: 33085461,
							alt: "A",
							rsId: "rs9277664",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33085575,
							"p-value": 0.0000105,
							start: 33085575,
							alt: "A",
							rsId: "rs9277668",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33085851,
							"p-value": 7.87e-10,
							start: 33085851,
							alt: "T",
							rsId: "rs3117039",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33086657,
							"p-value": 0.00000643,
							start: 33086657,
							alt: "A",
							rsId: "rs9277676",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33087972,
							"p-value": 7.94e-7,
							start: 33087972,
							alt: "T",
							rsId: "rs9380346",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33088825,
							"p-value": 0.0000965,
							start: 33088825,
							alt: "A",
							rsId: "rs9277691",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33089196,
							"p-value": 9.67e-8,
							start: 33089196,
							alt: "A",
							rsId: "rs3129286",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33091605,
							"p-value": 0.00000463,
							start: 33091605,
							alt: "C",
							rsId: "rs41288893",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33094663,
							"p-value": 1.56e-8,
							start: 33094663,
							alt: "C",
							rsId: "rs3130231",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33098569,
							"p-value": 0.0000184,
							start: 33098569,
							alt: "T",
							rsId: "rs9277768",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33104652,
							"p-value": 1.09e-8,
							start: 33104652,
							alt: "T",
							rsId: "rs9277839",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33112576,
							"p-value": 7.13e-8,
							start: 33112576,
							alt: "T",
							rsId: "rs3129229",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "G",
							stop: 33112640,
							"p-value": 1.2e-8,
							start: 33112640,
							alt: "T",
							rsId: "rs3129227",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "G",
							stop: 33112936,
							"p-value": 2.76e-8,
							start: 33112936,
							alt: "A",
							rsId: "rs3130149",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "T",
							stop: 33113394,
							"p-value": 8.29e-9,
							start: 33113394,
							alt: "C",
							rsId: "rs3129222",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "A",
							stop: 33116848,
							"p-value": 0.0000972,
							start: 33116848,
							alt: "G",
							rsId: "rs9277898",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33117258,
							"p-value": 1.18e-8,
							start: 33117258,
							alt: "T",
							rsId: "rs3129214",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "A",
							stop: 33122331,
							"p-value": 1.78e-8,
							start: 33122331,
							alt: "G",
							rsId: "rs756440",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "A",
							stop: 33123281,
							"p-value": 0.0000968,
							start: 33123281,
							alt: "G",
							rsId: "rs9277909",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "G",
							stop: 33124069,
							"p-value": 0.00000163,
							start: 33124069,
							alt: "A",
							rsId: "rs3129208",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "VPS52",
							ref: "C",
							stop: 33194717,
							"p-value": 0.0000518,
							start: 33194717,
							alt: "T",
							rsId: "rs9277946",
							entrez_id: 6293,
							chr: "chr6"
						},
						{
							gene_name: "SYNGAP1",
							ref: "G",
							stop: 33404064,
							"p-value": 0.0000324,
							start: 33404064,
							alt: "A",
							rsId: "rs10807124",
							entrez_id: 8831,
							chr: "chr6"
						},
						{
							gene_name: "BAK1",
							ref: "G",
							stop: 33511229,
							"p-value": 4.7e-7,
							start: 33511229,
							alt: "A",
							rsId: "rs210203",
							entrez_id: 578,
							chr: "chr6"
						},
						{
							gene_name: "ITPR3",
							ref: "T",
							stop: 33564412,
							"p-value": 0.0000697,
							start: 33564412,
							alt: "C",
							rsId: "rs6457736",
							entrez_id: 3710,
							chr: "chr6"
						},
						{
							gene_name: "IP6K3",
							ref: "A",
							stop: 33677400,
							"p-value": 9.54e-7,
							start: 33677400,
							alt: "G",
							rsId: "rs1555965",
							entrez_id: 117283,
							chr: "chr6"
						},
						{
							gene_name: "IP6K3",
							ref: "C",
							stop: 33690796,
							"p-value": 0.00000295,
							start: 33690796,
							alt: "T",
							rsId: "rs4713668",
							entrez_id: 117283,
							chr: "chr6"
						},
						{
							gene_name: "MLN",
							ref: "A",
							stop: 33762625,
							"p-value": 0.00000329,
							start: 33762625,
							alt: "G",
							rsId: "rs11758463",
							entrez_id: 4295,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "C",
							stop: 33791515,
							"p-value": 0.0000261,
							start: 33791515,
							alt: "T",
							rsId: "rs767896",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "A",
							stop: 33852948,
							"p-value": 0.00000489,
							start: 33852948,
							alt: "G",
							rsId: "rs4711363",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "G",
							stop: 33865343,
							"p-value": 0.00000293,
							start: 33865343,
							alt: "T",
							rsId: "rs10947465",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "G",
							stop: 33869806,
							"p-value": 0.00000104,
							start: 33869806,
							alt: "A",
							rsId: "rs9296102",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "A",
							stop: 33872616,
							"p-value": 0.00000951,
							start: 33872616,
							alt: "G",
							rsId: "rs9368782",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "C",
							stop: 33873699,
							"p-value": 0.0000199,
							start: 33873699,
							alt: "T",
							rsId: "rs4563711",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "BMP5",
							ref: "T",
							stop: 55618190,
							"p-value": 0.0000476,
							start: 55618190,
							alt: "C",
							rsId: "rs7773142",
							entrez_id: 653,
							chr: "chr6"
						},
						{
							gene_name: "DST",
							ref: "A",
							stop: 56127621,
							"p-value": 0.0000347,
							start: 56127621,
							alt: "G",
							rsId: "rs1925163",
							entrez_id: 667,
							chr: "chr6"
						},
						{
							gene_name: "PLEKHG1",
							ref: "C",
							stop: 150925101,
							"p-value": 0.000052,
							start: 150925101,
							alt: "G",
							rsId: "rs1546096",
							entrez_id: 57480,
							chr: "chr6"
						},
						{
							gene_name: "MAGI2",
							ref: "G",
							stop: 78230996,
							"p-value": 0.0000105,
							start: 78230996,
							alt: "A",
							rsId: "rs319875",
							entrez_id: 9863,
							chr: "chr7"
						},
						{
							gene_name: "AGK",
							ref: "T",
							stop: 140728682,
							"p-value": 0.0000674,
							start: 140728682,
							alt: "C",
							rsId: "rs2688430",
							entrez_id: 55750,
							chr: "chr7"
						},
						{
							gene_name: "MCPH1",
							ref: "T",
							stop: 5085053,
							"p-value": 0.0000389,
							start: 5085053,
							alt: "C",
							rsId: "rs10089783",
							entrez_id: 79648,
							chr: "chr8"
						},
						{
							gene_name: "BNC2",
							ref: "A",
							stop: 16658915,
							"p-value": 0.0000413,
							start: 16658915,
							alt: "G",
							rsId: "rs10810584",
							entrez_id: 54796,
							chr: "chr9"
						},
						{
							gene_name: "CTNNA3",
							ref: "A",
							stop: 66984552,
							"p-value": 0.0000184,
							start: 66984552,
							alt: "G",
							rsId: "rs9414881",
							entrez_id: 29119,
							chr: "chr10"
						},
						{
							gene_name: "COL13A1",
							ref: "G",
							stop: 71427874,
							"p-value": 0.000005,
							start: 71427874,
							alt: "A",
							rsId: "rs2616068",
							entrez_id: 1305,
							chr: "chr10"
						},
						{
							gene_name: "C11orf68",
							ref: "G",
							stop: 65669903,
							"p-value": 0.0000694,
							start: 65669903,
							alt: "A",
							rsId: "rs9919533",
							entrez_id: 83638,
							chr: "chr11"
						},
						{
							gene_name: "GRAMD1B",
							ref: "G",
							stop: 123182169,
							"p-value": 0.0000927,
							start: 123182169,
							alt: "A",
							rsId: "rs10750236",
							entrez_id: 57476,
							chr: "chr11"
						},
						{
							gene_name: "KLRA1P",
							ref: "G",
							stop: 10747616,
							"p-value": 0.0000131,
							start: 10747616,
							alt: "A",
							rsId: "rs17809421",
							entrez_id: 10748,
							chr: "chr12"
						},
						{
							gene_name: "MAGOHB",
							ref: "C",
							stop: 10762757,
							"p-value": 0.0000189,
							start: 10762757,
							alt: "T",
							rsId: "rs10845181",
							entrez_id: 55110,
							chr: "chr12"
						},
						{
							gene_name: "CNOT2",
							ref: "G",
							stop: 70429915,
							"p-value": 0.0000633,
							start: 70429915,
							alt: "A",
							rsId: "rs11178054",
							entrez_id: 4848,
							chr: "chr12"
						},
						{
							gene_name: "TMEM132C",
							ref: "G",
							stop: 127839964,
							"p-value": 0.0000604,
							start: 127839964,
							alt: "A",
							rsId: "rs7966852",
							entrez_id: 92293,
							chr: "chr12"
						},
						{
							gene_name: "TMEM132C",
							ref: "G",
							stop: 127840232,
							"p-value": 0.0000985,
							start: 127840232,
							alt: "A",
							rsId: "rs7967228",
							entrez_id: 92293,
							chr: "chr12"
						},
						{
							gene_name: "SGCG",
							ref: "G",
							stop: 22542740,
							"p-value": 0.0000743,
							start: 22542740,
							alt: "A",
							rsId: "rs7319718",
							entrez_id: 6445,
							chr: "chr13"
						},
						{
							ref: "C",
							stop: 40795744,
							"p-value": 0.0000175,
							start: 40795744,
							alt: "T",
							rsId: "rs7319395",
							chr: "chr13"
						},
						{
							gene_name: "PCDH9",
							ref: "T",
							stop: 64556345,
							"p-value": 0.0000851,
							start: 64556345,
							alt: "C",
							rsId: "rs11842829",
							entrez_id: 5101,
							chr: "chr13"
						},
						{
							gene_name: "NALCN",
							ref: "A",
							stop: 101603150,
							"p-value": 0.0000161,
							start: 101603150,
							alt: "G",
							rsId: "rs2803214",
							entrez_id: 259232,
							chr: "chr13"
						},
						{
							gene_name: "C14orf177",
							ref: "C",
							stop: 98935548,
							"p-value": 0.0000713,
							start: 98935548,
							alt: "T",
							rsId: "rs17096983",
							entrez_id: 283598,
							chr: "chr14"
						},
						{
							gene_name: "C14orf177",
							ref: "T",
							stop: 98984324,
							"p-value": 0.0000964,
							start: 98984324,
							alt: "C",
							rsId: "rs1951102",
							entrez_id: 283598,
							chr: "chr14"
						},
						{
							gene_name: "ALOX12",
							ref: "A",
							stop: 6847073,
							"p-value": 0.0000688,
							start: 6847073,
							alt: "G",
							rsId: "rs2135845",
							entrez_id: 239,
							chr: "chr17"
						},
						{
							gene_name: "ASIC2",
							ref: "C",
							stop: 32193700,
							"p-value": 0.0000226,
							start: 32193700,
							alt: "T",
							rsId: "rs17783671",
							entrez_id: 40,
							chr: "chr17"
						},
						{
							gene_name: "ASIC2",
							ref: "T",
							stop: 32200518,
							"p-value": 0.00000807,
							start: 32200518,
							alt: "G",
							rsId: "rs1041719",
							entrez_id: 40,
							chr: "chr17"
						},
						{
							gene_name: "ASIC2",
							ref: "C",
							stop: 32201521,
							"p-value": 0.0000597,
							start: 32201521,
							alt: "A",
							rsId: "rs915484",
							entrez_id: 40,
							chr: "chr17"
						},
						{
							gene_name: "DLGAP1",
							ref: "C",
							stop: 3774446,
							"p-value": 0.0000659,
							start: 3774446,
							alt: "T",
							rsId: "rs8097867",
							entrez_id: 9229,
							chr: "chr18"
						},
						{
							gene_name: "RPL12",
							ref: "A",
							stop: 53317873,
							"p-value": 0.0000162,
							start: 53317873,
							alt: "G",
							rsId: "rs6068956",
							entrez_id: 6136,
							chr: "chr20"
						},
						{
							gene_name: "RPL12",
							ref: "G",
							stop: 53328421,
							"p-value": 0.0000445,
							start: 53328421,
							alt: "T",
							rsId: "rs2206914",
							entrez_id: 6136,
							chr: "chr20"
						},
						{
							gene_name: "BACH1",
							ref: "A",
							stop: 30556454,
							"p-value": 0.0000748,
							start: 30556454,
							alt: "G",
							rsId: "rs9983214",
							entrez_id: 571,
							chr: "chr21"
						},
						{
							gene_name: "EP300",
							ref: "G",
							stop: 41498627,
							"p-value": 0.0000606,
							start: 41498627,
							alt: "A",
							rsId: "rs7286979",
							entrez_id: 2033,
							chr: "chr22"
						},
						{
							gene_name: "L3MBTL2",
							ref: "A",
							stop: 41597377,
							"p-value": 0.0000616,
							start: 41597377,
							alt: "C",
							rsId: "rs8138990",
							entrez_id: 83746,
							chr: "chr22"
						},
						{
							gene_name: "C22orf34",
							ref: "C",
							stop: 49790537,
							"p-value": 0.0000236,
							start: 49790537,
							alt: "T",
							rsId: "rs1108785",
							entrez_id: 348645,
							chr: "chr22"
						}
					]
				}
			}
		}
	]
};
var data = {
	dataset: dataset$1
};

const pagination = async function (shadowRoot, params, overThreshArray) {
  // const root;
  const pageBtns = shadowRoot.querySelectorAll(".page-btn");
  const prevBtn = shadowRoot.querySelector("#prevBtn");
  const nextBtn = shadowRoot.querySelector("#nextBtn");
  const firstBtn = shadowRoot.querySelector("#firstBtn");
  const lastBtn = shadowRoot.querySelector("#lastBtn");

  let currentPage = 1;
  const recordsPerPage = params["recordsPerPage"];
  const totalPage = Math.ceil(overThreshArray.length / recordsPerPage);

  // this.init = function () {
  updateTable(1);
  addEventListeners();
  // };

  function surroundingPages() {
    let start, end;
    if (currentPage <= 3) {
      start = 1;
      end = Math.min(start + 4, totalPage);
    } else if (totalPage - currentPage <= 3) {
      end = totalPage;
      start = Math.max(end - 4, 1);
    } else {
      start = Math.max(currentPage - 2, 1);
      end = Math.min(currentPage + 2, totalPage);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  function addEventListeners() {
    prevBtn.addEventListener("click", () => {
      updateTable(currentPage - 1);
    });
    nextBtn.addEventListener("click", () => {
      updateTable(currentPage + 1);
    });
    firstBtn.addEventListener("click", () => {
      updateTable(1);
    });
    lastBtn.addEventListener("click", () => {
      updateTable(totalPage);
    });
  }

  function updateTable(page) {
    currentPage = page;
    const listingTable = shadowRoot.querySelector("#listingTable");
    listingTable.innerHTML = "";
    const tableHeadArray = [
      "gene_name",
      "rsId",
      "chr",
      "pos",
      "ref",
      "alt",
      "p-value",
    ];

    for (
      let i = (page - 1) * recordsPerPage;
      i < page * recordsPerPage && i < overThreshArray.length;
      i++
    ) {
      const tr = document.createElement("tr");
      for (let j = 0; j < tableHeadArray.length; j++) {
        const td = document.createElement("td");
        if (overThreshArray[i][`${tableHeadArray[j]}`]) {
          if (tableHeadArray[j] === "gene_name") {
            const displayedGeneName =
              overThreshArray[i][`${tableHeadArray[j]}`];
            td.innerHTML = `<a target="_blank" href="https://mgend.med.kyoto-u.ac.jp/gene/info/${overThreshArray[i].entrez_id}#locuszoom-link">${displayedGeneName}</a>`;
          } else {
            td.innerText = overThreshArray[i][`${tableHeadArray[j]}`];
          }
        } else {
          td.innerText = "";
        }
        tr.appendChild(td);
      }
      listingTable.appendChild(tr);
    }
    updatePagination();
  }

  function updatePagination() {
    const pageNumber = shadowRoot.querySelector("#pageNumber");
    pageNumber.innerHTML = "";
    const surroundingPage = surroundingPages();

    for (const i of surroundingPage) {
      const pageNumBtn = document.createElement("span");
      pageNumBtn.innerText = i;
      pageNumBtn.setAttribute("class", "page-btn");

      if (i === currentPage) {
        pageNumBtn.classList.add("current");
      }

      pageNumBtn.addEventListener("click", () => {
        updateTable(i);
      });
      pageNumber.append(pageNumBtn);
    }
    pageBtns.forEach((pageBtns) => (pageBtns.style.display = "flex"));

    if (currentPage === 1) {
      firstBtn.style.display = "none";
      prevBtn.style.display = "none";
    }

    if (currentPage === totalPage) {
      nextBtn.style.display = "none";
      lastBtn.style.display = "none";
    }
  }
};

//when you put json url
// console.log(params["data-url"]]);
// const dataset = await getFormatedJson(
//   params["data-url"],
//   stanza.root.querySelector("#chart")
// );
// console.log("dataset", dataset);

// study name(single per a json)
const dataset = data.dataset;
const studyName = Object.keys(dataset)[0];

//project data and project names (single per a json)
const project = Object.values(dataset)[0][0];
const projectName = Object.keys(project)[0];

// stage data and stage names
const stageData = Object.values(project)[0];
let stageNames = Object.keys(stageData);

const fixedStageNamesOrder = [
  "discovery",
  "replication",
  "combined",
  "meta analysis",
  "not provided",
];
stageNames = fixedStageNamesOrder.filter((stageName) => {
  if (stageData[stageName]) {
    return true;
  } else {
    return false;
  }
});

//add stage information to each plot
for (let i = 0; i < stageNames.length; i++) {
  for (let j = 0; j < stageData[stageNames[i]].variants.length; j++) {
    stageData[stageNames[i]].variants[j].stage = stageNames[i];
  }
}

//combine variants to display
let totalVariants = [];
stageNames.forEach(
  (stage) => (totalVariants = totalVariants.concat(stageData[stage].variants))
);

// get stage information
const getVariants = () => {
  let variantsArray = [];
  stageNames.forEach((stage) => {
    if (stageData[stage].checked) {
      variantsArray = variantsArray.concat(stageData[stage].variants);
    }
  });
  return variantsArray;
};
let variants = totalVariants; //init

async function manhattanPlot(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      studyName,
      projectName,
    },
  });

  //append checkbox and its conditions to filter stages
  const stageList = stanza.root.querySelector("#stageList");
  const firstConditionList = stanza.root.querySelector("#firstConditionList");
  const secondConditionList = stanza.root.querySelector("#secondConditionList");

  let td, input, label;
  for (let i = 0; i < stageNames.length; i++) {
    td = document.createElement("td");
    input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", "stage-btn");
    input.setAttribute("id", `${stageNames[i]}Btn`);
    input.setAttribute("name", "stage");
    input.setAttribute("value", stageNames[i]);
    input.setAttribute("checked", true);
    input.setAttribute("data-stage", stageNames[i]);
    label = document.createElement("label");
    label.textContent = stageNames[i];
    label.setAttribute("for", `${stageNames[i]}Btn`);
    label.setAttribute("data-stage", stageNames[i]);
    stageList.appendChild(td);
    td.appendChild(input);
    td.appendChild(label);
    stageData[stageNames[i]].checked = true;
  }

  firstConditionList.insertAdjacentHTML(
    "beforeend",
    stageNames
      .map(
        (stage) =>
          `<td class="condition-key">${stageData[stage].condition1}</td>`
      )
      .join("")
  );
  secondConditionList.insertAdjacentHTML(
    "beforeend",
    stageNames
      .map(
        (stage) =>
          `<td class="condition-key">${stageData[stage].condition2}</td>`
      )
      .join("")
  );

  // adjust data
  for (let i = 0; i < variants.length; i++) {
    // convert chromosome data from 'chrnum' to 'num'
    let chr = variants[i].chr;
    chr = chr.replace("chr", "");
    variants[i].chr = chr;

    variants[i]["p-value"];

    variants[i]["stop"];
  }

  if (typeof variants === "object") {
    draw(stanza, params);
    appendDlButton(
      stanza.root.querySelector("#chart"),
      stanza.root.querySelector("svg"),
      "manhattan_plot",
      stanza
    );
  }
}

async function draw(stanza, params) {
  const width = 800;
  const height = 400;
  const marginLeft = 40;
  const marginBottom = 30;
  const paddingTop = 10;
  const areaWidth = width - marginLeft;
  const areaHeight = height - marginBottom;
  const drawAreaHeight = areaHeight - paddingTop;

  const chartElement = stanza.root.querySelector("#chart");
  const controlElement = stanza.root.querySelector("#control");
  let overThreshArray;

  if (params.lowThresh === "") {
    params.lowThresh = 4;
  }
  if (params.highThresh === "") {
    params.highThresh = Infinity;
  }
  if (params.chromosomeKey === "") {
    params.chromosomeKey = "chr";
  }
  if (params.positionKey === "") {
    params.positionKey = "position";
  }
  if (params.pValueKey === "") {
    params.pValueKey = "p-value";
  }

  const lowThresh = parseFloat(params.lowThresh);
  let highThresh = parseFloat(params.highThresh);

  const chromosomeKey = params.chromosomeKey;
  const positionKey = params.positionKey;
  const pValueKey = params.pValueKey;

  const chromosomes = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "X",
    "Y",
  ];

  const chromosomeNtLength = {
    hg38: {
      1: 248956422,
      2: 242193529,
      3: 198295559,
      4: 190214555,
      5: 181538259,
      6: 170805979,
      7: 159345973,
      8: 145138636,
      9: 138394717,
      10: 133797422,
      11: 135086622,
      12: 133275309,
      13: 114364328,
      14: 107043718,
      15: 101991189,
      16: 90338345,
      17: 83257441,
      18: 80373285,
      19: 58617616,
      20: 64444167,
      21: 46709983,
      22: 50818468,
      X: 156040895,
      Y: 57227415,
    },
  };

  const chromosomeSumLength = {};
  Object.keys(chromosomeNtLength).forEach((ref) => {
    chromosomeSumLength[ref] = Object.keys(chromosomeNtLength[ref]).reduce(
      (acc, chr) => chromosomeNtLength[ref][chr] + acc,
      0
    );
  });

  const chromosomeArray = Object.values(chromosomeNtLength.hg38);
  const chromosomeStartPosition = {};
  let startPos = 0;
  for (let i = 0; i < chromosomeArray.length; i++) {
    const chr = chromosomes[i];
    if (chr === "1") {
      chromosomeStartPosition[chr] = 0;
    } else {
      startPos += chromosomeArray[i - 1];
      chromosomeStartPosition[chr] = startPos;
    }
  }

  const canvasDiv = select(chartElement)
    .append("div")
    .style("width", areaWidth + "px")
    .style("overflow", "hidden")
    .style("position", "absolute")
    .style("left", marginLeft + "px");
  const canvas = canvasDiv
    .append("canvas")
    .attr("width", areaWidth)
    .attr("height", areaHeight)
    .style("position", "relative");
  const svg = select(chartElement)
    .append("svg")
    .attr("width", width)
    .attr("height", height + 10);
  const axisGroup = svg.append("g").attr("id", "axis");
  const sliderShadowGroup = svg.append("g").attr("id", "slider_shadow");
  const xLabelGroup = svg.append("g").attr("id", "x_label");
  const yLabelGroup = svg.append("g").attr("id", "y_label");
  const yTitle = svg.append("g").attr("id", "y_title");
  const plotGroup = svg.append("g").attr("id", "plot_group");
  const threshlineGroup = svg.append("g").attr("id", "thresh_line");
  const tooltip = select(chartElement)
    .append("div")
    .attr("class", "tooltip");

  let horizonalRange = []; // [begin position, end position]
  let verticalRange = []; // [begin position, end position]
  let maxLogP = 0;
  let maxLogPInt;
  let total;

  const getRangeLength = function (targetRange) {
    return targetRange[1] - targetRange[0];
  };

  // axis line
  axisGroup
    .append("path")
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width + " Z")
    .attr("class", "axis-line");
  axisGroup
    .append("path")
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight + " Z")
    .attr("class", "axis-line");
  yTitle
    .append("text")
    .text("-log₁₀(p-value)")
    .attr("class", "axis-title")
    .attr("font-size", "14")
    .attr("x", -areaHeight / 2)
    .attr("y", marginLeft - 32)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle");

  // select range by drag
  let horizonalDragBegin = false;
  let verticalDragBegin = false;

  svg
    .on("mousedown", function (e) {
      if (pointer(e)[1] <= areaHeight) {
        horizonalDragBegin = pointer(e)[0];
        verticalDragBegin =
          pointer(e)[1] <= paddingTop ? paddingTop : pointer(e)[1];
        svg
          .append("rect")
          .attr("fill", "rgba(128, 128, 128, 0.2)")
          .attr("stroke", "#000000")
          .attr("x", horizonalDragBegin)
          .attr("y", verticalDragBegin)
          .attr("width", 0)
          .attr("height", 0)
          .attr("id", "selector");
      }
    })
    .on("mousemove", function (e) {
      if (horizonalDragBegin) {
        const horizonalDragEnd = pointer(e)[0];
        if (horizonalDragBegin < horizonalDragEnd) {
          svg
            .select("#selector")
            .attr("width", horizonalDragEnd - horizonalDragBegin);
        } else {
          svg
            .select("#selector")
            .attr("x", horizonalDragEnd)
            .attr("width", horizonalDragBegin - horizonalDragEnd);
        }
      }
      if (verticalDragBegin) {
        const verticalDragEnd =
          pointer(e)[1] > areaHeight ? areaHeight : pointer(e)[1];
        if (verticalDragBegin < verticalDragEnd) {
          svg
            .select("#selector")
            .attr("height", verticalDragEnd - verticalDragBegin);
        } else {
          svg
            .select("#selector")
            .attr("y", verticalDragEnd)
            .attr("height", verticalDragBegin - verticalDragEnd);
        }
      }
    })
    .on("mouseup", function (e) {
      const horizonalRangeLength = getRangeLength(horizonalRange);
      const verticalRangeLength = getRangeLength(verticalRange);
      if (horizonalDragBegin) {
        const horizonalDragEnd = pointer(e)[0];
        // re-render
        if (horizonalDragBegin > horizonalDragEnd) {
          horizonalRange = [
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
          ];
        } else if (horizonalDragEnd > horizonalDragBegin) {
          horizonalRange = [
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
          ];
        }
        svg.select("#selector").remove();
        reRender();
        horizonalDragBegin = false;
      }
      if (verticalDragBegin) {
        const verticalDragEnd =
          pointer(e)[1] > areaHeight ? areaHeight : pointer(e)[1];
        // re-render
        if (verticalDragBegin > verticalDragEnd) {
          const maxLog =
            verticalRange[1] -
            ((verticalDragEnd - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          const minLog =
            verticalRange[1] -
            ((verticalDragBegin - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          verticalRange = [minLog, maxLog];
        } else if (verticalDragEnd - verticalDragBegin > 0) {
          const maxLog =
            verticalRange[1] -
            ((verticalDragBegin - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          const minLog =
            verticalRange[1] -
            ((verticalDragEnd - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          verticalRange = [minLog, maxLog];
        }
        reRender();
        pagination(stanza.root, params, overThreshArray);
        svg.select("#selector").remove();
        horizonalDragBegin = false;
        verticalDragBegin = false;
      }
    });

  // slider
  const ctrlSvg = select(controlElement)
    .append("svg")
    .attr("id", "slider_container")
    .attr("width", width)
    .attr("height", 24);
  ctrlSvg
    .append("text")
    .text("chr:")
    .attr("class", "info-key")
    .attr("fill", "#99ACB2")
    .attr("x", 4)
    .attr("y", 16)
    .attr("width", 10)
    .attr("height", 23);
  ctrlSvg
    .append("rect")
    .attr("x", marginLeft)
    .attr("y", 1)
    .attr("width", areaWidth)
    .attr("height", 23)
    .attr("fill", "#FFFFFF")
    .attr("stroke", "#99ACB2")
    .attr("stroke-width", "1px");
  ctrlSvg
    .append("rect")
    .attr("id", "slider")
    .attr("x", marginLeft)
    .attr("y", 1)
    .attr("width", areaWidth)
    .attr("height", 22)
    .attr("fill", "var(--togostanza-slider-color)")
    .attr("stroke", "#99ACB2")
    .call(
      drag()
        .on("start", function (e) {
          horizonalDragBegin = e.x;
        })
        .on("drag", function (e) {
          if (horizonalDragBegin) {
            const slider = ctrlSvg.select("rect#slider");
            let delta = e.x - horizonalDragBegin;
            if (parseFloat(slider.attr("x")) + delta < marginLeft) {
              delta = (parseFloat(slider.attr("x")) - marginLeft) * -1;
            } else if (
              parseFloat(slider.attr("x")) +
                parseFloat(slider.attr("width")) +
                delta >
              width
            ) {
              delta =
                width -
                (parseFloat(slider.attr("x")) +
                  parseFloat(slider.attr("width")));
            }
            slider.attr("transform", "translate(" + delta + ", 0)");
            const move = (delta / areaWidth) * total;
            canvas
              .style(
                "left",
                ((horizonalRange[0] + move) / getRangeLength(horizonalRange)) *
                  areaWidth +
                  "px"
              )
              .style("display", "block");
            setRange([horizonalRange[0] + move, horizonalRange[1] + move]);
            plotGroup.html("");
            xLabelGroup.html("");
          }
        })
        .on("end", function (e) {
          if (horizonalDragBegin) {
            // re-render
            const slider = ctrlSvg.select("rect#slider");
            let delta = e.x - horizonalDragBegin;
            if (parseFloat(slider.attr("x")) + delta < marginLeft) {
              delta = (parseFloat(slider.attr("x")) - marginLeft) * -1;
            } else if (
              parseFloat(slider.attr("x")) +
                parseFloat(slider.attr("width")) +
                delta >
              width
            ) {
              delta =
                width -
                (parseFloat(slider.attr("x")) +
                  parseFloat(slider.attr("width")));
            }
            const move = (delta / areaWidth) * total;
            horizonalRange = [
              horizonalRange[0] + move,
              horizonalRange[1] + move,
            ];
            reRender();
            pagination(stanza.root, params, overThreshArray);
            horizonalDragBegin = false;
          }
        })
    );

  const sliderLabelGroup = ctrlSvg.append("g").attr("id", "sliderLabel");

  sliderLabelGroup
    .selectAll(".slider-label")
    .data(chromosomes)
    .enter()
    .append("text")
    .attr("class", "axis-label slider-label")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d) {
      let pos = chromosomeNtLength.hg38[d] / 2;
      for (const ch of chromosomes) {
        if (ch === d) {
          break;
        }
        pos += chromosomeNtLength.hg38[ch];
      }
      return (pos / chromosomeSumLength.hg38) * areaWidth + marginLeft;
    })
    .attr("y", 18)
    .attr("font-size", "12")
    .attr("fill", "#2F4D76");

  sliderLabelGroup
    .selectAll(".slider-ine")
    .data(chromosomes)
    .enter()
    .append("path")
    .attr("class", "slider-line")
    .attr("d", function (d) {
      let pos = chromosomeNtLength.hg38[d];
      for (const ch of chromosomes) {
        if (ch === d) {
          break;
        }
        pos += chromosomeNtLength.hg38[ch];
      }
      const sliderLinePos =
        (pos / chromosomeSumLength.hg38) * areaWidth + marginLeft;
      return "M " + sliderLinePos + ", " + 2 + " V " + 24 + " Z";
    });

  // button
  const ctrlBtn = select(controlElement)
    .append("div")
    .attr("id", "ctrl_button");
  ctrlBtn
    .append("span")
    .attr("class", "info-key")
    .text("Position:  ")
    .append("span")
    .attr("class", "range-text")
    .attr("id", "range_text");
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "-")
    .on("click", function () {
      const horizonalRangeLength = getRangeLength(horizonalRange);
      let begin = horizonalRange[0] - horizonalRangeLength / 2;
      let end = horizonalRange[1] + horizonalRangeLength / 2;
      if (begin < 0) {
        begin = 0;
        end = horizonalRangeLength * 2;
        if (end > total) {
          end = total;
        }
      } else if (end > total) {
        end = total;
        begin = total - horizonalRangeLength * 2;
      }
      horizonalRange = [begin, end];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "+")
    .on("click", function () {
      const horizonalRangeLength = getRangeLength(horizonalRange);
      const begin = horizonalRange[0] + horizonalRangeLength / 4;
      const end = horizonalRange[1] - horizonalRangeLength / 4;
      horizonalRange = [begin, end];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "reset")
    .on("click", function () {
      horizonalRange = [];
      verticalRange = [];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("label")
    .attr("class", "info-key -threshold")
    .text("Threshold:  ")
    .append("input")
    .attr("class", "threshold-input")
    .attr("id", "threshold")
    .attr("type", "text")
    .attr("value", "8");

  const threshold = stanza.root.querySelector("#threshold");
  threshold.addEventListener("input", function () {
    highThresh = parseFloat(threshold.value);
    reRender();
    pagination(stanza.root, params, overThreshArray);
  });

  reRender();

  //listen stage checkbox event
  const stageBtn = stanza.root.querySelectorAll(".stage-btn");

  for (let i = 0; i < stageBtn.length; i++) {
    stageBtn[i].addEventListener("change", (e) => {
      const stageName = e.path[0].getAttribute("data-stage");
      stageData[stageName].checked = stageBtn[i].checked;
      variants = getVariants();
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  }

  function reRender() {
    if (horizonalRange[0] === undefined) {
      horizonalRange = [
        0,
        Object.values(chromosomeNtLength.hg38).reduce(
          (sum, value) => sum + value
        ),
      ];
      total = horizonalRange[1];
    }

    overThreshArray = [];
    const pValueArray = variants.map(
      (variant) => Math.log10(parseFloat(variant["p-value"])) * -1
    );

    maxLogP = Math.max(...pValueArray);
    if (maxLogPInt === undefined) {
      maxLogPInt = Math.floor(maxLogP);
    }

    if (verticalRange[0] === undefined) {
      verticalRange = [lowThresh, maxLogPInt];
    }

    xLabelGroup.html("");
    yLabelGroup.html("");
    plotGroup.html("");

    plotGroup
      .selectAll(".plot")
      .data(variants)
      .enter()
      // filter: displayed range
      .filter(function (d) {
        if (!d.pos) {
          // calculate  accumulated position
          let pos = 0;
          for (const ch of chromosomes) {
            if (ch === d[chromosomeKey]) {
              break;
            }
            pos += chromosomeNtLength.hg38[ch];
          }
          d.pos = pos + parseInt(d[positionKey]);
        }
        const logValue = Math.log10(parseFloat(d[pValueKey])) * -1;
        return (
          horizonalRange[0] <= d.pos &&
          d.pos <= horizonalRange[1] &&
          verticalRange[0] <= logValue &&
          logValue <= verticalRange[1]
        );
      })
      .filter(function (d) {
        return Math.log10(parseFloat(d[pValueKey])) * -1 > lowThresh;
      })
      .append("circle")
      .attr("fill", function (d) {
        const stage = d["stage"].replace(/\s/, "-");
        return `var(--togostanza-${stage}-color)`;
      })
      .attr("cx", function (d) {
        return (
          ((d.pos - horizonalRange[0]) / getRangeLength(horizonalRange)) *
            areaWidth +
          marginLeft
        );
      })
      .attr("cy", function (d) {
        const logValue = Math.log10(parseFloat(d[pValueKey])) * -1;
        return (
          ((verticalRange[1] - logValue) / getRangeLength(verticalRange)) *
            drawAreaHeight +
          paddingTop
        );
      })
      .attr("r", 2)
      // filter: high p-value
      .filter(function (d) {
        if (Math.log10(parseFloat(d[pValueKey])) * -1 > highThresh) {
          overThreshArray.push(d);
        }
        return Math.log10(parseFloat(d[pValueKey])) * -1 > highThresh;
      })
      .classed("over-thresh-plot", true)
      .on("mouseover", function (e, d) {
        tooltip
          .style("display", "block")
          .style("left", `${pointer(e)[0] + 8}px`)
          .style(
            "top",
            `${pointer(e)[1]}px`
          ).html(`<p class="tooltip-chr">chr${d.chr}:${d.start}</p>
                <ul class="tooltip-info">
                  <li><span class="tooltip-key">rsId:&nbsp;</span>${d.rsId}</li>
                  <li><span class="tooltip-key">Gene name:&nbsp;</span>${d.gene_name}</li>
                  <li><span class="tooltip-key">Ref/Alt:&nbsp;</span>${d.ref}/${d.alt}</li>
                  <li><span class="tooltip-key">P-value:&nbsp;</span>${d["p-value"]}</li>
                </ul>`);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });
    renderCanvas(variants);

    // x axis label
    xLabelGroup
      .selectAll(".x-label")
      .data(chromosomes)
      .enter()
      .append("text")
      .attr("class", "axis-label x-label")
      .text(function (d) {
        return d;
      })
      .attr("x", function (d) {
        let pos = chromosomeNtLength.hg38[d] / 2;
        for (const ch of chromosomes) {
          if (ch === d) {
            break;
          }
          pos += chromosomeNtLength.hg38[ch];
        }
        return (
          ((pos - horizonalRange[0]) / getRangeLength(horizonalRange)) *
            areaWidth +
          marginLeft
        );
      })
      .attr("font-size", "12")
      .attr("y", areaHeight + 20);

    // chart background
    xLabelGroup
      .selectAll(".x-background")
      .data(chromosomes)
      .enter()
      .append("rect")
      .attr("class", "axis-label x-background")
      .attr("x", function (d) {
        if (
          chromosomeStartPosition[d] < horizonalRange[0] &&
          horizonalRange[0] < chromosomeStartPosition[d + 1]
        ) {
          return (
            ((chromosomeStartPosition[d] - horizonalRange[0]) /
              getRangeLength(horizonalRange)) *
              areaWidth +
            marginLeft
          );
        } else {
          return (
            ((chromosomeStartPosition[d] - horizonalRange[0]) /
              getRangeLength(horizonalRange)) *
              areaWidth +
            marginLeft
          );
        }
      })
      .attr("y", paddingTop)
      .attr("width", function (d) {
        return (
          (chromosomeNtLength.hg38[d] / getRangeLength(horizonalRange)) *
          areaWidth
        );
      })
      .attr("opacity", "0.4")
      .attr("height", drawAreaHeight)
      .attr("fill", function (d) {
        if (d % 2 === 0 || d === "Y") {
          return "#EEEEEE";
        } else if (d % 2 !== 0 || d === "X") {
          return "#FFFFFF";
        }
      });

    // y axis label
    yLabelGroup
      .append("rect")
      .attr("fill", "#FFFFFF")
      .attr("width", marginLeft - 1)
      .attr("height", areaHeight);

    const overThreshLine = stanza.root.querySelectorAll(".overthresh-line");
    for (
      let i = Math.floor(verticalRange[0]) + 1;
      i <= Math.ceil(verticalRange[1]);
      i++
    ) {
      const y =
        areaHeight -
        ((i - verticalRange[0]) / getRangeLength(verticalRange)) *
          drawAreaHeight;
      //Calucurate display of scale
      const tickNum = 20; //Tick number to display (set by manual)
      const tickInterval = Math.floor(getRangeLength(verticalRange) / tickNum);
      if (getRangeLength(verticalRange) < tickNum) {
        yLabelGroup
          .append("text")
          .text(i)
          .attr("class", "axis-label y-label")
          .attr("font-size", "12")
          .attr("x", marginLeft - 12)
          .attr("y", y)
          .attr("text-anchor", "end");
        yLabelGroup
          .append("path")
          .attr("class", "axis-line")
          .attr(
            "d",
            "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
          );
      } else if (getRangeLength(verticalRange) >= tickNum) {
        if (i % tickInterval === 0) {
          yLabelGroup
            .append("text")
            .text(i)
            .attr("class", "axis-label y-label")
            .attr("x", marginLeft - 12)
            .attr("y", y)
            .attr("text-anchor", "end");
          yLabelGroup
            .append("path")
            .attr("class", "axis-line")
            .attr(
              "d",
              "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
            );
        }
      }
      if (i === highThresh) {
        threshlineGroup
          .append("path")
          .attr("d", "M " + marginLeft + ", " + y + " H " + width + " Z")
          .attr("class", "overthresh-line");
      }
    }
    for (let i = 0; i < overThreshLine.length; i++) {
      overThreshLine[i].remove();
    }

    // y zero (lowThresh)
    yLabelGroup
      .append("text")
      .text(Math.floor(verticalRange[0]))
      .attr("class", "axis-label y-label")
      .attr("x", marginLeft - 12)
      .attr("y", areaHeight)
      .attr("text-anchor", "end");
    yLabelGroup
      .append("path")
      .attr("class", "axis-line")
      .attr(
        "d",
        "M " + (marginLeft - 8) + ", " + areaHeight + " H " + marginLeft + " Z"
      );

    // slider
    ctrlSvg
      .select("rect#slider")
      .attr("x", marginLeft + (horizonalRange[0] / total) * areaWidth)
      .attr("width", (getRangeLength(horizonalRange) / total) * areaWidth)
      .attr("transform", "translate(0, 0)");

    const totalOverThreshVariants = stanza.root.querySelector(
      "#totalOverThreshVariants"
    );
    totalOverThreshVariants.innerText = overThreshArray.length;
    setRange(horizonalRange);

    //slider shadow (Show only when chart is zoomed)
    const sliderShadow = stanza.root.querySelectorAll(".slider-shadow");
    for (let i = 0; i < sliderShadow.length; i++) {
      sliderShadow[i].remove();
    }

    if (
      horizonalRange[0] !== 0 &&
      horizonalRange[1] !== chromosomeSumLength.hg38
    ) {
      sliderShadowGroup
        .append("path")
        .attr("class", "slider-shadow")
        .attr("fill", "var(--togostanza-slider-color)")
        .attr("opacity", "0.4")
        .attr(
          "d",
          `
          M ${marginLeft} ${areaHeight}
          L ${width} ${areaHeight}
          L ${
            (horizonalRange[1] / chromosomeSumLength.hg38) * areaWidth +
            marginLeft
          } ${height + 10}
          L ${
            (horizonalRange[0] / chromosomeSumLength.hg38) * areaWidth +
            marginLeft
          } ${height + 10}
          z
        `
        );
    }
  }

  function renderCanvas(variants) {
    const horizonalRangeLength = getRangeLength(horizonalRange);
    if (canvas.node().getContext) {
      canvas.attr("width", (total / horizonalRangeLength) * areaWidth);
      canvas.attr("height", (total / horizonalRangeLength) * areaHeight);
      const ctx = canvas.node().getContext("2d");
      ctx.clearRect(0, 0, areaWidth, areaHeight);

      for (const d of variants) {
        const stage = d["stage"].replace(/\s/, "-").toLowerCase();
        ctx.beginPath();
        ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
          `--togostanza-${stage}-color`
        );
        ctx.arc(
          (d.pos / horizonalRangeLength) * areaWidth,
          areaHeight -
            ((Math.log10(parseFloat(d[pValueKey])) * -1 - lowThresh) *
              areaHeight) /
              maxLogPInt,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      canvas.style(
        "left",
        (horizonalRange[0] / horizonalRangeLength) * areaWidth + "px"
      );
    }
    canvas.style("display", "none");
  }

  function setRange(horizonalRange) {
    let start = 0;
    let text = "";
    for (const ch of chromosomes) {
      if (start + chromosomeNtLength.hg38[ch] >= horizonalRange[0] && !text) {
        text += " chr" + ch + ":" + Math.floor(horizonalRange[0]);
      }
      if (start + chromosomeNtLength.hg38[ch] >= horizonalRange[1]) {
        text += " - chr" + ch + ":" + Math.floor(horizonalRange[1] - start);
        break;
      }
      start += chromosomeNtLength.hg38[ch];
    }
    ctrlBtn.select("#range_text").html(text);
  }

  pagination(stanza.root, params, overThreshArray);
}

var stanzaModule = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': manhattanPlot
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "manhattan-plot",
	"stanza:label": "Manhattan plot",
	"stanza:definition": "Manhattan plot MetaStanza (for GWAS)",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-01-13",
	"stanza:updated": "2021-01-13",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "",
		"stanza:description": "Data source URL (json)",
		"stanza:required": true
	},
	{
		"stanza:key": "chromosomeKey",
		"stanza:example": "chr",
		"stanza:description": "Key to a chromosome in data frame'",
		"stanza:required": false
	},
	{
		"stanza:key": "positionKey",
		"stanza:example": "stop",
		"stanza:description": "Key to a position on chromosome in data frame",
		"stanza:required": false
	},
	{
		"stanza:key": "pValueKey",
		"stanza:example": "p-value",
		"stanza:description": "Key to a p-value in data frame",
		"stanza:required": false
	},
	{
		"stanza:key": "lowThresh",
		"stanza:example": "4",
		"stanza:description": "Filtering threshold (=log10(p-value))",
		"stanza:required": false
	},
	{
		"stanza:key": "highThresh",
		"stanza:example": "8",
		"stanza:description": "Highlight threshold",
		"stanza:required": false
	},
	{
		"stanza:key": "recordsPerPage",
		"stanza:example": "20",
		"stanza:description": "Records per a page to display on table",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Arial",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-discovery-color",
		"stanza:type": "color",
		"stanza:default": "#3D6589",
		"stanza:description": "Plot color of discovery stage"
	},
	{
		"stanza:key": "--togostanza-replication-color",
		"stanza:type": "color",
		"stanza:default": "#ED707E",
		"stanza:description": "Plot color of replication stage"
	},
	{
		"stanza:key": "--togostanza-combined-color",
		"stanza:type": "color",
		"stanza:default": "#EAB64E",
		"stanza:description": "Plot color of combined stage"
	},
	{
		"stanza:key": "--togostanza-meta-analysis-color",
		"stanza:type": "color",
		"stanza:default": "#52B1C1",
		"stanza:description": "Plot color of meta-analysis stage"
	},
	{
		"stanza:key": "--togostanza-not-provided-color",
		"stanza:type": "color",
		"stanza:default": "#62B28C",
		"stanza:description": "Plot color of not-provided stage"
	},
	{
		"stanza:key": "--togostanza-slider-color",
		"stanza:type": "color",
		"stanza:default": "#C2E3F2",
		"stanza:description": "Slider color"
	},
	{
		"stanza:key": "--togostanza-thead-font-size",
		"stanza:type": "text",
		"stanza:default": "14px",
		"stanza:description": "Font size of table header"
	},
	{
		"stanza:key": "--togostanza-tbody-font-size",
		"stanza:type": "text",
		"stanza:default": "14px",
		"stanza:description": "Font size of table body"
	},
	{
		"stanza:key": "--togostanza-thead-font-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "Font color of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-weight",
		"stanza:type": "text",
		"stanza:default": "600",
		"stanza:description": "Font weight of table header"
	},
	{
		"stanza:key": "--togostanza-thead-background-color",
		"stanza:type": "color",
		"stanza:default": "#C2E3F2",
		"stanza:description": "Background color of table header"
	},
	{
		"stanza:key": "--togostanza-tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "#F2F5F7",
		"stanza:description": "Background color of table body (even row)"
	},
	{
		"stanza:key": "--togostanza-tbody-odd-background-color",
		"stanza:type": "color",
		"stanza:default": "#E6EBEF",
		"stanza:description": "Background color of table body (odd row)"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1 id=\"manhattan-title\">\n  GWAS Study View\n</h1>\n\n<section class=\"info-section\">\n  <dl class=\"datainfo-list\">\n    <dt id=\"study-name\" class=\"info-key\">\n      study name:\n    </dt>\n    <dd>\n      "
    + alias4(((helper = (helper = lookupProperty(helpers,"studyName") || (depth0 != null ? lookupProperty(depth0,"studyName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"studyName","hash":{},"data":data,"loc":{"start":{"line":11,"column":6},"end":{"line":11,"column":19}}}) : helper)))
    + "\n    </dd>\n    <dt id=\"project-name\" class=\"info-key\">\n      project name:\n    </dt>\n    <dd>\n      "
    + alias4(((helper = (helper = lookupProperty(helpers,"projectName") || (depth0 != null ? lookupProperty(depth0,"projectName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"projectName","hash":{},"data":data,"loc":{"start":{"line":17,"column":6},"end":{"line":17,"column":21}}}) : helper)))
    + "\n    </dd>\n  </dl>\n</section>\n\n<hr />\n\n<section class=\"chart-section\">\n  <h2>\n    Manhattan Plot\n  </h2>\n  <table>\n    <tbody>\n      <tr id=\"stageList\">\n        <td class=\"info-key\">\n          Stages:\n        </td>\n      </tr>\n      <tr id=\"firstConditionList\">\n        <td class=\"info-key\">\n          Condition1:\n        </td>\n      </tr>\n      <tr id=\"secondConditionList\">\n        <td class=\"info-key\">\n          Condition2:\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <div id=\"chart\"></div>\n  <div id=\"control\"></div>\n</section>\n\n<hr />\n\n<section class=\"table-section\">\n  <div class=\"table-info\">\n    <div class=\"table-title\">\n      <h2>\n        Top Loci\n      </h2>\n      <p>\n        Only variants with are greater than or equal to the threshold are displayed.\n      </p>\n    </div>\n    <dl class=\"total-overthresh-variants\">\n      <dt class=\"info-key\">\n        Total Variants:\n      </dt>\n      <dd id=\"totalOverThreshVariants\" class=\"info-value\"></dd>\n    </dl>\n  </div>\n  <div class=\"pagination\">\n    <table>\n      <thead id=\"listingTableHead\">\n        <tr>\n          <th>\n            Gene name\n          </th>\n          <th>\n            rsId\n          </th>\n          <th>\n            Chromosome\n          </th>\n          <th>\n            position\n          </th>\n          <th>\n            Ref\n          </th>\n          <th>\n            Alt\n          </th>\n          <th>\n            P-value\n          </th>\n        </tr>\n      </thead>\n      <tbody id=\"listingTable\">\n      </tbody>\n    </table>\n    <div class=\"pagination-block\">\n      <span class=\"page-btn\" id=\"firstBtn\">\n        &lt;&lt;\n      </span>\n      <span class=\"page-btn\" id=\"prevBtn\">\n        &lt;\n      </span>\n      <span class=\"page-number\" id=\"pageNumber\"></span>\n      <span class=\"page-btn\" id=\"nextBtn\">\n        &gt;\n      </span>\n      <span class=\"page-btn\" id=\"lastBtn\">\n        &gt;&gt;\n      </span>\n    </div>\n  </div>\n</section>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=manhattan-plot.js.map
