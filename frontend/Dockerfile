# Step 1: Set the base image
FROM node:16

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Build the React app for production
RUN npm run build

# Step 6: Install a lightweight web server (nginx) to serve the build files
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Step 7: Expose the port the app will run on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]