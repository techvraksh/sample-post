import { BadRequest } from "@feathersjs/errors";
import { Hook, HookContext } from "@feathersjs/feathers";
import Validator, { RuleString, ValidationError, ValidationSchema } from "fastest-validator";
import { Application } from "./declarations";

type TSchemaValidatorOption = { schema?: ValidationSchema };
export type TSchema = ValidationSchema;

type TSchemaRule = {
    StringOptional: RuleString;
    StringRequired: RuleString;
};

export const Schema: TSchemaRule = {
    StringOptional: { type: "string", optional: true, max: 250 },
    StringRequired: { type: "string", empty: false, max: 250 },
};

export const SchemaValidator = (app: Application, schema: any, data: any, path: string): void => {
    if (schema) {
        const v: Validator = new Validator();
        const schemaErrors: true | ValidationError[] = v.validate(data, schema);
        if (schemaErrors !== true) {
            throw new BadRequest(`Invalid Payload(${path})`, {
                path,
                errors: schemaErrors.map(
                    (error: ValidationError): Partial<ValidationError> => {
                        const { actual, expected, type, ...errorFields } = error;

                        return errorFields;
                    },
                ),
            });
        }
    }
};

export const SchemaValidatorHook: (options?: TSchemaValidatorOption) => Hook = (
    options: TSchemaValidatorOption = {},
): Hook => {
    return async(context: HookContext): Promise<HookContext> => {
        const schema: ValidationSchema = options.schema ? options.schema : context.service?.options?.schema;
        if (schema && !context.params.skipSchemaCheck) {
            SchemaValidator(context.app as Application, schema, context.data, context.path);
        }

        return context;
    };
};
