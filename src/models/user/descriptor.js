//const isMobilePhone = require('validator/lib/isMobilePhone');

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
const userDescriptor = {
  name: [{ type: "string", required: true, max: 50, pattern: /\w+/ }],
  email: [{ type: "email", required: true, max: 250, pattern: /\w+/ }],
  password: [
    {
      required: true,
      type: "string"
    },
    {
      pattern: passwordPattern,
      message: "password is invalid"
    }
  ]
};

module.exports = {
  userDescriptor
};
