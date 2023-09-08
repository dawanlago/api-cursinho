import Settings from '../../models/Settings';

class SettingsController {
  async store(req, res) {
    const { finance, geral } = req.body;

    const settings = await Settings.create({
      finance,
      geral,
    });

    return res.json(settings);
  }

  /* async update(req, res) {
                  const { description, price, time } = req.body;
                  const descriptionExist = await Service.findOne({ description });
                  const { service_id } = req.params;

                  if (!description || description === '') {
                    return res.json({ success: false, errors: 'A descrição é obrigatória' });
                  }

                  if (!price || price === '') {
                    return res.json({ success: false, errors: 'O valor é obrigatório' });
                  }

                  if (price <= 0) {
                    return res.json({ success: false, errors: 'O valor deve ser maior que 0' });
                  }

                  if (!time || time === '') {
                    return res.json({ success: false, errors: 'O tempo é obrigatório' });
                  }

                  if (!!descriptionExist && descriptionExist._id != service_id) {
                    return res.json({ success: false, errors: 'Já existe um serviço cadastrado com esse nome' });
                  }

                  const service = await Service.updateOne(
                    { _id: service_id },
                    {
                      description,
                      price,
                      time,
                    }
                  );

                  return res.json();
                } */

  async read(req, res) {
    const settings = await Settings.findOne();
    return res.json(settings);
  }
}

export default new SettingsController();
