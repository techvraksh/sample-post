// Initializes the `users` service on path `/users`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import createModel from "../../models/users.model";
import { Schema } from "../../schema-validator";
import { TOptions } from "../../types";
import { UsersService } from "./users.class";
import hooks from "./users.hooks";

// Add this service to the service type index
export type TUsersService = UsersService & ServiceAddons<any>;
declare module "../../declarations" {
    interface IServiceTypes {
        users: TUsersService;
    }
}

export default function(app: Application): void {
    const options: TOptions = {
        Model: createModel(app),
        paginate: app.get("paginate"),
        schema: {
            email: "email",
            name: Schema.StringRequired,
            password: Schema.StringRequired,
            $$strict: true,
        },
    };

    // Initialize our service with any options it requires
    app.use("/users", new UsersService(options, app));

    // Get our initialized service so that we can register hooks
    const service: TUsersService = app.service("users");

    service.hooks(hooks);
}
