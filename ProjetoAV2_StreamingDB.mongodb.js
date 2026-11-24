// ============================================================
// PROJETO FINAL AV2 — BANCO DE DADOS NoSQL
// Projeto: StreamPlay
// Cenário: Plataforma de Streaming e Entretenimento
// Professor: Brian Samuel
// Disciplina: Banco de Dados
// Série: 2ª Série EM TI
// Período: 4º Bimestre / 2026
// Tecnologia: MongoDB
//
// O MongoDB permite documentos flexíveis, arrays e objetos incorporados,
// facilitando o armazenamento de diferentes mídias, usuários e históricos.
// A escalabilidade horizontal permite ampliar a capacidade conforme o
// crescimento da plataforma.
// ============================================================

use("ProjetoAV2_StreamingDB");
var streamPlayDB = db;

// Cria as coleções somente quando elas ainda não existem.
var colecoesExistentes = streamPlayDB.getCollectionNames();
["Usuarios", "Catalogo", "Avaliacoes"].forEach(function (nomeColecao) {
    if (colecoesExistentes.indexOf(nomeColecao) === -1) {
        streamPlayDB.createCollection(nomeColecao);
    }
});

// Ao reexecutar, remove somente os documentos de exemplo deste projeto.
// Os filtros por IDs evitam apagar documentos que não pertencem à atividade.
streamPlayDB.Usuarios.deleteMany({ _id: { $in: [1, 2, 3] } });
streamPlayDB.Catalogo.deleteMany({ _id: { $in: [101, 102, 103, 104, 105] } });
streamPlayDB.Avaliacoes.deleteMany({ _id: { $in: [201, 202, 203, 204] } });

// ============================================================
// ETAPA 1 — ARQUITETURA, MODELAGEM E POVOAMENTO
// ============================================================

// Insere um usuário com documentos incorporados e arrays.
streamPlayDB.Usuarios.insertOne({
    _id: 1,
    nome: "Ana Silva",
    email: "ana@email.com",
    idade: 20,
    ativo: true,
    perfil: {
        tipo: "Premium",
        idioma: "Português",
        qualidade: "4K"
    },
    favoritos: [101, 102],
    historico: [
        {
            conteudoId: 101,
            data: new Date("2026-11-20T12:00:00Z"),
            progresso: 100
        },
        {
            conteudoId: 102,
            data: new Date("2026-11-21T12:00:00Z"),
            progresso: 65
        }
    ]
});

// Insere vários usuários. Os documentos têm atributos diferentes,
// demonstrando a flexibilidade de esquema na mesma coleção.
streamPlayDB.Usuarios.insertMany([
    {
        _id: 2,
        nome: "Carlos Souza",
        email: "carlos@email.com",
        idade: 25,
        ativo: true,
        perfil: {
            tipo: "Básico",
            idioma: "Português"
        },
        favoritos: [103],
        historico: []
    },
    {
        _id: 3,
        nome: "Mariana Costa",
        email: "mariana@email.com",
        idade: 18,
        ativo: true,
        perfil: {
            tipo: "Premium",
            idioma: "Inglês",
            qualidade: "HD"
        },
        favoritos: [101, 104],
        historico: [],
        planoEstudantil: true
    }
]);

