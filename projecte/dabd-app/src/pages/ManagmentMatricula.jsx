import { useState, useEffect } from 'react';

function MatriculaManager() {
  const [matriculas, setMatriculas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [matriculaEditando, setMatriculaEditando] = useState(null);

  const [form, setForm] = useState({
    alumne_user: '',
    grup_id: '',
    data_inici: '',
    data_fi: '',
    estat: 'activa',
    preu: '',
    descompte: '',
    nota: '',
    comentari_trainer: '',
  });

  // Carga inicial de matrículas y grupos
  useEffect(() => {
    fetch('http://127.0.0.1:8000/matricules')
      .then(res => res.json())
      .then(data => setMatriculas(data))
      .catch(err => console.error("Error al cargar matrículas:", err));

    fetch('http://127.0.0.1:8000/grups')
      .then(res => res.json())
      .then(data => setGrupos(data))
      .catch(err => console.error("Error al cargar grupos:", err));
  }, []);

  const resetForm = () => {
    setForm({
      alumne_user: '',
      grup_id: '',
      data_inici: '',
      data_fi: '',
      estat: 'activa',
      preu: '',
      descompte: '',
      nota: '',
      comentari_trainer: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'descompte' || name === 'nota') && Number(value) < 0) return;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCrearOActualizar = async (e) => {
    e.preventDefault();
    if (form.data_inici > form.data_fi) return alert("La fecha inicio debe ser anterior a la de fin.");

    const payload = {
      alumne_user: form.alumne_user,
      grup_id: Number(form.grup_id),
      data_ini: form.data_inici,
      data_fi: form.data_fi,
      estat: form.estat,
      preu: parseFloat(form.preu),
      descompte: parseFloat(form.descompte),
      nota: form.nota ? parseFloat(form.nota) : null,
      comentari_trainer: form.comentari_trainer,
    };

    try {
      if (modoEdicion && matriculaEditando) {
        await fetch(`http://127.0.0.1:8000/matriculaUpdate/${matriculaEditando.alumne_user}/${matriculaEditando.grup_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('http://127.0.0.1:8000/matriculaInsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const res = await fetch('http://127.0.0.1:8000/matricules');
      setMatriculas(await res.json());

      resetForm();
      setMostrarFormulario(false);
      setModoEdicion(false);
      setMatriculaEditando(null);
    } catch (err) {
      console.error("Error al guardar matrícula:", err);
      alert("Ocurrió un error al guardar.");
    }
  };

  const handleEliminar = async (alumne_user, grup_id) => {
    try {
      await fetch(`http://127.0.0.1:8000/martriculaDelete/${alumne_user}/${grup_id}`, { method: 'POST' });
      setMatriculas(prev => prev.filter(m => !(m.alumne_user === alumne_user && m.grup_id === grup_id)));
    } catch (err) {
      console.error("Error al eliminar matrícula:", err);
    }
  };

  const handleEditar = (m) => {
    setForm({
      alumne_user: m.alumne_user,
      grup_id: String(m.grup_id),
      data_inici: m.data_ini,
      data_fi: m.data_fi,
      estat: m.estat,
      preu: m.preu,
      descompte: m.descompte,
      nota: m.nota,
      comentari_trainer: m.comentari_trainer,
    });
    setMostrarFormulario(true);
    setModoEdicion(true);
    setMatriculaEditando(m);
  };

  return (
    <div>
      <h3>Gestió de Matrícules</h3>

      <button onClick={() => { setMostrarFormulario(!mostrarFormulario); setModoEdicion(false); resetForm(); }}>
        {mostrarFormulario ? 'Cancelar' : 'Afegir matrícula'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleCrearOActualizar} style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ccc' }}>
          <div><label>Alumne:</label><input name="alumne_user" value={form.alumne_user} onChange={handleInputChange} required /></div>
          <div>
            <label>Grup:</label>
            <select name="grup_id" value={form.grup_id} onChange={handleInputChange} required>
              <option value="">-- Selecciona grup --</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>
                  {g.codi_curs} (ID:{g.id})
                </option>
              ))}
            </select>
          </div>
          <div><label>Inici matrícula:</label><input type="date" name="data_inici" value={form.data_inici} onChange={handleInputChange} required /></div>
          <div><label>Fi matrícula:</label><input type="date" name="data_fi" value={form.data_fi} onChange={handleInputChange} required /></div>
          <div>
            <label>Estat:</label>
            <select name="estat" value={form.estat} onChange={handleInputChange}>
              <option value="activa">Activa</option>
              <option value="finalitzada">Finalitzada</option>
            </select>
          </div>
          <div><label>Preu (€):</label><input type="number" name="preu" value={form.preu} onChange={handleInputChange} required /></div>
          <div><label>Descompte (%):</label><input type="number" name="descompte" value={form.descompte} min="0" onChange={handleInputChange} /></div>
          <div><label>Nota:</label><input type="number" name="nota" step="0.1" min="0" value={form.nota} onChange={handleInputChange} /></div>
          <div><label>Comentari:</label><input name="comentari_trainer" value={form.comentari_trainer} onChange={handleInputChange} /></div>
          <button type="submit">{modoEdicion ? 'Guardar cambios' : 'Crear matrícula'}</button>
        </form>
      )}

      <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Alumne</th><th>Grup ID</th><th>Inici</th><th>Fi</th><th>Estat</th><th>Preu</th><th>Descompte</th><th>Nota</th><th>Comentari</th><th>Accions</th>
          </tr>
        </thead>
        <tbody>
          {matriculas.length === 0 ? (
            <tr><td colSpan="10" style={{ textAlign: 'center' }}>No hi ha matrícules.</td></tr>
          ) : (
            matriculas.map(m => (
              <tr key={`${m.alumne_user}-${m.grup_id}`}>
                <td>{m.alumne_user}</td>
                <td>{m.grup_id}</td>
                <td>{m.data_ini}</td>
                <td>{m.data_fi}</td>
                <td>{m.estat}</td>
                <td>{m.preu}€</td>
                <td>{m.descompte}%</td>
                <td>{m.nota ?? '—'}</td>
                <td>{m.comentari_trainer ?? '—'}</td>
                <td>
                  <button onClick={() => handleEditar(m)}>Edita</button>{' '}
                  <button onClick={() => handleEliminar(m.alumne_user, m.grup_id)}>Elimina</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MatriculaManager;
