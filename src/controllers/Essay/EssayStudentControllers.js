import EssayStudent from '../../models/EssayStudent';

class EssayControllers {
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
}

export default new EssayControllers();
