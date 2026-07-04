export interface WithdrawalTransaction {
  id: string;
  amount: number;
  method: string;
  country: string;
  status: 'En attente' | 'Approuvé' | 'Rejeté';
  date: string;
}

export interface User {
  name: string;
  email: string;
  balance: number;
  referralCode: string;
  invites: number;
  earningsFromInvites: number;
  hasJoinedWhatsApp: boolean;
  hasClaimedWhatsApp: boolean;
  unlockedAdLevel: number; // starts at 1, max 18
  withdrawalHistory: WithdrawalTransaction[];
}

export type TabType = 'accueil' | 'gagner' | 'top' | 'inviter' | 'retrait';
