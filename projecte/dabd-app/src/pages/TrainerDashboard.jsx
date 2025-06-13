import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ManagementAlumno from './ManagementAlumno';
import ManagmentGrupo from './ManagmentGrupo';
import ManagmentMatricula from './ManagmentMatricula';

function TrainerDashboard() {
  const [seccion, setSeccion] = useState('alumnos');
  const navigate = useNavigate();

  const renderContenido = () => {
    switch (seccion) {
      case 'alumnos':
        return <ManagementAlumno />;
      case 'grupos':
        return <ManagmentGrupo />;
      case 'matriculas':
        return <ManagmentMatricula />;
      default:
        return <p>Selecciona una sección</p>;
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h2>Panel del Trainer</h2>

      <div style={{ margin: '2rem 0', display: 'flex', gap: '1rem' }}>
        <button onClick={() => setSeccion('alumnos')}>Gestionar Alumnos</button>
        <button onClick={() => setSeccion('grupos')}>Gestionar Grupos</button>
        <button onClick={() => setSeccion('matriculas')}>Gestionar Matrículas</button>
        <button onClick={() => navigate('/perfil')} style={{ marginRight: '1rem' }}>Ver Perfil</button>
      </div>

      <div style={{ width: '100%', maxWidth: '800px' }}>{renderContenido()}</div>
    </div>
  );
}

export default TrainerDashboard;
