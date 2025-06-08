// Carrega os posts quando a página é carregada
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Busca os posts do usuário da API
    const response = await fetch('/api/posts/user-posts', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // 👈 PARA SALVAR O COOKIE
    });

    const data = await response.json();

    if (data.success) {
      const postsContainer = document.getElementById('postsContainer');

      // Verifica se existem posts para exibir
      if (data.posts && data.posts.length > 0) {
        // Cria elementos HTML para cada post
        data.posts.forEach((post) => {
          const postElement = document.createElement('section');
          postElement.className = 'post';

          // Monta o HTML do post com seus dados
          postElement.innerHTML = `
                        <h3>${post.titulo}</h3>
                        <p>${post.descricao}</p>
                        <img src="${post.imagem}" alt="Imagem do post">
                        <p class="data">Publicado em: ${new Date(post.data).toLocaleDateString()}</p>
                    `;

          postElement.style.cursor = 'pointer';
          postElement.addEventListener('click', () => {
            window.location.href = `/post?id=${post.id}&userId=${post.userId}`;
          });

          // Adiciona o post ao container
          postsContainer.appendChild(postElement);
        });
      } else {
        // Mensagem quando não há posts
        postsContainer.innerHTML = '<p>Você ainda não tem postagens.</p>';
      }
    } else {

      window.location.replace('/');

    }
  } catch (error) {
    // Tratamento de erro
    console.error('Erro ao carregar posts:', error);
    postsContainer.innerHTML = '<p>Erro ao carregar as postagens.</p>';
  }
});
