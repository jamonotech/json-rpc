import React, { useState, useEffect } from "react";
import { Edit, Delete } from '@mui/icons-material';
import './person.css';

async function JsonRpcRequest(method, params, id = 1) {
  const response = await fetch("http://localhost:8080/jsonrpc/person", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

function PersonComponent() {
  const [persons, setPersons] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  async function fetchPersons() {
    const data = await JsonRpcRequest("listPerson", []);
    setPersons(data);
    setAllPersones(data);
  }

  function openDialog(person = null) {
    setEditingPerson(person || { lastName: "", firstName: "", dateOfBirth: "", address: "", phoneNumber: "" });
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog(false);
    setEditingPerson(null);
  }

  async function savePerson() {
    if (editingPerson) {
      const { lastName, firstName, dateOfBirth, address, phoneNumber } = editingPerson;

      if (!lastName || !firstName || !dateOfBirth || !address || !phoneNumber) {
        alert("Tous les champs sont obligatoires!");
        return;
      }

      const cleanedPerson = {
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        dateOfBirth: dateOfBirth.trim(),
        address: address?.trim() || "",
        phoneNumber: phoneNumber?.trim() || ""
      };

      try {
        if (editingPerson.id) {
          await JsonRpcRequest("editPerson", [editingPerson.id, cleanedPerson]);
        } else {
          await JsonRpcRequest("addPerson", [cleanedPerson]);
        }

        closeDialog();
        fetchPersons();
      } catch (err) {
        alert("Erreur lors de l'enregistrement : " + err.message);
      }
    }
  }

  async function deletePerson(id) {
    if (window.confirm("Voulez-vous vraiment supprimer cette personne ?")) {
      await JsonRpcRequest("deletePerson", [id]);
      fetchPersons();
    }
  }

  function handleSearchChange(e) {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setPersons(allPersons);
      return;
    }

    const isNumeric = !isNaN(value) && value.trim() !== "";

    if (isNumeric) {
      JsonRpcRequest("getPerson", [parseInt(value)])
        .then((result) => {
          if (result) {
            setPersons([result]);
          } else {
            setPersons([]);
          }
        })
        .catch(() => setPersons([]));
    } else {
      const filtered = allPersons.filter(p =>
        p &&
        (
          p.lastName?.toLowerCase().includes(value) ||
          p.firstName?.toLowerCase().includes(value)
        )
      );
      setPersons(filtered);
    }
  }

  return (
    <div className="page-container">
      <div className="page-inner">
        <h1 className="title">Gestion des Personnes</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Rechercher une personne..."
            style={{
              padding: "10px 16px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e0",
              width: "300px"
            }}
          />
          <button className="btn-ajouter" onClick={() => openDialog()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Ajouter</span>
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                {['ID', 'Nom', 'Prénom', 'Date de Naissance', 'Adresse', 'Téléphone', 'Actions'].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {persons.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', fontStyle: 'italic', color: '#6b7280' }}>
                    Aucune personne trouvée.
                  </td>
                </tr>
              ) : (
                persons.map((p) =>
                  p ? (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.lastName}</td>
                      <td>{p.firstName}</td>
                      <td>{p.dateOfBirth}</td>
                      <td>{p.address}</td>
                      <td>{p.phoneNumber}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button className="action-btn btn-edit" onClick={() => openDialog(p)}>
                            <Edit fontSize="small" />
                          </button>
                          <button className="action-btn btn-delete" onClick={() => deletePerson(p.id)}>
                            <Delete fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null
                )
              )}
            </tbody>
          </table>
        </div>

        {showDialog && (
          <div className="dialog">
            <div className="dialog-box">
              <h2>{editingPerson?.id ? 'Modifier Personne' : 'Ajouter Personne'}</h2>
              {['lastName', 'firstName', 'dateOfBirth', 'address', 'phoneNumber'].map((f) => (
                <input
                  key={f}
                  placeholder={
                    f === 'lastName' ? 'Nom' :
                    f === 'firstName' ? 'Prénom' :
                    f === 'dateOfBirth' ? 'Date de Naissance' :
                    f === 'address' ? 'Adresse' :
                    'Téléphone'
                  }
                  value={editingPerson?.[f] || ''}
                  onChange={(e) => setEditingPerson({ ...editingPerson, [f]: e.target.value })}
                />
              ))}
              <div className="actions">
                <button className="save" onClick={savePerson}>Enregistrer</button>
                <button className="cancel" onClick={closeDialog}>Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonComponent;
