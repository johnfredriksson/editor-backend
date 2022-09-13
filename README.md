# Editor-API

API to handle back-end for Editor.

Deployed at [https://jsramverk-editor-jofr21.azurewebsites.net](https://jsramverk-editor-jofr21.azurewebsites.net)

## Setup

Install packages with ```npm install```.

Start server with ```npm start```.

## Routes

### Documents

All routes is at ```/docs```.

```GET```
- Fetch all documents.

```POST```
```
optional (but recommended):
    title
    content
```
- Create a new document.

```PUT```
```
required:
    _id
optional (one is needed):
    title
    content
```
- Update a document.

```DELETE```
```
required:
    _id
```
- Delete a document.

