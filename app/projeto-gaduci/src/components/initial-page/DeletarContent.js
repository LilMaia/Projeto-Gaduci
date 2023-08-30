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
import "../../styles/initial-page/DeletarContent.css";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";

const DeleteContent = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null); // State to store the selected city
  const [cityOptions, setCityOptions] = useState([]); // State to store the city options
  const [inputValue, setInputValue] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch(ENV_BASE_URL + "/city-select-options");
        const cities = await response.json();
        const citySelectOptions = cities.map((city) => ({
          value: city.label,
          label: city.label,
        }));
        setCityOptions(citySelectOptions);
      } catch (error) {
        alert("Error fetching cities:", error);
      }
    }

    fetchCities();
  }, []);

  const confirmDelete = async () => {
    try {
      const { type, id } = itemToDelete;
      await fetch(`${ENV_BASE_URL}/delete-${type}/${id}`, {
        method: "DELETE",
      });
      fetchSearchResults(selectedCity.value, inputValue);
      setShowDeleteConfirmation(false);
    } catch (error) {
      setShowDeleteConfirmation(false);
    }
  };

  const handleDelete = (type, id) => {
    setShowDeleteConfirmation(true);
    setItemToDelete({ type, id });
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  const fetchSearchResults = async (cityValue, inputValue) => {
    try {
      const response = await fetch(
        `${ENV_BASE_URL}/search-by-nome-or-atividade/${cityValue}/${inputValue}`
      );
      const searchResults = await response.json();
      setSearchResult(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const inputValue = event.target.codigoPesquisa.value;
    setInputValue(inputValue);

    if (inputValue && selectedCity) {
      fetchSearchResults(selectedCity.value, inputValue);
    }
  };

  return (
    <Container style={{ marginBottom: "100px" }}>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h1 className="text-center">Deletar dados</h1>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        {" "}
        {/* Add spacing */}
        <Col md={6}>
          <Select
            options={cityOptions}
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Selecionar Cidade"
            className="city-select"
          />
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6} className="search-button-container">
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="codigoPesquisa">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Digite a descrição"
                  name="codigoPesquisa"
                  disabled={!selectedCity} // Disable if no city selected
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!selectedCity}
                  className="search-button"
                >
                  {" "}
                  {/* Disable if no city selected */}
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
                  <div className="group-info">
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <th>Código Do Grupo:</th>
                          <td>{result.grupoId}</td>
                        </tr>
                        <tr>
                          <th>Código Estado IBGE:</th>
                          <td>{result.codEstadoIbge}</td>
                        </tr>
                        <tr>
                          <th>Estado:</th>
                          <td>{result.estado}</td>
                        </tr>
                        <tr>
                          <th>Código Município IBGE:</th>
                          <td>{result.codMunicipioIbge}</td>
                        </tr>
                        <tr>
                          <th>Município:</th>
                          <td>{result.municipio}</td>
                        </tr>
                        <tr>
                          <th>Nome do Grupo:</th>
                          <td>{result.nomeDoGrupo}</td>
                        </tr>
                        <tr className="text-center-horizontal">
                          {" "}
                          {/* Adicione a classe aqui */}
                          <td colSpan="2">
                            <div className="button-container mt-4 mb-4">
                              {result.atividades.length > 0 ? (
                                <p className="error-message">
                                  Para poder deletar um grupo, é necessário
                                  deletar suas atividades antes.
                                </p>
                              ) : (
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleDelete("grupo", result.grupoId)
                                  }
                                >
                                  Deletar
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  {result.atividades.length > 0 && (
                    <div className="activity-table">
                      <h5 className="activity-titlemb-3">Atividades:</h5>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Nome da Atividade</th>
                            <th>Código do Serviço</th>
                            <th>Classificação</th>
                            <th>Alíquota ISS</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.atividades.map(
                            (atividade, atividadeIndex) => (
                              <tr key={atividadeIndex}>
                                <td>{atividade.nomeAtividade}</td>
                                <td>{atividade.codigoDoServico}</td>
                                <td>{atividade.classificacao}</td>
                                <td>{atividade.aliquotaISS}</td>
                                <td>
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleDelete(
                                        "atividade",
                                        atividade.atividadeId
                                      )
                                    }
                                  >
                                    Deletar
                                  </Button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Tem certeza que deseja excluir este item?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteContent;
