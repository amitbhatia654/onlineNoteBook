const mongoose = require("mongoose")

const SubjectSchema = new mongoose.Schema({
    subjectName: {
        type: String, require: true
    },

    createdBy: {
        type: String, require: true
    }
})

const Subject = new mongoose.model("Subject", SubjectSchema)
module.exports = Subject