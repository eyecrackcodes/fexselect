# Connection Timeout Troubleshooting Guide

## Quick Fix Steps

1. **Run the setup script:**
   ```bash
   node setup-env.js
   ```

2. **Update the .env file with your Supabase credentials:**
   - Open the `.env` file that was created
   - Replace `https://your-project.supabase.co` with your actual Supabase URL
   - Replace `your-anon-key-here` with your actual Supabase anon key

3. **Find your Supabase credentials:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Navigate to Settings > API
   - Copy your Project URL and anon public key

4. **Restart your development server:**
   ```bash
   npm start
   ```

## Common Issues and Solutions

### 1. Missing Environment Variables
**Symptoms:** 
- Console shows "❌ Not set" for URL or Key
- Error: "Supabase not configured"

**Solution:**
- Ensure `.env` file exists in the root directory
- Verify credentials are correctly set
- Restart the development server after updating `.env`

### 2. Connection Timeout
**Symptoms:**
- "Connection timeout" error after 10 seconds
- Loading spinner never stops

**Possible Causes:**
1. **Invalid Supabase URL** - Double-check the URL format
2. **Network Issues** - Check your internet connection
3. **Firewall/Proxy** - Corporate networks may block connections
4. **Supabase Project Status** - Ensure your project is active

### 3. Authentication Errors
**Symptoms:**
- Can't sign in or sign up
- "Invalid API key" errors

**Solution:**
- Verify you're using the `anon public` key, not the `service_role` key
- Check if RLS (Row Level Security) is enabled on your tables

## Diagnostic Steps

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for error messages in the Console tab
   - Check Network tab for failed requests

2. **Verify Supabase Connection:**
   - The app will log connection status on startup
   - Look for "✅ Supabase connection successful" or error messages

3. **Test Supabase Project:**
   - Go to your Supabase dashboard
   - Try running a simple query in the SQL Editor
   - Ensure your project is not paused

## Advanced Troubleshooting

### Using a Proxy
If you're behind a corporate proxy, you may need to configure proxy settings:

1. Set proxy environment variables:
   ```bash
   export HTTP_PROXY=http://your-proxy:port
   export HTTPS_PROXY=http://your-proxy:port
   ```

2. Or add to your `.env` file:
   ```
   HTTP_PROXY=http://your-proxy:port
   HTTPS_PROXY=http://your-proxy:port
   ```

### Debugging Network Issues
1. Test direct connection to Supabase:
   ```bash
   curl https://your-project.supabase.co/rest/v1/
   ```

2. Check DNS resolution:
   ```bash
   nslookup your-project.supabase.co
   ```

### Error Messages Explained

- **"Supabase not configured"** - Environment variables are missing
- **"Connection timeout"** - Network request took too long
- **"Network error"** - Failed to establish connection
- **"Invalid API key"** - Wrong key or key format issue

## Getting Help

If you're still experiencing issues:

1. Check the [Supabase Status Page](https://status.supabase.com)
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Ask in [Supabase Discord](https://discord.supabase.com)
4. Open an issue with:
   - Error messages from console
   - Network tab screenshots
   - Steps you've already tried
