export type ChessColor = 'w' | 'b';

export interface Question {
  id: string;
  fen: string;
  turnToMove: ChessColor;
  title: string;
  description: string;
  orientation: 'white' | 'black';
}

export type ItemsPerPage = 1 | 2 | 4 | 6;

export interface WorksheetState {
  questions: Question[];
  selectedQuestionId: string | null;
  worksheetTitle: string;
  itemsPerPage: ItemsPerPage;
  addQuestion: (fen?: string) => void;
  removeQuestion: (id: string) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  selectQuestion: (id: string | null) => void;
  setWorksheetTitle: (title: string) => void;
  setItemsPerPage: (count: ItemsPerPage) => void;
  importFromJson: (data: string) => void;
  exportToJson: () => void;
  clearAll: () => void;
}
