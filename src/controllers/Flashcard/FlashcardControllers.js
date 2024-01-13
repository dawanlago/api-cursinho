import Flashcard from '../../models/Flashcard';
import Question from '../../models/Question';

class FlashcardControllers {
  async index(req, res) {
    const { company, user } = req.params;

    const flashcards = await Flashcard.find({ company, user }).populate('company');
    return res.json(flashcards);
  }

  async indexAdm(req, res) {
    const { company } = req.params;

    const flashcards = await Flashcard.find({ company, adm: true }).populate('company');
    return res.json(flashcards);
  }

  async store(req, res) {
    const { description, answer, user, company, adm } = req.body;

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição do flashcard é obrigatória' });
    }

    if (!answer || answer === '') {
      return res.json({ success: false, errors: 'A resposta do flashcard é obrigatória' });
    }

    const flashcards = await Flashcard.create({
      description,
      answer,
      user,
      adm,
      company,
    });

    return res.json(flashcards);
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

export default new FlashcardControllers();
