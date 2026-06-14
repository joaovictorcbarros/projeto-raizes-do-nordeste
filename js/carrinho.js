// Inicializando variáveis
let carrinhoItems = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
let cupomAplicado = JSON.parse(localStorage.getItem('cupomRaizes')) || null;

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();

    document.getElementById('btn-limpar-voltar').addEventListener('click', limparCarrinho);
    document.querySelector('.apply-btn').addEventListener('click', gerirCupom);
    document.getElementById('btn-retirar').addEventListener('click', mudarParaRetirada);
    document.getElementById('btn-entregar').addEventListener('click', mudarParaEntrega);
});

// Estados do Carinho - Vazio e Renderização
function renderizarCarrinho() {
    const listaContainer = document.querySelector('.cart-items-list');
    const emptyMessage = document.getElementById('empty-cart-message');
    const btnTopo = document.getElementById('btn-limpar-voltar');
    const elementosParaEsconder = document.querySelectorAll('.toggle-visibility');

    listaContainer.innerHTML = '';
    
    if (carrinhoItems.length === 0) {
        elementosParaEsconder.forEach(el => el.style.display = 'none');
        btnTopo.style.display = 'none';

        emptyMessage.style.backgroundColor = 'transparent';
        emptyMessage.style.padding = '0';
        emptyMessage.style.display = 'block';

        emptyMessage.innerHTML = `
            <div style="text-align: left; margin-bottom: 15px;">
                <button onclick="window.location.href='unidade.html'" 
                        onmouseover="this.style.backgroundColor='#5A2B15'" 
                        onmouseout="this.style.backgroundColor='#8B4513'"
                        style="background-color: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background-color 0.2s;">
                    <i class="fas fa-arrow-left"></i> Ver Cardápio
                </button>
            </div>
            <div style="background-color: #f7ede2; border-radius: 12px; padding: 60px 20px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h3 style="color: #5f3a26; margin-bottom: 15px; font-size: 22px;">Seu carrinho está vazio.</h3>
                <p style="color: #8b4513; margin-bottom: 30px; font-size: 16px;">Que tal navegar pelo nosso cardápio?</p>
                <div style="font-size: 50px; color: #b38b75; font-weight: bold;">:'(</div>
            </div>
        `;
        return;
    }

    elementosParaEsconder.forEach(el => el.style.display = '');
    emptyMessage.style.display = 'none';

    btnTopo.style.display = 'block';
    btnTopo.innerHTML = 'Limpar';

    carrinhoItems.forEach((item, index) => {
        const precoLinha = item.preco * item.quantidade;
        const precoFormatado = `R$ ${precoLinha.toFixed(2).replace('.', ',')}`;

        const itemHTML = `
            <div class="cart-item-card">
                <div class="item-image" style="background-image: url('${item.imagem}');"></div>
                <div class="item-details">
                    <h4>${item.nome}</h4>
                    <span class="item-price">${precoFormatado}</span>
                    <div class="item-actions">
                        <div class="qty-controls">
                            <i class="fas fa-minus-circle icon-minus" onclick="alterarQuantidade(${index}, -1)"></i>
                            <span class="qty-number">${item.quantidade}</span>
                            <i class="fas fa-plus-circle icon-plus" onclick="alterarQuantidade(${index}, 1)"></i>
                        </div>
                        <i class="far fa-trash-alt icon-trash" onclick="removerItem(${index})"></i>
                    </div>
                </div>
            </div>
        `;
        listaContainer.innerHTML += itemHTML;
    });

    atualizarInterfaceCupom();
    verificarSaldoCoinsMenu();
    atualizarResumo();
}

function alterarQuantidade(index, valor) {
    if (carrinhoItems[index].quantidade + valor > 0) {
        carrinhoItems[index].quantidade += valor;
        salvarEAtualizar();
    }
}

function removerItem(index) {
    carrinhoItems.splice(index, 1);
    salvarEAtualizar();
}

function limparCarrinho() {
    if (confirm("Tem certeza que deseja esvaziar o carrinho?")) {
        carrinhoItems = [];
        cupomAplicado = null;
        localStorage.removeItem('cupomRaizes');
        salvarEAtualizar();
    }
}

// Opções de Entrega e Retirada
function mudarParaRetirada() {
    document.getElementById('btn-entregar').classList.remove('active');
    document.getElementById('btn-retirar').classList.add('active');

    document.getElementById('delivery-address-text').innerHTML = `
        <strong>Local de Retirada:</strong>
        <p>Unidade Centro - Rua das Rendeiras, 123</p>
    `;
    document.getElementById('delivery-time-text').innerHTML = `
        <p>Pronto em aprox. <strong>30 min</strong></p>
    `;
    atualizarResumo();
}

