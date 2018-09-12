'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');
var start = {
  'type': 'ExpressionStatement',
  'expression': {
    'type': 'CallExpression',
    'callee': {
      'type': 'MemberExpression',
      'computed': false,
      'object': {
        'type': 'MemberExpression',
        'computed': false,
        'object': {
          'type': 'MemberExpression',
          'computed': false,
          'object': {
            'type': 'Identifier',
            'name': 'window'
          },
          'property': {
            'type': 'Identifier',
            'name': 'ClientCoverage'
          }
        },
        'property': {
          'type': 'Identifier',
          'name': 'JS'
        }
      },
      'property': {
        'type': 'Identifier',
        'name': 'visitMethod'
      }
    },
    'arguments': [{
      'type': 'Literal',
      'value': 'filename',
      'raw': '\'filename\''
    }, {
      'type': 'Literal',
      'value': 'functionName',
      'raw': '\'functionName\''
    }]
  }
};

function instrument(source) {
  var parsed = esprima.parseModule(source, { jsx: true });
  for (var i in parsed.body) {
    if (parsed.body[i].type === 'FunctionDeclaration' || parsed.body[i].type === 'ExportDefaultDeclaration' || parsed.body[i].type === 'ExportNamedDeclaration') {
      if (parsed.body[i].type === 'FunctionDeclaration') {
        var ParsedTemp = parsed.body[i];
      } else {
        var ParsedTemp = parsed.body[i].declaration;
      }
      if (ParsedTemp) {
        if (ParsedTemp.id) {
          var funcname = ParsedTemp.id.name;
          if (funcname !== 'mapStateToProps') {
            if (!funcname.includes('_')) {
              var startFunc = JSON.parse(JSON.stringify(start));
              startFunc.expression.arguments[0].value = this.resourcePath;
              startFunc.expression.arguments[0].raw = this.resourcePath;
              startFunc.expression.arguments[1].value = funcname;
              startFunc.expression.arguments[1].raw = funcname;
              ParsedTemp.body.body.unshift(startFunc);
            }
          }
        }
      }
    }
  }

  var newCode = escodegen.generate(parsed);
  // function removeDuplicates(arr) {
  //   let uniqueArray = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     if (uniqueArray.indexOf(arr[i]) == -1) {
  //       uniqueArray.push(arr[i]);
  //     }
  //   }
  //   return uniqueArray;
  // }
  // funcArray = removeDuplicates(funcArray);
  return newCode;
}

module.exports = instrument;

// let start = {
//   type: 'ExpressionStatement',
//   expression: {
//     type: 'CallExpression',
//     callee: {
//       type: 'Identifier',
//       name: 'getMethodName'
//     },
//     arguments: [
//       {
//         type: 'Literal',
//         value: 'filename',
//         raw: '"filename"'
//       },
//       {
//         type: 'Literal',
//         value: 'functionname',
//         raw: '"functionname"'
//       }
//     ]
//   }
// };