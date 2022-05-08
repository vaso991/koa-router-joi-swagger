import { Router } from 'koa-router';
import { KoaSwaggerUiOptions } from 'koa2-swagger-ui';
export = Swagger;
type SwaggerOptions = {
    router: Router,
    uiConfig: Partial<KoaSwaggerUiOptions>
}
declare function Swagger(options: SwaggerOptions): void;
//# sourceMappingURL=swagger.d.ts.map