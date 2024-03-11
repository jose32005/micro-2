import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './styles/Search.css';
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
    <div className="search-container">
      <div className="search-header">
      <h1 className="search-title">Buscar Videojuegos 🔍</h1>
      <input
        type="text"
        className="search-input"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar videojuegos..."
      />
      </div>
      <div className="juegos-container">
        {juegos.map((juego) => (
          <div className="juego-card" key={juego.id}>
            <h3 className="juego-titulo">{juego.titulo}</h3>
            <p className="juego-genero">Género: {juego.genero}</p>
            <p className="juego-descripcion">Descripción: {juego.descripcion}</p>
          </div>
        ))}
      </div>
    </div>

  );
}

export default Search;
