import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatItem from "../ChatItem";

test("renders chat item", () => {
  render(
    <ChatItem
      name="محمدحسین"
      description="پیام آخر"
      image="https://salam.com/salam.png"
    />
  );
  const nameElement = screen.getByText(/محمدحسین/i);
  const descriiptionElement = screen.getByText(/پیام آخر/i);
  const imageElement = screen.getByRole("img");
  expect(nameElement).toBeInTheDocument();
  expect(descriiptionElement).toBeInTheDocument();
  expect(imageElement).toBeInTheDocument();
});
