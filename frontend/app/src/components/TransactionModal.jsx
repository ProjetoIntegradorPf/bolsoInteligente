import React, { useEffect, useState } from "react";

const TransactionModal = ({ active, handleModal, token, id, setErrorMessage }) => {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getTransaction = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(`/api/transactions/${id}`, requestOptions);

      if (!response.ok) {
        setErrorMessage("Could not get the transaction");
      } else {
        const data = await response.json();
        setDescription(data.description);
        setType(data.type);
        setValue(data.value.toFixed(2));
      }
    };

    if (id) {
      getTransaction();
    }
  }, [id, token]);

  const cleanFormData = () => {
    setDescription("");
    setType("");
    setValue("");
    setError("");
  };

  const handleCreateTransaction = async (e) => {
    cleanFormData();
    e?.preventDefault();
    if (!description && !type && !value) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (type !== "CREDITO" && type !== "DEBITO") {
      setError("Por favor, selecione o tipo de transação.");
      return;
    }
    if (Number(value) === 0) {
      setError("O valor não pode ser zero.");
      return;
    }
    const formattedValue = parseFloat(value.replace(",", "."));
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        description: description,
        type: type,
        value: formattedValue,
      }),
    };
    const response = await fetch("/api/transactions", requestOptions);
    if (!response.ok) {
      setError("Algo deu errado na criação");
    } else {
      cleanFormData();
      handleModal();
    }
  };

  const handleUpdateTransaction = async (e) => {
    e?.preventDefault();
    if (!description && !type && !value) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (type !== "CREDITO" && type !== "DEBITO") {
      setError("Por favor, selecione o tipo de transação.");
      return;
    }
    if (Number(value) === 0) {
      setError("O valor não pode ser zero.");
      return;
    }
    const formattedValue = parseFloat(value.replace(",", "."));
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        description: description,
        type: type,
        value: formattedValue,
      }),
    };
    const response = await fetch(`/api/transactions/${id}`, requestOptions);
    if (!response.ok) {
      setError("Algo deu errado na atualizaçãon");
    } else {
      cleanFormData();
      handleModal();
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">
            {id ? "Atualizar Transação" : "Criar Transação"}
          </h1>
        </header>
        {error && <div className="notification is-danger">{error}</div>}
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">Descrição</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Digite a descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Tipo</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="CREDITO">Crédito</option>
                    <option value="DEBITO">Débito</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Valor</label>
              <div className="control">
              <input
                type="text"
                placeholder="Digite o Valor"
                value={value}
                onChange={(e) => {
                  const regex = /^[0-9,.]*$/;
                  if (regex.test(e.target.value) || e.target.value === '') {
                    setValue(e.target.value);
                  }
                }}
                className="input"
                required
              />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          {id ? (
            <button className="button is-info" onClick={handleUpdateTransaction}>
              Atualizar
            </button>
          ) : (
            <button className="button is-primary" onClick={() => {cleanFormData(); handleCreateTransaction();}}>
              Criar
            </button>
          )}
            <button className="button" onClick={() => {cleanFormData(); handleModal();}}>
              Cancelar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransactionModal;
