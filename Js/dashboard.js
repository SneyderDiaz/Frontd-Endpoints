document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('productsTableBody');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No tienes autorización. Inicia sesión primero.');
        window.location.href = 'login.html';
        return;
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                alert(`Error al obtener los productos: ${response.status}`);
                return;
            }

            const products = await response.json();

            tableBody.innerHTML = '';
            products.forEach(product => {
                const price = parseFloat(product.price) || 0;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td class="price">$${price.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error en la petición de productos:', error);
            alert('Hubo un problema con la conexión al servidor');
        }
    }

    async function loadOrders() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/orders/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                alert(`Error al obtener las órdenes: ${response.status}`);
                return;
            }

            const orders = await response.json();

            ordersTableBody.innerHTML = '';
            orders.forEach(order => {
                const totalPrice = parseFloat(order.total_price) || 0;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.product}</td>
                    <td>${order.quantity}</td>
                    <td class="price">$${totalPrice.toFixed(2)}</td>
                `;
                ordersTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error en la petición de órdenes:', error);
            alert('Hubo un problema con la conexión al servidor');
        }
    }

    // Lógica para abrir y cerrar el modal de creación de órdenes
    const modal = document.getElementById('orderModal');
    const createOrderBtn = document.getElementById('createOrderBtn');
    const closeBtn = document.querySelector('.close');

    createOrderBtn.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Enviar nueva orden al backend
    document.getElementById('orderForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const product = document.getElementById('productName').value;
        const quantity = parseInt(document.getElementById('quantity').value, 10);
        const totalPrice = parseFloat(document.getElementById('totalPrice').value);

        const newOrder = {
            product: product,
            quantity: quantity,
            total_price: totalPrice
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/orders/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                alert(`Error al crear la orden: ${response.status}`);
                return;
            }

            alert('Orden creada con éxito');
            modal.style.display = 'none';
            loadOrders(); // Recargar la lista de órdenes
        } catch (error) {
            console.error('Error al crear la orden:', error);
            alert('Hubo un problema al enviar la orden.');
        }
    });

    // Cargar productos y órdenes al inicio
    await loadProducts();
    await loadOrders();
});
