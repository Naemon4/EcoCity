// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', async () => {
  // Captura os elementos do DOM que serão manipulados
  const profileImage = document.getElementById('profileImage');
  const imageUpload = document.getElementById('imageUpload');
  const profileForm = document.getElementById('profileForm');

  // Carrega os dados do usuário ao iniciar
  try {
    const response = await fetch('/api/users/user-data', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // 👈 PARA SALVAR O COOKIE
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
    } else {

      window.location.replace('/');

    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }

  // Gerencia o upload da nova imagem de perfil
  imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch('/api/users/update-profile-image', {
          method: 'POST',
          body: formData,
          credentials: 'include' // 👈 PARA SALVAR O COOKIE
        });

        const result = await response.json();
        if (result.success) {
          profileImage.src = result.profileImage;
        } else {
          console.error('Erro ao atualizar imagem:', result.message);
          alert('Erro ao atualizar imagem de perfil');
        }
      } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        alert('Erro ao atualizar imagem de perfil');
      } finally {
        // Limpa o input file para permitir selecionar o mesmo arquivo novamente
        imageUpload.value = '';
      }
    }
  }, { once: false });

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
      const response = await fetch('/api/users/update-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include' // 👈 PARA SALVAR O COOKIE
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
