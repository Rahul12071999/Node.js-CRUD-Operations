const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Game = require("./models/gameModel");
const cors = require('cors');
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'CRUD operations Node.js & MongoDB',
        version: '1.0.0',
      },
      servers: [
        {
          url: "http://localhost:3000/"
        }
      ],
      components: {
        schemas: {
          Game: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              url: {
                type: 'string'
              },
              author: {
                type: 'string'
              },
              datePublished: {
                type: 'string'
              },
              _id: {
                type: 'string'
              },
              createdAt: {
                type: 'string'
              },
              updatedAt: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    apis: ["./app.js"]
  };
    
const swaggerSpec = swaggerJSdoc(swaggerOptions)
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

dotenv.config();

// Middleware for handling JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for CORS (Cross-Origin Resource Sharing) implementation
app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"],
    exposedHeaders: ["authorization"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

// Connect to the database
mongoose.connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successfully connecting to the database
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(err => console.error("Error connecting to MongoDB:", err));

//go to swagger ui
app.get('/', (req, res) => {
    //res.send("hallo world")
    res.redirect('/api-docs');
})

// Add a new game
/**
 * @swagger
 * /game:
 *   post:
 *     summary: Adds a new game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Successfully added a new game
 */
app.post("/game", async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(200).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Returns all games
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
app.get("/games", async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Returns a single game by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the game to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 */
app.get("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: `Cannot find the game with id ${id}` });
    }
    res.status(200).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Updates a game by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the game to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Successfully updated a game
 *       404:
 *         description: Game not found
 */
app.put('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(id, req.body, { new: true });
    if (!game) {
      return res.status(404).json({ message: `Cannot find the game with id ${id}` });
    }
    res.status(200).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Deletes a game by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the game to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted a game
 *       404:
 *         description: Game not found
 */
app.delete('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ message: `Cannot find the game with id ${id}` });
    }
    res.status(200).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
