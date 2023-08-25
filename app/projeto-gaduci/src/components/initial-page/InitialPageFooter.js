import "../../styles/initial-page/InitialPageFooter.css";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

function InitialPageFooter() {
  return (
    <footer className="bg-dark text-white py-1">
      <Container className="container">
        <Row className="justify-content-center">
          <Col className="politica-col">
          <a href="/politica-de-privacidade" className="privacy-link">
              Política de Privacidade
            </a>
          </Col>
          <Col>
            <a href="https://www.google.com" className="social-icon">
              <FaFacebook />
            </a>
            <a href="https://www.google.com" className="social-icon">
              <FaLinkedin />
            </a>
            <a href="https://www.google.com" className="social-icon">
              <FaInstagram />
            </a>
            <a href="https://www.google.com" className="social-icon">
              <FaYoutube />
            </a>
          </Col>
          <Col className="direitos-autorias-col">
            <p>
              &copy; {new Date().getFullYear()} GaduciTax. Todos os direitos
              reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default InitialPageFooter;
