import { ResolverMap } from "feathers-hooks-common";
import { AuthorResolver } from "./services/users/users.resolver";

type TResolvers = {
    author: ResolverMap<any>;
};

export const Resolvers: TResolvers = {
    author: AuthorResolver,
};
