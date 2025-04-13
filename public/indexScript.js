document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/all-posts');
    const data = await response.json();

    if (data.success) {
      const postsContainer = document.getElementById('postsContainer');

      data.posts.forEach((post) => {
        const postSection = document.createElement('section');
        postSection.className = 'post';

        const data = new Date(post.data).toLocaleDateString('pt-BR');

        postSection.innerHTML = `
                    <h3>${post.titulo}</h3>
                    <p class="autor">Postado por: ${post.autorNome}</p>
                    <p class="data">Data: ${data}</p>
                    <img src="${post.imagem}" alt="Imagem do post">
                    <p class="descricao">${post.descricao}</p>
                `;

        // Adiciona o evento de clique
        postSection.style.cursor = 'pointer';
        postSection.addEventListener('click', () => {
          window.location.href = `/post.html?id=${post.id}&userId=${post.userId}`;
        });

        postsContainer.appendChild(postSection);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
  }
});
