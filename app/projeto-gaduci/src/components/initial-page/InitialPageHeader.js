import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal, Toast } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { FaSignInAlt } from "react-icons/fa";
import { SessionStorageKey } from "../../enums/sessionStorage.enum.js";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";
import "../../styles/initial-page/InitialPageHeader.css";
import ImpostoFederalContent from "../../components/initial-page/ImpostoFederalContent";
import ImpostoEstadualContent from "../../components/initial-page/ImpostoEstadualContent";
import ImpostoMunicipalContent from "../../components/initial-page/ImpostoMunicipalContent";
import AdicionarContent from "../../components/initial-page/AdicionarContent";
import EditarContent from "../../components/initial-page/EditarContent";
import DeletarContent from "../../components/initial-page/DeletarContent";
import ExcelContent from "../../components/initial-page/ExcelContent";
import RegistrationModal from "./RegistrationModal.js";
import ChangeUserRoleContent from "./ChangeUserRoleContent.js";

const InitialPageHeader = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Estado para controlar o login
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal de login
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState({}); // Estado para controlar o toast
  const [selectedService, setSelectedService] = useState(null);
  const [adminSelect, setAdminSelect] = useState(null);
  const [userAdmin, setUserAdmin] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem(SessionStorageKey.APP_STORAGE_KEY);
    if (token && !loggedIn) {
      verifyToken(token);
    }
  });
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  const handleServiceSelect = (serviceName) => {
    if (loggedIn) {
      setAdminSelect(null);
      setSelectedService(serviceName);
    } else {
      setShowModal(true);
    }
  };
  ///////////////////////////////////////////////////////////
  const handleAdminSelect = (adminService) => {
    setSelectedService(null);
    setAdminSelect(adminService);
  };
  //////////////////////////////////////////////////////////
  // const openRegisterModal = () => {
  //   setShowRegisterModal(true);
  // };
  /////////////////////////////////////////////////////////
  const setUserState = (user) => {
    setUser(user);
    setUserAdmin(user.role === "admin");
    showLoggedIn(user);
  };
  //////////////////////////////////////////////////////////
  const setToastState = (data) => {
    setToastData(data);
  };
  ///////////////////////////////////////////////////////
  const openLoginModal = () => {
    setShowModal(true);
  };
  ///////////////////////////////////////////////////////
  const closeLoginModal = () => {
    setShowModal(false);
  };
  ///////////////////////////////////////////////////////
  const showLoggedIn = (user) => {
    return (
      <>
        <Navbar.Text className="logado-como">
          Logado como:{" "}
          <a
            href="#abrirPerfil"
            className="privacy-link"
            onClick={handleProfile}
          >
            {user ? user.name : ""}
          </a>
        </Navbar.Text>

        {loggedIn && (
          <Navbar.Text>
            <a href="#logout" onClick={handleLogout} className="privacy-link">
              Sair
            </a>
          </Navbar.Text>
        )}
      </>
    );
  };
  ////////////////////////////////////////////////////////
  const showLoggedOut = () => {
    return (
      <>
        <Navbar.Text>
          <a href="#login" onClick={openLoginModal} className="privacy-link">
            Entrar
          </a>
          <a
            href="#register"
            onClick={() => setShowRegisterModal(true)} // Show the RegistrationModal
            className="privacy-link ms-4"
          >
            Cadastrar
          </a>
        </Navbar.Text>
        {showModal && (
          <Modal
            show={showModal}
            onHide={closeLoginModal}
            style={{ position: "relative" }}
          >
            <Modal.Header closeButton onClick={closeLoginModal}>
              <Modal.Title>Entrar</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleLogin}>
              <Modal.Body>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Usuário"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    type="text"
                    name="username"
                  />
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    placeholder="Senha"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
                    type="password"
                    name="password"
                  />
                </InputGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" variant="primary">
                  <FaSignInAlt /> Entrar
                </Button>
              </Modal.Footer>
            </Form>
            {showToast && showToast()} {/* Include the toast */}
          </Modal>
        )}
      </>
    );
  };
  /////////////////////////////////////////////////////////////////
  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      login: event.target.username.value,
      password: event.target.password.value,
    };

    try {
      const response = await fetch(ENV_BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem(SessionStorageKey.APP_STORAGE_KEY, data.token); // Salve o token no armazenamento local
        setLoggedIn(true);
        getUserData(
          sessionStorage.getItem(SessionStorageKey.APP_STORAGE_KEY)
        ).then((user) => setUserState(user));
        closeLoginModal();
      }

      if (response.status === 401) {
        const data = await response.json();
        setToastState(data);
        setShow(true);
      }

      if (response.status === 400) {
        const data = await response.json();
        setToastState(data);
        setShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////////////////////////////////////////////
  const showToast = function (message = null) {
    return (
      <div
        className="toast-container"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000, // Adjust as needed
        }}
      >
        {show && (
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">Erro</strong>
            </Toast.Header>
            <Toast.Body>
              {message != null ? message : toastData.error}
            </Toast.Body>
          </Toast>
        )}
      </div>
    );
  };
  /////////////////////////////////////////////////////////////////

  const verifyToken = async (token) => {
    try {
      const response = await fetch(ENV_BASE_URL + "/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token === token) {
          setLoggedIn(true);
          closeLoginModal();
          getUserData(
            sessionStorage.getItem(SessionStorageKey.APP_STORAGE_KEY)
          ).then((user) => setUserState(user));
          return true;
        } else {
          setLoggedIn(false);
          sessionStorage.removeItem(SessionStorageKey.APP_STORAGE_KEY);
          alert("Sessão expirada, faça login novamente");
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /////////////////////////////////////////////////////////////////
  const getUserData = async (token) => {
    try {
      const response = await fetch(ENV_BASE_URL + "/get-user-by-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoggedIn(true);
        closeLoginModal();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////////////////////////////////////////////
  const handleLogout = () => {
    sessionStorage.removeItem(SessionStorageKey.APP_STORAGE_KEY);
    setLoggedIn(false);
    window.location.href = "/";
  };
  //////////////////////////////////////////////////////////////////////

  const handleProfile = () => {
    alert("Funcionalidade ainda não implementada!");
  };

  //////////////////////////////////////////////////////////////////////
  return (
    <>
      <Navbar expand="lg" className="navbar">
        <Container className="container">
          <Navbar.Brand href="#home">
            <img
              src="logo.png"
              alt="GaduciTax"
              className="header-logo"
              width={200}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="ml-auto">
            <Nav className="me-auto">
              <NavDropdown title="Serviços" id="basic-nav-dropdown">
                {" "}
                <NavDropdown.Item
                  onClick={() => handleServiceSelect("federal")}
                >
                  Tributação federal
                </NavDropdown.Item>
                {/* <NavDropdown.Item
                  onClick={() => handleServiceSelect("estadual")}
                >
                  Tributação estadual
                </NavDropdown.Item> */}
                <NavDropdown.Item
                  onClick={() => handleServiceSelect("municipal")}
                >
                  Tributação municipal
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#">Sobre</Nav.Link>
              {userAdmin && (
                <NavDropdown
                  title="Administracao"
                  id="administration-nav-dropdown"
                >
                  <NavDropdown.Item onClick={() => handleAdminSelect("excel")}>
                    Carregar Excel
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleAdminSelect("editar")}>
                    Editar Dados
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => handleAdminSelect("deletar")}
                  >
                    Deletar Dados
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => handleAdminSelect("adicionar")}
                  >
                    Adicionar Dados
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => handleAdminSelect("change-role")}
                  >
                    Mudar Cargo de Usuário
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end login-navbar">
            {loggedIn ? showLoggedIn(user) : showLoggedOut()}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <RegistrationModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
      {selectedService === "federal" && <ImpostoFederalContent />}
      {selectedService === "estadual" && <ImpostoEstadualContent />}
      {selectedService === "municipal" && <ImpostoMunicipalContent />}
      {adminSelect === "excel" && <ExcelContent />}
      {adminSelect === "editar" && <EditarContent />}
      {adminSelect === "deletar" && <DeletarContent />}
      {adminSelect === "adicionar" && <AdicionarContent />}
      {adminSelect === "change-role" && <ChangeUserRoleContent />}
    </>
  );
};

export default InitialPageHeader;
