'use client'

import { CheckCircle2, Upload } from 'lucide-react';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useUser } from "@clerk/nextjs";

const FileUploadComponent = () => {
    const { user } = useUser();
    const emailId = user?.emailAddresses[0]?.emailAddress
    
    const handleFileUploadButtonClick = () => {
        const el = document.createElement('input');
        el.setAttribute('type', 'file');
        el.setAttribute('accept', 'application/pdf');
        el.setAttribute('multiple', 'false');
        el.addEventListener('change', (ev) => {
            if(el.files && el.files.length > 0) {
                const file = el.files.item(0);

                if(file) {
                    const formData = new FormData();
                    formData.append('pdf', file);
                    formData.append('emailId', emailId);

                    fetch('https://pdf-chatbot-server.onrender.com/upload/pdf', {
                        method: 'POST',
                        body: formData
                    })
                }
            }

            setTimeout(() => {
                setUploadSuccess(true);
            }, 500)
            setTimeout(() => {
                setUploadSuccess(false);
            }, 3000);
        })
        el.click();
    }

    const [uploadSuccess, setUploadSuccess] = React.useState(false);

    return (
        <div className='w-screen min-h-[500] flex flex-col items-center justify-center gap-4'>
            <div className='bg-slate-900 text-white flex items-center justify-center shadow-lg rounded-lg p-4 border-1 border-white
             cursor-pointer transition-transform duration-200 hover:scale-100 hover:bg-slate-800 rounded-lg p-4'>
                <div
                 onClick={handleFileUploadButtonClick}
                 className='flex flex-col items-center justify-center'
                >
                    <h3>Upload a PDF</h3>
                    <Upload />
                </div>
            </div>
            {uploadSuccess && (
                <div className="duration-300 ease-in-out">
                    <Alert>
                        <CheckCircle2 />
                        <AlertTitle>Success! File Uploaded</AlertTitle>
                        <AlertDescription>Your file has been uploaded.</AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    )
}

export default FileUploadComponent;