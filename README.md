# fateai
## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/)

### Steps

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/fateai.git
    cd fateai
    ```

2. **Install Node.js dependencies:**
    ```sh
    npm install
    ```

3. **Start Docker Compose:**
    ```sh
    docker-compose up -d
    ```

4. **Start the Node.js application:**
    ```sh
    npm start
    ```
    or
    ```sh
    npm run dev 
    ```
    for developer

Your application should now be running. Open your browser and navigate to `http://localhost:3000` to see it in action.
## Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **Docker**: Platform for developing, shipping, and running applications in containers.
- **MariaDB**: NoSQL database for storing application data.
- **Ejs**: JavaScript library for building user interfaces.
