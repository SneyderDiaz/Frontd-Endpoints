document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('nombre').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.token) {
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);
                alert('Inicio de sesión exitoso');

                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('No se recibió un token válido');
            }
        } else {
            alert(data.message || 'Error en la autenticación');
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        alert('Hubo un problema con la conexión al servidor');
    }
});
