import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import TrainerDashboard from './pages/TrainerDashboard.jsx';
import TrainerProfile from './pages/TrainerProfile.jsx';
import './App.css';

// Pantalla de inicio con botón al login
function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Benvinguts a UPC School App</h1>
      <button
        onClick={() => navigate('/login')}
        style={{ marginTop: '2rem', padding: '1rem 2rem', fontSize: '1rem' }}
      >
        Iniciar Sessió
      </button>
    </div>
  );
}

// Envolvemos el router para que funcione el hook useNavigate en Home
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<TrainerDashboard />} />
        <Route path="/perfil" element={<TrainerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
