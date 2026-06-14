// Escolher a unidade e mostra o cardápio dinâmicamente
const unitData = {
    'centro': {
        title: 'Cardápio - Unidade Centro',
        products: [
            { id: 'c1', name: 'Cuscuz com Carne', price: 15.00, img: 'img/cuscuz-com-carne.png' },
            { id: 'c2', name: 'Pizza Regional', price: 35.00, img:'img/pizza-regional-mini.jpg' },
            { id: 'c3', name: 'Churrassco com Vinagrete', price: 45.90, img: 'img/churrasco-vinagrete.png' },
            { id: 'c4', name: 'Tapioca Recheada e Pães de Queijo', price: 25.00, img: 'img/tapioca-carne-e-pao-de-queijo.png' }
        ]
    },
    'norte': {
        title: 'Cardápio - Unidade Norte',
        products: [
            { id: 'n1', name: 'Bolos de Rolo com Café', price: 12.90, img: 'img/bolo-de-rolo-cafe.png' },
            { id: 'n2', name: 'Frango Caipira', price: 55.00, img: 'img/frango-caipira.png' },
            { id: 'n3', name: 'Caldo de Feijão Verde', price: 35.00, img: 'img/caldo-feijao-verde.png' },
            { id: 'n4', name: 'Porção de Macaxeira Frita e Cajuina', price: 20.90, img: 'img/porcao-macaxeira.png' }
        ]
    },
    'sul': {
        title: 'Cardápio - Unidade Sul',
        products: [
            { id: 's1', name: 'Hambúrguer Nordestino', price: 15.90, img: 'img/hamburguer-nordestino.jpg' },
            { id: 's2', name: 'Mungunzá', price: 20.00, img: 'img/mungunza.png' },
            { id: 's3', name: 'Moqueca Baiana', price: 55.00, img: 'img/moqueca-baiana.png' },
            { id: 's4', name: 'Cuscuz Nordestino', price: 20.00, img: 'img/cuscuz-nordestino.png' }
        ]
    }
};

// Guarda os produtos da unidade atual
let currentProducts = []; 

function showMenu(unitKey) {
    const data = unitData[unitKey];
    currentProducts = data.products; 
    
    const productList = document.getElementById('product-list');
    const menuTitle = document.getElementById('menu-title');

    menuTitle.textContent = data.title;
    productList.innerHTML = ''; 

    data.products.forEach((product, index) => {
        const precoFormatado = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
        
        const cardHTML = `
            <div class="product-card-horizontal">
                <div class="product-img" style="background-image: url('${product.img}');"></div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <div class="product-footer">
                        <span class="product-price">${precoFormatado}</span>
                        <button class="add-btn" onclick="adicionarAoCarrinho(${index})">Adicionar</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += cardHTML;
    });

    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
}

// Função para Adicionar produtos ao Carrinho
function adicionarAoCarrinho(index) {
    const produto = currentProducts[index];
    
    let carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.name,
            preco: produto.price,
            imagem: produto.img,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinhoRaizes', JSON.stringify(carrinho));
    alert(`${produto.name} adicionado ao carrinho!`);
}

window.onload = () => showMenu('centro');