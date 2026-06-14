// Redireciona para a tela de simulação de pagamento dependedo da escolha
// após 3.5 segundos
const metodo = localStorage.getItem('metodoEscolhido');

setTimeout(() => {
    switch(metodo) {
        case 'pix':  // Método Pix
            window.location.href = 'simulacao-pix.html';
            break;
        case 'cartao':  // Método Catão 
            window.location.href = 'simulacao-cartao.html';
            break;
        case 'dinheiro':  // Método Dinheiro
            window.location.href = 'simulacao-dinheiro.html';
            break;
        default:  // Caso o cliente não seleciona nenhuma op de pagamento
            alert("Erro na seleção de pagamento. Voltando ao carrinho.");
            window.location.href = 'carrinho.html';
            break;
    }
}, 3500);