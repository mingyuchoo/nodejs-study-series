import { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import SearchBar from './SearchBar';
import HighlightLayer from './HighlightLayer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './SearchBar.css';

// PDF.js worker 설정 - 로컬 파일 사용
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

interface PDFViewerProps {
    file: string | File | null;
    onLoadSuccess?: (numPages: number) => void;
}

export interface PDFViewerRef {
    goToPage: (page: number) => void;
    search: (searchTerm: string) => void;
    clearSearch: () => void;
}

const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>(({ file, onLoadSuccess }, ref) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [textItems, setTextItems] = useState<any[]>([]);
    const [allMatches, setAllMatches] = useState<any[]>([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
    const [pageTextCache, setPageTextCache] = useState<Map<number, any[]>>(new Map());

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
        setLoading(false);
        setError('');
        // 외부 콜백 호출
        if (onLoadSuccess) {
            onLoadSuccess(numPages);
        }
    }

    function onDocumentLoadError(error: Error) {
        setLoading(false);
        setError(`PDF 로드 실패: ${error.message}`);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function goToPage(page: number) {
        if (numPages > 0 && page >= 1 && page <= numPages) {
            setPageNumber(page);
        }
    }

    const searchAllPages = useCallback(async (term: string) => {
        if (!term || numPages === 0) {
            setAllMatches([]);
            return;
        }

        const matches: any[] = [];
        
        // 모든 페이지에서 검색
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            let pageTextItems = pageTextCache.get(pageNum);
            
            if (!pageTextItems && file) {
                // 페이지 텍스트가 캐시에 없으면 로드
                try {
                    // File 객체를 적절한 형태로 변환
                    const fileSource = file instanceof File ? file : file;
                    const pdfDocument: PDFDocumentProxy = await pdfjs.getDocument(fileSource as any).promise;
                    const page = await pdfDocument.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    pageTextItems = textContent.items as any[];
                    setPageTextCache(prev => new Map(prev).set(pageNum, pageTextItems!));
                } catch (error) {
                    console.error(`Error loading page ${pageNum}:`, error);
                    continue;
                }
            }

            // 페이지에서 매치 찾기 - undefined 체크 추가
            if (pageTextItems) {
                pageTextItems.forEach((item: any, itemIndex: number) => {
                const text = item.str;
                if (!text) return;

                const searchRegex = new RegExp(term, 'gi');
                let match;
                let localMatchIndex = 0;

                while ((match = searchRegex.exec(text)) !== null) {
                    matches.push({
                        pageNumber: pageNum,
                        itemIndex,
                        localMatchIndex,
                        text: match[0],
                        transform: item.transform,
                        width: item.width,
                        height: item.height
                    });
                    localMatchIndex++;
                }
            });
            }
        }

        setAllMatches(matches);
        if (matches.length > 0) {
            // 첫 번째 매치로 이동
            const firstMatch = matches[0];
            if (firstMatch.pageNumber !== pageNumber) {
                goToPage(firstMatch.pageNumber);
            }
        }
    }, [file, numPages, pageTextCache, pageNumber]);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setCurrentMatchIndex(0);
        searchAllPages(term);
    }, [searchAllPages]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        setAllMatches([]);
        setCurrentMatchIndex(0);
    }, []);

    const handlePreviousMatch = useCallback(() => {
        if (allMatches.length > 0) {
            const newIndex = currentMatchIndex > 0 ? currentMatchIndex - 1 : allMatches.length - 1;
            setCurrentMatchIndex(newIndex);
            const match = allMatches[newIndex];
            if (match && match.pageNumber !== pageNumber) {
                goToPage(match.pageNumber);
            }
        }
    }, [allMatches, currentMatchIndex, pageNumber]);

    const handleNextMatch = useCallback(() => {
        if (allMatches.length > 0) {
            const newIndex = currentMatchIndex < allMatches.length - 1 ? currentMatchIndex + 1 : 0;
            setCurrentMatchIndex(newIndex);
            const match = allMatches[newIndex];
            if (match && match.pageNumber !== pageNumber) {
                goToPage(match.pageNumber);
            }
        }
    }, [allMatches, currentMatchIndex, pageNumber]);

    const onPageLoadSuccess = useCallback((page: any) => {
        return page.getTextContent().then((textContent: any) => {
            setTextItems(textContent.items);
            // 현재 페이지 텍스트를 캐시에 저장
            setPageTextCache(prev => new Map(prev).set(pageNumber, textContent.items));
        });
    }, [pageNumber]);

    // ref를 통해 외부에서 접근할 수 있는 메서드 노출
    useImperativeHandle(ref, () => ({
        goToPage,
        search: handleSearch,
        clearSearch: handleClearSearch
    }));

    if (!file) {
        return (
            <div className="pdf-viewer-placeholder">
                <p>PDF 파일을 선택해주세요</p>
            </div>
        );
    }

    return (
        <div className="pdf-viewer">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading-message">
                    PDF 로딩 중...
                </div>
            )}

            {numPages > 0 && (
                <SearchBar
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    currentMatch={currentMatchIndex + 1}
                    totalMatches={allMatches.length}
                    onPrevious={handlePreviousMatch}
                    onNext={handleNextMatch}
                />
            )}

            <div className="pdf-page-container" style={{ position: 'relative' }}>
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<div>PDF 로딩 중...</div>}
                >
                    {numPages > 0 && (
                        <>
                            <Page
                                pageNumber={pageNumber}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                onLoadSuccess={onPageLoadSuccess}
                            />
                            {searchTerm && (
                                <HighlightLayer
                                    searchTerm={searchTerm}
                                    textItems={textItems}
                                    currentMatchIndex={currentMatchIndex}
                                    pageMatches={allMatches}
                                    pageNumber={pageNumber}
                                />
                            )}
                        </>
                    )}
                </Document>
            </div>

            {numPages > 0 && (
                <div className="pdf-controls">
                    <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                    >
                        이전
                    </button>
                    <div className="page-navigation">
                        <input
                            type="number"
                            min="1"
                            max={numPages}
                            value={pageNumber}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (!isNaN(page) && page >= 1 && page <= numPages) {
                                    goToPage(page);
                                }
                            }}
                            className="page-input"
                        />
                        <span className="page-info">/ {numPages}</span>
                    </div>
                    <button
                        type="button"
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
});

PDFViewer.displayName = 'PDFViewer';

export default PDFViewer;