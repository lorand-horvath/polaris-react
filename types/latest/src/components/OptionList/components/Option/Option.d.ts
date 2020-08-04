import React from 'react';
import type { IconProps } from '../../../../types';
import type { ThumbnailProps } from '../../../Thumbnail';
import type { AvatarProps } from '../../../Avatar';
export interface OptionProps {
    id: string;
    label: React.ReactNode;
    value: string;
    section: number;
    index: number;
    media?: React.ReactElement<IconProps | AvatarProps | ThumbnailProps>;
    disabled?: boolean;
    active?: boolean;
    select?: boolean;
    allowMultiple?: boolean;
    role?: string;
    onClick(section: number, option: number): void;
}
export declare function Option({ label, value, id, select, active, allowMultiple, disabled, role, media, onClick, section, index, }: OptionProps): JSX.Element;