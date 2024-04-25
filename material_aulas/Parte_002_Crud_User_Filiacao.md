# Criando uma aplicação com nestjs
---
# Criando o service e contoller para user

No desenvolvimento de software, em particular em desenvolvimento de APIs, os termos "services" e "controllers" referem-se a componentes específicos que têm papéis bem definidos na organização e na lógica do código.

### Controller

**Uso e Objetivos:**
- **Controladores de Fluxo de Dados:** Controllers são responsáveis por manipular as interações entre o usuário e o modelo de dados que representa a lógica de negócio da aplicação (services). Eles agem como intermediários, recebendo solicitações do usuário (por meiro do protocolo http/https), processando essas solicitações e retornando a resposta adequada ao usuário.
- **Desacoplamento da Lógica de Negócios:** Por não incluírem diretamente lógica de negócios, mas sim chamarem serviços que a executem, os controllers ajudam a manter o código mais limpo e modular.

### Services

**Uso e Objetivos:**
- **Encapsulamento da Lógica de Negócios:** Services são usados para encapsular a lógica de negócios da aplicação, o que significa que eles definem funções e métodos que executam operações específicas do domínio da aplicação, como calcular o pagamento de um funcionário, verificar a disponibilidade de um produto, entre outras possíveis regras.
- **Reutilização:** A lógica dentro dos serviços pode ser reutilizada por diferentes partes da aplicação (por múltiplos controllers, por exemplo), o que reduz a duplicidade de código e facilita manutenção e testes.
- **Abstração:** Services frequentemente interagem com a camada de acesso a dados (repositories), abstraindo as complexidades das operações de banco de dados dos controllers.

---
Execute o comando `nest g service user/service/user --flat` que gera um arquivo denominado `user.service.ts`

Vamos alterar o arquivo `user.service.ts` inserindo o conteúdo descrito a seguir para compreender melhor a estrutura de seu construtor. O `constructor` é um método especial chamado sempre que um novo objeto desta classe é criado. Nele, será injetada a dependência do repositório associado à entidade `User`, facilitando a gestão de dados relacionados a esta entidade.

O decorador `@InjectRepository` é utilizado para injetar um repositório TypeORM específico para a entidade `User` na classe onde é declarado. Este decorador simplifica a complexidade de criar e gerenciar o repositório manualmente, já que o NestJS se encarrega de fornecer a instância correta do repositório no momento da execução.

- **`User`**: O uso do argumento `User` dentro de `@InjectRepository` especifica que o repositório a ser injetado está vinculado à entidade `User`, facilitando as operações diretas com os dados dessa entidade.

- **`private userRepository: Repository<User>`**: Esta linha declara uma variável chamada `userRepository` dentro da classe. Ela é marcada como `private`, indicando que seu acesso é restrito ao escopo da classe que a declara. O tipo `Repository<User>` representa uma abstração fornecida pelo TypeORM, que disponibiliza uma API para executar operações CRUD na tabela de usuários no banco de dados.

Tal configuração de visibilidade como `private` é uma prática comum em programação orientada a objetos, especialmente em contextos de injeção de dependência. Isso garante que a dependência (neste caso, o repositório) seja encapsulada dentro da classe, protegendo-a de acessos indevidos e mantendo a integridade do design da aplicação.

Descrições dos métodos necessários:

### Método `findAll()`
- Este método assíncrono recupera todos os usuários do banco de dados, incluindo suas relações com a entidade `Filiacao`. Ele utiliza o repositório `userRepository` para executar uma busca que automaticamente inclui as entidades relacionadas especificadas.

### Método `findOne(id: number)`
- Retorna um único usuário baseado no seu identificador único (`id_user`). O método consulta o banco de dados incluindo as entidades relacionadas `Filiacao` para fornecer uma visão completa do usuário.

### Método `create(createUserDto: CreateUserDto)`
- Cria um novo usuário no banco de dados utilizando a entidade `User` fornecida. Este método salva os dados do usuário e retorna o usuário criado com seu ID recém-atribuído e outras propriedades.

### Método `update(id: number, updateUserDto: UpdateUserDto)`
- Atualiza os dados de um usuário existente identificado pelo `id`. Este método primeiramente aplica as alterações no banco de dados e, em seguida, recupera o usuário atualizado para garantir que as mudanças foram aplicadas.

### Método `delete(id: number)`
- Remove um usuário do banco de dados com base em seu `id`. Este método é direto e efetivamente apaga o registro do usuário, garantindo que todas as suas informações sejam eliminadas.


```typescript 

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['filiacoes'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
      relations: ['filiacoes'],
    });

    if (!user) {
      throw new HttpException(`Usuário não encontrado.`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(
        this.userRepository.create(createUserDto),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Email já registrado.', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Erro ao criar o registro. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const result = await this.userRepository.update(id, updateUserDto);
    if (result.affected === 0) {
      throw new HttpException(`Usuário não encontrado.`, HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(`Usuário não encontrado.`, HttpStatus.NOT_FOUND);
    }
  }
}

```
Execute o comando `nest g controller user/controller/user --flat` que gera um arquivo denominado `user.controller.ts`

Descrições dos métodos necessários:

