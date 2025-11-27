import { CanvasElement } from '../types';

/**
 * Snap a value to the nearest grid point
 */
export function snapToGrid(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap an element's position to the grid
 */
export function snapElementToGrid(
    element: CanvasElement,
    gridSize: number
): CanvasElement {
    return {
        ...element,
        position: {
            x: snapToGrid(element.position.x, gridSize),
            y: snapToGrid(element.position.y, gridSize),
        },
    };
}

/**
 * Check if two elements overlap
 */
export function elementsOverlap(el1: CanvasElement, el2: CanvasElement): boolean {
    return !(
        el1.position.x + el1.size.width < el2.position.x ||
        el2.position.x + el2.size.width < el1.position.x ||
        el1.position.y + el1.size.height < el2.position.y ||
        el2.position.y + el2.size.height < el1.position.y
    );
}

/**
 * Get the bounding box of multiple elements
 */
export function getSelectionBounds(elements: CanvasElement[]): {
    x: number;
    y: number;
    width: number;
    height: number;
} {
    if (elements.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    const minX = Math.min(...elements.map(el => el.position.x));
    const minY = Math.min(...elements.map(el => el.position.y));
    const maxX = Math.max(...elements.map(el => el.position.x + el.size.width));
    const maxY = Math.max(...elements.map(el => el.position.y + el.size.height));

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

/**
 * Generate a unique ID for an element
 */
export function generateElementId(): string {
    return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clone an element with a new ID
 */
export function cloneElement(element: CanvasElement): CanvasElement {
    return {
        ...element,
        id: generateElementId(),
        position: {
            x: element.position.x + 20,
            y: element.position.y + 20,
        },
    };
}

/**
 * Constrain element position within canvas bounds
 */
export function constrainToCanvas(
    element: CanvasElement,
    canvasWidth: number,
    canvasHeight: number
): CanvasElement {
    const x = Math.max(0, Math.min(element.position.x, canvasWidth - element.size.width));
    const y = Math.max(0, Math.min(element.position.y, canvasHeight - element.size.height));

    return {
        ...element,
        position: { x, y },
    };
}

/**
 * Get element at a specific point (for click detection)
 */
export function getElementAtPoint(
    elements: CanvasElement[],
    x: number,
    y: number
): CanvasElement | null {
    // Iterate in reverse order (top to bottom in z-index)
    const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

    for (const element of sortedElements) {
        if (
            x >= element.position.x &&
            x <= element.position.x + element.size.width &&
            y >= element.position.y &&
            y <= element.position.y + element.size.height
        ) {
            return element;
        }
    }

    return null;
}

/**
 * Bring element to front (highest z-index)
 */
export function bringToFront(
    elements: CanvasElement[],
    elementId: string
): CanvasElement[] {
    const maxZIndex = Math.max(...elements.map(el => el.zIndex), 0);
    return elements.map(el =>
        el.id === elementId ? { ...el, zIndex: maxZIndex + 1 } : el
    );
}

/**
 * Send element to back (lowest z-index)
 */
export function sendToBack(
    elements: CanvasElement[],
    elementId: string
): CanvasElement[] {
    const minZIndex = Math.min(...elements.map(el => el.zIndex), 0);
    return elements.map(el =>
        el.id === elementId ? { ...el, zIndex: minZIndex - 1 } : el
    );
}

/**
 * Align elements horizontally
 */
export function alignHorizontal(
    elements: CanvasElement[],
    alignment: 'left' | 'center' | 'right'
): CanvasElement[] {
    if (elements.length === 0) return elements;

    const bounds = getSelectionBounds(elements);

    return elements.map(el => {
        let x = el.position.x;

        switch (alignment) {
            case 'left':
                x = bounds.x;
                break;
            case 'center':
                x = bounds.x + (bounds.width - el.size.width) / 2;
                break;
            case 'right':
                x = bounds.x + bounds.width - el.size.width;
                break;
        }

        return { ...el, position: { ...el.position, x } };
    });
}

/**
 * Align elements vertically
 */
export function alignVertical(
    elements: CanvasElement[],
    alignment: 'top' | 'middle' | 'bottom'
): CanvasElement[] {
    if (elements.length === 0) return elements;

    const bounds = getSelectionBounds(elements);

    return elements.map(el => {
        let y = el.position.y;

        switch (alignment) {
            case 'top':
                y = bounds.y;
                break;
            case 'middle':
                y = bounds.y + (bounds.height - el.size.height) / 2;
                break;
            case 'bottom':
                y = bounds.y + bounds.height - el.size.height;
                break;
        }

        return { ...el, position: { ...el.position, y } };
    });
}

/**
 * Distribute elements horizontally with equal spacing
 */
export function distributeHorizontal(elements: CanvasElement[]): CanvasElement[] {
    if (elements.length < 3) return elements;

    const sorted = [...elements].sort((a, b) => a.position.x - b.position.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalWidth = last.position.x + last.size.width - first.position.x;
    const totalElementWidth = sorted.reduce((sum, el) => sum + el.size.width, 0);
    const spacing = (totalWidth - totalElementWidth) / (sorted.length - 1);

    let currentX = first.position.x;

    return sorted.map((el, index) => {
        if (index === 0 || index === sorted.length - 1) {
            return el;
        }

        currentX += sorted[index - 1].size.width + spacing;
        return { ...el, position: { ...el.position, x: currentX } };
    });
}
