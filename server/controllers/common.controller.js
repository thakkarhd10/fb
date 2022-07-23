exports.successResponse = (res, data, message) => {
    const response = {
        is_success: true,
        data: data,
        message: message,
        status: 200
    }
    return res.status(200).json(response)
}

exports.errorResponse = (res, errors, message, status) => {
    const response = {
        is_success: false,
        errors: errors,
        message: message,
        status: status
    }
    return res.status(status).json(response)
}
