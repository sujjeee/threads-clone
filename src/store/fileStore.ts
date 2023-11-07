import { create } from 'zustand';

// Define the state type
type FileStoreState = {
  selectedFile: File[];
  isSelectedImageSafe: boolean;
};

// Define the actions type
type FileStoreActions = {
  setIsSelectedImageSafe: (isSafe: boolean) => void;
  setSelectedFile: (file: File[]) => void;
};

const useFileStore = create<FileStoreState & FileStoreActions>((set) => ({
  selectedFile: [],
  isSelectedImageSafe: true,
  setSelectedFile: (files) => set({ selectedFile: files }),
  setIsSelectedImageSafe: (isSafe) => set({ isSelectedImageSafe: isSafe }),
}));

export default useFileStore;
