import React from 'react';
import type { MenuGroupDescriptor, MenuActionDescriptor, AppBridgeAction, DestructableAction, DisableableAction, LoadableAction, IconableAction } from '../../../../types';
import { BreadcrumbsProps } from '../../../Breadcrumbs';
import { PaginationDescriptor } from '../../../Pagination';
import { TitleProps } from './components';
interface PrimaryAction extends DestructableAction, DisableableAction, LoadableAction, AppBridgeAction, IconableAction {
    /** Provides extra visual weight and identifies the primary action in a set of buttons */
    primary?: boolean;
}
export interface HeaderProps extends TitleProps {
    /** Visually hide the title (stand-alone app use only) */
    titleHidden?: boolean;
    /** Adds a border to the bottom of the page header (stand-alone app use only) */
    separator?: boolean;
    /** Primary page-level action */
    primaryAction?: PrimaryAction | React.ReactNode;
    /** Page-level pagination (stand-alone app use only) */
    pagination?: PaginationDescriptor;
    /** Collection of breadcrumbs */
    breadcrumbs?: BreadcrumbsProps['breadcrumbs'];
    /** Collection of secondary page-level actions */
    secondaryActions?: MenuActionDescriptor[];
    /** Collection of page-level groups of secondary actions */
    actionGroups?: MenuGroupDescriptor[];
    /** Additional navigation markup */
    additionalNavigation?: React.ReactNode;
}
export declare function isPrimaryAction(x: PrimaryAction | React.ReactNode): x is PrimaryAction;
export declare function Header({ title, subtitle, titleMetadata, thumbnail, titleHidden, separator, primaryAction, pagination, additionalNavigation, breadcrumbs, secondaryActions, actionGroups, }: HeaderProps): JSX.Element;
export {};