import { Context, Next } from "koa";

export = Validator;
type ValidatorParams = {
    query: Object,
    params: Object,
    body: Object
}
declare function Validator(input: ValidatorParams): (ctx: Context, next: Next) => Promise<any>;
//# sourceMappingURL=validator.d.ts.map