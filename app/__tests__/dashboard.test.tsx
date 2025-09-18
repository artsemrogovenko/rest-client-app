import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Dashboard from "~/routes/dashboard/dashboard";
import type { AuthUser } from "~/contexts/auth/types";

const mockUseAuth = vi.fn();
vi.mock("~/contexts/auth/useAuth", () => ({
  default: () => mockUseAuth(),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders loading when user is null", () => {
    mockUseAuth.mockReturnValue({ user: null, setUser: vi.fn() });

    render(<Dashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders welcome message when user exists", () => {
    const mockUser: AuthUser = {
      uid: "123",
      email: "test@example.com",
      displayName: "Tester",
    };

    mockUseAuth.mockReturnValue({ user: mockUser, setUser: vi.fn() });

    render(<Dashboard />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
