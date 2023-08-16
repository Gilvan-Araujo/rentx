# Cadastro de carro

**Requisitos Funcionais**

-   [x] Deve ser possível cadastrar um novo carro.

**Regras de negócio**

-   [x] Não deve ser possível cadastrar um carro com uma placa já existente.
-   [x] O carro deve ser cadastrado, por padrão, com disponibilidade.
-   [x] \*O usuário responsável pelo cadastro deve ser um usuário administrador.

# Listagem de carros

**Requisitos Funcionais**

-   [x] Deve ser possível listar todos os carros disponíveis.
-   [x] Deve ser possível listar todos os carros disponíveis pelo nome da categoria.
-   [x] Deve ser possível listar todos os carros disponíveis pelo nome da marca.
-   [x] Deve ser possível listar todos os carros disponíveis pelo nome do carro.

**Regras de negócio**

-   [ ] O usuário não precisa estar logado no sistema.

# Cadastro de especificação no carro

**Requisitos Funcionais**

-   [ ] Deve ser possível cadastrar uma especificação para um carro.

**Regras de negócio**

-   [ ] Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
-   [ ] Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
-   [ ] O usuário responsável pelo cadastro deve ser um usuário administrador.

# Cadastro de imagens do carro

**Requisitos Funcionais**

-   [ ] Deve ser possível cadastrar a imagem do carro.

**Requisitos não funcionais**

-   [ ] Utilizar o multer para upload dos arquivos.

**Regras de negócio**

-   [ ] O usuário deve poder cadastrar mais de uma imagem para o mesmo carro.
-   [ ] O usuário responsável pelo cadastro deve ser um usuário administrador.

# Aluguel de carro

**Requisitos Funcionais**

-   [ ] Deve ser possível cadastrar um aluguel.

**Regras de negócio**

-   [ ] O aluguel deve ter duração mínima de 24 horas.
-   [ ] Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
-   [ ] Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
