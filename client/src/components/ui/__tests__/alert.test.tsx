import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription } from "../alert";

describe("Alert", () => {
  it("renders with default variant", () => {
    render(<Alert>Test alert message</Alert>);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Test alert message")).toBeInTheDocument();
  });

  it("renders with destructive variant", () => {
    render(<Alert variant="destructive">Destructive alert message</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("border-destructive/50", "text-destructive");
  });

  it("applies custom className", () => {
    render(<Alert className="custom-class">Test alert</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Alert ref={ref}>Test alert</Alert>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with additional props", () => {
    render(
      <Alert aria-label="Custom alert" data-testid="custom-alert">
        Test alert
      </Alert>
    );

    const alert = screen.getByTestId("custom-alert");
    expect(alert).toHaveAttribute("aria-label", "Custom alert");
  });

  it("handles empty content", () => {
    render(<Alert />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("handles complex content", () => {
    render(
      <Alert>
        <div>Complex content</div>
        <span>With multiple elements</span>
      </Alert>
    );

    expect(screen.getByText("Complex content")).toBeInTheDocument();
    expect(screen.getByText("With multiple elements")).toBeInTheDocument();
  });

  it("handles very long content", () => {
    const longContent = "a".repeat(1000);
    render(<Alert>{longContent}</Alert>);

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it("handles special characters in content", () => {
    const specialContent = "Alert with @#$%^&*() characters";
    render(<Alert>{specialContent}</Alert>);

    expect(screen.getByText(specialContent)).toBeInTheDocument();
  });
});

describe("AlertDescription", () => {
  it("renders with default styling", () => {
    render(<AlertDescription>Test description</AlertDescription>);

    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<AlertDescription className="custom-desc-class">Test description</AlertDescription>);

    const description = screen.getByText("Test description");
    expect(description).toHaveClass("custom-desc-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<AlertDescription ref={ref}>Test description</AlertDescription>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with additional props", () => {
    render(
      <AlertDescription aria-label="Custom description" data-testid="custom-desc">
        Test description
      </AlertDescription>
    );

    const description = screen.getByTestId("custom-desc");
    expect(description).toHaveAttribute("aria-label", "Custom description");
  });

  it("handles empty content", () => {
    render(<AlertDescription />);

    const description = screen.getByTestId("alert-description");
    expect(description).toBeInTheDocument();
  });

  it("handles complex content", () => {
    render(
      <AlertDescription>
        <p>Paragraph content</p>
        <strong>Bold content</strong>
      </AlertDescription>
    );

    expect(screen.getByText("Paragraph content")).toBeInTheDocument();
    expect(screen.getByText("Bold content")).toBeInTheDocument();
  });

  it("handles very long content", () => {
    const longContent = "a".repeat(1000);
    render(<AlertDescription>{longContent}</AlertDescription>);

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it("handles special characters in content", () => {
    const specialContent = "Description with @#$%^&*() characters";
    render(<AlertDescription>{specialContent}</AlertDescription>);

    expect(screen.getByText(specialContent)).toBeInTheDocument();
  });
});

describe("Alert Integration", () => {
  it("works together with AlertDescription", () => {
    render(
      <Alert>
        <AlertDescription>This is a description</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("This is a description")).toBeInTheDocument();
  });

  it("handles multiple AlertDescription components", () => {
    render(
      <Alert>
        <AlertDescription>First description</AlertDescription>
        <AlertDescription>Second description</AlertDescription>
      </Alert>
    );

    expect(screen.getByText("First description")).toBeInTheDocument();
    expect(screen.getByText("Second description")).toBeInTheDocument();
  });

  it("handles mixed content types", () => {
    render(
      <Alert>
        <h3>Alert Title</h3>
        <AlertDescription>Alert description</AlertDescription>
        <button>Action button</button>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Alert description")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
