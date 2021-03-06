# API v1

## Exceptions

* 500 family errors are not expected, if they happened call me +375 @ shov
* 403 - not enough permissions
* 401 - unauthorized

An error response body example

```json
{
    "error": {
        "msg": "What's wrong explanation"
    }
}
```

## Auth

JWT token, `Authorization: Bearer <token>` header to be added

## End-points

### get users

`GET /api/v1/users`

Response example

```json
{
    "users": [
        {
            "id": 1,
            "email": "exampl@exa.mpl"
        }
    ]
}
```

Allowed users to be got are shown only

### get a user

`GET /api/v1/users/{id}`

* `id` is a valid user id

Response example

```json
{
    "id": 1,
    "email": "user@example.example"
}
```

Expected errors

* 404 - not found

### create a user

`POST /api/v1/users`

Request body example

```json
{
    "email": "user@example.example",
    "password": "12345678"
}
```

* `email` is a valid email
* max `email` length is 500 chars
* `password` contains A-Za-z0-9_ only, min 8 chars, max 30 chars

Expected response `201 Created`

```json
{
    "id": 1,
    "email": "user@example.example",
    "token": "token here"
}
```

Expected errors

* 400 - not valid body

### update a user

`PUT /api/v1/users/{id}`

* `id` is a valid user id

Request body example

```json
{
    "email": "user@example.example"
}
```

* `email` is a valid email
* max `email` length is 500 chars

Expected response `204 No content`

Expected errors

* 400 - not valid body
* 404 - not found

### delete a user

`DELETE /api/v1/users/{id}`

* `id` is a valid user id

Expected response `200 OK`

Expected errors

* 404 - not found

### login | create a token

`POST /api/v1/users/{id}/tokens`

Request body example

```json
{
    "password": "12345678"
}
```

* `password` contains A-Za-z0-9_ only, min 8 chars, max 30 chars

### logout | delete a token

`DELETE /api/v1/tokens/{token}`

* `tokenId` is a valid token id

Expected response `200 OK`

### create a reminder

`POST /api/v1/reminder`

Request body example

```json
{
    "fireTime": "2021-08-05T11:30:00",
    "message": null,
    "guestList": []
}
```

Expected response `201 Created`

```json
{
    "id": 1,
    "fireTime": "2021-08-05T11:30:00",
    "message": null,
    "guestList": ['email@email.com']
}
```

Expected errors
* 400 - not valid body



### list reminders

`GET /api/v1/reminder`


Expected response `200 OK`

```json
{
    "reminders": [
        {
            "id": 1,
            "fireTime": "2021-08-05T11:30:00",
            "message": null,
            "guestList": []
        }
    ]
}
```

