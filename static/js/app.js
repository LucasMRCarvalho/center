const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar() {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')

    closeAllSubMenus()
}


function toggleSubMenu(button){

    if(!button.nextElementSibling.classList.contains('show')) {
        closeAllSubMenus()
    }
    

    button.nextElementSibling.classList.toggle('show')
    button.classList.toggle('rotate')

    if(sidebar.classList.contains('close')) {
        sidebar.classList.toggle('close')
        toggleButton.classList.toggle('rotate')
    }
}

function closeAllSubMenus() {
    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show')
        ul.previousElementSibling.classList.remove('rotate')
    })
}
// Daqui pra cima e do side bar!!!
//======================================================================

// ==== Quebra de linhas ====
// Função para transformar as quebras de linha do texto original
function transformarQuebraDeLinha() {
    const textoNormal = document.getElementById("textoNormal").value;

    // Substitui as quebras de linha por '\n' literal
    const textoTransformado = textoNormal.replace(/\n/g, '\\n');

    // Exibe o resultado no textarea de resultado
    document.getElementById("textoResultado").value = textoTransformado;
}

// Função para copiar o resultado para a área de transferência
function copiarResultado() {
    const textoResultado = document.getElementById("textoResultado");

    // Seleciona o conteúdo do campo de resultado
    textoResultado.select();
    textoResultado.setSelectionRange(0, 99999); // Para mobile

    // Copia o conteúdo selecionado
    document.execCommand("copy");

    // Alerta de confirmação
    alert('Texto copiado para a área de transferência!');
}
//====================================================================

// ==== Organizador de Logins====

// Função para substituir a lista de email e senha no texto original
function substituirListaEmailSenha() {
    const textoOriginal = document.getElementById('textoOriginal').value;
    const listaDados = document.getElementById('listaDados').value.split('\n');
    let resultado = '';

    listaDados.forEach(par => {
        const [email, senha] = par.split(':');
        let novoTexto = textoOriginal.replace('[EMAIL]', email).replace('[SENHA]', senha);
        resultado += novoTexto.trim() + '\n' + '\n'; // Remove espaços no final e adiciona quebra de linha
    });

    // Remove a última quebra de linha extra
    document.getElementById('textoResultado').value = resultado.trimEnd();
}

// Função para limpar os campos do Organizador de Logins
function limparCamposLogins() {
    document.getElementById('listaDados').value = '';
    document.getElementById('textoResultado').value = '';
}

// Função para copiar o resultado
function copiarResultado() {
    const textoResultado = document.getElementById('textoResultado');
    textoResultado.select();
    document.execCommand('copy');
    alert('Resultado copiado para a área de transferência!');
}
//==============================================================================

// Função para Inline

// Função para filtrar a lista de DBs com base no serviço selecionado
function filtrarLista() {
    const servico = document.getElementById("servico").value.toLowerCase(); // Serviço selecionado (Netflix, Claro, Max)
    const textoDb = document.getElementById("textoDb").value.trim().split("\n"); // Lista de DB (cada linha)
    let resultado = '';

    // Filtra as linhas que contêm o serviço como palavra-chave
    textoDb.forEach(linha => {
        if (linha.toLowerCase().includes(servico)) {
            resultado += `${linha}\n`; // Adiciona apenas as linhas que contêm o serviço
        }
    });

    // Exibe o resultado filtrado no campo "textoResultadoDb"
    document.getElementById("textoResultado").value = resultado;
}

// Função para limpar os campos do Inline
function limparCamposInline() {
    document.getElementById("textoResultado").value = ''; // Limpa o campo de resultado
}

// Função para copiar o resultado
function copiarResultado() {
    const resultado = document.getElementById("textoResultado");
    resultado.select();
    document.execCommand("copy");
    alert("Resultado copiado!");
}


// Função para Separador de Dados

