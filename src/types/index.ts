export interface UserInfo {
  name: string;
  cardNumber: string;
  floor: string;
  designation: string;
  createdAt: string;
}

export interface MachineItem {
  bobbin: boolean;
  case: boolean;
  needleCount: 0 | 1 | 2 | 3;
}

export interface MachineRecord {
  id: string;
  lineNo: number;
  machineType: MachineType;
  machineNumber: string;
  recipientName: string;
  recipientCardNumber: string;
  issued: MachineItem;
  deposited: MachineItem;
  status: 'active' | 'closed';
  createdAt: string;
  closedAt?: string;
}

export type MachineType =
  | 'plane-auto'
  | 'plane-manual'
  | 'overlock-4thread'
  | 'overlock-5thread'
  | 'two-needle'
  | 'fadelock'
  | 'kansai'
  | 'fit-of-the-arm'
  | 'signup-button'
  | 'button-hole'
  | 'eyelete-hole'
  | 'barteck'
  | 'chain-stitch'
  | 'blind-stitch';

export const MACHINE_TYPES: MachineType[] = [
  'plane-auto',
  'plane-manual',
  'overlock-4thread',
  'overlock-5thread',
  'two-needle',
  'fadelock',
  'kansai',
  'fit-of-the-arm',
  'signup-button',
  'button-hole',
  'eyelete-hole',
  'barteck',
  'chain-stitch',
  'blind-stitch',
];

export const MACHINE_TYPE_LABELS: Record<MachineType, string> = {
  'plane-auto': 'Plane Machine (Auto)',
  'plane-manual': 'Plane Machine (Manual)',
  'overlock-4thread': 'Overlock (4 Thread)',
  'overlock-5thread': 'Overlock (5 Thread)',
  'two-needle': 'Two Needle',
  'fadelock': 'Fadelock',
  'kansai': 'Kansai',
  'fit-of-the-arm': 'Fit of the Arm',
  'signup-button': 'Signup Button',
  'button-hole': 'Button Hole',
  'eyelete-hole': 'Eyelete Hole',
  'barteck': 'Barteck',
  'chain-stitch': 'Chain Stitch',
  'blind-stitch': 'Blind Stitch',
};

export const LINES = Array.from({ length: 19 }, (_, i) => i + 1);
