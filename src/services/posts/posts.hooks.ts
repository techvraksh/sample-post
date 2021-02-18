import { authenticate } from "@feathersjs/authentication";
import { Hook, HookContext } from "@feathersjs/feathers";
import debug from "debug";
import { fastJoin, iff, isProvider } from "feathers-hooks-common";
import { FilterByUser } from "../../hooks";
import { Resolvers } from "../../resolvers";

const formatData: () => Hook = (): Hook => {
    return async(context: HookContext): Promise<HookContext> => {
        const { params, method } = context;
        const user: any = params.user!;
        const current: string = new Date().toISOString();
        const { title, content, image } = context.data;

        if (method === "create") {
            context.data = {
                userId: user._id,
                title,
                content,
                image,
                createdAt: current,
                updatedAt: current,
            };
        }
        context.data.updatedAt = current;

        return context;
    };
};

const sort: () => Hook = (): Hook => {
    return async(context: HookContext): Promise<HookContext> => {
        const query: any = context.params.query || {};
        if (!query.$sort) {
            query.$sort = { createdAt: -1 };
        }

        return context;
    };
};

const mockEmail: () => Hook = (): Hook => {
    return async(context: HookContext): Promise<HookContext> => {
        const { method, result } = context;
        let message: string = "";

        switch (method) {
            case "create":
            {
                message = "NEW POST CREATED";
                break;
            }
            case "patch":
            {
                message = "POST UPDATED";
                break;
            }
            case "remove":
            {
                message = "POST REMOVED";
                break;
            }
            default:
            {
                // do nothing
            }
        }

        if (message) {
            debug.enable("EMAIL");
            const log: any = debug("EMAIL");
            log(`Sending Email To: ${result.author.email}\n` +
                `Subject: ${message}`);
        }

        return context;
    };
};

export default {
    before: {
        all: [],
        find: [sort()],
        get: [],
        create: [authenticate("jwt"), formatData()],
        update: [],
        patch: [authenticate("jwt"), formatData(), FilterByUser()],
        remove: [authenticate("jwt"), FilterByUser()],
    },

    after: {
        all: [iff(isProvider("external"), fastJoin(Resolvers.author), mockEmail())],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
};
