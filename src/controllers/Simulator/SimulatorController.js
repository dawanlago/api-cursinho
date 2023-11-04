import Question from '../../models/Question';
import SimulatorAnswered from '../../models/SimulatorAnswered';

class SimulatorController {
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
    const { questions, time, company } = req.body;

    const simulator = await SimulatorAnswered.create({
      questions,
      time,
      company,
    });
    return res.json(simulator);
  }
}

export default new SimulatorController();
