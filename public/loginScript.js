document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    //pega os dados do formulario e coloca no objeto data, que será enviado para o backend
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        senha: formData.get('senha')
    };

    // Envia dados para o backend
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Salvar ID do usuário no localStorage
            localStorage.setItem('userId', result.userId);
            // Redirecionar para a página principal
            window.location.href = '/posts';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao fazer login');
    }
});