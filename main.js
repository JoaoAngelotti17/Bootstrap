// Função para gerar IDs únicos
const generateUniqueId = (() => {
    let id = parseInt(localStorage.getItem('currentId') || '0', 10);
    return () => {
        id++;
        localStorage.setItem('currentId', id);
        return id;
    };
})();

// Função para criar alertas
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible" role="alert">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertPlaceholder.append(wrapper);
};

// Formulário de Cadastro
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const id = generateUniqueId();
        const cardData = { id, email, password };
        localStorage.setItem(`card-${id}`, JSON.stringify(cardData));
        appendAlert('Cadastro realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000); // Redireciona para a página inicial após 1 segundo
    });
}

// Carregar e exibir cartões na página inicial
const cardContainer = document.getElementById('cardContainer');
if (cardContainer) {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('card-')) {
            const cardData = JSON.parse(localStorage.getItem(key));
            createCard(cardData);
        }
    });
}

// Função para criar cartões
function createCard(cardData) {
    const newCard = document.createElement('div');
    newCard.classList.add('card', 'm-2');
    newCard.style.width = '18rem';
    newCard.innerHTML = `
        <img src="https://picsum.photos/600/400?random=${cardData.id}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${cardData.email}</h5>
            <p class="card-text">${cardData.password}</p>
            <button class="btn btn-primary btn-edit" data-id="${cardData.id}">Editar</button>
            <button class="btn btn-danger btn-delete" data-id="${cardData.id}">Excluir</button>
        </div>
    `;
    cardContainer.appendChild(newCard);

    newCard.querySelector('.btn-delete').addEventListener('click', () => {
        localStorage.removeItem(`card-${cardData.id}`);
        cardContainer.removeChild(newCard);
        appendAlert('Card excluído com sucesso!', 'danger');
    });

    newCard.querySelector('.btn-edit').addEventListener('click', () => {
        const email = prompt('Digite o novo email:', cardData.email);
        const password = prompt('Digite a nova senha:', cardData.password);
        if (email && password) {
            cardData.email = email;
            cardData.password = password;
            localStorage.setItem(`card-${cardData.id}`, JSON.stringify(cardData));
            newCard.querySelector('.card-title').innerText = email;
            newCard.querySelector('.card-text').innerText = password;
            appendAlert('Card atualizado com sucesso!', 'success');
        }
    });
}
