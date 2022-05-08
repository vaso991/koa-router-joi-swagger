const { koaSwagger } = require('koa2-swagger-ui');
const statuses = require('statuses');

const DEFAULT_RESPONSES = [200, 400];

const ALLOWED_PARAM_TYPES = [
  'string',
  'number',
  'integer',
  'boolean',
  'array',
  'object'
];

const ALLOWED_METHODS = [
  'GET',
  'PUT',
  'PATCH',
  'POST',
  'DELETE'
];

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
  uiConfig.swaggerOptions.spec.swagger = "2.0";
  uiConfig.swaggerOptions.spec.paths = paths;
  return koaSwagger(uiConfig);
}


function MapAllMethods(router) {
  const paths = {};
  router.stack.forEach((stack) => {
    let path = stack.path;
    let method = stack.methods.find((m) => ALLOWED_METHODS.includes(m));
    if (!method) {
      return;
    }
    method = method.toLowerCase();
    const pathSpecs = GeneratePathParameters(method, stack);
    path = CheckPathForParams(path, pathSpecs);
    if (!paths[path]) {
      paths[path] = {};
    }
    paths[path][method] = pathSpecs;
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

function GeneratePathParameters(method, stack) {
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
    const schema = object[key];
    const required = schema._flags?.presence === 'required';
    parameters.push({
      in: type,
      name: key,
      type: ALLOWED_PARAM_TYPES.includes(schema.type) ? schema.type : null,
      required
    });
  }
}

function CheckPathForParams(path, pathSpecs) {
  pathSpecs.parameters.forEach((param) => {
    if (param.in === 'path') {
      path = path.replace(`:${param.name}`, `{${param.name}}`);
    }
  })
  return path;
}

module.exports = Swagger;