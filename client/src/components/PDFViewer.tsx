interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

const PDFViewer = ({ pdfUrl, title }: PDFViewerProps) => {
  return (
    <div className="relative w-full bg-card rounded-xl overflow-hidden shadow-elevated">
      <div className="bg-secondary/20 p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{title || 'Novel'}</h3>
      </div>
      
      {/* Try multiple embed strategies for maximum compatibility */}
      <object data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`} type="application/pdf" className="w-full h-[80vh]">
        <embed src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`} type="application/pdf" className="w-full h-[80vh]" />
        <iframe src={pdfUrl} title={title || 'PDF'} className="w-full h-[80vh]" />
        <div className="p-6 text-center text-muted-foreground">
          <p>No preview available. <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary">Open PDF</a></p>
        </div>
      </object>
      
      <div className="p-4 bg-secondary/10 border-t border-border">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
        >
          <span>Open in new tab</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;