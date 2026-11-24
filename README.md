# StreamPlay — Projeto Final AV2

**Disciplina:** Banco de Dados
**Professor:** Brian Samuel

**Série:** 2ª Série EM TI
**Período:** 4º Bimestre / 2026

## 1. Projeto e objetivo

StreamPlay é uma plataforma fictícia de streaming e entretenimento, inspirada em
serviços de filmes, séries e músicas. O sistema organiza usuários e perfis,
catálogo de mídias, avaliações, favoritos, histórico de reprodução e gêneros.

O objetivo acadêmico é demonstrar modelagem documental, consultas, operações
CRUD e relatórios com Aggregation Pipeline em MongoDB.

## 2. Cenário de negócio

Usuários acessam um catálogo de filmes, séries e músicas, podem guardar
conteúdos nos favoritos, registrar o que assistiram ou ouviram e avaliar os
itens. A plataforma pode analisar as visualizações por gênero e as notas para
entender o que é mais popular e bem avaliado.

## 3. Tecnologias e execução

- MongoDB e JavaScript para MongoDB Shell (`mongosh`).
- Script: `ProjetoAV2_StreamingDB.mongodb.js`.
- Não há dependências externas.

No MongoDB Shell, conecte-se ao servidor e carregue o arquivo:

```javascript
load("ProjetoAV2_StreamingDB.mongodb.js")
```

No MongoDB Playground do VS Code, abra `ProjetoAV2_StreamingDB.mongodb.js`,
confirme a conexão e clique em **Run** (ícone de reprodução). O script seleciona
o banco `ProjetoAV2_StreamingDB`, cria as coleções se ainda não existirem e
popula dados fictícios. Para que uma nova execução não duplique os exemplos,
remove primeiro apenas documentos com os IDs de semente definidos pelo projeto;
não remove o banco nem documentos alheios a esses identificadores. As consultas
e agregações são executadas em sequência.

## 4. Coleções

### `Usuarios`

Armazena identificação, idade, e-mail, estado e perfil dos assinantes. `perfil`
é um documento incorporado. `favoritos` é um array de IDs de conteúdo e
`historico` é um array de documentos com conteúdo, data e progresso.

### `Catalogo`

Armazena filmes, séries, músicas e documentários, com título, tipo, gêneros,
visualizações e informações específicas. `detalhes` é um documento incorporado
com campos que variam conforme a mídia: filmes têm diretor, séries têm criador
e temporadas, e músicas têm artista e álbum. O campo `genero` é um array; os
documentos da coleção também variam em atributos como `temporadas` e `episodios`.

### `Avaliacoes`

Armazena o usuário que avaliou, o conteúdo, a nota, o comentário, o status e a
data. `conteudo` é um documento incorporado com o título e o tipo da mídia. A
avaliação com status `Removida` é excluída durante a execução do script.

## 5. Documentos incorporados, arrays e Schema-less

Um **documento incorporado** é um objeto guardado dentro de outro documento.
Em `Usuarios`, por exemplo, `perfil` mantém tipo de conta e preferências junto
ao usuário. No catálogo, `detalhes` reúne informações próprias de cada mídia.
Isso permite ler dados relacionados juntos.

Um **array** armazena vários valores em um único campo. O projeto usa arrays
para `favoritos`, `historico`, `genero` e `episodiosPorTemporada`. Os elementos
de `historico` também são documentos incorporados.

MongoDB não exige que todos os documentos de uma coleção tenham os mesmos
campos. Os usuários têm perfis diferentes, e cada tipo de mídia possui atributos
próprios, como `temporadas` para série e `artista` para música. Essa flexibilidade
é chamada de modelagem schema-less (sem esquema rígido obrigatório).

## 6. Povoamento e consultas

- `insertOne()` insere um documento; é usado para criar Ana.
- `insertMany()` insere vários documentos em lote; é usado para o catálogo,
  demais usuários e avaliações.
- `find()` pesquisa documentos. `$gt` seleciona conteúdos com `duracao` maior
  que 100; `$in` seleciona conteúdos que tenham um dos gêneros especificados.
- A projeção de `find()` lista somente os campos desejados. `_id: 0` oculta o
  identificador padrão na saída.

## 7. Operações CRUD

- `updateOne()` com `$set` altera o tipo de perfil de Ana sem substituir o
  documento incorporado inteiro.
- `updateMany()` com `$set` marca como recomendados os conteúdos com mais de
  1.000 visualizações.
- `updateOne()` com `$push` inclui um novo favorito sem substituir os anteriores.
- `deleteOne()` remove somente a avaliação identificada pelo `_id` e pelo status
  `Removida`. O filtro não é vazio.

## 8. Aggregation Pipelines

### Pipeline 1 — visualizações por gênero

