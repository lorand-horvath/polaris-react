/// <reference types="react" />
import type { MenuGroupDescriptor } from '../../../../types';
export interface MenuGroupProps extends MenuGroupDescriptor {
    /** Visually hidden menu description for screen readers */
    accessibilityLabel?: string;
    /** Whether or not the menu is open */
    active?: boolean;
    /** Callback for opening the MenuGroup by title */
    onOpen(title: string): void;
    /** Callback for closing the MenuGroup by title */
    onClose(title: string): void;
}
export declare function MenuGroup({ accessibilityLabel, active, actions, details, title, icon, onClose, onOpen, }: MenuGroupProps): JSX.Element | null;