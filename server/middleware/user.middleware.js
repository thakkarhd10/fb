const { errorResponse } = require("../controllers/common.controller")
const User = require("../models/User")

const protectRoute = async (req, res, next) => {
    const { userId } = req.body
    if (userId) {
        const user = await User.findById(userId)
        if (user === null) {
            return errorResponse(res, { error: 'Unauthorized' }, 'Unauthorized', 401)
        }
        next()
    } else {
        return errorResponse(res, { error: 'You are not authorized to access this route' }, 'Unauthorized', HTTP_UNAUTHORIZED_401)
    }
}

module.exports = { protectRoute }
