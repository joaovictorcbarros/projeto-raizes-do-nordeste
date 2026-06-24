// Menu Mobile(Hambúrger) 
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('hamburger-icon');

    menu.classList.toggle('show-menu');

    if (menu.classList.contains('show-menu')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Atualiza o Cabeçalho e Verifica o Login
document.addEventListener('DOMContentLoaded', () => {
    // Procura primeiro o apelido. Se não existir, pega o 1º nome do cliente 
    const apelidoSalvo = localStorage.getItem('apelidoUsuario');
    const usuarioLogado = apelidoSalvo ? apelidoSalvo : localStorage.getItem('usuarioLogado');

    const isAutenticado = localStorage.getItem('usuarioLogadoAutenticado') === 'true';
    const botoesConta = document.querySelectorAll('.nav-item[onclick*="conta.html"]');
    const btnEntrarDesktop = document.querySelector('.desktop-only.entrar-btn');
    const btnEntrarMobile = document.querySelector('.mobile-only');

    // Só mostra o nome se estiver autenticado(Logado) 
    if (isAutenticado && usuarioLogado) {
        const primeiroNome = usuarioLogado.split(' ')[0];

        botoesConta.forEach(btn => {
            btn.innerHTML = `<i class="fas fa-user"></i><span>Olá, ${primeiroNome}</span>`;
        });

        if (btnEntrarDesktop) {
            btnEntrarDesktop.innerHTML = `<i class="fas fa-sign-out-alt"></i><span>Sair</span>`;
            btnEntrarDesktop.setAttribute('onclick', "realizarLogout()");
            btnEntrarDesktop.classList.remove('entrar-btn');
        }

        if (btnEntrarMobile) {
            btnEntrarMobile.innerHTML = `<i class="fas fa-sign-out-alt"></i><span>Sair</span>`;
            btnEntrarMobile.setAttribute('onclick', "realizarLogout()");
        }
    }
});

// Deslogar (Logout)
function realizarLogout() {
    // Remove apenas o status de autenticação (Desloga o usuário)
    localStorage.removeItem('usuarioLogadoAutenticado');

    // Remove apenas dados temporários de sessão dos usuários teste (foto e número de pedido)
    localStorage.removeItem('numeroPedidoFixo');
    localStorage.removeItem('numeroPedidoSimulado');
    localStorage.removeItem('fotoPerfilUsuario');

    // Recarrega a página inicial deslogado
    window.location.href = 'index.html';
}

// Status do Pedido e Notificação - Sino
document.addEventListener('DOMContentLoaded', () => {
    const pedidoAtivo = localStorage.getItem('pedidoAtivo') === 'true';
    const bellContainer = document.getElementById('bell-container');
    const bellIconWrapper = document.getElementById('bell-icon-wrapper');
    const notifDot = document.getElementById('notif-dot');
    const statusDropdown = document.getElementById('status-dropdown');

    if (pedidoAtivo && bellContainer) {
        if (notifDot) notifDot.style.setProperty('display', 'block', 'important');

        // Ativa a animação de pulsar no Status se tiver alguma notificação
        if (bellIconWrapper) bellIconWrapper.classList.add('pulsing-bell');

        const totalSalvo = localStorage.getItem('totalPedido') || 'R$ 0,00';
        const usuarioLogado = localStorage.getItem('usuarioLogado') || 'Cliente';
        const metodoEscolhido = localStorage.getItem('metodoEscolhido');
        const qtdPratosMemoria = localStorage.getItem('qtdPratosPedido') || '0';

        const elTotal = document.getElementById('status-total');
        const elNome = document.getElementById('status-nome');
        const elPratos = document.getElementById('status-pratos');

        // Substitui o número do pedido automaticamente
        const numPedidoSalvo = localStorage.getItem('numeroPedidoSimulado') || '#173122';
        const linhasDetalhes = document.querySelectorAll('.order-details .detail-line');
        linhasDetalhes.forEach(linha => {
            if (linha.innerHTML.includes('Pedido:')) {
                const spanPedido = linha.querySelector('span');
                if (spanPedido) spanPedido.textContent = numPedidoSalvo;
            }
        });

        if (elPratos) elPratos.textContent = qtdPratosMemoria;
        if (elTotal) elTotal.textContent = totalSalvo;

        // Pega o Apelido em vez do Nome Completo para mostrar no Status
        if (elNome) elNome.textContent = localStorage.getItem('apelidoUsuario') || usuarioLogado;

        // Salva o Valor Pago e o Troco apenas se for Dinheiro
        if (metodoEscolhido && metodoEscolhido.toLowerCase() === 'dinheiro') {
            const linhaPago = document.getElementById('linha-pago');
            const valPago = document.getElementById('status-pago');
            const linhaTroco = document.getElementById('linha-troco');
            const valTroco = document.getElementById('status-troco');

            const pagoSalvo = localStorage.getItem('valorPagoPedido') || 'R$ 0,00';
            const trocoSalvo = localStorage.getItem('trocoPedido') || 'R$ 0,00';

            if (linhaPago && valPago) {
                linhaPago.style.display = 'block';
                valPago.textContent = pagoSalvo;
            }
            if (linhaTroco && valTroco) {
                linhaTroco.style.display = 'block';
                valTroco.textContent = trocoSalvo;
            }
        }

        let statusInterval;
        let progresso = 0;
        let fluxoEncerrado = false;

        bellContainer.addEventListener('click', (event) => {
            if (fluxoEncerrado) return;

            if (bellIconWrapper) bellIconWrapper.classList.remove('pulsing-bell');

            if (statusDropdown.style.display === 'none' || statusDropdown.style.display === '') {
                statusDropdown.style.display = 'block';

                if (!statusInterval) {
                    const progressArea = document.getElementById('order-progress');

                    // Atualiza a transição do processo a cada 3.5 segundos
                    statusInterval = setInterval(() => {
                        progresso++;
                        if (progresso === 1) {
                            progressArea.innerHTML = `<i class="far fa-clock" style="color: #28a745;"></i><span style="font-weight: bold; color: #555;">Pronto em 30min</span>`;
                        } else if (progresso === 2) {
                            progressArea.innerHTML = `<i class="fas fa-check-circle" style="color: #003b73;"></i><span style="font-weight: bold; color: #555;">Entregue!</span>`;
                            clearInterval(statusInterval);

                            // Limpa o cache do navegador após o entregue
                            localStorage.removeItem('pedidoAtivo');
                            localStorage.removeItem('totalPedido');
                            localStorage.removeItem('metodoEscolhido');
                            localStorage.removeItem('trocoPedido');
                            localStorage.removeItem('valorPagoPedido');

                            // Limpa o pedido atual, se for cliente novo.
                            // Gerando um novo número para próxima compra  
                            if (!localStorage.getItem('numeroPedidoFixo')) {
                                localStorage.removeItem('numeroPedidoSimulado');
                            }

                            // Atualiza o Status faz a bolinha desaparecer 
                            setTimeout(() => {
                                if (notifDot) {
                                    notifDot.style.setProperty('display', 'none', 'important');
                                }
                                // Fecha o dropdown
                                if (statusDropdown) {
                                    statusDropdown.style.setProperty('display', 'none', 'important');
                                }

                                // Impede reabertuda do Status por cliente  
                                fluxoEncerrado = true;

                            }, 3500)
                        }
                    }, 3500);
                }
            } else {
                statusDropdown.style.setProperty('display', 'none', 'important');
            }
        });

        statusDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});