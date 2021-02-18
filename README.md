## Getting Started

1. Make sure you have [NodeJS v14](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/sample-post
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all tests in the `test/` directory will be run.

## Seeder
An example of initial mock data can be found in `/src/init => InitialUsers()`

This creates 2 users if not yet existing

## Creating user
**POST** http://localhost:3030/users
```json
{
    "email": "luffy@op.com",
    "name": "Monkey D. Luffy",
    "password": "password"
}
```

## Getting Access Token
**POST** http://localhost:3030/authentication
```json
{
    "email": "luffy@op.com",
    "password": "password",
    "strategy": "local"
}
```

This will result to something like this
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2MTM2NTk1MzgsImV4cCI6MTYxMzc0NTkzOCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiS25RNmJIMGd0Y1BlZ0lRcSIsImp0aSI6IjNmODRlMmMxLWNjN2EtNDI4ZS04OGNlLWZiZWEzNmIzZjcwOCJ9.MclegAuirlT53KcaLGfclm5LpFEkHLc0mEepW1yl1wM",
    "authentication": {
        "strategy": "local",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2MTM2NTk1MzgsImV4cCI6MTYxMzc0NTkzOCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiS25RNmJIMGd0Y1BlZ0lRcSIsImp0aSI6IjNmODRlMmMxLWNjN2EtNDI4ZS04OGNlLWZiZWEzNmIzZjcwOCJ9.MclegAuirlT53KcaLGfclm5LpFEkHLc0mEepW1yl1wM",
        "payload": {
            "iat": 1613659538,
            "exp": 1613745938,
            "aud": "https://yourdomain.com",
            "iss": "feathers",
            "sub": "KnQ6bH0gtcPegIQq",
            "jti": "3f84e2c1-cc7a-428e-88ce-fbea36b3f708"
        }
    },
    "user": {
        "email": "luffy@op.com",
        "name": "Monkey D. Luffy",
        "_id": "KnQ6bH0gtcPegIQq"
    }
}
```
**IMPORTANT** is to get `accessToken` as we will use this as authorization in header

## Post

`Find and Get` of post doesn't require accessToken

`Post, Patch, and Delete` requires access token

IMPORTANT: User is not allowed to modify/delete other user's post

### Creating Post
**POST** http://localhost:3030/posts <br/>
_headers.authorization = Bearer accessToken_
```json
{
    "title": "Title",
    "content": "New Content",
    "image": "image link"
}
```

### Updating Post
**PATCH** http://localhost:3030/posts/_id <br/>
_headers.authorization = Bearer accessToken_
```json
{
    "title": "New Title",
    "content": "New New Content",
    "image": "New image link"
}
```

### Deleting Post
**DELETE** http://localhost:3030/posts/_id <br/>
_headers.authorization = Bearer accessToken_
