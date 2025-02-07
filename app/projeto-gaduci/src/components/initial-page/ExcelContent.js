import React, { useState } from "react";
import * as XLSX from "xlsx";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";
import { Button, Modal } from "react-bootstrap";

const ExcelUploadComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [inputKey, setInputKey] = useState(Date.now()); // Chave para recriar o input

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

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
                  groupID = newGroupData.grupoId;
                } else {
                  groupID = existingGroupData[0].grupoId;
                }

                currentGroupID = groupID;
                // Exibir modal de sucesso
              } catch (error) {
                console.log("Erro ao buscar ou criar grupo:" + error);
                console.log(true);
              }
            }
            // Associa a atividade ao grupo
            if (
              currentGroupID &&
              codigoDoServico &&
              classificacao &&
              nomeAtividade &&
              aliquotaISS
            ) {
              try {
                await fetch(ENV_BASE_URL + "/create-atividade", {
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
                // Exibir modal de sucesso
                console.log("Upload bem-sucedido!");
              } catch (error) {
                console.log("Erro ao criar atividade:" + error);
              }
            }
          }
        };
        reader.readAsArrayBuffer(file);
        setModalMessage("Tabela carregada no banco com sucesso!");
        setModalVisible(true);
      } catch (error) {
        setModalMessage("Erro ao ler o arquivo Excel:" + error);
        setModalVisible(true);
      }finally {
        setInputKey(Date.now());
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h1>Fazer upload de excel</h1>
      <input
        key={inputKey} // Definir uma chave diferente para recriar o input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mt-4"
      />

      <Modal show={modalVisible}>
        <Modal.Header>
          <Modal.Title>Status do Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExcelUploadComponent;
