const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const SalesSchema = new Schema ({
    document: {type: String, required: false},
    sales: {type: Array, required: false},
    date_document: { type: Date, default: moment().format() }

});

module.exports = mongoose.model('sales', SalesSchema, 'sales');