**`@Controller('user')`**: Define a rota base para todos os endpoints relacionados aos usuários.
**`@Get()`**: Decorador que mapeia requisições GET para o método `findAll()`, que retorna todos os usuários cadastrados.
**`@Get(':id')`**: Mapeia requisições GET, o `:id` é um parâmetro de rota passado para o método `findOne(id)`.
**`@Post()`**: Mapeia requisições POST para o método `create()`, que é usado para criar um novo usuário. O decorador `@Body()` extrai o corpo da requisição HTTP e o passa como um objeto `User`.
**`@Put(':id')`**: Mapeia requisições PUT para atualizar um usuário existente. O `@Param('id')` captura o ID do usuário a ser atualizado, enquanto `@Body()` fornece os dados para atualização.
**`@Delete(':id')`**: Mapeia requisições DELETE para excluir um usuário especificado pelo ID.
Este é o código completo para o controller

```typescript

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}


```
---
# Habilitando as validações no NestJs

No NestJS, para que as validações de DTOs funcionem corretamente, é necessário que o `ValidationPipe` esteja configurado para tratar as requisições de entrada. Este `pipe` é responsável por executar as validações definidas nos DTOs e por lançar exceções quando os dados de entrada não atendem aos critérios estabelecidos.

No arquivo principal de sua aplicação (`main.ts`), adicione o seguinte código para aplicar o `ValidationPipe` a todas as requisições:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new HttpException(
          {
            message: 'Entrada de dados invalida',
            errors: errors,
          },
          HttpStatus.BAD_REQUEST,
        ),
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

Este código configura o `ValidationPipe` para:
- **whitelist**: Automaticamente remover dados de requisição que não têm decoradores explícitos no DTO.
- **forbidNonWhitelisted**: Lançar um erro quando forem recebidos dados extras não permitidos.
- **transform**: Transformar os objetos de entrada para o tipo de objeto de seus respectivos DTOs.
- **exceptionFactory**: Personalizar a resposta de erro para incluir detalhes sobre os erros de validação.

---
# Execução do Projeto

1. **Iniciar o Projeto**:
   - No prompt de comando (CMD) Execute o comando `npm run start:dev` para iniciar o servidor em modo de desenvolvimento.

### Testes com Thunder Client

O Thunder Client é uma extensão do Visual Studio Code usada para testar APIs RESTful.

2. **Configurar o Thunder Client**:
   - Abra o Visual Studio Code.
   - Se ainda não tiver instalado, vá até a aba de extensões e procure por "Thunder Client". Instale a extensão e reinicie o vscode.
   - Após a instalação, clique no ícone do Thunder Client na barra lateral para abrir a interface.

3. **Criar uma Nova Coleção de Testes**:
   - No Thunder Client, crie uma nova coleção para organizar seus testes. Você pode nomear a coleção com o nome do seu projeto ou API.
   - Vamos testar os seguintes endpoints:
   
   - `GET /user`: Retorna uma lista de todos os usuários.
   - `GET /user/:id`: Retorna um usuário específico pelo ID.
   - `POST /user`: Cria um novo usuário.
   - `PUT /user/:id`: Atualiza um usuário existente pelo ID.
   - `DELETE /user/:id`: Deleta um usuário pelo ID.

4. **Configurar e Executar os Testes**:

#### POST /user
   - Mude o método para "POST".
   - Use a URL `http://localhost:3000/user`.
   - Na aba "Body", escolha "JSON" e insira os dados do usuário a ser criado, como 
   `{"nome": "José Carmino", "email": "jose.carmino@exemplo.com"}`.
   - Clique em "Send".
   
#### GET /user
   - Clique no botão "New Request".
   - Selecione o método "GET".
   - Insira a URL `http://localhost:3000/user`.
   - Clique em "Send" para executar a requisição.

#### GET /user/:id
   - Repita os passos acima, mas altere a URL para incluir um ID específico `http://localhost:3000/user/1`.

#### PUT /user/:id
   - Defina o método para "PUT".
   - Insira a URL `http://localhost:3000/user/1`.
   - No "Body", `{"nome": "José Carmino Gomes Jr.", "email": "jose.carmino@exemplo.com"}`.
   - Envie a requisição.

#### DELETE /user/:id
   - Insira a URL `http://localhost:3000/user/1`.
   - Clique em "Send" para deletar o usuário.
---

# Implementando criptografia na senha

Em aplicações web, a segurança dos dados do usuário é crucial, em particular quando se trata de informações sensíveis como senhas. Uma prática comum e essencial é a criptografia de senhas antes de armazená-las em um banco de dados. Isso ajuda a proteger as informações do usuário contra vazamentos de dados e ataques de hackers.


### Implementação Atual do Método Create

Suponha que temos um método `create` básico em nosso serviço `UserService` que simplesmente salva um novo usuário no banco de dados sem criptografar a senha. O método esta assim: 

```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(
        this.userRepository.create(createUserDto),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Email já registrado.', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Erro ao criar o registro. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
```

### Refatorando para Incluir Criptografia de Senha

Na configuração de aplicação foi instalado a biblioteca `bcryptjs`, que vamos utilizar agora. Importe a biblioteca no topo do código como dado abaixo.

```typescript
import * as bcrypt from 'bcryptjs';
```
Agora vamos refatorar o método create, inserindo as linhas: 

```typescript
const saltOrRounds = 10; // o custo do processamento, 10 é geralmente suficiente
const hash = await bcrypt.hash(createUserDto.senha, saltOrRounds);
createUserDto.senha = hash; // substitui a senha original pelo hash
```
O código ficará então desta forma. 

```typescript
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const saltOrRounds = 10; // o custo do processamento, 10 é geralmente suficiente
      const hash = await bcrypt.hash(createUserDto.senha, saltOrRounds);
      createUserDto.senha = hash; // substitui a senha original pelo hash

      return await this.userRepository.save(
        this.userRepository.create(createUserDto),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Email já registrado.', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Erro ao criar o registro. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
```
