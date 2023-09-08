import Subject from '../../models/Subject';

class SubjectController {
  async index(req, res) {
    const { company } = req.params;

    const subjects = await Subject.find({ company }).sort('description').populate('disciplines').populate('company');
    return res.json(subjects);
  }

  async store(req, res) {
    const { description, disciplines, company } = req.body;
    const descriptionExist = await Subject.findOne({ description, company });

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição do assunto é obrigatório' });
    }

    /*     if (!discipline || discipline === '') {
                                          return res.json({ success: false, errors: 'A disciplina é obrigatória' });
                                        } */

    if (!!descriptionExist) {
      return res.json({ success: false, errors: 'Já existe um assunto com essa descrição.' });
    }

    const subject = await Subject.create({
      description,
      disciplines,
      company,
    });
    return res.json(subject);
  }

  async update(req, res) {
    const { description, disciplines, company } = req.body;
    const { subject_id } = req.params;

    const descriptionExist = await Subject.find({ description, company });

    if (!subject_id || subject_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do assunto' });
    }

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição do assunto é obrigatório' });
    }

    /* if (!discipline || discipline === '') {
                              return res.json({ success: false, errors: 'A disciplina é obrigatória' });
                            } */

    if (!!descriptionExist && descriptionExist._id != subject_id && descriptionExist.company == company) {
      return res.json({ success: false, errors: 'Já existe um assunto com essa descrição.' });
    }

    const subject = await Subject.updateOne(
      { _id: subject_id },
      {
        description,
        disciplines,
        company,
      }
    );

    return res.json();
  }

  async destroy(req, res) {
    const { subject_id } = req.params;
    const { company } = req.body;

    if (!subject_id || subject_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do assunto' });
    }

    const subject = await Subject.findByIdAndDelete({ _id: subject_id, company });

    if (!subject) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar o assunto' });
    }
    return res.json({ message: 'Assunto excluído com sucesso' });
  }

  async read(req, res) {
    const { subject_id, company } = req.params;

    if (!subject_id || subject_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do assunto' });
    }

    const subject = await Subject.find({ _id: subject_id, company });
    return res.json(classReq);
  }
}

export default new SubjectController();
