import { useState } from 'react';

function MatriculaManager() {
  const [matriculas, setMatriculas] = useState([
    {
      id: 1,
      alumno: 'claudia123',
      grupoId: 1001,
      fechaInicio: '2024-01-15',
      fechaFin: '2024-06-15',
      estado: 'activa',
      precio: 250,
      descuento: 10,
      nota: 8.5,
      comentarioTrainer: 'Muy participativa y puntual.',
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [matriculaEditandoId, setMatriculaEditandoId] = useState(null);

  const [form, setForm] = useState({
    alumno: '',
    grupoId: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'activa',
    precio: '',
    descuento: '',
    nota: '',
    comentarioTrainer: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Aseguramos que descuento y nota no sean negativos
    if ((name === 'descuento' || name === 'nota') && Number(value) < 0) {
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrear = (e) => {
    e.preventDefault();

    if (form.fechaInicio > form.fechaFin) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    if (Number(form.descuento) < 0 || Number(form.nota) < 0) {
      alert("El descuento y la nota no pueden ser negativos.");
      return;
    }

    if (modoEdicion) {
      setMatriculas((prev) =>
        prev.map((m) =>
          m.id === matriculaEditandoId ? { ...form, id: m.id } : m
        )
      );
      setModoEdicion(false);
      setMatriculaEditandoId(null);
    } else {
      const nueva = { ...form, id: Date.now() };
      setMatriculas((prev) => [...prev, nueva]);
    }

    setForm({
      alumno: '',
      grupoId: '',
      fechaInicio: '',
      fechaFin: '',
      estado: 'activa',
      precio: '',
      descuento: '',
      nota: '',
      comentarioTrainer: '',
    });
    setMostrarFormulario(false);
  };

  const handleEliminar = (id) => {
    setMatriculas((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEditar = (matricula) => {
    setForm(matricula);
    setMostrarFormulario(true);
    setModoEdicion(true);
    setMatriculaEditandoId(matricula.id);
  };

  return (
    <div>
      <h3>Gestió de Matrícules</h3>

      <button onClick={() => {
        setMostrarFormulario(!mostrarFormulario);
        setModoEdicion(false);
        setForm({
          alumno: '',
          grupoId: '',
          fechaInicio: '',
          fechaFin: '',
          estado: 'activa',
          precio: '',
          descuento: '',
          nota: '',
          comentarioTrainer: '',
        });
      }}>
        {mostrarFormulario ? 'Cancelar' : 'Afegir matrícula'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleCrear} style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <div>
            <label>Alumne: </label>
            <input name="alumno" value={form.alumno} onChange={handleInputChange} required />
          </div>
          <div>
            <label>ID Grup: </label>
            <input type="number" name="grupoId" value={form.grupoId} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Inici matrícula: </label>
            <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Fi matrícula: </label>
            <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Estat: </label>
            <select name="estado" value={form.estado} onChange={handleInputChange}>
              <option value="activa">Activa</option>
              <option value="finalitzada">Finalitzada</option>
            </select>
          </div>
          <div>
            <label>Preu (€): </label>
            <input type="number" name="precio" value={form.precio} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Descompte (%): </label>
            <input
              type="number"
              name="descuento"
              value={form.descuento}
              min="0"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Nota: </label>
            <input
              type="number"
              name="nota"
              step="0.1"
              min="0"
              value={form.nota}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Comentari del trainer: </label>
            <input name="comentarioTrainer" value={form.comentarioTrainer} onChange={handleInputChange} />
          </div>
          <button type="submit">{modoEdicion ? 'Guardar cambios' : 'Crear matrícula'}</button>
        </form>
      )}

      <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Alumne</th>
            <th>ID Grup</th>
            <th>Inici</th>
            <th>Fi</th>
            <th>Estat</th>
            <th>Preu</th>
            <th>Descompte</th>
            <th>Nota</th>
            <th>Comentari Trainer</th>
            <th>Accions</th>
          </tr>
        </thead>
        <tbody>
          {matriculas.map((m) => (
            <tr key={m.id}>
              <td>{m.alumno}</td>
              <td>{m.grupoId}</td>
              <td>{m.fechaInicio}</td>
              <td>{m.fechaFin}</td>
              <td>{m.estado}</td>
              <td>{m.precio}€</td>
              <td>{m.descuento}%</td>
              <td>{m.nota}</td>
              <td>{m.comentarioTrainer}</td>
              <td>
                <button onClick={() => handleEditar(m)}>Edita</button>
                <button onClick={() => handleEliminar(m.id)}>Elimina</button>
              </td>
            </tr>
          ))}
          {matriculas.length === 0 && (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center' }}>No hi ha matrícules registrades.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MatriculaManager;
