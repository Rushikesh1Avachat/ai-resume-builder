import {Link, useNavigate} from "react-router";


export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {


    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <div  className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </div>
            </nav>

        </main>
    )
}
export default Resume
