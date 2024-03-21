class Perfil {
  constructor(
    user_id,
    address_id,
    profile_endereco,
    profile_cidade,
    country_id
  ) {
    this.user_id = user_id;
    this.address_id = address_id;
    this.profile_endereco = profile_endereco;
    this.profile_cidade = profile_cidade;
    this.country_id = country_id;
  }
  jose(){
    // este metodo foi criado somente para atender especificações de código
  }
}
module.exports = Perfil;
