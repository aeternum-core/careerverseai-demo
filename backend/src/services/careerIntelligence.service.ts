import crypto from 'crypto';
import { CareerTwinRepository, ICareerTwin, ISkillProficiency, ICareerFitScore, IRiskAlert, IDailyMission } from '../models/careerTwin.model';
import { StudentProfileRepository, CareerAssessmentRepository } from '../models';

export class CareerIntelligenceService {
  /**
   * Default baseline twin initialization
   */
  static getDefaultTwin(userId: string, name = 'Cadet Voyager'): ICareerTwin {
    const passportToken = 'CTWIN-' + crypto.createHash('sha256').update(userId + Date.now()).digest('hex').substring(0, 12).toUpperCase();

    return {
      userId,
      studentName: name,
      targetCareer: 'Machine Learning Engineer',
      orientation: {
        technology: 88,
        research: 72,
        entrepreneurship: 64,
        management: 52,
        design: 48
      },
      skills: [
        { name: 'Python', selfReported: 82, verified: 68, category: 'Engineering' },
        { name: 'Machine Learning', selfReported: 74, verified: 60, category: 'AI & Data' },
        { name: 'SQL & Data Modeling', selfReported: 78, verified: 65, category: 'Database' },
        { name: 'System Design', selfReported: 60, verified: 45, category: 'Architecture' },
        { name: 'Cloud & MLOps', selfReported: 45, verified: 25, category: 'DevOps' },
        { name: 'Communication & Pitch', selfReported: 70, verified: 55, category: 'Soft Skills' }
      ],
      behavior: {
        analyticalThinking: 89,
        riskManagement: 78,
        qualityOrientation: 84,
        leadership: 66,
        adaptability: 76
      },
      experience: {
        projectsCount: 3,
        internshipsCount: 1,
        simulationsCount: 4
      },
      readiness: {
        current: 72,
        target: 90,
        knowledge: 81,
        skills: 69,
        experience: 56
      },
      careerFit: [
        {
          role: 'Machine Learning Engineer',
          score: 86,
          evidence: [
            'Strong analytical reasoning (89%)',
            'Python (68% verified) & ML modeling core competencies',
            'Completed 3 end-to-end applied deep learning projects',
            'High research and technological career orientation (88%)'
          ],
          skillGaps: ['Cloud & MLOps (Deployment pipelines)', 'Docker & Kubernetes Orchestration'],
          expGaps: ['Production enterprise model serving experience'],
          actionableBoosts: [
            { action: 'Complete MLOps & Model Serving Module', boost: 5, impactType: 'skill' },
            { action: 'Deploy an inference API microservice on Cloud', boost: 4, impactType: 'project' },
            { action: 'Complete 1 Applied AI Industry Internship', boost: 7, impactType: 'internship' }
          ]
        },
        {
          role: 'Data Scientist',
          score: 82,
          evidence: [
            'Solid SQL & statistical data exploration skills (78%)',
            'Analytical problem decomposition matches predictive modeling',
            'Strong hypothesis testing interest'
          ],
          skillGaps: ['Advanced A/B Testing & Causal Inference', 'Big Data Streaming (Spark)'],
          expGaps: ['Large-scale commercial data warehouse optimization'],
          actionableBoosts: [
            { action: 'Complete Advanced Statistical Inference Challenge', boost: 4, impactType: 'skill' },
            { action: 'Build Kaggle Predictive Analytics Notebook', boost: 5, impactType: 'project' }
          ]
        },
        {
          role: 'Product Analyst',
          score: 74,
          evidence: [
            'Balanced communication and cross-functional empathy',
            'Strong analytical thinking and data-informed decision making',
            'SQL proficiency allows rapid KPI extraction'
          ],
          skillGaps: ['Product Sense & User Cohort Analytics', 'GTM Experimentation Design'],
          expGaps: ['Direct product management / feature launch ownership'],
          actionableBoosts: [
            { action: 'Complete Product Metrics Case Study', boost: 4, impactType: 'skill' }
          ]
        }
      ],
      riskAlerts: [
        {
          id: 'risk-mlops',
          title: 'Deployment & MLOps Gap',
          message: 'Your ML algorithms are strong, but cloud deployment is currently below target requirements for 2026 hiring benchmarks.',
          severity: 'high',
          fixAction: 'Launch MLOps Roadmap',
          fixRoute: '/dashboard/roadmap'
        }
      ],
      dailyMission: {
        id: 'mission-sql-joins',
        title: 'Master SQL Complex Joins & Window Functions',
        task: 'Spend 15 minutes optimizing multi-table relational aggregations to boost database proficiency.',
        xpReward: 50,
        skillTarget: 'SQL & Data Modeling',
        delta: 3,
        completed: false
      },
      passportToken
    };
  }

