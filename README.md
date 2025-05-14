# Helpdesk Admin Panel

This is the admin panel for the Helpdesk application. It provides an interface for administrators to manage tickets, users, and staff.

## Environment Configuration

The application uses environment-specific configuration files to manage API endpoints and WebSocket connections:

- `.env`: Default environment variables
- `.env.development`: Settings for development environment
- `.env.production`: Settings for production environment

### Environment Variables

- `REACT_APP_API_URL`: Base URL for API requests (e.g., `https://helpdesk-backend-ycoo.onrender.com/api`)
- `REACT_APP_WS_URL`: WebSocket endpoint (e.g., `wss://helpdesk-backend-ycoo.onrender.com/ws`)
- `REACT_APP_ENV`: Current environment (`development` or `production`)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode using `.env.development` settings.\
Open [http://localhost:3004](http://localhost:3004) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run start:prod`

Runs the app in development mode but using production configuration (`.env.production`).\
This is useful for testing the production API endpoints locally.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder using `.env.production` settings.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run build:dev`

Builds the app using development settings (`.env.development`).\
This is useful for creating a development build for testing purposes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

#### Deploying to Vercel

The admin panel can be deployed to Vercel with the following steps:

1. **Install Vercel CLI**: `npm install -g vercel`
2. **Login to Vercel**: `vercel login`
3. **Deploy to Vercel**: `vercel --prod`

During deployment, Vercel will automatically use the `.env.production` file for environment variables.

#### Environment Variables in Vercel

You can also set or override environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to the "Environment Variables" section
3. Add the following variables:
   - `REACT_APP_API_URL`: `https://helpdesk-backend-ycoo.onrender.com/api`
   - `REACT_APP_WS_URL`: `wss://helpdesk-backend-ycoo.onrender.com/ws`
   - `REACT_APP_ENV`: `production`

#### Customizing the Backend URL

If you've deployed your own backend on a different URL, update the URLs in the `.env.production` file or set the environment variables directly in Vercel.

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
