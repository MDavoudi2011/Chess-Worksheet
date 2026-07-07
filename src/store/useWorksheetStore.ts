import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { WorksheetState, Question, ItemsPerPage } from '../types';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const createEmptyQuestion = (fen: string = INITIAL_FEN): Question => ({
  id: uuidv4(),
  fen,
  turnToMove: fen.split(' ')[1] === 'b' ? 'b' : 'w',
  title: '',
  description: '',
  orientation: 'white',
});

export const useWorksheetStore = create<WorksheetState>((set, get) => {
  const initialQuestion = createEmptyQuestion();
  return {
    questions: [initialQuestion],
    selectedQuestionId: initialQuestion.id,
    worksheetTitle: 'کاربرگ شطرنج بدون عنوان',
    itemsPerPage: 4,

    addQuestion: (fen) => set((state) => {
      const newQuestion = createEmptyQuestion(fen);
      return {
        questions: [...state.questions, newQuestion],
        selectedQuestionId: newQuestion.id,
      };
    }),

    removeQuestion: (id) => set((state) => {
      const filtered = state.questions.filter(q => q.id !== id);
      return {
        questions: filtered,
        selectedQuestionId: state.selectedQuestionId === id ? (filtered.length > 0 ? filtered[0].id : null) : state.selectedQuestionId,
      };
    }),

    updateQuestion: (id, updates) => set((state) => ({
      questions: state.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      )
    })),

    reorderQuestions: (startIndex, endIndex) => set((state) => {
      const result = Array.from(state.questions);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { questions: result };
    }),

    selectQuestion: (id) => set({ selectedQuestionId: id }),

    setWorksheetTitle: (title) => set({ worksheetTitle: title }),
    
    setItemsPerPage: (count) => set({ itemsPerPage: count }),

    importFromJson: (jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        if (data && Array.isArray(data.questions)) {
          set({
            questions: data.questions,
            selectedQuestionId: data.questions.length > 0 ? data.questions[0].id : null,
            worksheetTitle: data.worksheetTitle || 'کاربرگ وارد شده',
            itemsPerPage: data.itemsPerPage || 4,
          });
        }
      } catch (e) {
        console.error('Failed to parse JSON', e);
        throw new Error('فرمت فایل نامعتبر است.');
      }
    },

    exportToJson: () => {
      const state = get();
      const data = {
        questions: state.questions,
        worksheetTitle: state.worksheetTitle,
        itemsPerPage: state.itemsPerPage,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `worksheet-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    clearAll: () => {
      const empty = createEmptyQuestion();
      set({
        questions: [empty],
        selectedQuestionId: empty.id,
        worksheetTitle: 'کاربرگ جدید',
      });
    },
  };
});
