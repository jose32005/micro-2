import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; 
import './styles/Clubes.css';

function ClubDetails() {
  const { id } = useParams(); 
  const [club, setClub] = useState(null);
  const [videojuegos, setVideojuegos] = useState([]);
  const navigate = useNavigate();
  const { currentUser, updateCurrentUserMembresias } = useAuth();

  useEffect(() => {
    const obtenerDatosClub = async () => {
      // Obtener información del club
      const docRef = doc(db, "clubes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClub(docSnap.data());
        const juegosPromesas = docSnap.data().videojuegos.map(async (juegoId) => {
          const juegoRef = doc(db, "videojuegos", juegoId);
          const juegoSnap = await getDoc(juegoRef);
          return juegoSnap.exists() ? juegoSnap.data() : null;
        });
        const juegos = await Promise.all(juegosPromesas);
        setVideojuegos(juegos.filter(juego => juego !== null));
      } else {
        navigate('/'); 
      }
    };

    obtenerDatosClub();
  }, [id, navigate]);

  const toggleMembresia = async () => {
    if (!currentUser || !currentUser.docId) return;
  
    const userDocRef = doc(db, "usuarios", currentUser.docId);
    let nuevasMembresias;
  
    if (currentUser.membresias.includes(id)) {
      nuevasMembresias = currentUser.membresias.filter(mId => mId !== id);
      await updateDoc(userDocRef, {
        membresias: arrayRemove(id)
      });
    } else {
      nuevasMembresias = [...currentUser.membresias, id];
      await updateDoc(userDocRef, {
        membresias: arrayUnion(id)
      });
    }
    updateCurrentUserMembresias(nuevasMembresias);
  };

  return (
    <div className="container">
      {club && (
        <>
          <div>
            <h1>{club.nombre}</h1>
            <p>{club.descripcion}</p>
            <button onClick={toggleMembresia}>
              {currentUser.membresias.includes(id) ? 'Retirarse' : 'Unirse'}
            </button>
          <div>
              {videojuegos.map((juego, index) => (
                <div key={index} className="card-juego">
                  <h2>{juego.titulo}</h2>
                  <p>Género: {juego.genero}</p>
                  <p>{juego.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default ClubDetails;
