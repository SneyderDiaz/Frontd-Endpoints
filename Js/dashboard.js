document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No tienes autorización. Inicia sesión primero.');
        window.location.href = 'login.html';
        return;
    }

    const API_URL = 'http://127.0.0.1:8000/api';
    const tableBody = document.getElementById('productsTableBody');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const addProductBtn = document.getElementById('addProductBtn');
    const createOrderBtn = document.getElementById('createOrderBtn');

    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            return response.ok ? await response.json() : [];
        } catch (error) {
            console.error(`Error al obtener ${endpoint}:`, error);
            return [];
        }
    }

    async function updateTable(endpoint, tableBody, formatRow) {
        const data = await fetchData(endpoint);
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = formatRow(item);
            tableBody.appendChild(row);
        });

        // Agregar eventos a los botones dinámicamente
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (endpoint === 'products') {
                    editProduct(id);
                } else {
                    editOrder(id);
                }
            });
        });

        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (endpoint === 'products') {
                    deleteProduct(id);
                } else {
                    deleteOrder(id);
                }
            });
        });
    }

    function productRow(product) {
        return `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <button class="btn btn-edit" data-id="${product.id}">Editar</button>
                <button class="btn btn-delete" data-id="${product.id}">Eliminar</button>
            </td>`;
    }

    function orderRow(order) {
        return `
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>$${parseFloat(order.total_price).toFixed(2)}</td>
            <td>
                <button class="btn btn-edit" data-id="${order.id}">Editar</button>
                <button class="btn btn-delete" data-id="${order.id}">Eliminar</button>
            </td>`;
    }

    async function createItem(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (error) {
            console.error(`Error al crear ${endpoint}:`, error);
            return false;
        }
    }

    async function updateItem(endpoint, id, data) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (error) {
            console.error(`Error al actualizar ${endpoint}:`, error);
            return false;
        }
    }

    async function deleteItem(endpoint, id) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            });
            return response.ok;
        } catch (error) {
            console.error(`Error al eliminar ${endpoint}:`, error);
            return false;
        }
    }

    window.editProduct = async function(id) {
        const name = prompt('Nuevo nombre:');
        const description = prompt('Nueva descripción:');
        const price = parseFloat(prompt('Nuevo precio:'));
        if (name && description && !isNaN(price)) {
            if (await updateItem('products', id, { name, description, price })) {
                updateTable('products', tableBody, productRow);
            }
        }
    };

    window.deleteProduct = async function(id) {
        if (confirm('¿Eliminar producto?') && await deleteItem('products', id)) {
            updateTable('products', tableBody, productRow);
        }
    };

    window.editOrder = async function(id) {
        const product = prompt('Nuevo producto:');
        const quantity = parseInt(prompt('Nueva cantidad:'), 10);
        const total_price = parseFloat(prompt('Nuevo total:'));
        if (product && !isNaN(quantity) && !isNaN(total_price)) {
            if (await updateItem('orders', id, { product, quantity, total_price })) {
                updateTable('orders', ordersTableBody, orderRow);
            }
        }
    };

    window.deleteOrder = async function(id) {
        if (confirm('¿Eliminar orden?') && await deleteItem('orders', id)) {
            updateTable('orders', ordersTableBody, orderRow);
        }
    };

    addProductBtn.addEventListener('click', async () => {
        const name = prompt('Nombre del producto:');
        const description = prompt('Descripción:');
        const price = parseFloat(prompt('Precio:'));
        if (name && description && !isNaN(price)) {
            if (await createItem('products', { name, description, price })) {
                updateTable('products', tableBody, productRow);
            }
        }
    });

    createOrderBtn.addEventListener('click', async () => {
        const product = prompt('Producto:');
        const quantity = parseInt(prompt('Cantidad:'), 10);
        const total_price = parseFloat(prompt('Total:'));
        if (product && !isNaN(quantity) && !isNaN(total_price)) {
            if (await createItem('orders', { product, quantity, total_price })) {
                updateTable('orders', ordersTableBody, orderRow);
            }
        }
    });

    await updateTable('products', tableBody, productRow);
    await updateTable('orders', ordersTableBody, orderRow);
});
