// src/pages/TrainerProfile.jsx
import { useNavigate } from 'react-router-dom';

function TrainerProfile() {
  const navigate = useNavigate();

  // Datos simulados
  const trainer = {
    nombre: 'Daniel Fernández',
    email: 'daniel.fernandez@upc.edu',
  };

  return (
    <div>
      <h2>Perfil del Trainer</h2>
      <p><strong>Nombre:</strong> {trainer.nombre}</p>
      <p><strong>Email:</strong> {trainer.email}</p>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>
        Volver al Dashboard
      </button>
    </div>
  );
}

export default TrainerProfile;
