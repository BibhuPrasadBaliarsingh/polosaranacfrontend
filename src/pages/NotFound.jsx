import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn btn-primary">
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="not-found-btn btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
