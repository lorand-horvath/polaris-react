import React from 'react';
import { ComplexAction } from '../../types';
export interface EmptyStateProps {
    /** The empty state heading */
    heading?: string;
    /** The path to the image to display */
    image: string;
    /** The path to the image to display on large screens */
    largeImage?: string;
    /**
     * Whether or not to limit the image to the size of its container on large screens.
     */
    imageContained?: boolean;
    /** Whether or not the content should span the full width of its container  */
    fullWidth?: boolean;
    /** Whether or not the layout is stacked and centered vs justified apart */
    centeredLayout?: boolean;
    /** Elements to display inside empty state */
    children?: React.ReactNode;
    /** Primary action for empty state */
    action?: ComplexAction;
    /** Secondary action for empty state */
    secondaryAction?: ComplexAction;
    /** Secondary elements to display below empty state actions */
    footerContent?: React.ReactNode;
}
export declare function EmptyState({ children, heading, image, largeImage, imageContained, centeredLayout, fullWidth, action, secondaryAction, footerContent, }: EmptyStateProps): JSX.Element;