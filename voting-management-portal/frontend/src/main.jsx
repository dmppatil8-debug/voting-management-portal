import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./style.css";

const API = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function getRole(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.token);
  const [role, setRole] = useState(getRole(localStorage.token));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [register, setRegister] = useState(false);

  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState(null);

  const [cands, setCands] = useState([]);
  const [results, setResults] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const [showCreateElection, setShowCreateElection] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    status: "DRAFT",
    startTime: "",
    endTime: "",
  });

  const [newCandidate, setNewCandidate] = useState({
    electionId: "",
    name: "",
    manifesto: "",
  });

  const load = async () => {
    try {
      const response = await api.get("/elections");
      setElections(response.data);
    } catch (error) {
      setMsg("Failed to load elections.");
      setMsgType("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selected || role === "ADMIN") return;

    const loadElectionData = async () => {
      try {
        const candidatesResponse = await api.get(
          `/candidates/election/${selected.id}`
        );

        setCands(candidatesResponse.data);

        const resultsResponse = await api.get(
          `/results/${selected.id}`
        );

        setResults(resultsResponse.data);

        const statusResponse = await api.get(
          `/votes/status/${selected.id}`
        );

        setHasVoted(statusResponse.data.hasVoted);
      } catch (error) {
        setMsg("Failed to load election data.");
        setMsgType("error");
      }
    };

    loadElectionData();
  }, [selected, role]);

  async function submit(e) {
    e.preventDefault();

    setMsg("");
    setMsgType("");

    try {
      const url = register ? "/auth/register" : "/auth/login";

      const body = register
        ? { name, email, password }
        : { email, password };

      const response = await api.post(url, body);

      localStorage.token = response.data.token;

      const newRole = getRole(response.data.token);

      setToken(response.data.token);
      setRole(newRole);

      setMsg(
        register
          ? "Registration successful."
          : "Login successful."
      );
      setMsgType("success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      setMsg(errorMessage);
      setMsgType("error");
    }
  }

  async function createElection(e) {
    e.preventDefault();

    try {
      await api.post("/elections", newElection);

      setMsg("Election created successfully.");
      setMsgType("success");

      setNewElection({
        title: "",
        description: "",
        status: "DRAFT",
        startTime: "",
        endTime: "",
      });

      setShowCreateElection(false);

      await load();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      setMsg(errorMessage);
      setMsgType("error");
    }
  }

  async function deleteElection(id) {
    try {
      await api.delete(`/elections/${id}`);

      setMsg("Election deleted successfully.");
      setMsgType("success");

      await load();
    } catch (error) {
      setMsg(
        error.response?.data?.error ||
        "Cannot delete this election. It may contain votes."
      );
      setMsgType("error");
    }
  }

  async function loadCandidates(electionId) {
    try {
      const response = await api.get(
        `/candidates/election/${electionId}`
      );

      setCands(response.data);
    } catch (error) {
      setMsg("Failed to load candidates.");
      setMsgType("error");
    }
  }

  async function addCandidate(e) {
    e.preventDefault();

    try {
      await api.post("/candidates", {
        name: newCandidate.name,
        manifesto: newCandidate.manifesto,
        election: {
          id: Number(newCandidate.electionId),
        },
      });

      setMsg("Candidate added successfully.");
      setMsgType("success");

      setNewCandidate({
        electionId: newCandidate.electionId,
        name: "",
        manifesto: "",
      });

      await loadCandidates(newCandidate.electionId);
    } catch (error) {
      setMsg(
        error.response?.data?.error ||
        "Failed to add candidate."
      );
      setMsgType("error");
    }
  }

  async function deleteCandidate(id) {
    try {
      await api.delete(`/candidates/${id}`);

      setMsg("Candidate deleted successfully.");
      setMsgType("success");

      await loadCandidates(newCandidate.electionId);
    } catch (error) {
      setMsg(
        "Cannot delete this candidate. It may already have votes."
      );
      setMsgType("error");
    }
  }

  async function loadResults(electionId) {
    try {
      const response = await api.get(
        `/results/${electionId}`
      );

      setResults(response.data);
    } catch (error) {
      setMsg("Failed to load results.");
      setMsgType("error");
    }
  }

  async function vote(candidateId) {
    try {
      await api.post("/votes", {
        electionId: selected.id,
        candidateId: candidateId,
      });

      setHasVoted(true);

      setMsg("Vote recorded successfully.");
      setMsgType("success");

      const resultsResponse = await api.get(
        `/results/${selected.id}`
      );

      setResults(resultsResponse.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      setMsg(errorMessage);
      setMsgType("error");

      if (error.response?.status === 409) {
        setHasVoted(true);
      }
    }
  }

  function logout() {
    localStorage.clear();

    setToken(null);
    setRole(null);
    setSelected(null);
    setHasVoted(false);
    setMsg("");
    setMsgType("");
  }

  if (!token) {
    return (
      <main>
        <div className="card auth">
          <h1>🗳 Voting Portal</h1>

          <p>
            {register ? "Create voter account" : "Sign in"}
          </p>

          <form onSubmit={submit}>
            {register && (
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              {register ? "Register" : "Login"}
            </button>
          </form>

          <button
            className="link"
            onClick={() => {
              setRegister(!register);
              setMsg("");
            }}
          >
            {register
              ? "Already have an account? Login"
              : "New voter? Register"}
          </button>

          {msg && (
            <p className={msgType}>{msg}</p>
          )}
        </div>
      </main>
    );
  }

  if (role === "ADMIN") {
    return (
      <main>
        <header>
          <h1>🗳 Admin Dashboard</h1>

          <button onClick={logout}>
            Logout
          </button>
        </header>

        {msg && (
          <div className={`message ${msgType}`}>
            {msg}
          </div>
        )}

        {showCreateElection && (
          <section className="card">
            <h2>Create College Election</h2>

            <form onSubmit={createElection}>
              <input
                placeholder="Election title"
                value={newElection.title}
                onChange={(e) =>
                  setNewElection({
                    ...newElection,
                    title: e.target.value,
                  })
                }
                required
              />

              <input
                placeholder="Election description"
                value={newElection.description}
                onChange={(e) =>
                  setNewElection({
                    ...newElection,
                    description: e.target.value,
                  })
                }
              />

              <label>Status</label>

              <select
                value={newElection.status}
                onChange={(e) =>
                  setNewElection({
                    ...newElection,
                    status: e.target.value,
                  })
                }
              >
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="CLOSED">CLOSED</option>
              </select>

              <label>Start Time</label>

              <input
                type="datetime-local"
                value={newElection.startTime}
                onChange={(e) =>
                  setNewElection({
                    ...newElection,
                    startTime: e.target.value,
                  })
                }
              />

              <label>End Time</label>

              <input
                type="datetime-local"
                value={newElection.endTime}
                onChange={(e) =>
                  setNewElection({
                    ...newElection,
                    endTime: e.target.value,
                  })
                }
              />

              <button type="submit">
                Create Election
              </button>

              <button
                type="button"
                className="link"
                onClick={() =>
                  setShowCreateElection(false)
                }
              >
                Cancel
              </button>
            </form>
          </section>
        )}

        {!showCreateElection &&
          !showCandidates &&
          !showResults && (
            <>
              <section className="grid">
                <article className="card">
                  <h2>Manage Elections</h2>

                  <p>
                    Create and manage college elections.
                  </p>

                  <button
                    onClick={() => {
                      setShowCreateElection(true);
                      setMsg("");
                    }}
                  >
                    Create Election
                  </button>
                </article>

                <article className="card">
                  <h2>Manage Candidates</h2>

                  <p>
                    Add or remove election candidates.
                  </p>

                  <button
                    onClick={() => {
                      setShowCandidates(true);
                      setMsg("");
                    }}
                  >
                    Manage Candidates
                  </button>
                </article>

                <article className="card">
                  <h2>Election Results</h2>

                  <p>
                    View voting results for elections.
                  </p>

                  <button
                    onClick={() => {
                      setShowResults(true);
                      setMsg("");
                    }}
                  >
                    View Results
                  </button>
                </article>
              </section>

              <section className="card">
                <h2>Existing Elections</h2>

                {elections.length === 0 ? (
                  <p>No elections found.</p>
                ) : (
                  elections.map((election) => (
                    <div
                      className="candidate"
                      key={election.id}
                    >
                      <div>
                        <b>{election.title}</b>

                        <p>{election.description}</p>

                        <span
                          className={`status ${election.status}`}
                        >
                          {election.status}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete "${election.title}"?`
                            )
                          ) {
                            deleteElection(election.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </section>
            </>
          )}

        {showCandidates && (
          <section className="card">
            <button
              onClick={() => {
                setShowCandidates(false);
                setCands([]);
                setMsg("");
              }}
            >
              ← Back
            </button>

            <h2>Manage Candidates</h2>

            <select
              value={newCandidate.electionId}
              onChange={(e) => {
                const id = e.target.value;

                setNewCandidate({
                  ...newCandidate,
                  electionId: id,
                });

                if (id) {
                  loadCandidates(id);
                }
              }}
            >
              <option value="">
                Select Election
              </option>

              {elections.map((election) => (
                <option
                  key={election.id}
                  value={election.id}
                >
                  {election.title}
                </option>
              ))}
            </select>

            {newCandidate.electionId && (
              <>
                <h3>Add Candidate</h3>

                <form onSubmit={addCandidate}>
                  <input
                    placeholder="Candidate name"
                    value={newCandidate.name}
                    onChange={(e) =>
                      setNewCandidate({
                        ...newCandidate,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    placeholder="Candidate manifesto"
                    value={newCandidate.manifesto}
                    onChange={(e) =>
                      setNewCandidate({
                        ...newCandidate,
                        manifesto: e.target.value,
                      })
                    }
                  />

                  <button type="submit">
                    Add Candidate
                  </button>
                </form>

                <h3>Existing Candidates</h3>

                {cands.length === 0 ? (
                  <p>No candidates yet.</p>
                ) : (
                  cands.map((candidate) => (
                    <div
                      className="candidate"
                      key={candidate.id}
                    >
                      <div>
                        <b>{candidate.name}</b>
                        <p>{candidate.manifesto}</p>
                      </div>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete "${candidate.name}"?`
                            )
                          ) {
                            deleteCandidate(candidate.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </>
            )}
          </section>
        )}

        {showResults && (
          <section className="card">
            <button
              onClick={() => {
                setShowResults(false);
                setResults([]);
                setMsg("");
              }}
            >
              ← Back
            </button>

            <h2>Election Results</h2>

            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  loadResults(e.target.value);
                }
              }}
            >
              <option value="">
                Select Election
              </option>

              {elections.map((election) => (
                <option
                  key={election.id}
                  value={election.id}
                >
                  {election.title}
                </option>
              ))}
            </select>

            {results.length > 0 && (
              <>
                <h3>Results</h3>

                {results.map((result) => (
                  <div
                    className="candidate"
                    key={result.candidateId}
                  >
                    <b>{result.name}</b>

                    <span>
                      {result.votes} vote
                      {result.votes !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </>
            )}
          </section>
        )}
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>🗳 Voting Management Portal</h1>

        <button onClick={logout}>
          Logout
        </button>
      </header>

      {msg && (
        <div className={`message ${msgType}`}>
          {msg}
        </div>
      )}

      {!selected && (
        <section className="grid">
          {elections.map((election) => (
            <article
              className="card"
              key={election.id}
            >
              <h2>{election.title}</h2>

              <p>{election.description}</p>

              <span
                className={`status ${election.status}`}
              >
                {election.status}
              </span>

              <button
                onClick={() => {
                  setSelected(election);
                  setHasVoted(false);
                  setMsg("");
                }}
              >
                View / Vote
              </button>
            </article>
          ))}
        </section>
      )}

      {selected && (
        <section className="card">
          <button
            onClick={() => {
              setSelected(null);
              setHasVoted(false);
              setMsg("");
            }}
          >
            ← Back
          </button>

          <h2>{selected.title}</h2>

          <h3>Candidates</h3>

          {hasVoted && (
            <p className="success">
              You have already voted in this election.
            </p>
          )}

          {cands.map((candidate) => (
            <div
              className="candidate"
              key={candidate.id}
            >
              <div>
                <b>{candidate.name}</b>

                <p>{candidate.manifesto}</p>
              </div>

              {selected.status === "ACTIVE" &&
                !hasVoted && (
                  <button
                    onClick={() =>
                      vote(candidate.id)
                    }
                  >
                    Vote
                  </button>
                )}
            </div>
          ))}

          <h3>Results</h3>

          {results.map((result) => (
            <p key={result.candidateId}>
              {result.name}:{" "}
              <b>{result.votes}</b>
            </p>
          ))}
        </section>
      )}
    </main>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);