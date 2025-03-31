document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No tienes autorización. Inicia sesión primero.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('backBtn').addEventListener('click', function () {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('productForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = parseFloat(document.getElementById('price').value);

        if (!name || !description || isNaN(price) || price <= 0) {
            alert("Todos los campos son obligatorios y el precio debe ser mayor a 0.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description, price })
            });

            if (response.ok) {
                alert('Producto agregado correctamente.');
                window.location.href = 'dashboard.html';
            } else {
                alert('Error al agregar el producto.');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            alert('Hubo un problema con la conexión al servidor');
        }
    });
});
