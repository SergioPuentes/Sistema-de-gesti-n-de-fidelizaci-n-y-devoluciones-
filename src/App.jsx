import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import CrearCliente from "./components/CrearCliente";
import RealizarCompra from "./components/RealizarCompra";
import VerRecibosCliente from "./components/VerRecibosCliente";
import SolicitudDevolucion from "./components/SolicitudDevolucion";
import PanelDevoluciones from "./components/PanelDevoluciones";




export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/realizar-compra" element={<RealizarCompra />} />
          <Route path="/crear-cliente" element={<CrearCliente />} />
          <Route path="/recibos" element={<VerRecibosCliente />} />
          <Route path="/devoluciones" element={<SolicitudDevolucion />} />
          <Route path="/devoluciones-admin" element={<PanelDevoluciones />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
