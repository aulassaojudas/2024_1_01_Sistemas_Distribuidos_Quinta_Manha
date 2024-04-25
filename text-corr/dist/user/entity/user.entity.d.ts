import { Filiacao } from './filiacao.entity';
export declare class User {
    id_user: number;
    nome: string;
    email: string;
    senha: string;
    filiacoes: Filiacao[];
}
