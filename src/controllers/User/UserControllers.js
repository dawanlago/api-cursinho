import User from '../../models/User';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const uuid = require('uuid');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dawanlago12@gmail.com', // your Gmail email
    pass: 'ttol mfsc kgce smxn',
  },
});

class UserController {
  async index(req, res) {
    const { company } = req.params;

    const users = await User.find({ company }, { password: 0 }).sort('name').populate('courses').populate('company');

    return res.json(users);
  }

  async store(req, res) {
    const { email, password, name, phone, cpf, admin, courses, company } = req.body;
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
    const verificationToken = uuid.v4();

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      cpf,
      admin,
      courses,
      verificationToken,
      active: false,
      company,
    });

    const mailOptions = {
      from: 'dawanlago12@gmail.com',
      to: email,
      subject: 'Confirme seu e-mail',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }

          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          h2 {
            color: #333;
          }

          p {
            color: #666;
          }

          .confirmation-link {
            display: block;
            margin-top: 20px;
            padding: 10px;
            background-color: #4caf50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Confirmação de Email</h2>
          <p>Olá,</p>
          <p>Obrigado por se cadastrar! Para completar o processo de registro, por favor, clique no link abaixo para confirmar seu endereço de e-mail:</p>
          <a href="https://portal-cursinho.netlify.app/#/login/${verificationToken}" class="confirmation-link">Confirmar Email</a>
          <p>Se você não se cadastrou no nosso serviço, por favor, ignore este e-mail.</p>
          <p>Atenciosamente,<br>GOAT Concursos</p>
        </div>
      </body>
      </html>`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ email: user.email, name: user.name, _id: user._id });
  }

  async update(req, res) {
    const { email, password, name, phone, cpf, admin, courses, company } = req.body;
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
        phone,
        cpf,
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
        return res.json({ success: false, errors: 'Não existe usuário criado com esse email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.json({ success: false, errors: 'Credenciais inválidas' });
      }

      if (!user.active) {
        const verificationToken = uuid.v4();
        await User.updateOne(
          { _id: user._id },
          {
            verificationToken,
          }
        );
        const mailOptions = {
          from: 'dawanlago12@gmail.com',
          to: email,
          subject: 'Confirme seu e-mail',
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmação de Email</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }

              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h2 {
                color: #333;
              }

              p {
                color: #666;
              }

              .confirmation-link {
                display: block;
                margin-top: 20px;
                padding: 10px;
                background-color: #4caf50;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Confirmação de Email</h2>
              <p>Olá,</p>
              <p>Obrigado por se cadastrar! Para completar o processo de registro, por favor, clique no link abaixo para confirmar seu endereço de e-mail:</p>
              <a href="https://portal-cursinho.netlify.app/#/login/${verificationToken}" class="confirmation-link">Confirmar Email</a>
              <p>Se você não se cadastrou no nosso serviço, por favor, ignore este e-mail.</p>
              <p>Atenciosamente,<br>GOAT Concursos</p>
            </div>
          </body>
          </html>`,
        };
        await transporter.sendMail(mailOptions);
        return res.json({ success: false, errors: 'Verifique seu email para ativar a sua conta' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, 'secretpassword', { expiresIn: '48h' });

      return res.json({ token: token, name: user.name, email: user.email });
    } catch {
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }

  async verify(req, res) {
    try {
      const { verifyToken } = req.params;

      const user = await User.findOne({ verificationToken: verifyToken });

      if (!user) {
        return res.json({ success: false, errors: 'Nenhum usuário encontrado' });
      }

      const userActive = await User.updateOne(
        { _id: user._id },
        {
          active: true,
        }
      );

      return res.json({ active: true });
    } catch {
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
}

export default new UserController();
