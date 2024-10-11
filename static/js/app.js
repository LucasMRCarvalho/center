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

// Função para limpar os campos
function limparCampos() {
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

// Função para exibir alertas
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);

    // Remover o alerta após 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Verificar mensagens de sessão (definidas no PHP)
const urlParams = new URLSearchParams(window.location.search);
const successMessage = urlParams.get('success');
const errorMessage = urlParams.get('error');

if (successMessage) {
    showAlert('success', successMessage);
}

if (errorMessage) {
    showAlert('error', errorMessage);
}


// Função para carregar estatísticas do servidor
async function loadStatistics() {
    try {
        const response = await fetch('http://172.21.1.81:5000/api/statistics'); 
        if (!response.ok) {
            throw new Error('Erro na rede: ' + response.statusText);
        }
        const stats = await response.json();

        // Atualiza os elementos com as estatísticas
        document.querySelector('.stats-section:nth-of-type(1) strong').textContent = stats.total_users;
        document.querySelector('.stats-section:nth-of-type(2) strong:nth-of-type(1)').textContent = `R$${stats.total_revenue.toFixed(2)}`;
        document.querySelector('.stats-section:nth-of-type(2) strong:nth-of-type(2)').textContent = `R$${stats.today_revenue.toFixed(2)}`;
        document.querySelector('.stats-section:nth-of-type(3) strong:nth-of-type(1)').textContent = stats.total_accesses_sold;
        document.querySelector('.stats-section:nth-of-type(3) strong:nth-of-type(2)').textContent = stats.today_accesses_sold;

        // Atualiza a mensagem de vencimento
        document.querySelector('p strong').textContent = stats.vencimento;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carrega as estatísticas ao carregar a página
window.onload = loadStatistics;


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

// Função para limpar todos os campos de resultado
function limparCampos() {
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
            const dado = partes[1]; // Pode ser CPF ou email
            const senha = partes[2]; // Senha

            // Filtra de acordo com a seleção do tipo de dado (email ou cpf)
            if (tipoDado === "email" && dado.includes("@")) {
                resultadoSet.add(`${dado}:${senha}`); // Adiciona ao Set (evita duplicatas)
            } else if (tipoDado === "cpf" && !dado.includes("@")) {
                resultadoSet.add(`${dado}:${senha}`); // Adiciona ao Set (evita duplicatas)
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

// Função para limpar os campos
function limparCampos() {
    document.getElementById("textoLinks").value = ''; // Limpa o campo de entrada
    document.getElementById("textoResultado").value = ''; // Limpa o campo de saída
    document.getElementById("tipoDado").value = 'email'; // Reseta o tipo de dado para email
}

