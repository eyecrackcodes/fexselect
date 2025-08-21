# Clerk Authentication Setup

This application now uses Clerk for authentication instead of Supabase Auth.

## Current Configuration

- **Authentication**: Clerk (for user management and login/signup)
- **Database**: Supabase (for data storage - agents, leads, quotes)
- **Test Publishable Key**: Already configured in `.env`

## How It Works

1. **User Authentication**: Handled entirely by Clerk
2. **Agent Profiles**: Automatically created in Supabase when a new user signs up
3. **Database Access**: Uses Clerk user IDs to link data

## Key Components

### Authentication Flow
- `src/App.tsx`: Main app with Clerk provider and auth routing
- `src/contexts/ClerkAuthContext.tsx`: Manages user/agent state
- Uses Clerk's built-in `SignIn` and `SignUp` components

### Database Integration
- Agent profiles are linked via `clerk_id` column
- All database operations still use Supabase
- RLS temporarily disabled (see migration notes)

## Setup Steps for New Developers

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run database migration** (in Supabase SQL Editor):
   ```sql
   -- See CLERK_MIGRATION.sql for full script
   ALTER TABLE agents ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
   ```

3. **Start the app**:
   ```bash
   npm start
   ```

## Production Setup

1. **Create Clerk Account**:
   - Go to https://dashboard.clerk.com
   - Create a new application
   - Get your production keys

2. **Update Environment Variables**:
   ```env
   REACT_APP_CLERK_PUBLISHABLE_KEY=your_production_key
   ```

3. **Configure Clerk**:
   - Set up your branding
   - Configure allowed email domains
   - Set up social login providers if needed

4. **Implement Proper RLS**:
   - Re-enable Row Level Security in Supabase
   - Use Clerk JWT verification in Edge Functions
   - Create policies that verify Clerk user IDs

## Testing

The app is configured with a test Clerk instance. You can:
- Sign up with any email
- Sign in/out
- Update agent profiles
- All data operations work with the test account

## Troubleshooting

### "SignedIn cannot be used as JSX component"
- This is a React 18 type issue
- We use `useUser()` hook instead of `SignedIn/SignedOut` components

### Agent profile not created
- Check browser console for errors
- Ensure database migration was run
- Verify Supabase connection is working

### Authentication not working
- Check that REACT_APP_CLERK_PUBLISHABLE_KEY is set
- Verify you're using the correct key (test vs production)
- Check browser console for Clerk initialization errors
