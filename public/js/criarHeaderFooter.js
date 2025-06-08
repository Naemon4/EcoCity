async function criarHeader() {

    try {
        const header = document.getElementById('header');

        //puxa rota para verificar se o user ta logado
        const response = await fetch('/api/users/isUserLoggedIn', {
            method: 'GET',
            credentials: 'include' // 👈 PARA SALVAR O COOKIE
        });

        // Converte a resposta para JSON
        const result = await response.json();

        //gambiarra pq caso ele nn retorne false ele retorna um erro
        if (!result.success) {
            header.innerHTML = `
          <nav>
              <ul>
                  <li><a href="/">Home</a></li>
                  <li><img src="img/EcoCityLogo.png" class="logo"></li>
                  <li class="nav-buttons"><span><a href="/criarPost"><img src="img/addIcon.png" alt="Criar post"></a></span><a href="/registro">Entre</a></li>
              </ul>
          </nav>
          <hr>
          `;
        } else {
            throw error;
        }
    } catch (error) {
        header.innerHTML = `
          <nav>
              <ul>
                  <li><a href="/">Home</a></li>
                  <li><img src="img/EcoCityLogo.png" class="logo"></li>
                  <li class="nav-buttons"><span><a href="/criarPost"><img src="img/addIcon.png" alt="Criar post"></a></span><a href="/perfil">Perfil</a><button id="logoutBtn" class="logout-btn">Sair</button></li>
              </ul>
          </nav>
          <hr>
          `;
    }
}

function criarFooter() {
    const footer = document.getElementById('footer');
    footer.innerHTML = `
          <hr>
          <h4>Contatos:</h4>
          <ul>
              <li>12 34567-8900</li>
              <li>EcoCity@ecocity.com</li>
              <li><a href="https://www.instagram.com"><img src="img/insta.png" alt="link instagram"></a></li>
              <li><a href="https://www.x.com"><img src="img/X.png" alt="link twitter"></a></li>
          </ul>
      `;
}