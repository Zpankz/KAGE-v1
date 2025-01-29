import api from './api';

interface CentralitySettings {
  enabled: boolean;
  threshold: number;
  iterations?: number;
}

interface CommunitySettings {
  enabled: boolean;
  resolution?: number;
  minSize?: number;
}

interface ReasoningSettings {
  technique: string;
  parameters: Record<string, any>;
}

export interface AnalyticsSettings {
  centrality: {
    degree: CentralitySettings;
    closeness: CentralitySettings;
    betweenness: CentralitySettings;
    pageRank: CentralitySettings;
    eigenvector: CentralitySettings;
    katz: CentralitySettings;
  };
  community: {
    louvain: CommunitySettings;
    labelPropagation: CommunitySettings;
    infomap: CommunitySettings;
    walktrap: CommunitySettings;
    fastGreedy: CommunitySettings;
  };
  reasoning: {
    selectedTechnique: string;
    parameters: Record<string, any>;
  };
}

// Description: Get graph analytics data
// Endpoint: GET /api/graph/analytics
// Request: {}
// Response: {
//   centrality: Array<{
//     id: string;
//     label: string;
//     metrics: Record<string, number>;
//   }>;
//   communities: Array<{
//     algorithm: string;
//     communities: Array<{
//       nodes: Array<{ id: string; label: string }>;
//       metrics: {
//         density: number;
//         cohesion: number;
//         conductance: number;
//       };
//     }>;
//   }>;
// }
export const getGraphAnalytics = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        centrality: [
          {
            id: '1',
            label: 'Machine Learning',
            metrics: {
              degree: 5,
              closeness: 0.75,
              betweenness: 0.85,
              pageRank: 0.92,
              eigenvector: 0.88,
              katz: 0.82
            }
          },
          {
            id: '2',
            label: 'Neural Networks',
            metrics: {
              degree: 3,
              closeness: 0.65,
              betweenness: 0.45,
              pageRank: 0.78,
              eigenvector: 0.72,
              katz: 0.68
            }
          }
        ],
        communities: [
          {
            algorithm: 'louvain',
            communities: [
              {
                nodes: [
                  { id: '1', label: 'Machine Learning' },
                  { id: '2', label: 'Neural Networks' }
                ],
                metrics: {
                  density: 0.85,
                  cohesion: 0.92,
                  conductance: 0.78
                }
              }
            ]
          }
        ]
      });
    }, 800);
  });
};

// Description: Get graph analytics settings
// Endpoint: GET /api/graph/analytics/settings
// Request: {}
// Response: { settings: AnalyticsSettings }
export const getAnalyticsSettings = () => {
  return new Promise<{ settings: AnalyticsSettings }>((resolve) => {
    setTimeout(() => {
      resolve({
        settings: {
          centrality: {
            degree: { enabled: true, threshold: 0.5 },
            closeness: { enabled: true, threshold: 0.5 },
            betweenness: { enabled: true, threshold: 0.5, iterations: 1000 },
            pageRank: { enabled: true, threshold: 0.5, iterations: 100 },
            eigenvector: { enabled: true, threshold: 0.5, iterations: 100 },
            katz: { enabled: true, threshold: 0.5, iterations: 100 }
          },
          community: {
            louvain: { enabled: true, resolution: 1.0 },
            labelPropagation: { enabled: true },
            infomap: { enabled: true },
            walktrap: { enabled: true },
            fastGreedy: { enabled: true, minSize: 3 }
          },
          reasoning: {
            selectedTechnique: 'mcts',
            parameters: {
              numSimulations: 1000,
              explorationConstant: 1.4,
              maxDepth: 10
            }
          }
        }
      });
    }, 500);
  });
};

// Description: Save graph analytics settings
// Endpoint: POST /api/graph/analytics/settings
// Request: { settings: AnalyticsSettings }
// Response: { success: boolean }
export const saveAnalyticsSettings = (settings: AnalyticsSettings) => {
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const reasoningTechniques = [
  {
    id: 'mcts',
    name: 'Monte Carlo Tree Search',
    description: 'Uses random sampling to evaluate decision paths',
    parameters: [
      {
        id: 'numSimulations',
        name: 'Number of Simulations',
        type: 'number',
        default: 1000,
        min: 100,
        max: 10000,
        step: 100
      },
      {
        id: 'explorationConstant',
        name: 'Exploration Constant',
        type: 'number',
        default: 1.4,
        min: 0.1,
        max: 5.0,
        step: 0.1
      },
      {
        id: 'maxDepth',
        name: 'Maximum Depth',
        type: 'number',
        default: 10,
        min: 1,
        max: 50,
        step: 1
      }
    ]
  },
  {
    id: 'treeOfThoughts',
    name: 'Tree of Thoughts',
    description: 'Systematic exploration of reasoning paths',
    parameters: [
      {
        id: 'numThoughts',
        name: 'Number of Thoughts',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1
      },
      {
        id: 'maxDepth',
        name: 'Maximum Depth',
        type: 'number',
        default: 3,
        min: 1,
        max: 10,
        step: 1
      },
      {
        id: 'temperature',
        name: 'Temperature',
        type: 'number',
        default: 0.7,
        min: 0.1,
        max: 2.0,
        step: 0.1
      }
    ]
  },
  {
    id: 'randomWalk',
    name: 'Random Walk',
    description: 'Stochastic exploration of the solution space',
    parameters: [
      {
        id: 'numSteps',
        name: 'Number of Steps',
        type: 'number',
        default: 1000,
        min: 100,
        max: 10000,
        step: 100
      },
      {
        id: 'restartProbability',
        name: 'Restart Probability',
        type: 'number',
        default: 0.1,
        min: 0.01,
        max: 1.0,
        step: 0.01
      }
    ]
  },
  {
    id: 'beamSearch',
    name: 'Beam Search',
    description: 'Breadth-first search with limited branching',
    parameters: [
      {
        id: 'beamWidth',
        name: 'Beam Width',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1
      },
      {
        id: 'maxDepth',
        name: 'Maximum Depth',
        type: 'number',
        default: 10,
        min: 1,
        max: 50,
        step: 1
      }
    ]
  },
  {
    id: 'simulatedAnnealing',
    name: 'Simulated Annealing',
    description: 'Temperature-based optimization strategy',
    parameters: [
      {
        id: 'initialTemperature',
        name: 'Initial Temperature',
        type: 'number',
        default: 1.0,
        min: 0.1,
        max: 10.0,
        step: 0.1
      },
      {
        id: 'coolingRate',
        name: 'Cooling Rate',
        type: 'number',
        default: 0.95,
        min: 0.5,
        max: 0.99,
        step: 0.01
      },
      {
        id: 'numIterations',
        name: 'Number of Iterations',
        type: 'number',
        default: 1000,
        min: 100,
        max: 10000,
        step: 100
      }
    ]
  }
];