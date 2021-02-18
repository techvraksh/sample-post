import debug from "debug";
import { Application } from "../declarations";

debug.enable("USER");
const log: any = debug("USER");

type TUser = { email: string; name: string; password: string };

const InitialUsers = async(app: Application): Promise<void> => {
    const users: TUser[] = [
        { email: "luffy@op.com", name: "Monkey D. Luffy", password: "a" },
        { email: "zoro@op.com", name: "Roronoa Zoro", password: "a" },
    ];

    const emails: string[] = users.map((user: TUser) => user.email);
    const userDocs: TUser[] = await app.service("users").find({
        paginate: false,
        query: {
            email: { $in: emails },
        },
    }) as TUser[];

    const existingUsers: Map<string, TUser> = new Map(
        userDocs.map((user: TUser) => [user.email, user]),
    );

    if (existingUsers.size !== users.length) {
        log("CREATING INITIAL USERS");
    }

    await Promise.all(
        users.map((user: TUser) => existingUsers.has(user.email)
            ? Promise.resolve()
            : app.service("users").create(user).then((result: TUser) => log(`Created: ${result.email}`))
        ),
    );
};

const Init = async(app: Application): Promise<boolean> => {
    await InitialUsers(app);
    return true;
};

const Scripts = (app: Application): void => {
    const init: Promise<boolean> = Init(app);
    app.set("scripts", init);
};

export default Scripts;
