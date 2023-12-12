const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"enter the game name"]
        },
        url:{
            type:String,
            required:[true,"enter the game url"]    
        },
        author:{
            type:String,
            required:[true,"enter the game author"]
        },
        datePublished:{
            type: String,
            required:[true,"enter the date published"]
        }
    },
    {
        timestamps: true
    }
)

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;