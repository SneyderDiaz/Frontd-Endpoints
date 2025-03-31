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

    async function editProduct(event) {
        const id = event.target.dataset.id;
        const newName = prompt('Nuevo nombre del producto:');
        const newDescription = prompt('Nueva descripción:');
        const newPrice = parseFloat(prompt('Nuevo precio:'));

        if (!newName || !newDescription || isNaN(newPrice)) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName, description: newDescription, price: newPrice })
            });

            if (!response.ok) {
                alert(`Error al editar el producto: ${response.status}`);
                return;
            }

            alert('Producto editado con éxito.');
            loadProducts(); // Recargar la lista de productos
        } catch (error) {
            console.error('Error al editar el producto:', error);
            alert('Hubo un problema al intentar editar el producto.');
        }
    }

    async function deleteProduct(event) {
        const id = event.target.dataset.id;

        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                alert(`Error al eliminar el producto: ${response.status}`);
                return;
            }

            alert('Producto eliminado con éxito.');
            loadProducts(); // Recargar la lista de productos
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Hubo un problema al intentar eliminar el producto.');
        }
    }

    async function editOrder(event) {
        const id = event.target.dataset.id;
        const newProduct = prompt('Nuevo producto:');
        const newQuantity = parseInt(prompt('Nueva cantidad:'), 10);
        const newTotalPrice = parseFloat(prompt('Nuevo total:'));

        if (!newProduct || isNaN(newQuantity) || isNaN(newTotalPrice)) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product: newProduct, quantity: newQuantity, total_price: newTotalPrice })
            });

            if (!response.ok) {
                alert(`Error al editar la orden: ${response.status}`);
                return;
            }

            alert('Orden editada con éxito.');
            loadOrders(); // Recargar la lista de órdenes
        } catch (error) {
            console.error('Error al editar la orden:', error);
            alert('Hubo un problema al intentar editar la orden.');
        }
    }

    async function deleteOrder(event) {
        const id = event.target.dataset.id;

        if (!confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                alert(`Error al eliminar la orden: ${response.status}`);
                return;
            }

            alert('Orden eliminada con éxito.');
            loadOrders(); // Recargar la lista de órdenes
        } catch (error) {
            console.error('Error al eliminar la orden:', error);
            alert('Hubo un problema al intentar eliminar la orden.');
        }
    }

    // Cargar productos y órdenes al inicio
    await loadProducts();
    await loadOrders();
});
