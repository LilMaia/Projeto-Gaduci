import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";

const RegistrationModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    login: "",
    password: "",
  });

  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(ENV_BASE_URL + "/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newUser = await response.json();
        // Handle successful registration, if needed
        console.log("User registered:", newUser);
        setRegistrationStatus({
          success: true,
          message: "Cadastro realizado com sucesso.",
        });
        onClose(); // Close the registration modal
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        // Handle registration error, if needed
        setRegistrationStatus({
          success: false,
          message: "Erro ao cadastrar. Verifique os campos e tente novamente.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Handle other potential errors, if needed
      setRegistrationStatus({
        success: false,
        message: "Erro ao cadastrar. Verifique os campos e tente novamente.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cpf: "",
      phone: "",
      email: "",
      login: "",
      password: "",
    });
    setRegistrationStatus(null);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        onClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cadastro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {registrationStatus && (
          <Alert variant={registrationStatus.success ? "success" : "danger"}>
            {registrationStatus.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="cpf">
            <Form.Label>CPF</Form.Label>
            <Form.Control
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="phone">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="login">
            <Form.Label>Login</Form.Label>
            <Form.Control
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-4">
            Cadastrar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegistrationModal;
