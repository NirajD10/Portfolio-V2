"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; onError: (error: unknown) => void; fallback?: ReactNode };

/**
 * Catches WebGL failures (no context, driver errors) so a broken canvas never takes the page down.
 * The parent switches to its non-WebGL fallback in onError.
 */
export class WebGLBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
