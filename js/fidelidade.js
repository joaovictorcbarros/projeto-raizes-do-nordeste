// Verifica se o Cliente está logado pra ver o Saldo
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = localStorage.getItem('usuarioLogadoAutenticado') === 'true';
    const areaLogado = document.getElementById('saldo-logado');
    const areaDeslogado = document.getElementById('saldo-deslogado');

    // Mostra o ano dinamicamente
    const spanAno = document.getElementById('ano-validade');
    if (spanAno) {
        spanAno.textContent = new Date().getFullYear();
    }

    if (usuarioLogado) {
        areaLogado.style.display = 'block';
        areaDeslogado.style.display = 'none';

        // Busca e formata o saldo de CoinsRaízes
        const txtSaldo = document.getElementById('valor-saldo-fidelidade');
        let saldoAtual = parseFloat(localStorage.getItem('saldoCoinsUsuario')) || 0;
        
        if (txtSaldo) {
            txtSaldo.textContent = `R$ ${saldoAtual.toFixed(2).replace('.', ',')}`;
        }

        // Oculta o aviso do (i) se o saldo for zero 
        const avisoValidade = document.getElementById('aviso-validade');
        if (avisoValidade) {
            if (saldoAtual <= 0) {
                avisoValidade.style.display = 'none'; 
            } else {
                avisoValidade.style.display = ''; 
            }
        }
    } else {
        areaLogado.style.display = 'none';
        areaDeslogado.style.display = 'block';
    }
});

// Verifica e trava antes de deixar aplicar e redirecionar pro carrinho
function aplicarCupomFidelidade(codigo) {
    if (codigo === 'NIVERCOMRAIZES15OFF' && localStorage.getItem('cupomNiverUsado') === 'true') {
        alert("Você já utilizou o seu cupom de aniversário!");
        return;
    }
    if (codigo === '1COMPRANORAIZESFRETEGRATIS' && localStorage.getItem('cupomPrimeiraCompraUsado') === 'true') {
        alert("Você já utilizou o seu cupom de primeira compra!");
        return;
    }

    let cupom = null;

    if (codigo === 'NIVERCOMRAIZES15OFF') {
        cupom = { codigo: codigo, desconto: 0.15, tipo: 'porcentagem' };
    } else if (codigo === '1COMPRANORAIZESFRETEGRATIS') {
        cupom = { codigo: codigo, desconto: 0, tipo: 'frete' };
    }

    // Grava o cupom no navegador
    localStorage.setItem('cupomRaizes', JSON.stringify(cupom));

    // Redireciona para o carrinho
    window.location.href = 'carrinho.html';
}