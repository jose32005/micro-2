import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './styles/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [username, setUsername] = useState('');
  const [videojuegoPreferido, setVideojuegoPreferido] = useState('');
  const [videojuegos, setVideojuegos] = useState([]);
  const navigate = useNavigate();

  // Cargar videojuegos desde Firestore
  useEffect(() => {
    const cargarVideojuegos = async () => {
      const querySnapshot = await getDocs(collection(db, "videojuegos"));
      setVideojuegos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    cargarVideojuegos();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const usuarioRef = doc(collection(db, "usuarios"));
      await setDoc(usuarioRef, {
        nombre,
        apellido,
        username,
        email,
        videojuego_preferido: videojuegoPreferido,
        membresias: []
      });
      
      console.log('Usuario registrado con éxito:', userCredential.user);
      navigate('/');
    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
    }
  };

  return (
    <div className='register'>
        <h1>Registro de Usuario</h1>
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="register-input" />
        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className="register-input" />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nombre de Usuario" className="register-input" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" className="register-input" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="register-input" />
        <select value={videojuegoPreferido} onChange={(e) => setVideojuegoPreferido(e.target.value)} className="register-select">
          <option value="">Selecciona tu videojuego preferido</option>
          {videojuegos.map((juego) => (
            <option key={juego.id} value={juego.id}>{juego.titulo}</option>
          ))}
        </select>
        <button type="submit" className="register-button">Registrar</button>
        <Link to="/login" className="switch-form">¿Ya tienes cuenta? Inicia sesión</Link>
      </form>
    </div>
    </div>
  );
}

export default Register;
