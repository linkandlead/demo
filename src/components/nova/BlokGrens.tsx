"use client";

import { Component, type ReactNode } from "react";

// Vangt fouten in interactieve blokken (formulieren, configurator …) in de browser op: het blok
// verdwijnt, de rest van de pagina blijft werken. Fouten op de server vangt VeiligBlok op.
export class BlokGrens extends Component<{ naam: string; children: ReactNode }, { fout: boolean }> {
  state = { fout: false };
  static getDerivedStateFromError() {
    return { fout: true };
  }
  componentDidCatch(error: unknown) {
    console.error(`Blok "${this.props.naam}" kon niet worden getoond`, error);
  }
  render() {
    return this.state.fout ? null : this.props.children;
  }
}
