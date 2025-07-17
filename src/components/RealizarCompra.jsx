import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const productosDisponibles = [
  { id: "1", nombre: "Zapato Casual", descripcion: "Zapato para uso diario", precio: 100, imagen: "/zapato1.png" },
  { id: "2", nombre: "Zapato Deportivo", descripcion: "Ideal para correr", precio: 150, imagen: "/zapato2.png" },
  { id: "3", nombre: "Botas", descripcion: "Botas impermeables", precio: 200, imagen: "/zapato3.png" },
  { id: "4", nombre: "Sandalias", descripcion: "Para clima cálido", precio: 50, imagen: "/zapato4.png" },
  { id: "5", nombre: "Zapato Formal", descripcion: "Para eventos especiales", precio: 180, imagen: "/zapato5.png" },
  { id: "6", nombre: "Tenis Urbanos", descripcion: "Estilo juvenil", precio: 120, imagen: "/zapato6.png" },
];

export default function RealizarCompra() {
  const { registrarVenta, validarClienteExiste } = useAuth();
  const [clienteId, setClienteId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const agregarProducto = () => {
    const producto = productosDisponibles.find(p => p.id === productoId);
    if (!producto) {
      setError("Producto no válido.");
      return;
    }
    if (cantidad < 1) {
      setError("Cantidad inválida.");
      return;
    }
    setCarrito([...carrito, { ...producto, cantidad: parseInt(cantidad) }]);
    setProductoId("");
    setCantidad(1);
    setError("");
  };

  const finalizarCompra = () => {
  setMensaje("");
  setError("");
  if (!validarClienteExiste(clienteId)) {
    setError("ID de cliente no existe.");
    return;
  }
  if (carrito.length === 0) {
    setError("No hay productos en el carrito.");
    return;
  }
  let subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const descuentoBruto = subtotal * 0.08;
  const maxDescuento = subtotal * 0.5;
  const descuento = Math.min(descuentoBruto, maxDescuento);
  const totalFinal = subtotal - descuento;

  const venta = {
    clienteId,
    productos: carrito.map(item => ({
      idProducto: item.id,
      cantidad: item.cantidad
    })),
    subtotal,
    descuento,
    totalFinal,
    fecha: new Date().toLocaleString(),
  };

  registrarVenta(venta);
  setMensaje(`Venta registrada. Total: $${totalFinal.toFixed(2)} (Descuento aplicado: $${descuento.toFixed(2)})`);
  setCarrito([]);
  setClienteId("");
};


  return (
    <div className="realizar-compra p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Realizar Compra</h2>

      <div className="mb-4">
        <label>ID Cliente:</label>
        <input
          type="text"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          placeholder="ID Producto"
          className="border p-2"
        />
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="border p-2 w-20"
        />
        <button onClick={agregarProducto} className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar Producto
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2">Carrito Actual</h3>
      {carrito.length === 0 ? (
        <p>No hay productos agregados.</p>
      ) : (
        <ul className="mb-4">
          {carrito.map((item, index) => (
            <li key={index}>
              {item.nombre} x {item.cantidad} = ${item.precio * item.cantidad}
            </li>
          ))}
        </ul>
      )}

      <button onClick={finalizarCompra} className="bg-green-600 text-white px-4 py-2 rounded mb-6">
        Finalizar Compra
      </button>

      {mensaje && <p className="text-green-500">{mensaje}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <h3 className="text-xl font-semibold mt-8 mb-2">Productos Disponibles</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productosDisponibles.map((p) => (
          <div key={p.id} className="border rounded p-2 shadow bg-white flex flex-col items-center">
            <img src={p.imagen} alt={p.nombre} className="w-full h-40 object-cover rounded mb-2" />
            <h4 className="font-bold">{p.nombre}</h4>
            <p className="text-sm">{p.descripcion}</p>
            <p className="font-semibold">${p.precio}</p>
            <span className="text-xs text-gray-500">ID: {p.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
