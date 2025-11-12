import React from "react";

interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestions?: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions = [] }) => {
    // Determine background gradient based on score
    const gradientClass =
        score > 69
            ? "from-green-100"
            : score > 49
                ? "from-yellow-100"
                : "from-red-100";

    // Determine icon based on score
    const iconSrc =
        score > 69
            ? "/icons/ats-good.svg"
            : score > 49
                ? "/icons/ats-warning.svg"
                : "/icons/ats-bad.svg";

    // Determine subtitle based on score
    const subtitle =
        score > 69
            ? "Great Job!"
            : score > 49
                ? "Good Start"
                : "Needs Improvement";

    // Determine color tone
    const textColor =
        score > 69
            ? "text-green-700"
            : score > 49
                ? "text-yellow-700"
                : "text-red-700";

    return (
        <div
            className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full max-w-2xl mx-auto p-6 sm:p-8 transition-all duration-500`}
        >
            {/* Top section with icon and headline */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={iconSrc}
                    alt="ATS Score Icon"
                    className="w-12 h-12 animate-fade-in"
                />
                <div>
                    <h2 className={`text-2xl font-bold ${textColor}`}>
                        ATS Score - {score}/100
                    </h2>
                </div>
            </div>

            {/* Description section */}
            <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
                    {subtitle}
                </h3>
                <p className="text-gray-600 mb-4">
                    This score represents how well your resume is likely to perform in
                    Applicant Tracking Systems used by employers.
                </p>

                {/* Suggestions list */}
                {suggestions.length > 0 ? (
                    <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <img
                                    src={
                                        suggestion.type === "good"
                                            ? "/icons/check.svg"
                                            : "/icons/warning.svg"
                                    }
                                    alt={
                                        suggestion.type === "good" ? "Positive" : "Needs Work"
                                    }
                                    className="w-5 h-5 mt-1"
                                />
                                <p
                                    className={
                                        suggestion.type === "good"
                                            ? "text-green-700"
                                            : "text-amber-700"
                                    }
                                >
                                    {suggestion.tip}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">
                        No detailed feedback available for this resume.
                    </p>
                )}
            </div>

            {/* Closing encouragement */}
            <p className="text-gray-700 italic">
                Keep refining your resume to improve your chances of getting past ATS
                filters and into the hands of recruiters.
            </p>
        </div>
    );
};

export default ATS;
