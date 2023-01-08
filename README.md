# CRUD API

[TASK](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md).

## INSTALLATION

Install packages

```
npm i
```

## RUN PROJECT

Run development mode

```
npm run start:dev
```

Run production mode

```
npm run start:prod
```

Run tests

```
npm run start:test
```

Run multi development mode

```
npm run start:multi
```

## API URL's

Implemented endpoint: `api/users`

`GET api/users` - get all users

`GET api/users/${id}` - get user by id (uuid)

`POST api/users` - create new user

`PUT api/users/${id}` - update user

`DELETE api/users/${id}` - delete user

### REQUIRED FIELDS(POST && PUT)

`username` — user's name (string, **required**)

`age` — user's age (number, **required**)

`hobbies` — user's hobbies (array of strings or empty array, **required**)
