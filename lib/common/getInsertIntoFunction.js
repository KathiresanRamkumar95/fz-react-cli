"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getInsertIntoFunction = function getInsertIntoFunction(styleTarget) {
    return eval("(styleTarget = " + JSON.stringify(styleTarget) + ")=>{\n        if (styleTarget !== 'false') {\n            let element = document.getElementById(styleTarget);\n            return element ? element.shadowRoot\n                ? element.shadowRoot\n                : element : document.head;\n        }\n        return document.head;\n    }");
};

exports.default = getInsertIntoFunction;