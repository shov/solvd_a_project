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

No Auth so far

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
    "email":  "user@example.example"
}
```
* `email` is a valid email
* max `email` length is 500 chars

Expected response `201 Created`
```json
{
    "id": 1,
    "email":  "user@example.example"
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
    "email":  "user@example.example"
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

