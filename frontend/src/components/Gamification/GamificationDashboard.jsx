import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function GamificationDashboard() {
  const [patientData, setPatientData] = useState({
    level: 1,
    experience: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    badges: [],
    activeQuests: [],
    completedQuests: [],
    statistics: {
      totalAppointments: 0,
      onTimeAppointments: 0,
      medicationAdherence: 0,
      exerciseDays: 0,
      healthyMeals: 0,
      waterIntake: 0,
      sleepHours: 0
    },
    leaderboard: {
      rank: 0,
      category: 'overall'
    }
  });
  
  const [achievements, setAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  const [quests, setQuests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    fetchPatientData();
    fetchAchievements();
    fetchBadges();
    fetchQuests();
    fetchLeaderboard();
  }, []);

  const fetchPatientData = async () => {
    try {
      // Mock data for demonstration
      const mockData = {
        level: 15,
        experience: 2450,
        totalPoints: 12500,
        currentStreak: 7,
        longestStreak: 21,
        achievements: [
          { achievementId: 'ACH001', earnedDate: new Date(), progress: 100 },
          { achievementId: 'ACH002', earnedDate: new Date(), progress: 100 },
          { achievementId: 'ACH003', earnedDate: new Date(), progress: 75 }
        ],
        badges: [
          { badgeId: 'BADGE001', earnedDate: new Date() },
          { badgeId: 'BADGE002', earnedDate: new Date() },
          { badgeId: 'BADGE003', earnedDate: new Date() }
        ],
        activeQuests: [
          { questId: 'QUEST001', startDate: new Date(), progress: { steps: 5, target: 10 } },
          { questId: 'QUEST002', startDate: new Date(), progress: { water: 6, target: 8 } }
        ],
        completedQuests: [
          { questId: 'QUEST003', completedDate: new Date(), rewards: { points: 100, badges: ['BADGE001'] } }
        ],
        statistics: {
          totalAppointments: 25,
          onTimeAppointments: 22,
          medicationAdherence: 95,
          exerciseDays: 18,
          healthyMeals: 45,
          waterIntake: 6.5,
          sleepHours: 7.2
        },
        leaderboard: {
          rank: 3,
          category: 'overall'
        }
      };
      setPatientData(mockData);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      // Mock achievements data
      const mockAchievements = [
        {
          achievementId: 'ACH001',
          name: 'First Steps',
          description: 'Complete your first appointment',
          category: 'appointment',
          icon: '👶',
          points: 50,
          rarity: 'common',
          requirements: { appointments: 1 }
        },
        {
          achievementId: 'ACH002',
          name: 'Medication Master',
          description: 'Take medications on time for 7 days straight',
          category: 'medication',
          icon: '💊',
          points: 100,
          rarity: 'uncommon',
          requirements: { medicationStreak: 7 }
        },
        {
          achievementId: 'ACH003',
          name: 'Health Warrior',
          description: 'Exercise for 30 days in a month',
          category: 'exercise',
          icon: '💪',
          points: 200,
          rarity: 'rare',
          requirements: { exerciseDays: 30 }
        },
        {
          achievementId: 'ACH004',
          name: 'Perfect Attendance',
          description: 'Attend all appointments on time for a month',
          category: 'appointment',
          icon: '⭐',
          points: 300,
          rarity: 'epic',
          requirements: { perfectMonth: 1 }
        },
        {
          achievementId: 'ACH005',
          name: 'Legendary Patient',
          description: 'Reach level 50',
          category: 'wellness',
          icon: '👑',
          points: 500,
          rarity: 'legendary',
          requirements: { level: 50 }
        }
      ];
      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      // Mock badges data
      const mockBadges = [
        {
          badgeId: 'BADGE001',
          name: 'Early Bird',
          description: 'Complete morning health tasks',
          image: '🌅',
          category: 'milestone',
          rarity: 'bronze',
          points: 25
        },
        {
          badgeId: 'BADGE002',
          name: 'Streak Master',
          description: 'Maintain a 30-day streak',
          image: '🔥',
          category: 'streak',
          rarity: 'gold',
          points: 150
        },
        {
          badgeId: 'BADGE003',
          name: 'Community Helper',
          description: 'Help other patients',
          image: '🤝',
          category: 'community',
          rarity: 'silver',
          points: 75
        }
      ];
      setBadges(mockBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchQuests = async () => {
    try {
      // Mock quests data
      const mockQuests = [
        {
          questId: 'QUEST001',
          title: 'Daily Steps Challenge',
          description: 'Walk 10,000 steps today',
          category: 'daily',
          objectives: [
            { description: 'Walk 10,000 steps', target: 10000, current: 5000, unit: 'steps', completed: false }
          ],
          rewards: { points: 50, badges: ['BADGE001'] },
          difficulty: 'easy'
        },
        {
          questId: 'QUEST002',
          title: 'Hydration Hero',
          description: 'Drink 8 glasses of water today',
          category: 'daily',
          objectives: [
            { description: 'Drink 8 glasses of water', target: 8, current: 6, unit: 'glasses', completed: false }
          ],
          rewards: { points: 30, badges: [] },
          difficulty: 'easy'
        },
        {
          questId: 'QUEST003',
          title: 'Weekly Wellness',
          description: 'Complete all health tasks for a week',
          category: 'weekly',
          objectives: [
            { description: 'Exercise 5 days', target: 5, current: 3, unit: 'days', completed: false },
            { description: 'Eat healthy meals', target: 14, current: 8, unit: 'meals', completed: false },
            { description: 'Take medications on time', target: 7, current: 7, unit: 'days', completed: true }
          ],
          rewards: { points: 200, badges: ['BADGE002'] },
          difficulty: 'medium'
        }
      ];
      setQuests(mockQuests);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Mock leaderboard data
      const mockLeaderboard = [
        { rank: 1, patientName: 'Alice Johnson', score: 25000, badge: '👑' },
        { rank: 2, patientName: 'Bob Smith', score: 22000, badge: '🥈' },
        { rank: 3, patientName: 'You', score: 12500, badge: '🥉' },
        { rank: 4, patientName: 'Carol Davis', score: 11000, badge: '⭐' },
        { rank: 5, patientName: 'David Wilson', score: 9500, badge: '⭐' }
      ];
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      case 'bronze': return 'text-orange-600 bg-orange-100';
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'platinum': return 'text-indigo-600 bg-indigo-100';
      case 'diamond': return 'text-cyan-600 bg-cyan-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateLevelProgress = () => {
    const currentLevelExp = patientData.level * 1000;
    const nextLevelExp = (patientData.level + 1) * 1000;
    const progress = ((patientData.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const startQuest = (quest) => {
    setSelectedQuest(quest);
    setShowQuestModal(true);
  };

  const completeQuest = (questId) => {
    Swal.fire('Success', 'Quest completed! You earned rewards!', 'success');
    setShowQuestModal(false);
    // Here you would update the quest status
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">🎮 Gamification Dashboard</h1>
            <p className="text-purple-100">Level up your health journey with fun challenges!</p>
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {patientData.level}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Level {patientData.level}</h2>
                <p className="text-gray-600">{patientData.totalPoints.toLocaleString()} points</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{patientData.currentStreak} days</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to Level {patientData.level + 1}</span>
              <span>{Math.round(calculateLevelProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${calculateLevelProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {['overview', 'achievements', 'badges', 'quests', 'leaderboard'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{patientData.statistics.totalAppointments}</div>
                    <div className="text-sm text-blue-800">Total Appointments</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{patientData.statistics.medicationAdherence}%</div>
                    <div className="text-sm text-green-800">Medication Adherence</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{patientData.statistics.exerciseDays}</div>
                    <div className="text-sm text-purple-800">Exercise Days</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{patientData.statistics.healthyMeals}</div>
                    <div className="text-sm text-orange-800">Healthy Meals</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Recent Achievements</h3>
                    <div className="space-y-2">
                      {patientData.achievements.slice(0, 3).map((achievement, index) => {
                        const ach = achievements.find(a => a.achievementId === achievement.achievementId);
                        return ach ? (
                          <div key={index} className="flex items-center space-x-3">
                            <span className="text-2xl">{ach.icon}</span>
                            <div>
                              <div className="font-medium text-gray-800">{ach.name}</div>
                              <div className="text-sm text-gray-600">{ach.description}</div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Active Quests</h3>
                    <div className="space-y-2">
                      {patientData.activeQuests.slice(0, 2).map((quest, index) => {
                        const q = quests.find(qu => qu.questId === quest.questId);
                        return q ? (
                          <div key={index} className="p-2 bg-white rounded border">
                            <div className="font-medium text-gray-800">{q.title}</div>
                            <div className="text-sm text-gray-600">{q.description}</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(achievement => {
                  const earned = patientData.achievements.find(a => a.achievementId === achievement.achievementId);
                  return (
                    <div
                      key={achievement.achievementId}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        earned ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-3xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium text-purple-600">{achievement.points} pts</span>
                            {earned && (
                              <span className="text-green-600 text-sm font-medium">✓ Earned</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map(badge => {
                  const earned = patientData.badges.find(b => b.badgeId === badge.badgeId);
                  return (
                    <div
                      key={badge.badgeId}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{badge.image}</div>
                        <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                            {badge.rarity}
                          </span>
                        </div>
                        {earned && (
                          <div className="mt-2 text-green-600 text-sm font-medium">✓ Earned</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quests Tab */}
            {activeTab === 'quests' && (
              <div className="space-y-4">
                {quests.map(quest => {
                  const active = patientData.activeQuests.find(q => q.questId === quest.questId);
                  const completed = patientData.completedQuests.find(q => q.questId === quest.questId);
                  
                  return (
                    <div
                      key={quest.questId}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        completed ? 'border-green-300 bg-green-50' : 
                        active ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-800">{quest.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                              {quest.difficulty}
                            </span>
                            {completed && <span className="text-green-600 text-sm font-medium">✓ Completed</span>}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                          
                          <div className="space-y-2">
                            {quest.objectives.map((objective, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">{objective.description}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${(objective.current / objective.target) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    {objective.current}/{objective.target} {objective.unit}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-sm text-purple-600 font-medium">
                              Reward: {quest.rewards.points} pts
                            </div>
                            {!completed && !active && (
                              <button
                                onClick={() => startQuest(quest)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                              >
                                Start Quest
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">🏆 Overall Leaderboard</h3>
                  <p className="text-gray-600">Compete with other patients and climb the ranks!</p>
                </div>
                
                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        player.patientName === 'You' 
                          ? 'border-purple-300 bg-purple-50' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{player.badge}</div>
                          <div>
                            <div className="font-semibold text-gray-800">{player.patientName}</div>
                            <div className="text-sm text-gray-600">Rank #{player.rank}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{player.score.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quest Modal */}
        {showQuestModal && selectedQuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedQuest.title}</h2>
                  <button
                    onClick={() => setShowQuestModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">{selectedQuest.description}</p>
                
                <div className="space-y-3 mb-6">
                  {selectedQuest.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{objective.description}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(objective.current / objective.target) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {objective.current}/{objective.target} {objective.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowQuestModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => completeQuest(selectedQuest.questId)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Complete Quest
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamificationDashboard;

