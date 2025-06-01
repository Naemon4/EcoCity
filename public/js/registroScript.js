document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        senha: formData.get('senha'),
        confirmarSenha: formData.get('confirmarSenha'),
        telefone: formData.get('telefone'),
        bairro: formData.get('bairro'),
        rua: formData.get('rua'),
        numero: formData.get('numero'),
        cpf: formData.get('cpf')
    };

    try {
        // Registrar o usuário
        const registerResponse = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const registerResult = await registerResponse.json();

        if (registerResult.success) {
            // Se o registro foi bem-sucedido, fazer login automaticamente
            const loginData = {
                email: data.email,
                senha: data.senha
            };

            const loginResponse = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const loginResult = await loginResponse.json();

            if (loginResult.success) {
                // Salvar ID do usuário no localStorage e sessionStorage
                localStorage.setItem('userId', loginResult.userId);
                sessionStorage.setItem('userId', loginResult.userId);
                // Redirecionar para a página principal
                window.location.href = '/';
            } else {
                alert('Registro realizado com sucesso, mas houve um erro ao fazer login automático. Por favor, faça login manualmente.');
                window.location.href = '/login';
            }
        } else {
            alert(registerResult.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao registrar usuário');
    }
});