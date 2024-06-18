// models/Game.js
"use strict";

/**
 * Listing 17.6 (p. 249)
 * 새로운 스키마와 모델의 생성
 */
const mongoose = require("mongoose"),
  gameSchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
        required: true,
      },
      gameprice: {
        type: Number,
        default: 0,
        min: [0, "game cannot have a negative number of price"],
      }
      
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Game", gameSchema);
