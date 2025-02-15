# Use full Node.js image (NOT Alpine)
FROM node:18 

# Set environment variable
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

# Install Prisma globally
RUN npm install -g prisma

# Copy the entire project
COPY . .

# Copy the .env file to ensure Prisma can access DATABASE_URL
COPY .env .env

# Generate Prisma Client inside the container
RUN npx prisma generate

# Expose the port NestJS runs on (default: 3000)
EXPOSE 3000

# Copy the startup script into the container
COPY startup.sh /startup.sh

# Give execute permissions to the script
RUN chmod +x /startup.sh

# Set the script as the entry point
ENTRYPOINT ["/startup.sh"]
