const express = require('express')
const { protectRoute } = require('../middleware/user.middleware')
const router = express.Router()
const UserController = require('./../controllers/user.controller')

router.post('/login-or-register', UserController.userLoginOrRegistration)
router.post('/get-suggestion-user-list', [protectRoute], UserController.getSuggestionUserList)
router.post('/send-friend-request', [protectRoute], UserController.sendFriendRequest)
router.post('/get-friend-list', [protectRoute], UserController.getFriendList)
router.post('/get-request-list', [protectRoute], UserController.getRequestList)
router.post('/respond-friend-request', [protectRoute], UserController.respondToFriendRequest)
router.post('/get-mutual-friend-list', [protectRoute], UserController.getMutualFriendList)

module.exports = router
