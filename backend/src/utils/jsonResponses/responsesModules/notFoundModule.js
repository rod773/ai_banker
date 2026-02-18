module.exports = (message = 'Resource not found') => ({
    status: 404,
    error: {
      type: 'NotFound',
      message,
    },
  });