import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Modal,
  Col,
  InputGroup,
  Card,
  Table,
} from "react-bootstrap";
import Select from "react-select";
import "../../styles/initial-page/EditarContent.css";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";

const ChangeUserContent = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [editableResults, setEditableResults] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null); // Estado para armazenar a função selecionada

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
    fetchSearchResults(inputValue);
  };

  const handleInputChange = (selectedOption, index, field) => {
    const updatedResults = [...editableResults];
    updatedResults[index][field] = selectedOption.value; // Defina o valor selecionado
    setEditableResults(updatedResults);
    setSelectedRole(selectedOption); // Atualize o estado com a função selecionada
  };

  const handleUpdate = async (type, id, updatedData) => {
    try {
      const response = await fetch(`${ENV_BASE_URL}/update-${type}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const message = await response.json();
      setShowModal(true);
      setModalMessage("Função atualizada com sucesso!", message.message);
    } catch (error) {
      setShowModal(true);
      setModalMessage("Erro ao atualizar:", error);
    }
  };

  const fetchSearchResults = async (inputValue) => {
    try {
      const response = await fetch(
        `${ENV_BASE_URL}/get-user-by-email/${inputValue}`
      );
      const searchResults = await response.json();
      setSearchResult(searchResults);
      setEditableResults(searchResults);
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const inputValue = event.target.codigoPesquisa.value;
    setInputValue(inputValue);

    if (inputValue) {
      fetchSearchResults(inputValue);
    }
  };

  return (
    <Container style={{ marginBottom: "100px" }}>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h1 className="text-center">Trocar função do usuário</h1>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6} className="search-button-container">
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="codigoPesquisa">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Digite o email do usuário"
                  name="codigoPesquisa"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="search-button"
                >
                  Pesquisar
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      {searchResult && (
        <Row className="justify-content-center mt-3">
          <Col md={8} className="result-column">
            <h2 className="display-4 text-center mt-4 mb-3">
              Resultados da Pesquisa
            </h2>
            {searchResult.map((result, index) => (
              <Card key={index} className="result-card mb-3">
                <Card.Body>
                  <div className="user-info">
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <th>Id:</th>
                          <td>{result.id}</td>
                        </tr>
                        <tr>
                          <th>Nome do usuário:</th>
                          <td>{result.name}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{result.email}</td>
                        </tr>
                        <tr>
                          <th>Função:</th>
                          <td>
                            <Select
                              options={[
                                { value: "user", label: "User" },
                                { value: "admin", label: "Admin" },
                              ]}
                              defaultValue={
                                editableResults[index]?.role
                                  ? {
                                      value: editableResults[index].role,
                                      label: editableResults[index].role,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleInputChange(selectedOption, index, "role")
                              }
                            />
                          </td>
                        </tr>

                        <tr className="text-center-horizontal">
                          <td colSpan="2">
                            <div className="button-container mt-4 mb-4">
                              <Button
                                variant="success"
                                onClick={() =>
                                  handleUpdate("user", result.id, result)
                                }
                              >
                                Atualizar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            ))}
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
};

export default ChangeUserContent;
