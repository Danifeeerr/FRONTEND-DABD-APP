import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TrainerProfile() {
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);

  useEffect(() => {
    const trainerData = localStorage.getItem('trainer_loguejat');
    if (!trainerData) {
      navigate('/login');
    } else {
      setTrainer(JSON.parse(trainerData));
    }
  }, [navigate]);

  if (!trainer) {
    return <p>Carregant perfil...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('trainer_loguejat');
    navigate('/');
  };

  return (
    <div>
      <h2>Perfil del Trainer</h2>
      <p><strong>Usuari:</strong> {trainer.usuari}</p>
      <p><strong>Email:</strong> {trainer.correu}</p>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem', marginRight: '1rem' }}>
        Tornar al Dashboard
      </button>

      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Log Out
      </button>
    </div>
  );
}

export default TrainerProfile;
