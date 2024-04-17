module.exports = {
  rules: {
    "pascalcase": {
      create: function (context) {
        return {
          JSXAttribute: function (node) {
            if (node.name.name === "testID") {
              const attributeValue = node.value;
              if (attributeValue && (attributeValue.type === "Literal" || attributeValue.type === "JSXExpressionContainer")) {
                if (attributeValue.type === "Literal") {
                  const value = attributeValue.value;
                  if (typeof value === "string") {
                    const isPascalCase =/^[A-Z][a-zA-Z]*$/.test(value);
                    if (!isPascalCase) {
                      context.report({
                        node: node,
                        message: "testID attribute should be in PascalCase",
                      });
                    }
                  }
                } else if (attributeValue.expression && attributeValue.expression.type === "TemplateLiteral") {
                  const quasis = attributeValue.expression.quasis;
                  const value = quasis.map(quasi => quasi.value.raw).join("");
                  if (typeof value === "string") {
                    const isPascalCaseWithTrailingDash = /^[A-Z][a-zA-Z]*-$/.test(value);
                    if (!isPascalCaseWithTrailingDash) {
                      context.report({
                        node: node,
                        message: "testID attribute in template expression should start in PascalCase and finish with -${expression}",
                      });
                    }
                  }
                }
              }                
            }
          },
        };
      },
    },
  },
};
