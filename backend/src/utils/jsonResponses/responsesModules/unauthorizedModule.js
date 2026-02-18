module.exports = (message = 'Authenticate to access this resource') => ({
    status: 401,
    error: {
      type: 'Unauthorized',
      message,
    },
  });