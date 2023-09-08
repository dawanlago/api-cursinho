import Discipline from '../../models/Discipline';

class DisciplineController {
  async index(req, res) {
    const { company } = req.params;

    const disciplines = await Discipline.find({ company }).sort('description').populate('company');

    return res.json(disciplines);
  }

  async store(req, res) {
    const { description, company } = req.body;

    const descriptionExist = await Discipline.findOne({ description, company });

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição da disciplina é obrigatório' });
    }

    if (!!descriptionExist) {
      return res.json({ success: false, errors: 'Já existe uma disciplina com essa descrição.' });
    }

    const discipline = await Discipline.create({
      description,
      company,
    });
    return res.json(discipline);
  }

  async update(req, res) {
    const { description, company } = req.body;
    const { discipline_id } = req.params;

    const descriptionExist = await Discipline.findOne({ description, company });

    if (!discipline_id || discipline_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da disciplina' });
    }

    if (!description || description === '') {
      return res.json({ success: false, errors: 'A descrição da disciplina é obrigatório' });
    }

    if (!!descriptionExist && descriptionExist._id != discipline_id && descriptionExist.company == company) {
      return res.json({ success: false, errors: 'Já existe uma disciplina com essa descrição.' });
    }

    const discipline = await Discipline.updateOne(
      { _id: discipline_id },
      {
        description,
        company,
      }
    );
    return res.json();
  }

  async destroy(req, res) {
    const { discipline_id } = req.params;
    const { company } = req.body;

    if (!discipline_id || discipline_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da disciplina' });
    }

    const discipline = await Discipline.findByIdAndDelete({ _id: discipline_id, company });

    if (!discipline) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar a disciplina' });
    }
    return res.json({ message: 'Disciplina excluída com sucesso' });
  }

  async read(req, res) {
    const { discipline_id, company } = req.params;

    const discipline = await Discipline.findById({ _id: discipline_id, company });
    return res.json(discipline);
  }
}

export default new DisciplineController();
