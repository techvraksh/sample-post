import assert from "assert";
import app from "../../src/app";
import {Paginated} from '@feathersjs/feathers';
import {NotFound} from '@feathersjs/errors';

type TUser = {
    email: string;
    name: string;
    _id: string;
};

type TPostData = {
    title: string;
    content: string;
    image: string;
};

type TPost = TPostData & {
    _id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

describe("'posts' service", () => {
    it("registered the service", () => {
        const service = app.service("posts");

        assert.ok(service, "Registered the service");
    });

    it("CRUD",async() => {

        const postCount: Paginated<TPost> = await app.service("posts").find({
            query: { $limit: 0 },
        }) as Paginated<TPost>;


        const current1: number = Date.now();
        const userInfo1 = {
            email: `someone+${current1}@example.com`,
            password: "supersecret",
            name: `Some One ${current1}`,
        };
        const user1: TUser = await app.service("users").create(userInfo1) as TUser;

        const current2: number = Date.now() + 2;
        const userInfo2 = {
            email: `someone+${current2}@example.com`,
            password: "supersecret",
            name: `Some One ${current2}`,
        };
        const user2: TUser = await app.service("users").create(userInfo2) as TUser;

        const postData1: TPostData = {
            content: "Content 1",
            image: "Image URL 1",
            title: "Title 1",
        };
        const postData2: TPostData = {
            content: "Content 2",
            image: "Image URL 2",
            title: "Title 2",
        };

        const post1: TPost = await app.service("posts").create(postData1, { authenticated: true, user: user1 });
        const post2: TPost = await app.service("posts").create(postData2, { authenticated: true, user: user2 });

        const existingPosts: Paginated<TPost> = await app.service("posts").find({query: { $sort: { createdAt: -1 } }}) as Paginated<TPost>;
        assert.strictEqual(existingPosts.total - postCount.total , 2);
        assert.deepStrictEqual(existingPosts.data[0] , post2);
        assert.deepStrictEqual(existingPosts.data[1] , post1);

        const updatedPost2: TPost = await app.service("posts").patch(
            post2._id,
            {
                title: "NEW TITLE 2"
            },
            {
                authenticated: true,
                user: user2,
            }
        );
        assert.strictEqual(updatedPost2.title, "NEW TITLE 2", "New title set");
        assert.strictEqual(updatedPost2.createdAt !== updatedPost2.updatedAt, true, "updatedAt is now updated");

        const deletedPost2: TPost = await app.service("posts").remove(
            post2._id,
            {
                authenticated: true,
                user: user2,
            },
        );

        const checkPost2: Paginated<TPost> = await app.service("posts").find({
            query: { _id: deletedPost2._id, $limit: 0, }
        }) as Paginated<TPost>;
        assert.strictEqual(checkPost2.total, 0, "Not existing anymore");


        // Modify of other's post will throw a not found error
        await assert.rejects(() => app.service("posts").patch(
            post1._id,
            {
                title: "NEW TITLE 1"
            },
            {
                authenticated: true,
                user: user2,
            }
        ), NotFound);

        // Delete of other's post will throw a not found error
        await assert.rejects(() => app.service("posts").remove(
            post1._id,
            {
                authenticated: true,
                user: user2,
            }
        ), NotFound);
    });
});
