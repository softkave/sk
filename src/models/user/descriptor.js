function trim(value) {
  if (value.trim) {
    return value.trim();
  }
}

const textPattern = {
  pattern: /\w+/,
  message: "only alphanumeric characters allowed"
};

// const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
const passwordPattern = /^[A-Za-z\d$@$!%*#?&]$/;
const userDescriptor = {
  name: [
    { type: "string", required: true, max: 50, transform: trim },
    textPattern
  ],
  email: [{ type: "email", required: true, max: 250, transform: trim }],
  password: [
    {
      required: true,
      type: "string"
    },
    {
      max: 50,
      message: "password is too long"
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
