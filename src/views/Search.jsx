import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function Search() {
  const [juegos, setJuegos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const obtenerJuegos = async () => {
      const q = busqueda ? 
                query(collection(db, "videojuegos"), where("titulo", ">=", busqueda), where("titulo", "<=", busqueda + '\uf8ff')) : 
                collection(db, "videojuegos");
                
      const querySnapshot = await getDocs(q);
      setJuegos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    obtenerJuegos();
  }, [busqueda]);

  return (
    <div>
      <h1>Buscar Videojuegos</h1>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar videojuegos..."
      />
      <div>
        {juegos.map((juego) => (
          <div className="juego-card" key={juego.id}>
            <h3>{juego.titulo}</h3>
            <p>Género: {juego.genero}</p>
            <p>Descripción: {juego.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
