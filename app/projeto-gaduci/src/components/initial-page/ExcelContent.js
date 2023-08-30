import React from "react";
import * as XLSX from "xlsx";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";

const ExcelUploadComponent = () => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const workbook = XLSX.readFile(file);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        let currentGroupID = null;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const {
            codEstadoIbge,
            estado,
            abreviacaoEstado,
            codMunicipioIbge,
            municipio,
            nomeDoGrupo,
            codigoDoServico,
            classificacao,
            nomeAtividade,
            aliquotaISS,
          } = row;

          if (nomeDoGrupo) {
            // Verifique se o grupo já existe no banco de dados
            try {
              const existingGroupResponse = await fetch(
                `${ENV_BASE_URL}/group-by-city-and-name/${municipio}/${nomeDoGrupo}`
              );
              const existingGroupData = await existingGroupResponse.json();

              let groupID;

              if (existingGroupData.length === 0) {
                // Se o grupo não existe, crie-o no banco de dados
                const newGroupResponse = await fetch(
                  ENV_BASE_URL + "/create-grupo",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      codEstadoIbge,
                      estado,
                      abreviacaoEstado,
                      codMunicipioIbge,
                      municipio,
                      nomeDoGrupo,
                    }),
                  }
                );

                const newGroupData = await newGroupResponse.json();
                groupID = newGroupData.id;
              } else {
                groupID = existingGroupData[0].id;
              }

              currentGroupID = groupID;
            } catch (error) {
              console.error("Erro ao buscar ou criar grupo:", error);
            }
          }

          // Associe a atividade ao grupo
          if (
            currentGroupID &&
            codigoDoServico &&
            classificacao &&
            nomeAtividade &&
            aliquotaISS
          ) {
            try {
              await fetch("/api/activities", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  grupoId: currentGroupID,
                  codigoDoServico,
                  classificacao,
                  nomeAtividade,
                  aliquotaISS,
                }),
              });
            } catch (error) {
              console.error("Erro ao criar atividade:", error);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao ler o arquivo Excel:", error);
      }
    }
  };

  return (
    <div>
      <h2>Fazer Upload de Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
};

export default ExcelUploadComponent;
