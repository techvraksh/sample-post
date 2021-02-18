import { NedbServiceOptions, Service } from "feathers-nedb";
import { Application } from "../../declarations";

export class PostsService extends Service {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public constructor(options: Partial<NedbServiceOptions>, app: Application) {
        super(options);
    }
}
