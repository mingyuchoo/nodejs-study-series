import { useState, forwardRef, useImperativeHandle } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker 설정 - 로컬 파일 사용
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

interface PDFViewerProps {
    file: string | File | null;
    onLoadSuccess?: (numPages: number) => void;
}

export interface PDFViewerRef {
    goToPage: (page: number) => void;
}

const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>(({ file, onLoadSuccess }, ref) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

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
        if (page >= 1 && page <= numPages) {
            setPageNumber(page);
        }
    }

    // ref를 통해 외부에서 접근할 수 있는 메서드 노출
    useImperativeHandle(ref, () => ({
        goToPage
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

            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<div>PDF 로딩 중...</div>}
            >
                <Page
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                />
            </Document>

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
                                if (!isNaN(page)) {
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