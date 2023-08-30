import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";
import "../../styles/initial-page/AdicionarContent.css";
import UltimosCamposAdicionados from "./UltimosCamposAdicionados.js";

function AdicionarGrupoAtividade() {
  const [showModal, setShowModal] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [ultimosCampos, setUltimosCampos] = useState([]);

  const [grupoData, setGrupoData] = useState({
    codEstadoIbge: "",
    estado: "",
    abreviacaoEstado: "",
    codMunicipioIbge: "",
    municipio: "",
    nomeDoGrupo: "",
  });

  const [atividadeData, setAtividadeData] = useState({
    codigoDoServico: "",
    classificacao: "",
    nomeAtividade: "",
    aliquotaISS: "",
    grupoId: "",
  });

  const handleTipoChange = (e) => {
    setTipoSelecionado(e.target.value);
  };

  const handleGrupoChange = (e) => {
    const { name, value } = e.target;
    setGrupoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAtividadeChange = (e) => {
    const { name, value } = e.target;
    setAtividadeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
    // window.location.reload(false); // Recarregar a mesma página sem alterar localização
  };

  const handleSubmitGrupo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ENV_BASE_URL + "/create-grupo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(grupoData),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        // Exibir a modal somente em caso de sucesso
        setUltimosCampos((prevUltimosCampos) => [data, ...prevUltimosCampos]);
        setShowModal(true);
        setModalMessage("O grupo foi criado com sucesso.");
      } else {
        setShowModal(true);
        setModalMessage("Erro ao criar o grupo.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAtividade = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ENV_BASE_URL + "/create-atividade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(atividadeData),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        // Exibir a modal somente em caso de sucesso
        setUltimosCampos((prevUltimosCampos) => [data, ...prevUltimosCampos]);
        setShowModal(true);
        setModalMessage("A atividade foi criada com sucesso.");
      } else {
        setShowModal(true);
        setModalMessage("Erro ao criar a atividade.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="py-5" style={{ marginBottom: "100px" }}>
      <Row>
        <Col md={12}>
          <h2 className="mb-4">Selecione o tipo</h2>
          <Form.Group>
            {/* <Form.Label>Selecione o tipo:</Form.Label> */}
            <Form.Control
              as="select"
              onChange={handleTipoChange}
              className="custom-select custom-select-sm mx-auto"
            >
              <option value="" className="text-center">
                Escolha uma opção
              </option>
              <option value="grupo" className="text-center">
                Grupo
              </option>
              <option value="atividade" className="text-center">
                Atividade
              </option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {tipoSelecionado === "grupo" && (
        <Row>
          <Col md={6} className="mx-auto">
            <h2 className="mt-4 mb-4">Adicionar Grupo</h2>
            <Form onSubmit={handleSubmitGrupo}>
              {/* Campos do Grupo */}
              <Form.Group>
                <Form.Label>Código do Estado IBGE</Form.Label>
                <Form.Control
                  type="number"
                  name="codEstadoIbge"
                  value={grupoData.codEstadoIbge}
                  onChange={handleGrupoChange}
                  step="1"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  type="text"
                  name="estado"
                  value={grupoData.estado}
                  onChange={handleGrupoChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Abreviação do Estado</Form.Label>
                <Form.Control
                  type="text"
                  name="abreviacaoEstado"
                  value={grupoData.abreviacaoEstado}
                  onChange={handleGrupoChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Código do Município IBGE</Form.Label>
                <Form.Control
                  type="number"
                  name="codMunicipioIbge"
                  value={grupoData.codMunicipioIbge}
                  onChange={handleGrupoChange}
                  step="1"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Município</Form.Label>
                <Form.Control
                  type="text"
                  name="municipio"
                  value={grupoData.municipio}
                  onChange={handleGrupoChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Nome do Grupo</Form.Label>
                <Form.Control
                  type="text"
                  name="nomeDoGrupo"
                  value={grupoData.nomeDoGrupo}
                  onChange={handleGrupoChange}
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Button variant="primary" type="submit" className="mb-4">
                  Adicionar Grupo
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col md={6} className="mx-auto" style={{ maxWidth: "600px" }}>
            <UltimosCamposAdicionados
              tipo="grupos"
              ultimosCampos={ultimosCampos}
              setUltimosCampos={setUltimosCampos}
            />
          </Col>
        </Row>
      )}
      {tipoSelecionado === "atividade" && (
        <Row>
          <Col md={6} className="mx-auto">
            <h2 className="mb-4 mt-4">Adicionar Atividade</h2>
            <Form onSubmit={handleSubmitAtividade}>
              {/* Campos da Atividade */}
              <Form.Group>
                <Form.Label>Código do Serviço</Form.Label>
                <Form.Control
                  type="number"
                  name="codigoDoServico"
                  value={atividadeData.codigoDoServico}
                  onChange={handleAtividadeChange}
                  step="1"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Classificação</Form.Label>
                <Form.Control
                  type="text"
                  name="classificacao"
                  value={atividadeData.classificacao}
                  onChange={handleAtividadeChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Nome da Atividade</Form.Label>
                <Form.Control
                  type="text"
                  name="nomeAtividade"
                  value={atividadeData.nomeAtividade}
                  onChange={handleAtividadeChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Alíquota ISS</Form.Label>
                <Form.Control
                  type="text"
                  name="aliquotaISS"
                  value={atividadeData.aliquotaISS}
                  onChange={handleAtividadeChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>ID do Grupo</Form.Label>
                <Form.Control
                  type="text"
                  name="grupoId"
                  value={atividadeData.grupoId}
                  onChange={handleAtividadeChange}
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Button variant="primary" type="submit" className="mb-4">
                  Adicionar Atividade
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col md={6} className="mx-auto" style={{ maxWidth: "600px" }}>
            <UltimosCamposAdicionados
              tipo="atividades"
              ultimosCampos={ultimosCampos}
              setUltimosCampos={setUltimosCampos}
            />
          </Col>
        </Row>
      )}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Operação Concluída</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdicionarGrupoAtividade;
