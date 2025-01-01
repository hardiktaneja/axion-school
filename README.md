# AXION School API

This API provides endpoints to manage users in the system. Users can be created using the `create` endpoint, and existing users can log in using the `login` endpoint. 
Base deployment URL: https://axion-school.onrender.com
## Authentication

### Create User
- **URL:** `/user/create`
- **Method:** POST

-Input params: username, password, role, schoolID - optional for SuperAdmin
TODO, make accessable using special Access token
Sample Curl
```
curl --location 'localhost:5111/api/user/createUser' \
--header 'Content-Type: application/json' \
--data '{
    "username": "username"
    ,"password": "password"
    ,"role": "SuperAdmin" // or "Admin"
}'
```

### Login
- **URL:** `/user/login`
- **Method:** POST

-Input params: username, password

- Output - token and userdetails
```
curl --location 'localhost:5111/api/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "username"
    ,"password": "password"
}'
```

Use Bearer Token In Authorization Header in subsequent requests

##Entity #1

### Create School

#### Endpoint

- **URL:** `/school/create`
- **Method:** POST
- input params - name, address
- Auth token in header

```
curl --location 'localhost:5111/api/school/create' \
--header 'Content-Type: application/json' \
--header 'token: <INSET_TOKEN>' \
--data '{
    "name": "school_name",
    "address": "school_address"
}'
```

### Update School

#### Endpoint

- **URL:** `/school/update?id=id1`
- **Method:** PUT

- input-query-params - id (of school)
- input-param body - name, address


### Delete Classroom

#### Endpoint

- **URL:** `/school/delete?id=id1`
- **Method:** DELETE

- input-query-params - id (of classroom)


### Entity #2 Classrooms

#### Endpoint

- **URL:** `/classroom/getAll`
- **Method:** GET


### Get Classroom by ID

#### Endpoint

- **URL:** `/classroom/getOne?id=id1`
- **Method:** GET
- input-query-params - id (of classroom)


### Create Classroom

#### Endpoint

- **URL:** `/classroom/create`
- **Method:** POST

- input-params - name, schoolID
```
curl --location 'localhost:5111/api/classroom/create' \
--header 'Content-Type: application/json' \
--header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzc1MWEwMTczNzIzOTBkMTA3OTIzZGYiLCJpYXQiOjE3MzU3MzQ3MjAsImV4cCI6MTgzMDQwNzUyMH0.CGoCO4UzQKVktQ66z2rEo6UgX0Vw3GQ8mrt3Uqa5ogs' \
--data '{
    "name": "hardik class 2",
    "schoolID": "6775607f276fa31650dd966a"
}'
```

### Update Classroom

#### Endpoint

- **URL:** `/classroom/update?id=id1`
- **Method:** PUT

- input-params - name



### Delete Classroom

#### Endpoint

- **URL:** `/classrooms/delete/:id`
- **Method:** DELETE
- **Authentication Required:** Yes

#### Request Parameters
id (string, required): The ID of the classroom to delete.

#### Endpoint

- **URL:** `/school/getAll`
- **Method:** GET

### Get Classroom by ID

#### Endpoint

- **URL:** `/school/getOne?id=id1`
- **Method:** GET

- input query param - id
