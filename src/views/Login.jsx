import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
      alert(error.message); 
    }
  };

  return (
    <div className='login'>
      <h1>Inicio de Sesión 🔐</h1>
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" className="login-input" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="login-input" />
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
      </div>
      <button onClick={handleGoogleSignIn} className="google-signin-button">Iniciar Sesión con Google</button>
      <Link to="/register" className="switch-form">¿No tienes cuenta? Regístrate</Link>
    </div>
  );
}

export default Login;