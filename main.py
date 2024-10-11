from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__, template_folder='backend/templates', static_folder='static')

# Chave secreta para gerenciar a sessão
app.secret_key = 'kjdkjlahdkajsdlk'  # Substitua por uma chave secreta real

# Credenciais de administrador (apenas para você)
ADMIN_USER = 'fanexty'
ADMIN_PASS = 'fanexty'

# Rota para página inicial (Login)
@app.route('/')
def index():
    return render_template('index.html')

# Rota para processar o login
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    # Verifica as credenciais do admin
    if username == ADMIN_USER and password == ADMIN_PASS:
        session['user'] = 'admin'  # Cria uma sessão para o administrador
        return redirect(url_for('dashboard'))  # Redireciona para o painel admin
    else:
        flash('Usuário ou senha incorretos!', 'danger')  # Mostra erro de login
        return redirect(url_for('index'))

# Rota protegida para o painel de administração
@app.route('/dashboard')
def dashboard():
    if 'user' in session and session['user'] == 'admin':
        return render_template('dashboard.html')  # Exibe o painel de administração
    else:
        flash('Acesso negado! Faça login como administrador.', 'danger')
        return redirect(url_for('index'))

# Rota para logout
@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove a sessão do admin
    flash('Você foi deslogado com sucesso.', 'success')
    return redirect(url_for('index'))

# Rota protegida para o registro (apenas administrador)
@app.route('/register')
def register():
    if 'user' in session and session['user'] == 'admin':
        return render_template('register.html')  # Exibe a página de registro
    else:
        flash('Acesso negado! Somente o administrador pode registrar novos usuários.', 'danger')
        return redirect(url_for('index'))

# Outras rotas (públicas)
@app.route('/configbot')
def configbot():
    return render_template('configbot.html')

@app.route('/inline')
def inline():
    return render_template('inline.html')

@app.route('/organizador')
def organizador():
    return render_template('organizador.html')

@app.route('/orgdb')
def orgdb():
    return render_template('orgdb.html')

@app.route('/quebra')
def quebra():
    return render_template('quebra.html')

if __name__ == '__main__':
    app.run(debug=True)
