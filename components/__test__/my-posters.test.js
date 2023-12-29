import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import MyPosters from "../../pages/my-posters";
import { useAuth } from "../../context/AuthProvider";
import { http } from "../../http-services/http";

jest.mock("../../context/AuthProvider");
jest.mock("../../http-services/http");

describe("MyPosters component", () => {
  const mockAuth = {
    auth: { token: "mockToken", showLoginPopup: false },
    setAuth: jest.fn(),
  };

  const mockPosters = [
    {
      id: 1,
      image: [{ url: "poster1.jpg" }],
      title: "Lost Poster",
      address: [{ address_detail: "123 Main St" }],
      description: "Lost description",
      tags: ["Lost", "Pet"],
      status: "lost",
      award: 100,
      state: "approved",
    },
    // Add more mock posters as needed
  ];

  beforeEach(() => {
    useAuth.mockReturnValue(mockAuth);
    http.get.mockResolvedValue({ data: { posters: mockPosters } });
  });

  test("renders MyPosters component with user's posters", async () => {
    render(<MyPosters />);

    // Wait for the posters to be fetched and displayed
    await waitFor(() => {
      expect(http.get).toHaveBeenCalledWith("/api/v1/users/authorize/", {
        headers: { Authorization: "Bearer mockToken" },
      });
      expect(screen.getByText("آگهی های من")).toBeInTheDocument();
      mockPosters.forEach((poster) => {
        expect(screen.getByText(poster.title)).toBeInTheDocument();
      });
    });
  });

  test("renders 'بدون آگهی' when there are no posters", async () => {
    // Modify the mock data to have an empty list of posters
    http.get.mockResolvedValue({ data: { posters: [] } });

    render(<MyPosters />);

    // Wait for the 'بدون آگهی' message to be displayed
    await waitFor(() => {
      expect(screen.getByText("بدون آگهی")).toBeInTheDocument();
    });
  });
});
