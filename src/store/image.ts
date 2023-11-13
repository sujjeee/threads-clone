import create, { SetState } from 'zustand';

type ImageStore = {
    imageUrl: string | undefined;
    setImageUrl: (url: string | undefined) => void;
};

export const useImageStore = create<ImageStore>((set: SetState<ImageStore>) => ({
    imageUrl: '',
    setImageUrl: (url) => set({ imageUrl: url }),
}));