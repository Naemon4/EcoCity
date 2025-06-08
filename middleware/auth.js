const User = require('../models/User');

//autenticador do usuário com base no model
//não colocar ele para retornar o 'success true', por algum motivo quebra o codigo e nn faz diferença nenhuma
const authMiddleware = async (req, res, next) => {
    const userId = req.session.userId
    console.log('Middleware de autenticação acionado. Session userId:', userId);

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Não autorizado: Usuário não logado.' });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            req.session.destroy(err => {
                if (err) {
                    console.error('Erro ao destruir a sessão:', err);
                }
            });
            return res.status(401).json({ success: false, message: 'Não autorizado: Usuário não encontrado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

module.exports = authMiddleware;
