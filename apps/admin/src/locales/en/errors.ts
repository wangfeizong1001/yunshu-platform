export default {
  // HTTP Errors
  http: {
    400: 'Bad Request',
    401: 'Session expired, please login again',
    403: 'You do not have permission to perform this operation',
    404: 'Resource not found',
    405: 'Method not allowed',
    408: 'Request timeout, please try again later',
    500: 'Server error, please try again later',
    502: 'Gateway error, please try again later',
    503: 'Service temporarily unavailable, please try again later',
    504: 'Gateway timeout, please try again later',
  },

  // Business Errors
  business: {
    paramError: 'Parameter error',
    validateError: 'Data validation failed',
    unauthorized: 'Unauthorized, please login',
    forbidden: 'No permission',
    notFound: 'Resource not found',
    serverError: 'Server error, please try again later',
  },

  // Auth Errors
  auth: {
    tokenExpired: 'Session expired, please login again',
    tokenInvalid: 'Token is invalid',
    tokenEmpty: 'Token cannot be empty',
    loginFailed: 'Login failed, username or password is incorrect',
    logoutSuccess: 'Logout successful',
  },

  // Validation Errors
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    number: 'Please enter a number',
    integer: 'Please enter an integer',
    min: 'Value cannot be less than {min}',
    max: 'Value cannot be greater than {max}',
    range: 'Value should be between {min} and {max}',
    minLength: 'Length cannot be less than {min} characters',
    maxLength: 'Length cannot exceed {max} characters',
    pattern: 'Format is incorrect',
    equalTo: 'Inputs do not match',
    username: 'Username can only contain letters, numbers and underscores',
    password: 'Password length cannot be less than 6 characters',
    captcha: 'Captcha is incorrect',
    idCard: 'Please enter a valid ID card number',
  },

  // Page Errors
  page: {
    notFound: 'Sorry, the page you visited does not exist',
    serverError: 'Sorry, server error occurred',
    unauthorized: 'Sorry, you do not have access permission',
    networkError: 'Network connection failed, please check your network settings',
    backHome: 'Back to Home',
    goBack: 'Go Back',
    refresh: 'Refresh Page',
  },

  // File Errors
  file: {
    uploadFail: 'File upload failed',
    downloadFail: 'File download failed',
    notFound: 'File not found',
    tooLarge: 'File size exceeds limit',
    typeError: 'File type not allowed',
    damaged: 'File is corrupted',
  },
};
