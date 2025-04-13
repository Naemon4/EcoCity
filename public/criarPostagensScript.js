// Adiciona evento de submit ao formulário
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imageFile = formData.get('imagem');

  // Função para comprimir a imagem antes de enviar
  const compressImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        // Configura o canvas para redimensionar a imagem
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let { width } = img;
        let { height } = img;

        // Mantém a proporção da imagem ao redimensionar
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        // Desenha a imagem redimensionada no canvas
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Converte para JPEG com 70% de qualidade
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });

  try {
    // Comprime a imagem e prepara os dados do post
    const compressedImage = await compressImage(imageFile);
    const data = {
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      imagem: compressedImage,
    };

    // Envia o post para o servidor
    const response = await fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': localStorage.getItem('userId'),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      alert('Post criado com sucesso!');
      window.location.href = '/posts';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Erro ao criar post:', error);
    alert('Erro ao criar post');
  }
});
