import { Hook, HookContext, Query } from "@feathersjs/feathers";

export const FilterByUser: () => Hook = (): Hook => {
    return async(context: HookContext): Promise<HookContext> => {
        const user: any = context.params.user!;
        const query: Query = context.params.query || {};
        query.userId = user._id;
        context.params.query = query;

        return context;
    };
};
