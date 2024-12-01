const User = require("../Models/UserModel")
const Employee = require("../Models/EmployeeModel")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Subject = require("../Models/SubjectModel");
const Topic = require("../Models/topicModel");



const addSubject = async (req, res) => {
    try {
        const { subjectName, userId } = req.body
        console.log(req.body, 'body')
        const Res = await Subject.create({ subjectName, createdBy: userId })
        res.status(200).send("New Subject Added Succesfully")
    } catch (error) {
        console.log(' error in add subject', error)
    }
}


const getALLSubjects = async (req, res) => {
    try {
        let search = req.query.search
        const createdBy = req.query.userId

        const query = search
            ? { createdBy, subjectName: { $regex: search, $options: "i" } }
            : { createdBy };

        const response = await Subject.find(query)

        res.status(200).json({ response })

    } catch (error) {
        res.status(205).send("data not found")
    }
}



const addTopic = async (req, res) => {
    try {
        const { topicName, subjectId } = req.body
        const Res = await Topic.create({ topicName, subjectId })
        res.status(200).send("New Topic Add Succesfully")
    } catch (error) {
        console.log(' error in add subject', error)
    }
}


const getAllTopic = async (req, res) => {
    try {
        let search = req.query.search
        const subjectId = req.query.subjectId

        const query = search
            ? { subjectId, topicName: { $regex: search, $options: "i" } }
            : { subjectId };

        const response = await Topic.find(query)

        res.status(200).json({ response })

    } catch (error) {
        res.status(205).send("data not found")
    }
}

const deleteTopic = async (req, res) => {
    try {
        const data = await Topic.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: "Topic Deleted Successfully", data })
    } catch (error) {
        res.status(205).json({ message: "Topic Not Deleted" })
    }
}

const updateTopic = async (req, res) => {
    try {
        console.log(req.body, 'body')
        console.log(req.params, 'params')
        const response = await Topic.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).send("Topic updated succesfully")

    } catch (error) {
        res.status(205).send("Topic Not Updated")
    }
}


const addTopicData = async (req, res) => {
    try {
        const { description, topicId } = req.body; // Destructure request body

        const updatedTopic = await Topic.findByIdAndUpdate(
            topicId,         // The ID of the document to find
            { description },
            { new: true }
        );

        console.log(updatedTopic, 'updates')

        if (!updatedTopic) {
            return res.status(404).send("Topic not found");
        }
        res.status(200).send("Topic added successfully");

    } catch (error) {
        console.log(' error in add subject', error)
    }
}


module.exports = {
    addSubject, getALLSubjects, addTopic, getAllTopic, addTopicData, deleteTopic, updateTopic
}