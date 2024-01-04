const filter = document.querySelector('#filter');

// Função para carregar os links nos iframes
function carregarLinks(list) {
  const container = document.getElementById('iframeContainer');
  container.innerHTML = '';

  list.forEach((link) => {
    const iframe = document.createElement('iframe');
    iframe.src = link;
    iframe.allow = 'autoplay';
    iframe.sandbox = 'allow-same-origin allow-scripts';
    iframe.classList.add('iframe-container');
    container.appendChild(iframe);
  });
}

// Extrai os links dos favoritos
document.getElementById('extractButton').addEventListener('click', function () {
  const fileInput = document.getElementById('fileInput');

  // Verifica se um arquivo foi selecionado
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    // Evento disparado quando a leitura do arquivo é concluída
    reader.onload = function (event) {
      const fileContent = event.target.result;

      // Cria um elemento HTML para armazenar o conteúdo do arquivo
      const tempElement = document.createElement('div');
      tempElement.innerHTML = fileContent;

      // Extrai os URLs dos links do arquivo HTML
      const links = tempElement.querySelectorAll('a');
      const listaFavoritos = Array.from(links).map((link) => link.href);
      montarDivsLinks(listaFavoritos);
      // console.log(listaFavoritos); // Aqui você terá a lista de URLs dos favoritos
      // carregarLinks(listaFavoritos);
    };

    // Lê o conteúdo do arquivo como texto
    reader.readAsText(file);

    // return listaFavoritos;
  } else {
    console.log('Nenhum arquivo selecionado.');
  }
});

const divLinksList = document.querySelector('.links-list');

const montarDivsLinks = (links) => {
  if (filter.value.length > 0) {
    // Percorre a lista de trás para frente para evitar problemas ao remover itens
    for (let i = links.length - 1; i >= 0; i--) {
      // Verifica se o item NÃO contém a string informada
      if (!links[i].includes(filter.value)) {
        // Remove o item da lista usando splice
        links.splice(i, 1);
      }
    }
  }

  links.forEach((link) => {
    const fixYoutubeLink = link.replace(
      'www.youtube.com/watch?v=',
      'www.youtube.com/embed/'
    );

    const div = createLinkContainer(fixYoutubeLink);

    divLinksList.appendChild(div);
  });
};

const createLinkContainer = (link) => {
  const div = document.createElement('div');
  const label = document.createElement('label');
  const button = document.createElement('button');

  div.classList.add('link-container');
  label.classList.add('link');
  button.classList.add('open-button');

  label.innerHTML = link;
  button.innerHTML = 'Abrir';
  button.addEventListener('click', () => handleLink(div, link));

  div.appendChild(label);
  div.appendChild(button);
  div.setAttribute('data-isopen', '0');

  return div;
};

const handleLink = (div, link) => {
  const isOpen = div.getAttribute('data-isopen');
  if (isOpen === '1') {
    closeLink(div, link);
  } else {
    openLink(div, link);
  }
};

const openLink = (div, link) => {
  const iframe = createIframe(link);
  const iframeContainer = document.createElement('div');

  iframeContainer.appendChild(iframe);

  const button = div.querySelector('button');
  button.innerHTML = 'Fechar';

  div.appendChild(iframeContainer);
  div.setAttribute('data-isopen', '1');
};

const closeLink = (div, link) => {
  const label = document.createElement('label');
  const button = document.createElement('button');

  // div.classList.add('link-container');
  label.classList.add('link');
  button.classList.add('open-button');
  button.style.backgroundColor = '#62c581';

  label.innerHTML = link;
  button.innerHTML = 'Abrir';
  button.addEventListener('click', () => handleLink(div, link));

  div.innerHTML = '';

  div.appendChild(label);
  div.appendChild(button);
  div.setAttribute('data-isopen', '0');
};

function createIframe(link) {
  const iframe = document.createElement('iframe');
  iframe.src = link;
  iframe.allow = 'autoplay';
  iframe.sandbox = 'allow-same-origin allow-scripts';
  iframe.classList.add('iframe-container');
  return iframe;
}

// Chama a função para carregar os links quando a página carregar
// window.onload = carregarLinks;
