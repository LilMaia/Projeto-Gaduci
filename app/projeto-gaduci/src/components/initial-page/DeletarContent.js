import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import "../../styles/initial-page/DeletarContent.css";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";


const DeleteContent = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null); // State to store the selected city
  const [cityOptions, setCityOptions] = useState([]); // State to store the city options
  const [selectedOption, setSelectedOption] = useState("group"); // Default to "group"

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

  const handleDelete = () => {
    // Perform the delete logic here for the selected group/activity
    // Update the state or perform any necessary API calls
    // Clear the search result by setting setSearchResult(null)
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent form submission

    const inputValue = event.target.codigoPesquisa.value;

    if (inputValue && selectedCity) {
      // Perform your search logic here
    }
  };

  return (
    <Container>
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
        {" "}
        {/* Add spacing */}
        <Row className="justify-content-center mt-3 mb-4">
        <Col md={6} className="radio-button-container">
          <Form.Check
            type="radio"
            name="option"
            value="group"
            label="Grupo"
            checked={selectedOption === "group"}
            onChange={() => setSelectedOption("group")}
          />
          <Form.Check
            type="radio"
            name="option"
            value="activity"
            label="Atividade"
            checked={selectedOption === "activity"}
            onChange={() => setSelectedOption("activity")}
          />
        </Col>
      </Row>
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
          <Col md={8}>
            <h2 className="display-4 text-center mt-4 mb-3">
              Resultados da Pesquisa
            </h2>
            <Card>
              <Card.Body>
                <Card.Text>
                  <strong>Código:</strong> {searchResult.code}
                </Card.Text>
                <Card.Text>
                  <strong>Descrição:</strong> {searchResult.description}
                  <br />
                  <strong>Descrição completa:</strong>{" "}
                  {searchResult.full_description}
                </Card.Text>
              </Card.Body>
            </Card>
            <Button
              variant="danger"
              className="delete-button"
              onClick={handleDelete}
            >
              Deletar {selectedOption === "group" ? "Grupo" : "Atividade"}
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DeleteContent;
