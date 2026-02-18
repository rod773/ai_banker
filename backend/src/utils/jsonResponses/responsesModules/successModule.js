module.exports = (message = 'Successful response') => ({
    status: 200,
    data: {
      type: 'Success',
      message,
    },
  });