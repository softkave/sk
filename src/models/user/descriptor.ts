// function trim(value) {
//   if (value && value.trim) {
//     return value.trim();
//   }
// }

// const textPattern = {
//   pattern: /\w+/,
//   message: "Only alphanumeric characters allowed"
// };

// const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
export const passwordPattern = /[A-Za-z0-9!()?_`~#$^&*+=]/;
export const textPattern = /\w+/;

// TODO: Delete appropriate
// const userDescriptor = {
//   name: [
//     { type: "string", required: true, max: 50, transform: trim },
//     textPattern
//   ],
//   email: [{ type: "email", required: true, max: 250, transform: trim }],
//   password: [
//     {
//       required: true,
//       type: "string"
//     },
//     {
//       min: 5,
//       message: "Password is too short"
//     },
//     {
//       max: 20,
//       message: "Password is too long"
//     },
//     {
//       pattern: passwordPattern,
//       message: "Password is invalid"
//     }
//   ]
// };
