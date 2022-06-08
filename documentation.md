### Next js  pdf splinter


## Introduction

If you only need part of a long PDF, you can easily split it into individual chapters, separate pages, or remove them. That way, you're free to mark up, save, or send only what you need. If you only need part of that long PDF, you can easily split it into individual chapters, separate pages, or remove them. Here we demonstrate how Nextjs can be used to spread or separate a single pdf document into different PDF files.

## Codesandbox

Check the sandbox demo on  [Codesandbox](/).

<CodeSandbox
title="mergevideos"
id=" "
/>

You can also get the project github repo using [Github](/).

## Prerequisites

Entry-level javascript and React/Nextjs knowledge.

## Setting Up the Sample Project

In your respective folder, create a new nextjs app using `npx create-next-app pdfsplinter` in your terminal.
Head to your project root directory `cd pdfsplinter`
 

Nextjs has its own serverside rendering backend which we will use for our media files upload. We will begin by setting up [Cloudinary](https://cloudinary.com/?ap=em)  for our backend. 
Start by creating your own Cloudinary account using [Link](https://cloudinary.com/console) and log into it. Each Cloudinary user account will have a dashboard containing the environment variable keys necessary for the Cloudinary integration in our project.

In your project directory, start by including Cloudinary in your project dependencies `npm install cloudinary`
 create a new file named `.env` and paste the following code. Fill the blanks with your environment variables from the Cloudinary dashboard.

```
CLOUDINARY_CLOUD_NAME =

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET =
```

Restart your project: `npm run dev`.

In the `pages/api` folder, create a new file named `upload.js`. 
Start by configuring the environment keys and libraries.

```
var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

Create a handler function to execute the POST request. The function will receive media file data and post it to the Cloudinary website. It then captures the media file's Cloudinary link and sends it back as a response.

```
export default async function handler(req, res) {
    if (req.method === "POST") {
        let url = ""
        try {
            let fileStr = req.body.data;
            const uploadedResponse = await cloudinary.uploader.upload_large(
                fileStr,
                {
                    resource_type: "video",
                    chunk_size: 6000000,
                }
            );
            url = uploadedResponse.url
        } catch (error) {
            res.status(500).json({ error: "Something wrong" });
        }

        res.status(200).json({data: url});
    }
}
```

 

The code above concludes our backend.

To achieve the pdf split. We will require a js library known as  [pdf-lib](https://pdf-lib.js.org). Install it through your terminal using `npm install pdf-lib`.

In the home component, include the necessary imports 


```
"pages/index"


import { useRef, useState, useEffect } from 'react';

const PDFDocument = require('pdf-lib').PDFDocument;
```

Inside the home function, start by pasting the following 

```

export default function Home() {
  const [link, setLink] = useState('');
  const [response, setResponse] = useState([]);
  const [processedpages, setProcessedPages] = useState(false)
  const pdfRef = useRef(null);
  const url = 'https://res.cloudinary.com/hackit-africa/image/upload/v1654235775/pdfsample.pdf'
  
return(
    <></>
)
```

We will use the state hooks above as we move on. The `url` variable contains the original sample pdf for our project. Create a function `splitPdf` like below. The function will use the `pdf-doc` library to load the pdf variable and use a for loop to loop the pdf file pages and separate each page into a base64 string and pass it to another function `uploadHandler` which will be used to upload the pages to the backend.
```
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
```

Use the following function in your return statement. The css files can be located in the Github repo

```
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
```
The code will display the original pdf file and provide links for each page once the split command is fired. The UI should look like the below:

![complete UI](https://res.cloudinary.com/dogjmmett/image/upload/v1654504012/UI_y8621s.png "complete UI")

Thats it! Ensure to go through the article to complete the experience.