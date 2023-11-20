import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SmallPoster from "../SmallPoster";
test("renders chat item", () => {
  render(
    <SmallPoster
      id={1}
      categories={[
        {
          id: 4,
          created_at: "2023-11-13T23:54:46.175904Z",
          updated_at: "2023-11-13T23:54:46.175904Z",
          deleted_at: null,
          name: "عروسک",
          state: "accepted",
          posters: null,
        },
      ]}
      special_type="special"
      // time_description={poster.time_description}
      award={0}
      found={true}
      location="آبشار"
      title="عروسک سفید"
      description="پیام آخر"
      image="https://salam.com/salam.png"
    />
  );
  const titleElement = screen.getByText("عروسک سفید");
  const descriptionElement = screen.getByText(/پیام آخر/i);
  const imageElement = screen.getByRole("img");
  expect(titleElement).toBeInTheDocument();
  expect(descriptionElement).toBeInTheDocument();
  expect(imageElement).toBeInTheDocument();
});
