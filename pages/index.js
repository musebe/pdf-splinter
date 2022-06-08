import { useRef, useState, useEffect } from 'react';

const PDFDocument = require('pdf-lib').PDFDocument;


export default function Home() {
  const [link, setLink] = useState('');
  const [response, setResponse] = useState([]);
  const [processedpages, setProcessedPages] = useState(false)
  const pdfRef = useRef(null);
  const url = 'https://res.cloudinary.com/hackit-africa/image/upload/v1654235775/pdfsample.pdf'
  

  const splitPdf = async (props) => {
    // Load your PDFDocument
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const numberOfPages = pdfDoc.getPages().length;

    for (let i = 0; i < numberOfPages; i++) {
      // Create a new "sub" document
      const subDocument = await PDFDocument.create();
      // copy the page at current index
      const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
      subDocument.addPage(copiedPage);

      const pdfBytes = await subDocument.saveAsBase64({ dataUri: true });
      uploadHandler(pdfBytes)
    }
  }

  const uploadHandler = (file) => {
    // console.log(file)
    try {
      fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ data: file }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
        setProcessedPages(true)
          let tempArray = response;
          tempArray.push(data.data);
          setResponse(tempArray);
		  console.log(response)
        });
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="container">
      <h2>Nextjs PDF splinter</h2>
      <div className="row">
        <div className="column">
          <h2>Sample PDF</h2>
          <object name="bane" width="400px" height="400px" data="https://res.cloudinary.com/hackit-africa/image/upload/v1654235775/pdfsample.pdf"></object><br />
        </div>
        <div className="column">
        {processedpages ? ""
        :
         <button onClick={splitPdf}>Split</button>
        
        }

          {response.map((page,index) => {
           return <a href={page} key={index}><p>separated sample page link</p></a>
          })}
        </div>
      </div>
    </div>
  )
}