// Insere filmes, séries, músicas e documentário. Os tipos de mídia têm
// atributos diferentes dentro da mesma coleção (modelagem schema-less).
streamPlayDB.Catalogo.insertMany([
    {
        _id: 101,
        titulo: "Aventura Espacial",
        tipo: "Filme",
        genero: ["Ação", "Ficção"],
        ano: 2024,
        duracao: 120,
        visualizacoes: 1500,
        ativo: true,
        detalhes: {
            diretor: "Lucas Mendes",
            classificacao: "12 anos"
        }
    },
    {
        _id: 102,
        titulo: "Mistérios da Cidade",
        tipo: "Série",
        genero: ["Drama", "Suspense"],
        ano: 2023,
        temporadas: 3,
        episodios: 24,
        visualizacoes: 2300,
        ativo: true,
        detalhes: {
            criador: "Pedro Alves",
            episodiosPorTemporada: [8, 8, 8]
        }
    },
    {
        _id: 103,
        titulo: "No Ritmo da Música",
        tipo: "Música",
        genero: ["Pop"],
        ano: 2025,
        duracao: 4,
        visualizacoes: 3200,
        ativo: true,
        detalhes: {
            artista: "Banda Horizonte",
            album: "Novos Caminhos"
        }
    },
    {
        _id: 104,
        titulo: "Risos e Aventuras",
        tipo: "Filme",
        genero: ["Comédia", "Aventura"],
        ano: 2022,
        duracao: 95,
        visualizacoes: 900,
        ativo: true,
        detalhes: {
            diretor: "Fernanda Lima",
            classificacao: "Livre"
        }
    },
    {
        _id: 105,
        titulo: "Planeta Azul",
        tipo: "Documentário",
        genero: ["Documentário", "Natureza"],
        ano: 2021,
        duracao: 60,
        visualizacoes: 700,
        ativo: true,
        detalhes: {
            narrador: "Marcos Oliveira",
            resolucao: "4K"
        }
    }
]);

// Insere avaliações com um objeto de conteúdo incorporado e status.
streamPlayDB.Avaliacoes.insertMany([
    {
        _id: 201,
        usuarioId: 1,
        conteudoId: 101,
        conteudo: { titulo: "Aventura Espacial", tipo: "Filme" },
        nota: 5,
        comentario: "Excelente filme!",
        status: "Publicada",
        criadaEm: new Date("2026-11-20T13:00:00Z")
    },
    {
        _id: 202,
        usuarioId: 2,
        conteudoId: 102,
        conteudo: { titulo: "Mistérios da Cidade", tipo: "Série" },
        nota: 4,
        comentario: "Muito interessante.",
        status: "Publicada",
        criadaEm: new Date("2026-11-21T13:00:00Z")
    },
    {
        _id: 203,
        usuarioId: 3,
        conteudoId: 103,
        conteudo: { titulo: "No Ritmo da Música", tipo: "Música" },
        nota: 5,
        comentario: "Adorei a música!",
        status: "Publicada",
        criadaEm: new Date("2026-11-22T13:00:00Z")
    },
    {
        _id: 204,
        usuarioId: 1,
        conteudoId: 104,
        conteudo: { titulo: "Risos e Aventuras", tipo: "Filme" },
        nota: 3,
        comentario: "Avaliação antiga.",
        status: "Removida",
        criadaEm: new Date("2024-01-01T00:00:00Z")
    }
]);

// Mostra os documentos inseridos em cada coleção.
print("ETAPA 1 — USUÁRIOS:");
streamPlayDB.Usuarios.find();

print("ETAPA 1 — CATÁLOGO:");
streamPlayDB.Catalogo.find();

print("ETAPA 1 — AVALIAÇÕES:");
streamPlayDB.Avaliacoes.find();

// ============================================================
// ETAPA 2 — CONSULTAS FIND E OPERADORES
// ============================================================

// $gt: busca conteúdos com duração superior a 100 minutos.
// A consulta retorna o filme Aventura Espacial.
print("CONSULTA 1 — CONTEÚDOS COM MAIS DE 100 MINUTOS:");
streamPlayDB.Catalogo.find({ duracao: { $gt: 100 } });

// $in: busca conteúdos dos gêneros Ação, Comédia ou Drama.
print("CONSULTA 2 — CONTEÚDOS DE AÇÃO, COMÉDIA OU DRAMA:");
streamPlayDB.Catalogo.find({
    genero: { $in: ["Ação", "Comédia", "Drama"] }
});

// Projeção: exibe somente título, tipo e visualizações, sem o campo _id.
print("CONSULTA 3 — PROJEÇÃO DE CONTEÚDOS:");
streamPlayDB.Catalogo.find(
    {},
    { _id: 0, titulo: 1, tipo: 1, visualizacoes: 1 }
);

