import "../../styles/initial-page/InitialPageHeader.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap"; // Importe os componentes do react-bootstrap
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";
import { SessionStorageKey } from "../../enums/sessionStorage.enum.js";
import { FaSignInAlt } from "react-icons/fa";

const InitialPageHeader = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Estado para controlar o login
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal de login
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem(SessionStorageKey.APP_STORAGE_KEY);
    if (token && !loggedIn) {
      verifyToken(token);
    }
  });

  const setUserState = (user) => {
    setUser(user);
    showLoggedIn(user);
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
          Logado como: {user ? user.name : ""}
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
  const showLoggedOut = (handleLogin) => {
    return (
      <>
        <Navbar.Text>
          <a href="#login" onClick={openLoginModal} className="privacy-link">
            Entrar
          </a>
        </Navbar.Text>
        {showModal && (
          <Modal show={showModal} onHide={!showModal}>
            <Modal.Header closeButton onClick={closeLoginModal}>
              <Modal.Title>Fazer Login</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleLogin}>
              <Form.Group>
                <Modal.Body>
                  <Form.Label>Usuário:</Form.Label>
                  <Form.Control type="text" name="username" />
                  <Form.Label>Senha:</Form.Label>
                  <Form.Control type="password" name="password" />
                </Modal.Body>
                <Modal.Footer>
                  <Button type="submit" variant="primary">
                    <FaSignInAlt /> Entrar
                  </Button>
                </Modal.Footer>
              </Form.Group>
            </Form>
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
        alert(data.error);
      }
    } catch (error) {
      alert(error);
    }
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
      alert(error);
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
      alert(error);
    }
  };
  //////////////////////////////////////////////////////////////////////
  const handleLogout = () => {
    sessionStorage.removeItem(SessionStorageKey.APP_STORAGE_KEY);
    setLoggedIn(false);
  };
  //////////////////////////////////////////////////////////////////////
  return (
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
              <NavDropdown.Item href="#action/3.1">
                Tributação Federal
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Tributação Estadual
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                Tributação Municipal
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#">Sobre</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end login-navbar">
          {loggedIn ? showLoggedIn(user) : showLoggedOut(handleLogin)}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default InitialPageHeader;
