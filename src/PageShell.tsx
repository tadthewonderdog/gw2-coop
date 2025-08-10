import React from "react";

export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div id="react-root">{children}</div>
);
