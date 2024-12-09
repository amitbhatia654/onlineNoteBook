const express = require('express');
const router = express.Router()

const NotebookController = require('../Controller/notebook-controller');
const AuthMiddleWare = require('../auth-middleware');

// all E-NoteBook Apis

router.route("/subjects").post(AuthMiddleWare, NotebookController.addSubject)
router.route("/subjects").get(AuthMiddleWare, NotebookController.getALLSubjects)
router.route("/subjects/:id").put(AuthMiddleWare, NotebookController.updateSubject)
router.route("/subjects/:id").delete(AuthMiddleWare, NotebookController.deleteSubject)
router.route('/topics').post(AuthMiddleWare, NotebookController.addTopic)
router.route('/topics').get(AuthMiddleWare, NotebookController.getAllTopic)
router.route('/topics/:id').delete(AuthMiddleWare, NotebookController.deleteTopic)
router.route('/topics/:id').put(AuthMiddleWare, NotebookController.updateTopic)
router.route('/topicData').put(AuthMiddleWare, NotebookController.addTopicData)
router.route('/topicData1').put(AuthMiddleWare, NotebookController.addTopicData1)


router.route('/topic').post(AuthMiddleWare, NotebookController.addTopic1)
router.route('/topic').delete(AuthMiddleWare, NotebookController.deleteTopic1)
router.route('/topic').put(AuthMiddleWare, NotebookController.updateTopic1)








module.exports = router;