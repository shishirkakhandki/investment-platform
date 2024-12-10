# Crypto Portfolio App

## Overview
The **Crypto Portfolio App** is a full-stack investment platform built using Next.js for the frontend and NestJS for the backend. It enables users to sign up, log in, connect their MetaMask wallet, and track their cryptocurrency portfolios in real-time. The platform provides a clean, responsive dashboard and integrates with external APIs for live cryptocurrency data.

## Features

### Frontend Features (Next.js)
1. **User Authentication:**
   - Users can sign up, log in, and manage their passwords.
   - JWT is used for authentication and session management.

2. **MetaMask Wallet Integration:**
   - Users can connect their MetaMask wallet.
   - The app fetches wallet details and displays the user's assets across different chains and their current value in USD.

3. **Dashboard:**
   - Displays the latest prices for the top 10 cryptocurrencies.
   - Price movements are visualized using a chart (Chart.js, D3.js, or Victory).

4. **Responsive UI/UX:**
   - The app is designed to be responsive, using Material-UI for consistent styling across different screen sizes.
   - Reusable components to maintain a clean, intuitive interface.

### Backend Features (NestJS Microservices)
1. **API Endpoints:**
   - RESTful APIs for user signup, login, and fetching cryptocurrency data.
   - Endpoints for portfolio management and user authentication.

2. **Microservices Architecture:**
   - Each microservice (cryptocurrency, notification, workflow, user, portfolio) is deployed independently.
   - Services communicate with each other via REST APIs.

3. **Real-Time Cryptocurrency Data:**
   - Integrated with external APIs (such as Moralis or CryptoCompare) to fetch live cryptocurrency data.
   - Caching and error handling to ensure reliability and performance.

4. **Portfolio Management:**
   - Stores user portfolio data, calculates current holdings, and updates portfolio values based on MetaMask wallet data.

## Project Setup

### Prerequisites
- **Node.js**: Ensure that Node.js is installed on your system. You can download it from [Node.js official website](https://nodejs.org/).
- **Yarn**: Yarn is used for managing project dependencies. Install it globally by running:
  ```bash
  npm install -g yarn
  ```

### Local Development Setup

#### 1. Clone the repository
Clone the repository to your local machine:
```bash
git clone https://github.com/your-username/crypto-portfolio-app.git
cd crypto-portfolio-app
```

#### 2. Install dependencies
From the root of the project, run the following command to install dependencies for both frontend and backend:

```bash
yarn install
```

#### 3. Setup Frontend
Navigate to the frontend directory:
```bash
cd crypto-portfolio-frontend
```

Run the development server:
```bash
yarn start
```

The frontend should now be available at [http://localhost:3005](http://localhost:3005).

#### 4. Setup Backend Services (Microservices)
For each microservice (cryptocurrency, notification, workflow, user, portfolio), follow these steps:

- Navigate to the specific microservice directory. For example, for the cryptocurrency service:
  ```bash
  cd services/cryptocurrency
  ```

- Install dependencies:
  ```bash
  yarn install
  ```

- Start the service:
  ```bash
  yarn start
  ```

Repeat this for all the microservices (`notification`, `workflow`, `user`, `portfolio`), ensuring that each service runs on its respective port (3000, 3001, etc.).

#### 5. Configure Environment Variables
Set up the required environment variables in `.env` files for the frontend and backend (for example, `NEXT_PUBLIC_BACKEND_URL`, JWT secrets, etc.).

#### 6. Running the Full App (with Docker Compose)
If you're using Docker, you can build and run all the services using Docker Compose. From the root of your project:

```bash
docker-compose up --build
```

This will start both the frontend and all microservices in isolated Docker containers.

### Docker Compose Configuration
Ensure that your `docker-compose.yml` is properly configured to link the frontend with the backend services. The following configuration should be used:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./crypto-portfolio-frontend
    ports:
      - "3005:3005"
    networks:
      - app-network
    depends_on:
      - cryptocurrency
      - notification
      - workflow
      - user
      - portfolio

  cryptocurrency:
    build:
      context: ./services/cryptocurrency
    ports:
      - "3000:3000"
    networks:
      - app-network

  notification:
    build:
      context: ./services/notification
    ports:
      - "3001:3001"
    networks:
      - app-network

  workflow:
    build:
      context: ./services/workflow
    ports:
      - "3002:3002"
    networks:
      - app-network

  user:
    build:
      context: ./services/user
    ports:
      - "3003:3003"
    networks:
      - app-network

  portfolio:
    build:
      context: ./services/portfolio
    ports:
      - "3004:3004"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### API Documentation

#### Authentication API
- **POST `/workflow/signup`** - User registration.
- **POST `/workflow/login`** - User login. Returns a JWT token.
- **POST `/workflow/password`** - Update the user’s password.

#### Portfolio API
- **GET `/workflow/portfolio/{userId}`** - Fetch user portfolio.
- **GET `/workflow/portfolio/{userId}/value`** - Fetch portfolio value.
- **GET `/workflow/crypto/top10`** - Fetch the top 10 cryptocurrencies.

#### Cryptocurrency API
- **GET `/workflow/crypto/historical`** - Fetch historical data for a specific cryptocurrency.

### Additional Notes
1. **Security:**
   - Always use HTTPS in production environments.
   - Ensure that JWT tokens are stored securely and are never exposed in localStorage or cookies in an insecure manner.
  
2. **Testing:**
   - Tests should be written for both frontend and backend components. Use tools like Jest for unit testing and Cypress for integration testing.

3. **Deployment:**
   - For cloud deployment, services can be deployed to cloud platforms like AWS, GCP, or Heroku using Docker containers or through direct server setups.
   - The application supports CI/CD pipelines, so integrate it with services like GitHub Actions, GitLab CI, or Jenkins to automate deployment.

4. **Optional Features:**
   - Notifications can be added for portfolio value changes using email or push notifications.
   - The user interface can be further optimized for better UX and performance.

## Conclusion
This app is a full-stack cryptocurrency portfolio management platform that provides real-time portfolio tracking, cryptocurrency data, and a seamless user experience. It is built with modern tools and technologies, ensuring scalability and flexibility.