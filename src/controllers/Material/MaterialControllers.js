import Class from '../../models/Class';
import Material from '../../models/Material';

class MaterialController {
  giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
  };

  async index(req, res) {
    const { company } = req.params;
    const { week, day, course, discipline, subject } = req.query;

    const data = {
      company: company,
    };

    if (!!week) {
      data.week = week;
    }

    if (!!day) {
      data.day = day;
    }

    if (!!course) {
      data.course = course;
    }

    if (!!discipline) {
      data.discipline = discipline;
    }

    if (!!subject) {
      data.subject = subject;
    }

    const materials = await Material.find({ ...data })
      .populate('course')
      .populate('company');
    return res.json(materials);
  }

  async store(req, res) {
    const { title, type, content, course, week, day, company, discipline, subject } = req.body;

    if (!title || title === '') {
      return res.json({ success: false, errors: 'Nenhum título foi informado' });
    }

    if ((!content || content === '') && type !== 'pdf') {
      return res.json({ success: false, errors: 'Nenhum conteúdo foi informado' });
    }

    const material = await Material.create({
      title,
      type,
      content,
      course,
      week,
      day,
      discipline,
      subject,
      company,
    });

    return res.json(material);
  }

  async update(req, res) {
    const { title, type, content, course, week, day, company, discipline, subject } = req.body;
    const { material_id } = req.params;

    if (!title || title === '') {
      return res.json({ success: false, errors: 'Nenhum título foi informado' });
    }

    if ((!content || content === '') && type !== 'pdf') {
      return res.json({ success: false, errors: 'Nenhum conteúdo foi informado' });
    }

    const material = await Material.updateOne(
      { _id: material_id },
      {
        title,
        type,
        content,
        course,
        week,
        day,
        discipline,
        subject,
        company,
      }
    );

    return res.json();
  }

  async destroy(req, res) {
    const { material_id } = req.params;

    if (!material_id || material_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do material' });
    }

    const material = await Material.findByIdAndDelete({ _id: material_id });

    if (!material) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar o material' });
    }
    return res.json({ message: 'Material excluído com sucesso' });
  }

  async read(req, res) {
    const { class_id, company } = req.params;

    if (!class_id || class_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código da turma' });
    }

    const classReq = await Class.find({ _id: class_id, company });
    return res.json(classReq);
  }
}

export default new MaterialController();
