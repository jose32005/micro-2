import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './styles/Home.css';

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
            setNombreVideojuegoPreferido(docSnap.data().titulo);
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
  <h1 className="home-title">Clubes de Videojuegos 🕹️</h1>
  <div className="content-container">
    <div className="perfil-usuario">
      {currentUser ? (
        <>
          <h2>Perfil de Usuario 🔰</h2>
          <div>
          <p>Nombre: {currentUser.nombre || 'No especificado'}</p>
          <p>Apellido: {currentUser.apellido || 'No especificado'}</p>
          <p>Email: {currentUser.email}</p>
          <p>Username: {currentUser.username || 'No especificado'}</p>
          <p>Videojuego preferido: {nombreVideojuegoPreferido || 'No especificado'}</p>
          </div>
          <button onClick={() => navigate('/editar-perfil')}>Editar Perfil</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
    <div className="clubes-y-busqueda">
      <button className="buscar-videojuegos-btn" onClick={() => navigate('/search')}>Buscar Videojuegos</button>
      <div className="lista-clubes">
        {clubes.map((club) => (
          <div className="club-card" key={club.id}>
            <h2>{club.nombre}</h2>
            <p>{club.descripcion}</p>
            <Link to={`/club/${club.id}`}>Ver más detalles</Link>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  );
}

export default Home;

