// __tests__/fetch.test.js
import React from "react";
import { rest, setupServer } from "msw";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Task from "../Task";

const server = setupServer(
  rest.get("/greeting", (req, res, ctx) => {
    return res(ctx.json({ greeting: "hello there" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays greeting", async () => {
  render(<Task />);
});
