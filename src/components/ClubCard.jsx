import React from 'react';
import "../views/styles/Clubes.css"

function ClubCard({ club }) {
  return (
    <div className="club-card">
      <h2>{club.nombre}</h2>
      <p>{club.descripcion}</p>
      <button>Ver mas</button>
    </div>
  );
}

export default ClubCard;
