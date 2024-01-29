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
import SimulatorController from './controllers/Simulator/SimulatorController';
import UserControllers from './controllers/User/UserControllers';
import { authenticateToken } from './middlewares/authenticateToken';
import SimulatorAdmController from './controllers/Simulator/SimulatorAdmController';
import EssayControllers from './controllers/Essay/EssayControllers';
import EssayStudentControllers from './controllers/Essay/EssayStudentControllers';
import FlashcardControllers from './controllers/Flashcard/FlashcardControllers';

initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

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
routes.post('/enrollStudent/:class_id', companyExist, authenticateToken, ClassController.addStudent);
routes.post('/acceptStudent/:class_id', companyExist, authenticateToken, ClassController.acceptStudentInCourse);
routes.post('/rejectStudent/:class_id', companyExist, authenticateToken, ClassController.rejectStudentInCourse);
routes.post('/removeStudent/:class_id', companyExist, authenticateToken, ClassController.removeStudentInCourse);
routes.get('/enrolledCourses/:company/:student', companyExist, authenticateToken, ClassController.enrolledCourses);
routes.get('/preEnrolledCourses/:company/:student', companyExist, authenticateToken, ClassController.preEnrolledCourses);

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
routes.get('/simulators/:company/', companyExist, authenticateToken, SimulatorController.index);
routes.get('/listSimulators/:company/:user', companyExist, authenticateToken, SimulatorController.listSimulators);
routes.post('/simulators', companyExist, authenticateToken, SimulatorController.store);

// Simulators ADM
routes.post('/simulators-adm', companyExist, authenticateToken, SimulatorAdmController.store);
routes.get('/list-simulators-adm/:company/:course', companyExist, authenticateToken, SimulatorAdmController.listSimulators);
routes.put('/simulators-adm/:simulator_id', companyExist, authenticateToken, SimulatorAdmController.update);
routes.delete('/simulators-adm/:simulator_id', companyExist, authenticateToken, SimulatorAdmController.destroy);
routes.get('/list-simulators-student/:company', companyExist, authenticateToken, SimulatorAdmController.listSimulatorsForStudent);

// Users
routes.post('/users', companyExist, UserControllers.store);
routes.post('/login', companyExist, UserControllers.login);
routes.get('/verify/:verifyToken', UserControllers.verify);
routes.get('/users/:company', companyExist, authenticateToken, UserControllers.index);
routes.put('/users/:user_id/', companyExist, authenticateToken, UserControllers.update);
routes.delete('/users/:user_id/', companyExist, authenticateToken, UserControllers.destroy);
routes.post('/request-forgot-password', companyExist, UserControllers.forgotPassword);
routes.post('/reset-password/:token', companyExist, UserControllers.resetPassword);

// Essay
routes.post('/essay', companyExist, authenticateToken, EssayControllers.store);
routes.get('/essay/:company', companyExist, authenticateToken, EssayControllers.index);
routes.get('/list-essay-student/:company', companyExist, authenticateToken, EssayControllers.listEssayForStudent);
routes.post('/essay-student', companyExist, authenticateToken, EssayStudentControllers.store);
routes.get('/essay-student/:company', companyExist, authenticateToken, EssayStudentControllers.index);
routes.put('/essay-student/:essay_id', companyExist, authenticateToken, EssayStudentControllers.update);
routes.get('/essay-student-corrected/:company/:student_id', companyExist, authenticateToken, EssayStudentControllers.indexCorrected);

// Flashcards
routes.post('/flashcards', companyExist, authenticateToken, FlashcardControllers.store);
routes.get('/flashcards/:company/:user', companyExist, authenticateToken, FlashcardControllers.index);
routes.get('/flashcards-adm/:company', companyExist, authenticateToken, FlashcardControllers.indexAdm);
routes.delete('/flashcards/:flashcards_id', companyExist, authenticateToken, FlashcardControllers.destroy);
routes.put('/flashcards/:flashcards_id/', companyExist, authenticateToken, FlashcardControllers.update);

routes.post('/send-essay', upload.single('image'), async (req, res) => {
  try {
    const file = bucket.file(req.file.originalname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.end(req.file.buffer);

    stream.on('finish', () => {
      res.status(200).json({ success: true });
    });

    stream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PDF
routes.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `files/${dateTime}-${req.file.originalname}`);
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