// Função para extrair CPF/email e senha com base na escolha do usuário
function extrairDados() {
    const textoLinks = document.getElementById("textoLinks").value.trim(); // Obtém o texto completo
    const linhas = textoLinks.split("\n"); // Divide o texto por linha
    const tipoDado = document.getElementById("tipoDado").value; // Obtém o tipo de dado selecionado
    const resultadoSet = new Set(); // Usamos um Set para armazenar resultados únicos

    // Processa cada linha separadamente
    linhas.forEach(linha => {
        const partes = linha.trim().split(":"); // Divide cada linha pelos dois-pontos ":"

        // Verifica se há pelo menos 3 partes (URL, CPF/email, senha)
        if (partes.length >= 3) {
            let dado = partes[1].trim(); // Pode ser CPF ou email
            let senha = partes[2].trim(); // Senha

            // Remove caracteres não numéricos do CPF
            if (tipoDado === "cpf" && !dado.includes("@")) {
                dado = dado.replace(/\D/g, ''); // Remove tudo que não é número
            }

            // Verifica se a senha tem mais de 12 caracteres
            if (senha.length > 12) {
                senha = senha.substring(0, 12); // Trunca a senha para os primeiros 12 caracteres
            }

            // Filtra de acordo com a seleção do tipo de dado (email ou cpf)
            if (tipoDado === "email" && dado.includes("@")) {
                resultadoSet.add(`${dado}:${senha}`); // Adiciona ao Set (evita duplicatas)
            } else if (tipoDado === "cpf" && !dado.includes("@")) {
                // Verifica se o CPF tem pelo menos 6 caracteres
                if (dado.length >= 6) {
                    resultadoSet.add(`${dado}:${senha}`); // Adiciona ao Set (evita duplicatas)
                }
            }
        } else {
            resultadoSet.add("Formato inválido na linha: " + linha); // Mensagem de erro se o formato estiver incorreto
        }
    });

    // Converte o Set de volta para string e exibe o resultado no campo de saída
    document.getElementById("textoResultado").value = Array.from(resultadoSet).join("\n");
}





// Função para copiar o resultado para a área de transferência
function copiarResultado() {
    const resultado = document.getElementById("textoResultado");
    resultado.select(); // Seleciona o texto
    document.execCommand("copy"); // Copia para a área de transferência
    alert("Resultado copiado!"); // Mensagem de confirmação
}

// Função para limpar os campos do Separador de Dados
function limparCamposSeparador() {
    document.getElementById("textoLinks").value = ''; // Limpa o campo de entrada
    document.getElementById("textoResultado").value = ''; // Limpa o campo de saída
    document.getElementById("tipoDado").value = 'email'; // Reseta o tipo de dado para email
}


// GERADOR EMAIL

function gerarExtensoes() {
    const baseEmail = document.getElementById('textoNormal').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const numeroInicial = parseInt(document.getElementById('numeroInicial').value);
    const resultadoTextarea = document.getElementById('emailResultado');

    if (!baseEmail || isNaN(quantidade) || quantidade <= 0 || isNaN(numeroInicial) || numeroInicial <= 0) {
        alert('Por favor, insira um e-mail válido, uma quantidade maior que 0 e um número inicial maior que 0.');
        return;
    }

    const [parte1, parte2] = baseEmail.split('@');
    const emailsGerados = [];

    for (let i = numeroInicial; i < numeroInicial + quantidade; i++) {
        const emailGerado = `${parte1}${String(i).padStart(2, '0')}@${parte2}`;
        emailsGerados.push(emailGerado);
    }

    resultadoTextarea.value = emailsGerados.join('\n');
}

function copiarEmailResultado() {
    const resultadoTextarea = document.getElementById('emailResultado');
    resultadoTextarea.select();
    resultadoTextarea.setSelectionRange(0, 99999); // Para dispositivos móveis
    document.execCommand('copy');
    alert('Resultado copiado para a área de transferência!');
}

// Donate
function copiarPixCode() {
    // Seleciona o campo de entrada
    const pixInput = document.getElementById('pixCode');
    pixInput.select(); // Seleciona o texto
    document.execCommand('copy'); // Copia o texto selecionado

    // Exibe uma mensagem para o usuário
    document.getElementById('mensagem').innerText = 'Código copiado para a área de transferência! Obrigado por apoiar';
}