// Initializes the `posts` service on path `/posts`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import createModel from "../../models/posts.model";
import { Schema } from "../../schema-validator";
import { TOptions } from "../../types";
import { PostsService } from "./posts.class";
import hooks from "./posts.hooks";

// Add this service to the service type index
export type TPostsService = PostsService & ServiceAddons<any>;
declare module "../../declarations" {
    interface IServiceTypes {
        posts: TPostsService;
    }
}

export default function(app: Application): void {
    const options: TOptions = {
        Model: createModel(app),
        paginate: app.get("paginate"),
        schema: {
            title: Schema.StringRequired,
            content: Schema.StringRequired,
            image: Schema.StringRequired,
            $$strict: true,
        },
    };

    // Initialize our service with any options it requires
    app.use("/posts", new PostsService(options, app));

    // Get our initialized service so that we can register hooks
    const service: TPostsService = app.service("posts");

    service.hooks(hooks);
}
