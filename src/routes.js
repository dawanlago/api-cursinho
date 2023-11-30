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

import config from './config/firebaseConfig';
import QuestionControllers from './controllers/Question/QuestionControllers';
import SimulatorController from './controllers/Simulator/SimulatorController';
import UserControllers from './controllers/User/UserControllers';
import { authenticateToken } from './middlewares/authenticateToken';

initializeApp(config.firebaseConfig);
const storage = getStorage();

const routes = new Router();
routes.post('/', (req, res) => {
  res.send('Olá');
});

// Classes
routes.post('/classes/', companyExist, authenticateToken, ClassController.store);
routes.get('/classes/:company', companyExist, authenticateToken, ClassController.index);
routes.put('/classes/:class_id', companyExist, authenticateToken, ClassController.update);
routes.delete('/classes/:class_id', companyExist, authenticateToken, ClassController.destroy);
routes.get('/classes/:company/:class_id', companyExist, authenticateToken, ClassController.read);

// Topics
routes.post('/topics/', companyExist, authenticateToken, TopicControllers.store);
routes.get('/topics/:company', companyExist, authenticateToken, TopicControllers.index);
routes.put('/topics/:topic_id', companyExist, authenticateToken, TopicControllers.update);
routes.delete('/topics/:topic_id', companyExist, authenticateToken, TopicControllers.destroy);
routes.get('/topics/:company/:topic_id', companyExist, authenticateToken, TopicControllers.read);

// Juries
routes.post('/juries/', companyExist, authenticateToken, JuryControllers.store);
routes.get('/juries/:company', companyExist, authenticateToken, JuryControllers.index);
routes.put('/juries/:jury_id', companyExist, authenticateToken, JuryControllers.update);
routes.delete('/juries/:jury_id', companyExist, authenticateToken, JuryControllers.destroy);
routes.get('/juries/:company/:jury_id', companyExist, authenticateToken, JuryControllers.read);

// Disciplines
routes.post('/disciplines/', companyExist, authenticateToken, DisciplineControllers.store);
routes.get('/disciplines/:company', companyExist, authenticateToken, DisciplineControllers.index);
routes.put('/disciplines/:discipline_id', companyExist, authenticateToken, DisciplineControllers.update);
routes.delete('/disciplines/:discipline_id', companyExist, authenticateToken, DisciplineControllers.destroy);
routes.get('/disciplines/:company/:discipline_id', companyExist, authenticateToken, DisciplineControllers.read);

// Subjects
routes.post('/subjects/', companyExist, authenticateToken, SubjectControllers.store);
routes.get('/subjects/:company', companyExist, authenticateToken, SubjectControllers.index);
routes.put('/subjects/:subject_id', companyExist, authenticateToken, SubjectControllers.update);
routes.delete('/subjects/:subject_id', companyExist, authenticateToken, SubjectControllers.destroy);
routes.get('/subjects/:company/:subject_id', companyExist, authenticateToken, SubjectControllers.read);

// Materials
routes.post('/materials/', companyExist, authenticateToken, MaterialControllers.store);
routes.get('/materials/:company/:course/:week/:day', authenticateToken, companyExist, MaterialControllers.index);
routes.put('/materials/:material_id', companyExist, authenticateToken, MaterialControllers.update);
routes.delete('/materials/:material_id', companyExist, authenticateToken, MaterialControllers.destroy);

// Questions
routes.post('/questions', companyExist, authenticateToken, QuestionControllers.store);
routes.get('/questions/:company/', companyExist, authenticateToken, QuestionControllers.index);
routes.post('/questions/addAnswer/:question_id', companyExist, authenticateToken, QuestionControllers.addAnswer);
routes.put('/questions/:question_id/', companyExist, authenticateToken, QuestionControllers.update);
routes.delete('/questions/:question_id', companyExist, authenticateToken, QuestionControllers.destroy);

// Simulators
routes.get('/simulators/:company/', companyExist, SimulatorController.index);
routes.post('/simulators', companyExist, SimulatorController.store);

// Users
routes.post('/users', companyExist, UserControllers.store);
routes.post('/login', companyExist, UserControllers.login);
routes.get('/verify/:verifyToken', UserControllers.verify);
routes.get('/users/:company', companyExist, authenticateToken, UserControllers.index);
routes.put('/users/:user_id/', companyExist, authenticateToken, UserControllers.update);
routes.delete('/users/:user_id/', companyExist, authenticateToken, UserControllers.destroy);
// PDF
routes.post('/upload-pdf', async (req, res) => {
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

routes.delete('/remove-pdf/', async (req, res) => {
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
