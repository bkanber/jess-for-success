
const requireToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({error: 'Token is required'});
    }
    const obj = await req.app.locals.Models.Token.findOne({
        where: {
            token: token.replace('Bearer ', '').trim(),
            expiresAt: {
                [req.app.locals.Models.Sequelize.Op.gt]: new Date() // Check if token is not expired
            }
        },
        include: [{model: req.app.locals.Models.Account}]
    });
    if (!obj || !obj.Account) {
        return res.status(401).json({error: 'Invalid token'});
    }
    req.account = obj.Account; // Attach account to request for further use
    req.token = obj; // Attach token object to request
    next();
};

export default requireToken;