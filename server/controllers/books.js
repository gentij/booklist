const User = require('../models/User');
const checkAuth  = require('../utils/checkAuth');

exports.addBook = async (req, res, next) => {
    const reqData = req.body;

    const { user, authError } = await checkAuth(req);
    if(authError) {
        return res.status(400).json({ errors: authError});
    }

    let errors = [];
    if (!reqData.title) {
      errors.push({ title: "required" });
    }
    if (!reqData.author) {
      errors.push({ author: "required" });
    }
    if (!reqData.completed) {
        errors.push({ completed: "required" });
    }
    if (!reqData.pages) {
        errors.push({ pages: "required" });
    }
    if (!reqData.readPages) {
        reqData.image = undefined
    }
    if (!reqData.image) {
        reqData.image = undefined
    }
    if (!reqData.impressions) {
        reqData.impressions = undefined
    }
    if (!reqData.rating) {
        reqData.rating = undefined
    }
    if (errors.length > 0) {
     return res.status(422).json({ errors: errors });
    }

    try {
        const dbUser = await User.findById(user.userId)
        if(user.username === dbUser.username) {
            const books = [reqData, ...dbUser.books]
            await dbUser.updateOne({ books }, (err, result) => {
                if(err) return err
                return res.status(200).json({
                    success: true,
                    message: dbUser
                })
            })
        }
    } catch (error) {
        return error
    }

}