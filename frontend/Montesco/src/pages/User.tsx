/**
 * @fileoverview Página de Usuario (Autenticación).
 * Envuelve el formulario de Login/Registro con el estilo base de la aplicación.
 */

import React from 'react';
import { UserForm } from './User/Form';

/**
 * Clase User (Page).
 * Proporciona el margen superior necesario para la Navbar fija.
 */
export class User extends React.Component {
  render() {
    return (
      <main className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
        {/* Componente inteligente de autenticación */}
        <UserForm />
      </main>
    );
  }
}
