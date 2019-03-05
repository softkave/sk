// import {
//   userSignupMutation
// } from "../query/user";
// import {
//   q
// } from "./q";

async function l() {

}

async function signup() {
  let user = {
    name: "Abayomi Akintomide",
    email: "ywordk@gmail.com",
    password: "abc123!"
  };

  await q(userSignupMutation, user);
}

// signup();