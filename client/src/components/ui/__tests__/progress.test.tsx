import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "../progress";

describe("Progress", () => {
  it("renders with default props", () => {
    render(<Progress />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("renders with custom value", () => {
    render(<Progress value={50} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("renders with maximum value", () => {
    render(<Progress value={100} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("renders with minimum value", () => {
    render(<Progress value={0} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles decimal values", () => {
    render(<Progress value={33.33} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles negative values", () => {
    render(<Progress value={-10} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles values above 100", () => {
    render(<Progress value={150} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Progress className="custom-progress" value={50} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveClass("custom-progress");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Progress ref={ref} value={50} />);
    
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("renders with additional props", () => {
    render(
      <Progress 
        data-testid="custom-progress" 
        aria-label="Custom progress"
        value={75}
      />
    );
    
    const progress = screen.getByTestId("custom-progress");
    expect(progress).toHaveAttribute("aria-label", "Custom progress");
  });

  it("handles undefined value", () => {
    render(<Progress value={undefined} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles null value", () => {
    render(<Progress value={null as any} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles very large values", () => {
    const largeValue = 999999;
    render(<Progress value={largeValue} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles very small decimal values", () => {
    render(<Progress value={0.001} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles zero value", () => {
    render(<Progress value={0} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles exact 50% value", () => {
    render(<Progress value={50} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles exact 100% value", () => {
    render(<Progress value={100} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles string values", () => {
    render(<Progress value={"75" as any} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles boolean values", () => {
    render(<Progress value={true as any} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles false boolean value", () => {
    render(<Progress value={false as any} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles array values", () => {
    render(<Progress value={[25] as any} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles object values", () => {
    render(<Progress value={{ value: 50 } as any} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles NaN values", () => {
    render(<Progress value={NaN} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles Infinity values", () => {
    render(<Progress value={Infinity} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles -Infinity values", () => {
    render(<Progress value={-Infinity} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("maintains accessibility attributes", () => {
    render(<Progress value={25} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("role", "progressbar");
  });

  it("handles rapid value changes", () => {
    const { rerender } = render(<Progress value={0} />);
    
    let progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
    
    rerender(<Progress value={25} />);
    progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
    
    rerender(<Progress value={50} />);
    progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
    
    rerender(<Progress value={75} />);
    progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
    
    rerender(<Progress value={100} />);
    progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles edge case values around boundaries", () => {
    const { rerender } = render(<Progress value={0.1} />);
    
    let progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
    
    rerender(<Progress value={99.9} />);
    progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
    
    rerender(<Progress value={-0.1} />);
    progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
    
    rerender(<Progress value={100.1} />);
    progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles very long decimal values", () => {
    const longDecimal = 50.123456789;
    render(<Progress value={longDecimal} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles scientific notation values", () => {
    render(<Progress value={1e-10} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("handles large scientific notation values", () => {
    render(<Progress value={1e10} />);
    
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });
}); 