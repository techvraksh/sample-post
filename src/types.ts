import { TSchema } from "./schema-validator";

export type TOptions = Partial<{
    // events: string[];
    Model: any;
    multi: boolean | string[];
    id: string;
    paginate: {
        default: number;
        max: number;
    };
    whitelist: string[];
    filters: string[];
    schema: TSchema;
}>;
