import Company from '../models/Company';

export async function companyExist(req, res, next) {
  const { company } = !!req.body.company ? req.body : req.params;

  if (!company) {
    return res.json({ success: false, errors: 'Nenhum dado da empresa foi enviado' });
  }

  try {
    await Company.findById(company);
    return next();
  } catch (error) {
    return res.json({ success: false, errors: 'Falha ao buscar a empresa' });
  }
}
