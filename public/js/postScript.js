document.addEventListener('DOMContentLoaded', async () => {
  // Pega o ID do post da URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const userId = urlParams.get('userId');

  try {
    // Busca os dados do post
    const response = await fetch('/api/posts/all-posts');
    const data = await response.json();

    if (data.success) {
      const post = data.posts.find((p) => p.id === parseInt(postId) && p.userId === parseInt(userId));

      if (post) {
        // Preenche os dados do post
        document.getElementById('autorImagem').src = post.autorImagem || '/img/EcoCity.png';
        document.getElementById('autorNome').textContent = post.autorNome;
        document.getElementById('postTitulo').textContent = post.titulo;
        document.getElementById('postImagem').src = post.imagem;
        document.getElementById('postDescricao').textContent = post.descricao;
        document.getElementById('postData').textContent = new Date(post.data).toLocaleDateString();
      } else {
        console.error('Post não encontrado');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar post:', error);
  }
});
