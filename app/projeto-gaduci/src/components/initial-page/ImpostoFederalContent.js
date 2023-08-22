import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Card } from "react-bootstrap";
import "../../styles/initial-page/ImpostoFederalContent.css";

const SearchBar = () => {
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent form submission

    const inputValue = event.target.codigoPesquisa.value;

    if (inputValue) {
      try {
        const token = "L7iWhq1-tRdGSr_y_HW2FA"; // Your provided token
        const headers = {
          "X-Cosmos-Token": token,
        };

        const response = await fetch(
          `https://api.cosmos.bluesoft.com.br/ncms/${inputValue}/products`,
          {
            headers: headers,
          }
        );

        const data = await response.json();

        if (Array.isArray(data) || data.products) {
          const responseDataWithoutUnwantedKeys = { ...data };
          delete responseDataWithoutUnwantedKeys.products;
          delete responseDataWithoutUnwantedKeys.ex;
          delete responseDataWithoutUnwantedKeys.current_page;
          delete responseDataWithoutUnwantedKeys.per_page;
          delete responseDataWithoutUnwantedKeys.total_pages;
          delete responseDataWithoutUnwantedKeys.total_count;
          delete responseDataWithoutUnwantedKeys.next_page;

          setSearchResult(responseDataWithoutUnwantedKeys);
        } else {
          setSearchResult(null);
          console.log("Invalid API response format.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h1 className="text-center">Tributação Federal</h1>
        </Col>
      </Row>  
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="codigoPesquisa">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Digite o código"
                  name="codigoPesquisa"
                />
                <Button type="submit" variant="primary">
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
                <Card.Text><strong>Código:</strong> {searchResult.code}</Card.Text>
                <Card.Text>
                  <strong>Descrição:</strong> {searchResult.description}
                  <br />
                  <strong>Descrição completa:</strong>{" "}
                  {searchResult.full_description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SearchBar;
