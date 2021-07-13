"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TobiiAwareElement = void 0;
var vue_1 = __importDefault(require("vue"));
var TobiiEvents_1 = require("./TobiiEvents");
var TobiiAwareElement = /** @class */ (function (_super) {
    __extends(TobiiAwareElement, _super);
    function TobiiAwareElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tobii = {
            enterTime: 0,
            exitTime: 0,
            inside: false,
        };
        return _this;
    }
    TobiiAwareElement.prototype.created = function () {
        var _this = this;
        document.addEventListener(TobiiEvents_1.TOBIIEVENTS["tobii.point"], function (e) {
            var detail = e.detail;
            _this.$emit(TobiiEvents_1.TOBIIEVENTS["tobii.point"], detail);
            var x = detail.x, y = detail.y, ts = detail.ts;
            if (_this.$el == null || _this.$el.getBoundingClientRect == null) {
                return;
            }
            var rect = _this.$el.getBoundingClientRect();
            var oldInside = _this.tobii.inside;
            var inside = x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
            if (!oldInside && inside) {
                _this.tobii.enterTime = ts;
                _this.$emit(TobiiEvents_1.TOBIIEVENTS["tobii.enter"], ts);
            }
            else if (oldInside && inside) {
                _this.$emit(TobiiEvents_1.TOBIIEVENTS["tobii.stay"], ts - _this.tobii.enterTime);
            }
            else if (oldInside && !inside) {
                _this.tobii.exitTime = ts;
                _this.$emit(TobiiEvents_1.TOBIIEVENTS["tobii.out"], ts);
            }
            else {
                if (_this.tobii.exitTime != null && ts - _this.tobii.exitTime > 100) {
                    _this.tobii.exitTime = null;
                    _this.$emit(TobiiEvents_1.TOBIIEVENTS["tobii.longout"], ts);
                }
            }
            _this.tobii.inside = inside;
        });
    };
    return TobiiAwareElement;
}(vue_1.default));
exports.TobiiAwareElement = TobiiAwareElement;
//# sourceMappingURL=TobiiMixin.js.map