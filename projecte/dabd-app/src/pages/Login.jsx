import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Paso 1: Buscar el Trainer
      const trainerRes = await fetch('http://127.0.0.1:8000/trainerName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuari: username }),
      });

      const trainerData = await trainerRes.json();
      if (!trainerData) {
        throw new Error('No existeix cap trainer amb aquest usuari');
      }

      // Paso 2: Buscar la Persona
      const personaRes = await fetch('http://127.0.0.1:8000/personaName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuari: username }),
      });

      const personaData = await personaRes.json();
      if (!personaData) {
        throw new Error('No s\'ha trobat la persona associada');
      }

      if (personaData.contrassenya !== password) {
        throw new Error('Contrasenya incorrecta');
      }

      localStorage.setItem('trainer_loguejat', JSON.stringify(trainerData));
      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'Error al iniciar sessió');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <h2>Inici de Sessió</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}
      >
        <input
          type="text"
          placeholder="Usuari"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contrasenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sessió</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default Login;
