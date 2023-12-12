import Topic from '../../models/Topic';
import Essay from '../../models/Essay';
import EssayStudent from '../../models/EssayStudent';

class EssayControllers {
  async index(req, res) {
    const { company } = req.params;
    const { course } = req.query;

    const essays = await Essay.find({ company, course }).sort({ endDate: -1 }).populate('company');

    return res.json(essays);
  }

  async store(req, res) {
    const { title, endDate, text, course, company } = req.body;

    if (!title || title === '') {
      return res.json({ success: false, errors: 'O titulo da redação é obrigatório' });
    }

    if (!text || text === '') {
      return res.json({ success: false, errors: 'O enunciado da redação é obrigatório' });
    }

    const essay = await Essay.create({
      title,
      endDate,
      text,
      course,
      company,
    });
    return res.json(essay);
  }

  async storeStudent(req, res) {
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
    const { description, company } = req.body;
    const { topic_id } = req.params;

    const descriptionExist = await Topic.findOne({ description, company });

    if (!topic_id || topic_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do tópico' });
    }

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição do tópico é obrigatório' });
    }

    if (!!descriptionExist && descriptionExist._id != topic_id && descriptionExist.company == company) {
      return res.json({ success: false, errors: 'Já existe um tópico com essa descrição.' });
    }

    const topic = await Topic.updateOne(
      { _id: topic_id },
      {
        description,
        company,
      }
    );
    return res.json();
  }

  async destroy(req, res) {
    const { topic_id } = req.params;
    const { company } = req.body;

    if (!topic_id || topic_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do tópico' });
    }

    const topicDelete = await Topic.findByIdAndDelete({ _id: topic_id, company });

    if (!topicDelete) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar o tópico' });
    }
    return res.json({ message: 'Tópico excluído com sucesso' });
  }

  async read(req, res) {
    const { topic_id, company } = req.params;

    const topic = await Topic.findById({ _id: topic_id, company });
    return res.json(topic);
  }

  async listEssayForStudent(req, res) {
    const { company } = req.params;
    const { course } = req.query;
    const essays = await Essay.find({ company, course }).sort({ createdAt: -1 }).populate('company');
    return res.json(essays);
  }
}

export default new EssayControllers();
