// Importando o módulo Router do Express
import { Router } from "express";
import Grupo from "../models/grupo.js";
import Atividade from "../models/atividade.js";
import {} from "../validators/tributacao-municipal-validator.js";
import { validationResult } from "express-validator";
import { generateGrupo, generateAtividade } from "../mocker.js";
import { Op } from "sequelize";

// Criando uma instância do roteador
const tributacaoMunicipalRoutes = Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

tributacaoMunicipalRoutes.get("/group-by-city-and-name/:municipio/:nomeDoGrupo", async (req, res) => {
  try {
    const municipio = req.params.municipio;
    const nomeDoGrupo = req.params.nomeDoGrupo;

    // Consulta os grupos que correspondem ao município e ao nome do grupo
    const grupos = await Grupo.findAll({
      where: {
        municipio: municipio,
        nomeDoGrupo: nomeDoGrupo,
      },
      include: [
        {
          model: Atividade,
          // attributes: [], // Evita trazer todas as colunas de Atividade
        },
      ],
    });

    // Remove a senha dos objetos do grupo
    if (grupos) {
      grupos.forEach((grupo) => {
        delete grupo.dataValues.password;
      });
    }

    // Envia a resposta com os grupos correspondentes
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


tributacaoMunicipalRoutes.get("/city-select-options", async (req, res) => {
  try {
    const cidades = await Grupo.findAll({
      attributes: ["municipio"],
      group: ["municipio"],
    });
    const citySelectOptions = cidades.map((cidade) => {
      return { value: cidade.municipio, label: cidade.municipio };
    });
    res.status(200).json(citySelectOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.get("/ultimos-grupos", async (req, res) => {
  try {
    const grupos = await Grupo.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.get("/ultimos-atividades", async (req, res) => {
  try {
    const atividades = await Atividade.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(atividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.delete("/delete-grupo/:grupoId", async (req, res) => {
  try {
    const grupoId = req.params.grupoId;
    const grupo = await Grupo.findByPk(grupoId);

    if (!grupo) {
      return res.status(400).json({ message: "Grupo não encontrado" });
    }

    await grupo.destroy();
    res.status(200).json({ message: "Grupo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.delete("/delete-atividade/:atividadeId", async (req, res) => {
  try {
    const atividadeId = req.params.atividadeId;
    const atividade = await Atividade.findByPk(atividadeId);

    if (!atividade) {
      return res.status(400).json({ message: "Atividade não encontrada" });
    }

    await atividade.destroy();
    res.status(200).json({ message: "Atividade excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.put("/update-grupo/:grupoId", async (req, res) => {
  try {
    const grupoId = req.params.grupoId;
    const grupo = await Grupo.findByPk(grupoId);

    if (!grupo) {
      return res.status(400).json({ message: "Grupo não encontrado" });
    }

    const grupoAtualizado = await grupo.update(req.body);
    res.status(200).json(grupoAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.put("/update-atividade/:atividadeId", async (req, res) => {
  try {
    const atividadeId = req.params.atividadeId;
    const atividade = await Atividade.findByPk(atividadeId);

    if (!atividade) {
      return res.status(400).json({ message: "Atividade não encontrada" });
    }
    
    const atividadeAtualizada = await atividade.update(req.body);
    res.status(200).json(atividadeAtualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.get("/search-by-nome-or-atividade/:municipio/:searchTerm", async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const municipio = req.params.municipio;

    // Consulta os grupos que correspondem ao município e contêm o termo de busca nos nomes dos grupos ou nas atividades associadas
    const grupos = await Grupo.findAll({
      where: {
        municipio: municipio,
        [Op.or]: [
          { nomeDoGrupo: { [Op.like]: `%${searchTerm.toLowerCase()}%` } },
          { "$atividades.nomeAtividade$": { [Op.like]: `%${searchTerm.toLowerCase()}%` } },
        ],
      },
      include: [
        {
          model: Atividade,
          // attributes: [], // Evita trazer todas as colunas de Atividade
        },
      ],
    });

    // Remove a senha dos objetos do grupo
    if (grupos) {
      grupos.forEach((grupo) => {
        delete grupo.dataValues.password;
      });
    }

    // Envia a resposta com os grupos correspondentes
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.post("/create-grupo", async (req, res) => {
  try {
    const grupo = await Grupo.create(req.body);
    res.status(201).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.post("/create-atividade", async (req, res) => {
  try {
    const grupoId = req.body.grupoId; // Passe o grupoId no corpo da requisição
    const grupo = await Grupo.findByPk(grupoId);

    if (!grupo) {
      return res.status(400).json({ message: "Grupo não encontrado" });
    }

    // Check if an activity with the same nomeAtividade and grupoId already exists
    const existingActivity = await Atividade.findOne({
      where: {
        nomeAtividade: req.body.nomeAtividade,
        grupoId: grupoId,
      },
    });

    if (existingActivity) {
      return res.status(400).json({ message: "Atividade com mesmo nome já existe" });
    }

    const atividadeData = {
      codigoDoServico: req.body.codigoDoServico,
      classificacao: req.body.classificacao,
      nomeAtividade: req.body.nomeAtividade,
      aliquotaISS: req.body.aliquotaISS,
      grupoId: grupoId,
    };

    const atividade = await Atividade.create(atividadeData);
    res.status(201).json(atividade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.get("/list-grupos", async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.get("/list-atividades", async (req, res) => {
  try {
    const atividades = await Atividade.findAll();
    res.status(200).json(atividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.get("/generate-grupo/:quantity", async (req, res) => {
  try {
    const quantity = req.params.quantity;
    let grupos = generateGrupo(quantity);
    grupos = await Grupo.bulkCreate(grupos);
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tributacaoMunicipalRoutes.get(
  "/generate-atividade/:quantity/:grupoId",
  async (req, res) => {
    try {
      const quantity = req.params.quantity;
      const grupoId = req.params.grupoId;
      let atividades = generateAtividade(quantity, grupoId);
      atividades = await Atividade.bulkCreate(atividades);
      res.status(200).json(atividades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Exporta o roteador para ser utilizado em outros módulos
export default tributacaoMunicipalRoutes;
