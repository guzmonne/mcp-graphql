exports = module.exports = function (req, res, next) {
    console.log('ip:', req.ip);
    next()
}

