// Válida os Campos de Cadastrar
function simularCadastro(event) {
    event.preventDefault();

    const nomeInput = document.getElementById('nome-cadastro').value;
    const emailInput = document.getElementById('email-cadastro').value;
    const senhaInput = document.getElementById('senha-cadastro').value;
    const dataInput = document.getElementById('data-cadastro').value;
    const termosCheck = document.getElementById('terms').checked;

    // Válida o formato do E-mail 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = emailRegex.test(emailInput);

    // Verifica se tem algum campo vazio 
    if (nomeInput.trim() === "" || emailInput.trim() === "" || senhaInput.trim() === "" || !termosCheck) {
        alert("Preencha todos os campos obrigatórios e aceite os Termos.");
        return;
    }

    // Verifica se o e-mail digitado tem @ e o.com
    if (!emailValido) {
        alert("Por favor, insira um endereço de e-mail válido. Exemplo: seu-nome@email.com");
        return;
    }

    // Salva os dados no Local Storage
    localStorage.setItem('nomeCompleto', nomeInput);
    localStorage.setItem('usuarioEmail', emailInput);
    localStorage.setItem('usuarioSenha', senhaInput);
    localStorage.setItem('usuarioLogado', nomeInput.split(' ')[0]);
    localStorage.setItem('usuarioLogadoAutenticado', 'true');
    localStorage.setItem('saldoCoinsUsuario', '0.00');
    
    if (dataInput) localStorage.setItem('dataNascimento', dataInput);
    
    window.location.href = 'index.html';
}

// Volta o campo para texto e formata para DD/MM/AAAA 
window.formatarDataBr = function (input) {
    // 1. Salva o que o calendário gerou antes do navegador limpar
    let dataEscolhida = input.value; 
    
    // 2. Transforma em texto
    input.type = 'text'; 
    
    // 3. Converte para o padrão BR e devolve pro campo
    if (dataEscolhida && dataEscolhida.includes('-')) {
        const partes = dataEscolhida.split('-'); 
        input.value = `${partes[2]}/${partes[1]}/${partes[0]}`;
    } else {
        input.value = dataEscolhida; // Se estiver vazio, devolve vazio
    }
}

// Prepara o campo para abrir o calendário nativo corretamente
window.prepararCalendario = function (input) {
    // 1. Guarda a data que está na tela antes do navegador limpar
    let dataSalva = input.value;

    // 2. Muda para o tipo calendário (aqui o navegador limpa o campo sozinho)
    input.type = 'date';

    // 3. Se tinha uma data no formato BR, inverte para o calendário ler e devolve pro campo
    if (dataSalva && dataSalva.includes('/')) {
        const partes = dataSalva.split('/'); 
        input.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
}