import Question from '../../models/Question';
import Timeline from '../../models/Timeline';

class TimelineController {
  async index(req, res) {
    const { company } = req.params;
    const { user } = req.query;

    const timeline = await Timeline.find({
      user: user,
      company: company,
    })
      .populate({
        path: 'days.subjects.discipline',
        model: 'Discipline',
      })
      .populate({
        path: 'days.subjects.subject',
        model: 'Subject',
      })
      .populate('company');

    return res.json(timeline);
  }

  async store(req, res) {
    const { user, days, company } = req.body;

    const timeline = await Timeline.create({
      user,
      days,
      company,
    });
    return res.json(timeline);
  }
}

export default new TimelineController();
