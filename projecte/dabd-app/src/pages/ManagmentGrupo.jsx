import { useState } from 'react';

function GrupoManager() {
  const [grupos, setGrupos] = useState([
    {
      id: 1,
      dia: 'Lunes',
      horaInicio: '17:00',
      horaFin: '18:30',
      codigo: 'GRP001',
      trainer: 'Jordi Pons',
      aula: '101',
    },
    {
      id: 2,
      dia: 'Miércoles',
      horaInicio: '18:30',
      horaFin: '20:00',
      codigo: 'GRP002',
      trainer: 'Marta García',
      aula: '202',
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [grupoEditandoId, setGrupoEditandoId] = useState(null);

  const [formGrupo, setFormGrupo] = useState({
    dia: '',
    horaInicio: '',
    horaFin: '',
    codigo: '',
    trainer: '',
    aula: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormGrupo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrear = (e) => {
    e.preventDefault();

    if (formGrupo.horaInicio >= formGrupo.horaFin) {
        alert("La hora de inicio debe ser anterior a la hora de fin.");
        return;
    }

    if (modoEdicion) {
        setGrupos((prev) =>
        prev.map((grupo) =>
            grupo.id === grupoEditandoId ? { ...formGrupo, id: grupo.id } : grupo
        )
        );
        setModoEdicion(false);
        setGrupoEditandoId(null);
    } else {
        const nuevoGrupo = { ...formGrupo, id: Date.now() };
        setGrupos((prev) => [...prev, nuevoGrupo]);
    }

    setFormGrupo({
        dia: '',
        horaInicio: '',
        horaFin: '',
        codigo: '',
        trainer: '',
        aula: '',
    });
    setMostrarFormulario(false);
   };

   const handleEliminar = (id) => {
    setGrupos((prev) => prev.filter((g) => g.id !== id));
   };

  const handleEditar = (grupo) => {
    setFormGrupo({
      dia: grupo.dia,
      horaInicio: grupo.horaInicio,
      horaFin: grupo.horaFin,
      codigo: grupo.codigo,
      trainer: grupo.trainer,
      aula: grupo.aula,
    });
    setModoEdicion(true);
    setGrupoEditandoId(grupo.id);
    setMostrarFormulario(true);
  };

  return (
    <div>
      <h3>Gestió de Grups</h3>

      <button
        onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          setModoEdicion(false);
          setFormGrupo({
            dia: '',
            horaInicio: '',
            horaFin: '',
            codigo: '',
            trainer: '',
            aula: '',
          });
        }}
        style={{ marginBottom: '1rem' }}
      >
        {mostrarFormulario ? 'Cancelar' : 'Afegir grup'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleCrear} style={{ marginBottom: '2rem' }}>
          <div>
            <label>Día: </label>
            <input type="text" name="dia" value={formGrupo.dia} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Hora d'inici: </label>
            <input type="time" name="horaInicio" value={formGrupo.horaInicio} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Hora de fi: </label>
            <input type="time" name="horaFin" value={formGrupo.horaFin} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Codi del grup: </label>
            <input type="text" name="codigo" value={formGrupo.codigo} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Trainer responsable: </label>
            <input type="text" name="trainer" value={formGrupo.trainer} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Aula: </label>
            <input type="text" name="aula" value={formGrupo.aula} onChange={handleInputChange} required />
          </div>
          <button type="submit">{modoEdicion ? 'Guardar cambios' : 'Guardar grupo'}</button>
        </form>
      )}

      <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Día</th>
            <th>Hora d'inici</th>
            <th>Hora de fi</th>
            <th>Codi del grup</th>
            <th>Trainer</th>
            <th>Aula</th>
            <th>Accions</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <tr key={grupo.id}>
              <td>{grupo.dia}</td>
              <td>{grupo.horaInicio}</td>
              <td>{grupo.horaFin}</td>
              <td>{grupo.codigo}</td>
              <td>{grupo.trainer}</td>
              <td>{grupo.aula}</td>
              <td>
                <button onClick={() => handleEditar(grupo)}>Edita</button>{' '}
                <button onClick={() => handleEliminar(grupo.id)}>Elimina</button>
              </td>
            </tr>
          ))}
          {grupos.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No hi ha grups registrats.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GrupoManager;
