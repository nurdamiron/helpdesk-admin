# Troubleshooting Guide

## API Connection Issues

If you're experiencing problems connecting to the backend API, check the following:

### Connection Errors

```
Network Error
```

This usually means the admin panel cannot reach the backend server. Check:

1. **Backend server is running**: Make sure your backend server is active and accessible
2. **Environment variables**: Check that `REACT_APP_API_URL` points to the correct backend URL
3. **CORS settings**: Ensure the backend server's CORS settings allow requests from your frontend domain
4. **Network connectivity**: Check your network connection and firewall settings

### Authentication Errors

```
401 Unauthorized
```

This means your authentication token is invalid or expired:

1. **Try logging in again**: Your session may have expired
2. **Check backend logs**: There might be an issue with the authentication service
3. **JWT token**: Inspect the token in localStorage using the browser's developer tools

## WebSocket Connection Issues

If real-time features like chat are not working:

### WebSocket Connection Failures

Look for these messages in the browser console:

```
WebSocket connection failed
Error: WebSocket connection failed
```

Common solutions:

1. **Check WebSocket URL**: Ensure `REACT_APP_WS_URL` is correct in `.env` files
2. **Secure connections**: For HTTPS sites, you must use `wss://` protocol, not `ws://`
3. **Backend status**: Verify the WebSocket server is running on the backend

### Mixed Content Errors

```
Mixed Content: The page was loaded over HTTPS, but attempted to connect to the WebSocket endpoint using the insecure WebSocket protocol (ws://). This request has been blocked.
```

Solution:
- Update your `.env.production` to use `wss://` instead of `ws://` for WebSocket connections

## Environment Configuration

### Verifying Current Environment Settings

To check which API and WebSocket URLs your application is using:

1. Open the browser console
2. Look for log messages like:
   ```
   Using API URL (production mode): https://helpdesk-backend-ycoo.onrender.com/api
   WebSocket URL (production mode): wss://helpdesk-backend-ycoo.onrender.com/ws
   ```

### Manually Testing API Endpoints

Test if the API is accessible:

```bash
curl https://helpdesk-backend-ycoo.onrender.com/api/health
# Should return status information
```

### Testing WebSocket Endpoints

You can test WebSocket connectivity using tools like [WebSocket King](https://websocketking.com) or [Postman](https://www.postman.com).

## Production vs. Development

### Testing Production Configuration Locally

To test the production API endpoints while developing locally:

```bash
npm run start:prod
```

This will run the frontend in development mode but connect to the production backend servers.