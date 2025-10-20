import React from 'react';
import { Link } from 'react-router-dom';

const breadcrumbMap = {
  "/": ["Dashboard"],
  "/demand-review": ["Dashboard", "Demand Review"],
  "/apply-constraints": ["Dashboard", "Demand Review", "Apply Constraints"],
  "/commercial-inputs": ["Dashboard", "Demand Review", "Commercial Inputs"],
  "/supply-planning": ["Dashboard", "Supply Planning"],
  "/master-configurator": ["Dashboard", "Master Configurator"],
  "/model-performance": ["Dashboard", "Model Performance"],
  "/create-scenario": ["Dashboard", "Create Scenario"],
  "/simulate-scenarios": ["Dashboard", "Supply Planning", "Simulate Scenarios"],
  "/simulation-results": ["Dashboard", "Supply Planning", "Simulate Scenarios", "Simulation Results"],
  "/publish-plan": ["Dashboard", "Supply Planning", "Publish Plan"],
  "/plan-published": ["Dashboard", "Supply Planning", "Publish Plan", "Plan Published"],
};

const Breadcrumbs = () => {
  const breadcrumbs = breadcrumbMap[window.location.pathname] || ["Dashboard"];

  return (
    <nav className="breadcrumb" style={{ marginBottom: '0px' }}>
      <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center', padding: 0 }}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const to = index === 0 ? "/" : `/${crumb.toLowerCase().replace(' ', '-')}`;
          return (
            <React.Fragment key={crumb}>
              {index > 0 && <li style={{ margin: '0 8px' }}>/</li>}
              <li>
                <Link
                  to={to}
                  style={{
                    color: isLast ? '#000' : '#C8102E',
                    textDecoration: 'none',
                    fontWeight: isLast ? 'bold' : 'normal',
                    cursor: isLast ? 'default' : 'pointer',
                  }}
                >
                  {crumb}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
