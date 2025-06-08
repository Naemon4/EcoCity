//evento para desaparecer com as opções de deletar a conta
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
                },
                credentials: 'include' // 👈 PARA SALVAR O COOKIE
            });

            if (!deleteResponse.ok) {
                const errorData = await deleteResponse.json();
                console.error('Erro do servidor:', errorData);
                throw new Error(errorData.message || 'Falha ao deletar conta');
            }

            console.log('Redirecionando para a página inicial...');
            window.location.href = '/';

        } catch (error) {
            console.error('Erro completo:', error);
            alert(`Erro: ${error.message}`);

            // se der erro, some com as opções de deletar a conta
            document.getElementById("deletarConta").style.display = "block";
            document.getElementById("confirmDeleteContainer").style.display = "none";
        }
    });
});

//evento para sumir com as opções de deletar a conta
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dontDelete').addEventListener('click', async () => {

        document.getElementById("deletarConta").style.display = "block"
        document.getElementById("confirmDeleteContainer").style.display = "none"

    });
});

