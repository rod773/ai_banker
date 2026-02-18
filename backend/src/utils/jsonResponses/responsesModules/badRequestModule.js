module.exports = (message = 'Bad request') => ({
    status: 400,
    error: {
      type: 'BadRequest',
      message,
    },
  });
  