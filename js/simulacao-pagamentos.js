// Simulação de Pagamentos PIX - Cartão - Dinheiro
window.valorTotalNumerico = 0;

document.addEventListener('DOMContentLoaded', () => {
    carregarValoresTabela();
});

// Busca o valor salvo no Carrinho e envia a tabela para pág de simulações
function carregarValoresTabela() {
    const totalSalvo = localStorage.getItem('totalPedido') || 'R$ 0,00';
    
    const elValorPedido = document.getElementById('tabelaValorPedido');
    const elValorFinal = document.getElementById('tabelaValorFinal');

    if(elValorPedido) elValorPedido.textContent = totalSalvo;
    if(elValorFinal) elValorFinal.textContent = totalSalvo;

    let numeroLimpo = totalSalvo.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    window.valorTotalNumerico = parseFloat(numeroLimpo) || 0;

    // Números dos pedidos em sequências
    let numPedidoFixo = localStorage.getItem('numeroPedidoFixo');
    let numPedidoAtual = localStorage.getItem('numeroPedidoSimulado');

    if (numPedidoFixo) {
        // Se for João ou Anne, usa sempre o numFixo deles
        numPedidoAtual = numPedidoFixo;
        localStorage.setItem('numeroPedidoSimulado', numPedidoAtual);
    } else if (!numPedidoAtual) {
        // Se for cliente novo, gera o sequência a partir do 173122
        let proximoNumero = parseInt(localStorage.getItem('proximoPedidoSequencial') || '173122');
        numPedidoAtual = '#' + proximoNumero;
        
        // Salva o pedido atual e já cria o próximo número
        localStorage.setItem('numeroPedidoSimulado', numPedidoAtual);
        localStorage.setItem('proximoPedidoSequencial', (proximoNumero + 1).toString());
    }

    // Procura o <h3> dentro de ".page-title" e muda o texto 
    const h3Pedido = document.querySelector('.page-title h3');
    if (h3Pedido) {
        h3Pedido.textContent = `Pedido ${numPedidoAtual}`;
    }
}

// Máscara de CPF
function mascaraCPF(input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
    validarFormulario();
}

// Número do Cartão 
function mascaraCartao(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = v;
    validarFormulario();
}

// Validade do Cartão 
function mascaraValidade(input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d)/, "$1/$2");
    }
    input.value = v;
    validarFormulario();
}

// Moeda para o Dinheiro (Transforma 500 em 5,00) 
function mascaraMoeda(input) {
    let v = input.value.replace(/\D/g, "");
    if (v === "") {
        input.value = "";
        calcularTroco();
        validarFormulario();
        return;
    }
    v = (parseInt(v, 10) / 100).toFixed(2) + "";
    v = v.replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    input.value = v;
    
    calcularTroco();
    validarFormulario();
}

// Cálcula o troco dinâmicamente
function calcularTroco() {
    const inputPagar = document.getElementById('valorPagar');
    const inputTroco = document.getElementById('valorTroco');
    
    if(!inputPagar || !inputTroco) return;

    let valorPagoStr = inputPagar.value.replace(/\./g, '').replace(',', '.');
    let valorPagoNum = parseFloat(valorPagoStr) || 0;
    
    if (valorPagoNum > window.valorTotalNumerico && window.valorTotalNumerico > 0) {
        let troco = valorPagoNum - window.valorTotalNumerico;
        inputTroco.value = troco.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } else {
        inputTroco.value = "0,00";
    }
}

// Validação geral para liberar o botão simular pagamento
function validarFormulario() {
    const btn = document.getElementById('btnSimular');
    
    const cpf = document.getElementById('cpfInput') ? document.getElementById('cpfInput').value : "";
    const termos = document.getElementById('termosCheck') ? document.getElementById('termosCheck').checked : false;

    const numCartao = document.getElementById('numCartao');
    const valCartao = document.getElementById('valCartao');
    const cvvCartao = document.getElementById('cvvCartao');
    
    const valorPagar = document.getElementById('valorPagar');

    let isValido = true;

    // Regra para os campos CPF e Termos 
    if (cpf.length !== 14 || cpf === "000.000.000-00" || termos === false) {
        isValido = false;
    }

    // Pagamento Cartão
    if (numCartao && numCartao.value.length < 19) isValido = false;
    if (valCartao && valCartao.value.length < 5) isValido = false;
    if (cvvCartao && cvvCartao.value.length < 3) isValido = false;

    // Pagamento Dinheiro, Verifica se valor pago é maior ou igual ao total
    if (valorPagar) {
        let pagoNum = parseFloat(valorPagar.value.replace(/\./g, '').replace(',', '.')) || 0;
        if (valorPagar.value.trim() === "" || pagoNum < window.valorTotalNumerico) {
            isValido = false;
        }
    }

    btn.disabled = !isValido;
}

// Finaliza o Pagamento
function finalizarPagamento() {
    const modal = document.getElementById('sucessoModal');
    if (modal) modal.style.display = 'flex';
    
    localStorage.setItem('pedidoAtivo', 'true');

    // CashBack CoinsRaízes
    let saldoAtual = parseFloat(localStorage.getItem('saldoCoinsUsuario')) || 0;
    let moedasGanhas = parseFloat(localStorage.getItem('moedasGanhasNestaCompra')) || 0;
    let moedasGastas = parseFloat(localStorage.getItem('moedasGastasNestaCompra')) || 0;

    let novoSaldo = saldoAtual - moedasGastas + moedasGanhas;
    if (novoSaldo < 0) novoSaldo = 0;

    localStorage.setItem('saldoCoinsUsuario', novoSaldo.toFixed(2));

    // Verifica se o cupom já foi usado e trava para novas tentativas
    const cupomAtivo = JSON.parse(localStorage.getItem('cupomRaizes'));
    if (cupomAtivo) {
        if (cupomAtivo.codigo === 'NIVERCOMRAIZES15OFF') {
            localStorage.setItem('cupomNiverUsado', 'true');
        } else if (cupomAtivo.codigo === '1COMPRANORAIZESFRETEGRATIS' || cupomAtivo.codigo === '1COMPRANORAIZES') {
            localStorage.setItem('cupomPrimeiraCompraUsado', 'true');
        }
        localStorage.removeItem('cupomRaizes'); 
    }

    // Salva os dados do dinheiro no localStorage
    const inputPagar = document.getElementById('valorPagar');
    const inputTroco = document.getElementById('valorTroco');
    
    if (inputPagar && inputTroco) {
        let valorPago = inputPagar.value === "" ? "0,00" : inputPagar.value;
        let valorTroco = inputTroco.value === "" ? "0,00" : inputTroco.value;
        
        localStorage.setItem('valorPagoPedido', `R$ ${valorPago}`);
        localStorage.setItem('trocoPedido', `R$ ${valorTroco}`);
        localStorage.setItem('metodoEscolhido', 'Dinheiro');
    } else {
        // Limpa o cache que ficou salvo caso o cliente mude o método pgm
        localStorage.removeItem('valorPagoPedido');
        localStorage.removeItem('trocoPedido');
    }

    // Limpa a memória cache e volta para a página inicial
    setTimeout(() => {
        localStorage.removeItem('moedasGanhasNestaCompra');
        localStorage.removeItem('moedasGastasNestaCompra');
        window.location.href = 'index.html';
    }, 2500);
}