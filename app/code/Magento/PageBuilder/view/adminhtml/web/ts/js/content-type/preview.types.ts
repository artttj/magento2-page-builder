/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "../content-type-config.types";
import ContentTypeInterface from "../content-type.types";
import ObservableObject from "./observable-updater.types";

export interface PreviewInterface {
    parent: ContentTypeInterface;
    config: ContentTypeConfigInterface;
    data: ObservableObject;
    displayLabel: KnockoutObservable<string>;
    display: KnockoutObservable<boolean>;
    wrapperElement: Element;
    placeholderCss: KnockoutObservable<object>;
    isPlaceholderVisible: KnockoutObservable<boolean>;
    isEmpty: KnockoutObservable<boolean>;
    /**
     * @deprecated
     */
    previewData: {[key: string]: any};
}
