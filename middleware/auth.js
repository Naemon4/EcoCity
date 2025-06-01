const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    console.log('Middleware de autenticação acionado. Session userId:', req.session.userId);
    // Verifica se o userId está na sessão ou nos cabeçalhos
    const userId = req.session.userId || req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Não autorizado: Usuário não logado.' });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            // Se o usuário não for encontrado, limpa a sessão para evitar loops
            req.session.destroy(err => {
                if (err) {
                    console.error('Erro ao destruir a sessão:', err);
                }
            });
            return res.status(401).json({ success: false, message: 'Não autorizado: Usuário não encontrado.' });
        }

        // Anexa o objeto do usuário à requisição
        req.user = user;
        next();
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

module.exports = authMiddleware;