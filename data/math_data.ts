import { Calculator } from 'lucide-react';
import { SubjectData, SubjectType } from '../types';

export const mathData: SubjectData = {
  id: 'math',
  name: SubjectType.MATH,
  icon: Calculator,
  color: 'amber',
  hex: '#f59e0b',
  description: 'Visualise trigonometry, algebra, statistics, and probability concepts with interactive 2D explorations for Karnataka PUC.',
  labs: [
    {
      id: 'm1',
      title: 'Unit Circle & Trigonometry',
      description: 'Explore the unit circle and understand sine, cosine, and tangent functions visually.',
      difficulty: 'Easy',
      duration: '20 min',
      category: 'Trigonometry',
      boards: ['Karnataka PUC'],
      standards: ['1st PUC / Class 11'],
      content: {
        aim: 'To visualise the unit circle and understand the relationship between angles and trigonometric ratios (sin, cos, tan).',
        requirements: ['Interactive unit circle simulator'],
        theory: 'The unit circle is a circle of radius 1 centred at the origin. For any angle θ measured counter-clockwise from the positive x-axis, the coordinates of the point on the circle are (cos θ, sin θ). Therefore, cos θ = x-coordinate, sin θ = y-coordinate, and tan θ = sin θ / cos θ = y/x. This visualisation helps understand why sin and cos oscillate between −1 and 1, and identifies the signs in all four quadrants (ASTC rule).',
        procedure: [
          'Drag the point around the unit circle.',
          'Observe the values of sin θ, cos θ, and tan θ.',
          'Note the signs in each quadrant.',
          'Identify special angles: 0°, 30°, 45°, 60°, 90°.',
          'Observe the graph of sin θ and cos θ generated alongside.',
        ],
        objectives: ['Understand unit circle', 'Relate angle to trig ratios', 'Identify quadrant signs'],
        observationTable: { columns: ['Angle (°)', 'sin θ', 'cos θ', 'tan θ', 'Quadrant'], rows: 8 },
      }
    },
    {
      id: 'm2',
      title: "Binomial Theorem — Pascal's Triangle",
      description: "Visualise binomial coefficients and Pascal's Triangle patterns.",
      difficulty: 'Medium',
      duration: '25 min',
      category: 'Algebra',
      boards: ['Karnataka PUC'],
      standards: ['1st PUC / Class 11'],
      content: {
        aim: "To visualise the Binomial Theorem expansion using Pascal's Triangle and explore the patterns within.",
        requirements: ['Interactive simulator'],
        theory: "The Binomial Theorem states that (a + b)ⁿ = Σᵢ₌₀ⁿ C(n,i) × aⁿ⁻ⁱ × bⁱ. The coefficients C(n,i) form Pascal's Triangle where each entry is the sum of the two entries above it. Properties: Row n has (n+1) entries. The sum of entries in row n is 2ⁿ. The triangle is symmetric. Fibonacci numbers appear in the diagonal sums.",
        procedure: [
          "Increase n to see Pascal's Triangle grow.",
          'Observe the symmetry pattern.',
          'Click on a coefficient to see its binomial expansion term.',
          'Verify that row sums equal 2ⁿ.',
          'Toggle highlighting to see even/odd patterns (Sierpinski triangle).',
        ],
        objectives: ['Generate binomial coefficients', 'Identify patterns', 'Relate to binomial expansion'],
        observationTable: { columns: ['n', 'Expansion of (a+b)ⁿ', 'Coefficients', 'Sum'], rows: 6 },
      }
    },
    {
      id: 'm3',
      title: 'Statistics — Mean, Median, Mode',
      description: 'Compute and visualise measures of central tendency for grouped and ungrouped data.',
      difficulty: 'Easy',
      duration: '20 min',
      category: 'Statistics',
      boards: ['Karnataka PUC'],
      standards: ['2nd PUC / Class 12'],
      content: {
        aim: 'To calculate and visualise the mean, median, and mode for a given data set, and understand their significance.',
        requirements: ['Interactive statistics simulator'],
        theory: 'Mean = Σxᵢ/n (arithmetic average). Median = middle value when data is arranged in order (for even n, average of two middle values). Mode = most frequently occurring value. For grouped data: Mean = Σfᵢxᵢ/Σfᵢ, Median uses cumulative frequency, Mode uses the modal class formula.',
        procedure: [
          'Enter or modify the data set.',
          'Observe the histogram/bar chart update in real-time.',
          'Calculate mean, median, and mode manually.',
          'Compare with the computed values from the simulator.',
          'Add outliers and observe the effect on each measure.',
        ],
        objectives: ['Calculate measures of central tendency', 'Understand effect of outliers', 'Visualise frequency distribution'],
        observationTable: { columns: ['Data set', 'Mean', 'Median', 'Mode', 'Range'], rows: 4 },
      }
    },
    {
      id: 'm4',
      title: 'Matrix Operations',
      description: 'Perform and visualise matrix addition, multiplication, determinant, and inverse.',
      difficulty: 'Medium',
      duration: '25 min',
      category: 'Linear Algebra',
      boards: ['Karnataka PUC'],
      standards: ['2nd PUC / Class 12'],
      content: {
        aim: 'To perform and visualise basic matrix operations including addition, multiplication, determinant, and inverse.',
        requirements: ['Interactive matrix calculator'],
        theory: 'A matrix is a rectangular array of numbers. Key operations: Addition/Subtraction (element-wise, same dimensions required), Scalar multiplication, Matrix multiplication (rows × columns, dimensions must be compatible: m×n · n×p = m×p), Determinant (for square matrices: ad−bc for 2×2), Inverse (A⁻¹ = adj(A)/|A|, exists only if |A| ≠ 0).',
        procedure: [
          'Enter elements for matrix A and matrix B.',
          'Perform A + B and observe the result.',
          'Perform A × B and verify dimensions.',
          'Calculate the determinant of a 2×2 and 3×3 matrix.',
          'Find the inverse and verify A × A⁻¹ = I.',
        ],
        objectives: ['Perform matrix arithmetic', 'Calculate determinant', 'Understand inverse matrices'],
        observationTable: { columns: ['Operation', 'Input', 'Result', 'Verified (Yes/No)'], rows: 5 },
      }
    },
    {
      id: 'm5',
      title: 'Probability — Dice & Coin Simulation',
      description: 'Simulate coin tosses and dice rolls to understand experimental vs theoretical probability.',
      difficulty: 'Easy',
      duration: '20 min',
      category: 'Probability',
      boards: ['Karnataka PUC'],
      standards: ['1st PUC / Class 11'],
      content: {
        aim: 'To simulate random experiments (coin toss, dice roll) and compare experimental probability with theoretical probability.',
        requirements: ['Interactive probability simulator'],
        theory: 'Probability P(E) = Number of favourable outcomes / Total outcomes. For a fair coin: P(H) = P(T) = 0.5. For a fair die: P(any face) = 1/6. The Law of Large Numbers states that as the number of trials increases, the experimental probability approaches the theoretical probability.',
        procedure: [
          'Simulate coin tosses: 10, 50, 100, 1000 times.',
          'Record the number of heads and tails each time.',
          'Calculate experimental probability and compare with 0.5.',
          'Simulate dice rolls and record frequency of each face.',
          'Plot a bar chart of frequencies.',
          'Observe convergence as sample size increases.',
        ],
        objectives: ['Understand experimental probability', 'Observe Law of Large Numbers', 'Visualise probability distributions'],
        observationTable: { columns: ['Trials', 'Heads', 'Tails', 'P(H) experimental', 'P(H) theoretical'], rows: 5 },
      }
    },
    {
      id: 'm6',
      title: 'Conic Sections Explorer',
      description: 'Explore circle, ellipse, parabola, and hyperbola by varying parameters interactively.',
      difficulty: 'Medium',
      duration: '25 min',
      category: 'Coordinate Geometry',
      boards: ['Karnataka PUC'],
      standards: ['1st PUC / Class 11'],
      content: {
        aim: 'To visualise and explore the four conic sections (circle, ellipse, parabola, hyperbola) by varying their parameters.',
        requirements: ['Interactive conic sections simulator'],
        theory: 'Conic sections are curves obtained by intersecting a cone with a plane at different angles. Circle: x² + y² = r². Ellipse: x²/a² + y²/b² = 1 (a > b). Parabola: y² = 4ax. Hyperbola: x²/a² − y²/b² = 1. Eccentricity determines the type: e = 0 (circle), 0 < e < 1 (ellipse), e = 1 (parabola), e > 1 (hyperbola).',
        procedure: [
          'Start with a circle and adjust the radius r.',
          'Switch to an ellipse and adjust semi-major (a) and semi-minor (b) axes.',
          'Observe foci positions and eccentricity.',
          'Switch to a parabola and vary the parameter a.',
          'Observe the directrix, focus, and vertex.',
          'Explore the hyperbola and its asymptotes.',
        ],
        objectives: ['Visualise conic sections', 'Understand eccentricity', 'Relate equation to geometry'],
        observationTable: { columns: ['Conic', 'Equation', 'Eccentricity', 'Focus/Foci', 'Key property'], rows: 4 },
      }
    },
  ]
};
