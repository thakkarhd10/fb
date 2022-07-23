const md5 = require('md5')
const User = require('../models/User')
const UserSuggestion = require('../models/UserSuggestion')
const Joi = require('joi')
const { successResponse, errorResponse } = require('./common.controller')
const UserConnection = require('../models/UserConnection')

const userLoginOrRegistrationSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})


exports.userLoginOrRegistration = async function (req, res) {
    const requestBody = req.body
    try {
        await userLoginOrRegistrationSchema.validateAsync(requestBody)
    } catch (error) {
        return errorResponse(res, error, error.message, 400)
    }

    const count = await User.countDocuments()
    if (count === 0) {
        for (let index = 0; index <= 100; index++) {
            const newUserData = {
                email: `user${index}@gmail.com`,
                password: md5('123456')
            }
            const newUser = new User(newUserData)
            await newUser.save()
        }
    }

    const { email, password } = requestBody
    const userData = await User.findOne({ email: email })

    if (userData === null) {
        const newUserData = {
            email,
            password: md5(password)
        }
        const newUser = new User(newUserData)
        const savedUserData = await newUser.save()

        return successResponse(res, savedUserData, 'Login successfully')
    } else {
        if (md5(password) === userData.password) {
            return successResponse(res, userData, 'Login successfully')
        }
        return errorResponse(res, {}, 'password mismatch', 400)
    }
}

exports.getSuggestionUserList = async (req, res) => {
    const { userId } = req.body

    // User own id.
    let notSuggestionIds = [userId]

    let query = {
        $and: [
            {
                $or: [
                    {
                        sender_id: userId
                    },
                    {
                        receiver_id: userId
                    }
                ]
            },
            {
                $or: [
                    {
                        is_accepted: true
                    },
                    {
                        is_checked: false
                    }
                ]
            }
        ]
    }

    const alreadyConnectedUsers = await UserConnection.find(query, 'sender_id receiver_id')

    if (alreadyConnectedUsers.length > 0) {
        for (const iterator of alreadyConnectedUsers) {
            notSuggestionIds.push(iterator.receiver_id.toString())
            notSuggestionIds.push(iterator.sender_id.toString())
        }
    }

    notSuggestionIds = [...new Set(notSuggestionIds)]

    const alreadySuggestedUser = await UserSuggestion.find({ user_id: userId }, 'suggested_user_id')
    const alreadySuggestedUserIds = alreadySuggestedUser.map((item) => item.suggested_user_id)
    const finalIds = notSuggestionIds.concat(alreadySuggestedUserIds)

    const suggestionUsers = await User.find({ _id: { $nin: finalIds } }, '_id email').limit(2)

    if (suggestionUsers.length > 0) {
        for (const iterator of suggestionUsers) {
            const suggestionListData = {
                user_id: userId,
                suggested_user_id: iterator._id
            }
            const suggestedUser = new UserSuggestion(suggestionListData)
            await suggestedUser.save()
        }
        return successResponse(res, suggestionUsers, 'successfully get data')
    } else {
        await UserSuggestion.deleteMany({ user_id: userId })
        const suggestionUsers = await User.find({ _id: { $nin: notSuggestionIds } }, '_id email').limit(2)
        if (suggestionUsers.length > 0) {
            for (const iterator of suggestionUsers) {
                const suggestionListData = {
                    user_id: userId,
                    suggested_user_id: iterator._id
                }
                const suggestedUser = new UserSuggestion(suggestionListData)
                await suggestedUser.save()
            }
            return successResponse(res, suggestionUsers, 'successfully get data')
        } else {
            return successResponse(res, [], 'successfully get data')
        }
    }
}

exports.sendFriendRequest = async (req, res) => {
    const { userId } = req.body

    const data = {
        sender_id: userId,
        receiver_id: req.body.receiver_id
    }
    const userConnectionData = new UserConnection(data)
    await userConnectionData.save()
    return successResponse(res, {}, 'successfully send friend request')
}

exports.getFriendList = async (req, res) => {
    const { userId } = req.body

    const query = {
        is_accepted: true,
        $or: [
            {
                sender_id: userId
            },
            {
                receiver_id: userId
            }
        ]
    }

    const userList = await UserConnection.find(query)
    const resData = []
    if (userList.length > 0) {
        for (const iterator of userList) {
            let friendUserData
            if (iterator.sender_id.toString() === userId) {
                friendUserData = await User.findById(iterator.receiver_id, '_id email')
            } else {
                friendUserData = await User.findById(iterator.sender_id, '_id email')
            }
            resData.push(friendUserData)
        }
    }
    return successResponse(res, resData, 'successfully get list')
}


exports.getRequestList = async (req, res) => {
    const { userId } = req.body

    const query = {
        is_checked: false,
        receiver_id: userId
    }

    const userList = await UserConnection.find(query)
    const resData = []
    if (userList.length > 0) {
        for (const iterator of userList) {
            const friendUserData = await User.findById(iterator.sender_id, '_id email')
            resData.push(friendUserData)
        }
    }
    return successResponse(res, resData, 'successfully get list')
}

exports.respondToFriendRequest = async (req, res) => {
    const { userId } = req.body

    const query = {
        receiver_id: userId,
        sender_id: req.body.sender_id,
        is_checked: false
    }

    const userConnectionData = await UserConnection.findOne(query)

    userConnectionData.is_checked = true
    userConnectionData.updated_at = new Date()
    userConnectionData.is_accepted = req.body.is_accepted
    await userConnectionData.save()

    return successResponse(res, {}, 'successfully respond')
}

exports.getMutualFriendList = async (req, res) => {
    const { userId, mutualFriendId } = req.body
    let query = {
        is_accepted: true,
        $or: [
            { sender_id: userId },
            { receiver_id: userId }
        ]
    }

    const myUserList = await UserConnection.find(query)

    if (myUserList.length === 0) {
        return successResponse(res, [], 'successfully get list')
    }
    let userIds = []
    for (const iterator of myUserList) {
        userIds.push(iterator.sender_id)
        userIds.push(iterator.receiver_id)
    }

    userIds = [...new Set(userIds)]

    query = {
        is_accepted: true,
        $or: [
            {
                $and: [
                    {
                        sender_id: mutualFriendId
                    },
                    {
                        receiver_id: { $in: userIds }
                    }
                ]
            },
            {
                $and: [
                    {
                        sender_id: { $in: userIds }
                    },
                    {
                        receiver_id: mutualFriendId
                    }
                ]
            }
        ]
    }
    const mutualFriendList = await UserConnection.find(query)

    const resData = []
    for (const iterator of mutualFriendList) {
        let userData
        if (iterator.sender_id.toString() === mutualFriendId) {
            userData = await User.findById(iterator.receiver_id)
        } else {
            userData = await User.findById(iterator.sender_id)
        }
        resData.push(userData)
    }
    return successResponse(res, resData, 'successfully get list')
}
