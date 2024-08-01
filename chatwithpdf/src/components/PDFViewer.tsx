import React from 'react';

type Props = {
    pdf_url: string;
}

const PDFViewer = ({pdf_url} : Props) => {
    return (
        <iframe className="w-full h-full" src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}>

        </iframe>
    );
};

export default PDFViewer;
