import { useEffect, useState } from "react";
import { getStudents, deactivateStudent } from "../services/api";
import "../css/StudentsListPage.css";


/**
 * StudentsListPage
 *
 * Retrieves all students from the FastAPI backend and displays
 * them in a grid.
 *
 * When the page first loads, useEffect() calls getStudents().
 * The returned student records are stored in React state and
 * rendered using map().
 */
function StudentsListPage() {

    // ---------------------------------------------------------
    // Student State
    // ---------------------------------------------------------

    // Store the students retrieved from FastAPI.
    // The initial value is an empty array because no students
    // have been retrieved when the component first loads.
    const [students, setStudents] = useState([]);


    // ---------------------------------------------------------
    // Load Students
    // ---------------------------------------------------------

    // Run when the component first loads.
    //
    // The empty dependency array [] means this effect runs
    // once when the component is mounted.
    useEffect(() => {

        /**
         * Retrieve all students from the FastAPI backend.
         */
        const loadStudents = async () => {

            try {

                // Send a GET request to the backend.
                const data = await getStudents();

                // Store the returned students in React state.
                // Updating the state causes React to re-render
                // the page with the student records.
                setStudents(data);

            } catch (error) {

                // Display API errors in the browser console.
                console.error(
                    "Unable to retrieve students:",
                    error
                );
            }
        };

        // Call the asynchronous function.
        loadStudents();

    }, []);

        const handleDeactivate = async (studentId) => {

    try {

        // Send the Student ID to FastAPI.
        const updatedStudent =
            await deactivateStudent(studentId);

        // Update the student in React state.
        setStudents((currentStudents) =>
            currentStudents.map((student) =>
                student.student_id === studentId
                    ? updatedStudent
                    : student
            )
        );

    } catch (error) {

        console.error(
            "Unable to deactivate student:",
            error
        );
    }
};

    // ---------------------------------------------------------
    // Page Layout
    // ---------------------------------------------------------

    return (
        <div className="students-container">

            {/* Student table/grid header */}
            <div className="student-header">
                <strong></strong>
                <strong>Student ID</strong>
                <strong>Active</strong>
                <strong>Last Name</strong>
                <strong>First Name</strong>
                <strong>Email</strong>
                <strong>Phone</strong>
                <strong>Major</strong>
                <strong>Enrollment Date</strong>
                <strong>Created Date</strong>
                <strong>Updated Date</strong>

            </div>


            {/* 
                Loop through the students array and create
                one student-info row for each student.
            */}
            {students.map((student) => (

                <div
                    className="student-info"
                    key={student.id}
                >
                    <button
                        type="button"
                        onClick={() =>
                            handleDeactivate(student.student_id)
                        }
                    >
                        Inactive
                    </button>

                    {/* Unique five-digit Student ID */}
                    <p>{student.student_id}</p>

                    {/* Convert the Boolean status into readable text */}
                    <p className={student.status ? "status-active" : "status-inactive"}>
                        {student.status ? "Active" : "Inactive"}
                    </p>

                    <p>{student.last_name}</p>

                    <p>{student.first_name}</p>

                    <p>{student.email}</p>

                    <p>{student.phone}</p>

                    <p>{student.major}</p>

                    <p>{student.enrollment_date}</p>

                    {/* Display only the date portion of created_at */}
                    <p>
                        {new Date(
                            student.created_at
                        ).toLocaleDateString()}
                    </p>

                    {/* Display only the date portion of updated_at */}
                    <p>
                        {new Date(
                            student.updated_at
                        ).toLocaleDateString()}
                    </p>

                </div>

            ))}

        </div>
    );
}


export default StudentsListPage;