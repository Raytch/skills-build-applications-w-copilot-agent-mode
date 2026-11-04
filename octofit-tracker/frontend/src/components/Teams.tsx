import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Team = {
  _id?: string;
  name: string;
  mascot?: string;
  members?: Array<string | { _id?: string; name?: string }>;
};
type TeamState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; teams: Team[] };

export default function Teams() {
  const [state, setState] = useState<TeamState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getJson<{ teams: Team[] }>('/api/teams')
      .then(({ teams }) => {
        if (active) setState({ status: 'success', teams });
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
        <h2 className="h4">Teams</h2>
        <p>Manage teams and members.</p>
        {state.status === 'loading' && <p role="status">Loading teams...</p>}
        {state.status === 'error' && <p role="alert">Unable to load teams.</p>}
        {state.status === 'success' && state.teams.length === 0 && (
          <p role="status">No teams yet.</p>
        )}
        {state.status === 'success' && state.teams.length > 0 && (
          <ul className="list-group list-group-flush">
            {state.teams.map((team) => (
              <li className="list-group-item px-0" key={team._id ?? team.name}>
                <strong>{team.name}</strong>
                {team.mascot && <span className="ms-2">{team.mascot}</span>}
                {team.members && team.members.length > 0 && (
                  <ul className="list-unstyled mb-0 ms-3">
                    {team.members.map((member, index) => (
                      <li key={typeof member === 'string'
                        ? `${team._id ?? team.name}-member-${index}`
                        : member._id ?? `${team._id ?? team.name}-member-${index}`}>
                        {typeof member === 'string' ? member : member.name ?? 'Member'}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