// ============================================================
// ETAPA 3 — MANIPULAÇÃO E MANUTENÇÃO DE DADOS
// ============================================================

// updateOne() com $set: atualiza o plano de Ana sem apagar os outros campos.
print("ATUALIZAÇÃO 1 — ALTERANDO O PLANO DE ANA:");
streamPlayDB.Usuarios.updateOne(
    { _id: 1 },
    { $set: { "perfil.tipo": "Premium Plus" } }
);

// updateMany() com $set: marca como recomendados conteúdos com mais de
// 1.000 visualizações; há conteúdos que atendem ao filtro.
print("ATUALIZAÇÃO 2 — MARCANDO CONTEÚDOS RECOMENDADOS:");
streamPlayDB.Catalogo.updateMany(
    { visualizacoes: { $gt: 1000 } },
    { $set: { recomendado: true } }
);

// updateOne() com $push: adiciona o conteúdo 105 aos favoritos de Ana
// preservando os favoritos que ela já tinha.
print("ATUALIZAÇÃO 3 — ADICIONANDO FAVORITO:");
streamPlayDB.Usuarios.updateOne(
    { _id: 1 },
    { $push: { favoritos: 105 } }
);

// deleteOne(): remove somente a avaliação identificada como obsoleta.
// O filtro é específico e não está vazio.
print("EXCLUSÃO — REMOVENDO A AVALIAÇÃO OBSOLETA:");
streamPlayDB.Avaliacoes.deleteOne({
    _id: 204,
    status: "Removida"
});

// Confere as alterações e a exclusão.
print("USUÁRIOS ATUALIZADOS:");
streamPlayDB.Usuarios.find();

print("CATÁLOGO ATUALIZADO:");
streamPlayDB.Catalogo.find();

print("AVALIAÇÕES APÓS A EXCLUSÃO:");
streamPlayDB.Avaliacoes.find();

// ============================================================
// ETAPA 4 — AGGREGATION PIPELINES
// ============================================================

// Pipeline 1 — relatório gerencial:
// calcula as visualizações totais de cada gênero, considerando mídias ativas.
print("PIPELINE 1 — VISUALIZAÇÕES POR GÊNERO:");
streamPlayDB.Catalogo.aggregate([
    {
        $match: {
            ativo: true,
            visualizacoes: { $gte: 0 },
            genero: { $type: "array" }
        }
    },
    { $unwind: "$genero" },
    {
        $group: {
            _id: "$genero",
            totalVisualizacoes: { $sum: "$visualizacoes" }
        }
    },
    { $sort: { totalVisualizacoes: -1 } },
    {
        $project: {
            _id: 0,
            genero: "$_id",
            totalVisualizacoes: 1
        }
    }
]);

// Pipeline 2 — relatório formatado:
// calcula média e quantidade de avaliações publicadas por conteúdo,
// encontra o título no catálogo e apresenta campos com nomes amigáveis.
print("PIPELINE 2 — RELATÓRIO DE AVALIAÇÕES:");
streamPlayDB.Avaliacoes.aggregate([
    {
        $match: {
            status: "Publicada",
            nota: { $gte: 1, $lte: 5 }
        }
    },
    {
        $group: {
            _id: "$conteudoId",
            mediaAvaliacoes: { $avg: "$nota" },
            totalAvaliacoes: { $sum: 1 }
        }
    },
    {
        $lookup: {
            from: "Catalogo",
            localField: "_id",
            foreignField: "_id",
            as: "dadosConteudo"
        }
    },
    { $unwind: "$dadosConteudo" },
    {
        $project: {
            _id: 0,
            nomeConteudo: "$dadosConteudo.titulo",
            mediaAvaliacoes: { $round: ["$mediaAvaliacoes", 2] },
            totalAvaliacoes: 1
        }
    },
    { $sort: { mediaAvaliacoes: -1, totalAvaliacoes: -1, nomeConteudo: 1 } }
]);

print("PROJETO STREAMPLAY EXECUTADO!");
