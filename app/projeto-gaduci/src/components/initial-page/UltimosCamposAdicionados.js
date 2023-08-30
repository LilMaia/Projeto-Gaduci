import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";

function UltimosCamposAdicionados({ tipo, ultimosCampos, setUltimosCampos }) {

  useEffect(() => {
    async function fetchUltimosCampos() {
      try {
        const response = await fetch(
          ENV_BASE_URL + `/ultimos-${tipo}` 
        );
        const data = await response.json();
        setUltimosCampos(data); // Update the state in the parent component
      } catch (error) {
        console.error(error);
      }
    }

    fetchUltimosCampos();
  }, [tipo, setUltimosCampos]);

  return (
    <Card style={{ marginTop: "115px" }}>
      <Card.Body>
        <Card.Title className="mb-3">
          {tipo === "grupos"
            ? "Últimos Grupos Adicionados :"
            : "Últimas Atividades Adicionadas :"}
        </Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {ultimosCampos.map((campo, index) => (
              <tr key={index}>
                <td>{campo.grupoId || campo.atividadeId}</td>
                <td>{campo.nomeDoGrupo || campo.nomeAtividade}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default UltimosCamposAdicionados;
