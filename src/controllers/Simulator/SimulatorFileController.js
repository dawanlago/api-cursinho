import SimulatorFile from '../../models/SimulatorFile';

class SimulatorFileController {
  giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
  };

  async index(req, res) {
    const { company } = req.params;
    const { course } = req.query;

    const simulators = await SimulatorFile.find({ company, course }).populate('course').populate('company');
    return res.json(simulators);
  }

  async store(req, res) {
    const { title, content, course, company } = req.body;

    if (!title || title === '') {
      return res.json({ success: false, errors: 'Nenhum título foi informado' });
    }

    if ((!content || content === '') && type !== 'pdf') {
      return res.json({ success: false, errors: 'Nenhum conteúdo foi informado' });
    }

    const simulator = await SimulatorFile.create({
      title,
      content,
      course,
      company,
    });

    return res.json(simulator);
  }
}

export default new SimulatorFileController();
