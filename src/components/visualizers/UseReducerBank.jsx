import React, { useReducer } from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, History, AlertOctagon } from 'lucide-react';

const initialAccountState = {
  balance: 500,
  loan: 0,
  isActive: true,
  history: [
    { id: 1, action: 'ACCOUNT_OPENED', amount: 500, time: 'Initial' }
  ]
};

function bankReducer(state, action) {
  if (!state.isActive && action.type !== 'OPEN_ACCOUNT') return state;

  switch (action.type) {
    case 'OPEN_ACCOUNT':
      return { ...initialAccountState, isActive: true };
    case 'DEPOSIT':
      return {
        ...state,
        balance: state.balance + action.payload,
        history: [
          { id: Date.now(), action: 'DEPOSIT', amount: action.payload, time: 'Just now' },
          ...state.history.slice(0, 5)
        ]
      };
    case 'WITHDRAW':
      if (state.balance < action.payload) return state; // Invariant check!
      return {
        ...state,
        balance: state.balance - action.payload,
        history: [
          { id: Date.now(), action: 'WITHDRAW', amount: action.payload, time: 'Just now' },
          ...state.history.slice(0, 5)
        ]
      };
    case 'REQUEST_LOAN':
      if (state.loan > 0) return state; // Only one loan allowed
      return {
        ...state,
        loan: 500,
        balance: state.balance + 500,
        history: [
          { id: Date.now(), action: 'LOAN_APPROVED', amount: 500, time: 'Just now' },
          ...state.history.slice(0, 5)
        ]
      };
    case 'PAY_LOAN':
      if (state.loan === 0 || state.balance < state.loan) return state;
      return {
        ...state,
        balance: state.balance - state.loan,
        loan: 0,
        history: [
          { id: Date.now(), action: 'LOAN_SETTLED', amount: 500, time: 'Just now' },
          ...state.history.slice(0, 5)
        ]
      };
    case 'CLOSE_ACCOUNT':
      if (state.balance !== 0 || state.loan !== 0) return state;
      return {
        ...state,
        isActive: false,
        history: [
          { id: Date.now(), action: 'ACCOUNT_CLOSED', amount: 0, time: 'Just now' },
          ...state.history.slice(0, 5)
        ]
      };
    default:
      return state;
  }
}

export default function UseReducerBank() {
  const [state, dispatch] = useReducer(bankReducer, initialAccountState);

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Landmark className="text-emerald-400" size={20} />
          <h3 className="text-lg font-bold">useReducer State Machine Simulator</h3>
        </div>
        <span className={`badge-pill ${state.isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'}`}>
          {state.isActive ? 'Status: Active Account' : 'Status: Closed'}
        </span>
      </div>

      <p className="visualizer-desc">
        Experience predictable state transitions with action types and pure reducer rules. Try violating state machine invariants (e.g. withdraw more than balance or take duplicate loans).
      </p>

      {/* Account Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="metric-box bg-slate-900 p-4 border border-slate-800">
          <span className="metric-label">Checking Account Balance</span>
          <span className="metric-value font-mono text-emerald-400 text-3xl font-bold">
            ${state.balance.toLocaleString()}
          </span>
          <small className="text-gray-400 block mt-1">Available for immediate withdrawal</small>
        </div>

        <div className="metric-box bg-slate-900 p-4 border border-slate-800">
          <span className="metric-label">Active Loan Liability</span>
          <span className="metric-value font-mono text-amber-400 text-3xl font-bold">
            ${state.loan.toLocaleString()}
          </span>
          <small className="text-gray-400 block mt-1">Must be paid off before account closure</small>
        </div>
      </div>

      {/* Action Dispatcher Buttons */}
      <div className="controls-row flex-wrap">
        <button 
          onClick={() => dispatch({ type: 'DEPOSIT', payload: 100 })}
          disabled={!state.isActive}
          className="btn-control btn-success"
          id="btn-deposit-100"
        >
          <ArrowDownLeft size={15} /> Deposit $100
        </button>
        <button 
          onClick={() => dispatch({ type: 'WITHDRAW', payload: 100 })}
          disabled={!state.isActive || state.balance < 100}
          className="btn-control btn-warning"
          id="btn-withdraw-100"
        >
          <ArrowUpRight size={15} /> Withdraw $100
        </button>
        <button 
          onClick={() => dispatch({ type: 'REQUEST_LOAN' })}
          disabled={!state.isActive || state.loan > 0}
          className="btn-control"
          id="btn-req-loan"
        >
          Request $500 Loan
        </button>
        <button 
          onClick={() => dispatch({ type: 'PAY_LOAN' })}
          disabled={!state.isActive || state.loan === 0 || state.balance < state.loan}
          className="btn-control"
          id="btn-pay-loan"
        >
          Repay $500 Loan
        </button>
        {state.isActive ? (
          <button 
            onClick={() => dispatch({ type: 'CLOSE_ACCOUNT' })}
            disabled={state.balance !== 0 || state.loan !== 0}
            className="btn-control btn-danger"
            id="btn-close-acc"
          >
            Close Account ($0 bal & loan needed)
          </button>
        ) : (
          <button 
            onClick={() => dispatch({ type: 'OPEN_ACCOUNT' })}
            className="btn-control btn-primary"
            id="btn-open-acc"
          >
            Re-open Account
          </button>
        )}
      </div>

      {/* Dispatched History Stream */}
      <div className="diff-log-section mt-4">
        <div className="diff-log-title flex items-center gap-2">
          <History size={14} className="text-cyan" />
          <span>Dispatched Actions Stream</span>
        </div>
        <div className="diff-log-list">
          {state.history.map(item => (
            <div key={item.id} className="diff-log-item">
              <span className="log-time font-mono text-cyan">dispatch(&#123; type: '{item.action}' &#125;)</span>
              <span className="log-text">{item.amount > 0 ? `Amount: $${item.amount}` : 'Event completed'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
