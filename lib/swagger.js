const { koaSwagger } = require('koa2-swagger-ui');
const statuses = require('statuses');

const DEFAULT_RESPONSES = [200];

function Swagger({
  router,
  uiConfig = {}
}) {
  const paths = MapAllMethods(router);
  if (!uiConfig.swaggerOptions) {
    uiConfig.swaggerOptions = {};
  }
  if (!uiConfig.swaggerOptions.spec) {
    uiConfig.swaggerOptions.spec = {};
  }
  uiConfig.swaggerOptions.spec.paths = paths;
  return koaSwagger(uiConfig);
}

const allowedMethods = [
  'GET',
  'PUT',
  'PATCH',
  'POST',
  'DELETE'
];

function MapAllMethods(router) {
  const paths = {};
  router.stack.forEach((stack) => {
    const path = stack.path;
    let method = stack.methods.find((m) => allowedMethods.includes(m));
    if (!method) {
      return;
    }
    method = method.toLowerCase();
    if (!paths[path]) {
      paths[path] = {};
    }
    paths[path][method] = GeneratePathOptions(method, stack);
  })
  return paths;
}

function FindSchemaInStack(stack) {
  if (stack.IsValidatorMiddleware && stack.ObjectSchema) {
    return stack.ObjectSchema;
  }
  if (stack.stack) {
    for (const stackItem of stack.stack) {
      return FindSchemaInStack(stackItem);
    }
  }
}

function GeneratePathOptions(method, stack) {
  const options = {
    parameters: [],
    responses: DEFAULT_RESPONSES.reduce((map, code) => {
      map[code] = {
        description: statuses(code)
      };
      return map;
    }, {})
  };
  if (stack.opts.prefix) {
    options.tags = [stack.opts.prefix];
  }
  const schema = FindSchemaInStack(stack);
  FillParameters(options.parameters, schema);
  return options;
}

function FillParameters(parameters, schema) {
  if (schema) {
    if (schema.body) {
      _FillParams(parameters, schema.body, 'formData');
    }
    if (schema.query) {
      _FillParams(parameters, schema.query, 'query');
    }
    if (schema.params) {
      _FillParams(parameters, schema.params, 'path');
    }
  }
}

function _FillParams(parameters, object, type) {
  for (const key in object) {
    parameters.push({
      in: type,
      name: key
    });
  }
}

module.exports = Swagger;