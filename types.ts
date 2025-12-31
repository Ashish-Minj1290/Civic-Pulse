
import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  bio?: string;
  credits: number;
  constituency?: string;
  state?: string;
  impactScore: {
    daily: number;
    weekly: number;
  };
  updateStats?: {
    dailyCount: number;
    lastUpdateDate: string;
    lockedUntil: string | null;
  };
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  id: string;
}

export type ComplaintStatus = 'Active' | 'Processing' | 'Resolved' | 'Delayed' | 'Completed' | 'In Progress';
export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface Insight {
  topic: string;
  summary: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

export interface RewardItem {
  id: string;
  title: string;
  type: string;
  cost: number;
  icon: string;
}

export interface CharityNGO {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  website: string;
}

export interface CivicComplaint {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  constituency: string;
  state: string;
  priority: PriorityLevel;
  date: string;
  status: ComplaintStatus;
  photo?: string;
}

export interface PoliticalPromise {
  id: string;
  title: string;
  description: string;
  authority: string;
  party: string;
  date: string;
  targetDate: string;
  status: ComplaintStatus;
  category: string;
  scope: 'Centre' | 'State';
  progress: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
}

export interface PoliticalLeader {
  id: string;
  name: string;
  role: 'MP' | 'MLA';
  party: string;
  constituency: string;
  state: string;
  rating: number;
  ratingCount: number;
  attendance: number;
  bills: number;
  debates: number;
  questions: number;
  sinceYear: number;
  avatar?: string;
  isFollowed?: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  category: string;
  description: string;
  goal: string;
  signatures: number;
  signatureGoal: number;
  startedBy: string;
  date: string;
  isSignedByUser?: boolean;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  category: string;
  totalVotes: number;
  options: PollOption[];
  endsOn: string;
  votedOptionId?: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  // Fix: Added 'Ongoing' to status union to allow infrastructure project tracking and fix type errors in LiveEvents component.
  status: 'Live' | 'Upcoming' | 'Completed' | 'Ongoing';
  date: string;
  time: string;
  views: number;
  highlights: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  participants: number;
}
