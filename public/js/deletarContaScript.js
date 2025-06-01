document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('deletarConta').addEventListener('click', async () => {

        document.getElementById("deletarConta").style.display = "none"
        document.getElementById("confirmDeleteContainer").style.display = "flex"

    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmDelete').addEventListener('click', async () => {

        try {
            console.log('Iniciando processo de deleção...');

            const deleteResponse = await fetch('/api/users/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userId')}`
                }
            });

            console.log('Resposta recebida:', deleteResponse);

            if (!deleteResponse.ok) {
                const errorData = await deleteResponse.json();
                console.error('Erro do servidor:', errorData);
                throw new Error(errorData.message || 'Falha ao deletar conta');
            }

            // Limpar dados do usuário
            localStorage.clear();
            sessionStorage.clear();

            console.log('Redirecionando para a página inicial...');
            window.location.href = '/';

        } catch (error) {
            console.error('Erro completo:', error);
            alert(`Erro: ${error.message}`);

            // Opcional: reexibir o botão de confirmação
            document.getElementById("deletarConta").style.display = "block";
            document.getElementById("confirmDeleteContainer").style.display = "none";
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dontDelete').addEventListener('click', async () => {

        document.getElementById("deletarConta").style.display = "inline-block"
        document.getElementById("confirmDeleteContainer").style.display = "none"

    });
});

