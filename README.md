# subtrackr-public

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/ddm21/subtrackr-public)


# Supabase Project Setup

This project uses Supabase as the backend database. Follow the steps below to configure the environment and initialize the database.

## Prerequisites
- A [Supabase](https://supabase.com/) account.

## Steps to Set Up

### 1. Create a Supabase Project
1. Log in to your Supabase account.
2. Create a new project and note the following details:
   - **API URL**: This will be your `VITE_SUPABASE_URL`.
   - **Anon Key**: This will be your `VITE_SUPABASE_ANON_KEY`.

### 2. Configure Environment Variables
1. Create a `.env` file in the root of your project.
2. Add the following lines to the `.env` file and replace the placeholders with your Supabase credentials:
   ```plaintext
   VITE_SUPABASE_URL=<your_supabase_url>
   VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
   ```
### 3. Initialize the Database
1. Navigate to the "SQL Editor" in the Supabase Dashboard.
2. Open the `./supabase/migration/20240323000000_initial_schema.sql` file from the project repository.
3. Copy the SQL script's content and paste it into the SQL Editor.
4. Run the query to create the required database schema.

### 4. Verify Setup

Go to the "Table Editor" in the Supabase Dashboard to confirm that the tables have been created successfully.
