import { useState, useEffect } from 'react';
import Editor from "react-simple-code-editor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import axios from "axios";
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCode(`function sum() {
  return 1 + 1;
}`);
    setReview('');
  }, []);

  const reviewCode = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      console.error('Error fetching review:', err.message);
      setError('🚨 Could not connect to the review server. Please make sure your backend is running.');
      setReview('');
    } finally {
      setLoading(false);
    }
  };

  const highlightCode = code => (
    <SyntaxHighlighter
      language="javascript"
      style={vscDarkPlus}
      showLineNumbers
      customStyle={{
        background: 'transparent',
        padding: 0,
        margin: 0,
      }}
      PreTag="div"
    >
      {code}
    </SyntaxHighlighter>
  );

  return (
    <main className="main">
      <section className="left">
        <div className="editor-container">
          <div className="editor-header">📝 Code Editor</div>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlightCode}
            padding={20}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              backgroundColor: "#1e1e1e",
              borderRadius: "12px",
              color: "#f8f8f2",
              minHeight: "350px",
              caretColor: "#ffffff",
              overflow: "auto",
              outline: "none",
              whiteSpace: "pre-wrap",
            }}
          />
        </div>

        <button
          className="review-button"
          onClick={reviewCode}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              &nbsp;Analyzing your code, please wait...
            </>
          ) : (
            '🛠️ Submit Code for AI Review'
          )}
        </button>

        {error && (
          <div className="error-message">
            🚨 Oops! Something went wrong while fetching the review.<br />
            Please check your server connection and try again.
          </div>
        )}
      </section>

      <section className="right">
        <div className="output-wrapper">
          <div className="output-header">🧠 Review Output</div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={vscDarkPlus}
                    PreTag="div"
                    showLineNumbers
                    customStyle={{
                      borderRadius: "0 0 12px 12px",
                      padding: "1rem",
                      fontSize: "1rem",
                      background: "#1e1e1e",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {review || (loading
              ? '⌛ Our AI is carefully analyzing your code...'
              : '📝 Write or paste your code on the left, then click "Submit" to get an instant AI-powered review!')}
          </ReactMarkdown>
        </div>
      </section>
    </main>
  );
}

export default App;
