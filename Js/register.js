document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('nombre').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = 'login.html';
        } else {
            if (data.detail) {
                alert(`Error: ${data.detail}`);
            } else if (data.username) {
                alert(`Error: ${data.username[0]}`);
            } else {
                alert('Error en el registro. Verifica los datos ingresados.');
            }
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        alert('Hubo un problema con la conexión al servidor. Inténtalo más tarde.');
    }
});
