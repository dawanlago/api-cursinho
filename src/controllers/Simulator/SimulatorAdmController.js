import Question from '../../models/Question';
import SimulatorAnswered from '../../models/SimulatorAnswered';
import Simulator from '../../models/Simulator';

class SimulatorAdmController {
  async index(req, res) {
    const { company } = req.params;
    const { pQuestions, pModality } = req.query;

    let search = [];
    const getRandomElementsFromArray = (array, numElements) => {
      if (array.length <= numElements) return array;

      // Crie uma cópia do array original para não modificá-lo
      const newArray = array.slice();

      // Array para armazenar os elementos selecionados aleatoriamente
      const selectedElements = [];

      for (let i = 0; i < numElements; i++) {
        // Gere um índice aleatório dentro do tamanho do newArray
        const randomIndex = Math.floor(Math.random() * newArray.length);

        // Adicione o elemento correspondente ao índice aleatório ao array de elementos selecionados
        selectedElements.push(newArray[randomIndex]);

        // Remova o elemento selecionado do newArray para que ele não seja selecionado novamente
        newArray.splice(randomIndex, 1);
      }

      return selectedElements;
    };

    pQuestions.forEach((item) => {
      search.push({
        discipline: item.discipline.id,
        subject: item.subject.id,
        quantity: item.quantity,
      });
    });

    const questions = [];
    await Promise.all(
      search.map(async (item) => {
        const q = await Question.find({ company: company, discipline: item.discipline, subject: item.subject, modality: pModality })
          .populate('discipline')
          .populate('subject');
        if (q.length > 0) {
          const qOficial = getRandomElementsFromArray(q, item.quantity);
          qOficial.forEach((question) => {
            questions.push(question);
          });
        }
      })
    );

    return res.json(questions);
  }

  async store(req, res) {
    const { course, title, questions, time, startDate, endDate, modality, company, publish, user } = req.body;

    const simulator = await Simulator.create({
      course,
      title,
      questions,
      time,
      startDate,
      endDate,
      user,
      modality,
      publish,
      company,
    });
    return res.json(simulator);
  }

  async update(req, res) {
    const { course, title, questions, time, startDate, endDate, modality, company, publish, user } = req.body;
    const { simulator_id } = req.params;
    const simulator = await Simulator.updateOne(
      { _id: simulator_id },
      {
        course,
        title,
        questions,
        time,
        startDate,
        endDate,
        user,
        modality,
        publish,
        company,
      }
    );
    return res.json();
  }

  async listSimulators(req, res) {
    const { company, course } = req.params;
    const simulators = await Simulator.find({ company, course }).sort({ createdAt: -1 }).populate('company');
    return res.json(simulators);
  }

  async listSimulatorsForStudent(req, res) {
    const { company } = req.params;
    const { course } = req.query;
    const simulators = await Simulator.find({ company, course }).sort({ createdAt: -1 }).populate('company');
    return res.json(simulators);
  }

  async destroy(req, res) {
    const { simulator_id } = req.params;

    if (!simulator_id || simulator_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do simulado' });
    }

    const simulado = await Simulator.findByIdAndDelete({ _id: simulator_id });

    if (!simulado) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar o simulado' });
    }
    return res.json({ message: 'Simulado excluído com sucesso' });
  }
}

export default new SimulatorAdmController();
