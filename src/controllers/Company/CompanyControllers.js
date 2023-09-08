import Company from '../../models/Company';

class CompanyController {
  async getCompany(id_company) {
    try {
      //const company = await Company.findById(id_company);
      return;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new CompanyController();
