import { useState, useEffect } from 'react';

function AlumnoManager() {
  const [alumnos, setAlumnos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [nuevoAlumno, setNuevoAlumno] = useState({
    usuario: '',
    fechaNacimiento: '',
    escuela: '',
    dniTutor: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/alumnes');
      if (!res.ok) throw new Error('Error al cargar alumnos');
      const data = await res.json();
      setAlumnos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAlumno((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearOActualizar = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editandoUsuario) {
        // ACTUALIZAR ALUMNO
        const res = await fetch(`http://127.0.0.1:8000/alumneUpdate/${editandoUsuario}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuari: editandoUsuario,
            data_naixement: nuevoAlumno.fechaNacimiento,
            escola: nuevoAlumno.escuela,
            dni_tutor: nuevoAlumno.dniTutor,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || 'Error al actualizar alumno');
        }
      } else {
        // CREAR NUEVO ALUMNO
        const personaRes = await fetch('http://127.0.0.1:8000/personaInsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuari: nuevoAlumno.usuario,
            contrassenya: '1234',
          }),
        });

        if (!personaRes.ok) {
          const err = await personaRes.json();
          throw new Error(err.detail || 'Error al crear persona');
        }

        const alumneRes = await fetch('http://127.0.0.1:8000/alumneInsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuari: nuevoAlumno.usuario,
            data_naixement: nuevoAlumno.fechaNacimiento,
            escola: nuevoAlumno.escuela,
            dni_tutor: nuevoAlumno.dniTutor,
          }),
        });

        if (!alumneRes.ok) {
          const err = await alumneRes.json();
          throw new Error(err.detail || 'Error al crear alumno');
        }
      }

      await fetchAlumnos();
      setNuevoAlumno({ usuario: '', fechaNacimiento: '', escuela: '', dniTutor: '' });
      setMostrarFormulario(false);
      setEditandoUsuario(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (alumno) => {
    setNuevoAlumno({
      usuario: alumno.usuari,
      fechaNacimiento: alumno.data_naixement,
      escuela: alumno.escola || '',
      dniTutor: alumno.dni_tutor || '',
    });
    setEditandoUsuario(alumno.usuari);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (usuari) => {
    if (!window.confirm('¿Seguro que quieres eliminar este alumno?')) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/alumneDelete/${usuari}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al eliminar alumno');
      }

      await fetchAlumnos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>Gestión de Alumnos</h3>

      <button onClick={() => {
        setMostrarFormulario(!mostrarFormulario);
        setEditandoUsuario(null);
        setNuevoAlumno({ usuario: '', fechaNacimiento: '', escuela: '', dniTutor: '' });
      }} style={{ marginBottom: '1rem' }}>
        {mostrarFormulario ? 'Cancelar' : 'Añadir alumno'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleCrearOActualizar} style={{ marginBottom: '2rem' }}>
          <div>
            <label>Usuario: </label>
            <input
              type="text"
              name="usuario"
              value={nuevoAlumno.usuario}
              onChange={handleInputChange}
              required
              disabled={!!editandoUsuario}
            />
          </div>
          <div>
            <label>Fecha de nacimiento: </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={nuevoAlumno.fechaNacimiento}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Escuela: </label>
            <input
              type="text"
              name="escuela"
              value={nuevoAlumno.escuela}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>DNI del tutor legal: </label>
            <input
              type="text"
              name="dniTutor"
              value={nuevoAlumno.dniTutor}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">{editandoUsuario ? 'Guardar cambios' : 'Guardar alumno'}</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}

      <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Fecha de nacimiento</th>
            <th>Escuela</th>
            <th>DNI Tutor Legal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.usuari}>
              <td>{alumno.usuari}</td>
              <td>{alumno.data_naixement}</td>
              <td>{alumno.escola}</td>
              <td>{alumno.dni_tutor}</td>
              <td>
                <button onClick={() => handleEditar(alumno)}>Editar</button>
                <button onClick={() => handleEliminar(alumno.usuari)} style={{ marginLeft: '0.5rem' }}>Eliminar</button>
              </td>
            </tr>
          ))}
          {alumnos.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay alumnos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlumnoManager;
