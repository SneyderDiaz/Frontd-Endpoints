document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('nombre').value.trim();
    const password = document.getElementById('password').value.trim();

    // Expresiones regulares para validar usuario y contraseña
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/; // Solo alfanumérico, entre 5 y 15 caracteres
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Contraseña segura

    if (!username) {
        alert('El campo de usuario no puede estar vacío.');
        return;
    }

    if (!password) {
        alert('El campo de contraseña no puede estar vacío.');
        return;
    }

    // Validación del nombre de usuario
    if (!usernameRegex.test(username)) {
        alert('El usuario debe tener entre 5 y 15 caracteres y solo puede contener letras y números.');
        return;
    }

    // Validación de la contraseña
    if (!strongPasswordRegex.test(password)) {
        alert('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
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
