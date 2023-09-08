import Class from '../../models/Class';
import Material from '../../models/Material';
let multer = require('multer');
let upload = multer({ dest: './uploads/' });

class MaterialController {
  giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
  };

  async index(req, res) {
    const { company, week, day, course } = req.params;
    const materials = await Material.find({ company, course, week, day }).populate('course').populate('company');
    return res.json(materials);
  }

  async store(req, res) {
    const { title, type, content, course, week, day, company } = req.body;

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
      company,
    });

    return res.json(material);
  }

  async update(req, res) {
    const { title, type, content, course, week, day, company } = req.body;
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
