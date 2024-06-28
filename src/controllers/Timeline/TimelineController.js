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
    try {
      const { user, days, company } = req.body;

      if (!user || !days || !company) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await Timeline.findOneAndDelete({ user });

      const timeline = await Timeline.create({
        user,
        days,
        company,
      });

      return res.json(timeline);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new TimelineController();
