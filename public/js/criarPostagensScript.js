document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {

        //puxando a rota de criar posts
        const response = await fetch('/api/posts/create', {
            method: 'POST',
            body: formData,
            credentials: 'include' // 👈 PARA SALVAR O COOKIE
        });

        // Converte a resposta para JSON
        const result = await response.json();

        if (result.success) {
            alert('Post criado com sucesso!');
            window.location.href = '/perfil';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Erro ao criar post:', error);
        alert('Erro ao criar post');
    }
});
