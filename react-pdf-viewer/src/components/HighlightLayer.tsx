import { useEffect, useRef } from 'react';

interface HighlightLayerProps {
    searchTerm: string;
    textItems: any[];
    currentMatchIndex: number;
    pageMatches: any[];
    pageNumber: number;
}

const HighlightLayer = ({
    searchTerm,
    textItems,
    currentMatchIndex,
    pageMatches,
    pageNumber
}: HighlightLayerProps) => {
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!layerRef.current || !searchTerm || !textItems.length) {
            return;
        }

        const layer = layerRef.current;

        // 기존 하이라이트 제거
        layer.innerHTML = '';

        textItems.forEach((item, itemIndex) => {
            const text = item.str;
            if (!text) return;

            const searchRegex = new RegExp(searchTerm, 'gi');
            let match;
            let lastIndex = 0;
            const spans: string[] = [];
            let matchCount = 0;

            while ((match = searchRegex.exec(text)) !== null) {
                // 매치 전 텍스트
                if (match.index > lastIndex) {
                    spans.push(text.slice(lastIndex, match.index));
                }

                // 현재 매치가 전체 매치에서 몇 번째인지 찾기
                const globalMatchIndex = pageMatches.findIndex(m =>
                    m.pageNumber === pageNumber &&
                    m.itemIndex === itemIndex &&
                    m.localMatchIndex === matchCount
                );

                const isCurrentMatch = globalMatchIndex === currentMatchIndex;
                const highlightClass = isCurrentMatch ? 'highlight-current' : 'highlight';
                spans.push(`<span class="${highlightClass}">${match[0]}</span>`);

                lastIndex = match.index + match[0].length;
                matchCount++;
            }

            // 매치 후 남은 텍스트
            if (lastIndex < text.length) {
                spans.push(text.slice(lastIndex));
            }

            if (spans.length > 1) { // spans에 하이라이트가 포함된 경우만
                const div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.left = `${item.transform[4]}px`;
                div.style.top = `${item.transform[5]}px`;
                div.style.fontSize = `${Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1])}px`;
                div.style.fontFamily = item.fontName || 'sans-serif';
                div.style.transform = `scaleX(${item.transform[0] / Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1])})`;
                div.innerHTML = spans.join('');
                layer.appendChild(div);
            }
        });
    }, [searchTerm, textItems, currentMatchIndex, pageMatches, pageNumber]);

    return (
        <div
            ref={layerRef}
            className="highlight-layer"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 2
            }}
        />
    );
};

export default HighlightLayer;