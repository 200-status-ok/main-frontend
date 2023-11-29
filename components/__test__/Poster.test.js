/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Poster from "../Poster";

jest.mock("next/image", () => ({ src, alt }) => (
  <img src={"https://www.google.com"} alt={alt} />
));

describe("Poster component", () => {
  const sampleProps = {
    image: "path/to/image.jpg",
    title: "Sample Title",
    description: "This is a sample description.",
    found: true,
    lost: false,
    location: "Sample Location",
    time_description: "Sample Time",
  };

  test("renders Poster component with provided props", () => {
    render(<Poster {...sampleProps} />);

    expect(screen.getByAltText("Sample Title")).toBeInTheDocument(); // Assuming alt text is set to the title
    expect(screen.getByText("Sample Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is a sample description.")
    ).toBeInTheDocument();
    // expect(
    //   screen.getByText("Sample Time پیدا شده در Sample Location")
    // ).toBeInTheDocument();
    expect(screen.queryByText("گم شده")).toBeNull(); // Ensure the "گم شده" text is not present
  });

  test("check long descriptions", () => {
    const longDescription =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.ipsum dolor sit amet, consectetur adipiscing elitipsum dolor sit amet, consectetur adipiscing elitipsum dolor sit amet, consectetur adipiscing elitipsum dolor sit amet, consectetur adipiscing elit";
    render(<Poster {...sampleProps} description={longDescription} />);

    expect(
      screen.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing ...")
    ).toBeInTheDocument(); // Check if the description is truncated
  });

  test("renders Poster component for lost item", () => {
    const lostProps = {
      ...sampleProps,
      found: false,
      lost: true,
    };
    render(<Poster {...lostProps} />);

    // expect(
    //   screen.getByText("Sample Time گم شده در Sample Location")
    // ).toBeInTheDocument();
    expect(screen.queryByText("پیدا شده")).toBeNull(); // Ensure the "پیدا شده" text is not present
  });
});
