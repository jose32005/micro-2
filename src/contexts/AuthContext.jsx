import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Buscar el documento en Firestore que coincide con el email del usuario
        const q = query(collection(db, "usuarios"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0] ? querySnapshot.docs[0].data() : null;
        const userId = querySnapshot.docs[0] ? querySnapshot.docs[0].id : null; // Capturar el ID del documento
        
        setCurrentUser({
          ...user,
          ...userData,
          docId: userId 
        });
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const updateCurrentUser = (newData) => {
    setCurrentUser(prevState => ({
      ...prevState,
      ...newData,
    }));
  };


  const updateCurrentUserMembresias = (nuevasMembresias) => {
    if (!currentUser) return;
  
    setCurrentUser(prevState => ({
      ...prevState,
      membresias: nuevasMembresias
    }));
  };

  const value = {
  currentUser,
  updateCurrentUserMembresias,
  updateCurrentUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};