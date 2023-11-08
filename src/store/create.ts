import { create } from 'zustand';

interface ToggleState {
    openCreateDialog: boolean;
    setOpenCreateDialog: (open: boolean) => void;
}

const useCreate = create<ToggleState>((set) => ({
    openCreateDialog: false,
    setOpenCreateDialog: (open) => set({ openCreateDialog: open }),
}));

export default useCreate;
