import Timeline from '../../models/Timeline';

class TimelineController {
  async index(req, res) {
    const { company } = req.params;
    const { user } = req.query;

    const timeline = await Timeline.findOne({
      user: user,
    }).populate('company');
    return res.json(timeline);
  }

  async store(req, res) {
    const { user, days, company } = req.body;

    await Timeline.findByIdAndDelete({ user: user, company });

    const timeline = await Timeline.create({
      user,
      days,
      company,
    });
    return res.json(timeline);
  }
}

export default new TimelineController();
