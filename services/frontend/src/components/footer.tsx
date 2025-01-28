import { JSX } from "react";

const styles = {
  footer: {
    backgroundColor: "var(--muted)",
    padding: "1rem 0",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },
  text: {
    textAlign: "center" as const,
    fontSize: "0.875rem",
    color: "var(--muted-foreground)",
  },
};

export function Footer(): JSX.Element {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>© 2023 ServiceHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
