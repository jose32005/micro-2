import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

function EditProfile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(currentUser?.nombre || '');
  const [apellido, setApellido] = useState(currentUser?.apellido || '');
  const [videojuegoPreferido, setVideojuegoPreferido] = useState(currentUser?.videojuego_preferido || '');
  const [loading, setLoading] = useState(false);
  const [videojuegos, setVideojuegos] = useState([]);

  useEffect(() => {
    const cargarVideojuegos = async () => {
      const querySnapshot = await getDocs(collection(db, "videojuegos"));
      setVideojuegos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    cargarVideojuegos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Actualizar el documento del usuario en Firestore
    const userDocRef = doc(db, "usuarios", currentUser.docId);
    try {
      await updateDoc(userDocRef, {
        nombre: nombre,
        apellido: apellido,
        videojuego_preferido: videojuegoPreferido,
      });
      
      // Opcional: Actualizar la información del usuario en el contexto
      if (updateCurrentUser) {
        updateCurrentUser({ nombre, apellido, videojuego_preferido: videojuegoPreferido });
      }

      navigate('/'); // Redirige al usuario a su perfil o a la página que consideres
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label>
        Apellido:
        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
      </label>
      <label>
        Videojuego Preferido:
        <select value={videojuegoPreferido} onChange={(e) => setVideojuegoPreferido(e.target.value)}>
          <option value="">Selecciona tu videojuego preferido</option>
          {videojuegos.map((juego) => (
            <option key={juego.id} value={juego.id}>{juego.titulo}</option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={loading}>Actualizar Perfil</button>
    </form>
  );
}

export default EditProfile;

