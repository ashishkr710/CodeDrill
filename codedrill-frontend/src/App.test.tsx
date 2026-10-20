import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ success: true, data: { status: "UP" } }),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders CodeDrill brand and main track cards", async () => {
    await act(async () => {
      render(<App />);
    });

    const brandElements = screen.getAllByText(/CodeDrill/i);
    expect(brandElements.length).toBeGreaterThanOrEqual(1);
    expect(brandElements[0]).toBeInTheDocument();
    expect(screen.getByText(/Java Collections Deep Dive/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Data Structures & Algorithms/i),
    ).toBeInTheDocument();
  });

  it("renders streak indicator and 5 practice modalities", async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/5 Day Streak/i)).toBeInTheDocument();
    expect(screen.getByText(/MCQs/i)).toBeInTheDocument();
    expect(screen.getByText(/Output Prediction/i)).toBeInTheDocument();
    expect(screen.getByText(/Monaco Sandbox/i)).toBeInTheDocument();
  });
});
