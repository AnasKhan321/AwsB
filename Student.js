const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  uemail: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
 
  date: {
    type: Date,
    default: Date.now,
  },
});
const Student = mongoose.model("Student", StudentSchema);

module.exports = Student; 