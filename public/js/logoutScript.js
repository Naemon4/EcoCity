document.addEventListener('DOMContentLoaded', async () => {
  //tem q esperar o criar header acontecer para o botão funcionar
  await criarHeader();

  // Busca o botão de logout pelo ID
  const logoutBtn = document.getElementById('logoutBtn');

  // Verifica se o botão existe na página
  if (logoutBtn) {
    // Adiciona um event listener para o clique no botão
    logoutBtn.addEventListener('click', async () => {
      try {
        // Faz uma requisição POST para a rota de logout
        const response = await fetch('/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // 👈 PARA SALVAR O COOKIE
        });

        // Converte a resposta para JSON
        const result = await response.json();

        // Se o logout foi bem sucedido
        if (result.success) {
          // Redireciona para a página de login
          localStorage.setItem('isUserLoggedIn', "false");
          window.location.href = '/';
        } else {
          // Mostra mensagem de erro caso o logout falhe
          alert('Erro ao fazer logout');
        }
      } catch (error) {
        // Loga o erro no console e mostra mensagem para o usuário
        console.error('Erro:', error);
        alert('Erro ao fazer logout');
      }
    });
  }
});
