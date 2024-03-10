import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Asegúrate de ajustar la ruta de importación según tu estructura de proyecto
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Home() {
  const [clubes, setClubes] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [nombreVideojuegoPreferido, setNombreVideojuegoPreferido] = useState('');

  useEffect(() => {
    const cargarClubes = async () => {
      const querySnapshot = await getDocs(collection(db, "clubes"));
      setClubes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    cargarClubes();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }else {
      const obtenerNombreVideojuegoPreferido = async () => {
        if (currentUser.videojuego_preferido) {
          const docRef = doc(db, "videojuegos", currentUser.videojuego_preferido);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setNombreVideojuegoPreferido(docSnap.data().titulo); // Asumiendo que el campo se llama 'titulo'
          } else {
            console.log("No se encontró el videojuego preferido");
          }
        }
      };

      obtenerNombreVideojuegoPreferido();
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div className="home-container">
      <div className="perfil-usuario">
        {currentUser ? (
          <>
            <h2>Perfil de Usuario</h2>
            <p>Nombre: {currentUser.nombre || 'No especificado'}</p>
            <p>Apellido: {currentUser.apellido || 'No especificado'}</p>
            <p>Email: {currentUser.email}</p>
            <p>Username: {currentUser.username || 'No especificado'}</p>
            <p>Videojuego preferido: {nombreVideojuegoPreferido || 'No especificado'}</p>
            <button onClick={() => navigate('/editar-perfil')}>Editar Perfil</button>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <p>Cargando perfil...</p>
        )}
      </div>
      <div className="lista-clubes">
        <h1>Clubes de Videojuegos</h1>
        {clubes.map((club) => (
          <div key={club.id}>
            <h2>{club.nombre}</h2>
            <p>{club.descripcion}</p>
            <Link to={`/club/${club.id}`}>Ver más detalles</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

