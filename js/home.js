// Carrossel de imagens arrastável  
const carousel = document.querySelector('.carousel');
let isDown = false;
let startX;
let scrollLeft;

carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('active');
});

carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('active');
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return; 
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5; 
    carousel.scrollLeft = scrollLeft - walk;
});

// Avaliações Dinâmicas
const reviews = [
    {
        name: "Anne Doe",
        text: '"Excelente ambiente! As comidas consumidas no próprio local chegam quentinhas e o tempero lembra muito a comida de vó. Atendimento impecável."',
        stars: '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>',
        avatar: 'img/cliente-anne.jpg'
    },
    {
        name: "João Victor",
        text: '"A melhor carne de sol que já comi na vida! O ambiente é super rústico e acolhedor. Recomendo de olhos fechados."',
        stars: '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>',
        avatar: 'img/cliente-joao.jpg' 
    },
    {
        name: "Sr. José",
        text: '"Lugar arretado de bom! Lembra muito o sertão. O baião de dois com queijo coalho é um espetáculo à parte. Voltarei sempre com a família."',
        stars: '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>',
        avatar: 'img/cliente-jose.jpg' 
    }
];

let currentReviewIndex = 0;
const reviewContainer = document.getElementById('review-container');
const reviewName = document.getElementById('review-name');
const reviewText = document.getElementById('review-text');
const reviewStars = document.getElementById('review-stars');
const reviewAvatar = document.getElementById('review-avatar'); 

function changeReview() {
    reviewContainer.classList.add('fade-out');

    setTimeout(() => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        const review = reviews[currentReviewIndex];
        
        // Atualiza os dados na tela
        reviewName.textContent = review.name;
        reviewText.textContent = review.text;
        reviewStars.innerHTML = review.stars; 
        reviewAvatar.src = review.avatar; 

        reviewAvatar.alt = "Foto de " + review.name;

        reviewContainer.classList.remove('fade-out');
    }, 500);
}

setInterval(changeReview, 6000);


// Adiciona os itens das Promoções ao Carrinho
function adicionarPromoAoCarrinho(id, nome, preco, imagem) {
    
    let carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    
    // Verifica se o item já está no carrinho
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: parseFloat(preco),
            imagem: imagem,
            quantidade: 1,
            isPromo: true
        });
    }

    // Salva no navegador e avisa o cliente
    localStorage.setItem('carrinhoRaizes', JSON.stringify(carrinho));
    alert(`${nome} adicionado ao carrinho!`);
}

// Adiciona os itens dos Mais Pedidos ao Carrinho
function adicionarNormalAoCarrinho(id, nome, preco, imagem) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: parseFloat(preco),
            imagem: imagem,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinhoRaizes', JSON.stringify(carrinho));
    alert(`${nome} adicionado ao carrinho!`);
}