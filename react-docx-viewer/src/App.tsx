import { useState, useRef } from 'react'
import { renderAsync } from 'docx-preview'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<number>(0)
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.docx')) {
      setSelectedFile(file)
      setError('')
      setIsDocumentLoaded(false)
      clearSearch()
    } else {
      setError('DOCX 파일을 선택해주세요.')
      setSelectedFile(null)
      setIsDocumentLoaded(false)
      clearSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults(0)
    setCurrentSearchIndex(0)
    clearHighlights()
  }

  const clearHighlights = () => {
    if (!previewRef.current) return

    const highlightedElements = previewRef.current.querySelectorAll('.search-highlight')
    highlightedElements.forEach(element => {
      const parent = element.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(element.textContent || ''), element)
        parent.normalize()
      }
    })
  }

  const highlightSearchTerm = (term: string) => {
    if (!previewRef.current || !term.trim()) {
      clearHighlights()
      setSearchResults(0)
      setCurrentSearchIndex(0)
      return
    }

    clearHighlights()

    const walker = document.createTreeWalker(
      previewRef.current,
      NodeFilter.SHOW_TEXT,
      null
    )

    const textNodes: Text[] = []
    let node: Node | null

    while (node = walker.nextNode()) {
      textNodes.push(node as Text)
    }

    let matchCount = 0
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')

    textNodes.forEach(textNode => {
      const text = textNode.textContent || ''
      if (regex.test(text)) {
        const parent = textNode.parentNode
        if (parent) {
          const highlightedHTML = text.replace(regex, (match) => {
            matchCount++
            return `<span class="search-highlight" data-search-index="${matchCount}">${match}</span>`
          })

          const wrapper = document.createElement('div')
          wrapper.innerHTML = highlightedHTML

          while (wrapper.firstChild) {
            parent.insertBefore(wrapper.firstChild, textNode)
          }
          parent.removeChild(textNode)
        }
      }
    })

    setSearchResults(matchCount)
    setCurrentSearchIndex(matchCount > 0 ? 1 : 0)

    if (matchCount > 0) {
      scrollToSearchResult(1)
    }
  }

  const scrollToSearchResult = (index: number) => {
    if (!previewRef.current) return

    const highlights = previewRef.current.querySelectorAll('.search-highlight')

    // Remove current highlight
    highlights.forEach(el => el.classList.remove('search-current'))

    if (highlights.length > 0 && index > 0 && index <= highlights.length) {
      const targetHighlight = highlights[index - 1] as HTMLElement
      targetHighlight.classList.add('search-current')
      targetHighlight.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      highlightSearchTerm(searchTerm.trim())
    }
  }

  const handleSearchNext = () => {
    if (searchResults > 0) {
      const nextIndex = currentSearchIndex < searchResults ? currentSearchIndex + 1 : 1
      setCurrentSearchIndex(nextIndex)
      scrollToSearchResult(nextIndex)
    }
  }

  const handleSearchPrev = () => {
    if (searchResults > 0) {
      const prevIndex = currentSearchIndex > 1 ? currentSearchIndex - 1 : searchResults
      setCurrentSearchIndex(prevIndex)
      scrollToSearchResult(prevIndex)
    }
  }

  const scrollToPage = (targetPage: number) => {
    if (!previewRef.current) return

    // Try multiple selectors to find page elements
    const pageSelectors = [
      '.docx-wrapper section',
      '.docx-wrapper > div',
      '.docx-wrapper [data-page]',
      '.docx-wrapper .page',
      '.docx-wrapper > *'
    ]

    let pages: NodeListOf<Element> | null = null

    for (const selector of pageSelectors) {
      pages = previewRef.current.querySelectorAll(selector)
      if (pages.length > 0) {
        console.log(`Found ${pages.length} pages using selector: ${selector}`)
        break
      }
    }

    if (pages && pages.length > 0) {
      const targetIndex = Math.min(targetPage - 1, pages.length - 1)
      const targetElement = pages[targetIndex] as HTMLElement

      if (targetElement) {
        // Add a small delay to ensure rendering is complete
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })

          // Highlight the target page briefly
          targetElement.style.border = '2px solid #007bff'
          setTimeout(() => {
            targetElement.style.border = ''
          }, 2000)
        }, 500)

        console.log(`Scrolling to page ${targetPage} (element ${targetIndex})`)
      }
    } else {
      console.log('No page elements found')
      // Fallback: scroll by estimated height
      const estimatedPageHeight = 800 // Approximate page height
      const scrollPosition = (targetPage - 1) * estimatedPageHeight
      previewRef.current.scrollTop = scrollPosition
    }
  }

  const handlePreview = async () => {
    if (!selectedFile || !previewRef.current) return

    setIsLoading(true)
    setError('')
    setIsDocumentLoaded(false)

    try {
      // Clear previous content
      previewRef.current.innerHTML = ''

      // Convert file to ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer()

      // Render the document
      await renderAsync(arrayBuffer, previewRef.current, undefined, {
        className: 'docx-wrapper',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: false,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: false,
        debug: false
      })

      setIsDocumentLoaded(true)

      // Clear previous search results
      clearSearch()

      // Scroll to the specified page after rendering
      if (pageNumber > 1) {
        scrollToPage(pageNumber)
      }

    } catch (err) {
      setError('문서를 렌더링하는 중 오류가 발생했습니다.')
      console.error('Error rendering document:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)

    // If document is already loaded, scroll immediately
    if (isDocumentLoaded && newPage > 0) {
      scrollToPage(newPage)
    }
  }

  return (
    <div className="app">
      <h1>DOCX 파일 뷰어</h1>

      <div className="controls">
        <div className="file-input-group">
          <label htmlFor="file-input">DOCX 파일 선택:</label>
          <input
            id="file-input"
            type="file"
            accept=".docx"
            onChange={handleFileSelect}
          />
        </div>

        <div className="page-input-group">
          <label htmlFor="page-input">페이지 번호:</label>
          <input
            id="page-input"
            type="number"
            min="1"
            value={pageNumber}
            onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
          />
        </div>

        <button
          onClick={handlePreview}
          disabled={!selectedFile || isLoading}
          className="preview-button"
        >
          {isLoading ? '로딩 중...' : '미리보기'}
        </button>

        {isDocumentLoaded && (
          <button
            onClick={() => scrollToPage(pageNumber)}
            className="goto-page-button"
          >
            페이지로 이동
          </button>
        )}
      </div>

      {isDocumentLoaded && (
        <div className="search-controls">
          <div className="search-input-group">
            <label htmlFor="search-input">검색어:</label>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="검색할 단어를 입력하세요"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim()}
            className="search-button"
          >
            검색
          </button>

          {searchResults > 0 && (
            <>
              <div className="search-results">
                {currentSearchIndex} / {searchResults}
              </div>

              <button
                onClick={handleSearchPrev}
                className="search-nav-button"
              >
                이전
              </button>

              <button
                onClick={handleSearchNext}
                className="search-nav-button"
              >
                다음
              </button>

              <button
                onClick={clearSearch}
                className="search-clear-button"
              >
                지우기
              </button>
            </>
          )}
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {selectedFile && (
        <div className="file-info">
          선택된 파일: {selectedFile.name}
        </div>
      )}

      <div
        ref={previewRef}
        className="document-preview"
      />
    </div>
  )
}

export default App
