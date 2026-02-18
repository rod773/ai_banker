module.exports = (message = 'Server error') => ({
    status: 500,
    error: {
      type: 'InternalServerError',
      message,
    },
  });