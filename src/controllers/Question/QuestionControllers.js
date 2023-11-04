import Question from '../../models/Question';

class QuestionController {
  async index(req, res) {
    const { company } = req.params;
    const { year, discipline, subject, jury, level, difficulty, modality } = req.query;
    const data = {
      company: company,
    };

    if (!!year) {
      data.year = year;
    }

    if (!!discipline) {
      data.discipline = discipline;
    }

    if (!!subject) {
      data.subject = subject;
    }

    if (!!jury) {
      data.jury = jury;
    }

    if (!!level) {
      data.level = level;
    }

    if (!!difficulty) {
      data.difficulty = difficulty;
    }

    if (!!modality) {
      data.modality = modality;
    }
    const questions = await Question.find(data)
      .sort('description')
      .populate('discipline')
      .populate('subject')
      .populate('jury')
      .populate('company');

    return res.json(questions);
  }

  async store(req, res) {
    const {
      description,
      discipline,
      subject,
      jury,
      year,
      level,
      difficulty,
      modality,
      commentedTemplate,
      answers,
      answerCorrect,
      feedback,
      company,
    } = req.body;

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição da questão é obrigatório' });
    }

    const question = await Question.create({
      description,
      discipline,
      subject,
      jury,
      year,
      level,
      difficulty,
      modality,
      commentedTemplate,
      answers,
      answerCorrect,
      feedback,
      company,
    });
    return res.json(question);
  }

  async update(req, res) {
    const {
      description,
      discipline,
      subject,
      jury,
      year,
      level,
      difficulty,
      modality,
      commentedTemplate,
      answers,
      answerCorrect,
      feedback,
      company,
    } = req.body;
    const { question_id } = req.params;

    if (!question_id || question_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da questão' });
    }

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição da questão é obrigatório' });
    }

    const question = await Question.updateOne(
      { _id: question_id },
      {
        description,
        discipline,
        subject,
        jury,
        year,
        level,
        difficulty,
        modality,
        commentedTemplate,
        answers,
        answerCorrect,
        feedback,
        company,
      }
    );

    return res.json();
  }

  async destroy(req, res) {
    const { question_id } = req.params;

    if (!question_id || question_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da questão' });
    }

    const question = await Question.findByIdAndDelete({ _id: question_id });

    if (!question) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar a questão' });
    }
    return res.json({ message: 'Questão excluída com sucesso' });
  }

  async read(req, res) {
    const { class_id, company } = req.params;

    if (!class_id || class_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da turma' });
    }

    const classReq = await Class.find({ _id: class_id, company });
    return res.json(classReq);
  }

  async addAnswer(req, res) {
    const { answer } = req.body;
    const { question_id } = req.params;

    const question = await Question.findById(question_id);

    //Pegar a resposta
    question.answers.forEach((item) => {
      if (item.option === answer) {
        item.quantityChosen++;
      }
    });
    const questionUpdate = await Question.updateOne(
      { _id: question_id },
      {
        answers: question.answers,
      }
    );

    const questionUpdated = await Question.findById(question_id);
    return res.json(questionUpdated);
  }
}

export default new QuestionController();
