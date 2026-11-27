import { TRANSITION_RULES } from '../domain/transition/return-transition-rules';

export type TransitionAction = keyof typeof TRANSITION_RULES;
export type ReturnAction = TransitionAction | 'create' | 'list' | 'read' | 'readReverseCode' | 'update';
