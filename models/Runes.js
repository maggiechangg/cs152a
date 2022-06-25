'use strict';
const { text } = require('express');
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var runesSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref: 'User'},
  championName: {type: String, required: true},
} );

module.exports = mongoose.model( 'runesHome', runesSchema );