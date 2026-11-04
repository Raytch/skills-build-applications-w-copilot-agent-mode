import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Entry = { teamName: string; totalPoints: number; rank: number };
type LeaderboardState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; entries: Entry[] };

export default function Leaderboard() {
  const [state, setState] = useState<LeaderboardState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getJson<{ leaderboard: Entry[] }>('/api/leaderboard')
      .then(({ leaderboard }) => {
        if (active) setState({ status: 'success', entries: leaderboard });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Leaderboard</h2>
        <p>Compare team point totals.</p>
        {state.status === 'loading' && <p role="status">Loading leaderboard...</p>}
        {state.status === 'error' && <p role="alert">Unable to load leaderboard.</p>}
        {state.status === 'success' && state.entries.length === 0 && (
          <p role="status">No leaderboard entries yet.</p>
        )}
        {state.status === 'success' && state.entries.length > 0 && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Team</th>
                  <th scope="col">Points</th>
                </tr>
              </thead>
              <tbody>
                {state.entries.map((entry) => (
                  <tr key={entry.teamName}>
                    <td>{entry.rank}</td>
                    <td>{entry.teamName}</td>
                    <td>{entry.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
