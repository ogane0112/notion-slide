'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Download, Maximize, Minimize } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import html2canvas from 'html2canvas'
import pptxgen from 'pptxgenjs'
import { jsPDF } from 'jspdf'

interface Slide {
  content: string
}

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${className}`}
  >
    {children}
  </button>
)

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Close</button>
      </div>
    </div>
  );
};

export default function NotionSlides({ pageId = '' }: { pageId?: string }) {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<'pptx' | 'pdf' | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`/api/slides?pageId=${pageId}`)
        const data = await response.json()
        setSlides(data.slides)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching slides:', error)
        setLoading(false)
      }
    }

    fetchSlides()
  }, [pageId])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextSlide()
      } else if (event.key === 'ArrowLeft') {
        prevSlide()
      } else if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullScreen])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const captureSlide = async () => {
    if (slideRef.current) {
      const canvas = await html2canvas(slideRef.current)
      return canvas.toDataURL('image/png')
    }
    return null
  }

  const downloadPPTX = async () => {
    const pptx = new pptxgen()
    for (let i = 0; i < slides.length; i++) {
      setCurrentSlide(i)
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for render
      const dataUrl = await captureSlide()
      if (dataUrl) {
        const slide = pptx.addSlide()
        slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' })
      }
    }
    pptx.writeFile({ fileName: 'notion-slides.pptx' })
  }

  const downloadPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1600, 1200]
    })

    for (let i = 0; i < slides.length; i++) {
      setCurrentSlide(i)
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for render
      const dataUrl = await captureSlide()
      if (dataUrl) {
        if (i > 0) pdf.addPage()
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1600, 1200)
      }
    }

    pdf.save('notion-slides.pdf')
  }

  const handleDownload = () => {
    setIsFormatModalOpen(true)
  }

  const handleFormatSelect = (format: 'pptx' | 'pdf') => {
    setSelectedFormat(format)
    setIsFormatModalOpen(false)
    setIsConfirmModalOpen(true)
  }

  const handleConfirmDownload = async () => {
    setIsConfirmModalOpen(false)
    if (selectedFormat === 'pptx') {
      await downloadPPTX()
    } else if (selectedFormat === 'pdf') {
      await downloadPDF()
    }
    setIsCompleteModalOpen(true)
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-notion-text">Loading...</div>
  }

  if (slides.length === 0) {
    return <div className="flex items-center justify-center h-screen text-notion-text">No slides available</div>
  }

  const isTitleSlide = currentSlide === 0

  return (
    <div className={`bg-notion-bg ${isFullScreen ? 'fixed inset-0 z-50' : 'min-h-screen'} flex flex-col items-center justify-center p-4`}>
      <div 
        ref={slideRef}
        className={`${isFullScreen ? 'w-full h-full' : 'w-full max-w-4xl'} bg-white shadow-lg rounded-lg overflow-hidden`} 
        style={{ aspectRatio: isFullScreen ? 'auto' : '4/3' }}
      >
        <div className={`h-full flex flex-col p-8 animate-fade-in overflow-auto 
            ${isTitleSlide ? 'justify-center items-center text-center' : ''}`}>
          <ReactMarkdown 
            className={`prose prose-lg max-w-none 
              ${isTitleSlide ? (isFullScreen ? 'text-7xl' : 'text-4xl') : ''} font-bold`}
            components={{
              img: ({ node, ...props }) => (
                <img {...props} style={{ maxWidth: '100%', height: 'auto' }} />
              ),
            }}
          >
            {slides[currentSlide].content}
          </ReactMarkdown>
        </div>
      </div>
      {!isFullScreen && (
        <div className="mt-6 flex justify-between w-full max-w-4xl">
          <Button
            onClick={prevSlide}
            className="bg-notion-bg-hover text-notion-text hover:bg-notion-accent hover:text-white"
          >
            <ArrowLeft className="inline-block mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleDownload}
            className="bg-notion-bg-hover text-notion-text hover:bg-notion-accent hover:text-white"
          >
            <Download className="inline-block mr-2 h-4 w-4" /> Download
          </Button>
          <Button
            onClick={toggleFullScreen}
            className="bg-notion-bg-hover text-notion-text hover:bg-notion-accent hover:text-white"
          >
            <Maximize className="inline-block mr-2 h-4 w-4" /> Present
          </Button>
          <Button
            onClick={nextSlide}
            className="bg-notion-bg-hover text-notion-text hover:bg-notion-accent hover:text-white"
          >
            Next <ArrowRight className="inline-block ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      {!isFullScreen && (
        <div className="mt-4 text-notion-text-light">
          {isTitleSlide ? 'Title Slide' : `Slide ${currentSlide} of ${slides.length - 1}`}
        </div>
      )}
      {isFullScreen && (
        <div className="fixed bottom-4 right-4 flex space-x-4">
          <Button
            onClick={prevSlide}
            className="bg-notion-bg-hover text-notion-text hover:bg-notion-accent hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={toggleFullScreen}
            className="bg-notion-bg-hover text-notion-text hover:bg-notion-accent hover:text-white"
          >
            <Minimize className="h-6 w-6" />
          </Button>
          <Button
            onClick={nextSlide}
            className="bg-notion-bg-hover text-notion-text hover:bg-notion-accent hover:text-white"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      )}

      <Modal isOpen={isFormatModalOpen} onClose={() => setIsFormatModalOpen(false)}>
        <h2 className="text-xl mb-4">Select download format</h2>
        <div className="space-x-4">
          <button onClick={() => handleFormatSelect('pptx')} className="px-4 py-2 bg-blue-500 text-white rounded-md">PowerPoint</button>
          <button onClick={() => handleFormatSelect('pdf')} className="px-4 py-2 bg-red-500 text-white rounded-md">PDF</button>
        </div>
      </Modal>

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <h2 className="text-xl mb-4">Confirm Download</h2>
        <p>Are you sure you want to download the slides as {selectedFormat === 'pptx' ? 'PowerPoint' : 'PDF'}?</p>
        <div className="mt-4 space-x-4">
          <button onClick={handleConfirmDownload} className="px-4 py-2 bg-green-500 text-white rounded-md">Yes, Download</button>
          <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={isCompleteModalOpen} onClose={() => setIsCompleteModalOpen(false)}>
        <h2 className="text-xl mb-4">Download Complete</h2>
        <p>Your slides have been successfully downloaded as {selectedFormat === 'pptx' ? 'PowerPoint' : 'PDF'}.</p>
      </Modal>
    </div>
  )
}

