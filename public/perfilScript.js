// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', async () => {
  // Captura os elementos do DOM que serão manipulados
  const profileImage = document.getElementById('profileImage');
  const imageUpload = document.getElementById('imageUpload');
  const profileForm = document.getElementById('profileForm');

  // Função para comprimir a imagem antes do upload
  const compressImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let { width } = img;
        let { height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });

  // Carrega os dados do usuário ao iniciar
  try {
    const response = await fetch('/api/user-data', {
      headers: {
        'Content-Type': 'application/json',
        'user-id': localStorage.getItem('userId'),
      },
    });

    const data = await response.json();

    if (data.success && data.user) {
      // Preenche os campos do formulário com os dados do usuário
      document.getElementById('nomeInput').value = data.user.nome;
      document.getElementById('emailInput').value = data.user.email;
      document.getElementById('telefoneInput').value = data.user.telefone;
      document.getElementById('ruaInput').value = data.user.endereco.rua;
      document.getElementById('numeroInput').value = data.user.endereco.numero;
      document.getElementById('bairroInput').value = data.user.endereco.bairro;

      // Carrega a imagem de perfil se existir
      if (data.user.profileImage) {
        profileImage.src = data.user.profileImage;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }

  // Gerencia o upload da nova imagem de perfil
  imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Comprime a imagem antes de enviar
        const compressedImage = await compressImage(file);
        profileImage.src = compressedImage;

        // Envia a imagem para o servidor
        const response = await fetch('/api/update-profile-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': localStorage.getItem('userId'),
          },
          body: JSON.stringify({ profileImage: compressedImage }),
        });

        const result = await response.json();
        if (!result.success) {
          alert('Erro ao atualizar imagem de perfil');
        }
      } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        alert('Erro ao atualizar imagem de perfil');
      }
    }
  });

  // Gerencia o envio do formulário com os dados atualizados
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Coleta os dados atualizados do formulário
    const userData = {
      nome: document.getElementById('nomeInput').value,
      email: document.getElementById('emailInput').value,
      telefone: document.getElementById('telefoneInput').value,
      endereco: {
        rua: document.getElementById('ruaInput').value,
        numero: document.getElementById('numeroInput').value,
        bairro: document.getElementById('bairroInput').value,
      },
    };

    try {
      // Envia os dados atualizados para o servidor
      const response = await fetch('/api/update-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userId'),
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Dados atualizados com sucesso!');
      } else {
        alert('Erro ao atualizar dados');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      alert('Erro ao atualizar dados');
    }
  });
});
