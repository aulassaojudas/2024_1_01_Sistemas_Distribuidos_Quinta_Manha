const PerfilService = require("./perfil.service.js");
const perfilService = new PerfilService();

class PerfilController {
  getAllPerfils(req, res) {
    const perfils = perfilService.findAll();
    res.json(perfils);
  }

  getAllPerfilEnd(req, res) {
    const user_id = req.params.user_id;
    const perfils = perfilService.findAllEnd(user_id);
    res.json(perfils);
  }

  getOnePerfilEnd(req, res) {
    const { user_id, address_id } = req.params;
    const perfil = perfilService.findOneEnd(user_id, address_id);
    res.json(perfil);
  }

  createPerfil(req, res) {
    const {
      user_id,
      address_id,
      profile_endereco,
      profile_cidade,
      country_id,
    } = req.body;
    const perfil = perfilService.create(
      user_id,
      address_id,
      profile_endereco,
      profile_cidade,
      country_id
    );
    res.json(perfil);
  }
}

module.exports = PerfilController;
