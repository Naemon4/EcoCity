function criarHeader() {
  const header = document.getElementById('header');
  const userLoggedIn = localStorage.getItem('userId');
  if (userLoggedIn) {
    header.innerHTML = `
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><img src="img/EcoCityLogo.png" class="logo"></li>
                <li class="nav-buttons"><span><a href="criarPostagens.html"><img src="img/addIcon.png" alt="Criar post"></a></span><a href="perfil.html">Perfil</a><button id="logoutBtn" class="logout-btn">Sair</button></li>
            </ul>
        </nav>
        <hr>
        `;
  } else {
    header.innerHTML = `
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><img src="img/EcoCityLogo.png" class="logo"></li>
                <li class="nav-buttons"><span><a href="criarPostagens.html"><img src="img/addIcon.png" alt="Criar post"></a></span><a href="registro.html">Entre</a></li>
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
