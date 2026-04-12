import React from 'react';
import { FlaskConical } from 'lucide-react';

// Lazy-load all 2D lab simulations
const VernierCalipersLab = React.lazy(() => import('./labs/VernierCalipersLab'));
const PendulumLab = React.lazy(() => import('./labs/PendulumLab'));
const ScrewGaugeLab = React.lazy(() => import('./labs/ScrewGaugeLab'));
const OhmsLawLab = React.lazy(() => import('./labs/OhmsLawLab'));
const ConcaveMirrorLab = React.lazy(() => import('./labs/ConcaveMirrorLab'));
const ConvexLensLab = React.lazy(() => import('./labs/ConvexLensLab'));
const PrismLab = React.lazy(() => import('./labs/PrismLab'));
const SonometerLab = React.lazy(() => import('./labs/SonometerLab'));
const MetreBridgeLab = React.lazy(() => import('./labs/MetreBridgeLab'));
const PotentiometerLab = React.lazy(() => import('./labs/PotentiometerLab'));
const ZenerDiodeLab = React.lazy(() => import('./labs/ZenerDiodeLab'));
const HookesLawLab = React.lazy(() => import('./labs/HookesLawLab'));
// Chemistry
const TitrationLab = React.lazy(() => import('./labs/TitrationLab'));
const KMnO4TitrationLab = React.lazy(() => import('./labs/KMnO4TitrationLab'));
const PHLabSimulation = React.lazy(() => import('./labs/PHLabSimulation'));
const SaltAnalysisLab = React.lazy(() => import('./labs/SaltAnalysisLab'));
const ChromatographyLab = React.lazy(() => import('./labs/ChromatographyLab'));
const ThermochemistryLab = React.lazy(() => import('./labs/ThermochemistryLab'));
const RateOfReactionLab = React.lazy(() => import('./labs/RateOfReactionLab'));
const CationAnalysisLab = React.lazy(() => import('./labs/CationAnalysisLab'));
const AnionAnalysisLab = React.lazy(() => import('./labs/AnionAnalysisLab'));
const PotashAlumLab = React.lazy(() => import('./labs/PotashAlumLab'));
// Biology
const MitosisLab = React.lazy(() => import('./labs/MitosisLab'));
const StomataLab = React.lazy(() => import('./labs/StomataLab'));
const OsmosisLab = React.lazy(() => import('./labs/OsmosisLab'));
const PhotosynthesisLab = React.lazy(() => import('./labs/PhotosynthesisLab'));
const DNAIsolationLab = React.lazy(() => import('./labs/DNAIsolationLab'));
const BenedictsTestLab = React.lazy(() => import('./labs/BenedictsTestLab'));
const BloodGroupLab = React.lazy(() => import('./labs/BloodGroupLab'));
const SeedGerminationLab = React.lazy(() => import('./labs/SeedGerminationLab'));
// Math
const UnitCircleLab = React.lazy(() => import('./labs/UnitCircleLab'));
const BinomialTheoremLab = React.lazy(() => import('./labs/BinomialTheoremLab'));
const StatisticsLab = React.lazy(() => import('./labs/StatisticsLab'));
const MatrixLab = React.lazy(() => import('./labs/MatrixLab'));
const ProbabilityLab = React.lazy(() => import('./labs/ProbabilityLab'));
const ConicSectionsLab = React.lazy(() => import('./labs/ConicSectionsLab'));
// CS
const BubbleSortLab = React.lazy(() => import('./labs/BubbleSortLab'));
const InsertionSortLab = React.lazy(() => import('./labs/InsertionSortLab'));
const BinarySearchLab = React.lazy(() => import('./labs/BinarySearchLab'));
const StackLab = React.lazy(() => import('./labs/StackLab'));
const QueueLab = React.lazy(() => import('./labs/QueueLab'));
const LogicGatesLab = React.lazy(() => import('./labs/LogicGatesLab'));

// Registry map
const LAB_REGISTRY: Record<string, React.LazyExoticComponent<React.FC>> = {
  p1: VernierCalipersLab, p2: PendulumLab, p3: ScrewGaugeLab, p4: OhmsLawLab,
  p5: ConcaveMirrorLab, p6: ConvexLensLab, p7: PrismLab, p8: SonometerLab,
  p9: MetreBridgeLab, p10: PotentiometerLab, p11: ZenerDiodeLab, p12: HookesLawLab,
  c1: TitrationLab, c2: KMnO4TitrationLab, c3: PHLabSimulation, c4: SaltAnalysisLab,
  c5: ChromatographyLab, c6: ThermochemistryLab, c7: RateOfReactionLab, c8: CationAnalysisLab,
  c9: AnionAnalysisLab, c10: PotashAlumLab,
  b1: MitosisLab, b2: StomataLab, b3: OsmosisLab, b4: PhotosynthesisLab,
  b5: DNAIsolationLab, b6: BenedictsTestLab, b7: BloodGroupLab, b8: SeedGerminationLab,
  m1: UnitCircleLab, m2: BinomialTheoremLab, m3: StatisticsLab, m4: MatrixLab,
  m5: ProbabilityLab, m6: ConicSectionsLab,
  cs1: BubbleSortLab, cs2: InsertionSortLab, cs3: BinarySearchLab, cs4: StackLab,
  cs5: QueueLab, cs6: LogicGatesLab,
};

interface SimulationStageProps {
  labId: string;
  hex: string;
}

const SimulationStage: React.FC<SimulationStageProps> = ({ labId, hex }) => {
  const LabComponent = LAB_REGISTRY[labId];

  if (!LabComponent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl p-12 text-center">
        <FlaskConical size={64} className="text-slate-700 mb-6" />
        <h3 className="text-xl font-bold text-white mb-2">Simulation Coming Soon</h3>
        <p className="text-slate-400 text-sm max-w-md">
          The interactive simulation for this experiment is being developed. Meanwhile, refer to the Theory and Procedure tabs for a detailed understanding.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900/30 rounded-2xl overflow-hidden border border-white/5">
      <React.Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
          </div>
        }
      >
        <LabComponent />
      </React.Suspense>
    </div>
  );
};

export default SimulationStage;
