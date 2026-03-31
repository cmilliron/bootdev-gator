# Gator

**Gator** is a streamlined CLI-based RSS aggregator designed to help you follow and manage content from your favorite blogs and websites directly from your terminal.

---

## 🚀 Getting Started

To get the application up and running on your local machine, follow these steps:

1. **Install Dependencies** Run the following command to install the required npm packages:

   ```bash
   npm install
   ```

2. **Database Configuration** \* Initialize your PostgreSQL database (recommended name: `gator`).
   - Locate the `init_db.ts` file and insert your database connection string.
   - Run the initialization script to generate your configuration file and migrate the schema:
   ```bash
   npm run init
   ```
   > **Note:** The initialization process creates a configuration file with a placeholder user. You will need to register a real user account before using most commands.

---

## 🛠 Commands

All commands are executed via `npm run start`.

### Authentication & User Management

| Command      | Usage                 | Description                                                          |
| :----------- | :-------------------- | :------------------------------------------------------------------- |
| **register** | `register <username>` | Creates a new user account in the database.                          |
| **login**    | `login <username>`    | Authenticates a registered user and sets them as the active session. |
| **users**    | `users`               | Displays a list of all registered users in the database.             |

### Feed Management

| Command       | Usage                  | Description                                            |
| :------------ | :--------------------- | :----------------------------------------------------- |
| **addfeed**   | `addfeed <name> <url>` | Adds a new RSS feed to the system.                     |
| **feeds**     | `feeds`                | Lists all available feeds stored in the database.      |
| **follow**    | `follow <url>`         | Subscribes the current user to a specific feed.        |
| **following** | `following`            | Lists all feeds currently followed by the active user. |
| **unfollow**  | `unfollow <url>`       | Unsubscribes the current user from a specific feed.    |

### Content & Sync

| Command    | Usage    | Description                                                                                     |
| :--------- | :------- | :---------------------------------------------------------------------------------------------- |
| **agg**    | `agg`    | Triggers the aggregator to fetch the latest posts from all feeds and save them to the database. |
| **browse** | `browse` | Displays the two most recent posts from the feeds the current user follows.                     |
| **reset**  | `reset`  | **Warning:** Resets the database, clearing all stored data.                                     |

```

```
