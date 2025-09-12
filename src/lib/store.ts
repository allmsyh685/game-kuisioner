import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SceneSlug = 'scene1' | 'scene2' | 'scene3' | 'scene4' | string;

export interface AnswersByScene {
  [sceneSlug: string]: { [questionId: number]: number };
}

export interface PointsByScene {
  [sceneSlug: string]: number;
}

export interface GameState {
  userName: string;
  userLocation: string;
  userAge: string;
  userInfoSubmitted: boolean;
  answersByScene: AnswersByScene;
  pointsByScene: PointsByScene;

  setUserInfo: (name: string, age: string, location: string) => void;
  setUserInfoSubmitted: (submitted: boolean) => void;
  saveAnswer: (scene: SceneSlug, questionId: number, optionId: number) => void;
  setPoints: (scene: SceneSlug, points: number) => void;
  addPoints: (scene: SceneSlug, delta: number) => void;
  getTotalPoints: () => number;
  clearAll: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      userName: '',
      userLocation: '',
      userAge: '',
      userInfoSubmitted: false,
      answersByScene: {},
      pointsByScene: {},

      setUserInfo: (name, age, location) => set({ userName: name, userAge: age, userLocation: location }),

      setUserInfoSubmitted: (submitted: boolean) => set({ userInfoSubmitted: submitted }),

      saveAnswer: (scene, questionId, optionId) =>
        set(state => ({
          answersByScene: {
            ...state.answersByScene,
            [scene]: {
              ...(state.answersByScene[scene] || {}),
              [questionId]: optionId,
            },
          },
        })),

      setPoints: (scene, points) =>
        set(state => ({
          pointsByScene: {
            ...state.pointsByScene,
            [scene]: points,
          },
        })),

      addPoints: (scene, delta) =>
        set(state => ({
          pointsByScene: {
            ...state.pointsByScene,
            [scene]: (state.pointsByScene[scene] || 0) + delta,
          },
        })),

      getTotalPoints: () => {
        const points = Object.values(get().pointsByScene);
        return points.reduce((sum, p) => sum + (p || 0), 0);
      },

      clearAll: () => set({
        userName: '',
        userLocation: '',
        userAge: '',
        userInfoSubmitted: false,
        answersByScene: {},
        pointsByScene: {},
      }),
    }),
    {
      name: 'gamefix2025-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        userName: state.userName,
        userLocation: state.userLocation,
        userAge: state.userAge,
        userInfoSubmitted: state.userInfoSubmitted,
        answersByScene: state.answersByScene,
        pointsByScene: state.pointsByScene,
      }),
      version: 1,
    },
  ),
);


