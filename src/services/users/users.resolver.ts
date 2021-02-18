import { HookContext, Query } from "@feathersjs/feathers";
import { ResolverMap } from "feathers-hooks-common";

type TAuthorResolver = { author: { email: string; name: string } };
export const AuthorResolver: ResolverMap<any> = {
    joins: {
        author: () => async(data: any, context: HookContext): Promise<TAuthorResolver> => {
            const query: Query = {
                $select: ["email", "name"],
            };

            data.author = await context.app
                .service("users")
                .get(data.userId, { query })
                .catch(() => {});

            return data;
        },
    },
};
