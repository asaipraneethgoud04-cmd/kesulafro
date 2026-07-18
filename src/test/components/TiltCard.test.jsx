import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TiltCard from '../../components/ui/TiltCard';

describe('TiltCard Component', () => {
  it('renders children correctly', () => {
    render(<TiltCard><div>Child Content</div></TiltCard>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TiltCard className="custom-test-class">Content</TiltCard>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass('custom-test-class');
  });

  it('renders as different element type', () => {
    render(<TiltCard elementType="section" data-testid="tilt">Section Content</TiltCard>);
    const element = screen.getByTestId('tilt');
    expect(element.tagName).toBe('SECTION');
  });

  it('handles mouse events without crashing (throttled)', () => {
    // requestAnimationFrame is mocked/handled by jsdom or we mock it
    vi.stubGlobal('requestAnimationFrame', (cb) => { cb(); return 1; });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    
    render(<TiltCard data-testid="tilt-card">Hover me</TiltCard>);
    const card = screen.getByTestId('tilt-card');
    
    // Mock getBoundingClientRect
    card.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
    }));
    
    fireEvent.mouseMove(card, { clientX: 150, clientY: 150 });
    // Since we mocked requestAnimationFrame to run immediately, the style should update
    expect(card).toHaveStyle('transform: perspective(1000px) rotateX(7.5deg) rotateY(-7.5deg) scale3d(1.02, 1.02, 1.02)');
    
    fireEvent.mouseLeave(card);
    expect(card).toHaveStyle('transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    
    vi.unstubAllGlobals();
  });
});
