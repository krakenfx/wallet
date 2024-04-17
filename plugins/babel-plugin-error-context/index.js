const path_ = require('path');

module.exports = function () {
  return {
    visitor: {
      StringLiteral(path, state) {
        if (path.node.value === 'ERROR_CONTEXT_PLACEHOLDER') {
          const relativePath = path_.relative(state.file.opts.root, state.file.opts.filename);
          path.node.value = `${relativePath}:${path.node.loc.start.line}`;
        }
      }
    }
  };
};