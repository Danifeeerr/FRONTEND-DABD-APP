import { useState } from 'react';

function AlumnoManager() {
  const [alumnos, setAlumnos] = useState([
    {
      id: 1,
      usuario: 'claudia123',
      fechaNacimiento: '2010-05-12',
      escuela: 'Escola Sagrada Família',
      dniTutor: '12345678A',
    },
    {
      id: 2,
      usuario: 'javier_lopez',
      fechaNacimiento: '2009-11-03',
      escuela: 'Institut Ramon Llull',
      dniTutor: '87654321B',
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [alumnoEditandoId, setAlumnoEditandoId] = useState(null);

  const [formAlumno, setFormAlumno] = useState({
    usuario: '',
    fechaNacimiento: '',
    escuela: '',
    dniTutor: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormAlumno((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrear = (e) => {
    e.preventDefault();

    if (modoEdicion) {
      setAlumnos((prev) =>
        prev.map((alumno) =>
          alumno.id === alumnoEditandoId ? { ...formAlumno, id: alumno.id } : alumno
        )
      );
      setModoEdicion(false);
      setAlumnoEditandoId(null);
    } else {
      const alumnoConId = { ...formAlumno, id: Date.now() };
      setAlumnos((prev) => [...prev, alumnoConId]);
    }

    setFormAlumno({
      usuario: '',
      fechaNacimiento: '',
      escuela: '',
      dniTutor: '',
    });
    setMostrarFormulario(false);
  };

  const handleEliminar = (id) => {
    setAlumnos((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEditar = (alumno) => {
    setFormAlumno({
      usuario: alumno.usuario,
      fechaNacimiento: alumno.fechaNacimiento,
      escuela: alumno.escuela,
      dniTutor: alumno.dniTutor,
    });
    setModoEdicion(true);
    setAlumnoEditandoId(alumno.id);
    setMostrarFormulario(true);
  };

  return (
    <div>
      <h3>Gestión de Alumnos</h3>

      <button
        onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          setModoEdicion(false);
          setFormAlumno({
            usuario: '',
            fechaNacimiento: '',
            escuela: '',
            dniTutor: '',
          });
        }}
        style={{ marginBottom: '1rem' }}
      >
        {mostrarFormulario ? 'Cancelar' : 'Añadir alumno'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleCrear} style={{ marginBottom: '2rem' }}>
          <div>
            <label>Usuario: </label>
            <input
              type="text"
              name="usuario"
              value={formAlumno.usuario}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Fecha de nacimiento: </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formAlumno.fechaNacimiento}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Escuela: </label>
            <input
              type="text"
              name="escuela"
              value={formAlumno.escuela}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>DNI del tutor legal: </label>
            <input
              type="text"
              name="dniTutor"
              value={formAlumno.dniTutor}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">
            {modoEdicion ? 'Guardar cambios' : 'Guardar alumno'}
          </button>
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
            <tr key={alumno.id}>
              <td>{alumno.usuario}</td>
              <td>{alumno.fechaNacimiento}</td>
              <td>{alumno.escuela}</td>
              <td>{alumno.dniTutor}</td>
              <td>
                <button onClick={() => handleEditar(alumno)}>Editar</button>{' '}
                <button onClick={() => handleEliminar(alumno.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {alumnos.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No hay alumnos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlumnoManager;
