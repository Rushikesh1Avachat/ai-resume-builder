import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { prepareInstructions } from "../../constants";
import { usePuterStore } from "../../lib/puter";
import { convertPdfToImage } from "../../lib/pdf2img";
import { generateUUID } from "../../lib/utils";

export const meta = () => ([
    { title: "Resumind | Review" },
    { name: "description", content: "Upload resume for AI feedback" },
]);

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        try {
            // Check login first
            if (!auth?.isAuthenticated) {
                setStatusText("Please log in to analyze your resume.");
                return;
            }

            setIsProcessing(true);
            setStatusText("Uploading your resume...");

            // --- STEP 1: Upload the PDF file ---
            const uploadedFile = await fs.upload([file]).catch((err: any) => {
                console.error("Upload error:", err);
                return null;
            });
            if (!uploadedFile) throw new Error("File upload failed");

            // --- STEP 2: Convert PDF to image ---
            setStatusText("Converting resume to image...");
            const imageFile = await convertPdfToImage(file);
            if (!imageFile?.file)
                throw new Error(imageFile.error || "PDF-to-image conversion failed");

            // --- STEP 3: Upload image ---
            setStatusText("Uploading preview image...");
            const uploadedImage = await fs.upload([imageFile.file]).catch((err: any) => {
                console.error("Image upload error:", err);
                return null;
            });
            if (!uploadedImage) throw new Error("Image upload failed");

            // --- STEP 4: Save metadata ---
            setStatusText("Saving resume data...");
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: "",
            };
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            // --- STEP 5: Analyze with AI ---
            setStatusText("Analyzing your resume with AI...");

            let feedback;
            try {
                feedback = await ai.feedback(
                    uploadedFile.path,
                    //@ts-ignore
                    prepareInstructions({ jobTitle, jobDescription })
                );
            } catch (aiError: any) {
                console.error("AI feedback error:", aiError);
                if (
                    aiError?.error?.code === "error_400_from_delegate" ||
                    aiError?.error?.message?.includes("Permission denied")
                ) {
                    throw new Error(
                        "Your account doesn’t have access to AI analysis. Please log in with a developer plan or check your Puter AI permissions."
                    );
                }
                throw aiError;
            }

            if (!feedback) throw new Error("No feedback received from AI");

            const feedbackText =
                typeof feedback.message.content === "string"
                    ? feedback.message.content
                    : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete! Redirecting...");
            console.log("✅ Resume analyzed successfully:", data);

            // Redirect to result page
            navigate(`/resume/${uuid}`);
        } catch (err: any) {
            console.error("❌ Error in handleAnalyze:", err);
            setStatusText(err.message || "An unexpected error occurred");
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file) {
            setStatusText("Please upload a resume first.");
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

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
                        <form
                            id="upload-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 mt-8"
                        >
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input
                                    type="text"
                                    name="company-name"
                                    placeholder="Company Name"
                                    id="company-name"
                                    required
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input
                                    type="text"
                                    name="job-title"
                                    placeholder="Job Title"
                                    id="job-title"
                                    required
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea
                                    rows={5}
                                    name="job-description"
                                    placeholder="Job Description"
                                    id="job-description"
                                    required
                                />
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
    );
};

export default Upload;




