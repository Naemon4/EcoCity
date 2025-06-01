document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        if (!userId) {
            alert('Você precisa estar logado para criar um post.');
            window.location.href = '/login';
            return;
        }

        formData.append('userId', userId);

        const response = await fetch('/api/posts/create', {
            method: 'POST',
            headers: {
                'user-id': userId
            },
            body: formData
        });

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

const fileName = `post_${Date.now()}.jpg`;
const filePath = path.join(__dirname, '../public/img/uploads', fileName);
fs.writeFileSync(filePath, buffer);
const data = {
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao'),
    imagem: `/img/uploads/${fileName}`
};