Na coleção `Catalogo`, `$match` considera conteúdos ativos com contagem válida e
um array de gêneros. `$unwind` separa os gêneros do array para que cada gênero
possa ser contabilizado. `$group` e `$sum` somam visualizações por gênero;
`$sort` ordena do maior para o menor e `$project` entrega `genero` e
`totalVisualizacoes`, sem `_id`.

### Pipeline 2 — relatório de avaliações

Na coleção `Avaliacoes`, `$match` mantém avaliações publicadas com notas de 1 a
5. `$group` calcula a média e a quantidade por conteúdo. `$lookup` consulta o
título no `Catalogo`; `$project` apresenta `nomeConteudo`, `mediaAvaliacoes` e
`totalAvaliacoes`, sem `_id`. A ordenação facilita identificar os itens mais
bem avaliados.

## 9. Por que MongoDB em vez de SQL relacional?

- **Flexibilidade de esquema:** filmes, séries e músicas podem ter atributos
  diferentes sem exigir que cada documento carregue colunas vazias nem que uma
  mudança dependa de alterar uma tabela rígida.
- **Documentos incorporados:** dados relacionados, como preferências e detalhes
  técnicos, podem ser lidos junto ao documento principal.
- **Arrays naturais:** favoritos, gêneros, tags e históricos podem ser
  representados diretamente, sem tabelas auxiliares para cada lista simples.
- **Escalabilidade horizontal:** MongoDB suporta distribuição de dados entre
  servidores (sharding), permitindo ampliar capacidade conforme a demanda.
- **Adequação ao streaming:** catálogos, perfis, reproduções e avaliações podem
  gerar grande volume e variedade de dados; documentos flexíveis e recursos de
  distribuição ajudam a evoluir o sistema. A escolha de modelagem e índices
  ainda deve considerar os padrões reais de consulta e crescimento.

## 10. Guia simples para apresentação

### Conceitos para explicar

- **Usuarios:** perfis, favoritos e histórico.
- **Catalogo:** filmes, séries, músicas e documentários com seus gêneros e detalhes.
- **Avaliacoes:** notas e comentários dos usuários sobre conteúdos.
- **Documento incorporado:** objeto dentro de outro documento, como o campo
  `perfil` do usuário.
- **Array:** lista de valores ou objetos, como a lista `favoritos`.
- **Inserções:** `insertOne()` inclui um registro; `insertMany()` inclui vários
  de uma vez.
- **Consultas:** `find()` localiza documentos. `$gt` significa “maior que”;
  `$in` verifica se um campo corresponde a algum item de uma lista. Projeção
  escolhe os campos de saída; `_id: 0` esconde o identificador.
- **Atualizações e remoção:** `$set` altera campos; `$push` acrescenta um
  elemento ao fim de um array; `deleteOne()` remove um registro que satisfaça
  seu filtro.
- **Agregação:** o primeiro pipeline totaliza visualizações por gênero; o
  segundo calcula média e quantidade de avaliações por conteúdo e busca seu
  título no catálogo.

### Roteiro de apresentação prática

1. Abra `ProjetoAV2_StreamingDB.mongodb.js` no MongoDB Shell ou na extensão do
   VS Code e execute o script.
2. Mostre `db.Usuarios.find()` e explique o perfil incorporado e os arrays de
   favoritos e histórico de Ana.
3. Mostre os documentos de `Catalogo` e compare os detalhes técnicos de um
   filme, uma série e uma música.
4. Explique as consultas `$gt`, `$in` e a projeção no script.
5. Aponte os comandos `$set`, `$push` e `deleteOne()` e explique que a remoção
   tem um filtro específico.
6. Apresente os resultados finais dos dois `aggregate()` e destaque o gênero
   com mais visualizações e os conteúdos com melhores médias.

## 11. Checklist dos requisitos

- [x] Banco `ProjetoAV2_StreamingDB` e coleções `Usuarios`, `Catalogo` e `Avaliacoes`.
- [x] Mais de 8 documentos fictícios distribuídos pelas coleções.
- [x] Uso de `insertOne()` e `insertMany()`.
- [x] Documentos incorporados, arrays e documentos com estruturas diferentes.
- [x] Tipos String, Number, Boolean, Array, Object e Date.
- [x] Consultas comentadas com `$gt`, `$in` e projeção `_id: 0`.
- [x] `updateOne()` com `$set`, `updateMany()` com `$set` e `updateOne()` com `$push`.
- [x] Exclusão com filtro específico e não vazio.
- [x] Pipeline gerencial com `$match`, `$group`, `$sum` e ordenação decrescente.
- [x] Pipeline formatado com avaliações publicadas, `$group`, `$project` amigável e `_id: 0`.
- [x] Cabeçalho, identificação da disciplina/professor e separação das quatro etapas.
- [x] Guia de conceitos e roteiro de apresentação prática.
