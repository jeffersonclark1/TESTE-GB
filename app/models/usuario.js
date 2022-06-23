const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const moment = require('moment');

const UserSchema = new Schema ({
    name:      {type: String, required: true},
    pwd:        {type: String, required: true},
    email:      {type: String, required: true},
    document:      {type: String, required: true},
    date_document: { type: Date, default: moment().format() }
});

module.exports = mongoose.model('users', UserSchema, 'users');