  /**
   * Fetch or create the active Career Twin
   */
  static async getCareerTwin(userId: string): Promise<ICareerTwin> {
    let twin = await CareerTwinRepository.findOne({ userId });

    if (!twin) {
      // Check if student profile exists to pull actual name
      const profile = await StudentProfileRepository.findOne({ userId });
      const name = profile?.fullName || 'Cadet Voyager';
      twin = this.getDefaultTwin(userId, name);
      await CareerTwinRepository.create(twin);
    }

    return twin;
  }

  /**
   * Set target career and recalculate Twin
   */
  static async updateTargetCareer(userId: string, targetCareer: string): Promise<ICareerTwin> {
    let twin = await this.getCareerTwin(userId);
    twin.targetCareer = targetCareer;
    twin = this.recalculateTwin(twin);
    await CareerTwinRepository.findOneAndUpdate({ userId }, twin);
    return twin;
  }

  /**
   * Behavioral Simulation Decision Engine
   */
  static async processSimulationDecision(
    userId: string,
    scenario: {
      id: string;
      title: string;
      choice: 'A' | 'B' | 'C';
      choiceText: string;
      latencySeconds: number;
    }
  ): Promise<{
    twin: ICareerTwin;
    feedbackMessage: string;
    behaviorDeltas: Record<string, number>;
  }> {
    let twin = await this.getCareerTwin(userId);

    const behaviorDeltas: Record<string, number> = {
      analyticalThinking: 0,
      riskManagement: 0,
      qualityOrientation: 0,
      leadership: 0,
      adaptability: 0
    };

    let feedbackMessage = '';

    // Analyze decision patterns
    if (scenario.choice === 'C') {
      // Root-cause / deep investigation
      behaviorDeltas.analyticalThinking = +2;
      behaviorDeltas.qualityOrientation = +2;
      behaviorDeltas.riskManagement = +1;
      feedbackMessage = `Your choice prioritizes root-cause analysis over band-aid patches. +2% Analytical Thinking, +2% Quality Orientation.`;
    } else if (scenario.choice === 'B') {
      // Risk-averse / rollback / caution
      behaviorDeltas.riskManagement = +3;
      behaviorDeltas.adaptability = +1;
      feedbackMessage = `Your choice reflects rigorous risk mitigation under operational pressure. +3% Risk Management.`;
    } else {
      // Decisive / rapid action
      behaviorDeltas.leadership = +2;
      behaviorDeltas.adaptability = +2;
      feedbackMessage = `Your choice prioritizes rapid operational continuity and leadership decisiveness. +2% Leadership, +2% Adaptability.`;
    }

    // Apply latency factor: decisions under 20s show high confidence
    if (scenario.latencySeconds < 20) {
      behaviorDeltas.adaptability = Math.min(100, (behaviorDeltas.adaptability || 0) + 1);
    }

    // Apply deltas to twin
    twin.behavior.analyticalThinking = Math.min(99, Math.max(20, twin.behavior.analyticalThinking + behaviorDeltas.analyticalThinking));
    twin.behavior.riskManagement = Math.min(99, Math.max(20, twin.behavior.riskManagement + behaviorDeltas.riskManagement));
    twin.behavior.qualityOrientation = Math.min(99, Math.max(20, twin.behavior.qualityOrientation + behaviorDeltas.qualityOrientation));
    twin.behavior.leadership = Math.min(99, Math.max(20, twin.behavior.leadership + behaviorDeltas.leadership));
    twin.behavior.adaptability = Math.min(99, Math.max(20, twin.behavior.adaptability + behaviorDeltas.adaptability));

    twin.experience.simulationsCount += 1;
    twin.lastBehavioralUpdate = new Date();

    // Re-evaluate Twin
    twin = this.recalculateTwin(twin);
    await CareerTwinRepository.findOneAndUpdate({ userId }, twin);

    return { twin, feedbackMessage, behaviorDeltas };
  }

