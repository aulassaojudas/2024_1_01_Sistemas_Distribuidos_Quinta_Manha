const { v4: uudiv4 } = require("uuid");
const Perfil = require("./perfil.entity");
const PerfilDTO = require("./perfil.dto");

const perfils = [
  {
    user_id: "1",
    address_id: "1",
    profile_endereco: "rua sem nome",
    profile_cidade: "sao paulo",
    country_id: "br",
  },
  {
    user_id: "1",
    address_id: "2",
    profile_endereco: "rua manoel da silva",
    profile_cidade: "rio de janeiro",
    country_id: "br",
  },
  {
    user_id: "2",
    address_id: "1",
    profile_endereco: "rua leonel da silva ",
    profile_cidade: "belo horizonto",
    country_id: "br",
  },
];

class PerfilService {
  findAll() {
    return perfils.map((perfil) => new PerfilDTO(perfil));
  }

  findAllEnd(user_id) {
    return perfils.filter((perfil) => {
      console.log("user id " + user_id + " perfil.user_id " + perfil.user_id);
      return perfil.user_id === user_id;
    });
  }

  findOneEnd(user_id, address_id) {
    return perfils.filter(
      (perfil) => perfil.user_id === user_id && perfil.address_id === address_id
    );
  }

  create(user_id, address_id, profile_endereco, profile_cidade, country_id) {
    address_id = uudiv4();
    const newPerfil = new Perfil(
      user_id,
      address_id,
      profile_endereco,
      profile_cidade,
      country_id
    );
    perfils.push(newPerfil);
    return newPerfil; 
  }
}

module.exports = PerfilService;