function mudarParaEntrega() {
    document.getElementById('btn-retirar').classList.remove('active');
    document.getElementById('btn-entregar').classList.add('active');

    document.getElementById('delivery-address-text').innerHTML = `
        <strong>Saindo da Unidade Sul:</strong>
        <p>Av. do Sertão, 456 - Zona Sul</p>
    `;
    document.getElementById('delivery-time-text').innerHTML = `
        <p>Entrega estimada: <strong>60 min</strong></p>
    `;
    atualizarResumo();
}

// Ações do campo Cupom 
function gerirCupom() {
    const input = document.querySelector('.coupon-input-group input');
    const hint = document.querySelector('.coupon-hint');

    if (cupomAplicado) {
        cupomAplicado = null;
        localStorage.removeItem('cupomRaizes');
        input.value = '';
    } else {
        const valorDigitado = input.value.trim().toUpperCase();

        if (valorDigitado === 'NIVERCOMRAIZES15OFF') {
            // Verifica se o cupom de aniversário já foi usado e trava 
            if (localStorage.getItem('cupomNiverUsado') === 'true') {
                hint.textContent = '*Este cupom de aniversário já foi utilizado.';
                hint.style.color = '#d20e0e';
                hint.style.display = 'block';
                return;
            }
            cupomAplicado = { codigo: valorDigitado, desconto: 0.15, tipo: 'porcentagem' };
            localStorage.setItem('cupomRaizes', JSON.stringify(cupomAplicado));
            
        } else if (valorDigitado === '1COMPRANORAIZESFRETEGRATIS') {
            // Verifica se o cupom de Frete Grátis já foi usado e trava 
            if (localStorage.getItem('cupomPrimeiraCompraUsado') === 'true') {
                hint.textContent = '*O cupom de Frete Grátis(1ª Compra) já foi utilizado.';
                hint.style.color = '#d20e0e';
                hint.style.display = 'block';
                return;
            }
            cupomAplicado = { codigo: valorDigitado, desconto: 0, tipo: 'frete' };
            localStorage.setItem('cupomRaizes', JSON.stringify(cupomAplicado));
            
        } else if (valorDigitado !== "") {
            hint.textContent = '*Cupom informado é inválido.';
            hint.style.color = '#d20e0e';
            hint.style.display = 'block';
            return;
        }
    }

    atualizarInterfaceCupom();
    atualizarResumo();
}

function atualizarInterfaceCupom() {
    const input = document.querySelector('.coupon-input-group input');
    const btn = document.querySelector('.apply-btn');
    const hint = document.querySelector('.coupon-hint');

    if (cupomAplicado) {
        input.value = cupomAplicado.codigo;
        input.disabled = true;
        btn.textContent = 'Remover';
        btn.style.backgroundColor = '#5f3a26';

        if (cupomAplicado.tipo === 'frete') {
            hint.textContent = '*Cupom de Frete Grátis aplicado (Válido para 1ª Entrega)';
        } else {
            hint.textContent = '*Cupom de aniversário aplicado 15%';
        }

        hint.style.color = '#5f3a26';
        hint.style.display = 'block';
    } else {
        input.disabled = false;
        btn.textContent = 'Aplicar';
        btn.style.backgroundColor = '#8B4513';
        hint.style.display = 'none';
    }
}

// Formata a moeda PT-BR
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Verifica se está mostrando o botão Toggle do Cashback 
function verificarSaldoCoinsMenu() {
    const sectionCoins = document.getElementById('coins-toggle-section');
    const txtSaldo = document.getElementById('valor-saldo-disponivel');
    
    const isAuth = localStorage.getItem('usuarioLogado') !== null;
    let saldoCoinsLocal = parseFloat(localStorage.getItem('saldoCoinsUsuario')) || 0;

    if (isAuth && saldoCoinsLocal > 0 && carrinhoItems.length > 0) {
        if (txtSaldo) txtSaldo.textContent = `R$ ${saldoCoinsLocal.toFixed(2).replace('.', ',')}`;
        if (sectionCoins) sectionCoins.style.display = 'flex';
    } else {
        if (sectionCoins) sectionCoins.style.display = 'none';
    }
}

