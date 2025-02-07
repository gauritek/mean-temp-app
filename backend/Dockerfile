# Step 1: Set the base image
FROM node:16

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Expose the port the app will run on
EXPOSE 5000

# Step 6: Start the app
CMD ["node", "server.js"]