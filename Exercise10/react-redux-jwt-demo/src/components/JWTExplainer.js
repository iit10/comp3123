// JWTExplainer Component
// Educational component explaining JWT concepts

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectToken, selectUser } from '../store/authSlice';
import { decodeToken, getTokenExpiration } from '../utils/jwt';
import './JWTExplainer.css';

const JWTExplainer = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const decodedToken = token ? decodeToken(token) : null;
  const tokenExpiration = token ? getTokenExpiration(token) : null;

  // Split JWT token into parts for display
  const tokenParts = token ? token.split('.') : [];
  const header = tokenParts[0] || '';
  const payload = tokenParts[1] || '';
  const signature = tokenParts[2] || '';

  const sections = {
    overview: {
      title: 'JWT Overview',
      content: (
        <div className="jwt-section">
          <h4>What is JWT (JSON Web Token)?</h4>
          <p>
            JWT is a compact, URL-safe means of representing claims to be transferred between two parties. 
            The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure.
          </p>
          
          <div className="jwt-benefits">
            <h5>Benefits of JWT:</h5>
            <ul>
              <li><strong>Stateless:</strong> No need to store session data on the server</li>
              <li><strong>Self-contained:</strong> All necessary information is in the token</li>
              <li><strong>Compact:</strong> Can be sent through URL, POST parameter, or HTTP header</li>
              <li><strong>Secure:</strong> Digitally signed using a secret or public/private key pair</li>
              <li><strong>Cross-domain:</strong> Works across different domains and services</li>
            </ul>
          </div>

          <div className="jwt-use-cases">
            <h5>Common Use Cases:</h5>
            <ul>
              <li>Authentication and Authorization</li>
              <li>Information Exchange between services</li>
              <li>Single Sign-On (SSO)</li>
              <li>API Authentication</li>
            </ul>
          </div>
        </div>
      )
    },
    structure: {
      title: 'JWT Structure',
      content: (
        <div className="jwt-section">
          <h4>JWT Token Structure</h4>
          <p>A JWT token consists of three parts separated by dots (.):</p>
          
          <div className="jwt-parts">
            <div className="jwt-part header-part">
              <h5>1. Header</h5>
              <p>Contains metadata about the token (algorithm, type)</p>
              <div className="part-example">
                <strong>Format:</strong> Base64Url encoded JSON
                <pre><code>{`{
  "alg": "HS256",
  "typ": "JWT"
}`}</code></pre>
              </div>
            </div>

            <div className="jwt-part payload-part">
              <h5>2. Payload</h5>
              <p>Contains the claims (statements about user and additional data)</p>
              <div className="part-example">
                <strong>Format:</strong> Base64Url encoded JSON
                <pre><code>{`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}`}</code></pre>
              </div>
            </div>

            <div className="jwt-part signature-part">
              <h5>3. Signature</h5>
              <p>Used to verify the sender and ensure message integrity</p>
              <div className="part-example">
                <strong>Format:</strong> Encoded signature
                <pre><code>{`HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)`}</code></pre>
              </div>
            </div>
          </div>

          <div className="jwt-visual">
            <h5>Complete JWT Token:</h5>
            <div className="token-visual">
              <span className="token-header">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
              <span className="token-dot">.</span>
              <span className="token-payload">eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ</span>
              <span className="token-dot">.</span>
              <span className="token-signature">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
            </div>
          </div>
        </div>
      )
    },
    claims: {
      title: 'JWT Claims',
      content: (
        <div className="jwt-section">
          <h4>JWT Claims Explained</h4>
          <p>Claims are statements about an entity (typically, the user) and additional data.</p>
          
          <div className="claims-types">
            <div className="claim-type">
              <h5>Registered Claims (Standard)</h5>
              <ul>
                <li><strong>iss (Issuer):</strong> Who issued the token</li>
                <li><strong>sub (Subject):</strong> Who the token is about</li>
                <li><strong>aud (Audience):</strong> Who the token is intended for</li>
                <li><strong>exp (Expiration):</strong> When the token expires</li>
                <li><strong>iat (Issued At):</strong> When the token was issued</li>
                <li><strong>nbf (Not Before):</strong> When the token becomes valid</li>
              </ul>
            </div>

            <div className="claim-type">
              <h5>Public Claims</h5>
              <p>Can be defined at will by those using JWTs. Should be collision-resistant.</p>
            </div>

            <div className="claim-type">
              <h5>Private Claims</h5>
              <p>Custom claims created to share information between parties that agree on using them.</p>
            </div>
          </div>

          {decodedToken && (
            <div className="current-token-claims">
              <h5>Your Current Token Claims:</h5>
              <pre><code>{JSON.stringify(decodedToken, null, 2)}</code></pre>
            </div>
          )}
        </div>
      )
    },
    security: {
      title: 'JWT Security',
      content: (
        <div className="jwt-section">
          <h4>JWT Security Considerations</h4>
          
          <div className="security-aspects">
            <div className="security-aspect">
              <h5>🔐 Token Signing</h5>
              <ul>
                <li>Tokens are signed to prevent tampering</li>
                <li>Signature verifies token authenticity</li>
                <li>Common algorithms: HS256, RS256, ES256</li>
              </ul>
            </div>

            <div className="security-aspect">
              <h5>⏰ Token Expiration</h5>
              <ul>
                <li>Always set expiration time (exp claim)</li>
                <li>Use short-lived tokens for sensitive operations</li>
                <li>Implement token refresh mechanism</li>
              </ul>
              {tokenExpiration && (
                <div className="token-exp-info">
                  <strong>Your token expires:</strong> {tokenExpiration.toLocaleString()}
                </div>
              )}
            </div>

            <div className="security-aspect">
              <h5>🔒 Secure Storage</h5>
              <ul>
                <li>Store tokens securely (httpOnly cookies preferred)</li>
                <li>Avoid localStorage for sensitive tokens</li>
                <li>Use HTTPS for token transmission</li>
              </ul>
            </div>

            <div className="security-aspect">
              <h5>⚠️ Common Vulnerabilities</h5>
              <ul>
                <li>None algorithm attack (alg: "none")</li>
                <li>Secret key brute forcing</li>
                <li>Token replay attacks</li>
                <li>Cross-Site Scripting (XSS) token theft</li>
              </ul>
            </div>
          </div>

          <div className="best-practices">
            <h5>Security Best Practices:</h5>
            <ol>
              <li>Use strong secrets and rotate them regularly</li>
              <li>Validate all JWT claims (especially exp, iss, aud)</li>
              <li>Use HTTPS for all communications</li>
              <li>Implement proper logout/token invalidation</li>
              <li>Monitor for suspicious token usage patterns</li>
            </ol>
          </div>
        </div>
      )
    },
    implementation: {
      title: 'Implementation in Our App',
      content: (
        <div className="jwt-section">
          <h4>JWT Implementation in This App</h4>
          
          <div className="implementation-flow">
            <div className="impl-step">
              <h5>1. User Login</h5>
              <p>User provides credentials (username/password)</p>
              <pre><code>{`const result = await mockAuthenticate(username, password);`}</code></pre>
            </div>

            <div className="impl-step">
              <h5>2. Token Creation</h5>
              <p>Server creates JWT with user information</p>
              <pre><code>{`const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '1h',
  issuer: 'react-redux-demo'
});`}</code></pre>
            </div>

            <div className="impl-step">
              <h5>3. Token Storage</h5>
              <p>Token is stored in Redux store and localStorage</p>
              <pre><code>{`dispatch(loginSuccess({
  user: result.user,
  token: result.token
}));
localStorage.setItem('token', result.token);`}</code></pre>
            </div>

            <div className="impl-step">
              <h5>4. Token Usage</h5>
              <p>Token is sent with API requests for authentication</p>
              <pre><code>{`headers: {
  'Authorization': \`Bearer \${token}\`,
  'Content-Type': 'application/json'
}`}</code></pre>
            </div>
          </div>

          {token && (
            <div className="current-token-details">
              <h5>Your Current Token Details:</h5>
              <div className="token-parts-display">
                <div className="token-part-display">
                  <strong>Header:</strong>
                  <div className="token-segment header">{header}</div>
                </div>
                <div className="token-part-display">
                  <strong>Payload:</strong>
                  <div className="token-segment payload">{payload}</div>
                </div>
                <div className="token-part-display">
                  <strong>Signature:</strong>
                  <div className="token-segment signature">{signature}</div>
                </div>
              </div>
              
              <div className="token-info-summary">
                <p><strong>User:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Issued:</strong> {decodedToken ? new Date(decodedToken.iat * 1000).toLocaleString() : 'N/A'}</p>
                <p><strong>Expires:</strong> {tokenExpiration?.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )
    }
  };

  return (
    <div className="jwt-explainer">
      <div className="explainer-container">
        <h2>JWT (JSON Web Token) Explained</h2>
        <p className="explainer-subtitle">
          Understanding JWT authentication and its implementation
        </p>

        <div className="section-tabs">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              className={`tab-button ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
            >
              {sections[key].title}
            </button>
          ))}
        </div>

        <div className="section-content">
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
};

export default JWTExplainer;