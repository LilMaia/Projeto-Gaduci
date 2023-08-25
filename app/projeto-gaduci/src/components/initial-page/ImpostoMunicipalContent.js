import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Table,
  InputGroup,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import "../../styles/initial-page/ImpostoMunicipalContent.css";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";

const SearchBar = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null); // State to store the selected city
  const [cityOptions, setCityOptions] = useState([]); // State to store the city options

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

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };
  const handleSearch = async (event) => {
    event.preventDefault();

    const inputValue = event.target.codigoPesquisa.value;

    if (inputValue && selectedCity) {
      try {
        const response = await fetch(
          `${ENV_BASE_URL}/search-by-nome-or-atividade/${selectedCity.value}/${inputValue}`
        );
        const searchResults = await response.json();
        setSearchResult(searchResults); // Assuming the API returns an array of search results
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <Container style={{ marginBottom: "100px" }}>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h1 className="text-center">Tributação Municipal</h1>
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
        {" "}
        {/* Add spacing */}
        <Col md={6} className="search-button-container">
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="codigoPesquisa">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Digite o nome da atividade ou grupo"
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
      <Container className="mb-4">
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
      </Container>
    </Container>
  );
};

export default SearchBar;
