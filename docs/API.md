# API v1

## Exceptions

* 500 family errors are not expected, if they happened call me +375 @ shov
* 403 - not enough permissions
* 401 - unauthorized

An error response body example

```json
{
    "error": {
        "msg": "What's wrong explanation",
    }
}
```

## Auth

....

## End-points

### get users
 `GET /api/v1/users`

Response example

```json
{
    "users": [
        {
            "id": 1
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
    "name": "Peter Parker",
    "phone": "235252454355",
    "address": "paper st. 42"
}
```

Expected errors
* 404 - not found


### create a user
`POST /api/v1/users`

Request body example
```json
{
    "name": "Peter Parker",
    "phone": "235252454355",
    "address": "paper st. 42"
}
```
* max `name` length is 500 chars

Expected response `201 Created`
```json
{
    "id": 1,
    "name": "Peter Parker",
    "phone": "235252454355",
    "address": "paper st. 42"
}
```

Expected errors
* 400 - not valid body

