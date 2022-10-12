
# Editor-API

  

API to handle back-end for Editor.

  

Deployed at [https://jsramverk-editor-jofr21.azurewebsites.net](https://jsramverk-editor-jofr21.azurewebsites.net)

  

## Setup

  

Install packages with ```npm install```.

  

Start server with ```npm start```.

  

## Routes

  

### Documents

  

GET ```/docs```

- Fetch all documents.

---

POST ```/docs```

```

optional (but recommended):

title

content

```

- Create a new document.

 ---

PUT ```/docs```

```

required:

_id

optional (one is needed):

title

content

```

- Update a document.

--- 

DELETE ```/docs```

```

required:

_id

```

- Delete a document.

---
PUT ```/docs/invite```
```
required:

_id
newUser
```

- Adds a user as a co-writer
---

PUT ```/docs/remove```
```
required:

_id
user
```

- Removes a user as a co-writer
---

### Auth

POST ```/auth/register```
```
required:

email
password
```

Register a new user

---

POST ```/auth/login```
```
required:

email
password
```

Login with an existing user

---

GET ```/auth/token```
```
headers:

x-access-token
```

Validate a token

---

### Invite

GET ```/invite/:id```
```
params:

id
```

Get invite object

---

POST ```/invite```
```
required:

email
document
```

Register a new invite

---

DELETE ```/invite```
```
required:

_id
```

Delete an existing invite

---