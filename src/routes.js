import { Router } from 'express';

import ClassController from './controllers/Class/ClassControllers';
import TopicControllers from './controllers/Topic/TopicControllers';
import { companyExist } from './middlewares/companyExist';
import JuryControllers from './controllers/Jury/JuryControllers';
import DisciplineControllers from './controllers/Discipline/DisciplineControllers';
import SubjectControllers from './controllers/Subject/SubjectControllers';
import MaterialControllers from './controllers/Material/MaterialControllers';

import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import multer from 'multer';
import config from './config/firebaseConfig';
import QuestionControllers from './controllers/Question/QuestionControllers';

initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

const routes = new Router();
routes.post('/', (req, res) => {
    res.send('Olá');
});

// Classes
routes.post('/classes/', companyExist, ClassController.store);
routes.get('/classes/:company', companyExist, ClassController.index);
routes.put('/classes/:class_id', companyExist, ClassController.update);
routes.delete('/classes/:class_id', companyExist, ClassController.destroy);
routes.get('/classes/:company/:class_id', companyExist, ClassController.read);

// Topics
routes.post('/topics/', companyExist, TopicControllers.store);
routes.get('/topics/:company', companyExist, TopicControllers.index);
routes.put('/topics/:topic_id', companyExist, TopicControllers.update);
routes.delete('/topics/:topic_id', companyExist, TopicControllers.destroy);
routes.get('/topics/:company/:topic_id', companyExist, TopicControllers.read);

// Juries
routes.post('/juries/', companyExist, JuryControllers.store);
routes.get('/juries/:company', companyExist, JuryControllers.index);
routes.put('/juries/:jury_id', companyExist, JuryControllers.update);
routes.delete('/juries/:jury_id', companyExist, JuryControllers.destroy);
routes.get('/juries/:company/:jury_id', companyExist, JuryControllers.read);

// Disciplines
routes.post('/disciplines/', companyExist, DisciplineControllers.store);
routes.get('/disciplines/:company', companyExist, DisciplineControllers.index);
routes.put('/disciplines/:discipline_id', companyExist, DisciplineControllers.update);
routes.delete('/disciplines/:discipline_id', companyExist, DisciplineControllers.destroy);
routes.get('/disciplines/:company/:discipline_id', companyExist, DisciplineControllers.read);

// Subjects
routes.post('/subjects/', companyExist, SubjectControllers.store);
routes.get('/subjects/:company', companyExist, SubjectControllers.index);
routes.put('/subjects/:subject_id', companyExist, SubjectControllers.update);
routes.delete('/subjects/:subject_id', companyExist, SubjectControllers.destroy);
routes.get('/subjects/:company/:subject_id', companyExist, SubjectControllers.read);

// Materials
routes.post('/materials/', companyExist, MaterialControllers.store);
routes.get('/materials/:company/:course/:week/:day', companyExist, MaterialControllers.index);
routes.put('/materials/:material_id', companyExist, MaterialControllers.update);
routes.delete('/materials/:material_id', companyExist, MaterialControllers.destroy);
// Questions
routes.post('/questions', companyExist, QuestionControllers.store);
routes.get('/questions/:company/', companyExist, QuestionControllers.index);
routes.post('/questions/addAnswer/:question_id', companyExist, QuestionControllers.addAnswer);
routes.put('/questions/:question_id/', companyExist, QuestionControllers.update);
routes.delete('/questions/:question_id', companyExist, QuestionControllers.destroy);

// PDF
routes.post('/upload-pdf', upload.single('pdf'), async(req, res) => {
    try {
        const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, `files/${req.file.originalname + '       ' + dateTime}`);
        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL,
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

routes.delete('/remove-pdf/', async(req, res) => {
    const { url } = req.body;
    try {
        const storageRef = ref(storage, url);

        const removedPDF = await deleteObject(storageRef);

        return res.json(removedPDF);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
};

export default routes;
