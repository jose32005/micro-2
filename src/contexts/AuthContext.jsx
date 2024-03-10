import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // Buscar la información del usuario por correo en Firestore
        const usersRef = collection(db, "usuarios");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0] ? querySnapshot.docs[0].data() : null;
        
        setCurrentUser({ ...user, ...userData }); // Combina la información de Auth y Firestore
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Desuscribirse al desmontar el componente
  }, []);

  const value = {
    currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
