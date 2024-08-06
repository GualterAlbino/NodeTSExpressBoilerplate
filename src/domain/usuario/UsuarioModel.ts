import DomainModel from "../DomainModel";

export default class UsuarioModel extends DomainModel {
  id: number;
  nome: string;
  email: string;
  senha: string;
  nivel: number;

  constructor(
    pId: number,
    pNome: string,
    pEmail: string,
    pSenha: string,
    pNivel: number,
  ) {
    super();
    this.id = pId;
    this.nome = pNome;
    this.email = pEmail;
    this.senha = pSenha;
    this.nivel = pNivel;
  }
}
