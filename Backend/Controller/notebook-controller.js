const User = require("../Models/UserModel")
const Employee = require("../Models/EmployeeModel")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Subject = require("../Models/SubjectModel");
const Topic = require("../Models/topicModel");
const mongoose = require("mongoose");




const addSubject = async (req, res) => {
    try {
        const { subjectName, userId } = req.body
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


const updateSubject = async (req, res) => {
    try {
        const response = await Subject.findByIdAndUpdate(req.body._id, req.body)
        res.status(200).send("Subject updated succesfully")

    } catch (error) {
        res.status(203).send("Subject Not Updated")
    }
}



const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findOneAndDelete({ _id: req.params.id });
        if (!deletedSubject) {
            return res.status(404).send({ message: 'Employee not deleted' });
        }
        res.status(200).send({ message: 'Subject deleted successfully', data: deletedSubject });

    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).send({ message: 'Failed to delete subject' });
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

const addTopic1 = async (req, res) => {
    try {
        const subject = await Subject.findById(req.body.selectedFolder._id);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }
        const newTopic = {
            title: req.body.title,

        };
        subject.topics.push(newTopic);

        // Save the updated subject
        await subject.save();

        res.status(200).json({
            message: "Topic added successfully",
            subject,
        });
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

const deleteTopic1 = async (req, res) => {
    try {
        const { folderId, topicId } = req.body;


        // Find the folder by ID
        const subject = await Subject.findById(folderId);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // Find the index of the topic to delete
        const topicIndex = subject.topics.findIndex((topic) => topic._id.toString() === topicId);
        if (topicIndex === -1) {
            return res.status(404).json({ message: "Topic not found in the folder" });
        }

        // Remove the topic from the array
        subject.topics.splice(topicIndex, 1);

        // Save the updated subject
        await subject.save();

        res.status(200).json({
            message: "Topic deleted successfully",
            subject,
        });
    } catch (error) {
        res.status(205).json({ message: "Topic Not Deleted" })
    }
}

const updateTopic = async (req, res) => {
    try {
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


        if (!updatedTopic) {
            return res.status(404).send("Topic not found");
        }
        res.status(200).send("Topic added successfully");

    } catch (error) {
        console.log(' error in add subject', error)
    }
}

const addTopicData1 = async (req, res) => {
    try {
        const { description, topicId, folderId } = req.body; // Destructure request body

        const subject = await Subject.findById(folderId);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const topic = subject.topics.find((t) => t._id.toString() == topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        topic.description = description;
        await subject.save();

        res.status(200).json({
            message: "Topic description updated successfully",
            updatedTopic: topic,
        });
    } catch (error) {
        console.log(' error in add subject', error)
    }
}

const updateTopic1 = async (req, res) => {
    try {
        const { title, topicId, folderId } = req.body; // Destructure request body

        const subject = await Subject.findById(folderId);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const topic = subject.topics.find((t) => t._id.toString() == topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        topic.title = title;
        await subject.save();

        res.status(200).json({
            message: "Topic updated successfully",
            subject: subject,
        });

    } catch (error) {
        res.status(205).send("Topic Not Updated")
    }
}


module.exports = {
    addSubject, getALLSubjects, addTopic, getAllTopic, addTopicData,
    deleteTopic, updateTopic, deleteSubject, updateSubject, addTopic1, addTopicData1,
    deleteTopic1, updateTopic1
}