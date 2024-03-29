import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import ClubDetails from './views/ClubDetails';
import Search from './views/Search';
import EditProfile from './views/EditProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/club/:id" element={<ClubDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/editar-perfil" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

