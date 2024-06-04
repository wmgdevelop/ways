# ways-generator

[![Test Status](https://github.com/wmgdevelop/ways/workflows/CI/badge.svg)](https://github.com/wmgdevelop/ways/actions)


O `ways-generator` é um pacote npm global que facilita a criação de arquivos e pastas baseados em templates. Este guia irá te ajudar a configurar e usar o `ways-generator` de forma simples e prática.

## Instalação

Para instalar o `ways-generator`, execute o seguinte comando no terminal:

```bash
npm install -g ways-generator
```

## Configuração Inicial

Após a instalação, você precisa criar um arquivo `.ways.json` na pasta home do seu sistema operacional. Esse arquivo configura o gerador e especifica o caminho das templates. Aqui estão exemplos de como encontrar a pasta home em diferentes sistemas operacionais:

- **Windows**: `C:\Users\<seu_usuário>`
- **Linux**: `/home/<seu_usuário>`
- **Mac**: `/Users/<seu_usuário>`

### Exemplo de `.ways.json`:

```json
{
  "templatesPath": "<caminho_para_sua_pasta_de_templates>"
}
```

Substitua `<caminho_para_sua_pasta_de_templates>` pelo caminho da pasta onde suas templates estão armazenadas.

### Estrutura das Templates

Dentro da pasta especificada em `templatesPath`, você pode criar subpastas. Cada subpasta representa uma template, e os arquivos dentro dessas subpastas serão gerados pelo `ways-generator` durante o build. 

As variáveis (options) podem ser usadas no caminho dos arquivos com o uso de colchetes. Exemplo:

```
<home do os>/my_templates/my_template/[myVariable]/[myOtherVariable].ts
```

No conteúdo dos arquivos, as variáveis são passadas entre dois underlines (`__`). Exemplo:

```typescript
class __MyEntity__ {
}
```

Se a variável iniciar com letra maiúscula, a inicial do valor da variável será maiúscula.

### Usando termos especiais

Você pode usar termos especiais como KebabCase, SnakeCase, CamelCase tanto no caminho quanto no conteúdo dos arquivos.

#### Exemplos em diferentes linguagens:

**Path:**

```plaintext
<home do os>/my_templates/my_template_flutter/repositories/[myVariableSnakeCase]-repository.dart
```

**Conteúdo:**

```typescript
import '../entities/__myVariableSnakeCase__-entity.dart';

class __MyVariableCamelCase__ {
  const __MyVariableCamelCase__();
}
```

```python
# Python
class __myVariableSnakeCase__:
    def __init__(self):
        pass
```

```csharp
// C#
public class __MyVariableCamelCase__ {
    public __MyVariableCamelCase__() { }
}
```

```cpp
// C++
class __MyVariableCamelCase__ {
public:
    __MyVariableCamelCase__() {}
};
```

```go
// Go
type __MyVariableCamelCase__ struct {}
```

```ruby
# Ruby
class __MyVariableCamelCase__
  def initialize
  end
end
```

```rust
// Rust
struct __MyVariableCamelCase__ {
}

impl __MyVariableCamelCase__ {
  fn new() -> Self {
    __MyVariableCamelCase__ {}
  }
}
```

## Utilizando as Templates

Depois de criar suas templates, você pode usá-las facilmente. 

### Passo 1: Inicializar o Projeto

Vá até a raiz do projeto onde deseja usar as templates ou crie uma nova pasta para seu projeto e acesse-a via terminal.

Digite:

```bash
ways init
```

Este comando cria um arquivo `ways.json` na pasta, onde você especificará as templates e variáveis a serem usadas.

### Estrutura do `ways.json`:

```json
[
  {
    "templates": [
      "hello"
    ],
    "options": [
      {
        "name": "world"
      }
    ]
  }
]
```

A template `hello` é uma template interna do pacote. Esta configuração inicial é apenas para mostrar a estrutura do arquivo.

### Configuração Personalizada:

Exemplo de configuração personalizada:

```json
[
  {
    "templates": [
      "myTemplateA",
      "myTemplateB",
      "myTemplateC"
    ],
    "options": [
      {
        "myVariableA": "myValueA",
        "myVariableB": "myValueB",
        "myVariableC": "myValueC"
      }
    ]
  },
  {
    "templates": [
      "myTemplateD",
      "myTemplateE",
      "myTemplateF"
    ],
    "options": [
      {
        "myVariableD": "myValueD",
        "myVariableE": "myValueE",
        "myVariableF": "myValueF"
      }
    ]
  }
]
```

### Passo 2: Buildar o Projeto

Após configurar o `ways.json`, rode o comando para buildar:

```bash
ways build
```

## Recapitulando:

1. Configure o `.ways.json` na home do usuário.
2. Crie as templates (uma vez criadas, podem ser usadas várias vezes).
3. Inicialize o projeto com `ways init`.
4. Configure o `ways.json` dentro do projeto.
5. Rode o comando `ways build`.

Nos próximos projetos, você só precisará realizar os passos 3, 4 e 5.

## Contribuição

Sinta-se à vontade para contribuir com o projeto conforme seu coração.

---

Esperamos que o `ways-generator` facilite o desenvolvimento dos seus projetos. Boas criações!
