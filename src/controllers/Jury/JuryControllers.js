import Jury from '../../models/Jury';

class JuryController {
  async index(req, res) {
    const { company } = req.params;

    const juries = await Jury.find({ company }).sort('description').populate('company');

    return res.json(juries);
  }

  async store(req, res) {
    const { description, company } = req.body;

    const descriptionExist = await Jury.findOne({ description, company });

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição da banca é obrigatório' });
    }

    if (!!descriptionExist) {
      return res.json({ success: false, errors: 'Já existe uma banca com essa descrição.' });
    }

    const jury = await Jury.create({
      description,
      company,
    });
    return res.json(jury);
  }

  async update(req, res) {
    const { description, company } = req.body;
    const { jury_id } = req.params;

    const descriptionExist = await Jury.findOne({ description, company });

    if (!jury_id || jury_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da banca' });
    }

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição da banca é obrigatório' });
    }

    if (!!descriptionExist && descriptionExist._id != jury_id && descriptionExist.company == company) {
      return res.json({ success: false, errors: 'Já existe uma banca com essa descrição.' });
    }

    const jury = await Jury.updateOne(
      { _id: jury_id },
      {
        description,
        company,
      }
    );
    return res.json();
  }

  async destroy(req, res) {
    const { jury_id } = req.params;
    const { company } = req.body;

    if (!jury_id || jury_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da banca' });
    }

    const jury = await Jury.findByIdAndDelete({ _id: jury_id, company });

    if (!jury) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar a banca' });
    }
    return res.json({ message: 'Banca excluída com sucesso' });
  }

  async read(req, res) {
    const { jury_id, company } = req.params;

    const jury = await Jury.findById({ _id: jury_id, company });
    return res.json(jury);
  }
}

export default new JuryController();
