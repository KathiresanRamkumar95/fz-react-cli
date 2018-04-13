"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getInsertIntoFunction = function getInsertIntoFunction(styleTarget) {
    return (
        // eslint-disable-next-line no-eval
        eval("function insertIntoFunction (){\n\t\tvar styleTarget = " + JSON.stringify(styleTarget) + ";\n        if (styleTarget !== 'false') {\n            var element = document.getElementById(styleTarget);\n            return element ? element.shadowRoot\n                ? element.shadowRoot\n                : element : document.head;\n        }\n        return document.head;\n    }")
    );
};

exports.default = getInsertIntoFunction;