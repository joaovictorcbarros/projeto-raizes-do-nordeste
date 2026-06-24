document.addEventListener('DOMContentLoaded', () => {
    verificarLoginConta();
    carregarDadosIniciais();
    configurarBotoesEditar();
});

// Avatar
function verificarLoginConta() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const iconePadrao = document.getElementById('icone-padrao');
    const fotoPerfil = document.getElementById('foto-perfil');
    
    // Puxa a foto se existir ela na conta de teste
    const fotoSalva = localStorage.getItem('fotoPerfilUsuario');

    if (iconePadrao && fotoPerfil) {
        if (usuarioLogado) {
            if (fotoSalva) {
                // Se for a Anne ou o João, mostra a foto deles
                iconePadrao.style.display = 'none';
                fotoPerfil.style.display = 'block';
                fotoPerfil.src = fotoSalva;
            } else {
                // Se for um cliente com cadastrou manual não mostra foto
                iconePadrao.style.display = 'block';
                fotoPerfil.style.display = 'none';
                fotoPerfil.src = '';
            }
        } else {
            // Se estiver deslogado, mostra sem foto
            iconePadrao.style.display = 'block';
            fotoPerfil.style.display = 'none';
            fotoPerfil.src = '';
        }
    }
}

// Carrega os Dados Salvos
function carregarDadosIniciais() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const nomeCompleto = localStorage.getItem('nomeCompleto');

    // Captura os dados passados nos inputs
    const inputApelido = document.getElementById('input-apelido');
    const inputNome = document.getElementById('conta-nome');
    const inputEmail = document.getElementById('conta-email');
    const inputData = document.getElementById('conta-data');
    const inputTelefone = document.getElementById('conta-telefone');
    const inputEndereco = document.getElementById('conta-endereco');
    const cpfInput = document.getElementById('conta-cpf');

    // Se ninguém estiver logado ou autenticado, zera tudo por segurança
    if (!localStorage.getItem('usuarioLogadoAutenticado')) {
        if (inputApelido) inputApelido.value = '';
        if (inputNome) inputNome.value = '';
        if (inputEmail) inputEmail.value = '';
        if (inputData) inputData.value = '';
        if (inputTelefone) inputTelefone.value = '';
        if (inputEndereco) inputEndereco.value = '';
        if (cpfInput) {
            cpfInput.value = '';
            cpfInput.removeAttribute('readonly');
            cpfInput.style.opacity = '1';
        }
        return;
    }

    // Apelido
    if (inputApelido) {
        let apelidoSalvo = localStorage.getItem('apelidoUsuario');
        if (!apelidoSalvo) {
            apelidoSalvo = usuarioLogado; 
        }
        inputApelido.value = apelidoSalvo;
        atualizarHeader(apelidoSalvo);
    }

    // Dados Pessoais
    if (inputNome) {
        inputNome.value = nomeCompleto || '';
        inputNome.setAttribute('readonly', 'true');
    }
    if (inputEmail) {
        inputEmail.value = localStorage.getItem('usuarioEmail') || '';
        inputEmail.setAttribute('readonly', 'true');
    }
    if (inputData) {
        let dataSalva = localStorage.getItem('dataNascimento') || '';
        
        if (dataSalva.includes('-')) {
            const partes = dataSalva.split('-');
            dataSalva = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        
        inputData.type = 'text'; 
        inputData.value = dataSalva;
        inputData.setAttribute('readonly', 'true');
    }
    if (inputTelefone) {
        inputTelefone.value = localStorage.getItem('usuarioTelefone') || '';
        inputTelefone.setAttribute('readonly', 'true');
    }
    if (inputEndereco) {
        inputEndereco.value = localStorage.getItem('usuarioEndereco') || '';
        inputEndereco.setAttribute('readonly', 'true');
    }

    // Trava o CPF
    const cpfSalvo = localStorage.getItem('usuarioCPF');
    if (cpfInput) {
        if (cpfSalvo) {
            cpfInput.value = cpfSalvo;
            travarCPF(cpfInput);
        } else {
            cpfInput.setAttribute('readonly', 'true');
        }
    }
}

