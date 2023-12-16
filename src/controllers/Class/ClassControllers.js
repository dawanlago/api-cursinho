import mongoose from 'mongoose';
import Class from '../../models/Class';
import User from '../../models/User';

class ClassController {
  async index(req, res) {
    const { company } = req.params;

    const classes = await Class.find({ company })
      .sort('description')
      .populate('topic')
      .populate('preEnrolledStudents')
      .populate('enrolledStudents')
      .populate('company');
    return res.json(classes);
  }

  async store(req, res) {
    const { description, active, topic, numberOfWeeks, image, company } = req.body;
    const descriptionExist = await Class.findOne({ description, company });

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição do curso é obrigatório' });
    }

    if (!!descriptionExist) {
      return res.json({ success: false, errors: 'Já existe um curso com essa descrição.' });
    }

    const classReq = await Class.create({
      description,
      active,
      topic,
      numberOfWeeks,
      image,
      company,
    });
    return res.json(classReq);
  }

  async update(req, res) {
    const { description, active, topic, numberOfWeeks, image, company } = req.body;
    const { class_id } = req.params;

    const descriptionExist = await Class.find({ description, company });

    if (!class_id || class_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da turma' });
    }

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição do curso é obrigatório' });
    }

    if (!!descriptionExist && descriptionExist._id != class_id && descriptionExist.company == company) {
      return res.json({ success: false, errors: 'Já existe um curso com essa descrição.' });
    }

    const classReq = await Class.updateOne(
      { _id: class_id },
      {
        description,
        active,
        topic,
        numberOfWeeks,
        image,
        company,
      }
    );

    return res.json();
  }

  async destroy(req, res) {
    const { class_id } = req.params;
    const { company } = req.body;

    if (!class_id || class_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da turma' });
    }

    const classDelete = await Class.findByIdAndDelete({ _id: class_id });

    if (!classDelete) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar o curso' });
    }
    return res.json({ message: 'Curso excluído com sucesso' });
  }

  async read(req, res) {
    const { class_id, company } = req.params;

    if (!class_id || class_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da turma' });
    }

    const classReq = await Class.find({ _id: class_id, company });
    return res.json(classReq);
  }

  async addStudent(req, res) {
    const { student } = req.body;
    const { class_id } = req.params;
    const user = await User.findOne({ _id: student });
    const preEnrolledStudents = await Class.updateOne({ _id: class_id }, { $push: { preEnrolledStudents: user } });
    return res.json(preEnrolledStudents);
  }

  async enrolledCourses(req, res) {
    const { student } = req.params;
    const courses = await Class.find({
      enrolledStudents: student,
    });

    return res.json(courses);
  }

  async preEnrolledCourses(req, res) {
    const { student } = req.params;
    const courses = await Class.find({
      preEnrolledStudents: student,
    });

    return res.json(courses);
  }

  async acceptStudentInCourse(req, res) {
    const { student } = req.body;
    const { class_id } = req.params;
    const user = await User.findOne({ _id: student });
    await Class.updateOne(
      { _id: class_id },
      {
        $pull: { preEnrolledStudents: user._id },
      }
    );
    await Class.updateOne({ _id: class_id }, { $push: { enrolledStudents: user._id } });
    const classRes = await Class.findById({ _id: class_id }).populate('preEnrolledStudents').populate('enrolledStudents');
    return res.json(classRes);
  }

  async rejectStudentInCourse(req, res) {
    const { student } = req.body;
    const { class_id } = req.params;
    const user = await User.findOne({ _id: student });
    await Class.updateOne({ _id: class_id }, { $pull: { preEnrolledStudents: user._id } });
    const classRes = await Class.findById({ _id: class_id }).populate('preEnrolledStudents').populate('enrolledStudents');
    return res.json(classRes);
  }

  async removeStudentInCourse(req, res) {
    const { student } = req.body;
    const { class_id } = req.params;
    const user = await User.findOne({ _id: student });
    await Class.updateOne({ _id: class_id }, { $pull: { enrolledStudents: user._id } });
    const classRes = await Class.findById({ _id: class_id }).populate('preEnrolledStudents').populate('enrolledStudents');
    return res.json(classRes);
  }
}

export default new ClassController();
