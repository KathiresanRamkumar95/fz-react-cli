export default function() {
  return {
    visitor: {
      Program(path, state) {
        const properties = state.opts.properties || [];
        if (properties.length === 0) {
          properties.push('data-testid');
        }
        path.traverse({
          JSXIdentifier(path2) {
            if (properties.indexOf(path2.node.name.toLowerCase()) > -1) {
              path2.parentPath.remove();
            }
          }
        });
      }
    }
  };
}