// Resumo 
function atualizarResumo() {
    let subTotal = 0;

    // Soma dos itens no carrinho
    carrinhoItems.forEach(item => {
        subTotal += (item.preco * item.quantidade);
    });

    // Frete
    let valorFrete = 0;
    const btnEntregar = document.getElementById('btn-entregar');
    const isDelivery = btnEntregar && btnEntregar.classList.contains('active');

    if (isDelivery) {
        valorFrete = 10.00; 
    }

    // Cupom
    let desconto = 0;
    let textoCupom = "*Cupom aplicado";

    if (cupomAplicado) {
        if (cupomAplicado.tipo === 'porcentagem') {
            desconto = subTotal * cupomAplicado.desconto; 
            textoCupom = "*Cupom de aniversário aplicado";
        } else if (cupomAplicado.tipo === 'frete') {
            if (isDelivery) {
                desconto = valorFrete; 
                textoCupom = "*Cupom de frete aplicado";
            } else {
                desconto = 0;
            }
        }
    }

    // CoinsRaízes
    let descontoCoins = 0;
    const toggleCoins = document.getElementById('usar-coins-check');
    let saldoCoinsLocal = parseFloat(localStorage.getItem('saldoCoinsUsuario')) || 0; 
    
    if (toggleCoins && toggleCoins.checked) {
        let totalParcial = subTotal + valorFrete - desconto; 
        
        // Garante que o desconto não ultrapasse o valor do pedido
        descontoCoins = Math.min(saldoCoinsLocal, totalParcial); 
    }

    // Cálculo do Total 
    let total = subTotal + valorFrete - desconto - descontoCoins;

    // Recompensas CoinsRaízes
    let coins = total * 0.142857;

    // Atualiza o HTML
    const subTotalElem = document.querySelectorAll('.summary-row')[0].querySelector('span:last-child');
    const freteRow = document.querySelector('.frete-row');
    const discountRow = document.querySelector('.discount-row');
    const totalElem = document.querySelector('.total-row span:last-child');

    if (subTotalElem) subTotalElem.textContent = formatarMoeda(subTotal);
    if (totalElem) totalElem.textContent = formatarMoeda(total);

    // Mostra ou Esconde o Frete
    if (freteRow) {
        if (isDelivery) {
            freteRow.style.display = 'flex';
            freteRow.querySelector('span:last-child').textContent = formatarMoeda(valorFrete);
        } else {
            freteRow.style.display = 'none';
        }
    }

    // Mostra ou Esconde o Desconto do Cupom
    if (discountRow) {
        if (desconto > 0) {
            discountRow.style.display = 'flex';
            discountRow.querySelector('span:first-child').textContent = textoCupom;
            discountRow.querySelector('span:last-child').textContent = `- ${formatarMoeda(desconto)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    // Mostra ou Esconde o Saldo de CoinsRaízes(Toggle)
    const coinsRow = document.getElementById('coins-discount-row');
    if (coinsRow) {
        if (descontoCoins > 0) {
            coinsRow.style.display = 'flex';
            coinsRow.querySelector('span:last-child').textContent = `- ${formatarMoeda(descontoCoins)}`;
        } else {
            coinsRow.style.display = 'none';
        }
    }

    // Atualiza o balão de CoinsRaízes
    const coinsElem = document.querySelector('.coins-reward-box b:first-of-type');
    if (coinsElem) {
        coinsElem.textContent = total > 0 ? formatarMoeda(coins) : 'R$ 0,00';
    }
}

// Salva e Atualiza a Página
function salvarEAtualizar() {
    localStorage.setItem('carrinhoRaizes', JSON.stringify(carrinhoItems));
    renderizarCarrinho();
}

// Verifica se o Cliente está logado, senão redireciona para Login.html
function verificarLoginEFinalizar() {
    const metodoSelecionado = document.querySelector('input[name="payment"]:checked');
    
    if (!metodoSelecionado) {
        alert("Por favor, selecione um método de pagamento antes de finalizar.");
        return; 
    }

    // Captura o valor total e salva na memória
    const totalElem = document.querySelector('.total-row span:last-child');
    if(totalElem) {
        localStorage.setItem('totalPedido', totalElem.textContent);
    }

    // Salva a quantidade de pratos foram pedidos na memória
    let qtdPratos = 0;
    carrinhoItems.forEach(item => qtdPratos += item.quantidade);
    localStorage.setItem('qtdPratosPedido', qtdPratos);

    // Salva o quanto Cliente ganha e gasta das CoinsRaízes na memória 
    let moedasGastas = 0;
    const coinsRow = document.getElementById('coins-discount-row');
    if (coinsRow && coinsRow.style.display !== 'none') {
        let textoDesconto = coinsRow.querySelector('span:last-child').textContent;
        moedasGastas = parseFloat(textoDesconto.replace('- R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    }
    localStorage.setItem('moedasGastasNestaCompra', moedasGastas);

    let moedasGanhas = 0;
    const coinsRecompensaBox = document.querySelector('.coins-reward-box b:first-of-type');
    if (coinsRecompensaBox) {
        let textoGanho = coinsRecompensaBox.textContent;
        moedasGanhas = parseFloat(textoGanho.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    }
    localStorage.setItem('moedasGanhasNestaCompra', moedasGanhas);

    // Salva o método de pagamento na memória 
    localStorage.setItem('metodoEscolhido', metodoSelecionado.value);

    const usuarioLogado = localStorage.getItem('usuarioLogadoAutenticado');
    if (usuarioLogado === 'true') {
        window.location.href = 'loading.html';
    } else {
        alert("Para finalizar o seu pedido, por favor entre ou crie uma conta.");
        window.location.href = 'login.html';
    }
}