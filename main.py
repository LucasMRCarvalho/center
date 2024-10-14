from flask import Flask, render_template, request, redirect, url_for, session, flash, make_response, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from flask_cors import CORS

app = Flask(__name__, template_folder='backend/templates', static_folder='static')

# Inicialize o Flask-CORS
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})


# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Chave secreta para gerenciar a sessão
app.secret_key = 'kjdkjlahdkajsdlk'

# Credenciais de administrador (apenas para você)
ADMIN_USER = 'fanexty'
ADMIN_PASS = 'fanexty'

# Modelo de usuário
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Criar o banco de dados
with app.app_context():
    db.create_all()

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
        flash('Login efetuado com sucesso!', 'success')  # Mensagem de sucesso
        return redirect(url_for('dashboard'))  # Redireciona para o dashboard
    
    # Verifica se o usuário existe e se a senha está correta
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        session['user'] = username  # Cria uma sessão para o usuário registrado
        flash('Login efetuado com sucesso!', 'success')  # Mensagem de sucesso
        return redirect(url_for('dashboard'))  # Redireciona para o dashboard
    else:
        flash('Usuário ou senha incorretos!', 'danger')  # Mostra erro de login
        return redirect(url_for('index'))

# Rota api bot
@app.route('/api/info')
def get_info():
    vencimento = "SEU BOT ESTÁ VENCIDO!" if Admin.tempo_ate_o_vencimento() <= 0 else f'SEU BOT VENCE EM {Admin.tempo_ate_o_vencimento()} DIAS!'
    info = {
        "vencimento": vencimento,
        "total_users": Admin.total_users(),
        "receita_total": Admin.receita_total(),
        "receita_hoje": Admin.receita_hoje(),
        "acessos_vendidos": Admin.acessos_vendidos(),
        "acessos_vendidos_hoje": Admin.acessos_vendidos_hoje()
    }
    return jsonify(info)

# Rota para o dashboard
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:  # Verifica se o usuário não está logado
        flash('Você precisa estar logado para acessar o dashboard.', 'danger')
        return redirect(url_for('index'))  # Redireciona para a tela de login
    users = User.query.all()  # Obtém todos os usuários do banco de dados
    response = make_response(render_template('dashboard.html', users=users))  # Exibe o dashboard para todos os usuários
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
    response.headers['Pragma'] = 'no-cache'
    return response

# Rota para logout
@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove a sessão do usuário
    flash('Você foi deslogado com sucesso.', 'success')
    return redirect(url_for('index'))

# Rota para o registro (apenas administrador)
@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user' in session and session['user'] == 'admin':
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            hashed_password = generate_password_hash(password)  # Criptografa a senha
            
            # Verifica se o nome de usuário já existe
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                flash('Usuário já registrado! Escolha outro nome de usuário.', 'danger')
                return redirect(url_for('register'))  # Redireciona para a página de registro

            # Adiciona o novo usuário ao banco de dados
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            flash('Registro realizado com sucesso!', 'success')
            return redirect(url_for('dashboard'))

        return render_template('register.html')  # Exibe a página de registro
    else:
        flash('Acesso negado! Somente o administrador pode registrar novos usuários.', 'danger')
        return redirect(url_for('dashboard'))  # Redireciona para o dashboard

# Decorador para verificar se o usuário está logado
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            flash('Você precisa estar logado para acessar esta página.', 'danger')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

# Aplicar o decorador em rotas que requerem login
@app.route('/configbot')
@login_required
def configbot():
    return render_template('configbot.html')

@app.route('/inline')
@login_required
def inline():
    return render_template('inline.html')

@app.route('/organizador')
@login_required
def organizador():
    return render_template('organizador.html')

@app.route('/orgdb')
@login_required
def orgdb():
    return render_template('orgdb.html')

@app.route('/quebra')
@login_required
def quebra():
    return render_template('quebra.html')

if __name__ == '__main__':
    app.run(debug=True)
