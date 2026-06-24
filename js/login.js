// MockDados para contas de 'Acesso Teste'
const usuariosMock = [
    {
        email: 'joao.victor@testemail.com',
        senha: '12345678',
        apelido: 'João',
        nomeCompleto: 'João Victor',
        cpf: '111.111.111-11',
        telefone: '(85) 99111-1111',
        dataNascimento: '1995-06-29',
        endereco: 'Rua dos Coqueirais - Fortaleza',
        pedido: '#173120',
        foto: 'img/cliente-joao.jpg',
        saldo: '7.00'
    },
    {
        email: 'anne_doe@testemail.com',
        senha: '123456789',
        apelido: 'Anne',
        nomeCompleto: 'Anne Doe',
        cpf: '222.222.222-22',
        telefone: '(85) 99222-2222',
        dataNascimento: '1992-06-27',
        endereco: 'Rua Juaci Sampaio Pontes - Caucaia',
        pedido: '#173121',
        foto: 'img/cliente-anne.jpg',
        saldo: '9.00'
    }
];

// Preenche os inputs automaticamente quando clicado no "Acessos Teste"
function preencherMock(email, senha) {
    document.getElementById('email-login').value = email;
    document.getElementById('senha-login').value = senha;
    document.getElementById('mock-modal').style.display = 'none';
}

// Validação unificada para dados Mockados ou informados via cadastro
function simularLogin(event) {
    event.preventDefault(); 

    const emailInput = document.getElementById('email-login').value.trim();
    const senhaInput = document.getElementById('senha-login').value.trim();

    // Procura na lista de Contas Testes os dados
    const usuarioFake = usuariosMock.find(u => u.email === emailInput && u.senha === senhaInput);

    if (usuarioFake) {
        localStorage.setItem('usuarioLogadoAutenticado', 'true'); 
        localStorage.setItem('usuarioLogado', usuarioFake.nomeCompleto); 
        localStorage.setItem('apelidoUsuario', usuarioFake.apelido);
        localStorage.setItem('nomeCompleto', usuarioFake.nomeCompleto);
        localStorage.setItem('usuarioCPF', usuarioFake.cpf);
        localStorage.setItem('usuarioTelefone', usuarioFake.telefone);
        localStorage.setItem('usuarioEmail', usuarioFake.email);
        localStorage.setItem('dataNascimento', usuarioFake.dataNascimento);
        localStorage.setItem('usuarioEndereco', usuarioFake.endereco);
        
        localStorage.setItem('numeroPedidoSimulado', usuarioFake.pedido);
        localStorage.setItem('numeroPedidoFixo', usuarioFake.pedido); 
        localStorage.setItem('fotoPerfilUsuario', usuarioFake.foto); 
        localStorage.setItem('saldoCoinsUsuario', usuarioFake.saldo);

        window.location.href = 'index.html';
        return; 
    }

    // Cadastro Manual 
    const emailCadastrado = localStorage.getItem('usuarioEmail');
    const senhaCadastrada = localStorage.getItem('usuarioSenha');
    let loginManualValido = false;

    // Verifica se o e-mail cadastrado existe e se ambos conferem
    if (emailCadastrado && emailInput === emailCadastrado) {
        if (senhaCadastrada && senhaInput === senhaCadastrada) {
            loginManualValido = true;
        }
    }

    if (loginManualValido) {
        localStorage.setItem('usuarioLogadoAutenticado', 'true');

        // Remove todos dados do mock teste, gerando os dados do novo pedido 
        localStorage.removeItem('numeroPedidoFixo');
        localStorage.removeItem('numeroPedidoSimulado');
        localStorage.removeItem('fotoPerfilUsuario');

        if (!localStorage.getItem('saldoCoinsUsuario')) {
            localStorage.setItem('saldoCoinsUsuario', '0.00');
        }

        window.location.href = 'index.html';
    } else {
        alert("E-mail não cadastrado ou senha incorreta. Cadastre-se ou use um 'Acesso Teste'.");
    }
}
