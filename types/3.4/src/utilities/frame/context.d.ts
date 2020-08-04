import React from 'react';
import { ToastPropsWithID, ToastID, ContextualSaveBarProps } from './types';
export interface FrameContextType {
    showToast(toast: ToastPropsWithID): void;
    hideToast(toast: ToastID): void;
    setContextualSaveBar(props: ContextualSaveBarProps): void;
    removeContextualSaveBar(): void;
    startLoading(): void;
    stopLoading(): void;
}
export declare const FrameContext: React.Context<FrameContextType | undefined>;