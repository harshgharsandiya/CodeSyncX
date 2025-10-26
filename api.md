# **CodeSyncX API Endpoints**

---

## **1. Authentication**

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| POST   | `/api/auth/signup` | Create a new user account    |
| POST   | `/api/auth/login`  | Login existing user          |
| GET    | `/api/auth/me`     | Get info of the current user |

**Example: Signup Request**

```json
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

---

## **2. Projects**

| Method | Endpoint                            | Description                |
| ------ | ----------------------------------- | -------------------------- |
| POST   | `/api/projects`                     | Create a new project       |
| GET    | `/api/projects/:id`                 | Get project details by ID  |
| PATCH  | `/api/projects/:id`                 | Update project metadata    |
| DELETE | `/api/projects/:id`                 | Delete a project           |
| GET    | `/api/projects/:id/members`         | List project members       |
| POST   | `/api/projects/:id/members`         | Add a member to project    |
| PATCH  | `/api/projects/:id/members/:userId` | Update member role         |
| DELETE | `/api/projects/:id/members/:userId` | Remove member from project |

---

## **3. Files**

| Method | Endpoint                            | Description                            |
| ------ | ----------------------------------- | -------------------------------------- |
| GET    | `/api/projects/:id/files`           | List all files in a project            |
| POST   | `/api/projects/:id/files`           | Create a new file or folder            |
| GET    | `/api/projects/:id/files/:filePath` | Get file/folder by path                |
| PATCH  | `/api/projects/:id/files/:filePath` | Update file/folder content or metadata |
| DELETE | `/api/projects/:id/files/:filePath` | Delete a file or folder                |

> **Note:** `:filePath` should be URL-encoded if it contains slashes.

---

## **4. Runner / Live Preview**

| Method | Endpoint                | Description                                             |
| ------ | ----------------------- | ------------------------------------------------------- |
| POST   | `/api/projects/:id/run` | Trigger code execution; returns `{ previewUrl, runId }` |
| GET    | `/api/runs/:runId/logs` | Fetch logs/output of a specific run                     |

---

## **5. Sharing / Permissions**

| Method | Endpoint                       | Description                                      |
| ------ | ------------------------------ | ------------------------------------------------ |
| POST   | `/api/projects/:id/share`      | Create ACL link or grant file/folder permissions |
| GET    | `/api/projects/:id/acl`        | List all ACL entries for a project               |
| PATCH  | `/api/projects/:id/acl/:aclId` | Update ACL entry                                 |
| DELETE | `/api/projects/:id/acl/:aclId` | Remove ACL entry                                 |

---

## **6. Chat / Communication**

| Method | Endpoint                            | Description                     |
| ------ | ----------------------------------- | ------------------------------- |
| GET    | `/api/projects/:id/chat`            | Get chat messages for a project |
| POST   | `/api/projects/:id/chat`            | Send a new chat message         |
| PATCH  | `/api/projects/:id/chat/:messageId` | Edit a message                  |
| DELETE | `/api/projects/:id/chat/:messageId` | Delete a message                |

**Example: Send Message**

```json
POST /api/projects/:id/chat
{
  "userId": "ObjectId",
  "username": "JohnDoe",
  "message": "Hello team!"
}
```
