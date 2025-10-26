# **CodeSyncX Data Models**

## **User**

```json
{
    "_id": "ObjectId",
    "email": "String",
    "name": "String",
    "avatarUrl": "String",
    "password": "String (optional, hashed if present)",
    "providers": [
        {
            "provider": "google | github",
            "providerId": "String"
        }
    ],
    "roles": ["String"], // e.g., ["user", "admin"]
    "createdAt": "Date"
}
```

**Notes:**

-   `password` is optional for OAuth-only users.
-   `providers` stores OAuth login info.
-   `roles` define access level (`user`, `admin`, etc.).

---

## **Project**

```json
{
    "_id": "ObjectId",
    "name": "String",
    "owner": "ObjectId", // Reference to User
    "visibility": "private | team | public",
    "createdAt": "Date",
    "updatedAt": "Date",
    "settings": {
        "runtime": "node | python | static",
        "buildCommand": "String",
        "runCommand": "String"
    },
    "livePreview": {
        "url": "String",
        "lastDeployedAt": "Date"
    }
}
```

**Notes:**

-   `visibility` controls project sharing.
-   `settings` define how the project is built and run.
-   `livePreview` stores current running instance info.

---

## **File** (inside a project)

```json
{
    "_id": "ObjectId",
    "projectId": "ObjectId", // Reference to Project
    "path": "String", // e.g., /src
    "name": "String", // e.g,, index.js
    "type": "file | folder",
    "language": "String", // e.g., javascript
    "createdBy": "ObjectId", // Reference to User
    "createdAt": "Date",
    "updatedAt": "Date",
    "yDocSnapshot": "Binary (optional persisted Yjs snapshot)"
}
```

**Notes:**

-   `yDocSnapshot` is optional and stores CRDT state for collaborative editing.

---

## **Permission / ACL**

### Project Members

```json
{
  "_id": ObjectId(),
  "projectId": ObjectId(ref: projects),
  "userId": ObjectId(ref: users),
  "role": "owner | editor | viewer"
}
```

### ACL (Overrides / File-Level / Link Sharing)

```json
{
    "_id": "ObjectId",
    "projectId": "ObjectId", // Reference to Project
    "subjectType": "user | team | link",
    "subjectId": "ObjectId | String", // User/Team ID or share link
    "scopes": ["read", "write", "share", "run", "delete"],
    "path": "String (optional)" // Scoped to a specific file/folder
}
```

**Notes:**

-   `scopes` define allowed actions.
-   `path` is optional for file-level or folder-level permissions.
-   Can support **link-based sharing** without requiring a user account.
-   Logic when checking permission:

    1. Check ACL for a specific path → if exists, use it.

    2. Else, fallback to projectMember role → map to default scopes.

## **Chat Messages (Communication Service)**

```json
{
    "_id": "ObjectId",
    "projectId": "ObjectId", // The "room"
    "userId": "ObjectId", // Reference to User
    "username": "String", // Denormalized for speed
    "message": "String",
    "timestamp": "Date"
}
```

**Notes:**

-   Each message belongs to a project room.
-   `username` is denormalized to avoid extra user lookups.
-   `timestamp` is the time the message was sent.
-   Can be extended to support attachments, edits, or reactions in the future.
