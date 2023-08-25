import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { ENV_BASE_URL } from "../../enviroment/enviroments.js";

function UltimosCamposAdicionados({ tipo }) {
  const [ultimosCampos, setUltimosCampos] = useState([]);

  useEffect(() => {
    async function fetchUltimosCampos() {
      try {
        const response = await fetch(
          ENV_BASE_URL + `/ultimos-${tipo}` // Substitua pelo endpoint correto da API
        );
        const data = await response.json();
        setUltimosCampos(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUltimosCampos();
  }, [tipo]);

  return (
<Card style={{ marginTop: "115px"}}>
  <Card.Body>
    <Card.Title className="mb-3">
      {tipo === "grupos"
        ? "Últimos Grupos Adicionados :"
        : "Últimas Atividades Adicionadas :"}
    </Card.Title>
    <ul className="list-unstyled">
      {ultimosCampos.map((campo, index) => (
        <li
          key={index}
          className="mb-2"
          style={{
            padding: "5px 0",
            position: "relative",
          }}
        >
          <span
            className="badge badge-custom"
            style={{
              position: "absolute",
              left: "-15px",
              top: "7px",
              color: "#007bff",
              fontSize: "14px",
            }}
          >
            &bull;
          </span>
          {campo.nomeDoGrupo || campo.nomeAtividade}
        </li>
      ))}
    </ul>
  </Card.Body>
</Card>

  );
}

export default UltimosCamposAdicionados;