  /**
   * Recalculates Career Fit, CRI (Career Readiness Index) and Risk Alerts
   */
  static recalculateTwin(twin: ICareerTwin): ICareerTwin {
    // 1. Calculate weighted average of skills (giving verified skills 1.5x weight)
    const skillScores = twin.skills.map(s => (s.selfReported * 0.4 + s.verified * 0.6));
    const avgSkillScore = Math.round(skillScores.reduce((a, b) => a + b, 0) / (skillScores.length || 1));

    // 2. Calculate Knowledge (from academic & orientation)
    const avgOrientation = Math.round(
      (twin.orientation.technology + twin.orientation.research + twin.orientation.entrepreneurship) / 3
    );

    // 3. Experience score (projects + internships + simulations)
    const expScore = Math.min(
      95,
      twin.experience.projectsCount * 12 +
      twin.experience.internshipsCount * 22 +
      twin.experience.simulationsCount * 3
    );

    // 4. Overall Readiness Index (CRI)
    const overallCRI = Math.round((avgOrientation * 0.25) + (avgSkillScore * 0.45) + (expScore * 0.30));

    twin.readiness = {
      current: Math.min(98, overallCRI),
      target: 90,
      knowledge: avgOrientation,
      skills: avgSkillScore,
      experience: expScore
    };

    // 5. Update Target Career Fit
    const targetFit = twin.careerFit.find(c => c.role.toLowerCase() === twin.targetCareer.toLowerCase());
    if (targetFit) {
      targetFit.score = Math.min(96, Math.round(overallCRI * 1.08));
    }

    // 6. Dynamic Risk Alert Evaluation
    const cloudSkill = twin.skills.find(s => s.name.toLowerCase().includes('cloud') || s.name.toLowerCase().includes('mlops'));
    if (cloudSkill && cloudSkill.verified < 40 && twin.targetCareer.toLowerCase().includes('learning')) {
      twin.riskAlerts = [{
        id: 'risk-mlops-alert',
        title: 'Deployment & MLOps Competency Risk',
        message: 'Your foundational algorithms are high-performing, but model serving & CI/CD pipeline skills are lagging behind target benchmarks.',
        severity: 'high',
        fixAction: 'Accelerate MLOps Track',
        fixRoute: '/dashboard/roadmap'
      }];
    } else {
      twin.riskAlerts = [];
    }

    return twin;
  }

  /**
   * What-If Career Trajectory Simulator
   */
  static simulateWhatIf(
    twin: ICareerTwin,
    mods: {
      cgpaDelta?: number;
      projectsDelta?: number;
      internshipsDelta?: number;
      verifiedSkillDelta?: number;
    }
  ) {
    const baseCRI = twin.readiness.current;
    const projDelta = mods.projectsDelta || 0;
    const internDelta = mods.internshipsDelta || 0;
    const skillDelta = mods.verifiedSkillDelta || 0;

    // Projected calculations
    const immediateProjected = Math.min(98, Math.round(baseCRI + projDelta * 3.5 + internDelta * 6.5 + skillDelta * 0.35));
    const sixMonthsProjected = Math.min(99, Math.round(immediateProjected * 1.08));
    const oneYearProjected = Math.min(100, Math.round(immediateProjected * 1.18));
    const threeYearsProjected = Math.min(100, Math.round(immediateProjected * 1.32));

    // Career unlocks based on new potential
    const unlocks = [];
    if (immediateProjected >= 75) unlocks.push('Junior AI / Data Analyst');
    if (immediateProjected >= 85) unlocks.push('Associate Machine Learning Engineer');
    if (immediateProjected >= 92) unlocks.push('Senior Autonomous Systems Architect');

    return {
      currentReadiness: baseCRI,
      projectedReadiness: immediateProjected,
      trajectory: {
        today: baseCRI,
        sixMonths: sixMonthsProjected,
        oneYear: oneYearProjected,
        threeYears: threeYearsProjected
      },
      unlockedCareers: unlocks,
      deltaGain: immediateProjected - baseCRI
    };
  }

  /**
   * Complete Daily Career Mission
   */
  static async completeMission(userId: string): Promise<ICareerTwin> {
    let twin = await this.getCareerTwin(userId);

    if (!twin.dailyMission.completed) {
      twin.dailyMission.completed = true;

      // Boost target skill
      const targetSkill = twin.skills.find(s => s.name === twin.dailyMission.skillTarget);
      if (targetSkill) {
        targetSkill.selfReported = Math.min(100, targetSkill.selfReported + twin.dailyMission.delta);
        targetSkill.verified = Math.min(100, targetSkill.verified + Math.round(twin.dailyMission.delta * 0.7));
      }

      // Add profile XP
      const profile = await StudentProfileRepository.findOne({ userId });
      if (profile) {
        profile.xp = (profile.xp || 0) + twin.dailyMission.xpReward;
        profile.streak = (profile.streak || 1) + 1;
        await StudentProfileRepository.findOneAndUpdate({ userId }, profile);
      }

      twin = this.recalculateTwin(twin);
      await CareerTwinRepository.findOneAndUpdate({ userId }, twin);
    }

    return twin;
  }

  /**
   * Verify Skill through interactive challenge
   */
  static async verifySkill(userId: string, skillName: string, score: number): Promise<ICareerTwin> {
    let twin = await this.getCareerTwin(userId);

    const skill = twin.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (skill) {
      skill.verified = Math.min(100, Math.max(skill.verified, score));
      twin = this.recalculateTwin(twin);
      await CareerTwinRepository.findOneAndUpdate({ userId }, twin);
    }

    return twin;
  }
}
