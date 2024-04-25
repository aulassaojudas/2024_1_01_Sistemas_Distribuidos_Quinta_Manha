import { User } from './user.entity';
export declare class Filiacao {
    id_perfil: number;
    nome: string;
    endereco: string;
    cidade: string;
    bairro: string;
    uf: string;
    user: User;
}