// Botões Editar e Salvar
function configurarBotoesEditar() {
    const botoesEditar = document.querySelectorAll('.edit-link');
    if (botoesEditar.length < 2) return;

    const btnEditarApelido = botoesEditar[0]; 
    const btnEditarDados = botoesEditar[1];   

    // Editar do Apelido 
    btnEditarApelido.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!localStorage.getItem('usuarioLogadoAutenticado')) {
            alert("Faça login para editar os dados da sua conta.");
            return;
        }

        const inputApelido = document.getElementById('input-apelido');
        
        if (btnEditarApelido.textContent.toLowerCase() === 'editar') {
            inputApelido.removeAttribute('readonly');
            inputApelido.focus();
            
            btnEditarApelido.textContent = 'SALVAR';
            btnEditarApelido.style.color = '#111654'; 
            btnEditarApelido.style.fontWeight = 'lighter'; 
        } else {
            inputApelido.setAttribute('readonly', 'true');
            
            btnEditarApelido.textContent = 'editar';
            btnEditarApelido.style.color = '#3f51b5'; 
            btnEditarApelido.style.fontWeight = ''; 
            
            const novoApelido = inputApelido.value.trim();
            localStorage.setItem('apelidoUsuario', novoApelido);
            atualizarHeader(novoApelido);
        }
    });

    // Editar dos Dados Pessoais 
    btnEditarDados.addEventListener('click', (e) => {
        e.preventDefault();

        if (!localStorage.getItem('usuarioLogadoAutenticado')) {
            alert("Faça login para editar os seus dados.");
            return;
        }
        
        const inputsDados = [
            document.getElementById('conta-nome'),
            document.getElementById('conta-email'),
            document.getElementById('conta-data'),
            document.getElementById('conta-telefone'),
            document.getElementById('conta-endereco')
        ];
        const cpfInput = document.getElementById('conta-cpf');

        if (btnEditarDados.textContent.toLowerCase() === 'editar') {
            inputsDados.forEach(input => {
                if (input) input.removeAttribute('readonly');
            });
            
            if (cpfInput && !localStorage.getItem('usuarioCPF')) {
                cpfInput.removeAttribute('readonly');
            }
            
            btnEditarDados.textContent = 'SALVAR';
            btnEditarDados.style.color = '#111654';
            btnEditarDados.style.fontWeight = 'lighter';
        } else {
            inputsDados.forEach(input => {
                if (input) input.setAttribute('readonly', 'true');
            });
            
            localStorage.setItem('nomeCompleto', document.getElementById('conta-nome').value);
            localStorage.setItem('usuarioEmail', document.getElementById('conta-email').value);
            localStorage.setItem('dataNascimento', document.getElementById('conta-data').value);
            localStorage.setItem('usuarioTelefone', document.getElementById('conta-telefone').value);
            localStorage.setItem('usuarioEndereco', document.getElementById('conta-endereco').value);

            if (cpfInput) {
                const valorCpf = cpfInput.value.trim();
                if (valorCpf.length === 14 && !localStorage.getItem('usuarioCPF')) {
                    localStorage.setItem('usuarioCPF', valorCpf);
                    travarCPF(cpfInput);
                } else if (!localStorage.getItem('usuarioCPF')) {
                    cpfInput.setAttribute('readonly', 'true');
                }
            }

            btnEditarDados.textContent = 'editar';
            btnEditarDados.style.color = '#3f51b5';
            btnEditarDados.style.fontWeight = '';
        }
    });
}

// Trava do CPF, Atualiza o nome da Conta e Cria a máscara de CPF e Tel
function travarCPF(input) {
    input.setAttribute('readonly', 'true');
    input.style.opacity = '0.6';
    input.style.cursor = 'not-allowed';
    input.title = "Por segurança, o CPF não pode ser alterado após o cadastro inicial.";
}

function atualizarHeader(nomeCompleto) {
    if (!nomeCompleto) return;
    const primeiroNome = nomeCompleto.split(' ')[0];

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const span = item.querySelector('span:last-child');
        if (span && span.textContent.includes('Olá,')) {
            span.textContent = `Olá, ${primeiroNome}`;
        }
    });
}

window.mascaraCpfConta = function (input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
}

window.mascaraTelefone = function (input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = v;
}

// Excluir Conta
function excluirConta() {
    // Verifica se o usuário está logado antes, caso contrário não exlui conta
    if (!localStorage.getItem('usuarioLogadoAutenticado')) {
        alert("Você precisa fazer login para efetuar a exclusão da conta.");
        return; 
    }

    // Se usuário estiver autenticado, segue com a confirmação normal
    const confirmacao = confirm("Tem certeza absoluta que deseja excluir sua conta?\n\nVocê perderá todos os seus dados e o seu saldo de CoinsRaízes. Esta ação não pode ser desfeita.");
    
    if (confirmacao) {
        localStorage.clear(); 
        alert("Sua conta foi excluída com sucesso.\n\nLamentamos vê-lo partir do Raízes do Nordeste! 😢");
        window.location.href = 'index.html'; 
    }
}

// Volta o campo para texto e formata para DD/MM/AAAA ao editar
window.formatarDataBr = function (input) {
    if (input.value && input.value.includes('-')) {
        const partes = input.value.split('-'); 
        input.type = 'text'; 
        input.value = `${partes[2]}/${partes[1]}/${partes[0]}`;
    } else {
        input.type = 'text'; 
    }
}

// Prepara o campo para abrir o calendário nativo corretamente
window.prepararCalendario = function (input) {
    if (input.hasAttribute('readonly')) return;

    if (input.value && input.value.includes('/')) {
        const partes = input.value.split('/'); 
        input.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    input.type = 'date';
}