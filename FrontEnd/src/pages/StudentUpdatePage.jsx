import { useState } from "react";
import { getStudent, updateStudent  } from "../services/api"; 
import "../css/StudentUpdatePage.css";


function StudentUpdatePage() {
    // Store the Student ID entered by the user.
    const [studentId, setStudentId] = useState("");

    // Store the student returned by FastAPI.
    const [student, setStudent] = useState(null);

    // Store success or error messages.
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        setStudentId(event.target.value);
         
    };

    /**
     * Search for a student using their Student ID.
     */
    const handleSubmit = async (event) => {

        // Prevent the browser from refreshing the page.
        event.preventDefault();

        try {

            // Retrieve the student from FastAPI.
            const data = await getStudent(studentId);

            // Store the returned student in React state.
            setStudent(data);

            // Clear any previous error message.
            setMessage("");
            // setStudentId("")

        } catch (error) {

            // Clear any previously loaded student.
            setStudent(null);

            // Display the error message returned by FastAPI.
            setMessage(error.message);

            console.error(
                "Unable to find student:",
                error
            );
        }
    };

    const handleClear = () => {

        // Clear the Student ID input.
        setStudentId("");

        // Clear the retrieved student information.
        setStudent(null);

        // Clear any success or error messages.
        setMessage("");
    };

    const handleUpdate = (event)  => {

        // Extract the input's name and current value.
        const { name, value } = event.target;

        // By default, use the value exactly as entered.
        let newValue = value;

        if (name === "status") {
            newValue = value === "true";
        }

        setStudent({
            ...student,
            [name]: newValue
        });
    };



    const handleSubmitUpdate = async (event) => {

    // Prevent the form from refreshing the page.
    event.preventDefault();

    

    try {

        // Send the updated student information to FastAPI.
        const data = await updateStudent(
            studentId,
            student
        );

        console.log("Student updated:", data);

        // Store the updated student returned by FastAPI.
        setStudent(data);

        // Display a success message.
        setMessage(
            `Student ID ${studentId} updated successfully.`
        );

        setStudentId("");
        setStudent(null);

    } catch (error) {

        // Display the error returned by FastAPI.
        setMessage(error.message);

        console.error(
            "Unable to update student:",
            error
        );
    }
};

    return (
        <div className="update-student">

            {/* Page title */}
            <h2>Find Student</h2>
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

                <div> 
                    <button className="update-student button" type="submit">
                        Find Student Information
                    </button>

                    <button
                        className="update-student-button"
                        type="button"
                        onClick={handleClear}
                    >
                        Clear Student ID
                    </button>
                </div>  
            </form>

            {student && (
                
                <div className="add-student">
                    <form onSubmit={handleSubmitUpdate}>
                        <div className="form-group">
                            <label htmlFor="first_name">
                                First Name:
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={student.first_name}
                                onChange={handleUpdate}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">
                                Last Name:
                            </label>

                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={student.last_name}
                                onChange={handleUpdate}
                                required
                            />
                        </div>


                        {/* ------------------------------------------------
                            Email
                        ------------------------------------------------ */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email:
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={student.email}
                                onChange={handleUpdate}
                                required
                            />

                        </div>


                        {/* ------------------------------------------------
                            Phone
                        ------------------------------------------------ */}

                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone:
                            </label>

                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={student.phone}
                                onChange={handleUpdate}
                                required
                            />

                        </div>

                        <div className="form-group">

                    <label htmlFor="major">
                        Major:
                    </label>

                    <select
                        id="major"
                        name="major"
                        value={student.major}
                        onChange={handleUpdate}
                        required
                    >
                        <option value="">
                            Select a Major
                        </option>

                        <option value="Computer Science">
                            Computer Science
                        </option>

                        <option value="Information Technology">
                            Information Technology
                        </option>

                        <option value="Business">
                            Business
                        </option>

                        <option value="Engineering">
                            Engineering
                        </option>

                        <option value="Mathematics">
                            Mathematics
                        </option>
                    </select>

                </div>

                <div className="form-group">
                    <label htmlFor="status">
                        Active:
                    </label>

                    <select
                        id="status"
                        name="status"
                        value={student.status.toString()}
                        onChange={handleUpdate}
                        required
                    >
                        <option value="true">
                            Active
                        </option>

                        <option value="false">
                            Inactive
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="last_name">
                        Enrollment Date:
                    </label>

                    <input
                        type="date"
                        id="enrollment_date"
                        name="enrollment_date"
                        value={student.enrollment_date}
                        onChange={handleUpdate}
                        required
                    />
                </div>


                <div>
                    <button className="update-student button" type="submit">
                        Update Student
                    </button>
                </div>




                    </form>
                </div>
            )}

        </div>
    );

}

export default StudentUpdatePage;
