const User = require('../models/User');
const Post = require('../models/Post'); // Adicione esta linha
const bcrypt = require('bcrypt');
const path = require('path');
const { error } = require('console');

// Controlador responsável por gerenciar todas as operações relacionadas aos usuários
class UserController {
    // Método para registrar um novo usuário no sistema
    // Recebe os dados do usuário via requisição e retorna o usuário criado
    static async register(req, res) {
        try {
            const { nome, email, senha, confirmarSenha, telefone, bairro, rua, numero, cpf } = req.body;

            // Validações
            if (!nome || !email || !senha || !confirmarSenha || !telefone || !bairro || !rua || !numero || !cpf) {
                return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
            }

            if (senha !== confirmarSenha) {
                return res.status(400).json({ success: false, message: 'As senhas não coincidem.' });
            }

            // Verifica se o email já está em uso
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Criar novo usuário
            const user = await User.create({
                nome,
                email,
                senha: hashedPassword,
                telefone,
                bairro,
                rua,
                numero,
                cpf
            });

            return res.status(201).json({
                success: true,
                message: 'Usuário cadastrado com sucesso!',
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            return res.status(500).json({ success: false, message: 'Erro ao processar o cadastro.' });
        }
    }

    // Método para autenticar um usuário no sistema
    // Valida as credenciais e cria uma sessão para o usuário
    static async login(req, res) {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
            }

            const user = await User.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(senha, user.senha))) {
                return res.status(401).json({ success: false, message: 'Email ou senha incorretos.' });
            }

            req.session.regenerate((err) => {
                if (err) {
                    console.error('Erro ao regenerar sessão:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao iniciar sessão.' });
                }

                // ✅ Salvando os dados do usuário na sessão
                req.session.user = {
                    id: user.id,
                    email: user.email
                };
                req.session.userId = user.id;

                req.session.save((err) => {
                    if (err) {
                        console.error('Erro ao salvar sessão:', err);
                        return res.status(500).json({ success: false, message: 'Erro ao salvar sessão.' });
                    }

                    return res.status(200).json({ success: true, message: 'Login bem-sucedido' });
                });
            });
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
        }
    }

    // Método para buscar os dados do usuário autenticado
    // Retorna informações pessoais e de endereço do usuário
    static async getUserData(req, res) {
        try {
            const user = await User.findByPk(req.session.user.id, {
                attributes: ['nome', 'email', 'telefone', 'bairro', 'rua', 'numero', 'profileImage']
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
            }

            res.json({
                success: true,
                user: {
                    nome: user.nome,
                    email: user.email,
                    telefone: user.telefone,
                    endereco: {
                        bairro: user.bairro,
                        rua: user.rua,
                        numero: user.numero
                    },
                    profileImage: user.profileImage
                }
            });
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar dados do usuário.' });
        }
    }

    // Método para atualizar os dados do usuário
    // Permite modificar informações pessoais e de endereço
    static async updateUserData(req, res) {
        try {
            const { nome, email, telefone, endereco } = req.body;
            const user = await User.findByPk(req.session.user.id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
            }

            await user.update({
                nome,
                email,
                telefone,
                bairro: endereco.bairro,
                rua: endereco.rua,
                numero: endereco.numero
            });

            res.json({ success: true, message: 'Dados atualizados com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            res.status(500).json({ success: false, message: 'Erro ao atualizar dados' });
        }
    }

    // Método para atualizar a imagem de perfil do usuário
    static async updateProfileImage(req, res) {
        try {
            if (!req.files || !req.files.profileImage) {
                return res.status(400).json({ success: false, message: 'Nenhuma imagem enviada.' });
            }

            const user = await User.findByPk(req.session.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
            }

            const profileImageFile = req.files.profileImage;
            const fileName = `profile_${req.session.user.id}_${Date.now()}${path.extname(profileImageFile.name)}`;
            const uploadPath = path.join(process.cwd(), 'public', 'img', 'uploads', fileName);

            await profileImageFile.mv(uploadPath);

            await user.update({ profileImage: `/img/uploads/${fileName}` });
            res.json({
                success: true,
                message: 'Imagem atualizada com sucesso',
                profileImage: `/img/uploads/${fileName}`
            });
        } catch (error) {
            console.error('Erro ao atualizar imagem:', error);
            res.status(500).json({ success: false, message: 'Erro ao atualizar imagem' });
        }
    }

    //Métdodo para deletar a conta do usuário
    static async deleteUser(req, res) {
        try {
            const userId = req.session.userId;

            const userToDelete = await User.findByPk(userId);

            if (!userToDelete) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // 1. Primeiro deletar posts associados ao usuário (se necessário)
            await Post.destroy({
                where: { userId: userId }
            });

            // 2. Depois deletar o usuário
            await userToDelete.destroy()

            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao destruir sessão após exclusão de conta:', err);
                    // Não impede a exclusão da conta, mas loga o erro
                }
            });
            res.status(200).json({ message: 'Usuário e todas as postagens associadas excluídos com sucesso.' });

            res.status(200).json({ message: 'Conta deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ message: 'Erro ao deletar conta' });
        }
    };

    // Método para realizar o logout do usuário
    // Destrói a sessão atual do usuário
    static async logout(req, res) {
        try {

            if (req.session.user.id == undefined) {
                throw new err("não está logado");
            }

            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao destruir sessão:', err);
                    throw res.status(500).json({ success: false, message: 'Erro ao fazer logout' });
                }
                res.json({ success: true, message: 'Logout realizado com sucesso' });
            });
        } catch (err) {
            console.error('Erro ao fazer logout:', err);
            res.status(500).json({ message: 'Erro para deletar a conta' });
        }
        
    }

}

module.exports = UserController;