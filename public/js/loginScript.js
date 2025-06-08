document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }),
            credentials: 'include' // 👈 PARA SALVAR O COOKIE
        });

        const data = await response.json();

        if (data.success) {
            console.log('Login bem-sucedido no cliente. Tentando redirecionar...');
            window.location.replace('/');
            console.log('Redirecionamento iniciado no cliente.'); // Adicione esta linha
        } else {
            throw new Error(data.message || 'Falha ao realizar login');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert(`Erro: ${error.message}`);
    }
});