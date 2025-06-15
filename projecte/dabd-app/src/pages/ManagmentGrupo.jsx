import { useState, useEffect } from 'react';

function GrupoManager() {
  const [grupos, setGrupos] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [grupoEditandoId, setGrupoEditandoId] = useState(null);

  const [formGrupo, setFormGrupo] = useState({
    dia: '',
    horaInicio: '',
    horaFin: '',
    codigo: '',      // codi_curs
    trainer: '',
    aula: '',        // aula_numero (number como string)
  });

  // --- Carga inicial grupos, aulas y cursos ---
  const fetchGrupos = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/grups');
      if (!res.ok) throw new Error('Error al cargar grupos');
      const data = await res.json();
      const gruposFormateados = data.map((g) => ({
        id: g.id,
        dia: g.dia_setmanal,
        horaInicio: g.hora_ini.slice(0, 5),
        horaFin: g.hora_fi.slice(0, 5),
        codigo: g.codi_curs || '',
        trainer: g.trainer_assignat || '',
        aula: g.aula_numero !== null && g.aula_numero !== undefined ? String(g.aula_numero) : '',
      }));
      setGrupos(gruposFormateados);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchAulas = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/aules');
      if (!res.ok) throw new Error('Error al cargar aulas');
      const data = await res.json();
      setAulas(data);  // data = [{numero: 101, capacitat: 20}, ...]
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchCursos = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/cursos');
      if (!res.ok) throw new Error('Error al cargar cursos');
      const data = await res.json();
      setCursos(data); // data = [{codi: 'GRP001'}, ...]
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchGrupos();
    fetchAulas();
    fetchCursos();
  }, []);

  // --- Manejo formulario ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormGrupo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearActualizar = async (e) => {
    e.preventDefault();

    if (formGrupo.horaInicio >= formGrupo.horaFin) {
      alert('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    // Construimos payload para el backend
    const payload = {
      dia_setmanal: formGrupo.dia,
      hora_ini: formGrupo.horaInicio,
      hora_fi: formGrupo.horaFin,
      codi_curs: formGrupo.codigo || null,
      trainer_assignat: formGrupo.trainer || null,
      aula_numero: formGrupo.aula ? Number(formGrupo.aula) : null,
    };

    try {
      let res;
      if (modoEdicion) {
        res = await fetch(`http://127.0.0.1:8000/grupUpdate/${grupoEditandoId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('http://127.0.0.1:8000/grupInsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al guardar grupo');
      }

      // Refrescar la lista
      await fetchGrupos();

      setFormGrupo({
        dia: '',
        horaInicio: '',
        horaFin: '',
        codigo: '',
        trainer: '',
        aula: '',
      });
      setMostrarFormulario(false);
      setModoEdicion(false);
      setGrupoEditandoId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('Estás seguro de eliminar este grupo?')) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/grupDelete/${id}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al eliminar grupo');
      }
      // Refrescar lista
      await fetchGrupos();
    } catch (error) {
      alert(error.message);
    }
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
        <form onSubmit={handleCrearActualizar} style={{ marginBottom: '2rem' }}>
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
            <label>Curs: </label>
            <select name="codigo" value={formGrupo.codigo} onChange={handleInputChange} required>
              <option value="">-- Selecciona un curs --</option>
              {cursos.map((c) => (
                <option key={c.codi} value={c.codi}>
                  {c.codi}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Trainer responsable: </label>
            <input type="text" name="trainer" value={formGrupo.trainer} onChange={handleInputChange} />
          </div>

          <div>
            <label>Aula: </label>
            <select name="aula" value={formGrupo.aula} onChange={handleInputChange} required>
              <option value="">-- Selecciona una aula --</option>
              {aulas.map((a) => (
                <option key={a.numero} value={a.numero}>
                  {a.numero} (capacitat: {a.capacitat})
                </option>
              ))}
            </select>
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
          {grupos.length > 0 ? (
            grupos.map((grupo) => (
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
            ))
          ) : (
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
