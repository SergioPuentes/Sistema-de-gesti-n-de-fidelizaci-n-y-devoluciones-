import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="barra">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Spring Step" className="nav-logo" />
      </div>

      <div className="botones">
        <Link to="/" className="text-white font-semibold hover:text-gray-200">
          Home
        </Link>

        {userType === "cliente" && (
          <>
            <Link to="/recibos" className="text-white font-semibold hover:text-gray-200">
              Recibos
            </Link>
            <Link to="/devoluciones" className="text-white font-semibold hover:text-gray-200">
              Devoluciones
            </Link>
            <Link to="/calificaciones" className="text-white font-semibold hover:text-gray-200">
              Calificaciones
            </Link>
          </>
        )}

        {userType === "cajero" && (
          <>
            <Link to="/crear-cliente" className="text-white font-semibold hover:text-gray-200">
              Crear Cliente
            </Link>
            <Link to="/realizar-compra" className="text-white font-semibold hover:text-gray-200">
              Realizar Compra
            </Link>
            <Link to="/mis-ventas" className="text-white font-semibold hover:text-gray-200">
              Mis Ventas
            </Link>
          </>
        )}

        {userType === "admin" && (
          <>
            <Link to="/gestionar-usuarios" className="text-white font-semibold hover:text-gray-200">
              Gestionar Usuarios
            </Link>
            <Link to="/ventas-totales" className="text-white font-semibold hover:text-gray-200">
              Ventas Totales
            </Link>
            <Link to="/devoluciones-admin" className="text-white font-semibold hover:text-gray-200">
              Devoluciones
            </Link>
          </>
        )}

        {!userType ? (
          <Link to="/login" className="text-white font-semibold hover:text-gray-200">
            Iniciar Sesión
          </Link>
        ) : (
          <button onClick={handleLogout} className="text-white font-semibold hover:text-gray-200">
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}
