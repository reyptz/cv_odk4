/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
(function () {
  var _window$blockartUtils = window.blockartUtils,
    $$ = _window$blockartUtils.$$,
    domReady = _window$blockartUtils.domReady;
  domReady(function () {
    var faqBlocks = $$('.blockart-faq');
    if (faqBlocks) {
      var _iterator = _createForOfIteratorHelper(faqBlocks),
        _step;
      try {
        var _loop = function _loop() {
          var faqBlock = _step.value;
          var expandFirst = faqBlock.classList.contains('expand-first-child');
          var collapseOthers = faqBlock.classList.contains('collapse-others');
          if (expandFirst) {
            var _faqBlock$querySelect;
            (_faqBlock$querySelect = faqBlock.querySelector('.blockart-control')) === null || _faqBlock$querySelect === void 0 || _faqBlock$querySelect.classList.add('is-expanded');
          }
          var faqHeaders = faqBlock.querySelectorAll('.blockart-faq-title-wrapper');
          var _iterator2 = _createForOfIteratorHelper(faqHeaders),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var faqHeader = _step2.value;
              faqHeader.addEventListener('click', function (e) {
                var $header = e.target;
                var faqItem = $header === null || $header === void 0 ? void 0 : $header.closest('.blockart-control');
                if (collapseOthers && !(faqItem !== null && faqItem !== void 0 && faqItem.classList.contains('is-expanded'))) {
                  var _iterator3 = _createForOfIteratorHelper(faqBlock.querySelectorAll('.blockart-control')),
                    _step3;
                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      var item = _step3.value;
                      item.classList.remove('is-expanded');
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }
                }
                faqItem === null || faqItem === void 0 || faqItem.classList.toggle('is-expanded');
              });
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  });
})();
/******/ })()
;