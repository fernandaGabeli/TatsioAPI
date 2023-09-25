const express = require('express');
const cors = require('cors');

const db = require('../db/connection');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            users: '/api/users',
            posts: '/api/posts',
            categories: '/api/categories'
        }

        this.connectDB();

        this.middlewares();

        this.routes();
    }

    async connectDB() {
        try {
            await db.connect(`${process.env.DATABASE_CONN}`);
            console.log('Database online!');
        } catch (error) {
            console.log(error);
        }

    }


    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

    }

    routes() {
        this.app.use(this.paths.users, require('../routes/usersRoutes'));
        this.app.use(this.paths.posts, require('../routes/postsRoutes'));
        this.app.use(this.paths.categories, require('../routes/categoriesRoutes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port:', this.port);
        });
    }

}

module.exports = Server;