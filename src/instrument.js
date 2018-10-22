let esprima = require('esprima');
let escodegen = require('escodegen');
let start = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'MemberExpression',
          computed: false,
          object: {
            type: 'Identifier',
            name: 'window'
          },
          property: {
            type: 'Identifier',
            name: 'ClientCoverage'
          }
        },
        property: {
          type: 'Identifier',
          name: 'JS'
        }
      },
      property: {
        type: 'Identifier',
        name: 'visitMethod'
      }
    },
    arguments: [
      {
        type: 'Literal',
        value: 'filename',
        raw: "'filename'"
      },
      {
        type: 'Literal',
        value: 'functionName',
        raw: "'functionName'"
      }
    ]
  }
};

function instrument(source) {
  let parsed = esprima.parseModule(source, { jsx: true });
  for (let i in parsed.body) {
    if (
      parsed.body[i].type === 'FunctionDeclaration' ||
      parsed.body[i].type === 'ExportDefaultDeclaration' ||
      parsed.body[i].type === 'ExportNamedDeclaration'
    ) {
      if (parsed.body[i].type === 'FunctionDeclaration') {
        var ParsedTemp = parsed.body[i];
      } else {
        var ParsedTemp = parsed.body[i].declaration;
      }
      if (ParsedTemp) {
        if (ParsedTemp.id) {
          let funcname = ParsedTemp.id.name;
          if (funcname !== 'mapStateToProps') {
            if (!funcname.includes('_')) {
              let startFunc = JSON.parse(JSON.stringify(start));
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

  return escodegen.generate(parsed);
}

module.exports = instrument;
