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
