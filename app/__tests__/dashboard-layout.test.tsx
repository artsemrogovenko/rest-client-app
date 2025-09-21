import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import DashboardLayout from "~/routes/dashboard/dashboard-layout";
import type { User } from "firebase/auth";

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual: Record<string, unknown> = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

describe("DashboardLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    );

  it("renders Outlet content", () => {
    renderWithRouter();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });  
});
