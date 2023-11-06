import { create } from 'zustand'

// Define the state type
type FileStoreState = {
  selectedFile: File[];
};

// Define the actions type
type FileStoreActions = {
  setSelectedFile: (file: File[]) => void;
};

const useFileStore = create<FileStoreState & FileStoreActions>(set => ({
  selectedFile: [],
  setSelectedFile: (file) => set({ selectedFile: file }),
}));

export default useFileStore;
