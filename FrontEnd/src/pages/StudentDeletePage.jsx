import { useState } from "react";
import { deleteStudent } from "../services/api"; 
import "../css/StudentDeletePage.css";


/**
 * StudentsDeletePage
 *
 * Displays a form that allows the user to delete a student
 * by entering the student's unique Student ID.
 *
 * The Student ID is stored in React state. When the form is
 * submitted, the deleteStudent() API function sends a DELETE
 * request to the FastAPI backend.
 */
function StudentDeletePage() {

    // Store the Student ID entered by the user.
    // The initial value is an empty string.
    const [studentId, setStudentId] = useState("");
    const [message, setMessage] = useState("");

    /**
     * Update studentId state whenever the user types
     * into the Student ID input field.
     */
    const handleChange = (event) => {
        setStudentId(event.target.value);
    };


    /**
     * Handle the Delete Student form submission.
     *
     * Prevents the browser's default form submission,
     * sends the Student ID to the API, and clears the
     * input field after the request completes.
     */
    const handleSubmit = async (event) => {

    // Prevent the browser from refreshing the page.
    event.preventDefault();

    try {

        // Send the Student ID to the API for deletion.
        const data = await deleteStudent(studentId);

        // Display the success message returned by FastAPI.
        setMessage(data.message);

        // Clear the Student ID input after successful deletion.
        setStudentId("");

    } catch (error) {

        // Display the error message returned by FastAPI.
        setMessage(error.message);

        console.error("Unable to delete student:", error);
    }
    };


    return (
        <div className="delete-student">

            {/* Page title */}
            <h2>Delete Student</h2>
            <br />

            {/* 
                When the form is submitted, React calls
                the handleSubmit function.
            */}
            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    {/* Label associated with the Student ID input */}
                    <label htmlFor="student_id">
                        Student ID:
                    </label>

                    <input
                        type="text"
                        id="student_id"
                        name="student_id"

                        // Controlled input:
                        // its value comes from React state.
                        value={studentId}

                        // Update state whenever the user types.
                        onChange={handleChange}

                        // Prevent submission when the field is empty.
                        required
                    />

                </div>

                {/* Submit the form and trigger handleSubmit */}
                <button className="delete-student button" type="submit">
                    Delete Student
                </button>

            </form>

            {message && (
                <p className="delete-message">
                    {message}
                </p>
            )}

        </div>
    );
}


export default StudentDeletePage;