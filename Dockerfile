# ================================================
#  Stage 1 — CI: Lint + Test
#  Uses Node 22 Alpine to run ESLint and Jest
# ================================================
FROM node:22-alpine AS ci

WORKDIR /app

# Copy dependency files first (layer caching)
COPY package*.json ./

# Install dev dependencies (jest, eslint)
RUN npm ci

# Copy source and tests
COPY script.js ./
COPY tests/ ./tests/
COPY jest.config.js ./
COPY .eslintrc.json ./

# Run lint — build fails here if ESLint finds errors
RUN npx eslint script.js

# Run tests — build fails here if any test fails
RUN npx jest --coverage

# ================================================
#  Stage 2 — Production: Serve static files
#  Uses nginx Alpine (tiny, fast, secure)
# ================================================
FROM nginx:alpine AS production

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy only the static files needed by the browser
COPY index.html  /usr/share/nginx/html/
COPY style.css   /usr/share/nginx/html/
COPY script.js   /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# nginx starts automatically — no CMD needed
