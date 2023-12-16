import EssayStudent from '../../models/EssayStudent';

class EssayStudentControllers {
  async index(req, res) {
    const { company } = req.params;

    const essays = await EssayStudent.find({ company, corrected: false })
      .sort({ endDate: -1 })
      .populate('company')
      .populate('student')
      .populate({
        path: 'essayAdm',
        populate: {
          path: 'course',
        },
      });

    return res.json(essays);
  }

  async indexCorrected(req, res) {
    const { company, student_id } = req.params;

    const essays = await EssayStudent.find({ company, student: student_id, corrected: true })
      .sort({ endDate: -1 })
      .populate('company')
      .populate('student')
      .populate({
        path: 'essayAdm',
        populate: {
          path: 'course',
        },
      });

    return res.json(essays);
  }

  async store(req, res) {
    const { image, student, essayAdm, corrected, company } = req.body;

    const essayStudent = await EssayStudent.create({
      image,
      student,
      essayAdm,
      corrected,
      company,
    });

    return res.json(essayStudent);
  }

  async update(req, res) {
    const { imageCorrected, grade, commented } = req.body;
    const { essay_id } = req.params;

    const essayStudent = await EssayStudent.updateOne(
      {
        _id: essay_id,
      },
      {
        imageCorrected,
        grade,
        commented,
      }
    );

    return res.json(essayStudent);
  }
}

export default new EssayStudentControllers();
