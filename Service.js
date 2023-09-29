const mongoose = require("mongoose");

const ServiceScheme = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique : true
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Service = mongoose.model("Service", ServiceScheme);

module.exports = Service; 