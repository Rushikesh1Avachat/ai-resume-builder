// import {type FormEvent, useState} from 'react'
// import Navbar from "~/components/Navbar";
// import FileUploader from "~/components/FileUploader";
//
// import {useNavigate} from "react-router";
//
// import {prepareInstructions} from "../../constants";
// import {convertPdfToImage} from "../../lib/pdf2img";
// import {usePuterStore} from "../../lib/puter";
// import {generateUUID} from "../../lib/utils";
//
// const Upload = () => {
//     const { auth, isLoading, fs, ai, kv } = usePuterStore();
//     const navigate = useNavigate();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [statusText, setStatusText] = useState('');
//     const [file, setFile] = useState<File | null>(null);
//
//     const handleFileSelect = (file: File | null) => {
//         setFile(file)
//     }
//
//     const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
//         setIsProcessing(true);
//
//         setStatusText('Uploading the file...');
//         const uploadedFile = await fs.upload([file]);
//         if(!uploadedFile) return setStatusText('Error: Failed to upload file');
//
//         setStatusText('Converting to image...');
//         const imageFile = await convertPdfToImage(file);
//         if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');
//
//         setStatusText('Uploading the image...');
//         const uploadedImage = await fs.upload([imageFile.file]);
//         if(!uploadedImage) return setStatusText('Error: Failed to upload image');
//
//         setStatusText('Preparing data...');
//         const uuid = generateUUID();
//         const data = {
//             id: uuid,
//             resumePath: uploadedFile.path,
//             imagePath: uploadedImage.path,
//             companyName, jobTitle, jobDescription,
//             feedback: '',
//         }
//         await kv.set(`resume:${uuid}`, JSON.stringify(data));
//
//         setStatusText('Analyzing...');
//
//         const feedback = await ai.feedback(
//             uploadedFile.path,
//             //@ts-ignore
//             prepareInstructions({ jobTitle, jobDescription })
//         )
//         if (!feedback) return setStatusText('Error: Failed to analyze resume');
//
//         const feedbackText = typeof feedback.message.content === 'string'
//             ? feedback.message.content
//             : feedback.message.content[0].text;
//
//         data.feedback = JSON.parse(feedbackText);
//         await kv.set(`resume:${uuid}`, JSON.stringify(data));
//         setStatusText('Analysis complete, redirecting...');
//         console.log(data);
//         navigate(`/resume/${uuid}`);
//     }
//
//     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const form = e.currentTarget.closest('form');
//         if(!form) return;
//         const formData = new FormData(form);
//
//         const companyName = formData.get('company-name') as string;
//         const jobTitle = formData.get('job-title') as string;
//         const jobDescription = formData.get('job-description') as string;
//
//         if(!file) return;
//
//         handleAnalyze({ companyName, jobTitle, jobDescription, file });
//     }
//
//     return (
//         <main className="bg-[url('/images/bg-main.svg')] bg-cover">
//             <Navbar />
//
//             <section className="main-section">
//                 <div className="page-heading py-16">
//                     <h1>Smart feedback for your dream job</h1>
//                     {isProcessing ? (
//                         <>
//                             <h2>{statusText}</h2>
//                             <img src="/images/resume-scan.gif" className="w-full" />
//                         </>
//                     ) : (
//                         <h2>Drop your resume for an ATS score and improvement tips</h2>
//                     )}
//                     {!isProcessing && (
//                         <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
//                             <div className="form-div">
//                                 <label htmlFor="company-name">Company Name</label>
//                                 <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
//                             </div>
//                             <div className="form-div">
//                                 <label htmlFor="job-title">Job Title</label>
//                                 <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
//                             </div>
//                             <div className="form-div">
//                                 <label htmlFor="job-description">Job Description</label>
//                                 <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
//                             </div>
//
//                             <div className="form-div">
//                                 <label htmlFor="uploader">Upload Resume</label>
//                                 <FileUploader onFileSelect={handleFileSelect} />
//                             </div>
//
//                             <button className="primary-button" type="submit">
//                                 Analyze Resume
//                             </button>
//                         </form>
//                     )}
//                 </div>
//             </section>
//         </main>
//     )
// }
// export default Upload

import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";

import {useNavigate} from "react-router";

// NOTE: Assuming these imports are available in your environment
import {prepareInstructions} from "../../constants";
import {usePuterStore} from "../../lib/puter";
import {convertPdfToImage} from "../../lib/pdf2img";
import {generateUUID} from "../../lib/utils";

const Upload = () => {
    // FIX: Using the actual hook call with the requested generic type for compatibility.
//@ts-ignore
    const { auth, isLoading, fs, ai, kv } = usePuterStore<any>();

    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);
        setStatusText(''); // Clear previous status

        const handleError = (message: string) => {
            setStatusText(message);
            setIsProcessing(false); // CRITICAL: Stop processing on failure
            return;
        };

        // 1. Upload the file
        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return handleError('Error: Failed to upload file');

        // 2. Convert to image
        setStatusText('Converting to image (Bypassed for testing)...');

        // --- TEMPORARY BYPASS START ---
        // REPLACE THIS BLOCK:
        // const imageFile = await convertPdfToImage(file);
        // if(!imageFile.file) return handleError('Error: Failed to convert PDF to image. Please check your file.');

        // WITH THIS MOCK:
        const mockImageFile = new File([], "mock-image.png", { type: 'image/png' });
        const imageFile = { file: mockImageFile };
        // --- TEMPORARY BYPASS END ---

        // 3. Upload the image
        setStatusText('Uploading the image...');
        // Use the original file path for the image upload (since we bypassed the conversion)
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return handleError('Error: Failed to upload image');

        // 4. Prepare data
        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        console.log('Initial Data for KV:', data);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        // 5. Analyze the resume
        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            //@ts-ignore
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return handleError('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        // 6. Parse Feedback and store
        try {
            data.feedback = JSON.parse(feedbackText);
        } catch (e) {
            console.error("AI Feedback was not valid JSON:", feedbackText, e);
            return handleError('Error: Analysis returned unreadable feedback structure.');
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        // 7. Success and Redirect
        setStatusText('Analysis complete, redirecting...');
        console.log("Analysis complete, redirecting...") // Log the success message

        setIsProcessing(false) // Stop processing just before navigation
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return setStatusText('Please select a resume file.');

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
