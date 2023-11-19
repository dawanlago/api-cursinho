import User from '../../models/User';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  async index(req, res) {
    const { company } = req.params;

    const users = await User.find({ company }, { password: 0 }).sort('name').populate('courses').populate('company');

    return res.json(users);
  }

  async store(req, res) {
    const { email, password, name, admin, courses, company } = req.body;
    const emailExist = await User.findOne({ email, company });

    if (!email || email === '') {
      return res.json({ success: false, errors: 'O email é obrigatório' });
    }
    if (!password || password === '') {
      return res.json({ success: false, errors: 'A senha é obrigatória' });
    }

    if (!!emailExist) {
      return res.json({ success: false, errors: 'Já existe uma conta cadastrada com esse email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      admin,
      courses,
      company,
    });

    return res.json({ email: user.email, name: user.email, _id: user._id });
  }

  async update(req, res) {
    const { email, password, name, admin, courses, company } = req.body;
    const { user_id } = req.params;

    const emailExist = await User.findOne({ email, company });

    if (!user_id || user_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do usuário' });
    }

    if (!email || email === '') {
      return res.json({ success: false, errors: 'O email é obrigatório' });
    }

    if (!password || password === '') {
      return res.json({ success: false, errors: 'A senha é obrigatória' });
    }

    if (!!emailExist && emailExist._id != user_id && emailExist.company == company) {
      return res.json({ success: false, errors: 'Já existe uma conta cadastrada com esse email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.updateOne(
      { _id: user_id },
      {
        email,
        password: hashedPassword,
        name,
        admin,
        courses,
        company,
      }
    );

    return res.json();
  }

  async destroy(req, res) {
    const { user_id } = req.params;
    const { company } = req.body;

    if (!user_id || user_id === '') {
      return res.json({ success: false, errors: 'Houve um erro com o código do usuário' });
    }

    const user = await User.findByIdAndDelete({ _id: user_id, company });

    if (!user) {
      return res.json({ success: false, errors: 'Houve um erro ao deletar o usuário' });
    }
    return res.json({ message: 'Usuário excluído com sucesso' });
  }

  async login(req, res) {
    try {
      const { email, password, company } = req.body;

      const user = await User.findOne({ email: email, company });

      if (!user) {
        return res.json({ sucess: false, erros: 'Credenciais inválidas' });
      }

      const isPasswordValid = bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.json({ sucess: false, erros: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, 'secretpassword', { expiresIn: '48h' });

      return res.json(token);
    } catch {
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
}

export default new UserController();
