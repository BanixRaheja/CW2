const logger = (req, res, next) => {
    console.log({
        method: req.method,
        url: req.url,
        status: res.statusCode
    });

    next();
};

module.exports = logger;