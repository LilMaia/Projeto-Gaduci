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

const UpdateContent = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null); // State to store the selected city
  const [cityOptions, setCityOptions] = useState([]); // State to store the city options
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [editableResults, setEditableResults] = useState([]); // New state for editable results

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

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
    fetchSearchResults(selectedCity.value, inputValue);
    // window.location.reload(false); // Recarregar a mesma página sem alterar localização
  };

  const handleInputChange = (e, index, field) => {
    const updatedResults = [...editableResults];
    updatedResults[index][field] = e.target.value;
    setEditableResults(updatedResults);
  };

  const handleInputChangeActivitie = (e, resultIndex, atividadeIndex, field) => {
    const updatedResults = [...editableResults];
    updatedResults[resultIndex].atividades[atividadeIndex][field] = e.target.value;
    setEditableResults(updatedResults);
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
      if(type === "grupo"){
        setModalMessage("Grupo atualizado com sucesso!", message.message);
      }else{
        setModalMessage("Atividade atualizada com sucesso!", message.message);
      }
      
    } catch (error) {
      setShowModal(true);
      setModalMessage("Erro ao atualizar:", error);
    }
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
      setEditableResults(searchResults);
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
          <h1 className="text-center">Atualizar dados</h1>
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
                          <th>Código Estado IBGE:</th>
                          <td>
                            <Form.Control
                              type="text"
                              value={result.codEstadoIbge}
                              onChange={(e) =>
                                handleInputChange(e, index, "codEstadoIbge")
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Estado:</th>
                          <td>
                            <Form.Control
                              type="text"
                              value={result.estado}
                              onChange={(e) =>
                                handleInputChange(e, index, "estado")
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Código Município IBGE:</th>
                          <td>
                            <Form.Control
                              type="text"
                              value={result.codMunicipioIbge}
                              onChange={(e) =>
                                handleInputChange(e, index, "codMunicipioIbge")
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Município:</th>
                          <td>
                            <Form.Control
                              type="text"
                              value={result.municipio}
                              onChange={(e) =>
                                handleInputChange(e, index, "municipio")
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Nome do Grupo:</th>
                          <td>
                            <Form.Control
                              type="text"
                              value={result.nomeDoGrupo}
                              onChange={(e) =>
                                handleInputChange(e, index, "nomeDoGrupo")
                              }
                            />
                          </td>
                        </tr>
                        <tr className="text-center-horizontal">
                          {" "}
                          {/* Adicione a classe aqui */}
                          <td colSpan="2">
                            <div className="button-container mt-4 mb-4">
                              <Button
                                variant="success"
                                onClick={() =>
                                  handleUpdate("grupo", result.grupoId, result)
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
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={atividade.nomeAtividade}
                                    onChange={(e) =>
                                        handleInputChangeActivitie(e, index, atividadeIndex,"nomeAtividade")
                                    }
                                  ></Form.Control>
                                </td>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={atividade.codigoDoServico}
                                    onChange={(e) =>
                                        handleInputChangeActivitie(e, index, atividadeIndex, "codigoDoServico")
                                    }
                                  ></Form.Control>
                                </td>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={atividade.classificacao}
                                    onChange={(e) =>
                                        handleInputChangeActivitie(e, index, atividadeIndex, "classificacao")
                                    }
                                  ></Form.Control>
                                </td>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={atividade.aliquotaISS}
                                    onChange={(e) =>
                                        handleInputChangeActivitie(e, index, atividadeIndex, "aliquotaISS")
                                    }
                                  ></Form.Control>
                                </td>
                                <td>
                                  <Button
                                    variant="success"
                                    onClick={() =>
                                      handleUpdate(
                                        "atividade",
                                        atividade.atividadeId,
                                        atividade
                                      )
                                    }
                                  >
                                    Atualizar
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

export default UpdateContent;
