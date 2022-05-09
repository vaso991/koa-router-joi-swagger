import Router from 'koa-router';
import { koaSwagger, KoaSwaggerUiOptions } from 'koa2-swagger-ui';
import statuses from 'statuses';
import { InputSChema } from './validator';

const DEFAULT_RESPONSES = [200, 400];

const ALLOWED_PARAM_TYPES = ['string', 'number', 'integer', 'boolean', 'array', 'object'];

const ALLOWED_METHODS = ['get', 'put', 'patch', 'post', 'delete'];

type InputParams = {
  router: Router;
  uiConfig: KoaSwaggerUiOptions;
};

type PathParametersResponse = {
  parameters: [],
  responses: {},
  tags?: [string]
}

function Swagger(input: InputParams) {
  const paths = MapAllMethods(input.router);
  return CreateKoaSwagger(paths, input);
};

function MapAllMethods(router: Router) {
  const paths = {};
  router.stack.forEach((stack: Router.Layer) => {
    let { path } = stack;
    let method = stack.methods.find((method) => ALLOWED_METHODS.includes(method.toLowerCase()))?.toLowerCase();
    if (!method) {
      return;
    }
    const specs = GeneratePathParameters(method, stack);
    
    path = FormatPath(path, specs);
    if (!paths[path]) {
      paths[path] = {};
    }
    paths[path][method] = specs;
  });
  return paths;
}

function GeneratePathParameters(method: string, stack: Router.Layer): PathParametersResponse {
  const options: PathParametersResponse = {
    parameters: [],
    responses: DEFAULT_RESPONSES.reduce((map, code) => {
      map[code] = { description: statuses(code) };
      return map;
    }, {})
  };
  if (stack.opts?.prefix) {
    options.tags = [stack.opts.prefix]
  }
  const schema = FindSchemaInStack(stack);
  FillSchmeParameters(options.parameters, schema);
  return options;
}

function FindSchemaInStack(stack: any) {
  if (stack.$_IS_VALIDATOR_MIDDLEWARE && stack.$_VALIDATOR_SCHEMA) {
    return stack.$_VALIDATOR_SCHEMA;
  }
  if (stack.stack) {
    for (const stackItem of stack.stack) {
      return FindSchemaInStack(stackItem);
    }
  }
}
function FillSchmeParameters(parameters, schema?: InputSChema) {
  if (schema) {
    schema.body && FillSchemaParameter(parameters, schema.body, 'formData');
    schema.query && FillSchemaParameter(parameters, schema.query, 'query');
    schema.params && FillSchemaParameter(parameters, schema.params, 'path');
  }
}
function FillSchemaParameter(parameters: [any], object, type) {
  for (const key in object) {
    const schema = object[key];
    const isRequiredFlag = schema._flags?.presence === 'required';
    parameters.push({
      in: type,
      name: key,
      type: ALLOWED_PARAM_TYPES.includes(schema.type) ? schema.type : null,
      required: isRequiredFlag,
    })
  }
}

function FormatPath(path: string, specs) {
  specs.parameters.forEach((param) => {
    if (param.in === 'path') {
      path = path.replace(`:${param.name}`, `{${param.name}}`);
    }
  });
  return path;
}

function CreateKoaSwagger(paths, inputParams: InputParams) {
  const {
    router,
    uiConfig
  } = inputParams;
  if (!uiConfig.swaggerOptions) {
    uiConfig.swaggerOptions = {};
  }
  if (!uiConfig.swaggerOptions.spec) {
    uiConfig.swaggerOptions.spec = {};
  }
  uiConfig.swaggerOptions.spec.swagger = '2.0';
  uiConfig.swaggerOptions.spec.paths = paths;
  return koaSwagger(uiConfig);
}

export default Swagger;