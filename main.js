// Definición de la clase Producto
class Producto {
  // Constructor de la clase Producto
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
}

// Obtener la lista de productos desde localStorage o inicializarla si no existe
const productos = JSON.parse(localStorage.getItem('productos')) || [
  new Producto("cluedo", 29.99, 13),
  new Producto("monopoly", 35.00, 20),
  new Producto("risk", 38.95, 3),
  new Producto("ajedrez", 9.99, 0)
];

// Lista de impuestos por país
const impuestos = [
  { nombre: "espana", valor: 0.21 },
  { nombre: "francia", valor: 0.20 },
  { nombre: "portugal", valor: 0.23 },
  { nombre: "italia", valor: 0.22 }
];

// Evento que se dispara cuando el contenido de la página se ha cargado
document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a los elementos del DOM
  const productoList = document.getElementById('productoList');
  const buscarBtn = document.getElementById('buscarBtn');
  const buscarInput = document.getElementById('buscarInput');
  const anadirBtn = document.getElementById('anadirBtn');
  const nuevoNombreInput = document.getElementById('nuevoNombre');
  const nuevoPrecioInput = document.getElementById('nuevoPrecio');
  const nuevoStockInput = document.getElementById('nuevoStock');
  const anadirNuevoBtn = document.getElementById('anadirProdcutoNuevoBtn');
  const paisSelector = document.getElementById('paisSelector');
  const codigoDescuentoInput = document.getElementById('codigoDescuento');
  const cantidadInput = document.getElementById('cantidad');
  const calcularPrecioBtn = document.getElementById('calcularPrecioBtn');
  const resultadoPrecios = document.getElementById('resultadoPrecios');
  const mensajeStock = document.getElementById('mensajeStock');
  const mensajeNoCoincidencias = document.getElementById('mensajeNoCoincidencias');
  const mensajeCantidadInvalida = document.getElementById('mensajeCantidadInvalida');
  const mensajeDescuentoInvalido = document.getElementById('mensajeDescuentoInvalido');
  const mensajeErrorPrecio = document.getElementById('mensajeErrorPrecio');
  const mensajeErrorStock = document.getElementById('mensajeErrorStock');

  // Función para mostrar los productos en la lista
  const mostrarProductos = (productosMostrar) => {
    productoList.innerHTML = '';

    productosMostrar.forEach(producto => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<span>${producto.nombre}</span> - Precio: ${producto.precio.toFixed(2)} € - Stock: ${producto.stock} unidades`;
      productoList.appendChild(listItem);
    });
  };

  // Evento al hacer clic en el botón de buscar
  buscarBtn.addEventListener('click', () => {
    const textoBusqueda = buscarInput.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(textoBusqueda));

    if (productosFiltrados.length > 0) {
      // Si hay productos coincidentes, mostrar la lista
      mostrarProductos(productosFiltrados);
      // Ocultar mensaje de no coincidencias si estaba visible
      mensajeNoCoincidencias.style.display = 'none';
    } else {
      // Si no hay productos coincidentes, mostrar mensaje de no coincidencias
      mensajeNoCoincidencias.style.display = 'block';
      // Limpiar la lista si estaba visible
      productoList.innerHTML = '';
    }
  });

  // Evento al hacer clic en el botón de añadir producto
  anadirBtn.addEventListener('click', () => {
    nuevoNombreInput.value = '';
    nuevoPrecioInput.value = '';
    nuevoStockInput.value = '';
    nuevoNombreInput.style.display = 'block';
    nuevoPrecioInput.style.display = 'block';
    nuevoStockInput.style.display = 'block';
    anadirNuevoBtn.style.display = 'block';
  });

  // Evento al hacer clic en el botón de añadir nuevo producto
  anadirNuevoBtn.addEventListener('click', () => {
    const nombre = nuevoNombreInput.value;
    const precio = parseFloat(nuevoPrecioInput.value);
    const stock = parseInt(nuevoStockInput.value);

    // Limpiar mensajes de error previos
    mensajeErrorPrecio.style.display = 'none';
    mensajeErrorStock.style.display = 'none';

    // Validar que el stock sea un número entero mayor a 0
    if (!isNaN(stock) && Number.isInteger(stock) && stock > 0) {
      // Validar que el precio sea un número positivo con dos decimales
      if (!isNaN(precio) && precio >= 0 && /^\d+(\.\d{1,2})?$/.test(precio.toString())) {
        const nuevoProducto = new Producto(nombre, precio, stock);
        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));
        mostrarProductos(productos);
        nuevoNombreInput.style.display = 'none';
        nuevoPrecioInput.style.display = 'none';
        nuevoStockInput.style.display = 'none';
        anadirNuevoBtn.style.display = 'none';
      } else {
        // Mostrar mensaje de error de precio en el HTML
        mensajeErrorPrecio.style.display = 'block';
      }
    } else {
      // Mostrar mensaje de error de stock en el HTML
      mensajeErrorStock.style.display = 'block';
    }
  });

  // Evento al hacer clic en el botón de calcular precio
  calcularPrecioBtn.addEventListener('click', () => {
    // Obtener el producto elegido
    const productoElegido = productos.find(producto => producto.nombre === buscarInput.value);

    // Obtener la cantidad ingresada por el usuario
    const cantidad = parseInt(cantidadInput.value);

    // Verificar que la cantidad sea válida
    if (!isNaN(cantidad) && cantidad >= 1) {
      // Verificar si hay suficiente stock
      if (cantidad <= productoElegido.stock) {
        // Obtener el valor del impuesto para el país seleccionado
        const iva = parseFloat(impuestos.find(pais => pais.nombre === paisSelector.value)?.valor);

        // Verificar que el valor del impuesto sea válido
        if (!isNaN(iva)) {
          // Calcular precios
          const precioSinIVA = productoElegido.precio * cantidad;
          const precioConIVA = precioSinIVA * (1 + iva);
          const codigoDescuento = codigoDescuentoInput.value.trim();

          // Limpiar mensaje de descuento no válido
          mensajeDescuentoInvalido.style.display = 'none';

          let descuento = 0;
          let mensajeDescuento = '';

          // Aplicar descuento si se proporciona un código válido
          if (codigoDescuento === "Bienvenid@23") {
            descuento = precioSinIVA * 0.10;
            mensajeDescuento = `<p style="font-size: smaller;">10% descuento Bienvenida: -${descuento.toFixed(2)} €</p>`;
          } else {
            // Mostrar mensaje de descuento no válido
            mensajeDescuentoInvalido.style.display = 'block';
            return; // Detener la ejecución si el código no es válido
          }

          // Calcular precios con descuento e impuestos
          const precioConDescuento = precioSinIVA - descuento;
          const precioConDescuentoConIVA = precioConDescuento * (1 + iva);

          const totalConDescuentoConIVA = precioConDescuentoConIVA.toFixed(2);

          // Mostrar el resultado solo si hay stock suficiente
          if (productoElegido.stock >= cantidad) {
            resultadoPrecios.innerHTML = `
              <p>Total sin IVA: ${precioSinIVA.toFixed(2)} €</p>
              ${mensajeDescuento}
              <p>Total con IVA: <strong>${totalConDescuentoConIVA} €</strong></p>
            `;
            // Ocultar mensaje de falta de stock si estaba visible
            mensajeStock.style.display = 'none';
            // Ocultar mensaje de código descuento no válido si estaba visible
            mensajeDescuentoInvalido.style.display = 'none';
          } else {
            // Mostrar mensaje de falta de stock
            mensajeStock.style.display = 'block';
            // Limpiar el resultado si se mostró previamente
            resultadoPrecios.innerHTML = '';
          }
        } else {
          // Mostrar mensaje de cantidad no válida
          mensajeCantidadInvalida.style.display = 'block';
        }
      } else {
        // Mostrar mensaje de falta de stock
        mensajeStock.style.display = 'block';
        // Limpiar el resultado si se mostró previamente
        resultadoPrecios.innerHTML = '';
      }
    } else {
      // Mostrar mensaje de cantidad no válida
      mensajeCantidadInvalida.style.display = 'block';
    }
  });

  // Mostrar todos los productos al cargar la página
  mostrarProductos(productos);
});
