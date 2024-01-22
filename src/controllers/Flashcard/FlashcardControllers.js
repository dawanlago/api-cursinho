import Flashcard from '../../models/Flashcard';

class FlashcardControllers {
  async index(req, res) {
    const { company, user } = req.params;
    const { discipline, subject } = req.query;
    const data = {
      company: company,
      user: user,
    };

    if (!!discipline) {
      data.discipline = discipline;
    }

    if (!!subject) {
      data.subject = subject;
    }

    const flashcards = await Flashcard.find({ ...data })
      .populate('company')
      .populate('discipline')
      .populate('subject');
    return res.json(flashcards);
  }

  async indexAdm(req, res) {
    const { company } = req.params;

    const { discipline, subject } = req.query;
    const data = {
      company: company,
      adm: true,
    };

    if (!!discipline) {
      data.discipline = discipline;
    }

    if (!!subject) {
      data.subject = subject;
    }

    const flashcards = await Flashcard.find({ ...data })
      .populate('company')
      .populate('discipline')
      .populate('subject');
    return res.json(flashcards);
  }

  async store(req, res) {
    const { description, answer, user, company, adm, discipline, subject } = req.body;

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
      discipline,
      subject,
      company,
    });

    return res.json(flashcards);
  }

  async update(req, res) {
    const { description, answer, company, discipline, subject } = req.body;
    const { flashcards_id } = req.params;

    if (!flashcards_id || flashcards_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do flashcards' });
    }

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição do flashcards é obrigatória' });
    }
    if (!answer || answer === '') {
      return res.json({ success: false, errors: 'A resposta é obrigatória' });
    }

    const flashcard = await Flashcard.updateOne(
      { _id: flashcards_id },
      {
        description,
        answer,
        company,
        discipline,
        subject,
      }
    );

    return res.json();
  }

  async destroy(req, res) {
    const { flashcards_id } = req.params;

    if (!flashcards_id || flashcards_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do flashcards' });
    }

    const flashcard = await Flashcard.findByIdAndDelete({ _id: flashcards_id });

    if (!flashcard) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar o flashcards' });
    }
    return res.json({ message: 'Flashcard excluído com sucesso' });
  }
}

export default new FlashcardControllers();
