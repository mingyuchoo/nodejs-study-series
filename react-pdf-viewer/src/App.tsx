import { useState, useRef } from 'react'
import PDFViewer from './components/PDFViewer'
import './App.css'
import './components/PDFViewer.css'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null)
  const [targetPage, setTargetPage] = useState<number>(1)
  const pdfViewerRef = useRef<{ 
    goToPage: (page: number) => void;
    search: (searchTerm: string) => void;
    clearSearch: () => void;
  }>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      alert('PDF 파일만 선택할 수 있습니다.')
      event.target.value = ''
    }
  }

  const handlePDFLoadSuccess = (numPages: number) => {
    // PDF 로드 완료 시 지정된 페이지로 이동
    if (pdfViewerRef.current && targetPage > 1 && targetPage <= numPages) {
      pdfViewerRef.current.goToPage(targetPage)
    }
  }



  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(event.target.value)
    if (!isNaN(page) && page > 0) {
      setTargetPage(page)
    }
  }

  const loadSamplePDF = () => {
    // Using Mozilla's PDF.js sample PDF which doesn't have CORS restrictions
    setSelectedFile('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
    setTargetPage(1) // Reset to first page when loading new PDF
  }

  return (
    <div className="app">
      <header>
        <h1>PDF 뷰어</h1>
        <p>PDF 문서를 업로드하고 확인하세요</p>
      </header>

      <main>
        <div className="file-upload">
          <label htmlFor="pdf-upload">PDF 파일 선택:</label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
          
          <div className="sample-pdf-section">
            <button 
              onClick={loadSamplePDF}
              className="sample-pdf-button"
            >
              샘플 PDF 로드 (TraceMonkey Paper)
            </button>
          </div>
          
          <div className="page-input-section">
            <label htmlFor="page-input">페이지:</label>
            <input
              id="page-input"
              type="number"
              min="1"
              value={targetPage}
              onChange={handlePageInputChange}
              placeholder="1"
            />
            <span className="page-help-text">PDF 로드 시 이동할 페이지</span>
          </div>

          <div className="page-go-section">
            <button 
              onClick={() => {
                if (pdfViewerRef.current && selectedFile) {
                  pdfViewerRef.current.goToPage(targetPage)
                }
              }}
              disabled={!selectedFile}
              className="page-go-button"
            >
              페이지 이동
            </button>
          </div>
        </div>

        <PDFViewer 
          ref={pdfViewerRef} 
          file={selectedFile} 
          onLoadSuccess={handlePDFLoadSuccess}
        />
      </main>
    </div>
  )
}

export default App
