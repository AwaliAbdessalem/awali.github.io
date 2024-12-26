        // Function to embed PDFs dynamically
        function embedPDFShortcodes() {
            // Find all elements with the class 'pdf-embed'
            const pdfEmbeds = document.querySelectorAll('.pdf-embed');
            
            pdfEmbeds.forEach(container => {
                const pdfUrl = container.getAttribute('data-pdf-url'); // Get the URL from the data attribute
                if (pdfUrl) {
                    // Create an <embed> element for the PDF
                    container.innerHTML = `
                        <embed src="${pdfUrl}" width="100%" height="600" type="application/pdf">
                    `;
                } else {
                    console.error('PDF URL not provided for a container!');
                }
            });
        }

        // Call the function to process all shortcodes
        embedPDFShortcodes()
