exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Достъпът е забранен' });
        }
        next();
    };
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Достъпът е забранен' });
    }
    next();
};