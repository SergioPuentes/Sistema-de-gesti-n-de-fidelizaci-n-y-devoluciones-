import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { userType, logout } = useAuth();

  return (
    <nav className="barra">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Spring Step" className="nav-logo" />
      </div>
      <div className="botones">
        <Link to="/" className="text-white">Inicio</Link>
        {(!userType || userType === "cliente") && (
          <a href="#" className="text-white">Contacto</a>
        )}
        {!userType && <Link to="/login" className="text-white">Iniciar sesión</Link>}
        {userType === "cliente" && (
          <>
            <a href="#" className="text-white">Productos</a>
            <a href="#" className="text-white">Reseñas</a>
            <a href="#" className="text-white">Devoluciones</a>
            <button onClick={logout} className="text-white">Cerrar sesión</button>
          </>
        )}
        {userType === "cajero" && (
          <>
            <a href="#" className="text-white">Crear Cliente</a>
            <a href="#" className="text-white">Mis Ventas</a>
            <button onClick={logout} className="text-white">Cerrar sesión</button>
          </>
        )}
        {userType === "admin" && (
          <>
            <a href="#" className="text-white">Crear Cliente</a>
            <a href="#" className="text-white">Crear Cajero</a>
            <a href="#" className="text-white">Gestión</a>
            <a href="#" className="text-white">Ventas</a>
            <a href="#" className="text-white">Devoluciones</a>
            <button onClick={logout} className="text-white">Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}