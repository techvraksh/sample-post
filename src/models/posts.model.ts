import NeDB from "nedb";
import path from "path";
import { Application } from "../declarations";

export default function(app: Application): NeDB<any> {
    const dbPath: string = app.get("nedb");
    const Model: NeDB = new NeDB({
        filename: path.join(dbPath, "posts.db"),
        autoload: true,
    });

    return Model;
}
