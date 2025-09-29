import { A, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <div class="app-shell">
          <header class="app-header">
            <div class="branding">
              <span class="logo">NBA Legends Lab</span>
              <p class="tagline">Data-rich storytelling for basketball&apos;s biggest nights.</p>
            </div>
            <nav class="main-nav">
              <A href="/" end activeClass="active">
                Curry Showcase
              </A>
              <A href="/about" activeClass="active">
                About
              </A>
            </nav>
          </header>
          <main class="app-main">
            <Suspense>{props.children}</Suspense>
          </main>
          <footer class="app-footer">
            <p>
              Crafted for hoops obsessives. Data sourced from Basketball-Reference box scores.
            </p>
          </footer>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
