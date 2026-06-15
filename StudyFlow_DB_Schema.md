# StudyFlow Database Schema

## 1. Database Overview

StudyFlow uses **Supabase PostgreSQL**.

Main schemas used:

```txt
auth
public
```

Supabase manages users in:

```txt
auth.users
```

The application manages:

```txt
public.goals
public.tasks
```

---

## 2. Entity Relationship Diagram

```txt
auth.users
   │
   ├── public.goals
   │       └── public.tasks
   │
   └── public.tasks
```

Relationships:

```txt
User 1 → Many Goals
User 1 → Many Tasks
Goal 1 → Many Tasks
```

---

## 3. Table: auth.users

Managed by Supabase Auth.

Important column:

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary user ID |
| email | text | User email |
| created_at | timestamp | Created by Supabase |

This table is the **source of truth** for users.

---

## 4. Table: public.goals

Stores user goals.

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary Key |
| title | text | No | — | Goal title |
| description | text | Yes | — | Optional description |
| user_id | uuid | No | — | Foreign Key to auth.users.id |
| created_at | timestamp / timestamptz | No | now() | Audit column |

---

### Goals Relationships

```txt
goals.user_id → auth.users.id
```

Meaning:

```txt
Each goal belongs to one user.
One user can have many goals.
```

Relationship type:

```txt
One-to-Many
```

---

## 5. Table: public.tasks

Stores tasks.

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary Key |
| title | text | No | — | Task title |
| description | text | Yes | — | Optional description |
| status | text | No | Todo | Todo / Done |
| deadline | timestamp / timestamptz | Yes | — | Optional deadline |
| done_at | timestamptz | Yes | NULL | Time when task was completed |
| user_id | uuid | No | — | Foreign Key to auth.users.id |
| goal_id | uuid | Yes | NULL | Optional Foreign Key to goals.id |
| created_at | timestamp / timestamptz | No | now() | Audit column |

---

### Tasks Relationships

```txt
tasks.user_id → auth.users.id
```

Meaning:

```txt
Each task belongs to one user.
One user can have many tasks.
```

Relationship type:

```txt
One-to-Many
```

---

```txt
tasks.goal_id → public.goals.id
```

Meaning:

```txt
A task may belong to one goal.
One goal can have many tasks.
```

Relationship type:

```txt
Optional One-to-Many
```

Why optional?

```txt
goal_id can be NULL
```

This allows daily/standalone tasks.

---

## 6. Task Types

### Goal Task

A task linked to a goal.

```txt
goal_id = some goal id
```

Example:

```txt
Goal: Pass Data Structures
Task: Study Arrays
```

---

### Daily Task

A standalone task not linked to a goal.

```txt
goal_id = NULL
```

Example:

```txt
Task: Review today's lecture
```

---

## 7. Primary Keys

Primary Keys uniquely identify each row.

```txt
goals.id
tasks.id
auth.users.id
```

They are used by React as stable keys:

```jsx
key={goal.id}
key={task.id}
```

---

## 8. Foreign Keys

Foreign Keys connect tables together.

```txt
goals.user_id → auth.users.id
tasks.user_id → auth.users.id
tasks.goal_id → goals.id
```

They protect relational integrity.

Example:

```txt
A task cannot reference a goal that does not exist.
```

---

## 9. RLS Policies

RLS = Row Level Security.

Purpose:

```txt
Users can only access rows they own.
```

---

### Goals RLS

#### SELECT

```sql
auth.uid() = user_id
```

User can only read their own goals.

---

#### INSERT

```sql
WITH CHECK (auth.uid() = user_id)
```

User can only create goals for themselves.

---

#### UPDATE

```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

User can only update their own goals.

---

#### DELETE

```sql
USING (auth.uid() = user_id)
```

User can only delete their own goals.

---

### Tasks RLS

#### SELECT

```sql
auth.uid() = user_id
```

User can only read their own tasks.

---

#### INSERT

```sql
WITH CHECK (auth.uid() = user_id)
```

User can only create tasks for themselves.

---

#### UPDATE

```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

User can only update their own tasks.

---

#### DELETE

```sql
USING (auth.uid() = user_id)
```

User can only delete their own tasks.

---

## 10. Time Handling

The database stores timestamps in UTC.

Frontend displays local time using:

```js
new Date(task.done_at).toLocaleString("en-QA")
```

Important rule:

```txt
Database stores time
Frontend formats time
```

---

## 11. Status Values

Current task statuses:

```txt
Todo
Done
```

When a task becomes Done:

```txt
status = Done
done_at = current ISO timestamp
```

When a task becomes Todo again:

```txt
status = Todo
done_at = NULL
```

---

## 12. Useful Queries

### Get all goals for a user

```js
supabase
  .from("goals")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });
```

---

### Get all tasks for a user

```js
supabase
  .from("tasks")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });
```

---

### Get tasks under a goal

```js
supabase
  .from("tasks")
  .select("*")
  .eq("user_id", userId)
  .eq("goal_id", goalId);
```

---

### Get daily tasks

```js
supabase
  .from("tasks")
  .select("*")
  .eq("user_id", userId)
  .is("goal_id", null);
```

---

## 13. Current MVP Data Model Summary

```txt
User
├── Goals
│   ├── Goal Tasks
│   └── Progress per Goal
│
└── Daily Tasks
```

This schema supports the MVP and can later expand to:

```txt
Habits
Friend Groups
Weekly Progress
Notifications
Achievements
```
